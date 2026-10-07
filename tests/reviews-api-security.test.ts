import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ createClient: vi.fn(), getUser: vi.fn(), from: vi.fn(), select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn(), insert: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: mocks.createClient }));

import { GET, POST } from "@/app/api/reviews/route";
import { REVIEW_BODY_MAX_BYTES, readBoundedJson } from "@/lib/validation";

const restaurantId = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const valid = { restaurantId, rating: 5, comment: " Lovely meal " };
function request(body: unknown) {
  return new Request("https://app.example/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.createClient.mockResolvedValue({ auth: { getUser: mocks.getUser }, from: mocks.from });
  mocks.getUser.mockResolvedValue({ data: { user: { id: "verified-user" } }, error: null });
  mocks.from.mockImplementation((table: string) => table === "restaurants" ? { select: mocks.select } : { insert: mocks.insert });
  mocks.select.mockReturnValue({ eq: mocks.eq });
  mocks.eq.mockReturnValue({ eq: mocks.eq, maybeSingle: mocks.maybeSingle });
  mocks.maybeSingle.mockResolvedValue({ data: { id: restaurantId, status: "approved", business_type: "restaurant", data_quality_status: "valid" }, error: null });
  mocks.insert.mockResolvedValue({ error: null });
});

describe("review API boundary", () => {
  it("requires verified authentication before querying any tables", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect((await POST(request(valid))).status).toBe(401);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("requires a registered account, not an anonymous Supabase identity", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "anonymous-id", is_anonymous: true } }, error: null });
    expect((await POST(request(valid))).status).toBe(401);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("rejects authentication errors even with a supplied user", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "untrusted" } }, error: { message: "invalid JWT" } });
    expect((await POST(request(valid))).status).toBe(401);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it.each([null, [], "string", {}, { ...valid, restaurantId: "invalid" }, { ...valid, restaurantId: {} }, { ...valid, rating: "5" }, { ...valid, rating: 0 }, { ...valid, rating: 999 }, { ...valid, rating: 1.5 }, { ...valid, rating: null }, { ...valid, comment: {} }, { ...valid, comment: "   " }, { ...valid, comment: "a".repeat(501) }])("rejects malformed typed inputs without database writes: %j", async (body) => {
    expect((await POST(request(body))).status).toBe(400);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("handles malformed JSON as 400", async () => {
    const req = new Request("https://app.example/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
    expect((await POST(req)).status).toBe(400);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("requires JSON content type", async () => {
    const req = new Request("https://app.example/api/reviews", { method: "POST", body: JSON.stringify(valid) });
    expect((await POST(req)).status).toBe(415);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("limits actual body bytes even with no Content-Length", async () => {
    expect((await POST(request({ ...valid, padding: "x".repeat(REVIEW_BODY_MAX_BYTES) }))).status).toBe(413);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it.each([null, { status: "pending" }, { status: "rejected" }, { status: "approved", data_quality_status: "rejected" }, { status: "approved", business_type: "not_food" }, { status: "approved", is_active: false }, { status: "approved", country: "US Virgin Islands" }, { status: "approved", address: "Secret Harbour, St. Thomas, USVI" }])("rejects missing or non-public targets: %j", async (target) => {
    mocks.maybeSingle.mockResolvedValue({ data: target, error: null });
    expect((await POST(request(valid))).status).toBe(404);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("fails closed when target eligibility lookup fails", async () => {
    mocks.maybeSingle.mockResolvedValue({ data: null, error: { message: "private database detail" } });
    const response = await POST(request(valid));
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain("private database");
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("pins ownership and moderation state to verified server values", async () => {
    const response = await POST(request({ ...valid, user_id: "victim", status: "approved" }));
    expect(response.status).toBe(201);
    expect(mocks.eq).toHaveBeenCalledWith("id", restaurantId);
    expect(mocks.eq).toHaveBeenCalledWith("status", "approved");
    expect(mocks.insert).toHaveBeenCalledWith({ restaurant_id: restaurantId, user_id: "verified-user", rating: 5, comment: "Lovely meal", status: "pending" });
  });
  it("maps duplicate constraint failures to a safe conflict", async () => {
    mocks.insert.mockResolvedValue({ error: { code: "23505", message: "private constraint" } });
    const response = await POST(request(valid));
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ message: "You already reviewed this place" });
  });
  it("never returns raw database or thrown service errors", async () => {
    mocks.insert.mockResolvedValue({ error: { code: "XX000", message: "private schema" } });
    const response = await POST(request(valid));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("private schema");
    mocks.createClient.mockRejectedValue(new Error("private config"));
    expect(JSON.stringify(await (await POST(request(valid))).json())).not.toContain("private config");
  });
});

describe("bounded JSON reader", () => {
  it("rejects oversized declared bodies without consuming the stream", async () => {
    const req = new Request("https://app.example", { method: "POST", headers: { "Content-Type": "application/json", "Content-Length": "9000" }, body: "{}" });
    await expect(readBoundedJson(req, 8192)).rejects.toMatchObject({ status: 413 });
    expect(req.bodyUsed).toBe(false);
  });
  it("counts UTF-8 bytes rather than character count", async () => {
    await expect(readBoundedJson(request({ value: "🟢".repeat(2050) }), 8192)).rejects.toMatchObject({ status: 413 });
  });
  it("does not trust a falsely small Content-Length", async () => {
    const req = new Request("https://app.example", { method: "POST", headers: { "Content-Type": "application/json", "Content-Length": "2" }, body: JSON.stringify({ value: "x".repeat(9000) }) });
    await expect(readBoundedJson(req, 8192)).rejects.toMatchObject({ status: 413 });
  });
});

describe("viewer review state", () => {
  const get = (id: string) => GET(new Request(`https://app.example/api/reviews?restaurantId=${id}`));
  it("rejects malformed ids before authentication and never caches the answer", async () => {
    const response = await get("not-a-uuid");
    expect(response.status).toBe(400);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(mocks.createClient).not.toHaveBeenCalled();
  });
  it("reports signed-out visitors without reading reviews", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const response = await get(restaurantId);
    expect(await response.json()).toEqual({ signedIn: false });
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("only looks up the signed-in visitor's own review", async () => {
    mocks.from.mockReturnValue({ select: mocks.select });
    mocks.maybeSingle.mockResolvedValue({ data: { id: "review" }, error: null });
    const response = await get(restaurantId);
    expect(await response.json()).toEqual({ signedIn: true, hasReview: true });
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(mocks.eq).toHaveBeenCalledWith("user_id", "verified-user");
  });
});
