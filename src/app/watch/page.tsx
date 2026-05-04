import type { Metadata } from "next";
import { getVideoReviews } from "@/lib/places";
import { VideoCard } from "@/components/ui/video-card";
import { SectionHeader } from "@/components/ui/section-header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Watch Reviews | WhenWiHungry",
  description:
    "Video-first Jamaican food reviews. Watch before you spend. TikTok reviews from Jamaica's anonymous food critic."
};

export default function WatchPage() {
  const videos = getVideoReviews();

  return (
    <div style={{ background: "var(--wwh-bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          padding: "72px 0 48px",
          background: "var(--wwh-surface)",
          borderBottom: "1px solid var(--wwh-border)"
        }}
      >
        <div style={{ width: "min(1200px, calc(100% - 40px))", margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              marginBottom: "16px",
              padding: "6px 14px",
              background: "rgba(255,77,45,0.1)",
              border: "1px solid rgba(255,77,45,0.25)",
              borderRadius: "999px",
              color: "var(--wwh-accent)",
              fontFamily: "var(--wwh-font-body)",
              fontWeight: 700,
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em"
            }}
          >
            ▶ Video Reviews
          </span>
          <h1
            style={{
              margin: "0 0 16px",
              fontFamily: "var(--wwh-font-heading)",
              fontSize: "clamp(3rem, 6vw, 5rem)",
              color: "#fff",
              lineHeight: 0.92,
              textTransform: "uppercase"
            }}
          >
            WATCH BEFORE
            <br />
            <span style={{ color: "var(--wwh-accent)" }}>YOU SPEND.</span>
          </h1>
          <p
            style={{
              margin: 0,
              color: "var(--wwh-muted)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "560px"
            }}
          >
            Every review starts with the video. No filter, no script, just the honest reaction to the food in front of me.
          </p>

          {/* TikTok follow CTA */}
          <div style={{ marginTop: "28px" }}>
            <a
              href="https://tiktok.com/@whenwihungry"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 24px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontFamily: "var(--wwh-font-body)",
                fontWeight: 600,
                fontSize: "0.9rem",
                borderRadius: "8px",
                textDecoration: "none"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
              </svg>
              Follow on TikTok
            </a>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section style={{ padding: "64px 0" }}>
        <div style={{ width: "min(1200px, calc(100% - 40px))", margin: "0 auto" }}>
          {videos.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px"
              }}
              className="watch-grid"
            >
              {videos.map((post) => (
                <VideoCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--wwh-muted)",
                fontFamily: "var(--wwh-font-body)"
              }}
            >
              <p style={{ fontSize: "3rem", margin: "0 0 16px" }}>🎬</p>
              <p style={{ fontSize: "1rem" }}>Videos loading... check back soon.</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .watch-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .watch-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
