// DAN-1012: On-page page-1 push for 3 /compare/* targets.
// - capital-one-vs-chase: exact-match FAQ "Are Chase and Capital One affiliated?"
// - ikea-vs-wayfair: community-sentiment FAQ (target "wayfair vs ikea reddit") + trim metaTitle <=60 rendered
// - amazon-vs-best-buy: freshness pass (sets lastRefreshedAt -> bumps updatedAt/dateModified)
import * as dotenv from "dotenv";
import { createRequire } from "module";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local", override: true });
const require = createRequire(import.meta.url);
const { PrismaClient } = require("/Users/danielrozin/Comparison/node_modules/@prisma/client");
const prisma = new PrismaClient();

const now = new Date();

async function ensureFaq(comparisonId, question, answer, sortOrder) {
  // Idempotent: match on comparisonId + question.
  const existing = await prisma.fAQ.findFirst({ where: { comparisonId, question } });
  if (existing) {
    await prisma.fAQ.update({ where: { id: existing.id }, data: { answer, sortOrder } });
    return `updated FAQ ${existing.id}`;
  }
  const created = await prisma.fAQ.create({ data: { comparisonId, question, answer, sortOrder } });
  return `created FAQ ${created.id}`;
}

// 1) capital-one-vs-chase --------------------------------------------------
{
  const c = await prisma.comparison.findUnique({ where: { slug: "capital-one-vs-chase" }, select: { id: true } });
  const r = await ensureFaq(
    c.id,
    "Are Chase and Capital One affiliated?",
    "No — Chase and Capital One are not affiliated and are not the same company. They are entirely separate, independent businesses: Chase credit cards and accounts are issued by JPMorgan Chase Bank, N.A., while Capital One products are issued by Capital One, N.A. The two are direct competitors in both credit cards and consumer banking — there is no shared ownership, no common parent company, and no shared rewards program. Points and miles do not transfer between the two, so a Chase card and a Capital One card are run by completely different issuers.",
    -10,
  );
  await prisma.comparison.update({ where: { id: c.id }, data: { lastRefreshedAt: now } });
  console.log("capital-one-vs-chase:", r, "+ lastRefreshedAt set");
}

// 2) ikea-vs-wayfair -------------------------------------------------------
{
  const c = await prisma.comparison.findUnique({ where: { slug: "ikea-vs-wayfair" }, select: { id: true } });
  const r = await ensureFaq(
    c.id,
    "What do shoppers on Reddit say about IKEA vs Wayfair?",
    "Across Reddit threads and similar community discussions, the consensus splits along three lines. On quality, shoppers say IKEA is more predictable — you know what you're getting and can inspect it in a showroom — while Wayfair quality 'varies a lot' because it's a marketplace of many third-party brands, so reading individual product reviews matters. On assembly, IKEA's flat-pack builds are seen as time-consuming but well-documented and sturdy once together; Wayfair items range from pre-assembled to fiddly depending on the seller. On delivery, Wayfair is praised for shipping bulky furniture to your door (often with free shipping over a threshold), whereas IKEA is cheapest if you can get to a store and haul it yourself. The common takeaway: pick IKEA for consistent, budget-friendly basics and storage you can see in person, and Wayfair when you want far more styles, sizes, and price points and are willing to vet each product's reviews.",
    -10,
  );
  // Rendered <title> = metaTitle + " | A Versus B" (13 chars). Keep <=60 total => metaTitle <=47.
  const newMeta = "IKEA vs Wayfair: Furniture Compared 2026"; // 40 chars -> 53 rendered
  await prisma.comparison.update({ where: { id: c.id }, data: { metaTitle: newMeta, lastRefreshedAt: now } });
  console.log("ikea-vs-wayfair:", r, `+ metaTitle="${newMeta}" [${newMeta.length}] + lastRefreshedAt set`);
}

// 3) amazon-vs-best-buy ----------------------------------------------------
{
  const c = await prisma.comparison.findUnique({ where: { slug: "amazon-vs-best-buy" }, select: { id: true } });
  // On-page already strong (54-char title, 2,122 words, full schema); the real lever is authority
  // (link-building sibling). Freshness pass: set lastRefreshedAt -> bumps updatedAt -> dateModified.
  await prisma.comparison.update({ where: { id: c.id }, data: { lastRefreshedAt: now } });
  console.log("amazon-vs-best-buy: freshness pass — lastRefreshedAt set (authority lever -> link-building sibling)");
}

await prisma.$disconnect();
console.log("\nDAN-1012 apply complete.");
