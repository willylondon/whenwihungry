import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getFilteredReviewPosts,
  getReviewCategories,
  getReviewCategoryBySlug,
  getReviewCategorySlug
} from "@/lib/places";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  return getReviewCategories().map((category) => ({
    category: getReviewCategorySlug(category)
  }));
}

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getReviewCategoryBySlug(categorySlug);

  if (!category) {
    return {};
  }

  return {
    title: `${category} Restaurant Reviews | WhenWiHungry`,
    description: `Read WhenWiHungry ${category.toLowerCase()} reviews with honest verdicts, best orders, price vibes, and Jamaican restaurant recommendations.`
  };
}

export default async function ReviewCategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const activeCategory = getReviewCategoryBySlug(categorySlug);

  if (!activeCategory) {
    notFound();
  }

  const posts = getFilteredReviewPosts(activeCategory);
  const categories = getReviewCategories();

  return (
    <section className="section review-index">
      <div className="container">
        <div className="review-index-hero">
          <div>
            <span className="eyebrow">{activeCategory}</span>
            <h1>{activeCategory} reviews worth sending to the group chat.</h1>
            <p>
              Every review has its own page, a clear WWH verdict, and the useful
              details that help you decide before you go.
            </p>
          </div>
          <aside className="critic-card">
            <span>WWH filter</span>
            <strong>{posts.length} {activeCategory.toLowerCase()} review{posts.length === 1 ? "" : "s"}</strong>
            <p>
              Browse by craving, then open the full review for the best order,
              price vibe, and honest notes.
            </p>
          </aside>
        </div>
        <div className="review-filter-row" aria-label="Review categories">
          <Link href="/reviews">All reviews</Link>
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
