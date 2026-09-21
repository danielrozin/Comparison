import type { ComparisonPageData } from "@/types";
import { SIGNAL_VS_WHATSAPP } from "./signal-vs-whatsapp";
import { SIGNAL_VS_TELEGRAM } from "./signal-vs-telegram";
import { WHATSAPP_VS_TELEGRAM } from "./whatsapp-vs-telegram";
import type { EditorialComparison } from "./types";

export type { EditorialComparison } from "./types";
export { EDITORIAL_COMPARE_PUBLISHED_AT, EDITORIAL_COMPARE_UPDATED_AT } from "./types";

/**
 * ROO-27 / ROO-28 — human-reviewed messaging compares shipped in-repo.
 *
 * These are not the bundled mock fixtures. They carry `metadata.status =
 * "published"` so `/compare/[slug]`, FAQ/answer APIs, sitemap, and entity
 * discovery treat them as catalog pages even before a prod-DB publish
 * workflow runs. `saveComparison` via
 * `scripts/publish-messaging-compares-roo27.ts` can still upsert the same
 * payload into Postgres after merge.
 */
const EDITORIAL_COMPARES: Record<string, EditorialComparison> = {
  [SIGNAL_VS_WHATSAPP.slug]: SIGNAL_VS_WHATSAPP,
  [SIGNAL_VS_TELEGRAM.slug]: SIGNAL_VS_TELEGRAM,
  [WHATSAPP_VS_TELEGRAM.slug]: WHATSAPP_VS_TELEGRAM,
};

export function getEditorialComparison(slug: string): EditorialComparison | null {
  return EDITORIAL_COMPARES[slug] ?? null;
}

export function isEditorialCompareSlug(slug: string): boolean {
  return slug in EDITORIAL_COMPARES;
}

export function listEditorialComparisons(): EditorialComparison[] {
  return Object.values(EDITORIAL_COMPARES);
}

export function listEditorialCompareSlugs(): string[] {
  return Object.keys(EDITORIAL_COMPARES);
}

/** Sitemap / entity-discovery rows for editorial slugs not yet in the DB. */
export function listEditorialCompareSitemapEntries(): {
  slug: string;
  title: string;
  category: string;
  lastModified: string;
  entityA: string;
  entityB: string;
}[] {
  return listEditorialComparisons().map((c) => ({
    slug: c.slug,
    title: c.title,
    category: c.category ?? "technology",
    lastModified: c.metadata.updatedAt,
    entityA: c.entities[0]?.name ?? "",
    entityB: c.entities[1]?.name ?? c.entities[0]?.name ?? "",
  }));
}

/**
 * Fill AEO fields the DB transform may omit (quickAnswer lives in `content`
 * JSON and is not always mapped). Never overwrite a published row's scorecard.
 */
export function mergeEditorialEnrichment(
  published: ComparisonPageData,
  editorial: EditorialComparison | null
): ComparisonPageData {
  if (!editorial) return published;
  return {
    ...published,
    quickAnswer: published.quickAnswer ?? editorial.quickAnswer,
    expertAnalysis: published.expertAnalysis ?? editorial.expertAnalysis,
    citationStats: published.citationStats ?? editorial.citationStats,
    faqs: published.faqs.length >= editorial.faqs.length ? published.faqs : editorial.faqs,
    shortAnswer: published.shortAnswer ?? editorial.shortAnswer,
  };
}
