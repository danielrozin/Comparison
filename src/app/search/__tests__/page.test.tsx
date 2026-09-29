import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const state = vi.hoisted(() => ({ q: "osticket" }));
const trackComparisonSearch = vi.hoisted(() => vi.fn());
const trackSearchParsed = vi.hoisted(() => vi.fn());
const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams({ q: state.q }),
  useRouter: () => ({ push: vi.fn(), replace }),
}));

vi.mock("@/lib/utils/analytics", () => ({
  trackComparisonSearch: (...args: unknown[]) => trackComparisonSearch(...args),
  trackSearchParsed: (...args: unknown[]) => trackSearchParsed(...args),
}));

vi.mock("@/lib/utils/recently-viewed", () => ({
  saveSearchContext: vi.fn(),
}));

import SearchPage from "../page";

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
    trackComparisonSearch.mockClear();
    trackSearchParsed.mockClear();
    replace.mockClear();
    installFetch({ results: [] });
  });

  it("renders a no-exact-match state instead of throwing when nothing matches", async () => {
    render(<SearchPage />);

    expect(await screen.findByRole("heading", { name: /No exact match for “osticket”/ })).toBeInTheDocument();
    expect(screen.getByText("osticket", { selector: "span" })).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: /iPhone vs Android/ })).toHaveAttribute(
      "href",
      "/compare/iphone-vs-android",
    );
    expect(screen.getByText(/we'll create that comparison/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create this comparison" })).not.toBeInTheDocument();
    await waitFor(() => {
      expect(trackSearchParsed).toHaveBeenCalledWith("osticket", null, false);
    });
    // FAQ used to index the breadcrumb node and crash the whole page.
    expect(screen.getByText("How does search work on A Versus B?")).toBeInTheDocument();
    await waitFor(() => {
      expect(trackComparisonSearch).toHaveBeenCalledWith("osticket", "no_results");
    });
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("keeps the raw query, including spaces, in the no-match heading", async () => {
    state.q = "Porn star";
    render(<SearchPage />);
    expect(await screen.findByRole("heading", { name: /No exact match for “Porn star”/ })).toBeInTheDocument();
  });

  it("shows the same no-match state when search fails, and still records the search", async () => {
    installFetch({ fail: true });
    render(<SearchPage />);
    expect(await screen.findByRole("heading", { name: /No exact match for “osticket”/ })).toBeInTheDocument();
    await waitFor(() => {
      expect(trackComparisonSearch).toHaveBeenCalledWith("osticket", "no_results");
    });
  });

  it("lists matches without the no-match heading", async () => {
    installFetch({
      results: [{ slug: "os-ticket-vs-zendesk", title: "osTicket vs Zendesk", category: "software" }],
    });
    render(<SearchPage />);
    expect(await screen.findByRole("link", { name: /osTicket vs Zendesk/ })).toHaveAttribute(
      "href",
      "/compare/os-ticket-vs-zendesk?from=osticket",
    );
    expect(screen.queryByRole("heading", { name: /No exact match/ })).not.toBeInTheDocument();
    await waitFor(() => {
      expect(trackComparisonSearch).toHaveBeenCalledWith("osticket", "results");
    });
  });

  it("sends a two-entity query straight to the canonical comparison", async () => {
    state.q = "Vietnam vs Thailand";
    render(<SearchPage />);
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/compare/thailand-vs-vietnam");
    });
    expect(trackSearchParsed).toHaveBeenCalledWith("Vietnam vs Thailand", "thailand-vs-vietnam", true);
  });
});
