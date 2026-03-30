"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { getActiveExperiments } from "./config";
import type { ExperimentAssignments, ExperimentConfig } from "./types";
import { trackEvent } from "@/lib/utils/analytics";

const COOKIE_NAME = "ab_experiments";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// ── Cookie helpers ──────────────────────────────────────────────

function parseCookie(raw: string): ExperimentAssignments {
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return {};
  }
}

function readCookieClient(): ExperimentAssignments {
  if (typeof document === "undefined") return {};
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  return match ? parseCookie(match[1]) : {};
}

function writeCookie(assignments: ExperimentAssignments) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(assignments));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

// ── Variant assignment ──────────────────────────────────────────

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function assignVariant(
  experiment: ExperimentConfig,
  existing: ExperimentAssignments
): ExperimentAssignments {
  if (existing[experiment.id]) return existing;

  // Traffic gating: use a deterministic hash so the same user always
  // gets the same in/out decision even before a cookie exists.
  const bucket = hashString(experiment.id + (Math.random() * 1e9).toString()) % 100;
  if (bucket >= experiment.trafficPercent) return existing;

  const variantIndex =
    hashString(experiment.id + Date.now().toString()) % experiment.variants.length;

  return {
    ...existing,
    [experiment.id]: {
      variant: experiment.variants[variantIndex],
      assignedAt: Date.now(),
    },
  };
}

function resolveAssignments(
  initial: ExperimentAssignments
): ExperimentAssignments {
  const active = getActiveExperiments();
  let assignments = { ...initial };

  for (const exp of active) {
    assignments = assignVariant(exp, assignments);
  }

  return assignments;
}

// ── Context ─────────────────────────────────────────────────────

const ExperimentContext = createContext<ExperimentAssignments>({});

interface ExperimentProviderProps {
  children: ReactNode;
  initialCookie?: string;
}

export function ExperimentProvider({
  children,
  initialCookie,
}: ExperimentProviderProps) {
  // Parse whatever the server already knows from the cookie
  const serverAssignments = useMemo(
    () => (initialCookie ? parseCookie(initialCookie) : {}),
    [initialCookie]
  );

  // Resolve: keep existing assignments, add new ones for active experiments
  const assignments = useMemo(
    () => resolveAssignments(serverAssignments),
    [serverAssignments]
  );

  // Persist to cookie & fire GA4 events (client-only, once)
  const firedRef = useRef(false);
  useEffect(() => {
    writeCookie(assignments);

    if (firedRef.current) return;
    firedRef.current = true;

    const active = getActiveExperiments();
    for (const exp of active) {
      const assignment = assignments[exp.id];
      if (assignment) {
        trackEvent("experiment_view", {
          experiment_id: exp.id,
          experiment_name: exp.name,
          variant: assignment.variant,
        });
      }
    }
  }, [assignments]);

  return (
    <ExperimentContext.Provider value={assignments}>
      {children}
    </ExperimentContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────────

export function useExperiment(experimentId: string): {
  variant: string;
  isActive: boolean;
} {
  const assignments = useContext(ExperimentContext);
  const assignment = assignments[experimentId];

  if (!assignment) {
    return { variant: "control", isActive: false };
  }

  return { variant: assignment.variant, isActive: true };
}
