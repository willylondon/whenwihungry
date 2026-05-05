import type { Metadata } from "next";
import Link from "next/link";
import { getPublicFoodSpotCountLabel } from "@/lib/place-counts";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "About the Anonymous Food Critic",
  description:
    "The anonymous food critic behind WhenWiHungry. No face. No bias. Just the honest truth about Jamaican food.",
  openGraph: {
    title: "About the Anonymous Food Critic | WhenWiHungry",
    description:
      "The anonymous food critic behind WhenWiHungry. No face. No bias. Just the honest truth about Jamaican food.",
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

const PHILOSOPHY = [
  {
    icon: "🎭",
    heading: "Anonymous by Design",
    body: "No face means no recognition. No recognition means the restaurant treats me like everyone else. That's the only way to get a real review."
  },
  {
    icon: "💳",
    heading: "I Pay My Own Bill",
    body: "Always. No free meals in exchange for a review. No 'media discount'. If I'm paying, I'm experiencing what you experience — which is the whole point."
  },
  {
    icon: "🚫",
    heading: "No Stars. No Scales.",
    body: "Star ratings are vague. A 3-star restaurant could mean brilliance or tragedy depending on who's rating. My verdicts say exactly what I mean."
  },
  {
    icon: "📱",
    heading: "Video First",
    body: "You can read a review or you can watch my face when the food hits. The video doesn't lie. That's why every review starts there."
  }
];

export default async function AboutPage() {
  const foodSpotCountLabel = await getPublicFoodSpotCountLabel();
  return (
    <div style={{ background: "var(--wwh-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "96px 0 80px",
          background: "var(--wwh-surface)",
          borderBottom: "1px solid var(--wwh-border)",
          overflow: "hidden"
        }}
      >
        {/* Red glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,90,31,0.08) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "min(1000px, calc(100% - 40px))",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "64px",
            alignItems: "center"
          }}
          className="about-hero-grid"
        >
          <div>
            <span
              style={{
                display: "inline-block",
                marginBottom: "20px",
                fontFamily: "var(--wwh-font-body)",
                fontWeight: 700,
                fontSize: "0.8rem",
                color: "var(--wwh-accent)",
                textTransform: "uppercase",
                letterSpacing: "0.12em"
              }}
            >
              The Critic
            </span>
            <h1
              style={{
                margin: "0 0 24px",
                fontFamily: "var(--wwh-font-heading)",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                color: "#fff",
                lineHeight: 0.92,
                textTransform: "uppercase"
              }}
            >
              NO FACE.
              <br />
              <span style={{ color: "var(--wwh-accent)" }}>NO BIAS.</span>
              <br />
              NO FILTER.
            </h1>
            <p
              style={{
                margin: "0 0 20px",
                color: "rgba(255,255,255,0.65)",
                fontFamily: "var(--wwh-font-body)",
                fontSize: "1.1rem",
                lineHeight: 1.75
              }}
            >
              WhenWiHungry is a faceless TikTok food critic account covering Jamaican food — cook shops, jerk stops, seafood runs, patty spots, and everywhere in between.
            </p>
            <p
              style={{
                margin: 0,
                color: "var(--wwh-muted)",
                fontFamily: "var(--wwh-font-body)",
                fontSize: "1rem",
                lineHeight: 1.75
              }}
            >
              The identity stays hidden. The opinions stay honest. That's the trade.
            </p>
            <div style={{ marginTop: "32px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="https://tiktok.com/@whenwihungry"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  background: "var(--wwh-accent)",
                  color: "#fff",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderRadius: "8px",
                  textDecoration: "none"
                }}
              >
                Follow on TikTok
              </a>
              <Link
                href="/browse"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "14px 28px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  borderRadius: "8px",
                  textDecoration: "none"
                }}
              >
                Browse Food Spots
              </Link>
            </div>
          </div>

          {/* Avatar */}
          <div
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              aspectRatio: "1/1",
              border: "1px solid rgba(255,90,31,0.3)"
            }}
          >
            <img
              src="/critic-avatar.png"
              alt="The Anonymous Critic"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "8px 20px",
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,90,31,0.4)",
                borderRadius: "999px",
                whiteSpace: "nowrap"
              }}
            >
              <span
                style={{
                  color: "var(--wwh-accent)",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em"
                }}
              >
                Identity: Unknown
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          padding: "48px 0",
          background: "#000",
          borderBottom: "1px solid var(--wwh-border)"
        }}
      >
        <div
          style={{
            width: "min(1000px, calc(100% - 40px))",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            textAlign: "center"
          }}
          className="stats-row"
        >
          {[
            { value: "3K+", label: "TikTok Followers" },
            { value: "100K+", label: "Total Views" },
            { value: foodSpotCountLabel, label: "Food Spots Listed" },
            { value: "0", label: "Free Meals Accepted" }
          ].map((stat) => (
            <div key={stat.label}>
              <p
                style={{
                  margin: "0 0 4px",
                  fontFamily: "var(--wwh-font-heading)",
                  fontSize: "3rem",
                  color: "var(--wwh-accent)",
                  lineHeight: 1
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "var(--wwh-muted)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em"
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof So Far */}
      <section style={{ padding: "80px 0", background: "rgba(255,90,31,0.03)", borderTop: "1px solid rgba(255,90,31,0.08)", borderBottom: "1px solid rgba(255,90,31,0.08)" }}>
        <div style={{ width: "min(800px, calc(100% - 40px))", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 40px", fontFamily: "var(--wwh-font-heading)", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: "#fff", textTransform: "uppercase", letterSpacing: "0.02em" }}>
            The Proof So Far
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", maxWidth: "700px", margin: "0 auto" }} className="proof-grid">
            {[
              { value: "10+", label: "Viral TikTok Reviews" },
              { value: "100K+", label: "Total Views" },
              { value: foodSpotCountLabel, label: "Food Spots Mapped" },
              { value: "0", label: "Free Meals Accepted" }
            ].map((s) => (
              <div key={s.label} style={{ padding: "24px 16px" }}>
                <p style={{ margin: "0 0 6px", fontFamily: "var(--wwh-font-heading)", fontSize: "2.5rem", color: "var(--wwh-accent)", lineHeight: 1 }}>{s.value}</p>
                <p style={{ margin: 0, color: "var(--wwh-muted)", fontFamily: "var(--wwh-font-body)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: "36px auto 0", color: "rgba(255,255,255,0.55)", fontFamily: "var(--wwh-font-body)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "560px" }}>
            Still anonymous. Still paying. Still telling the truth. No face. No bias. No filter.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ width: "min(1000px, calc(100% - 40px))", margin: "0 auto" }}>
          <h2
            style={{
              margin: "0 0 48px",
              fontFamily: "var(--wwh-font-heading)",
              fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
              color: "#fff",
              textTransform: "uppercase",
              lineHeight: 0.95
            }}
          >
            The Philosophy
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "24px"
            }}
            className="philosophy-grid"
          >
            {PHILOSOPHY.map((item) => (
              <div
                key={item.heading}
                style={{
                  padding: "28px 32px",
                  background: "var(--wwh-card)",
                  border: "1px solid var(--wwh-border)",
                  borderRadius: "16px"
                }}
              >
                <div style={{ marginBottom: "16px", fontSize: "2rem" }}>{item.icon}</div>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontFamily: "var(--wwh-font-heading)",
                    fontSize: "1.5rem",
                    color: "var(--wwh-text)",
                    textTransform: "uppercase"
                  }}
                >
                  {item.heading}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "var(--wwh-font-body)",
                    fontSize: "0.95rem",
                    lineHeight: 1.75
                  }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
          .philosophy-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
