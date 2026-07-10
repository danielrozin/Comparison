/**
 * DAN-1890 — Phase B canonical consolidation audit + redirect-map generator.
 *
 * Parent: DAN-1886 (June 2026 Spam Update recovery). Phase A (DAN-1887) archived
 * the auto-generated zero-view /compare/* pages, dropping the published corpus
 * from ~5,338 to ~39. But two gaps remain that this audit quantifies and the
 * generated map + route guard close:
 *
 *   1. getComparisonBySlug() looks a row up by slug WITHOUT a status filter, so
 *      every one of the ~5,564 archived rows still renders a full indexable 200.
 *      Sitemap exclusion never deindexes an already-indexed URL — the page must
 *      self-declare noindex. Handled at the serving layer by the route guard in
 *      [slug].tsx (metadata.status === "archived" → robots:noindex).
 *
 *   2. Same-entity-pair duplicate variants (ordering swaps + aliases) that are
 *      archived but whose canonical is a PUBLISHED survivor are not 301'd, so
 *      their residual link equity is stranded. This script emits an edge-redirect
 *      map for the SAFE subset only.
 *
 * Grouping: by the sorted set of a comparison's ComparisonEntity → Entity slugs
 * (the true entity pair), which surfaces alias variants that pure slug-token
 * grouping (DAN-1800) misses.
 *
 * SAFETY — why the redirect set is conservative:
 *   Entity-pair grouping intentionally lumps DIFFERENT-INTENT pages that share
 *   the same two entities (e.g. `us-vs-china-gdp` and a generic `china-vs-us`).
 *   301-ing those onto one canonical would destroy distinct search intent. So a
 *   member is only redirected when:
 *     - the group has exactly one PUBLISHED canonical (a real live target), AND
 *     - the member's "-vs-" token multiset is IDENTICAL to the canonical's
 *       (a pure ordering permutation — guaranteed same intent), AND
 *     - the member is a clean slug and not the canonical itself.
 *   Everything else (alias variants with different tokens, all-archived groups,
 *   suffix-intent variants) is left to the noindex guard, not redirected.
 *
 * Output:
 *   - scripts/data/dan1890-canonical-audit.json  (full classification report)
 *   - src/lib/redirects/compare-canonical-redirects.dan1890.generated.ts (map)
 *
 * Usage: npx tsx scripts/dan1890-canonical-audit.ts   (reads .env.local DATABASE_URL)
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { PrismaClient } from "@prisma/client";
import { isCleanSlug, isDegenerateComparisonSlug } from "../src/lib/utils/slugify";
import { ORDERING_CONSOLIDATIONS } from "../src/lib/redirects/compare-ordering-redirects.generated";
import { ORDERING_CONSOLIDATIONS_DAN1800 } from "../src/lib/redirects/compare-ordering-redirects.dan1800.generated";

const prisma = new PrismaClient();

// Slugs already claimed by an existing consolidation layer (as a source OR a
// destination). A DAN-1890 redirect touching any of these could create a 301
// chain or contradict a hand-curated canonical (e.g. the PS5/Xbox cluster whose
// MANUAL_CONSOLIDATIONS survivor differs from the raw view-count pick), so skip
// them here and let the existing layer own the cluster. MANUAL/ALIAS live inline
// in compare-redirects.ts; mirror their keys/values so this stays self-contained.
const EXISTING_MANUAL_ALIAS: [string, string][] = [
  ["xbox-series-x-vs-ps5-pro", "ps5-pro-vs-xbox-series-x-performance-comparison-2026"],
  ["ps5-pro-vs-xbox-series-x", "ps5-pro-vs-xbox-series-x-performance-comparison-2026"],
  ["iphone-15-vs-16", "iphone-15-vs-iphone-16"],
  ["kobe-bryant-vs-lebron-james", "kobe-vs-lebron"],
  ["bloomberg-vs-wsj", "bloomberg-vs-the-wall-street-journal"],
  ["paramount-plus-vs-peacock", "paramount-vs-peacock"],
  ["peacock-vs-paramount-plus", "paramount-vs-peacock"],
];
const RESERVED_SLUGS = new Set<string>([
  ...Object.keys(ORDERING_CONSOLIDATIONS),
  ...Object.values(ORDERING_CONSOLIDATIONS),
  ...Object.keys(ORDERING_CONSOLIDATIONS_DAN1800),
  ...Object.values(ORDERING_CONSOLIDATIONS_DAN1800),
  ...EXISTING_MANUAL_ALIAS.flat(),
]);

type Row = {
  slug: string;
  status: string;
  viewCount: number;
  searchImpressions: number;
  entitySlugs: string[];
};

function tokenMultisetKey(slug: string): string {
  return slug
    .split("-vs-")
    .map((s) => s.trim().toLowerCase())
    .sort()
    .join("|");
}

// Canonical selection within a group: prefer a published survivor, then max
// lifetime views, then max stored GSC impressions, then alphabetical (matches
// the DAN-1265/DAN-1800 deterministic tie-break).
function pickCanonical(members: Row[]): Row {
  return [...members].sort((a, b) => {
    const ap = a.status === "published" ? 1 : 0;
    const bp = b.status === "published" ? 1 : 0;
    if (ap !== bp) return bp - ap;
    if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount;
    if (b.searchImpressions !== a.searchImpressions)
      return b.searchImpressions - a.searchImpressions;
    return a.slug < b.slug ? -1 : 1;
  })[0];
}

async function main() {
  const rows: Row[] = (
    await prisma.comparison.findMany({
      select: {
        slug: true,
        status: true,
        viewCount: true,
        searchImpressions: true,
        entities: { select: { entity: { select: { slug: true } } } },
      },
    })
  ).map((r) => ({
    slug: r.slug,
    status: r.status,
    viewCount: r.viewCount ?? 0,
    searchImpressions: r.searchImpressions ?? 0,
    entitySlugs: r.entities.map((e) => e.entity.slug),
  }));

  // Group by entity pair (fall back to slug tokens when entity relations absent).
  const groups = new Map<string, Row[]>();
  for (const r of rows) {
    const key =
      r.entitySlugs.length >= 2
        ? [...r.entitySlugs].sort().join("|")
        : tokenMultisetKey(r.slug);
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(r);
  }

  const dupGroups = [...groups.entries()].filter(([, v]) => v.length > 1);

  const redirects: Record<string, string> = {};
  const report = {
    generatedAt: new Date().toISOString(),
    totalRows: rows.length,
    published: rows.filter((r) => r.status === "published").length,
    archived: rows.filter((r) => r.status === "archived").length,
    entityPairGroups: groups.size,
    dupGroups: dupGroups.length,
    redundantSlugs: dupGroups.reduce((a, [, v]) => a + v.length - 1, 0),
    dupGroupsWithPublishedCanonical: 0,
    safeRedirects: 0,
    skippedDifferentIntent: 0,
    noindexOnly: 0,
    // sample of the redirects we WILL emit, for reviewer sanity-check
    redirectSamples: [] as { from: string; to: string; fromViews: number; fromImpr: number }[],
    // sample of same-pair members we deliberately do NOT redirect (intent-preserving)
    skippedSamples: [] as { member: string; canonical: string; reason: string }[],
  };

  for (const [, members] of dupGroups) {
    const canonical = pickCanonical(members);
    const canonicalIsPublished = canonical.status === "published";
    if (canonicalIsPublished) report.dupGroupsWithPublishedCanonical++;
    const canonicalTokens = tokenMultisetKey(canonical.slug);

    for (const m of members) {
      if (m.slug === canonical.slug) continue;
      const samePairTokens = tokenMultisetKey(m.slug) === canonicalTokens;
      const clean = isCleanSlug(m.slug) && !isDegenerateComparisonSlug(m.slug);

      // Skip any slug an existing consolidation layer already owns (avoids 301
      // chains / contradicting a hand-curated canonical).
      const reserved =
        RESERVED_SLUGS.has(m.slug) || RESERVED_SLUGS.has(canonical.slug);

      // Redirect only pure ordering permutations onto a PUBLISHED canonical.
      if (canonicalIsPublished && samePairTokens && clean && !reserved) {
        redirects[m.slug] = canonical.slug;
        report.safeRedirects++;
        if (report.redirectSamples.length < 40)
          report.redirectSamples.push({
            from: m.slug,
            to: canonical.slug,
            fromViews: m.viewCount,
            fromImpr: m.searchImpressions,
          });
      } else {
        report.noindexOnly++;
        if (!samePairTokens) report.skippedDifferentIntent++;
        if (report.skippedSamples.length < 30 && (m.viewCount > 0 || m.searchImpressions > 0))
          report.skippedSamples.push({
            member: m.slug,
            canonical: canonical.slug,
            reason: !samePairTokens
              ? "different tokens/intent — noindex, do not merge"
              : !canonicalIsPublished
              ? "canonical is archived — noindex whole group"
              : "unclean slug — handled by isCleanSlug guard",
          });
      }
    }
  }

  // Loop guard: a redirect destination must never also be a redirect source.
  const dests = new Set(Object.values(redirects));
  for (const from of Object.keys(redirects)) {
    if (dests.has(from) || from === redirects[from]) delete redirects[from];
  }
  report.safeRedirects = Object.keys(redirects).length;

  // Write the generated redirect map (sorted for stable diffs).
  const sortedEntries = Object.entries(redirects).sort(([a], [b]) =>
    a < b ? -1 : 1,
  );
  const mapLiteral = sortedEntries
    .map(([from, to]) => `  ${JSON.stringify(from)}: ${JSON.stringify(to)},`)
    .join("\n");
  const generated = `/**
 * DAN-1890 — Phase B canonical-consolidation redirects (GENERATED).
 *
 * Same-entity-pair duplicate /compare/* variants (pure "-vs-" ordering
 * permutations) whose canonical survivor is a PUBLISHED page, folded onto that
 * canonical with an edge 301. Deliberately conservative: alias variants with
 * different tokens and all-archived groups are NOT redirected here — they are
 * deindexed by the archived→robots:noindex guard in
 * src/pages/compare/[slug].tsx instead, so distinct search intent that merely
 * shares an entity pair (e.g. \`us-vs-china-gdp\` vs a generic \`china-vs-us\`)
 * is never wrongly merged.
 *
 * Canonical selection: published > max viewCount > max searchImpressions >
 * alphabetical (matches DAN-1265/DAN-1800).
 *
 * Regenerate: npx tsx scripts/dan1890-canonical-audit.ts
 * Do not hand-edit — add one-off consolidations to compare-redirects.ts.
 */

export const CANONICAL_CONSOLIDATIONS_DAN1890: Record<string, string> = {
${mapLiteral}
};
`;
  const genPath = path.resolve(
    process.cwd(),
    "src/lib/redirects/compare-canonical-redirects.dan1890.generated.ts",
  );
  // Only emit the map when there is something NEW to add. As of the 2026-07-10
  // run this is empty: every same-token /compare/* ordering duplicate is already
  // folded by DAN-1265 + DAN-1800, so DAN-1890's additive lever is the
  // archived→noindex serving guard, not more redirects. Don't ship an unused
  // empty module; remove a stale one if a prior run wrote it.
  if (sortedEntries.length > 0) {
    fs.writeFileSync(genPath, generated);
  } else if (fs.existsSync(genPath)) {
    fs.rmSync(genPath);
  }

  const outPath = path.resolve(process.cwd(), "scripts/data/dan1890-canonical-audit.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log("=== DAN-1890 canonical consolidation audit ===");
  console.log(`total rows: ${report.totalRows} (published ${report.published}, archived ${report.archived})`);
  console.log(`entity-pair groups: ${report.entityPairGroups}, dup groups: ${report.dupGroups}, redundant slugs: ${report.redundantSlugs}`);
  console.log(`dup groups w/ published canonical: ${report.dupGroupsWithPublishedCanonical}`);
  console.log(`SAFE 301 redirects emitted: ${report.safeRedirects}`);
  console.log(`left to noindex (not redirected): ${report.noindexOnly} (of which different-intent: ${report.skippedDifferentIntent})`);
  console.log(`\nmap → ${path.relative(process.cwd(), genPath)}`);
  console.log(`report → ${path.relative(process.cwd(), outPath)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
