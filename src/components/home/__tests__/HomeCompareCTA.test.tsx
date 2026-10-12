/**
 * ROO-46 — blog hub compare CTA fires related_comparison_click and points at
 * /compare/* with source_page, so the compare page can emit comparison_viewed.
 */
import { render, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const trackRelatedComparisonClick = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackRelatedComparisonClick: (...args: unknown[]) => trackRelatedComparisonClick(...args),
}));

import { HomeCompareCTA, TrackedCompareLink } from "../HomeCompareCTA";
import { BLOG_HUB_COMPARE_SOURCE } from "@/lib/data/blog-compare-constants";

describe("HomeCompareCTA blog hub path (ROO-46)", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
  });

  it("links the primary button and chips to live /compare pages and records the click", () => {
    const { container } = render(
      <HomeCompareCTA
        variant="solid"
        showTrending={false}
        primarySlug="amazon-vs-best-buy"
        primaryTitle="Amazon vs Best Buy"
        chips={[
          { slug: "messi-vs-ronaldo", label: "Messi vs Ronaldo" },
          { slug: "iphone-17-vs-samsung-s26", label: "iPhone vs Samsung" },
        ]}
        source={BLOG_HUB_COMPARE_SOURCE}
        softHref="/search"
      />,
    );
    const view = within(container);

    const primary = view.getByRole("link", { name: /Compare now/i });
    expect(primary).toHaveAttribute(
      "href",
      "/compare/amazon-vs-best-buy?source_page=blog-hub",
    );
    fireEvent.click(primary);
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
      "blog-hub",
      "amazon-vs-best-buy",
    );

    const chip = view.getByRole("link", { name: /Messi vs Ronaldo/i });
    expect(chip).toHaveAttribute(
      "href",
      "/compare/messi-vs-ronaldo?source_page=blog-hub",
    );
    fireEvent.click(chip);
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
      "blog-hub",
      "messi-vs-ronaldo",
    );

    expect(view.queryByRole("link", { name: /^Trending$/i })).toBeNull();
  });

  it("keeps the home trending link when showTrending is left on", () => {
    const { container } = render(
      <HomeCompareCTA
        primarySlug="amazon-vs-best-buy"
        primaryTitle="Amazon vs Best Buy"
      />,
    );
    const trending = within(container).getAllByRole("link", { name: /^Trending$/i });
    expect(trending.length).toBeGreaterThan(0);
    expect(trending[0]).toHaveAttribute("href", "/trending?source_page=home");
  });
});

describe("TrackedCompareLink", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
  });

  it("sends a hub card click to /compare with source_page=blog-hub", () => {
    const { getByRole } = render(
      <TrackedCompareLink slug="macbook-air-vs-macbook-pro" source={BLOG_HUB_COMPARE_SOURCE}>
        Compare: MacBook Air vs MacBook Pro
      </TrackedCompareLink>,
    );
    const link = getByRole("link", { name: /MacBook Air vs MacBook Pro/i });
    expect(link).toHaveAttribute(
      "href",
      "/compare/macbook-air-vs-macbook-pro?source_page=blog-hub",
    );
    fireEvent.click(link);
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
      "blog-hub",
      "macbook-air-vs-macbook-pro",
    );
  });
});
