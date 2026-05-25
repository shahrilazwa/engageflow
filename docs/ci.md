# CI Guide

> **Status:** Skeleton — detailed content will be expanded as implementation progresses.

This document explains the GitHub Actions CI pipeline for EngageFlow.

---

## Overview

CI runs automatically on every pull request and on every push to `main`. **PRs cannot be merged if any CI check fails.**

The workflow file is at `.github/workflows/ci.yml`.

---

## CI Pipeline Stages

| Stage | Purpose |
|---|---|
| Stage 1 - Install and cache | Install Composer and npm dependencies |
| Stage 2 - Code style | Run Laravel Pint |
| Stage 3 - Static analysis | Run PHPStan/Larastan and TypeScript checks |
| Stage 4 - Backend unit tests | Run Pest unit tests |
| Stage 5 - Database and feature tests | Run PostgreSQL migrations and Pest feature tests |
| Stage 6 - Frontend build and contracts | Run TypeScript and Vite build |

---

## PostgreSQL Service Container

CI uses a PostgreSQL service container for the migration and feature-test stage. The service is configured with a health check so the migration step waits until PostgreSQL is ready.

Unit tests should stay fast and avoid database work where practical. Feature tests use the PostgreSQL service when persistence behavior matters.

---

## CI Environment File

The `.env.ci` file is committed to the repository and used by CI instead of `.env`. It contains:
- PostgreSQL connection details matching the GitHub Actions service container
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
- Require CI status checks to pass
- Require branch to be up to date before merging
- Require conversation resolution before merging
- Do not allow direct commits to `main`

See [docs/setup.md](setup.md) for the full setup guide.

---

> This document will be expanded with troubleshooting tips for common CI failures during implementation.
