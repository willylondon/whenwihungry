import { describe, expect, it } from "vitest";
import { extractParishFromQuery } from "@/lib/location-validation";
import { isLooseMatch } from "@/lib/search/helpers";
import { isUsablePlaceId } from "@/lib/community";

describe("parish names inside a search", () => {
  it.each([
    ["seafood portland", "seafood", "Portland"],
    ["jerk in montego bay", "jerk", "St. James"],
    ["Saint Ann patty", "patty", "St. Ann"],
    ["negril", "", "Westmoreland"],
    ["Scotchies Ocho Rios", "scotchies", "St. Ann"]
  ])("%s searches %j within %s", (query, text, parish) => {
    expect(extractParishFromQuery(query)).toEqual({ text, parish });
  });
  it("leaves queries without a place alone, and needs whole words", () => {
    expect(extractParishFromQuery("curry goat")).toEqual({ text: "curry goat", parish: null });
    expect(extractParishFromQuery("Bostonian grill")).toEqual({ text: "Bostonian grill", parish: null });
  });
});

describe("search result trust", () => {
  it("flags only related/fuzzy matches as loose", () => {
    expect(isLooseMatch({ match_reason: "Related category/cuisine match" })).toBe(true);
    expect(isLooseMatch({ match_reason: "Fuzzy related match" })).toBe(true);
    expect(isLooseMatch({ match_reason: "Name match" })).toBe(false);
    expect(isLooseMatch({})).toBe(false);
  });
  it("does not trust invented Google place ids", () => {
    expect(isUsablePlaceId("ChIJs039K95xXo4RorB_t-7GZto")).toBe(true);
    expect(isUsablePlaceId("ChIJT-e8P-BxXo4Rf_f_crubar")).toBe(false);
    expect(isUsablePlaceId("bad id!")).toBe(false);
  });
});
