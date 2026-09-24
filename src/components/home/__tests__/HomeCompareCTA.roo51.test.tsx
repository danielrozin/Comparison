/**
 * ROO-51 — /blog and /trending compare links must be clickable above the
 * cookie banner. The banner is fixed at z-60 and about 362px tall on a phone,
 * so a CTA under the headline (and the old bottom sticky bar at z-40) never
 * receives the tap on a ~667px viewport.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const trackRelatedComparisonClick = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackRelatedComparisonClick: (...args: unknown[]) => trackRelatedComparisonClick(...args),
}));

import { HomeCompareCTA } from "../HomeCompareCTA";

function source(rel: string): string {
  return readFileSync(path.resolve(process.cwd(), rel), "utf8");
}

describe("HomeCompareCTA mobile lead (ROO-51)", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
  });

  it("renders an in-flow compare link and does not pin a bar under the cookie banner", () => {
    const view = render(
      <HomeCompareCTA
        mobileLead
        variant="solid"
        showTrending={false}
        primarySlug="amazon-vs-best-buy"
        primaryTitle="Amazon vs Best Buy"
        chips={[{ slug: "messi-vs-ronaldo", label: "Messi vs Ronaldo" }]}
        source="blog-hub"
        softHref="/search"
      />,
    );

    const lead = within(view.getByTestId("mobile-compare-lead"));
    const primary = lead.getByRole("link", { name: /Compare now/i });
    expect(primary).toHaveAttribute(
      "href",
      "/compare/amazon-vs-best-buy?source_page=blog-hub",
    );
    expect(primary.className).not.toContain("fixed");
    expect(primary.closest("[data-testid='mobile-compare-lead']")?.className).toContain("md:hidden");
    expect(primary.closest("[data-testid='mobile-compare-lead']")?.className).not.toContain("fixed");

    fireEvent.click(primary);
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
      "blog-hub",
      "amazon-vs-best-buy",
    );

    const chip = lead.getByRole("link", { name: /Messi vs Ronaldo/i });
    expect(chip).toHaveAttribute(
      "href",
      "/compare/messi-vs-ronaldo?source_page=blog-hub",
    );
    fireEvent.click(chip);
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
      "blog-hub",
      "messi-vs-ronaldo",
    );

    // The bottom sticky bar sits under the cookie banner (z-40 < z-60).
    expect(view.queryByRole("complementary", { name: "Compare CTA" })).toBeNull();
    view.unmount();
  });

  it("still renders the bottom bar on surfaces that do not opt into the lead", () => {
    const view = render(
      <HomeCompareCTA primarySlug="amazon-vs-best-buy" primaryTitle="Amazon vs Best Buy" />,
    );
    expect(view.getByRole("complementary", { name: "Compare CTA" })).toBeTruthy();
    expect(view.queryByTestId("mobile-compare-lead")).toBeNull();
    view.unmount();
  });
});

describe("hub pages place the compare CTA above the headline (ROO-51)", () => {
  it("puts the blog hub CTA under the breadcrumb and before the title", () => {
    const page = source("src/app/blog/page.tsx");
    const cta = page.indexOf("<HomeCompareCTA");
    const heading = page.indexOf('id="blog-hero-heading"');
    const pricing = page.indexOf('<SoftPricingLine src="blog"');

    expect(cta).toBeGreaterThan(page.indexOf('aria-label="Breadcrumb"'));
    expect(heading).toBeGreaterThan(cta);
    expect(pricing).toBeGreaterThan(heading);
    expect(page).toContain("mobileLead");
    expect(page).toContain('variant="solid"');
    expect(page).toContain("showTrending={false}");
  });

  it("puts the trending CTA under the breadcrumb, with a non-interactive wave", () => {
    const page = source("src/app/trending/page.tsx");
    const cta = page.indexOf("<HomeCompareCTA");
    const heading = page.indexOf('id="trending-hero-heading"');

    expect(cta).toBeGreaterThan(page.indexOf('aria-label="Breadcrumb"'));
    expect(heading).toBeGreaterThan(cta);
    expect(page).toContain("mobileLead");
    expect(page).toContain('variant="solid"');
    expect(page).toContain("showTrending={false}");
    expect(page).toContain("absolute bottom-0 left-0 right-0 pointer-events-none");
  });
});
