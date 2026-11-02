import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-360 — iPhone Air vs iPhone 18 Pro for a multi-year keep.
 * Opened 2 November 2026 (Asia/Jerusalem):
 * apple.com/iphone-air/specs, apple.com/iphone-18-pro/specs,
 * both newsroom posts, support.apple.com/en-us/101575,
 * apple.com/iphone/compare, and the U.S. Apple Store buy pages.
 * Reddit threads returned HTTP 403, so no community-opinion block.
 * The 1,000-cycle line on the battery article names iPhone 15 models
 * only, so it is not stated for either phone. No winner.
 */

const PUBLISHED = "2026-11-02T00:00:00Z";
const SOURCE_DATE = "2026-11-02";

const AIR = "iphone-air";
const PRO = "iphone-18-pro";

const AIR_SPECS = "https://www.apple.com/iphone-air/specs/";
const PRO_SPECS = "https://www.apple.com/iphone-18-pro/specs/";
const NEWS_PRO =
  "https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/";
const NEWS_AIR =
  "https://www.apple.com/newsroom/2025/09/introducing-iphone-air-a-powerful-new-iphone-with-a-breakthrough-design/";
const BATTERY = "https://support.apple.com/en-us/101575";
const COMPARE = "https://www.apple.com/iphone/compare/";
const BUY_AIR = "https://www.apple.com/shop/buy-iphone/iphone-air";
const BUY_PRO = "https://www.apple.com/shop/buy-iphone/iphone-18-pro";

const PRICE_AIR = "$1,099 for every 256GB finish";
const PRICE_PRO = "$1,199 for every 256GB finish";
const PRICE_NOTE =
  "U.S. Apple Store full price on 2 November 2026, before tax and trade-in";

const SHORT_ANSWER = `Choose the iPhone 18 Pro if you keep a phone for years and want the newer chip, three rear cameras, and the higher video-playback rating Apple lists. Apple rates it for up to 36 hours of video playback, with an A20 Pro chip, and up to 50 percent charge in around 15 minutes with a 60W-capable adapter. Choose the iPhone Air if weight and thinness matter most and you are a light user: Apple lists 165 grams and 5.64 mm, against 211 grams and 8.75 mm, with an A19 Pro chip and up to 27 hours of video playback. On 2 November 2026 the U.S. Apple Store listed ${PRICE_AIR} on the iPhone Air and ${PRICE_PRO} on the iPhone 18 Pro, before tax and trade-in. Neither phone is right for everyone.`;

const EXPERT_ANALYSIS = `Choose the iPhone 18 Pro if you keep a phone for years and want the newer chip, three rear cameras, and the higher video-playback rating Apple lists. Choose the iPhone Air if the thin, light body is the reason and you are a light user. Neither phone is right for everyone.

Key takeaways. Apple lists the iPhone Air at 165 grams and 5.64 mm, with an A19 Pro chip and up to 27 hours of video playback. Apple lists the iPhone 18 Pro at 211 grams and 8.75 mm, with an A20 Pro chip and up to 36 hours of video playback. On 2 November 2026 the U.S. Apple Store listed ${PRICE_AIR} on the iPhone Air and ${PRICE_PRO} on the iPhone 18 Pro, before tax and trade-in.

Size and weight. The iPhone Air is 156.2 mm tall, 74.7 mm wide, and 5.64 mm thick, at 165 grams, in titanium. The iPhone 18 Pro is 150.0 mm tall, 71.9 mm wide, and 8.75 mm thick, at 211 grams, in an aluminum unibody. The Air is the lighter, thinner phone. The iPhone 18 Pro is shorter and narrower. Apple's two weights differ by 46 grams. Apple's two thicknesses differ by 3.11 mm.

Display and water resistance. The Air has a 6.5-inch OLED display at 2736 by 1260 pixels and 460 ppi. Measured as a rectangle, Apple lists 6.55 inches. The iPhone 18 Pro has a 6.3-inch OLED display at 2622 by 1206 pixels and 460 ppi. Measured as a rectangle, Apple lists 6.27 inches. Both use ProMotion up to 120Hz, Ceramic Shield 2 on the front, Ceramic Shield on the back, and an IP68 rating (maximum depth of 6 meters for up to 30 minutes). Apple does not give a drop-test score for either phone. A case is the practical step if you drop a phone often.

Chip. The iPhone Air uses an A19 Pro: a 6-core CPU with 2 performance cores and 4 efficiency cores, and a 5-core GPU. The iPhone 18 Pro uses an A20 Pro: a 6-core CPU with 2 super cores and 4 efficiency cores, and a 7-core GPU. Apple's 9 September 2026 newsroom post says the iPhone 18 Pro pairs the A20 Pro with a vapor chamber for sustained performance. The two chips are not the same part.

Battery hours. Apple rates iPhone Air video playback at up to 27 hours and streamed video at up to 22 hours. With the iPhone Air MagSafe Battery, sold separately, Apple rates video playback at up to 40 hours and streamed video at up to 35 hours. Apple rates iPhone 18 Pro typical use at up to 24 hours, video playback at up to 36 hours, and streamed video at up to 33 hours. Apple's iPhone Air specs do not list a typical-use hour. Apple's 9 September 2026 newsroom post says the 36-hour video figure is for eSIM-only models. The U.S. Apple Store says iPhone Air and iPhone 18 Pro models purchased in the U.S. or Puerto Rico do not have a physical SIM tray.

How Apple measured the hours. Apple says iPhone Air battery claims depend on network configuration and many other factors, and that actual results will vary. Apple also says the Air battery has limited recharge cycles and may eventually need to be replaced. Apple says iPhone 18 Pro battery life varies by use, configuration, cellular network, signal strength, and other factors. The 18 Pro video test used preproduction units in July 2026. The 18 Pro typical-use test used preproduction units in August 2026.

Charging. The iPhone Air reaches up to 50 percent in 30 minutes with a 20W adapter or higher and a USB-C cable, or with a 30W adapter or higher and a MagSafe Charger. The iPhone 18 Pro reaches up to 50 percent in around 15 minutes with a 60W-capable adapter or higher that has Adjustable Voltage Supply, or in 30 minutes with a 35W adapter or higher and a MagSafe Charger. Apple says charge time varies. MagSafe and Qi2 wireless charging go up to 20W on the Air and up to 25W on the iPhone 18 Pro.

Years of use. Apple says rechargeable batteries are consumables with a limited lifespan, and that chemical aging reduces the charge they can hold. A higher video-playback rating means more rated hours at the start. It is not a measured hour count after five years. Both phones list iOS 27 in the box. Apple does not give an end date for iOS updates on either phone. A newer chip is not a count of future iOS versions.

Heat. Apple says to avoid charging or leaving an iPhone in a hot environment, including direct sun, for an extended period. Apple does not give a temperature cutoff, or an hour loss, for the iPhone Air or the iPhone 18 Pro.

Cameras. The iPhone Air has one 48MP Fusion rear camera at 26 mm and f/1.6. That camera also enables a 12MP optical-quality 2x view at 52 mm. That 2x view is a crop of the main camera, not a second lens. The front camera is an 18MP Center Stage camera. The iPhone 18 Pro has a 48MP Fusion Main camera with variable aperture from f/1.48 to f/4.0 at 24 mm, a 48MP Fusion Ultra Wide at 13 mm, and a 48MP Fusion Telephoto at 100 mm (4x), with a 12MP optical-quality 8x option at 200 mm. Its front camera is also an 18MP Center Stage camera. A straight-on photo uses the main camera on either phone. A wide shot or a distant shot uses the extra lenses on the iPhone 18 Pro.

Price and a carrier agreement. On 2 November 2026 the U.S. Apple Store listed ${PRICE_AIR} on the iPhone Air and ${PRICE_PRO} on the iPhone 18 Pro, before tax and trade-in. The model cards said From $1,099 and From $1,199. Apple's 9 September 2025 newsroom post listed an iPhone Air launch price of $999 (U.S.). That launch figure is not the 2 November 2026 store price. A monthly carrier payment is not the price of the phone. Multiply the phone payment by the number of months, then compare that total with the store price after the trade-in credit you are actually offered. See vendor page for current price.

Who should choose which. Choose the iPhone Air if you want the 165 gram, 5.64 mm phone and a light day fits the 27-hour video rating. Choose the iPhone 18 Pro if you keep a phone for years, want the A20 Pro and the 36-hour video rating, or want an ultra wide and a telephoto. If you drop a phone often, both are IP68 and a case still matters. For wide and distant photos, the iPhone 18 Pro is the one with the extra lenses.

Neighboring pairs are iPhone 17 versus iPhone Air, iPhone 17 Pro versus iPhone 18 Pro, and iPhone 18 Pro versus iPhone 18 Pro Max. The iPhone Air hub and the iPhone Air alternatives list sit beside those pairs.`;

const FAQS = [
  {
    question: "Is the iPhone Air or iPhone 18 Pro better for long-term use?",
    answer:
      "The iPhone 18 Pro is usually the stronger long-term choice because it has the newer A20 Pro chip and a higher video-playback rating, so it starts with more rated hours as the battery ages. Apple rates video playback at up to 36 hours on the iPhone 18 Pro and up to 27 hours on the iPhone Air. The Air can still suit a light user who wants the thinner phone. Apple does not give an end date for iOS updates on either phone.",
  },
  {
    question: "Is the iPhone Air battery life bad?",
    answer:
      "Apple rates the iPhone Air at up to 27 hours of video playback and up to 22 hours of streamed video, versus up to 36 hours and up to 33 hours on the iPhone 18 Pro. Apple says actual results vary. With the iPhone Air MagSafe Battery, sold separately, Apple rates video playback at up to 40 hours. The 27-hour rating can cover a light day. Apple says to avoid charging or leaving an iPhone in a hot environment, including direct sun, for an extended period.",
  },
  {
    question: "Does the iPhone Air have the same chip as the iPhone 18 Pro?",
    answer:
      "No. The iPhone Air uses the A19 Pro chip with a 6-core CPU and a 5-core GPU. The iPhone 18 Pro uses the A20 Pro chip with a 6-core CPU and a 7-core GPU.",
  },
  {
    question: "How much lighter is the iPhone Air than the iPhone 18 Pro?",
    answer:
      "Apple lists the iPhone Air at 165 grams and 5.64 mm thick, and the iPhone 18 Pro at 211 grams and 8.75 mm thick. Those weights differ by 46 grams. Those thicknesses differ by 3.11 mm. The Air is 156.2 mm tall and 74.7 mm wide. The iPhone 18 Pro is 150.0 mm tall and 71.9 mm wide.",
  },
  {
    question: "Is the iPhone Air camera good enough for everyday photos?",
    answer:
      "Apple lists one 48MP Fusion rear camera on the iPhone Air, at 26 mm, plus an 18MP Center Stage front camera. The 2x view is a 12MP crop of that main camera, not a second lens. The iPhone 18 Pro adds a 48MP ultra wide and a 48MP 4x telephoto with an 8x optical-quality option. A straight-on photo can use the Air's main camera. The Air does not have the ultra wide or telephoto lenses.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "iphone-air-vs-iphone-18-pro",
  title: "iPhone Air vs iPhone 18 Pro",
  shortAnswer: SHORT_ANSWER,
  verdict: `Choose the iPhone 18 Pro if you expect to keep the phone for years. It has the A20 Pro chip, three rear cameras, up to 36 hours of video playback, and a faster path to 50 percent on a 60W-capable adapter.\n\nChoose the iPhone Air if the 165 gram, 5.64 mm body is the reason, and a light day fits Apple's 27-hour video-playback rating. On 2 November 2026 the U.S. Apple Store listed ${PRICE_AIR} on the Air and ${PRICE_PRO} on the iPhone 18 Pro, before tax and trade-in.\n\nNeither phone is right for everyone.`,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: AIR,
      slug: AIR,
      name: "iPhone Air",
      shortDesc: "6.5-inch titanium iPhone, 165 g and 5.64 mm, A19 Pro, one 48MP rear camera.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "165 grams and 5.64 mm, titanium (Apple)",
        "6.5-inch display (Apple)",
        "Up to 40 hours of video playback with the MagSafe Battery, sold separately (Apple)",
      ],
      cons: [
        "One rear camera. No ultra wide and no telephoto lens (Apple)",
        "Up to 27 hours of video playback, against up to 36 hours on the iPhone 18 Pro",
        "Up to 50 percent in 30 minutes, against around 15 minutes on the iPhone 18 Pro with a 60W-capable adapter",
      ],
      bestFor: "A light user who wants the thinner, lighter phone",
    },
    {
      id: PRO,
      slug: PRO,
      name: "iPhone 18 Pro",
      shortDesc: "6.3-inch aluminum iPhone, 211 g, A20 Pro, three 48MP rear cameras, up to 36 hours of video playback.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "A20 Pro chip with a 7-core GPU (Apple)",
        "Up to 36 hours of video playback and up to 24 hours of typical use (Apple)",
        "48MP main, ultra wide, and 4x telephoto cameras (Apple)",
      ],
      cons: [
        "211 grams and 8.75 mm, against 165 grams and 5.64 mm on the Air",
        `${PRICE_PRO}, ${PRICE_NOTE}`,
      ],
      bestFor: "Someone who keeps a phone for years and wants the newer chip and extra lenses",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Light user who wants the thin body",
      entityBValue: "Multi-year keep of the newer chip",
      winner: "tie",
    },
    {
      label: "Weight",
      entityAValue: "165 g",
      entityBValue: "211 g",
      winner: "tie",
    },
    {
      label: "Thickness",
      entityAValue: "5.64 mm",
      entityBValue: "8.75 mm",
      winner: "tie",
    },
    {
      label: "Video playback",
      entityAValue: "Up to 27 hours",
      entityBValue: "Up to 36 hours",
      winner: "tie",
    },
    {
      label: "Rear cameras",
      entityAValue: "One 48MP camera",
      entityBValue: "Main, ultra wide, and 4x telephoto",
      winner: "tie",
    },
    {
      label: "256GB U.S. price, 2 Nov 2026",
      entityAValue: PRICE_AIR,
      entityBValue: PRICE_PRO,
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("display", "Display", "Display", AIR, PRO, "6.5-inch OLED, 2736 by 1260 at 460 ppi, ProMotion up to 120Hz", "6.3-inch OLED, 2622 by 1206 at 460 ppi, ProMotion up to 120Hz"),
    textAttr("size", "Size", "Design", AIR, PRO, "156.2 x 74.7 x 5.64 mm", "150.0 x 71.9 x 8.75 mm"),
    textAttr("weight", "Weight", "Design", AIR, PRO, "165 g (5.82 oz)", "211 g (7.44 oz)"),
    textAttr("build", "Build", "Design", AIR, PRO, "Titanium, Ceramic Shield 2 front, Ceramic Shield back", "Aluminum unibody, Ceramic Shield 2 front, Ceramic Shield back"),
    textAttr("water", "Water resistance", "Design", AIR, PRO, "IP68, 6 meters for up to 30 minutes", "IP68, 6 meters for up to 30 minutes"),
    textAttr("chip", "Chip", "Performance", AIR, PRO, "A19 Pro: 6-core CPU, 5-core GPU", "A20 Pro: 6-core CPU, 7-core GPU"),
    textAttr("rear", "Rear cameras", "Camera", AIR, PRO, "48MP Fusion Main, 26 mm, f/1.6. 12MP 2x crop at 52 mm", "48MP Main, variable aperture; 48MP Ultra Wide; 48MP 4x Telephoto with 8x"),
    textAttr("front", "Front camera", "Camera", AIR, PRO, "18MP Center Stage", "18MP Center Stage"),
    textAttr("video", "Video playback", "Battery", AIR, PRO, "Up to 27 hours. Up to 40 hours with MagSafe Battery", "Up to 36 hours"),
    textAttr("streamed", "Streamed video", "Battery", AIR, PRO, "Up to 22 hours. Up to 35 hours with MagSafe Battery", "Up to 33 hours"),
    textAttr("typical", "Typical use", "Battery", AIR, PRO, "Not listed in Apple's iPhone Air specs", "Up to 24 hours"),
    textAttr("charge", "Charge to 50 percent", "Battery", AIR, PRO, "30 minutes with 20W or higher, or MagSafe at 30W or higher", "Around 15 minutes with a 60W-capable adapter"),
    textAttr("wireless", "Wireless charging", "Battery", AIR, PRO, "MagSafe and Qi2 up to 20W", "MagSafe and Qi2 up to 25W"),
    textAttr("storage", "Storage", "Performance", AIR, PRO, "256GB, 512GB, 1TB", "256GB, 512GB, 1TB, 2TB"),
    textAttr("price", "256GB U.S. price, 2 Nov 2026", "Price", AIR, PRO, `${PRICE_AIR}. ${PRICE_NOTE}`, `${PRICE_PRO}. ${PRICE_NOTE}`),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "iphone-17-vs-iphone-air", title: "iPhone Air vs iPhone 17", category: "technology" },
    { slug: "iphone-17-pro-vs-iphone-18-pro", title: "iPhone 17 Pro vs iPhone 18 Pro", category: "technology" },
    { slug: "iphone-18-pro-vs-iphone-18-pro-max", title: "iPhone 18 Pro vs iPhone 18 Pro Max", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "iPhone 18 Pro for a multi-year keep of the newer chip and the higher video-playback rating. iPhone Air when the 165 gram, 5.64 mm body is the reason.",
    keyFact: `Air: A19 Pro, 165 g, 5.64 mm, up to 27 hours of video playback, ${PRICE_AIR} on 2 November 2026. iPhone 18 Pro: A20 Pro, 211 g, 8.75 mm, up to 36 hours, ${PRICE_PRO} the same day. U.S. Apple Store, before tax and trade-in.`,
  },
  citationStats: {
    sourceCount: 10,
    dataPointCount: 30,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple: iPhone Air tech specs", url: AIR_SPECS },
      { name: "Apple: iPhone 18 Pro tech specs", url: PRO_SPECS },
      { name: "Apple Newsroom: iPhone 18 Pro, 9 September 2026", url: NEWS_PRO },
      { name: "Apple Newsroom: iPhone Air, 9 September 2025", url: NEWS_AIR },
      { name: "Apple Support: iPhone battery and performance", url: BATTERY },
      { name: "Apple: Compare iPhone models", url: COMPARE },
      { name: "See vendor page for current price: iPhone Air (Apple Store)", url: BUY_AIR },
      { name: "See vendor page for current price: iPhone 18 Pro (Apple Store)", url: BUY_PRO },
      { name: "iPhone Air hub", url: "/entity/iphone-air" },
      { name: "iPhone Air alternatives", url: "/alternatives/iphone-air" },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Apple: iPhone Air tech specs",
      url: AIR_SPECS,
      description:
        "6.5-inch display, 165 g, 5.64 mm, A19 Pro, one 48MP rear camera, up to 27 hours of video playback, MagSafe Battery up to 40 hours.",
    },
    {
      type: "external",
      label: "Apple: iPhone 18 Pro tech specs",
      url: PRO_SPECS,
      description:
        "6.3-inch display, 211 g, 8.75 mm, A20 Pro, three rear cameras, up to 36 hours of video playback, up to 24 hours of typical use.",
    },
    {
      type: "external",
      label: "Apple Newsroom: iPhone 18 Pro, 9 September 2026",
      url: NEWS_PRO,
      description:
        "eSIM-only models up to 36 hours of video playback. A20 Pro with a vapor chamber. 9 September 2026 U.S. launch price $1,199.",
    },
    {
      type: "external",
      label: "Apple Newsroom: iPhone Air, 9 September 2025",
      url: NEWS_AIR,
      description: "9 September 2025 launch price $999 (U.S.) for iPhone Air. Titanium design and Ceramic Shield 2.",
    },
    {
      type: "external",
      label: "Apple Support: iPhone battery and performance",
      url: BATTERY,
      description:
        "Avoid hot environments, including direct sun. Rechargeable batteries are consumables and lose charge as they chemically age. Published 1 June 2026.",
    },
    {
      type: "external",
      label: "Apple: Compare iPhone models",
      url: COMPARE,
      description: "Apple's side-by-side list of iPhone models, including iPhone Air and iPhone 18 Pro.",
    },
    {
      type: "external",
      label: "See vendor page for current price: iPhone Air (Apple Store)",
      url: BUY_AIR,
      description: `${PRICE_AIR}. ${PRICE_NOTE}. Model card: From $1,099.`,
    },
    {
      type: "external",
      label: "See vendor page for current price: iPhone 18 Pro (Apple Store)",
      url: BUY_PRO,
      description: `${PRICE_PRO}. ${PRICE_NOTE}. Model card: From $1,199.`,
    },
    {
      type: "blog",
      label: "iPhone Air hub",
      url: "/entity/iphone-air",
      description: "AversusB hub for the iPhone Air.",
    },
    {
      type: "blog",
      label: "iPhone Air alternatives",
      url: "/alternatives/iphone-air",
      description: "AversusB alternatives list for the iPhone Air.",
    },
  ],
  metaTitle: "iPhone Air vs iPhone 18 Pro | A Versus B",
});

BUILT.metadata.metaDescription =
  "iPhone Air vs iPhone 18 Pro on Apple specs: 165 g and 5.64 mm against 211 g and 8.75 mm, up to 27 hours of video playback against up to 36 hours.";

export const IPHONE_AIR_VS_IPHONE_18_PRO: EditorialComparison = BUILT;
