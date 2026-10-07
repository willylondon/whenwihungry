// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SearchFilters } from "@/components/browse/search-filters";
import { HeroSection } from "@/components/home/hero-section";
import { paginate, pageHref, updateBrowseParams, normalizeBrowseParams } from "@/lib/browse-pagination";

function dom(html: string) { return new DOMParser().parseFromString(html, "text/html"); }

describe("browse navigation and accessibility", () => {
  it("labels every search/select and groups keyboard-accessible view options", () => {
    const doc = dom(renderToStaticMarkup(<SearchFilters categories={["Jerk"]} parishes={["Kingston"]} activeQuery="jerk" activeView="map" activeSort="az" />));
    for (const input of doc.querySelectorAll('input[type="search"], select')) expect(input.closest("label")?.textContent).toBeTruthy();
    expect(doc.querySelector('fieldset legend')?.textContent).toBe("Results view");
    expect(doc.querySelector('input[name="q"]')?.getAttribute("value")).toBe("jerk");
    expect(doc.querySelector('input[value="map"]')?.hasAttribute("checked")).toBe(true);
    expect(doc.querySelector('select[name="sort"] option[selected]')?.getAttribute("value")).toBe("az");
    expect(doc.querySelector('input[name="page"]')).toBeNull();
  });
  it("normalizes duplicate values and bounds untrusted query lengths", () => {
    expect(normalizeBrowseParams({ q: [" first ", "second"], category: [], unknown: "ignored" })).toEqual({ q: "first" });
    expect(normalizeBrowseParams({ q: "x".repeat(1000) }).q).toHaveLength(200);
  });
  it("preserves view/sort and unrelated filters for chips, resets page", () => {
    expect(updateBrowseParams("q=jerk&parish=Kingston&sort=az&view=map&page=3", { price: "$" })).toBe("?q=jerk&parish=Kingston&sort=az&view=map&price=%24");
    expect(updateBrowseParams("q=jerk&sort=az&view=map&page=3", {}, true)).toBe("?sort=az&view=map");
    expect(updateBrowseParams("query=old&search=older&view=list", { q: "new" })).toBe("?view=list&q=new");
  });
  it("renders only 24 of 461 results and clamps invalid/out-of-range pages", () => {
    const fixtures = Array.from({ length: 461 }, (_, i) => i);
    expect(paginate(fixtures).items).toHaveLength(24);
    expect(paginate(fixtures, "2")).toMatchObject({ page: 2, offset: 24, totalPages: 20 });
    expect(paginate(fixtures, "999")).toMatchObject({ page: 20, offset: 456, items: [456, 457, 458, 459, 460] });
    expect(paginate(fixtures, "NaN").page).toBe(1);
    expect(paginate(fixtures, "-2").page).toBe(1);
    expect(paginate(fixtures, "1.5").page).toBe(1);
    expect(paginate([], "99")).toMatchObject({ page: 1, totalPages: 1, items: [] });
  });
  it("preserves the complete query when paging", () => {
    expect(pageHref("/browse", { q: "curry goat", parish: "St. James", sort: "rating", view: "map", page: "1" }, 2)).toBe("/browse?q=curry+goat&parish=St.+James&sort=rating&view=map&page=2");
  });
  it("labels the homepage search and does not invent an unavailable count", () => {
    const doc = dom(renderToStaticMarkup(<HeroSection foodSpotCountLabel={null} />));
    const input = doc.querySelector('input[type="search"]')!;
    expect(doc.querySelector(`label[for="${input.id}"]`)?.textContent).toBe("Search food spots");
    expect(doc.body.textContent).not.toContain("400+");
    expect(doc.body.textContent).not.toContain("food spots to explore");
  });
});
