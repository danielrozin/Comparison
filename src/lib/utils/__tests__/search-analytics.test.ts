/**
 * Site-search events share one id and go through the consent gate.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

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

function clearCookies() {
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (!name) continue;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

function allowAnalytics() {
  document.cookie = `cookie_consent=${encodeURIComponent(
    JSON.stringify({ analytics: true, marketing: false, functional: false }),
  )}; path=/`;
}

describe("search analytics events", () => {
  beforeEach(() => {
    capture.mockClear();
    clearCookies();
    allowAnalytics();
    sessionStorage.clear();
    Object.defineProperty(navigator, "webdriver", { configurable: true, get: () => false });
  });

  it("emits search_submitted, results, clicks, missing pages, and matchup requests", async () => {
    const {
      trackSearchSubmitted,
      trackSearchResultsShown,
      trackSearchResultClicked,
      trackCompareMissingViewed,
      trackMatchupRequested,
      trackSearchPageOpened,
      trackComparisonSearch,
    } = await import("../analytics");

    trackSearchSubmitted({
      search_id: "search-1",
      query_raw: "tecno vs iphone",
      surface: "home",
      parsed: true,
      parsed_slug: "iphone-vs-tecno",
      canonical_slug_exists: false,
      destination: "compare",
      dropdown_result_count: 0,
      source_page: "",
    });
    trackSearchResultsShown({
      search_id: "search-1",
      query_raw: "iphone",
      surface: "overlay",
      result_count: 4,
      top_slugs: ["iphone-17-vs-samsung-s26"],
      latency_ms: 40,
    });
    trackSearchResultClicked({
      search_id: "search-1",
      query_raw: "iphone",
      surface: "overlay",
      slug: "iphone-17-vs-samsung-s26",
      position: 2,
      result_count: 4,
      result_kind: "comparison",
    });
    trackCompareMissingViewed({
      slug: "iphone-vs-tecno",
      canonical_slug: "iphone-vs-tecno",
      mode: "request",
      generation_enabled: false,
      from_search: true,
      search_id: "search-1",
      query_raw: "tecno vs iphone",
      referrer_path: "/",
    });
    trackMatchupRequested({
      slug: "iphone-vs-tecno",
      cta: "request",
      from_search: true,
      search_id: "search-1",
      query_raw: "tecno vs iphone",
    });
    trackSearchPageOpened("blog-hub");
    trackComparisonSearch("osticket", "no_results", 0, "search_page");

    const names = capture.mock.calls.map((call) => call[0]);
    expect(names).toEqual([
      "search_submitted",
      "search_results_shown",
      "search_result_clicked",
      "compare_missing_viewed",
      "matchup_requested",
      "search_page_opened",
      "comparison_search_performed",
    ]);

    expect(capture).toHaveBeenCalledWith(
      "search_submitted",
      expect.objectContaining({
        search_id: "search-1",
        query_raw: "tecno vs iphone",
        query_normalized: "tecno vs iphone",
        surface: "home",
        parsed: true,
        parsed_slug: "iphone-vs-tecno",
        canonical_slug_exists: false,
        destination: "compare",
        word_count: 3,
      }),
    );
    expect(capture).toHaveBeenCalledWith(
      "search_results_shown",
      expect.objectContaining({
        search_id: "search-1",
        surface: "overlay",
        result_count: 4,
        zero_result: false,
        top_slugs: ["iphone-17-vs-samsung-s26"],
      }),
    );
    expect(capture).toHaveBeenCalledWith(
      "search_result_clicked",
      expect.objectContaining({ slug: "iphone-17-vs-samsung-s26", position: 2, surface: "overlay" }),
    );
    expect(capture).toHaveBeenCalledWith(
      "compare_missing_viewed",
      expect.objectContaining({
        slug: "iphone-vs-tecno",
        mode: "request",
        generation_enabled: false,
        from_search: true,
        search_id: "search-1",
      }),
    );
    expect(capture).toHaveBeenCalledWith(
      "comparison_search_performed",
      expect.objectContaining({
        search_term: "osticket",
        result_type: "no_results",
        result_count: 0,
        surface: "search_page",
      }),
    );
  });

  it("keeps comparison_search_performed backward compatible when no count is passed", async () => {
    const { trackComparisonSearch } = await import("../analytics");
    trackComparisonSearch("messi vs ronaldo", "comparison");
    expect(capture).toHaveBeenCalledWith(
      "comparison_search_performed",
      expect.objectContaining({
        search_term: "messi vs ronaldo",
        result_type: "comparison",
        result_count: 0,
      }),
    );
    const props = capture.mock.calls.at(-1)?.[1] as { surface?: string };
    expect(props.surface).toBeUndefined();
  });

  it("does not send search events before analytics consent", async () => {
    clearCookies();
    document.cookie = "consent_region=eu; path=/";
    const { trackSearchSubmitted } = await import("../analytics");
    trackSearchSubmitted({
      search_id: "search-2",
      query_raw: "osticket",
      surface: "url",
      parsed: false,
      parsed_slug: null,
      canonical_slug_exists: false,
      destination: "search_page",
      dropdown_result_count: 0,
    });
    expect(capture).not.toHaveBeenCalled();
  });

  it("reuses one search id for the same query after it is stored", async () => {
    const { normalizeQuery, rememberSearch, searchIdFor } = await import("@/lib/search/search-session");
    expect(normalizeQuery("  Messi   x   Ronaldo ")).toBe("messi x ronaldo");
    const id = searchIdFor("messi x ronaldo");
    rememberSearch({
      search_id: id,
      query_raw: "messi x ronaldo",
      query_normalized: "messi x ronaldo",
      surface: "home",
    });
    expect(searchIdFor("Messi x Ronaldo")).toBe(id);
  });
});
