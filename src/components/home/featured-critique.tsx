import Link from "next/link";
import type { Place } from "@/data/places";
import { getVerdictFromRating } from "@/lib/verdict";
import { VerdictBadge } from "@/components/ui/verdict-badge";

type FeaturedCritiqueProps = {
  place: Place;
};

export function FeaturedCritique({ place }: FeaturedCritiqueProps) {
  const verdict = getVerdictFromRating(place.rating);
  const quote = place.description || "A solid spot to grab a bite.";
  return (
    <section
      style={{
        background: "var(--wwh-bg)",
        padding: "96px 0"
      }}
    >
      <div
        style={{
          width: "min(1200px, calc(100% - 40px))",
          margin: "0 auto"
        }}
      >
        {/* Section label */}
        <div style={{ marginBottom: "40px", display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{
              fontFamily: "var(--wwh-font-body)",
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "var(--wwh-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.12em"
            }}
          >
            Featured Review
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--wwh-border)" }} />
        </div>

        {/* Card */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            background: "var(--wwh-card)",
            border: "1px solid var(--wwh-border)",
            borderRadius: "20px",
            overflow: "hidden",
            minHeight: "480px"
          }}
          className="featured-card"
        >
          {/* Image */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img
              src={place.image}
              alt={place.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                minHeight: "400px",
                transition: "transform 600ms ease"
              }}
              className="featured-img"
            />
            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, transparent 60%, rgba(26,26,26,0.9) 100%)"
              }}
            />
            {/* Video play hint */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "999px"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span
                style={{
                  color: "#fff",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 600,
                  fontSize: "0.8rem"
                }}
              >
                Watch Review
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              padding: "48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "20px"
            }}
            className="featured-content"
          >
            <VerdictBadge verdict={verdict} size="md" />

            <div>
              <span
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "var(--wwh-muted)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em"
                }}
              >
                {place.category} · {place.parish}
              </span>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--wwh-font-heading)",
                  fontSize: "clamp(2rem, 3vw, 2.8rem)",
                  color: "var(--wwh-text)",
                  lineHeight: 0.97,
                  textTransform: "uppercase"
                }}
              >
                {place.name}
              </h2>
            </div>

            <blockquote
              style={{
                margin: 0,
                padding: "0 0 0 16px",
                borderLeft: "3px solid var(--wwh-accent)",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--wwh-font-body)",
                fontSize: "1.05rem",
                lineHeight: 1.65,
                fontStyle: "italic"
              }}
            >
              &ldquo;{quote}&rdquo;
            </blockquote>

            {/* Quick hits */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px"
              }}
            >
              {[
                { label: "Cuisine", value: place.type },
                { label: "Price", value: place.priceRange }
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--wwh-border)",
                    borderRadius: "10px"
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color: "var(--wwh-accent)",
                      fontFamily: "var(--wwh-font-body)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "4px"
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      color: "var(--wwh-text)",
                      fontFamily: "var(--wwh-font-body)",
                      fontSize: "0.9rem",
                      fontWeight: 600
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
              <Link
                href={`/places/${place.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "12px 24px",
                  background: "var(--wwh-accent)",
                  color: "#fff",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "transform 160ms ease, box-shadow 160ms ease"
                }}
                className="featured-read-btn"
              >
                The Honest Take
              </Link>
              <Link
                href={`/places/${place.slug}#video`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "12px 24px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--wwh-border)",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "background 160ms ease"
                }}
                className="featured-watch-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .featured-card:hover .featured-img {
          transform: scale(1.04);
        }
        .featured-read-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255,90,31,0.35);
        }
        .featured-watch-btn:hover {
          background: rgba(255,255,255,0.09) !important;
        }
        @media (max-width: 768px) {
          .featured-card {
            grid-template-columns: 1fr !important;
          }
          .featured-content {
            padding: 28px !important;
          }
        }
      `}</style>
    </section>
  );
}
