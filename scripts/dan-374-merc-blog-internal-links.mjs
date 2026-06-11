// DAN-374 — Internal-linking enrichment for the published Mercedes-Benz
// alternatives blog post (ranks #16 for "mercedes-benz competitors", vol 320).
//
// This is a content-gated (NOT recovery-gated) on-page win identified in the
// 2026-06-11 recovery snapshot: the page had only 4 internal links, and 2 of
// the 4 pointed to MISSING (404) comparison slugs:
//   /compare/audi-vs-mercedes-benz  -> MISSING
//   /compare/lexus-vs-mercedes-benz -> MISSING
// (Matches the documented gotcha: audi/lexus only exist at model level or
//  without the -benz suffix. Always probe before linking.)
//
// Fix:
//   1) Replace the 2 dead links with verified-PUBLISHED equivalents.
//   2) Add contextual inline links in each brand section (BMW/Audi/Genesis/
//      Volvo/Lexus) to verified-published /compare pages.
//   3) Add one blog->blog link (EV cross-shop) for topical clustering.
//   4) Rebuild relatedComparisonSlugs from verified-published slugs only.
//
// Every target slug below was probed status="published" on 2026-06-11 before
// this script was written. Idempotent: re-running is a no-op once applied.

import { config } from "dotenv";
config({ path: ".env.local", override: true });
import { PrismaClient } from "@prisma/client";

const SLUG = "mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider";

const REPLACEMENTS = [
  // BMW section
  [
    "**Consider:** The BMW X5 and X7 SUVs offer robust alternatives to Mercedes GLE and GLS models.",
    "**Consider:** The BMW X5 and X7 SUVs offer robust alternatives to Mercedes GLE and GLS models. See the full breakdowns in [BMW X5 vs Mercedes GLE](/compare/bmw-x5-vs-mercedes-gle) and [BMW 7-Series vs Mercedes S-Class](/compare/bmw-7-series-vs-mercedes-s-class).",
  ],
  // Audi section
  [
    "**Popular models:** The Audi A6 (S-Class competitor) and Q7 (GLE alternative) are particularly strong offerings.",
    "**Popular models:** The Audi A6 (S-Class competitor) and Q7 (GLE alternative) are particularly strong offerings. Compare them directly in [Mercedes E-Class vs Audi A6](/compare/mercedes-e-class-vs-audi-a6) and [Audi Q5 vs Mercedes GLC](/compare/audi-q5-vs-mercedes-glc).",
  ],
  // Genesis section
  [
    "**Top models:** The Genesis G90 sedan and GV70 SUV directly challenge Mercedes S-Class and GLE equivalents.",
    "**Top models:** The Genesis G90 sedan and GV70 SUV directly challenge Mercedes S-Class and GLE equivalents. See [Genesis vs Mercedes-Benz](/compare/genesis-vs-mercedes-benz) and [Genesis GV90 vs Mercedes GLE](/compare/genesis-gv90-vs-mercedes-gle) for the head-to-head.",
  ],
  // Volvo section
  [
    "**Consider:** The Volvo S90 sedan and XC90 SUV both received critical acclaim for their design and features.",
    "**Consider:** The Volvo S90 sedan and XC90 SUV both received critical acclaim for their design and features. Compare them in [Volvo S90 vs Mercedes S-Class](/compare/volvo-s90-vs-mercedes-s-class) and [Volvo EX90 vs Mercedes EQE](/compare/volvo-ex90-vs-mercedes-eqe).",
  ],
  // Lexus section
  [
    "**Top models:** The Lexus LS (large sedan) and LX (full-size SUV) offer comprehensive Mercedes alternatives.",
    "**Top models:** The Lexus LS (large sedan) and LX (full-size SUV) offer comprehensive Mercedes alternatives. See [Lexus vs Mercedes-Benz](/compare/lexus-vs-mercedes) and [Lexus IS vs Mercedes C-Class](/compare/lexus-is-vs-mercedes-c-class) for detailed matchups.",
  ],
  // Electric & Hybrid Options -> blog->blog link
  [
    "- Volvo focusing on electrification strategy\n",
    "- Volvo focusing on electrification strategy\n\nFor a wider EV cross-shop beyond the German luxury set, see our [best electric vehicles of 2026](/blog/best-electric-vehicles-2026-tesla-vs-rivian-vs-lucid-vs-bmw-compared) guide, which compares Tesla, Rivian, Lucid, and BMW head-to-head.\n",
  ],
  // Related Comparisons block — replace dead links + expand to verified set
  [
    "Explore these detailed comparisons for specific matchups:\n- [BMW vs Mercedes-Benz](/compare/bmw-vs-mercedes-benz)\n- [Audi vs Mercedes-Benz](/compare/audi-vs-mercedes-benz)\n- [Lexus vs Mercedes-Benz](/compare/lexus-vs-mercedes-benz)\n- [Genesis vs BMW](/compare/genesis-vs-bmw)",
    "Explore these detailed comparisons for specific matchups:\n- [BMW vs Mercedes-Benz](/compare/bmw-vs-mercedes-benz)\n- [Mercedes E-Class vs Audi A6](/compare/mercedes-e-class-vs-audi-a6)\n- [Lexus vs Mercedes-Benz](/compare/lexus-vs-mercedes)\n- [Genesis vs Mercedes-Benz](/compare/genesis-vs-mercedes-benz)\n- [Genesis vs BMW](/compare/genesis-vs-bmw)\n- [Volvo S90 vs Mercedes S-Class](/compare/volvo-s90-vs-mercedes-s-class)\n- [BMW 7-Series vs Mercedes S-Class](/compare/bmw-7-series-vs-mercedes-s-class)\n- [Tesla vs Mercedes-Benz](/compare/tesla-vs-mercedes)",
  ],
  // FAQ EV answer — add inline links
  [
    "**BMW i7** (most traditional luxury experience) are the three strongest EV alternatives to the Mercedes EQ lineup.",
    "**BMW i7** (most traditional luxury experience) are the three strongest EV alternatives to the Mercedes EQ lineup. Compare the [BMW i7 vs Mercedes EQS](/compare/bmw-i7-vs-mercedes-eqs) and [Tesla vs Mercedes-Benz](/compare/tesla-vs-mercedes) directly.",
  ],
];

const NEW_RELATED = [
  "bmw-vs-mercedes-benz",
  "mercedes-e-class-vs-audi-a6",
  "lexus-vs-mercedes",
  "genesis-vs-mercedes-benz",
  "genesis-vs-bmw",
  "volvo-s90-vs-mercedes-s-class",
  "bmw-x5-vs-mercedes-gle",
  "tesla-vs-mercedes",
];

const p = new PrismaClient();

const a = await p.blogArticle.findUnique({ where: { slug: SLUG } });
if (!a) {
  console.error("Article not found:", SLUG);
  process.exit(1);
}

const SENTINEL = "/compare/bmw-x5-vs-mercedes-gle";
if (a.content.includes(SENTINEL)) {
  console.log("Already enriched (sentinel present) — no-op.");
  process.exit(0);
}

let content = a.content;
const misses = [];
for (const [oldStr, newStr] of REPLACEMENTS) {
  if (!content.includes(oldStr)) {
    misses.push(oldStr.slice(0, 60));
    continue;
  }
  content = content.replace(oldStr, newStr);
}

if (misses.length) {
  console.error("ABORT — these expected anchors were NOT found (content drifted):");
  for (const m of misses) console.error("  -", m);
  process.exit(1);
}

const before = (a.content.match(/\]\((\/[^)]+)\)/g) || []).length;
const after = (content.match(/\]\((\/[^)]+)\)/g) || []).length;

await p.blogArticle.update({
  where: { slug: SLUG },
  data: { content, relatedComparisonSlugs: NEW_RELATED },
});

console.log("Updated:", SLUG);
console.log(`Internal links: ${before} -> ${after}`);
console.log("relatedComparisonSlugs:", JSON.stringify(NEW_RELATED));
console.log("Dead links removed: /compare/audi-vs-mercedes-benz, /compare/lexus-vs-mercedes-benz");
process.exit(0);
