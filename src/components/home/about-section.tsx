import Link from "next/link";

export function AboutSection() {
  return (
    <section
      style={{
        background: "var(--wwh-bg)",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 80px)",
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center"
          }}
          className="about-grid-section"
        >
          {/* Avatar — faceless/mysterious */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                aspectRatio: "1/1",
                maxWidth: "460px"
              }}
            >
              <img
                src="/critic-avatar.png"
                alt="The Anonymous Critic"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Red rim overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(255,90,31,0.15) 0%, transparent 50%)",
                  borderRadius: "20px"
                }}
              />
              {/* Accent border */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "2px solid rgba(255,90,31,0.35)",
                  borderRadius: "20px",
                  pointerEvents: "none"
                }}
              />

              {/* "Anonymous" label */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "8px 20px",
                  background: "rgba(0,0,0,0.7)",
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
                    fontSize: "0.82rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em"
                  }}
                >
                  ??? · The Critic
                </span>
              </div>
            </div>

            {/* Floating stat card */}
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                right: "-24px",
                background: "var(--wwh-card)",
                border: "1px solid var(--wwh-border)",
                borderRadius: "16px",
                padding: "20px 28px",
                display: "grid",
                gap: "16px"
              }}
              className="floating-stats"
            >
              {[
                { value: "3K+", label: "Followers" },
                { value: "100K+", label: "Views" },
                { value: "10+", label: "Viral Reviews" }
              ].map((stat) => (
                <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontFamily: "var(--wwh-font-heading)",
                      fontSize: "1.6rem",
                      color: "var(--wwh-accent)",
                      lineHeight: 1
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      color: "var(--wwh-muted)",
                      fontFamily: "var(--wwh-font-body)",
                      fontSize: "0.82rem",
                      fontWeight: 600
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Text */}
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
              Meet the Critic
            </span>

            <h2
              style={{
                margin: "0 0 28px",
                fontFamily: "var(--wwh-font-heading)",
                fontSize: "clamp(2.8rem, 4.5vw, 4rem)",
                color: "var(--wwh-text)",
                lineHeight: 0.95,
                textTransform: "uppercase"
              }}
            >
              YOU WON'T SEE
              <br />
              THE{" "}
              <span style={{ color: "var(--wwh-accent)" }}>FACE.</span>
              <br />
              YOU'LL TASTE THE
              <br />
              <span style={{ color: "var(--wwh-accent2)" }}>TRUTH.</span>
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingLeft: "20px",
                borderLeft: "2px solid var(--wwh-accent)"
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "1.05rem",
                  lineHeight: 1.75
                }}
              >
                Anonymous by design. No PR agencies can find me. No restaurant can recognise me walking in. No face means no bias — just the honest experience everyone else gets.
              </p>
              <p
                style={{
                  margin: 0,
                  color: "var(--wwh-muted)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "0.95rem",
                  lineHeight: 1.75
                }}
              >
                The food tells the story. The verdict speaks for itself. And the face? That stays in the shadows — right where it belongs.
              </p>
            </div>

            <div
              style={{
                marginTop: "28px",
                padding: "16px 20px",
                background: "rgba(255,90,31,0.06)",
                border: "1px solid rgba(255,90,31,0.2)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <span style={{ fontSize: "1.4rem" }}>🎭</span>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "0.88rem",
                  lineHeight: 1.5,
                  fontStyle: "italic"
                }}
              >
                Identity hidden. Reviews unfiltered. That's the deal.
              </p>
            </div>

            <div style={{ marginTop: "28px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="https://tiktok.com/@whenwihungry"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--wwh-border)",
                  color: "#fff",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "background 160ms ease"
                }}
                className="tiktok-follow-btn"
              >
                Follow on TikTok →
              </a>
              <Link
                href="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  borderRadius: "8px",
                  textDecoration: "none"
                }}
              >
                The Critic
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tiktok-follow-btn:hover {
          background: rgba(255,255,255,0.1) !important;
        }
        @media (max-width: 768px) {
          .about-grid-section {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .floating-stats {
            right: 0 !important;
            bottom: -60px !important;
          }
        }
      `}</style>
    </section>
  );
}
