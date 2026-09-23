/**
 * ROO-44 — soft Pro line links to /pricing?src=<lander> and records the click
 * so pricing_viewed can be attributed to the same src.
 */
import { render, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const trackPricingCtaClick = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackPricingCtaClick: (...args: unknown[]) => trackPricingCtaClick(...args),
}));

import { pricingHref, SoftPricingLine } from "../SoftPricingLine";
import { ProUpsellCard } from "../ProUpsellCard";

describe("pricingHref", () => {
  it("tags the lander slug on /pricing", () => {
    expect(pricingHref("blog")).toBe("/pricing?src=blog");
    expect(pricingHref("blog-how-to-get-a-cashiers-check")).toBe(
      "/pricing?src=blog-how-to-get-a-cashiers-check",
    );
    expect(pricingHref("compare-japan-vs-china")).toBe(
      "/pricing?src=compare-japan-vs-china",
    );
    expect(pricingHref("browser-comparison-2026")).toBe(
      "/pricing?src=browser-comparison-2026",
    );
  });

  it("falls back to direct when the src is blank", () => {
    expect(pricingHref("  ")).toBe("/pricing?src=direct");
  });
});

describe("SoftPricingLine", () => {
  beforeEach(() => {
    trackPricingCtaClick.mockClear();
  });

  it("links to the tagged pricing URL and fires pricing_cta_click", () => {
    const { container } = render(
      <SoftPricingLine src="blog-how-to-get-a-cashiers-check" />,
    );
    const link = within(container).getByRole("link", { name: /See Pro pricing/i });

    expect(link).toHaveAttribute(
      "href",
      "/pricing?src=blog-how-to-get-a-cashiers-check",
    );
    fireEvent.click(link);
    expect(trackPricingCtaClick).toHaveBeenCalledWith(
      "blog-how-to-get-a-cashiers-check",
      "soft-line",
    );
  });

  it("keeps a light text link on a dark hero", () => {
    const { container } = render(<SoftPricingLine src="blog" tone="onDark" />);
    const link = within(container).getByRole("link", { name: /See Pro pricing/i });
    expect(link.className).toContain("text-white");
    expect(link).toHaveAttribute("href", "/pricing?src=blog");
  });
});

describe("ProUpsellCard pricing link", () => {
  beforeEach(() => {
    trackPricingCtaClick.mockClear();
  });

  it("keeps compare-{slug} and records the upsell placement", () => {
    const { container } = render(<ProUpsellCard slug="japan-vs-china" />);
    const link = within(container).getByRole("link", { name: /Get your comparison built/i });

    expect(link).toHaveAttribute("href", "/pricing?src=compare-japan-vs-china");
    fireEvent.click(link);
    expect(trackPricingCtaClick).toHaveBeenCalledWith(
      "compare-japan-vs-china",
      "pro-upsell",
    );
  });
});
