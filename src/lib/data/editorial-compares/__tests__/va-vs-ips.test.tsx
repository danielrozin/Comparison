import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExpertAnalysis } from "@/components/comparison/ExpertAnalysis";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { decideComparePage, relatedComparisonSlugs } from "@/lib/compare-slug-resolution";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { HUMAN_REVIEWED_SLUGS, HUMAN_REVIEW_SIGNOFFS } from "@/lib/editorial/human-reviewed";
import { sortComparisonSlug } from "@/lib/utils/slugify";
import {
  getEditorialComparison,
  listEditorialCompareSitemapEntries,
} from "../index";

const SLUG = "va-vs-ips";

const BANNED =
  /this page|page lists|list shows|table lists|page says|article says|on that page|the page|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|\babove\b|\bshown\b|human review|byline|Drafted with AI|\bwinner\b|reddit|highest of any|best monitor|\$\d/i;

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

beforeAll(() => {
  const view = window as Window & {
    matchMedia: typeof window.matchMedia;
    IntersectionObserver: typeof IntersectionObserver;
  };
  if (!view.matchMedia) {
    view.matchMedia = (() => ({
      matches: false,
      media: "",
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

describe("VA vs IPS (ROO-395)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the search-order slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(getEditorialComparison("ips-vs-va")).toBeNull();
    expect(sortComparisonSlug(SLUG)).toBe("ips-vs-va");
    expect(relatedComparisonSlugs("ips-vs-va")).toContain(SLUG);
    expect(
      decideComparePage("ips-vs-va", (candidate) => (candidate === SLUG ? "live" : "missing")),
    ).toEqual({ action: "redirect", destination: SLUG });
    expect(
      decideComparePage(SLUG, (candidate) => (candidate === SLUG ? "live" : "missing")),
    ).toEqual({ action: "render" });

    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-08T00:00:00Z");
    expect(page().metadata.publishedAt).toBe(page().metadata.updatedAt);
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.sourceCount).toBe(2);
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.reviewsAnalyzed).toBeNull();
    expect(page().citationStats?.preferencePercent).toBeNull();
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      "https://www.techspot.com/article/2929-display-tech-lcd-oled/",
      "https://www.displayninja.com/ips-vs-tn-vs-va/",
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual(
      page().citationStats?.sources.map((source) => source.url),
    );
    expect(HUMAN_REVIEWED_SLUGS).toEqual([]);
    expect(HUMAN_REVIEW_SIGNOFFS).toEqual({});
  });

  it("keeps the two-sentence answer, FAQ schema, and Analysis disclosure identical", () => {
    const shortAnswer = page().shortAnswer ?? "";
    const analysis = page().expertAnalysis ?? "";
    const verdict = page().verdict ?? "";
    expect(shortAnswer.split(/(?<=[.!?])\s+/).filter(Boolean)).toHaveLength(2);
    expect(analysis.startsWith(shortAnswer)).toBe(true);
    expect(analysis).toContain("Key takeaways");
    expect(analysis).toContain("Editorial judgment, not a measured purchase optimum");
    expect(verdict).toMatch(/^Editorial judgment, not a measured purchase optimum/);
    expect(analysis).not.toMatch(/Drafted with AI|human-reviewed|FAQ/i);

    const schemas = comparisonPageSchema(page()) as Array<{
      "@type"?: string;
      "@graph"?: Array<{ "@type"?: string; mainEntity?: { name: string; acceptedAnswer?: { text: string } }[] }>;
      mainEntity?: { name: string; acceptedAnswer?: { text: string } }[];
    }>;
    const faqNodes = schemas.flatMap((node) => {
      const graph = node["@graph"] ?? [];
      return [node, ...graph].filter((item) => item["@type"] === "FAQPage");
    });
    expect(faqNodes).toHaveLength(1);
    const main = faqNodes[0].mainEntity ?? [];
    expect(main.map((item) => item.name)).toEqual(page().faqs.map((faq) => faq.question));
    expect(main.map((item) => item.acceptedAnswer?.text)).toEqual(page().faqs.map((faq) => faq.answer));
    const types = schemas.flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
    const authored = JSON.stringify(schemas);
    expect(authored).not.toMatch(/Daniel Rozin|reviewedBy|lastReviewed|isHumanReviewed/);
  });

  it("renders the Analysis heading and a captioned tested-sample table", () => {
    const data = page();
    render(
      <>
        <ExpertAnalysis
          analysis={data.expertAnalysis ?? ""}
          entityAName={data.entities[0].name}
          entityBName={data.entities[1].name}
          updatedAt={data.metadata.updatedAt}
          slug={data.slug}
        />
        <ComparisonTable
          attributes={data.attributes}
          entityA={data.entities[0]}
          entityB={data.entities[1]}
        />
      </>,
    );
    expect(screen.getByRole("heading", { name: "Analysis: VA vs IPS" })).toBeTruthy();
    expect(screen.getByText(/Drafted with AI from web research\./)).toBeTruthy();
    expect(screen.queryByText(/Daniel Rozin/)).toBeNull();
    expect(screen.queryByText(/Human reviewed/)).toBeNull();
    expect(screen.getByText(/Key takeaways/)).toBeTruthy();
    const caption = document.querySelector("caption");
    expect(caption?.textContent).toBe("VA vs IPS — attribute comparison table");
    expect(screen.getAllByText("TechSpot tested sample, 9 December 2024").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3,238:1. Panel count not stated").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Average 0.19 nits").length).toBeGreaterThan(0);
  });

  it("keeps dated sample figures and skips unqualified superiority", () => {
    const text = readerText(page());
    for (const fact of [
      "9 December 2024",
      "3,238:1",
      "1,088:1",
      "10.8 ms",
      "6.9 ms",
      "80 or more",
      "8 to 15 ms",
      "7 ms",
      "4 to 6.5 ms",
      "4 to 10 ms",
      "3 to 4 ms",
      "0.067 nits",
      "0.19 nits",
      "844",
      "595",
      "42 percent",
      "410 nits",
      "394 nits",
      "402 nits",
      "29 percent",
      "21 percent",
      "1,000:1",
      "1,200:1",
      "200-nit",
      "not a 2026",
      "Panel count not stated",
      "Count not stated",
      "did not state how many",
      "advertised 1 ms spec is not",
      "overshoot",
      "IPS glow",
      "29 December 2025",
      "Editorial judgment",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/Odyssey G7|Neo G9|G8/);
    expect(text).not.toMatch(/all modern VA|all IPS panels are fast|every VA panel/i);
    expect(text).toContain("not every Samsung VA");
    expect(text).toContain("IPS varies less");
  });

  it("links three live siblings without copying the OLED vs Mini-LED page", () => {
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "oled-vs-mini-led-gaming-monitor",
      "qd-oled-vs-woled",
      "mini-led-vs-qled",
    ]);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
    }
    expect(page().expertAnalysis).toContain("/compare/oled-vs-mini-led-gaming-monitor");
    expect(page().expertAnalysis).toContain("/compare/qd-oled-vs-woled");
    expect(page().expertAnalysis).toContain("/compare/mini-led-vs-qled");

    const own = page().expertAnalysis ?? "";
    const other = readFileSync("src/lib/data/editorial-compares/oled-vs-mini-led-gaming-monitor.ts", "utf8");
    const qd = readFileSync("src/lib/data/editorial-compares/qd-oled-vs-woled.ts", "utf8");
    const sentences = own.split(/(?<=[.!?])\s+/).filter((sentence) => sentence.length > 80);
    for (const sentence of sentences) {
      expect(other.includes(sentence), sentence).toBe(false);
      expect(qd.includes(sentence), sentence).toBe(false);
    }

    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });

  it("keeps the Analysis disclosure in the shared component, not a human byline", () => {
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    const reviewed = readFileSync("src/lib/editorial/human-reviewed.ts", "utf8");
    expect(reviewed).toContain("export const HUMAN_REVIEWED_SLUGS: string[] = [];");
    expect(reviewed).toContain("export const HUMAN_REVIEW_SIGNOFFS: Record<string, HumanReviewSignoff> = {};");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});
