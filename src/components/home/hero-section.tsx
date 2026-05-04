export function HeroSection() {
  return (
    <section className="hero" style={{ padding: "88px 0", background: "linear-gradient(135deg, #fffaf2 0%, #fff 100%)" }}>
      <div className="container hero-shell">
        <div className="hero-copy" style={{ maxWidth: "780px" }}>
          <span className="eyebrow" style={{ color: "var(--hot)", textTransform: "uppercase", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.15em" }}>Unfiltered & Unapologetic</span>
          <h1 style={{ fontSize: "clamp(3.2rem, 5.5vw, 4.8rem)", lineHeight: "1.05", fontWeight: 900, marginBottom: "24px", fontFamily: "var(--font-heading)" }}>
            The food is real. The reviews are <span>unfiltered.</span>
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--muted)", lineHeight: "1.65", marginBottom: "36px" }}>
            No paid hype. No PR fluff. Just the raw truth about the cook shops, jerk stops, seafood runs, and date-night spots that actually earn a recommendation.
          </p>
          <div className="hero-ctas" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a className="btn btn-primary" href="/browse" style={{ padding: "16px 32px", fontSize: "1.05rem", borderRadius: "99px", background: "var(--primary)", color: "#fff", fontWeight: 700, boxShadow: "0 10px 24px rgba(15, 76, 92, 0.16)" }}>
              Read the Verdicts
            </a>
            <a className="btn btn-outline" href="https://www.tiktok.com/@whenwihungry" target="_blank" rel="noopener noreferrer" style={{ padding: "16px 32px", fontSize: "1.05rem", borderRadius: "99px", border: "2px solid rgba(15, 76, 92, 0.14)", color: "var(--primary)", fontWeight: 700 }}>
              Watch on TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
