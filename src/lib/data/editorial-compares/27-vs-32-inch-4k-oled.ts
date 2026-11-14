import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-420 — 27-inch vs 32-inch 4K OLED, same 3840 by 2160 grid.
 * Opened 12 November 2026 (Asia/Jerusalem):
 * HP Tech Takes, "Monitor Size", 22 October 2026;
 * OSHA eTools, Computer Workstations, Monitors.
 * PPI and 16:9 size are the diagonal formula, not a panel measurement.
 * dataPointCount stays 0. No winner. No prices. No frame-rate figures.
 * Reddit returned HTTP 403, so no comment text and no reply count.
 * No named monitor. A marketed 32-inch screen can be 31.5 inches viewable.
 */

const PUBLISHED = "2026-11-12T00:00:00Z";
const SOURCE_DATE = "2026-11-12";

const INCH_27 = "27-inch-4k";
const INCH_32 = "32-inch-4k";

const HP = "https://www.hp.com/us-en/tech-takes/monitors/glossary/monitor-size.html";
const OSHA = "https://www.osha.gov/etools/computer-workstations/components/monitors";

const SHORT_ANSWER = `Choose a 27-inch 4K OLED if you sit in HP's 22 October 2026 starting range of about 24 to 32 inches, or if you want 163.18 pixels per inch on a 27-inch 3840 by 2160 diagonal. Choose a 32-inch 4K OLED if you can sit in HP's starting range of about 28 to 36 inches for a 31.5- to 32-inch monitor and you want the larger 16:9 area, exactly 1024/729 times a 27-inch 16:9 area, at 137.68 pixels per inch on a stated 32.0-inch diagonal.`;

const CHOOSE_TABLE = [
  "Choose-if rows. Distances and the competitive-play wording are HP's 22 October 2026 monitor-size guide. Density and area are the diagonal formula. No row is a ranked result.",
  "| Situation | Choose 27-inch 4K if | Choose 32-inch 4K if |",
  "| --- | --- | --- |",
  "| Competitive games | You want the size HP's guide associates with keeping the whole screen in view, 24 to 27 inches | You can sit about 28 inches or farther, HP's start for a 31.5- to 32-inch monitor |",
  "| Mixed desk use | Your eye-to-screen distance is about 24 to 32 inches | Your desk lets you use about 28 to 36 inches |",
  "| Single-player, video, workspace | You want 163.18 pixels per inch and the 27-inch 16:9 area | You want exactly 1024/729 times that area, at 137.68 pixels per inch on a stated 32.0-inch diagonal |",
].join("\n");

const NUMBER_TABLE = [
  "Square-pixel density and 16:9 width and height from the diagonal formula, with HP's 22 October 2026 labels beside them. Geometry only. Not a measurement of one shipping panel.",
  "| Figure | 27-inch 4K | 31.5-inch 4K | 32.0-inch 4K |",
  "| --- | --- | --- | --- |",
  "| Pixel grid | 3840 by 2160 | 3840 by 2160 | 3840 by 2160 |",
  "| Pixel count | 8,294,400 | 8,294,400 | 8,294,400 |",
  "| Formula density | 163.18 PPI | 139.87 PPI | 137.68 PPI |",
  "| HP density label | About 163 PPI | About 140 PPI | Not an HP row |",
  "| Formula width by height | 23.53 by 13.24 inches | 27.45 by 15.44 inches | 27.89 by 15.69 inches |",
  "| HP width by height | 23.5 by 13.2 inches | 27.5 by 15.4 inches | Not an HP row |",
].join("\n");

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways.

- Choose a 27-inch 4K OLED if you sit about 24 to 32 inches away, or if you want 163.18 pixels per inch.
- Choose a 32-inch 4K OLED if you can sit about 28 to 36 inches away and you want exactly 1024/729 times the 27-inch 16:9 area.
- Both grids are 3840 by 2160, so both contain 8,294,400 pixels. The diagonal does not change that count.
- OSHA says the preferred viewing distance is generally 20 to 40 inches from the eye to the front of the screen.
- HP's 22 October 2026 guide says many desks are 24 to 30 inches deep, and a monitor sold as 32 inches can be a 31.5-inch viewable diagonal.
- A burn-in rate, a lifetime, and a warranty term are not in these documents.

## Which size to choose

Choose a 27-inch 4K OLED when HP's closer starting range fits, or when you want the denser of these two 4K diagonals. Choose a 32-inch 4K OLED when you can use the farther starting range and you want the larger 16:9 area.

${CHOOSE_TABLE}

## Density and area use one formula

Divide the square root of width squared plus height squared by the stated diagonal. For 3840 and 2160, 3840 squared is 14,745,600 and 2160 squared is 4,665,600. The square root of 19,411,200 is 4,405.8143... Dividing by 27 gives 163.1783..., which rounds to 163.18 pixels per inch. Dividing by 32 gives 137.6816..., which rounds to 137.68. Dividing by 31.5 gives 139.8671..., which rounds to 139.87. The nearest whole numbers are 163, 138, and 140.

HP's 22 October 2026 table says about 163 PPI for 27-inch 4K and about 140 PPI for 31.5-inch 4K. That table has no 32.0-inch 4K row, so 137.68 is the formula on a stated 32.0-inch diagonal, not an HP label. The nearest whole number, 138, is that same rounding. For 2560 and 1440, 2560 squared is 6,553,600 and 1440 squared is 2,073,600. The square root of 8,627,200 divided by 27 gives 108.7855..., which rounds to 108.79. HP says about 109 PPI for 27-inch QHD (2560 by 1440). Rounding happens after the division. A different diagonal changes the result. The formula assumes square pixels and uses the diagonal stated with it. It is not a measurement of one shipping panel.

Width in inches is the diagonal times 16, divided by the square root of 337, because 16 squared plus 9 squared is 337. Height uses 9 in that same division. On 27 inches the results are 23.5325... by 13.2370..., which round to 23.53 by 13.24. HP gives 23.5 by 13.2 for 27-inch 16:9, the same figures to one decimal. On a stated 32.0 inches the results are 27.8904... by 15.6883..., which round to 27.89 by 15.69, and to 27.9 by 15.7 at one decimal. HP's size table gives 31.5-inch 16:9 as 27.5 by 15.4 and does not give a 32.0-inch row. The 31.5-inch formula results are 27.4546... by 15.4432..., which round to 27.45 by 15.44 and to 27.5 by 15.4 at one decimal.

When the aspect ratio stays 16:9, area scales with the square of the diagonal. 32 divided by 27, squared, is 1024/729, which is 1.40466... The 32.0-inch 16:9 area is 295/729 more than the 27-inch 16:9 area, which is 40.466... percent, about 40 percent. That ratio uses a true 32.0-inch diagonal. It is not HP's 31.5-inch row. HP says many monitors are listed with a decimal size, such as 31.5 inches, and marketed as 32-inch models. Use the viewable diagonal on the spec you are buying.

${NUMBER_TABLE}

HP also says that when the same resolution is spread across a larger screen, each pixel gets bigger, so text and images can look softer up close. That sentence is about pixel size at one resolution. It is not a frame-rate result.

## Viewing distance and desk depth

Sit where you can read the screen with your head and torso upright. OSHA says the preferred viewing distance is generally between 20 and 40 inches (50 and 100 cm) from the eye to the front surface of the screen, and its quick tip is to put the monitor directly in front of you and at least 20 inches away.

HP's 22 October 2026 guide uses that 20-to-40-inch range. Inside it, the guide's starting points are about 24 to 32 inches for a 27-inch monitor and about 28 to 36 inches for a 31.5- to 32-inch monitor. HP calls those general starting points and says to adjust for eyesight, text size, and comfort. HP says many desks are 24 to 30 inches deep, and that the monitor stand takes up part of that depth. HP's own question on a 32-inch monitor says it is not too big for most desks that are at least 30 inches deep, if you can sit roughly 28 inches or more from the screen, and that on a shallower desk it may feel overwhelming, with a 27-inch monitor or a monitor arm as the more comfortable option. Measure eye-to-screen distance on your desk. Desk depth is not the same number as eye-to-screen distance, because the stand uses part of the depth.

OSHA also says the top of the monitor should be at or slightly below eye level, and that the center should normally be 15 to 20 degrees below horizontal eye level. OSHA says using very large monitors may increase the downward viewing angle. That is a placement note, not a size ranking.

## Competitive play and a lower-resolution mode

HP's 22 October 2026 guide says some competitive gamers prefer 24- to 27-inch monitors so the whole screen stays in view without moving their eyes, and that many competitive players prefer 24 to 27 inches to keep the whole screen in view. The same guide says a very large screen on a shallow desk can force you to turn your head or your eyes more than is comfortable. Those are the guide's general statements. They are not a vision study, and they do not mention a HUD or a minimap.

A 32-inch 4K OLED can still be the size you choose if your eye-to-screen distance is in HP's about 28 to 36 inch starting range. Some 4K monitors can switch to a lower-resolution grid at a higher refresh rate. That mode changes the pixel count the graphics card draws. It is a feature of that model, not a result of the 32-inch diagonal. No model is named here. Confirm the mode on the maker's current specification.

## Single-player games, video, and workspace

Choose the 32.0-inch diagonal when you want the larger 16:9 area. That area is exactly 1024/729 times the 27-inch 16:9 area, about 40 percent more, at 137.68 pixels per inch. Choose the 27-inch diagonal when you want 163.18 pixels per inch on the same 3840 by 2160 grid. HP's 22 October 2026 guide says larger and curved screens suit immersive, story-driven games, and it pairs a 27- to 32-inch 4K monitor with photo, video, and design work. A curve is not part of the diagonal formula.

Against a 27-inch 2560 by 1440 grid, 137.68 is the higher density and 108.79 is the lower one. Against a 27-inch 3840 by 2160 grid, 137.68 is the lower density and 163.18 is the higher one. HP's "about 109" and "about 163" are the whole-number labels for those 27-inch rows.

## Moving up from a 27-inch 1440p screen

The pixel count is what changes first. 2560 by 1440 is 3,686,400 pixels. 3840 by 2160 is 8,294,400. Dividing those counts gives exactly 2.25, because each side of the 4K grid is 1.5 times the matching side of the 1440p grid, and 1.5 times 1.5 is 2.25. That 2.25 ratio is the same at 27 inches and at 32 inches. It counts pixels. It is not a frame-rate measurement.

Staying at 27 inches keeps the same 16:9 area, because the diagonal and the aspect ratio stay put, and it moves the density from 108.79 to 163.18 pixels per inch. Moving to a stated 32.0-inch diagonal keeps the 8,294,400-pixel grid, rounds to 137.68 pixels per inch, and multiplies the 16:9 area by exactly 1024/729. Refresh rate is not in these documents. The refresh rate of the monitor you have now is not a property of the new diagonal.

## The graphics card draws the same 4K grid

A 32-inch 4K grid does not add pixels over a 27-inch 4K grid. Both are 3840 by 2160, which is 8,294,400 pixels. At the same resolution and the same settings, the diagonal does not change how many pixels the graphics card draws. A frame-rate figure is not in these documents. A mode that drops the monitor to a lower-resolution grid does change the pixel count, and that mode is a model feature.

The step up from 2560 by 1440 is different. That step is the 2.25 pixel-count ratio, and it is the same ratio at either 4K diagonal.

## OLED care is not a size result

No burn-in rate, lifetime, or warranty term is in these documents, at either diagonal. For two monitors of the same panel type, the diagonal does not add a separate care rule here. Read the warranty on the model you buy. Panel type is a separate question.

1440p vs 4K at 27 inches compares 2560 by 1440 with 3840 by 2160 on one 27-inch diagonal. Ultrawide vs 4K monitor compares a 3440 by 1440 grid with a 3840 by 2160 grid. QD-OLED vs WOLED compares two OLED stacks. None of those three is this size question.`;

const FAQS = [
  {
    question: "Is 32 inches too big for competitive gaming?",
    answer:
      "HP's 22 October 2026 guide says many competitive players prefer 24 to 27 inches to keep the whole screen in view, and that a very large screen on a shallow desk can force you to turn your head or your eyes more than is comfortable. The same guide says a 32-inch monitor is not too big for most desks that are at least 30 inches deep, if you can sit roughly 28 inches or more from the screen. Those are the guide's general statements, not a vision study, and they do not mention a HUD or a minimap.",
  },
  {
    question: "Is 4K dense enough on a 32-inch monitor?",
    answer:
      "A stated 32.0-inch 3840 by 2160 diagonal rounds to 137.68 pixels per inch. A 27-inch 3840 by 2160 diagonal rounds to 163.18, and a 27-inch 2560 by 1440 diagonal rounds to 108.79. HP's 22 October 2026 table says about 163 PPI for 27-inch 4K and about 109 PPI for 27-inch QHD. It has no 32.0-inch 4K row. Its 31.5-inch 4K row says about 140 PPI, and the same formula at 31.5 inches rounds to 139.87. HP says the same resolution spread across a larger screen makes each pixel bigger, so text and images can look softer up close.",
  },
  {
    question: "How far should I sit from a 27-inch or 32-inch monitor?",
    answer:
      "OSHA says the preferred viewing distance is generally between 20 and 40 inches (50 and 100 cm) from the eye to the front of the screen. HP's 22 October 2026 guide gives starting points of about 24 to 32 inches for a 27-inch monitor and about 28 to 36 inches for a 31.5- to 32-inch monitor. HP says many desks are 24 to 30 inches deep and that the stand uses part of that depth. Measure eye-to-screen distance before you choose.",
  },
  {
    question: "Does a 32-inch 4K monitor need a faster graphics card than a 27-inch 4K monitor?",
    answer:
      "No. Both sizes here are 3840 by 2160, which is 8,294,400 pixels, so the diagonal does not change the pixel count. A frame-rate figure is not in these documents. Same resolution and same settings are the assumption. A mode that switches the monitor to a lower-resolution grid changes the pixel count, and that mode is a model feature, not the diagonal.",
  },
  {
    question: "What changes if I move from a 27-inch 1440p screen to 27-inch 4K or 32-inch 4K?",
    answer:
      "The pixel count goes from 3,686,400 to 8,294,400, exactly 2.25 times, at either 4K diagonal. Staying at 27 inches keeps the same 16:9 area and moves the density from 108.79 to 163.18 pixels per inch. A stated 32.0-inch diagonal stays on the 8,294,400-pixel grid, rounds to 137.68 pixels per inch, and multiplies the 16:9 area by exactly 1024/729. Refresh rate is not in these documents.",
  },
  {
    question: "Does the diagonal change OLED burn-in care?",
    answer:
      "No burn-in rate, lifetime, or warranty term is in these documents, at either size. For two monitors of the same panel type, the diagonal does not add a separate care rule here. Read the warranty on the model you buy. Panel type is the separate comparison QD-OLED vs WOLED.",
  },
];

const VERDICT = `Choose a 27-inch 4K OLED if you sit in HP's starting range of about 24 to 32 inches, or if you want 163.18 pixels per inch. Choose a 32-inch 4K OLED if you can sit in the about 28 to 36 inch starting range and you want exactly 1024/729 times the 27-inch 16:9 area, at 137.68 pixels per inch on a stated 32.0-inch diagonal.

Both grids are 3840 by 2160, so both contain 8,294,400 pixels. OSHA's preferred viewing distance is generally 20 to 40 inches. A burn-in rate is not in these documents.`;

const BUILT = buildEditorialComparison({
  slug: "27-vs-32-inch-4k-oled",
  title: "27 vs 32 Inch 4K OLED?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: INCH_27,
      slug: INCH_27,
      name: "27-inch 4K OLED",
      shortDesc: "A 3840 by 2160 grid on a 27-inch 16:9 diagonal, 163.18 pixels per inch by the formula.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [],
      cons: [],
      bestFor: null,
    },
    {
      id: INCH_32,
      slug: INCH_32,
      name: "32-inch 4K OLED",
      shortDesc: "A 3840 by 2160 grid on a stated 32.0-inch 16:9 diagonal, 137.68 pixels per inch by the formula.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [],
      cons: [],
      bestFor: null,
    },
  ],
  keyDifferences: [
    {
      label: "Pixel grid",
      entityAValue: "3840 by 2160, 8,294,400 pixels",
      entityBValue: "3840 by 2160, 8,294,400 pixels",
      winner: "tie",
    },
    {
      label: "Square-pixel density",
      entityAValue: "163.18 pixels per inch at 27 inches, rounded after the division",
      entityBValue: "137.68 pixels per inch at a stated 32.0 inches. HP's about 140 PPI is the 31.5-inch row",
      winner: "tie",
    },
    {
      label: "16:9 size",
      entityAValue: "23.53 by 13.24 inches. HP gives 23.5 by 13.2",
      entityBValue: "27.89 by 15.69 inches at 32.0. Area is exactly 1024/729 times the 27-inch 16:9 area",
      winner: "tie",
    },
    {
      label: "HP starting distance, 22 October 2026",
      entityAValue: "About 24 to 32 inches",
      entityBValue: "About 28 to 36 inches for a 31.5- to 32-inch monitor",
      winner: "tie",
    },
    {
      label: "OSHA viewing distance",
      entityAValue: "Generally 20 to 40 inches from the eye to the screen",
      entityBValue: "Generally 20 to 40 inches from the eye to the screen",
      winner: "tie",
    },
    {
      label: "Graphics-card pixel count",
      entityAValue: "8,294,400 pixels at 3840 by 2160. No frame-rate figure",
      entityBValue: "8,294,400 pixels at 3840 by 2160. No frame-rate figure",
      winner: "tie",
    },
    {
      label: "Burn-in",
      entityAValue: "No rate, lifetime, or warranty term in these documents",
      entityBValue: "No rate, lifetime, or warranty term in these documents",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "grid",
      "Pixel grid",
      "Resolution",
      INCH_27,
      INCH_32,
      "3840 by 2160. 3840 times 2160 is 8,294,400",
      "3840 by 2160. The same 8,294,400 pixels",
    ),
    textAttr(
      "ppi",
      "Square-pixel density",
      "Density",
      INCH_27,
      INCH_32,
      "163.18 pixels per inch. sqrt(19,411,200) / 27, then rounded to two decimals",
      "137.68 pixels per inch. sqrt(19,411,200) / 32, then rounded to two decimals",
    ),
    textAttr(
      "hp-ppi",
      "HP density label, 22 October 2026",
      "Density",
      INCH_27,
      INCH_32,
      "About 163 PPI for 27-inch 4K. About 109 PPI for 27-inch QHD",
      "No 32.0-inch row. The 31.5-inch 4K row says about 140 PPI, and the formula rounds to 139.87",
    ),
    textAttr(
      "inches",
      "16:9 width and height",
      "Size",
      INCH_27,
      INCH_32,
      "23.53 by 13.24 inches. HP gives 23.5 by 13.2",
      "27.89 by 15.69 inches at a stated 32.0-inch diagonal. HP does not give this row",
    ),
    textAttr(
      "area",
      "16:9 area ratio",
      "Size",
      INCH_27,
      INCH_32,
      "The reference area for a 27-inch 16:9 diagonal",
      "Exactly 1024/729 times the 27-inch 16:9 area, which is 1.40466... and about 40 percent more",
    ),
    textAttr(
      "distance",
      "Suggested starting distance",
      "Distance",
      INCH_27,
      INCH_32,
      "HP, 22 October 2026: about 24 to 32 inches. OSHA: generally 20 to 40 inches",
      "HP, 22 October 2026: about 28 to 36 inches for 31.5 to 32 inches. OSHA: generally 20 to 40 inches",
    ),
    textAttr(
      "burn-in",
      "Burn-in",
      "OLED",
      INCH_27,
      INCH_32,
      "No rate, lifetime, or warranty term in these documents",
      "No rate, lifetime, or warranty term in these documents. Same panel type does not gain a size rule here",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "1440p-vs-4k-monitor",
      title: "1440p vs 4K at 27 inches",
      category: "technology",
    },
    {
      slug: "ultrawide-vs-4k-monitor",
      title: "Ultrawide (3440 by 1440) vs 4K monitor",
      category: "technology",
    },
    {
      slug: "qd-oled-vs-woled",
      title: "QD-OLED vs WOLED panel types",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "A stated 32.0-inch 3840 by 2160 diagonal rounds to 137.68 pixels per inch, and its 16:9 area is exactly 1024/729 times a 27-inch 16:9 area.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "HP Tech Takes: Monitor Size (22 October 2026)", url: HP },
      { name: "OSHA: computer workstation monitors", url: OSHA },
    ],
  },
  resources: [
    {
      type: "external",
      label: "HP Tech Takes: Monitor Size (22 October 2026)",
      url: HP,
      description:
        "22 October 2026. Diagonal is the viewable screen. 27-inch 16:9 is 23.5 by 13.2 inches. 31.5-inch 16:9 is 27.5 by 15.4 inches. About 163 PPI for 27-inch 4K, about 109 PPI for 27-inch QHD, about 140 PPI for 31.5-inch 4K. Starting distances: about 24 to 32 inches at 27 inches, and about 28 to 36 inches at 31.5 to 32 inches. Many desks are 24 to 30 inches deep. A marketed 32-inch monitor can be 31.5 inches viewable.",
    },
    {
      type: "external",
      label: "OSHA: computer workstation monitors",
      url: OSHA,
      description:
        "Preferred viewing distance is generally between 20 and 40 inches (50 and 100 cm) from the eye to the front of the screen. Put the monitor directly in front of you and at least 20 inches away. Top of the screen at or slightly below eye level. Center normally 15 to 20 degrees below horizontal eye level. Very large monitors may increase the downward viewing angle.",
    },
    {
      type: "blog",
      label: "1440p vs 4K at 27 inches",
      url: "/compare/1440p-vs-4k-monitor",
      description: "A separate question: 2560 by 1440 against 3840 by 2160 on one 27-inch diagonal.",
    },
    {
      type: "blog",
      label: "Ultrawide (3440 by 1440) vs 4K monitor",
      url: "/compare/ultrawide-vs-4k-monitor",
      description: "A separate question: a 3440 by 1440 grid against a 3840 by 2160 grid.",
    },
    {
      type: "blog",
      label: "QD-OLED vs WOLED panel types",
      url: "/compare/qd-oled-vs-woled",
      description: "A separate question: two OLED stacks, not 27 inches against 32 inches.",
    },
  ],
  metaTitle: "27 vs 32 Inch 4K OLED?",
});

BUILT.metadata.metaDescription =
  "Choose a 27-inch 4K OLED at 24 to 32 inches, or a 32-inch 4K OLED at 28 to 36 inches. The 32-inch 16:9 area is exactly 1024/729 times the 27-inch area.";

export const MONITOR_27_VS_32_INCH_4K_OLED: EditorialComparison = BUILT;
