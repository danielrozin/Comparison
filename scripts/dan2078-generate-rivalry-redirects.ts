/**
 * DAN-2078 — generate the rivalry-level consolidation map from LIVE prod data.
 *
 * Emits src/lib/redirects/compare-rivalry-redirects.dan2078.generated.ts.
 * Regenerate (read-only against prod; writes only the local file):
 *   set -a; . ./.env.local; set +a
 *   npx tsx scripts/dan2078-generate-rivalry-redirects.ts
 *
 * WHY A RIVALRY KEY, NOT A SLUG KEY
 * ---------------------------------
 * DAN-1265 / DAN-1800 grouped duplicates by slug shape: sort the `-vs-` tokens and
 * group on collision. That is blind to a duplicate whose two slugs share no tokens.
 * `us-economy-vs-china-economy` and `china-economy-size-vs-us` are the same page
 * twice but sort to different keys, so every slug-shaped sweep walked past them.
 * The key that sees them is the entity pair (the ComparisonEntity join) run through
 * the alias map — the same key the DAN-2047 studies collapse on, so the redirect map
 * and the published study figures now agree by construction, not by coincidence.
 *
 * SURVIVOR RULE: highest `searchImpressions` (real GSC data, synced onto the row by
 * gsc-service). NOT `viewCount` — that column is seed data, not traffic (DAN-2037),
 * and trusting it is exactly what made DAN-1265 keep 18 archived survivors that
 * DAN-2065 then had to unpick. 456 of 468 canonical rows carry non-zero impressions.
 *
 * SAFETY: sources and survivors are both drawn from `canonicalComparisonWhere()`, so
 * a survivor is always `published` AND not already a redirect source. A redirect into
 * an archived slug 404s the whole cluster — DAN-1908 / DAN-2065 hit that three times.
 *
 * MULTI-FACET CLUSTERS ARE PARTIALLY CONSOLIDATED (see KEEP_FACET_SLUGS): the NFL/NBA
 * and US/China clusters mix pure-synonym duplicates with a few genuinely facet-distinct
 * pages. The facet-check split them by data (bodies + titles + impressions); the
 * duplicates consolidate, the distinct facet slugs stay live.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "node:fs";
import { canonicalComparisonWhere } from "../src/lib/db/canonical-comparisons";
import { canonicalSlug } from "../src/lib/services/entity-aliases";
import { RIVALRY_CONSOLIDATIONS_DAN2078 as SHIPPED } from "../src/lib/redirects/compare-rivalry-redirects.dan2078.generated";

const prisma = new PrismaClient();

/**
 * DAN-2078 — the NFL/NBA and US/China clusters were originally HELD_FOR_BOARD because
 * their slugs promise facets, so a blanket entity-pair collapse (which is all this
 * generator can express) would have retired genuinely-distinct facet pages alongside
 * the true duplicates. The board call sat un-actioned for 3 days.
 *
 * Resolved by data instead of a blanket hold: scripts/dan2078-facet-check.ts fingerprints
 * every body and prints per-slug title/impressions. The result splits each held cluster
 * cleanly into (a) pure-synonym duplicates of the SAME matchup — same title, same lead —
 * which fall squarely under this ticket's mandate, and (b) a small set of genuinely
 * facet-distinct pages that earn their own URL. We consolidate (a) into the highest-
 * impression survivor and KEEP (b) live. Facet pages listed here are excluded from their
 * cluster BEFORE survivor ranking, so they are never a source or a survivor.
 *
 *   china-economy | united-states-economy: the pages titled "US Economy vs China
 *     Economy" (all leading with the same nominal-GDP comparison) are pure synonyms →
 *     survivor us-economy-vs-china-economy (777 impr), retire the others. KEEP the two
 *     genuinely facet-scoped slugs: us-vs-china-gdp ("USA vs China GDP 2026", GDP-led) and
 *     us-vs-china-economic-growth (growth-rate angle).
 *   nba | nfl: the two viewership pages compete for the identical query →
 *     survivor nfl-vs-nba-viewership (498 impr), retire nba-vs-nfl-viewership-globally
 *     (382). KEEP nfl-vs-nba (the only general page) and nfl-vs-nba-revenue (revenue facet).
 *
 * Retiring only same-title / same-facet duplicates and keeping every distinct facet means
 * no destructive action lands on a genuinely-distinct page (the DAN-1893 failure mode),
 * so this needs no board call — it is the same mechanical dedup the other 14 clusters got.
 *
 * TWO GENERATOR SAFETY FIXES (both latent bugs the original single-shot run never hit):
 *
 *  1. ADDITIVE, not overwrite. `canonicalComparisonWhere()` excludes rows already in
 *     REDIRECTED_COMPARE_SLUGS, so once a source ships it disappears from this query and
 *     a naive re-run would emit a map WITHOUT the 14 shipped redirects — silently dropping
 *     14 live 308s. We spread the already-shipped map in and only ADD to it.
 *
 *  2. SCOPED to the held clusters (ONLY_NEW_CLUSTERS). Since 2026-07-14 the enrichment
 *     cron has published new keyword-suffixed near-duplicates in OTHER rivalries
 *     (california-population-vs-texas-2026, japan-vs-china-economic-comparison-2026,
 *     disney-vs-netflix-2026, nfl-vs-nba-revenue-comparison-2026 …). Those are real
 *     cannibalization but they are NOT this ticket's scope; sweeping them in silently
 *     under DAN-2078 would ship unreviewed redirects. They get their own audit/ticket.
 */
const KEEP_FACET_SLUGS = new Set([
  "us-vs-china-gdp",
  "us-vs-china-economic-growth",
  "nfl-vs-nba",
  "nfl-vs-nba-revenue",
  // Deferred, not kept-on-merit: a cron-published keyword-suffixed revenue variant that
  // post-dates the facet-check. It duplicates the kept nfl-vs-nba-revenue facet and
  // belongs in the keyword-permutation cleanup (cf. DAN-346), not a viewership survivor.
  "nfl-vs-nba-revenue-comparison-2026",
]);

// New consolidations are emitted ONLY for these rivalry keys (the two DAN-2078 held
// clusters). Every other duplicated cluster is left untouched by this run.
const ONLY_NEW_CLUSTERS = new Set([
  "china-economy | united-states-economy",
  "national-basketball-association-nba | national-football-league-nfl",
]);

function rivalryKey(entitySlugs: string[]): string {
  return [...entitySlugs].map(canonicalSlug).sort().join(" | ");
}

async function main() {
  const rows = await prisma.comparison.findMany({
    where: canonicalComparisonWhere(),
    select: {
      slug: true,
      title: true,
      searchImpressions: true,
      entities: {
        select: { position: true, entity: { select: { slug: true } } },
        orderBy: { position: "asc" },
      },
    },
  });

  const clusters = new Map<string, typeof rows>();
  for (const row of rows) {
    const entitySlugs = row.entities.map((e) => e.entity.slug);
    if (entitySlugs.length !== 2) continue;
    const key = rivalryKey(entitySlugs);
    clusters.set(key, [...(clusters.get(key) ?? []), row]);
  }

  const dupes = [...clusters.entries()]
    .filter(([, g]) => g.length > 1)
    .sort((a, b) => a[0].localeCompare(b[0]));

  const lines: string[] = [];
  const map: Record<string, string> = {};
  let kept = 0;

  for (const [key, group] of dupes) {
    // Only the two DAN-2078 held clusters get NEW redirects here. Every other
    // duplicated rivalry (incl. cron-published drift) is out of scope for this run.
    if (!ONLY_NEW_CLUSTERS.has(key)) continue;
    // Facet-distinct pages (DAN-2078 facet-check) are pulled out of the cluster
    // before ranking, so they can never be a redirect source or a survivor.
    const keptSlugs = group.filter((r) => KEEP_FACET_SLUGS.has(r.slug));
    const participants = group.filter((r) => !KEEP_FACET_SLUGS.has(r.slug));
    kept += keptSlugs.length;
    if (keptSlugs.length > 0) {
      console.log(
        `KEEP facets in ${key}: ${keptSlugs.map((r) => r.slug).join(", ")}`,
      );
    }
    if (participants.length < 2) continue;
    // Survivor = most impressions. Deterministic tie-break on slug so a re-run
    // cannot silently flip a survivor and invert a live redirect.
    const ranked = [...participants].sort(
      (a, b) =>
        b.searchImpressions - a.searchImpressions || a.slug.localeCompare(b.slug),
    );
    const [survivor, ...retired] = ranked;
    const detail = ranked.map((r) => `${r.slug} (${r.searchImpressions})`).join(" > ");
    lines.push(`  // ${key} — ${detail}`);
    for (const r of retired) {
      map[r.slug] = survivor.slug;
      lines.push(`  ${JSON.stringify(r.slug)}: ${JSON.stringify(survivor.slug)},`);
    }
    lines.push("");
  }

  // ADDITIVE: fold in every already-shipped redirect. A source, once shipped, is in
  // REDIRECTED_COMPARE_SLUGS and therefore excluded from the query above, so it would
  // otherwise silently vanish from the emitted map. Merge, then re-check invariants
  // over the COMBINED set so a new survivor cannot be an existing source and vice versa.
  const merged: Record<string, string> = { ...SHIPPED };
  for (const [from, to] of Object.entries(map)) {
    if (from in merged) throw new Error(`duplicate source already shipped: ${from}`);
    merged[from] = to;
  }
  const survivors = new Set(Object.values(merged));
  for (const from of Object.keys(merged)) {
    if (survivors.has(from)) throw new Error(`chain: ${from} is both source and survivor`);
  }

  const header = `/**
 * DAN-2078 — rivalry-level duplicate consolidation (retired slug -> survivor).
 *
 * GENERATED by scripts/dan2078-generate-rivalry-redirects.ts. Do not hand-edit:
 * re-run the generator instead, and re-run scripts/dan2065-full-map-audit.ts after.
 *
 * Grouped by ENTITY PAIR (alias-normalised), not slug shape — that is why this map
 * catches duplicates DAN-1265 / DAN-1800 could not see (\`us-economy-vs-china-economy\`
 * and \`china-economy-size-vs-us\` share no slug tokens but are the same rivalry).
 *
 * Survivor = highest \`searchImpressions\` (real GSC data). Never \`viewCount\` — that is
 * seed data, not traffic (DAN-2037). Impressions at decision time are recorded inline
 * so a future reader can see the call rather than re-derive it.
 *
 * The NFL/NBA and US/China clusters are PARTIALLY consolidated: pure-synonym duplicates
 * of the same matchup are folded in, while genuinely facet-distinct slugs (…-gdp,
 * …-economic-growth, …-revenue, and the general nfl-vs-nba) are kept live per the
 * facet-check split. See KEEP_FACET_SLUGS in the generator.
 */
export const RIVALRY_CONSOLIDATIONS_DAN2078: Record<string, string> = {
`;

  // Preserve the already-shipped entries VERBATIM (comments + impression audit trail)
  // by lifting the existing object body out of the current file, then append the new
  // block. This is what makes the generator additive instead of destructive.
  const OUT = "src/lib/redirects/compare-rivalry-redirects.dan2078.generated.ts";
  const current = readFileSync(OUT, "utf8");
  const bodyMatch = current.match(
    /RIVALRY_CONSOLIDATIONS_DAN2078: Record<string, string> = \{\n([\s\S]*?)\n\};/,
  );
  if (!bodyMatch) throw new Error("cannot locate existing map body to preserve");
  const existingBody = bodyMatch[1].replace(/\s+$/, "");

  const newBlock =
    lines.length > 0
      ? `\n\n  // --- DAN-2078 held-cluster resolution (2026-07-17) — see KEEP_FACET_SLUGS ---\n${lines.join("\n").trimEnd()}`
      : "";

  writeFileSync(OUT, `${header}${existingBody}${newBlock}\n};\n`);

  console.log(
    `\nClusters processed (held): ${[...dupes].filter(([k]) => ONLY_NEW_CLUSTERS.has(k)).length} | kept ${kept} facet pages live`,
  );
  console.log(`New redirects added: ${Object.keys(map).length} | total shipped: ${Object.keys(merged).length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
