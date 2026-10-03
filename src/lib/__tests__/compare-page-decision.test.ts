import { describe, expect, it } from "vitest";
import {
  decideComparePage,
  relatedComparisonSlugs,
  type SlugRowState,
} from "@/lib/compare-slug-resolution";
import { canonicalRequestedComparisonSlug } from "@/lib/parse-comparison-query";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";

/**
 * Published pages whose slug is not the alias/alphabetical form.
 * The canonicalizer wants a different URL; that URL has no row.
 */
const LIVE = [
  "marvel-vs-dc",
  "usa-vs-china",
  "chrome-vs-firefox",
  "disney-plus-vs-hulu",
  "python-vs-javascript",
  "netflix-vs-peacock-comparison-2026",
] as const;

const liveSet = new Set<string>(LIVE);

/** Forms a visitor might open for the same matchup, including reverses. */
const VARIANTS: Record<(typeof LIVE)[number], string[]> = {
  "marvel-vs-dc": ["dc-vs-marvel"],
  "usa-vs-china": ["china-vs-usa", "china-vs-united-states"],
  "chrome-vs-firefox": ["firefox-vs-chrome", "firefox-vs-google-chrome"],
  "disney-plus-vs-hulu": ["hulu-vs-disney-plus", "disney-vs-hulu"],
  "python-vs-javascript": ["javascript-vs-python"],
  "netflix-vs-peacock-comparison-2026": ["peacock-comparison-2026-vs-netflix"],
};

function stateOf(live: ReadonlySet<string>, hidden: ReadonlySet<string> = new Set()) {
  return (candidate: string): SlugRowState => {
    if (live.has(candidate)) return "live";
    if (hidden.has(candidate)) return "hidden";
    return "missing";
  };
}

/**
 * Same order as getStaticProps: edge map, then the page decision.
 * A shell is a 404 on the requested URL. It is not a redirect, even when
 * the alphabetical slug is different — that target is not live.
 */
function step(slug: string, live: ReadonlySet<string>, hidden?: ReadonlySet<string>) {
  const edge = getConsolidatedCompareSlug(slug);
  if (edge) return { type: "redirect" as const, to: edge };
  const decision = decideComparePage(slug, stateOf(live, hidden));
  if (decision.action === "redirect") return { type: "redirect" as const, to: decision.destination };
  if (decision.action === "render") return { type: "render" as const };
  if (decision.action === "shell") return { type: "shell" as const };
  return { type: "not_found" as const };
}

function follow(start: string, live: ReadonlySet<string>, hidden?: ReadonlySet<string>) {
  const seen = new Set<string>();
  const hops: string[] = [];
  let current = start;
  for (let i = 0; i < 6; i++) {
    if (seen.has(current)) {
      throw new Error(`redirect loop: ${[...seen, current].join(" -> ")}`);
    }
    seen.add(current);
    const next = step(current, live, hidden);
    if (next.type !== "redirect") return { final: current, hops, next };
    if (!live.has(next.to)) {
      throw new Error(`${current} redirects to non-live ${next.to}`);
    }
    hops.push(next.to);
    current = next.to;
  }
  throw new Error(`too many redirects from ${start}`);
}

describe("on-demand canonical redirects do not loop live pages", () => {
  it("canonicalizer still folds aliases and order, away from the published slug", () => {
    expect(canonicalRequestedComparisonSlug("marvel-vs-dc")).toBe("dc-vs-marvel");
    expect(canonicalRequestedComparisonSlug("usa-vs-china")).toBe("china-vs-united-states");
    expect(canonicalRequestedComparisonSlug("chrome-vs-firefox")).toBe("firefox-vs-google-chrome");
    expect(canonicalRequestedComparisonSlug("disney-plus-vs-hulu")).toBe("disney-vs-hulu");
    expect(canonicalRequestedComparisonSlug("python-vs-javascript")).toBe("javascript-vs-python");
    expect(canonicalRequestedComparisonSlug("netflix-vs-peacock-comparison-2026")).toBe(
      "netflix-vs-peacock",
    );
  });

  it.each(LIVE)("renders the published slug %s with no redirect", (slug) => {
    expect(getConsolidatedCompareSlug(slug)).toBeNull();
    const landed = follow(slug, liveSet);
    expect(landed.hops).toEqual([]);
    expect(landed.final).toBe(slug);
    expect(landed.next.type).toBe("render");
  });

  it("sends reverse, alias, and suffix forms to the live slug in one hop", () => {
    for (const live of LIVE) {
      for (const variant of VARIANTS[live]) {
        const landed = follow(variant, liveSet);
        expect(landed.final, variant).toBe(live);
        expect(landed.next.type, variant).toBe("render");
        expect(landed.hops.length, variant).toBeLessThanOrEqual(1);
        for (const hop of landed.hops) {
          expect(liveSet.has(hop), `${variant} -> ${hop}`).toBe(true);
        }
      }
    }
  });

  it("does not build a shell over an archived row", () => {
    const hidden = new Set(["marvel-vs-dc"]);
    expect(step("marvel-vs-dc", new Set(), hidden).type).toBe("not_found");
    expect(step("dc-vs-marvel", new Set(), hidden).type).toBe("not_found");
  });

  it("does not redirect a missing pair to a sorted slug that is not live", () => {
    expect(step("stapler-vs-banana", new Set())).toEqual({ type: "shell" });
    expect(step("banana-vs-stapler", new Set())).toEqual({ type: "shell" });
    expect(step("lebron-vs-durant", new Set())).toEqual({ type: "shell" });
    expect(step("jokic-vs-embiid", new Set())).toEqual({ type: "shell" });
    expect(step("steph-curry-vs-kobe-bryant", new Set())).toEqual({ type: "shell" });
  });

  it("redirects to the sorted slug only when that page is live", () => {
    const live = new Set(["durant-vs-lebron"]);
    expect(step("lebron-vs-durant", live)).toEqual({ type: "redirect", to: "durant-vs-lebron" });
    expect(step("durant-vs-lebron", live)).toEqual({ type: "render" });
  });

  it("keeps reversed-slug redirects that land on a live page", () => {
    expect(step("kobe-vs-lebron", new Set())).toEqual({
      type: "redirect",
      to: "kobe-bryant-vs-lebron-james",
    });
    const live = new Set([
      "knicks-vs-76ers",
      "shai-gilgeous-alexander-vs-victor-wembanyama",
      "flagg-vs-wembanyama",
    ]);
    expect(step("76ers-vs-knicks", live)).toEqual({ type: "redirect", to: "knicks-vs-76ers" });
    expect(step("victor-wembanyama-vs-shai-gilgeous-alexander", live)).toEqual({
      type: "redirect",
      to: "shai-gilgeous-alexander-vs-victor-wembanyama",
    });
    expect(step("wembanyama-vs-flagg", live)).toEqual({
      type: "redirect",
      to: "flagg-vs-wembanyama",
    });
  });
});

describe("generation duplicate candidates", () => {
  it("includes the reverse, the alias spelling, and the suffix-stripped slug", () => {
    expect(relatedComparisonSlugs("dc-vs-marvel")).toContain("marvel-vs-dc");
    expect(relatedComparisonSlugs("china-vs-united-states")).toContain("usa-vs-china");
    expect(relatedComparisonSlugs("firefox-vs-google-chrome")).toContain("chrome-vs-firefox");
    expect(relatedComparisonSlugs("disney-vs-hulu")).toContain("disney-plus-vs-hulu");
    expect(relatedComparisonSlugs("javascript-vs-python")).toContain("python-vs-javascript");
    expect(relatedComparisonSlugs("netflix-vs-peacock-comparison-2026")).toContain("netflix-vs-peacock");
  });
});
