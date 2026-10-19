import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  INDEXNOW_KEY,
  checkIndexable,
  flushIndexNowQueue,
  inspectHtmlForIndexability,
  isIndexNowEnabled,
  normalizeIndexNowUrl,
  notifyIndexNow,
  pendingIndexNowUrls,
  resetIndexNowQueueForTests,
  submitToIndexNow,
} from "@/lib/seo/indexnow";
import { recentSitemapUrls } from "@/lib/seo/indexnow-recent";

const BASE = "https://www.aversusb.net";

function page(url: string, opts: { canonical?: string | null; robots?: string; status?: number; xRobots?: string } = {}) {
  const canonical = opts.canonical === undefined ? url : opts.canonical;
  const html = `<!doctype html><html><head>${
    opts.robots ? `<meta name="robots" content="${opts.robots}"/>` : `<meta name="robots" content="index, follow"/>`
  }${canonical ? `<link rel="canonical" href="${canonical}"/>` : ""}</head><body>ok</body></html>`;
  return new Response(html, {
    status: opts.status ?? 200,
    headers: opts.xRobots ? { "x-robots-tag": opts.xRobots } : {},
  });
}

/** Fake fetch: page checks answer from `pages`, IndexNow POST answers `submitStatus`. */
function fakeFetch(pages: Record<string, () => Response>, submitStatus = 200) {
  const posts: { url: string; body: Record<string, unknown> }[] = [];
  const impl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url === "https://api.indexnow.org/indexnow") {
      posts.push({ url, body: JSON.parse(String(init?.body)) });
      return new Response("", { status: submitStatus });
    }
    const make = pages[url];
    return make ? make() : new Response("not found", { status: 404 });
  });
  return { impl: impl as unknown as typeof fetch, posts, calls: impl };
}

beforeEach(() => {
  resetIndexNowQueueForTests();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("normalizeIndexNowUrl", () => {
  it("resolves paths to canonical absolute URLs on our host", () => {
    expect(normalizeIndexNowUrl("/compare/a-vs-b")).toBe(`${BASE}/compare/a-vs-b`);
    expect(normalizeIndexNowUrl("blog/x/")).toBe(`${BASE}/blog/x`);
    expect(normalizeIndexNowUrl(`${BASE}/blog/x?utm=1#faq`)).toBe(`${BASE}/blog/x`);
  });

  it("drops other hosts, APIs, sitemaps and files", () => {
    expect(normalizeIndexNowUrl("https://example.com/compare/a-vs-b")).toBeNull();
    expect(normalizeIndexNowUrl("/api/indexnow")).toBeNull();
    expect(normalizeIndexNowUrl("/sitemap.xml")).toBeNull();
    expect(normalizeIndexNowUrl("/sitemap/3.xml")).toBeNull();
    expect(normalizeIndexNowUrl(`/${INDEXNOW_KEY}.txt`)).toBeNull();
    expect(normalizeIndexNowUrl("")).toBeNull();
  });
});

describe("indexability check", () => {
  it("accepts a 200 self-canonical indexable page", () => {
    const url = `${BASE}/blog/x`;
    expect(inspectHtmlForIndexability(url, `<link rel="canonical" href="${url}"/>`)).toEqual({ ok: true, url });
  });

  it("rejects noindex meta, foreign canonical, header noindex, redirects and 404s", async () => {
    const url = `${BASE}/blog/x`;
    expect(inspectHtmlForIndexability(url, `<meta name="robots" content="noindex, follow">`)).toMatchObject({ ok: false, reason: "meta-noindex" });
    expect(inspectHtmlForIndexability(url, `<link rel="canonical" href="${BASE}/blog/y">`)).toMatchObject({ ok: false, reason: "not-canonical" });
    const f = fakeFetch({
      [`${BASE}/a`]: () => page(`${BASE}/a`, { xRobots: "noindex, nofollow" }),
      [`${BASE}/b`]: () => new Response(null, { status: 308, headers: { location: `${BASE}/c` } }),
    });
    expect(await checkIndexable(`${BASE}/a`, { fetchImpl: f.impl })).toMatchObject({ ok: false, reason: "header-noindex" });
    expect(await checkIndexable(`${BASE}/b`, { fetchImpl: f.impl })).toMatchObject({ ok: false, reason: "http-308" });
    expect(await checkIndexable(`${BASE}/missing`, { fetchImpl: f.impl })).toMatchObject({ ok: false, reason: "http-404" });
  });

  it("treats a hanging page as not indexable after the timeout", async () => {
    const hang = vi.fn((_: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("t"), { name: "TimeoutError" })));
      })
    ) as unknown as typeof fetch;
    expect(await checkIndexable(`${BASE}/slow`, { fetchImpl: hang, timeoutMs: 20 })).toMatchObject({ ok: false, reason: "check-timeout" });
  });
});

describe("notifyIndexNow + flushIndexNowQueue", () => {
  it("is off under the test runner and outside production", () => {
    expect(isIndexNowEnabled()).toBe(false);
  });

  it("never throws and returns synchronously, even for junk input", () => {
    expect(() => notifyIndexNow(undefined as unknown as string[], "t")).not.toThrow();
    expect(() => notifyIndexNow([null as unknown as string, "/api/x"], "t")).not.toThrow();
    expect(notifyIndexNow("/compare/a-vs-b", "t")).toBeUndefined();
  });

  it("batches and de-duplicates queued URLs into one submit", async () => {
    notifyIndexNow(["/compare/a-vs-b", "/compare/a-vs-b/"], "saveComparison");
    notifyIndexNow(`${BASE}/compare/a-vs-b`, "api:revalidate");
    notifyIndexNow("/blog/x", "saveBlogArticle");
    expect(pendingIndexNowUrls().sort()).toEqual([`${BASE}/blog/x`, `${BASE}/compare/a-vs-b`]);

    const f = fakeFetch({
      [`${BASE}/compare/a-vs-b`]: () => page(`${BASE}/compare/a-vs-b`),
      [`${BASE}/blog/x`]: () => page(`${BASE}/blog/x`),
    });
    const r = await flushIndexNowQueue({ fetchImpl: f.impl, enabled: true });
    expect(r).toMatchObject({ queued: 2, submitted: 2, ok: true, status: 200 });
    expect(f.posts).toHaveLength(1);
    expect((f.posts[0].body.urlList as string[]).sort()).toEqual([`${BASE}/blog/x`, `${BASE}/compare/a-vs-b`]);
    expect(f.posts[0].body.host).toBe("www.aversusb.net");
    expect(f.posts[0].body.keyLocation).toBe(`${BASE}/${INDEXNOW_KEY}.txt`);
    expect(pendingIndexNowUrls()).toEqual([]);
  });

  it("only submits canonical, indexable 200 pages", async () => {
    notifyIndexNow(["/blog/ok", "/blog/noindex", "/blog/dupe", "/blog/gone"], "t");
    const f = fakeFetch({
      [`${BASE}/blog/ok`]: () => page(`${BASE}/blog/ok`),
      [`${BASE}/blog/noindex`]: () => page(`${BASE}/blog/noindex`, { robots: "noindex, follow" }),
      [`${BASE}/blog/dupe`]: () => page(`${BASE}/blog/dupe`, { canonical: `${BASE}/blog/ok` }),
    });
    const r = await flushIndexNowQueue({ fetchImpl: f.impl, enabled: true });
    expect(f.posts[0].body.urlList).toEqual([`${BASE}/blog/ok`]);
    expect(r.dropped.map((d) => d.reason).sort()).toEqual(["http-404", "meta-noindex", "not-canonical"]);
  });

  it("sends nothing when no page qualifies", async () => {
    notifyIndexNow("/blog/gone", "t");
    const f = fakeFetch({});
    const r = await flushIndexNowQueue({ fetchImpl: f.impl, enabled: true });
    expect(f.posts).toHaveLength(0);
    expect(r).toMatchObject({ submitted: 0, skipped: "no-indexable-urls" });
  });

  it("skips URLs it already submitted recently", async () => {
    const f = fakeFetch({ [`${BASE}/blog/x`]: () => page(`${BASE}/blog/x`) });
    notifyIndexNow("/blog/x", "t");
    await flushIndexNowQueue({ fetchImpl: f.impl, enabled: true });
    notifyIndexNow("/blog/x", "t");
    const r = await flushIndexNowQueue({ fetchImpl: f.impl, enabled: true });
    expect(f.posts).toHaveLength(1);
    expect(r).toMatchObject({ skipped: "no-new-urls" });
  });

  it("does not submit when disabled", async () => {
    const f = fakeFetch({ [`${BASE}/blog/x`]: () => page(`${BASE}/blog/x`) });
    notifyIndexNow("/blog/x", "t");
    const r = await flushIndexNowQueue({ fetchImpl: f.impl, enabled: false });
    expect(f.calls).not.toHaveBeenCalled();
    expect(r.skipped).toBe("disabled-or-non-prod");
  });

  it("survives an IndexNow error or network failure and logs without the key", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const f = fakeFetch({ [`${BASE}/blog/x`]: () => page(`${BASE}/blog/x`) }, 429);
    notifyIndexNow("/blog/x", "t");
    await expect(flushIndexNowQueue({ fetchImpl: f.impl, enabled: true })).resolves.toMatchObject({ ok: false, status: 429 });

    const boom = vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    await expect(submitToIndexNow([`${BASE}/blog/x`], { fetchImpl: boom, enabled: true })).resolves.toMatchObject({ ok: false, submitted: 0 });

    const logged = [...warn.mock.calls, ...info.mock.calls].flat().map(String).join("\n");
    expect(logged).toContain("[indexnow]");
    expect(logged).not.toContain(INDEXNOW_KEY);
  });

  it("aborts a hanging IndexNow POST after the timeout", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const hang = vi.fn((_: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("t"), { name: "TimeoutError" })));
      })
    ) as unknown as typeof fetch;
    const r = await submitToIndexNow([`${BASE}/blog/x`], { fetchImpl: hang, enabled: true, timeoutMs: 20 });
    expect(r).toMatchObject({ ok: false, submitted: 0 });
  });
});

describe("recentSitemapUrls", () => {
  it("keeps only entries modified since the cutoff, normalized and de-duplicated", () => {
    const cutoff = new Date("2026-10-01T00:00:00Z");
    const urls = recentSitemapUrls(
      [
        { url: `${BASE}/browser-comparison-2026`, lastModified: "2026-10-19" },
        { url: `${BASE}/blog/old`, lastModified: "2026-09-01" },
        { url: `${BASE}/blog/new/`, lastModified: new Date("2026-10-10") },
        { url: `${BASE}/blog/new`, lastModified: "2026-10-11" },
        { url: `${BASE}/no-date` },
      ],
      cutoff
    );
    expect(urls).toEqual([`${BASE}/browser-comparison-2026`, `${BASE}/blog/new`]);
  });
});

describe("publish and update paths queue IndexNow", () => {
  it.each([
    ["src/lib/services/comparison-service.ts", "notifyIndexNow(`/compare/${data.slug}`"],
    ["src/lib/services/comparison-service.ts", "notifyIndexNow(`/compare/${input.slug}`"],
    ["src/lib/services/blog-generator.ts", 'if (result.status === "published") {'],
    ["src/app/api/best/batch-publish/route.ts", "`/best/${r.slug}`"],
    ["src/app/api/revalidate/route.ts", 'notifyIndexNow(revalidated.filter((p) => p !== "/"), "api:revalidate")'],
    ["src/pages/api/revalidate-pages.ts", 'notifyIndexNowNow(revalidated, "api:revalidate-pages")'],
    ["src/app/api/cron/trending-freshness/route.ts", '"cron:trending-freshness"'],
    ["src/app/api/cron/dan1685-seo-push/route.ts", '"cron:dan1685-seo-push"'],
    ["src/app/api/cron/indexnow-recent/route.ts", "recentSitemapUrls("],
  ])("%s", async (file, needle) => {
    const fs = await import("node:fs");
    expect(fs.readFileSync(file, "utf8")).toContain(needle);
  });

  it("no write path awaits the raw submit inline", async () => {
    const fs = await import("node:fs");
    for (const file of ["src/lib/services/comparison-service.ts", "src/lib/services/blog-generator.ts"]) {
      expect(fs.readFileSync(file, "utf8")).not.toMatch(/submit(?:Comparison)?ToIndexNow\(/);
    }
  });
});
