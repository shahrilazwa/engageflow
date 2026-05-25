# EngageFlow

EngageFlow is a Laravel + Inertia React application for visually designing Project workflows and tracking work against those workflows.

The project is planned as a Laravel modular monolith with an Inertia.js + React + TypeScript frontend, MYDS as the primary design system, React Flow for visual workflow building, PostgreSQL JSONB workflow storage, Docker Compose, automated tests, and GitHub Actions CI.

## Quick Start

> **Host machine requirements:** Docker Desktop and Git only. PHP, Composer, Node, npm, and PostgreSQL do not need to be installed locally.

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

# 5. Install frontend dependencies inside the node container
docker compose run --rm node npm ci

# 6. Start all services (force-recreate app so it picks up the new APP_KEY)
docker compose up -d --force-recreate app node

# 7. Run database migrations
docker compose exec app php artisan migrate

# 8. Open the app
# http://localhost:8000
```

`APP_KEY` is read by Laravel from the mounted `.env` file. Generate it before opening the app in the browser.



## Current Status

MVP 0 implementation is in progress. Implementation continues task by task following `.kiro/specs/engageflow-tracker/tasks.md`.

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

The GitHub Actions CI pipeline runs on every pull request in staged jobs:

- Stage 1 - Install and cache
- Stage 2 - Code style
- Stage 3 - Static analysis
- Stage 4 - Backend unit tests
- Stage 5 - Database and feature tests
- Stage 6 - Frontend build and contracts

Local verification runs the same checks inside Docker Compose:

- `docker compose exec app vendor/bin/pint --test`
- `docker compose exec app vendor/bin/phpstan analyse`
- `docker compose exec app php artisan test`
- `docker compose exec node npm run typecheck`
- `docker compose exec node npm run build`

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
| `MVP 0 Foundation` | Auth, PostgreSQL, app shell, Project CRUD, owner-only policies |
| `MVP 1 Workflow Builder Core` | React Flow-backed visual workflow builder and JSONB save/load |
| `MVP 2 Task Snapshot Loop` | Task creation from workflow snapshots and step progress |
| `MVP 3 Minimal Project Dashboard` | Project-scoped dashboard, progress, delayed status, search/filter basics |
| `MVP 4 Deliverables and Document Links` | Expected outputs and external links |
| `MVP 5 Follow-Ups and History` | Follow-up actions, overdue items, audit history |

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
6. v1 Deliverables and Document Links
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
- ✅ Require status checks to pass for the required GitHub Actions stages
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings
- Avoid requiring third-party app checks unless the team intentionally depends on them for every PR

## Planned Stack

- PHP 8.4 minimum
- Laravel latest stable compatible with PHP 8.4
- Inertia.js + React + TypeScript
- Tailwind CSS
- MYDS as the primary UI system
- FontAwesome icons
- PostgreSQL
- React Flow / `@xyflow/react`
- PestPHP
- GitHub Actions CI
- Docker Compose container-first local development

## Documentation

Project documentation lives in the `docs/` directory.

| File | Contents |
|---|---|
| [docs/project-brief.md](docs/project-brief.md) | Product summary, core model, dashboard scope, and explicit v1 non-goals |
| [docs/architecture.md](docs/architecture.md) | Architecture overview, target stack, app areas, backend/frontend boundaries |
| [docs/setup.md](docs/setup.md) | Container-first setup guide, Docker Compose quick start, useful commands |
| [docs/project-structure.md](docs/project-structure.md) | Directory layout, backend organization, frontend structure, lego-style component guidance |
| [docs/workflow-status.md](docs/workflow-status.md) | Project workflow definitions, Task workflow snapshots, status values, progress, delayed logic |
| [docs/workflow-builder.md](docs/workflow-builder.md) | Visual Workflow Builder scope, components, persistence, and review notes |
| [docs/deliverables.md](docs/deliverables.md) | Task Deliverable scope, relationship to Tasks, document links, and review notes |
| [docs/testing.md](docs/testing.md) | How to run tests, PHPStan, Pint; test organisation; property-style tests |
| [docs/ci.md](docs/ci.md) | GitHub Actions CI pipeline steps, PostgreSQL service, branch strategy, branch protection |
| [docs/user-guide.md](docs/user-guide.md) | User guide skeleton for Projects, workflow builder, Tasks, deliverables, links, follow-ups, dashboard, and history |
| [docs/troubleshooting.md](docs/troubleshooting.md) | Common Docker, Composer, migration, and permission issues |
