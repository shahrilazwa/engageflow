# Troubleshooting

> **Status:** Skeleton — additional issues and solutions will be added as they are encountered during development.

This document covers common issues encountered when setting up and running EngageFlow locally.

---

## Docker Issues

### `docker compose up -d` fails to start

**Check:** Is Docker Desktop running?

```bash
docker info
```

If Docker is not running, start Docker Desktop and try again.

---

### Port 8000 or 3306 already in use

Another process is using the port. Find and stop it, or change the port mapping in `docker-compose.yml`.

```bash
# Find what is using port 8000 (Windows)
netstat -ano | findstr :8000

# Find what is using port 8000 (macOS/Linux)
lsof -i :8000
```

---

### App container exits immediately after starting

Check the container logs:

```bash
docker compose logs app
```

Common causes:
- Missing or empty `APP_KEY` in `.env` — run `docker compose run --rm app php artisan key:generate`
- Permission error on `storage/` — the entrypoint script sets permissions automatically, but check if the volume mount is correct

---

### `php artisan key:generate` does not update `.env`

Make sure you are running the command with `docker compose run --rm app`, not `docker compose exec app`. The `run` command starts a fresh container that can write to the mounted `.env` file.

---

## Composer Issues

### `composer install` fails inside the container

```bash
docker compose exec app composer install --no-interaction
```

If it fails with a memory error, increase PHP memory limit:

```bash
docker compose exec app php -d memory_limit=-1 /usr/bin/composer install
```

---

### `vendor/autoload.php` not found

Run `composer install` inside the container:

```bash
docker compose exec app composer install
```

---

## Migration Issues

### `SQLSTATE[HY000] [2002] Connection refused`

The database container is not ready yet. Wait a few seconds and try again, or check that the `db` container is healthy:

```bash
docker compose ps
```

The `db` container should show `(healthy)` in the status column.

---

### `Table already exists` error during migration

The database already has tables from a previous run. Either:

```bash
# Reset and re-run all migrations (destroys all data)
docker compose exec app php artisan migrate:fresh

# Or just run pending migrations
docker compose exec app php artisan migrate
```

---

## npm / Frontend Issues

### `npm run build` fails

> _Frontend build is not yet configured. This section will be updated when Inertia + React setup is complete._

---

## Permission Issues (Linux / macOS)

If you see permission errors on `storage/` or `bootstrap/cache/`:

```bash
docker compose exec app chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
docker compose exec app chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
```

---

## `.env` Misconfiguration

If the app shows a 500 error, check the Laravel log:

```bash
docker compose exec app tail -50 /var/www/html/storage/logs/laravel.log
```

Common `.env` issues:
- `APP_KEY` is empty — run `docker compose run --rm app php artisan key:generate`
- `DB_HOST` is not `db` — it must match the Docker Compose service name
- `DB_PASSWORD` does not match `MYSQL_PASSWORD` in `docker-compose.yml`

---

> Additional troubleshooting entries will be added as issues are encountered during development.
