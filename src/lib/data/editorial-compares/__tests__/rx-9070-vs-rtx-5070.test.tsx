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

const SLUG = "rx-9070-vs-rtx-5070";
const QUESTION = "RX 9070 vs RTX 5070 at 1440p";

const AMD_9070 =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html";
const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-2-28-amd-unveils-next-generation-amd-rdna-4-architectu.html";
const NV_FAMILY = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_NEWS =
  "https://nvidianews.nvidia.com/news/nvidia-blackwell-geforce-rtx-50-series-opens-new-world-of-ai-computer-graphics";
const NV_ARCH =
  "https://images.nvidia.com/aem-dam/Solutions/geforce/blackwell/nvidia-rtx-blackwell-gpu-architecture.pdf";
const TECHSPOT_OCT = "https://www.techspot.com/review/3044-nvidia-rtx-5070-vs-amd-radeon-9070-dlss-fsr/";
const TECHSPOT_MAR = "https://www.techspot.com/review/2962-amd-radeon-9070/";
const TOMS = "https://www.tomshardware.com/pc-components/gpus/nvidia-rtx-5070-vs-amd-rx-9070-face-off";
const GN =
  "https://gamersnexus.net/gpus/incredibly-efficient-amd-rx-9070-gpu-review-benchmarks-vs-9070-xt-rtx-5070";

const SOURCES = [AMD_9070, AMD_PR, NV_FAMILY, NV_NEWS, NV_ARCH, TECHSPOT_OCT, TECHSPOT_MAR, TOMS, GN];

const DRAFT_ONLY = ["rtx-5070-vs-rtx-5070-ti", "rtx-5070-ti-vs-rx-9070-xt", "rx-9070-xt-vs-rx-7900-xtx"];

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|this page|\bwinner\b|\bbest\b|better value|better buy|better pick|worth it|headroom|reddit|r\/buildapc|\$550|usually the better/i;

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

describe("RX 9070 vs RTX 5070 at 1440p (ROO-412)", () => {
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
    // The ticket URL is rx-9070-vs-rtx-5070. Alphabetical order is the other
    // 404, rtx-5070-vs-rx-9070, and that slug is not registered.
    expect(SLUG).toBe("rx-9070-vs-rtx-5070");
    expect(sortComparisonSlug(SLUG)).toBe("rtx-5070-vs-rx-9070");
    expect(getEditorialComparison("rtx-5070-vs-rx-9070")).toBeNull();
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    expect(page().metadata.updatedAt).toBe("2026-11-11T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(9);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(SOURCES);
    expect(page().resources?.map((resource) => resource.url)).toEqual(SOURCES);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "rtx-5070-vs-rx-9070-xt",
      "rx-9070-vs-rx-9070-xt",
      "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      "rx-9060-xt-vs-rx-9070",
    ]);
    for (const slug of DRAFT_ONLY) {
      expect(page().relatedComparisons.map((item) => item.slug)).not.toContain(slug);
    }
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(page().shortAnswer).toMatch(/Neither card is right for everyone/);
    expect(page().shortAnswer).toMatch(/Choose the Radeon RX 9070 if/);
    expect(page().shortAnswer).toMatch(/choose the GeForce RTX 5070 if/);
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
    expect(page().citationStats?.sourceCount).toBe(9);
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    const articles = flat.filter((node) => typeOf(node).includes("Article"));
    for (const article of articles) {
      expect(article.author?.name ?? article.author).not.toBe("Daniel Rozin");
      expect(article.reviewedBy).toBeUndefined();
      expect(article.isHumanReviewed).toBeUndefined();
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
    expect(hrefs.some((href) => href.startsWith("/compare/rx-9070-vs-rx-9070-xt"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/rtx-5070-vs-rx-9070-xt"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/rx-9060-xt-vs-rx-9070"))).toBe(true);
    for (const slug of DRAFT_ONLY) {
      expect(hrefs.some((href) => href.includes(slug))).toBe(false);
    }
  }, 30000);

  it("cites vendor specs and dated review margins without a street price or a value crown", () => {
    const text = readerText(page());
    for (const fact of [
      "3,584",
      "6,144",
      "2070 MHz",
      "2520 MHz",
      "2.1 GHz",
      "2.5 GHz",
      "16 GB",
      "12 GB",
      "GDDR6",
      "GDDR7",
      "256-bit",
      "192-bit",
      "640 GB/s",
      "672 GB/sec",
      "20 Gbps",
      "28 Gbps",
      "64 MB",
      "2.51 GHz",
      "2.33 GHz",
      "220 W",
      "250 W",
      "650 W",
      "988",
      "1,406",
      "94 TFLOPS",
      "DLSS 4",
      "DLSS 5",
      "FSR \"Redstone\"",
      "FSR 4",
      "over 30 games",
      "75",
      "13%",
      "23 games",
      "4%",
      "18 games",
      "roughly 11%",
      "6% faster",
      "16% slower",
      "8% faster",
      "8.2%",
      "0.23%",
      "68%",
      "2.2x",
      "70%",
      "0% to 18%",
      "21%",
      "126 FPS",
      "55%",
      "73 FPS",
      "47 FPS",
      "78 FPS",
      "15%",
      "96 FPS",
      "83 FPS",
      "172 FPS",
      "152 FPS",
      "24%",
      "63 FPS",
      "224 W",
      "$549",
      "$749",
      "6 January 2025",
      "28 February 2025",
      "21 October 2025",
      "7 March 2025",
      "29 May 2025",
      "12 May 2025",
      "11 November 2026",
      "Ryzen 7 9800X3D",
      "Ryzen 9 9950X",
      "581.57",
      "25.10.1",
      "572.60",
      "24.12.1",
      "24.30.31.03",
      "Stellar Blade",
      "Black Myth: Wukong",
      "Dying Light 2",
      "Final Fantasy 14: Dawntrail",
      "Indiana Jones and the Great Circle",
      "4K",
      "Choose the RX 9070 if",
      "Choose the RTX 5070 if",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).toMatch(/Neither card is right for everyone/);
    expect(text).toMatch(/0% to 18%/);
    expect(text).toMatch(/4K raster range/);
    expect(text).toMatch(/placeholder Starting at \$XXX\.XX/);
    expect(text).not.toMatch(/rtx-5070-vs-rtx-5070-ti/);
    expect(text).not.toMatch(/rtx-5070-ti-vs-rx-9070-xt/);
    expect(text).not.toMatch(/rx-9070-xt-vs-rx-7900-xtx/);
  });
});
