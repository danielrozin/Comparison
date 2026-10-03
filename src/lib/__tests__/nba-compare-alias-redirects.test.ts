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
  {
    page: "oklahoma-city-thunder-vs-spurs",
    reverse: "spurs-vs-oklahoma-city-thunder",
  },
  { page: "knicks-vs-spurs", reverse: "spurs-vs-knicks" },
  { page: "flagg-vs-wembanyama", reverse: "wembanyama-vs-flagg" },
  { page: "knicks-vs-76ers", reverse: "76ers-vs-knicks" },
  {
    page: "shai-gilgeous-alexander-vs-victor-wembanyama",
    reverse: "victor-wembanyama-vs-shai-gilgeous-alexander",
  },
];

const ALIASES: { from: string; to: string }[] = [
  { from: "sga-vs-wembanyama", to: "shai-gilgeous-alexander-vs-victor-wembanyama" },
  { from: "wembanyama-vs-sga", to: "shai-gilgeous-alexander-vs-victor-wembanyama" },
  { from: "knicks-vs-sixers", to: "knicks-vs-76ers" },
  { from: "sixers-vs-knicks", to: "knicks-vs-76ers" },
];

/** Full-name orders and the live legacy stats page. Each must beat the shell. */
const LEGACY_ALIASES: { from: string; to: string }[] = [
  {
    from: "san-antonio-spurs-vs-oklahoma-city-thunder-match-player-stats",
    to: "oklahoma-city-thunder-vs-spurs",
  },
  {
    from: "san-antonio-spurs-vs-oklahoma-city-thunder",
    to: "oklahoma-city-thunder-vs-spurs",
  },
  {
    from: "oklahoma-city-thunder-vs-san-antonio-spurs",
    to: "oklahoma-city-thunder-vs-spurs",
  },
  { from: "new-york-knicks-vs-san-antonio-spurs", to: "knicks-vs-spurs" },
  { from: "san-antonio-spurs-vs-new-york-knicks", to: "knicks-vs-spurs" },
];

type Ctx = Parameters<typeof getStaticProps>[0];

describe("NBA batch compare aliases and reverses", () => {
  it("sends each short alias to the live page in one hop", async () => {
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

  it("301s the legacy Spurs/Thunder page and full-name orders in one hop", async () => {
    for (const alias of LEGACY_ALIASES) {
      const landed = await follow(alias.from);
      expect(landed.status, alias.from).toBe(200);
      expect(landed.final, alias.from).toBe(alias.to);
      expect(landed.hops, alias.from).toEqual([alias.to]);
      const props = await getStaticProps({ params: { slug: alias.from } } as unknown as Ctx);
      expect(props).toMatchObject({
        redirect: { destination: `/compare/${alias.to}`, statusCode: 301 },
      });
    }

    // sitemap.ts lists comparisons with canonicalComparisonWhere(), whose
    // slug.notIn is REDIRECTED_COMPARE_SLUGS. The published stats row leaves
    // the sitemap because it is a redirect source, not because its DB status
    // changed.
    const legacy = "san-antonio-spurs-vs-oklahoma-city-thunder-match-player-stats";
    expect(REDIRECTED_COMPARE_SLUGS).toContain(legacy);
    expect(canonicalComparisonWhere().slug.notIn).toContain(legacy);
    for (const alias of LEGACY_ALIASES) {
      expect(canonicalComparisonWhere().slug.notIn).toContain(alias.from);
      expect(canonicalComparisonWhere().slug.notIn).not.toContain(alias.to);
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
});

const HONDA_ALIASES: { from: string; to: string }[] = [
  { from: "ford-vs-honda", to: "honda-vs-ford" },
  { from: "honda-motor-vs-ford-motor", to: "honda-vs-ford" },
  { from: "ford-motor-vs-honda-motor", to: "honda-vs-ford" },
  { from: "honda-motor-company-vs-ford-motor-company", to: "honda-vs-ford" },
  { from: "ford-motor-company-vs-honda-motor-company", to: "honda-vs-ford" },
  { from: "honda-vs-ford-motor", to: "honda-vs-ford" },
  { from: "ford-motor-vs-honda", to: "honda-vs-ford" },
];

describe("Honda vs Ford aliases", () => {
  it("sends each name order to honda-vs-ford in one hop", async () => {
    expect(getConsolidatedCompareSlug("honda-vs-ford")).toBeNull();
    expect(REDIRECTED_COMPARE_SLUGS).not.toContain("honda-vs-ford");

    const page = await follow("honda-vs-ford");
    expect(page.status).toBe(200);
    expect(page.hops).toEqual([]);

    for (const alias of HONDA_ALIASES) {
      expect(getConsolidatedCompareSlug(alias.from)).toBe(alias.to);
      const landed = await follow(alias.from);
      expect(landed.status, alias.from).toBe(200);
      expect(landed.final, alias.from).toBe(alias.to);
      expect(landed.hops, alias.from).toEqual([alias.to]);
      const props = await getStaticProps({ params: { slug: alias.from } } as unknown as Ctx);
      expect(props).toMatchObject({
        redirect: { destination: `/compare/${alias.to}`, statusCode: 301 },
      });
      expect(REDIRECTED_COMPARE_SLUGS).toContain(alias.from);
      expect(canonicalComparisonWhere().slug.notIn).toContain(alias.from);
    }
  });
});
