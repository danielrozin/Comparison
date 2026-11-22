/**
 * Weekly refresh queue: which published pages most need a human-reviewed
 * refresh, and why.
 *
 * Read-only by design. In Oct 2026 (PR #351) the founders turned off the jobs
 * that let a model rewrite live pages unreviewed. This module only ranks pages;
 * refreshes are drafted, reviewed by a founder, and shipped like the
 * WSJ/Bloomberg and IKEA/Wayfair fixes (PR #564). Nothing here writes content
 * or touches updatedAt.
 */

export interface RefreshPage {
  /** Site path, e.g. "/blog/foo" or "/compare/a-vs-b". */
  path: string;
  title: string;
  /** Last real content change; null when unknown (static page in code). */
  updatedAt: Date | null;
  /** Mentions a past year in the title/summary/body, e.g. "2025". */
  mentionsPastYear?: boolean;
}

export interface PageTraffic {
  clicks: number;
  impressions: number;
  /** Average position; 0 when unknown. */
  position: number;
}

export type RefreshReason =
  | "stale"
  | "clicks_declining"
  | "past_year"
  | "low_ctr_top10"
  | "striking_distance";

export interface RefreshCandidate {
  path: string;
  title: string;
  score: number;
  reasons: RefreshReason[];
  daysSinceUpdate: number | null;
  current: PageTraffic;
  previous: PageTraffic;
}

export const STALE_DAYS = 90;
const EMPTY: PageTraffic = { clicks: 0, impressions: 0, position: 0 };

/** Normalise a GSC page URL (any host, trailing slash, query) to a site path. */
export function toPath(pageUrl: string): string {
  try {
    const u = new URL(pageUrl);
    return u.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return pageUrl.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  }
}

/** Sum GSC rows per path (http/https/www variants collapse together). */
export function trafficByPath(
  rows: { page: string; clicks: number; impressions: number; position: number }[],
): Map<string, PageTraffic> {
  const out = new Map<string, PageTraffic>();
  for (const r of rows) {
    const p = toPath(r.page);
    const prev = out.get(p) ?? { ...EMPTY };
    const impressions = prev.impressions + r.impressions;
    out.set(p, {
      clicks: prev.clicks + r.clicks,
      impressions,
      // impression-weighted average position
      position: impressions
        ? (prev.position * prev.impressions + r.position * r.impressions) / impressions
        : 0,
    });
  }
  return out;
}

/** Rough expected CTR for an organic position (conservative, post-AI-Overview). */
function expectedCtr(position: number): number {
  if (position <= 1.5) return 0.15;
  if (position <= 3) return 0.08;
  if (position <= 5) return 0.04;
  return 0.02;
}

/**
 * Rank pages for refresh. Demand (impressions) decides who is worth the
 * effort; the reasons decide whether a refresh would help. Pages with no
 * search demand and no reason are never queued.
 */
export function rankRefreshCandidates(
  pages: RefreshPage[],
  current: Map<string, PageTraffic>,
  previous: Map<string, PageTraffic>,
  now: Date,
  limit = 10,
): RefreshCandidate[] {
  const out: RefreshCandidate[] = [];
  for (const page of pages) {
    const cur = current.get(page.path) ?? EMPTY;
    const prev = previous.get(page.path) ?? EMPTY;
    const days = page.updatedAt
      ? Math.floor((now.getTime() - page.updatedAt.getTime()) / 86_400_000)
      : null;

    const reasons: RefreshReason[] = [];
    if (days === null || days >= STALE_DAYS) reasons.push("stale");
    if (prev.clicks >= 5 && cur.clicks <= prev.clicks * 0.7) reasons.push("clicks_declining");
    if (page.mentionsPastYear) reasons.push("past_year");
    if (cur.impressions >= 100 && cur.position > 0 && cur.position <= 10) {
      if (cur.clicks / cur.impressions < expectedCtr(cur.position) / 2) reasons.push("low_ctr_top10");
    }
    if (cur.impressions >= 50 && cur.position > 10 && cur.position <= 20) reasons.push("striking_distance");

    if (!reasons.length || cur.impressions + prev.impressions === 0) continue;

    const weights: Record<RefreshReason, number> = {
      clicks_declining: 3,
      past_year: 2.5,
      low_ctr_top10: 2,
      striking_distance: 2,
      stale: 1,
    };
    const demand = Math.log10(1 + Math.max(cur.impressions, prev.impressions));
    const score = demand * reasons.reduce((s, r) => s + weights[r], 0);

    out.push({
      path: page.path,
      title: page.title,
      score: Math.round(score * 100) / 100,
      reasons,
      daysSinceUpdate: days,
      current: cur,
      previous: prev,
    });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

const REASON_TEXT: Record<RefreshReason, string> = {
  stale: "not updated in 90+ days",
  clicks_declining: "clicks down 30%+ vs previous 28 days",
  past_year: "mentions a past year",
  low_ctr_top10: "ranks top 10 but CTR is under half of normal",
  striking_distance: "ranks 11-20 (close to page 1)",
};

/** Plain-text email body for the weekly queue. */
export function formatRefreshEmail(cands: RefreshCandidate[], siteUrl: string): string {
  if (!cands.length) return "No pages need a refresh this week.";
  const lines = [
    "Pages that most need a refresh this week (last 28 days vs the 28 before).",
    "Nothing was changed on the site. Reply or ask Claude to draft the refreshes for review.",
    "",
  ];
  cands.forEach((c, i) => {
    lines.push(
      `${i + 1}. ${c.title}`,
      `   ${siteUrl}${c.path}`,
      `   Why: ${c.reasons.map((r) => REASON_TEXT[r]).join("; ")}`,
      `   Clicks ${c.previous.clicks} -> ${c.current.clicks} | Impressions ${c.previous.impressions} -> ${c.current.impressions} | Avg position ${c.current.position ? c.current.position.toFixed(1) : "n/a"} | Last updated ${c.daysSinceUpdate === null ? "unknown (static page)" : `${c.daysSinceUpdate} days ago`}`,
      "",
    );
  });
  return lines.join("\n");
}
