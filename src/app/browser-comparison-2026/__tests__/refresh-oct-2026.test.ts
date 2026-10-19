/**
 * ROO-269 — Oct 19, 2026 refresh of /browser-comparison-2026.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { LAST_UPDATED } from "@/app/browser-comparison-2026/last-updated";

const src = readFileSync(path.resolve(process.cwd(), "src/app/browser-comparison-2026/page.tsx"), "utf8");

describe("browser comparison hub, Oct 19 refresh", () => {
  it("carries the current Edge build and the new date", () => {
    expect(LAST_UPDATED).toBe("2026-10-19");
    expect(src).toContain('version: "155 (155.0.4283.62)"');
    expect(src).not.toContain("155.0.4283.60");
    expect(src).toContain("https://brave.com/latest/");
  });

  it("links one live compare page in the body", () => {
    expect(src).toContain('href="/compare/chrome-vs-firefox"');
    expect(isRedirectedCompareSlug("chrome-vs-firefox")).toBe(false);
  });

  it("emits exactly one FAQPage and no ClaimReview", () => {
    expect(src.match(/"@type": "FAQPage"/g)).toHaveLength(1);
    expect(src).not.toMatch(/ClaimReview|isHumanReviewed|reviewedBy/);
  });

  it("drops market-share and source-talk from reader copy", () => {
    expect(src).not.toMatch(/market share|market-share estimates were removed|All figures cited to primary sources/i);
  });
});
