import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-319 — Ryzen 7 7800X3D vs Ryzen 7 9800X3D.
 * Opened 5 November 2026 (Asia/Jerusalem).
 * Specs: AMD product pages for the Ryzen 7 7800X3D and the Ryzen 7 9800X3D.
 * Boot notes: PC Gamer, 2 April 2025 (AMD statement) and VideoCardz,
 * 24 March 2026 (three ASRock BIOS 4.10 cases; not a failure rate).
 * No winner. No frame-rate percentages. No street prices.
 * Reddit returned 403, so there is no community block.
 */

const A = "ryzen-7-7800x3d";
const B = "ryzen-7-9800x3d";

const AMD_7800 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7800x3d.html";
const AMD_9800 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const PC_GAMER =
  "https://www.pcgamer.com/hardware/processors/amd-says-the-problem-with-ryzen-7-9800x3d-chips-failing-to-boot-is-down-to-memory-compatibility-issues-and-not-actually-dead-cpus/";
const VIDEOCARDZ =
  "https://videocardz.com/newz/three-dead-ryzen-7-9800x3d-cases-reported-on-asrock-bios-4-10-despite-new-am5-fix";

const SOURCE_DATE = "2026-11-05";
const PUBLISHED = "2026-11-05T00:00:00Z";
const SPEC = "Specs";

const CHIPSETS =
  "A620, X670E, X670, B650E, B650, X870E, X870, B840, B850";

const SHORT_ANSWER =
  "At the same price, the Ryzen 7 9800X3D is the better buy. Both are 8-core, 16-thread AM5 processors with 96 MB of L3 cache. The 9800X3D uses Zen 5, with a 4.7 GHz base clock and a boost of up to 5.2 GHz. The 7800X3D uses Zen 4, with a 4.2 GHz base clock and a boost of up to 5 GHz. AMD lists B650 for both. PC Gamer reports that AMD knew of a limited number of user reports involving ASRock AM5 motherboards failing to complete POST, linked to memory compatibility in earlier BIOS versions. Update to the motherboard maker's latest BIOS before the swap. An ASUS B650 board is not an ASRock board. Neither chip is the right pick for every build.";

const FAQS = [
  {
    question: "Is the Ryzen 7 9800X3D better than the 7800X3D?",
    answer:
      "Yes. Both have 8 cores, 16 threads, and 96 MB of L3 cache. The 9800X3D uses the newer Zen 5 architecture, with a 4.7 GHz base clock and a boost of up to 5.2 GHz. The 7800X3D uses Zen 4, with a 4.2 GHz base clock and a boost of up to 5 GHz.",
  },
  {
    question: "If the 7800X3D and 9800X3D cost the same, which should I buy?",
    answer:
      "The Ryzen 7 9800X3D. At the same price it is the newer Zen 5 chip, with higher clocks, and it fits the same AM5 motherboards.",
  },
  {
    question: "Does the Ryzen 7 9800X3D work on a B650 motherboard?",
    answer:
      "Yes. AMD lists B650 and B650E among the supported chipsets for the Ryzen 7 9800X3D and for the Ryzen 7 7800X3D. Update the motherboard to its latest BIOS before installing the CPU.",
  },
  {
    question: "Are Ryzen 7 9800X3D CPUs failing?",
    answer:
      "AMD told PC Gamer it was aware of a limited number of user reports involving ASRock AM5 motherboards failing to complete POST. AMD and ASRock identified a memory compatibility issue in earlier BIOS versions and said the latest BIOS rectifies it. AMD recommends updating to the latest BIOS for the specific motherboard. That statement does not give a failure rate. VideoCardz, on March 24, 2026, reported three further cases on ASRock boards running BIOS 4.10. Those cases are not a failure rate, and the boards named there are ASRock boards. An ASUS B650 board is a different board.",
  },
  {
    question: "Do I need a new cooler?",
    answer:
      "Neither the Ryzen 7 7800X3D nor the Ryzen 7 9800X3D includes a cooler. AMD recommends a liquid cooler for both, for optimal performance. A 360 mm liquid cooler matches that recommendation.",
  },
];

const VERDICT = `At the same price, choose the Ryzen 7 9800X3D. AMD lists Zen 5, a 4.7 GHz base, and a boost of up to 5.2 GHz, against Zen 4, a 4.2 GHz base, and a boost of up to 5 GHz on the Ryzen 7 7800X3D. Both have 8 cores, 16 threads, 96 MB of L3 cache, a 120W default TDP, and socket AM5.

If the Ryzen 7 7800X3D costs clearly less, it is still a gaming processor with the same core count and the same 96 MB of L3 cache. Both drop into the same AM5 motherboards, including B650. Neither chip is the right pick for every build. Prices change, so compare current prices.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- AMD lists 8 cores, 16 threads, 8 MB of L2 cache, 96 MB of L3 cache, a 120W default TDP, and socket AM5 for both the Ryzen 7 7800X3D and the Ryzen 7 9800X3D.
- The 7800X3D is Zen 4 (former codename Raphael AM5): 4.2 GHz base, boost up to 5 GHz, TSMC 5nm FinFET CPU cores, 512 KB of L1 cache, Tjmax 89°C, max memory 128 GB, 2x1R DDR5-5200. Launch date April 6, 2023.
- The 9800X3D is Zen 5 (former codename Granite Ridge AM5): 4.7 GHz base, boost up to 5.2 GHz, TSMC 4nm FinFET CPU cores, 640 KB of L1 cache, Tjmax 95°C, max memory 256 GB, 2x1R DDR5-5600, 2nd gen AMD 3D V-Cache. Launch date November 7, 2024.
- AMD lists the same supporting chipsets for both, including B650 and B650E: ${CHIPSETS}.
- Neither processor includes a cooler. AMD recommends a liquid cooler for both.
- At the same price, the 9800X3D is the newer chip. If the 7800X3D costs clearly less, the shared core count and the shared 96 MB of L3 cache still make it a gaming processor. Neither chip is the right pick for every build.

Specs AMD lists

AMD's spec block for the Ryzen 7 7800X3D names the former codename Raphael AM5 and the architecture Zen 4. It lists 8 cores, 16 threads, SMT, a boost of up to 5 GHz, a 4.2 GHz base clock, 512 KB of L1 cache, 8 MB of L2 cache, and 96 MB of L3 cache. AMD calls the cache technology AMD 3D V-Cache. Default TDP is 120W. CPU cores are TSMC 5nm FinFET. The I/O die is TSMC 6nm FinFET. The package die count is 2. Tjmax is 89°C. Launch date is April 6, 2023 (AMD prints 04/06/2023). The socket is AM5. PCIe version is 5.0, with 28 native lanes and 24 usable. Memory is DDR5, two channels, UDIMM, up to 128 GB. Listed maximum memory speed is 2x1R DDR5-5200, 2x2R DDR5-5200, 4x1R DDR5-3600, and 4x2R DDR5-3600. ECC support is Yes, and AMD notes that it requires motherboard support. Graphics are AMD Radeon Graphics, 2 cores at 2200 MHz. The thermal solution is not included. AMD recommends a liquid cooler for optimal performance. AMD EXPO, Precision Boost Overdrive, and Curve Optimizer are listed as Yes. NVMe support is Boot, RAID0, RAID1, and RAID10.

AMD's spec block for the Ryzen 7 9800X3D names the former codename Granite Ridge AM5 and the architecture Zen 5. It lists 8 cores, 16 threads, SMT, a boost of up to 5.2 GHz, a 4.7 GHz base clock, 640 KB of L1 cache, 8 MB of L2 cache, and 96 MB of L3 cache. AMD calls the cache technology 2nd gen AMD 3D V-Cache. Default TDP is 120W. CPU cores are TSMC 4nm FinFET. The I/O die is TSMC 6nm FinFET. The package die count is 2. Tjmax is 95°C. Launch date is November 7, 2024 (AMD prints 11/07/2024). The socket is AM5. PCIe version is 5.0, with 28 native lanes and 24 usable. Memory is DDR5, two channels, UDIMM, up to 256 GB. Listed maximum memory speed is 2x1R DDR5-5600, 2x2R DDR5-5600, 4x1R DDR5-3600, and 4x2R DDR5-3600. ECC support is Yes, and AMD notes that it requires motherboard support. Graphics are AMD Radeon Graphics, 2 cores at 2200 MHz. The thermal solution is not included. AMD recommends a liquid cooler for optimal performance. AMD EXPO, Precision Boost Overdrive, Curve Optimizer, and Unlocked for Overclocking are listed as Yes. NVMe support is Boot, RAID0, RAID1, RAID5, and RAID10.

On both chips, AMD lists the same supporting chipsets: ${CHIPSETS}. B650 and B650E are on that list for the 7800X3D and for the 9800X3D. A chipset name is not a promise that every board revision already boots the chip. Read the motherboard maker's CPU support list for a BIOS that names the processor before you buy.

Same cache, different architecture

Both processors have 96 MB of L3 cache and 8 MB of L2 cache. The cache size is not the split. The 9800X3D is the newer Zen 5 design, and AMD gives it higher clocks: 4.7 GHz base and up to 5.2 GHz, against 4.2 GHz and up to 5 GHz on the Zen 4 7800X3D. AMD also names 2nd gen AMD 3D V-Cache on the 9800X3D. On the 7800X3D, AMD names AMD 3D V-Cache. L1 cache is 512 KB on the 7800X3D and 640 KB on the 9800X3D. CPU cores are TSMC 5nm FinFET on the 7800X3D and TSMC 4nm FinFET on the 9800X3D. Both I/O dies are TSMC 6nm FinFET.

Gaming when the CPU or the graphics card is the limit

A processor prepares frames. A graphics card draws them. When the graphics card finishes a frame before the processor has the next one ready, the CPU is the limit, and the newer architecture and the higher clocks are the reason to pick the 9800X3D at the same price. That shows up more often in competitive shooters on a high-refresh 1440p display, such as a 1440p 320 Hz screen, where the frame target is high and the scene is light. When the graphics card is still drawing the frame, the two processors land closer together. Heavy AAA scenes can do that even with a fast card such as a GeForce RTX 5080. There is no frame-rate percentage here. The RX 9070 XT vs RTX 5080 for the graphics card comparison covers the GPU side of the same build.

Boot reports, calmly

PC Gamer, on April 2, 2025, reports this statement from AMD: "We are aware of a limited number of user reports involving ASRock AM5 motherboards failing to complete POST." AMD and ASRock identified a memory compatibility issue in earlier BIOS versions, which AMD said the latest BIOS rectifies. AMD also said a failure to complete POST can have many causes and does not necessarily indicate a non-functional CPU. AMD recommends updating the BIOS to the latest version for the specific motherboard, and contacting AMD support if the problem remains.

VideoCardz, on March 24, 2026, reported three further Ryzen 7 9800X3D cases on ASRock boards running BIOS 4.10. The boards in that report are an X870 Pro RS WiFi, an X870 Riptide WiFi, and a B850 Riptide WiFi. Treat that report as three cases, not a failure rate. Those boards are ASRock boards.

An ASUS Prime B650M-R is an ASUS B650 board, not an ASRock board. The ASRock reports are not a finding about that ASUS board. The practical steps are the same on either brand: update the BIOS before the swap, use the file from the motherboard maker, keep EXPO and Precision Boost Overdrive at the settings the board posts with, and check that the AM5 socket is clean before the new CPU goes in.

Upgrade from a Ryzen 5 7600

Both the 7800X3D and the 9800X3D use socket AM5. A Ryzen 5 7600 on a B650 board is already on AM5, so the motherboard does not have to change when its CPU support list names the new processor. For an ASUS Prime B650M-R, that means a BIOS update, not a new board.

Update the BIOS first, with the Ryzen 5 7600 still installed, from the motherboard maker's support download for the Prime B650M-R. Confirm that board's CPU support list names the Ryzen 7 7800X3D or the Ryzen 7 9800X3D on that BIOS. Power off, confirm the socket is free of debris, install the new CPU, and remount the cooler. Neither X3D processor includes a cooler, and AMD recommends a liquid cooler for both. A 360 mm liquid cooler matches that recommendation.

After the system starts, load the memory EXPO profile. AMD lists a maximum memory speed of DDR5-5200 for two single-rank or two dual-rank modules on the 7800X3D, and DDR5-5600 for those same two-module layouts on the 9800X3D. Four modules drop to DDR5-3600 on both. Both list AMD EXPO. A 32 GB kit is under the maximum capacity AMD lists: 128 GB on the 7800X3D and 256 GB on the 9800X3D. Leave Precision Boost Overdrive at the motherboard default until the new CPU has completed POST.

Ryzen 7 9700X vs Ryzen 7 9800X3D for Zen 5 gaming is the neighboring CPU comparison. B850 vs X870 when replacing a B650 board is the later chipset question. A B650 board that already supports the CPU does not have to be replaced for this upgrade.`;

const BUILT = buildEditorialComparison({
  slug: "ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
  title: "Ryzen 7 7800X3D vs Ryzen 7 9800X3D for Desktop Gaming",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Ryzen 7 7800X3D",
      shortDesc:
        "Zen 4 desktop CPU with 8 cores, 16 threads, 96 MB of L3 cache, and a 120W default TDP.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "8 cores, 16 threads, 96 MB L3, 120W, socket AM5 (AMD)",
        "AMD lists B650 and B650E, and the same chipset set as the 9800X3D",
        "Same 96 MB of L3 cache when the 9800X3D costs more (AMD)",
      ],
      cons: [
        "Zen 4, against Zen 5 on the 9800X3D (AMD)",
        "4.2 GHz base and boost up to 5 GHz, against 4.7 GHz and up to 5.2 GHz (AMD)",
        "Max memory 128 GB and 2x1R DDR5-5200, against 256 GB and DDR5-5600 (AMD)",
      ],
      bestFor: "A clearly lower price than the 9800X3D, on a B650 board you already own",
    },
    {
      id: B,
      slug: B,
      name: "Ryzen 7 9800X3D",
      shortDesc:
        "Zen 5 desktop CPU with 8 cores, 16 threads, 96 MB of L3 cache, and 2nd gen AMD 3D V-Cache.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Zen 5, 4.7 GHz base, boost up to 5.2 GHz, 96 MB L3 (AMD)",
        "2nd gen AMD 3D V-Cache (AMD)",
        "Max memory 256 GB and 2x1R DDR5-5600 (AMD)",
      ],
      cons: [
        "120W default TDP, the same rating as the 7800X3D (AMD)",
        "No cooler in the box. Liquid cooler recommended (AMD)",
        "PC Gamer and VideoCardz describe ASRock AM5 boot reports, not a failure rate",
      ],
      bestFor: "The same price as the 7800X3D, for CPU-limited gaming",
    },
  ],
  keyDifferences: [
    { label: "Architecture", entityAValue: "Zen 4", entityBValue: "Zen 5", winner: "tie" },
    { label: "Former codename", entityAValue: "Raphael AM5", entityBValue: "Granite Ridge AM5", winner: "tie" },
    { label: "Cores and threads", entityAValue: "8 cores, 16 threads", entityBValue: "8 cores, 16 threads", winner: "tie" },
    { label: "Base clock", entityAValue: "4.2 GHz", entityBValue: "4.7 GHz", winner: "tie" },
    { label: "Boost clock", entityAValue: "Up to 5 GHz", entityBValue: "Up to 5.2 GHz", winner: "tie" },
    { label: "L2 cache", entityAValue: "8 MB", entityBValue: "8 MB", winner: "tie" },
    { label: "L3 cache", entityAValue: "96 MB", entityBValue: "96 MB", winner: "tie" },
    { label: "3D V-Cache", entityAValue: "AMD 3D V-Cache", entityBValue: "2nd gen AMD 3D V-Cache", winner: "tie" },
    { label: "Default TDP", entityAValue: "120W", entityBValue: "120W", winner: "tie" },
    { label: "Tjmax", entityAValue: "89°C", entityBValue: "95°C", winner: "tie" },
    { label: "CPU core process", entityAValue: "TSMC 5nm FinFET", entityBValue: "TSMC 4nm FinFET", winner: "tie" },
    { label: "Max memory", entityAValue: "128 GB", entityBValue: "256 GB", winner: "tie" },
    { label: "Memory speed, two modules", entityAValue: "2x1R DDR5-5200", entityBValue: "2x1R DDR5-5600", winner: "tie" },
    { label: "Launch date", entityAValue: "April 6, 2023", entityBValue: "November 7, 2024", winner: "tie" },
    { label: "B650 on the chipset list", entityAValue: "Yes", entityBValue: "Yes", winner: "tie" },
    { label: "Cooler", entityAValue: "Not included. Liquid cooler recommended", entityBValue: "Not included. Liquid cooler recommended", winner: "tie" },
    { label: "Socket", entityAValue: "AM5", entityBValue: "AM5", winner: "tie" },
  ],
  attributes: [
    textAttr("codename", "Former codename", SPEC, A, B, "Raphael AM5", "Granite Ridge AM5"),
    textAttr("arch", "Architecture", SPEC, A, B, "Zen 4", "Zen 5"),
    textAttr("cores", "Cores and threads", SPEC, A, B, "8 cores, 16 threads, SMT", "8 cores, 16 threads, SMT"),
    textAttr("base", "Base clock", SPEC, A, B, "4.2 GHz", "4.7 GHz"),
    textAttr("boost", "Max boost", SPEC, A, B, "Up to 5 GHz", "Up to 5.2 GHz"),
    textAttr("l1", "L1 cache", SPEC, A, B, "512 KB", "640 KB"),
    textAttr("l2", "L2 cache", SPEC, A, B, "8 MB", "8 MB"),
    textAttr("l3", "L3 cache", SPEC, A, B, "96 MB", "96 MB"),
    textAttr("vcache", "3D V-Cache", SPEC, A, B, "AMD 3D V-Cache", "2nd gen AMD 3D V-Cache"),
    textAttr("tdp", "Default TDP", SPEC, A, B, "120W", "120W"),
    textAttr("tjmax", "Tjmax", SPEC, A, B, "89°C", "95°C"),
    textAttr("ccd", "CPU core process", SPEC, A, B, "TSMC 5nm FinFET", "TSMC 4nm FinFET"),
    textAttr("iod", "I/O die process", SPEC, A, B, "TSMC 6nm FinFET", "TSMC 6nm FinFET"),
    textAttr("memory", "Max memory", SPEC, A, B, "128 GB DDR5, 2 channels, UDIMM", "256 GB DDR5, 2 channels, UDIMM"),
    textAttr(
      "memspeed",
      "Max memory speed",
      SPEC,
      A,
      B,
      "2x1R DDR5-5200, 2x2R DDR5-5200, 4x1R DDR5-3600, 4x2R DDR5-3600",
      "2x1R DDR5-5600, 2x2R DDR5-5600, 4x1R DDR5-3600, 4x2R DDR5-3600"
    ),
    textAttr("ecc", "ECC", SPEC, A, B, "Yes (requires motherboard support)", "Yes (requires motherboard support)"),
    textAttr("launch", "Launch date", SPEC, A, B, "April 6, 2023", "November 7, 2024"),
    textAttr("chipsets", "Supporting chipsets", SPEC, A, B, CHIPSETS, CHIPSETS),
    textAttr(
      "cooler",
      "Cooler",
      SPEC,
      A,
      B,
      "Not included. Liquid cooler recommended for optimal performance",
      "Not included. Liquid cooler recommended for optimal performance"
    ),
    textAttr("socket", "Socket", SPEC, A, B, "AM5", "AM5"),
    textAttr("pcie", "PCIe", SPEC, A, B, "PCIe 5.0, 28 total / 24 usable", "PCIe 5.0, 28 total / 24 usable"),
    textAttr("graphics", "Graphics", SPEC, A, B, "AMD Radeon Graphics, 2 cores, 2200 MHz", "AMD Radeon Graphics, 2 cores, 2200 MHz"),
    textAttr("nvme", "NVMe support", SPEC, A, B, "Boot, RAID0, RAID1, RAID10", "Boot, RAID0, RAID1, RAID5, RAID10"),
    textAttr("expo", "AMD EXPO and PBO", SPEC, A, B, "EXPO Yes. Precision Boost Overdrive Yes", "EXPO Yes. Precision Boost Overdrive Yes"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "ryzen-7-9700x-vs-ryzen-7-9800x3d",
      title: "Ryzen 7 9700X vs Ryzen 7 9800X3D for Zen 5 gaming",
      category: "technology",
    },
    {
      slug: "rx-9070-xt-vs-rtx-5080",
      title: "RX 9070 XT vs RTX 5080 for the graphics card",
      category: "technology",
    },
    {
      slug: "b850-vs-x870",
      title: "B850 vs X870 when replacing a B650 board",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Ryzen 7 9800X3D when the two chips cost the same. Ryzen 7 7800X3D when it costs clearly less. Neither chip is the right pick for every build.",
    keyFact:
      "AMD lists 8 cores, 16 threads, and 96 MB of L3 cache for both. The 9800X3D is Zen 5 at 4.7 GHz base and up to 5.2 GHz. The 7800X3D is Zen 4 at 4.2 GHz base and up to 5 GHz.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 48,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Ryzen 7 7800X3D specifications", url: AMD_7800 },
      { name: "AMD Ryzen 7 9800X3D specifications", url: AMD_9800 },
      { name: "PC Gamer: AMD on 9800X3D boot reports", url: PC_GAMER },
      { name: "VideoCardz: ASRock BIOS 4.10 cases", url: VIDEOCARDZ },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Ryzen 7 7800X3D specifications",
      url: AMD_7800,
      description:
        "Raphael AM5, Zen 4, 8 cores, 16 threads, boost up to 5 GHz, 4.2 GHz base, 512 KB L1, 8 MB L2, 96 MB L3, AMD 3D V-Cache, 120W, TSMC 5nm FinFET CPU cores, TSMC 6nm FinFET I/O die, Tjmax 89°C, April 6, 2023, AM5, PCIe 5.0 with 28 / 24 lanes, DDR5 up to 128 GB, 2x1R DDR5-5200, ECC with motherboard support, Radeon Graphics with 2 cores at 2200 MHz, cooler not included, liquid cooler recommended. Chipsets include B650 and B650E.",
    },
    {
      type: "external",
      label: "AMD Ryzen 7 9800X3D specifications",
      url: AMD_9800,
      description:
        "Granite Ridge AM5, Zen 5, 8 cores, 16 threads, boost up to 5.2 GHz, 4.7 GHz base, 640 KB L1, 8 MB L2, 96 MB L3, 2nd gen AMD 3D V-Cache, 120W, TSMC 4nm FinFET CPU cores, TSMC 6nm FinFET I/O die, Tjmax 95°C, November 7, 2024, AM5, PCIe 5.0 with 28 / 24 lanes, DDR5 up to 256 GB, 2x1R DDR5-5600, ECC with motherboard support, Radeon Graphics with 2 cores at 2200 MHz, cooler not included, liquid cooler recommended, unlocked for overclocking. Chipsets include B650 and B650E.",
    },
    {
      type: "external",
      label: "PC Gamer: AMD on 9800X3D boot reports",
      url: PC_GAMER,
      description:
        "Jeremy Laird, April 2, 2025. AMD said it was aware of a limited number of user reports involving ASRock AM5 motherboards failing to complete POST. AMD and ASRock identified a memory compatibility issue in earlier BIOS versions and said the latest BIOS rectifies it. AMD said a failure to POST does not necessarily indicate a non-functional CPU, and recommended the latest BIOS for the specific motherboard.",
    },
    {
      type: "external",
      label: "VideoCardz: ASRock BIOS 4.10 cases",
      url: VIDEOCARDZ,
      description:
        "March 24, 2026. Three further Ryzen 7 9800X3D cases on ASRock boards running BIOS 4.10: X870 Pro RS WiFi, X870 Riptide WiFi, and B850 Riptide WiFi. A case count from that report, not a failure rate. The boards named are ASRock boards.",
    },
  ],
  metaTitle: "Ryzen 7 7800X3D vs 9800X3D",
});

BUILT.metadata.metaDescription =
  "Ryzen 7 7800X3D vs 9800X3D for gaming: Zen 4 vs Zen 5, 8 cores, 96 MB L3, clocks, 120W, B650 support, and the same-price choice.";

export const RYZEN_7_7800X3D_VS_RYZEN_7_9800X3D: EditorialComparison = BUILT;
