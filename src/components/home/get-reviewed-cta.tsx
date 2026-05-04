import Link from "next/link";

export function GetReviewedCta() {
  return (
    <section
      style={{
        background: "var(--wwh-bg)",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,77,45,0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(900px, calc(100% - 40px))",
          margin: "0 auto",
          textAlign: "center"
        }}
      >
        <span
          style={{
            display: "inline-block",
            marginBottom: "20px",
            padding: "6px 14px",
            background: "rgba(255,77,45,0.12)",
            border: "1px solid rgba(255,77,45,0.3)",
            borderRadius: "999px",
            color: "var(--wwh-accent)",
            fontFamily: "var(--wwh-font-body)",
            fontWeight: 700,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em"
          }}
        >
          For Restaurants
        </span>

        <h2
          style={{
            margin: "0 0 20px",
            fontFamily: "var(--wwh-font-heading)",
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            color: "#fff",
            lineHeight: 0.93,
            textTransform: "uppercase"
          }}
        >
          THINK YOUR FOOD
          <br />
          <span style={{ color: "var(--wwh-accent)" }}>CAN HANDLE IT?</span>
        </h2>

        <p
          style={{
            margin: "0 auto 40px",
            color: "var(--wwh-muted)",
            fontFamily: "var(--wwh-font-body)",
            fontSize: "1.05rem",
            lineHeight: 1.75,
            maxWidth: "600px"
          }}
        >
          If you're confident in what you're serving, request a review. We come unannounced, pay our own bill, and tell the truth — all of it.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link
            href="/get-reviewed"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "16px 36px",
              background: "var(--wwh-accent)",
              color: "#fff",
              fontFamily: "var(--wwh-font-body)",
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "transform 160ms ease, box-shadow 160ms ease"
            }}
            className="cta-main-btn"
          >
            Request a Review
          </Link>
          <Link
            href="/about"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "16px 36px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--wwh-font-body)",
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "background 160ms ease"
            }}
            className="cta-secondary-btn"
          >
            Learn More
          </Link>
        </div>
      </div>

      <style>{`
        .cta-main-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(255,77,45,0.4);
        }
        .cta-secondary-btn:hover {
          background: rgba(255,255,255,0.09) !important;
        }
      `}</style>
    </section>
  );
}
