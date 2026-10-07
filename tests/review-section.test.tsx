// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReviewSection } from "@/components/place/review-section";

const refresh = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("next/link", () => ({ default: ({ children, href }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={href}>{children}</a> }));
let root: Root;
let container: HTMLDivElement;
beforeEach(() => { vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); vi.clearAllMocks(); container = document.createElement("div"); document.body.append(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); vi.unstubAllGlobals(); });
function render(extra: Partial<React.ComponentProps<typeof ReviewSection>> = {}) {
  act(() => root.render(<ReviewSection restaurantId="fixture-id" returnPath="/places/fixture#leave-review-heading" reviews={[]} viewer={{ status: "signed-in", hasReview: false }} {...extra} />));
}
function selectRating() { act(() => container.querySelector<HTMLInputElement>('input[value="4"]')!.click()); }
function submit() { container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); }

describe("community review form", () => {
  it("asks the API for the visitor's account state when the page is shared", async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ signedIn: false }) }); vi.stubGlobal("fetch", fetch);
    await act(async () => { root.render(<ReviewSection restaurantId="fixture-id" returnPath="/places/fixture" reviews={[]} />); });
    expect(fetch).toHaveBeenCalledWith("/api/reviews?restaurantId=fixture-id", { cache: "no-store" });
    expect(container.textContent).toContain("sign in");
    expect(container.querySelector("form")).toBeNull();
  });
  it("hides the form for visitors who already reviewed", () => {
    render({ viewer: { status: "signed-in", hasReview: true } });
    expect(container.textContent).toContain("already submitted");
    expect(container.querySelector("form")).toBeNull();
  });
  it("exposes a required rating group, selected radio and associated comment label", () => {
    render();
    expect(container.querySelector("legend")?.textContent).toBe("Rating (required)");
    selectRating();
    expect(container.querySelector<HTMLInputElement>('input[value="4"]')?.checked).toBe(true);
    const textarea = container.querySelector("textarea")!;
    expect(container.querySelector(`label[for="${textarea.id}"]`)?.textContent).toContain("Comment");
    expect(textarea.maxLength).toBe(500);
  });
  it("makes one request while pending and acknowledges only a successful response", async () => {
    let complete!: (response: unknown) => void;
    const fetch = vi.fn(() => new Promise(resolve => { complete = resolve; })); vi.stubGlobal("fetch", fetch);
    render(); selectRating();
    await act(async () => { submit(); submit(); });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(container.querySelector("form")?.getAttribute("aria-busy")).toBe("true");
    expect(container.textContent).not.toContain("Review submitted for moderation");
    await act(async () => { complete({ ok: true }); });
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Review submitted for moderation");
    expect(container.querySelector("form")).toBeNull();
    expect(refresh).toHaveBeenCalledTimes(1);
  });
  it("keeps the form retryable after a failed request and announces the failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("fixture network failure")));
    render(); selectRating(); await act(async () => { submit(); });
    expect(container.querySelector('[role="status"]')?.textContent).toContain("wasn’t submitted");
    expect(container.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(false);
    expect(container.querySelector<HTMLInputElement>('input[value="4"]')?.checked).toBe(true);
    expect(refresh).not.toHaveBeenCalled();
  });
  it("does not claim an empty community feed when reading failed", () => {
    render({ reviewsUnavailable: true, viewer: { status: "unknown" } });
    expect(container.textContent).toContain("Community reviews are temporarily unavailable");
    expect(container.textContent).not.toContain("No approved reviews yet");
    expect(container.querySelector("form")).toBeNull();
  });
});
