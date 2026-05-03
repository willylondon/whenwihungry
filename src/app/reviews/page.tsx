import type { Metadata } from "next";
import Link from "next/link";

import {
  getFilteredReviewPosts,
  getReviewCategories,
  getReviewCategorySlug
} from "@/lib/places";

export const metadata: Metadata = {
  title: "Jamaican Restaurant Reviews | WhenWiHungry",
  description:
    "Read WhenWiHungry restaurant reviews for Jamaican cook shops, jerk stops, seafood spots, patties, lunch runs, and date-night picks."
};

export default function ReviewsPage() {
  const activeCategory = undefined;
  const posts = getFilteredReviewPosts();
  const categories = getReviewCategories();

  return (
    <section className="section review-index">
      <div className="container">
        <div className="review-index-hero">
          <div>
            <span className="eyebrow">Reviews</span>
            <h1>Restaurant reviews with a point of view.</h1>
            <p>
              Blog-style reviews for Jamaican restaurants, cook shops, jerk
              stops, seafood runs, patties, and plates I would actually tell you
              to try.
            </p>
          </div>
          <aside className="critic-card">
            <span>Why trust WWH?</span>
            <strong>Food reviewer first. No fake five stars.</strong>
            <p>
              Each post has a clear verdict, best order, price vibe, and the
              kind of context you need before you spend your money.
            </p>
          </aside>
        </div>
        <div className="review-filter-row" aria-label="Review categories">
          <Link className={!activeCategory ? "active" : ""} href="/reviews">
            All reviews
          </Link>
          {categories.map((category) => (
            <Link
              className={activeCategory === category ? "active" : ""}
              href={`/reviews/category/${getReviewCategorySlug(category)}`}
              key={category}
            >
              {category}
            </Link>
          ))}
        </div>
        <div className="story-grid">
          {posts.map((post) => (
            <Link className="card story-card" href={`/reviews/${post.slug}`} key={post.slug}>
              <div className="story-card-image">
                <img alt="" loading="lazy" src={post.image} />
                <span className="badge">{post.category}</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.dek}</p>
              <dl className="review-facts">
                <div>
                  <dt>Best order</dt>
                  <dd>{post.bestOrder}</dd>
                </div>
                <div>
                  <dt>Good for</dt>
                  <dd>{post.goodFor}</dd>
                </div>
              </dl>
              <div className="card-meta">
                <span>{post.area}</span>
                <span>{post.priceVibe}</span>
                <span>{post.readTime}</span>
                <span>{post.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
