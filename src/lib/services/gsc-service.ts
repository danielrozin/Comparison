/**
 * Google Search Console API Service
 * Fetches search query data and identifies content opportunities.
 * Uses Service Account JWT auth with Node.js built-in crypto module.
 *
 * Requires:
 * - GOOGLE_SERVICE_ACCOUNT_KEY env var (JSON string of the service account key)
 * - NEXT_PUBLIC_SITE_URL or defaults to "https://www.aversusb.net"
 *
 * If credentials are not set, all functions return empty/mock data gracefully.
 */

import crypto from "crypto";
import {
  getComparisonSlugsExisting,
  bulkUpdateSearchImpressions,
  type BulkImpressionsResult,
} from "./comparison-service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GSCQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCOpportunity {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  entityA: string | null;
  entityB: string | null;
  type: "comparison" | "blog" | "unknown";
  hasExistingPage: boolean;
  opportunityScore: number;
}

export interface GSCStats {
  totalQueries: number;
  totalClicks: number;
  totalImpressions: number;
  avgPosition: number;
}

// ---------------------------------------------------------------------------
// Token cache
// ---------------------------------------------------------------------------

let cachedToken: { token: string; expiresAt: number } | null = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getServiceAccountKey(): {
  client_email: string;
  private_key: string;
} | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.client_email || !parsed.private_key) return null;
    return { client_email: parsed.client_email, private_key: parsed.private_key };
  } catch {
    console.warn("GSC: Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY");
    return null;
  }
}

function getSiteUrl(): string {
  // GSC property can be a domain property (sc-domain:example.com) or URL prefix (https://...)
  // Check for explicit GSC site URL first, then fall back to domain property format
  return process.env.GSC_SITE_URL || "sc-domain:aversusb.net";
}

async function getAccessToken(): Promise<string | null> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const key = getServiceAccountKey();
  if (!key) return null;

  const { client_email: clientEmail, private_key: privateKey } = key;

  // Build JWT
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");

  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const signature = crypto.sign(
    "RSA-SHA256",
    Buffer.from(`${header}.${payload}`),
    privateKey
  );
  const jwt = `${header}.${payload}.${signature.toString("base64url")}`;

  // Exchange JWT for access token
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("GSC: Token exchange failed:", res.status, errText);
      return null;
    }

    const data = await res.json();
    // Cache for 50 minutes (token valid for 60)
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + 50 * 60 * 1000,
    };
    return data.access_token;
  } catch (err) {
    console.error("GSC: Token exchange error:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Comparison query parsing
// ---------------------------------------------------------------------------

const VS_PATTERNS = [
  /^(.+?)\s+(?:vs\.?|versus|compared?\s+to|difference\s+between)\s+(.+)$/i,
  /^difference\s+between\s+(.+?)\s+and\s+(.+)$/i,
  /^(.+?)\s+or\s+(.+?)(?:\?|$)/i,
];

function parseComparisonQuery(query: string): {
  entityA: string;
  entityB: string;
} | null {
  for (const pattern of VS_PATTERNS) {
    const match = query.match(pattern);
    if (match) {
      return {
        entityA: match[1].trim(),
        entityB: match[2].trim().replace(/\?$/, "").trim(),
      };
    }
  }
  return null;
}

function isComparisonQuery(query: string): boolean {
  return /\b(vs\.?|versus|compar|difference between)\b/i.test(query);
}

function queryToSlug(entityA: string, entityB: string): string {
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  return `${slugify(entityA)}-vs-${slugify(entityB)}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch raw search queries from Google Search Console.
 */
export async function fetchGSCQueries(days = 28): Promise<GSCQuery[]> {
  const token = await getAccessToken();
  if (!token) {
    console.warn("GSC: No access token available — returning empty results");
    return [];
  }

  const siteUrl = getSiteUrl();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  try {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["query"],
          rowLimit: 1000,
          dimensionFilterGroups: [],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("GSC: Query fetch failed:", res.status, errText);
      return [];
    }

    const data = await res.json();
    if (!data.rows) return [];

    return data.rows.map(
      (row: {
        keys: string[];
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
      }) => ({
        query: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })
    );
  } catch (err) {
    console.error("GSC: Query fetch error:", err);
    return [];
  }
}

/**
 * Analyze GSC queries and score content opportunities.
 * Uses batch slug lookup to avoid N+1 queries.
 */
export async function analyzeGSCOpportunities(): Promise<GSCOpportunity[]> {
  const queries = await fetchGSCQueries();
  if (queries.length === 0) return [];

  // Parse all queries first and collect slugs to check
  const parsedQueries = queries.map((q) => ({
    ...q,
    parsed: parseComparisonQuery(q.query),
    isComparison: isComparisonQuery(q.query),
  }));

  // Collect all slugs that need existence checks (both orderings)
  const slugsToCheck = new Set<string>();
  for (const q of parsedQueries) {
    if (q.parsed) {
      slugsToCheck.add(queryToSlug(q.parsed.entityA, q.parsed.entityB));
      slugsToCheck.add(queryToSlug(q.parsed.entityB, q.parsed.entityA));
    }
  }

  // Batch check which slugs exist — single DB query instead of N+1
  let existingSlugs = new Set<string>();
  try {
    const found = await getComparisonSlugsExisting(Array.from(slugsToCheck));
    existingSlugs = new Set(found);
  } catch {
    // Fall through with empty set
  }

  const opportunities: GSCOpportunity[] = [];

  for (const q of parsedQueries) {
    const type: GSCOpportunity["type"] = q.isComparison ? "comparison" : "blog";

    let hasExistingPage = false;
    if (q.parsed) {
      const slug1 = queryToSlug(q.parsed.entityA, q.parsed.entityB);
      const slug2 = queryToSlug(q.parsed.entityB, q.parsed.entityA);
      hasExistingPage = existingSlugs.has(slug1) || existingSlugs.has(slug2);
    }

    // Opportunity score: high impressions where we rank poorly = biggest opportunity
    const score =
      q.impressions * (1 - q.ctr) * (50 / Math.max(q.position, 1));

    opportunities.push({
      query: q.query,
      clicks: q.clicks,
      impressions: q.impressions,
      ctr: q.ctr,
      position: q.position,
      entityA: q.parsed?.entityA ?? null,
      entityB: q.parsed?.entityB ?? null,
      type,
      hasExistingPage,
      opportunityScore: Math.round(score * 100) / 100,
    });
  }

  // Sort by opportunity score descending
  opportunities.sort((a, b) => b.opportunityScore - a.opportunityScore);
  return opportunities;
}

// ---------------------------------------------------------------------------
// Technical SEO Analysis
// ---------------------------------------------------------------------------

export interface GSCTechnicalIssue {
  type: "low_ctr" | "declining_position" | "high_impressions_no_clicks" | "content_gap" | "cannibalization";
  severity: "critical" | "warning" | "info";
  query: string;
  detail: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  suggestedAction: string;
}

/**
 * Analyze GSC data for technical SEO issues.
 * Detects: low CTR pages, zero-click queries, content gaps, and potential cannibalization.
 */
export async function analyzeGSCTechnicalIssues(): Promise<GSCTechnicalIssue[]> {
  const queries = await fetchGSCQueries();
  if (queries.length === 0) return [];

  const issues: GSCTechnicalIssue[] = [];

  // Group queries by similar topic to detect cannibalization
  const queryGroups = new Map<string, GSCQuery[]>();

  for (const q of queries) {
    // --- High impressions, zero clicks ---
    if (q.impressions >= 5 && q.clicks === 0) {
      issues.push({
        type: "high_impressions_no_clicks",
        severity: q.impressions >= 20 ? "critical" : "warning",
        query: q.query,
        detail: `${q.impressions} impressions but 0 clicks (position ${q.position.toFixed(1)})`,
        impressions: q.impressions,
        clicks: q.clicks,
        ctr: q.ctr,
        position: q.position,
        suggestedAction: q.position <= 10
          ? "Improve meta title and description to boost CTR — you rank well but nobody clicks"
          : "Create or optimize content to improve ranking from position " + q.position.toFixed(0),
      });
    }

    // --- Low CTR for good position ---
    if (q.position <= 5 && q.ctr < 0.03 && q.impressions >= 10) {
      issues.push({
        type: "low_ctr",
        severity: "critical",
        query: q.query,
        detail: `Position ${q.position.toFixed(1)} but only ${(q.ctr * 100).toFixed(1)}% CTR`,
        impressions: q.impressions,
        clicks: q.clicks,
        ctr: q.ctr,
        position: q.position,
        suggestedAction: "Rewrite meta title/description — you rank in top 5 but CTR is far below average. Expected CTR at this position is 5-15%.",
      });
    } else if (q.position <= 10 && q.ctr < 0.02 && q.impressions >= 5) {
      issues.push({
        type: "low_ctr",
        severity: "warning",
        query: q.query,
        detail: `Position ${q.position.toFixed(1)} but only ${(q.ctr * 100).toFixed(1)}% CTR`,
        impressions: q.impressions,
        clicks: q.clicks,
        ctr: q.ctr,
        position: q.position,
        suggestedAction: "Consider improving meta title/description or adding structured data to stand out in SERPs.",
      });
    }

    // --- Content gap: blog/informational query with no page ---
    const parsed = parseComparisonQuery(q.query);
    const isComp = isComparisonQuery(q.query);
    if (!isComp && q.impressions >= 3 && !parsed) {
      issues.push({
        type: "content_gap",
        severity: q.impressions >= 10 ? "warning" : "info",
        query: q.query,
        detail: `Informational query with ${q.impressions} impressions — potential blog topic`,
        impressions: q.impressions,
        clicks: q.clicks,
        ctr: q.ctr,
        position: q.position,
        suggestedAction: `Create a blog article targeting "${q.query}" to capture this traffic.`,
      });
    }

    // --- Group for cannibalization detection ---
    const words = q.query.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 2).sort();
    const groupKey = words.slice(0, 3).join("-");
    if (groupKey) {
      if (!queryGroups.has(groupKey)) queryGroups.set(groupKey, []);
      queryGroups.get(groupKey)!.push(q);
    }
  }

  // --- Cannibalization: multiple queries with same topic competing ---
  for (const [, group] of queryGroups) {
    if (group.length >= 3) {
      const totalImpressions = group.reduce((s, q) => s + q.impressions, 0);
      if (totalImpressions >= 5) {
        issues.push({
          type: "cannibalization",
          severity: "info",
          query: group.map(q => q.query).join(" | "),
          detail: `${group.length} similar queries (${totalImpressions} total impressions) — may be splitting ranking signals`,
          impressions: totalImpressions,
          clicks: group.reduce((s, q) => s + q.clicks, 0),
          ctr: totalImpressions > 0 ? group.reduce((s, q) => s + q.clicks, 0) / totalImpressions : 0,
          position: group.reduce((s, q) => s + q.position, 0) / group.length,
          suggestedAction: "Consider consolidating these queries into a single comprehensive page with all variations as H2/H3 sections.",
        });
      }
    }
  }

  // Sort by severity (critical first) then by impressions
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || b.impressions - a.impressions);

  return issues;
}

// ---------------------------------------------------------------------------
// Page-level indexing coverage
// ---------------------------------------------------------------------------

export interface GSCPageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCIndexingCoverage {
  totalPagesWithTraffic: number;
  totalSitemapPages: number;
  indexedRate: number;
  pagesWithTraffic: GSCPageData[];
  orphanPages: string[];
  lowPerformingPages: GSCPageData[];
}

/**
 * Fetch page-level search analytics from GSC (dimension: page).
 */
export async function fetchGSCPageData(days = 28): Promise<GSCPageData[]> {
  const token = await getAccessToken();
  if (!token) {
    console.warn("GSC: No access token available — returning empty page data");
    return [];
  }

  const siteUrl = getSiteUrl();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  try {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["page"],
          rowLimit: 5000,
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("GSC: Page data fetch failed:", res.status, errText);
      return [];
    }

    const data = await res.json();
    if (!data.rows) return [];

    return data.rows.map(
      (row: {
        keys: string[];
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
      }) => ({
        page: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })
    );
  } catch (err) {
    console.error("GSC: Page data fetch error:", err);
    return [];
  }
}

/**
 * Analyze indexing coverage by comparing GSC page data against sitemap URLs.
 * Returns pages with traffic, orphan sitemap pages (no GSC data), and low performers.
 */
export async function analyzeIndexingCoverage(
  sitemapUrls: string[]
): Promise<GSCIndexingCoverage> {
  const pageData = await fetchGSCPageData();

  const pagesWithTraffic = new Set(pageData.map((p) => p.page));
  const sitemapSet = new Set(sitemapUrls);

  // Pages in sitemap but with zero GSC data (not indexed or no impressions)
  const orphanPages = sitemapUrls.filter((url) => !pagesWithTraffic.has(url));

  // Pages with traffic but low performance (high impressions, low CTR, poor position)
  const lowPerformingPages = pageData.filter(
    (p) => sitemapSet.has(p.page) && p.impressions >= 10 && p.ctr < 0.02 && p.position > 15
  );

  const indexedCount = sitemapUrls.filter((url) => pagesWithTraffic.has(url)).length;

  return {
    totalPagesWithTraffic: pageData.length,
    totalSitemapPages: sitemapUrls.length,
    indexedRate: sitemapUrls.length > 0 ? indexedCount / sitemapUrls.length : 0,
    pagesWithTraffic: pageData.sort((a, b) => b.clicks - a.clicks),
    orphanPages,
    lowPerformingPages: lowPerformingPages.sort((a, b) => b.impressions - a.impressions),
  };
}

/**
 * Get aggregate stats from GSC queries.
 */
export async function getGSCStats(): Promise<GSCStats> {
  const queries = await fetchGSCQueries();
  if (queries.length === 0) {
    return { totalQueries: 0, totalClicks: 0, totalImpressions: 0, avgPosition: 0 };
  }

  const totalClicks = queries.reduce((s, q) => s + q.clicks, 0);
  const totalImpressions = queries.reduce((s, q) => s + q.impressions, 0);
  const avgPosition =
    queries.reduce((s, q) => s + q.position, 0) / queries.length;

  return {
    totalQueries: queries.length,
    totalClicks,
    totalImpressions,
    avgPosition: Math.round(avgPosition * 100) / 100,
  };
}

// ---------------------------------------------------------------------------
// /compare/* weekly organic traffic (gate metric for H6 — DAN-1014 / DAN-1008)
// ---------------------------------------------------------------------------
//
// Read path: Google Search Console page-level search analytics, filtered to
// URLs containing "/compare/". This uses the SAME service-account auth that
// already powers the GSC opportunity pipeline (GOOGLE_SERVICE_ACCOUNT_KEY +
// webmasters.readonly on the Search Console property), so it does NOT depend on
// the stalled GA4 Data API property grant (DAN-710).
//
// NOTE ON THE METRIC: GSC reports organic-search *clicks*, which is a subset of
// GA4 *sessions* (organic Google only; clicks, not all sessions). It is the
// directly-relevant signal for an organic-SEO push and needs no human grant.
// The DAN-1008 gate threshold (≥50/wk, 2 consecutive weeks) is surfaced here
// against GSC clicks and labelled `metric: "gsc_clicks"`; whether GSC clicks is
// the accepted read path for the gate is a VP-Product (gate owner) decision.

export interface GSCComparePageRow {
  date: string; // YYYY-MM-DD
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCCompareWeek {
  weekStart: string; // Monday, YYYY-MM-DD
  weekEnd: string; // Sunday, YYYY-MM-DD
  complete: boolean; // true once the week's Sunday is fully elapsed (accounting for GSC's ~2-day lag)
  clicks: number;
  impressions: number;
  pages: number; // distinct /compare/* pages with traffic
  topPages: Array<{ page: string; clicks: number; impressions: number }>;
}

export interface GSCCompareWeeklyReport {
  available: boolean; // false when no GSC credentials / no data
  metric: "gsc_clicks";
  thresholdPerWeek: number;
  weeks: GSCCompareWeek[]; // chronological, oldest → newest
  latestCompleteWeek: GSCCompareWeek | null;
  priorCompleteWeek: GSCCompareWeek | null;
  wowClicksChange: string;
  consecutiveCompleteWeeksAtThreshold: number; // counted backward from latest complete week
  gateClear: boolean; // ≥2 consecutive complete weeks at/above threshold
  note: string;
}

/** Monday (UTC) of the ISO week containing `d`. */
function mondayOfWeekUTC(d: Date): Date {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dow = (x.getUTCDay() + 6) % 7; // 0 = Monday
  x.setUTCDate(x.getUTCDate() - dow);
  return x;
}

function fmtDateUTC(d: Date): string {
  return d.toISOString().split("T")[0];
}

/**
 * Fetch per-day, per-page GSC rows for URLs containing "/compare/".
 */
export async function fetchGSCComparePageRows(days = 35): Promise<GSCComparePageRow[]> {
  const token = await getAccessToken();
  if (!token) {
    console.warn("GSC: No access token — returning empty /compare/* rows");
    return [];
  }

  const siteUrl = getSiteUrl();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  try {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: fmtDateUTC(startDate),
          endDate: fmtDateUTC(endDate),
          dimensions: ["date", "page"],
          dimensionFilterGroups: [
            { filters: [{ dimension: "page", operator: "contains", expression: "/compare/" }] },
          ],
          rowLimit: 25000,
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("GSC: /compare/* page fetch failed:", res.status, errText);
      return [];
    }

    const data = await res.json();
    if (!data.rows) return [];

    return data.rows.map(
      (row: {
        keys: string[];
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
      }) => ({
        date: row.keys[0],
        page: row.keys[1],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })
    );
  } catch (err) {
    console.error("GSC: /compare/* page fetch error:", err);
    return [];
  }
}

/**
 * Build the weekly /compare/* organic-traffic report (Mon–Sun buckets) used as
 * the H6 gate metric. Aggregates GSC click/impression data by week and
 * evaluates the ≥`threshold`/week, 2-consecutive-weeks gate condition.
 */
export async function getGSCCompareWeekly(
  weeksBack = 6,
  threshold = 50
): Promise<GSCCompareWeeklyReport> {
  const baseNote =
    "GSC organic clicks to /compare/* pages. Subset of GA4 sessions (Google organic clicks only). Read path independent of the GA4 grant (DAN-710).";

  const rows = await fetchGSCComparePageRows(weeksBack * 7 + 7);
  if (rows.length === 0) {
    return {
      available: false,
      metric: "gsc_clicks",
      thresholdPerWeek: threshold,
      weeks: [],
      latestCompleteWeek: null,
      priorCompleteWeek: null,
      wowClicksChange: "n/a",
      consecutiveCompleteWeeksAtThreshold: 0,
      gateClear: false,
      note: `${baseNote} No data — GSC credentials missing or no /compare/* clicks in window.`,
    };
  }

  // GSC data lags ~2 days; treat a week as "complete" only once its Sunday is
  // at least 2 days in the past so we don't read a partial final week as a dip.
  const now = new Date();
  const completeCutoff = new Date(now);
  completeCutoff.setUTCDate(completeCutoff.getUTCDate() - 2);

  const buckets = new Map<
    string,
    { weekStart: Date; clicks: number; impressions: number; pages: Map<string, { clicks: number; impressions: number }> }
  >();

  for (const r of rows) {
    const d = new Date(`${r.date}T00:00:00Z`);
    const monday = mondayOfWeekUTC(d);
    const key = fmtDateUTC(monday);
    let b = buckets.get(key);
    if (!b) {
      b = { weekStart: monday, clicks: 0, impressions: 0, pages: new Map() };
      buckets.set(key, b);
    }
    b.clicks += r.clicks;
    b.impressions += r.impressions;
    const p = b.pages.get(r.page) || { clicks: 0, impressions: 0 };
    p.clicks += r.clicks;
    p.impressions += r.impressions;
    b.pages.set(r.page, p);
  }

  const weeks: GSCCompareWeek[] = Array.from(buckets.values())
    .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime())
    .map((b) => {
      const weekEnd = new Date(b.weekStart);
      weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
      const topPages = Array.from(b.pages.entries())
        .map(([page, v]) => ({ page, clicks: v.clicks, impressions: v.impressions }))
        .sort((x, y) => y.clicks - x.clicks)
        .slice(0, 20);
      return {
        weekStart: fmtDateUTC(b.weekStart),
        weekEnd: fmtDateUTC(weekEnd),
        complete: weekEnd.getTime() <= completeCutoff.getTime(),
        clicks: b.clicks,
        impressions: b.impressions,
        pages: b.pages.size,
        topPages,
      };
    });

  const completeWeeks = weeks.filter((w) => w.complete);
  const latestCompleteWeek = completeWeeks[completeWeeks.length - 1] || null;
  const priorCompleteWeek = completeWeeks[completeWeeks.length - 2] || null;

  // Consecutive complete weeks (counting backward) at or above threshold.
  let consecutive = 0;
  for (let i = completeWeeks.length - 1; i >= 0; i--) {
    if (completeWeeks[i].clicks >= threshold) consecutive++;
    else break;
  }

  return {
    available: true,
    metric: "gsc_clicks",
    thresholdPerWeek: threshold,
    weeks,
    latestCompleteWeek,
    priorCompleteWeek,
    wowClicksChange:
      latestCompleteWeek && priorCompleteWeek
        ? (() => {
            const c = latestCompleteWeek.clicks;
            const p = priorCompleteWeek.clicks;
            if (p === 0) return c > 0 ? "+new" : "flat";
            const pct = Math.round(((c - p) / p) * 100);
            return pct >= 0 ? `+${pct}%` : `${pct}%`;
          })()
        : "n/a",
    consecutiveCompleteWeeksAtThreshold: consecutive,
    gateClear: consecutive >= 2,
    note: baseNote,
  };
}

// ---------------------------------------------------------------------------
// Backfill comparisons.searchImpressions from GSC per-page data (DAN-1807)
// ---------------------------------------------------------------------------
//
// `comparisons.searchImpressions` ships as 0 for every row, so the DAN-1800
// thin-page audit cannot rank the zero-traffic long tail by real demand. This
// sync joins GSC per-page /compare/* impressions to comparison rows by slug and
// writes the observed impression totals, so the audit's THIN_NO_DEMAND bucket
// reflects actual demand. Run weekly alongside the DAN-1008 compare-gate cron.

export interface SyncSearchImpressionsResult extends BulkImpressionsResult {
  available: boolean; // false when no GSC credentials / no /compare/* data
  windowDays: number;
  pagesWithImpressions: number; // distinct /compare/* pages GSC reported
  totalImpressions: number; // summed over the window
}

/**
 * Extract the comparison slug from a GSC page URL.
 * Handles full URLs (`https://host/compare/<slug>`), trailing slashes, and
 * query/hash suffixes. Returns null for non-/compare/ or index URLs.
 */
export function slugFromComparePage(page: string): string | null {
  const m = page.match(/\/compare\/([^/?#]+)/i);
  if (!m) return null;
  const slug = decodeURIComponent(m[1]).trim().toLowerCase();
  return slug.length > 0 ? slug : null;
}

/**
 * Fetch per-page (date-collapsed) GSC totals for `/compare/*`.
 *
 * Uses the `page` dimension alone (no `date`), so GSC returns one row per URL —
 * the total impressions/clicks over the window. This avoids the row-limit
 * truncation risk of the date×page `fetchGSCComparePageRows` when summing demand
 * over a long window (the corpus has 5k+ pages).
 */
export async function fetchGSCComparePageTotals(
  days = 90
): Promise<GSCPageData[]> {
  const token = await getAccessToken();
  if (!token) {
    console.warn("GSC: No access token — returning empty /compare/* totals");
    return [];
  }

  const siteUrl = getSiteUrl();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  try {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: fmtDateUTC(startDate),
          endDate: fmtDateUTC(endDate),
          dimensions: ["page"],
          dimensionFilterGroups: [
            { filters: [{ dimension: "page", operator: "contains", expression: "/compare/" }] },
          ],
          rowLimit: 25000,
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("GSC: /compare/* totals fetch failed:", res.status, errText);
      return [];
    }

    const data = await res.json();
    if (!data.rows) return [];

    return data.rows.map(
      (row: {
        keys: string[];
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
      }) => ({
        page: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })
    );
  } catch (err) {
    console.error("GSC: /compare/* totals fetch error:", err);
    return [];
  }
}

/**
 * Backfill / refresh `comparisons.searchImpressions` from GSC per-page
 * `/compare/*` impressions over the last `days` (DAN-1807).
 *
 * Sums impressions per slug (multiple URL variants — trailing slash, casing —
 * collapse to one slug), then bulk-writes the totals onto matching rows. Pages
 * with no GSC impressions in the window are left untouched (their default `0` is
 * the correct "no demand" signal). Safe no-op when GSC creds or DB are absent.
 */
export async function syncCompareSearchImpressions(
  days = 90
): Promise<SyncSearchImpressionsResult> {
  const totals = await fetchGSCComparePageTotals(days);

  const bySlug = new Map<string, number>();
  let totalImpressions = 0;
  for (const p of totals) {
    if (p.impressions <= 0) continue;
    const slug = slugFromComparePage(p.page);
    if (!slug) continue;
    bySlug.set(slug, (bySlug.get(slug) || 0) + p.impressions);
    totalImpressions += p.impressions;
  }

  if (bySlug.size === 0) {
    return {
      available: false,
      windowDays: days,
      pagesWithImpressions: 0,
      totalImpressions: 0,
      attempted: 0,
      matched: 0,
      skipped: true,
    };
  }

  const result = await bulkUpdateSearchImpressions(bySlug);
  return {
    available: true,
    windowDays: days,
    pagesWithImpressions: bySlug.size,
    totalImpressions,
    ...result,
  };
}
