import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-139 — Apple Watch Series 12 vs Fitbit Air.
 * Specs checked on 3 October 2026 against Apple's Series 12 spec page,
 * the Google Store Fitbit Air page, the Google blog launch post, and
 * Google Health Help. Health names and limits were read again on
 * 3 October 2026 from the Series 12 spec page and the 7 May 2026
 * launch post. No page-level winner. No accuracy percentages.
 * /entity/apple-watch-series-12 and /entity/fitbit-air were both
 * noindex, nofollow, so neither hub is linked.
 */

const WATCH = "apple-watch-series-12";
const AIR = "fitbit-air";

const APPLE = "https://www.apple.com/apple-watch-series-12/specs/";
const STORE = "https://store.google.com/product/google_fitbit_air";
const FITBIT_SPECS = "https://store.google.com/product/google_fitbit_air_specs";
const BLOG = "https://blog.google/products-and-platforms/devices/fitbit/fitbit-air/";
const BATTERY = "https://support.google.com/googlehealth/answer/14226518?hl=en";
const CHARGE = "https://support.google.com/googlehealth/answer/14195042?hl=en";
const WATER = "https://support.google.com/googlehealth/answer/14236707?hl=en";
const SAFETY = "https://support.google.com/product-documentation/answer/17050752?hl=en";
const VITALS = "https://support.google.com/googlehealth/answer/14236917?hl=en";
const START = "https://support.google.com/googlehealth/answer/17033101?hl=en";
const HR = "https://support.google.com/googlehealth/answer/14237938?hl=en";
const REDDIT =
  "https://www.reddit.com/r/FitbitAir_India/comments/1wweka3/apple_watch_series_12_vs_fitbit_air_please_help/";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";

const SHORT_ANSWER =
  "Choose the Apple Watch Series 12 if you want a full smartwatch: apps, notifications, and an optional cellular model, on an iPhone. Apple rates it for up to 24 hours of normal use, up to 38 hours in Low Power Mode, and up to 10 hours of workout tracking, and lists an S11 chip. Choose the Fitbit Air if you want a lower-priced, screenless tracker for 24/7 heart rate and sleep. Google rates it for up to 7 days and the Google Store lists it from $99.99. Neither is better for everyone; it depends on whether you want a full smartwatch or a screenless tracker.";

const FAQS = [
  {
    question: "Is the Fitbit Air a Whoop alternative?",
    answer:
      "It is a different kind of product. Fitbit Air is hardware. The Google Store lists it from $99.99. The May 2026 launch post also included a three-month Google Health Premium trial that renews at $9.99 a month unless you cancel, and Google says some features require that membership. Whoop is a membership product. No Whoop price is stated. The asker had already decided Whoop felt like more than they needed. There is no live Apple Watch Series 12 versus Whoop comparison, so no link is included.",
  },
  {
    question: "Which is better for sleep, Apple Watch Series 12 or Fitbit Air?",
    answer:
      "Neither device is ranked as more accurate for sleep. Apple lists a Sleep app that includes sleep stages, a sleep score, and Sleep apnea notifications, on a watch rated for up to 24 hours of normal use. The same Health and Wellness list includes a Vitals app with heart rate, respiratory rate, wrist temperature, sleep duration, and heart rate variability. Apple says: \"The temperature sensing feature is not intended for medical use.\" Google lists sleep stages and sleep duration on the Fitbit Air. The 7 May 2026 launch-post footnotes also say \"Not intended for medical purposes.\" Google Health Help rates that tracker for up to 7 days. Google's vitals table marks the Air for skin temperature variation, SpO2, heart rate variability, breathing rate, and resting heart rate. The longer battery rating is the practical difference for wearing it through several nights. It is not an accuracy score.",
  },
  {
    question: "Do you need cellular on the Apple Watch Series 12?",
    answer:
      "No. Apple lists a GPS model and a GPS + Cellular model. Cellular is the option for calls and data when the iPhone is not with you. Gym tracking, sleep tracking, and notifications while the phone is nearby do not require it. The asker was leaning toward a 42mm cellular watch. That is a choice, not a requirement.",
  },
  {
    question: "Does the Fitbit Air work with an iPhone?",
    answer:
      "Yes, on the phones Google lists. Google says Fitbit Air works with most phones running Apple iOS 16.4 or higher, through the Google Health app, and that a Google Account is required. Google also says Android 11 or higher. Apple Watch Series 12 is the one tied to Apple's phones: Apple's compatibility line is iPhone 11 or later, including iPhone SE (2nd generation or later), with iOS 27 or later.",
  },
  {
    question: "Which is more comfortable for 24/7 wear?",
    answer:
      "Google lists Fitbit Air at 5.2 g without the band and 12 g with the band. Apple lists the 42mm aluminum GPS + Cellular Series 12 case at 31.5 g, without a band. Those are not like-for-like, and comfort is not scored.",
  },
  {
    question: "What about the Amazfit Helio?",
    answer:
      "The asker had also considered the Amazfit Helio before looking at the Series 12 and the Fitbit Air. Amazfit Helio specs are not included.",
  },
];

const VERDICT = `Best full smartwatch on an iPhone: Apple Watch Series 12. Apps, notifications, an optional cellular model, and an S11 chip. Apple rates normal use at up to 24 hours.

Best lower-priced screenless tracker: Fitbit Air. No screen, heart rate and sleep features Google lists, up to 7 days of battery, from $99.99 on the Google Store.

Neither is better for everyone; it depends on whether you want a full smartwatch or a screenless tracker.`;

const EXPERT_ANALYSIS = `Choose the Apple Watch Series 12 if you want a full smartwatch on an iPhone: apps, notifications, and an optional cellular model. Choose the Fitbit Air if you want a lower-priced, screenless tracker for 24/7 heart rate and sleep, with a week-class battery. Neither is better for everyone; it depends on whether you want a full smartwatch or a screenless tracker.

Source note: Apple lists the Series 12 chip, battery, sizes, weights, water resistance, the iPhone requirement, and the Health and Wellness names and footnotes. The Google Store and Google's 7 May 2026 launch post give the Fitbit Air price, the week-long battery line, the screenless design, the five-minute charge sentence, the rhythm footnote, and the "Not intended for medical purposes" line. Google lists Fitbit Air at 5.2 g without the band and 12 g with the band. Google Health Help and the Fitbit Air safety guide give the "up to 7 days" rating, the about-90-minute full charge, the 50-meter water rating, the vitals, and iPhone compatibility. No sleep-accuracy percentage is used.

What each one is

The Series 12 is a watch with an Always-On Retina display. Apple lists an S11 chip with a 64-bit dual-core processor, a 4-core Neural Engine, and 64GB of capacity. The Fitbit Air is screenless. Google's launch post calls it a discreet pebble, and the Google Health getting-started page calls it a lightweight, screenless tracker. There is no watch face for apps. You read the data in the Google Health app.

Battery

Apple rates the Series 12 for up to 24 hours of normal use, up to 38 hours in Low Power Mode, and up to 10 hours of workout tracking. Apple says those figures come from preproduction testing in July and August 2026, and that battery life varies. Google Health Help lists Google Fitbit Air at up to 7 days. The Google Store and the launch post say up to a week, or a week-long battery. Google's footnote says the maximum is approximate, based on 2025 preproduction testing with a median Fitbit Air usage profile, and that actual battery life may be lower.

Charging is not the same test. Apple says the Series 12 can reach up to 80 percent in about 30 minutes, that 15 minutes can give up to 12 hours of normal use, and that 5 minutes can give up to 10 hours of sleep tracking. Google says Fitbit Air charges from 0 to 100 percent in about 90 minutes. Google says fast charging gives a full day of power in five minutes. Those sentences are not one charge-time ranking.

Ecosystem: Watch on iPhone, Air in the Google Health app

Apple's compatibility line for Series 12 is iPhone 11 or later, including iPhone SE (2nd generation or later), with iOS 27 or later. The watch is where notifications, apps, and workouts show up. Cellular is optional: Apple sells GPS and GPS + Cellular models. Apple lists a 42mm aluminum GPS + Cellular case at 31.5 grams. The 42mm aluminum GPS case is 32.2 grams. Apple also lists 46mm cases and titanium and ceramic cases, with their own weights.

Fitbit Air does work with an iPhone, and it does not become an Apple Watch when it does. Google says it works with most phones on iOS 16.4 or higher, and on Android 11 or higher, through the Google Health app. A Google Account is required. Google says you check insights in the app and can stay notification-free. Google says daily metrics such as steps, distance, cardio load, calories burned, and sleep stages are in the app, and that the Air can recognize many activities on its own. Some features require a Google Health Premium membership. The launch post's trial renews at $9.99 a month after three months unless you cancel. The offer end date on that footnote is 26 May 2027.

Sleep and heart rate

Apple's Health and Wellness list includes a Sleep app including sleep stages, a sleep score, and Sleep apnea notifications. It also includes a Vitals app with heart rate, respiratory rate, wrist temperature, sleep duration, and heart rate variability, an ECG app, High and low heart rate notifications, Irregular rhythm notifications, a Blood Oxygen app, and Hypertension notifications.

Apple's footnotes there, next to those items, say: "The Vitals app is for wellness purposes only and not for medical use." "The Blood Oxygen app is for wellness purposes only and not for medical use." "The temperature sensing feature is not intended for medical use." "The ECG app is available on Apple Watch Series 4 and later (excluding Apple Watch SE models) and all Apple Watch Ultra models and can generate an ECG similar to a single-lead electrocardiogram. Intended for use by people 22 years old or older." "Irregular rhythm notifications are not intended for use by people under 22 years old or those who have been previously diagnosed with atrial fibrillation (AFib)." "Hypertension notifications are not intended for use by people under 22 years old, those who have been previously diagnosed with hypertension, or pregnant persons."

Google's launch post lists 24/7 heart rate, heart rhythm monitoring with Afib alerts, SpO2, resting heart rate, heart rate variability, and sleep stages and duration. The launch-post footnote next to that rhythm feature says: "Not intended for use by people under 22 years old with known atrial fibrillation or other known arrhythmias. Not available in all countries." The 7 May 2026 launch-post footnotes also say "Not intended for medical purposes." That line is quoted from the launch post. The heart-rate help article is the source only for the optical-sensor sentence below.

Google's vitals table marks the Air for breathing rate, heart rate variability, skin temperature variation, SpO2, and resting heart rate. Google says Fitbit devices use optical heart rate sensors, and Google lists Fitbit Air.

Water and weight

Apple rates Series 12 for 50 meters under ISO 22810:2010, for shallow water such as swimming or snorkeling to 6 meters, and not for scuba or high-velocity water sports. Apple says that resistance is not permanent. Google Health Help puts Google Fitbit Air in the group that is water-resistant to 50 meters. The Fitbit Air safety guide says the device is designed for IP68 and for 5 ATM under ISO 22810:2010 when it leaves the factory, and that this is not waterproof and is not permanent. A water-resistant coating mentioned on the Google Store is about a Special Edition band, not a second rating for the tracker.

Google lists Fitbit Air at 5.2 g without the band and 12 g with the band. Apple lists the 42mm aluminum GPS + Cellular Series 12 case at 31.5 g, without a band. Those are not like-for-like, and comfort is not scored. The battery-cell weights in the safety guide are the cell, not the tracker on a wrist. They are not used here.

Price

The Google Store lists Fitbit Air from $99.99. The launch post, dated 7 May 2026, said pre-order started at $99.99 and that a Special Edition was $129.99.

Who should buy which

Choose the Series 12 if you already use an iPhone and you want the watch to show apps and notifications, with cellular only if you want the watch to work away from the phone. The asker in r/FitbitAir_India was in that spot: an iPhone, AirPods, and a MacBook, plus gym and sleep tracking, and was leaning toward a 42mm cellular Series 12.

Choose the Fitbit Air if you want the screenless tracker, the week-class battery Google rates, and the lower hardware price, and you are fine reading the data in the Google Health app. It is the one to pick when a full watch is more device than you want on the wrist overnight.

The Amazfit Helio is only the other device the asker had considered. Helio specs are not included.`;

const SPEC = "Specs";

export const APPLE_WATCH_SERIES_12_VS_FITBIT_AIR: EditorialComparison = buildEditorialComparison({
  slug: "apple-watch-series-12-vs-fitbit-air",
  title: "Apple Watch Series 12 vs Fitbit Air: Which Should You Buy?",
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
      shortDesc:
        "Smartwatch with an S11 chip, an Always-On display, and up to 24 hours of normal use.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "S11 chip, Always-On Retina display, apps and notifications (Apple)",
        "GPS and optional GPS + Cellular models (Apple)",
        "Up to 24 hours normal use, 38 hours in Low Power Mode, 10 hours of workout tracking (Apple)",
        "Works with iPhone 11 or later on iOS 27 or later (Apple)",
      ],
      cons: [
        "Normal use is up to 24 hours, against up to 7 days on the Fitbit Air",
        "A watch on the wrist, not a screenless band",
      ],
      bestFor: "Best for a full smartwatch on an iPhone",
    },
    {
      id: AIR,
      slug: AIR,
      name: "Fitbit Air",
      shortDesc:
        "Screenless tracker with up to 7 days of battery, from $99.99, using the Google Health app.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Screenless, with sleep stages and 24/7 heart rate (Google)",
        "Up to 7 days of battery (Google Health Help)",
        "From $99.99 on the Google Store",
        "Works with iOS 16.4 or higher through the Google Health app (Google)",
      ],
      cons: [
        "No screen, so apps and notifications are not on the wrist",
        "Some features require Google Health Premium, which renews at $9.99 a month after the trial",
        "Not a cellular watch",
      ],
      bestFor: "Best for a lower-priced screenless sleep and heart-rate tracker",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Full smartwatch on an iPhone",
      entityBValue: "Screenless sleep and heart-rate tracker",
      winner: "tie",
    },
    {
      label: "Screen",
      entityAValue: "Always-On Retina display",
      entityBValue: "Screenless",
      winner: "tie",
    },
    {
      label: "Battery",
      entityAValue: "Up to 24 hours normal use",
      entityBValue: "Up to 7 days",
      winner: "b",
    },
    {
      label: "Phone",
      entityAValue: "iPhone 11 or later, iOS 27 or later",
      entityBValue: "iOS 16.4+ or Android 11+, Google Health app",
      winner: "tie",
    },
    {
      label: "Hardware price",
      entityAValue: "—",
      entityBValue: "From $99.99",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "kind",
      "What it is",
      SPEC,
      WATCH,
      AIR,
      "Smartwatch with an Always-On Retina display",
      "Screenless tracker. Data is in the Google Health app"
    ),
    textAttr(
      "chip",
      "Chip",
      SPEC,
      WATCH,
      AIR,
      "S11, 64-bit dual-core, 4-core Neural Engine, 64GB",
      "—"
    ),
    textAttr(
      "battery",
      "Battery",
      SPEC,
      WATCH,
      AIR,
      "Up to 24 hours normal use. Up to 38 hours in Low Power Mode. Up to 10 hours workout tracking",
      "Up to 7 days. Google also says up to a week",
      "b"
    ),
    textAttr(
      "charge",
      "Charging",
      SPEC,
      WATCH,
      AIR,
      "Up to 80% in about 30 minutes. 5 minutes for up to 10 hours of sleep tracking",
      "About 90 minutes from 0 to 100%. Launch post: a full day of power in five minutes"
    ),
    textAttr(
      "sleep",
      "Sleep features named",
      SPEC,
      WATCH,
      AIR,
      "Sleep app including sleep stages, a sleep score, and Sleep apnea notifications",
      "Sleep stages and duration"
    ),
    textAttr(
      "phone",
      "Phone requirement",
      SPEC,
      WATCH,
      AIR,
      "iPhone 11 or later, including iPhone SE (2nd generation or later), with iOS 27 or later",
      "iOS 16.4 or higher, or Android 11 or higher, via the Google Health app"
    ),
    textAttr(
      "water",
      "Water resistance",
      SPEC,
      WATCH,
      AIR,
      "50 meters under ISO 22810:2010. Shallow water. Not for scuba",
      "Water-resistant to 50 meters. Safety guide: IP68 and 5 ATM at the factory. Not permanent"
    ),
    textAttr(
      "weight",
      "Weight",
      SPEC,
      WATCH,
      AIR,
      "42mm aluminum GPS + Cellular case: 31.5 g. GPS case: 32.2 g",
      "5.2 g without the band. 12 g with the band"
    ),
    textAttr(
      "price",
      "Price",
      SPEC,
      WATCH,
      AIR,
      "—",
      "From $99.99 on the Google Store"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "apple-watch-vs-fitbit",
      title: "Apple Watch vs Fitbit",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Series 12 for a full smartwatch on an iPhone, including optional cellular. Fitbit Air for a lower-priced screenless tracker with up to 7 days of battery.",
    keyFact:
      "Apple rates Series 12 for up to 24 hours of normal use and lists an S11 chip. Google rates Fitbit Air for up to 7 days, calls it screenless, and the Google Store lists it from $99.99.",
  },
  citationStats: {
    sourceCount: 12,
    dataPointCount: 9,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      {
        name: "Apple — Apple Watch Series 12 specs, Health and Wellness footnotes",
        url: APPLE,
      },
      { name: "Google Store — Fitbit Air", url: STORE },
      { name: "Google Store — Fitbit Air specs", url: FITBIT_SPECS },
      {
        name: "Google blog — Fitbit Air launch, 7 May 2026, rhythm and medical-purpose footnotes",
        url: BLOG,
      },
      { name: "Google Health Help — Fitbit battery life", url: BATTERY },
      { name: "Google Health Help — charge your Fitbit device", url: CHARGE },
      { name: "Google Health Help — swim or shower", url: WATER },
      { name: "Google — Fitbit Air safety and regulatory guide", url: SAFETY },
      { name: "Google Health Help — vitals table", url: VITALS },
      { name: "Google Health Help — get started with Fitbit Air", url: START },
      { name: "Google Health Help — heart rate on Fitbit devices", url: HR },
      {
        name: "Reddit — r/FitbitAir_India, the asker's setup only",
        url: REDDIT,
      },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Apple Watch Series 12 specs",
      url: APPLE,
      description:
        "S11 chip, battery ratings, and the Health and Wellness list: ECG app, Irregular rhythm notifications, High and low heart rate notifications, Blood Oxygen app, Sleep apnea notifications, Hypertension notifications, with Apple's footnotes.",
    },
    {
      type: "external",
      label: "Google Store Fitbit Air",
      url: STORE,
      description:
        "From $99.99. Up to a week of battery. iOS 16.4 or newer and Android 11 or newer.",
    },
    {
      type: "external",
      label: "Google Store Fitbit Air specs",
      url: FITBIT_SPECS,
      description: "5.2 g without the band. 12 g with the band.",
    },
    {
      type: "external",
      label: "Google blog Fitbit Air launch",
      url: BLOG,
      description:
        "Published 2026-05-07. Screenless, week-long battery, from $99.99 at launch. Footnote: not for people under 22 with known atrial fibrillation or other known arrhythmias, and not available in all countries. Footnotes also say not intended for medical purposes.",
    },
    {
      type: "external",
      label: "Google Health Help battery table",
      url: BATTERY,
      description: "Google Fitbit Air: up to 7 days. Approximate, and actual life may be lower.",
    },
    {
      type: "external",
      label: "Google Health Help charging",
      url: CHARGE,
      description: "Fitbit Air charges from 0 to 100 percent in about 90 minutes.",
    },
    {
      type: "external",
      label: "Google Health Help water resistance",
      url: WATER,
      description: "Google Fitbit Air is in the group rated water-resistant to 50 meters.",
    },
    {
      type: "external",
      label: "Fitbit Air safety guide",
      url: SAFETY,
      description:
        "IP68 and 5 ATM at the factory. Not waterproof, and not a permanent condition.",
    },
    {
      type: "external",
      label: "Google Health Help vitals",
      url: VITALS,
      description:
        "Fitbit Air is marked for breathing rate, HRV, skin temperature variation, SpO2, and resting heart rate.",
    },
    {
      type: "external",
      label: "Get started with Fitbit Air",
      url: START,
      description:
        "Screenless tracker. Sleep stages and heart rate in the Google Health app.",
    },
    {
      type: "external",
      label: "Fitbit heart-rate help",
      url: HR,
      description:
        "Fitbit devices use optical heart rate sensors. The article lists Google Fitbit Air.",
    },
    {
      type: "external",
      label: "Reddit thread: Series 12 vs Fitbit Air",
      url: REDDIT,
      description:
        "The asker's setup only: iPhone, AirPods, MacBook, gym and sleep tracking. Not a spec source.",
    },
  ],
  metaTitle: "Apple Watch Series 12 vs Fitbit Air | A Versus B",
});
