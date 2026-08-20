/**
 * Higgsfield API client (platform.higgsfield.ai, OpenAPI 2.0.0)
 *
 * One async lifecycle for every model:
 *   POST /<model-path>  ->  { status: "queued", request_id, status_url, cancel_url }
 *   GET  /requests/{request_id}/status  ->  { status, images[] | video | audio, error }
 *
 * Auth header is literally:  Authorization: Key {api_key_id}:{api_key_secret}
 *
 * Env:
 *   HIGGSFIELD_API_KEY_ID
 *   HIGGSFIELD_API_KEY_SECRET
 *
 * Model paths we use (see MODELS below) are a curated subset of the ~48 the
 * gateway exposes. Higgsfield fronts Veo 3.1 / Sora 2 / Kling 2.5 / Seedance /
 * Hailuo alongside its own Soul (t2i) and DoP (i2v with camera motions), so a
 * single key covers both stills and motion.
 */

import fs from 'fs';
import path from 'path';

const BASE = 'https://platform.higgsfield.ai';

export const MODELS = {
  // --- stills -------------------------------------------------------------
  // Soul is Higgsfield's own t2i. 2K/4K, wide aspect-ratio support.
  soul: '/higgsfield-ai/soul/standard',
  // Style-locked variant: pass image_reference_url to keep a consistent look
  // across every still in one video (this is how we hold visual identity).
  soulReference: '/higgsfield-ai/soul/reference',
  // Gemini image (nano-banana) — best for *editing* an existing image, e.g.
  // compositing/cleaning a sourced photo. Accepts input_images[].
  nanoBanana: '/nano-banana',

  // --- stills -> motion ---------------------------------------------------
  // DoP = Higgsfield's Director-of-Photography model. The `motions` array is
  // its differentiator: named cinematic camera moves (up to 2 per shot).
  // This is our default b-roll engine — cheap, fast, purpose-built for
  // "make this still photo feel like a film shot".
  dop: '/higgsfield-ai/dop/standard',
  dopTurbo: '/higgsfield-ai/dop/turbo',
  dopLite: '/higgsfield-ai/dop/lite',
  // Premium fallbacks when a shot has to carry the cold open.
  kling: '/kling-video/v2.5-turbo/pro/image-to-video',
  veoFast: '/veo3.1/fast/image-to-video',
  seedance: '/bytedance/seedance/v1/pro/fast/image-to-video',
};

function creds() {
  const id = process.env.HIGGSFIELD_API_KEY_ID;
  const secret = process.env.HIGGSFIELD_API_KEY_SECRET;
  if (!id || !secret) {
    throw new Error(
      'Higgsfield credentials missing. Set HIGGSFIELD_API_KEY_ID and ' +
        'HIGGSFIELD_API_KEY_SECRET (create them at https://cloud.higgsfield.ai).'
    );
  }
  return `Key ${id}:${secret}`;
}

export function hasCredentials() {
  return Boolean(
    process.env.HIGGSFIELD_API_KEY_ID && process.env.HIGGSFIELD_API_KEY_SECRET
  );
}

async function request(url, init, { retries = 3 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          Authorization: creds(),
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
        signal: AbortSignal.timeout(60_000),
      });
      // 429/5xx are worth retrying; 4xx client errors are not.
      if (res.status === 429 || res.status >= 500) {
        throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
      }
      if (!res.ok) {
        const body = await res.text();
        const err = new Error(`Higgsfield ${res.status}: ${body.slice(0, 500)}`);
        err.fatal = true;
        throw err;
      }
      return res.json();
    } catch (err) {
      if (err.fatal) throw err;
      lastErr = err;
      if (attempt < retries) {
        await sleep(1500 * Math.pow(2, attempt));
      }
    }
  }
  throw lastErr;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Submit a generation and block until it resolves.
 * Returns the final status payload ({ status, images?, video?, audio? }).
 */
export async function generate(modelPath, body, opts = {}) {
  const { timeoutMs = 10 * 60_000, pollMs = 4000, label = modelPath } = opts;

  const submitted = await request(`${BASE}${modelPath}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const requestId = submitted.request_id;
  if (!requestId) {
    throw new Error(`No request_id from ${modelPath}: ${JSON.stringify(submitted)}`);
  }
  console.log(`    [hf] ${label} queued (${requestId})`);

  const statusUrl = submitted.status_url || `${BASE}/requests/${requestId}/status`;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await sleep(pollMs);
    const state = await request(statusUrl, { method: 'GET' });

    if (state.status === 'completed') return state;
    if (state.status === 'failed' || state.status === 'canceled') {
      throw new Error(`Higgsfield ${label} ${state.status}: ${state.error || 'no detail'}`);
    }
    // `nsfw` is a terminal reject — retrying the same prompt won't help, but
    // the caller can re-prompt, so surface it distinctly.
    if (state.status === 'nsfw') {
      const err = new Error(`Higgsfield ${label} rejected prompt as NSFW`);
      err.nsfw = true;
      throw err;
    }
  }
  throw new Error(`Higgsfield ${label} timed out after ${Math.round(timeoutMs / 1000)}s`);
}

function firstUrl(media) {
  if (!media) return null;
  if (Array.isArray(media)) return firstUrl(media[0]);
  return media.url || media.raw?.url || media.min?.url || null;
}

/** Text -> still image. Returns a URL. */
export async function soulImage({
  prompt,
  aspectRatio = '9:16',
  resolution = '2K',
  referenceUrl = null,
  styleStrength = 1,
}) {
  if (referenceUrl) {
    const out = await generate(
      MODELS.soulReference,
      {
        prompt,
        image_reference_url: referenceUrl,
        aspect_ratio: aspectRatio,
        resolution: resolution === '4K' ? '1080p' : '1080p',
        style_strength: styleStrength,
        enhance_prompt: true,
      },
      { label: 'soul/reference' }
    );
    return firstUrl(out.images);
  }
  const out = await generate(
    MODELS.soul,
    { prompt, aspect_ratio: aspectRatio, resolution, num_images: 1 },
    { label: 'soul/standard' }
  );
  return firstUrl(out.images);
}

/**
 * Still -> cinematic clip via DoP. `motions` are Higgsfield's named camera
 * moves (max 2). Returns a video URL.
 */
export async function dopClip({ prompt, imageUrl, motions = [], endImageUrl = null, seed = null }) {
  const body = { prompt, image_url: imageUrl, enhance_prompt: true };
  if (motions.length) body.motions = motions.slice(0, 2);
  if (endImageUrl) body.end_image_url = endImageUrl;
  if (seed !== null) body.seed = seed;
  const out = await generate(MODELS.dop, body, { label: 'dop/standard', timeoutMs: 12 * 60_000 });
  return firstUrl(out.video);
}

/** Still -> clip via Kling 2.5 Turbo Pro. Higher fidelity, slower/pricier. */
export async function klingClip({ prompt, imageUrl, duration = 5, negativePrompt = '' }) {
  const out = await generate(
    MODELS.kling,
    { prompt, image_url: imageUrl, duration, negative_prompt: negativePrompt, cfg_scale: 0.5 },
    { label: 'kling/2.5-turbo-pro', timeoutMs: 15 * 60_000 }
  );
  return firstUrl(out.video);
}

/** Still -> clip via Veo 3.1 Fast. Supports native 1080p and 9:16. */
export async function veoClip({
  prompt,
  imageUrl,
  duration = '6',
  aspectRatio = '9:16',
  resolution = '1080',
}) {
  const out = await generate(
    MODELS.veoFast,
    {
      prompt,
      image_url: imageUrl,
      duration: String(duration),
      aspect_ratio: aspectRatio,
      resolution: String(resolution),
      generate_audio: false, // we own the audio bed; model audio fights narration
    },
    { label: 'veo3.1/fast', timeoutMs: 15 * 60_000 }
  );
  return firstUrl(out.video);
}

/** Download any Higgsfield output URL to disk. */
export async function download(url, destPath) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const res = await fetch(url, { signal: AbortSignal.timeout(180_000) });
  if (!res.ok) throw new Error(`Download failed ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return destPath;
}
