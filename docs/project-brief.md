# Project Brief

This document summarizes the current EngageFlow product direction.

---

## Product Summary

EngageFlow helps a user define a Project workflow visually, create Tasks from that workflow, and track Task progress, deliverables, document links, follow-ups, and history within the selected Project.

The v1 product is:

- Project-first
- Workflow-first
- Visual-builder-first
- Single-user-first

---

## Core Model

```text
User
`-- Project
    |-- ProjectWorkflow
    `-- Task
        |-- TaskWorkflowStep
        |-- TaskDeliverable
        |-- DocumentLink
        |-- FollowUpAction
        `-- AuditEntry
```

In v1, Project access is owner-only. Collaboration and membership are future scope.

---

## Workflow Builder

Each Project has one visual workflow definition. The user builds ordered workflow stages using React Flow.

Workflow definitions are stored as PostgreSQL JSONB and include labels, mandatory flags, order, positions, edges, and viewport metadata.

The Workflow Builder is design-time only. It is not used to update Task step status.

---

## Task Progress

When a Task is created, EngageFlow copies the current Project workflow into relational TaskWorkflowStep rows.

This snapshot allows existing Tasks to retain their workflow shape even if the Project workflow changes later.

Progress uses mandatory steps only. Optional steps are visible but do not change the mandatory progress percentage.

---

## Dashboard

The Project dashboard shows progress within one selected Project.

V1 dashboard areas include:

- Total Tasks
- Completed Tasks
- In-progress Tasks
- Delayed Tasks
- Task list with active step and progress
- Search and basic filters

Deliverable and Follow-Up summaries are added in later MVP slices.

---

## Deliverables, Links, Follow-Ups, And History

Deliverables track expected Task outputs separately from workflow progress.

Document Links store external URLs only. V1 does not upload files or integrate with external repositories.

Follow-Up Actions track operational follow-through and overdue items.

Audit History records status changes for TaskWorkflowSteps, TaskDeliverables, and FollowUpActions.

---

## Explicit V1 Non-Goals

V1 does not include:

- Collaboration
- OIDC or SSO
- Spatie Permission
- Workflow automation
- File uploads
- External repository integrations
- Public API
- Mobile app
- Microservices
- Cross-Project dashboard
