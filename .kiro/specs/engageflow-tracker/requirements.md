# Requirements Document

## Introduction

EngageFlow is a web application for tracking projects, tasks, actions, deadlines, and progress. It provides a structured, visual alternative to manual spreadsheet tracking and allows a user to work alone or collaborate with other users inside shared projects.

The core product model is **project-first**: a user creates a Project or workspace, creates Tasks inside that Project, monitors progress, and optionally invites other users to collaborate. The app does not need to know which agency, ministry, company, or organisation a user belongs to. Project sharing is controlled by the Project owner through project membership.

The primary v1 use case can still be GovTech libat urus / MyGOV onboarding work, but the underlying model is generic: Project → Tasks → Workflow Stages / Actions / Documents / Progress.

## Glossary

- **Tracker**: The EngageFlow web application for tracking projects, tasks, progress, deadlines, action items, and related document links.
- **User**: A person with an authenticated account in EngageFlow. A User can create Projects, use the app alone, and be invited to Projects created by other Users.
- **Project**: A workspace/container created by a User to group related Tasks. Examples: "GovTech Libat Urus", "MyGOV Onboarding", "Internal Planning", or "Product Launch".
- **Project_Owner**: The User who created a Project. The Project_Owner can update the Project and manage Project membership.
- **Project_Member**: A User added to a Project by the Project_Owner. A Project_Member can view and contribute to Tasks inside that Project.
- **Project_Role**: The access level a User has within a Project. For v1: Owner and Member. Roles are project-scoped, not global application roles.
- **Task**: A tracked work item inside a Project. A Task can represent a GovTech libat urus item, an onboarding item, a service integration item, or any other work item the Project owner wants to track.
- **Workflow**: A multi-stage process that a Task can go through. In v1, Tasks use a fixed 10-stage workflow suitable for GovTech libat urus / onboarding work.
- **Stage**: A single step within the Workflow (e.g., "Surat Permohonan Onboard", "UAT", "Go-Live").
- **Stage_Status**: The current state of a Stage for a given Task. Statuses for v1: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed.
- **Target_Completion**: The expected date by which a Task should reach its final workflow stage. If only the month is known, use the last day of that month as the target date.
- **Progress_View**: The graphical representation of Project and Task progress.
- **Follow_Up_Action**: A follow-up task or action item associated with a Task, with a title, due date, status (Open, In_Progress, Done, Cancelled), and remarks.
- **Document_Link**: An external URL (typically Google Drive or another document repository) associated with a Task, Stage, or Follow_Up_Action for reference.

## Requirements

### Requirement 1: Create and Manage Projects

**User Story:** As a User, I want to create a Project, so that I can track a specific workstream or group of Tasks in one workspace.

#### Acceptance Criteria

1. THE Tracker SHALL allow an authenticated User to create a Project with a name and optional description.
2. WHEN a User creates a Project, THE Tracker SHALL assign that User as the Project_Owner.
3. THE Tracker SHALL allow a User to view Projects that they own or where they are a Project_Member.
4. THE Tracker SHALL prevent a User from viewing Projects where they are neither Project_Owner nor Project_Member.
5. THE Tracker SHALL allow the Project_Owner to update the Project name and description.
6. THE Tracker SHALL scope all Project data, including Tasks, Workflow Stages, Follow_Up_Actions, Document_Links, dashboard data, and history, to the selected Project.
7. THE Tracker SHALL NOT require a User to declare their agency, ministry, company, or organisation before creating a Project.

### Requirement 2: Manage Project Members

**User Story:** As a Project_Owner, I want to add other Users to my Project, so that they can see and collaborate on the Project work.

#### Acceptance Criteria

1. THE Tracker SHALL allow the Project_Owner to add an existing User as a Project_Member.
2. THE Tracker SHALL allow the Project_Owner to remove a Project_Member from the Project.
3. THE Tracker SHALL prevent Project_Members from adding or removing other Project_Members in v1.
4. THE Tracker SHALL allow a Project_Member to view and contribute to Tasks inside the Project.
5. THE Tracker SHALL prevent non-members from viewing, creating, updating, or deleting Project-scoped data.
6. THE Tracker SHALL not require a global Admin role for normal v1 usage.
7. THE Tracker SHALL allow a User to use the app alone with only Projects they own.

### Requirement 3: Create and Manage Tasks Within a Project

**User Story:** As a Project_Member, I want to create Tasks inside a Project, so that I can track work items, deadlines, and progress in one place.

#### Acceptance Criteria

1. THE Tracker SHALL allow a Project_Owner or Project_Member to create a Task inside a Project.
2. THE Tracker SHALL record at minimum a Task title/name and optional description.
3. THE Tracker SHALL maintain a list of all Tasks for each Project.
4. THE Tracker SHALL allow Project_Owners and Project_Members to update Task details.
5. THE Tracker SHALL prevent Users who are not members of the Project from creating, viewing, or updating that Project's Tasks.
6. THE Tracker SHALL NOT require a Task to be associated with an agency, ministry, company, or organisation.

### Requirement 4: Initialize Task Workflow Stages

**User Story:** As a Project_Member, I want each Task to have workflow stages, so that I can monitor its progress consistently.

#### Acceptance Criteria

1. WHEN a Task is created, THE Tracker SHALL initialize the Task with 10 Workflow Stages in the following fixed order: Surat Permohonan Onboard, Sesi Libat Urus, Surat Permohonan Integrasi, Kelulusan, Perbincangan / Bengkel Teknikal, Bengkel SAF, Pembangunan, SIT, UAT, Go-Live.
2. WHEN a Task is created, THE Tracker SHALL set all Stages to Pending status by default.
3. THE Tracker SHALL maintain all Workflow Stages under the parent Task and Project.
4. THE Tracker SHALL prevent Users who are not members of the parent Project from accessing the Task's Workflow Stages.

### Requirement 5: Update Workflow Stage Status

**User Story:** As a Project_Member, I want to update the workflow stage status of a Task, so that the Tracker reflects the current progress.

#### Acceptance Criteria

1. THE Tracker SHALL allow updating the Stage_Status of any Stage for a given Task to one of: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, or To_Be_Confirmed.
2. THE Tracker SHALL allow updating any Stage regardless of the completion status of preceding Stages (stages generally follow workflow order, but out-of-order updates are permitted).
3. WHEN a Stage is marked as Completed, THE Tracker SHALL record the completion date.
4. WHEN a Stage is explicitly marked as In_Progress by a User, THE Tracker SHALL display that Stage as the current active stage for the Task.
5. THE Tracker SHALL allow only Project_Owners and Project_Members of the parent Project to update Stage_Status.

### Requirement 6: Set Target Completion Timeline

**User Story:** As a Project_Member, I want to set a target completion date for each Task, so that I can identify work items that may be delayed.

#### Acceptance Criteria

1. THE Tracker SHALL allow setting a Target_Completion date for each Task.
2. WHEN the current date exceeds the Target_Completion date and the Task has not reached Go-Live, THE Tracker SHALL flag the Task as delayed regardless of the Task's current workflow phase.
3. THE Tracker SHALL display the Target_Completion date alongside the Task progress.
4. IF the team only knows the target month, THE Tracker SHALL accept a month selection and use the last day of that month as the Target_Completion date.
5. THE Tracker SHALL scope Target_Completion visibility and updates to Project_Owners and Project_Members of the parent Project.

### Requirement 7: Display Graphical Progress for Individual Tasks

**User Story:** As a Project_Member, I want to see a visual representation of each Task's workflow progress, so that I can quickly understand its current stage and status.

#### Acceptance Criteria

1. THE Progress_View SHALL display the Workflow as a visual timeline or progress indicator for each Task.
2. THE Progress_View SHALL visually distinguish between different Stage_Status values using distinct visual indicators.
3. THE Progress_View SHALL display the current active Stage prominently for each Task.
4. THE Tracker SHALL show Task progress only to Users who can access the parent Project.

### Requirement 8: Display Project Progress Summary

**User Story:** As a Project_Member, I want to see an overall summary of progress within a Project, so that I can quickly assess workload, delays, and completion status.

#### Acceptance Criteria

1. THE Progress_View SHALL display a summary showing the total number of tracked Tasks in the selected Project.
2. THE Progress_View SHALL display the count of Tasks in the selected Project that have reached Go-Live.
3. THE Progress_View SHALL display the count of Tasks in the selected Project currently in progress (not yet at Go-Live).
4. THE Progress_View SHALL display the count of Tasks in the selected Project flagged as delayed.
5. THE Progress_View SHALL present overall Project progress using visual elements such as summary cards or simple charts.
6. THE Tracker SHALL not mix dashboard counts across Projects unless a future cross-project view is explicitly added.

### Requirement 9: Identify Delayed and At-Risk Tasks

**User Story:** As a Project_Member, I want to quickly identify Tasks that are delayed or at risk, so that I can prioritize follow-up actions.

#### Acceptance Criteria

1. WHEN a Task has exceeded its Target_Completion date without reaching Go-Live, THE Tracker SHALL display a delayed status indicator for that Task.
2. THE Progress_View SHALL provide a filtered view showing only delayed Tasks within the selected Project.
3. THE Progress_View SHALL visually highlight delayed Tasks distinctly from on-track Tasks.

### Requirement 10: Track Follow-Up Actions

**User Story:** As a Project_Member, I want to record follow-up actions for Tasks, so that I can track what needs to be done and identify overdue items.

#### Acceptance Criteria

1. THE Tracker SHALL allow creating a Follow_Up_Action associated with a Task inside the selected Project.
2. THE Tracker SHALL record at minimum a title, due date, status, and remarks for each Follow_Up_Action.
3. THE Tracker SHALL support the following Follow_Up_Action statuses: Open, In_Progress, Done, Cancelled.
4. THE Tracker SHALL display pending Follow_Up_Actions (status is Open or In_Progress) that have not been completed.
5. WHEN the current date exceeds the due date of a Follow_Up_Action and its status is not Done or Cancelled, THE Tracker SHALL flag it as overdue.
6. THE Progress_View SHALL display overdue Follow_Up_Actions prominently for the selected Project.
7. THE Tracker SHALL prevent non-members of the parent Project from accessing Follow_Up_Actions.

### Requirement 11: Support Document Links

**User Story:** As a Project_Member, I want to save and view links to external documents, so that I can quickly access related files without leaving the Tracker.

#### Acceptance Criteria

1. THE Tracker SHALL allow saving one or more Document_Links for a Task, Stage, or Follow_Up_Action inside the selected Project.
2. THE Tracker SHALL store each Document_Link as an external URL with an optional label or description.
3. THE Tracker SHALL display saved Document_Links alongside the associated entity.
4. THE Tracker SHALL allow opening a Document_Link in a new browser tab.
5. THE Tracker SHALL prevent non-members of the parent Project from accessing Document_Links.
6. THE Tracker SHALL NOT upload files or integrate directly with Google Drive API in v1.

### Requirement 12: Search and Filter Tasks

**User Story:** As a Project_Member, I want to search and filter the list of tracked Tasks, so that I can quickly find specific work items as the list grows.

#### Acceptance Criteria

1. THE Tracker SHALL provide a search function to find Tasks by title/name within the selected Project.
2. THE Tracker SHALL provide filtering by Stage_Status and delayed status within the selected Project.
3. THE Tracker SHALL display filtered results in the Progress_View.
4. THE Tracker SHALL not return Tasks from Projects the User cannot access.

### Requirement 13: Track Status Change History

**User Story:** As a Project_Member, I want to see the history of status changes, so that I can understand how work has progressed over time.

#### Acceptance Criteria

1. THE Tracker SHALL record each Stage_Status change with the previous status, new status, date of change, and User who made the change.
2. THE Tracker SHALL record each Follow_Up_Action status change with the previous status, new status, date of change, and User who made the change.
3. THE Tracker SHALL allow viewing the change history for a given Task or Follow_Up_Action.
4. THE Tracker SHALL show history only to Users who can access the parent Project.

---

## Resolved Decisions

The following have been clarified and incorporated into the requirements above:

1. **Project-first access model**: EngageFlow uses a Project/workspace access model. A User can create a Project and work alone, or add other Users as Project_Members.

2. **No global Admin role in v1**: Normal v1 usage does not require an application-wide Admin role. Access is scoped by Project ownership and membership.

3. **Project roles (v1)**: Owner and Member. Owner can manage Project membership. Member can view and contribute to work inside the Project.

4. **No agency/company profile required**: EngageFlow does not need to know which agency, ministry, company, or organisation a User belongs to. Project sharing is handled by invitation or membership from the Project_Owner.

5. **Task-based tracking model**: Tasks are the main tracked work items inside a Project. A Task can represent GovTech libat urus work, MyGOV onboarding work, internal planning work, or other trackable work items.

6. **V1 workflow configuration**: Each Task follows a fixed 10-stage workflow suitable for GovTech libat urus / onboarding work. Configurable workflow templates can be considered later.

7. **Stage progression rules**: Stages generally follow workflow order, but Users may update stages out of order because real work does not always happen sequentially.

8. **Stage statuses (v1)**: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed.

9. **Target completion granularity**: Tracked at the Task level using a target date. If the team only knows the month, use the last day of that month.

10. **Follow-up action statuses**: Open, In_Progress, Done, Cancelled.

11. **Document link scope**: Attachable to Task, Workflow Stage, and Follow_Up_Action.

12. **Notifications and alerts (v1)**: Visual indicators on the dashboard are sufficient. No email, WhatsApp, or system notifications yet.

13. **Historical tracking**: Keep basic history of stage status changes and follow-up action updates.

14. **Number of Tasks**: Small-to-medium internal usage per Project. Include basic search and filtering because the list may grow.

15. **Deployment environment**: Web application. Development should support local container-based setup. Hosting to be decided later.

---

## Open Questions

No open questions remain for the v1 requirements after adopting the Project-first, Task-based access model.
