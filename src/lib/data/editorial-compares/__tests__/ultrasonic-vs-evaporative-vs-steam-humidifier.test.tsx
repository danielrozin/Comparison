import type { ComponentProps } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import ComparisonPage, { getStaticProps } from "@/pages/compare/[slug]";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import { classifyAffiliateCompare } from "@/lib/affiliate/buyable-compare";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "ultrasonic-vs-evaporative-vs-steam-humidifier";
const QUESTION = "Ultrasonic vs evaporative vs steam humidifier";

const SOURCES = [
  "https://www.epa.gov/indoor-air-quality-iaq/use-and-care-home-humidifiers",
  "https://www.cpsc.gov/s3fs-public/5046.pdf",
];

/**
 * Reader copy stays on EPA and CPSC wording. The shared reader-copy test bans "checked".
 */
const CORPUS =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|returned 404|this comparison|this page|\bwinner\b|better pick|better value|better buy|human review|byline|reviewed by|\bbest\b|\bquiet\b|\bsafest\b|\$\d|\bdB\b/i;

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

describe("Ultrasonic vs evaporative vs steam humidifier (ROO-472)", () => {
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
    expect(page().entities.map((entity) => entity.name)).toEqual([
      "Ultrasonic humidifier",
      "Evaporative humidifier",
      "Steam humidifier",
    ]);
    expect(page().entities.every((entity) => entity.bestFor === null)).toBe(true);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(page().metadata.updatedAt).toBe("2026-11-19T00:00:00Z");
    expect(page().category).toBe("home");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) {
      expect(diff.winner).toBe("tie");
      expect(diff.winnerIndex).toBe("tie");
      expect(diff.values).toHaveLength(3);
    }
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(2);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(SOURCES);
    expect(page().resources?.map((resource) => resource.url)).toEqual(SOURCES);
    expect(page().relatedComparisons).toEqual([]);
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toMatch(/^Choose an evaporative humidifier if/);
    expect(sentences[1]).toMatch(/^Choose a steam humidifier if/);
    expect(page().metadata.metaDescription.length).toBeGreaterThanOrEqual(70);
    expect(page().metadata.metaDescription.length).toBeLessThanOrEqual(160);
    expect(getConsolidatedCompareSlug(SLUG)).toBeNull();
    expect(getConsolidatedCompareSlug("ultrasonic-vs-evaporative-humidifier")).toBeNull();
    expect(getConsolidatedCompareSlug("evaporative-vs-ultrasonic-humidifier")).toBeNull();
    expect(getEditorialComparison("ultrasonic-vs-evaporative-humidifier")).toBeNull();
    expect(
      classifyAffiliateCompare({
        slug: SLUG,
        category: page().category,
        entities: page().entities,
      }),
    ).toEqual({ buyable: false, reason: "category-not-buyable" });
  });

  it("runs the compare page path for title, hero H1, Article headline, and FAQ text", async () => {
    const result = await getStaticProps({ params: { slug: SLUG } } as never);
    expect(result).toHaveProperty("props");
    if (!("props" in result)) return;
    const props = result.props as {
      comparison: ReturnType<typeof page>;
      meta: { title: string; description: string; indexable: boolean };
      jsonLd: string;
    };

    expect(props.meta.indexable).toBe(true);
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
    expect(screen.getByText(/No row is a ranked result/)).toBeInTheDocument();
    expect(document.querySelectorAll("th[scope='col']").length).toBeGreaterThan(0);
    expect(document.querySelectorAll("th[scope='row']").length).toBeGreaterThan(0);

    const visibleFaqs = screen.getAllByText(
      (_, node) => node?.classList?.contains("faq-answer") ?? false,
    );
    expect(visibleFaqs.map((node) => node.textContent)).toEqual(page().faqs.map((faq) => faq.answer));

    const documentJson = JSON.parse(props.jsonLd) as JsonNode;
    const flat = nodesOf(documentJson);
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
    expect(JSON.stringify(documentJson)).not.toMatch(/Daniel Rozin|isHumanReviewed|lastReviewed/);

    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "");
    for (const url of SOURCES) expect(hrefs, url).toContain(url);
    expect(hrefs.some((href) => href.includes("ultrasonic-vs-evaporative-humidifier"))).toBe(false);
    expect(hrefs.some((href) => /amazon|amzn\.to/i.test(href))).toBe(false);
  }, 30000);

  it("keeps reader copy on EPA and CPSC wording and leaves noise, output, and price out", () => {
    const text = readerText(page());
    for (const fact of [
      "generally disperse less, if any",
      "greatest dispersions of both microorganisms and minerals",
      "not expected to disperse substantial amounts of minerals",
      "3% solution of hydrogen peroxide",
      "every third day",
      "50 percent",
      "30% and 50%",
      "above 60%",
      "steam and boiling water may cause burns",
      "certain type of inflammation of the lungs",
      "particles small enough to enter the lungs",
      "distilled or demineralized",
      "not medical advice",
      "read on 19 November 2026",
      "April 29, 2026",
      "did not load on 19 November 2026",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(/\bquiet\b|\bsafest\b|\bbest\b|\$\d|\bdB\b|\d+\s*gallons|\d+\s*watts?/i);
    expect(text.match(CORPUS)?.[0] ?? null).toBeNull();
    expect(text).toContain("## Which humidifier type to choose");
    expect(text).toContain("| Situation | Choose ultrasonic if | Choose evaporative if | Choose steam if |");
    expect(text).not.toMatch(/\bchecked\b/i);
  });

  it("keeps the Analysis disclosure in the shared component, not a human byline", () => {
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
    const index = readFileSync("src/lib/data/editorial-compares/index.ts", "utf8");
    expect(index).toContain(
      "[ULTRASONIC_VS_EVAPORATIVE_VS_STEAM_HUMIDIFIER.slug]: ULTRASONIC_VS_EVAPORATIVE_VS_STEAM_HUMIDIFIER",
    );
    const inbound = index.split("const EDITORIAL_INBOUND_RELATED")[1] ?? "";
    expect(inbound).not.toContain(SLUG);
    expect(readFileSync("src/lib/editorial/human-reviewed.ts", "utf8")).toContain(
      "export const HUMAN_REVIEWED_SLUGS: string[] = [];",
    );
  });
});
