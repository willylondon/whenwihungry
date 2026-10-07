import { vi } from "vitest";

type Row = Record<string, any>;
type Filter = { name: string; args: any[] };

/** Offline PostgREST-shaped fixture. No HTTP or live database access is used. */
export function catalogDb(tables: Record<string, Row[]>, options: { cap?: number; errors?: Record<string, string>; nullCount?: boolean; truncate?: boolean } = {}) {
  const calls: Array<{ source: string; filters: Filter[] }> = [];
  function query(source: string) {
    const filters: Filter[] = [];
    calls.push({ source, filters });
    const builder: Record<string, any> = {};
    for (const name of ["select", "eq", "or", "in", "order", "range", "limit", "abortSignal"]) {
      builder[name] = (...args: any[]) => { filters.push({ name, args }); return builder; };
    }
    builder.then = (resolve: (result: unknown) => void, reject: (error: unknown) => void) => Promise.resolve().then(() => {
      if (options.errors?.[source]) return { data: null, count: null, error: { message: options.errors[source] } };
      let rows = [...(tables[source] ?? [])];
      for (const filter of filters) {
        const [column, value] = filter.args;
        if (filter.name === "eq") rows = rows.filter((row) => row[column] === value);
        if (filter.name === "in") rows = rows.filter((row) => value.includes(row[column]));
        if (filter.name === "or") rows = rows.filter((row) => column.split(",").some((clause: string) => {
          const [field, op, expected] = clause.split(".");
          if (op === "is" && expected === "null") return row[field] == null;
          if (op === "eq") return String(row[field]) === expected;
          if (op === "neq") return row[field] != null && String(row[field]) !== expected;
          throw new Error(`Unsupported fixture condition: ${clause}`);
        }));
      }
      const ordering = filters.filter((filter) => filter.name === "order");
      rows.sort((a, b) => {
        for (const { args: [column, settings] } of ordering) {
          const result = typeof a[column] === "number" ? a[column] - b[column] : String(a[column] ?? "").localeCompare(String(b[column] ?? ""));
          if (result) return settings.ascending ? result : -result;
        }
        return 0;
      });
      const count = rows.length;
      const range = filters.find((filter) => filter.name === "range")?.args ?? [0, rows.length - 1];
      const limit = Math.min(range[1] - range[0] + 1, options.cap ?? Infinity, filters.find((filter) => filter.name === "limit")?.args[0] ?? Infinity);
      rows = rows.slice(range[0], range[0] + limit);
      if (options.truncate && range[0] > 0) rows = [];
      return { data: rows, count: options.nullCount ? null : count, error: null };
    }).then(resolve, reject);
    return builder;
  }
  return { from: vi.fn(query), rpc: vi.fn((name: string) => query(name)), calls, auth: { getUser: vi.fn(async () => ({ data: { user: null } })) } };
}

export function restaurant(overrides: Row = {}): Row {
  return { id: "restaurant-1", slug: "jamaica-food", name: "Jamaica Food", status: "approved", is_active: true,
    parish: "St. James", area: "Montego Bay", address: "Montego Bay, Jamaica", latitude: "18.47", longitude: "-77.92",
    data_quality_status: null, business_type: null, price_range: "$$", admin_reviews: [], ...overrides };
}
