/**
 * Daily Video Pipeline (HyperFrames edition)
 *
 * Same data flow as scripts/daily-video-pipeline.mjs but renders with
 * HyperFrames instead of Remotion. Runs alongside the Remotion pipeline so
 * we can A/B the two formats.
 *
 * Flow per slug:
 *   1. Reuse data file (remotion/data/<slug>.json) or scrape+enrich via Tavily/Claude
 *   2. Build narration script → run `hyperframes tts` → narration.wav
 *   3. Run `hyperframes transcribe` → word-level transcript.json
 *   4. Generate index.html (Data Drift composition with synced captions)
 *   5. Run `hyperframes render` → MP4 (1080x1920, 40s)
 *   6. Copy to public/videos and upload to YouTube
 *   7. Append to upload log
 *
 * Usage:
 *   node scripts/daily-video-pipeline-hf.mjs                      # 5 slugs, full upload
 *   node scripts/daily-video-pipeline-hf.mjs --count 10
 *   node scripts/daily-video-pipeline-hf.mjs --dry-run            # render, no upload
 *   node scripts/daily-video-pipeline-hf.mjs --slug messi-vs-ronaldo
 *   node scripts/daily-video-pipeline-hf.mjs --slug ... --skip-tts  # mute version (faster)
 *
 * Env vars (same as Remotion pipeline):
 *   TAVILY_API_KEY, ANTHROPIC_API_KEY (for enrichment)
 *   YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
 */

import { google } from 'googleapis';
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildSceneScripts,
  buildIndexHtml,
  SCENE_IDS,
} from './hf-comparison-generator.mjs';
import { generateSpeech, transcribeAudio, getAudioDuration, synthesizeWordTimings } from './elevenlabs-tts.mjs';

// Load .env.local for local dev (Vercel injects in prod)
try {
  const envLocal = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env.local');
  if (fs.existsSync(envLocal)) {
    fs.readFileSync(envLocal, 'utf-8').split('\n').forEach((line) => {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    });
  }
} catch {}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const HF_PROJECT_DIR = path.join(ROOT_DIR, 'hyperframes/comparison-video');
const REMOTION_DATA_DIR = path.join(ROOT_DIR, 'remotion/data');
const OUTPUT_DIR = path.join(ROOT_DIR, 'Videos For Website');
const PUBLIC_VIDEO_DIR = path.join(ROOT_DIR, 'public/videos');
const UPLOAD_LOG = path.join(ROOT_DIR, 'src/data/video-uploads.json');
const BG_MUSIC_SRC = path.join(ROOT_DIR, 'public/assets/bg-music.mp3');

// Ensure dirs exist
[OUTPUT_DIR, PUBLIC_VIDEO_DIR, REMOTION_DATA_DIR, HF_PROJECT_DIR].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const skipTts = args.includes('--skip-tts');
const singleSlug = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null;
const countIdx = args.indexOf('--count');
const count = countIdx !== -1 ? parseInt(args[countIdx + 1], 10) : 5;
const ttsVoice = args.includes('--voice') ? args[args.indexOf('--voice') + 1] : 'am_michael';
const ttsSpeed = args.includes('--speed') ? args[args.indexOf('--speed') + 1] : '1.05';

// ---------------------------------------------------------------------------
// Upload log
// ---------------------------------------------------------------------------

function loadUploadLog() {
  if (fs.existsSync(UPLOAD_LOG)) return JSON.parse(fs.readFileSync(UPLOAD_LOG, 'utf-8'));
  return { uploads: [] };
}
function saveUploadLog(log) {
  fs.writeFileSync(UPLOAD_LOG, JSON.stringify(log, null, 2));
}

// ---------------------------------------------------------------------------
// Slug discovery + scrape (mirrors daily-video-pipeline.mjs)
// ---------------------------------------------------------------------------

async function fetchComparisonSlugs() {
  console.log('Fetching available comparison slugs...');
  try {
    const res = await fetch('https://www.aversusb.net/api/video-pipeline/slugs');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const slugs = data.slugs || [];
    console.log(`Found ${slugs.length} comparison pages`);
    return slugs;
  } catch (err) {
    console.error('Failed to fetch slugs:', err.message);
    return [];
  }
}

function titleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function guessCategory(slug) {
  const cats = {
    Automotive: ['bmw', 'mercedes', 'tesla', 'ford', 'toyota', 'honda', 'audi', 'porsche'],
    Sports: ['messi', 'ronaldo', 'lebron', 'jordan', 'nba', 'nfl', 'fifa', 'boxing', 'ufc'],
    Technology: ['iphone', 'samsung', 'pixel', 'macbook', 'laptop', 'gpu', 'cpu'],
    Gaming: ['ps5', 'xbox', 'nintendo', 'switch', 'pc-gaming', 'steam'],
    Countries: ['usa', 'china', 'japan', 'germany', 'france', 'india', 'brazil', 'uk'],
    Finance: ['bitcoin', 'ethereum', 'stock', 'crypto', 'bank'],
    Software: ['slack', 'teams', 'zoom', 'notion', 'trello', 'jira'],
  };
  for (const [cat, keys] of Object.entries(cats)) {
    if (keys.some((k) => slug.toLowerCase().includes(k))) return cat;
  }
  return 'General';
}

async function scrapeComparisonPage(slug) {
  console.log(`  Fetching data for: ${slug}`);
  const existingDataPath = path.join(REMOTION_DATA_DIR, `${slug}.json`);
  if (fs.existsSync(existingDataPath)) {
    const existing = JSON.parse(fs.readFileSync(existingDataPath, 'utf-8'));
    if (existing.keyDifferences?.length > 0 && existing.keyDifferences[0].label !== 'Overall Rating') {
      console.log('  Using existing data file');
      return existing;
    }
  }

  const entityA = titleCase(slug.split('-vs-')[0]?.replace(/-/g, ' ') || 'Entity A');
  const entityB = titleCase(slug.split('-vs-')[1]?.replace(/-/g, ' ') || 'Entity B');
  const category = guessCategory(slug);

  let shortAnswer = `A detailed comparison of ${entityA} vs ${entityB}.`;
  try {
    const res = await fetch(`https://www.aversusb.net/compare/${slug}`, { signal: AbortSignal.timeout(8000) });
    const html = await res.text();
    const m = html.match(/<meta name="description" content="([^"]+)"/i);
    if (m) shortAnswer = m[1].trim().slice(0, 220);
  } catch {}

  const tavilyKey = process.env.TAVILY_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (tavilyKey && anthropicKey) {
    console.log('  Enriching via Tavily + Claude...');
    try {
      const tavilyRes = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: tavilyKey,
          query: `${entityA} vs ${entityB} comparison stats differences 2026`,
          search_depth: 'basic',
          max_results: 3,
        }),
      });
      const td = await tavilyRes.json();
      const ctx = td.results?.map((r) => r.content).join('\n\n') || '';
      if (ctx.length > 100) {
        const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1500,
            messages: [{
              role: 'user',
              content: `Based on this research about ${entityA} vs ${entityB}, generate a JSON comparison. Return ONLY valid JSON, no markdown.\n\nResearch:\n${ctx.slice(0, 3000)}\n\nJSON format:\n{\n  "shortAnswer": "2-3 sentence summary (max 200 chars)",\n  "keyDifferences": [{"label": "...", "entityAValue": "...", "entityBValue": "...", "winner": "a"|"b"|"tie"}],\n  "stats": [{"label": "...", "valueA": "...", "valueB": "...", "winner": "a"|"b"|"tie"}],\n  "prosA": ["..."], "consA": ["..."],\n  "prosB": ["..."], "consB": ["..."],\n  "verdict": "2-3 sentences"\n}\n\nRules: 4-5 key differences, 6-8 stats, 3-4 pros each, 2-3 cons each. Use real data.`,
            }],
          }),
        });
        const ai = await aiRes.json();
        const txt = ai.content?.[0]?.text || '';
        const m = txt.match(/\{[\s\S]*\}/);
        if (m) {
          const parsed = JSON.parse(m[0]);
          return {
            title: `${entityA} vs ${entityB}`,
            entityA, entityB, category, slug,
            shortAnswer: parsed.shortAnswer || shortAnswer,
            keyDifferences: parsed.keyDifferences || [],
            stats: parsed.stats || [],
            prosA: parsed.prosA || [], consA: parsed.consA || [],
            prosB: parsed.prosB || [], consB: parsed.consB || [],
            verdict: parsed.verdict || '',
          };
        }
      }
    } catch (err) {
      console.log(`  Enrichment failed: ${err.message}`);
    }
  }

  console.log('  Using basic fallback data');
  return {
    title: `${entityA} vs ${entityB}`, entityA, entityB, category, slug, shortAnswer,
    keyDifferences: [
      { label: 'Overall Rating', entityAValue: 'Strong', entityBValue: 'Strong', winner: 'tie' },
      { label: 'Popularity', entityAValue: 'High', entityBValue: 'High', winner: 'tie' },
    ],
    stats: [
      { label: 'Overall Score', valueA: '8/10', valueB: '8/10', winner: 'tie' },
      { label: 'Popularity', valueA: 'High', valueB: 'High', winner: 'tie' },
    ],
    prosA: [`Strong in ${category.toLowerCase()}`, 'Good value'],
    prosB: ['Competitive features', 'Trusted'],
    consA: ['Some trade-offs'],
    consB: ['Some trade-offs'],
    verdict: `Both ${entityA} and ${entityB} are solid choices.`,
  };
}

// ---------------------------------------------------------------------------
// HyperFrames render
// ---------------------------------------------------------------------------

function runCmd(cmd, cwd, label) {
  console.log(`  [${label}] ${cmd}`);
  const r = spawnSync(cmd, { shell: true, cwd, stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`${label} failed (exit ${r.status})`);
}

function runCmdQuiet(cmd, cwd) {
  return spawnSync(cmd, { shell: true, cwd, encoding: 'utf-8' });
}

async function renderWithHyperFrames(slug, data) {
  // 1. Build per-scene narration scripts (one chunk per visual scene)
  const sceneScripts = buildSceneScripts(data);
  fs.writeFileSync(
    path.join(HF_PROJECT_DIR, 'script.txt'),
    sceneScripts.map((s) => `[${s.id}] ${s.text}`).join('\n'),
  );
  console.log('  Per-scene scripts:');
  sceneScripts.forEach((s) => console.log(`    [${s.id}] ${s.text}`));

  // Wipe stale per-scene audio files
  for (const id of SCENE_IDS) {
    const p = path.join(HF_PROJECT_DIR, `narration-${id}.mp3`);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  const transcriptPath = path.join(HF_PROJECT_DIR, 'transcript.json');
  if (fs.existsSync(transcriptPath)) fs.unlinkSync(transcriptPath);

  // 2. Generate per-scene TTS via ElevenLabs (eleven_v3)
  const sceneAudio = {};  // id → { file, durationS }
  let narrationGenerated = false;

  if (!skipTts && process.env.ELEVENLABS_API_KEY) {
    console.log(`  Generating per-scene ElevenLabs narration (model: ${process.env.ELEVENLABS_MODEL_ID || 'eleven_v3'})...`);
    try {
      for (const s of sceneScripts) {
        const filename = `narration-${s.id}.mp3`;
        const fullPath = path.join(HF_PROJECT_DIR, filename);
        await generateSpeech(s.text, fullPath);
        const dur = getAudioDuration(fullPath);
        sceneAudio[s.id] = { file: filename, durationS: dur, text: s.text };
        console.log(`    [${s.id}] ${dur.toFixed(2)}s`);
      }
      narrationGenerated = true;
    } catch (err) {
      console.log(`  ⚠ ElevenLabs TTS failed: ${err.message} — falling back to silent`);
      narrationGenerated = false;
    }
  } else if (skipTts) {
    console.log('  --skip-tts: rendering without narration/captions');
  } else {
    console.log('  ⚠ ELEVENLABS_API_KEY not set — silent video');
  }

  // 3. Compute scene timings: each scene = max(audio + hold, MIN_VISUAL[id])
  // so viewers always have time to read the data, even when narration is short.
  const LEAD_IN = 0.15;
  const HOLD_AFTER = 0.55;
  const OVERLAP = 0.3;

  // Minimum visual duration so the data is readable
  const MIN_VISUAL = { hook: 3.0, quick: 5.0, diffs: 8.5, stats: 8.5, pros: 7.5, verdict: 6.5 };
  const DEFAULT_DUR = { ...MIN_VISUAL };

  const scenes = [];
  const transcript = [];
  let cursor = 0;

  for (const s of sceneScripts) {
    const audio = sceneAudio[s.id];
    let visualDur, audioStart = 0, audioDuration = 0, audioFile = null;
    const minDur = MIN_VISUAL[s.id] || 5.0;

    if (audio && audio.durationS > 0) {
      const audioVisualNeed = LEAD_IN + audio.durationS + HOLD_AFTER;
      visualDur = Math.max(audioVisualNeed, minDur);
      audioStart = cursor + LEAD_IN;
      audioDuration = audio.durationS;
      audioFile = audio.file;

      const sceneWords = synthesizeWordTimings(s.text, audio.durationS);
      sceneWords.forEach((w) => {
        transcript.push({
          text: w.text,
          start: +(audioStart + w.start).toFixed(3),
          end: +(audioStart + w.end).toFixed(3),
        });
      });
    } else {
      visualDur = DEFAULT_DUR[s.id] || 5.0;
    }

    scenes.push({
      id: s.id,
      start: cursor,
      duration: visualDur,
      audioStart,
      audioDuration,
      audioFile,
    });
    cursor += visualDur - OVERLAP;
  }

  const totalDuration = scenes[scenes.length - 1].start + scenes[scenes.length - 1].duration;
  console.log(`  Composition: ${totalDuration.toFixed(2)}s (${scenes.length} scenes, ${transcript.length} caption words)`);
  if (transcript.length > 0) fs.writeFileSync(transcriptPath, JSON.stringify(transcript, null, 2));

  // 4. Copy bg music into project
  const hasBgMusic = fs.existsSync(BG_MUSIC_SRC);
  if (hasBgMusic) {
    fs.copyFileSync(BG_MUSIC_SRC, path.join(HF_PROJECT_DIR, 'bg-music.mp3'));
  } else {
    console.log('  WARNING: bg music not found at public/assets/bg-music.mp3');
  }

  // 5. Generate index.html
  const html = buildIndexHtml(data, {
    transcript,
    scenes,
    totalDuration,
    withBgMusic: hasBgMusic,
  });
  fs.writeFileSync(path.join(HF_PROJECT_DIR, 'index.html'), html);
  console.log(`  Composition built (${(html.length / 1024).toFixed(1)} KB)`);

  // 6. Lint
  const lintRes = runCmdQuiet('npx hyperframes lint', HF_PROJECT_DIR);
  if (lintRes.status !== 0) {
    console.error('  Lint failed:');
    console.error(lintRes.stdout);
    console.error(lintRes.stderr);
    throw new Error('hyperframes lint failed');
  }

  // 7. Render
  const videoTitle = `${data.entityA} vs ${data.entityB}`;
  const outputPath = path.join(OUTPUT_DIR, `${videoTitle}.mp4`);
  console.log(`  Rendering: ${videoTitle} (${totalDuration.toFixed(1)}s)...`);
  runCmd(
    `npx hyperframes render --output "${outputPath}" --quality standard --fps 30`,
    HF_PROJECT_DIR,
    'render',
  );

  // 8. Mirror to public/videos for embedding
  const publicPath = path.join(PUBLIC_VIDEO_DIR, `${slug}.mp4`);
  fs.copyFileSync(outputPath, publicPath);

  const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  console.log(`  Rendered: ${fileSize} MB → ${outputPath}`);

  return outputPath;
}

// ---------------------------------------------------------------------------
// YouTube upload (identical to Remotion pipeline)
// ---------------------------------------------------------------------------

function generateYouTubeMetadata(data) {
  const { entityA, entityB, category, shortAnswer } = data;
  const title = `${entityA} vs ${entityB} — Full Comparison 2026`;
  const hashtags = [
    `#${entityA.toLowerCase().replace(/\s+/g, '')}`,
    `#${entityB.toLowerCase().replace(/\s+/g, '')}`,
    `#${category.toLowerCase().replace(/\s+/g, '')}`,
    '#comparison',
    '#versus',
  ].join(' ');
  return { title: title.slice(0, 100), description: `${shortAnswer}\n\n${hashtags}` };
}

async function uploadToYouTube(videoPath, metadata) {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    console.log('  SKIP UPLOAD: YouTube credentials not configured');
    return null;
  }
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  const youtube = google.youtube({ version: 'v3', auth: oauth2 });
  console.log(`  Uploading: ${metadata.title}`);
  const res = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: { title: metadata.title, description: metadata.description, categoryId: '22' },
      status: { privacyStatus: 'public', selfDeclaredMadeForKids: false },
    },
    media: { body: fs.createReadStream(videoPath) },
  });
  const videoId = res.data.id;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  console.log(`  Uploaded: ${videoUrl}`);
  return { videoId, videoUrl };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('========================================');
  console.log('  Daily Video Pipeline (HyperFrames)');
  console.log(`  Mode: ${dryRun ? 'DRY RUN (no upload)' : 'FULL (render + upload)'}`);
  console.log(`  TTS: ${skipTts ? 'OFF' : `${ttsVoice} @ speed ${ttsSpeed}`}`);
  console.log(`  Count: ${singleSlug ? `single (${singleSlug})` : count}`);
  console.log('========================================\n');

  const log = loadUploadLog();
  const uploadedSlugs = new Set(log.uploads.filter((u) => u.youtubeVideoId).map((u) => u.slug));

  let slugs;
  if (singleSlug) {
    slugs = [singleSlug];
  } else {
    const all = await fetchComparisonSlugs();
    const fresh = all.filter((s) => !uploadedSlugs.has(s));
    console.log(`${fresh.length} comparisons without videos\n`);
    slugs = fresh.sort(() => Math.random() - 0.5).slice(0, count);
  }

  if (slugs.length === 0) {
    console.log('No new comparisons to process. Done!');
    return;
  }

  const results = [];
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    console.log(`\n[${i + 1}/${slugs.length}] ${slug}`);
    console.log('-'.repeat(50));

    const data = await scrapeComparisonPage(slug);
    if (!data) {
      console.log('  Skipped (scrape failed)');
      continue;
    }

    let videoPath;
    try {
      videoPath = await renderWithHyperFrames(slug, data);
    } catch (err) {
      console.log(`  Render failed: ${err.message}`);
      continue;
    }

    const metadata = generateYouTubeMetadata(data);

    let uploadResult = null;
    if (!dryRun) {
      try {
        uploadResult = await uploadToYouTube(videoPath, metadata);
      } catch (err) {
        console.log(`  Upload failed: ${err.message}`);
      }
    } else {
      console.log('  Dry run — skipping upload');
    }

    const entry = {
      slug,
      title: data.title,
      entityA: data.entityA,
      entityB: data.entityB,
      category: data.category,
      videoFile: path.basename(videoPath),
      renderer: 'hyperframes',
      youtubeTitle: metadata.title,
      youtubeDescription: metadata.description,
      youtubeVideoId: uploadResult?.videoId || null,
      youtubeUrl: uploadResult?.videoUrl || null,
      uploadedAt: new Date().toISOString(),
    };

    log.uploads.push(entry);
    saveUploadLog(log);
    results.push(entry);
    console.log(`  Done!`);
  }

  console.log('\n========================================');
  console.log('  PIPELINE COMPLETE');
  console.log('========================================');
  console.log(`  Videos rendered: ${results.length}`);
  console.log(`  Videos uploaded: ${results.filter((r) => r.youtubeVideoId).length}`);
  console.log(`  Output folder: ${OUTPUT_DIR}`);
  console.log('========================================\n');
}

main().catch((err) => {
  console.error('Pipeline error:', err);
  process.exit(1);
});
