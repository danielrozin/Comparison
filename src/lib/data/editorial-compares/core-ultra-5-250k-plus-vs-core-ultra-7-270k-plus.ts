import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-437 — Core Ultra 5 250K Plus vs Core Ultra 7 270K Plus.
 * Opened 15 November 2026 (Asia/Jerusalem):
 * Intel ARK 245694 (250K Plus) and 245692 (270K Plus);
 * Intel newsroom announcement, 11 March 2026;
 * Back2Gaming, last updated 27 May 2026;
 * Tom's Guide, 23 March 2026;
 * HotHardware, 23 March 2026.
 * dataPointCount stays 0. No winner. No prices.
 * Cache rows are Intel's: Intel Smart Cache and total L2 cache.
 * Intel does not name an L3 row. A 24 MB L3 cell from a review table is not used.
 * Guru3D was opened and is not a source here.
 */

const PUBLISHED = "2026-11-15T00:00:00Z";
const SOURCE_DATE = "2026-11-15";

const U5 = "core-ultra-5-250k-plus";
const U7 = "core-ultra-7-270k-plus";

const ARK_250 =
  "https://www.intel.com/content/www/us/en/products/sku/245694/intel-core-ultra-5-processor-250k-plus-30m-cache-up-to-5-30-ghz/specifications.html";
const ARK_270 =
  "https://www.intel.com/content/www/us/en/products/sku/245692/intel-core-ultra-7-processor-270k-plus-36m-cache-up-to-5-50-ghz/specifications.html";
const INTEL_NEWS =
  "https://www.intel.com/content/www/us/en/newsroom/news/client-computing/intel-announces-new-intel-core-ultra-200s-plus-series-desktop-processors.html";
const BACK2GAMING = "https://www.back2gaming.com/review/intel-core-ultra-200-plus-250k-270k-tested/";
const TOMS =
  "https://www.tomsguide.com/computing/cpus/intel-core-ultra-7-270k-plus-5-250k-plus-review";
const HOTHARDWARE = "https://hothardware.com/reviews/intel-core-ultra-plus-arrow-lake-refresh-review";

const SHORT_ANSWER = `Choose the Core Ultra 5 250K Plus if you mainly play games and the 18-core part is the one you want: Intel lists 6 performance-cores, 12 efficient-cores, 18 threads, a 5.3 GHz max turbo frequency, 30 MB Intel Smart Cache, and 159 W maximum turbo power. Choose the Core Ultra 7 270K Plus if you also stream, render, or compile: Intel lists 8 performance-cores, 16 efficient-cores, 24 threads, a 5.5 GHz max turbo frequency, 36 MB Intel Smart Cache, and 250 W maximum turbo power.`;

const SPEC_TABLE = [
  "Intel specification rows opened 15 November 2026. Cache is the Cache row. Total L2 cache is a separate row. Neither row is named L3. No row is a ranking.",
  "| Specification | Core Ultra 5 250K Plus | Core Ultra 7 270K Plus |",
  "| --- | --- | --- |",
  "| Total cores | 18 | 24 |",
  "| Performance-cores | 6 | 8 |",
  "| Efficient-cores | 12 | 16 |",
  "| Low-power efficient-cores | 0 | 0 |",
  "| Total threads | 18 | 24 |",
  "| Max turbo frequency | 5.3 GHz | 5.5 GHz |",
  "| Performance-core max turbo frequency | 5.3 GHz | 5.4 GHz |",
  "| Efficient-core max turbo frequency | 4.6 GHz | 4.7 GHz |",
  "| Performance-core base frequency | 4.2 GHz | 3.7 GHz |",
  "| Efficient-core base frequency | 3.3 GHz | 3.2 GHz |",
  "| Cache | 30 MB Intel Smart Cache | 36 MB Intel Smart Cache |",
  "| Total L2 cache | 30 MB | 40 MB |",
  "| Processor base power | 125 W | 125 W |",
  "| Maximum turbo power | 159 W | 250 W |",
  "| Memory types | Up to DDR5 7200 MT/s | Up to DDR5 7200 MT/s |",
  "| Max memory size | 256 GB, dependent on memory type | 256 GB, dependent on memory type |",
  "| Socket | FCLGA1851 | FCLGA1851 |",
  "| Graphics max dynamic frequency | 1.9 GHz | 2 GHz |",
  "| NPU peak TOPS (Int8) | 13 | 13 |",
  "| Overall peak TOPS (Int8) | 30 | 36 |",
  "| Turbo Boost Max Technology 3.0 | No row for this feature | Yes, frequency 5.5 GHz |",
].join("\n");

const CHOOSE_TABLE = [
  "Choose-if rows from the Intel specification rows opened 15 November 2026. No row is a ranking.",
  "| Situation | Choose the 250K Plus if | Choose the 270K Plus if |",
  "| --- | --- | --- |",
  "| Mainly games | You want the 18-core part, with 159 W maximum turbo power | You still want the 24-core part, with 250 W maximum turbo power |",
  "| Streaming, rendering, or compiling as well | You do not need the 24-core part | You want 24 cores and the 250 W maximum turbo power rating |",
  "| Cache row you are reading | You are using 30 MB Intel Smart Cache and 30 MB total L2 cache | You are using 36 MB Intel Smart Cache and 40 MB total L2 cache |",
  "| RTX 5070 Ti at 1440p | The PC is mainly for games | You also stream, render, or compile |",
  "| Motherboard | The board is FCLGA1851, with an 800-series chipset and an updated UEFI | The board is FCLGA1851, with an 800-series chipset and an updated UEFI |",
].join("\n");

const GAME_TABLE = [
  "Back2Gaming prose figures for 1080p averages with an RTX 5080, last updated 27 May 2026, opened 15 November 2026. The 270K Plus figures use the Intel Performance Profile. Counter-Strike 2 has no frame rate in this table. No row is a ranking.",
  "| Game at 1080p | Core Ultra 5 250K Plus | Core Ultra 7 270K Plus |",
  "| --- | --- | --- |",
  "| Battlefield 6 | 267 FPS | 246 FPS, Intel Performance Profile |",
  "| Resident Evil Requiem | 187 FPS | 125 FPS, Intel Performance Profile |",
  "| Counter-Strike 2 | Called roughly tied | Called roughly tied |",
].join("\n");

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways.

- Choose the Core Ultra 5 250K Plus if you mainly play games and you want the 18-core part with 159 W maximum turbo power.
- Choose the Core Ultra 7 270K Plus if you also stream, render, or compile and you want the 24-core part with 250 W maximum turbo power.
- Intel lists Cache as 30 MB Intel Smart Cache and Total L2 Cache as 30 MB on the 250K Plus, and Cache as 36 MB Intel Smart Cache and Total L2 Cache as 40 MB on the 270K Plus. Neither cache row is named L3.
- Both list 125 W processor base power, memory up to DDR5 7200 MT/s, and socket FCLGA1851.
- Intel's 11 March 2026 announcement says die-to-die frequency is up to 900 MHz higher than on the Core Ultra 7 265K and the Core Ultra 5 245K. That line compares these chips with those older chips, not with each other.
- Back2Gaming, last updated 27 May 2026, states a Battlefield 6 1080p average of 267 FPS on the 250K Plus and 246 FPS on the 270K Plus with an RTX 5080. The 270K Plus figure uses the Intel Performance Profile. That is one review's result.

## Cores, clocks, cache, and power

Intel lists 18 cores and 159 W maximum turbo power for the Core Ultra 5 250K Plus, and 24 cores and 250 W maximum turbo power for the Core Ultra 7 270K Plus. The Cache row is 30 MB Intel Smart Cache on the 250K Plus and 36 MB Intel Smart Cache on the 270K Plus, and total L2 cache is 30 MB and 40 MB. Intel does not name either cache row L3.

${SPEC_TABLE}

Performance-core base frequency is 4.2 GHz on the 250K Plus and 3.7 GHz on the 270K Plus. Efficient-core base frequency is 3.3 GHz on the 250K Plus and 3.2 GHz on the 270K Plus. Efficient-core max turbo frequency is 4.6 GHz on the 250K Plus and 4.7 GHz on the 270K Plus. Max turbo frequency is 5.3 GHz on the 250K Plus. On the 270K Plus, max turbo frequency is 5.5 GHz, performance-core max turbo frequency is 5.4 GHz, and Intel Turbo Boost Max Technology 3.0 frequency is 5.5 GHz. The 250K Plus CPU specification does not include a Turbo Boost Max Technology 3.0 row.

Intel lists Total Threads as 18 and 24, and Intel Hyper-Threading Technology as No on both, with 0 low-power efficient-cores. Processor base power is 125 W on both. Maximum turbo power is 159 W on the 250K Plus and 250 W on the 270K Plus. Max operating temperature is 105 °C on both, and the thermal solution specification is PCG 2020A on both. Choose the 270K Plus when the cooler and the board power limits are meant for that 250 W maximum turbo power rating. These specifications do not name a cooler model.

Both list Intel Graphics, 4 Xe-cores, and Intel Quick Sync Video as Yes. Graphics max dynamic frequency is 1.9 GHz on the 250K Plus and 2 GHz on the 270K Plus. Both list Intel AI Boost, an NPU peak of 13 TOPS (Int8), and a GPU peak of 8 TOPS (Int8). Overall peak TOPS (Int8) is 30 on the 250K Plus and 36 on the 270K Plus. Both are in Intel Core Ultra Processors (Series 2), code name Products formerly Arrow Lake, lithography TSMC N3B, marketing status Launched, launch date Q1'26. PCI Express revisions are 5.0 and 4.0, with a maximum of 24 PCI Express lanes, on both.

## Which processor to choose

Choose the 250K Plus if the PC is mainly for games and the 18-core, 159 W maximum turbo power part is the one you want. Choose the 270K Plus if you also stream, render, or compile and you want 24 cores with a 250 W maximum turbo power rating.

${CHOOSE_TABLE}

24 minus 18 is 6, which is the gap in total cores between these two processors. 16 minus 12 is 4, which is the gap in efficient-cores. 8 minus 6 is 2, which is the gap in performance-cores. Those three gaps are subtraction of the Intel core counts. Intel's 11 March 2026 announcement says 4 more efficient-cores bring the 270K Plus to 24 cores (8 performance-cores and 16 efficient-cores) and the 250K Plus to 18 cores (6 performance-cores and 12 efficient-cores), compared with the Core Ultra 7 265K/KF and the Core Ultra 5 245K/KF. That 4-more line is the comparison with those older processors. It is not the 6-core gap between the 250K Plus and the 270K Plus. The same announcement says die-to-die frequency is up to 900 MHz higher than on the Core Ultra 7 265K/KF and the Core Ultra 5 245K/KF, and that this speeds the link between the CPU and the memory controller. It also names an Intel Binary Optimization Tool. No game result for that tool is copied here. No price is stated here.

## What one review measured in games

Back2Gaming, last updated 27 May 2026, states a Battlefield 6 1080p average of 267 FPS on the 250K Plus and 246 FPS on the 270K Plus, and a Resident Evil Requiem 1080p average of 187 FPS on the 250K Plus and 125 FPS on the 270K Plus. The graphics card in that test is an RTX 5080. The 270K Plus figures use the Intel Performance Profile.

${GAME_TABLE}

Back2Gaming (Boss Mac Suba, last updated 27 May 2026) names a 9-game set: Baldur's Gate 3, Battlefield 6, Counter-Strike 2, Cyberpunk 2077, DOTA 2, F1 25, Marvel Rivals, Marvel's Spider-Man 2, and Resident Evil Requiem, at 720p, 1080p, 1440p, and 4K, with the same settings for each CPU, and frames captured with CapFrameX. Back2Gaming called Counter-Strike 2 roughly tied. Frame rates from that Counter-Strike 2 chart are not copied here, because the 250K Plus bar is labeled Core Ultra 7 250K Plus. These are that review's 1080p results with an RTX 5080. They are not a result for every game, and they are not an RTX 5070 Ti result.

## An RTX 5070 Ti at 1440p

Choose the 250K Plus with an RTX 5070 Ti at 1440p if the PC is mainly for games. Choose the 270K Plus with that card if you also stream, render, or compile. At 1440p the graphics card takes on more of the frame than it does in a 1080p processor test. No frame-rate share for an RTX 5070 Ti at 1440p is given here.

RTX 5070 vs RTX 5070 Ti compares those two graphics cards. 850W vs 1000W PSU compares power-supply labels for a gaming PC. No wattage from that power-supply comparison is repeated here.

## Socket, memory, and retail date

Intel lists Sockets Supported as FCLGA1851 for both, and memory types as up to DDR5 7200 MT/s, with a 256 GB maximum that depends on memory type, and 2 memory channels. Intel's 11 March 2026 announcement says the processors maintain compatibility with all 800-series chipset motherboards on the market at that date. Marco Chiappetta wrote in HotHardware on 23 March 2026 that these processors drop into existing 800-series motherboards, provided the board has an updated UEFI to support them.

The same Intel announcement says memory support is DDR5 7200 MT/s, up from 6400 MT/s on non-Plus Intel Core Ultra 200S series processors, plus compatibility with the Intel Core Ultra 200S Boost BIOS profile and its warranty support for 8,000 MT/s memory overclocking. It also says early support for 4-rank CUDIMM memory, up to 128 GB per module, on select motherboards with Intel 800 series chipsets. The announcement says retail availability begins 26 March 2026. The announcement also names a Core Ultra 5 250KF Plus. The 250K Plus is the part with Intel Graphics. Specs for the 250KF Plus are not copied here.

## Ryzen X3D, as two reviews wrote it

Jason England wrote in Tom's Guide, published 23 March 2026, that 1% lows do not match AMD's cache-heavy design, and that AMD still leads in play when gaming is the priority. Back2Gaming wrote that both Intel chips sat at about 96 FPS in Baldur's Gate 3 at 1080p with an RTX 5080, and that a Ryzen 9 9950X3D2 result in that test was 182 FPS. Back2Gaming also named DOTA 2 as a title where the Ryzen parts kept the advantage. No DOTA 2 frame rate is copied here. No AMD cache size is copied here.

Ryzen 7 7800X3D vs Ryzen 7 9800X3D compares those two AMD processors. Tom's Guide put the 250K Plus and the 270K Plus in a test that also included those two chips.`;

const FAQS = [
  {
    question: "Should I choose the Core Ultra 7 270K Plus over the 250K Plus for gaming?",
    answer:
      "Choose the 250K Plus if you mainly play games. Choose the 270K Plus if you also stream, render, or compile. Back2Gaming, last updated 27 May 2026, states a Battlefield 6 1080p average of 267 FPS on the 250K Plus and 246 FPS on the 270K Plus, with an RTX 5080. Resident Evil Requiem at 1080p is 187 FPS on the 250K Plus and 125 FPS on the 270K Plus in that same write-up. The 270K Plus figures use the Intel Performance Profile. That is one review's 1080p result.",
  },
  {
    question: "What is the difference between the 250K Plus and the 270K Plus?",
    answer:
      "Intel lists 18 cores (6 performance-cores and 12 efficient-cores), 18 threads, a 5.3 GHz max turbo frequency, 30 MB Intel Smart Cache, 30 MB total L2 cache, and 159 W maximum turbo power for the 250K Plus. Intel lists 24 cores (8 performance-cores and 16 efficient-cores), 24 threads, a 5.5 GHz max turbo frequency, 36 MB Intel Smart Cache, 40 MB total L2 cache, and 250 W maximum turbo power for the 270K Plus. Both list 125 W processor base power. On the 270K Plus, performance-core max turbo frequency is 5.4 GHz, and Intel Turbo Boost Max Technology 3.0 frequency is 5.5 GHz.",
  },
  {
    question: "Which of these should I pair with an RTX 5070 Ti at 1440p?",
    answer:
      "Choose the 250K Plus if that PC is mainly for games. Choose the 270K Plus if you also stream, render, or compile. Back2Gaming's 1080p averages used an RTX 5080, not an RTX 5070 Ti at 1440p. No frame-rate share for that pairing is given here. RTX 5070 vs RTX 5070 Ti compares those graphics cards.",
  },
  {
    question: "What cache does Intel list for the 250K Plus?",
    answer:
      "Intel lists Cache as 30 MB Intel Smart Cache and Total L2 Cache as 30 MB on the 250K Plus. Intel lists Cache as 36 MB Intel Smart Cache and Total L2 Cache as 40 MB on the 270K Plus. Intel does not name either cache row L3.",
  },
  {
    question: "Do the 250K Plus and the 270K Plus need a new motherboard?",
    answer:
      "Intel lists Sockets Supported as FCLGA1851 for both. Intel's 11 March 2026 announcement says the processors maintain compatibility with all 800-series chipset motherboards on the market at that date. HotHardware wrote on 23 March 2026 that the board needs an updated UEFI. Both list memory up to DDR5 7200 MT/s, a 256 GB maximum that depends on memory type, and 2 memory channels.",
  },
  {
    question: "How do these compare with Ryzen X3D CPUs for games?",
    answer:
      "Jason England wrote in Tom's Guide, published 23 March 2026, that 1% lows do not match AMD's cache-heavy design, and that AMD still leads in play when gaming is the priority. Back2Gaming wrote that both Intel chips sat at about 96 FPS in Baldur's Gate 3 at 1080p, and that a Ryzen 9 9950X3D2 result in that test was 182 FPS. Ryzen 7 7800X3D vs Ryzen 7 9800X3D compares those two AMD processors. No AMD cache size is copied here.",
  },
];

const VERDICT = `Choose the Core Ultra 5 250K Plus if you mainly play games and you want the 18-core part Intel rates at 159 W maximum turbo power, with 30 MB Intel Smart Cache. Choose the Core Ultra 7 270K Plus if you also stream, render, or compile and you want the 24-core part Intel rates at 250 W maximum turbo power, with 36 MB Intel Smart Cache.

Intel does not name either cache row L3. Total L2 cache is 30 MB on the 250K Plus and 40 MB on the 270K Plus. Both use socket FCLGA1851. Back2Gaming's Battlefield 6 and Resident Evil Requiem figures are 1080p averages with an RTX 5080, and the 270K Plus figures use the Intel Performance Profile.`;

const META =
  "Choose the 250K Plus if you mainly game: 18 cores, 159 W maximum turbo power. Choose the 270K Plus if you also stream, render, or compile: 24 cores, 250 W.";

const BUILT = buildEditorialComparison({
  slug: "core-ultra-5-250k-plus-vs-core-ultra-7-270k-plus",
  title: "250K Plus vs 270K Plus?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: U5,
      slug: U5,
      name: "Core Ultra 5 250K Plus",
      shortDesc:
        "Desktop processor. Intel lists 18 cores, 18 threads, 30 MB Intel Smart Cache, a 5.3 GHz max turbo frequency, and 159 W maximum turbo power.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [],
      cons: [],
      bestFor: null,
    },
    {
      id: U7,
      slug: U7,
      name: "Core Ultra 7 270K Plus",
      shortDesc:
        "Desktop processor. Intel lists 24 cores, 24 threads, 36 MB Intel Smart Cache, a 5.5 GHz max turbo frequency, and 250 W maximum turbo power.",
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
      label: "Cores and threads",
      entityAValue: "18 cores (6 performance-cores and 12 efficient-cores) and 18 threads. Hyper-Threading is No",
      entityBValue: "24 cores (8 performance-cores and 16 efficient-cores) and 24 threads. Hyper-Threading is No",
      winner: "tie",
    },
    {
      label: "Max turbo frequency",
      entityAValue: "5.3 GHz. Performance-core max turbo frequency is also 5.3 GHz",
      entityBValue: "5.5 GHz. Performance-core max turbo frequency is 5.4 GHz. Turbo Boost Max Technology 3.0 frequency is 5.5 GHz",
      winner: "tie",
    },
    {
      label: "Cache",
      entityAValue: "30 MB Intel Smart Cache, and 30 MB total L2 cache. The rows are not named L3",
      entityBValue: "36 MB Intel Smart Cache, and 40 MB total L2 cache. The rows are not named L3",
      winner: "tie",
    },
    {
      label: "Power",
      entityAValue: "125 W processor base power and 159 W maximum turbo power",
      entityBValue: "125 W processor base power and 250 W maximum turbo power",
      winner: "tie",
    },
    {
      label: "Memory and socket",
      entityAValue: "Up to DDR5 7200 MT/s, 256 GB, 2 channels, socket FCLGA1851",
      entityBValue: "Up to DDR5 7200 MT/s, 256 GB, 2 channels, socket FCLGA1851",
      winner: "tie",
    },
    {
      label: "Back2Gaming 1080p, RTX 5080, last updated 27 May 2026",
      entityAValue: "Battlefield 6 267 FPS. Resident Evil Requiem 187 FPS. Counter-Strike 2 called roughly tied",
      entityBValue:
        "Battlefield 6 246 FPS and Resident Evil Requiem 125 FPS, both with the Intel Performance Profile. Counter-Strike 2 called roughly tied",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("cores", "Total cores", "Intel", U5, U7, "18", "24"),
    textAttr(
      "layout",
      "Core layout",
      "Intel",
      U5,
      U7,
      "6 performance-cores, 12 efficient-cores, 0 low-power efficient-cores, 18 threads",
      "8 performance-cores, 16 efficient-cores, 0 low-power efficient-cores, 24 threads",
    ),
    textAttr(
      "turbo",
      "Max turbo frequency",
      "Intel",
      U5,
      U7,
      "5.3 GHz. Performance-core max turbo frequency is 5.3 GHz. Efficient-core max turbo frequency is 4.6 GHz",
      "5.5 GHz. Performance-core max turbo frequency is 5.4 GHz. Efficient-core max turbo frequency is 4.7 GHz. Turbo Boost Max Technology 3.0 frequency is 5.5 GHz",
    ),
    textAttr(
      "base",
      "Base frequency",
      "Intel",
      U5,
      U7,
      "Performance-core base frequency 4.2 GHz. Efficient-core base frequency 3.3 GHz",
      "Performance-core base frequency 3.7 GHz. Efficient-core base frequency 3.2 GHz",
    ),
    textAttr(
      "cache",
      "Cache",
      "Intel",
      U5,
      U7,
      "30 MB Intel Smart Cache. Total L2 cache 30 MB. Neither row is named L3",
      "36 MB Intel Smart Cache. Total L2 cache 40 MB. Neither row is named L3",
    ),
    textAttr(
      "power",
      "Power",
      "Intel",
      U5,
      U7,
      "125 W processor base power. 159 W maximum turbo power. PCG 2020A. 105 °C max operating temperature",
      "125 W processor base power. 250 W maximum turbo power. PCG 2020A. 105 °C max operating temperature",
    ),
    textAttr(
      "memory",
      "Memory and socket",
      "Intel",
      U5,
      U7,
      "Up to DDR5 7200 MT/s. 256 GB, dependent on memory type. 2 channels. FCLGA1851",
      "Up to DDR5 7200 MT/s. 256 GB, dependent on memory type. 2 channels. FCLGA1851",
    ),
    textAttr(
      "graphics",
      "Graphics and NPU",
      "Intel",
      U5,
      U7,
      "Intel Graphics, 4 Xe-cores, graphics max dynamic frequency 1.9 GHz. NPU peak 13 TOPS (Int8). Overall peak 30 TOPS (Int8)",
      "Intel Graphics, 4 Xe-cores, graphics max dynamic frequency 2 GHz. NPU peak 13 TOPS (Int8). Overall peak 36 TOPS (Int8)",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "rtx-5070-vs-rtx-5070-ti",
      title: "RTX 5070 vs RTX 5070 Ti",
      category: "technology",
    },
    {
      slug: "ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
      title: "Ryzen 7 7800X3D vs Ryzen 7 9800X3D for Desktop Gaming",
      category: "technology",
    },
    {
      slug: "850w-vs-1000w-psu",
      title: "850W vs 1000W PSU?",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "Intel lists 30 MB Intel Smart Cache and 30 MB total L2 cache on the 250K Plus, and 36 MB Intel Smart Cache and 40 MB total L2 cache on the 270K Plus. Neither cache row is named L3.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Intel Core Ultra 5 250K Plus specifications", url: ARK_250 },
      { name: "Intel Core Ultra 7 270K Plus specifications", url: ARK_270 },
      { name: "Intel newsroom: Core Ultra 200S Plus desktop processors (11 March 2026)", url: INTEL_NEWS },
      { name: "Back2Gaming: Core Ultra 200 Plus review (last updated 27 May 2026)", url: BACK2GAMING },
      { name: "Tom's Guide: Core Ultra 7 270K Plus and 5 250K Plus review (23 March 2026)", url: TOMS },
      { name: "HotHardware: Core Ultra 7 270K Plus and Ultra 5 250K Plus review (23 March 2026)", url: HOTHARDWARE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Intel Core Ultra 5 250K Plus specifications",
      url: ARK_250,
      description:
        "18 cores, 6 performance-cores and 12 efficient-cores, 18 threads, 5.3 GHz max turbo frequency, 30 MB Intel Smart Cache, 30 MB total L2 cache, 125 W processor base power, 159 W maximum turbo power, up to DDR5 7200 MT/s, FCLGA1851. The cache rows are not named L3.",
    },
    {
      type: "external",
      label: "Intel Core Ultra 7 270K Plus specifications",
      url: ARK_270,
      description:
        "24 cores, 8 performance-cores and 16 efficient-cores, 24 threads, 5.5 GHz max turbo frequency, 5.4 GHz performance-core max turbo frequency, 5.5 GHz Turbo Boost Max Technology 3.0 frequency, 36 MB Intel Smart Cache, 40 MB total L2 cache, 125 W processor base power, 250 W maximum turbo power, up to DDR5 7200 MT/s, FCLGA1851.",
    },
    {
      type: "external",
      label: "Intel newsroom: Core Ultra 200S Plus desktop processors (11 March 2026)",
      url: INTEL_NEWS,
      description:
        "11 March 2026. 4 more efficient-cores, up to 900 MHz die-to-die frequency versus the Core Ultra 7 265K/KF and the Core Ultra 5 245K/KF, DDR5 7200 MT/s, 800-series chipset compatibility, and retail availability beginning 26 March 2026. No price from this announcement is repeated here.",
    },
    {
      type: "external",
      label: "Back2Gaming: Core Ultra 200 Plus review (last updated 27 May 2026)",
      url: BACK2GAMING,
      description:
        "Last updated 27 May 2026. Boss Mac Suba. 1080p averages with an RTX 5080: Battlefield 6 267 FPS and 246 FPS, Resident Evil Requiem 187 FPS and 125 FPS. The 270K Plus figures use the Intel Performance Profile. Counter-Strike 2 is called roughly tied.",
    },
    {
      type: "external",
      label: "Tom's Guide: Core Ultra 7 270K Plus and 5 250K Plus review (23 March 2026)",
      url: TOMS,
      description:
        "Published 23 March 2026. Jason England wrote that 1% lows do not match AMD's cache-heavy design, and that AMD still leads in play when gaming is the priority.",
    },
    {
      type: "external",
      label: "HotHardware: Core Ultra 7 270K Plus and Ultra 5 250K Plus review (23 March 2026)",
      url: HOTHARDWARE,
      description:
        "23 March 2026. Marco Chiappetta wrote that these processors drop into existing 800-series motherboards, provided the board has an updated UEFI to support them.",
    },
    {
      type: "blog",
      label: "RTX 5070 vs RTX 5070 Ti",
      url: "/compare/rtx-5070-vs-rtx-5070-ti",
      description: "The two graphics cards in a separate comparison. No frame-rate share for a 5070 Ti at 1440p is copied here.",
    },
    {
      type: "blog",
      label: "Ryzen 7 7800X3D vs Ryzen 7 9800X3D for Desktop Gaming",
      url: "/compare/ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
      description: "Those two AMD processors, in a separate comparison. No AMD cache size is copied here.",
    },
    {
      type: "blog",
      label: "850W vs 1000W PSU?",
      url: "/compare/850w-vs-1000w-psu",
      description: "Power-supply labels for a gaming PC. No wattage from that comparison is repeated here.",
    },
  ],
  metaTitle: "250K Plus vs 270K Plus?",
});

BUILT.metadata.metaDescription = META;

export const CORE_ULTRA_5_250K_PLUS_VS_CORE_ULTRA_7_270K_PLUS: EditorialComparison = BUILT;
