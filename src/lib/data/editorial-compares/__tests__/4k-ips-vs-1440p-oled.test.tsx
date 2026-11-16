import type { ComponentProps } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import ComparisonPage, { getStaticProps } from "@/pages/compare/[slug]";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "4k-ips-vs-1440p-oled";
const QUESTION = "4K IPS vs 1440p OLED?";

const FAQ =
  "https://tftcentral.co.uk/articles/the-definitive-oled-frequently-asked-questions-faq";
const BURN =
  "https://tftcentral.co.uk/articles/oled-and-qd-oled-image-retention-and-burn-in-longevity-testing";
const PG32 = "https://tftcentral.co.uk/reviews/asus-rog-swift-pg32ucwm";
const SONY = "https://www.playstation.com/en-us/support/hardware/ps5-4k-resolution-guide/";

const RELATED = [
  "1440p-vs-4k-monitor",
  "qd-oled-vs-woled",
  "va-vs-ips",
  "oled-vs-mini-led-gaming-monitor",
  "27-vs-32-inch-4k-oled",
  "ultrawide-vs-4k-monitor",
];

/** Reader copy stays on the formula and the four cited documents. */
const BANNED =
  /this page|page lists|list shows|table lists|page says|on that page|the page|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|\babove\b|\bshown\b|human review|byline|Drafted with AI|\bwinner\b|reddit|\bfps\b|better pick|better value|better buy|\$\d|£|€|for most gamers/i;

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

describe("4K IPS vs 1440p OLED (ROO-446)", () => {
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
    expect(page().metadata.updatedAt).toBe("2026-11-16T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(4);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([FAQ, BURN, PG32, SONY]);
    expect(page().resources?.slice(0, 4).map((resource) => resource.url)).toEqual([FAQ, BURN, PG32, SONY]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(RELATED);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toMatch(/^Choose a 1440p OLED if/);
    expect(sentences[1]).toMatch(/^Choose a 4K IPS if/);
    expect(page().metadata.metaDescription.length).toBeGreaterThanOrEqual(70);
    expect(page().metadata.metaDescription.length).toBeLessThanOrEqual(160);
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
    const linksSlug = (slug: string) =>
      hrefs.some((href) => href === `/compare/${slug}` || href.startsWith(`/compare/${slug}?`));
    for (const slug of RELATED) expect(linksSlug(slug), slug).toBe(true);
    for (const blocked of ["oled-vs-mini-led", "1440p-vs-4k-27-inch", "1440p-oled-vs-4k-ips"]) {
      expect(linksSlug(blocked), blocked).toBe(false);
    }
  }, 30000);

  it("keeps reader copy on the formula and the cited wording", () => {
    const text = readerText(page());
    for (const fact of [
      "163.18",
      "163.1783",
      "108.79",
      "108.7855",
      "137.68",
      "137.6816",
      "139.87",
      "139.8671",
      "8,294,400",
      "3,686,400",
      "exactly 2.25",
      "14,745,600",
      "4,665,600",
      "19,411,200",
      "4,405.8143",
      "6,553,600",
      "2,073,600",
      "8,627,200",
      "166 PPI",
      "~110 PPI",
      "~140 PPI",
      "140 PPI",
      "5 August 2026",
      "7 August 2026",
      "22 March 2023",
      "16 November 2022",
      "126.5 hours",
      "<1 ms G2G",
      "0.03 ms",
      "1.5x",
      "240 Hz",
      "360 Hz",
      "2160p",
      "4K 120 Hz",
      "accelerated torture test",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text.match(BANNED)?.[0] ?? null).toBeNull();
    expect(text.match(CORPUS)?.[0] ?? null).toBeNull();
    expect(text).not.toMatch(/\$\d/);
    expect(text).toContain("## Which use to choose");
    expect(text).toContain("| Figure | 27-inch 1440p | 27-inch 4K | 31.5-inch 4K | 32.0-inch 4K |");
    expect(text).not.toMatch(/oled-vs-mini-led"|1440p-vs-4k-27-inch/);
  });

  it("does not publish a second nearby slug", async () => {
    expect(getEditorialComparison("1440p-oled-vs-4k-ips")).toBeNull();
    const reverse = await getStaticProps({ params: { slug: "1440p-oled-vs-4k-ips" } } as never);
    expect(reverse).toMatchObject({
      redirect: { destination: "/compare/4k-ips-vs-1440p-oled", statusCode: 301 },
    });
    for (const slug of ["4k-ips-vs-1440p-oled-monitor", "ips-4k-vs-oled-1440p"]) {
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
    const index = readFileSync("src/lib/data/editorial-compares/index.ts", "utf8");
    expect(index).toContain("[MONITOR_4K_IPS_VS_1440P_OLED.slug]: MONITOR_4K_IPS_VS_1440P_OLED");
    const inbound = index.split("const EDITORIAL_INBOUND_RELATED")[1] ?? "";
    expect(inbound).not.toContain("4k-ips-vs-1440p-oled");
  });
});
