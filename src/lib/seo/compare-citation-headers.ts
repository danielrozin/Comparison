/**
 * Compare-page HTTP Link citation headers (schema / FAQ / answer / cite-as).
 *
 * These must only be advertised when the compare slug is a real 200 page.
 * Stamping them on every `/compare/:slug` (next.config headers() + middleware)
 * made missing slugs look citeable — live audit 2026-09-20 P0-2 / ROO-24.
 */

export const COMPARE_CITATION_SITE = "https://www.aversusb.net";

export function shouldAdvertiseCompareCitationHeaders(options: {
  slug: string;
  /** False on getStaticProps notFound / hard 404. */
  pageExists: boolean;
  /** True when the slug 301s away — its APIs 404. */
  isRedirectSource?: boolean;
}): boolean {
  const slug = options.slug.trim();
  if (!slug || slug.includes("/")) return false;
  if (!options.pageExists) return false;
  if (options.isRedirectSource) return false;
  return true;
}

export function buildCompareCitationLinkHeader(
  slug: string,
  site: string = COMPARE_CITATION_SITE,
): string {
  return [
    `<${site}/api/v1/schema/${slug}>; rel="describedby"; type="application/ld+json"; title="Schema.org JSON-LD"`,
    `<${site}/api/v1/schema/${slug}>; rel="alternate"; type="application/ld+json"; title="Schema.org JSON-LD"`,
    `<${site}/api/knowledge-graph/${slug}>; rel="alternate"; type="application/ld+json"; title="Knowledge Graph"`,
    `<${site}/api/comparisons/${slug}>; rel="alternate"; type="application/json"; title="Comparison JSON"`,
    `<${site}/api/answer/${slug}>; rel="alternate"; type="application/json"; title="AI Answer"`,
    `<${site}/api/faq/${slug}>; rel="alternate"; type="application/json"; title="FAQ Pairs"`,
    `<${site}/compare/${slug}>; rel="cite-as"`,
  ].join(", ");
}
