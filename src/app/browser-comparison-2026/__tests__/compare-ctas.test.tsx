/**
 * ROO-114 — /browser-comparison-2026 reuses the ROO-119 compare CTA.
 * Links carry ?source_page= and clicks fire related_comparison_click.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { render, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import {
  BROWSER_COMPARISON_COMPARE_LINKS,
  BROWSER_COMPARISON_CTA_HEADING,
  BROWSER_COMPARISON_SOURCE_PAGE,
} from "@/lib/data/browser-comparison-cta";

const trackRelatedComparisonClick = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackRelatedComparisonClick: (...args: unknown[]) => trackRelatedComparisonClick(...args),
}));

import { BlogInlineCompareCtas } from "@/components/blog/BlogInlineCompareCtas";

function source(rel: string): string {
  return readFileSync(path.resolve(process.cwd(), rel), "utf8");
}

describe("browser comparison compare CTAs", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
  });

  it("links each live compare with source_page and records the click", () => {
    const { container } = render(
      <BlogInlineCompareCtas
        sourcePage={BROWSER_COMPARISON_SOURCE_PAGE}
        links={BROWSER_COMPARISON_COMPARE_LINKS}
        heading={BROWSER_COMPARISON_CTA_HEADING}
      />,
    );
    const view = within(container);

    expect(view.getByRole("navigation", { name: "Related comparisons" })).toBeTruthy();
    expect(view.getByText(BROWSER_COMPARISON_CTA_HEADING)).toBeTruthy();
    expect(view.queryByText(/winner|which is better|which wins/i)).toBeNull();

    for (const link of BROWSER_COMPARISON_COMPARE_LINKS) {
      const anchor = view.getByRole("link", { name: link.label });
      expect(anchor).toHaveAttribute(
        "href",
        `/compare/${link.slug}?source_page=${encodeURIComponent(BROWSER_COMPARISON_SOURCE_PAGE)}`,
      );
      fireEvent.click(anchor);
      expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
        BROWSER_COMPARISON_SOURCE_PAGE,
        link.slug,
      );
    }
  });

  it("uses three or four canonical browser slugs that do not declare a winner", () => {
    expect(BROWSER_COMPARISON_COMPARE_LINKS.length).toBeGreaterThanOrEqual(3);
    expect(BROWSER_COMPARISON_COMPARE_LINKS.length).toBeLessThanOrEqual(4);
    expect(BROWSER_COMPARISON_SOURCE_PAGE).toBe("/browser-comparison-2026");
    for (const link of BROWSER_COMPARISON_COMPARE_LINKS) {
      expect(isRedirectedCompareSlug(link.slug)).toBe(false);
      expect(link.label).toMatch(/^Compare /);
      expect(link.label).not.toMatch(/winner|which is better|which wins/i);
    }
  });

  it("places the block in the hero, after the pricing line and before the intro", () => {
    const page = source("src/app/browser-comparison-2026/page.tsx");
    const pricingAt = page.indexOf('<SoftPricingLine src="browser-comparison-2026"');
    const ctaAt = page.indexOf("<BlogInlineCompareCtas");
    const introAt = page.indexOf('id="page-intro"');
    const articleAt = page.indexOf("<article");

    expect(pricingAt).toBeGreaterThan(-1);
    expect(ctaAt).toBeGreaterThan(pricingAt);
    expect(introAt).toBeGreaterThan(ctaAt);
    expect(articleAt).toBeGreaterThan(introAt);
    expect(page).toContain("sourcePage={BROWSER_COMPARISON_SOURCE_PAGE}");
    expect(page).toContain("links={BROWSER_COMPARISON_COMPARE_LINKS}");
    expect(page).toContain("heading={BROWSER_COMPARISON_CTA_HEADING}");
  });
});
