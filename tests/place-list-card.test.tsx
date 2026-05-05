// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PlaceListCard } from "@/components/browse/place-list-card";
import type { PlaceV2 } from "@/lib/community";

vi.mock("next/image", () => ({
  default: (props: Record<string, any>) => {
    const { alt, src, ...rest } = props;
    return <img alt={alt} src={typeof src === "string" ? src : ""} {...rest} />;
  }
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: Record<string, any>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}));

function renderCard(place: Partial<PlaceV2> & Record<string, any>) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  act(() => {
    root.render(<PlaceListCard place={place as PlaceV2} showMatchReason />);
  });

  return { container, root };
}

function makeBasePlace(overrides: Partial<PlaceV2> & Record<string, any> = {}) {
  return {
    area: "Negril",
    category: "International/Jamaican",
    description: "Cliffside restaurant with a clear summary block.",
    image: "https://example.com/ricks-cafe.jpg",
    match_reason: "Name match",
    name: "Rick's Cafe",
    parish: "Westmoreland",
    priceRange: "$$$",
    public_review_count: 18231,
    public_rating: 4.6,
    rating: 4.6,
    reviewCount: 18231,
    slug: "ricks-cafe",
    type: "International/Jamaican",
    ...overrides
  };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("PlaceListCard", () => {
  it("renders the reviewed state with the restaurant name and critic CTA", () => {
    const { container } = renderCard(
      makeBasePlace({
        critic_review_body: "The jerk snapper is worth the stop.",
        critic_reviewed_at: "2026-05-04T10:00:00.000Z",
        critic_verdict: "WORTH_IT",
        name: "",
        title: "Rick's Cafe"
      })
    );

    expect(container.textContent).toContain("THE HONEST TAKE");
    expect(container.textContent).toContain("Rick's Cafe");
    expect(container.textContent).toContain("Worth It");
    expect(container.textContent).toContain("READ TRUTH");
    expect(container.textContent).toContain("18,000+ public reviews");
  });

  it("renders the listing state for unreviewed search results without legacy critic language", () => {
    const { container } = renderCard(
      makeBasePlace({
        description: "",
        name: "",
        public_listing_summary: "Public listing information for Rick's Cafe.",
        restaurant_name: "Rick's Cafe",
        source_status: "public_import"
      })
    );

    expect(container.textContent).toContain("LISTING INFO");
    expect(container.textContent).toContain("Rick's Cafe");
    expect(container.textContent).toContain("NOT YET REVIEWED");
    expect(container.textContent).toContain("VIEW LISTING");
    expect(container.textContent).not.toContain("THE HONEST TAKE");
    expect(container.textContent).not.toContain("READ TRUTH");
  });

  it("keeps needs-verification listings on the same listing-safe language", () => {
    const { container } = renderCard(
      makeBasePlace({
        name: "",
        needs_review: true,
        place_name: "Roselle's",
        source_status: "needs_verification"
      })
    );

    expect(container.textContent).toContain("LISTING INFO");
    expect(container.textContent).toContain("Roselle's");
    expect(container.textContent).toContain("NOT YET REVIEWED");
    expect(container.textContent).toContain("VIEW LISTING");
    expect(container.textContent).not.toContain("THE HONEST TAKE");
  });
});
