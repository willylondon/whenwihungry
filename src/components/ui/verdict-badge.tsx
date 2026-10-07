/** The four verdicts, keyed by their stored codes (legacy dashed lowercase is accepted too). */
const VERDICTS: Record<string, { label: string; tone: string }> = {
  RUN_GO_GET_IT: { label: "Run Go Get It", tone: "v-run" },
  WORTH_IT: { label: "Worth It", tone: "v-worth" },
  MID: { label: "Mid", tone: "v-mid" },
  SAVE_YOUR_MONEY: { label: "Save Your Money", tone: "v-save" }
};

export function verdictLabel(verdict?: string): string | null {
  if (!verdict) return null;
  return VERDICTS[verdict.toUpperCase().replace(/-/g, "_")]?.label ?? null;
}

type VerdictBadgeProps = {
  verdict?: string;
  size?: "sm" | "md" | "lg";
};

/** A verdict painted like a cookshop sign: the site's one bold visual device. */
export function VerdictBadge({ verdict, size = "md" }: VerdictBadgeProps) {
  if (!verdict) return null;
  const config = VERDICTS[verdict.toUpperCase().replace(/-/g, "_")];
  if (!config) return null;
  return <span className={`verdict-sign ${config.tone} size-${size}`}>
    <span className="sr-only">WhenWiHungry verdict: </span>{config.label}
  </span>;
}
