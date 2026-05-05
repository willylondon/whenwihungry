# Place Quality Audit Report

**Generated**: 2026-05-05T21:54:54.243Z

## Summary

| Metric | Count |
|--------|-------|
| Total records | 463 |
| Already classified as not_food | 0 |
| Already rejected | 0 |
| Already needs_review | 0 |
| Newly flagged by this audit | 2 |

## Newly Flagged Records

Run `scripts/fix-place-data-quality.ts --apply` to apply these changes to Supabase.

| Slug | Name | Parish | Category | Current business_type | Current data_quality_status | Reason | Suggested Action |
|------|------|--------|----------|-----------------------|-----------------------------|--------|------------------|
| coronation-market-jamaica | Coronation Market Jamaica | Kingston | Restaurant | — | — | General produce market — not a food service business | `mark_not_food` |
| lennys-cooking-gas | Lenny's Cooking Gas | Kingston | Restaurant | — | — | Gas/fuel supplier — not a food business | `mark_not_food` |
