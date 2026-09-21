/**
 * ROO-41 — Client monetization helpers fire PostHog cancel / thanks events.
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

describe("monetization client events (ROO-41)", () => {
  beforeEach(() => {
    capture.mockClear();
    gtag.mockClear();
    window.gtag = gtag;
  });

  it("captures checkout_canceled with src", async () => {
    const { trackCheckoutCanceled } = await import("../analytics");

    trackCheckoutCanceled("header");

    expect(capture).toHaveBeenCalledWith("checkout_canceled", { src: "header" });
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "checkout_canceled",
      expect.objectContaining({ src: "header" }),
    );
  });

  it("captures checkout_thanks_viewed with optional session id", async () => {
    const { trackCheckoutThanksViewed } = await import("../analytics");

    trackCheckoutThanksViewed("cs_test_123");

    expect(capture).toHaveBeenCalledWith("checkout_thanks_viewed", {
      stripe_session_id: "cs_test_123",
    });
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "checkout_thanks_viewed",
      expect.objectContaining({ stripe_session_id: "cs_test_123" }),
    );
  });

  it("captures checkout_thanks_viewed without a session id", async () => {
    const { trackCheckoutThanksViewed } = await import("../analytics");

    trackCheckoutThanksViewed();

    expect(capture).toHaveBeenCalledWith("checkout_thanks_viewed", {});
  });
});
