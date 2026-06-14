/**
 * DAN-871: Verify Entity rows for the multi-way GDP expansion (USA / China / India).
 * Read-only — no writes.
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const slugs = ["united-states", "usa", "us", "china", "india"];
    const ents = await prisma.entity.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true, name: true, entityType: { select: { slug: true } } },
    });
    console.log(`Entity hits (${ents.length}):`);
    for (const e of ents) console.log(`  ${e.slug}  | ${e.name} | type=${e.entityType?.slug}`);
    // Country entity type?
    const types = await prisma.entityType.findMany({
      where: { OR: [{ slug: { contains: "country" } }, { name: { contains: "ountry" } }] },
      select: { id: true, slug: true, name: true },
    });
    console.log(`\nEntityType country hits: ${types.length}`);
    for (const t of types) console.log(`  ${t.slug} | ${t.name} | id=${t.id}`);
    // Existing 3-entity (multi-way) comparisons for shape reference
    const all = await prisma.comparison.findMany({ select: { id: true, slug: true, _count: { select: { entities: true } } } });
    const multiway = all.filter((c) => c._count.entities >= 3);
    console.log(`\nMulti-way (3+ entity) comparisons currently in DB: ${multiway.length}`);
    for (const c of multiway.slice(0, 10)) console.log(`  ${c.slug}  | entities=${c._count.entities}`);
  } finally {
    await prisma.$disconnect();
  }
}
main().catch((e)=>{console.error(e);process.exit(1)});
