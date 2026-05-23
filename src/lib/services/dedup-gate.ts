/**
 * Blog Generation Dedup Gate (DAN-520)
 *
 * Refuses to publish a new blog article when a near-duplicate already exists
 * in the published BlogArticle table. Two cheap, deterministic gates run
 * before the DB write inside saveBlogArticle().
 *
 * Gate #1 — Slug-prefix collision (year-stripped):
 *   After stripping 4-digit year tokens (1900-2099) from both the proposed
 *   slug and every existing slug, a collision is declared when the proposed
 *   slug shares a 5+ token leading prefix with an existing slug. This catches
 *   the "macbook-pro-weight-2024-2025-by-model-and-..." vs
 *   "macbook-pro-weight-2024-2026-by-model-..." pattern that escaped the
 *   built-in `BlogArticle.slug @unique` constraint because the year segments
 *   differed.
 *
 * Gate #3 — Topic signature match:
 *   Builds a normalized topic key from the first 3 content tokens of the
 *   title (lowercased, year/stop/SEO-modifier filtered, deduped, sorted).
 *   For all 8 of the macbook-pro-weight clones the signature collapses to
 *   "macbook|pro|weight" regardless of which trailing modifiers
 *   ("comparison", "guide", "complete specs", etc.) the AI tacked on.
 *
 * Gate #2 from the issue (title cosine similarity > 0.85 via embeddings) is
 * intentionally deferred to a follow-up PR.
 */

import { getPrisma } from "@/lib/db/prisma";
import { getRedis } from "./redis";

export type DedupReason =
  | "slug_prefix_collision"
  | "topic_signature_match";

export interface DedupCheckResult {
  ok: boolean;
  reason?: DedupReason;
  conflictingSlug?: string;
  details?: string;
}

const PREFIX_TOKEN_THRESHOLD = 5;
const SIGNATURE_TOKEN_COUNT = 3;
const REJECTION_LOG_KEY = "pipeline:rejections";
const REJECTION_LOG_MAX = 1000;
const YEAR_RE = /^(?:19|20)\d{2}$/;

// Stop words that carry no topical weight on their own.
const STOP_WORDS = new Set<string>([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by",
  "can", "could", "did", "do", "does", "for", "from", "had", "has",
  "have", "how", "if", "in", "into", "is", "it", "its", "may", "might",
  "more", "most", "must", "no", "not", "of", "on", "onto", "or", "our",
  "out", "over", "should", "so", "than", "that", "the", "their", "then",
  "there", "these", "they", "this", "those", "to", "under", "up", "upon",
  "was", "we", "were", "what", "when", "where", "which", "while", "who",
  "why", "will", "with", "would", "you", "your",
]);

// Generic SEO/listicle modifiers that appear in many titles but rarely
// distinguish a topic. Keep this list conservative — adding too much erodes
// the signal of legitimately different articles.
const SEO_MODIFIERS = new Set<string>([
  "best", "top", "ultimate", "complete", "comprehensive", "definitive",
  "full", "guide", "guides", "comparison", "comparisons", "compare",
  "compared", "review", "reviews", "analysis", "explained", "breakdown",
  "vs", "versus", "v", "all", "every", "any", "new", "latest", "updated",
  "update", "details", "everything", "ultimate",
]);

function tokenizeSlug(slug: string): string[] {
  return slug
    .toLowerCase()
    .split("-")
    .map((t) => t.trim())
    .filter(Boolean);
}

function stripYears(tokens: string[]): string[] {
  return tokens.filter((t) => !YEAR_RE.test(t));
}

/**
 * Returns the first PREFIX_TOKEN_THRESHOLD year-stripped slug tokens joined
 * by "-". When the slug is too short to form a stable prefix returns null,
 * which means the gate is skipped (no false positives on tiny slugs).
 */
export function slugPrefixKey(slug: string): string | null {
  if (!slug) return null;
  const tokens = stripYears(tokenizeSlug(slug));
  if (tokens.length < PREFIX_TOKEN_THRESHOLD) return null;
  return tokens.slice(0, PREFIX_TOKEN_THRESHOLD).join("-");
}

function tokenizeTitle(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function isContentToken(token: string): boolean {
  if (token.length < 3) return false;
  if (YEAR_RE.test(token)) return false;
  if (STOP_WORDS.has(token)) return false;
  if (SEO_MODIFIERS.has(token)) return false;
  return true;
}

/**
 * Returns the unique content tokens of a title in original order, with
 * stop words / years / SEO modifiers / short tokens stripped.
 */
export function contentTokens(title: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tok of tokenizeTitle(title)) {
    if (!isContentToken(tok)) continue;
    if (seen.has(tok)) continue;
    seen.add(tok);
    out.push(tok);
  }
  return out;
}

/**
 * Topic signature = sorted, pipe-joined set of the first
 * SIGNATURE_TOKEN_COUNT content tokens from the title. Returns "" when the
 * title has fewer than 2 content tokens (signal too weak — skip gate).
 */
export function topicSignature(title: string): string {
  const tokens = contentTokens(title).slice(0, SIGNATURE_TOKEN_COUNT);
  if (tokens.length < 2) return "";
  return [...tokens].sort().join("|");
}

export interface DedupCandidate {
  slug: string;
  title: string;
}

/**
 * Pure decision function — separated from DB access so it is trivially
 * unit-testable. Production callers should use checkBlogDedup() which loads
 * candidates from the DB first.
 */
export function decideDedup(
  proposedTitle: string,
  proposedSlug: string,
  existing: DedupCandidate[],
): DedupCheckResult {
  const proposedPrefix = slugPrefixKey(proposedSlug);
  const proposedSig = topicSignature(proposedTitle);

  for (const candidate of existing) {
    // Same slug = upsert/update path; not a collision.
    if (candidate.slug === proposedSlug) continue;

    if (proposedPrefix) {
      const candidatePrefix = slugPrefixKey(candidate.slug);
      if (candidatePrefix && candidatePrefix === proposedPrefix) {
        return {
          ok: false,
          reason: "slug_prefix_collision",
          conflictingSlug: candidate.slug,
          details: `Proposed slug shares a ${PREFIX_TOKEN_THRESHOLD}+ leading-token prefix (year-stripped) "${proposedPrefix}" with existing slug "${candidate.slug}".`,
        };
      }
    }

    if (proposedSig) {
      const candidateSig = topicSignature(candidate.title);
      if (candidateSig && candidateSig === proposedSig) {
        return {
          ok: false,
          reason: "topic_signature_match",
          conflictingSlug: candidate.slug,
          details: `Proposed title shares topic signature "${proposedSig}" with existing article "${candidate.title}" (${candidate.slug}).`,
        };
      }
    }
  }

  return { ok: true };
}

/**
 * Loads published BlogArticle candidates from the DB and runs decideDedup.
 * Returns { ok: true } when no DB is configured (no-op in mock mode).
 */
export async function checkBlogDedup(
  proposedTitle: string,
  proposedSlug: string,
): Promise<DedupCheckResult> {
  if (!proposedSlug || !proposedTitle) return { ok: true };

  const prisma = getPrisma();
  if (!prisma) return { ok: true };

  let candidates: DedupCandidate[] = [];
  try {
    candidates = await prisma.blogArticle.findMany({
      where: { status: "published" },
      select: { slug: true, title: true },
    });
  } catch (err) {
    // If we can't read existing articles we fail open rather than blocking
    // legitimate writes. The gate is a defense-in-depth measure.
    console.warn("[blog-dedup] Failed to load existing articles, skipping gate:", err);
    return { ok: true };
  }

  return decideDedup(proposedTitle, proposedSlug, candidates);
}

export interface DedupRejectionEntry {
  proposedTitle: string;
  proposedSlug: string;
  conflictingSlug?: string;
  reason?: DedupReason;
  details?: string;
  rejectedAt: string;
  source?: string;
}

/**
 * Persists a rejection to Redis list `pipeline:rejections` (LPUSH + LTRIM).
 * Best-effort: silent failure if Redis is not configured. We need this
 * observability to know whether the gate is too tight or too loose in prod.
 */
export async function recordDedupRejection(
  proposedTitle: string,
  proposedSlug: string,
  result: DedupCheckResult,
  source?: string,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const entry: DedupRejectionEntry = {
    proposedTitle,
    proposedSlug,
    conflictingSlug: result.conflictingSlug,
    reason: result.reason,
    details: result.details,
    rejectedAt: new Date().toISOString(),
    source,
  };

  try {
    await redis.lpush(REJECTION_LOG_KEY, JSON.stringify(entry));
    await redis.ltrim(REJECTION_LOG_KEY, 0, REJECTION_LOG_MAX - 1);
  } catch (err) {
    console.warn("[blog-dedup] Failed to record rejection to Redis:", err);
  }
}

export const __TESTING__ = {
  PREFIX_TOKEN_THRESHOLD,
  SIGNATURE_TOKEN_COUNT,
  REJECTION_LOG_KEY,
};
