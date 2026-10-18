import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-209: OnePlus 13 vs OnePlus 13R.
 * OnePlus US spec pages for both phones, the OnePlus North America launch
 * press release (7 January 2025) and the OnePlus 13 series OS upgrade policy
 * (5 March 2025). Facts read 18 October 2026 from official sources only.
 * No benchmarks, no street prices (OnePlus's launch release gives none). No winner.
 */

const PUBLISHED = "2026-10-18T00:00:00Z";
const SOURCE_DATE = "2026-10-18";

const OP13_SPECS = "https://www.oneplus.com/us/13/specs";
const OP13R_SPECS = "https://www.oneplus.com/us/13r/specs";
const PRESS = "https://www.oneplus.com/us/press/press-release/oneplus-launches-new-smartphone-flagship-series-in-north-america-oneplus-13-and-oneplus-13r";
const OS_POLICY = "https://communityus.oneplus.com/thread/1809905145622822918";

const SHORT_ANSWER =
  "Choose the OnePlus 13 for the Snapdragon 8 Elite, a 3x optical telephoto with OIS, 50W AIRVOOC wireless charging, IP68 and IP69 ratings, and up to 16GB of RAM and 512GB of storage. Choose the OnePlus 13R if you want the same 6,000 mAh battery capacity, a flat 6.78-inch display, a Snapdragon 8 Gen 3 and a lighter 206 g body at the more affordable price point OnePlus designed it for. Both get four Android upgrades and six years of security updates. Neither is better for everyone.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Chip: Snapdragon 8 Elite in the OnePlus 13; Snapdragon 8 Gen 3 in the 13R.
- Cameras: three 50MP rear cameras on the 13, including a 3x telephoto with OIS; the 13R has a 50MP main camera, a 50MP 2x telephoto and an 8MP ultra-wide.
- Charging: 80W wired plus 50W AIRVOOC wireless on the 13; 55W wired only on the 13R.
- Durability: IP68 and IP69 on the 13; IP65 on the 13R.
- Software: OxygenOS 15 on Android 15 at launch, with Android 16 to 19 promised for both and six years of security updates.

Design and durability

The OnePlus 13 measures 162.9 x 76.5 mm and is 8.5 mm thick with 213 g in Arctic Dawn and Black Eclipse, or 8.9 mm and 210 g in Midnight Ocean. Its display uses Ceramic Guard, and OnePlus says it is the first OnePlus phone rated both IP68 and IP69. The OnePlus 13R measures 161.72 x 75.77 x 8.02 mm and weighs 206 g, with Corning Gorilla Glass 7i front and back, an aluminum frame, a flat screen and an IP65 rating.

Display

Both use a 120Hz ProXDR LTPO 4.1 panel that runs from 1 to 120Hz, with 1600 nits high brightness mode, 4500 nits peak and 10-bit color. The OnePlus 13 has a 6.82-inch 3168 x 1440 (QHD+) panel at 510 ppi; the 13R has a 6.78-inch 2780 x 1264 panel at 450 ppi.

Chipset and memory

The OnePlus 13 pairs the Snapdragon 8 Elite (Oryon CPU at up to 4.32GHz, Adreno 830) with 12GB or 16GB of LPDDR5X and 256GB or 512GB of UFS 4.0, sold as 12GB+256GB or 16GB+512GB in the U.S. The 13R pairs the Snapdragon 8 Gen 3 (Kryo CPU at up to 3.3GHz, Adreno 750) with 12GB of LPDDR5X and 256GB of UFS 4.0.

Cameras

1. OnePlus 13: 50MP Sony LYT-808 main (1/1.4-inch, f/1.6, OIS), 50MP Sony LYT-600 telephoto with 3x optical zoom (73 mm equivalent, OIS), 50MP ultra-wide (120 degrees) and a 32MP front camera. Rear video up to 8K at 30 frames per second.
2. OnePlus 13R: 50MP Sony LYT-700 main (1/1.56-inch, f/1.8, OIS), 50MP telephoto with 2x optical zoom (47 mm equivalent, EIS), 8MP ultra-wide (112 degrees) and a 16MP front camera. Rear video up to 4K at 60 frames per second.

Battery and charging

Both are rated at a typical 6,000 mAh. The 13 uses two 3,000 mAh cells in series (22.92 Wh typical) and the 13R a single cell (23.58 Wh typical). The 13 charges at 80W with its SUPERVOOC adapter, or up to 100W with the 100W dual-port adapter, and supports 50W AIRVOOC wireless charging. The 13R charges at 55W, or up to 80W with the 80W or 100W dual-port adapters.

Software and update policy

Both launched with OxygenOS 15 on Android 15. OnePlus states that the launch version does not count as an upgrade: the OnePlus 13 series is due Android 16, 17, 18 and 19, plus six years of security updates.

Other differences

The OnePlus 13 has an ultrasonic fingerprint sensor and a USB 3.2 Gen 1 port; the 13R has an optical in-display fingerprint sensor and USB 2.0. Both have Wi-Fi 7, Bluetooth 5.4, NFC, an infrared remote and the Alert Slider.

Choose the OnePlus 13 if

1. You want a 3x telephoto with OIS and three 50MP rear cameras.
2. Wireless charging or IP69 matters to you.
3. You want 16GB of RAM and 512GB of storage.

Choose the OnePlus 13R if

1. You want the same rated battery capacity in a lighter, thinner body.
2. You prefer a flat display.
3. You want flagship-class performance at OnePlus's more affordable price point.`;

const FAQS = [
  {
    question: "Does the OnePlus 13R have wireless charging?",
    answer:
      "No. The 13R charges by cable only, at 55W SUPERVOOC. The OnePlus 13 adds 50W AIRVOOC wireless charging alongside 80W wired.",
  },
  {
    question: "Is the OnePlus 13R waterproof?",
    answer:
      "The 13R is rated IP65 for dust and water resistance. The OnePlus 13 is rated IP68 and IP69.",
  },
  {
    question: "Do the OnePlus 13 and 13R use the same chipset?",
    answer:
      "No. The OnePlus 13 uses the Snapdragon 8 Elite and the 13R uses the Snapdragon 8 Gen 3.",
  },
  {
    question: "Which has the bigger battery?",
    answer:
      "Both have a typical 6,000 mAh capacity. The 13 uses two 3,000 mAh cells (22.92 Wh); the 13R uses a single cell (23.58 Wh).",
  },
  {
    question: "Do both have a telephoto camera?",
    answer:
      "Yes. The OnePlus 13 has a 50MP 3x telephoto with OIS; the 13R has a 50MP 2x telephoto with EIS.",
  },
  {
    question: "How many years of updates do the OnePlus 13 and 13R get?",
    answer:
      "OnePlus promises four Android upgrades (Android 16 to 19) and six years of security updates for the OnePlus 13 series.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "oneplus-13-vs-oneplus-13r",
  title: "OnePlus 13 vs OnePlus 13R: Specs, Charging and Updates",
  shortAnswer: SHORT_ANSWER,
  verdict:
    "OnePlus 13: Snapdragon 8 Elite, 3x telephoto with OIS, 50W wireless charging, IP68 and IP69.\n\nOnePlus 13R: Snapdragon 8 Gen 3, same 6,000 mAh rating, flat 6.78-inch display, 206 g, IP65.",
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: "oneplus-13",
      slug: "oneplus-13",
      name: "OnePlus 13",
      shortDesc: "Snapdragon 8 Elite, 6.82-inch QHD+ display, three 50MP rear cameras, IP68 and IP69.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "50MP 3x telephoto with OIS",
        "50W AIRVOOC wireless charging and 80W wired",
        "IP68 and IP69 ratings",
        "Up to 16GB RAM and 512GB storage",
      ],
      cons: ["Heavier at 210 to 213 g", "Thicker at 8.5 to 8.9 mm"],
      bestFor: "Buyers who want the stronger zoom camera, wireless charging and IP69",
    },
    {
      id: "oneplus-13r",
      slug: "oneplus-13r",
      name: "OnePlus 13R",
      shortDesc: "Snapdragon 8 Gen 3, flat 6.78-inch display, 6,000 mAh battery, IP65.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Same 6,000 mAh typical capacity",
        "206 g and 8.02 mm thick",
        "Flat display with Gorilla Glass 7i",
      ],
      cons: [
        "No wireless charging",
        "8MP ultra-wide camera",
        "IP65 rather than IP68",
      ],
      bestFor: "Buyers who want flagship-class speed and battery at a lower price point",
    },
  ],
  keyDifferences: [
    { label: "Chipset", entityAValue: "Snapdragon 8 Elite", entityBValue: "Snapdragon 8 Gen 3", winner: "tie" },
    { label: "Telephoto", entityAValue: "50MP 3x, OIS", entityBValue: "50MP 2x, EIS", winner: "tie" },
    { label: "Charging", entityAValue: "80W wired, 50W wireless", entityBValue: "55W wired", winner: "tie" },
    { label: "Water and dust", entityAValue: "IP68 and IP69", entityBValue: "IP65", winner: "tie" },
    { label: "Weight", entityAValue: "210 to 213 g", entityBValue: "206 g", winner: "tie" },
  ],
  attributes: [
    textAttr("a0", "Display", "Display", "oneplus-13", "oneplus-13r", "6.82-inch 3168 x 1440, 510 ppi, LTPO 4.1, 1-120Hz", "6.78-inch 2780 x 1264, 450 ppi, LTPO 4.1, 1-120Hz"),
    textAttr("a1", "Cover glass", "Design", "oneplus-13", "oneplus-13r", "Ceramic Guard", "Corning Gorilla Glass 7i"),
    textAttr("a2", "Size and weight", "Design", "oneplus-13", "oneplus-13r", "162.9 x 76.5 x 8.5 mm, 213 g (8.9 mm, 210 g Midnight Ocean)", "161.72 x 75.77 x 8.02 mm, 206 g"),
    textAttr("a3", "Water and dust", "Design", "oneplus-13", "oneplus-13r", "IP68 and IP69", "IP65"),
    textAttr("a4", "Chipset", "Performance", "oneplus-13", "oneplus-13r", "Snapdragon 8 Elite, Adreno 830", "Snapdragon 8 Gen 3, Adreno 750"),
    textAttr("a5", "Memory and storage", "Performance", "oneplus-13", "oneplus-13r", "12GB+256GB or 16GB+512GB", "12GB+256GB"),
    textAttr("a6", "Battery", "Battery", "oneplus-13", "oneplus-13r", "6,000 mAh typical (dual-cell, 22.92 Wh)", "6,000 mAh typical (single-cell, 23.58 Wh)"),
    textAttr("a7", "Charging", "Battery", "oneplus-13", "oneplus-13r", "80W SUPERVOOC (up to 100W), 50W AIRVOOC wireless", "55W SUPERVOOC (up to 80W)"),
    textAttr("a8", "Main camera", "Camera", "oneplus-13", "oneplus-13r", "50MP Sony LYT-808, f/1.6, OIS", "50MP Sony LYT-700, f/1.8, OIS"),
    textAttr("a9", "Telephoto", "Camera", "oneplus-13", "oneplus-13r", "50MP Sony LYT-600, 3x optical, OIS", "50MP, 2x optical, EIS"),
    textAttr("a10", "Ultra-wide", "Camera", "oneplus-13", "oneplus-13r", "50MP, 120 degrees", "8MP, 112 degrees"),
    textAttr("a11", "Front camera", "Camera", "oneplus-13", "oneplus-13r", "32MP", "16MP"),
    textAttr("a12", "Fingerprint and USB", "Other", "oneplus-13", "oneplus-13r", "Ultrasonic; USB 3.2 Gen 1", "Optical in-display; USB 2.0"),
    textAttr("a13", "Updates", "Software", "oneplus-13", "oneplus-13r", "Four Android upgrades, six years of security updates", "Four Android upgrades, six years of security updates"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "oneplus-15-vs-samsung-galaxy-s26-ultra-vs-samsung-galaxy-s25-ultra",
      title: "OnePlus 15 vs Galaxy S26 Ultra vs Galaxy S25 Ultra: Best for Battery?",
      category: "technology",
    },
    {
      slug: "galaxy-s25-vs-galaxy-s25-ultra",
      title: "Galaxy S25 vs Galaxy S25 Ultra: Camera and Long-Term Use",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "OnePlus 13 for the 3x telephoto, wireless charging and IP69. OnePlus 13R for the same battery rating in a lighter body at a lower price point.",
    keyFact:
      "Both are rated 6,000 mAh and get four Android upgrades and six years of security updates; only the OnePlus 13 lists wireless charging and IP69.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 28,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "OnePlus 13 specs", url: OP13_SPECS },
      { name: "OnePlus 13R specs", url: OP13R_SPECS },
      { name: "OnePlus press release: OnePlus 13 and OnePlus 13R in North America", url: PRESS },
      { name: "OnePlus: OS upgrade policy of the 13 series", url: OS_POLICY },
    ],
  },
  resources: [
    {
      type: "external",
      label: "OnePlus 13 specs",
      url: OP13_SPECS,
      description:
        "162.9 x 76.5 x 8.5 mm, 213 g (8.9 mm, 210 g Midnight Ocean). 6.82-inch 3168 x 1440, 510 ppi, 1600/4500 nits, LTPO 4.1, Ceramic Guard. Snapdragon 8 Elite, 12GB/16GB LPDDR5X, 256GB/512GB UFS 4.0. 6,000 mAh dual-cell. 80W SUPERVOOC, 50W AIRVOOC. 50MP LYT-808, 50MP LYT-600 3x, 50MP ultra-wide, 32MP front. Ultrasonic fingerprint, USB 3.2 Gen 1.",
    },
    {
      type: "external",
      label: "OnePlus 13R specs",
      url: OP13R_SPECS,
      description:
        "161.72 x 75.77 x 8.02 mm, 206 g. 6.78-inch 2780 x 1264, 450 ppi, 1600/4500 nits, LTPO 4.1, Gorilla Glass 7i. Snapdragon 8 Gen 3, 12GB LPDDR5X, 256GB UFS 4.0. 6,000 mAh single-cell. 55W SUPERVOOC. 50MP LYT-700, 50MP 2x telephoto, 8MP ultra-wide, 16MP front. Optical fingerprint, USB 2.0.",
    },
    {
      type: "external",
      label: "OnePlus press release: OnePlus 13 and OnePlus 13R in North America",
      url: PRESS,
      description:
        "7 January 2025. OnePlus 13: first OnePlus device rated IP68 and IP69; 50W wireless charging. OnePlus 13R: Gorilla Glass 7i front and rear, IP65, designed for a more affordable price point.",
    },
    {
      type: "external",
      label: "OnePlus: OS upgrade policy of the 13 series",
      url: OS_POLICY,
      description:
        "5 March 2025. The launch OS does not count as an upgrade; the OnePlus 13 series gets Android 16, 17, 18 and 19 and six years of security updates.",
    },
  ],
  metaTitle: "OnePlus 13 vs OnePlus 13R | A Versus B",
});

BUILT.metadata.metaDescription =
  "OnePlus 13 vs OnePlus 13R from OnePlus specs: Snapdragon 8 Elite vs 8 Gen 3, cameras, 6,000 mAh batteries, wireless charging, IP ratings and updates.";

export const ONEPLUS_13_VS_ONEPLUS_13R: EditorialComparison = BUILT;
