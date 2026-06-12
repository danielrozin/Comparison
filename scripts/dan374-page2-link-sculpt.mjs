// DAN-374 Week 2-3 lever: sculpt curated, TOPICALLY-RELEVANT inbound InternalLinks
// into the two page-2 push targets that were under-linked / mis-linked, to move
// them page 2 -> page 1. score 1.5 beats entity-overlap (50) so the curated link
// surfaces top of each source page's Related-Comparisons module.
import * as dotenv from "dotenv";
import { createRequire } from "module";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local", override: true });
const require = createRequire(import.meta.url);
const { PrismaClient } = require("/Users/danielrozin/Comparison/node_modules/@prisma/client");
const prisma = new PrismaClient();

// 1) Remove OFF-TOPIC inbound links to farmers (tech/gaming pages linking an insurance page)
const OFFTOPIC_FARMERS = ["iphone-17-vs-samsung-s26","ps5-vs-xbox-series-x","mac-vs-windows","apple-vs-samsung","android-vs-ios"]
  .map(s=>`/compare/${s}`);
const del = await prisma.internalLink.deleteMany({
  where: { toPath: "/compare/farmers-insurance-vs-state-farm", fromPath: { in: OFFTOPIC_FARMERS } },
});
console.log(`removed off-topic farmers inbound: ${del.count}`);

const PLAN = {
  // ranking page-2 URL per DataForSEO (rank #19, vol 110) — concentrate equity on the variant that actually ranks
  "macbook-air-vs-macbook-pro-difference-2026-specs": {
    anchor: "MacBook Air vs MacBook Pro (2026)", score: 1.5,
    sources: ["dell-xps-15-vs-macbook-pro","dell-xps-13-vs-macbook-air","chromebook-vs-macbook",
      "macbook-vs-surface","ipad-pro-vs-macbook-air","apple-vs-dell","mac-vs-windows","macbook-pro-14-vs-macbook-pro-16"],
  },
  // farmers (rank #19, vol 110) — relevant insurance siblings sharing State Farm / Farmers entities
  "farmers-insurance-vs-state-farm": {
    anchor: "Farmers Insurance vs State Farm", score: 1.5,
    sources: ["geico-vs-state-farm","allstate-vs-state-farm","nationwide-vs-state-farm","state-farm-vs-progressive",
      "allstate-vs-farmers","geico-vs-progressive","metlife-vs-state-farm","lemonade-vs-state-farm"],
  },
};

let created=0, skipped=0, missing=0;
for (const [target,cfg] of Object.entries(PLAN)) {
  const toPath = `/compare/${target}`;
  for (const src of cfg.sources) {
    const exists = await prisma.comparison.findFirst({ where:{ slug:src, status:"published" }, select:{id:true} });
    if (!exists) { console.log(`  MISSING source ${src}`); missing++; continue; }
    const fromPath = `/compare/${src}`;
    const dup = await prisma.internalLink.findFirst({ where:{ fromPath, toPath } });
    if (dup) { skipped++; continue; }
    await prisma.internalLink.create({ data:{ fromPath, toPath, anchorText:cfg.anchor, linkType:"related", position:"module", score:cfg.score } });
    created++; console.log(`  + ${fromPath} -> ${toPath}`);
  }
  const n = await prisma.internalLink.count({ where:{ toPath } });
  console.log(`inbound curated -> ${target}: ${n}`);
}
console.log(`\nDone. created=${created} skipped=${skipped} missing=${missing}`);
await prisma.$disconnect();
