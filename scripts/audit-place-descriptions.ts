/**
 * Description Audit Script
 *
 * Detects records where the description text mentions location terms that
 * conflict with the stored parish field — the signature of import contamination
 * (e.g., a Kingston record imported via a "Portland restaurants" query).
 *
 * Usage: npx tsx scripts/audit-place-descriptions.ts
 * Output: reports/place-description-audit.md
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { supabaseUrl, supabaseAnonKey } from "../src/lib/supabase/config";
import { normalizeParish } from "../src/lib/location-validation";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Location keyword map ────────────────────────────────────────────
// Maps each canonical parish key to distinctive terms that, if found in a
// description, strongly suggest the description was written for that parish.

const PARISH_KEYWORDS: Record<string, string[]> = {
  kingston: [
    "kingston", "new kingston", "halfway tree", "half way tree", "liguanea",
    "barbican", "constant spring", "downtown kingston", "harbour view", "port royal",
    "hope road", "waterloo", "red hills", "manor park", "papine", "mona"
  ],
  portland: [
    "portland", "port antonio", "boston beach", "boston bay", "fairy hill",
    "san san", "drapers", "long bay", "manchioneal", "buff bay", "hope bay",
    "frenchman's cove", "frenchmans cove", "blue lagoon", "rio grande",
    "winifred beach", "winnifred beach", "st. margaret's bay", "st margarets bay",
    "rio grande valley"
  ],
  "st james": [
    "st. james", "st james", "saint james",
    "montego bay", "mobay", "ironshore", "freeport", "hip strip",
    "gloucester avenue", "rose hall"
  ],
  "st ann": [
    "st. ann", "st ann", "saint ann",
    "ocho rios", "runaway bay", "discovery bay", "st ann's bay", "priory", "mammee bay"
  ],
  westmoreland: [
    "westmoreland",
    "negril", "savanna-la-mar", "sav-la-mar", "whitehouse"
  ],
  "st elizabeth": [
    "st. elizabeth", "st elizabeth", "saint elizabeth",
    "black river", "treasure beach", "santa cruz", "junction", "malvern"
  ],
  manchester: [
    "manchester",
    "mandeville", "christiana", "spur tree"
  ],
  "st catherine": [
    "st. catherine", "st catherine", "saint catherine",
    "spanish town", "portmore", "old harbour", "linstead", "bog walk"
  ],
  clarendon: [
    "clarendon",
    "may pen", "lionel town", "chapelton"
  ],
  "st mary": [
    "st. mary", "st mary", "saint mary",
    "port maria", "oracabessa", "annotto bay", "highgate"
  ],
  hanover: [
    "hanover",
    "lucea", "green island", "sandy bay"
  ],
  trelawny: [
    "trelawny",
    "falmouth", "duncans", "rio bueno"
  ],
  "st thomas": [
    "st. thomas", "st thomas", "saint thomas",
    "morant bay", "yallahs", "lyssons", "seaforth"
  ]
};

type ConflictRecord = {
  id: string;
  slug: string;
  name: string;
  storedParish: string;
  normalizedParish: string;
  description: string;
  conflictingKeywords: Array<{ keyword: string; suggestsParish: string }>;
};

type DescriptionAuditReport = {
  timestamp: string;
  totalRecords: number;
  recordsWithDescription: number;
  recordsWithConflict: number;
  conflicts: ConflictRecord[];
};

// ── Detect keywords from other parishes in description ──────────────

function detectDescriptionConflicts(
  description: string,
  storedParish: string
): Array<{ keyword: string; suggestsParish: string }> {
  if (!description) return [];
  const desc = description.toLowerCase();
  const normalStored = normalizeParish(storedParish);
  const conflicts: Array<{ keyword: string; suggestsParish: string }> = [];

  for (const [parish, keywords] of Object.entries(PARISH_KEYWORDS)) {
    if (parish === normalStored) continue; // skip own parish
    for (const kw of keywords) {
      // word-boundary match: keyword must appear as a standalone word/phrase
      const re = new RegExp(`\\b${kw.replace(/[-']/g, ".?").replace(/\s+/g, "\\s+")}\\b`, "i");
      if (re.test(desc)) {
        conflicts.push({ keyword: kw, suggestsParish: parish });
        break; // one conflict per parish is enough
      }
    }
  }

  return conflicts;
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("Loading all restaurant records from Supabase...");

  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("id, slug, name, parish, area, address, description")
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

  const report: DescriptionAuditReport = {
    timestamp: new Date().toISOString(),
    totalRecords: restaurants.length,
    recordsWithDescription: 0,
    recordsWithConflict: 0,
    conflicts: []
  };

  for (const r of restaurants) {
    const description = String(r.description || "").trim();
    if (!description || description === "The food speaks for itself.") continue;

    report.recordsWithDescription++;

    const conflicts = detectDescriptionConflicts(description, r.parish || "");
    if (conflicts.length === 0) continue;

    report.recordsWithConflict++;
    report.conflicts.push({
      id: r.id,
      slug: r.slug,
      name: r.name,
      storedParish: r.parish || "(empty)",
      normalizedParish: normalizeParish(r.parish) || "(unknown)",
      description,
      conflictingKeywords: conflicts
    });
  }

  // ── Write report ─────────────────────────────────────────────────

  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const md = generateMarkdown(report);
  const outPath = path.join(reportsDir, "place-description-audit.md");
  fs.writeFileSync(outPath, md);

  console.log(`\nReport written to ${outPath}`);
  console.log(`Total records: ${report.totalRecords}`);
  console.log(`With description: ${report.recordsWithDescription}`);
  console.log(`With conflicts: ${report.recordsWithConflict}`);

  if (report.conflicts.length > 0) {
    console.log("\n── Conflicted records ──────────────────────────────────");
    for (const c of report.conflicts) {
      const kws = c.conflictingKeywords.map(k => `"${k.keyword}" (${k.suggestsParish})`).join(", ");
      console.log(`  ${c.slug} | parish=${c.storedParish} | conflicts: ${kws}`);
    }
  }
}

// ── Markdown generator ──────────────────────────────────────────────

function generateMarkdown(r: DescriptionAuditReport): string {
  let md = `# Place Description Audit Report\n\n`;
  md += `**Generated**: ${r.timestamp}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Count |\n`;
  md += `|--------|-------|\n`;
  md += `| Total records | ${r.totalRecords} |\n`;
  md += `| Records with description | ${r.recordsWithDescription} |\n`;
  md += `| Records with parish/description conflict | ${r.recordsWithConflict} |\n\n`;

  if (r.conflicts.length === 0) {
    md += `No description conflicts detected.\n`;
    return md;
  }

  md += `## Conflicted Records\n\n`;
  md += `These records have a \`description\` that mentions location terms belonging to a different parish than the stored \`parish\` field. `;
  md += `This is the signature of import contamination — the description was written for a different location than where the restaurant actually is.\n\n`;
  md += `**Fix**: Update descriptions to be parish-neutral or reflect the correct stored parish. Never change \`parish\` based on the description — \`parish\` is source of truth.\n\n`;

  for (const c of r.conflicts) {
    md += `### ${c.name} (\`${c.slug}\`)\n\n`;
    md += `- **Stored parish**: ${c.storedParish} (normalized: \`${c.normalizedParish}\`)\n`;
    md += `- **Conflicting keywords**:\n`;
    for (const k of c.conflictingKeywords) {
      md += `  - \`"${k.keyword}"\` → suggests parish \`${k.suggestsParish}\`\n`;
    }
    md += `- **Current description**:\n\n`;
    md += `  > ${c.description.replace(/\n/g, " ")}\n\n`;
  }

  return md;
}

main().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
