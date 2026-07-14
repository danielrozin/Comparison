/**
 * DAN-2078 — is the "multi-facet" claim real?
 *
 * The ticket assumed `nfl-vs-nba-revenue` / `nfl-vs-nba-viewership` (and the GDP /
 * economic-growth slugs) ask genuinely different questions about the same pair, so
 * collapsing them would destroy long-tail intent. That assumption is what the whole
 * "needs a board call" split rests on — so test it instead of inheriting it.
 *
 * A facet-bearing slug earns its URL only if the BODY differs. Same body under a
 * different slug is not long-tail intent, it is the duplicate the ticket is about.
 * So fingerprint the content, don't trust the slug's promise.
 *
 * Read-only.
 */
import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";
import { canonicalComparisonWhere } from "../src/lib/db/canonical-comparisons";

const prisma = new PrismaClient();

const CLUSTERS: Record<string, string[]> = {
  "nba|nfl": [
    "nfl-vs-nba",
    "nfl-vs-nba-revenue",
    "nfl-vs-nba-viewership",
    "nba-vs-nfl-viewership-globally",
  ],
  "china|us-economy": [
    "us-vs-china-gdp",
    "us-vs-china-economic-growth",
    "us-economy-vs-china-economy",
    "america-vs-china-economy",
    "chinese-vs-us-economy",
    "china-economy-size-vs-us",
    "china-economy-vs-united-states",
  ],
};

function norm(s: unknown): string {
  return JSON.stringify(s ?? null)
    .toLowerCase()
    .replace(/\s+/g, " ");
}

async function main() {
  for (const [name, slugs] of Object.entries(CLUSTERS)) {
    console.log(`\n================ ${name} ================`);
    const rows = await prisma.comparison.findMany({
      where: { slug: { in: slugs } },
      select: {
        slug: true,
        title: true,
        status: true,
        shortAnswer: true,
        keyDifferences: true,
        verdict: true,
        searchImpressions: true,

      },
    });

    for (const r of rows) {
      const body = norm(r.shortAnswer) + norm(r.keyDifferences) + norm(r.verdict);
      const fp = createHash("sha1").update(body).digest("hex").slice(0, 10);
      console.log(
        `\n  ${r.slug}  [${r.status}]  impressions=${r.searchImpressions ?? 0}`,
      );
      console.log(`     title:        ${JSON.stringify(r.title)}`);
      console.log(`     body-fp:      ${fp}  (len ${body.length})`);
      console.log(`     shortAnswer:  ${String(r.shortAnswer ?? "").slice(0, 160)}`);
    }

    // Group by fingerprint: identical fingerprint == identical page under N URLs.
    const byFp = new Map<string, string[]>();
    for (const r of rows) {
      const body = norm(r.shortAnswer) + norm(r.keyDifferences) + norm(r.verdict);
      const fp = createHash("sha1").update(body).digest("hex").slice(0, 10);
      byFp.set(fp, [...(byFp.get(fp) ?? []), r.slug]);
    }
    console.log(`\n  --> distinct bodies: ${byFp.size} across ${rows.length} URLs`);
    for (const [fp, group] of byFp) {
      console.log(`      ${fp}: ${group.join(", ")}`);
    }
  }

  // Impressions for every duplicated cluster, to pick survivors on real GSC data
  // (never viewCount — that column is seed data, DAN-2037).
  console.log(`\n\n================ ALL CLUSTER IMPRESSIONS ================`);
  const all = await prisma.comparison.findMany({
    where: canonicalComparisonWhere(),
    select: { slug: true, searchImpressions: true },
  });
  const impressions = new Map(all.map((r) => [r.slug, r]));
  const totalWithImpr = all.filter((r) => (r.searchImpressions ?? 0) > 0).length;
  console.log(`rows with searchImpressions > 0: ${totalWithImpr} / ${all.length}`);
  for (const slug of Object.values(CLUSTERS).flat()) {
    const r = impressions.get(slug);
    console.log(`  ${slug}: impr=${r?.searchImpressions ?? "(not canonical)"}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
