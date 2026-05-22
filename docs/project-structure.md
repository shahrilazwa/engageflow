# Project Structure

> **Status:** Skeleton — detailed content will be expanded as implementation progresses.

This document explains the directory layout of EngageFlow.

---

## Top-Level Layout

```
engageflow/
├── app/                    # Laravel application code
│   ├── Http/
│   │   └── Controllers/    # HTTP controllers
│   ├── Models/             # Eloquent models (shared/base)
│   ├── Modules/            # Feature modules (see below)
│   └── Providers/          # Service providers
├── bootstrap/              # Laravel bootstrap files
├── config/                 # Laravel configuration files
├── database/
│   ├── factories/          # Model factories for testing
│   ├── migrations/         # Database migrations
│   └── seeders/            # Database seeders
├── docker/
│   └── app/                # Docker build files (Dockerfile, nginx.conf, etc.)
├── docs/                   # Project documentation
├── public/                 # Web server document root
├── resources/
│   ├── css/                # CSS entry point
│   ├── js/                 # Frontend (Inertia + React)
│   │   ├── Components/     # Reusable React components
│   │   ├── Layouts/        # Layout components
│   │   └── Pages/          # Inertia page components
│   └── views/
│       └── app.blade.php   # Single root Inertia view (only Blade file)
├── routes/
│   ├── api.php             # API routes
│   └── web.php             # Web routes
├── storage/                # Logs, cache, uploaded files
├── tests/
│   ├── Feature/            # Feature (HTTP-level) tests
│   ├── Property/           # Property-style tests (critical business rules)
│   └── Unit/               # Unit tests
├── .env.example            # Environment variable template
├── .env.ci                 # CI environment file
├── composer.json           # PHP dependencies
├── docker-compose.yml      # Docker Compose services
├── phpstan.neon            # PHPStan configuration
├── phpunit.xml             # PHPUnit/PestPHP configuration
└── vite.config.js          # Vite asset bundler configuration
```

---

## Module Structure

Each feature module lives under `app/Modules/{ModuleName}/` and follows this structure:

```
app/Modules/ServiceTracking/
├── Http/
│   └── Controllers/        # Module controllers
├── Models/                 # Module Eloquent models
├── Policies/               # Authorization policies
├── Services/               # Service/action classes
├── Events/                 # Domain events
└── Listeners/              # Event listeners
```

---

## Frontend Structure

The frontend uses **Inertia.js + React**. Blade is used only for the single root view.

```
resources/
├── css/
│   └── app.css                 # CSS entry point (MYDS + Tailwind)
├── js/
│   ├── app.jsx                 # Inertia bootstrap entry point
│   ├── bootstrap.js            # Axios HTTP client setup
│   ├── Components/             # Reusable React components (lego blocks)
│   │   └── (e.g. PageHeader, Card, StatusBadge, EmptyState)
│   ├── Layouts/                # Layout components
│   │   └── (e.g. AuthenticatedLayout.jsx)
│   └── Pages/                  # One file per Inertia page/route
│       └── (e.g. Dashboard.jsx, Services/Index.jsx)
└── views/
    └── app.blade.php           # Single root Inertia view (only Blade file)
```

### Lego-Style React Components

EngageFlow uses a **lego-style** frontend component approach, similar in spirit to Laravel Blade components. Pages are built by assembling small, readable UI blocks rather than writing large monolithic page files.

**Principles:**
- Keep page files small and easy to understand.
- Extract repeated UI into reusable components under `resources/js/Components/`.
- Use plain function components with clear props.
- Use simple state only where needed.
- Use readable naming.
- Add short comments for non-obvious UI behaviour.

This approach makes the frontend understandable to a Laravel developer familiar with Blade components — each React component is a self-contained block with clear inputs (props) and a clear output (rendered HTML).

**Example component categories:**
- Layout: `PageHeader`, `Card`, `EmptyState`
- Forms: `FormInput`, `FormSelect`, `PrimaryButton`, `SecondaryButton`
- Status: `StatusBadge`, `DelayedBadge`, `OverdueBadge`
- Domain: `WorkflowTimeline`, `DashboardSummaryCard`, `FollowUpPanel`

> **Blade guardrail:** Only `resources/views/app.blade.php` should exist as a Blade file. All application screens are built as Inertia React components.

---

## MYDS, Tailwind, and FontAwesome

- **MYDS** — Malaysia Digital Services design system. Use MYDS components and design tokens where practical. Import from the `@govtechmy/myds-react` package.
- **Tailwind CSS** — Utility-first CSS. Configuration is in `tailwind.config.js`.
- **FontAwesome** — Icon library. Use icons purposefully to support readability, not as decoration.

---

> This document will be expanded with detailed module descriptions and component examples during implementation.
