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
