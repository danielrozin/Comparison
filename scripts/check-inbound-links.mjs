import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();

const targets = [
  { slug: 'youtube-music-vs-soundcloud', pos: 11, toPath: '/compare/youtube-music-vs-soundcloud' },
  { slug: 'capital-one-vs-chase', pos: 13, toPath: '/compare/capital-one-vs-chase' },
  { slug: 'ikea-vs-wayfair', pos: 13, toPath: '/compare/ikea-vs-wayfair' },
  { slug: 'macbook-air-m3-vs-macbook-air-m4', pos: 13, toPath: '/compare/macbook-air-m3-vs-macbook-air-m4' },
  { slug: 'virat-kohli-vs-sachin-tendulkar', pos: 15, toPath: '/compare/virat-kohli-vs-sachin-tendulkar' },
  { slug: 'expedia-vs-kayak', pos: 16, toPath: '/compare/expedia-vs-kayak' },
  { slug: 'kobe-bryant-vs-lebron-james', pos: 16, toPath: '/compare/kobe-bryant-vs-lebron-james' },
  { slug: 'ww1-vs-ww2', pos: 20, toPath: '/compare/ww1-vs-ww2' },
  { slug: 'amazon-vs-best-buy', pos: 18, toPath: '/compare/amazon-vs-best-buy' },
  { slug: 'farmers-insurance-vs-state-farm', pos: 19, toPath: '/compare/farmers-insurance-vs-state-farm' },
];

console.log('Inbound link counts for striking-distance pages:');
for (const t of targets) {
  const count = await prisma.internalLink.count({ where: { toPath: t.toPath } });
  console.log(`  pos${t.pos}  ${count.toString().padStart(3)} links → ${t.slug}`);
}

await prisma.$disconnect();
