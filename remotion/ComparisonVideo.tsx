import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
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

export interface ComparisonVideoProps {
  title: string;
  entityA: string;
  entityB: string;
  category: string;
  stats: VideoStat[];
  verdict: string;
  slug: string;
}

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------

const COLORS = {
  bg: "#0f172a",
  bgCard: "#1e293b",
  primary: "#3b82f6",
  accent: "#8b5cf6",
  green: "#22c55e",
  red: "#ef4444",
  textWhite: "#f8fafc",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  gold: "#fbbf24",
  entityA: "#3b82f6",
  entityB: "#8b5cf6",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const TitleCard: React.FC<{
  entityA: string;
  entityB: string;
  category: string;
}> = ({ entityA, entityB, category }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vsScale = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const nameAX = interpolate(frame, [0, 15], [-400, 0], { extrapolateRight: "clamp" });
  const nameBX = interpolate(frame, [0, 15], [400, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, #1a1a2e 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      }}
    >
      {/* Category badge */}
      <div
        style={{
          position: "absolute",
          top: 80,
          background: "rgba(59,130,246,0.15)",
          border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: 20,
          padding: "8px 24px",
          color: COLORS.primary,
          fontSize: 24,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 3,
          opacity,
        }}
      >
        {category}
      </div>

      {/* Entity A */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "35%",
          transform: `translateX(${nameAX}px)`,
          opacity,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.entityA}, #60a5fa)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            fontWeight: 900,
            color: "white",
            marginBottom: 20,
            boxShadow: `0 0 40px ${COLORS.entityA}40`,
          }}
        >
          {entityA.charAt(0)}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: COLORS.textWhite,
            maxWidth: 300,
            lineHeight: 1.2,
          }}
        >
          {entityA}
        </div>
      </div>

      {/* VS badge */}
      <div
        style={{
          transform: `scale(${vsScale})`,
          fontSize: 72,
          fontWeight: 900,
          color: COLORS.gold,
          textShadow: `0 0 30px ${COLORS.gold}60`,
          zIndex: 10,
        }}
      >
        VS
      </div>

      {/* Entity B */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "35%",
          transform: `translateX(${nameBX}px)`,
          opacity,
          textAlign: "right",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.entityB}, #a78bfa)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            fontWeight: 900,
            color: "white",
            marginBottom: 20,
            marginLeft: "auto",
            boxShadow: `0 0 40px ${COLORS.entityB}40`,
          }}
        >
          {entityB.charAt(0)}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: COLORS.textWhite,
            maxWidth: 300,
            lineHeight: 1.2,
          }}
        >
          {entityB}
        </div>
      </div>

      {/* Bottom line */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          fontSize: 22,
          color: COLORS.textMuted,
          opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Who wins? Let&apos;s compare the stats...
      </div>
    </AbsoluteFill>
  );
};

const StatBattle: React.FC<{
  stat: VideoStat;
  entityA: string;
  entityB: string;
  roundNumber: number;
  scoreA: number;
  scoreB: number;
}> = ({ stat, entityA, entityB, roundNumber, scoreA, scoreB }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelReveal = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const valueAReveal = spring({ frame: frame - 8, fps, config: { damping: 15 } });
  const valueBReveal = spring({ frame: frame - 14, fps, config: { damping: 15 } });
  const winnerGlow = interpolate(frame, [22, 30], [0, 1], { extrapolateRight: "clamp" });
  const scoreReveal = interpolate(frame, [25, 32], [0, 1], { extrapolateRight: "clamp" });

  const aWins = stat.winner === "a";
  const bWins = stat.winner === "b";

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.bg} 0%, #0c1222 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      }}
    >
      {/* Round number */}
      <div
        style={{
          position: "absolute",
          top: 60,
          fontSize: 20,
          color: COLORS.textDim,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: labelReveal,
        }}
      >
        Round {roundNumber}
      </div>

      {/* Stat label */}
      <div
        style={{
          position: "absolute",
          top: 110,
          fontSize: 40,
          fontWeight: 800,
          color: COLORS.gold,
          opacity: labelReveal,
          textAlign: "center",
        }}
      >
        {stat.label}
      </div>

      {/* Two columns */}
      <div
        style={{
          display: "flex",
          width: "85%",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        {/* Entity A */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            transform: `scale(${valueAReveal})`,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: COLORS.entityA,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 900,
              color: "white",
              margin: "0 auto 16px",
              boxShadow: aWins
                ? `0 0 ${30 * winnerGlow}px ${COLORS.green}80`
                : "none",
              border: aWins
                ? `3px solid ${COLORS.green}`
                : "3px solid transparent",
            }}
          >
            {entityA.charAt(0)}
          </div>
          <div style={{ fontSize: 20, color: COLORS.textMuted, marginBottom: 8 }}>
            {entityA}
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: aWins ? COLORS.green : COLORS.textWhite,
              textShadow: aWins ? `0 0 20px ${COLORS.green}60` : "none",
            }}
          >
            {stat.valueA}
          </div>
          {aWins && (
            <div
              style={{
                marginTop: 12,
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.green,
                opacity: winnerGlow,
              }}
            >
              WINS
            </div>
          )}
        </div>

        {/* VS divider */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: COLORS.textDim,
            padding: "0 16px",
          }}
        >
          VS
        </div>

        {/* Entity B */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            transform: `scale(${valueBReveal})`,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: COLORS.entityB,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 900,
              color: "white",
              margin: "0 auto 16px",
              boxShadow: bWins
                ? `0 0 ${30 * winnerGlow}px ${COLORS.green}80`
                : "none",
              border: bWins
                ? `3px solid ${COLORS.green}`
                : "3px solid transparent",
            }}
          >
            {entityB.charAt(0)}
          </div>
          <div style={{ fontSize: 20, color: COLORS.textMuted, marginBottom: 8 }}>
            {entityB}
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: bWins ? COLORS.green : COLORS.textWhite,
              textShadow: bWins ? `0 0 20px ${COLORS.green}60` : "none",
            }}
          >
            {stat.valueB}
          </div>
          {bWins && (
            <div
              style={{
                marginTop: 12,
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.green,
                opacity: winnerGlow,
              }}
            >
              WINS
            </div>
          )}
        </div>
      </div>

      {/* Score bar */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          display: "flex",
          gap: 40,
          fontSize: 28,
          fontWeight: 800,
          opacity: scoreReveal,
        }}
      >
        <span style={{ color: COLORS.entityA }}>{entityA}: {scoreA}</span>
        <span style={{ color: COLORS.textDim }}>|</span>
        <span style={{ color: COLORS.entityB }}>{entityB}: {scoreB}</span>
      </div>
    </AbsoluteFill>
  );
};

const VerdictCard: React.FC<{
  entityA: string;
  entityB: string;
  scoreA: number;
  scoreB: number;
  verdict: string;
  slug: string;
}> = ({ entityA, entityB, scoreA, scoreB, verdict, slug }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12 } });
  const textReveal = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });
  const winner = scoreA > scoreB ? entityA : scoreB > scoreA ? entityB : "Tie";
  const winnerColor = scoreA > scoreB ? COLORS.entityA : scoreB > scoreA ? COLORS.entityB : COLORS.gold;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, #1a1a2e 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        {/* Trophy */}
        <div style={{ fontSize: 80, marginBottom: 16 }}>
          {scoreA === scoreB ? "🤝" : "🏆"}
        </div>

        {/* Winner name */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: winnerColor,
            textShadow: `0 0 30px ${winnerColor}40`,
            marginBottom: 12,
          }}
        >
          {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}
        </div>

        {/* Final score */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: COLORS.textMuted,
            marginBottom: 30,
          }}
        >
          {scoreA} — {scoreB}
        </div>
      </div>

      {/* Verdict text */}
      <div
        style={{
          maxWidth: 550,
          textAlign: "center",
          fontSize: 22,
          color: COLORS.textWhite,
          lineHeight: 1.5,
          opacity: textReveal,
          padding: "0 40px",
        }}
      >
        {verdict.length > 160 ? verdict.slice(0, 157) + "..." : verdict}
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          opacity: interpolate(frame, [30, 40], [0, 1], { extrapolateRight: "clamp" }),
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: COLORS.primary,
            borderRadius: 12,
            padding: "14px 32px",
            fontSize: 20,
            fontWeight: 700,
            color: "white",
          }}
        >
          Full comparison at aversusb.net
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

export const ComparisonVideo: React.FC<ComparisonVideoProps> = ({
  entityA,
  entityB,
  category,
  stats,
  verdict,
  slug,
}) => {
  const TITLE_DURATION = 45; // 1.5s
  const STAT_DURATION = 45; // 1.5s per stat
  const VERDICT_DURATION = 60; // 2s

  const displayStats = stats.slice(0, 6);
  let runningA = 0;
  let runningB = 0;

  return (
    <AbsoluteFill>
      {/* Title */}
      <Sequence from={0} durationInFrames={TITLE_DURATION}>
        <TitleCard entityA={entityA} entityB={entityB} category={category} />
      </Sequence>

      {/* Stat battles */}
      {displayStats.map((stat, i) => {
        if (stat.winner === "a") runningA++;
        if (stat.winner === "b") runningB++;
        const scoreA = runningA;
        const scoreB = runningB;

        return (
          <Sequence
            key={i}
            from={TITLE_DURATION + i * STAT_DURATION}
            durationInFrames={STAT_DURATION}
          >
            <StatBattle
              stat={stat}
              entityA={entityA}
              entityB={entityB}
              roundNumber={i + 1}
              scoreA={scoreA}
              scoreB={scoreB}
            />
          </Sequence>
        );
      })}

      {/* Verdict */}
      <Sequence
        from={TITLE_DURATION + displayStats.length * STAT_DURATION}
        durationInFrames={VERDICT_DURATION}
      >
        <VerdictCard
          entityA={entityA}
          entityB={entityB}
          scoreA={runningA}
          scoreB={runningB}
          verdict={verdict}
          slug={slug}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
