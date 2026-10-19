import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Cronometer vs MyFitnessPal.
 * Facts read 19 October 2026 from cronometer.com (home and Gold pricing),
 * myfitnesspal.com (home and Premium) and MyFitnessPal's own membership-tier
 * post (April 2025). MyFitnessPal's U.S. price could not be read for October
 * 2026 (the Premium page is geo-priced), so no MyFitnessPal dollar figure is
 * printed; readers get the vendor link. No winner.
 */

const A = "cronometer";
const B = "myfitnesspal";

const CRONO_HOME = "https://cronometer.com/";
const CRONO_GOLD = "https://cronometer.com/gold/";
const MFP_HOME = "https://www.myfitnesspal.com/";
const MFP_TIERS = "https://blog.myfitnesspal.com/myfitnesspal-membership-pricing-tiers/";
const MFP_PREMIUM = "https://www.myfitnesspal.com/premium";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Nutrition tracking";

const SHORT_ANSWER =
  "Cronometer is built for detailed nutrient tracking: it says it tracks up to 95 nutrients and compounds, includes barcode scanning in its free Basic plan, and sells Gold for $10.99/month or $59.99/year, per Cronometer pricing page, Oct 2026. MyFitnessPal is built for calorie and macro logging at scale, with a database of 20.5 million foods, connections to more than 40 apps and devices, and Premium and Premium+ tiers that add barcode scanning, voice logging and meal planning. Neither is better for everyone.";

const FAQS = [
  {
    question: "Is barcode scanning free on Cronometer or MyFitnessPal?",
    answer:
      "Cronometer says barcode scanning is free in its Basic plan. MyFitnessPal lists the barcode scanner as a Premium feature.",
  },
  {
    question: "How much does Cronometer Gold cost?",
    answer:
      "Cronometer Gold is $10.99/month billed monthly or $59.99/year, per Cronometer pricing page, Oct 2026. Gold removes ads and adds Photo Log, Voice Log, Crono Coach, a fasting timer, a macro scheduler, a recipe importer and unlimited history.",
  },
  {
    question: "What do MyFitnessPal Premium and Premium+ add?",
    answer:
      "MyFitnessPal says Premium adds the barcode scanner, voice logging, meal scan, ad-free logging, custom calorie and macro goals and intermittent fasting tracking. Premium+ adds the Meal Planner and is offered in the US, UK, Australia, Canada, New Zealand and Ireland.",
  },
  {
    question: "Which app tracks more nutrients?",
    answer:
      "Cronometer centers on micronutrients and says you can track up to 95 nutrients and compounds. MyFitnessPal centers on calories and macros, with custom macro goals in Premium.",
  },
  {
    question: "Which app has the bigger food database?",
    answer:
      "MyFitnessPal says its database has 20.5 million foods. Cronometer says its free plan includes more than 1 million lab-analyzed or verified foods, a smaller list built around verified entries.",
  },
  {
    question: "Can I try the paid plans for free?",
    answer:
      "MyFitnessPal offers a 7-day free Premium trial to people who have never upgraded or started a trial before. Both apps have a free tier, and Cronometer Gold and MyFitnessPal Premium both remove ads.",
  },
];

const VERDICT = `Best for detailed micronutrient tracking: Cronometer, with up to 95 nutrients and compounds and free barcode scanning.

Best for a huge food database and app connections: MyFitnessPal, with 20.5 million foods and more than 40 connected apps and devices.

Both have free tiers; compare paid plans on each vendor page.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Cronometer says it tracks up to 95 nutrients and compounds.
- Cronometer includes barcode scanning free; MyFitnessPal puts it in Premium.
- Cronometer Gold is $10.99/month or $59.99/year, per Cronometer pricing page, Oct 2026.
- MyFitnessPal says its database has 20.5 million foods and works with more than 40 apps and devices.
- MyFitnessPal Premium+ adds a Meal Planner in six countries.

What each app tracks

Cronometer says it can track up to 95 nutrients and compounds, and its free Basic plan includes more than 1 million lab-analyzed or verified foods. MyFitnessPal focuses on calories and macros, and Premium adds custom calorie and macro goals.

Free plans

Cronometer Basic includes the barcode scanner and reports within a 7-day window. MyFitnessPal's free plan logs food and exercise with ads, and MyFitnessPal lists barcode scanning and meal scan under Premium.

Paid plans

1. Cronometer Gold: $10.99/month or $59.99/year, per Cronometer pricing page, Oct 2026. Adds ad-free use, Photo Log, Voice Log, Crono Coach, Fasting Timer, Macro Scheduler, Recipe Importer and unlimited history.
2. MyFitnessPal Premium: barcode scanner, voice logging, meal scan, ad-free logging, custom goals and intermittent fasting. Premium+ adds the Meal Planner. See vendor page for current price.

Database and connections

MyFitnessPal says it has 20.5 million foods, more than 280 million people have joined, and it connects with more than 40 apps and devices. Cronometer's database is smaller and built around lab-analyzed or verified entries.

Who should pick which

Pick Cronometer if you care about vitamins, minerals and verified entries, or want free barcode scanning. Pick MyFitnessPal if you want the largest food list and connections to other fitness apps. Apple Watch vs Fitbit and Oura Ring vs WHOOP cover tracking hardware.`;

const BUILT = buildEditorialComparison({
  slug: "cronometer-vs-myfitnesspal",
  title: "Cronometer vs MyFitnessPal: Nutrients, Plans",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "health",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Cronometer",
      shortDesc: "Nutrition tracker that says it tracks up to 95 nutrients and compounds, with free barcode scanning.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: ["Tracks up to 95 nutrients and compounds", "Barcode scanner in the free plan", "More than 1 million lab-analyzed or verified foods"],
      cons: ["Free plan reports cover a 7-day window", "Photo Log and Voice Log need Gold"],
      bestFor: "People tracking vitamins, minerals and other micronutrients",
    },
    {
      id: B,
      slug: B,
      name: "MyFitnessPal",
      shortDesc: "Calorie and macro tracker with 20.5 million foods and more than 40 connected apps and devices.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: ["20.5 million foods", "Works with more than 40 apps and devices", "Voice logging, meal scan and Meal Planner on paid tiers"],
      cons: ["Barcode scanner needs Premium", "Free plan has ads"],
      bestFor: "People logging calories and macros with other fitness apps",
    },
  ],
  keyDifferences: [
    { label: "Focus", entityAValue: "Up to 95 nutrients and compounds", entityBValue: "Calories and macros", winner: "tie" },
    { label: "Barcode scanner", entityAValue: "Free", entityBValue: "Premium", winner: "tie" },
    { label: "Food database", entityAValue: "1M+ lab-analyzed or verified foods", entityBValue: "20.5 million foods", winner: "tie" },
    { label: "Paid plan", entityAValue: "Gold: $10.99/month or $59.99/year, per Cronometer pricing page, Oct 2026", entityBValue: "Premium and Premium+; see vendor page for current price", winner: "tie" },
  ],
  attributes: [
    textAttr("nutrients", "Nutrients tracked", GROUP, A, B, "Up to 95 nutrients and compounds", "Calories and macros; custom goals in Premium"),
    textAttr("barcode", "Barcode scanner", GROUP, A, B, "Free in Basic", "Premium"),
    textAttr("database", "Food database", GROUP, A, B, "More than 1 million lab-analyzed or verified foods", "20.5 million foods"),
    textAttr("paid", "Paid tiers", GROUP, A, B, "Gold: $10.99/month or $59.99/year, per Cronometer pricing page, Oct 2026", "Premium and Premium+ (Meal Planner); see vendor page for current price"),
    textAttr("ai-logging", "Photo and voice logging", GROUP, A, B, "Photo Log and Voice Log in Gold", "Voice logging and meal scan in Premium"),
    textAttr("trial", "Free trial", GROUP, A, B, "Free Basic plan", "7-day Premium trial for first-time upgraders"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "apple-watch-vs-fitbit", title: "Apple Watch vs Fitbit", category: "technology" },
    { slug: "oura-ring-vs-whoop", title: "Oura Ring vs WHOOP", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Cronometer for detailed nutrient tracking and free barcode scanning; MyFitnessPal for the largest food database and app connections.",
    keyFact: "Cronometer tracks up to 95 nutrients and compounds; MyFitnessPal lists 20.5 million foods.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 16,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Cronometer: Home", url: CRONO_HOME },
      { name: "See vendor page for current price: Cronometer Gold", url: CRONO_GOLD },
      { name: "MyFitnessPal: Home", url: MFP_HOME },
      { name: "MyFitnessPal blog: Membership tiers", url: MFP_TIERS },
      { name: "See vendor page for current price: MyFitnessPal Premium", url: MFP_PREMIUM },
    ],
  },
  resources: [
    { type: "external", label: "Cronometer: Home", url: CRONO_HOME, description: "Track up to 95 nutrients and compounds; barcode scanning is free." },
    { type: "external", label: "See vendor page for current price: Cronometer Gold", url: CRONO_GOLD, description: "Gold $10.99/month or $59.99/year, per Cronometer pricing page, Oct 2026; Basic includes barcode scanner and 1M+ verified foods." },
    { type: "external", label: "MyFitnessPal: Home", url: MFP_HOME, description: "20.5 million foods, more than 280 million people joined, 40+ connected apps and devices." },
    { type: "external", label: "MyFitnessPal blog: Membership tiers", url: MFP_TIERS, description: "April 2025. Free, Premium and Premium+ features; Premium+ countries." },
    { type: "external", label: "See vendor page for current price: MyFitnessPal Premium", url: MFP_PREMIUM, description: "Premium plans, features and 7-day free trial for first-time upgraders." },
  ],
  metaTitle: "Cronometer vs MyFitnessPal | A Versus B",
});

BUILT.metadata.metaDescription =
  "Cronometer vs MyFitnessPal: 95 tracked nutrients and free barcode scanning against 20.5 million foods and 40+ app connections. Free and paid plans.";

export const CRONOMETER_VS_MYFITNESSPAL: EditorialComparison = BUILT;
