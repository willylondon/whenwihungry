import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ guard: vi.fn(), updateTag: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/require-admin", () => ({ requireAdmin: mocks.guard }));
vi.mock("next/cache", () => ({ updateTag: mocks.updateTag, revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } }));
import { refreshPublicSiteAction } from "@/app/admin/cache/actions";
import { CATALOG_CACHE_TAG } from "@/lib/cache-tags";

const form = (back?: string) => { const data = new FormData(); if (back) data.set("back", back); return data; };

describe("refresh public site", () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it("refuses non-admins before touching the cache", async () => {
    mocks.guard.mockRejectedValueOnce(new Error("REDIRECT:/"));
    await expect(refreshPublicSiteAction(form())).rejects.toThrow("REDIRECT:/");
    expect(mocks.updateTag).not.toHaveBeenCalled();
  });
  it("expires the catalog and only returns to admin pages", async () => {
    await expect(refreshPublicSiteAction(form("/admin/listings?x=1"))).rejects.toThrow("REDIRECT:/admin/listings?refreshed=1");
    expect(mocks.updateTag).toHaveBeenCalledWith(CATALOG_CACHE_TAG);
    await expect(refreshPublicSiteAction(form("https://evil.example/admin/"))).rejects.toThrow("REDIRECT:/admin/restaurants?refreshed=1");
  });
});
