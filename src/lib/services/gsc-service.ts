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
import { getComparisonBySlug } from "./comparison-service";

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
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.aversusb.net";
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
 */
export async function analyzeGSCOpportunities(): Promise<GSCOpportunity[]> {
  const queries = await fetchGSCQueries();
  if (queries.length === 0) return [];

  const opportunities: GSCOpportunity[] = [];

  for (const q of queries) {
    const parsed = parseComparisonQuery(q.query);
    const isComparison = isComparisonQuery(q.query);
    const type: GSCOpportunity["type"] = isComparison
      ? "comparison"
      : "blog";

    let hasExistingPage = false;

    if (parsed) {
      // Check both orderings of the slug
      const slug1 = queryToSlug(parsed.entityA, parsed.entityB);
      const slug2 = queryToSlug(parsed.entityB, parsed.entityA);
      try {
        const existing1 = await getComparisonBySlug(slug1);
        const existing2 = existing1 ? existing1 : await getComparisonBySlug(slug2);
        hasExistingPage = !!(existing1 || existing2);
      } catch {
        hasExistingPage = false;
      }
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
      entityA: parsed?.entityA ?? null,
      entityB: parsed?.entityB ?? null,
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
