/**
 * Publish: iPhone 16 Pro vs Galaxy S25 Ultra (DAN-711)
 *
 * Overwrites the auto-generated comparison page with the editorial draft rev 3
 * from DAN-428, and persists the validated JSON-LD @graph from DAN-428 schema doc.
 *
 * Run with:
 *   npx tsx scripts/publish-iphone-16-pro-vs-galaxy-s25-ultra.ts
 *
 * Idempotent — saveComparison uses prisma.comparison.upsert.
 * datePublished is frozen on first publish per DAN-608 §4.
 */

import { saveComparison } from "../src/lib/services/comparison-service";
import { getPrisma } from "../src/lib/db/prisma";
import type { ComparisonPageData } from "../src/types";

const SLUG = "iphone-16-pro-vs-galaxy-s25-ultra";

// Content-lock timestamp from DAN-428 rev 3 (2026-05-22 content edit).
// datePublished: frozen at first publish (DAN-608 §4). Replace placeholder with actual publish instant.
const DATE_PUBLISHED = new Date().toISOString(); // overwritten only on first publish
const DATE_MODIFIED = "2026-05-22T15:32:43Z"; // DAN-428 rev 3 content-lock

const ENTITY_A_ID = "iphone-16-pro";
const ENTITY_B_ID = "galaxy-s25-ultra";

const comparison: ComparisonPageData = {
  id: SLUG,
  slug: SLUG,
  title: "iPhone 16 Pro vs Samsung Galaxy S25 Ultra: 2026 Flagship Showdown",
  shortAnswer:
    "The iPhone 16 Pro Refurb at $759 is the better value in 2026; the Galaxy S25 Ultra at $999 sale is the better hardware. If you have other Apple devices, iPhone wins regardless of specs.",
  verdict:
    "Galaxy S25 Ultra wins on hardware (larger battery, 200MP camera, S Pen, bigger screen); iPhone 16 Pro wins on value ($240 cheaper refurb), ecosystem integration, and video quality.",
  category: "technology",
  entities: [
    {
      id: ENTITY_A_ID,
      slug: "iphone-16-pro",
      name: "iPhone 16 Pro",
      shortDesc:
        "Apple's 2024 flagship — A18 Pro chip, 48MP main camera, 4K 120fps video, MagSafe. Now available as Apple Certified Refurbished from $759.",
      imageUrl: "/images/products/iphone-16-pro.webp",
      entityType: "product",
      position: 1,
      pros: [
        "Apple Certified Refurb from $759 — $240 cheaper than on-sale S25 Ultra",
        "Best-in-class video: 4K 120fps Dolby Vision + Log capture",
        "Seamless Apple ecosystem (Watch, AirPods, iCloud, Continuity)",
        "A18 Pro top-tier single-core performance",
        "MagSafe 25W wireless with in-phone magnets (no case needed)",
        "Lighter at 199g vs 218g — more one-hand-friendly",
      ],
      cons: [
        "No longer sold new at apple.com — refurb channel only",
        "Smaller battery: 3,582 mAh vs 5,000 mAh",
        "Single 5x telephoto (no 3x secondary lens)",
        "No S Pen stylus",
        "Slower wired charging: 27W vs 45W",
        "Less multitasking RAM (8 GB vs 12 GB)",
      ],
      bestFor:
        "iOS users upgrading from iPhone 13/14, Apple ecosystem households, video creators",
    },
    {
      id: ENTITY_B_ID,
      slug: "galaxy-s25-ultra",
      name: "Samsung Galaxy S25 Ultra",
      shortDesc:
        "Samsung's 2025 flagship — Snapdragon 8 Elite, 200MP camera, S Pen, 5,000 mAh battery. Now $999 on sale (was $1,299 at launch).",
      imageUrl: "/images/products/galaxy-s25-ultra.webp",
      entityType: "product",
      position: 2,
      pros: [
        "5,000 mAh battery — roughly 30-40% more screen-on time than iPhone 16 Pro",
        "200MP main + dual telephoto (3x + 5x) for unmatched photo versatility",
        "S Pen built-in for notes and precision tasks",
        "6.9\" QHD+ display (505 ppi, 2,600 nits peak) — best screen in class",
        "45W wired charging and 12 GB RAM",
        "Galaxy AI mature feature set: Live Translate, Circle to Search, generative photo edit",
      ],
      cons: [
        "$999 on sale (vs $759 refurb iPhone) — $240 premium",
        "Heavier at 218g — less comfortable one-handed",
        "8K video impractical to edit on consumer hardware",
        "Galaxy AI selectively offloads to cloud (vs Apple's on-device tilt)",
        "Qi2 wireless charging requires a magnetic case (no in-phone magnets)",
        "Android switching cost from iOS is real and often underestimated",
      ],
      bestFor:
        "Photographers, S Pen power users, battery-conscious travelers, Samsung ecosystem households",
    },
  ],
  keyDifferences: [
    {
      label: "Battery life",
      entityAValue: "3,582 mAh — ~6-7 hrs screen-on, 27W wired",
      entityBValue: "5,000 mAh — ~8-9 hrs screen-on, 45W wired",
      winner: "b",
    },
    {
      label: "Street price (May 2026)",
      entityAValue: "$759 (Apple Certified Refurb)",
      entityBValue: "$999 (samsung.com sale) / $1,299 MSRP",
      winner: "a",
    },
    {
      label: "Camera versatility",
      entityAValue: "48MP main + 12MP 5x periscope telephoto",
      entityBValue: "200MP main + 50MP 5x periscope + 10MP 3x telephoto",
      winner: "b",
    },
    {
      label: "Video quality",
      entityAValue: "4K 120fps Dolby Vision + Log — best for creators",
      entityBValue: "8K 30fps — impressive but harder to edit",
      winner: "a",
    },
    {
      label: "Chipset",
      entityAValue: "Apple A18 Pro — leads single-core",
      entityBValue: "Snapdragon 8 Elite — leads multi-core (~9,400 vs ~8,400 Geekbench multi)",
      winner: "tie",
    },
    {
      label: "Display size",
      entityAValue: "6.3\" LTPO OLED, 460 ppi, 2,000 nits HBM",
      entityBValue: "6.9\" Dynamic AMOLED 2X, 505 ppi, 2,600 nits peak",
      winner: "b",
    },
    {
      label: "Stylus",
      entityAValue: "None",
      entityBValue: "S Pen (built-in)",
      winner: "b",
    },
    {
      label: "Ecosystem integration",
      entityAValue: "Apple: iMessage, Watch, AirPods, AirDrop, Continuity",
      entityBValue: "Samsung: DeX, Galaxy Watch, Quick Share, Android openness",
      winner: "tie",
    },
  ],
  attributes: [
    {
      id: "display-size",
      slug: "display-size",
      name: "Display Size",
      unit: "inches",
      category: "display",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 6.3, valueText: "6.3\"", valueBoolean: null },
        { entityId: ENTITY_B_ID, valueNumber: 6.9, valueText: "6.9\"", valueBoolean: null },
      ],
    },
    {
      id: "display-resolution",
      slug: "display-resolution",
      name: "Resolution",
      unit: "ppi",
      category: "display",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 460, valueText: "2622×1206 (460 ppi)", valueBoolean: null },
        { entityId: ENTITY_B_ID, valueNumber: 505, valueText: "3120×1440 (505 ppi)", valueBoolean: null },
      ],
    },
    {
      id: "battery-capacity",
      slug: "battery-capacity",
      name: "Battery Capacity",
      unit: "mAh",
      category: "battery",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 3582, valueText: "3,582 mAh", valueBoolean: null },
        { entityId: ENTITY_B_ID, valueNumber: 5000, valueText: "5,000 mAh", valueBoolean: null, winner: true },
      ],
    },
    {
      id: "charging-speed",
      slug: "charging-speed",
      name: "Wired Charging",
      unit: "W",
      category: "battery",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 27, valueText: "27W peak", valueBoolean: null },
        { entityId: ENTITY_B_ID, valueNumber: 45, valueText: "45W", valueBoolean: null, winner: true },
      ],
    },
    {
      id: "ram",
      slug: "ram",
      name: "RAM",
      unit: "GB",
      category: "performance",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 8, valueText: "8 GB", valueBoolean: null },
        { entityId: ENTITY_B_ID, valueNumber: 12, valueText: "12 GB", valueBoolean: null, winner: true },
      ],
    },
    {
      id: "main-camera-mp",
      slug: "main-camera-mp",
      name: "Main Camera",
      unit: "MP",
      category: "camera",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 48, valueText: "48 MP f/1.78", valueBoolean: null },
        { entityId: ENTITY_B_ID, valueNumber: 200, valueText: "200 MP f/1.7", valueBoolean: null, winner: true },
      ],
    },
    {
      id: "weight",
      slug: "weight",
      name: "Weight",
      unit: "g",
      category: "design",
      dataType: "number",
      higherIsBetter: false,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 199, valueText: "199 g", valueBoolean: null, winner: true },
        { entityId: ENTITY_B_ID, valueNumber: 218, valueText: "218 g", valueBoolean: null },
      ],
    },
    {
      id: "price-street",
      slug: "price-street",
      name: "Street Price (May 2026)",
      unit: "USD",
      category: "pricing",
      dataType: "number",
      higherIsBetter: false,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 759, valueText: "$759 (Certified Refurb)", valueBoolean: null, winner: true },
        { entityId: ENTITY_B_ID, valueNumber: 999, valueText: "$999 (sale)", valueBoolean: null },
      ],
    },
    {
      id: "stylus",
      slug: "stylus",
      name: "Stylus",
      unit: null,
      category: "features",
      dataType: "boolean",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueBoolean: false, valueText: "None", valueNumber: null },
        { entityId: ENTITY_B_ID, valueBoolean: true, valueText: "S Pen (built-in)", valueNumber: null, winner: true },
      ],
    },
    {
      id: "ip-rating",
      slug: "ip-rating",
      name: "IP Rating",
      unit: null,
      category: "design",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: ENTITY_A_ID, valueText: "IP68 (6 m, 30 min)", valueNumber: null, valueBoolean: null },
        { entityId: ENTITY_B_ID, valueText: "IP68 (1.5 m, 30 min)", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "os",
      slug: "os",
      name: "Operating System",
      unit: null,
      category: "software",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: ENTITY_A_ID, valueText: "iOS 18", valueNumber: null, valueBoolean: null },
        { entityId: ENTITY_B_ID, valueText: "One UI 7 / Android 15", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "chipset",
      slug: "chipset",
      name: "Chipset",
      unit: null,
      category: "performance",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: ENTITY_A_ID, valueText: "Apple A18 Pro (3 nm)", valueNumber: null, valueBoolean: null },
        { entityId: ENTITY_B_ID, valueText: "Snapdragon 8 Elite (3 nm)", valueNumber: null, valueBoolean: null },
      ],
    },
  ],
  faqs: [
    {
      question: "Is the iPhone 16 Pro or Galaxy S25 Ultra better in 2026?",
      answer:
        "It depends on your ecosystem and use case. The iPhone 16 Pro Refurb at $759 is the better value in 2026; the Galaxy S25 Ultra at $999 sale is the better hardware. If you have other Apple devices, iPhone wins regardless of specs.",
    },
    {
      question: "Should I buy the iPhone 16 Pro now in 2026 or step up to the iPhone 17 Pro?",
      answer:
        "For most buyers, iPhone 16 Pro Refurb at $759 is the better deal — the iPhone 17 Pro starts at $1,099, a $340 premium for incremental camera, A19 Pro, and first-day Apple Intelligence gains. Heavy users (>4 hrs/day, photo enthusiasts, gamers) benefit from the upgrade; everyone else is better served by the refurb.",
    },
    {
      question: "Is the Galaxy S25 Ultra worth $999 if the S26 Ultra is already out?",
      answer:
        "Yes, unless you need the S26 Ultra's specific upgrades. At $999 the S25 Ultra saves $300 versus the $1,299 S26 Ultra and stays flagship-grade — the S Pen, 200 MP camera, and 5,000 mAh battery are unchanged year-over-year. The main argument for the S26 Ultra is its longer warranty horizon if Samsung Care+ matters to you.",
    },
    {
      question: "Can I switch between iPhone and Galaxy easily?",
      answer:
        "Yes for most data, with caveats. Apple's Move to iOS and Samsung's Smart Switch transfer photos, contacts, calendar, music, messages, and most app data. iMessage threads convert to plain SMS on Android (you lose attachments, reactions, threading); Apple Watch does not pair with Android; some paid apps must be re-purchased; DRM media (iTunes movies, some audiobooks) usually doesn't transfer.",
    },
    {
      question: "Does the iPhone 16 Pro have a better camera than the Galaxy S25 Ultra?",
      answer:
        "For video, yes — 4K 120fps Dolby Vision and Apple's color science give iPhone an edge for most shooters. For photos, Samsung wins on telephoto reach (3x + 5x dual telephoto vs Apple's single 5x) and resolution (200 MP vs 48 MP main). Both produce excellent photos in good light; Samsung pulls slightly ahead in extreme low light.",
    },
    {
      question: "Which has better battery life, iPhone 16 Pro or Galaxy S25 Ultra?",
      answer:
        "Galaxy S25 Ultra, by a comfortable margin. 5,000 mAh vs iPhone's 3,582 mAh translates to roughly 30-40% more screen-on time in mixed use and faster charging (45 W vs 27 W).",
    },
    {
      question: "Is Galaxy AI better than Apple Intelligence?",
      answer:
        "As of May 2026, Galaxy AI is more mature in feature breadth — Live Translate, Circle to Search, Now Brief, and generative photo edit all shipped earlier. Apple Intelligence is more privacy-aligned (most features run on-device or via Private Cloud Compute). If AI features are a key reason for the purchase, Galaxy is the safer pick today.",
    },
  ],
  relatedComparisons: [
    {
      slug: "iphone-16-pro-vs-iphone-16-pro-max",
      title: "iPhone 16 Pro vs iPhone 16 Pro Max",
      category: "technology",
    },
    {
      slug: "galaxy-s25-ultra-vs-galaxy-s25-plus",
      title: "Samsung Galaxy S25 Ultra vs Galaxy S25+",
      category: "technology",
    },
  ],
  relatedBlogPosts: [],
  metadata: {
    metaTitle:
      "iPhone 16 Pro vs Galaxy S25 Ultra: 2026 Flagship Showdown | aVersusB",
    metaDescription:
      "iPhone 16 Pro Refurb ($759) vs Galaxy S25 Ultra ($999 sale) — spec comparison, camera, battery, AI features, and who should buy each in 2026.",
    publishedAt: DATE_PUBLISHED,
    updatedAt: DATE_MODIFIED,
    isAutoGenerated: false,
    isHumanReviewed: true,
    viewCount: 0,
  },
};

// Validated JSON-LD @graph from DAN-428 #document-schema (rev 1, 2026-05-22)
// Per DAN-608 §6: cross-brand pair uses ItemList + two top-level Product nodes (NOT ProductGroup).
const VALIDATED_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra#article",
      "headline": "iPhone 16 Pro vs Samsung Galaxy S25 Ultra: 2026 Flagship Showdown",
      "image": "https://aversusb.net/images/compare/iphone-16-pro-vs-galaxy-s25-ultra/hero.webp",
      "author": {
        "@type": "Person",
        "name": "Daniel Rozin",
        "url": "https://aversusb.net/about/daniel-rozin",
      },
      "publisher": {
        "@type": "Organization",
        "name": "aVersusB",
        "logo": {
          "@type": "ImageObject",
          "url": "https://aversusb.net/logo.png",
        },
      },
      "datePublished": DATE_PUBLISHED,
      "dateModified": DATE_MODIFIED,
      "mainEntityOfPage": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra#breadcrumbs",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aversusb.net/" },
        { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://aversusb.net/compare" },
        { "@type": "ListItem", "position": 3, "name": "Smartphones", "item": "https://aversusb.net/compare/smartphones" },
        { "@type": "ListItem", "position": 4, "name": "iPhone 16 Pro vs Galaxy S25 Ultra", "item": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra" },
      ],
    },
    {
      "@type": "ItemList",
      "@id": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra#list",
      "name": "iPhone 16 Pro vs Samsung Galaxy S25 Ultra",
      "numberOfItems": 2,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "item": { "@id": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra#product-iphone-16-pro" } },
        { "@type": "ListItem", "position": 2, "item": { "@id": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra#product-galaxy-s25-ultra" } },
      ],
    },
    {
      "@type": "Product",
      "@id": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra#product-iphone-16-pro",
      "name": "iPhone 16 Pro",
      "brand": { "@type": "Brand", "name": "Apple" },
      "model": "iPhone 16 Pro",
      "image": "https://aversusb.net/images/products/iphone-16-pro.webp",
      "offers": {
        "@id": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra#offer-iphone-16-pro",
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": "759.00",
        "itemCondition": "https://schema.org/RefurbishedCondition",
        "availability": "https://schema.org/LimitedAvailability",
        "priceValidUntil": "2026-08-20",
        "url": "https://www.apple.com/shop/refurbished/iphone",
      },
    },
    {
      "@type": "Product",
      "@id": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra#product-galaxy-s25-ultra",
      "name": "Samsung Galaxy S25 Ultra",
      "brand": { "@type": "Brand", "name": "Samsung" },
      "model": "Galaxy S25 Ultra",
      "image": "https://aversusb.net/images/products/galaxy-s25-ultra.webp",
      "offers": {
        "@id": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra#offer-galaxy-s25-ultra",
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": "999.00",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2026-08-20",
        "url": "https://www.samsung.com/us/smartphones/galaxy-s25-ultra/",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://aversusb.net/compare/iphone-16-pro-vs-galaxy-s25-ultra#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is the iPhone 16 Pro or Galaxy S25 Ultra better in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It depends on your ecosystem and use case. The iPhone 16 Pro Refurb at $759 is the better value in 2026; the Galaxy S25 Ultra at $999 sale is the better hardware. If you have other Apple devices, iPhone wins regardless of specs.",
          },
        },
        {
          "@type": "Question",
          "name": "Should I buy the iPhone 16 Pro now in 2026 or step up to the iPhone 17 Pro?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For most buyers, iPhone 16 Pro Refurb at $759 is the better deal — the iPhone 17 Pro starts at $1,099, a $340 premium for incremental camera, A19 Pro, and first-day Apple Intelligence gains. Heavy users (more than 4 hrs/day, photo enthusiasts, gamers) benefit from the upgrade; everyone else is better served by the refurb.",
          },
        },
        {
          "@type": "Question",
          "name": "Is the Galaxy S25 Ultra worth $999 if the S26 Ultra is already out?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, unless you need the S26 Ultra's specific upgrades. At $999 the S25 Ultra saves $300 versus the $1,299 S26 Ultra and stays flagship-grade — the S Pen, 200 MP camera, and 5,000 mAh battery are unchanged year-over-year.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I switch between iPhone and Galaxy easily?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes for most data, with caveats. Apple's Move to iOS and Samsung's Smart Switch transfer photos, contacts, calendar, music, messages, and most app data. iMessage threads convert to plain SMS on Android; Apple Watch does not pair with Android; some paid apps must be re-purchased.",
          },
        },
        {
          "@type": "Question",
          "name": "Does the iPhone 16 Pro have a better camera than the Galaxy S25 Ultra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For video, yes — 4K 120fps Dolby Vision gives iPhone an edge. For photos, Samsung wins on telephoto reach (3x + 5x dual telephoto vs Apple's single 5x) and resolution (200 MP vs 48 MP main).",
          },
        },
        {
          "@type": "Question",
          "name": "Which has better battery life, iPhone 16 Pro or Galaxy S25 Ultra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Galaxy S25 Ultra, by a comfortable margin. 5,000 mAh vs iPhone's 3,582 mAh translates to roughly 30-40% more screen-on time in mixed use and faster charging (45W vs 27W).",
          },
        },
        {
          "@type": "Question",
          "name": "Is Galaxy AI better than Apple Intelligence?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "As of May 2026, Galaxy AI is more mature in feature breadth — Live Translate, Circle to Search, Now Brief, and generative photo edit all shipped earlier. Apple Intelligence is more privacy-aligned, running most features on-device or via Private Cloud Compute.",
          },
        },
      ],
    },
  ],
};

async function main() {
  console.log(`Publishing comparison slug="${SLUG}"...`);

  const result = await saveComparison(comparison);
  if (!result) {
    console.error("FAIL: saveComparison returned null. Check DATABASE_URL.");
    process.exit(1);
  }

  console.log(`Comparison saved: id=${result.id}`);

  // Persist validated schema markup in the DB (DAN-608 §7 validated @graph)
  const prisma = getPrisma();
  if (!prisma) {
    console.error("FAIL: no DB connection for schema_markup update.");
    process.exit(1);
  }

  // Freeze datePublished: only set if not already set (first publish only per DAN-608 §4)
  const existing = await prisma.comparison.findUnique({
    where: { slug: SLUG },
    select: { publishedAt: true, schemaMarkup: true },
  });

  const frozenDatePublished = existing?.publishedAt
    ? existing.publishedAt.toISOString()
    : DATE_PUBLISHED;

  // Inject the frozen datePublished into schema
  const schemaWithDates = {
    ...VALIDATED_SCHEMA,
    "@graph": VALIDATED_SCHEMA["@graph"].map((node: Record<string, unknown>) => {
      if (node["@type"] === "Article") {
        return { ...node, datePublished: frozenDatePublished, dateModified: DATE_MODIFIED };
      }
      return node;
    }),
  };

  await prisma.comparison.update({
    where: { slug: SLUG },
    data: {
      schemaMarkup: schemaWithDates as object,
      publishedAt: existing?.publishedAt ?? new Date(frozenDatePublished),
    },
  });

  console.log(`Schema markup stored. datePublished=${frozenDatePublished} dateModified=${DATE_MODIFIED}`);
  console.log(`Live URL (after ISR): https://aversusb.net/compare/${SLUG}`);
}

main().catch((err) => {
  console.error("Publish error:", err);
  process.exit(1);
});
