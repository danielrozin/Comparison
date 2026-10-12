import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const state = vi.hoisted(() => ({ q: "osticket", surface: "", sourcePage: "" }));
const trackComparisonSearch = vi.hoisted(() => vi.fn());
const trackSearchParsed = vi.hoisted(() => vi.fn());
const trackSearchSubmitted = vi.hoisted(() => vi.fn());
const trackSearchResultsShown = vi.hoisted(() => vi.fn());
const trackSearchResultClicked = vi.hoisted(() => vi.fn());
const trackMatchupRequested = vi.hoisted(() => vi.fn());
const trackSearchPageOpened = vi.hoisted(() => vi.fn());
const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useSearchParams: () => {
    const params = new URLSearchParams({ q: state.q });
    if (state.surface) params.set("surface", state.surface);
    if (state.sourcePage) params.set("source_page", state.sourcePage);
    return params;
  },
  useRouter: () => ({ push: vi.fn(), replace }),
}));

vi.mock("@/lib/utils/analytics", () => ({
  trackComparisonSearch: (...args: unknown[]) => trackComparisonSearch(...args),
  trackSearchParsed: (...args: unknown[]) => trackSearchParsed(...args),
  trackSearchSubmitted: (...args: unknown[]) => trackSearchSubmitted(...args),
  trackSearchResultsShown: (...args: unknown[]) => trackSearchResultsShown(...args),
  trackSearchResultClicked: (...args: unknown[]) => trackSearchResultClicked(...args),
  trackMatchupRequested: (...args: unknown[]) => trackMatchupRequested(...args),
  trackSearchPageOpened: (...args: unknown[]) => trackSearchPageOpened(...args),
}));

vi.mock("@/lib/utils/recently-viewed", () => ({
  saveSearchContext: vi.fn(),
}));

import { SearchContent } from "../search-content";

function installFetch(options: { results?: unknown; fail?: boolean }) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/v1/trending")) {
        return {
          ok: true,
          json: async () => ({
            comparisons: [{ slug: "iphone-vs-android", title: "iPhone vs Android" }],
          }),
        };
      }
      if (options.fail) {
        throw new Error("network down");
      }
      return {
        ok: true,
        json: async () => ({ results: options.results ?? [] }),
      };
    }),
  );
}

describe("Search page (ROO-82)", () => {
  beforeEach(() => {
    state.q = "osticket";
    state.surface = "";
    state.sourcePage = "";
    sessionStorage.clear();
    trackComparisonSearch.mockClear();
    trackSearchParsed.mockClear();
    trackSearchSubmitted.mockClear();
    trackSearchResultsShown.mockClear();
    trackSearchResultClicked.mockClear();
    trackMatchupRequested.mockClear();
    trackSearchPageOpened.mockClear();
    replace.mockClear();
    installFetch({ results: [] });
  });

  it("renders a no-exact-match state instead of throwing when nothing matches", async () => {
    render(<SearchContent generationEnabled={false} />);

    expect(await screen.findByRole("heading", { name: /No exact match for “osticket”/ })).toBeInTheDocument();
    expect(screen.getByText("osticket", { selector: "span" })).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: /iPhone vs Android/ })).toHaveAttribute(
      "href",
      "/compare/iphone-vs-android",
    );
    expect(screen.getByText(/Name something to compare it with/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create this comparison" })).toBeInTheDocument();
    expect(screen.queryByText(/We're building your comparison/i)).not.toBeInTheDocument();
    await waitFor(() => {
      expect(trackSearchParsed).toHaveBeenCalledWith("osticket", null, false);
    });
    // FAQ used to index the breadcrumb node and crash the whole page.
    expect(screen.getByText("How does search work on A Versus B?")).toBeInTheDocument();
    await waitFor(() => {
      expect(trackComparisonSearch).toHaveBeenCalledWith("osticket", "no_results", 0, "search_page");
    });
    expect(trackSearchSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({
        query_raw: "osticket",
        surface: "url",
        parsed: false,
        destination: "search_page",
        canonical_slug_exists: false,
      }),
    );
    expect(trackSearchResultsShown).toHaveBeenCalledWith(
      expect.objectContaining({
        query_raw: "osticket",
        surface: "search_page",
        result_count: 0,
      }),
    );
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("keeps the raw query, including spaces, in the no-match heading", async () => {
    state.q = "Porn star";
    render(<SearchContent generationEnabled={false} />);
    expect(await screen.findByRole("heading", { name: /No exact match for “Porn star”/ })).toBeInTheDocument();
  });

  it("shows the same no-match state when search fails, and still records the search", async () => {
    installFetch({ fail: true });
    render(<SearchContent generationEnabled={false} />);
    expect(await screen.findByRole("heading", { name: /No exact match for “osticket”/ })).toBeInTheDocument();
    await waitFor(() => {
      expect(trackComparisonSearch).toHaveBeenCalledWith("osticket", "no_results", 0, "search_page");
    });
    expect(trackSearchSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({
        query_raw: "osticket",
        surface: "url",
        parsed: false,
        destination: "search_page",
        canonical_slug_exists: false,
      }),
    );
    expect(trackSearchResultsShown).toHaveBeenCalledWith(
      expect.objectContaining({
        query_raw: "osticket",
        surface: "search_page",
        result_count: 0,
      }),
    );
  });

  it("lists matches without the no-match heading", async () => {
    installFetch({
      results: [{ slug: "os-ticket-vs-zendesk", title: "osTicket vs Zendesk", category: "software" }],
    });
    render(<SearchContent generationEnabled={false} />);
    expect(await screen.findByRole("link", { name: /osTicket vs Zendesk/ })).toHaveAttribute(
      "href",
      "/compare/os-ticket-vs-zendesk?from=osticket",
    );
    expect(screen.queryByRole("heading", { name: /No exact match/ })).not.toBeInTheDocument();
    await waitFor(() => {
      expect(trackComparisonSearch).toHaveBeenCalledWith("osticket", "results", 1, "search_page");
    });
  });

  it("promises an on-demand page only when visitor generation is enabled", async () => {
    render(<SearchContent generationEnabled={true} />);
    expect(await screen.findByRole("heading", { name: /No exact match for “osticket”/ })).toBeInTheDocument();
    expect(screen.getByText(/we'll create that comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/We're building your comparison/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create this comparison" })).not.toBeInTheDocument();
  });

  it("sends a two-entity query straight to the canonical comparison", async () => {
    state.q = "Vietnam vs Thailand";
    render(<SearchContent generationEnabled={false} />);
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/compare/thailand-vs-vietnam");
    });
    expect(trackSearchParsed).toHaveBeenCalledWith("Vietnam vs Thailand", "thailand-vs-vietnam", true);
    expect(trackSearchSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({
        query_raw: "Vietnam vs Thailand",
        surface: "url",
        parsed: true,
        parsed_slug: "thailand-vs-vietnam",
        destination: "compare",
      }),
    );
  });

  it("attributes a not-found form submit and an empty landing", async () => {
    state.q = "";
    state.sourcePage = "blog-hub";
    const { unmount } = render(<SearchContent generationEnabled={false} />);
    await waitFor(() => {
      expect(trackSearchPageOpened).toHaveBeenCalledWith("blog-hub");
    });
    expect(trackSearchSubmitted).not.toHaveBeenCalled();
    unmount();

    state.q = "osticket";
    state.surface = "not_found_form";
    state.sourcePage = "";
    sessionStorage.clear();
    render(<SearchContent generationEnabled={false} />);
    await waitFor(() => {
      expect(trackSearchSubmitted).toHaveBeenCalledWith(
        expect.objectContaining({ surface: "not_found_form", query_raw: "osticket" }),
      );
    });
  });
});
