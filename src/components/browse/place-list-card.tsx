import Image from "next/image";
import Link from "next/link";
import type { PlaceV2 } from "@/lib/community";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { getPlaceStatusLabel, getPlaceCta, getPlaceStatus } from "@/lib/place-status";

export function PlaceListCard({ place, showMatchReason = false }: { place: PlaceV2; showMatchReason?: boolean }) {
  const status = getPlaceStatus(place);
  const hasPublicSignal = (place.public_rating ?? 0) > 0;
  const summary = status === "critic-reviewed" ? place.headline || place.honest_take || place.critic_review_body : place.description || place.public_listing_summary;
  return (
    <Link href={`/places/${place.slug}${status === "tiktok-reviewed" ? "#video" : ""}`} className="browse-card-link">
      <div className="browse-card-image">
        <Image alt={place.name} src={place.image} width={480} height={320} sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 400px" loading="lazy" />
        {place.is_verified && <span className="verified-label">Verified listing</span>}
      </div>
      <div className="browse-card-body">
        <div className="browse-card-status">
          <span>{getPlaceStatusLabel(place)}</span>
          {showMatchReason && place.match_reason && <span className="match-label">{place.match_reason}</span>}
        </div>
        <h2>{place.name || "Unnamed Food Spot"}</h2>
        {place.verdict && status === "critic-reviewed" && <VerdictBadge verdict={place.verdict} size="sm" />}
        {summary && <p className="browse-card-summary">{summary}</p>}
        <p className="browse-card-meta">{[place.category, place.priceRange || (place.price_needs_confirmation ? "Price needs confirmation" : "Price not listed"), place.parish].filter(Boolean).join(" · ")}</p>
        {hasPublicSignal && <p className="rating-provenance">
          <span aria-hidden="true">★ </span>{place.public_rating_source || "Public source"}: {place.public_rating!.toFixed(1)}/5
          {(place.public_review_count ?? 0) > 0 && <> · {place.public_review_count!.toLocaleString("en-US")} ratings</>}
        </p>}
        {(place.community_review_count ?? 0) > 0 && <p className="rating-provenance">Community: {place.community_rating?.toFixed(1)}/5 · {place.community_review_count} approved reviews</p>}
        <span className="browse-card-cta">{getPlaceCta(place)}</span>
      </div>
    </Link>
  );
}
