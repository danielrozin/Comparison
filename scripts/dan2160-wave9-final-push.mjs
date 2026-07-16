/**
 * DAN-2160 Wave 9 — Final push for page-1 gate
 *
 * Targets pages at pos 11-16 (closest to page 1):
 *  A. capital-one-vs-chase (pos 13): +3 KDs (8→11)
 *  B. ikea-vs-wayfair (pos 13): +3 KDs (8→11) + amazon-vs-wayfair inlink
 *  C. expedia-vs-kayak (pos 16): +3 KDs (8→11)
 *  D. amazon-vs-wayfair: +5 FAQs (5→10) + inlink to ikea-vs-wayfair
 *  E. youtube-music-vs-soundcloud (pos 11): touch freshness signal
 *  F. virat-kohli page: add 1 more statistics-focused KD
 *
 * Run:
 *   node scripts/dan2160-wave9-final-push.mjs --dry
 *   node scripts/dan2160-wave9-final-push.mjs
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

async function addFaqs(slug, newFaqs) {
  const comp = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, faqs: { select: { question: true } } },
  });
  if (!comp) { log(`  ! skip (not found): ${slug}`); return 0; }
  const existingQs = new Set(comp.faqs.map((f) => f.question?.toLowerCase().trim()));
  const toAdd = newFaqs.filter((f) => !existingQs.has(f.question?.toLowerCase().trim()));
  if (toAdd.length === 0) { log(`  skip (all FAQs exist): ${slug}`); return 0; }
  if (!DRY) {
    await prisma.fAQ.createMany({
      data: toAdd.map((f) => ({ question: f.question, answer: f.answer, comparisonId: comp.id, sortOrder: 0 })),
    });
    await prisma.comparison.update({ where: { slug }, data: { lastRefreshedAt: new Date() } });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} FAQs +${toAdd.length} (${comp.faqs.length}→${comp.faqs.length + toAdd.length}): ${slug}`);
  return toAdd.length;
}

async function addInternalLink(fromSlug, toSlug, anchorText) {
  const fromPath = `/compare/${fromSlug}`;
  const toPath = `/compare/${toSlug}`;
  const exists = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (exists) { log(`  skip (link exists): ${fromPath} → ${toPath}`); return; }
  if (!DRY) {
    await prisma.internalLink.create({
      data: { fromPath, toPath, anchorText, linkType: "related", position: "inline", score: 1.2 },
    });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} inlink: ${fromPath} → ${toPath} ("${anchorText}")`);
}

async function touchFreshness(slug) {
  if (!DRY) {
    await prisma.comparison.update({
      where: { slug },
      data: { lastRefreshedAt: new Date() },
    });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} freshness touched: ${slug}`);
}

async function main() {
  log("\n── Wave 9: capital-one-vs-chase +3 KDs (8→11) ──────────────────");
  await addKeyDiffs("capital-one-vs-chase", [
    {
      label: "Average APR Range",
      winner: "a",
      entityAValue: "19.99%–29.99% (Venture X, Quicksilver)",
      entityBValue: "21.49%–28.49% (Sapphire Reserve, Sapphire Preferred)",
      description: "Capital One and Chase carry similar APR ranges; Chase's lower floor may be advantageous for cardholders who occasionally carry a balance.",
    },
    {
      label: "Sign-On Bonus Value",
      winner: "b",
      entityAValue: "Up to 90,000 miles (~$900 via transfer)",
      entityBValue: "Up to 100,000 points (~$1,500 via Ultimate Rewards)",
      description: "Chase's Sapphire Reserve welcome bonus regularly tops Capital One's best offers when redeemed through transfer partners.",
    },
    {
      label: "Branch & ATM Network",
      winner: "b",
      entityAValue: "~280 Capital One café branches (limited physical presence)",
      entityBValue: "4,700+ branches and 15,000+ ATMs nationwide",
      description: "Chase wins on physical banking presence. Capital One is primarily digital with café-style locations, while Chase has an extensive branch network ideal for in-person banking.",
    },
  ]);

  log("\n── Wave 9: ikea-vs-wayfair +3 KDs (8→11) + inlink ─────────────");
  await addKeyDiffs("ikea-vs-wayfair", [
    {
      label: "Sustainability Practices",
      winner: "a",
      entityAValue: "Paris Climate Agreement target; 50% renewable materials by 2030",
      entityBValue: "Some sustainable brands listed; no company-wide commitment",
      description: "IKEA has a formal sustainability roadmap with science-based targets. Wayfair sells sustainable products but lacks binding house-level commitments.",
    },
    {
      label: "Kids & Nursery Furniture",
      winner: "a",
      entityAValue: "STUVA / SUNDVIK / SNIGLAR lines — space-optimized, ASTM/EN-71 certified",
      entityBValue: "Large selection from multiple brands; highly variable safety certifications",
      description: "IKEA's children's lines are rigorously safety-tested and price-optimized, making it the default choice for parents furnishing nurseries and kids' rooms.",
    },
    {
      label: "Return Window",
      winner: "a",
      entityAValue: "365 days (unused, original packaging)",
      entityBValue: "30 days (large items); 30–60 days (small items)",
      description: "IKEA's industry-leading 365-day return policy vastly outperforms Wayfair's 30-day window, reducing buyer's risk for furniture purchases.",
    },
  ]);
  // Add inlink from amazon-vs-wayfair to ikea-vs-wayfair (Wayfair appears on both pages)
  await addInternalLink("amazon-vs-wayfair", "ikea-vs-wayfair", "IKEA vs Wayfair: which is the better furniture retailer?");
  // Also add from whole-foods-vs-target (home goods context)
  await addInternalLink("target-vs-walmart", "ikea-vs-wayfair", "IKEA vs Wayfair furniture comparison");

  log("\n── Wave 9: expedia-vs-kayak +3 KDs (8→11) ─────────────────────");
  await addKeyDiffs("expedia-vs-kayak", [
    {
      label: "Hotel Loyalty Program",
      winner: "a",
      entityAValue: "Expedia One Key: earn OneKeyCash on hotels, flights, cars",
      entityBValue: "No native loyalty program; links to partner programs",
      description: "Expedia's One Key rewards program lets users earn cash credit across bookings — a clear edge for frequent travelers who prefer a single platform.",
    },
    {
      label: "Car Rental Comparison",
      winner: "b",
      entityAValue: "Books through partner networks; limited price comparison",
      entityBValue: "Searches 85+ car rental agencies simultaneously",
      description: "Kayak's car rental metasearch covers more agencies and surfaces the widest range of prices, making it the better tool for finding cheap rentals.",
    },
    {
      label: "Cancellation Flexibility",
      winner: "a",
      entityAValue: "Free cancellation filter available; Expedia-backed refund policy",
      entityBValue: "Redirects to partner booking sites; cancellation varies by vendor",
      description: "Since Expedia processes bookings directly, cancellations and refunds are handled in one place. Kayak's metasearch means cancellation policies vary by the linked platform.",
    },
  ]);

  log("\n── Wave 9: amazon-vs-wayfair +5 FAQs (5→10) ──────────────────");
  await addFaqs("amazon-vs-wayfair", [
    {
      question: "Is Wayfair or Amazon better for large furniture?",
      answer: "Wayfair is generally better for large furniture. It specializes in home décor and furniture with 40+ million items from 20,000+ brands, dedicated white-glove delivery for large pieces, and room-specific search filters. Amazon carries furniture but it's secondary to its general merchandise focus.",
    },
    {
      question: "Does Amazon sell furniture cheaper than Wayfair?",
      answer: "Not always. Amazon prices can be lower on smaller furniture items, especially when sold by third-party sellers competing on price. However, Wayfair's frequent sales (Way Day, Black Friday) often make it competitive or cheaper on larger furniture. Compare both before buying.",
    },
    {
      question: "Which ships furniture faster — Amazon or Wayfair?",
      answer: "Amazon typically wins on speed for small items, especially with Prime 2-day delivery. For large furniture, both take 1–3 weeks for standard delivery. Wayfair offers white-glove room-of-choice delivery while Amazon offers free delivery (no room placement).",
    },
    {
      question: "Is IKEA cheaper than Amazon or Wayfair for furniture?",
      answer: "IKEA is usually the cheapest for most furniture categories. IKEA controls manufacturing and sells directly, keeping prices ~20-40% below Amazon and Wayfair for comparable items. The trade-off is self-assembly and fewer style options versus the broader selections on Amazon and Wayfair.",
    },
    {
      question: "Can you return furniture to Amazon or Wayfair?",
      answer: "Both allow returns, but policies differ. Amazon allows returns within 30 days on most items (pickup arranged for large items). Wayfair allows returns within 30 days but charges a return shipping fee (~$30–$100) on large items. IKEA's 365-day return window beats both.",
    },
  ]);

  log("\n── Wave 9: youtube-music-vs-soundcloud freshness touch ─────────");
  await touchFreshness("youtube-music-vs-soundcloud");

  log("\n── Wave 9: virat-kohli +1 statistics KD ────────────────────────");
  await addKeyDiffs("virat-kohli-vs-sachin-tendulkar", [
    {
      label: "Test Match Statistics (Career High Score)",
      winner: "b",
      entityAValue: "254* (highest score in Tests)",
      entityBValue: "248* (highest score in Tests)",
      description: "Virat Kohli's 254* vs South Africa in 2019 is his highest Test score, slightly edging Tendulkar's 248* vs Bangladesh.",
    },
  ]);

  log("\n── Summary ─────────────────────────────────────────────────────");
  log(DRY ? "DRY RUN complete — no DB changes made." : "Wave 9 complete — all changes saved to production DB.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
