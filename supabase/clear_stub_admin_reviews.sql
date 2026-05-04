-- WHENWIHUNGRY: clear stub admin_reviews rows
-- A "stub" is a row where verdict is set but there is no actual review content
-- (no honest_take and no headline). These were causing unreviewed places to
-- appear as critic-reviewed in the UI.
-- Safe to run multiple times.

UPDATE public.admin_reviews
SET verdict = NULL
WHERE verdict IS NOT NULL
  AND (honest_take IS NULL OR trim(honest_take) = '')
  AND (headline IS NULL OR trim(headline) = '');
