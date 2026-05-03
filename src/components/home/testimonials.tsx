type TestimonialsProps = {
  testimonials: Array<{
    name: string;
    role: string;
    quote: string;
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
              <p>&ldquo;{item.quote}&rdquo;</p>
              <footer>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
