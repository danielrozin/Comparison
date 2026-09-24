/**
 * ROO-53 — /blog and /trending show named compare cards above the fold.
 *
 * ROO-51's single "Compare now" button was already under the breadcrumb, and
 * hub → comparison_viewed stayed near 1%. These cards name a real /compare
 * page, sit in normal flow (not the z-40 bar the cookie dialog covers), and
 * keep pointer events so a hero decoration cannot eat the tap.
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

describe("HomeCompareCTA popular cards (ROO-53)", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
  });

  it("renders two in-flow /compare cards and does not pin them under the cookie banner", () => {
    const view = render(
      <HomeCompareCTA
        mobileLead
        popularCards
        variant="solid"
        showTrending={false}
        primarySlug="amazon-vs-best-buy"
        primaryTitle="Amazon vs Best Buy"
        chips={[
          { slug: "messi-vs-ronaldo", label: "Messi vs Ronaldo" },
          { slug: "iphone-17-vs-samsung-s26", label: "iPhone vs Samsung" },
        ]}
        source="blog-hub"
        softHref="/search"
      />,
    );

    const lead = view.getByTestId("mobile-compare-lead");
    expect(lead.className).toContain("md:hidden");
    expect(lead.className).not.toContain("fixed");

    const cards = within(view.getByTestId("popular-compares"));
    const section = view.getByTestId("popular-compares");
    expect(section.className).toContain("pointer-events-auto");
    expect(section.className).toContain("z-10");
    expect(section.className).not.toContain("fixed");

    const primary = cards.getByRole("link", { name: "Compare Amazon vs Best Buy" });
    expect(primary).toHaveAttribute(
      "href",
      "/compare/amazon-vs-best-buy?source_page=blog-hub",
    );
    fireEvent.click(primary);
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
      "blog-hub",
      "amazon-vs-best-buy",
    );

    const second = cards.getByRole("link", { name: "Compare Messi vs Ronaldo" });
    expect(second).toHaveAttribute(
      "href",
      "/compare/messi-vs-ronaldo?source_page=blog-hub",
    );
    expect(cards.queryByRole("link", { name: /iPhone vs Samsung/i })).toBeNull();
    expect(cards.queryByRole("link", { name: /^Trending$/i })).toBeNull();

    // The bottom sticky bar sits under the cookie banner (z-40 < z-60).
    expect(view.queryByRole("complementary", { name: "Compare CTA" })).toBeNull();
    view.unmount();
  });

  it("keeps the single compare button when the hub has no live slug", () => {
    const view = render(
      <HomeCompareCTA
        mobileLead
        popularCards
        showTrending={false}
        softHref="/search"
        source="trending"
      />,
    );
    const lead = within(view.getByTestId("mobile-compare-lead"));
    expect(view.queryByTestId("popular-compares")).toBeNull();
    expect(lead.getByRole("link", { name: /Start a comparison/i })).toHaveAttribute(
      "href",
      "/search?source_page=trending",
    );
    view.unmount();
  });
});

describe("hub pages place popular compare cards above the headline (ROO-53)", () => {
  it("opts the blog hub into popular cards under the breadcrumb", () => {
    const page = source("src/app/blog/page.tsx");
    const cta = page.indexOf("<HomeCompareCTA");
    const popular = page.indexOf("popularCards");
    const heading = page.indexOf('id="blog-hero-heading"');

    expect(popular).toBeGreaterThan(cta);
    expect(heading).toBeGreaterThan(popular);
    expect(cta).toBeGreaterThan(page.indexOf('aria-label="Breadcrumb"'));
    expect(page).toContain("showTrending={false}");
  });

  it("opts the trending hub into popular cards and does not link the hero back to itself", () => {
    const page = source("src/app/trending/page.tsx");
    const cta = page.indexOf("<HomeCompareCTA");
    const popular = page.indexOf("popularCards");
    const heading = page.indexOf('id="trending-hero-heading"');

    expect(popular).toBeGreaterThan(cta);
    expect(heading).toBeGreaterThan(popular);
    expect(cta).toBeGreaterThan(page.indexOf('aria-label="Breadcrumb"'));
    expect(page).toContain("showTrending={false}");
    expect(page).toContain("buildTrendingCompareCta");
  });

  it("leaves article heroes on the single compare lead", () => {
    const page = source("src/app/blog/[slug]/page.tsx");
    expect(page).toContain("mobileLead");
    expect(page).not.toContain("popularCards");
  });
});
