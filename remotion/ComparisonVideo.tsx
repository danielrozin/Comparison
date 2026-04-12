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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VideoStat {
  label: string;
  valueA: string;
  valueB: string;
  winner: "a" | "b" | "tie";
}

export interface VideoKeyDifference {
  label: string;
  entityAValue: string;
  entityBValue: string;
  winner: "a" | "b" | "tie";
}

export interface ComparisonVideoProps {
  title: string;
  entityA: string;
  entityB: string;
  category: string;
  shortAnswer: string;
  keyDifferences: VideoKeyDifference[];
  stats: VideoStat[];
  prosA: string[];
  consA: string[];
  prosB: string[];
  consB: string[];
  verdict: string;
  slug: string;
}

// ---------------------------------------------------------------------------
// Timing (frames at 30fps)
// ---------------------------------------------------------------------------

export const FPS = 30;
export const SECTION_DURATIONS = {
  intro: FPS * 4,
  shortAnswer: FPS * 5,
  keyDifferences: FPS * 7,
  comparisonTable: FPS * 8,
  prosCons: FPS * 7,
  verdict: FPS * 5,
};

export function getTotalFrames() {
  return Object.values(SECTION_DURATIONS).reduce((a, b) => a + b, 0);
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

const slideUp = (frame: number, start: number, dist = 40, dur = 15) => ({
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
        borderRadius: 24,
        padding: "10px 28px",
        color: C.primary,
        fontSize: 24,
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
  const vsScale = spring({ frame: frame - 20, fps, config: { damping: 12 } });

  return (
    <PageBg>
      <Badge opacity={fadeIn(frame, 0, 15)} />

      {/* Category */}
      <div style={{ position: "absolute", top: 140, left: 0, right: 0, textAlign: "center", ...slideUp(frame, 5) }}>
        <span
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: 20,
            padding: "10px 26px",
            color: C.gold,
            fontSize: 24,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          {category}
        </span>
      </div>

      {/* Entity cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: 30,
        }}
      >
        {/* Entity A */}
        <div
          style={{
            ...slideUp(frame, 8, 60),
            background: C.entityABg,
            border: `2px solid ${C.entityABorder}`,
            borderRadius: 28,
            padding: "36px 60px",
            textAlign: "center",
            width: "85%",
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.entityA}, #60a5fa)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              fontWeight: 900,
              color: "white",
              margin: "0 auto 20px",
              boxShadow: `0 0 50px ${C.entityA}40`,
            }}
          >
            {entityA.charAt(0)}
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, color: C.white }}>{entityA}</div>
        </div>

        {/* VS */}
        <div
          style={{
            transform: `scale(${vsScale})`,
            fontSize: 80,
            fontWeight: 900,
            color: C.gold,
            textShadow: `0 0 50px ${C.gold}50`,
          }}
        >
          VS
        </div>

        {/* Entity B */}
        <div
          style={{
            ...slideUp(frame, 12, 60),
            background: C.entityBBg,
            border: `2px solid ${C.entityBBorder}`,
            borderRadius: 28,
            padding: "36px 60px",
            textAlign: "center",
            width: "85%",
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.entityB}, #a78bfa)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              fontWeight: 900,
              color: "white",
              margin: "0 auto 20px",
              boxShadow: `0 0 50px ${C.entityB}40`,
            }}
          >
            {entityB.charAt(0)}
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, color: C.white }}>{entityB}</div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center", ...slideUp(frame, 25) }}>
        <div style={{ fontSize: 30, color: C.muted, fontWeight: 600 }}>
          Who wins? Let's compare the data...
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
          padding: "0 20px",
        }}
      >
        {/* Label */}
        <div style={{ ...slideUp(frame, 5), marginBottom: 40, textAlign: "center" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: C.gold,
              textTransform: "uppercase",
              letterSpacing: 5,
              marginBottom: 16,
            }}
          >
            Quick Answer
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, color: C.white }}>
            {entityA} vs {entityB}
          </div>
        </div>

        {/* Quote card */}
        <div
          style={{
            ...slideUp(frame, 15),
            background: "rgba(251,191,36,0.06)",
            border: "2px solid rgba(251,191,36,0.2)",
            borderRadius: 24,
            padding: "44px 48px",
            width: "100%",
          }}
        >
          <div style={{ fontSize: 60, color: C.gold, marginBottom: 16, lineHeight: 1 }}>&#x201C;</div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.55,
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
// 3. KEY DIFFERENCES TABLE
// ---------------------------------------------------------------------------

const KeyDifferencesSection: React.FC<{
  differences: VideoKeyDifference[];
  entityA: string;
  entityB: string;
}> = ({ differences, entityA, entityB }) => {
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
          padding: "100px 0 40px",
        }}
      >
        {/* Title */}
        <div style={{ ...slideUp(frame, 3), textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.gold, textTransform: "uppercase", letterSpacing: 5 }}>
            Key Differences
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: C.card,
            borderRadius: 24,
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
              padding: "22px 28px",
            }}
          >
            <div style={{ flex: 1, fontSize: 28, fontWeight: 900, color: C.entityA, textAlign: "center" }}>
              {entityA}
            </div>
            <div style={{ width: 200, fontSize: 24, fontWeight: 700, color: C.muted, textAlign: "center" }}>
              Attribute
            </div>
            <div style={{ flex: 1, fontSize: 28, fontWeight: 900, color: C.entityB, textAlign: "center" }}>
              {entityB}
            </div>
          </div>

          {/* Rows */}
          {differences.map((diff, i) => {
            const rowDelay = 15 + i * 12;
            const aWins = diff.winner === "a";
            const bWins = diff.winner === "b";

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "20px 28px",
                  borderTop: `1px solid ${C.cardBorder}`,
                  alignItems: "center",
                  ...slideUp(frame, rowDelay, 20),
                }}
              >
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 28,
                    fontWeight: 800,
                    color: aWins ? C.green : C.white,
                    background: aWins ? C.winBg : "transparent",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  {aWins && "🏆 "}{diff.entityAValue}
                </div>

                <div style={{ width: 200, textAlign: "center", fontSize: 22, fontWeight: 700, color: C.gold }}>
                  {diff.label}
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 28,
                    fontWeight: 800,
                    color: bWins ? C.green : C.white,
                    background: bWins ? C.winBg : "transparent",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  {diff.entityBValue}{bWins && " 🏆"}
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
// 4. FULL COMPARISON TABLE
// ---------------------------------------------------------------------------

const ComparisonTableSection: React.FC<{
  stats: VideoStat[];
  entityA: string;
  entityB: string;
}> = ({ stats, entityA, entityB }) => {
  const frame = useCurrentFrame();
  let scoreA = 0;
  let scoreB = 0;

  return (
    <PageBg>
      <Badge opacity={fadeIn(frame, 0)} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          padding: "100px 0 40px",
        }}
      >
        {/* Title */}
        <div style={{ ...slideUp(frame, 3), textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.gold, textTransform: "uppercase", letterSpacing: 5 }}>
            Full Comparison
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: C.card,
            borderRadius: 24,
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
              padding: "20px 24px",
              alignItems: "center",
            }}
          >
            <div style={{ width: 220, fontSize: 20, fontWeight: 800, color: C.dim, textTransform: "uppercase", letterSpacing: 2 }}>
              Attribute
            </div>
            <div style={{ flex: 1, fontSize: 28, fontWeight: 900, color: C.entityA, textAlign: "center" }}>
              {entityA}
            </div>
            <div style={{ flex: 1, fontSize: 28, fontWeight: 900, color: C.entityB, textAlign: "center" }}>
              {entityB}
            </div>
          </div>

          {/* Rows */}
          {stats.map((stat, i) => {
            if (stat.winner === "a") scoreA++;
            if (stat.winner === "b") scoreB++;
            const aWins = stat.winner === "a";
            const bWins = stat.winner === "b";
            const rowDelay = 12 + i * 8;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "16px 24px",
                  borderTop: `1px solid ${C.cardBorder}`,
                  alignItems: "center",
                  ...slideUp(frame, rowDelay, 15),
                }}
              >
                <div style={{ width: 220, fontSize: 22, fontWeight: 700, color: C.muted }}>
                  {stat.label}
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 28,
                    fontWeight: 900,
                    color: aWins ? C.green : C.white,
                    background: aWins ? C.winBg : "transparent",
                    borderRadius: 10,
                    padding: "8px 8px",
                  }}
                >
                  {stat.valueA}{aWins && " ✓"}
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 28,
                    fontWeight: 900,
                    color: bWins ? C.green : C.white,
                    background: bWins ? C.winBg : "transparent",
                    borderRadius: 10,
                    padding: "8px 8px",
                  }}
                >
                  {stat.valueB}{bWins && " ✓"}
                </div>
              </div>
            );
          })}

          {/* Score row */}
          <div
            style={{
              display: "flex",
              padding: "22px 24px",
              borderTop: `2px solid ${C.gold}40`,
              background: "rgba(251,191,36,0.05)",
              ...slideUp(frame, 12 + stats.length * 8 + 5),
            }}
          >
            <div style={{ width: 220, fontSize: 24, fontWeight: 900, color: C.gold }}>SCORE</div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 36, fontWeight: 900, color: C.entityA }}>{scoreA}</div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 36, fontWeight: 900, color: C.entityB }}>{scoreB}</div>
          </div>
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
          fontSize: 20,
          fontWeight: 900,
          color: type === "pro" ? C.green : C.red,
          textTransform: "uppercase",
          letterSpacing: 4,
          marginBottom: 14,
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
            gap: 12,
            marginBottom: 12,
            ...slideUp(frame, baseDelay + i * 6, 20),
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: type === "pro" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 900,
              color: type === "pro" ? C.green : C.red,
              flexShrink: 0,
              marginTop: 3,
            }}
          >
            {type === "pro" ? "✓" : "✗"}
          </div>
          <div style={{ fontSize: 24, color: C.white, lineHeight: 1.4, fontWeight: 600 }}>{item}</div>
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
          padding: "100px 0 40px",
        }}
      >
        <div style={{ ...slideUp(frame, 3), textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.gold, textTransform: "uppercase", letterSpacing: 5 }}>
            Pros &amp; Cons
          </div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {/* Entity A */}
          <div
            style={{
              flex: 1,
              background: C.entityABg,
              border: `1px solid ${C.entityABorder}`,
              borderRadius: 24,
              padding: "28px 30px",
              ...slideUp(frame, 6),
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 900, color: C.entityA, marginBottom: 24, textAlign: "center" }}>
              {entityA}
            </div>
            <List items={prosA} type="pro" baseDelay={15} />
            <div style={{ height: 24 }} />
            <List items={consA} type="con" baseDelay={40} />
          </div>

          {/* Entity B */}
          <div
            style={{
              flex: 1,
              background: C.entityBBg,
              border: `1px solid ${C.entityBBorder}`,
              borderRadius: 24,
              padding: "28px 30px",
              ...slideUp(frame, 10),
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 900, color: C.entityB, marginBottom: 24, textAlign: "center" }}>
              {entityB}
            </div>
            <List items={prosB} type="pro" baseDelay={20} />
            <div style={{ height: 24 }} />
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
  slug: string;
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
          padding: "0 20px",
        }}
      >
        {/* Verdict card */}
        <div
          style={{
            background: "linear-gradient(135deg, #312e81 0%, #581c87 50%, #312e81 100%)",
            borderRadius: 32,
            padding: "56px 50px",
            textAlign: "center",
            width: "100%",
            boxShadow: "0 20px 80px rgba(88,28,135,0.4)",
            ...slideUp(frame, 5),
          }}
        >
          {/* Trophy */}
          <div style={{ fontSize: 90, marginBottom: 20, transform: `scale(${trophyScale})` }}>
            {winner === "Tie" ? "🤝" : "🏆"}
          </div>

          {/* Winner */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: winnerColor,
              textShadow: `0 0 40px ${winnerColor}40`,
              marginBottom: 14,
              ...slideUp(frame, 12),
            }}
          >
            {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}
          </div>

          {/* Score */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: C.muted,
              marginBottom: 36,
              ...slideUp(frame, 18),
            }}
          >
            <span style={{ color: C.entityA }}>{entityA} {scoreA}</span>
            <span style={{ margin: "0 20px", color: C.dim }}>—</span>
            <span style={{ color: C.entityB }}>{scoreB} {entityB}</span>
          </div>

          {/* Verdict text */}
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.55,
              color: C.white,
              fontWeight: 600,
              ...slideUp(frame, 25),
            }}
          >
            {verdict}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 44, ...slideUp(frame, 35) }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
              borderRadius: 20,
              padding: "22px 50px",
              fontSize: 28,
              fontWeight: 800,
              color: "white",
              boxShadow: `0 10px 40px ${C.primary}40`,
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
// Main Composition
// ---------------------------------------------------------------------------

export const ComparisonVideo: React.FC<ComparisonVideoProps> = (props) => {
  const D = SECTION_DURATIONS;
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
      {/* Background music */}
      <Audio src={staticFile("assets/bg-music.mp3")} volume={0.35} />

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
        <ComparisonTableSection stats={props.stats} entityA={props.entityA} entityB={props.entityB} />
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
        <VerdictSection
          entityA={props.entityA}
          entityB={props.entityB}
          stats={props.stats}
          verdict={props.verdict}
          slug={props.slug}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
