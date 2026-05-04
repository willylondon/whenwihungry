import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminRestaurantsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name, slug, parish, is_verified")
    .order("name", { ascending: true });

  return (
    <main style={{ background: "var(--wwh-bg)", minHeight: "100vh", padding: "100px 0" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 style={{ color: "#fff", margin: 0 }}>Restaurant Database</h1>
          <Link 
            href="/admin/restaurants/new" 
            style={{ 
              padding: "12px 24px", 
              background: "var(--wwh-accent)", 
              color: "#fff", 
              borderRadius: "8px", 
              textDecoration: "none",
              fontWeight: 700
            }}
          >
            + Add Restaurant
          </Link>
        </div>

        <div style={{ background: "var(--wwh-card)", borderRadius: "16px", border: "1px solid var(--wwh-border)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)", textAlign: "left" }}>
                <th style={{ padding: "16px" }}>Name</th>
                <th style={{ padding: "16px" }}>Parish</th>
                <th style={{ padding: "16px" }}>Status</th>
                <th style={{ padding: "16px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(restaurants ?? []).map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid var(--wwh-border)" }}>
                  <td style={{ padding: "16px" }}>{r.name}</td>
                  <td style={{ padding: "16px", color: "rgba(255,255,255,0.6)" }}>{r.parish}</td>
                  <td style={{ padding: "16px" }}>
                    {r.is_verified ? (
                      <span style={{ color: "#2EC4B6", fontSize: "0.8rem", fontWeight: 700 }}>VERIFIED</span>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>UNVERIFIED</span>
                    )}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <Link href={`/admin/restaurants/${r.id}`} style={{ color: "var(--wwh-accent)", fontSize: "0.9rem", fontWeight: 600 }}>
                      Edit Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
