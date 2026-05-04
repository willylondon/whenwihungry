import type { Verdict } from "@/lib/verdict";

const VERDICT_CONFIG: Record<
  string,
  { emoji: string; label: string; bg: string; text: string; border: string }
> = {
  "RUN_GO_GET_IT": {
    emoji: "🔥",
    label: "Run Go Get It",
    bg: "rgba(255, 90, 31, 0.15)",
    text: "#ff5a1f",
    border: "rgba(255, 90, 31, 0.4)"
  },
  "WORTH_IT": {
    emoji: "👍",
    label: "Worth It",
    bg: "rgba(46, 196, 182, 0.15)",
    text: "#2EC4B6",
    border: "rgba(46, 196, 182, 0.4)"
  },
  "MID": {
    emoji: "😐",
    label: "Mid",
    bg: "rgba(156, 163, 175, 0.15)",
    text: "#9ca3af",
    border: "rgba(156, 163, 175, 0.4)"
  },
  "SAVE_YOUR_MONEY": {
    emoji: "🚫",
    label: "Save Your Money",
    bg: "rgba(239, 68, 68, 0.12)",
    text: "#ef4444",
    border: "rgba(239, 68, 68, 0.35)"
  },
  // Legacy support for lowercase/dashed
  "run-go-get-it": {
    emoji: "🔥",
    label: "Run Go Get It",
    bg: "rgba(255, 90, 31, 0.15)",
    text: "#ff5a1f",
    border: "rgba(255, 90, 31, 0.4)"
  },
  "worth-it": {
    emoji: "👍",
    label: "Worth It",
    bg: "rgba(46, 196, 182, 0.15)",
    text: "#2EC4B6",
    border: "rgba(46, 196, 182, 0.4)"
  },
  "save-your-money": {
    emoji: "🚫",
    label: "Save Your Money",
    bg: "rgba(239, 68, 68, 0.12)",
    text: "#ef4444",
    border: "rgba(239, 68, 68, 0.35)"
  }
};

type VerdictBadgeProps = {
  verdict?: string;
  size?: "sm" | "md" | "lg";
};

export function VerdictBadge({ verdict, size = "md" }: VerdictBadgeProps) {
  if (!verdict) return null;
  
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG[verdict.toUpperCase().replace(/-/g, "_")];
  if (!config) return null;

  const sizeStyles = {
    sm: { padding: "4px 10px", fontSize: "0.75rem", gap: "5px" },
    md: { padding: "8px 16px", fontSize: "0.9rem", gap: "7px" },
    lg: { padding: "14px 24px", fontSize: "1.15rem", gap: "10px" }
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: sizeStyles[size].gap,
        padding: sizeStyles[size].padding,
        fontSize: sizeStyles[size].fontSize,
        fontWeight: 700,
        fontFamily: "var(--wwh-font-body)",
        color: config.text,
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: "999px",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap"
      }}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}
