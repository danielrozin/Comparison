/**
 * V3 visual system — "Head to Head".
 *
 * The V1/V2 look was text floating on a black gradient. It reads as a slide
 * deck, not a video: three of every eight sampled frames were an empty canvas
 * with one caption pill in it. V3 inverts that — every frame is a photograph,
 * and type sits on top of it inside fixed safe zones.
 */

export const FPS = 30;

export const C = {
  ink: '#05060a', // canvas floor
  a: '#8b5cf6', // Entity A — violet
  aDeep: '#4c1d95',
  b: '#06b6d4', // Entity B — cyan
  bDeep: '#0e7490',
  white: '#ffffff',
  text: '#f4f4f8',
  muted: '#9aa3b2',
  gold: '#fbbf24', // winner accent only
  win: '#34d399',
} as const;

export const FONT_DISPLAY = '"Space Grotesk", "Inter", system-ui, sans-serif';
export const FONT_BODY = '"Inter", system-ui, -apple-system, sans-serif';

/**
 * Safe zones, as a fraction of frame height. Nothing but background art may
 * enter them. The old renders put stat cards dead-centre and then dropped a
 * caption pill on the same pixels — this is the rule that prevents that.
 */
export const SAFE = {
  topPct: 0.11, // score chip / round label live here
  bottomPct: 0.2, // captions live here — no content may overlap
} as const;

/** Deterministic per-scene Ken Burns move (no Math.random — renders must be stable). */
export function kenBurns(seed: number) {
  const dirs = [
    { sx: 1.06, ex: 1.18, tx: -2, ty: -1.5 },
    { sx: 1.18, ex: 1.06, tx: 2, ty: 1.5 },
    { sx: 1.08, ex: 1.2, tx: 2.5, ty: -1 },
    { sx: 1.2, ex: 1.08, tx: -2.5, ty: 1 },
  ];
  return dirs[Math.abs(Math.round(seed)) % dirs.length];
}

/**
 * Split a stat value into a countable number and the text around it, so
 * "$716.92 billion", "4 titles" and "38%" all count up but keep their units.
 */
export function splitValue(raw: string | number | null | undefined) {
  const s = String(raw ?? '').trim();
  const m = s.match(/^([^\d\-+]*)([\-+]?[\d,]*\.?\d+)(.*)$/);
  if (!m) return { prefix: '', value: null as number | null, suffix: s, decimals: 0 };
  const numText = m[2].replace(/,/g, '');
  const value = Number(numText);
  if (!Number.isFinite(value)) return { prefix: '', value: null, suffix: s, decimals: 0 };
  const decimals = numText.includes('.') ? numText.split('.')[1].length : 0;
  return { prefix: m[1], value, suffix: m[3], decimals };
}

export function formatCount(n: number, decimals: number) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
