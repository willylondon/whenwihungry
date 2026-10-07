import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseListing, priceFromRange } from "@/app/add-listing/validation";
import { parseRestaurant, parseCriticReview } from "@/app/admin/restaurants/validation";
import { parseReviewRequest } from "@/app/get-reviewed/validation";

const mocks = vi.hoisted(() => ({ guard: vi.fn(), client: vi.fn(), refresh: vi.fn() }));
vi.mock("@/lib/auth/require-admin", () => ({ requireAdmin: mocks.guard }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: mocks.client }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.refresh }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } }));
import { saveRestaurantAction, createRestaurantAction, addDishAction, addKeywordAction, publishCriticReviewAction } from "@/app/admin/restaurants/actions";
import { moderateListingAction } from "@/app/admin/listings/actions";
import { moderateReviewAction } from "@/app/admin/reviews/actions";
import { updateRequestStatusAction } from "@/app/admin/requests/actions";
import { submitReviewRequestAction } from "@/app/get-reviewed/actions";
import { submitListingAction } from "@/app/add-listing/actions";

const id = "12345678-1234-1234-1234-123456789abc";
const userId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
function form(values: Record<string, string> = {}) { const data = new FormData(); for (const [key, value] of Object.entries(values)) data.set(key, value); return data; }
const listing = { name: "Test kitchen", parish: "Kingston", category: "Jerk", description: "A factual restaurant description", priceRange: "$$$$" };
const restaurant = { ...listing, id, slug: "test-kitchen", price_level: "4", is_active: "on" };
const review = { id, verdict: "WORTH_IT", admin_score: "0", headline: "A real critic headline", honest_take: "A sufficiently long, genuine critic assessment of a real visit.", visit_date: "2026-01-15", publish_confirmed: "on" };
const inquiry = { request_id: id, name: "Restaurant operator", restaurant: "Test kitchen", location: "Kingston, Jamaica", email: "operator@example.test", message: "Please consider visiting this synthetic test kitchen." };
type Result = { data: Record<string, unknown> | null; error: { code?: string; message?: string } | null };
function db(results: Result[] = [], user: { id: string; is_anonymous?: boolean } | null = { id: userId }) {
  const calls: { table: string; method: string; value: unknown }[] = [];
  const from = vi.fn((table: string) => {
    const result = results.shift() ?? { data: null, error: null };
    const builder: Record<string, unknown> = {};
    for (const method of ["select", "insert", "update", "eq", "limit", "order", "range"]) builder[method] = (value: unknown) => { calls.push({ table, method, value }); return builder; };
    builder.single = () => Promise.resolve(result); builder.maybeSingle = () => Promise.resolve(result);
    return builder;
  });
  return { from, calls, rpc: vi.fn(() => ({ single: () => Promise.resolve(results.shift() ?? { data: null, error: null }) })), auth: { getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }) } };
}
beforeEach(() => { vi.clearAllMocks(); vi.stubEnv("REVIEW_REQUESTS_ENABLED", "true"); });

describe("bounded listing and editorial input", () => {
  it.each(["$", "$$", "$$$", "$$$$"])("round-trips canonical price %s", value => expect(priceFromRange(value)).toEqual({ price_range: value, price_level: value.length }));
  it("keeps unknown price unknown", () => expect(priceFromRange("")).toEqual({ price_range: null, price_level: null }));
  it("rejects price, parish, invalid URLs, oversized text and file fields", () => {
    expect(() => priceFromRange("5")).toThrow();
    expect(() => parseListing(form({ ...listing, parish: "not-a-parish" }))).toThrow();
    expect(() => parseListing(form({ ...listing, website: "javascript:alert(1)" }))).toThrow();
    expect(() => parseListing(form({ ...listing, description: "a".repeat(501) }))).toThrow();
    const f = form(listing); f.set("name", new Blob(["bad"])); expect(() => parseListing(f)).toThrow();
  });
  it("validates social hosts without inventing links", () => {
    expect(parseListing(form({ ...listing, instagram: "@test" })).instagram).toBe("@test");
    expect(() => parseListing(form({ ...listing, instagram: "https://evil.test/test" }))).toThrow();
  });
  it("requires deliberate complete critic publication and preserves score zero", () => {
    expect(parseCriticReview(form(review)).admin_score).toBe(0);
    for (const patch of [{ verdict: "" }, { admin_score: "" }, { honest_take: "" }, { visit_date: "2026-02-30" }, { visit_date: "2999-01-01" }, { publish_confirmed: "" }]) expect(() => parseCriticReview(form({ ...review, ...patch }))).toThrow();
    expect(parseRestaurant(form({ ...restaurant, price_level: "" })).price_level).toBeNull();
  });
  it("rejects honeypot and bounded inquiry violations", () => {
    expect(() => parseReviewRequest(form({ ...inquiry, website_confirm: "robot" }))).toThrow();
    expect(() => parseReviewRequest(form({ ...inquiry, email: "wrong" }))).toThrow();
    expect(() => parseReviewRequest(form({ ...inquiry, message: "x".repeat(3001) }))).toThrow();
  });
});

describe("every administrative action enforces its own authorization", () => {
  it.each([saveRestaurantAction, createRestaurantAction, addDishAction, addKeywordAction, publishCriticReviewAction, moderateListingAction, moderateReviewAction, updateRequestStatusAction])("rejects direct invocation of %s before mutation", async action => {
    mocks.guard.mockRejectedValue(new Error("DENIED"));
    await expect(action(form({ id, status: "approved" }))).rejects.toThrow("DENIED");
    expect(mocks.guard).toHaveBeenCalledOnce(); expect(mocks.client).not.toHaveBeenCalled();
  });
  it("listing saves never create a critic review", async () => {
    const client = db([{ data: { id }, error: null }]); mocks.guard.mockResolvedValue(client);
    await expect(saveRestaurantAction(form({ ...restaurant, ...review }))).rejects.toThrow("updated=listing");
    expect(client.from.mock.calls.map(call => call[0])).toEqual(["restaurants"]);
    expect(client.calls.find(call => call.method === "update")?.value).not.toHaveProperty("verdict");
  });
  it("reports zero affected rows as failure", async () => {
    mocks.guard.mockResolvedValue(db());
    await expect(moderateReviewAction(form({ id, status: "approved" }))).rejects.toThrow("error=save_failed");
    expect(mocks.refresh).not.toHaveBeenCalled();
  });
  it("rejects tampered moderation status", async () => {
    const client = db(); mocks.guard.mockResolvedValue(client);
    await expect(moderateReviewAction(form({ id, status: "admin" }))).rejects.toThrow("error=invalid"); expect(client.from).not.toHaveBeenCalled();
  });
  it("returns unchanged when the atomic RPC reports no changes", async () => {
    const client = db([{ data: { review_id: id, changed: false }, error: null }]); mocks.guard.mockResolvedValue(client);
    await expect(publishCriticReviewAction(form(review))).rejects.toThrow("updated=unchanged");
    expect(client.from).not.toHaveBeenCalled();
  });
  it("publishes real content only through the atomic RPC with no unknown date column", async () => {
    const client = db([{ data: { review_id: id, changed: true }, error: null }]); mocks.guard.mockResolvedValue(client);
    await expect(publishCriticReviewAction(form(review))).rejects.toThrow("updated=review");
    expect(client.rpc).toHaveBeenCalledWith("publish_critic_review", { p_restaurant_id: id, p_headline: review.headline, p_honest_take: review.honest_take, p_verdict: review.verdict, p_admin_score: 0, p_visit_date: review.visit_date });
    expect(client.from).not.toHaveBeenCalled();
  });
  it.each(["PGRST202", "42501"])("does not fall back to partial writes when RPC fails (%s)", async code => {
    const client = db([{ data: null, error: { code } }]); mocks.guard.mockResolvedValue(client);
    await expect(publishCriticReviewAction(form(review))).rejects.toThrow("error=review_failed");
    expect(client.from).not.toHaveBeenCalled(); expect(mocks.refresh).not.toHaveBeenCalled();
  });
});

describe("durable review requests", () => {
  const idle = { status: "idle" as const, message: "" };
  it("is closed by default without a database call", async () => {
    vi.stubEnv("REVIEW_REQUESTS_ENABLED", "false");
    expect((await submitReviewRequestAction(idle, form(inquiry))).status).toBe("error"); expect(mocks.client).not.toHaveBeenCalled();
  });
  it.each([null, { id: userId, is_anonymous: true }])("rejects signed-out and anonymous-auth sessions", async user => {
    const client = db([], user); mocks.client.mockResolvedValue(client);
    expect((await submitReviewRequestAction(idle, form(inquiry))).status).toBe("error"); expect(client.from).not.toHaveBeenCalled();
  });
  it("does not claim success when table is missing", async () => {
    mocks.client.mockResolvedValue(db([{ data: null, error: { code: "42P01" } }]));
    expect((await submitReviewRequestAction(idle, form(inquiry))).status).toBe("error");
  });
  it("succeeds only after persisted ID acknowledgment, assigning owner server-side", async () => {
    const client = db([{ data: null, error: null }, { data: { id }, error: null }]); mocks.client.mockResolvedValue(client);
    expect(await submitReviewRequestAction(idle, form({ ...inquiry, owner_id: "attacker", status: "closed" }))).toMatchObject({ status: "success", requestId: id });
    expect(client.calls.find(call => call.method === "insert")?.value).toMatchObject({ id, owner_id: userId });
    expect(client.calls.find(call => call.method === "insert")?.value).not.toHaveProperty("status");
  });
  it("is idempotent after successful submission", async () => {
    const client = db([{ data: { id }, error: null }]); mocks.client.mockResolvedValue(client);
    expect((await submitReviewRequestAction(idle, form(inquiry))).status).toBe("success");
    expect(client.calls.filter(call => call.method === "insert")).toHaveLength(0);
  });
  it("recognizes a concurrent same-ID submission only after owner-scoped readback", async () => {
    mocks.client.mockResolvedValue(db([{ data: null, error: null }, { data: null, error: { code: "23505" } }, { data: { id }, error: null }]));
    expect((await submitReviewRequestAction(idle, form(inquiry))).status).toBe("success");
  });
  it("does not falsely accept a different pending request or no affected row", async () => {
    mocks.client.mockResolvedValue(db([{ data: null, error: null }, { data: null, error: { code: "23505" } }, { data: null, error: null }]));
    expect((await submitReviewRequestAction(idle, form(inquiry))).status).toBe("error");
    mocks.client.mockResolvedValue(db([{ data: null, error: null }, { data: null, error: null }]));
    expect((await submitReviewRequestAction(idle, form(inquiry))).status).toBe("error");
  });
  it("listing submission uses pending status, verified readback and both price fields", async () => {
    const client = db([{ data: { id, status: "pending" }, error: null }]); mocks.client.mockResolvedValue(client);
    await expect(submitListingAction(form({ ...listing, status: "approved" }))).rejects.toThrow("submitted=1");
    expect(client.calls.find(call => call.method === "insert")?.value).toMatchObject({ status: "pending", submitted_by: userId, price_level: 4, price_range: "$$$$" });
  });
});
