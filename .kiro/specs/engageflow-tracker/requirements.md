# Requirements Document

## Introduction

EngageFlow is a web application for tracking team workstreams, tasks, actions, deadlines, and progress. It provides a structured, visual alternative to manual spreadsheet tracking and allows a user to work alone or collaborate with other users inside shared projects.

The core product model is **project-first**: a user creates a Project or workspace, adds tracked work items, monitors workflow progress, and optionally adds other users to collaborate on that Project. The primary v1 use case remains the GovTech engagement team's ministry/agency onboarding workflow for MyGOV, but the underlying model can support other team workflows.

## Glossary

- **Tracker**: The EngageFlow web application for tracking projects, workstreams, tasks, progress, deadlines, action items, and related document links.
- **User**: A person with an authenticated account in EngageFlow. A user can create and manage their own Projects and can be added to Projects created by other users.
- **Project**: A workspace/container created by a User to group related work. Example: "GovTech Libat Urus", "MyGOV Onboarding", or "Internal Planning". All tracked work items, owners/stakeholders, follow-up actions, document links, and dashboards are scoped to a Project.
- **Project_Owner**: The User who created a Project. The Project_Owner can manage the Project and add or remove Project_Members.
- **Project_Member**: A User who has been added to a Project by the Project_Owner. A Project_Member can view and contribute to work inside that Project.
- **Project_Role**: The access level a User has within a Project. For v1: Owner and Member. Roles are project-scoped, not global application roles.
- **Agency_Owner**: (v1 entity) A ministry, government agency, organisation, stakeholder, or owner group that owns one or more tracked work items inside a Project. In the generic model, this represents a stakeholder or owner organisation.
- **Service**: (v1 entity) A tracked work item inside a Project that progresses through a workflow. In v1, this can represent a digital service owned by an Agency_Owner that GovTech wants to make available through MyGOV (e.g., "Pembayaran Saman" owned by PDRM).
- **Workflow**: A multi-stage process that each Service goes through. In v1, this is a fixed 10-stage engagement and integration process from initial request to Go-Live.
- **Stage**: A single step within the Workflow (e.g., "Surat Permohonan Onboard", "UAT", "Go-Live").
- **Stage_Status**: The current state of a Stage for a given Service. Statuses for v1: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed.
- **Target_Completion**: The expected date by which a Service should reach its final workflow stage. If only the month is known, use the last day of that month as the target date.
- **Progress_View**: The graphical representation of Project/workstream progress and status for one or more Services.
- **Special_Project**: A tracked item inside a Project that does not follow the standard Agency_Owner/Service hierarchy. For v1, tracked with: title, status, target date, follow-up actions, and document links (no multi-stage workflow).
- **Follow_Up_Action**: A follow-up task or action item associated with a Service or Special_Project, with a title, due date, status (Open, In_Progress, Done, Cancelled), and remarks.
- **Document_Link**: An external URL (typically Google Drive or another document repository) associated with a Service, Stage, Special_Project, or Follow_Up_Action for reference.

## Requirements

### Requirement 1: Create and Manage Projects

**User Story:** As a user, I want to create a Project, so that I can track a specific workstream or group of tasks in one workspace.

#### Acceptance Criteria

1. THE Tracker SHALL allow an authenticated User to create a Project with a name and optional description.
2. WHEN a User creates a Project, THE Tracker SHALL assign that User as the Project_Owner.
3. THE Tracker SHALL allow a User to view Projects that they own or where they are a Project_Member.
4. THE Tracker SHALL prevent a User from viewing Projects where they are neither Project_Owner nor Project_Member.
5. THE Tracker SHALL allow the Project_Owner to update the Project name and description.
6. THE Tracker SHALL scope all Project data, including Agency_Owners, Services, Special_Projects, Follow_Up_Actions, Document_Links, and dashboard data, to the selected Project.

### Requirement 2: Manage Project Members

**User Story:** As a Project owner, I want to add other users to my Project, so that they can see and collaborate on the Project work.

#### Acceptance Criteria

1. THE Tracker SHALL allow the Project_Owner to add an existing User as a Project_Member.
2. THE Tracker SHALL allow the Project_Owner to remove a Project_Member from the Project.
3. THE Tracker SHALL prevent Project_Members from adding or removing other Project_Members in v1.
4. THE Tracker SHALL allow a Project_Member to view and contribute to work items inside the Project.
5. THE Tracker SHALL prevent non-members from viewing, creating, updating, or deleting Project-scoped data.
6. THE Tracker SHALL not require a global Admin role for normal v1 usage.
7. THE Tracker SHALL allow a User to use the app alone with only Projects they own.

### Requirement 3: Register Agency Owners Within a Project

**User Story:** As a Project member, I want to register stakeholder organisations as owners within a Project, so that I can associate work items with them.

#### Acceptance Criteria

1. THE Tracker SHALL allow a Project_Owner or Project_Member to register an Agency_Owner with a name inside a Project.
2. THE Tracker SHALL maintain a list of Agency_Owners for each Project.
3. WHEN an Agency_Owner is registered, THE Tracker SHALL allow one or more Services in the same Project to be associated with that Agency_Owner.
4. THE Tracker SHALL prevent Users who are not members of the Project from creating, viewing, or updating that Project's Agency_Owners.

### Requirement 4: Register Services for Tracking Within a Project

**User Story:** As a Project member, I want to register work items for tracking inside a Project, so that I can monitor their progress through the workflow.

#### Acceptance Criteria

1. THE Tracker SHALL allow registration of a Service with a name and an associated Agency_Owner inside the same Project.
2. WHEN a Service is registered, THE Tracker SHALL initialize the Service with 10 Workflow Stages in the following fixed order: Surat Permohonan Onboard, Sesi Libat Urus, Surat Permohonan Integrasi, Kelulusan, Perbincangan / Bengkel Teknikal, Bengkel SAF, Pembangunan, SIT, UAT, Go-Live.
3. WHEN a Service is registered, THE Tracker SHALL set all Stages to Pending status by default.
4. THE Tracker SHALL maintain a list of all registered Services for each Project.
5. THE Tracker SHALL prevent Users who are not members of the Project from creating, viewing, or updating that Project's Services.

### Requirement 5: Update Workflow Stage Status

**User Story:** As a Project member, I want to update the workflow stage status of a Service, so that the Tracker reflects the current progress.

#### Acceptance Criteria

1. THE Tracker SHALL allow updating the Stage_Status of any Stage for a given Service to one of: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, or To_Be_Confirmed.
2. THE Tracker SHALL allow updating any Stage regardless of the completion status of preceding Stages (stages generally follow workflow order, but out-of-order updates are permitted).
3. WHEN a Stage is marked as Completed, THE Tracker SHALL record the completion date.
4. WHEN a Stage is explicitly marked as In_Progress by a user, THE Tracker SHALL display that Stage as the current active stage for the Service.
5. THE Tracker SHALL allow only Project_Owners and Project_Members of the parent Project to update Stage_Status.

### Requirement 6: Set Target Completion Timeline

**User Story:** As a Project member, I want to set a target completion date for each Service, so that I can identify work items that may be delayed.

#### Acceptance Criteria

1. THE Tracker SHALL allow setting a Target_Completion date for each Service.
2. WHEN the current date exceeds the Target_Completion date and the Service has not reached Go-Live, THE Tracker SHALL flag the Service as delayed regardless of the Service's current workflow phase.
3. THE Tracker SHALL display the Target_Completion date alongside the Service progress.
4. IF the team only knows the target month, THE Tracker SHALL accept a month selection and use the last day of that month as the Target_Completion date.
5. THE Tracker SHALL scope Target_Completion visibility and updates to Project_Owners and Project_Members of the parent Project.

### Requirement 7: Display Graphical Progress for Individual Services

**User Story:** As a Project member, I want to see a visual representation of each Service's workflow progress, so that I can quickly understand its current stage and status.

#### Acceptance Criteria

1. THE Progress_View SHALL display the Workflow as a visual timeline or progress indicator for each Service.
2. THE Progress_View SHALL visually distinguish between different Stage_Status values using distinct visual indicators.
3. THE Progress_View SHALL display the current active Stage prominently for each Service.
4. THE Progress_View SHALL display the Agency_Owner name alongside each Service.
5. THE Tracker SHALL show Service progress only to Users who can access the parent Project.

### Requirement 8: Display Project Progress Summary

**User Story:** As a Project member, I want to see an overall summary of progress within a Project, so that I can quickly assess workload, delays, and completion status.

#### Acceptance Criteria

1. THE Progress_View SHALL display a summary showing the total number of tracked Services in the selected Project.
2. THE Progress_View SHALL display the count of Services in the selected Project that have reached Go-Live.
3. THE Progress_View SHALL display the count of Services in the selected Project currently in progress (not yet at Go-Live).
4. THE Progress_View SHALL display the count of Services in the selected Project flagged as delayed.
5. THE Progress_View SHALL present overall Project progress using visual elements such as summary cards or simple charts.
6. THE Tracker SHALL not mix dashboard counts across Projects unless a future cross-project view is explicitly added.

### Requirement 9: Identify Delayed and At-Risk Services

**User Story:** As a Project member, I want to quickly identify Services that are delayed or at risk, so that I can prioritize follow-up actions.

#### Acceptance Criteria

1. WHEN a Service has exceeded its Target_Completion date without reaching Go-Live, THE Tracker SHALL display a delayed status indicator for that Service.
2. THE Progress_View SHALL provide a filtered view showing only delayed Services within the selected Project.
3. THE Progress_View SHALL visually highlight delayed Services distinctly from on-track Services.

### Requirement 10: Support Special Projects

**User Story:** As a Project member, I want to track standalone work items that do not follow the standard owner/service hierarchy, so that all tracked work is captured in one Project.

#### Acceptance Criteria

1. THE Tracker SHALL allow registration of a Special_Project inside a Project.
2. THE Tracker SHALL allow tracking progress for a Special_Project independently from standard Services.
3. THE Progress_View SHALL display Special_Projects for the selected Project alongside standard Services.
4. FOR v1, THE Tracker SHALL track each Special_Project with: title, status, target date, follow-up actions, and document links.
5. THE standard 10-stage workflow SHALL NOT apply to Special_Projects.
6. THE Tracker SHALL prevent non-members of the parent Project from accessing Special_Projects.

### Requirement 11: Track Follow-Up Actions

**User Story:** As a Project member, I want to record follow-up actions for Services and Special_Projects, so that I can track what needs to be done and identify overdue items.

#### Acceptance Criteria

1. THE Tracker SHALL allow creating a Follow_Up_Action associated with a Service or Special_Project inside the selected Project.
2. THE Tracker SHALL record at minimum a title, due date, status, and remarks for each Follow_Up_Action.
3. THE Tracker SHALL support the following Follow_Up_Action statuses: Open, In_Progress, Done, Cancelled.
4. THE Tracker SHALL display pending Follow_Up_Actions (status is Open or In_Progress) that have not been completed.
5. WHEN the current date exceeds the due date of a Follow_Up_Action and its status is not Done or Cancelled, THE Tracker SHALL flag it as overdue.
6. THE Progress_View SHALL display overdue Follow_Up_Actions prominently for the selected Project.
7. THE Tracker SHALL prevent non-members of the parent Project from accessing Follow_Up_Actions.

### Requirement 12: Support Document Links

**User Story:** As a Project member, I want to save and view links to external documents, so that I can quickly access related files without leaving the Tracker.

#### Acceptance Criteria

1. THE Tracker SHALL allow saving one or more Document_Links for a Service, Stage, Special_Project, or Follow_Up_Action inside the selected Project.
2. THE Tracker SHALL store each Document_Link as an external URL with an optional label or description.
3. THE Tracker SHALL display saved Document_Links alongside the associated entity.
4. THE Tracker SHALL allow opening a Document_Link in a new browser tab.
5. THE Tracker SHALL prevent non-members of the parent Project from accessing Document_Links.
6. THE Tracker SHALL NOT upload files or integrate directly with Google Drive API in v1.

### Requirement 13: Search and Filter Services

**User Story:** As a Project member, I want to search and filter the list of tracked Services, so that I can quickly find specific work items as the list grows.

#### Acceptance Criteria

1. THE Tracker SHALL provide a search function to find Services by name or Agency_Owner name within the selected Project.
2. THE Tracker SHALL provide filtering by Agency_Owner, Stage_Status, and delayed status within the selected Project.
3. THE Tracker SHALL display filtered results in the Progress_View.
4. THE Tracker SHALL not return Services from Projects the User cannot access.

### Requirement 14: Track Status Change History

**User Story:** As a Project member, I want to see the history of status changes, so that I can understand how work has progressed over time.

#### Acceptance Criteria

1. THE Tracker SHALL record each Stage_Status change with the previous status, new status, date of change, and User who made the change.
2. THE Tracker SHALL record each Follow_Up_Action status change with the previous status, new status, date of change, and User who made the change.
3. THE Tracker SHALL allow viewing the change history for a given Service or Follow_Up_Action.
4. THE Tracker SHALL show history only to Users who can access the parent Project.

---

## Resolved Decisions

The following have been clarified and incorporated into the requirements above:

1. **Project-first access model**: EngageFlow uses a Project/workspace access model. A User can create a Project and work alone, or add other Users as Project_Members.

2. **No global Admin role in v1**: Normal v1 usage does not require an application-wide Admin role. Access is scoped by Project ownership and membership.

3. **Project roles (v1)**: Owner and Member. Owner can manage Project membership. Member can view and contribute to work inside the Project.

4. **V1 entity names**: Agency_Owner and Service remain as v1 entity names because the first configured use case is GovTech/MyGOV onboarding. Generically, they map to owner/stakeholder and tracked work item.

5. **Stage progression rules**: Stages generally follow workflow order, but users may update stages out of order because real work does not always happen sequentially.

6. **Stage statuses (v1)**: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed.

7. **Target completion granularity**: Tracked at the Service level using a target date. If the team only knows the month, use the last day of that month.

8. **Follow-up action statuses**: Open, In_Progress, Done, Cancelled.

9. **Document link scope**: Attachable to Service, Workflow Stage, Special_Project, and Follow_Up_Action.

10. **Notifications and alerts (v1)**: Visual indicators on the dashboard are sufficient. No email, WhatsApp, or system notifications yet.

11. **Historical tracking**: Keep basic history of stage status changes and follow-up action updates.

12. **Multiple workflows (v1)**: Each Service follows a single active workflow. Re-engagement can be handled later.

13. **Special Projects workflow (v1)**: Special Projects do not use the standard 10-stage workflow. They only need basic tracking: title, status, target date, follow-up actions, and document links.

14. **Number of Services**: Small-to-medium internal usage per Project. Include basic search and filtering because the list may grow.

15. **Deployment environment**: Web application. Development should support local container-based setup. Hosting to be decided later.

---

## Open Questions

No open questions remain for the v1 requirements after adopting the Project-first access model.
