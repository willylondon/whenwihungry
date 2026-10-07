# Launch gates still requiring operational evidence

- Export/reconcile the actual database schema, RLS, grants, role-assignment logic and existing constraints. Production policy/schema verification remains pending.
- Review and test any new migration in an isolated staging project. Production application is a separately approved action.
- Complete authenticated staging signup/confirmation/recovery, inquiry receipt, listing/review moderation and direct-API permission tests.
- Confirm real critic content/video, imported country/location correctness and any quarantined records with the owner; do not invent facts or publish unreviewed verdicts.
- Map the already-owned domain to Vercel and verify DNS/TLS/redirects under separate authorization.
- Verify backups/restore, monitoring, capacity, privacy/retention and moderation/contact ownership.

Source-level checks and their exact outcomes belong in the draft PR and launch runbook. A build pass alone does not close these gates.
