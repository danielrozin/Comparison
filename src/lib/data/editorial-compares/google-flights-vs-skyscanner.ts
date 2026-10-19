import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Google Flights vs Skyscanner. Facts read
 * 19 October 2026 from Google Travel Help articles and Skyscanner's partner
 * site (about-us and home). Skyscanner's consumer and help sites block
 * automated reads, so consumer-feature claims for Skyscanner (price alerts,
 * "Everywhere" search, fees) are left out. No winner.
 */

const A = "google-flights";
const B = "skyscanner";

const GF_SEARCH = "https://support.google.com/travel/answer/2475306";
const GF_RANKING = "https://support.google.com/travel/answer/7664728";
const GF_TRACK = "https://support.google.com/travel/answer/6235879";
const GF_EMISSIONS = "https://support.google.com/travel/answer/11116147";
const GF_DEALS = "https://support.google.com/travel/answer/16497283";
const SKY_ABOUT = "https://www.partners.skyscanner.net/about/about-us";
const SKY_PARTNERS = "https://www.partners.skyscanner.net/";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Flight search";

const SHORT_ANSWER =
  "Google Flights is a flight search tool from Google: it compares fares from more than 300 airline and online travel agency partners, sorts results into Best and Cheapest, tracks prices by email and estimates carbon emissions, then sends you to the airline or agency to book. Skyscanner is a travel search site that began in 2003 and says it searches billions of prices for flights, hotels and car hire, with more than 160 million monthly users in 180 countries and 1,200+ travel partners. Neither is better for everyone.";

const FAQS = [
  {
    question: "Can you book flights directly on Google Flights or Skyscanner?",
    answer:
      "Google says that on Google Flights you usually finish booking on the airline or online travel agency site. Skyscanner is a search site that connects travelers with airline, hotel, car hire and travel agency partners.",
  },
  {
    question: "Does Skyscanner search hotels and car hire too?",
    answer:
      "Yes. Skyscanner says it searches billions of prices for flights, hotels and car hire. Google Flights covers flights.",
  },
  {
    question: "How does Google Flights rank results?",
    answer:
      "Google says Google Flights shows results in Best and Cheapest tabs, with Best weighing price, convenience and ease of booking, and that travel partners do not pay Google to appear in the list of flights.",
  },
  {
    question: "Can Google Flights alert me when prices change?",
    answer:
      "Yes. Google says you can track prices for specific dates or for any dates on a route and get email alerts when fares change, plus emails when prices are likely to rise.",
  },
  {
    question: "What are Google Flights deals?",
    answer:
      "Google says its AI-powered Flight Deals tool, in beta, highlights fares that are at least 20% below the typical price for a route.",
  },
  {
    question: "How big is Skyscanner?",
    answer:
      "Skyscanner says more than 160 million people in 180 countries use its app and website every month, and it lists 1,200+ travel partners. It started in 2003.",
  },
];

const VERDICT = `Best for flexible-date fare hunting with price tracking: Google Flights, with a calendar and price graph, email alerts and Best or Cheapest sorting.

Best for searching flights, hotels and car hire in one place: Skyscanner, which says it searches billions of prices across all three.

With either, you book with the airline, hotel or agency you choose.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Google says Google Flights compares fares from more than 300 airline and travel agency partners.
- Google says partners do not pay for placement in Google Flights rankings.
- Google Flights tracks prices by email and estimates emissions per flight.
- Skyscanner says it searches billions of prices for flights, hotels and car hire.
- Skyscanner says it has more than 160 million monthly users in 180 countries.

How each search works

Google Flights searches one-way, round-trip and multi-city trips, with an interactive calendar and price graph to compare fares across days. Skyscanner searches flights, hotels and car hire, and lists 1,200+ travel partners.

Ranking and booking

Google says Google Flights splits results into Best and Cheapest tabs and that partners do not pay for placement. You usually finish booking on the airline or online travel agency site. Skyscanner sends travelers to its airline, hotel, car hire and agency partners.

Price tracking and deals

Google says you can track a route for specific dates or any dates and get email alerts, plus emails when prices are likely to rise. Its Flight Deals tool, in beta, flags fares at least 20% below the typical price.

Emissions

Google Flights shows carbon emissions estimates for flights, using the EASA label where available or Google's Travel Impact Model.

Who should pick which

Pick Google Flights for fare tracking, flexible dates and emissions estimates. Pick Skyscanner to compare flights, hotels and car hire in one search. Google Flights vs Kayak and Expedia vs Kayak compare other travel search tools.`;

const BUILT = buildEditorialComparison({
  slug: "google-flights-vs-skyscanner",
  title: "Google Flights vs Skyscanner: Search, Alerts",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "travel",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Google Flights",
      shortDesc: "Google's flight search tool, comparing fares from more than 300 airline and agency partners.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: ["More than 300 airline and agency partners", "Email price tracking and Flight Deals", "Emissions estimates per flight"],
      cons: ["Booking usually finishes on the airline or agency site", "Not every airline is included; a Google partnership is required"],
      bestFor: "Travelers tracking fares across flexible dates",
    },
    {
      id: B,
      slug: B,
      name: "Skyscanner",
      shortDesc: "Travel search site, started in 2003, searching flights, hotels and car hire.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: ["Flights, hotels and car hire in one search", "1,200+ travel partners", "More than 160 million monthly users in 180 countries"],
      cons: ["Prices come from partner airlines, hotels and agencies"],
      bestFor: "Travelers comparing flights, hotels and car hire together",
    },
  ],
  keyDifferences: [
    { label: "What it searches", entityAValue: "Flights", entityBValue: "Flights, hotels and car hire", winner: "tie" },
    { label: "Partners", entityAValue: "More than 300 airlines and agencies", entityBValue: "1,200+ travel partners", winner: "tie" },
    { label: "Price tracking", entityAValue: "Email alerts for dates or any dates", entityBValue: "See vendor site", winner: "tie" },
    { label: "Emissions", entityAValue: "Estimates per flight", entityBValue: "See vendor site", winner: "tie" },
  ],
  attributes: [
    textAttr("scope", "What it searches", GROUP, A, B, "Flights: one-way, round-trip, multi-city", "Flights, hotels and car hire"),
    textAttr("partners", "Partners", GROUP, A, B, "More than 300 airline and online travel agency partners", "1,200+ travel partners"),
    textAttr("ranking", "Ranking", GROUP, A, B, "Best and Cheapest tabs; partners do not pay for placement", "See vendor site"),
    textAttr("tracking", "Price tracking", GROUP, A, B, "Email alerts for specific dates or any dates", "See vendor site"),
    textAttr("deals", "Deals", GROUP, A, B, "Flight Deals (beta): fares at least 20% below typical", "See vendor site"),
    textAttr("audience", "Reach and updates", GROUP, A, B, "Calendar prices update about once every 24 hours", "More than 160 million monthly users in 180 countries"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "google-flights-vs-kayak", title: "Google Flights vs Kayak", category: "travel" },
    { slug: "expedia-vs-kayak", title: "Expedia vs Kayak", category: "travel" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Google Flights for fare tracking and flexible dates; Skyscanner for flights, hotels and car hire in one search.",
    keyFact: "Google Flights compares more than 300 airline and agency partners; Skyscanner lists 1,200+ travel partners.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 15,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Google Travel Help: Search for flights", url: GF_SEARCH },
      { name: "Google Travel Help: How results are ranked", url: GF_RANKING },
      { name: "Google Travel Help: Track flight prices", url: GF_TRACK },
      { name: "Google Travel Help: Carbon emissions estimates", url: GF_EMISSIONS },
      { name: "Google Travel Help: Flight Deals", url: GF_DEALS },
      { name: "Skyscanner Partners: About us", url: SKY_ABOUT },
      { name: "Skyscanner Partners: Home", url: SKY_PARTNERS },
    ],
  },
  resources: [
    { type: "external", label: "Google Travel Help: Search for flights", url: GF_SEARCH, description: "One-way, round-trip and multi-city search; 300+ partners; booking on airline or agency sites." },
    { type: "external", label: "Google Travel Help: How results are ranked", url: GF_RANKING, description: "Best and Cheapest tabs; partners do not pay for placement." },
    { type: "external", label: "Google Travel Help: Track flight prices", url: GF_TRACK, description: "Track specific dates or any dates; email alerts." },
    { type: "external", label: "Google Travel Help: Carbon emissions estimates", url: GF_EMISSIONS, description: "EASA label or Travel Impact Model estimates." },
    { type: "external", label: "Google Travel Help: Flight Deals", url: GF_DEALS, description: "Beta; a deal is at least 20% below the typical price." },
    { type: "external", label: "Skyscanner Partners: About us", url: SKY_ABOUT, description: "Started 2003; 160M+ monthly users; billions of prices for flights, hotels and car hire." },
    { type: "external", label: "Skyscanner Partners: Home", url: SKY_PARTNERS, description: "1,200+ travel partners; users in 180 countries." },
  ],
  metaTitle: "Google Flights vs Skyscanner: Search, Alerts",
});

BUILT.metadata.metaDescription =
  "Google Flights vs Skyscanner: 300+ fare partners, price tracking and emissions estimates against a flights, hotels and car hire search with 1,200+ partners.";

export const GOOGLE_FLIGHTS_VS_SKYSCANNER: EditorialComparison = BUILT;
