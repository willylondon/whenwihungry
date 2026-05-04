import Link from "next/link";
import { type PlaceV2 } from "@/lib/community";
import { VerdictBadge } from "@/components/ui/verdict-badge";

type ReviewCardProps = {
  place: PlaceV2;
  variant?: "horizontal" | "vertical";
};

export function ReviewCard({ place, variant = "vertical" }: ReviewCardProps) {
  if (variant === "horizontal") {
    return (
      <Link
        href={`/places/${place.slug}`}
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: 0,
          background: "var(--wwh-card)",
          border: "1px solid var(--wwh-border)",
          borderRadius: "16px",
          overflow: "hidden",
          textDecoration: "none",
          transition: "transform 260ms ease, box-shadow 260ms ease"
        }}
        className="review-card-link"
      >
        <div style={{ overflow: "hidden", position: "relative" }}>
          <img
            src={place.image}
            alt={place.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <VerdictBadge verdict={place.verdict} size="sm" />
          <h3 style={{ margin: 0, fontSize: "1rem", color: "#fff" }}>{place.name}</h3>
          <p style={{ margin: 0, color: "var(--wwh-muted)", fontSize: "0.88rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {place.description}
          </p>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
            {place.parish} · {place.category}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/places/${place.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--wwh-card)",
        border: "1px solid var(--wwh-border)",
        borderRadius: "16px",
        overflow: "hidden",
        textDecoration: "none",
        transition: "transform 260ms ease"
      }}
      className="review-card-vert"
    >
      <div style={{ overflow: "hidden", height: "220px", position: "relative" }}>
        <img
          src={place.image}
          alt={place.name}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
          <VerdictBadge verdict={place.verdict} size="sm" />
        </div>
      </div>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--wwh-accent)" }}>
          {place.category}
        </span>
        <h3 style={{ margin: 0, fontSize: "1.05rem", color: "#fff" }}>{place.name}</h3>
        <p style={{ margin: 0, color: "var(--wwh-muted)", fontSize: "0.88rem", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {place.description}
        </p>
        <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--wwh-border)", display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
          <span>{place.parish}</span>
          <span>{place.priceRange}</span>
        </div>
      </div>
    </Link>
  );
}
