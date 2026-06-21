// DAN-79 Priority 4/5: finalized top-20 high-CPC "X vs Y" comparison keyword target list.
// Credential-free: reads keyword_opportunities (DataForSEO-sourced) + comparisons from the live DB.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SITE = "https://www.aversusb.net";

function score(k) {
  const vol = k.searchVolume || 0;
  const cpc = k.cpc || 0;
  const diff = k.difficulty ?? 50;
  const comp = k.competition ?? 0.5;
  // Same formula family as CLAUDE.md opportunityScore, CPC-weighted for PPC intent.
  return (
    (vol > 0 ? Math.log10(vol) * 20 : 0) +
    (100 - diff) * 0.3 +
    Math.min(cpc * 5, 25) +
    (1 - comp) * 15
  );
}

const all = await prisma.keywordOpportunity.findMany({
  where: {
    cpc: { gt: 1 },                 // CPC > $1 per mandate
    searchVolume: { gt: 100 },      // meaningful demand
    queryPattern: { in: ["vs", "compare", "difference", "alternative"] },
  },
});

// existing landing pages
const pages = await prisma.comparison.findMany({ select: { slug: true } });
const slugSet = new Set(pages.map((p) => p.slug));
const slugify = (a, b) =>
  [a, b]
    .map((s) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    .join("-vs-");

const ranked = all
  .map((k) => {
    const slug = k.entityA && k.entityB ? slugify(k.entityA, k.entityB) : null;
    const hasPage = (slug && slugSet.has(slug)) || k.hasExistingPage;
    return { ...k, _slug: slug, _hasPage: hasPage, _score: score(k) };
  })
  // prioritize keywords that already have a landing page (instant launch), then by PPC score
  .sort((a, b) => (a._hasPage !== b._hasPage ? (a._hasPage ? -1 : 1) : b._score - a._score));

const top = ranked.slice(0, 20);

console.log(`POOL: ${all.length} comparison keywords with CPC>$1 & vol>100 | landing pages in DB: ${slugSet.size}`);
console.log(`WITH PAGE in top20: ${top.filter((k) => k._hasPage).length}\n`);
console.log("rank\tCPC\tvol\tdiff\tscore\tpage\tkeyword\tLP");
top.forEach((k, i) => {
  const lp = k._hasPage && k._slug ? `${SITE}/compare/${k._slug}` : "(needs page)";
  console.log(
    `${i + 1}\t$${(k.cpc || 0).toFixed(2)}\t${k.searchVolume}\t${Math.round(k.difficulty ?? 0)}\t${k._score.toFixed(1)}\t${k._hasPage ? "Y" : "-"}\t${k.keyword}\t${lp}`
  );
});

await prisma.$disconnect();
