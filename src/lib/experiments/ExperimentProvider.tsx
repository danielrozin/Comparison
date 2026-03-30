"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Variant } from "./config";
import { experiments } from "./config";
import {
  parseAssignments,
  resolveAssignments,
  serializeAssignments,
  COOKIE_NAME,
  type Assignments,
} from "./cookies";
import { trackEvent } from "@/lib/utils/analytics";

interface ExperimentContextValue {
  assignments: Assignments;
  isReady: boolean;
}

const ExperimentContext = createContext<ExperimentContextValue>({
  assignments: {},
  isReady: false,
});

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1];
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExperimentContextValue>({
    assignments: {},
    isReady: false,
  });

  useEffect(() => {
    const existing = parseAssignments(getCookie(COOKIE_NAME));
    const { assignments, newAssignments } = resolveAssignments(existing);

    // Persist updated assignments
    setCookie(COOKIE_NAME, serializeAssignments(assignments), 30 * 24 * 60 * 60);

    // Fire GA4 experiment_view for all active assignments
    for (const [experimentId, variant] of Object.entries(assignments)) {
      const config = experiments[experimentId];
      if (!config) continue;
      trackEvent("experiment_view", {
        experiment_id: experimentId,
        experiment_name: config.name,
        variant,
        is_new_assignment: newAssignments.includes(experimentId) ? 1 : 0,
      });
    }

    setState({ assignments, isReady: true });
  }, []);

  return (
    <ExperimentContext.Provider value={state}>
      {children}
    </ExperimentContext.Provider>
  );
}

/**
 * Get the variant assignment for a specific experiment.
 * Returns { variant, isLoading } — renders control during SSR/loading.
 */
export function useExperiment(experimentId: string): {
  variant: Variant;
  isLoading: boolean;
} {
  const { assignments, isReady } = useContext(ExperimentContext);

  if (!isReady) {
    return { variant: "control", isLoading: true };
  }

  return {
    variant: assignments[experimentId] || "control",
    isLoading: false,
  };
}
