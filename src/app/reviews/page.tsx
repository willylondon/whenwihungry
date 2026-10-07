import { FirstReviewFeature } from "@/components/reviews/first-review-feature";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import { paginate, normalizeBrowseParams } from "@/lib/browse-pagination";
import { Pagination } from "@/components/browse/pagination";
import { PlaceListCard } from "@/components/browse/place-list-card";
import { getAllApprovedPlaces } from "@/lib/community";
import { isReviewed } from "@/lib/place-status";

const baseMetadata: Metadata = {
  alternates: { canonical: "/reviews" },
  title: "Viral Jamaican Food Reviews",
  description:
    "Watch WhenWiHungry's viral Jamaican food reviews, anonymous verdicts, and honest food reactions.",
  openGraph: {
    url: siteUrl("/reviews"),
    title: "Viral Jamaican Food Reviews | WhenWiHungry",
    description:
      "Watch WhenWiHungry's viral Jamaican food reviews, anonymous verdicts, and honest food reactions.",
    images: [
      {
        url: siteUrl("/og/whenwihungry-og.png"),
        width: 1200,
        height: 630,
        alt: "WhenWiHungry — Jamaica's boldest food critic",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: [siteUrl("/og/whenwihungry-og.png")]
  }
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params = normalizeBrowseParams(await searchParams);
  return { ...baseMetadata, ...(params.page ? { robots: { index: false, follow: true } } : {}) };
}

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = normalizeBrowseParams(await searchParams);
  const allPlaces = await getAllApprovedPlaces();
  const reviewed = allPlaces.filter(isReviewed);
  const pagination = paginate(reviewed, params.page);

  return (
    <div style={{ background: "var(--wwh-bg)", minHeight: "100svh" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "100px 0 64px",
          textAlign: "center",
          borderBottom: "1px solid var(--wwh-border)"
        }}
      >
        <div style={{ width: "min(800px, calc(100% - 40px))", margin: "0 auto" }}>
          <span style={{ display: "inline-block", marginBottom: "16px", padding: "6px 16px", background: "rgba(255,90,31,0.10)", border: "1px solid rgba(255,90,31,0.25)", borderRadius: "999px", color: "var(--wwh-accent)", fontFamily: "var(--wwh-font-body)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.10em" }}>
            Viral Reviews
          </span>
          <h1 style={{ margin: "0 0 20px", fontFamily: "var(--wwh-font-heading)", fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "#fff", lineHeight: 0.94, textTransform: "uppercase" }}>
            Real Food Reactions.<span style={{ color: "var(--wwh-accent)", display: "block" }}>Viral Jamaican Reviews.</span>No Fake Ratings.
          </h1>
          <p style={{ margin: "0 auto 0", color: "rgba(255,255,255,0.55)", fontFamily: "var(--wwh-font-body)", fontSize: "clamp(1rem, 1.5vw, 1.15rem)", lineHeight: 1.7, maxWidth: "600px" }}>
            Browse the WhenWiHungry spots that have already been reviewed on TikTok or given a critic verdict.
          </p>
        </div>
      </section>

      <FirstReviewFeature />

      {/* Results */}
      <section style={{ padding: "64px 0 96px" }}>
        <div style={{ width: "min(1200px, calc(100% - 40px))", margin: "0 auto" }}>
          {reviewed.length > 0 && (
            <>
              <p className="result-summary">Showing {pagination.offset + 1}–{pagination.offset + pagination.items.length} of {reviewed.length} reviewed spots</p>
              <div className="location-results">{pagination.items.map(place => <PlaceListCard key={place.slug} place={place} />)}</div>
              <Pagination path="/reviews" params={params} page={pagination.page} totalPages={pagination.totalPages} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
