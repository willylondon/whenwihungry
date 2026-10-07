import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  redirect: vi.fn((path: string): never => { throw new Error(`REDIRECT:${path}`); }),
  auth: {
    signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn(), getUser: vi.fn(),
    resetPasswordForEmail: vi.fn(), updateUser: vi.fn(), exchangeCodeForSession: vi.fn(), verifyOtp: vi.fn()
  },
  maybeSingle: vi.fn(), from: vi.fn(), select: vi.fn(), eq: vi.fn()
}));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: mocks.createClient }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/site-url", () => ({ siteUrl: (path: string) => new URL(path, "https://app.example").toString() }));

import { signInAction, signUpAction, signOutAction, requestPasswordResetAction, updatePasswordAction } from "@/app/auth/actions";
import { requireAdmin } from "@/lib/auth/require-admin";
import { GET as callback } from "@/app/auth/callback/route";
import { GET as confirm } from "@/app/auth/confirm/route";

function form(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}
const user = { id: "user-1", user_metadata: { role: "admin" } };
const session = { access_token: "mock-only" };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.createClient.mockResolvedValue({ auth: mocks.auth, from: mocks.from });
  mocks.from.mockReturnValue({ select: mocks.select });
  mocks.select.mockReturnValue({ eq: mocks.eq });
  mocks.eq.mockReturnValue({ maybeSingle: mocks.maybeSingle });
  mocks.maybeSingle.mockResolvedValue({ data: { role: "admin" }, error: null });
  mocks.auth.getUser.mockResolvedValue({ data: { user }, error: null });
  mocks.auth.signInWithPassword.mockResolvedValue({ data: { session }, error: null });
  mocks.auth.signUp.mockResolvedValue({ data: { session: null }, error: null });
  mocks.auth.signOut.mockResolvedValue({ error: null });
  mocks.auth.resetPasswordForEmail.mockResolvedValue({ error: null });
  mocks.auth.updateUser.mockResolvedValue({ error: null });
  mocks.auth.exchangeCodeForSession.mockResolvedValue({ data: { session }, error: null });
  mocks.auth.verifyOtp.mockResolvedValue({ data: { session }, error: null });
});

describe("password and sign-up boundaries", () => {
  it("preserves password whitespace while trimming email and limiting redirects", async () => {
    await expect(signInAction(form({ email: " reader@example.com ", password: " password ", next: "https://evil.invalid" }))).rejects.toThrow("REDIRECT:/add-listing");
    expect(mocks.auth.signInWithPassword).toHaveBeenCalledWith({ email: "reader@example.com", password: " password " });
  });
  it("returns to the review-request intake after signing in", async () => {
    await expect(signInAction(form({ email: "reader@example.com", password: "password", next: "/get-reviewed" }))).rejects.toThrow("REDIRECT:/get-reviewed");
  });
  it("preserves a local destination after invalid sign-in without exposing provider details", async () => {
    mocks.auth.signInWithPassword.mockResolvedValue({ data: {}, error: { message: "private provider data" } });
    await expect(signInAction(form({ email: "reader@example.com", password: "password", next: "/places/pepper-pot" }))).rejects.toThrow("REDIRECT:/sign-in?error=credentials&next=%2Fplaces%2Fpepper-pot");
  });
  it("rejects missing/invalid fields before contacting auth", async () => {
    await expect(signInAction(form({ email: "invalid", password: "" }))).rejects.toThrow("error=credentials");
    await expect(signUpAction(form({ email: "reader@example.com", displayName: "reader", password: "short" }))).rejects.toThrow("error=invalid");
    expect(mocks.createClient).not.toHaveBeenCalled();
  });
  it("shows a confirmation notice when signup returns no session", async () => {
    await expect(signUpAction(form({ email: "reader@example.com", displayName: " reader ", password: " password ", next: "/places/pepper-pot" }))).rejects.toThrow("REDIRECT:/sign-in?notice=confirm-email&next=%2Fplaces%2Fpepper-pot");
    expect(mocks.auth.signUp).toHaveBeenCalledWith({ email: "reader@example.com", password: " password ", options: { data: { display_name: "reader" }, emailRedirectTo: "https://app.example/auth/callback?next=%2Fplaces%2Fpepper-pot" } });
  });
  it("only redirects into the site when signup has a real session", async () => {
    mocks.auth.signUp.mockResolvedValue({ data: { session }, error: null });
    await expect(signUpAction(form({ email: "reader@example.com", displayName: "Reader", password: "password", next: "/add-listing" }))).rejects.toThrow("REDIRECT:/add-listing");
  });
  it("handles unexpected auth failures safely", async () => {
    mocks.createClient.mockRejectedValue(new Error("private configuration"));
    await expect(signInAction(form({ email: "reader@example.com", password: "password" }))).rejects.toThrow("error=credentials");
  });
  it("does not report a successful sign-out when provider fails", async () => {
    mocks.auth.signOut.mockResolvedValue({ error: { message: "network" } });
    await expect(signOutAction()).rejects.toThrow("REDIRECT:/sign-in?error=signout");
  });
});

describe("password recovery", () => {
  it("requests recovery with the trusted callback URL and generic account-private notice", async () => {
    await expect(requestPasswordResetAction(form({ email: " reader@example.com " }))).rejects.toThrow("notice=reset-sent");
    expect(mocks.auth.resetPasswordForEmail).toHaveBeenCalledWith("reader@example.com", { redirectTo: "https://app.example/auth/callback?next=%2Fauth%2Freset-password" });
  });
  it("never updates a password without a verified current user", async () => {
    mocks.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(updatePasswordAction(form({ password: " password ", confirmPassword: " password " }))).rejects.toThrow("forgot-password?error=link");
    expect(mocks.auth.updateUser).not.toHaveBeenCalled();
  });
  it("requires matching valid passwords and preserves spaces", async () => {
    await expect(updatePasswordAction(form({ password: " password ", confirmPassword: "different" }))).rejects.toThrow("error=mismatch");
    expect(mocks.auth.updateUser).not.toHaveBeenCalled();
    await expect(updatePasswordAction(form({ password: " password ", confirmPassword: " password " }))).rejects.toThrow("notice=password-updated");
    expect(mocks.auth.updateUser).toHaveBeenCalledWith({ password: " password " });
  });
  it("does not claim a rejected update succeeded", async () => {
    mocks.auth.updateUser.mockResolvedValue({ error: { message: "private" } });
    await expect(updatePasswordAction(form({ password: "password", confirmPassword: "password" }))).rejects.toThrow("error=password");
  });
});

describe("administrator guard", () => {
  it("rejects anonymous users before any profile query", async () => {
    mocks.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(requireAdmin("/admin/restaurants")).rejects.toThrow("REDIRECT:/sign-in?next=%2Fadmin%2Frestaurants");
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("rejects anonymous identities even if a role lookup could return admin", async () => {
    mocks.auth.getUser.mockResolvedValue({ data: { user: { ...user, is_anonymous: true } }, error: null });
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/sign-in");
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("rejects auth errors even when a user object is returned", async () => {
    mocks.auth.getUser.mockResolvedValue({ data: { user }, error: new Error("expired") });
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/sign-in");
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it.each([null, { role: "user" }, { role: "Admin" }])("rejects non-admin profiles and never trusts user_metadata: %j", async (profile) => {
    mocks.maybeSingle.mockResolvedValue({ data: profile, error: null });
    await expect(requireAdmin()).rejects.toThrow(/^REDIRECT:\/$/);
  });
  it("fails closed on profile query errors", async () => {
    mocks.maybeSingle.mockResolvedValue({ data: { role: "admin" }, error: new Error("RLS") });
    await expect(requireAdmin()).rejects.toThrow(/^REDIRECT:\/$/);
  });
  it("returns the session-scoped client for a verified admin", async () => {
    expect(await requireAdmin()).toEqual({ auth: mocks.auth, from: mocks.from });
    expect(mocks.eq).toHaveBeenCalledWith("id", user.id);
  });
});

describe("confirmation and PKCE callbacks", () => {
  it("exchanges the code and strips token parameters on the safe redirect", async () => {
    const response = await callback(new Request("https://untrusted-host.invalid/auth/callback?code=test-code&next=%2Fplaces%2Fpepper-pot"));
    expect(mocks.auth.exchangeCodeForSession).toHaveBeenCalledWith("test-code");
    expect(response.headers.get("location")).toBe("https://app.example/places/pepper-pot");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
  });
  it("rejects arbitrary external redirect destinations", async () => {
    const response = await callback(new Request("https://app.example/auth/callback?code=test&next=https%3A%2F%2Fevil.invalid"));
    expect(response.headers.get("location")).toBe("https://app.example/add-listing");
  });
  it("handles missing/reused/expired codes with a safe error", async () => {
    const missing = await callback(new Request("https://app.example/auth/callback"));
    expect(missing.headers.get("location")).toBe("https://app.example/sign-in?error=link");
    expect(mocks.auth.exchangeCodeForSession).not.toHaveBeenCalled();
    mocks.auth.exchangeCodeForSession.mockResolvedValue({ data: {}, error: new Error("private") });
    const expired = await callback(new Request("https://app.example/auth/callback?code=expired"));
    expect(expired.headers.get("location")).toBe("https://app.example/sign-in?error=link");
  });
  it("only permits supported email OTP types", async () => {
    const response = await confirm(new Request("https://app.example/auth/confirm?token_hash=test&type=email_change"));
    expect(response.headers.get("location")).toBe("https://app.example/sign-in?error=link");
    expect(mocks.auth.verifyOtp).not.toHaveBeenCalled();
  });
  it("routes a verified recovery token to reset-password without leaking the token", async () => {
    const response = await confirm(new Request("https://app.example/auth/confirm?token_hash=test&type=recovery&next=https%3A%2F%2Fevil.invalid"));
    expect(mocks.auth.verifyOtp).toHaveBeenCalledWith({ token_hash: "test", type: "recovery" });
    expect(response.headers.get("location")).toBe("https://app.example/auth/reset-password");
  });
  it("requires a session after verification before treating confirmation as successful", async () => {
    mocks.auth.verifyOtp.mockResolvedValue({ data: { session: null }, error: null });
    const response = await confirm(new Request("https://app.example/auth/confirm?token_hash=test&type=email"));
    expect(response.headers.get("location")).toBe("https://app.example/sign-in?error=link");
  });
});
