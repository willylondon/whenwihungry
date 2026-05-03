import Link from "next/link";

import { submitPlaceFeedbackAction } from "@/app/places/[slug]/actions";
import type { CommunityComment, CommunityRestaurant } from "@/lib/community";

type CommunityFeedbackProps = {
  comments: CommunityComment[];
  community: CommunityRestaurant | null;
  isSignedIn: boolean;
  slug: string;
};

export function CommunityFeedback({
  comments,
  community,
  isSignedIn,
  slug
}: CommunityFeedbackProps) {
  if (!community) {
    return null;
  }

  return (
    <section className="card community-card">
      <div className="section-heading compact">
        <div>
          <span className="eyebrow">Community score</span>
          <h2>Rate it if you have been.</h2>
        </div>
        <strong>
          {Number(community.avg_rating).toFixed(1)} / 5 from {community.rating_count} ratings
        </strong>
      </div>

      {isSignedIn ? (
        <form action={submitPlaceFeedbackAction} className="feedback-form">
          <input name="slug" type="hidden" value={slug} />
          <input name="restaurantId" type="hidden" value={community.id} />
          <label>
            Your rating
            <select name="rating" required>
              <option value="">Choose stars</option>
              <option value="5">5 stars - excellent</option>
              <option value="4">4 stars - good</option>
              <option value="3">3 stars - okay</option>
              <option value="2">2 stars - weak</option>
              <option value="1">1 star - would not return</option>
            </select>
          </label>
          <label>
            Comment
            <textarea
              maxLength={800}
              name="comment"
              placeholder="What should people know before they go?"
              rows={4}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Post rating
          </button>
        </form>
      ) : (
        <div className="signin-nudge">
          <p>Sign in to leave a rating or comment.</p>
          <Link className="btn btn-outline" href={`/sign-in?next=/places/${slug}`}>
            Sign in
          </Link>
        </div>
      )}

      <div className="review-stack">
        {comments.length === 0 ? (
          <p>No community comments yet. Be the first to add useful context.</p>
        ) : (
          comments.map((comment) => (
            <article className="review-card" key={comment.id}>
              <div className="review-head">
                <strong>WWH reader</strong>
                <span>{new Date(comment.created_at).toLocaleDateString("en-JM")}</span>
              </div>
              <p>{comment.body}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
