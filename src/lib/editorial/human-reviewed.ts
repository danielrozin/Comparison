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
