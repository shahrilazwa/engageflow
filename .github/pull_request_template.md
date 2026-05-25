## Summary

Describe what this PR changes and why.

## Related Issue

Closes #

## What Changed

List the files created or modified and briefly explain each change:

-
-

## Verification

Describe how this was tested or verified:

- [ ] `docker compose exec app php artisan test` passes
- [ ] `docker compose exec app vendor/bin/phpstan analyse` passes
- [ ] `docker compose exec app vendor/bin/pint --test` passes
- [ ] `docker compose exec node npm run typecheck` passes
- [ ] `docker compose exec node npm run build` passes
- [ ] Manual smoke test performed, if applicable

## UI / Design Review

Complete this section for PRs that create or change user-facing pages:

- [ ] MYDS alignment reviewed
- [ ] Responsive layout reviewed
- [ ] Empty, error, loading, disabled, and success states reviewed
- [ ] No Jata Negara or official crest artwork appears
- [ ] Not applicable for this PR

## Guardrails

Confirm the following guardrails are respected:

- [ ] No direct commits to `main`; this is a PR from a feature branch
- [ ] No Blade UI screens added except `resources/views/app.blade.php`
- [ ] No Redis, Mailpit, or queue jobs added unless required by a v1 task
- [ ] No microservices, mobile app, Google Drive API, notification system, or file upload added
- [ ] No host-machine PHP, Composer, Node, npm, or PostgreSQL dependency is required
- [ ] No unrelated files changed

## Notes

Add any assumptions, limitations, screenshots, or follow-up items.
