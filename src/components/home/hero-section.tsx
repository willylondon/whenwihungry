import Link from "next/link";

export function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0b0b0b"
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          opacity: 0.35
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(110deg, rgba(11,11,11,0.97) 0%, rgba(11,11,11,0.8) 45%, rgba(11,11,11,0.3) 75%, rgba(11,11,11,0.05) 100%)"
        }}
      />

      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,90,31,0.12) 0%, transparent 70%)",
          pointerEvents: "none"
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(1200px, calc(100% - 40px))",
          margin: "0 auto",
          padding: "80px 0"
        }}
      >
        <div style={{ maxWidth: "820px" }}>
          {/* Eyebrow */}
          <span
            style={{
              display: "inline-block",
              marginBottom: "20px",
              padding: "6px 14px",
              background: "rgba(255,90,31,0.12)",
              border: "1px solid rgba(255,90,31,0.3)",
              borderRadius: "999px",
              color: "var(--wwh-accent)",
              fontFamily: "var(--wwh-font-body)",
              fontWeight: 700,
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em"
            }}
          >
            🇯🇲 Jamaica's Boldest Food Critic
          </span>

          {/* Headline */}
          <h1
            style={{
              margin: "0 0 28px",
              fontFamily: "var(--wwh-font-heading)",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              color: "#fff",
              lineHeight: 0.92,
              letterSpacing: "0.01em",
              textTransform: "uppercase"
            }}
          >
            IF THE FOOD BAD…{" "}
            <span style={{ color: "var(--wwh-accent)", display: "block" }}>
              ME A GO TELL
            </span>
            YOU STRAIGHT.
          </h1>

          {/* Subtext */}
          <p
            style={{
              margin: "0 0 40px",
              color: "rgba(255,255,255,0.65)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              lineHeight: 1.7,
              maxWidth: "580px"
            }}
          >
            No fake five stars. No sponsored plates. Just honest, video-first food reviews from someone who eats everywhere and tells you everything.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link
              href="/watch"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 32px",
                background: "var(--wwh-accent)",
                color: "#fff",
                fontFamily: "var(--wwh-font-body)",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "transform 160ms ease, box-shadow 160ms ease"
              }}
              className="hero-cta-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              See the Truth
            </Link>
            <Link
              href="/reviews"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "16px 32px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontFamily: "var(--wwh-font-body)",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: "8px",
                textDecoration: "none",
                backdropFilter: "blur(8px)",
                transition: "background 160ms ease, border-color 160ms ease"
              }}
              className="hero-cta-secondary"
            >
              See if it worth it
            </Link>
          </div>

          {/* Quick stats */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "64px",
              paddingTop: "32px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              flexWrap: "wrap"
            }}
          >
            {[
              { value: "3K+", label: "Followers" },
              { value: "100K+", label: "Video Views" },
              { value: "50+", label: "Places Reviewed" }
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--wwh-font-heading)",
                    fontSize: "2.2rem",
                    color: "var(--wwh-accent)",
                    lineHeight: 1
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "rgba(255,255,255,0.4)",
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
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          color: "rgba(255,255,255,0.3)"
        }}
      >
        <span style={{ fontSize: "0.72rem", fontFamily: "var(--wwh-font-body)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll</span>
        <div
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)"
          }}
        />
      </div>

      <style>{`
        .hero-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(255,90,31,0.4);
        }
        .hero-cta-secondary:hover {
          background: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.3) !important;
        }
      `}</style>
    </section>
  );
}
