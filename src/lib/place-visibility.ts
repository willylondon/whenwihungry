/**
 * Place visibility predicates.
 *
 * Single source of truth for whether a record should appear on public routes.
 * These are client-side predicates applied to data already fetched from Supabase.
 *
 * NOTE: data_quality_status and business_type columns were added to the
 * restaurants table and seeded via scripts/fix-place-data-quality.ts --apply.
 */

type VisibilityPlace = {
  status?: string | null;
  data_quality_status?: string | null;
  dataQualityStatus?: string | null;
  business_type?: string | null;
  businessType?: string | null;
  manually_verified?: boolean | null;
  manuallyVerified?: boolean | null;
};

function getDataQualityStatus(place: VisibilityPlace): string | null {
  return place.data_quality_status ?? place.dataQualityStatus ?? null;
}

function getBusinessType(place: VisibilityPlace): string | null {
  return place.business_type ?? place.businessType ?? null;
}

function isManuallyVerified(place: VisibilityPlace): boolean {
  return Boolean(place.manually_verified ?? place.manuallyVerified);
}

/**
 * Returns true if the record is a confirmed public food spot.
 * Used as the baseline filter for browse, search, and count queries.
 *
 * Rules:
 * - status must be 'approved'
 * - data_quality_status must not be 'rejected'
 * - business_type must not be 'not_food'
 */
export function isPublicFoodSpot(place: VisibilityPlace): boolean {
  if (place.status !== "approved") return false;
  if (getDataQualityStatus(place) === "rejected") return false;
  if (getBusinessType(place) === "not_food") return false;
  return true;
}

/**
 * Returns true if the record is safe to show on the main browse and search pages.
 * Slightly more permissive than parish pages — shows 'needs_review' records unless rejected.
 */
export function isSafeForBrowse(place: VisibilityPlace): boolean {
  return isPublicFoodSpot(place);
}

/**
 * Returns true if the record is safe to show on parish-specific pages.
 * More strict: excludes 'needs_review' records unless manually verified.
 */
export function isSafeForParishPage(place: VisibilityPlace): boolean {
  if (!isPublicFoodSpot(place)) return false;
  const dqs = getDataQualityStatus(place);
  if (dqs === "needs_review" && !isManuallyVerified(place)) return false;
  return true;
}

/**
 * Returns true if the record has been reviewed (TikTok or critic verdict).
 * Used for /reviews route filtering.
 */
export function isReviewedPlace(place: {
  tiktok_url?: string | null;
  tiktokUrl?: string | null;
  tiktok?: string | null;
  review_video_url?: string | null;
  verdict?: string | null;
  has_critic_review?: boolean | null;
  hasCriticReview?: boolean | null;
}): boolean {
  if (place.has_critic_review === true || place.hasCriticReview === true) return true;
  if (place.verdict?.trim() && place.verdict !== "No Verdict Yet" && place.verdict !== "Verdict Pending") return true;
  const tiktok = place.tiktok_url || place.tiktokUrl || place.tiktok || place.review_video_url;
  if (tiktok?.trim()) return true;
  return false;
}
