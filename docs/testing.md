# Testing Guide

> **Status:** Skeleton — detailed content will be expanded as implementation progresses.

This document explains how to run tests and the testing approach used in EngageFlow.

---

## Testing Stack

- **PestPHP** — primary testing framework (built on PHPUnit)
- **PHPStan** (via `nunomaduro/larastan`) — static analysis at level 5
- **Laravel Pint** — code style enforcement

---

## Running Tests

All test commands run inside the Docker container:

```bash
# Run the full test suite
docker compose exec app php artisan test

# Run with verbose output
docker compose exec app php artisan test --verbose

# Run a specific test file
docker compose exec app php artisan test tests/Feature/ExampleTest.php

# Run a specific test by name
docker compose exec app php artisan test --filter "test_the_application_returns_a_successful_response"
```

---

## Running PHPStan

```bash
# Run static analysis (level 5)
docker compose exec app vendor/bin/phpstan analyse

# Run with verbose output
docker compose exec app vendor/bin/phpstan analyse --verbose
```

PHPStan configuration is in `phpstan.neon`.

---

## Running Laravel Pint

```bash
# Check code style (test mode — no changes)
docker compose exec app vendor/bin/pint --test

# Auto-fix code style issues
docker compose exec app vendor/bin/pint
```

---

## Test Organisation

```
tests/
├── Feature/        # HTTP-level tests (controllers, routes, policies)
├── Property/       # Property-style tests for critical business rules
└── Unit/           # Unit tests for service classes and helpers
```

---

## Testing Approach

### Unit Tests

Each service class has unit tests covering:
- Happy path for each operation
- Validation rejection for invalid inputs
- Business rule enforcement (delayed flag, overdue flag, progress calculation)
- Authorization policy enforcement

### Feature Tests

Feature tests cover the full HTTP request/response cycle:
- Key endpoints return correct responses
- Role-based access (Admin vs Engagement_Lead vs Engagement_Officer)
- Search and filter correctness
- Audit history recording
- Document link handling

### Property-Style Tests

Property-style tests are used for selected critical business rules where input variation meaningfully increases confidence:

| Test | Business Rule |
|---|---|
| `DelayedFlagPropertyTest` | Delayed flag correctness (P4) |
| `MonthEndTargetPropertyTest` | Month-end target date (P5) — covered by unit tests |
| `FollowUpOverduePropertyTest` | Overdue follow-up logic (P6) |
| `DashboardSummaryPropertyTest` | Dashboard summary count consistency (P12) |

Iteration count is practical and configurable — not hardcoded.

---

## Database in Tests

Tests use **SQLite in-memory** by default (configured in `phpunit.xml`). This keeps tests fast and isolated.

The CI pipeline runs migrations against a real MySQL service container to validate that migrations work correctly.

---

> This document will be expanded with test examples and coverage guidance during implementation.
