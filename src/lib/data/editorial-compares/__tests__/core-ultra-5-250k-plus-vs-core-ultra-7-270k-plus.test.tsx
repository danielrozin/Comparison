import type { ComponentProps } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import ComparisonPage, { getStaticProps } from "@/pages/compare/[slug]";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { decideComparePage, relatedComparisonSlugs } from "@/lib/compare-slug-resolution";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "core-ultra-5-250k-plus-vs-core-ultra-7-270k-plus";
const QUESTION = "250K Plus vs 270K Plus?";
const REVERSE = "core-ultra-7-270k-plus-vs-core-ultra-5-250k-plus";

const ARK_250 =
  "https://www.intel.com/content/www/us/en/products/sku/245694/intel-core-ultra-5-processor-250k-plus-30m-cache-up-to-5-30-ghz/specifications.html";
const ARK_270 =
  "https://www.intel.com/content/www/us/en/products/sku/245692/intel-core-ultra-7-processor-270k-plus-36m-cache-up-to-5-50-ghz/specifications.html";
const INTEL_NEWS =
  "https://www.intel.com/content/www/us/en/newsroom/news/client-computing/intel-announces-new-intel-core-ultra-200s-plus-series-desktop-processors.html";
const BACK2GAMING = "https://www.back2gaming.com/review/intel-core-ultra-200-plus-250k-270k-tested/";
const TOMS =
  "https://www.tomsguide.com/computing/cpus/intel-core-ultra-7-270k-plus-5-250k-plus-review";
const HOTHARDWARE = "https://hothardware.com/reviews/intel-core-ultra-plus-arrow-lake-refresh-review";

const SOURCES = [ARK_250, ARK_270, INTEL_NEWS, BACK2GAMING, TOMS, HOTHARDWARE];

/** Reader copy stays on the cited documents. */
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|this page|returned 404|\bwinner\b|\bbest\b|better pick|better value|better buy|worth it|reddit|r\/buildapc|\$\d|€|24 MB|10-15|10–15|Micro Center|ddr5-vs-ddr4-for-gaming|extra 8 cores/i;

const CORPUS =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|returned 404/i;

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
        if (key === "winner" || key === "winnerName" || key === "winnerReason") continue;
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

describe("Core Ultra 5 250K Plus vs Core Ultra 7 270K Plus (ROO-437)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the search-order slug with no winner and a tied table", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(HUMAN_REVIEWED_SLUGS).toEqual([]);
    expect(HUMAN_REVIEWED_SLUGS).not.toContain(SLUG);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.winnerReason).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().title).toBe(QUESTION);
    expect(page().metadata.metaTitle).toBe(QUESTION);
    expect(page().faqs).toHaveLength(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(getEditorialComparison(REVERSE)).toBeNull();
    expect(sortComparisonSlug(SLUG)).toBe(SLUG);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    expect(relatedComparisonSlugs(REVERSE)).toContain(SLUG);
    expect(decideComparePage(REVERSE, (candidate) => (candidate === SLUG ? "live" : "missing"))).toEqual({
      action: "redirect",
      destination: SLUG,
    });
    expect(decideComparePage(SLUG, (candidate) => (candidate === SLUG ? "live" : "missing"))).toEqual({
      action: "render",
    });
    expect(page().metadata.updatedAt).toBe("2026-11-15T00:00:00Z");
    expect(page().metadata.publishedAt).toBe(page().metadata.updatedAt);
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(6);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(SOURCES);
    expect(page().resources?.slice(0, 6).map((resource) => resource.url)).toEqual(SOURCES);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "rtx-5070-vs-rtx-5070-ti",
      "ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
      "850w-vs-1000w-psu",
    ]);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toMatch(/^Choose the Core Ultra 5 250K Plus if/);
    expect(sentences[1]).toMatch(/^Choose the Core Ultra 7 270K Plus if/);
    const title = buildPageTitle(page().metadata.metaTitle);
    expect(title).toBe(`${QUESTION} | A Versus B`);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(page().title.length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description).toBe(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("keeps FAQ schema text identical to the visible answers", () => {
    const schemas = comparisonPageSchema(page()) as JsonNode[];
    const flat = schemas.flatMap((node) => nodesOf(node));
    const faqs = flat.filter((node) => typeOf(node).includes("FAQPage"));
    expect(faqs).toHaveLength(1);
    const main = faqs[0].mainEntity ?? [];
    expect(main.map((item) => item.name)).toEqual(page().faqs.map((faq) => faq.question));
    expect(main.map((item) => item.acceptedAnswer?.text)).toEqual(page().faqs.map((faq) => faq.answer));
    expect(flat.filter((node) => typeOf(node).includes("ClaimReview"))).toHaveLength(0);
    const dataset = flat.find((node) => typeOf(node).includes("Dataset"));
    expect(dataset).toBeDefined();
    expect(page().citationStats?.sourceCount).toBe(6);
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(JSON.stringify(schemas)).not.toMatch(/Daniel Rozin|isHumanReviewed|lastReviewed/);
  });

  it("runs the compare page path for the H1, disclosure, and live internal links", async () => {
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
    expect(screen.getByText(/Drafted with AI from web research/)).toBeInTheDocument();
    expect(screen.getAllByText(/November 15, 2026/).length).toBeGreaterThan(0);

    const visibleFaqs = screen.getAllByText(
      (_, node) => node?.classList?.contains("faq-answer") ?? false,
    );
    expect(visibleFaqs.map((node) => node.textContent)).toEqual(page().faqs.map((faq) => faq.answer));

    const jsonDocument = JSON.parse(props.jsonLd) as JsonNode;
    const flat = nodesOf(jsonDocument);
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
    expect(main.map((item) => item.acceptedAnswer?.text)).toEqual(page().faqs.map((faq) => faq.answer));

    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "");
    const linksSlug = (slug: string) =>
      hrefs.some((href) => href === `/compare/${slug}` || href.startsWith(`/compare/${slug}?`));
    expect(linksSlug("rtx-5070-vs-rtx-5070-ti")).toBe(true);
    expect(linksSlug("ryzen-7-7800x3d-vs-ryzen-7-9800x3d")).toBe(true);
    expect(linksSlug("850w-vs-1000w-psu")).toBe(true);
    expect(hrefs.some((href) => href.includes("ddr5-vs-ddr4-for-gaming"))).toBe(false);

    const analysis = document.getElementById("expert-analysis");
    expect(analysis).toBeTruthy();
    const tables = analysis!.querySelectorAll("table");
    expect(tables.length).toBeGreaterThanOrEqual(2);
    for (const table of tables) {
      expect(table.querySelector("caption")?.textContent).toMatch(/opened 15 November 2026/);
      expect(table.querySelectorAll("th[scope='col']").length).toBeGreaterThanOrEqual(3);
      expect(table.querySelectorAll("th[scope='row']").length).toBeGreaterThanOrEqual(1);
    }
  }, 30000);

  it("cites the opened specification figures and does not carry a price or a rank", () => {
    const text = readerText(page());
    for (const fact of [
      "30 MB Intel Smart Cache",
      "36 MB Intel Smart Cache",
      "30 MB",
      "40 MB",
      "Neither cache row is named L3",
      "18 cores",
      "24 cores",
      "6 performance-cores",
      "12 efficient-cores",
      "8 performance-cores",
      "16 efficient-cores",
      "18 threads",
      "24 threads",
      "5.3 GHz",
      "5.5 GHz",
      "5.4 GHz",
      "4.6 GHz",
      "4.7 GHz",
      "4.2 GHz",
      "3.7 GHz",
      "3.3 GHz",
      "3.2 GHz",
      "125 W",
      "159 W",
      "250 W",
      "DDR5 7200",
      "256 GB",
      "FCLGA1851",
      "900 MHz",
      "11 March 2026",
      "26 March 2026",
      "27 May 2026",
      "23 March 2026",
      "15 November 2026",
      "267 FPS",
      "246 FPS",
      "187 FPS",
      "125 FPS",
      "about 96 FPS",
      "182 FPS",
      "Battlefield 6",
      "Resident Evil Requiem",
      "roughly tied",
      "Intel Performance Profile",
      "RTX 5080",
      "CapFrameX",
      "Jason England",
      "Marco Chiappetta",
      "Boss Mac Suba",
      "updated UEFI",
      "Hyper-Threading",
      "PCG 2020A",
      "105 °C",
      "Q1'26",
      "8,000 MT/s",
      "128 GB",
      "6400 MT/s",
      "24 minus 18 is 6",
      "16 minus 12 is 4",
      "8 minus 6 is 2",
      "4 more efficient-cores",
      "TSMC N3B",
      "1.9 GHz",
      "2 GHz",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text.match(BANNED)?.[0] ?? null).toBeNull();
    expect(text.match(CORPUS)?.[0] ?? null).toBeNull();
    expect(text).toContain("## Which processor to choose");
    expect(text).toContain("| Specification | Core Ultra 5 250K Plus | Core Ultra 7 270K Plus |");
    expect(text).not.toMatch(/24 MB|\$199|\$299|\$219|\$339/);
  });

  it("does not publish a second nearby slug", async () => {
    for (const slug of ["270k-plus-vs-250k-plus", "250k-plus-vs-270k-plus", "core-ultra-250k-vs-270k"]) {
      expect(getEditorialComparison(slug), slug).toBeNull();
      const nearby = await getStaticProps({ params: { slug } } as never);
      expect(nearby, slug).toHaveProperty("notFound", true);
    }
  }, 30000);

  it("keeps the Analysis disclosure in the shared component, not a human byline", () => {
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
    const reviewed = readFileSync("src/lib/editorial/human-reviewed.ts", "utf8");
    expect(reviewed).not.toContain(SLUG);
    const index = readFileSync("src/lib/data/editorial-compares/index.ts", "utf8");
    expect(index).toContain("[CORE_ULTRA_5_250K_PLUS_VS_CORE_ULTRA_7_270K_PLUS.slug]:");
    expect(index).toContain("CORE_ULTRA_5_250K_PLUS_VS_CORE_ULTRA_7_270K_PLUS,");
    const inbound = index.split("const EDITORIAL_INBOUND_RELATED")[1] ?? "";
    expect(inbound).not.toContain(SLUG);
  });
});
