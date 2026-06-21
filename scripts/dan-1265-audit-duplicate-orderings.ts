/**
 * DAN-1265 — audit duplicate A-vs-B / B-vs-A comparison pages.
 *
 * Enumerates every published /compare/ slug and groups them by their
 * canonical (alphabetically-sorted) entity key. Any group with >1 slug is a
 * cannibalization cluster: the same comparison served by multiple URLs.
 *
 * Read-only. Run against prod:
 *   npx dotenv -e .env.dan1265 -- npx tsx scripts/dan-1265-audit-duplicate-orderings.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function canonicalKey(slug: string): string {
  // Same rule as comparisonSlugN(): sort the -vs- segments alphabetically.
  return slug
    .split("-vs-")
    .map((s) => s.trim())
    .filter(Boolean)
    .sort()
    .join("-vs-");
}

async function main() {
  const rows = await prisma.comparison.findMany({
    where: { slug: { contains: "-vs-" } },
    select: { slug: true, status: true, viewCount: true, updatedAt: true },
  });

  const groups = new Map<string, typeof rows>();
  for (const r of rows) {
    const key = canonicalKey(r.slug);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  const dupes = [...groups.entries()].filter(([, v]) => v.length > 1);

  console.log(`Total /compare/ rows: ${rows.length}`);
  console.log(`Distinct canonical keys: ${groups.size}`);
  console.log(`Duplicate clusters (>1 slug): ${dupes.length}`);
  console.log(`Extra (redundant) pages: ${dupes.reduce((n, [, v]) => n + v.length - 1, 0)}`);
  console.log("");

  // Survivor selection per cluster:
  //   1. Highest viewCount wins (the established / indexed / link-attracting page).
  //   2. Tie (commonly 0/0) -> alphabetically-sorted slug (the key) — deterministic
  //      and matches the going-forward generation order.
  const consolidations: Record<string, string> = {}; // retired -> survivor
  const archive: string[] = []; // retired slugs to unpublish
  let viewDriven = 0;
  let alphaDriven = 0;

  for (const [key, members] of dupes.sort((a, b) => b[1].length - a[1].length)) {
    const ranked = [...members].sort((a, b) => {
      const v = (b.viewCount || 0) - (a.viewCount || 0);
      if (v !== 0) return v;
      // tie-break: alpha-canonical (slug === key) first, then lexicographic
      if (a.slug === key) return -1;
      if (b.slug === key) return 1;
      return a.slug.localeCompare(b.slug);
    });
    const survivor = ranked[0];
    const maxViews = Math.max(...members.map((m) => m.viewCount || 0));
    if (maxViews > 0) viewDriven++; else alphaDriven++;

    console.log(`# ${key}  -> survivor: ${survivor.slug}${survivor.slug === key ? " (alpha)" : " (views)"}`);
    for (const m of ranked) {
      const tag = m.slug === survivor.slug ? "KEEP   " : "RETIRE ";
      const canon = m.slug === key ? " (alpha-canonical)" : "";
      console.log(
        `   ${tag} ${m.slug}  [views=${m.viewCount ?? 0} updated=${m.updatedAt?.toISOString().slice(0, 10)}]${canon}`,
      );
      if (m.slug !== survivor.slug) {
        consolidations[m.slug] = survivor.slug;
        archive.push(m.slug);
      }
    }
  }

  console.log("");
  console.log(`Clusters resolved by viewCount: ${viewDriven}`);
  console.log(`Clusters resolved by alpha tie-break (0 views both sides): ${alphaDriven}`);
  console.log(`Redirects (retired -> survivor): ${Object.keys(consolidations).length}`);
  console.log("");
  console.log("===CONSOLIDATIONS_JSON_START===");
  console.log(JSON.stringify(consolidations, null, 2));
  console.log("===CONSOLIDATIONS_JSON_END===");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
