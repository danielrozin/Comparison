import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-166 — Galaxy S26 vs Galaxy S26 Ultra.
 * Figures read on 6 October 2026 from Samsung US Support ANS10010342,
 * Samsung UK's S26 Ultra / S26+ / S26 differences, Samsung Ireland's
 * Galaxy S26 compare, and the US Galaxy S26 and Galaxy S26 Ultra phones.
 * No benchmark scores. No image-quality scores. No street prices.
 * No page-level winner. No viewing-angle claim for Privacy Display.
 * Chips are labeled by region. US chips come from Samsung's US phones.
 */

const S26 = "galaxy-s26";
const ULTRA = "galaxy-s26-ultra";

const US_SUPPORT = "https://www.samsung.com/us/support/answer/ANS10010342/";
const UK =
  "https://www.samsung.com/uk/support/mobile-devices/what-are-the-differences-between-the-galaxy-s26-ultra-s26-plus-and-s26/";
const IE = "https://www.samsung.com/ie/smartphones/galaxy-s26/compare/";
const US_S26 = "https://www.samsung.com/us/smartphones/galaxy-s26/";
const US_ULTRA = "https://www.samsung.com/us/smartphones/galaxy-s26-ultra/";

const SOURCE_DATE = "2026-10-06";
const PUBLISHED = "2026-10-06T00:00:00Z";

const SHORT_ANSWER =
  "Choose the Galaxy S26 Ultra only if you will use the S Pen, the 5x telephoto and zoom up to 100x, or the larger 5,000 mAh battery with up to 60W charging, alongside its 6.9-inch QHD+ screen. Choose the Galaxy S26 for a small, light phone: Samsung UK lists 6.3 inches and 167 g, against 214 g for the Ultra, with a 50 MP wide camera, a 12 MP ultrawide camera, and a 10 MP 3x telephoto camera. Neither is better for everyone; it depends on the S Pen, zoom, battery, and whether you want the smaller phone.";

const FAQS = [
  {
    question: "Is the Galaxy S26 Ultra worth it over the Galaxy S26?",
    answer:
      "Choose the Galaxy S26 Ultra if you will use the S Pen, the 5x telephoto and zoom up to 100x, or the larger 5,000 mAh battery with up to 60W charging, and you want the 6.9-inch QHD+ screen. Choose the Galaxy S26 if you want the smaller, lighter phone. Samsung UK lists it at 6.3 inches and 167 g, with a 50 MP wide camera, a 12 MP ultrawide camera, and a 10 MP 3x telephoto camera. Neither is better for everyone.",
  },
  {
    question: "How much heavier is the Galaxy S26 Ultra?",
    answer:
      "Samsung UK lists the Galaxy S26 Ultra at 214 g and 78.1 x 163.6 x 7.9 mm, and the Galaxy S26 at 167 g and 71.7 x 149.6 x 7.2 mm. The Ultra is 47 g heavier. Samsung US Support lists a 6.9-inch QHD+ screen on the Ultra and a 6.3-inch FHD+ screen on the Galaxy S26. Samsung Ireland measures the Ultra as 6.9 inches in the full rectangle and 6.7 inches with the rounded corners, and the Galaxy S26 as 6.3 inches in the full rectangle and 6.1 inches with the rounded corners.",
  },
  {
    question: "Do the Galaxy S26 and Galaxy S26 Ultra have the same cameras?",
    answer:
      "No. Both have a 3x telephoto and a 12 MP selfie camera. Samsung US Support lists a 50 MP wide camera, a 12 MP ultrawide camera, and a 10 MP telephoto with 3x zoom and up to 30x Space Zoom on the Galaxy S26. On the Ultra, Samsung US Support lists a 200 MP wide camera, a 50 MP ultrawide camera, a 10 MP telephoto with 3x zoom, and a 50 MP telephoto with up to 100x Space Zoom. Samsung UK lists 5x optical zoom on that 50 MP telephoto. The Ultra has more camera hardware. Whether that matters depends on zoom and low-light use.",
  },
  {
    question: "Which battery lasts longer, the Galaxy S26 or the Galaxy S26 Ultra?",
    answer:
      "Samsung US Support lists a 5,000 mAh battery, wired Super Fast Charging 3.0 up to 60W, and Super Fast Wireless Charging up to 25W on the Galaxy S26 Ultra. The Galaxy S26 is 4,300 mAh, with wired Super Fast Charging up to 25W and Fast Wireless Charging up to 15W. Samsung Ireland lists video playback of up to 31 hours on the Ultra and up to 30 hours on the Galaxy S26. Samsung Ireland also says Super Fast Charging 3.0 on the Ultra gets around 75% in up to 30 minutes, and that actual battery life varies. The Ultra starts with more capacity and a longer video-playback rating. That is not a measured day of use.",
  },
  {
    question: "Does the Galaxy S26 support the S Pen?",
    answer:
      "No. Samsung US Support says the Galaxy S26, Galaxy S26+, and Galaxy S26 FE do not support S Pen functionality. Samsung UK lists S Pen support on the Galaxy S26 Ultra. Samsung's US Galaxy S26 Ultra phone says the Ultra has a built-in S Pen.",
  },
  {
    question: "Which chip is in the Galaxy S26 and the Galaxy S26 Ultra?",
    answer:
      "In the UK, Samsung lists the Exynos 2600 (2nm) for the Galaxy S26 and the Snapdragon 8 Elite Gen 5 for Galaxy (3nm) for the Galaxy S26 Ultra. Samsung's US Galaxy S26 phone lists the Exynos 2600 for the Galaxy S26 and the Galaxy S26+. Samsung's US Galaxy S26 Ultra phone lists Snapdragon 8 Elite Gen 5 for Galaxy. Samsung UK says models may vary by country, so check Samsung for the country you buy in.",
  },
];

const VERDICT = `Best if you will use the S Pen, 5x zoom, or the larger battery: Galaxy S26 Ultra. 6.9-inch QHD+, 214 g, 5,000 mAh, up to 60W wired charging, and zoom up to 100x.

Best small, light phone: Galaxy S26. 6.3-inch FHD+, 167 g, 4,300 mAh, up to 25W wired charging, and a 50 MP wide, 12 MP ultrawide, and 10 MP 3x telephoto camera.

Neither is better for everyone; it depends on the S Pen, zoom, battery, and whether you want the smaller phone.`;

const EXPERT_ANALYSIS = `Choose the Galaxy S26 Ultra only if you will use the S Pen, the 5x telephoto and zoom up to 100x, or the larger 5,000 mAh battery with up to 60W charging, alongside its 6.9-inch QHD+ screen. Choose the Galaxy S26 for a small, light phone: Samsung UK lists 6.3 inches and 167 g, against 214 g for the Ultra, with a 50 MP wide camera, a 12 MP ultrawide camera, and a 10 MP 3x telephoto camera. Neither is better for everyone; it depends on the S Pen, zoom, battery, and whether you want the smaller phone.

Display, size, and weight

Samsung US Support says the Galaxy S26 series uses Dynamic AMOLED 2X displays with a 120 Hz adaptive refresh rate. The Galaxy S26 is a 6.3-inch FHD+ screen. The Galaxy S26 Ultra is a 6.9-inch QHD+ screen. Samsung UK lists the same sizes, and lists S Pen support on the Ultra. Samsung Ireland measures the Galaxy S26 as 6.3 inches in the full rectangle and 6.1 inches with the rounded corners, and the Galaxy S26 Ultra as 6.9 inches in the full rectangle and 6.7 inches with the rounded corners. Samsung Ireland also lists 2,600 nits on each Galaxy S26 series model.

Samsung UK lists the body as 71.7 x 149.6 x 7.2 mm and 167 g for the Galaxy S26, and 78.1 x 163.6 x 7.9 mm and 214 g for the Galaxy S26 Ultra. The Ultra is 47 g heavier, and it is the larger phone. That is the fit difference if your hands are small.

S Pen

Samsung US Support says the Galaxy S26, Galaxy S26+, and Galaxy S26 FE do not support S Pen functionality. Samsung UK lists S Pen support on the Galaxy S26 Ultra. Samsung's US Galaxy S26 Ultra phone says the Ultra has a built-in S Pen. If you will not use the pen, that is not a reason to buy the Ultra.

Privacy Display

Samsung UK lists a built-in Privacy Display on the Galaxy S26 Ultra. Samsung's US Galaxy S26 Ultra phone also lists a built-in Privacy Display. Samsung's US Galaxy S26 phone does not list a Privacy Display for the Galaxy S26. You can try it in a store before you buy.

Cameras

The hardware is different. Samsung US Support lists a 12 MP ultrawide camera, a 50 MP wide camera, a 10 MP telephoto with 3x zoom and up to 30x Space Zoom, and a 12 MP selfie camera on the Galaxy S26. Video recording there is FHD and 4K at 60 fps, and 8K at 30 fps. Samsung UK lists the same rear cameras as 12 MP at F2.2, 50 MP at F1.8, and 10 MP at F2.4, with 3x optical zoom, 2x optical quality zoom, and digital zoom up to 30x.

On the Galaxy S26 Ultra, Samsung US Support lists a 50 MP ultrawide camera, a 200 MP wide camera, a 10 MP telephoto with 3x zoom, a 50 MP telephoto with up to 100x Space Zoom, and a 12 MP selfie camera. Video recording there is FHD and 4K at 120 fps, and 8K at 30 fps. Samsung UK lists those rear cameras as 50 MP at F1.9, 200 MP at F1.4, 10 MP at F2.4, and 50 MP at F2.9, with optical zoom at 5x and 3x, optical quality zoom at 10x and 2x, and digital zoom up to 100x. Samsung's US Galaxy S26 Ultra phone also lists 5x optical zoom on the 50 MP telephoto.

The Ultra has more camera hardware: a 200 MP wide camera against a 50 MP wide camera, a 50 MP ultrawide camera against a 12 MP ultrawide camera, and an extra 50 MP telephoto with 5x optical zoom. Whether that matters depends on zoom and low-light use.

Battery and charging

Samsung US Support lists a 4,300 mAh battery on the Galaxy S26, with wired Super Fast Charging up to 25W, Fast Wireless Charging up to 15W, and Wireless PowerShare. The Galaxy S26 Ultra is a 5,000 mAh battery, with wired Super Fast Charging 3.0 up to 60W, Super Fast Wireless Charging up to 25W, and Wireless PowerShare. Samsung UK lists the same typical capacities: 4,300 mAh and 5,000 mAh.

Samsung Ireland lists video playback of up to 30 hours for the Galaxy S26 and up to 31 hours for the Galaxy S26 Ultra. Samsung's US Galaxy S26 phone also lists up to 30 hours of video on the Galaxy S26. Samsung's US Galaxy S26 Ultra phone lists 31 hours of video playback for the Ultra. Samsung Ireland says actual battery life varies, and says Super Fast Charging 3.0 on the Ultra gets around 75% in up to 30 minutes. The hour ratings are close. The capacity and the wired charging rate are not.

Chip, by region

In the UK, Samsung lists the Exynos 2600 (2nm) for the Galaxy S26 and the Snapdragon 8 Elite Gen 5 for Galaxy (3nm) for the Galaxy S26 Ultra. Samsung's US Galaxy S26 phone lists the Exynos 2600 for the Galaxy S26 and the Galaxy S26+. Samsung's US Galaxy S26 Ultra phone lists Snapdragon 8 Elite Gen 5 for Galaxy. Samsung UK says models may vary by country, so check Samsung for the country you buy in. Those names are not a speed score.

Memory and storage, by region

Samsung US Support lists 12 GB of memory with 256 GB or 512 GB of storage on the Galaxy S26. On the Ultra, Samsung US Support lists 12 GB of memory with 256 GB or 512 GB, or 16 GB of memory with 1 TB. Samsung's US Galaxy S26 phone lists the same 12 GB with 256 GB or 512 GB. Samsung UK lists 12 GB of memory and 256 GB or 512 GB of storage on the Galaxy S26, and 12 GB or 16 GB of memory with 256 GB, 512 GB, or 1 TB on the Ultra. Samsung US Support says external SD cards are not supported.

Who should buy which

Buy the Galaxy S26 Ultra if you will use the S Pen, the 5x telephoto and zoom up to 100x, or the 5,000 mAh battery with up to 60W charging, and you want the 6.9-inch QHD+ screen. Buy the Galaxy S26 if you want the smaller, lighter phone for everyday photos. You can try Privacy Display in a store. Galaxy Z Flip8 vs Galaxy S26 Ultra covers a lighter folding phone against the Ultra. Galaxy Z Fold 7 vs Galaxy S26 Ultra covers the book-style fold against the same slab. Galaxy S25 vs Galaxy S25 Plus covers the previous compact Galaxy S phone against its Plus.`;

const SPEC = "Specs";

export const GALAXY_S26_VS_GALAXY_S26_ULTRA: EditorialComparison = buildEditorialComparison({
  slug: "galaxy-s26-vs-galaxy-s26-ultra",
  title: "Galaxy S26 vs Galaxy S26 Ultra: Ultra or Base?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: S26,
      slug: S26,
      name: "Galaxy S26",
      shortDesc: "6.3-inch FHD+ phone at 167 g, with a 4,300 mAh battery and no S Pen.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "6.3-inch FHD+ Dynamic AMOLED 2X, 120 Hz adaptive (Samsung US Support)",
        "Samsung UK: 71.7 x 149.6 x 7.2 mm, 167 g",
        "50 MP wide, 12 MP ultrawide, 10 MP 3x telephoto, 12 MP selfie (Samsung US Support)",
        "Exynos 2600 in the UK and on Samsung's US Galaxy S26 phone",
      ],
      cons: [
        "4,300 mAh and wired charging up to 25W, against 5,000 mAh and up to 60W on the Ultra",
        "No S Pen. Samsung US Support says the Galaxy S26 does not support it",
        "Zoom up to 30x, against up to 100x and a 5x telephoto on the Ultra",
      ],
      bestFor: "Best for a small, light phone and everyday photos",
    },
    {
      id: ULTRA,
      slug: ULTRA,
      name: "Galaxy S26 Ultra",
      shortDesc: "6.9-inch QHD+ phone at 214 g, with an S Pen, a 5x telephoto, and a 5,000 mAh battery.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "S Pen. Samsung US Support says the Galaxy S26 does not support it",
        "200 MP wide, 50 MP ultrawide, 10 MP 3x, and 50 MP 5x telephoto (Samsung UK)",
        "5,000 mAh, Super Fast Charging 3.0 up to 60W, wireless up to 25W (Samsung US Support)",
        "Built-in Privacy Display (Samsung UK and Samsung's US Galaxy S26 Ultra phone)",
      ],
      cons: [
        "Heavier and larger: Samsung UK lists 214 g and 78.1 x 163.6 x 7.9 mm",
        "You can try Privacy Display in a store before you buy",
      ],
      bestFor: "Best if you will use the S Pen, 5x zoom, or the larger battery",
    },
  ],
  keyDifferences: [
    {
      label: "Screen",
      entityAValue: "6.3-inch FHD+, 120 Hz adaptive",
      entityBValue: "6.9-inch QHD+, 120 Hz adaptive, S Pen",
      winner: "tie",
    },
    {
      label: "Weight",
      entityAValue: "167 g (Samsung UK)",
      entityBValue: "214 g (Samsung UK)",
      winner: "a",
    },
    {
      label: "Rear cameras",
      entityAValue: "50 MP, 12 MP ultrawide, 10 MP 3x, up to 30x",
      entityBValue: "200 MP, 50 MP ultrawide, 10 MP 3x, 50 MP 5x, up to 100x",
      winner: "tie",
    },
    {
      label: "Battery and wired charging",
      entityAValue: "4,300 mAh, up to 25W",
      entityBValue: "5,000 mAh, Super Fast Charging 3.0 up to 60W",
      winner: "b",
    },
  ],
  attributes: [
    textAttr(
      "display",
      "Display",
      SPEC,
      S26,
      ULTRA,
      "6.3-inch FHD+ Dynamic AMOLED 2X, 120 Hz adaptive. Samsung Ireland: 6.3 inches full rectangle, 6.1 inches with rounded corners. 2,600 nits",
      "6.9-inch QHD+ Dynamic AMOLED 2X, 120 Hz adaptive, S Pen. Samsung Ireland: 6.9 inches full rectangle, 6.7 inches with rounded corners. 2,600 nits"
    ),
    textAttr(
      "size",
      "Size and weight",
      SPEC,
      S26,
      ULTRA,
      "Samsung UK: 71.7 x 149.6 x 7.2 mm, 167 g",
      "Samsung UK: 78.1 x 163.6 x 7.9 mm, 214 g",
      "a"
    ),
    textAttr(
      "spen",
      "S Pen",
      SPEC,
      S26,
      ULTRA,
      "Samsung US Support: no S Pen support on the Galaxy S26, Galaxy S26+, or Galaxy S26 FE",
      "Samsung UK lists S Pen support. Samsung's US Galaxy S26 Ultra phone: built-in S Pen",
      "b"
    ),
    textAttr(
      "cameras",
      "Cameras",
      SPEC,
      S26,
      ULTRA,
      "Samsung US Support: 12 MP ultrawide, 50 MP wide, 10 MP 3x, up to 30x Space Zoom, 12 MP selfie. UK: F2.2, F1.8, F2.4",
      "Samsung US Support: 50 MP ultrawide, 200 MP wide, 10 MP 3x, 50 MP telephoto up to 100x Space Zoom, 12 MP selfie. UK: 5x optical zoom"
    ),
    textAttr(
      "video",
      "Video",
      SPEC,
      S26,
      ULTRA,
      "Samsung US Support: FHD and 4K at 60 fps, 8K at 30 fps",
      "Samsung US Support: FHD and 4K at 120 fps, 8K at 30 fps"
    ),
    textAttr(
      "battery",
      "Battery",
      SPEC,
      S26,
      ULTRA,
      "4,300 mAh. Samsung Ireland: up to 30 hours of video playback",
      "5,000 mAh. Samsung Ireland: up to 31 hours of video playback",
      "b"
    ),
    textAttr(
      "charging",
      "Charging",
      SPEC,
      S26,
      ULTRA,
      "Wired Super Fast Charging up to 25W. Fast Wireless Charging up to 15W. Wireless PowerShare",
      "Wired Super Fast Charging 3.0 up to 60W. Super Fast Wireless Charging up to 25W. Wireless PowerShare. Samsung Ireland: around 75% in up to 30 minutes",
      "b"
    ),
    textAttr(
      "chip",
      "Chip",
      SPEC,
      S26,
      ULTRA,
      "UK: Exynos 2600 (2nm). Samsung's US Galaxy S26 phone: Exynos 2600. Models may vary by country",
      "UK: Snapdragon 8 Elite Gen 5 for Galaxy (3nm). Samsung's US Galaxy S26 Ultra phone: Snapdragon 8 Elite Gen 5 for Galaxy. Models may vary by country"
    ),
    textAttr(
      "storage",
      "Memory and storage",
      SPEC,
      S26,
      ULTRA,
      "Samsung US Support and Samsung UK: 12 GB with 256 GB or 512 GB. No external SD card (Samsung US Support)",
      "Samsung US Support: 12 GB with 256 GB or 512 GB, or 16 GB with 1 TB. Samsung UK: 12 GB or 16 GB, and 256 GB, 512 GB, or 1 TB"
    ),
    textAttr(
      "privacy",
      "Privacy Display",
      SPEC,
      S26,
      ULTRA,
      "Samsung's US Galaxy S26 phone does not list a Privacy Display for the Galaxy S26",
      "Samsung UK and Samsung's US Galaxy S26 Ultra phone list a built-in Privacy Display. Try it in a store"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "galaxy-z-flip-8-vs-galaxy-s26-ultra",
      title: "Galaxy Z Flip8 vs Galaxy S26 Ultra: Flip or Slab?",
      category: "technology",
    },
    {
      slug: "galaxy-s25-vs-galaxy-s25-plus",
      title: "Galaxy S25 vs Galaxy S25 Plus: Battery for Years of Use",
      category: "technology",
    },
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
      "Galaxy S26 Ultra if you will use the S Pen, 5x zoom, or the 5,000 mAh battery with up to 60W charging. Galaxy S26 for the smaller, lighter phone.",
    keyFact:
      "Samsung UK lists 167 g and a 6.3-inch screen for the Galaxy S26, against 214 g and a 6.9-inch QHD+ screen for the Ultra. Samsung US Support lists 4,300 mAh and up to 25W wired charging, against 5,000 mAh and up to 60W.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 18,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Samsung US Support Galaxy S26 series", url: US_SUPPORT },
      { name: "Samsung UK Galaxy S26 Ultra, S26+, and S26", url: UK },
      { name: "Samsung Ireland Galaxy S26 compare", url: IE },
      { name: "Samsung US Galaxy S26", url: US_S26 },
      { name: "Samsung US Galaxy S26 Ultra", url: US_ULTRA },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Samsung US Support Galaxy S26 series",
      url: US_SUPPORT,
      description:
        "S26: 6.3-inch FHD+, 4,300 mAh, wired charging up to 25W, wireless up to 15W, 12 GB with 256 GB or 512 GB, 50 MP wide, 12 MP ultrawide, 10 MP 3x, up to 30x Space Zoom, 12 MP selfie, FHD and 4K at 60 fps, 8K at 30 fps. No S Pen. Ultra: 6.9-inch QHD+, 5,000 mAh, Super Fast Charging 3.0 up to 60W, wireless up to 25W, 12 GB with 256 GB or 512 GB or 16 GB with 1 TB, 200 MP wide, 50 MP ultrawide, 10 MP 3x, 50 MP telephoto up to 100x Space Zoom, FHD and 4K at 120 fps, 8K at 30 fps. Both Dynamic AMOLED 2X, 120 Hz adaptive. No external SD card.",
    },
    {
      type: "external",
      label: "Samsung UK Galaxy S26 Ultra, S26+, and S26",
      url: UK,
      description:
        "S26: 6.3-inch FHD+, 71.7 x 149.6 x 7.2 mm, 167 g, Exynos 2600 (2nm), 12 GB, 256 GB or 512 GB, 4,300 mAh. Ultra: 6.9-inch QHD+, S Pen, 78.1 x 163.6 x 7.9 mm, 214 g, Snapdragon 8 Elite Gen 5 for Galaxy (3nm), 12 GB or 16 GB, 256 GB, 512 GB, or 1 TB, 5,000 mAh, 5x and 3x optical zoom, digital zoom up to 100x. Built-in Privacy Display on the Ultra. Models may vary by country.",
    },
    {
      type: "external",
      label: "Samsung Ireland Galaxy S26 compare",
      url: IE,
      description:
        "Video playback up to 30 hours on the Galaxy S26 and up to 31 hours on the Galaxy S26 Ultra. Super Fast Charging 3.0 gets around 75% in up to 30 minutes on the Ultra. Screen: 6.3 inches full rectangle and 6.1 inches with rounded corners, against 6.9 inches and 6.7 inches. 2,600 nits. Actual battery life varies.",
    },
    {
      type: "external",
      label: "Samsung US Galaxy S26",
      url: US_S26,
      description:
        "Exynos 2600 for the Galaxy S26 and Galaxy S26+. Up to 30 hours of video on the Galaxy S26. 12 GB with 256 GB or 512 GB. 3x optical zoom and digital zoom up to 30x. Does not list a Privacy Display for the Galaxy S26.",
    },
    {
      type: "external",
      label: "Samsung US Galaxy S26 Ultra",
      url: US_ULTRA,
      description:
        "Snapdragon 8 Elite Gen 5 for Galaxy. Built-in S Pen. Built-in Privacy Display. 50 MP telephoto with 5x optical zoom. 31 hours of video playback. 5,000 mAh typical battery.",
    },
  ],
  metaTitle: "Galaxy S26 vs S26 Ultra | A Versus B",
});
