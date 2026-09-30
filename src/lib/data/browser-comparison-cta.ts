/**
 * ROO-114 — compare links for /browser-comparison-2026.
 *
 * Rendered with BlogInlineCompareCtas (ROO-119), which uses TrackedCompareLink.
 * Each slug was checked live: HTTP 200, no redirect, and a self rel=canonical.
 * brave-vs-chrome and chrome-vs-safari 404, so Brave is the live
 * brave-vs-duckduckgo page instead.
 */

export const BROWSER_COMPARISON_SOURCE_PAGE = "/browser-comparison-2026";

/** Block label. Does not name a winner. */
export const BROWSER_COMPARISON_CTA_HEADING = "Compare these browsers";

export interface BrowserCompareLink {
  slug: string;
  label: string;
}

/**
 * Chrome, Firefox, Safari, and Brave, using the live head-to-head pages.
 * Labels stay descriptive and do not declare a winner.
 */
export const BROWSER_COMPARISON_COMPARE_LINKS: readonly BrowserCompareLink[] = [
  { slug: "chrome-vs-firefox", label: "Compare Chrome vs Firefox" },
  { slug: "firefox-vs-safari", label: "Compare Firefox vs Safari" },
  { slug: "brave-vs-duckduckgo", label: "Compare Brave vs DuckDuckGo" },
];
