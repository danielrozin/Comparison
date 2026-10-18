import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-226 — Galaxy S25 vs Galaxy S25 Ultra, for camera and long-term use.
 * Figures read on 18 October 2026 from Samsung US Support ANS10004600,
 * the Samsung US Galaxy S25 and Galaxy S25 Ultra pages, Samsung New Zealand
 * specs, Samsung US battery support ANS10013266, and the Samsung US
 * newsroom launch statement. No benchmark scores. No camera scores.
 * No street prices. No page-level winner.
 */

const S25 = "samsung-galaxy-s25";
const ULTRA = "samsung-galaxy-s25-ultra";

const US_SERIES = "https://www.samsung.com/us/support/answer/ANS10004600/";
const US_S25 = "https://www.samsung.com/us/smartphones/galaxy-s25/";
const US_ULTRA = "https://www.samsung.com/us/smartphones/galaxy-s25-ultra/";
const NZ_S25 = "https://www.samsung.com/nz/smartphones/galaxy-s25/specs/";
const NZ_ULTRA = "https://www.samsung.com/nz/smartphones/galaxy-s25-ultra/specs/";
const BATTERY = "https://www.samsung.com/us/support/answer/ANS10013266/";
const UPDATES =
  "https://news.samsung.com/us/samsung-galaxy-s25-series-sets-standard-of-ai-phone-true-ai-companion-unpacked2025";

const SOURCE_DATE = "2026-10-18";
const PUBLISHED = "2026-10-18T00:00:00Z";

const SHORT_ANSWER =
  "Choose the Galaxy S25 Ultra if photography, and zoom in particular, is the main reason to upgrade: Samsung lists a 200 MP wide camera, a 50 MP ultrawide camera, a 50 MP telephoto camera with 5x optical zoom and a 10 MP telephoto camera with 3x optical zoom, plus a 5,000 mAh battery rated for up to 31 hours of video playback. Choose the Galaxy S25 for a smaller, lighter phone: Samsung lists a 50 MP wide camera, a 12 MP ultrawide camera and a 10 MP telephoto camera with 3x optical zoom, a 4,000 mAh battery rated for up to 29 hours of video playback, and 162 g against 218 g. Neither is better for everyone; it depends on whether the Ultra cameras and battery are worth a bigger phone and a higher price.";

const FAQS = [
  {
    question: "Is the Galaxy S25 Ultra worth it over the Galaxy S25?",
    answer:
      "It is if zoom photography and a bigger battery matter most. Samsung lists a 200 MP wide camera, a 50 MP ultrawide camera, a 50 MP telephoto camera with 5x optical zoom and a 10 MP telephoto camera with 3x optical zoom on the Galaxy S25 Ultra, plus a 5,000 mAh battery and an S Pen. The Galaxy S25 has a 50 MP wide camera, a 12 MP ultrawide camera, a 10 MP telephoto camera with 3x optical zoom and a 4,000 mAh battery, in a 162 g body against 218 g. Choose the Galaxy S25 if a compact phone matters more than the extra cameras.",
  },
  {
    question: "Which has the better camera, the Galaxy S25 or the Galaxy S25 Ultra?",
    answer:
      "The Galaxy S25 Ultra has the larger camera system. Samsung lists a 200 MP wide camera, a 50 MP ultrawide camera, a 50 MP telephoto camera with 5x optical zoom and 10x optical quality zoom, and a 10 MP telephoto camera with 3x optical zoom, with Space Zoom up to 100x. The Galaxy S25 has a 50 MP wide camera with 2x optical quality zoom, a 12 MP ultrawide camera and a 10 MP telephoto camera with 3x optical zoom, with digital zoom up to 30x. Both have a 12 MP selfie camera.",
  },
  {
    question: "Which has better battery life, the Galaxy S25 or the Galaxy S25 Ultra?",
    answer:
      "Samsung rates the Galaxy S25 Ultra at 5,000 mAh and up to 31 hours of video playback, and the Galaxy S25 at 4,000 mAh and up to 29 hours of video playback. Wired charging is 45W Super Fast Charging 2.0 on the Ultra and 25W Super Fast Charging on the Galaxy S25. Both support Fast Wireless Charging 2.0 and Wireless PowerShare. Real-world battery life depends on settings and use.",
  },
  {
    question: "How much bigger is the Galaxy S25 Ultra than the Galaxy S25?",
    answer:
      "Samsung New Zealand lists the Galaxy S25 at 146.9 x 70.5 x 7.2 mm and 162 g with a 6.2-inch FHD+ screen. It lists the Galaxy S25 Ultra at 162.8 x 77.6 x 8.2 mm and 218 g with a 6.9-inch QHD+ screen. Both screens are Dynamic AMOLED 2X with a 120 Hz adaptive refresh rate.",
  },
  {
    question: "Will the Galaxy S25 or Galaxy S25 Ultra last 4 years?",
    answer:
      "Software support is the same for both. Samsung's US newsroom says the Galaxy S25 series gets seven generations of OS upgrades and seven years of security updates from the global launch date. Battery wear is separate: Samsung says a Galaxy battery is a consumable component that degrades over time, and a Samsung service center can inspect or replace it. The Ultra starts with the larger 5,000 mAh battery.",
  },
  {
    question: "Does the Galaxy S25 work with the S Pen?",
    answer:
      "No. Samsung says the Galaxy S25, S25+, S25 Edge and S25 FE are not compatible with the S Pen. The Galaxy S25 Ultra has a built-in S Pen, and Samsung says that S Pen does not support Air actions.",
  },
];

const VERDICT = `Best for zoom photography and battery: Galaxy S25 Ultra. 200 MP wide, 50 MP ultrawide, 50 MP 5x and 10 MP 3x telephoto cameras, a 5,000 mAh battery rated for up to 31 hours of video playback, 45W charging and a built-in S Pen.

Best compact phone: Galaxy S25. 50 MP wide, 12 MP ultrawide and 10 MP 3x telephoto cameras, a 4,000 mAh battery rated for up to 29 hours of video playback, a 6.2-inch screen and 162 g.

Neither is better for everyone; it depends on whether the Ultra cameras and battery are worth a bigger phone and a higher price.`;

const EXPERT_ANALYSIS = `Choose the Galaxy S25 Ultra if photography, and zoom in particular, is the main reason to upgrade: Samsung lists a 200 MP wide camera, a 50 MP ultrawide camera, a 50 MP telephoto camera with 5x optical zoom and a 10 MP telephoto camera with 3x optical zoom, plus a 5,000 mAh battery rated for up to 31 hours of video playback. Choose the Galaxy S25 for a smaller, lighter phone: Samsung lists a 50 MP wide camera, a 12 MP ultrawide camera and a 10 MP telephoto camera with 3x optical zoom, a 4,000 mAh battery rated for up to 29 hours of video playback, and 162 g against 218 g. Neither is better for everyone; it depends on whether the Ultra cameras and battery are worth a bigger phone and a higher price.

Cameras

The Galaxy S25 Ultra has four rear cameras. Samsung lists a 200 MP wide camera with 2x optical quality zoom, a 50 MP ultrawide camera, a 50 MP telephoto camera with 5x optical zoom and 10x optical quality zoom, and a 10 MP telephoto camera with 3x optical zoom. Samsung says Space Zoom runs from 1x to 100x. Samsung New Zealand gives the apertures as F1.7 on the 200 MP camera, F3.4 on the 50 MP telephoto, F1.9 on the 50 MP ultrawide and F2.4 on the 10 MP telephoto.

The Galaxy S25 has three rear cameras. Samsung lists a 50 MP wide camera with 2x optical quality zoom, a 12 MP ultrawide camera and a 10 MP telephoto camera with 3x optical zoom, with digital zoom up to 30x. Both phones have a 12 MP selfie camera.

The two phones share 3x optical zoom. The Ultra adds the 5x telephoto, the higher-resolution wide and ultrawide cameras, and the longer zoom range. Coming from an older mid-range phone, the Galaxy S25 is still a three-camera system with optical zoom; the Ultra is the pick when long zoom and high-resolution detail are the point.

Battery and charging

Samsung rates the Galaxy S25 at 4,000 mAh and up to 29 hours of video playback, with 25W Super Fast Charging. It rates the Galaxy S25 Ultra at 5,000 mAh and up to 31 hours of video playback, with 45W Super Fast Charging 2.0. Both support Fast Wireless Charging 2.0 and Wireless PowerShare. Video playback hours are Samsung's figures; daily use varies with brightness, signal and apps.

Size, screen and build

Samsung New Zealand lists the Galaxy S25 at 146.9 x 70.5 x 7.2 mm and 162 g, and the Galaxy S25 Ultra at 162.8 x 77.6 x 8.2 mm and 218 g. The Galaxy S25 has a 6.2-inch FHD+ screen; the Ultra has a 6.9-inch QHD+ screen. Both are Dynamic AMOLED 2X with a 120 Hz adaptive refresh rate. Samsung lists an Armor Aluminum frame on the Galaxy S25 and a titanium frame with Corning Gorilla Armor 2 glass on the Ultra. Both are rated IP68.

Chip, memory and storage

Samsung lists Snapdragon 8 Elite for Galaxy on both phones in the US. In the US, the Galaxy S25 comes in 128GB or 256GB and the Ultra in 256GB, 512GB or 1TB, each with 12GB of memory.

Keeping it 4 years

Software support is the same. Samsung's US newsroom says the Galaxy S25 series gets seven generations of OS upgrades and seven years of security updates from the global launch date. Batteries age on both: Samsung says a Galaxy battery is a consumable component that degrades over time, and a Samsung service center can inspect it, with replacement covered under warranty or as paid service. The Ultra starts with more capacity, which leaves more margin as the battery wears.

S Pen

The Galaxy S25 Ultra has a built-in S Pen. Samsung says the S25 Ultra S Pen does not support Air actions, and that the Galaxy S25 is not compatible with the S Pen.

Who should buy which

Buy the Galaxy S25 Ultra if zoom photography, the largest battery in the S25 series and the S Pen are worth a 218 g phone and the higher price. Buy the Galaxy S25 if you want a compact 162 g phone with a 3x telephoto camera and the same seven years of updates. Galaxy S25 vs Galaxy S25 Plus covers the middle model, and Galaxy S25 vs Galaxy S25 FE covers the lower-priced model. Prices vary by store and region, so compare current prices before buying.`;

const SPEC = "Specs";

export const GALAXY_S25_VS_GALAXY_S25_ULTRA: EditorialComparison = buildEditorialComparison({
  slug: "galaxy-s25-vs-galaxy-s25-ultra",
  title: "Galaxy S25 vs Galaxy S25 Ultra: Camera and Long-Term Use",
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
      shortDesc: "6.2-inch phone with 50 MP, 12 MP and 10 MP 3x rear cameras and a 4,000 mAh battery.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Compact: 146.9 x 70.5 x 7.2 mm and 162 g (Samsung New Zealand)",
        "10 MP telephoto with 3x optical zoom (Samsung)",
        "Seven generations of OS upgrades and seven years of security updates (Samsung)",
        "IP68 with an Armor Aluminum frame (Samsung)",
      ],
      cons: [
        "4,000 mAh and up to 29 hours of video playback, against 5,000 mAh and 31 hours on the Ultra",
        "25W wired charging, against 45W on the Ultra",
        "No 5x telephoto and no S Pen support",
      ],
      bestFor: "Best for a compact phone with a 3x telephoto camera",
    },
    {
      id: ULTRA,
      slug: ULTRA,
      name: "Galaxy S25 Ultra",
      shortDesc: "6.9-inch phone with a 200 MP camera, 5x and 3x telephoto cameras, a 5,000 mAh battery and an S Pen.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "200 MP wide, 50 MP ultrawide, 50 MP 5x telephoto, 10 MP 3x telephoto (Samsung)",
        "5,000 mAh, up to 31 hours of video playback, 45W Super Fast Charging 2.0 (Samsung)",
        "Built-in S Pen (Samsung)",
        "Titanium frame and Corning Gorilla Armor 2 glass, IP68 (Samsung)",
      ],
      cons: [
        "Larger and heavier: 162.8 x 77.6 x 8.2 mm and 218 g (Samsung New Zealand)",
        "The S25 Ultra S Pen does not support Air actions (Samsung)",
      ],
      bestFor: "Best if zoom photography and battery come first",
    },
  ],
  keyDifferences: [
    {
      label: "Rear cameras",
      entityAValue: "50 MP wide, 12 MP ultrawide, 10 MP 3x telephoto",
      entityBValue: "200 MP wide, 50 MP ultrawide, 50 MP 5x telephoto, 10 MP 3x telephoto",
      winner: "b",
    },
    {
      label: "Battery",
      entityAValue: "4,000 mAh, up to 29 hours of video playback",
      entityBValue: "5,000 mAh, up to 31 hours of video playback",
      winner: "b",
    },
    {
      label: "Size and weight",
      entityAValue: "6.2-inch, 162 g",
      entityBValue: "6.9-inch, 218 g",
      winner: "a",
    },
    {
      label: "Software support",
      entityAValue: "Seven OS upgrades, seven years of security updates",
      entityBValue: "Seven OS upgrades, seven years of security updates",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "cameras",
      "Rear cameras",
      SPEC,
      S25,
      ULTRA,
      "50 MP wide (2x optical quality zoom), 12 MP ultrawide, 10 MP telephoto (3x optical zoom). Digital zoom up to 30x",
      "200 MP wide (2x optical quality zoom), 50 MP ultrawide, 50 MP telephoto (5x optical zoom, 10x optical quality zoom), 10 MP telephoto (3x optical zoom). Space Zoom up to 100x",
      "b"
    ),
    textAttr("selfie", "Selfie camera", SPEC, S25, ULTRA, "12 MP", "12 MP"),
    textAttr(
      "display",
      "Display",
      SPEC,
      S25,
      ULTRA,
      "6.2-inch FHD+ Dynamic AMOLED 2X, 120 Hz adaptive",
      "6.9-inch QHD+ Dynamic AMOLED 2X, 120 Hz adaptive"
    ),
    textAttr(
      "battery",
      "Battery",
      SPEC,
      S25,
      ULTRA,
      "4,000 mAh. Up to 29 hours of video playback",
      "5,000 mAh. Up to 31 hours of video playback",
      "b"
    ),
    textAttr(
      "charging",
      "Charging",
      SPEC,
      S25,
      ULTRA,
      "25W Super Fast Charging. Fast Wireless Charging 2.0 and Wireless PowerShare",
      "45W Super Fast Charging 2.0. Fast Wireless Charging 2.0 and Wireless PowerShare",
      "b"
    ),
    textAttr(
      "size",
      "Size and weight",
      SPEC,
      S25,
      ULTRA,
      "Samsung New Zealand: 146.9 x 70.5 x 7.2 mm, 162 g",
      "Samsung New Zealand: 162.8 x 77.6 x 8.2 mm, 218 g",
      "a"
    ),
    textAttr(
      "build",
      "Build",
      SPEC,
      S25,
      ULTRA,
      "Armor Aluminum frame, IP68",
      "Titanium frame, Corning Gorilla Armor 2 glass, IP68"
    ),
    textAttr(
      "storage",
      "Storage (US)",
      SPEC,
      S25,
      ULTRA,
      "128GB or 256GB, 12GB memory",
      "256GB, 512GB or 1TB, 12GB memory"
    ),
    textAttr(
      "spen",
      "S Pen",
      SPEC,
      S25,
      ULTRA,
      "Not compatible",
      "Built in. Does not support Air actions",
      "b"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "galaxy-s25-vs-galaxy-s25-plus",
      title: "Galaxy S25 vs Galaxy S25 Plus: Battery for Years of Use",
      category: "technology",
    },
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
      "Galaxy S25 Ultra for the 200 MP camera, the 5x telephoto, the 5,000 mAh battery and the S Pen. Galaxy S25 for a compact 162 g phone with a 3x telephoto and the same seven years of updates.",
    keyFact:
      "Samsung lists 3x optical zoom on both phones. The Galaxy S25 Ultra adds a 50 MP telephoto with 5x optical zoom, a 200 MP wide camera and a 5,000 mAh battery, against 4,000 mAh on the Galaxy S25.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 20,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Samsung US Support: Galaxy S25 series compared", url: US_SERIES },
      { name: "Samsung US Galaxy S25", url: US_S25 },
      { name: "Samsung US Galaxy S25 Ultra", url: US_ULTRA },
      { name: "Samsung New Zealand Galaxy S25 specs", url: NZ_S25 },
      { name: "Samsung New Zealand Galaxy S25 Ultra specs", url: NZ_ULTRA },
      { name: "Samsung US Support: Galaxy battery", url: BATTERY },
      { name: "Samsung US Newsroom Galaxy S25 series", url: UPDATES },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Samsung US Support: Galaxy S25 series compared",
      url: US_SERIES,
      description:
        "S25: 12MP ultrawide, 50MP wide, 10MP telephoto, 12MP selfie, 6.2-inch FHD+, 4,000mAh, 25W. S25 Ultra: 50MP ultrawide, 200MP wide, 50/10MP telephoto, 12MP selfie, 6.9-inch QHD+, 5,000mAh, 45W Super Fast Charging 2.0. Dynamic AMOLED 2X, 120 Hz adaptive. S Pen built into the Ultra, without Air actions; the S25 is not S Pen compatible.",
    },
    {
      type: "external",
      label: "Samsung US Galaxy S25",
      url: US_S25,
      description:
        "50MP wide with 2x optical quality zoom, 10MP telephoto with 3x optical zoom, digital zoom up to 30x. 4,000mAh, up to 29 hours of video playback. Armor Aluminum frame, IP68.",
    },
    {
      type: "external",
      label: "Samsung US Galaxy S25 Ultra",
      url: US_ULTRA,
      description:
        "200MP wide with 2x optical quality zoom, 50MP ultrawide, 50MP telephoto with 5x optical zoom and 10x optical quality zoom, 10MP telephoto with 3x optical zoom, Space Zoom up to 100x. 5,000mAh, up to 31 hours of video playback. Snapdragon 8 Elite for Galaxy. Titanium frame, Corning Gorilla Armor 2, IP68. 256GB, 512GB or 1TB with 12GB memory.",
    },
    {
      type: "external",
      label: "Samsung New Zealand Galaxy S25 specs",
      url: NZ_S25,
      description: "Galaxy S25: 146.9 x 70.5 x 7.2 mm, 162 g.",
    },
    {
      type: "external",
      label: "Samsung New Zealand Galaxy S25 Ultra specs",
      url: NZ_ULTRA,
      description:
        "Galaxy S25 Ultra: 162.8 x 77.6 x 8.2 mm, 218 g, 6.9-inch display. Rear cameras 200 MP (F1.7), 50 MP (F3.4), 50 MP (F1.9), 10 MP (F2.4); front 12 MP (F2.2). 5000mAh.",
    },
    {
      type: "external",
      label: "Samsung US Support: Galaxy battery",
      url: BATTERY,
      description:
        "A Galaxy battery is a consumable component that degrades over time. A Samsung service center can inspect it; replacement may be covered under warranty or may be paid service.",
    },
    {
      type: "external",
      label: "Samsung US Newsroom Galaxy S25 series",
      url: UPDATES,
      description:
        "Seven generations of OS upgrades and seven years of security updates from the global launch date for the Galaxy S25 series.",
    },
  ],
  metaTitle: "Galaxy S25 vs S25 Ultra | A Versus B",
});
