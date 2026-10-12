/**
 * ROO-54 — pricing_viewed fires with $pageview, before React hydration,
 * on /pricing. The hydrated tracker does not double-count that same load.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeEach, vi } from "vitest";

const capture = vi.fn();
const gtag = vi.fn();

vi.mock("posthog-js", () => ({
  default: {
    capture: (...args: unknown[]) => capture(...args),
    identify: vi.fn(),
    get_distinct_id: () => "ph_test",
  },
}));

vi.mock("@/lib/services/clarity-service", () => ({
  tagComparisonView: vi.fn(),
  tagSearchQuery: vi.fn(),
  tagExperimentVariant: vi.fn(),
  tagUserAction: vi.fn(),
  tagEngagement: vi.fn(),
}));

import {
  capturePricingViewed,
  capturePricingViewedFromLocation,
  isPricingPath,
  normalizePricingSrc,
  readPricingSrc,
  resetPricingViewCaptureForTests,
} from "../pricing-view-capture";

describe("pricing_viewed early fire path (ROO-54)", () => {
  beforeEach(() => {
    capture.mockClear();
    gtag.mockClear();
    resetPricingViewCaptureForTests();
    window.history.pushState({}, "", "/");
    window.gtag = gtag;
  });

  it("reads src from the pricing URL and ignores the thanks page", () => {
    expect(isPricingPath("/pricing")).toBe(true);
    expect(isPricingPath("/pricing/")).toBe(true);
    expect(isPricingPath("/pricing?src=blog")).toBe(true);
    expect(isPricingPath("/pricing/thanks")).toBe(false);
    expect(isPricingPath("/blog")).toBe(false);
    expect(normalizePricingSrc("  blog  ")).toBe("blog");
    expect(normalizePricingSrc("")).toBe("direct");
    expect(normalizePricingSrc(null)).toBe("direct");
    expect(readPricingSrc("?src=compare-japan-vs-china")).toBe("compare-japan-vs-china");
    expect(readPricingSrc("")).toBe("direct");
  });

  it("captures pricing_viewed for /pricing before hydration", () => {
    window.history.pushState({}, "", "/pricing?src=blog-how-to-get-a-cashiers-check");

    expect(capturePricingViewedFromLocation()).toBe(true);

    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith(
      "pricing_viewed",
      { src: "blog-how-to-get-a-cashiers-check" },
      { send_instantly: true },
    );
  });

  it("uses direct when the pricing URL has no src", () => {
    window.history.pushState({}, "", "/pricing");

    expect(capturePricingViewedFromLocation()).toBe(true);
    expect(capture).toHaveBeenCalledWith(
      "pricing_viewed",
      { src: "direct" },
      { send_instantly: true },
    );
  });

  it("does not capture on other documents", () => {
    window.history.pushState({}, "", "/pricing/thanks?session_id=cs_test");
    expect(capturePricingViewedFromLocation()).toBe(false);

    window.history.pushState({}, "", "/blog");
    expect(capturePricingViewedFromLocation()).toBe(false);
    expect(capture).not.toHaveBeenCalled();
  });

  it("skips the hydrated duplicate, then records a later visit", async () => {
    window.history.pushState({}, "", "/pricing?src=header");
    const { trackPricingViewed } = await import("@/lib/utils/analytics");

    expect(capturePricingViewedFromLocation()).toBe(true);
    trackPricingViewed("header");

    const first = capture.mock.calls.filter((call) => call[0] === "pricing_viewed");
    expect(first).toHaveLength(1);
    expect(first[0]?.[2]).toEqual({ send_instantly: true });
    expect(gtag).toHaveBeenCalledWith("event", "pricing_viewed", { src: "header" });

    trackPricingViewed("header");
    const again = capture.mock.calls.filter((call) => call[0] === "pricing_viewed");
    expect(again).toHaveLength(2);
    expect(again[1]?.[1]).toEqual({ src: "header" });
  });

  it("still captures from the hydrated tracker when the bootstrap did not run", async () => {
    const { trackPricingViewed } = await import("@/lib/utils/analytics");

    trackPricingViewed("compare-japan-vs-china");

    expect(capture).toHaveBeenCalledWith(
      "pricing_viewed",
      { src: "compare-japan-vs-china" },
      undefined,
    );
  });

  it("does not let the bootstrap skip a different src", () => {
    window.history.pushState({}, "", "/pricing?src=blog");
    expect(capturePricingViewedFromLocation()).toBe(true);

    expect(capturePricingViewed("footer")).toBe(true);
    expect(capture.mock.calls.map((call) => call[1])).toEqual([
      { src: "blog" },
      { src: "footer" },
    ]);
  });

  it("is armed in the PostHog bootstrap, after init, not only in the pricing chunk", () => {
    const source = readFileSync(path.resolve(process.cwd(), "instrumentation-client.ts"), "utf8");
    const initAt = source.indexOf("posthog.init");
    const captureAt = source.indexOf("capturePricingViewedFromLocation()");
    expect(initAt).toBeGreaterThan(-1);
    expect(captureAt).toBeGreaterThan(initAt);
  });
});
