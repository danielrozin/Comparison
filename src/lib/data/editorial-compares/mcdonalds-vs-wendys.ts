import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): McDonald's vs Wendy's.
 * Canonical slug mcdonalds-vs-wendys; the Bing 404 slug mcdonald-s-vs-wendy-s
 * and its reverse 301 here (not-found-cleanup-redirects.ts).
 * Facts read 19 October 2026 from McDonald's corporate pages and Wendy's
 * investor overview. Calorie figures were dropped: Wendy's official sources
 * disagreed with each other. No menu prices. No winner.
 */

const A = "mcdonald-s";
const B = "wendy-s";

const MCD_FRANCHISING = "https://corporate.mcdonalds.com/corpmcd/franchising-overview.html";
const MCD_WHO = "https://corporate.mcdonalds.com/corpmcd/our-company/who-we-are.html";
const WENDYS_IR = "https://www.irwendys.com/";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Fast food";

const SHORT_ANSWER =
  "McDonald's is far bigger: it says it has over 44,000 locations in more than 100 countries and serves 70 million customers a day, with about 95% of restaurants run by independent franchisees. Wendy's, founded in 1969, says it has more than 7,000 restaurants worldwide and builds its menu around made-to-order square hamburgers using fresh beef in the contiguous U.S., Alaska, Canada and several other markets, plus the Baconator and the Frosty. Neither is better for everyone.";

const FAQS = [
  {
    question: "Which chain is bigger, McDonald's or Wendy's?",
    answer:
      "McDonald's. It says it has over 44,000 locations in more than 100 countries. Wendy's says it has more than 7,000 restaurants worldwide.",
  },
  {
    question: "Does Wendy's use fresh beef?",
    answer:
      "Wendy's says its square hamburgers use fresh beef in the contiguous U.S. and Alaska, Canada, Mexico, Puerto Rico, the United Kingdom and select other markets.",
  },
  {
    question: "Who owns McDonald's restaurants?",
    answer:
      "Mostly franchisees. McDonald's says about 95% of its restaurants are owned and operated by independent local business owners.",
  },
  {
    question: "Where did McDonald's and Wendy's start?",
    answer:
      "McDonald's says it began as a small drive-in in San Bernardino, California, more than 65 years ago. Wendy's was founded in 1969, and its founder established the Dave Thomas Foundation for Adoption.",
  },
  {
    question: "What are each chain's signature items?",
    answer:
      "Wendy's names its square hamburgers, the Spicy Chicken Sandwich, nuggets, the Baconator and the Frosty. McDonald's menu includes the Big Mac.",
  },
  {
    question: "How many customers does McDonald's serve?",
    answer:
      "McDonald's says it serves 70 million customers every day across its more than 44,000 locations.",
  },
];

const VERDICT = `McDonald's: the larger global chain, with over 44,000 locations in more than 100 countries and about 95% franchise-run.

Wendy's: a smaller chain of more than 7,000 restaurants, built around square burgers using fresh beef in North America and select markets.

Pick by what you order and what is near you; neither is better for everyone.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- McDonald's says it has over 44,000 locations in more than 100 countries.
- Wendy's says it has more than 7,000 restaurants worldwide.
- About 95% of McDonald's restaurants are owned and operated by independent franchisees.
- Wendy's uses fresh beef for its square hamburgers in the contiguous U.S., Alaska, Canada and other listed markets.
- Wendy's signature items include the Baconator and the Frosty.

Size and reach

McDonald's is the bigger company. It says it has over 44,000 locations in more than 100 countries and serves 70 million customers every day. Wendy's says the company and its franchisees employ hundreds of thousands of people across more than 7,000 restaurants worldwide.

Ownership model

McDonald's says about 95% of its restaurants are owned and operated by independent local business owners. Wendy's describes a system of company and franchised restaurants.

Menu focus

Wendy's builds its menu around made-to-order square hamburgers using fresh beef, available in the contiguous U.S. and Alaska, Canada, Mexico, Puerto Rico, the United Kingdom and select markets. It also names the Spicy Chicken Sandwich, nuggets, the Baconator and the Frosty dessert. McDonald's centers on burgers such as the Big Mac and on Ray Kroc's standards of Quality, Service, Cleanliness and Value.

History

1. McDonald's: began as a small drive-in in San Bernardino, California, more than 65 years ago.
2. Wendy's: founded in 1969; its founder established the Dave Thomas Foundation for Adoption.

Who should pick which

Pick McDonald's for the widest reach, including when you travel abroad. Pick Wendy's if you prefer square burgers made with fresh beef where it is offered, or a Frosty. Burger King vs McDonald's and Chipotle vs Taco Bell cover other fast-food choices.`;

const BUILT = buildEditorialComparison({
  slug: "mcdonalds-vs-wendys",
  title: "McDonald's vs Wendy's: Size, Beef and Menu",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "companies",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "McDonald's",
      shortDesc: "Global burger chain with over 44,000 locations in more than 100 countries, about 95% franchise-run.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: ["Over 44,000 locations in more than 100 countries", "Serves 70 million customers a day", "Big Mac on the menu"],
      cons: ["About 95% of restaurants run by franchisees rather than the company"],
      bestFor: "Diners who want the widest reach",
    },
    {
      id: B,
      slug: B,
      name: "Wendy's",
      shortDesc: "Burger chain founded in 1969 with more than 7,000 restaurants and square hamburgers using fresh beef.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: ["Made-to-order square hamburgers using fresh beef", "Baconator, Spicy Chicken Sandwich and Frosty", "Fresh beef in the U.S., Canada, Mexico, Puerto Rico and the UK"],
      cons: ["Far fewer restaurants than McDonald's", "Fresh beef only in listed markets"],
      bestFor: "Diners who want square burgers made with fresh beef",
    },
  ],
  keyDifferences: [
    { label: "Restaurants", entityAValue: "Over 44,000 in 100+ countries", entityBValue: "More than 7,000 worldwide", winner: "tie" },
    { label: "Ownership", entityAValue: "About 95% independent franchisees", entityBValue: "Company and franchised restaurants", winner: "tie" },
    { label: "Burger", entityAValue: "Big Mac", entityBValue: "Square hamburgers using fresh beef", winner: "tie" },
    { label: "Founded", entityAValue: "Drive-in in San Bernardino, California", entityBValue: "1969", winner: "tie" },
  ],
  attributes: [
    textAttr("locations", "Locations", GROUP, A, B, "Over 44,000 in more than 100 countries", "More than 7,000 worldwide"),
    textAttr("franchise", "Franchise share", GROUP, A, B, "About 95% owned and operated by independent local business owners", "Company and franchisee restaurants"),
    textAttr("beef", "Burger beef claim", GROUP, A, B, "Big Mac and other burgers", "Fresh beef in the contiguous U.S., Alaska, Canada, Mexico, Puerto Rico, UK and select markets"),
    textAttr("signature", "Signature items", GROUP, A, B, "Big Mac", "Square hamburgers, Spicy Chicken Sandwich, nuggets, Baconator, Frosty"),
    textAttr("origin", "Origin", GROUP, A, B, "Small drive-in in San Bernardino, California", "Founded 1969"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "burger-king-vs-mcdonald-s", title: "Burger King vs McDonald's", category: "companies" },
    { slug: "chipotle-vs-taco-bell", title: "Chipotle vs Taco Bell", category: "companies" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "McDonald's for reach worldwide; Wendy's for square burgers made with fresh beef where offered.",
    keyFact: "McDonald's says it has over 44,000 locations; Wendy's says it has more than 7,000.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 12,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "McDonald's: Franchising overview", url: MCD_FRANCHISING },
      { name: "McDonald's: Who we are", url: MCD_WHO },
      { name: "The Wendy's Company: Corporate overview", url: WENDYS_IR },
    ],
  },
  resources: [
    { type: "external", label: "McDonald's: Franchising overview", url: MCD_FRANCHISING, description: "Over 44,000 locations in over 100 countries; about 95% owned and operated by independent local business owners." },
    { type: "external", label: "McDonald's: Who we are", url: MCD_WHO, description: "Began as a small drive-in in San Bernardino, California; serves 70 million customers every day." },
    { type: "external", label: "The Wendy's Company: Corporate overview", url: WENDYS_IR, description: "More than 7,000 restaurants; founded 1969; square hamburgers using fresh beef; Baconator and Frosty." },
  ],
  metaTitle: "McDonald's vs Wendy's | A Versus B",
});

BUILT.metadata.metaDescription =
  "McDonald's vs Wendy's: 44,000+ locations against 7,000+, franchise model, fresh beef markets, signature items and history, from each company's own pages.";

export const MCDONALDS_VS_WENDYS: EditorialComparison = BUILT;
