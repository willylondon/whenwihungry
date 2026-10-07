import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl, siteUrl } from "@/lib/site-url";
afterEach(() => vi.unstubAllEnvs());
describe("trusted public origin", () => {
  it("keeps the deployed Vercel default", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("https://whenwihungry.vercel.app");
    expect(siteUrl("/browse")).toBe("https://whenwihungry.vercel.app/browse");
  });
  it("uses an explicitly configured origin for metadata and callbacks", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com/");
    expect(siteUrl("/auth/callback")).toBe("https://preview.example.com/auth/callback");
  });
  it.each(["javascript:alert(1)", "https://name:password@example.com", "https://example.com/path", "https://example.com?q=x", "http://example.com"])("rejects unsafe/non-origin configuration %s", value => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", value);
    expect(getSiteUrl).toThrow();
  });
  it("allows localhost HTTP only outside production", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    vi.stubEnv("NODE_ENV", "development");
    expect(getSiteUrl()).toBe("http://localhost:3000");
    vi.stubEnv("NODE_ENV", "production");
    expect(getSiteUrl).toThrow();
  });
});
