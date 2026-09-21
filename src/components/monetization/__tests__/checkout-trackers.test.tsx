/**
 * ROO-41 — Pricing cancel URL and thanks page fire the client events.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";

const trackPricingViewed = vi.fn();
const trackCheckoutCanceled = vi.fn();
const trackCheckoutThanksViewed = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackPricingViewed: (...args: unknown[]) => trackPricingViewed(...args),
  trackCheckoutCanceled: (...args: unknown[]) => trackCheckoutCanceled(...args),
  trackCheckoutThanksViewed: (...args: unknown[]) => trackCheckoutThanksViewed(...args),
}));

describe("checkout return trackers (ROO-41)", () => {
  beforeEach(() => {
    trackPricingViewed.mockClear();
    trackCheckoutCanceled.mockClear();
    trackCheckoutThanksViewed.mockClear();
  });

  it("fires checkout_canceled when pricing loads with canceled=1", async () => {
    const { PricingViewTracker } = await import("../PricingViewTracker");
    render(<PricingViewTracker src="header" canceled />);

    expect(trackPricingViewed).toHaveBeenCalledWith("header");
    expect(trackCheckoutCanceled).toHaveBeenCalledWith("header");
  });

  it("does not fire checkout_canceled on a normal pricing view", async () => {
    const { PricingViewTracker } = await import("../PricingViewTracker");
    render(<PricingViewTracker src="direct" />);

    expect(trackPricingViewed).toHaveBeenCalledWith("direct");
    expect(trackCheckoutCanceled).not.toHaveBeenCalled();
  });

  it("fires checkout_thanks_viewed on the thanks page", async () => {
    const { CheckoutThanksTracker } = await import("../CheckoutThanksTracker");
    render(<CheckoutThanksTracker sessionId="cs_test_abc" />);

    expect(trackCheckoutThanksViewed).toHaveBeenCalledWith("cs_test_abc");
  });
});
