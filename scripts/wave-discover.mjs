/**
 * Wave discovery — build a SERP-verified queue of new comparison pages.
 *
 *   node scripts/wave-discover.mjs --ideas                 # DataForSEO keyword_ideas for every category → cache
 *   node scripts/wave-discover.mjs --ideas technology      # one category (cheap smoke test)
 *   node scripts/wave-discover.mjs --cluster               # cache → clusters → filters → shortlist (no API spend)
 *   node scripts/wave-discover.mjs --serp [N]              # live top-10 for the top N shortlist (default 80) → queue
 *
 * Output: scripts/data/wave-queue-<date>.json — `queue` is the ordered list to
 * generate; `dropped` explains every exclusion so the funnel is auditable.
 *
 * Why a fresh run
 * ---------------
 * The 917-cluster backlog behind waves 1+2 (opportunity-queue-2026-08-23.json)
 * was built from a cached DataForSEO run that was never committed; only its 68
 * SERP-verified survivors were. Wave 3 needs the next tranche, so this rebuilds
 * the funnel from the API and — unlike last time — caches the raw pull under
 * scripts/data/ so wave 4+ can re-cluster without paying again.
 *
 * Funnel (mirrors the 08-23 run's drop reasons: notComparison, fixture, junk,
 * spiky, badEntity, existing, lowVol, plus a YMYL hold):
 *   keyword_ideas (19 category seed sets, vol>100)
 *   → keep "A vs B"-shaped queries
 *   → cluster by canonical (alphabetical) entity pair; sum volume, keep variants
 *   → drop: already live (sitemap), mock fixture, junk entities, YMYL hold, low cluster volume
 *   → score, shortlist
 *   → live SERP top-10: count major publishers + forums; keep ≤2 majors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import './lib/env.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, 'data');
const DATE = new Date().toISOString().slice(0, 10);
const IDEAS_CACHE = path.join(DATA, `dataforseo-ideas-${DATE}.json`);
const QUEUE_OUT = path.join(DATA, `wave-queue-${DATE}.json`);
const SITE = process.env.PUBLISH_SOURCE_ORIGIN || 'https://www.aversusb.net';

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const positional = args.filter((a) => !a.startsWith('--'));

const AUTH = 'Basic ' + Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64');

async function dfs(endpoint, body) {
  const res = await fetch(`https://api.dataforseo.com/v3${endpoint}`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  const json = await res.json();
  const task = json.tasks?.[0];
  if (!task || task.status_code !== 20000) throw new Error(`DataForSEO ${endpoint}: ${task?.status_message || json.status_message}`);
  return { result: task.result?.[0], cost: task.cost || 0 };
}

// ---------------------------------------------------------------- seeds

/** Same seed sets the daily-discovery cron uses (src/lib/dataforseo/keyword-discovery.ts). */
function loadCategorySeeds() {
  const src = fs.readFileSync(path.join(here, '../src/lib/dataforseo/keyword-discovery.ts'), 'utf-8');
  const block = src.match(/const CATEGORY_SEEDS[^=]*=\s*(\{[\s\S]*?\n\});/)[1];
  // The block is a plain object literal of string arrays — safe to eval after stripping comments.
  return Function(`return (${block.replace(/\/\/.*$/gm, '')})`)();
}

// ---------------------------------------------------------------- filters

const SLUG = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const JUNK_ENTITY = [
  /^\d+$/, /^(the|a|an|and|or|of|in|on|for|to|with|what|which|who|is|are)$/,
  /\b(vs|versus)\b/, /\b(porn|sex|xxx|nude)\b/,
  /^(me|you|him|her|them|us|it)$/, /^.{1,2}$/, /^.{41,}$/,
  /\b(reddit|quora|youtube|wiki|wikipedia)\b/, /\b(202\d|prediction|odds|score|live|stream|highlights|tickets|schedule|lineup|h2h|head to head)\b/,
];
const NOT_COMPARISON_TAIL = /\b(who (would|will) win|fight|match|game \d|final|prediction|betting|odds|live|tonight|today|score|result|highlights|stats?|record|tickets|h2h|lineups?|preview|recap|position|defense|offense|prices?)\b/;

const YMYL = [
  /\b(mortgage|loan|refinanc|heloc|apr\b|interest rate|401k|401\(k\)|ira\b|roth|pension|annuity|bankrupt|chapter (7|11|13)|tax(es)?\b|irs\b|credit score|credit card|amex|visa card|mastercard|insurance|medicare|medicaid|life insurance|term life|whole life|estate|will vs trust|llc\b|s corp|c corp|inc\b|attorney|lawyer|lawsuit|dui\b|misdemeanor|felony)\b/,
  /\b(ozempic|mounjaro|wegovy|zepbound|semaglutide|tirzepatide|adderall|xanax|zoloft|prozac|lexapro|ibuprofen|tylenol|advil|aleve|antibiotic|vaccine|covid|cancer|chemo|diabetes|insulin|blood pressure|statin|dosage|mg\b|pill|drug|medication|prescription|surgery|symptom|diagnos|therapy|antidepressant|birth control|abortion|pregnan)\b/,
  /\b(suicide|self.harm|eating disorder|anorexia)\b/,
];

const MAJORS = [
  'forbes.com', 'nerdwallet.com', 'bankrate.com', 'investopedia.com', 'cnbc.com', 'nytimes.com', 'wsj.com', 'bloomberg.com', 'businessinsider.com',
  'techradar.com', 'tomsguide.com', 'cnet.com', 'theverge.com', 'pcmag.com', 'wired.com', 'digitaltrends.com', 'zdnet.com', 'engadget.com', 'androidauthority.com', 'gsmarena.com', 'rtings.com',
  'healthline.com', 'webmd.com', 'mayoclinic.org', 'medicalnewstoday.com', 'verywellhealth.com', 'clevelandclinic.org', 'nih.gov',
  'g2.com', 'capterra.com', 'techrepublic.com', 'zapier.com', 'hubspot.com',
  'britannica.com', 'wikipedia.org', 'diffen.com', 'versus.com',
  'espn.com', 'bleacherreport.com', 'cbssports.com', 'si.com',
  'consumerreports.org', 'wirecutter.com', 'usnews.com', 'thespruce.com', 'bhg.com', 'goodhousekeeping.com',
  'edmunds.com', 'caranddriver.com', 'motortrend.com', 'kbb.com', 'cars.com',
  'amazon.com', 'apple.com', 'microsoft.com', 'google.com', 'samsung.com',
];
const FORUMS = ['reddit.com', 'quora.com', 'stackexchange.com', 'stackoverflow.com', 'ycombinator.com', 'facebook.com', 'youtube.com'];

function parseVs(keyword) {
  const m = keyword.toLowerCase().trim().match(/^(.+?)\s+(?:vs\.?|versus)\s+(.+)$/);
  if (!m) return null;
  let a = m[1].trim(), b = m[2].trim();
  // strip qualifiers that aren't part of the entity
  const strip = (s) => s.replace(/\b(which is better|what is the difference|difference|comparison|compare|review|reviews|pros and cons|reddit|explained)\b/g, '').replace(/\s+/g, ' ').trim();
  a = strip(a); b = strip(b);
  if (!a || !b || a === b) return null;
  return { a, b };
}

const QUALIFIER = /\b(for|which|what|why|how|easier|harder|better|best|worse|worst|size|sizes|screen|gown|reliability|reliable|scores?|side|by|worth|luxury|ev|fiber|monitor|monitors|gaming|camera|battery|speed|weight|dimensions?|specs?|spec|mpg|price|prices|cost|costs|cheap|cheaper|value|difference|differences|meaning|definition|explained|chart|table|list|pros|cons|benefits?|reddit|review|reviews|in|on|at|with|without|from|to|of|and|or|per|year|years|old|new|used)\b/;
function isJunk(e) { return JUNK_ENTITY.some((r) => r.test(e)); }

/** Hand-curated exclusions from reading the queue — the generator would mint a bad page from these entity names. */
const DENY = {
  '16e-vs-iphone-13': 'entity "16e" alone is not a product name',
  '16e-vs-iphone-15': 'same',
  '14-pro-vs-iphone-14': 'same',
  'iphone-15-pro-vs-pro-max': 'entity "pro max" alone',
  'premium-vs-spotify-basic': 'parse artifact of "spotify premium vs basic"',
  'chatgpt-go-vs-plus': 'entities are plan names without the product',
  'army-vs-military': 'not a comparison of two things',
  'brazil-vs-spain': 'football fixture, event-driven',
  'dc-universe-vs-mortal-kombat': 'that is a single game title',
  'amino-acid-vs-protein': 'category vs its component, not a choice',
};
function isQualified(e) { return QUALIFIER.test(e); }

// Tokens that don't change which page a query belongs to.
const NOISE_TOKENS = new Set(['the', 'a', 'an', 'ai', 'degree', 'degrees', 'card', 'cards', 'account', 'accounts', 'plan', 'plans', 'self', 'driving', 'prices', 'price', 'cost', 'costs', 'app', 'brokerage', 'investments', 'investment', 'inc', 'corp', 'company', 'tv', 'tvs', 'phone', 'phones', 'chip', 'cpu', 'gpu']);
// "marines"→"marine", "reserves"→"reserve", "boxes"→"box", "cities"→"city"; never "marines"→"marin".
const singular = (t) => (t.length > 4 && t.endsWith('ies') ? t.slice(0, -3) + 'y' : t.length > 4 && /(s|x|z|ch|sh)es$/.test(t) ? t.slice(0, -2) : t.length > 3 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t);
/** Content tokens of an entity slug: singularised, noise removed. Falls back to raw tokens if nothing survives. */
function entityTokens(slug) {
  const raw = slug.split('-').filter(Boolean);
  const kept = raw.map(singular).filter((t) => !NOISE_TOKENS.has(t));
  return new Set(kept.length ? kept : raw);
}
const subsetOf = (a, b) => a.size > 0 && b.size - a.size <= 1 && [...a].every((t) => b.has(t));
/** Two entities are the same thing when one's content tokens are a subset of the other's ("camry" ⊂ "toyota camry"). */
const sameEntity = (x, y) => subsetOf(x, y) || subsetOf(y, x);
/** Pairs match when entities match pairwise in either order. */
function samePair([a1, b1], [a2, b2]) {
  return (sameEntity(a1, a2) && sameEntity(b1, b2)) || (sameEntity(a1, b2) && sameEntity(b1, a2));
}
const pairTokens = (key) => key.split('|').map(entityTokens);

// ---------------------------------------------------------------- phases

async function ideas() {
  const seeds = loadCategorySeeds();
  const cats = positional.length ? positional : Object.keys(seeds);
  const cache = fs.existsSync(IDEAS_CACHE) ? JSON.parse(fs.readFileSync(IDEAS_CACHE, 'utf-8')) : { pulledAt: new Date().toISOString(), cost: 0, byCategory: {} };
  for (const cat of cats) {
    if (cache.byCategory[cat]) { console.log(`  = cached: ${cat} (${cache.byCategory[cat].length})`); continue; }
    // keyword_ideas takes ≤20 seeds per request; chunk and merge.
    const chunks = [];
    for (let i = 0; i < seeds[cat].length; i += 20) chunks.push(seeds[cat].slice(i, i + 20));
    const items = [];
    let cost = 0;
    for (const chunk of chunks) {
      const { result, cost: c } = await dfs('/dataforseo_labs/google/keyword_ideas/live', [{
        keywords: chunk, location_code: 2840, language_code: 'en', limit: 1000,
        include_serp_info: false,
        filters: [['keyword_info.search_volume', '>', 100], 'and', ['keyword', 'regex', '.*(vs|versus).*']],
        order_by: ['keyword_info.search_volume,desc'],
      }]);
      cost += c;
      for (const it of result?.items || []) {
        items.push({
          keyword: it.keyword,
          volume: it.keyword_info?.search_volume || 0,
          cpc: it.keyword_info?.cpc || 0,
          competition: it.keyword_info?.competition || 0,
          kd: it.keyword_properties?.keyword_difficulty ?? null,
          intent: it.search_intent_info?.main_intent || null,
          monthly: (it.keyword_info?.monthly_searches || []).slice(0, 12).map((m) => m.search_volume),
        });
      }
    }
    cache.byCategory[cat] = items;
    cache.cost += cost;
    fs.writeFileSync(IDEAS_CACHE, JSON.stringify(cache, null, 1));
    console.log(`  ✓ ${cat}: ${items.length} vs-keywords, $${cost.toFixed(3)}`);
  }
  console.log(`\nCached → ${path.relative(process.cwd(), IDEAS_CACHE)}  (total spend $${cache.cost.toFixed(3)})`);
}

async function cluster() {
  const cache = JSON.parse(fs.readFileSync(IDEAS_CACHE, 'utf-8'));
  const [live, mock] = await Promise.all([
    (async () => {
      const set = new Set();
      for (let i = 0; i < 40; i++) {
        const res = await fetch(`${SITE}/sitemap/${i}.xml`).catch(() => null);
        if (!res || !res.ok) break;
        for (const m of (await res.text()).matchAll(/aversusb\.net\/compare\/([^<]+)/g)) set.add(m[1]);
      }
      return set;
    })(),
    fetch(`${SITE}/api/video-pipeline/slugs`).then((r) => r.json()).then((j) => new Set(j.slugs || [])).catch(() => new Set()),
  ]);
  const liveKeys = new Set([...live].map((s) => s.split('-vs-').sort().join('|')));
  const mockKeys = new Set([...mock].map((s) => s.split('-vs-').sort().join('|')));

  const clusters = new Map();
  const dropped = { notComparison: 0, junk: 0, existing: 0, fixture: 0, ymyl: 0, spiky: 0, lowVol: 0 };
  let scanned = 0;
  for (const [cat, items] of Object.entries(cache.byCategory)) {
    for (const it of items) {
      scanned++;
      const p = parseVs(it.keyword);
      if (!p || NOT_COMPARISON_TAIL.test(it.keyword)) { dropped.notComparison++; continue; }
      if (isQualified(p.a) || isQualified(p.b)) { dropped.notComparison++; continue; }
      if (isJunk(p.a) || isJunk(p.b)) { dropped.junk++; continue; }
      const sa = SLUG(p.a), sb = SLUG(p.b);
      if (!sa || !sb || sa === sb || sameEntity(entityTokens(sa), entityTokens(sb))) { dropped.junk++; continue; }
      const key = [sa, sb].sort().join('|');
      const c = clusters.get(key) || { key, entities: [sa, sb].sort(), category: cat, volume: 0, cpc: 0, kd: [], variants: [], monthly: null, head: null };
      c.volume += it.volume;
      c.cpc = Math.max(c.cpc, it.cpc);
      if (it.kd != null) c.kd.push(it.kd);
      c.variants.push({ keyword: it.keyword, volume: it.volume });
      if (!c.head || it.volume > c.head.volume) { c.head = { keyword: it.keyword, volume: it.volume }; c.monthly = it.monthly; }
      clusters.set(key, c);
    }
  }

  // Merge near-duplicate clusters (same entities spelled differently) into the
  // highest-volume one, then match the merged pair against live + fixture pages
  // the same fuzzy way. Slug = the most descriptive spelling seen for each entity.
  const livePairs = [...liveKeys].map(pairTokens);
  const mockPairs = [...mockKeys].map(pairTokens);
  const ordered = [...clusters.values()].sort((x, y) => y.volume - x.volume);
  const merged = [];
  dropped.merged = 0;
  for (const c of ordered) {
    c.pair = pairTokens(c.key);
    const into = merged.find((m) => samePair(m.pair, c.pair));
    if (into) {
      // The base cluster is the highest-volume spelling (list is volume-ordered), so it keeps the slug.
      into.volume += c.volume; into.cpc = Math.max(into.cpc, c.cpc); into.kd.push(...c.kd); into.variants.push(...c.variants);
      dropped.merged++;
      continue;
    }
    merged.push(c);
  }
  const prior = fs.existsSync(QUEUE_OUT) ? Object.fromEntries(JSON.parse(fs.readFileSync(QUEUE_OUT, 'utf-8')).shortlist.filter((c) => c.serp).map((c) => [c.slug, c.serp])) : {};
  dropped.denied = 0;
  const kept = [];
  for (const c of merged) {
    if (liveKeys.has(c.key) || livePairs.some((p) => samePair(p, c.pair))) { dropped.existing++; continue; }
    if (mockKeys.has(c.key) || mockPairs.some((p) => samePair(p, c.pair))) { dropped.fixture++; continue; }
    if (YMYL.some((r) => r.test(c.head.keyword))) { dropped.ymyl++; c.reason = 'ymyl'; continue; }
    if (c.volume < 500) { dropped.lowVol++; continue; }
    // spiky: the peak month is > 4× the median → event-driven, not evergreen
    if (c.monthly && c.monthly.length >= 6) {
      const sorted = [...c.monthly].sort((x, y) => x - y);
      const median = sorted[Math.floor(sorted.length / 2)] || 1;
      if (Math.max(...c.monthly) > 4 * median) { dropped.spiky++; continue; }
    }
    const kd = c.kd.length ? c.kd.reduce((s, x) => s + x, 0) / c.kd.length : 50;
    c.kdAvg = Math.round(kd);
    c.score = Math.round((Math.log10(Math.max(c.volume, 1)) * 20 + Math.max(0, 100 - kd) * 0.6 - (kd > 70 ? (kd - 70) * 0.5 : 0) + Math.min(c.cpc * 5, 25)) * 100) / 100;
    c.entities = [...c.entities].sort();
    c.slug = `${c.entities[0]}-vs-${c.entities[1]}`;
    if (DENY[c.slug]) { dropped.denied++; continue; }
    if (prior[c.slug]) c.serp = prior[c.slug];
    c.variants.sort((x, y) => y.volume - x.volume);
    kept.push(c);
  }
  kept.sort((x, y) => y.score - x.score);
  const out = {
    generatedAt: new Date().toISOString(),
    source: `DataForSEO Labs keyword_ideas (US/en) pulled ${cache.pulledAt}, $${cache.cost.toFixed(3)}`,
    funnel: { keywordsScanned: scanned, clusters: clusters.size, dropped, shortlist: kept.length, livePagesToday: live.size },
    shortlist: kept.map(({ kd, monthly, pair, ...c }) => c),
    queue: [],
  };
  fs.writeFileSync(QUEUE_OUT, JSON.stringify(out, null, 1));
  console.log(out.funnel);
  console.log(`\nTop 20:`);
  for (const c of kept.slice(0, 20)) console.log(`  ${c.score.toFixed(0).padStart(4)}  vol=${String(c.volume).padStart(7)} kd=${String(c.kdAvg).padStart(2)}  ${c.slug}  [${c.category}]`);
  console.log(`\nWrote ${path.relative(process.cwd(), QUEUE_OUT)}`);
}

async function serp() {
  const out = JSON.parse(fs.readFileSync(QUEUE_OUT, 'utf-8'));
  const n = Number(positional[0]) || 80;
  const target = Number(positional[1]) || 40;
  const todo = out.shortlist.filter((c) => !c.serp).slice(0, n);
  let cost = 0;
  for (const c of todo) {
    const rev = `${c.entities[1]}-vs-${c.entities[0]}`;
    const exists = await Promise.all([c.slug, rev].map((sl) => fetch(`${SITE}/api/faq/${sl}`, { method: 'HEAD' }).then((r) => r.status === 200).catch(() => false)));
    if (exists.some(Boolean)) { c.serp = { existing: true }; console.log(`  – already live: ${c.slug}`); continue; }
    try {
      const { result, cost: k } = await dfs('/serp/google/organic/live/advanced', [{
        keyword: c.head.keyword, location_code: 2840, language_code: 'en', device: 'desktop', depth: 10,
      }]);
      cost += k;
      const organic = (result?.items || []).filter((i) => i.type === 'organic').slice(0, 10);
      const domains = organic.map((i) => (i.domain || '').replace(/^www\./, ''));
      const majors = domains.filter((d) => MAJORS.some((m) => d === m || d.endsWith('.' + m))).length;
      const forums = domains.filter((d) => FORUMS.some((m) => d === m || d.endsWith('.' + m))).length;
      const paa = (result?.items || []).filter((i) => i.type === 'people_also_ask').flatMap((i) => (i.items || []).map((x) => x.title)).filter(Boolean);
      const ours = domains.some((d) => d.endsWith('aversusb.net'));
      c.serp = { majors, forums, topDomains: domains.slice(0, 6), paa: paa.slice(0, 8), ours, verifiedAt: new Date().toISOString() };
      console.log(`  ${majors <= 2 ? '✓' : '·'} majors=${majors} forums=${forums} ${c.slug}  ← ${domains.slice(0, 3).join(', ')}`);
    } catch (e) {
      console.log(`  ! ${c.slug}: ${e.message}`);
    }
  }
  const verified = out.shortlist.filter((c) => c.serp && !c.serp.ours && !c.serp.existing);
  out.queue = verified.filter((c) => c.serp.majors <= 2).slice(0, target).map((c) => ({
    slug: c.slug, headKeyword: c.head.keyword, volume: c.volume, kd: c.kdAvg, cpc: c.cpc, category: c.category, score: c.score,
    majorsInTop10: c.serp.majors, forumsInTop10: c.serp.forums, topDomains: c.serp.topDomains, paa: c.serp.paa,
    variants: c.variants.slice(0, 8).map((v) => v.keyword),
  }));
  out.contested = verified.filter((c) => c.serp.majors > 2).map((c) => c.slug);
  out.serpSpend = (out.serpSpend || 0) + cost;
  fs.writeFileSync(QUEUE_OUT, JSON.stringify(out, null, 1));
  console.log(`\nQueue: ${out.queue.length} (≤2 majors)  contested: ${out.contested.length}  SERP spend $${cost.toFixed(3)}`);
  console.log(`Wrote ${path.relative(process.cwd(), QUEUE_OUT)}`);
}

if (flag('--ideas')) await ideas();
else if (flag('--cluster')) await cluster();
else if (flag('--serp')) await serp();
else { console.error('Usage: --ideas [category] | --cluster | --serp [N] [target]'); process.exit(1); }
