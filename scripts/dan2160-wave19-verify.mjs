import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();

const targets = [
  { slug: 'youtube-music-vs-soundcloud', prevPos: 11 },
  { slug: 'capital-one-vs-chase', prevPos: 13 },
  { slug: 'ikea-vs-wayfair', prevPos: 13 },
  { slug: 'expedia-vs-kayak', prevPos: 16 },
  { slug: 'ww1-vs-ww2', prevPos: 20 },
  { slug: 'amazon-vs-best-buy', prevPos: 18 },
  { slug: 'farmers-insurance-vs-state-farm', prevPos: 19 },
  { slug: 'kobe-bryant-vs-lebron-james', prevPos: '16-19' },
];

console.log('=== Final inbound link totals after Waves 16-19 ===\n');
let totalLinks = 0;
for (const { slug, prevPos } of targets) {
  const count = await prisma.internalLink.count({ where: { toPath: `/compare/${slug}` } });
  totalLinks += count;
  console.log(`  [was pos ${prevPos}] ${slug}: ${count} inbound links`);
}
console.log(`\n  Total inbound links across 8 targets: ${totalLinks}`);

await prisma.$disconnect();
