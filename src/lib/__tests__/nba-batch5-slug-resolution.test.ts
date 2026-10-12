import { describe, expect, it } from "vitest";
import {
  decideComparePage,
  isHiddenComparisonStatus,
  relatedComparisonSlugs,
  type SlugRowState,
} from "@/lib/compare-slug-resolution";
import { canonicalComparisonWhere } from "@/lib/db/canonical-comparisons";
import {
  getConsolidatedCompareSlug,
  REDIRECTED_COMPARE_SLUGS,
} from "@/lib/redirects/compare-redirects";
import { listEditorialCompareSitemapEntries } from "@/lib/data/editorial-compares";
import { getComparisonBySlug, isComparisonDbConfigured } from "@/lib/services/comparison-service";
import { getStaticProps } from "@/pages/compare/[slug]";

function isLive(row: { entities?: unknown[]; metadata?: { status?: string } } | null): boolean {
  if (!row || (row.entities?.length ?? 0) < 2) return false;
  if (!isComparisonDbConfigured()) return true;
  const status = row.metadata?.status;
  return status === "published" || status === "provisional";
}

function rowState(row: { entities?: unknown[]; metadata?: { status?: string } } | null): SlugRowState {
  if (isLive(row)) return "live";
  if (isHiddenComparisonStatus(row?.metadata?.status)) return "hidden";
  return "missing";
}

async function step(slug: string): Promise<
  | { type: "redirect"; to: string }
  | { type: "render" }
  | { type: "not_found" }
> {
  const edge = getConsolidatedCompareSlug(slug);
  if (edge) return { type: "redirect", to: edge };

  const row = await getComparisonBySlug(slug);
  if (isLive(row)) return { type: "render" };

  const parts = slug.split("-vs-");
  if (parts.length !== 2 || parts.some((part) => part.length === 0)) return { type: "not_found" };

  const states = new Map<string, SlugRowState>();
  states.set(slug, rowState(row));
  const others = relatedComparisonSlugs(slug).filter((candidate) => candidate !== slug);
  const rows = await Promise.all(others.map((candidate) => getComparisonBySlug(candidate)));
  others.forEach((candidate, index) => {
    states.set(candidate, rowState(rows[index]));
  });

  const decision = decideComparePage(slug, (candidate) => states.get(candidate) ?? "missing");
  if (decision.action === "redirect") return { type: "redirect", to: decision.destination };
  if (decision.action === "shell" && decision.slug !== slug) {
    return { type: "redirect", to: decision.slug };
  }
  return { type: "not_found" };
}

async function follow(start: string) {
  const seen = new Set<string>();
  const hops: string[] = [];
  let current = start;
  for (let i = 0; i < 6; i++) {
    if (seen.has(current)) throw new Error(`loop: ${[...seen, current].join(" -> ")}`);
    seen.add(current);
    const next = await step(current);
    if (next.type === "render") return { final: current, hops, status: 200 as const };
    if (next.type === "not_found") return { final: current, hops, status: 404 as const };
    hops.push(next.to);
    current = next.to;
  }
  throw new Error(`too many hops from ${start}`);
}

const PAGES: { page: string; reverse: string }[] = [
  { page: "embiid-vs-jokic", reverse: "jokic-vs-embiid" },
  { page: "kobe-bryant-vs-steph-curry", reverse: "steph-curry-vs-kobe-bryant" },
];

const ALIASES: { from: string; to: string }[] = [
  { from: "joel-embiid-vs-nikola-jokic", to: "embiid-vs-jokic" },
  { from: "joel-embiid-vs-nikola-jokic-match-player-stats", to: "embiid-vs-jokic" },
  { from: "joel-embiid-match-player-stats-vs-nikola-jokic", to: "embiid-vs-jokic" },
  { from: "nikola-jokic-vs-joel-embiid", to: "embiid-vs-jokic" },
  { from: "nikola-jokic-vs-joel-embiid-match-player-stats", to: "embiid-vs-jokic" },
  { from: "nikola-jokic-match-player-stats-vs-joel-embiid", to: "embiid-vs-jokic" },
  { from: "joel-embiid-vs-jokic", to: "embiid-vs-jokic" },
  { from: "joel-embiid-vs-jokic-match-player-stats", to: "embiid-vs-jokic" },
  { from: "joel-embiid-match-player-stats-vs-jokic", to: "embiid-vs-jokic" },
  { from: "jokic-vs-joel-embiid", to: "embiid-vs-jokic" },
  { from: "jokic-vs-joel-embiid-match-player-stats", to: "embiid-vs-jokic" },
  { from: "jokic-match-player-stats-vs-joel-embiid", to: "embiid-vs-jokic" },
  { from: "embiid-vs-nikola-jokic", to: "embiid-vs-jokic" },
  { from: "embiid-vs-nikola-jokic-match-player-stats", to: "embiid-vs-jokic" },
  { from: "embiid-match-player-stats-vs-nikola-jokic", to: "embiid-vs-jokic" },
  { from: "nikola-jokic-vs-embiid", to: "embiid-vs-jokic" },
  { from: "nikola-jokic-vs-embiid-match-player-stats", to: "embiid-vs-jokic" },
  { from: "nikola-jokic-match-player-stats-vs-embiid", to: "embiid-vs-jokic" },
  { from: "embiid-vs-jokic-match-player-stats", to: "embiid-vs-jokic" },
  { from: "embiid-match-player-stats-vs-jokic", to: "embiid-vs-jokic" },
  { from: "jokic-vs-embiid", to: "embiid-vs-jokic" },
  { from: "jokic-vs-embiid-match-player-stats", to: "embiid-vs-jokic" },
  { from: "jokic-match-player-stats-vs-embiid", to: "embiid-vs-jokic" },
  { from: "kobe-vs-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-vs-curry-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-match-player-stats-vs-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "curry-vs-kobe", to: "kobe-bryant-vs-steph-curry" },
  { from: "curry-vs-kobe-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "curry-match-player-stats-vs-kobe", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-vs-steph-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-vs-steph-curry-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-match-player-stats-vs-steph-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "steph-curry-vs-kobe", to: "kobe-bryant-vs-steph-curry" },
  { from: "steph-curry-vs-kobe-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "steph-curry-match-player-stats-vs-kobe", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-vs-stephen-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-vs-stephen-curry-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-match-player-stats-vs-stephen-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "stephen-curry-vs-kobe", to: "kobe-bryant-vs-steph-curry" },
  { from: "stephen-curry-vs-kobe-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "stephen-curry-match-player-stats-vs-kobe", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-bryant-vs-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-bryant-vs-curry-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-bryant-match-player-stats-vs-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "curry-vs-kobe-bryant", to: "kobe-bryant-vs-steph-curry" },
  { from: "curry-vs-kobe-bryant-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "curry-match-player-stats-vs-kobe-bryant", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-bryant-vs-steph-curry-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-bryant-match-player-stats-vs-steph-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "steph-curry-vs-kobe-bryant", to: "kobe-bryant-vs-steph-curry" },
  { from: "steph-curry-vs-kobe-bryant-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "steph-curry-match-player-stats-vs-kobe-bryant", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-bryant-vs-stephen-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-bryant-vs-stephen-curry-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "kobe-bryant-match-player-stats-vs-stephen-curry", to: "kobe-bryant-vs-steph-curry" },
  { from: "stephen-curry-vs-kobe-bryant", to: "kobe-bryant-vs-steph-curry" },
  { from: "stephen-curry-vs-kobe-bryant-match-player-stats", to: "kobe-bryant-vs-steph-curry" },
  { from: "stephen-curry-match-player-stats-vs-kobe-bryant", to: "kobe-bryant-vs-steph-curry" },
];

type Ctx = Parameters<typeof getStaticProps>[0];

describe("NBA batch 5 slug resolution", () => {
  it("renders each page and sends its reverse in one hop", async () => {
    for (const item of PAGES) {
      const page = await follow(item.page);
      expect(page.status, item.page).toBe(200);
      expect(page.hops, item.page).toEqual([]);

      const reverse = await follow(item.reverse);
      expect(reverse.status, item.reverse).toBe(200);
      expect(reverse.final, item.reverse).toBe(item.page);
      expect(reverse.hops, item.reverse).toEqual([item.page]);

      const props = await getStaticProps({ params: { slug: item.reverse } } as unknown as Ctx);
      expect(props, item.reverse).toMatchObject({
        redirect: { destination: `/compare/${item.page}`, statusCode: 301 },
      });
    }
  });

  it("sends each full-name and match-player-stats alias to the page in one hop", async () => {
    for (const alias of ALIASES) {
      const landed = await follow(alias.from);
      expect(landed.status, alias.from).toBe(200);
      expect(landed.final, alias.from).toBe(alias.to);
      expect(landed.hops, alias.from).toEqual([alias.to]);
      const props = await getStaticProps({ params: { slug: alias.from } } as unknown as Ctx);
      expect(props, alias.from).toMatchObject({
        redirect: { destination: `/compare/${alias.to}`, statusCode: 301 },
      });
    }
  });

  it("drops every alias from the comparison sitemap and keeps the pages", () => {
    const editorial = listEditorialCompareSitemapEntries().map((entry) => entry.slug);
    const excluded = canonicalComparisonWhere().slug.notIn;
    for (const alias of ALIASES) {
      expect(REDIRECTED_COMPARE_SLUGS, alias.from).toContain(alias.from);
      expect(excluded, alias.from).toContain(alias.from);
      expect(editorial, alias.from).not.toContain(alias.from);
      expect(editorial, alias.to).toContain(alias.to);
      expect(getConsolidatedCompareSlug(alias.to), alias.to).toBeNull();
    }
  });
});
