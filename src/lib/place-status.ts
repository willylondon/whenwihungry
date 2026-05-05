import type { PlaceV2 } from "@/lib/community";

/**
 * Three statuses for the three content types:
 *
 *   Listed — Review Pending   → directory listing only, no review yet
 *   TikTok Reviewed           → has a real WhenWiHungry TikTok review
 *   Critic Reviewed           → has a full written critic verdict on the site
 */
export type PlaceStatus = "listed" | "tiktok-reviewed" | "critic-reviewed";

/** Union type so callers can pass partial shapes from different sources. */
type PlaceStatusLike = Partial<PlaceV2> & {
  has_critic_review?: boolean | null;
  hasCriticReview?: boolean | null;
  tiktok_url?: string | null;
  tiktokUrl?: string | null;
  tiktok?: string | null;
  review_video_url?: string | null;
  critic_review_body?: string | null;
  critic_verdict?: string | null;
  verdict?: string | null;
  headline?: string | null;
};

// ── Status ────────────────────────────────────────────────────────

export function getPlaceStatus(place: PlaceStatusLike): PlaceStatus {
  // 1. Full critic-reviewed
  if (
    place.has_critic_review === true ||
    place.hasCriticReview === true ||
    (place.critic_review_body?.trim() && place.critic_verdict?.trim()) ||
    (place.verdict?.trim() && place.verdict !== "No Verdict Yet" && place.verdict !== "Verdict Pending")
  ) {
    return "critic-reviewed";
  }

  // 2. TikTok-reviewed
  const tiktok = place.tiktok_url || place.tiktokUrl || place.tiktok || place.review_video_url;
  if (tiktok?.trim()) {
    return "tiktok-reviewed";
  }

  // 3. Everything else
  return "listed";
}

// ── Human-readable label ──────────────────────────────────────────

export function getPlaceStatusLabel(place: PlaceStatusLike): string {
  const status = getPlaceStatus(place);
  switch (status) {
    case "critic-reviewed":
      return "Critic Reviewed";
    case "tiktok-reviewed":
      return "TikTok Reviewed";
    case "listed":
      return "Listed — Review Pending";
  }
}

// ── CTA text ──────────────────────────────────────────────────────

export function getPlaceCta(place: PlaceStatusLike): string {
  const status = getPlaceStatus(place);
  switch (status) {
    case "critic-reviewed":
      return "Read Verdict →";
    case "tiktok-reviewed":
      return "Watch Review →";
    case "listed":
      return "View Listing →";
  }
}

// ── Section heading for detail page ───────────────────────────────

export function getPlaceDetailHeading(place: PlaceStatusLike): string {
  const status = getPlaceStatus(place);
  switch (status) {
    case "critic-reviewed":
      return "Critic Verdict";
    case "tiktok-reviewed":
      return "TikTok Review";
    case "listed":
      return "Listing Info";
  }
}

// ── Icon / emoji ──────────────────────────────────────────────────

export function getPlaceStatusEmoji(place: PlaceStatusLike): string {
  const status = getPlaceStatus(place);
  switch (status) {
    case "critic-reviewed":
      return "🖋️";
    case "tiktok-reviewed":
      return "🎬";
    case "listed":
      return "📍";
  }
}

// ── Convenience booleans ──────────────────────────────────────────

export function isCriticReviewed(place: PlaceStatusLike): boolean {
  return getPlaceStatus(place) === "critic-reviewed";
}

export function isTikTokReviewed(place: PlaceStatusLike): boolean {
  return getPlaceStatus(place) === "tiktok-reviewed";
}

export function isListedOnly(place: PlaceStatusLike): boolean {
  return getPlaceStatus(place) === "listed";
}

export function isReviewed(place: PlaceStatusLike): boolean {
  const s = getPlaceStatus(place);
  return s === "critic-reviewed" || s === "tiktok-reviewed";
}
