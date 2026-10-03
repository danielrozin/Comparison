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

/**
 * Same gate as getStaticProps. Editorial pages ship status "published", so
 * they stay renderable when a database is configured.
 */
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

/** Edge map first, then the page decision. Mirrors getStaticProps. */
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
  { page: "damian-lillard-vs-ja-morant", reverse: "ja-morant-vs-damian-lillard" },
  { page: "lebron-james-vs-stephen-curry", reverse: "stephen-curry-vs-lebron-james" },
  { page: "jordan-vs-kobe", reverse: "kobe-vs-jordan" },
];

const ALIASES: { from: string; to: string }[] = [
  { from: "ja-morant-vs-damian-lillard", to: "damian-lillard-vs-ja-morant" },
  { from: "ja-morant-vs-damian-lillard-match-player-stats", to: "damian-lillard-vs-ja-morant" },
  { from: "damian-lillard-vs-ja-morant-match-player-stats", to: "damian-lillard-vs-ja-morant" },
  { from: "ja-morant-match-player-stats-vs-damian-lillard", to: "damian-lillard-vs-ja-morant" },
  { from: "damian-lillard-match-player-stats-vs-ja-morant", to: "damian-lillard-vs-ja-morant" },
  { from: "ja-morant-vs-lillard", to: "damian-lillard-vs-ja-morant" },
  { from: "lillard-vs-ja-morant", to: "damian-lillard-vs-ja-morant" },
  { from: "ja-morant-vs-lillard-match-player-stats", to: "damian-lillard-vs-ja-morant" },
  { from: "lillard-vs-ja-morant-match-player-stats", to: "damian-lillard-vs-ja-morant" },
  { from: "ja-morant-match-player-stats-vs-lillard", to: "damian-lillard-vs-ja-morant" },
  { from: "lillard-match-player-stats-vs-ja-morant", to: "damian-lillard-vs-ja-morant" },
  { from: "morant-vs-damian-lillard", to: "damian-lillard-vs-ja-morant" },
  { from: "damian-lillard-vs-morant", to: "damian-lillard-vs-ja-morant" },
  { from: "morant-vs-damian-lillard-match-player-stats", to: "damian-lillard-vs-ja-morant" },
  { from: "damian-lillard-vs-morant-match-player-stats", to: "damian-lillard-vs-ja-morant" },
  { from: "morant-match-player-stats-vs-damian-lillard", to: "damian-lillard-vs-ja-morant" },
  { from: "damian-lillard-match-player-stats-vs-morant", to: "damian-lillard-vs-ja-morant" },
  { from: "morant-vs-lillard", to: "damian-lillard-vs-ja-morant" },
  { from: "lillard-vs-morant", to: "damian-lillard-vs-ja-morant" },
  { from: "morant-vs-lillard-match-player-stats", to: "damian-lillard-vs-ja-morant" },
  { from: "lillard-vs-morant-match-player-stats", to: "damian-lillard-vs-ja-morant" },
  { from: "morant-match-player-stats-vs-lillard", to: "damian-lillard-vs-ja-morant" },
  { from: "lillard-match-player-stats-vs-morant", to: "damian-lillard-vs-ja-morant" },
  { from: "stephen-curry-vs-lebron-james", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-james-vs-stephen-curry-match-player-stats", to: "lebron-james-vs-stephen-curry" },
  { from: "stephen-curry-vs-lebron-james-match-player-stats", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-james-match-player-stats-vs-stephen-curry", to: "lebron-james-vs-stephen-curry" },
  { from: "stephen-curry-match-player-stats-vs-lebron-james", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-james-vs-curry", to: "lebron-james-vs-stephen-curry" },
  { from: "curry-vs-lebron-james", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-james-vs-curry-match-player-stats", to: "lebron-james-vs-stephen-curry" },
  { from: "curry-vs-lebron-james-match-player-stats", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-james-match-player-stats-vs-curry", to: "lebron-james-vs-stephen-curry" },
  { from: "curry-match-player-stats-vs-lebron-james", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-vs-stephen-curry", to: "lebron-james-vs-stephen-curry" },
  { from: "stephen-curry-vs-lebron", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-vs-stephen-curry-match-player-stats", to: "lebron-james-vs-stephen-curry" },
  { from: "stephen-curry-vs-lebron-match-player-stats", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-match-player-stats-vs-stephen-curry", to: "lebron-james-vs-stephen-curry" },
  { from: "stephen-curry-match-player-stats-vs-lebron", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-vs-curry", to: "lebron-james-vs-stephen-curry" },
  { from: "curry-vs-lebron", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-vs-curry-match-player-stats", to: "lebron-james-vs-stephen-curry" },
  { from: "curry-vs-lebron-match-player-stats", to: "lebron-james-vs-stephen-curry" },
  { from: "lebron-match-player-stats-vs-curry", to: "lebron-james-vs-stephen-curry" },
  { from: "curry-match-player-stats-vs-lebron", to: "lebron-james-vs-stephen-curry" },
  { from: "kobe-vs-jordan", to: "jordan-vs-kobe" },
  { from: "jordan-vs-kobe-match-player-stats", to: "jordan-vs-kobe" },
  { from: "kobe-vs-jordan-match-player-stats", to: "jordan-vs-kobe" },
  { from: "jordan-match-player-stats-vs-kobe", to: "jordan-vs-kobe" },
  { from: "kobe-match-player-stats-vs-jordan", to: "jordan-vs-kobe" },
  { from: "jordan-vs-kobe-bryant", to: "jordan-vs-kobe" },
  { from: "kobe-bryant-vs-jordan", to: "jordan-vs-kobe" },
  { from: "jordan-vs-kobe-bryant-match-player-stats", to: "jordan-vs-kobe" },
  { from: "kobe-bryant-vs-jordan-match-player-stats", to: "jordan-vs-kobe" },
  { from: "jordan-match-player-stats-vs-kobe-bryant", to: "jordan-vs-kobe" },
  { from: "kobe-bryant-match-player-stats-vs-jordan", to: "jordan-vs-kobe" },
  { from: "michael-jordan-vs-kobe", to: "jordan-vs-kobe" },
  { from: "kobe-vs-michael-jordan", to: "jordan-vs-kobe" },
  { from: "michael-jordan-vs-kobe-match-player-stats", to: "jordan-vs-kobe" },
  { from: "kobe-vs-michael-jordan-match-player-stats", to: "jordan-vs-kobe" },
  { from: "michael-jordan-match-player-stats-vs-kobe", to: "jordan-vs-kobe" },
  { from: "kobe-match-player-stats-vs-michael-jordan", to: "jordan-vs-kobe" },
  { from: "michael-jordan-vs-kobe-bryant", to: "jordan-vs-kobe" },
  { from: "kobe-bryant-vs-michael-jordan", to: "jordan-vs-kobe" },
  { from: "michael-jordan-vs-kobe-bryant-match-player-stats", to: "jordan-vs-kobe" },
  { from: "kobe-bryant-vs-michael-jordan-match-player-stats", to: "jordan-vs-kobe" },
  { from: "michael-jordan-match-player-stats-vs-kobe-bryant", to: "jordan-vs-kobe" },
  { from: "kobe-bryant-match-player-stats-vs-michael-jordan", to: "jordan-vs-kobe" },
];

type Ctx = Parameters<typeof getStaticProps>[0];

describe("NBA batch 3 aliases and reverses", () => {
  it("sends each 404 alias to the live page in one hop", async () => {
    for (const alias of ALIASES) {
      const landed = await follow(alias.from);
      expect(landed.status, alias.from).toBe(200);
      expect(landed.final, alias.from).toBe(alias.to);
      expect(landed.hops, alias.from).toEqual([alias.to]);
      const props = await getStaticProps({ params: { slug: alias.from } } as unknown as Ctx);
      expect(props).toMatchObject({
        redirect: { destination: `/compare/${alias.to}`, statusCode: 301 },
      });
    }
  });

  it("renders every batch page and sends its reverse to that page", async () => {
    for (const item of PAGES) {
      const page = await follow(item.page);
      expect(page.status, item.page).toBe(200);
      expect(page.final, item.page).toBe(item.page);
      expect(page.hops, item.page).toEqual([]);

      const reverse = await follow(item.reverse);
      expect(reverse.status, item.reverse).toBe(200);
      expect(reverse.final, item.reverse).toBe(item.page);
      expect(reverse.hops, item.reverse).toEqual([item.page]);

      const props = await getStaticProps({ params: { slug: item.reverse } } as unknown as Ctx);
      expect(props, item.reverse).toMatchObject({
        redirect: { destination: `/compare/${reverse.hops[0]}`, statusCode: 301 },
      });
    }
  });

  it("drops every legacy alias from the comparison sitemap and keeps the pages", () => {
    const sitemap = new Set(listEditorialCompareSitemapEntries().map((entry) => entry.slug));
    const excluded = new Set(canonicalComparisonWhere().slug.notIn);
    for (const alias of ALIASES) {
      expect(REDIRECTED_COMPARE_SLUGS, alias.from).toContain(alias.from);
      expect(excluded.has(alias.from), alias.from).toBe(true);
      expect(sitemap.has(alias.from), alias.from).toBe(false);
      expect(excluded.has(alias.to), alias.to).toBe(false);
      expect(sitemap.has(alias.to), alias.to).toBe(true);
      expect(getConsolidatedCompareSlug(alias.to), alias.to).toBeNull();
    }
  });
});
