import Image from "next/image";
import Link from "next/link";
import { type PlaceV2 } from "@/lib/community";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { getPlaceStatusLabel, getPlaceCta, getPlaceStatus } from "@/lib/place-status";

type PlaceListCardProps = {
  place: PlaceV2;
  showMatchReason?: boolean;
};

export function PlaceListCard({ place, showMatchReason = false }: PlaceListCardProps) {
  const status = getPlaceStatus(place);
  const statusLabel = getPlaceStatusLabel(place);
  const cta = getPlaceCta(place);
  const displayName = place.name || "Unnamed Food Spot";
  const hasPublicSignal = (place.public_rating ?? 0) > 0 || (place.public_review_count ?? 0) > 0;

  return (
    <Link
      href={`/places/${place.slug}`}
      style={{
        display: "grid",
        gridTemplateColumns: "280px minmax(0, 1fr)",
        background: "var(--wwh-card)",
        border: "1px solid var(--wwh-border)",
        borderRadius: "16px",
        overflow: "hidden",
        textDecoration: "none",
        transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease"
      }}
      className="browse-card-link"
    >
      {/* ── Image ── */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: "100%" }}>
        <Image
          alt={displayName}
          src={place.image}
          width={320}
          height={260}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Verified badge */}
        {place.is_verified && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "rgba(46,196,182,0.95)",
              padding: "5px 12px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
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

      {/* ── Body ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "20px 24px"
        }}
      >
        {/* Status row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span
            style={{
              color: status === "critic-reviewed" ? "var(--wwh-accent)" : "rgba(255,255,255,0.35)",
              fontWeight: 700,
              fontSize: "0.72rem",
              fontFamily: "var(--wwh-font-body)",
              textTransform: "uppercase",
              letterSpacing: "0.06em"
            }}
          >
            {statusLabel}
          </span>
          {showMatchReason && place.match_reason && (
            <span
              style={{
                fontSize: "0.65rem",
                color: "#fff",
                fontWeight: 900,
                letterSpacing: "0.05em",
                background: "var(--wwh-accent)",
                padding: "3px 10px",
                borderRadius: "4px"
              }}
            >
              MATCH: {place.match_reason.toUpperCase()}
            </span>
          )}
        </div>

        {/* Name */}
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--wwh-font-heading)",
            fontSize: "1.35rem",
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            lineHeight: 1.1
          }}
        >
          {displayName}
        </h3>

        {/* Verdict badge if reviewed */}
        {place.verdict && status === "critic-reviewed" && (
          <div>
            <VerdictBadge verdict={place.verdict} size="sm" />
          </div>
        )}

        {/* Description */}
        {place.description && (
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "0.85rem",
              lineHeight: 1.55,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {place.description}
          </p>
        )}

        {/* Metadata row */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            color: "rgba(255,255,255,0.35)",
            fontFamily: "var(--wwh-font-body)",
            fontSize: "0.78rem",
            flexWrap: "wrap"
          }}
        >
          {place.category && <span>{place.category}</span>}
          {place.category && place.priceRange && <span>·</span>}
          {place.priceRange && <span>{place.priceRange}</span>}
          {(place.category || place.priceRange) && place.parish && <span>·</span>}
          {place.parish && <span>{place.parish}</span>}
        </div>

        {/* Public signal */}
        {hasPublicSignal && (
          <div
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "0.72rem"
            }}
          >
            <span style={{ color: "#FFD700" }}>★</span>{" "}
            Public signal: {typeof place.public_rating === "number" ? place.public_rating.toFixed(1) : "—"}
            {(place.public_review_count ?? 0) > 0 && (
              <span> · {Number(place.public_review_count ?? 0).toLocaleString()} ratings</span>
            )}
          </div>
        )}

        {/* CTA */}
        <span
          style={{
            marginTop: "auto",
            color: "var(--wwh-accent)",
            fontFamily: "var(--wwh-font-body)",
            fontWeight: 700,
            fontSize: "0.85rem"
          }}
        >
          {cta}
        </span>
      </div>
    </Link>
  );
}
