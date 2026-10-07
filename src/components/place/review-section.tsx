"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Review = { id: string; rating: number; comment: string; created_at?: string };
type ReviewSectionProps = {
  restaurantId: string;
  returnPath: string;
  reviews: Review[];
  isSignedIn: boolean;
  userReview?: { id: string } | null;
  reviewsUnavailable?: boolean;
  submissionUnavailable?: boolean;
};

export function ReviewSection({ returnPath, restaurantId, reviews, isSignedIn, userReview, reviewsUnavailable = false, submissionUnavailable = false }: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const inFlight = useRef(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isSignedIn || inFlight.current || submitted || submissionUnavailable || !rating) return;
    inFlight.current = true;
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, rating, comment })
      });
      if (response.ok) {
        setMessage("Review submitted for moderation. Respect!");
        setSubmitted(true);
        router.refresh();
      } else {
        const body = await response.json().catch(() => ({}));
        setMessage(typeof body.message === "string" ? body.message : "Your review wasn’t submitted. Please try again.");
      }
    } catch {
      setMessage("Your review wasn’t submitted. Check your connection and try again.");
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
  };

  return <div className="place-sections">
    <section className="place-panel" aria-labelledby="community-heading">
      <h2 id="community-heading">Community Notes</h2>
      {reviewsUnavailable ? <p role="status">Community reviews are temporarily unavailable.</p> : reviews.length === 0 ? <p>No approved reviews yet. Be the first to tell the truth.</p> :
        <div className="community-reviews">{reviews.map(review => <article key={review.id} className="community-review">
          <p className="rating-provenance"><span aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(Math.max(0, Math.min(5, Math.round(review.rating))))}</span> · Approved community review</p>
          <p>{review.comment}</p>
        </article>)}</div>}
    </section>
    <section className="place-panel" aria-labelledby="leave-review-heading">
      <h2 id="leave-review-heading">Leave your truth</h2>
      {!isSignedIn ? <p>Please <Link className="text-link" href={`/sign-in?next=${encodeURIComponent(returnPath)}`}>sign in</Link> to leave a review.</p> : submissionUnavailable ? <p role="status">We couldn’t check your existing review. Please reload before submitting.</p> : userReview || submitted ? <p>You’ve already submitted a review for this spot.</p> :
        <form onSubmit={handleSubmit} className="review-form" aria-busy={isSubmitting}>
          <fieldset disabled={isSubmitting} className="review-rating">
            <legend>Rating (required)</legend>
            <div className="rating-options">{[1, 2, 3, 4, 5].map(value => <label key={value}>
              <input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} required />
              <span>{value}<span className="sr-only"> out of 5 stars</span></span>
            </label>)}</div>
          </fieldset>
          <label htmlFor="review-comment">Comment (required)</label>
          <textarea id="review-comment" value={comment} onChange={event => setComment(event.target.value)} placeholder="Be honest. Was it worth it?" maxLength={500} required disabled={isSubmitting} />
          <button className="btn btn-primary" type="submit" disabled={isSubmitting || !rating}>{isSubmitting ? "Submitting…" : "Submit review"}</button>
        </form>}
      <p role="status" aria-live="polite" className="submission-status">{message}</p>
    </section>
  </div>;
}
