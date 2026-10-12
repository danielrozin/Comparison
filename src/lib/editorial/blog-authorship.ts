import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { isHumanReviewedSlug } from "@/lib/editorial/human-reviewed";

/**
 * Blog authorship, routed through HUMAN_REVIEWED_SLUGS.
 *
 * Only allowlisted slugs carry Daniel's byline, the "Human reviewed" badge,
 * and Person author / reviewedBy / lastReviewed schema. Every other post is
 * labeled "Analysis" by the editorial team with an AI disclosure.
 */
export const EDITORIAL_TEAM_NAME = "AversusB Editorial Team";
export const AI_CONTENT_LABEL = "Analysis";
export const AI_DISCLOSURE = "Drafted with AI from web research.";

export function isHumanReviewedBlogSlug(slug: string | null | undefined): boolean {
  return isHumanReviewedSlug(slug);
}

export function editorialTeamAuthorNode(): Record<string, string> {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: EDITORIAL_TEAM_NAME,
    url: `${SITE_URL}/about`,
  };
}

/** Name used in citation_author / DC.creator meta tags. */
export function blogAuthorName(slug: string | null | undefined): string {
  return isHumanReviewedBlogSlug(slug) ? "Daniel Rozin" : EDITORIAL_TEAM_NAME;
}

/** OpenGraph article:author values. */
export function blogOgAuthors(slug: string | null | undefined): string[] {
  return isHumanReviewedBlogSlug(slug) ? [`${SITE_URL}/authors/daniel-rozin`] : [`${SITE_URL}/about`];
}

/**
 * reviewedBy / lastReviewed for blog Article JSON-LD. Empty unless allowlisted.
 */
export function blogReviewFields(
  slug: string | null | undefined,
  reviewedAt: string | undefined,
  reviewers: unknown[],
): Record<string, unknown> {
  if (!isHumanReviewedBlogSlug(slug)) return {};
  return { ...(reviewedAt && { lastReviewed: reviewedAt }), reviewedBy: reviewers };
}

export { SITE_NAME };
