/** Links to Google Maps (Maps URLs: free, no API key). */
type MapsPlace = { name: string; address?: string; parish?: string; lat?: number; lng?: number; google_place_id?: string | null };

function query(place: MapsPlace) {
  if (place.lat !== undefined && place.lng !== undefined) return `${place.lat},${place.lng}`;
  return [place.name, place.address || place.parish, "Jamaica"].filter(Boolean).join(", ");
}

export function directionsUrl(place: MapsPlace): string {
  const params = new URLSearchParams({ api: "1", destination: place.google_place_id ? place.name : query(place) });
  if (place.google_place_id) params.set("destination_place_id", place.google_place_id);
  return `https://www.google.com/maps/dir/?${params}`;
}

/** The place on Google Maps, where visitors can see its photos, hours and public reviews. */
export function googleMapsPlaceUrl(place: MapsPlace): string {
  const params = new URLSearchParams({ api: "1", query: place.google_place_id ? place.name : query(place) });
  if (place.google_place_id) params.set("query_place_id", place.google_place_id);
  return `https://www.google.com/maps/search/?${params}`;
}

export function telUrl(phone: string | undefined): string | null {
  const digits = (phone ?? "").replace(/[^\d+]/g, "");
  return digits.replace(/\D/g, "").length >= 7 ? `tel:${digits}` : null;
}
