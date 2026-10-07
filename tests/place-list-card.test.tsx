// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PlaceListCard } from "@/components/browse/place-list-card";
import type { PlaceV2 } from "@/lib/community";

vi.mock("next/image", () => ({ default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} /> }));
vi.mock("next/link", () => ({ default: ({ children, href, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={href} {...rest}>{children}</a> }));

const base: PlaceV2 = {
  id: "fixture-place", slug: "fixture-place", name: "Fixture Food Spot", area: "Negril", parish: "Westmoreland",
  category: "Jamaican", type: "Restaurant", description: "Directory description", image: "/logo.png",
  priceRange: "$$$", rating: 4.6, reviewCount: 900, reviews: [], features: [], hours: [], address: "", phone: "", website: "",
  community_rating: null, community_review_count: 0, rating_source: "public", public_rating: 4.6, public_review_count: 900, public_rating_source: "Google"
};
function render(overrides: Partial<PlaceV2> = {}) {
  const document = new DOMParser().parseFromString(renderToStaticMarkup(<PlaceListCard place={{ ...base, ...overrides }} />), "text/html");
  return document.body;
}

describe("PlaceListCard production data contract", () => {
  it("credits third-party photos and shows the placeholder without a photo", () => {
    const photo = render({ image: "https://images.unsplash.com/spot.jpg", image_credit: "Google" });
    expect(photo.querySelector(".photo-credit")?.textContent).toBe("Photo: Google");
    const none = render({ image: "/logo.png", image_credit: null });
    expect(none.querySelector(".photo-credit")).toBeNull();
    expect(none.querySelector(".listing-placeholder")).toBeTruthy();
  });
  it("requires published authored content, verdict and date for the critic CTA", () => {
    const card = render({ verdict: "WORTH_IT", headline: "Authored headline", honest_take: "Actual critic body", reviewed_at: "2026-10-01", has_critic_review: true });
    expect(card.textContent).toContain("Critic Reviewed");
    expect(card.textContent).toContain("Authored headline");
    expect(card.textContent).toContain("Worth It");
    expect(card.textContent).toContain("Read Verdict");
    expect(card.textContent).not.toContain("Directory description");
  });
  it("keeps verdict-only and explicit unpublished records as listings", () => {
    for (const overrides of [{ verdict: "MID" }, { verdict: "MID", headline: "Draft", reviewed_at: "2026-10-01", has_critic_review: false }]) {
      const card = render(overrides);
      // Plain listings carry no status label at all, and never a verdict.
      expect(card.textContent).not.toContain("Review Pending");
      expect(card.textContent).not.toContain("Mid");
      expect(card.textContent).toContain("View Listing");
      expect(card.textContent).not.toContain("Critic Reviewed");
    }
  });
  it("marks a listing with a published written review and links to it", () => {
    const card = render({ slug: "rok-hotel-kingston", name: "ROK Hotel Kingston" });
    expect(card.textContent).toContain("Reviewed by WhenWiHungry");
    expect(card.textContent).toContain("Run Go Get It");
    expect(card.textContent).toContain("Read Review");
  });
  it("shows accurate price and separates rating provenance", () => {
    const card = render({ community_rating: 3.5, community_review_count: 2 });
    expect(card.textContent).toContain("$$$");
    expect(card.textContent).toContain("Google: 4.6/5 · 900 ratings");
    expect(card.textContent).toContain("Community: 3.5/5 · 2 approved reviews");
    expect(render({ priceRange: "" }).textContent).toContain("Price not listed");
    expect(render({ priceRange: "", price_needs_confirmation: true }).textContent).toContain("Price needs confirmation");
  });
  it("routes a video-only place to its visible video section", () => {
    const card = render({ tiktok_url: "https://www.tiktok.com/@fixture/video/123" });
    expect(card.querySelector("a")?.getAttribute("href")).toBe("/places/fixture-place#video");
    expect(card.textContent).toContain("Watch Review");
  });
  it("does not turn an unsafe URL into a video review", () => {
    const card = render({ review_video_url: "javascript:alert(1)" });
    expect(card.querySelector("a")?.getAttribute("href")).toBe("/places/fixture-place");
    expect(card.textContent).not.toContain("Watch Review");
  });
});
