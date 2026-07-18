import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL.replace(/-pooler(\.[^/]+\.aws\.neon\.tech)/, "$1").trim();
}
if (process.env.DATABASE_URL) process.env.DATABASE_URL = process.env.DATABASE_URL.trim();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const candidates = [
    'golden-corral-menu', 'applebees-menu', 'ihop-menu', 'dennys-menu', 
    'cracker-barrel-menu', 'red-robin-menu', 'buffalo-wild-wings-menu', 
    'five-guys-menu', 'wingstop-menu', 'bojangles-menu', 'steak-n-shake-menu',
    'swig-menu', 'cava-menu', 'jimmy-johns-menu', 'firehouse-subs-menu',
    'little-caesars-menu', 'del-taco-menu', 'cheddars-menu', 'bjs-menu',
    'freddys-menu', 'scooters-coffee-menu', 'tropical-smoothie-menu',
    'burger-king-breakfast-menu', 'chick-fil-a-breakfast-menu'
  ];
  const existing = await prisma.blogArticle.findMany({ where: { slug: { in: candidates } }, select: { slug: true } });
  console.log('Already in DB:', JSON.stringify(existing.map(e => e.slug)));
  const notInDB = candidates.filter(c => !existing.find(e => e.slug === c));
  console.log('NOT in DB:', JSON.stringify(notInDB));
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
