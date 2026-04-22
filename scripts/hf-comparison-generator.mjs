/**
 * HyperFrames Comparison Video Generator (per-scene synced narration edition)
 *
 * Pure module — given comparison data + per-scene timings, produces:
 *   - 6 scene narration scripts (one per scene)
 *   - composite transcript (synthesized word timings, scene-offset)
 *   - index.html (HyperFrames composition, 1080x1920, ~40s, Data Drift)
 *
 * Viral framing applied per 2026 YouTube Shorts research:
 *   - 3-second question hook (open the loop)
 *   - Curiosity gap: tease the verdict early, reveal at end
 *   - Per-scene voiceover synced to visuals (one chunk = one scene)
 *   - Comment CTA on verdict ("WHO'S YOUR PICK?")
 *   - Confetti on winner reveal
 */

// ---------------------------------------------------------------------------
// Defaults — used when caller doesn't pass scene timings
// ---------------------------------------------------------------------------

export const SCENE_IDS = ['hook', 'quick', 'diffs', 'stats', 'pros', 'verdict'];

const DEFAULT_DURATIONS = {
  hook: 3.5, quick: 5.0, diffs: 9.0, stats: 8.0, pros: 8.0, verdict: 6.5,
};

export function defaultSceneTimings() {
  let t = 0;
  const out = {};
  SCENE_IDS.forEach((id) => {
    const d = DEFAULT_DURATIONS[id];
    out[id] = { start: t, end: t + d, audioStart: t + 0.1, audioFile: null, audioDuration: 0 };
    t += d;
  });
  return { timings: out, total: t };
}

// ---------------------------------------------------------------------------
// Narration scripts — one per scene
// ---------------------------------------------------------------------------

export function buildSceneScripts(data) {
  const { entityA, entityB, keyDifferences = [], stats = [], shortAnswer = '', verdict = '' } = data;
  const winner = pickOverallWinner(data);
  const winnerName = winner === 'a' ? entityA : winner === 'b' ? entityB : null;
  const aName = trim(entityA, 14);
  const bName = trim(entityB, 14);

  // Tally
  let aWins = 0, bWins = 0;
  [...keyDifferences, ...stats].forEach((r) => { if (r.winner === 'a') aWins++; else if (r.winner === 'b') bWins++; });

  // Hook — punchy question (curiosity gap)
  const hook = `${aName}, or ${bName}? Today we settle the debate, once and for all.`;

  // Quick — headline stat with framing
  const topDiff = keyDifferences[0] || stats[0];
  const quick = topDiff
    ? `Here's the short answer. On ${trim(topDiff.label, 6).toLowerCase()}, ${aName} comes in at ${formatStat(topDiff.entityAValue || topDiff.valueA)}, while ${bName} sits at ${formatStat(topDiff.entityBValue || topDiff.valueB)}.`
    : trimSentence(shortAnswer, 26);

  // Diffs — narrate the actual head-to-head categories
  const diffLabels = keyDifferences.slice(0, 3).map((d) => trim(d.label, 4)).join(', ');
  const diffsLine = diffLabels
    ? `Now let's break it down. We compared ${diffLabels}, and the contrast is clear.`
    : `Now let's break the matchup down, category by category.`;

  // Stats — name the tally to build curiosity
  const totalCompared = aWins + bWins;
  const statsLine = totalCompared > 0
    ? `Across every major metric, ${aName} takes ${aWins}, ${bName} takes ${bWins}. The numbers don't lie.`
    : `Across every major metric, the numbers tell the real story.`;

  // Pros — name a strength of each side
  const prosLine = `Of course, each one brings something the other can't match. Here's where they truly stand apart.`;

  // Verdict + CTA
  const verdictText = winnerName
    ? `Our verdict goes to ${winnerName}. But honestly? This one is yours to call. Drop your pick in the comments.`
    : `Honestly, this one is too close to call. Drop your pick in the comments and tell us who wins.`;

  return [
    { id: 'hook',    text: hook },
    { id: 'quick',   text: quick },
    { id: 'diffs',   text: diffsLine },
    { id: 'stats',   text: statsLine },
    { id: 'pros',    text: prosLine },
    { id: 'verdict', text: verdictText },
  ];
}

function trim(s, n) {
  if (!s) return '';
  return String(s).split(/\s+/).slice(0, n).join(' ').trim();
}

function trimSentence(text, maxWords) {
  if (!text) return '';
  const words = String(text).split(/\s+/).slice(0, maxWords);
  let out = words.join(' ').trim();
  if (!/[.!?]$/.test(out)) out += '.';
  return out;
}

function formatStat(v) {
  if (v == null) return '';
  return String(v).replace(/\s+/g, ' ').trim();
}

function pickOverallWinner(data) {
  const rows = [...(data.keyDifferences || []), ...(data.stats || [])];
  let a = 0, b = 0;
  rows.forEach((r) => { if (r.winner === 'a') a++; else if (r.winner === 'b') b++; });
  if (a > b) return 'a';
  if (b > a) return 'b';
  return 'tie';
}

// ---------------------------------------------------------------------------
// Caption grouping — same as before, supports per-word kinds
// ---------------------------------------------------------------------------

export function buildCaptionGroups(transcript, entities = {}) {
  if (!Array.isArray(transcript) || transcript.length === 0) return [];
  const aTok = (entities.entityA || '').toLowerCase().split(/\s+/).filter(Boolean);
  const bTok = (entities.entityB || '').toLowerCase().split(/\s+/).filter(Boolean);
  const classify = (text) => {
    const clean = text.replace(/[.,!?;:]/g, '').toLowerCase();
    if (aTok.includes(clean)) return 'entity-a';
    if (bTok.includes(clean)) return 'entity-b';
    if (/^\d+(\.\d+)?[%xk+]?$/i.test(text.replace(/[.,!?;:]/g, ''))) return 'number';
    if (/^[A-Z]{2,}[.!?,]?$/.test(text)) return 'caps';
    return 'plain';
  };
  const groups = [];
  let cur = { words: [], start: 0, end: 0 };
  const MAX = 4;
  const PAUSE = 0.35;
  transcript.forEach((w, i) => {
    if (cur.words.length === 0) cur.start = w.start;
    cur.words.push({ text: w.text, start: w.start, end: w.end, kind: classify(w.text) });
    cur.end = w.end;
    const next = transcript[i + 1];
    const gap = next ? next.start - w.end : Infinity;
    const endsSent = /[.!?]$/.test(w.text);
    const tooLong = cur.words.length >= MAX;
    if (endsSent || gap > PAUSE || tooLong) {
      groups.push({ words: cur.words, start: cur.start, end: cur.end + 0.08 });
      cur = { words: [], start: 0, end: 0 };
    }
  });
  if (cur.words.length > 0) groups.push({ words: cur.words, start: cur.start, end: cur.end + 0.08 });
  return groups;
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Mulberry32 deterministic PRNG (no Math.random — HF rule)
function prng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildConfetti(seed, count = 36) {
  const r = prng(seed);
  const colors = ['#7c3aed', '#06b6d4', '#fbbf24', '#f5f5fa', '#c4b5fd', '#67e8f9'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: r() * 1080,
    delay: r() * 0.35,
    fall: 1.4 + r() * 1.4,
    rot: -180 + r() * 360,
    rotEnd: -540 + r() * 1080,
    size: 8 + Math.floor(r() * 14),
    color: colors[Math.floor(r() * colors.length)],
    drift: -160 + r() * 320,
  }));
}

// ---------------------------------------------------------------------------
// Main HTML builder
// ---------------------------------------------------------------------------

/**
 * @param data - comparison data
 * @param opts.transcript - array of { text, start, end } in absolute timeline seconds
 * @param opts.scenes - array of { id, start, duration, audioFile, audioStart, audioDuration }
 * @param opts.totalDuration - composition total duration (seconds)
 * @param opts.withBgMusic - include bg-music.mp3 audio element
 */
export function buildIndexHtml(data, opts = {}) {
  const { entityA, entityB, shortAnswer = '', keyDifferences = [], stats = [], prosA = [], prosB = [], verdict = '' } = data;
  const transcript = opts.transcript || [];
  const withBgMusic = opts.withBgMusic !== false;

  // Timings: caller-provided or default
  const fallback = defaultSceneTimings();
  const sceneList = opts.scenes || SCENE_IDS.map((id) => ({
    id, ...fallback.timings[id],
  }));
  const sceneById = Object.fromEntries(sceneList.map((s) => [s.id, s]));
  const TOTAL = opts.totalDuration || sceneList.reduce((m, s) => Math.max(m, s.start + s.duration), 0);

  // Trim data to fit visual scenes
  const keyDiffsTrim = keyDifferences.slice(0, 4);
  const statsTrim = stats.slice(0, 6);
  const prosATrim = prosA.slice(0, 3);
  const prosBTrim = prosB.slice(0, 3);

  const captionGroups = buildCaptionGroups(transcript, { entityA, entityB });

  // Winner
  let aWins = 0, bWins = 0;
  [...keyDifferences, ...stats].forEach((row) => {
    if (row.winner === 'a') aWins++;
    else if (row.winner === 'b') bWins++;
  });
  const overallWinner = aWins > bWins ? 'a' : bWins > aWins ? 'b' : 'tie';
  const winnerName = overallWinner === 'a' ? entityA : overallWinner === 'b' ? entityB : 'Both';
  const winnerColorHex = overallWinner === 'a' ? '#7c3aed' : overallWinner === 'b' ? '#06b6d4' : '#fbbf24';

  // Confetti pieces (deterministic)
  const confetti = buildConfetti(entityA.length * 7919 + entityB.length * 31, 36);

  // Per-scene audio elements
  const audioElements = sceneList
    .filter((s) => s.audioFile && s.audioDuration > 0)
    .map((s, i) => `      <audio
        id="aud-${s.id}"
        class="clip"
        data-start="${s.audioStart.toFixed(2)}"
        data-duration="${(s.audioDuration + 0.15).toFixed(2)}"
        data-track-index="${10 + i}"
        src="${s.audioFile}"
        data-volume="1.0"
      ></audio>`).join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        margin: 0; width: 1080px; height: 1920px; overflow: hidden;
        background: #0a0a0a; font-family: 'Inter', sans-serif; color: #f5f5fa;
      }

      /* Background gradient mesh */
      .bg-mesh { position: absolute; inset: 0; background: #0a0a0a; overflow: hidden; }
      .bg-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.55; }
      .bg-orb.purple {
        width: 900px; height: 900px;
        background: radial-gradient(circle, rgba(124,58,237,0.85) 0%, rgba(124,58,237,0) 70%);
        top: -200px; left: -200px;
      }
      .bg-orb.cyan {
        width: 800px; height: 800px;
        background: radial-gradient(circle, rgba(6,182,212,0.7) 0%, rgba(6,182,212,0) 70%);
        bottom: -150px; right: -150px;
      }
      .bg-orb.violet {
        width: 700px; height: 700px;
        background: radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0) 70%);
        top: 40%; left: 30%;
      }
      .bg-noise { position: absolute; inset: 0; mix-blend-mode: overlay;
        background: radial-gradient(circle at 50% 50%, rgba(10,10,10,0) 0%, rgba(10,10,10,0.5) 100%); }

      .scene {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; justify-content: center; align-items: center;
        padding: 90px 60px; box-sizing: border-box;
      }

      .progress-track {
        position: absolute; top: 0; left: 0; height: 8px; width: 100%;
        background: rgba(255,255,255,0.08); z-index: 100;
      }
      .progress-fill {
        position: absolute; top: 0; left: 0; height: 100%; width: 0%;
        background: linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%);
        box-shadow: 0 0 20px rgba(124,58,237,0.6);
      }

      /* HOOK — viral question framing */
      .hook-question {
        font-family: 'Inter', sans-serif;
        font-weight: 900;
        font-size: 110px;
        line-height: 0.95;
        text-align: center;
        color: #fbbf24;
        text-shadow: 0 0 60px rgba(251,191,36,0.55);
        letter-spacing: -0.02em;
        margin-bottom: 40px;
      }
      .hook-vs-row { display: flex; flex-direction: column; align-items: center; gap: 14px; }
      .hook-entity {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700;
        font-size: 100px; line-height: 1.05; text-align: center; max-width: 940px;
      }
      .hook-entity.a { color: #c4b5fd; text-shadow: 0 0 50px rgba(124,58,237,0.7); }
      .hook-entity.b { color: #67e8f9; text-shadow: 0 0 50px rgba(6,182,212,0.7); }
      .hook-vs {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700;
        font-size: 90px; line-height: 1;
        background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
        -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        margin: 8px 0;
      }

      /* QUICK ANSWER */
      .eyebrow {
        font-family: 'Inter'; font-weight: 700; font-size: 28px;
        letter-spacing: 0.4em; text-transform: uppercase; color: #06b6d4;
        margin-bottom: 40px;
      }
      .quick-text {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700;
        font-size: 70px; line-height: 1.2; text-align: center; max-width: 940px;
        color: #f5f5fa;
      }

      .section-title {
        font-family: 'Inter'; font-weight: 700; font-size: 30px;
        letter-spacing: 0.4em; text-transform: uppercase; color: #94a3b8;
        margin-bottom: 40px; text-align: center;
      }

      /* H2H rows */
      .head-to-head { display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 940px; }
      .h2h-row {
        display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 24px;
        padding: 24px 28px; background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; backdrop-filter: blur(20px);
      }
      .h2h-label {
        grid-column: 1 / -1; font-family: 'Inter'; font-weight: 500; font-size: 22px;
        letter-spacing: 0.2em; text-transform: uppercase; color: #94a3b8; text-align: center;
      }
      .h2h-value {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 60px;
        line-height: 1.1; font-variant-numeric: tabular-nums; text-align: center; color: #f5f5fa;
      }
      .h2h-value.a-winner { color: #c4b5fd; text-shadow: 0 0 30px rgba(124,58,237,0.6); }
      .h2h-value.b-winner { color: #67e8f9; text-shadow: 0 0 30px rgba(6,182,212,0.6); }
      .h2h-vs { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 32px; color: #94a3b8; }

      /* STATS GRID */
      .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; width: 100%; max-width: 940px; }
      .stat-cell {
        padding: 28px 26px; background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08); border-radius: 22px; backdrop-filter: blur(20px);
      }
      .stat-cell.winner-a { border-color: rgba(124,58,237,0.5); background: rgba(124,58,237,0.08); }
      .stat-cell.winner-b { border-color: rgba(6,182,212,0.5); background: rgba(6,182,212,0.08); }
      .stat-label {
        font-family: 'Inter'; font-weight: 500; font-size: 18px;
        letter-spacing: 0.18em; text-transform: uppercase; color: #94a3b8; margin-bottom: 14px;
      }
      .stat-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
      .stat-name { font-family: 'Inter'; font-weight: 500; font-size: 20px; color: #94a3b8; }
      .stat-val {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 38px;
        font-variant-numeric: tabular-nums; color: #f5f5fa;
      }
      .stat-val.a-glow { color: #c4b5fd; }
      .stat-val.b-glow { color: #67e8f9; }

      /* PROS */
      .pros-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; width: 100%; max-width: 940px; }
      .pros-col {
        padding: 32px 26px; background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; backdrop-filter: blur(20px);
      }
      .pros-col.a { border-color: rgba(124,58,237,0.45); }
      .pros-col.b { border-color: rgba(6,182,212,0.45); }
      .pros-entity {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700;
        font-size: 38px; line-height: 1.1; margin-bottom: 26px; text-align: center;
      }
      .pros-col.a .pros-entity { color: #c4b5fd; text-shadow: 0 0 24px rgba(124,58,237,0.5); }
      .pros-col.b .pros-entity { color: #67e8f9; text-shadow: 0 0 24px rgba(6,182,212,0.5); }
      .pro-item {
        font-family: 'Inter'; font-weight: 500; font-size: 21px; line-height: 1.3; color: #f5f5fa;
        padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08);
        display: flex; gap: 12px;
      }
      .pro-item:last-child { border-bottom: none; }
      .pro-item::before { content: '+'; flex-shrink: 0; font-weight: 700; font-size: 22px; }
      .pros-col.a .pro-item::before { color: #c4b5fd; }
      .pros-col.b .pro-item::before { color: #67e8f9; }

      /* VERDICT */
      .verdict-eyebrow {
        font-family: 'Inter'; font-weight: 700; font-size: 28px;
        letter-spacing: 0.5em; text-transform: uppercase; color: #fbbf24;
        margin-bottom: 24px;
      }
      .verdict-winner {
        font-family: 'Space Grotesk', sans-serif; font-weight: 700;
        font-size: 130px; line-height: 1; text-align: center;
        max-width: 940px; margin-bottom: 30px;
        text-shadow: 0 0 80px ${winnerColorHex}cc; color: ${winnerColorHex};
      }
      .verdict-tally {
        display: flex; gap: 50px; justify-content: center; align-items: center;
        margin-bottom: 30px;
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 56px;
      }
      .tally-side { display: flex; flex-direction: column; align-items: center; gap: 6px; }
      .tally-name {
        font-family: 'Inter'; font-weight: 500; font-size: 20px;
        letter-spacing: 0.18em; text-transform: uppercase; color: #94a3b8;
      }
      .tally-num.a { color: #c4b5fd; }
      .tally-num.b { color: #67e8f9; }
      .tally-dash { color: #94a3b8; font-size: 56px; opacity: 0.5; }
      .verdict-cta-question {
        font-family: 'Inter'; font-weight: 900; font-size: 56px;
        line-height: 1.1; text-align: center; color: #fbbf24;
        text-shadow: 0 0 50px rgba(251,191,36,0.55);
        margin-bottom: 24px; letter-spacing: -0.01em;
      }
      .verdict-cta {
        font-family: 'Inter'; font-weight: 700; font-size: 26px;
        letter-spacing: 0.3em; text-transform: uppercase;
        padding: 20px 50px; color: #f5f5fa; border-radius: 100px;
        background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
        box-shadow: 0 0 50px rgba(124,58,237,0.5);
      }

      /* Confetti */
      .confetti-piece {
        position: absolute; top: -40px; border-radius: 2px; pointer-events: none;
      }

      /* CAPTIONS */
      .caption-track {
        position: absolute; left: 0; right: 0; bottom: 240px; text-align: center;
        pointer-events: none; z-index: 50;
      }
      .caption-group {
        display: inline-block; padding: 16px 36px;
        background: rgba(10,10,10,0.84); border-radius: 20px;
        border: 1px solid rgba(124,58,237,0.4);
        font-family: 'Space Grotesk', sans-serif; font-weight: 700;
        font-size: 48px; line-height: 1.2; max-width: 920px; opacity: 0;
        backdrop-filter: blur(8px); box-shadow: 0 12px 40px rgba(0,0,0,0.5);
      }
      .cap-word { display: inline-block; margin: 0 4px; color: #94a3b8; }
      .cap-word.spoken { color: #f5f5fa; }
      .cap-word.active { color: #06b6d4; text-shadow: 0 0 28px rgba(6,182,212,0.7); transform: scale(1.06); }
      .cap-word.entity-a.active { color: #c4b5fd; text-shadow: 0 0 32px rgba(124,58,237,0.85); }
      .cap-word.entity-a.spoken { color: #c4b5fd; }
      .cap-word.entity-b.active { color: #67e8f9; text-shadow: 0 0 32px rgba(6,182,212,0.85); }
      .cap-word.entity-b.spoken { color: #67e8f9; }
      .cap-word.number.active { color: #fbbf24; text-shadow: 0 0 32px rgba(251,191,36,0.85); transform: scale(1.12); }
      .cap-word.number.spoken { color: #fbbf24; }
      .cap-word.caps.active { color: #fbbf24; text-shadow: 0 0 36px rgba(251,191,36,0.9); transform: scale(1.15); }
      .cap-word.caps.spoken { color: #fbbf24; }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="${TOTAL.toFixed(2)}"
      data-width="1080"
      data-height="1920"
    >
      <div class="clip bg-mesh" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-track-index="0">
        <div class="bg-orb purple" id="orb-purple"></div>
        <div class="bg-orb cyan" id="orb-cyan"></div>
        <div class="bg-orb violet" id="orb-violet"></div>
        <div class="bg-noise"></div>
      </div>

      <div class="clip progress-track" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-track-index="5">
        <div class="progress-fill" id="progress-fill"></div>
      </div>

      <!-- HOOK — viral question (3s) -->
      <div id="scene-hook" class="clip scene" data-start="${sceneById.hook.start.toFixed(2)}" data-duration="${sceneById.hook.duration.toFixed(2)}" data-track-index="1">
        <div class="hook-question" id="h-q">WHO IS BETTER?</div>
        <div class="hook-vs-row">
          <div class="hook-entity a" id="h-a">${escapeHtml(entityA)}</div>
          <div class="hook-vs" id="h-vs">VS</div>
          <div class="hook-entity b" id="h-b">${escapeHtml(entityB)}</div>
        </div>
      </div>

      <!-- QUICK -->
      <div id="scene-quick" class="clip scene" data-start="${sceneById.quick.start.toFixed(2)}" data-duration="${sceneById.quick.duration.toFixed(2)}" data-track-index="2">
        <div class="eyebrow" id="q-eye">The Short Answer</div>
        <div class="quick-text" id="q-txt">${escapeHtml(trimSentence(shortAnswer, 28))}</div>
      </div>

      <!-- DIFFS -->
      <div id="scene-diffs" class="clip scene" data-start="${sceneById.diffs.start.toFixed(2)}" data-duration="${sceneById.diffs.duration.toFixed(2)}" data-track-index="1">
        <div class="section-title" id="d-title">Head to Head</div>
        <div class="head-to-head">
          ${keyDiffsTrim.map((d, i) => `
          <div class="h2h-row" id="d-row-${i}">
            <div class="h2h-label">${escapeHtml(d.label)}</div>
            <div class="h2h-value ${d.winner === 'a' ? 'a-winner' : ''}">${escapeHtml(formatStat(d.entityAValue))}</div>
            <div class="h2h-vs">vs</div>
            <div class="h2h-value ${d.winner === 'b' ? 'b-winner' : ''}">${escapeHtml(formatStat(d.entityBValue))}</div>
          </div>`).join('')}
        </div>
      </div>

      <!-- STATS -->
      <div id="scene-stats" class="clip scene" data-start="${sceneById.stats.start.toFixed(2)}" data-duration="${sceneById.stats.duration.toFixed(2)}" data-track-index="2">
        <div class="section-title" id="s-title">By the Numbers</div>
        <div class="stats-grid">
          ${statsTrim.map((s, i) => `
          <div class="stat-cell ${s.winner === 'a' ? 'winner-a' : s.winner === 'b' ? 'winner-b' : ''}" id="s-cell-${i}">
            <div class="stat-label">${escapeHtml(s.label)}</div>
            <div class="stat-row">
              <span class="stat-name">${escapeHtml(entityA.split(' ')[0])}</span>
              <span class="stat-val ${s.winner === 'a' ? 'a-glow' : ''}">${escapeHtml(formatStat(s.valueA))}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">${escapeHtml(entityB.split(' ')[0])}</span>
              <span class="stat-val ${s.winner === 'b' ? 'b-glow' : ''}">${escapeHtml(formatStat(s.valueB))}</span>
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- PROS -->
      <div id="scene-pros" class="clip scene" data-start="${sceneById.pros.start.toFixed(2)}" data-duration="${sceneById.pros.duration.toFixed(2)}" data-track-index="1">
        <div class="section-title" id="p-title">Strengths</div>
        <div class="pros-grid">
          <div class="pros-col a" id="p-col-a">
            <div class="pros-entity">${escapeHtml(entityA)}</div>
            ${prosATrim.map((p, i) => `<div class="pro-item" id="p-a-${i}">${escapeHtml(p)}</div>`).join('')}
          </div>
          <div class="pros-col b" id="p-col-b">
            <div class="pros-entity">${escapeHtml(entityB)}</div>
            ${prosBTrim.map((p, i) => `<div class="pro-item" id="p-b-${i}">${escapeHtml(p)}</div>`).join('')}
          </div>
        </div>
      </div>

      <!-- VERDICT + comment CTA -->
      <div id="scene-verdict" class="clip scene" data-start="${sceneById.verdict.start.toFixed(2)}" data-duration="${sceneById.verdict.duration.toFixed(2)}" data-track-index="2">
        <div class="verdict-eyebrow" id="v-eye">The Verdict</div>
        <div class="verdict-winner" id="v-winner">${escapeHtml(winnerName)}</div>
        <div class="verdict-tally" id="v-tally">
          <div class="tally-side">
            <div class="tally-name">${escapeHtml(entityA.split(' ')[0])}</div>
            <div class="tally-num a" id="v-tally-a">${aWins}</div>
          </div>
          <div class="tally-dash">—</div>
          <div class="tally-side">
            <div class="tally-name">${escapeHtml(entityB.split(' ')[0])}</div>
            <div class="tally-num b" id="v-tally-b">${bWins}</div>
          </div>
        </div>
        <div class="verdict-cta-question" id="v-q">WHO'S YOUR PICK?</div>
        <div class="verdict-cta" id="v-cta">Comment Below</div>

        <!-- Confetti pieces (deterministic, generated with seeded PRNG) -->
        ${confetti.map((c) => `<div class="confetti-piece" id="conf-${c.id}" style="left: ${c.x.toFixed(0)}px; width: ${c.size}px; height: ${c.size + 4}px; background: ${c.color};"></div>`).join('')}
      </div>

      <!-- CAPTIONS — per-word karaoke -->
      <div id="caption-track" class="clip caption-track" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-track-index="3">
        ${captionGroups.map((g, i) => `<div class="caption-group" id="cg-${i}">${
          g.words.map((w, wi) => `<span class="cap-word ${w.kind}" id="cw-${i}-${wi}">${escapeHtml(w.text)}</span>`).join('')
        }</div>`).join('')}
      </div>

      <!-- PER-SCENE NARRATION -->
${audioElements}

      ${withBgMusic ? `<audio
        id="bg-music"
        class="clip"
        data-start="0"
        data-duration="${TOTAL.toFixed(2)}"
        data-track-index="7"
        src="bg-music.mp3"
        data-volume="0.06"
      ></audio>` : ''}
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      const S = ${JSON.stringify(sceneById)};
      const TOTAL = ${TOTAL.toFixed(2)};
      const FADE = 0.35;

      // Background drift
      tl.to('#orb-purple', { x: 120, y: 80, duration: TOTAL, ease: 'sine.inOut' }, 0);
      tl.to('#orb-cyan',   { x: -100, y: -60, duration: TOTAL, ease: 'sine.inOut' }, 0);
      tl.to('#orb-violet', { x: -80, y: 120, duration: TOTAL, ease: 'sine.inOut' }, 0);
      tl.fromTo('#progress-fill', { width: '0%' }, { width: '100%', duration: TOTAL, ease: 'none' }, 0);

      // ---------- HOOK ----------
      tl.from('#h-q', { opacity: 0, y: 40, scale: 0.9, duration: 0.5, ease: 'power3.out' }, S.hook.start + 0.05);
      tl.from('#h-a', { opacity: 0, x: -60, duration: 0.5, ease: 'power3.out' }, S.hook.start + 0.45);
      tl.from('#h-vs', { opacity: 0, scale: 0.5, duration: 0.45, ease: 'power3.out' }, S.hook.start + 0.7);
      tl.from('#h-b', { opacity: 0, x: 60, duration: 0.5, ease: 'power3.out' }, S.hook.start + 0.85);

      // ---------- QUICK ----------
      tl.from('#scene-quick', { opacity: 0, filter: 'blur(12px)', duration: FADE, ease: 'sine.out' }, S.quick.start);
      tl.from('#q-eye', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.out' }, S.quick.start + 0.4);
      tl.from('#q-txt', { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' }, S.quick.start + 0.55);

      // ---------- DIFFS ----------
      tl.from('#scene-diffs', { opacity: 0, filter: 'blur(12px)', duration: FADE, ease: 'sine.out' }, S.diffs.start);
      tl.from('#d-title', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.out' }, S.diffs.start + 0.4);
      ${keyDiffsTrim.map((_, i) => `tl.from('#d-row-${i}', { opacity: 0, x: ${i % 2 === 0 ? -60 : 60}, duration: 0.55, ease: 'power3.out' }, S.diffs.start + ${0.55 + i * 0.22});`).join('\n      ')}

      // ---------- STATS ----------
      tl.from('#scene-stats', { opacity: 0, filter: 'blur(12px)', duration: FADE, ease: 'sine.out' }, S.stats.start);
      tl.from('#s-title', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.out' }, S.stats.start + 0.4);
      ${statsTrim.map((_, i) => `tl.from('#s-cell-${i}', { opacity: 0, scale: 0.85, duration: 0.5, ease: 'power3.out' }, S.stats.start + ${0.55 + i * 0.16});`).join('\n      ')}

      // ---------- PROS ----------
      tl.from('#scene-pros', { opacity: 0, filter: 'blur(12px)', duration: FADE, ease: 'sine.out' }, S.pros.start);
      tl.from('#p-title', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.out' }, S.pros.start + 0.4);
      tl.from('#p-col-a', { opacity: 0, x: -50, duration: 0.55, ease: 'power3.out' }, S.pros.start + 0.55);
      tl.from('#p-col-b', { opacity: 0, x: 50, duration: 0.55, ease: 'power3.out' }, S.pros.start + 0.7);
      ${prosATrim.map((_, i) => `tl.from('#p-a-${i}', { opacity: 0, y: 18, duration: 0.35, ease: 'power2.out' }, S.pros.start + ${1.0 + i * 0.13});`).join('\n      ')}
      ${prosBTrim.map((_, i) => `tl.from('#p-b-${i}', { opacity: 0, y: 18, duration: 0.35, ease: 'power2.out' }, S.pros.start + ${1.1 + i * 0.13});`).join('\n      ')}

      // ---------- VERDICT ----------
      tl.from('#scene-verdict', { opacity: 0, filter: 'blur(12px)', duration: FADE, ease: 'sine.out' }, S.verdict.start);
      tl.from('#v-eye', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.out' }, S.verdict.start + 0.4);
      tl.from('#v-winner', { opacity: 0, scale: 0.7, duration: 0.8, ease: 'power3.out' }, S.verdict.start + 0.65);
      tl.from('#v-tally', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' }, S.verdict.start + 1.4);
      tl.from('#v-q', { opacity: 0, y: 20, duration: 0.45, ease: 'power3.out' }, S.verdict.start + 1.9);
      tl.from('#v-cta', { opacity: 0, scale: 0.9, duration: 0.4, ease: 'power3.out' }, S.verdict.start + 2.25);
      tl.to('#v-winner', { scale: 1.04, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1, overwrite: 'auto' }, S.verdict.start + 2.6);

      // ---------- CONFETTI (deterministic) ----------
      const CONF = ${JSON.stringify(confetti)};
      CONF.forEach(function(c) {
        const sel = '#conf-' + c.id;
        const burstStart = S.verdict.start + 0.7 + c.delay;
        // start from above the frame, settle below
        tl.fromTo(sel,
          { y: -60, x: 0, rotation: c.rot, opacity: 1 },
          { y: 1980, x: c.drift, rotation: c.rotEnd, opacity: 0.9, duration: c.fall, ease: 'power1.in' },
          burstStart);
        tl.set(sel, { opacity: 0 }, burstStart + c.fall + 0.05);
      });

      // ---------- CAPTIONS ----------
      const GROUPS = ${JSON.stringify(captionGroups)};
      GROUPS.forEach(function(g, gi) {
        const groupSel = '#cg-' + gi;
        tl.fromTo(groupSel, { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power3.out' }, g.start);
        tl.to(groupSel, { opacity: 0, y: -10, scale: 0.98, duration: 0.15, ease: 'power2.in' }, Math.max(g.start + 0.22, g.end - 0.15));
        tl.set(groupSel, { opacity: 0, visibility: 'hidden' }, g.end + 0.01);
        g.words.forEach(function(w, wi) {
          const wSel = '#cw-' + gi + '-' + wi;
          tl.set(wSel, { className: 'cap-word ' + w.kind + ' active' }, w.start);
          tl.set(wSel, { className: 'cap-word ' + w.kind + ' spoken' }, Math.max(w.start + 0.1, w.end));
        });
        g.words.forEach(function(w, wi) {
          tl.set('#cw-' + gi + '-' + wi, { className: 'cap-word ' + w.kind }, g.end + 0.02);
        });
      });

      window.__timelines['main'] = tl;
    </script>
  </body>
</html>
`;
}

// Backwards-compat exports (in case anything imports the old names)
export const TOTAL_DURATION = 40;
export const SCENES = defaultSceneTimings().timings;
export const FADE_IN = 0.35;
export function buildNarrationScript(data) {
  // Concatenate per-scene scripts for legacy single-narration mode
  return buildSceneScripts(data).map((s) => s.text).join(' ');
}
