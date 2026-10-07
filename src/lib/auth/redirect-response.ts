import { NextResponse } from "next/server";

import { siteUrl } from "@/lib/site-url";

/** Auth links/cookies must never enter a CDN cache or a following Referer. */
export function authRedirectResponse(path: string) {
  const response = NextResponse.redirect(siteUrl(path), 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
