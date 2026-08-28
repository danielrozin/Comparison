import { ExperimentConfig } from "./types";

export const experiments: ExperimentConfig[] = [
  {
    id: "cta-button-style",
    name: "CTA Button Style",
    variants: ["control", "treatment"],
    trafficPercent: 100,
    startDate: "2026-03-30",
    endDate: "2026-05-30",
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
  {
    id: "comparison-layout",
    name: "Comparison Layout",
    variants: ["control", "side-by-side", "tabbed"],
    trafficPercent: 100,
    startDate: "2026-04-15",
    endDate: "2026-05-15",
    goalMetric: "engagement_rate",
  },
  {
    // Follow-CTA framing on comparison pages: "follow the comparison" vs
    // "price-drop alerts". Goal = newsletter signups from compare pages.
    id: "follow-cta-copy",
    name: "Follow CTA Copy",
    variants: ["control", "alerts"],
    trafficPercent: 100,
    startDate: "2026-08-28",
    endDate: "2026-10-28",
    goalMetric: "newsletter_signup",
  },
  {
    id: "cta-placement",
    name: "CTA Placement",
    variants: ["control", "sticky-bottom", "inline-verdict"],
    trafficPercent: 50,
    startDate: "2026-04-15",
    endDate: "2026-05-15",
    goalMetric: "affiliate_click",
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
