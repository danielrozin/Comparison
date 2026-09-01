"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
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

/** Stable visitor ID persisted in localStorage for deterministic assignment. */
function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  const key = "ab_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function assignVariant(
  experiment: ExperimentConfig,
  existing: ExperimentAssignments
): ExperimentAssignments {
  if (existing[experiment.id]) return existing;

  const visitorId = getVisitorId();

  // Traffic gating: deterministic hash of visitor + experiment for stable bucket
  const bucket = hashString(experiment.id + visitorId) % 100;
  if (bucket >= experiment.trafficPercent) return existing;

  // Variant assignment: deterministic so same visitor always sees same variant
  const variantIndex =
    hashString(visitorId + experiment.id) % experiment.variants.length;

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

  // Start from the server-known assignments so the first client render matches
  // the server HTML. New variants need a browser-only visitor id, so they are
  // resolved after mount (below) — resolving them during render would bucket
  // against the literal "server" id and mismatch on hydration (React #418).
  const [assignments, setAssignments] = useState<ExperimentAssignments>(
    serverAssignments
  );

  // Resolve variants, persist to cookie & fire GA4 events (client-only, once)
  const firedRef = useRef(false);
  useEffect(() => {
    const resolved = resolveAssignments(serverAssignments);
    setAssignments(resolved);
    writeCookie(resolved);

    if (firedRef.current) return;
    firedRef.current = true;

    const active = getActiveExperiments();
    for (const exp of active) {
      const assignment = resolved[exp.id];
      if (assignment) {
        trackEvent("experiment_view", {
          experiment_id: exp.id,
          experiment_name: exp.name,
          variant: assignment.variant,
        });
      }
    }
  }, [serverAssignments]);

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
