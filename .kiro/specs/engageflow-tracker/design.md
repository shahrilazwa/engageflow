# Design Document: EngageFlow Tracker

## 1. Purpose

EngageFlow is a Laravel + Inertia React application for tracking projects, custom workflows, tasks, deliverables, follow-up actions, document links, dashboards, and status history.

The v1 product is **project-first** and **single-user-first**. A user can create multiple Projects, define the workflow for each Project, create Tasks inside the Project, record expected Deliverables for each Task, and track progress visually. Collaboration is a future extension and must not block the first MVP.

Core v1 model:

```text
User
└── Project
    ├── Workflow Definition (JSONB)
    └── Tasks
        ├── Task Workflow Steps (relational progress snapshot)
        ├── Task Deliverables
        ├── Follow-Up Actions
        ├── Document Links
        └── Status History
```

If a user needs to track a different stream of work, they create another Project. Flexibility within a Project is handled by custom workflow definitions and mandatory/optional workflow steps.

---

## 2. Architecture Decisions

### 2.1 Agreed Stack

| Area | Decision | Notes |
|---|---|---|
| Backend framework | Laravel | Keep Laravel for MVP; it fits auth, policies, actions, migrations, tests, and dashboard workflows |
| Frontend | Inertia.js + React | Keep modern React UI without needing a separate API-first frontend/backend split |
| Database | PostgreSQL | Replaces MySQL because workflow definitions benefit from JSONB |
| Workflow definition storage | PostgreSQL JSONB | Source of truth for Project workflow design/configuration |
| Task progress storage | Relational tables | Query-heavy task status, progress, dashboard, deliverables, and audit data stay relational |
| ORM / data access | Eloquent ORM + Query Builder | Laravel-native; do not introduce Prisma in v1 |
| Authentication | Laravel session auth | Do not introduce Keycloak in v1 |
| Authorization | Laravel Policies | Do not introduce Spatie Permission in v1 |
| Styling | Tailwind CSS + MYDS-inspired components | White-based, clean, componentised UI |
| Tests | PestPHP | Feature, unit, and selected property-style tests |
| Local dev | Docker Compose | Container-first development |

### 2.2 Explicit Non-Decisions for v1

Do not introduce these in the first MVP:

- Prisma.
- Next.js or Nuxt rewrite.
- Keycloak / OIDC / SSO.
- Spatie Laravel Permission.
- MongoDB or full NoSQL storage.
- Separate public API.
- Microservices.
- Workflow automation engine.
- File upload or document repository integration.

These may be reconsidered later only when the product need is real.

---

## 3. Product Scope

### 3.1 In Scope for v1

- User can log in using Laravel session authentication.
- User can create and manage multiple Projects.
- Each Project has one Workflow Definition stored as JSONB.
- Workflow Definition supports ordered stage-style workflows for v1.
- Workflow steps can be named, ordered, and marked mandatory or optional.
- User can create Tasks only after the Project workflow has at least one mandatory step.
- Each Task receives relational Task Workflow Step rows copied from the Project Workflow Definition.
- User can update Task Workflow Step status.
- User can set a target completion date for a Task.
- User can record Task Deliverables such as documents, slide decks, spreadsheets, Figma/design files, repository links, URLs, or other outputs.
- Dashboard shows Project-scoped progress, delayed Tasks, overdue Follow-Up Actions, and Deliverable status indicators.
- User can add Follow-Up Actions to Tasks.
- User can add external Document Links to Tasks, Task Workflow Steps, Task Deliverables, and Follow-Up Actions.
- Status changes are recorded in Audit Entries.
- Project access is owner-only in the first MVP.

### 3.2 Future Extensions, Not v1

- Project members and collaboration.
- Cross-project dashboard.
- Starter workflow library.
- Branching workflow paths.
- Condition rules.
- Runtime actions.
- External connectors.
- Webhooks or extension hooks.
- Notifications.
- File uploads.
- External document repository integration.
- Mobile app or public API.
- Keycloak/OIDC SSO.
- Spatie-powered RBAC.

Design should leave room for future extensions without implementing them now.

---

## 4. System Architecture

### 4.1 Architecture Style

EngageFlow uses a **layered modular monolith**.

It remains one Laravel application. The codebase is organised by feature area using normal Laravel conventions. The goal is predictable Laravel code: thin controllers, form requests for validation, policies for authorization, action classes for business operations, Eloquent for data access, PostgreSQL for persistence, and JSONB for flexible workflow definitions.

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
Eloquent Models / Query Builder
        ↓
PostgreSQL
    ├── Relational tables
    └── JSONB workflow definitions
```

### 4.2 Data Layer Separation

PostgreSQL is the physical database. Eloquent is the application data access layer.

```text
Eloquent ORM / Query Builder = application data access
PostgreSQL relational tables = structured operational data
PostgreSQL JSONB = flexible workflow definition data
```

Use relational tables for records that need filtering, dashboard counts, audit history, joins, and access control. This includes Tasks, Task Workflow Steps, Task Deliverables, Follow-Up Actions, Document Links, and Audit Entries. Use JSONB for the Project Workflow Definition because its shape may evolve from ordered stages to richer workflow graphs later.

### 4.3 Request Flow

Write flow:

```text
React form submits through Inertia
→ Controller receives request
→ Form Request validates input
→ Policy checks Project access
→ Action performs business operation in transaction if needed
→ Event records history if needed
→ Controller redirects or returns Inertia response
```

Read flow:

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
| React/Inertia UI | Pages, forms, layouts, reusable components | No business rules beyond local UI behaviour |
| Routes | Map URLs to controllers | Keep grouped by feature |
| Controllers | Authorize, call actions, return Inertia responses | Keep thin |
| Form Requests | Validate HTTP input | Keep validation at boundary |
| Policies | Enforce Project ownership now and membership later | Never rely only on hidden UI |
| Actions | Business operations and transactions | Main home for workflow/task/deliverable rules |
| Models | Relationships, casts, simple helpers | Avoid complex workflows in models |
| Events/Listeners | Audit/history and future side effects | Keep side effects separate |
| PostgreSQL | Relational persistence and JSONB workflow definitions | Migrations are append-only after merge |

---

## 5. Code Organisation

Use normal Laravel conventions. Do not force an `app/Modules` structure unless it clearly helps.

### 5.1 Backend Structure

```text
app/
  Http/
    Controllers/
      Projects/
      Workflows/
      Tasks/
      Deliverables/
      FollowUps/
      Documents/
      Dashboard/
    Requests/
      Projects/
      Workflows/
      Tasks/
      Deliverables/
      FollowUps/
      Documents/
  Models/
    User.php
    Project.php
    ProjectWorkflow.php
    Task.php
    TaskWorkflowStep.php
    TaskDeliverable.php
    FollowUpAction.php
    DocumentLink.php
    AuditEntry.php
  Policies/
    ProjectPolicy.php
    TaskPolicy.php
    TaskWorkflowStepPolicy.php
    TaskDeliverablePolicy.php
    FollowUpActionPolicy.php
    DocumentLinkPolicy.php
  Actions/
    Projects/
    Workflows/
    Tasks/
    Deliverables/
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
    Deliverables/
    FollowUps/
    Documents/
    Shared/
```

Guardrails:

- Application screens are Inertia React.
- Blade is only for the root Inertia view.
- Keep components lego-style and reusable.
- Avoid one giant dashboard component.
- UI may hide unavailable actions, but backend policies must enforce access.

---

## 6. Domain Model

### 6.1 Entity Overview

```text
User
  └── Project
        ├── ProjectWorkflow (JSONB definition)
        └── Task
              ├── TaskWorkflowStep
              ├── TaskDeliverable
              ├── FollowUpAction
              └── DocumentLink

TaskWorkflowStep
  └── DocumentLink

TaskDeliverable
  └── DocumentLink

FollowUpAction
  └── DocumentLink

TaskWorkflowStep / TaskDeliverable / FollowUpAction
  └── AuditEntry
```

Future collaboration extension:

```text
Project
└── ProjectMember
    └── User
```

### 6.2 User

Fields:

- `id`
- `name`
- `email`
- `password`
- timestamps

Rules:

- No global role is required for v1.
- Laravel session auth is used in v1.
- Future Keycloak/OIDC can map external identities to local User records.

### 6.3 Project

Fields:

- `id`
- `owner_user_id`
- `name`
- `description` nullable
- timestamps

Rules:

- A Project belongs to one owner User.
- In v1, only the owner can access the Project.
- All child data must be scoped through Project ownership.

### 6.4 ProjectWorkflow

Fields:

- `id`
- `project_id`
- `definition` JSONB
- `version`
- timestamps

Rules:

- One Project has one ProjectWorkflow.
- `definition` is the source of truth for the Project workflow design.
- Keep this entity isolated as the extension point for future workflow capability.
- Do not create a relational table for each workflow design concern unless there is a clear reporting/query need.

Example v1 definition:

```json
{
  "version": 1,
  "type": "ordered_stages",
  "nodes": [
    {
      "id": "planning",
      "type": "stage",
      "label": "Perancangan",
      "mandatory": true,
      "order": 1,
      "position": { "x": 120, "y": 80 }
    },
    {
      "id": "review",
      "type": "stage",
      "label": "Semakan",
      "mandatory": false,
      "order": 2,
      "position": { "x": 380, "y": 80 }
    }
  ],
  "edges": [
    {
      "id": "planning_to_review",
      "from": "planning",
      "to": "review"
    }
  ]
}
```

### 6.5 Task

Fields:

- `id`
- `project_id`
- `title`
- `description` nullable
- `target_completion_date` nullable
- timestamps

Rules:

- A Task belongs to one Project.
- A Task receives relational workflow progress rows copied from the ProjectWorkflow definition at creation time.
- A Task can have zero or more Task Deliverables.
- Delayed status is computed on read.

### 6.6 TaskWorkflowStep

Fields:

- `id`
- `task_id`
- `workflow_node_id`
- `label_snapshot`
- `mandatory_snapshot`
- `step_order`
- `status`
- `completed_at` nullable
- timestamps

Rules:

- Created by reading `project_workflows.definition` when a Task is created.
- Stores snapshot values so Task history remains stable if the Project workflow changes later.
- Valid statuses: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed.
- `completed_at` is set when status becomes Completed.

### 6.7 TaskDeliverable

A Task Deliverable represents an expected output from a Task. It is different from a generic Document Link. A Deliverable answers: "What output must this Task produce?" A Document Link answers: "Where is the related file/reference?"

Fields:

- `id`
- `task_id`
- `title`
- `description` nullable
- `deliverable_type`
- `status`
- `due_date` nullable
- `remarks` nullable
- timestamps

Deliverable types for v1:

- Document
- Slide
- Spreadsheet
- Design
- Repository
- Link
- Other

Examples:

- Kertas cadangan document.
- Presentation slide deck.
- Costing spreadsheet.
- Figma design file.
- GitHub repository link.
- External reference URL.

Valid statuses for v1:

- Pending
- In_Progress
- Completed
- Not_Required

Rules:

- A Task can have multiple Deliverables.
- A Deliverable can have one or more Document Links attached to it.
- Deliverables are relational because they are useful for dashboard indicators, filtering, follow-up, and status tracking.
- Do not upload files in v1; store external links through DocumentLink.

### 6.8 FollowUpAction

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

### 6.9 DocumentLink

Fields:

- `id`
- `url`
- `label` nullable
- `linkable_type`
- `linkable_id`
- timestamps

Allowed parents:

- Task
- TaskWorkflowStep
- TaskDeliverable
- FollowUpAction

Rules:

- Store links only.
- Do not upload files in v1.
- Do not integrate with external document storage in v1.
- Access must be checked through the parent Project.

### 6.10 AuditEntry

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

- TaskWorkflowStep status changes.
- TaskDeliverable status changes.
- FollowUpAction status changes.

---

## 7. Workflow Design

### 7.1 v1 Workflow Builder

The first MVP Workflow Builder is an ordered stage builder backed by JSONB:

```text
Add stage → name stage → mark Mandatory/Optional → reorder stage → save workflow definition
```

The JSONB definition may include node IDs, labels, mandatory flags, ordering, visual positions, and simple edges. For v1, the workflow behaves as an ordered stage list.

### 7.2 Mandatory and Optional Steps

Mandatory steps:

- Count toward progress percentage.
- Determine whether a Task is complete.
- Determine delayed status through the final mandatory step.

Optional steps:

- Appear in the Task timeline.
- Do not count toward the main progress percentage.
- Do not block Task completion when marked Not_Applicable.
- Can still be completed when relevant.

### 7.3 Task Workflow Snapshot

When a Task is created:

1. Read the ProjectWorkflow JSONB definition.
2. Validate that it has at least one mandatory stage node.
3. Create TaskWorkflowStep rows by copying node ID, label, mandatory flag, and order.
4. Set all copied TaskWorkflowStep statuses to Pending.

TaskWorkflowStep rows are the operational progress state used by dashboard and reporting. The JSONB definition is not mutated when Task progress changes.

### 7.4 Editing Workflow After Tasks Exist

- Workflow definition can be edited freely before Tasks exist.
- After Tasks exist, existing TaskWorkflowStep rows must not be silently overwritten.
- A future workflow rebuild/migration feature may be designed later.

### 7.5 Future Workflow Extensibility

v1 must not implement advanced workflow behaviour. However, the JSONB model should leave room for future additions such as:

- branching;
- condition rules;
- runtime actions;
- connectors;
- extension points.

Guardrails:

- Keep future workflow concerns isolated around ProjectWorkflow.definition.
- Do not spread assumptions about flat workflows across unrelated code.
- Keep Task creation as the boundary where Workflow Definition becomes TaskWorkflowStep rows.
- Do not build future workflow behaviour now.

---

## 8. Access Control and RBAC

### 8.1 v1 Access Model

The first MVP is owner-only:

- User can view Projects they own.
- User cannot view Projects owned by another user.
- User can create, update, and manage data inside owned Projects.
- User cannot access Project-scoped data outside owned Projects.

Use Laravel Policies for authorization.

### 8.2 No Spatie in v1

Do not install Spatie Laravel Permission in v1.

Reason:

- v1 only needs owner-based Project access.
- Future collaboration can start with a simple ProjectMember table and policies.
- Spatie should only be reconsidered if roles and permissions become more complex than Owner/Member.

### 8.3 Future Collaboration Access

Future roles:

- Owner
- Member

Future access must remain application-level authorization. External identity providers should answer who the user is, not what Project the user can access.

### 8.4 Policy Table

| Action | Owner | Future Member | Non-member |
|---|---:|---:|---:|
| View Project | Yes | Future | No |
| Update Project | Yes | No | No |
| Build Workflow before Tasks exist | Yes | No | No |
| View Tasks | Yes | Future | No |
| Create/update Tasks | Yes | Future | No |
| Update Task workflow steps | Yes | Future | No |
| Manage Task Deliverables | Yes | Future | No |
| Manage Follow-Up Actions | Yes | Future | No |
| Manage Document Links | Yes | Future | No |
| View History | Yes | Future | No |
| Manage Project Members | Future | No | No |

Prefer 404 for inaccessible resources where resource discovery is a concern.

---

## 9. Authentication

### 9.1 v1 Auth

Use Laravel session-based authentication in v1.

Do not introduce Keycloak, OIDC, or external SSO for the first MVP.

### 9.2 Future Keycloak / OIDC

Keycloak or another OIDC provider may be added later when collaboration, organisation deployment, or SSO becomes a real need.

Future mapping can use local User records:

```text
external_provider = keycloak
external_id = OIDC subject identifier
```

Guardrail:

```text
Authentication answers: who is this user?
Application authorization answers: what Projects can this user access?
```

Project access must remain enforced by Laravel Policies.

---

## 10. Status and Progress Logic

### 10.1 Task Workflow Step Status

Valid statuses:

```text
Pending
In_Progress
Completed
KIV
Not_Applicable
Blocked
To_Be_Confirmed
```

Any step can move to any valid status. No strict linear progression is enforced in v1.

### 10.2 Active Step

Active step selection:

1. If one or more steps are In_Progress, use the In_Progress step with the highest `step_order`.
2. If no step is In_Progress, use the first mandatory step that is not Completed and not Not_Applicable.
3. If all mandatory steps are Completed, the Task is complete.

### 10.3 Progress Percentage

```text
progress = completed_mandatory_step_count / mandatory_step_count * 100
```

Optional steps are shown in the timeline but excluded from the main percentage.

### 10.4 Delayed Task

```text
is_delayed = target_completion_date exists
           AND target_completion_date < today
           AND final mandatory step is not Completed
```

Delayed status is computed on read in v1.

### 10.5 Overdue Follow-Up Action

```text
is_overdue = due_date < today
           AND status is not Done
           AND status is not Cancelled
```

Overdue status is computed on read in v1.

### 10.6 Deliverable Completion

```text
deliverable_is_complete = status is Completed OR status is Not_Required
```

Deliverables do not replace workflow progress. They provide output tracking for the Task. A Task can be workflow-complete while still having incomplete Deliverables, so the UI should show both workflow progress and Deliverable status separately.

---

## 11. Dashboard Design

Dashboard is scoped to one selected Project.

Metrics:

| Metric | Calculation |
|---|---|
| Total Tasks | Count Tasks in selected Project |
| Completed Tasks | Count Tasks where final mandatory step is Completed |
| In Progress Tasks | Count Tasks where final mandatory step is not Completed |
| Delayed Tasks | Count Tasks where delayed rule is true |
| Overdue Follow-Ups | Count FollowUpActions where overdue rule is true |
| Pending Deliverables | Count TaskDeliverables where status is Pending or In_Progress |

Dashboard must not mix data across Projects.

Dashboard UI should include:

- Project selector or active Project heading.
- Summary cards.
- Task list/table/cards.
- Active step indicator.
- Mandatory-step progress percentage.
- Deliverable status indicator.
- Optional-step indicators.
- Delayed badge.
- Overdue follow-up section.
- Search and filters.

---

## 12. UI Component Design

Recommended components:

| Component | Purpose |
|---|---|
| `AuthenticatedLayout` | Shared authenticated shell |
| `ProjectSwitcher` | Select active Project |
| `ProjectCard` | Project summary |
| `WorkflowBuilder` | Build Project workflow definition |
| `WorkflowCanvas` | Future-friendly visual area for workflow nodes; v1 may be simple list UI |
| `WorkflowStepList` | Ordered step list |
| `StepRequirementBadge` | Mandatory/Optional label |
| `TaskCard` | Task summary |
| `TaskProgressTimeline` | Task step timeline |
| `DeliverableList` | List Task Deliverables and their statuses |
| `DeliverableTypeBadge` | Show Document, Slide, Spreadsheet, Design, Repository, Link, or Other |
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
- Workflow Builder must stay simple in v1 but not be visually designed in a way that blocks a future canvas/graph builder.
- Deliverables should be visible on Task detail and summarized on Task cards without overwhelming the workflow timeline.

---

## 13. Validation and Error Handling

Validation errors:

- Missing Project name.
- Invalid Workflow Definition JSON shape.
- Workflow Definition with no mandatory stage node.
- Missing workflow stage label.
- Task creation before Project has valid mandatory workflow stage.
- Missing Task Deliverable title.
- Invalid Task Deliverable type.
- Invalid Task Deliverable status.
- Invalid Task workflow step status.
- Invalid Follow-Up Action status.
- Invalid document URL.

Business rule errors:

- User cannot access another user's Project.
- User cannot create or update records outside owned Projects.
- Existing TaskWorkflowStep rows must not be silently overwritten after workflow changes.

Auth errors:

- Unauthenticated users redirect to login.
- Inaccessible records should return 404 where resource discovery is a concern.

---

## 14. Events and History

Events:

| Event | Trigger | Listener |
|---|---|---|
| `TaskWorkflowStepStatusChanged` | TaskWorkflowStep status changes | Writes AuditEntry |
| `TaskDeliverableStatusChanged` | TaskDeliverable status changes | Writes AuditEntry |
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

Feature tests:

- Login and authenticated access.
- Project creation.
- Project ownership access.
- Workflow definition creation using JSONB.
- Workflow definition validation, including mandatory/optional nodes.
- Blocking Task creation when Project has no mandatory workflow node.
- Task creation copies workflow definition into TaskWorkflowStep rows.
- Task workflow step status update.
- Task Deliverable create/update/status change.
- Follow-Up Action create/update.
- Document Link create/view/remove for Tasks, Task Workflow Steps, Task Deliverables, and Follow-Up Actions.
- Dashboard summary counts.
- Search/filter within selected Project.
- Cross-project access denial.

Unit tests:

- Workflow definition validation.
- Workflow-to-task snapshot creation.
- Progress percentage.
- Active step selection.
- Delayed calculation.
- Overdue calculation.
- Deliverable completion calculation.
- Month-end target date conversion.
- Audit entry creation.

Property-style tests:

- Month-end target conversion.
- Delayed calculation across date/status combinations.
- Overdue calculation across date/status combinations.
- Dashboard count consistency.

---

## 16. Local Development

The project is container-first.

Host requirements:

- Docker Desktop
- Git
- Editor

Docker services:

| Container | Purpose |
|---|---|
| app | Laravel application |
| node | Frontend build tooling |
| db | PostgreSQL |

Seeders should provide:

- Default local user.
- Sample Projects.
- Sample Project Workflow definitions in JSONB.
- Sample Tasks with copied workflow steps and varied statuses.
- Sample Task Deliverables with different types and statuses.
- Sample Follow-Up Actions.
- Sample Document Links.

Do not seed global roles for v1.

---

## 17. CI and Quality

CI should run on PRs and pushes to main.

Checks:

1. Composer install.
2. Frontend install/build as required for Inertia asset manifest.
3. PostgreSQL database setup.
4. Migrations.
5. PestPHP tests.
6. PHPStan.
7. Laravel Pint.

PRs should not be merged if CI fails.

---

## 18. Documentation

Required docs:

| File | Contents |
|---|---|
| `docs/architecture.md` | Laravel/Inertia/PostgreSQL/JSONB architecture |
| `docs/setup.md` | Container-first PostgreSQL setup |
| `docs/project-structure.md` | Backend and frontend structure |
| `docs/workflow-status.md` | JSONB workflow definition, task snapshot, status, progress, delayed, overdue logic |
| `docs/deliverables.md` | Task Deliverables, types, statuses, and links |
| `docs/testing.md` | Testing approach |
| `docs/ci.md` | CI checks |
| `docs/user-guide.md` | User guide for Projects, Workflows, Tasks, Deliverables, and Dashboard |
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
