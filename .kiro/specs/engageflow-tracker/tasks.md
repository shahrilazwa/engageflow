# Implementation Plan: EngageFlow Tracker

## Overview

This plan breaks EngageFlow Tracker into small MVP slices that can be reviewed and approved incrementally. Each task should map to one GitHub Issue and one pull request unless the task is explicitly marked as a review-only checkpoint.

The current product model is Project-first, workflow-first, visual-builder-first, and single-user-first. The plan follows `requirements.md` and `design.md`.

Stack:

- Laravel + Inertia React + TypeScript.
- PostgreSQL with JSONB for Project workflow definitions.
- Eloquent ORM and Laravel Query Builder.
- Laravel session authentication.
- Laravel Policies for owner-only Project access in v1.
- MYDS React and MYDS Style as the primary UI system.
- Tailwind CSS for layout composition around MYDS components.
- `@xyflow/react` / React Flow for the Visual Workflow Builder canvas.
- PestPHP, PHPStan/Larastan, Laravel Pint, and GitHub Actions CI.

Reference sources:

- MYDS documentation: `https://design.digital.gov.my/`
- MYDS GitHub repository: `https://github.com/govtechmy/myds`
- MYDS packages: `@govtechmy/myds-react` and `@govtechmy/myds-style`
- React Flow documentation: `https://reactflow.dev/`

Design review rule:

- Every task that creates or changes a user-facing page must include a UI/design review checkpoint before moving to the next page task.
- UI/design review should inspect layout, MYDS alignment, spacing, responsive behavior, empty states, validation states, loading/disabled states, and absence of Jata Negara or official crest artwork.
- If a page does not pass review, create a small follow-up task before continuing to the next MVP slice.

---

## Tasks

---

## MVP 0: Foundation

Approval output: User can log in, create/select/update Projects, and cannot access another user's Project.

---

- [x] 1. Align project stack and development baseline
  - MVP slice: MVP 0 Foundation
  - Labels: setup, backend, frontend
  - Depends on: none
  - Description: Align the application baseline with the agreed stack. Configure Laravel, Inertia React, TypeScript, PostgreSQL, MYDS, Tailwind, FontAwesome or MYDS-compatible icons, React Flow, PestPHP, PHPStan/Larastan, and Pint. Existing legacy MySQL or old requirement artifacts may be updated in a later implementation pass, but the target stack for new work is PostgreSQL and TypeScript.
  - Linked requirement/design: Requirement 18; Design 2.1; Design 5.2; Design 13
  - Acceptance checklist:
    - [x] New React/Inertia code can be written in `.tsx`
    - [x] `@xyflow/react` is installed and importable
    - [x] MYDS React and MYDS Style are installed and importable
    - [x] Tailwind is available for layout composition
    - [x] PostgreSQL connection is configured for local and test environments
    - [x] PHPStan/Larastan and Pint commands are documented
    - [x] `npm run build` succeeds
    - [x] `php artisan test` succeeds
  - Test expectation: Smoke test build and test commands.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [x] 2. Configure staged CI and pull request quality gates
  - MVP slice: MVP 0 Foundation
  - Labels: ci, setup
  - Depends on: Task 1
  - Description: Configure GitHub Actions in stages by check type so fast checks fail early and failures are easy to diagnose.
  - Linked requirement/design: Design 18; Design 21
  - Acceptance checklist:
    - [x] CI workflow exists under `.github/workflows`
    - [x] Stage 1 installs and caches Composer and npm dependencies
    - [x] Stage 2 runs Laravel Pint and frontend formatter/linter if configured
    - [x] Stage 3 runs PHPStan/Larastan and TypeScript check if configured
    - [x] Stage 4 runs backend unit tests
    - [x] Stage 5 starts PostgreSQL, runs migrations, and runs database-backed Pest feature tests
    - [x] Stage 6 runs frontend build and React/Inertia/React Flow contract checks
    - [x] Stage 7 is documented as optional browser or visual smoke tests for high-risk UI flows
    - [x] Stage 8 is documented as seed and release smoke checks for main, release branches, or scheduled runs
    - [x] The PR template states which CI stages are required for the current PR
    - [x] Pull request template includes UI/design review checkbox for page changes
    - [x] CI uses PostgreSQL, not MySQL
  - Test expectation: Open a test PR and confirm required CI stages run in the intended order.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [x] 3. Create documentation skeleton
  - MVP slice: MVP 0 Foundation
  - Labels: documentation, setup
  - Depends on: Task 1
  - Description: Create early documentation files so implementation details can be filled incrementally per MVP slice.
  - Linked requirement/design: Design 19
  - Acceptance checklist:
    - [x] `docs/architecture.md` exists
    - [x] `docs/setup.md` exists
    - [x] `docs/project-structure.md` exists
    - [x] `docs/workflow-status.md` exists
    - [x] `docs/workflow-builder.md` exists
    - [x] `docs/deliverables.md` exists
    - [x] `docs/testing.md` exists
    - [x] `docs/ci.md` exists
    - [x] `docs/user-guide.md` exists
    - [x] `docs/troubleshooting.md` exists
    - [x] README links to the docs
  - Test expectation: No automated tests.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [x] 4. Implement Laravel session authentication
  - MVP slice: MVP 0 Foundation
  - Labels: feature, backend, frontend
  - Depends on: Task 1
  - Description: Implement login, logout, authenticated route protection, and Inertia auth props. V1 does not include Keycloak, OIDC, SSO, registration, or global role requirements.
  - Linked requirement/design: Requirement 1; Design 10
  - Acceptance checklist:
    - [x] Login page is an Inertia React page
    - [x] Login form uses MYDS-aligned controls
    - [x] Successful login creates a Laravel session
    - [x] Failed login shows a clear validation error
    - [x] Logout destroys the session
    - [x] Unauthenticated users are redirected to login
    - [x] Authenticated users can access the app shell
    - [x] No Keycloak, OIDC, SSO, or external identity provider is required
  - Test expectation: Feature tests for successful login, failed login, logout, and unauthenticated redirect.
  - UI/design review checkpoint:
      - [x] Review Login page layout, MYDS usage, error state, focus state, and mobile behavior
      - [x] Confirm no Jata Negara or official crest artwork appears

---

- [ ] 5. Build authenticated app shell and navigation
  - MVP slice: MVP 0 Foundation
  - Labels: feature, frontend, design
  - Depends on: Task 4
  - Description: Build the shared authenticated layout using MYDS components and Tailwind layout composition. Keep it quiet, work-focused, and suitable for repeated operational use.
  - Linked requirement/design: Design 5.2; Design 13
  - Acceptance checklist:
    - [ ] `AuthenticatedLayout.tsx` exists
    - [ ] Layout includes app name, authenticated user area, logout control, and primary navigation
    - [ ] Navigation includes Projects and selected Project Dashboard when available
    - [ ] Layout supports desktop and mobile widths
    - [ ] Layout uses MYDS components where available
    - [ ] Layout does not include global role-management navigation
  - Test expectation: Feature or rendering smoke test for authenticated dashboard response.
  - UI/design review checkpoint:
    - [ ] Review shell spacing, navigation hierarchy, active state, mobile behavior, and MYDS alignment
    - [ ] Confirm page content has enough width for dense app screens without feeling like a marketing page

---

- [ ] 6. Implement Project model, ownership, and policies
  - MVP slice: MVP 0 Foundation
  - Labels: feature, backend
  - Depends on: Task 4
  - Description: Create Project persistence and owner-only authorization. Project access is owner-only in v1, with future membership left as an extension point.
  - Linked requirement/design: Requirement 2; Requirement 16; Requirement 17; Design 7.3; Design 9
  - Acceptance checklist:
    - [ ] `projects` table has `owner_user_id`, `name`, `description`, and timestamps
    - [ ] `Project` belongs to owner `User`
    - [ ] `User` has owned Projects relationship
    - [ ] `ProjectPolicy` allows owner access
    - [ ] `ProjectPolicy` denies non-owner access
    - [ ] Inaccessible Project records prefer 404 where resource discovery is a concern
    - [ ] No Spatie Permission package is required
  - Test expectation: Feature tests for owner access, non-owner denial, and project scoping.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 7. Build Project list, create, and edit pages
  - MVP slice: MVP 0 Foundation
  - Labels: feature, frontend, backend, design
  - Depends on: Task 6
  - Description: Build Project management screens for owner-only Projects. Keep the page simple: project list, create form, edit form, selected Project action.
  - Linked requirement/design: Requirement 2; Design 12; Design 13
  - Acceptance checklist:
    - [ ] Project index page lists only owned Projects
    - [ ] Project create form accepts name and optional description
    - [ ] Project edit form updates name and description
    - [ ] Empty state appears when the user has no Projects
    - [ ] Form validation errors are clear and inline
    - [ ] Project selection leads to the Project dashboard or placeholder dashboard
    - [ ] Non-owner cannot view or update another user's Project
  - Test expectation: Feature tests for create, list, update, and access denial.
  - UI/design review checkpoint:
    - [ ] Review Project index page, create form, edit form, empty state, validation state, and mobile layout
    - [ ] Confirm MYDS component usage and no Jata Negara or official crest artwork

---

- [ ] 8. Implement ProjectWorkflow JSONB storage
  - MVP slice: MVP 0 Foundation
  - Labels: feature, backend
  - Depends on: Task 6
  - Description: Create one ProjectWorkflow per Project. Store the visual workflow definition as PostgreSQL JSONB and expose actions for creating, loading, and saving the definition.
  - Linked requirement/design: Requirement 2; Requirement 4; Design 7.4; Design 8.5
  - Acceptance checklist:
    - [ ] `project_workflows` table has `project_id`, `definition` JSONB, `version`, and timestamps
    - [ ] Each Project has exactly one ProjectWorkflow
    - [ ] Project creation creates or makes available a ProjectWorkflow
    - [ ] Empty workflow definition uses the v1 JSON shape
    - [ ] ProjectWorkflow access is scoped through Project ownership
  - Test expectation: Unit and feature tests for workflow creation, loading, and project scoping.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

## MVP 1: Workflow Builder Core

Approval output: User can visually build, save, and reopen a Project workflow.

---

- [ ] 9. Implement workflow TypeScript contracts and mappers
  - MVP slice: MVP 1 Workflow Builder Core
  - Labels: feature, frontend, test
  - Depends on: Task 8
  - Description: Define TypeScript types and pure helpers for mapping between EngageFlow JSONB workflow definitions and React Flow nodes, edges, and viewport state.
  - Linked requirement/design: Requirement 4; Design 5.2; Design 8.3; Design 16
  - Acceptance checklist:
    - [ ] `workflowTypes.ts` defines workflow definition, node, edge, viewport, and save payload types
    - [ ] `workflowDefinitionMapper.ts` maps JSONB definition to React Flow state
    - [ ] `workflowDefinitionMapper.ts` maps React Flow state back to JSONB definition
    - [ ] Mapper preserves stable node IDs, edge IDs, labels, mandatory flags, order, positions, and viewport metadata
    - [ ] Mapper does not contain server authorization or business-rule validation
  - Test expectation: Unit tests for JSONB to React Flow mapping and round-trip behavior.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 10. Implement server-side workflow validation
  - MVP slice: MVP 1 Workflow Builder Core
  - Labels: feature, backend, test
  - Depends on: Task 8
  - Description: Build validation and normalization actions for workflow definitions. Validation must be server-side and cannot rely only on React.
  - Linked requirement/design: Requirement 3; Requirement 4; Design 14
  - Acceptance checklist:
    - [ ] Reject missing node IDs
    - [ ] Reject duplicate node IDs
    - [ ] Reject missing labels
    - [ ] Reject invalid node type
    - [ ] Reject missing positions
    - [ ] Reject missing mandatory node
    - [ ] Reject invalid or duplicate node order
    - [ ] Reject invalid edges referencing missing nodes
    - [ ] Normalize valid definitions consistently
  - Test expectation: Unit tests for all validation failures and valid workflow acceptance.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 11. Build Visual Workflow Builder page shell
  - MVP slice: MVP 1 Workflow Builder Core
  - Labels: feature, frontend, design
  - Depends on: Task 7, Task 8, Task 9
  - Description: Build the builder route and page shell. Include title, Project context, toolbar area, canvas area, side inspector area, and step list area. This task may use placeholders before the full React Flow interactions are implemented.
  - Linked requirement/design: Requirement 3; Design 8; Design 13
  - Acceptance checklist:
    - [ ] Project owner can open the builder
    - [ ] Non-owner cannot open the builder
    - [ ] Page shows selected Project context
    - [ ] Page reserves space for toolbar, canvas, inspector, and ordered step list
    - [ ] Empty state is visible when no workflow nodes exist
    - [ ] Layout is responsive enough for laptop and mobile review
  - Test expectation: Feature tests for owner access and non-owner denial.
  - UI/design review checkpoint:
    - [ ] Review builder information architecture before implementing deeper interactions
    - [ ] Confirm canvas, toolbar, inspector, and step list feel like an app tool, not a landing page

---

- [ ] 12. Implement React Flow WorkflowCanvas interactions
  - MVP slice: MVP 1 Workflow Builder Core
  - Labels: feature, frontend, test
  - Depends on: Task 9, Task 11
  - Description: Implement the core React Flow canvas interactions for ordered stage workflows.
  - Linked requirement/design: Requirement 3; Requirement 4; Design 8.1; Design 8.2
  - Acceptance checklist:
    - [ ] WorkflowCanvas uses `@xyflow/react`
    - [ ] User can add a stage node
    - [ ] User can select a stage node
    - [ ] User can drag/reposition stage nodes
    - [ ] Simple edges/connectors are shown between ordered stages
    - [ ] Viewport pan/zoom works
    - [ ] Fit view control works if included in toolbar
    - [ ] WorkflowCanvas does not update TaskWorkflowStep status
  - Test expectation: Unit tests for mapper changes and selected component smoke tests where practical.
  - UI/design review checkpoint:
    - [ ] Review node appearance, edge clarity, canvas spacing, viewport controls, and empty state
    - [ ] Confirm React Flow behavior feels understandable for a first-time user

---

- [ ] 13. Build Workflow inspector, toolbar, and ordered step list
  - MVP slice: MVP 1 Workflow Builder Core
  - Labels: feature, frontend, design
  - Depends on: Task 12
  - Description: Build lego-style workflow controls around the canvas.
  - Linked requirement/design: Requirement 3; Design 8.3; Design 13
  - Acceptance checklist:
    - [ ] WorkflowStepInspector edits selected node label
    - [ ] WorkflowStepInspector edits Mandatory/Optional flag
    - [ ] WorkflowToolbar includes add stage and save controls
    - [ ] WorkflowStepList shows ordered stages
    - [ ] WorkflowStepList supports sequence review and reorder before Tasks exist
    - [ ] Validation state is visible when workflow has no mandatory stage
    - [ ] Components are small and typed with clear props
  - Test expectation: Mapper/unit tests for reorder behavior. Feature test for save validation where applicable.
  - UI/design review checkpoint:
    - [ ] Review inspector layout, toolbar button hierarchy, step list density, validation messages, disabled/loading states, and MYDS usage

---

- [ ] 14. Save and reload workflow definition
  - MVP slice: MVP 1 Workflow Builder Core
  - Labels: feature, backend, frontend, test
  - Depends on: Task 10, Task 13
  - Description: Wire the builder to persist workflow definitions to ProjectWorkflow JSONB and reload saved nodes, edges, positions, and viewport metadata.
  - Linked requirement/design: Requirement 3; Requirement 4; Design 4.2; Design 8.5
  - Acceptance checklist:
    - [ ] Save sends JSON workflow definition through Inertia
    - [ ] Backend validates and saves valid workflow definitions
    - [ ] Invalid workflow definitions show clear validation errors
    - [ ] Reopening builder restores nodes, edges, positions, order, mandatory flags, and viewport metadata
    - [ ] Save action is allowed only for Project owner in v1
  - Test expectation: Feature tests for save, reload, validation errors, and access denial.
  - UI/design review checkpoint:
    - [ ] Review save success/error states, unsaved-change behavior if implemented, and restored layout behavior

---

- [ ] 15. Prepare workflow structural-change detection
  - MVP slice: MVP 1 Workflow Builder Core
  - Labels: feature, backend, frontend, test, design
  - Depends on: Task 14
  - Description: Build the structural-change detection helper and locked-builder UI contract before Task creation exists. The actual "Tasks exist" enforcement is wired in MVP 2 after Task persistence is available.
  - Linked requirement/design: Requirement 3; Requirement 4; Design 8.8; Design 14
  - Acceptance checklist:
    - [ ] Structural change detection identifies added nodes, removed nodes, label changes, mandatory flag changes, order changes, and edge changes
    - [ ] Layout-only changes to node positions and viewport metadata are allowed
    - [ ] Locked-builder UI state can disable or make read-only add, remove, label, mandatory flag, order, and edge controls
    - [ ] Locked-builder UI state can still allow node position and viewport changes
    - [ ] Locked-builder UI state explains that workflow migration/rebuild is future scope
  - Test expectation: Unit tests for structural change detection and component-level checks for locked UI state where practical.
  - UI/design review checkpoint:
    - [ ] Review locked builder state mock/fixture, disabled controls, explanatory message, and whether layout-only editing remains obvious

---

## MVP 2: Task Snapshot Loop

Approval output: Core loop works: Project -> Workflow -> Task -> Step progress.

---

- [ ] 16. Implement Task and TaskWorkflowStep data model
  - MVP slice: MVP 2 Task Snapshot Loop
  - Labels: feature, backend
  - Depends on: Task 8, Task 10
  - Description: Create Task and TaskWorkflowStep persistence. TaskWorkflowStep rows are relational snapshots copied from the Project workflow when a Task is created.
  - Linked requirement/design: Requirement 5; Requirement 6; Design 7.7; Design 7.8; Design 8.7
  - Acceptance checklist:
    - [ ] `tasks` table has `project_id`, `title`, `description`, `target_completion_date`, and timestamps
    - [ ] `task_workflow_steps` table has task ID, workflow node ID, label snapshot, mandatory snapshot, step order, status, completed date, and timestamps
    - [ ] Task belongs to Project
    - [ ] TaskWorkflowStep belongs to Task
    - [ ] All Task data is scoped through Project ownership
  - Test expectation: Model relationship tests and migration smoke tests.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 17. Implement Task creation from workflow snapshot
  - MVP slice: MVP 2 Task Snapshot Loop
  - Labels: feature, backend, test
  - Depends on: Task 16
  - Description: Build the action that creates a Task only when the parent Project has a valid workflow with at least one mandatory node. Copy all Mandatory and Optional workflow nodes into TaskWorkflowStep rows.
  - Linked requirement/design: Requirement 5; Design 4.3; Design 8.7
  - Acceptance checklist:
    - [ ] Task creation requires valid Project workflow
    - [ ] Task creation requires at least one mandatory node
    - [ ] Task creation copies all workflow nodes, including Mandatory and Optional nodes
    - [ ] Copied steps store node ID, label snapshot, mandatory snapshot, step order, Pending status, and empty completion date
    - [ ] TaskWorkflowStep snapshots are preserved after later Project workflow layout changes
    - [ ] Once the Project has at least one Task, workflow save rejects structural changes and allows layout-only changes
    - [ ] Builder receives enough Project state to switch to the locked layout-only UI
    - [ ] Non-owner cannot create Tasks in another user's Project
  - Test expectation: Feature and unit tests for valid creation, invalid workflow rejection, snapshot values, access denial, structural save rejection after Tasks exist, and layout-only save allowed after Tasks exist.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 18. Build Task list and create pages
  - MVP slice: MVP 2 Task Snapshot Loop
  - Labels: feature, frontend, backend, design
  - Depends on: Task 17
  - Description: Build Task list and create screens inside a selected Project.
  - Linked requirement/design: Requirement 5; Requirement 6; Design 13
  - Acceptance checklist:
    - [ ] Task list shows Tasks for selected Project only
    - [ ] Empty state appears when a Project has no Tasks
    - [ ] Create Task form accepts title, optional description, and optional target completion date
    - [ ] Month-only target completion input stores the last day of the selected month
    - [ ] Create Task is blocked with a clear message if workflow is invalid
    - [ ] Created Task redirects to Task detail or Task list
  - Test expectation: Feature tests for list, create, validation, month-end conversion, and access denial.
  - UI/design review checkpoint:
    - [ ] Review Task list, empty state, create form, target completion date/month control, validation state, and mobile behavior

---

- [ ] 19. Build Task detail and progress timeline
  - MVP slice: MVP 2 Task Snapshot Loop
  - Labels: feature, frontend, backend, design
  - Depends on: Task 18
  - Description: Build Task detail page with copied workflow steps shown as a progress timeline.
  - Linked requirement/design: Requirement 6; Requirement 7; Requirement 11; Design 11; Design 13
  - Acceptance checklist:
    - [ ] Task detail shows title, description, target completion date, and project context
    - [ ] TaskProgressTimeline shows all Mandatory and Optional steps
    - [ ] Timeline visually distinguishes Step_Status values
    - [ ] Mandatory and Optional steps are visually distinguishable
    - [ ] Current active step is displayed using the requirements rule
    - [ ] Progress percentage uses mandatory steps only
    - [ ] Completed and Not_Applicable mandatory steps count as complete
  - Test expectation: Unit tests for active step and progress calculation. Feature test for task detail access.
  - UI/design review checkpoint:
    - [ ] Review Task detail layout, timeline readability, status badges, active step treatment, optional step treatment, and responsive behavior

---

- [ ] 20. Implement Task workflow step status updates
  - MVP slice: MVP 2 Task Snapshot Loop
  - Labels: feature, backend, frontend, test, design
  - Depends on: Task 19
  - Description: Allow Project users to update TaskWorkflowStep status outside WorkflowCanvas.
  - Linked requirement/design: Requirement 7; Requirement 15; Design 11
  - Acceptance checklist:
    - [ ] Any TaskWorkflowStep can be updated to a valid Step_Status
    - [ ] No strict linear progression is enforced
    - [ ] Completed status records completion date
    - [ ] Changing away from Completed follows documented completion-date behavior
    - [ ] Status updates are restricted to Project owner in v1
    - [ ] Status update UI is not part of WorkflowCanvas
  - Test expectation: Feature tests for each status, completion date recording, non-linear updates, and access denial.
  - UI/design review checkpoint:
    - [ ] Review status update control, status menu/list, success/error states, and whether the interaction is quick for repeated operational use

---

## MVP 3: Minimal Project Dashboard

Approval output: User can assess Project progress without Deliverables or Follow-Ups.

---

- [ ] 21. Implement dashboard query actions and progress rules
  - MVP slice: MVP 3 Minimal Project Dashboard
  - Labels: feature, backend, test
  - Depends on: Task 20
  - Description: Build Project-scoped dashboard query actions using relational Task and TaskWorkflowStep data.
  - Linked requirement/design: Requirement 11; Requirement 12; Requirement 13; Design 11; Design 12
  - Acceptance checklist:
    - [ ] Total Task count is Project-scoped
    - [ ] Completed Task count uses final mandatory step Completed or Not_Applicable
    - [ ] In-progress Task count uses final mandatory step not Completed and not Not_Applicable
    - [ ] Delayed Task calculation uses target completion and final mandatory step
    - [ ] Dashboard counts do not parse raw workflow JSON for routine counts
    - [ ] Dashboard counts do not mix Projects
  - Test expectation: Unit tests for dashboard counts, final mandatory step, delayed calculation, and Project scoping.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 22. Build Project dashboard page
  - MVP slice: MVP 3 Minimal Project Dashboard
  - Labels: feature, frontend, backend, design
  - Depends on: Task 21
  - Description: Build the selected-Project dashboard using summary cards, task list/cards, active step indicators, progress, delayed badges, and link to Workflow Builder.
  - Linked requirement/design: Requirement 11; Requirement 12; Requirement 13; Design 12; Design 13
  - Acceptance checklist:
    - [ ] Dashboard is scoped to one selected Project
    - [ ] Dashboard shows total Tasks, completed Tasks, in-progress Tasks, and delayed Tasks
    - [ ] Dashboard provides link/button to open Workflow Builder
    - [ ] Dashboard shows Task list/cards with active step and progress percentage
    - [ ] Delayed Tasks are visually highlighted
    - [ ] Empty state appears when no Tasks exist
    - [ ] Dashboard does not show Deliverables or Follow-Ups yet unless placeholder sections are intentionally hidden
  - Test expectation: Feature test for dashboard response and Project scoping.
  - UI/design review checkpoint:
    - [ ] Review dashboard information hierarchy, summary cards, task list density, delayed treatment, empty state, and MYDS alignment
    - [ ] Confirm dashboard feels operational and not like a marketing landing page

---

- [ ] 23. Implement Task search and basic filters
  - MVP slice: MVP 3 Minimal Project Dashboard
  - Labels: feature, backend, frontend, test, design
  - Depends on: Task 22
  - Description: Add search by Task title and filters for Step_Status and delayed status within the selected Project.
  - Linked requirement/design: Requirement 14; Design 12
  - Acceptance checklist:
    - [ ] Search finds Tasks by title within selected Project
    - [ ] Step_Status filter returns Tasks with matching TaskWorkflowStep status
    - [ ] Delayed filter returns delayed Tasks only
    - [ ] Filters never return Tasks from inaccessible Projects
    - [ ] Clearing filters returns unfiltered Project Tasks
  - Test expectation: Unit and feature tests for search, filters, combinations, and Project scoping.
  - UI/design review checkpoint:
    - [ ] Review search input, filter controls, filtered empty state, loading/disabled states, and mobile behavior

---

## MVP 4: Deliverables and Document Links

Approval output: User can track expected Task outputs separately from workflow progress.

---

- [ ] 24. Implement TaskDeliverable data model and business rules
  - MVP slice: MVP 4 Deliverables and Document Links
  - Labels: feature, backend, test
  - Depends on: Task 16
  - Description: Create TaskDeliverable persistence and status/type rules.
  - Linked requirement/design: Requirement 8; Design 7.9; Design 11.6; Design 11.7
  - Acceptance checklist:
    - [ ] `task_deliverables` table has task ID, title, type, status, optional description, due date, remarks, and timestamps
    - [ ] Deliverable types match v1 requirements
    - [ ] Deliverable statuses match v1 requirements
    - [ ] Overdue Deliverable calculation matches requirements
    - [ ] Deliverables are scoped through parent Project access
  - Test expectation: Unit tests for type/status validation and overdue calculation. Feature tests for access denial.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 25. Build Deliverable UI on Task detail
  - MVP slice: MVP 4 Deliverables and Document Links
  - Labels: feature, frontend, backend, design
  - Depends on: Task 24
  - Description: Add Deliverable creation, listing, editing, and status updates to the Task detail page.
  - Linked requirement/design: Requirement 8; Requirement 11; Design 13
  - Acceptance checklist:
    - [ ] Task detail page shows Deliverable section separately from workflow progress
    - [ ] User can create Deliverables with title, type, status, optional description, due date, and remarks
    - [ ] User can update Deliverable details and status
    - [ ] Overdue Deliverables are visually flagged
    - [ ] Deliverable summary does not overwhelm workflow timeline
  - Test expectation: Feature tests for create, update, status change, overdue visibility, and access denial.
  - UI/design review checkpoint:
    - [ ] Review Deliverable section layout, create/edit forms, type/status badges, overdue state, and relationship to workflow timeline

---

- [ ] 26. Implement DocumentLink model and polymorphic attachments
  - MVP slice: MVP 4 Deliverables and Document Links
  - Labels: feature, backend, test
  - Depends on: Task 20, Task 24
  - Description: Store external URLs attached to Tasks, TaskWorkflowSteps, TaskDeliverables, and later FollowUpActions.
  - Linked requirement/design: Requirement 9; Design 7.11
  - Acceptance checklist:
    - [ ] `document_links` table supports allowed parent entities
    - [ ] Each DocumentLink stores external URL and optional label/description
    - [ ] URL validation is server-side
    - [ ] No file upload is implemented
    - [ ] No Google Drive, Figma, GitHub, or external repository API integration is implemented
    - [ ] Access is scoped through parent Project
  - Test expectation: Unit and feature tests for valid links, invalid URLs, parent access, and no file upload path.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 27. Build Document Link UI for Tasks, Steps, and Deliverables
  - MVP slice: MVP 4 Deliverables and Document Links
  - Labels: feature, frontend, backend, design
  - Depends on: Task 26
  - Description: Add Document Link lists and forms to Task detail, Task workflow step detail/inline area, and Deliverable area.
  - Linked requirement/design: Requirement 9; Design 13
  - Acceptance checklist:
    - [ ] Task-level Document Links can be created and viewed
    - [ ] Step-level Document Links can be created and viewed
    - [ ] Deliverable-level Document Links can be created and viewed
    - [ ] Links open in a new browser tab
    - [ ] Invalid URL validation is clear
    - [ ] Empty link state is unobtrusive
  - Test expectation: Feature tests for create/view/remove links for supported parent entities and access denial.
  - UI/design review checkpoint:
    - [ ] Review link list density, add-link form, URL validation, external-link affordance, and placement inside Task detail

---

- [ ] 28. Add Deliverable filters and dashboard summaries
  - MVP slice: MVP 4 Deliverables and Document Links
  - Labels: feature, backend, frontend, test, design
  - Depends on: Task 25, Task 27
  - Description: Add Deliverable summary counts and filters to the Project dashboard.
  - Linked requirement/design: Requirement 12; Requirement 13; Requirement 14
  - Acceptance checklist:
    - [ ] Dashboard shows pending/in-progress Deliverable count
    - [ ] Dashboard shows overdue Deliverable count
    - [ ] Dashboard can filter Tasks by Deliverable_Status
    - [ ] Dashboard can filter Tasks by overdue Deliverable status
    - [ ] Counts and filters are Project-scoped
  - Test expectation: Unit and feature tests for counts, filters, and Project scoping.
  - UI/design review checkpoint:
    - [ ] Review dashboard Deliverable summary cards, badges, filters, and visual balance with workflow progress

---

## MVP 5: Follow-Ups and History

Approval output: User can track operational follow-through and status-change history.

---

- [ ] 29. Implement FollowUpAction model and overdue rules
  - MVP slice: MVP 5 Follow-Ups and History
  - Labels: feature, backend, test
  - Depends on: Task 16
  - Description: Create FollowUpAction persistence and overdue calculation.
  - Linked requirement/design: Requirement 10; Requirement 12; Design 7.10; Design 11.5
  - Acceptance checklist:
    - [ ] `follow_up_actions` table has task ID, title, due date, status, remarks, and timestamps
    - [ ] Status values are Open, In_Progress, Done, and Cancelled
    - [ ] Overdue calculation matches requirements
    - [ ] Follow-Ups are scoped through parent Project access
  - Test expectation: Unit tests for status validation and overdue calculation. Feature tests for access denial.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 30. Build Follow-Up UI on Task detail and dashboard
  - MVP slice: MVP 5 Follow-Ups and History
  - Labels: feature, frontend, backend, design
  - Depends on: Task 29
  - Description: Add Follow-Up Action creation, listing, status updates, overdue display, and dashboard panel.
  - Linked requirement/design: Requirement 10; Requirement 12; Requirement 13; Design 13
  - Acceptance checklist:
    - [ ] Task detail page supports creating Follow-Up Actions
    - [ ] Task detail page supports updating Follow-Up status and remarks
    - [ ] Pending Follow-Ups show Open and In_Progress items
    - [ ] Overdue Follow-Ups are visually flagged
    - [ ] Dashboard shows overdue Follow-Ups prominently
    - [ ] Follow-Up Document Links are supported if Task 26 is complete
  - Test expectation: Feature tests for create, update, overdue display, dashboard count, and access denial.
  - UI/design review checkpoint:
    - [ ] Review Follow-Up section, overdue panel, status controls, dashboard prominence, and how it coexists with Deliverables

---

- [ ] 31. Implement AuditEntry events and history queries
  - MVP slice: MVP 5 Follow-Ups and History
  - Labels: feature, backend, test
  - Depends on: Task 20, Task 25, Task 30
  - Description: Record status changes for TaskWorkflowSteps, TaskDeliverables, and FollowUpActions.
  - Linked requirement/design: Requirement 15; Design 15
  - Acceptance checklist:
    - [ ] `audit_entries` table stores Project ID, entity type, entity ID, field changed, previous value, new value, user ID, and timestamp
    - [ ] TaskWorkflowStep status changes create AuditEntry
    - [ ] TaskDeliverable status changes create AuditEntry
    - [ ] FollowUpAction status changes create AuditEntry
    - [ ] History queries are scoped through Project access
    - [ ] Workflow definition save history remains future scope
  - Test expectation: Unit and feature tests for each audited status change and access denial.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 32. Build History timeline UI
  - MVP slice: MVP 5 Follow-Ups and History
  - Labels: feature, frontend, backend, design
  - Depends on: Task 31
  - Description: Display status change history for TaskWorkflowSteps, TaskDeliverables, and FollowUpActions.
  - Linked requirement/design: Requirement 15; Design 13; Design 15
  - Acceptance checklist:
    - [ ] TaskWorkflowStep history can be viewed
    - [ ] TaskDeliverable history can be viewed
    - [ ] FollowUpAction history can be viewed
    - [ ] History shows previous value, new value, date/time, and user
    - [ ] Empty history state is clear
    - [ ] History is visible only to Project owner in v1
  - Test expectation: Feature tests for history endpoints and access denial.
  - UI/design review checkpoint:
    - [ ] Review HistoryTimeline readability, empty state, timestamp formatting, and placement inside Task detail or related panels

---

## Cross-Slice Quality and Release Tasks

---

- [ ] 33. Maintain seeders for each MVP slice
  - MVP slice: Cross-slice
  - Labels: setup, backend
  - Depends on: Tasks 7, 14, 18, 25, 30
  - Description: Keep demo data useful for review after each MVP slice. Seeders should make the current slice easy to inspect without manual data entry.
  - Linked requirement/design: Design 17
  - Acceptance checklist:
    - [ ] MVP 0 seeds at least one local user and sample Projects
    - [ ] MVP 1 seeds sample workflow definitions with nodes, edges, positions, and viewport metadata
    - [ ] MVP 2 seeds sample Tasks with copied workflow steps and varied statuses
    - [ ] MVP 4 seeds sample Deliverables and Document Links
    - [ ] MVP 5 seeds sample Follow-Ups and Audit Entries
    - [ ] Seeded data never creates global roles or fake collaboration features
  - Test expectation: `php artisan migrate:fresh --seed` succeeds when seeders are available.
  - UI/design review checkpoint:
    - [ ] Review seeded states visually after each MVP slice so demos include empty, normal, and attention-needed states

---

- [ ] 34. Keep documentation current after each MVP slice
  - MVP slice: Cross-slice
  - Labels: documentation
  - Depends on: Task 3
  - Description: Update documentation incrementally after each slice instead of leaving all writing until the end.
  - Linked requirement/design: Design 19
  - Acceptance checklist:
    - [ ] MVP 0 updates setup, architecture, and project structure docs
    - [ ] MVP 1 updates workflow builder docs
    - [ ] MVP 2 updates workflow status and user guide docs
    - [ ] MVP 4 updates deliverables docs
    - [ ] MVP 5 updates history and user guide docs
    - [ ] Documentation reflects actual implementation, not intended future scope
  - Test expectation: Manual documentation review.
  - UI/design review checkpoint: Not required; this task has no page deliverable.

---

- [ ] 35. Final quality, accessibility, and UI consistency pass
  - MVP slice: Cross-slice
  - Labels: test, design, polish
  - Depends on: Tasks 32, 33, 34
  - Description: Review the whole application for consistency, accessibility, responsive behavior, MYDS alignment, and test coverage before calling v1 complete.
  - Linked requirement/design: Design 13; Design 16; Design 18; Design 21
  - Acceptance checklist:
    - [ ] All CI checks pass
    - [ ] PHPStan/Larastan reports no errors
    - [ ] Pint reports no violations
    - [ ] User-facing pages use MYDS-aligned components and spacing
    - [ ] No Jata Negara or official crest artwork appears
    - [ ] Text does not overflow controls on mobile or desktop
    - [ ] Empty, error, loading, disabled, and success states are reviewed
    - [ ] Project scoping and owner-only access are verified across all features
    - [ ] Requirements traceability is reviewed against `requirements.md`
  - Test expectation: Full automated test suite and manual UI/accessibility review.
  - UI/design review checkpoint:
    - [ ] Review all pages together for consistency: Login, App Shell, Projects, Workflow Builder, Task List, Task Detail, Dashboard, Deliverables, Document Links, Follow-Ups, and History

---

## Notes

- Keep PRs small and reviewable.
- Stop for approval after each MVP slice before expanding scope.
- Page work must include UI/design review before the next page task starts.
- Backend business rules belong in actions, policies, requests, and tests, not only in hidden UI states.
- WorkflowCanvas is design-time only and must not become the Task status update screen.
- Dashboard should use relational operational data for routine counts, not raw workflow JSON parsing.
- Do not add collaboration, OIDC, Spatie Permission, workflow automation, file uploads, external repository integrations, public API, or cross-project dashboard in v1.
- Do not use Jata Negara or official government crest artwork in v1.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2", "3"] },
    { "id": 2, "tasks": ["4"] },
    { "id": 3, "tasks": ["5", "6"] },
    { "id": 4, "tasks": ["7", "8"] },
    { "id": 5, "tasks": ["9", "10"] },
    { "id": 6, "tasks": ["11"] },
    { "id": 7, "tasks": ["12"] },
    { "id": 8, "tasks": ["13"] },
    { "id": 9, "tasks": ["14"] },
    { "id": 10, "tasks": ["15", "16"] },
    { "id": 11, "tasks": ["17"] },
    { "id": 12, "tasks": ["18"] },
    { "id": 13, "tasks": ["19"] },
    { "id": 14, "tasks": ["20"] },
    { "id": 15, "tasks": ["21"] },
    { "id": 16, "tasks": ["22"] },
    { "id": 17, "tasks": ["23"] },
    { "id": 18, "tasks": ["24", "26"] },
    { "id": 19, "tasks": ["25", "27"] },
    { "id": 20, "tasks": ["28"] },
    { "id": 21, "tasks": ["29"] },
    { "id": 22, "tasks": ["30"] },
    { "id": 23, "tasks": ["31"] },
    { "id": 24, "tasks": ["32"] },
    { "id": 25, "tasks": ["33", "34"] },
    { "id": 26, "tasks": ["35"] }
  ]
}
```
