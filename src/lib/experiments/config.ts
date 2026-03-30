import { ExperimentConfig } from "./types";

export const experiments: ExperimentConfig[] = [
  {
    id: "verdict-first-layout",
    name: "Verdict-First vs Classic Layout",
    variants: ["control", "treatment"],
    trafficPercent: 100,
    startDate: "2026-03-30",
    endDate: "2026-05-30",
    goalMetric: "bounce_rate",
  },
  {
    id: "cta-button-style",
    name: "CTA Button Style",
    variants: ["control", "treatment"],
    trafficPercent: 100,
    startDate: "2026-05-15",
    endDate: "2026-06-15",
    goalMetric: "affiliate_click",
  },
  {
    id: "social-proof-elements",
    name: "Social Proof Elements",
    variants: ["control", "treatment"],
    trafficPercent: 100,
    startDate: "2026-05-15",
    endDate: "2026-06-15",
    goalMetric: "engagement_rate",
  },
];

export function getActiveExperiments(): ExperimentConfig[] {
  const now = new Date();
  return experiments.filter((exp) => {
    const start = new Date(exp.startDate);
    const end = new Date(exp.endDate);
    return now >= start && now <= end;
  });
}

export function getExperimentById(id: string): ExperimentConfig | undefined {
  return experiments.find((exp) => exp.id === id);
}
