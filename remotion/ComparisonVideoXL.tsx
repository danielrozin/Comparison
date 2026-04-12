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

// ---------------------------------------------------------------------------
// Timing — longer sections for bigger text
// ---------------------------------------------------------------------------

export const FPS = 30;
export const XL_DURATIONS = {
  intro: FPS * 5,
  shortAnswer: FPS * 6,
  keyDiff1: FPS * 6,       // first 3 key differences
  keyDiff2: FPS * 5,       // remaining key differences
  table1: FPS * 6,         // first 4 stats
  table2: FPS * 6,         // remaining stats + score
  prosCons: FPS * 8,
  verdict: FPS * 6,
};

export function getXLTotalFrames() {
  return Object.values(XL_DURATIONS).reduce((a, b) => a + b, 0);
}

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

const C = {
  bg: "#0f172a",
  bgDeep: "#080e1e",
  card: "#1e293b",
  cardBorder: "#334155",
  primary: "#3b82f6",
  accent: "#8b5cf6",
  green: "#22c55e",
  red: "#ef4444",
  white: "#f8fafc",
  muted: "#94a3b8",
  dim: "#64748b",
  gold: "#fbbf24",
  entityA: "#3b82f6",
  entityABg: "rgba(59,130,246,0.12)",
  entityABorder: "rgba(59,130,246,0.3)",
  entityB: "#8b5cf6",
  entityBBg: "rgba(139,92,246,0.12)",
  entityBBorder: "rgba(139,92,246,0.3)",
  winBg: "rgba(34,197,94,0.12)",
};

const FONT = "'Inter', 'SF Pro Display', -apple-system, sans-serif";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fadeIn = (frame: number, start: number, dur = 12) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const slideUp = (frame: number, start: number, dist = 50, dur = 18) => ({
  opacity: fadeIn(frame, start, dur),
  transform: `translateY(${interpolate(frame, [start, start + dur], [dist, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  })}px)`,
});

const PageBg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bgDeep} 100%)`,
      fontFamily: FONT,
      padding: "50px 44px",
    }}
  >
    {children}
  </AbsoluteFill>
);

const Badge: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ position: "absolute", top: 44, left: 0, right: 0, textAlign: "center", opacity }}>
    <span
      style={{
        background: "rgba(59,130,246,0.1)",
        border: `1px solid ${C.entityABorder}`,
        borderRadius: 28,
        padding: "12px 32px",
        color: C.primary,
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: 2,
      }}
    >
      aversusb.net
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// 1. INTRO
// ---------------------------------------------------------------------------

const IntroSection: React.FC<{
  entityA: string;
  entityB: string;
  category: string;
}> = ({ entityA, entityB, category }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vsScale = spring({ frame: frame - 25, fps, config: { damping: 12 } });

  return (
    <PageBg>
      <Badge opacity={fadeIn(frame, 0, 15)} />

      {/* Category */}
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", ...slideUp(frame, 5) }}>
        <span
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: 24,
            padding: "14px 34px",
            color: C.gold,
            fontSize: 30,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 5,
          }}
        >
          {category}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: 36,
        }}
      >
        {/* Entity A */}
        <div
          style={{
            ...slideUp(frame, 10, 70),
            background: C.entityABg,
            border: `2px solid ${C.entityABorder}`,
            borderRadius: 32,
            padding: "44px 60px",
            textAlign: "center",
            width: "90%",
          }}
        >
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.entityA}, #60a5fa)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 76,
              fontWeight: 900,
              color: "white",
              margin: "0 auto 24px",
              boxShadow: `0 0 60px ${C.entityA}40`,
            }}
          >
            {entityA.charAt(0)}
          </div>
          <div style={{ fontSize: 64, fontWeight: 900, color: C.white }}>{entityA}</div>
        </div>

        {/* VS */}
        <div
          style={{
            transform: `scale(${vsScale})`,
            fontSize: 96,
            fontWeight: 900,
            color: C.gold,
            textShadow: `0 0 60px ${C.gold}50`,
          }}
        >
          VS
        </div>

        {/* Entity B */}
        <div
          style={{
            ...slideUp(frame, 15, 70),
            background: C.entityBBg,
            border: `2px solid ${C.entityBBorder}`,
            borderRadius: 32,
            padding: "44px 60px",
            textAlign: "center",
            width: "90%",
          }}
        >
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.entityB}, #a78bfa)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 76,
              fontWeight: 900,
              color: "white",
              margin: "0 auto 24px",
              boxShadow: `0 0 60px ${C.entityB}40`,
            }}
          >
            {entityB.charAt(0)}
          </div>
          <div style={{ fontSize: 64, fontWeight: 900, color: C.white }}>{entityB}</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 100, left: 0, right: 0, textAlign: "center", ...slideUp(frame, 30) }}>
        <div style={{ fontSize: 36, color: C.muted, fontWeight: 700 }}>
          Who wins? Let's compare...
        </div>
      </div>
    </PageBg>
  );
};

// ---------------------------------------------------------------------------
// 2. SHORT ANSWER
// ---------------------------------------------------------------------------

const ShortAnswerSection: React.FC<{
  shortAnswer: string;
  entityA: string;
  entityB: string;
}> = ({ shortAnswer, entityA, entityB }) => {
  const frame = useCurrentFrame();

  return (
    <PageBg>
      <Badge opacity={fadeIn(frame, 0)} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "0 10px",
        }}
      >
        <div style={{ ...slideUp(frame, 5), marginBottom: 50, textAlign: "center" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: C.gold,
              textTransform: "uppercase",
              letterSpacing: 6,
              marginBottom: 20,
            }}
          >
            Quick Answer
          </div>
          <div style={{ fontSize: 58, fontWeight: 900, color: C.white }}>
            {entityA} vs {entityB}
          </div>
        </div>

        <div
          style={{
            ...slideUp(frame, 18),
            background: "rgba(251,191,36,0.06)",
            border: "2px solid rgba(251,191,36,0.2)",
            borderRadius: 28,
            padding: "50px 48px",
            width: "100%",
          }}
        >
          <div style={{ fontSize: 72, color: C.gold, marginBottom: 20, lineHeight: 1 }}>&#x201C;</div>
          <div
            style={{
              fontSize: 40,
              lineHeight: 1.5,
              color: C.white,
              fontWeight: 600,
            }}
          >
            {shortAnswer}
          </div>
        </div>
      </div>
    </PageBg>
  );
};

// ---------------------------------------------------------------------------
// 3. KEY DIFFERENCES (split into two slides)
// ---------------------------------------------------------------------------

const KeyDiffSlide: React.FC<{
  differences: VideoKeyDifference[];
  entityA: string;
  entityB: string;
  page: number;
  totalPages: number;
}> = ({ differences, entityA, entityB, page, totalPages }) => {
  const frame = useCurrentFrame();

  return (
    <PageBg>
      <Badge opacity={fadeIn(frame, 0)} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          padding: "110px 0 50px",
        }}
      >
        <div style={{ ...slideUp(frame, 3), textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.gold, textTransform: "uppercase", letterSpacing: 5 }}>
            Key Differences {totalPages > 1 ? `(${page}/${totalPages})` : ""}
          </div>
        </div>

        <div
          style={{
            background: C.card,
            borderRadius: 28,
            border: `1px solid ${C.cardBorder}`,
            overflow: "hidden",
            ...slideUp(frame, 8),
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              background: "linear-gradient(135deg, #312e81 0%, #581c87 100%)",
              padding: "26px 32px",
            }}
          >
            <div style={{ flex: 1, fontSize: 34, fontWeight: 900, color: C.entityA, textAlign: "center" }}>
              {entityA}
            </div>
            <div style={{ width: 200, fontSize: 28, fontWeight: 700, color: C.muted, textAlign: "center" }}>
              vs
            </div>
            <div style={{ flex: 1, fontSize: 34, fontWeight: 900, color: C.entityB, textAlign: "center" }}>
              {entityB}
            </div>
          </div>

          {/* Rows */}
          {differences.map((diff, i) => {
            const rowDelay = 15 + i * 14;
            const aWins = diff.winner === "a";
            const bWins = diff.winner === "b";

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px 32px",
                  borderTop: `1px solid ${C.cardBorder}`,
                  ...slideUp(frame, rowDelay, 25),
                }}
              >
                {/* Label centered */}
                <div style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: C.gold, marginBottom: 14 }}>
                  {diff.label}
                </div>
                {/* Values row */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: 34,
                      fontWeight: 900,
                      color: aWins ? C.green : C.white,
                      background: aWins ? C.winBg : "transparent",
                      borderRadius: 14,
                      padding: "12px 14px",
                    }}
                  >
                    {aWins && "🏆 "}{diff.entityAValue}
                  </div>
                  <div style={{ width: 40 }} />
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: 34,
                      fontWeight: 900,
                      color: bWins ? C.green : C.white,
                      background: bWins ? C.winBg : "transparent",
                      borderRadius: 14,
                      padding: "12px 14px",
                    }}
                  >
                    {diff.entityBValue}{bWins && " 🏆"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageBg>
  );
};

// ---------------------------------------------------------------------------
// 4. COMPARISON TABLE (split into two slides)
// ---------------------------------------------------------------------------

const TableSlide: React.FC<{
  stats: VideoStat[];
  entityA: string;
  entityB: string;
  page: number;
  totalPages: number;
  showScore: boolean;
  cumulativeScoreA: number;
  cumulativeScoreB: number;
}> = ({ stats, entityA, entityB, page, totalPages, showScore, cumulativeScoreA, cumulativeScoreB }) => {
  const frame = useCurrentFrame();
  let runA = cumulativeScoreA;
  let runB = cumulativeScoreB;

  return (
    <PageBg>
      <Badge opacity={fadeIn(frame, 0)} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          padding: "110px 0 50px",
        }}
      >
        <div style={{ ...slideUp(frame, 3), textAlign: "center", marginBottom: 34 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.gold, textTransform: "uppercase", letterSpacing: 5 }}>
            Stats Comparison {totalPages > 1 ? `(${page}/${totalPages})` : ""}
          </div>
        </div>

        <div
          style={{
            background: C.card,
            borderRadius: 28,
            border: `1px solid ${C.cardBorder}`,
            overflow: "hidden",
            ...slideUp(frame, 6),
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              background: "linear-gradient(135deg, #1e3a5f 0%, #312e81 100%)",
              padding: "24px 28px",
              alignItems: "center",
            }}
          >
            <div style={{ width: 240, fontSize: 24, fontWeight: 900, color: C.dim, textTransform: "uppercase", letterSpacing: 3 }}>
              Stat
            </div>
            <div style={{ flex: 1, fontSize: 34, fontWeight: 900, color: C.entityA, textAlign: "center" }}>
              {entityA}
            </div>
            <div style={{ flex: 1, fontSize: 34, fontWeight: 900, color: C.entityB, textAlign: "center" }}>
              {entityB}
            </div>
          </div>

          {/* Rows */}
          {stats.map((stat, i) => {
            if (stat.winner === "a") runA++;
            if (stat.winner === "b") runB++;
            const aWins = stat.winner === "a";
            const bWins = stat.winner === "b";
            const rowDelay = 12 + i * 10;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "20px 28px",
                  borderTop: `1px solid ${C.cardBorder}`,
                  alignItems: "center",
                  ...slideUp(frame, rowDelay, 18),
                }}
              >
                <div style={{ width: 240, fontSize: 26, fontWeight: 700, color: C.muted }}>
                  {stat.label}
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 34,
                    fontWeight: 900,
                    color: aWins ? C.green : C.white,
                    background: aWins ? C.winBg : "transparent",
                    borderRadius: 12,
                    padding: "10px 8px",
                  }}
                >
                  {stat.valueA}{aWins && " ✓"}
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 34,
                    fontWeight: 900,
                    color: bWins ? C.green : C.white,
                    background: bWins ? C.winBg : "transparent",
                    borderRadius: 12,
                    padding: "10px 8px",
                  }}
                >
                  {stat.valueB}{bWins && " ✓"}
                </div>
              </div>
            );
          })}

          {/* Score row (only on last page) */}
          {showScore && (
            <div
              style={{
                display: "flex",
                padding: "26px 28px",
                borderTop: `2px solid ${C.gold}40`,
                background: "rgba(251,191,36,0.05)",
                ...slideUp(frame, 12 + stats.length * 10 + 8),
              }}
            >
              <div style={{ width: 240, fontSize: 30, fontWeight: 900, color: C.gold }}>TOTAL</div>
              <div style={{ flex: 1, textAlign: "center", fontSize: 44, fontWeight: 900, color: C.entityA }}>{runA}</div>
              <div style={{ flex: 1, textAlign: "center", fontSize: 44, fontWeight: 900, color: C.entityB }}>{runB}</div>
            </div>
          )}
        </div>
      </div>
    </PageBg>
  );
};

// ---------------------------------------------------------------------------
// 5. PROS & CONS
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

  const List: React.FC<{ items: string[]; type: "pro" | "con"; baseDelay: number }> = ({
    items,
    type,
    baseDelay,
  }) => (
    <div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: type === "pro" ? C.green : C.red,
          textTransform: "uppercase",
          letterSpacing: 4,
          marginBottom: 16,
        }}
      >
        {type === "pro" ? "PROS" : "CONS"}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            marginBottom: 14,
            ...slideUp(frame, baseDelay + i * 6, 25),
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: type === "pro" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 900,
              color: type === "pro" ? C.green : C.red,
              flexShrink: 0,
              marginTop: 4,
            }}
          >
            {type === "pro" ? "✓" : "✗"}
          </div>
          <div style={{ fontSize: 28, color: C.white, lineHeight: 1.35, fontWeight: 600 }}>{item}</div>
        </div>
      ))}
    </div>
  );

  return (
    <PageBg>
      <Badge opacity={fadeIn(frame, 0)} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          padding: "110px 0 50px",
        }}
      >
        <div style={{ ...slideUp(frame, 3), textAlign: "center", marginBottom: 34 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.gold, textTransform: "uppercase", letterSpacing: 5 }}>
            Pros &amp; Cons
          </div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          <div
            style={{
              flex: 1,
              background: C.entityABg,
              border: `1px solid ${C.entityABorder}`,
              borderRadius: 28,
              padding: "30px 28px",
              ...slideUp(frame, 6),
            }}
          >
            <div style={{ fontSize: 38, fontWeight: 900, color: C.entityA, marginBottom: 28, textAlign: "center" }}>
              {entityA}
            </div>
            <List items={prosA} type="pro" baseDelay={15} />
            <div style={{ height: 28 }} />
            <List items={consA} type="con" baseDelay={40} />
          </div>

          <div
            style={{
              flex: 1,
              background: C.entityBBg,
              border: `1px solid ${C.entityBBorder}`,
              borderRadius: 28,
              padding: "30px 28px",
              ...slideUp(frame, 10),
            }}
          >
            <div style={{ fontSize: 38, fontWeight: 900, color: C.entityB, marginBottom: 28, textAlign: "center" }}>
              {entityB}
            </div>
            <List items={prosB} type="pro" baseDelay={20} />
            <div style={{ height: 28 }} />
            <List items={consB} type="con" baseDelay={45} />
          </div>
        </div>
      </div>
    </PageBg>
  );
};

// ---------------------------------------------------------------------------
// 6. VERDICT
// ---------------------------------------------------------------------------

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
  const trophyScale = spring({ frame: frame - 5, fps, config: { damping: 10 } });

  return (
    <PageBg>
      <Badge opacity={fadeIn(frame, 0)} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "0 10px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #312e81 0%, #581c87 50%, #312e81 100%)",
            borderRadius: 36,
            padding: "60px 48px",
            textAlign: "center",
            width: "100%",
            boxShadow: "0 24px 80px rgba(88,28,135,0.4)",
            ...slideUp(frame, 5),
          }}
        >
          <div style={{ fontSize: 100, marginBottom: 24, transform: `scale(${trophyScale})` }}>
            {winner === "Tie" ? "🤝" : "🏆"}
          </div>

          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: winnerColor,
              textShadow: `0 0 50px ${winnerColor}40`,
              marginBottom: 18,
              ...slideUp(frame, 12),
            }}
          >
            {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}
          </div>

          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: C.muted,
              marginBottom: 40,
              ...slideUp(frame, 18),
            }}
          >
            <span style={{ color: C.entityA }}>{entityA} {scoreA}</span>
            <span style={{ margin: "0 24px", color: C.dim }}>—</span>
            <span style={{ color: C.entityB }}>{scoreB} {entityB}</span>
          </div>

          <div
            style={{
              fontSize: 32,
              lineHeight: 1.5,
              color: C.white,
              fontWeight: 600,
              ...slideUp(frame, 25),
            }}
          >
            {verdict}
          </div>
        </div>

        <div style={{ marginTop: 50, ...slideUp(frame, 38) }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
              borderRadius: 24,
              padding: "26px 56px",
              fontSize: 34,
              fontWeight: 800,
              color: "white",
              boxShadow: `0 12px 50px ${C.primary}40`,
            }}
          >
            Full comparison at aversusb.net
          </div>
        </div>
      </div>
    </PageBg>
  );
};

// ---------------------------------------------------------------------------
// Main XL Composition
// ---------------------------------------------------------------------------

export const ComparisonVideoXL: React.FC<ComparisonVideoProps> = (props) => {
  const D = XL_DURATIONS;

  // Split key differences: first 3 + rest
  const keyDiff1 = props.keyDifferences.slice(0, 3);
  const keyDiff2 = props.keyDifferences.slice(3);

  // Split stats: first 4 + rest
  const stats1 = props.stats.slice(0, 4);
  const stats2 = props.stats.slice(4);

  // Cumulative score from first batch
  let scoreA1 = 0;
  let scoreB1 = 0;
  stats1.forEach((s) => {
    if (s.winner === "a") scoreA1++;
    if (s.winner === "b") scoreB1++;
  });

  let offset = 0;
  const seq = [
    { from: (offset = 0), dur: D.intro },
    { from: (offset += D.intro), dur: D.shortAnswer },
    { from: (offset += D.shortAnswer), dur: D.keyDiff1 },
    { from: (offset += D.keyDiff1), dur: D.keyDiff2 },
    { from: (offset += D.keyDiff2), dur: D.table1 },
    { from: (offset += D.table1), dur: D.table2 },
    { from: (offset += D.table2), dur: D.prosCons },
    { from: (offset += D.prosCons), dur: D.verdict },
  ];

  return (
    <AbsoluteFill>
      <Audio src={staticFile("assets/bg-music.mp3")} volume={0.35} />

      <Sequence from={seq[0].from} durationInFrames={seq[0].dur}>
        <IntroSection entityA={props.entityA} entityB={props.entityB} category={props.category} />
      </Sequence>

      <Sequence from={seq[1].from} durationInFrames={seq[1].dur}>
        <ShortAnswerSection shortAnswer={props.shortAnswer} entityA={props.entityA} entityB={props.entityB} />
      </Sequence>

      <Sequence from={seq[2].from} durationInFrames={seq[2].dur}>
        <KeyDiffSlide differences={keyDiff1} entityA={props.entityA} entityB={props.entityB} page={1} totalPages={2} />
      </Sequence>

      <Sequence from={seq[3].from} durationInFrames={seq[3].dur}>
        <KeyDiffSlide differences={keyDiff2} entityA={props.entityA} entityB={props.entityB} page={2} totalPages={2} />
      </Sequence>

      <Sequence from={seq[4].from} durationInFrames={seq[4].dur}>
        <TableSlide stats={stats1} entityA={props.entityA} entityB={props.entityB} page={1} totalPages={2} showScore={false} cumulativeScoreA={0} cumulativeScoreB={0} />
      </Sequence>

      <Sequence from={seq[5].from} durationInFrames={seq[5].dur}>
        <TableSlide stats={stats2} entityA={props.entityA} entityB={props.entityB} page={2} totalPages={2} showScore={true} cumulativeScoreA={scoreA1} cumulativeScoreB={scoreB1} />
      </Sequence>

      <Sequence from={seq[6].from} durationInFrames={seq[6].dur}>
        <ProsConsSection
          entityA={props.entityA}
          entityB={props.entityB}
          prosA={props.prosA}
          consA={props.consA}
          prosB={props.prosB}
          consB={props.consB}
        />
      </Sequence>

      <Sequence from={seq[7].from} durationInFrames={seq[7].dur}>
        <VerdictSection entityA={props.entityA} entityB={props.entityB} stats={props.stats} verdict={props.verdict} />
      </Sequence>
    </AbsoluteFill>
  );
};
