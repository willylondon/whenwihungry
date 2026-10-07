import { vi } from "vitest";

// Unit tests run outside Next's request/incremental cache, so shared caching is a pass-through here.
vi.mock("next/cache", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/cache")>()),
  unstable_cache: <T>(fn: T) => fn
}));
