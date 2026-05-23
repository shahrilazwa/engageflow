# Implementation Plan: EngageFlow Tracker

## Overview

This plan realigns implementation with the updated EngageFlow product model:

```text
Project
→ Visual Workflow Definition stored as PostgreSQL JSONB
→ Task
→ TaskWorkflowStep relational snapshot
→ TaskDeliverable
→ FollowUpAction
→ DocumentLink
→ AuditEntry
→ Project Dashboard
```

The v1 product is **project-first**, **workflow-first**, **visual-builder-first**, and **single-user-first**.

The Visual Workflow Builder and `WorkflowCanvas` are core v1 functionality. They must be implemented early and must not be postponed until after dashboard or reporting work.

## Implementation Guardrails

- Use Laravel + Inertia React.
- Use PostgreSQL for v1.
- Use PostgreSQL JSONB for `ProjectWorkflow.definition`.
- Use relational tables for Tasks, TaskWorkflowSteps, TaskDeliverables, FollowUpActions, DocumentLinks, AuditEntries, and dashboard counts.
- Use Eloquent ORM and Laravel Query Builder.
- Use Laravel session auth for v1.
- Use Laravel Policies for authorization.
- Use Inertia React pages for application screens.
- Use Blade only for the root Inertia view, normally `resources/views/app.blade.php`.
- Do not create Blade pages, Blade layouts, or Blade components for app screens.
- Build frontend UI in lego-style reusable React components.
- Avoid giant page components that mix layout, data display, forms, workflow canvas logic, and business rules in one file.
- Keep WorkflowCanvas, WorkflowNode, WorkflowEdge, WorkflowStepInspector, WorkflowToolbar, TaskProgressTimeline, TaskCard, DeliverableList, DocumentLinkList, and shared UI components separated by responsibility.
- Do not introduce Prisma in v1.
- Do not rewrite to Next.js or Nuxt in v1.
- Do not introduce Keycloak/OIDC/SSO in v1.
- Do not introduce Spatie Laravel Permission in v1.
- Do not introduce MongoDB or full NoSQL storage in v1.
- Do not build a workflow automation engine in v1.
- Do not implement branching, conditional execution, runtime actions, connectors, webhooks, hooks, or file uploads in v1.
- Keep PRs small and reviewable. One implementation task should map to one GitHub Issue and one Pull Request.

---

## Baseline Already Implemented

The repository already has the earlier foundation work merged. These are treated as baseline, not as new tasks to redo.

- [x] B1. Docker Compose Laravel foundation exists
- [x] B2. GitHub Actions CI exists
- [x] B3. GitHub project management setup exists
- [x] B4. Documentation skeleton exists
- [x] B5. Inertia React frontend toolchain exists
- [x] B6. Session-based login/logout exists

Important: because the product model changed after these baseline tasks, several alignment tasks below must update the existing implementation safely rather than recreate the project.

---

## Milestone 1 — Architecture Realignment

---

- [ ] 1. Switch local and CI database from MySQL to PostgreSQL
  - Milestone: Architecture Realignment
  - Labels: setup, backend, ci
  - Depends on: baseline
  - Description: Replace the current MySQL-based local and CI database configuration with PostgreSQL. This is required before implementing JSONB workflow definitions.
  - Linked requirement/design: Requirement 18.2, 18.3; Design — Architecture Decisions; Design — Data Layer Separation
  - Acceptance checklist:
    - [ ] `docker-compose.yml` uses a PostgreSQL service for `db`
    - [ ] `.env.example` uses PostgreSQL connection settings
    - [ ] `.env.ci` uses PostgreSQL connection settings
    - [ ] GitHub Actions CI uses a PostgreSQL service container
    - [ ] PHP dependencies/extensions support PostgreSQL (`pdo_pgsql`)
    - [ ] Existing migrations run successfully against PostgreSQL
    - [ ] Existing tests pass against PostgreSQL
    - [ ] Any MySQL-specific assumptions are removed or documented for later cleanup
  - Test expectation: CI passes using PostgreSQL. Existing auth tests still pass.
  - Documentation expectation: Update `docs/setup.md` and `docs/ci.md` with PostgreSQL notes if those files already contain MySQL instructions.

---

- [ ] 2. Align authentication model with owner-only v1 access
  - Milestone: Architecture Realignment
  - Labels: backend, auth, refactor
  - Depends on: Task 1
  - Description: Remove the old global Admin/Lead/Member product assumption from v1 access control. Keep Laravel session authentication, but make project authorization owner-based using Laravel Policies. Do not add user management, global roles, Keycloak, or Spatie.
  - Linked requirement/design: Requirement 1, 16, 17; Design — Authentication; Design — Access Control and RBAC
  - Acceptance checklist:
    - [ ] User model remains compatible with existing login/logout
    - [ ] No new global Admin management feature is introduced
    - [ ] Existing role-related code is either removed, ignored, or documented as legacy pending cleanup
    - [ ] Project access decisions are prepared to use Laravel Policies
    - [ ] Tests confirm unauthenticated users are redirected to login
    - [ ] Tests confirm authenticated users can access the authenticated shell/dashboard placeholder
  - Test expectation: Auth feature tests pass. Add or update tests where role assumptions changed.
  - Documentation expectation: Update `docs/architecture.md` if it still refers to global roles as v1 core functionality.

---

- [ ] 3. Update documentation skeleton for the new model
  - Milestone: Architecture Realignment
  - Labels: documentation
  - Depends on: Task 1
  - Description: Update docs placeholders and README links so documentation reflects the new Project, Visual Workflow Builder, WorkflowCanvas, PostgreSQL JSONB, TaskDeliverable, and Project Dashboard model.
  - Linked requirement/design: Design — Documentation
  - Acceptance checklist:
    - [ ] `docs/workflow-builder.md` exists
    - [ ] `docs/deliverables.md` exists
    - [ ] `docs/architecture.md` headings mention PostgreSQL JSONB and WorkflowCanvas
    - [ ] `docs/project-structure.md` headings mention WorkflowBuilder and WorkflowCanvas components/actions
    - [ ] `docs/project-structure.md` documents lego-style React component expectations
    - [ ] `docs/project-structure.md` documents that Blade is only for the root Inertia view
    - [ ] `docs/workflow-status.md` headings mention TaskWorkflowStep snapshots
    - [ ] `docs/user-guide.md` headings mention Projects, Visual Workflows, Tasks, Deliverables, and Dashboard
    - [ ] README links include all required docs
    - [ ] Old Agency Owner, Service, Special Project, and global Admin wording is removed from docs headings where present
  - Test expectation: No automated tests. Manual verification that files and README links exist.
  - Documentation expectation: This task is documentation-only.

---

## Milestone 2 — Project and Workflow Storage

---

- [ ] 4. Implement Project model, migration, policy, and basic screens
  - Milestone: Project and Workflow Storage
  - Labels: feature, backend, frontend
  - Depends on: Task 2
  - Description: Implement Projects as the top-level workspace. A User can create multiple Projects. In v1, only the Project owner can access the Project.
  - Linked requirement/design: Requirement 2, 16; Design — Project; Design — Access Control
  - Acceptance checklist:
    - [ ] `projects` table exists with `id`, `owner_user_id`, `name`, `description`, timestamps
    - [ ] `Project` model belongs to owner User
    - [ ] `User` model has project relationship for owned Projects
    - [ ] `ProjectPolicy` enforces owner-only access in v1
    - [ ] Project index screen lists only Projects owned by the current User
    - [ ] Project create screen allows name and optional description
    - [ ] Project update action allows owner to update name and description
    - [ ] Project screens are Inertia React pages, not Blade pages
    - [ ] Project UI uses reusable React components instead of one large page component
    - [ ] Non-owner access returns 404 or 403 according to project access guardrail
  - Test expectation: Feature tests for create Project, list owned Projects only, update own Project, block access to another user's Project.
  - Documentation expectation: None beyond existing docs skeleton.

---

- [ ] 5. Implement ProjectWorkflow JSONB storage
  - Milestone: Project and Workflow Storage
  - Labels: feature, backend
  - Depends on: Task 4
  - Description: Add `ProjectWorkflow` as the Project-level workflow definition holder. Store the visual workflow definition in PostgreSQL JSONB. This is the design-time workflow source of truth.
  - Linked requirement/design: Requirement 4; Design — ProjectWorkflow; Design — JSONB Workflow Definition
  - Acceptance checklist:
    - [ ] `project_workflows` table exists with `id`, `project_id`, `definition` JSONB, `version`, timestamps
    - [ ] Each Project has one ProjectWorkflow
    - [ ] Project creation creates an empty/default ProjectWorkflow
    - [ ] `ProjectWorkflow` model casts `definition` to array
    - [ ] Default workflow definition includes `version`, `type`, `nodes`, `edges`, and optional `viewport`
    - [ ] Only Project owner can view or update the workflow definition in v1
  - Test expectation: Feature/unit tests for ProjectWorkflow creation with Project, JSONB cast, owner-only access.
  - Documentation expectation: Add early notes to `docs/workflow-builder.md` about JSONB shape.

---

- [ ] 6. Implement workflow definition validation and normalization
  - Milestone: Project and Workflow Storage
  - Labels: feature, backend, test
  - Depends on: Task 5
  - Description: Implement server-side validation for visual workflow definitions. React validation may exist later, but server-side validation is mandatory.
  - Linked requirement/design: Requirement 4.8, 4.9; Design — Validation and Error Handling
  - Acceptance checklist:
    - [ ] `ValidateWorkflowDefinition` action/service validates workflow JSON shape
    - [ ] Validation rejects missing node IDs
    - [ ] Validation rejects duplicate node IDs
    - [ ] Validation rejects missing node labels
    - [ ] Validation rejects missing node positions
    - [ ] Validation rejects invalid or duplicate node order
    - [ ] Validation rejects edges pointing to missing nodes
    - [ ] Validation rejects workflows with no mandatory node
    - [ ] `NormalizeWorkflowDefinition` produces stable node/edge/order structure for saving
  - Test expectation: Unit tests for all validation failures and a valid minimal workflow.
  - Documentation expectation: Document validation rules in `docs/workflow-builder.md`.

---

- [ ] 7. Implement workflow structural change detection
  - Milestone: Project and Workflow Storage
  - Labels: feature, backend, test
  - Depends on: Task 6
  - Description: Detect structural workflow changes after Tasks exist. V1 allows layout-only changes after Tasks exist, but blocks structural changes that would invalidate TaskWorkflowStep snapshots.
  - Linked requirement/design: Requirement 3.14–3.17, 4.12; Design — Editing Workflow After Tasks Exist
  - Acceptance checklist:
    - [ ] `DetectWorkflowStructuralChange` action compares old and new workflow definitions
    - [ ] Layout-only changes to node position and viewport are allowed
    - [ ] Adding nodes after Tasks exist is blocked
    - [ ] Removing nodes after Tasks exist is blocked
    - [ ] Changing labels after Tasks exist is blocked
    - [ ] Changing mandatory flags after Tasks exist is blocked
    - [ ] Changing node order after Tasks exist is blocked
    - [ ] Changing edges after Tasks exist is blocked
    - [ ] Error message clearly explains that structural workflow migration/rebuild is future scope
  - Test expectation: Unit tests for each structural change case and allowed layout-only change.
  - Documentation expectation: Document the rule in `docs/workflow-builder.md`.

---

## Milestone 3 — Visual Workflow Builder and WorkflowCanvas

---

- [ ] 8. Build Visual Workflow Builder route, page shell, and layout
  - Milestone: Visual Workflow Builder
  - Labels: feature, frontend, backend
  - Depends on: Task 5
  - Description: Create the Project Workflow Builder page and route. This is the entry point for editing the Project workflow.
  - Linked requirement/design: Requirement 3; Design — Visual Workflow Builder Request Flow; Design — UI Component Design
  - Acceptance checklist:
    - [ ] Route exists to open the Workflow Builder for a Project
    - [ ] Controller loads Project and ProjectWorkflow for authorized owner
    - [ ] Inertia page `Pages/Workflows/Builder.tsx` exists
    - [ ] Page uses authenticated layout
    - [ ] Page receives workflow definition as props
    - [ ] Page is not implemented as a Blade view
    - [ ] Page composes reusable React components instead of containing the whole builder in one file
    - [ ] Dashboard or Project screen includes link/button to open Workflow Builder
    - [ ] Non-owner access is blocked
  - Test expectation: Feature tests for owner can open builder and non-owner cannot.
  - Documentation expectation: None.

---

- [ ] 9. Implement WorkflowCanvas component shell and JSONB rendering
  - Milestone: Visual Workflow Builder
  - Labels: feature, frontend
  - Depends on: Task 8
  - Description: Implement the first version of `WorkflowCanvas` as the design-time surface for Project workflows. It should render nodes, edges, positions, selected node state, and empty state from JSONB props.
  - Linked requirement/design: Requirement 3, 4; Design — How WorkflowCanvas Is Applied
  - Acceptance checklist:
    - [ ] `WorkflowBuilder.tsx` parent component exists
    - [ ] `WorkflowCanvas.tsx` renders workflow nodes from JSONB definition
    - [ ] `WorkflowNode.tsx` renders individual stage nodes
    - [ ] `WorkflowEdge.tsx` renders simple connectors between ordered nodes
    - [ ] `WorkflowEmptyState.tsx` renders when no nodes exist
    - [ ] Canvas state is isolated from Task and Dashboard components
    - [ ] WorkflowCanvas does not update TaskWorkflowStep status
    - [ ] Existing saved workflow layout can be rendered on page load
    - [ ] Components are lego-style and separated by responsibility
  - Test expectation: Component-level tests if the frontend test setup exists; otherwise manual verification and backend feature tests in Task 11.
  - Documentation expectation: Add component notes to `docs/project-structure.md` later.

---

- [ ] 10. Implement WorkflowStepInspector and WorkflowToolbar
  - Milestone: Visual Workflow Builder
  - Labels: feature, frontend
  - Depends on: Task 9
  - Description: Add UI for editing selected node details and builder actions. The builder remains visual, but stage details are edited through inspector controls.
  - Linked requirement/design: Requirement 3; Design — Visual Builder Modules
  - Acceptance checklist:
    - [ ] `WorkflowStepInspector.tsx` exists
    - [ ] Selected node label can be edited before Tasks exist
    - [ ] Selected node Mandatory/Optional setting can be edited before Tasks exist
    - [ ] `WorkflowToolbar.tsx` exists
    - [ ] Toolbar includes Add Stage and Save actions
    - [ ] Toolbar can expose Fit View or Reset Layout if simple
    - [ ] Inspector and toolbar are separate reusable components
    - [ ] When Tasks exist, structural controls are disabled or read-only
    - [ ] UI explains layout-only editing after Tasks exist
  - Test expectation: Manual visual verification unless frontend test tooling exists.
  - Documentation expectation: None.

---

- [ ] 11. Implement WorkflowCanvas add, move, reorder, save, and reload
  - Milestone: Visual Workflow Builder
  - Labels: feature, frontend, backend
  - Depends on: Task 6, Task 10
  - Description: Complete the v1 visual workflow loop: add node, move node, edit node through inspector, reorder sequence, save JSONB, and reload layout.
  - Linked requirement/design: Requirement 3, 4; Design — WorkflowCanvas Application; Design — JSONB Workflow Definition
  - Acceptance checklist:
    - [ ] User can add a stage node before Tasks exist
    - [ ] User can drag/reposition nodes
    - [ ] User can edit node label and Mandatory/Optional value before Tasks exist
    - [ ] User can reorder stage sequence before Tasks exist
    - [ ] Simple edges/connectors reflect ordered sequence
    - [ ] Save submits workflow definition through Inertia
    - [ ] Backend validates and saves to `project_workflows.definition`
    - [ ] Reloading the page restores nodes, edges, positions, and viewport/layout metadata
    - [ ] Save is rejected if workflow has zero mandatory nodes
    - [ ] After Tasks exist, layout-only changes save successfully
    - [ ] After Tasks exist, structural changes are rejected
    - [ ] WorkflowCanvas remains a real canvas-like surface, not just a styled table or form
  - Test expectation: Feature tests for save/reload JSONB, invalid workflow rejection, layout-only update after Tasks exist, structural update rejection after Tasks exist. Unit tests for WorkflowCanvas state-to-JSON mapping if practical.
  - Documentation expectation: Update `docs/workflow-builder.md` later.

---

## Milestone 4 — Task Workflow Snapshot and Task Tracking

---

- [ ] 12. Implement Task model, migration, policy, and basic CRUD
  - Milestone: Task Tracking
  - Labels: feature, backend, frontend
  - Depends on: Task 6, Task 11
  - Description: Implement Tasks inside Projects. Tasks are the operational work items tracked against the Project workflow.
  - Linked requirement/design: Requirement 5, 6, 16; Design — Task
  - Acceptance checklist:
    - [ ] `tasks` table exists with `id`, `project_id`, `title`, `description`, `target_completion_date`, timestamps
    - [ ] `Task` model belongs to Project
    - [ ] `TaskPolicy` enforces access through Project ownership
    - [ ] Project owner can create Task only in owned Project
    - [ ] Task list shows Tasks in selected Project only
    - [ ] Task title and description can be updated by authorized User
    - [ ] Target completion date can be set
    - [ ] Month/year input can be converted to last day of that month
    - [ ] Task screens are Inertia React pages, not Blade pages
    - [ ] Non-owner cannot access another user's Tasks
  - Test expectation: Feature tests for Task create/list/update/access denial. Unit tests for month-end target date conversion including leap year and non-leap year February.
  - Documentation expectation: None.

---

- [ ] 13. Implement TaskWorkflowStep snapshot creation
  - Milestone: Task Tracking
  - Labels: feature, backend, test
  - Depends on: Task 12
  - Description: When a Task is created, copy the current ProjectWorkflow nodes into relational TaskWorkflowStep rows. These rows are the runtime progress state.
  - Linked requirement/design: Requirement 5; Design — Task Workflow Snapshot
  - Acceptance checklist:
    - [ ] `task_workflow_steps` table exists
    - [ ] Table includes `task_id`, `workflow_node_id`, `label_snapshot`, `mandatory_snapshot`, `step_order`, `status`, `completed_at`, timestamps
    - [ ] `TaskWorkflowStep` model belongs to Task
    - [ ] Creating a Task reads `ProjectWorkflow.definition`
    - [ ] Creating a Task creates one TaskWorkflowStep per workflow node
    - [ ] Each TaskWorkflowStep stores node ID, label snapshot, mandatory snapshot, and order
    - [ ] All TaskWorkflowSteps default to Pending
    - [ ] Task creation is blocked if workflow has no mandatory node
    - [ ] Existing TaskWorkflowStep snapshots remain unchanged after layout-only workflow edits
  - Test expectation: Unit/feature tests for workflow-to-task snapshot creation and snapshot preservation.
  - Documentation expectation: Add notes to `docs/workflow-status.md` later.

---

- [ ] 14. Implement TaskWorkflowStep status updates and audit events
  - Milestone: Task Tracking
  - Labels: feature, backend, frontend
  - Depends on: Task 13
  - Description: Allow updating copied TaskWorkflowStep statuses. This is runtime progress tracking and must be separate from WorkflowCanvas.
  - Linked requirement/design: Requirement 7, 15; Design — TaskWorkflowStep; Design — Events and History
  - Acceptance checklist:
    - [ ] Valid statuses are Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed
    - [ ] Any TaskWorkflowStep can move to any valid status
    - [ ] Completed status sets `completed_at`
    - [ ] Moving away from Completed clears or updates `completed_at` according to implementation decision
    - [ ] Status update is available from Task screen, Task card, or Task progress UI, not WorkflowCanvas
    - [ ] Status change emits or records an audit event
    - [ ] Non-owner cannot update TaskWorkflowStep in another user's Project
  - Test expectation: Feature tests for valid/invalid status update, completed_at handling, access denial, audit entry created.
  - Documentation expectation: None.

---

- [ ] 15. Implement task progress, active step, and delayed calculation
  - Milestone: Task Tracking
  - Labels: feature, backend, test
  - Depends on: Task 14
  - Description: Add computed progress values used by Task cards, Task detail screens, and dashboard.
  - Linked requirement/design: Requirement 11, 12; Design — Status and Progress Logic
  - Acceptance checklist:
    - [ ] Active step uses highest-order In_Progress step when present
    - [ ] If no In_Progress step exists, active step uses first mandatory step not Completed and not Not_Applicable
    - [ ] Task is complete when all mandatory steps are Completed
    - [ ] Progress percentage uses completed mandatory steps divided by total mandatory steps
    - [ ] Optional steps appear but do not count toward main progress percentage
    - [ ] Delayed Task rule uses target_completion_date < today and final mandatory step not Completed
    - [ ] Delayed is computed on read, not stored
  - Test expectation: Unit tests for active step, progress percentage, optional step exclusion, delayed calculation combinations.
  - Documentation expectation: Update `docs/workflow-status.md` later.

---

## Milestone 5 — Project Dashboard and Task UI

---

- [ ] 16. Build Task list, Task detail, and TaskProgressTimeline UI
  - Milestone: Project Dashboard and Task UI
  - Labels: feature, frontend
  - Depends on: Task 15
  - Description: Build the runtime Task tracking UI. This is separate from the design-time WorkflowCanvas.
  - Linked requirement/design: Requirement 11; Design — UI Component Design
  - Acceptance checklist:
    - [ ] Task list shows Tasks for selected Project
    - [ ] Task card shows title, target completion, active step, progress percentage, delayed badge
    - [ ] Task detail page shows TaskProgressTimeline
    - [ ] TaskProgressTimeline displays TaskWorkflowSteps and statuses
    - [ ] Optional steps are visually distinguishable
    - [ ] Status update controls are available outside WorkflowCanvas
    - [ ] Task UI is built from reusable components such as TaskCard and TaskProgressTimeline
    - [ ] UI is clean, white-based, and consistent with existing MYDS-inspired app shell
  - Test expectation: Feature test for Inertia props. Manual visual verification for timeline and responsive layout.
  - Documentation expectation: None.

---

- [ ] 17. Implement Project Dashboard summary metrics
  - Milestone: Project Dashboard and Task UI
  - Labels: feature, backend, frontend
  - Depends on: Task 15
  - Description: Implement Project-scoped dashboard metrics. Dashboard counts must use relational runtime data, not raw workflow JSON.
  - Linked requirement/design: Requirement 13; Design — Dashboard Design
  - Acceptance checklist:
    - [ ] Dashboard is scoped to one selected Project
    - [ ] Dashboard shows total Tasks
    - [ ] Dashboard shows completed Tasks
    - [ ] Dashboard shows in-progress Tasks
    - [ ] Dashboard shows delayed Tasks
    - [ ] Dashboard includes link/button to open Visual Workflow Builder
    - [ ] Dashboard does not mix counts across Projects
    - [ ] Dashboard uses Task, TaskWorkflowStep, TaskDeliverable, and FollowUpAction tables for counts
    - [ ] Dashboard UI is built from reusable React components such as DashboardSummaryCards, TaskCard, and shared badges
  - Test expectation: Unit tests for dashboard count service. Feature test for dashboard Inertia props and Project scoping.
  - Documentation expectation: None.

---

## Milestone 6 — Deliverables, Follow-Ups, Document Links, and History

---

- [ ] 18. Implement TaskDeliverable model, CRUD, status, and overdue logic
  - Milestone: Deliverables and Actions
  - Labels: feature, backend, frontend
  - Depends on: Task 12
  - Description: Add TaskDeliverables as first-class expected outputs from a Task. A DocumentLink is only the pointer to the file/reference; the Deliverable is the expected output itself.
  - Linked requirement/design: Requirement 8, 12, 13; Design — TaskDeliverable; Design — Overdue Deliverable
  - Acceptance checklist:
    - [ ] `task_deliverables` table exists
    - [ ] Table includes `task_id`, `title`, `description`, `deliverable_type`, `status`, `due_date`, `remarks`, timestamps
    - [ ] Deliverable types: Document, Slide, Spreadsheet, Design, Repository, Link, Other
    - [ ] Statuses: Pending, In_Progress, Completed, Not_Required
    - [ ] Deliverable can be created, updated, listed, and status-updated
    - [ ] Overdue deliverable rule: due_date < today and status Pending or In_Progress
    - [ ] Deliverable status changes create AuditEntry
    - [ ] Dashboard includes pending/in-progress Deliverables and overdue Deliverables
    - [ ] Deliverable UI is built from reusable React components such as DeliverableList and DeliverableTypeBadge
  - Test expectation: Feature tests for create/update/status/access. Unit tests for overdue deliverable calculation and deliverable completion calculation. Audit test for status change.
  - Documentation expectation: Update `docs/deliverables.md` later.

---

- [ ] 19. Implement FollowUpAction model, CRUD, status, and overdue logic
  - Milestone: Deliverables and Actions
  - Labels: feature, backend, frontend
  - Depends on: Task 12
  - Description: Add follow-up actions attached to Tasks. Overdue status is computed on read.
  - Linked requirement/design: Requirement 10, 12, 13; Design — FollowUpAction
  - Acceptance checklist:
    - [ ] `follow_up_actions` table exists
    - [ ] Table includes `task_id`, `title`, `due_date`, `status`, `remarks`, timestamps
    - [ ] Statuses: Open, In_Progress, Done, Cancelled
    - [ ] Follow-up action can be created, updated, listed, and status-updated
    - [ ] Overdue rule: due_date < today and status not Done or Cancelled
    - [ ] Follow-up status changes create AuditEntry
    - [ ] Dashboard includes overdue Follow-Up Actions
    - [ ] Follow-up UI is built from reusable React components, not one-off page-only markup
  - Test expectation: Feature tests for create/update/status/access. Unit tests for overdue follow-up calculation. Audit test for status change.
  - Documentation expectation: None.

---

- [ ] 20. Implement polymorphic DocumentLink model and UI
  - Milestone: Deliverables and Actions
  - Labels: feature, backend, frontend
  - Depends on: Task 13, Task 18, Task 19
  - Description: Store external URLs attached to allowed parent records. V1 stores links only; it does not upload files or integrate with Google Drive, Figma, GitHub, or document repository APIs.
  - Linked requirement/design: Requirement 9; Design — DocumentLink
  - Acceptance checklist:
    - [ ] `document_links` table exists with `url`, `label`, `linkable_type`, `linkable_id`, timestamps
    - [ ] DocumentLink can attach to Task
    - [ ] DocumentLink can attach to TaskWorkflowStep
    - [ ] DocumentLink can attach to TaskDeliverable
    - [ ] DocumentLink can attach to FollowUpAction
    - [ ] URL validation is enforced
    - [ ] Links open in a new browser tab
    - [ ] Access is checked through the parent Project
    - [ ] Document link UI is built as reusable React components such as DocumentLinkList
    - [ ] No file upload is implemented
  - Test expectation: Feature tests for create/list/delete links for each allowed parent type and access denial across Projects.
  - Documentation expectation: Update `docs/deliverables.md` and `docs/user-guide.md` later.

---

- [ ] 21. Implement AuditEntry model and history timeline
  - Milestone: Deliverables and Actions
  - Labels: feature, backend, frontend
  - Depends on: Task 14, Task 18, Task 19
  - Description: Record status changes for TaskWorkflowSteps, TaskDeliverables, and FollowUpActions. Show status change history in Task detail screens.
  - Linked requirement/design: Requirement 15; Design — AuditEntry; Design — Events and History
  - Acceptance checklist:
    - [ ] `audit_entries` table exists with project ID, auditable type/id, field changed, previous value, new value, changed_by_user_id, changed_at, timestamps
    - [ ] TaskWorkflowStep status change creates AuditEntry
    - [ ] TaskDeliverable status change creates AuditEntry
    - [ ] FollowUpAction status change creates AuditEntry
    - [ ] HistoryTimeline component displays relevant history
    - [ ] History is visible only to authorized Project owner in v1
  - Test expectation: Feature/unit tests for audit creation and access.
  - Documentation expectation: None.

---

## Milestone 7 — Search, Filters, Seeders, and Quality

---

- [ ] 22. Implement Project-scoped search and filters
  - Milestone: Search and Quality
  - Labels: feature, backend, frontend
  - Depends on: Task 17, Task 18
  - Description: Add search and filters within the selected Project. Results must never leak data across Projects.
  - Linked requirement/design: Requirement 14; Design — Dashboard Design
  - Acceptance checklist:
    - [ ] Search Tasks by title within selected Project
    - [ ] Filter by TaskWorkflowStep status
    - [ ] Filter by delayed status
    - [ ] Filter by Deliverable status
    - [ ] Filter by overdue Deliverable status
    - [ ] Filters update Project Dashboard or Task list
    - [ ] Queries are scoped by Project ownership
  - Test expectation: Feature tests for each filter and cross-project isolation.
  - Documentation expectation: None.

---

- [ ] 23. Implement seeders for demo Projects, workflows, Tasks, and related records
  - Milestone: Search and Quality
  - Labels: setup, backend
  - Depends on: Task 21
  - Description: Add realistic local development/demo data for the new product model.
  - Linked requirement/design: Design — Local Development
  - Acceptance checklist:
    - [ ] Seeder creates default local user
    - [ ] Seeder creates sample Projects
    - [ ] Seeder creates sample ProjectWorkflow JSONB definitions with node positions, edges, and viewport metadata
    - [ ] Seeder creates sample Tasks with copied TaskWorkflowSteps and varied statuses
    - [ ] Seeder creates sample TaskDeliverables with different types/statuses, including overdue examples
    - [ ] Seeder creates sample FollowUpActions, including overdue examples
    - [ ] Seeder creates sample DocumentLinks
    - [ ] Seeder does not create global roles as v1 requirement
    - [ ] `php artisan migrate:fresh --seed` succeeds locally
  - Test expectation: Seeder smoke test if practical; otherwise verified manually.
  - Documentation expectation: Update `docs/setup.md` later.

---

- [ ] 24. Add property-style and edge-case tests
  - Milestone: Search and Quality
  - Labels: test
  - Depends on: Task 22
  - Description: Add tests for high-risk business rules and calculated status values.
  - Linked requirement/design: Design — Testing Strategy
  - Acceptance checklist:
    - [ ] Workflow definition validation covers generated node/edge combinations
    - [ ] WorkflowCanvas node/edge layout round-trip to JSONB is covered
    - [ ] Workflow structural change detection is covered
    - [ ] Month-end conversion is covered
    - [ ] Delayed calculation date/status combinations are covered
    - [ ] Overdue follow-up calculation date/status combinations are covered
    - [ ] Overdue deliverable calculation date/status combinations are covered
    - [ ] Dashboard count consistency is covered
  - Test expectation: PestPHP tests pass in CI.
  - Documentation expectation: Update `docs/testing.md` later.

---

## Milestone 8 — Documentation and Final Review

---

- [ ] 25. Complete architecture and project structure documentation
  - Milestone: Documentation and Review
  - Labels: documentation
  - Depends on: Task 21
  - Description: Complete technical documentation for the final v1 architecture and code structure.
  - Linked requirement/design: Design — Documentation
  - Acceptance checklist:
    - [ ] `docs/architecture.md` documents Laravel/Inertia/PostgreSQL/JSONB architecture
    - [ ] `docs/architecture.md` explains JSONB workflow definition vs relational operational data
    - [ ] `docs/project-structure.md` documents backend actions/policies/models and frontend WorkflowCanvas components
    - [ ] `docs/project-structure.md` documents lego-style component rules and Blade root-only rule
    - [ ] `docs/setup.md` documents PostgreSQL Docker setup
    - [ ] `docs/ci.md` documents GitHub Actions CI
  - Test expectation: No automated tests.
  - Documentation expectation: This task is documentation-only.

---

- [ ] 26. Complete workflow, deliverables, testing, and user guide documentation
  - Milestone: Documentation and Review
  - Labels: documentation
  - Depends on: Task 24
  - Description: Complete user-facing and developer-facing documentation for workflows, deliverables, status logic, testing, and troubleshooting.
  - Linked requirement/design: Design — Documentation
  - Acceptance checklist:
    - [ ] `docs/workflow-builder.md` documents WorkflowCanvas behaviour, JSONB shape, validation, and layout-only edits after Tasks exist
    - [ ] `docs/workflow-status.md` documents TaskWorkflowStep snapshot, status, progress, delayed, and active step logic
    - [ ] `docs/deliverables.md` documents Deliverable types, statuses, overdue logic, and links
    - [ ] `docs/testing.md` documents testing approach and property-style tests
    - [ ] `docs/user-guide.md` documents Projects, Visual Workflows, Tasks, Deliverables, Follow-Ups, Links, and Dashboard
    - [ ] `docs/troubleshooting.md` contains common local development issues
    - [ ] README links are accurate
  - Test expectation: No automated tests.
  - Documentation expectation: This task is documentation-only.

---

- [ ] 27. Final v1 quality pass
  - Milestone: Documentation and Review
  - Labels: test, refactor, frontend, backend
  - Depends on: Task 26
  - Description: Final integration pass before v1 is considered complete. Fix rough edges, remove stale Agency/Service/Special Project wording, and ensure UI and tests match requirements/design.
  - Linked requirement/design: All requirements and design sections
  - Acceptance checklist:
    - [ ] Full PestPHP test suite passes
    - [ ] PHPStan passes
    - [ ] Pint passes
    - [ ] `npm run build` passes
    - [ ] CI passes on PR
    - [ ] No stale Agency Owner, Service, Special Project, global Admin, Keycloak, Spatie, Prisma, Next/Nuxt, MongoDB, or automation-engine wording remains in user-facing UI/docs
    - [ ] WorkflowCanvas is clearly design-time only
    - [ ] Task status updates happen outside WorkflowCanvas
    - [ ] Frontend app screens use Inertia React, not Blade pages
    - [ ] Frontend UI uses lego-style reusable React components
    - [ ] Dashboard counts are Project-scoped
    - [ ] Cross-project access isolation is tested
  - Test expectation: Full CI must pass.
  - Documentation expectation: Any final documentation corrections are included.

---

## Notes for Kiro / AI Implementation

- Do not skip ahead to dashboard before ProjectWorkflow JSONB and WorkflowCanvas save/load are working.
- Do not implement a fake visual builder as only a table/form. WorkflowCanvas must be a real design-time surface for nodes and simple edges, even if v1 logic is still ordered stages.
- Do not implement automation, branching, connectors, hooks, or external integrations in v1.
- Do not use the WorkflowCanvas as the Task status update screen.
- Do not create Blade pages, Blade layouts, or Blade components for app screens. Blade is only allowed as the root Inertia view.
- Build frontend screens using lego-style reusable React components with clear responsibilities.
- Avoid giant React page files that contain all layout, forms, canvas, list rendering, and business logic in one place.
- Keep implementation in small PRs and stop after each task's acceptance checklist is satisfied.
- When uncertain, requirements.md and design.md are the source of truth.
