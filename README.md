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



Project planning is in progress. Implementation should follow `requirements.md`, `design.md`, and `tasks.md` once those files are added to the repository.

## Development Workflow

This project uses GitHub for source control and project management.

### Branching

- `main` is the production-ready branch.
- Do not commit directly to `main`.
- Use feature branches for implementation work.
- Suggested branch naming:
  - `feature/task-1-docker-compose`
  - `feature/task-2-ci-pipeline`
  - `fix/<short-description>`

### Pull Requests

- Open a pull request for each task where practical.
- Link the related GitHub Issue in the PR description.
- Ensure CI passes before merging.
- Keep PRs small and reviewable.

### Issues

GitHub Issues should be used to track:

- features
- bugs
- documentation work
- tests
- CI/setup work
- refactors
- technical improvements

Suggested labels:

- `feature`
- `bug`
- `documentation`
- `test`
- `refactor`
- `ci`
- `setup`
- `frontend`
- `backend`
- `design`

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
