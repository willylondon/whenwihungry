import { describe, expect, it } from "vitest";
import { catalogImage, hasImageRights, imageHosts, listingImage } from "@/lib/image-config";

describe("catalog image deployment contract", () => {
  const staging = "https://abcdefghijklmnopqrst.supabase.co";
  it("allows the explicitly configured staging storage host without a production fallback", () => {
    const image = `${staging}/storage/v1/object/public/images/food.jpg`;
    expect(catalogImage(image, staging)).toBe(image);
    expect(imageHosts()).not.toContain("dnlzaduonznhhlmyxrgh.supabase.co");
    expect(catalogImage(image)).toBe("/logo.png");
  });
  it.each(["http://images.unsplash.com/x.jpg", "https://unknown.example/x.jpg", "https://images.unsplash.com:4430/x.jpg", "https://user:password@images.unsplash.com/x.jpg", "javascript:alert(1)", null])("uses a renderable local fallback for unsupported %s", (image) => {
    expect(catalogImage(image, staging)).toBe("/logo.png");
  });
  it("allows only our shipped review photography as a local listing image", () => {
    expect(catalogImage("/images/reviews/rok-hotel/salmon.jpg")).toBe("/images/reviews/rok-hotel/salmon.jpg");
    for (const path of ["/images/reviews/../../secret.jpg", "/images/restaurants/x.jpg", "//evil.example/images/reviews/a/b.jpg", "/images/reviews/a/b.svg"]) expect(catalogImage(path)).toBe("/logo.png");
  });
  it("retains supported public photography", () => {
    expect(catalogImage("https://images.unsplash.com/food.jpg")).toBe("https://images.unsplash.com/food.jpg");
  });
});

describe("listing photo rights", () => {
  const storage = "https://abcdefghijklmnopqrst.supabase.co";
  const stored = `${storage}/storage/v1/object/public/restaurant-images/spot.jpg`;
  it.each(["Google Places", "Google", "OpenStreetMap", null, ""])("hides re-hosted photos from %s behind the placeholder", (source) => {
    expect(listingImage({ image_url: stored, image_source: source }, storage)).toBe("/logo.png");
  });
  it("shows our own, restaurant-supplied and free-licence stock photos", () => {
    expect(listingImage({ image_url: "/images/reviews/rok-hotel/salmon.jpg", image_source: "WhenWiHungry" })).toBe("/images/reviews/rok-hotel/salmon.jpg");
    expect(listingImage({ image_url: stored, image_source: " Restaurant supplied " }, storage)).toBe(stored);
    expect(listingImage({ image_url: "https://images.unsplash.com/food.jpg", image_source: "Google" })).toBe("https://images.unsplash.com/food.jpg");
    expect(hasImageRights("whenwihungry", "javascript:alert(1)")).toBe(true);
    // Rights never bypass the safe-location checks.
    expect(listingImage({ image_url: "javascript:alert(1)", image_source: "WhenWiHungry" })).toBe("/logo.png");
  });
});
