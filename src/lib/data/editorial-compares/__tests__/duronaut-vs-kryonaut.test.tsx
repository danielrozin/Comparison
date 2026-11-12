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

const SLUG = "duronaut-vs-kryonaut";
const QUESTION = "Duronaut vs Kryonaut Thermal Paste";

const TG_DURONAUT = "https://www.thermal-grizzly.com/en/duronaut/s-tg-d-002";
const TG_KRYONAUT = "https://www.thermal-grizzly.com/en/kryonaut/s-tg-k-100-r";
const TG_DURONAUT_PRO = "https://www.thermal-grizzly.com/en/duronaut-pro/s-tg-dp-002-r";
const TG_KRYONAUT_EXTREME = "https://www.thermal-grizzly.com/en/kryonaut-extreme/s-tg-ke-002-r";
const IGOR_COMPARE =
  "https://www.igorslab.de/en/thermal-grizzly-duronaut-thermal-paste-review-kryonaut-was-yesterday-welcome-to-the-top-10-of-all-pastes/5/";
const IGOR_DURABILITY =
  "https://www.igorslab.de/en/thermal-grizzly-duronaut-thermal-paste-review-kryonaut-was-yesterday-welcome-to-the-top-10-of-all-pastes/4/";
const NOCTUA_FEATURES = "https://www.noctua.at/en/products/nh-d15-g2/features";
const NOCTUA_SPECS = "https://www.noctua.at/en/products/nh-d15-g2/specifications";

const SOURCES = [
  TG_DURONAUT,
  TG_KRYONAUT,
  TG_DURONAUT_PRO,
  TG_KRYONAUT_EXTREME,
  IGOR_COMPARE,
  IGOR_DURABILITY,
  NOCTUA_FEATURES,
  NOCTUA_SPECS,
];

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|this page|returned 404|\bwinner\b|better pick|better buy|better value|worth it|for most people|warm water|reddit|r\/buildapc|r\/PcBuild|\$\d|€|9 euros|few degrees|spreads more easily/i;

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

describe("Duronaut vs Kryonaut (ROO-421)", () => {
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
    expect(page().metadata.updatedAt).toBe("2026-11-12T00:00:00Z");
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
    expect(page().resources?.map((resource) => resource.url)).toEqual(SOURCES);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
      "ryzen-7-9700x-vs-ryzen-7-9800x3d",
    ]);
    for (const slug of ["duronaut-vs-duronaut-pro", "kryonaut-vs-kryonaut-extreme", "kryonaut-vs-duronaut", "thermal-paste"]) {
      expect(page().relatedComparisons.map((item) => item.slug)).not.toContain(slug);
    }
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(page().shortAnswer).toMatch(/Choose Duronaut if/);
    expect(page().shortAnswer).toMatch(/choose Kryonaut if/);
    expect(page().shortAnswer).toMatch(/Neither paste is right for every PC/);
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
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(JSON.stringify(schemas)).not.toMatch(/Daniel Rozin/);
    expect(JSON.stringify(schemas)).not.toMatch(/aggregateRating/);
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
    expect(hrefs.some((href) => href.startsWith("/compare/ryzen-7-7800x3d-vs-ryzen-7-9800x3d"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/ryzen-7-9700x-vs-ryzen-7-9800x3d"))).toBe(true);
    expect(hrefs.some((href) => href.includes("duronaut-vs-duronaut-pro"))).toBe(false);
    expect(hrefs.some((href) => href.includes("kryonaut-vs-kryonaut"))).toBe(false);
  }, 30000);

  it("keeps lab conductivity, choose-if copy, and prices inside the source limits", () => {
    const text = readerText(page());
    expect(text).not.toMatch(BANNED);
    expect(text).toMatch(/Choose Duronaut if/);
    expect(text).toMatch(/Choose Kryonaut if/);
    expect(text).toMatch(/has not published general W\/\(m·K\) ratings since the end of 2020/);
    expect(text).toMatch(/Prototype 2024/);
    expect(text).toMatch(/4\.9 W\/m·K/);
    expect(text).toMatch(/3\.2 W\/m·K/);
    expect(text).toMatch(/\+55\.0%/);
    expect(text).toMatch(/7 February 2025/);
    expect(text).toMatch(/hair dryer/i);
    expect(text).toMatch(/Check current price/);
    expect(text).toMatch(/No CPU temperature/);
    expect(text).toMatch(/NT-H2/);
    expect(text).toMatch(/medium durability, not for graphics cards/);
    expect(text).not.toMatch(/sources and 0 data points/i);
  });
});
