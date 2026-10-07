import { describe, expect, it } from "vitest";
import { readSupabaseConfig } from "../src/lib/supabase/config";

describe("explicit Supabase configuration", () => {
  it("fails closed instead of selecting a shared project", () => {
    expect(() => readSupabaseConfig({})).toThrow("not configured");
    expect(() => readSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co" })).toThrow();
  });
  it("accepts explicitly selected HTTPS or local endpoints", () => {
    expect(readSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co/", NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key" })).toEqual({url:"https://example.supabase.co",anonKey:"public-key"});
    expect(readSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321", NEXT_PUBLIC_SUPABASE_ANON_KEY: "local-key" }).url).toBe("http://127.0.0.1:54321");
  });
  it("rejects insecure remote endpoints and embedded credentials", () => {
    for (const url of ["http://example.com", "https://name:password@example.com", "https://example.com?key=secret", "javascript:alert(1)"]) {
      expect(() => readSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL:url, NEXT_PUBLIC_SUPABASE_ANON_KEY:"key" })).toThrow();
    }
  });
});
