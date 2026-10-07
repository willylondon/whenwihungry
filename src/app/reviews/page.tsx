import type { Metadata } from "next";
import { connection } from "next/server";
import { ReviewCard, ReviewFeature } from "@/components/reviews/review-feature";
import { PlaceListCard } from "@/components/browse/place-list-card";
import { TIKTOK_PROFILE_URL, writtenReviews } from "@/data/reviews";
import { CatalogUnavailableError, getAllApprovedPlaces, type PlaceV2 } from "@/lib/community";
import { isReviewed } from "@/lib/place-status";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/reviews" },
  title: "Jamaican Food Reviews",
  description:
    "Every WhenWiHungry review in one place: written critic reviews with photos and scores, plus our TikTok food verdicts. Hosted meals are always disclosed.",
  openGraph: {
    url: siteUrl("/reviews"),
    title: "Jamaican Food Reviews | WhenWiHungry",
    description:
      "Written critic reviews with photos and scores, plus our TikTok food verdicts. Hosted meals are always disclosed.",
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

export default async function ReviewsPage() {
  let reviewedSpots: PlaceV2[] = [];
  try {
    reviewedSpots = (await getAllApprovedPlaces()).filter(isReviewed);
  } catch (error) {
    if (!(error instanceof CatalogUnavailableError)) throw error;
    // Render the written reviews without the directory, and never cache the outage.
    await connection();
  }
  const [latest, ...earlier] = writtenReviews;

  return (
    <div className="reviews-hub">
      <header className="reviews-hub-header container">
        <h1>Real visits. Honest verdicts.</h1>
        <p>
          Every written review is based on an actual visit, with photos from our table. Invitations, discounts and
          complimentary meals are disclosed at the top of the review, never hidden.
        </p>
      </header>

      {latest && <ReviewFeature review={latest} kicker="Latest review" />}

      {earlier.length > 0 && (
        <section className="section container" aria-labelledby="earlier-reviews-heading">
          <div className="section-heading"><div>
            <h2 id="earlier-reviews-heading">More written reviews</h2>
          </div></div>
          <div className="reviews-hub-grid">{earlier.map(review => <ReviewCard key={review.slug} review={review} />)}</div>
        </section>
      )}

      {reviewedSpots.length > 0 && (
        <section className="section container" aria-labelledby="reviewed-spots-heading">
          <div className="section-heading"><div>
            <h2 id="reviewed-spots-heading">Reviewed food spots</h2>
            <p>Directory listings with a critic verdict or a TikTok review attached.</p>
          </div></div>
          <div className="location-results">{reviewedSpots.map(place => <PlaceListCard key={place.slug} place={place} />)}</div>
        </section>
      )}

      <section className="section container" aria-labelledby="tiktok-heading">
        <div className="card reviews-hub-tiktok">
          <div>
            <h2 id="tiktok-heading">Watch the video verdicts</h2>
            <p>Most of our reviews start as short videos. Catch the latest ones on TikTok before they get the full write-up here.</p>
          </div>
          <a className="btn btn-primary" href={TIKTOK_PROFILE_URL} target="_blank" rel="noopener noreferrer">
            Watch on TikTok <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
