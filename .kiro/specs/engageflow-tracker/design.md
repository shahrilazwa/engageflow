# Design Document: EngageFlow Tracker

## Overview

EngageFlow is a web application for tracking projects, tasks, actions, deadlines, and progress. It provides a structured, visual alternative to manual spreadsheet tracking and supports a **project-first, single-user-first** workflow.

The core v1 model is:

```text
User → Project → Custom Project Workflow → Tasks → Workflow Stages / Actions / Documents / Progress
```

A user can create multiple Projects, build a custom Workflow for each Project, create Tasks inside each Project, and monitor progress through visual workflow stages. Collaboration through Project members is a lower-priority extension and must not block the first MVP.

There is no separate Special Project track in v1. If a user needs to track a different stream of work, they should create another Project. Flexibility inside a Project is handled through custom workflow stages and mandatory/optional stage settings.

The system is built as a **modular monolith** for v1. Module boundaries are clear enough to keep the codebase organised, but the app remains one Laravel application. There are no microservices in v1.

## Key Design Goals

- Let one user create and manage multiple Projects independently.
- Let each Project have its own custom Workflow built by the user.
- Let Workflow stages be marked mandatory or optional to support flexible streams.
- Let Tasks inside a Project inherit their stage structure from the Project Workflow.
- Track task progress, target completion, delayed status, follow-up actions, document links, and history.
- Keep Project data strictly scoped to the owning user in the first MVP.
- Keep collaboration/project membership as a later extension.
- Keep the Workflow design simple for v1 while leaving room for advanced workflow capabilities later.
- Use Inertia React for all application screens; Blade is only the root Inertia view.
- Keep the UI clean, white-based, MYDS-aligned, and componentised.

---

## Architecture

### Style: Layered Modular Monolith

EngageFlow is a single Laravel application using a layered modular monolith architecture. The app is not split into microservices in v1. Instead, the codebase is organised around feature modules with clear responsibilities and predictable dependencies.

The architecture should be easy for a Laravel developer to understand and maintain:

```text
Inertia React Pages / Components
        ↓
Laravel Routes
        ↓
HTTP Controllers
        ↓
Form Requests + Policies
        ↓
Service / Action Classes
        ↓
Eloquent Models + Database Transactions
        ↓
Events / Listeners for side effects
        ↓
MySQL
```

### Request Flow

A normal write request should follow this flow:

```text
React form submits through Inertia
→ Controller receives request
→ Form Request validates input
→ Policy checks project access
→ Service/Action performs business operation inside transaction if needed
→ Event is fired for audit/history side effects if needed
→ Controller redirects or returns Inertia response
```

A normal read request should follow this flow:

```text
React page requests route
→ Controller checks policy/access
→ Service queries project-scoped data
→ Controller returns Inertia page props
→ React components render the page
```

### Application Layers

| Layer | Responsibility | Guardrail |
|---|---|---|
| Inertia React UI | Pages, layouts, forms, reusable components | No business rules beyond basic UI state |
| Routes | Map URLs to controllers | Keep route files readable and grouped by feature |
| Controllers | Orchestrate validation, authorization, service calls, Inertia responses | Keep thin; do not place business logic here |
| Form Requests | Validate input | Reusable validation rules where useful |
| Policies | Enforce Project ownership/membership access | Never rely only on hidden UI controls |
| Services/Actions | Core business rules and transactions | Main home for project/workflow/task logic |
| Models | Eloquent relationships, casts, simple computed helpers | Avoid fat models for complex workflows |
| Events/Listeners | Audit/history and future side effects | Do not block core operations with unrelated side effects |
| Database | MySQL persistence | Migrations are append-only after merge |

### Backend Organisation

Use Laravel conventions, but keep feature code grouped clearly. A practical structure is:

```text
app/
  Http/
    Controllers/
      Projects/
      Workflows/
      Tasks/
      FollowUps/
      Documents/
      Dashboard/
    Requests/
      Projects/
      Workflows/
      Tasks/
      FollowUps/
      Documents/
  Models/
    User.php
    Project.php
    ProjectWorkflow.php
    ProjectWorkflowStage.php
    Task.php
    TaskWorkflowStage.php
    FollowUpAction.php
    DocumentLink.php
    AuditEntry.php
  Policies/
    ProjectPolicy.php
    TaskPolicy.php
    TaskWorkflowStagePolicy.php
    FollowUpActionPolicy.php
    DocumentLinkPolicy.php
  Services/
    Projects/
    Workflows/
    Tasks/
    FollowUps/
    Documents/
    Dashboard/
    Audit/
  Events/
  Listeners/
```

A strict `app/Modules` structure is not required if it makes normal Laravel development harder. The important rule is clear feature grouping, thin controllers, project-scoped policies, and service/action classes for business logic.

### Frontend Organisation

Use the existing Inertia React stack. Application screens must be React/Inertia, not Blade.

```text
resources/js/
  Layouts/
    AuthenticatedLayout.tsx
  Pages/
    Dashboard/
    Projects/
    Workflows/
    Tasks/
  Components/
    Projects/
    Workflows/
    Tasks/
    FollowUps/
    Documents/
    Shared/
```

Frontend guardrails:

- Pages compose reusable components.
- Components should be lego-style and reusable.
- Keep Project, Workflow, Task, Follow-Up, Document, and Dashboard components grouped by feature.
- Avoid one giant dashboard component.
- UI may hide unavailable actions, but backend policies must still enforce access.

### Data Ownership and Access Scope

Project is the main ownership boundary.

```text
User owns Project
Project owns Workflow
Project owns Tasks
Task owns TaskWorkflowStages
Task owns FollowUpActions
Task/Stage/FollowUpAction own DocumentLinks
Project owns AuditEntries through related activity
```

All queries must be scoped through the selected Project. Do not query Tasks, Stages, Follow-Up Actions, Document Links, or Audit Entries globally unless a future cross-project dashboard is explicitly designed.

### Future API Readiness

The first MVP uses Inertia React. JSON APIs are not required for the first MVP, but the service/action layer should make future API controllers possible without rewriting business logic.

Do not build a separate API layer now unless required by a task. The priority is a clean web app with reusable backend services.

---

## Modular Boundaries

| Module | Responsibility |
|---|---|
| ProjectManagement | Create/update/list Projects owned by the authenticated user |
| WorkflowBuilder | Manage Project Workflow stages: add, name, order, mandatory/optional flag, edit before Tasks exist |
| TaskTracking | Create/update/list Tasks inside Projects; target completion; delayed computation |
| WorkflowStageTracking | Task stage status updates, active stage logic, completed dates |
| FollowUpActionTracking | Follow-up action CRUD and overdue computation |
| DocumentLinkTracking | Document link CRUD for Task, Stage, or Follow-Up Action |
| Dashboard | Project-scoped progress summary, task list, delayed/overdue view, search/filter |
| AuthUserAccess | Authentication and Project-scoped access policies |
| AuditHistoryTracking | Record and query status change history |
| ProjectMembership | Later collaboration extension for adding/removing Project members |

Cross-module rules:

- `ProjectManagement` owns Project records.
- `WorkflowBuilder` owns Project Workflow definition.
- `TaskTracking` creates Tasks and asks `WorkflowBuilder` for the Project Workflow stages.
- `WorkflowStageTracking` updates copied Task stages, not the Project Workflow definition.
- `Dashboard` reads from Project, Task, Stage, Follow-Up, and Document modules through service/action classes.
- `AuditHistoryTracking` listens to status-change events and writes audit records.
- `ProjectMembership` is lower priority and should not be built before the single-user Project/Task workflow is complete.

---

## Technology Stack

| Layer | Choice | Notes |
|---|---|---|
| Language | PHP 8.4 | Minimum version |
| Framework | Laravel | Eloquent, policies, events, migrations, session auth |
| Frontend | Inertia.js + React | SPA-like experience without a separate frontend app |
| Styling | Tailwind CSS | Utility-first styling; use carefully with MYDS |
| Design System | MYDS | Primary design reference where practical |
| Icons | FontAwesome | Consistent icon usage across the UI |
| Database | MySQL | Avoid database-specific tricks in v1 |
| Auth | Laravel session-based auth | No external OAuth in v1 |
| Testing | PestPHP | Unit, feature, and selected property-style tests |

---

## Core Domain Model

```text
User
  └── owns many → Project
                  ├── has one → ProjectWorkflow
                  │             └── has many → ProjectWorkflowStage
                  └── has many → Task
                                ├── has many → TaskWorkflowStage
                                ├── has many → FollowUpAction
                                ├── has many → DocumentLink
                                └── has many → AuditEntry via stages/actions

TaskWorkflowStage
  ├── belongs to → Task
  ├── copied from → ProjectWorkflowStage at Task creation time
  ├── has many → DocumentLink
  └── has many → AuditEntry

FollowUpAction
  ├── belongs to → Task
  ├── has many → DocumentLink
  └── has many → AuditEntry

ProjectMember  // collaboration extension
  ├── belongs to → Project
  └── belongs to → User
```

### Entity Descriptions

**User**

- `id`, `name`, `email`, `password`, timestamps
- No global Admin/Lead/Member role is required for the first MVP.
- Access is scoped through Project ownership first, and Project membership later.

**Project**

- `id`, `owner_user_id`, `name`, `description` nullable, timestamps
- Owned by one User.
- In the first MVP, only the owner can access the Project.
- Later, Project members may also access the Project.

**ProjectWorkflow**

- `id`, `project_id`, timestamps
- One Project has one ProjectWorkflow.
- Represents the user-built workflow definition for the Project.
- It is the blueprint used to create Task stages.
- It should remain isolated as the main extension point for future advanced workflow capabilities.

**ProjectWorkflowStage**

- `id`, `project_workflow_id`, `name`, `stage_order`, `is_mandatory`, timestamps
- Ordered list of stages built by the user.
- `is_mandatory` indicates whether the stage is required for normal completion/progress calculations.
- A Project must have at least one mandatory ProjectWorkflowStage before Tasks can be created.
- Stage names, order, and mandatory/optional flag may be edited before Tasks exist.
- If Tasks already exist, existing Task stages are preserved unless a future workflow rebuild feature is explicitly implemented.

**Task**

- `id`, `project_id`, `title`, `description` nullable, `target_completion_date` nullable, timestamps
- A Task belongs to one Project.
- A Task is not associated with an agency, ministry, company, or organisation.
- Delayed status is computed on read.

**TaskWorkflowStage**

- `id`, `task_id`, `project_workflow_stage_id` nullable, `name`, `stage_order`, `is_mandatory`, `status`, `completed_at` nullable, timestamps
- Created by copying the ProjectWorkflowStage name, order, and mandatory/optional flag when the Task is created.
- Stores its own snapshot so historical Task progress is stable even if the Project Workflow changes later.
- Valid statuses: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed.
- Optional stages may be completed, skipped, or marked Not_Applicable depending on the Task.

**FollowUpAction**

- `id`, `task_id`, `title`, `due_date`, `status`, `remarks` nullable, timestamps
- Valid statuses: Open, In_Progress, Done, Cancelled.
- Overdue status is computed on read.

**DocumentLink**

- `id`, `url`, `label` nullable, `linkable_type`, `linkable_id`, timestamps
- Polymorphic parent: Task, TaskWorkflowStage, or FollowUpAction.
- Stores links only. No file upload and no Google Drive API integration in v1.

**AuditEntry**

- `id`, `project_id`, `auditable_type`, `auditable_id`, `field_changed`, `previous_value`, `new_value`, `changed_by_user_id`, `changed_at`, timestamps
- Used for TaskWorkflowStage status changes and FollowUpAction status changes.
- Includes `project_id` to make project-scoped history queries straightforward.

**ProjectMember** *(collaboration extension)*

- `id`, `project_id`, `user_id`, `role`, timestamps
- Roles: Owner and Member, if/when collaboration is implemented.
- Lower priority than the first single-user MVP.

---

## Service / Action Classes

**ProjectService**

- `create(User $owner, array $data): Project`
- `update(Project $project, array $data): Project`
- `listForUser(User $user): Collection`
- `assertUserCanAccess(Project $project, User $user): void`

**WorkflowBuilderService**

- `createWorkflow(Project $project, array $stages): ProjectWorkflow`
- `addStage(Project $project, string $name, bool $isMandatory = true): ProjectWorkflowStage`
- `renameStage(ProjectWorkflowStage $stage, string $name): ProjectWorkflowStage`
- `setStageMandatory(ProjectWorkflowStage $stage, bool $isMandatory): ProjectWorkflowStage`
- `reorderStages(Project $project, array $orderedStageIds): Collection`
- `canEditWorkflow(Project $project): bool`

**TaskService**

- `create(Project $project, array $data): Task`
- `update(Task $task, array $data): Task`
- `listForProject(Project $project, array $filters = []): Collection`
- `isDelayed(Task $task): bool`

**TaskStageService**

- `initializeStages(Task $task): Collection`
- `updateStatus(TaskWorkflowStage $stage, string $status, User $user): TaskWorkflowStage`
- `getActiveStage(Task $task): ?TaskWorkflowStage`
- `hasReachedFinalMandatoryStage(Task $task): bool`

**FollowUpActionService**

- `create(Task $task, array $data): FollowUpAction`
- `update(FollowUpAction $action, array $data, User $user): FollowUpAction`
- `isOverdue(FollowUpAction $action): bool`
- `listOverdueForProject(Project $project): Collection`

**DocumentLinkService**

- `attach(Model $parent, string $url, ?string $label = null): DocumentLink`
- `listFor(Model $parent): Collection`
- `remove(DocumentLink $link): void`

**DashboardService**

- `getProjectSummary(Project $project): array`
- `getProgressView(Project $project, array $filters = []): Collection`
- `searchTasks(Project $project, string $query): Collection`

**AuditHistoryService**

- `record(Project $project, Model $entity, string $field, mixed $previousValue, mixed $newValue, User $user): AuditEntry`
- `getHistoryFor(Model $entity): Collection`
- `getHistoryForProject(Project $project): Collection`

---

## Authorization / Access Control

The first MVP is single-user-first:

- A User can access Projects they own.
- A User cannot access Projects owned by another User.
- Project membership is a later collaboration extension.

| Policy / Action | Project Owner | Project Member | Non-member |
|---|---:|---:|---:|
| View Project | ✓ | future ✓ | — |
| Update Project | ✓ | — | — |
| Build/edit Project Workflow before Tasks exist | ✓ | — | — |
| View Tasks | ✓ | future ✓ | — |
| Create/update Tasks | ✓ | future ✓ | — |
| Update Task stage status | ✓ | future ✓ | — |
| Create/update Follow-Up Action | ✓ | future ✓ | — |
| Create/view Document Link | ✓ | future ✓ | — |
| View audit/history | ✓ | future ✓ | — |
| Manage Project Members | future ✓ | — | — |

Laravel Policies should centralise access checks. Do not rely only on UI hiding.

---

## Workflow / Status Logic

### Project Workflow Definition

- Each Project has one ProjectWorkflow.
- ProjectWorkflow contains an ordered list of ProjectWorkflowStages.
- The user builds this list by adding, naming, ordering, marking stages as mandatory/optional, and editing stages.
- The first MVP does not require predefined templates.
- Starter workflows may be added later, but the product must not depend on templates.
- A Project Workflow must contain at least one mandatory stage before Tasks can be created.

### Mandatory and Optional Stages

- Mandatory stages represent steps normally required to complete the Task.
- Optional stages represent steps that may apply only to some Tasks within the Project.
- Optional stages are included in the Task timeline for visibility, but they should not block completion if marked Not_Applicable.
- The user can still mark optional stages as Completed when they are relevant.
- Optional stages allow one Project Workflow to support flexible streams without requiring a separate Special Project model.

### Editing Workflow After Tasks Exist

- Stage names, order, and mandatory/optional flag may be edited freely before Tasks exist.
- Once Tasks exist, existing TaskWorkflowStages are preserved.
- A future workflow rebuild/migration feature may be added later, but it is out of scope for the first MVP.

### Future Workflow Extensibility

The first MVP implements a simple ordered stage workflow only. The design should still leave room for future advanced workflow capabilities such as branching, condition rules, runtime actions, external connectors, and extension points.

For v1, do not implement these future capabilities. Keep the Workflow Builder focused on:

```text
Add stage → name stage → mark Mandatory/Optional → reorder stage → save workflow
```

Design guardrails:

- Keep workflow data isolated in ProjectWorkflow and ProjectWorkflowStage so future workflow capabilities can extend those concepts without rewriting Project, Task, FollowUpAction, DocumentLink, Dashboard, or AuditHistory from scratch.
- Avoid spreading workflow assumptions throughout unrelated modules.
- Keep Task stage initialization as the only place that copies the Project Workflow into TaskWorkflowStage records.
- Do not build future workflow capabilities now.

### Task Stage Initialization

When a Task is created:

1. Fetch the parent ProjectWorkflowStages ordered by `stage_order`.
2. Reject Task creation if the Project has no stages or no mandatory stages.
3. Create TaskWorkflowStage rows by copying each stage's name, order, and mandatory/optional flag.
4. Set all copied TaskWorkflowStages to Pending.

### Stage Status Transitions

Stages can be updated to any valid status at any time. There is no enforced linear progression.

Valid statuses:

```text
Pending → In_Progress → Completed
       ↘ KIV
       ↘ Not_Applicable
       ↘ Blocked
       ↘ To_Be_Confirmed
```

### Active Stage

- If one or more stages are In_Progress, use the In_Progress stage with the highest `stage_order`.
- If no stage is In_Progress, show the first mandatory stage that is not Completed or Not_Applicable.
- If all mandatory stages are Completed, the Task is complete.

---

## Delayed / Overdue Logic

### Delayed Task Logic

```text
is_delayed = (target_completion_date IS NOT NULL)
           AND (target_completion_date < CURRENT_DATE)
           AND (final mandatory TaskWorkflowStage status != Completed)
```

Final mandatory stage means the highest-order stage where `is_mandatory = true`.

### Overdue Follow-Up Logic

```text
is_overdue = (due_date < CURRENT_DATE)
           AND (status NOT IN ('Done', 'Cancelled'))
```

Both delayed and overdue status are computed on read in v1.

---

## Progress Calculation Approach

Progress for a Task is derived from mandatory TaskWorkflowStages:

- Completed mandatory stages: mandatory stages with status = Completed
- Denominator: all TaskWorkflowStages where `is_mandatory = true`
- Progress percentage: `completed_mandatory_count / mandatory_stage_count * 100`

Optional stages are visible in the timeline but excluded from the main completion percentage.

Dashboard counts must be scoped to the selected Project:

| Metric | Calculation |
|---|---|
| Total Tasks | Count of Tasks in selected Project |
| Completed Tasks | Count of Tasks whose final mandatory stage is Completed |
| In Progress Tasks | Count of Tasks whose final mandatory stage is not Completed |
| Delayed Tasks | Count of Tasks where delayed condition is true |
| Overdue Follow-Ups | Count of FollowUpActions where overdue condition is true |

---

## Document Link Approach

Document links are stored as plain URLs with optional labels. There is no file upload and no external document API integration in v1.

DocumentLink can be attached to:

- Task
- TaskWorkflowStage
- FollowUpAction

Access must always be checked through the parent Project.

---

## History Tracking Approach

Tracked changes:

| Entity | Tracked Changes |
|---|---|
| TaskWorkflowStage | Status changes |
| FollowUpAction | Status changes |

Each AuditEntry records Project ID, entity, field changed, previous value, new value, user, and timestamp.

---

## UI / Frontend Design

The UI should feel clean, white-based, modern, and calm. Use MYDS as the design reference where practical, with EngageFlow-specific components created as reusable React components.

Use a lego-style component approach:

- Pages compose reusable components.
- Repeated UI blocks live under `resources/js/Components`.
- Layout shells live under `resources/js/Layouts`.
- Page-level Inertia components live under `resources/js/Pages`.
- Do not build application screens in Blade.

### Recommended React Components

| Component | Purpose |
|---|---|
| `AuthenticatedLayout` | Shared authenticated app layout |
| `ProjectSwitcher` | Select active Project |
| `ProjectCard` | Display Project summary |
| `WorkflowBuilder` | Add/name/order/edit Project Workflow stages and mandatory/optional setting |
| `WorkflowStageList` | Ordered list of Project Workflow stages |
| `TaskCard` | Display Task summary, active stage, progress, delayed badge |
| `TaskProgressTimeline` | Visual stage timeline for a Task |
| `StageRequirementBadge` | Show Mandatory / Optional for stages |
| `StatusBadge` | Stage and action status badge |
| `DashboardSummaryCards` | Project summary counts |
| `FollowUpActionPanel` | List and manage follow-up actions |
| `DocumentLinkList` | Display external links |
| `HistoryTimeline` | Display status change history |

### Workflow Builder UI Guardrail

The first MVP Workflow Builder should be simple:

```text
Add stage → name stage → mark Mandatory/Optional → reorder stage → save workflow
```

Keep the UI and component boundaries clean enough that future advanced workflow capabilities can be added later. Do not implement those future capabilities in the first MVP.

---

## Graphical Progress View Approach

Each Task displays a workflow timeline using the TaskWorkflowStages copied from the Project Workflow.

```text
[✓ Stage 1] → [▶ Stage 2] → [○ Stage 3 optional] → [○ Stage 4]
 Completed    In_Progress   Pending optional      Pending
```

Display:

- Task title
- Current active stage
- Progress percentage based on mandatory stages
- Optional stage indicators
- Target completion date
- Delayed badge if delayed
- Overdue follow-up count

The Project dashboard shows only data for the selected Project: Total Tasks, Completed, In Progress, Delayed, Overdue Follow-Ups, task list, overdue follow-up section, search and filters.

---

## Correctness Properties

| Property | Rule |
|---|---|
| Project access is scoped | User sees only owned Projects in first MVP |
| Workflow has mandatory stage | Task creation rejected if Project has no stages or no mandatory stages |
| Task creation copies workflow | Task receives copied stage names, order, and mandatory/optional flags |
| Stage status update is reflected | Valid status update is persisted |
| Completed stage records date | Completed stage gets `completed_at` |
| Delayed flag is correct | Delayed depends on target date and final mandatory stage |
| Month target is correct | Month/year target stores last day of month |
| Follow-up overdue is correct | Overdue depends on due date and status |
| Document link round-trip | Saved URL and label are returned accurately |
| Audit entry is recorded | Stage/action status changes record audit entry |
| Search/filter are project-scoped | Results belong only to selected Project |
| Dashboard counts are project-scoped | Counts derive only from selected Project |

---

## Error Handling

- Missing Project name returns validation error.
- Missing Workflow stage name returns validation error.
- Workflow with no mandatory stage returns validation error.
- Task creation without Project Workflow stages returns validation error.
- Invalid Stage_Status returns validation error.
- Invalid FollowUpAction status returns validation error.
- Invalid URL returns validation error.
- User cannot access another User's Project in the first MVP.
- Existing Task stages must not be silently overwritten when Project Workflow changes.
- Unauthenticated users redirect to login.
- Authenticated users attempting to access another User's Project receive 403 or 404. Prefer 404 for resources that should not be discoverable.

---

## Queue / Job Usage

Queues are future-ready but not implemented in v1. Delayed and overdue status are computed on read. Redis is not required in v1 unless a real queued job is implemented.

---

## Testing Strategy

Feature tests should cover:

- Login and authenticated access
- Project creation
- Workflow building, including mandatory/optional stages
- Task creation from Project Workflow
- Stage status update
- Follow-up actions
- Document links
- Project dashboard summary
- Search/filter
- Cross-project access denial

Property-style tests are useful for delayed flag correctness, month-end target conversion, follow-up overdue correctness, and dashboard count consistency.

---

## Local Development / Container Approach

The project is container-first. The host machine only needs Docker Desktop, Git, and an editor.

Docker Compose services:

| Service | Purpose |
|---|---|
| app | Laravel application server |
| node | Frontend asset build support |
| db | MySQL database |

Seeders should provide a default local user, sample Projects, sample Project Workflows with mandatory/optional stages, sample Tasks, Follow-Up Actions, and Document Links. Do not seed global Admin roles for v1.

---

## Blade / Inertia Guardrail

The application uses Laravel + Inertia.js + React consistently for application screens. Blade is used only for the single root Inertia view at `resources/views/app.blade.php`.

---

## CI Approach

CI should run Composer install, frontend build as required for the Inertia asset manifest, migrations, `php artisan test`, PHPStan, and Laravel Pint. PRs should not be merged if CI fails.

---

## Documentation

Documentation must match the Project/Task/custom-workflow model.

Required docs:

| File | Contents |
|---|---|
| `docs/architecture.md` | Project/Workflow/Task architecture and module boundaries |
| `docs/setup.md` | Container-first setup guide |
| `docs/project-structure.md` | Backend module and frontend component structure |
| `docs/workflow-status.md` | Custom workflow, mandatory/optional stages, stage status, progress, delayed, overdue logic |
| `docs/testing.md` | Unit, feature, and property-style tests |
| `docs/ci.md` | GitHub Actions checks |
| `docs/user-guide.md` | How to create Projects, build Workflows, create Tasks, track progress |
| `docs/troubleshooting.md` | Common Docker, Composer, npm, migration, and permission issues |

README.md should link to all documentation files and include a quick start.

---

## GitHub Project Management

Continue using GitHub Issues, Pull Requests, labels, milestones, and project board. Each task in `tasks.md` should map to a small, reviewable GitHub Issue and pull request.

Recommended updated milestones:

- v1 Foundation
- v1 Project and Workflow
- v1 Task Tracking
- v1 Dashboard and Progress
- v1 Follow-Up and Documents
- v1 Audit and History
- v1 Search and Filter
- v1 Documentation
- v1 Testing and Quality
- v1 Polish and Review
- Future Collaboration

---

## Pull Request Rules

- Work from feature/spec/fix branches.
- Pull requests are required before merging into main.
- Each PR should reference the related issue when one exists.
- CI must pass before merge.
- Keep PRs small and reviewable.
- Spec-only changes should not include application code.
