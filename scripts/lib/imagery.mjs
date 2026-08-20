/**
 * Entity imagery resolver.
 *
 * Every comparison video needs two real pictures — one per entity — plus
 * optional badges (flag / logo). Text-on-black is what made the old renders
 * look cheap; full-bleed photography is the single biggest quality lever.
 *
 * Sourcing is tiered deliberately:
 *
 *   Tier 1  Wikimedia Commons / Wikipedia  — real people, real products, real
 *           places, historical events. Free, no API key, properly licensed
 *           (PD or CC), and *actually looks like the thing*. Generative models
 *           are a bad fit here: they mangle real likenesses, logos and text,
 *           and using a synthetic "Messi" raises publicity-rights problems a
 *           licensed press photo does not.
 *
 *   Tier 2  Higgsfield Soul (text-to-image) — abstract or conceptual matchups
 *           where no photograph exists or Commons has nothing usable
 *           (democracy vs communism, buying vs renting, yoga vs pilates).
 *           Prompted through one shared style reference so every still in a
 *           video belongs to the same world.
 *
 * We record attribution for every Tier 1 asset. CC-BY / CC-BY-SA require
 * credit, and YouTube descriptions are where it goes.
 */

const UA = 'aversusb-video-pipeline/3.0 (https://www.aversusb.net; info@aversusb.net)';
const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';

async function api(base, params) {
  const url = `${base}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`${base} -> HTTP ${res.status}`);
  return res.json();
}

/** Strip the analytics query Wikipedia appends to `original.source`. */
function cleanUrl(u) {
  if (!u) return null;
  return u.split('?')[0];
}

/**
 * Category-aware search hints. A country's Wikipedia lead image is its flag —
 * fine as a badge, useless as a full-bleed hero — so we go looking for scenery
 * instead. Same idea for companies (lead image is usually a logo or an office).
 */
const HERO_HINTS = {
  countries: (n) => [`${n} city night skyline`, `${n} famous landmark`, `${n} street`],
  country: (n) => [`${n} city night skyline`, `${n} famous landmark`, `${n} street`],
  automotive: (n) => [`${n} car front view`, `${n} vehicle`],
  technology: (n) => [`${n} product photo`, `${n} device`],
  gaming: (n) => [`${n} console hardware`, `${n}`],
  finance: (n) => [`${n}`],
  companies: (n) => [`${n} store front`, `${n} headquarters building`],
  brands: (n) => [`${n} store front`, `${n} product photo`],
  sports: (n) => [`${n}`],
  health: (n) => [`${n} exercise`, `${n}`],
};

/**
 * Categories whose Wikipedia lead image is reliably the *wrong kind of
 * picture* — a flag for a country, a logo or an office block for a company.
 * For these we always run a Commons search too and let the scorer choose,
 * rather than trusting the lead image just because it scored passably.
 */
const LEAD_IMAGE_UNRELIABLE = new Set([
  'countries',
  'country',
  'companies',
  'brands',
  'automotive',
  'technology',
  'gaming',
  'software',
  'finance',
]);

/**
 * Images we never want as a hero: icons, diagrams, charts, maps, flags — and
 * satellite/aerial plates, which Commons surfaces constantly for place names
 * and which read as a screensaver rather than a subject.
 *
 * Tested against the *decoded* URL, so it also catches Commons thumbnails of
 * vector files (".../3840px-Mercedes-Benz_Star.svg.png") that a `\.svg$`
 * anchor would miss.
 */
const HERO_BLOCKLIST =
  /\.svg[./]|\.svg$|logo|icon|flag[_ ]of|coat[_ ]of[_ ]arms|map[_ ]of|locator|diagram|chart|graph|seal[_ ]of|emblem|satellite|aster|landsat|sentinel-2|from[_ ]space|aerial[_ ]view|topograph|\.ogv$|\.webm$/i;

function scoreCandidate(url, width = 0, height = 0) {
  if (!url) return -1;
  let score = 0;
  // Strip the ?utm_* query Wikimedia appends before pattern-matching — with it
  // attached, a vector file reads as "....svg?utm_source=..." and every
  // extension anchor misses, which is how flag and logo SVGs were slipping
  // through as heroes.
  let decoded;
  try {
    decoded = decodeURIComponent(String(url).split('?')[0]);
  } catch {
    decoded = String(url).split('?')[0];
  }
  if (HERO_BLOCKLIST.test(decoded)) return -1;
  const px = width * height;
  if (px >= 2_000_000) score += 3;
  else if (px >= 800_000) score += 2;
  else if (px >= 300_000) score += 1;
  else if (px > 0) score -= 1;
  // Portrait / square crops survive a 9:16 frame far better than ultra-wide.
  if (height && width) {
    const ar = width / height;
    if (ar >= 0.55 && ar <= 0.9) score += 2; // portrait — ideal for Shorts
    else if (ar > 0.9 && ar <= 1.4) score += 1; // square-ish
    else if (ar > 2.2) score -= 1; // panorama, will crop badly
  }
  return score;
}

function parseExtMeta(extmetadata = {}) {
  const val = (k) => {
    const raw = extmetadata[k]?.value;
    if (!raw) return null;
    return String(raw)
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };
  return {
    artist: val('Artist'),
    license: val('LicenseShortName') || val('License'),
    licenseUrl: val('LicenseUrl'),
    credit: val('Credit'),
  };
}

/** Full metadata (dimensions + licence) for a list of Commons file titles. */
async function imageInfo(titles) {
  if (!titles.length) return [];
  const data = await api(COMMONS_API, {
    action: 'query',
    titles: titles.join('|'),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '2000',
  });
  const pages = data.query?.pages || {};
  return Object.values(pages)
    .map((p) => {
      const info = p.imageinfo?.[0];
      if (!info) return null;
      const meta = parseExtMeta(info.extmetadata);
      return {
        title: p.title,
        url: info.url,
        thumbUrl: info.thumburl || info.url,
        width: info.width,
        height: info.height,
        descriptionUrl: info.descriptionurl,
        ...meta,
      };
    })
    .filter(Boolean);
}

/** Wikipedia lead image for an article title. */
async function leadImage(entity) {
  try {
    const data = await api(WIKI_API, {
      action: 'query',
      titles: entity,
      prop: 'pageimages',
      piprop: 'original|name',
      redirects: '1',
    });
    const page = Object.values(data.query?.pages || {})[0];
    if (!page || page.missing !== undefined) return null;
    const original = page.original;
    if (!original) return null;
    return {
      resolvedTitle: page.title,
      fileTitle: page.pageimage ? `File:${page.pageimage}` : null,
      url: cleanUrl(original.source),
      width: original.width,
      height: original.height,
    };
  } catch {
    return null;
  }
}

/** Search Commons for usable photographs. */
async function commonsSearch(query, limit = 12) {
  try {
    const data = await api(COMMONS_API, {
      action: 'query',
      generator: 'search',
      gsrsearch: `${query} filetype:bitmap`,
      gsrnamespace: '6', // File:
      gsrlimit: String(limit),
    });
    const titles = Object.values(data.query?.pages || {}).map((p) => p.title);
    return imageInfo(titles.slice(0, limit));
  } catch {
    return [];
  }
}

/**
 * Commons full-text search is dangerously loose: "Japan city night skyline"
 * happily returns a photo of Singapore, and "China city night skyline"
 * returns Manhattan. Putting the wrong country on screen is a worse failure
 * than falling back to a flag, so every search hit must carry the entity's
 * own name in its file title before we will consider it.
 */
function matchesEntity(fileTitleOrUrl, entity) {
  let haystack;
  try {
    haystack = decodeURIComponent(fileTitleOrUrl);
  } catch {
    haystack = fileTitleOrUrl;
  }
  haystack = haystack.toLowerCase().replace(/[_\-–—]+/g, ' ');

  const stop = new Set(['the', 'of', 'and', 'de', 'la', 'el', 'a', 'an']);
  const tokens = entity
    .toLowerCase()
    .replace(/[_\-–—]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !stop.has(t));

  if (!tokens.length) return true;
  // Every meaningful token must appear — "World War II" must not match a
  // "World War I" file, and "Mercedes Benz" must not match a stray "Benz".
  return tokens.every((t) => haystack.includes(t));
}

/** Flag / logo badge — small mark shown next to the entity name. */
async function resolveBadge(entity) {
  const hits = await commonsSearch(`Flag of ${entity}`, 3);
  const flag = hits.find((h) => /flag[_ ]of/i.test(decodeURIComponent(h.url)));
  if (flag) return { url: flag.thumbUrl, kind: 'flag' };
  return null;
}

/**
 * Resolve one entity's hero image.
 * Returns { url, width, height, credit, license, sourceUrl, tier } or null.
 */
export async function resolveEntityImage(
  entity,
  { category = '', allowGenerative = true, searchFallback = false } = {}
) {
  const cat = String(category).toLowerCase();

  const asResult = (c) => ({
    url: c.thumbUrl || c.url,
    fullUrl: c.url,
    width: c.width,
    height: c.height,
    credit: c.artist || c.credit || 'Wikimedia Commons',
    license: c.license || 'See source',
    sourceUrl:
      c.descriptionUrl ||
      (c.title ? `https://commons.wikimedia.org/wiki/${encodeURIComponent(c.title)}` : null),
    tier: 1,
    origin: c.origin,
  });

  // --- Tier 1a: the article's own lead image -------------------------------
  // This is the one Wikimedia source we can genuinely trust: it is chosen by
  // editors *for that article*, so it is always actually of the subject.
  const lead = await leadImage(entity);
  let leadCandidate = null;
  if (lead?.fileTitle) {
    const [info] = await imageInfo([lead.fileTitle]);
    if (info) leadCandidate = { ...info, origin: 'wikipedia-lead' };
  } else if (lead?.url) {
    leadCandidate = {
      url: lead.url,
      thumbUrl: lead.url,
      width: lead.width,
      height: lead.height,
      origin: 'wikipedia-lead',
    };
  }

  const leadScore = leadCandidate
    ? scoreCandidate(leadCandidate.url, leadCandidate.width, leadCandidate.height)
    : -1;

  // Trust it unless it is blocklisted (flag/logo/map — score -1) or tiny.
  if (leadScore >= 2) return asResult(leadCandidate);

  // --- Tier 1b: constrained Commons search (opt-in) -----------------------
  // OFF by default, and deliberately so. Measured against real slugs, every
  // good hero came from the curated lead image and every wrong one came from
  // here: "Japan famous landmark" returns US Coast Guardsmen, "Amazon store
  // front" returns an IBM book cover sold on Amazon, "Bitcoin" returns a
  // Bitcoin *Cash* wallet. Relevance cannot be recovered by scoring, because
  // the images are large and well-shot — they are simply of the wrong thing.
  // A generated skyline is both safer and better-looking than a confident
  // picture of the wrong subject.
  if (!searchFallback) {
    return generativeOrWeak(entity, cat, allowGenerative, leadScore >= 0 ? leadCandidate : null, asResult);
  }

  // Commons full-text relevance is poor — searching "Japan famous landmark"
  // returns US Coast Guardsmen because "Japan" appears somewhere in the file
  // description. So a hit only counts if it names the entity AND names what
  // we actually asked for. Anything less and we would rather generate.
  const hintFn = HERO_HINTS[cat];
  const queries = hintFn ? hintFn(entity) : [entity];
  const searched = [];

  for (const q of queries) {
    const hintTerms = q
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 2 && !matchesEntity(t, entity));

    const hits = await commonsSearch(q, 10);
    for (const h of hits) {
      const title = decodeURIComponent(h.title || h.url).toLowerCase();
      if (!matchesEntity(h.title || h.url, entity)) continue;
      // Require at least one hint term in the title when we used a hint query.
      if (hintTerms.length && !hintTerms.some((t) => title.includes(t))) continue;
      searched.push({ ...h, origin: `commons:${q}` });
    }
    if (searched.some((c) => scoreCandidate(c.url, c.width, c.height) >= 4)) break;
  }

  const ranked = searched
    .map((c) => ({ ...c, score: scoreCandidate(c.url, c.width, c.height) }))
    .filter((c) => c.score >= 4)
    .sort((a, b) => b.score - a.score);

  if (ranked.length) return asResult(ranked[0]);

  return generativeOrWeak(entity, cat, allowGenerative, leadScore >= 0 ? leadCandidate : null, asResult);
}

/**
 * Last resort: generate the still with Higgsfield Soul, else fall back to a
 * weak-but-real lead image, else give up and let the renderer use a designed
 * typographic plate. `weak` is already filtered — a blocklisted flag or logo
 * never reaches here.
 */
async function generativeOrWeak(entity, cat, allowGenerative, weak, asResult) {
  const weakResult = () => (weak ? asResult(weak) : null);
  if (!allowGenerative) return weakResult();
  try {
    const { hasCredentials, soulImage } = await import('./higgsfield.mjs');
    if (!hasCredentials()) return weakResult();
    const url = await soulImage({
      prompt: generativePrompt(entity, cat),
      aspectRatio: '9:16',
      resolution: '2K',
    });
    if (!url) return weakResult();
    return {
      url,
      fullUrl: url,
      width: 1152,
      height: 2048,
      credit: 'Generated with Higgsfield Soul',
      license: 'AI-generated',
      sourceUrl: null,
      tier: 2,
      origin: 'higgsfield:soul',
    };
  } catch (err) {
    console.warn(`    [imagery] generative fallback failed for "${entity}": ${err.message}`);
    return weakResult();
  }
}

/** Prompt used when nothing photographic exists (abstract comparisons). */
export function generativePrompt(entity, category = '') {
  return [
    `Editorial cinematic photograph representing "${entity}".`,
    category ? `Subject area: ${category}.` : '',
    'Single clear subject, shallow depth of field, dramatic low-key lighting,',
    'deep near-black background, cool colour grade with subtle purple and cyan rim light,',
    'volumetric haze, shot on 85mm, high detail, no text, no logos, no watermarks,',
    'vertical composition with the subject in the upper two thirds so the lower third stays clean.',
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Resolve imagery for both sides of a comparison, in parallel.
 * Returns { a, b, badges: { a, b } }.
 */
export async function resolveComparisonImagery(entityA, entityB, { category = '' } = {}) {
  const [a, b] = await Promise.all([
    resolveEntityImage(entityA, { category }),
    resolveEntityImage(entityB, { category }),
  ]);

  let badges = { a: null, b: null };
  if (/countr/i.test(category)) {
    const [ba, bb] = await Promise.all([resolveBadge(entityA), resolveBadge(entityB)]);
    badges = { a: ba, b: bb };
  }
  return { a, b, badges };
}

/** Attribution block for the YouTube description. */
export function attributionLines(imagery) {
  const lines = [];
  for (const [key, img] of Object.entries(imagery)) {
    if (!img || img.tier !== 1) continue;
    const who = img.credit ? ` by ${img.credit}` : '';
    const lic = img.license ? ` (${img.license})` : '';
    lines.push(`Image ${key.toUpperCase()}${who}${lic}${img.sourceUrl ? ` — ${img.sourceUrl}` : ''}`);
  }
  return lines;
}
