import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateRequestStatusAction } from "./actions";

export const dynamic = "force-dynamic";
export default async function ReviewRequestsPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string; error?: string; updated?: string }> }) {
  const supabase = await requireAdmin("/admin/requests");
  const params = await searchParams;
  if (process.env.REVIEW_REQUESTS_ENABLED !== "true") return <div className="section container"><h1>Restaurant inquiries are not enabled</h1><p>Apply and verify the review_requests migration, confirm profile role protection and the admin monitoring owner, then enable REVIEW_REQUESTS_ENABLED. The public form is disabled until then.</p></div>;
  const status = ["pending", "in_review", "closed", "all"].includes(params.status ?? "") ? params.status! : "pending";
  const page = Math.min(10000, Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1));
  let query = supabase.from("review_requests").select("id,contact_name,restaurant_name,location,contact_email,contact_phone,message,status,created_at", { count: "exact" }).order("created_at", { ascending: true });
  if (status !== "all") query = query.eq("status", status);
  const { data: requests, error, count } = await query.range((page - 1) * 25, page * 25 - 1);
  return <div className="section container">
    <h1>Restaurant inquiries</h1>
    <p>Private requests, oldest first. Mark a request under consideration when reviewing it; close it when finished. Status changes do not send email or promise coverage.</p>
    <nav aria-label="Inquiry status" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>{["pending", "in_review", "closed", "all"].map(value => <Link key={value} href={`/admin/requests?status=${value}`} aria-current={status === value ? "page" : undefined}>{value.replaceAll("_", " ")}</Link>)}</nav>
    {params.error && <p role="alert">The update could not be confirmed. Check the request and retry. An account can have only one open request.</p>}
    {params.updated && <p role="status">Request status saved.</p>}
    {error ? <p role="alert">The inquiry queue could not be loaded. Check the migration, permissions and database connection, then refresh. This is not an empty queue.</p> : <>
      <p>{count ?? 0} request(s) in this view</p>
      {!requests?.length && <p>No requests in this view.</p>}
      <div className="admin-list">{requests?.map(request => <article key={request.id} className="card admin-listing">
        <div><span className="eyebrow">{request.status.replaceAll("_", " ")}</span><h2>{request.restaurant_name}</h2>
          <p>{request.location}</p><p>{request.contact_name} · {request.contact_email}{request.contact_phone ? ` · ${request.contact_phone}` : ""}</p>
          <p style={{ whiteSpace: "pre-wrap" }}>{request.message}</p><p>Received {new Date(request.created_at).toLocaleString("en-JM", { timeZone: "UTC" })} UTC · Ref {request.id}</p>
        </div>
        <form action={updateRequestStatusAction} className="admin-actions"><input type="hidden" name="id" value={request.id} />
          <button className="btn btn-outline" name="status" value="pending">Pending</button><button className="btn btn-primary" name="status" value="in_review">Under consideration</button><button className="btn btn-outline" name="status" value="closed">Close</button>
        </form>
      </article>)}</div>
      <nav aria-label="Queue pages" style={{ display: "flex", gap: 20 }}>{page > 1 && <Link href={`/admin/requests?status=${status}&page=${page - 1}`}>Previous</Link>}{page * 25 < (count ?? 0) && <Link href={`/admin/requests?status=${status}&page=${page + 1}`}>Next</Link>}</nav>
    </>}
  </div>;
}
