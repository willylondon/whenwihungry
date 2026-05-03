import { notFound } from "next/navigation";

import { PlaceListCard } from "@/components/browse/place-list-card";
import { CommunityFeedback } from "@/components/place/community-feedback";
import { PlaceHeader } from "@/components/place/place-header";
import { PlaceInfoCard } from "@/components/place/place-info-card";
import { ReviewList } from "@/components/place/review-list";
import { TiktokEmbed } from "@/components/place/tiktok-embed";
import {
  getApprovedCommunityPlaceBySlug,
  getCommunityComments,
  getCommunityRestaurant,
  getCurrentUser
} from "@/lib/community";
import { getPlaceBySlug, getRelatedPlaces } from "@/lib/places";

type PlacePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug) ?? (await getApprovedCommunityPlaceBySlug(slug));

  if (!place) {
    notFound();
  }

  const [community, user] = await Promise.all([
    getCommunityRestaurant(place.slug),
    getCurrentUser()
  ]);
  const communityComments = community
    ? await getCommunityComments(community.id)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: place.name,
    image: place.image,
    description: place.description,
    servesCuisine: "Jamaican",
    priceRange: place.priceRange || "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: place.address,
      addressLocality: place.parish,
      addressRegion: "JM"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: place.rating,
      reviewCount: place.reviewCount || 1
    }
  };

  return (
    <section className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container detail-stack">
        <PlaceHeader place={place} />
        <PlaceInfoCard place={place} />
        <TiktokEmbed url={place.tiktokUrl} />
        <CommunityFeedback
          comments={communityComments}
          community={community}
          isSignedIn={Boolean(user)}
          slug={place.slug}
        />
        <ReviewList reviews={place.reviews} />
        <section>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Nearby</span>
              <h2>More picks in {place.parish}</h2>
            </div>
          </div>
          <div className="card-grid">
            {getRelatedPlaces(place.slug).map((relatedPlace) => (
              <PlaceListCard key={relatedPlace.slug} place={relatedPlace} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
