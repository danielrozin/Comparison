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
  { page: "cooper-flagg-vs-kon-knueppel", reverse: "kon-knueppel-vs-cooper-flagg" },
  { page: "lakers-vs-celtics", reverse: "celtics-vs-lakers" },
  { page: "durant-vs-lebron", reverse: "lebron-vs-durant" },
];


const ALIASES: { from: string; to: string }[] = [
  { from: "kon-knueppel-vs-cooper-flagg", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "cooper-flagg-vs-kon-knueppel-match-player-stats", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "kon-knueppel-vs-cooper-flagg-match-player-stats", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "cooper-flagg-match-player-stats-vs-kon-knueppel", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "kon-knueppel-match-player-stats-vs-cooper-flagg", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "cooper-flagg-vs-knueppel", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "knueppel-vs-cooper-flagg", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "cooper-flagg-vs-knueppel-match-player-stats", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "knueppel-vs-cooper-flagg-match-player-stats", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "cooper-flagg-match-player-stats-vs-knueppel", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "knueppel-match-player-stats-vs-cooper-flagg", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "flagg-vs-kon-knueppel", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "kon-knueppel-vs-flagg", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "flagg-vs-kon-knueppel-match-player-stats", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "kon-knueppel-vs-flagg-match-player-stats", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "flagg-match-player-stats-vs-kon-knueppel", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "kon-knueppel-match-player-stats-vs-flagg", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "flagg-vs-knueppel", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "knueppel-vs-flagg", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "flagg-vs-knueppel-match-player-stats", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "knueppel-vs-flagg-match-player-stats", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "flagg-match-player-stats-vs-knueppel", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "knueppel-match-player-stats-vs-flagg", to: "cooper-flagg-vs-kon-knueppel" },
  { from: "celtics-vs-lakers", to: "lakers-vs-celtics" },
  { from: "lakers-vs-celtics-match-player-stats", to: "lakers-vs-celtics" },
  { from: "celtics-vs-lakers-match-player-stats", to: "lakers-vs-celtics" },
  { from: "lakers-match-player-stats-vs-celtics", to: "lakers-vs-celtics" },
  { from: "celtics-match-player-stats-vs-lakers", to: "lakers-vs-celtics" },
  { from: "lakers-vs-boston-celtics", to: "lakers-vs-celtics" },
  { from: "boston-celtics-vs-lakers", to: "lakers-vs-celtics" },
  { from: "lakers-vs-boston-celtics-match-player-stats", to: "lakers-vs-celtics" },
  { from: "boston-celtics-vs-lakers-match-player-stats", to: "lakers-vs-celtics" },
  { from: "lakers-match-player-stats-vs-boston-celtics", to: "lakers-vs-celtics" },
  { from: "boston-celtics-match-player-stats-vs-lakers", to: "lakers-vs-celtics" },
  { from: "los-angeles-lakers-vs-celtics", to: "lakers-vs-celtics" },
  { from: "celtics-vs-los-angeles-lakers", to: "lakers-vs-celtics" },
  { from: "los-angeles-lakers-vs-celtics-match-player-stats", to: "lakers-vs-celtics" },
  { from: "celtics-vs-los-angeles-lakers-match-player-stats", to: "lakers-vs-celtics" },
  { from: "los-angeles-lakers-match-player-stats-vs-celtics", to: "lakers-vs-celtics" },
  { from: "celtics-match-player-stats-vs-los-angeles-lakers", to: "lakers-vs-celtics" },
  { from: "los-angeles-lakers-vs-boston-celtics", to: "lakers-vs-celtics" },
  { from: "boston-celtics-vs-los-angeles-lakers", to: "lakers-vs-celtics" },
  { from: "los-angeles-lakers-vs-boston-celtics-match-player-stats", to: "lakers-vs-celtics" },
  { from: "boston-celtics-vs-los-angeles-lakers-match-player-stats", to: "lakers-vs-celtics" },
  { from: "los-angeles-lakers-match-player-stats-vs-boston-celtics", to: "lakers-vs-celtics" },
  { from: "boston-celtics-match-player-stats-vs-los-angeles-lakers", to: "lakers-vs-celtics" },
  { from: "la-lakers-vs-celtics", to: "lakers-vs-celtics" },
  { from: "celtics-vs-la-lakers", to: "lakers-vs-celtics" },
  { from: "la-lakers-vs-celtics-match-player-stats", to: "lakers-vs-celtics" },
  { from: "celtics-vs-la-lakers-match-player-stats", to: "lakers-vs-celtics" },
  { from: "la-lakers-match-player-stats-vs-celtics", to: "lakers-vs-celtics" },
  { from: "celtics-match-player-stats-vs-la-lakers", to: "lakers-vs-celtics" },
  { from: "la-lakers-vs-boston-celtics", to: "lakers-vs-celtics" },
  { from: "boston-celtics-vs-la-lakers", to: "lakers-vs-celtics" },
  { from: "la-lakers-vs-boston-celtics-match-player-stats", to: "lakers-vs-celtics" },
  { from: "boston-celtics-vs-la-lakers-match-player-stats", to: "lakers-vs-celtics" },
  { from: "la-lakers-match-player-stats-vs-boston-celtics", to: "lakers-vs-celtics" },
  { from: "boston-celtics-match-player-stats-vs-la-lakers", to: "lakers-vs-celtics" },
  { from: "lebron-vs-durant", to: "durant-vs-lebron" },
  { from: "durant-vs-lebron-match-player-stats", to: "durant-vs-lebron" },
  { from: "lebron-vs-durant-match-player-stats", to: "durant-vs-lebron" },
  { from: "durant-match-player-stats-vs-lebron", to: "durant-vs-lebron" },
  { from: "lebron-match-player-stats-vs-durant", to: "durant-vs-lebron" },
  { from: "durant-vs-lebron-james", to: "durant-vs-lebron" },
  { from: "lebron-james-vs-durant", to: "durant-vs-lebron" },
  { from: "durant-vs-lebron-james-match-player-stats", to: "durant-vs-lebron" },
  { from: "lebron-james-vs-durant-match-player-stats", to: "durant-vs-lebron" },
  { from: "durant-match-player-stats-vs-lebron-james", to: "durant-vs-lebron" },
  { from: "lebron-james-match-player-stats-vs-durant", to: "durant-vs-lebron" },
  { from: "kevin-durant-vs-lebron", to: "durant-vs-lebron" },
  { from: "lebron-vs-kevin-durant", to: "durant-vs-lebron" },
  { from: "kevin-durant-vs-lebron-match-player-stats", to: "durant-vs-lebron" },
  { from: "lebron-vs-kevin-durant-match-player-stats", to: "durant-vs-lebron" },
  { from: "kevin-durant-match-player-stats-vs-lebron", to: "durant-vs-lebron" },
  { from: "lebron-match-player-stats-vs-kevin-durant", to: "durant-vs-lebron" },
  { from: "kevin-durant-vs-lebron-james", to: "durant-vs-lebron" },
  { from: "lebron-james-vs-kevin-durant", to: "durant-vs-lebron" },
  { from: "kevin-durant-vs-lebron-james-match-player-stats", to: "durant-vs-lebron" },
  { from: "lebron-james-vs-kevin-durant-match-player-stats", to: "durant-vs-lebron" },
  { from: "kevin-durant-match-player-stats-vs-lebron-james", to: "durant-vs-lebron" },
  { from: "lebron-james-match-player-stats-vs-kevin-durant", to: "durant-vs-lebron" },
];

type Ctx = Parameters<typeof getStaticProps>[0];

describe("NBA batch 4 reverses", () => {
  it("renders every batch page and sends its reverse to that page in one hop", async () => {
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
      expect(props).toMatchObject({
        redirect: { destination: `/compare/${alias.to}`, statusCode: 301 },
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
