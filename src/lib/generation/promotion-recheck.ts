/**
 * Recheck provisional visitor comparisons and promote the ones that pass.
 *
 * GENERATION_FREEZE does not apply here. That flag keeps the net-new cron
 * jobs paused. This job only re-reads pages that a visitor already requested.
 * It runs only when PROMOTION_RECHECK_ENABLED=true.
 *
 * Spend: Apify web search fills a source list that is still under 2. This job
 * does not call Anthropic. PROMOTION_RECHECK_ANTHROPIC_CAP defaults to 0 and
 * `anthropicCallsAllowed` is the only gate a future repair call may pass.
 * The search budget env is still `PROMOTION_RECHECK_TAVILY_CAP`.
 */

import type { ComparisonPageData } from "@/types";
import { citationSourcesFromResults } from "@/lib/generation/citation-sources";
import {
  mergeCitationStats,
  readPromotionState,
  withRecheckResult,
} from "@/lib/generation/comparison-content";
import { captureGenerationLifecycle } from "@/lib/generation/generation-events";
import {
  assessUserGenerationPromotion,
  userGenerationSourceCount,
  MIN_USER_GENERATION_SOURCES,
} from "@/lib/generation/promotion";
import { warmCacheForPaths, warmCacheForSlug } from "@/lib/services/cache-warming";
import {
  applyProvisionalPromotion,
  getComparisonBySlug,
  listProvisionalUserComparisons,
} from "@/lib/services/comparison-service";
import {
  APIFY_PROMOTION_SEARCH_TIMEOUT_MS,
  enrichComparisonData,
} from "@/lib/services/apify-search";

/** Leave the last 30s of the 120s cron for the search already in flight. */
export const PROMOTION_SEARCH_TIME_BUDGET_MS = 90_000;

export const DEFAULT_PROMOTION_RECHECK_BATCH = 10;
export const DEFAULT_PROMOTION_MAX_ATTEMPTS = 5;
export const DEFAULT_PROMOTION_TAVILY_CAP = 6;
export const DEFAULT_PROMOTION_ANTHROPIC_CAP = 0;

export interface PromotionRecheckLimits {
  batch: number;
  maxAttempts: number;
  tavilyCap: number;
  anthropicCap: number;
}

export interface PromotionRecheckReport {
  enabled: boolean;
  processed: number;
  deferred: number;
  promoted: string[];
  failed: { slug: string; reasons: string[]; attempt: number }[];
  tavilyCalls: number;
  anthropicCalls: number;
}

export function isPromotionRecheckEnabled(): boolean {
  return (process.env.PROMOTION_RECHECK_ENABLED ?? "").toLowerCase() === "true";
}

export function promotionRecheckLimitsFromEnv(): PromotionRecheckLimits {
  return {
    batch: positiveInt(process.env.PROMOTION_RECHECK_BATCH, DEFAULT_PROMOTION_RECHECK_BATCH),
    maxAttempts: positiveInt(process.env.PROMOTION_RECHECK_MAX_ATTEMPTS, DEFAULT_PROMOTION_MAX_ATTEMPTS),
    tavilyCap: nonNegativeInt(process.env.PROMOTION_RECHECK_TAVILY_CAP, DEFAULT_PROMOTION_TAVILY_CAP),
    anthropicCap: nonNegativeInt(
      process.env.PROMOTION_RECHECK_ANTHROPIC_CAP,
      DEFAULT_PROMOTION_ANTHROPIC_CAP,
    ),
  };
}

/** False at the default cap of 0, so a recheck run cannot spend Anthropic credits. */
export function anthropicCallsAllowed(used: number, cap: number): boolean {
  return used < cap;
}

export interface PromotionCandidate {
  slug: string;
  content: unknown;
}

export function eligiblePromotionCandidates(
  rows: PromotionCandidate[],
  maxAttempts: number,
): PromotionCandidate[] {
  return rows.filter((row) => readPromotionState(row.content).attempts < maxAttempts);
}

export interface PromotionSource {
  name: string;
  url?: string;
}

/**
 * Sources from a finished enrichment. `providerError` is set only when the
 * search provider failed (missing key, non-2xx, timeout, network). A finished
 * search with nothing to cite leaves it null.
 */
export interface PromotionEnrichment {
  sources: PromotionSource[];
  providerError?: string | null;
}

export interface PromotionRecheckDeps {
  loadCandidates: () => Promise<PromotionCandidate[]>;
  loadComparison: (slug: string) => Promise<ComparisonPageData | null>;
  enrich: (
    entityA: string,
    entityB: string,
  ) => Promise<PromotionSource[] | PromotionEnrichment>;
  save: (input: {
    slug: string;
    status: "published" | "provisional";
    contentScore: number;
    content: unknown;
  }) => Promise<boolean>;
  revalidate: (slug: string, promoted: boolean) => Promise<void>;
  log: (
    event: "generation_promoted" | "generation_promotion_failed",
    properties: { slug: string; reasons: string[]; attempt: number },
  ) => Promise<void>;
  limits: PromotionRecheckLimits;
  now: () => Date;
}

export async function runPromotionRecheck(deps: PromotionRecheckDeps): Promise<PromotionRecheckReport> {
  const report: PromotionRecheckReport = {
    enabled: true,
    processed: 0,
    deferred: 0,
    promoted: [],
    failed: [],
    tavilyCalls: 0,
    anthropicCalls: 0,
  };

  // Consult the Anthropic budget and then leave it unused. This job does not
  // regenerate copy. The default cap is 0, so a future call site cannot spend
  // credits until the cap is raised and a prompt is added on purpose.
  void anthropicCallsAllowed(report.anthropicCalls, deps.limits.anthropicCap);

  const rows = eligiblePromotionCandidates(await deps.loadCandidates(), deps.limits.maxAttempts);
  const providerFailures: { slug: string; reason: string }[] = [];
  const startedAt = deps.now().getTime();

  for (const row of rows) {
    if (report.processed >= deps.limits.batch) break;

    const comparison = await deps.loadComparison(row.slug);
    if (!comparison || (comparison.entities?.length ?? 0) < 2) {
      await recordOutcome(deps, report, row, {
        reasons: ["comparison could not be loaded"],
        score: 0,
        citationStats: comparison?.citationStats ?? null,
        pass: false,
      });
      continue;
    }

    let citationStats = comparison.citationStats ?? null;
    const preview = assessUserGenerationPromotion(comparison);
    // Sources cannot repair a table that does not compare both sides. Skip
    // web search on those rows so a polluted entity (Kayak.com metrics on `kayak`)
    // does not spend a search on every retry.
    const attributesBlockPromotion = preview.reasons.some(
      (reason) => reason.includes("substantive attributes") || reason.includes("content-depth score"),
    );
    const needsSources = userGenerationSourceCount(comparison) < MIN_USER_GENERATION_SOURCES;
    if (needsSources && !attributesBlockPromotion) {
      if (report.tavilyCalls >= deps.limits.tavilyCap) {
        report.deferred += 1;
        continue;
      }
      // A search started after this point can still be running when the
      // 120s function is killed. Leave the page in the queue.
      if (deps.now().getTime() - startedAt >= PROMOTION_SEARCH_TIME_BUDGET_MS) {
        report.deferred += 1;
        continue;
      }
      const [entityA, entityB] = comparison.entities;
      const added = await readPromotionEnrichment(() => deps.enrich(entityA.name, entityB.name));
      report.tavilyCalls += 1;
      const merged = mergeCitationStats(citationStats, added.sources, deps.now());
      // A provider outage is not evidence that the page has no sources.
      // Leave the attempt counter where it is so the page stays in the queue.
      if (
        added.providerError &&
        userGenerationSourceCount({ citationStats: merged }) < MIN_USER_GENERATION_SOURCES
      ) {
        await recordProviderFailure(deps, report, row, added.providerError);
        providerFailures.push({ slug: row.slug, reason: added.providerError });
        continue;
      }
      citationStats = merged;
    }

    const decision = needsSources && !attributesBlockPromotion
      ? assessUserGenerationPromotion({ ...comparison, citationStats })
      : preview;
    await recordOutcome(deps, report, row, {
      reasons: decision.reasons,
      score: decision.score,
      citationStats,
      pass: decision.pass,
    });
  }

  warnProviderFailures(providerFailures);
  return report;
}

/**
 * One line for the whole cron run. Reason codes only — never the API key,
 * the query, or the response body.
 */
function warnProviderFailures(failures: { slug: string; reason: string }[]): void {
  if (failures.length === 0) return;
  const counts = new Map<string, number>();
  for (const failure of failures) {
    const reason = failure.reason;
    counts.set(reason, (counts.get(reason) ?? 0) + 1);
  }
  const summary = [...counts.entries()]
    .map(([reason, count]) => `${reason} x${count}`)
    .join(", ");
  console.warn(
    `[promote-provisional] ${failures.length} search provider failure(s) provider=apify; attempts not counted (${summary})`,
  );
}

async function readPromotionEnrichment(
  load: () => Promise<PromotionSource[] | PromotionEnrichment>,
): Promise<{ sources: PromotionSource[]; providerError: string | null }> {
  try {
    const value = await load();
    if (Array.isArray(value)) return { sources: value, providerError: null };
    const reason = typeof value?.providerError === "string" ? value.providerError.trim() : "";
    return {
      sources: Array.isArray(value?.sources) ? value.sources : [],
      providerError: reason.length > 0 ? normalizeProviderErrorReason(reason) : null,
    };
  } catch {
    return { sources: [], providerError: "search_provider_error:network" };
  }
}

function normalizeProviderErrorReason(reason: string): string {
  const prefix = "search_provider_error:";
  const code = reason.startsWith(prefix) ? reason.slice(prefix.length) : reason;
  const safe = /^[A-Za-z0-9_]+$/.test(code) ? code : "unknown";
  return `${prefix}${safe}`;
}

async function recordProviderFailure(
  deps: PromotionRecheckDeps,
  report: PromotionRecheckReport,
  row: PromotionCandidate,
  providerError: string,
): Promise<void> {
  const attempt = readPromotionState(row.content).attempts;
  report.processed += 1;
  report.failed.push({ slug: row.slug, reasons: [providerError], attempt });
  await deps.log("generation_promotion_failed", {
    slug: row.slug,
    reasons: [providerError],
    attempt,
  });
}

async function recordOutcome(
  deps: PromotionRecheckDeps,
  report: PromotionRecheckReport,
  row: PromotionCandidate,
  outcome: {
    pass: boolean;
    reasons: string[];
    score: number;
    citationStats: ComparisonPageData["citationStats"] | null;
  },
): Promise<void> {
  const now = deps.now();
  const content = withRecheckResult(row.content, {
    citationStats: outcome.citationStats ?? null,
    reasons: outcome.pass ? [] : outcome.reasons,
    now,
  });
  const status = outcome.pass ? "published" : "provisional";
  const saved = await deps.save({
    slug: row.slug,
    status,
    contentScore: outcome.score,
    content,
  });
  report.processed += 1;
  if (!saved) {
    report.failed.push({
      slug: row.slug,
      reasons: ["could not save the recheck"],
      attempt: content.promotion.attempts,
    });
    return;
  }
  await deps.revalidate(row.slug, outcome.pass);
  if (outcome.pass) {
    report.promoted.push(row.slug);
    await deps.log("generation_promoted", {
      slug: row.slug,
      reasons: [],
      attempt: content.promotion.attempts,
    });
    return;
  }
  report.failed.push({
    slug: row.slug,
    reasons: outcome.reasons,
    attempt: content.promotion.attempts,
  });
  await deps.log("generation_promotion_failed", {
    slug: row.slug,
    reasons: outcome.reasons,
    attempt: content.promotion.attempts,
  });
}

export async function executePromotionRecheck(): Promise<PromotionRecheckReport> {
  const limits = promotionRecheckLimitsFromEnv();
  return runPromotionRecheck({
    limits,
    now: () => new Date(),
    loadCandidates: () => listProvisionalUserComparisons(
      Math.max(limits.batch * 5, 50),
      limits.maxAttempts,
    ),
    loadComparison: (slug) => getComparisonBySlug(slug),
    enrich: async (entityA, entityB) => {
      // Per-request search warnings stay off. runPromotionRecheck logs one summary.
      const enrichment = await enrichComparisonData(entityA, entityB, true, {
        logFailures: false,
        timeoutMs: APIFY_PROMOTION_SEARCH_TIMEOUT_MS,
      });
      return {
        sources: citationSourcesFromResults(enrichment.sources),
        providerError: enrichment.providerError,
      };
    },
    save: (input) => applyProvisionalPromotion(input),
    revalidate: async (slug, promoted) => {
      if (promoted) {
        await warmCacheForPaths([`/compare/${slug}`, "/sitemap/1.xml"]);
        return;
      }
      await warmCacheForSlug(slug);
    },
    log: (event, properties) => captureGenerationLifecycle(event, properties),
  });
}

function positiveInt(raw: string | undefined, fallback: number): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

function nonNegativeInt(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.floor(parsed);
}
