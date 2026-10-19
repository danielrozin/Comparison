// ROO-270: junk /compare/ slugs (Bing 404 report, group c) answer 410 Gone
// with noindex. Every other missing compare slug, including the build list,
// must still reach pages/compare/[slug] and get a real 404 from there.

import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "@/middleware";
import {
  COMPARE_GONE_STATUS,
  GONE_COMPARE_SLUGS,
  goneCompareSlug,
} from "../compare-gone";
import { getConsolidatedCompareSlug, isRedirectedCompareSlug } from "../compare-redirects";
import { resolveUsChinaGdpRedirect } from "../us-china-gdp-cluster";
import { resolveHtmlSuffixCompareRedirect } from "../html-suffix-compare";
import { VS_REDIRECTS } from "../vs-redirects";
import { isCleanSlug } from "@/lib/utils/slugify";

function run(path: string, init?: { method?: string; ua?: string }) {
  const headers: Record<string, string> = {};
  if (init?.ua) headers["user-agent"] = init.ua;
  return middleware(
    new NextRequest(`https://www.aversusb.net${path}`, { method: init?.method ?? "GET", headers }),
  );
}

// Slugs we may build later (Bing build list, still 404 live on 2026-10-19):
// they must stay real 404s, never 410.
const BUILD_LIST_SAMPLE = [
  "airpods-vs-beats",
  "hisense-vs-tcl",
  "chromebook-vs-macbook",
  "bumble-vs-hinge",
  "netflix-vs-hulu",
  "zoom-vs-loom",
  "workday-vs-oracle",
];

describe("410 Gone list for junk /compare/ slugs", () => {
  it("has the 15 group-c slugs", () => {
    expect(GONE_COMPARE_SLUGS.size).toBe(15);
  });

  it("never shadows a redirect, alias or HTML-suffix fold", () => {
    const vsSources = new Set(VS_REDIRECTS.map((r) => r.source));
    for (const slug of GONE_COMPARE_SLUGS) {
      expect(slug, slug).toBe(slug.toLowerCase());
      expect(isCleanSlug(slug), slug).toBe(true);
      expect(getConsolidatedCompareSlug(slug), slug).toBeNull();
      expect(isRedirectedCompareSlug(slug), slug).toBe(false);
      expect(resolveUsChinaGdpRedirect(slug), slug).toBeNull();
      expect(resolveHtmlSuffixCompareRedirect(slug), slug).toBeNull();
      expect(vsSources.has(`/compare/${slug}`), slug).toBe(false);
    }
  });

  it("returns 410 with noindex for every gone slug", async () => {
    for (const slug of GONE_COMPARE_SLUGS) {
      for (const path of [`/compare/${slug}`, `/compare/${slug}/`]) {
        const res = run(path);
        expect(res.status, path).toBe(COMPARE_GONE_STATUS);
        expect(res.headers.get("x-robots-tag"), path).toBe("noindex, nofollow");
        expect(res.headers.get("x-middleware-next"), path).toBeNull();
        expect(res.headers.get("location"), path).toBeNull();
        const body = await res.text();
        expect(body).toContain('<meta name="robots" content="noindex, nofollow">');
      }
    }
  });

  it("answers HEAD with 410 and no body", async () => {
    const res = run("/compare/android-vs-samsung", { method: "HEAD" });
    expect(res.status).toBe(410);
    expect(await res.text()).toBe("");
  });

  it("is URL-only: AI crawlers get the same answer as browsers, live pages are untouched", () => {
    const uas = [
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36",
    ];
    for (const ua of uas) {
      expect(run("/compare/bmw-x3-vs-competitors", { ua }).status, ua).toBe(410);
      const live = run("/compare/chrome-vs-edge", { ua });
      expect(live.status, ua).toBe(200);
      expect(live.headers.get("x-middleware-next"), ua).toBe("1");
    }
  });

  it("leaves build-list and unknown slugs to the page route (real 404 there)", () => {
    for (const slug of [...BUILD_LIST_SAMPLE, "totally-unknown-vs-not-a-thing"]) {
      expect(goneCompareSlug(`/compare/${slug}`), slug).toBeNull();
      const res = run(`/compare/${slug}`);
      expect(res.status, slug).not.toBe(410);
      expect(res.headers.get("x-middleware-next"), slug).toBe("1");
    }
  });

  it("only matches exact /compare/{slug}", () => {
    expect(goneCompareSlug("/compare/ANDROID-VS-SAMSUNG")).toBe("android-vs-samsung");
    expect(goneCompareSlug("/blog/android-vs-samsung")).toBeNull();
    expect(goneCompareSlug("/compare/android-vs-samsung/extra")).toBeNull();
    expect(goneCompareSlug("/compare/android-vs-samsung-2026")).toBeNull();
    expect(goneCompareSlug("/compare/")).toBeNull();
  });
});
