import type { Review } from "@/data/places";

type ReviewListProps = {
  reviews: Review[];
};

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <section className="card">
      <h2>Latest reviews</h2>
      <div className="review-stack">
        {reviews.map((review) => (
          <article className="review-card" key={`${review.author}-${review.date}`}>
            <div className="review-head">
              <strong>{review.author}</strong>
              <span>{review.rating.toFixed(1)} stars</span>
            </div>
            <p>{review.comment}</p>
            <small>{review.date}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
