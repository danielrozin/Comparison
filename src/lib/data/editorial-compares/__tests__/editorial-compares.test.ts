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

const ULTRA3_SLUG = "iphone-17-pro-vs-samsung-galaxy-s25-ultra-vs-samsung-galaxy-s26-ultra";
const ULTRA3_FAQS = [
  "Can you get any of these under ₹1 lakh?",
  "Is the Galaxy S25 Ultra still worth buying after the S26 Ultra?",
  "What does the Galaxy S26 Ultra add over the S25 Ultra?",
  "Which is better for telephoto and video, the iPhone 17 Pro or a Galaxy Ultra?",
  "Which has the better battery, iPhone 17 Pro, S25 Ultra, or S26 Ultra?",
  "Should an iPhone 13 owner switch to Samsung?",
];
const ULTRA3_QUICK_ANSWER =
  "iPhone 17 Pro vs Galaxy S25 Ultra vs Galaxy S26 Ultra. Both Ultras have a 200MP camera with 3x and 5x. The 17 Pro has a 4x telephoto. No winner is crowned.";

describe("ROO-128 iPhone 17 Pro vs S25 Ultra vs S26 Ultra", () => {
  const page = () => getEditorialComparison(ULTRA3_SLUG)!;

  it("publishes the 3-way slug with no page-level winner and a sitemap row", () => {
    expect(isEditorialCompareSlug(ULTRA3_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(ULTRA3_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual([
      "iphone-17-pro",
      "samsung-galaxy-s25-ultra",
      "samsung-galaxy-s26-ultra",
    ]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().entities.map((entity) => entity.bestFor)).toEqual([
      "Best if you need the 4x telephoto and Pro video formats",
      "Best if you want the Ultra cameras on the current model",
      "Best if you want the newer chip and the longer active-use score",
    ]);
    expect(page().shortAnswer).toBe(ULTRA3_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(ULTRA3_QUICK_ANSWER);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(ULTRA3_SLUG);
    expect(page().metadata.updatedAt).toBe("2026-09-30T00:00:00Z");
    expect(page().title).toBe("iPhone 17 Pro vs Galaxy S25 Ultra vs Galaxy S26 Ultra");
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title).toBe("iPhone 17 Pro vs S25 Ultra vs S26 Ultra | A Versus B");
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description).not.toMatch(/₹1 lakh|under ₹1/i);
    expect(page().verdict).not.toMatch(/₹1 lakh|under ₹1/i);
    expect(page().expertAnalysis).not.toMatch(/₹1 lakh|under ₹1/i);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(pageText(page())).not.toMatch(/Big Billion|exchange|trade-in price/i);
    expect(pageText(page())).not.toMatch(/AnTuTu|Geekbench/i);
  });

  it("keeps six FAQs and copies the same answer text into FAQPage JSON-LD", () => {
    expect(page().faqs).toHaveLength(6);
    expect(page().faqs.map((faq) => faq.question)).toEqual(ULTRA3_FAQS);
    expect(faqQuestions(page())).toEqual(ULTRA3_FAQS);
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.map((item) => item.name)).toEqual(ULTRA3_FAQS);
    for (const item of page().faqs) {
      expect(main.find((row) => row.name === item.question)?.acceptedAnswer?.text).toBe(item.answer);
    }
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites the fetched spec pages and only links sitemap-backed compares", () => {
    const sources = page().citationStats?.sources ?? [];
    expect(page().citationStats?.lastResearched).toBe("2026-09-30");
    for (const source of sources) {
      expect(source.name).toMatch(/2026-09-30/);
      expect(source.url).toMatch(/^https:\/\//);
    }
    const urls = sources.map((source) => source.url);
    expect(urls).toEqual([
      "https://www.gsmarena.com/apple_iphone_17_pro-14049.php",
      "https://www.gsmarena.com/samsung_galaxy_s25_ultra-13322.php",
      "https://www.gsmarena.com/samsung_galaxy_s26_ultra_5g-14320.php",
      "https://support.apple.com/en-us/125090",
      "https://www.samsung.com/in/smartphones/galaxy-s25-ultra/buy/",
      "https://www.samsung.com/in/smartphones/galaxy-s26-ultra/buy/",
      "https://www.apple.com/in/shop/buy-iphone/iphone-17-pro",
      "https://www.apple.com/in/shop/buy-iphone/iphone-17",
    ]);
    expect(sources).toHaveLength(8);
    expect(page().resources?.map((resource) => resource.url)).toEqual([
      ...urls,
      "/compare/iphone-17-vs-iphone-air",
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "iphone-17-vs-samsung-s26",
      "samsung-galaxy-s24-ultra-vs-samsung-galaxy-s25-ultra",
      "iphone-17-vs-iphone-air",
    ]);
    expect(pageText(page())).toContain("Source note:");
    expect(pageText(page())).toContain("₹1,19,999");
    expect(pageText(page())).toContain("₹1,39,999");
    expect(pageText(page())).toContain("₹1,54,999");
    expect(pageText(page())).toContain("₹1,74,999");
    expect(pageText(page())).toContain("₹99,900");
    const strikeThrough = /1,29,999|1,49,999|1,69,999|1,89,999|MRP ₹|Save ₹/;
    expect(pageText(page())).not.toMatch(strikeThrough);
    expect(JSON.stringify(schemaNodes(page()))).not.toMatch(strikeThrough);
    expect(JSON.stringify(page().keyDifferences)).not.toMatch(strikeThrough);
    expect((page().resources ?? []).map((resource) => resource.description).join("\n")).not.toMatch(strikeThrough);
    expect((page().resources ?? []).map((resource) => resource.description).join("\n")).not.toMatch(/not live yet/);
    expect((page().resources ?? []).map((resource) => resource.url).join("\n")).not.toMatch(/\/entity\//);
    expect(page().faqs[0]?.answer).toBe(page().quickAnswer?.keyFact?.replace(/^Can you get any of these under ₹1 lakh\? /, ""));
    expect(pageText(page())).not.toMatch(/₹99,999|₹139,999|\$849/);
    expect(pageText(page())).toContain("15:23h");
    expect(pageText(page())).toContain("14:49h");
    expect(pageText(page())).toContain("16:23h");
    expect(pageText(page())).not.toMatch(/Big Billion Days/);
    const score = page().attributes.find((attr) => attr.slug === "active-use");
    expect(score?.values.find((value) => value.entityId === "samsung-galaxy-s26-ultra")?.winner).toBe(
      true
    );
    expect(page().quickAnswer?.winnerName).toBeNull();
  });
});
const AIR_SLUG = "iphone-17-vs-iphone-air";
const AIR_FAQS = [
  "Is the iPhone Air better than the iPhone 17?",
  "Should I upgrade from an iPhone 13 to the iPhone Air or the iPhone 17?",
  "Does the iPhone Air have a better chip than the iPhone 17?",
  "Which is thinner and lighter, iPhone Air or iPhone 17?",
  "Which has the better camera for Instagram, iPhone Air or iPhone 17?",
  "Which has better battery life, iPhone Air or iPhone 17?",
];
const AIR_QUICK_ANSWER =
  "Choose the iPhone 17 for the more complete everyday phone if you are coming from an iPhone 13. Apple rates it for up to 30 hours of video playback, against up to 27 hours on the iPhone Air, and it adds a 48MP ultrawide. Choose the iPhone Air only if the 5.64 mm, 165 gram titanium body is why you are upgrading. It has one 48MP rear camera. GSMArena lists 3,692 mAh for the iPhone 17 and 3,149 mAh for the iPhone Air. This page does not crown a winner.";

describe("ROO-130 iPhone Air vs iPhone 17", () => {
  const page = () => getEditorialComparison(AIR_SLUG)!;

  it("publishes the iPhone Air slug with no page-level winner and a sitemap row", () => {
    expect(isEditorialCompareSlug(AIR_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(AIR_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual(["iphone-17", "iphone-air"]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().entities.map((entity) => entity.bestFor)).toEqual([
      "Best everyday upgrade from an iPhone 13",
      "Best if the thin titanium body is the reason",
    ]);
    expect(page().shortAnswer).toBe(AIR_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(AIR_QUICK_ANSWER);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(AIR_SLUG);
    expect(page().metadata.updatedAt).toBe("2026-09-30T00:00:00Z");
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(pageText(page())).not.toMatch(/Geekbench|AnTuTu/i);
    expect(pageText(page())).toContain("iPhone Air");
    expect(pageText(page())).not.toMatch(/iPhone 17 Air is 5\.64/);
  });

  it("keeps six FAQs and copies the same answer text into FAQPage JSON-LD", () => {
    expect(page().faqs).toHaveLength(6);
    expect(page().faqs.map((faq) => faq.question)).toEqual(AIR_FAQS);
    expect(faqQuestions(page())).toEqual(AIR_FAQS);
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.map((item) => item.name)).toEqual(AIR_FAQS);
    for (const item of page().faqs) {
      expect(main.find((row) => row.name === item.question)?.acceptedAnswer?.text).toBe(item.answer);
    }
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites Apple and GSMArena and links the indexable iPhone Air hub", () => {
    const sources = page().citationStats?.sources ?? [];
    expect(sources).toHaveLength(6);
    expect(page().citationStats?.lastResearched).toBe("2026-09-30");
    for (const source of sources) {
      expect(source.name).toMatch(/2026-09-30/);
      expect(source.url).toMatch(/^https:\/\//);
    }
    const urls = sources.map((source) => source.url);
    expect(urls).toEqual([
      "https://www.apple.com/iphone-17/specs/",
      "https://www.apple.com/iphone-air/specs/",
      "https://www.apple.com/in/shop/buy-iphone/iphone-17",
      "https://www.apple.com/in/shop/buy-iphone/iphone-air",
      "https://www.gsmarena.com/apple_iphone_17-14050.php",
      "https://www.gsmarena.com/apple_iphone_17_air-13502.php",
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual([
      ...urls,
      "/entity/iphone-air",
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "iphone-17-vs-iphone-17-pro-vs-iphone-16-pro",
      "iphone-16e-vs-iphone-17e",
    ]);
    expect(pageText(page())).toContain("Source note:");
    expect(pageText(page())).toContain("5.64 mm");
    expect(pageText(page())).toContain("7.95 mm");
    expect(pageText(page())).toContain("3,149 mAh");
    expect(pageText(page())).toContain("3,692 mAh");
    expect(pageText(page())).toContain("₹99,900");
    expect(pageText(page())).toContain("₹1,49,900");
    expect(pageText(page())).not.toMatch(/₹119,900|₹124,900/);
    const camera = page().attributes.find((attr) => attr.slug === "camera");
    expect(camera?.values.find((value) => value.entityId === "iphone-17")?.winner).toBe(true);
    expect(page().quickAnswer?.winnerName).toBeNull();
  });
});
const MAPS_APPLE_SLUG = "google-maps-vs-apple-maps";
const MAPS_APPLE_FAQS = [
  "Should I use Apple Maps or Google Maps on an iPhone?",
  "Does Apple Maps work on Android?",
  "Can I download Apple Maps or Google Maps for offline use?",
  "Which app is better for transit, walking, and lane guidance?",
  "Do Apple Maps and Google Maps route electric cars to chargers?",
  "Which app is more private?",
];
const MAPS_APPLE_QUICK_ANSWER =
  "It depends on the phone and the trip. Use Apple Maps when you are on an iPhone and want the built-in Maps app, and use Google Maps when you need Android or a saved offline area on either phone. Apple's privacy page says Apple does not collect personal data associated with Maps usage, and it still sends route details under a random identifier for that trip. Apple's offline maps, in iOS 17 and later, cover select areas and include walking, cycling, and transit directions. Google's downloaded areas are for driving only, and they are not available in every country. This page does not crown a winner.";

describe("ROO-127 Google Maps vs Apple Maps", () => {
  const page = () => getEditorialComparison(MAPS_APPLE_SLUG)!;

  it("publishes the slug with no page-level winner and a sitemap row", () => {
    expect(isEditorialCompareSlug(MAPS_APPLE_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(MAPS_APPLE_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual(["google-maps", "apple-maps"]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().entities.map((entity) => entity.bestFor)).toEqual([
      "Best when you need Android or an offline driving area",
      "Best built-in app on an iPhone",
    ]);
    expect(page().shortAnswer).toBe(MAPS_APPLE_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(MAPS_APPLE_QUICK_ANSWER);
    const sentences = MAPS_APPLE_QUICK_ANSWER.split(/(?<=[.!?])\s+/);
    expect(sentences[0]).toMatch(/depends/i);
    expect(sentences[1]).toMatch(/Apple Maps/);
    expect(sentences[1]).toMatch(/Google Maps/);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(
      MAPS_APPLE_SLUG
    );
    expect(page().metadata.updatedAt).toBe("2026-09-30T00:00:00Z");
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(pageText(page())).not.toMatch(/\b(billion|million users|stars)\b/i);
  });

  it("keeps six FAQs and copies the same answer text into FAQPage JSON-LD", () => {
    expect(page().faqs).toHaveLength(6);
    expect(page().faqs.map((faq) => faq.question)).toEqual(MAPS_APPLE_FAQS);
    expect(faqQuestions(page())).toEqual(MAPS_APPLE_FAQS);
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.map((item) => item.name)).toEqual(MAPS_APPLE_FAQS);
    for (const item of page().faqs) {
      expect(main.find((row) => row.name === item.question)?.acceptedAnswer?.text).toBe(item.answer);
    }
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites the fetched Apple and Google pages and links the companion compare", () => {
    const sources = page().citationStats?.sources ?? [];
    expect(sources).toHaveLength(15);
    expect(page().citationStats?.lastResearched).toBe("2026-09-30");
    for (const source of sources) {
      expect(source.name).toMatch(/2026-09-30/);
      expect(source.url).toMatch(/^https:\/\//);
    }
    const urls = sources.map((source) => source.url);
    expect(urls).toEqual([
      "https://www.apple.com/maps/",
      "https://www.apple.com/legal/privacy/data/en/apple-maps/",
      "https://support.apple.com/en-us/105084",
      "https://support.apple.com/guide/iphone/get-driving-directions-ipha84a94043/ios",
      "https://support.apple.com/guide/iphone/get-transit-directions-ipha44f57caa/26",
      "https://support.apple.com/guide/iphone/set-up-electric-vehicle-routing-iphc5e3a4b4b/ios",
      "https://support.google.com/maps/answer/6291838?co=GENIE.Platform%3DiOS&hl=en",
      "https://support.google.com/maps/answer/6291838?hl=en",
      "https://support.google.com/maps/answer/144339?hl=en&co=GENIE.Platform%3DiOS",
      "https://support.google.com/maps/answer/3273406?hl=en",
      "https://support.google.com/maps/answer/9432062?hl=en",
      "https://support.google.com/androidauto/answer/6348322?hl=en",
      "https://support.google.com/maps/answer/14788580?hl=en",
      "https://support.google.com/maps/answer/9773205?hl=en",
      "https://support.google.com/maps/answer/6258979?hl=en",
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual(urls);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "google-maps-vs-waze",
      "android-vs-ios",
    ]);
    expect(pageText(page())).toContain("Source note:");
    expect(pageText(page())).toContain("random identifier");
    expect(pageText(page())).toContain("does not mention Android");
    expect(page().quickAnswer?.winnerName).toBeNull();
    const android = page().attributes.find((attr) => attr.slug === "platforms");
    expect(android?.values.find((value) => value.entityId === "google-maps")?.winner).toBe(true);
  });
});
const MAPS_WAZE_SLUG = "google-maps-vs-waze";
const MAPS_WAZE_FAQS = [
  "Should I use Waze or Google Maps for driving?",
  "Can Google Maps or Waze navigate offline?",
  "Do Google Maps and Waze work on CarPlay and Android Auto?",
  "Does Waze support transit, bicycle, or truck lanes?",
  "Which app keeps more of my location data?",
];
const MAPS_WAZE_QUICK_ANSWER =
  "It depends on the trip. Use Waze when you want other drivers' reports of traffic, crashes, police, and hazards and you can keep a data connection. Use Google Maps when you need a saved offline area, or directions for transit, walking, or cycling. Google Maps Help documents those modes on iPhone and iPad, and offline maps on iPhone, iPad, and Android. Waze's About page says that without an internet connection you cannot locate or navigate a route. This page does not crown a winner.";

describe("ROO-127 Google Maps vs Waze", () => {
  const page = () => getEditorialComparison(MAPS_WAZE_SLUG)!;

  it("publishes the slug with no page-level winner and a sitemap row", () => {
    expect(isEditorialCompareSlug(MAPS_WAZE_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(MAPS_WAZE_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual(["google-maps", "waze"]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().entities.map((entity) => entity.bestFor)).toEqual([
      "Best for offline areas and for transit, walking, or cycling",
      "Best for driver reports when you can stay online",
    ]);
    expect(page().shortAnswer).toBe(MAPS_WAZE_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(MAPS_WAZE_QUICK_ANSWER);
    const sentences = MAPS_WAZE_QUICK_ANSWER.split(/(?<=[.!?])\s+/);
    expect(sentences[0]).toMatch(/depends/i);
    expect(sentences[1]).toMatch(/Waze/);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(
      MAPS_WAZE_SLUG
    );
    expect(page().metadata.updatedAt).toBe("2026-09-30T00:00:00Z");
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(pageText(page())).not.toMatch(/\b(2\s*billion|150\s*million)\b/i);
    expect(pageText(page())).not.toMatch(/battery\s*\/\s*hour|%\s*battery/i);
  });

  it("keeps five FAQs and copies the same answer text into FAQPage JSON-LD", () => {
    expect(page().faqs).toHaveLength(5);
    expect(page().faqs.map((faq) => faq.question)).toEqual(MAPS_WAZE_FAQS);
    expect(faqQuestions(page())).toEqual(MAPS_WAZE_FAQS);
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.map((item) => item.name)).toEqual(MAPS_WAZE_FAQS);
    for (const item of page().faqs) {
      expect(main.find((row) => row.name === item.question)?.acceptedAnswer?.text).toBe(item.answer);
    }
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites the fetched help pages and only links the planned compares", () => {
    const sources = page().citationStats?.sources ?? [];
    expect(sources).toHaveLength(14);
    expect(page().citationStats?.lastResearched).toBe("2026-09-30");
    for (const source of sources) {
      expect(source.name).toMatch(/2026-09-30/);
      expect(source.url).toMatch(/^https:\/\//);
    }
    const urls = sources.map((source) => source.url);
    expect(urls).toEqual([
      "https://support.google.com/maps/answer/6291838?co=GENIE.Platform%3DiOS&hl=en",
      "https://support.google.com/maps/answer/6291838?hl=en",
      "https://support.google.com/maps/answer/144339?hl=en&co=GENIE.Platform%3DiOS",
      "https://support.google.com/maps/answer/3273406?hl=en",
      "https://support.google.com/maps/answer/9432062?hl=en",
      "https://support.google.com/androidauto/answer/6348322?hl=en",
      "https://support.google.com/maps/answer/14788580?hl=en",
      "https://support.google.com/maps/answer/6258979?hl=en",
      "https://support.google.com/waze/answer/6071177?hl=en",
      "https://support.google.com/waze/answer/6071125?hl=en",
      "https://support.google.com/waze/answer/13739290?hl=en",
      "https://support.google.com/waze/answer/15113302?hl=en",
      "https://support.google.com/waze/answer/9123774?hl=en",
      "https://support.google.com/waze/answer/7052890?hl=en",
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual(urls);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "google-maps-vs-apple-maps",
      "android-vs-ios",
    ]);
    expect(pageText(page())).toContain("Source note:");
    expect(pageText(page())).toContain("180 million");
    expect(pageText(page())).toContain("does not cache reports");
    expect(pageText(page())).toContain("submits it when you reconnect");
    const claimSurfaces = [
      pageText(page()),
      page().metadata.metaDescription,
      ...page().keyDifferences.flatMap((row) => [row.label, row.entityAValue, row.entityBValue]),
      ...(page().citationStats?.sources ?? []).map((source) => source.name),
      ...(page().resources ?? []).flatMap((resource) => [resource.label, resource.description]),
    ].join("\n");
    expect(claimSurfaces).not.toMatch(
      /parked-car|parked car|walking ETA|Walking stops at|walking directions beyond|No walking route/i
    );
    expect(sources.map((source) => source.name)).toContain(
      "Waze Help — find parking (fetched 2026-09-30)"
    );
    expect(page().quickAnswer?.winnerName).toBeNull();
    const offline = page().attributes.find((attr) => attr.slug === "offline-navigation");
    expect(offline?.values.find((value) => value.entityId === "google-maps")?.winner).toBe(true);
  });
});

const BRAVE_SLUG = "brave-vs-chrome";
const BRAVE_FAQS = [
  "Is Brave more private than Chrome?",
  "Does Brave block ads without an extension?",
  "Can I install Chrome extensions in Brave?",
  "What is Brave Rewards and BAT?",
  "Does Brave sync like Chrome?",
];
const BRAVE_QUICK_ANSWER =
  "It depends on what you want the browser to do before you change a setting. Pick Brave when you want third-party ads and trackers blocked by default, and pick Chrome when you want Google Account sync and the Chrome Web Store as Google ships it. Both are Chromium browsers. Brave's homepage says Brave is 3x faster than Chrome, and the same page also says websites load 3x-6x faster. Those are Brave's claims, not a lab result on this page. This page does not crown a winner.";

describe("ROO-114 Brave vs Chrome", () => {
  const page = () => getEditorialComparison(BRAVE_SLUG)!;

  it("publishes the slug with no page-level winner and a sitemap row", () => {
    expect(isEditorialCompareSlug(BRAVE_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(BRAVE_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual(["brave", "chrome"]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().entities.map((entity) => entity.bestFor)).toEqual([
      "Best if you want ads and trackers blocked before you add an extension",
      "Best if you want Google sign-in sync and the Chrome Web Store as Google ships it",
    ]);
    expect(page().shortAnswer).toBe(BRAVE_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(BRAVE_QUICK_ANSWER);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(BRAVE_SLUG);
    expect(page().metadata.updatedAt).toBe("2026-09-30T00:00:00Z");
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(pageText(page())).not.toMatch(/market share|65%|60 million|3x faster than Chrome on mobile/i);
    const types = [...new Set(schemaNodes(page()).map((node) => node["@type"]).filter(Boolean))];
    for (const schemaType of ["Article", "FAQPage", "BreadcrumbList"]) {
      expect(types).toContain(schemaType);
    }
  });

  it("keeps five FAQs and copies the same answer text into FAQPage JSON-LD", () => {
    expect(page().faqs).toHaveLength(5);
    expect(page().faqs.map((faq) => faq.question)).toEqual(BRAVE_FAQS);
    expect(faqQuestions(page())).toEqual(BRAVE_FAQS);
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.map((item) => item.name)).toEqual(BRAVE_FAQS);
    for (const item of page().faqs) {
      expect(main.find((row) => row.name === item.question)?.acceptedAnswer?.text).toBe(item.answer);
    }
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites the fetched pages and links the live browser hub and compares", () => {
    const sources = page().citationStats?.sources ?? [];
    expect(sources).toHaveLength(12);
    expect(page().citationStats?.lastResearched).toBe("2026-09-30");
    for (const source of sources) {
      expect(source.name).toMatch(/2026-09-30/);
      expect(source.url).toMatch(/^https:\/\//);
    }
    const urls = sources.map((source) => source.url);
    expect(urls).toEqual([
      "https://brave.com/",
      "https://brave.com/shields/",
      "https://brave.com/privacy-features/",
      "https://brave.com/features/",
      "https://brave.com/learn/using-chrome-extensions-in-brave/",
      "https://www.google.com/chrome/",
      "https://opensource.google.com/projects/chromium",
      "https://support.google.com/chrome/answer/185277",
      "https://support.google.com/chrome/answer/95647",
      "https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3",
      "https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline",
      "https://developer.chrome.com/release-notes/139",
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual([
      ...urls,
      "/browser-comparison-2026",
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "chrome-vs-safari",
      "chrome-vs-firefox",
      "firefox-vs-safari",
    ]);
    expect(pageText(page())).toContain("Source note:");
    expect(pageText(page())).toContain("It depends");
    expect(pageText(page())).toContain("Chromium");
    expect(pageText(page())).toContain("Shields");
    expect(pageText(page())).toContain("Manifest V3");
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().keyDifferences.every((row) => row.winner === "tie")).toBe(true);
  });
});

const SAFARI_SLUG = "chrome-vs-safari";
const SAFARI_FAQS = [
  "Is Safari more private than Chrome?",
  "Is Safari better for battery life than Chrome?",
  "Can I use Chrome extensions in Safari?",
  "Does Safari work on Windows or Android?",
  "Does Safari sync across iPhone, iPad, and Mac?",
];
const SAFARI_QUICK_ANSWER =
  "It depends on the devices you actually use. Pick Safari when you stay on Apple devices and want Intelligent Tracking Prevention on by default, and pick Chrome when you also need Windows, Linux, ChromeOS, or Android. Safari extensions come from the App Store, and Chrome extensions come from the Chrome Web Store on desktop. Apple says Safari is up to 5 hours longer than Chrome for streaming video. That figure is Apple's August 2026 test, labelled here as Apple's claim, not a result measured for this page. This page does not crown a winner.";

describe("ROO-114 Chrome vs Safari", () => {
  const page = () => getEditorialComparison(SAFARI_SLUG)!;

  it("publishes the slug with no page-level winner and a sitemap row", () => {
    expect(isEditorialCompareSlug(SAFARI_SLUG)).toBe(true);
    expect(isDegenerateComparisonSlug(SAFARI_SLUG)).toBe(false);
    expect(page().metadata.status).toBe("published");
    expect(page().entities.map((entity) => entity.slug)).toEqual(["chrome", "safari"]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().entities.map((entity) => entity.bestFor)).toEqual([
      "Best if you also browse on Windows, Android, Linux, or ChromeOS",
      "Best if you stay on Apple devices and want tracking prevention on by default",
    ]);
    expect(page().shortAnswer).toBe(SAFARI_QUICK_ANSWER);
    expect(page().quickAnswer?.tldr).toBe(SAFARI_QUICK_ANSWER);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SAFARI_SLUG);
    expect(page().metadata.updatedAt).toBe("2026-09-30T00:00:00Z");
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(pageText(page())).not.toMatch(/market share|65%|50-100%|2×|2x battery/i);
    const types = [...new Set(schemaNodes(page()).flatMap((node) => {
      const schemaType = node["@type"];
      return Array.isArray(schemaType) ? schemaType : schemaType ? [schemaType] : [];
    }))];
    for (const schemaType of ["Article", "FAQPage", "BreadcrumbList"]) {
      expect(types).toContain(schemaType);
    }
  });

  it("keeps five FAQs and copies the same answer text into FAQPage JSON-LD", () => {
    expect(page().faqs).toHaveLength(5);
    expect(page().faqs.map((faq) => faq.question)).toEqual(SAFARI_FAQS);
    expect(faqQuestions(page())).toEqual(SAFARI_FAQS);
    const faq = schemaNodes(page()).find((node) => node["@type"] === "FAQPage");
    const main = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer?: { text?: string };
    }[];
    expect(main.map((item) => item.name)).toEqual(SAFARI_FAQS);
    for (const item of page().faqs) {
      expect(main.find((row) => row.name === item.question)?.acceptedAnswer?.text).toBe(item.answer);
    }
    const selectors = speakableSelectors(page());
    expect(selectors).toContain("#short-answer");
    expect(selectors).toContain(".faq-answer");
  });

  it("cites the fetched pages and links the live browser hub and compares", () => {
    const sources = page().citationStats?.sources ?? [];
    expect(sources).toHaveLength(11);
    expect(page().citationStats?.lastResearched).toBe("2026-09-30");
    for (const source of sources) {
      expect(source.name).toMatch(/2026-09-30/);
      expect(source.url).toMatch(/^https:\/\//);
    }
    const urls = sources.map((source) => source.url);
    expect(urls).toEqual([
      "https://www.google.com/chrome/",
      "https://opensource.google.com/projects/chromium",
      "https://support.google.com/chrome/answer/185277",
      "https://support.google.com/chrome/answer/95647",
      "https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3",
      "https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline",
      "https://developer.chrome.com/release-notes/139",
      "https://www.apple.com/safari/",
      "https://www.apple.com/privacy/features/",
      "https://www.apple.com/legal/privacy/data/en/safari/",
      "https://support.apple.com/guide/icloud/what-you-can-do-with-icloud-and-safari-mm9b8da4f328/icloud",
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual([
      ...urls,
      "/browser-comparison-2026",
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "brave-vs-chrome",
      "chrome-vs-firefox",
      "firefox-vs-safari",
    ]);
    expect(pageText(page())).toContain("Source note:");
    expect(pageText(page())).toContain("It depends");
    expect(pageText(page())).toContain("WebKit");
    expect(pageText(page())).toContain("Chromium");
    expect(pageText(page())).toContain("Intelligent Tracking Prevention");
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().keyDifferences.every((row) => row.winner === "tie")).toBe(true);
  });
});
