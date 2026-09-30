import { buildEditorialComparison, textAttrN } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-128 — iPhone 17 Pro vs Galaxy S25 Ultra vs Galaxy S26 Ultra.
 * Specs checked against pages fetched on 2026-09-30.
 * Three-way compares are already supported (see the iPhone 17 / 17 Pro / 16 Pro page).
 * No page-level winner. Rupee prices come only from apple.com/in and samsung.com/in.
 * Apple's India buy URL for the iPhone 17 Pro did not list that phone on 2026-09-30.
 */

const PRO = "iphone-17-pro";
const S25 = "samsung-galaxy-s25-ultra";
const S26 = "samsung-galaxy-s26-ultra";

const GSMARENA_PRO = "https://www.gsmarena.com/apple_iphone_17_pro-14049.php";
const GSMARENA_S25 = "https://www.gsmarena.com/samsung_galaxy_s25_ultra-13322.php";
const GSMARENA_S26 = "https://www.gsmarena.com/samsung_galaxy_s26_ultra_5g-14320.php";
const APPLE_PRO = "https://support.apple.com/en-us/125090";
const APPLE_IN_PRO = "https://www.apple.com/in/shop/buy-iphone/iphone-17-pro";
const APPLE_IN_17 = "https://www.apple.com/in/shop/buy-iphone/iphone-17";
const AIR_COMPARE = "/compare/iphone-17-vs-iphone-air";
const SAMSUNG_S25 = "https://www.samsung.com/in/smartphones/galaxy-s25-ultra/buy/";
const SAMSUNG_S26 = "https://www.samsung.com/in/smartphones/galaxy-s26-ultra/buy/";

const FETCHED = "2026-09-30";
const PUBLISHED = "2026-09-30T00:00:00Z";

const SHORT_ANSWER =
  "iPhone 17 Pro vs Galaxy S25 Ultra vs Galaxy S26 Ultra. Both Ultras have a 200MP camera with 3x and 5x. The 17 Pro has a 4x telephoto. No winner is crowned.";

const BUDGET_ANSWER =
  "No. None of these three qualifies. Samsung India lists the Galaxy S25 Ultra 256GB at ₹1,19,999 and the Galaxy S26 Ultra 256GB at ₹1,54,999, fetched on 30 September 2026. Apple India no longer lists an iPhone 17 Pro price. The iPhone 17 256GB is ₹99,900 on https://www.apple.com/in/shop/buy-iphone/iphone-17, fetched the same day. See /compare/iphone-17-vs-iphone-air.";

const FAQS = [
  {
    question: "Can you get any of these under ₹1 lakh?",
    answer: BUDGET_ANSWER,
  },
  {
    question: "Is the Galaxy S25 Ultra still worth buying after the S26 Ultra?",
    answer:
      "Yes if you want the same Ultra camera set: a 200MP main camera, a 10MP 3x telephoto, a 50MP 5x periscope, and a 50MP ultrawide. The S26 Ultra adds Snapdragon 8 Elite Gen 5, 60W wired charging, and a GSMArena active-use score of 16:23h, against 14:49h on the S25 Ultra. Samsung's India buy page, fetched on 30 September 2026, showed the S25 Ultra 256GB | 12GB at ₹1,19,999, with an MRP of ₹1,29,999, and the 512GB | 12GB model at ₹1,39,999, with an MRP of ₹1,49,999. The 1TB option did not show a price. This page does not pick a phone from price.",
  },
  {
    question: "What does the Galaxy S26 Ultra add over the S25 Ultra?",
    answer:
      "Snapdragon 8 Elite Gen 5, 60W wired charging, and a GSMArena active-use score of 16:23h, against 14:49h on the S25 Ultra. Samsung's India buy page, fetched on 30 September 2026, showed the S26 Ultra 256GB | 12GB at ₹1,54,999, with an MRP of ₹1,69,999, and the 512GB | 12GB model at ₹1,74,999, with an MRP of ₹1,89,999. The 1TB | 16GB option did not show a price.",
  },
  {
    question: "Which is better for telephoto and video, the iPhone 17 Pro or a Galaxy Ultra?",
    answer:
      "The Ultras, if you want two optical telephoto steps. GSMArena lists a 10MP 3x and a 50MP 5x periscope on both, plus a 200MP main camera and a 50MP ultrawide. The iPhone 17 Pro is the pick if you want Apple's video formats. Apple Support lists a 48MP Fusion Telephoto at 100 mm (4x), and GSMArena lists ProRes, ProRes RAW, and Apple Log 2. The 17 Pro does not add a separate 3x and 5x.",
  },
  {
    question: "Which has the better battery, iPhone 17 Pro, S25 Ultra, or S26 Ultra?",
    answer:
      "On GSMArena's active-use scores, the S26 Ultra is 16:23h, the iPhone 17 Pro is 15:23h, and the S25 Ultra is 14:49h. Both Ultras are 5,000 mAh. GSMArena lists the 17 Pro at 3,998 mAh for the nano-SIM version and 4,252 mAh for the eSIM-only version. Apple Support rates the 17 Pro for up to 33 hours of video playback. That Apple figure is a different test, and these Galaxy spec pages do not publish an equivalent video-playback hour rating.",
  },
  {
    question: "Should an iPhone 13 owner switch to Samsung?",
    answer:
      "Switch if you want the 6.9-inch Ultra and the 3x and 5x cameras. Stay with the iPhone 17 Pro if staying on iOS matters and you will use the 4x telephoto plus ProRes or Apple Log 2. GSMArena lists up to 7 major OS updates for both Ultras. It lists the 17 Pro as iOS 26, upgradable to iOS 27, and it does not publish an Apple support-year count.",
  },
];

const VERDICT = `Ultra cameras: Galaxy S25 Ultra and Galaxy S26 Ultra. Both keep a 200MP main camera, a 3x telephoto, a 5x periscope, and a 5,000 mAh battery. The S26 Ultra adds Snapdragon 8 Elite Gen 5, 60W wired charging, and a GSMArena active-use score of 16:23h, against 14:49h on the S25 Ultra.

Apple video tools: iPhone 17 Pro. Apple lists a 48MP 100 mm (4x) telephoto and up to 33 hours of video playback. GSMArena lists ProRes, ProRes RAW, and Apple Log 2.

There is no single winner on this page.`;

const EXPERT_ANALYSIS = `Choose the Galaxy S25 Ultra or the Galaxy S26 Ultra for the Ultra zoom cameras and the 5,000 mAh battery. Choose the iPhone 17 Pro when the 4x telephoto and Apple's Pro video formats matter. This page does not crown a winner.

Source note: the comparison table uses GSMArena listings fetched on 30 September 2026, from each phone's spec page. Apple Support is cited for the iPhone 17 Pro's size, the 100 mm telephoto, ProRes, and the 33-hour video-playback rating. Rupee prices are from Samsung's India buy pages and from the absence of an iPhone 17 Pro price on Apple's India buy page, fetched the same day. GSMArena is not used for a rupee price. Check a live listing.

Price

Samsung's India buy page for the Galaxy S25 Ultra showed ₹1,19,999 for 256GB | 12GB, with an MRP of ₹1,29,999, and ₹1,39,999 for 512GB | 12GB, with an MRP of ₹1,49,999. The 1TB option did not show a price. The Galaxy S26 Ultra page showed ₹1,54,999 for 256GB | 12GB, with an MRP of ₹1,69,999, and ₹1,74,999 for 512GB | 12GB, with an MRP of ₹1,89,999. The 1TB | 16GB option did not show a price. Apple's India buy page for the iPhone 17 Pro redirected to the current lineup and did not list that phone. These are the figures on those pages on 30 September 2026. Check a live listing. This page does not pick a phone from price.

Screens, weight, and chips

GSMArena lists a 6.3-inch LTPO Super Retina XDR OLED, 120Hz, on the iPhone 17 Pro. Both Ultras are a 6.9-inch Dynamic LTPO AMOLED 2X, 120Hz. Apple Support lists the 17 Pro at 206 grams and 8.75 mm thick. GSMArena lists the same 206 grams and rounds the thickness to 8.8 mm. The S25 Ultra is 218 grams and 8.2 mm. The S26 Ultra is 214 grams and 7.9 mm. The 17 Pro chipset is Apple A19 Pro. The S25 Ultra is Snapdragon 8 Elite. The S26 Ultra is Snapdragon 8 Elite Gen 5. This page does not repeat GSMArena's benchmark scores.

Cameras and video

The iPhone 17 Pro rear system is three 48MP cameras: a main, a 100 mm (4x) periscope, and an ultrawide. Apple Support describes that telephoto as a 48MP Fusion Telephoto at 100 mm (4x). GSMArena also lists ProRes, ProRes RAW, and Apple Log 2. Each Ultra has a 200MP main camera, a 10MP 3x telephoto, a 50MP 5x periscope, and a 50MP ultrawide. The Ultras are the more flexible zoom phones. The 17 Pro is the one with those Pro video formats.

Battery and software

Both Ultras are 5,000 mAh. The S25 Ultra charges at 45W wired. The S26 Ultra charges at 60W wired and 25W wireless. GSMArena does not list a wired watt number for the 17 Pro. It lists PD3.2 and 50% in 20 minutes, plus 25W wireless MagSafe. The 17 Pro battery is market-dependent: 3,998 mAh on the nano-SIM version and 4,252 mAh on the eSIM-only version. This page does not assign one of those to India. GSMArena's active-use scores are 16:23h for the S26 Ultra, 15:23h for the 17 Pro, and 14:49h for the S25 Ultra. Apple's 33-hour video-playback rating is a separate claim and is not a GSMArena score.

GSMArena lists up to 7 major OS updates for both Ultras. The S25 Ultra line is Android 15 and One UI 8. The S26 Ultra line is Android 16, upgradable to Android 17, and One UI 9, and it was released 6 March 2026. The 17 Pro line is iOS 26, upgradable to iOS 27. GSMArena does not publish a year count for Apple updates, so this page does not invent one.

Who should buy which

Choose the Galaxy S25 Ultra when you want the Ultra zoom cameras on the current Ultra: 200MP, 3x, and 5x, with a 5,000 mAh battery.

Choose the iPhone 17 Pro when you want to stay on iOS and you will use the 4x telephoto, ProRes, or Apple Log 2.

Choose the Galaxy S26 Ultra when you want the newer chip, 60W charging, and the highest GSMArena active-use score of the three.`;

const cell = (entityId: string, text: string, winner?: boolean) => ({
  entityId,
  text,
  winner,
});

const SPEC = "Specs · GSMArena, fetched 2026-09-30";

export const IPHONE_17_PRO_VS_S25_ULTRA_VS_S26_ULTRA: EditorialComparison = buildEditorialComparison({
  slug: "iphone-17-pro-vs-samsung-galaxy-s25-ultra-vs-samsung-galaxy-s26-ultra",
  title: "iPhone 17 Pro vs Galaxy S25 Ultra vs Galaxy S26 Ultra",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: PRO,
      slug: PRO,
      name: "iPhone 17 Pro",
      shortDesc:
        "6.3-inch phone with an A19 Pro chip and a triple 48MP camera including a 4x telephoto.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "6.3-inch LTPO OLED, 120Hz, 206 g (Apple Support and GSMArena)",
        "48MP Fusion Telephoto at 100 mm, 4x (Apple Support)",
        "ProRes, ProRes RAW, and Apple Log 2 (GSMArena)",
        "Up to 33 hours of video playback (Apple Support)",
        "GSMArena active-use score 15:23h",
      ],
      cons: [
        "Apple's India buy page did not list a price on 30 September 2026",
        "3,998 mAh (nano-SIM) or 4,252 mAh (eSIM-only), against 5,000 mAh on both Ultras",
        "One telephoto step (4x), not a separate 3x and 5x",
        "GSMArena lists wired charging as 50% in 20 minutes, not a watt number",
      ],
      bestFor: "Best if you need the 4x telephoto and Pro video formats",
    },
    {
      id: S25,
      slug: S25,
      name: "Samsung Galaxy S25 Ultra",
      shortDesc:
        "6.9-inch Ultra with a 200MP camera, 3x and 5x telephoto, and a 5,000 mAh battery.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "200MP main, 10MP 3x, 50MP 5x periscope, 50MP ultrawide",
        "5,000 mAh and 45W wired charging",
        "Up to 7 major OS updates (GSMArena)",
        "Stylus listed on the GSMArena body line",
      ],
      cons: [
        "Lowest GSMArena active-use score of the three, 14:49h",
        "Snapdragon 8 Elite, not the S26 Ultra's Gen 5 chip",
        "218 g, the heaviest of the three",
        "45W wired, against 60W on the S26 Ultra",
      ],
      bestFor: "Best if you want the Ultra cameras on the current model",
    },
    {
      id: S26,
      slug: S26,
      name: "Samsung Galaxy S26 Ultra",
      shortDesc:
        "2026 Ultra with Snapdragon 8 Elite Gen 5, 60W charging, and a 16:23h active-use score.",
      imageUrl: null,
      entityType: "product",
      position: 2,
      pros: [
        "GSMArena active-use score 16:23h, the highest of the three",
        "Snapdragon 8 Elite Gen 5 (GSMArena)",
        "5,000 mAh, 60W wired, 25W wireless",
        "200MP main, 3x, and 5x, in a 214 g body",
        "Up to 7 major OS updates, from a 6 March 2026 release",
      ],
      cons: [
        "This page does not pick a phone from price",
        "6.9-inch slab, if you wanted the 17 Pro's smaller body",
      ],
      bestFor: "Best if you want the newer chip and the longer active-use score",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "4x telephoto and Pro video formats",
      entityBValue: "Ultra cameras on the current model",
      values: [
        "4x telephoto and Pro video formats",
        "Ultra cameras on the current model",
        "Newer chip and longer active-use score",
      ],
      winnerIndex: "tie",
    },
    {
      label: "Official India price, 256GB",
      entityAValue: "No price on Apple India",
      entityBValue: "₹1,19,999, MRP ₹1,29,999",
      values: ["No price on Apple India", "₹1,19,999, MRP ₹1,29,999", "₹1,54,999, MRP ₹1,69,999"],
      winnerIndex: "tie",
    },
    {
      label: "Telephoto",
      entityAValue: "48MP 4x at 100 mm",
      entityBValue: "10MP 3x and 50MP 5x",
      values: ["48MP 4x at 100 mm", "10MP 3x and 50MP 5x", "10MP 3x and 50MP 5x"],
      winnerIndex: "tie",
    },
    {
      label: "Active-use score",
      entityAValue: "15:23h",
      entityBValue: "14:49h",
      values: ["15:23h", "14:49h", "16:23h"],
      winnerIndex: 2,
    },
    {
      label: "OS updates",
      entityAValue: "iOS 26, upgradable to iOS 27",
      entityBValue: "Up to 7 major OS updates",
      values: [
        "iOS 26, upgradable to iOS 27",
        "Up to 7 major OS updates",
        "Up to 7 major OS updates, from a later launch",
      ],
      winnerIndex: "tie",
    },
  ],
  attributes: [
    textAttrN("display", "Display", SPEC, [
      cell(PRO, "6.3-inch LTPO Super Retina XDR OLED, 120Hz"),
      cell(S25, "6.9-inch Dynamic LTPO AMOLED 2X, 120Hz"),
      cell(S26, "6.9-inch Dynamic LTPO AMOLED 2X, 120Hz"),
    ]),
    textAttrN("body", "Weight and thickness", "Body · Apple Support and GSMArena, fetched 2026-09-30", [
      cell(PRO, "206 g, 8.75 mm (Apple Support; GSMArena lists 8.8 mm)"),
      cell(S25, "218 g, 8.2 mm"),
      cell(S26, "214 g, 7.9 mm"),
    ]),
    textAttrN("chip", "Chip", SPEC, [
      cell(PRO, "Apple A19 Pro"),
      cell(S25, "Snapdragon 8 Elite"),
      cell(S26, "Snapdragon 8 Elite Gen 5"),
    ]),
    textAttrN("battery", "Battery capacity", SPEC, [
      cell(PRO, "3,998 mAh (nano-SIM) or 4,252 mAh (eSIM-only)"),
      cell(S25, "5,000 mAh"),
      cell(S26, "5,000 mAh"),
    ]),
    textAttrN("charging", "Charging", SPEC, [
      cell(PRO, "PD3.2, 50% in 20 min wired; 25W wireless MagSafe. No wired watt listed"),
      cell(S25, "45W wired, 15W wireless"),
      cell(S26, "60W wired, 25W wireless"),
    ]),
    textAttrN("active-use", "Active-use score", SPEC, [
      cell(PRO, "15:23h (GSMArena)"),
      cell(S25, "14:49h (GSMArena)"),
      cell(S26, "16:23h (GSMArena)", true),
    ]),
    textAttrN("cameras", "Rear cameras", SPEC, [
      cell(PRO, "48MP main, 48MP 4x at 100 mm, 48MP ultrawide"),
      cell(S25, "200MP main, 10MP 3x, 50MP 5x, 50MP ultrawide"),
      cell(S26, "200MP main, 10MP 3x, 50MP 5x, 50MP ultrawide"),
    ]),
    textAttrN("video", "Video formats", "Video · Apple Support and GSMArena, fetched 2026-09-30", [
      cell(PRO, "ProRes, ProRes RAW, and Apple Log 2 (GSMArena); up to 33 hours video playback (Apple)"),
      cell(S25, "8K, 4K, HDR10+ (GSMArena)"),
      cell(S26, "8K, 4K, HDR10+ (GSMArena)"),
    ]),
    textAttrN("os", "Software", SPEC, [
      cell(PRO, "iOS 26, upgradable to iOS 27"),
      cell(S25, "Android 15, One UI 8, up to 7 major OS updates"),
      cell(S26, "Android 16, upgradable to Android 17, One UI 9, up to 7 major OS updates"),
    ]),
    textAttrN(
      "price",
      "Official India price",
      "Samsung India buy pages and Apple India, fetched 2026-09-30. Check a live listing",
      [
        cell(PRO, "No price listed on apple.com/in"),
        cell(S25, "256GB ₹1,19,999 (MRP ₹1,29,999). 512GB ₹1,39,999 (MRP ₹1,49,999). 1TB price not shown"),
        cell(S26, "256GB ₹1,54,999 (MRP ₹1,69,999). 512GB ₹1,74,999 (MRP ₹1,89,999). 1TB price not shown"),
      ]
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "iphone-17-vs-samsung-s26",
      title: "iPhone 17 vs Samsung Galaxy S26",
      category: "technology",
    },
    {
      slug: "samsung-galaxy-s24-ultra-vs-samsung-galaxy-s25-ultra",
      title: "Galaxy S24 Ultra vs Galaxy S25 Ultra",
      category: "technology",
    },
    {
      slug: "iphone-17-vs-iphone-air",
      title: "iPhone 17 vs iPhone Air",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Galaxy S25 Ultra and Galaxy S26 Ultra for the 3x and 5x cameras. iPhone 17 Pro for the 4x telephoto and Pro video formats.",
    keyFact: `Can you get any of these under ₹1 lakh? ${BUDGET_ANSWER}`,
  },
  citationStats: {
    sourceCount: 8,
    dataPointCount: 10,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: "GSMArena — iPhone 17 Pro (fetched 2026-09-30)", url: GSMARENA_PRO },
      { name: "GSMArena — Galaxy S25 Ultra (fetched 2026-09-30)", url: GSMARENA_S25 },
      { name: "GSMArena — Galaxy S26 Ultra (fetched 2026-09-30)", url: GSMARENA_S26 },
      { name: "Apple Support — iPhone 17 Pro specs (fetched 2026-09-30)", url: APPLE_PRO },
      { name: "Samsung India — Galaxy S25 Ultra buy (fetched 2026-09-30)", url: SAMSUNG_S25 },
      { name: "Samsung India — Galaxy S26 Ultra buy (fetched 2026-09-30)", url: SAMSUNG_S26 },
      { name: "Apple India — iPhone 17 Pro buy (fetched 2026-09-30)", url: APPLE_IN_PRO },
      { name: "Apple India — iPhone 17 buy (fetched 2026-09-30)", url: APPLE_IN_17 },
    ],
  },
  resources: [
    {
      type: "external",
      label: "GSMArena iPhone 17 Pro",
      url: GSMARENA_PRO,
      description:
        "Fetched 2026-09-30. A19 Pro, triple 48MP with 4x, 3,998 or 4,252 mAh, active-use 15:23h, ProRes and Apple Log 2. Not used for a rupee price.",
    },
    {
      type: "external",
      label: "GSMArena Galaxy S25 Ultra",
      url: GSMARENA_S25,
      description:
        "Fetched 2026-09-30. 6.9-inch, 218 g, Snapdragon 8 Elite, 5,000 mAh, 45W, active-use 14:49h, up to 7 OS updates. Not used for a rupee price.",
    },
    {
      type: "external",
      label: "GSMArena Galaxy S26 Ultra",
      url: GSMARENA_S26,
      description:
        "Fetched 2026-09-30. 214 g, 7.9 mm, Snapdragon 8 Elite Gen 5, 5,000 mAh, 60W, active-use 16:23h. Not used for a rupee price.",
    },
    {
      type: "external",
      label: "Apple Support iPhone 17 Pro",
      url: APPLE_PRO,
      description:
        "Fetched 2026-09-30. 206 g, 8.75 mm, 48MP telephoto at 100 mm (4x), ProRes, and up to 33 hours of video playback.",
    },
    {
      type: "external",
      label: "Samsung India Galaxy S25 Ultra buy",
      url: SAMSUNG_S25,
      description:
        "Fetched 2026-09-30. 256GB | 12GB ₹1,19,999, MRP ₹1,29,999. 512GB | 12GB ₹1,39,999, MRP ₹1,49,999. 1TB price not shown. Check a live listing.",
    },
    {
      type: "external",
      label: "Samsung India Galaxy S26 Ultra buy",
      url: SAMSUNG_S26,
      description:
        "Fetched 2026-09-30. 256GB | 12GB ₹1,54,999, MRP ₹1,69,999. 512GB | 12GB ₹1,74,999, MRP ₹1,89,999. 1TB price not shown. Check a live listing.",
    },
    {
      type: "external",
      label: "Apple India iPhone 17 Pro buy",
      url: APPLE_IN_PRO,
      description:
        "Fetched 2026-09-30. The URL redirected to the current iPhone lineup and did not list an iPhone 17 Pro price.",
    },
    {
      type: "external",
      label: "Apple India iPhone 17 buy",
      url: APPLE_IN_17,
      description:
        "Fetched 2026-09-30. iPhone 17 256GB ₹99,900. 512GB ₹1,24,900. Listed price is the MRP, inclusive of all taxes.",
    },
    {
      type: "blog",
      label: "iPhone 17 vs iPhone Air",
      url: AIR_COMPARE,
      description:
        "The iPhone 17 256GB is ₹99,900 on Apple India.",
    },
  ],
  metaTitle: "iPhone 17 Pro vs S25 Ultra vs S26 Ultra | A Versus B",
});
