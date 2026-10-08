import { categories, latestPosts, places, testimonials, type Place } from "@/data/places";
import { matchesParish, normalizeParish, getParishDisplayName } from "@/lib/location-validation";
import type { PlaceV2 } from "@/lib/community";
import { getPlaceStatus } from "@/lib/place-status";
import { hasListingPhoto } from "@/lib/image-config";
import { getWrittenReviewForPlace } from "@/data/reviews";

export function getFeaturedPlaces() {
  return [...places]
    .filter((place) => place.featured)
    .sort((left, right) => right.rating - left.rating)
    .slice(0, 6);
}

export function getParishStats(allPlaces: Place[] = places) {
  const counts = new Map<string, number>();

  for (const place of allPlaces) {
    if (place.parish) {
      const name = getParishDisplayName(normalizeParish(place.parish)) || place.parish;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count);
}

export function getPlaceBySlug(slug: string) {
  return places.find((place) => place.slug === slug);
}

export function getRelatedPlaces(slug: string) {
  const current = getPlaceBySlug(slug);

  if (!current) {
    return [];
  }

  return places
    .filter((place) => place.slug !== slug && place.parish === current.parish)
    .slice(0, 3);
}

export function getFilteredPlaces(filters: {
  query?: string;
  parish?: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
  view?: string;
}, allPlaces: Place[] = []) {
  const filterCategory = filters.category?.trim().toLowerCase();

  const minimumRating = filters.rating ? Number(filters.rating) : 0;

  const filtered = allPlaces.filter((place) => {
    if (!place) return false;

    // Query relevance is supplied by searchRestaurants; this stage applies facets.
    const parishMatches = !filters.parish || matchesParish(place.parish, filters.parish);
    const normalizedFilter = (filterCategory || "").replace(/-/g, " ");
    const placeCategory = (place.category || "").toLowerCase();
    const placeType = (place.type || "").toLowerCase();
    const matchesCategory =
      !filterCategory ||
      placeCategory.includes(normalizedFilter) ||
      placeType.includes(normalizedFilter) ||
      (normalizedFilter === "local food" && (
        placeCategory.includes("jamaican") ||
        placeType.includes("jamaican") ||
        placeCategory.includes("local") ||
        placeCategory.includes("cook shop")
      )) ||
      (normalizedFilter === "cheap eats" && place.priceRange === "$") ||
      (normalizedFilter === "date night" && (
        placeCategory.includes("fine dining") ||
        placeCategory.includes("upscale") ||
        placeCategory.includes("romantic")
      ));
    const matchesPrice = !filters.price || place.priceRange === filters.price;
    const matchesRating = !minimumRating || (place.rating || 0) >= minimumRating;

    return (
      parishMatches &&
      matchesCategory &&
      matchesPrice &&
      matchesRating
    );
  });

  return filtered.sort((left: Place & Partial<PlaceV2>, right: Place & Partial<PlaceV2>) => {
    const byName = left.name.localeCompare(right.name) || left.slug.localeCompare(right.slug);
    // An explicit UI sort always takes precedence over the relevance score.
    switch (filters.sort) {
      case "rating":
        return right.rating - left.rating || right.reviewCount - left.reviewCount || byName;
      case "popular":
        return right.reviewCount - left.reviewCount || right.rating - left.rating || byName;
      case "price-low":
      case "price-high": {
        if (!left.priceRange) return right.priceRange ? 1 : byName;
        if (!right.priceRange) return -1;
        const difference = left.priceRange.length - right.priceRange.length;
        return (filters.sort === "price-low" ? difference : -difference) || byName;
      }
      case "az":
        return byName;
      default:
        if (filters.query?.trim()) return (right.final_score ?? 0) - (left.final_score ?? 0) || recommendationScore(right) - recommendationScore(left) || mixOrder(left.slug) - mixOrder(right.slug) || byName;
        // Ties (most listings) use a stable shuffle so the list mixes parishes instead of reading A to Z.
        return recommendationScore(right) - recommendationScore(left) || mixOrder(left.slug) - mixOrder(right.slug) || byName;
    }
  });
}

const STATUS_WEIGHT = { "critic-reviewed": 1000, "tiktok-reviewed": 500, listed: 0 } as const;
const WRITTEN_REVIEW_WEIGHT = 2000;

/** Deterministic pseudo-random rank from the slug (FNV-1a), so pages stay stable between visits. */
function mixOrder(slug: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < slug.length; index++) hash = Math.imul(hash ^ slug.charCodeAt(index), 0x01000193);
  return hash >>> 0;
}

/**
 * Default browse order: our written reviews first, then critic/TikTok reviews, then listings with a real photo,
 * then a confidence-weighted rating so 4.9 from 8 votes doesn't beat 4.6 from 900.
 */
export function recommendationScore(place: Place & Partial<PlaceV2>): number {
  const count = place.reviewCount > 0 ? place.reviewCount : 0;
  const rating = count > 0 && place.rating > 0 ? place.rating : 0;
  const PRIOR_VOTES = 50, PRIOR_RATING = 4;
  const weightedRating = rating ? (count * rating + PRIOR_VOTES * PRIOR_RATING) / (count + PRIOR_VOTES) : 0;
  const hasPhoto = hasListingPhoto(place.image) ? 10 : 0;
  const writtenReview = getWrittenReviewForPlace(place.slug) ? WRITTEN_REVIEW_WEIGHT : 0;
  return writtenReview + STATUS_WEIGHT[getPlaceStatus(place)] + hasPhoto + weightedRating;
}

export function getSiteStats() {
  return {
    placeCount: places.length,
    reviewCount: places.reduce((total, place) => total + place.reviewCount, 0),
    parishCount: new Set(places.map((place) => place.parish)).size
  };
}

export { categories, latestPosts, testimonials };
export { places };

/**
 * A photo-led selection for the homepage: recommendation order, at most one spot per
 * parish until every parish is represented, then the next best.
 */
export function pickSpotsWorthALook<T extends Place & Partial<PlaceV2>>(allPlaces: T[], count = 8): T[] {
  const ranked = getFilteredPlaces({}, allPlaces).filter((place) => hasListingPhoto(place.image)) as T[];
  const picked: T[] = [];
  const parishes = new Set<string>();
  for (const place of ranked) {
    if (picked.length >= count) break;
    const parish = normalizeParish(place.parish) || place.parish;
    if (parishes.has(parish)) continue;
    parishes.add(parish);
    picked.push(place);
  }
  for (const place of ranked) {
    if (picked.length >= count) break;
    if (!picked.includes(place)) picked.push(place);
  }
  return picked;
}
