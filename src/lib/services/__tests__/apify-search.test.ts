import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  enrichComparisonData,
  SEARCH_PROVIDER,
  searchWeb,
  searchWebDetailed,
  webSearchProviderErrorReason,
} from "@/lib/services/apify-search";
import { apifyFetch } from "@/lib/services/apify-service";
import { searchTavilyDetailed } from "@/lib/services/tavily-service";

const TOKEN = "test-token";

const ragHit = {
  crawl: { httpStatusCode: 200, httpStatusMessage: "OK" },
  searchResult: {
    title: "Cambodia — search result",
    description: "Search snippet that should lose to markdown.",
    url: "https://search.example.com/cambodia",
  },
  metadata: {
    title: "Cambodia",
    description: "A country in Southeast Asia.",
    url: "https://www.example.com/cambodia",
  },
  markdown: "  Cambodia is a country in Southeast Asia.\n\nIt borders Laos.  ",
};

function headerValue(headers: HeadersInit | undefined, name: string): string | null {
  if (!headers) return null;
  if (headers instanceof Headers) return headers.get(name);
  if (Array.isArray(headers)) {
    const found = headers.find(([key]) => key.toLowerCase() === name);
    return found ? found[1] : null;
  }
  const record = headers as Record<string, string>;
  return record[name] ?? record[name.toLowerCase()] ?? null;
}

function jsonResponse(body: unknown, status = 201) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 201 ? "Created" : "Error",
    json: async () => body,
  };
}

describe("Apify web search", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("maps metadata.url, metadata.title, and trimmed markdown", async () => {
    vi.stubEnv("APIFY_API_TOKEN", TOKEN);
    const longMarkdown = `${"word ".repeat(800)}tail`;
    const fetchMock = vi.fn<
      (url: string, init?: RequestInit) => Promise<ReturnType<typeof jsonResponse>>
    >(async () =>
      jsonResponse([
        ragHit,
        {
          "metadata.url": "https://www.example.com/laos",
          "metadata.title": "Laos",
          markdown: longMarkdown,
        },
        { markdown: "no url, dropped" },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const outcome = await searchWebDetailed("cambodia vs laos");

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.results[0]).toEqual({
      url: "https://www.example.com/cambodia",
      title: "Cambodia",
      content: "Cambodia is a country in Southeast Asia. It borders Laos.",
      score: 1,
    });
    expect(outcome.results[1]?.url).toBe("https://www.example.com/laos");
    expect(outcome.results[1]?.title).toBe("Laos");
    expect(outcome.results[1]?.content.length).toBeLessThanOrEqual(2_000);
    expect(outcome.results[1]?.content.endsWith("tail")).toBe(false);
    expect(outcome.results).toHaveLength(2);
    expect(await searchWeb("cambodia vs laos")).toEqual(outcome.results);

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toBe(
      "https://api.apify.com/v2/acts/apify~rag-web-browser/run-sync-get-dataset-items?timeout=16&memory=4096",
    );
    expect(String(url)).not.toContain(TOKEN);
    expect(String(url)).not.toContain("token=");
    expect(headerValue(init?.headers, "authorization")).toBe(`Bearer ${TOKEN}`);
    const body = JSON.parse(String(init?.body));
    expect(body).toMatchObject({
      query: "cambodia vs laos",
      maxResults: 5,
      outputFormats: ["markdown"],
      scrapingTool: "raw-http",
      requestTimeoutSecs: 15,
    });
    expect(JSON.stringify(body)).not.toContain(TOKEN);
    expect(warn.mock.calls.flat().join(" ")).not.toContain(TOKEN);
  });

  it("drops a failed crawl whose only url is a Google redirect and has no markdown", async () => {
    vi.stubEnv("APIFY_API_TOKEN", TOKEN);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse([
          {
            crawl: { httpStatusCode: 500 },
            searchResult: {
              url: "https://www.lonelyplanet.com/articles/cambodia-vs-laos",
              title: "Cambodia vs Laos",
              description: "A travel comparison that was never fetched.",
            },
            metadata: {
              url: "https://www.google.com/goto?url=https%3A%2F%2Fwww.lonelyplanet.com%2Farticles%2Fcambodia-vs-laos",
              title: "Cambodia vs Laos",
            },
          },
          {
            crawl: { httpStatusCode: 200 },
            searchResult: {
              url: "https://www.roughguides.com/cambodia-vs-laos",
              title: "Rough Guides",
            },
            metadata: {
              url: "https://www.google.com/url?q=https://www.roughguides.com/cambodia-vs-laos",
              title: "Cambodia or Laos",
            },
            markdown: "Cambodia and Laos share a border.",
          },
          {
            crawl: { httpStatusCode: 200 },
            searchResult: { url: "https://www.google.com/goto?url=https%3A%2F%2Fexample.com", title: "Nope" },
            metadata: { url: "https://www.google.com/url?q=1", title: "Nope" },
            markdown: "Both links are Google redirects.",
          },
          {
            crawl: { httpStatusCode: 404 },
            searchResult: { url: "https://example.com/missing", title: "Missing" },
            metadata: { url: "https://example.com/missing", title: "Missing" },
            markdown: "The crawler never got this page.",
          },
          {
            crawl: { httpStatusCode: 200 },
            searchResult: {
              url: "https://www.example.com/laos",
              title: "Laos",
              description: "A snippet is not a page.",
            },
            metadata: { url: "https://www.example.com/laos", title: "Laos" },
          },
          {
            crawl: { httpStatusCode: 200 },
            metadata: { url: "https://www.example.com/cambodia", title: "Cambodia" },
            markdown: "Cambodia is a country in Southeast Asia.",
          },
        ]),
      ),
    );

    const outcome = await searchWebDetailed("Cambodia vs Laos travel");

    expect(outcome).toEqual({
      ok: true,
      results: [
        {
          url: "https://www.roughguides.com/cambodia-vs-laos",
          title: "Cambodia or Laos",
          content: "Cambodia and Laos share a border.",
          score: 1,
        },
        {
          url: "https://www.example.com/cambodia",
          title: "Cambodia",
          content: "Cambodia is a country in Southeast Asia.",
          score: 1,
        },
      ],
    });
    const cited = outcome.ok ? outcome.results.map((result) => result.url).join(" ") : "";
    expect(cited).not.toContain("google.com");
  });

  it("treats a non-array success body as a provider error, not as zero hits", async () => {
    vi.stubEnv("APIFY_API_TOKEN", TOKEN);
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ error: "unexpected" })));

    const outcome = await searchWebDetailed("cambodia vs laos");

    expect(outcome).toEqual({ ok: false, results: [], error: { type: "network" } });
    expect(webSearchProviderErrorReason(outcome.ok ? { type: "timeout" } : outcome.error)).toBe(
      "search_provider_error:network",
    );
  });

  it("classifies a 401 as a provider error and does not log the token", async () => {
    vi.stubEnv("APIFY_API_TOKEN", TOKEN);
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ error: "unauthorized" }, 401)));

    const denied = await searchWebDetailed("cambodia vs laos");

    expect(denied).toEqual({ ok: false, results: [], error: { type: "http", status: 401 } });
    expect(webSearchProviderErrorReason(denied.ok ? { type: "timeout" } : denied.error)).toBe(
      "search_provider_error:401",
    );
    expect(warn).toHaveBeenCalledWith(
      `search_provider_error:401 provider=${SEARCH_PROVIDER}`,
    );
    expect(warn.mock.calls.flat().join(" ")).not.toContain(TOKEN);
    expect(warn.mock.calls.flat().join(" ")).not.toContain("APIFY_API_TOKEN=");
  });

  it("reports a missing token without calling the actor", async () => {
    vi.stubEnv("APIFY_API_TOKEN", "   ");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const missing = await searchWebDetailed("cambodia vs laos");

    expect(missing).toEqual({ ok: false, results: [], error: { type: "missing_key" } });
    expect(webSearchProviderErrorReason(missing.ok ? { type: "timeout" } : missing.error)).toBe(
      "search_provider_error:missing_key",
    );
    expect(warn).toHaveBeenCalledWith(
      `search_provider_error:missing_key provider=${SEARCH_PROVIDER}`,
    );
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await searchWeb("cambodia vs laos")).toEqual([]);
  });

  it("classifies an aborted request as a timeout", async () => {
    vi.stubEnv("APIFY_API_TOKEN", TOKEN);
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

    const timedOut = await searchWebDetailed("cambodia vs laos", 5, 20);

    expect(timedOut).toEqual({ ok: false, results: [], error: { type: "timeout" } });
    expect(webSearchProviderErrorReason(timedOut.ok ? { type: "network" } : timedOut.error)).toBe(
      "search_provider_error:timeout",
    );
    expect(warn).toHaveBeenCalledWith(
      `search_provider_error:timeout provider=${SEARCH_PROVIDER}`,
    );
    expect(warn.mock.calls.flat().join(" ")).not.toContain(TOKEN);
  });

  it("keeps a provider failure on comparison enrichment instead of pretending the search was empty", async () => {
    vi.stubEnv("APIFY_API_TOKEN", TOKEN);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body)) as { query?: string };
        if (String(body.query).includes(" vs ")) return jsonResponse({}, 429);
        if (String(body.query).startsWith("Cambodia")) return jsonResponse([ragHit]);
        return jsonResponse([]);
      }),
    );

    const enrichment = await enrichComparisonData("Cambodia", "Laos", true, { logFailures: false });

    const comparisonCall = vi.mocked(fetch).mock.calls.find((call) => {
      const body = JSON.parse(String(call[1]?.body)) as { query?: string };
      return String(body.query).includes(" vs ");
    });
    const comparisonBody = JSON.parse(String(comparisonCall?.[1]?.body)) as { maxResults?: number };
    expect(comparisonBody.maxResults).toBe(5);
    expect(enrichment.providerError).toBe("search_provider_error:429");
    expect(enrichment.sources).toEqual([
      {
        url: "https://www.example.com/cambodia",
        title: "Cambodia",
        content: "Cambodia is a country in Southeast Asia. It borders Laos.",
        score: 1,
      },
    ]);
    expect(enrichment.context).toContain("example.com");
    expect(warn).not.toHaveBeenCalled();
  });

  it("leaves providerError null when every search completes with no hits", async () => {
    vi.stubEnv("APIFY_API_TOKEN", TOKEN);
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse([])));

    const enrichment = await enrichComparisonData("Cambodia", "Laos", true);

    expect(enrichment.providerError).toBeNull();
    expect(enrichment.sources).toEqual([]);
    expect(enrichment.context).toBe("");
  });

  it("legacy tavily-service names call Apify and never Tavily", async () => {
    vi.stubEnv("APIFY_API_TOKEN", TOKEN);
    vi.stubEnv("TAVILY_API_KEY", "should-not-be-sent");
    const fetchMock = vi.fn<
      (url: string, init?: RequestInit) => Promise<ReturnType<typeof jsonResponse>>
    >(async () => jsonResponse([ragHit]));
    vi.stubGlobal("fetch", fetchMock);

    const outcome = await searchTavilyDetailed("cambodia vs laos");

    expect(outcome.ok).toBe(true);
    const calledUrl = String(fetchMock.mock.calls[0]?.[0]);
    expect(calledUrl).toContain("api.apify.com");
    expect(calledUrl).not.toContain("tavily");
    expect(calledUrl).not.toContain("should-not-be-sent");
  });

  it("refuses to send the Apify token to any host other than api.apify.com", async () => {
    vi.stubEnv("APIFY_API_TOKEN", TOKEN);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(apifyFetch("https://evil.example/v2/acts")).rejects.toThrow(
      /non-Apify host/,
    );
    await expect(apifyFetch("http://api.apify.com/v2/acts")).rejects.toThrow(
      /non-Apify host/,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
