import { getForeignLocationReasons, type GeographicPlace } from "@/lib/location-validation";
import { isReviewed, type PlaceStatusLike } from "@/lib/place-status";

export type VisibilityPlace = GeographicPlace & {
  status?: string | null;
  is_active?: boolean | null;
  data_quality_status?: string | null;
  dataQualityStatus?: string | null;
  business_type?: string | null;
  businessType?: string | null;
  manually_verified?: boolean | null;
  manuallyVerified?: boolean | null;
};

/** NULL active/quality/type fields mean unspecified, matching public SQL filters. */
export function getPublicExclusionReasons(place: VisibilityPlace): string[] {
  const reasons = getForeignLocationReasons(place);
  if (place.status !== "approved") reasons.push("not_approved");
  if (place.is_active === false) reasons.push("inactive");
  if ((place.data_quality_status ?? place.dataQualityStatus) === "rejected") reasons.push("rejected_quality");
  if ((place.business_type ?? place.businessType) === "not_food") reasons.push("not_food");
  return reasons;
}

export function isPublicFoodSpot(place: VisibilityPlace): boolean { return getPublicExclusionReasons(place).length === 0; }
export function isSafeForBrowse(place: VisibilityPlace): boolean { return isPublicFoodSpot(place); }
export function isSafeForParishPage(place: VisibilityPlace): boolean {
  return isPublicFoodSpot(place) && ((place.data_quality_status ?? place.dataQualityStatus) !== "needs_review" || Boolean(place.manually_verified ?? place.manuallyVerified));
}
export function isReviewedPlace(place: PlaceStatusLike): boolean { return isReviewed(place); }
