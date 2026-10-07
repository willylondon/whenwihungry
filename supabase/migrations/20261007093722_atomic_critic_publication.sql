-- DRAFT FOR PRODUCTION: verified on disposable staging ctmzxgkccxkgeuzntltc only.
-- Requires verified existing restaurants/admin_reviews schema, admin RLS/grants,
-- and protected profiles.role. No existing table policies or rows are replaced.
BEGIN;
CREATE FUNCTION public.publish_critic_review(
  p_restaurant_id uuid,
  p_verdict text,
  p_admin_score integer,
  p_headline text,
  p_honest_take text,
  p_visit_date date
) RETURNS TABLE (review_id uuid, changed boolean)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_review_id uuid;
  v_review_count integer;
  v_existing record;
  v_status text;
  v_updated_status text;
  v_changed boolean;
BEGIN
  IF auth.uid() IS NULL
     OR COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
     OR NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;
  IF p_restaurant_id IS NULL OR p_verdict IS NULL
     OR p_verdict NOT IN ('RUN_GO_GET_IT', 'WORTH_IT', 'MID', 'SAVE_YOUR_MONEY')
     OR p_admin_score IS NULL OR p_admin_score NOT BETWEEN 0 AND 100
     OR p_headline IS NULL OR char_length(btrim(p_headline)) NOT BETWEEN 5 AND 200
     OR p_honest_take IS NULL OR char_length(btrim(p_honest_take)) NOT BETWEEN 30 AND 10000
     OR p_visit_date IS NULL OR p_visit_date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Invalid critic review' USING ERRCODE = '22023';
  END IF;

  -- A restaurant lock serializes this function's competing first publications.
  SELECT r.review_status INTO v_status FROM public.restaurants r
    WHERE r.id = p_restaurant_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Restaurant missing or not writable' USING ERRCODE = '42501';
  END IF;
  SELECT count(*) INTO v_review_count FROM public.admin_reviews ar WHERE ar.restaurant_id = p_restaurant_id;
  IF v_review_count > 1 THEN
    RAISE EXCEPTION 'Duplicate critic reviews require manual resolution' USING ERRCODE = '21000';
  END IF;
  SELECT ar.id, ar.verdict, ar.admin_score, ar.headline, ar.honest_take, ar.visit_date
    INTO v_existing FROM public.admin_reviews ar WHERE ar.restaurant_id = p_restaurant_id FOR UPDATE;
  v_changed := NOT FOUND;
  IF NOT v_changed THEN
    v_review_id := v_existing.id;
    v_changed := v_existing.verdict IS DISTINCT FROM p_verdict
      OR v_existing.admin_score IS DISTINCT FROM p_admin_score
      OR v_existing.headline IS DISTINCT FROM btrim(p_headline)
      OR v_existing.honest_take IS DISTINCT FROM btrim(p_honest_take)
      OR v_existing.visit_date IS DISTINCT FROM p_visit_date;
    IF v_changed THEN
      UPDATE public.admin_reviews ar SET verdict = p_verdict, admin_score = p_admin_score,
        headline = btrim(p_headline), honest_take = btrim(p_honest_take), visit_date = p_visit_date
        WHERE ar.id = v_review_id AND ar.restaurant_id = p_restaurant_id
        RETURNING ar.id INTO v_review_id;
      IF NOT FOUND THEN RAISE EXCEPTION 'Review update denied' USING ERRCODE = '42501'; END IF;
    END IF;
  ELSE
    INSERT INTO public.admin_reviews(id, restaurant_id, verdict, admin_score, headline, honest_take, visit_date)
      VALUES(p_restaurant_id, p_restaurant_id, p_verdict, p_admin_score, btrim(p_headline), btrim(p_honest_take), p_visit_date)
      RETURNING id INTO v_review_id;
  END IF;

  IF v_status IS DISTINCT FROM 'reviewed' THEN
    UPDATE public.restaurants r SET review_status = 'reviewed' WHERE r.id = p_restaurant_id
      RETURNING r.review_status INTO v_updated_status;
    IF NOT FOUND OR v_updated_status IS DISTINCT FROM 'reviewed' THEN
      RAISE EXCEPTION 'Public review status update denied' USING ERRCODE = '42501';
    END IF;
  END IF;
  -- All failures above abort the transaction: new content can never leak on partial success.
  -- No reviewed_at/created_at date rewrite or restaurant_id unique constraint is assumed.
  RETURN QUERY SELECT v_review_id, v_changed OR v_status IS DISTINCT FROM 'reviewed';
END;
$$;
REVOKE ALL ON FUNCTION public.publish_critic_review(uuid, text, integer, text, text, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.publish_critic_review(uuid, text, integer, text, text, date) TO authenticated;
COMMIT;
