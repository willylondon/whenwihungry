# WhenWiHungry

Jamaican restaurant discovery, independent critic reviews, and moderated community contributions.

## Development

Use Node 24 (see `.nvmrc`) and npm 11.9.0. Install the locked dependencies:

```sh
npm ci --ignore-scripts
cp .env.example .env.local
```

Set an explicit **development/staging** Supabase URL and publishable/anon key in `.env.local`. Do not use a production project for development or tests. The app deliberately fails if either value is absent; there is no shared-project fallback. A publishable/anon key is public and does not replace RLS. Never commit service-role keys or passwords.

```sh
npm run dev
```

`NEXT_PUBLIC_SITE_URL` selects the site's canonical/auth-return origin. Keep the Vercel hostname until the owned custom domain is actually configured and its redirects/TLS have been verified.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run test:db
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:9 \
NEXT_PUBLIC_SUPABASE_ANON_KEY=isolated-build-placeholder \
NEXT_PUBLIC_SITE_URL=https://whenwihungry.invalid \
NEXT_TELEMETRY_DISABLED=1 npm run build
npm audit --omit=dev --audit-level=high
```

`npm run check` runs lint, full TypeScript checks, unit/component tests, isolated PostgreSQL/RLS tests, then the production build. Supply explicit isolated environment values as above before invoking it. Test configuration uses localhost placeholders. They are intentionally not a working database: passing unit tests or a build does not validate deployed permissions or persistence. No production credentials are needed by CI.

Production-quality changes need the staging integration and release gates in [the launch runbook](docs/launch-runbook.md), including a real nonproduction database. Do not apply historic SQL patches or migrations to production simply because the app builds.

## Data tools

`npm run data:audit` and `npm run data:audit:descriptions` use a locked local `tsx` runner. Read any maintenance script before running it: some historic scripts mutate data. Never run a fix script against production without an approved target, dry run, exact affected-row review and read-back verification.

## Release scope

This repository includes source fixes and draft database work for review. Database policy verification, schema changes, domain mapping, data corrections, provider configuration, and actual production deployment are separate operational steps requiring explicit authorization. See [deployment notes](DEPLOYMENT_NOTES.md) and the launch runbook before promotion.

The production build explicitly selects Next's supported webpack compiler, verified in the isolated environment. The default Turbopack production attempt was cancelled during compilation by the executor and was not treated as a code/build pass.
