import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-445 — Ryzen 7 9800X3D vs Core Ultra 7 270K Plus.
 * Opened 16 November 2026 (Asia/Jerusalem):
 * AMD Ryzen 7 9800X3D product specification;
 * Intel Core Ultra 7 270K Plus specification, SKU 245692;
 * AMD Computex 2026 blog, 31 May 2026;
 * Tom's Hardware gaming page, Jake Roach, published 23 March 2026;
 * Club386, Samuel Willetts, 30 March 2026;
 * LTT Labs, Nikolas H., tested by Sean H., 31 March 2026.
 * dataPointCount stays 0. No winner. No prices.
 * Intel cache rows stay Intel's names. Intel does not name an L3 row.
 */

const PUBLISHED = "2026-11-16T00:00:00Z";
const SOURCE_DATE = "2026-11-16";

const X3D = "ryzen-7-9800x3d";
const U7 = "core-ultra-7-270k-plus";

const AMD_9800 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const ARK_270 =
  "https://www.intel.com/content/www/us/en/products/sku/245692/intel-core-ultra-7-processor-270k-plus-36m-cache-up-to-5-50-ghz/specifications.html";
const AMD_AM5 =
  "https://www.amd.com/en/blogs/2026/amd-computex-2026-10-years-of-am4-am5-support-through.html";
const TOMS =
  "https://www.tomshardware.com/pc-components/cpus/intel-core-ultra-7-270k-plus-review/2";
const CLUB386 = "https://www.club386.com/intel-core-ultra-270k-plus-vs-amd-ryzen-7-9800x3d/";
const LTT = "https://www.lttlabs.com/articles/2026/03/31/intel-core-ultra-200s-plus-gaming-update";

const SHORT_ANSWER = `Choose the Ryzen 7 9800X3D if the PC is mainly for gaming: Jake Roach wrote in Tom's Hardware, published 23 March 2026, that in his 17-game suite at 1080p with an RTX 5090 the Core Ultra 7 270K Plus was 20% slower than the Ryzen 7 9800X3D, with iBOT on. Choose the Core Ultra 7 270K Plus if you also stream, edit, or compile, or if the Intel platform costs meaningfully less: Samuel Willetts wrote in Club386, published 30 March 2026, that the 270K Plus scored 80% higher than the 9800X3D in the Cinebench 2026 multi-thread test.`;

const SPEC_TABLE = [
  "AMD and Intel specification rows opened 16 November 2026. Cache uses each company's own row names. Intel does not name an L3 row. No row is a ranking. No price is stated here.",
  "| Specification | Ryzen 7 9800X3D | Core Ultra 7 270K Plus |",
  "| --- | --- | --- |",
  "| Cores | 8 | 24, with 8 performance-cores, 16 efficient-cores, and 0 low-power efficient-cores |",
  "| Threads | 16. SMT is Yes | 24. Hyper-Threading is No |",
  "| Architecture label | Zen 5. Former codename Granite Ridge AM5 | Products formerly Arrow Lake. Intel Core Ultra Processors (Series 2) |",
  "| Base clock | 4.7 GHz | Performance-core base frequency 3.7 GHz. Efficient-core base frequency 3.2 GHz |",
  "| Boost or turbo | Max boost clock up to 5.2 GHz | Max turbo frequency 5.5 GHz. Performance-core max turbo frequency 5.4 GHz. Efficient-core max turbo frequency 4.7 GHz. Turbo Boost Max Technology 3.0 frequency 5.5 GHz |",
  "| Cache | L1 640 KB. L2 8 MB. L3 96 MB. 2nd gen AMD 3D V-Cache | 36 MB Intel Smart Cache. Total L2 cache 40 MB. The rows are not named L3 |",
  "| Power label | 120W default TDP | 125 W processor base power. 250 W maximum turbo power |",
  "| Socket | AM5 | FCLGA1851 |",
  "| Memory | DDR5, 2 channels, up to 256 GB. Max memory speed 2x1R DDR5-5600, 2x2R DDR5-5600, 4x1R DDR5-3600, 4x2R DDR5-3600 | Up To DDR5 7200 MT/s. 256 GB, dependent on memory type. 2 channels |",
  "| Graphics | AMD Radeon Graphics, 2 cores, 2200 MHz | Intel Graphics, 4 Xe-cores, graphics max dynamic frequency 2 GHz |",
  "| Launch label | 11/07/2024 | Q1'26 |",
].join("\n");

const CHOOSE_TABLE = [
  "Choose-if rows from the specification rows and the named reviews opened 16 November 2026. No row is a ranking. No price is stated here.",
  "| Situation | Choose the 9800X3D if | Choose the 270K Plus if |",
  "| --- | --- | --- |",
  "| Mainly games | You want the 8-core chip in Tom's Hardware's 17-game 1080p suite | You still want the 24-core part for that same PC |",
  "| Streaming, editing, or compiling | You do not need the multithreaded results Club386 measured | You want the chip Club386 measured at 80% higher in Cinebench 2026 multi-thread |",
  "| Platform cost | The Intel platform does not cost meaningfully less | The Intel platform costs meaningfully less |",
  "| A later CPU | You want socket AM5, which AMD says it will support through 2029 | You accept Club386's expectation of no further processors on this Intel platform |",
  "| RTX 5070 Ti at 1440p | The PC is mainly for games | You also stream, edit, or compile, or the saving is what you would spend on the graphics card |",
].join("\n");

const TOMS_TABLE = [
  "Tom's Hardware prose, Jake Roach, published 23 March 2026, opened 16 November 2026. 1080p, no upscaling, High and Ultra settings, RTX 5090 FE, iBOT on. No frame rate from a chart is copied here. No row is a ranking.",
  "| Tom's Hardware result | Ryzen 7 9800X3D | Core Ultra 7 270K Plus |",
  "| --- | --- | --- |",
  "| 17-game suite | The chip the 20% line is measured against | 20% slower than the 9800X3D |",
  "| Intel claim, as Roach reports it | The chip named in that claim | Within 10% of the 9800X3D. This is his report of Intel's claim, not his suite result |",
  "| Baldur's Gate 3 | The chip named in that sentence | 33% slower than the 9800X3D |",
  "| F1 24 | The chip named in that sentence | 37% slower than the 9800X3D |",
].join("\n");

const CLUB_GAME_TABLE = [
  "Club386 prose, Samuel Willetts, 30 March 2026, opened 16 November 2026. Games at 1080p, High settings where he could skip upscaling, RTX 5090 Founders Edition. No cost-per-frame figure is copied here. No row is a ranking.",
  "| Club386 game | Ryzen 7 9800X3D | Core Ultra 7 270K Plus |",
  "| --- | --- | --- |",
  "| F1 25 | 19-21% ahead of the 270K Plus | The chip that margin is measured against |",
  "| Final Fantasy XIV: Dawntrail | 9% higher average frame rate, and 35% higher minimums | Binary Performance Optimisation does little in this game |",
  "| Rainbow Six Siege | Approaches 500 fps on average, and is 8-10% faster | The chip that margin is measured against |",
  "| Total War: Warhammer III | 25% faster average frame rate. Willetts writes the title as Total: War Warhammer III | The chip that margin is measured against |",
  "| Sid Meier's Civilization VI | The chip behind on turn time | Ahead by less than a second |",
].join("\n");

const CLUB_WORK_TABLE = [
  "Club386 application results, Samuel Willetts, 30 March 2026, opened 16 November 2026. Each cell is that write-up's own wording. No row is a ranking. No price is stated here.",
  "| Club386 workload | Ryzen 7 9800X3D | Core Ultra 7 270K Plus |",
  "| --- | --- | --- |",
  "| Cinebench 2026 multi-thread | The chip that margin is measured against | 80% higher score |",
  "| Cinebench 2026 single-thread | The chip that margin is measured against | 9% lead |",
  "| 7-Zip compression | The 8-core chip in that sentence | 54% ahead |",
  "| Geekbench 6 multi-core, out of the box | The chip that margin is measured against | 23,268 points, 27% quicker |",
  "| Geekbench 6 multi-core, with Binary Performance Optimisation | Primate Labs does not treat those results as valid | 32% lead. The caveat is in the same cell |",
  "| Geekbench 6 single-core, without Binary Performance Optimisation | 10 points ahead of the recorded Intel score | 3,311 points |",
  "| Pi to 5 billion digits | 118.7 seconds | 101.3 seconds, called 15% faster |",
  "| Adobe Photoshop | 18% score advantage | The chip that margin is measured against |",
  "| Adobe Premiere Pro | The chip that margin is measured against | 8% ahead |",
].join("\n");

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways.

- Choose the Ryzen 7 9800X3D if the PC is mainly for games. Tom's Hardware measured the 270K Plus 20% slower in a 17-game test at 1080p with an RTX 5090, published 23 March 2026, with iBOT on.
- Choose the Core Ultra 7 270K Plus if you also stream, edit, or compile. Club386 measured an 80% higher Cinebench 2026 multi-thread score for the 270K Plus, published 30 March 2026.
- Choose the 270K Plus if the Intel platform costs meaningfully less. No price is stated here.
- AMD lists 8 cores, 16 threads, 96 MB of L3 cache, a 4.7 GHz base clock, a boost of up to 5.2 GHz, a 120W default TDP, and socket AM5. Intel lists 24 cores, 24 threads, 36 MB Intel Smart Cache, 40 MB total L2 cache, a 5.5 GHz max turbo frequency, 125 W processor base power, 250 W maximum turbo power, and socket FCLGA1851.
- AMD wrote on 31 May 2026 that it is extending Socket AM5 support through 2029. Club386 wrote that it does not expect new processors on this Intel platform now that this generation is out.
- LTT Labs wrote on 31 March 2026 that a processor starts to matter less as the load on the graphics card rises, and that an earlier 4K test of a Ryzen 5 7500F and a Ryzen 7 9800X3D showed no difference. That test is not this pair.

## Cores, clocks, cache, and power

AMD lists 8 cores, 16 threads, 96 MB of L3 cache, a 4.7 GHz base clock, a boost of up to 5.2 GHz, and a 120W default TDP for the Ryzen 7 9800X3D. Intel lists 24 cores, 24 threads, 36 MB Intel Smart Cache, a 5.5 GHz max turbo frequency, 125 W processor base power, and 250 W maximum turbo power for the Core Ultra 7 270K Plus.

${SPEC_TABLE}

24 minus 8 is 16, which is the gap between the core counts these two companies list. 24 minus 16 is 8, which is the gap between the thread counts. AMD lists SMT as Yes. Intel lists Hyper-Threading as No, and 0 low-power efficient-cores, so the 24 threads are the 24 cores. 8 MB of L2 cache plus 96 MB of L3 cache is 104 MB, which is the sum of those two AMD rows. The AMD specification lists L2 and L3 separately. Intel lists Cache as 36 MB Intel Smart Cache and Total L2 Cache as 40 MB. Intel does not name either cache row L3. Club386's specification table calls that Intel cache row L3 at 36MB. The rows above use Intel's names.

Performance-core max turbo frequency on the 270K Plus is 5.4 GHz, and Intel Turbo Boost Max Technology 3.0 frequency is 5.5 GHz. Efficient-core max turbo frequency is 4.7 GHz, and efficient-core base frequency is 3.2 GHz. AMD lists the cache technology in the product introduction as 2nd gen AMD 3D V-Cache. CPU cores are TSMC 4nm FinFET, and the I/O die is TSMC 6nm FinFET. Max operating temperature (Tjmax) is 95°C. The thermal solution is not included, and AMD recommends a liquid cooler for optimal performance. Intel lists CPU lithography TSMC N3B, max operating temperature 105°C, and thermal solution specification PCG 2020A. These rows do not name a cooler model.

Both list a 256 GB memory maximum. AMD's maximum depends on the module layout above, and ECC support is Yes when the motherboard supports it. Intel's 256 GB maximum depends on memory type, with 2 memory channels and ECC listed as Yes. PCI Express on the 9800X3D is PCIe 5.0, with 28 native lanes and 24 usable. Intel lists PCI Express revisions 5.0 and 4.0, with a maximum of 24 PCI Express lanes. Graphics on the 9800X3D are AMD Radeon Graphics, 2 cores at 2200 MHz. Intel lists Intel Graphics, 4 Xe-cores, graphics max dynamic frequency 2 GHz, and an NPU peak of 13 TOPS (Int8). The AMD specification sections opened here do not include an NPU row.

## Which processor to choose

Choose the Ryzen 7 9800X3D if the PC is mainly for games. Choose the Core Ultra 7 270K Plus if you also stream, edit, or compile, or if the Intel platform costs meaningfully less.

${CHOOSE_TABLE}

No price is stated here. A lower platform cost is a condition, not a dollar or euro figure. The gaming margin below is one review's 1080p result with an RTX 5090. The multithreaded margin is another review's Cinebench 2026 result. They are not one blended score.

## What Tom's Hardware measured in games

Tom's Hardware measured the Core Ultra 7 270K Plus 20% slower than the Ryzen 7 9800X3D in its 17-game test at 1080p with an RTX 5090, published 23 March 2026, with iBOT on.

${TOMS_TABLE}

Jake Roach wrote that Intel claims the Core Ultra 7 270K Plus is within 10% of the Ryzen 7 9800X3D. In the same section he wrote that his own 17-game suite, with iBOT on, put the 270K Plus 20% slower than the 9800X3D. The 10% line is his report of Intel's claim. The 20% line is his suite. He also wrote that the 270K Plus is 33% slower than the 9800X3D in Baldur's Gate 3, and 37% slower in F1 24. The graphics card is an RTX 5090 FE. The resolution is 1080p, without upscaling, at a mix of High and Ultra settings. He wrote that results will vary with a lesser card and with other settings. No frame rate is copied from the charts on that review. In the same gaming section he wrote that AMD still dominates in efficiency, particularly with any of its X3D offerings. That sentence is about gaming efficiency in his test, not about the Cinebench figure below.

## What Club386 measured in games

Club386 measured the Ryzen 7 9800X3D ahead of the 270K Plus in the named 1080p games below, including 19-21% in F1 25 and 25% faster average frame rate in Total War: Warhammer III, published 30 March 2026.

${CLUB_GAME_TABLE}

Samuel Willetts captured those frame rates at 1080p, using High settings without upscaling where he could, on a GeForce RTX 5090 Founders Edition. The 270K Plus bench used 32 GB DDR5-7200. The 9800X3D bench used 32 GB DDR5-6000. Those are the kits in that test. AMD's specification maximum for two modules is DDR5-5600. Intel's specification says up to DDR5 7200 MT/s. In Final Fantasy XIV: Dawntrail he wrote that Binary Performance Optimisation does little to aid the 270K Plus, with a 9% average-frame-rate advantage and a 35% minimums advantage for the 9800X3D. In Rainbow Six Siege he wrote that the 9800X3D approaches 500 fps on average and is 8-10% faster. In Sid Meier's Civilization VI he wrote that the 270K Plus finished ahead by less than a second. One earlier frame-rate sentence does not name its game, so that margin is not copied here. No cost-per-frame figure is copied here.

## Multithreaded work

Club386 measured the Core Ultra 7 270K Plus 80% higher than the Ryzen 7 9800X3D in the Cinebench 2026 multi-thread test, published 30 March 2026.

${CLUB_WORK_TABLE}

The same write-up puts the 270K Plus 9% ahead in the Cinebench 2026 single-thread test, 54% ahead in 7-Zip compression, and 8% ahead in Adobe Premiere Pro. It gives the 9800X3D an 18% score advantage in Adobe Photoshop. Crunching Pi to 5 billion digits took the 270K Plus 101.3 seconds and the 9800X3D 118.7 seconds, which Willetts calls 15% faster. Geekbench 6 multi-core is 23,268 points and 27% quicker out of the box. With Binary Performance Optimisation he records a 32% multi-core lead, and he notes that Primate Labs does not consider those results valid. Without that feature, Geekbench 6 single-core is 3,311 points, 10 points behind the 9800X3D. A separate multi-core rendering sentence does not name the application, so that margin is not copied here.

Under a Cinebench 2026 multi-core load, Willetts wrote that the 270K Plus ran 9°C hotter than the 9800X3D. System power in that section is 262W for the 9800X3D rig and 362W for the 270K Plus rig, which he calls a 38% increase. Dividing the Cinebench 2026 scores by that system power, he reports 27.34 for the 270K Plus (9,896/362) and 21.01 for the 9800X3D (5,505/262). That division is his Cinebench-per-watt figure. It is not Tom's Hardware's gaming-efficiency sentence, and the two are not averaged here.

## An RTX 5070 Ti at 1440p

Choose the Ryzen 7 9800X3D with an RTX 5070 Ti at 1440p if the PC is mainly for games. Choose the Core Ultra 7 270K Plus if you also stream, edit, or compile, or if the Intel platform costs meaningfully less and that saving is what you would spend on the graphics card.

No frame rate for an RTX 5070 Ti at 1440p is given here. Tom's Hardware's 20% line used an RTX 5090 at 1080p. Club386's game margins used an RTX 5090 at 1080p. LTT Labs (Nikolas H., tested by Sean H., 31 March 2026) wrote that as you increase the load on the graphics card, by raising resolution or graphics settings, the processor starts to matter less. LTT Labs also wrote that an earlier pairing of a Ryzen 5 7500F and a Ryzen 7 9800X3D showed no difference in gaming performance at 4K. That earlier test is not a 270K Plus result, and it is not an RTX 5070 Ti result. RTX 5070 vs RTX 5070 Ti compares those two graphics cards.

## Socket, memory, and a later CPU

Choose socket AM5 if you want the platform AMD says it will support through 2029. Choose socket FCLGA1851 if the Intel platform costs meaningfully less, with Club386's expectation that no further processors are coming to that platform now that this generation is out.

AMD's 31 May 2026 Computex post says it is extending support for the Socket AM5 platform through 2029. The 9800X3D specification lists socket AM5 and these supporting chipsets: A620, X670E, X670, B650E, B650, X870E, X870, B840, and B850. A chipset name is not a promise that every board revision already boots the chip. Read the motherboard maker's CPU support list before you buy. Intel lists Sockets Supported as FCLGA1851. Samuel Willetts wrote that he does not expect new processors on this Intel platform now that this generation is out, and that a later 9800X3D successor can use the same motherboard. That is his expectation, not an Intel end-of-socket notice.

For flagship PCIe Gen 5 storage, Willetts wrote that the 270K Plus rig did not run the SSD at full speed in his synthetic test. Throughput fell by up to ~2,800 MB/s, and the 9800X3D rig did not show that drop. Ryzen 7 7800X3D vs Ryzen 7 9800X3D compares those two AMD processors. Core Ultra 5 250K Plus vs Core Ultra 7 270K Plus compares those two Intel processors.`;

const FAQS = [
  {
    question: "Should I choose the Ryzen 7 9800X3D or the Core Ultra 7 270K Plus for gaming?",
    answer:
      "Choose the Ryzen 7 9800X3D if the PC is mainly for games. Choose the Core Ultra 7 270K Plus if you also stream, edit, or compile, or if the Intel platform costs meaningfully less. Jake Roach wrote in Tom's Hardware, published 23 March 2026, that in his 17-game suite at 1080p with an RTX 5090 the 270K Plus was 20% slower than the 9800X3D, with iBOT on. He also wrote that Intel claims the 270K Plus is within 10% of the 9800X3D. The 10% line is his report of Intel's claim. The 20% line is his suite. In that same review the 270K Plus is 33% slower in Baldur's Gate 3 and 37% slower in F1 24.",
  },
  {
    question: "Should I choose the Core Ultra 7 270K Plus for streaming, editing, or compiling?",
    answer:
      "Choose the 270K Plus if you also stream, edit, or compile. Samuel Willetts wrote in Club386, published 30 March 2026, that the 270K Plus scored 80% higher than the 9800X3D in the Cinebench 2026 multi-thread test, 54% ahead in 7-Zip compression, and 8% ahead in Premiere Pro. The same write-up gives the 9800X3D an 18% score advantage in Photoshop. Geekbench 6 multi-core is 23,268 points and 27% quicker out of the box. No price is stated here.",
  },
  {
    question: "Does the processor matter with an RTX 5070 Ti at 1440p?",
    answer:
      "Choose the 9800X3D with an RTX 5070 Ti at 1440p if the PC is mainly for games. Choose the 270K Plus if you also stream, edit, or compile, or if the Intel platform costs meaningfully less. No frame rate for an RTX 5070 Ti at 1440p is given here. LTT Labs wrote on 31 March 2026 that a processor starts to matter less as resolution or graphics settings raise the load on the graphics card, and that an earlier 4K pairing of a Ryzen 5 7500F and a Ryzen 7 9800X3D showed no difference. That earlier test is not a 270K Plus result. RTX 5070 vs RTX 5070 Ti compares those graphics cards.",
  },
  {
    question: "What cores, cache, and power does each company list?",
    answer:
      "AMD lists 8 cores, 16 threads, 96 MB of L3 cache, 8 MB of L2 cache, a 4.7 GHz base clock, a boost of up to 5.2 GHz, and a 120W default TDP. Intel lists 24 cores (8 performance-cores and 16 efficient-cores), 24 threads, 36 MB Intel Smart Cache, 40 MB total L2 cache, a 5.5 GHz max turbo frequency, 125 W processor base power, and 250 W maximum turbo power. Intel does not name the cache row L3. Hyper-Threading is No on the 270K Plus. SMT is Yes on the 9800X3D.",
  },
  {
    question: "Which socket should I choose if I want a later processor?",
    answer:
      "Choose AM5 if you want the socket AMD, on 31 May 2026, says it is extending through 2029. Choose FCLGA1851 if the Intel platform costs meaningfully less. Samuel Willetts wrote in Club386 that he does not expect new processors on this Intel platform now that this generation is out. AMD lists B650 and B850 among the supporting chipsets for the 9800X3D. Intel lists socket FCLGA1851 for the 270K Plus.",
  },
  {
    question: "What did Club386 measure for a PCIe Gen 5 SSD on the 270K Plus?",
    answer:
      "Samuel Willetts wrote in Club386, published 30 March 2026, that throughput on the 270K Plus rig fell by up to ~2,800 MB/s in synthetic benchmarks, while the 9800X3D test rig did not show that drop. That is his measurement on those two rigs. It is not a frame-rate result.",
  },
];

const VERDICT = `Choose the Ryzen 7 9800X3D if the PC is mainly for games. Tom's Hardware measured the Core Ultra 7 270K Plus 20% slower across a 17-game 1080p suite with an RTX 5090, published 23 March 2026, with iBOT on. Choose the Core Ultra 7 270K Plus if you also stream, edit, or compile, or if the Intel platform costs meaningfully less. Club386 measured an 80% higher Cinebench 2026 multi-thread score for the 270K Plus, published 30 March 2026.

No price is stated here. AMD lists socket AM5 and, on 31 May 2026, support for that socket through 2029. Intel lists socket FCLGA1851. Club386 does not expect new processors on this Intel platform now that this generation is out. The 4K note from LTT Labs is a Ryzen 5 7500F versus Ryzen 7 9800X3D result, not a 270K Plus result.`;

const META =
  "Choose the 9800X3D if the PC is mainly for games. Choose the 270K Plus if you also stream, edit, or compile, or if the Intel platform costs meaningfully less.";

const BUILT = buildEditorialComparison({
  slug: "ryzen-7-9800x3d-vs-core-ultra-7-270k-plus",
  title: "Ryzen 7 9800X3D vs Core Ultra 7 270K Plus?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: X3D,
      slug: X3D,
      name: "Ryzen 7 9800X3D",
      shortDesc:
        "Desktop processor. AMD lists 8 cores, 16 threads, 96 MB of L3 cache, a boost of up to 5.2 GHz, a 120W default TDP, and socket AM5.",
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
        "Desktop processor. Intel lists 24 cores, 24 threads, 36 MB Intel Smart Cache, a 5.5 GHz max turbo frequency, 250 W maximum turbo power, and socket FCLGA1851.",
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
      entityAValue: "8 cores and 16 threads. SMT is Yes",
      entityBValue:
        "24 cores (8 performance-cores and 16 efficient-cores) and 24 threads. Hyper-Threading is No",
      winner: "tie",
    },
    {
      label: "Boost or turbo",
      entityAValue: "Max boost clock up to 5.2 GHz. Base clock 4.7 GHz",
      entityBValue:
        "Max turbo frequency 5.5 GHz. Performance-core max turbo frequency 5.4 GHz. Turbo Boost Max Technology 3.0 frequency 5.5 GHz",
      winner: "tie",
    },
    {
      label: "Cache",
      entityAValue: "L2 8 MB and L3 96 MB. 2nd gen AMD 3D V-Cache. The sum of L2 and L3 is 104 MB",
      entityBValue: "36 MB Intel Smart Cache and 40 MB total L2 cache. The rows are not named L3",
      winner: "tie",
    },
    {
      label: "Power",
      entityAValue: "120W default TDP. Tjmax 95°C. Thermal solution not included",
      entityBValue: "125 W processor base power and 250 W maximum turbo power. PCG 2020A. 105°C",
      winner: "tie",
    },
    {
      label: "Memory and socket",
      entityAValue: "Socket AM5. DDR5 up to 256 GB. Two modules up to DDR5-5600 on the specification",
      entityBValue: "Socket FCLGA1851. Up To DDR5 7200 MT/s. 256 GB, dependent on memory type",
      winner: "tie",
    },
    {
      label: "Tom's Hardware 17-game suite, 1080p, RTX 5090, 23 March 2026",
      entityAValue: "The chip the 20% line is measured against. iBOT was on",
      entityBValue: "20% slower than the 9800X3D in that suite. Roach also reports Intel's within-10% claim",
      winner: "tie",
    },
    {
      label: "Club386 Cinebench 2026 multi-thread, 30 March 2026",
      entityAValue: "The chip that margin is measured against",
      entityBValue: "80% higher score than the 9800X3D",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("cores", "Cores and threads", "AMD and Intel", X3D, U7, "8 cores and 16 threads. SMT is Yes", "24 cores, 24 threads, Hyper-Threading No"),
    textAttr(
      "clocks",
      "Clocks",
      "AMD and Intel",
      X3D,
      U7,
      "4.7 GHz base. Max boost up to 5.2 GHz",
      "Max turbo 5.5 GHz. Performance-core max turbo 5.4 GHz. Performance-core base 3.7 GHz. Efficient-core base 3.2 GHz",
    ),
    textAttr(
      "cache",
      "Cache",
      "AMD and Intel",
      X3D,
      U7,
      "L1 640 KB. L2 8 MB. L3 96 MB. 2nd gen AMD 3D V-Cache",
      "36 MB Intel Smart Cache. Total L2 cache 40 MB. Neither row is named L3",
    ),
    textAttr(
      "power",
      "Power",
      "AMD and Intel",
      X3D,
      U7,
      "120W default TDP. Tjmax 95°C. Liquid cooler recommended. Thermal solution not included",
      "125 W processor base power. 250 W maximum turbo power. PCG 2020A. 105°C max operating temperature",
    ),
    textAttr(
      "platform",
      "Socket and memory",
      "AMD and Intel",
      X3D,
      U7,
      "AM5. DDR5, 2 channels, 256 GB. 2x1R and 2x2R DDR5-5600. 4x1R and 4x2R DDR5-3600. Chipsets include B650 and B850",
      "FCLGA1851. Up To DDR5 7200 MT/s. 256 GB, dependent on memory type. 2 channels",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "core-ultra-5-250k-plus-vs-core-ultra-7-270k-plus",
      title: "250K Plus vs 270K Plus?",
      category: "technology",
    },
    {
      slug: "ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
      title: "Ryzen 7 7800X3D vs Ryzen 7 9800X3D for Desktop Gaming",
      category: "technology",
    },
    {
      slug: "rtx-5070-vs-rtx-5070-ti",
      title: "RTX 5070 vs RTX 5070 Ti",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "Tom's Hardware measured the 270K Plus 20% slower than the 9800X3D in a 17-game 1080p suite with an RTX 5090, published 23 March 2026, with iBOT on. Club386 measured an 80% higher Cinebench 2026 multi-thread score for the 270K Plus, published 30 March 2026.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Ryzen 7 9800X3D specifications", url: AMD_9800 },
      { name: "Intel Core Ultra 7 270K Plus specifications", url: ARK_270 },
      { name: "AMD Computex 2026: Socket AM5 support through 2029 (31 May 2026)", url: AMD_AM5 },
      { name: "Tom's Hardware: Core Ultra 7 270K Plus gaming benchmarks (23 March 2026)", url: TOMS },
      { name: "Club386: Core Ultra 7 270K Plus vs Ryzen 7 9800X3D (30 March 2026)", url: CLUB386 },
      { name: "LTT Labs: Core Ultra 200S Plus gaming update (31 March 2026)", url: LTT },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Ryzen 7 9800X3D specifications",
      url: AMD_9800,
      description:
        "8 cores, 16 threads, SMT Yes, 4.7 GHz base, boost up to 5.2 GHz, L2 8 MB, L3 96 MB, 120W default TDP, socket AM5, DDR5-5600 for two modules, launch date 11/07/2024.",
    },
    {
      type: "external",
      label: "Intel Core Ultra 7 270K Plus specifications",
      url: ARK_270,
      description:
        "24 cores, 8 performance-cores and 16 efficient-cores, 24 threads, Hyper-Threading No, 5.5 GHz max turbo frequency, 36 MB Intel Smart Cache, 40 MB total L2 cache, 125 W processor base power, 250 W maximum turbo power, Up To DDR5 7200 MT/s, FCLGA1851. The cache rows are not named L3.",
    },
    {
      type: "external",
      label: "AMD Computex 2026: Socket AM5 support through 2029 (31 May 2026)",
      url: AMD_AM5,
      description:
        "31 May 2026. AMD says it is extending support for the Socket AM5 platform through 2029. No price from that post is repeated here.",
    },
    {
      type: "external",
      label: "Tom's Hardware: Core Ultra 7 270K Plus gaming benchmarks (23 March 2026)",
      url: TOMS,
      description:
        "Jake Roach, published 23 March 2026. 17-game suite at 1080p with an RTX 5090, iBOT on: the 270K Plus was 20% slower than the 9800X3D. He reports Intel's within-10% claim separately. Baldur's Gate 3 is 33% slower, and F1 24 is 37% slower.",
    },
    {
      type: "external",
      label: "Club386: Core Ultra 7 270K Plus vs Ryzen 7 9800X3D (30 March 2026)",
      url: CLUB386,
      description:
        "Samuel Willetts, 30 March 2026. Named 1080p margins with an RTX 5090, an 80% higher Cinebench 2026 multi-thread score, and up to ~2,800 MB/s less Gen5 SSD throughput on the 270K Plus rig. No price from that review is repeated here.",
    },
    {
      type: "external",
      label: "LTT Labs: Core Ultra 200S Plus gaming update (31 March 2026)",
      url: LTT,
      description:
        "31 March 2026. Nikolas H., tested by Sean H. A processor starts to matter less as GPU load rises. The 4K no-difference note is a Ryzen 5 7500F versus Ryzen 7 9800X3D test, not this pair.",
    },
    {
      type: "blog",
      label: "250K Plus vs 270K Plus?",
      url: "/compare/core-ultra-5-250k-plus-vs-core-ultra-7-270k-plus",
      description: "The two Core Ultra 200S Plus processors, in a separate comparison.",
    },
    {
      type: "blog",
      label: "Ryzen 7 7800X3D vs Ryzen 7 9800X3D for Desktop Gaming",
      url: "/compare/ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
      description: "Those two AMD processors, in a separate comparison.",
    },
    {
      type: "blog",
      label: "RTX 5070 vs RTX 5070 Ti",
      url: "/compare/rtx-5070-vs-rtx-5070-ti",
      description: "The two graphics cards in a separate comparison. No 1440p frame rate for a 5070 Ti is copied here.",
    },
  ],
  metaTitle: "Ryzen 7 9800X3D vs Core Ultra 7 270K Plus?",
});

BUILT.metadata.metaDescription = META;

export const RYZEN_7_9800X3D_VS_CORE_ULTRA_7_270K_PLUS: EditorialComparison = BUILT;
