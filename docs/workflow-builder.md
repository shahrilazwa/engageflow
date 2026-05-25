# Workflow Builder

This document will describe the visual Workflow Builder once MVP 1 is implemented.

---

## Scope

The Workflow Builder is a design-time tool for a selected Project workflow. It is not the Task status update screen.

V1 supports:

- Ordered stage nodes
- Mandatory or Optional stage flag
- React Flow canvas positioning
- Edges/connectors between stages
- Save and reload of the Project workflow definition
- Server-side workflow validation

V1 does not support workflow automation, workflow migration for existing Tasks, collaboration, or cross-Project workflow templates.

---

## Main Components

Expected frontend components:

- `WorkflowCanvas`
- `WorkflowToolbar`
- `WorkflowStepInspector`
- `WorkflowStepList`
- Workflow definition mapper helpers
- Locked-builder state helpers

Components should be small, typed, and composed lego-style.

---

## Persistence

Project workflow definitions are stored in PostgreSQL JSONB. Routine Task progress and dashboard counts use relational TaskWorkflowStep snapshots, not raw workflow JSON parsing.

---

## Review Notes

Each Workflow Builder page task must include a UI/design review checkpoint covering canvas clarity, controls, empty states, validation states, responsive behavior, and MYDS alignment.
