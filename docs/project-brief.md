# EngageFlow Project Brief

## What is EngageFlow?

EngageFlow is an internal web application for the GovTech Malaysia engagement team. It replaces a manual Excel tracker with a structured, role-based system that provides graphical progress views, workflow stage tracking, follow-up action management, and audit history.

The goal is to give the engagement team a clear, visual picture of where each ministry/agency-owned service is in the onboarding process — at a glance, without digging through spreadsheets.

---

## Business Context

GovTech engages ministries and agencies to bring their digital services into MyGOV. These services are not originally MyGOV features — they are owned by the ministry or agency.

**Example:** `Pembayaran Saman` is a service in the PDRM ecosystem. It is not originally a MyGOV feature. GovTech wants to make it available through MyGOV by engaging PDRM through the onboarding workflow.

---

## The Business Problem

The engagement team currently tracks all of this manually in Excel. It is difficult to quickly know:

- which services are being tracked;
- which ministry or agency owns each service;
- which workflow stage each service is at;
- what is pending, delayed, or needs follow-up;
- which services have reached Go-Live;
- the overall engagement progress across all services.

EngageFlow solves this by providing a structured, searchable, visual tracker.

---

## Tracker Structure

The tracker is organised around this hierarchy:

```
Ministry / Agency Owner
  └── Agency-Owned Service
        └── Engagement / Integration Workflow (10 stages)
```

One ministry or agency can have many services. Each service has its own workflow progress. Special projects that do not fit the standard hierarchy are tracked separately.

---

## 10-Stage Engagement Workflow

Each agency-owned service goes through a fixed 10-stage workflow:

| Stage | Name |
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

Stages can be updated in any order — real engagement work does not always happen sequentially.

Each stage can be set to one of these statuses: **Pending**, **In Progress**, **Completed**, **KIV**, **Not Applicable**, **Blocked**, **To Be Confirmed**.

---

## Graphical Progress and Status Tracking

EngageFlow presents engagement progress visually. The engagement team can quickly see:

- the current workflow stage of each service;
- which stages are completed, in progress, or pending;
- which services are delayed or at risk;
- which services have reached Go-Live;
- overall progress across all tracked services.

Visual elements include a horizontal workflow timeline per service, status badges, summary cards, and a dashboard with counts and filters.

---

## Target Completion and Delayed Tracking

Each service can have a target completion date (the expected Go-Live date). If only the month is known, the last day of that month is used.

A service is flagged as **delayed** when its target completion date has passed and it has not reached Go-Live. Delayed services are highlighted on the dashboard and can be filtered.

---

## Follow-Up Actions

Follow-up actions can be attached to any service or special project. Each follow-up action has a title, due date, status, and remarks.

A follow-up action is flagged as **overdue** when its due date has passed and its status is not Done or Cancelled. Overdue actions are displayed prominently on the dashboard.

Follow-up action statuses: **Open**, **In Progress**, **Done**, **Cancelled**.

---

## Document Links

Document links are external URLs (typically Google Drive links) attached to a service, workflow stage, special project, or follow-up action. The system stores the URL and an optional label — no files are uploaded or synced.

---

## Special Projects

Special projects are tracked items that do not follow the standard agency owner → service hierarchy. In v1, special projects are tracked with a title, status, target date, follow-up actions, and document links. They do not use the 10-stage workflow.

Special project statuses: **Open**, **In Progress**, **Completed**, **KIV**, **Cancelled**.

---

## Roles

| Role | Access |
|---|---|
| Admin | Manage users and roles, plus all below |
| Engagement Lead | Create and update all tracked entities |
| Engagement Officer | Create and update all tracked entities |

---

## v1 Scope Exclusions

The following are explicitly out of scope for v1:

- Email, WhatsApp, or push notifications
- Google Drive API integration, file upload, or folder sync
- Excel import
- Mobile application
- Microservices or distributed architecture
- Re-engagement workflows (each service has one active workflow in v1)
- Viewer-only role (can be added later)

---

## Further Reading

- [docs/architecture.md](architecture.md) — system architecture and module structure
- [docs/setup.md](setup.md) — local development setup
- [docs/workflow-status.md](workflow-status.md) — detailed workflow and status logic
- [docs/user-guide.md](user-guide.md) — user guide for engagement officers
