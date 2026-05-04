import { categories, latestPosts, places, testimonials, type Place } from "@/data/places";

export function getFeaturedPlaces() {
  return [...places]
    .filter((place) => place.featured)
    .sort((left, right) => right.rating - left.rating)
    .slice(0, 6);
}

export function getParishStats() {
  const counts = new Map<string, number>();

  for (const place of places) {
    counts.set(place.parish, (counts.get(place.parish) ?? 0) + 1);
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
}, extraPlaces: Place[] = []) {
  const query = filters.query?.trim().toLowerCase();

  const minimumRating = filters.rating ? Number(filters.rating) : 0;
  const allPlaces = [...places, ...extraPlaces];

  const filtered = allPlaces.filter((place) => {
    const matchesQuery =
      !query ||
      place.name.toLowerCase().includes(query) ||
      place.area.toLowerCase().includes(query) ||
      place.category.toLowerCase().includes(query) ||
      place.type.toLowerCase().includes(query);
    const matchesParish = !filters.parish || place.parish === filters.parish;
    const matchesCategory =
      !filters.category || place.category === filters.category;
    const matchesPrice = !filters.price || place.priceRange === filters.price;
    const matchesRating = !minimumRating || place.rating >= minimumRating;

    return (
      matchesQuery &&
      matchesParish &&
      matchesCategory &&
      matchesPrice &&
      matchesRating
    );
  });

  return filtered.sort((left, right) => {
    switch (filters.sort) {
      case "rating":
        return right.rating - left.rating;
      case "popular":
        return right.reviewCount - left.reviewCount;
      case "price-low":
        return left.priceRange.length - right.priceRange.length;
      case "price-high":
        return right.priceRange.length - left.priceRange.length;
      case "az":
        return left.name.localeCompare(right.name);
      default:
        return right.reviewCount - left.reviewCount;
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

export const VIDEO_MAP: Record<string, string> = {
  "usain-bolt-s-tracks-records-kingston": "https://vt.tiktok.com/ZS9Q8mN8F/",
  "devon-house-i-scream-kingston": "https://vt.tiktok.com/ZS9Q8qJs1/",
  "miss-t-s-kitchen-st-ann": "https://vt.tiktok.com/ZS9Q8uQst/",
  "scotchies-coral-gardens-st-james": "https://vt.tiktok.com/ZS9Q8gU2B/",
  "scotchies-draxhall-st-ann": "https://vt.tiktok.com/ZS9Q8gU2B/"
};

export function getVideoPlaces() {
  return places.filter(place => VIDEO_MAP[place.slug]);
}

export { categories, latestPosts, testimonials };
export { places };
