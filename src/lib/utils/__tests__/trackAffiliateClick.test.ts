/**
 * ROO-11 — Affiliate CTAs must fire PostHog `affiliate_link_clicked`
 * via trackAffiliateClick (not only GA trackEvent).
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

const capture = vi.fn();
const gtag = vi.fn();

vi.mock("posthog-js", () => ({
  default: {
    capture: (...args: unknown[]) => capture(...args),
    identify: vi.fn(),
  },
}));

vi.mock("@/lib/services/clarity-service", () => ({
  tagComparisonView: vi.fn(),
  tagSearchQuery: vi.fn(),
  tagExperimentVariant: vi.fn(),
  tagUserAction: vi.fn(),
  tagEngagement: vi.fn(),
}));

describe("trackAffiliateClick", () => {
  beforeEach(() => {
    capture.mockClear();
    gtag.mockClear();
    window.gtag = gtag;
  });

  it("captures affiliate_link_clicked on PostHog with useful props", async () => {
    const { trackAffiliateClick } = await import("../analytics");

    trackAffiliateClick("Sony WH-1000XM5", "hero_cta", "sony-vs-bose", {
      url: "https://www.amazon.com/dp/example?tag=goldenroz94-20",
      partner: "amazon",
      label: "Shop Sony WH-1000XM5 on Amazon",
    });

    expect(capture).toHaveBeenCalledWith(
      "affiliate_link_clicked",
      expect.objectContaining({
        product: "Sony WH-1000XM5",
        position: "hero_cta",
        placement: "hero_cta",
        page: "sony-vs-bose",
        comparison_slug: "sony-vs-bose",
        url: "https://www.amazon.com/dp/example?tag=goldenroz94-20",
        partner: "amazon",
        label: "Shop Sony WH-1000XM5 on Amazon",
      }),
    );

    expect(gtag).toHaveBeenCalledWith(
      "event",
      "affiliate_click",
      expect.objectContaining({
        product: "Sony WH-1000XM5",
        comparison_slug: "sony-vs-bose",
        placement: "hero_cta",
      }),
    );
  });

  // ROO-411: hero / sticky clicks don't pass early_commerce; they inherit the
  // page treatment from the under-verdict row. Explicit values win.
  it("adds early_commerce from the page's under-verdict row", async () => {
    const { trackAffiliateClick } = await import("../analytics");
    document.body.innerHTML = "";
    trackAffiliateClick("RTX 5070", "hero_cta", "rtx-5070-vs-rtx-5060-ti");
    expect(capture).toHaveBeenLastCalledWith(
      "affiliate_link_clicked",
      expect.objectContaining({ early_commerce: 0, comparison_slug: "rtx-5070-vs-rtx-5060-ti" }),
    );

    document.body.innerHTML = '<div data-placement="under-verdict" data-early-commerce="true"></div>';
    trackAffiliateClick("RTX 5070", "sticky_mobile", "rtx-5070-vs-rtx-5060-ti");
    expect(capture).toHaveBeenLastCalledWith(
      "affiliate_link_clicked",
      expect.objectContaining({ early_commerce: 1, placement: "sticky_mobile" }),
    );

    trackAffiliateClick("RTX 5070", "under-verdict", "rtx-5070-vs-rtx-5060-ti", { early_commerce: 0 });
    expect(capture).toHaveBeenLastCalledWith(
      "affiliate_link_clicked",
      expect.objectContaining({ early_commerce: 0 }),
    );
    document.body.innerHTML = "";
  });
});
