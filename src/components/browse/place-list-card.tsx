import Image from "next/image";
import Link from "next/link";
import { type PlaceV2 } from "@/lib/community";

type PlaceListCardProps = {
  place: PlaceV2;
};

const VERDICT_MAP: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  RUN_GO_GET_IT: { label: "RUN GO GET IT", icon: "🔥", color: "#FF5A1F", bg: "rgba(255,90,31,0.1)" },
  WORTH_IT: { label: "WORTH IT", icon: "👍", color: "#2EC4B6", bg: "rgba(46,196,182,0.1)" },
  MID: { label: "MID", icon: "😐", color: "#9CA3AF", bg: "rgba(156,163,175,0.1)" },
  SAVE_YOUR_MONEY: { label: "SAVE YOUR MONEY", icon: "🚫", color: "#EF476F", bg: "rgba(239,71,111,0.1)" }
};

export function PlaceListCard({ place }: PlaceListCardProps) {
  const verdict = VERDICT_MAP[place.verdict || ""] || null;

  return (
    <Link className="browse-card card" href={`/places/${place.slug}`} style={{ overflow: "hidden" }}>
      <div className="browse-image-wrap" style={{ position: "relative" }}>
        <Image
          alt={place.name}
          className="browse-image"
          height={220}
          loading="lazy"
          src={place.image}
          width={320}
        />
        {place.is_verified && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "rgba(11,11,11,0.85)",
              backdropFilter: "blur(4px)",
              padding: "4px 10px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#2EC4B6">
              <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-2 14.5l-3.5-3.5 1.41-1.41L10 13.67l7.09-7.09 1.41 1.41L10 16.5z"/>
            </svg>
            <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em" }}>WWH VERIFIED</span>
          </div>
        )}
      </div>
      <div className="browse-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div className="post-date" style={{ color: "var(--wwh-accent)", fontWeight: 700 }}>THE HONEST TAKE</div>
          {place.match_reason && (
             <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontFamily: "var(--wwh-font-body)" }}>
               Match: {place.match_reason}
             </span>
          )}
        </div>
        
        <h3 style={{ marginBottom: "12px" }}>{place.name}</h3>
        
        <div className="card-topline" style={{ marginBottom: "16px" }}>
          {verdict && (
            <span 
              className="badge" 
              style={{ 
                background: verdict.bg, 
                color: verdict.color, 
                padding: "6px 12px", 
                borderRadius: "8px", 
                fontSize: "0.75rem", 
                fontWeight: 800,
                border: `1px solid ${verdict.color}33`
              }}
            >
              {verdict.icon} {verdict.label}
            </span>
          )}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span className="badge">{place.type}</span>
          </div>
        </div>

        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>{place.description}</p>
        
        <div className="listing-details" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px", marginBottom: "12px" }}>
          <span>{place.category}</span>
          <span>{place.priceRange}</span>
          <span>{place.parish}</span>
        </div>
        
        <div className="card-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
               <span style={{ color: "#FFD700", fontSize: "0.9rem" }}>★</span>
               <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>{Number(place.rating).toFixed(1)}</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{place.reviewCount} reviews</span>
          </div>
          <strong className="read-more" style={{ color: "var(--wwh-accent)" }}>READ TRUTH &rarr;</strong>
        </div>
      </div>
    </Link>
  );
}
