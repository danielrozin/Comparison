import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-156 — Galaxy S25 vs Galaxy S25+.
 * Figures read on 5 October 2026 from Samsung US Support ANS10004600,
 * the Samsung UK Galaxy S25 and S25+ hub, Samsung New Zealand specs,
 * Samsung US battery support ANS10013266, and the Samsung US newsroom
 * launch statement. No benchmark scores. No screen-on hours. No prices.
 * No page-level winner.
 * /entity/samsung-galaxy-s25 and /entity/samsung-galaxy-s25-plus were both
 * noindex, nofollow, so neither hub is linked.
 */

const S25 = "samsung-galaxy-s25";
const PLUS = "samsung-galaxy-s25-plus";

const US = "https://www.samsung.com/us/support/answer/ANS10004600/";
const UK = "https://www.samsung.com/uk/smartphones/galaxy-s25/";
const NZ = "https://www.samsung.com/nz/smartphones/galaxy-s25/specs/";
const BATTERY = "https://www.samsung.com/us/support/answer/ANS10013266/";
const UPDATES =
  "https://news.samsung.com/us/samsung-galaxy-s25-series-sets-standard-of-ai-phone-true-ai-companion-unpacked2025";

const SOURCE_DATE = "2026-10-05";
const PUBLISHED = "2026-10-05T00:00:00Z";

const SHORT_ANSWER =
  "Choose the Galaxy S25+ if battery is the main worry for 4 to 5 years of use: Samsung says it has a 4,900 mAh battery and 45W Super Fast Charging 2.0, against a 4,000 mAh battery and 25W Super Fast Charging on the Galaxy S25, plus a 6.7-inch QHD+ screen against a 6.2-inch FHD+ screen. Choose the Galaxy S25 for the compact phone and lighter use, because Samsung says both have a 50 MP wide camera, a 12 MP ultrawide camera, a 10 MP telephoto camera, and a 12 MP selfie camera, so the extra money buys battery, charging, and screen, not better photos. Neither is better for everyone; it depends on whether battery or a smaller phone matters more.";

const FAQS = [
  {
    question: "Is the Galaxy S25+ battery much better than the Galaxy S25?",
    answer:
      "Samsung says the Galaxy S25+ battery is 4,900 mAh and the Galaxy S25 battery is 4,000 mAh. Wired charging is 45W Super Fast Charging 2.0 on the Galaxy S25+ and 25W Super Fast Charging on the Galaxy S25. Samsung says both support Fast Wireless Charging 2.0 and Wireless PowerShare. The Galaxy S25+ starts with more capacity and faster wired charging. That is the battery gap. It is not a measured runtime.",
  },
  {
    question: "Do the Galaxy S25 and Galaxy S25+ have the same cameras?",
    answer:
      "Yes. Samsung says both have a 12 MP ultrawide camera, a 50 MP wide camera, a 10 MP telephoto camera, and a 12 MP selfie camera. Samsung New Zealand gives that setup as a 50 MP main camera at F1.8, a 10 MP telephoto camera at F2.4, a 12 MP ultrawide camera at F2.2, and a 12 MP front camera at F2.2. The extra money buys battery, charging, and screen, not a different camera set.",
  },
  {
    question: "Is the Galaxy S25 enough for light use?",
    answer:
      "Yes, if you want the smaller phone. Samsung says the Galaxy S25 is a 6.2-inch FHD+ Dynamic AMOLED 2X display with a 120 Hz adaptive refresh rate, a 4,000 mAh battery, and the same cameras as the Galaxy S25+. Samsung New Zealand gives its size as 146.9 x 70.5 x 7.2 mm and 162 g. Choose the Galaxy S25+ if battery is the main worry.",
  },
  {
    question: "Which screen is better, the Galaxy S25 or the Galaxy S25+?",
    answer:
      "Samsung says the Galaxy S25+ is a 6.7-inch QHD+ screen and the Galaxy S25 is a 6.2-inch FHD+ screen. Both are Dynamic AMOLED 2X displays with a 120 Hz adaptive refresh rate. Samsung New Zealand measures the Galaxy S25+ as 6.7 inches in the full rectangle and 6.5 inches with the rounded corners, at 3120 x 1440. The Galaxy S25 is 6.2 inches in the full rectangle and 6 inches with the rounded corners, at 2340 x 1080. The Galaxy S25+ is the larger screen and the higher resolution. The Galaxy S25 is the smaller phone.",
  },
  {
    question: "Will the battery last 4 to 5 years?",
    answer:
      "Wear happens on both. Samsung says a Galaxy battery is a consumable component that naturally degrades over time. The 4,900 mAh battery starts with more capacity than the 4,000 mAh battery, which is more headroom as the battery ages. That is not a promise that either battery stays strong for 4 to 5 years. A Samsung service center can inspect the battery, and replacement may be covered under warranty or may be paid service. Software support is separate. Samsung's US newsroom says the Galaxy S25 series will be supported with seven generations of OS upgrades and seven years of security updates from the global launch date. Check Samsung's current update policy for the market you buy in.",
  },
  {
    question: "Should I get the Galaxy S25 FE instead?",
    answer:
      "Samsung says the Galaxy S25 FE also has a 4,900 mAh battery and 45W Super Fast Charging 2.0, with a 6.7-inch FHD+ screen. The Galaxy S25+ screen is 6.7-inch QHD+. The FE telephoto is 8 MP. The Galaxy S25 and Galaxy S25+ telephoto is 10 MP. Choose the Galaxy S25+ for QHD+ with the larger battery capacity. Choose the FE when a 6.7-inch FHD+ phone is enough. Galaxy S25 vs Galaxy S25 FE covers that pair.",
  },
];

const VERDICT = `Best battery, charging, and screen: Galaxy S25+. 4,900 mAh, 45W Super Fast Charging 2.0, and a 6.7-inch QHD+ display.

Best compact phone: Galaxy S25. 4,000 mAh, 25W Super Fast Charging, and a 6.2-inch FHD+ display. Same cameras.

Neither is better for everyone; it depends on whether battery or a smaller phone matters more.`;

const EXPERT_ANALYSIS = `Choose the Galaxy S25+ if battery is the main worry for 4 to 5 years of use: Samsung says it has a 4,900 mAh battery and 45W Super Fast Charging 2.0, against a 4,000 mAh battery and 25W Super Fast Charging on the Galaxy S25, plus a 6.7-inch QHD+ screen against a 6.2-inch FHD+ screen. Choose the Galaxy S25 for the compact phone and lighter use, because Samsung says both have a 50 MP wide camera, a 12 MP ultrawide camera, a 10 MP telephoto camera, and a 12 MP selfie camera, so the extra money buys battery, charging, and screen, not better photos. Neither is better for everyone; it depends on whether battery or a smaller phone matters more.

Display

Samsung says the Galaxy S25 series uses Dynamic AMOLED 2X displays with a 120 Hz adaptive refresh rate. The Galaxy S25 is a 6.2-inch FHD+ screen. The Galaxy S25+ is a 6.7-inch QHD+ screen. Samsung New Zealand measures the Galaxy S25 as 6.2 inches in the full rectangle and 6 inches with the rounded corners, at 2340 x 1080. The Galaxy S25+ is 6.7 inches in the full rectangle and 6.5 inches with the rounded corners, at 3120 x 1440. Samsung New Zealand also gives the body size: the Galaxy S25 is 146.9 x 70.5 x 7.2 mm and 162 g, and the Galaxy S25+ is 158.4 x 75.8 x 7.3 mm and 190 g.

Battery, charging, and 4 to 5 years

Samsung says the Galaxy S25 battery is 4,000 mAh and the Galaxy S25+ battery is 4,900 mAh. Wired charging is 25W Super Fast Charging on the Galaxy S25 and 45W Super Fast Charging 2.0 on the Galaxy S25+. Samsung says both support Fast Wireless Charging 2.0 and Wireless PowerShare.

The larger battery gives more headroom as the battery ages, because 4,900 mAh starts higher than 4,000 mAh. Wear happens on both. Samsung says a Galaxy battery is a consumable component that naturally degrades over time. A Samsung service center can inspect it, and replacement may be covered under warranty or may be paid service. That is not a claim that either battery lasts 4 to 5 years.

Software support is a separate question. Samsung's US newsroom says the Galaxy S25 series will be supported with seven generations of OS upgrades and seven years of security updates from the global launch date. Check Samsung's current update policy for the market you buy in. Those seven years are OS and security updates, not a battery lifespan.

Cameras

Samsung says the Galaxy S25 and Galaxy S25+ have the same cameras: a 12 MP ultrawide camera, a 50 MP wide camera, a 10 MP telephoto camera, and a 12 MP selfie camera. Samsung New Zealand gives the apertures as F2.2 ultrawide, F1.8 main, F2.4 telephoto, and F2.2 on the front camera. The extra money does not buy a different camera set.

Chip, by region

In the UK, Samsung says the Galaxy S25 and Galaxy S25+ both feature its custom-made processor, and names Snapdragon 8 Elite for Galaxy. Samsung New Zealand says both phones are equipped with a Snapdragon 8 Elite chipset. Those are the names Samsung uses in those regions. They are not one shared label.

Storage, by region

In the US, Samsung offers the Galaxy S25 in 128GB or 256GB, and the Galaxy S25+ in 128GB and 256GB. In the UK, Samsung offers the Galaxy S25 with 12 GB of memory and up to 128 GB, 256 GB, or 512 GB of storage, and the Galaxy S25+ in 256 GB or 512 GB. Samsung New Zealand offers the Galaxy S25+ in 256GB and 512GB, shows the Galaxy S25 in 256GB and 512GB, and says the Galaxy S25 has 12GB of RAM. That 12 GB figure is stated for the Galaxy S25, not for the Galaxy S25+.

Who should buy which

Buy the Galaxy S25+ if battery is the main worry for years of use, and you want the 6.7-inch QHD+ screen with 45W Super Fast Charging 2.0. Buy the Galaxy S25 for the compact phone and lighter use. Buy the Galaxy S25 FE instead if a 6.7-inch FHD+ phone with a 4,900 mAh battery is enough, and you can accept the 8 MP telephoto. Galaxy S25 vs Galaxy S25 FE covers that pair. Galaxy S24 Ultra vs Galaxy S25 Ultra covers the 6.9-inch QHD+ Ultra.`;

const SPEC = "Specs";

export const GALAXY_S25_VS_GALAXY_S25_PLUS: EditorialComparison = buildEditorialComparison({
  slug: "galaxy-s25-vs-galaxy-s25-plus",
  title: "Galaxy S25 vs Galaxy S25 Plus: Battery for Years of Use",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: S25,
      slug: S25,
      name: "Galaxy S25",
      shortDesc: "6.2-inch FHD+ phone with a 4,000 mAh battery and 25W Super Fast Charging.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "6.2-inch FHD+ Dynamic AMOLED 2X at 120 Hz adaptive (Samsung)",
        "Same cameras as the Galaxy S25+: 50 MP wide, 12 MP ultrawide, 10 MP telephoto, 12 MP selfie (Samsung)",
        "Samsung New Zealand: 146.9 x 70.5 x 7.2 mm, 162 g",
        "UK: Snapdragon 8 Elite for Galaxy. NZ: Snapdragon 8 Elite chipset (Samsung)",
      ],
      cons: [
        "4,000 mAh, against 4,900 mAh on the Galaxy S25+",
        "25W Super Fast Charging, against 45W Super Fast Charging 2.0 on the Galaxy S25+",
        "6.2-inch FHD+, against a 6.7-inch QHD+ screen on the Galaxy S25+",
      ],
      bestFor: "Best for the compact phone and lighter use",
    },
    {
      id: PLUS,
      slug: PLUS,
      name: "Galaxy S25+",
      shortDesc: "6.7-inch QHD+ phone with a 4,900 mAh battery and 45W Super Fast Charging 2.0.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "4,900 mAh battery (Samsung)",
        "45W Super Fast Charging 2.0 (Samsung)",
        "6.7-inch QHD+ Dynamic AMOLED 2X at 120 Hz adaptive (Samsung)",
        "Same cameras as the Galaxy S25 (Samsung)",
      ],
      cons: [
        "Larger and heavier: Samsung New Zealand says 158.4 x 75.8 x 7.3 mm and 190 g",
        "In the US, Samsung offers 128GB and 256GB",
        "Wear still happens as the battery ages",
      ],
      bestFor: "Best if battery, charging, and the larger screen are the main worry",
    },
  ],
  keyDifferences: [
    {
      label: "Battery",
      entityAValue: "4,000 mAh",
      entityBValue: "4,900 mAh",
      winner: "b",
    },
    {
      label: "Wired charging",
      entityAValue: "25W Super Fast Charging",
      entityBValue: "45W Super Fast Charging 2.0",
      winner: "b",
    },
    {
      label: "Screen",
      entityAValue: "6.2-inch FHD+, 120 Hz adaptive",
      entityBValue: "6.7-inch QHD+, 120 Hz adaptive",
      winner: "tie",
    },
    {
      label: "Cameras",
      entityAValue: "50 MP wide, 12 MP ultrawide, 10 MP telephoto, 12 MP selfie",
      entityBValue: "50 MP wide, 12 MP ultrawide, 10 MP telephoto, 12 MP selfie",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "display",
      "Display",
      SPEC,
      S25,
      PLUS,
      "6.2-inch FHD+ Dynamic AMOLED 2X, 120 Hz adaptive. NZ: 6.2 inches full rectangle, 6 inches with rounded corners, 2340 x 1080",
      "6.7-inch QHD+ Dynamic AMOLED 2X, 120 Hz adaptive. NZ: 6.7 inches full rectangle, 6.5 inches with rounded corners, 3120 x 1440"
    ),
    textAttr(
      "size",
      "Size and weight",
      SPEC,
      S25,
      PLUS,
      "Samsung New Zealand: 146.9 x 70.5 x 7.2 mm (height x width x depth), 162 g",
      "Samsung New Zealand: 158.4 x 75.8 x 7.3 mm (height x width x depth), 190 g"
    ),
    textAttr(
      "cameras",
      "Cameras",
      SPEC,
      S25,
      PLUS,
      "12 MP ultrawide, 50 MP wide, 10 MP telephoto, 12 MP selfie. NZ: F2.2, F1.8, F2.4, front F2.2",
      "12 MP ultrawide, 50 MP wide, 10 MP telephoto, 12 MP selfie. NZ: F2.2, F1.8, F2.4, front F2.2"
    ),
    textAttr(
      "battery",
      "Battery",
      SPEC,
      S25,
      PLUS,
      "4,000 mAh",
      "4,900 mAh",
      "b"
    ),
    textAttr(
      "charging",
      "Charging",
      SPEC,
      S25,
      PLUS,
      "25W Super Fast Charging via a wired connection. Fast Wireless Charging 2.0 and Wireless PowerShare",
      "45W Super Fast Charging 2.0. Fast Wireless Charging 2.0 and Wireless PowerShare",
      "b"
    ),
    textAttr(
      "chip",
      "Chip",
      SPEC,
      S25,
      PLUS,
      "UK: Snapdragon 8 Elite for Galaxy, with the Galaxy S25+. NZ: Snapdragon 8 Elite chipset, with the Galaxy S25+",
      "UK: Snapdragon 8 Elite for Galaxy, with the Galaxy S25. NZ: Snapdragon 8 Elite chipset, with the Galaxy S25"
    ),
    textAttr(
      "storage",
      "Storage",
      SPEC,
      S25,
      PLUS,
      "US: 128GB or 256GB. UK: 12 GB of memory and up to 128 GB, 256 GB, or 512 GB. NZ: 256GB and 512GB, and 12GB of RAM on the Galaxy S25",
      "US: 128GB and 256GB. UK: 256 GB or 512 GB. NZ: 256GB and 512GB"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "galaxy-s25-vs-galaxy-s25-fe",
      title: "Galaxy S25 vs Galaxy S25 FE: Camera and Daily Use",
      category: "technology",
    },
    {
      slug: "samsung-galaxy-s24-ultra-vs-samsung-galaxy-s25-ultra",
      title: "Samsung Galaxy S24 Ultra vs Samsung Galaxy S25 Ultra: Which Should You Buy?",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Galaxy S25+ for the 4,900 mAh battery, 45W Super Fast Charging 2.0, and the 6.7-inch QHD+ screen. Galaxy S25 for the compact phone, with the same cameras.",
    keyFact:
      "Samsung says both phones have a 50 MP wide camera, a 12 MP ultrawide camera, a 10 MP telephoto camera, and a 12 MP selfie camera. The battery is 4,000 mAh on the Galaxy S25 and 4,900 mAh on the Galaxy S25+.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 12,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Samsung US Support Galaxy S25 series", url: US },
      { name: "Samsung UK Galaxy S25 and Galaxy S25+", url: UK },
      { name: "Samsung New Zealand Galaxy S25 and Galaxy S25+", url: NZ },
      { name: "Samsung US Support Galaxy battery replacement", url: BATTERY },
      { name: "Samsung US Newsroom Galaxy S25 series", url: UPDATES },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Samsung US Support Galaxy S25 series",
      url: US,
      description:
        "S25 6.2-inch FHD+ and 4,000 mAh with 25W Super Fast Charging. S25+ 6.7-inch QHD+ and 4,900 mAh with 45W Super Fast Charging 2.0. Same cameras. US storage 128GB or 256GB on the S25, and 128GB and 256GB on the S25+. Dynamic AMOLED 2X, 120 Hz adaptive. Fast Wireless Charging 2.0 and Wireless PowerShare.",
    },
    {
      type: "external",
      label: "Samsung UK Galaxy S25 and Galaxy S25+",
      url: UK,
      description:
        "Both feature the custom-made processor, Snapdragon 8 Elite for Galaxy. S25 storage up to 128 GB, 256 GB, or 512 GB with 12 GB of memory. S25+ storage 256 GB or 512 GB.",
    },
    {
      type: "external",
      label: "Samsung New Zealand Galaxy S25 and Galaxy S25+",
      url: NZ,
      description:
        "S25 146.9 x 70.5 x 7.2 mm and 162 g. S25+ 158.4 x 75.8 x 7.3 mm and 190 g. Snapdragon 8 Elite chipset on both. S25+ storage 256GB and 512GB. S25 has 12GB of RAM.",
    },
    {
      type: "external",
      label: "Samsung US Support Galaxy battery replacement",
      url: BATTERY,
      description:
        "A Galaxy battery is a consumable component that naturally degrades. A Samsung service center can inspect it. Replacement may be covered under warranty or may be paid service.",
    },
    {
      type: "external",
      label: "Samsung US Newsroom Galaxy S25 series",
      url: UPDATES,
      description:
        "Seven generations of OS upgrades and seven years of security updates from the global launch date for the Galaxy S25 series.",
    },
  ],
  metaTitle: "Galaxy S25 vs S25 Plus | A Versus B",
});
