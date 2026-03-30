import { type Variant, experiments } from "./config";

const COOKIE_NAME = "ab_experiments";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export type Assignments = Record<string, Variant>;

/** Parse the ab_experiments cookie value into assignment map */
export function parseAssignments(cookieValue: string | undefined): Assignments {
  if (!cookieValue) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue));
    if (typeof parsed === "object" && parsed !== null) return parsed as Assignments;
  } catch {
    // corrupt cookie — start fresh
  }
  return {};
}

/** Serialize assignments to cookie value string */
export function serializeAssignments(assignments: Assignments): string {
  return encodeURIComponent(JSON.stringify(assignments));
}

/** Assign a variant for an experiment using 50/50 split */
function assignVariant(): Variant {
  return Math.random() < 0.5 ? "control" : "treatment";
}

/** Check if an experiment is currently active based on dates */
function isActive(startDate: string, endDate: string): boolean {
  const now = new Date();
  return now >= new Date(startDate) && now <= new Date(endDate);
}

/**
 * Resolve all experiment assignments. Returns existing assignments for returning
 * visitors and generates new ones for new experiments. Only assigns active experiments.
 */
export function resolveAssignments(existing: Assignments): {
  assignments: Assignments;
  newAssignments: string[]; // experiment IDs that were newly assigned
} {
  const assignments = { ...existing };
  const newAssignments: string[] = [];

  for (const [id, config] of Object.entries(experiments)) {
    if (!isActive(config.startDate, config.endDate)) continue;
    if (assignments[id]) continue; // already assigned

    // Traffic sampling: only include if within traffic percent
    if (Math.random() * 100 > config.trafficPercent) continue;

    assignments[id] = assignVariant();
    newAssignments.push(id);
  }

  return { assignments, newAssignments };
}

/** Build a Set-Cookie header value for the assignments */
export function buildCookieHeader(assignments: Assignments): string {
  return `${COOKIE_NAME}=${serializeAssignments(assignments)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export { COOKIE_NAME };
