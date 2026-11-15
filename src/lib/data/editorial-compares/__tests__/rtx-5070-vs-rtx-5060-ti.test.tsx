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

const SLUG = "rtx-5070-vs-rtx-5060-ti";
const QUESTION = "RTX 5070 vs RTX 5060 Ti";
const REVERSE = "rtx-5060-ti-vs-rtx-5070";

const NV_5070 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_5060 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5060-family/";
const NV_3060 = "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3060-3060ti/";
const DF =
  "https://www.digitalfoundry.net/articles/digitalfoundry-2025-nvidia-geforce-rtx-5060-ti-16gb-review";
const TOMS = "https://www.tomshardware.com/pc-components/gpus/rtx-5070-vs-rtx-5060-ti-16gb";
const XDA =
  "https://www.xda-developers.com/i-tested-the-rtx-5060-ti-against-the-rtx-5070-and-its-a-disaster/";

const SOURCES = [NV_5070, NV_5060, NV_3060, DF, TOMS, XDA];

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|this page|returned 404|\bwinner\b|\bbest\b|better pick|better value|better buy|worth it|reddit|r\/buildapc|\$\d|MSRP|Yes for gaming/i;

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

describe("RTX 5070 vs RTX 5060 Ti (ROO-438)", () => {
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
    expect(page().resources?.map((resource) => resource.url)).toEqual(SOURCES);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "rtx-5070-vs-rtx-5070-ti",
      "rtx-5070-vs-rx-9070-xt",
      "rx-9060-xt-vs-rtx-5060-ti",
      "850w-vs-1000w-psu",
    ]);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toMatch(/^Choose the GeForce RTX 5070 if/);
    expect(sentences[1]).toMatch(/^Choose the GeForce RTX 5060 Ti 16 GB config if/);
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
    const types = new Set(flat.flatMap((node) => typeOf(node)));
    for (const schemaType of ["Article", "FAQPage", "BreadcrumbList", "Dataset"]) {
      expect(types.has(schemaType), schemaType).toBe(true);
    }
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

    const visibleFaqs = screen.getAllByText((_, node) => node?.classList?.contains("faq-answer") ?? false);
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
    expect(linksSlug("rx-9060-xt-vs-rtx-5060-ti")).toBe(true);
    expect(linksSlug("850w-vs-1000w-psu")).toBe(true);

    const analysis = document.getElementById("expert-analysis");
    expect(analysis).toBeTruthy();
    const tables = analysis!.querySelectorAll("table");
    expect(tables.length).toBeGreaterThanOrEqual(2);
    for (const table of tables) {
      expect(table.querySelector("caption")?.textContent).toMatch(/opened 15 November 2026/);
      expect(table.querySelectorAll("th[scope='col']").length).toBeGreaterThanOrEqual(3);
      expect(table.querySelectorAll("th[scope='row']").length).toBeGreaterThanOrEqual(1);
    }
    const headings = analysis!.querySelectorAll("h3");
    expect(headings.length).toBeGreaterThanOrEqual(6);
  }, 30000);

  it("cites NVIDIA specs and attributed review figures without a price or a crown", () => {
    const text = readerText(page());
    for (const fact of [
      "6,144",
      "4,608",
      "1,536 / 4,608 = 1/3",
      "12 GB GDDR7",
      "16 GB / 8 GB",
      "192-bit",
      "128-bit",
      "448 GB/sec",
      "672 GB/s",
      "2.51 GHz",
      "2.57 GHz",
      "2.33 GHz",
      "2.41 GHz",
      "988 AI TOPS",
      "759 AI TOPS",
      "94 TFLOPS",
      "72 TFLOPS",
      "250 W",
      "180 W",
      "650 W",
      "600 W",
      "450 W",
      "Ryzen 9 9950X",
      "PCIe CEM 5.1",
      "DLSS 4",
      "DLSS 5",
      "don't consider buying the 8GB model",
      "31 percent",
      "32 percent",
      "28 percent",
      "24 percent",
      "-5 percent",
      "+43 percent",
      "Indiana Jones and the Great Circle",
      "A Plague Tale: Requiem",
      "21 games",
      "PNY",
      "Founders Edition",
      "2004.9",
      "1387.7",
      "plus 44.5 percent",
      "minus 2.3 percent",
      "12 GB GDDR6",
      "170 W",
      "550 W",
      "Core i9-10900K",
      "8 GB vs 12 GB",
      "150 and 170 W",
      "electrically x8",
      "Available April 16",
      "March 5th",
      "15 November 2026",
      "Neither card is right for everyone",
      "No current store price is stated here",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text.match(BANNED)?.[0] ?? null).toBeNull();
    expect(text.match(CORPUS)?.[0] ?? null).toBeNull();
    expect(text).toContain("## Which card to choose");
    expect(text).toContain("| Row | GeForce RTX 5070 | GeForce RTX 5060 Ti |");
    expect(text).not.toMatch(/549|429|379|610|500/);
  });

  it("keeps the Analysis disclosure in the shared component, not a human byline", () => {
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
    const reviewed = readFileSync("src/lib/editorial/human-reviewed.ts", "utf8");
    expect(reviewed).not.toContain(SLUG);
    const index = readFileSync("src/lib/data/editorial-compares/index.ts", "utf8");
    expect(index).toContain("[RTX_5070_VS_RTX_5060_TI.slug]: RTX_5070_VS_RTX_5060_TI");
    const inbound = index.split("const EDITORIAL_INBOUND_RELATED")[1] ?? "";
    expect(inbound).not.toContain(SLUG);
  });
});
