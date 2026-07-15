import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();

const TARGETS = [
  [11, "soundcloud vs youtube music",           "youtube-music-vs-soundcloud"],
  [13, "are chase and capital one affiliated",  "capital-one-vs-chase"],
  [13, "wayfair vs ikea reddit",                "ikea-vs-wayfair"],
  [15, "virat kohli vs sachin tendulkar stats", "virat-kohli-vs-sachin-tendulkar"],
  [16, "expedia or kayak",                      "expedia-vs-kayak"],
  [16, "kobe/lebron comparison",                "kobe-bryant-vs-lebron-james"],
  [18, "best buy vs amazon",                    "amazon-vs-best-buy"],
  [18, "j-16 vs f-15",                          "f-16-vs-f-15"],
  [18, "motorola vs galaxy",                    "samsung-galaxy-vs-motorola"],
  [19, "farmers vs state farm home insurance",  "farmers-insurance-vs-state-farm"],
  [19, "macbook pro vs air 2026",               "macbook-air-vs-macbook-pro-difference-2026-specs"],
  [20, "ww1 vs ww2",                            "ww1-vs-ww2"],
  [20, "ps5 pro vs xbox series x",             "ps5-pro-vs-xbox-series-x-performance-comparison-2026"],
  [20, "paramount plus vs peacock",             "paramount-plus-vs-peacock"],
  [13, "macbook air m3 vs m4",                  "macbook-air-m3-vs-macbook-air-m4"],
];

const slugs = TARGETS.map(t => t[2]);
const rows = await prisma.comparison.findMany({
  where: { slug: { in: slugs } },
  select: { slug: true, metaTitle: true },
});
const bySlug = Object.fromEntries(rows.map(r => [r.slug, r]));

console.log("\n=== Pages missing metaTitle ===\n");
let missingCount = 0;
for (const [pos, query, slug] of TARGETS) {
  const r = bySlug[slug];
  if (!r?.metaTitle) {
    console.log(`pos${pos} MISSING metaTitle: ${slug}`);
    console.log(`  query: "${query}"`);
    missingCount++;
  }
}
if (missingCount === 0) console.log("All pages have metaTitle set ✅");

console.log("\n=== Pages WITH metaTitle ===\n");
for (const [pos, query, slug] of TARGETS) {
  const r = bySlug[slug];
  if (r?.metaTitle) console.log(`pos${pos} ✅ ${r.metaTitle}`);
}

await prisma.$disconnect();
