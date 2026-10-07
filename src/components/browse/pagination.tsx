import Link from "next/link";
import { pageHref } from "@/lib/browse-pagination";

export function Pagination({ path, params, page, totalPages }: {
  path: string; params: Record<string, string | undefined>; page: number; totalPages: number;
}) {
  if (totalPages <= 1) return null;
  return <nav className="pagination" aria-label="Results pages">
    {page > 1 ? <Link className="btn btn-secondary" rel="prev" href={pageHref(path, params, page - 1)}>Previous</Link> : <span />}
    <span>Page {page} of {totalPages}</span>
    {page < totalPages ? <Link className="btn btn-secondary" rel="next" href={pageHref(path, params, page + 1)}>Next</Link> : <span />}
  </nav>;
}
