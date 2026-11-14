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

const SLUG = "850w-vs-1000w-psu";
const QUESTION = "850W vs 1000W PSU?";
const REVERSE = "1000w-psu-vs-850w";

const NV_5070 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_5080 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5080/";
const NV_5090 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/";
const AMD_9800 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const SEASONIC = "https://seasonic.com/insights/gpu-power-spikes-explained/";
const CYBENETICS = "https://www.cybenetics.com/";
const CYB_DB = "https://www.cybenetics.com/index.php?option=psu-performance-database";
const HWB =
  "https://hwbusters.com/best_picks/best-atxv3-pcie5-ready-psus-picks-hardware-busters/";

const SOURCES = [NV_5070, NV_5080, NV_5090, AMD_9800, SEASONIC, CYBENETICS, CYB_DB, HWB];

/** Reader copy stays on the cited documents. */
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|this page|returned 404|\bwinner\b|\bbest\b|better pick|better value|better buy|worth it|reddit|r\/buildapc|Corsair|RMx|Super Flower|PRIME|VERTEX|\$\d|€|EUR|20-30|20–30|plenty/i;

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

describe("850W vs 1000W PSU (ROO-434)", () => {
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
    expect(page().metadata.updatedAt).toBe("2026-11-14T00:00:00Z");
    expect(page().metadata.publishedAt).toBe(page().metadata.updatedAt);
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(8);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(SOURCES);
    expect(page().resources?.slice(0, 8).map((resource) => resource.url)).toEqual(SOURCES);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "rtx-5070-vs-rtx-5070-ti",
      "rtx-5070-vs-rx-9070-xt",
      "b650-vs-b850",
    ]);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toMatch(/^Choose an 850W power supply if/);
    expect(sentences[1]).toMatch(/^Choose a 1000W power supply if/);
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
    expect(page().citationStats?.sourceCount).toBe(8);
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
    expect(screen.getAllByText(/November 14, 2026/).length).toBeGreaterThan(0);

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
    expect(linksSlug("rtx-5070-vs-rx-9070-xt")).toBe(true);
    expect(linksSlug("b650-vs-b850")).toBe(true);

    const analysis = document.getElementById("expert-analysis");
    expect(analysis).toBeTruthy();
    const tables = analysis!.querySelectorAll("table");
    expect(tables.length).toBeGreaterThanOrEqual(2);
    for (const table of tables) {
      expect(table.querySelector("caption")?.textContent).toMatch(/opened 14 November 2026/);
      expect(table.querySelectorAll("th[scope='col']").length).toBeGreaterThanOrEqual(3);
      expect(table.querySelectorAll("th[scope='row']").length).toBeGreaterThanOrEqual(1);
    }
  }, 30000);

  it("cites the opened specification figures and does not carry a price or a rank", () => {
    const text = readerText(page());
    for (const fact of [
      "650 W",
      "750 W",
      "850 W",
      "1000 W",
      "250 W",
      "300 W",
      "360 W",
      "575 W",
      "120W",
      "Ryzen 9 9950X",
      "Ryzen 7 9800X3D",
      "PCIe CEM 5.1",
      "200%",
      "180%",
      "160%",
      "120%",
      "100 microseconds",
      "1 millisecond",
      "10 milliseconds",
      "100 milliseconds",
      "for some high-power PSUs",
      "8 September 2026",
      "12 November 2026",
      "14 November 2026",
      "300 plus 120 is 420",
      "850 minus 750 is 100",
      "1000 minus 850 is 150",
      "GD-26",
      "Unlocked for Overclocking",
      "B650",
      "B850",
      "adapter in box",
      "450 W or greater",
      "600 W PCIe Gen 5",
      "do not mean that a GPU necessarily spikes",
      "does not by itself guarantee",
      "better-rated 850W unit",
      "ETA",
      "Spike Chang",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text.match(BANNED)?.[0] ?? null).toBeNull();
    expect(text.match(CORPUS)?.[0] ?? null).toBeNull();
    expect(text).toContain("## Which wattage to choose");
    expect(text).toContain("| Card | Total graphics power | Required system power | Supplementary power connectors |");
    expect(text).not.toMatch(/93\.06|612 PSUs|Leadex|AiBARZA/);
  });

  it("does not publish a second nearby slug", async () => {
    for (const slug of ["1000w-vs-850w", "850-vs-1000-psu", "850w-psu-vs-1000w-psu"]) {
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
    expect(index).toContain("[PSU_850W_VS_1000W.slug]: PSU_850W_VS_1000W");
    const inbound = index.split("const EDITORIAL_INBOUND_RELATED")[1] ?? "";
    expect(inbound).not.toContain(SLUG);
  });
});
