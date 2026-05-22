# Design Document: EngageFlow Tracker

## Overview

EngageFlow is an internal web application for tracking team workstreams and progress. The v1 use case is the GovTech engagement team's ministry/agency service onboarding workflow for MyGOV, replacing a manual Excel tracker with a structured, role-based system that provides graphical progress views, workflow stage tracking, follow-up action management, and audit history.

The system is built as a **modular monolith** for v1. Module boundaries are drawn clearly so individual modules can be extracted into separate services later if needed. There are no microservices in v1.

### Key Design Goals

- Replace the Excel tracker with a structured, searchable, visual tool
- Keep the domain model close to how the team already thinks (Agency Owner → Service → Workflow Stages)
- Support Special Projects as a lightweight parallel track
- Provide clear visual progress indicators without over-engineering the UI
- Maintain a full audit trail for stage and follow-up action changes
- Support role-based access with minimal complexity for v1

---

## Architecture

### Style: Modular Monolith

The application is a single deployable unit with clearly separated internal modules. Each module owns its own models, services, and routes. Cross-module communication uses Eloquent relationships and service classes directly — no formal interface contracts are required in v1.

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Layer                            │
│         (HTTP Routes / Inertia Controllers)                 │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                     Application Modules                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Agency Owner │  │   Service    │  │ Workflow / Stage  │  │
│  │  Management  │  │  Tracking    │  │    Tracking       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Follow-Up   │  │   Document   │  │ Special Project  │  │
│  │   Actions    │  │    Links     │  │    Tracking       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Dashboard / │  │  User & Role │  │  Audit / History │  │
│  │ Progress View│  │    Access    │  │    Tracking       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                     Data Layer (Eloquent ORM)               │
│                  Relational Database (MySQL)                 │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Choice | Notes |
|---|---|---|
| **Language** | PHP 8.4 | Minimum version |
| **Framework** | Laravel (latest stable for PHP 8.4) | Eloquent, policies, events, migrations |
| **Frontend** | Inertia.js + React (latest stable) | SPA-like experience without a separate API |
| **Styling** | Tailwind CSS (latest stable) | Utility-first, consistent with MYDS |
| **Design System** | MYDS (Malaysia Digital Services, by GovTech Malaysia) | Primary design system where practical |
| **Icons** | FontAwesome (latest stable) | Consistent icon usage across the UI |
| **Database** | MySQL (preferred) | Avoid database-specific features in v1 |
| **Queue Driver** | Redis | Future-ready; not used in v1 |
| **Auth** | Laravel session-based auth | Internal app; no external OAuth in v1 |
| **Testing** | PestPHP | Unit, feature, and selected property-style tests |

**Version policy**: Use the latest stable release of each package. Avoid experimental, beta, or release-candidate versions.


---

### API-First Modular Monolith

The app is a single Laravel modular monolith in v1. It uses an **API-first** approach: backend business logic lives in service/action classes that can be called by both Inertia controllers (for the web frontend) and JSON API controllers (for future clients such as a mobile app).

**Key principles:**
- The Inertia React web frontend is the primary v1 client.
- Where practical, expose clean JSON endpoints for core data and actions so the backend can support a future mobile client without a rewrite.
- JSON-style endpoints should be considered for: dashboard data, service list/search/filter, workflow stage updates, follow-up actions, document links, and status updates.
- Backend business logic lives in service/action classes. Both Inertia controllers and future API controllers reuse the same service layer.
- Backend modules do NOT call each other through HTTP inside the same application. Use direct service/action calls and Eloquent relationships within the monolith.
- Use events/listeners for decoupled side effects such as audit history.
- Keep request/response shapes clean and explicit so modules can be extracted into separate services later if needed.

**Not in v1:**
- No microservices.
- No API gateway, service discovery, distributed auth, or inter-service networking.
- No mobile app or mobile-specific authentication (unless required).

**Future mobile-readiness:**
- Keep the design compatible with future Laravel Sanctum token authentication for mobile/API access.
- Inertia pages are for the web client. A future mobile client should consume JSON APIs.
- The design allows future mobile usage without forcing mobile scope into v1.

**Future extraction:**
- Module boundaries are clear enough that selected modules could be converted into microservices later if there is a real operational need (scale, ownership, deployment, or integration).
- Future extraction is driven by real need, not by v1 architecture preference.
- Do not design microservices now.


---

## Modular Boundaries

Each module is a Laravel-style bounded context under `app/Modules/{ModuleName}/`, containing its own Models, Services, Policies, Events, Listeners, and HTTP controllers. Normal Laravel conventions apply: Eloquent models, form requests, policies, and service/action classes where useful. No repository layer or strict interface contracts are required in v1.

| Module | Responsibility |
|---|---|
| **AgencyOwnerManagement** | CRUD for Agency Owners |
| **ServiceTracking** | CRUD for Services, target completion, delayed flag |
| **WorkflowStageTracking** | Stage status updates, active stage logic, completion dates |
| **FollowUpActionTracking** | Follow-up action CRUD, overdue detection |
| **DocumentLinkTracking** | Polymorphic document link CRUD |
| **SpecialProjectTracking** | Special project CRUD, status, target date |
| **Dashboard** | Aggregated progress view, summary counts, search, filter |
| **UserRoleAccess** | User management, role assignment, authentication |
| **AuditHistoryTracking** | Recording and querying change history |

**Cross-module rules:**
- Modules may read each other's data through Eloquent relationships and service classes directly.
- Events are used for decoupled side effects: `StageStatusChanged` and `FollowUpActionStatusChanged` events trigger the `AuditHistoryListener`.
- The Dashboard module aggregates data from other modules via their service classes.
- No formal interface contracts are required in v1. Extract and formalize boundaries if/when modules are split out.

---

## Components and Interfaces

### Service Layer Pattern

Each module exposes a service class as its primary interface. Controllers call services; services call Eloquent models and fire events.

```
Controller → Service → Eloquent Model
                    ↘ Event → Listener (audit recording; future: notifications)
```

### Key Service Classes

**AgencyOwnerService**
- `create(name): AgencyOwner`
- `list(): Collection`
- `find(id): AgencyOwner`

**ServiceTrackingService**
- `register(name, agencyOwnerId, targetCompletion?): Service`
- `setTargetCompletion(serviceId, date): Service`
- `list(filters): Collection`
- `find(id): Service`

**WorkflowStageService**
- `updateStatus(serviceId, stageId, status, user): WorkflowStage`
- `getActiveStage(serviceId): WorkflowStage|null`
- `getStagesForService(serviceId): Collection`

**FollowUpActionService**
- `create(parentType, parentId, data): FollowUpAction`
- `update(id, data, user): FollowUpAction`
- `listOverdue(): Collection`

**DocumentLinkService**
- `attach(parentType, parentId, url, label?): DocumentLink`
- `getFor(parentType, parentId): Collection`
- `remove(id): void`

**SpecialProjectService**
- `create(data): SpecialProject`
- `update(id, data): SpecialProject`
- `list(): Collection`

**DashboardService**
- `getSummary(): array`
- `getProgressView(filters): Collection`
- `search(query): Collection`

**AuditHistoryService**
- `record(entityType, entityId, field, previousValue, newValue, user): AuditEntry`
- `getHistoryFor(entityType, entityId): Collection`

### Events and Listeners

| Event | Fired By | Listener | Action |
|---|---|---|---|
| `StageStatusChanged` | WorkflowStageService | AuditHistoryListener | Record stage status change |
| `FollowUpActionStatusChanged` | FollowUpActionService | AuditHistoryListener | Record follow-up status change |

This keeps audit recording decoupled from business logic. Additional listeners (e.g., future notifications) can be added without modifying the service.

### Authorization (Policies)

Laravel Policies are used per entity:

| Policy | Admin | Lead | Member |
|---|---|---|---|
| Manage users/roles | ✓ | — | — |
| Create/update Agency Owner | ✓ | ✓ | ✓ |
| Create/update Service | ✓ | ✓ | ✓ |
| Update Stage Status | ✓ | ✓ | ✓ |
| Create/update Follow-Up Action | ✓ | ✓ | ✓ |
| Create/update Special Project | ✓ | ✓ | ✓ |
| View all data | ✓ | ✓ | ✓ |


---

## Data Models

These are conceptual entities and their relationships. No DDL is included here.

### Entity Overview

```
Agency_Owner
  └── has many → Service
                   └── has one → Workflow (10 fixed stages)
                                   └── WorkflowStage (status, completion date)
                   └── has many → Follow_Up_Action
                   └── has many → Document_Link
                   └── WorkflowStage → has many → Document_Link

Special_Project
  └── has many → Follow_Up_Action
  └── has many → Document_Link

Follow_Up_Action
  └── has many → Document_Link

User
  └── has one → Role (Admin | Lead | Member)

AuditEntry
  └── polymorphic → WorkflowStage | Follow_Up_Action
```

### Entity Descriptions

**Agency_Owner**
- `id`, `name`, timestamps

**Service**
- `id`, `name`, `agency_owner_id` (FK), `target_completion_date` (nullable), timestamps
- Delayed status is computed on read (not stored as a mutable flag in v1)
- One active workflow per service in v1

**WorkflowStage**
- `id`, `service_id` (FK), `stage_order` (1–10), `stage_name` (fixed), `status` (Pending | In_Progress | Completed | KIV | Not_Applicable | Blocked | To_Be_Confirmed), `completed_at` (nullable), timestamps
- 10 rows created automatically when a Service is registered
- Stage names are fixed: Surat Permohonan Onboard, Sesi Libat Urus, Surat Permohonan Integrasi, Kelulusan, Perbincangan / Bengkel Teknikal, Bengkel SAF, Pembangunan, SIT, UAT, Go-Live

**Special_Project**
- `id`, `title`, `status`, `target_date` (nullable), timestamps
- No workflow stages; tracked independently

**Follow_Up_Action**
- `id`, `title`, `due_date`, `status` (Open | In_Progress | Done | Cancelled), `remarks` (nullable), `actionable_type` (polymorphic: Service | Special_Project), `actionable_id`, timestamps
- Overdue: computed on read — `due_date < today` AND `status NOT IN (Done, Cancelled)`

**Document_Link**
- `id`, `url`, `label` (nullable), `linkable_type` (polymorphic: Service | WorkflowStage | Special_Project | Follow_Up_Action), `linkable_id`, timestamps

**User**
- `id`, `name`, `email`, `password` (hashed), `role` (Admin | Lead | Member), timestamps

**AuditEntry**
- `id`, `auditable_type` (WorkflowStage | Follow_Up_Action), `auditable_id`, `field_changed` (e.g., "status"), `previous_value`, `new_value`, `changed_by_user_id` (FK), `changed_at`, timestamps

### Key Relationships

- Agency_Owner → Service: one-to-many
- Service → WorkflowStage: one-to-many (always exactly 10, created on registration)
- Service → Follow_Up_Action: polymorphic one-to-many
- Special_Project → Follow_Up_Action: polymorphic one-to-many
- Service → Document_Link: polymorphic one-to-many
- WorkflowStage → Document_Link: polymorphic one-to-many
- Special_Project → Document_Link: polymorphic one-to-many
- Follow_Up_Action → Document_Link: polymorphic one-to-many
- WorkflowStage → AuditEntry: polymorphic one-to-many
- Follow_Up_Action → AuditEntry: polymorphic one-to-many


---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property reflection notes**: After prework analysis, the following consolidations were applied:
- Requirements 2.2 and 2.3 are combined into Property 1 (stage count, order, and initial status are one invariant).
- Requirements 4.2 and 7.1 both describe the delayed flag — covered by Property 4.
- Requirements 10.1, 10.2, and 10.3 are combined into Property 7 (document link round-trip).
- Requirements 6.1–6.4 are combined into Property 12 (dashboard summary consistency).
- Requirements 11.3 and 11.4 are combined into Property 13 (role-based authorization).
- Requirements 3.1 and 3.2 are combined into Property 2 (stage status update correctness).

---

### Property 1: Service registration initializes exactly 10 stages

*For any* valid service registration, the resulting service SHALL have exactly 10 workflow stages, one for each fixed stage name, in the correct order (1–10), all initialized to Pending status.

**Validates: Requirements 2.2, 2.3**

---

### Property 2: Stage status update is always reflected

*For any* service and any of its 10 stages, updating the stage status to a valid status value SHALL result in that stage reflecting the new status when queried, regardless of the status of other stages.

**Validates: Requirements 3.1, 3.2**

---

### Property 3: Completed stage records completion date

*For any* stage that is updated to Completed status, the stage SHALL have a non-null completion date recorded at the time of the update.

**Validates: Requirements 3.3**

---

### Property 4: Delayed flag correctness

*For any* service with a target completion date, the service SHALL be computed as delayed if and only if the current date exceeds the target completion date AND the Go-Live stage is not Completed.

**Validates: Requirements 4.2, 7.1**

---

### Property 5: Month-only target uses last day of month

*For any* month/year input for target completion, the stored target completion date SHALL be the last calendar day of that month (including correct handling of February in leap and non-leap years).

**Validates: Requirements 4.4**

---

### Property 6: Follow-up action overdue flag correctness

*For any* follow-up action, the action SHALL be computed as overdue if and only if the current date exceeds the due date AND the status is neither Done nor Cancelled.

**Validates: Requirements 9.5**

---

### Property 7: Document link round-trip

*For any* document link attached to a valid parent entity (Service, WorkflowStage, Special_Project, or Follow_Up_Action), querying the links for that parent SHALL return a collection that includes the attached link with its URL and label preserved exactly.

**Validates: Requirements 10.1, 10.2, 10.3**

---

### Property 8: Audit entry recorded on stage status change

*For any* stage status update, an audit entry SHALL be recorded containing the previous status, new status, the date of change, and the user who made the change.

**Validates: Requirements 13.1**

---

### Property 9: Audit entry recorded on follow-up action status change

*For any* follow-up action status update, an audit entry SHALL be recorded containing the previous status, new status, the date of change, and the user who made the change.

**Validates: Requirements 13.2**

---

### Property 10: Search returns only matching services

*For any* search query string, the search results SHALL contain only services whose name or agency owner name contains the query string (case-insensitive), and SHALL NOT contain services that do not match.

**Validates: Requirements 12.1**

---

### Property 11: Filter returns only matching services

*For any* combination of filter criteria (Agency Owner, Stage Status, delayed status), the filtered results SHALL contain only services that satisfy all applied filters, and SHALL NOT contain services that fail any applied filter.

**Validates: Requirements 12.2**

---

### Property 12: Dashboard summary counts are consistent

*For any* set of registered services with varying Go-Live statuses and delayed computations, the dashboard summary SHALL satisfy: `total_services = go_live_count + in_progress_count`, and `delayed_count` SHALL equal the count of services where the delayed condition is true.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

---

### Property 13: Role-based authorization is enforced

*For any* user with role Admin, all user management actions SHALL succeed. *For any* user with role Lead or Member, all service/special project/follow-up action CRUD operations SHALL succeed, and user management actions SHALL be rejected.

**Validates: Requirements 11.3, 11.4**


---

## Error Handling

### Validation Errors
- All input is validated at the service layer (via Laravel Form Requests) before persistence. Invalid inputs — missing required fields, invalid status values, malformed URLs — return structured validation error responses surfaced through Inertia's error handling.
- Stage status values are validated against the fixed enum. Attempts to set an invalid status are rejected with a clear error message.

### Business Rule Violations
- Attempting to register a service without an existing Agency Owner returns a not-found error.
- Attempting to update a stage that does not belong to the given service returns a not-found or authorization error.

### Authorization Errors
- Unauthenticated requests are redirected to the login page (Inertia handles this via the `HandleInertiaRequests` middleware).
- Requests that violate role policies return a 403 Forbidden response.

### Delayed and Overdue Computation
- Delayed and overdue status are computed on read in v1. No stored flag is maintained for these computed values. If query performance becomes an issue as data grows, a scheduled job can be introduced later.

### Database Errors
- Unexpected database errors are caught at the controller layer and return a 500 response with a generic message. Errors are logged for investigation.

---

## Workflow / Status Logic

### Stage Status Transitions

Stages can be updated to any valid status at any time. There is no enforced linear progression. The valid statuses are:

```
Pending → In_Progress → Completed
       ↘ KIV
       ↘ Not_Applicable
       ↘ Blocked
       ↘ To_Be_Confirmed
```

Any stage can be moved to any status regardless of other stages' statuses. This reflects real-world engagement work where stages may be revisited or handled out of order.

**Active Stage**: The stage most recently explicitly set to `In_Progress` by a user is displayed as the current active stage. If multiple stages are `In_Progress`, the one with the highest `stage_order` is considered the active stage for display purposes.

### Delayed Flag Logic

```
is_delayed = (target_completion_date IS NOT NULL)
           AND (target_completion_date < CURRENT_DATE)
           AND (Go-Live stage status != Completed)
```

Computed on read in v1.

### Overdue Follow-Up Logic

```
is_overdue = (due_date < CURRENT_DATE)
           AND (status NOT IN ('Done', 'Cancelled'))
```

Computed on read in v1.

---

## Progress Calculation Approach

### Per-Service Progress

Progress for a service is derived from its 10 workflow stages:

- **Completed stages**: stages with status = `Completed`
- **Not Applicable stages**: stages with status = `Not_Applicable` (excluded from the denominator)
- **Progress percentage**: `(completed_count) / (10 - not_applicable_count) * 100`

This gives a meaningful percentage even when some stages are skipped.

### Dashboard Summary Counts

| Metric | Calculation |
|---|---|
| Total Services | COUNT of all registered Services |
| Go-Live Reached | COUNT of Services where Go-Live stage status = Completed |
| In Progress | COUNT of Services where Go-Live stage status != Completed |
| Delayed | COUNT of Services where is_delayed = true (computed) |

### Visual Progress Indicators

Each stage is rendered with a distinct visual indicator based on its status:

| Status | Visual Treatment |
|---|---|
| Pending | Grey / empty circle |
| In_Progress | Blue / filled circle or pulsing indicator |
| Completed | Green / checkmark |
| KIV | Yellow / pause icon |
| Not_Applicable | Light grey / dash |
| Blocked | Red / blocked icon |
| To_Be_Confirmed | Orange / question mark |

The active stage (In_Progress with highest order) is highlighted prominently.


---

## Delayed / Overdue Logic

### Delayed Services

A service is delayed when:
1. A `target_completion_date` has been set
2. The current date has passed that date
3. The Go-Live stage (stage 10) has not been marked as Completed

The delayed status is surfaced:
- As a visual badge on the service card in the dashboard
- In the summary count ("X delayed")
- As a filterable attribute in the search/filter panel

No nightly job recalculates this in v1. If performance becomes an issue as data grows, a scheduled job can be added later.

### Overdue Follow-Up Actions

A follow-up action is overdue when:
1. A `due_date` has been set
2. The current date has passed that date
3. The status is not `Done` or `Cancelled`

Overdue follow-up actions are:
- Displayed prominently in the dashboard (dedicated section or badge count)
- Visually distinguished from non-overdue actions

---

## Document Link Approach

Document links are stored as plain URLs with an optional label. There is no file upload, no Google Drive API integration, and no folder sync.

### Storage

A polymorphic `document_links` table stores:
- The URL (validated as a well-formed URL)
- An optional label/description
- A reference to the parent entity (Service, WorkflowStage, Special_Project, or Follow_Up_Action) via polymorphic association

### Display

Links are displayed inline alongside their parent entity. Each link renders as a clickable label (or the URL if no label is set) that opens in a new browser tab. FontAwesome's link or external-link icon is used consistently for document link items.

### Constraints

- No file size limits (links only, no uploads)
- No Google Drive API calls
- No folder browsing
- URL format is validated on save; invalid URLs are rejected

---

## History Tracking Approach

### What is Tracked

| Entity | Tracked Changes |
|---|---|
| WorkflowStage | Status changes (previous status → new status) |
| Follow_Up_Action | Status changes (previous status → new status) |

### How it Works

1. When `WorkflowStageService::updateStatus()` is called, it fires a `StageStatusChanged` event.
2. The `AuditHistoryListener` handles the event and writes an `AuditEntry` record.
3. Same pattern for `FollowUpActionService::update()` → `FollowUpActionStatusChanged` → `AuditHistoryListener`.

This keeps audit logic out of the business service and makes it easy to extend (e.g., add more tracked fields later).

### Audit Entry Contents

Each `AuditEntry` records:
- Entity type and ID (polymorphic)
- Field changed (e.g., "status")
- Previous value
- New value
- User who made the change
- Timestamp of the change

### Viewing History

History is viewable per service (showing all stage changes) and per follow-up action. The UI presents history as a chronological list, newest first.


---

## Graphical Progress View Approach

### UI Direction

The visual style is clean, simple, modern, and white-based. The design feel is closer to Airbnb-style clarity: generous spacing, clean cards, soft borders, simple typography, minimal clutter, and clear visual hierarchy. The interface should be calm, professional, and easy to scan.

- Avoid heavy, dense, old-style government portal aesthetics.
- Do not overuse strong colors. Use color mainly for statuses, alerts, badges, and progress indicators.
- The engagement team should understand progress, delay, and follow-up status at a glance.

### Design System: MYDS + Custom Components

**MYDS (Malaysia Digital Services)** is the primary design system. Use MYDS components and design guidance wherever practical — typography, spacing, color tokens, buttons, form elements, and layout primitives.

For EngageFlow-specific UI elements that MYDS does not cover, create reusable React components that align with MYDS styling:
- Workflow timeline / stage progress bar
- Dashboard summary cards (Total, Go-Live, In Progress, Delayed)
- Progress percentage indicator
- Graphical status summary (stage status breakdown)
- Follow-up action panels
- Overdue item badges

Do NOT create a separate custom design system. Extend MYDS with targeted custom components only where needed.

### Icons: FontAwesome

FontAwesome is used consistently across the UI. Use icons purposefully — not decoratively. Key icon usage:

| Context | Icon Usage |
|---|---|
| Workflow stages | Stage-type icons (e.g., envelope, handshake, code, rocket for Go-Live) |
| Status badges | Status-specific icons (check, pause, ban, question, clock) |
| Dashboard cards | Summary icons (list, flag, clock, warning) |
| Document links | External link icon |
| Overdue items | Warning / clock icon |
| Actions (edit, delete) | Pencil, trash icons |

Do not overload the UI with icons. Use them to reinforce meaning, not to fill space.

### Individual Service View

Each service is displayed with a horizontal workflow timeline showing all 10 stages. Each stage node is color-coded and icon-coded by status. The active stage is visually prominent (e.g., larger node, highlighted border).

```
[✓ Stage 1] → [✓ Stage 2] → [▶ Stage 3] → [○ Stage 4] → ... → [○ Go-Live]
  Completed     Completed    In_Progress     Pending                Pending
```

The target completion date and delayed badge (if applicable) are shown alongside the timeline.

### Dashboard / Summary View

The dashboard shows:
- Summary cards: Total Services, Go-Live Reached, In Progress, Delayed
- A list/table of all services with their current active stage, progress percentage, delayed badge, and overdue follow-up count
- Special Projects listed in a dedicated section with their status and overdue follow-up count
- A prominent section for overdue follow-up actions across all entities

### Search and Filter

- Search bar: filters by service name or agency owner name (on-submit or live)
- Filter panel: filter by Agency Owner (dropdown), Stage Status (multi-select), Delayed (toggle)
- Filtered results update the service list in the progress view

### Special Projects in the View

Special Projects appear in a dedicated section of the dashboard. They show title, status, target date, and overdue follow-up count. They do not show a workflow timeline.

---

## Queue / Job Usage

Queues are **future-ready but not implemented in v1**. All delayed and overdue status computations happen on read in v1.

Redis is included in Docker Compose only if a queued job is actually implemented. For v1, Redis is not required.

| Job | Status | Notes |
|---|---|---|
| `RecalculateDelayedFlags` | Not in v1 | Computed on read; add later if performance requires it |
| `SendOverdueNotifications` | Not in v1 | Email/WhatsApp alerts — future feature |
| `GenerateDashboardReport` | Not in v1 | PDF/Excel export — future feature |
| `ImportServicesFromExcel` | Not in v1 | Bulk import from existing tracker — future feature |

When queue jobs are introduced, the Redis driver is already configured and ready.


---

## Testing Strategy

### Approach

PestPHP is used for all tests. The primary testing approach is unit and feature tests. Property-style tests are used selectively for critical business rules where input variation meaningfully increases confidence.

**Testing library**: PestPHP (built on PHPUnit). All tests — unit, feature, and property-style — use PestPHP.

### Unit and Feature Tests

Each service class has unit tests covering:
- Happy path for each operation
- Validation rejection for invalid inputs
- Business rule enforcement (delayed flag, overdue flag, progress calculation)
- Authorization policy enforcement

Feature tests (HTTP-level via Inertia) cover:
- Full request/response cycle for key endpoints
- Role-based access (Admin vs Lead vs Member)
- Search and filter correctness
- Audit history recording
- Document link handling
- Workflow stage updates

### Property-Style Tests

Property-style tests are used for the following critical business rules only. These are implemented using PestPHP's dataset and randomization capabilities, with a minimum of **100 iterations** per test.

Each property test is tagged with a comment:
`// Feature: engageflow-tracker, Property {N}: {property_text}`

| Property | Test Focus |
|---|---|
| P4: Delayed flag correctness | Random target dates (past/future) × random Go-Live statuses |
| P5: Month-only target uses last day | Random month/year combinations including Feb in leap/non-leap years |
| P6: Follow-up overdue flag correctness | Random due dates × random statuses |
| P12: Dashboard summary counts are consistent | Random sets of services with varied Go-Live and delayed states |

Properties P1–P3, P7–P11, P13 are covered by unit and feature tests with representative examples and edge cases. Full property-style randomization is reserved for the four rules above where input variation is most likely to reveal edge cases.

### Test Organization

```
tests/
  Unit/
    AgencyOwnerServiceTest.php
    ServiceTrackingServiceTest.php
    WorkflowStageServiceTest.php
    FollowUpActionServiceTest.php
    DocumentLinkServiceTest.php
    SpecialProjectServiceTest.php
    AuditHistoryServiceTest.php
    DashboardServiceTest.php
  Feature/
    ServiceWorkflowTest.php
    DashboardTest.php
    AuthorizationTest.php
    SearchFilterTest.php
    DocumentLinkTest.php
    AuditHistoryTest.php
  Property/
    DelayedFlagPropertyTest.php
    MonthEndTargetPropertyTest.php
    FollowUpOverduePropertyTest.php
    DashboardSummaryPropertyTest.php
```


---

## Local Development / Container Approach

The project is **container-first**. The host machine only needs Docker Desktop, Git, and an editor (e.g., VS Code). PHP, Composer, Node, npm, MySQL, and Redis do not need to be installed on the host machine.

All app runtime tools run inside Docker containers. Composer commands run inside the `app` container. Node/npm build commands run inside the `app` container or a dedicated `node` container. The database runs inside Docker Compose.

### Services in Docker Compose

**v1 Docker Compose includes only:**

| Service | Image | Purpose |
|---|---|---|
| `app` | Custom PHP 8.4 image (PHP-FPM + Nginx) | Laravel application server |
| `node` | Node LTS image or build support inside `app` | Frontend asset compilation |
| `db` | `mysql:8` | MySQL database |

**Notes:**
- Redis is NOT included in v1. Add Redis only when a real queued job is implemented.
- Mailpit is NOT included until notification features are introduced.

### Setup Flow

```
1. Clone the repository
2. cp .env.example .env
3. docker compose up -d
4. docker compose exec app composer install
5. docker compose exec app php artisan key:generate
6. docker compose exec app php artisan migrate --seed
7. docker compose exec app npm install && npm run build
   (or: docker compose run --rm node npm install && npm run build)
8. Open http://localhost:8000
```

### Seeder Strategy

Database seeders provide:
- A default Admin user
- Sample Agency Owners and Services with varied stage statuses
- Sample Special Projects and Follow-Up Actions
- Sample Document Links

This allows developers to immediately explore the dashboard without manual data entry.

### Blade / Inertia Guardrail

The application uses **Laravel + Inertia.js + React** consistently for all screens. Blade is used only where Laravel/Inertia requires it: the single root Inertia view at `resources/views/app.blade.php`.

- Do NOT build application screens using Blade.
- Do NOT create duplicate Blade pages for screens implemented in React/Inertia.
- Do NOT leave unused scaffolded Blade files, layout files, or Blade components in the codebase.
- Authentication screens also use the Inertia React stack — not mixed Blade scaffolding.
- If any starter kit generates unused Blade files, remove them during setup.
- No mixed Blade/React UI.

Application pages live under:
- `resources/js/Pages` — Inertia page components
- `resources/js/Components` — reusable React components
- `resources/js/Layouts` — layout components

### Development Conventions

- Feature branches off `main`; pull requests required to merge
- `.env.example` kept up to date with all required environment variables
- `README.md` documents the container-first setup clearly
- Migrations are never edited after merging; new migrations are created for schema changes

---

## CI Approach

CI runs on every pull request and on merge to `main`.

### CI Pipeline (GitHub Actions)

```
┌─────────────────────────────────────────────────────────┐
│                    CI Pipeline                          │
│                                                         │
│  1. Checkout code                                       │
│  2. Set up PHP 8.4 + Composer cache                     │
│  3. Install dependencies (composer install)             │
│  4. Copy .env.ci → .env                                 │
│  5. Generate app key                                    │
│  6. Start MySQL service (GitHub Actions service)        │
│  7. Run migrations                                      │
│  8. Run full test suite (php artisan test)              │
│     ├── Unit tests                                      │
│     ├── Feature tests                                   │
│     └── Property-style tests (if present)               │
│  9. Run static analysis (PHPStan — level 5)             │
│  10. Run code style check (Laravel Pint)                │
└─────────────────────────────────────────────────────────┘
```

### CI Rules

- PRs cannot be merged if any CI check fails.
- PHPStan level 5 is the starting point — practical for early development. Level can be raised as the codebase matures.
- Laravel Pint enforces code style automatically.
- CI runs without requiring any project runtimes installed on the developer's laptop.
- Property-style tests run if present. Iteration count is practical and configurable, not fixed at 100.

### Branch Strategy

- `main`: production-ready code
- `feature/{name}`: feature development
- `fix/{name}`: bug fixes
- PRs require at least one reviewer approval before merge

---

## Documentation

Documentation is a first-class deliverable, not an afterthought. The project must include clear documentation so a developer who is learning the project can understand the codebase, structure, setup, and workflow.

### Technical Documentation

The following documentation files must be created and maintained under `docs/`:

| File | Contents |
|---|---|
| `docs/architecture.md` | Architecture overview: Laravel, Inertia, React, modules, service/action classes, policies, events/listeners, Eloquent models |
| `docs/setup.md` | Container-first setup guide + manual setup guide explaining each command and what it does |
| `docs/project-structure.md` | Project structure explanation: directory layout, module structure, frontend structure |
| `docs/workflow-status.md` | Workflow/status logic, progress calculation, delayed logic, overdue logic, active stage selection |
| `docs/testing.md` | How to run unit tests, feature tests, and selected property-style tests |
| `docs/ci.md` | GitHub Actions CI checks explained |
| `docs/user-guide.md` | User guide for engagement officers (see User Documentation below) |
| `docs/troubleshooting.md` | Common issues: Docker, Composer, npm, migration, and permission problems |

`README.md` must link to all documentation files above and include a project overview and quick start.

### Frontend Documentation

`docs/project-structure.md` must include a frontend structure section covering:
- `resources/js/Pages` — Inertia page components
- `resources/js/Components` — reusable React components
- `resources/js/Layouts` — layout components
- MYDS usage guidance
- Tailwind CSS usage guidance
- FontAwesome usage guidance

### User Documentation

`docs/user-guide.md` must cover:
- How to register an agency owner
- How to register a service
- How to update workflow stage status
- How to read the graphical progress view
- How to set target completion
- How to identify delayed services
- How to create follow-up actions
- How to identify overdue follow-up actions
- How to add document links
- How to use search and filters
- How to view special projects
- How to view history/audit updates

### Code Documentation

- Important business logic should include clear comments where helpful.
- Avoid noisy comments that merely repeat the code.
- Complex logic — progress calculation, delayed status, overdue follow-up logic, active stage selection, audit recording — should be documented inline.
- Public service/action methods should have concise PHPDoc when it improves readability.
- React components that implement non-obvious UI behavior should include short explanatory comments.

---

## GitHub Project Management

GitHub is used for both source control and project management.

### Issues

Use GitHub Issues to track all work:
- Features
- Bugs
- Documentation tasks
- Test tasks
- CI tasks
- Setup tasks
- Refactors
- Technical improvements

Each implementation task in `tasks.md` should be suitable to become a GitHub Issue. Tasks should be small, reviewable, and linked to requirements where possible.

### Labels

Use clear labels to categorize issues:

| Label | Usage |
|---|---|
| `feature` | New functionality |
| `bug` | Something broken |
| `documentation` | Docs tasks |
| `test` | Test tasks |
| `refactor` | Code cleanup |
| `ci` | CI/CD tasks |
| `setup` | Project setup tasks |
| `frontend` | Frontend work |
| `backend` | Backend work |
| `design` | UI/UX design tasks |

### Milestones

Use GitHub Milestones to group work by delivery phase. Example milestones:
- `v1 Foundation` — project setup, Docker, CI, auth, base structure
- `v1 Core Tracking` — agency owners, services, workflow stages
- `v1 Dashboard` — progress view, summary, search, filter
- `v1 Follow-Up & Documents` — follow-up actions, document links
- `v1 Special Projects` — special project tracking
- `v1 Audit & History` — audit trail
- `v1 Documentation` — all docs tasks
- `v1 Polish` — testing, cleanup, final review

### Project Board

Use GitHub Projects to track issue status:
- **Backlog** — not yet started
- **Ready** — ready to pick up
- **In Progress** — being worked on
- **Review** — in pull request review
- **Done** — merged and closed

### Pull Requests

- Each PR should reference the related GitHub Issue.
- PR descriptions should explain what was changed and why.
- PRs require at least one reviewer approval before merging.
- Do not commit directly to `main`.

### tasks.md Structure

When tasks.md is created:
- Structure tasks so they can be converted into GitHub Issues.
- Include documentation tasks as first-class tasks, not as an afterthought.
- Include testing and CI tasks as first-class tasks.
- Keep tasks small enough for one pull request each where practical.
