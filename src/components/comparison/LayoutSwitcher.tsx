"use client";

import { useExperiment } from "@/lib/experiments";
import type { ReactNode } from "react";

interface LayoutSwitcherProps {
  verdictFirst: ReactNode;
  classic: ReactNode;
}

export function LayoutSwitcher({ verdictFirst, classic }: LayoutSwitcherProps) {
  const { variant, isActive } = useExperiment("verdict-first-layout");

  // When experiment is not active (outside date range or not in traffic bucket),
  // default to verdict-first (the current production default)
  if (!isActive || variant === "treatment") {
    return <>{verdictFirst}</>;
  }

  return <>{classic}</>;
}

interface ComparisonLayoutSwitcherProps {
  /** Default stacked layout */
  control: ReactNode;
  /** Side-by-side columns layout */
  sideBySide: ReactNode;
  /** Tabbed layout switching between entities */
  tabbed: ReactNode;
}

export function ComparisonLayoutSwitcher({
  control,
  sideBySide,
  tabbed,
}: ComparisonLayoutSwitcherProps) {
  const { variant, isActive } = useExperiment("comparison-layout");

  if (!isActive || variant === "control") {
    return <>{control}</>;
  }

  if (variant === "side-by-side") {
    return <>{sideBySide}</>;
  }

  if (variant === "tabbed") {
    return <>{tabbed}</>;
  }

  return <>{control}</>;
}
