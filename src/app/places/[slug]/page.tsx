import { normalizeParish, getParishDisplayName } from "@/lib/location-validation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CatalogUnavailableError, getApprovedCommunityPlaceBySlug, getApprovedPlaceReviews, type ApprovedPlaceReview } from "@/lib/community";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { SocialShare } from "@/components/place/social-share";
import { ReviewSection } from "@/components/place/review-section";
import { getPlaceStatusLabel, isCriticReviewed, getReviewVideoUrl } from "@/lib/place-status";
import { serializeJsonLd } from "@/lib/security/json-ld";
import { siteUrl } from "@/lib/site-url";
import { hasListingPhoto } from "@/lib/image-config";
import { directionsUrl, googleMapsPlaceUrl, telUrl } from "@/lib/maps-links";
import { VERDICT_LABELS, formatReviewDate, getWrittenReviewForPlace } from "@/data/reviews";

type PlacePageProps = { params: Promise<{ slug: string }> };

// Pages are shared by every visitor and built on first request; the review form
// asks for the visitor's own account state in the browser.
export const revalidate = 3600;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getApprovedCommunityPlaceBySlug(slug);
  if (!place) return { title: "Food spot not found", robots: { index: false, follow: true } };
  const description = place.description || `${place.name} — ${place.category || "Food spot"} in ${place.parish}.`;
  const canonical = `/places/${place.slug}`;
  const title = `${place.name}${place.parish ? ` in ${getParishDisplayName(place.parish)}` : ""}`;
  return {
    title, description, alternates: { canonical },
    openGraph: { title: `${title} | WhenWiHungry`, description, url: siteUrl(canonical), siteName: "WhenWiHungry", images: [hasListingPhoto(place.image) ? { url: place.image, alt: place.name } : { url: "/og/whenwihungry-og.png", width: 1200, height: 630, alt: "WhenWiHungry" }], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [hasListingPhoto(place.image) ? place.image : "/og/whenwihungry-og.png"] }
  };
}

function displayDate(value?: string | null) {
  if (!value || Number.isNaN(Date.parse(value))) return null;
  return new Intl.DateTimeFormat("en-JM", { dateStyle: "long", timeZone: /^\d{4}-\d{2}-\d{2}$/.test(value) ? "UTC" : "America/Jamaica" }).format(new Date(value));
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const place = await getApprovedCommunityPlaceBySlug(slug);
  if (!place?.id) notFound();
  let reviews: ApprovedPlaceReview[] = [];
  let reviewsUnavailable = false;
  try { reviews = await getApprovedPlaceReviews(place.id); } catch (error) {
    if (!(error instanceof CatalogUnavailableError)) throw error;
    reviewsUnavailable = true;
    // Don't cache a page that says reviews are unavailable.
    await connection();
  }
  const parish = normalizeParish(place.parish);
  const hasCriticReview = isCriticReviewed(place);
  const written = getWrittenReviewForPlace(place.slug);
  const videoUrl = getReviewVideoUrl(place);
  // Plain listings get no status line; "pending" adds nothing for visitors.
  const where = [place.area && place.area !== place.parish ? place.area : null, place.parish ? getParishDisplayName(place.parish) : null].filter(Boolean).join(", ");
  const statusLabel = written ? "Reviewed by WhenWiHungry" : hasCriticReview || videoUrl ? getPlaceStatusLabel(place) : null;
  const publishedDate = place.published_at || place.reviewed_at;
  const reviewBody = place.honest_take || place.critic_review_body;
  const restaurantSchema = {
    "@context": "https://schema.org", "@type": "Restaurant", name: place.name,
    description: place.description || undefined, url: siteUrl(`/places/${place.slug}`), image: hasListingPhoto(place.image) ? siteUrl(place.image) : undefined,
    servesCuisine: place.category || undefined, priceRange: place.priceRange || undefined,
    address: { "@type": "PostalAddress", streetAddress: place.address || undefined, addressRegion: place.parish || undefined }
  };
  const reviewSchema = hasCriticReview ? {
    "@context": "https://schema.org", "@type": "Review", name: place.headline || place.name,
    reviewBody: reviewBody || undefined, datePublished: publishedDate || undefined,
    author: { "@type": "Organization", name: "WhenWiHungry" },
    itemReviewed: { "@type": "Restaurant", name: place.name, url: siteUrl(`/places/${place.slug}`) },
    ...(typeof place.admin_score === "number" ? { reviewRating: { "@type": "Rating", ratingValue: place.admin_score, bestRating: 100, worstRating: 0 } } : {})
  } : null;

  return <article className="place-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(reviewSchema ? [restaurantSchema, reviewSchema] : restaurantSchema) }} />
    <header className={`place-hero${hasListingPhoto(place.image) ? "" : " no-photo"}`}>
      <div className="place-container place-hero-layout">
        <div>
          <nav aria-label="Breadcrumb"><Link href="/browse">Food spots</Link><span aria-hidden="true"> / </span>{parish && <><Link href={`/restaurants/${parish.replace(/ /g, "-")}`}>{getParishDisplayName(parish)}</Link><span aria-hidden="true"> / </span></>}<span>{place.name}</span></nav>
          {statusLabel && <p className="place-status">{statusLabel}</p>}
          <h1>{place.name}</h1>
          {written ? <VerdictBadge verdict={written.verdict} size="lg" /> : hasCriticReview && <VerdictBadge verdict={place.verdict} size="lg" />}
          <p className="place-meta">{place.category || "Food spot"}{where ? ` in ${where}` : ""}</p>
          <p className="place-address">{place.address || place.parish}</p>
          <div className="place-actions">
            <a className="place-action place-action-primary" href={directionsUrl(place)} target="_blank" rel="noopener noreferrer">Directions<span className="sr-only"> (opens Google Maps in a new tab)</span></a>
            {telUrl(place.phone) && <a className="place-action" href={telUrl(place.phone)!}>Call</a>}
            <a className="place-action" href={googleMapsPlaceUrl(place)} target="_blank" rel="noopener noreferrer">Photos and hours on Google Maps<span className="sr-only"> (opens in a new tab)</span></a>
            {place.website && <a className="place-action" href={place.website} target="_blank" rel="noopener noreferrer">Website<span className="sr-only"> (opens in a new tab)</span></a>}
          </div>
          <SocialShare name={place.name} url={siteUrl(`/places/${place.slug}`)} />
        </div>
        {hasListingPhoto(place.image) && <div className="place-hero-photo">
          <Image className="place-hero-image" src={place.image} alt={`${place.name}`} fill priority sizes="(max-width: 860px) 100vw, 560px" />
          {place.image_credit && <p className="photo-credit">Photo: {place.image_credit}</p>}
        </div>}
      </div>
    </header>
    <div className="place-container place-content">
      <div className="review-layout-grid">
        <div className="place-sections">
          {written && <section className="place-panel place-written-review" aria-labelledby="written-review-heading">
            <span className="eyebrow">Our review</span>
            <h2 id="written-review-heading"><Link href={written.path}>{written.title}</Link></h2>
            <p>{written.teaser}</p>
            <dl className="place-written-scores">
              <div><dt>Verdict</dt><dd>{VERDICT_LABELS[written.verdict].emoji} {VERDICT_LABELS[written.verdict].label}</dd></div>
              {written.scores.map(score => <div key={score.label}><dt>{score.label}</dt><dd>{score.value}</dd></div>)}
            </dl>
            <p className="rating-provenance">Visited {formatReviewDate(written.visited)}{written.hosted && written.disclosureShort ? ` · ${written.disclosureShort}` : ""}</p>
            <Link className="btn btn-primary" href={written.path}>Read the full review</Link>
          </section>}
          {hasCriticReview && <section className="place-panel" aria-labelledby="critic-heading">
            <span className="eyebrow">Critic verdict</span>
            <h2 id="critic-heading">{place.headline || "The honest take"}</h2>
            <div className="review-dates">
              {displayDate(publishedDate) && <p>Published <time dateTime={publishedDate!}>{displayDate(publishedDate)}</time></p>}
              {displayDate(place.visited_at) && <p>Visited <time dateTime={place.visited_at!}>{displayDate(place.visited_at)}</time></p>}
            </div>
            {reviewBody && <p className="critic-body">{reviewBody}</p>}
            {typeof place.admin_score === "number" && <p className="rating-provenance">Critic score: {place.admin_score}/100</p>}
          </section>}
          {videoUrl && <section id="video" className="place-panel" aria-labelledby="video-heading">
            <h2 id="video-heading">Video review</h2>
            <a className="btn btn-primary" href={videoUrl} target="_blank" rel="noopener noreferrer">Watch the review <span className="sr-only">(opens in a new tab)</span></a>
          </section>}
          <section className="place-panel" aria-labelledby="listing-heading">
            <h2 id="listing-heading">About this spot</h2>
            {!hasCriticReview && !written && <p className="listing-notice">We haven’t reviewed this spot yet.</p>}
            <p>{place.description || "A description hasn’t been provided for this listing."}</p>
          </section>
          <ReviewSection returnPath={`/places/${place.slug}#leave-review-heading`} restaurantId={place.id} reviews={reviews} reviewsUnavailable={reviewsUnavailable} />
        </div>
        <aside className="place-panel review-sidebar" aria-labelledby="quick-hits-heading">
          <h2 id="quick-hits-heading">Quick hits</h2>
          <dl className="place-facts">
            {[{ label: "Cuisine", value: place.category }, { label: "Price", value: place.priceRange || (place.price_needs_confirmation ? "Needs confirmation" : "Not listed") }, { label: "Area", value: place.area || "Not listed" }, { label: "Parish", value: place.parish }, { label: "Phone", value: place.phone || "Not listed" }].map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
          </dl>
          {(place.public_rating ?? 0) > 0 && <p className="rating-provenance">{place.public_rating_source || "Public source"}: {place.public_rating!.toFixed(1)}/5{(place.public_review_count ?? 0) > 0 && <> · {place.public_review_count!.toLocaleString("en-US")} ratings</>}</p>}
          {(place.community_review_count ?? 0) > 0 && <p className="rating-provenance">Community: {place.community_rating?.toFixed(1)}/5 · {place.community_review_count} approved reviews</p>}
          {place.tiktok_profile_url && <p><a className="text-link" href={place.tiktok_profile_url} target="_blank" rel="noopener noreferrer">Restaurant’s TikTok <span className="sr-only">(opens in a new tab)</span></a></p>}
          {place.features.length > 0 && <ul>{place.features.map(feature => <li key={feature}>{feature}</li>)}</ul>}
        </aside>
      </div>
    </div>
  </article>;
}
