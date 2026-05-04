import { notFound } from "next/navigation";
import { Metadata } from "next";

import { PlaceListCard } from "@/components/browse/place-list-card";
import { CommunityFeedback } from "@/components/place/community-feedback";
import { PlaceHeader } from "@/components/place/place-header";
import { PlaceInfoCard } from "@/components/place/place-info-card";
import { ReviewList } from "@/components/place/review-list";
import { TiktokEmbed } from "@/components/place/tiktok-embed";
import { SocialShare } from "@/components/place/social-share";
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

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlaceBySlug(slug) ?? (await getApprovedCommunityPlaceBySlug(slug));
  if (!place) return {};

  const title = `${place.name} | WhenWiHungry`;
  const description = place.reviews?.[0]?.comment?.substring(0, 155) ||
    `${place.name} — ${place.category || "Jamaican pick"} in ${place.parish}. Rated ${place.rating.toFixed(1)}/5 on WhenWiHungry.`;
  const imageUrl = place.image || "https://whenwihungry.vercel.app/logos/when-wi-hungry-logo-transparent.png";
  const canonicalUrl = `https://whenwihungry.vercel.app/places/${place.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "WhenWiHungry",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: place.name
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}

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

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: place.name
  };

  if (place.image) jsonLd.image = place.image;
  if (place.description) jsonLd.description = place.description;
  if (place.category) jsonLd.servesCuisine = place.category;
  if (place.priceRange) jsonLd.priceRange = place.priceRange;
  if (place.phone && !place.phone.includes("555")) jsonLd.telephone = place.phone;
  if (place.hours && place.hours.length > 0) jsonLd.openingHours = place.hours;

  if (place.address || place.parish) {
    jsonLd.address = {
      "@type": "PostalAddress"
    };
    if (place.address) jsonLd.address.streetAddress = place.address;
    if (place.parish) {
      jsonLd.address.addressLocality = place.parish;
      jsonLd.address.addressRegion = "JM";
    }
  }

  if (place.rating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: place.rating,
      reviewCount: place.reviewCount || 1
    };
  }

  return (
    <section className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container detail-stack">
        <PlaceHeader place={place} />
        <PlaceInfoCard place={place} />
        <SocialShare
          name={place.name}
          url={`https://whenwihungry.vercel.app/places/${place.slug}`}
        />
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
