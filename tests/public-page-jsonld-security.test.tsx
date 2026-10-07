// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ allPlaces: vi.fn(), place: vi.fn(), user: vi.fn(), createClient: vi.fn() }));
vi.mock("@/lib/community", () => ({ getAllApprovedPlaces: mocks.allPlaces, searchRestaurants: mocks.allPlaces, getApprovedCommunityPlaceBySlug: mocks.place, getCurrentUser: mocks.user }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: mocks.createClient }));
vi.mock("@/lib/places", () => ({ categories: [], getFilteredPlaces: () => [], getParishStats: () => [] }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
vi.mock("next/link", () => ({ default: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/components/browse/map-view-wrapper", () => ({ MapViewWrapper: () => null }));
vi.mock("@/components/browse/place-list-card", () => ({ PlaceListCard: () => null }));
vi.mock("@/components/browse/search-filters", () => ({ SearchFilters: () => null }));
vi.mock("@/components/browse/filter-chips", () => ({ FilterChips: () => null }));
vi.mock("@/components/place/review-section", () => ({ ReviewSection: () => null }));
vi.mock("@/components/place/social-share", () => ({ SocialShare: () => null }));

import BrowsePage from "@/app/browse/page";
import LocationPage from "@/app/restaurants/[location]/page";
import PlacePage from "@/app/places/[slug]/page";

const payload = "</script><script>window.__auditMarker=true</script>";

function parsePage(tree: ReactNode) {
  const template = document.createElement("template");
  template.innerHTML = renderToStaticMarkup(tree);
  const scripts = template.content.querySelectorAll("script");
  expect(scripts).toHaveLength(1);
  expect(scripts[0].type).toBe("application/ld+json");
  expect(scripts[0].textContent).not.toContain("<");
  return JSON.parse(scripts[0].textContent!) as Record<string, unknown> | Record<string, unknown>[];
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.allPlaces.mockResolvedValue([]);
  mocks.user.mockResolvedValue(null);
  const query = {
    select: () => query, eq: () => query, order: () => query,
    limit: async () => ({ data: [], error: null })
  };
  mocks.createClient.mockResolvedValue({ from: () => query });
  mocks.place.mockResolvedValue({
    id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee", slug: "test-spot", name: "Test Spot",
    description: payload, address: payload, parish: "Kingston", area: "Kingston", category: "Jerk",
    image: "/logo.png", features: [], hours: [], reviews: [], phone: "", priceRange: "$$",
    verdict: "MAD", headline: payload, honest_take: payload, reviewed_at: "2026-10-01T12:00:00Z",
    published_at: "2026-10-01T12:00:00Z", review_status: "published", has_critic_review: true, admin_score: 85
  });
});

describe("actual public JSON-LD page regressions", () => {
  it.each(["category", "parish"])("keeps the reflected %s closing-script marker inert", async (field) => {
    const schema = parsePage(await BrowsePage({ searchParams: Promise.resolve({ [field]: payload }) }));
    expect((schema as Record<string, unknown>).name).toContain(payload);
  });
  it("rejects a closing-script location route rather than rendering attacker-chosen schema", async () => {
    await expect(LocationPage({ params: Promise.resolve({ location: payload }), searchParams: Promise.resolve({}) })).rejects.toThrow("NOT_FOUND");
    expect(mocks.allPlaces).not.toHaveBeenCalled();
  });
  it("keeps normal supported parish schemas valid", async () => {
    const schema = parsePage(await LocationPage({ params: Promise.resolve({ location: "kingston" }), searchParams: Promise.resolve({}) }));
    expect((schema as Record<string, unknown>)["@type"]).toBe("ItemList");
  });
  it("keeps stored description/address/headline/review closing-script markers inert", async () => {
    const schema = parsePage(await PlacePage({ params: Promise.resolve({ slug: "test-spot" }) })) as Record<string, unknown>[];
    expect(schema[0].description).toBe(payload);
    expect((schema[0].address as Record<string, unknown>).streetAddress).toBe(payload);
    expect(schema[1].name).toBe(payload);
    expect(schema[1].reviewBody).toBe(payload);
  });
});
