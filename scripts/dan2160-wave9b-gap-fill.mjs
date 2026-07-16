/**
 * DAN-2160 Wave 9b — Gap fill for remaining pages
 *
 * Targets:
 *  A. amazon-vs-best-buy (pos 18, vol 110): +3 KDs (8→11)
 *  B. virat-kohli-vs-sachin-tendulkar (pos 15): +2 inlinks from cricket/sports pages
 *  C. ww1-vs-ww2 (pos 20, vol 2900): +2 inlinks from history pages
 *
 * Run: node scripts/dan2160-wave9b-gap-fill.mjs [--dry]
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const log = (...a) => console.log(...a);

async function addKeyDiffs(slug, newDiffs) {
  const comp = await prisma.comparison.findUnique({
    where: { slug },
    select: { keyDifferences: true },
  });
  if (!comp) { log(`  ! skip (not found): ${slug}`); return 0; }
  const existing = Array.isArray(comp.keyDifferences) ? comp.keyDifferences : [];
  const existingLabels = new Set(existing.map((d) => d.label?.toLowerCase()));
  const toAdd = newDiffs.filter((d) => !existingLabels.has(d.label?.toLowerCase()));
  if (toAdd.length === 0) { log(`  skip (all KDs exist): ${slug}`); return 0; }
  const merged = [...existing, ...toAdd];
  if (!DRY) {
    await prisma.comparison.update({
      where: { slug },
      data: { keyDifferences: merged, lastRefreshedAt: new Date() },
    });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} KDs ${existing.length}→${merged.length} (+${toAdd.length}): ${slug}`);
  return toAdd.length;
}

async function addInternalLink(fromSlug, toSlug, anchorText) {
  const fromPath = `/compare/${fromSlug}`;
  const toPath = `/compare/${toSlug}`;
  const exists = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (exists) { log(`  skip (link exists): ${fromPath} → ${toPath}`); return; }
  if (!DRY) {
    await prisma.internalLink.create({
      data: { fromPath, toPath, anchorText, linkType: "related", position: "inline", score: 1.1 },
    });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} inlink: ${fromPath} → ${toPath} ("${anchorText}")`);
}

async function main() {
  log("\n── 9b: amazon-vs-best-buy +3 KDs (8→11) ──────────────────────");
  await addKeyDiffs("amazon-vs-best-buy", [
    {
      label: "Physical Store Access",
      winner: "b",
      entityAValue: "No physical stores; online/delivery only",
      entityBValue: "900+ US stores with Geek Squad on-site support",
      description: "Best Buy's physical presence lets customers see products before buying and get same-day Geek Squad installation or repair — impossible with Amazon.",
    },
    {
      label: "Price Match Policy",
      winner: "b",
      entityAValue: "No price match program",
      entityBValue: "Matches competitors' prices (including Amazon) on identical in-store items",
      description: "Best Buy's price match guarantee means shoppers can often get Amazon pricing in-store, negating Amazon's price edge for electronics.",
    },
    {
      label: "Open-Box Deals Availability",
      winner: "b",
      entityAValue: "Returns resold through Amazon Warehouse at variable discounts",
      entityBValue: "Certified Open-Box program with standardized condition grades and warranty",
      description: "Best Buy's Open-Box program is more structured than Amazon Warehouse, offering store-verified condition grades and remaining manufacturer warranty on returned items.",
    },
  ]);

  log("\n── 9b: virat-kohli inlinks from sports pages ──────────────────");
  // Find cricket/sports pages in DB
  const sportPages = await prisma.comparison.findMany({
    where: {
      OR: [
        { slug: { contains: 'messi' } },
        { slug: { contains: 'ronaldo' } },
        { slug: { contains: 'lebron' } },
        { slug: { contains: 'federer' } },
        { slug: { contains: 'michael-jordan' } },
        { slug: { contains: 'nfl' } },
        { slug: { contains: 'cricket' } },
        { slug: { contains: 'india-vs' } },
        { slug: { contains: 'basketball' } },
      ],
      status: 'published',
      NOT: { slug: 'virat-kohli-vs-sachin-tendulkar' }
    },
    select: { slug: true },
    take: 10,
  });
  log(`  Found ${sportPages.length} sports pages for inlinks`);

  // Add inlinks to virat-kohli from sports comparison pages
  if (sportPages.length > 0) {
    await addInternalLink(sportPages[0].slug, "virat-kohli-vs-sachin-tendulkar", "Virat Kohli vs Sachin Tendulkar: cricket's greatest batsmen compared");
    if (sportPages.length > 1) {
      await addInternalLink(sportPages[1].slug, "virat-kohli-vs-sachin-tendulkar", "Kohli vs Sachin Tendulkar stats and career comparison");
    }
  }
  
  // Also try kobe/lebron page to link to kohli (both are GOAT debates)
  await addInternalLink("kobe-bryant-vs-lebron-james", "virat-kohli-vs-sachin-tendulkar", "Virat Kohli vs Sachin Tendulkar: another all-time GOAT debate in cricket");

  log("\n── 9b: ww1-vs-ww2 +2 inlinks from military/history pages ─────");
  // Add strategic inlinks to ww1-vs-ww2 from related pages
  await addInternalLink("f-16-vs-f-15", "ww1-vs-ww2", "WW1 vs WW2: history of modern aerial warfare origins");
  await addInternalLink("us-army-vs-marines", "ww1-vs-ww2", "WW1 vs WW2: the wars that defined modern US military doctrine");

  log("\n── Summary ─────────────────────────────────────────────────────");
  log(DRY ? "DRY RUN complete — no DB changes made." : "Wave 9b complete — all changes saved to production DB.");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e.message); process.exit(1); });
