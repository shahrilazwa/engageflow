# Workflow and Status Logic

> **Status:** Skeleton — detailed content will be expanded as implementation progresses.

This document explains the engagement workflow, stage statuses, progress calculation, delayed flag logic, and overdue follow-up logic used in EngageFlow.

---

## Engagement Workflow

Each agency-owned service goes through a fixed 10-stage workflow:

| Order | Stage Name |
|---|---|
| 1 | Surat Permohonan Onboard |
| 2 | Sesi Libat Urus |
| 3 | Surat Permohonan Integrasi |
| 4 | Kelulusan |
| 5 | Perbincangan / Bengkel Teknikal |
| 6 | Bengkel SAF |
| 7 | Pembangunan |
| 8 | SIT |
| 9 | UAT |
| 10 | Go-Live |

When a service is registered, all 10 stages are created automatically with status `Pending`.

---

## Stage Statuses

Each stage can be set to one of these statuses:

| Status | Meaning |
|---|---|
| `Pending` | Not yet started |
| `In_Progress` | Currently being worked on |
| `Completed` | Done |
| `KIV` | Kept in view — deferred |
| `Not_Applicable` | This stage does not apply to this service |
| `Blocked` | Cannot proceed — blocked by an external dependency |
| `To_Be_Confirmed` | Awaiting confirmation |

Stages can be updated in any order. There is no enforced linear progression.

---

## Active Stage

The **active stage** is the `In_Progress` stage with the highest `stage_order`. This is the stage displayed prominently on the service detail view.

If multiple stages are `In_Progress`, the one with the highest order number is considered active.

---

## Progress Percentage

Progress is calculated from the 10 workflow stages:

```
progress % = completed_count / (10 - not_applicable_count) * 100
```

- `Not_Applicable` stages are excluded from the denominator.
- This gives a meaningful percentage even when some stages are skipped.

---

## Delayed Flag

A service is flagged as **delayed** when all three conditions are true:

```
is_delayed =
    target_completion_date IS NOT NULL
    AND target_completion_date < CURRENT_DATE
    AND Go-Live stage status != Completed
```

The delayed flag is computed on read in v1. No stored flag is maintained.

If only the target month is known, use the last day of that month as the target date.

---

## Overdue Follow-Up Actions

A follow-up action is flagged as **overdue** when:

```
is_overdue =
    due_date < CURRENT_DATE
    AND status NOT IN ('Done', 'Cancelled')
```

Overdue status is computed on read in v1.

---

## Follow-Up Action Statuses

| Status | Meaning |
|---|---|
| `Open` | Not yet started |
| `In_Progress` | Being worked on |
| `Done` | Completed |
| `Cancelled` | No longer needed |

---

## Special Project Statuses

Special projects do not use the 10-stage workflow. They use a simple status:

| Status | Meaning |
|---|---|
| `Open` | Active, not yet completed |
| `In_Progress` | Being worked on |
| `Completed` | Done |
| `KIV` | Kept in view — deferred |
| `Cancelled` | No longer active |

---

> This document will be expanded with code examples and edge case handling during implementation.
