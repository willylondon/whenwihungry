import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { saveRestaurantAction, addDishAction, addKeywordAction } from "@/app/admin/restaurants/actions";

export default async function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  
  const [
    { data: r },
    { data: adminReview },
    { data: dishes },
    { data: keywords }
  ] = await Promise.all([
    supabase.from("restaurants").select("*").eq("id", id).single(),
    supabase.from("admin_reviews").select("*").eq("restaurant_id", id).maybeSingle(),
    supabase.from("dishes").select("*").eq("restaurant_id", id),
    supabase.from("search_keywords").select("*").eq("restaurant_id", id)
  ]);

  if (!r) notFound();

  return (
    <main style={{ background: "var(--wwh-bg)", minHeight: "100vh", padding: "100px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 style={{ color: "#fff", marginBottom: "40px" }}>Edit: {r.name}</h1>
        
        <form action={saveRestaurantAction} style={{ display: "grid", gap: "24px" }}>
          <input type="hidden" name="id" value={r.id} />
          
          <div className="form-group">
            <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>NAME</label>
            <input name="name" defaultValue={r.name} required style={inputStyle} />
          </div>

          <div className="form-group">
            <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>SLUG (URL)</label>
            <input name="slug" defaultValue={r.slug} required style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>PARISH</label>
               <input name="parish" defaultValue={r.parish} required style={inputStyle} />
             </div>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>CITY</label>
               <input name="city" defaultValue={r.city || ""} style={inputStyle} />
             </div>
          </div>

          <div className="form-group">
            <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>DESCRIPTION / HONEST TAKE</label>
            <textarea name="description" defaultValue={r.description || ""} style={{ ...inputStyle, minHeight: "120px" }} />
          </div>

          <div style={{ padding: "24px", background: "rgba(255,90,31,0.05)", borderRadius: "12px", border: "1px solid rgba(255,90,31,0.2)" }}>
            <h3 style={{ color: "var(--wwh-accent)", marginTop: 0, fontSize: "1rem", textTransform: "uppercase" }}>Critic Authority</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "16px" }}>
               <div>
                  <label style={{ display: "block", color: "#fff", fontSize: "0.8rem", marginBottom: "8px" }}>VERDICT</label>
                  <select name="verdict" defaultValue={adminReview?.verdict || "MID"} style={inputStyle}>
                    <option value="RUN_GO_GET_IT">🔥 RUN GO GET IT</option>
                    <option value="WORTH_IT">👍 WORTH IT</option>
                    <option value="MID">😐 MID</option>
                    <option value="SAVE_YOUR_MONEY">🚫 SAVE YOUR MONEY</option>
                  </select>
               </div>
               <div>
                  <label style={{ display: "block", color: "#fff", fontSize: "0.8rem", marginBottom: "8px" }}>ADMIN SCORE (0-100)</label>
                  <input type="number" name="admin_score" defaultValue={adminReview?.admin_score || 50} style={inputStyle} />
               </div>
            </div>
            <div style={{ marginTop: "16px" }}>
               <label style={{ display: "block", color: "#fff", fontSize: "0.8rem", marginBottom: "8px" }}>ADMIN BOOST (Affects final rank)</label>
               <input type="number" name="admin_boost" defaultValue={r.admin_boost || 0} style={inputStyle} step="0.1" />
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
             <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" name="is_verified" defaultChecked={r.is_verified} />
                WWH Verified
             </label>
             <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" name="is_featured" defaultChecked={r.is_featured} />
                Featured Listing
             </label>
          </div>

          <button type="submit" style={{ padding: "16px", background: "var(--wwh-accent)", color: "#fff", fontWeight: 700, borderRadius: "8px", border: "none", cursor: "pointer" }}>
            Save Restaurant Changes
          </button>
        </form>

        <hr style={{ margin: "64px 0", borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Dishes Management */}
        <div style={{ marginBottom: "48px" }}>
           <h2 style={{ color: "#fff", fontSize: "1.4rem" }}>Dishes & Menu Items</h2>
           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0" }}>
              {(dishes ?? []).map(d => (
                <span key={d.id} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}>
                  {d.name}
                </span>
              ))}
           </div>
           <form action={addDishAction} style={{ display: "flex", gap: "12px" }}>
              <input type="hidden" name="restaurant_id" value={r.id} />
              <input name="dish_name" placeholder="Add dish (e.g. Oxtail Stew)" style={{ ...inputStyle, flex: 1 }} />
              <button style={{ padding: "0 24px", background: "#2EC4B6", color: "#fff", borderRadius: "8px", border: "none", fontWeight: 700 }}>Add</button>
           </form>
        </div>

        {/* Keywords Management */}
        <div>
           <h2 style={{ color: "#fff", fontSize: "1.4rem" }}>Search Keywords</h2>
           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0" }}>
              {(keywords ?? []).map(k => (
                <span key={k.id} style={{ padding: "6px 12px", background: "rgba(255,90,31,0.1)", borderRadius: "6px", color: "var(--wwh-accent)", fontSize: "0.85rem" }}>
                  {k.keyword}
                </span>
              ))}
           </div>
           <form action={addKeywordAction} style={{ display: "flex", gap: "12px" }}>
              <input type="hidden" name="restaurant_id" value={r.id} />
              <input name="keyword" placeholder="Add keyword alias" style={{ ...inputStyle, flex: 1 }} />
              <button style={{ padding: "0 24px", background: "var(--wwh-accent)", color: "#fff", borderRadius: "8px", border: "none", fontWeight: 700 }}>Add</button>
           </form>
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid var(--wwh-border)",
  borderRadius: "8px",
  color: "#fff",
  fontFamily: "var(--wwh-font-body)",
  outline: "none"
};
