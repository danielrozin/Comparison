/**
 * DAN-2552 — verify the two QA failures on PR #235 are fixed.
 *
 * Check 2: getAlternativesForEntity must not re-add non-canonical mock slugs
 *          (regression case: brazil-vs-argentina on /alternatives/brazil).
 * Check 3: resolveCanonicalComparisonSlugs must not return redirect sources
 *          that happen to live in the mock catalog.
 *
 * Run: npx tsx scripts/dan2552-verify-mock-fallback.ts
 */
import { getAlternativesForEntity, resolveCanonicalComparisonSlugs } from "../src/lib/services/comparison-service";
import { getAllMockSlugs } from "../src/lib/services/mock-data";
import { REDIRECTED_COMPARE_SLUGS } from "../src/lib/redirects/compare-redirects";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const mockSlugs = getAllMockSlugs();

  const nonCanonicalRows = await prisma.comparison.findMany({
    where: { slug: { in: mockSlugs }, status: { not: "published" } },
    select: { slug: true },
  });
  const redirectMocks = mockSlugs.filter((s) => REDIRECTED_COMPARE_SLUGS.includes(s));
  const unlinkable = new Set([...nonCanonicalRows.map((r) => r.slug), ...redirectMocks]);

  console.log(`mock slugs: ${mockSlugs.length}`);
  console.log(`  non-canonical DB rows: ${nonCanonicalRows.length}`);
  console.log(`  redirect sources:      ${redirectMocks.length}`);
  console.log(`  total unlinkable:      ${unlinkable.size}\n`);

  // --- Check 3 ---
  const resolved = await resolveCanonicalComparisonSlugs(mockSlugs);
  const leaked = [...resolved].filter((s) => unlinkable.has(s));
  console.log(`CHECK 3 resolveCanonicalComparisonSlugs: resolved ${resolved.size}, leaked ${leaked.length}`);
  if (leaked.length) console.log(`  LEAKED: ${leaked.join(", ")}`);

  // --- Check 2 ---
  // Sample every entity that appears in an unlinkable mock comparison, plus brazil.
  const entitySlugs = new Set<string>(["brazil"]);
  for (const slug of unlinkable) for (const part of slug.split("-vs-")) entitySlugs.add(part);

  let pagesWithDeadLink = 0;
  const offenders: string[] = [];
  for (const entity of entitySlugs) {
    const alts = await getAlternativesForEntity(entity);
    const dead = alts.filter((a) => unlinkable.has(a.comparisonSlug));
    if (dead.length) {
      pagesWithDeadLink++;
      offenders.push(`${entity} -> ${dead.map((d) => d.comparisonSlug).join(", ")}`);
    }
  }
  console.log(`\nCHECK 2 getAlternativesForEntity: sampled ${entitySlugs.size} entities, ${pagesWithDeadLink} with dead links`);
  offenders.slice(0, 20).forEach((o) => console.log(`  ${o}`));

  const pass = leaked.length === 0 && pagesWithDeadLink === 0;
  console.log(`\n${pass ? "PASS" : "FAIL"}`);
  await prisma.$disconnect();
  process.exit(pass ? 0 : 1);
}

main();
