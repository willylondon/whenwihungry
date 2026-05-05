import type { Metadata } from "next";
import Link from "next/link";
import { getAllApprovedPlaces } from "@/lib/community";
import { isReviewed, getPlaceStatusLabel, getPlaceCta, getPlaceStatus } from "@/lib/place-status";

export const metadata: Metadata = {
  title: "Viral Jamaican Food Reviews",
  description:
    "Watch WhenWiHungry's viral Jamaican food reviews, anonymous verdicts, and honest food reactions.",
  openGraph: {
    title: "Viral Jamaican Food Reviews | WhenWiHungry",
    description:
      "Watch WhenWiHungry's viral Jamaican food reviews, anonymous verdicts, and honest food reactions.",
    images: [
      {
        url: "https://whenwihungry.vercel.app/og/whenwihungry-og.png",
        width: 1200,
        height: 630,
        alt: "WhenWiHungry — Jamaica's boldest food critic",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://whenwihungry.vercel.app/og/whenwihungry-og.png"]
  }
};

export default async function ReviewsPage() {
  const allPlaces = await getAllApprovedPlaces();
  const reviewed = allPlaces.filter(isReviewed);

  return (
    <main style={{ background: "var(--wwh-bg)", minHeight: "100svh" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "100px 0 64px",
          textAlign: "center",
          borderBottom: "1px solid var(--wwh-border)"
        }}
      >
        <div style={{ width: "min(800px, calc(100% - 40px))", margin: "0 auto" }}>
          <span style={{ display: "inline-block", marginBottom: "16px", padding: "6px 16px", background: "rgba(255,90,31,0.10)", border: "1px solid rgba(255,90,31,0.25)", borderRadius: "999px", color: "var(--wwh-accent)", fontFamily: "var(--wwh-font-body)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.10em" }}>
            Viral Reviews
          </span>
          <h1 style={{ margin: "0 0 20px", fontFamily: "var(--wwh-font-heading)", fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "#fff", lineHeight: 0.94, textTransform: "uppercase" }}>
            Real Food Reactions.<span style={{ color: "var(--wwh-accent)", display: "block" }}>Viral Jamaican Reviews.</span>No Fake Ratings.
          </h1>
          <p style={{ margin: "0 auto 0", color: "rgba(255,255,255,0.55)", fontFamily: "var(--wwh-font-body)", fontSize: "clamp(1rem, 1.5vw, 1.15rem)", lineHeight: 1.7, maxWidth: "600px" }}>
            Browse the WhenWiHungry spots that have already been reviewed on TikTok or given a critic verdict.
          </p>
        </div>
      </section>

      {/* Results */}
      <section style={{ padding: "64px 0 96px" }}>
        <div style={{ width: "min(1200px, calc(100% - 40px))", margin: "0 auto" }}>
          {reviewed.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--wwh-border)", borderRadius: "24px" }}>
              <span style={{ fontSize: "3rem", display: "block", marginBottom: "20px" }}>🎬</span>
              <h2 style={{ fontFamily: "var(--wwh-font-heading)", fontSize: "1.8rem", color: "#fff", margin: "0 0 12px", textTransform: "uppercase" }}>Connecting Reviewed Spots</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--wwh-font-body)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 28px" }}>
                Reviewed spots are being connected. For now, follow the TikTok page for the latest viral reviews.
              </p>
              <a href="https://tiktok.com/@whenwihungry" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", background: "var(--wwh-accent)", color: "#fff", fontFamily: "var(--wwh-font-body)", fontWeight: 700, fontSize: "0.95rem", borderRadius: "10px", textDecoration: "none" }}>
                Follow on TikTok →
              </a>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {reviewed.map((place) => {
                const status = getPlaceStatus(place);
                const label = getPlaceStatusLabel(place);
                const cta = getPlaceCta(place);
                const tiktokUrl = place.tiktokUrl;
                return (
                  <div key={place.slug} style={{ display: "flex", flexDirection: "column", background: "var(--wwh-card)", border: "1px solid var(--wwh-border)", borderRadius: "16px", overflow: "hidden" }}>
                    <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                      <img src={place.image} alt={place.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", background: status === "critic-reviewed" ? "rgba(255,90,31,0.15)" : "rgba(99,221,242,0.12)", border: status === "critic-reviewed" ? "1px solid rgba(255,90,31,0.3)" : "1px solid rgba(99,221,242,0.25)", borderRadius: "999px", color: status === "critic-reviewed" ? "var(--wwh-accent)" : "#63ddf2", fontFamily: "var(--wwh-font-body)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {label}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "var(--wwh-accent)", fontFamily: "var(--wwh-font-body)", letterSpacing: "0.06em" }}>
                        {place.category} · {place.parish}
                      </span>
                      <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#fff", fontFamily: "var(--wwh-font-heading)", textTransform: "uppercase", letterSpacing: "0.02em" }}>{place.name}</h3>
                      {(place.description || place.public_listing_summary) && (
                        <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontFamily: "var(--wwh-font-body)", fontSize: "0.85rem", lineHeight: 1.6, flex: 1 }}>
                          {place.description || place.public_listing_summary}
                        </p>
                      )}
                      {(place.public_review_count || place.public_rating) && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", fontFamily: "var(--wwh-font-body)" }}>
                          <span style={{ color: "#FFD700" }}>★</span>
                          Public signal: {typeof place.public_rating === "number" ? place.public_rating.toFixed(1) : "—"}
                          {Number(place.public_review_count ?? 0) > 0 && <span>· {Number(place.public_review_count ?? 0).toLocaleString()} ratings</span>}
                        </div>
                      )}
                      <Link href={status === "tiktok-reviewed" && tiktokUrl ? tiktokUrl : `/places/${place.slug}`} {...(status === "tiktok-reviewed" && tiktokUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "auto", padding: "12px 20px", background: status === "critic-reviewed" ? "var(--wwh-accent)" : "rgba(255,255,255,0.06)", border: status === "critic-reviewed" ? "none" : "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "var(--wwh-font-body)", fontWeight: 700, fontSize: "0.85rem", borderRadius: "8px", textDecoration: "none" }}>
                        {cta}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
