// DAN-859 — Apr 2026 cohort meta CTR pass.
//
// Brings ~80 live (non-archived) Apr-cohort blog articles into spec:
//   metaTitle:        50–60 chars
//   metaDescription:  140–165 chars
//
// Idempotent: each run skips rows already inside spec.
//
// Clusters (per DAN-859):
//   - mercedes  — "Best Alternatives to Mercedes-Benz..." (~43 live, no redirects)
//   - gdp       — "US vs China GDP..." (~32 live)
//   - macbook   — survivors of DAN-451 consolidation (3 live)
//   - other     — 2 fighter-jet articles + any future singletons
//
// Per-slug variant selection (templateIdx = hash(slug) % N) avoids identical
// meta tags across cluster pages — cannibalization is handled by the
// June consolidation calendar; this pass is cosmetic length-compliance only.

import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

const T_MIN = 50, T_MAX = 60;
const D_MIN = 140, D_MAX = 165;

const inSpec = (t, d) =>
  (t ?? "").length >= T_MIN && (t ?? "").length <= T_MAX &&
  (d ?? "").length >= D_MIN && (d ?? "").length <= D_MAX;

const hashIdx = (slug, n) =>
  Number(BigInt("0x" + createHash("sha1").update(slug).digest("hex").slice(0, 8))) % n;

const checkLen = (s, min, max, label, slug) => {
  if (s.length < min || s.length > max) {
    throw new Error(
      `${label} for ${slug} is ${s.length} chars (need ${min}-${max}): "${s}"`,
    );
  }
  return s;
};

// ============ Mercedes cluster ============
const MERC_TITLES = [
  "Best Mercedes-Benz Alternatives 2026: BMW, Audi, Lexus",     // 54
  "Top Mercedes-Benz Alternatives in 2026: Luxury Car Guide",   // 56
  "Mercedes-Benz Alternatives 2026: Sedans, SUVs Compared",     // 54
  "Best Alternatives to Mercedes-Benz 2026: BMW, Audi, Volvo",  // 58
  "Mercedes Alternatives 2026: Top Luxury Brands Compared",     // 54
  "Best Mercedes-Benz Rivals 2026: Luxury Brand Comparison",    // 56
  "Top Luxury Alternatives to Mercedes-Benz in 2026 Guide",     // 54
  "Mercedes-Benz Competitors 2026: BMW, Audi, Tesla, Lexus",    // 55
];

const MERC_DESCS = [
  "Compare BMW, Audi, Lexus, Volvo and Tesla — the best Mercedes-Benz alternatives of 2026. Specs, pricing, ownership costs, and a verdict for each.", // 145
  "Top Mercedes-Benz alternatives for 2026: BMW 5 Series, Audi A6, Lexus ES, Volvo S90, Tesla Model S. Side-by-side specs, prices, pros and cons.",      // 144
  "Looking past Mercedes-Benz in 2026? Compare BMW, Audi, Lexus, Genesis, Porsche and Tesla on price, reliability, tech, and resale value side by side.", // 150
  "BMW, Audi, Lexus, Genesis, Volvo, Tesla — the strongest Mercedes-Benz alternatives in 2026. Compare luxury sedans and SUVs on specs, price and value.", // 151
  "Best Mercedes-Benz alternatives 2026: full comparison of BMW, Audi, Lexus, Genesis and Tesla. Specs, MSRP, warranty and total cost of ownership.",     // 147
  "2026 buyers guide to Mercedes-Benz alternatives. BMW, Audi, Lexus, Genesis, Volvo, Tesla compared on price, performance, interior, tech and resale.",  // 148
];

// ============ GDP cluster ============
const GDP_TITLES = [
  "US vs China GDP 2026: $31.8T vs $20.7T Side-by-Side",        // 53
  "US vs China GDP Comparison 2026: $31.8T vs $20.7T Faceoff",  // 58
  "US vs China GDP 2026: Growth, Per Capita and Forecasts",     // 55
  "US vs China GDP 2026: Economic Power Compared Side by Side", // 58
  "US vs China GDP 2026: Size, Growth and Per Capita Compared", // 58
  "US vs China GDP 2026: Economy Size, Growth and Outlook",     // 55
  "US vs China GDP 2026 Comparison: Size, Growth, Outlook",     // 55
  "US vs China GDP 2026: Two Largest Economies Compared",       // 53
];

const GDP_DESCS = [
  "US GDP hits $31.8T in 2026 vs China's $20.7T. Compare growth, per capita income, sectors and global influence of the world's two largest economies.", // 148
  "Compare US vs China GDP in 2026: $31.8 trillion vs $20.7 trillion. Growth rates, per capita figures, key sectors and 2030 forecasts side by side.",  // 147
  "US vs China GDP 2026: $31.8T vs $20.7T. Side-by-side breakdown of growth, per capita income, manufacturing share, services and 2030 projections.",   // 145
  "US vs China GDP comparison 2026 — $31.8T vs $20.7T. See growth rates, per capita income, sector mix and the projected economic outlook through 2030.", // 151
  "2026 US vs China GDP face-off: $31.8T vs $20.7T. Compare growth, productivity, per capita income, debt levels and forecasts for the next five years.", // 152
  "Full US vs China GDP comparison for 2026. $31.8T vs $20.7T economies — growth, per capita, sector composition and 2030 outlook explained simply.",   // 145
];

// ============ MacBook cluster (custom per slug) ============
const MACBOOK_FIXES = {
  "macbook-air-weight-comparison-2025-2026-which-model-is-right-for-you": {
    metaTitle: "MacBook Air Weight 2026: 13-inch vs 15-inch Compared", // 53
    metaDescription:
      "MacBook Air 13\" weighs 2.7 lbs (1.22 kg); the 15\" Air is 3.3 lbs (1.50 kg). Compare specs, battery, screen and price to pick the right Air for 2026.", // 154
  },
  "macbook-pro-thickness-2024-2026-latest-models-compared": {
    metaTitle: "MacBook Pro Thickness 2024-2026: 14 vs 16 Compared",   // 51
    metaDescription:
      "MacBook Pro 14\" measures 0.61\" thick; the 16\" Pro is 0.66\" thick. Compare 2024–2026 dimensions, weight, ports and design across every M-series model.", // 151
  },
  "macbook-pro-weight-2025-2026-complete-specs-comparison-guide": {
    metaTitle: "MacBook Weight 2026: Air, Pro 14 and Pro 16 Compared", // 53
    metaDescription:
      "MacBook Air 13\" 2.7 lbs, Pro 14\" 3.5 lbs, Pro 16\" 4.7 lbs. Full 2026 weight table for every M5, M5 Pro, M5 Max model with a buyer's guide and FAQ.", // 153
  },
};

// ============ Other (fighter jets etc.) ============
const OTHER_FIXES = {
  "most-advanced-fighter-jets-in-2026-a-comprehensive-ranking": {
    metaTitle: "Most Advanced Fighter Jets 2026: Top 10 World Ranking", // 51
    metaDescription:
      "F-35, F-22, J-20, Su-57, Rafale and more — the most advanced fighter jets of 2026 ranked by stealth, sensors, speed, weapons and combat readiness.", // 149
  },
  "most-advanced-fighter-jets-in-2026-top-5-global-air-superiority-leaders": {
    metaTitle: "Top 5 Most Advanced Fighter Jets 2026: Air Superiority", // 53
    metaDescription:
      "F-22 Raptor, F-35 Lightning II, J-20, Su-57 and Rafale — the top 5 most advanced fighter jets of 2026 compared on stealth, range and weapons load.", // 148
  },
};

const classify = (slug) => {
  if (MACBOOK_FIXES[slug]) return "macbook-pinned";
  if (OTHER_FIXES[slug]) return "other-pinned";
  if (slug.includes("mercedes")) return "mercedes";
  if (
    slug.includes("china-gdp") ||
    slug.includes("us-vs-china") ||
    slug.includes("china-vs-us")
  ) return "gdp";
  return "unknown";
};

const proposeMeta = (slug) => {
  const cat = classify(slug);
  if (cat === "macbook-pinned") return MACBOOK_FIXES[slug];
  if (cat === "other-pinned") return OTHER_FIXES[slug];
  if (cat === "mercedes") {
    return {
      metaTitle: MERC_TITLES[hashIdx(slug, MERC_TITLES.length)],
      metaDescription: MERC_DESCS[hashIdx(slug + "d", MERC_DESCS.length)],
    };
  }
  if (cat === "gdp") {
    return {
      metaTitle: GDP_TITLES[hashIdx(slug, GDP_TITLES.length)],
      metaDescription: GDP_DESCS[hashIdx(slug + "d", GDP_DESCS.length)],
    };
  }
  throw new Error(`Unclassified slug: ${slug}`);
};

// ============ Run ============
const dryRun = process.argv.includes("--dry-run");

const rows = await prisma.blogArticle.findMany({
  where: {
    publishedAt: { gte: new Date("2026-04-01"), lt: new Date("2026-05-07") },
    status: { not: "archived" },
  },
  select: { id: true, slug: true, metaTitle: true, metaDescription: true },
  orderBy: { slug: "asc" },
});

let updated = 0, skipped = 0, errors = 0;
const errorDetails = [];

for (const r of rows) {
  if (inSpec(r.metaTitle, r.metaDescription)) {
    skipped++;
    continue;
  }
  try {
    const { metaTitle, metaDescription } = proposeMeta(r.slug);
    checkLen(metaTitle, T_MIN, T_MAX, "metaTitle", r.slug);
    checkLen(metaDescription, D_MIN, D_MAX, "metaDescription", r.slug);
    if (dryRun) {
      console.log(`[dry] ${r.slug}\n      T:${metaTitle.length} ${metaTitle}\n      D:${metaDescription.length} ${metaDescription}`);
    } else {
      await prisma.blogArticle.update({
        where: { id: r.id },
        data: { metaTitle, metaDescription },
      });
    }
    updated++;
  } catch (e) {
    errors++;
    errorDetails.push({ slug: r.slug, err: e.message });
  }
}

console.log(JSON.stringify({
  dryRun,
  totalRows: rows.length,
  updated,
  skipped,
  errors,
  errorDetails,
}, null, 2));

await prisma.$disconnect();
process.exit(errors ? 1 : 0);
