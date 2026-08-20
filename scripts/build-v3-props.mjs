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

if (!fs.existsSync(SRC)) {
  console.error(`No comparison data at ${SRC}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(SRC, 'utf-8'));

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
  lines: {
    hook: script.hook,
    tape: script.tape,
    rounds: script.rounds,
    verdict: script.verdict,
  },
  youtubeTitle: script.youtubeTitle,
  youtubeDescription: script.youtubeDescription,
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
