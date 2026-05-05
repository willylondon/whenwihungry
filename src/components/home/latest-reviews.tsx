import Link from "next/link";
import type { PlaceV2 } from "@/lib/community";
import { SectionHeader } from "@/components/ui/section-header";
import { ReviewCard } from "@/components/ui/review-card";

type LatestReviewsProps = {
  places: PlaceV2[];
  variant?: "reviews" | "listings";
};

export function LatestReviews({ places, variant = "reviews" }: LatestReviewsProps) {
  const limited = places.slice(0, 6);
  if (limited.length === 0) return null;

  const isReviews = variant === "reviews";

  return (
    <section style={{ background: "var(--wwh-bg)", padding: "96px 0" }}>
      <div style={{ width: "min(1200px, calc(100% - 40px))", margin: "0 auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "8px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <SectionHeader
            eyebrow={isReviews ? "Latest" : "Directory"}
            heading={isReviews ? "Fresh Off the Plate" : "Recently Added"}
            subtext={
              isReviews
                ? "The most recent critic reviews. Honest. Unfiltered."
                : "Directory listings awaiting critic verdicts."
            }
          />
          <Link
            href="/browse"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--wwh-accent)",
              fontFamily: "var(--wwh-font-body)",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
              paddingBottom: "48px",
              whiteSpace: "nowrap"
            }}
            className="see-all-reviews-link"
          >
            {isReviews ? "All reviews →" : "Browse all →"}
          </Link>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}
          className="latest-grid"
        >
          {limited.map((place) => (
            <ReviewCard key={place.slug} place={place} variant="vertical" />
          ))}
        </div>
      </div>

      <style>{`
        .see-all-reviews-link:hover { opacity: 0.75; }
        @media (max-width: 900px) {
          .latest-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .latest-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
