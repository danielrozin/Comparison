/**
 * ROO-132 — escape links use the existing compare and pricing helpers.
 */
import { fireEvent, render, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const trackRelatedComparisonClick = vi.fn();
const trackPricingCtaClick = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackRelatedComparisonClick: (...args: unknown[]) => trackRelatedComparisonClick(...args),
  trackPricingCtaClick: (...args: unknown[]) => trackPricingCtaClick(...args),
}));

import { CustomCompareEscapes } from "../CustomCompareEscapes";

const links = [
  { slug: "iphone-17-vs-samsung-s26", label: "iPhone 17 vs Samsung Galaxy S26" },
  { slug: "usa-vs-china", label: "USA vs China" },
  { slug: "mac-vs-windows", label: "Mac vs Windows" },
];

describe("CustomCompareEscapes", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
    trackPricingCtaClick.mockClear();
  });

  it("links live compares with source_page and records the click", () => {
    const { container } = render(<CustomCompareEscapes links={links} />);
    const view = within(container);

    expect(view.getByRole("navigation", { name: "Popular comparisons" })).toBeTruthy();
    expect(view.queryByText(/24 hours/i)).toBeNull();
    expect(view.getByText(/2 custom comparison requests a month/i)).toBeTruthy();

    for (const link of links) {
      const anchor = view.getByRole("link", { name: link.label });
      expect(anchor).toHaveAttribute(
        "href",
        `/compare/${link.slug}?source_page=%2Fcustom-compare`,
      );
      fireEvent.click(anchor);
      expect(trackRelatedComparisonClick).toHaveBeenCalledWith("/custom-compare", link.slug);
    }
  });

  it("explains Pro and fires pricing_cta_click with source_page on the href", () => {
    const { container } = render(<CustomCompareEscapes links={links} tone="onDark" />);
    const pricing = within(container).getByRole("link", { name: "See Pro pricing" });

    expect(pricing).toHaveAttribute(
      "href",
      "/pricing?src=custom-compare&placement=custom-compare&source_page=%2Fcustom-compare",
    );
    fireEvent.click(pricing);
    expect(trackPricingCtaClick).toHaveBeenCalledWith("custom-compare", "custom-compare");
  });

  it("still offers pricing when no comparison is live", () => {
    const { container } = render(<CustomCompareEscapes links={[]} />);
    const view = within(container);
    expect(view.queryByRole("navigation", { name: "Popular comparisons" })).toBeNull();
    expect(view.getByRole("link", { name: "See Pro pricing" })).toBeTruthy();
  });
});
