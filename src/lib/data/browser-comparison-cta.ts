/**
 * ROO-114 — compare links for /browser-comparison-2026.
 *
 * Rendered with BlogInlineCompareCtas (ROO-119), which uses TrackedCompareLink.
 * Three hero slots. Brave vs Chrome is first. Chrome vs Firefox stays.
 * Firefox vs Safari keeps the last slot. Chrome vs Safari is live, but a
 * fourth link would grow the block, so Brave vs DuckDuckGo is dropped.
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
  { slug: "brave-vs-chrome", label: "Compare Brave vs Chrome" },
  { slug: "chrome-vs-firefox", label: "Compare Chrome vs Firefox" },
  { slug: "firefox-vs-safari", label: "Compare Firefox vs Safari" },
];
