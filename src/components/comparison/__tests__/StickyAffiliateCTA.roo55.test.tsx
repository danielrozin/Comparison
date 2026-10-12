/**
 * ROO-55 — sticky affiliate bar shows after ~150px, not after the verdict
 * leaves the viewport, and reports placement=sticky.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, render, fireEvent, within } from "@testing-library/react";
import type { ComparisonEntityData } from "@/types";

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

import {
  STICKY_AFFILIATE_SHOW_AFTER_PX,
  StickyAffiliateCTA,
} from "../StickyAffiliateCTA";

const entity: ComparisonEntityData = {
  id: "iphone",
  slug: "iphone-17",
  name: "iPhone 17",
  shortDesc: null,
  imageUrl: null,
  entityType: "product",
  position: 0,
  pros: [],
  cons: [],
  bestFor: null,
  affiliateLinks: [
    {
      url: "https://www.amazon.com/s?k=iphone",
      partner: "amazon",
      label: "Shop iPhone",
    },
  ],
};

function setScrollY(value: number) {
  act(() => {
    Object.defineProperty(window, "scrollY", {
      value,
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event("scroll"));
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  trackAffiliateClick.mockClear();
  trackEvent.mockClear();
  sessionStorage.clear();
  setScrollY(0);
  Object.defineProperty(window, "innerWidth", {
    value: 1280,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("StickyAffiliateCTA first-scroll", () => {
  it("stays hidden until the visitor scrolls past the threshold", () => {
    const { container } = render(
      <StickyAffiliateCTA entities={[entity]} category="technology" slug="iphone-17-vs-samsung-s26" />,
    );
    const bar = within(container).getByRole("region", { name: "Comparison purchase options" });
    expect(bar).toHaveAttribute("data-visible", "false");
    expect(STICKY_AFFILIATE_SHOW_AFTER_PX).toBe(150);

    setScrollY(149);
    expect(bar).toHaveAttribute("data-visible", "false");

    setScrollY(150);
    expect(bar).toHaveAttribute("data-visible", "true");
  });

  it("records placement=sticky and keeps the sticky_cta source", () => {
    const { container } = render(
      <StickyAffiliateCTA entities={[entity]} category="technology" slug="iphone-17-vs-samsung-s26" />,
    );
    setScrollY(180);
    fireEvent.click(within(container).getByRole("link", { name: /iPhone 17/ }));

    expect(trackAffiliateClick).toHaveBeenCalledWith(
      "iPhone 17",
      "sticky",
      "iphone-17-vs-samsung-s26",
      expect.objectContaining({
        source: "sticky_cta",
        cta_type: "affiliate",
        partner: "amazon",
      }),
    );
  });

  it("does not cover the next-step block when the cookie banner is on screen", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 390,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 667,
      writable: true,
      configurable: true,
    });
    const block = document.createElement("div");
    block.id = "compare-under-verdict";
    const banner = document.createElement("div");
    banner.setAttribute("aria-label", "Cookie consent");
    document.body.append(block, banner);
    vi.spyOn(block, "getBoundingClientRect").mockReturnValue({
      top: 100,
      bottom: 360,
      left: 0,
      right: 390,
      width: 390,
      height: 260,
      x: 0,
      y: 100,
      toJSON() {
        return {};
      },
    });
    vi.spyOn(banner, "getBoundingClientRect").mockReturnValue({
      top: 413,
      bottom: 667,
      left: 0,
      right: 390,
      width: 390,
      height: 254,
      x: 0,
      y: 413,
      toJSON() {
        return {};
      },
    });

    const { container } = render(
      <StickyAffiliateCTA entities={[entity]} category="technology" slug="iphone-17-vs-samsung-s26" />,
    );
    setScrollY(200);
    const bar = within(container).getByRole("region", { name: "Comparison purchase options" });
    expect(bar).toHaveAttribute("data-visible", "false");
    expect(bar).toHaveStyle({ bottom: "254px" });

    block.remove();
    banner.remove();
  });

  it("sits above a compact 65px cookie bar on a phone", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 390,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 667,
      writable: true,
      configurable: true,
    });
    const block = document.createElement("div");
    block.id = "compare-under-verdict";
    const banner = document.createElement("div");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.setAttribute("data-cookie-bar", "compact");
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Mobile bottom navigation");
    document.body.append(block, banner, nav);
    vi.spyOn(block, "getBoundingClientRect").mockReturnValue({
      top: 40,
      bottom: 160,
      left: 0,
      right: 390,
      width: 390,
      height: 120,
      x: 0,
      y: 40,
      toJSON() {
        return {};
      },
    });
    // ROO-81 compact phone bar: h-16 (64px) plus a 1px border, at the viewport bottom.
    vi.spyOn(banner, "getBoundingClientRect").mockReturnValue({
      top: 602,
      bottom: 667,
      left: 0,
      right: 390,
      width: 390,
      height: 65,
      x: 0,
      y: 602,
      toJSON() {
        return {};
      },
    });
    vi.spyOn(nav, "getBoundingClientRect").mockReturnValue({
      top: 611,
      bottom: 667,
      left: 0,
      right: 390,
      width: 390,
      height: 56,
      x: 0,
      y: 611,
      toJSON() {
        return {};
      },
    });

    const { container } = render(
      <StickyAffiliateCTA entities={[entity]} category="technology" slug="iphone-17-vs-samsung-s26" />,
    );
    setScrollY(180);
    const bar = within(container).getByRole("region", { name: "Comparison purchase options" });
    expect(bar).toHaveAttribute("data-visible", "true");
    expect(bar).toHaveStyle({ bottom: "65px" });

    block.remove();
    banner.remove();
    nav.remove();
  });
});
