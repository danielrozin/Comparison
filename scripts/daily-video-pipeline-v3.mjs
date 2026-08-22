/**
 * Daily Video Pipeline — V3 "Head to Head"
 *
 * Replaces the HyperFrames pipeline. Per slug:
 *   1. build props   — Wikimedia photography, Claude script, ElevenLabs narration
 *   2. render        — Remotion, landscape (YouTube/site) and vertical (Shorts)
 *   3. encode        — web-sized copies into public/videos for the comparison page
 *   4. upload        — landscape to YouTube
 *   5. log           — src/data/video-uploads.json
 *
 * Usage:
 *   node scripts/daily-video-pipeline-v3.mjs --check-auth        # verify creds only
 *   node scripts/daily-video-pipeline-v3.mjs --slug messi-vs-ronaldo --dry-run
 *   node scripts/daily-video-pipeline-v3.mjs --count 3
 *   node scripts/daily-video-pipeline-v3.mjs --backfill --count 10
 *
 * Env: ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, YOUTUBE_CLIENT_ID,
 *      YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
 *      (optional) HIGGSFIELD_API_KEY_ID / _SECRET for generated stills
 */

import { google } from 'googleapis';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import './lib/env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MASTER_DIR = path.join(ROOT, 'Videos For Website/v3');
const PUBLIC_VIDEO_DIR = path.join(ROOT, 'public/videos');
const UPLOAD_LOG = path.join(ROOT, 'src/data/video-uploads.json');
const PROPS_DIR = path.join(ROOT, 'remotion/v3/data');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
};

const checkAuthOnly = flag('check-auth');
const dryRun = flag('dry-run');
const backfill = flag('backfill');
const singleSlug = value('slug');
const count = parseInt(value('count', '3'), 10);
/**
 * Public by default because the point of the pipeline is publishing, but
 * overridable — the first run on a fresh channel is worth watching land as
 * `unlisted` before it goes out to subscribers.
 */
const privacy = value('privacy', 'public');
const verticalToo = !flag('no-vertical');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function run(cmd, cmdArgs, opts = {}) {
  const res = spawnSync(cmd, cmdArgs, {
    cwd: ROOT,
    stdio: opts.quiet ? 'pipe' : 'inherit',
    encoding: 'utf-8',
    env: process.env,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.status !== 0) {
    const detail = opts.quiet ? `\n${res.stdout || ''}${res.stderr || ''}`.slice(-2000) : '';
    throw new Error(`${cmd} ${cmdArgs.slice(0, 3).join(' ')} exited ${res.status}${detail}`);
  }
  return res.stdout || '';
}

function loadUploadLog() {
  if (fs.existsSync(UPLOAD_LOG)) {
    try {
      return JSON.parse(fs.readFileSync(UPLOAD_LOG, 'utf-8'));
    } catch {}
  }
  return { uploads: [] };
}

function saveUploadLog(log) {
  fs.writeFileSync(UPLOAD_LOG, JSON.stringify(log, null, 2));
}

// ---------------------------------------------------------------------------
// YouTube
// ---------------------------------------------------------------------------

function youtubeClient() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  return google.youtube({ version: 'v3', auth: oauth2 });
}

/**
 * Verify the OAuth refresh token before spending render time.
 *
 * Worth its own step: a Google OAuth app left in "Testing" mode issues refresh
 * tokens that expire after seven days, so a token stored months ago can be
 * silently dead. Finding that out after rendering ten videos is expensive.
 */
async function checkYouTubeAuth() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    console.error('FAIL: YouTube credentials missing (need CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)');
    return false;
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });

  // The authoritative test is whether the refresh token still mints an access
  // token. Deliberately not channels.list: the stored grant only carries
  // `youtube.upload`, so a channel read fails on scope even when the token is
  // perfectly healthy — which would report a false failure and block uploads.
  try {
    const { token } = await oauth2.getAccessToken();
    if (!token) throw new Error('no access token returned');
    console.log('OK: refresh token is valid');
  } catch (err) {
    const msg = err?.response?.data?.error_description || err.message;
    console.error(`FAIL: ${msg}`);
    if (/invalid_grant/i.test(JSON.stringify(err?.response?.data || err.message))) {
      console.error(
        '      invalid_grant means the refresh token is dead. Usual cause: the Google Cloud\n' +
          '      OAuth consent screen is still in "Testing", which expires refresh tokens after\n' +
          '      7 days. Publish the app (Console > APIs & Services > OAuth consent screen >\n' +
          '      Publish app), then re-issue with: node scripts/youtube-auth.mjs'
      );
    }
    return false;
  }

  // Channel details are a nice-to-have; absence of scope is not a failure.
  try {
    const youtube = google.youtube({ version: 'v3', auth: oauth2 });
    const res = await youtube.channels.list({ part: 'snippet,statistics', mine: true });
    const ch = res.data.items?.[0];
    if (ch) {
      console.log(`    channel   ${ch.snippet.title} (${ch.id})`);
      console.log(`    videos    ${ch.statistics?.videoCount ?? '?'}`);
    }
  } catch {
    console.log('    (channel details unavailable — grant covers upload scope only)');
  }
  return true;
}

async function uploadToYouTube(videoPath, meta) {
  const youtube = youtubeClient();
  if (!youtube) {
    console.log('  SKIP UPLOAD: YouTube credentials not configured');
    return null;
  }
  console.log(`  uploading (${privacy}): ${meta.title}`);
  const res = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: meta.title.slice(0, 100),
        description: meta.description.slice(0, 4900),
        tags: meta.tags?.slice(0, 15),
        categoryId: '22', // People & Blogs
      },
      status: { privacyStatus: privacy, selfDeclaredMadeForKids: false },
    },
    media: { body: fs.createReadStream(videoPath) },
  });
  const videoId = res.data.id;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  console.log(`  uploaded: ${videoUrl}`);
  return { videoId, videoUrl };
}

// ---------------------------------------------------------------------------
// Slug selection
// ---------------------------------------------------------------------------

async function fetchSlugs() {
  try {
    const res = await fetch('https://www.aversusb.net/api/video-pipeline/slugs', {
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.slugs || [];
  } catch (err) {
    console.error(`Could not fetch slug list: ${err.message}`);
    return [];
  }
}

/**
 * Does this comparison actually have a page?
 *
 * The slug list comes from getAllMockSlugs(), but /compare/<slug> is rendered
 * from a different source, and the two disagree badly: 73 of the 141 slugs
 * offered have no live page. A video for one of those is worse than no video —
 * its description, its end card and its whole reason for existing point at a
 * 404, so it costs money to make, cannot drive the traffic it was built to
 * drive, and sends viewers to a dead end.
 */
async function pageIsLive(slug) {
  try {
    const res = await fetch(`https://www.aversusb.net/compare/${slug}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(15_000),
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

/** Filter to slugs with a live page, a few at a time. */
async function withLivePages(slugs) {
  const live = [];
  for (let i = 0; i < slugs.length; i += 10) {
    const batch = slugs.slice(i, i + 10);
    const results = await Promise.all(batch.map(async (s) => [s, await pageIsLive(s)]));
    results.forEach(([s, ok]) => ok && live.push(s));
  }
  return live;
}

/**
 * Which slugs to make videos for.
 *
 * Ordinary runs take pages that have no video yet. `--backfill` takes pages
 * whose video predates V3 — the old renders are text-on-black and were being
 * squashed into the page's 16:9 player, so they are worth replacing.
 */
async function pickSlugs(log) {
  if (singleSlug) return [singleSlug];

  const all = await fetchSlugs();
  if (!all.length) return [];

  const uploaded = new Set(log.uploads.filter((u) => u.youtubeVideoId).map((u) => u.slug));
  const v3Done = new Set(log.uploads.filter((u) => u.renderer === 'v3').map((u) => u.slug));

  const candidates = backfill
    ? all.filter((s) => fs.existsSync(path.join(PUBLIC_VIDEO_DIR, `${s}.mp4`)) && !v3Done.has(s))
    : all.filter((s) => !uploaded.has(s) && !v3Done.has(s));

  console.log(`${candidates.length} candidate${candidates.length === 1 ? '' : 's'} (${backfill ? 'pre-V3 video to replace' : 'no V3 video yet'})`);
  console.log('  checking which have a live page...');

  // Only check as far down the list as needed to fill the batch.
  const live = await withLivePages(candidates.slice(0, Math.max(count * 4, 20)));
  const skipped = Math.min(candidates.length, Math.max(count * 4, 20)) - live.length;
  if (skipped > 0) {
    console.log(`  skipped ${skipped} with no /compare page (nothing to send viewers to)`);
  }
  return live.slice(0, count);
}

// ---------------------------------------------------------------------------
// Per-slug production
// ---------------------------------------------------------------------------

/**
 * Human-readable chapter titles for the video's beats. "Round 3: Career
 * Assists" is what a viewer scanning Google's Key Moments needs to see; the
 * raw beat id is not.
 */
function buildChapterList(props) {
  const chapters = props.chapters ?? [];
  if (!chapters.length) return null;
  const stats = props.stats ?? [];
  return chapters.map((c) => {
    let name;
    if (c.kind === 'cold') name = `${props.entityA} vs ${props.entityB}`;
    else if (c.kind === 'tape') name = 'Tale of the tape';
    else if (c.kind === 'verdict') name = 'The verdict';
    else {
      const roundIndex = Number(String(c.id).split('-')[1]) - 1;
      const label = stats[roundIndex]?.label;
      name = label ? `Round ${roundIndex + 1}: ${label}` : `Round ${roundIndex + 1}`;
    }
    return { name, startOffset: Math.round(c.startOffset), endOffset: Math.round(c.endOffset) };
  });
}

/** Exact duration of a rendered master, in whole seconds. */
function durationSeconds(file) {
  const out = run('ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
    { quiet: true });
  const n = Number(String(out).trim());
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function encodeForWeb(master, dest, scale) {
  run(
    'ffmpeg',
    ['-y', '-v', 'error', '-i', master, '-vf', `scale=${scale}`,
     '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
     '-c:a', 'aac', '-b:a', '112k', '-ar', '48000', '-movflags', '+faststart', dest],
    { quiet: true }
  );
}

async function produce(slug, log) {
  console.log(`\n=== ${slug} ===`);

  // Guards explicit --slug runs, which bypass pickSlugs entirely.
  if (!(await pageIsLive(slug))) {
    throw new Error(
      `https://www.aversusb.net/compare/${slug} is not live — refusing to publish a video that links to a 404`
    );
  }
  fs.mkdirSync(MASTER_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_VIDEO_DIR, { recursive: true });

  // 1. props: imagery + script + narration
  console.log('  building props...');
  run('node', ['scripts/build-v3-props.mjs', slug]);

  const propsFile = path.join(PROPS_DIR, `${slug}.json`);
  if (!fs.existsSync(propsFile)) throw new Error(`props not written for ${slug}`);
  const props = JSON.parse(fs.readFileSync(propsFile, 'utf-8'));

  // A silent upload is the failure this pipeline was gated on for months.
  if (!props.audio?.verdict) {
    throw new Error('narration missing — refusing to produce a silent video');
  }

  // 2. render masters
  //
  // `--props` is not optional. Without it every render silently falls back to
  // the composition's defaultProps — which are the messi-vs-ronaldo demo — so
  // the pipeline produces the same video under every slug's filename. It only
  // showed up in CI because that box had no cached messi assets to 404 on.
  const propsArg = `--props=${propsFile}`;

  const landscapeMaster = path.join(MASTER_DIR, `${slug}-landscape.mp4`);
  console.log('  rendering landscape...');
  run('npx', ['remotion', 'render', 'remotion/index.tsx', 'ComparisonV3Landscape',
              landscapeMaster, propsArg, '--public-dir=public', '--log=error', '--crf=20'],
      { quiet: true });

  let verticalMaster = null;
  if (verticalToo) {
    verticalMaster = path.join(MASTER_DIR, `${slug}-vertical.mp4`);
    console.log('  rendering vertical...');
    run('npx', ['remotion', 'render', 'remotion/index.tsx', 'ComparisonV3',
                verticalMaster, propsArg, '--public-dir=public', '--log=error', '--crf=20'],
        { quiet: true });
  }

  // 3. web copies for the comparison page (its player is a 16:9 box)
  console.log('  encoding for web...');
  encodeForWeb(landscapeMaster, path.join(PUBLIC_VIDEO_DIR, `${slug}.mp4`), '1280:720');
  if (verticalMaster) {
    encodeForWeb(verticalMaster, path.join(PUBLIC_VIDEO_DIR, `${slug}-vertical.mp4`), '720:1280');
  }
  run('ffmpeg', ['-y', '-v', 'error', '-ss', '3', '-i', path.join(PUBLIC_VIDEO_DIR, `${slug}.mp4`),
                 '-frames:v', '1', '-q:v', '4', path.join(PUBLIC_VIDEO_DIR, `${slug}-poster.jpg`)],
      { quiet: true });

  // 4. upload
  const description = [
    props.youtubeDescription,
    '',
    ...(props.attribution?.length ? ['Image credits:', ...props.attribution, ''] : []),
    `Full comparison: https://www.aversusb.net/compare/${slug}`,
  ].join('\n');

  const meta = {
    title: props.youtubeTitle,
    description,
    tags: [props.entityA, props.entityB, `${props.entityA} vs ${props.entityB}`, 'comparison', props.category]
      .filter(Boolean),
  };

  let upload = null;
  if (dryRun) {
    console.log(`  DRY RUN — would upload "${meta.title}"`);
  } else {
    upload = await uploadToYouTube(landscapeMaster, meta);
  }

  // 5. log
  // Recorded so the page's VideoObject can state the real length. The schema
  // helper otherwise falls back to a hardcoded PT36S, which no longer matches
  // anything the pipeline produces now that scene timings follow the narration.
  const seconds = durationSeconds(landscapeMaster);

  log.uploads.push({
    slug,
    title: props.title,
    entityA: props.entityA,
    entityB: props.entityB,
    category: props.category,
    renderer: 'v3',
    asOf: props.asOf,
    videoFile: `${slug}.mp4`,
    durationSeconds: seconds,
    transcript: props.transcript ?? null,
    chapters: buildChapterList(props),
    youtubeTitle: meta.title,
    youtubeDescription: meta.description,
    youtubeVideoId: upload?.videoId ?? null,
    youtubeUrl: upload?.videoUrl ?? null,
    uploadedAt: new Date().toISOString(),
  });
  saveUploadLog(log);

  // Rebuild the page now. The log is committed by CI and Vercel redeploys, but
  // the comparison page is ISR-cached, so without this the video stays
  // invisible until the cache happens to expire — which is exactly why
  // usa-vs-china had a published video and an empty page.
  if (upload) await revalidate(slug);

  return upload;
}

/** Ask production to rebuild a comparison page after its video changes. */
async function revalidate(slug) {
  try {
    const res = await fetch('https://www.aversusb.net/api/revalidate-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paths: [`/compare/${slug}`],
        secret: process.env.REVALIDATION_SECRET,
      }),
      signal: AbortSignal.timeout(30_000),
    });
    console.log(`  revalidated /compare/${slug}: ${res.status}`);
  } catch (err) {
    console.warn(`  revalidate failed for ${slug}: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('========================================');
  console.log('  Daily Video Pipeline — V3 Head to Head');
  console.log(`  Mode:    ${dryRun ? 'DRY RUN (render only)' : `UPLOAD (${privacy})`}`);
  console.log(`  Cuts:    landscape${verticalToo ? ' + vertical' : ''}`);
  console.log('========================================\n');

  const authOk = await checkYouTubeAuth();
  if (checkAuthOnly) process.exit(authOk ? 0 : 1);
  if (!authOk && !dryRun) {
    console.error('\nRefusing to render: YouTube auth failed and this is not a dry run.');
    process.exit(1);
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    console.error('\nRefusing to render: ELEVENLABS_API_KEY is not set, and a silent video');
    console.error('is not shippable. Set the secret and re-run.');
    process.exit(1);
  }

  const log = loadUploadLog();
  const slugs = await pickSlugs(log);
  if (!slugs.length) {
    console.log('Nothing to produce.');
    return;
  }
  console.log(`\nProducing ${slugs.length}: ${slugs.join(', ')}`);

  const failed = [];
  for (const slug of slugs) {
    try {
      await produce(slug, log);
    } catch (err) {
      console.error(`  FAILED ${slug}: ${err.message}`);
      failed.push(slug);
    }
  }

  console.log('\n========================================');
  console.log(`  Done. ${slugs.length - failed.length}/${slugs.length} produced.`);
  if (failed.length) console.log(`  Failed: ${failed.join(', ')}`);
  console.log('========================================');
  if (failed.length === slugs.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
