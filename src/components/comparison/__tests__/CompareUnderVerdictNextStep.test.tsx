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
const trackAffiliateCtaViewed = vi.fn();
const trackEvent = vi.fn();
const capture = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackAffiliateClick: (...args: unknown[]) => trackAffiliateClick(...args),
  trackAffiliateCtaViewed: (...args: unknown[]) => trackAffiliateCtaViewed(...args),
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
  trackAffiliateCtaViewed.mockReset();
  trackAffiliateCtaViewed.mockReturnValue(true);
  trackEvent.mockClear();
  capture.mockClear();
});

function visibleObserver() {
  class Observer {
    private readonly callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe() {
      const entry = { isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry;
      this.callback([entry], this as unknown as IntersectionObserver);
      this.callback([entry], this as unknown as IntersectionObserver);
    }
    unobserve() {}
    disconnect() {}
  }
  return Observer as unknown as typeof IntersectionObserver;
}

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

    const links = within(container).getAllByRole("link", { name: /Check Price/ });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "https://www.amazon.com/s?k=iphone");
    expect(links[0].className).toContain("w-full sm:w-auto");
    expect(container.querySelector("[data-early-commerce]")).toHaveAttribute("data-early-commerce", "true");
    expect(container).toHaveTextContent("As an Amazon Associate I earn from qualifying purchases.");
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
    expect(container.querySelector("[data-early-commerce]")).toHaveAttribute("data-early-commerce", "false");
    expect(container).not.toHaveTextContent("As an Amazon Associate");
  });

  it("keeps a brand homepage on the compact row and does not add an Amazon shop", () => {
    const { container } = render(
      <CompareUnderVerdictNextStep
        slug="nvidia-vs-amd"
        chips={[]}
        entities={[
          entity("Nvidia", "generic", "https://www.google.com/search?q=Nvidia"),
          entity("Canva", "brand", "https://www.canva.com"),
        ]}
      />,
    );

    expect(within(container).queryByRole("link", { name: /Check Price/ })).toBeNull();
    expect(within(container).getByRole("link", { name: /Official Site — Canva/ })).toHaveAttribute(
      "href",
      "https://www.canva.com",
    );
    expect(container.querySelector("[data-early-commerce]")).toHaveAttribute("data-early-commerce", "false");
    expect(container).not.toHaveTextContent("As an Amazon Associate");
  });

  it("keeps another Amazon compare on the compact row", () => {
    const { container } = render(
      <CompareUnderVerdictNextStep
        slug="sony-vs-bose"
        chips={[]}
        entities={[entity("Sony", "amazon", "https://www.amazon.com/s?k=sony")]}
      />,
    );
    const link = within(container).getByRole("link", { name: /Check Price/ });
    expect(link.className).not.toContain("w-full sm:w-auto");
    expect(container.querySelector("[data-early-commerce]")).toHaveAttribute("data-early-commerce", "false");
    expect(container).not.toHaveTextContent("As an Amazon Associate");
  });

  it("records one under-verdict exposure when half the shop row is on screen", () => {
    const previous = window.IntersectionObserver;
    window.IntersectionObserver = visibleObserver();
    const { unmount } = render(
      <CompareUnderVerdictNextStep
        slug="ps5-vs-xbox-series-x"
        chips={[]}
        entities={[
          entity("PlayStation 5", "amazon", "https://www.amazon.com/s?k=ps5"),
          entity("Xbox Series X", "amazon", "https://www.amazon.com/s?k=xbox"),
        ]}
      />,
    );

    expect(trackAffiliateCtaViewed).toHaveBeenCalledTimes(1);
    expect(trackAffiliateCtaViewed).toHaveBeenCalledWith("under-verdict", "ps5-vs-xbox-series-x", {
      link_count: 2,
      early_commerce: 1,
    });
    unmount();
    window.IntersectionObserver = previous;
  });

  it("tries again when the first on-screen pass is not recorded", () => {
    trackAffiliateCtaViewed.mockReturnValueOnce(false).mockReturnValueOnce(true);
    const previous = window.IntersectionObserver;
    window.IntersectionObserver = visibleObserver();
    render(
      <CompareUnderVerdictNextStep
        slug="ps5-vs-xbox-series-x"
        chips={[]}
        entities={[entity("PlayStation 5", "amazon", "https://www.amazon.com/s?k=ps5")]}
      />,
    );
    expect(trackAffiliateCtaViewed).toHaveBeenCalledTimes(2);
    window.IntersectionObserver = previous;
  });

  it("does not record exposure for a next-compare fallback", () => {
    const previous = window.IntersectionObserver;
    window.IntersectionObserver = visibleObserver();
    render(
      <CompareUnderVerdictNextStep slug="lebron-vs-jordan" chips={[]} entities={[]} />,
    );
    expect(trackAffiliateCtaViewed).not.toHaveBeenCalled();
    window.IntersectionObserver = previous;
  });
});
