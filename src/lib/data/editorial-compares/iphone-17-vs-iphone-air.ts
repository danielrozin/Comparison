import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-130 — iPhone 17 vs iPhone Air.
 * Apple's product name is iPhone Air. The canonical hub is
 * /entity/iphone-air, which was index, follow on 30 September 2026.
 * /entity/iphone-17-air is a different hub and was noindex, nofollow, so
 * this page does not link it.
 * Specs checked against Apple's spec pages and GSMArena, fetched 2026-09-30.
 * No page-level winner. No invented benchmark.
 */

const IPHONE_17 = "iphone-17";
const AIR = "iphone-air";

const APPLE_17 = "https://www.apple.com/iphone-17/specs/";
const APPLE_AIR = "https://www.apple.com/iphone-air/specs/";
const APPLE_IN_17 = "https://www.apple.com/in/shop/buy-iphone/iphone-17";
const APPLE_IN_AIR = "https://www.apple.com/in/shop/buy-iphone/iphone-air";
const GSMARENA_17 = "https://www.gsmarena.com/apple_iphone_17-14050.php";
const GSMARENA_AIR = "https://www.gsmarena.com/apple_iphone_17_air-13502.php";

const FETCHED = "2026-09-30";
const PUBLISHED = "2026-09-30T00:00:00Z";

const SHORT_ANSWER =
  "Choose the iPhone 17 for the more complete everyday phone if you are coming from an iPhone 13. Apple rates it for up to 30 hours of video playback, against up to 27 hours on the iPhone Air, and it adds a 48MP ultrawide. Choose the iPhone Air only if the 5.64 mm, 165 gram titanium body is why you are upgrading. It has one 48MP rear camera. GSMArena lists 3,692 mAh for the iPhone 17 and 3,149 mAh for the iPhone Air. This page does not crown a winner.";

const FAQS = [
  {
    question: "Is the iPhone Air better than the iPhone 17?",
    answer:
      "Only if the thin titanium body is the thing you want. Apple lists the Air at 5.64 mm and 165 grams, against 7.95 mm and 177 grams for the iPhone 17. For camera flexibility and battery, the iPhone 17 is ahead on the published specs: a 48MP ultrawide as well as the main camera, up to 30 hours of video playback, and a 3,692 mAh battery on GSMArena. The Air is a single 48MP rear camera, up to 27 hours, and 3,149 mAh.",
  },
  {
    question: "Should I upgrade from an iPhone 13 to the iPhone Air or the iPhone 17?",
    answer:
      "For most people in that spot, the iPhone 17. It is the phone with two rear cameras and the higher video-playback rating, which is what helps group shots and a longer day. Pick the Air only when the 5.64 mm body is the reason to upgrade and you can accept the single rear camera and the smaller battery. On Apple's India buy pages, fetched on 30 September 2026, the iPhone 17 256GB is ₹99,900 and the iPhone Air 256GB is ₹1,49,900. At 512GB the same pages list ₹1,24,900 and ₹1,74,900. The iPhone 17 is the lower price at both of those storage tiers. Apple calls the listed price the MRP, inclusive of all taxes. Check a live listing.",
  },
  {
    question: "Does the iPhone Air have a better chip than the iPhone 17?",
    answer:
      "The Air uses the A19 Pro with a 5-core GPU. The iPhone 17 uses the A19 with a 5-core GPU. Apple lists both that way. This page does not cite a benchmark, and it does not claim a gaming gap.",
  },
  {
    question: "Which is thinner and lighter, iPhone Air or iPhone 17?",
    answer:
      "The iPhone Air. Apple lists it at 5.64 mm and 165 grams. The iPhone 17 is 7.95 mm and 177 grams. GSMArena lists the same weights and rounds the thickness to 5.6 mm and 8 mm. The figures used here are Apple's.",
  },
  {
    question: "Which has the better camera for Instagram, iPhone Air or iPhone 17?",
    answer:
      "The iPhone 17, if you want a wider option for groups and travel. Apple lists a 48MP Fusion main camera and a 48MP Fusion Ultra Wide at 13 mm. The iPhone Air has a single 48MP Fusion main camera. Its 2x view is a 12MP crop of that main camera at 52 mm, not a second lens. Both are fine for a straight-on photo from the main camera.",
  },
  {
    question: "Which has better battery life, iPhone Air or iPhone 17?",
    answer:
      "The iPhone 17, on the figures Apple and GSMArena publish. Apple rates video playback at up to 30 hours on the iPhone 17 and up to 27 hours on the iPhone Air. GSMArena lists 3,692 mAh for the iPhone 17 and 3,149 mAh for the iPhone Air, with active-use scores of 14:59h and 12:44h. Those hour scores are GSMArena's lab scores, not Apple's video-playback claim.",
  },
];

const VERDICT = `Best everyday upgrade from an iPhone 13: iPhone 17. Dual 48MP rear cameras, up to 30 hours of video playback, and a 3,692 mAh battery on GSMArena.

Best if thinness is the reason: iPhone Air. Apple lists 5.64 mm and 165 grams, in titanium. You give up the ultrawide and take the smaller battery. Apple rates video playback at up to 27 hours, and GSMArena lists 3,149 mAh.

On Apple's India buy pages, fetched on 30 September 2026, the iPhone 17 256GB is ₹99,900 and the iPhone Air 256GB is ₹1,49,900. The iPhone 17 is also lower at 512GB: ₹1,24,900 against ₹1,74,900. The Air 1TB is ₹2,24,900. Apple calls these listed prices the MRP, inclusive of all taxes. Check a live listing.

There is no single winner on this page.`;

const EXPERT_ANALYSIS = `The iPhone 17 is the better everyday upgrade from an iPhone 13 unless the ultra-thin body is the reason you are buying. The iPhone Air is that thin phone, and the spec sheet shows what you give up to get it. This page does not crown a winner.

Source note: size, display, chip, cameras, and Apple's video-playback hours are from Apple's iPhone 17 and iPhone Air spec pages, fetched on 30 September 2026. Battery capacity, RAM, and GSMArena's active-use scores are from GSMArena's iPhone 17 and iPhone Air pages, fetched the same day. Rupee prices are from Apple's India buy pages, fetched the same day, and GSMArena is not used for a rupee price. GSMArena lists the Air's thickness as 5.6 mm and the iPhone 17's as 8 mm. Apple lists 5.64 mm and 7.95 mm, and those are the figures used here. Apple's spec pages do not list RAM or a milliamp-hour capacity.

Body and display

Apple lists the iPhone Air at 6.5 inches, 165 grams, and 5.64 mm, with a titanium design. The iPhone 17 is 6.3 inches, 177 grams, and 7.95 mm, with an aluminum design. Both are a Super Retina XDR OLED display with ProMotion up to 120Hz, Ceramic Shield 2, and an IP68 rating (maximum depth of 6 meters for up to 30 minutes). The Air is the thinner, lighter phone. The iPhone 17 is the more conventional body.

Chip, memory, and storage

The Air uses an A19 Pro chip with a 5-core GPU. The iPhone 17 uses an A19 chip with a 5-core GPU. Apple's pages do not list RAM. GSMArena lists 12GB on the Air and 8GB on the iPhone 17. Apple lists Air storage at 256GB, 512GB, and 1TB. iPhone 17 storage is 256GB and 512GB. This page does not cite a benchmark, so it does not turn the chip names into a gaming ranking.

Cameras

The iPhone 17 rear system is a 48MP Fusion main camera and a 48MP Fusion Ultra Wide at 13 mm with a 120-degree field of view. The iPhone Air rear system is one 48MP Fusion main camera. On both phones, Apple says the main camera also enables a 12MP optical-quality 2x at 52 mm. That 2x is not a separate telephoto lens, and the Air does not add the ultrawide. For a photo dump from the main camera, both cover it. For a group or a wide travel shot, the iPhone 17 is the one with the second lens. Both have an 18MP Center Stage front camera.

Battery

Apple rates video playback at up to 30 hours on the iPhone 17 and up to 27 hours on the iPhone Air. Streamed video playback is up to 27 hours on the iPhone 17 and up to 22 hours on the Air. GSMArena lists 3,692 mAh and an active-use score of 14:59h for the iPhone 17, and 3,149 mAh and 12:44h for the Air. Apple's hours and GSMArena's hours are different tests. The direction is the same: the iPhone 17 is the larger battery on both sources.

Software and price

GSMArena lists both phones as iOS 26, upgradable to iOS 27. Apple's spec pages, fetched on 30 September 2026, list "iPhone with iOS 27" in the box. This page does not guess which software a specific unit ships with beyond those two lines.

Apple's India buy page for the iPhone 17 lists ₹99,900 for 256GB and ₹1,24,900 for 512GB. The iPhone Air buy page lists ₹1,49,900 for 256GB, ₹1,74,900 for 512GB, and ₹2,24,900 for 1TB. Both pages were fetched on 30 September 2026, and both call the listed price the MRP, inclusive of all taxes. At 256GB and at 512GB, the iPhone 17 is the lower price. A lower price does not make it the better phone, and the Air's 1TB option has no iPhone 17 match on that page. Check a live listing before you decide on cost. This page does not quote a discount.

Who should buy which

Choose the iPhone 17 if you are leaving an iPhone 13 and you want a reliable everyday phone: two rear cameras, the higher video-playback rating, and the larger battery. The chip difference is not a reason to pick the Air for photos and social apps. This page has no benchmark that says otherwise.

Choose the iPhone Air if you have held the 5.64 mm titanium phone and that is why you are upgrading. You are accepting one rear camera, 3,149 mAh, and Apple's 27-hour video-playback rating.`;

const SPEC_APPLE = "Specs · Apple, fetched 2026-09-30";
const SPEC_GSM = "Specs · GSMArena, fetched 2026-09-30";

export const IPHONE_17_VS_IPHONE_AIR: EditorialComparison = buildEditorialComparison({
  slug: "iphone-17-vs-iphone-air",
  title: "iPhone Air vs iPhone 17: Which Should You Buy?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: IPHONE_17,
      slug: IPHONE_17,
      name: "iPhone 17",
      shortDesc:
        "6.3-inch iPhone with an A19 chip, a 48MP main camera plus a 48MP ultrawide, and up to 30 hours of video playback.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "48MP main camera and a 48MP ultrawide (Apple)",
        "Up to 30 hours of video playback (Apple)",
        "3,692 mAh and a 14:59h active-use score (GSMArena)",
        "7.95 mm and 177 g, a conventional aluminum body (Apple)",
      ],
      cons: [
        "Thicker and heavier than the Air: 7.95 mm and 177 g, against 5.64 mm and 165 g",
        "8GB RAM on GSMArena, against 12GB on the Air",
        "No 1TB storage option on Apple's spec page. Storage is 256GB and 512GB",
      ],
      bestFor: "Best everyday upgrade from an iPhone 13",
    },
    {
      id: AIR,
      slug: AIR,
      name: "iPhone Air",
      shortDesc:
        "6.5-inch titanium iPhone, 5.64 mm and 165 grams, with an A19 Pro chip and a single 48MP rear camera.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "5.64 mm and 165 grams, titanium (Apple)",
        "A19 Pro with a 5-core GPU (Apple)",
        "12GB RAM, and storage up to 1TB (GSMArena and Apple)",
        "Same ProMotion 120Hz OLED class and IP68 rating as the iPhone 17",
      ],
      cons: [
        "One rear camera. No ultrawide (Apple)",
        "Up to 27 hours of video playback, against up to 30 on the iPhone 17",
        "3,149 mAh and a 12:44h active-use score (GSMArena)",
      ],
      bestFor: "Best if the thin titanium body is the reason",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Everyday upgrade from an iPhone 13",
      entityBValue: "Thin titanium body",
      winner: "tie",
    },
    {
      label: "Rear cameras",
      entityAValue: "48MP main and 48MP ultrawide",
      entityBValue: "Single 48MP camera",
      winner: "a",
    },
    {
      label: "Video playback",
      entityAValue: "Up to 30 hours",
      entityBValue: "Up to 27 hours",
      winner: "a",
    },
    {
      label: "Thickness",
      entityAValue: "7.95 mm",
      entityBValue: "5.64 mm",
      winner: "b",
    },
    {
      label: "Battery capacity",
      entityAValue: "3,692 mAh (GSMArena)",
      entityBValue: "3,149 mAh (GSMArena)",
      winner: "a",
    },
  ],
  attributes: [
    textAttr(
      "body",
      "Size and weight",
      SPEC_APPLE,
      IPHONE_17,
      AIR,
      "6.3-inch, 177 g, 7.95 mm, aluminum",
      "6.5-inch, 165 g, 5.64 mm, titanium"
    ),
    textAttr(
      "display",
      "Display and ingress",
      SPEC_APPLE,
      IPHONE_17,
      AIR,
      "Super Retina XDR OLED, 120Hz, Ceramic Shield 2, IP68",
      "Super Retina XDR OLED, 120Hz, Ceramic Shield 2, IP68"
    ),
    textAttr(
      "chip",
      "Chip",
      SPEC_APPLE,
      IPHONE_17,
      AIR,
      "A19, 5-core GPU",
      "A19 Pro, 5-core GPU"
    ),
    textAttr(
      "memory",
      "RAM and storage",
      "RAM · GSMArena. Storage · Apple. Fetched 2026-09-30",
      IPHONE_17,
      AIR,
      "8GB RAM (GSMArena); 256GB or 512GB",
      "12GB RAM (GSMArena); 256GB, 512GB, or 1TB",
      "b"
    ),
    textAttr(
      "camera",
      "Rear camera",
      SPEC_APPLE,
      IPHONE_17,
      AIR,
      "48MP main and 48MP ultrawide",
      "Single 48MP camera. 2x is a crop of the main camera",
      "a"
    ),
    textAttr(
      "playback",
      "Video playback",
      SPEC_APPLE,
      IPHONE_17,
      AIR,
      "Up to 30 hours",
      "Up to 27 hours",
      "a"
    ),
    textAttr(
      "battery",
      "Battery capacity",
      SPEC_GSM,
      IPHONE_17,
      AIR,
      "3,692 mAh. Active-use score 14:59h",
      "3,149 mAh. Active-use score 12:44h",
      "a"
    ),
    textAttr(
      "price",
      "Apple India price",
      "MRP · Apple India buy pages, fetched 2026-09-30. Check a live listing",
      IPHONE_17,
      AIR,
      "256GB ₹99,900. 512GB ₹1,24,900",
      "256GB ₹1,49,900. 512GB ₹1,74,900. 1TB ₹2,24,900",
      "a"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "iphone-17-vs-iphone-17-pro-vs-iphone-16-pro",
      title: "iPhone 17 vs iPhone 17 Pro vs iPhone 16 Pro",
      category: "technology",
    },
    {
      slug: "iphone-16e-vs-iphone-17e",
      title: "iPhone 16e vs iPhone 17e",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "iPhone 17 for the everyday upgrade: ultrawide and the higher battery ratings. iPhone Air only if the 5.64 mm body is the reason.",
    keyFact:
      "Apple rates video playback at up to 30 hours on the iPhone 17 and up to 27 hours on the iPhone Air. GSMArena lists 3,692 mAh and 3,149 mAh. The Air is 5.64 mm and 165 grams.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 8,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: "Apple — iPhone 17 specs (fetched 2026-09-30)", url: APPLE_17 },
      { name: "Apple — iPhone Air specs (fetched 2026-09-30)", url: APPLE_AIR },
      { name: "Apple India — iPhone 17 buy (fetched 2026-09-30)", url: APPLE_IN_17 },
      { name: "Apple India — iPhone Air buy (fetched 2026-09-30)", url: APPLE_IN_AIR },
      { name: "GSMArena — iPhone 17 (fetched 2026-09-30)", url: GSMARENA_17 },
      { name: "GSMArena — iPhone Air (fetched 2026-09-30)", url: GSMARENA_AIR },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Apple iPhone 17 specs",
      url: APPLE_17,
      description:
        "Fetched 2026-09-30. 6.3-inch, 177 g, 7.95 mm, A19, dual 48MP cameras, up to 30 hours of video playback.",
    },
    {
      type: "external",
      label: "Apple iPhone Air specs",
      url: APPLE_AIR,
      description:
        "Fetched 2026-09-30. 6.5-inch, 165 g, 5.64 mm, A19 Pro, single 48MP camera, up to 27 hours of video playback.",
    },
    {
      type: "external",
      label: "Apple India iPhone 17 buy",
      url: APPLE_IN_17,
      description:
        "Fetched 2026-09-30. 256GB ₹99,900. 512GB ₹1,24,900. Listed price is the MRP, inclusive of all taxes. Check a live listing.",
    },
    {
      type: "external",
      label: "Apple India iPhone Air buy",
      url: APPLE_IN_AIR,
      description:
        "Fetched 2026-09-30. 256GB ₹1,49,900. 512GB ₹1,74,900. 1TB ₹2,24,900. Listed price is the MRP, inclusive of all taxes. Check a live listing.",
    },
    {
      type: "external",
      label: "GSMArena iPhone 17",
      url: GSMARENA_17,
      description:
        "Fetched 2026-09-30. 3,692 mAh, 8GB RAM, active-use 14:59h. Thickness listed as 8 mm. Not used for a rupee price.",
    },
    {
      type: "external",
      label: "GSMArena iPhone Air",
      url: GSMARENA_AIR,
      description:
        "Fetched 2026-09-30. 3,149 mAh, 12GB RAM, active-use 12:44h. Thickness listed as 5.6 mm. Not used for a rupee price.",
    },
    {
      type: "blog",
      label: "iPhone Air hub",
      url: "/entity/iphone-air",
      description: "AversusB hub for the iPhone Air.",
    },
  ],
  metaTitle: "iPhone Air vs iPhone 17 | A Versus B",
});
