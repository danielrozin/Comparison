import { describe, expect, it } from "vitest";
import {
  formatRefreshEmail,
  rankRefreshCandidates,
  toPath,
  trafficByPath,
  type RefreshPage,
} from "@/lib/seo/refresh-candidates";

const NOW = new Date("2026-11-22T00:00:00Z");
const daysAgo = (d: number) => new Date(NOW.getTime() - d * 86_400_000);
const t = (clicks: number, impressions: number, position: number) => ({ clicks, impressions, position });

describe("toPath / trafficByPath", () => {
  it("collapses host, protocol and trailing-slash variants", () => {
    expect(toPath("https://www.aversusb.net/blog/foo/")).toBe("/blog/foo");
    const m = trafficByPath([
      { page: "https://www.aversusb.net/blog/foo", clicks: 2, impressions: 100, position: 4 },
      { page: "http://aversusb.net/blog/foo/", clicks: 1, impressions: 100, position: 8 },
    ]);
    expect(m.get("/blog/foo")).toEqual({ clicks: 3, impressions: 200, position: 6 });
  });
});

describe("rankRefreshCandidates", () => {
  const pages: RefreshPage[] = [
    { path: "/blog/declining", title: "Declining", updatedAt: daysAgo(20) },
    { path: "/blog/fresh-healthy", title: "Healthy", updatedAt: daysAgo(10) },
    { path: "/blog/stale-no-demand", title: "No demand", updatedAt: daysAgo(300) },
    { path: "/compare/past-year", title: "Past year", updatedAt: daysAgo(30), mentionsPastYear: true },
    { path: "/blog/static", title: "static", updatedAt: null },
  ];
  const cur = new Map([
    ["/blog/declining", t(5, 400, 6)],
    ["/blog/fresh-healthy", t(40, 500, 3)],
    ["/compare/past-year", t(3, 200, 12)],
    ["/blog/static", t(1, 30, 30)],
  ]);
  const prev = new Map([
    ["/blog/declining", t(20, 500, 4)],
    ["/blog/fresh-healthy", t(38, 480, 3)],
  ]);
  const out = rankRefreshCandidates(pages, cur, prev, NOW);

  it("queues pages with demand and a reason, skips healthy and zero-demand pages", () => {
    const paths = out.map((c) => c.path);
    expect(paths).toContain("/blog/declining");
    expect(paths).toContain("/compare/past-year");
    expect(paths).toContain("/blog/static");
    expect(paths).not.toContain("/blog/fresh-healthy");
    expect(paths).not.toContain("/blog/stale-no-demand");
  });

  it("tags the right reasons", () => {
    const by = Object.fromEntries(out.map((c) => [c.path, c.reasons]));
    expect(by["/blog/declining"]).toContain("clicks_declining");
    expect(by["/compare/past-year"]).toEqual(expect.arrayContaining(["past_year", "striking_distance"]));
    expect(by["/blog/static"]).toEqual(["stale"]);
  });

  it("ranks a declining page with demand above a stale page with little demand", () => {
    const idx = (p: string) => out.findIndex((c) => c.path === p);
    expect(idx("/blog/declining")).toBeLessThan(idx("/blog/static"));
    expect(out.at(-1)!.path).toBe("/blog/static");
    // two reasons with demand (past year + page-2 rank) outrank one
    expect(out[0].path).toBe("/compare/past-year");
  });

  it("respects the limit", () => {
    expect(rankRefreshCandidates(pages, cur, prev, NOW, 1)).toHaveLength(1);
  });
});

describe("formatRefreshEmail", () => {
  it("states nothing was changed and lists full URLs", () => {
    const out = rankRefreshCandidates(
      [{ path: "/blog/x", title: "X", updatedAt: null }],
      new Map([["/blog/x", t(1, 10, 15)]]),
      new Map(),
      NOW,
    );
    const body = formatRefreshEmail(out, "https://www.aversusb.net");
    expect(body).toContain("Nothing was changed on the site");
    expect(body).toContain("https://www.aversusb.net/blog/x");
    expect(formatRefreshEmail([], "x")).toMatch(/No pages/);
  });
});
