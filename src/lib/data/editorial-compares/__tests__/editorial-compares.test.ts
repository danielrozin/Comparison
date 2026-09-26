import { describe, it, expect } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { isDegenerateComparisonSlug } from "@/lib/utils/slugify";
import type { ComparisonPageData } from "@/types";
import {
  appendEditorialRelatedLinks,
  getEditorialComparison,
  isEditorialCompareSlug,
  listEditorialCompareSlugs,
  listEditorialCompareSitemapEntries,
} from "../index";

const SIGNAL_FAQS = [
  "Is Signal more private than WhatsApp?",
  "Does WhatsApp use the Signal Protocol?",
  "Which is better for group chats?",
  "Can I use Signal or WhatsApp without a phone number?",
  "Which is better for international / family chats?",
  "Signal vs WhatsApp for business — which should teams use?",
  "Are both end-to-end encrypted by default?",
];

const MESSAGING_SLUGS = [
  "signal-vs-telegram",
  "signal-vs-whatsapp",
  "whatsapp-vs-telegram",
];

function schemaNodes(page: ComparisonPageData): Record<string, unknown>[] {
  const schemas = comparisonPageSchema(page) as Array<Record<string, unknown>>;
  const nodes: Record<string, unknown>[] = [];
  const visit = (node: Record<string, unknown>) => {
    nodes.push(node);
    const graph = node["@graph"];
    if (!Array.isArray(graph)) return;
    for (const child of graph) {
      if (child && typeof child === "object") visit(child as Record<string, unknown>);
    }
  };
  for (const node of schemas) visit(node);
  return nodes;
}

function faqQuestions(page: ComparisonPageData): string[] {
  const faq = schemaNodes(page).find((node) => node["@type"] === "FAQPage");
  const main = (faq?.mainEntity ?? []) as { name: string }[];
  return main.map((item) => item.name);
}

function speakableSelectors(page: ComparisonPageData): string[] {
  const selectors: string[] = [];
  for (const node of schemaNodes(page)) {
    const speakable = node.speakable as { cssSelector?: string[] } | undefined;
    if (speakable?.cssSelector) selectors.push(...speakable.cssSelector);
  }
  return selectors;
}

function pageText(page: ComparisonPageData): string {
  return [
    page.shortAnswer,
    page.verdict,
    page.expertAnalysis,
    page.quickAnswer?.tldr,
    page.quickAnswer?.keyFact,
    page.quickAnswer?.winnerReason,
    ...page.faqs.map((faq) => `${faq.question} ${faq.answer}`),
    ...page.entities.flatMap((entity) => [...entity.pros, ...entity.cons, entity.shortDesc ?? ""]),
    ...page.attributes.flatMap((attr) => attr.values.map((value) => value.valueText ?? "")),
  ].join("\n");
}

describe("ROO-27 editorial messaging compares", () => {
  it("registers the three messaging slugs as published catalog pages", () => {
    const slugs = listEditorialCompareSlugs();
    for (const slug of MESSAGING_SLUGS) {
      expect(slugs).toContain(slug);
    }
    for (const slug of MESSAGING_SLUGS) {
      expect(isEditorialCompareSlug(slug)).toBe(true);
      const page = getEditorialComparison(slug);
      expect(page?.metadata.status).toBe("published");
      expect(page?.entities.length).toBe(2);
      expect(page?.faqs.length).toBeGreaterThanOrEqual(7);
      expect(page?.quickAnswer?.tldr).toBeTruthy();
      expect(page?.shortAnswer).toBe(page?.quickAnswer?.tldr);
    }
  });

  it("keeps Signal vs WhatsApp FAQ questions 1:1 with the writer brief", () => {
    const page = getEditorialComparison("signal-vs-whatsapp");
    expect(page).toBeTruthy();
    expect(page!.faqs.map((f) => f.question)).toEqual(SIGNAL_FAQS);
    expect(page!.title).toMatch(/Signal vs WhatsApp/);
    expect(/[0-9.]+\s*(billion|million|B\+|M\+)/i.test(page!.shortAnswer ?? "")).toBe(
      false
    );
  });

  it("emits FAQPage JSON-LD from the same visible FAQ list", () => {
    const page = getEditorialComparison("signal-vs-whatsapp")!;
    const schemas = comparisonPageSchema(page) as Array<{
      "@type"?: string;
      mainEntity?: { name: string }[];
    }>;
    const faq = schemas.find((n) => n["@type"] === "FAQPage");
    expect(faq).toBeTruthy();
    expect((faq?.mainEntity ?? []).map((q) => q.name)).toEqual(SIGNAL_FAQS);
  });

  it("lists every editorial slug for sitemap / entity discovery", () => {
    const slugs = listEditorialCompareSitemapEntries().map((e) => e.slug);
    expect(slugs).toContain("signal-vs-whatsapp");
    expect(slugs).toContain("signal-vs-telegram");
    expect(slugs).toContain("whatsapp-vs-telegram");
  });
});

const IPHONE_SLUG = "iphone-17-vs-iphone-17-pro-vs-iphone-16-pro";
const IPHONE_FAQS = [
  "Is the 17 Pro worth it over the 17?",
  "Is the 16 Pro better than the 17?",
  "Which is best for video?",
  "Should I buy the 18 Pro instead?",
  "Is buying refurbished safe?",
  "Which lasts the most years?",
];
const IPHONE_QUICK_ANSWER =
  "For most people upgrading from an older phone who want good battery life, years of updates and solid video without Pro prices, the iPhone 17 is the best value. Pick the iPhone 17 Pro if you shoot a lot of video and want the longer telephoto zoom, faster USB 3 transfers and more battery. Pick the iPhone 16 Pro only if a refurbished unit is clearly cheaper.";

describe("ROO-92 iPhone 17 vs 17 Pro vs 16 Pro", () => {
  const page = () => getEditorialComparison(IPHONE_SLUG)!;

  it("publishes the requested 3-way slug with a split verdict", () => {
    expect(isEditorialCompareSlug(IPHONE_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(IPHONE_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual([
      "iphone-17",
      "iphone-17-pro",
      "iphone-16-pro",
    ]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().shortAnswer).toBe(IPHONE_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(IPHONE_QUICK_ANSWER);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(IPHONE_SLUG);
  });

  it("keeps FAQ questions 1:1 and emits FAQPage plus speakable selectors", () => {
    expect(page().faqs.map((faq) => faq.question)).toEqual(IPHONE_FAQS);
    expect(faqQuestions(page())).toEqual(IPHONE_FAQS);
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites the listed spec pages and links the existing related compare", () => {
    const urls = (page().citationStats?.sources ?? []).map((source) => source.url);
    expect(urls).toEqual(
      expect.arrayContaining([
        "https://www.apple.com/iphone-17/specs/",
        "https://support.apple.com/en-us/125090",
        "https://support.apple.com/en-us/121031",
        "https://www.apple.com/newsroom/2025/09/apple-debuts-iphone-17/",
        "https://www.apple.com/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/",
        "https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/",
        "https://appleinsider.com/inside/iphone-17/vs/iphone-17-pro-vs-iphone-16-pro---the-new-top-tier-compared",
        "https://www.gsmarena.com/compare.php3?idPhone1=14050&idPhone2=14049&idPhone3=13315",
        "https://www.apple.com/shop/refurbished/iphone",
        "https://www.reddit.com/r/AppleWhatShouldIBuy/comments/1wqfipl/which_one_should_i_get_iphone_17_vs_17_pro_vs_16/",
      ])
    );
    expect(page().resources?.map((resource) => resource.url)).toEqual(urls);
    expect(page().relatedComparisons.map((item) => item.slug)).toContain(
      "iphone-17-pro-vs-pro-max"
    );
    expect(pageText(page())).not.toMatch(/\bu\/[A-Za-z0-9_-]+/);
    expect(findSelfContradictions(page())).toEqual([]);
  });
});

const PANTS_SLUG = "carhartt-vs-dickies";
const PANTS_FAQS = [
  "Which is more durable?",
  "What's the difference between the B01 and the 874?",
  "Do Carhartt pants run big?",
  "Which is better for skateboarding or casual wear?",
  "Can you use knee pads?",
  "Are there more durable alternatives?",
];
const PANTS_QUICK_ANSWER =
  "For pure durability, Carhartt's duck-canvas work pants (like the B01 Double-Front) usually outlast Dickies' classic 874. Carhartt uses heavy 12-oz 100% cotton duck; the 874 is lighter 8.5-oz poly/cotton twill. Dickies wins for a lighter, wrinkle- and stain-resistant pant with a short break-in, better for uniform or indoor work than abrasive job sites.";

describe("ROO-93 Carhartt vs Dickies", () => {
  const page = () => getEditorialComparison(PANTS_SLUG)!;

  it("publishes a split work-pants compare with no price and no winner crown", () => {
    expect(isEditorialCompareSlug(PANTS_SLUG)).toBe(true);
    expect(page().metadata.status).toBe("published");
    expect(page().category).toBe("brands");
    expect(page().entities.map((entity) => entity.slug)).toEqual(["carhartt", "dickies"]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().shortAnswer).toBe(PANTS_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(PANTS_QUICK_ANSWER);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(PANTS_SLUG);
    expect(pageText(page())).not.toMatch(/\$\d/);
    expect(pageText(page())).not.toMatch(/\bu\/[A-Za-z0-9_-]+/);
    expect(pageText(page())).not.toMatch(/accepts knee pads/i);
    expect(findSelfContradictions(page())).toEqual([]);
  });

  it("keeps FAQ questions 1:1 and emits FAQPage plus speakable selectors", () => {
    expect(page().faqs.map((faq) => faq.question)).toEqual(PANTS_FAQS);
    expect(faqQuestions(page())).toEqual(PANTS_FAQS);
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites Dickies, Gear Patrol, and the Reddit thread, and cross-links Patagonia", () => {
    const urls = (page().citationStats?.sources ?? []).map((source) => source.url);
    expect(urls).toEqual([
      "https://www.dickies.com/en-us/products/original-874-r-work-pants-dk0008740gh",
      "https://www.gearpatrol.com/style/a37114165/carhartt-dickies-double-knee-work-pants/",
      "https://www.reddit.com/r/BuyItForLife/comments/1wp1i7e/which_pants_are_biflier_carhartt_or_dickies/",
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual(urls);
    expect(page().relatedComparisons.map((item) => item.slug)).toContain("patagonia-vs-rei");
  });

  it("appends the Carhartt compare onto Patagonia vs REI without duplicating it", () => {
    const base = {
      slug: "patagonia-vs-rei",
      relatedComparisons: [{ slug: "nike-vs-adidas", title: "Nike vs Adidas", category: "brands" }],
    } as ComparisonPageData;
    const once = appendEditorialRelatedLinks(base);
    expect(once.relatedComparisons.map((item) => item.slug)).toEqual([
      "nike-vs-adidas",
      "carhartt-vs-dickies",
    ]);
    const twice = appendEditorialRelatedLinks(once);
    expect(twice.relatedComparisons).toHaveLength(2);
    expect(appendEditorialRelatedLinks(page())).toBe(page());
  });
});
