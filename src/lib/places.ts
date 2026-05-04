import { categories, latestPosts, places, testimonials, type Place } from "@/data/places";

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
      counts.set(place.parish, (counts.get(place.parish) ?? 0) + 1);
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
  const query = filters.query?.trim().toLowerCase();
  const filterCategory = filters.category?.trim().toLowerCase();

  const minimumRating = filters.rating ? Number(filters.rating) : 0;

  const filtered = allPlaces.filter((place) => {
    if (!place) return false;

    const matchesQuery = true; // Query matching is now handled by the Supabase RPC
    const matchesParish = !filters.parish || place.parish === filters.parish;
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
      matchesQuery &&
      matchesParish &&
      matchesCategory &&
      matchesPrice &&
      matchesRating
    );
  });

  return filtered.sort((left: any, right: any) => {
    // Priority 1: Use final_score (Ranking Engine)
    if (left.final_score !== undefined && right.final_score !== undefined) {
      return right.final_score - left.final_score;
    }

    switch (filters.sort) {
      case "rating":
        return (right.admin_score || right.rating || 0) - (left.admin_score || left.rating || 0);
      case "popular":
        return (right.reviewCount || 0) - (left.reviewCount || 0);
      case "price-low":
        return (left.priceRange?.length || 0) - (right.priceRange?.length || 0);
      case "price-high":
        return (right.priceRange?.length || 0) - (left.priceRange?.length || 0);
      case "az":
        return left.name.localeCompare(right.name);
      default:
        // Default: Sort by admin_score then popularity
        return (right.admin_score || 0) - (left.admin_score || 0) || (right.reviewCount || 0) - (left.reviewCount || 0);
    }
  });
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
