import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Stanley vs YETI. Facts read 19 October
 * 2026 from stanley1913.com (about and FAQ) and YETI's fourth-quarter and full
 * year 2025 results release (February 19, 2026). YETI's consumer site and
 * warranty terms block automated reads, so no YETI warranty claim is made, and
 * no product prices are printed; readers get vendor links. No winner.
 */

const A = "stanley";
const B = "yeti";

const STANLEY_ABOUT = "https://www.stanley1913.com/pages/about-stanley";
const STANLEY_FAQ = "https://www.stanley1913.com/pages/faq";
const STANLEY_SHOP = "https://www.stanley1913.com/";
const YETI_RESULTS =
  "https://investors.yeti.com/news/news-details/2026/YETI-ReportsFourth-Quarter-and-Full-Year-2025-Results-Provides-Full-Year-2026-Outlook/default.aspx";
const YETI_SHOP = "https://www.yeti.com/";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Drinkware and coolers";

const SHORT_ANSWER =
  "Stanley is a drinkware brand dating to 1913, when William Stanley Jr. invented the all-steel, double-wall vacuum bottle; it is a brand of PMI, sells Quencher tumblers, bottles, lunchboxes and coolers, and says its drinkware and food containers are warranted for the life of the product, excluding lids, seals and straws. YETI is an Austin, Texas outdoor brand selling coolers, drinkware, bags and apparel; it reported 2025 net sales of $1,868.5 million, with drinkware at $1,085.8 million and coolers and equipment at $748.5 million. Neither is better for everyone.";

const FAQS = [
  {
    question: "How old are Stanley and YETI?",
    answer:
      "Stanley says it dates to 1913, when William Stanley Jr. invented the all-steel, double-wall vacuum bottle. YETI is an Austin, Texas company that designs, sells and distributes outdoor products.",
  },
  {
    question: "Does Stanley have a lifetime warranty?",
    answer:
      "Stanley says the warranty on its drinkware and food containers lasts the life of the product, not including lids, seals and straws.",
  },
  {
    question: "What does each brand sell?",
    answer:
      "Stanley sells Quencher tumblers and other tumblers, water bottles, vacuum bottles, lunchboxes, coolers and jugs, and camp cookware. YETI says its range runs from coolers and drinkware to bags and apparel.",
  },
  {
    question: "How big is YETI's drinkware business?",
    answer:
      "YETI reported 2025 drinkware net sales of $1,085.8 million, down 1%, out of total net sales of $1,868.5 million. Coolers and equipment grew 7% to $748.5 million.",
  },
  {
    question: "Who owns Stanley?",
    answer:
      "Stanley describes itself as a brand of PMI. YETI Holdings is a publicly traded company headquartered in Austin, Texas.",
  },
  {
    question: "Where can I compare current prices?",
    answer:
      "Prices change with size, color and collection. See vendor page for current price on Stanley and YETI drinkware and coolers.",
  },
];

const VERDICT = `Best for drinkware with a life-of-product warranty: Stanley, which says its drinkware and food containers are warranted for life, excluding lids, seals and straws.

Best for a wider outdoor range of coolers, bags and apparel: YETI, whose coolers and equipment sales reached $748.5 million in 2025.

Compare current prices and sizes on each vendor page.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Stanley dates to 1913 and the all-steel, double-wall vacuum bottle.
- Stanley says its drinkware and food containers are warranted for the life of the product, excluding lids, seals and straws.
- YETI is headquartered in Austin, Texas.
- YETI reported 2025 net sales of $1,868.5 million.
- YETI's coolers and equipment sales grew 7% in 2025 to $748.5 million.

History and ownership

Stanley says William Stanley Jr. invented the all-steel, double-wall vacuum bottle in 1913, and it describes itself as a brand of PMI. YETI Holdings is a public company headquartered in Austin, Texas.

Product range

Stanley sells Quencher tumblers, other tumblers, water bottles, vacuum bottles, lunchboxes, coolers and jugs, and camp cookware. YETI sells coolers, drinkware, bags and apparel, and it acquired Mystery Ranch.

Business size

YETI reported 2025 net sales of $1,868.5 million: drinkware $1,085.8 million, coolers and equipment $748.5 million, and international sales $394.4 million. Stanley is a brand of PMI.

Warranty

Stanley says its drinkware and food containers are warranted for the life of the product, excluding lids, seals and straws. For YETI warranty terms, see vendor page.

Who should pick which

Pick Stanley for drinkware, lunchboxes and camp cookware backed by a life-of-product warranty. Pick YETI for a broader outdoor line of coolers, bags and apparel. Coleman vs YETI and Patagonia vs REI cover more outdoor gear.`;

const BUILT = buildEditorialComparison({
  slug: "stanley-vs-yeti",
  title: "Stanley vs YETI: Drinkware, Coolers, Warranty",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "products",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Stanley",
      shortDesc: "Drinkware brand dating to 1913 and the all-steel, double-wall vacuum bottle; a brand of PMI.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: ["Life-of-product warranty on drinkware and food containers", "Quencher tumblers, bottles and lunchboxes", "Camp cookware and jugs"],
      cons: ["Warranty excludes lids, seals and straws"],
      bestFor: "Buyers focused on tumblers, bottles and lunchboxes",
    },
    {
      id: B,
      slug: B,
      name: "YETI",
      shortDesc: "Austin, Texas outdoor brand selling coolers, drinkware, bags and apparel.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: ["Coolers, including soft coolers, plus bags and cargo", "Drinkware and apparel", "Acquired Mystery Ranch"],
      cons: [],
      bestFor: "Buyers who want coolers, bags and drinkware from one outdoor brand",
    },
  ],
  keyDifferences: [
    { label: "Heritage", entityAValue: "Since 1913", entityBValue: "Headquartered in Austin, Texas", winner: "tie" },
    { label: "Owner", entityAValue: "PMI", entityBValue: "YETI Holdings, Austin, Texas", winner: "tie" },
    { label: "Range", entityAValue: "Tumblers, bottles, lunchboxes, coolers, cookware", entityBValue: "Coolers, drinkware, bags, apparel", winner: "tie" },
    { label: "Warranty", entityAValue: "Life of product (drinkware, food containers)", entityBValue: "See vendor page", winner: "tie" },
  ],
  attributes: [
    textAttr("history", "History", GROUP, A, B, "1913, all-steel double-wall vacuum bottle", "Austin, Texas outdoor brand"),
    textAttr("owner", "Ownership", GROUP, A, B, "Brand of PMI", "YETI Holdings, public company"),
    textAttr("drinkware", "Drinkware", GROUP, A, B, "Quenchers, tumblers, water and vacuum bottles", "2025 drinkware net sales $1,085.8 million"),
    textAttr("coolers", "Coolers and gear", GROUP, A, B, "Coolers and jugs, lunchboxes, camp cookware", "2025 coolers and equipment net sales $748.5 million"),
    textAttr("other", "Other lines", GROUP, A, B, "Food containers", "Bags, apparel, Mystery Ranch"),
    textAttr("warranty", "Warranty", GROUP, A, B, "Life of product for drinkware and food containers, excluding lids, seals and straws", "See vendor page"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "coleman-vs-yeti", title: "Coleman vs YETI", category: "products" },
    { slug: "patagonia-vs-rei", title: "Patagonia vs REI", category: "brands" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Stanley for drinkware with a life-of-product warranty; YETI for a broader outdoor range of coolers, bags and apparel.",
    keyFact: "Stanley dates to 1913; YETI reported 2025 net sales of $1,868.5 million.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 14,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Stanley 1913: About Stanley", url: STANLEY_ABOUT },
      { name: "Stanley 1913: FAQ", url: STANLEY_FAQ },
      { name: "See vendor page for current price: Stanley 1913", url: STANLEY_SHOP },
      { name: "YETI Investors: Q4 and full year 2025 results", url: YETI_RESULTS },
      { name: "See vendor page for current price: YETI", url: YETI_SHOP },
    ],
  },
  resources: [
    { type: "external", label: "Stanley 1913: About Stanley", url: STANLEY_ABOUT, description: "1913 and William Stanley Jr.'s all-steel, double-wall vacuum bottle; a brand of PMI." },
    { type: "external", label: "Stanley 1913: FAQ", url: STANLEY_FAQ, description: "Life-of-product warranty on drinkware and food containers, excluding lids, seals and straws." },
    { type: "external", label: "See vendor page for current price: Stanley 1913", url: STANLEY_SHOP, description: "Quenchers, tumblers, bottles, lunchboxes, coolers and cookware." },
    { type: "external", label: "YETI Investors: Q4 and full year 2025 results", url: YETI_RESULTS, description: "February 19, 2026. Net sales $1,868.5M; drinkware $1,085.8M; coolers and equipment $748.5M; Austin, Texas." },
    { type: "external", label: "See vendor page for current price: YETI", url: YETI_SHOP, description: "YETI coolers, drinkware, bags, apparel and warranty terms." },
  ],
  metaTitle: "Stanley vs YETI: Drinkware, Coolers, Warranty",
});

BUILT.metadata.metaDescription =
  "Stanley vs YETI: a 1913 drinkware brand with a life-of-product warranty against YETI's coolers, drinkware, bags and apparel, with 2025 sales figures.";

export const STANLEY_VS_YETI: EditorialComparison = BUILT;
