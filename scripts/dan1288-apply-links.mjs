import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv"; import path from "path"; import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const cp = s => `/compare/${s}`;
const PLAN = [
  // target, anchor, [source slugs]
  ["/compare/ps5-pro-vs-xbox-series-x-performance-comparison-2026","ps5 pro vs xbox series x fps",
    ["ps5-vs-xbox-series-x","ps5-vs-ps5-pro","nintendo-switch-vs-ps5","ps5-vs-nintendo-switch-2","xbox-series-x-vs-nintendo-switch-2"]],
  ["/compare/paramount-vs-peacock","peacock versus paramount",
    ["netflix-vs-peacock-comparison-2026","hulu-vs-peacock","apple-tv-plus-vs-peacock","disney-plus-vs-peacock","disney-plus-vs-paramount-plus"]],
  ["/compare/bose-vs-jbl","jbl versus bose",
    ["jbl-vs-marshall","bose-vs-sonos","bose-quietcomfort-vs-sony-wh-1000xm5"]],
  ["/compare/bloomberg-vs-the-wall-street-journal","bloomberg vs wsj",
    ["bloomberg-vs-reuters"]],
  ["/blog/mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider","audi competitors luxury cars 2026",
    ["audi-vs-bmw","audi-a8-vs-bmw-7-series","audi-q5-vs-mercedes-glc","audi-q7-vs-mercedes-gle","mercedes-e-class-vs-audi-a6"]],
];
let created=0, skipped=0;
for (const [toPath, anchor, sources] of PLAN) {
  console.log(`\n### -> ${toPath}  (anchor "${anchor}")`);
  for (const src of sources) {
    const fromPath = cp(src);
    if (fromPath === toPath) { console.log(`   self-skip ${src}`); continue; }
    const exists = await prisma.internalLink.findFirst({ where:{ fromPath, toPath }});
    if (exists) { console.log(`   exists  ${fromPath}`); skipped++; continue; }
    console.log(`   + ${fromPath}`);
    if (!DRY) await prisma.internalLink.create({ data:{ fromPath, toPath, anchorText:anchor, linkType:"related", position:"inline", score:1.4 }});
    created++;
  }
}
console.log(`\n${DRY?"DRY ":""}created=${created} skipped=${skipped}`);
await prisma.$disconnect();
