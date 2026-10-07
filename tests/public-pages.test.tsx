// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { siteUrl } from "@/lib/site-url";
import type { PlaceV2 } from "@/lib/community";

const api = vi.hoisted(() => ({ all: vi.fn(), search: vi.fn(), detail: vi.fn(), user: vi.fn() }));
vi.mock("@/lib/community", () => ({ getAllApprovedPlaces: api.all, searchRestaurants: api.search, getApprovedCommunityPlaceBySlug: api.detail, getCurrentUser: api.user, getApprovedPlaceReviews: async () => [], CatalogUnavailableError: class extends Error {} }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }), useSearchParams: () => new URLSearchParams(), notFound: () => { throw new Error("NOT_FOUND"); } }));
vi.mock("next/image", () => ({ default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} /> }));
vi.mock("next/link", () => ({ default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={href} {...props}>{children}</a> }));
vi.mock("@/components/browse/map-view-wrapper", () => ({ MapViewWrapper: ({ places }: { places: PlaceV2[] }) => <div data-map-count={places.length} /> }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: async () => ({ from: () => { const query = { select: () => query, eq: () => query, order: () => query, limit: async () => ({ data: [], error: null }), maybeSingle: async () => ({ data: null, error: null }) }; return query; } }) }));

import BrowsePage, { generateMetadata as browseMetadata } from "@/app/browse/page";
import PlacePage, { generateMetadata as placeMetadata } from "@/app/places/[slug]/page";
import { ParishLinks } from "@/components/browse/parish-links";
import LocationPage, { generateMetadata as locationMetadata } from "@/app/restaurants/[location]/page";
import sitemap from "@/app/sitemap";

const base: PlaceV2 = {
  id: "fixture-id", slug: "fixture-place", name: "Fixture Food Spot", area: "Montego Bay", parish: "St. James", status: "approved",
  category: "Jerk", type: "Restaurant", description: "Directory description", image: "/logo.png", priceRange: "$$$", rating: 4.6,
  reviewCount: 900, reviews: [], features: [], hours: [], address: "", phone: "", website: "", community_rating: null,
  community_review_count: 0, rating_source: "public", public_rating: 4.6, public_review_count: 900, public_rating_source: "Google"
};
function parse(html: string) { return new DOMParser().parseFromString(html, "text/html"); }
beforeEach(() => {
  vi.clearAllMocks();
  api.all.mockResolvedValue([base]); api.search.mockResolvedValue([base]); api.detail.mockResolvedValue(base); api.user.mockResolvedValue(null);
});

describe("public routes", () => {
  it("bounds server HTML and client map data to 24 cards while showing total inventory", async () => {
    api.all.mockResolvedValue(Array.from({ length: 461 }, (_, i) => ({ ...base, id: `${i}`, slug: `fixture-${i}`, name: `Fixture ${i}` })));
    const html = renderToStaticMarkup(await BrowsePage({ searchParams: Promise.resolve({ page: "2", view: "map", sort: "az" }) }));
    const doc = parse(html);
    expect(doc.querySelectorAll("a.browse-card-link")).toHaveLength(24);
    expect(doc.querySelector("[data-map-count]")?.getAttribute("data-map-count")).toBe("24");
    expect(doc.body.textContent).toContain("Showing 25–48 of 461");
    expect(doc.querySelector('a[rel="next"]')?.getAttribute("href")).toContain("page=3");
    expect(html.length).toBeLessThan(150_000);
  });
  it("normalizes repeated URL parameters to bounded strings for rendering and metadata", async () => {
    const searchParams = Promise.resolve({ category: ["jerk", "seafood"], q: ["jerk", "seafood"], view: ["map", "list"], page: ["2", "3"] });
    await expect(BrowsePage({ searchParams })).resolves.toBeTruthy();
    expect(api.search).toHaveBeenCalledWith("jerk");
    expect(await browseMetadata({ searchParams })).toMatchObject({ alternates: { canonical: "/browse?category=jerk" }, robots: { index: false, follow: true } });
  });
  it("keeps legacy search values in the visible form", async () => {
    const doc = parse(renderToStaticMarkup(await BrowsePage({ searchParams: Promise.resolve({ query: "jerk", view: "list" }) })));
    expect(api.search).toHaveBeenCalledWith("jerk");
    expect(doc.querySelector('input[name="q"]')?.getAttribute("value")).toBe("jerk");
  });
  it.each(["constructor", "__proto__", "toString"])("treats unusual category input %s as a plain filter", async category => {
    await expect(BrowsePage({ searchParams: Promise.resolve({ category }) })).resolves.toBeTruthy();
  });
  it("preserves fetch failures instead of publishing a false zero-result page", async () => {
    api.all.mockRejectedValue(new Error("fixture outage"));
    await expect(BrowsePage({ searchParams: Promise.resolve({}) })).rejects.toThrow("fixture outage");
    await expect(sitemap()).rejects.toThrow("fixture outage");
  });
  it("uses self canonicals and keeps query variations out of the index", async () => {
    expect(await browseMetadata({ searchParams: Promise.resolve({}) })).toMatchObject({ alternates: { canonical: "/browse" } });
    expect(await browseMetadata({ searchParams: Promise.resolve({ category: "Jerk" }) })).toMatchObject({ alternates: { canonical: "/browse?category=jerk" } });
    expect(await browseMetadata({ searchParams: Promise.resolve({ q: "jerk" }) })).toMatchObject({ robots: { index: false, follow: true } });
    expect(await placeMetadata({ params: Promise.resolve({ slug: base.slug }) })).toMatchObject({ alternates: { canonical: "/places/fixture-place" } });
  });
  it("indexes real collection pages with their own canonical and rejects out-of-range pages", async () => {
    api.all.mockResolvedValue(Array.from({ length: 50 }, (_, i) => ({ ...base, slug: `place-${i}` })));
    const browse = await browseMetadata({ searchParams: Promise.resolve({ category: "Jerk", page: "2" }) });
    expect(browse.alternates?.canonical).toBe("/browse?category=jerk&page=2");
    expect(browse.robots).toBeUndefined();
    const local = await locationMetadata({ params: Promise.resolve({ location: "montego-bay" }), searchParams: Promise.resolve({ page: "2" }) });
    expect(local.alternates?.canonical).toBe("/restaurants/st-james?page=2");
    expect(local.robots).toBeUndefined();
    expect(await browseMetadata({ searchParams: Promise.resolve({ page: "999" }) })).toMatchObject({ robots: { index: false }, alternates: { canonical: "/browse?page=3" } });
    expect(await browseMetadata({ searchParams: Promise.resolve({ page: "2", sort: "az" }) })).toMatchObject({ robots: { index: false } });
  });
  it("links populated parish pages and excludes empty collections from the sitemap", async () => {
    const doc = parse(renderToStaticMarkup(<ParishLinks places={[base]} />));
    expect(doc.querySelector('a[href="/restaurants/st-james"]')).toBeTruthy();
    expect(doc.querySelector('a[href="/restaurants/portland"]')).toBeNull();
    const entries = await sitemap();
    expect(entries.some(entry => entry.url.endsWith("/restaurants/st-james"))).toBe(true);
    expect(entries.some(entry => entry.url.endsWith("/restaurants/portland"))).toBe(false);
    expect(entries.some(entry => entry.url.endsWith("category=seafood"))).toBe(false);
    expect(await browseMetadata({ searchParams: Promise.resolve({ category: "Seafood" }) })).toMatchObject({ robots: { index: false } });
  });
  it("renders St. James route using normalized public catalog data", async () => {
    const doc = parse(renderToStaticMarkup(await LocationPage({ params: Promise.resolve({ location: "st-james" }), searchParams: Promise.resolve({}) })));
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    expect(doc.querySelector("h1")?.textContent).toContain("St. James");
    expect(doc.querySelectorAll("a.browse-card-link")).toHaveLength(1);
    expect(doc.body.textContent).toContain("Fixture Food Spot");
  });
  it("renders authored review fields, video and listing description separately with matching schema", async () => {
    api.detail.mockResolvedValue({ ...base, has_critic_review: true, verdict: "WORTH_IT", headline: "Authored headline", honest_take: "Actual critic body", reviewed_at: "2026-10-01T12:00:00Z", visited_at: "2026-10-01", review_video_url: "https://www.tiktok.com/@fixture/video/123", admin_score: 80 });
    const doc = parse(renderToStaticMarkup(await PlacePage({ params: Promise.resolve({ slug: base.slug }) })));
    expect(doc.querySelector("#critic-heading")?.textContent).toBe("Authored headline");
    expect(doc.querySelector(".critic-body")?.textContent).toBe("Actual critic body");
    expect(doc.querySelector("#listing-heading")?.parentElement?.textContent).toContain("Directory description");
    expect(doc.querySelector('#video a')?.getAttribute("href")).toContain("/video/123");
    expect(doc.querySelector('time[dateTime="2026-10-01"]')).toBeTruthy();
    expect(doc.querySelector('time[dateTime="2026-10-01"]')?.textContent).toContain("1 October 2026");
    // The shared page never embeds one visitor's account state; the browser asks for it.
    expect(doc.body.textContent).toContain("Checking your account");
    const schema = JSON.parse(doc.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(schema[1].reviewBody).toBe("Actual critic body");
    expect(doc.body.textContent).toContain("Google: 4.6/5 · 900 ratings");
    expect(doc.body.textContent).toContain("$$$");
  });
  it("uses stable sitemap entries with no fabricated last-modified dates", async () => {
    const entries = await sitemap();
    expect(entries).toContainEqual(expect.objectContaining({ url: siteUrl("/places/fixture-place") }));
    expect(entries.every(entry => entry.lastModified === undefined)).toBe(true);
  });
});
