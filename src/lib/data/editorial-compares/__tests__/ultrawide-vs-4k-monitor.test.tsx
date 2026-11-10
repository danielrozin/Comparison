import type { ComponentProps } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import ComparisonPage, { getStaticProps } from "@/pages/compare/[slug]";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { isRedirectedCompareSlug, getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { NEVER_PUBLISHED_ALIASES } from "@/lib/redirects/not-found-cleanup-redirects";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import { sortComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "ultrawide-vs-4k-monitor";
const QUESTION = "Ultrawide vs 4K Monitor?";

const GAMERSNEXUS =
  "https://gamersnexus.net/guides/2312-ultrawide-gpu-gaming-benchmark-fps-performance";
const KTC_RESOLUTIONS =
  "https://us.ktcplay.com/blogs/technology-hub/3440x1440-vs-standard-monitor-resolutions";
const KTC_PIXELS =
  "https://us.ktcplay.com/blogs/technology-hub/ultrawide-monitor-pixels-vs-resolution";
const RTINGS = "https://www.rtings.com/monitor/tests/inputs/resolution-size";

/** Reader copy stays on the grids, the formula, and the cited docs. */
const BANNED =
  /this page|page lists|list shows|table lists|page says|on that page|the page|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|\babove\b|\bshown\b|human review|byline|Drafted with AI|\bwinner\b|reddit|sharper|crisper|\bfps\b|better pick|better choice|better value|widely supported|frame rates stay|\$\d/i;

const ALIASES = ["ultrawide-vs-4k", "4k-vs-ultrawide", "4k-monitor-vs-ultrawide"];

beforeAll(() => {
  const view = window as Window & {
    matchMedia: typeof window.matchMedia;
    IntersectionObserver: typeof IntersectionObserver;
  };
  if (!view.matchMedia) {
    view.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }
  if (!view.IntersectionObserver) {
    class Observer {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    view.IntersectionObserver = Observer as unknown as typeof IntersectionObserver;
  }
});

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      if (!/^https?:\/\//.test(node) && !node.startsWith("/")) parts.push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, item] of Object.entries(node)) {
        if (key === "winner") continue;
        visit(item);
      }
    }
  };
  visit(value);
  return parts.join("\n");
}

type JsonNode = {
  "@type"?: string | string[];
  "@graph"?: JsonNode[];
  headline?: string;
  name?: string;
  description?: string;
  author?: { name?: string };
  reviewedBy?: unknown;
  isHumanReviewed?: unknown;
  lastReviewed?: unknown;
  mainEntity?: { name?: string; acceptedAnswer?: { text?: string } }[];
};

function nodesOf(document: JsonNode): JsonNode[] {
  const graph = document["@graph"] ?? [];
  return [document, ...graph.flatMap((node) => nodesOf(node))];
}

function typeOf(node: JsonNode): string[] {
  const value = node["@type"];
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

describe("ultrawide vs 4K monitor (ROO-407)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes one canonical page with no winner and a tied table", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(HUMAN_REVIEWED_SLUGS).not.toContain(SLUG);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.winnerReason).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().title).toBe(QUESTION);
    expect(page().metadata.metaTitle).toBe(QUESTION);
    expect(page().faqs).toHaveLength(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(page().metadata.updatedAt).toBe("2026-11-10T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(4);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      GAMERSNEXUS,
      KTC_RESOLUTIONS,
      KTC_PIXELS,
      RTINGS,
    ]);
    expect(page().resources?.slice(0, 4).map((resource) => resource.url)).toEqual([
      GAMERSNEXUS,
      KTC_RESOLUTIONS,
      KTC_PIXELS,
      RTINGS,
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "qd-oled-vs-woled",
      "oled-vs-mini-led-gaming-monitor",
      "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
    ]);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    expect(sortComparisonSlug(SLUG)).toBe("4k-monitor-vs-ultrawide");
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
  });

  it("runs the compare page path for title, hero H1, Article headline, and FAQ text", async () => {
    const result = await getStaticProps({ params: { slug: SLUG } } as never);
    expect(result).toHaveProperty("props");
    if (!("props" in result)) return;
    const props = result.props as {
      comparison: ReturnType<typeof page>;
      meta: { title: string; description: string };
      jsonLd: string;
    };

    const renderedTitle = buildPageTitle(props.comparison.metadata.metaTitle);
    expect(props.meta.title).toBe(renderedTitle);
    expect(props.meta.title).toBe(`${QUESTION} | A Versus B`);
    expect(props.meta.title.length).toBeLessThanOrEqual(60);
    expect(props.meta.title.match(/A Versus B/g)).toHaveLength(1);
    const description = clampDescription(props.meta.description);
    expect(description).toBe(props.meta.description);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);

    const viewProps = result.props as ComponentProps<typeof ComparisonPage>;
    render(<ComparisonPage {...viewProps} />);
    expect(screen.getByRole("heading", { level: 1, name: QUESTION })).toBeInTheDocument();
    expect(screen.queryByText(/Daniel Rozin/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Human reviewed/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Deciding factor/)).not.toBeInTheDocument();
    expect(screen.getByText(/Drafted with AI from web research/)).toBeInTheDocument();

    const visibleFaqs = screen.getAllByText(
      (_, node) => node?.classList?.contains("faq-answer") ?? false,
    );
    expect(visibleFaqs.map((node) => node.textContent)).toEqual(page().faqs.map((faq) => faq.answer));

    const document = JSON.parse(props.jsonLd) as JsonNode;
    const flat = nodesOf(document);
    const articles = flat.filter((node) => typeOf(node).includes("Article"));
    expect(articles.map((node) => node.headline)).toContain(QUESTION);
    for (const article of articles) {
      expect(article.author?.name ?? article.author).not.toBe("Daniel Rozin");
      expect(article.reviewedBy).toBeUndefined();
      expect(article.isHumanReviewed).toBeUndefined();
      expect(article.lastReviewed).toBeUndefined();
    }
    const faqs = flat.filter((node) => typeOf(node).includes("FAQPage"));
    expect(faqs).toHaveLength(1);
    const main = faqs[0].mainEntity ?? [];
    expect(main.map((item) => item.name)).toEqual(page().faqs.map((faq) => faq.question));
    expect(main.map((item) => item.acceptedAnswer?.text)).toEqual(page().faqs.map((faq) => faq.answer));
    expect(flat.filter((node) => typeOf(node).includes("ClaimReview"))).toHaveLength(0);
    expect(JSON.stringify(document)).not.toMatch(/Daniel Rozin|isHumanReviewed|lastReviewed/);

    expect(props.comparison.citationStats?.sourceCount).toBe(4);
    expect(props.comparison.citationStats?.dataPointCount).toBe(0);
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "");
    expect(hrefs.some((href) => href.startsWith("/compare/qd-oled-vs-woled"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/oled-vs-mini-led-gaming-monitor"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti"))).toBe(true);
    expect(hrefs.some((href) => href.includes("/compare/1440p-vs-4k-monitor"))).toBe(false);
    expect(hrefs.some((href) => href.includes("/compare/va-vs-ips"))).toBe(false);
  }, 30000);

  it("keeps reader copy on sourced arithmetic and skips the unproven buying claims", () => {
    const text = readerText(page());
    for (const fact of [
      "4,953,600",
      "8,294,400",
      "3,686,400",
      "72/43",
      "43/32",
      "43:18",
      "115,200",
      "1.34375",
      "34.375 percent",
      "1,267,200",
      "3,340,800",
      "29/72",
      "109.68",
      "109.6834",
      "137.68",
      "137.6816",
      "163.18",
      "163.1783",
      "11,833,600",
      "2,073,600",
      "13,907,200",
      "3,729.24",
      "14,745,600",
      "4,665,600",
      "19,411,200",
      "4,405.81",
      "4,405.814",
      "31.36",
      "13.13",
      "27.89",
      "15.69",
      "23.53",
      "13.24",
      "3360",
      "15 February 2016",
      "17 May 2026",
      "5 June 2026",
      "about 4.9 million",
      "about 3.7 million",
      "about 8.3 million",
      "2.38:1",
      "marketing shortcut",
      "better than it used to be, but not universal",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text.match(BANNED)?.[0] ?? null).toBeNull();
    expect(text).not.toMatch(/\$\d/);
    expect(text).not.toMatch(/1440p-vs-4k-monitor|va-vs-ips/);
  });

  it("redirects the 404 aliases and does not publish a second nearby page", async () => {
    for (const alias of ALIASES) {
      expect(getConsolidatedCompareSlug(alias)).toBe(SLUG);
      expect(NEVER_PUBLISHED_ALIASES.has(alias), alias).toBe(true);
      expect(isRedirectedCompareSlug(alias)).toBe(true);
      const result = await getStaticProps({ params: { slug: alias } } as never);
      expect(result, alias).toMatchObject({
        redirect: { destination: `/compare/${SLUG}`, statusCode: 301 },
      });
    }
    for (const slug of ["3440x1440-vs-4k", "ultrawide-vs-4k-gaming", "4k-vs-3440x1440"]) {
      expect(getEditorialComparison(slug)).toBeNull();
      const nearby = await getStaticProps({ params: { slug } } as never);
      expect(nearby, slug).toHaveProperty("notFound", true);
    }
  }, 30000);

  it("keeps the Analysis disclosure in the shared component, not a human byline", () => {
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});
