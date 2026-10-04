import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-148 — Galaxy Z Flip8 vs Galaxy S26 Ultra.
 * Figures read on 4 October 2026 from Samsung US Flip8 and S26 Ultra,
 * the UK pages for those phones, and Samsung Australia's Flip8 buying guide.
 * No page-level winner. No benchmark scores.
 * /entity/galaxy-z-flip-8 and /entity/samsung-galaxy-s26-ultra were both
 * noindex, nofollow, so neither hub is linked.
 */

const FLIP = "galaxy-z-flip-8";
const ULTRA = "samsung-galaxy-s26-ultra";

const FLIP_US = "https://www.samsung.com/us/smartphones/galaxy-z-flip8/";
const FLIP_UK = "https://www.samsung.com/uk/smartphones/galaxy-z-flip8/";
const FLIP_AU = "https://www.samsung.com/au/mobile/buying-guide/galaxy-z-flip8-features-specs/";
const ULTRA_US = "https://www.samsung.com/us/smartphones/galaxy-s26-ultra/";
const ULTRA_UK = "https://www.samsung.com/uk/smartphones/galaxy-s26-ultra/";

const SOURCE_DATE = "2026-10-04";
const PUBLISHED = "2026-10-04T00:00:00Z";

const SHORT_ANSWER =
  "Choose the Galaxy Z Flip8 if you are leaving a large Ultra and want a lighter phone that folds: Samsung says it is 180 grams and 6.1 mm when unfolded. Choose the Galaxy S26 Ultra if you want the slab: Samsung says it is 214 grams, with a 6.9-inch display, a 200 MP wide camera, and a 5000 mAh typical battery. Both are rated for up to 31 hours of video playback. Neither is better for everyone; it depends on whether you want a folding phone or the Ultra slab.";

const FAQS = [
  {
    question: "How does the battery compare if I leave an Ultra for the Flip8?",
    answer:
      "Samsung rates both phones for up to 31 hours of video playback, so that video figure does not pick a winner. The capacity is different. Samsung says the Galaxy S26 Ultra typical battery is 5000 mAh. Samsung says the Galaxy Z Flip8 typical battery is 4300 mAh, with a rated capacity of 4174 mAh. Charging is different too. On the Galaxy S26 Ultra, Samsung says: \"With Super Fast Charging 3.0 the increased power from 45 W to 60 W allows you to charge your device up to 75% in around 30 minutes.\" Samsung says the Galaxy Z Flip8 supports 25W wired fast charging, plus wireless charging and reverse wireless charging.",
  },
  {
    question: "Which is lighter, Galaxy Z Flip8 or Galaxy S26 Ultra?",
    answer:
      "Galaxy Z Flip8. Samsung says it is 180 grams, and 6.1 mm when unfolded. Folded, Samsung says it measures 13.1 mm. Samsung says that thickness is measured from top to bottom of the glass at the thinnest point. Galaxy S26 Ultra is 214 grams and 7.9 mm. The Flip8 is lighter. It is thinner when it is open, and thicker than the Ultra when it is closed.",
  },
  {
    question: "Which camera is better, Flip8 or S26 Ultra?",
    answer:
      "Samsung does not give a lab photo score for this pair. The hardware is different. Samsung says Galaxy Z Flip8 has a 50 MP wide camera, a 12 MP ultrawide camera, and a 10 MP front camera. Samsung says Galaxy S26 Ultra has a 200 MP F1.4 wide camera with 2x optical quality zoom, a 50 MP F1.9 ultrawide camera, a 50 MP F2.9 telephoto with 5x optical zoom and 10x optical quality zoom, a 10 MP F2.4 telephoto with 3x optical zoom, and a 12 MP F2.2 selfie camera.",
  },
  {
    question: "What is the trade-off between Ultra corners and the Flip hinge?",
    answer:
      "Samsung says the Galaxy S26 Ultra has a refined Armor Aluminum frame that includes rounded ergonomic corners. It stays one flat slab, 7.9 mm thick and 214 grams. Galaxy Z Flip8 folds. Samsung says refinements to the hinge structure reduce the visible crease. Folded it is 13.1 mm, and unfolded it is 6.1 mm and 180 grams. The trade-off is a hinge and a crease on a lighter phone, against a heavier slab whose frame Samsung describes with rounded corners.",
  },
  {
    question: "Should I get the Galaxy Z Flip8 or the Galaxy Z Fold instead?",
    answer:
      "They are different foldables. Galaxy Z Flip8 is the clamshell: 180 grams, 6.1 mm unfolded, and a cover screen Samsung measures at 4.1 inches in the full rectangle and 4.0 inches with the rounded corners. Galaxy Z Fold 7 is the book-style foldable. Galaxy Z Fold 7 vs Galaxy S26 Ultra covers that phone against this slab. Leaving an Ultra for a Flip is the lighter, smaller fold. Leaving an Ultra for a Fold is the larger inner screen.",
  },
];

const VERDICT = `Best if you want a lighter phone that folds: Galaxy Z Flip8. 180 grams, 6.1 mm unfolded, a 4300 mAh typical battery, and 25W wired charging plus wireless and reverse wireless charging.

Best if you want the slab: Galaxy S26 Ultra. 214 grams, 7.9 mm, a 6.9-inch display, a 200 MP wide camera, a 5000 mAh typical battery, and Super Fast Charging 3.0.

Neither is better for everyone; it depends on whether you want a folding phone or the Ultra slab. Both are rated for up to 31 hours of video playback.`;

const EXPERT_ANALYSIS = `Choose the Galaxy Z Flip8 if you are leaving a large Ultra and want a lighter phone that folds: Samsung says it is 180 grams and 6.1 mm when unfolded. Choose the Galaxy S26 Ultra if you want the slab: Samsung says it is 214 grams, with a 6.9-inch display, a 200 MP wide camera, and a 5000 mAh typical battery. Neither is better for everyone; it depends on whether you want a folding phone or the Ultra slab.

What each one is

Galaxy Z Flip8 folds in half. Samsung calls it the lightest and thinnest Flip, at 180 grams and 6.1 mm when unfolded. Folded, Samsung says it measures 13.1 mm, measured from top to bottom of the glass at the thinnest point. The cover screen is 4.1 inches in the full rectangle and 4.0 inches with the rounded corners. The main screen is 6.9 inches in the full rectangle and 6.8 inches with the rounded corners.

Galaxy S26 Ultra is a slab. Samsung says it has a 6.9-inch display, is 7.9 mm thick, and weighs 214 grams. Samsung also lists a built-in Privacy Display and a refined Armor Aluminum frame with rounded ergonomic corners.

Chip, by region

On the US Galaxy Z Flip8 phone, Samsung says it is powered by Snapdragon 8 Elite Gen 5 for Galaxy. On the UK Galaxy Z Flip8 phone, Samsung says Exynos 2600 for Galaxy. Samsung also says the Exynos 2600, built on a 2nm process, is used in select markets, and the Snapdragon 8 Elite Gen 5 for Galaxy in others. Both Flip8 storage options, 256GB and 512GB, come with 12GB of memory. Samsung says Galaxy Z Flip8 does not include SD card support.

On the US and UK Galaxy S26 Ultra phones, Samsung says Snapdragon 8 Elite Gen 5 for Galaxy. Storage is 256GB with 12GB of memory, 512GB with 12GB of memory, or 1TB with 16GB of memory.

Battery and charging

Samsung rates both phones for up to 31 hours of video playback. Galaxy S26 Ultra's typical battery is 5000 mAh. Galaxy Z Flip8's typical battery is 4300 mAh, and Samsung gives a rated capacity of 4174 mAh under the IEC 61960 standard. The hour rating matches. The capacity does not.

Samsung's charging line for the Galaxy S26 Ultra is: "With Super Fast Charging 3.0 the increased power from 45 W to 60 W allows you to charge your device up to 75% in around 30 minutes." Samsung also says up to 75% charge in around 30 minutes. Samsung says Galaxy Z Flip8 supports 25W wired fast charging, while wireless charging and reverse wireless charging are also supported. A Super Fast charger is sold separately for that wired charge.

Cameras

Samsung says Galaxy Z Flip8 has a 50 MP wide camera, a 12 MP ultrawide camera, and a 10 MP front camera. Samsung also calls the wide camera a 50 MP FlexCam, with 2x optical quality zoom on the US phone.

Samsung says Galaxy S26 Ultra has a 200 MP F1.4 wide camera with 2x optical quality zoom, a 50 MP F1.9 ultrawide camera, a 50 MP F2.9 telephoto with 5x optical zoom and 10x optical quality zoom, a 10 MP F2.4 telephoto with 3x optical zoom, and a 12 MP F2.2 selfie camera. No lab photo score is stated for either phone.

Water rating

Samsung gives Galaxy Z Flip8 an IP48 rating. Samsung's lab note for that rating is submersion in up to 1.5 meters of freshwater for up to 30 minutes, and protection against a solid object greater than 1 mm. Samsung says it is not advised for beach or pool use. Samsung gives Galaxy S26 Ultra an IP68 rating and says that rating provides water and dust resistance against accidental spills and everyday mishaps.

Who should buy which

Buy the Galaxy Z Flip8 if the reason for leaving an Ultra is weight and a phone that folds into a pocket, and you can live with a 4300 mAh typical battery, a hinge, and the cameras Samsung lists above. Buy the Galaxy S26 Ultra if you still want the slab: the 200 MP wide camera, the telephoto cameras, the 5000 mAh typical battery, and Super Fast Charging 3.0. For a book-style foldable instead of this clamshell, see Galaxy Z Fold 7 vs Galaxy S26 Ultra.`;

const SPEC = "Specs";

export const GALAXY_Z_FLIP_8_VS_S26_ULTRA: EditorialComparison = buildEditorialComparison({
  slug: "galaxy-z-flip-8-vs-galaxy-s26-ultra",
  title: "Galaxy Z Flip8 vs Galaxy S26 Ultra: Flip or Slab?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: FLIP,
      slug: FLIP,
      name: "Galaxy Z Flip8",
      shortDesc: "Foldable phone at 180 grams and 6.1 mm unfolded, with a 4300 mAh typical battery.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "180 grams and 6.1 mm when unfolded (Samsung)",
        "4300 mAh typical battery, rated up to 31 hours of video playback (Samsung)",
        "25W wired fast charging, plus wireless and reverse wireless charging (Samsung)",
        "50 MP wide, 12 MP ultrawide, and 10 MP front camera (Samsung)",
      ],
      cons: [
        "13.1 mm when folded (Samsung)",
        "4300 mAh typical battery, against 5000 mAh on the Galaxy S26 Ultra",
        "A hinge. Samsung says refinements to the hinge structure reduce the visible crease",
      ],
      bestFor: "Best if you want a lighter phone that folds",
    },
    {
      id: ULTRA,
      slug: ULTRA,
      name: "Galaxy S26 Ultra",
      shortDesc: "Slab phone at 214 grams and 7.9 mm, with a 200 MP wide camera and a 5000 mAh typical battery.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "200 MP wide camera plus ultrawide and two telephoto cameras (Samsung)",
        "5000 mAh typical battery, rated up to 31 hours of video playback (Samsung)",
        "Super Fast Charging 3.0, from 45 W to 60 W, up to 75% in around 30 minutes (Samsung)",
        "Armor Aluminum frame with rounded ergonomic corners (Samsung)",
      ],
      cons: [
        "214 grams and 7.9 mm, against 180 grams on the Galaxy Z Flip8",
        "A slab, so it does not fold in half",
      ],
      bestFor: "Best if you want the Ultra slab and its cameras",
    },
  ],
  keyDifferences: [
    {
      label: "Shape",
      entityAValue: "Folds. 6.1 mm unfolded, 13.1 mm folded",
      entityBValue: "Slab, 7.9 mm",
      winner: "tie",
    },
    {
      label: "Weight",
      entityAValue: "180 grams",
      entityBValue: "214 grams",
      winner: "a",
    },
    {
      label: "Battery",
      entityAValue: "4300 mAh typical. Up to 31 hours of video",
      entityBValue: "5000 mAh typical. Up to 31 hours of video",
      winner: "tie",
    },
    {
      label: "Wide camera",
      entityAValue: "50 MP",
      entityBValue: "200 MP",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "weight",
      "Weight and thickness",
      SPEC,
      FLIP,
      ULTRA,
      "180 grams. 6.1 mm unfolded. 13.1 mm folded",
      "214 grams. 7.9 mm"
    ),
    textAttr(
      "display",
      "Display",
      SPEC,
      FLIP,
      ULTRA,
      "Cover: 4.1 inches full rectangle, 4.0 inches with rounded corners. Main: 6.9 inches full rectangle, 6.8 inches with rounded corners",
      "6.9-inch display. Samsung also lists a built-in Privacy Display"
    ),
    textAttr(
      "battery",
      "Battery",
      SPEC,
      FLIP,
      ULTRA,
      "4300 mAh typical. Rated capacity 4174 mAh. Up to 31 hours of video playback",
      "5000 mAh typical. Up to 31 hours of video playback"
    ),
    textAttr(
      "charging",
      "Charging",
      SPEC,
      FLIP,
      ULTRA,
      "25W wired fast charging. Wireless charging and reverse wireless charging",
      "Super Fast Charging 3.0: increased power from 45 W to 60 W, up to 75% in around 30 minutes"
    ),
    textAttr(
      "cameras",
      "Cameras",
      SPEC,
      FLIP,
      ULTRA,
      "50 MP wide, 12 MP ultrawide, 10 MP front",
      "200 MP F1.4 wide, 50 MP F1.9 ultrawide, 50 MP F2.9 telephoto (5x optical), 10 MP F2.4 telephoto (3x optical), 12 MP F2.2 selfie"
    ),
    textAttr(
      "chip",
      "Chip",
      SPEC,
      FLIP,
      ULTRA,
      "US: Snapdragon 8 Elite Gen 5 for Galaxy. UK: Exynos 2600 for Galaxy. Samsung also says Exynos 2600 in select markets and Snapdragon 8 Elite Gen 5 for Galaxy in others",
      "US and UK: Snapdragon 8 Elite Gen 5 for Galaxy"
    ),
    textAttr(
      "memory",
      "Memory and storage",
      SPEC,
      FLIP,
      ULTRA,
      "12GB with 256GB or 512GB. Samsung says it does not include SD card support",
      "256GB with 12GB, 512GB with 12GB, or 1TB with 16GB"
    ),
    textAttr(
      "water",
      "Water and dust rating",
      SPEC,
      FLIP,
      ULTRA,
      "IP48. Lab note: up to 1.5 meters of freshwater for up to 30 minutes. Not advised for beach or pool use",
      "IP68. Samsung says water and dust resistance against accidental spills and everyday mishaps"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "galaxy-z-fold-7-vs-samsung-galaxy-s26-ultra",
      title: "Galaxy Z Fold 7 vs Galaxy S26 Ultra: Which Should You Keep?",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Galaxy Z Flip8 for a lighter phone that folds. Galaxy S26 Ultra for the slab, the 200 MP wide camera, and the 5000 mAh typical battery.",
    keyFact:
      "Samsung says Galaxy Z Flip8 is 180 grams and 6.1 mm unfolded, with a 4300 mAh typical battery. Samsung says Galaxy S26 Ultra is 214 grams and 7.9 mm, with a 5000 mAh typical battery. Both are rated for up to 31 hours of video playback.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 8,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Samsung US — Galaxy Z Flip8", url: FLIP_US },
      { name: "Samsung UK — Galaxy Z Flip8", url: FLIP_UK },
      { name: "Samsung Australia — Galaxy Z Flip8 buying guide", url: FLIP_AU },
      { name: "Samsung US — Galaxy S26 Ultra", url: ULTRA_US },
      { name: "Samsung UK — Galaxy S26 Ultra", url: ULTRA_UK },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Samsung US Galaxy Z Flip8",
      url: FLIP_US,
      description:
        "180 grams. 6.1 mm unfolded. 4300 mAh typical battery, rated capacity 4174 mAh. Up to 31 hours of video playback. Snapdragon 8 Elite Gen 5 for Galaxy. 50 MP wide, 12 MP ultrawide, 10 MP front camera.",
    },
    {
      type: "external",
      label: "Samsung UK Galaxy Z Flip8",
      url: FLIP_UK,
      description:
        "Exynos 2600 for Galaxy. 180 grams and 6.1 mm when unfolded. Up to 31 hours of video playback.",
    },
    {
      type: "external",
      label: "Samsung Australia Galaxy Z Flip8 buying guide",
      url: FLIP_AU,
      description:
        "Exynos 2600 in select markets and Snapdragon 8 Elite Gen 5 for Galaxy in others. 25W wired fast charging, wireless charging, and reverse wireless charging. Folded 13.1 mm. IP48 lab note.",
    },
    {
      type: "external",
      label: "Samsung US Galaxy S26 Ultra",
      url: ULTRA_US,
      description:
        "6.9-inch display, 7.9 mm, 214 grams. 5000 mAh typical battery. Up to 31 hours of video playback. 200 MP wide camera. Snapdragon 8 Elite Gen 5 for Galaxy.",
    },
    {
      type: "external",
      label: "Samsung UK Galaxy S26 Ultra",
      url: ULTRA_UK,
      description:
        "Snapdragon 8 Elite Gen 5 for Galaxy. Super Fast Charging 3.0, increased power from 45 W to 60 W, up to 75% in around 30 minutes.",
    },
  ],
  metaTitle: "Galaxy Z Flip8 vs S26 Ultra | A Versus B",
});
