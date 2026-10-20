import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-289 — DDR5 vs DDR4 for gaming.
 * Read on 20 October 2026 from Kingston's DDR5 overview (JEDEC data rates,
 * voltage, PMIC, subchannels, module key, on-die ECC), Kingston's gaming
 * memory support FAQ (dual channel, kits), Kingston's DDR5 speed test
 * (qualitative finding only), AMD's Ryzen 5 9600X and Ryzen 7 5800X3D spec
 * pages, AMD's AM5 chipset and Ryzen desktop pages, and Intel's Core i5-14600K
 * and Core Ultra 5 245K spec pages plus Intel's Core Ultra (Series 2) desktop
 * support article. No fps numbers, no percentages, no prices, no winner.
 * Dropped from the brief: thread anecdotes (9600X "roughly comparable" to a
 * 14600K, "little difference at 1440p"), "end-of-line" platform claims, the
 * 245K DDR5-6400 figure (Intel's spec page and support article disagree), and
 * family-wide "Intel 12th to 14th gen" support (only the 14600K was opened).
 */

const A = "ddr5";
const B = "ddr4";

const KINGSTON_DDR5 = "https://www.kingston.com/en/blog/pc-performance/ddr5-overview";
const KINGSTON_FAQ = "https://www.kingston.com/en/support/technical/products/gaming-memory";
const KINGSTON_TEST = "https://www.kingston.com/en/blog/gaming/overclocking-ram-more-fps";
const AMD_9600X = "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-5-9600x.html";
const AMD_5800X3D = "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5800x3d.html";
const AMD_AM5 = "https://www.amd.com/en/products/processors/chipsets/am5.html";
const AMD_RYZEN = "https://www.amd.com/en/products/processors/desktops/ryzen.html";
const INTEL_14600K =
  "https://www.intel.com/content/www/us/en/products/sku/236799/intel-core-i5-processor-14600k-24m-cache-up-to-5-30-ghz/specifications.html";
const INTEL_245K =
  "https://www.intel.com/content/www/us/en/products/sku/241067/intel-core-ultra-5-processor-245k-24m-cache-up-to-5-20-ghz/specifications.html";
const INTEL_ULTRA_S2 = "https://www.intel.com/content/www/us/en/support/articles/000099656/processors.html";

const SOURCE_DATE = "2026-10-20";
const PUBLISHED = "2026-10-20T00:00:00Z";

const SHORT_ANSWER =
  "For gaming, your CPU and motherboard usually decide between DDR5 and DDR4, not the RAM itself. AMD lists DDR5 as the only memory type for AM5 chips such as the Ryzen 5 9600X, and DDR4 only for AM4 chips such as the Ryzen 7 5800X3D. Intel lists the Core i5-14600K with both DDR5 and DDR4, so the motherboard picks one, while the Core Ultra 5 245K takes DDR5. Kingston found that CPU-heavy games react more to memory speed than games limited by the graphics card. In a GPU-limited build, a DDR4 platform can leave money for a better GPU or monitor, while AM5 with DDR5 suits buyers who want a CPU upgrade path.";

const FAQS = [
  {
    question: "Is DDR5 worth it over DDR4 for gaming?",
    answer:
      "Your CPU and motherboard decide which one you can use. On AM5 or Intel Core Ultra (Series 2) you need DDR5. On a DDR4 platform, games limited by the graphics card react less to memory speed, per Kingston's own testing, so the savings can go to a better GPU or monitor. CPU-heavy games react more to memory speed.",
  },
  {
    question: "Can I use DDR4 RAM in a DDR5 motherboard?",
    answer:
      "No. Kingston explains that the notch in the middle of a DDR5 module sits in a different place, so DDR4 modules cannot be installed in DDR5 sockets. A motherboard has sockets for one type only.",
  },
  {
    question: "Does AMD AM5 support DDR4?",
    answer:
      "No. AMD lists DDR5 as the system memory type for AM5 processors such as the Ryzen 5 9600X, and describes AM5 boards as DDR5 platforms for Ryzen 7000, 8000 and 9000 Series chips. AM4 chips such as the Ryzen 7 5800X3D use DDR4.",
  },
  {
    question: "Which Intel processors support both DDR4 and DDR5?",
    answer:
      "Intel lists the Core i5-14600K, a 14th gen LGA1700 chip, with support for up to DDR5-5600 or up to DDR4-3200, so the motherboard you pick sets the memory type. Intel lists the Core Ultra 5 245K, an LGA1851 chip, with DDR5 only. Check the Intel spec page for your exact model.",
  },
  {
    question: "Is 2x8GB or 1x16GB RAM better for gaming?",
    answer:
      "Two matching modules are better. Kingston explains that adding a second identical module turns on dual channel mode, which effectively doubles memory bandwidth, and in Kingston's own DDR5 testing a single module trailed the dual channel kit in a CPU-focused game. Kingston recommends buying a kit of two rather than adding a second stick later.",
  },
  {
    question: "Does DDR5 use less power than DDR4?",
    answer:
      "Kingston reports that DDR5 runs at 1.1V against 1.2V for DDR4, and that DDR5 modules carry their own power management chip (PMIC) on the module.",
  },
];

const VERDICT = `Best for a new AM5 or Intel Core Ultra (Series 2) build: DDR5. AMD and Intel list DDR5 as the only memory type for these platforms, and AMD describes AM5 as a platform with multi-year socket support.

Best when you reuse or buy an AM4 or DDR4 LGA1700 platform: DDR4. AMD lists DDR4 for AM4 chips such as the Ryzen 7 5800X3D, and Intel lists DDR4-3200 for the Core i5-14600K on DDR4 boards.

Neither is right for everyone. Prices change, so compare the total cost of CPU, motherboard and memory together.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- The CPU and motherboard decide the memory generation. You cannot pick DDR4 or DDR5 separately from the platform.
- AMD lists DDR5 only for AM5 chips such as the Ryzen 5 9600X, and DDR4 only for AM4 chips such as the Ryzen 7 5800X3D.
- Intel lists the Core i5-14600K with both DDR5-5600 and DDR4-3200 support, so the board decides. The Core Ultra 5 245K is DDR5 only.
- Kingston reports that DDR5 starts at 4800 MT/s, while DDR4 tops out at 3200 MT/s at JEDEC standard speeds, and that DDR5 runs at 1.1V against 1.2V.
- Kingston's DDR5 testing found that CPU-heavy games react more to memory speed, while games limited by the graphics card react less.
- Two matching modules run in dual channel mode. Kingston recommends a kit of two, such as 2x16GB for 32GB.

Which platforms take DDR5 and which take DDR4

The platform decides: AM5 and Intel Core Ultra (Series 2) take DDR5, AM4 takes DDR4, and Intel 14th gen chips such as the Core i5-14600K take either, depending on the motherboard.

1. AMD AM5 (Ryzen 7000, 8000 and 9000 Series): DDR5. AMD lists the Ryzen 5 9600X with DDR5 only, up to DDR5-5600 with two single-rank modules.
2. AMD AM4 (for example the Ryzen 7 5800X3D): DDR4. AMD lists DDR4 only, up to DDR4-3200 with two modules.
3. Intel LGA1700 (for example the Core i5-14600K): up to DDR5-5600 or up to DDR4-3200, per Intel. A given motherboard supports one of the two.
4. Intel LGA1851 (Core Ultra Series 2, for example the Core Ultra 5 245K): DDR5 only. Intel says these chips are not cross-compatible with older platforms.

Kingston explains that the notch in the middle of a DDR5 module sits in a different place to stop DDR4 or other module types from being installed, so the two generations are not interchangeable.

What actually changes from DDR4 to DDR5

DDR5 starts at a higher data rate and lower voltage, and changes how each module is organized. These are the main points from Kingston's DDR5 overview, which credits the JEDEC standard:

- Data rate: DDR5 starts at 4800 MT/s, while DDR4 tops out at 3200 MT/s. JEDEC standard DDR5 speeds scale up to 8800 MT/s.
- Voltage: 1.1V for DDR5 against 1.2V for DDR4.
- Power management: DDR5 modules carry an on-board power management chip (PMIC).
- Subchannels: each DDR5 module is split into two independent 32-bit subchannels.
- Banks and burst length: DDR5 doubles the banks from 16 to 32 and the minimum burst length from 8 to 16.
- On-die ECC: DDR5 chips correct bit errors inside the chip. Kingston notes this does not correct errors on the bus between module and CPU, so it is not the same as ECC memory.

None of these specs converts directly into frame rate. Whether memory matters depends on whether the CPU or the graphics card sets the limit in a game.

How much memory matters in games

Memory speed matters most when the CPU limits the frame rate and least when the graphics card does. Kingston tested DDR5 kits at several speeds with a Core i7-13700K and an RTX 3070 at 1080p high settings, and found that CPU-intensive games responded more to memory speed, while GPU-dependent games were less influenced. Kingston's test compared DDR5 speeds, not DDR4 against DDR5.

- At higher resolutions with high or ultra settings, many games lean on the graphics card, so the memory generation tends to change less.
- At lower resolutions aimed at very high refresh rates, the CPU and memory carry more of the load.
- Large-cache chips such as AMD's 3D V-Cache parts keep more data on the CPU, which means fewer trips to system memory. AMD lists 96 MB of L3 cache on the Ryzen 7 5800X3D.

Cost and upgrade path

Compare whole platforms, not RAM alone: the CPU, motherboard and memory are bought together, and the platform also sets your next upgrade.

- AM5: AMD says all AM5 motherboards are compatible with all AM5 processors, and describes itself as committed to multi-year socket support. A DDR5 build on AM5 can take a later AM5 Ryzen chip, though AMD notes a BIOS update may be required on some boards.
- AM4 and DDR4 LGA1700: a good fit when you already own the board or memory, or when the savings buy a better graphics card or monitor that you will notice in GPU-limited games.
- Intel Core Ultra (Series 2): needs a new LGA1851 board and DDR5. Intel says LGA1700 and LGA1851 are not cross-compatible.

Prices change often, so compare current prices for the full CPU, board and RAM bundle.

A 1440p build with an RTX 5070: two valid routes

Both routes are reasonable at 1440p with high or ultra settings, where the graphics card often sets the limit.

1. DDR4 route: a DDR4 platform such as a Ryzen 7 5800X3D on AM4 or a Core i5-14600K on a DDR4 board, with the savings put toward a better monitor. Trade-off: no CPU upgrade path on AM4 beyond its own chips.
2. DDR5 route: a Ryzen 5 9600X on AM5 with 32GB of DDR5, keeping the current monitor. Trade-off: less left for the monitor now, but a socket that takes later AM5 chips.

Capacity and dual channel

Use two matching modules. Kingston explains that a second identical module turns on dual channel mode, which effectively doubles memory bandwidth, and in its DDR5 test a single module trailed the dual channel kit in a CPU-focused game. Kingston used 2x16GB (32GB) for that test and describes it as the sweet spot for DDR5.

- Buy a kit of two rather than one module now and one later. Kingston says modules with the same part number can use different components, which may cause instability.
- Four modules on a dual channel board are still dual channel. Kingston warns that four DDR5 modules can force lower memory speeds.

Related guides: Ryzen 7 9700X vs 9800X3D for the CPU side of an AM5 build, RTX 5070 vs RX 9070 XT vs RTX 5070 Ti for the graphics card, and OLED vs Mini-LED gaming monitors for where the savings could go.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "ddr5-vs-ddr4",
  title: "DDR5 vs DDR4 for Gaming: Is DDR5 Worth It?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "DDR5",
      shortDesc: "Fifth-generation DDR memory. Kingston reports it starts at 4800 MT/s and runs at 1.1V.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Starts at 4800 MT/s (Kingston, JEDEC standard)",
        "1.1V operating voltage (Kingston)",
        "Required on AM5 and Intel Core Ultra (Series 2)",
      ],
      cons: [
        "Needs a DDR5 motherboard and a DDR5-capable CPU",
        "Four modules can force lower speeds (Kingston)",
      ],
      bestFor: "New AM5 or Intel Core Ultra gaming builds with an upgrade path",
    },
    {
      id: B,
      slug: B,
      name: "DDR4",
      shortDesc: "Fourth-generation DDR memory. Kingston reports it tops out at 3200 MT/s at JEDEC standard speeds and runs at 1.2V.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Works with AM4 chips such as the Ryzen 7 5800X3D (AMD)",
        "Supported by the Core i5-14600K on DDR4 boards (Intel)",
        "Lets you reuse an existing board and memory",
      ],
      cons: [
        "Tops out at 3200 MT/s at JEDEC standard speeds (Kingston)",
        "Not supported on AM5 or Intel Core Ultra (Series 2)",
      ],
      bestFor: "Reusing or buying an AM4 or DDR4 LGA1700 platform",
    },
  ],
  keyDifferences: [
    {
      label: "Standard data rate",
      entityAValue: "Starts at 4800 MT/s",
      entityBValue: "Tops out at 3200 MT/s",
      winner: "a",
    },
    {
      label: "Voltage",
      entityAValue: "1.1V",
      entityBValue: "1.2V",
      winner: "a",
    },
    {
      label: "Platforms",
      entityAValue: "AM5, Intel Core Ultra (Series 2), DDR5 LGA1700 boards",
      entityBValue: "AM4, DDR4 LGA1700 boards",
    },
    {
      label: "Upgrade path",
      entityAValue: "AM5 boards take all AM5 chips (AMD)",
      entityBValue: "AM4 and LGA1700 boards take only chips for those sockets",
      winner: "a",
    },
  ],
  attributes: [
    textAttr("data-rate", "Standard data rate (JEDEC)", SPEC, A, B, "Starts at 4800 MT/s, standard speeds up to 8800 MT/s", "Tops out at 3200 MT/s", "a"),
    textAttr("voltage", "Voltage", SPEC, A, B, "1.1V", "1.2V", "a"),
    textAttr("pmic", "Power management", SPEC, A, B, "On-module PMIC", "No on-module PMIC (new with DDR5)"),
    textAttr("subchannels", "Module layout", SPEC, A, B, "64-bit module split into two independent 32-bit subchannels, 32 banks", "64-bit module without the subchannel split, 16 banks"),
    textAttr("ecc", "On-die ECC", SPEC, A, B, "Yes, corrects errors inside the DRAM chip only", "No (new with DDR5)"),
    textAttr("amd", "AMD platforms", SPEC, A, B, "AM5 (Ryzen 7000, 8000, 9000). Ryzen 5 9600X: up to DDR5-5600 with 2 modules", "AM4. Ryzen 7 5800X3D: up to DDR4-3200 with 2 modules"),
    textAttr("intel", "Intel platforms", SPEC, A, B, "Core Ultra 5 245K (LGA1851). Core i5-14600K: up to DDR5-5600 on DDR5 boards", "Core i5-14600K (LGA1700): up to DDR4-3200 on DDR4 boards"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "ryzen-7-9700x-vs-ryzen-7-9800x3d", title: "Ryzen 7 9700X vs Ryzen 7 9800X3D", category: "technology" },
    { slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti", title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti", category: "technology" },
    { slug: "oled-vs-mini-led-gaming-monitor", title: "OLED vs Mini-LED Gaming Monitor", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "DDR5 for new AM5 or Intel Core Ultra (Series 2) builds and an upgrade path. DDR4 when you reuse or buy an AM4 or DDR4 LGA1700 platform and move the savings to the graphics card or monitor.",
    keyFact:
      "Kingston reports that DDR5 starts at 4800 MT/s at 1.1V, while DDR4 tops out at 3200 MT/s at 1.2V at JEDEC standard speeds.",
  },
  citationStats: {
    sourceCount: 10,
    dataPointCount: 20,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Kingston DDR5 overview", url: KINGSTON_DDR5 },
      { name: "Kingston gaming memory support FAQ", url: KINGSTON_FAQ },
      { name: "Kingston DDR5 speed test", url: KINGSTON_TEST },
      { name: "AMD Ryzen 5 9600X", url: AMD_9600X },
      { name: "AMD Ryzen 7 5800X3D", url: AMD_5800X3D },
      { name: "AMD Socket AM5 chipsets", url: AMD_AM5 },
      { name: "AMD Ryzen desktop processors", url: AMD_RYZEN },
      { name: "Intel Core i5-14600K specifications", url: INTEL_14600K },
      { name: "Intel Core Ultra 5 245K specifications", url: INTEL_245K },
      { name: "Intel Core Ultra desktop processors (Series 2)", url: INTEL_ULTRA_S2 },
    ],
  },
  resources: [
    { type: "external", label: "Kingston DDR5 overview", url: KINGSTON_DDR5, description: "JEDEC data rates (DDR5 from 4800 MT/s, DDR4 up to 3200 MT/s), 1.1V vs 1.2V, PMIC, two 32-bit subchannels, module key, on-die ECC, banks and burst length." },
    { type: "external", label: "Kingston gaming memory support FAQ", url: KINGSTON_FAQ, description: "A second identical module enables dual channel mode; buy kits rather than adding a module later." },
    { type: "external", label: "Kingston DDR5 speed test", url: KINGSTON_TEST, description: "Core i7-13700K, RTX 3070, 1080p high, 2x16GB DDR5 kits. CPU-intensive games responded more to memory speed; single module trailed dual channel." },
    { type: "external", label: "AMD Ryzen 5 9600X", url: AMD_9600X, description: "AM5, DDR5 only, two memory channels, up to DDR5-5600 with two single-rank modules." },
    { type: "external", label: "AMD Ryzen 7 5800X3D", url: AMD_5800X3D, description: "AM4, DDR4 only, up to DDR4-3200 with two modules, 96 MB L3 cache." },
    { type: "external", label: "AMD Socket AM5 chipsets", url: AMD_AM5, description: "All AM5 motherboards are compatible with all AM5 processors; DDR5 memory." },
    { type: "external", label: "AMD Ryzen desktop processors", url: AMD_RYZEN, description: "AM5 with DDR5; AMD's multi-year socket support statement." },
    { type: "external", label: "Intel Core i5-14600K specifications", url: INTEL_14600K, description: "FCLGA1700; up to DDR5 5600 MT/s or up to DDR4 3200 MT/s; two memory channels." },
    { type: "external", label: "Intel Core Ultra 5 245K specifications", url: INTEL_245K, description: "FCLGA1851; DDR5 memory only." },
    { type: "external", label: "Intel Core Ultra desktop processors (Series 2)", url: INTEL_ULTRA_S2, description: "LGA1851 with Intel 800 Series chipsets; not cross-compatible with older platforms." },
  ],
  metaTitle: "DDR5 vs DDR4 for Gaming | A Versus B",
});

BUILT.metadata.metaDescription =
  "DDR5 vs DDR4 for gaming: which CPUs and boards take each, what changes in speed and voltage, when memory matters, and why two sticks beat one.";

export const DDR5_VS_DDR4: EditorialComparison = BUILT;
