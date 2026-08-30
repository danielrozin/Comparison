/**
 * AEO question-bank fold-in — add Google's own People-Also-Ask questions to the
 * FAQ blocks of the comparison pages they belong to.
 *
 *   node scripts/aeo-faq-foldin.mjs --generate            # → scripts/data/aeo-faq-foldin.json (review it)
 *   node scripts/aeo-faq-foldin.mjs --apply --dry         # report what would be inserted
 *   node scripts/aeo-faq-foldin.mjs --apply               # insert (needs the working DATABASE_URL → GH Actions)
 *
 * Why
 * ---
 * scripts/data/content-plan-2026-08-26.json carries `aeoQuestionBank`: the PAA
 * questions Google attaches to the live SERP of each shortlisted comparison
 * (266 questions / 66 targets). Answering the literal question Google already
 * asks is the highest-yield AEO/GEO tactic, and the FAQ block feeds FAQPage
 * schema. Waves 1+2 built 29 of those targets without the bank, so this folds
 * it in after the fact; the remaining targets pick the bank up when wave 3
 * generates them.
 *
 * Two phases on purpose: generation needs ANTHROPIC_API_KEY and produces a
 * file a human can read before anything touches production; apply needs the
 * production DATABASE_URL, which only the publish workflows have.
 *
 * Answer rules (enforced in the prompt, checked after):
 *   - grounded in the page's own verdict / key differences / existing FAQs,
 *     or in stable, widely-known facts; no invented figures
 *   - questions that need a forecast, a named pundit's opinion, or facts the
 *     page doesn't carry are skipped, not guessed
 *   - no future-dated years (feedback: never brand content with next year)
 *   - a question that duplicates an existing FAQ is skipped
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import './lib/env.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const PLAN = path.join(here, 'data/content-plan-2026-08-26.json');
const OUT = path.join(here, 'data/aeo-faq-foldin.json');
const SITE = process.env.PUBLISH_SOURCE_ORIGIN || 'https://www.aversusb.net';
const MODEL = 'claude-opus-5';
const CURRENT_YEAR = new Date().getUTCFullYear();

const args = process.argv.slice(2);
const GENERATE = args.includes('--generate');
const APPLY = args.includes('--apply');
const DRY = args.includes('--dry');
const ONLY = args.filter((a) => !a.startsWith('--'));

if (!GENERATE && !APPLY) {
  console.error('Usage: node scripts/aeo-faq-foldin.mjs (--generate | --apply [--dry]) [slug...]');
  process.exit(1);
}

// ---------------------------------------------------------------- helpers

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STOP = new Set('a an the is are do does of in on to for vs and or what which how why who between with better than it its'.split(' '));
const tokens = (s) => new Set(norm(s).split(' ').filter((t) => t && !STOP.has(t)));

/** Jaccard over content words — catches "Is X better than Y?" vs "Which is better, X or Y?". */
function similar(a, b) {
  const ta = tokens(a), tb = tokens(b);
  if (!ta.size || !tb.size) return false;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / (ta.size + tb.size - inter) >= 0.6;
}

async function getJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

async function fetchContext(slug) {
  const [faq, answer] = await Promise.all([
    getJson(`${SITE}/api/faq/${slug}`),
    getJson(`${SITE}/api/answer/${slug}`),
  ]);
  if (!faq) return null; // page not published
  return {
    slug,
    title: faq.title,
    existingFaqs: faq.faqs || [],
    shortAnswer: answer?.answer || null,
    verdict: answer?.verdict || null,
    keyDifferences: answer?.keyDifferences || [],
    entities: (answer?.entities || []).map((e) => e.name),
  };
}

// ---------------------------------------------------------------- generate

async function generate() {
  const plan = JSON.parse(fs.readFileSync(PLAN, 'utf-8'));
  const bank = plan.aeoQuestionBank.byTarget;
  const slugs = (ONLY.length ? ONLY : Object.keys(bank)).filter((s) => bank[s]);

  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();

  const SYSTEM = `You write FAQ answers for A Versus B (aversusb.net), a comparison site. Each question is a real "People also ask" question Google shows for the comparison. The answer will be published verbatim in the page's FAQ block and FAQPage schema.

Rules:
- Answer the literal question in the first sentence, then 1–3 sentences of support. 40–90 words total. Plain prose, no markdown, no bullet lists.
- Ground every figure in the PAGE CONTEXT provided. You may add stable, widely-known facts (how a product category works, standard definitions, typical ranges everyone in the field agrees on) but never invent specific prices, rates, dates, statistics, or rankings that are not in the context.
- Skip a question (return "skip" with a short reason) when answering well would require: a forecast, a named person's opinion (e.g. "what does Dave Ramsey say"), a precise calculation the context can't support, medical/legal/financial advice specific to one reader, or facts outside the comparison's scope.
- Never mention a year later than ${CURRENT_YEAR}. Prefer no year at all.
- Neutral, useful, specific. No sales language, no "it depends" as a whole answer, no "consult a professional" boilerplate unless the question is genuinely individual.
- Do not restate the question. Do not address the reader as "you" more than once.

Return ONLY a JSON array, one object per input question, in the same order:
[{"question": "<original question, verbatim>", "answer": "<answer>"} | {"question": "<original>", "skip": "<reason>"}]`;

  const out = { generatedAt: new Date().toISOString(), model: MODEL, site: SITE, pages: [] };
  let totals = { pages: 0, missing: 0, asked: 0, answered: 0, skipped: 0, dupes: 0 };

  for (const slug of slugs) {
    const ctx = await fetchContext(slug);
    if (!ctx) { console.log(`  – not published: ${slug}`); totals.missing++; continue; }

    const fresh = bank[slug].filter((q) => !ctx.existingFaqs.some((f) => similar(f.question, q)));
    totals.dupes += bank[slug].length - fresh.length;
    if (!fresh.length) { console.log(`  = all ${bank[slug].length} already covered: ${slug}`); continue; }

    const context = [
      `Comparison: ${ctx.title}`,
      ctx.entities.length ? `Entities: ${ctx.entities.join(' vs ')}` : '',
      ctx.shortAnswer ? `Short answer: ${ctx.shortAnswer}` : '',
      ctx.verdict ? `Verdict: ${ctx.verdict}` : '',
      ctx.keyDifferences.length
        ? `Key differences:\n${ctx.keyDifferences.map((d) => `- ${d.label}: ${d.entityAValue} vs ${d.entityBValue}${d.winner && d.winner !== 'tie' ? ` (winner: ${d.winner})` : ''}`).join('\n')}`
        : '',
      ctx.existingFaqs.length
        ? `Existing FAQs on the page (do not repeat these):\n${ctx.existingFaqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}`
        : '',
    ].filter(Boolean).join('\n\n');

    const user = `PAGE CONTEXT\n${context}\n\nQUESTIONS\n${fresh.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;

    let parsed;
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 4000,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'medium' },
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: user }],
      });
      if (res.stop_reason === 'refusal') throw new Error(`refusal: ${res.stop_details?.category}`);
      const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
      // Slice from the first "[{" to the last "}]" — a leading "[" in any
      // preamble the model adds otherwise swallows the real array.
      const start = text.indexOf('[{');
      const end = text.lastIndexOf('}]');
      parsed = JSON.parse(start >= 0 && end > start ? text.slice(start, end + 2) : text);
      if (!Array.isArray(parsed)) throw new Error('not an array');
    } catch (e) {
      console.log(`  ! generation failed for ${slug}: ${e.message}`);
      continue;
    }

    const faqs = [];
    const skipped = [];
    for (const item of parsed) {
      const q = String(item.question || '').trim();
      if (!q) continue;
      if (item.skip || !item.answer) { skipped.push({ question: q, reason: item.skip || 'no answer' }); continue; }
      const a = String(item.answer).trim();
      const badYear = a.match(/\b(20\d\d)\b/g)?.find((y) => Number(y) > CURRENT_YEAR);
      if (badYear) { skipped.push({ question: q, reason: `future year ${badYear}` }); continue; }
      const words = a.split(/\s+/).length;
      if (words < 25 || words > 130) { skipped.push({ question: q, reason: `length ${words}w` }); continue; }
      faqs.push({ question: q, answer: a });
    }

    totals.pages++;
    totals.asked += fresh.length;
    totals.answered += faqs.length;
    totals.skipped += skipped.length;
    out.pages.push({ slug, title: ctx.title, existingFaqCount: ctx.existingFaqs.length, hadAnswerContext: !!ctx.verdict, faqs, skipped });
    console.log(`  ✓ ${slug}: +${faqs.length} answered, ${skipped.length} skipped (of ${fresh.length} new; ${ctx.existingFaqs.length} existing)`);
  }

  out.totals = totals;
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`\nWrote ${path.relative(process.cwd(), OUT)}`);
  console.log(totals);
}

// ---------------------------------------------------------------- apply

async function apply() {
  const data = JSON.parse(fs.readFileSync(OUT, 'utf-8'));
  const pages = data.pages.filter((p) => !ONLY.length || ONLY.includes(p.slug));
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  let added = 0, touched = 0;
  try {
    for (const page of pages) {
      if (!page.faqs.length) continue;
      const comp = await prisma.comparison.findUnique({
        where: { slug: page.slug },
        select: { id: true, status: true, faqs: { select: { question: true, sortOrder: true } } },
      });
      if (!comp) { console.log(`  ! not in DB: ${page.slug}`); continue; }
      if (comp.status !== 'published') { console.log(`  ! not published (${comp.status}): ${page.slug}`); continue; }
      const toAdd = page.faqs.filter((f) => !comp.faqs.some((e) => similar(e.question, f.question)));
      if (!toAdd.length) { console.log(`  = nothing new: ${page.slug}`); continue; }
      let order = comp.faqs.reduce((m, f) => Math.max(m, f.sortOrder ?? 0), 0);
      if (!DRY) {
        await prisma.fAQ.createMany({
          data: toAdd.map((f) => ({ question: f.question, answer: f.answer, comparisonId: comp.id, sortOrder: ++order })),
        });
        await prisma.comparison.update({ where: { slug: page.slug }, data: { lastRefreshedAt: new Date() } });
      }
      added += toAdd.length; touched++;
      console.log(`  ${DRY ? '[DRY]' : '✅'} ${page.slug}: +${toAdd.length} (${comp.faqs.length} → ${comp.faqs.length + toAdd.length})`);
    }
  } finally {
    await prisma.$disconnect();
  }
  console.log(`\n${DRY ? 'Would add' : 'Added'} ${added} FAQs across ${touched} pages.`);
}

if (GENERATE) await generate();
if (APPLY) await apply();
