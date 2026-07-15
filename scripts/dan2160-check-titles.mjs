import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

const TARGETS = [
  // pos, vol, query, slug
  [11, 30,  "soundcloud vs youtube music",           "youtube-music-vs-soundcloud"],
  [13, 40,  "are chase and capital one affiliated",  "capital-one-vs-chase"],
  [13, 40,  "wayfair vs ikea reddit",                "ikea-vs-wayfair"],
  [15, 30,  "virat kohli vs sachin tendulkar stats", "virat-kohli-vs-sachin-tendulkar"],
  [16, 50,  "expedia or kayak",                      "expedia-vs-kayak"],
  [16, 30,  "kobe/lebron comparison",                "kobe-bryant-vs-lebron-james"],
  [18, 110, "best buy vs amazon",                    "amazon-vs-best-buy"],
  [19, 110, "farmers vs state farm home insurance",  "farmers-insurance-vs-state-farm"],
  [19, 140, "macbook pro vs air 2026",               "macbook-air-vs-macbook-pro-difference-2026-specs"],
  [20, 2900,"ww1 vs ww2",                            "ww1-vs-ww2"],
  [20, 90,  "ps5 pro vs xbox series x",             "ps5-pro-vs-xbox-series-x-performance-comparison-2026"],
  [20, 30,  "paramount plus vs peacock",             "paramount-plus-vs-peacock"],
  [13, 20,  "macbook air m3 vs m4",                  "macbook-air-m3-vs-macbook-air-m4"],
];

const slugs = TARGETS.map(t => t[3]);

const rows = await prisma.comparison.findMany({
  where: { slug: { in: slugs } },
  select: { slug: true, title: true, contentScore: true, viewCount: true, updatedAt: true, _count: { select: { faqs: true } } },
});

const bySlug = Object.fromEntries(rows.map(r => [r.slug, r]));

console.log("\n=== Striking-Distance Pages: Title + Stats ===\n");
for (const [pos, vol, query, slug] of TARGETS) {
  const r = bySlug[slug];
  if (!r) { console.log(`MISSING: ${slug}`); continue; }
  console.log(`pos${pos} vol${vol} | ${query}`);
  console.log(`  title: "${r.title}"`);
  console.log(`  score=${r.contentScore} faqs=${r._count.faqs} views=${r.viewCount}`);
  console.log(`  updated: ${r.updatedAt.toISOString().slice(0,10)}`);
  console.log();
}

await prisma.$disconnect();
