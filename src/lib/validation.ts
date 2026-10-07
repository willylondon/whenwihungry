export function getFormString(formData: FormData, key: string, options: { trim?: boolean } = {}): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return options.trim === false ? value : value.trim();
}

export function boundedString(value: unknown, options: { min?: number; max: number; trim?: boolean }): string | null {
  if (typeof value !== "string") return null;
  const result = options.trim === false ? value : value.trim();
  return result.length >= (options.min ?? 0) && result.length <= options.max ? result : null;
}

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function isEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const REVIEW_COMMENT_MAX_LENGTH = 500;
export const REVIEW_BODY_MAX_BYTES = 8192;

export type ReviewInput = { restaurantId: string; rating: number; comment: string };

export function validateReviewInput(value: unknown): ReviewInput | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const comment = boundedString(input.comment, { min: 1, max: REVIEW_COMMENT_MAX_LENGTH });
  if (!isUuid(input.restaurantId) || typeof input.rating !== "number" || !Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5 || comment === null) return null;
  return { restaurantId: input.restaurantId, rating: input.rating, comment };
}

export class RequestBodyError extends Error {
  constructor(public readonly status: 400 | 413 | 415, message: string) {
    super(message);
  }
}

/** Limit bytes while streaming; a forged/missing Content-Length cannot bypass it. */
export async function readBoundedJson(request: Request, maxBytes: number): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    throw new RequestBodyError(415, "Send an application/json request");
  }
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > maxBytes) throw new RequestBodyError(413, "Request body is too large");
  if (!request.body) throw new RequestBodyError(400, "Invalid JSON request");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new RequestBodyError(413, "Request body is too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const buffer = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer)) as unknown;
  } catch {
    throw new RequestBodyError(400, "Invalid JSON request");
  }
}
