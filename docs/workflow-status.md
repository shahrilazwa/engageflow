# Workflow Status

This document describes the v1 workflow and status rules. It is a skeleton and should be expanded as workflow and Task features are implemented.

---

## Project Workflow

Each Project has one ProjectWorkflow. The workflow definition is designed visually in the Workflow Builder and stored as PostgreSQL JSONB.

The workflow is not a fixed global list. Each Project owns its own ordered stage list.

---

## Workflow Stage Definition

Each workflow stage definition contains:

- Stable node ID
- Label
- Mandatory or Optional flag
- Order
- Canvas position
- Edges/connectors
- Viewport metadata

The Project workflow definition is design-time data. It does not directly store Task progress.

---

## Task Workflow Snapshot

When a Task is created, the current Project workflow is copied into relational `task_workflow_steps` rows.

The Task snapshot preserves:

- Workflow node ID
- Label snapshot
- Mandatory or Optional snapshot
- Step order
- Initial status

Later workflow design changes do not rewrite existing Task snapshots in v1.

---

## Step Statuses

TaskWorkflowStep status values are:

| Status | Meaning |
|---|---|
| `Pending` | Work has not started |
| `In_Progress` | Work is currently active |
| `Completed` | Work is done |
| `KIV` | Kept in view or deferred |
| `Not_Applicable` | This step does not apply to the Task |
| `Blocked` | Cannot proceed because of a blocker |
| `To_Be_Confirmed` | Awaiting confirmation |

Status updates are not performed inside WorkflowCanvas.

---

## Active Step

The active step is calculated from the TaskWorkflowStep snapshot according to the requirements. The exact helper and edge cases should be documented when Task progress is implemented.

---

## Progress Percentage

Progress percentage uses mandatory steps only.

Completed and Not_Applicable mandatory steps count as complete. Optional steps are displayed but do not change the mandatory progress percentage.

---

## Delayed Task

A Task is delayed when its target completion date has passed and the final mandatory step is not Completed or Not_Applicable.

Delayed status is calculated within the selected Project scope.

---

## Follow-Up And Deliverable Overdue Rules

Follow-Up Actions and Deliverables have their own overdue rules. Those rules are documented in the user guide and deliverables documentation as their MVP slices are implemented.
