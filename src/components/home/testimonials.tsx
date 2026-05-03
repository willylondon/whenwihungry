import Image from "next/image";

type TestimonialsProps = {
  testimonials: Array<{
    name: string;
    role: string;
    quote: string;
    avatar?: string;
  }>;
};

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="section alt">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Social proof</span>
            <h2>Built for the moment when someone asks where they should eat.</h2>
          </div>
        </div>
        <div className="story-grid">
          {testimonials.map((item) => (
            <blockquote className="card quote-card" key={item.name}>
              <div className="quote-stars" style={{ display: "flex", gap: "2px", marginBottom: "1rem" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: "var(--primary)", fontSize: "1.2rem" }}>★</span>
                ))}
              </div>
              <p>&ldquo;{item.quote}&rdquo;</p>
              <footer style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "1.5rem" }}>
                {item.avatar && (
                  <Image
                    alt={item.name}
                    height={48}
                    src={item.avatar}
                    style={{ borderRadius: "50%", objectFit: "cover", width: "48px", height: "48px" }}
                    width={48}
                  />
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <strong style={{ margin: 0, fontSize: "1rem" }}>{item.name}</strong>
                  <span style={{ margin: 0, opacity: 0.8, fontSize: "0.875rem" }}>{item.role}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
