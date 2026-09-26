/**
 * ROO-55 — above-fold next step on /compare.
 * Affiliate clicks keep affiliate_link_clicked props and add placement,
 * src, and source_page. Pages with no real affiliate link use the
 * existing next-compare target and related_comparison_click.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import type { ComparisonEntityData } from "@/types";

const trackAffiliateClick = vi.fn();
const trackEvent = vi.fn();
const capture = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackAffiliateClick: (...args: unknown[]) => trackAffiliateClick(...args),
  trackEvent: (...args: unknown[]) => trackEvent(...args),
}));

vi.mock("posthog-js", () => ({
  default: { capture: (...args: unknown[]) => capture(...args) },
}));

vi.mock("@/lib/hooks/usePaidAffiliateHref", () => ({
  usePaidAffiliateHref: (url: string) => url,
}));

import { CompareUnderVerdictNextStep } from "../CompareUnderVerdictNextStep";

function entity(
  name: string,
  partner: string,
  url: string,
): ComparisonEntityData {
  return {
    id: name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    shortDesc: null,
    imageUrl: null,
    entityType: "product",
    position: 0,
    pros: [],
    cons: [],
    bestFor: null,
    affiliateLinks: [{ url, partner, label: `${partner} ${name}` }],
  };
}

beforeEach(() => {
  trackAffiliateClick.mockClear();
  trackEvent.mockClear();
  capture.mockClear();
});

describe("CompareUnderVerdictNextStep", () => {
  it("fires affiliate_link_clicked props with placement, src, and source_page", () => {
    const { container } = render(
      <CompareUnderVerdictNextStep
        slug="iphone-17-vs-samsung-s26"
        chips={[]}
        entities={[
          entity("iPhone 17", "amazon", "https://www.amazon.com/s?k=iphone"),
          entity("Galaxy S26", "amazon", "https://www.amazon.com/s?k=galaxy"),
        ]}
      />,
    );

    const links = within(container).getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent("Check Price");
    fireEvent.click(links[0]);

    expect(trackAffiliateClick).toHaveBeenCalledWith(
      "iPhone 17",
      "under-verdict",
      "iphone-17-vs-samsung-s26",
      expect.objectContaining({
        src: "compare-iphone-17-vs-samsung-s26",
        source_page: "compare-iphone-17-vs-samsung-s26",
        partner: "amazon",
        cta_type: "affiliate",
      }),
    );
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("falls back to the next-compare target when links are generic", () => {
    const { container } = render(
      <CompareUnderVerdictNextStep
        slug="japan-vs-china"
        chips={[{ slug: "us-vs-china-gdp", label: "US vs China GDP" }]}
        entities={[
          entity("Japan", "generic", "https://www.google.com/search?q=Japan"),
          entity("China", "generic", "https://www.google.com/search?q=China"),
        ]}
      />,
    );

    const link = within(container).getByRole("link", { name: /US vs China GDP/ });
    expect(link).toHaveAttribute(
      "href",
      "/compare/us-vs-china-gdp?source_page=compare-japan-vs-china",
    );
    fireEvent.click(link);

    expect(trackAffiliateClick).not.toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalledWith("related_comparison_click", {
      source_page: "compare-japan-vs-china",
      target_page: "us-vs-china-gdp",
      placement: "under-verdict",
      src: "compare-japan-vs-china",
    });
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith(
      "related_comparison_click",
      expect.objectContaining({
        placement: "under-verdict",
        src: "compare-japan-vs-china",
        source_page: "compare-japan-vs-china",
      }),
    );
  });

  it("uses the trending target when there is no affiliate link and no chip", () => {
    const { container } = render(
      <CompareUnderVerdictNextStep slug="empty-vs-empty" chips={[]} entities={[]} />,
    );
    const link = within(container).getByRole("link", { name: /Browse trending/ });
    expect(link.getAttribute("href")).toContain("/trending?source_page=compare-empty-vs-empty");
  });
});
