/**
 * Fix Contaminated Descriptions
 *
 * One-time cleanup script for the 10 Kingston records whose descriptions
 * incorrectly mention Portland (import contamination from batch queries).
 *
 * Targets: parish = 'Kingston' AND description ILIKE '%portland%'
 * Also includes any slug from reports/place-description-audit.md as a safety net.
 *
 * Safe fields touched:
 *   description        → neutral replacement
 *   data_quality_status → 'corrected'
 *   description_status  → 'conflict_fixed'   (if column exists)
 *   location_notes      → audit trail note    (if column exists)
 *
 * Fields never touched:
 *   parish, name, slug, address, rating, category, status, tiktok_url, etc.
 *
 * Usage:
 *   npx tsx scripts/fix-contaminated-descriptions.ts            # dry run
 *   npx tsx scripts/fix-contaminated-descriptions.ts --apply    # write to Supabase
 */

import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../src/lib/supabase/config";

const APPLY = process.argv.includes("--apply");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOCATION_NOTE =
  "Description previously mentioned Portland but parish/address indicates Kingston. Corrected by data cleanup script.";

// ── Slug safety net from place-description-audit.md ─────────────────
const KNOWN_CONTAMINATED_SLUGS = [
  "22-jerk-plus",
  "cafe-dolce",
  "idcove-catering",
  "jamaica-liquor-warehouse",
  "jerk-box",
  "king-janga-seafood-lounge",
  "kingston-jerk",
  "market-place",
  "susies",
  "triple-tz-eatery",
];

// ── Description templates ────────────────────────────────────────────

function getNeutralDescription(name: string, category: string, area: string): string {
  const cat = `${name} ${category}`.toLowerCase();
  const location = area ? `${area}, Kingston` : "Kingston";

  const isJerk =
    /jerk/.test(cat) ||
    /pimento/.test(cat) ||
    /bbq|barbecue/.test(cat);

  const isSeafood =
    /seafood|fish|lobster|shrimp|conch/.test(cat);

  const isCafe =
    /cafe|coffee|caf[eé]|dolce|bakery|pastry|light bites/.test(cat);

  const isBar =
    /bar|lounge|liquor|drinks|beer|wine/.test(cat);

  if (isJerk) {
    return `Mapped jerk spot in ${location}. Public signals are shown where available, and WhenWiHungry verdicts are added as reviews go live.`;
  }

  if (isSeafood) {
    return `Mapped seafood spot in ${location}. Details, public signals, and critic verdicts are added as the listing is verified.`;
  }

  if (isCafe) {
    return `Mapped café and light bites spot in ${location}. Public signals are shown where available, and WhenWiHungry verdicts are added as reviews go live.`;
  }

  if (isBar) {
    return `Mapped bar and drinks spot in ${location}. Public signals are shown where available, and WhenWiHungry verdicts are added as reviews go live.`;
  }

  return `Mapped food spot in ${location}. Public signals are shown where available, with critic verdicts added as they go live.`;
}

// ── Supabase update — tries extended fields, falls back if missing ───

async function applyUpdate(
  slug: string,
  newDescription: string
): Promise<{ ok: boolean; extended: boolean; error?: string }> {
  const extended = {
    description: newDescription,
    data_quality_status: "corrected",
    description_status: "conflict_fixed",
    location_notes: LOCATION_NOTE,
  };

  const { error: e1 } = await supabase
    .from("restaurants")
    .update(extended)
    .eq("slug", slug);

  if (!e1) return { ok: true, extended: true };

  // Column doesn't exist — fall back to core fields only
  if (e1.code === "42703") {
    const core = {
      description: newDescription,
      data_quality_status: "corrected",
    };
    const { error: e2 } = await supabase
      .from("restaurants")
      .update(core)
      .eq("slug", slug);

    if (!e2) return { ok: true, extended: false };
    return { ok: false, extended: false, error: e2.message };
  }

  return { ok: false, extended: false, error: e1.message };
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log(
    APPLY
      ? "APPLY MODE — writing changes to Supabase.\n"
      : "DRY RUN — no changes will be written. Pass --apply to execute.\n"
  );

  // ── Fetch targets ────────────────────────────────────────────────
  // Primary source: DB query (parish=Kingston, description contains 'portland')
  const { data: byQuery, error: qErr } = await supabase
    .from("restaurants")
    .select("id, slug, name, parish, area, category, cuisine_type, description")
    .eq("parish", "Kingston")
    .ilike("description", "%portland%");

  if (qErr) {
    console.error("Failed to query records:", qErr.message);
    process.exit(1);
  }

  // Merge with known-slug safety net (catches records that may have had parish updated after contamination)
  const { data: bySlug, error: sErr } = await supabase
    .from("restaurants")
    .select("id, slug, name, parish, area, category, cuisine_type, description")
    .in("slug", KNOWN_CONTAMINATED_SLUGS);

  if (sErr) {
    console.error("Failed to fetch known slugs:", sErr.message);
    process.exit(1);
  }

  // Deduplicate by slug
  const seen = new Set<string>();
  const targets: any[] = [];
  for (const r of [...(byQuery ?? []), ...(bySlug ?? [])]) {
    if (!seen.has(r.slug)) {
      seen.add(r.slug);
      // Only include if description still contains 'portland' (case-insensitive)
      if ((r.description || "").toLowerCase().includes("portland")) {
        targets.push(r);
      }
    }
  }

  if (targets.length === 0) {
    console.log("No contaminated records found. Nothing to fix.");
    return;
  }

  console.log(`Found ${targets.length} record(s) to fix.\n`);
  console.log("─".repeat(70));

  let applied = 0;
  let failed = 0;
  let skippedExtended = 0;

  for (const r of targets) {
    const category = r.category || r.cuisine_type || "";
    const area = r.area || "";
    const newDescription = getNeutralDescription(r.name, category, area);

    // Print before/after
    console.log(`\nName:     ${r.name}`);
    console.log(`Slug:     ${r.slug}`);
    console.log(`Parish:   ${r.parish}`);
    console.log(`Category: ${category || "(none)"}`);
    console.log(`\n  OLD: ${r.description}`);
    console.log(`  NEW: ${newDescription}`);

    if (!APPLY) {
      console.log(`  [DRY RUN — no write]`);
      applied++;
      continue;
    }

    const result = await applyUpdate(r.slug, newDescription);

    if (result.ok) {
      if (result.extended) {
        console.log(`  ✓ Updated (description + data_quality_status + description_status + location_notes)`);
      } else {
        console.log(`  ✓ Updated (description + data_quality_status only — description_status/location_notes columns not in schema)`);
        skippedExtended++;
      }
      applied++;
    } else {
      console.log(`  ✗ FAILED: ${result.error}`);
      failed++;
    }
  }

  console.log("\n" + "─".repeat(70));
  console.log(`\nSummary:`);
  console.log(`  ${APPLY ? "Applied" : "Would apply"}: ${applied}`);
  if (failed > 0) console.log(`  Failed: ${failed}`);
  if (skippedExtended > 0)
    console.log(`  Extended fields skipped (schema): ${skippedExtended} — add description_status and location_notes columns to use them`);

  if (!APPLY) {
    console.log(`\nRun with --apply to write these changes to Supabase.`);
    console.log(`Then verify with:`);
    console.log(`  npx tsx scripts/audit-place-descriptions.ts`);
    console.log(`  npm run data:audit`);
    console.log(`  npm run build`);
  }
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
