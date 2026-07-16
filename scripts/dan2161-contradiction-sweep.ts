/**
 * DAN-2161 — corpus-wide sweep for SELF-CONTRADICTING numeric prose.
 *
 * The no-fact-check-needed class: a sentence claims one side is
 * "larger/higher/more" (or "smaller/lower/less") and immediately quotes
 * "(A vs B)" in the WRONG numeric order. Readable as wrong with zero
 * external knowledge — the credibility landmine in the ticket.
 *
 * DAN-2188 moved the detector into src/lib/services/numeric-claim-guard.ts,
 * where it also runs as a pre-publish gate in generateComparison and
 * saveComparison. This script now imports it, so the corpus sweep and the
 * live gate can never disagree about what counts as a contradiction.
 *
 * Read-only. Scans shortAnswer + verdict of all published comparisons.
 */
import { PrismaClient } from "@prisma/client";
import {
  scanTextForSelfContradictions,
} from "../src/lib/services/numeric-claim-guard";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.comparison.findMany({
    where: { status: "published" },
    select: { slug: true, shortAnswer: true, verdict: true },
  });

  const out = rows.flatMap((r) =>
    [
      ...scanTextForSelfContradictions(r.shortAnswer, "shortAnswer"),
      ...scanTextForSelfContradictions(r.verdict, "verdict"),
    ].map((hit) => ({ ...hit, slug: r.slug }))
  );

  console.log(`Scanned ${rows.length} published comparisons.`);
  console.log(`SELF-CONTRADICTIONS found: ${out.length}\n`);
  for (const o of out) {
    console.log(`  [${o.field}]${o.isRank ? "[rank]" : ""} ${o.slug}  (a=${o.a}, b=${o.b})`);
    console.log(`     …${o.snippet}\n`);
  }
  // Non-zero exit lets CI or a publish job gate on a clean corpus.
  if (out.length > 0) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
