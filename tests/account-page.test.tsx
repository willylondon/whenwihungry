import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const api = vi.hoisted(() => ({ getUser: vi.fn(), maybeSingle: vi.fn(), createClient: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: api.createClient }));
vi.mock("@/app/auth/actions", () => ({ signOutAction: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`REDIRECT:${path}`); } }));
import AccountPage from "@/app/account/page";

beforeEach(() => {
  api.getUser.mockResolvedValue({ data: { user: { id: "test-user", email: "owner@example.test", user_metadata: { role: "admin" } } }, error: null });
  api.maybeSingle.mockResolvedValue({ data: { role: "user" }, error: null });
  api.createClient.mockResolvedValue({ auth: { getUser: api.getUser }, from: () => ({ select: () => ({ eq: () => ({ maybeSingle: api.maybeSingle }) }) }) });
});

describe("account session boundaries", () => {
  it.each([
    { data: { user: null }, error: null },
    { data: { user: { is_anonymous: true } }, error: null },
    { data: { user: { id: "test-user" } }, error: { message: "verification failed" } }
  ])("requires a verified permanent user", async result => {
    api.getUser.mockResolvedValue(result);
    await expect(AccountPage()).rejects.toThrow("REDIRECT:/sign-in?next=%2Faccount");
    expect(api.maybeSingle).not.toHaveBeenCalled();
  });
  it("shows session identity and sign-out without trusting user metadata for admin access", async () => {
    const html = renderToStaticMarkup(await AccountPage());
    expect(html).toContain("owner@example.test");
    expect(html).toContain("Sign out");
    expect(html).not.toContain("Administration");
  });
  it("shows administration only for a verified database role", async () => {
    api.maybeSingle.mockResolvedValue({ data: { role: "admin" }, error: null });
    expect(renderToStaticMarkup(await AccountPage())).toContain("Administration");
    api.maybeSingle.mockResolvedValue({ data: { role: "admin" }, error: { message: "denied" } });
    expect(renderToStaticMarkup(await AccountPage())).not.toContain("Administration");
  });
});
