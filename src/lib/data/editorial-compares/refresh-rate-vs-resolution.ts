import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-483 — refresh rate vs resolution.
 * Opened 21 November 2026 (Asia/Jerusalem):
 * RTINGS refresh-rate test, updated 20 May 2026;
 * ASUS Edge Up, 4 January 2026 (maker);
 * Intel refresh-rate guide;
 * Apple Studio Display technical specifications;
 * Apple Mac help, "Change your Mac display's resolution";
 * Sony PlayStation 5 support guide.
 * PPI in the formula rows is the diagonal formula, not a panel measurement.
 * Apple's 218 PPI label is kept as their label and is not that division.
 * dataPointCount stays 0. No winner. No prices. No frame-rate bench of our own.
 * A console refresh ceiling is not stated here. Sony documents 120 Hz and HDMI 2.1.
 */

const PUBLISHED = "2026-11-21T00:00:00Z";
const SOURCE_DATE = "2026-11-21";

const RATE = "refresh-rate";
const GRID = "resolution";

const RTINGS = "https://www.rtings.com/monitor/tests/motion/refresh-rate";
const ASUS =
  "https://edgeup.asus.com/2026/what-to-know-about-refresh-rate-resolution-and-size-as-youre-picking-a-high-refresh-rate-gaming-monitor/";
const INTEL = "https://www.intel.com/content/www/us/en/gaming/resources/highest-refresh-rate-gaming.html";
const APPLE = "https://www.apple.com/studio-display/specs/";
const MAC = "https://support.apple.com/guide/mac-help/change-your-displays-resolution-mchl86d72b76/mac";
const SONY = "https://www.playstation.com/en-us/support/hardware/ps5-4k-resolution-guide/";

const SHORT_ANSWER = `Choose a higher refresh rate if motion is the main job, because RTINGS says a higher rate helps produce a smoother, more responsive feel, and Intel calls 144 Hz a considerable improvement over a standard 60 Hz monitor. Choose a higher resolution if a denser pixel grid is the main job, because 5120 by 2880 has exactly 16/9 times the pixels of 3840 by 2160, and Apple's Studio Display pairs a 27-inch 5K grid with a 60Hz refresh rate.`;

const CHOOSE_TABLE = [
  "Choose-if rows. Motion notes are RTINGS, updated 20 May 2026, and ASUS, 4 January 2026. Density is the diagonal formula. PS5 rows are Sony's support guide. No row is a ranked result.",
  "| Situation | Choose a higher refresh rate if | Choose a higher resolution if |",
  "| --- | --- | --- |",
  "| Fast games | You play shooters, fighting games, or other fast motion, which is the case ASUS names for refresh rate | You want the detail ASUS names for RPGs, strategy, and cinematic scenes |",
  "| Documents | You want the scrolling help RTINGS describes for long documents | Text size and workspace are the job, and a 60 Hz panel such as Apple's Studio Display is acceptable |",
  "| 27-inch grid | You accept 163.18 pixels per inch for 3840 by 2160 on a stated 27.0-inch diagonal | You want 5120 by 2880. Apple states 218 pixels per inch on the Studio Display |",
  "| PS5 | You turn on 120 Hz Output for a display and for games that support a 120 Hz frame rate | The screen is a compatible 4K display and you set resolution to 2160p |",
  "| Mixed hours | Motion and games are most of the hours | Text and still images are most of the hours |",
].join("\n");

const LAG_TABLE = [
  "Time between frames and minimum input lag from the center of the screen, as RTINGS lists them in the refresh-rate test updated 20 May 2026. RTINGS' figures, not a stopwatch result from these other documents.",
  "| Refresh rate | Time between frames | Minimum input lag |",
  "| --- | --- | --- |",
  "| 60 Hz | 16.67 ms | 8.33 ms |",
  "| 120 Hz | 8.33 ms | 4.17 ms |",
  "| 144 Hz | 6.94 ms | 3.47 ms |",
  "| 165 Hz | 6.06 ms | 3.03 ms |",
  "| 240 Hz | 4.17 ms | 2.09 ms |",
  "| 360 Hz | 2.78 ms | 1.39 ms |",
  "| 480 Hz | 2.08 ms | 1.04 ms |",
].join("\n");

const DENSITY_TABLE = [
  "Square-pixel density from the diagonal formula, with the stated labels in the last row. Geometry on a stated 27.0-inch diagonal, not a measurement of one shipping panel. Apple's 218 PPI is their Studio Display label, not sqrt(34,508,800) divided by 27.",
  "| Figure | 27-inch 1440p | 27-inch 4K | 27-inch 5K |",
  "| --- | --- | --- | --- |",
  "| Pixel grid | 2560 by 1440 | 3840 by 2160 | 5120 by 2880 |",
  "| Pixel count | 3,686,400 | 8,294,400 | 14,745,600 |",
  "| Formula density | 108.79 PPI | 163.18 PPI | 217.57 PPI |",
  "| Stated label | about 109 PPI, ASUS, 4 January 2026 | ASUS describes the pixels as hard to separate at a standard sitting distance | 218 PPI and a 60Hz refresh rate, Apple Studio Display |",
].join("\n");

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways.

- Choose a higher refresh rate for motion. RTINGS, updated 20 May 2026, is the source for the smoother, more responsive feel, and for help while scrolling long documents.
- Choose a higher resolution for a denser grid. 5120 by 2880 has 14,745,600 pixels, exactly 16/9 times the 8,294,400 pixels in 3840 by 2160.
- On a stated 27.0-inch diagonal the formula rounds to 217.57 pixels per inch for 5120 by 2880 and to 163.18 for 3840 by 2160. Apple states 218 pixels per inch for the Studio Display.
- Intel calls 144 Hz a considerable improvement over a standard 60 Hz monitor, and calls 240 Hz a popular high-end option. Those are Intel's words, not a measured step size.
- Sony's PS5 support guide documents HDMI 2.1, 4K at 2160p, and 120 Hz output for games that support a 120 Hz frame rate. A 240 Hz console output is not in that guide.
- A price, a glare score, and a frame-rate bench are not in these documents.

## What each spec counts

Refresh rate counts updates per second. Resolution counts pixels. RTINGS and ASUS both use that split, and neither count picks a monitor by itself.

RTINGS, updated 20 May 2026, writes that refresh rate is how many times per second the screen refreshes from top to bottom, measured in hertz. A 60 Hz monitor refreshes 60 times per second. A 240 Hz monitor refreshes 240 times per second. That is not the frame rate. The frame rate is how many frames per second the source sends. RTINGS writes that a higher refresh rate helps produce a smoother, more responsive feel than a lower rate. ASUS, the monitor maker, wrote on 4 January 2026 that a 60 Hz monitor updates 60 times per second and a 144 Hz monitor updates 144 times per second, and that a higher rate makes motion more fluid. ASUS also wrote that refresh rate is not the only cause of input lag, and that a higher rate generally contributes to less delay and to less of the smearing they call sample-and-hold.

Resolution, ASUS wrote the same day, is the number of pixels. Their 4K figure is 3840 by 2160. Their 1440p figure is 2560 by 1440. On the same panel size, they wrote, more pixels mean a sharper image, with fewer jagged edges and less fuzziness. They wrote that this is most noticeable for text and work, and that it also matters for detailed game textures. A higher resolution asks the graphics card to paint more pixels.

## Which job to choose

Choose a higher refresh rate when fast motion is most of the hours. Choose a higher resolution when the denser pixel grid is most of the hours.

${CHOOSE_TABLE}

ASUS wrote on 4 January 2026 to prioritize refresh rate for shooters, fighting games, and anything fast-paced, and to prioritize resolution for RPGs, strategy games, and cinematic scenes where the detailed image is the point. That is the maker's split. It is not a frame-rate result.

## How 60 Hz, 144 Hz, and 240 Hz are described

Intel calls 144 Hz a considerable improvement over standard 60 Hz monitors, and calls 240 Hz a popular high-end option. RTINGS lists a shorter time between frames as the rate rises. Neither document states a measured size for each step up.

${LAG_TABLE}

RTINGS writes that a higher refresh rate allows for the possibility of a more responsive feel, because more frames arrive each second with a shorter frame time, and that lower input lag is possible and not guaranteed. The same test says two monitors can share a refresh rate and still differ in motion when the response time differs. It lists a total response time of 6.8 ms for the ASUS ROG Strix XG27ACS and 14.7 ms for the AOC 24G15N, and describes both as 180 Hz monitors. It also writes that when response time stays near instant, as with OLEDs, a lower refresh rate still shows more persistence blur, and names the LG 27GX790A-B across 480 Hz, 360 Hz, 240 Hz, 144 Hz, 100 Hz, and 60 Hz. Those are RTINGS' examples from the test updated 20 May 2026. They are not a result for every panel.

ASUS wrote on 4 January 2026 that 144 Hz monitors are readily available and that there is little point in settling for a slow refresh rate. For people who play a lot of esports games, they think a 240 Hz monitor will provide a clear competitive edge. On 27-inch 1440p monitors they describe budget refresh rates around 165 Hz or 180 Hz, 240 Hz as fairly common, and premium models up to 540 Hz. On 32-inch 4K monitors they describe mainstream options at 144 Hz and premium models at 240 Hz. Those are the maker's descriptions of what is sold. They are not a count of models.

Variable refresh rate is separate from the maximum rate. RTINGS writes that most monitors include it so the monitor can follow the source frame rate and reduce tearing when that frame rate drops. ASUS describes NVIDIA G-Sync and AMD FreeSync the same way: the monitor refreshes when a complete frame is ready.

## How dense the grids are at 27 inches

On a stated 27.0-inch diagonal, 5120 by 2880 rounds to 217.57 pixels per inch and 3840 by 2160 rounds to 163.18. Apple states 218 pixels per inch for the Studio Display. 218 is their label, not 217.57.

Divide the square root of width squared plus height squared by the stated diagonal. For 3840 and 2160, 3840 squared is 14,745,600 and 2160 squared is 4,665,600. The square root of 19,411,200 is 4,405.8143... Dividing by 27 gives 163.1783..., which rounds to 163.18 pixels per inch. For 5120 and 2880, 5120 squared is 26,214,400 and 2880 squared is 8,294,400. The square root of 34,508,800 is 5,874.4191... Dividing by 27 gives 217.5711..., which rounds to 217.57. For 2560 and 1440, 2560 squared is 6,553,600 and 1440 squared is 2,073,600. The square root of 8,627,200 is 2,937.2096... Dividing by 27 gives 108.7855..., which rounds to 108.79. Rounding happens after the division. A different diagonal changes the result. The formula assumes square pixels and uses the diagonal stated with it. It is not a measurement of one shipping panel.

5120 times 2880 is 14,745,600. 3840 times 2160 is 8,294,400. Each side of the 5K grid is 4/3 of the matching 4K side, because 5120 divided by 3840 is 4/3 and 2880 divided by 2160 is 4/3. 4/3 times 4/3 is 16/9. Both pixel counts divide by 921,600, into 16 and 9, so the ratio is exactly 16/9. The gap is 6,451,200 pixels. 2560 times 1440 is 3,686,400. 8,294,400 divided by 3,686,400 is exactly 2.25. Those ratios count pixels. They are not a frame-rate measurement.

ASUS wrote on 4 January 2026 that 27-inch 1440p is about 109 PPI, and that this density can be read without Windows scaling. 109 is their rounding. It is not 108.79. The same piece says a 4K image at 27 inches is dense enough that most people cannot distinguish separate pixels at a standard sitting distance, and that whether you notice depends on you and the games. That sentence is about 4K. It is not a 5K measurement. For work and play together, ASUS calls that 4K density useful, and mentions dual-mode monitors that switch between a resolution-first mode and a refresh-first mode.

${DENSITY_TABLE}

1440p vs 4K at 27 inches is the separate pixel-count question: /compare/1440p-vs-4k-monitor. The 2.25 ratio does not change with the diagonal.

## 4K at 60 Hz or 1440p at 144 Hz

Choose 3840 by 2160 when you want 8,294,400 pixels. Choose 2560 by 1440 at 144 Hz when you want 3,686,400 pixels updating 144 times a second.

The 4K count is exactly 2.25 times the 1440p count. Intel calls 144 Hz a considerable improvement over 60 Hz, and writes that the graphics card has to supply the frames or the higher rate is not used. A 144 Hz monitor with a card supplying 30 frames per second is Intel's example of a rate that is not being used. The 2.25 ratio still only counts pixels.

## Is 60 Hz enough for documents

A 60 Hz panel updates 60 times per second, and Apple sells one: the Studio Display lists a 60Hz refresh rate. Choose 60 Hz when that rate is acceptable for the documents in front of you. Choose a higher rate when you want the scrolling smoothness RTINGS describes.

Apple's Studio Display technical specifications list a 27-inch 5K Retina display, 5120-by-2880 resolution at 218 pixels per inch, 600 nits brightness, and a 60Hz refresh rate. They also list support for 1 billion colors, wide color (P3), and True Tone. Reference modes on that spec include Photography (P3-D65) and Design and Print (P3-D50). Apple lists compatibility with stated Mac models that use Apple silicon, on macOS Tahoe 26.3.1 or later, and with stated iPad models on iPadOS 26.3.1 or later. Those lines describe that display. They are not a spec for every 5K monitor.

RTINGS writes that a high refresh rate can also help outside games, including when you scroll long documents. ASUS wrote that the sharpness from extra pixels is most noticeable for reading text and getting work done.

Apple's Mac help says that, by default, the Mac uses the best resolution for the display, and that you can set a different resolution so text and objects look larger or so you have more space. It says a scaled resolution may affect performance. An integer-scaling ratio for 5K is not in that help guide.

## What a PS5 outputs

Sony's PS5 support guide says the console supports the HDMI 2.1 specification and 4K 120 Hz video output. Choose the 120 Hz setting when the display and the game support a 120 Hz frame rate. Choose 2160p when the screen is a compatible 4K display.

- Resolution set to Automatic uses the highest resolution the TV supports.
- 4K can be selected when the console is connected to a compatible 4K screen and Video Output resolution is set to 2160p.
- All PS5 consoles have 4K and HDR capabilities. Image quality still depends on the home setup.
- 120 Hz Output enables 120 Hz video output for the TV and for games that support a 120 Hz frame rate. If a game has video-output problems on a monitor, Sony says to turn that setting off.
- The guide says the console supports HDMI 2.1 and 4K 120 Hz video output. Sony says some 4K 120 Hz setups can have issues during this transition.
- The 4K 120 Hz troubleshooting asks whether the TV claims to support 4K 120 Hz, whether the cable is the one included with the console or an Ultra High-Speed cable rated for 4K 120 Hz, and whether the console is on an HDMI port (2.1).
- If the TV supports 1440p, Test 1440p Output covers SDR and HDR at 60 Hz and 120 Hz, and VRR. To use 1440p output, set Resolution to 1440p.
- VRR lets the refresh rate adjust in real time on TVs and games that support VRR.

A 240 Hz console output is not in that guide. RTINGS, updated 20 May 2026, writes that HDMI Forum VRR is part of HDMI 2.1 certification and is the only VRR format the PS5 supports, and that Xbox Series X and Series S support HDMI Forum VRR and FreeSync. That VRR sentence is RTINGS' statement.

## When the computer cannot fill the rate

The monitor can only show new images as fast as the source sends frames. Choose a higher refresh rate when the computer can supply those frames. Choose the denser grid when it cannot.

Intel writes that the monitor displays an image at the rate the system produces it. If the monitor is 144 Hz and the graphics card supplies 30 frames per second, Intel writes that the higher refresh rate is not being utilized. Intel's full-use example is 144 frames per second on a 144 Hz monitor. Intel's example below the maximum is 110 Hz, and Intel writes that playing at 110 Hz is better than playing at 60 Hz. Intel also writes that a system which struggles to run games higher than 60 frames per second is unlikely to see much benefit from a high-refresh-rate display, and that you should look at the frame rate you already get before you buy one. Lowering resolution, Intel writes, makes a high frame rate easier to reach.

RTINGS writes that you want the frame rate to match the refresh rate, or you may see stutter or tearing, and that without a high frame rate from the graphics card the display's refresh rate is limited to the source's maximum frame rate. On bandwidth, RTINGS writes that the AOC Q27G3XMN is a 1440p monitor with a maximum refresh rate of 180 Hz, and that HDMI on that monitor reaches 144 Hz. The LG 27GX704A-B reaches its maximum 240 Hz over HDMI, which RTINGS attributes to HDMI 2.1 bandwidth.

ASUS wrote on 4 January 2026 that driving games at a higher resolution takes more graphics-card work, and that for modern AAA games at 4K they recommend at least an NVIDIA GeForce RTX 5070 Ti. They name NVIDIA DLSS and AMD FSR as ways to make playable 4K frame rates easier to reach. That is the monitor maker's recommendation. It is not a frame-rate measurement.

## How the panel sits beside this choice

Panel type is a separate question from refresh rate versus resolution. A glare score and an OLED brightness figure are not in these documents. Apple lists 600 nits on the Studio Display.

QD-OLED vs WOLED compares two OLED stacks: /compare/qd-oled-vs-woled. 4K IPS vs 1440p OLED compares those two panel-and-resolution pairings: /compare/4k-ips-vs-1440p-oled. Neither of those questions is this refresh-rate question, and the pixel counts here do not change with the panel name.

## A 5K 60 Hz panel beside a 4K high-refresh panel

Choose the 5K 60 Hz side when you want the 14,745,600-pixel grid and a documented 60 Hz 5K spec. Choose the 4K high-refresh side when you want 8,294,400 pixels updating more often than 60 times a second.

Apple's Studio Display is one 27-inch 5120-by-2880 panel at 218 pixels per inch, 600 nits, and a 60Hz refresh rate. The formula on a stated 27.0-inch diagonal rounds to 217.57, so 218 stays Apple's label. A 3840 by 2160 grid on that same stated diagonal rounds to 163.18. ASUS describes 27-inch 4K as dense at a standard sitting distance. That description is not a test of 5K against 4K. RTINGS' 240 Hz example refreshes 240 times per second. ASUS describes premium 4K models at 240 Hz in the 32-inch part of the 4 January 2026 piece. That sentence is about 32-inch 4K, not a spec for a named 27-inch OLED.

For a PS5, Sony's 4K path is a compatible 4K screen at 2160p, and the 120 Hz path is 120 Hz Output for games that support a 120 Hz frame rate, with HDMI 2.1 and 4K 120 Hz documented in the same guide. 5120 by 2880 is a different grid from 2160p. The guide does not describe a 5K output mode.

## Price

A price is not in these documents. Check the current price of each monitor. Nothing here says what a budget tier includes.`;

const FAQS = [
  {
    question: "Is refresh rate or resolution more important for gaming?",
    answer:
      "Choose a higher refresh rate for shooters, fighting games, and other fast motion. ASUS wrote that on 4 January 2026, and wrote to choose a higher resolution for RPGs, strategy games, and cinematic detail. It only helps if the computer or console can send that many frames. Intel's example is a 144 Hz monitor that is not using that rate when the graphics card supplies 30 frames per second.",
  },
  {
    question: "Is 60 Hz enough for office work?",
    answer:
      "A 60 Hz monitor updates 60 times per second. Apple's Studio Display spec lists a 60Hz refresh rate on a 27-inch 5K panel at 218 pixels per inch. RTINGS writes that a high refresh rate can also help when you scroll long documents. Choose 60 Hz when that update rate is acceptable for the documents in front of you. Choose a higher rate when scrolling is the job.",
  },
  {
    question: "Is 5K worth it over 4K at 27 inches?",
    answer:
      "5120 by 2880 has 14,745,600 pixels, exactly 16/9 times the 8,294,400 pixels in 3840 by 2160. On a stated 27.0-inch diagonal the formula rounds to 217.57 pixels per inch for 5K and to 163.18 for 4K. Apple states 218 pixels per inch and a 60Hz refresh rate for the Studio Display. Choose 5K when you want that denser grid. Choose 4K when you want 3840 by 2160 at a higher refresh rate.",
  },
  {
    question: "What refresh rate does a PS5 support guide document?",
    answer:
      "Sony's PS5 support guide says the console supports the HDMI 2.1 specification and 4K 120 Hz video output. 120 Hz Output turns on 120 Hz video for a display and for games that support a 120 Hz frame rate. 4K is available on a compatible 4K screen with resolution set to 2160p. A 240 Hz console output is not in that guide.",
  },
  {
    question: "Does a higher refresh rate help if the computer sends fewer frames?",
    answer:
      "Choose the higher rate when the computer can supply the frames. Intel writes that a 144 Hz monitor is not using that rate when the graphics card supplies 30 frames per second, and that 144 frames per second is the full use of a 144 Hz monitor. RTINGS writes that the display's refresh rate is limited to the source's maximum frame rate when the graphics card cannot go higher. Choose the denser grid when the computer cannot fill the rate.",
  },
  {
    question: "How do you choose between refresh rate and resolution?",
    answer:
      "Choose a higher refresh rate when motion, fast games, or document scrolling is the main job. Choose a higher resolution when the denser pixel count is the main job. 5120 by 2880 has exactly 16/9 times the pixels of 3840 by 2160. The counts do not pick a monitor. Panel type and price stay on each model's current listing.",
  },
];

const VERDICT = `Choose a higher refresh rate when motion is the main job. Intel calls 144 Hz a considerable improvement over a standard 60 Hz monitor. Choose a higher resolution when you want the denser grid. 5120 by 2880 has 14,745,600 pixels, exactly 16/9 times the 8,294,400 pixels in 3840 by 2160.

On a stated 27.0-inch diagonal the formula rounds to 217.57 pixels per inch for 5120 by 2880 and to 163.18 for 3840 by 2160. Apple states 218 pixels per inch and a 60Hz refresh rate for the Studio Display. Those figures count pixels or repeat a spec. They are not a frame-rate result.`;

const BUILT = buildEditorialComparison({
  slug: "refresh-rate-vs-resolution",
  title: "Refresh Rate vs Resolution?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: RATE,
      slug: RATE,
      name: "Higher refresh rate",
      shortDesc: "More updates per second, measured in hertz. A 60 Hz panel updates 60 times per second.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [],
      cons: [],
      bestFor: "Choose a higher refresh rate for motion",
    },
    {
      id: GRID,
      slug: GRID,
      name: "Higher resolution",
      shortDesc: "More pixels on the grid. 5120 by 2880 has exactly 16/9 times the pixels of 3840 by 2160.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [],
      cons: [],
      bestFor: "Choose a higher resolution for a denser grid",
    },
  ],
  keyDifferences: [
    {
      label: "What it counts",
      entityAValue: "Updates per second. RTINGS: the screen refreshes from top to bottom",
      entityBValue: "Pixels. ASUS: 3840 by 2160 for 4K, and 2560 by 1440 for 1440p",
      winner: "tie",
    },
    {
      label: "A documented step",
      entityAValue: "Intel calls 144 Hz a considerable improvement over standard 60 Hz",
      entityBValue: "16/9: 14,745,600 pixels at 5120 by 2880 against 8,294,400 at 3840 by 2160",
      winner: "tie",
    },
    {
      label: "27-inch density",
      entityAValue: "Apple's Studio Display lists a 60Hz refresh rate at 27 inches",
      entityBValue: "Formula rounds to 217.57 PPI for 5K and 163.18 PPI for 4K. Apple states 218 PPI",
      winner: "tie",
    },
    {
      label: "Motion and text",
      entityAValue: "RTINGS: smoother, more responsive feel, including while scrolling documents",
      entityBValue: "ASUS: on the same size, more pixels mean a sharper image, most noticeable for text and work",
      winner: "tie",
    },
    {
      label: "What the source must supply",
      entityAValue: "Frames. Intel: 30 frames per second does not use a 144 Hz rate",
      entityBValue: "Pixels to paint. The 4K count is exactly 2.25 times the 1440p count",
      winner: "tie",
    },
    {
      label: "PS5 output in Sony's guide",
      entityAValue: "120 Hz Output for a display and for games that support a 120 Hz frame rate. HDMI 2.1 and 4K 120 Hz",
      entityBValue: "2160p on a compatible 4K screen. A 240 Hz console output is not in that guide",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "counts",
      "What it counts",
      "Spec",
      RATE,
      GRID,
      "Updates per second, in hertz. A 60 Hz monitor refreshes 60 times per second",
      "Pixels. 3840 by 2160 is 8,294,400. 5120 by 2880 is 14,745,600",
    ),
    textAttr(
      "step",
      "Documented step",
      "Spec",
      RATE,
      GRID,
      "Intel: 144 Hz is a considerable improvement over standard 60 Hz. 240 Hz is a popular high-end option",
      "Exactly 16/9. Both pixel counts divide by 921,600",
    ),
    textAttr(
      "density",
      "27-inch density",
      "Density",
      RATE,
      GRID,
      "Studio Display: 60Hz refresh rate, 600 nits, on a 27-inch 5K panel",
      "217.57 PPI by the formula for 5120 by 2880. Apple states 218. 4K rounds to 163.18",
    ),
    textAttr(
      "motion",
      "Motion and text",
      "Use",
      RATE,
      GRID,
      "RTINGS, 20 May 2026: smoother and more responsive, and helpful while scrolling long documents",
      "ASUS, 4 January 2026: sharper on the same panel size, most noticeable for text and work",
    ),
    textAttr(
      "source",
      "Source limit",
      "Computer",
      RATE,
      GRID,
      "Intel: a 144 Hz monitor is not using that rate at 30 frames per second",
      "ASUS: more pixels ask the graphics card to paint more. 4K is exactly 2.25 times 1440p",
    ),
    textAttr(
      "ps5",
      "PS5 output",
      "Console",
      RATE,
      GRID,
      "Sony: HDMI 2.1, 4K 120 Hz, and a 120 Hz Output setting for games that support it",
      "Sony: 2160p on a compatible 4K screen. A 240 Hz output is not in that guide",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "1440p-vs-4k-monitor",
      title: "1440p vs 4K at 27 Inches?",
      category: "technology",
    },
    {
      slug: "4k-ips-vs-1440p-oled",
      title: "4K IPS vs 1440p OLED?",
      category: "technology",
    },
    {
      slug: "qd-oled-vs-woled",
      title: "QD-OLED vs WOLED: Which Gaming Monitor Panel",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "5120 by 2880 has 14,745,600 pixels, exactly 16/9 times 8,294,400. Apple's Studio Display lists that 5K grid at 218 pixels per inch and a 60Hz refresh rate.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "RTINGS: monitor refresh-rate test (updated 20 May 2026)", url: RTINGS },
      { name: "ASUS Edge Up: refresh rate, resolution, and size (4 January 2026, maker)", url: ASUS },
      { name: "Intel: what refresh rate is", url: INTEL },
      { name: "Apple: Studio Display technical specifications", url: APPLE },
      { name: "Apple: change your Mac display's resolution", url: MAC },
      { name: "Sony: PS5 resolution and 4K 120 Hz support guide", url: SONY },
    ],
  },
  resources: [
    {
      type: "external",
      label: "RTINGS: monitor refresh-rate test (updated 20 May 2026)",
      url: RTINGS,
      description:
        "Nicholas Di Giovanni, updated 20 May 2026. Refresh rate is how many times per second the screen refreshes from top to bottom. 60 Hz is 60 times per second and 240 Hz is 240 times per second. Frame rate is separate. RTINGS gives 16.67 ms between frames at 60 Hz and 4.17 ms at 240 Hz, with minimum input lag of 8.33 ms and 2.09 ms. Response-time examples are 6.8 ms and 14.7 ms on two 180 Hz monitors. HDMI examples are 144 Hz on the AOC Q27G3XMN and 240 Hz on the LG 27GX704A-B.",
    },
    {
      type: "external",
      label: "ASUS Edge Up: refresh rate, resolution, and size (4 January 2026, maker)",
      url: ASUS,
      description:
        "ASUS, 4 January 2026. Maker article. 60 Hz updates 60 times per second and 144 Hz updates 144 times per second. 4K is 3840 by 2160 and 1440p is 2560 by 1440. About 109 PPI for 27-inch 1440p. Prioritize refresh rate for fast games and resolution for cinematic and strategy games. 27-inch 4K is described as dense at a standard sitting distance. Premium 32-inch 4K models are described at 240 Hz. The 4K graphics-card recommendation is at least an NVIDIA GeForce RTX 5070 Ti.",
    },
    {
      type: "external",
      label: "Intel: what refresh rate is",
      url: INTEL,
      description:
        "Refresh rate is how many times per second the display can draw a new image. 144 Hz is called a considerable improvement over standard 60 Hz, and 240 Hz a popular high-end option. A 144 Hz monitor supplied with 30 frames per second is not using that rate. The full-use example is 144 frames per second. The below-maximum example is 110 Hz next to 60 Hz.",
    },
    {
      type: "external",
      label: "Apple: Studio Display technical specifications",
      url: APPLE,
      description:
        "27-inch 5K Retina display, 5120-by-2880 resolution at 218 pixels per inch, 600 nits brightness, and a 60Hz refresh rate. Wide color (P3), True Tone, and support for 1 billion colors. Reference modes include Photography (P3-D65) and Design and Print (P3-D50). Compatibility lists stated Mac models on Apple silicon with macOS Tahoe 26.3.1 or later.",
    },
    {
      type: "external",
      label: "Apple: change your Mac display's resolution",
      url: MAC,
      description:
        "By default the Mac uses the best resolution for the display. A manual resolution can make text and objects larger or leave more space. A scaled resolution may affect performance.",
    },
    {
      type: "external",
      label: "Sony: PS5 resolution and 4K 120 Hz support guide",
      url: SONY,
      description:
        "The PS5 supports the HDMI 2.1 specification and 4K 120 Hz video output. 120 Hz Output enables 120 Hz for the TV and for games that support a 120 Hz frame rate. 4K requires a compatible 4K screen and resolution set to 2160p. Troubleshooting for 4K 120 Hz asks about an HDMI port (2.1) and an Ultra High-Speed cable rated for 4K 120 Hz. 1440p output is a separate test for 60 Hz and 120 Hz.",
    },
    {
      type: "blog",
      label: "1440p vs 4K at 27 Inches?",
      url: "/compare/1440p-vs-4k-monitor",
      description: "A separate question: the 2560 by 1440 grid against 3840 by 2160 at 27 inches.",
    },
    {
      type: "blog",
      label: "4K IPS vs 1440p OLED?",
      url: "/compare/4k-ips-vs-1440p-oled",
      description: "A separate question: a 4K IPS panel against a 1440p OLED panel.",
    },
    {
      type: "blog",
      label: "QD-OLED vs WOLED: Which Gaming Monitor Panel",
      url: "/compare/qd-oled-vs-woled",
      description: "A separate question: two OLED stacks, not refresh rate against resolution.",
    },
  ],
  metaTitle: "Refresh Rate vs Resolution?",
});

BUILT.metadata.metaDescription =
  "Choose a higher refresh rate for motion, or a higher resolution for a denser grid. At 27 inches, 4K rounds to 163.18 PPI and Apple states 218 PPI for 5K.";

export const REFRESH_RATE_VS_RESOLUTION: EditorialComparison = BUILT;
