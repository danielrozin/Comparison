/**
 * Build V3 render props for a comparison slug.
 *
 *   node scripts/build-v3-props.mjs messi-vs-ronaldo
 *
 * Reads the existing comparison data (remotion/data/<slug>.json), resolves a
 * hero photograph per entity, writes remotion/v3/data/<slug>.json ready for
 * `remotion render`.
 *
 * Images are downloaded into public/video-assets/<slug>/ so the render is
 * offline and reproducible — pulling straight from upload.wikimedia.org during
 * a render means a flaky frame is a flaky video.
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { resolveComparisonImagery, attributionLines } from './lib/imagery.mjs';
import { writeScript } from './lib/scriptwriter.mjs';
import { narrateComparison, usage as ttsUsage } from './lib/narration.mjs';
import { usage as claudeUsage, usageCostUsd } from './lib/scriptwriter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// .env.local for local runs (Higgsfield / Anthropic keys)
try {
  const envLocal = path.join(ROOT, '.env.local');
  if (fs.existsSync(envLocal)) {
    for (const line of fs.readFileSync(envLocal, 'utf-8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
} catch {}

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/build-v3-props.mjs <slug>');
  process.exit(1);
}

const SRC = path.join(ROOT, 'remotion/data', `${slug}.json`);
const OUT_DIR = path.join(ROOT, 'remotion/v3/data');
const ASSET_DIR = path.join(ROOT, 'public/video-assets', slug);

/**
 * Comparison data, local fixture first, live site second.
 *
 * Only 64 of the 141 slugs the pipeline is offered have a fixture in
 * remotion/data/, so requiring one failed on 55% of the catalogue. The API
 * serves the same source /slugs is derived from, which keeps the list of what
 * exists and the data for it from disagreeing.
 */
async function loadComparisonData() {
  if (fs.existsSync(SRC)) {
    const local = JSON.parse(fs.readFileSync(SRC, 'utf-8'));
    if (local.entityA && local.entityB) {
      console.log('  data: local fixture');
      return local;
    }
  }

  const url = `https://www.aversusb.net/api/video-pipeline/data?slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) {
    throw new Error(`No comparison data for "${slug}" (local fixture missing, API returned ${res.status})`);
  }
  const remote = await res.json();
  if (!remote.entityA || !remote.entityB) {
    throw new Error(`API data for "${slug}" is missing entities`);
  }
  console.log('  data: fetched from site');

  // Cache it so a re-render does not depend on the site being up.
  fs.mkdirSync(path.dirname(SRC), { recursive: true });
  fs.writeFileSync(SRC, JSON.stringify(remote, null, 2));
  return remote;
}

const data = await loadComparisonData();

/** Download a remote image next to the render so the render never hits the network. */
async function localise(image, name) {
  if (!image?.url) return image;
  try {
    fs.mkdirSync(ASSET_DIR, { recursive: true });
    const res = await fetch(image.url, {
      headers: { 'User-Agent': 'aversusb-video-pipeline/3.0 (info@aversusb.net)' },
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get('content-type') || '';
    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
    const file = path.join(ASSET_DIR, `${name}.${ext}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));

    // Wikimedia originals run to 5 MB / 5000 px. Decoding that on every one of
    // ~1350 frames dominates render time and buys nothing above 2160 px.
    const resized = path.join(ASSET_DIR, `${name}.jpg`);
    const r = spawnSync(
      'ffmpeg',
      ['-y', '-v', 'error', '-i', file, '-vf', "scale='min(2160,iw)':-2", '-q:v', '3', resized],
      { encoding: 'utf-8' }
    );
    if (r.status === 0 && fs.existsSync(resized)) {
      if (resized !== file) fs.rmSync(file, { force: true });
      const kb = Math.round(fs.statSync(resized).size / 1024);
      console.log(`  ${name}: downscaled -> ${kb} KB`);
      return { ...image, url: `video-assets/${slug}/${name}.jpg`, remoteUrl: image.url };
    }
    return { ...image, url: `video-assets/${slug}/${name}.${ext}`, remoteUrl: image.url };
  } catch (err) {
    console.warn(`  ! could not localise ${name}: ${err.message} — using remote URL`);
    return image;
  }
}

const stats = (data.stats?.length ? data.stats : data.keyDifferences || []).map((s) => ({
  label: s.label,
  valueA: s.valueA ?? s.entityAValue,
  valueB: s.valueB ?? s.entityBValue,
  winner: s.winner ?? null,
}));

const rounds = stats.slice(0, 5);

console.log(`Building V3 props for ${slug} (${data.entityA} vs ${data.entityB})`);
console.log('  resolving imagery...');

// Script and imagery are independent — fetch them together.
const [imagery, script] = await Promise.all([
  resolveComparisonImagery(data.entityA, data.entityB, { category: data.category || '' }),
  writeScript(data, rounds),
]);
console.log(`  script: ${script.source}`);

for (const k of ['a', 'b']) {
  const i = imagery[k];
  console.log(
    `  ${k}: ${i ? `tier ${i.tier} · ${i.origin} · ${i.width}x${i.height}` : 'NONE (renders as designed plate)'}`
  );
}

const [imageA, imageB] = await Promise.all([
  localise(imagery.a, 'entity-a'),
  localise(imagery.b, 'entity-b'),
]);

// Narration drives the edit: each scene lasts as long as its line needs.
const lines = {
  hook: script.hook,
  tape: script.tape,
  rounds: script.rounds,
  verdict: script.verdict,
};

console.log('  narrating...');
const narration = await narrateComparison(lines, {
  outDir: path.join(ASSET_DIR, 'audio'),
  publicPrefix: `video-assets/${slug}/audio`,
});
if (narration) {
  console.log(`  narration: ${narration.totalSeconds.toFixed(1)}s across ${1 + 1 + rounds.length + 1} beats (${narration.modelUsed})`);
} else {
  console.log('  narration: none — silent render with default timings');
}

/**
 * The date the figures in this video were compiled. Every stat here is a
 * snapshot — career goals, GDP, prices and market share all move — so the
 * video says when it was true rather than implying it is true forever.
 */
const asOf = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const props = {
  title: data.title || `${data.entityA} vs ${data.entityB}`,
  entityA: data.entityA,
  entityB: data.entityB,
  category: data.category || '',
  shortAnswer: data.shortAnswer || '',
  stats: rounds,
  verdict: data.verdict || '',
  slug,
  imageA,
  imageB,
  lines,
  audio: narration?.audio ?? null,
  timings: narration?.timings ?? null,
  // Persisted for the page's VideoObject: the transcript is what lets an
  // answer engine quote the video, and the chapters become schema.org Clips
  // (Google "Key Moments"). Both are free here — we already measured them.
  transcript: narration?.transcript ?? null,
  chapters: narration?.chapters ?? null,
  youtubeTitle: script.youtubeTitle,
  youtubeDescription: [
    script.youtubeDescription,
    '',
    `Figures accurate as of ${asOf}. Statistics change over time — see the full, maintained comparison at https://www.aversusb.net/compare/${slug}`,
  ].join('\n'),
  asOf,
  narrationSrc: null,
  musicSrc: null,
  attribution: attributionLines({ a: imagery.a, b: imagery.b }),
};

fs.mkdirSync(OUT_DIR, { recursive: true });
const outFile = path.join(OUT_DIR, `${slug}.json`);
fs.writeFileSync(outFile, JSON.stringify(props, null, 2));
console.log(`Wrote ${path.relative(ROOT, outFile)}`);
if (props.attribution.length) {
  console.log('Attribution:');
  props.attribution.forEach((l) => console.log(`  ${l}`));
}

// --- what this video actually cost -----------------------------------------
const claudeUsd = usageCostUsd();
const billedChars = ttsUsage.characters;
console.log('\nCost');
console.log(
  `  Claude       ${claudeUsage.calls} calls · ${claudeUsage.inputTokens.toLocaleString()} in / ${claudeUsage.outputTokens.toLocaleString()} out tokens · $${claudeUsd.toFixed(4)}`
);
console.log(
  `  ElevenLabs   ${billedChars.toLocaleString()} chars billed` +
    (ttsUsage.cachedCharacters ? ` (${ttsUsage.cachedCharacters.toLocaleString()} served from cache)` : '')
);
const genImages = [imagery.a, imagery.b].filter((i) => i?.tier === 2).length;
console.log(`  Higgsfield   ${genImages} generated still(s) · ${(genImages * 0.12).toFixed(2)} credits`);
console.log(`  Figures as of ${asOf}`);
