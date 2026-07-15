/**
 * DAN-2161 — corpus-wide sweep for SELF-CONTRADICTING numeric prose.
 *
 * The no-fact-check-needed class: a sentence claims one side is
 * "larger/higher/more" (or "smaller/lower/less") and immediately quotes
 * "(A vs B)" in the WRONG numeric order. Readable as wrong with zero
 * external knowledge — the credibility landmine in the ticket.
 *
 * Read-only. Scans shortAnswer + verdict of all published comparisons.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const UP = /\b(larger|bigger|higher|greater|more|faster|stronger|leads?|dominates?|exceeds?|outnumbers?|ahead)\b/i;
const DOWN = /\b(smaller|lower|less|fewer|slower|weaker|trails?|behind|lags?)\b/i;
// Rank/ordinal context: "higher" means a SMALLER ordinal — inverts the numeric test.
const RANK = /\b(rank|ranked|ranking|ranks|no\.|#|position|place|nth|first|1st)\b/i;

// Parse a magnitude. Word suffix (space ok) or attached single letter (no space).
function parseNum(raw: string): number | null {
  const s = raw.trim().toLowerCase();
  let m = s.match(/(-?[\d,]+(?:\.\d+)?)\s+(trillion|billion|million|thousand)\b/);
  if (m) {
    const scale: Record<string, number> = { trillion: 1e12, billion: 1e9, million: 1e6, thousand: 1e3 };
    return parseFloat(m[1].replace(/,/g, "")) * scale[m[2]];
  }
  m = s.match(/(-?[\d,]+(?:\.\d+)?)([kmbt])\b/); // attached, e.g. 115m, $20b
  if (m) {
    const scale: Record<string, number> = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 };
    return parseFloat(m[1].replace(/,/g, "")) * scale[m[2]];
  }
  m = s.match(/(-?[\d,]+(?:\.\d+)?)\s*%/);
  if (m) return parseFloat(m[1].replace(/,/g, ""));
  m = s.match(/(-?[\d,]+(?:\.\d+)?)/);
  if (m) return parseFloat(m[1].replace(/,/g, ""));
  return null;
}

function scan(text: string, slug: string, field: string, out: any[]) {
  if (!text) return;
  const re = /\(([^()]*?\bvs?\.?\b[^()]*?)\)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const inner = m[1];
    const parts = inner.split(/\bvs?\.?\b|\bversus\b/i);
    if (parts.length !== 2) continue;
    // Ranges ("25-30%", "$150-200M") are ambiguous for a min/max test — skip them.
    if (parts.some((p) => /\d\s*[-–]\s*\d/.test(p))) continue;
    const a = parseNum(parts[0]);
    const b = parseNum(parts[1]);
    if (a === null || b === null || a === b) continue;
    const lead = text.slice(Math.max(0, m.index - 90), m.index);
    const up = UP.test(lead);
    const down = DOWN.test(lead);
    if (up === down) continue; // need exactly one direction
    const isRank = RANK.test(lead) || RANK.test(inner);
    // For ranks, "higher/better" means a smaller ordinal: invert.
    const aWins = isRank ? a < b : a > b;   // does the leading subject's number "win"?
    const claimsWin = up;                    // prose says leading subject is greater/better
    const contradiction = claimsWin !== aWins;
    if (contradiction) {
      out.push({ slug, field, isRank,
        snippet: (lead.slice(-70) + "(" + inner + ")").replace(/\s+/g, " ").trim(),
        a, b });
    }
  }
}

async function main() {
  const rows = await prisma.comparison.findMany({
    where: { status: "published" },
    select: { slug: true, shortAnswer: true, verdict: true },
  });
  const out: any[] = [];
  for (const r of rows) {
    scan(r.shortAnswer || "", r.slug, "shortAnswer", out);
    scan(r.verdict || "", r.slug, "verdict", out);
  }
  console.log(`Scanned ${rows.length} published comparisons.`);
  console.log(`SELF-CONTRADICTIONS found: ${out.length}\n`);
  for (const o of out) {
    console.log(`  [${o.field}]${o.isRank ? "[rank]" : ""} ${o.slug}  (a=${o.a}, b=${o.b})`);
    console.log(`     …${o.snippet}\n`);
  }
}
main().catch(e=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());
