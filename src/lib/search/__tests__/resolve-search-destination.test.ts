import { describe, expect, it } from "vitest";
import { parseComparisonQuery } from "@/lib/parse-comparison-query";
import { compareSlugForQuery } from "@/lib/search/resolve-search-destination";
import { canonicalSlugExists } from "@/lib/search/search-session";
import { bindFlushOnPageHide } from "@/lib/search/flush-on-page-hide";

describe("compareSlugForQuery", () => {
  it("follows x only when that slug is a live row for this query", () => {
    const messi = [{ slug: "messi-vs-ronaldo" }];
    expect(compareSlugForQuery("messi x ronaldo", null)).toBeNull();
    expect(compareSlugForQuery("messi x ronaldo", { query: "messi vs ronaldo", slugs: ["messi-vs-ronaldo"] })).toBeNull();
    expect(compareSlugForQuery("messi x ronaldo", { query: "messi x ronaldo", slugs: ["messi-vs-ronaldo"] })).toBe(
      "messi-vs-ronaldo",
    );
    expect(compareSlugForQuery("Messi × Ronaldo", { query: "Messi × Ronaldo", slugs: messi.map((row) => row.slug) })).toBe(
      "messi-vs-ronaldo",
    );

    expect(compareSlugForQuery("spy x family", null)).toBeNull();
    expect(compareSlugForQuery("spy x family", { query: "spy x family", slugs: [] })).toBeNull();
    expect(compareSlugForQuery("spy x family", { query: "spy x family", slugs: ["family-vs-spy"] })).toBe("family-vs-spy");

    expect(compareSlugForQuery("hunter x hunter", { query: "hunter x hunter", slugs: ["hunter-x-hunter"] })).toBeNull();
    expect(compareSlugForQuery("Tom x Jerry", null)).toBeNull();
    expect(compareSlugForQuery("Tom x Jerry", { query: "Tom x Jerry", slugs: [] })).toBeNull();
  });

  it("still opens a normal vs query before results settle", () => {
    expect(compareSlugForQuery("Forza vs Need for Speed", null)).toBe("forza-vs-need-for-speed");
    expect(compareSlugForQuery("tecno vs iphone", null)).toBe("iphone-vs-tecno");
    expect(compareSlugForQuery("iPhone X vs Samsung", null)).not.toBeNull();
  });

  it("opens an over-long query only when the slug is already live", () => {
    const raw = "neymar vs cristiano ronaldo career stats comparison 2026";
    const relaxed = parseComparisonQuery(raw, { maxSideWords: 8, maxSideChars: 80 });
    expect(parseComparisonQuery(raw).parsed).toBe(false);
    expect(relaxed.slug).toBeTruthy();
    expect(compareSlugForQuery(raw, null)).toBeNull();
    expect(compareSlugForQuery(raw, { query: "neymar", slugs: [relaxed.slug!] })).toBeNull();
    expect(compareSlugForQuery(raw, { query: raw, slugs: [relaxed.slug!] })).toBe(relaxed.slug);
  });
});

describe("canonicalSlugExists", () => {
  it("is unknown until results for this exact query have settled", () => {
    expect(
      canonicalSlugExists({
        slug: "iphone-vs-tecno",
        query: "tecno vs iphone",
        results: [{ slug: "iphone-vs-tecno" }],
        resultsQuery: "iphone",
      }),
    ).toBeNull();
    expect(
      canonicalSlugExists({
        slug: "iphone-vs-tecno",
        query: "tecno vs iphone",
        results: [{ slug: "iphone-vs-tecno" }],
        resultsQuery: null,
      }),
    ).toBeNull();
    expect(
      canonicalSlugExists({
        slug: "iphone-vs-tecno",
        query: "tecno vs iphone",
        results: [{ slug: "iphone-vs-tecno" }],
        resultsQuery: "tecno vs iphone",
      }),
    ).toBe(true);
    expect(
      canonicalSlugExists({
        slug: "iphone-vs-tecno",
        query: "tecno vs iphone",
        results: [],
        resultsQuery: "tecno vs iphone",
      }),
    ).toBe(false);
    expect(
      canonicalSlugExists({
        slug: null,
        query: "osticket",
        results: [],
        resultsQuery: null,
      }),
    ).toBe(false);
  });
});

describe("bindFlushOnPageHide", () => {
  it("flushes when the document hides or the page is discarded", () => {
    const flush = viFlush();
    const stop = bindFlushOnPageHide(flush.fn);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(flush.calls).toBe(0);
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("pagehide"));
    expect(flush.calls).toBe(2);
    stop();
    window.dispatchEvent(new Event("pagehide"));
    expect(flush.calls).toBe(2);
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
  });
});

function viFlush(): { fn: () => void; calls: number } {
  const box = { calls: 0, fn: () => {} };
  box.fn = () => {
    box.calls += 1;
  };
  return box;
}
