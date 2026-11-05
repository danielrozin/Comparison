import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-320 — iPhone 16 Pro Max vs iPhone 17 Pro Max.
 * Opened 5 November 2026 (Asia/Jerusalem):
 * support.apple.com/en-us/121032, support.apple.com/en-us/125091,
 * support.apple.com/en-us/101575, support.apple.com/en-us/104999,
 * support.apple.com/en-us/108794, apple.com/iphone/compare,
 * and apple.com/shop/refurbished/iphone.
 * Battery hours are the figures on those U.S. English tech-specs pages.
 * Asker dollar prices are omitted. No drop-test result and no measured
 * temperature. The vapor chamber line is the materials list only.
 * The 1,000-cycle sentence on the battery article names iPhone 15 models
 * only, so it is not stated here. Reddit returned a network-security block
 * on both source threads, and that subreddit bans self-promotion, so there
 * is no community block and no Reddit reply. No winner.
 */

const PUBLISHED = "2026-11-05T00:00:00Z";
const SOURCE_DATE = "2026-11-05";

const MAX_16 = "iphone-16-pro-max";
const MAX_17 = "iphone-17-pro-max";

const SPECS_16 = "https://support.apple.com/en-us/121032";
const SPECS_17 = "https://support.apple.com/en-us/125091";
const BATTERY = "https://support.apple.com/en-us/101575";
const PREOWNED = "https://support.apple.com/en-us/104999";
const ACTIVATION = "https://support.apple.com/en-us/108794";
const COMPARE = "https://www.apple.com/iphone/compare/";
const REFURB = "https://www.apple.com/shop/refurbished/iphone";

const SPEC = "Specs · Apple U.S. tech specs";

const SHORT_ANSWER = `Choose the iPhone 17 Pro Max if you expect to keep the phone for 4 or 5 years, or if battery life, zoom, or selfies matter. Apple's U.S. tech specs rate video playback at up to 39 hours on the iPhone 17 Pro Max and up to 33 hours on the iPhone 16 Pro Max. The 17 Pro Max adds an A19 Pro chip, a 48MP Fusion Telephoto at 100 mm (4x) that also enables a 12MP optical-quality 8x, an 18MP Center Stage front camera, and an aluminum unibody. Apple lists 100% recycled copper in the vapor chamber enclosure. Choose the iPhone 16 Pro Max if a refurbished or used offer is much cheaper and you mainly want a 6.9-inch ProMotion display with a 12MP 5x telephoto at 120 mm. It has an A18 Pro chip, a titanium design, and a textured matte glass back. Neither phone is right for everyone. Used and refurbished prices change by seller and region.`;

const VERDICT = `Choose the iPhone 17 Pro Max if you expect to keep the phone for 4 or 5 years, or if battery life, the 48MP 4x telephoto, or the 18MP front camera matter. Apple's U.S. tech specs rate video playback at up to 39 hours, against up to 33 hours on the iPhone 16 Pro Max.

Choose the iPhone 16 Pro Max if a refurbished or used unit is much cheaper and Battery Health looks strong. You still get a 6.9-inch Super Retina XDR display with ProMotion and Always-On, plus a 12MP 5x telephoto at 120 mm.

Neither phone is right for everyone. Used and refurbished prices change by seller and region.`;

const EXPERT_ANALYSIS = `Choose the iPhone 17 Pro Max if you expect to keep the phone for 4 or 5 years, or if battery life, zoom, or selfies matter. Choose the iPhone 16 Pro Max if a refurbished or used offer is much cheaper and a 6.9-inch ProMotion display with a 5x telephoto is enough. Neither phone is right for everyone.

Key takeaways. Apple's U.S. tech specs rate video playback at up to 39 hours on the iPhone 17 Pro Max and up to 33 hours on the iPhone 16 Pro Max. Streamed video is up to 35 hours against up to 29 hours. The chips are A19 Pro and A18 Pro. Both displays are 6.9-inch Super Retina XDR OLEDs at 2868 by 1320 pixels and 460 ppi, with ProMotion up to 120Hz and Always-On. Outdoor peak brightness is 3000 nits on the 17 Pro Max and 2000 nits on the 16 Pro Max. Weight is 233 grams against 227 grams. Used and refurbished prices change by seller and region.

Display. Both phones have a 6.9-inch Super Retina XDR OLED display at 2868 by 1320 pixels and 460 ppi. Both have Dynamic Island, Always-On, ProMotion with adaptive refresh rates up to 120Hz, and 1000 nits max brightness (typical). Measured as a rectangle, Apple lists 6.86 inches for each, and the viewable area is less. They are not the same panel spec. Apple lists 2000 nits peak outdoor brightness on the iPhone 16 Pro Max and 3000 nits peak outdoor brightness on the iPhone 17 Pro Max. Only the 17 Pro Max display section lists an anti-reflective coating. Apple's compare footnote also names 6.86 inches for both Pro Max models.

Size and build. The iPhone 16 Pro Max is 77.6 mm wide, 163 mm tall, and 8.25 mm thick, at 227 grams. The iPhone 17 Pro Max is 78.0 mm wide, 163.4 mm tall, and 8.75 mm thick, at 233 grams. Those weights differ by 6 grams. Those thicknesses differ by 0.50 mm. Apple says size and weight vary by configuration and manufacturing process. The 16 Pro Max is a titanium design with a latest-generation Ceramic Shield front and a textured matte glass back. The 17 Pro Max is an aluminum unibody with Ceramic Shield 2 on the front and Ceramic Shield on the back. Apple does not give a drop-test result for either phone. If you drop a phone often, use a case on either one.

Water and dust. Apple rates both IP68 under IEC 60529, maximum depth of 6 meters for up to 30 minutes. Apple says splash, water, and dust resistance are not permanent, and that resistance might decrease with normal wear. That rating is not a drop score.

Chip and storage. The iPhone 16 Pro Max uses an A18 Pro: a 6-core CPU with 2 performance cores and 4 efficiency cores, a 6-core GPU, and a 16-core Neural Engine. The iPhone 17 Pro Max uses an A19 Pro: a 6-core CPU with 2 performance cores and 4 efficiency cores, a 6-core GPU with Neural Accelerators, a 16-core Neural Engine, and hardware-accelerated ray tracing. Storage on the 16 Pro Max is 256GB, 512GB, or 1TB. Storage on the 17 Pro Max is 256GB, 512GB, 1TB, or 2TB. Apple says available space is less. Apple's tech specs do not list an end date for iOS updates on either phone. A newer chip is not a count of future iOS versions.

Cameras and zoom. The iPhone 16 Pro Max rear system is a 48MP Fusion main camera at 24 mm, a 48MP Ultra Wide at 13 mm, and a 12MP 5x telephoto at 120 mm. Apple lists 5x optical zoom in, 2x optical zoom out, a 10x optical zoom range, and digital zoom up to 25x. The iPhone 17 Pro Max rear system is a 48MP Fusion Main camera at 24 mm, a 48MP Fusion Ultra Wide at 13 mm, and a 48MP Fusion Telephoto at 100 mm (4x). Apple says that telephoto also enables a 12MP optical-quality 8x at 200 mm, with 8x optical-quality zoom in, 2x optical zoom out, a 16x optical-quality zoom range, and digital zoom up to 40x. The 5x lens on the 16 Pro Max reaches a longer marked focal length. The 17 Pro Max telephoto is 48MP and adds the 8x optical-quality step. The front camera is a 12MP TrueDepth camera on the 16 Pro Max and an 18MP Center Stage camera on the 17 Pro Max. Both front cameras list an f/1.9 aperture. Both phones have Camera Control and an Action button.

Battery hours. On Apple's U.S. tech specs, iPhone 16 Pro Max video playback is up to 33 hours and streamed video is up to 29 hours. iPhone 17 Pro Max video playback is up to 39 hours and streamed video is up to 35 hours. Those video-playback ratings differ by 6 hours. Those streamed ratings differ by 6 hours. Apple says every battery claim depends on network configuration and many other factors, and that actual results will vary. Apple also says the battery has limited recharge cycles and may eventually need to be replaced. Those hour ratings describe the phones in Apple's test. They are not a count of hours left after 4 or 5 years of chemical aging. As a lithium-ion battery chemically ages, Apple says the charge it can hold diminishes.

Charging and wireless. Both use USB-C with USB 3 at up to 10Gb/s. Apple says a USB 3 cable with 10Gb/s speed is required for that rate. MagSafe wireless charging is up to 25W on both with a 30W adapter or higher. Qi2 wireless charging is up to 15W on the 16 Pro Max and up to 25W on the 17 Pro Max. The 16 Pro Max also lists Qi wireless charging up to 7.5W. With a USB-C cable, the 16 Pro Max reaches up to 50 percent in around 30 minutes with a 20W adapter or higher, and the 17 Pro Max reaches up to 50 percent in 20 minutes with a 40W adapter or higher. The 16 Pro Max lists Wi-Fi 7 and Bluetooth 5.3. The 17 Pro Max lists an Apple N1 wireless networking chip, Wi-Fi 7, and Bluetooth 6.

Heat. Apple lists 100% recycled copper in the vapor chamber enclosure on the iPhone 17 Pro Max. That line sits in the materials section. The iPhone 16 Pro Max materials section lists 100% recycled aluminum in the internal structural frame and thermal substructure, and it does not name a vapor chamber. Apple does not give a measured temperature for either phone. Apple says to avoid charging an iPhone, or leaving it, in a hot environment such as direct sun for an extended period.

Buying used or refurbished. Open Settings, tap Battery, then tap Battery Health & Charging. On iOS 16.1 or later that is the label. The earlier label is Battery Health. Read maximum capacity. Maximum capacity is the battery's charge relative to when it was new, and it can show slightly less than 100 percent depending on how long the phone sat before activation. Apple says not to buy an iPhone that is Activation Locked. On iOS 15 or later, a protected phone can show an iPhone Locked to Owner screen. Do not take ownership if you see that screen. Apple says the phone is ready to set up when you see the Hello screen. Buy from a reliable seller, read the return policy, and ask what a seller inspects if they certify preowned phones. Apple's refurbished iPhone store says every product undergoes a rigorous certification process. Open Settings, tap General, then tap About. On iOS 15.2 or later, a Parts and Service History section can appear after the serial number, depending on the model and whether a part was replaced. Genuine Apple Part means the part was replaced with a genuine Apple part. Unknown can mean an unfinished install, a nongenuine part, a part used in another iPhone, or a part that is not working as expected. Prices for used and refurbished phones change by seller and region.

Who should choose which. Choose the iPhone 17 Pro Max for a 4 or 5 year keep, the higher video-playback rating, the A19 Pro, the 48MP 4x telephoto, or the 18MP front camera. Choose the iPhone 16 Pro Max when the used or refurbished price gap is large and Battery Health looks strong. A later Pro Max pair is iPhone 17 Pro Max versus iPhone 18 Pro Max. The same-generation size pair is iPhone 16 Pro versus iPhone 16 Pro Max.`;

const FAQS = [
  {
    question: "Is the iPhone 17 Pro Max worth it over the iPhone 16 Pro Max?",
    answer:
      "For a 4 or 5 year keep, the iPhone 17 Pro Max is usually the one to choose. Apple's U.S. tech specs rate video playback at up to 39 hours, against up to 33 hours on the iPhone 16 Pro Max, and the 17 Pro Max has the A19 Pro chip, a 48MP 4x telephoto, and an 18MP Center Stage front camera. A refurbished or used iPhone 16 Pro Max can be the value choice when the price gap is large and Battery Health looks strong. Used and refurbished prices change by seller and region.",
  },
  {
    question: "Which has better battery life, iPhone 16 Pro Max or 17 Pro Max?",
    answer:
      "The iPhone 17 Pro Max, on Apple's U.S. tech specs. Apple lists video playback at up to 39 hours and streamed video at up to 35 hours. The iPhone 16 Pro Max is listed at up to 33 hours of video playback and up to 29 hours streamed. Apple says actual results vary with network configuration and other factors. Those ratings are not a count of hours left after 4 or 5 years.",
  },
  {
    question: "Do the iPhone 16 Pro Max and 17 Pro Max have the same display?",
    answer:
      "They share the size and the pixel grid. Both have a 6.9-inch Super Retina XDR OLED display at 2868 by 1320 pixels (460 ppi), with ProMotion up to 120Hz and Always-On. Measured as a rectangle, Apple lists 6.86 inches for both. They are not identical: Apple lists 2000 nits peak outdoor brightness on the iPhone 16 Pro Max and 3000 nits on the iPhone 17 Pro Max, and only the 17 Pro Max display section lists an anti-reflective coating.",
  },
  {
    question: "Which iPhone has better zoom, 16 Pro Max or 17 Pro Max?",
    answer:
      "They zoom differently. The iPhone 16 Pro Max has a 12MP 5x telephoto at 120 mm. Apple lists 5x optical zoom in, a 10x optical zoom range, and digital zoom up to 25x. The iPhone 17 Pro Max has a 48MP Fusion Telephoto at 100 mm (4x). Apple says that camera also enables a 12MP optical-quality 8x at 200 mm, with a 16x optical-quality zoom range and digital zoom up to 40x.",
  },
  {
    question: "Is the iPhone 17 Pro Max heavier than the iPhone 16 Pro Max?",
    answer:
      "Yes, by a small margin. Apple lists the iPhone 17 Pro Max at 233 grams and 8.75 mm thick, and the iPhone 16 Pro Max at 227 grams and 8.25 mm thick. Those weights differ by 6 grams. Those thicknesses differ by 0.50 mm. Apple says size and weight vary by configuration and manufacturing process.",
  },
  {
    question: "Does the iPhone 17 Pro Max have a vapor chamber?",
    answer:
      "Apple lists 100% recycled copper in the vapor chamber enclosure on the iPhone 17 Pro Max. That line is in the materials section. The iPhone 16 Pro Max materials section lists 100% recycled aluminum in the internal structural frame and thermal substructure, and it does not name a vapor chamber. Apple does not give a measured temperature for either phone.",
  },
  {
    question: "What should you look at on a used or refurbished iPhone 16 Pro Max?",
    answer:
      "Open Settings, tap Battery, then tap Battery Health & Charging (on iOS 16.1 or later; the earlier label is Battery Health) and read maximum capacity. Apple says not to buy an iPhone that shows iPhone Locked to Owner. A phone is ready to set up when you see the Hello screen. Buy from a reliable seller, and Apple's refurbished iPhone store says every product undergoes a rigorous certification process.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "iphone-16-pro-max-vs-iphone-17-pro-max",
  title: "iPhone 16 Pro Max vs iPhone 17 Pro Max",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: MAX_16,
      slug: MAX_16,
      name: "iPhone 16 Pro Max",
      shortDesc: "6.9-inch titanium iPhone, 227 g and 8.25 mm, A18 Pro, 12MP 5x telephoto, up to 33 hours of video playback.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "227 grams and 8.25 mm (Apple)",
        "12MP 5x telephoto at 120 mm, 10x optical zoom range (Apple)",
        "6.9-inch Super Retina XDR display with ProMotion and Always-On (Apple)",
      ],
      cons: [
        "Up to 33 hours of video playback on Apple's U.S. tech specs, against up to 39 hours on the iPhone 17 Pro Max",
        "A18 Pro chip, against the A19 Pro",
        "Textured matte glass back, against a Ceramic Shield back on the iPhone 17 Pro Max",
      ],
      bestFor: "A much cheaper refurbished or used phone when Battery Health looks strong",
    },
    {
      id: MAX_17,
      slug: MAX_17,
      name: "iPhone 17 Pro Max",
      shortDesc: "6.9-inch aluminum iPhone, 233 g and 8.75 mm, A19 Pro, 48MP 4x telephoto, up to 39 hours of video playback.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Up to 39 hours of video playback on Apple's U.S. tech specs",
        "A19 Pro chip with hardware-accelerated ray tracing (Apple)",
        "48MP 4x telephoto with a 12MP optical-quality 8x, and an 18MP Center Stage front camera (Apple)",
      ],
      cons: [
        "233 grams and 8.75 mm, against 227 grams and 8.25 mm",
        "Vapor chamber appears as a recycled-copper enclosure material, with no temperature figure from Apple",
      ],
      bestFor: "A 4 or 5 year keep when battery life, zoom, or selfies matter",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Much cheaper refurb or used phone",
      entityBValue: "4 or 5 year keep",
      winner: "tie",
    },
    {
      label: "Video playback, U.S. specs",
      entityAValue: "Up to 33 hours",
      entityBValue: "Up to 39 hours",
      winner: "tie",
    },
    {
      label: "Chip",
      entityAValue: "A18 Pro",
      entityBValue: "A19 Pro",
      winner: "tie",
    },
    {
      label: "Telephoto",
      entityAValue: "12MP 5x at 120 mm",
      entityBValue: "48MP 4x at 100 mm, plus 8x",
      winner: "tie",
    },
    {
      label: "Front camera",
      entityAValue: "12MP TrueDepth",
      entityBValue: "18MP Center Stage",
      winner: "tie",
    },
    {
      label: "Weight",
      entityAValue: "227 g",
      entityBValue: "233 g",
      winner: "tie",
    },
    {
      label: "Build",
      entityAValue: "Titanium, glass back",
      entityBValue: "Aluminum unibody, Ceramic Shield back",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("display", "Display", SPEC, MAX_16, MAX_17, "6.9-inch Super Retina XDR OLED, 2868 by 1320 at 460 ppi, ProMotion up to 120Hz, Always-On", "6.9-inch Super Retina XDR OLED, 2868 by 1320 at 460 ppi, ProMotion up to 120Hz, Always-On"),
    textAttr("brightness", "Outdoor peak brightness", "Display", MAX_16, MAX_17, "2000 nits. 1000 nits typical max", "3000 nits, plus an anti-reflective coating. 1000 nits typical max"),
    textAttr("size", "Size", "Design", MAX_16, MAX_17, "77.6 x 163 x 8.25 mm", "78.0 x 163.4 x 8.75 mm"),
    textAttr("weight", "Weight", "Design", MAX_16, MAX_17, "227 g (7.99 ounces)", "233 g (8.22 ounces)"),
    textAttr("build", "Build", "Design", MAX_16, MAX_17, "Titanium design, Ceramic Shield front, textured matte glass back", "Aluminum unibody, Ceramic Shield 2 front, Ceramic Shield back"),
    textAttr("water", "Water and dust", "Design", MAX_16, MAX_17, "IP68, 6 meters for up to 30 minutes", "IP68, 6 meters for up to 30 minutes"),
    textAttr("chip", "Chip", "Performance", MAX_16, MAX_17, "A18 Pro: 6-core CPU, 6-core GPU, 16-core Neural Engine", "A19 Pro: 6-core CPU, 6-core GPU with Neural Accelerators, 16-core Neural Engine, hardware-accelerated ray tracing"),
    textAttr("storage", "Storage", "Performance", MAX_16, MAX_17, "256GB, 512GB, 1TB", "256GB, 512GB, 1TB, 2TB"),
    textAttr("tele", "Telephoto", "Camera", MAX_16, MAX_17, "12MP 5x at 120 mm, f/2.8", "48MP Fusion at 100 mm (4x), f/2.8, plus 12MP optical-quality 8x at 200 mm"),
    textAttr("zoom", "Zoom", "Camera", MAX_16, MAX_17, "10x optical zoom range. Digital up to 25x", "16x optical-quality zoom range. Digital up to 40x"),
    textAttr("front", "Front camera", "Camera", MAX_16, MAX_17, "12MP TrueDepth, f/1.9", "18MP Center Stage, f/1.9"),
    textAttr("video", "Video playback, U.S. specs", "Battery", MAX_16, MAX_17, "Up to 33 hours", "Up to 39 hours"),
    textAttr("streamed", "Streamed video, U.S. specs", "Battery", MAX_16, MAX_17, "Up to 29 hours", "Up to 35 hours"),
    textAttr("charge", "Charge to 50 percent", "Battery", MAX_16, MAX_17, "Around 30 minutes with a 20W adapter or higher and a USB-C cable", "20 minutes with a 40W adapter or higher and a USB-C cable"),
    textAttr("wireless", "Wireless", "Wireless", MAX_16, MAX_17, "Wi-Fi 7, Bluetooth 5.3. MagSafe up to 25W with a 30W adapter or higher. Qi2 up to 15W", "Apple N1 chip, Wi-Fi 7, Bluetooth 6. MagSafe up to 25W with a 30W adapter or higher. Qi2 up to 25W"),
    textAttr("port", "Port", "Wireless", MAX_16, MAX_17, "USB-C, USB 3 up to 10Gb/s. Camera Control. Action button", "USB-C, USB 3 up to 10Gb/s. Camera Control. Action button"),
    textAttr("heat", "Heat materials", "Materials", MAX_16, MAX_17, "Recycled aluminum in the thermal substructure. No vapor chamber named", "100% recycled copper in the vapor chamber enclosure"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "iphone-17-pro-max-vs-iphone-18-pro-max",
      title: "iPhone 17 Pro Max vs iPhone 18 Pro Max",
      category: "technology",
    },
    {
      slug: "iphone-16-pro-vs-iphone-16-pro-max",
      title: "iPhone 16 Pro vs iPhone 16 Pro Max",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "iPhone 17 Pro Max for a 4 or 5 year keep of the higher video-playback rating and the A19 Pro. iPhone 16 Pro Max when a refurbished or used offer is much cheaper.",
    keyFact:
      "U.S. Apple tech specs: iPhone 17 Pro Max up to 39 hours of video playback with an A19 Pro. iPhone 16 Pro Max up to 33 hours with an A18 Pro. Both are 6.9-inch, 2868 by 1320 displays.",
  },
  citationStats: {
    sourceCount: 9,
    dataPointCount: 17,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple Support: iPhone 16 Pro Max tech specs", url: SPECS_16 },
      { name: "Apple Support: iPhone 17 Pro Max tech specs", url: SPECS_17 },
      { name: "Apple Support: iPhone battery and performance", url: BATTERY },
      { name: "Apple Support: If you want to buy a preowned iPhone", url: PREOWNED },
      { name: "Apple Support: Activation Lock for iPhone and iPad", url: ACTIVATION },
      { name: "Apple: Compare iPhone models", url: COMPARE },
      { name: "Apple Refurbished iPhone", url: REFURB },
      { name: "iPhone 16 Pro Max hub", url: "/entity/iphone-16-pro-max" },
      { name: "iPhone 17 Pro Max hub", url: "/entity/iphone-17-pro-max" },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Apple Support: iPhone 16 Pro Max tech specs",
      url: SPECS_16,
      description:
        "A18 Pro, 227 g, 8.25 mm, titanium and textured matte glass back, 12MP 5x telephoto, up to 33 hours of video playback, up to 29 hours streamed.",
    },
    {
      type: "external",
      label: "Apple Support: iPhone 17 Pro Max tech specs",
      url: SPECS_17,
      description:
        "A19 Pro, 233 g, 8.75 mm, aluminum unibody, 48MP 4x telephoto, 18MP Center Stage front camera, up to 39 hours of video playback, up to 35 hours streamed.",
    },
    {
      type: "external",
      label: "Apple Support: iPhone battery and performance",
      url: BATTERY,
      description:
        "Settings, Battery, then Battery Health. Chemical aging reduces the charge a battery can hold. Avoid hot environments, including direct sun. Published 1 June 2026.",
    },
    {
      type: "external",
      label: "Apple Support: If you want to buy a preowned iPhone",
      url: PREOWNED,
      description:
        "Buy from a reliable seller. Battery Health & Charging on iOS 16.1 or later. Do not buy an Activation Locked iPhone. Published 16 March 2026.",
    },
    {
      type: "external",
      label: "Apple Support: Activation Lock for iPhone and iPad",
      url: ACTIVATION,
      description:
        "iPhone Locked to Owner means the phone is still linked to the previous owner. Ready to use when the Hello screen appears. Published 29 April 2026.",
    },
    {
      type: "external",
      label: "Apple: Compare iPhone models",
      url: COMPARE,
      description: "Apple's side-by-side model list. The rectangle footnote names 6.86 inches for both Pro Max phones.",
    },
    {
      type: "external",
      label: "Apple Refurbished iPhone",
      url: REFURB,
      description: "Apple says every refurbished product undergoes a rigorous certification process. Open the store for current stock.",
    },
    {
      type: "blog",
      label: "iPhone 16 Pro Max hub",
      url: "/entity/iphone-16-pro-max",
      description: "AversusB hub for the iPhone 16 Pro Max.",
    },
    {
      type: "blog",
      label: "iPhone 17 Pro Max hub",
      url: "/entity/iphone-17-pro-max",
      description: "AversusB hub for the iPhone 17 Pro Max.",
    },
  ],
  metaTitle: "iPhone 16 Pro Max vs iPhone 17 Pro Max | A Versus B",
});

BUILT.metadata.metaDescription =
  "U.S. Apple specs: iPhone 17 Pro Max up to 39 hours of video playback, iPhone 16 Pro Max up to 33 hours, A19 Pro against A18 Pro.";

export const IPHONE_16_PRO_MAX_VS_IPHONE_17_PRO_MAX: EditorialComparison = BUILT;
