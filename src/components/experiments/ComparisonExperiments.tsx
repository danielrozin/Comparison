"use client";

import { useExperiment } from "@/lib/experiments";
import type { ReactNode } from "react";

/**
 * Experiment 1: Verdict-First Layout
 * Control = classic layout, Treatment = verdict-first layout
 */
export function LayoutExperiment({
  classic,
  verdictFirst,
}: {
  classic: ReactNode;
  verdictFirst: ReactNode;
}) {
  const { variant, isLoading } = useExperiment("verdict-first-layout");
  // Default to verdict-first during loading (current production default)
  if (isLoading) return <>{verdictFirst}</>;
  return <>{variant === "treatment" ? verdictFirst : classic}</>;
}

/**
 * Experiment 2: CTA Button Style
 * Control = inline affiliate buttons only (no sticky bar)
 * Treatment = sticky bottom CTA bar
 */
export function CTAExperiment({
  stickyCTA,
}: {
  stickyCTA: ReactNode;
}) {
  const { variant, isLoading } = useExperiment("cta-button-style");
  // Control: no sticky CTA. Treatment: show sticky CTA
  if (isLoading || variant !== "treatment") return null;
  return <>{stickyCTA}</>;
}
