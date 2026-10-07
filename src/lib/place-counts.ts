import { CatalogUnavailableError, getAllApprovedPlaces } from "@/lib/community";

/** Count the same eligible, geographically checked records shown in the directory. */
export async function getPublicFoodSpotCount(): Promise<number | null> {
  try { return (await getAllApprovedPlaces()).length; }
  catch (error) {
    if (error instanceof CatalogUnavailableError) return null;
    throw error;
  }
}

export function formatFoodSpotCount(count: number | null): string | null {
  if (count === null || !Number.isFinite(count) || count < 0) return null;
  if (count >= 1000) return `${Math.floor(count / 100) / 10}K+`;
  if (count >= 100) return `${Math.floor(count / 100) * 100}+`;
  return `${count}`;
}

export async function getPublicFoodSpotCountLabel(): Promise<string | null> {
  return formatFoodSpotCount(await getPublicFoodSpotCount());
}
