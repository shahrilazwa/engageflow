# Requirements Document

## Introduction

EngageFlow is an internal web application for tracking team workstreams, tasks, and progress. It provides a structured, visual alternative to manual spreadsheet tracking. The primary v1 use case is the GovTech engagement team's ministry/agency onboarding workflow for MyGOV — but the core tracking model (owners, work items, workflow stages, follow-up actions, document links) is applicable to other team workflows.

## Glossary

- **Tracker**: The internal application that monitors engagement progress for services being onboarded into MyGOV
- **Agency_Owner**: A ministry or government agency that owns one or more digital services targeted for MyGOV integration
- **Service**: A digital service owned by an Agency_Owner that GovTech wants to make available through MyGOV (e.g., "Pembayaran Saman" owned by PDRM)
- **Workflow**: The 10-stage engagement and integration process that each Service goes through from initial request to Go-Live
- **Stage**: A single step within the Workflow (e.g., "Surat Permohonan Onboard", "UAT", "Go-Live")
- **Stage_Status**: The current state of a Stage for a given Service. Statuses for v1: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed
- **Target_Completion**: The expected date by which a Service should reach Go-Live. If only the month is known, use the last day of that month as the target date
- **Progress_View**: The graphical representation of engagement progress and status for one or more Services
- **Special_Project**: A tracked item that does not follow the standard Agency_Owner/Service hierarchy. For v1, tracked with: title, status, target date, follow-up actions, and document links (no 10-stage workflow)
- **Follow_Up_Action**: A follow-up task associated with a Service or Special_Project, with a title, due date, status (Open, In_Progress, Done, Cancelled), and remarks
- **Document_Link**: An external URL (typically Google Drive) associated with a Service, Stage, Special_Project, or Follow_Up_Action for reference
- **User_Role**: The access level assigned to a user. For v1: Admin, Lead, Member

## Requirements

### Requirement 1: Register Agency Owners

**User Story:** As an engagement team member, I want to register ministries and agencies as owners, so that I can associate their services for tracking.

#### Acceptance Criteria

1. THE Tracker SHALL allow registration of an Agency_Owner with a name
2. THE Tracker SHALL maintain a list of all registered Agency_Owners
3. WHEN an Agency_Owner is registered, THE Tracker SHALL allow one or more Services to be associated with that Agency_Owner

### Requirement 2: Register Services for Tracking

**User Story:** As an engagement team member, I want to register agency-owned services, so that I can track their engagement progress through the workflow.

#### Acceptance Criteria

1. THE Tracker SHALL allow registration of a Service with a name and an associated Agency_Owner
2. WHEN a Service is registered, THE Tracker SHALL initialize the Service with 10 Workflow Stages in the following fixed order: Surat Permohonan Onboard, Sesi Libat Urus, Surat Permohonan Integrasi, Kelulusan, Perbincangan / Bengkel Teknikal, Bengkel SAF, Pembangunan, SIT, UAT, Go-Live
3. WHEN a Service is registered, THE Tracker SHALL set all Stages to Pending status by default
4. THE Tracker SHALL maintain a list of all registered Services

### Requirement 3: Update Workflow Stage Status

**User Story:** As an engagement team member, I want to update the workflow stage status of a service, so that the tracker reflects the current engagement progress.

#### Acceptance Criteria

1. THE Tracker SHALL allow updating the Stage_Status of any Stage for a given Service to one of: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, or To_Be_Confirmed
2. THE Tracker SHALL allow updating any Stage regardless of the completion status of preceding Stages (stages generally follow workflow order, but out-of-order updates are permitted)
3. WHEN a Stage is marked as Completed, THE Tracker SHALL record the completion date
4. WHEN a Stage is explicitly marked as In_Progress by a user, THE Tracker SHALL display that Stage as the current active stage for the Service

### Requirement 4: Set Target Completion Timeline

**User Story:** As an engagement team member, I want to set a target completion date for each service, so that I can identify services that may be delayed.

#### Acceptance Criteria

1. THE Tracker SHALL allow setting a Target_Completion date for each Service
2. WHEN the current date exceeds the Target_Completion date and the Service has not reached Go-Live, THE Tracker SHALL flag the Service as delayed regardless of the Service's current workflow phase
3. THE Tracker SHALL display the Target_Completion date alongside the Service progress
4. IF the team only knows the target month, THE Tracker SHALL accept a month selection and use the last day of that month as the Target_Completion date

### Requirement 5: Display Graphical Progress for Individual Services

**User Story:** As an engagement team member, I want to see a visual representation of each service's workflow progress, so that I can quickly understand its current stage and status.

#### Acceptance Criteria

1. THE Progress_View SHALL display the Workflow as a visual timeline or progress indicator for each Service
2. THE Progress_View SHALL visually distinguish between different Stage_Status values using distinct visual indicators
3. THE Progress_View SHALL display the current active Stage prominently for each Service
4. THE Progress_View SHALL display the Agency_Owner name alongside each Service

### Requirement 6: Display Overall Engagement Progress Summary

**User Story:** As an engagement team member, I want to see an overall summary of engagement progress across all services, so that I can quickly assess the team's workload and achievements.

#### Acceptance Criteria

1. THE Progress_View SHALL display a summary showing the total number of tracked Services
2. THE Progress_View SHALL display the count of Services that have reached Go-Live
3. THE Progress_View SHALL display the count of Services currently in progress (not yet at Go-Live)
4. THE Progress_View SHALL display the count of Services flagged as delayed
5. THE Progress_View SHALL present overall progress using visual elements such as summary cards or simple charts

### Requirement 7: Identify Delayed and At-Risk Services

**User Story:** As an engagement team member, I want to quickly identify services that are delayed or at risk, so that I can prioritize follow-up actions.

#### Acceptance Criteria

1. WHEN a Service has exceeded its Target_Completion date without reaching Go-Live, THE Tracker SHALL display a delayed status indicator for that Service
2. THE Progress_View SHALL provide a filtered view showing only delayed Services
3. THE Progress_View SHALL visually highlight delayed Services distinctly from on-track Services

### Requirement 8: Support Special Projects

**User Story:** As an engagement team member, I want to track special projects that do not follow the standard agency/service hierarchy, so that all engagement work is captured in one place.

#### Acceptance Criteria

1. THE Tracker SHALL allow registration of a Special_Project that is not associated with a standard Agency_Owner
2. THE Tracker SHALL allow tracking progress for a Special_Project independently from standard Services
3. THE Progress_View SHALL display Special_Projects alongside standard Services
4. FOR v1, THE Tracker SHALL track each Special_Project with: title, status, target date, follow-up actions, and document links (the standard 10-stage workflow does not apply to Special_Projects)

### Requirement 9: Track Follow-Up Actions

**User Story:** As an engagement team member, I want to record follow-up actions for services, so that I can track what needs to be done and identify overdue items.

#### Acceptance Criteria

1. THE Tracker SHALL allow creating a Follow_Up_Action associated with a Service or Special_Project
2. THE Tracker SHALL record at minimum a title, due date, status, and remarks for each Follow_Up_Action
3. THE Tracker SHALL support the following Follow_Up_Action statuses: Open, In_Progress, Done, Cancelled
4. THE Tracker SHALL display pending Follow_Up_Actions (status is Open or In_Progress) that have not been completed
5. WHEN the current date exceeds the due date of a Follow_Up_Action and its status is not Done or Cancelled, THE Tracker SHALL flag it as overdue
6. THE Progress_View SHALL display overdue Follow_Up_Actions prominently

### Requirement 10: Support Document Links

**User Story:** As an engagement team member, I want to save and view links to external documents (e.g., Google Drive), so that I can quickly access related files without leaving the tracker.

#### Acceptance Criteria

1. THE Tracker SHALL allow saving one or more Document_Links for a Service, Stage, Special_Project, or Follow_Up_Action
2. THE Tracker SHALL store each Document_Link as an external URL with an optional label or description
3. THE Tracker SHALL display saved Document_Links alongside the associated entity (Service, Stage, Special_Project, or Follow_Up_Action)
4. THE Tracker SHALL allow opening a Document_Link in a new browser tab

### Requirement 11: User Access and Roles

**User Story:** As an admin, I want to assign roles to team members, so that access is managed appropriately for the engagement team.

#### Acceptance Criteria

1. THE Tracker SHALL support the following user roles for v1: Admin, Lead, Member
2. THE Tracker SHALL require authentication before granting access
3. THE Tracker SHALL allow Admin users to manage user accounts and assign roles
4. THE Tracker SHALL allow Lead and Member users to create, update, and view tracked Services, Special_Projects, and Follow_Up_Actions

### Requirement 12: Search and Filter Services

**User Story:** As an engagement team member, I want to search and filter the list of tracked services, so that I can quickly find specific services as the list grows.

#### Acceptance Criteria

1. THE Tracker SHALL provide a search function to find Services by name or Agency_Owner name
2. THE Tracker SHALL provide filtering by Agency_Owner, Stage_Status, and delayed status
3. THE Tracker SHALL display filtered results in the Progress_View

### Requirement 13: Track Stage Status Change History

**User Story:** As an engagement team member, I want to see the history of stage status changes, so that I can understand how engagement has progressed over time.

#### Acceptance Criteria

1. THE Tracker SHALL record each Stage_Status change with the previous status, new status, date of change, and user who made the change
2. THE Tracker SHALL record each Follow_Up_Action status change with the previous status, new status, date of change, and user who made the change
3. THE Tracker SHALL allow viewing the change history for a given Service or Follow_Up_Action

---

## Resolved Decisions

The following have been clarified and incorporated into the requirements above:

1. **Stage progression rules**: Stages generally follow workflow order, but users may update stages out of order because real engagement work does not always happen sequentially.

2. **Stage statuses (v1)**: Pending, In_Progress, Completed, KIV, Not_Applicable, Blocked, To_Be_Confirmed.

3. **Target completion granularity**: Tracked at the Service level using a target date. If the team only knows the month, use the last day of that month.

4. **Follow-up action statuses**: Open, In_Progress, Done, Cancelled.

5. **Document link scope**: Attachable to Service, Workflow Stage, Special_Project, and Follow_Up_Action.

6. **User access and roles (v1)**: Admin, Lead, Member. Viewer role can be considered later.

7. **Notifications and alerts (v1)**: Visual indicators on the dashboard are sufficient. No email, WhatsApp, or system notifications yet.

8. **Historical tracking**: Keep basic history of stage status changes and follow-up action updates.

9. **Multiple workflows (v1)**: Each service follows a single active workflow. Re-engagement can be handled later.

10. **Special Projects workflow (v1)**: Special Projects do not use the standard 10-stage workflow. They only need basic tracking: title, status, target date, follow-up actions, and document links.

11. **Number of services**: Small-to-medium internal usage. Include basic search and filtering because the list may grow.

12. **Deployment environment**: Web application. Development should support local container-based setup. Hosting to be decided later.

---

## Open Questions

All initial questions have been resolved. No open questions remain for v1 scope.
