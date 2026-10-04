import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  enrichComparisonData,
  searchTavily,
  searchTavilyDetailed,
  tavilyProviderErrorReason,
} from "@/lib/services/tavily-service";

const hit = {
  url: "https://www.example.com/cambodia",
  title: "Cambodia",
  content: "Cambodia is a country in Southeast Asia.",
  score: 0.9,
};

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: async () => body,
  };
}

describe("searchTavilyDetailed", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns hits when the provider answers with results", async () => {
    vi.stubEnv("TAVILY_API_KEY", "test-key");
    const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<ReturnType<typeof jsonResponse>>>(
      async () => jsonResponse({ results: [hit] }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const outcome = await searchTavilyDetailed("cambodia vs laos");

    expect(outcome).toEqual({ ok: true, results: [hit] });
    expect(await searchTavily("cambodia vs laos")).toEqual([hit]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.api_key).toBe("test-key");
    expect(warn.mock.calls.flat().join(" ")).not.toContain("test-key");
  });

  it("returns an empty ok result when the provider has no hits", async () => {
    vi.stubEnv("TAVILY_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ results: [] })));

    const outcome = await searchTavilyDetailed("cambodia vs laos");

    expect(outcome).toEqual({ ok: true, results: [] });
    expect(await searchTavily("cambodia vs laos")).toEqual([]);
    expect(warn).not.toHaveBeenCalled();
  });

  it("reports a missing key, a non-2xx status, a timeout, and a network error", async () => {
    vi.stubEnv("TAVILY_API_KEY", "");
    vi.stubGlobal("fetch", vi.fn());

    const missing = await searchTavilyDetailed("cambodia vs laos");
    expect(missing).toEqual({ ok: false, results: [], error: { type: "missing_key" } });
    expect(tavilyProviderErrorReason(missing.ok ? { type: "timeout" } : missing.error)).toBe(
      "search_provider_error:missing_key",
    );
    expect(fetch).not.toHaveBeenCalled();
    expect(await searchTavily("cambodia vs laos")).toEqual([]);

    vi.stubEnv("TAVILY_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ error: "unauthorized" }, 401)));
    const denied = await searchTavilyDetailed("cambodia vs laos");
    expect(denied).toEqual({ ok: false, results: [], error: { type: "http", status: 401 } });
    expect(tavilyProviderErrorReason(denied.ok ? { type: "timeout" } : denied.error)).toBe(
      "search_provider_error:401",
    );

    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          const signal = init?.signal;
          const abort = () => reject(new DOMException("The operation was aborted", "AbortError"));
          if (!signal) {
            abort();
            return;
          }
          if (signal.aborted) abort();
          else signal.addEventListener("abort", abort, { once: true });
        });
      }),
    );
    const timedOut = await searchTavilyDetailed("cambodia vs laos", 5, 20);
    expect(timedOut).toEqual({ ok: false, results: [], error: { type: "timeout" } });
    expect(tavilyProviderErrorReason(timedOut.ok ? { type: "network" } : timedOut.error)).toBe(
      "search_provider_error:timeout",
    );

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    const offline = await searchTavilyDetailed("cambodia vs laos");
    expect(offline).toEqual({ ok: false, results: [], error: { type: "network" } });
    expect(tavilyProviderErrorReason(offline.ok ? { type: "timeout" } : offline.error)).toBe(
      "search_provider_error:network",
    );

    expect(warn).toHaveBeenCalled();
    const logged = warn.mock.calls.flat().join(" ");
    expect(logged).not.toContain("test-key");
    expect(logged).not.toContain("TAVILY_API_KEY=");
  });

  it("keeps a provider failure on comparison enrichment instead of pretending the search was empty", async () => {
    vi.stubEnv("TAVILY_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body)) as { query?: string };
        if (String(body.query).includes(" vs ")) return jsonResponse({}, 429);
        if (String(body.query).startsWith("Cambodia")) return jsonResponse({ results: [hit] });
        return jsonResponse({ results: [] });
      }),
    );

    const enrichment = await enrichComparisonData("Cambodia", "Laos", true, { logFailures: false });

    expect(enrichment.providerError).toBe("search_provider_error:429");
    expect(enrichment.sources).toEqual([hit]);
    expect(enrichment.context).toContain("example.com");
    expect(warn).not.toHaveBeenCalled();
  });

  it("leaves providerError null when every search completes with no hits", async () => {
    vi.stubEnv("TAVILY_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ results: [] })));

    const enrichment = await enrichComparisonData("Cambodia", "Laos", true);

    expect(enrichment.providerError).toBeNull();
    expect(enrichment.sources).toEqual([]);
    expect(enrichment.context).toBe("");
  });
});
