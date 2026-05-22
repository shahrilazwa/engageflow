# Architecture

> **Status:** Skeleton — detailed content will be expanded as implementation progresses.

This document describes the overall architecture of EngageFlow.

---

## Overview

EngageFlow is built as a **modular monolith** using Laravel. All modules are deployed as a single unit, but each module has clear boundaries so individual modules can be extracted into separate services later if needed.

There are no microservices in v1.

---

## Technology Stack

| Layer | Choice |
|---|---|
| Language | PHP 8.4 |
| Framework | Laravel (latest stable) |
| Frontend | Inertia.js + React |
| Styling | Tailwind CSS |
| Design System | MYDS (Malaysia Digital Services) |
| Icons | FontAwesome |
| Database | MySQL 8 |
| Testing | PestPHP |
| CI | GitHub Actions |
| Local Dev | Docker Compose (container-first) |

---

## Modular Structure

The application is organised into modules under `app/Modules/`. Each module owns its own models, services, policies, events, listeners, and HTTP controllers.

| Module | Responsibility |
|---|---|
| AgencyOwnerManagement | CRUD for agency owners |
| ServiceTracking | CRUD for services, target completion, delayed flag |
| WorkflowStageTracking | Stage status updates, active stage logic |
| FollowUpActionTracking | Follow-up action CRUD, overdue detection |
| DocumentLinkTracking | Polymorphic document link CRUD |
| SpecialProjectTracking | Special project CRUD |
| Dashboard | Aggregated progress view, summary counts, search, filter |
| UserRoleAccess | User management, role assignment, authentication |
| AuditHistoryTracking | Recording and querying change history |

> Detailed module documentation is in [docs/project-structure.md](project-structure.md).

---

## Service Layer Pattern

Controllers call service classes. Service classes call Eloquent models and fire events.

```
Controller → Service → Eloquent Model
                    ↘ Event → Listener (audit, future notifications)
```

---

## API-First Approach

The backend uses an API-first approach. Business logic lives in service/action classes that can be called by both Inertia controllers (web frontend) and JSON API controllers (future mobile client).

Backend modules do **not** call each other through HTTP inside the monolith. Use direct service/action calls and Eloquent relationships.

---

## Events and Listeners

Events are used for decoupled side effects such as audit history recording.

| Event | Fired By | Listener | Action |
|---|---|---|---|
| `StageStatusChanged` | WorkflowStageService | AuditHistoryListener | Record stage status change |
| `FollowUpActionStatusChanged` | FollowUpActionService | AuditHistoryListener | Record follow-up status change |

---

## Future Extraction

Module boundaries are clear enough that selected modules could be converted into microservices later if there is a real operational need. Future extraction should be driven by scale, ownership, or deployment needs — not by v1 architecture preference.

---

> This document will be expanded with diagrams and detailed module descriptions during implementation.
