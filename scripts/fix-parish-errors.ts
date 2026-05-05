/**
 * Apply parish corrections from the audit report.
 * Only updates existing columns (parish, area).
 *
 * Usage: npx tsx scripts/fix-parish-errors.ts
 */

import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../src/lib/supabase/config";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// slug → { parish, area? }
const CORRECTIONS: Record<string, { parish: string; area?: string }> = {
  // ── Kingston addresses → Kingston ──
  "22-jerk-plus": { parish: "Kingston", area: "Barbican" },
  "andys-restaurant-jerk-and-pastry": { parish: "Kingston", area: "Chisholm Ave" },
  "andys-jerk-spot": { parish: "Kingston", area: "Mannings Hill" },
  "beachview-restaurant-and-bar": { parish: "Kingston", area: "Port Royal" },
  "breadfruit-hut": { parish: "Kingston", area: "Goodwood Terrace" },
  "cafe-dolce": { parish: "Kingston", area: "Constant Spring" },
  "chef-kiss-ja": { parish: "Kingston", area: "Constant Spring" },
  "clubhouse-brewery": { parish: "Kingston", area: "Constant Spring" },
  "coded-frolic-e-sport-bar-and-jerk-lounge": { parish: "Kingston", area: "South Ave" },
  "dragon-garden-restaurant-chinese": { parish: "Kingston", area: "Constant Spring" },
  "hamilton-restaurant-and-jerk-centre": { parish: "Kingston", area: "Burlington Ave" },
  "idcove-catering": { parish: "Kingston", area: "Kings House Rd" },
  "jamaica-liquor-warehouse": { parish: "Kingston", area: "Lindsay Crescent" },
  "jerk-box": { parish: "Kingston", area: "Hope Rd" },
  "jojos-jerk-pit": { parish: "Kingston", area: "Waterloo Rd" },
  "king-janga-seafood-lounge": { parish: "Kingston", area: "Lindsay Crescent" },
  "kingston-jerk": { parish: "Kingston", area: "Chelsea Ave" },
  "macau-gaming-lounge-and-bar": { parish: "Kingston", area: "Lindsay Crescent" },
  "market-place": { parish: "Kingston", area: "Constant Spring" },
  "ming-cuisine-chinese": { parish: "Kingston", area: "Constant Spring" },
  "molynes-road-jerk-centre": { parish: "Kingston", area: "Gilmour Dr" },
  "quick-chick": { parish: "Kingston", area: "Grants Pen" },
  "rainforest-seafoods": { parish: "Kingston", area: "Kingston" },
  "shaggy-jerk-chicken": { parish: "Kingston", area: "Red Hills" },
  "stylz-jerk-chicken": { parish: "Kingston", area: "White Hall Ave" },
  "susies": { parish: "Kingston", area: "South Ave" },
  "sweetwood-jerk-joint": { parish: "Kingston", area: "Knutsford Blvd" },
  "triple-tz-eatery": { parish: "Kingston", area: "Annette Cres" },
  "tummy-quest": { parish: "Kingston", area: "Grants Pen" },
  "usain-bolts-tracks-and-records": { parish: "Kingston", area: "Constant Spring" },
  "whitneys-kitchen-limited": { parish: "Kingston", area: "Ballater Ave" },
  "willys-thatch-roof-and-cool-out-spot-ltd": { parish: "Kingston", area: "Molynes Rd" },
  "world-famous-jerk-food-company": { parish: "Kingston", area: "Graham Heights" },
  "yard-jerk-shop": { parish: "Kingston", area: "Red Hills" },

  // ── Montego Bay addresses → St. James ──
  "ena-jamaica-restaurant": { parish: "St. James", area: "De Lisser Dr" },
  "house-boat-grill-restaurant": { parish: "St. James", area: "Alice Eldemire Dr" },
  "lees-pots-montego-bay": { parish: "St. James", area: "Ramble Hill" },

  // ── Negril addresses → Westmoreland ──
  "margaritaville-negril-hanover": { parish: "Westmoreland", area: "Negril" },
  "office-of-nature": { parish: "Westmoreland", area: "Negril" },
  "office-of-the-nature-hanover": { parish: "Westmoreland", area: "Negril" },

  // ── Other clear corrections ──
  "far-out-fish-hut-ltd": { parish: "St. James", area: "Montego Bay" },
  "murray-s-fish-and-jerk-hut-manchester": { parish: "Clarendon", area: "Clarendon Park" },
  "peppers-jerk-center": { parish: "Trelawny", area: "Falmouth" },
  "tony-s-seafood-bar-and-grill": { parish: "St. Catherine", area: "Portmore" },
};

// ── False positives (street names, not parishes) — no change needed ──
const FALSE_POSITIVES = [
  "di-hip-strip-ultra-lounge",   // 25A Folly Rd, Port Antonio — Portland correct
  "fjs-smokehouse",              // Rosehall Dist, Linstead — St. Catherine correct
  "herbal-kitchen",              // Manchester Ave, May Pen — Clarendon correct
  "sharons-cook-shop",           // Hanover St, Kingston — Kingston correct
  "star-grill-clarendon",        // Manchester Ave, May Pen — Clarendon correct
  "street-mixovibes",            // Spanish Town Rd, Kingston — Kingston correct
];

// ── Genuinely ambiguous — no change, just log ──
const NEEDS_REVIEW = [
  "st-elizabeth-and-westmoreland-border-food-stop",
  "waves-beach",
];

async function main() {
  let corrected = 0;
  let errors = 0;

  for (const [slug, fix] of Object.entries(CORRECTIONS)) {
    const update: Record<string, any> = { parish: fix.parish };
    if (fix.area) update.area = fix.area;

    const { error } = await supabase
      .from("restaurants")
      .update(update)
      .eq("slug", slug);

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
      errors++;
    } else {
      console.log(`  ✓ ${slug}: parish → ${fix.parish}${fix.area ? `, area → ${fix.area}` : ""}`);
      corrected++;
    }
  }

  console.log(`\nFalse positives (no change needed): ${FALSE_POSITIVES.length}`);
  for (const s of FALSE_POSITIVES) console.log(`  - ${s}`);

  console.log(`\nNeeds manual review: ${NEEDS_REVIEW.length}`);
  for (const s of NEEDS_REVIEW) console.log(`  - ${s}`);

  console.log(`\nDone. Corrected: ${corrected} | Skipped (false positive): ${FALSE_POSITIVES.length} | Needs review: ${NEEDS_REVIEW.length} | Errors: ${errors}`);
}

main().catch((err) => {
  console.error("Fix script failed:", err);
  process.exit(1);
});
