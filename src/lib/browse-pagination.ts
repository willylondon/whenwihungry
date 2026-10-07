export const BROWSE_PAGE_SIZE = 24;

export function paginate<T>(items: T[], requestedPage?: string) {
  const totalPages = Math.max(1, Math.ceil(items.length / BROWSE_PAGE_SIZE));
  const numeric = Number(requestedPage);
  const page = Number.isSafeInteger(numeric) && numeric > 0 ? Math.min(numeric, totalPages) : 1;
  const offset = (page - 1) * BROWSE_PAGE_SIZE;
  return { page, totalPages, offset, items: items.slice(offset, offset + BROWSE_PAGE_SIZE) };
}

/** A new filter keeps unrelated choices and view/sort, and resets pagination. */
export function updateBrowseParams(current: string, updates: Record<string, string>, clearFilters = false): string {
  const params = new URLSearchParams(current);
  if (clearFilters) ["q", "query", "search", "category", "parish", "price", "rating"].forEach(key => params.delete(key));
  if ("q" in updates) { params.delete("query"); params.delete("search"); }
  Object.entries(updates).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key));
  params.delete("page");
  return params.size ? `?${params.toString()}` : "";
}

export function pageHref(path: string, params: Record<string, string | undefined>, page: number): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value && key !== "page") query.set(key, value); });
  if (page > 1) query.set("page", String(page));
  return `${path}${query.size ? `?${query.toString()}` : ""}`;
}

/** Next searchParams values can be arrays when a URL repeats a key. */
export function normalizeBrowseParams(raw: Record<string, string | string[] | undefined>): Record<string, string | undefined> {
  const params: Record<string, string | undefined> = {};
  for (const key of ["q", "query", "search", "parish", "category", "price", "rating", "sort", "view", "page"]) {
    const candidate = Array.isArray(raw[key]) ? raw[key][0] : raw[key];
    if (typeof candidate === "string") params[key] = candidate.trim().slice(0, key === "q" || key === "query" || key === "search" ? 200 : 100) || undefined;
  }
  return params;
}
