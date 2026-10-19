import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Coleman vs YETI. Facts read 19 October
 * 2026 from Newell Brands' Coleman brand listing, coleman.com cooler and tent
 * category listings, and YETI's fourth-quarter and full year 2025 results
 * release. Coleman's founding year and warranty terms, and YETI's warranty,
 * could not be read on an official source, so they are left out. No product
 * prices are printed; readers get vendor links. No winner.
 */

const A = "coleman";
const B = "yeti";

const NEWELL_COLEMAN = "https://www.newellbrands.com/our-brands/coleman";
const COLEMAN_COOLERS = "https://www.coleman.com/coolers/";
const COLEMAN_TENTS = "https://www.coleman.com/tents/";
const YETI_RESULTS =
  "https://investors.yeti.com/news/news-details/2026/YETI-ReportsFourth-Quarter-and-Full-Year-2025-Results-Provides-Full-Year-2026-Outlook/default.aspx";
const YETI_SHOP = "https://www.yeti.com/";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Coolers and outdoor gear";

const SHORT_ANSWER =
  "Coleman is a camping brand owned by Newell Brands that sells tents from 2-person to 10+ person sizes, hard and soft coolers including the collapsible Snap 'N Go hard cooler, and insulated drinkware. YETI is an Austin, Texas outdoor brand selling coolers, drinkware, bags and apparel; it reported 2025 net sales of $1,868.5 million, with coolers and equipment up 7% to $748.5 million on strong soft cooler, bag and cargo sales. Neither is better for everyone.";

const FAQS = [
  {
    question: "Who owns Coleman and YETI?",
    answer:
      "Coleman is one of Newell Brands' consumer brands, alongside names such as Contigo and Marmot. YETI Holdings is a public company headquartered in Austin, Texas.",
  },
  {
    question: "Does Coleman make tents as well as coolers?",
    answer:
      "Yes. Coleman sells camping tents from 2-3 person sizes up to 10+ person models, and says its WeatherTec system uses inverted seams and welded floors to keep campers dry. YETI's range centers on coolers, drinkware, bags and apparel.",
  },
  {
    question: "What kinds of coolers does each brand sell?",
    answer:
      "Coleman sells hard coolers, soft coolers and the Snap 'N Go collapsible hard cooler, which Coleman says collapses nearly flat in seconds. YETI sells coolers, including soft coolers, and its coolers and equipment sales reached $748.5 million in 2025.",
  },
  {
    question: "Do Coleman and YETI sell drinkware?",
    answer:
      "Yes. Coleman sells insulated drinkware with double-wall construction and leak-proof lids. YETI's drinkware net sales were $1,085.8 million in 2025, its largest category.",
  },
  {
    question: "How big is YETI?",
    answer:
      "YETI reported 2025 net sales of $1,868.5 million, up 2%, including $394.4 million of international sales, up 16%.",
  },
  {
    question: "Where can I compare current prices?",
    answer:
      "Prices change with size, color and promotions. See vendor page for current price on Coleman and YETI coolers and drinkware.",
  },
];

const VERDICT = `Best for a full camping setup from one brand: Coleman, with tents from 2-person to 10+ person sizes, coolers and drinkware.

Best for a dedicated outdoor cooler, bag and drinkware line: YETI, whose coolers and equipment sales grew 7% in 2025.

Compare current prices and sizes on each vendor page.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Coleman is a Newell Brands brand.
- Coleman sells tents, hard and soft coolers, and insulated drinkware.
- Coleman's Snap 'N Go hard cooler collapses nearly flat, Coleman says.
- YETI is headquartered in Austin, Texas, and reported 2025 net sales of $1,868.5 million.
- YETI's coolers and equipment sales grew 7% in 2025 to $748.5 million.

Ownership

Coleman is part of Newell Brands, whose other brands include Contigo, Marmot and Rubbermaid. YETI Holdings is a public company headquartered in Austin, Texas.

Coolers

Coleman sells hard coolers in large, medium and small sizes, soft coolers, and the Snap 'N Go collapsible hard cooler. YETI sells coolers and says soft coolers, bags and cargo drove its 2025 coolers and equipment growth.

Beyond coolers

Coleman sells tents from 2-3 person sizes to 10+ person models with its WeatherTec system, plus insulated drinkware. YETI sells drinkware, bags and apparel, and drinkware is its largest category at $1,085.8 million of 2025 net sales.

Who should pick which

Pick Coleman to outfit a campsite with tents, coolers and drinkware from one brand. Pick YETI for a focused line of coolers, bags and drinkware. Stanley vs YETI and Patagonia vs REI cover more outdoor gear.`;

const BUILT = buildEditorialComparison({
  slug: "coleman-vs-yeti",
  title: "Coleman vs YETI: Coolers, Tents, Drinkware",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "products",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Coleman",
      shortDesc: "Newell Brands camping brand selling tents, coolers and drinkware.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: ["Tents from 2-3 person to 10+ person sizes", "Hard, soft and collapsible coolers", "Insulated drinkware"],
      cons: [],
      bestFor: "Campers outfitting a full campsite from one brand",
    },
    {
      id: B,
      slug: B,
      name: "YETI",
      shortDesc: "Austin, Texas outdoor brand selling coolers, drinkware, bags and apparel.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: ["Coolers, including soft coolers, plus bags and cargo", "Drinkware is its largest category", "Apparel and Mystery Ranch"],
      cons: [],
      bestFor: "Buyers who want coolers, bags and drinkware from one outdoor brand",
    },
  ],
  keyDifferences: [
    { label: "Owner", entityAValue: "Newell Brands", entityBValue: "YETI Holdings, Austin, Texas", winner: "tie" },
    { label: "Range", entityAValue: "Tents, coolers, drinkware", entityBValue: "Coolers, drinkware, bags, apparel", winner: "tie" },
    { label: "Coolers", entityAValue: "Hard, soft, Snap 'N Go collapsible", entityBValue: "Coolers, including soft coolers", winner: "tie" },
    { label: "Tents", entityAValue: "2-3 person to 10+ person", entityBValue: "See vendor page", winner: "tie" },
  ],
  attributes: [
    textAttr("owner", "Ownership", GROUP, A, B, "Newell Brands", "YETI Holdings, public company"),
    textAttr("coolers", "Coolers", GROUP, A, B, "Hard, soft and Snap 'N Go collapsible hard coolers", "Coolers, including soft coolers; coolers and equipment $748.5 million in 2025"),
    textAttr("tents", "Tents", GROUP, A, B, "2-3 person to 10+ person; WeatherTec system", "See vendor page"),
    textAttr("drinkware", "Drinkware", GROUP, A, B, "Double-wall insulated drinkware with leak-proof lids", "Largest category: $1,085.8 million in 2025"),
    textAttr("other", "Other lines", GROUP, A, B, "Camping gear", "Bags, apparel, Mystery Ranch"),
    textAttr("hq", "Parent headquarters", GROUP, A, B, "Newell Brands, Atlanta, Georgia", "Austin, Texas"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "stanley-vs-yeti", title: "Stanley vs YETI", category: "products" },
    { slug: "patagonia-vs-rei", title: "Patagonia vs REI", category: "brands" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Coleman for a full camping setup with tents, coolers and drinkware; YETI for a focused line of coolers, bags and drinkware.",
    keyFact: "Coleman is a Newell Brands brand; YETI reported 2025 net sales of $1,868.5 million.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 14,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Newell Brands: Coleman", url: NEWELL_COLEMAN },
      { name: "See vendor page for current price: Coleman coolers and drinkware", url: COLEMAN_COOLERS },
      { name: "Coleman: Camping tents by size", url: COLEMAN_TENTS },
      { name: "YETI Investors: Q4 and full year 2025 results", url: YETI_RESULTS },
      { name: "See vendor page for current price: YETI", url: YETI_SHOP },
    ],
  },
  resources: [
    { type: "external", label: "Newell Brands: Coleman", url: NEWELL_COLEMAN, description: "Coleman among Newell Brands' brands; Newell Brands headquarters in Atlanta, Georgia." },
    { type: "external", label: "See vendor page for current price: Coleman coolers and drinkware", url: COLEMAN_COOLERS, description: "Hard, soft and Snap 'N Go collapsible coolers; double-wall drinkware." },
    { type: "external", label: "Coleman: Camping tents by size", url: COLEMAN_TENTS, description: "2-3 person to 10+ person tents; WeatherTec system." },
    { type: "external", label: "YETI Investors: Q4 and full year 2025 results", url: YETI_RESULTS, description: "February 19, 2026. Net sales $1,868.5M; drinkware $1,085.8M; coolers and equipment $748.5M; Austin, Texas." },
    { type: "external", label: "See vendor page for current price: YETI", url: YETI_SHOP, description: "YETI coolers, drinkware, bags and apparel." },
  ],
  metaTitle: "Coleman vs YETI: Coolers, Tents, Drinkware",
});

BUILT.metadata.metaDescription =
  "Coleman vs YETI: Newell Brands' camping line of tents, coolers and drinkware against YETI's coolers, drinkware, bags and apparel, with 2025 sales figures.";

export const COLEMAN_VS_YETI: EditorialComparison = BUILT;
