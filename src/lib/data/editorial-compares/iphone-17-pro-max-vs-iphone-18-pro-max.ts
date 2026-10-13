import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-134 — iPhone 17 Pro Max vs iPhone 18 Pro Max for an Android switcher.
 * Specs checked on 12 October 2026 against Apple's iPhone 18 Pro spec page,
 * Apple Support's iPhone 17 Pro Max tech specs (125091), Apple's newsroom
 * post, and Apple Support's Move from Android article (118670).
 * Apple no longer sells the 17 Pro Max, so it gets no price. The 1TB 18 Pro
 * Max price could not be mapped from the store page, so only Apple's
 * "starts at $1,299" is used. No winner. No benchmarks. No street prices.
 */

const MAX_17 = "iphone-17-pro-max";
const MAX_18 = "iphone-18-pro-max";

const APPLE_18 = "https://www.apple.com/iphone-18-pro/specs/";
const APPLE_17 = "https://support.apple.com/en-us/125091";
const NEWS_18 =
  "https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/";
const MOVE = "https://support.apple.com/en-us/118670";

const SOURCE_DATE = "2026-10-12";
const PUBLISHED = "2026-10-12T00:00:00Z";

const SHORT_ANSWER =
  "Choose the iPhone 18 Pro Max if you will keep the phone four years or more and want the longest battery rating and the newest chip. Apple rates it for up to 45 hours of video playback, against up to 39 hours on the iPhone 17 Pro Max, and it uses the A20 Pro chip. Choose the iPhone 17 Pro Max if you find one clearly cheaper at the 1TB size you want. It has the A19 Pro chip, the same 6.9-inch size class, and storage up to 2TB. Neither is better for everyone; it depends on how long you keep a phone and how big the price gap is.";

const FAQS = [
  {
    question: "Is the iPhone 18 Pro Max worth paying more than the 17 Pro Max?",
    answer:
      "It is if you keep phones four years or more and want the newer A20 Pro chip plus about 6 more hours of rated video playback. Apple says iPhone 18 Pro Max starts at $1,299 (U.S.). Apple no longer sells the iPhone 17 Pro Max, so its price depends on the carrier or retailer you buy from. If that offer at 1TB is a few hundred dollars lower, the 17 Pro Max is still a 6.9-inch Pro Max with a 48MP main camera and a 4x telephoto.",
  },
  {
    question: "Which has better battery life, iPhone 17 Pro Max or iPhone 18 Pro Max?",
    answer:
      "The iPhone 18 Pro Max, on Apple's ratings. Apple lists up to 45 hours of video playback, up to 40 hours streamed, and up to 30 hours of typical use. Apple Support lists the iPhone 17 Pro Max at up to 39 hours of video playback and up to 35 hours streamed. Apple says real-world results vary with use and settings.",
  },
  {
    question: "Which chip is in each Pro Max?",
    answer:
      "The iPhone 18 Pro Max uses the A20 Pro, with a 6-core CPU that has 2 super cores, a 7-core GPU, and a dual 16-core Neural Engine. The iPhone 17 Pro Max uses the A19 Pro, with a 6-core CPU and a 6-core GPU. Chip names are not a speed score.",
  },
  {
    question: "Do I need 2TB of storage?",
    answer:
      "Most people do not. Both phones come in 256GB, 512GB, 1TB, and 2TB. 1TB is plenty for a large photo library plus offline video. 2TB makes sense mainly if you shoot a lot of high-resolution video and keep it on the phone.",
  },
  {
    question: "Does the variable aperture on the 18 Pro Max matter?",
    answer:
      "Only if you care about camera control. The iPhone 18 Pro Max main camera has a variable aperture from f/1.48 to f/4.0. The iPhone 17 Pro Max main camera has a fixed f/1.78 aperture. Both have a 48MP main camera, a 4x telephoto, and an 18MP front camera. If the aperture is low on your list, decide on battery, price, and how long you will keep the phone.",
  },
  {
    question: "How do I move from Android to either iPhone?",
    answer:
      "Use Apple's Move to iOS app from Google Play, or the built-in transfer on a supported Android 17 device. During setup the iPhone shows a code, creates a temporary Wi-Fi network, and pulls contacts, message history, SMS messages, camera photos and videos, photo albums, and files. A USB-C cable between the two phones makes the transfer faster. It works the same on both models.",
  },
];

const VERDICT = `Best if you keep a phone four years or more: iPhone 18 Pro Max. A20 Pro, up to 45 hours of video playback, up to 30 hours of typical use. Starts at $1,299 (U.S.).

Best if you find it clearly cheaper at 1TB: iPhone 17 Pro Max. A19 Pro, up to 39 hours of video playback, 233 grams.

Neither is better for everyone; it depends on how long you keep a phone and how big the price gap is.`;

const EXPERT_ANALYSIS = `Choose the iPhone 18 Pro Max if you plan to keep the phone four years or more and want the longest battery rating and the newest chip. Choose the iPhone 17 Pro Max if a carrier or retailer offer at 1TB is clearly cheaper. Neither is better for everyone; it depends on how long you keep a phone and how big the price gap is.

Battery

Apple rates the iPhone 18 Pro Max for up to 45 hours of video playback, up to 40 hours of streamed video, and up to 30 hours of typical use. Apple Support rates the iPhone 17 Pro Max for up to 39 hours of video playback and up to 35 hours streamed. That is a 6-hour gap on video playback. For a four-year keep, battery capacity fades with age, so a higher starting rating gives more room later.

Chip

The iPhone 18 Pro Max uses the A20 Pro: a 6-core CPU with 2 super cores, a 7-core GPU, and a dual 16-core Neural Engine. The iPhone 17 Pro Max uses the A19 Pro: a 6-core CPU and a 6-core GPU. A newer chip generation usually means a longer runway of iOS updates, but Apple does not commit to a fixed number of years for either phone.

Cameras

Both have a 48MP main camera, a 48MP 4x telephoto, and an 18MP front camera. The difference is on the main lens. The iPhone 18 Pro Max has a variable aperture from f/1.48 to f/4.0. The iPhone 17 Pro Max has a fixed f/1.78 aperture. If camera settings are low on your list, this one should not decide it.

Body, storage, and charging

Both use a 6.9-inch Super Retina XDR display. The iPhone 18 Pro Max weighs 249 grams and measures 163.4 mm by 78.0 mm by 8.75 mm. The iPhone 17 Pro Max weighs 233 grams, so the newer one is 16 grams heavier. Both come in 256GB, 512GB, 1TB, and 2TB. Apple says the iPhone 18 Pro Max charges to 50 percent in about 15 minutes with a 60W adapter. Both use USB-C, so Android-era USB-C cables still work.

Price

Apple says iPhone 18 Pro Max starts at $1,299 (U.S.). Apple no longer sells the iPhone 17 Pro Max, so any price for it comes from a carrier or retailer. Compare both at the same 1TB size before deciding. A gap of a few hundred dollars is the main reason to take the 17 Pro Max.

Switching from Android

Apple's Move to iOS app, from Google Play, moves contacts, message history, SMS messages, camera photos and videos, photo albums, and files. A supported Android 17 device can transfer without the app. During setup the iPhone creates a temporary Wi-Fi network for the transfer, and a USB-C cable between the two phones makes it faster. Keep both phones on power until the iPhone's loading bar finishes. The process is the same for either model.

Who should buy which

Choose the iPhone 18 Pro Max if you will keep the phone four years or more and the battery rating and newer chip matter most.

Choose the iPhone 17 Pro Max if you can buy one at 1TB for clearly less and you are fine with the A19 Pro and a 39-hour video-playback rating.`;

const SPEC = "Specs · Apple";

export const IPHONE_17_PRO_MAX_VS_IPHONE_18_PRO_MAX: EditorialComparison = buildEditorialComparison({
  slug: "iphone-17-pro-max-vs-iphone-18-pro-max",
  title: "iPhone 17 Pro Max vs iPhone 18 Pro Max: Which Should You Buy?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: MAX_17,
      slug: MAX_17,
      name: "iPhone 17 Pro Max",
      shortDesc:
        "6.9-inch Pro Max with an A19 Pro chip, up to 39 hours of video playback, and storage up to 2TB.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Up to 39 hours of video playback (Apple Support)",
        "233 grams, 16 grams lighter than the 18 Pro Max",
        "48MP main camera and 4x telephoto",
        "Storage from 256GB to 2TB",
      ],
      cons: [
        "Up to 6 fewer hours of video playback than the 18 Pro Max",
        "Older A19 Pro chip with a 6-core GPU",
        "Fixed f/1.78 main aperture",
        "No longer sold by Apple, so the price depends on the seller",
      ],
      bestFor: "Best when a 1TB offer is clearly cheaper",
    },
    {
      id: MAX_18,
      slug: MAX_18,
      name: "iPhone 18 Pro Max",
      shortDesc:
        "6.9-inch Pro Max with an A20 Pro chip, up to 45 hours of video playback, and up to 30 hours of typical use.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Up to 45 hours of video playback and 30 hours of typical use (Apple)",
        "A20 Pro chip with a 7-core GPU",
        "Variable main aperture from f/1.48 to f/4.0",
        "50 percent charge in about 15 minutes with a 60W adapter (Apple)",
      ],
      cons: [
        "249 grams, the heavier of the two",
        "Starts at $1,299 (U.S.)",
        "Battery hours are Apple test ratings and results vary",
      ],
      bestFor: "Best for a four-year-plus keep",
    },
  ],
  keyDifferences: [
    { label: "Who it is for", entityAValue: "Clearly cheaper 1TB offer", entityBValue: "Four-year-plus keep", winner: "tie" },
    { label: "Chip", entityAValue: "A19 Pro, 6-core GPU", entityBValue: "A20 Pro, 7-core GPU", winner: "tie" },
    { label: "Video playback", entityAValue: "Up to 39 hours", entityBValue: "Up to 45 hours", winner: "b" },
    { label: "Weight", entityAValue: "233 g", entityBValue: "249 g", winner: "a" },
    { label: "Main aperture", entityAValue: "f/1.78", entityBValue: "f/1.48 to f/4.0", winner: "tie" },
  ],
  attributes: [
    textAttr("chip", "Chip", SPEC, MAX_17, MAX_18, "A19 Pro, 6-core CPU, 6-core GPU", "A20 Pro, 6-core CPU, 7-core GPU"),
    textAttr("playback", "Video playback", SPEC, MAX_17, MAX_18, "Up to 39 hours", "Up to 45 hours", "b"),
    textAttr("streamed", "Streamed video playback", SPEC, MAX_17, MAX_18, "Up to 35 hours", "Up to 40 hours", "b"),
    textAttr("display", "Display", SPEC, MAX_17, MAX_18, "6.9-inch Super Retina XDR", "6.9-inch Super Retina XDR"),
    textAttr("weight", "Weight", SPEC, MAX_17, MAX_18, "233 g", "249 g", "a"),
    textAttr("storage", "Storage", SPEC, MAX_17, MAX_18, "256GB, 512GB, 1TB, or 2TB", "256GB, 512GB, 1TB, or 2TB"),
    textAttr("main", "Main camera", SPEC, MAX_17, MAX_18, "48MP, f/1.78", "48MP, f/1.48 to f/4.0"),
    textAttr("tele", "Telephoto", SPEC, MAX_17, MAX_18, "4x, 100 mm", "48MP, 4x"),
    textAttr("price", "Apple price", "Price · Apple newsroom", MAX_17, MAX_18, "No longer sold by Apple", "Starts at $1,299 (U.S.)"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "iphone-17-pro-vs-iphone-18-pro", title: "iPhone 17 Pro vs iPhone 18 Pro", category: "technology" },
    { slug: "iphone-17-pro-vs-pro-max", title: "iPhone 17 Pro vs iPhone 17 Pro Max", category: "technology" },
    {
      slug: "iphone-17-pro-vs-samsung-galaxy-s25-ultra-vs-samsung-galaxy-s26-ultra",
      title: "iPhone 17 Pro vs Galaxy S25 Ultra vs Galaxy S26 Ultra",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "iPhone 18 Pro Max for a four-year-plus keep. iPhone 17 Pro Max when a 1TB offer is clearly cheaper.",
    keyFact:
      "Apple rates the iPhone 18 Pro Max for up to 45 hours of video playback with an A20 Pro chip. The iPhone 17 Pro Max is rated for up to 39 hours with an A19 Pro chip.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 9,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple — iPhone 18 Pro and Pro Max specs", url: APPLE_18 },
      { name: "Apple Support — iPhone 17 Pro Max tech specs", url: APPLE_17 },
      { name: "Apple Newsroom — iPhone 18 Pro Max starts at $1,299", url: NEWS_18 },
      { name: "Apple Support — Move from Android to iPhone", url: MOVE },
    ],
  },
  resources: [
    { type: "external", label: "Apple iPhone 18 Pro Max specs", url: APPLE_18, description: "A20 Pro, 6.9-inch, 249 g, up to 45 hours video playback." },
    { type: "external", label: "Apple Support iPhone 17 Pro Max specs", url: APPLE_17, description: "A19 Pro, 6.9-inch, 233 g, up to 39 hours video playback." },
    { type: "external", label: "Apple Newsroom iPhone 18 Pro Max", url: NEWS_18, description: "iPhone 18 Pro Max starts at $1,299 (U.S.)." },
    { type: "external", label: "Move from Android to iPhone", url: MOVE, description: "Move to iOS steps and what transfers." },
  ],
  metaTitle: "iPhone 17 Pro Max vs iPhone 18 Pro Max | A Versus B",
});
