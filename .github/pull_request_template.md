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

- [ ] `php artisan test` passes
- [ ] `vendor/bin/phpstan analyse` passes (level 5)
- [ ] `vendor/bin/pint --test` passes
- [ ] Manual smoke test performed (describe below if applicable)

## Guardrails

Confirm the following guardrails are respected:

- [ ] No direct commits to `main` — this is a PR from a feature branch
- [ ] No Blade UI screens added except `resources/views/app.blade.php`
- [ ] No Redis, Mailpit, or queue jobs added unless required by a v1 task
- [ ] No microservices, mobile app, Google Drive API, or notification system added
- [ ] No unrelated files changed

## Notes

Add any assumptions, limitations, screenshots, or follow-up items.
