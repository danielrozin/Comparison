import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
  staticFile,
} from "remotion";
import type { VideoStat, VideoKeyDifference, ComparisonVideoProps } from "./ComparisonVideo";

export type { ComparisonVideoProps } from "./ComparisonVideo";

// ---------------------------------------------------------------------------
// Timing — allow each section room to breathe
// ---------------------------------------------------------------------------

export const V2_FPS = 30;

// Comparison table needs enough frames for the staggered row reveal
// (`14 + i * 7` per row in ComparisonTableSection) plus a hold for the score row.
// Floor at 8s so 5-stat videos still breathe; +0.5s per stat above 5.
function comparisonTableFrames(statsCount: number): number {
  const baseSeconds = 8;
  const extraSeconds = Math.max(0, statsCount - 5) * 0.5;
  return Math.round((baseSeconds + extraSeconds) * V2_FPS);
}

export function getV2SectionDurations(statsCount = 5) {
  return {
    intro: V2_FPS * 4,
    shortAnswer: V2_FPS * 5,
    keyDifferences: V2_FPS * 8,
    comparisonTable: comparisonTableFrames(statsCount),
    prosCons: V2_FPS * 8,
    verdict: V2_FPS * 6,
  };
}

export const V2_SECTION_DURATIONS = getV2SectionDurations(5);

export function getV2TotalFrames(statsCount = 5) {
  return Object.values(getV2SectionDurations(statsCount)).reduce((a, b) => a + b, 0);
}

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

const C = {
  bgTop: "#0a0f1f",
  bgBottom: "#03050b",
  card: "rgba(30, 41, 59, 0.62)",
  cardBorder: "rgba(148, 163, 184, 0.22)",
  white: "#f8fafc",
  muted: "#a3b4cf",
  dim: "#64748b",
  gold: "#facc15",
  green: "#22c55e",
  red: "#f87171",
  entityA: "#38bdf8",
  entityAGlow: "rgba(56,189,248,0.55)",
  entityABg: "rgba(56,189,248,0.12)",
  entityABorder: "rgba(56,189,248,0.4)",
  entityB: "#c084fc",
  entityBGlow: "rgba(192,132,252,0.55)",
  entityBBg: "rgba(192,132,252,0.12)",
  entityBBorder: "rgba(192,132,252,0.4)",
  winGlow: "rgba(34,197,94,0.4)",
  winBg: "rgba(34,197,94,0.18)",
};

const FONT = "'Inter', 'SF Pro Display', -apple-system, sans-serif";

// ---------------------------------------------------------------------------
// Motion helpers
// ---------------------------------------------------------------------------

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

const sectionEnvelope = (frame: number, total: number, inDur = 10, outDur = 10) => {
  const inAlpha = interpolate(frame, [0, inDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outAlpha = interpolate(frame, [total - outDur, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.max(0, Math.min(inAlpha, outAlpha));
};

const springIn = (frame: number, fps: number, start = 0, damping = 14) =>
  spring({ frame: frame - start, fps, config: { damping, mass: 1 }, durationInFrames: 30 });

const riseIn = (frame: number, fps: number, start = 0, distance = 60) => {
  const t = springIn(frame, fps, start, 16);
  return { opacity: t, transform: `translateY(${(1 - t) * distance}px)` };
};

const countUpString = (target: string, frame: number, start: number, dur = 24): string => {
  const m = target.match(/^([^\d-]*?)(-?[\d.,]+)(.*)$/);
  if (!m) return target;
  const [, prefix, numRaw, suffix] = m;
  const n = parseFloat(numRaw.replace(/,/g, ""));
  if (isNaN(n)) return target;
  const t = interpolate(frame - start, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const current = n * t;
  const hasComma = numRaw.includes(",");
  const decimals = (numRaw.split(".")[1] || "").length;
  let formatted = current.toFixed(decimals);
  if (hasComma) {
    const [whole, dec] = formatted.split(".");
    formatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (dec ? "." + dec : "");
  }
  return `${prefix}${formatted}${suffix}`;
};

const breathe = (frame: number, speed = 0.1) => 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(frame * speed));

// ---------------------------------------------------------------------------
// Persistent chrome
// ---------------------------------------------------------------------------

const MeshBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 180;
  const x1 = 25 + Math.sin(t * 0.7) * 25;
  const y1 = 30 + Math.cos(t * 0.5) * 20;
  const x2 = 75 + Math.sin(t * 0.4 + 1.5) * 25;
  const y2 = 70 + Math.cos(t * 0.6 + 2) * 25;
  const x3 = 50 + Math.cos(t * 0.3) * 30;
  const y3 = 50 + Math.sin(t * 0.45) * 15;

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(900px circle at ${x1}% ${y1}%, rgba(56,189,248,0.28) 0%, transparent 55%),
          radial-gradient(950px circle at ${x2}% ${y2}%, rgba(192,132,252,0.24) 0%, transparent 60%),
          radial-gradient(600px circle at ${x3}% ${y3}%, rgba(250,204,21,0.12) 0%, transparent 55%),
          linear-gradient(180deg, ${C.bgTop} 0%, ${C.bgBottom} 100%)
        `,
      }}
    />
  );
};

const ProgressBar: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const pct = Math.min(100, (frame / totalFrames) * 100);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 10,
        zIndex: 1000,
        background: "rgba(255,255,255,0.07)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.entityA}, ${C.entityB}, ${C.gold})`,
          boxShadow: `0 0 24px ${C.entityA}, 0 0 40px ${C.entityB}`,
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

const SectionShell: React.FC<{ totalDur: number; children: React.ReactNode }> = ({ totalDur, children }) => {
  const frame = useCurrentFrame();
  const envelope = sectionEnvelope(frame, totalDur, 10, 10);
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        padding: "46px 28px 36px",
        opacity: envelope,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const SectionHeader: React.FC<{ label: string; fps: number; frame: number }> = ({ label, fps, frame }) => {
  const style = riseIn(frame, fps, 2, 35);
  return (
    <div style={{ textAlign: "center", marginBottom: 28, ...style }}>
      <div
        style={{
          display: "inline-block",
          background: "rgba(250,204,21,0.10)",
          border: "2px solid rgba(250,204,21,0.45)",
          borderRadius: 999,
          padding: "14px 44px",
          color: C.gold,
          fontSize: 40,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 5,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 1. INTRO — huge entity cards filling the frame
// ---------------------------------------------------------------------------

const IntroSection: React.FC<{ entityA: string; entityB: string; category: string }> = ({ entityA, entityB, category }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const categoryStyle = riseIn(frame, fps, 3, 30);
  const aStyle = riseIn(frame, fps, 10, 90);
  const bStyle = riseIn(frame, fps, 22, 90);
  const vsScale = springIn(frame, fps, 32, 7);
  const vsRot = interpolate(frame, [32, 42, 52], [-25, 12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const vsFlash = interpolate(frame, [32, 38, 55], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaStyle = riseIn(frame, fps, 65, 25);

  return (
    <SectionShell totalDur={V2_SECTION_DURATIONS.intro}>
      {/* Top row: brand + category */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 6, color: C.muted, opacity: 0.8 }}>AVERSUSB.NET</div>
        <div
          style={{
            background: "rgba(250,204,21,0.10)",
            border: "2px solid rgba(250,204,21,0.5)",
            borderRadius: 999,
            padding: "10px 28px",
            color: C.gold,
            fontSize: 28,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: 5,
            ...categoryStyle,
          }}
        >
          {category}
        </div>
      </div>

      {/* Stack A — VS — B */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          height: "calc(100% - 60px)",
          gap: 24,
          marginTop: 10,
        }}
      >
        <IntroCard name={entityA} color={C.entityA} glow={C.entityAGlow} bg={C.entityABg} border={C.entityABorder} style={aStyle} />

        {/* VS */}
        <div style={{ position: "relative", textAlign: "center" }}>
          <div
            style={{
              position: "absolute",
              inset: -140,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.gold} 0%, transparent 60%)`,
              opacity: vsFlash,
              filter: "blur(30px)",
            }}
          />
          <div
            style={{
              display: "inline-block",
              transform: `scale(${vsScale}) rotate(${vsRot}deg)`,
              fontSize: 180,
              fontWeight: 900,
              color: C.gold,
              letterSpacing: 6,
              lineHeight: 1,
              textShadow: `0 0 80px ${C.gold}, 0 0 40px ${C.gold}`,
            }}
          >
            VS
          </div>
        </div>

        <IntroCard name={entityB} color={C.entityB} glow={C.entityBGlow} bg={C.entityBBg} border={C.entityBBorder} style={bStyle} />
      </div>

      {/* Bottom CTA */}
      <div style={{ position: "absolute", bottom: 38, left: 0, right: 0, textAlign: "center", ...ctaStyle }}>
        <div style={{ fontSize: 40, color: C.white, fontWeight: 800, letterSpacing: -0.5 }}>
          Who wins? <span style={{ color: C.gold }}>Let&apos;s find out.</span>
        </div>
      </div>
    </SectionShell>
  );
};

const IntroCard: React.FC<{
  name: string;
  color: string;
  glow: string;
  bg: string;
  border: string;
  style: React.CSSProperties;
}> = ({ name, color, glow, bg, border, style }) => (
  <div
    style={{
      ...style,
      background: bg,
      border: `3px solid ${border}`,
      borderRadius: 40,
      padding: "36px 44px",
      display: "flex",
      alignItems: "center",
      gap: 36,
      backdropFilter: "blur(20px)",
      boxShadow: `0 24px 80px ${glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
    }}
  >
    <div
      style={{
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 110,
        fontWeight: 900,
        color: "white",
        flexShrink: 0,
        boxShadow: `0 0 70px ${glow}, 0 12px 30px rgba(0,0,0,0.4)`,
        border: "4px solid rgba(255,255,255,0.2)",
      }}
    >
      {name.charAt(0)}
    </div>
    <div style={{ fontSize: 88, fontWeight: 900, color: C.white, letterSpacing: -2, lineHeight: 1.0, flex: 1 }}>{name}</div>
  </div>
);

// ---------------------------------------------------------------------------
// 2. SHORT ANSWER — giant quote filling the frame
// ---------------------------------------------------------------------------

const ShortAnswerSection: React.FC<{ shortAnswer: string; entityA: string; entityB: string }> = ({
  shortAnswer,
  entityA,
  entityB,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = shortAnswer.split(" ");
  const wordStart = 20;
  const wordStep = 1.5;

  const headerStyle = riseIn(frame, fps, 2, 40);
  const titleStyle = riseIn(frame, fps, 8, 40);
  const cardStyle = riseIn(frame, fps, 14, 60);

  return (
    <SectionShell totalDur={V2_SECTION_DURATIONS.shortAnswer}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", paddingTop: 40 }}>
        {/* Label */}
        <div style={{ ...headerStyle, marginBottom: 26, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(250,204,21,0.10)",
              border: "2px solid rgba(250,204,21,0.45)",
              borderRadius: 999,
              padding: "14px 44px",
              color: C.gold,
              fontSize: 40,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 5,
            }}
          >
            Quick Answer
          </div>
        </div>

        {/* Headline */}
        <div style={{ ...titleStyle, textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontSize: 78, fontWeight: 900, color: C.white, letterSpacing: -2, lineHeight: 1.05 }}>
            <span style={{ color: C.entityA }}>{entityA}</span>
            <span style={{ color: C.dim, margin: "0 18px" }}>vs</span>
            <span style={{ color: C.entityB }}>{entityB}</span>
          </div>
        </div>

        {/* Big quote card */}
        <div
          style={{
            ...cardStyle,
            flex: 1,
            background: "rgba(250,204,21,0.06)",
            border: "2px solid rgba(250,204,21,0.28)",
            borderRadius: 36,
            padding: "48px 52px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 30px 90px rgba(250,204,21,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              left: 40,
              fontSize: 180,
              color: C.gold,
              lineHeight: 1,
              fontFamily: "Georgia, serif",
              opacity: 0.55,
            }}
          >
            &#x201C;
          </div>
          <div style={{ fontSize: 52, lineHeight: 1.35, color: C.white, fontWeight: 700, marginTop: 40 }}>
            {words.map((w, i) => {
              const wf = wordStart + i * wordStep;
              const op = interpolate(frame, [wf, wf + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const y = interpolate(frame, [wf, wf + 6], [8, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE,
              });
              return (
                <span key={i} style={{ opacity: op, display: "inline-block", transform: `translateY(${y}px)` }}>
                  {w}&nbsp;
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

// ---------------------------------------------------------------------------
// 3. KEY DIFFERENCES — bold rows
// ---------------------------------------------------------------------------

const KeyDifferencesSection: React.FC<{
  differences: VideoKeyDifference[];
  entityA: string;
  entityB: string;
}> = ({ differences, entityA, entityB }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelRowStyle = riseIn(frame, fps, 8, 30);

  return (
    <SectionShell totalDur={V2_SECTION_DURATIONS.keyDifferences}>
      <SectionHeader label="Key Differences" fps={fps} frame={frame} />

      {/* Entity labels row */}
      <div
        style={{
          ...labelRowStyle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
          padding: "0 12px",
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 900, color: C.entityA, letterSpacing: -1, flex: 1, textAlign: "left" }}>
          {entityA}
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, color: C.gold, padding: "0 14px" }}>VS</div>
        <div style={{ fontSize: 54, fontWeight: 900, color: C.entityB, letterSpacing: -1, flex: 1, textAlign: "right" }}>
          {entityB}
        </div>
      </div>

      {/* Diff stack */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, justifyContent: "center" }}>
        {differences.map((diff, i) => {
          const rowDelay = 16 + i * 10;
          const style = riseIn(frame, fps, rowDelay, 24);
          const aWins = diff.winner === "a";
          const bWins = diff.winner === "b";
          const glowA = aWins ? breathe(frame - rowDelay) : 0;
          const glowB = bWins ? breathe(frame - rowDelay) : 0;

          return (
            <div
              key={i}
              style={{
                ...style,
                background: C.card,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: 22,
                padding: "18px 24px",
                backdropFilter: "blur(14px)",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: C.gold,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                {diff.label}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <KDCell value={diff.entityAValue} won={aWins} glow={glowA} />
                <div style={{ fontSize: 32, fontWeight: 900, color: C.dim, padding: "0 4px" }}>·</div>
                <KDCell value={diff.entityBValue} won={bWins} glow={glowB} />
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
};

const KDCell: React.FC<{ value: string; won: boolean; glow: number }> = ({ value, won, glow }) => (
  <div
    style={{
      flex: 1,
      textAlign: "center",
      fontSize: 34,
      fontWeight: 900,
      color: won ? C.green : C.white,
      background: won ? C.winBg : "transparent",
      borderRadius: 14,
      padding: "16px 12px",
      boxShadow: won ? `0 0 ${24 + glow * 20}px ${C.winGlow}, inset 0 0 16px rgba(34,197,94,${0.15 * glow})` : "none",
      lineHeight: 1.15,
    }}
  >
    {won && <span style={{ marginRight: 8 }}>🏆</span>}
    {value}
  </div>
);

// ---------------------------------------------------------------------------
// 4. FULL COMPARISON — big rows with count-up
// ---------------------------------------------------------------------------

const ComparisonTableSection: React.FC<{
  stats: VideoStat[];
  entityA: string;
  entityB: string;
  totalDur: number;
}> = ({ stats, entityA, entityB, totalDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelRowStyle = riseIn(frame, fps, 6, 30);

  let scoreA = 0;
  let scoreB = 0;

  return (
    <SectionShell totalDur={totalDur}>
      <SectionHeader label="Full Comparison" fps={fps} frame={frame} />

      {/* Entity header */}
      <div
        style={{
          ...labelRowStyle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          padding: "0 16px",
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 900, color: C.entityA, letterSpacing: -1 }}>{entityA}</div>
        <div style={{ fontSize: 54, fontWeight: 900, color: C.entityB, letterSpacing: -1 }}>{entityB}</div>
      </div>

      {/* Rows */}
      <div
        style={{
          background: C.card,
          borderRadius: 28,
          border: `1px solid ${C.cardBorder}`,
          overflow: "hidden",
          backdropFilter: "blur(18px)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {stats.map((stat, i) => {
          if (stat.winner === "a") scoreA++;
          if (stat.winner === "b") scoreB++;
          const aWins = stat.winner === "a";
          const bWins = stat.winner === "b";
          const rowDelay = 14 + i * 7;
          const style = riseIn(frame, fps, rowDelay, 20);
          const valueA = countUpString(stat.valueA, frame, rowDelay + 4, 18);
          const valueB = countUpString(stat.valueB, frame, rowDelay + 4, 18);
          const glowA = aWins ? breathe(frame - rowDelay, 0.1) : 0;
          const glowB = bWins ? breathe(frame - rowDelay, 0.1) : 0;

          return (
            <div
              key={i}
              style={{
                ...style,
                display: "flex",
                padding: "14px 20px",
                borderTop: i === 0 ? "none" : `1px solid ${C.cardBorder}`,
                alignItems: "center",
                flex: 1,
              }}
            >
              <div
                style={{
                  width: 260,
                  fontSize: 24,
                  fontWeight: 800,
                  color: C.muted,
                  lineHeight: 1.2,
                }}
              >
                {stat.label}
              </div>
              <TableCell value={valueA} won={aWins} glow={glowA} />
              <TableCell value={valueB} won={bWins} glow={glowB} />
            </div>
          );
        })}

        {/* Score row */}
        <div
          style={{
            display: "flex",
            padding: "18px 20px",
            borderTop: `3px solid rgba(250,204,21,0.45)`,
            background: "rgba(250,204,21,0.08)",
            alignItems: "center",
            ...riseIn(frame, fps, 14 + stats.length * 7 + 4, 15),
          }}
        >
          <div style={{ width: 260, fontSize: 34, fontWeight: 900, color: C.gold, letterSpacing: 3 }}>SCORE</div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 70,
              fontWeight: 900,
              color: C.entityA,
              textShadow: `0 0 40px ${C.entityAGlow}`,
            }}
          >
            {scoreA}
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 70,
              fontWeight: 900,
              color: C.entityB,
              textShadow: `0 0 40px ${C.entityBGlow}`,
            }}
          >
            {scoreB}
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

const TableCell: React.FC<{ value: string; won: boolean; glow: number }> = ({ value, won, glow }) => (
  <div
    style={{
      flex: 1,
      textAlign: "center",
      fontSize: 40,
      fontWeight: 900,
      color: won ? C.green : C.white,
      background: won ? C.winBg : "transparent",
      borderRadius: 14,
      padding: "10px 8px",
      boxShadow: won ? `0 0 ${20 + glow * 18}px ${C.winGlow}` : "none",
      lineHeight: 1.1,
    }}
  >
    {value}
    {won && <span style={{ marginLeft: 10 }}>✓</span>}
  </div>
);

// ---------------------------------------------------------------------------
// 5. PROS & CONS — stacked vertically (each entity gets full width)
// ---------------------------------------------------------------------------

const ProsConsSection: React.FC<{
  entityA: string;
  entityB: string;
  prosA: string[];
  consA: string[];
  prosB: string[];
  consB: string[];
}> = ({ entityA, entityB, prosA, consA, prosB, consB }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardAStyle = riseIn(frame, fps, 8, 60);
  const cardBStyle = riseIn(frame, fps, 22, 60);

  return (
    <SectionShell totalDur={V2_SECTION_DURATIONS.prosCons}>
      <SectionHeader label="Pros & Cons" fps={fps} frame={frame} />

      <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
        <EntityProsConsCard
          entityName={entityA}
          color={C.entityA}
          glow={C.entityAGlow}
          bg={C.entityABg}
          border={C.entityABorder}
          pros={prosA}
          cons={consA}
          style={cardAStyle}
          frame={frame}
          fps={fps}
          baseDelay={16}
        />
        <EntityProsConsCard
          entityName={entityB}
          color={C.entityB}
          glow={C.entityBGlow}
          bg={C.entityBBg}
          border={C.entityBBorder}
          pros={prosB}
          cons={consB}
          style={cardBStyle}
          frame={frame}
          fps={fps}
          baseDelay={30}
        />
      </div>
    </SectionShell>
  );
};

const EntityProsConsCard: React.FC<{
  entityName: string;
  color: string;
  glow: string;
  bg: string;
  border: string;
  pros: string[];
  cons: string[];
  style: React.CSSProperties;
  frame: number;
  fps: number;
  baseDelay: number;
}> = ({ entityName, color, glow, bg, border, pros, cons, style, frame, fps, baseDelay }) => (
  <div
    style={{
      ...style,
      flex: 1,
      background: bg,
      border: `2px solid ${border}`,
      borderRadius: 28,
      padding: "22px 26px",
      backdropFilter: "blur(18px)",
      boxShadow: `0 20px 60px ${glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ fontSize: 46, fontWeight: 900, color, marginBottom: 14, letterSpacing: -1 }}>{entityName}</div>

    <div style={{ display: "flex", gap: 18, flex: 1 }}>
      <ProsConsColumn items={pros} type="pro" frame={frame} fps={fps} baseDelay={baseDelay} />
      <ProsConsColumn items={cons} type="con" frame={frame} fps={fps} baseDelay={baseDelay + pros.length * 4} />
    </div>
  </div>
);

const ProsConsColumn: React.FC<{
  items: string[];
  type: "pro" | "con";
  frame: number;
  fps: number;
  baseDelay: number;
}> = ({ items, type, frame, fps, baseDelay }) => (
  <div style={{ flex: 1 }}>
    <div
      style={{
        fontSize: 22,
        fontWeight: 900,
        color: type === "pro" ? C.green : C.red,
        textTransform: "uppercase",
        letterSpacing: 4,
        marginBottom: 10,
      }}
    >
      {type === "pro" ? "✓ PROS" : "✗ CONS"}
    </div>
    {items.map((item, i) => {
      const delay = baseDelay + i * 4;
      const iconScale = springIn(frame, fps, delay + 2, 8);
      const textStyle = riseIn(frame, fps, delay, 20);
      return (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: type === "pro" ? "rgba(34,197,94,0.22)" : "rgba(248,113,113,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 900,
              color: type === "pro" ? C.green : C.red,
              flexShrink: 0,
              marginTop: 3,
              transform: `scale(${iconScale})`,
              boxShadow: type === "pro" ? "0 0 16px rgba(34,197,94,0.35)" : "0 0 16px rgba(248,113,113,0.3)",
            }}
          >
            {type === "pro" ? "✓" : "✗"}
          </div>
          <div style={{ fontSize: 24, color: C.white, lineHeight: 1.3, fontWeight: 600, ...textStyle }}>{item}</div>
        </div>
      );
    })}
  </div>
);

// ---------------------------------------------------------------------------
// 6. VERDICT — big winner + confetti
// ---------------------------------------------------------------------------

const Confetti: React.FC<{ startFrame: number; count?: number }> = ({ startFrame, count = 80 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = frame - startFrame;
  if (elapsed < 0) return null;

  const colors = [C.entityA, C.entityB, C.gold, C.green, "#f472b6"];
  const particles: React.ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    const seed = (i * 97.31) % 1000;
    const r1 = (Math.sin(seed * 0.93) + 1) / 2;
    const r2 = (Math.cos(seed * 1.27) + 1) / 2;
    const r3 = (Math.sin(seed * 0.41 + 1.7) + 1) / 2;
    const r4 = (Math.cos(seed * 0.63) + 1) / 2;

    const startX = 25 + r1 * 50;
    const startY = 20;
    const vx = (r2 - 0.5) * 200;
    const vy = -140 - r3 * 200;
    const gravity = 480;
    const t = elapsed / fps;
    const x = startX + (vx * t) / 12;
    const y = startY + ((vy * t) + 0.5 * gravity * t * t) / 12;
    const rot = t * 540 * (i % 2 === 0 ? 1 : -1);
    const op = Math.max(0, 1 - t / 2.5);
    const size = 12 + r4 * 14;

    if (y > 120 || op <= 0) continue;

    particles.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size * 1.4,
          background: colors[i % colors.length],
          borderRadius: 2,
          transform: `rotate(${rot}deg)`,
          opacity: op,
          boxShadow: `0 0 10px ${colors[i % colors.length]}80`,
        }}
      />
    );
  }

  return <>{particles}</>;
};

const VerdictSection: React.FC<{
  entityA: string;
  entityB: string;
  stats: VideoStat[];
  verdict: string;
}> = ({ entityA, entityB, stats, verdict }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let scoreA = 0;
  let scoreB = 0;
  stats.forEach((s) => {
    if (s.winner === "a") scoreA++;
    if (s.winner === "b") scoreB++;
  });

  const winner = scoreA > scoreB ? entityA : scoreB > scoreA ? entityB : "Tie";
  const winnerColor = scoreA > scoreB ? C.entityA : scoreB > scoreA ? C.entityB : C.gold;
  const winnerGlow = scoreA > scoreB ? C.entityAGlow : scoreB > scoreA ? C.entityBGlow : "rgba(250,204,21,0.4)";

  const headerStyle = riseIn(frame, fps, 3, 40);
  const trophyScale = springIn(frame, fps, 10, 7);
  const trophyRot = interpolate(frame, [10, 22, 34, 48], [0, -18, 18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const winnerStyle = riseIn(frame, fps, 22, 30);
  const scoreStyle = riseIn(frame, fps, 32, 30);
  const verdictStyle = riseIn(frame, fps, 42, 30);
  const ctaStyle = riseIn(frame, fps, 58, 25);

  const shimmerX = interpolate(frame, [60, 130], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SectionShell totalDur={V2_SECTION_DURATIONS.verdict}>
      <Confetti startFrame={10} />

      <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", alignItems: "center", gap: 24 }}>
        {/* Header label */}
        <div style={{ ...headerStyle }}>
          <div
            style={{
              background: "rgba(250,204,21,0.10)",
              border: "2px solid rgba(250,204,21,0.45)",
              borderRadius: 999,
              padding: "12px 40px",
              color: C.gold,
              fontSize: 34,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 5,
            }}
          >
            The Verdict
          </div>
        </div>

        {/* Winner block */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(49,46,129,0.88) 0%, rgba(88,28,135,0.88) 50%, rgba(49,46,129,0.88) 100%)",
            borderRadius: 40,
            padding: "50px 40px",
            textAlign: "center",
            width: "100%",
            backdropFilter: "blur(22px)",
            border: "2px solid rgba(255,255,255,0.12)",
            boxShadow: `0 30px 100px ${winnerGlow}, inset 0 1px 0 rgba(255,255,255,0.14)`,
          }}
        >
          <div
            style={{
              fontSize: 160,
              marginBottom: 16,
              transform: `scale(${trophyScale}) rotate(${trophyRot}deg)`,
              display: "inline-block",
              filter: `drop-shadow(0 0 40px ${winnerGlow})`,
              lineHeight: 1,
            }}
          >
            {winner === "Tie" ? "🤝" : "🏆"}
          </div>

          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: winnerColor,
              textShadow: `0 0 60px ${winnerGlow}`,
              marginBottom: 18,
              letterSpacing: -2,
              lineHeight: 1,
              ...winnerStyle,
            }}
          >
            {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}
          </div>

          <div style={{ fontSize: 56, fontWeight: 900, color: C.muted, marginBottom: 30, ...scoreStyle, letterSpacing: -1 }}>
            <span style={{ color: C.entityA }}>{scoreA}</span>
            <span style={{ margin: "0 22px", color: C.dim }}>—</span>
            <span style={{ color: C.entityB }}>{scoreB}</span>
          </div>

          <div style={{ fontSize: 34, lineHeight: 1.45, color: C.white, fontWeight: 600, ...verdictStyle }}>{verdict}</div>
        </div>

        {/* CTA */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 24, width: "100%", ...ctaStyle }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${C.entityA}, ${C.entityB})`,
              padding: "24px 40px",
              fontSize: 38,
              fontWeight: 900,
              color: "white",
              boxShadow: `0 20px 60px ${C.entityAGlow}`,
              position: "relative",
              letterSpacing: 0.5,
              textAlign: "center",
            }}
          >
            Full comparison at aversusb.net
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${shimmerX}%`,
                width: 90,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                transform: "skewX(-20deg)",
              }}
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export const ComparisonVideoV2: React.FC<ComparisonVideoProps> = (props) => {
  const D = getV2SectionDurations(props.stats.length);
  const totalFrames = Object.values(D).reduce((a, b) => a + b, 0);
  let offset = 0;

  const sections = [
    { from: (offset = 0), dur: D.intro },
    { from: (offset += D.intro), dur: D.shortAnswer },
    { from: (offset += D.shortAnswer), dur: D.keyDifferences },
    { from: (offset += D.keyDifferences), dur: D.comparisonTable },
    { from: (offset += D.comparisonTable), dur: D.prosCons },
    { from: (offset += D.prosCons), dur: D.verdict },
  ];

  return (
    <AbsoluteFill>
      <Audio src={staticFile("assets/bg-music.mp3")} volume={0.35} />
      <MeshBackground />

      <Sequence from={sections[0].from} durationInFrames={sections[0].dur}>
        <IntroSection entityA={props.entityA} entityB={props.entityB} category={props.category} />
      </Sequence>

      <Sequence from={sections[1].from} durationInFrames={sections[1].dur}>
        <ShortAnswerSection shortAnswer={props.shortAnswer} entityA={props.entityA} entityB={props.entityB} />
      </Sequence>

      <Sequence from={sections[2].from} durationInFrames={sections[2].dur}>
        <KeyDifferencesSection differences={props.keyDifferences} entityA={props.entityA} entityB={props.entityB} />
      </Sequence>

      <Sequence from={sections[3].from} durationInFrames={sections[3].dur}>
        <ComparisonTableSection
          stats={props.stats}
          entityA={props.entityA}
          entityB={props.entityB}
          totalDur={sections[3].dur}
        />
      </Sequence>

      <Sequence from={sections[4].from} durationInFrames={sections[4].dur}>
        <ProsConsSection
          entityA={props.entityA}
          entityB={props.entityB}
          prosA={props.prosA}
          consA={props.consA}
          prosB={props.prosB}
          consB={props.consB}
        />
      </Sequence>

      <Sequence from={sections[5].from} durationInFrames={sections[5].dur}>
        <VerdictSection entityA={props.entityA} entityB={props.entityB} stats={props.stats} verdict={props.verdict} />
      </Sequence>

      <ProgressBar totalFrames={totalFrames} />
    </AbsoluteFill>
  );
};
