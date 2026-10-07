/** Serialize JSON for a script element without letting data become HTML. */
export function serializeJsonLd(value: unknown): string {
  const json = JSON.stringify(value);
  if (json === undefined) throw new TypeError("JSON-LD must be JSON serializable");
  return json.replace(/</g, "\\u003c");
}
