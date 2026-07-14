/**
 * DAN-2078 — audit reverse-duplicate /compare/ rivalries.
 *
 * DAN-1265 already collapsed duplicates found by *slug* shape (sort the -vs-
 * tokens, group). That cannot see a duplicate whose two slugs share no tokens:
 * `us-vs-china-gdp` and `chinese-vs-us-economy` are the same rivalry but sort
 * to different keys. DAN-2047 hit the same wall in the studies and fixed it by
 * grouping on the **entity pair** (the ComparisonEntity join) instead. This
 * audit reuses that key, which is why it surfaces clusters DAN-1265 missed.
 *
 * Canonical set only: `published` AND not already a redirect source
 * (canonicalComparisonWhere, DAN-2067) — a slug that already 308s is not a page
 * and must not be counted as a duplicate of the thing it redirects to.
 *
 * Read-only. Run against prod:
 *   npx dotenv -e .env.local -- npx tsx scripts/dan2078-audit-duplicate-rivalries.ts
 */
import { PrismaClient } from "@prisma/client";
import { canonicalComparisonWhere } from "../src/lib/db/canonical-comparisons";
import { canonicalSlug } from "../src/lib/services/entity-aliases";

const prisma = new PrismaClient();

/**
 * Unordered entity-pair key: the rivalry, independent of slug wording/order.
 *
 * Runs each entity slug through the alias map first. Without that, `netflix +
 * disney-plus` and `netflix + disney` key differently and the duplicate hides —
 * even though both pages are the same matchup. The alias map is the same one
 * the DAN-2047 studies collapse on, so this audit and the studies agree by
 * construction. Aliases it does not yet know about are reported by
 * scripts/lint-entity-aliases.ts.
 */
function rivalryKey(entitySlugs: string[]): string {
  return [...entitySlugs].map(canonicalSlug).sort().join(" | ");
}

async function main() {
  const rows = await prisma.comparison.findMany({
    where: canonicalComparisonWhere(),
    select: {
      slug: true,
      title: true,
      status: true,
      updatedAt: true,
      contentScore: true,
      entities: {
        select: { position: true, entity: { select: { slug: true, name: true } } },
        orderBy: { position: "asc" },
      },
    },
  });

  const clusters = new Map<string, typeof rows>();
  for (const row of rows) {
    const entitySlugs = row.entities.map((e) => e.entity.slug);
    // Only pairwise comparisons form a "rivalry"; skip malformed/1-entity rows.
    if (entitySlugs.length !== 2) continue;
    const key = rivalryKey(entitySlugs);
    const bucket = clusters.get(key) ?? [];
    bucket.push(row);
    clusters.set(key, bucket);
  }

  const dupes = [...clusters.entries()]
    .filter(([, group]) => group.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  console.log(`Canonical pairwise comparisons: ${rows.length}`);
  console.log(`Distinct rivalries:             ${clusters.size}`);
  console.log(`Duplicated rivalries:           ${dupes.length}`);
  console.log(
    `Redundant pages (dupes - 1 each): ${dupes.reduce((n, [, g]) => n + g.length - 1, 0)}\n`,
  );

  for (const [key, group] of dupes) {
    console.log(`## ${key}  (${group.length} pages)`);
    for (const c of group) {
      console.log(
        `   ${c.slug}\n      title=${JSON.stringify(c.title)} score=${c.contentScore ?? "-"} updated=${c.updatedAt.toISOString().slice(0, 10)}`,
      );
    }
    console.log("");
  }

  console.log("JSON:");
  console.log(
    JSON.stringify(
      dupes.map(([key, group]) => ({
        rivalry: key,
        slugs: group.map((c) => ({
          slug: c.slug,
          title: c.title,
          contentScore: c.contentScore,
          updatedAt: c.updatedAt.toISOString().slice(0, 10),
        })),
      })),
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
