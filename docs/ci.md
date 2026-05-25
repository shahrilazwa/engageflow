# CI Guide

This document explains the GitHub Actions CI pipeline for EngageFlow.

---

## Overview

CI runs automatically on every pull request and on every push to `main`. PRs should not be merged if required CI checks fail.

The workflow file is `.github/workflows/ci.yml`.

---

## Required Pipeline Stages

| Stage | Job name | Purpose |
|---|---|---|
| Stage 1 | Install and cache | Check out the repository, set up PHP and Node, cache Composer/npm package downloads, and install dependencies |
| Stage 2 | Code style | Run Laravel Pint; frontend formatter or linter can be added here once configured |
| Stage 3 | Static analysis | Run PHPStan/Larastan and TypeScript checks |
| Stage 4 | Backend unit tests | Run the Pest unit test suite |
| Stage 5 | Database and feature tests | Start PostgreSQL, run migrations, and run database-backed Pest feature tests |
| Stage 6 | Frontend build and contracts | Run TypeScript checks and Vite production build for Inertia/React/React Flow contracts |

Stages 1-6 are required for normal pull requests.

---

## Optional Future Stages

| Stage | Trigger | Purpose |
|---|---|---|
| Stage 7 - Browser or visual smoke tests | High-risk user-facing page changes | Run browser smoke tests, screenshots, or visual checks for critical flows |
| Stage 8 - Seed and release smoke checks | `main`, release branches, or scheduled runs | Run seeders and release-oriented smoke checks against production-like setup |

Stage 7 and Stage 8 are documented now but not enabled yet. Add them only when the corresponding tools and review workflow exist.

---

## PostgreSQL Service Container

Stage 5 uses a PostgreSQL 17 service container. The service is configured with a health check so migrations and feature tests run only after PostgreSQL is ready.

Feature tests use PostgreSQL for database-backed behavior. Unit tests should avoid database work where practical.

---

## CI Environment File

`.env.ci` is committed to the repository and copied to `.env` in test jobs. It contains:

- PostgreSQL connection details matching the GitHub Actions service container
- `APP_ENV=testing`
- Array drivers for session, cache, and mail
- No external service requirements

---

## Pull Request Expectations

The pull request template requires authors to state which CI stages apply to the PR. For most implementation PRs, Stages 1-6 apply.

For user-facing page changes, the PR template also requires a UI/design review checklist covering MYDS alignment, responsive behavior, state coverage, and confirmation that no Jata Negara or official crest artwork appears.

---

## Branch Protection

Configure the `main` branch ruleset in GitHub Settings:

- Require a pull request before merging
- Require branches to be up to date before merging
- Require required GitHub Actions status checks to pass
- Require conversation resolution before merging
- Do not allow direct commits to `main`

Avoid making third-party app checks required unless the team intentionally depends on that app for every PR.
