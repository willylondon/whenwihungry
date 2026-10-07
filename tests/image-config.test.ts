import { describe, expect, it } from "vitest";
import { catalogImage, imageHosts, listingImage, listingImageCredit } from "@/lib/image-config";

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

describe("listing photos and credits", () => {
  const storage = "https://abcdefghijklmnopqrst.supabase.co";
  const stored = `${storage}/storage/v1/object/public/restaurant-images/spot.jpg`;
  it.each([["Google Places", "Google"], ["Google", "Google"], ["OpenStreetMap", "OpenStreetMap"], [null, "Google"]])("shows imported photos from %s credited as %s", (source, credit) => {
    expect(listingImage({ image_url: stored, image_source: source }, storage)).toBe(stored);
    expect(listingImageCredit({ image_url: stored, image_source: source }, storage)).toBe(credit);
  });
  it("credits stock libraries by where the image is hosted", () => {
    expect(listingImageCredit({ image_url: "https://images.unsplash.com/food.jpg", image_source: "Google" })).toBe("Unsplash");
  });
  it("needs no credit for our own or restaurant-supplied photos", () => {
    expect(listingImageCredit({ image_url: "/images/reviews/rok-hotel/salmon.jpg", image_source: "WhenWiHungry" })).toBeNull();
    expect(listingImageCredit({ image_url: stored, image_source: "Restaurant supplied" }, storage)).toBeNull();
  });
  it("never credits or shows an unsafe or missing image", () => {
    expect(listingImage({ image_url: "javascript:alert(1)", image_source: "WhenWiHungry" })).toBe("/logo.png");
    expect(listingImageCredit({ image_url: null, image_source: "Google" })).toBeNull();
  });
});
