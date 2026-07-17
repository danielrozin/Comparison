import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL.replace(/-pooler(\.[^/]+\.aws\.neon\.tech)/, '$1').trim();
}
if (process.env.DATABASE_URL) process.env.DATABASE_URL = process.env.DATABASE_URL.trim();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogArticle.findMany({
    where: { slug: { contains: 'menu' } },
    select: { slug: true },
    orderBy: { slug: 'asc' }
  });
  console.log('Menu blog posts:', posts.length);
  for (const p of posts) {
    console.log(' ', p.slug);
  }
  const total = await prisma.blogArticle.count();
  console.log('Total blog articles:', total);
  await prisma.$disconnect();
}

main().catch(console.error);
