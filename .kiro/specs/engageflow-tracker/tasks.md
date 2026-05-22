# Implementation Plan: EngageFlow Tracker

## Overview

This plan breaks the EngageFlow Tracker feature into small, reviewable tasks grouped into 11 milestones. Each task is sized to map to one GitHub Issue and one pull request. Tasks are ordered by dependency within each milestone. Testing, documentation, and CI tasks are first-class items — not afterthoughts.

**Stack:** PHP 8.4, Laravel (latest stable), Inertia.js + React, Tailwind CSS, MYDS, FontAwesome, MySQL, PestPHP, GitHub Actions CI, Docker Compose (app + node + db).

---

## Tasks

---

## Milestone 1 — v1 Foundation

---

- [ ] 1. Initialise Laravel project with Docker Compose
  - Milestone: v1 Foundation
  - Labels: setup, backend, ci
  - Depends on: none
  - Description: Create a new Laravel project (latest stable for PHP 8.4) and configure a Docker Compose environment with three services: `app` (PHP 8.4 FPM + Nginx), `node` (Node LTS), and `db` (MySQL 8). No Redis, no Mailpit. The host machine should only need Docker Desktop and Git.
  - Linked requirement/design: Design — Local Development / Container Approach
  - Acceptance checklist:
    - [ ] `docker-compose.yml` defines `app`, `node`, and `db` services only
    - [ ] `app` service uses a custom `Dockerfile` based on PHP 8.4-FPM with Nginx
    - [ ] `db` service uses `mysql:8` image with a named volume for persistence
    - [ ] `node` service uses Node LTS image for frontend asset compilation
    - [ ] `.env.example` contains all required environment variables (DB, APP_KEY, APP_URL)
    - [ ] `docker compose up -d` starts all services without errors
    - [ ] `docker compose exec app php artisan --version` returns the Laravel version
    - [ ] Application is reachable at `http://localhost:8000`
  - Test expectation: No automated tests for this task. Manual smoke test: `docker compose up -d` and verify `http://localhost:8000` returns the default Laravel welcome page.
  - Documentation expectation: None yet — covered by Task 28 (docs/setup.md).

---

- [ ] 2. Configure GitHub Actions CI pipeline
  - Milestone: v1 Foundation
  - Labels: ci, setup
  - Depends on: Task 1
  - Description: Create a GitHub Actions workflow that runs on every pull request and on push to `main`. The pipeline must install PHP 8.4 dependencies, run migrations against a MySQL service container, execute the full PestPHP test suite, run PHPStan at level 5, and check code style with Laravel Pint.
  - Linked requirement/design: Design — CI Approach
  - Acceptance checklist:
    - [ ] `.github/workflows/ci.yml` exists and triggers on `pull_request` and `push` to `main`
    - [ ] Workflow sets up PHP 8.4 with Composer cache
    - [ ] Workflow uses a GitHub Actions MySQL service container
    - [ ] `.env.ci` is committed and used by the workflow for database credentials
    - [ ] `composer install` step runs successfully
    - [ ] `php artisan migrate` step runs successfully against the CI MySQL service
    - [ ] `php artisan test` step runs and passes (even with zero tests initially)
    - [ ] PHPStan level 5 step runs (`vendor/bin/phpstan analyse`)
    - [ ] Laravel Pint step runs (`vendor/bin/pint --test`)
    - [ ] All CI checks must pass before a PR can be merged (branch protection rule documented)
  - Test expectation: No application tests for this task. The CI pipeline itself is the deliverable. Verify by opening a test PR and confirming all checks pass.
  - Documentation expectation: None yet — covered by Task 29 (docs/ci.md).

---

- [ ] 3. Set up GitHub project management (labels, milestones, project board, templates)
  - Milestone: v1 Foundation
  - Labels: setup, ci
  - Depends on: Task 1
  - Description: Configure GitHub project management infrastructure for the repository. Create issue labels, milestones, a project board, an issue template, and a pull request template. Document the GitHub workflow in README.md. This task has no code deliverable — it is a project setup task.
  - Linked requirement/design: Design — GitHub Project Management
  - Acceptance checklist:
    - [ ] GitHub issue labels created: `feature`, `bug`, `documentation`, `test`, `refactor`, `ci`, `setup`, `frontend`, `backend`, `design`
    - [ ] GitHub Milestones created: v1 Foundation, v1 Core Tracking, v1 Workflow Tracking, v1 Dashboard and Graphical Progress, v1 Follow-Up and Document Links, v1 Special Projects, v1 Audit and History, v1 Search and Filter, v1 Documentation, v1 Testing and Quality, v1 Polish and Review
    - [ ] GitHub Project board created with columns: Backlog, Ready, In Progress, Review, Done
    - [ ] `.github/ISSUE_TEMPLATE/feature.md` exists with a standard feature issue template
    - [ ] `.github/pull_request_template.md` exists with: summary, linked issue reference, checklist
    - [ ] Branch protection rule for `main` is documented in README.md (no direct commits, PR required, CI must pass)
    - [ ] README.md includes a "GitHub Workflow" section explaining: feature branches, pull requests, issue references, no direct commits to main
  - Test expectation: No automated tests. Manual verification: create a test issue and confirm labels and milestones are available.
  - Documentation expectation: README.md GitHub Workflow section is the documentation deliverable.

---

- [ ] 4. Create documentation skeleton (all docs/ files)
  - Milestone: v1 Foundation
  - Labels: documentation, setup
  - Depends on: Task 1
  - Description: Create all required documentation files under `docs/` as early skeletons. Files may be partially filled at this stage — the goal is to establish the structure so documentation can be filled in incrementally. Later documentation tasks (in Milestone 9) will complete the content.
  - Linked requirement/design: Design — Documentation
  - Acceptance checklist:
    - [ ] `docs/architecture.md` exists with section headings (content to be filled in later)
    - [ ] `docs/setup.md` exists with section headings and basic Docker Compose quick start steps
    - [ ] `docs/project-structure.md` exists with section headings
    - [ ] `docs/workflow-status.md` exists with section headings
    - [ ] `docs/testing.md` exists with section headings
    - [ ] `docs/ci.md` exists with section headings
    - [ ] `docs/user-guide.md` exists with section headings
    - [ ] `docs/troubleshooting.md` exists with section headings
    - [ ] `README.md` links to all eight `docs/` files
  - Test expectation: No automated tests. Manual verification: all files exist and README links are valid.
  - Documentation expectation: The skeleton files themselves are the deliverable.

---

- [ ] 5. Install and configure frontend toolchain (Inertia + React + Tailwind + MYDS + FontAwesome)
  - Milestone: v1 Foundation
  - Labels: setup, frontend
  - Depends on: Task 1
  - Description: Install and configure Inertia.js (server-side Laravel adapter + client-side React adapter), React, Tailwind CSS, MYDS, and FontAwesome. Set up Vite as the asset bundler. Create the single root Blade view at `resources/views/app.blade.php`. Remove any unused Blade scaffolding files generated by starter kits.
  - Linked requirement/design: Design — Technology Stack; Design — Blade / Inertia Guardrail
  - Acceptance checklist:
    - [ ] `inertiajs/inertia-laravel` and `@inertiajs/react` are installed
    - [ ] React and ReactDOM are installed
    - [ ] Tailwind CSS is configured with `tailwind.config.js` and included in the Vite build
    - [ ] MYDS package is installed and importable in React components
    - [ ] FontAwesome (free tier) is installed and importable
    - [ ] `resources/views/app.blade.php` is the only Blade view (root Inertia view)
    - [ ] No unused Blade layout files, auth views, or scaffolded Blade components remain
    - [ ] `npm run build` completes without errors inside the `node` container
    - [ ] A minimal Inertia React page renders at `http://localhost:8000`
    - [ ] `resources/js/Pages`, `resources/js/Components`, and `resources/js/Layouts` directories exist
  - Test expectation: No automated tests for this task. Manual smoke test: verify the Inertia React page renders in the browser.
  - Documentation expectation: None yet — frontend structure covered by Task 30 (docs/project-structure.md).

---

- [ ] 6. Implement authentication (login, logout, session-based)
  - Milestone: v1 Foundation
  - Labels: feature, backend, frontend
  - Depends on: Task 5
  - Description: Implement session-based authentication using Laravel's built-in auth. Provide a login page (Inertia React), logout action, and middleware that redirects unauthenticated requests to the login page. No registration screen is needed — users are created by Admin via user management.
  - Linked requirement/design: Requirement 11.2; Design — Authorization (Policies)
  - Acceptance checklist:
    - [ ] `User` model has `name`, `email`, `password`, and `role` fields
    - [ ] Login page is an Inertia React component (not a Blade view)
    - [ ] Login form submits credentials and creates a session on success
    - [ ] Failed login returns a validation error displayed on the login page
    - [ ] Logout action destroys the session and redirects to login
    - [ ] All authenticated routes are protected by `auth` middleware
    - [ ] Unauthenticated requests to protected routes redirect to the login page
    - [ ] `HandleInertiaRequests` middleware is configured
  - Test expectation: PestPHP feature tests: successful login redirects to dashboard; failed login returns validation error; unauthenticated request to a protected route redirects to login; logout destroys session.
  - Documentation expectation: None yet — auth flow covered by Task 31 (docs/user-guide.md).

---

- [ ] 7. Implement user management and role assignment (Admin only)
  - Milestone: v1 Foundation
  - Labels: feature, backend, frontend
  - Depends on: Task 6
  - **Note — Task 6 code alignment required:** Task 6 implemented authentication with role values `engagement_lead` and `engagement_officer` in the User model and migration. Before or during Task 7, update the following to use the new role values `lead` and `member`:
    - `app/Models/User.php`: constants `ROLE_ENGAGEMENT_LEAD` → `ROLE_LEAD` (value: `'lead'`), `ROLE_ENGAGEMENT_OFFICER` → `ROLE_MEMBER` (value: `'member'`), `ROLES` array
    - `database/migrations/2026_05_22_070855_add_role_to_users_table.php`: default value from `engagement_officer` to `member`
    - `database/factories/UserFactory.php`: default role from `engagement_officer` to `member`
    - Any existing tests that reference `engagement_lead` or `engagement_officer` role values
  - Description: Implement the `UserRoleAccess` module. Admin users can create, update, and deactivate user accounts and assign roles (Admin, Lead, Member). Non-admin users cannot access user management screens or actions.
  - Linked requirement/design: Requirement 11.1, 11.3; Design — UserRoleAccess module; Design — Authorization (Policies)
  - Acceptance checklist:
    - [ ] `users` migration includes `role` column (enum: Admin, Lead, Member)
    - [ ] `UserPolicy` enforces that only Admin can manage users
    - [ ] Admin can create a new user with name, email, password, and role
    - [ ] Admin can update a user's name, email, and role
    - [ ] Admin can deactivate (soft-delete or disable) a user account
    - [ ] User management screens are Inertia React components
    - [ ] Non-admin users receive a 403 response when attempting user management actions
    - [ ] A default Admin user is created by the database seeder
  - Test expectation: PestPHP feature tests: Admin creates a user successfully; Admin updates a user's role; Lead attempting user management receives 403; seeder creates the default Admin user.
  - Documentation expectation: None yet — role management covered by Task 31 (docs/user-guide.md).

---

- [ ] 8. Create module directory structure and base layout component
  - Milestone: v1 Foundation
  - Labels: setup, backend, frontend
  - Depends on: Task 5
  - Description: Scaffold the `app/Modules/` directory structure for all nine modules (AgencyOwnerManagement, ServiceTracking, WorkflowStageTracking, FollowUpActionTracking, DocumentLinkTracking, SpecialProjectTracking, Dashboard, UserRoleAccess, AuditHistoryTracking). Create the base authenticated layout React component used by all app screens.
  - Linked requirement/design: Design — Modular Boundaries; Design — Graphical Progress View Approach
  - Acceptance checklist:
    - [ ] `app/Modules/{ModuleName}/` directories exist for all nine modules
    - [ ] Each module directory has placeholder subdirectories: `Models/`, `Services/`, `Http/Controllers/`, `Policies/`
    - [ ] `resources/js/Layouts/AuthenticatedLayout.jsx` (or `.tsx`) exists with a navigation bar and content slot
    - [ ] Navigation bar includes links to: Dashboard, Agency Owners, Services, Special Projects, Follow-Up Actions, Users (Admin only)
    - [ ] Layout uses MYDS components and Tailwind CSS for styling
    - [ ] All subsequent Inertia pages use this layout
  - Test expectation: No automated tests for this task. Manual verification: authenticated pages render inside the layout.
  - Documentation expectation: None yet — module structure covered by Task 30 (docs/project-structure.md).

---

## Milestone 2 — v1 Core Tracking

---

- [ ] 9. Implement Agency Owner CRUD
  - Milestone: v1 Core Tracking
  - Labels: feature, backend, frontend
  - Depends on: Task 8
  - Description: Implement the `AgencyOwnerManagement` module. Provide `AgencyOwnerService` with create, list, and find operations. Expose Inertia React screens for listing and creating agency owners. Apply `AgencyOwnerPolicy` so that Admin, Lead, and Member can all create and update agency owners.
  - Linked requirement/design: Requirement 1.1, 1.2; Design — AgencyOwnerManagement module; Design — AgencyOwnerService
  - Acceptance checklist:
    - [ ] `agency_owners` migration creates table with `id`, `name`, timestamps
    - [ ] `AgencyOwner` Eloquent model exists in `app/Modules/AgencyOwnerManagement/Models/`
    - [ ] `AgencyOwnerService` implements `create(name)`, `list()`, `find(id)`
    - [ ] `AgencyOwnerPolicy` allows Admin, Lead, Member to create/update
    - [ ] Inertia React page: list of agency owners
    - [ ] Inertia React page: create agency owner form
    - [ ] Inertia React page: edit agency owner form
    - [ ] Form validation rejects empty or duplicate names with a clear error message
    - [ ] Agency owner list is accessible from the navigation
    - [ ] `GET /api/agency-owners` returns a JSON list of agency owners
    - [ ] `POST /api/agency-owners` accepts JSON and creates an agency owner
    - [ ] API endpoints are protected by `auth` middleware and return structured JSON responses
  - Test expectation: PestPHP unit tests for `AgencyOwnerService` (create, list, find, duplicate name rejection). PestPHP feature tests: create agency owner via HTTP; list returns all agency owners; Member can create; unauthenticated request is rejected.
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

- [ ] 10. Implement Service CRUD and target completion
  - Milestone: v1 Core Tracking
  - Labels: feature, backend, frontend
  - Depends on: Task 9
  - Description: Implement the `ServiceTracking` module. Provide `ServiceTrackingService` with register, list, find, and setTargetCompletion operations. Expose Inertia React screens for listing, creating, and editing services. Target completion accepts a full date or a month/year (stored as last day of that month).
  - Linked requirement/design: Requirement 2.1, 2.4, 4.1, 4.4; Design — ServiceTracking module; Design — ServiceTrackingService
  - Acceptance checklist:
    - [ ] `services` migration creates table with `id`, `name`, `agency_owner_id`, `target_completion_date` (nullable date), timestamps
    - [ ] `Service` Eloquent model with `belongsTo(AgencyOwner)` relationship
    - [ ] `ServiceTrackingService` implements `register(name, agencyOwnerId, targetCompletion?)`, `list(filters)`, `find(id)`, `setTargetCompletion(serviceId, date)`
    - [ ] Month/year input is converted to the last calendar day of that month before storage
    - [ ] `ServicePolicy` allows Admin, Lead, Member to create/update
    - [ ] Inertia React page: list of services (with agency owner name)
    - [ ] Inertia React page: create service form (name, agency owner dropdown, optional target completion)
    - [ ] Inertia React page: edit service form
    - [ ] Form validation rejects missing name or invalid agency owner
    - [ ] Unit tests cover month/year input storing the last day of that month, including February in leap and non-leap years
    - [ ] `GET /api/services` returns a JSON list of services with agency owner name and target completion date
    - [ ] `POST /api/services` accepts JSON and registers a new service
    - [ ] `PUT /api/services/{id}` accepts JSON and updates a service including target completion date
    - [ ] API endpoints are protected by `auth` middleware and return structured JSON responses
  - Test expectation: PestPHP unit tests for `ServiceTrackingService` (register, list, find, setTargetCompletion). PestPHP feature tests: create service via HTTP; list returns all services; month/year input stores last day of month. Unit tests cover month-end conversion including February edge cases (leap and non-leap years). Month-end conversion is covered by unit tests in this task.
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

- [ ] 11. Implement database seeders for Agency Owners and Services
  - Milestone: v1 Core Tracking
  - Labels: setup, backend
  - Depends on: Task 10
  - Description: Create database seeders that populate sample Agency Owners and Services with varied target completion dates. Seeders must be runnable via `php artisan migrate --seed` and must not break CI.
  - Linked requirement/design: Design — Seeder Strategy
  - Acceptance checklist:
    - [ ] `AgencyOwnerSeeder` creates at least 5 sample agency owners
    - [ ] `ServiceSeeder` creates at least 8 sample services across different agency owners
    - [ ] Some services have a target completion date in the past (to test delayed flag later)
    - [ ] Some services have no target completion date
    - [ ] `DatabaseSeeder` calls both seeders in the correct order
    - [ ] `php artisan migrate:fresh --seed` completes without errors
    - [ ] CI pipeline runs `php artisan migrate` (not `--seed`) and still passes
  - Test expectation: No dedicated test for this task. Seeder correctness is validated by subsequent feature tests that rely on seeded data.
  - Documentation expectation: None yet — seeder usage covered by Task 28 (docs/setup.md).

---

## Milestone 3 — v1 Workflow Tracking

---

- [ ] 12. Implement WorkflowStage model and auto-creation on service registration
  - Milestone: v1 Workflow Tracking
  - Labels: feature, backend
  - Depends on: Task 10
  - Description: Implement the `WorkflowStageTracking` module. Create the `WorkflowStage` model and migration. Hook into service registration so that exactly 10 workflow stages are created automatically with fixed names, correct order, and Pending status.
  - Linked requirement/design: Requirement 2.2, 2.3; Design — WorkflowStageTracking module; Design — Property 1
  - Acceptance checklist:
    - [ ] `workflow_stages` migration creates table with `id`, `service_id`, `stage_order` (1–10), `stage_name`, `status` (enum), `completed_at` (nullable), timestamps
    - [ ] `WorkflowStage` Eloquent model with `belongsTo(Service)` relationship
    - [ ] `Service` model has `hasMany(WorkflowStage)` relationship
    - [ ] `ServiceTrackingService::register()` creates exactly 10 stages after service creation
    - [ ] Stage names are fixed in the correct order (Surat Permohonan Onboard … Go-Live)
    - [ ] All 10 stages are initialized with status `Pending`
    - [ ] `WorkflowStageSeeder` updates seeded services with varied stage statuses for realistic demo data
  - Test expectation: PestPHP unit test for `WorkflowStageService` (stages created on registration). PestPHP feature test: register a service and assert exactly 10 stages exist with correct names, order, and Pending status (covers Property 1).
  - Documentation expectation: None yet — workflow logic covered by Task 29 (docs/workflow-status.md).

---

- [ ] 13. Implement stage status update, active stage logic, and completion date recording
  - Milestone: v1 Workflow Tracking
  - Labels: feature, backend, frontend
  - Depends on: Task 12
  - Description: Implement `WorkflowStageService::updateStatus()`. Any stage can be updated to any valid status at any time (no enforced linear progression). When a stage is set to Completed, record `completed_at`. The active stage is the In_Progress stage with the highest `stage_order`. Expose an Inertia React screen for viewing and updating a service's stages.
  - Linked requirement/design: Requirement 3.1, 3.2, 3.3, 3.4; Design — WorkflowStageService; Design — Stage Status Transitions
  - Acceptance checklist:
    - [ ] `WorkflowStageService::updateStatus(serviceId, stageId, status, user)` validates status against the enum
    - [ ] Any stage can be updated regardless of other stages' statuses
    - [ ] Setting status to `Completed` records `completed_at` with the current timestamp
    - [ ] Setting status away from `Completed` clears `completed_at`
    - [ ] `WorkflowStageService::getActiveStage(serviceId)` returns the In_Progress stage with the highest `stage_order`
    - [ ] `WorkflowStageService::getStagesForService(serviceId)` returns all 10 stages ordered by `stage_order`
    - [ ] Inertia React page: service detail view showing all 10 stages with current status
    - [ ] Stage status can be updated from the service detail view
    - [ ] Invalid status values are rejected with a validation error
    - [ ] `PUT /api/services/{serviceId}/stages/{stageId}` accepts JSON `{ "status": "..." }` and updates the stage status
    - [ ] Response includes the updated stage with `status`, `completed_at`, and `stage_order`
    - [ ] API endpoint is protected by `auth` middleware and enforces `WorkflowStagePolicy`
  - Test expectation: PestPHP unit tests: updateStatus sets new status (P2); Completed status records completed_at (P3); active stage returns highest-order In_Progress stage; invalid status is rejected. PestPHP feature tests: update stage via HTTP; completed_at is set; active stage is correct.
  - Documentation expectation: None yet — covered by Task 29 (docs/workflow-status.md).

---

- [ ] 14. Implement delayed flag computation and progress percentage
  - Milestone: v1 Workflow Tracking
  - Labels: feature, backend
  - Depends on: Task 13
  - Description: Implement the delayed flag and progress percentage as computed-on-read values in `ServiceTrackingService`. Delayed = target_completion_date < today AND Go-Live stage != Completed. Progress % = completed_count / (10 - not_applicable_count) * 100.
  - Linked requirement/design: Requirement 4.2, 4.3, 7.1; Design — Delayed Flag Logic; Design — Progress Calculation Approach; Design — Property 4
  - Acceptance checklist:
    - [ ] `ServiceTrackingService` or a dedicated helper computes `is_delayed` on read (not stored)
    - [ ] `is_delayed` is true only when target_completion_date is set, is in the past, and Go-Live stage is not Completed
    - [ ] `is_delayed` is false when target_completion_date is null
    - [ ] `is_delayed` is false when Go-Live stage is Completed even if date is past
    - [ ] Progress percentage is computed as `completed_count / (10 - not_applicable_count) * 100`
    - [ ] Progress percentage handles the edge case where all stages are Not_Applicable (returns 0 or 100 as defined)
    - [ ] Both values are included in the service data returned to Inertia pages
  - Test expectation: PestPHP unit tests for delayed flag (covers P4 examples): past date + Go-Live not Completed = delayed; future date = not delayed; null date = not delayed; past date + Go-Live Completed = not delayed. Unit tests for progress percentage: all Completed = 100%; mixed Not_Applicable stages reduce denominator correctly. Property-style test for P4 is added in the property-style tests task.
  - Documentation expectation: None yet — covered by Task 29 (docs/workflow-status.md).

---

## Milestone 4 — v1 Dashboard and Graphical Progress

---

- [ ] 15. Implement dashboard summary counts
  - Milestone: v1 Dashboard and Graphical Progress
  - Labels: feature, backend
  - Depends on: Task 14
  - Description: Implement `DashboardService::getSummary()` to return total services, go-live count, in-progress count, and delayed count. These counts must be consistent: total = go_live + in_progress, and delayed_count equals the count of services where is_delayed is true.
  - Linked requirement/design: Requirement 6.1, 6.2, 6.3, 6.4; Design — DashboardService; Design — Dashboard Summary Counts; Design — Property 12
  - Acceptance checklist:
    - [ ] `DashboardService::getSummary()` returns `total_services`, `go_live_count`, `in_progress_count`, `delayed_count`
    - [ ] `go_live_count` = count of services where Go-Live stage status = Completed
    - [ ] `in_progress_count` = count of services where Go-Live stage status != Completed
    - [ ] `delayed_count` = count of services where is_delayed = true
    - [ ] `total_services = go_live_count + in_progress_count` invariant holds
    - [ ] Summary data is passed to the dashboard Inertia page
    - [ ] `GET /api/dashboard/summary` returns JSON with `total_services`, `go_live_count`, `in_progress_count`, `delayed_count`
    - [ ] `GET /api/dashboard/progress` returns JSON list of services with progress data (active stage, progress %, delayed flag)
    - [ ] API endpoints are protected by `auth` middleware
  - Test expectation: PestPHP unit tests for `DashboardService::getSummary()` with varied service states. Property-style test (P12) is added in the property-style tests task.
  - Documentation expectation: None.

---

- [ ] 16. Build dashboard summary cards and service list UI
  - Milestone: v1 Dashboard and Graphical Progress
  - Labels: feature, frontend
  - Depends on: Task 15
  - Description: Build the dashboard Inertia React page with four summary cards (Total Services, Go-Live Reached, In Progress, Delayed) and a service list showing each service's agency owner, active stage, progress percentage, and delayed badge. Use MYDS components and Tailwind CSS. FontAwesome icons for card icons.
  - Linked requirement/design: Requirement 5.4, 6.5, 7.3; Design — Dashboard / Summary View; Design — Visual Progress Indicators
  - Acceptance checklist:
    - [ ] Dashboard page renders four summary cards with correct counts from `DashboardService::getSummary()`
    - [ ] Each card uses a FontAwesome icon (list, flag, clock, warning)
    - [ ] Service list shows: service name, agency owner name, active stage name, progress percentage, delayed badge (if delayed)
    - [ ] Delayed badge is visually distinct (e.g., red/orange badge)
    - [ ] Dashboard is the default authenticated landing page
    - [ ] Page uses the `AuthenticatedLayout` component
    - [ ] UI is clean, white-based, and uses MYDS design tokens
  - Test expectation: PestPHP feature test: dashboard page returns HTTP 200 and includes summary data in the Inertia props.
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

- [ ] 17. Build workflow timeline React component
  - Milestone: v1 Dashboard and Graphical Progress
  - Labels: feature, frontend
  - Depends on: Task 13
  - Description: Build a reusable `WorkflowTimeline` React component that renders all 10 stages as a horizontal timeline. Each stage node is color-coded and icon-coded by status. The active stage (highest-order In_Progress) is visually prominent. Used on the service detail page.
  - Linked requirement/design: Requirement 5.1, 5.2, 5.3; Design — Individual Service View; Design — Visual Progress Indicators
  - Acceptance checklist:
    - [ ] `WorkflowTimeline` component accepts a `stages` prop (array of 10 stage objects)
    - [ ] Each stage node renders with the correct color and FontAwesome icon per status (Pending=grey, In_Progress=blue, Completed=green, KIV=yellow, Not_Applicable=light grey, Blocked=red, To_Be_Confirmed=orange)
    - [ ] Active stage (highest-order In_Progress) is visually highlighted (larger node or highlighted border)
    - [ ] Stage names are displayed below each node
    - [ ] Component is used on the service detail page
    - [ ] Component is responsive and does not overflow on smaller screens
    - [ ] Target completion date and delayed badge are shown alongside the timeline
  - Test expectation: No automated tests for this task. Manual visual verification across all status combinations.
  - Documentation expectation: None yet — component usage covered by Task 30 (docs/project-structure.md).

---

## Milestone 5 — v1 Follow-Up and Document Links

---

- [ ] 18. Implement Follow-Up Action CRUD and overdue detection
  - Milestone: v1 Follow-Up and Document Links
  - Labels: feature, backend, frontend
  - Depends on: Task 10
  - Description: Implement the `FollowUpActionTracking` module. Follow-up actions are polymorphically associated with either a Service or a Special_Project. Overdue detection is computed on read: due_date < today AND status NOT IN (Done, Cancelled). Expose Inertia React screens for creating, listing, and updating follow-up actions.
  - Linked requirement/design: Requirement 9.1, 9.2, 9.3, 9.4, 9.5; Design — FollowUpActionTracking module; Design — FollowUpActionService; Design — Property 6
  - Acceptance checklist:
    - [ ] `follow_up_actions` migration creates table with `id`, `title`, `due_date`, `status` (enum), `remarks` (nullable), `actionable_type`, `actionable_id`, timestamps
    - [ ] `FollowUpAction` Eloquent model with polymorphic `morphTo(actionable)` relationship
    - [ ] `FollowUpActionService` implements `create(parentType, parentId, data)`, `update(id, data, user)`, `listOverdue()`
    - [ ] `is_overdue` is computed on read (not stored)
    - [ ] `FollowUpActionPolicy` allows Admin, Lead, Member to create/update
    - [ ] Inertia React page: list of follow-up actions for a service (with overdue badge)
    - [ ] Inertia React page: create/edit follow-up action form
    - [ ] Overdue follow-up actions are visually distinguished
    - [ ] `GET /api/follow-up-actions?parent_type=service&parent_id={id}` returns JSON list of follow-up actions for a parent
    - [ ] `POST /api/follow-up-actions` accepts JSON and creates a follow-up action
    - [ ] `PUT /api/follow-up-actions/{id}` accepts JSON and updates a follow-up action
    - [ ] API endpoints are protected by `auth` middleware and return structured JSON responses
  - Test expectation: PestPHP unit tests for `FollowUpActionService`: create, update, listOverdue, is_overdue computation (P6 examples: past due + Open = overdue; past due + Done = not overdue; future due + Open = not overdue). Property-style test (P6) is added in the property-style tests task.
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

- [ ] 19. Implement Document Link CRUD (polymorphic)
  - Milestone: v1 Follow-Up and Document Links
  - Labels: feature, backend, frontend
  - Depends on: Task 10
  - Description: Implement the `DocumentLinkTracking` module. Document links are polymorphically associated with Service, WorkflowStage, Special_Project, or Follow_Up_Action. Store URL (validated) and optional label. Links open in a new browser tab. No file upload, no Google Drive API.
  - Linked requirement/design: Requirement 10.1, 10.2, 10.3, 10.4; Design — DocumentLinkTracking module; Design — DocumentLinkService; Design — Document Link Approach; Design — Property 7
  - Acceptance checklist:
    - [ ] `document_links` migration creates table with `id`, `url`, `label` (nullable), `linkable_type`, `linkable_id`, timestamps
    - [ ] `DocumentLink` Eloquent model with polymorphic `morphTo(linkable)` relationship
    - [ ] `DocumentLinkService` implements `attach(parentType, parentId, url, label?)`, `getFor(parentType, parentId)`, `remove(id)`
    - [ ] URL is validated as a well-formed URL; invalid URLs are rejected
    - [ ] Links are displayed inline alongside their parent entity
    - [ ] Each link renders as a clickable label (or URL if no label) with a FontAwesome external-link icon
    - [ ] Links open in a new browser tab (`target="_blank"`)
    - [ ] Document links are shown on service detail, stage detail, special project, and follow-up action views
    - [ ] `GET /api/document-links?linkable_type={type}&linkable_id={id}` returns JSON list of document links for a parent
    - [ ] `POST /api/document-links` accepts JSON `{ "url": "...", "label": "...", "linkable_type": "...", "linkable_id": ... }` and attaches a link
    - [ ] `DELETE /api/document-links/{id}` removes a document link
    - [ ] API endpoints are protected by `auth` middleware
  - Test expectation: PestPHP unit tests for `DocumentLinkService`: attach, getFor, remove, URL validation rejection. PestPHP feature test: attach a link to a service and retrieve it (covers P7 round-trip).
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

- [ ] 20. Display overdue follow-up panel on dashboard
  - Milestone: v1 Follow-Up and Document Links
  - Labels: feature, frontend
  - Depends on: Task 18, Task 16
  - Description: Add a dedicated overdue follow-up actions panel to the dashboard. The panel lists all overdue follow-up actions across all services and special projects, with a visual warning indicator. Uses `FollowUpActionService::listOverdue()`.
  - Linked requirement/design: Requirement 9.6; Design — Dashboard / Summary View; Design — Overdue Follow-Up Actions
  - Acceptance checklist:
    - [ ] Dashboard page includes an overdue follow-up actions section
    - [ ] Section lists all overdue actions with: title, parent entity name, due date, status
    - [ ] Each overdue item has a visual warning badge (FontAwesome clock/warning icon)
    - [ ] Section is prominently placed (not hidden below the fold)
    - [ ] Empty state is shown when there are no overdue actions
    - [ ] Overdue count is reflected in the dashboard summary (or a dedicated badge)
  - Test expectation: PestPHP feature test: dashboard page includes overdue follow-up actions in Inertia props when overdue actions exist; empty list when none exist.
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

## Milestone 6 — v1 Special Projects

---

- [ ] 21. Implement Special Project CRUD
  - Milestone: v1 Special Projects
  - Labels: feature, backend, frontend
  - Depends on: Task 18, Task 19
  - Description: Implement the `SpecialProjectTracking` module. Special projects have a title, status, and optional target date. They support follow-up actions and document links but do not use the 10-stage workflow. Expose Inertia React screens for listing, creating, and editing special projects.
  - Linked requirement/design: Requirement 8.1, 8.2, 8.4; Design — SpecialProjectTracking module; Design — SpecialProjectService
  - Acceptance checklist:
    - [ ] `special_projects` migration creates table with `id`, `title`, `status`, `target_date` (nullable), timestamps
    - [ ] `status` column uses enum: Open, In_Progress, Completed, KIV, Cancelled
    - [ ] `SpecialProject` Eloquent model with `morphMany(FollowUpAction)` and `morphMany(DocumentLink)` relationships
    - [ ] `SpecialProjectService` implements `create(data)`, `update(id, data)`, `list()`
    - [ ] `SpecialProjectPolicy` allows Admin, Lead, Member to create/update
    - [ ] Inertia React page: list of special projects
    - [ ] Inertia React page: create/edit special project form
    - [ ] Special project detail page shows follow-up actions and document links
    - [ ] No workflow timeline is shown for special projects
    - [ ] Special project status can be set to one of: Open, In_Progress, Completed, KIV, Cancelled
    - [ ] `GET /api/special-projects` returns a JSON list of special projects
    - [ ] `POST /api/special-projects` accepts JSON and creates a special project
    - [ ] `PUT /api/special-projects/{id}` accepts JSON and updates a special project
    - [ ] API endpoints are protected by `auth` middleware and return structured JSON responses
  - Test expectation: PestPHP unit tests for `SpecialProjectService`: create, update, list. PestPHP feature tests: create special project via HTTP; follow-up actions and document links can be attached.
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

- [ ] 22. Display Special Projects on dashboard
  - Milestone: v1 Special Projects
  - Labels: feature, frontend
  - Depends on: Task 21, Task 16
  - Description: Add a dedicated Special Projects section to the dashboard. Each special project shows its title, status, target date, and overdue follow-up count. No workflow timeline is shown. The section is visually distinct from the standard services list.
  - Linked requirement/design: Requirement 8.3; Design — Special Projects in the View
  - Acceptance checklist:
    - [ ] Dashboard page includes a Special Projects section
    - [ ] Each special project card shows: title, status, target date (if set), overdue follow-up count
    - [ ] Section is visually distinct from the standard services list
    - [ ] Empty state is shown when there are no special projects
    - [ ] Special project cards link to the special project detail page
  - Test expectation: PestPHP feature test: dashboard page includes special projects in Inertia props.
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

## Milestone 7 — v1 Audit and History

---

- [ ] 23. Implement AuditEntry model, events, and listener
  - Milestone: v1 Audit and History
  - Labels: feature, backend
  - Depends on: Task 13, Task 18
  - Description: Implement the `AuditHistoryTracking` module. Define `StageStatusChanged` and `FollowUpActionStatusChanged` events. Implement `AuditHistoryListener` that writes an `AuditEntry` record on each event. Fire events from `WorkflowStageService::updateStatus()` and `FollowUpActionService::update()`.
  - Linked requirement/design: Requirement 13.1, 13.2; Design — AuditHistoryTracking module; Design — Events and Listeners; Design — History Tracking Approach; Design — Property 8, Property 9
  - Acceptance checklist:
    - [ ] `audit_entries` migration creates table with `id`, `auditable_type`, `auditable_id`, `field_changed`, `previous_value`, `new_value`, `changed_by_user_id`, `changed_at`, timestamps
    - [ ] `AuditEntry` Eloquent model with polymorphic `morphTo(auditable)` and `belongsTo(User)` relationships
    - [ ] `StageStatusChanged` event carries: stage, previous status, new status, user
    - [ ] `FollowUpActionStatusChanged` event carries: follow-up action, previous status, new status, user
    - [ ] `AuditHistoryListener` handles both events and writes `AuditEntry` records
    - [ ] Events are fired synchronously (no queue in v1)
    - [ ] `WorkflowStageService::updateStatus()` fires `StageStatusChanged`
    - [ ] `FollowUpActionService::update()` fires `FollowUpActionStatusChanged` when status changes
    - [ ] `AuditHistoryService::getHistoryFor(entityType, entityId)` returns entries newest-first
  - Test expectation: PestPHP unit tests: updating a stage status creates an AuditEntry (P8); updating a follow-up action status creates an AuditEntry (P9); AuditEntry contains correct previous/new values, user, and timestamp.
  - Documentation expectation: None yet — covered by Task 29 (docs/architecture.md).

---

- [ ] 24. Build audit history view (per service and per follow-up action)
  - Milestone: v1 Audit and History
  - Labels: feature, frontend
  - Depends on: Task 23
  - Description: Build Inertia React views for displaying audit history. The service detail page shows a chronological list (newest first) of all stage status changes. The follow-up action detail page shows its status change history. Each entry shows: field changed, previous value, new value, user, and timestamp.
  - Linked requirement/design: Requirement 13.3; Design — Viewing History
  - Acceptance checklist:
    - [ ] Service detail page includes an audit history section showing all stage status changes
    - [ ] Follow-up action detail page includes an audit history section
    - [ ] History is displayed newest-first
    - [ ] Each entry shows: field changed, previous value, new value, user name, and timestamp
    - [ ] Empty state is shown when no history exists
    - [ ] History section is clearly labelled and visually separated from other content
  - Test expectation: PestPHP feature test: service history endpoint returns audit entries in correct order; follow-up action history endpoint returns entries.
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

## Milestone 8 — v1 Search and Filter

---

- [ ] 25. Implement search by service name and agency owner name
  - Milestone: v1 Search and Filter
  - Labels: feature, backend, frontend
  - Depends on: Task 10
  - Description: Implement `DashboardService::search(query)` to filter services by name or agency owner name (case-insensitive). Add a search bar to the dashboard and service list pages. Results update the service list.
  - Linked requirement/design: Requirement 12.1, 12.3; Design — Search and Filter; Design — Property 10
  - Acceptance checklist:
    - [ ] `DashboardService::search(query)` returns only services whose name or agency owner name contains the query (case-insensitive)
    - [ ] Search returns no services that do not match the query
    - [ ] Search bar is present on the dashboard and service list pages
    - [ ] Search can be triggered on submit or live (debounced)
    - [ ] Empty query returns all services
    - [ ] Search results update the service list without a full page reload (Inertia)
    - [ ] `GET /api/services/search?q={query}` returns JSON list of matching services
    - [ ] API endpoint is protected by `auth` middleware
  - Test expectation: PestPHP unit tests for `DashboardService::search()`: matching by service name; matching by agency owner name; case-insensitive match; non-matching query returns empty (covers P10 examples). PestPHP feature test: search endpoint returns correct results.
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

- [ ] 26. Implement filter by agency owner, stage status, and delayed status
  - Milestone: v1 Search and Filter
  - Labels: feature, backend, frontend
  - Depends on: Task 14, Task 25
  - Description: Extend `DashboardService::getProgressView(filters)` to support filtering by Agency Owner (dropdown), Stage Status (multi-select), and Delayed (toggle). Add a filter panel to the dashboard. Filtered results must contain only services that satisfy all applied filters.
  - Linked requirement/design: Requirement 12.2, 12.3; Design — Search and Filter; Design — Property 11
  - Acceptance checklist:
    - [ ] `DashboardService::getProgressView(filters)` accepts `agency_owner_id`, `stage_status[]`, and `delayed` filter parameters
    - [ ] Filtering by agency owner returns only services belonging to that agency owner
    - [ ] Filtering by stage status returns only services that have at least one stage with that status
    - [ ] Filtering by delayed returns only delayed services
    - [ ] Combined filters are applied with AND logic (all filters must be satisfied)
    - [ ] Filter panel is present on the dashboard with: Agency Owner dropdown, Stage Status multi-select, Delayed toggle
    - [ ] Clearing all filters returns all services
    - [ ] Filtered results update the service list via Inertia
    - [ ] `GET /api/services?agency_owner_id={id}&stage_status[]={status}&delayed={bool}` returns JSON filtered list
    - [ ] API endpoint is protected by `auth` middleware
  - Test expectation: PestPHP unit tests for `DashboardService::getProgressView()`: filter by agency owner; filter by stage status; filter by delayed; combined filters (covers P11 examples). PestPHP feature test: filter endpoint returns correct results.
  - Documentation expectation: None yet — covered by Task 31 (docs/user-guide.md).

---

## Milestone 9 — v1 Documentation

---

- [ ] 28. Write README.md and docs/setup.md
  - Milestone: v1 Documentation
  - Labels: documentation
  - Depends on: Task 1, Task 4
  - Description: Write `README.md` with a project overview, quick start guide, and links to all `docs/` files. Write `docs/setup.md` with the full container-first setup guide (step-by-step Docker Compose commands) and a manual setup guide explaining each command.
  - Linked requirement/design: Design — Documentation; Design — Setup Flow
  - Acceptance checklist:
    - [ ] `README.md` includes: project name, one-paragraph overview, quick start (Docker Compose steps), links to all `docs/` files
    - [ ] `docs/setup.md` covers: prerequisites (Docker Desktop, Git), all `docker compose` commands with explanations, `.env.example` setup, `php artisan migrate --seed`, `npm run build`, and how to open the app
    - [ ] `docs/setup.md` includes a manual setup section (without Docker) for developers who prefer it
    - [ ] All commands in `docs/setup.md` are tested and accurate
    - [ ] `README.md` links to: docs/architecture.md, docs/setup.md, docs/project-structure.md, docs/workflow-status.md, docs/testing.md, docs/ci.md, docs/user-guide.md, docs/troubleshooting.md
  - Test expectation: No automated tests. Manual review: follow the setup guide from scratch in a clean environment.
  - Documentation expectation: This task IS the documentation deliverable.

---

- [ ] 29. Write docs/architecture.md, docs/workflow-status.md, docs/testing.md, and docs/ci.md
  - Milestone: v1 Documentation
  - Labels: documentation
  - Depends on: Task 23, Task 27
  - Description: Write four technical documentation files covering the system architecture, workflow/status logic, testing approach, and CI pipeline. These are aimed at developers learning the codebase.
  - Linked requirement/design: Design — Documentation; Design — CI Approach; Design — Testing Strategy
  - Acceptance checklist:
    - [ ] `docs/architecture.md` covers: modular monolith overview, module list and responsibilities, service/action class pattern, events/listeners, Eloquent models, policies, API-first approach
    - [ ] `docs/workflow-status.md` covers: 10 fixed stages, all status values, active stage selection logic, delayed flag logic, overdue follow-up logic, progress percentage calculation
    - [ ] `docs/testing.md` covers: how to run unit tests, feature tests, and property-style tests; test directory structure; property test iteration count; CI test execution
    - [ ] `docs/ci.md` covers: GitHub Actions workflow steps, PHPStan level, Laravel Pint, branch strategy, PR requirements
    - [ ] All four files are accurate and reflect the actual implementation
  - Test expectation: No automated tests. Peer review for accuracy.
  - Documentation expectation: This task IS the documentation deliverable.

---

- [ ] 30. Write docs/project-structure.md
  - Milestone: v1 Documentation
  - Labels: documentation
  - Depends on: Task 8
  - Description: Write `docs/project-structure.md` explaining the full directory layout: Laravel module structure under `app/Modules/`, frontend structure under `resources/js/`, and guidance on MYDS, Tailwind CSS, and FontAwesome usage.
  - Linked requirement/design: Design — Documentation; Design — Frontend Documentation
  - Acceptance checklist:
    - [ ] `docs/project-structure.md` covers: top-level directory layout, `app/Modules/` structure with one example module expanded, `resources/js/Pages`, `resources/js/Components`, `resources/js/Layouts`
    - [ ] MYDS usage guidance: which components to use, where to find the design system
    - [ ] Tailwind CSS usage guidance: utility-first approach, config file location
    - [ ] FontAwesome usage guidance: import pattern, icon naming convention
    - [ ] File is accurate and reflects the actual project structure
  - Test expectation: No automated tests. Peer review for accuracy.
  - Documentation expectation: This task IS the documentation deliverable.

---

- [ ] 31. Write docs/user-guide.md and docs/troubleshooting.md
  - Milestone: v1 Documentation
  - Labels: documentation
  - Depends on: Task 22, Task 24, Task 26
  - Description: Write the end-user guide covering all engagement officer workflows, and a troubleshooting guide covering common Docker, Composer, npm, migration, and permission issues.
  - Linked requirement/design: Design — User Documentation
  - Acceptance checklist:
    - [ ] `docs/user-guide.md` covers all 12 topics from the design: register agency owner, register service, update stage status, read progress view, set target completion, identify delayed services, create follow-up actions, identify overdue follow-up actions, add document links, use search and filters, view special projects, view history/audit updates
    - [ ] Each section includes step-by-step instructions with screen/page references
    - [ ] `docs/troubleshooting.md` covers: Docker not starting, Composer install failures, npm build failures, migration errors, permission issues on Linux/Mac, `.env` misconfiguration
    - [ ] Both files are written for a non-developer audience (engagement officers)
  - Test expectation: No automated tests. User acceptance review by an engagement team member.
  - Documentation expectation: This task IS the documentation deliverable.

---

## Milestone 10 — v1 Testing and Quality

---

- [ ] 27. Write property-style tests (P4, P6, P12)
  - Milestone: v1 Testing and Quality
  - Labels: test, backend
  - Depends on: Task 14, Task 18, Task 15
  - Description: Write PestPHP property-style tests for three critical business rules identified in the design: P4 (delayed flag), P6 (overdue follow-up), and P12 (dashboard summary consistency). P5 is covered by unit tests in Task 10; this task adds property-style randomisation for P4, P6, and P12 only. Each test runs over randomised inputs with a practical, configurable iteration count. Tag each test with the property comment convention.
  - Linked requirement/design: Design — Property-Style Tests; Design — Property 4, 6, 12
  - Acceptance checklist:
    - [ ] `tests/Property/DelayedFlagPropertyTest.php` exists and tests P4 with random target dates × random Go-Live statuses
    - [ ] `tests/Property/FollowUpOverduePropertyTest.php` exists and tests P6 with random due dates × random statuses
    - [ ] `tests/Property/DashboardSummaryPropertyTest.php` exists and tests P12 with random sets of services
    - [ ] Each test file is tagged with `// Feature: engageflow-tracker, Property N: ...`
    - [ ] Iteration count is practical and configurable (not hardcoded to a fixed minimum)
    - [ ] All property tests pass in CI
  - Test expectation: This task IS the tests. All three property test files are the deliverable.
  - Documentation expectation: None yet — covered by Task 29 (docs/testing.md).

---

- [ ] 32. Full test coverage review and gap-filling
  - Milestone: v1 Testing and Quality
  - Labels: test, backend
  - Depends on: Task 27
  - Description: Review the full test suite for coverage gaps. Add missing unit and feature tests for any service class, policy, or controller that lacks adequate coverage. Ensure all 13 correctness properties are covered by at least one test (property-style or example-based).
  - Linked requirement/design: Design — Testing Strategy; Design — Properties 1–13
  - Acceptance checklist:
    - [ ] All nine service classes have unit tests covering happy path, validation rejection, and business rule enforcement
    - [ ] All policies have feature tests covering allowed and denied actions for each role
    - [ ] Properties P1, P2, P3, P7, P8, P9, P10, P11, P13 are covered by example-based unit or feature tests
    - [ ] Properties P4, P6, P12 are covered by property-style tests (from Task 27)
    - [ ] Property P5 is covered by unit tests (from Task 10)
    - [ ] `php artisan test` passes with zero failures
    - [ ] No test file is empty or contains only placeholder tests
  - Test expectation: This task IS the test deliverable. All gaps identified and filled.
  - Documentation expectation: Update `docs/testing.md` if new test patterns are introduced.

---

- [ ] 33. PHPStan level 5 compliance and Laravel Pint code style pass
  - Milestone: v1 Testing and Quality
  - Labels: refactor, backend, ci
  - Depends on: Task 32
  - Description: Run PHPStan at level 5 across the entire codebase and fix all reported issues. Run Laravel Pint and fix all code style violations. The CI pipeline must pass with zero PHPStan errors and zero Pint violations.
  - Linked requirement/design: Design — CI Approach
  - Acceptance checklist:
    - [ ] `vendor/bin/phpstan analyse --level=5` reports zero errors
    - [ ] `vendor/bin/pint --test` reports zero violations
    - [ ] All PHPStan suppressions (if any) are documented with a justification comment
    - [ ] No dead code, unused imports, or undefined variables remain
    - [ ] CI pipeline passes all checks on a clean branch
  - Test expectation: No new application tests. CI checks are the verification mechanism.
  - Documentation expectation: None.

---

## Milestone 11 — v1 Polish and Review

---

- [ ] 34. Seeder review and demo data quality pass
  - Milestone: v1 Polish and Review
  - Labels: setup, backend
  - Depends on: Task 22
  - Description: Review all database seeders to ensure they produce realistic, varied demo data that exercises all features: delayed services, overdue follow-up actions, special projects, document links, and audit history. The seeded state should allow a new developer to explore the full dashboard immediately.
  - Linked requirement/design: Design — Seeder Strategy
  - Acceptance checklist:
    - [ ] Seeder creates at least 5 agency owners, 8+ services, 3+ special projects
    - [ ] At least 2 services have a past target completion date and are not at Go-Live (delayed)
    - [ ] At least 3 follow-up actions are overdue
    - [ ] At least 2 services have document links on stages
    - [ ] At least 1 special project has follow-up actions and document links
    - [ ] Audit history entries exist for at least 3 stage status changes
    - [ ] `php artisan migrate:fresh --seed` completes without errors
    - [ ] Default Admin user credentials are documented in `docs/setup.md`
  - Test expectation: No automated tests. Manual verification: run `migrate:fresh --seed` and confirm the dashboard shows varied, realistic data.
  - Documentation expectation: Update `docs/setup.md` with default seeded user credentials.

---

- [ ] 35. Final PR and issue hygiene review
  - Milestone: v1 Polish and Review
  - Labels: setup, ci
  - Depends on: Task 34
  - Description: Review all open GitHub Issues and PRs. Ensure all tasks have corresponding closed issues, all PRs reference their issues, labels and milestones are applied consistently, and the project board reflects the final state. Close any stale issues.
  - Linked requirement/design: Design — GitHub Project Management
  - Acceptance checklist:
    - [ ] All 35 tasks have corresponding GitHub Issues
    - [ ] All merged PRs reference their GitHub Issue
    - [ ] All issues have correct labels and milestone assignments
    - [ ] GitHub Project board shows all issues as Done
    - [ ] No stale or orphaned issues remain open
    - [ ] `main` branch is up to date and all CI checks pass on `main`
    - [ ] Branch protection rules are confirmed active on `main`
  - Test expectation: No automated tests. Manual review of GitHub repository state.
  - Documentation expectation: None.

---

## Notes

- Each task is sized for one GitHub Issue and one pull request
- Testing tasks are first-class tasks, not sub-tasks
- Documentation tasks are first-class tasks, not afterthoughts
- CI tasks are first-class tasks
- Container-first setup (Task 1) is the foundation for all other tasks
- Property-style tests use PestPHP datasets/randomisation; iteration count is practical and configurable
- All app screens use Inertia React — no Blade UI except `resources/views/app.blade.php`
- No Redis, no Mailpit, no microservices, no mobile app, no Excel import in v1
- API-first endpoints are included for core operations so future mobile clients can reuse the backend without a rewrite
- Backend modules do NOT call each other through HTTP inside the monolith — use direct service/action calls
- Milestone 9 (v1 Documentation) tasks can be worked in parallel with Milestone 10 (v1 Testing and Quality)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2", "3", "4", "5"] },
    { "id": 2, "tasks": ["6", "8", "28"] },
    { "id": 3, "tasks": ["7", "9", "30"] },
    { "id": 4, "tasks": ["10"] },
    { "id": 5, "tasks": ["11", "12", "18", "19", "25"] },
    { "id": 6, "tasks": ["13"] },
    { "id": 7, "tasks": ["14", "17", "23"] },
    { "id": 8, "tasks": ["15"] },
    { "id": 9, "tasks": ["16", "20", "24", "26", "27"] },
    { "id": 10, "tasks": ["21", "29", "32"] },
    { "id": 11, "tasks": ["22", "31"] },
    { "id": 12, "tasks": ["33", "34"] },
    { "id": 13, "tasks": ["35"] }
  ]
}
```
