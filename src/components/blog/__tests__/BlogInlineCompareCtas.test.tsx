/**
 * ROO-119 — cashier's check blog compare links fire the shared
 * related_comparison_click event and point at canonical /compare pages.
 */
import { render, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { BLOG_COMPARE_FALLBACKS } from "@/lib/data/blog-compare-constants";
import {
  CASHIERS_CHECK_BLOG_SLUG,
  CASHIERS_CHECK_COMPARE_LINKS,
  CASHIERS_CHECK_SOURCE_PAGE,
  selectCashiersCheckCompareLinks,
  splitHtmlAfterIntro,
} from "@/lib/data/cashiers-check-blog-cta";

const trackRelatedComparisonClick = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackRelatedComparisonClick: (...args: unknown[]) => trackRelatedComparisonClick(...args),
}));

import { BlogInlineCompareCtas } from "../BlogInlineCompareCtas";
import {
  MACBOOK_AIR_WEIGHT_BLOG_SLUG,
  MACBOOK_PRO_WEIGHT_BLOG_SLUG,
  BEST_TANKS_BLOG_SLUG,
  NAVIGATION_APPS_BLOG_SLUG,
  ORGANIC_LANDER_COMPARES,
  selectOrganicLanderCompare,
} from "@/lib/data/organic-lander-compare-ctas";

const LINKS = selectCashiersCheckCompareLinks(
  CASHIERS_CHECK_COMPARE_LINKS.map((link) => link.slug),
);

describe("BlogInlineCompareCtas", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
  });

  it("links each live compare with source_page and records the click", () => {
    const { container } = render(
      <BlogInlineCompareCtas sourcePage={CASHIERS_CHECK_SOURCE_PAGE} links={LINKS} />,
    );
    const view = within(container);

    expect(view.getByRole("navigation", { name: "Related comparisons" })).toBeTruthy();
    expect(view.getByText("Compare banks and money-transfer apps")).toBeTruthy();
    expect(view.queryByText(/winner/i)).toBeNull();

    for (const link of LINKS) {
      const anchor = view.getByRole("link", { name: link.label });
      expect(anchor).toHaveAttribute(
        "href",
        `/compare/${link.slug}?source_page=${encodeURIComponent(CASHIERS_CHECK_SOURCE_PAGE)}`,
      );
      fireEvent.click(anchor);
      expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
        CASHIERS_CHECK_SOURCE_PAGE,
        link.slug,
      );
    }
  });

  it("renders nothing when no live compare remains", () => {
    const { container } = render(
      <BlogInlineCompareCtas sourcePage={CASHIERS_CHECK_SOURCE_PAGE} links={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("cashier's check compare targets", () => {
  it("uses 2-3 canonical slugs that are also the blog fallbacks", () => {
    expect(CASHIERS_CHECK_COMPARE_LINKS.length).toBeGreaterThanOrEqual(2);
    expect(CASHIERS_CHECK_COMPARE_LINKS.length).toBeLessThanOrEqual(3);
    expect(BLOG_COMPARE_FALLBACKS[CASHIERS_CHECK_BLOG_SLUG]).toEqual(
      CASHIERS_CHECK_COMPARE_LINKS.map((link) => link.slug),
    );
    for (const link of CASHIERS_CHECK_COMPARE_LINKS) {
      expect(isRedirectedCompareSlug(link.slug)).toBe(false);
      expect(link.label).not.toMatch(/winner|which is better|which wins/i);
    }
  });

  it("drops a slug the live filter did not keep", () => {
    expect(
      selectCashiersCheckCompareLinks(["bank-of-america-vs-chase", "revolut-vs-wise"]).map(
        (link) => link.slug,
      ),
    ).toEqual(["bank-of-america-vs-chase", "revolut-vs-wise"]);
  });

  it("places the split just under the intro, skipping a leftover markdown title", () => {
    const html = [
      '<p class="text-text-secondary leading-relaxed my-4"># How to Get a Cashier\'s Check</p>',
      '<p class="text-text-secondary leading-relaxed my-4">A cashier\'s check is one of the safest forms of payment.</p>',
      '<h2 id="what-is">What Is a Cashier\'s Check?</h2>',
      "<p>More body.</p>",
    ].join("\n");
    const parts = splitHtmlAfterIntro(html);
    expect(parts).not.toBeNull();
    expect(parts!.lead).toContain("safest forms of payment");
    expect(parts!.lead).not.toContain("<h2");
    expect(parts!.rest.trim().startsWith("<h2")).toBe(true);
  });
});

describe("ROO-127 organic lander compare targets", () => {
  it("uses three canonical slugs that match the blog fallbacks", () => {
    expect(ORGANIC_LANDER_COMPARES).toHaveLength(4);
    for (const lander of ORGANIC_LANDER_COMPARES) {
      expect(lander.links).toHaveLength(3);
      expect(BLOG_COMPARE_FALLBACKS[lander.blogSlug]).toEqual(
        lander.links.map((link) => link.slug),
      );
      expect(lander.sourcePage).toBe(`/blog/${lander.blogSlug}`);
      for (const link of lander.links) {
        expect(isRedirectedCompareSlug(link.slug)).toBe(false);
        expect(link.label.startsWith("Compare ")).toBe(true);
        expect(link.label).not.toMatch(/winner|which is better|which wins/i);
      }
    }
  });

  it("drops a slug the live filter did not keep", () => {
    const picked = selectOrganicLanderCompare(MACBOOK_AIR_WEIGHT_BLOG_SLUG, [
      "macbook-air-m3-vs-macbook-air-m4",
      "macbook-air-vs-macbook-pro",
    ]);
    expect(picked?.links.map((link) => link.slug)).toEqual([
      "macbook-air-m3-vs-macbook-air-m4",
      "macbook-air-vs-macbook-pro",
    ]);
    expect(selectOrganicLanderCompare("unrelated-post", ["mac-vs-windows"])).toBeNull();
  });

  it("links each live compare with the full blog path and records the click", () => {
    for (const lander of ORGANIC_LANDER_COMPARES) {
      const selected = selectOrganicLanderCompare(
        lander.blogSlug,
        lander.links.map((link) => link.slug),
      );
      expect(selected).not.toBeNull();
      const { container } = render(
        <BlogInlineCompareCtas
          sourcePage={selected!.sourcePage}
          links={selected!.links}
          heading={selected!.heading}
        />,
      );
      const view = within(container);
      expect(view.getByText(lander.heading)).toBeTruthy();

      for (const link of selected!.links) {
        const anchor = view.getByRole("link", { name: link.label });
        expect(anchor).toHaveAttribute(
          "href",
          `/compare/${link.slug}?source_page=${encodeURIComponent(lander.sourcePage)}`,
        );
        fireEvent.click(anchor);
        expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
          lander.sourcePage,
          link.slug,
        );
      }
    }

    expect([
      MACBOOK_PRO_WEIGHT_BLOG_SLUG,
      MACBOOK_AIR_WEIGHT_BLOG_SLUG,
      NAVIGATION_APPS_BLOG_SLUG,
      BEST_TANKS_BLOG_SLUG,
    ]).toEqual(ORGANIC_LANDER_COMPARES.map((lander) => lander.blogSlug));
  });
});
