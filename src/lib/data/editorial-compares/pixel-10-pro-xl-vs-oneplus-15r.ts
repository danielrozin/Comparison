import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Pixel 10 Pro XL vs OnePlus 15R (competitor-review reverse-engineer, 2026-10-28).
 * A Versus.com reviewer called its automated verdict on this pair biased; this
 * page explains the trade-offs instead of scoring them. Read on 28 October 2026
 * from Google Store's Pixel 10 Pro / Pro XL tech specs, Google's 20 August 2025
 * launch post ($1199 starting price), OnePlus US 15R specs, the OnePlus US 15R
 * store page ($699.99 for 12GB+256GB in October 2026; the 17 Dec 2025 press
 * release is not hosted on oneplus.com, so the store price is used) and the
 * OnePlus UK PSTI page (15R security updates to 2031/12/31).
 * Dropped: OnePlus CPU/GPU uplift percentages and "industry's most complete IP
 * ratings" (marketing), ultrasonic fingerprint (not on the OnePlus spec sheet),
 * Pixel charging-percentage claims, all fps / benchmark figures and street prices.
 * Brightness figures are not compared directly: Google lists HDR and peak nits,
 * OnePlus lists high-brightness-mode nits. No winner.
 */

const PUBLISHED = "2026-10-28T00:00:00Z";
const SOURCE_DATE = "2026-10-28";

const PIXEL_SPECS = "https://store.google.com/us/product/pixel_10_pro_specs?hl=en-US";
const PIXEL_LAUNCH = "https://blog.google/products-and-platforms/devices/pixel/google-pixel-10-pro-xl/";
const OP_SPECS = "https://www.oneplus.com/us/15r/specs";
const OP_PSTI = "https://www.oneplus.com/uk/psti";
const PIXEL_SHOP = "https://store.google.com/us/product/pixel_10_pro?hl=en-US";
const OP_SHOP = "https://www.oneplus.com/us/oneplus-15r";

const A = "pixel-10-pro-xl";
const B = "oneplus-15r";

const PIXEL_PRICE = "$1199 starting price (256GB), per Google, August 2025";
const OP_PRICE = "$699.99 for 12GB+256GB on the OnePlus US store, October 2026";

const SHORT_ANSWER =
  "Choose the Pixel 10 Pro XL for its camera system and long support: Google lists a 48 MP 5x telephoto, a 42 MP selfie camera, Qi2 wireless charging up to 25W, 16 GB of RAM and 7 years of OS and security updates. Choose the OnePlus 15R for battery and value: OnePlus lists a 7,400 mAh battery, 55W wired charging, a display up to 165Hz and a much lower list price, but no telephoto camera and no wireless charging on its spec sheet. A spec count alone would favour the OnePlus on battery and refresh rate and the Pixel on cameras, so the right pick depends on which of those you use most. Neither is better for everyone.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Price gap: ${PIXEL_PRICE}; ${OP_PRICE}.
- Cameras: the Pixel 10 Pro XL has three rear cameras (50 MP wide, 48 MP ultrawide, 48 MP 5x telephoto); the OnePlus 15R has a 50 MP Sony IMX906 main camera and an 8 MP ultra-wide, with no telephoto.
- Battery: OnePlus lists 7,400 mAh typical; Google lists 5200 mAh typical for the Pixel 10 Pro XL.
- Charging: the Pixel supports Qi2 wireless charging up to 25W; the OnePlus 15R charges at 55W SUPERVOOC, or up to 80W with OnePlus's 100W dual-port adapter, and OnePlus lists no wireless charging.
- Updates: Google lists 7 years of OS, security and Pixel Drop updates from US availability; OnePlus lists security updates for the 15R until December 31, 2031.

Display

The Pixel 10 Pro XL has a 6.8-inch 1344 x 2992 LTPO OLED at 486 PPI with a 1-120 Hz refresh rate and Gorilla Glass Victus 2. The OnePlus 15R has a 6.83-inch 2800 x 1272 panel at 450 ppi that runs at up to 165Hz in supported apps, with Gorilla Glass 7i. Google and OnePlus rate brightness differently, so their nit figures are not directly comparable.

Performance and memory

Google pairs its Tensor G5 chip with 16 GB of RAM and 256 GB, 512 GB or 1 TB of storage. OnePlus pairs the Snapdragon 8 Gen 5 with 12GB of LPDDR5X and 256GB or 512GB of UFS 4.1.

Cameras

1. Pixel 10 Pro XL: 50 MP wide (f/1.68), 48 MP ultrawide with autofocus, 48 MP telephoto with 5x optical zoom and optical stabilisation, Pro Zoom up to 100x, and a 42 MP front camera. Video up to 8K with Video Boost.
2. OnePlus 15R: 50 MP Sony IMX906 main (f/1.8, OIS), 8 MP ultra-wide (112 degrees) and a 32 MP autofocus front camera. Rear video up to 4K at 120 frames per second.

Battery and charging

The OnePlus 15R's 7,400 mAh typical capacity is well over the Pixel 10 Pro XL's 5200 mAh. Google rates the Pixel at 24+ hours of battery life. OnePlus lists 55W wired charging and no wireless charging; Google lists wired fast charging with a 45W charger and Qi2-certified Pixelsnap wireless charging up to 25W.

Durability and size

Google designs the Pixel 10 Pro XL to IP68 and lists 6.4 x 3 x 0.3 in and 8.2 oz. OnePlus rates the 15R IP66, IP68, IP69 and IP69K, at 163.41 x 77.04 x 8.30 mm and 214 to 215 g.

Software support

The Pixel launched with Android 16 and gets 7 years of updates. The OnePlus 15R runs OxygenOS 16 based on Android 16, with security updates until December 31, 2031.

Choose the Pixel 10 Pro XL if

1. You zoom a lot and want a dedicated 5x telephoto.
2. You use wireless or magnetic Qi2 charging.
3. You want the longest stated update window.

Choose the OnePlus 15R if

1. Battery capacity and fast wired charging matter most.
2. You want a high refresh rate display for games.
3. You want to spend less and can live without a telephoto.`;

const FAQS = [
  {
    question: "Is the Pixel 10 Pro XL better than the OnePlus 15R?",
    answer:
      "It depends on what you use most. The Pixel 10 Pro XL adds a 48 MP 5x telephoto, Qi2 wireless charging and 7 years of updates. The OnePlus 15R has a bigger 7,400 mAh battery, a display up to 165Hz and a much lower list price.",
  },
  {
    question: "Does the OnePlus 15R have a telephoto camera?",
    answer:
      "No. OnePlus lists a 50 MP main camera and an 8 MP ultra-wide on the back of the 15R. The Pixel 10 Pro XL has a 48 MP telephoto with 5x optical zoom.",
  },
  {
    question: "Which has the bigger battery?",
    answer:
      "The OnePlus 15R. OnePlus lists a 7,400 mAh typical capacity, and Google lists 5200 mAh typical for the Pixel 10 Pro XL.",
  },
  {
    question: "Does the OnePlus 15R support wireless charging?",
    answer:
      "OnePlus lists only wired charging for the 15R: 55W SUPERVOOC, or up to 80W with its 100W dual-port adapter. The Pixel 10 Pro XL supports Qi2 wireless charging up to 25W.",
  },
  {
    question: "How long will each phone get updates?",
    answer:
      "Google lists 7 years of OS, security and Pixel Drop updates for the Pixel 10 Pro XL from its US availability. OnePlus lists security updates for the 15R until December 31, 2031.",
  },
  {
    question: "Which is more water resistant?",
    answer:
      "Both handle dust and water. Google designs the Pixel 10 Pro XL to IP68, and OnePlus rates the 15R IP66, IP68, IP69 and IP69K, which adds resistance to high-pressure water jets.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "pixel-10-pro-xl-vs-oneplus-15r",
  title: "Pixel 10 Pro XL vs OnePlus 15R: Cameras, Battery and Updates",
  shortAnswer: SHORT_ANSWER,
  verdict:
    "Pixel 10 Pro XL: 5x telephoto, 42 MP selfie, Qi2 wireless charging up to 25W, 16 GB RAM, 7 years of updates.\n\nOnePlus 15R: 7,400 mAh battery, 55W wired charging, up to 165Hz display, IP69K, lower list price.",
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Pixel 10 Pro XL",
      shortDesc: "Google Tensor G5, 6.8-inch LTPO OLED, 50 MP + 48 MP + 48 MP 5x rear cameras, IP68.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "48 MP 5x optical telephoto",
        "Qi2 wireless charging up to 25W",
        "16 GB RAM, up to 1 TB storage",
        "7 years of OS and security updates",
      ],
      cons: ["Smaller 5200 mAh battery", "Much higher starting price"],
      bestFor: "Buyers who want the zoom camera and the longest update window",
    },
    {
      id: B,
      slug: B,
      name: "OnePlus 15R",
      shortDesc: "Snapdragon 8 Gen 5, 6.83-inch display up to 165Hz, 7,400 mAh battery, IP69K.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "7,400 mAh typical battery",
        "55W wired charging, up to 80W with OnePlus's adapter",
        "Display up to 165Hz in supported apps",
        "IP66, IP68, IP69 and IP69K ratings",
      ],
      cons: ["No telephoto camera", "No wireless charging listed", "8 MP ultra-wide"],
      bestFor: "Buyers who put battery and price ahead of zoom",
    },
  ],
  keyDifferences: [
    { label: "Telephoto", entityAValue: "48 MP, 5x optical", entityBValue: "None", winner: "a" },
    { label: "Battery", entityAValue: "5200 mAh typical", entityBValue: "7,400 mAh typical", winner: "b" },
    { label: "Wireless charging", entityAValue: "Qi2, up to 25W", entityBValue: "Not listed", winner: "a" },
    { label: "Refresh rate", entityAValue: "1-120 Hz", entityBValue: "Up to 165Hz", winner: "tie" },
    { label: "Updates", entityAValue: "7 years of OS and security", entityBValue: "Security to December 31, 2031", winner: "tie" },
  ],
  attributes: [
    textAttr("a0", "Display", "Display", A, B, "6.8-inch 1344 x 2992 LTPO OLED, 486 PPI, 1-120 Hz", "6.83-inch 2800 x 1272, 450 ppi, up to 165Hz"),
    textAttr("a1", "Cover glass", "Design", A, B, "Gorilla Glass Victus 2", "Gorilla Glass 7i"),
    textAttr("a2", "Size and weight", "Design", A, B, "6.4 x 3 x 0.3 in, 8.2 oz", "163.41 x 77.04 x 8.30 mm, 214 to 215 g"),
    textAttr("a3", "Water and dust", "Design", A, B, "IP68", "IP66, IP68, IP69 and IP69K"),
    textAttr("a4", "Chip", "Performance", A, B, "Google Tensor G5", "Snapdragon 8 Gen 5"),
    textAttr("a5", "Memory and storage", "Performance", A, B, "16 GB RAM; 256 GB, 512 GB or 1 TB", "12GB LPDDR5X; 256GB or 512GB UFS 4.1"),
    textAttr("a6", "Battery", "Battery", A, B, "5200 mAh typical", "7,400 mAh typical", "b"),
    textAttr("a7", "Charging", "Battery", A, B, "Wired fast charging with a 45W charger; Qi2 wireless up to 25W", "55W SUPERVOOC, up to 80W with OnePlus's 100W adapter; no wireless listed"),
    textAttr("a8", "Rear cameras", "Camera", A, B, "50 MP wide, 48 MP ultrawide, 48 MP 5x telephoto", "50 MP Sony IMX906 main, 8 MP ultra-wide", "a"),
    textAttr("a9", "Front camera", "Camera", A, B, "42 MP with autofocus", "32 MP with autofocus"),
    textAttr("a10", "Software", "Software", A, B, "Android 16; 7 years of OS, security and Pixel Drop updates", "OxygenOS 16 based on Android 16; security updates to December 31, 2031"),
    textAttr("a11", "Launch or list price", "Price", A, B, PIXEL_PRICE, OP_PRICE),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "oneplus-13-vs-oneplus-13r", title: "OnePlus 13 vs OnePlus 13R", category: "technology" },
    { slug: "pixel-9a-vs-pixel-9", title: "Pixel 9a vs Pixel 9", category: "technology" },
    {
      slug: "oneplus-15-vs-samsung-galaxy-s26-ultra-vs-samsung-galaxy-s25-ultra",
      title: "OnePlus 15 vs Galaxy S26 Ultra vs Galaxy S25 Ultra",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Pixel 10 Pro XL for the 5x telephoto, wireless charging and 7 years of updates. OnePlus 15R for the 7,400 mAh battery, 165Hz display and lower price.",
    keyFact:
      "Google lists a 48 MP 5x telephoto and 5200 mAh battery on the Pixel 10 Pro XL; OnePlus lists no telephoto and a 7,400 mAh battery on the 15R.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 30,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Google Store: Pixel 10 Pro and Pro XL tech specs", url: PIXEL_SPECS },
      { name: "Google: Pixel 10 phones are here (August 2025)", url: PIXEL_LAUNCH },
      { name: "OnePlus 15R specs (US)", url: OP_SPECS },
      { name: "OnePlus: Product security update period (PSTI)", url: OP_PSTI },
      { name: "Google Store: Pixel 10 Pro XL", url: PIXEL_SHOP },
      { name: "OnePlus US store: OnePlus 15R", url: OP_SHOP },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Google Store: Pixel 10 Pro and Pro XL tech specs",
      url: PIXEL_SPECS,
      description:
        "Pro XL: 6.8-inch 1344 x 2992 LTPO OLED, 486 PPI, 1-120 Hz, Gorilla Glass Victus 2. 6.4 x 3 x 0.3 in, 8.2 oz. 5200 mAh typical, 45W wired charger, Qi2 up to 25W. Tensor G5, 16 GB RAM, 256 GB to 1 TB. 50 MP wide, 48 MP ultrawide, 48 MP 5x telephoto, 42 MP front. IP68. 7 years of updates. Android 16.",
    },
    {
      type: "external",
      label: "Google: Pixel 10 phones are here (August 2025)",
      url: PIXEL_LAUNCH,
      description: "August 20, 2025: Pixel 10 Pro XL available for preorder starting at $1199.",
    },
    {
      type: "external",
      label: "OnePlus 15R specs (US)",
      url: OP_SPECS,
      description:
        "163.41 x 77.04 x 8.30 mm, 214 to 215 g. 6.83-inch 2800 x 1272, 450 ppi, up to 165Hz, Gorilla Glass 7i. Snapdragon 8 Gen 5, 12GB LPDDR5X, 256GB/512GB UFS 4.1. 7,400 mAh typical. 55W SUPERVOOC, up to 80W with the 100W dual-port adapter. 50 MP IMX906 main, 8 MP ultra-wide, 32 MP front. OxygenOS 16 based on Android 16.",
    },
    {
      type: "external",
      label: "OnePlus: Product security update period (PSTI)",
      url: OP_PSTI,
      description: "OnePlus 15R security updates until 2031/12/31.",
    },
    {
      type: "external",
      label: "See vendor page for current price: Pixel 10 Pro XL (Google Store)",
      url: PIXEL_SHOP,
      description: "Google Store buying options for the Pixel 10 Pro and Pro XL.",
    },
    {
      type: "external",
      label: "See vendor page for current price: OnePlus 15R (OnePlus)",
      url: OP_SHOP,
      description: "OnePlus US store: 12GB+256GB and 12GB+512GB, IP66, IP68, IP69 and IP69K.",
    },
  ],
  metaTitle: "Pixel 10 Pro XL vs OnePlus 15R | A Versus B",
});

BUILT.metadata.metaDescription =
  "Pixel 10 Pro XL vs OnePlus 15R from Google and OnePlus specs: 5x telephoto vs 7,400 mAh battery, charging, 165Hz display, IP ratings and update years.";

export const PIXEL_10_PRO_XL_VS_ONEPLUS_15R: EditorialComparison = BUILT;
