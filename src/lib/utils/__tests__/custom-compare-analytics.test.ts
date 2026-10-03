/**
 * ROO-132 — custom-compare events go to PostHog once, including short visits.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const capture = vi.fn();

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

function allowAnalytics() {
  document.cookie = `cookie_consent=${encodeURIComponent(
    JSON.stringify({ analytics: true, marketing: false, functional: false }),
  )}; path=/`;
}

describe("custom compare analytics", () => {
  beforeEach(() => {
    capture.mockClear();
    document.cookie = "cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    allowAnalytics();
    Object.defineProperty(navigator, "webdriver", { configurable: true, get: () => false });
  });

  it("emits view, gate, and error once with a reason and an instant send", async () => {
    const { trackCustomCompareViewed, trackCustomCompareGated, trackCustomCompareError } = await import(
      "../analytics"
    );

    trackCustomCompareViewed();
    trackCustomCompareGated("upgrade_required");
    trackCustomCompareError("unavailable");

    expect(capture.mock.calls.map((call) => call[0])).toEqual([
      "custom_compare_viewed",
      "custom_compare_gated",
      "custom_compare_error",
    ]);
    expect(capture).toHaveBeenCalledWith(
      "custom_compare_viewed",
      { page: "/custom-compare" },
      { send_instantly: true },
    );
    expect(capture).toHaveBeenCalledWith(
      "custom_compare_gated",
      { page: "/custom-compare", reason: "upgrade_required" },
      { send_instantly: true },
    );
    expect(capture).toHaveBeenCalledWith(
      "custom_compare_error",
      { page: "/custom-compare", reason: "unavailable" },
      { send_instantly: true },
    );
  });
});
