import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-274: iPhone 18 Pro vs iPhone 18 Pro Max.
 * Apple only: apple.com/iphone-18-pro/specs, the Apple Newsroom launch post
 * (9 September 2026) and apple.com/iphone/compare. Facts read 19 October 2026.
 * Written fresh for this pair; no text reused from the 17-vs-18 pages.
 * Prices are dated launch MSRPs with a link to Apple's store. No winner.
 */

const PUBLISHED = "2026-10-19T00:00:00Z";
const SOURCE_DATE = "2026-10-19";

const PRO = "iphone-18-pro";
const MAX = "iphone-18-pro-max";

const SPECS = "https://www.apple.com/iphone-18-pro/specs/";
const NEWSROOM = "https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/";
const COMPARE = "https://www.apple.com/iphone/compare/";
const BUY = "https://www.apple.com/shop/buy-iphone/iphone-18-pro";

const PRICE_PRO = "$1,199 launch price (MSRP), per Apple Newsroom, September 2026";
const PRICE_MAX = "$1,299 launch price (MSRP), per Apple Newsroom, September 2026";

const SHORT_ANSWER = `Choose iPhone 18 Pro if you want the smaller, lighter phone: a 6.3-inch display, 211 g, and Apple rates it for up to 36 hours of video playback (${PRICE_PRO}). Choose iPhone 18 Pro Max if you want the 6.9-inch display and the longest battery life in the pair, up to 45 hours of video playback and 30 hours of typical use (${PRICE_MAX}). Apple gives both the same A20 Pro chip, the same three 48MP rear cameras with 4x and 8x telephoto, the same storage options and the same finishes, so size and battery are the real choice.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Same inside: A20 Pro, a 48MP Fusion Main camera with variable aperture, a 48MP Fusion Ultra Wide, a 48MP 4x Fusion Telephoto and an 18MP Center Stage front camera on both.
- Screen: 6.3 inches at 2622 x 1206 on the Pro, 6.9 inches at 2868 x 1320 on the Pro Max, both at 460 ppi with ProMotion up to 120Hz.
- Weight: 211 g against 249 g. Both are 8.75 mm thick.
- Battery: Apple rates the Pro at up to 24 hours of typical use and the Pro Max at up to 30 hours.
- Launch prices are $100 apart at 256GB: ${PRICE_PRO} for the Pro and ${PRICE_MAX} for the Pro Max.

Display

Both use an OLED display with ProMotion adaptive refresh up to 120Hz, a 2,000,000:1 typical contrast ratio, 1000 nits typical, 1600 nits HDR peak and 3000 nits outdoor peak brightness. iPhone 18 Pro has a 6.3-inch panel (6.27 inches measured as a rectangle) at 2622 x 1206; iPhone 18 Pro Max has a 6.9-inch panel (6.86 inches as a rectangle) at 2868 x 1320. Apple says the redesigned Dynamic Island on both can show up to three Live Activities at once.

Size and weight

iPhone 18 Pro measures 150.0 x 71.9 x 8.75 mm and weighs 211 g. iPhone 18 Pro Max measures 163.4 x 78.0 x 8.75 mm and weighs 249 g. Both have an aluminum unibody, Ceramic Shield 2 on the front, Ceramic Shield on the back, and an IP68 rating (up to 6 meters for up to 30 minutes).

Chip

Both run A20 Pro: a 6-core CPU with 2 super cores and 4 efficiency cores, a 7-core GPU with Neural Accelerators and a Dual 16-core Neural Engine. Apple says a next-generation vapor chamber gives up to 40 percent more sustained performance than the previous generation on both models.

Cameras

The camera systems are the same on both phones:

1. 48MP Fusion Main, 24 mm, with variable aperture from f/1.48 to f/4.0 and a 12MP optical-quality 2x option.
2. 48MP Fusion Ultra Wide, 13 mm, f/2.2.
3. 48MP Fusion Telephoto, 100 mm (4x), with a 12MP optical-quality 8x option at 200 mm.
4. 18MP Center Stage front camera with Face ID.

Battery and charging

Apple rates iPhone 18 Pro at up to 24 hours of typical use, 36 hours of video playback and 33 hours of streamed video. It rates iPhone 18 Pro Max at up to 30 hours of typical use, 45 hours of video playback and 40 hours of streamed video. Apple says these ratings are for eSIM-only models. Both charge to 50 percent in around 15 minutes with a 60W-capable adapter, or in 30 minutes with a 35W adapter and MagSafe Charger, and support MagSafe and Qi2 wireless charging up to 25W. Apple says five minutes of wired charging gives iPhone 18 Pro Max about 7 hours of video playback.

Storage, finishes and connectivity

Both come in 256GB, 512GB, 1TB and 2TB, in black, silver, glacier and burgundy. Both have the Apple C2 modem, the Apple N1 chip with Wi-Fi 7, USB-C with USB 3 (up to 10Gb/s), the Action button and Camera Control. U.S. models are eSIM-only.

Choose iPhone 18 Pro if

1. You want the smaller, lighter phone: 150.0 x 71.9 mm and 211 g.
2. You want the full Pro camera system at the lower launch price.
3. Up to 24 hours of typical use covers your day.

Choose iPhone 18 Pro Max if

1. You want the biggest screen for video, reading or games.
2. Battery life matters most: up to 30 hours of typical use and 45 hours of video playback.
3. The extra 38 g and larger footprint don't bother you.`;

const FAQS = [
  {
    question: "What is the difference between iPhone 18 Pro and iPhone 18 Pro Max?",
    answer:
      "Size, weight and battery life. The Pro has a 6.3-inch display and weighs 211 g; the Pro Max has a 6.9-inch display, weighs 249 g and is rated for longer battery life. Apple gives both the same A20 Pro chip and cameras.",
  },
  {
    question: "Do iPhone 18 Pro and iPhone 18 Pro Max have the same cameras?",
    answer:
      "Yes. Both have a 48MP Fusion Main camera with variable aperture, a 48MP Fusion Ultra Wide, a 48MP 4x Fusion Telephoto with an 8x optical-quality option, and an 18MP Center Stage front camera.",
  },
  {
    question: "How much longer does the iPhone 18 Pro Max battery last?",
    answer:
      "Apple rates the Pro Max at up to 30 hours of typical use and 45 hours of video playback, against up to 24 hours and 36 hours for the Pro. The ratings are for eSIM-only models.",
  },
  {
    question: "How much do iPhone 18 Pro and iPhone 18 Pro Max weigh?",
    answer: "iPhone 18 Pro weighs 211 g (7.44 oz) and iPhone 18 Pro Max weighs 249 g (8.78 oz). Both are 8.75 mm thick.",
  },
  {
    question: "Do both models have the same storage options?",
    answer: "Yes. Both come in 256GB, 512GB, 1TB and 2TB.",
  },
  {
    question: "How much did iPhone 18 Pro and iPhone 18 Pro Max cost at launch?",
    answer: `iPhone 18 Pro: ${PRICE_PRO}. iPhone 18 Pro Max: ${PRICE_MAX}. Both are 256GB U.S. starting prices.`,
  },
];

const BUILT = buildEditorialComparison({
  slug: "iphone-18-pro-vs-iphone-18-pro-max",
  title: "iPhone 18 Pro vs iPhone 18 Pro Max",
  shortAnswer: SHORT_ANSWER,
  verdict: `Choose iPhone 18 Pro if you want the 6.3-inch, 211 g phone with the full Pro camera system; ${PRICE_PRO}.\n\nChoose iPhone 18 Pro Max if you want the 6.9-inch display and the longest battery life, up to 30 hours of typical use; ${PRICE_MAX}.`,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: PRO,
      slug: PRO,
      name: "iPhone 18 Pro",
      shortDesc: "6.3-inch ProMotion display, A20 Pro, three 48MP rear cameras, 211 g.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Smaller and lighter at 211 g",
        "Same A20 Pro chip and camera system as the Pro Max",
        PRICE_PRO,
      ],
      cons: ["Up to 24 hours of typical use, against 30 on the Pro Max", "Smaller 6.3-inch display"],
      bestFor: "Buyers who want the Pro cameras in the smaller, lighter size",
    },
    {
      id: MAX,
      slug: MAX,
      name: "iPhone 18 Pro Max",
      shortDesc: "6.9-inch ProMotion display, A20 Pro, three 48MP rear cameras, up to 30 hours typical use.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "6.9-inch display at 2868 x 1320",
        "Up to 30 hours of typical use and 45 hours of video playback",
        "Same A20 Pro chip and camera system as the Pro",
      ],
      cons: ["Heavier at 249 g", PRICE_MAX],
      bestFor: "Buyers who want the largest screen and the longest battery life",
    },
  ],
  keyDifferences: [
    { label: "Display", entityAValue: "6.3-inch, 2622 x 1206", entityBValue: "6.9-inch, 2868 x 1320", winner: "tie" },
    { label: "Weight", entityAValue: "211 g", entityBValue: "249 g", winner: "tie" },
    { label: "Typical use (Apple rating)", entityAValue: "Up to 24 hours", entityBValue: "Up to 30 hours", winner: "tie" },
    { label: "Video playback (Apple rating)", entityAValue: "Up to 36 hours", entityBValue: "Up to 45 hours", winner: "tie" },
    { label: "Launch price (MSRP)", entityAValue: PRICE_PRO, entityBValue: PRICE_MAX, winner: "tie" },
  ],
  attributes: [
    textAttr("a0", "Display", "Display", PRO, MAX, "6.3-inch OLED, 2622 x 1206 at 460 ppi, ProMotion up to 120Hz", "6.9-inch OLED, 2868 x 1320 at 460 ppi, ProMotion up to 120Hz"),
    textAttr("a1", "Brightness", "Display", PRO, MAX, "1000 nits typical, 1600 nits HDR, 3000 nits outdoor", "1000 nits typical, 1600 nits HDR, 3000 nits outdoor"),
    textAttr("a2", "Size", "Design", PRO, MAX, "150.0 x 71.9 x 8.75 mm", "163.4 x 78.0 x 8.75 mm"),
    textAttr("a3", "Weight", "Design", PRO, MAX, "211 g (7.44 oz)", "249 g (8.78 oz)"),
    textAttr("a4", "Build", "Design", PRO, MAX, "Aluminum unibody, Ceramic Shield 2 front, Ceramic Shield back, IP68", "Aluminum unibody, Ceramic Shield 2 front, Ceramic Shield back, IP68"),
    textAttr("a5", "Chip", "Performance", PRO, MAX, "A20 Pro: 6-core CPU, 7-core GPU, Dual 16-core Neural Engine", "A20 Pro: 6-core CPU, 7-core GPU, Dual 16-core Neural Engine"),
    textAttr("a6", "Rear cameras", "Camera", PRO, MAX, "48MP Main (variable aperture), 48MP Ultra Wide, 48MP 4x Telephoto (8x optical-quality)", "48MP Main (variable aperture), 48MP Ultra Wide, 48MP 4x Telephoto (8x optical-quality)"),
    textAttr("a7", "Front camera", "Camera", PRO, MAX, "18MP Center Stage, Face ID", "18MP Center Stage, Face ID"),
    textAttr("a8", "Typical use", "Battery", PRO, MAX, "Up to 24 hours", "Up to 30 hours"),
    textAttr("a9", "Video playback", "Battery", PRO, MAX, "Up to 36 hours (33 streamed)", "Up to 45 hours (40 streamed)"),
    textAttr("a10", "Charging", "Battery", PRO, MAX, "50% in about 15 min (60W wired); MagSafe and Qi2 up to 25W", "50% in about 15 min (60W wired); MagSafe and Qi2 up to 25W"),
    textAttr("a11", "Storage", "Performance", PRO, MAX, "256GB, 512GB, 1TB, 2TB", "256GB, 512GB, 1TB, 2TB"),
    textAttr("a12", "Finishes", "Design", PRO, MAX, "Black, silver, glacier, burgundy", "Black, silver, glacier, burgundy"),
    textAttr("a13", "Launch price (MSRP, US, 256GB)", "Price", PRO, MAX, PRICE_PRO, PRICE_MAX),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "iphone-17-pro-vs-iphone-18-pro", title: "iPhone 17 Pro vs iPhone 18 Pro", category: "technology" },
    { slug: "iphone-17-pro-max-vs-iphone-18-pro-max", title: "iPhone 17 Pro Max vs iPhone 18 Pro Max", category: "technology" },
    { slug: "iphone-17-pro-vs-pro-max", title: "iPhone 17 Pro vs iPhone 17 Pro Max", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Choose iPhone 18 Pro for the smaller, lighter phone with the same chip and cameras. Choose iPhone 18 Pro Max for the 6.9-inch display and the longest battery life.",
    keyFact: `Same A20 Pro and cameras. Pro: 6.3-inch, 211 g, up to 24 hours typical use, ${PRICE_PRO}. Pro Max: 6.9-inch, 249 g, up to 30 hours, ${PRICE_MAX}.`,
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 40,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple: iPhone 18 Pro and iPhone 18 Pro Max tech specs", url: SPECS },
      { name: "Apple Newsroom: Apple debuts iPhone 18 Pro and iPhone 18 Pro Max", url: NEWSROOM },
      { name: "Apple: Compare iPhone models", url: COMPARE },
      { name: "Apple Store: Buy iPhone 18 Pro", url: BUY },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Apple: iPhone 18 Pro and iPhone 18 Pro Max tech specs",
      url: SPECS,
      description:
        "Displays, dimensions, weights, A20 Pro, cameras, battery ratings, charging, storage, finishes and connectivity for both models.",
    },
    {
      type: "external",
      label: "Apple Newsroom: Apple debuts iPhone 18 Pro and iPhone 18 Pro Max",
      url: NEWSROOM,
      description:
        "9 September 2026. U.S. launch prices for 256GB, pre-orders from 12 September and availability from 18 September 2026.",
    },
    {
      type: "external",
      label: "Apple: Compare iPhone models",
      url: COMPARE,
      description: "Apple's side-by-side comparison of current iPhone models.",
    },
    {
      type: "external",
      label: "See vendor page for current price: iPhone 18 Pro and iPhone 18 Pro Max (Apple Store)",
      url: BUY,
      description: "Apple Store page for iPhone 18 Pro and iPhone 18 Pro Max with current U.S. prices.",
    },
  ],
  metaTitle: "iPhone 18 Pro vs iPhone 18 Pro Max | A Versus B",
});

BUILT.metadata.metaDescription =
  "iPhone 18 Pro vs iPhone 18 Pro Max from Apple's specs: 6.3 vs 6.9-inch display, 211 vs 249 g, battery life, same A20 Pro and cameras, launch prices.";

export const IPHONE_18_PRO_VS_IPHONE_18_PRO_MAX: EditorialComparison = BUILT;
