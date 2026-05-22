# EngageFlow

EngageFlow is an internal GovTech Malaysia engagement tracker for monitoring the progress and status of ministry/agency-owned digital services being onboarded into MyGOV.

The project is planned as a Laravel modular monolith with an Inertia.js + React frontend, MYDS as the primary design system where practical, FontAwesome icons, MySQL, Docker Compose, automated tests, and GitHub Actions CI.

## Quick Start

> **Host machine requirements:** Docker Desktop and Git only. PHP, Composer, and Node do not need to be installed locally.

```bash
# 1. Clone the repository
git clone https://github.com/shahrilazwa/engageflow.git
cd engageflow

# 2. Copy the environment file
cp .env.example .env

# 3. Start the database first so the app container can connect
docker compose up -d db

# 4. Generate APP_KEY — this writes the key into .env on the host
docker compose run --rm app php artisan key:generate

# 5. Start all services (force-recreate app so it picks up the new APP_KEY)
docker compose up -d --force-recreate app node

# 6. Run database migrations
docker compose exec app php artisan migrate

# 7. Open the app
# http://localhost:8000
```

> **Why the force-recreate step?**
> `APP_KEY` is passed into the `app` container as an environment variable at startup.
> If you generate the key after the container is already running, the container will not see the new value until it is recreated.
> Running `docker compose up -d --force-recreate app` restarts only the app container with the updated key.



## Current Status

Task 1 (Docker Compose setup) and Task 2 (GitHub Actions CI) are complete and merged into `main`. Implementation continues task by task following `tasks.md`.

## Development Workflow

This project uses GitHub for source control and project management. All implementation work flows through feature branches and pull requests — no direct commits to `main`.

### Branching

- `main` is the production-ready branch. **Do not commit directly to `main`.**
- Create a feature branch for every task or fix:
  - `feature/task-N-short-description` for implementation tasks
  - `fix/short-description` for bug fixes
- Branch off `main` and keep branches focused on one task.

### Pull Requests

1. Push your feature branch to GitHub.
2. Open a pull request targeting `main`.
3. Reference the related GitHub Issue using `Closes #N` in the PR description — this auto-closes the issue when the PR is merged.
4. Fill in the PR template (`.github/pull_request_template.md`).
5. Ensure all CI checks pass before requesting review.
6. Get at least one reviewer approval before merging.
7. Keep PRs small and reviewable — one task per PR where practical.

### Issue References

Use `Closes #N` in the PR description to link and auto-close the related issue on merge:

```
## Related Issue

Closes #5
```

### CI Must Pass Before Merge

The GitHub Actions CI pipeline runs on every pull request. It checks:

- `php artisan test` — automated test suite
- `vendor/bin/phpstan analyse` — static analysis at level 5
- `vendor/bin/pint --test` — code style

**PRs cannot be merged if any CI check fails.**

### Branch Protection

The `main` branch is protected. The following rules apply:

- Pull request required before merging (no direct pushes)
- All CI status checks must pass
- Branch must be up to date with `main` before merging
- All PR conversations must be resolved before merging

### Issues

Use GitHub Issues to track all work. Create an issue for every task before starting implementation. Use the issue template (`.github/ISSUE_TEMPLATE/feature.md`).

Track these types of work as issues:

| Type | Label |
|---|---|
| New functionality | `feature` |
| Something broken | `bug` |
| Docs tasks | `documentation` |
| Test tasks | `test` |
| Code cleanup | `refactor` |
| CI/CD tasks | `ci` |
| Project setup | `setup` |
| Frontend work | `frontend` |
| Backend work | `backend` |
| UI/UX design | `design` |

### Milestones

Issues are grouped into milestones by delivery phase:

| Milestone | Scope |
|---|---|
| `v1 Foundation` | Project setup, Docker, CI, auth, base structure |
| `v1 Core Tracking` | Agency owners, services, workflow stages |
| `v1 Workflow Tracking` | Stage status, active stage, delayed flag, progress % |
| `v1 Dashboard and Graphical Progress` | Dashboard UI, workflow timeline, summary cards |
| `v1 Follow-Up and Document Links` | Follow-up actions, document links |
| `v1 Special Projects` | Special project tracking |
| `v1 Audit and History` | Audit trail, history views |
| `v1 Search and Filter` | Search and filter on dashboard |
| `v1 Documentation` | All docs/ files |
| `v1 Testing and Quality` | Property-style tests, PHPStan, Pint pass |
| `v1 Polish and Review` | Seeder review, issue hygiene, final checks |

### Project Board

The GitHub Project board tracks issue status across columns:

- **Backlog** — not yet started
- **Ready** — ready to pick up
- **In Progress** — being worked on
- **Review** — in pull request review
- **Done** — merged and closed

### Manual GitHub UI Setup Required

The following must be configured manually in the GitHub repository settings and UI. They cannot be automated through repository files alone.

#### Labels

Create these labels in **GitHub → Issues → Labels**:

| Label | Suggested colour |
|---|---|
| `feature` | `#0075ca` (blue) |
| `bug` | `#d73a4a` (red) |
| `documentation` | `#0075ca` (blue) |
| `test` | `#e4e669` (yellow) |
| `refactor` | `#cfd3d7` (grey) |
| `ci` | `#e99695` (pink) |
| `setup` | `#f9d0c4` (light orange) |
| `frontend` | `#bfd4f2` (light blue) |
| `backend` | `#d4c5f9` (light purple) |
| `design` | `#fef2c0` (light yellow) |

#### Milestones

Create these milestones in **GitHub → Issues → Milestones**:

1. v1 Foundation
2. v1 Core Tracking
3. v1 Workflow Tracking
4. v1 Dashboard and Graphical Progress
5. v1 Follow-Up and Document Links
6. v1 Special Projects
7. v1 Audit and History
8. v1 Search and Filter
9. v1 Documentation
10. v1 Testing and Quality
11. v1 Polish and Review

#### Project Board

Create a project board in **GitHub → Projects** with these columns:

- Backlog
- Ready
- In Progress
- Review
- Done

#### Branch Protection for `main`

Configure in **GitHub → Settings → Branches → Add branch ruleset** for `main`:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass (add the `test` CI job)
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings

## Planned Stack

- PHP 8.4 minimum
- Laravel latest stable compatible with PHP 8.4
- Inertia.js + React
- Tailwind CSS
- MYDS where practical
- FontAwesome icons
- MySQL 8
- PestPHP
- GitHub Actions CI
- Docker Compose container-first local development

## Documentation

Detailed documentation will be added under `docs/` during implementation.

Planned documentation files:

- `docs/architecture.md`
- `docs/setup.md`
- `docs/project-structure.md`
- `docs/workflow-status.md`
- `docs/testing.md`
- `docs/ci.md`
- `docs/user-guide.md`
- `docs/troubleshooting.md`
