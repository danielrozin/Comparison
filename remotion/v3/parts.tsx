import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT_BODY, FONT_DISPLAY, formatCount, kenBurns, SAFE, splitValue } from './theme';

/* ------------------------------------------------------------------ */
/* Backgrounds                                                         */
/* ------------------------------------------------------------------ */

/**
 * A photograph that fills the frame and never stops moving. Graded toward the
 * entity's colour, darkened top and bottom so type stays legible over any
 * image we happen to source.
 */
export const PhotoPlate: React.FC<{
  src?: string | null;
  tint: string;
  seed?: number;
  durationInFrames: number;
  focus?: 'top' | 'center';
  dim?: number;
}> = ({ src, tint, seed = 0, durationInFrames, focus = 'top', dim = 0.42 }) => {
  const frame = useCurrentFrame();
  const kb = kenBurns(seed);
  // Props carry either a remote URL or a path inside public/ — resolve the
  // latter through staticFile so renders work headless with --public-dir.
  const resolved = src && !/^(https?:|data:)/.test(src) ? staticFile(src) : src;
  const t = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(t, [0, 1], [kb.sx, kb.ex]);
  const x = interpolate(t, [0, 1], [0, kb.tx]);
  const y = interpolate(t, [0, 1], [0, kb.ty]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: C.ink }}>
      {resolved ? (
        <Img
          src={resolved}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: focus === 'top' ? '50% 22%' : '50% 50%',
            transform: `scale(${scale}) translate(${x}%, ${y}%)`,
            filter: 'saturate(1.05) contrast(1.06)',
          }}
        />
      ) : (
        // No photo available — a designed plate, never a blank canvas.
        <AbsoluteFill
          style={{
            background: `radial-gradient(120% 80% at 50% 25%, ${tint}55 0%, ${C.ink} 62%)`,
          }}
        />
      )}
      {/* Colour grade toward the entity hue. Kept deliberately light: at 0.28
          'color' blend the tint overrode skin tones and turned a cyan-side
          footballer visibly green. The side is signalled by the seam, the
          labels and the score chip — the photograph does not need to be dyed. */}
      <AbsoluteFill style={{ background: tint, mixBlendMode: 'color', opacity: 0.1 }} />
      <AbsoluteFill style={{ background: tint, mixBlendMode: 'soft-light', opacity: 0.22 }} />
      {/* legibility scrims — top for the score chip, bottom for captions */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(5,6,10,${0.78 * (dim / 0.42)}) 0%, rgba(5,6,10,0.12) 26%, rgba(5,6,10,0.30) 52%, rgba(5,6,10,0.92) 84%, rgba(5,6,10,0.98) 100%)`,
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(130% 90% at 50% 45%, rgba(5,6,10,0) 45%, rgba(5,6,10,0.75) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Two photographs meeting on an animated diagonal seam. */
export const SplitPlate: React.FC<{
  srcA?: string | null;
  srcB?: string | null;
  durationInFrames: number;
  lean?: number; // -1 = favour A, +1 = favour B, 0 = even
}> = ({ srcA, srcB, durationInFrames, lean = 0 }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const t = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {
    extrapolateRight: 'clamp',
  });
  // The seam drifts, so the frame is never static even when nothing animates.
  const seam = 50 + lean * 8 + Math.sin(t * Math.PI) * 1.6;

  const clipA = `polygon(0 0, ${seam + 6}% 0, ${seam - 6}% 100%, 0 100%)`;
  const clipB = `polygon(${seam + 6}% 0, 100% 0, 100% 100%, ${seam - 6}% 100%)`;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill style={{ clipPath: clipA }}>
        <PhotoPlate src={srcA} tint={C.a} seed={1} durationInFrames={durationInFrames} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clipB }}>
        <PhotoPlate src={srcB} tint={C.b} seed={2} durationInFrames={durationInFrames} />
      </AbsoluteFill>
      {/* the seam itself — a thin blade of light */}
      <AbsoluteFill
        style={{
          clipPath: `polygon(${seam + 6}% 0, ${seam + 6.55}% 0, ${seam - 5.45}% 100%, ${seam - 6}% 100%)`,
          background: `linear-gradient(180deg, ${C.a} 0%, ${C.white} 50%, ${C.b} 100%)`,
          filter: `drop-shadow(0 0 ${width * 0.02}px rgba(255,255,255,0.55))`,
          opacity: 0.9,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Chrome                                                              */
/* ------------------------------------------------------------------ */

/**
 * The running scoreboard. This is the retention device: once a viewer can see
 * 2–1, they stay to find out how it ends. A list of stats gives them no reason
 * to.
 */
export const ScoreChip: React.FC<{
  entityA: string;
  entityB: string;
  scoreA: number;
  scoreB: number;
  pulse?: 'a' | 'b' | null;
}> = ({ entityA, entityB, scoreA, scoreB, pulse = null }) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const pop = interpolate(frame % 1000, [0, 6, 14], [1, 1.16, 1], { extrapolateRight: 'clamp' });
  const s = width / 1080;

  const side = (name: string, score: number, colour: string, isPulsing: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 * s }}>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 24 * s,
          fontWeight: 700,
          letterSpacing: 1.5 * s,
          color: C.muted,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {shortName(name)}
      </span>
      <span
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 44 * s,
          fontWeight: 700,
          color: colour,
          fontVariantNumeric: 'tabular-nums',
          transform: `scale(${isPulsing ? pop : 1})`,
          textShadow: `0 0 ${26 * s}px ${colour}90`,
        }}
      >
        {score}
      </span>
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: height * SAFE.topPct * 0.42,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 22 * s,
        padding: `${14 * s}px ${28 * s}px`,
        borderRadius: 999,
        background: 'rgba(8,10,16,0.62)',
        border: '1px solid rgba(255,255,255,0.14)',
        backdropFilter: 'blur(18px)',
        whiteSpace: 'nowrap',
      }}
    >
      {side(entityA, scoreA, C.a, pulse === 'a')}
      <span style={{ width: 1, height: 34 * s, background: 'rgba(255,255,255,0.18)' }} />
      {side(entityB, scoreB, C.b, pulse === 'b')}
    </div>
  );
};

/**
 * Entity name over a photograph. Coloured type (violet on violet-graded skin)
 * disappeared against the image, so the name is white with a hard shadow and
 * the side is signalled by a coloured underline instead.
 */
export const EntityLabel: React.FC<{ name: string; colour: string; size?: number }> = ({
  name,
  colour,
  size = 28,
}) => {
  const { width } = useVideoConfig();
  const s = width / 1080;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%' }}>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: size * s,
          fontWeight: 800,
          letterSpacing: 1.6 * s,
          textTransform: 'uppercase',
          color: C.white,
          textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.9)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {shortName(name)}
      </span>
      <span
        style={{
          marginTop: 7 * s,
          width: 46 * s,
          height: 4 * s,
          borderRadius: 999,
          background: colour,
          boxShadow: `0 0 ${16 * s}px ${colour}`,
        }}
      />
    </div>
  );
};

/**
 * Names have to survive a 1080-wide frame split in two. "Cristiano Ronaldo"
 * does not fit; "Ronaldo" does, and is what a viewer calls him anyway.
 */
export function shortName(name: string, limit = 13) {
  const n = String(name || '').trim();
  if (n.length <= limit) return n;
  const words = n.split(/\s+/);
  if (words.length > 1) {
    const last = words[words.length - 1];
    if (last.length <= limit) return last;
  }
  return n.slice(0, limit - 1) + '…';
}

/** Small uppercase eyebrow label ("ROUND 3", "THE VERDICT"). */
export const Eyebrow: React.FC<{ children: React.ReactNode; colour?: string }> = ({
  children,
  colour = C.muted,
}) => {
  const { width } = useVideoConfig();
  const s = width / 1080;
  return (
    <div
      style={{
        fontFamily: FONT_BODY,
        fontSize: 26 * s,
        fontWeight: 800,
        letterSpacing: 9 * s,
        textTransform: 'uppercase',
        color: colour,
      }}
    >
      {children}
    </div>
  );
};

/** A number that counts up from zero and keeps its units. */
export const CountUp: React.FC<{
  raw: string | number;
  delay?: number;
  duration?: number;
  size: number;
  colour: string;
  glow?: boolean;
}> = ({ raw, delay = 0, duration = 26, size, colour, glow = true }) => {
  const frame = useCurrentFrame();
  const { prefix, value, suffix, decimals } = splitValue(raw);
  const t = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // ease-out so it decelerates into the final number
  const eased = 1 - Math.pow(1 - t, 3);
  const shown = value === null ? null : formatCount(value * eased, decimals);

  return (
    <span
      style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color: colour,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: -size * 0.03,
        textShadow: glow ? `0 0 ${size * 0.35}px ${colour}70` : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      {shown === null ? (
        suffix
      ) : (
        <>
          {prefix}
          {shown}
          <span style={{ fontSize: size * 0.42, fontWeight: 500 }}>{suffix}</span>
        </>
      )}
    </span>
  );
};

/**
 * Bottom-anchored caption band. Fixed to the safe zone, so it can never land
 * on a stat card the way the old pill captions did.
 */
export const CaptionBand: React.FC<{ text?: string | null }> = ({ text }) => {
  const { height, width } = useVideoConfig();
  const s = width / 1080;
  if (!text) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: width * 0.08,
        right: width * 0.08,
        bottom: height * 0.072,
        textAlign: 'center',
        fontFamily: FONT_BODY,
        fontSize: 40 * s,
        fontWeight: 700,
        lineHeight: 1.28,
        color: C.text,
        textShadow: '0 2px 26px rgba(0,0,0,0.95)',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
      }}
    >
      {text}
    </div>
  );
};

/** Persistent channel mark — small, bottom, out of the caption's way. */
export const Wordmark: React.FC = () => {
  const { height, width } = useVideoConfig();
  const s = width / 1080;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: height * 0.022,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: FONT_BODY,
        fontSize: 22 * s,
        fontWeight: 800,
        letterSpacing: 6 * s,
        color: 'rgba(255,255,255,0.42)',
      }}
    >
      AVERSUSB.NET
    </div>
  );
};
