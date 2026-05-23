# Design Document: EngageFlow Tracker

## 1. Purpose

EngageFlow is a Laravel + Inertia React application for tracking projects, tasks, workflow progress, follow-up actions, document links, and status history.

The v1 product is **project-first** and **single-user-first**. A user can create multiple Projects, build a custom Workflow for each Project, create Tasks inside the Project, and track progress visually. Collaboration is a future extension and should not block the first MVP.

Core v1 model:

```text
User
└── Project
    ├── Project Workflow
    │   └── Workflow Stages
    └── Tasks
        ├── Task Workflow Stages
        ├── Follow-Up Actions
        ├── Document Links
        └── Status History
```

If the user needs to track a different stream of work, they create another Project. Flexibility within a Project is handled by custom Workflow stages and mandatory/optional stage settings.

---

## 2. Product Scope

### In Scope for v1

- Authenticated user can create and manage multiple Projects.
- Each Project has one custom Workflow built by the user.
- Workflow stages can be added, named, ordered, and marked mandatory or optional.
- User can create Tasks inside a Project after the Project has at least one mandatory Workflow stage.
- Each Task receives copied Task Workflow Stages from the Project Workflow.
- User can update Task stage status.
- User can set a target completion date for a Task.
- Dashboard shows Project-scoped task progress, delayed tasks, and overdue follow-up actions.
- User can add Follow-Up Actions to Tasks.
- User can add external Document Links to Tasks, Task Workflow Stages, and Follow-Up Actions.
- Status changes are recorded in history.
- Project access is scoped to the Project owner in the first MVP.

### Future Extensions, Not v1

- Project member collaboration.
- Cross-project dashboard.
- Starter workflow library.
- Advanced workflow capabilities such as branching, condition rules, runtime actions, connectors, and extension points.
- Notifications.
- File uploads.
- External document repository integration.
- Mobile app or public API.

The design should not implement these future features now, but should avoid blocking them unnecessarily.

---

## 3. Technology Stack

| Area | Choice | Notes |
|---|---|---|
| Backend | Laravel | Session auth, Eloquent, policies, migrations, events |
| PHP | PHP 8.4 | Minimum target version |
| Frontend | Inertia.js + React | Application screens are React/Inertia |
| Styling | Tailwind CSS | Use carefully with MYDS-inspired components |
| Icons | FontAwesome | Consistent icon system |
| Database | MySQL | Avoid database-specific tricks where possible |
| Tests | PestPHP | Feature tests, unit tests, selected property-style tests |
| Local dev | Docker Compose | Container-first setup |

Blade is allowed only for the root Inertia view. Do not build application screens in Blade.

---

## 4. Architecture

### 4.1 Architecture Style

EngageFlow uses a **layered modular monolith**.

It remains one Laravel application, but code is grouped by feature area. The goal is boring, predictable Laravel code: thin controllers, clear validation, policy-based authorization, action classes for business logic, and Eloquent models for persistence.

```text
React / Inertia Pages and Components
        ↓
Laravel Routes
        ↓
HTTP Controllers
        ↓
Form Requests + Policies
        ↓
Application Actions
        ↓
Eloquent Models + Database Transactions
        ↓
Events / Listeners
        ↓
MySQL
```

### 4.2 Write Flow

```text
React form submits through Inertia
→ Controller receives request
→ Form Request validates input
→ Policy checks Project access
→ Action class performs operation, using transaction if needed
→ Event is fired for history when needed
→ Controller redirects or returns Inertia response
```

### 4.3 Read Flow

```text
React page requests route
→ Controller checks Project access
→ Query/action loads Project-scoped data
→ Controller returns Inertia props
→ React components render page
```

### 4.4 Layer Responsibilities

| Layer | Responsibility | Guardrail |
|---|---|---|
| React/Inertia UI | Pages, layouts, forms, reusable components | No business rules beyond local UI state |
| Routes | Map URLs to controllers | Group by feature |
| Controllers | Authorize, call actions, return responses | Keep thin |
| Form Requests | Validate input | Keep validation close to HTTP boundary |
| Policies | Enforce Project access | Do not rely on hidden UI only |
| Actions | Business operations and transactions | Main home for workflow/task logic |
| Models | Relationships, casts, simple helpers | Avoid complex business workflows here |
| Events/Listeners | History and future side effects | Keep side effects separate |
| Database | Persistence | Append-only migrations after merge |

---

## 5. Code Organisation

Use normal Laravel conventions. A strict `app/Modules` folder is not required.

### 5.1 Backend Structure

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
  Actions/
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

### 5.2 Frontend Structure

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
- Avoid one giant dashboard component.
- Keep Project, Workflow, Task, Follow-Up, Document, and Dashboard components grouped by feature.
- UI may hide unavailable actions, but backend policies must still enforce access.

---

## 6. Feature Areas

| Feature Area | Responsibility |
|---|---|
| Project Management | Create, update, list, and select Projects owned by the user |
| Workflow Builder | Build Project Workflow stages with order and mandatory/optional flag |
| Task Tracking | Create, update, list, search, and filter Tasks inside a Project |
| Stage Tracking | Update copied Task Workflow Stage status and completion date |
| Follow-Up Tracking | Create, update, list, and flag overdue Follow-Up Actions |
| Document Links | Store and display external links attached to allowed parent records |
| Dashboard | Show Project-scoped summary, progress, delayed tasks, and overdue follow-ups |
| History | Record and display status change history |
| Access Control | Enforce owner-only access in v1, prepare for Project members later |

Feature dependency rules:

- Project Management owns Projects.
- Workflow Builder owns Project Workflow definitions.
- Task Tracking creates Tasks and copies stages from the Project Workflow.
- Stage Tracking updates copied Task Workflow Stages only.
- Dashboard reads Project-scoped data only.
- History listens to status changes and records Audit Entries.
- Future collaboration must not be implemented before the single-user flow is stable.

---

## 7. Domain Model

### 7.1 Entity Relationship Overview

```text
User
  └── Project
        ├── ProjectWorkflow
        │     └── ProjectWorkflowStage
        └── Task
              ├── TaskWorkflowStage
              ├── FollowUpAction
              └── DocumentLink

TaskWorkflowStage
  └── DocumentLink

FollowUpAction
  └── DocumentLink

TaskWorkflowStage / FollowUpAction
  └── AuditEntry
```

Future collaboration extension:

```text
Project
└── ProjectMember
    └── User
```

### 7.2 Entity Details

#### User

Fields:

- `id`
- `name`
- `email`
- `password`
- timestamps

Notes:

- No global role is required for first MVP.
- A user accesses Projects they own.

#### Project

Fields:

- `id`
- `owner_user_id`
- `name`
- `description` nullable
- timestamps

Rules:

- A Project belongs to one owner User.
- In the first MVP, only the owner can access the Project.
- All Project data must be scoped through Project ownership.

#### ProjectWorkflow

Fields:

- `id`
- `project_id`
- timestamps

Rules:

- One Project has one ProjectWorkflow.
- It is the blueprint for creating Task Workflow Stages.
- Keep this entity isolated as the future extension point for more advanced workflow capability.

#### ProjectWorkflowStage

Fields:

- `id`
- `project_workflow_id`
- `name`
- `stage_order`
- `is_mandatory`
- timestamps

Rules:

- Stages are ordered.
- A Project must have at least one mandatory stage before Tasks can be created.
- Stage name, order, and mandatory/optional flag may be edited before Tasks exist.
- Once Tasks exist, existing Task Workflow Stages are preserved.

#### Task

Fields:

- `id`
- `project_id`
- `title`
- `description` nullable
- `target_completion_date` nullable
- timestamps

Rules:

- A Task belongs to one Project.
- A Task follows the Project Workflow snapshot copied at creation time.
- Delayed status is computed on read.

#### TaskWorkflowStage

Fields:

- `id`
- `task_id`
- `project_workflow_stage_id` nullable
- `name`
- `stage_order`
- `is_mandatory`
- `status`
- `completed_at` nullable
- timestamps

Rules:

- Created by copying ProjectWorkflowStage name, order, and mandatory flag.
- Keeps a snapshot so task progress history remains stable.
- Valid statuses: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed.
- `completed_at` is set when status becomes Completed.

#### FollowUpAction

Fields:

- `id`
- `task_id`
- `title`
- `due_date`
- `status`
- `remarks` nullable
- timestamps

Valid statuses:

- Open
- In_Progress
- Done
- Cancelled

Overdue status is computed on read.

#### DocumentLink

Fields:

- `id`
- `url`
- `label` nullable
- `linkable_type`
- `linkable_id`
- timestamps

Allowed parents:

- Task
- TaskWorkflowStage
- FollowUpAction

Rules:

- Store links only.
- Do not upload files in v1.
- Do not integrate with external document storage in v1.
- Access must be checked through the parent Project.

#### AuditEntry

Fields:

- `id`
- `project_id`
- `auditable_type`
- `auditable_id`
- `field_changed`
- `previous_value`
- `new_value`
- `changed_by_user_id`
- `changed_at`
- timestamps

Tracked changes:

- TaskWorkflowStage status changes.
- FollowUpAction status changes.

---

## 8. Access Control

### 8.1 v1 Access Model

The first MVP is owner-only:

- User can view Projects they own.
- User cannot view Projects owned by another user.
- User can create, update, and manage data inside owned Projects.
- User cannot access Project-scoped data outside owned Projects.

### 8.2 Future Collaboration Access

Later, a Project owner may add Project members.

Future roles:

- Owner
- Member

Do not build this until the single-user Project/Task flow is complete.

### 8.3 Policy Table

| Action | Owner | Future Member | Non-member |
|---|---:|---:|---:|
| View Project | Yes | Future | No |
| Update Project | Yes | No | No |
| Build Workflow before Tasks exist | Yes | No | No |
| View Tasks | Yes | Future | No |
| Create/update Tasks | Yes | Future | No |
| Update Task stages | Yes | Future | No |
| Manage Follow-Up Actions | Yes | Future | No |
| Manage Document Links | Yes | Future | No |
| View History | Yes | Future | No |
| Manage Project Members | Future | No | No |

Use Laravel Policies for authorization. Prefer 404 for inaccessible resources that should not be discoverable.

---

## 9. Workflow Design

### 9.1 v1 Workflow Builder

The first MVP Workflow Builder is an ordered stage builder:

```text
Add stage → name stage → mark Mandatory/Optional → reorder stage → save workflow
```

The user builds a workflow per Project. Each Project has one workflow.

### 9.2 Mandatory and Optional Stages

Mandatory stages:

- Count toward progress percentage.
- Determine whether a Task is complete.
- Determine delayed status through the final mandatory stage.

Optional stages:

- Appear in the Task timeline.
- Do not count toward the main progress percentage.
- Do not block Task completion when marked Not_Applicable.
- Can still be completed when relevant.

### 9.3 Editing Workflow After Tasks Exist

To protect existing task history:

- Workflow stages can be edited freely before Tasks exist.
- After Tasks exist, existing Task Workflow Stages must not be silently overwritten.
- A future workflow rebuild feature may be designed later.

### 9.4 Task Stage Initialization

When a Task is created:

1. Confirm the Project has at least one mandatory ProjectWorkflowStage.
2. Fetch ProjectWorkflowStages ordered by `stage_order`.
3. Create TaskWorkflowStages by copying name, order, and mandatory flag.
4. Set all copied stages to Pending.

### 9.5 Future Workflow Extensibility

v1 must not implement advanced workflow behaviour. However, the model should leave room for future additions such as:

- branching;
- condition rules;
- runtime actions;
- connectors;
- extension points.

Guardrails:

- Keep future workflow concerns isolated around ProjectWorkflow and ProjectWorkflowStage.
- Do not spread assumptions about flat workflows across unrelated code.
- Keep Task stage initialization as the boundary where Project Workflow becomes Task Workflow Stages.
- Do not build future workflow behaviour now.

---

## 10. Status and Progress Logic

### 10.1 Stage Status

TaskWorkflowStage valid statuses:

```text
Pending
In_Progress
Completed
KIV
Not_Applicable
Blocked
To_Be_Confirmed
```

Any stage can move to any valid status. No strict linear progression is enforced.

### 10.2 Active Stage

Active stage selection:

1. If one or more stages are In_Progress, use the In_Progress stage with the highest `stage_order`.
2. If no stage is In_Progress, use the first mandatory stage that is not Completed and not Not_Applicable.
3. If all mandatory stages are Completed, the Task is complete.

### 10.3 Progress Percentage

```text
progress = completed_mandatory_stage_count / mandatory_stage_count * 100
```

Optional stages are shown in the timeline but excluded from the main percentage.

### 10.4 Delayed Task

```text
is_delayed = target_completion_date exists
           AND target_completion_date < today
           AND final mandatory stage is not Completed
```

Delayed status is computed on read in v1.

### 10.5 Overdue Follow-Up Action

```text
is_overdue = due_date < today
           AND status is not Done
           AND status is not Cancelled
```

Overdue status is computed on read in v1.

---

## 11. Dashboard Design

Dashboard is scoped to one selected Project.

Dashboard summary metrics:

| Metric | Calculation |
|---|---|
| Total Tasks | Count Tasks in selected Project |
| Completed Tasks | Count Tasks where final mandatory stage is Completed |
| In Progress Tasks | Count Tasks where final mandatory stage is not Completed |
| Delayed Tasks | Count Tasks where delayed rule is true |
| Overdue Follow-Ups | Count FollowUpActions where overdue rule is true |

Dashboard must not mix data across Projects.

Dashboard UI should include:

- Project selector or active Project heading.
- Summary cards.
- Task list/table/cards.
- Active stage indicator.
- Mandatory-stage progress percentage.
- Optional-stage indicators.
- Delayed badge.
- Overdue follow-up section.
- Search and filters.

---

## 12. UI Component Design

Use reusable React components.

Recommended components:

| Component | Purpose |
|---|---|
| `AuthenticatedLayout` | Shared authenticated shell |
| `ProjectSwitcher` | Select active Project |
| `ProjectCard` | Project summary |
| `WorkflowBuilder` | Build Project Workflow |
| `WorkflowStageList` | Ordered stage list |
| `StageRequirementBadge` | Mandatory/Optional label |
| `TaskCard` | Task summary |
| `TaskProgressTimeline` | Task stage timeline |
| `StatusBadge` | Status display |
| `DashboardSummaryCards` | Project metrics |
| `FollowUpActionPanel` | Follow-up action list/manage UI |
| `DocumentLinkList` | External document links |
| `HistoryTimeline` | Status change history |

UI guardrails:

- White-based layout.
- Clean spacing.
- MYDS-inspired typography and component discipline.
- FontAwesome icons.
- No dense enterprise-table-only interface for the main dashboard.
- Keep workflow builder simple for v1.

---

## 13. Validation and Error Handling

Validation errors:

- Missing Project name.
- Missing Workflow stage name.
- Workflow with no mandatory stage.
- Task creation before Project has mandatory Workflow stage.
- Invalid Task stage status.
- Invalid Follow-Up Action status.
- Invalid document URL.

Business rule errors:

- User cannot access another user's Project.
- User cannot create or update records outside owned Projects.
- Existing Task Workflow Stages must not be silently overwritten after workflow changes.

Auth errors:

- Unauthenticated users redirect to login.
- Inaccessible records should return 404 where resource discovery is a concern.

---

## 14. Events and History

Events:

| Event | Trigger | Listener |
|---|---|---|
| `TaskStageStatusChanged` | TaskWorkflowStage status changes | Writes AuditEntry |
| `FollowUpActionStatusChanged` | FollowUpAction status changes | Writes AuditEntry |

AuditEntry must include:

- Project ID.
- Entity type and ID.
- Field changed.
- Previous value.
- New value.
- User who changed it.
- Timestamp.

---

## 15. Testing Strategy

### Feature Tests

Cover:

- Login and authenticated access.
- Project creation.
- Project ownership access.
- Workflow building with mandatory/optional stages.
- Blocking Task creation when Project has no mandatory stage.
- Task creation copies Project Workflow stages.
- Task stage status update.
- Follow-Up Action create/update.
- Document Link create/view/remove.
- Dashboard summary counts.
- Search/filter within selected Project.
- Cross-project access denial.

### Unit Tests

Cover action classes and logic for:

- Progress percentage.
- Active stage selection.
- Delayed calculation.
- Overdue calculation.
- Month-end target date conversion.
- Audit entry creation.

### Property-Style Tests

Use selectively for:

- Month-end target conversion.
- Delayed calculation across date/status combinations.
- Overdue calculation across date/status combinations.
- Dashboard count consistency.

---

## 16. Local Development

The project is container-first.

Required on host:

- Docker Desktop
- Git
- Editor

Docker services:

| Container | Purpose |
|---|---|
| app | Laravel application |
| node | Frontend build tooling |
| db | MySQL |

Seeders should provide:

- Default local user.
- Sample Projects.
- Sample Project Workflows with mandatory and optional stages.
- Sample Tasks with varied stage statuses.
- Sample Follow-Up Actions.
- Sample Document Links.

Do not seed global roles for v1.

---

## 17. CI and Quality

CI should run on PRs and pushes to main.

Checks:

1. Composer install.
2. Frontend install/build as required for Inertia asset manifest.
3. Migrations.
4. PestPHP tests.
5. PHPStan.
6. Laravel Pint.

PRs should not be merged if CI fails.

---

## 18. Documentation

Required docs:

| File | Contents |
|---|---|
| `docs/architecture.md` | Project/Workflow/Task architecture |
| `docs/setup.md` | Container-first setup |
| `docs/project-structure.md` | Backend and frontend structure |
| `docs/workflow-status.md` | Workflow, mandatory/optional stages, status, progress, delayed, overdue logic |
| `docs/testing.md` | Testing approach |
| `docs/ci.md` | CI checks |
| `docs/user-guide.md` | User guide for Projects, Workflows, Tasks, and Dashboard |
| `docs/troubleshooting.md` | Common development issues |

README.md should link to the docs and include a quick start.

---

## 19. Pull Request and Task Rules

- Work from feature/spec/fix branches.
- Pull requests are required before merging into main.
- Each implementation task should map to a small GitHub Issue and PR.
- CI must pass before merge.
- Keep PRs small and reviewable.
- Spec-only PRs must not include application code.
