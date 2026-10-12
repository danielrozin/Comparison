/**
 * ROO-83 — trackEvent mirrors GA events to PostHog, but only when analytics
 * consent allows it, and never for events a call site already captures.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

const capture = vi.fn();
const gtag = vi.fn();

vi.mock("posthog-js", () => ({
  default: {
    capture: (...args: unknown[]) => capture(...args),
    identify: vi.fn(),
    get_distinct_id: () => "distinct-test",
  },
}));

vi.mock("@/lib/services/clarity-service", () => ({
  tagComparisonView: vi.fn(),
  tagSearchQuery: vi.fn(),
  tagExperimentVariant: vi.fn(),
  tagUserAction: vi.fn(),
  tagEngagement: vi.fn(),
}));

function clearCookies() {
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (!name) continue;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

describe("trackEvent PostHog mirror (ROO-83)", () => {
  beforeEach(() => {
    capture.mockClear();
    gtag.mockClear();
    window.gtag = gtag;
    clearCookies();
  });

  it("sends generic_cta_click to PostHog with the same name and properties", async () => {
    const { trackEvent } = await import("../analytics");
    const props = {
      product: "Cristiano Ronaldo",
      position: "left",
      page: "messi-vs-ronaldo",
      placement: "sticky_cta",
    };

    trackEvent("generic_cta_click", props);

    expect(gtag).toHaveBeenCalledWith("event", "generic_cta_click", props);
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith("generic_cta_click", props);
  });

  it("does not capture before analytics consent is granted", async () => {
    setCookie("consent_region", "eu");
    const { trackEvent } = await import("../analytics");

    trackEvent("generic_cta_click", { product: "Claude", position: "left", page: "chatgpt-vs-claude" });

    expect(gtag).toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
  });

  it("does not capture when analytics cookies were rejected", async () => {
    setCookie(
      "cookie_consent",
      JSON.stringify({ analytics: false, marketing: false, functional: false }),
    );
    const { trackEvent } = await import("../analytics");

    trackEvent("generic_cta_click", { product: "Claude", position: "right", page: "chatgpt-vs-claude" });

    expect(capture).not.toHaveBeenCalled();
  });

  it("captures after the visitor accepts analytics", async () => {
    setCookie(
      "cookie_consent",
      JSON.stringify({ analytics: true, marketing: false, functional: false }),
    );
    const { trackEvent } = await import("../analytics");

    trackEvent("embed_cta_click", { comparison_slug: "figma-vs-sketch", page: "/compare/figma-vs-sketch" });

    expect(capture).toHaveBeenCalledWith("embed_cta_click", {
      comparison_slug: "figma-vs-sketch",
      page: "/compare/figma-vs-sketch",
    });
  });

  it("does not duplicate events that already call posthog.capture", async () => {
    const { trackAffiliateClick, trackCheckoutClicked, trackPricingCtaClick, trackPricingViewed, trackComparisonView } =
      await import("../analytics");

    trackAffiliateClick("Sony", "hero_cta", "sony-vs-bose");
    trackPricingCtaClick("compare-figma-vs-sketch", "soft-line");
    trackCheckoutClicked("pro", "year", "header");
    trackPricingViewed("header");
    trackComparisonView("figma-vs-sketch", "design");

    const names = capture.mock.calls.map((call) => call[0]);
    expect(names.filter((name) => name === "affiliate_click")).toHaveLength(0);
    expect(names.filter((name) => name === "affiliate_link_clicked")).toHaveLength(1);
    expect(names.filter((name) => name === "pricing_cta_click")).toHaveLength(1);
    expect(names.filter((name) => name === "checkout_clicked")).toHaveLength(1);
    expect(names.filter((name) => name === "pricing_viewed")).toHaveLength(1);
    expect(names.filter((name) => name === "comparison_view")).toHaveLength(0);
    expect(names.filter((name) => name === "comparison_viewed")).toHaveLength(1);

    expect(capture).toHaveBeenCalledWith(
      "checkout_clicked",
      { plan: "pro", interval: "year", src: "header" },
      { send_instantly: true, transport: "sendBeacon" },
    );
  });
});
