import { rokReview } from "./rok-hotel";
import type { WrittenReview } from "./types";

export type { ReviewBlock, ReviewPhoto, ReviewVerdict, WrittenReview } from "./types";

/**
 * Every published written review, newest first. Adding a review = add its data
 * file here plus its story page; the hub, homepage and sitemap pick it up.
 */
export const writtenReviews: readonly WrittenReview[] = [rokReview]
  .slice()
  .sort((a, b) => b.published.localeCompare(a.published));

export function getWrittenReview(slug: string): WrittenReview | undefined {
  return writtenReviews.find(review => review.slug === slug);
}

/** The written review for a directory listing, if we've published one. */
export function getWrittenReviewForPlace(slug: string | undefined): WrittenReview | undefined {
  return slug ? writtenReviews.find(review => review.placeSlug === slug) : undefined;
}

export const latestWrittenReview: WrittenReview | undefined = writtenReviews[0];

export const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@whenwihungry";

export function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-JM", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export const VERDICT_LABELS: Record<WrittenReview["verdict"], { emoji: string; label: string }> = {
  RUN_GO_GET_IT: { emoji: "🔥", label: "Run Go Get It" },
  WORTH_IT: { emoji: "👍", label: "Worth It" },
  MID: { emoji: "😐", label: "Mid" },
  SAVE_YOUR_MONEY: { emoji: "🚫", label: "Save Your Money" }
};
