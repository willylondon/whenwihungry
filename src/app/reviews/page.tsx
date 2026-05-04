import type { Metadata } from "next";
import Link from "next/link";
import {
  getFilteredReviewPosts,
  getReviewCategories,
  getReviewCategorySlug
} from "@/lib/places";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { ReviewCard } from "@/components/ui/review-card";

export const metadata: Metadata = {
  title: "Reviews | WhenWiHungry",
  description:
    "Honest Jamaican food reviews — no stars, just verdicts. Read what the critic really thinks before you spend your money."
};

export default function ReviewsPage() {
  const posts = getFilteredReviewPosts();
  const categories = getReviewCategories();

  return (
    <div style={{ background: "var(--wwh-bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          padding: "72px 0 56px",
          background: "var(--wwh-surface)",
          borderBottom: "1px solid var(--wwh-border)"
        }}
      >
        <div style={{ width: "min(1200px, calc(100% - 40px))", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "40px",
              alignItems: "center"
            }}
            className="reviews-header-grid"
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  marginBottom: "16px",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "var(--wwh-accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em"
                }}
              >
                All Reviews
              </span>
              <h1
                style={{
                  margin: "0 0 16px",
                  fontFamily: "var(--wwh-font-heading)",
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  color: "#fff",
                  lineHeight: 0.92,
                  textTransform: "uppercase"
                }}
              >
                REVIEWS WITH
                <br />
                <span style={{ color: "var(--wwh-accent)" }}>A POINT OF VIEW.</span>
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "var(--wwh-muted)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "1rem",
                  lineHeight: 1.7
                }}
              >
                No stars. No sugarcoating. Just the honest verdict on every plate.
              </p>
            </div>

            {/* Trust card */}
            <div
              style={{
                padding: "24px 28px",
                background: "rgba(255,90,31,0.06)",
                border: "1px solid rgba(255,90,31,0.2)",
                borderRadius: "16px",
                maxWidth: "280px"
              }}
              className="trust-card"
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontFamily: "var(--wwh-font-heading)",
                  fontSize: "1.1rem",
                  color: "var(--wwh-accent)",
                  textTransform: "uppercase"
                }}
              >
                Why Trust WWH?
              </p>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "0.88rem",
                  lineHeight: 1.65
                }}
              >
                Anonymous critic. Own bill. No fake stars. Each review has a clear verdict and the full honest context you need.
              </p>
            </div>
          </div>

          {/* Category filter */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "36px",
              flexWrap: "wrap"
            }}
          >
            <Link
              href="/reviews"
              style={{
                padding: "8px 18px",
                background: "var(--wwh-accent)",
                color: "#fff",
                fontFamily: "var(--wwh-font-body)",
                fontWeight: 600,
                fontSize: "0.85rem",
                borderRadius: "999px",
                textDecoration: "none"
              }}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/reviews/category/${getReviewCategorySlug(category)}`}
                style={{
                  padding: "8px 18px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--wwh-border)",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  borderRadius: "999px",
                  textDecoration: "none",
                  transition: "background 160ms ease, color 160ms ease"
                }}
                className="cat-filter-link"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section style={{ padding: "64px 0" }}>
        <div style={{ width: "min(1200px, calc(100% - 40px))", margin: "0 auto" }}>
          {posts.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px"
              }}
              className="reviews-grid"
            >
              {posts.map((post) => (
                <ReviewCard key={post.slug} post={post} variant="vertical" />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--wwh-muted)",
                fontFamily: "var(--wwh-font-body)"
              }}
            >
              <p style={{ fontSize: "3rem", margin: "0 0 16px" }}>🍽</p>
              <p>No reviews in this category yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .cat-filter-link:hover {
          background: rgba(255,255,255,0.1) !important;
          color: #fff !important;
        }
        @media (max-width: 900px) {
          .reviews-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .reviews-header-grid { grid-template-columns: 1fr !important; }
          .trust-card { max-width: 100% !important; }
        }
        @media (max-width: 540px) {
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
