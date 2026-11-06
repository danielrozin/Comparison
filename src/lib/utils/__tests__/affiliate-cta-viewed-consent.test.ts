/**
 * ROO-387 — affiliate_cta_viewed must not reach Google or PostHog while
 * analytics consent is denied. trackEvent is the wrong path: it pushes
 * gtag/dataLayer before the PostHog check.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const capture = vi.fn();
const posthogState = { loaded: false };

vi.mock("posthog-js", () => ({
  default: {
    capture: (...args: unknown[]) => capture(...args),
    get __loaded() {
      return posthogState.loaded;
    },
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

describe("trackAffiliateCtaViewed consent", () => {
  const gtag = vi.fn();

  beforeEach(() => {
    capture.mockClear();
    gtag.mockClear();
    posthogState.loaded = false;
    clearCookies();
    window.gtag = gtag;
    window.dataLayer = [{ event: "preexisting" }];
  });

  it("does not call or queue any provider when analytics was rejected", async () => {
    setCookie("cookie_consent", JSON.stringify({ analytics: false, marketing: true }));
    const before = window.dataLayer?.slice();
    const { trackAffiliateCtaViewed } = await import("../analytics");

    expect(
      trackAffiliateCtaViewed("under-verdict", "iphone-17-vs-samsung-s26", { link_count: 2 }),
    ).toBe(false);

    expect(gtag).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
    expect(window.dataLayer).toEqual(before);
  });

  it("does not call or queue any provider for an EU visitor who has not chosen", async () => {
    setCookie("consent_region", "eu");
    const before = window.dataLayer?.slice();
    const { trackAffiliateCtaViewed } = await import("../analytics");

    expect(trackAffiliateCtaViewed("under-verdict", "ps5-vs-xbox-series-x")).toBe(false);

    expect(gtag).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
    expect(window.dataLayer).toEqual(before);
  });

  it("does not capture when consent allows but PostHog was not initialized", async () => {
    setCookie("cookie_consent", JSON.stringify({ analytics: true }));
    posthogState.loaded = false;
    const { trackAffiliateCtaViewed } = await import("../analytics");

    expect(trackAffiliateCtaViewed("under-verdict", "iphone-17-vs-samsung-s26")).toBe(false);

    expect(capture).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("captures once the loaded client when analytics is allowed, without Google", async () => {
    setCookie("cookie_consent", JSON.stringify({ analytics: true }));
    posthogState.loaded = true;
    const before = window.dataLayer?.slice();
    const { trackAffiliateCtaViewed } = await import("../analytics");

    expect(
      trackAffiliateCtaViewed("under-verdict", "ps5-vs-xbox-series-x", {
        link_count: 2,
        early_commerce: 1,
      }),
    ).toBe(true);

    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith("affiliate_cta_viewed", {
      placement: "under-verdict",
      page: "ps5-vs-xbox-series-x",
      comparison_slug: "ps5-vs-xbox-series-x",
      link_count: 2,
      early_commerce: 1,
    });
    expect(gtag).not.toHaveBeenCalled();
    expect(window.dataLayer).toEqual(before);
  });
});
