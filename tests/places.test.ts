import { describe, expect, it } from "vitest";
import type { Place } from "@/data/places";
import type { PlaceV2 } from "@/lib/community";
import { getFilteredPlaces, getParishStats } from "@/lib/places";

function place(overrides: Partial<PlaceV2>): Place & Partial<PlaceV2> {
  return { slug: "spot", name: "Spot", parish: "St. James", area: "Montego Bay", category: "Jerk", type: "Jamaican",
    rating: 0, reviewCount: 0, priceRange: "", image: "", description: "", address: "", phone: "", website: "", hours: [], features: [], reviews: [], ...overrides };
}
const fixtures = [
  place({ slug: "zulu", name: "Zulu", final_score: 90, priceRange: "$$$", rating: 3, reviewCount: 300, admin_score: 100 }),
  place({ slug: "alpha", name: "Alpha", final_score: 10, priceRange: "$", rating: 4.8, reviewCount: 2 }),
  place({ slug: "beta", name: "Beta", final_score: 50, priceRange: "$$", rating: 4, reviewCount: 20 }),
  place({ slug: "unknown", name: "Unknown", final_score: 5 })
];

describe("active directory facets and sorting", () => {
  it.each([undefined, "jerk"])("respects every explicit sort with query=%s", (query) => {
    expect(getFilteredPlaces({ query, sort: "az" }, fixtures).map((p) => p.slug)).toEqual(["alpha", "beta", "unknown", "zulu"]);
    expect(getFilteredPlaces({ query, sort: "price-low" }, fixtures).map((p) => p.slug)).toEqual(["alpha", "beta", "zulu", "unknown"]);
    expect(getFilteredPlaces({ query, sort: "price-high" }, fixtures).map((p) => p.slug)).toEqual(["zulu", "beta", "alpha", "unknown"]);
    expect(getFilteredPlaces({ query, sort: "rating" }, fixtures).map((p) => p.slug)).toEqual(["alpha", "beta", "zulu", "unknown"]);
    expect(getFilteredPlaces({ query, sort: "popular" }, fixtures).map((p) => p.slug)).toEqual(["zulu", "beta", "alpha", "unknown"]);
  });
  it("uses relevance only for the default search sort", () => {
    expect(getFilteredPlaces({ query: "jerk" }, fixtures).map((p) => p.slug)).toEqual(["zulu", "beta", "alpha", "unknown"]);
    // Without a query: confidence-weighted rating, so 300 votes at 3★ don't outrank strong ratings.
    expect(getFilteredPlaces({}, fixtures).map((p) => p.slug)).toEqual(["alpha", "beta", "zulu", "unknown"]);
  });
  it("recommends our own reviews, then listings with real photos, by default", () => {
    const ranked = getFilteredPlaces({}, [
      place({ slug: "popular", name: "Popular", rating: 4.9, reviewCount: 2000, image: "/logo.png" }),
      place({ slug: "photo", name: "Photo", rating: 4.2, reviewCount: 40, image: "https://images.pexels.com/x.jpg" }),
      place({ slug: "video", name: "Video", review_video_url: "https://www.tiktok.com/@whenwihungry/video/1" })
    ]);
    expect(ranked.map((p) => p.slug)).toEqual(["video", "photo", "popular"]);
  });
  it("puts our written reviews first and mixes otherwise-equal listings instead of A to Z", () => {
    const equal = ["a-spot", "b-spot", "c-spot", "d-spot", "e-spot", "f-spot"].map((slug) => place({ slug, name: slug }));
    const ranked = getFilteredPlaces({}, [...equal, place({ slug: "rok-hotel-kingston", name: "ROK" })]).map((p) => p.slug);
    expect(ranked[0]).toBe("rok-hotel-kingston");
    expect(ranked.slice(1)).not.toEqual(equal.map((p) => p.slug));
    expect(getFilteredPlaces({}, equal).map((p) => p.slug)).toEqual(getFilteredPlaces({}, [...equal].reverse()).map((p) => p.slug));
  });
  it("uses one 0–5 scale instead of critic scores for rating filters", () => {
    expect(getFilteredPlaces({ rating: "4.4" }, fixtures).map((p) => p.slug)).toEqual(["alpha"]);
    expect(getFilteredPlaces({ price: "$$", category: "jerk", parish: "st-james" }, fixtures).map((p) => p.slug)).toEqual(["beta"]);
  });
  it("keeps stable name/slug tie breakers without mutating input", () => {
    const copy = [...fixtures];
    const tied = [place({ name: "Same", slug: "b" }), place({ name: "Same", slug: "a" })];
    expect(getFilteredPlaces({ sort: "rating" }, tied).map((p) => p.slug)).toEqual(["a", "b"]);
    getFilteredPlaces({ sort: "az" }, fixtures);
    expect(fixtures).toEqual(copy);
  });
  it("groups spelling aliases while keeping all actual parishes distinct", () => {
    const stats = getParishStats([place({ parish: "St. James" }), place({ parish: "saint-james" }), place({ parish: "St. Andrew" }), place({ parish: "Kingston" })]);
    expect(stats).toContainEqual({ name: "St. James", count: 2 });
    expect(stats).toContainEqual({ name: "St. Andrew", count: 1 });
    expect(stats).toContainEqual({ name: "Kingston", count: 1 });
  });
  it("returns honest empty results for an empty supplied catalog", () => {
    expect(getFilteredPlaces({}, [])).toEqual([]);
    expect(getParishStats([])).toEqual([]);
  });
});
