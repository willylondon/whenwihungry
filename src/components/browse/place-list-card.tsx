import Image from "next/image";
import Link from "next/link";
import { type PlaceV2 } from "@/lib/community";
import { VerdictBadge } from "@/components/ui/verdict-badge";

type PlaceListCardProps = {
  place: PlaceV2;
};

export function PlaceListCard({ place }: PlaceListCardProps) {
  return (
    <Link className="browse-card card" href={`/places/${place.slug}`} style={{ overflow: "hidden", display: "block" }}>
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
              border: "1px solid rgba(46,196,182,0.4)"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#2EC4B6">
              <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-2 14.5l-3.5-3.5 1.41-1.41L10 13.67l7.09-7.09 1.41 1.41L10 16.5z"/>
            </svg>
            <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.05em" }}>WWH VERIFIED</span>
          </div>
        )}
      </div>
      <div className="browse-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div className="post-date" style={{ color: "var(--wwh-accent)", fontWeight: 700, fontSize: "0.75rem" }}>THE HONEST TAKE</div>
          {place.match_reason && (
             <span style={{ fontSize: "0.7rem", color: "var(--wwh-accent)", fontWeight: 700, fontFamily: "var(--wwh-font-body)", background: "rgba(255,90,31,0.1)", padding: "2px 8px", borderRadius: "4px" }}>
               MATCH: {place.match_reason.toUpperCase()}
             </span>
          )}
        </div>
        
        <h3 style={{ marginBottom: "12px", color: "#fff" }}>{place.name}</h3>
        
        <div className="card-topline" style={{ marginBottom: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
          <VerdictBadge verdict={place.verdict} size="sm" />
          <span className="badge" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>{place.type}</span>
        </div>

        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginBottom: "20px", lineHeight: 1.6 }}>{place.description}</p>
        
        <div className="listing-details" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px", marginBottom: "12px", display: "flex", gap: "12px", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
          <span>{place.category}</span>
          <span>•</span>
          <span>{place.priceRange}</span>
          <span>•</span>
          <span>{place.parish}</span>
        </div>
        
        <div className="card-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
               <span style={{ color: "var(--wwh-accent2)", fontSize: "0.9rem" }}>★</span>
               <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>{place.community_score ? (place.community_score / 20).toFixed(1) : "0.0"}</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>{place.reviewCount} reviews</span>
          </div>
          <strong className="read-more" style={{ color: "var(--wwh-accent)", fontSize: "0.85rem" }}>READ TRUTH &rarr;</strong>
        </div>
      </div>
    </Link>
  );
}
