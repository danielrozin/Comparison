/**
 * Entity alias lint (DAN-2047, ask 2).
 *
 * The alias map in src/lib/services/entity-aliases.ts is what keeps the study
 * figures honest. It goes stale the moment someone publishes a comparison that
 * introduces a new spelling of an entity we already have — `Netflix, Inc.`
 * alongside `Netflix`, `Max (HBO Max)` alongside `HBO Max`. This flags those.
 *
 *   npx tsx --env-file=.env.local scripts/lint-entity-aliases.ts
 *   npx tsx --env-file=.env.local scripts/lint-entity-aliases.ts --strict   # exit 1 on new candidates
 *
 * Reports, it does not auto-merge. A prefix/suffix match is NOT proof of an
 * alias — `iphone-16` and `iphone-16-pro` are different products, and merging
 * them would be a claim about the market, not about our catalog. Every entry in
 * the map is a human decision; this only makes sure the decision gets made.
 *
 * Two signals, both of which produced real aliases on the live corpus:
 *   A) identical display name under two slugs      (paramount / paramount-plus)
 *   B) token-containment after stopword removal    (max-hbo-max / hbo-max)
 */
import { PrismaClient } from "@prisma/client";
import { ENTITY_ALIASES, canonicalSlug } from "@/lib/services/entity-aliases";

const prisma = new PrismaClient();
const STRICT = process.argv.includes("--strict");

interface Row { name: string; eslug: string; n: bigint }

/** Tokens that carry no identity — dropping them is what links max-hbo-max to hbo-max. */
const STOPWORDS = new Set(["the", "inc", "co", "corp", "corporation", "company", "plc", "ag", "ltd", "llc"]);

const tokens = (slug: string) => slug.split("-").filter((t) => !STOPWORDS.has(t));
const normName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Tokens that add no new real-world referent — the difference between
 * `charles-schwab` and `charles-schwab-corporation` is one of these, so the two
 * slugs name one company. If the ONLY thing one slug adds is noise, it is an
 * alias. If it adds a model name (`bmw` -> `bmw-x5`) it is a different product,
 * and merging them would be a claim about the market rather than the catalog.
 */
const NOISE_TOKEN = /^(inc|co|corp|corporation|company|companies|holdings|group|plc|ag|sa|ltd|limited|llc|cf|com|browser|chip|app|platform|official|brand)$/i;

async function main() {
  const rows = await prisma.$queryRaw<Row[]>`
    SELECT e.name, e.slug AS eslug, COUNT(DISTINCT c.id) AS n
    FROM entities e
    JOIN comparison_entities ce ON ce.entity_id = e.id
    JOIN comparisons c ON c.id = ce.comparison_id AND c.status = 'published'
    GROUP BY e.name, e.slug`;

  const ents = rows.map((r) => ({ name: r.name, slug: r.eslug, n: Number(r.n) }));

  // Anything already resolved by the map is, by definition, handled.
  const handled = (a: string, b: string) => canonicalSlug(a) === canonicalSlug(b);

  // Duplicates: near-certainly the same real-world thing. These gate --strict.
  const duplicates: { a: string; b: string; why: string }[] = [];
  // Related: a parent brand and one of its products, or two SKUs of one line.
  // Real relationships, but NOT aliases — reported as a count only, so the
  // actionable list stays short enough that someone actually reads it.
  const related: { a: string; b: string }[] = [];

  const seen = new Set<string>();
  const add = (list: { a: string; b: string; why?: string }[], a: string, b: string, why?: string) => {
    const k = [a, b].sort().join("|");
    if (seen.has(k)) return;
    seen.add(k);
    list.push({ a, b, why: why ?? "" });
  };

  // A) identical display name under two slugs.
  const byName = new Map<string, typeof ents>();
  for (const e of ents) {
    const k = normName(e.name);
    byName.set(k, [...(byName.get(k) || []), e]);
  }
  for (const group of byName.values()) {
    if (group.length < 2) continue;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        if (handled(group[i].slug, group[j].slug)) continue;
        add(duplicates, group[i].slug, group[j].slug, `same display name "${group[i].name}"`);
      }
    }
  }

  // B) token containment.
  for (let i = 0; i < ents.length; i++) {
    for (let j = i + 1; j < ents.length; j++) {
      const a = ents[i], b = ents[j];
      if (handled(a.slug, b.slug)) continue;
      const ta = tokens(a.slug), tb = tokens(b.slug);
      if (!ta.length || !tb.length) continue;
      const [small, big] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
      if (!small.every((t) => big.includes(t))) continue;

      // What the longer slug adds. If it adds nothing but repetition or legal
      // noise, the two slugs name one thing. If it adds a real word, they don't.
      const extra = big.filter((t) => !small.includes(t));
      if (extra.length === 0 || extra.every((t) => NOISE_TOKEN.test(t))) {
        add(duplicates, a.slug, b.slug, `"${a.name}" / "${b.name}"`);
      } else {
        add(related, a.slug, b.slug);
      }
    }
  }

  console.log(`entities on published comparisons: ${ents.length}`);
  console.log(`alias map entries:                 ${Object.keys(ENTITY_ALIASES).length}`);
  console.log(`unreviewed duplicate candidates:   ${duplicates.length}`);
  console.log(`parent/variant pairs (not aliases): ${related.length}\n`);

  if (duplicates.length === 0) {
    console.log("✓ no new duplicate entities — the alias map covers every spelling we can detect.");
  } else {
    console.log("These look like the same real-world entity stored twice. Confirm each, add it to");
    console.log("ENTITY_ALIASES in src/lib/services/entity-aliases.ts, then regenerate the snapshots:\n");
    for (const c of duplicates.sort((x, y) => x.a.localeCompare(y.a))) {
      console.log(`  ${c.a}  ~  ${c.b}`);
      console.log(`      ${c.why}`);
    }
    console.log(`\n  npx tsx --env-file=.env.local scripts/dan2037-snapshot.ts`);
  }

  if (related.length > 0) {
    console.log(`\n(${related.length} parent/variant pairs like bmw ~ bmw-x5 or iphone-16 ~ iphone-16-pro`);
    console.log(` are deliberately NOT merged — they are different products. Run with --verbose to list.)`);
    if (process.argv.includes("--verbose")) {
      for (const c of related.sort((x, y) => x.a.localeCompare(y.a))) console.log(`    ${c.a}  ~  ${c.b}`);
    }
  }

  await prisma.$disconnect();
  if (STRICT && duplicates.length > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
