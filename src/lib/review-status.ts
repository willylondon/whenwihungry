export type ReviewStatus = "listing" | "reviewed" | "community-reviewed";

type ReviewStatusLike = {
  critic_review_body?: string | null;
  critic_reviewed_at?: string | null;
  critic_verdict?: string | null;
  review_status?: string | null;
  source_status?: string | null;
};

const LISTING_REVIEW_STATUSES = new Set([
  "listing",
  "listing_info",
  "not_reviewed",
  "not reviewed",
  "not-reviewed",
  "pending",
  "public_import",
  "public import",
  "public_listing",
  "public listing",
  "public-listing",
  "imported",
  "unreviewed",
  "needs_review",
  "needs review"
]);

const COMMUNITY_REVIEWED_STATUSES = new Set([
  "community-reviewed",
  "community reviewed",
  "community_reviewed"
]);

const CRITIC_REVIEWED_STATUSES = new Set([
  "reviewed",
  "critic-reviewed",
  "critic reviewed",
  "critic_reviewed",
  "published",
  "published_review",
  "published review"
]);

const LISTING_SOURCE_STATUSES = new Set([
  "public_import",
  "public import",
  "public-listing",
  "public listing",
  "pending",
  "imported",
  "unverified",
  "needs_verification",
  "needs verification"
]);

function normalizeStatusValue(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

export function hasCriticReviewContent(place: ReviewStatusLike) {
  return Boolean(
    place.critic_reviewed_at &&
      place.critic_review_body?.trim() &&
      place.critic_verdict?.trim()
  );
}

export function getResolvedReviewStatus(place: ReviewStatusLike): ReviewStatus {
  const reviewStatus = normalizeStatusValue(place.review_status);
  const sourceStatus = normalizeStatusValue(place.source_status);

  if (LISTING_SOURCE_STATUSES.has(sourceStatus) || LISTING_REVIEW_STATUSES.has(reviewStatus)) {
    return "listing";
  }

  if (COMMUNITY_REVIEWED_STATUSES.has(reviewStatus)) {
    return "community-reviewed";
  }

  if (CRITIC_REVIEWED_STATUSES.has(reviewStatus)) {
    return "reviewed";
  }

  return hasCriticReviewContent(place) ? "reviewed" : "listing";
}
