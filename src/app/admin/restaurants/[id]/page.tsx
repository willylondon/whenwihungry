import { requireAdmin } from "@/lib/auth/require-admin";
import { isUuid } from "@/lib/validation";
import { notFound } from "next/navigation";
import { saveRestaurantAction, publishCriticReviewAction, addDishAction, addKeywordAction } from "@/app/admin/restaurants/actions";

export default async function EditRestaurantPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; updated?: string }> }) {
  const { id } = await params;
  const supabase = await requireAdmin("/admin/restaurants");
  if (!isUuid(id)) notFound();
  const feedback = await searchParams;
  
  const [
    { data: r, error: restaurantError },
    { data: adminReview, error: reviewError },
    { data: dishes, error: dishError },
    { data: keywords, error: keywordError }
  ] = await Promise.all([
    supabase.from("restaurants").select("*").eq("id", id).single(),
    supabase.from("admin_reviews").select("*").eq("restaurant_id", id).maybeSingle(),
    supabase.from("dishes").select("*").eq("restaurant_id", id),
    supabase.from("search_keywords").select("*").eq("restaurant_id", id)
  ]);

  if (restaurantError) return <main className="container section"><h1>Restaurant unavailable</h1><p>We could not load this listing. Refresh to try again.</p></main>;
  if (!r) notFound();

  return (
    <main style={{ background: "var(--wwh-bg)", minHeight: "100vh", padding: "100px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 style={{ color: "#fff", marginBottom: "40px" }}>Edit: {r.name}</h1>
        {feedback.error && <p role="alert" className="form-alert">{ERRORS[feedback.error] || "This change could not be saved. Check the form and retry."}</p>}
        {feedback.updated && <p role="status" className="form-success">{SUCCESSES[feedback.updated] || "Change saved."}</p>}
        {(dishError || keywordError) && <p role="alert">Some menu or keyword data could not be loaded. Refresh before editing it.</p>}
        <p>Listing information and critic publication are saved separately. New listings require approval in Listing moderation.</p>
        
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
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>AREA / CITY</label>
               <input name="area" defaultValue={r.area || r.city || ""} style={inputStyle} />
             </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>CUISINE TYPE</label>
               <input name="cuisine_type" defaultValue={r.cuisine_type || r.cuisine || ""} style={inputStyle} placeholder="e.g. Seafood" />
             </div>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>CATEGORY</label>
               <input name="category" defaultValue={r.category || ""} style={inputStyle} placeholder="e.g. Fine Dining" />
             </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>PHONE</label>
               <input name="phone" defaultValue={r.phone || ""} style={inputStyle} />
             </div>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>PRICE LEVEL (1-4)</label>
               <input type="number" name="price_level" defaultValue={r.price_level ?? (typeof r.price_range === "string" && /^\${1,4}$/.test(r.price_range) ? r.price_range.length : "")} placeholder="Unknown" min="1" max="4" style={inputStyle} />
             </div>
          </div>

          <div className="form-group">
            <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>IMAGE URL</label>
            <input name="image_url" defaultValue={r.image_url || ""} style={inputStyle} />
          </div>

          <div className="form-group">
            <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>LISTING DESCRIPTION</label>
            <textarea name="description" defaultValue={r.description || ""} style={{ ...inputStyle, minHeight: "120px" }} />
          </div>

          <label>Ranking adjustment (-100 to 100)
            <input type="number" name="admin_boost" defaultValue={r.admin_boost ?? 0} min="-100" max="100" step="0.1" style={inputStyle} />
          </label>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
             <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" name="is_verified" defaultChecked={r.is_verified} />
                WWH Verified
             </label>
             <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" name="is_featured" defaultChecked={r.is_featured} />
                Featured
             </label>
             <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" name="is_active" defaultChecked={r.is_active !== false} />
                Active Listing
             </label>
          </div>

          <button type="submit" style={{ padding: "16px", background: "var(--wwh-accent)", color: "#fff", fontWeight: 700, borderRadius: "8px", border: "none", cursor: "pointer" }}>
            Save Restaurant Changes
          </button>
        </form>

        <section aria-labelledby="critic-editor" style={{ marginTop: 48, padding: 24, border: "1px solid var(--wwh-border)", borderRadius: 12 }}>
          <h2 id="critic-editor">Publish a critic review</h2>
          <p>This publishes an actual critic visit. Saving the listing above never creates a verdict. Editing a published review preserves its original publication date.</p>
          {reviewError ? <p role="alert">The review could not be loaded, or duplicate review records need resolution. Publishing is unavailable until this is fixed.</p> : <form action={publishCriticReviewAction} style={{ display: "grid", gap: 20 }}>
            <input type="hidden" name="id" value={r.id} />
            <label>Review headline<input name="headline" defaultValue={adminReview?.headline ?? ""} required minLength={5} maxLength={200} style={inputStyle} /></label>
            <label>Honest take<textarea name="honest_take" defaultValue={adminReview?.honest_take ?? ""} required minLength={30} maxLength={10000} rows={8} style={inputStyle} /></label>
            <label>Verdict<select name="verdict" defaultValue={adminReview?.verdict ?? ""} required style={inputStyle}>
              <option value="">Choose the actual verdict</option>
              <option value="RUN_GO_GET_IT">RUN GO GET IT</option><option value="WORTH_IT">WORTH IT</option>
              <option value="MID">MID</option><option value="SAVE_YOUR_MONEY">SAVE YOUR MONEY</option>
            </select></label>
            <label>Critic score (0–100)<input type="number" name="admin_score" defaultValue={adminReview?.admin_score ?? ""} required min={0} max={100} step={1} style={inputStyle} /></label>
            <label>Actual visit date<input type="date" name="visit_date" defaultValue={adminReview?.visit_date ?? ""} required max={new Date().toISOString().slice(0, 10)} style={inputStyle} /></label>
            {adminReview?.created_at && <p>Original publication: {new Date(adminReview.created_at).toLocaleDateString("en-JM", { timeZone: "UTC" })}</p>}
            <label><input type="checkbox" name="publish_confirmed" required /> I confirm this is a real critic review and want to publish it</label>
            <button type="submit" className="btn btn-primary">{adminReview ? "Publish review changes" : "Publish critic review"}</button>
          </form>}
        </section>

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

const ERRORS: Record<string, string> = {
  invalid: "Check the listing fields. Use a Jamaican parish, a lowercase URL slug, price 1–4 or blank, and valid http/https image URL.",
  save_failed: "The listing change could not be confirmed. It may be missing or unavailable. Refresh and retry.",
  review_invalid: "Add a headline, at least 30 characters of honest review, a chosen verdict, score 0–100, a valid past visit date, and confirm publication.",
  review_unavailable: "The current review could not be read. Resolve database errors or duplicate reviews before publishing.",
  review_failed: "Review publication could not be confirmed. The atomic publishing database function may be unavailable, or the save was denied. Refresh to check the current review before retrying.",
  dish_failed: "The dish could not be saved. Refresh to check the menu before retrying.",
  keyword_failed: "The keyword could not be saved. Refresh to check the list before retrying."
};
const SUCCESSES: Record<string, string> = {
  listing: "Listing saved. Critic review unchanged.", review: "Critic review saved and marked reviewed. Public visibility still depends on listing approval and activity.",
  unchanged: "Review already matches these details. Its date was preserved.", created: "Pending listing created. Approve it in Listing moderation when ready.", dish: "Dish saved.", keyword: "Keyword saved."
};
