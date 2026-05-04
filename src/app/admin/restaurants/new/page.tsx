import { createRestaurantAction } from "@/app/admin/restaurants/actions";

export default function NewRestaurantPage() {
  return (
    <main style={{ background: "var(--wwh-bg)", minHeight: "100vh", padding: "100px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 style={{ color: "#fff", marginBottom: "40px" }}>Add New Restaurant</h1>
        
        <form action={createRestaurantAction} style={{ display: "grid", gap: "24px" }}>
          <div className="form-group">
            <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>NAME</label>
            <input name="name" required style={inputStyle} placeholder="Restaurant Name" />
          </div>

          <div className="form-group">
            <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>SLUG (URL)</label>
            <input name="slug" required style={inputStyle} placeholder="restaurant-name-slug" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>PARISH</label>
               <input name="parish" required style={inputStyle} placeholder="Kingston, St. Ann, etc." />
             </div>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>AREA / CITY</label>
               <input name="area" style={inputStyle} placeholder="Optional" />
             </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>CUISINE TYPE</label>
               <input name="cuisine_type" style={inputStyle} placeholder="e.g. Seafood" />
             </div>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>CATEGORY</label>
               <input name="category" style={inputStyle} placeholder="e.g. Fine Dining" />
             </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>IMAGE URL</label>
               <input name="image_url" style={inputStyle} placeholder="https://..." />
             </div>
             <div>
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>PRICE LEVEL (1-4)</label>
               <input type="number" name="price_level" defaultValue="2" min="1" max="4" style={inputStyle} />
             </div>
          </div>

          <div className="form-group">
            <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>DESCRIPTION</label>
            <textarea name="description" style={{ ...inputStyle, minHeight: "120px" }} placeholder="Initial honest take..." />
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
             <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" name="is_verified" />
                WWH Verified
             </label>
          </div>

          <button type="submit" style={{ padding: "16px", background: "var(--wwh-accent)", color: "#fff", fontWeight: 700, borderRadius: "8px", border: "none", cursor: "pointer" }}>
            Create Restaurant Listing
          </button>
        </form>
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
