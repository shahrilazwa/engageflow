# Project Structure

This document explains the intended directory layout for EngageFlow. It is a skeleton and should be expanded as each MVP slice is implemented.

---

## Top-Level Layout

```text
engageflow/
|-- app/                    # Laravel application code
|   |-- Actions/            # Business actions, when introduced
|   |-- Http/
|   |   |-- Controllers/    # Inertia and HTTP controllers
|   |   `-- Requests/       # Form request validation
|   |-- Models/             # Eloquent models
|   |-- Policies/           # Laravel policies
|   `-- Providers/          # Service providers
|-- bootstrap/              # Laravel bootstrap files
|-- config/                 # Laravel configuration
|-- database/
|   |-- factories/          # Model factories
|   |-- migrations/         # Database migrations
|   `-- seeders/            # Review/demo seeders
|-- docker/
|   |-- app/                # PHP/Nginx image files
|   `-- db/                 # PostgreSQL init scripts
|-- docs/                   # Project documentation
|-- public/                 # Web server document root
|-- resources/
|   |-- css/                # CSS entry point
|   |-- js/                 # Inertia + React frontend
|   `-- views/              # Single root Inertia Blade view
|-- routes/
|   `-- web.php             # Inertia web routes
|-- storage/                # Laravel logs and cache
|-- tests/
|   |-- Feature/            # HTTP and policy tests
|   |-- Property/           # Property-style tests, when added
|   `-- Unit/               # Unit tests
|-- docker-compose.yml      # Container-first local runtime
|-- phpstan.neon            # PHPStan/Larastan config
|-- phpunit.xml             # Pest/PHPUnit config
|-- tsconfig.json           # TypeScript config
`-- vite.config.js          # Vite config
```

---

## Backend Organization

Use Laravel conventions first. Add feature-specific action classes only when they keep controllers thin and business rules testable.

Current v1 models:

| Model | Table | Purpose |
|---|---|---|
| `User` | `users` | Authenticated user, Project owner |
| `Project` | `projects` | Owner-scoped workspace with soft-delete and archive status |
| `ProjectWorkflow` | `project_workflows` | One JSONB workflow definition per Project (auto-created) |

Upcoming models (MVP 1+):

- `Task` — tracked work item inside a Project
- `TaskWorkflowStep` — relational progress snapshot per Task
- `TaskDeliverable` — expected Task output
- `DocumentLink` — external URL attached to supported entities
- `FollowUpAction` — operational action tracking
- `AuditEntry` — status-change history

Authorization is policy-based. `ProjectPolicy` enforces owner-only access. Inaccessible records return 404.

---

## Frontend Organization

The frontend uses Inertia React with TypeScript for new code.

```text
resources/js/
|-- app.jsx                 # Inertia bootstrap, supports .jsx and .tsx pages
|-- bootstrap.js            # Axios setup
|-- Components/             # Shared lego-style UI blocks
|-- Features/               # Feature components, when useful
|-- Layouts/                # Shared layouts
|-- Pages/                  # Inertia pages
`-- vite-env.d.ts           # Vite TypeScript declarations
```

New page and feature components should use `.tsx` unless there is a specific reason to keep an existing `.jsx` file.

---

## Lego-Style React Components

Pages should be assembled from small, typed components with clear props. Keep page files readable and avoid large monolithic components.

Expected component groups:

- Layout blocks such as page headers and content regions
- Form controls and validation summaries
- Status badges and progress indicators
- Workflow builder blocks such as canvas, toolbar, inspector, and ordered step list
- Task blocks such as progress timeline, deliverables, document links, follow-ups, and history

Use MYDS React and MYDS Style as the primary UI system. Use Tailwind CSS for layout composition around MYDS components.

---

## Blade Guardrail

`resources/views/app.blade.php` is the only application Blade screen. User-facing screens should be Inertia React pages.
