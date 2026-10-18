import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

/**
 * Compare slugs Daniel has personally reviewed.
 *
 * Enrichment scripts set `isHumanReviewed` on their own, so that database
 * flag is not a review. Bylines, reviewed badges, and Article author /
 * reviewedBy schema read this list only. Leave it empty until Daniel
 * reviews a page and adds its slug here.
 */
export const HUMAN_REVIEWED_SLUGS: string[] = [];

/** What a human sign-off must cover (Google AI-content guidance, 2026-10-01). */
export const HUMAN_REVIEW_CHECKS = ["facts", "title", "meta", "schema", "alt"] as const;
export type HumanReviewCheck = (typeof HUMAN_REVIEW_CHECKS)[number];

export interface HumanReviewSignoff {
  reviewer: "Daniel Rozin";
  /** ISO date, YYYY-MM-DD. */
  reviewedOn: string;
  checked: HumanReviewCheck[];
}

/**
 * ROO-160: a slug may be on HUMAN_REVIEWED_SLUGS only with a complete
 * sign-off here, recorded by Daniel. See docs/ai-content-review-policy.md.
 */
export const HUMAN_REVIEW_SIGNOFFS: Record<string, HumanReviewSignoff> = {};

/** Slugs listed as reviewed without a complete sign-off. Must be empty. */
export function unsignedReviewedSlugs(
  slugs: readonly string[] = HUMAN_REVIEWED_SLUGS,
  signoffs: Record<string, HumanReviewSignoff> = HUMAN_REVIEW_SIGNOFFS,
): string[] {
  return slugs.filter((slug) => {
    const signoff = signoffs[slug];
    if (!signoff || signoff.reviewer !== "Daniel Rozin") return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(signoff.reviewedOn)) return true;
    return !HUMAN_REVIEW_CHECKS.every((check) => signoff.checked.includes(check));
  });
}

export function isHumanReviewedSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return HUMAN_REVIEWED_SLUGS.includes(slug);
}

function organizationAuthor(): Record<string, string> {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isDanielString(value: string): boolean {
  return value === "Daniel Rozin" || value.includes("/authors/daniel-rozin");
}

function isDanielNode(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const name = typeof value.name === "string" ? value.name : "";
  const id = typeof value["@id"] === "string" ? value["@id"] : "";
  const url = typeof value.url === "string" ? value.url : "";
  return name === "Daniel Rozin" || id.includes("/authors/daniel-rozin") || url.includes("/authors/daniel-rozin");
}

/**
 * Compare JSON-LD must not name Daniel as author or reviewer unless the
 * slug is on HUMAN_REVIEWED_SLUGS. A Daniel author becomes the organization.
 * reviewedBy, lastReviewed, and isHumanReviewed are omitted.
 * A founder (or any other non-author) person node is left in place.
 */
export function labelUnreviewedCompareJsonLd<T>(document: T, slug: string): T {
  if (isHumanReviewedSlug(slug)) return document;
  return rewriteTree(document) as T;
}

function rewriteTree(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => rewriteTree(item));
  if (!isRecord(value)) return value;

  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "reviewedBy" || key === "lastReviewed" || key === "isHumanReviewed") continue;
    if (key === "author" || key === "creator") {
      next[key] = replaceDanielAuthor(child);
      continue;
    }
    next[key] = rewriteTree(child);
  }
  return next;
}

function replaceDanielAuthor(value: unknown): unknown {
  if (typeof value === "string") return isDanielString(value) ? SITE_NAME : value;
  if (Array.isArray(value)) {
    const kept = value
      .filter((item) => !(typeof item === "string" && isDanielString(item)) && !isDanielNode(item))
      .map((item) => rewriteTree(item));
    return kept.length === 0 ? organizationAuthor() : kept;
  }
  if (isDanielNode(value)) return organizationAuthor();
  return rewriteTree(value);
}
