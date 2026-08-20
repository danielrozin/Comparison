/**
 * Per-beat narration for the V3 comparison video.
 *
 * One MP3 per beat rather than one long track, for a specific reason: the
 * scene lengths then follow the voice instead of the voice being crammed into
 * fixed six-second slots. A line that needs 7.4 seconds gets 7.4 seconds, and
 * a short one doesn't leave the viewer staring at a held frame.
 *
 * Every clip is measured with ffprobe after generation — never estimated from
 * word count, which drifts badly on numbers ("899" is one word and most of a
 * second) and on names.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawnSync } from 'child_process';
import './env.mjs';
import { generateSpeech } from '../elevenlabs-tts.mjs';

export const FPS = 30;

/**
 * Breathing room around each line, in seconds.
 *
 * These add up to the gap between spoken lines. At 0.35 + 0.85 the pauses
 * measured 1.2s, which reads as hesitant in a 45-second social cut — tightened
 * so the edit keeps pressure between rounds.
 */
const LEAD_IN = 0.3;
const TAIL_OUT = 0.55;

/** Floors, so a very short line still holds long enough to read the stat. */
const MIN_SECONDS = {
  cold: 4.0,
  tape: 5.0,
  round: 5.0,
  verdict: 6.5,
};

export function hasCredentials() {
  return Boolean(process.env.ELEVENLABS_API_KEY);
}

/** True duration of an audio file, in seconds. */
export function audioDuration(file) {
  const r = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
    { encoding: 'utf-8' }
  );
  const n = Number(String(r.stdout || '').trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

const toFrames = (seconds) => Math.round(seconds * FPS);

/**
 * Generate narration for every beat and return the clip paths plus the scene
 * timings they imply.
 *
 * Returns { audio, timings, totalSeconds, voiceId, modelUsed } or null when no
 * key is configured — the caller then renders silent with default timings.
 */
export async function narrateComparison(lines, { outDir, publicPrefix, voiceId } = {}) {
  if (!hasCredentials()) {
    console.warn('    [tts] ELEVENLABS_API_KEY not set — rendering silent');
    return null;
  }

  fs.mkdirSync(outDir, { recursive: true });

  const beats = [
    { id: 'cold', text: lines.hook, kind: 'cold' },
    { id: 'tape', text: lines.tape, kind: 'tape' },
    ...(lines.rounds || []).map((text, i) => ({ id: `round-${i + 1}`, text, kind: 'round' })),
    { id: 'verdict', text: lines.verdict, kind: 'verdict' },
  ].filter((b) => b.text && String(b.text).trim().length > 1);

  const results = [];
  for (const beat of beats) {
    const file = path.join(outDir, `${beat.id}.mp3`);
    // Cache on the exact text + voice: re-rendering a slug for a layout tweak
    // should not re-spend ElevenLabs characters on identical narration.
    const stampFile = path.join(outDir, `${beat.id}.hash`);
    const stamp = crypto
      .createHash('sha256')
      .update(`${beat.text}|${voiceId || process.env.ELEVENLABS_VOICE_ID || ''}`)
      .digest('hex')
      .slice(0, 16);

    if (fs.existsSync(file) && fs.existsSync(stampFile) &&
        fs.readFileSync(stampFile, 'utf-8').trim() === stamp) {
      const cachedSeconds = audioDuration(file);
      if (cachedSeconds) {
        const held = Math.max(MIN_SECONDS[beat.kind], cachedSeconds + LEAD_IN + TAIL_OUT);
        results.push({ ...beat, file, seconds: cachedSeconds, held, modelUsed: 'cached', voiceId });
        console.log(`    [tts] ${beat.id.padEnd(9)} ${cachedSeconds.toFixed(2)}s speech -> ${held.toFixed(2)}s scene (cached)`);
        continue;
      }
    }

    let meta;
    try {
      meta = await generateSpeech(beat.text, file, voiceId ? { voiceId } : {});
      fs.writeFileSync(stampFile, stamp);
    } catch (err) {
      console.warn(`    [tts] ${beat.id} failed: ${err.message}`);
      return null; // partial narration is worse than none — fail the whole set
    }
    const seconds = audioDuration(file);
    if (!seconds) {
      console.warn(`    [tts] ${beat.id} produced unreadable audio`);
      return null;
    }
    const held = Math.max(MIN_SECONDS[beat.kind], seconds + LEAD_IN + TAIL_OUT);
    results.push({ ...beat, file, seconds, held, modelUsed: meta.modelUsed, voiceId: meta.voiceId });
    console.log(`    [tts] ${beat.id.padEnd(9)} ${seconds.toFixed(2)}s speech -> ${held.toFixed(2)}s scene`);
  }

  const byId = (id) => results.find((r) => r.id === id);
  const roundResults = results.filter((r) => r.kind === 'round');

  const rel = (r) => (publicPrefix ? `${publicPrefix}/${path.basename(r.file)}` : r.file);

  return {
    audio: {
      cold: byId('cold') ? rel(byId('cold')) : null,
      tape: byId('tape') ? rel(byId('tape')) : null,
      rounds: roundResults.map(rel),
      verdict: byId('verdict') ? rel(byId('verdict')) : null,
    },
    timings: {
      cold: toFrames(byId('cold')?.held ?? MIN_SECONDS.cold),
      tape: toFrames(byId('tape')?.held ?? MIN_SECONDS.tape),
      rounds: roundResults.map((r) => toFrames(r.held)),
      verdict: toFrames(byId('verdict')?.held ?? MIN_SECONDS.verdict),
      leadInFrames: toFrames(LEAD_IN),
    },
    totalSeconds: results.reduce((sum, r) => sum + r.held, 0),
    voiceId: results[0]?.voiceId,
    modelUsed: results[0]?.modelUsed,
  };
}
