import { describe, expect, it } from "vitest";
import { directionsUrl, googleMapsPlaceUrl, telUrl } from "@/lib/maps-links";

describe("Google Maps links", () => {
  it("opens the exact place when a place id is known", () => {
    const url = new URL(directionsUrl({ name: "ROK & Co", google_place_id: "ChIJabcdefghij123" }));
    expect(url.origin + url.pathname).toBe("https://www.google.com/maps/dir/");
    expect(url.searchParams.get("destination")).toBe("ROK & Co");
    expect(url.searchParams.get("destination_place_id")).toBe("ChIJabcdefghij123");
    expect(new URL(googleMapsPlaceUrl({ name: "Spot", google_place_id: "ChIJabcdefghij123" })).searchParams.get("query_place_id")).toBe("ChIJabcdefghij123");
  });
  it("falls back to coordinates, then the address", () => {
    expect(new URL(directionsUrl({ name: "Spot", lat: 18.1, lng: -77.2 })).searchParams.get("destination")).toBe("18.1,-77.2");
    expect(new URL(googleMapsPlaceUrl({ name: "Spot", address: "1 King St" })).searchParams.get("query")).toBe("Spot, 1 King St, Jamaica");
  });
  it("only builds call links from real phone numbers", () => {
    expect(telUrl("(876) 555-7311")).toBe("tel:8765557311");
    expect(telUrl("+1 876 555 7311")).toBe("tel:+18765557311");
    expect(telUrl("Not listed")).toBeNull();
    expect(telUrl(undefined)).toBeNull();
  });
});
