import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-400 — 1440p vs 4K on a nominal 27-inch 16:9 panel.
 * Sources opened 9 November 2026 (Asia/Jerusalem):
 * Dell UltraSharp U2723QE user's guide, Rev. A05, September 2023;
 * ASUS ProArt Display PA278CGV tech specs;
 * Microsoft Learn, "DPI and device-independent pixels".
 * Reddit returned HTTP 403, so there is no community block.
 * Apple's Mac User Guide page on display resolution does not support a
 * HiDPI, 2x, or "1440p looks soft on a Mac" claim, so those are omitted.
 * No winner. No prices, frame rates, or eyesight claims.
 * dataPointCount stays 0: the density figures are arithmetic, not a
 * measurement dataset. PR 523 owns the shared "0 data points" wording.
 */

const PUBLISHED = "2026-11-09T00:00:00Z";
const SOURCE_DATE = "2026-11-09";

const P1440 = "1440p";
const P4K = "4k";

const DELL =
  "https://dl.dell.com/content/manual12109242-dell-u2723qe-monitor-user-s-guide.pdf";
const ASUS =
  "https://www.asus.com/displays-desktops/monitors/proart/proart-display-pa278cgv/techspec/";
const MICROSOFT =
  "https://learn.microsoft.com/en-us/windows/win32/learnwin32/dpi-and-device-independent-pixels";

const SHORT_ANSWER = `The 4K grid used here is 3840 by 2160, which has 8,294,400 pixels, and the 1440p grid is 2560 by 1440, which has 3,686,400, so the 4K grid has exactly 2.25 times as many pixels. On a 27-inch diagonal, square-pixel density is the square root of width squared plus height squared, divided by 27, which rounds to 163.18 pixels per inch for 3840 by 2160 and to 108.79 for 2560 by 1440.`;

const EXPERT_ANALYSIS = `The 4K grid used here is 3840 by 2160, which has 8,294,400 pixels, and the 1440p grid is 2560 by 1440, which has 3,686,400, so the 4K grid has exactly 2.25 times as many pixels. On a 27-inch diagonal, square-pixel density is the square root of width squared plus height squared, divided by 27, which rounds to 163.18 pixels per inch for 3840 by 2160 and to 108.79 for 2560 by 1440.

Key takeaways. A 3840 by 2160 grid contains 8,294,400 pixels, and a 2560 by 1440 grid contains 3,686,400. Dividing those counts gives exactly 2.25, because each side of the 4K grid is 1.5 times the matching side of the 1440p grid, and 1.5 times 1.5 is 2.25. On a 27-inch diagonal the same square-pixel formula rounds to 163.18 pixels per inch and 108.79 pixels per inch. Dell's U2723QE user's guide, Rev. A05 (September 2023), publishes 163.18 for its 27.0-inch 3840 by 2160 panel, and ASUS publishes 109 for the 27-inch PA278CGV at 2560 by 1440, which is 108.79 rounded to a whole number. The 2.25 ratio counts pixels. It does not measure frame rate or graphics-card load. At Windows 150 percent (144 DPI), Microsoft's conversion of a 3840 by 2160 pixel grid is 2560 by 1440 device-independent pixels, and only when that scale is the one in effect.

Names and two published panels. 1440p here means 2560 by 1440. 4K here means 3840 by 2160. ASUS lists the ProArt Display PA278CGV at a 27-inch panel size, 16:9, resolution 2560 by 1440, and 109 pixels per inch. Dell's user's guide title calls the U2723QX, U2723QE, and U3223QE series a 27/32 4K monitor, and the U2723QE specification is a 68.47 cm (27.0 in.) active area measured diagonally, with 3840 by 2160 at 16:9. The same guide gives 163.18 pixels per inch for that 27-inch panel, and its presets include UHD 3840 by 2160 at 60 Hz on DisplayPort and on HDMI. Those two monitors are examples of the grids. They are not a catalog of every 27-inch panel.

How the density is rounded. Square each side, add, take the square root, and divide by 27. For 2560 and 1440, 2560 squared is 6,553,600 and 1440 squared is 2,073,600. The square root of 8,627,200 is 2,937.21 to two decimals, and dividing the full square root by 27 gives 108.7855..., which rounds to 108.79. For 3840 and 2160, 3840 squared is 14,745,600 and 2160 squared is 4,665,600. The square root of 19,411,200 is 4,405.81 to two decimals, and dividing the full square root by 27 gives 163.1783..., which rounds to 163.18. Rounding happens after the division. ASUS prints 109, the nearest whole number to 108.79. Dell prints 163.18, the same two-decimal rounding. A different diagonal changes the result. The formula assumes square pixels and uses the 27-inch diagonal each company states.

What 2.25 does not say. 3840 divided by 2560 is 1.5, and 2160 divided by 1440 is 1.5. Multiplying those ratios gives 2.25, the same result as 8,294,400 divided by 3,686,400. That is a count of pixels. It is not a measured change in frame rate, and it is not a measured change in graphics-card load.

Windows scaling at 150 percent. Microsoft says one logical inch equals 96 pixels, and lists the standard settings as 100 percent (96 DPI), 125 percent (120 DPI), and 150 percent (144 DPI). A device-independent pixel is 1/96 of a logical inch. At 144 DPI, Microsoft's table maps one device-independent pixel to 1.5 physical pixels. The conversion is device-independent pixels = pixels / (DPI / 96). With DPI at 144, the divisor is 1.5, so 3840 becomes 2560 and 2160 becomes 1440. Microsoft also says the user can apply a custom setting, that DPI has been a per-user setting since Windows 7, and that physical inches are not a useful measure of text size because there is no fixed relation between physical inches and pixels. A program that is not DPI-aware is scaled by the desktop window manager after the window is drawn, and Microsoft says that scaling can look blurry. The 2560 by 1440 device-independent result is that conversion when 150 percent is the scale in effect. It is not a rule for macOS, and it is not a perception test.

Refresh, color, and HDR stay on the model. ASUS lists a 144 Hz maximum refresh rate on the PA278CGV. Dell's U2723QE presets include 3840 by 2160 at 60 Hz. Those are lines on these two spec sheets. A pixel count does not assign a refresh rate, a color gamut, or an HDR format.

Panel type is a separate question from this pixel grid. QD-OLED vs WOLED compares two OLED stacks. OLED vs Mini-LED compares an OLED gaming monitor with a Mini-LED LCD.`;

const FAQS = [
  {
    question: "How many pixels are in 1440p and in 4K?",
    answer:
      "1440p here is 2560 by 1440, which is 3,686,400 pixels. 4K here is 3840 by 2160, which is 8,294,400 pixels. Dividing 8,294,400 by 3,686,400 gives exactly 2.25.",
  },
  {
    question: "What is the pixel density of 1440p and 4K at 27 inches?",
    answer:
      "For square pixels, divide the square root of width squared plus height squared by 27. That rounds to 108.79 pixels per inch for 2560 by 1440 and to 163.18 for 3840 by 2160. ASUS publishes 109 for the 27-inch PA278CGV, which is 108.79 rounded to a whole number. Dell's U2723QE user's guide, Rev. A05 (September 2023), publishes 163.18 for its 27.0-inch 3840 by 2160 panel.",
  },
  {
    question: "Does 2.25 times the pixels mean 2.25 times the graphics work?",
    answer:
      "No. 2.25 is 8,294,400 divided by 3,686,400. It counts pixels. It is not a measurement of frame rate or of graphics-card load.",
  },
  {
    question: "What does 150% scaling mean for 3840 by 2160 in Windows?",
    answer:
      "Microsoft lists 150% as 144 DPI, against a 96 DPI baseline at 100%, and maps one device-independent pixel to 1.5 physical pixels at 144 DPI. Dividing 3840 and 2160 by 1.5 gives 2560 by 1440 device-independent pixels when that scale is in effect. Microsoft also says a user can set a different DPI, and that a program which is not DPI-aware is scaled after it is drawn and can look blurry.",
  },
  {
    question: "Do these figures decide which monitor to buy?",
    answer:
      "No. They are pixel counts and a square-pixel density for a 27-inch diagonal. They are not a perception test, and they are not a buying rule. Refresh rate, color, and HDR stay on each model's spec.",
  },
];

const VERDICT = `The 4K grid used here is 3840 by 2160 (8,294,400 pixels) and the 1440p grid is 2560 by 1440 (3,686,400 pixels), so the pixel-count ratio is exactly 2.25. On a 27-inch diagonal the square-pixel formula rounds to 163.18 pixels per inch and 108.79 pixels per inch.

That 2.25 ratio is the pixel count. It is not a frame-rate result. Windows 150% (144 DPI) converts a 3840 by 2160 pixel grid to 2560 by 1440 device-independent pixels only when that scale is in effect.`;

const BUILT = buildEditorialComparison({
  slug: "1440p-vs-4k-monitor",
  title: "1440p vs 4K at 27 Inches?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: P1440,
      slug: P1440,
      name: "27-inch 1440p",
      shortDesc: "A 2560 by 1440 grid on a 27-inch 16:9 diagonal.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [],
      cons: [],
      bestFor: null,
    },
    {
      id: P4K,
      slug: P4K,
      name: "27-inch 4K",
      shortDesc: "A 3840 by 2160 grid on a 27-inch 16:9 diagonal.",
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
      entityAValue: "2560 by 1440",
      entityBValue: "3840 by 2160",
      winner: "tie",
    },
    {
      label: "Pixel count",
      entityAValue: "3,686,400",
      entityBValue: "8,294,400, exactly 2.25 times the 1440p count",
      winner: "tie",
    },
    {
      label: "27-inch square-pixel density",
      entityAValue: "108.79 pixels per inch, rounded after dividing by 27",
      entityBValue: "163.18 pixels per inch, rounded after dividing by 27",
      winner: "tie",
    },
    {
      label: "Published example",
      entityAValue: "ASUS PA278CGV: 27-inch, 2560 by 1440, 109 PPI",
      entityBValue: "Dell U2723QE guide, Rev. A05: 27.0-inch, 3840 by 2160, 163.18 PPI",
      winner: "tie",
    },
    {
      label: "Windows 150% (144 DPI)",
      entityAValue: "100% is 96 DPI. 150% is not a required setting for this grid",
      entityBValue: "3840 by 2160 becomes 2560 by 1440 device-independent pixels only while 150% scaling is in effect",
      winner: "tie",
    },
    {
      label: "Example model refresh",
      entityAValue: "ASUS lists 144 Hz maximum on the PA278CGV",
      entityBValue: "Dell U2723QE presets include 3840 by 2160 at 60 Hz",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "grid",
      "Pixel grid",
      "Resolution",
      P1440,
      P4K,
      "2560 by 1440. ASUS lists this resolution on the 27-inch PA278CGV",
      "3840 by 2160. Dell's U2723QE guide specifies this resolution at 16:9",
    ),
    textAttr(
      "count",
      "Pixel count",
      "Resolution",
      P1440,
      P4K,
      "3,686,400",
      "8,294,400. The ratio to 3,686,400 is exactly 2.25",
    ),
    textAttr(
      "ppi",
      "Square-pixel density at 27 inches",
      "Density",
      P1440,
      P4K,
      "108.79 pixels per inch. sqrt(8,627,200) / 27, then rounded to two decimals",
      "163.18 pixels per inch. sqrt(19,411,200) / 27, then rounded to two decimals",
    ),
    textAttr(
      "published-ppi",
      "Published PPI on one 27-inch example",
      "Density",
      P1440,
      P4K,
      "109, the whole number ASUS prints for the PA278CGV",
      "163.18, the figure in the Dell U2723QE user's guide, Rev. A05 (September 2023)",
    ),
    textAttr(
      "windows-150",
      "Windows scale at 150%",
      "Scaling",
      P1440,
      P4K,
      "Microsoft lists 100% as 96 DPI. 150% is 144 DPI, and a user can choose another setting",
      "3840 / 1.5 = 2560 and 2160 / 1.5 = 1440 device-independent pixels when 150% is in effect",
    ),
    textAttr(
      "refresh-example",
      "Refresh on the example model",
      "Model spec",
      P1440,
      P4K,
      "144 Hz maximum on the ASUS PA278CGV. A model line, not a rule for every 2560 by 1440 panel",
      "60 Hz for 3840 by 2160 in the Dell U2723QE presets. A model line, not a rule for every 4K panel",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "qd-oled-vs-woled",
      title: "QD-OLED vs WOLED Gaming Monitor",
      category: "technology",
    },
    {
      slug: "oled-vs-mini-led-gaming-monitor",
      title: "OLED vs Mini-LED Gaming Monitor",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "On a 27-inch diagonal the square-pixel formula rounds to 108.79 pixels per inch for 2560 by 1440 and to 163.18 for 3840 by 2160.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      {
        name: "Dell UltraSharp U2723QE user's guide, Rev. A05 (September 2023)",
        url: DELL,
      },
      { name: "ASUS ProArt Display PA278CGV tech specs", url: ASUS },
      { name: "Microsoft Learn: DPI and device-independent pixels", url: MICROSOFT },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Dell U2723QE user's guide, Rev. A05 (September 2023)",
      url: DELL,
      description:
        "U2723QE: 68.47 cm (27.0 in.) active area measured diagonally, 3840 by 2160 at 16:9, 163.18 pixels per inch. Preset table: UHD 3840 by 2160 at 60 Hz on DisplayPort and HDMI. The guide title calls the series a 27/32 4K monitor.",
    },
    {
      type: "external",
      label: "ASUS ProArt Display PA278CGV tech specs",
      url: ASUS,
      description:
        "Panel size 27 inches, aspect ratio 16:9, resolution 2560 by 1440, 109 pixels per inch, refresh rate maximum 144 Hz.",
    },
    {
      type: "external",
      label: "Microsoft Learn: DPI and device-independent pixels",
      url: MICROSOFT,
      description:
        "One logical inch equals 96 pixels. Standard settings include 100% (96 DPI), 125% (120 DPI), and 150% (144 DPI). At 144 DPI a device-independent pixel is 1.5 physical pixels. DIPs = pixels / (DPI / 96). A program that is not DPI-aware can look blurry because scaling is applied after the window is drawn.",
    },
    {
      type: "blog",
      label: "QD-OLED vs WOLED Gaming Monitor",
      url: "/compare/qd-oled-vs-woled",
      description: "A separate monitor question: two OLED stacks, not this pixel-grid comparison.",
    },
    {
      type: "blog",
      label: "OLED vs Mini-LED Gaming Monitor",
      url: "/compare/oled-vs-mini-led-gaming-monitor",
      description: "A separate monitor question: OLED against Mini-LED, not 1440p against 4K.",
    },
  ],
  metaTitle: "1440p vs 4K at 27 Inches?",
});

BUILT.metadata.metaDescription =
  "4K (3840 by 2160) has exactly 2.25 times the pixels of 1440p (2560 by 1440). At 27 inches the formula rounds to 163.18 and 108.79 PPI.";

export const MONITOR_1440P_VS_4K: EditorialComparison = BUILT;
