/**
 * ROO-47 — /trending compare CTA.
 *
 * The button must open a live /compare page, fire related_comparison_click,
 * and carry ?source_page=trending so ROO-48's bootstrap capture can attach
 * that source onto comparison_viewed. It must not link back to /trending.
 */
import { render, fireEvent, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const trackRelatedComparisonClick = vi.fn();
const capture = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackRelatedComparisonClick: (...args: unknown[]) => trackRelatedComparisonClick(...args),
}));

vi.mock("posthog-js", () => ({
  default: {
    capture: (...args: unknown[]) => capture(...args),
    identify: vi.fn(),
  },
}));

import { HomeCompareCTA } from "../HomeCompareCTA";
import { TRENDING_COMPARE_SOURCE } from "@/lib/data/home-compare-constants";
import {
  captureComparisonViewedFromLocation,
  resetComparisonViewedCaptureForTests,
} from "@/lib/analytics/comparison-view-capture";

const PRIMARY = "messi-vs-ronaldo";
const CHIP = "japan-vs-china";

function renderTrendingCta() {
  return render(
    <HomeCompareCTA
      primarySlug={PRIMARY}
      primaryTitle="Messi vs Ronaldo"
      chips={[{ slug: CHIP, label: "Japan vs China" }]}
      source={TRENDING_COMPARE_SOURCE}
      softHref="/search"
      showTrending={false}
    />,
  );
}

describe("HomeCompareCTA on /trending", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
    capture.mockClear();
    resetComparisonViewedCaptureForTests();
    window.history.pushState({}, "", "/trending");
    document.body.innerHTML = "";
  });

  it("links the primary button and chips to /compare with source_page=trending", () => {
    const view = renderTrendingCta();
    const aside = within(view.getByRole("complementary", { name: "Start a comparison" }));

    const primary = aside.getByRole("link", { name: /Compare now/i });
    expect(primary).toHaveAttribute(
      "href",
      `/compare/${PRIMARY}?source_page=trending`,
    );

    const chip = aside.getByRole("link", { name: /Japan vs China/i });
    expect(chip).toHaveAttribute(
      "href",
      `/compare/${CHIP}?source_page=trending`,
    );

    expect(aside.queryByRole("link", { name: "Trending" })).toBeNull();
    view.unmount();
  });

  it("fires related_comparison_click for the primary compare and a chip", () => {
    const view = renderTrendingCta();
    const aside = within(view.getByRole("complementary", { name: "Start a comparison" }));

    fireEvent.click(aside.getByRole("link", { name: /Compare now/i }));
    fireEvent.click(aside.getByRole("link", { name: /Japan vs China/i }));

    expect(trackRelatedComparisonClick).toHaveBeenNthCalledWith(
      1,
      "trending",
      PRIMARY,
    );
    expect(trackRelatedComparisonClick).toHaveBeenNthCalledWith(2, "trending", CHIP);
    view.unmount();
  });

  it("feeds ROO-48 comparison_viewed from the primary href without a second capture implementation", () => {
    const view = renderTrendingCta();
    const aside = within(view.getByRole("complementary", { name: "Start a comparison" }));
    const href = aside.getByRole("link", { name: /Compare now/i }).getAttribute("href");
    expect(href).toBe(`/compare/${PRIMARY}?source_page=trending`);

    window.history.pushState({}, "", href!);
    const payload = document.createElement("script");
    payload.id = "__NEXT_DATA__";
    payload.type = "application/json";
    payload.textContent = JSON.stringify({
      props: { pageProps: { comparison: { category: "sports" } } },
    });
    document.body.appendChild(payload);

    expect(captureComparisonViewedFromLocation()).toBe(true);
    expect(capture).toHaveBeenCalledWith(
      "comparison_viewed",
      {
        comparison_slug: PRIMARY,
        category: "sports",
        source_page: "trending",
      },
      { send_instantly: true },
    );
    view.unmount();
  });

  it("falls back to search instead of a missing #search box when no compare is live", () => {
    const view = render(
      <HomeCompareCTA
        source={TRENDING_COMPARE_SOURCE}
        softHref="/search"
        showTrending={false}
      />,
    );
    const aside = within(view.getByRole("complementary", { name: "Start a comparison" }));
    expect(aside.getByRole("link", { name: /Start a comparison/i })).toHaveAttribute(
      "href",
      "/search?source_page=trending",
    );
    view.unmount();
  });

  it("still offers the Trending link on home when the flag is left on", () => {
    const view = render(
      <HomeCompareCTA primarySlug={PRIMARY} primaryTitle="Messi vs Ronaldo" />,
    );
    const aside = within(view.getByRole("complementary", { name: "Start a comparison" }));
    expect(aside.getByRole("link", { name: "Trending" })).toHaveAttribute(
      "href",
      "/trending?source_page=home",
    );
    view.unmount();
  });
});
