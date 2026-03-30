export type Variant = "control" | "treatment";

export interface ExperimentConfig {
  id: string;
  name: string;
  variants: readonly [Variant, Variant];
  /** Percentage of total traffic included in the experiment (0-100) */
  trafficPercent: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
  goalMetric: string;
}

/**
 * All active experiments. Add a new entry here to launch a new test.
 * The framework auto-assigns variants via cookie on first visit.
 */
export const experiments: Record<string, ExperimentConfig> = {
  "verdict-first-layout": {
    id: "verdict-first-layout",
    name: "Verdict-First vs Classic Layout",
    variants: ["control", "treatment"] as const,
    trafficPercent: 100,
    startDate: "2026-03-30",
    endDate: "2026-04-13",
    goalMetric: "bounce_rate",
  },
  "cta-button-style": {
    id: "cta-button-style",
    name: "CTA Button Style: Inline vs Sticky",
    variants: ["control", "treatment"] as const,
    trafficPercent: 100,
    startDate: "2026-03-30",
    endDate: "2026-04-13",
    goalMetric: "affiliate_ctr",
  },
  "social-proof-elements": {
    id: "social-proof-elements",
    name: "Social Proof: None vs View Count + Trending Badge",
    variants: ["control", "treatment"] as const,
    trafficPercent: 100,
    startDate: "2026-03-30",
    endDate: "2026-04-13",
    goalMetric: "engagement_rate",
  },
};
