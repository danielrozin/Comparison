import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-339 — Keep AM4 with a Ryzen 7 5800X3D or move to AM5?
 * Read on 29 October 2026 from AMD's Ryzen 7 5800X3D, Ryzen 5 7500X3D and
 * Ryzen 7 9800X3D product spec pages and AMD's 31 May 2026 Computex blog
 * (5800X3D 10th Anniversary Edition at US $349 SEP from June 25; Ryzen 7
 * 7700X3D at US $329 SEP from July 16; Socket AM5 support through 2029).
 * AMD's 5800X3D page lists A520 as well as X570/X470/B550/B450, so A520 is
 * included. Dropped: all fps / percentage / benchmark figures (AMD footnote
 * claims, the RX 9070 GRE "21% faster" line, the EXPO ULL "4%" line,
 * TechPowerUp charts), street prices, VR performance claims, any claim that
 * the 5800X3D has "restarted production", and the r/buildapc price remarks.
 * Community views are labelled as opinion. No winner.
 */

const PUBLISHED = "2026-10-29T00:00:00Z";
const SOURCE_DATE = "2026-10-29";

const AMD_5800X3D =
  "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5800x3d.html";
const AMD_7500X3D =
  "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7500x3d.html";
const AMD_9800X3D =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const AMD_COMPUTEX =
  "https://www.amd.com/en/blogs/2026/amd-computex-2026-10-years-of-am4-am5-support-through.html";
const AMD_BUY = "https://www.amd.com/en/where-to-buy/processors/ryzen.html";

const A = "ryzen-7-5800x3d";
const B = "am5-platform";

const PRICE_5800X3D = "US $349 suggested etail price (SEP) at launch for the 10th Anniversary Edition, per AMD, May 2026";
const PRICE_7700X3D = "US $329 suggested etail price (SEP) at launch for the Ryzen 7 7700X3D, per AMD, May 2026";

const SHORT_ANSWER =
  "If you already have a working AM4 motherboard and DDR4 memory and you mostly game, a drop-in X3D chip such as the Ryzen 7 5800X3D is the cheapest meaningful CPU upgrade, because you keep the board and RAM. Move to AM5 if you are buying a new motherboard and DDR5 anyway and want a longer upgrade path: AMD says it will support Socket AM5 through 2029. At 1440p or 4K with a mid-range graphics card, first check whether your games are limited by the CPU at all. Neither path is right for everyone.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- A drop-in AM4 X3D chip replaces only the CPU, so it is the lowest-cost upgrade for an existing AM4 system.
- AM5 means a new motherboard and DDR5 memory, in exchange for a socket AMD says it will support through 2029.
- The Ryzen 7 5800X3D, Ryzen 5 7500X3D and Ryzen 7 9800X3D all have 96 MB of L3 cache, per AMD.
- At 1440p or higher with a mid-range graphics card, the GPU is often the limit, so check GPU usage before buying a CPU.
- AMD lists two memory channels for these chips, so buy memory as a matched pair rather than a single stick.
- Before buying a 5800X3D, confirm that your motherboard maker lists a BIOS version that supports it.

Step 1: Are you CPU-limited?

Check this before you spend anything. Run your usual games with an on-screen performance overlay and watch GPU usage. If the GPU sits near full usage, a faster CPU will usually change little and a graphics card or monitor upgrade matters more. If GPU usage is well below full while frame rates are lower than you want, the CPU is the more likely limit.

Step 2: What do you already own?

1. Motherboard: AMD lists X570, X470, B550, B450 and A520 as supporting chipsets for the Ryzen 7 5800X3D. Your board also needs a BIOS version that supports the chip, so look it up on your motherboard maker's CPU support list.
2. Memory: the 5800X3D uses DDR4; AM5 chips use DDR5, so a move to AM5 means new memory.
3. Cooler: AMD recommends a liquid cooler for optimal performance on the 5800X3D, 7500X3D and 9800X3D, and includes no cooler in the box.

Step 3: Total cost of each path

Prices change and differ by country, so work it out with local prices:

1. Stay on AM4: cost of the new CPU, minus what you can sell your old CPU for.
2. Move to AM5: cost of the CPU plus an AM5 motherboard plus a DDR5 kit, minus what you can sell your old CPU, board and memory for.

For reference, AMD's launch prices: ${PRICE_5800X3D}; ${PRICE_7700X3D}.

Step 4: How long will you keep the platform?

AMD announced at Computex 2026 that it is extending Socket AM5 support through 2029. AM4 has had nearly a decade of AMD support, and a 5800X3D is one of the last upgrades for that socket. If you plan another CPU swap in a few years, AM5 keeps that option open; if you plan to run this system until a full rebuild, the AM4 path costs less now.

What you keep and what you replace

1. AM4 drop-in (5800X3D, 5700X3D or 5600X3D): keep the motherboard, DDR4 memory and usually the case and power supply; replace the CPU and possibly the cooler; update the BIOS first.
2. AM5 move (for example a 7500X3D, 7700X3D or 9800X3D): keep the graphics card, storage, case and usually the power supply; replace the CPU, motherboard and memory, and check that your cooler has an AM5 mount.

AM5 bundles and memory

Some AM5 bundles ship with a single 16 GB DDR5 stick. AMD lists two memory channels for the 7500X3D and 9800X3D, and one stick uses only one of them, so budget for a second matching stick or a 2 x 16 GB kit.

VR and high-refresh gaming

VR headsets and high-refresh monitors push frame rates higher, which can shift the load toward the CPU. AMD lists the 5800X3D as AMD Ryzen VR-Ready Premium. Use the same GPU-usage check in your VR titles before deciding.

Community opinion

In r/buildapc discussions in October 2026, a common view was "if you can afford AM5, go for it; otherwise get the 5800X3D", and several people said that at 1440p with a Radeon RX 9070-class card the gain from either CPU upgrade would be small. Some suggested the 5700X3D or 5600X3D as cheaper AM4 options. This is community opinion, not measured results.

Choose the Ryzen 7 5800X3D (stay on AM4) if

1. You already have a supported AM4 board and a good DDR4 kit.
2. You mostly game and your games are CPU-limited.
3. You want the lowest upfront cost.

Choose AM5 if

1. You need a new motherboard anyway or want DDR5 and PCIe 5.0.
2. You plan to swap the CPU again later.
3. You would rather spend more now for a platform AMD supports through 2029.`;

const FAQS = [
  {
    question: "Is the Ryzen 7 5800X3D still worth buying in 2026?",
    answer:
      "It can be, if you already own a compatible AM4 motherboard and DDR4 memory, because you only replace the CPU. Compare its current price with an entry AM5 CPU plus a motherboard and DDR5 kit before deciding.",
  },
  {
    question: "Should I upgrade my AM4 CPU or switch to AM5?",
    answer:
      "Stay on AM4 with an X3D chip if you want the lowest cost and mostly game. Switch to AM5 if you are buying a new motherboard and DDR5 anyway and want a longer upgrade path; AMD says it will support Socket AM5 through 2029.",
  },
  {
    question: "How long will AMD support Socket AM5?",
    answer: "At Computex 2026 AMD announced that it is extending support for the Socket AM5 platform through 2029.",
  },
  {
    question: "Is the 5800X3D compatible with B450 and X470 motherboards?",
    answer:
      "AMD lists X570, X470, B550, B450 and A520 as supporting chipsets for the Ryzen 7 5800X3D. Your board needs a BIOS version that supports the chip, so check the motherboard maker's CPU support list.",
  },
  {
    question: "Does a CPU upgrade help gaming at 1440p?",
    answer:
      "Only if the CPU is the limit. If your graphics card is already near full usage in your games, a CPU upgrade usually changes less than a graphics card upgrade.",
  },
  {
    question: "Is one 16 GB DDR5 stick OK for an AM5 build?",
    answer:
      "A single stick uses only one of the two memory channels AMD lists for its AM5 chips. For gaming, a matched pair such as 2 x 16 GB is the usual choice.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "ryzen-7-5800x3d-vs-am5",
  title: "Ryzen 7 5800X3D or AM5: Which Gaming CPU Upgrade Makes Sense?",
  shortAnswer: SHORT_ANSWER,
  verdict:
    "Ryzen 7 5800X3D: drop-in for supported AM4 boards, keeps your DDR4, lowest upfront cost.\n\nAM5: new motherboard and DDR5, PCIe 5.0, and a socket AMD supports through 2029.",
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Ryzen 7 5800X3D (stay on AM4)",
      shortDesc: "Zen 3, 8 cores / 16 threads, 96 MB L3 cache, AM4 socket, DDR4, 105W default TDP.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Keeps your AM4 motherboard and DDR4 memory",
        "96 MB L3 cache with AMD 3D V-Cache",
        "Supports X570, X470, B550, B450 and A520 chipsets",
      ],
      cons: ["Needs a supporting BIOS", "Last-generation socket", "PCIe 4.0 and DDR4 only"],
      bestFor: "Gamers with a supported AM4 board who want the cheapest meaningful upgrade",
    },
    {
      id: B,
      slug: B,
      name: "AM5 upgrade (e.g. Ryzen 5 7500X3D or Ryzen 7 9800X3D)",
      shortDesc: "Socket AM5 with DDR5 and PCIe 5.0; AMD supports the socket through 2029.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: ["Socket supported through 2029", "DDR5 and PCIe 5.0", "X3D options with 96 MB L3 cache"],
      cons: ["Needs a new motherboard and DDR5 memory", "Higher upfront cost"],
      bestFor: "Builders replacing the board anyway who want room for future CPU swaps",
    },
  ],
  keyDifferences: [
    { label: "What you replace", entityAValue: "CPU only", entityBValue: "CPU, motherboard and memory", winner: "a" },
    { label: "Memory", entityAValue: "DDR4", entityBValue: "DDR5", winner: "tie" },
    { label: "PCIe", entityAValue: "PCIe 4.0", entityBValue: "PCIe 5.0", winner: "b" },
    { label: "Socket support", entityAValue: "AM4, 10 years old per AMD", entityBValue: "AM5, through 2029", winner: "b" },
  ],
  attributes: [
    textAttr("a0", "Socket", "Platform", A, B, "AM4", "AM5"),
    textAttr("a1", "Cores / threads", "Performance", A, B, "8 / 16", "7500X3D: 6 / 12; 9800X3D: 8 / 16"),
    textAttr("a2", "L3 cache", "Performance", A, B, "96 MB", "7500X3D: 96 MB; 9800X3D: 96 MB"),
    textAttr("a3", "Max boost clock", "Performance", A, B, "Up to 4.5 GHz", "7500X3D: up to 4.5 GHz; 9800X3D: up to 5.2 GHz"),
    textAttr("a4", "Architecture", "Performance", A, B, "Zen 3", "7500X3D: Zen 4; 9800X3D: Zen 5"),
    textAttr("a5", "Memory", "Platform", A, B, "DDR4, 2 channels", "DDR5, 2 channels"),
    textAttr("a6", "PCI Express", "Platform", A, B, "PCIe 4.0", "PCIe 5.0"),
    textAttr("a7", "Default TDP", "Power", A, B, "105W", "7500X3D: 65W; 9800X3D: 120W"),
    textAttr("a8", "Supporting chipsets", "Platform", A, B, "X570, X470, B550, B450, A520", "A620, X670E, X670, B650E, B650, X870E, X870, B840, B850"),
    textAttr("a9", "AMD launch date", "Platform", A, B, "4/20/2022", "7500X3D: 11/12/2025; 9800X3D: 11/07/2024"),
    textAttr("a10", "Launch price (AMD SEP)", "Price", A, B, PRICE_5800X3D, PRICE_7700X3D),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "ryzen-7-9700x-vs-ryzen-7-9800x3d", title: "Ryzen 7 9700X vs Ryzen 7 9800X3D", category: "technology" },
    { slug: "ddr5-vs-ddr4", title: "DDR5 vs DDR4", category: "technology" },
    { slug: "rx-9060-xt-vs-rx-9070", title: "RX 9060 XT vs RX 9070", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Ryzen 7 5800X3D if you have a supported AM4 board and DDR4 and want the lowest cost. AM5 if you are replacing the board anyway and want a socket AMD supports through 2029.",
    keyFact: "AMD announced at Computex 2026 that it is extending Socket AM5 support through 2029.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 30,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD: Ryzen 7 5800X3D specifications", url: AMD_5800X3D },
      { name: "AMD: Ryzen 5 7500X3D specifications", url: AMD_7500X3D },
      { name: "AMD: Ryzen 7 9800X3D specifications", url: AMD_9800X3D },
      { name: "AMD: Computex 2026, AM5 support through 2029 (May 31, 2026)", url: AMD_COMPUTEX },
      { name: "AMD: where to buy Ryzen processors", url: AMD_BUY },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD: Ryzen 7 5800X3D specifications",
      url: AMD_5800X3D,
      description:
        "Zen 3, 8 cores / 16 threads, up to 4.5 GHz, 96 MB L3, 105W, AM4, X570/X470/B550/B450/A520, DDR4, PCIe 4.0, launched 4/20/2022.",
    },
    {
      type: "external",
      label: "AMD: Ryzen 5 7500X3D specifications",
      url: AMD_7500X3D,
      description: "Zen 4, 6 cores / 12 threads, up to 4.5 GHz, 96 MB L3, 65W, AM5, DDR5, PCIe 5.0, launched 11/12/2025.",
    },
    {
      type: "external",
      label: "AMD: Ryzen 7 9800X3D specifications",
      url: AMD_9800X3D,
      description: "Zen 5, 8 cores / 16 threads, up to 5.2 GHz, 96 MB L3, 120W, AM5, DDR5, PCIe 5.0, launched 11/07/2024.",
    },
    {
      type: "external",
      label: "AMD: Computex 2026, AM5 support through 2029 (May 31, 2026)",
      url: AMD_COMPUTEX,
      description:
        "5800X3D 10th Anniversary Edition from June 25 at US $349 SEP; Ryzen 7 7700X3D (8 cores, 104 MB total cache, up to 4.5 GHz) from July 16 at US $329 SEP; Socket AM5 support extended through 2029.",
    },
    {
      type: "external",
      label: "See vendor page for current price: AMD Ryzen processors (AMD)",
      url: AMD_BUY,
      description: "AMD's where-to-buy listing for Ryzen desktop processors.",
    },
  ],
  metaTitle: "5800X3D or AM5: Keep AM4 or Upgrade?",
});

BUILT.metadata.metaDescription =
  "Keep AM4 with a Ryzen 7 5800X3D or move to AM5? What each path replaces, AMD specs, AM5 support through 2029, and how to check if you are CPU-limited.";

export const RYZEN_7_5800X3D_VS_AM5: EditorialComparison = BUILT;
