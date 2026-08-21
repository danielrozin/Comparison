/**
 * Propose 301 targets for /compare/* URLs that 404.
 *
 *   node scripts/match-404-redirects.mjs <tsv>   # "<slug>\t<views>" per line
 *
 * PostHog shows 1,551 404 views across 703 distinct /compare/* paths in 30
 * days, 87% direct and 11% from Google — real people landing on dead URLs,
 * not crawler noise. Most are near-misses: a reversed entity order, or an
 * SEO-suffixed variant of a page that does exist.
 *
 * A wrong redirect is worse than a 404 — it drops someone on unrelated
 * content and tells Google the two pages are equivalent. So every proposal
 * carries a confidence and a reason, and only exact entity-set matches are
 * emitted automatically.
 *
 * Prints TSV: slug, views, target, confidence, rule
 */

import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import './lib/env.mjs';

const prisma = new PrismaClient();
const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/match-404-redirects.mjs <tsv>');
  process.exit(1);
}

/**
 * Tokens that describe *how* a comparison is framed rather than *what* is
 * being compared. Stripping them turns "us-vs-china-gdp-comparison-2026" into
 * "us vs china", which is the page that actually exists.
 *
 * Deliberately excludes words that change the subject — "military", "economy",
 * "gdp", "population" and the like stay, because "us-vs-china-military" and
 * "us-vs-china" are different questions and folding them together would be the
 * wrong redirect.
 */
const NOISE = new Set([
  'comparison', 'comparisons', 'compare', 'compared', 'vs', 'versus',
  '2024', '2025', '2026', '2027',
  'latest', 'current', 'new', 'full', 'complete', 'ultimate', 'best',
  'estimates', 'figures', 'stats', 'statistics', 'benchmarks', 'specs',
  'performance', 'differences', 'guide', 'review', 'which', 'one', 'should',
  'you', 'buy', 'in', 'the', 'a', 'of', 'and', 'or', 'is', 'are', 'total',
]);

/** Aliases where a slug names an entity more or less formally than the canonical page. */
const ALIAS = new Map(Object.entries({
  'muhammad': 'ali', 'tyson': 'tyson', 'mike': 'tyson',
  'cristiano': 'ronaldo', 'lionel': 'messi',
  'michael': 'jordan', 'jordan': 'jordan', 'lebron': 'lebron', 'james': 'lebron',
  'kobe': 'kobe', 'bryant': 'kobe',
  'playstation': 'ps5', 'ps': 'ps5',
  'usa': 'us', 'united': 'us', 'states': 'us', 'america': 'us', 'american': 'us',
  'uk': 'uk', 'britain': 'uk',
}));

const tokens = (s) =>
  String(s)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((t) => ALIAS.get(t) ?? t)
    .filter((t) => !NOISE.has(t));

/** Order-independent signature of what a slug compares. */
const signature = (slug) => [...new Set(tokens(slug))].sort().join('|');

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  const inter = [...A].filter((x) => B.has(x)).length;
  const union = new Set([...A, ...B]).size;
  return union ? inter / union : 0;
}

const published = await prisma.comparison.findMany({
  where: { status: 'published' },
  select: { slug: true, searchImpressions: true, viewCount: true },
});
console.error(`# ${published.length} published comparisons in the catalogue`);

const bySignature = new Map();
for (const p of published) {
  const sig = signature(p.slug);
  const prev = bySignature.get(sig);
  // Prefer the shorter (cleaner) slug when two publish to the same signature.
  if (!prev || p.slug.length < prev.slug.length) bySignature.set(sig, p);
}

const rows = fs
  .readFileSync(file, 'utf-8')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)
  .map((l) => {
    const [slug, views] = l.split('\t');
    return { slug, views: Number(views) || 0 };
  });

const out = [];
for (const { slug, views } of rows) {
  const sig = signature(slug);
  const toks = tokens(slug);

  // 1. exact entity-set match — reversed ordering and SEO suffixes both land here
  const exact = bySignature.get(sig);
  if (exact && exact.slug !== slug) {
    out.push([slug, views, exact.slug, 'exact', 'same-entities']);
    continue;
  }

  // 2. best fuzzy match, reported but never auto-applied
  let best = null;
  let bestScore = 0;
  for (const p of published) {
    const score = jaccard(toks, tokens(p.slug));
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  out.push([
    slug,
    views,
    best?.slug ?? '',
    bestScore >= 0.8 ? 'high' : bestScore >= 0.6 ? 'medium' : 'low',
    `jaccard=${bestScore.toFixed(2)}`,
  ]);
}

await prisma.$disconnect();

out.sort((a, b) => b[1] - a[1]);
console.log(['slug', 'views', 'target', 'confidence', 'rule'].join('\t'));
out.forEach((r) => console.log(r.join('\t')));

const byConf = out.reduce((acc, r) => ((acc[r[3]] = (acc[r[3]] || 0) + 1), acc), {});
const viewsByConf = out.reduce((acc, r) => ((acc[r[3]] = (acc[r[3]] || 0) + r[1]), acc), {});
console.error('\n# proposals by confidence:');
for (const k of ['exact', 'high', 'medium', 'low']) {
  if (byConf[k]) console.error(`#   ${k.padEnd(7)} ${String(byConf[k]).padStart(3)} slugs, ${viewsByConf[k]} views`);
}
