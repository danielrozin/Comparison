import type { ComparisonPageData } from "@/types";

export const EDITORIAL_COMPARE_UPDATED_AT = "2026-09-21T00:00:00Z";
export const EDITORIAL_COMPARE_PUBLISHED_AT = "2026-09-21T00:00:00Z";

/**
 * Editorial catalog pages shipped in-repo (ROO-27 / ROO-28).
 * `metadata.isHumanReviewed` comes from HUMAN_REVIEWED_SLUGS, not from this type.
 */
export type EditorialComparison = ComparisonPageData & {
  metadata: ComparisonPageData["metadata"] & { status: "published" };
};
