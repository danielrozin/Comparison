/**
 * Wave publish — review gate + status flip for generated comparisons.
 *
 *   node scripts/wave-publish.mjs --review  <slug...>     # print each page's content + automated checks; writes nothing
 *   node scripts/wave-publish.mjs --publish <slug...>     # flip passing pages to published (isHumanReviewed = true)
 *   node scripts/wave-publish.mjs --publish --force <slug...>   # publish even if a check fails (you've read it)
 *
 * Runs in the "Wave publish" GitHub workflow because it needs the production
 * DATABASE_URL. --review dumps the generated copy into the job log so the
 * founder (or the agent driving the wave) reads every page before --publish;
 * the automated checks catch the mechanical failures so the read can focus on
 * whether the page is true and useful.
 *
 * Automated checks (any failure blocks publish without --force):
 *   - status is "archived" (i.e. generated and awaiting review) or already published
 *   - ≥2 entities, ≥3 key differences, ≥3 FAQs, shortAnswer ≥ 120 chars, verdict ≥ 200 chars
 *   - no year later than the current one anywhere in the copy (feedback: never future-date)
 *   - no self-contradicting magnitude sentence (same rule as the DAN-2188 numeric-claim guard)
 *   - no leftover generator scaffolding ("[insert", "TODO", "as an AI", "lorem")
 */

import './lib/env.mjs';

const args = process.argv.slice(2);
const REVIEW = args.includes('--review');
const PUBLISH = args.includes('--publish');
const FORCE = args.includes('--force');
const slugs = args.filter((a) => !a.startsWith('--'));
if ((!REVIEW && !PUBLISH) || !slugs.length) {
  console.error('Usage: wave-publish.mjs (--review | --publish [--force]) <slug...>');
  process.exit(1);
}

const YEAR = new Date().getUTCFullYear();
const UP = /\b(larger|bigger|higher|greater|more|faster|stronger|leads?|exceeds?|outnumbers?|ahead)\b/i;
const DOWN = /\b(smaller|lower|less|fewer|slower|weaker|trails?|behind|lags?)\b/i;
const SCAFFOLD = /\[insert|\bTODO\b|as an ai\b|lorem ipsum|\{\{|\}\}/i;

function magnitude(s) {
  const m = String(s).toLowerCase().match(/\$?([\d,]+(?:\.\d+)?)\s*(trillion|billion|million|thousand|[kmbt])?\b/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(/,/g, ''));
  const scale = { trillion: 1e12, t: 1e12, billion: 1e9, b: 1e9, million: 1e6, m: 1e6, thousand: 1e3, k: 1e3 }[m[2]] || 1;
  return n * scale;
}
/** "A is larger (10 vs 20)" — the direction word and the parenthesised numbers disagree. */
function contradiction(text) {
  const hits = [];
  for (const sent of String(text || '').split(/(?<=[.!?])\s+/)) {
    const pm = sent.match(/\(([^()]*?)\s+(?:vs\.?|versus)\s+([^()]*?)\)/i);
    if (!pm) continue;
    const a = magnitude(pm[1]), b = magnitude(pm[2]);
    if (a == null || b == null || a === b) continue;
    const up = UP.test(sent), down = DOWN.test(sent);
    if (up === down) continue;
    if ((up && a < b) || (down && a > b)) hits.push(sent.trim().slice(0, 140));
  }
  return hits;
}

function check(c) {
  const problems = [];
  const text = [c.shortAnswer, c.verdict, ...(c.keyDifferences || []).map((d) => JSON.stringify(d)), ...c.faqs.map((f) => f.question + ' ' + f.answer)].join('\n');
  if (!['archived', 'published'].includes(c.status)) problems.push(`status=${c.status}`);
  if (c.entities.length < 2) problems.push(`entities=${c.entities.length}`);
  if ((c.keyDifferences?.length ?? 0) < 3) problems.push(`keyDifferences=${c.keyDifferences?.length ?? 0}`);
  if (c.faqs.length < 3) problems.push(`faqs=${c.faqs.length}`);
  if ((c.shortAnswer || '').length < 120) problems.push(`shortAnswer=${(c.shortAnswer || '').length}ch`);
  if ((c.verdict || '').length < 200) problems.push(`verdict=${(c.verdict || '').length}ch`);
  const future = (text.match(/\b20\d\d\b/g) || []).filter((y) => Number(y) > YEAR);
  if (future.length) problems.push(`future years: ${[...new Set(future)].join(',')}`);
  if (SCAFFOLD.test(text)) problems.push('generator scaffolding');
  const contra = contradiction(text);
  if (contra.length) problems.push(`contradiction: ${contra[0]}`);
  return problems;
}

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();
const outcome = { pass: [], fail: [], missing: [], published: [] };
try {
  for (const slug of slugs) {
    const c = await prisma.comparison.findUnique({
      where: { slug },
      include: { entities: { select: { entity: { select: { name: true } } } }, faqs: { select: { question: true, answer: true } } },
    });
    if (!c) { console.log(`\n!! not in DB: ${slug}`); outcome.missing.push(slug); continue; }
    const problems = check(c);
    (problems.length ? outcome.fail : outcome.pass).push(slug);

    console.log(`\n${'='.repeat(78)}\n${problems.length ? '✗' : '✓'} ${slug}  [${c.status}]  ${c.title}`);
    if (problems.length) console.log(`   PROBLEMS: ${problems.join(' | ')}`);
    if (REVIEW) {
      console.log(`   entities: ${c.entities.map((e) => e.entity.name).join(' vs ')}`);
      console.log(`   meta: ${c.metaTitle} — ${c.metaDescription}`);
      console.log(`   shortAnswer: ${c.shortAnswer}`);
      console.log(`   verdict: ${c.verdict}`);
      for (const d of c.keyDifferences || []) console.log(`   • ${typeof d === 'string' ? d : `${d.label || d.title || ''}: ${d.entityAValue ?? d.a ?? ''} vs ${d.entityBValue ?? d.b ?? ''}${d.description ? ` — ${d.description}` : ''}`}`);
      for (const f of c.faqs) console.log(`   Q: ${f.question}\n      ${f.answer}`);
    }

    if (PUBLISH && (!problems.length || FORCE)) {
      if (c.status === 'published' && c.isHumanReviewed) { console.log('   already published'); continue; }
      await prisma.comparison.update({
        where: { slug },
        data: { status: 'published', isHumanReviewed: true, publishedAt: new Date(), lastRefreshedAt: new Date() },
      });
      outcome.published.push(slug);
      console.log('   → PUBLISHED');
    }
  }
} finally {
  await prisma.$disconnect();
}
console.log(`\n${'='.repeat(78)}\npass=${outcome.pass.length} fail=${outcome.fail.length} missing=${outcome.missing.length} published=${outcome.published.length}`);
if (outcome.fail.length) console.log(`fail: ${outcome.fail.join(' ')}`);
if (outcome.pass.length && !PUBLISH) console.log(`\nready to publish:\n${outcome.pass.join(' ')}`);
