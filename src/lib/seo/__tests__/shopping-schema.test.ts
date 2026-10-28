/**
 * ROO-333 — Google Search Console Shopping reports.
 *
 * Product snippets fail when a Product has none of offers, review, or
 * aggregateRating. Merchant listings fail when an Offer has no price, or
 * a priced Product has no image. Compared GPUs and phones are not ours to
 * sell, so those nodes must not be Product. /pricing is the exception:
 * Pro and Business are subscriptions we sell, and each Offer is complete.
 */
import { describe, expect, it } from "vitest";
import { PLANS } from "@/lib/monetization/plans";
import { RTX_5060_VS_RX_9060_XT } from "@/lib/data/editorial-compares/rtx-5060-vs-rx-9060-xt";
import { RTX_5070_VS_RX_9070_XT_VS_RTX_5070_TI } from "@/lib/data/editorial-compares/rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti";
import { IPHONE_16E_VS_IPHONE_17E } from "@/lib/data/editorial-compares/iphone-16e-vs-iphone-17e";
import { assembleCompareJsonLd } from "@/lib/seo/compare-jsonld";
import {
  PRICING_PRODUCT_IMAGE,
  pricingPlanProducts,
} from "@/lib/seo/pricing-offers";
import {
  comparisonPageSchema,
  demoteEditorialShoppingProducts,
  entityPageSchema,
  entitySchemaType,
  profilePageSchema,
  type ComparisonVoteData,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/utils/constants";
import type { ComparisonPageData } from "@/types";

function walk(value: unknown, visit: (node: Record<string, unknown>) => void): void {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit);
    return;
  }
  if (!value || typeof value !== "object") return;
  const node = value as Record<string, unknown>;
  visit(node);
  for (const child of Object.values(node)) walk(child, visit);
}

function typeNames(node: Record<string, unknown>): string[] {
  const type = node["@type"];
  if (typeof type === "string") return [type];
  if (!Array.isArray(type)) return [];
  return type.filter((item): item is string => typeof item === "string");
}

/** Every Product node, plus any additionalType that opts a node into Product. */
function shoppingProductNodes(value: unknown): Record<string, unknown>[] {
  const found: Record<string, unknown>[] = [];
  walk(value, (node) => {
    const types = typeNames(node);
    const additional = node.additionalType;
    const additionalNames = Array.isArray(additional)
      ? additional.filter((item): item is string => typeof item === "string")
      : typeof additional === "string"
        ? [additional]
        : [];
    const isProduct =
      types.some((type) => type === "Product" || type.endsWith("/Product")) ||
      additionalNames.some((type) => type === "Product" || type.endsWith("/Product"));
    if (isProduct) found.push(node);
  });
  return found;
}

function offerNodes(value: unknown): Record<string, unknown>[] {
  const found: Record<string, unknown>[] = [];
  walk(value, (node) => {
    if (typeNames(node).includes("Offer")) found.push(node);
  });
  return found;
}

function assertEditorialCompare(page: ComparisonPageData) {
  const schemas = comparisonPageSchema(page, null);
  const assembled = assembleCompareJsonLd({
    comparison: page,
    voteData: null,
    videoNode: null,
    fallbackDescription: page.shortAnswer ?? page.title,
  });

  for (const doc of [schemas, assembled.document]) {
    expect(shoppingProductNodes(doc), page.slug).toEqual([]);
    // Launch MSRP / SEP copy stays in the article text. It is not an Offer.
    expect(offerNodes(doc), page.slug).toEqual([]);
  }

  const types = new Set<string>();
  walk(assembled.document, (node) => {
    for (const type of typeNames(node)) types.add(type);
  });
  expect(types.has("Article"), page.slug).toBe(true);
  expect(types.has("FAQPage"), page.slug).toBe(true);
  expect(types.has("BreadcrumbList"), page.slug).toBe(true);
  expect(types.has("Product"), page.slug).toBe(false);
}

describe("entitySchemaType product mapping", () => {
  it("types compared goods as Thing so Shopping validators never run", () => {
    expect(entitySchemaType("product")).toBe("Thing");
    // Neighbors that are not the Shopping Product type stay as they were.
    expect(entitySchemaType("software")).toBe("SoftwareApplication");
    expect(entitySchemaType("car")).toBe("Car");
    expect(entitySchemaType("automotive")).toBe("Vehicle");
  });
});

describe("compare JSON-LD does not emit incomplete Product markup", () => {
  it("keeps the RTX 5060 vs RX 9060 XT graph free of Product and Offer", () => {
    assertEditorialCompare(RTX_5060_VS_RX_9060_XT);
  });

  it("keeps a 3-way GPU comparison free of Product and Offer", () => {
    assertEditorialCompare(RTX_5070_VS_RX_9070_XT_VS_RTX_5070_TI);
  });

  it("keeps a phone comparison free of Product even when pros and cons exist", () => {
    assertEditorialCompare(IPHONE_16E_VS_IPHONE_17E);
    const schemas = comparisonPageSchema(IPHONE_16E_VS_IPHONE_17E);
    const reviewed: Record<string, unknown>[] = [];
    walk(schemas, (node) => {
      if (typeNames(node).includes("Review") && node.itemReviewed) {
        reviewed.push(node.itemReviewed as Record<string, unknown>);
      }
    });
    expect(reviewed.length).toBeGreaterThan(0);
    for (const item of reviewed) {
      expect(typeNames(item)).not.toContain("Product");
    }
  });

  it("does not attach a vote rating to a Thing just to satisfy Product snippets", () => {
    const votes: ComparisonVoteData = {
      votes: {
        [RTX_5060_VS_RX_9060_XT.entities[0].name]: 8,
        [RTX_5060_VS_RX_9060_XT.entities[1].name]: 4,
      },
      total: 12,
    };
    const schemas = comparisonPageSchema(RTX_5060_VS_RX_9060_XT, votes);
    expect(shoppingProductNodes(schemas)).toEqual([]);
    walk(schemas, (node) => {
      expect(node.aggregateRating).toBeUndefined();
    });
  });

  it("rewrites stored schemaMarkup that still says Product, including a priced MSRP offer", () => {
    const page: ComparisonPageData = {
      ...RTX_5060_VS_RX_9060_XT,
      schemaMarkup: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            "@id": `${SITE_URL}/compare/rtx-5060-vs-rx-9060-xt#article`,
            headline: RTX_5060_VS_RX_9060_XT.title,
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${SITE_URL}/compare/rtx-5060-vs-rx-9060-xt#breadcrumbs`,
            itemListElement: [],
          },
          {
            "@type": "FAQPage",
            "@id": `${SITE_URL}/compare/rtx-5060-vs-rx-9060-xt#faq`,
            mainEntity: RTX_5060_VS_RX_9060_XT.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
          {
            "@type": "Product",
            name: "NVIDIA GeForce RTX 5060",
            offers: {
              "@type": "Offer",
              price: "299.00",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          },
          {
            "@type": ["Product", "Car"],
            name: "Typed as both",
            additionalType: "https://schema.org/Product",
          },
          {
            "@type": "SoftwareApplication",
            name: "Not a shopping product",
            additionalType: "https://schema.org/Product",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
        ],
      },
    };

    const { document } = assembleCompareJsonLd({
      comparison: page,
      voteData: null,
      videoNode: null,
      fallbackDescription: page.title,
    });

    expect(shoppingProductNodes(document)).toEqual([]);
    const json = JSON.stringify(document);
    expect(json).not.toContain("299.00");
    expect(json).toContain("Article");
    expect(json).toContain("FAQPage");
    expect(json).toContain("BreadcrumbList");

    const nodes: Record<string, unknown>[] = [];
    walk(document, (node) => nodes.push(node));
    const both = nodes.find((node) => node.name === "Typed as both");
    expect(both?.["@type"]).toEqual(["Thing", "Car"]);
    const software = nodes.find((node) => node.name === "Not a shopping product");
    expect(software?.["@type"]).toBe("SoftwareApplication");
    expect(software?.additionalType).toBeUndefined();
    // A non-Product node keeps its own offer. Only Product offers are dropped.
    expect(software?.offers).toMatchObject({ price: "0", priceCurrency: "USD" });
  });
});

describe("demoteEditorialShoppingProducts", () => {
  it("turns a bare Product into Thing and drops a price-less offer", () => {
    const demoted = demoteEditorialShoppingProducts({
      "@type": "Product",
      name: "AMD Radeon RX 9060 XT 16GB",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        seller: { "@type": "Organization", name: "A Versus B" },
      },
    });
    expect(demoted["@type"]).toBe("Thing");
    expect(demoted).not.toHaveProperty("offers");
    expect(shoppingProductNodes(demoted)).toEqual([]);
  });
});

describe("entity profiles for goods", () => {
  const entity = {
    name: "NVIDIA GeForce RTX 5060",
    slug: "rtx-5060",
    shortDesc: "Desktop graphics card",
    entityType: "product",
    imageUrl: null,
  };

  it("does not sell the entity from its profile schema", () => {
    const page = entityPageSchema(entity);
    expect(page["@type"]).toBe("Thing");
    expect(page).not.toHaveProperty("offers");
    expect(shoppingProductNodes(page)).toEqual([]);
  });

  it("does not sell the entity from the profile-page mainEntity", () => {
    const page = profilePageSchema(entity);
    const main = page.mainEntity as Record<string, unknown>;
    expect(main["@type"]).toBe("Thing");
    expect(main.offers).toBeUndefined();
    expect(shoppingProductNodes(page)).toEqual([]);
    expect(page["@type"]).not.toBe("Product");
  });
});

describe("pricing subscription Products", () => {
  it("gives each plan a photo and a complete offer", () => {
    const products = pricingPlanProducts();
    expect(products.map((product) => product.name)).toEqual(
      PLANS.map((plan) => `A Versus B ${plan.name}`),
    );

    for (const [index, product] of products.entries()) {
      const plan = PLANS[index];
      expect(product["@type"]).toBe("Product");
      expect(product.image).toBe(PRICING_PRODUCT_IMAGE);
      expect(product.image).toMatch(/^https:\/\/www\.aversusb\.net\/images\/logo\.png$/);
      expect(product.url).toBe(`${SITE_URL}/pricing`);
      expect(product.offers).toHaveLength(plan.intervals.length);

      for (const [offerIndex, offer] of product.offers.entries()) {
        const interval = plan.intervals[offerIndex];
        expect(offer["@type"]).toBe("Offer");
        expect(offer.price).toBe(interval.foundingPrice);
        expect(offer.price).toBeGreaterThan(0);
        expect(offer.priceCurrency).toBe("USD");
        expect(offer.availability).toMatch(/^https:\/\/schema\.org\/(InStock|PreOrder)$/);
        expect(offer.url).toBe(`${SITE_URL}/pricing`);
      }
    }
  });
});
