import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Apple TV vs Disney+.
 * Canonical slug apple-tv-plus-vs-disney-plus (Bing slug apple-tv-vs-disney
 * 301s here). Facts read 19 October 2026 from apple.com/apple-tv, Apple TV
 * press "About", the Disney+ U.S. price help article and disneyplus.com.
 * Apple's own press pages list an older $12.99 price; the current consumer
 * Apple TV page lists $14.99/month, which is the figure used. No winner.
 */

const A = "apple-tv-plus";
const B = "disney-plus";

const APPLE_TV = "https://www.apple.com/apple-tv/";
const APPLE_TV_PR = "https://www.apple.com/tv-pr/about/";
const DISNEY_PRICE = "https://help.disneyplus.com/article/disneyplus-price";
const DISNEY_HOME = "https://www.disneyplus.com/";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Streaming";

const APPLE_PRICE = "$14.99/month, per Apple pricing page, Oct 2026";
const DISNEY_ADS = "$12.49/month, per Disney+ pricing page, Oct 2026";
const DISNEY_PREMIUM = "$21.49/month or $214.99/year, per Disney+ pricing page, Oct 2026";

const SHORT_ANSWER = `Apple TV (formerly Apple TV+) is a single plan at ${APPLE_PRICE}, built around Apple Originals that Apple says are commercial-free, plus sports such as MLS, Friday Night Baseball and F1 in the U.S. Disney+ is built around Disney, Pixar, Marvel, Star Wars and National Geographic, with Disney+ (With Ads) at ${DISNEY_ADS}, and Disney+ Premium (No Ads) at ${DISNEY_PREMIUM}. Neither is better for everyone.`;

const FAQS = [
  {
    question: "How much do Apple TV and Disney+ cost in the U.S.?",
    answer: `Apple TV is ${APPLE_PRICE}, with a 7-day free trial for new subscribers. Disney+ (With Ads) is ${DISNEY_ADS}, and Disney+ Premium (No Ads) is ${DISNEY_PREMIUM}.`,
  },
  {
    question: "Is Apple TV the same as Apple TV+?",
    answer:
      "Yes. Apple says Apple TV+ is now called Apple TV. It is the same subscription streaming service with Apple Originals, available in more than 100 countries and regions.",
  },
  {
    question: "Which service has ads?",
    answer:
      "Apple says Apple Originals on Apple TV are commercial-free. Disney+ has a lower-priced With Ads plan and a Premium (No Ads) plan.",
  },
  {
    question: "What can I watch on each service?",
    answer:
      "Apple TV centers on Apple Originals series and films, plus live sports including MLS, Friday Night Baseball and F1 in the U.S. Disney+ carries Disney, Pixar, Marvel, Star Wars and National Geographic titles, and eligible bundle subscribers can stream Hulu and ESPN content in the Disney+ app.",
  },
  {
    question: "Can I share or bundle these services?",
    answer:
      "Apple says Apple TV can be shared with up to six people in total through Family Sharing, and it is included in Apple One plans that start at $21.95/month, per Apple pricing page, Oct 2026. Disney offers bundles that bring Hulu and ESPN into the Disney+ app.",
  },
  {
    question: "Do both support downloads and 4K?",
    answer:
      "Apple says Apple TV lets you download titles to watch offline. Disney says Disney+ streams in 4K UHD and Dolby Atmos on compatible devices and offers parental controls, profile PINs and Junior Mode.",
  },
];

const VERDICT = `Best for one simple ad-free plan of original series, films and live sports: Apple TV, at ${APPLE_PRICE}.

Best for family franchises and a cheaper ad-supported tier: Disney+, from Disney, Pixar, Marvel, Star Wars and National Geographic.

Pick by the shows and sports you want to watch.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Apple TV is ${APPLE_PRICE}, with a 7-day free trial.
- Disney+ (With Ads) is ${DISNEY_ADS}.
- Disney+ Premium (No Ads) is ${DISNEY_PREMIUM}.
- Apple says Apple Originals are commercial-free; Disney+ has a With Ads tier.
- Apple TV adds live sports such as MLS, Friday Night Baseball and F1 in the U.S.

Plans and price

Apple TV has one monthly plan at ${APPLE_PRICE}, and Apple One plans that include it start at $21.95/month, per Apple pricing page, Oct 2026. Disney+ has two U.S. tiers: With Ads at ${DISNEY_ADS}, and Premium (No Ads) at ${DISNEY_PREMIUM}.

Content

Apple TV is built around Apple Originals: series, films and documentaries made for the service. Disney+ draws on Disney, Pixar, Marvel, Star Wars and National Geographic, and eligible bundles add Hulu and ESPN content inside the Disney+ app.

Sports

Apple lists MLS, Friday Night Baseball and F1 in the U.S. among Apple TV sports. Disney+ sports come through ESPN content for eligible bundle subscribers.

Viewing features

Apple TV supports offline downloads and Family Sharing for up to six people in total. Disney says Disney+ supports 4K UHD and Dolby Atmos on compatible devices, plus parental controls, profile PINs and Junior Mode.

Who should pick which

Pick Apple TV for prestige originals and Apple's live sports without ads. Pick Disney+ for family franchises, a lower ad-supported price or a Hulu and ESPN bundle. Disney+ vs Hulu and Disney+ vs Peacock compare other streamers.`;

const BUILT = buildEditorialComparison({
  slug: "apple-tv-plus-vs-disney-plus",
  title: "Apple TV vs Disney+: Price, Content, Sports",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "entertainment",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Apple TV",
      shortDesc: "Apple's streaming service, formerly Apple TV+, with Apple Originals and live sports.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: ["Apple says Apple Originals are commercial-free", "MLS, Friday Night Baseball and F1 in the U.S.", "Family Sharing for up to six people"],
      cons: ["One plan with no lower-priced ad tier", "Catalog centers on Apple Originals"],
      bestFor: "Viewers who want ad-free original series, films and Apple's live sports",
    },
    {
      id: B,
      slug: B,
      name: "Disney+",
      shortDesc: "Disney's streaming service with Disney, Pixar, Marvel, Star Wars and National Geographic.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: ["Disney, Pixar, Marvel, Star Wars and National Geographic", "Lower-priced With Ads plan", "4K UHD and Dolby Atmos on compatible devices"],
      cons: ["No-ads Premium plan costs more", "Hulu and ESPN content needs an eligible bundle"],
      bestFor: "Families and franchise fans, and people who want a Hulu and ESPN bundle",
    },
  ],
  keyDifferences: [
    { label: "U.S. price", entityAValue: APPLE_PRICE, entityBValue: `With Ads ${DISNEY_ADS}; Premium ${DISNEY_PREMIUM}`, winner: "tie" },
    { label: "Ads", entityAValue: "Apple Originals commercial-free", entityBValue: "With Ads or Premium (No Ads)", winner: "tie" },
    { label: "Content", entityAValue: "Apple Originals", entityBValue: "Disney, Pixar, Marvel, Star Wars, National Geographic", winner: "tie" },
    { label: "Live sports", entityAValue: "MLS, Friday Night Baseball, F1 (U.S.)", entityBValue: "ESPN content with eligible bundles", winner: "tie" },
  ],
  attributes: [
    textAttr("price", "U.S. price", GROUP, A, B, APPLE_PRICE, `With Ads ${DISNEY_ADS}; Premium (No Ads) ${DISNEY_PREMIUM}`),
    textAttr("trial", "Free trial", GROUP, A, B, "7 days for new subscribers", "See vendor site"),
    textAttr("content", "Main content", GROUP, A, B, "Apple Originals series, films and documentaries", "Disney, Pixar, Marvel, Star Wars and National Geographic"),
    textAttr("sports", "Live sports", GROUP, A, B, "MLS, Friday Night Baseball, F1 in the U.S.", "ESPN content for eligible bundle subscribers"),
    textAttr("bundle", "Bundles", GROUP, A, B, "Apple One plans start at $21.95/month, per Apple pricing page, Oct 2026", "Bundles with Hulu and ESPN"),
    textAttr("features", "Viewing features", GROUP, A, B, "Offline downloads; Family Sharing for up to six people", "4K UHD and Dolby Atmos on compatible devices; parental controls and Junior Mode"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "disney-plus-vs-hulu", title: "Disney+ vs Hulu", category: "entertainment" },
    { slug: "disney-vs-netflix", title: "Disney+ vs Netflix", category: "entertainment" },
    { slug: "disney-plus-vs-peacock", title: "Disney+ vs Peacock", category: "entertainment" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Apple TV for ad-free originals and live sports in one plan; Disney+ for family franchises, a cheaper ad tier and bundles.",
    keyFact: `Apple TV is ${APPLE_PRICE}; Disney+ (With Ads) is ${DISNEY_ADS}.`,
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 16,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple: Apple TV", url: APPLE_TV },
      { name: "Apple TV Press: About", url: APPLE_TV_PR },
      { name: "Disney+ Help: Disney+ price", url: DISNEY_PRICE },
      { name: "Disney+: Home", url: DISNEY_HOME },
    ],
  },
  resources: [
    { type: "external", label: "Apple: Apple TV", url: APPLE_TV, description: `${APPLE_PRICE}; 7-day trial; Apple One plans start at $21.95/month; sports and Family Sharing.` },
    { type: "external", label: "Apple TV Press: About", url: APPLE_TV_PR, description: "Apple TV+ is now Apple TV; available in more than 100 countries and regions." },
    { type: "external", label: "Disney+ Help: Disney+ price", url: DISNEY_PRICE, description: `U.S. plans: With Ads ${DISNEY_ADS}; Premium (No Ads) ${DISNEY_PREMIUM}.` },
    { type: "external", label: "Disney+: Home", url: DISNEY_HOME, description: "Disney, Pixar, Marvel, Star Wars, National Geographic; 4K UHD, Dolby Atmos, Junior Mode, bundles." },
  ],
  metaTitle: "Apple TV vs Disney+: Price, Content, Sports",
});

BUILT.metadata.metaDescription =
  "Apple TV vs Disney+: $14.99/month ad-free Apple Originals and live sports against Disney+ plans with or without ads. U.S. prices, content and bundles.";

export const APPLE_TV_PLUS_VS_DISNEY_PLUS: EditorialComparison = BUILT;
