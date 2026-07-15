/**
 * DAN-2161 — cross-page numeric disagreement scan.
 *
 * Blast-radius scoping: group published /compare/ pages by ENTITY PAIR, then
 * for each labeled metric that appears on >1 sibling page, flag when the quoted
 * values DISAGREE by more than a rounding tolerance. This is the class the
 * ticket describes (four NFL revenue figures, US GDP at $30T/$27.4T/$25.5T):
 * the same public fact printed as several different confident numbers.
 *
 * Uses the structured keyDifferences labels (cleaner than prose parsing).
 * Read-only.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Normalize a metric label so "Nominal GDP (2024)" and "Nominal GDP" collide.
function normLabel(s: string): string {
  return s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z%$ ]/g, "").replace(/\s+/g, " ").trim();
}
// Parse a value to a comparable number (word/attached suffixes). null if not numeric.
function parseVal(raw: string): number | null {
  const s = String(raw).trim().toLowerCase();
  if (/\d\s*[-–]\s*\d/.test(s)) return null; // ranges: skip
  let m = s.match(/(-?[\d,]+(?:\.\d+)?)\s+(trillion|billion|million|thousand)\b/);
  if (m) { const sc: any = { trillion:1e12, billion:1e9, million:1e6, thousand:1e3 }; return parseFloat(m[1].replace(/,/g,"")) * sc[m[2]]; }
  m = s.match(/(-?[\d,]+(?:\.\d+)?)([kmbt])\b/);
  if (m) { const sc: any = { k:1e3, m:1e6, b:1e9, t:1e12 }; return parseFloat(m[1].replace(/,/g,"")) * sc[m[2]]; }
  m = s.match(/(-?[\d,]+(?:\.\d+)?)/);
  if (m) return parseFloat(m[1].replace(/,/g,""));
  return null;
}

type KD = { label?: string; entityAValue?: string; entityBValue?: string };

async function main() {
  const rows = await prisma.comparison.findMany({
    where: { status: "published" },
    select: {
      slug: true, keyDifferences: true,
      entities: { select: { position: true, entity: { select: { slug: true } } } },
    },
  });

  // Cluster by unordered entity-pair key.
  const clusters = new Map<string, typeof rows>();
  for (const r of rows) {
    const es = r.entities.map((e) => e.entity.slug).sort();
    if (es.length < 2) continue;
    const key = es.join("|");
    clusters.set(key, [...(clusters.get(key) ?? []), r]);
  }

  let flaggedMetrics = 0;
  const flaggedPages = new Set<string>();
  for (const [key, group] of clusters) {
    if (group.length < 2) continue;
    // Collect metric -> list of {slug, value(number), raw} across sibling pages.
    // Values are normalized to "entity-A-alphabetical" orientation using the pair sort.
    const metrics = new Map<string, { slug: string; num: number; raw: string; who: string }[]>();
    for (const r of group) {
      const sorted = [...r.entities].sort((a, b) => a.entity.slug.localeCompare(b.entity.slug));
      const aSlug = sorted[0].entity.slug; // alphabetical first
      // map position(0/1) -> is it the alphabetical-A?
      const posOfA = r.entities.find((e) => e.entity.slug === aSlug)!.position;
      const kd = (r.keyDifferences as KD[] | null) ?? [];
      if (!Array.isArray(kd)) continue;
      for (const d of kd) {
        if (!d?.label) continue;
        const lab = normLabel(d.label);
        const aVal = posOfA === 0 ? d.entityAValue : d.entityBValue; // value for alphabetical-A entity
        const bVal = posOfA === 0 ? d.entityBValue : d.entityAValue;
        for (const [who, raw] of [["A", aVal], ["B", bVal]] as const) {
          const n = parseVal(String(raw ?? ""));
          if (n === null || raw == null) continue;
          const mk = `${lab}::${who}`;
          metrics.set(mk, [...(metrics.get(mk) ?? []), { slug: r.slug, num: n, raw: String(raw), who }]);
        }
      }
    }
    for (const [mk, vals] of metrics) {
      if (vals.length < 2) continue;
      const nums = vals.map((v) => v.num);
      const min = Math.min(...nums), max = Math.max(...nums);
      // Disagreement if max differs from min by >5% (ignores pure rounding).
      if (min > 0 && (max - min) / min > 0.05) {
        flaggedMetrics++;
        vals.forEach((v) => flaggedPages.add(v.slug));
        const [lab] = mk.split("::");
        console.log(`\nPAIR ${key}  metric="${lab.trim()}"`);
        for (const v of vals) console.log(`   ${v.raw.padEnd(24)} ${v.slug}`);
      }
    }
  }
  const multi = [...clusters.values()].filter((g) => g.length > 1).length;
  console.log(`\n================================================`);
  console.log(`Published pages: ${rows.length}`);
  console.log(`Entity-pairs with >1 published page: ${multi}`);
  console.log(`Metrics that DISAGREE across siblings (>5%): ${flaggedMetrics}`);
  console.log(`Distinct pages carrying a disagreeing number: ${flaggedPages.size}`);
}
main().catch(e=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());
