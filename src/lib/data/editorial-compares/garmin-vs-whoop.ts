import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Garmin vs WHOOP. Compares Garmin's
 * screen-free CIRQA Smart Band (announced 21 July 2026) with WHOOP's
 * membership, the closest like-for-like products. Facts read 19 October 2026
 * from Garmin's CIRQA press release and WHOOP's U.S. membership options.
 * Garmin Connect+ pricing is left out. No winner.
 */

const A = "garmin";
const B = "whoop";

const GARMIN_PR =
  "https://www.garmin.com/en-US/newsroom/press-release/wearables-health/meet-cirqa-smart-band-the-screen-free-health-and-fitness-tracker-from-garmin/";
const GARMIN_PRODUCT = "https://www.garmin.com/en-US/p/1989182/";
const WHOOP_MEMBERSHIP = "https://www.whoop.com/us/en/membership/";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Screen-free fitness bands";

const CIRQA_PRICE = "$199.99 launch price (MSRP), per Garmin, July 2026";
const WHOOP_ONE = "$199/year, per WHOOP membership page, Oct 2026";
const WHOOP_PEAK = "$239/year, per WHOOP membership page, Oct 2026";
const WHOOP_LIFE = "$359/year, per WHOOP membership page, Oct 2026";

const SHORT_ANSWER = `Garmin's closest match to WHOOP is the CIRQA Smart Band, a screen-free band that Garmin says needs no subscription, lasts up to 10 days per charge and tracks heart rate, Body Battery, Pulse Ox, sleep, HRV and more than 80 activities, at ${CIRQA_PRICE}. WHOOP is a membership that includes the band: WHOOP One is ${WHOOP_ONE}, with Peak and Life tiers adding health monitoring, and WHOOP lists a 14+ day battery and a lifetime warranty while your membership is active. Neither is better for everyone.`;

const FAQS = [
  {
    question: "Does Garmin CIRQA or WHOOP need a subscription?",
    answer: `Garmin says CIRQA Smart Band needs no subscription; you buy the band once at ${CIRQA_PRICE}. WHOOP is sold as a membership that includes the device, with WHOOP One at ${WHOOP_ONE}.`,
  },
  {
    question: "How much do the WHOOP memberships cost?",
    answer: `WHOOP One is ${WHOOP_ONE}. WHOOP Peak is ${WHOOP_PEAK}, and WHOOP Life is ${WHOOP_LIFE}. WHOOP says all memberships are HSA/FSA eligible.`,
  },
  {
    question: "Which has longer battery life?",
    answer:
      "WHOOP lists 14+ days of battery life on every membership. Garmin says CIRQA Smart Band lasts up to 10 days.",
  },
  {
    question: "What health metrics do they track?",
    answer:
      "Garmin says CIRQA tracks wrist-based heart rate, Body Battery energy, Pulse Ox, stress, skin temperature, sleep stages and sleep score, and heart rate variability. WHOOP gives Recovery, Sleep and Strain scores on every tier, with Healthspan and a Health Monitor on Peak, and on-demand AFib detection on Life.",
  },
  {
    question: "Can they track workouts and GPS?",
    answer:
      "Garmin says CIRQA tracks more than 80 activities, uses your phone's GPS for outdoor walks, rides and runs, and supports LiveTrack location sharing. WHOOP syncs with Strava, bringing in GPS, distance and pace from Strava activities.",
  },
  {
    question: "What about warranty and returns?",
    answer:
      "WHOOP says devices bought directly from WHOOP carry a lifetime warranty while the membership is active, and you can cancel and return within 30 days for a refund minus shipping. For Garmin CIRQA warranty terms, see vendor page.",
  },
];

const VERDICT = `Best for no ongoing fees: Garmin CIRQA Smart Band, a one-time purchase at ${CIRQA_PRICE}.

Best for a longer battery and coaching inside a membership: WHOOP, with a 14+ day battery and WHOOP One at ${WHOOP_ONE}.

Both are screen-free bands that send data to a phone app.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Garmin CIRQA Smart Band: ${CIRQA_PRICE}, no subscription required.
- WHOOP One: ${WHOOP_ONE}; Peak ${WHOOP_PEAK}; Life ${WHOOP_LIFE}.
- Garmin says CIRQA lasts up to 10 days; WHOOP lists 14+ days.
- Garmin says CIRQA tracks more than 80 activities with connected GPS.
- WHOOP includes a lifetime warranty while your membership is active.

How you pay

Garmin sells CIRQA Smart Band as a one-time purchase and says no subscription is required. WHOOP sells memberships that include the device: One at ${WHOOP_ONE}, Peak at ${WHOOP_PEAK} and Life at ${WHOOP_LIFE}, and WHOOP says all are HSA/FSA eligible.

Health tracking

Garmin says CIRQA tracks heart rate, Body Battery, Pulse Ox, stress, skin temperature, sleep stages, sleep score, HRV and respiration, with data in the Garmin Connect app. WHOOP provides Recovery, Sleep and Strain scores, VO2 max and heart rate zones on every tier, plus Healthspan and a Health Monitor on Peak and on-demand AFib detection on Life.

Fitness

Garmin says CIRQA can track more than 80 activities, use a phone's GPS and share location with LiveTrack, plus training readiness, HRV status, VO2 max and training status. WHOOP syncs workouts both ways with Strava.

Battery, warranty and returns

Garmin quotes up to 10 days of battery for CIRQA. WHOOP lists 14+ days, a lifetime warranty for active members who bought directly from WHOOP, and a 30-day return window.

Who should pick which

Pick Garmin CIRQA to avoid a recurring fee, or if you already use Garmin Connect. Pick WHOOP for longer battery life and tiered health features within a membership. Apple Watch Series 12 vs WHOOP and Oura Ring vs WHOOP cover other options.`;

const BUILT = buildEditorialComparison({
  slug: "garmin-vs-whoop",
  title: "Garmin vs WHOOP: CIRQA Band vs Membership",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Garmin",
      shortDesc: "Garmin's CIRQA Smart Band is a screen-free health and fitness tracker with no subscription required.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: ["No subscription required", "More than 80 activities with connected GPS", "Body Battery, Pulse Ox, HRV and sleep score"],
      cons: ["Up to 10 days of battery", "GPS needs a paired phone"],
      bestFor: "People who want a screen-free tracker without a recurring fee",
    },
    {
      id: B,
      slug: B,
      name: "WHOOP",
      shortDesc: "Screen-free wearable sold as a membership that includes the device.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: ["14+ day battery", "Lifetime warranty with an active membership", "HSA/FSA eligible"],
      cons: ["Ongoing membership fee", "Health Monitor and AFib detection need higher tiers"],
      bestFor: "People who want recovery and strain coaching inside a membership",
    },
  ],
  keyDifferences: [
    { label: "Price model", entityAValue: `One-time: ${CIRQA_PRICE}`, entityBValue: `Membership: One ${WHOOP_ONE}`, winner: "tie" },
    { label: "Battery", entityAValue: "Up to 10 days", entityBValue: "14+ days", winner: "tie" },
    { label: "Activities", entityAValue: "More than 80, connected GPS", entityBValue: "Strava sync for GPS activities", winner: "tie" },
    { label: "Warranty", entityAValue: "See vendor page", entityBValue: "Lifetime with active membership", winner: "tie" },
  ],
  attributes: [
    textAttr("price", "Price", GROUP, A, B, CIRQA_PRICE, `One ${WHOOP_ONE}; Peak ${WHOOP_PEAK}; Life ${WHOOP_LIFE}`),
    textAttr("subscription", "Subscription", GROUP, A, B, "Not required", "Membership includes the device"),
    textAttr("battery", "Battery", GROUP, A, B, "Up to 10 days", "14+ days"),
    textAttr("health", "Health metrics", GROUP, A, B, "Heart rate, Body Battery, Pulse Ox, stress, skin temperature, HRV, sleep score", "Recovery, Sleep and Strain scores; Healthspan on Peak; AFib detection on Life"),
    textAttr("fitness", "Fitness", GROUP, A, B, "80+ activities, connected GPS, LiveTrack, VO2 max", "VO2 max and heart rate zones; Strava sync"),
    textAttr("returns", "Returns and warranty", GROUP, A, B, "See vendor page", "30-day return; lifetime warranty with active membership"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "apple-watch-series-12-vs-whoop", title: "Apple Watch Series 12 vs WHOOP", category: "technology" },
    { slug: "oura-ring-vs-whoop", title: "Oura Ring vs WHOOP", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Garmin CIRQA for a one-time purchase with no subscription; WHOOP for a longer battery and coaching within a membership.",
    keyFact: `Garmin CIRQA is ${CIRQA_PRICE}; WHOOP One is ${WHOOP_ONE}.`,
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 16,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Garmin Newsroom: CIRQA Smart Band", url: GARMIN_PR },
      { name: "See vendor page for current price: Garmin CIRQA Smart Band", url: GARMIN_PRODUCT },
      { name: "WHOOP: Membership options", url: WHOOP_MEMBERSHIP },
    ],
  },
  resources: [
    { type: "external", label: "Garmin Newsroom: CIRQA Smart Band", url: GARMIN_PR, description: "July 21, 2026. Screen-free, no subscription, up to 10 days battery, 80+ activities, $199.99 suggested retail price." },
    { type: "external", label: "See vendor page for current price: Garmin CIRQA Smart Band", url: GARMIN_PRODUCT, description: "CIRQA Smart Band product listing, colors and support." },
    { type: "external", label: "WHOOP: Membership options", url: WHOOP_MEMBERSHIP, description: "One, Peak and Life prices; 14+ day battery; lifetime warranty; 30-day returns; HSA/FSA." },
  ],
  metaTitle: "Garmin vs WHOOP: CIRQA Band vs Membership",
});

BUILT.metadata.metaDescription =
  "Garmin vs WHOOP: the screen-free Garmin CIRQA Smart Band with no subscription against WHOOP One, Peak and Life memberships. Price, battery, tracking.";

export const GARMIN_VS_WHOOP: EditorialComparison = BUILT;
