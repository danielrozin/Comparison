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
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "rx-9070-gre-vs-rx-9060-xt";
const REVERSE = "rx-9060-xt-vs-rx-9070-gre";
const QUESTION = "RX 9070 GRE vs RX 9060 XT GPU";

const AMD_GRE =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070-gre.html";
const AMD_9060 =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9060xt.html";
const AMD_9070 =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html";
const AMD_9070XT =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html";
const SOURCES = [AMD_GRE, AMD_9060, AMD_9070, AMD_9070XT];
const LIVE = ["rx-9060-xt-vs-rx-9070", "rx-9060-xt-vs-rx-9070-xt", "rx-9070-vs-rx-9070-xt"];

const BANNED =
  /checked|date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|this page|returned 404|\bwinner\b|\bbest\b|better value|better pick|better buy|worth it|reddit|\bfps\b|benchmark|\$|%|faster|stronger/i;

const CORPUS =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b/i;

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      if (!/^https?:\/\//.test(node)) parts.push(node);
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

describe("RX 9070 GRE vs RX 9060 XT (ROO-478)", () => {
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
    expect(sortComparisonSlug(SLUG)).toBe(REVERSE);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    expect(relatedComparisonSlugs(REVERSE)).toContain(SLUG);
    expect(decideComparePage(REVERSE, (candidate) => (candidate === SLUG ? "live" : "missing"))).toEqual({
      action: "redirect",
      destination: SLUG,
    });
    expect(decideComparePage(SLUG, (candidate) => (candidate === SLUG ? "live" : "missing"))).toEqual({
      action: "render",
    });
    expect(page().metadata.updatedAt).toBe("2026-11-20T00:00:00Z");
    expect(page().metadata.publishedAt).toBe(page().metadata.updatedAt);
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(4);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(SOURCES);
    expect(page().resources?.map((resource) => resource.url)).toEqual(SOURCES);
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.amd\.com\//);
    }
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(LIVE);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toMatch(/^Choose the Radeon RX 9070 GRE if/);
    expect(sentences[1]).toMatch(/^Choose the Radeon RX 9060 XT 16GB if/);
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
    const types = new Set(flat.flatMap((node) => typeOf(node)));
    for (const type of ["Article", "FAQPage", "BreadcrumbList", "Dataset"]) {
      expect(types.has(type), type).toBe(true);
    }
    expect(JSON.stringify(schemas)).not.toMatch(/Daniel Rozin|isHumanReviewed|lastReviewed/);
    expect(page().citationStats?.dataPointCount).toBe(0);
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
    expect(props.meta.title).toBe(`${QUESTION} | A Versus B`);
    expect(props.meta.description.length).toBeGreaterThanOrEqual(70);
    expect(props.meta.description.length).toBeLessThanOrEqual(160);

    const viewProps = result.props as ComponentProps<typeof ComparisonPage>;
    render(<ComparisonPage {...viewProps} />);
    expect(screen.getByRole("heading", { level: 1, name: QUESTION })).toBeInTheDocument();
    expect(screen.queryByText(/Daniel Rozin/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Human reviewed/)).not.toBeInTheDocument();
    expect(screen.getByText(/Drafted with AI from web research/)).toBeInTheDocument();
    const tables = screen.getAllByRole("table");
    expect(tables.length).toBeGreaterThanOrEqual(1);
    expect(tables.some((table) => table.querySelector("caption")?.textContent?.includes("20 November 2026"))).toBe(
      true,
    );

    const visibleFaqs = screen.getAllByText((_, node) => node?.classList?.contains("faq-answer") ?? false);
    expect(visibleFaqs.map((node) => node.textContent)).toEqual(page().faqs.map((faq) => faq.answer));

    const document = JSON.parse(props.jsonLd) as JsonNode;
    const flat = nodesOf(document);
    const types = new Set(flat.flatMap((node) => typeOf(node)));
    for (const type of ["Article", "FAQPage", "BreadcrumbList", "WebPage"]) {
      expect(types.has(type), type).toBe(true);
    }
    const articles = flat.filter((node) => typeOf(node).includes("Article"));
    expect(articles.map((node) => node.headline)).toContain(QUESTION);
    for (const article of articles) {
      expect(article.author?.name ?? article.author).not.toBe("Daniel Rozin");
      expect(article.reviewedBy).toBeUndefined();
      expect(article.isHumanReviewed).toBeUndefined();
      expect(article.lastReviewed).toBeUndefined();
    }
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "");
    for (const slug of LIVE) {
      expect(hrefs.some((href) => href.startsWith(`/compare/${slug}`)), slug).toBe(true);
    }
    for (const blocked of ["rx-9070-gre-vs-rx-9070", "rx-9070-gre-vs-rx-9070-xt", REVERSE]) {
      expect(hrefs.some((href) => href.includes(blocked)), blocked).toBe(false);
    }
  }, 30000);

  it("cites AMD specifications without a frame rate, a percent gap, or a price", () => {
    const text = readerText(page());
    for (const fact of [
      "48 compute units",
      "32 compute units",
      "3,072",
      "2,048",
      "3,584",
      "4,096",
      "2790 MHz",
      "3130 MHz",
      "2220 MHz",
      "2530 MHz",
      "2520 MHz",
      "2970 MHz",
      "2070 MHz",
      "2400 MHz",
      "12 GB",
      "16 GB",
      "192-bit",
      "128-bit",
      "256-bit",
      "18 Gbps",
      "20 Gbps",
      "48 MB",
      "32 MB",
      "64 MB",
      "432 GB/s",
      "320 GB/s",
      "640 GB/s",
      "220 W",
      "160 W",
      "304 W",
      "650 W",
      "450 W",
      "750 W",
      "2x 8-pin",
      "1x 8-pin",
      "34.3 TFLOPs",
      "25.6 TFLOPs",
      "36.1 TFLOPs",
      "48.7 TFLOPs",
      "53.9 B",
      "29.7 B",
      "DisplayPort 2.1a",
      "HDMI 2.1b",
      "PCIe 5.0 x16",
      "20 November 2026",
      "No frame rate",
      "Check the current price",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text.match(BANNED)?.[0] ?? null).toBeNull();
    expect(text.match(CORPUS)?.[0] ?? null).toBeNull();
    expect(text).toContain("## Which card to choose");
    expect(text).toContain("| Specification | RX 9070 GRE | RX 9060 XT 16GB | RX 9070 | RX 9070 XT |");
    expect(text).not.toMatch(/rx-9070-gre-vs-rx-9070(?:-xt)?/);
  });

  it("redirects the reverse slug and stays on the technology gaming hub", async () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);

    const reverse = await getStaticProps({ params: { slug: REVERSE } } as never);
    expect(reverse).toMatchObject({
      redirect: { destination: `/compare/${SLUG}`, statusCode: 301 },
    });
    for (const slug of ["rx-9070-gre-vs-rx-9070", "rx-9070-gre-vs-rx-9070-xt"]) {
      expect(getEditorialComparison(slug), slug).toBeNull();
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
    expect(index).toContain("[RX_9070_GRE_VS_RX_9060_XT.slug]: RX_9070_GRE_VS_RX_9060_XT");
    const inbound = index.split("const EDITORIAL_INBOUND_RELATED")[1] ?? "";
    expect(inbound).not.toContain(SLUG);
  });
});
