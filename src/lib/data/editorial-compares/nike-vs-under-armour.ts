import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Nike vs Under Armour.
 * Facts read 19 October 2026 from Nike's fiscal 2026 results release (year ended
 * May 31, 2026) and Under Armour's fiscal 2026 results release (year ended
 * March 31, 2026). Company-reported revenue only; no product prices, no
 * quality or performance claims. No winner.
 */

const A = "nike";
const B = "under-armour";

const NIKE_FY26 =
  "https://investors.nike.com/news-events/press-releases/detail/571/nike-inc-reports-fiscal-2026-fourth-quarter-and-full-year-results";
const UA_FY26 =
  "https://about.underarmour.com/en/stories/press-releases/release.553941d2-7cb3-415e-9b34-226dce838cb1.html";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Athletic brands";

const SHORT_ANSWER =
  "Nike is roughly nine times Under Armour's size: Nike reported $46.4 billion in revenue for fiscal 2026, including $7.0 billion of Jordan Brand sales, and also owns Converse. Under Armour, based in Baltimore and around since 1996, reported $5.0 billion, of which apparel was $3.4 billion, footwear $1.1 billion and accessories $414 million. Nike sells more through wholesale partners than its own channels; Under Armour also leans on wholesale. Neither is better for everyone.";

const FAQS = [
  {
    question: "How big is Nike compared with Under Armour?",
    answer:
      "Nike reported $46.4 billion in revenue for fiscal 2026, which ended May 31, 2026. Under Armour reported $5.0 billion for its fiscal 2026, which ended March 31, 2026.",
  },
  {
    question: "Where are Nike and Under Armour based?",
    answer:
      "Nike is based near Beaverton, Oregon. Under Armour is based in Baltimore, Maryland, and says it has been in business since 1996.",
  },
  {
    question: "What brands does each company own?",
    answer:
      "Nike sells the NIKE Brand, Jordan Brand and Converse, a wholly owned subsidiary. Jordan Brand sales were $7,034 million in fiscal 2026. Under Armour sells under the Under Armour brand.",
  },
  {
    question: "What does Under Armour sell most?",
    answer:
      "Apparel. Under Armour reported fiscal 2026 apparel revenue of $3.4 billion, footwear of $1.1 billion and accessories of $414 million.",
  },
  {
    question: "Do Nike and Under Armour sell mostly through stores or online?",
    answer:
      "Both sell more through wholesale partners than directly. Nike reported $27.5 billion in wholesale revenue and $17.7 billion from NIKE Direct. Under Armour reported $2.8 billion in wholesale and $2.1 billion direct to consumer.",
  },
  {
    question: "Who runs Under Armour?",
    answer:
      "Kevin Plank is Under Armour's President and CEO. Under Armour says the company has made athletic apparel, footwear and accessories since 1996.",
  },
];

const VERDICT = `Nike: the much larger company, with $46.4 billion in fiscal 2026 revenue and the Jordan Brand and Converse labels.

Under Armour: a $5.0 billion performance brand from Baltimore, with apparel making up most of its sales.

Pick by fit, sport and style; company size says nothing about which product suits you.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Nike reported $46.4 billion in revenue for fiscal 2026, which ended May 31, 2026.
- Under Armour reported $5.0 billion for fiscal 2026, which ended March 31, 2026.
- Jordan Brand sales were $7,034 million, and Converse is a wholly owned Nike subsidiary.
- Apparel was $3.4 billion of Under Armour's revenue, footwear $1.1 billion.
- Both companies sell more through wholesale than through their own stores and sites.

Size and revenue

Nike reported fiscal 2026 revenue of $46.4 billion, flat on a reported basis, with NIKE Brand revenue of $45.2 billion. Under Armour reported revenue of $5.0 billion, down 4%, with $2.9 billion from North America and $2.1 billion from international markets.

Brands and products

Nike's portfolio includes the NIKE Brand, Jordan Brand and Converse. Under Armour sells apparel, footwear and accessories under one brand; apparel brought in $3.4 billion, footwear $1.1 billion and accessories $414 million.

How they sell

1. Nike: $27.5 billion in wholesale revenue and $17.7 billion through NIKE Direct in fiscal 2026.
2. Under Armour: $2.8 billion in wholesale and $2.1 billion direct to consumer, with 443 Factory House and Brand House doors at March 31, 2026.

Company background

Nike is based near Beaverton, Oregon. Under Armour is based in Baltimore, Maryland, says it has made athletic gear since 1996, and is led by President and CEO Kevin Plank. Under Armour sold its MyFitnessPal platform in fiscal 2025.

Who should pick which

Company size does not decide which shoe or shirt fits you. Try both in your sport and size. Nike vs Adidas and Nike vs Reebok cover Nike's other rivals.`;

const BUILT = buildEditorialComparison({
  slug: "nike-vs-under-armour",
  title: "Nike vs Under Armour: Size, Brands and Sales",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "brands",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Nike",
      shortDesc: "Athletic footwear and apparel company based near Beaverton, Oregon, with $46.4 billion in fiscal 2026 revenue.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: ["$46.4 billion in fiscal 2026 revenue", "Owns Jordan Brand and Converse", "Large wholesale and NIKE Direct reach"],
      cons: ["NIKE Direct revenue fell 6% in fiscal 2026", "Revenue was flat on a reported basis"],
      bestFor: "Shoppers who want the widest range across sports and brands",
    },
    {
      id: B,
      slug: B,
      name: "Under Armour",
      shortDesc: "Baltimore-based performance brand, in business since 1996, with $5.0 billion in fiscal 2026 revenue.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: ["Apparel-led line: $3.4 billion of revenue", "443 Factory House and Brand House doors", "Single focused performance brand"],
      cons: ["Revenue fell 4% in fiscal 2026", "Footwear revenue fell 11%"],
      bestFor: "Shoppers focused on performance apparel",
    },
  ],
  keyDifferences: [
    { label: "Fiscal 2026 revenue", entityAValue: "$46.4 billion (year to May 31, 2026)", entityBValue: "$5.0 billion (year to March 31, 2026)", winner: "tie" },
    { label: "Brands", entityAValue: "NIKE, Jordan, Converse", entityBValue: "Under Armour", winner: "tie" },
    { label: "Headquarters", entityAValue: "Near Beaverton, Oregon", entityBValue: "Baltimore, Maryland", winner: "tie" },
    { label: "Wholesale vs direct", entityAValue: "$27.5B wholesale, $17.7B direct", entityBValue: "$2.8B wholesale, $2.1B direct", winner: "tie" },
  ],
  attributes: [
    textAttr("revenue", "Fiscal 2026 revenue", GROUP, A, B, "$46.4 billion, flat", "$5.0 billion, down 4%"),
    textAttr("year-end", "Fiscal year end", GROUP, A, B, "May 31, 2026", "March 31, 2026"),
    textAttr("hq", "Headquarters", GROUP, A, B, "Near Beaverton, Oregon", "Baltimore, Maryland"),
    textAttr("brands", "Brands", GROUP, A, B, "NIKE Brand, Jordan Brand ($7,034 million), Converse", "Under Armour"),
    textAttr("channels", "Wholesale and direct", GROUP, A, B, "Wholesale $27.5 billion; NIKE Direct $17.7 billion", "Wholesale $2.8 billion; DTC $2.1 billion"),
    textAttr("mix", "Product mix", GROUP, A, B, "Footwear, apparel, equipment and accessories", "Apparel $3.4B, footwear $1.1B, accessories $414M"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "nike-vs-adidas", title: "Nike vs Adidas", category: "brands" },
    { slug: "nike-vs-reebok", title: "Nike vs Reebok", category: "brands" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Nike for range across sports and brands; Under Armour for a focused performance-apparel line.",
    keyFact: "Nike reported $46.4 billion in fiscal 2026 revenue; Under Armour reported $5.0 billion.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 16,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NIKE, Inc.: Fiscal 2026 fourth quarter and full year results", url: NIKE_FY26 },
      { name: "Under Armour: Fourth quarter and full-year fiscal 2026 results", url: UA_FY26 },
    ],
  },
  resources: [
    { type: "external", label: "NIKE, Inc.: Fiscal 2026 fourth quarter and full year results", url: NIKE_FY26, description: "June 30, 2026. Revenue $46.4B; NIKE Brand $45.2B; wholesale $27.5B; NIKE Direct $17.7B; Jordan Brand $7,034M." },
    { type: "external", label: "Under Armour: Fourth quarter and full-year fiscal 2026 results", url: UA_FY26, description: "May 12, 2026. Revenue $5.0B; apparel $3.4B; footwear $1.1B; accessories $414M; 443 doors." },
  ],
  metaTitle: "Nike vs Under Armour | A Versus B",
});

BUILT.metadata.metaDescription =
  "Nike vs Under Armour: $46.4 billion against $5.0 billion in fiscal 2026 revenue, brands, product mix, wholesale and direct sales, and headquarters.";

export const NIKE_VS_UNDER_ARMOUR: EditorialComparison = BUILT;
