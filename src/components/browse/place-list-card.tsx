import Image from "next/image";
import Link from "next/link";
import { type PlaceV2 } from "@/lib/community";
import { VerdictBadge } from "@/components/ui/verdict-badge";

type PlaceListCardProps = {
  place: PlaceV2;
  showMatchReason?: boolean;
};

export function PlaceListCard({ place, showMatchReason = false }: PlaceListCardProps) {
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
              background: "rgba(46,196,182,0.95)",
              backdropFilter: "blur(4px)",
              padding: "5px 12px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
              zIndex: 10,
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-2 14.5l-3.5-3.5 1.41-1.41L10 13.67l7.09-7.09 1.41 1.41L10 16.5z"/>
            </svg>
            <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.08em" }}>VERIFIED</span>
          </div>
        )}
      </div>
      <div className="browse-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div className="post-date" style={{ color: "var(--wwh-accent)", fontWeight: 700, fontSize: "0.75rem" }}>THE HONEST TAKE</div>
          {showMatchReason && place.match_reason && (
             <span style={{ 
               fontSize: "0.65rem", 
               color: "#fff", 
               fontWeight: 900, 
               letterSpacing: "0.05em",
               background: "var(--wwh-accent)", 
               padding: "3px 10px", 
               borderRadius: "4px",
               boxShadow: "0 2px 8px rgba(255,90,31,0.3)"
             }}>
               MATCH: {place.match_reason.toUpperCase()}
             </span>
          )}
        </div>
        
        <h3 style={{ marginBottom: "12px", color: "#fff" }}>{place.name}</h3>
        
        <div className="card-topline" style={{ marginBottom: "16px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {place.verdict ? (
            <VerdictBadge verdict={place.verdict} size="sm" />
          ) : (
            <span style={{
              padding: "4px 12px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "999px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase"
            }}>
              Not Yet Reviewed
            </span>
          )}
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
          {(place.community_score || place.rating) ? (
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
              Public signal: {((place.community_score || (place.rating * 20) || 0) / 20).toFixed(1)}
              {place.reviewCount > 0 && ` · ${place.reviewCount.toLocaleString()} reviews`}
            </span>
          ) : (
            <span />
          )}
          <strong className="read-more" style={{ color: "var(--wwh-accent)", fontSize: "0.85rem" }}>READ TRUTH &rarr;</strong>
        </div>
      </div>
    </Link>
  );
}
