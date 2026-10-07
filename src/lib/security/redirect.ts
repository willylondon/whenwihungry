const LOCAL_ORIGIN = "https://local.invalid";
const ALLOWED_PATH = /^(?:\/$|\/(?:browse|reviews|add-listing|get-reviewed)\/?$|\/places\/[a-zA-Z0-9-]+\/?$|\/restaurants\/[a-zA-Z0-9-]+\/?$|\/admin(?:\/[a-zA-Z0-9-]+)*\/?$|\/auth\/reset-password\/?$)/;

function parseLocalPath(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2048) return null;
  // URL parsers normalize backslashes, whitespace and encoded dot segments.
  // Reject those ambiguous forms before parsing, including encoded separators.
  if (!value.startsWith("/") || value.startsWith("//") || /[\\\s\u0000-\u001f\u007f]/.test(value)) return null;
  const pathname = value.split(/[?#]/, 1)[0];
  if (pathname.includes("%") || pathname.split("/").some((part) => part === "." || part === "..")) return null;
  try {
    const url = new URL(value, LOCAL_ORIGIN);
    if (url.origin !== LOCAL_ORIGIN || !ALLOWED_PATH.test(url.pathname)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

/** Accept only known local navigation targets, including on the server action. */
export function safeLocalRedirect(value: unknown, fallback = "/add-listing"): string {
  return parseLocalPath(value) ?? parseLocalPath(fallback) ?? "/add-listing";
}
