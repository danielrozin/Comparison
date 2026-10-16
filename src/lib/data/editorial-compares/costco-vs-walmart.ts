import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Costco vs Walmart (blog /blog/costco-vs-walmart-2026-which-retailer-offers-better-value).
 * Facts read 16 October 2026 from Costco investor releases and customer
 * service (membership fees, warehouse count) and Walmart corporate (store
 * count, Walmart+ fee). Membership fees are the companies' own list fees.
 * No item prices, no basket studies, no savings claims. No winner.
 */

const A = "costco";
const B = "walmart";

const COSTCO_FEES = "https://customerservice.costco.com/app/answers/answer_view/a_id/1013504/";
const COSTCO_FEE_PR =
  "https://investor.costco.com/news/news-details/2024/Costco-Wholesale-Corporation-Reports-June-Sales-Results-and-Announces-Quarterly-Cash-Dividend-and-Plans-for-Membership-Fee-Increase/default.aspx";
const COSTCO_SEPT_2026 =
  "https://investor.costco.com/news/news-details/2026/Costco-Wholesale-Corporation-Reports-September-Sales-Results/default.aspx";
const COSTCO_OVERVIEW = "https://investor.costco.com/";
const WALMART_ABOUT = "https://corporate.walmart.com/about";
const WALMART_PLUS =
  "https://corporate.walmart.com/news/2025/09/01/walmart-plus-celebrates-5th-anniversary-with-expanded-video-streaming-choices";
const WALMART_PLUS_LAUNCH = "https://corporate.walmart.com/news/2020/09/01/walmart-introduces-walmart";

const SOURCE_DATE = "2026-10-16";
const PUBLISHED = "2026-10-16T00:00:00Z";
const SHOP = "Shopping";

const SHORT_ANSWER =
  "Costco is a membership warehouse club: you pay $65 a year for Gold Star or $130 for Executive (U.S. and Canada fees since September 1, 2024) to shop its 939 warehouses. Walmart is open to everyone with no fee, runs more than 10,900 stores in 19 countries, and sells an optional Walmart+ membership for $98 a year. Costco suits households that buy in bulk often enough to justify the fee; Walmart suits shoppers who want no fee, more locations and smaller pack sizes.";

const FAQS = [
  {
    question: "Do I need a membership to shop at Costco or Walmart?",
    answer:
      "Costco warehouses are for members; a Gold Star membership is $65 a year and Executive is $130 in the U.S. and Canada. Walmart stores and walmart.com are open to everyone. Walmart+ is an optional $98-a-year membership for delivery and other perks.",
  },
  {
    question: "How much is a Costco membership compared with Walmart+?",
    answer:
      "Costco: $65 a year for Gold Star, Business or Business add-on, and $130 for Executive, effective September 1, 2024. Walmart+: $98 a year, or $12.95 a month at its 2020 launch. Walmart lists a $49 annual fee for qualifying government assistance recipients.",
  },
  {
    question: "What does the Costco Executive membership add?",
    answer:
      "Executive members earn an annual 2% Reward on qualifying purchases, capped at $1,250 a year since September 1, 2024 (it was $1,000 before). It costs $130 a year, made up of the $65 primary membership plus a $65 upgrade.",
  },
  {
    question: "Is Costco cheaper than Walmart?",
    answer:
      "It depends on what you buy and how much. Costco sells a limited selection, often in larger packs, to members; Walmart sells a wider range in standard sizes with no fee. Prices change by item and location, so compare your own regular basket and include the membership fee.",
  },
  {
    question: "Which has more stores?",
    answer:
      "Walmart. Walmart reports more than 10,900 stores in 19 countries. Costco reported 939 warehouses on October 7, 2026, including 647 in the U.S. and Puerto Rico.",
  },
  {
    question: "Does a Costco membership cover a second person?",
    answer:
      "Yes. Costco says every membership includes one free household card for a member of the household aged 16 or over.",
  },
];

const VERDICT = `Best for frequent bulk shoppers: Costco, if your regular buying makes the $65 or $130 yearly fee worthwhile.

Best for no fee and convenience: Walmart, with more than 10,900 stores and an optional $98 Walmart+ membership.

Neither is cheaper for every household. Compare your own basket, including the fee.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Costco requires a membership: $65 Gold Star or $130 Executive a year in the U.S. and Canada.
- Walmart has no entry fee; Walmart+ is optional at $98 a year.
- Costco Executive pays a 2% annual Reward capped at $1,250.
- Walmart reports more than 10,900 stores in 19 countries; Costco reported 939 warehouses on October 7, 2026.
- Which is cheaper depends on your basket and how often you shop.

Membership and fees

Costco charges a yearly fee to shop its warehouses. Since September 1, 2024 the U.S. and Canada fees are $65 for Gold Star, Business and Business add-on, and $130 for Executive ($65 primary plus a $65 Executive upgrade). Every membership includes one free household card. Walmart has no entry fee. Walmart+ costs $98 a year, and Walmart lists $49 for qualifying government assistance recipients.

Store footprint

Walmart reports that about 280 million customers and members visit its more than 10,900 stores and websites in 19 countries each week. Costco reported 939 warehouses on October 7, 2026: 647 in the U.S. and Puerto Rico, 115 in Canada, 43 in Mexico and 37 in Japan among them.

How they sell

Costco says it offers members low prices on a limited selection of national brands and its own private label, often in larger packs. Walmart sells a broad assortment under its Every Day Low Prices commitment, in stores and online, with no membership required.

Rewards and perks

1. Costco Executive: 2% annual Reward on qualifying purchases, up to $1,250 a year.
2. Walmart+: Walmart lists free same-day delivery on grocery and prescriptions, free shipping with no order minimum, fuel discounts, and a streaming choice of Paramount+ or Peacock.

Who should pick which

Choose Costco if you buy enough in bulk, often enough, to cover the fee. Choose Walmart if you want no fee, smaller pack sizes and more locations. Target vs Walmart and Kroger vs Safeway cover other grocery and retail choices.`;

const BUILT = buildEditorialComparison({
  slug: "costco-vs-walmart",
  title: "Costco vs Walmart: Membership, Stores and Fees",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "companies",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Costco",
      shortDesc: "Membership warehouse club with 939 warehouses (October 7, 2026) and $65 or $130 yearly memberships.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: [
        "Executive 2% annual Reward, up to $1,250",
        "One free household card with every membership",
        "Limited selection of national brands and private label",
      ],
      cons: ["$65 or $130 yearly fee to shop warehouses", "Fewer locations than Walmart"],
      bestFor: "Households that buy in bulk often",
    },
    {
      id: B,
      slug: B,
      name: "Walmart",
      shortDesc: "Retailer with more than 10,900 stores in 19 countries, open to everyone, with optional $98 Walmart+.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: ["No fee to shop", "More than 10,900 stores in 19 countries", "Optional Walmart+ for $98 a year"],
      cons: ["Walmart+ perks need a paid membership", "No equivalent of Costco's Executive 2% Reward in the base offer"],
      bestFor: "Shoppers who want no fee, smaller packs and more locations",
    },
  ],
  keyDifferences: [
    { label: "Fee to shop", entityAValue: "$65 Gold Star, $130 Executive per year", entityBValue: "None", winner: "tie" },
    { label: "Optional membership", entityAValue: "Executive upgrade with 2% Reward up to $1,250", entityBValue: "Walmart+ $98 a year", winner: "tie" },
    { label: "Locations", entityAValue: "939 warehouses", entityBValue: "More than 10,900 stores", winner: "tie" },
    { label: "Assortment", entityAValue: "Limited selection, often bulk packs", entityBValue: "Broad assortment, standard sizes", winner: "tie" },
  ],
  attributes: [
    textAttr("fee", "Membership fee", SHOP, A, B, "$65 Gold Star or Business; $130 Executive (U.S. and Canada, from September 1, 2024)", "No fee to shop. Walmart+ $98 a year ($49 for qualifying government assistance recipients)"),
    textAttr("rewards", "Rewards", SHOP, A, B, "Executive: 2% annual Reward, capped at $1,250", "Walmart+ perks such as free delivery and fuel discounts"),
    textAttr("stores", "Locations", SHOP, A, B, "939 warehouses (647 in the U.S. and Puerto Rico)", "More than 10,900 stores in 19 countries"),
    textAttr("household", "Extra cardholder", SHOP, A, B, "One free household card, age 16 or over", "Not applicable to shop"),
    textAttr("model", "Model", SHOP, A, B, "Membership warehouse club", "Open-to-all retailer with optional membership"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "target-vs-walmart", title: "Target vs Walmart", category: "companies" },
    { slug: "kroger-vs-safeway", title: "Kroger vs Safeway", category: "companies" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Costco for frequent bulk shoppers who use the membership; Walmart for no fee and more locations.",
    keyFact: "Costco Gold Star is $65 a year and Executive $130; Walmart has no fee and Walmart+ is $98 a year.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 14,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Costco: Membership fee increase", url: COSTCO_FEES },
      { name: "Costco: June 2024 sales and membership fee release", url: COSTCO_FEE_PR },
      { name: "Costco: September 2026 sales results", url: COSTCO_SEPT_2026 },
      { name: "Costco: Investor relations corporate overview", url: COSTCO_OVERVIEW },
      { name: "Walmart: About", url: WALMART_ABOUT },
      { name: "Walmart: Walmart+ fifth anniversary", url: WALMART_PLUS },
      { name: "Walmart: Introducing Walmart+", url: WALMART_PLUS_LAUNCH },
    ],
  },
  resources: [
    { type: "external", label: "Costco: Membership fee increase", url: COSTCO_FEES, description: "Gold Star, Business and add-on $65; Executive $130; 2% Reward cap $1,250; one free household card." },
    { type: "external", label: "Costco: June 2024 sales and membership fee release", url: COSTCO_FEE_PR, description: "July 10, 2024. Fee change effective September 1, 2024; Executive is $65 primary plus $65 upgrade." },
    { type: "external", label: "Costco: September 2026 sales results", url: COSTCO_SEPT_2026, description: "October 7, 2026. 939 warehouses, including 647 in the U.S. and Puerto Rico." },
    { type: "external", label: "Costco: Investor relations corporate overview", url: COSTCO_OVERVIEW, description: "Membership warehouses offering low prices on a limited selection of national brands and private-label products." },
    { type: "external", label: "Walmart: About", url: WALMART_ABOUT, description: "More than 10,900 stores and eCommerce sites in 19 countries; about 280 million weekly customers and members." },
    { type: "external", label: "Walmart: Walmart+ fifth anniversary", url: WALMART_PLUS, description: "September 1, 2025. Walmart+ at $98 a year; benefits include same-day grocery and Rx delivery, free shipping and fuel discounts." },
    { type: "external", label: "Walmart: Introducing Walmart+", url: WALMART_PLUS_LAUNCH, description: "September 1, 2020. Walmart+ at $98 a year or $12.95 a month." },
  ],
  metaTitle: "Costco vs Walmart | A Versus B",
});

BUILT.metadata.metaDescription =
  "Costco vs Walmart: $65 or $130 Costco membership against no-fee Walmart and $98 Walmart+. Store counts, Executive 2% Reward and who each suits.";

export const COSTCO_VS_WALMART: EditorialComparison = BUILT;
