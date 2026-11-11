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
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "rtx-5070-vs-rtx-5070-ti";
const QUESTION = "RTX 5070 vs RTX 5070 Ti";

const NV_FAMILY = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_NEWS =
  "https://nvidianews.nvidia.com/news/nvidia-blackwell-geforce-rtx-50-series-opens-new-world-of-ai-computer-graphics";
const NV_OUT = "https://www.nvidia.com/en-us/geforce/news/rtx-5070-out-now/";
const TOMS = "https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|this page|returned 404|\bwinner\b|\bbest\b|better value|worth it|reddit|r\/buildapc|headroom|749\.99|549\.99|599\.99|869\.99|1,499|20–30|20-30%|most games|for years|Micro Center/i;

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

describe("RTX 5070 vs RTX 5070 Ti (ROO-408)", () => {
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
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([NV_FAMILY, NV_NEWS, NV_OUT, TOMS]);
    expect(page().resources?.map((resource) => resource.url)).toEqual([NV_FAMILY, NV_NEWS, NV_OUT, TOMS]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      "rtx-5070-vs-rx-9070-xt",
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).not.toContain("rtx-5070-ti-vs-rx-9070-xt");
    expect(page().relatedComparisons.map((item) => item.slug)).not.toContain("1440p-vs-4k-monitor");
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(page().shortAnswer).toMatch(/Neither card is right for everyone/);
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
    expect(page().citationStats?.sourceCount).toBe(4);
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(JSON.stringify(schemas)).not.toMatch(/Daniel Rozin/);
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
    expect(hrefs.some((href) => href.startsWith("/compare/rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/rtx-5070-vs-rx-9070-xt"))).toBe(true);
    // #521 (rtx-5070-ti-vs-rx-9070-xt) and #524 (1440p-vs-4k-monitor) are live now, so a
    // site-generated link to them is fine. This page's own relatedComparisons still leave them out.
    for (const slug of ["rtx-5070-ti-vs-rx-9070-xt", "1440p-vs-4k-monitor"]) {
      if (hrefs.some((href) => href.includes(slug))) {
        expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
      }
    }
  }, 30000);

  it("cites NVIDIA specs and one Tom's suite without a street price or a value crown", () => {
    const text = readerText(page());
    for (const fact of [
      "8,960",
      "6,144",
      "16 GB",
      "12 GB",
      "GDDR7",
      "256-bit",
      "192-bit",
      "2.45 GHz",
      "2.51 GHz",
      "2.3 GHz",
      "2.33 GHz",
      "1,406",
      "988",
      "133 TFLOPS",
      "94 TFLOPS",
      "300 W",
      "250 W",
      "750 W",
      "650 W",
      "DLSS 4",
      "DLSS 5",
      "116.8",
      "96.4",
      "68.6",
      "54.3",
      "66.2",
      "51.5",
      "155.4",
      "132.6",
      "90.4",
      "74.1",
      "36.7",
      "22.7",
      "156.6",
      "116.5",
      "65.8",
      "77.8",
      "55.5",
      "30.1",
      "0.3 fps",
      "2.8 fps",
      "0.2116",
      "21.2 percent",
      "0.2634",
      "26.3 percent",
      "0.2854",
      "28.5 percent",
      "0.3643",
      "36.4 percent",
      "$749",
      "$549",
      "6 January 2025",
      "5 March 2025",
      "Founders Edition",
      "native resolution",
      "eight RT titles",
      "24 June 2026",
      "10 November 2026",
      "Ryzen 9 9950X",
      "Ryzen 7 9800X3D",
      "geometric mean",
      "11 raster games",
      "without enabling DLSS, FSR, or XeSS",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/6\.41|5\.70|dollars per frame|shop block/i);
    expect(text).not.toMatch(/available starting February 2025/);
    expect(text).toMatch(/would be available starting in February/);
    expect(text).toMatch(/Neither card is right for everyone/);
    expect(text).toMatch(/Choose the RTX 5070 Ti if/);
    expect(text).toMatch(/Choose the RTX 5070 if/);
    expect(text).toMatch(/no lifespan is stated|no lifespan is stated|No source opened for this draft measures how long/);
    expect(text).not.toMatch(/rtx-5070-ti-vs-rx-9070-xt/);
  });
});
