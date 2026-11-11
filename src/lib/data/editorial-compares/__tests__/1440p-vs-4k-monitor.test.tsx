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

const SLUG = "1440p-vs-4k-monitor";
const QUESTION = "1440p vs 4K at 27 Inches?";

const DELL =
  "https://dl.dell.com/content/manual12109242-dell-u2723qe-monitor-user-s-guide.pdf";
const ASUS =
  "https://www.asus.com/displays-desktops/monitors/proart/proart-display-pa278cgv/techspec/";
const MICROSOFT =
  "https://learn.microsoft.com/en-us/windows/win32/learnwin32/dpi-and-device-independent-pixels";

/** Reader copy stays on the grids, the formula, and the cited docs. */
const BANNED =
  /this page|page lists|list shows|table lists|page says|on that page|the page|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|\babove\b|\bshown\b|human review|byline|Drafted with AI|\bwinner\b|reddit|sharper|eyesight|\beyes\b|\bfps\b|spoil|better buy|worth it|most people/i;

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

describe("1440p vs 4K at 27 inches (ROO-400)", () => {
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
    expect(page().faqs).toHaveLength(5);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(page().metadata.updatedAt).toBe("2026-11-09T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(3);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([DELL, ASUS, MICROSOFT]);
    expect(page().resources?.slice(0, 3).map((resource) => resource.url)).toEqual([DELL, ASUS, MICROSOFT]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "qd-oled-vs-woled",
      "oled-vs-mini-led-gaming-monitor",
    ]);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
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

    const dataset = flat.find((node) => typeOf(node).includes("Dataset"));
    expect(dataset?.description).toContain("3 sources and 0 data points");
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "");
    expect(hrefs.some((href) => href.startsWith("/compare/qd-oled-vs-woled"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/oled-vs-mini-led-gaming-monitor"))).toBe(true);
  }, 30000);

  it("keeps reader copy on sourced arithmetic and skips the unproven buying claims", () => {
    const text = readerText(page());
    for (const fact of [
      "8,294,400",
      "3,686,400",
      "2.25",
      "108.79",
      "163.18",
      "108.7855",
      "163.1783",
      "6,553,600",
      "2,073,600",
      "8,627,200",
      "14,745,600",
      "4,665,600",
      "19,411,200",
      "2,937.21",
      "4,405.81",
      "96 DPI",
      "144 DPI",
      "1.5",
      "Rev. A05",
      "September 2023",
      "27.0",
      "109",
      "144 Hz",
      "60 Hz",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text.match(BANNED)?.[0] ?? null).toBeNull();
    expect(text).not.toMatch(/\$\d/);
    expect(text).not.toMatch(/macOS looks|HiDPI|2x density/i);
  });

  it("redirects the reverse slug and does not publish a second nearby page", async () => {
    const reverse = await getStaticProps({ params: { slug: "4k-monitor-vs-1440p" } } as never);
    expect(reverse).toMatchObject({
      redirect: { destination: "/compare/1440p-vs-4k-monitor", statusCode: 301 },
    });
    for (const slug of ["1440p-vs-4k", "4k-vs-1440p", "qhd-vs-4k", "2k-vs-4k"]) {
      expect(getEditorialComparison(slug)).toBeNull();
      const nearby = await getStaticProps({ params: { slug } } as never);
      expect(nearby, slug).toHaveProperty("notFound", true);
    }
  }, 30000);

  it("keeps the Analysis disclosure in the shared component, not a human byline", () => {
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});
