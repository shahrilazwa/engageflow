# Testing Guide

This document explains how to run EngageFlow checks from containers.

---

## Testing Stack

- PestPHP for automated backend tests
- PHPStan via Larastan for backend static analysis
- Laravel Pint for PHP code style
- TypeScript for frontend contract checks
- Vite for frontend production build verification

---

## Backend Tests

```bash
# Run the full test suite
docker compose exec app php artisan test

# Run unit tests only
docker compose exec app php artisan test --testsuite=Unit

# Run feature tests only
docker compose exec app php artisan test --testsuite=Feature

# Run a specific test file
docker compose exec app php artisan test tests/Feature/ExampleTest.php
```

---

## Static Analysis And Style

```bash
# Run static analysis
docker compose exec app vendor/bin/phpstan analyse

# Check PHP code style
docker compose exec app vendor/bin/pint --test

# Auto-fix PHP code style
docker compose exec app vendor/bin/pint
```

---

## Frontend Checks

```bash
# Install frontend dependencies into the Docker node_modules volume
docker compose run --rm node npm ci

# Run TypeScript checks
docker compose exec node npm run typecheck

# Build frontend assets
docker compose exec node npm run build
```

Do not run `npm`, `node`, `php`, `composer`, or `vendor/bin/*` commands directly on the host machine.

---

## Test Organisation

```text
tests/
|-- Feature/        # HTTP-level tests for routes, requests, controllers, and policies
|-- Property/       # Property-style tests for selected business rules, when added
`-- Unit/           # Unit tests for service classes and helpers
```

---

## Testing Approach

Unit tests cover isolated business rules and pure helpers. Feature tests cover the HTTP request/response cycle, owner-only Project access, database persistence, validation, and Project scoping.

Property-style tests may be added for high-value business rules such as progress calculation, delayed status, overdue follow-ups, and dashboard count consistency.

---

## Database In Tests

Tests use PostgreSQL. Local tests connect to the Docker Compose `db` service and use the `engageflow_test` database. CI uses a PostgreSQL service container with the same database name.
