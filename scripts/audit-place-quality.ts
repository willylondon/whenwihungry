/**
 * Place Quality Audit Script
 *
 * Flags non-food businesses, low-quality records, and known problematic entries
 * that should be excluded from the public directory.
 *
 * Usage: npx tsx scripts/audit-place-quality.ts
 * Output: reports/place-quality-audit.md
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { supabaseUrl, supabaseAnonKey } from "../src/lib/supabase/config";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Known non-food businesses ───────────────────────────────────────
// These are directory entries confirmed to be not food businesses.
// Format: slug → reason

const KNOWN_NOT_FOOD: Record<string, string> = {
  "lennys-cooking-gas": "Gas/fuel supplier — not a food business",
  "lenny-s-cooking-gas": "Gas/fuel supplier — not a food business",
  "cooksmart-equipment": "Commercial kitchen equipment supplier — not a food business",
  "cooksmart-equipment-limited": "Commercial kitchen equipment supplier — not a food business",
  "c-m-collection": "Fashion/clothing retail — not a food business",
  "changs-trading-co": "General trading company — not a food business",
  "chang-s-trading-co": "General trading company — not a food business",
  "coronation-market-jamaica": "General produce market — not a food service business",
};

// ── Non-food name patterns ──────────────────────────────────────────
// Regex patterns that strongly suggest a non-food business category.

const NON_FOOD_NAME_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /cooking\s+gas/i, reason: "Cooking gas supplier — not a food business" },
  { pattern: /kitchen\s+(equipment|supplies)/i, reason: "Kitchen equipment supplier — not a food business" },
  { pattern: /\b(hardware|lumber|building|construction|materials)\b/i, reason: "Hardware/construction — not a food business" },
  { pattern: /\b(pharmacy|chemist|drug\s+store)\b/i, reason: "Pharmacy — not a food business" },
  { pattern: /\b(car\s+wash|auto\s+parts|tyre|tire\s+shop)\b/i, reason: "Automotive — not a food business" },
  { pattern: /\b(beauty\s+salon|barbershop|barber\s+shop|nail\s+salon)\b/i, reason: "Personal care — not a food business" },
  { pattern: /\b(real\s+estate|property\s+management|mortgage)\b/i, reason: "Real estate — not a food business" },
  { pattern: /\b(law\s+firm|attorney|solicitor)\b/i, reason: "Legal services — not a food business" },
  { pattern: /\b(accounting|accountant|financial\s+services)\b/i, reason: "Financial services — not a food business" },
];

// ── Non-food category patterns ──────────────────────────────────────

const NON_FOOD_CATEGORY_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\b(gas|fuel|petroleum)\b/i, reason: "Fuel/gas supplier category" },
  { pattern: /\b(equipment|machinery|hardware)\b/i, reason: "Equipment/hardware category" },
  { pattern: /\b(clothing|fashion|apparel|textile)\b/i, reason: "Clothing/fashion category" },
  { pattern: /\b(automotive|vehicle|car\s+rental)\b/i, reason: "Automotive category" },
];

// ── Types ───────────────────────────────────────────────────────────

type QualityFlag = {
  id: string;
  slug: string;
  name: string;
  parish: string;
  category: string;
  currentBusinessType: string | null;
  currentDataQualityStatus: string | null;
  reason: string;
  suggestedAction: "mark_not_food" | "mark_needs_review" | "mark_rejected";
};

type QualityAuditReport = {
  timestamp: string;
  totalRecords: number;
  alreadyNotFood: number;
  alreadyRejected: number;
  alreadyNeedsReview: number;
  newlyFlagged: number;
  flags: QualityFlag[];
};

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("Loading all restaurant records from Supabase...");

  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("id, slug, name, parish, category, cuisine_type, description")
    .order("name");

  if (error) {
    console.error("Failed to fetch restaurants:", error);
    process.exit(1);
  }

  if (!restaurants || restaurants.length === 0) {
    console.log("No restaurants found.");
    return;
  }

  console.log(`Loaded ${restaurants.length} records.`);

  const report: QualityAuditReport = {
    timestamp: new Date().toISOString(),
    totalRecords: restaurants.length,
    alreadyNotFood: 0,
    alreadyRejected: 0,
    alreadyNeedsReview: 0,
    newlyFlagged: 0,
    flags: []
  };

  for (const r of restaurants) {
    const slug = r.slug || "";
    const name = String(r.name || "").trim();
    const category = String(r.category || r.cuisine_type || "").trim();
    const businessType: string | null = null; // column not yet in schema
    const qualityStatus: string | null = null; // column not yet in schema

    // (These fields will be used once schema is updated with data_quality_status + business_type columns)
    if (businessType === "not_food") { report.alreadyNotFood++; continue; }
    if (qualityStatus === "rejected") { report.alreadyRejected++; continue; }
    if (qualityStatus === "needs_review") { report.alreadyNeedsReview++; }

    let flagReason: string | null = null;
    let action: QualityFlag["suggestedAction"] = "mark_not_food";

    // 1. Known non-food list
    if (KNOWN_NOT_FOOD[slug]) {
      flagReason = KNOWN_NOT_FOOD[slug];
      action = "mark_not_food";
    }

    // 2. Name pattern checks
    if (!flagReason) {
      for (const { pattern, reason } of NON_FOOD_NAME_PATTERNS) {
        if (pattern.test(name)) {
          flagReason = reason;
          action = "mark_not_food";
          break;
        }
      }
    }

    // 3. Category pattern checks
    if (!flagReason) {
      for (const { pattern, reason } of NON_FOOD_CATEGORY_PATTERNS) {
        if (pattern.test(category)) {
          flagReason = `${reason} (category: "${category}")`;
          action = "mark_needs_review";
          break;
        }
      }
    }

    // 4. Very short/empty names
    if (!flagReason && name.length < 3) {
      flagReason = "Name too short or empty — likely a bad import record";
      action = "mark_rejected";
    }

    if (flagReason) {
      report.newlyFlagged++;
      report.flags.push({
        id: r.id,
        slug,
        name,
        parish: r.parish || "(empty)",
        category,
        currentBusinessType: businessType,
        currentDataQualityStatus: qualityStatus,
        reason: flagReason,
        suggestedAction: action
      });
    }
  }

  // ── Write report ─────────────────────────────────────────────────

  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const md = generateMarkdown(report);
  const outPath = path.join(reportsDir, "place-quality-audit.md");
  fs.writeFileSync(outPath, md);

  console.log(`\nReport written to ${outPath}`);
  console.log(`Total: ${report.totalRecords}`);
  console.log(`Already classified as not_food: ${report.alreadyNotFood}`);
  console.log(`Already rejected: ${report.alreadyRejected}`);
  console.log(`Already needs_review: ${report.alreadyNeedsReview}`);
  console.log(`Newly flagged: ${report.newlyFlagged}`);

  if (report.flags.length > 0) {
    console.log("\n── Newly flagged records ──────────────────────────────");
    for (const f of report.flags) {
      console.log(`  ${f.slug} | action=${f.suggestedAction} | ${f.reason}`);
    }
  }
}

// ── Markdown generator ──────────────────────────────────────────────

function generateMarkdown(r: QualityAuditReport): string {
  let md = `# Place Quality Audit Report\n\n`;
  md += `**Generated**: ${r.timestamp}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Count |\n`;
  md += `|--------|-------|\n`;
  md += `| Total records | ${r.totalRecords} |\n`;
  md += `| Already classified as not_food | ${r.alreadyNotFood} |\n`;
  md += `| Already rejected | ${r.alreadyRejected} |\n`;
  md += `| Already needs_review | ${r.alreadyNeedsReview} |\n`;
  md += `| Newly flagged by this audit | ${r.newlyFlagged} |\n\n`;

  if (r.flags.length === 0) {
    md += `No new quality issues detected.\n`;
    return md;
  }

  md += `## Newly Flagged Records\n\n`;
  md += `Run \`scripts/fix-place-data-quality.ts --apply\` to apply these changes to Supabase.\n\n`;
  md += `| Slug | Name | Parish | Category | Current business_type | Current data_quality_status | Reason | Suggested Action |\n`;
  md += `|------|------|--------|----------|-----------------------|-----------------------------|--------|------------------|\n`;

  for (const f of r.flags) {
    md += `| ${f.slug} | ${f.name} | ${f.parish} | ${f.category} | ${f.currentBusinessType ?? "—"} | ${f.currentDataQualityStatus ?? "—"} | ${f.reason} | \`${f.suggestedAction}\` |\n`;
  }

  return md;
}

main().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
