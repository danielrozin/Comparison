import type { ComponentProps } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ComparisonPage, { getStaticProps } from "@/pages/compare/[slug]";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "ryzen-7-5700x3d-vs-ryzen-7-5800x3d";
const QUESTION = "Ryzen 7 5700X3D vs 5800X3D for Desktop Gaming";

const AMD_5700 =
  "https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-7-5700x3d.html";
const AMD_5800 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5800x3d.html";
const AMD_NEWS =
  "https://www.amd.com/en/newsroom/press-releases/2024-1-8-amd-reveals-next-gen-desktop-processors-for-extrem.html";
const TECHSPOT_2801 = "https://www.techspot.com/review/2801-amd-ryzen-5700x3d/";
const TECHSPOT_2808 = "https://www.techspot.com/review/2808-amd-ryzen-x3d-versus/";
const TECHSPOT_3077 = "https://www.techspot.com/review/3077-amd-ryzen-am4-5800x3d-5700x3d/";
const GAMERS_NEXUS =
  "https://gamersnexus.net/cpus/new-amd-ryzen-7-5700x3d-cpu-review-benchmarks-vs-5800x3d-more";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|this page|returned 404|\bwinner\b|\bbest\b|better value|better buy|better pick|worth it|usually not|reddit|r\/PcBuild|r\/buildapc|\$250|\$360|\$320|\$315|\$308|\$300|\$200|\$450|\$270|street price/i;

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
  author?: { name?: string };
  reviewedBy?: unknown;
  isHumanReviewed?: unknown;
  lastReviewed?: unknown;
  description?: string;
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

describe("Ryzen 7 5700X3D vs Ryzen 7 5800X3D (ROO-413)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes one canonical pair with no winner and a tied table", () => {
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
    expect(sortComparisonSlug(SLUG)).toBe(SLUG);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    expect(page().metadata.updatedAt).toBe("2026-11-11T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(7);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      AMD_5700,
      AMD_5800,
      AMD_NEWS,
      TECHSPOT_2801,
      TECHSPOT_2808,
      TECHSPOT_3077,
      GAMERS_NEXUS,
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual(
      page().citationStats?.sources.map((source) => source.url),
    );
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "ryzen-7-5800x3d-vs-am5",
      "am4-vs-am5",
      "ddr5-vs-ddr4",
      "ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
    ]);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(page().shortAnswer).toMatch(/neither chip is right for every build/i);
    expect(page().shortAnswer).toMatch(/choose the Ryzen 7 5700X3D if/i);
    expect(page().shortAnswer).toMatch(/choose the Ryzen 7 5800X3D if/i);
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
    expect(page().citationStats?.sourceCount).toBe(7);
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(JSON.stringify(schemas)).not.toMatch(/Daniel Rozin/);
    expect(JSON.stringify(schemas)).not.toMatch(/better value|usually not|worth it/i);
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

    const visibleFaqs = screen.getAllByText((_, node) => node?.classList?.contains("faq-answer") ?? false);
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
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "");
    expect(hrefs.some((href) => href.startsWith("/compare/ryzen-7-5800x3d-vs-am5"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/am4-vs-am5"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/ddr5-vs-ddr4"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/ryzen-7-7800x3d-vs-ryzen-7-9800x3d"))).toBe(true);
  }, 30000);

  it("cites AMD specs and dated review charts without a street price or a value crown", () => {
    const text = readerText(page());
    for (const fact of [
      "8 cores",
      "16 threads",
      "96 MB",
      "4 MB",
      "3 GHz",
      "3.4 GHz",
      "4.1 GHz",
      "4.5 GHz",
      "105W",
      "90°C",
      "Zen 3",
      "Vermeer",
      "AM4",
      "DDR4",
      "PCIe 4.0",
      "01/08/2024",
      "4/20/2022",
      "US $249",
      "8 January 2024",
      "31 January 2024",
      "100MB",
      "132 fps",
      "138 fps",
      "0.0435",
      "4.3 percent",
      "111 fps",
      "0.1892",
      "18.9 percent",
      "124 fps",
      "135 fps",
      "195 fps",
      "211 fps",
      "153 fps",
      "155 fps",
      "181 fps",
      "134 fps",
      "0.3116",
      "31.2 percent",
      "0.0152",
      "0.0290",
      "179 fps",
      "188 fps",
      "145 fps",
      "151 fps",
      "253 fps",
      "194 fps",
      "0.0479",
      "0.0397",
      "0.3457",
      "0.2848",
      "218 fps",
      "410 fps",
      "301 fps",
      "105 fps",
      "115 fps",
      "6 to 10 percent",
      "3 percent",
      "11 percent",
      "RTX 4090",
      "1080p",
      "1440p",
      "RTX 5090",
      "8 February 2024",
      "24 February 2024",
      "14 January 2026",
      "1 March 2024",
      "3 February 2024",
      "BIOS 7D52v1D1",
      "Liquid cooler recommended",
      "Micro Center",
      "X570, X470, B550, B450, A520",
      "Community opinion",
      "Check current price",
      "Neither chip is right for every build",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).toMatch(/Choose the Ryzen 7 5700X3D if/);
    expect(text).toMatch(/Choose the Ryzen 7 5800X3D if/);
    expect(text).not.toMatch(/only clock speed/i);
    expect(text).toContain("Ryzen 7 5800X3D or AM5");
    expect(text).toContain("AM4 vs AM5");
    expect(text).toContain("DDR5 vs DDR4");
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const computers = CATEGORY_SUBCATEGORIES.technology.find((item) => item.slug === "laptops-computers");
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((item) => item.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, computers!).map((card) => card.slug)).toContain(SLUG);
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });
});
