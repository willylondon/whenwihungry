import Link from "next/link";
import type { ReviewPost } from "@/data/reviews";
import { SectionHeader } from "@/components/ui/section-header";
import { VerdictBadge } from "@/components/ui/verdict-badge";

type HiddenGemsProps = {
  posts: ReviewPost[];
};

export function HiddenGems({ posts }: HiddenGemsProps) {
  if (posts.length === 0) {
    // Fallback if no hidden gems flagged yet
    return null;
  }

  return (
    <section
      style={{
        background: "var(--wwh-surface)",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,200,87,0.06) 0%, transparent 70%)",
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(1200px, calc(100% - 40px))",
          margin: "0 auto"
        }}
      >
        <SectionHeader
          eyebrow="Hidden Gems"
          heading="Spots Nobody Tells You About"
          accentWord="Nobody"
          subtext="No algorithm put you here. These are the real finds."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px"
          }}
        >
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/reviews/${post.slug}`}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr",
                gap: 0,
                background: "var(--wwh-card)",
                border: "1px solid var(--wwh-border)",
                borderRadius: "14px",
                overflow: "hidden",
                textDecoration: "none",
                transition: "transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease"
              }}
              className="gem-card"
            >
              {/* Image */}
              <div style={{ overflow: "hidden", position: "relative" }}>
                <img
                  src={post.image}
                  alt={post.restaurant}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 400ms ease"
                  }}
                  className="gem-img"
                />
                {/* Gem badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--wwh-accent2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px"
                  }}
                >
                  💎
                </div>
              </div>

              {/* Content */}
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  justifyContent: "center"
                }}
              >
                <VerdictBadge verdict={post.verdict} size="sm" />
                <p
                  style={{
                    margin: 0,
                    color: "var(--wwh-text)",
                    fontFamily: "var(--wwh-font-body)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    lineHeight: 1.35
                  }}
                >
                  {post.restaurant}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "var(--wwh-muted)",
                    fontFamily: "var(--wwh-font-body)",
                    fontSize: "0.8rem"
                  }}
                >
                  {post.location}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "var(--wwh-font-body)",
                    fontSize: "0.82rem",
                    fontStyle: "italic",
                    lineHeight: 1.45
                  }}
                >
                  &ldquo;{post.quote.slice(0, 70)}&hellip;&rdquo;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .gem-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
          border-color: rgba(255,200,87,0.25) !important;
        }
        .gem-card:hover .gem-img {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}
