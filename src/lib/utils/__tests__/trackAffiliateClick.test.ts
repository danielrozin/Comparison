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
});
