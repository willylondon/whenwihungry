/**
 * Data Quality Audit Script
 *
 * Usage: npx tsx scripts/audit-place-locations.ts
 *
 * Loads all restaurant records from Supabase and generates a location
 * audit report at reports/place-location-audit.md
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { normalizeParish, validatePlaceParish, getAllParishNames } from "../src/lib/location-validation";

// ── Config ──────────────────────────────────────────────────────────

import { supabaseUrl, supabaseAnonKey } from "../src/lib/supabase/config";

const SUPABASE_URL = supabaseUrl;
const SUPABASE_KEY = supabaseAnonKey;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Types ───────────────────────────────────────────────────────────

type FlaggedRecord = {
  name: string;
  slug: string;
  parish: string;
  area: string;
  address: string;
  reason: string;
  suggestedAction: string;
};

type AuditReport = {
  timestamp: string;
  totalPlaces: number;
  totalFlagged: number;
  missingName: number;
  missingParish: number;
  missingArea: number;
  missingAddress: number;
  missingCoordinates: number;
  duplicatesByName: number;
  suspiciousCrossParish: number;
  byParish: Record<string, number>;
  flagged: FlaggedRecord[];
};

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("Loading all restaurant records from Supabase...");

  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("name");

  if (error) {
    console.error("Failed to fetch restaurants:", error);
    process.exit(1);
  }

  if (!restaurants || restaurants.length === 0) {
    console.log("No restaurants found.");
    return;
  }

  console.log(`Loaded ${restaurants.length} restaurants.`);

  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    totalPlaces: restaurants.length,
    totalFlagged: 0,
    missingName: 0,
    missingParish: 0,
    missingArea: 0,
    missingAddress: 0,
    missingCoordinates: 0,
    duplicatesByName: 0,
    suspiciousCrossParish: 0,
    byParish: {},
    flagged: []
  };

  const flagged: FlaggedRecord[] = [];

  // ── Per-record checks ──────────────────────────────────────────

  for (const r of restaurants) {
    const name = String(r.name || "").trim();
    const parish = String(r.parish || "").trim();
    const area = String(r.area || r.city || "").trim();
    const address = String(r.address || "").trim();
    const slug = String(r.slug || "");
    const lat = r.latitude || r.lat;
    const lng = r.longitude || r.lng;

    // Count by parish
    const np = normalizeParish(parish) || "unknown";
    report.byParish[np] = (report.byParish[np] || 0) + 1;

    // Missing name
    if (!name) {
      report.missingName++;
      flagged.push({ name: "(empty)", slug, parish, area, address, reason: "Missing name", suggestedAction: "Add name or mark rejected" });
    }

    // Missing parish
    if (!parish) {
      report.missingParish++;
      flagged.push({ name: name || "(empty)", slug, parish, area, address, reason: "Missing parish", suggestedAction: "Add parish from address/coordinates" });
    }

    // Missing area
    if (!area) {
      report.missingArea++;
    }

    // Missing address
    if (!address) {
      report.missingAddress++;
    }

    // Missing coordinates
    if (!lat || !lng) {
      report.missingCoordinates++;
    }

    // Generic low-quality names
    const genericNames = ["restaurant", "cook shop", "bar", "lounge", "market place", "kitchen", "cafe"];
    if (genericNames.includes(name.toLowerCase()) && !address) {
      flagged.push({ name, slug, parish, area, address, reason: "Generic name with no address", suggestedAction: "Verify manually or mark needs_review" });
    }

    // Parish validation
    if (parish) {
      const result = validatePlaceParish({ parish, area, address, name });
      if (!result.valid) {
        report.suspiciousCrossParish++;
        flagged.push({
          name: name || "(empty)",
          slug,
          parish,
          area,
          address,
          reason: result.reasons.join("; "),
          suggestedAction: result.suspectedParish ? `Correct parish to ${result.suspectedParish}` : "Verify manually"
        });
      }
    }
  }

  // ── Duplicate names across parishes ──────────────────────────────

  const nameMap = new Map<string, string[]>();
  for (const r of restaurants) {
    const key = String(r.name || "").trim().toLowerCase();
    if (!key) continue;
    const existing = nameMap.get(key) || [];
    existing.push(String(r.parish || ""));
    nameMap.set(key, existing);
  }

  for (const [name, parishes] of nameMap) {
    const uniqueParishes = [...new Set(parishes.filter(Boolean))];
    if (uniqueParishes.length > 1) {
      report.duplicatesByName++;
      flagged.push({
        name,
        slug: "(multiple)",
        parish: uniqueParishes.join(", "),
        area: "",
        address: "",
        reason: `Duplicate name across ${uniqueParishes.length} parishes: ${uniqueParishes.join(", ")}`,
        suggestedAction: "Verify which is correct; merge or differentiate"
      });
    }
  }

  report.totalFlagged = flagged.length;
  report.flagged = flagged;

  // ── Write report ─────────────────────────────────────────────────

  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const md = generateMarkdown(report);
  const outPath = path.join(reportsDir, "place-location-audit.md");
  fs.writeFileSync(outPath, md);

  console.log(`\nReport written to ${outPath}`);
  console.log(`Total: ${report.totalPlaces} | Flagged: ${report.totalFlagged}`);
  console.log(`Missing name: ${report.missingName} | Missing parish: ${report.missingParish}`);
  console.log(`Missing area: ${report.missingArea} | Missing address: ${report.missingAddress}`);
  console.log(`Missing coords: ${report.missingCoordinates} | Duplicates: ${report.duplicatesByName}`);
  console.log(`Suspicious cross-parish: ${report.suspiciousCrossParish}`);
}

// ── Markdown generator ──────────────────────────────────────────────

function generateMarkdown(r: AuditReport): string {
  let md = `# Place Location Audit Report\n\n`;
  md += `**Generated**: ${r.timestamp}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Count |\n`;
  md += `|--------|-------|\n`;
  md += `| Total places | ${r.totalPlaces} |\n`;
  md += `| Total flagged | ${r.totalFlagged} |\n`;
  md += `| Missing name | ${r.missingName} |\n`;
  md += `| Missing parish | ${r.missingParish} |\n`;
  md += `| Missing area | ${r.missingArea} |\n`;
  md += `| Missing address | ${r.missingAddress} |\n`;
  md += `| Missing coordinates | ${r.missingCoordinates} |\n`;
  md += `| Duplicates by name | ${r.duplicatesByName} |\n`;
  md += `| Suspicious cross-parish | ${r.suspiciousCrossParish} |\n\n`;

  md += `## By Parish\n\n`;
  md += `| Parish | Count |\n`;
  md += `|--------|-------|\n`;
  for (const [parish, count] of Object.entries(r.byParish).sort((a, b) => b[1] - a[1])) {
    md += `| ${parish} | ${count} |\n`;
  }

  md += `\n## Flagged Records\n\n`;
  if (r.flagged.length === 0) {
    md += `No flagged records.\n`;
  } else {
    md += `| # | Name | Slug | Parish | Area | Address | Reason | Suggested Action |\n`;
    md += `|---|------|------|--------|------|---------|--------|------------------|\n`;
    r.flagged.forEach((f, i) => {
      md += `| ${i + 1} | ${f.name} | ${f.slug} | ${f.parish} | ${f.area} | ${f.address} | ${f.reason} | ${f.suggestedAction} |\n`;
    });
  }

  return md;
}

main().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
