/**
 * Data Quality Fix Script
 *
 * Applies business_type and data_quality_status corrections to Supabase.
 * Dry-run by default — no writes are made unless --apply flag is passed.
 *
 * Usage:
 *   npx tsx scripts/fix-place-data-quality.ts          # dry run
 *   npx tsx scripts/fix-place-data-quality.ts --apply  # write to Supabase
 */

import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../src/lib/supabase/config";

const DRY_RUN = !process.argv.includes("--apply");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Corrections ─────────────────────────────────────────────────────
// slug → { business_type, data_quality_status, reason }

type Fix = {
  business_type: "not_food" | "food_adjacent" | "food_spot" | "needs_review";
  data_quality_status?: "rejected" | "needs_review";
  reason: string;
};

const FIXES: Record<string, Fix> = {
  // ── Confirmed non-food businesses ─────────────────────────────────
  "lennys-cooking-gas": {
    business_type: "not_food",
    data_quality_status: "rejected",
    reason: "Gas/fuel supplier — not a food business"
  },
  "lenny-s-cooking-gas": {
    business_type: "not_food",
    data_quality_status: "rejected",
    reason: "Gas/fuel supplier — not a food business"
  },
  "cooksmart-equipment": {
    business_type: "not_food",
    data_quality_status: "rejected",
    reason: "Commercial kitchen equipment supplier — not a food business"
  },
  "cooksmart-equipment-limited": {
    business_type: "not_food",
    data_quality_status: "rejected",
    reason: "Commercial kitchen equipment supplier — not a food business"
  },
  "c-m-collection": {
    business_type: "not_food",
    data_quality_status: "rejected",
    reason: "Fashion/clothing retail — not a food business"
  },
  "changs-trading-co": {
    business_type: "not_food",
    data_quality_status: "rejected",
    reason: "General trading company — not a food business"
  },
  "chang-s-trading-co": {
    business_type: "not_food",
    data_quality_status: "rejected",
    reason: "General trading company — not a food business"
  },
  "coronation-market-jamaica": {
    business_type: "food_adjacent",
    data_quality_status: "needs_review",
    reason: "General produce market — food-adjacent but not a food service business; needs manual review"
  },

  // ── Food-adjacent businesses (supply/equipment, not dining) ────────
  "rainforest-seafoods": {
    business_type: "food_adjacent",
    reason: "Seafood wholesale supplier — food-adjacent, not a restaurant or dining spot"
  },
  "jamaica-liquor-warehouse": {
    business_type: "food_adjacent",
    reason: "Alcohol/spirits retail — food-adjacent, not a restaurant. Review if food service is offered."
  },
};

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  if (DRY_RUN) {
    console.log("DRY RUN — no changes will be written. Pass --apply to execute.\n");
  } else {
    console.log("APPLY MODE — writing changes to Supabase.\n");
    console.log("NOTE: Requires business_type and data_quality_status columns to exist in the restaurants table.\n");
  }

  // Verify each slug exists before applying
  const slugs = Object.keys(FIXES);
  const { data: existing, error: fetchError } = await supabase
    .from("restaurants")
    .select("id, slug, name")
    .in("slug", slugs);

  if (fetchError) {
    console.error("Failed to fetch records:", fetchError);
    process.exit(1);
  }

  const existingBySlug = new Map((existing || []).map((r: any) => [r.slug, r]));
  let applied = 0;
  let skipped = 0;
  let notFound = 0;

  for (const [slug, fix] of Object.entries(FIXES)) {
    const record = existingBySlug.get(slug);

    if (!record) {
      console.log(`  ⚠ NOT FOUND: ${slug}`);
      notFound++;
      continue;
    }

    const update: Record<string, string> = { business_type: fix.business_type };
    if (fix.data_quality_status) update.data_quality_status = fix.data_quality_status;

    const changes = Object.entries(update)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");

    if (DRY_RUN) {
      console.log(`  [DRY] ${slug} (${record.name}): ${changes} — ${fix.reason}`);
      applied++;
      continue;
    }

    const { error } = await supabase
      .from("restaurants")
      .update(update)
      .eq("slug", slug);

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
      skipped++;
    } else {
      console.log(`  ✓ ${slug} (${record.name}): ${changes}`);
      applied++;
    }
  }

  console.log(`\n${DRY_RUN ? "Dry run complete" : "Done"}.`);
  console.log(`  Would ${DRY_RUN ? "apply" : "Applied"}: ${applied}`);
  console.log(`  Not found in DB: ${notFound}`);
  if (!DRY_RUN) console.log(`  Errors: ${skipped}`);

  if (DRY_RUN) {
    console.log("\nRun with --apply to write these changes to Supabase.");
  }
}

main().catch((err) => {
  console.error("Fix script failed:", err);
  process.exit(1);
});
