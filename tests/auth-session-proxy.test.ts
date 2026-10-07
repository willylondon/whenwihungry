import type { CookieMethodsServer } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ createServerClient: vi.fn(), getClaims: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));
vi.mock("@/lib/supabase/config", () => ({ supabaseUrl: "http://127.0.0.1:54321", supabaseAnonKey: "isolated-test-key" }));

import { updateSession } from "@/lib/supabase/proxy";

let cookies: CookieMethodsServer;
beforeEach(() => {
  vi.clearAllMocks();
  mocks.createServerClient.mockImplementation((_url: string, _key: string, options: { cookies: CookieMethodsServer }) => {
    cookies = options.cookies;
    return { auth: { getClaims: mocks.getClaims } };
  });
  mocks.getClaims.mockResolvedValue({ data: { claims: { sub: "verified-user" } }, error: null });
});

describe("SSR session refresh", () => {
  it("makes no auth request for a public visitor without a session", async () => {
    const response = await updateSession(new NextRequest("https://app.example/browse"));
    expect(response.status).toBe(200);
    expect(mocks.createServerClient).not.toHaveBeenCalled();
    expect(mocks.getClaims).not.toHaveBeenCalled();
  });
  it("does not treat an unrelated or PKCE verifier cookie as a session", async () => {
    await updateSession(new NextRequest("https://app.example/browse", { headers: { cookie: "theme=dark; sb-project-auth-token-code-verifier=opaque" } }));
    expect(mocks.getClaims).not.toHaveBeenCalled();
  });
  it("refreshes chunked session cookies in both the request and response", async () => {
    const request = new NextRequest("https://app.example/browse", { headers: { cookie: "sb-project-auth-token.0=old" } });
    mocks.getClaims.mockImplementation(async () => {
      expect(await cookies.getAll()).toContainEqual({ name: "sb-project-auth-token.0", value: "old" });
      await cookies.setAll!([{ name: "sb-project-auth-token.0", value: "refreshed", options: { httpOnly: true, secure: true, path: "/", sameSite: "lax" } }], { "Cache-Control": "private, no-store", "Expires": "0", "Pragma": "no-cache" });
      return { data: { claims: { sub: "verified-user" } }, error: null };
    });
    const response = await updateSession(request);
    expect(request.cookies.get("sb-project-auth-token.0")?.value).toBe("refreshed");
    expect(response.cookies.get("sb-project-auth-token.0")?.value).toBe("refreshed");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("Secure");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("expires")).toBe("0");
    expect(mocks.getClaims).toHaveBeenCalledOnce();
  });
  it("does not cache a signed-in response even when no refresh is needed", async () => {
    const response = await updateSession(new NextRequest("https://app.example/browse", { headers: { cookie: "sb-project-auth-token=current" } }));
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
});
