// Bing Webmaster 404 report (2026-10-19): variant /compare/ slugs that 404
// live and have an exact live equivalent. Each must 301 in one hop to that
// page, never to another redirect source, and never to a noindex page.

import { describe, it, expect } from "vitest";
import {
  COMPARE_REDIRECTS,
  getConsolidatedCompareSlug,
  isRedirectedCompareSlug,
} from "../compare-redirects";
import { NEVER_PUBLISHED_ALIASES } from "../not-found-cleanup-redirects";

const BING_404_VARIANTS: Record<string, string> = {
  "texas-vs-california-economy-comparison-2026": "california-vs-texas",
  "barcelona-vs-real-madrid-total-trophies-2026": "real-madrid-vs-barcelona-total-trophies-comparison-2026",
  "real-madrid-vs-barcelona-la-liga-titles-comparison-2026": "real-madrid-vs-barcelona-total-trophies-comparison-2026",
  "macbook-air-vs-macbook-pro-weight-comparison-2025-2026": "macbook-air-vs-macbook-pro",
  "china-vs-us-economy-comparison-2026": "us-economy-vs-china-economy",
  "china-vs-us-economic-comparison-2026": "us-economy-vs-china-economy",
  "us-vs-china-economy-2026-comparison": "us-economy-vs-china-economy",
  "us-vs-china-economic-comparison-2026": "us-economy-vs-china-economy",
  "china-vs-usa-economy": "us-economy-vs-china-economy",
  "united-airlines-vs-delta-airlines-comparison-2026": "delta-vs-united-airlines",
  "united-airlines-vs-delta-air-lines-comparison-2026": "delta-vs-united-airlines",
  "delta-vs-united-airlines-which-is-better-2026": "delta-vs-united-airlines",
  "united-vs-delta-airlines-comparison-2026": "delta-vs-united-airlines",
  "american-express-merchant-acceptance-rates-vs-mastercard-2025-2026": "american-express-vs-mastercard",
  "american-express-merchant-acceptance-rate-vs-mastercard-2025-2026": "american-express-vs-mastercard",
  "mastercard-vs-american-express-merchant-acceptance-comparison-2025-2026": "american-express-vs-mastercard",
  "macbook-air-vs-macbook-pro-differences-2026-specs": "macbook-air-vs-macbook-pro-differences-2026-specs-battery-performance",
  "macbook-pro-vs-macbook-air-differences-2026": "macbook-air-vs-macbook-pro",
  "macbook-pro-vs-macbook-air-which-is-better-2026": "macbook-air-vs-macbook-pro",
  "xbox-series-x-vs-ps5-games-comparison-2026": "ps5-vs-xbox-series-x",
  "wegovy-vs-ozempic-comparison-differences-similarities-2026": "ozempic-vs-wegovy",
  "samsung-vs-iphone": "iphone-vs-samsung-galaxy",
  "samsung-s25-vs-s25-ultra": "galaxy-s25-vs-galaxy-s25-ultra",
  "samsung-galaxy-s25-vs-samsung-galaxy-s25-ultra": "galaxy-s25-vs-galaxy-s25-ultra",
  "samsung-galaxy-s26-vs-samsung-galaxy-s26-ultra": "galaxy-s26-vs-galaxy-s26-ultra",
  "samsung-galaxy-s26-vs-iphone-17-specs-2026": "iphone-17-vs-samsung-s26",
  "iphone-17-vs-samsung-galaxy-s26-specs-2026": "iphone-17-vs-samsung-s26",
  "messi-vs-ronaldo-landscape": "messi-vs-ronaldo",
  "cristiano-ronaldo-vs-lionel-messi-career-stats-achievements-2026": "messi-vs-ronaldo",
  "cristiano-ronaldo-vs-lionel-messi-achievements-comparison-2026": "messi-vs-ronaldo",
  "macbook-pro-m5-pro-vs-max": "m5-max-vs-m5-pro",
  "macbook-pro-14-vs-16-2026": "macbook-pro-14-vs-macbook-pro-16",
  "ipad-vs-samsung-galaxy-tab": "ipad-vs-samsung-tablet",
  "cursor-vs-github-copilot": "cursor-vs-copilot",
  "compare-bmw-vs-mercedes": "bmw-vs-mercedes",
  "claude-vs-gemini": "claude-vs-google-gemini",
  "ally-hysa-vs-marcus": "ally-bank-vs-marcus-by-goldman-sachs",
  "china-vs-us-military-strength-comparison-2026": "us-military-vs-china-military",
  "chase-vs-capital-one-banking": "capital-one-vs-chase",
  "capital-one-bank-vs-chase-bank": "capital-one-vs-chase",
  "charles-schwab-vs-vanguard-account-fees-and-expense-ratios": "schwab-vs-vanguard",
  "capture-one-vs-lightroom-price": "capture-one-vs-lightroom",
  "bmw-x5-vs-gle": "mercedes-gle-vs-bmw-x5",
  "bitcoin-vs-ethereum-price-performance": "bitcoin-vs-ethereum",
  "apple-macbook-air-m3-vs-m4": "macbook-air-m3-vs-macbook-air-m4",
  "antivirus-norton-vs-mcafee": "mcafee-vs-norton",
  "dc-comics-vs-marvel-comics-comparison-2026": "marvel-vs-dc",
  "apple-music-vs-youtube-music-vs-spotify": "spotify-vs-apple-music-vs-youtube-music",
  "claude-vs-chat-gpt-vs-gemini": "chatgpt-vs-claude-vs-gemini",
};

// Provisional (noindex) pages as of 2026-10-19 (ROO-263 / ROO-271). No alias
// may point at these.
const NOINDEX_TARGETS = [
  "401k-vs-ira",
  "amazon-fire-vs-ipad",
  "apple-notes-vs-obsidian",
  "bitbucket-vs-gitlab",
  "bmw-8-series-vs-mercedes-amg",
  "f-35-vs-f-22",
  "gopro-vs-insta360",
  "nuxt-vs-vue",
  "patriot-vs-s-300",
  "rover-vs-wag",
];

describe("Bing 404 variant slugs", () => {
  for (const [from, to] of Object.entries(BING_404_VARIANTS)) {
    it(`${from} 301s to ${to} in one hop`, () => {
      expect(getConsolidatedCompareSlug(from)).toBe(to);
      expect(isRedirectedCompareSlug(from)).toBe(true);
      const rules = COMPARE_REDIRECTS.filter((r) => r.source === `/compare/${from}`);
      expect(rules).toEqual([
        { source: `/compare/${from}`, destination: `/compare/${to}`, statusCode: 301 },
      ]);
    });
  }

  it("never targets a slug that is itself a redirect source", () => {
    for (const to of new Set(Object.values(BING_404_VARIANTS))) {
      expect(isRedirectedCompareSlug(to), to).toBe(false);
    }
  });

  it("never targets a noindex page", () => {
    for (const to of Object.values(BING_404_VARIANTS)) {
      expect(NOINDEX_TARGETS).not.toContain(to);
    }
  });

  it("counts as never-published aliases (they were 404s, not catalog pages)", () => {
    for (const from of Object.keys(BING_404_VARIANTS)) {
      expect(NEVER_PUBLISHED_ALIASES.has(from), from).toBe(true);
    }
  });
});
