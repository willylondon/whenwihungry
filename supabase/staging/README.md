# Disposable staging only

Verified project: `ctmzxgkccxkgeuzntltc` (`whenwihungry-staging`), Free organization `zyytphxrczmfjprmzbcm`. Production is `dnlzaduonznhhlmyxrgh`. Never run this baseline or seed on production.

`observed-baseline.sql` is a schema-only export of the production structure on October 7. It includes intentionally unsafe observed grants/policies so isolated tests can reproduce and verify the fixes. Do not expose an intermediate baseline to clients: apply it and the three October 7 migrations together in one transaction, after stripping their nested transaction wrappers. The hosted staging setup already completed this sequence, followed by the search-path/helper revocations from the final baseline migration. Do not reapply it there.

The setup used the dashboard SQL editor, not CLI migration application. Its schema is verified, but the CLI migration history was not fabricated. Reconcile history with inspected schema before any future CLI migration deployment.

`hosted-permission-checks.sql` runs 20 assertions under actual hosted roles and auth helpers with synthetic JWT claims. All temporary users, requests and reviews roll back. Run only on this empty disposable test environment: the test intentionally selects all request/review rows, so existing synthetic rows can affect assertions. It is not proof of Auth-issued JWT, PostgREST or browser behavior.

`synthetic-catalog.sql` inserts 55 fictional Jamaican food spots and one overseas exclusion fixture. It is idempotent by fixed UUID and does not create reviews, ratings, customer contacts or messages. Staging now has these 56 records.

Enquiry intake stays disabled. Any test enablement needs verified private readback, abuse protection and named monitoring. Use only owner-controlled test mailboxes; never clone production customer data. Rollback: remove staging Preview variable bindings; keep intake disabled; delete the disposable project only after owner confirmation.
