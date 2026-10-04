import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-149 — Galaxy S25 vs Galaxy S25 FE.
 * Figures read on 4 October 2026 from Samsung US Support ANS10004600,
 * Samsung UK's S25 FE features note, the UK Galaxy S25 FE 128GB phone,
 * and the UK Galaxy S25 phone. No benchmark scores. No page-level winner.
 * /entity/samsung-galaxy-s25 and /entity/samsung-galaxy-s25-fe were both
 * noindex, nofollow, so neither hub is linked.
 */

const S25 = "samsung-galaxy-s25";
const FE = "samsung-galaxy-s25-fe";

const US = "https://www.samsung.com/us/support/answer/ANS10004600/";
const UK_FEATURES =
  "https://www.samsung.com/uk/support/mobile-devices/what-are-the-features-of-the-galaxy-s25-fe/";
const UK_FE =
  "https://www.samsung.com/uk/smartphones/galaxy-s/galaxy-s25-fe-navy-128gb-sm-s731bdbdeub/";
const UK_S25 = "https://www.samsung.com/uk/smartphones/galaxy-s25/";

const SOURCE_DATE = "2026-10-04";
const PUBLISHED = "2026-10-04T00:00:00Z";

const SHORT_ANSWER =
  "For camera, daily use, light gaming, and social video, choose the Galaxy S25 FE if you want the larger 6.7-inch FHD+ screen and the 4,900 mAh battery. Choose the Galaxy S25 if you want the smaller 6.2-inch FHD+ phone and its 10 MP telephoto, against the FE's 8 MP telephoto. Samsung says both have a 50 MP wide camera, a 12 MP ultrawide camera, and a 12 MP selfie camera. Neither is better for everyone; it depends on screen size and whether that telephoto difference matters.";

const FAQS = [
  {
    question: "Is the Galaxy S25 FE enough if I am not a heavy gamer?",
    answer:
      "No game benchmark is included, so there is no score to clear. Both phones use a Dynamic AMOLED 2X display at 120 Hz. Samsung says the UK Galaxy S25 FE uses the Exynos 2400, which Samsung describes as built for ultra-smooth gaming and responsiveness, with hardware-based ray tracing and a 13% larger vapor chamber. Samsung says the UK Galaxy S25 is powered by Snapdragon 8 Elite for Galaxy, with improved real-time ray tracing. For light gaming and social video, either phone is in that everyday range. No heavy-gaming score is included.",
  },
  {
    question: "Which battery lasts longer, Galaxy S25 or Galaxy S25 FE?",
    answer:
      "The capacity and the video rating do not point the same way. Samsung says the Galaxy S25 FE battery is 4,900 mAh and the Galaxy S25 battery is 4,000 mAh. Samsung's UK video playback rating is up to 28 hours on the FE and up to 29 hours on the Galaxy S25. Those are the figures Samsung gives. They are not one combined endurance score. Charging is also different: Samsung says the Galaxy S25 has 25W Super Fast Charging via a wired connection, and the Galaxy S25 FE has 45W Super Fast Charging 2.0. Samsung also says the FE can power up to 65% in 30 minutes with fast wired charging. Across the series, Samsung says Fast Wireless Charging 2.0 and Wireless PowerShare are supported.",
  },
  {
    question: "Is the Galaxy S25 camera better than the Galaxy S25 FE?",
    answer:
      "No lab photo score is included. The wide, ultrawide, and selfie cameras match in megapixels. Samsung says both have a 12 MP ultrawide camera, a 50 MP wide camera, and a 12 MP selfie camera. The telephoto is 10 MP on the Galaxy S25 and 8 MP on the Galaxy S25 FE. Samsung says both of those telephoto cameras have 3x optical zoom. The UK FE phone lists the rear cameras as 50.0 MP + 12.0 MP + 8.0 MP, at F1.8, F2.2, and F2.4.",
  },
  {
    question: "Which is bigger, the Galaxy S25 or the Galaxy S25 FE?",
    answer:
      "The Galaxy S25 FE has the larger screen. Samsung says it is a 6.7-inch FHD+ display, 1080 x 2340, at 120 Hz. Measured as a rectangle it is 6.7 inches, and 6.6 inches with the rounded corners. Samsung says the FE is 7.4 mm thin and 190 grams, and calls it the thinnest and lightest FE phone yet. That line is about earlier FE phones. Samsung says the Galaxy S25 is a 6.2-inch FHD+ display, 2340 x 1080, at 120 Hz.",
  },
  {
    question: "Is the Galaxy S25 FE using last year's chip?",
    answer:
      "Samsung's UK Galaxy S25 FE uses the Exynos 2400, with 8 GB of memory. Samsung also writes that name as Exynos 2,400. Samsung's UK Galaxy S25 phone says Snapdragon 8 Elite for Galaxy. Samsung's UK features note writes that S25 chip as Qualcomm Snapdragon Elite 8 for Galaxy (3 nm), with 12 GB of memory. Those are the names Samsung uses. No benchmark score is included, so the names are not a speed ranking.",
  },
  {
    question: "Should I get the Galaxy S25 Ultra instead?",
    answer:
      "Get the Galaxy S25 Ultra if you want the phone Samsung lists at 6.9 inches, QHD+, with a 5,000 mAh battery, a 200 MP wide camera, and an integrated S Pen. Samsung says the Galaxy S25 FE, Galaxy S25, Galaxy S25+, and Galaxy S25 Edge are not compatible with the S Pen. For a 6.2-inch or 6.7-inch FHD+ phone, the Galaxy S25 and Galaxy S25 FE are the pair above. Galaxy S24 Ultra vs Galaxy S25 Ultra covers the Ultra against the previous Ultra.",
  },
];

const VERDICT = `Best larger screen and larger battery capacity: Galaxy S25 FE. 6.7-inch FHD+, 4,900 mAh, 45W Super Fast Charging 2.0, and an 8 MP telephoto.

Best smaller phone and 10 MP telephoto: Galaxy S25. 6.2-inch FHD+, 4,000 mAh, 25W Super Fast Charging, and a 10 MP telephoto.

Neither is better for everyone; it depends on screen size and whether that telephoto difference matters. Both have a 50 MP wide camera, a 12 MP ultrawide camera, and a 12 MP selfie camera. No benchmark score is included.`;

const EXPERT_ANALYSIS = `For camera, daily use, light gaming, and social video, choose the Galaxy S25 FE if you want the larger 6.7-inch FHD+ screen and the 4,900 mAh battery. Choose the Galaxy S25 if you want the smaller 6.2-inch FHD+ phone and its 10 MP telephoto, against the FE's 8 MP telephoto. Neither is better for everyone; it depends on screen size and whether that telephoto difference matters.

Display and size

Samsung says the Galaxy S25 is a 6.2-inch FHD+ screen. The UK features note gives that display as Dynamic AMOLED 2X, 2340 x 1080, at 120 Hz. Samsung says the Galaxy S25 FE is a 6.7-inch FHD+ screen, Dynamic AMOLED 2X, 1080 x 2340, at 120 Hz. On the UK FE phone, Samsung measures that screen as 6.7 inches in the full rectangle and 6.6 inches with the rounded corners. Samsung says the FE is 7.4 mm thin and 190 grams, and calls it the thinnest and lightest FE phone yet. That line is about earlier FE phones.

Camera

Samsung says both phones have a 12 MP ultrawide camera, a 50 MP wide camera, and a 12 MP selfie camera. The telephoto is 10 MP on the Galaxy S25 and 8 MP on the Galaxy S25 FE. Samsung says both telephoto cameras have 3x optical zoom. On the UK FE phone the rear cameras are listed as 50.0 MP + 12.0 MP + 8.0 MP, at F1.8, F2.2, and F2.4, with optical zoom 3x. Samsung also gives the S25 wide camera as 50 MP F1.8 and the ultrawide as 12 MP F2.2. No lab photo score is included.

Battery and charging

Samsung says the Galaxy S25 FE battery is 4,900 mAh and the Galaxy S25 battery is 4,000 mAh. Samsung's UK video playback rating is up to 28 hours on the FE and up to 29 hours on the Galaxy S25. The FE has the larger capacity. The UK video-hour rating is higher on the Galaxy S25. Those are separate figures.

Samsung says the Galaxy S25 and Galaxy S25 Edge have 25W Super Fast Charging via a wired connection, and the Galaxy S25 FE, Galaxy S25+, and Galaxy S25 Ultra have 45W Super Fast Charging 2.0. Samsung also says the FE can power up to 65% in 30 minutes with fast wired charging. Across the series, Samsung says Fast Wireless Charging 2.0 and Wireless PowerShare are supported.

Chip, by region

Samsung's UK Galaxy S25 phone says it is powered by Snapdragon 8 Elite for Galaxy. Samsung's UK features note writes that chip as Qualcomm Snapdragon Elite 8 for Galaxy (3 nm), with 12 GB of memory. Samsung's UK Galaxy S25 FE uses the Exynos 2400, also written Exynos 2,400, with 8 GB of memory. Samsung calls that processor a flagship performance processor and says it is built for ultra-smooth gaming and responsiveness, with hardware-based ray tracing and a 13% larger vapor chamber. No benchmark score is included.

Storage differs by region. Samsung's US support note says the Galaxy S25 FE and the Galaxy S25 each come in 128GB or 256GB. Samsung's UK features note lists FE storage as 128GB, 256GB, or 512GB, and Galaxy S25 storage as 128GB, 256GB, or 512GB, with 12 GB of memory on the S25. The UK Galaxy S25 phone also says 12 GB of memory and up to 128GB, 256GB, or 512GB.

Who should buy which

Buy the Galaxy S25 FE for the 6.7-inch screen, the 4,900 mAh battery, and 45W Super Fast Charging 2.0, if light gaming and social video do not depend on a benchmark score. Buy the Galaxy S25 for the smaller 6.2-inch phone and the 10 MP telephoto. Buy the Galaxy S25 Ultra instead if you want the 6.9-inch QHD+ phone, the 5,000 mAh battery, the 200 MP wide camera, and the integrated S Pen. Samsung says the Galaxy S25 and the Galaxy S25 FE are not compatible with the S Pen. Galaxy S24 Ultra vs Galaxy S25 Ultra covers that Ultra against the previous Ultra.`;

const SPEC = "Specs";

export const GALAXY_S25_VS_GALAXY_S25_FE: EditorialComparison = buildEditorialComparison({
  slug: "galaxy-s25-vs-galaxy-s25-fe",
  title: "Galaxy S25 vs Galaxy S25 FE: Camera and Daily Use",
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
      shortDesc: "6.2-inch FHD+ phone with a 4,000 mAh battery and a 10 MP telephoto.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "6.2-inch FHD+ Dynamic AMOLED 2X at 120 Hz (Samsung)",
        "10 MP telephoto with 3x optical zoom (Samsung)",
        "50 MP wide, 12 MP ultrawide, and 12 MP selfie (Samsung)",
        "UK phone: Snapdragon 8 Elite for Galaxy, 12 GB of memory (Samsung)",
      ],
      cons: [
        "4,000 mAh, against 4,900 mAh on the Galaxy S25 FE",
        "25W Super Fast Charging, against 45W Super Fast Charging 2.0 on the FE",
        "Samsung says it is not compatible with the S Pen",
      ],
      bestFor: "Best if you want the smaller phone and the 10 MP telephoto",
    },
    {
      id: FE,
      slug: FE,
      name: "Galaxy S25 FE",
      shortDesc: "6.7-inch FHD+ phone with a 4,900 mAh battery and 45W Super Fast Charging 2.0.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "6.7-inch FHD+ display at 120 Hz (Samsung)",
        "4,900 mAh battery (Samsung)",
        "45W Super Fast Charging 2.0, and up to 65% in 30 minutes (Samsung)",
        "50 MP wide, 12 MP ultrawide, and 12 MP selfie (Samsung)",
      ],
      cons: [
        "8 MP telephoto, against 10 MP on the Galaxy S25",
        "UK video playback is up to 28 hours, against up to 29 hours on the Galaxy S25",
        "Samsung says it is not compatible with the S Pen",
      ],
      bestFor: "Best for the larger screen and the 4,900 mAh battery",
    },
  ],
  keyDifferences: [
    {
      label: "Screen",
      entityAValue: "6.2-inch FHD+, 120 Hz",
      entityBValue: "6.7-inch FHD+, 120 Hz",
      winner: "tie",
    },
    {
      label: "Telephoto",
      entityAValue: "10 MP, 3x optical zoom",
      entityBValue: "8 MP, 3x optical zoom",
      winner: "tie",
    },
    {
      label: "Battery",
      entityAValue: "4,000 mAh. UK video up to 29 hours",
      entityBValue: "4,900 mAh. UK video up to 28 hours",
      winner: "tie",
    },
    {
      label: "Wired charging",
      entityAValue: "25W Super Fast Charging",
      entityBValue: "45W Super Fast Charging 2.0",
      winner: "b",
    },
  ],
  attributes: [
    textAttr(
      "display",
      "Display",
      SPEC,
      S25,
      FE,
      "6.2-inch FHD+ Dynamic AMOLED 2X, 2340 x 1080, 120 Hz",
      "6.7-inch FHD+ Dynamic AMOLED 2X, 1080 x 2340, 120 Hz. 6.7 inches full rectangle, 6.6 inches with rounded corners"
    ),
    textAttr(
      "size",
      "Size and weight",
      SPEC,
      S25,
      FE,
      "—",
      "7.4 mm and 190 grams. Samsung calls it the thinnest and lightest FE phone yet"
    ),
    textAttr(
      "cameras",
      "Cameras",
      SPEC,
      S25,
      FE,
      "12 MP ultrawide, 50 MP wide, 10 MP telephoto with 3x optical zoom, 12 MP selfie",
      "12 MP ultrawide, 50 MP wide, 8 MP telephoto with 3x optical zoom, 12 MP selfie"
    ),
    textAttr(
      "battery",
      "Battery",
      SPEC,
      S25,
      FE,
      "4,000 mAh. UK video playback up to 29 hours",
      "4,900 mAh. UK video playback up to 28 hours"
    ),
    textAttr(
      "charging",
      "Charging",
      SPEC,
      S25,
      FE,
      "25W Super Fast Charging via a wired connection. Fast Wireless Charging 2.0 and Wireless PowerShare",
      "45W Super Fast Charging 2.0. Up to 65% in 30 minutes with fast wired charging. Fast Wireless Charging 2.0 and Wireless PowerShare",
      "b"
    ),
    textAttr(
      "chip",
      "Chip",
      SPEC,
      S25,
      FE,
      "UK phone: Snapdragon 8 Elite for Galaxy. UK features note: Qualcomm Snapdragon Elite 8 for Galaxy (3 nm), 12 GB memory",
      "UK: Exynos 2400, also written Exynos 2,400, with 8 GB memory"
    ),
    textAttr(
      "storage",
      "Storage",
      SPEC,
      S25,
      FE,
      "US: 128GB or 256GB. UK: 128GB, 256GB, or 512GB, with 12 GB memory",
      "US: 128GB or 256GB. UK: 128GB, 256GB, or 512GB, with 8 GB memory"
    ),
    textAttr(
      "spen",
      "S Pen",
      SPEC,
      S25,
      FE,
      "Samsung says it is not compatible with the S Pen",
      "Samsung says it is not compatible with the S Pen"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
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
      "Galaxy S25 FE for the 6.7-inch screen and 4,900 mAh battery. Galaxy S25 for the 6.2-inch phone and the 10 MP telephoto.",
    keyFact:
      "Samsung says both phones have a 50 MP wide camera, a 12 MP ultrawide camera, and a 12 MP selfie camera. The telephoto is 10 MP on the Galaxy S25 and 8 MP on the Galaxy S25 FE.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 8,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Samsung US Support — Galaxy S25 series comparison", url: US },
      { name: "Samsung UK — Galaxy S25 FE features", url: UK_FEATURES },
      { name: "Samsung UK — Galaxy S25 FE 128GB", url: UK_FE },
      { name: "Samsung UK — Galaxy S25", url: UK_S25 },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Samsung US Support Galaxy S25 series",
      url: US,
      description:
        "S25 6.2-inch FHD+ and 4,000 mAh. S25 FE 6.7-inch FHD+ and 4,900 mAh. 25W on the S25. 45W Super Fast Charging 2.0 on the FE. 10 MP telephoto on the S25, 8 MP on the FE.",
    },
    {
      type: "external",
      label: "Samsung UK Galaxy S25 FE features",
      url: UK_FEATURES,
      description:
        "Exynos 2400 and 8 GB on the FE. Snapdragon Elite 8 for Galaxy (3 nm) and 12 GB on the S25. Video playback up to 28 hours on the FE and up to 29 hours on the S25.",
    },
    {
      type: "external",
      label: "Samsung UK Galaxy S25 FE 128GB",
      url: UK_FE,
      description:
        "7.4 mm and 190 grams. Display 6.7 inches full rectangle and 6.6 inches with rounded corners. Rear cameras 50.0 MP + 12.0 MP + 8.0 MP. Up to 65% in 30 minutes.",
    },
    {
      type: "external",
      label: "Samsung UK Galaxy S25",
      url: UK_S25,
      description:
        "Powered by Snapdragon 8 Elite for Galaxy. Display 6.2 inches, battery 4,000 mAh, resolution FHD+. 12 GB of memory.",
    },
  ],
  metaTitle: "Galaxy S25 vs S25 FE | A Versus B",
});
