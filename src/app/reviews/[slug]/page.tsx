import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getRelatedReviewPosts,
  getReviewPostBySlug,
  reviewPosts
} from "@/lib/places";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { ReviewCard } from "@/components/ui/review-card";

type ReviewPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return reviewPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getReviewPostBySlug(slug);
  if (!post) return {};
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
  if (!post) notFound();

  const related = getRelatedReviewPosts(post.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Organization", name: "WhenWiHungry" },
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
    }
  };

  return (
    <article style={{ background: "var(--wwh-bg)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          minHeight: "60vh",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${post.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(11,11,11,1) 0%, rgba(11,11,11,0.5) 50%, rgba(11,11,11,0.1) 100%)"
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "min(900px, calc(100% - 40px))",
            margin: "0 auto",
            padding: "64px 0 60px"
          }}
        >
          {/* Breadcrumb */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
            <Link
              href="/reviews"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--wwh-font-body)",
                fontSize: "0.82rem",
                textDecoration: "none"
              }}
            >
              Reviews
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.82rem" }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--wwh-font-body)", fontSize: "0.82rem" }}>
              {post.category}
            </span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <VerdictBadge verdict={post.verdict} size="lg" />
          </div>

          <h1
            style={{
              margin: "0 0 20px",
              fontFamily: "var(--wwh-font-heading)",
              fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
              color: "#fff",
              lineHeight: 0.95,
              textTransform: "uppercase"
            }}
          >
            {post.title}
          </h1>

          <blockquote
            style={{
              margin: "0 0 24px",
              padding: "0 0 0 16px",
              borderLeft: "3px solid var(--wwh-accent)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "1.1rem",
              fontStyle: "italic",
              lineHeight: 1.65
            }}
          >
            &ldquo;{post.quote}&rdquo;
          </blockquote>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--wwh-font-body)", fontSize: "0.85rem" }}>
              📍 {post.location}
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--wwh-font-body)", fontSize: "0.85rem" }}>
              📅 {new Date(post.publishedAt).toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--wwh-font-body)", fontSize: "0.85rem" }}>
              ⏱ {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* ── Video embed ── */}
      {post.videoUrl && (
        <section
          id="video"
          style={{
            background: "#000",
            padding: "48px 0",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <div style={{ width: "min(900px, calc(100% - 40px))" }}>
            <p
              style={{
                margin: "0 0 20px",
                fontFamily: "var(--wwh-font-body)",
                fontWeight: 700,
                fontSize: "0.8rem",
                color: "var(--wwh-accent)",
                textTransform: "uppercase",
                letterSpacing: "0.12em"
              }}
            >
              Watch the Review
            </p>
            <div
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                background: "var(--wwh-card)",
                border: "1px solid var(--wwh-border)",
                display: "flex",
                justifyContent: "center",
                padding: "24px"
              }}
            >
              {/* TikTok embed - center the vertical video */}
              <blockquote
                className="tiktok-embed"
                cite={post.videoUrl}
                data-video-id=""
                style={{
                  maxWidth: "325px",
                  width: "100%",
                  minHeight: "575px",
                  margin: 0
                }}
              >
                <a
                  href={post.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "12px",
                    padding: "12px 24px",
                    background: "var(--wwh-accent)",
                    color: "#fff",
                    fontFamily: "var(--wwh-font-body)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    borderRadius: "8px",
                    textDecoration: "none"
                  }}
                >
                  Watch on TikTok →
                </a>
              </blockquote>
              <script async src="https://www.tiktok.com/embed.js" />
            </div>
          </div>
        </section>
      )}

      {/* ── Main content ── */}
      <div
        style={{
          width: "min(900px, calc(100% - 40px))",
          margin: "0 auto",
          padding: "64px 0"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "48px",
            alignItems: "start"
          }}
          className="review-layout-grid"
        >
          {/* ── Left: Content ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {/* What I Ordered */}
            <div>
              <h2
                style={{
                  margin: "0 0 16px",
                  fontFamily: "var(--wwh-font-heading)",
                  fontSize: "1.8rem",
                  color: "var(--wwh-text)",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em"
                }}
              >
                What I Ordered
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "1.05rem",
                  lineHeight: 1.8
                }}
              >
                {post.whatIOrdered}
              </p>
            </div>

            {/* What Surprised Me */}
            <div>
              <h2
                style={{
                  margin: "0 0 16px",
                  fontFamily: "var(--wwh-font-heading)",
                  fontSize: "1.8rem",
                  color: "var(--wwh-text)",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em"
                }}
              >
                What Surprised Me
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "1.05rem",
                  lineHeight: 1.8
                }}
              >
                {post.whatSurprisedMe}
              </p>
            </div>

            {/* The Honest Take */}
            <div
              style={{
                padding: "28px 32px",
                background: "rgba(255,77,45,0.06)",
                border: "1px solid rgba(255,77,45,0.2)",
                borderRadius: "16px"
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px",
                  fontFamily: "var(--wwh-font-heading)",
                  fontSize: "1.8rem",
                  color: "var(--wwh-accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em"
                }}
              >
                The Honest Take
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "1.05rem",
                  lineHeight: 1.8
                }}
              >
                {post.honestTake}
              </p>
            </div>

            {/* Content sections */}
            {post.contentSections.map((section) => (
              <div key={section.heading}>
                <h2
                  style={{
                    margin: "0 0 14px",
                    fontFamily: "var(--wwh-font-heading)",
                    fontSize: "1.6rem",
                    color: "var(--wwh-text)",
                    textTransform: "uppercase"
                  }}
                >
                  {section.heading}
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.65)",
                    fontFamily: "var(--wwh-font-body)",
                    fontSize: "1rem",
                    lineHeight: 1.8
                  }}
                >
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          {/* ── Right: Quick Hits sidebar ── */}
          <aside
            style={{
              position: "sticky",
              top: "88px",
              background: "var(--wwh-card)",
              border: "1px solid var(--wwh-border)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
            className="review-sidebar"
          >
            <h3
              style={{
                margin: 0,
                fontFamily: "var(--wwh-font-heading)",
                fontSize: "1.3rem",
                color: "var(--wwh-text)",
                textTransform: "uppercase"
              }}
            >
              Quick Hits
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Best Item", value: post.bestItem, icon: "✅" },
                { label: "Worst Item", value: post.worstItem, icon: "❌" },
                { label: "Value", value: post.valueRating, icon: "💰" },
                { label: "Wait Time", value: post.waitTime, icon: "⏱" },
                { label: "Price", value: post.priceVibe, icon: "🏷" },
                { label: "Good For", value: post.goodFor, icon: "👥" }
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    paddingBottom: "16px",
                    borderBottom: "1px solid var(--wwh-border)"
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "var(--wwh-accent)",
                      fontFamily: "var(--wwh-font-body)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "4px"
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: "var(--wwh-font-body)",
                      fontSize: "0.9rem",
                      lineHeight: 1.45,
                      fontWeight: 500
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Verdict large */}
            <div style={{ marginTop: "4px" }}>
              <VerdictBadge verdict={post.verdict} size="md" />
            </div>

            {/* Highlights */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {post.highlights.map((h) => (
                <span
                  key={h}
                  style={{
                    padding: "4px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--wwh-border)",
                    borderRadius: "999px",
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "var(--wwh-font-body)",
                    fontSize: "0.78rem"
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
          </aside>
        </div>

        {/* ── Related reviews ── */}
        {related.length > 0 && (
          <section style={{ marginTop: "80px" }}>
            <h2
              style={{
                margin: "0 0 32px",
                fontFamily: "var(--wwh-font-heading)",
                fontSize: "2rem",
                color: "var(--wwh-text)",
                textTransform: "uppercase"
              }}
            >
              More From the Critic
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px"
              }}
              className="related-grid"
            >
              {related.map((r) => (
                <ReviewCard key={r.slug} post={r} variant="vertical" />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .review-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .review-sidebar {
            position: static !important;
          }
          .related-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </article>
  );
}
