# Requirements Document: EngageFlow Tracker

## Introduction

EngageFlow is a Laravel + Inertia React web application for visually designing project workflows and tracking work against those workflows.

The product model is **project-first**, **workflow-first**, **visual-builder-first**, and **single-user-first**. A User creates one or more Projects. Each Project has one Visual Workflow Definition stored as PostgreSQL JSONB. The User creates Tasks inside the Project, and each Task receives relational Task Workflow Step records copied from the Project workflow at Task creation time.

The first MVP must prove the core loop:

```text
Create Project
-> Visually build Project Workflow
-> Create Task from Workflow
-> Track Task progress
-> Track Deliverables, Follow-Up Actions, Document Links, and History
-> View Project dashboard
```

The app does not need a user profile organisation model in v1. In the first MVP, Project access is owner-only. Collaboration through Project members can be added later after the single-user workflow is stable.

The primary v1 use case can still be GovTech libat urus / MyGOV onboarding work, but the underlying model is generic. Different Projects may use different visual workflows, such as GovTech libat urus, procurement, Citizen Lab, internal planning, product launch, or any other trackable workstream.

---

## Glossary

- **Tracker**: The EngageFlow web application.
- **User**: A person with an authenticated account in EngageFlow.
- **Project**: A workspace created by a User to group related Tasks under one Visual Workflow Definition.
- **Project_Owner**: The User who created and owns a Project.
- **Project_User**: A User who can access a Project. In v1, this is the Project_Owner only. In the future, this may include Project_Members.
- **Project_Member**: A future collaboration user added to a Project by the Project_Owner.
- **Visual_Workflow_Definition**: The Project-level workflow design stored as PostgreSQL JSONB. It contains nodes, edges, visual positions, ordering, mandatory/optional settings, and viewport/layout metadata.
- **Visual_Workflow_Builder**: The canvas-like screen that allows the User to visually create and edit the Project workflow.
- **Workflow_Node**: A node inside the Visual_Workflow_Definition. In v1, node type is `stage`.
- **Workflow_Edge**: A connector between Workflow_Nodes. In v1, edges visually connect ordered stages and do not represent conditional execution.
- **Workflow_Step**: A user-facing step in a Project workflow. In v1, each step is represented by a stage-type Workflow_Node.
- **Task**: A tracked work item inside a Project.
- **Task_Workflow_Step**: A relational progress snapshot copied from the Project Visual_Workflow_Definition when a Task is created.
- **Step_Status**: The current state of a Task_Workflow_Step. V1 statuses: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed.
- **Task_Deliverable**: An expected output from a Task, such as a document, slide deck, spreadsheet, design file, repository, link, or other output.
- **Deliverable_Type**: The type of Task_Deliverable. V1 types: Document, Slide, Spreadsheet, Design, Repository, Link, Other.
- **Deliverable_Status**: The current state of a Task_Deliverable. V1 statuses: Pending, In_Progress, Completed, Not_Required.
- **Follow_Up_Action**: A follow-up action associated with a Task, with a title, due date, status, and remarks.
- **Document_Link**: An external URL attached to a Task, Task_Workflow_Step, Task_Deliverable, or Follow_Up_Action.
- **Target_Completion**: The expected date by which a Task should complete its final mandatory Task_Workflow_Step.
- **Project_Dashboard**: The selected-Project screen that displays Project progress, Tasks, delayed work, overdue work, deliverables, and follow-up items.
- **Audit_Entry**: A record of status changes for Task_Workflow_Steps, Task_Deliverables, and Follow_Up_Actions.

---

## Requirements

### Requirement 1: Authenticate User

**User Story:** As a User, I want to log in securely, so that I can access my Projects and manage my work.

#### Acceptance Criteria

1. THE Tracker SHALL support Laravel session-based authentication for v1.
2. THE Tracker SHALL allow an authenticated User to access the application dashboard.
3. THE Tracker SHALL redirect unauthenticated users to the login screen.
4. THE Tracker SHALL NOT require Keycloak, OIDC, SSO, or external identity integration in v1.
5. THE Tracker SHALL keep Project authorization separate from authentication.
6. THE Tracker SHALL be designed so that a future OIDC provider may map an external identity to a local User record.

---

### Requirement 2: Create and Manage Projects

**User Story:** As a User, I want to create multiple Projects, so that I can track separate workstreams independently.

#### Acceptance Criteria

1. THE Tracker SHALL allow an authenticated User to create a Project with a name and optional description.
2. WHEN a User creates a Project, THE Tracker SHALL assign that User as the Project_Owner.
3. THE Tracker SHALL allow a User to create and manage multiple Projects.
4. THE Tracker SHALL allow a User to view Projects they own.
5. THE Tracker SHALL prevent a User from viewing Projects they do not own, unless future Project membership grants access.
6. THE Tracker SHALL allow the Project_Owner to update the Project name and description.
7. THE Tracker SHALL allow the Project_Owner to archive a Project by setting its status to Archived.
8. THE Tracker SHALL allow the Project_Owner to reactivate an Archived Project.
9. THE Tracker SHALL display Archived Projects separately from active Projects or allow filtering by status.
10. THE Tracker SHALL allow the Project_Owner to soft-delete a Project. Soft-deleted Projects are hidden from normal views but can be restored.
11. THE Tracker SHALL create or make available one Visual_Workflow_Definition for each Project.
12. THE Tracker SHALL scope all Project data, including Visual_Workflow_Definition, Tasks, Task_Workflow_Steps, Task_Deliverables, Follow_Up_Actions, Document_Links, dashboard data, and Audit_Entries, to the selected Project.
13. THE Tracker SHALL NOT require a user profile organisation before creating a Project.

---

### Requirement 3: Visually Build Project Workflow

**User Story:** As a User, I want to visually create a workflow for each Project, so that I can model the real process used by that Project.

#### Acceptance Criteria

1. THE Tracker SHALL provide a Visual_Workflow_Builder for each Project.
2. THE Visual_Workflow_Builder SHALL be a core v1 feature and SHALL NOT be postponed to a later enhancement.
3. THE Visual_Workflow_Builder SHALL allow the User to add workflow stage nodes.
4. THE Visual_Workflow_Builder SHALL allow the User to edit the label/name of each workflow stage node.
5. THE Visual_Workflow_Builder SHALL allow the User to mark each workflow stage node as Mandatory or Optional.
6. THE Visual_Workflow_Builder SHALL allow the User to visually move/reposition workflow nodes.
7. THE Visual_Workflow_Builder SHALL allow the User to define or update the ordered sequence of workflow stage nodes.
8. THE Visual_Workflow_Builder SHALL show simple visual connectors/edges between ordered workflow stage nodes.
9. THE Visual_Workflow_Builder SHALL provide a way to save the workflow definition.
10. THE Visual_Workflow_Builder SHALL provide an empty state when no workflow nodes exist.
11. THE Visual_Workflow_Builder SHALL prevent saving a workflow that has no mandatory workflow stage node.
12. THE Visual_Workflow_Builder SHALL allow only Users who can access the Project to open the builder.
13. THE Visual_Workflow_Builder SHALL allow only the Project_Owner to save workflow changes in v1.
14. BEFORE Tasks exist in a Project, THE Visual_Workflow_Builder SHALL allow the Project_Owner to change workflow nodes, labels, mandatory flags, order, edges, positions, and viewport/layout metadata.
15. AFTER Tasks exist in a Project, THE Visual_Workflow_Builder SHALL allow layout-only changes such as node positions and viewport/layout metadata.
16. AFTER Tasks exist in a Project, THE Visual_Workflow_Builder SHALL block structural workflow changes that would affect Task_Workflow_Step snapshots, including adding nodes, removing nodes, changing labels, changing mandatory flags, changing order, or changing edges.
17. AFTER Tasks exist in a Project, THE Visual_Workflow_Builder SHALL make blocked structural workflow controls unavailable or reject blocked structural saves with a clear validation message explaining that Tasks already exist.
18. THE Tracker MAY later support workflow migration/rebuild features, but that is outside v1.

---

### Requirement 4: Store Visual Workflow Definition as JSONB

**User Story:** As a User, I want my visual workflow layout to be saved and restored, so that I can continue editing the workflow later.

#### Acceptance Criteria

1. THE Tracker SHALL store the Project workflow as a Visual_Workflow_Definition in PostgreSQL JSONB.
2. THE Visual_Workflow_Definition SHALL include workflow nodes.
3. EACH workflow node SHALL include a stable node ID, node type, label, mandatory flag, order, and visual position.
4. THE Visual_Workflow_Definition SHALL include workflow edges/connectors.
5. EACH workflow edge SHALL include a stable edge ID, source node ID, and target node ID.
6. THE Visual_Workflow_Definition MAY include viewport/layout metadata such as x-position, y-position, and zoom.
7. WHEN the User reopens the Visual_Workflow_Builder, THE Tracker SHALL reload saved nodes, edges, positions, and viewport/layout metadata.
8. THE Tracker SHALL validate the workflow definition server-side before saving.
9. THE Tracker SHALL increment the workflow definition version number on each successful save.
10. THE Tracker SHALL reject workflow definitions with missing node IDs, duplicate node IDs, missing labels, invalid edges, missing positions, missing mandatory nodes, or invalid node order.
10. THE Tracker SHALL use JSONB for the workflow definition so the model can later support richer workflow graph features.
11. THE Tracker SHALL NOT implement branching, conditional execution, runtime actions, connectors, webhooks, hooks, or automation in v1.
12. THE Tracker SHALL preserve existing Task_Workflow_Step snapshots when the Project workflow layout is changed after Tasks exist.

---

### Requirement 5: Create Tasks from Workflow Snapshot

**User Story:** As a User, I want each Task to be created from the Project workflow, so that Tasks follow the workflow that I designed visually.

#### Acceptance Criteria

1. THE Tracker SHALL allow a Project_User to create a Task inside a Project they can access.
2. THE Tracker SHALL record at minimum a Task title and optional description.
3. THE Tracker SHALL prevent Task creation when the parent Project has no valid Visual_Workflow_Definition.
4. THE Tracker SHALL prevent Task creation when the parent Project workflow has no mandatory workflow stage node.
5. WHEN a Task is created, THE Tracker SHALL read the Project Visual_Workflow_Definition.
6. WHEN a Task is created, THE Tracker SHALL create relational Task_Workflow_Step records copied from all workflow nodes, including Mandatory and Optional nodes.
7. EACH Task_Workflow_Step SHALL store the workflow node ID, label snapshot, mandatory snapshot, step order, status, and completion date field.
8. WHEN a Task is created, THE Tracker SHALL set all Task_Workflow_Steps to Pending by default.
9. THE Tracker SHALL preserve Task_Workflow_Step snapshots even if the Project workflow is later changed.
10. THE Tracker SHALL prevent Users who cannot access the parent Project from creating, viewing, or updating that Project's Tasks.

---

### Requirement 6: Manage Tasks Within a Project

**User Story:** As a Project_User, I want to manage Tasks inside a Project, so that I can track work items, deadlines, deliverables, and progress in one place.

#### Acceptance Criteria

1. THE Tracker SHALL maintain a list of Tasks for each Project.
2. THE Tracker SHALL allow a Project_User to view Tasks inside a Project they can access.
3. THE Tracker SHALL allow a Project_User to update Task title and description inside a Project they can access.
4. THE Tracker SHALL allow setting a Target_Completion date for each Task.
5. IF the User only knows the target month, THE Tracker SHALL accept a month selection and use the last day of that month as the Target_Completion date.
6. THE Tracker SHALL display the Target_Completion date alongside Task progress.
7. THE Tracker SHALL NOT require a Task to be associated with any user profile organisation.
8. THE Tracker SHALL allow a Project_User to soft-delete a Task. Soft-deleted Tasks are hidden from normal views but can be restored.
9. THE Tracker SHALL prevent Users who cannot access the parent Project from accessing Tasks.

---

### Requirement 7: Update Task Workflow Step Status

**User Story:** As a Project_User, I want to update the status of Task workflow steps, so that the Tracker reflects the current progress of each Task.

#### Acceptance Criteria

1. THE Tracker SHALL allow updating the Step_Status of any Task_Workflow_Step to one of: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, or To_Be_Confirmed.
2. THE Tracker SHALL allow updating any Task_Workflow_Step regardless of the completion status of preceding steps.
3. WHEN a Task_Workflow_Step is marked Completed, THE Tracker SHALL record the completion date.
4. WHEN a Task_Workflow_Step is explicitly marked In_Progress, THE Tracker SHALL display that step as the current active step for the Task.
5. IF more than one Task_Workflow_Step is In_Progress for a Task, THE Tracker SHALL treat the lowest ordered In_Progress step as the current active step.
6. IF no Task_Workflow_Step is In_Progress for a Task, THE Tracker SHALL treat the lowest ordered mandatory Task_Workflow_Step that is not Completed and not Not_Applicable as the current active step.
7. IF all mandatory Task_Workflow_Steps are Completed or Not_Applicable and no Task_Workflow_Step is In_Progress, THE Tracker SHALL show no current active step and SHALL treat the Task workflow as complete for progress display purposes.
8. THE Tracker SHALL allow only Users who can access the parent Project to update Step_Status.
9. THE Tracker SHALL record status changes in Audit_Entries.

---

### Requirement 8: Track Task Deliverables

**User Story:** As a Project_User, I want to record expected deliverables for a Task, so that I can track the actual outputs that must be produced.

#### Acceptance Criteria

1. THE Tracker SHALL allow creating one or more Task_Deliverables for a Task.
2. THE Tracker SHALL record at minimum a deliverable title, deliverable type, and status.
3. THE Tracker SHALL allow optional deliverable description, due date, and remarks.
4. THE Tracker SHALL support these Deliverable_Types in v1: Document, Slide, Spreadsheet, Design, Repository, Link, Other.
5. THE Tracker SHALL support these Deliverable_Statuses in v1: Pending, In_Progress, Completed, Not_Required.
6. THE Tracker SHALL allow updating Task_Deliverable details and status.
7. THE Tracker SHALL allow a Project_User to soft-delete a Task_Deliverable.
8. THE Tracker SHALL treat Task_Deliverables as expected outputs, not merely generic document links.
8. THE Tracker SHALL allow a Task_Deliverable to have one or more Document_Links attached.
9. WHEN the current date exceeds a Task_Deliverable due date and its status is Pending or In_Progress, THE Tracker SHALL flag the Task_Deliverable as overdue.
10. THE Tracker SHALL show Deliverable status on the Task detail screen.
11. THE Tracker SHALL summarize Deliverable status on Task cards or Task lists without overwhelming the workflow progress display.
12. THE Tracker SHALL record Deliverable_Status changes in Audit_Entries.
13. THE Tracker SHALL prevent Users who cannot access the parent Project from accessing Task_Deliverables.

---

### Requirement 9: Support Document Links

**User Story:** As a Project_User, I want to save and view links to external files or references, so that I can quickly access related materials without uploading files to the Tracker.

#### Acceptance Criteria

1. THE Tracker SHALL allow saving one or more Document_Links for a Task.
2. THE Tracker SHALL allow saving one or more Document_Links for a Task_Workflow_Step.
3. THE Tracker SHALL allow saving one or more Document_Links for a Task_Deliverable.
4. THE Tracker SHALL allow saving one or more Document_Links for a Follow_Up_Action.
5. THE Tracker SHALL store each Document_Link as an external URL with an optional label or description.
6. THE Tracker SHALL display saved Document_Links alongside the associated entity.
7. THE Tracker SHALL allow opening a Document_Link in a new browser tab.
8. THE Tracker SHALL prevent Users who cannot access the parent Project from accessing Document_Links.
9. THE Tracker SHALL NOT upload files in v1.
10. THE Tracker SHALL NOT integrate directly with Google Drive API, Figma API, GitHub API, or any external document repository API in v1.

---

### Requirement 10: Track Follow-Up Actions

**User Story:** As a Project_User, I want to record follow-up actions for Tasks, so that I can track what needs to be done and identify overdue items.

#### Acceptance Criteria

1. THE Tracker SHALL allow creating a Follow_Up_Action associated with a Task inside the selected Project.
2. THE Tracker SHALL record at minimum a title, due date, status, and remarks for each Follow_Up_Action.
3. THE Tracker SHALL support these Follow_Up_Action statuses: Open, In_Progress, Done, Cancelled.
4. THE Tracker SHALL allow a Project_User to soft-delete a Follow_Up_Action.
5. THE Tracker SHALL display pending Follow_Up_Actions where status is Open or In_Progress.
5. WHEN the current date exceeds the due date of a Follow_Up_Action and its status is not Done or Cancelled, THE Tracker SHALL flag it as overdue.
6. THE Project_Dashboard SHALL display overdue Follow_Up_Actions prominently for the selected Project.
7. THE Tracker SHALL record Follow_Up_Action status changes in Audit_Entries.
8. THE Tracker SHALL prevent Users who cannot access the parent Project from accessing Follow_Up_Actions.

---

### Requirement 11: Display Task Progress Visually

**User Story:** As a Project_User, I want to see visual progress for each Task, so that I can quickly understand its current workflow status.

#### Acceptance Criteria

1. THE Project_Dashboard SHALL display Task_Workflow_Steps as a visual timeline or progress indicator for each Task.
2. THE Project_Dashboard SHALL visually distinguish different Step_Status values.
3. THE Project_Dashboard SHALL display the current active Task_Workflow_Step prominently for each Task.
4. THE Project_Dashboard SHALL calculate progress using mandatory Task_Workflow_Steps only.
5. THE Project_Dashboard SHALL show optional Task_Workflow_Steps without counting them in the main progress percentage.
6. FOR progress calculation, THE Project_Dashboard SHALL count mandatory Task_Workflow_Steps with status Completed or Not_Applicable as complete.
7. THE Project_Dashboard SHALL display Task_Deliverable status separately from workflow progress.
8. THE Tracker SHALL show Task progress only to Users who can access the parent Project.

---

### Requirement 12: Identify Delayed Tasks and Overdue Work

**User Story:** As a Project_User, I want to identify delayed Tasks and overdue work, so that I can prioritize what needs attention.

#### Acceptance Criteria

1. THE Tracker SHALL define the final mandatory Task_Workflow_Step as the mandatory Task_Workflow_Step with the highest step order.
2. WHEN the current date exceeds the Target_Completion date and the Task's final mandatory Task_Workflow_Step is not Completed or Not_Applicable, THE Tracker SHALL flag the Task as delayed.
3. THE Project_Dashboard SHALL provide a filtered view showing delayed Tasks within the selected Project.
4. THE Project_Dashboard SHALL visually highlight delayed Tasks distinctly from on-track Tasks.
5. WHEN the current date exceeds a Follow_Up_Action due date and its status is not Done or Cancelled, THE Tracker SHALL flag the Follow_Up_Action as overdue.
6. THE Project_Dashboard SHALL display overdue Follow_Up_Actions prominently within the selected Project.
7. WHEN the current date exceeds a Task_Deliverable due date and its status is Pending or In_Progress, THE Tracker SHALL flag the Task_Deliverable as overdue.
8. THE Project_Dashboard SHALL display overdue Task_Deliverables prominently within the selected Project.
9. THE Tracker SHALL not require background jobs for delayed or overdue calculation in v1; these may be computed on read.

---

### Requirement 13: Display Project Dashboard

**User Story:** As a Project_User, I want to see a Project dashboard, so that I can quickly assess workload, progress, delays, deliverables, and follow-up items.

#### Acceptance Criteria

1. THE Project_Dashboard SHALL display a dashboard scoped to one selected Project.
2. THE Project_Dashboard SHALL display the total number of Tasks in the selected Project.
3. THE Project_Dashboard SHALL display the count of Tasks whose final mandatory Task_Workflow_Step is Completed or Not_Applicable.
4. THE Project_Dashboard SHALL display the count of Tasks still in progress.
5. THE Project_Dashboard SHALL display the count of delayed Tasks.
6. THE Project_Dashboard SHALL display the count of overdue Follow_Up_Actions.
7. THE Project_Dashboard SHALL display the count of pending or in-progress Task_Deliverables.
8. THE Project_Dashboard SHALL display the count of overdue Task_Deliverables.
9. THE Project_Dashboard SHALL provide a link or button to open the Visual_Workflow_Builder for the selected Project.
10. THE Project_Dashboard SHALL present Project progress using visual elements such as summary cards, badges, timelines, lists, or simple charts.
11. THE Project_Dashboard SHALL not mix counts across Projects unless a future cross-project dashboard is explicitly added.
12. THE Project_Dashboard SHALL use relational Task_Workflow_Step, Task_Deliverable, Follow_Up_Action, and Task data for routine dashboard counts rather than parsing raw workflow JSON.

---

### Requirement 14: Search and Filter Tasks

**User Story:** As a Project_User, I want to search and filter Tasks, so that I can quickly find specific work items as the Project grows.

#### Acceptance Criteria

1. THE Tracker SHALL provide a search function to find Tasks by title within the selected Project.
2. THE Tracker SHALL provide filtering by Step_Status within the selected Project.
3. THE Tracker SHALL provide filtering by delayed status within the selected Project.
4. THE Tracker SHALL provide filtering by Deliverable_Status within the selected Project.
5. THE Tracker SHALL provide filtering by overdue Task_Deliverable status within the selected Project.
6. THE Tracker SHALL display filtered results in the Project_Dashboard.
7. THE Tracker SHALL not return Tasks from Projects the User cannot access.

---

### Requirement 15: Track Status Change History

**User Story:** As a Project_User, I want to see status change history, so that I can understand how work has progressed over time.

#### Acceptance Criteria

1. THE Tracker SHALL record each Task_Workflow_Step status change with the previous status, new status, date of change, and User who made the change.
2. THE Tracker SHALL record each Task_Deliverable status change with the previous status, new status, date of change, and User who made the change.
3. THE Tracker SHALL record each Follow_Up_Action status change with the previous status, new status, date of change, and User who made the change.
4. THE Tracker SHALL allow viewing change history for a Task_Workflow_Step, Task_Deliverable, or Follow_Up_Action.
5. THE Tracker SHALL show history only to Users who can access the parent Project.
6. THE Tracker MAY later record Project workflow definition save history, but v1 priority is operational status history.

---

### Requirement 16: Enforce Project Access Control

**User Story:** As a User, I want my Projects to remain private, so that other Users cannot access my work unless I explicitly share it in the future.

#### Acceptance Criteria

1. THE Tracker SHALL enforce Project ownership using Laravel Policies.
2. THE Tracker SHALL allow a Project_Owner to access their own Projects.
3. THE Tracker SHALL prevent a User from accessing Projects owned by another User.
4. THE Tracker SHALL prevent a User from accessing Tasks, Task_Workflow_Steps, Task_Deliverables, Follow_Up_Actions, Document_Links, dashboard data, and Audit_Entries belonging to Projects they cannot access.
5. THE Tracker SHALL NOT use Spatie Laravel Permission in v1.
6. THE Tracker SHALL NOT require a global Admin role for normal v1 usage.
7. THE Tracker SHALL prefer 404 for inaccessible records where resource discovery is a concern.

---

### Requirement 17: Support Future Project Membership

**User Story:** As a Project_Owner, I may later want to add other Users to a Project, so that they can collaborate when the core single-user workflow is stable.

#### Acceptance Criteria

1. THE Tracker SHALL treat Project membership as a future extension, not a first-MVP dependency.
2. THE future collaboration model SHALL be Project-scoped, not global-role-based.
3. THE future collaboration model SHALL support at minimum Owner and Member roles.
4. THE future Project_Owner SHALL be able to add and remove Project_Members.
5. THE future Project_Member MAY view and contribute to Tasks inside the Project, subject to future policy rules.
6. THE future Project_Member SHALL NOT manage Project membership unless a later requirement explicitly adds that ability.
7. THE Tracker SHALL allow a User to use the app alone before any collaboration feature is implemented.

---

### Requirement 18: Maintain Implementation Guardrails

**User Story:** As a developer, I want clear implementation boundaries, so that the MVP remains focused while leaving room for future growth.

#### Acceptance Criteria

1. THE Tracker SHALL use Laravel + Inertia React for v1.
2. THE Tracker SHALL use PostgreSQL as the database for v1.
3. THE Tracker SHALL use PostgreSQL JSONB for Visual_Workflow_Definition storage.
4. THE Tracker SHALL use relational tables for Tasks, Task_Workflow_Steps, Task_Deliverables, Follow_Up_Actions, Document_Links, and Audit_Entries.
5. THE Tracker SHALL use Eloquent ORM and Laravel Query Builder for v1 data access.
6. THE Tracker SHALL NOT use Prisma in v1.
7. THE Tracker SHALL NOT rewrite to Next.js or Nuxt for v1.
8. THE Tracker SHALL NOT use MongoDB or full NoSQL storage in v1.
9. THE Tracker SHALL NOT implement a workflow automation engine in v1.
10. THE Tracker SHALL NOT implement file uploads or external document repository integrations in v1.
11. THE Tracker SHALL implement the Visual_Workflow_Builder early because it is the core product experience.

---

## Resolved Decisions

1. **Project-first model**: EngageFlow is organised around Projects. A User can create multiple Projects.
2. **Single-user-first access model**: The first MVP focuses on a User managing their own Projects. Collaboration is future scope.
3. **Visual-builder-first workflow model**: The Visual Workflow Builder is core v1 scope and should be implemented early.
4. **Workflow definition stored as JSONB**: Project workflow design and visual layout are stored in PostgreSQL JSONB.
5. **Task workflow progress stored relationally**: Task_Workflow_Steps are relational snapshots copied from the workflow definition when a Task is created.
6. **PostgreSQL selected**: PostgreSQL replaces MySQL because JSONB better supports flexible workflow definitions.
7. **Laravel + Inertia React retained**: No Next.js or Nuxt rewrite for v1.
8. **Eloquent retained**: No Prisma for v1.
9. **Laravel session auth retained**: No Keycloak/OIDC/SSO for v1.
10. **Laravel Policies retained**: No Spatie Laravel Permission for v1.
11. **No global Admin role in v1**: Access is based on Project ownership and later Project membership.
12. **No user profile organisation required**: EngageFlow does not need a user profile organisation model in v1.
13. **Task Deliverables are first-class**: Deliverables are expected Task outputs and are separate from generic Document_Links.
14. **Document links are external URLs only**: No file upload or external repository API integration in v1.
15. **Workflow v1 is visual but not automation**: V1 supports visual ordered-stage workflow creation, not branching/conditions/hooks/connectors/runtime execution.
16. **Workflow editing is restricted after Tasks exist**: V1 allows layout-only workflow changes after Tasks exist and blocks structural changes until a future workflow migration/rebuild feature exists.
17. **Dashboard is Project-scoped**: No cross-project dashboard in v1.
18. **Delayed and overdue status can be computed on read**: No queue or background job is required for v1 delayed/overdue calculations.
19. **Deliverables can be overdue**: A Task_Deliverable is overdue when its due date has passed and its status is Pending or In_Progress.
20. **Soft-delete for Projects, Tasks, Deliverables, and Follow-Ups**: V1 supports soft-delete (hidden from normal views, restorable). Hard-delete is not exposed in v1 UI.
21. **Project archive status**: Projects can be archived and reactivated. Archived Projects are hidden from the default active list.
22. **Workflow version tracking**: The workflow definition version is incremented on each successful save for future audit and rollback capability.
23. **No global roles in v1**: The old engagement-tracker role model (Admin, Lead, Member) is removed. V1 access is based on Project ownership. Future collaboration uses Project-scoped membership, not global roles.

---

## Open Questions

No open questions remain for the v1 requirements after clarifying active-step selection, optional workflow step snapshots, final mandatory step calculation, workflow edit locking after Tasks exist, and progress treatment for Not_Applicable steps.
