/**
 * DAN-2551 — verify the /alternatives dead-link fix.
 *
 * Two defects were found by the task-1 measurement and fixed in this branch:
 *
 *   1. `getAlternativesForEntity` had no status filter, so alternative cards linked
 *      archived/draft comparisons, which 404 via getStaticProps (DAN-1886/DAN-2065).
 *   2. The curated ENTITY_CONTENT merge in /alternatives/[slug] synthesised the link
 *      target as `${entity}-vs-${alternative}` without checking that slug exists.
 *
 * This script re-runs both the OLD and NEW resolution against the production DB and
 * reports how many pages stop emitting dead /compare links, and how many pages that
 * change moves to zero alternatives (i.e. become archive candidates for tasks 2-4).
 *
 * Read-only. Run:
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/dan2551-verify-alternatives-fix.ts
 */
import { PrismaClient } from "@prisma/client";
import { REDIRECTED_COMPARE_SLUGS } from "../src/lib/redirects/compare-redirects";
import { ENTITY_CONTENT } from "../src/lib/data/entity-content";

const prisma = new PrismaClient();

async function main() {
  const redirected = new Set(REDIRECTED_COMPARE_SLUGS);

  const entities = await prisma.entity.findMany({ select: { slug: true } });

  // Every comparison + its status + its entity pair, loaded once.
  const comparisons = await prisma.comparison.findMany({
    select: {
      slug: true,
      status: true,
      entities: { select: { entity: { select: { slug: true } } } },
    },
  });

  const canonicalSlugs = new Set(
    comparisons.filter((c) => c.status === "published" && !redirected.has(c.slug)).map((c) => c.slug)
  );

  // entity slug -> comparisons containing it
  const byEntity = new Map<string, typeof comparisons>();
  for (const c of comparisons) {
    for (const ce of c.entities) {
      const list = byEntity.get(ce.entity.slug) ?? [];
      list.push(c);
      byEntity.set(ce.entity.slug, list);
    }
  }

  const isCanonical = (c: (typeof comparisons)[number]) =>
    c.status === "published" && !redirected.has(c.slug);

  let pagesWithDeadLinks = 0;
  let deadLinksTotal = 0;
  let fabricatedCuratedLinks = 0;
  let pagesWithFabricated = 0;
  let zeroBefore = 0;
  let zeroAfter = 0;

  for (const { slug } of entities) {
    const comps = byEntity.get(slug) ?? [];

    // OLD: every comparison, no status filter. Distinct rival entities.
    const oldRivals = new Set<string>();
    const oldCompSlugs = new Set<string>();
    for (const c of comps) {
      for (const ce of c.entities) {
        if (ce.entity.slug !== slug && !oldRivals.has(ce.entity.slug)) {
          oldRivals.add(ce.entity.slug);
          oldCompSlugs.add(c.slug);
        }
      }
    }

    // NEW: canonical comparisons only.
    const newRivals = new Set<string>();
    for (const c of comps.filter(isCanonical)) {
      for (const ce of c.entities) {
        if (ce.entity.slug !== slug) newRivals.add(ce.entity.slug);
      }
    }

    const dead = [...oldCompSlugs].filter((s) => !canonicalSlugs.has(s));
    if (dead.length > 0) {
      pagesWithDeadLinks++;
      deadLinksTotal += dead.length;
    }

    // Curated merge, old behaviour: fabricate `${slug}-vs-${curated.slug}`.
    const curated = ENTITY_CONTENT[slug]?.alternatives ?? [];
    let fabricatedHere = 0;
    let curatedKept = 0;
    for (const c of curated) {
      if (oldRivals.has(c.slug)) continue;
      const forward = `${slug}-vs-${c.slug}`;
      const reverse = `${c.slug}-vs-${slug}`;
      if (canonicalSlugs.has(forward) || canonicalSlugs.has(reverse)) curatedKept++;
      else if (!canonicalSlugs.has(forward)) fabricatedHere++;
    }
    if (fabricatedHere > 0) {
      pagesWithFabricated++;
      fabricatedCuratedLinks += fabricatedHere;
    }

    if (oldRivals.size + curated.length === 0) zeroBefore++;
    if (newRivals.size + curatedKept === 0) zeroAfter++;
  }

  console.log(`entities (= /alternatives pages): ${entities.length}`);
  console.log(`comparison rows: ${comparisons.length}  canonical: ${canonicalSlugs.size}`);
  console.log("");
  console.log("--- defect 1: alternative cards linking non-canonical comparisons ---");
  console.log(`pages emitting >=1 dead /compare link: ${pagesWithDeadLinks}`);
  console.log(`dead /compare links total:             ${deadLinksTotal}`);
  console.log("");
  console.log("--- defect 2: fabricated curated comparison slugs ---");
  console.log(`pages emitting >=1 fabricated link:    ${pagesWithFabricated}`);
  console.log(`fabricated links total:                ${fabricatedCuratedLinks}`);
  console.log("");
  console.log("--- consolidation signal (input to tasks 2-4) ---");
  console.log(`pages with 0 alternatives before fix:  ${zeroBefore}`);
  console.log(`pages with 0 alternatives after fix:   ${zeroAfter}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
