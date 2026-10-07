import { normalizeParish, getParishDisplayName } from "@/lib/location-validation";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getApprovedCommunityPlaceBySlug, getCurrentUser } from "@/lib/community";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { SocialShare } from "@/components/place/social-share";
import { ReviewSection } from "@/components/place/review-section";
import { getPlaceStatusLabel, isCriticReviewed, getReviewVideoUrl } from "@/lib/place-status";
import { serializeJsonLd } from "@/lib/security/json-ld";
import { siteUrl } from "@/lib/site-url";

type PlacePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getApprovedCommunityPlaceBySlug(slug);
  if (!place) return { title: "Food spot not found", robots: { index: false, follow: true } };
  const description = place.description || `${place.name} — ${place.category || "Food spot"} in ${place.parish}.`;
  const canonical = `/places/${place.slug}`;
  const title = `${place.name}${place.parish ? ` in ${getParishDisplayName(place.parish)}` : ""}`;
  return {
    title, description, alternates: { canonical },
    openGraph: { title: `${title} | WhenWiHungry`, description, url: siteUrl(canonical), siteName: "WhenWiHungry", images: [{ url: place.image, alt: place.name }], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [place.image] }
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
  const [supabase, user] = await Promise.all([createSupabaseServerClient(), getCurrentUser()]);
  const [reviewResult, existingResult] = await Promise.all([
    supabase.from("user_reviews").select("id, rating, comment, created_at").eq("restaurant_id", place.id).eq("status", "approved").order("created_at", { ascending: false }).limit(50),
    user ? supabase.from("user_reviews").select("id").eq("restaurant_id", place.id).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null, error: null })
  ]);
  const parish = normalizeParish(place.parish);
  const hasCriticReview = isCriticReviewed(place);
  const videoUrl = getReviewVideoUrl(place);
  const publishedDate = place.published_at || place.reviewed_at;
  const reviewBody = place.honest_take || place.critic_review_body;
  const restaurantSchema = {
    "@context": "https://schema.org", "@type": "Restaurant", name: place.name,
    description: place.description || undefined, url: siteUrl(`/places/${place.slug}`), image: place.image,
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
    <header className="place-hero" style={{ backgroundImage: `linear-gradient(to top, #0b0b0b, rgba(11,11,11,.65)), url(${place.image})` }}>
      <div className="place-container">
        <nav aria-label="Breadcrumb"><Link href="/browse">Food spots</Link><span aria-hidden="true"> / </span>{parish && <><Link href={`/restaurants/${parish.replace(/ /g, "-")}`}>{getParishDisplayName(parish)}</Link><span aria-hidden="true"> / </span></>}<span>{place.name}</span></nav>
        <p className="place-status">{getPlaceStatusLabel(place)}</p>
        <h1>{place.name}</h1>
        {hasCriticReview && <VerdictBadge verdict={place.verdict} size="lg" />}
        <p className="place-address">{place.address || place.parish}</p>
        <SocialShare name={place.name} url={siteUrl(`/places/${place.slug}`)} />
      </div>
    </header>
    <div className="place-container place-content">
      <div className="review-layout-grid">
        <div className="place-sections">
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
            <h2 id="listing-heading">Listing information</h2>
            {!hasCriticReview && <p className="listing-notice">No written critic verdict has been published for this listing.</p>}
            <p>{place.description || "A description hasn’t been provided for this listing."}</p>
          </section>
          <ReviewSection returnPath={`/places/${place.slug}#leave-review-heading`} restaurantId={place.id} reviews={reviewResult.data ?? []} isSignedIn={Boolean(user)} userReview={existingResult.data} reviewsUnavailable={Boolean(reviewResult.error)} submissionUnavailable={Boolean(existingResult.error)} />
        </div>
        <aside className="place-panel review-sidebar" aria-labelledby="quick-hits-heading">
          <h2 id="quick-hits-heading">Quick Hits</h2>
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
