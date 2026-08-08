/**
 * Simulate affiliate link generation over every published comparison and
 * report which entities get amazon / brand / generic CTAs. Read-only audit
 * for the "link must sell the actual product" rule.
 * Run: npx tsx --env-file=<env> scripts/audit-affiliate-logic.mjs
 */
process.env.NEXT_PUBLIC_AFFILIATE_ENABLED = "true";
process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "audit-20";
import { PrismaClient } from "@prisma/client";
import { generateAffiliateLinks } from "../src/lib/services/affiliate.ts";

const prisma = new PrismaClient();
const rows = await prisma.comparison.findMany({
  where: { status: "published" },
  select: {
    category: true,
    entities: { select: { entity: { select: { id: true, name: true, entityType: { select: { slug: true } } } } } },
  },
});
const buckets = {};
for (const c of rows) {
  for (const { entity } of c.entities) {
    const e = { id: entity.id, name: entity.name, entityType: entity.entityType.slug };
    const links = generateAffiliateLinks(e, c.category);
    const p = links[0]?.partner ?? "none";
    (buckets[p] ?? (buckets[p] = new Set())).add(`${entity.name}  [${entity.entityType.slug}/${c.category}]`);
  }
}
for (const [p, set] of Object.entries(buckets)) {
  console.log(`\n=== ${p} (${set.size}) ===`);
  console.log([...set].slice(0, 90).join("\n"));
}
await prisma.$disconnect();
