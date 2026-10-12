/**
 * ROO-11 — AffiliateButton click wires to trackAffiliateClick (PostHog).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import type { AffiliateLink } from "@/types";

const trackAffiliateClick = vi.fn();
const trackEvent = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackAffiliateClick: (...args: unknown[]) => trackAffiliateClick(...args),
  trackEvent: (...args: unknown[]) => trackEvent(...args),
}));

vi.mock("@/lib/experiments", () => ({
  useExperiment: () => ({ variant: "control" }),
}));

vi.mock("@/lib/hooks/usePaidAffiliateHref", () => ({
  usePaidAffiliateHref: (url: string) => url,
}));

const LINK: AffiliateLink = {
  url: "https://www.amazon.com/s?k=Sony&tag=goldenroz94-20",
  partner: "amazon",
  label: "Shop Sony on Amazon",
};

const GENERIC: AffiliateLink = {
  url: "https://www.google.com/search?q=Sony",
  partner: "generic",
  label: "Learn more about Sony",
};

beforeEach(() => {
  trackAffiliateClick.mockClear();
  trackEvent.mockClear();
  window.history.replaceState({}, "", "/compare/sony-vs-bose");
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("AffiliateButton PostHog wire (ROO-11)", () => {
  it("calls trackAffiliateClick with product, placement, slug, and url", async () => {
    const { AffiliateButton } = await import("../AffiliateButton");
    const { container } = render(
      <AffiliateButton
        link={LINK}
        productName="Sony WH-1000XM5"
        placement="hero_cta"
      />,
    );
    fireEvent.click(within(container).getByRole("link"));

    expect(trackAffiliateClick).toHaveBeenCalledWith(
      "Sony WH-1000XM5",
      "hero_cta",
      "sony-vs-bose",
      expect.objectContaining({
        url: LINK.url,
        partner: "amazon",
        label: LINK.label,
      }),
    );
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("keeps GA generic_cta_click for non-affiliate learn-more CTAs", async () => {
    const { AffiliateButton } = await import("../AffiliateButton");
    const { container } = render(
      <AffiliateButton link={GENERIC} productName="Sony" placement="hero_cta" />,
    );
    fireEvent.click(within(container).getByRole("link"));

    expect(trackAffiliateClick).not.toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalledWith(
      "generic_cta_click",
      expect.objectContaining({
        product: "Sony",
        page: "sony-vs-bose",
        placement: "hero_cta",
      }),
    );
  });
});
