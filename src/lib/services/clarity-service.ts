/**
 * Microsoft Clarity Integration Service
 *
 * Client-side: Custom tags to correlate Clarity sessions with our events.
 * Server-side: API integration to pull Clarity analytics data programmatically.
 *
 * Clarity custom tags allow filtering session recordings by comparison slug,
 * search query, experiment variant, and engagement level — making it possible
 * to find recordings of users who experienced specific UX issues.
 *
 * Server-side API requires Azure AD credentials:
 *   CLARITY_API_TOKEN — Bearer token from Azure AD app registration
 *   CLARITY_PROJECT_ID — Clarity project ID (default: w2svnzrk4f)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export interface ClaritySessionSummary {
  sessionId: string;
  userId: string;
  startTime: string;
  duration: number;
  pagesViewed: number;
  rageClicks: number;
  deadClicks: number;
  quickBacks: number;
  excessiveScrolls: number;
  jsErrors: number;
  frustrationScore: number;
  device: "desktop" | "mobile" | "tablet";
  country: string;
  pages: string[];
  replayUrl: string;
}

export interface ClarityHeatmapData {
  url: string;
  clickCount: number;
  scrollReach: { p25: number; p50: number; p75: number; p100: number };
  topClickElements: Array<{ selector: string; clicks: number; isDeadClick: boolean }>;
  topRageClickElements: Array<{ selector: string; rageClicks: number }>;
}

export interface ClarityFrustrationReport {
  topFrustratedPages: Array<{
    url: string;
    frustrationScore: number;
    rageClicks: number;
    deadClicks: number;
    quickBacks: number;
    sessions: number;
  }>;
  recentHighFrustrationSessions: ClaritySessionSummary[];
  summary: {
    totalSessions: number;
    frustratedSessionPct: number;
    topFrustrationSignal: "rage_clicks" | "dead_clicks" | "quick_backs" | "js_errors";
    avgFrustrationScore: number;
  };
}

// ---------------------------------------------------------------------------
// Client-Side: Custom Tags
// ---------------------------------------------------------------------------

/**
 * Set a Clarity custom tag. Tags allow filtering recordings in the dashboard.
 * Safe to call server-side (no-ops silently).
 */
function setTag(key: string, value: string): void {
  if (typeof window === "undefined" || typeof window.clarity !== "function") return;
  window.clarity("set", key, value);
}

/**
 * Identify the current user in Clarity (ties sessions to a user ID).
 */
export function clarityIdentify(userId: string, sessionId?: string, pageId?: string): void {
  if (typeof window === "undefined" || typeof window.clarity !== "function") return;
  window.clarity("identify", userId, sessionId, pageId);
}

/** Tag the current comparison being viewed */
export function tagComparisonView(slug: string, category: string): void {
  setTag("comparison_slug", slug);
  setTag("comparison_category", category);
}

/** Tag the search query a user performed */
export function tagSearchQuery(query: string, resultCount: number): void {
  setTag("search_query", query);
  setTag("search_results", String(resultCount));
}

/** Tag the A/B experiment variant for this session */
export function tagExperimentVariant(experimentId: string, variant: string): void {
  setTag(`exp_${experimentId}`, variant);
}

/** Tag user engagement level on the current page */
export function tagEngagement(level: "bounce" | "shallow" | "engaged" | "converted"): void {
  setTag("engagement_level", level);
}

/** Tag a specific user action for easy recording lookup */
export function tagUserAction(action: string): void {
  setTag("user_action", action);
}

/** Tag the page type for filtering */
export function tagPageType(type: "home" | "search" | "category" | "comparison" | "blog" | "embed" | "other"): void {
  setTag("page_type", type);
}

/** Tag device viewport for mobile-specific analysis */
export function tagViewport(): void {
  if (typeof window === "undefined") return;
  const width = window.innerWidth;
  const breakpoint = width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop";
  setTag("viewport", breakpoint);
  setTag("viewport_width", String(width));
}

// ---------------------------------------------------------------------------
// Server-Side: Clarity API Integration
// ---------------------------------------------------------------------------

const CLARITY_API_BASE = "https://www.clarity.ms/api/v1";

function getClarityConfig() {
  const token = process.env.CLARITY_API_TOKEN;
  const projectId = process.env.CLARITY_PROJECT_ID || "w2svnzrk4f";
  return { token, projectId };
}

async function clarityApiRequest<T>(endpoint: string, body?: Record<string, unknown>): Promise<T | null> {
  const { token, projectId } = getClarityConfig();
  if (!token) {
    console.warn("[Clarity] No CLARITY_API_TOKEN configured — skipping API call");
    return null;
  }

  const url = `${CLARITY_API_BASE}/project/${projectId}${endpoint}`;
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    console.error(`[Clarity] API error ${res.status}: ${res.statusText}`);
    return null;
  }

  return res.json() as Promise<T>;
}

/**
 * Fetch frustration report — top pages by rage clicks, dead clicks, quick-backs.
 * Returns null if API token is not configured.
 */
export async function getFrustrationReport(daysBack = 7): Promise<ClarityFrustrationReport | null> {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - daysBack * 86400000).toISOString().split("T")[0];

  return clarityApiRequest<ClarityFrustrationReport>("/frustration", {
    startDate,
    endDate,
    limit: 20,
  });
}

/**
 * Fetch heatmap data for a specific URL.
 */
export async function getHeatmapData(url: string, daysBack = 7): Promise<ClarityHeatmapData | null> {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - daysBack * 86400000).toISOString().split("T")[0];

  return clarityApiRequest<ClarityHeatmapData>("/heatmap", {
    url,
    startDate,
    endDate,
  });
}

/**
 * Fetch session recordings filtered by custom tag.
 * Use this to find recordings of users who viewed a specific comparison,
 * searched for a specific query, or were in a specific experiment variant.
 */
export async function getSessionsByTag(
  tagKey: string,
  tagValue: string,
  daysBack = 7,
  limit = 20,
): Promise<ClaritySessionSummary[] | null> {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - daysBack * 86400000).toISOString().split("T")[0];

  return clarityApiRequest<ClaritySessionSummary[]>("/sessions", {
    startDate,
    endDate,
    filter: { tag: { key: tagKey, value: tagValue } },
    limit,
  });
}

/**
 * Build a Clarity dashboard deep link for a specific page or filter.
 */
export function getClarityDashboardUrl(filter?: { page?: string; tag?: string }): string {
  const { projectId } = getClarityConfig();
  let url = `https://clarity.microsoft.com/projects/view/${projectId}/dashboard`;
  if (filter?.page) {
    url += `?filter=page:${encodeURIComponent(filter.page)}`;
  } else if (filter?.tag) {
    url += `?filter=tag:${encodeURIComponent(filter.tag)}`;
  }
  return url;
}
