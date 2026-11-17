import type { ComponentProps } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import ComparisonPage, { getStaticProps } from "@/pages/compare/[slug]";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "brick-vs-opal";
const QUESTION = "Brick vs Opal?";

const SOURCES = [
  "https://getbrick.com/",
  "https://getbrick.com/pages/faq",
  "https://getbrick.com/pages/emergency-unbricks",
  "https://getbrick.com/products/grey-brick",
  "https://getbrick.com/products/brick-night",
  "https://getbrick.com/pages/return-policy",
  "https://opalapp.com/",
  "https://opalapp.com/pricing",
  "https://opalapp.com/android",
  "https://opalapp.com/mac",
  "https://opalapp.com/help/what-is-allow-list",
  "https://theonetap.app/faq",
  "https://apps.apple.com/us/app/onetap-brief-block/id6774352132",
  "https://www.foqos.app/",
  "https://screenzen.co/",
];

/** Reader copy stays on maker wording. No prices, no survey figures, no verdict. */
const BANNED =
  /this page|page lists|list shows|table lists|page says|on that page|the page|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|\babove\b|\bshown\b|human review|byline|Drafted with AI|\bwinner\b|reddit|\bfps\b|better pick|better value|better buy|\$\d|£|€|\bbest\b|worth it|95%|93%|99%|94%|1h 23m/i;

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

describe("Brick vs Opal (ROO-459)", () => {
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
    expect(page().entities.map((entity) => entity.name)).toEqual(["Brick", "Opal", "oneTap"]);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(page().metadata.updatedAt).toBe("2026-11-17T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) {
      expect(diff.winner).toBe("tie");
      expect(diff.winnerIndex).toBe("tie");
    }
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(15);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(SOURCES);
    expect(page().resources?.map((resource) => resource.url)).toEqual(SOURCES);
    expect(page().relatedComparisons).toEqual([]);
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toMatch(/^Choose Brick if/);
    expect(sentences[1]).toMatch(/^Choose Opal if/);
    expect(page().metadata.metaDescription.length).toBeGreaterThanOrEqual(70);
    expect(page().metadata.metaDescription.length).toBeLessThanOrEqual(160);
    expect(getConsolidatedCompareSlug("opal-vs-brick")).toBeNull();
    expect(getConsolidatedCompareSlug("brick-vs-opal-vs-onetap")).toBeNull();
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

    expect(props.comparison.citationStats?.sourceCount).toBe(15);
    expect(props.comparison.citationStats?.dataPointCount).toBe(0);
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "");
    for (const url of [SOURCES[1], SOURCES[3], SOURCES[7], SOURCES[11], SOURCES[12]]) {
      expect(hrefs, url).toContain(url);
    }
    for (const blocked of [
      "opal-vs-brick",
      "brick-vs-opal-vs-onetap",
      "opal-vs-screen-time",
      "brick-vs-screen-time",
    ]) {
      expect(
        hrefs.some((href) => href === `/compare/${blocked}` || href.startsWith(`/compare/${blocked}?`)),
        blocked,
      ).toBe(false);
    }
  }, 30000);

  it("keeps reader copy on maker wording and leaves prices out", () => {
    const text = readerText(page());
    for (const fact of [
      "iOS 18.0",
      "Android 12.0",
      "macOS 13.0",
      "visionOS 2.0",
      "5 seconds",
      "five Emergency Unbricks",
      "you get 5",
      "Strict Mode",
      "subscription-free",
      "10 custom modes",
      "3 Rules",
      "You can't turn Opal off",
      "Allow Only",
      "Allow List",
      "Family Controls",
      "15 minutes to 8 hours",
      "NFC Tag",
      "7 days",
      "9 November 2026",
      "21 December 2026",
      "Black Friday",
      "no card required",
      "annual plan",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(/\$\d/);
    expect(text).toContain("do not call that tap NFC");
    expect(text.match(BANNED)?.[0] ?? null).toBeNull();
    expect(text.match(CORPUS)?.[0] ?? null).toBeNull();
    expect(text).toContain("## Which tool to choose");
    expect(text).toContain("| Situation | Choose Brick if | Choose Opal if | Choose oneTap if |");
  });

  it("redirects the reverse slug and does not publish a three-name alias", async () => {
    expect(getEditorialComparison("opal-vs-brick")).toBeNull();
    const reverse = await getStaticProps({ params: { slug: "opal-vs-brick" } } as never);
    expect(reverse).toMatchObject({
      redirect: { destination: "/compare/brick-vs-opal", statusCode: 301 },
    });
    for (const slug of ["brick-vs-opal-vs-onetap", "onetap-vs-opal", "brick-vs-onetap"]) {
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
    expect(index).toContain("[BRICK_VS_OPAL.slug]: BRICK_VS_OPAL");
    const inbound = index.split("const EDITORIAL_INBOUND_RELATED")[1] ?? "";
    expect(inbound).not.toContain("brick-vs-opal");
  });
});
