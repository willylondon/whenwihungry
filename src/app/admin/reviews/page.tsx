import { createSupabaseServerClient } from "@/lib/supabase/server";
import { moderateReviewAction } from "@/app/admin/reviews/actions";

export default async function AdminReviewsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Access Denied</div>;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return <div>Access Denied</div>;

  const { data: reviews } = await supabase
    .from("user_reviews")
    .select(`
      id,
      rating,
      comment,
      status,
      created_at,
      restaurants (name)
    `)
    .order("created_at", { ascending: false });

  return (
    <main style={{ background: "var(--wwh-bg)", minHeight: "100vh", padding: "100px 0" }}>
      <div className="container">
        <h1 style={{ color: "#fff", marginBottom: "32px" }}>Moderate User Reviews</h1>
        
        <div style={{ display: "grid", gap: "16px" }}>
          {(reviews ?? []).map((review: any) => (
            <div key={review.id} style={{ background: "var(--wwh-card)", padding: "24px", borderRadius: "12px", border: "1px solid var(--wwh-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ color: "var(--wwh-accent)", fontWeight: 700 }}>{review.restaurants.name}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{review.status.toUpperCase()}</span>
              </div>
              <div style={{ color: "#FFD700", marginBottom: "8px" }}>{"★".repeat(review.rating)}</div>
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "20px" }}>{review.comment}</p>
              
              <form action={moderateReviewAction} style={{ display: "flex", gap: "12px" }}>
                <input type="hidden" name="id" value={review.id} />
                <button name="status" value="approved" style={{ padding: "8px 16px", background: "#2EC4B6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Approve</button>
                <button name="status" value="rejected" style={{ padding: "8px 16px", background: "#EF476F", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Reject</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
