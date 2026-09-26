import { buildEditorialComparison, textAttrN } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-92 — iPhone 17 vs 17 Pro vs 16 Pro.
 * Every figure is from an Apple, AppleInsider, or GSMArena page fetched
 * 2026-09-26. Community notes summarize the Reddit thread without quotes.
 */

const IPHONE_17 = "iphone-17";
const IPHONE_17_PRO = "iphone-17-pro";
const IPHONE_16_PRO = "iphone-16-pro";

const APPLE_17 = "https://www.apple.com/iphone-17/specs/";
const APPLE_17_PRO = "https://support.apple.com/en-us/125090";
const APPLE_16_PRO = "https://support.apple.com/en-us/121031";
const APPLE_17_PRICE = "https://www.apple.com/newsroom/2025/09/apple-debuts-iphone-17/";
const APPLE_17_PRO_PRICE =
  "https://www.apple.com/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/";
const APPLE_18 =
  "https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/";
const APPLE_INSIDER =
  "https://appleinsider.com/inside/iphone-17/vs/iphone-17-pro-vs-iphone-16-pro---the-new-top-tier-compared";
const GSMARENA =
  "https://www.gsmarena.com/compare.php3?idPhone1=14050&idPhone2=14049&idPhone3=13315";
const REFURB = "https://www.apple.com/shop/refurbished/iphone";
const REDDIT =
  "https://www.reddit.com/r/AppleWhatShouldIBuy/comments/1wqfipl/which_one_should_i_get_iphone_17_vs_17_pro_vs_16/";

const RESEARCHED = "2026-09-26T00:00:00Z";

const SHORT_ANSWER =
  "For most people upgrading from an older phone who want good battery life, years of updates and solid video without Pro prices, the iPhone 17 is the best value. Pick the iPhone 17 Pro if you shoot a lot of video and want the longer telephoto zoom, faster USB 3 transfers and more battery. Pick the iPhone 16 Pro only if a refurbished unit is clearly cheaper.";

const FAQS = [
  {
    question: "Is the 17 Pro worth it over the 17?",
    answer:
      "Yes if you will use the longer telephoto, want USB 3 transfers for large video files, or want the higher video-playback rating. Apple rates the iPhone 17 Pro for up to 33 hours of video playback and the iPhone 17 for up to 30 hours. The 17 Pro has USB 3 up to 10Gb/s and a 48MP Fusion Telephoto at 100 mm (4x) that also enables a 12MP optical-quality 8x at 200 mm. The iPhone 17 has USB 2 up to 480Mb/s and no separate telephoto lens (Apple lists a 12MP optical-quality 2x at 52 mm from the main camera). Launch prices were $799 for the iPhone 17 and $1,099 for the iPhone 17 Pro.",
  },
  {
    question: "Is the 16 Pro better than the 17?",
    answer:
      "The iPhone 16 Pro has a dedicated 12MP 120 mm (5x) telephoto and USB 3 up to 10Gb/s, which the iPhone 17 does not. The iPhone 17 has the newer A19 chip (the 16 Pro has the A18 Pro), launched on iOS 26 (the 16 Pro shipped with iOS 18), and is rated for up to 30 hours of video playback versus up to 27 hours on the 16 Pro. Pick the 16 Pro only if a refurbished unit is clearly cheaper. Launch prices were $799 for the iPhone 17 and $999 for the iPhone 16 Pro.",
  },
  {
    question: "Which is best for video?",
    answer:
      "The iPhone 17 Pro. It has the longer telephoto — a 48MP Fusion Telephoto at 100 mm (4x), plus a 12MP optical-quality 8x at 200 mm — and USB 3 up to 10Gb/s for moving large video files off the phone. Apple rates it for up to 33 hours of video playback, ahead of 30 hours on the iPhone 17 and 27 hours on the iPhone 16 Pro. AppleInsider describes that telephoto as a 48MP telephoto with 8x optical-quality zoom.",
  },
  {
    question: "Should I buy the 18 Pro instead?",
    answer:
      "Apple says iPhone 18 Pro availability began September 18, 2026, starting at $1,199. That is $100 more than the iPhone 17 Pro launch price of $1,099. The iPhone 17 launched at $799. This page does not compare iPhone 18 Pro camera or battery specs. If the budget is tight, the iPhone 17 is the value pick among the three phones here.",
  },
  {
    question: "Is buying refurbished safe?",
    answer:
      "Apple sells Certified Refurbished iPhones. Check battery health and the warranty before you buy. This page does not list refurbished prices.",
  },
  {
    question: "Which lasts the most years?",
    answer:
      "This page does not quote a support-year count. The iPhone 17 and iPhone 17 Pro launched on iOS 26, and the iPhone 16 Pro shipped with iOS 18. The 17 uses an A19 chip and the 17 Pro an A19 Pro; the 16 Pro uses an A18 Pro. A newer chip and a later launch are the usual signs of a longer remaining update window.",
  },
];

const VERDICT = `Best value: iPhone 17. It launched at $799, uses the A19 chip, and Apple rates it for up to 30 hours of video playback.

Best for video: iPhone 17 Pro. Apple lists a 48MP Fusion Telephoto at 100 mm (4x) that also enables a 12MP optical-quality 8x at 200 mm, USB 3 up to 10Gb/s, and up to 33 hours of video playback. It launched at $1,099.

Refurbished bargain only: iPhone 16 Pro. It still has a 12MP 120 mm (5x) telephoto and USB 3 up to 10Gb/s, but it uses the A18 Pro, shipped with iOS 18, and is rated for up to 27 hours of video playback. Choose it only when a refurbished unit is clearly cheaper. It launched at $999.

What about the iPhone 18 Pro? Apple says availability began September 18, 2026, starting at $1,199, which is $100 more than the 17 Pro launch price. When this page was researched, apple.com/iphone-17-pro/specs/ redirected to apple.com/iphone/, while the iPhone 17 spec page still loaded. The 17 Pro figures here are from Apple Support.`;

const EXPERT_ANALYSIS = `This page answers which of the iPhone 17, iPhone 17 Pro, and iPhone 16 Pro to buy when you are upgrading from an older phone and care about battery life, staying on updates, and video — including if you might buy refurbished. There is no single winner.

Battery and longevity

Apple rates video playback at up to 30 hours on the iPhone 17, up to 33 hours on the iPhone 17 Pro, and up to 27 hours on the iPhone 16 Pro. The 17 uses an A19 chip, the 17 Pro an A19 Pro, and the 16 Pro an A18 Pro. GSMArena lists launch software as iOS 26 for the 17 series and iOS 18 for the 16 Pro. Apple Support storage notes also mention iOS 26 on the 17 Pro and iOS 18 on the 16 Pro. This page does not quote a year count for how long Apple will ship updates.

Camera and video

The iPhone 17 spec page does not list a separate telephoto lens. Its longer reach is a 12MP optical-quality 2x at 52 mm from the main camera. The iPhone 16 Pro has a 12MP 5x telephoto at 120 mm. The iPhone 17 Pro has a 48MP Fusion Telephoto at 100 mm (4x) and a 12MP optical-quality 8x at 200 mm. AppleInsider summarizes that 17 Pro camera as a 48MP telephoto with 8x optical-quality zoom. For moving footage off the phone, the 17 Pro and 16 Pro are USB 3 up to 10Gb/s. The iPhone 17 is USB 2 up to 480Mb/s.

Buying refurbished

Apple’s Certified Refurbished iPhone store is the place to start if you want a 16 Pro, or a 17 Pro now that apple.com/iphone-17-pro/specs/ redirects to the main iPhone page. Check battery health and the warranty on the unit you are offered. This page does not list refurbished prices.

Who should buy which

Choose the iPhone 17 if you want battery life, a later software start, and solid video without the Pro launch price of $1,099. It launched at $799.

Choose the iPhone 17 Pro if you shoot a lot of video and want the longer telephoto, USB 3 transfers, and the 33-hour video-playback rating.

Choose the iPhone 16 Pro only when a refurbished unit is clearly cheaper. You still get a 120 mm 5x telephoto and USB 3, on the older A18 Pro and an iOS 18 launch.

Community verdict

On the r/AppleWhatShouldIBuy thread asking about the iPhone 17, 17 Pro, and 16 Pro, opinions split by job rather than by a single winner. Several comments lean toward the 17 Pro. Some treat the iPhone 17 as the best value. Some say the gap between the 16 Pro and the 17 Pro is small. This is a summary of that thread, not a quote and not a vote count.

All three phones are a 6.3-inch OLED display with ProMotion up to 120Hz on Apple’s spec pages. GSMArena’s three-way compare lists the same 6.3-inch 120Hz OLED size for each.`;

const cell = (entityId: string, text: string, winner?: boolean) => ({
  entityId,
  text,
  winner,
});

export const IPHONE_17_VS_17_PRO_VS_16_PRO: EditorialComparison = buildEditorialComparison({
  slug: "iphone-17-vs-iphone-17-pro-vs-iphone-16-pro",
  title: "iPhone 17 vs iPhone 17 Pro vs iPhone 16 Pro: Which Should You Buy?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: RESEARCHED,
  updatedAt: RESEARCHED,
  entities: [
    {
      id: IPHONE_17,
      slug: IPHONE_17,
      name: "iPhone 17",
      shortDesc:
        "Apple’s standard 2025 iPhone with an A19 chip, USB 2, and a $799 launch price.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "A19 chip, a generation newer than the 16 Pro’s A18 Pro",
        "Up to 30 hours of video playback (Apple)",
        "Launched at $799 (Apple Newsroom)",
        "Launched on iOS 26 (GSMArena)",
        "6.3-inch OLED with ProMotion up to 120Hz",
      ],
      cons: [
        "USB 2, up to 480Mb/s — not USB 3",
        "No separate telephoto lens (12MP optical-quality 2x from the main camera)",
        "Shorter rated video playback than the 17 Pro (30 hours on the 17, 33 hours on the 17 Pro)",
      ],
      bestFor: "Best value for most upgraders",
    },
    {
      id: IPHONE_17_PRO,
      slug: IPHONE_17_PRO,
      name: "iPhone 17 Pro",
      shortDesc:
        "2025 Pro with an A19 Pro chip, USB 3, a longer telephoto, and up to 33 hours of video playback.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "A19 Pro chip",
        "USB 3 up to 10Gb/s for large video files",
        "48MP Fusion Telephoto at 100 mm (4x), plus 12MP optical-quality 8x at 200 mm",
        "Up to 33 hours of video playback (Apple Support)",
        "Launched on iOS 26",
      ],
      cons: [
        "Launched at $1,099, $300 more than the iPhone 17",
        "apple.com/iphone-17-pro/specs/ redirected to apple.com/iphone/ when this page was researched",
      ],
      bestFor: "Best for video",
    },
    {
      id: IPHONE_16_PRO,
      slug: IPHONE_16_PRO,
      name: "iPhone 16 Pro",
      shortDesc:
        "2024 Pro with an A18 Pro chip, a 120 mm 5x telephoto, and USB 3. A refurbished buy only when it is clearly cheaper.",
      imageUrl: null,
      entityType: "product",
      position: 2,
      pros: [
        "12MP 120 mm (5x) telephoto (Apple Support)",
        "USB 3 up to 10Gb/s",
        "Launched at $999 (AppleInsider)",
        "6.3-inch OLED with ProMotion up to 120Hz",
      ],
      cons: [
        "A18 Pro, one chip generation behind the 17 and 17 Pro",
        "Shipped with iOS 18",
        "Up to 27 hours of video playback, the shortest of the three",
        "Worth it only when a refurbished unit is clearly cheaper",
      ],
      bestFor: "Refurbished bargain only",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Best value for most upgraders",
      entityBValue: "Best for video",
      values: [
        "Best value for most upgraders",
        "Best for video",
        "Only if refurbished is clearly cheaper",
      ],
      winnerIndex: "tie",
    },
    {
      label: "USB data",
      entityAValue: "USB 2, up to 480Mb/s",
      entityBValue: "USB 3, up to 10Gb/s",
      values: ["USB 2, up to 480Mb/s", "USB 3, up to 10Gb/s", "USB 3, up to 10Gb/s"],
      winnerIndex: "tie",
    },
    {
      label: "Video playback",
      entityAValue: "Up to 30 hours",
      entityBValue: "Up to 33 hours",
      values: ["Up to 30 hours", "Up to 33 hours", "Up to 27 hours"],
      winnerIndex: 1,
    },
  ],
  attributes: [
    textAttrN("chip", "Chip", "Performance", [
      cell(IPHONE_17, "A19"),
      cell(IPHONE_17_PRO, "A19 Pro"),
      cell(IPHONE_16_PRO, "A18 Pro"),
    ]),
    textAttrN("usb", "USB", "Connectivity", [
      cell(IPHONE_17, "USB 2, up to 480Mb/s"),
      cell(IPHONE_17_PRO, "USB 3, up to 10Gb/s", true),
      cell(IPHONE_16_PRO, "USB 3, up to 10Gb/s", true),
    ]),
    textAttrN("telephoto", "Telephoto", "Camera", [
      cell(IPHONE_17, "No separate telephoto; 12MP optical-quality 2x at 52 mm"),
      cell(IPHONE_17_PRO, "48MP at 100 mm (4x); 12MP optical-quality 8x at 200 mm", true),
      cell(IPHONE_16_PRO, "12MP 120 mm (5x)"),
    ]),
    textAttrN("video-playback", "Video playback", "Battery", [
      cell(IPHONE_17, "Up to 30 hours"),
      cell(IPHONE_17_PRO, "Up to 33 hours", true),
      cell(IPHONE_16_PRO, "Up to 27 hours"),
    ]),
    textAttrN("launch-price", "Launch price (U.S.)", "Price", [
      cell(IPHONE_17, "$799 (256GB)"),
      cell(IPHONE_17_PRO, "$1,099 (256GB)"),
      cell(IPHONE_16_PRO, "$999 (128GB)"),
    ]),
    textAttrN("display", "Display", "Display", [
      cell(IPHONE_17, "6.3-inch OLED, up to 120Hz"),
      cell(IPHONE_17_PRO, "6.3-inch OLED, up to 120Hz"),
      cell(IPHONE_16_PRO, "6.3-inch OLED, up to 120Hz"),
    ]),
    textAttrN("launch-os", "Launch software", "Software", [
      cell(IPHONE_17, "iOS 26"),
      cell(IPHONE_17_PRO, "iOS 26"),
      cell(IPHONE_16_PRO, "iOS 18"),
    ]),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "iphone-17-pro-vs-pro-max",
      title: "iPhone 17 Pro vs iPhone 17 Pro Max",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Split by job: iPhone 17 for value, iPhone 17 Pro for video, iPhone 16 Pro only as a cheaper refurbished buy.",
    keyFact:
      "Launch prices were $799 for 256GB (iPhone 17), $1,099 for 256GB (iPhone 17 Pro), and $999 for 128GB (iPhone 16 Pro). The iPhone 18 Pro starts at $1,199.",
  },
  citationStats: {
    sourceCount: 10,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: "2026-09-26",
    sources: [
      { name: "Apple — iPhone 17 specs", url: APPLE_17 },
      { name: "Apple Support — iPhone 17 Pro specs", url: APPLE_17_PRO },
      { name: "Apple Support — iPhone 16 Pro specs", url: APPLE_16_PRO },
      { name: "Apple Newsroom — iPhone 17 launch price", url: APPLE_17_PRICE },
      { name: "Apple Newsroom — iPhone 17 Pro launch price", url: APPLE_17_PRO_PRICE },
      { name: "Apple Newsroom — iPhone 18 Pro", url: APPLE_18 },
      { name: "AppleInsider — 17 Pro vs 16 Pro", url: APPLE_INSIDER },
      { name: "GSMArena — 17 vs 17 Pro vs 16 Pro", url: GSMARENA },
      { name: "Apple Certified Refurbished iPhone", url: REFURB },
      { name: "Reddit — r/AppleWhatShouldIBuy thread", url: REDDIT },
    ],
  },
  resources: [
    {
      type: "external",
      label: "iPhone 17 specs (A19, USB 2, 30-hour video)",
      url: APPLE_17,
      description: "Apple. Chip, USB 2 up to 480Mb/s, display, and video playback.",
    },
    {
      type: "external",
      label: "iPhone 17 Pro specs (A19 Pro, USB 3, 33-hour video)",
      url: APPLE_17_PRO,
      description: "Apple Support. Telephoto, USB 3 up to 10Gb/s, and video playback.",
    },
    {
      type: "external",
      label: "iPhone 16 Pro specs (A18 Pro, 120 mm telephoto)",
      url: APPLE_16_PRO,
      description: "Apple Support. 5x telephoto, USB 3, and 27-hour video playback.",
    },
    {
      type: "external",
      label: "iPhone 17 launch price ($799)",
      url: APPLE_17_PRICE,
      description: "Apple Newsroom, September 2025.",
    },
    {
      type: "external",
      label: "iPhone 17 Pro launch price ($1,099)",
      url: APPLE_17_PRO_PRICE,
      description: "Apple Newsroom, September 2025.",
    },
    {
      type: "external",
      label: "iPhone 18 Pro ($1,199, September 18, 2026)",
      url: APPLE_18,
      description: "Apple Newsroom. Availability began September 18, 2026.",
    },
    {
      type: "external",
      label: "AppleInsider — 17 Pro vs 16 Pro prices and zoom",
      url: APPLE_INSIDER,
      description: "16 Pro launch price of $999 and the 8x optical-quality zoom wording.",
    },
    {
      type: "external",
      label: "GSMArena three-way compare",
      url: GSMARENA,
      description: "Launch software (iOS 26 / iOS 26 / iOS 18) and 6.3-inch 120Hz OLED.",
    },
    {
      type: "external",
      label: "Apple Certified Refurbished iPhone",
      url: REFURB,
      description: "Check battery health and warranty. No prices on this page.",
    },
    {
      type: "external",
      label: "Reddit thread (summary only)",
      url: REDDIT,
      description: "Community lean, summarized without quotes or usernames.",
    },
  ],
  metaTitle: "iPhone 17 vs 17 Pro vs 16 Pro: Which Should You Buy? | A Versus B",
});
