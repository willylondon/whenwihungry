/** Shared published-review contract for cards, detail, feeds and structured data. */
export type PlaceStatus = "listed" | "tiktok-reviewed" | "critic-reviewed";

type ReviewFields = {
  verdict?: string | null;
  critic_verdict?: string | null;
  headline?: string | null;
  honest_take?: string | null;
  critic_review_body?: string | null;
  reviewed_at?: string | null;
  published_at?: string | null;
  visited_at?: string | null;
  visit_date?: string | null;
  created_at?: string | null;
  admin_score?: number | null;
  status?: string | null;
  review_status?: string | null;
};

export type PlaceStatusLike = ReviewFields & {
  has_critic_review?: boolean | null;
  hasCriticReview?: boolean | null;
  critic_reviewed_at?: string | null;
  tiktok_url?: string | null;
  tiktokUrl?: string | null;
  tiktok?: string | null;
  review_video_url?: string | null;
  admin_reviews?: ReviewFields | ReviewFields[] | null;
};

const UNPUBLISHED = new Set(["draft", "pending", "in_progress", "not_reviewed", "withdrawn", "rejected"]);
const PLACEHOLDERS = new Set(["no verdict yet", "verdict pending", "not reviewed", "none"]);

export function validReviewDate(value: unknown): string | undefined {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value) && Number.isFinite(Date.parse(value))
    ? value : undefined;
}

/** Legacy authored reviews may use created_at; verdicts/flags alone never publish one. */
export function getPublishedCriticReview(place: PlaceStatusLike): ReviewFields | null {
  if (place.has_critic_review === false || place.hasCriticReview === false || UNPUBLISHED.has(place.review_status ?? "")) return null;
  const reviews = place.admin_reviews
    ? (Array.isArray(place.admin_reviews) ? place.admin_reviews : [place.admin_reviews])
    : [place];
  return reviews
    .filter((review) => {
      const verdict = (review.critic_verdict || review.verdict || "").trim();
      const date = review.published_at || review.reviewed_at || review.visit_date || review.visited_at || place.critic_reviewed_at || review.created_at;
      return !UNPUBLISHED.has(review.status ?? "") && !UNPUBLISHED.has(review.review_status ?? "") &&
        Boolean(verdict && !PLACEHOLDERS.has(verdict.toLowerCase().replace(/[_-]+/g, " ")) &&
          (review.critic_review_body?.trim() || review.honest_take?.trim() || review.headline?.trim()) && validReviewDate(date));
    })
    .sort((a, b) => Date.parse(b.published_at || b.reviewed_at || b.created_at || b.visit_date || b.visited_at || place.critic_reviewed_at || "") -
      Date.parse(a.published_at || a.reviewed_at || a.created_at || a.visit_date || a.visited_at || place.critic_reviewed_at || ""))[0] ?? null;
}

/** Keep external links inert unless they use an ordinary web URL. */
export function safeWebUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}

export function getReviewVideoUrl(place: PlaceStatusLike): string | undefined {
  // The legacy `tiktok` field is a restaurant's own social contact, never review evidence.
  // Dedicated review fields must link to an actual TikTok video, not a profile or arbitrary site.
  return [place.review_video_url, place.tiktok_url, place.tiktokUrl].map(safeWebUrl).find((value) => {
    if (!value) return false;
    const url = new URL(value);
    return ["www.tiktok.com", "tiktok.com", "m.tiktok.com"].includes(url.hostname.toLowerCase()) &&
      /^\/@[^/]+\/video\/\d+\/?$/.test(url.pathname);
  });
}

export function getTikTokContactUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const raw = value.trim();
  const url = safeWebUrl(/^@?[\w.]{1,80}$/.test(raw) ? `https://www.tiktok.com/@${raw.replace(/^@/, "")}` : raw);
  return url && ["www.tiktok.com", "tiktok.com", "vm.tiktok.com", "vt.tiktok.com"].includes(new URL(url).hostname.toLowerCase()) ? url : undefined;
}

export function getPlaceStatus(place: PlaceStatusLike): PlaceStatus {
  if (getPublishedCriticReview(place)) return "critic-reviewed";
  if (getReviewVideoUrl(place)) return "tiktok-reviewed";
  return "listed";
}

export function getPlaceStatusLabel(place: PlaceStatusLike): string {
  return { "critic-reviewed": "Critic Reviewed", "tiktok-reviewed": "TikTok Reviewed", listed: "Listed — Review Pending" }[getPlaceStatus(place)];
}

export function getPlaceCta(place: PlaceStatusLike): string {
  return { "critic-reviewed": "Read Verdict →", "tiktok-reviewed": "Watch Review →", listed: "View Listing →" }[getPlaceStatus(place)];
}

export function getPlaceDetailHeading(place: PlaceStatusLike): string {
  return { "critic-reviewed": "Critic Verdict", "tiktok-reviewed": "TikTok Review", listed: "Listing Info" }[getPlaceStatus(place)];
}


export function isCriticReviewed(place: PlaceStatusLike): boolean { return getPlaceStatus(place) === "critic-reviewed"; }
export function isTikTokReviewed(place: PlaceStatusLike): boolean { return getPlaceStatus(place) === "tiktok-reviewed"; }
export function isListedOnly(place: PlaceStatusLike): boolean { return getPlaceStatus(place) === "listed"; }
export function isReviewed(place: PlaceStatusLike): boolean { return getPlaceStatus(place) !== "listed"; }
