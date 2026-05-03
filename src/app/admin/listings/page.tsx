import { moderateListingAction } from "@/app/admin/listings/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminListingsPageProps = {
  searchParams: Promise<{
    error?: string;
    updated?: string;
  }>;
};

export const metadata = {
  title: "Admin Listings"
};

export default async function AdminListingsPage({
  searchParams
}: AdminListingsPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="section">
        <div className="container">
          <div className="card empty-state">
            <h1>Sign in required.</h1>
            <p>Use the When Wi Hungry admin account to moderate listings.</p>
          </div>
        </div>
      </section>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return (
      <section className="section">
        <div className="container">
          <div className="card empty-state">
            <h1>Admin only.</h1>
            <p>This page is only for When Wi Hungry moderation.</p>
          </div>
        </div>
      </section>
    );
  }

  const { data: listings } = await supabase
    .from("restaurants")
    .select("id, name, parish, area, category, status, description, created_at")
    .order("created_at", { ascending: false });

  return (
    <section className="section directory-page">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Admin</span>
            <h1>Moderate restaurant listings.</h1>
            <p>Approve community submissions when they are ready to go public.</p>
          </div>
        </div>
        {params.updated ? <p className="form-success">Listing updated.</p> : null}
        {params.error ? <p className="form-alert">{params.error}</p> : null}
        <div className="admin-list">
          {(listings ?? []).map((listing) => (
            <article className="card admin-listing" key={listing.id}>
              <div>
                <span className="eyebrow">{listing.status}</span>
                <h2>{listing.name}</h2>
                <p>{listing.description}</p>
                <div className="card-meta">
                  <span>{listing.category}</span>
                  <span>{listing.parish}</span>
                  <span>{listing.area}</span>
                </div>
              </div>
              <form action={moderateListingAction} className="admin-actions">
                <input name="id" type="hidden" value={listing.id} />
                <button className="btn btn-primary" name="status" type="submit" value="approved">
                  Approve
                </button>
                <button className="btn btn-outline" name="status" type="submit" value="pending">
                  Pending
                </button>
                <button className="btn btn-outline" name="status" type="submit" value="rejected">
                  Reject
                </button>
              </form>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
