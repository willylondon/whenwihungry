export type Verdict = "run-go-get-it" | "worth-it" | "mid" | "save-your-money";

export function getVerdictFromRating(rating: number): Verdict {
  if (rating >= 4.5) return "run-go-get-it";
  if (rating >= 4.0) return "worth-it";
  if (rating >= 3.0) return "mid";
  return "save-your-money";
}
