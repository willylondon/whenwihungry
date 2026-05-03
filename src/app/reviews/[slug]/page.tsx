import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getRelatedReviewPosts,
  getReviewPostBySlug,
  reviewPosts
} from "@/lib/places";

type ReviewPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return reviewPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getReviewPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.seoTitle} | WhenWiHungry`,
    description: post.seoDescription,
    openGraph: {
      title: post.title,
      description: post.seoDescription,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.image }]
    }
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const post = getReviewPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedReviewPosts(post.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Organization",
      name: "WhenWiHungry"
    },
    datePublished: post.publishedAt,
    headline: post.title,
    description: post.seoDescription,
    image: post.image,
    itemReviewed: {
      "@type": "Restaurant",
      name: post.restaurant,
      address: {
        "@type": "PostalAddress",
        addressRegion: post.parish,
        addressCountry: "JM"
      }
    },
    reviewBody: post.dek,
    reviewRating: {
      "@type": "Rating",
      ratingValue: post.rating,
      bestRating: "WWH Approved"
    }
  };

  return (
    <article className="review-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="review-hero" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="container review-hero-inner">
          <span className="eyebrow">{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.dek}</p>
          <div className="review-meta">
            <span>{post.restaurant}</span>
            <span>{post.parish}</span>
            <span>{post.readTime}</span>
            <span>{post.rating}</span>
          </div>
        </div>
      </header>
      <div className="container review-layout">
        <aside className="review-verdict card">
          <span className="eyebrow">Verdict</span>
          <p>{post.verdict}</p>
          <dl className="review-scorecard">
            <div>
              <dt>Best order</dt>
              <dd>{post.bestOrder}</dd>
            </div>
            <div>
              <dt>Price vibe</dt>
              <dd>{post.priceVibe}</dd>
            </div>
            <div>
              <dt>Good for</dt>
              <dd>{post.goodFor}</dd>
            </div>
          </dl>
          <div className="taste-strip">
            {post.highlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </aside>
        <div className="review-body">
          {post.body.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}
          {relatedPosts.length > 0 && (
            <section className="related-reviews">
              <span className="eyebrow">Read next</span>
              <h2>More WWH reviews to keep in your back pocket</h2>
              <div className="related-review-grid">
                {relatedPosts.map((relatedPost) => (
                  <Link href={`/reviews/${relatedPost.slug}`} key={relatedPost.slug}>
                    <span>{relatedPost.category}</span>
                    <strong>{relatedPost.title}</strong>
                    <small>
                      {relatedPost.area} / {relatedPost.rating}
                    </small>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
