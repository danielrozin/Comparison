/**
 * ROO-48 — hydrated compare pages still call the shared comparison-view
 * helper. Client navigations never re-run instrumentation-client, so this
 * effect is the fire path for the second compare in a session.
 */
import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const trackComparisonView = vi.fn();
const trackConversionFunnel = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackComparisonView: (...args: unknown[]) => trackComparisonView(...args),
  trackConversionFunnel: (...args: unknown[]) => trackConversionFunnel(...args),
}));

vi.mock("posthog-js", () => ({
  default: { capture: vi.fn() },
}));

import { ConversionFunnelTracker } from "../ConversionFunnelTracker";

describe("ConversionFunnelTracker", () => {
  beforeEach(() => {
    trackComparisonView.mockClear();
    trackConversionFunnel.mockClear();
  });

  it.each([
    ["figma-vs-sketch", "design"],
    ["canva-vs-photoshop", "design"],
    ["chatgpt-vs-gemini", "technology"],
    ["youtube-music-vs-soundcloud", "music"],
  ])("fires the comparison view for /compare/%s on mount", (slug, category) => {
    const view = render(<ConversionFunnelTracker slug={slug} category={category} />);

    expect(trackComparisonView).toHaveBeenCalledTimes(1);
    expect(trackComparisonView).toHaveBeenCalledWith(slug, category);
    expect(trackConversionFunnel).toHaveBeenCalledWith(
      "page_view",
      `/compare/${slug}`,
      { category },
    );

    view.unmount();
  });
});
