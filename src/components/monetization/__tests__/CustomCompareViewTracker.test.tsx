/**
 * ROO-132 — /custom-compare records a page view apart from $pageview.
 */
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const trackCustomCompareViewed = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackCustomCompareViewed: () => trackCustomCompareViewed(),
}));

import { CustomCompareViewTracker } from "../CustomCompareViewTracker";

describe("CustomCompareViewTracker", () => {
  beforeEach(() => {
    trackCustomCompareViewed.mockClear();
  });

  it("fires custom_compare_viewed once on mount", () => {
    const { rerender } = render(<CustomCompareViewTracker />);
    rerender(<CustomCompareViewTracker />);
    expect(trackCustomCompareViewed).toHaveBeenCalledTimes(1);
  });
});
