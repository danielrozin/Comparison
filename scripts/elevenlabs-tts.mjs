/**
 * ElevenLabs TTS + Speech-to-Text helpers
 *
 * Uses:
 *   - POST /v1/text-to-speech/{voice_id}      → MP3 narration
 *   - POST /v1/speech-to-text                 → word-level timestamps (scribe_v1)
 *
 * Env vars:
 *   ELEVENLABS_API_KEY      (required)
 *   ELEVENLABS_VOICE_ID     (default: JBFqnCBsd6RMkjVDRZzb — George, narrator)
 *   ELEVENLABS_MODEL_ID     (default: eleven_v3 — latest expressive model)
 */

import fs from 'fs';

const DEFAULT_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'; // George — deep, warm narrator
const DEFAULT_MODEL_ID = 'eleven_v3';            // Latest expressive model
const API_BASE = 'https://api.elevenlabs.io';

export async function generateSpeech(text, outputPath, opts = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set');

  const voiceId = opts.voiceId || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const modelId = opts.modelId || process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL_ID;

  const url = `${API_BASE}/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
  const body = {
    text,
    model_id: modelId,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.4,
      use_speaker_boost: true,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    // Fallback: if v3 isn't available on this account, retry with multilingual v2
    if (modelId === 'eleven_v3' && (res.status === 400 || res.status === 422)) {
      console.log(`  ⚠ ${modelId} unavailable (${res.status}) — retrying with eleven_multilingual_v2`);
      return generateSpeech(text, outputPath, { ...opts, modelId: 'eleven_multilingual_v2' });
    }
    throw new Error(`ElevenLabs TTS failed: ${res.status} ${errText.slice(0, 200)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buf);
  return { bytes: buf.length, modelUsed: modelId, voiceId };
}

/**
 * Speech-to-text with word-level timestamps.
 * Returns array of { text, start, end } in seconds (matching whisper format
 * already consumed by buildCaptionGroups in the generator).
 */
export async function transcribeAudio(audioPath, opts = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set');

  const url = `${API_BASE}/v1/speech-to-text`;
  const buf = fs.readFileSync(audioPath);
  const blob = new Blob([buf], { type: 'audio/mpeg' });

  const form = new FormData();
  form.append('file', blob, 'narration.mp3');
  form.append('model_id', opts.modelId || 'scribe_v1');
  form.append('timestamps_granularity', 'word');
  form.append('language_code', opts.languageCode || 'en');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ElevenLabs STT failed: ${res.status} ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  // ElevenLabs Scribe response: { text, words: [{ text, start, end, type }, ...] }
  const words = (data.words || [])
    .filter((w) => w.type === 'word' || (!w.type && w.text && w.text.trim()))
    .map((w) => ({
      text: w.text,
      start: typeof w.start === 'number' ? w.start : 0,
      end: typeof w.end === 'number' ? w.end : 0,
    }));
  return words;
}

/**
 * Get audio duration in seconds via ffprobe (lightweight, no decoding).
 */
import { execSync } from 'child_process';
export function getAudioDuration(audioPath) {
  try {
    const out = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`,
      { encoding: 'utf-8' },
    );
    return parseFloat(out.trim());
  } catch {
    return 0;
  }
}

/**
 * Synthesize per-word timings when STT is unavailable.
 * We KNOW the script text (we wrote it) and we know the audio duration —
 * distribute words across the duration weighted by syllable count, with
 * extra pause time after sentence-ending punctuation.
 */
export function synthesizeWordTimings(script, audioDuration, opts = {}) {
  const leadIn = opts.leadIn ?? 0.15;     // tiny silence at start of TTS
  const tailPad = opts.tailPad ?? 0.25;   // trailing silence
  const punctPause = opts.punctPause ?? 0.18; // extra weight per sentence end
  const usable = Math.max(0.5, audioDuration - leadIn - tailPad);

  const tokens = script.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  // Weight each word by syllable estimate (vowel groups), min 1, max 4
  const syllables = (w) => {
    const clean = w.toLowerCase().replace(/[^a-z']/g, '');
    if (!clean) return 1;
    const groups = clean.match(/[aeiouy]+/g);
    return Math.max(1, Math.min(4, groups ? groups.length : 1));
  };

  const weights = tokens.map((t) => {
    let w = syllables(t);
    if (/[.!?]$/.test(t)) w += punctPause * 4;  // pause weight
    else if (/[,;:]$/.test(t)) w += punctPause * 2;
    return w;
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const words = [];
  let t = leadIn;
  tokens.forEach((tok, i) => {
    const dur = (weights[i] / totalWeight) * usable;
    words.push({
      text: tok,
      start: +t.toFixed(3),
      end: +(t + dur * 0.85).toFixed(3),  // word "spoken" portion = 85% of slot
    });
    t += dur;
  });
  return words;
}
