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
            No fake five stars. No sponsored plates. Just honest reviews from someone who eats everywhere and tells you everything.
          </p>

          {/* Search bar */}
          <div style={{ maxWidth: "600px", position: "relative" }}>
            <form
              action="/browse"
              style={{
                display: "flex",
                gap: "12px",
                padding: "8px",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px",
                transition: "border-color 200ms ease, box-shadow 200ms ease"
              }}
              className="hero-search-form"
            >
              <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ position: "absolute", left: "16px" }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  name="query"
                  placeholder="Find the best oxtail..."
                  style={{
                    width: "100%",
                    padding: "16px 16px 16px 52px",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontFamily: "var(--wwh-font-body)",
                    fontSize: "1.1rem",
                    outline: "none"
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: "0 28px",
                  background: "var(--wwh-accent)",
                  color: "#fff",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 160ms ease"
                }}
                className="hero-search-btn"
              >
                Search
              </button>
            </form>
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
              { value: "50+", label: "Places Reviewed" },
              { value: "100%", label: "Unfiltered" }
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
        .hero-search-form:focus-within {
          border-color: var(--wwh-accent) !important;
          box-shadow: 0 0 0 4px rgba(255,90,31,0.15);
        }
        .hero-search-btn:hover {
          transform: scale(1.04);
          background: #ff6a35 !important;
        }
      `}</style>
    </section>
  );
}
