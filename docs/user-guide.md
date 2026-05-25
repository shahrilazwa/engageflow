# User Guide

This guide is a skeleton for people using EngageFlow. It will be expanded with screenshots and step-by-step instructions as screens are implemented.

---

## Getting Started

Open EngageFlow in a browser and log in with your email address and password.

V1 uses Laravel session authentication. It does not include registration, OIDC, SSO, or external identity providers.

---

## Projects

Projects are the top-level workspace in EngageFlow.

In v1, each Project is owned by one user. Only the owner can view or manage that Project.

Project screens will cover:

- Project list
- Project creation
- Project editing
- Project selection
- Project dashboard entry point

---

## Workflow Builder

Each Project has one visual workflow definition.

The Workflow Builder is used to design ordered workflow stages. It is not used to update Task progress.

Workflow Builder screens will cover:

- Adding stages
- Reordering or reviewing stages
- Marking stages Mandatory or Optional
- Saving and reopening the workflow
- Understanding locked workflow state after Tasks exist

---

## Tasks

Tasks are created within a selected Project.

When a Task is created, EngageFlow copies the current Project workflow into TaskWorkflowStep rows. This snapshot lets existing Tasks keep their original steps even if the Project workflow changes later.

Task screens will cover:

- Task list
- Task creation
- Task detail
- Progress timeline
- Step status updates
- Delayed status

---

## Deliverables

Deliverables track expected Task outputs separately from workflow progress.

Deliverable screens will cover:

- Creating Deliverables
- Updating Deliverable details
- Updating Deliverable status
- Viewing overdue Deliverables

---

## Document Links

Document Links store external URLs attached to supported entities.

V1 stores links only. It does not upload files and does not integrate with Google Drive, Figma, GitHub, or external repositories.

---

## Follow-Up Actions

Follow-Up Actions track operational follow-through for a Task.

Follow-Up screens will cover:

- Creating Follow-Up Actions
- Updating status and remarks
- Identifying overdue Follow-Ups

---

## Dashboard

The Project dashboard shows progress and attention-needed work within one selected Project.

Dashboard screens will cover:

- Total Tasks
- Completed Tasks
- In-progress Tasks
- Delayed Tasks
- Task search and filters
- Deliverable and Follow-Up summaries in later MVP slices

---

## History

History will show status changes for TaskWorkflowSteps, Deliverables, and Follow-Up Actions after audit support is implemented.
