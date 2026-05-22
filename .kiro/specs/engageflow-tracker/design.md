# Design Document: EngageFlow Tracker

## Overview

EngageFlow is a web application for tracking projects, tasks, actions, deadlines, and progress. It provides a structured, visual alternative to manual spreadsheet tracking and supports a **project-first, single-user-first** workflow.

The core v1 model is:

```text
User → Project → Custom Project Workflow → Tasks → Workflow Stages / Actions / Documents / Progress
```

A user can create multiple Projects, build a custom Workflow for each Project, create Tasks inside each Project, and monitor progress through visual workflow stages. Collaboration through Project members is a lower-priority extension and must not block the first MVP.

The system is built as a **modular monolith** for v1. Module boundaries are clear enough to keep the codebase organised, but the app remains one Laravel application. There are no microservices in v1.

### Key Design Goals

- Let one user create and manage multiple Projects independently.
- Let each Project have its own custom Workflow built by the user.
- Let Tasks inside a Project inherit their stage structure from the Project Workflow.
- Track task progress, target completion, delayed status, follow-up actions, document links, and history.
- Keep Project data strictly scoped to the owning user in the first MVP.
- Keep collaboration/project membership as a later extension.
- Use Inertia React for all application screens; Blade is only the root Inertia view.
- Keep the UI clean, white-based, MYDS-aligned, and componentised.

---

## Architecture

### Style: Modular Monolith

The application is a single deployable Laravel application with clearly separated internal modules. Each module owns its models, services/actions, policies, events/listeners, and controllers where useful. Cross-module communication uses service/action classes and Eloquent relationships directly.

```text
┌─────────────────────────────────────────────────────────────┐
│                        Web Layer                            │
│              Routes / Controllers / Inertia                 │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                     Application Modules                     │
│                                                             │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │   Project    │  │    Workflow    │  │      Task      │  │
│  │  Management  │  │    Builder     │  │    Tracking    │  │
│  └──────────────┘  └────────────────┘  └────────────────┘  │
│                                                             │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │  Follow-Up   │  │    Document    │  │   Dashboard /  │  │
│  │   Actions    │  │     Links      │  │ Progress View  │  │
│  └──────────────┘  └────────────────┘  └────────────────┘  │
│                                                             │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │    Audit /   │  │     Auth /     │  │ Project Member │  │
│  │   History    │  │  User Access   │  │  Collaboration │  │
│  └──────────────┘  └────────────────┘  └────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    Data Layer: Eloquent ORM                 │
│                         MySQL Database                      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

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

**Version policy:** Use stable package versions only. Avoid beta, RC, or experimental versions unless explicitly approved.

---

## API-First Modular Monolith

The Inertia React web frontend is the primary v1 client. Backend business logic should live in service/action classes so it can later be reused by JSON endpoints if a future API/mobile client is needed.

**Principles:**

- Controllers stay thin; they validate, authorise, call services/actions, and return Inertia responses or redirects.
- Business rules live in services/actions.
- Policies enforce Project ownership/membership access.
- Events/listeners handle side effects such as audit history.
- No module calls another module through HTTP inside the same app.
- JSON endpoints may be introduced later for dashboard data, task lists, stage updates, follow-up actions, and document links, but they are not required to complete the first Inertia MVP.

**Not in v1:**

- No microservices.
- No API gateway.
- No external auth provider.
- No mobile app.
- No background notification system.

---

## Modular Boundaries

Each module lives under `app/Modules/{ModuleName}/` where practical. Normal Laravel conventions still apply.

| Module | Responsibility |
|---|---|
| ProjectManagement | Create/update/list Projects owned by the authenticated user |
| WorkflowBuilder | Manage Project Workflow stages: add, name, order, edit before Tasks exist |
| TaskTracking | Create/update/list Tasks inside Projects; target completion; delayed computation |
| WorkflowStageTracking | Task stage status updates, active stage logic, completed dates |
| FollowUpActionTracking | Follow-up action CRUD and overdue computation |
| DocumentLinkTracking | Document link CRUD for Task, Stage, or Follow-Up Action |
| Dashboard | Project-scoped progress summary, task list, delayed/overdue view, search/filter |
| AuthUserAccess | Authentication and Project-scoped access policies |
| AuditHistoryTracking | Record and query status change history |
| ProjectMembership | Later collaboration extension for adding/removing Project members |

**Cross-module rules:**

- `ProjectManagement` owns Project records.
- `WorkflowBuilder` owns Project Workflow definition.
- `TaskTracking` creates Tasks and asks `WorkflowBuilder` for the Project Workflow stages.
- `WorkflowStageTracking` updates copied Task stages, not the Project Workflow definition.
- `Dashboard` reads from Project, Task, Stage, Follow-Up, and Document modules through service/action classes.
- `AuditHistoryTracking` listens to status-change events and writes audit records.
- `ProjectMembership` is lower priority and should not be built before the single-user Project/Task workflow is complete.

---

## Core Domain Model

### Conceptual Entity Overview

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
- Not a task status record; it is the blueprint used to create Task stages.

**ProjectWorkflowStage**

- `id`, `project_workflow_id`, `name`, `stage_order`, timestamps
- Ordered list of stages built by the user.
- A Project must have at least one ProjectWorkflowStage before Tasks can be created.
- Stage names and order may be edited before Tasks exist.
- If Tasks already exist, existing Task stages are preserved unless a future workflow rebuild feature is explicitly implemented.

**Task**

- `id`, `project_id`, `title`, `description` nullable, `target_completion_date` nullable, timestamps
- A Task belongs to one Project.
- A Task is not associated with an agency, ministry, company, or organisation.
- Delayed status is computed on read.

**TaskWorkflowStage**

- `id`, `task_id`, `project_workflow_stage_id` nullable, `name`, `stage_order`, `status`, `completed_at` nullable, timestamps
- Created by copying the ProjectWorkflowStage names/order when the Task is created.
- Stores its own `name` and `stage_order` snapshot so historical Task progress is stable even if the Project Workflow changes later.
- Valid statuses: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed.

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

Controllers should call service/action classes. Suggested interfaces:

**ProjectService**

- `create(User $owner, array $data): Project`
- `update(Project $project, array $data): Project`
- `listForUser(User $user): Collection`
- `assertUserCanAccess(Project $project, User $user): void`

**WorkflowBuilderService**

- `createWorkflow(Project $project, array $stages): ProjectWorkflow`
- `addStage(Project $project, string $name): ProjectWorkflowStage`
- `renameStage(ProjectWorkflowStage $stage, string $name): ProjectWorkflowStage`
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
- `hasReachedFinalStage(Task $task): bool`

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

## Events and Listeners

| Event | Fired By | Listener | Action |
|---|---|---|---|
| `TaskStageStatusChanged` | TaskStageService | AuditHistoryListener | Record stage status change |
| `FollowUpActionStatusChanged` | FollowUpActionService | AuditHistoryListener | Record follow-up action status change |

Events should carry the Project context, entity, previous value, new value, and User who made the change.

---

## Authorization / Access Control

### Access Model

The first MVP is single-user-first:

- A User can access Projects they own.
- A User cannot access Projects owned by another User.
- Project membership is a later collaboration extension.

When membership is implemented:

- Project_Owner can manage Project members.
- Project_Member can view and contribute to Tasks inside the Project.
- Project_Member cannot manage members in v1.

### Policies

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

Laravel Policies should centralise the access checks. Do not rely only on UI hiding.

---

## Workflow / Status Logic

### Project Workflow Definition

- Each Project has one ProjectWorkflow.
- ProjectWorkflow contains an ordered list of ProjectWorkflowStages.
- The user builds this list by adding, naming, ordering, and editing stages.
- The first MVP does not require predefined templates.
- Starter workflows may be added later, but the product must not depend on templates.

### Editing Workflow After Tasks Exist

To avoid data corruption and confusing progress history:

- Stage names/order may be edited freely before Tasks exist.
- Once Tasks exist, existing TaskWorkflowStages are preserved.
- A future workflow rebuild/migration feature may be added later, but it is out of scope for the first MVP.

### Task Stage Initialization

When a Task is created:

1. Fetch the parent ProjectWorkflowStages ordered by `stage_order`.
2. Reject Task creation if the Project has no stages.
3. Create TaskWorkflowStage rows by copying each stage's name and order.
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

Any stage can move to any valid status regardless of other stages. This reflects real work where stages may happen out of order.

### Active Stage

The active stage is the stage most recently or most prominently set to In_Progress. For deterministic display:

- If one or more stages are In_Progress, use the In_Progress stage with the highest `stage_order`.
- If no stage is In_Progress, show the first non-completed and non-not-applicable stage as the next stage.
- If all applicable stages are Completed, the Task is complete.

---

## Delayed / Overdue Logic

### Delayed Task Logic

```text
is_delayed = (target_completion_date IS NOT NULL)
           AND (target_completion_date < CURRENT_DATE)
           AND (final applicable TaskWorkflowStage status != Completed)
```

Final applicable stage means the highest-order stage that is not Not_Applicable. If all stages are Not_Applicable, the Task should not be considered complete by default; handle this as an invalid or unusual state in validation/reporting.

Delayed status is computed on read in v1. No scheduled job recalculates it.

### Overdue Follow-Up Logic

```text
is_overdue = (due_date < CURRENT_DATE)
           AND (status NOT IN ('Done', 'Cancelled'))
```

Overdue status is computed on read in v1.

---

## Progress Calculation Approach

### Per-Task Progress

Progress for a Task is derived from its TaskWorkflowStages:

- Completed stages: status = Completed
- Not applicable stages: status = Not_Applicable and excluded from the denominator
- Total applicable stages: all stages except Not_Applicable
- Progress percentage: `completed_count / applicable_stage_count * 100`

If applicable_stage_count is zero, progress should be treated as 0% and flagged for review rather than dividing by zero.

### Project Dashboard Summary Counts

| Metric | Calculation |
|---|---|
| Total Tasks | Count of Tasks in the selected Project |
| Completed Tasks | Count of Tasks whose final applicable stage is Completed |
| In Progress Tasks | Count of Tasks whose final applicable stage is not Completed |
| Delayed Tasks | Count of Tasks where delayed condition is true |
| Overdue Follow-Ups | Count of FollowUpActions in the Project where overdue condition is true |

Dashboard counts must be scoped to the selected Project. Do not mix data across Projects unless a future cross-project dashboard is explicitly added.

---

## Document Link Approach

Document links are stored as plain URLs with optional labels. There is no file upload and no external document API integration in v1.

### Parent Entities

DocumentLink can be attached to:

- Task
- TaskWorkflowStage
- FollowUpAction

### Constraints

- Validate URL format on save.
- Open links in a new browser tab.
- Do not store file contents.
- Do not browse Google Drive folders.
- Do not call Google Drive APIs.
- Check access through the parent Project before showing or changing a link.

---

## History Tracking Approach

### What is Tracked

| Entity | Tracked Changes |
|---|---|
| TaskWorkflowStage | Status changes |
| FollowUpAction | Status changes |

### Audit Entry Contents

Each AuditEntry records:

- Project ID
- Auditable entity type and ID
- Field changed
- Previous value
- New value
- User who made the change
- Timestamp of the change

History is viewable per Task and per FollowUpAction. Project-level history can be added later if useful.

---

## UI / Frontend Design

### UI Direction

The UI should feel clean, white-based, modern, and calm. Avoid dense government-portal styling. Use MYDS as the design reference where practical, with EngageFlow-specific components created as reusable React components.

The user should quickly understand:

- Which Project they are in.
- What Workflow the Project uses.
- Which Tasks are pending, active, delayed, or completed.
- Which follow-up actions are overdue.
- What needs attention next.

### Component Approach

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
| `WorkflowBuilder` | Add/name/order/edit Project Workflow stages |
| `WorkflowStageList` | Ordered list of Project Workflow stages |
| `TaskCard` | Display Task summary, active stage, progress, delayed badge |
| `TaskProgressTimeline` | Visual stage timeline for a Task |
| `StatusBadge` | Stage and action status badge |
| `DashboardSummaryCards` | Project summary counts |
| `FollowUpActionPanel` | List and manage follow-up actions |
| `DocumentLinkList` | Display external links |
| `HistoryTimeline` | Display status change history |

### Workflow Builder UI Guardrail

The first MVP Workflow Builder should be simple:

```text
Add stage → name stage → reorder stage → save workflow
```

Do not implement branching workflows, conditional logic, automation execution, triggers, webhooks, or integrations in the first MVP.

---

## Graphical Progress View Approach

### Individual Task View

Each Task displays a workflow timeline using the TaskWorkflowStages copied from the Project Workflow.

```text
[✓ Stage 1] → [▶ Stage 2] → [○ Stage 3] → [○ Stage 4]
 Completed    In_Progress   Pending      Pending
```

Display:

- Task title
- Current active stage
- Progress percentage
- Target completion date
- Delayed badge if delayed
- Overdue follow-up count

### Project Dashboard View

The dashboard shows only data for the selected Project:

- Summary cards: Total Tasks, Completed, In Progress, Delayed, Overdue Follow-Ups
- Task list/table with active stage, progress percentage, delayed badge, overdue count
- Prominent overdue follow-up section
- Search and filters scoped to the selected Project

### Search and Filter

- Search by Task title/name.
- Filter by Stage_Status.
- Filter by delayed status.
- Results must stay scoped to the selected Project.

---

## Correctness Properties

The following properties guide tests and implementation.

### Property 1: Project access is scoped

For any User, querying Projects SHALL return only Projects owned by that User in the first MVP. Later, this may include Projects where the User is a Project_Member.

### Property 2: Project Workflow must have at least one stage before Tasks are created

For any Project with no ProjectWorkflowStages, Task creation SHALL be rejected.

### Property 3: Task creation copies Project Workflow stages

For any Task created under a Project with N ProjectWorkflowStages, the Task SHALL receive exactly N TaskWorkflowStages with matching names and order, all initialized to Pending.

### Property 4: Stage status update is reflected

For any TaskWorkflowStage, updating the status to a valid Stage_Status SHALL result in that stage reflecting the new status when queried.

### Property 5: Completed stage records completion date

For any TaskWorkflowStage updated to Completed, `completed_at` SHALL be non-null.

### Property 6: Delayed flag correctness

For any Task with a target completion date, the Task SHALL be delayed if and only if the current date exceeds the target completion date and the final applicable stage is not Completed.

### Property 7: Month-only target uses last day of month

For any month/year target input, the stored target completion date SHALL be the last calendar day of that month, including leap-year February.

### Property 8: Follow-up overdue correctness

For any FollowUpAction, the action SHALL be overdue if and only if the current date exceeds due_date and status is neither Done nor Cancelled.

### Property 9: Document link round-trip

For any DocumentLink attached to a valid parent entity, querying the links for that parent SHALL return the saved URL and label.

### Property 10: Audit entry recorded on status changes

For any TaskWorkflowStage or FollowUpAction status update, an AuditEntry SHALL record previous value, new value, user, entity, Project, and timestamp.

### Property 11: Search and filter remain project-scoped

For any search/filter request in a Project, returned Tasks SHALL belong only to that Project and satisfy all applied filters.

### Property 12: Dashboard counts are project-scoped and consistent

For any Project, dashboard counts SHALL be derived only from Tasks and FollowUpActions in that Project.

---

## Error Handling

### Validation Errors

- Missing Project name returns validation error.
- Missing Workflow stage name returns validation error.
- Task creation without Project Workflow stages returns validation error.
- Invalid Stage_Status returns validation error.
- Invalid FollowUpAction status returns validation error.
- Invalid URL returns validation error.

### Business Rule Violations

- User cannot access another User's Project in the first MVP.
- User cannot create a Task in a Project they cannot access.
- User cannot update a stage, follow-up action, document link, or history record outside accessible Projects.
- Existing Task stages must not be silently overwritten when Project Workflow changes.

### Authorization Errors

- Unauthenticated users redirect to login.
- Authenticated users attempting to access another User's Project receive 403 or 404 based on controller design. Prefer 404 for resources that should not be discoverable.

---

## Queue / Job Usage

Queues are future-ready but not implemented in v1. Delayed and overdue status are computed on read.

| Job | Status | Notes |
|---|---|---|
| RecalculateDelayedFlags | Not in v1 | Computed on read |
| SendOverdueNotifications | Not in v1 | Future notification feature |
| GenerateDashboardReport | Not in v1 | Future export/report feature |
| ImportTasksFromExcel | Not in v1 | Future bulk import feature |

Redis is not required in v1 unless a real queued job is implemented.

---

## Testing Strategy

### Unit and Feature Tests

Each service/action class should have tests for:

- Happy path
- Validation failures
- Project-scoped access
- Business rules
- Delayed/overdue computation
- Audit history

Feature tests should cover:

- Login and authenticated access
- Project creation
- Workflow building
- Task creation from Project Workflow
- Stage status update
- Follow-up actions
- Document links
- Project dashboard summary
- Search/filter
- Cross-project access denial

### Property-Style Tests

Use property-style tests selectively for rules with meaningful input variation:

| Property | Test Focus |
|---|---|
| Delayed flag correctness | Random target dates × final stage statuses |
| Month-end target conversion | Random month/year combinations |
| Follow-up overdue correctness | Random due dates × statuses |
| Dashboard count consistency | Random Project task/stage/action data |

### Test Organization

```text
tests/
  Unit/
    ProjectServiceTest.php
    WorkflowBuilderServiceTest.php
    TaskServiceTest.php
    TaskStageServiceTest.php
    FollowUpActionServiceTest.php
    DocumentLinkServiceTest.php
    AuditHistoryServiceTest.php
    DashboardServiceTest.php
  Feature/
    ProjectManagementTest.php
    WorkflowBuilderTest.php
    TaskTrackingTest.php
    TaskStageStatusTest.php
    FollowUpActionTest.php
    DocumentLinkTest.php
    DashboardTest.php
    SearchFilterTest.php
    ProjectAccessTest.php
  Property/
    DelayedFlagPropertyTest.php
    MonthEndTargetPropertyTest.php
    FollowUpOverduePropertyTest.php
    DashboardSummaryPropertyTest.php
```

---

## Local Development / Container Approach

The project is container-first. The host machine only needs Docker Desktop, Git, and an editor. PHP, Composer, Node, npm, and MySQL do not need to be installed on the host machine.

### Docker Compose Services

| Service | Purpose |
|---|---|
| app | Laravel application server |
| node | Frontend asset build support |
| db | MySQL database |

Redis and Mailpit are not required in v1 unless a real queued job or notification feature is implemented.

### Setup Flow

```text
1. Clone repository
2. Copy .env.example to .env
3. docker compose up -d
4. docker compose exec app composer install
5. docker compose exec app php artisan key:generate
6. docker compose exec app php artisan migrate --seed
7. docker compose run --rm node npm install
8. docker compose run --rm node npm run build
9. Open http://localhost:8000
```

### Seeder Strategy

Seeders should provide:

- A default local user for development.
- Sample Projects owned by that user.
- Sample Project Workflows with different stage sets.
- Sample Tasks with varied stage statuses.
- Sample Follow-Up Actions.
- Sample Document Links.

Do not seed global Admin roles for v1.

---

## Blade / Inertia Guardrail

The application uses Laravel + Inertia.js + React consistently for application screens. Blade is used only for the single root Inertia view at `resources/views/app.blade.php`.

- Do not build application screens using Blade.
- Do not create duplicate Blade pages for React/Inertia screens.
- Do not leave unused scaffolded Blade files.
- Authentication screens use Inertia React.
- Application pages live under `resources/js/Pages`.
- Reusable components live under `resources/js/Components`.
- Layouts live under `resources/js/Layouts`.

---

## CI Approach

CI runs on pull requests and pushes to main.

CI should run:

1. Composer install
2. NPM install/build as required for Inertia asset manifest
3. Database migrations
4. `php artisan test`
5. PHPStan
6. Laravel Pint

PRs should not be merged if CI fails.

---

## Documentation

Documentation must be updated to match the Project/Task/custom-workflow model.

Required docs:

| File | Contents |
|---|---|
| `docs/architecture.md` | Project/Workflow/Task architecture and module boundaries |
| `docs/setup.md` | Container-first setup guide |
| `docs/project-structure.md` | Backend module and frontend component structure |
| `docs/workflow-status.md` | Custom workflow, stage status, progress, delayed, overdue logic |
| `docs/testing.md` | Unit, feature, and property-style tests |
| `docs/ci.md` | GitHub Actions checks |
| `docs/user-guide.md` | How to create Projects, build Workflows, create Tasks, track progress |
| `docs/troubleshooting.md` | Common Docker, Composer, npm, migration, and permission issues |

README.md should link to all documentation files and include a quick start.

---

## GitHub Project Management

Continue using GitHub Issues, Pull Requests, labels, milestones, and project board.

Each task in `tasks.md` should map to a small, reviewable GitHub Issue and pull request.

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
