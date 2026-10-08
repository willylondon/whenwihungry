import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { catalogDb, restaurant } from "./helpers/catalog-db";
const state = vi.hoisted(() => ({ client: null as any }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn(async () => state.client) }));
vi.mock("@/lib/supabase/public", () => ({ createSupabasePublicClient: vi.fn(() => state.client) }));
import { CatalogUnavailableError, searchRestaurants } from "@/lib/community";

import type { Place } from "@/data/places";
import {
  buildRestaurantSearchDocument,
  rankPlacesForQuery,
  type SearchableRestaurantRecord
} from "@/lib/search/engine";
import { normalizeSearchQuery } from "@/lib/search/helpers";

function makePlace(record: SearchableRestaurantRecord): Place & { search_document: ReturnType<typeof buildRestaurantSearchDocument> } {
  return {
    address: record.address || "",
    area: record.area || "",
    category: record.category || "",
    description: record.description || "",
    features: [],
    hours: [],
    image: "",
    name: record.name || "",
    parish: record.parish || "",
    phone: "",
    priceRange: record.price_range || "$$",
    rating: 4.5,
    reviewCount: 100,
    reviews: [],
    search_document: buildRestaurantSearchDocument(record),
    slug: String(record.slug || record.name || Math.random()),
    type: record.cuisine_type || record.category || "",
    website: ""
  };
}

const fixturePlaces = [
  makePlace({
    name: "Bull Grill",
    slug: "bull-grill",
    parish: "Hanover",
    area: "Hopewell",
    category: "Jamaican",
    cuisine_type: "Jamaican",
    price_level: 1,
    price_range: "$",
    description: "Outstanding local jerk chicken and burgers.",
    menu_items: ["burger", "jerk chicken"]
  }),
  makePlace({
    name: "Jojo's Jerk Pit",
    slug: "jojos-jerk-pit",
    parish: "St. Catherine",
    area: "Portmore",
    category: "Jerk",
    cuisine_type: "Jerk",
    price_level: 2,
    price_range: "$$",
    description: "Authentic jerk chicken and pork in Portmore."
  }),
  makePlace({
    name: "Cosmo's Seafood Restaurant",
    slug: "cosmos-seafood",
    parish: "Westmoreland",
    area: "Negril",
    category: "Seafood",
    cuisine_type: "Seafood",
    price_level: 2,
    price_range: "$$",
    description: "Classic beachfront spot for curried conch and steamed fish."
  }),
  makePlace({
    name: "Devon House I-Scream",
    slug: "devon-house-i-scream",
    parish: "Kingston",
    area: "Kingston",
    category: "Dessert",
    cuisine_type: "Dessert",
    price_level: 1,
    price_range: "$",
    description: "World-famous Jamaican ice cream.",
    aliases: ["devon house ice cream"],
    menu_items: ["ice cream"]
  }),
  makePlace({
    name: "CRU Bar and Kitchen",
    slug: "cru-bar-and-kitchen",
    parish: "St. Andrew",
    area: "Kingston 10",
    category: "Fusion",
    cuisine_type: "Fusion",
    price_level: 3,
    price_range: "$$$",
    description: "Premium rooftop bar with unique fusion dishes and cocktails."
  }),
  makePlace({
    name: "Moby Dick",
    slug: "moby-dick",
    parish: "Kingston",
    area: "Downtown Kingston",
    category: "Jamaican",
    cuisine_type: "Jamaican",
    price_level: 1,
    price_range: "$",
    description: "Best curry goat in downtown Kingston.",
    best_dish: "curry goat"
  }),
  makePlace({
    name: "Juici Patties (Original)",
    slug: "juici-patties-original",
    parish: "Clarendon",
    area: "May Pen",
    category: "Jamaican",
    cuisine_type: "Jamaican",
    price_level: 1,
    price_range: "$",
    description: "Home of the original Juici patties in May Pen."
  }),
  makePlace({
    name: "Hellshire Beach Fish",
    slug: "hellshire-beach-fish",
    parish: "St. Catherine",
    area: "Hellshire",
    category: "Seafood",
    cuisine_type: "Seafood",
    price_level: 2,
    price_range: "$$",
    description: "Iconic beachside fried fish and festival."
  }),
  makePlace({
    name: "Rick's Cafe",
    slug: "ricks-cafe",
    parish: "Westmoreland",
    area: "Negril",
    category: "International/Jamaican",
    cuisine_type: "International/Jamaican",
    price_level: 3,
    price_range: "$$$",
    description: "Clifftop restaurant and bar with big public appeal."
  }),
  makePlace({
    name: "Jack Sprat Restaurant",
    slug: "jack-sprat-restaurant",
    parish: "St. Elizabeth",
    area: "Treasure Beach",
    category: "Seafood/Pizza",
    cuisine_type: "Seafood/Pizza",
    price_level: 2,
    price_range: "$$",
    description: "Relaxed beachside spot famous for seafood pizza.",
    menu_items: ["seafood pizza"]
  }),
  makePlace({
    name: "Roselle's",
    slug: "roselles",
    parish: "St. Andrew",
    area: "Kingston",
    category: "Cafe",
    cuisine_type: "Cafe",
    price_level: 2,
    price_range: "$$",
    description: "Neighborhood brunch and pastry listing.",
    search_keywords: ["coffee", "breakfast"]
  }),
  makePlace({
    name: "Chris's Cook Shop",
    slug: "chriss-cook-shop",
    parish: "St. Mary",
    area: "Highgate",
    category: "Cook Shop",
    cuisine_type: "Jamaican",
    price_level: 1,
    price_range: "$",
    description: "Beloved local spot for curried goat and stewed peas.",
    best_dish: "curried goat and stewed peas"
  })
];

describe("search helpers", () => {
  it("normalizes close-match Jamaican food queries", () => {
    expect(normalizeSearchQuery("  icecream ")).toBe("ice cream");
    expect(normalizeSearchQuery("fry chicken")).toBe("fried chicken");
    expect(normalizeSearchQuery("curried goat")).toBe("curry goat");
    expect(normalizeSearchQuery("patties")).toBe("patty");
  });

  it("returns related chicken spots instead of zero results", () => {
    const results = rankPlacesForQuery("fried chicken", fixturePlaces);
    const names = results.slice(0, 3).map((place) => place.name);

    expect(results.length).toBeGreaterThan(0);
    expect(names).toEqual(expect.arrayContaining(["Bull Grill", "Jojo's Jerk Pit"]));
  });

  it("matches steamed fish and fried fish through the shared search document", () => {
    const steamed = rankPlacesForQuery("steam fish", fixturePlaces);
    const fried = rankPlacesForQuery("fried fish", fixturePlaces);

    expect(steamed[0]?.name).toBe("Cosmo's Seafood Restaurant");
    expect(fried[0]?.name).toBe("Hellshire Beach Fish");
  });

  it("matches dish-level search phrases through the combined search blob", () => {
    expect(rankPlacesForQuery("curry goat", fixturePlaces)[0]?.name).toBe("Moby Dick");
    expect(rankPlacesForQuery("seafood pizza", fixturePlaces)[0]?.name).toBe("Jack Sprat Restaurant");
    expect(rankPlacesForQuery("ice cream", fixturePlaces)[0]?.name).toBe("Devon House I-Scream");
    expect(rankPlacesForQuery("coffee", fixturePlaces)[0]?.name).toBe("Roselle's");
  });

  it("surfaces vibe and budget searches through derived tags", () => {
    const dateNight = rankPlacesForQuery("date night", fixturePlaces);
    const cheapEats = rankPlacesForQuery("cheap eats", fixturePlaces);

    expect(dateNight[0]?.name).toBe("CRU Bar and Kitchen");
    expect(cheapEats.length).toBeGreaterThan(0);
    expect(cheapEats.map((place) => place.name)).toContain("Juici Patties (Original)");
  });

  it("keeps named search queries attached to the correct restaurant titles", () => {
    expect(rankPlacesForQuery("rick", fixturePlaces)[0]?.name).toBe("Rick's Cafe");
    expect(rankPlacesForQuery("jack sprat", fixturePlaces)[0]?.name).toBe("Jack Sprat Restaurant");
    expect(rankPlacesForQuery("roselle", fixturePlaces)[0]?.name).toBe("Roselle's");
  });

  it("finds location-led searches without manual aliases", () => {
    expect(rankPlacesForQuery("kingston", fixturePlaces).map((place) => place.name)).toContain("Moby Dick");
    expect(rankPlacesForQuery("st mary", fixturePlaces)[0]?.name).toBe("Chris's Cook Shop");
  });
});


beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Network is forbidden in unit tests"); }));
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("production searchRestaurants data path", () => {
  it("hydrates ranked identities using approved full rows, preserving coordinates and provenance", async () => {
    state.client = catalogDb({
      search_restaurants: [{ id: "restaurant-1", slug: "wrong-slug", name: "Stale RPC Name", public_rating: 1, admin_score: 40, final_score: 99, match_reason: "Dish match" }],
      restaurants: [restaurant({ public_rating: 4.8, public_review_count: 900, public_rating_source: "Google", tiktok_url: "https://www.tiktok.com/@wwh/video/123", website: "https://example.com/menu", price_range: "$$$$" })]
    });
    const results = await searchRestaurants("jerk");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ name: "Jamaica Food", slug: "jamaica-food", lat: 18.47, lng: -77.92, priceRange: "$$$$", public_rating_source: "Google", rating: 4.8, rating_source: "public", final_score: 99 });
    expect(results[0].admin_score).toBeUndefined();
    expect(results[0].tiktok_url).toContain("tiktok.com");
    expect(fetch).not.toHaveBeenCalled();
    expect(state.client.calls.some((call: any) => call.source === "search_logs")).toBe(false);
  });
  it("discards unapproved, inactive, rejected and foreign RPC candidates before returning any public data", async () => {
    const invalid = [restaurant({ id: "pending", slug: "pending", status: "pending" }), restaurant({ id: "inactive", slug: "inactive", is_active: false }),
      restaurant({ id: "bad", slug: "bad", data_quality_status: "rejected" }), restaurant({ id: "foreign", slug: "foreign", address: "Toronto, Canada" })];
    state.client = catalogDb({ restaurants: [restaurant(), ...invalid], search_restaurants: [restaurant(), ...invalid].map((row, i) => ({ id: row.id, final_score: 100 - i })) });
    expect((await searchRestaurants("food")).map((place) => place.id)).toEqual(["restaurant-1"]);
  });
  it("supports slug-only RPC identities and paginates ranked/hydrated records", async () => {
    const restaurants = Array.from({ length: 205 }, (_, i) => restaurant({ id: `id-${i}`, slug: `spot-${i}` }));
    state.client = catalogDb({ restaurants, search_restaurants: restaurants.map((row, i) => ({ slug: row.slug, final_score: 1000 - i })) }, { cap: 13 });
    const results = await searchRestaurants("food");
    expect(results).toHaveLength(205);
    expect(results[0].slug).toBe("spot-0");
    expect(results[204].slug).toBe("spot-204");
  });
  it("adds strong local matches the database ranking missed, below the database results", async () => {
    const bakery = restaurant({ id: "bakery", slug: "the-bakery", name: "The Bakery", dish_tags: ["patty"] });
    const juici = restaurant({ id: "juici", slug: "juici-patties", name: "Juici Patties", category: "Patties" });
    const unrelated = restaurant({ id: "other", slug: "other-spot", name: "Other Spot", category: "Seafood" });
    state.client = catalogDb({ restaurants: [bakery, juici, unrelated], search_restaurants: [{ id: "bakery", final_score: 70, match_reason: "Dish tag match" }] });
    const results = await searchRestaurants("patty");
    expect(results.map((place) => place.slug)).toEqual(["the-bakery", "juici-patties"]);
    expect(results[0].final_score).toBe(70);
    expect(results[1].final_score).toBeLessThan(70);
  });
  it("falls back to the shared approved full-row search on an unavailable RPC", async () => {
    state.client = catalogDb({ restaurants: [restaurant({ name: "Jerk Chicken Hut", description: "Smoky chicken", slug: "chicken" }), restaurant({ id: "dessert", name: "Ice Cream", slug: "dessert", description: "Jamaican dessert" })] }, { errors: { search_restaurants: "RPC not found" } });
    expect((await searchRestaurants("fry chicken")).map((place) => place.slug)).toEqual(["chicken"]);
    expect(state.client.rpc.mock.calls[0][1]).toEqual({ search_query: "fried chicken" });
  });
  it("propagates a catalog outage instead of pretending search has no matches", async () => {
    state.client = catalogDb({}, { errors: { search_restaurants: "RPC unavailable", restaurants: "database unavailable" } });
    await expect(searchRestaurants("food")).rejects.toBeInstanceOf(CatalogUnavailableError);
  });
  it("returns all approved places for whitespace without logging the query", async () => {
    state.client = catalogDb({ restaurants: [restaurant()] });
    expect(await searchRestaurants("  ")).toHaveLength(1);
    expect(state.client.rpc).not.toHaveBeenCalled();
    expect(state.client.calls.every((call: any) => ["restaurants", "user_reviews"].includes(call.source))).toBe(true);
  });
});
