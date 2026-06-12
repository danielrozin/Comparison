import * as dotenv from "dotenv";
import { createRequire } from "module";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local", override: true });
const require = createRequire(import.meta.url);
const { PrismaClient } = require("/Users/danielrozin/Comparison/node_modules/@prisma/client");
const prisma = new PrismaClient();

const SLUGS = ["capital-one-vs-chase", "ikea-vs-wayfair", "amazon-vs-best-buy"];
for (const slug of SLUGS) {
  const c = await prisma.comparison.findUnique({
    where: { slug },
    include: { faqs: { orderBy: { sortOrder: "asc" } } },
  });
  if (!c) { console.log(`\n### ${slug}: NOT FOUND`); continue; }
  console.log(`\n### ${slug} (id=${c.id}) status=${c.status}`);
  console.log(`title: ${JSON.stringify(c.title)} [${(c.title||"").length}]`);
  console.log(`metaTitle: ${JSON.stringify(c.metaTitle)} [${(c.metaTitle||"").length}]`);
  console.log(`metaDescription: ${JSON.stringify(c.metaDescription)} [${(c.metaDescription||"").length}]`);
  console.log(`shortAnswer: ${JSON.stringify((c.shortAnswer||"").slice(0,180))}`);
  console.log(`lastRefreshedAt: ${c.lastRefreshedAt} | updatedAt: ${c.updatedAt}`);
  console.log(`FAQs (${c.faqs.length}):`);
  for (const f of c.faqs) console.log(`  - [${f.sortOrder}] ${f.question}`);
}
await prisma.$disconnect();
