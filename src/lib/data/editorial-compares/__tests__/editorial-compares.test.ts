import { describe, it, expect } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
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
        "https://www.apple.com/iphone/compare/",
        "https://appleinsider.com/inside/iphone-17/vs/iphone-17-pro-vs-iphone-16-pro---the-new-top-tier-compared",
        "https://www.gsmarena.com/compare.php3?idPhone1=14050&idPhone2=14049&idPhone3=13315",
        "https://www.apple.com/shop/refurbished/iphone",
        "https://www.reddit.com/r/AppleWhatShouldIBuy/comments/1wqfipl/which_one_should_i_get_iphone_17_vs_17_pro_vs_16/",
      ])
    );
    expect(page().resources?.map((resource) => resource.url)).toEqual(urls);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "iphone-17-pro-vs-pro-max",
    ]);
    expect(pageText(page())).toMatch(
      /iPhone 17 Pro, like the iPhone 16 Pro, is mostly a refurbished or third-party purchase/
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
    expect(pageText(page())).not.toMatch(/not confirmed/i);
    expect(pageText(page())).not.toMatch(/confirm on carhartt\.com/i);
    expect(pageText(page())).not.toMatch(/made in the U\.S\./i);
    expect(pageText(page())).toContain("Imported or Made in USA of Imported Parts");
    expect(findSelfContradictions(page())).toEqual([]);
  });

  it("keeps FAQ questions 1:1 and emits FAQPage plus speakable selectors", () => {
    expect(page().faqs.map((faq) => faq.question)).toEqual(PANTS_FAQS);
    expect(faqQuestions(page())).toEqual(PANTS_FAQS);
    const kneePad = page().faqs.find((faq) => faq.question === "Can you use knee pads?");
    expect(kneePad?.answer).toContain("compatible with the Carhartt Knee Pad");
    expect(kneePad?.answer).toContain("openings for adding knee pads");
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.find((item) => item.name === "Can you use knee pads?")?.acceptedAnswer?.text).toBe(
      kneePad?.answer
    );
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites Carhartt, Dickies, Gear Patrol, and the Reddit thread, and cross-links Patagonia", () => {
    const urls = (page().citationStats?.sources ?? []).map((source) => source.url);
    expect(urls).toEqual([
      "https://www.carhartt.com/product/106679",
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

const ULTRA_SLUG = "samsung-galaxy-s24-ultra-vs-samsung-galaxy-s25-ultra";
const ULTRA_FAQS = [
  "Is the Samsung Galaxy S25 Ultra worth it over the S24 Ultra?",
  "Does the Galaxy S25 Ultra have better battery life than the S24 Ultra?",
  "Is the S25 Ultra camera better than the S24 Ultra?",
  "What did the Galaxy S25 Ultra S Pen lose compared with the S24 Ultra?",
  "How long will the S24 Ultra and S25 Ultra receive updates?",
  "Which is better for gaming?",
];
const ULTRA_QUICK_ANSWER =
  "If you can buy a discounted Galaxy S24 Ultra, it is still the better value for most people in 2026: same 5,000 mAh battery class, the same 200MP main and 5x periscope cameras, and seven years of OS updates from launch. Choose the Galaxy S25 Ultra if you want the Snapdragon 8 Elite for Galaxy chip, the larger 6.9-inch display, the 50MP ultrawide upgrade, and a lighter body.";

describe("ROO-115 Galaxy S24 Ultra vs Galaxy S25 Ultra", () => {
  const page = () => getEditorialComparison(ULTRA_SLUG)!;

  it("publishes the slug with no page-level winner and a sitemap row", () => {
    expect(isEditorialCompareSlug(ULTRA_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(ULTRA_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual([
      "samsung-galaxy-s24-ultra",
      "samsung-galaxy-s25-ultra",
    ]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().entities.map((entity) => entity.bestFor)).toEqual([
      "Best value: Galaxy S24 Ultra (on sale)",
      "Best upgrade: Galaxy S25 Ultra (chip, display, ultrawide)",
    ]);
    expect(page().shortAnswer).toBe(ULTRA_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(ULTRA_QUICK_ANSWER);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(ULTRA_SLUG);
    expect(pageText(page())).not.toMatch(/\bu\/[A-Za-z0-9_-]+/);
    expect(findSelfContradictions(page())).toEqual([]);
  });

  it("keeps six FAQs and copies the same answer text into FAQPage JSON-LD", () => {
    expect(page().faqs).toHaveLength(6);
    expect(page().faqs.map((faq) => faq.question)).toEqual(ULTRA_FAQS);
    expect(faqQuestions(page())).toEqual(ULTRA_FAQS);
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.map((item) => item.name)).toEqual(ULTRA_FAQS);
    for (const item of page().faqs) {
      expect(main.find((row) => row.name === item.question)?.acceptedAnswer?.text).toBe(item.answer);
    }
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("gives every source a URL and links the related Ultra compare", () => {
    const sources = page().citationStats?.sources ?? [];
    expect(sources.length).toBeGreaterThan(0);
    for (const source of sources) {
      expect(source.url).toMatch(/^https:\/\//);
    }
    const urls = sources.map((source) => source.url);
    expect(urls).toEqual(
      expect.arrayContaining([
        "https://www.gsmarena.com/compare.php3?idPhone1=13322&idPhone2=12771",
        "https://www.digitaltrends.com/phones/samsung-galaxy-s25-ultra-vs-samsung-galaxy-s24-ultra/",
        "https://www.samsung.com/us/smartphones/galaxy-s25-ultra/",
        "https://www.samsung.com/levant/smartphones/galaxy-s24-ultra/",
        "https://www.reddit.com/r/samsunggalaxy/comments/1wrr9qy/s24_ultra_vs_s25_ultra_which_one_should_i_get/",
      ])
    );
    expect(page().resources?.map((resource) => resource.url)).toEqual(urls);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "iphone-16-pro-vs-galaxy-s25-ultra",
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).not.toContain(
      "samsung-galaxy-s25-vs-samsung-galaxy-s25-ultra"
    );
    expect(pageText(page())).not.toMatch(/Snapdragon 8 Elite(?! for Galaxy)/);
    const pen = page().faqs.find(
      (faq) => faq.question === "What did the Galaxy S25 Ultra S Pen lose compared with the S24 Ultra?"
    );
    expect(pen?.answer).toContain("Air Actions");
    expect(pen?.answer).toContain("no Bluetooth");
    expect(pageText(page())).toContain("the asker's prices");
  });

  it("does not attach this compare to the unpublished S25 vs S25 Ultra slug", () => {
    const dead = {
      slug: "samsung-galaxy-s25-vs-samsung-galaxy-s25-ultra",
      relatedComparisons: [],
    } as unknown as ComparisonPageData;
    expect(appendEditorialRelatedLinks(dead)).toBe(dead);
    expect(appendEditorialRelatedLinks(page())).toBe(page());
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "iphone-16-pro-vs-galaxy-s25-ultra",
    ]);
  });
});

const E16_SLUG = "iphone-16e-vs-iphone-17e";
const E16_FAQS = [
  "Is the iPhone 17e worth it over the iPhone 16e?",
  "Is 256GB enough, or should you get the 512GB iPhone 16e?",
  "Is the iPhone 17e camera better than the iPhone 16e?",
  "Does MagSafe matter on the iPhone 17e?",
  "Which should you buy if you are coming from an iPhone 8?",
];
const E16_QUICK_ANSWER =
  "Buy the iPhone 17e 256GB unless you already know you need more than 256GB. It has the A19 chip, MagSafe up to 15W, Ceramic Shield 2, and it launched a year after the 16e. Pick the iPhone 16e 512GB only if that extra storage matters more than MagSafe and the newer chip, and a live price check shows it is close to the 17e. Both have a 6.1-inch Super Retina XDR display, one 48MP Fusion camera, and up to 26 hours of video playback. Both launched at a $599 starting price. This page does not crown a winner.";

describe("ROO-121 iPhone 16e vs iPhone 17e", () => {
  const page = () => getEditorialComparison(E16_SLUG)!;

  it("publishes the slug with no page-level winner and a sitemap row", () => {
    expect(isEditorialCompareSlug(E16_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(E16_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual(["iphone-16e", "iphone-17e"]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().entities.map((entity) => entity.bestFor)).toEqual([
      "Best if you need 512GB and the live price is close",
      "Best for most people, including an upgrade from an iPhone 8",
    ]);
    expect(page().shortAnswer).toBe(E16_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(E16_QUICK_ANSWER);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(E16_SLUG);
    expect(page().metadata.updatedAt).toBe("2026-09-29T00:00:00Z");
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(pageText(page())).not.toMatch(/Geekbench/i);
    expect(pageText(page())).not.toMatch(/3242|3627|7976|9249|23888|37146/);
    expect(pageText(page())).not.toMatch(/25W/);
  });

  it("keeps five FAQs and copies the same answer text into FAQPage JSON-LD", () => {
    expect(page().faqs).toHaveLength(5);
    expect(page().faqs.map((faq) => faq.question)).toEqual(E16_FAQS);
    expect(faqQuestions(page())).toEqual(E16_FAQS);
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.map((item) => item.name)).toEqual(E16_FAQS);
    for (const item of page().faqs) {
      expect(main.find((row) => row.name === item.question)?.acceptedAnswer?.text).toBe(item.answer);
    }
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites the fetched pages and only links sitemap-backed compares", () => {
    const sources = page().citationStats?.sources ?? [];
    expect(sources).toHaveLength(3);
    expect(page().citationStats?.lastResearched).toBe("2026-09-29");
    for (const source of sources) {
      expect(source.name).toMatch(/2026-09-29/);
      expect(source.url).toMatch(/^https:\/\//);
    }
    const urls = sources.map((source) => source.url);
    expect(urls).toEqual([
      "https://www.macrumors.com/guide/iphone-16e-vs-17e/",
      "https://appleinsider.com/inside/iphone-17e/vs/iphone-17e-vs-iphone-16e-apples-low-end-compared",
      "https://www.apple.com/iphone-17e/",
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual(urls);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "iphone-17-vs-iphone-17-pro-vs-iphone-16-pro",
      "iphone-16-pro-vs-iphone-16-pro-max",
    ]);
    expect(pageText(page())).toContain("Source note:");
    expect(pageText(page())).toContain("15W");
    expect(pageText(page())).toContain("7.5W");
    expect(pageText(page())).toContain("Ceramic Shield 2");
  });
});

const GO_SLUG = "polaroid-go-gen-2-vs-fujifilm-instax-mini";
const GO_FAQS = [
  "Is Instax Mini better than the Polaroid Go Gen 2?",
  "Why would you buy the Polaroid Go Gen 2?",
  "How much does the film cost?",
  "Should you buy the Instax Mini 12 or the Mini 13?",
  "Is the Polaroid Go Gen 2 good outdoors?",
];
const GO_QUICK_ANSWER =
  "An Instax Mini is the easier start. That means the Mini 12, or the Mini 13 if that is the camera on the shelf: cheaper film in the reviews cited here, more consistent prints, and simple one-button shooting. The Polaroid Go Gen 2 is for people who want the Polaroid look and tiny square prints, and who accept a higher cost per shot and less predictable exposure. Digital Camera World lists both camera bodies at a US$79.99 RRP and says the Go still leans toward overexposing outdoors. This page does not crown a winner.";

describe("ROO-122 Polaroid Go Gen 2 vs Instax Mini", () => {
  const page = () => getEditorialComparison(GO_SLUG)!;

  it("publishes the slug with no page-level winner and a sitemap row", () => {
    expect(isEditorialCompareSlug(GO_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(GO_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual([
      "polaroid-go-gen-2",
      "fujifilm-instax-mini",
    ]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().entities.map((entity) => entity.bestFor)).toEqual([
      "Best for the Polaroid look and tiny square prints",
      "Best easy start: cheaper film and more consistent prints",
    ]);
    expect(page().shortAnswer).toBe(GO_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(GO_QUICK_ANSWER);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(GO_SLUG);
    expect(page().metadata.updatedAt).toBe("2026-09-29T00:00:00Z");
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(pageText(page())).not.toMatch(/\$77|£72|\$93/);
    expect(pageText(page())).not.toMatch(/Generation 3 (weighs|costs|has a)/i);
  });

  it("keeps five FAQs and copies the same answer text into FAQPage JSON-LD", () => {
    expect(page().faqs).toHaveLength(5);
    expect(page().faqs.map((faq) => faq.question)).toEqual(GO_FAQS);
    expect(faqQuestions(page())).toEqual(GO_FAQS);
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.map((item) => item.name)).toEqual(GO_FAQS);
    for (const item of page().faqs) {
      expect(main.find((row) => row.name === item.question)?.acceptedAnswer?.text).toBe(item.answer);
    }
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites reviewer prices and does not invent related product pages", () => {
    const sources = page().citationStats?.sources ?? [];
    expect(sources).toHaveLength(4);
    expect(page().citationStats?.lastResearched).toBe("2026-09-29");
    for (const source of sources) {
      expect(source.name).toMatch(/2026-09-29/);
      expect(source.url).toMatch(/^https:\/\//);
    }
    const urls = sources.map((source) => source.url);
    expect(urls).toEqual([
      "https://www.digitalcameraworld.com/reviews/polaroid-go-generation-2-review",
      "https://uk.pcmag.com/cameras-1/152230/polaroid-go-generation-2",
      "https://www.pcmag.com/reviews/fujifilm-instax-mini-12",
      "https://www.pcmag.com/picks/the-best-instant-cameras",
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual(urls);
    expect(page().relatedComparisons).toEqual([]);
    expect(pageText(page())).toContain("Source note:");
    expect(pageText(page())).toContain("reviewer-cited");
    expect(pageText(page())).toContain("wallet-size");
    expect(pageText(page())).toContain("US$79.99");
  });
});

const FOLD_SLUG = "galaxy-z-fold-7-vs-samsung-galaxy-s26-ultra";
const FOLD_FAQS = [
  "Which phone is better if you want to keep it for 4-5 years?",
  "How durable is the Galaxy Z Fold 7 hinge?",
  "Does the Galaxy Z Fold 7 have the better camera?",
  "Which phone has the better battery?",
  "How long is software support on the Fold 7 and the S26 Ultra?",
];
const FOLD_QUICK_ANSWER =
  "The Galaxy S26 Ultra suits a 4-5 year keep. GSMArena lists IP68, a 5,000 mAh battery, 60W wired and 25W wireless charging, a 5x periscope, and a 7.9 mm slab. The Galaxy Z Fold 7 is the pick only if the 8.0-inch inner screen and multitasking are why you are buying, and you accept IP48, a 4,400 mAh battery, 25W wired charging, and the extra care a hinge needs. Both phones have a 200MP main camera and up to 7 major OS updates. GSMArena's active-use score is 11:44h on the Fold 7 and 16:23h on the S26 Ultra. This page does not crown a winner.";

describe("ROO-120 Galaxy Z Fold 7 vs Galaxy S26 Ultra", () => {
  const page = () => getEditorialComparison(FOLD_SLUG)!;

  it("publishes the slug with no page-level winner and a sitemap row", () => {
    expect(isEditorialCompareSlug(FOLD_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(FOLD_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual([
      "galaxy-z-fold-7",
      "samsung-galaxy-s26-ultra",
    ]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().entities.map((entity) => entity.bestFor)).toEqual([
      "Best for the inner foldable screen",
      "Best for a 4-5 year keep",
    ]);
    expect(page().shortAnswer).toBe(FOLD_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(FOLD_QUICK_ANSWER);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(FOLD_SLUG);
    expect(page().metadata.updatedAt).toBe("2026-09-29T00:00:00Z");
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(pageText(page())).not.toMatch(/\d[\d,]*\s*(hinge|fold)[- ]cycles/i);
    expect(pageText(page())).not.toMatch(/AnTuTu|Geekbench/i);
  });

  it("keeps five FAQs and copies the same answer text into FAQPage JSON-LD", () => {
    expect(page().faqs).toHaveLength(5);
    expect(page().faqs.map((faq) => faq.question)).toEqual(FOLD_FAQS);
    expect(faqQuestions(page())).toEqual(FOLD_FAQS);
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.map((item) => item.name)).toEqual(FOLD_FAQS);
    for (const item of page().faqs) {
      expect(main.find((row) => row.name === item.question)?.acceptedAnswer?.text).toBe(item.answer);
    }
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites the fetched spec pages and only links sitemap-backed compares", () => {
    const sources = page().citationStats?.sources ?? [];
    expect(sources).toHaveLength(7);
    expect(page().citationStats?.lastResearched).toBe("2026-09-29");
    for (const source of sources) {
      expect(source.name).toMatch(/2026-09-29/);
      expect(source.url).toMatch(/^https:\/\//);
    }
    const urls = sources.map((source) => source.url);
    expect(urls).toEqual([
      "https://www.gsmarena.com/compare.php3?idPhone1=13826&idPhone2=14320",
      "https://www.gsmarena.com/samsung_galaxy_z_fold7-13826.php",
      "https://www.gsmarena.com/samsung_galaxy_s26_ultra_5g-14320.php",
      "https://www.geeky-gadgets.com/galaxy-s26-ultra-vs-z-fold-7/",
      "https://www.samsung.com/us/support/warranty/",
      "https://www.samsung.com/us/smartphones/galaxy-s26-ultra/",
      "https://www.androidauthority.com/samsung-galaxy-z-fold-7-drops-s-pen-support-3575176/",
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual(urls);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "iphone-17-vs-samsung-s26",
      "samsung-galaxy-s24-ultra-vs-samsung-galaxy-s25-ultra",
    ]);
    expect(pageText(page())).toContain("Source note:");
    expect(pageText(page())).toContain("IP48");
    expect(pageText(page())).toContain("IP68");
    expect(pageText(page())).toContain("11:44h");
    expect(pageText(page())).toContain("16:23h");
    expect(pageText(page())).toContain("S Pen");
    expect(pageText(page())).toContain("Not supported");
    expect(pageText(page())).toContain("Built-in S Pen");
    expect(pageText(page())).not.toMatch(/Air Actions|Bluetooth/i);
    const pen = page().attributes.find((attr) => attr.slug === "s-pen");
    expect(pen?.values.find((value) => value.entityId === "samsung-galaxy-s26-ultra")?.winner).toBe(
      true
    );
    expect(page().quickAnswer?.winnerName).toBeNull();
  });
});
