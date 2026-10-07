// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GetReviewedClient } from "@/app/get-reviewed/get-reviewed-client";

const props = { signedIn: false, enabled: false, requestId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" };
const dom = (html: string) => new DOMParser().parseFromString(html, "text/html");
describe("honest review-request interface", () => {
  it("disabled intake collects no information and links the existing contact channels", () => {
    const doc = dom(renderToStaticMarkup(<GetReviewedClient {...props} />));
    expect(doc.querySelector("form")).toBeNull();
    expect(doc.body.textContent).toContain("temporarily unavailable");
    expect(doc.querySelector('a[href="https://tiktok.com/@whenwihungry"]')).not.toBeNull();
    expect(doc.querySelector('a[href="https://instagram.com/whenwihungry"]')).not.toBeNull();
    expect(doc.body.textContent).not.toContain("Request received");
  });
  it("enabled intake requires sign-in and preserves the return destination", () => {
    const doc = dom(renderToStaticMarkup(<GetReviewedClient {...props} enabled />));
    expect(doc.querySelector("form")).toBeNull();
    expect(doc.querySelector('a[href="/sign-in?next=/get-reviewed"]')).not.toBeNull();
  });
  it("queue failures are distinct from a blank active form", () => {
    const doc = dom(renderToStaticMarkup(<GetReviewedClient {...props} enabled signedIn queueUnavailable />));
    expect(doc.querySelector("form")).toBeNull();
    expect(doc.querySelector('[role="alert"]')?.textContent).toContain("couldn't check the inquiry queue");
    expect(doc.body.textContent).not.toContain("Request received");
  });
  it("one existing open request exposes only its reference and status", () => {
    const doc = dom(renderToStaticMarkup(<GetReviewedClient {...props} enabled signedIn existingRequest={{ id: props.requestId, status: "in_review" }} />));
    expect(doc.querySelector("form")).toBeNull();
    expect(doc.body.textContent).toContain("Under consideration");
    expect(doc.body.textContent).toContain(props.requestId);
  });
  it("signed-in form is bounded and has no fake success before persistence", () => {
    const doc = dom(renderToStaticMarkup(<GetReviewedClient {...props} enabled signedIn />));
    expect(doc.querySelector('input[name="request_id"]')?.getAttribute("value")).toBe(props.requestId);
    expect(doc.querySelector('textarea[name="message"]')?.getAttribute("maxlength")).toBe("3000");
    expect(doc.body.textContent).not.toContain("Request received");
  });
});
