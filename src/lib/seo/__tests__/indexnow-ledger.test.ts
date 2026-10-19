import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  claimIndexNowUrls,
  resetIndexNowLedgerForTests,
  INDEXNOW_PUBLISH_DEDUPE_MS,
  type LedgerStore,
} from "@/lib/seo/indexnow-ledger";
import { flushIndexNowQueue, notifyIndexNow, resetIndexNowQueueForTests, submitIndexNowGuarded } from "@/lib/seo/indexnow";

const BASE = "https://www.aversusb.net";
const u = (i: number) => `${BASE}/compare/a${i}-vs-b${i}`;

/** Shared fake Redis: two "instances" passing the same store see each other's writes. */
function fakeStore(): LedgerStore & { data: Map<string, string>; counters: Map<string, number> } {
  const data = new Map<string, string>();
  const counters = new Map<string, number>();
  return {
    data,
    counters,
    async mget(keys) {
      return keys.map((k) => data.get(k) ?? null);
    },
    async markSent(keys, value) {
      for (const k of keys) data.set(k, value);
    },
    async incrBy(key, by) {
      const n = (counters.get(key) ?? 0) + by;
      counters.set(key, n);
      return n;
    },
    async decrBy(key, by) {
      counters.set(key, (counters.get(key) ?? 0) - by);
    },
  };
}

function okFetch() {
  const posts: string[][] = [];
  const impl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url === "https://api.indexnow.org/indexnow") {
      posts.push(JSON.parse(String(init?.body)).urlList);
      return new Response("", { status: 200 });
    }
    return new Response(`<link rel="canonical" href="${url}"/>`, { status: 200 });
  }) as unknown as typeof fetch;
  return { impl, posts };
}

beforeEach(() => {
  resetIndexNowLedgerForTests();
  resetIndexNowQueueForTests();
  vi.spyOn(console, "info").mockImplementation(() => {});
});

describe("claimIndexNowUrls", () => {
  it("skips URLs another path submitted recently (shared store)", async () => {
    const store = fakeStore();
    const now = () => 1_000_000_000_000;
    const a = await claimIndexNowUrls([u(1), u(2)], "sweep", { store, now });
    await a.settle(true);
    const b = await claimIndexNowUrls([u(1), u(3)], "publish", { store, now });
    expect(b.allowed).toEqual([u(3)]);
    expect(b.dropped).toEqual([{ url: u(1), reason: "recently-submitted" }]);
  });

  it("lets a publish ping resend after 24h but sweeps wait 7 days", async () => {
    const store = fakeStore();
    let t = 1_000_000_000_000;
    const now = () => t;
    await (await claimIndexNowUrls([u(1)], "publish", { store, now })).settle(true);
    t += INDEXNOW_PUBLISH_DEDUPE_MS + 1;
    expect((await claimIndexNowUrls([u(1)], "sweep", { store, now })).allowed).toEqual([]);
    expect((await claimIndexNowUrls([u(1)], "publish", { store, now })).allowed).toEqual([u(1)]);
  });

  it("enforces the daily cap across callers and a lower sweep sub-cap", async () => {
    const store = fakeStore();
    const now = () => Date.parse("2026-10-19T08:00:00Z");
    const urls = Array.from({ length: 50 }, (_, i) => u(i));
    const sweep = await claimIndexNowUrls(urls, "sweep", { store, now, dailyCap: 30, sweepDailyCap: 20 });
    expect(sweep.allowed).toHaveLength(20);
    expect(sweep.dropped.filter((d) => d.reason === "daily-cap")).toHaveLength(30);
    await sweep.settle(true);
    const pub = await claimIndexNowUrls(urls.slice(20), "publish", { store, now, dailyCap: 30, sweepDailyCap: 20 });
    expect(pub.allowed).toHaveLength(10);
    const more = await claimIndexNowUrls([u(99)], "publish", { store, now, dailyCap: 30 });
    expect(more.allowed).toEqual([]);
    expect(store.counters.get("indexnow:day:2026-10-19")).toBe(30);
  });

  it("releases the reservation when the submit fails", async () => {
    const store = fakeStore();
    const now = () => Date.parse("2026-10-19T08:00:00Z");
    const c = await claimIndexNowUrls([u(1), u(2)], "publish", { store, now, dailyCap: 2 });
    await c.settle(false);
    expect(store.counters.get("indexnow:day:2026-10-19")).toBe(0);
    expect(store.data.size).toBe(0);
    expect((await claimIndexNowUrls([u(1), u(2)], "publish", { store, now, dailyCap: 2 })).allowed).toHaveLength(2);
  });

  it("falls back to memory when the store errors, and never throws", async () => {
    const broken: LedgerStore = {
      mget: async () => {
        throw new Error("redis down");
      },
      markSent: async () => {},
      incrBy: async () => 0,
      decrBy: async () => {},
    };
    await expect(claimIndexNowUrls([u(1)], "publish", { store: broken })).resolves.toMatchObject({ allowed: [u(1)] });
  });
});

describe("submit paths use the ledger", () => {
  it("a sweep after a publish ping does not resend the same URL", async () => {
    const store = fakeStore();
    const f = okFetch();
    notifyIndexNow("/compare/a1-vs-b1", "saveComparison");
    await flushIndexNowQueue({ fetchImpl: f.impl, enabled: true, ledger: { store } });
    const r = await submitIndexNowGuarded([u(1), u(2)], "sweep", "cron:test", { fetchImpl: f.impl, enabled: true, ledger: { store } });
    expect(f.posts).toEqual([[u(1)], [u(2)]]);
    expect(r).toMatchObject({ submitted: 1, deduped: 1, capped: 0 });
  });

  it("cron routes call the guarded submit, not the raw POST", async () => {
    const fs = await import("node:fs");
    for (const file of ["src/app/api/cron/indexnow-recent/route.ts", "src/app/api/indexnow/route.ts"]) {
      const src = fs.readFileSync(file, "utf8");
      expect(src).toContain("submitIndexNowGuarded(");
      expect(src).not.toMatch(/\bsubmitToIndexNow\(/);
    }
  });
});
