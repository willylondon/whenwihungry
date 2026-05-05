import type { PlaceV2 } from "@/lib/community";
import { getPlaceStatus, getPlaceStatusLabel, getPlaceCta, getPlaceDetailHeading } from "@/lib/place-status";

type PlaceCardLike = Partial<PlaceV2> & {
  place_name?: string | null;
  restaurant_name?: string | null;
  title?: string | null;
};

export function getPlaceDisplayName(place: PlaceCardLike) {
  return (
    place.name ||
    place.restaurant_name ||
    place.title ||
    place.place_name ||
    "Unnamed Food Spot"
  );
}

export function getPlaceSummary(place: PlaceCardLike) {
  return (
    place.description?.trim() ||
    place.public_listing_summary?.trim() ||
    "Public listing information is available while the full review is still pending."
  );
}

export function getPlaceCardState(place: PlaceCardLike) {
  const status = getPlaceStatus(place);
  const badgeText = status === "listed" ? getPlaceStatusLabel(place) : null;
  const ctaText = getPlaceCta(place);
  const heading = getPlaceDetailHeading(place);
  const label = heading.toUpperCase();
  const mode = status === "critic-reviewed" ? ("reviewed" as const) : ("listing" as const);

  return { badgeText, ctaText, heading, label, mode };
}

// Re-export for backward compatibility
export { getPlaceStatus, getPlaceStatusLabel, getPlaceCta, isCriticReviewed, isTikTokReviewed, isListedOnly, isReviewed } from "@/lib/place-status";

export function getPlaceMetaLine(place: PlaceCardLike) {
  const segments = [place.type || place.category, place.priceRange, place.parish || place.area].filter(Boolean);
  return segments.join(" · ");
}

export function getPublicRating(place: PlaceCardLike) {
  return place.public_rating ?? place.rating ?? 0;
}

export function getPublicReviewCount(place: PlaceCardLike) {
  return place.public_review_count ?? place.reviewCount ?? 0;
}

export function formatPublicReviewCount(count: number) {
  if (!count) {
    return "No public reviews yet";
  }

  if (count >= 1000) {
    const rounded = Math.floor(count / 1000) * 1000;
    return `${rounded.toLocaleString()}+ public reviews`;
  }

  if (count === 1) {
    return "1 public review";
  }

  return `${count.toLocaleString()} public reviews`;
}
