export type ReviewVerdict = "RUN_GO_GET_IT" | "WORTH_IT" | "MID" | "SAVE_YOUR_MONEY";

export type ReviewPhoto = { src: string; alt: string; caption: string };

/** The building blocks a review story is written in, rendered top to bottom. */
export type ReviewBlock =
  | { type: "lead"; text: string }
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "photo"; photo: ReviewPhoto; wide?: boolean }
  | { type: "pair"; photos: readonly [ReviewPhoto, ReviewPhoto] };

/** A complete written review: card/feature metadata plus the story itself. */
export type WrittenReview = {
  number: number;
  slug: string;
  path: string;
  restaurant: string;
  area: string;
  title: string;
  /** Browser/search title, without the site name. */
  seoTitle: string;
  /** Short line under the headline on the story page. */
  dek: string;
  /** One or two sentences for cards and features. */
  teaser: string;
  /** Search/social description. */
  description: string;
  /** Plain dates, YYYY-MM-DD. */
  published: string;
  visited: string;
  readingMinutes: number;
  verdict: ReviewVerdict;
  hero: string;
  heroAlt: string;
  heroCaption: string;
  scores: readonly { label: string; value: string }[];
  /** True when the meal was invited, discounted or complimentary. */
  hosted: boolean;
  disclosureShort?: string;
  /** Shown before the story when present. Required in practice for hosted visits. */
  disclosure?: string;
  body: readonly ReviewBlock[];
  closing: { heading: string; scoresLine?: string; paragraphs: readonly string[] };
  /** Facts for the "at a glance" sidebar. */
  glance: {
    lines: readonly string[];
    notes: readonly string[];
    officialLink?: { href: string; label: string };
  };
  /** Used for structured data. */
  address?: { street: string; locality: string; country: string };
  /** Directory listing for the same restaurant, once it exists. */
  placeSlug?: string;
  /** Parish page for "explore more" links, e.g. "kingston". */
  parishSlug?: string;
};
