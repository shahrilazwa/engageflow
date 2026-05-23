# Design Document: EngageFlow Tracker

## 1. Purpose

EngageFlow is a Laravel + Inertia React application for visually designing project workflows and tracking work against those workflows.

The v1 product is **project-first**, **workflow-first**, **visual-builder-first**, and **single-user-first**. A user can create multiple Projects, visually design the workflow for each Project, create Tasks inside the Project, record expected Deliverables for each Task, and track progress through visual workflow steps, dashboards, follow-up actions, document links, and status history.

The **Visual Workflow Builder is a core v1 feature**. It is not a later enhancement. The first MVP must support visual creation of an ordered stage workflow using a canvas-like interface. The visual builder does not need automation, branching rules, runtime actions, hooks, connectors, or integrations in v1.

Core v1 model:

```text
User
└── Project
    ├── Visual Workflow Definition (PostgreSQL JSONB)
    │   ├── Workflow nodes
    │   ├── Workflow edges
    │   ├── Node positions
    │   └── Viewport/layout metadata
    └── Tasks
        ├── Task Workflow Steps (relational progress snapshot)
        ├── Task Deliverables
        ├── Follow-Up Actions
        ├── Document Links
        └── Status History
```

If a user needs to track a different stream of work, they create another Project. Flexibility inside a Project is handled by the visual workflow definition and mandatory/optional workflow steps.

---

## 2. Architecture Decisions

### 2.1 Agreed Stack

| Area | Decision | Notes |
|---|---|---|
| Backend framework | Laravel | Keep Laravel for MVP; it fits auth, policies, actions, migrations, tests, and dashboard workflows |
| Frontend | Inertia.js + React | Required because the visual workflow builder needs a rich React UI |
| Visual workflow UI | React-based canvas builder | Core v1 feature, not a future enhancement |
| Database | PostgreSQL | Replaces MySQL because workflow definitions benefit from JSONB |
| Workflow definition storage | PostgreSQL JSONB | Source of truth for visual Project workflow design and layout |
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
- Branching workflow execution.
- Conditional transitions.
- Runtime actions, connectors, webhooks, or hooks.
- File upload or document repository integration.

These may be reconsidered later only when the product need is real.

---

## 3. Product Scope

### 3.1 In Scope for v1

- User can log in using Laravel session authentication.
- User can create and manage multiple Projects.
- Each Project has one Visual Workflow Definition stored as JSONB.
- User can visually create and edit a Project Workflow using a canvas-like Visual Workflow Builder.
- Visual Workflow Builder supports ordered stage-style workflows for v1.
- User can add workflow stage nodes.
- User can edit workflow stage labels.
- User can mark workflow stage nodes as Mandatory or Optional.
- User can drag/reposition workflow nodes visually.
- User can reorder the workflow stage sequence.
- Visual Workflow Builder shows simple edges/connectors between ordered workflow stage nodes.
- Visual Workflow Builder stores node position and viewport data in JSONB so the visual layout can be restored later.
- User can create Tasks only after the Project workflow has at least one mandatory workflow node.
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

It remains one Laravel application. The codebase is organised by feature area using normal Laravel conventions. The goal is predictable Laravel code: thin controllers, form requests for validation, policies for authorization, action classes for business operations, Eloquent for data access, PostgreSQL for persistence, and JSONB for flexible visual workflow definitions.

```text
React / Inertia Pages and Components
    ├── Visual Workflow Builder
    │   ├── Workflow Canvas
    │   ├── Workflow Nodes
    │   ├── Workflow Edges
    │   ├── Step Inspector
    │   └── Builder Toolbar
    └── Project / Task / Dashboard Screens
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
    └── JSONB visual workflow definitions
```

### 4.2 Visual Workflow Builder Request Flow

Saving a visual workflow definition follows this flow:

```text
User edits workflow on React canvas
→ Workflow Builder updates local nodes/edges/viewport state
→ User saves workflow
→ Inertia submits JSON workflow definition
→ Controller receives request
→ Form Request validates workflow JSON shape
→ Policy checks Project access
→ Action validates business rules and saves ProjectWorkflow.definition JSONB
→ Controller redirects or returns updated Inertia props
```

Loading a visual workflow definition follows this flow:

```text
User opens Project Workflow Builder
→ Controller checks Project access
→ Query/action loads ProjectWorkflow.definition
→ Controller returns workflow definition as Inertia props
→ React Workflow Builder reconstructs nodes, edges, positions, and viewport
```

### 4.3 Task Creation Flow from Visual Workflow

Task creation converts the visual workflow definition into relational progress rows:

```text
User creates Task
→ Controller validates Task input
→ Policy checks Project access
→ Action reads ProjectWorkflow.definition JSONB
→ Action validates at least one mandatory stage node exists
→ Action creates Task
→ Action creates TaskWorkflowStep rows from workflow nodes
→ Controller redirects to Task or Project dashboard
```

The JSONB workflow definition is the Project-level design source of truth. `TaskWorkflowStep` rows are the Task-level operational progress snapshot.

### 4.4 Data Layer Separation

PostgreSQL is the physical database. Eloquent is the application data access layer.

```text
Eloquent ORM / Query Builder = application data access
PostgreSQL relational tables = structured operational data
PostgreSQL JSONB = flexible visual workflow definition data
```

Use relational tables for records that need filtering, dashboard counts, audit history, joins, and access control. This includes Tasks, Task Workflow Steps, Task Deliverables, Follow-Up Actions, Document Links, and Audit Entries.

Use JSONB for the Project Workflow Definition because its shape may evolve from ordered stages to richer workflow graphs later. The JSONB structure must include enough visual layout data to restore the canvas.

### 4.5 Layer Responsibilities

| Layer | Responsibility | Guardrail |
|---|---|---|
| React/Inertia UI | Pages, forms, layouts, reusable components, visual workflow builder | No trusted business rules beyond local UI behaviour |
| Workflow Canvas Components | Visual editing of nodes, edges, positions, viewport, selected step | Must remain reusable and isolated from Task/Dashboard logic |
| Routes | Map URLs to controllers | Keep grouped by feature |
| Controllers | Authorize, call actions, return Inertia responses | Keep thin |
| Form Requests | Validate HTTP input, including workflow JSON shape | Keep validation at boundary |
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
      WorkflowBuilder/
      Tasks/
      Deliverables/
      FollowUps/
      Documents/
      Dashboard/
    Requests/
      Projects/
      Workflows/
      WorkflowBuilder/
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
    ProjectWorkflowPolicy.php
    TaskPolicy.php
    TaskWorkflowStepPolicy.php
    TaskDeliverablePolicy.php
    FollowUpActionPolicy.php
    DocumentLinkPolicy.php
  Actions/
    Projects/
    Workflows/
      CreateDefaultWorkflow.php
      SaveVisualWorkflowDefinition.php
      ValidateWorkflowDefinition.php
      CreateTaskWorkflowSnapshot.php
    WorkflowBuilder/
      NormalizeWorkflowDefinition.php
      ReorderWorkflowNodes.php
    Tasks/
    Deliverables/
    FollowUps/
    Documents/
    Dashboard/
    Audit/
  Events/
  Listeners/
```

Backend guardrails:

- Workflow JSON validation must be server-side, not only in React.
- The save workflow action must validate node IDs, labels, mandatory flags, order, positions, and edges.
- Task creation must use an action to copy workflow nodes into `TaskWorkflowStep` rows.
- Do not scatter workflow JSON parsing across controllers, models, and dashboard queries.

### 5.2 Frontend Structure

```text
resources/js/
  Layouts/
    AuthenticatedLayout.tsx
  Pages/
    Dashboard/
    Projects/
    Workflows/
      Builder.tsx
    Tasks/
  Components/
    Projects/
    Workflows/
      WorkflowBuilder.tsx
      WorkflowCanvas.tsx
      WorkflowNode.tsx
      WorkflowEdge.tsx
      WorkflowStepInspector.tsx
      WorkflowToolbar.tsx
      WorkflowStepList.tsx
      WorkflowMiniMap.tsx        // optional, only if simple
      WorkflowEmptyState.tsx
    Tasks/
    Deliverables/
    FollowUps/
    Documents/
    Shared/
```

Frontend guardrails:

- Application screens are Inertia React.
- Blade is only for the root Inertia view.
- Visual Workflow Builder is a core v1 screen and should be implemented early.
- Keep workflow builder components lego-style and reusable.
- Keep workflow canvas state isolated from Task and Dashboard components.
- Avoid one giant workflow builder component.
- Avoid one giant dashboard component.
- UI may hide unavailable actions, but backend policies must enforce access.

---

## 6. Feature Areas / Modules

| Feature Area | Responsibility |
|---|---|
| Project Management | Create, update, list, and select Projects owned by the user |
| Visual Workflow Builder | Canvas-like creation and editing of Project workflow nodes, edges, positions, order, and mandatory/optional settings |
| Workflow Definition Management | Validate, normalize, save, and load `ProjectWorkflow.definition` JSONB |
| Task Tracking | Create, update, list, search, and filter Tasks inside a Project |
| Task Workflow Snapshot | Convert Project workflow JSONB nodes into relational TaskWorkflowStep rows |
| Stage / Step Tracking | Update copied Task Workflow Step status and completion date |
| Deliverable Tracking | Create, update, list, and track expected Task outputs |
| Follow-Up Tracking | Create, update, list, and flag overdue Follow-Up Actions |
| Document Links | Store and display external links attached to allowed parent records |
| Dashboard | Show Project-scoped summary, progress, delayed tasks, pending deliverables, and overdue follow-ups |
| History | Record and display status change history |
| Access Control | Enforce owner-only access in v1, prepare for Project members later |

Feature dependency rules:

- Project Management owns Projects.
- Visual Workflow Builder edits ProjectWorkflow JSONB definition.
- Workflow Definition Management validates and persists the JSONB definition.
- Task Tracking creates Tasks but must call Task Workflow Snapshot logic to create TaskWorkflowStep rows.
- Stage / Step Tracking updates copied TaskWorkflowStep rows only.
- Dashboard reads relational operational data, not raw workflow JSON, wherever possible.
- History listens to status changes and records Audit Entries.
- Future collaboration must not be implemented before the single-user flow is stable.

---

## 7. Domain Model

### 7.1 Entity Overview

```text
User
  └── Project
        ├── ProjectWorkflow
        │     └── definition JSONB
        │           ├── nodes[]
        │           ├── edges[]
        │           └── viewport/layout metadata
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

### 7.2 User

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

### 7.3 Project

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
- Each Project has one ProjectWorkflow.

### 7.4 ProjectWorkflow

Fields:

- `id`
- `project_id`
- `definition` JSONB
- `version`
- timestamps

Rules:

- One Project has one ProjectWorkflow.
- `definition` is the source of truth for the Project workflow design and visual layout.
- The visual builder reads from and writes to `definition`.
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
  ],
  "viewport": {
    "x": 0,
    "y": 0,
    "zoom": 1
  }
}
```

### 7.5 Workflow Node JSON Shape

Each v1 workflow node should contain:

- `id`: stable unique node identifier within the workflow.
- `type`: `stage` for v1.
- `label`: user-facing stage name.
- `mandatory`: boolean.
- `order`: numeric order for v1 ordered stage sequence.
- `position`: visual canvas coordinates.

V1 does not require multiple node types. Future node types may be added later.

### 7.6 Workflow Edge JSON Shape

Each v1 workflow edge should contain:

- `id`: stable unique edge identifier within the workflow.
- `from`: source node ID.
- `to`: target node ID.

For v1, edges visually connect ordered stages. They do not represent conditional execution.

### 7.7 Task

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

### 7.8 TaskWorkflowStep

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

### 7.9 TaskDeliverable

A Task Deliverable represents an expected output from a Task. It is different from a generic Document Link. A Deliverable answers: “What output must this Task produce?” A Document Link answers: “Where is the related file/reference?”

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

### 7.10 FollowUpAction

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

### 7.11 DocumentLink

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

### 7.12 AuditEntry

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

## 8. Visual Workflow Builder Design

### 8.1 v1 Visual Workflow Builder

The visual Workflow Builder is in scope for v1 because it is the core differentiator of the app.

V1 builder behaviour:

```text
Open Project Workflow
→ Add stage node
→ Name stage
→ Mark Mandatory/Optional
→ Drag/reposition stage visually
→ Reorder stage sequence
→ Save workflow definition
→ Reload workflow definition later with layout preserved
```

The visual builder should show workflow nodes on a canvas-like area. V1 keeps the underlying logic as an ordered stage sequence, but the user experience should feel visual rather than only a plain form/table.

### 8.2 Visual Builder Modules

| UI Module | Responsibility |
|---|---|
| WorkflowBuilder | Parent component that owns builder state and save/load behaviour |
| WorkflowCanvas | Canvas-like area for rendering nodes and edges |
| WorkflowNode | Individual draggable stage node |
| WorkflowEdge | Simple connector between ordered stage nodes |
| WorkflowStepInspector | Side panel or drawer for editing selected node label and Mandatory/Optional setting |
| WorkflowToolbar | Add stage, save workflow, reset layout, fit view, and other builder actions |
| WorkflowStepList | Ordered list view/fallback panel for sequence review and reorder |
| WorkflowEmptyState | First-use state prompting user to add the first stage |

### 8.3 Visual Builder Interaction Scope

In scope for v1:

- Add a stage node.
- Edit stage label.
- Mark stage Mandatory or Optional.
- Move/reposition stage node visually.
- Reorder the stage sequence.
- Show simple connecting edges between ordered stages.
- Save and reload the visual layout from JSONB.
- Show empty state before the first node is added.
- Prevent saving a workflow with zero mandatory nodes.

Not in scope for v1:

- Branching paths.
- Conditional transitions.
- Runtime execution.
- External connectors.
- Webhooks or hooks.
- Automation actions.

### 8.4 JSONB Workflow Definition

The JSONB definition stores both workflow meaning and visual layout:

- node ID;
- node type;
- label;
- mandatory flag;
- order;
- position;
- simple ordered edges;
- viewport state if useful.

The same JSONB structure should be future-friendly enough for graph features later, even though v1 behaves as an ordered stage workflow.

### 8.5 Mandatory and Optional Steps

Mandatory steps:

- Count toward progress percentage.
- Determine whether a Task is complete.
- Determine delayed status through the final mandatory step.

Optional steps:

- Appear in the Task timeline.
- Do not count toward the main progress percentage.
- Do not block Task completion when marked Not_Applicable.
- Can still be completed when relevant.

### 8.6 Task Workflow Snapshot

When a Task is created:

1. Read the ProjectWorkflow JSONB definition.
2. Validate that it has at least one mandatory stage node.
3. Create TaskWorkflowStep rows by copying node ID, label, mandatory flag, and order.
4. Set all copied TaskWorkflowStep statuses to Pending.

TaskWorkflowStep rows are the operational progress state used by dashboard and reporting. The JSONB definition is not mutated when Task progress changes.

### 8.7 Editing Workflow After Tasks Exist

- Workflow definition can be edited freely before Tasks exist.
- After Tasks exist, existing TaskWorkflowStep rows must not be silently overwritten.
- A future workflow rebuild/migration feature may be designed later.

### 8.8 Future Workflow Extensibility

V1 must not implement advanced workflow behaviour. However, the JSONB model and visual builder should leave room for future additions such as:

- branching;
- condition rules;
- runtime actions;
- connectors;
- extension points.

Guardrails:

- Keep future workflow concerns isolated around ProjectWorkflow.definition and visual Workflow Builder components.
- Do not spread assumptions about flat workflows across unrelated code.
- Keep Task creation as the boundary where Workflow Definition becomes TaskWorkflowStep rows.
- Do not build future workflow behaviour now.

---

## 9. Access Control and RBAC

### 9.1 v1 Access Model

The first MVP is owner-only:

- User can view Projects they own.
- User cannot view Projects owned by another user.
- User can create, update, and manage data inside owned Projects.
- User cannot access Project-scoped data outside owned Projects.

Use Laravel Policies for authorization.

### 9.2 No Spatie in v1

Do not install Spatie Laravel Permission in v1.

Reason:

- V1 only needs owner-based Project access.
- Future collaboration can start with a simple ProjectMember table and policies.
- Spatie should only be reconsidered if roles and permissions become more complex than Owner/Member.

### 9.3 Future Collaboration Access

Future roles:

- Owner
- Member

Future access must remain application-level authorization. External identity providers should answer who the user is, not what Project the user can access.

### 9.4 Policy Table

| Action | Owner | Future Member | Non-member |
|---|---:|---:|---:|
| View Project | Yes | Future | No |
| Update Project | Yes | No | No |
| Open Workflow Builder | Yes | Future | No |
| Save Workflow Definition before Tasks exist | Yes | No | No |
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

## 10. Authentication

### 10.1 v1 Auth

Use Laravel session-based authentication in v1.

Do not introduce Keycloak, OIDC, or external SSO for the first MVP.

### 10.2 Future Keycloak / OIDC

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

## 11. Status and Progress Logic

### 11.1 Task Workflow Step Status

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

### 11.2 Active Step

Active step selection:

1. If one or more steps are In_Progress, use the In_Progress step with the highest `step_order`.
2. If no step is In_Progress, use the first mandatory step that is not Completed and not Not_Applicable.
3. If all mandatory steps are Completed, the Task is complete.

### 11.3 Progress Percentage

```text
progress = completed_mandatory_step_count / mandatory_step_count * 100
```

Optional steps are shown in the timeline but excluded from the main percentage.

### 11.4 Delayed Task

```text
is_delayed = target_completion_date exists
           AND target_completion_date < today
           AND final mandatory step is not Completed
```

Delayed status is computed on read in v1.

### 11.5 Overdue Follow-Up Action

```text
is_overdue = due_date < today
           AND status is not Done
           AND status is not Cancelled
```

Overdue status is computed on read in v1.

### 11.6 Deliverable Completion

```text
deliverable_is_complete = status is Completed OR status is Not_Required
```

Deliverables do not replace workflow progress. They provide output tracking for the Task. A Task can be workflow-complete while still having incomplete Deliverables, so the UI should show both workflow progress and Deliverable status separately.

---

## 12. Dashboard Design

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
- Link/button to open Visual Workflow Builder.
- Summary cards.
- Task list/table/cards.
- Active step indicator.
- Mandatory-step progress percentage.
- Deliverable status indicator.
- Optional-step indicators.
- Delayed badge.
- Overdue follow-up section.
- Search and filters.

Dashboard should not parse complex workflow JSON for routine counts. It should rely on relational TaskWorkflowStep rows for task progress.

---

## 13. UI Component Design

Recommended components:

| Component | Purpose |
|---|---|
| `AuthenticatedLayout` | Shared authenticated shell |
| `ProjectSwitcher` | Select active Project |
| `ProjectCard` | Project summary |
| `WorkflowBuilder` | Parent visual workflow builder component |
| `WorkflowCanvas` | Canvas-like visual area for workflow nodes; in scope for v1 |
| `WorkflowNode` | Individual draggable workflow stage node |
| `WorkflowEdge` | Simple visual connector between ordered stages |
| `WorkflowStepInspector` | Edit selected stage label and Mandatory/Optional setting |
| `WorkflowToolbar` | Add stage, save workflow, fit view, reset layout, and related builder actions |
| `WorkflowStepList` | Ordered step list / fallback editing panel |
| `WorkflowEmptyState` | First-use state before workflow nodes exist |
| `StepRequirementBadge` | Mandatory/Optional label |
| `TaskCard` | Task summary |
| `TaskProgressTimeline` | Task step timeline copied from workflow snapshot |
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
- Visual Workflow Builder is a core v1 screen and should be designed early.
- Workflow Builder must support a canvas-like experience in v1 while keeping logic limited to ordered stages.
- Deliverables should be visible on Task detail and summarized on Task cards without overwhelming the workflow timeline.

---

## 14. Validation and Error Handling

Validation errors:

- Missing Project name.
- Invalid Workflow Definition JSON shape.
- Workflow Definition with no mandatory stage node.
- Missing workflow node ID.
- Duplicate workflow node ID.
- Missing workflow stage label.
- Missing workflow node position when saving from the visual builder.
- Invalid workflow edge referencing missing node ID.
- Invalid or duplicate workflow node order.
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

## 15. Events and History

Events:

| Event | Trigger | Listener |
|---|---|---|
| `ProjectWorkflowDefinitionSaved` | Visual Workflow Definition is saved | Future audit or activity feed hook |
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

V1 may record workflow save history later, but TaskWorkflowStep, TaskDeliverable, and FollowUpAction status changes are the priority audit events.

---

## 16. Testing Strategy

Feature tests:

- Login and authenticated access.
- Project creation.
- Project ownership access.
- Visual Workflow Builder page can be opened for owned Project.
- Visual Workflow Builder cannot be opened for another user's Project.
- Visual Workflow Builder saves JSONB workflow definition with nodes, positions, edges, mandatory flags, and order.
- Visual Workflow Builder reloads saved layout correctly.
- Workflow definition validation rejects missing node IDs, duplicate node IDs, missing labels, invalid edges, missing positions, missing mandatory nodes, and invalid order.
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
- Workflow definition normalization.
- Workflow-to-task snapshot creation.
- Progress percentage.
- Active step selection.
- Delayed calculation.
- Overdue calculation.
- Deliverable completion calculation.
- Month-end target date conversion.
- Audit entry creation.

Property-style tests:

- Workflow definition validation across generated node/edge combinations.
- Month-end target conversion.
- Delayed calculation across date/status combinations.
- Overdue calculation across date/status combinations.
- Dashboard count consistency.

---

## 17. Local Development

The project is container-first.

Host requirements:

- Docker Desktop
- Git
- Editor

Docker services:

| Container | Purpose |
|---|---|
| app | Laravel application |
| node | Frontend build tooling for Inertia React and visual workflow builder |
| db | PostgreSQL |

Seeders should provide:

- Default local user.
- Sample Projects.
- Sample Project Workflow definitions in JSONB with visual node positions, edges, and viewport metadata.
- Sample Tasks with copied workflow steps and varied statuses.
- Sample Task Deliverables with different types and statuses.
- Sample Follow-Up Actions.
- Sample Document Links.

Do not seed global roles for v1.

---

## 18. CI and Quality

CI should run on PRs and pushes to main.

Checks:

1. Composer install.
2. Frontend install/build as required for Inertia asset manifest and visual builder components.
3. PostgreSQL database setup.
4. Migrations.
5. PestPHP tests.
6. PHPStan.
7. Laravel Pint.

PRs should not be merged if CI fails.

---

## 19. Documentation

Required docs:

| File | Contents |
|---|---|
| `docs/architecture.md` | Laravel/Inertia/PostgreSQL/JSONB architecture with visual workflow builder as core module |
| `docs/setup.md` | Container-first PostgreSQL setup |
| `docs/project-structure.md` | Backend and frontend structure, including WorkflowBuilder components/actions |
| `docs/workflow-status.md` | JSONB workflow definition, task snapshot, status, progress, delayed, overdue logic |
| `docs/workflow-builder.md` | Visual Workflow Builder behaviour, JSONB layout, node/edge rules, validation, and v1 limitations |
| `docs/deliverables.md` | Task Deliverables, types, statuses, and links |
| `docs/testing.md` | Testing approach including visual workflow builder validation |
| `docs/ci.md` | CI checks |
| `docs/user-guide.md` | User guide for Projects, Visual Workflows, Tasks, Deliverables, and Dashboard |
| `docs/troubleshooting.md` | Common development issues |

README.md should link to the docs and include a quick start.

---

## 20. Implementation Sequencing Guardrail

Because the visual workflow builder is the core product experience, implementation should not postpone it until the end.

Recommended early sequencing:

1. PostgreSQL and base data model.
2. Project ownership and ProjectWorkflow JSONB storage.
3. Visual Workflow Builder shell and JSONB save/load.
4. Workflow definition validation and normalization.
5. Task creation from workflow snapshot.
6. Task progress/dashboard.
7. Deliverables, follow-ups, document links, and history.

Do not build a full automation engine while implementing the visual builder. V1 visual builder means visual ordered-stage workflow creation only.

---

## 21. Pull Request and Task Rules

- Work from feature/spec/fix branches.
- Pull requests are required before merging into main.
- Each implementation task should map to a small GitHub Issue and PR.
- CI must pass before merge.
- Keep PRs small and reviewable.
- Spec-only PRs must not include application code.
