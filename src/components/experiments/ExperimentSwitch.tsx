"use client";

import { useExperiment } from "@/lib/experiments";
import type { ReactNode } from "react";

/**
 * Generic experiment switch component. Renders control or treatment
 * based on the user's variant assignment.
 */
export function ExperimentSwitch({
  experimentId,
  control,
  treatment,
}: {
  experimentId: string;
  control: ReactNode;
  treatment: ReactNode;
}) {
  const { variant, isLoading } = useExperiment(experimentId);

  // During SSR/loading, show control to avoid layout shift
  if (isLoading) return <>{control}</>;

  return <>{variant === "treatment" ? treatment : control}</>;
}
