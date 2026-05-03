export function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero-shell">
        <div className="hero-copy">
          <span className="eyebrow">When Wi Hungry reviews</span>
          <h1>
            Restaurants I&apos;d actually tell you to <span>try.</span>
          </h1>
          <p>
            Honest Jamaican food reviews for the cook shops, jerk stops,
            seafood runs, patty counters, and date-night tables worth your
            appetite.
          </p>
          <div className="hero-ctas">
            <a className="editorial-link primary" href="/reviews">
              Read the reviews
            </a>
            <a className="editorial-link" href="/browse">
              Browse restaurants
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
