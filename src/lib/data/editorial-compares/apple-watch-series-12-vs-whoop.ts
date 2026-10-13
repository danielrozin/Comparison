import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-135 — Apple Watch Series 12 vs WHOOP. Checked on 12 October 2026
 * against Apple's Series 12 spec page and newsroom post, and WHOOP's One,
 * Peak, Life and membership pages. "WHOOP Peak 5.0" from the brief is a
 * Peak membership on WHOOP 5.0 hardware. No winner, no accuracy figures.
 */

const WATCH = "apple-watch-series-12";
const WHOOP = "whoop";

const APPLE_SPECS = "https://www.apple.com/apple-watch-series-12/specs/";
const APPLE_NEWS =
  "https://www.apple.com/newsroom/2026/09/introducing-apple-watch-series-12-with-the-all-new-health-sensing-system/";
const WHOOP_MEMBERSHIP = "https://www.whoop.com/us/en/membership/";
const WHOOP_PEAK = "https://www.whoop.com/us/en/peak/";

const SOURCE_DATE = "2026-10-12";
const PUBLISHED = "2026-10-12T00:00:00Z";

const SHORT_ANSWER =
  "Choose Apple Watch Series 12 if you have an iPhone and want a full smartwatch with apps, notifications, and workout tracking on a screen. Apple rates it for up to 24 hours of normal use and up to 38 hours in Low Power Mode, and it starts at $399 (U.S.). Choose WHOOP if you want a band built around sleep, strain, and recovery that you charge about every two weeks. WHOOP lists 14+ days of battery, and its memberships run $199, $239, or $359 a year that come with the device. Neither is better for everyone; it depends on whether you want a watch or a recovery-first band.";

const FAQS = [
  {
    question: "Is WHOOP better than Apple Watch Series 12 for recovery tracking?",
    answer:
      "WHOOP is built around sleep, strain, and recovery scores, and every membership includes them. Apple Watch Series 12 adds a readiness experience with its new Health Sensing System, alongside apps, notifications, and a display. Choose WHOOP if recovery data is the main reason you want a wearable. Choose the Series 12 if you also want a watch.",
  },
  {
    question: "Which has longer battery life?",
    answer:
      "WHOOP, by a wide margin on each company's rating. WHOOP lists 14+ days of battery for both WHOOP 5.0 and WHOOP MG. Apple rates Apple Watch Series 12 for up to 24 hours of normal use, up to 38 hours in Low Power Mode, and up to 10 hours of workout tracking. Apple says the Series 12 reaches 80 percent in about 30 minutes on a fast charger.",
  },
  {
    question: "Does WHOOP require a subscription?",
    answer:
      "Yes. WHOOP sells a 12-month membership that includes the hardware. WHOOP One is $199 a year with WHOOP 5.0. WHOOP Peak is $239 a year with WHOOP 5.0 and a wireless PowerPack. WHOOP Life is $359 a year with WHOOP MG, which adds ECG readings and on-demand AFib detection. Apple Watch Series 12 is a one-time purchase that starts at $399 (U.S.).",
  },
  {
    question: "What is WHOOP Peak 5.0?",
    answer:
      "It is the Peak membership on WHOOP 5.0 hardware. Peak adds Healthspan, Pace of Aging, a Health Monitor with alerts, and a real-time Stress Monitor on top of WHOOP One, and costs $239 a year.",
  },
  {
    question: "Do I need an iPhone for Apple Watch Series 12?",
    answer:
      "Yes. Apple lists compatibility with iPhone 11 or later, including iPhone SE (2nd generation or later), running iOS 27 or later. If you use an Android phone, the Series 12 is not an option.",
  },
  {
    question: "Can I wear Apple Watch and WHOOP together?",
    answer:
      "You can, and some athletes do. For most people, pick the one that matches the main job: a smartwatch on the wrist, or a recovery band you rarely charge. Paying for both means the Series 12 price plus a yearly WHOOP membership.",
  },
];

const VERDICT = `Best if you want a full smartwatch on an iPhone: Apple Watch Series 12. S11 chip, apps and notifications, up to 24 hours of normal use. Starts at $399 (U.S.).

Best if you want recovery-first tracking with rare charging: WHOOP. Sleep, strain, and recovery scores, 14+ days of battery, from $199 a year with the device.

Neither is better for everyone; it depends on whether you want a watch or a recovery-first band.`;

const EXPERT_ANALYSIS = `Choose Apple Watch Series 12 if you have an iPhone and want a smartwatch that also tracks workouts and health. Choose WHOOP if sleep, strain, and recovery are the main reason you want a wearable and you want to charge it about every two weeks. Neither is better for everyone; it depends on whether you want a watch or a recovery-first band.

What each one is

Apple Watch Series 12 is a smartwatch with an S11 chip, an Always-On display, apps, notifications, and Siri. Apple adds a new Health Sensing System and a readiness experience that estimates your body's capacity for the day.

WHOOP is a wearable sold through a membership. Every plan includes sleep, strain, and recovery insights, personalized coaching, VO2 max, and heart rate zones. You read your data in the WHOOP app instead of on the band.

Battery and charging

Apple rates the Series 12 for up to 24 hours of normal use, up to 38 hours in Low Power Mode, and up to 10 hours of workout tracking. Apple says it charges to 80 percent in about 30 minutes, and that 5 minutes of charging gives up to 10 hours of sleep tracking. Plan on charging it daily.

WHOOP lists 14+ days of battery on WHOOP 5.0 and WHOOP MG. Peak and Life include a waterproof wireless PowerPack, so you can charge while you wear it. One includes a wired basic charger.

Cost

Apple says Apple Watch Series 12 starts at $399 (U.S.). That is a one-time purchase for the 42mm aluminum GPS model, and larger, cellular, titanium, and ceramic models cost more.

WHOOP sells 12-month memberships that come with the device. WHOOP One is $199 a year. WHOOP Peak is $239 a year and adds Healthspan, Pace of Aging, a Health Monitor with alerts, and a real-time Stress Monitor. WHOOP Life is $359 a year on WHOOP MG and adds blood pressure insights, ECG readings, and on-demand AFib detection. Over two years, WHOOP One costs about $398, which is close to the Series 12 starting price.

Phone

Apple Watch Series 12 needs an iPhone 11 or later, or iPhone SE (2nd generation or later), with iOS 27 or later. WHOOP works through its own app, so an Android user can choose it.

Who should buy which

Choose Apple Watch Series 12 if you want notifications, apps, Apple Pay, and workout data on your wrist, and you are fine charging every day.

Choose WHOOP if you mostly want sleep and recovery scores, you do not want a screen, and you would rather pay a yearly fee than buy a watch outright.`;

const SPEC = "Specs · Apple and WHOOP";

export const APPLE_WATCH_SERIES_12_VS_WHOOP: EditorialComparison = buildEditorialComparison({
  slug: "apple-watch-series-12-vs-whoop",
  title: "Apple Watch Series 12 vs WHOOP: Which Should You Buy?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: WATCH,
      slug: WATCH,
      name: "Apple Watch Series 12",
      shortDesc: "Smartwatch with an S11 chip, apps and notifications, up to 24 hours of normal use, from $399 (U.S.).",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Full smartwatch with apps, notifications, and Siri",
        "Readiness experience on the new Health Sensing System (Apple)",
        "One-time purchase, from $399 (U.S.)",
        "80 percent charge in about 30 minutes (Apple)",
      ],
      cons: [
        "Up to 24 hours of normal use, so plan on daily charging",
        "Needs an iPhone 11 or later with iOS 27",
        "Cellular, larger, titanium, and ceramic models cost more",
      ],
      bestFor: "Best for iPhone users who want a full smartwatch",
    },
    {
      id: WHOOP,
      slug: WHOOP,
      name: "WHOOP",
      shortDesc: "Membership wearable for sleep, strain, and recovery with 14+ days of battery, from $199 a year.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Sleep, strain, and recovery insights on every plan",
        "14+ days of battery (WHOOP)",
        "Device comes with a 12-month membership",
        "Life tier adds ECG readings and on-demand AFib detection",
      ],
      cons: [
        "Yearly fee: $199, $239, or $359",
        "No apps or notifications on the band",
        "Advanced health features need Peak or Life",
      ],
      bestFor: "Best for recovery-first tracking with rare charging",
    },
  ],
  keyDifferences: [
    { label: "Who it is for", entityAValue: "Full smartwatch on iPhone", entityBValue: "Recovery-first band", winner: "tie" },
    { label: "Battery", entityAValue: "Up to 24 hours normal use", entityBValue: "14+ days", winner: "b" },
    { label: "Cost model", entityAValue: "From $399 (U.S.), one-time", entityBValue: "$199 to $359 a year", winner: "tie" },
    { label: "Phone", entityAValue: "iPhone 11 or later", entityBValue: "WHOOP app", winner: "tie" },
  ],
  attributes: [
    textAttr("type", "Type", SPEC, WATCH, WHOOP, "Smartwatch with display", "Band with app-based data"),
    textAttr("battery", "Battery", SPEC, WATCH, WHOOP, "Up to 24 hours normal, 38 hours Low Power Mode", "14+ days", "b"),
    textAttr("workout", "Workout tracking", SPEC, WATCH, WHOOP, "Up to 10 hours", "Strain and heart rate zones"),
    textAttr("charging", "Charging", SPEC, WATCH, WHOOP, "80 percent in about 30 minutes", "Wired charger on One; wireless PowerPack on Peak and Life"),
    textAttr("price", "Price", "Price · Apple newsroom and WHOOP", WATCH, WHOOP, "From $399 (U.S.)", "$199, $239, or $359 a year"),
    textAttr("phone", "Phone", SPEC, WATCH, WHOOP, "iPhone 11 or later, iOS 27", "WHOOP app"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "apple-watch-series-12-vs-fitbit-air", title: "Apple Watch Series 12 vs Fitbit Air", category: "technology" },
    { slug: "apple-watch-vs-fitbit", title: "Apple Watch vs Fitbit", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Series 12 for a full smartwatch on an iPhone. WHOOP for recovery-first tracking with 14+ days of battery.",
    keyFact:
      "Apple rates Series 12 for up to 24 hours of normal use from $399 (U.S.). WHOOP lists 14+ days of battery on memberships from $199 a year.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 8,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple — Apple Watch Series 12 specs", url: APPLE_SPECS },
      { name: "Apple Newsroom — Series 12 starts at $399", url: APPLE_NEWS },
      { name: "WHOOP — membership plans", url: WHOOP_MEMBERSHIP },
      { name: "WHOOP — Peak membership", url: WHOOP_PEAK },
    ],
  },
  resources: [
    { type: "external", label: "Apple Watch Series 12 specs", url: APPLE_SPECS, description: "S11, up to 24 hours normal use, iPhone 11 or later." },
    { type: "external", label: "Apple Newsroom Series 12", url: APPLE_NEWS, description: "Starts at $399 (U.S.)." },
    { type: "external", label: "WHOOP memberships", url: WHOOP_MEMBERSHIP, description: "One $199, Peak $239, Life $359 a year." },
    { type: "external", label: "WHOOP Peak", url: WHOOP_PEAK, description: "WHOOP 5.0 with 14+ day battery, $239 a year." },
  ],
  metaTitle: "Apple Watch Series 12 vs WHOOP | A Versus B",
});
