# Dependency disposition - 7 October 2026

The launch-remediation branch upgrades the locked production framework to Next 16.4.0, React/React DOM 19.3.0 and current Supabase client/SSR packages, and refreshes vulnerable compatible transitive packages. The release check must rerun `npm audit --omit=dev` for its final lockfile; no historical count is a guarantee for future registry advisories.

## Remaining development-only advisory

The complete development graph still contains `braces` through Next's ESLint plugin -> fast-glob -> micromatch. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) reports stack exhaustion from deeply nested brace patterns and has no patched version at this review date. npm reports the dependency chain as multiple affected package entries, not separate public application paths.

No application runtime path imports this lint dependency. The reachable use is developer/CI lint processing, with project-controlled glob patterns; no public query or review text is passed to it. CI has read-only permissions, no production credentials and a 20-minute job cap. A malicious repository change can still affect a tooling process, so this is a documented residual tooling risk, not a claim of zero risk.

Do not use `npm audit fix --force` to downgrade `eslint-config-next` to Next 14's tooling. Keep the Next 16 configuration aligned and monitor the upstream patched dependency. ESLint is intentionally kept at the newest 9.x version accepted by Next's bundled React/import/accessibility plugins; those packages' peer ranges do not yet accept ESLint 10. Revisit the major upgrade when the full plugin chain supports it.

Production CI fails on high/critical production-graph advisories. Review the full audit separately rather than silently suppressing or misrepresenting this development-only exception.
