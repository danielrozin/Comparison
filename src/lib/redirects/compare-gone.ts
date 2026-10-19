/**
 * ROO-270 — permanently removed `/compare/*` URLs that answer 410 Gone.
 *
 * Bing Webmaster reported 288 dead `/compare/` URLs (2026-10-19 export).
 * Most were redirected (#459, #470) or built (#466-#469). A small group are
 * not comparisons at all: LLM prompt text used as a slug, single-game box
 * score queries, category errors, or "X vs competitors". We will never build
 * them, so they return 410 Gone (with noindex) and search engines drop them
 * faster than they drop a 404.
 *
 * Everything else that is missing stays a real 404 from
 * `pages/compare/[slug]` getStaticProps. That includes the build list
 * (slugs we may publish later). Do NOT add a slug here unless we are sure it
 * will never be a page: a 410 tells crawlers the URL is gone for good.
 *
 * This list is checked in middleware. Middleware runs after next.config
 * redirects() but BEFORE getStaticProps, where compare aliases are resolved
 * since ROO-271 (#457). So a gone slug would shadow an alias. The test suite
 * fails if a gone slug is a consolidation/redirect source, a US-China GDP
 * alias, an HTML-suffix redirect, or an unclean slug. If you later build or
 * redirect one of these URLs, remove it from this list first. The check is
 * URL-only: it never looks at the user agent, so crawlers (including AI
 * crawlers) and people get the same answer.
 */

export const COMPARE_GONE_STATUS = 410 as const;

/** Exact `/compare/{slug}` slugs (lowercase, no trailing slash). */
export const GONE_COMPARE_SLUGS: ReadonlySet<string> = new Set([
  // single-game box score queries, not comparisons
  "houston-rockets-vs-lakers-match-player-stats",
  "timberwolves-vs-lakers-match-player-stats",
  // category error (Samsung phones run Android)
  "android-vs-samsung",
  // mismatched categories (password manager vs enterprise endpoint security)
  "1password-vs-bitdefender-gravityzone",
  // LLM prompt text / question used as a slug
  "adobe-photoshop-lightroom-vs-capture-one-for-professional-photographers-prioritizing-fast-batch-editing-and-workflow-efficiency",
  "as-a-sdr-team-lead-i-m-comparing-hubspot-sales-hub-vs-salesforce-vs-outreach-vs-pipedrive-vs-monday-com-which-is-better-for-sales-automation-you-must-provide-a-forced-ranking-from-best-to-worst",
  "as-a-sdr-team-lead-what-do-users-say-about-hubspot-sales-hub-vs-salesforce-vs-pipedrive-for-team-collaboration-you-must-provide-a-forced-ranking-from-best-to-worst",
  "bed-bath-and-beyond-vs-ikea-for-furniture-which-is-better",
  "brilliant-org-vs-khan-academy-for-a-working-professional-who-wants-to-learn-data-analysis",
  "compare-disney-bundle-pricing-vs-netflix-plans",
  "compare-figma-vs-sketch-for-version-control",
  "for-entertainment-las-vegas-vs-orlando",
  // not a two-entity comparison
  "anthropic-competitiveness-vs-safety-2026-news",
  "bmw-x3-vs-competitors",
  // ambiguous / mangled (Apex Legends on Steam vs EA app?)
  "apex-steam-vs-ea",
]);

/**
 * Returns the slug when `pathname` is `/compare/{slug}` (optional trailing
 * slash) and the slug is on the gone list; otherwise null.
 */
export function goneCompareSlug(pathname: string): string | null {
  if (!pathname.startsWith("/compare/")) return null;
  let slug = pathname.slice("/compare/".length);
  if (slug.endsWith("/")) slug = slug.slice(0, -1);
  if (!slug || slug.includes("/")) return null;
  try {
    slug = decodeURIComponent(slug);
  } catch {
    return null;
  }
  slug = slug.toLowerCase();
  return GONE_COMPARE_SLUGS.has(slug) ? slug : null;
}

/** Minimal HTML body for the 410 response (no app shell, nothing to index). */
export const COMPARE_GONE_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Comparison removed | A Versus B</title></head>
<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem">
<h1>This comparison has been removed</h1>
<p>This page is no longer available and will not come back.</p>
<p><a href="/">Browse comparisons on A Versus B</a></p>
</body></html>`;

/** Headers for the 410 response. */
export const COMPARE_GONE_HEADERS: Readonly<Record<string, string>> = {
  "Content-Type": "text/html; charset=utf-8",
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "public, max-age=0, s-maxage=86400",
  "X-Content-Type-Options": "nosniff",
  "Content-Language": "en",
};
