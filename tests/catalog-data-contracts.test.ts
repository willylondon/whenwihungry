import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { catalogDb, restaurant } from "./helpers/catalog-db";
const state = vi.hoisted(() => ({ client: null as any }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn(async () => state.client) }));
import { CatalogUnavailableError, dbRowToPlace, getAllApprovedPlaces, getApprovedCommunityPlaceBySlug, normalizePriceRange } from "@/lib/community";
import { parseListing } from "@/app/add-listing/validation";
import { formatFoodSpotCount, getPublicFoodSpotCount } from "@/lib/place-counts";
import { getPlaceStatus, isCriticReviewed } from "@/lib/place-status";
import { isPublicFoodSpot, isReviewedPlace } from "@/lib/place-visibility";
import { getAllParishNames, getParishDisplayName, isPlaceSafeForParishPage, matchesParish, normalizeParish, validatePlaceParish } from "@/lib/location-validation";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Network is forbidden in unit tests"); }));
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const realReview = { verdict: "WORTH_IT", admin_score: 80, headline: "Worth the detour", honest_take: "Smoky jerk, crisp festival.", visit_date: "2026-10-01", created_at: "2026-10-02T10:00:00Z" };

describe("public record mapping", () => {
  it("preserves critic content, dates, video, public provenance, coordinates, contact and price", () => {
    const mapped = dbRowToPlace(restaurant({ public_rating: 4.8, public_review_count: 900, public_rating_source: "Google", price_range: "$$$$", price_level: 4,
      tiktok_url: "https://www.tiktok.com/@whenwihungry/video/123", website: "https://example.com/menu", phone: "876-555-0100", features: ["Outdoor"], hours: ["Mon 10–8"],
      review_status: "reviewed", source_status: "critic_reviewed", admin_reviews: [realReview] }));
    expect(mapped).toMatchObject({ public_rating: 4.8, public_review_count: 900, public_rating_source: "Google", lat: 18.47, lng: -77.92,
      priceRange: "$$$$", website: "https://example.com/menu", phone: "876-555-0100", headline: realReview.headline, honest_take: realReview.honest_take,
      reviewed_at: "2026-10-02T10:00:00Z", published_at: "2026-10-02T10:00:00Z", visited_at: "2026-10-01", has_critic_review: true, rating: 4.8, rating_source: "public", reviewCount: 900, features: ["Outdoor"], hours: ["Mon 10–8"] });
    expect(mapped.tiktokUrl).toBe(mapped.tiktok_url);
    expect(getPlaceStatus(mapped)).toBe("critic-reviewed");
  });
  it("keeps visit and publication dates separate without inventing a publication date", () => {
    const dated = dbRowToPlace(restaurant({ admin_reviews: [{ ...realReview, created_at: "2026-10-07T09:00:00Z" }] }));
    expect(dated.reviewed_at).toBe("2026-10-07T09:00:00Z");
    expect(dated.visit_date).toBe("2026-10-01");
    const visitOnly = dbRowToPlace(restaurant({ admin_reviews: [{ ...realReview, created_at: undefined }] }));
    expect(visitOnly.visit_date).toBe("2026-10-01");
    expect(visitOnly.reviewed_at).toBeUndefined();
    expect(visitOnly.published_at).toBeUndefined();
  });
  it.each(["published_at", "reviewed_at", "critic_reviewed_at"])("prefers explicit %s over an older review creation timestamp", (field) => {
    const timestamp = "2026-10-07T09:00:00Z";
    const review = { ...realReview, created_at: "2026-09-15T09:00:00Z", ...(field !== "critic_reviewed_at" ? { [field]: timestamp } : {}) };
    const mapped = dbRowToPlace(restaurant({ admin_reviews: [review], ...(field === "critic_reviewed_at" ? { critic_reviewed_at: timestamp } : {}) }));
    expect(mapped.published_at).toBe(timestamp);
    expect(mapped.reviewed_at).toBe(timestamp);
    expect(mapped.visit_date).toBe("2026-10-01");
  });
  it("aggregates only approved valid community ratings and never mixes 100-point critic scores", () => {
    const mapped = dbRowToPlace(restaurant({ avg_rating: 0, rating_count: 9000, admin_score: 100, user_reviews: [
      { rating: 5, status: "approved" }, { rating: 4, status: "approved" }, { rating: 1, status: "pending" }, { rating: 1, status: "rejected" }, { rating: 5 }, { rating: 90, status: "approved" }, { rating: 0.5, status: "approved" }, { rating: 2.5, status: "approved" }
    ] }));
    expect(mapped).toMatchObject({ rating: 4.5, community_rating: 4.5, community_score: 90, community_review_count: 2, reviewCount: 2, rating_source: "community" });
    expect(dbRowToPlace(restaurant({ admin_score: 80, avg_rating: 5, rating_count: 20 }))).toMatchObject({ rating: 0, reviewCount: 0, community_rating: null, rating_source: null });
  });
  it("does not invent missing coordinates, ratings, price or a random identity", () => {
    const mapped = dbRowToPlace({ name: "Incomplete" });
    expect(mapped).toMatchObject({ slug: "", priceRange: "", rating: 0, rating_source: null, public_rating: null });
    expect(mapped.lat).toBeUndefined(); expect(mapped.lng).toBeUndefined();
    expect(dbRowToPlace({ latitude: 0, longitude: 0 }).lat).toBeUndefined();
    expect(dbRowToPlace({ website: "javascript:alert(1)", tiktok_url: "javascript:alert(1)" }).website).toBe("");
  });
  it.each([1, 2, 3, 4])("round-trips price level %s", (level) => {
    expect(normalizePriceRange({ price_level: level })).toBe("$".repeat(level));
    expect(normalizePriceRange({ price_range: "$".repeat(level), price_level: level })).toBe("$".repeat(level));
  });
  it("marks conflicting legacy price fields unknown rather than picking the stale one", () => {
    expect(normalizePriceRange({ price_range: "$$$$", price_level: 1 })).toBe("");
    expect(dbRowToPlace(restaurant({ price_range: "$", price_level: 4 }))).toMatchObject({ priceRange: "", price_needs_confirmation: true });
  });
  it.each([undefined, null, 0, 5, 2.5, "unknown"])("keeps invalid/missing price %s unknown", (value) => {
    expect(normalizePriceRange({ price_level: value })).toBe("");
  });
});

describe("one published-review definition", () => {
  it("requires actual content, verdict and a valid date; flags alone never count", () => {
    expect(isCriticReviewed({ has_critic_review: true, verdict: "MID" })).toBe(false);
    expect(isCriticReviewed({ verdict: "MID", honest_take: "Good" })).toBe(false);
    expect(isCriticReviewed({ ...realReview, verdict: "Verdict Pending" })).toBe(false);
    expect(isCriticReviewed({ ...realReview, verdict: "NO_VERDICT_YET" })).toBe(false);
    expect(isCriticReviewed({ ...realReview, headline: " ", honest_take: " " })).toBe(false);
    expect(isCriticReviewed({ admin_reviews: [realReview] })).toBe(true);
    expect(isReviewedPlace({ admin_reviews: [realReview] })).toBe(true);
  });
  it.each(["not_reviewed", "in_progress", "draft", "withdrawn", "rejected"])("hides %s content even if visible to the signed-in caller", (status) => {
    const mapped = dbRowToPlace(restaurant({ review_status: status, admin_reviews: [realReview] }));
    expect(getPlaceStatus(mapped)).toBe("listed");
    expect(mapped.honest_take).toBeUndefined();
    expect(mapped.search_document?.critic_review_body).toBe("");
  });
  it("never promotes a submitted restaurant social link to a WhenWiHungry review", () => {
    for (const social of ["@restaurant", "https://www.tiktok.com/@restaurant", "https://www.tiktok.com/@restaurant/video/123"]) {
      const form = new FormData();
      for (const [key, value] of Object.entries({ name: "Restaurant", parish: "St. James", category: "Jerk", description: "Restaurant listing information.", tiktok: social })) form.set(key, value);
      const mapped = dbRowToPlace(restaurant(parseListing(form)));
      expect(getPlaceStatus(mapped)).toBe("listed");
      expect(mapped.tiktok_profile_url).toContain("tiktok.com/@restaurant");
      expect(mapped.review_video_url).toBeUndefined();
    }
    expect(getPlaceStatus({ tiktok_url: "https://www.tiktok.com/@restaurant" })).toBe("listed");
    expect(getPlaceStatus({ review_video_url: "https://example.com/video/123" })).toBe("listed");
    expect(getPlaceStatus({ tiktok: "https://www.tiktok.com/@restaurant/video/123" })).toBe("listed");
  });
  it("keeps TikTok-only places reviewed without manufacturing a critic verdict", () => {
    const mapped = dbRowToPlace(restaurant({ tiktok_url: "https://www.tiktok.com/@wwh/video/123" }));
    expect(getPlaceStatus(mapped)).toBe("tiktok-reviewed");
    expect(isReviewedPlace(mapped)).toBe(true);
    expect(mapped.has_critic_review).toBe(false);
  });
});

describe("parish and geographic eligibility", () => {
  it("normalizes all 14 parish slugs, dotted names and Saint names", () => {
    expect(getAllParishNames()).toHaveLength(14);
    for (const parish of getAllParishNames()) {
      expect(normalizeParish(parish.replaceAll(" ", "-"))).toBe(parish);
      expect(normalizeParish(getParishDisplayName(parish))).toBe(parish);
      expect(normalizeParish(parish.replace(/^st /, "Saint ") + " Parish")).toBe(parish);
      expect(isPlaceSafeForParishPage({ parish: getParishDisplayName(parish) }, parish.replaceAll(" ", "-"))).toBe(true);
    }
    expect(normalizeParish("st-andrew")).toBe("st andrew");
    expect(matchesParish("St. Andrew", "kingston")).toBe(false);
    expect(matchesParish("St. Andrew", "kingston", true)).toBe(true);
    expect(normalizeParish("not-a-parish")).toBe("");
    expect(isPlaceSafeForParishPage({ parish: "not-a-parish" }, "not-a-parish")).toBe(false);
  });
  it("does not infer location from restaurant names", () => {
    expect(validatePlaceParish({ parish: "St. James", name: "Kingston Kitchen", area: "Montego Bay" }).valid).toBe(true);
    expect(isPublicFoodSpot(restaurant({ name: "USVI Kitchen", address: "1 Canada Road, Montego Bay, Jamaica", latitude: null, longitude: null }))).toBe(true);
  });
  it.each([
    { is_active: false }, { status: "pending" }, { data_quality_status: "rejected" }, { business_type: "not_food" },
    { country_code: "CA" }, { latitude: 43.65, longitude: -79.38 }, { address: "12 Food St, Toronto, ON M5V 2T6" }, { address: "Jamaica, NY 11432" },
    { address: "6280 Estate Nazareth, Nazareth, St Thomas 00802, USVI", latitude: null, longitude: null },
    { address: "Secret Harbour, St. Thomas, U.S. Virgin Islands", latitude: null, longitude: null },
    { address: "Secret Harbour, St. Thomas, Virgin Islands", latitude: null, longitude: null }
  ])("excludes explicit ineligible/foreign record %j", (overrides) => {
    expect(isPublicFoodSpot(restaurant(overrides))).toBe(false);
  });
  it("keeps approved null-quality/active/type rows and missing coordinates eligible", () => {
    expect(isPublicFoodSpot(restaurant({ is_active: null, data_quality_status: null, business_type: null, latitude: null, longitude: null }))).toBe(true);
    expect(isPlaceSafeForParishPage({ parish: "St. James", data_quality_status: "needs_review" }, "st-james")).toBe(false);
    expect(isPlaceSafeForParishPage({ parish: "St. James", data_quality_status: "needs_review", manually_verified: true }, "st-james")).toBe(true);
  });
});

describe("bounded full-row catalog reads", () => {
  it("continues through a database row cap lower than its requested page size, including reviews", async () => {
    const restaurants = Array.from({ length: 205 }, (_, index) => restaurant({ id: `id-${String(index).padStart(4, "0")}`, slug: `spot-${index}` }));
    const reviews = Array.from({ length: 213 }, (_, index) => ({ id: `review-${index}`, restaurant_id: "id-0000", rating: 5, status: "approved" }));
    state.client = catalogDb({ restaurants, user_reviews: reviews }, { cap: 17 });
    const all = await getAllApprovedPlaces();
    expect(all).toHaveLength(205);
    expect(all[0].community_review_count).toBe(213);
    expect(state.client.calls.filter((call: any) => call.source === "restaurants").length).toBeGreaterThan(1);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("shares active/null visibility, approved aggregation and full fields with detail and counts", async () => {
    state.client = catalogDb({ restaurants: [restaurant(), restaurant({ id: "hidden", slug: "hidden", is_active: false }), restaurant({ id: "foreign", slug: "foreign", country: "Canada" })],
      user_reviews: [{ id: "a", restaurant_id: "restaurant-1", rating: 5, status: "approved" }, { id: "b", restaurant_id: "restaurant-1", rating: 1, status: "pending" }] });
    const all = await getAllApprovedPlaces();
    expect(all).toHaveLength(1);
    expect(await getApprovedCommunityPlaceBySlug("jamaica-food")).toEqual(all[0]);
    expect(await getApprovedCommunityPlaceBySlug("hidden")).toBeNull();
    expect(await getPublicFoodSpotCount()).toBe(1);
  });
  it("distinguishes an outage from genuine empty/not-found responses", async () => {
    state.client = catalogDb({}, { errors: { restaurants: "schema missing" } });
    await expect(getAllApprovedPlaces()).rejects.toBeInstanceOf(CatalogUnavailableError);
    await expect(getApprovedCommunityPlaceBySlug("valid-slug")).rejects.toBeInstanceOf(CatalogUnavailableError);
    expect(await getPublicFoodSpotCount()).toBeNull();
    expect(formatFoodSpotCount(null)).toBeNull();
    state.client = catalogDb({ restaurants: [] });
    expect(await getAllApprovedPlaces()).toEqual([]);
    expect(await getApprovedCommunityPlaceBySlug("missing")).toBeNull();
    expect(await getPublicFoodSpotCount()).toBe(0);
    expect(formatFoodSpotCount(0)).toBe("0");
  });
  it("does not claim a stable total when duplicate identities cross a page boundary", async () => {
    state.client = catalogDb({ restaurants: [restaurant(), restaurant()] }, { cap: 1 });
    await expect(getAllApprovedPlaces()).rejects.toBeInstanceOf(CatalogUnavailableError);
  });
  it("rejects an incomplete response rather than publishing truncated counts", async () => {
    state.client = catalogDb({ restaurants: [restaurant(), restaurant({ id: "two", slug: "two" })] }, { cap: 1, truncate: true });
    await expect(getAllApprovedPlaces()).rejects.toBeInstanceOf(CatalogUnavailableError);
    state.client = catalogDb({ restaurants: [restaurant()] }, { nullCount: true });
    await expect(getAllApprovedPlaces()).rejects.toBeInstanceOf(CatalogUnavailableError);
  });
});
