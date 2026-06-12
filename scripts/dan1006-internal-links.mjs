// DAN-1006: curated internal-linking buildout — sculpt PageRank into the 3
// page-1 push targets from high-authority, topically-relevant sibling pages.
// Lever: InternalLink records (Signal 2 in internal-linking-engine, weight
// 40*score). score>=1.3 beats entity-overlap (50) so the curated link surfaces
// high in each source page's "Related Comparisons" module.
import * as dotenv from "dotenv";
import { createRequire } from "module";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local", override: true });
const require = createRequire(import.meta.url);
const { PrismaClient } = require("/Users/danielrozin/Comparison/node_modules/@prisma/client");
const prisma = new PrismaClient();

// target -> { anchor, score, sources[] }  (sources are source-page slugs)
const PLAN = {
  // Highest-volume target (vol 110) + analyst says weight the most internal links here.
  "amazon-vs-best-buy": {
    anchor: "Amazon vs Best Buy",
    score: 1.6,
    sources: [
      "iphone-17-vs-samsung-s26", "ps5-vs-xbox-series-x", "apple-vs-samsung",
      "nvidia-vs-amd", "amazon-vs-walmart", "costco-vs-sams-club",
      "target-vs-walmart", "macbook-air-vs-macbook-pro",
    ],
  },
  "capital-one-vs-chase": {
    anchor: "Capital One vs Chase",
    score: 1.4,
    sources: [
      "chase-vs-capital-one", "capital-one-venture-vs-chase-sapphire-preferred",
      "visa-vs-mastercard", "chase-vs-ally-bank", "cash-app-vs-chime", "chime-vs-sofi",
    ],
  },
  "ikea-vs-wayfair": {
    anchor: "IKEA vs Wayfair",
    score: 1.4,
    sources: [
      "amazon-vs-walmart", "home-depot-vs-lowes", "target-vs-walmart",
      "best-buy-vs-walmart", "home-depot-vs-lowe-s", "costco-vs-walmart",
    ],
  },
};

let created = 0, skipped = 0, missing = 0;
for (const [target, cfg] of Object.entries(PLAN)) {
  const toPath = `/compare/${target}`;
  for (const src of cfg.sources) {
    // verify source exists & is published
    const exists = await prisma.comparison.findFirst({ where: { slug: src, status: "published" }, select: { id: true } });
    if (!exists) { console.log(`  MISSING source ${src} -> skip`); missing++; continue; }
    const fromPath = `/compare/${src}`;
    const dup = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
    if (dup) { skipped++; continue; }
    await prisma.internalLink.create({
      data: { fromPath, toPath, anchorText: cfg.anchor, linkType: "related", position: "module", score: cfg.score },
    });
    created++;
    console.log(`  + ${fromPath} -> ${toPath} ("${cfg.anchor}", score ${cfg.score})`);
  }
}
console.log(`\nDone. created=${created} skipped(existing)=${skipped} missing=${missing}`);

// Verify inbound counts per target.
for (const target of Object.keys(PLAN)) {
  const n = await prisma.internalLink.count({ where: { toPath: `/compare/${target}` } });
  console.log(`inbound curated links -> ${target}: ${n}`);
}
await prisma.$disconnect();
