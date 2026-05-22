# CI Guide

> **Status:** Skeleton — detailed content will be expanded as implementation progresses.

This document explains the GitHub Actions CI pipeline for EngageFlow.

---

## Overview

CI runs automatically on every pull request and on every push to `main`. **PRs cannot be merged if any CI check fails.**

The workflow file is at `.github/workflows/ci.yml`.

---

## CI Pipeline Steps

| Step | Command | Purpose |
|---|---|---|
| Checkout code | `actions/checkout@v4` | Get the source code |
| Set up PHP 8.4 | `shivammathur/setup-php@v2` | Install PHP with required extensions |
| Cache Composer | `actions/cache@v4` | Speed up dependency installation |
| Install dependencies | `composer install` | Install PHP packages |
| Copy env file | `cp .env.ci .env` | Set up CI environment |
| Generate app key | `php artisan key:generate` | Set APP_KEY |
| Run migrations | `php artisan migrate --force` | Validate migrations against MySQL |
| Run tests | `php artisan test --no-coverage` | Run the full test suite |
| PHPStan | `vendor/bin/phpstan analyse --no-progress` | Static analysis at level 5 |
| Laravel Pint | `vendor/bin/pint --test` | Code style check |

---

## MySQL Service Container

CI uses a MySQL 8 service container for the migration step. The service is configured with a health check so the migration step waits until MySQL is ready.

Tests themselves use SQLite in-memory (via `phpunit.xml` env overrides) for speed.

---

## CI Environment File

The `.env.ci` file is committed to the repository and used by CI instead of `.env`. It contains:
- MySQL connection details matching the GitHub Actions service container
- `APP_ENV=testing`
- Array drivers for session, cache, and mail (no external services needed)

---

## PHPStan Configuration

PHPStan is configured in `phpstan.neon`:
- Level 5 (practical for early development — can be raised later)
- Uses `nunomaduro/larastan` extension for Laravel-aware type inference
- Analyses the `app/` directory

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `feature/task-N-*` | Feature implementation |
| `fix/*` | Bug fixes |

PRs require at least one reviewer approval before merge.

---

## Branch Protection for `main`

The following branch protection rules should be configured in GitHub Settings:

- Require pull request before merging
- Require CI status checks to pass (the `test` job)
- Require branch to be up to date before merging
- Require conversation resolution before merging
- Do not allow direct commits to `main`

See [docs/setup.md](setup.md) for the full setup guide.

---

> This document will be expanded with troubleshooting tips for common CI failures during implementation.
