import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { C, FONT_BODY, FONT_DISPLAY, FPS, SAFE } from './theme';
import {
  CaptionBand,
  CountUp,
  EntityLabel,
  Eyebrow,
  PhotoPlate,
  ScoreChip,
  SplitPlate,
  Wordmark,
} from './parts';

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

export type StatRow = {
  label: string;
  valueA: string | number;
  valueB: string | number;
  winner?: 'a' | 'b' | null;
};

export type ImageRef = {
  url: string | null;
  credit?: string | null;
  license?: string | null;
  tier?: number;
} | null;

export type ComparisonV3Props = {
  title: string;
  entityA: string;
  entityB: string;
  category?: string;
  shortAnswer?: string;
  stats: StatRow[];
  verdict?: string;
  slug?: string;
  imageA?: ImageRef;
  imageB?: ImageRef;
  /** One narration line per beat; drives the caption band. */
  lines?: {
    hook?: string;
    tape?: string;
    rounds?: string[];
    verdict?: string;
  };
  narrationSrc?: string | null;
  musicSrc?: string | null;
};

/* ------------------------------------------------------------------ */
/* Timing                                                              */
/* ------------------------------------------------------------------ */

export const MAX_ROUNDS = 5;
const COLD = 4.5 * FPS;
const TAPE = 6 * FPS;
const ROUND = 6 * FPS;
const VERDICT = 7.5 * FPS;
/** Scenes overlap by this much so every cut is a dissolve, never a snap. */
const XF = 12;

export function roundCount(statCount: number) {
  return Math.max(1, Math.min(MAX_ROUNDS, statCount));
}

export function getV3TotalFrames(statCount: number) {
  const n = roundCount(statCount);
  return COLD + TAPE + n * ROUND + VERDICT - XF * (2 + n);
}

function sceneStarts(n: number) {
  const cold = 0;
  const tape = cold + COLD - XF;
  const rounds: number[] = [];
  let cursor = tape + TAPE - XF;
  for (let i = 0; i < n; i++) {
    rounds.push(cursor);
    cursor += ROUND - XF;
  }
  return { cold, tape, rounds, verdict: cursor };
}

/** Fade a scene in and out against its neighbours. */
function useSceneFade(durationInFrames: number) {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [0, XF, Math.max(XF + 1, durationInFrames - XF), durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
}

/**
 * Text fades on a tighter curve than the photograph behind it.
 *
 * With one shared opacity, the crossfade renders both scenes' captions and
 * headings at ~50% for a dozen frames — two sentences stacked on the same
 * pixels, which is the exact collision this rebuild exists to remove. The
 * plate still dissolves across the full overlap; the type is simply gone
 * before its neighbour's type arrives.
 */
function useContentFade(durationInFrames: number) {
  const frame = useCurrentFrame();
  const outStart = Math.max(XF + 2, durationInFrames - XF - 6);
  return interpolate(
    frame,
    [XF - 2, XF + 6, outStart, Math.max(outStart + 1, durationInFrames - XF)],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
}

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

const ColdOpen: React.FC<{
  entityA: string;
  entityB: string;
  imageA: ImageRef;
  imageB: ImageRef;
  caption?: string;
}> = ({ entityA, entityB, imageA, imageB, caption }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = width / 1080;
  const opacity = useSceneFade(COLD);
  const content = useContentFade(COLD);

  const rise = (delay: number) => ({
    opacity: interpolate(frame - delay, [0, 14], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    transform: `translateY(${interpolate(frame - delay, [0, 18], [26 * s, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })}px)`,
  });

  const nameSize = Math.min(width * 0.085, 104 * s);

  return (
    <AbsoluteFill style={{ opacity }}>
      <SplitPlate srcA={imageA?.url} srcB={imageB?.url} durationInFrames={COLD} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: height * SAFE.topPct,
          paddingBottom: height * SAFE.bottomPct,
          opacity: content,
        }}
      >
        <div style={{ textAlign: 'center', ...rise(6) }}>
          <Eyebrow colour="rgba(255,255,255,0.72)">Head to head</Eyebrow>
        </div>
        <div
          style={{
            marginTop: 26 * s,
            textAlign: 'center',
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: nameSize,
            lineHeight: 1.02,
            letterSpacing: -nameSize * 0.03,
            color: C.white,
            textShadow: '0 6px 40px rgba(0,0,0,0.85)',
            ...rise(12),
          }}
        >
          {entityA}
        </div>
        <div
          style={{
            margin: `${14 * s}px 0`,
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: nameSize * 0.52,
            color: C.gold,
            letterSpacing: 4 * s,
            textShadow: `0 0 ${40 * s}px ${C.gold}80`,
            ...rise(20),
          }}
        >
          VS
        </div>
        <div
          style={{
            textAlign: 'center',
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: nameSize,
            lineHeight: 1.02,
            letterSpacing: -nameSize * 0.03,
            color: C.white,
            textShadow: '0 6px 40px rgba(0,0,0,0.85)',
            ...rise(26),
          }}
        >
          {entityB}
        </div>
      </AbsoluteFill>
      <div style={{ opacity: content }}>
        <CaptionBand text={caption} />
      </div>
      <Wordmark />
    </AbsoluteFill>
  );
};

const TaleOfTheTape: React.FC<{
  entityA: string;
  entityB: string;
  imageA: ImageRef;
  imageB: ImageRef;
  headline: StatRow;
  caption?: string;
}> = ({ entityA, entityB, imageA, imageB, headline, caption }) => {
  const { width, height } = useVideoConfig();
  const s = width / 1080;
  const opacity = useSceneFade(TAPE);
  const content = useContentFade(TAPE);
  const numSize = Math.min(width * 0.155, 190 * s);

  const column = (name: string, raw: string | number, colour: string, delay: number) => (
    <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
      <div style={{ marginBottom: 20 * s }}>
        <EntityLabel name={name} colour={colour} size={30} />
      </div>
      <CountUp raw={raw} delay={delay} size={numSize} colour={C.white} />
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <SplitPlate srcA={imageA?.url} srcB={imageB?.url} durationInFrames={TAPE} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: height * SAFE.topPct,
          paddingBottom: height * SAFE.bottomPct,
          paddingLeft: width * 0.055,
          paddingRight: width * 0.055,
          opacity: content,
        }}
      >
        <Eyebrow colour="rgba(255,255,255,0.8)">Tale of the tape</Eyebrow>
        <div
          style={{
            marginTop: 18 * s,
            marginBottom: 44 * s,
            fontFamily: FONT_BODY,
            fontSize: 40 * s,
            fontWeight: 700,
            color: C.text,
            textAlign: 'center',
          }}
        >
          {headline.label}
        </div>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 12 * s }}>
          {column(entityA, headline.valueA, C.a, 14)}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 44 * s,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            vs
          </div>
          {column(entityB, headline.valueB, C.b, 20)}
        </div>
      </AbsoluteFill>
      <div style={{ opacity: content }}>
        <CaptionBand text={caption} />
      </div>
      <Wordmark />
    </AbsoluteFill>
  );
};

const Round: React.FC<{
  index: number;
  stat: StatRow;
  entityA: string;
  entityB: string;
  imageA: ImageRef;
  imageB: ImageRef;
  scoreA: number;
  scoreB: number;
  caption?: string;
}> = ({ index, stat, entityA, entityB, imageA, imageB, scoreA, scoreB, caption }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = width / 1080;
  const opacity = useSceneFade(ROUND);
  const content = useContentFade(ROUND);
  const winner = stat.winner === 'a' || stat.winner === 'b' ? stat.winner : null;

  // Background follows the round's winner so the picture changes every beat.
  // With only two source photos, five winner-led rounds can repeat the same
  // image three times — so every third round shows the split instead, and the
  // Ken Burns seed varies per round to change the crop even on a repeat.
  const heroImage = winner === 'b' ? imageB : winner === 'a' ? imageA : index % 2 ? imageB : imageA;
  const heroTint = winner === 'b' ? C.b : winner === 'a' ? C.a : index % 2 ? C.b : C.a;
  const useSplit = index % 3 === 2;

  // The winner's number lights up once its count-up has landed.
  const revealed = frame > 46;
  const numSize = Math.min(width * 0.13, 158 * s);

  const side = (
    name: string,
    raw: string | number,
    colour: string,
    isWinner: boolean,
    delay: number
  ) => {
    const lift = revealed && isWinner ? interpolate(frame - 46, [0, 12], [1, 1.07], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) : 1;
    const dim = revealed && winner && !isWinner ? 0.44 : 1;
    return (
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          minWidth: 0,
          opacity: dim,
          transform: `scale(${lift})`,
        }}
      >
        <div style={{ marginBottom: 18 * s }}>
          <EntityLabel name={name} colour={colour} size={28} />
        </div>
        <CountUp
          raw={raw}
          delay={delay}
          size={numSize}
          colour={revealed && isWinner ? C.gold : C.white}
        />
        <div
          style={{
            height: 6 * s,
            marginTop: 22 * s,
            marginLeft: '18%',
            marginRight: '18%',
            borderRadius: 999,
            background: revealed && isWinner ? C.gold : 'rgba(255,255,255,0.16)',
            boxShadow: revealed && isWinner ? `0 0 ${28 * s}px ${C.gold}` : undefined,
          }}
        />
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity }}>
      {useSplit ? (
        <SplitPlate
          srcA={imageA?.url}
          srcB={imageB?.url}
          durationInFrames={ROUND}
          lean={winner === 'a' ? -0.6 : winner === 'b' ? 0.6 : 0}
        />
      ) : (
        <PhotoPlate
          src={heroImage?.url}
          tint={heroTint}
          seed={index + 3}
          durationInFrames={ROUND}
        />
      )}
      <div style={{ opacity: content }}>
      <ScoreChip
        entityA={entityA}
        entityB={entityB}
        scoreA={scoreA}
        scoreB={scoreB}
        pulse={revealed ? winner : null}
      />
      </div>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: height * SAFE.topPct,
          paddingBottom: height * SAFE.bottomPct,
          paddingLeft: width * 0.05,
          paddingRight: width * 0.05,
          opacity: content,
        }}
      >
        <Eyebrow colour="rgba(255,255,255,0.72)">{`Round ${index + 1}`}</Eyebrow>
        <div
          style={{
            marginTop: 16 * s,
            marginBottom: 46 * s,
            fontFamily: FONT_BODY,
            fontSize: 42 * s,
            fontWeight: 700,
            color: C.text,
            textAlign: 'center',
            lineHeight: 1.2,
            textShadow: '0 2px 22px rgba(0,0,0,0.9)',
          }}
        >
          {stat.label}
        </div>
        <div style={{ display: 'flex', width: '100%', alignItems: 'flex-start', gap: 10 * s }}>
          {side(entityA, stat.valueA, C.a, winner === 'a', 12)}
          {side(entityB, stat.valueB, C.b, winner === 'b', 18)}
        </div>
      </AbsoluteFill>
      <div style={{ opacity: content }}>
        <CaptionBand text={caption} />
      </div>
      <Wordmark />
    </AbsoluteFill>
  );
};

const VerdictScene: React.FC<{
  entityA: string;
  entityB: string;
  imageA: ImageRef;
  imageB: ImageRef;
  scoreA: number;
  scoreB: number;
  caption?: string;
}> = ({ entityA, entityB, imageA, imageB, scoreA, scoreB, caption }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = width / 1080;
  const opacity = useSceneFade(VERDICT);
  const content = useContentFade(VERDICT);

  const tie = scoreA === scoreB;
  const winnerName = tie ? null : scoreA > scoreB ? entityA : entityB;
  const winnerImage = tie ? imageA : scoreA > scoreB ? imageA : imageB;
  const winnerTint = tie ? C.a : scoreA > scoreB ? C.a : C.b;

  const nameSize = Math.min(width * 0.1, 122 * s);
  const appear = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <PhotoPlate src={winnerImage?.url} tint={winnerTint} seed={9} durationInFrames={VERDICT} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: height * SAFE.topPct,
          paddingBottom: height * SAFE.bottomPct,
          paddingLeft: width * 0.06,
          paddingRight: width * 0.06,
          opacity: content,
        }}
      >
        <Eyebrow colour={C.gold}>The verdict</Eyebrow>
        <div
          style={{
            marginTop: 24 * s,
            textAlign: 'center',
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: nameSize,
            lineHeight: 1.03,
            letterSpacing: -nameSize * 0.03,
            color: C.white,
            textShadow: `0 0 ${60 * s}px ${winnerTint}, 0 6px 40px rgba(0,0,0,0.9)`,
            opacity: appear,
            transform: `scale(${interpolate(appear, [0, 1], [0.94, 1])})`,
          }}
        >
          {tie ? 'Too close to call' : winnerName}
        </div>

        <div
          style={{
            marginTop: 40 * s,
            display: 'flex',
            alignItems: 'center',
            gap: 30 * s,
            opacity: appear,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <EntityLabel name={entityA} colour={C.a} size={24} />
            <div style={{ marginTop: 10 * s, fontFamily: FONT_DISPLAY, fontSize: 92 * s, fontWeight: 700, color: C.white, fontVariantNumeric: 'tabular-nums' }}>
              {scoreA}
            </div>
          </div>
          <div style={{ width: 44 * s, height: 4 * s, background: 'rgba(255,255,255,0.3)', borderRadius: 999 }} />
          <div style={{ textAlign: 'center' }}>
            <EntityLabel name={entityB} colour={C.b} size={24} />
            <div style={{ marginTop: 10 * s, fontFamily: FONT_DISPLAY, fontSize: 92 * s, fontWeight: 700, color: C.white, fontVariantNumeric: 'tabular-nums' }}>
              {scoreB}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 48 * s,
            padding: `${16 * s}px ${38 * s}px`,
            borderRadius: 999,
            border: `2px solid ${C.gold}`,
            color: C.gold,
            fontFamily: FONT_BODY,
            fontWeight: 800,
            fontSize: 32 * s,
            letterSpacing: 2 * s,
            opacity: interpolate(frame, [40, 60], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          FULL BREAKDOWN → AVERSUSB.NET
        </div>
      </AbsoluteFill>
      <div style={{ opacity: content }}>
        <CaptionBand text={caption} />
      </div>
    </AbsoluteFill>
  );
};

/** Font loading — local woff2 in public/fonts, so renders never need network. */
export const V3Fonts: React.FC = () => (
  <style>{`
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 100 900;
      font-display: block;
      src: url('${staticFile('fonts/Inter.woff2')}') format('woff2');
    }
    @font-face {
      font-family: 'Space Grotesk';
      font-style: normal;
      font-weight: 300 700;
      font-display: block;
      src: url('${staticFile('fonts/SpaceGrotesk.woff2')}') format('woff2');
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export const ComparisonV3: React.FC<ComparisonV3Props> = ({
  entityA,
  entityB,
  stats,
  imageA = null,
  imageB = null,
  lines = {},
  narrationSrc = null,
  musicSrc = null,
}) => {
  const rounds = stats.slice(0, MAX_ROUNDS);
  const n = roundCount(rounds.length);
  const starts = sceneStarts(n);

  // Running score, computed once so every scene agrees on it.
  const running: { a: number; b: number }[] = [];
  let a = 0;
  let b = 0;
  for (const r of rounds) {
    if (r.winner === 'a') a += 1;
    else if (r.winner === 'b') b += 1;
    running.push({ a, b });
  }
  const finalScore = running.length ? running[running.length - 1] : { a: 0, b: 0 };

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <V3Fonts />
      <Sequence from={starts.cold} durationInFrames={COLD}>
        <ColdOpen
          entityA={entityA}
          entityB={entityB}
          imageA={imageA}
          imageB={imageB}
          caption={lines.hook}
        />
      </Sequence>

      <Sequence from={starts.tape} durationInFrames={TAPE}>
        <TaleOfTheTape
          entityA={entityA}
          entityB={entityB}
          imageA={imageA}
          imageB={imageB}
          headline={rounds[0] ?? { label: 'Overall', valueA: '—', valueB: '—' }}
          caption={lines.tape}
        />
      </Sequence>

      {rounds.map((stat, i) => (
        <Sequence key={i} from={starts.rounds[i]} durationInFrames={ROUND}>
          <Round
            index={i}
            stat={stat}
            entityA={entityA}
            entityB={entityB}
            imageA={imageA}
            imageB={imageB}
            scoreA={running[i].a}
            scoreB={running[i].b}
            caption={lines.rounds?.[i]}
          />
        </Sequence>
      ))}

      <Sequence from={starts.verdict} durationInFrames={VERDICT}>
        <VerdictScene
          entityA={entityA}
          entityB={entityB}
          imageA={imageA}
          imageB={imageB}
          scoreA={finalScore.a}
          scoreB={finalScore.b}
          caption={lines.verdict}
        />
      </Sequence>

      {narrationSrc ? <Audio src={narrationSrc} /> : null}
      {musicSrc ? <Audio src={musicSrc} volume={0.14} /> : null}
    </AbsoluteFill>
  );
};
