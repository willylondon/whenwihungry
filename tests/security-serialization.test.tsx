// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { serializeJsonLd } from "@/lib/security/json-ld";
import { safeLocalRedirect } from "@/lib/security/redirect";
import { authErrorMessage, authNoticeMessage } from "@/lib/auth/messages";

describe("HTML-safe JSON-LD", () => {
  it.each(["category", "parish", "location", "name", "description", "address", "headline", "reviewBody"])("keeps closing-script payloads in %s as inert JSON", (field) => {
    const value = `</ScRiPt><script>window.__auditMarker=true</script><img src=x onerror=alert(1)> & < > \u2028\u2029`;
    const data = { "@type": "Restaurant", [field]: value, nested: [value] };
    const html = renderToStaticMarkup(<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />);
    const template = document.createElement("template");
    template.innerHTML = html;
    expect(template.content.querySelectorAll("script")).toHaveLength(1);
    expect(template.content.querySelector("img")).toBeNull();
    expect(template.content.querySelector("script")?.textContent).not.toContain("<");
    expect(JSON.parse(template.content.querySelector("script")!.textContent!)).toEqual(data);
  });
});

describe("safe local redirects", () => {
  it.each(["/", "/add-listing", "/get-reviewed", "/places/pepper-pot", "/restaurants/st-andrew", "/browse?q=jerk%20chicken#results", "/admin/restaurants?updated=1", "/auth/reset-password"])("accepts %s", (path) => {
    expect(safeLocalRedirect(path)).toBe(path);
  });
  it.each(["https://evil.invalid", "//evil.invalid", "/\\evil.invalid", "\\evil.invalid", "javascript:alert(1)", "/%2f%2fevil.invalid", "/%5cevil.invalid", "/%252fevil.invalid", "/browse/../admin", "/browse/%2e%2e/admin", "/\nevil.invalid", " /add-listing", "/api/reviews", "/sign-in?next=//evil.invalid", "/auth/callback", "/%", "", null, ["/admin"]])("rejects ambiguous or unsupported destination %s", (value) => {
    expect(safeLocalRedirect(value)).toBe("/add-listing");
  });
  it("validates its fallback too", () => expect(safeLocalRedirect(null, "https://evil.invalid")).toBe("/add-listing"));
});

describe("public auth messages", () => {
  it("does not reflect arbitrary provider/query messages or prototype keys", () => {
    expect(authErrorMessage("secret database detail")).toBeNull();
    expect(authErrorMessage("__proto__")).toBeNull();
    expect(authNoticeMessage("constructor")).toBeNull();
    expect(authErrorMessage("credentials")).toContain("couldn't sign you in");
  });
});
