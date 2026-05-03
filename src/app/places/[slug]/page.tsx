import { notFound } from "next/navigation";

import { PlaceListCard } from "@/components/browse/place-list-card";
import { PlaceHeader } from "@/components/place/place-header";
import { PlaceInfoCard } from "@/components/place/place-info-card";
import { ReviewList } from "@/components/place/review-list";
import { TiktokEmbed } from "@/components/place/tiktok-embed";
import { getPlaceBySlug, getRelatedPlaces } from "@/lib/places";

type PlacePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);

  if (!place) {
    notFound();
  }

  return (
    <section className="section">
      <div className="container detail-stack">
        <PlaceHeader place={place} />
        <PlaceInfoCard place={place} />
        <TiktokEmbed url={place.tiktokUrl} />
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
