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
               <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>CITY</label>
               <input name="city" style={inputStyle} placeholder="Optional" />
             </div>
          </div>

          <div className="form-group">
            <label style={{ display: "block", color: "var(--wwh-accent)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "8px" }}>DESCRIPTION</label>
            <textarea name="description" style={{ ...inputStyle, minHeight: "120px" }} placeholder="Initial honest take..." />
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
