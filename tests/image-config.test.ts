import { describe, expect, it } from "vitest";
import { catalogImage, imageHosts } from "@/lib/image-config";

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
  it("retains supported public photography", () => {
    expect(catalogImage("https://images.unsplash.com/food.jpg")).toBe("https://images.unsplash.com/food.jpg");
  });
});
