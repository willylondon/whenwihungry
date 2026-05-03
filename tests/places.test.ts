import { describe, expect, it } from "vitest";

import {
  getFeaturedPlaces,
  getFilteredReviewPosts,
  getParishStats,
  getPlaceBySlug,
  getRelatedReviewPosts,
  getReviewCategoryBySlug,
  getReviewCategorySlug
} from "../src/lib/places";

describe("place helpers", () => {
  it("returns six featured places sorted by rating", () => {
    const featured = getFeaturedPlaces();

    expect(featured).toHaveLength(6);
    expect(featured[0].rating).toBeGreaterThanOrEqual(featured[1].rating);
  });

  it("groups parish stats and keeps Kingston visible", () => {
    const stats = getParishStats();
    const kingston = stats.find((item) => item.name === "Kingston");

    expect(stats.length).toBeGreaterThan(3);
    expect(kingston).toBeDefined();
    expect(kingston?.count).toBeGreaterThan(0);
  });

  it("finds a place by slug with its review payload", () => {
    const place = getPlaceBySlug("scotchies-mobay");

    expect(place?.name).toBe("Scotchies");
    expect(place?.reviews.length).toBeGreaterThan(0);
  });

  it("filters editorial reviews by category slug", () => {
    const categorySlug = getReviewCategorySlug("Seafood");
    const category = getReviewCategoryBySlug(categorySlug);
    const reviews = getFilteredReviewPosts(category);

    expect(category).toBe("Seafood");
    expect(reviews).toHaveLength(1);
    expect(reviews[0].category).toBe("Seafood");
  });

  it("returns fallback related reviews for an article page", () => {
    const related = getRelatedReviewPosts("scotchies-mobay-jerk-worth-the-stop");

    expect(related).toHaveLength(2);
    expect(related[0].slug).not.toBe("scotchies-mobay-jerk-worth-the-stop");
  });
});
