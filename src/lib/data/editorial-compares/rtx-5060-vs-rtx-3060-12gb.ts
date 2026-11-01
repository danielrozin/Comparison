import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-356 — RTX 5060 vs RTX 3060 12GB, including an older PCIe 3.0 board.
 * Read on 1 November 2026 (Asia/Jerusalem) from NVIDIA's GeForce compare
 * table, the RTX 5060 family spec table, and the RTX 3060 / 3060 Ti spec
 * table. Performance wording is only from TechSpot (22 May 2025) and
 * HardwareZone (31 May 2025), with each review's test PC named.
 * MSI's B450M-A PRO MAX specification and Blender's requirements were
 * opened the same day.
 * Dropped: the r/buildapc thread (HTTP 403, so there is no community
 * opinion block), the asker's price, the RTX 3060 family "starting at"
 * line (it covers more than the 12 GB card), TechSpot's street price and
 * cost-per-frame dollars, every percentage that is not the two review
 * summaries below, the RTX 5060 Ti PCIe article (a different card),
 * NVIDIA's relative-performance bar heights (Multi Frame Generation is
 * on for the 50 Series only), a 3060 memory-bandwidth figure (NVIDIA's
 * 30-series rows do not print one), a 3060 lane count, and any claim
 * that this MSI board supports Ryzen 5000. No winner.
 */

const A = "rtx-5060";
const B = "rtx-3060-12gb";

const NV_COMPARE = "https://www.nvidia.com/en-us/geforce/graphics-cards/compare/";
const NV_5060 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5060-family/";
const NV_3060 = "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3060-3060ti/";
const TECHSPOT = "https://www.techspot.com/review/2992-nvidia-geforce-rtx-5060/";
const HWZ =
  "https://www.hardwarezone.com.sg/pc/components/nvidia-geforce-rtx-5060-8gb-review-it-had-rough-start-its-not-bad-gpu";
const MSI = "https://www.msi.com/Motherboard/B450M-A-PRO-MAX/Specification";
const BLENDER = "https://www.blender.org/download/requirements/";

const SOURCE_DATE = "2026-11-01";
const PUBLISHED = "2026-11-01T00:00:00Z";

const SHORT_ANSWER =
  "At the same price, the GeForce RTX 5060 is the better fit for most 1080p gaming: NVIDIA lists it as a Blackwell card with 3840 CUDA cores, 8 GB of GDDR7, 145 W total graphics power and DLSS 4 Multi Frame Generation, against 3584 CUDA cores, 12 GB of GDDR6 and 170 W graphics card power on the Ampere RTX 3060. The RTX 3060 12GB is the pick when the work needs more than 8 GB of graphics memory. On a PCIe 3.0 motherboard the RTX 5060 can lose performance, because TechSpot and HardwareZone both describe its bus as PCIe 5.0 x8. Neither card is right for everyone.";

const FAQS = [
  {
    question: "Is the RTX 5060 better than the RTX 3060 12GB?",
    answer:
      "For most 1080p gaming, yes, if the prices match. NVIDIA lists the RTX 5060 as the newer Blackwell card, with 145 W total graphics power against 170 W graphics card power on the RTX 3060, and with DLSS 4 Multi Frame Generation. TechSpot's 18-game 1080p average, on a Ryzen 7 9800X3D with DDR5-6000, put the RTX 5060 level with the RTX 4060 Ti and RTX 3070 and 22% ahead of the RTX 4060. That review does not give a matching percentage against the RTX 3060 12GB. The 12 GB card is the one to keep when a game or a 3D scene needs more than 8 GB.",
  },
  {
    question: "Is 8 GB of VRAM enough in 2026?",
    answer:
      "For 1080p it is usually workable if texture settings come down in the most demanding games. TechSpot's May 2025 RTX 5060 review found the 8 GB buffer running out at 1440p in some games, including a 6 fps average in Stalker 2, on a Ryzen 7 9800X3D with DDR5-6000. NVIDIA lists 12 GB of GDDR6 on the RTX 3060 12GB configuration, and 8 GB of GDDR7 on the RTX 5060. Blender's recommended GPU memory is 8 GB, so a scene that does not fit still has more room on 12 GB.",
  },
  {
    question: "Does the RTX 5060 lose performance on a PCIe 3.0 motherboard?",
    answer:
      "It can. TechSpot and HardwareZone both describe the RTX 5060 bus as PCIe 5.0 x8, so a PCIe 3.0 slot runs that link as PCIe 3.0 x8. TechSpot calls this a major issue on older hardware. HardwareZone says bandwidth bottlenecks become far more noticeable on PCIe 3.0. Neither review gives a frame-rate percentage for an RTX 5060 on PCIe 3.0. NVIDIA lists the interface as PCI Express Gen 5 and does not list a lane count.",
  },
  {
    question: "Can my power supply run an RTX 5060 or RTX 3060?",
    answer:
      "NVIDIA lists 550 W required system power for both cards. The RTX 5060 figure is based on a PC with a Ryzen 9 9950X, and the RTX 3060 figure on a PC with a Core i9-10900K. NVIDIA says the real need depends on the rest of the system. A 650 W power supply is above the 550 W figure listed for either card.",
  },
  {
    question: "Which is better for Blender, RTX 5060 or RTX 3060 12GB?",
    answer:
      "Blender lists NVIDIA GeForce 900 and newer, including RTX cards, for Windows and Linux, so both cards are in that group. Blender's recommended GPU memory is 8 GB. The RTX 5060 is the newer GPU. The RTX 3060 12GB is the one that helps when a scene does not fit in 8 GB. Blender sends Cycles GPU rendering to its manual for the exact device rules.",
  },
];

const VERDICT = `Best for most 1080p gaming when the prices match: RTX 5060. NVIDIA lists 3840 CUDA cores, 8 GB of GDDR7 at 448 GB/sec, 145 W total graphics power and DLSS 4 Multi Frame Generation.

Best when the job needs more than 8 GB: RTX 3060 12GB. NVIDIA lists 3584 CUDA cores, 12 GB of GDDR6 on a 192-bit interface and 170 W graphics card power.

On a PCIe 3.0 board, read the bus caveat before you buy the RTX 5060. Neither card is right for everyone. Store prices move, so compare current listings.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- The RTX 5060 is the newer card: Blackwell, 3840 CUDA cores, 8 GB of GDDR7, 448 GB/sec, PCI Express Gen 5 and 145 W total graphics power, per NVIDIA.
- The RTX 3060 12GB's advantage is memory: NVIDIA lists 12 GB of GDDR6 and a 192-bit interface on that configuration, with 3584 CUDA cores, Ampere and 170 W graphics card power.
- NVIDIA lists DLSS 4 with Multi Frame Generation on the RTX 5060. The GeForce series compare leaves DLSS Frame Generation unmarked for RTX 30 Series.
- TechSpot's 18-game 1080p average was 22% ahead of the RTX 4060, level with the RTX 4060 Ti and RTX 3070, on a Ryzen 7 9800X3D. HardwareZone saw uplifts of roughly 20% over the RTX 4060 at 1080p on a factory-overclocked card. Neither summary is a head-to-head percentage against the RTX 3060 12GB.
- TechSpot and HardwareZone both describe the RTX 5060 bus as PCIe 5.0 x8 and warn that PCIe 3.0 boards feel that limit. NVIDIA does not list a lane count.
- NVIDIA lists 550 W required system power for both cards. Blender lists GeForce 900 and newer, including RTX cards, and recommends 8 GB of GPU memory.

Specs side by side

These figures are NVIDIA's. The RTX 3060 rows also include an 8 GB GDDR6 configuration on a 128-bit interface. The card covered here is the 12 GB configuration. Partner cards can ship with different clocks and power limits.

- CUDA cores: 3840 on the RTX 5060, 3584 on the RTX 3060.
- Architecture: Blackwell vs Ampere. Ray tracing cores are 4th generation vs 2nd generation. Tensor cores are 5th generation vs 3rd generation.
- Clocks: 2.50 GHz boost and 2.28 GHz base on the RTX 5060. 1.78 GHz boost and 1.32 GHz base on the RTX 3060.
- Memory: 8 GB GDDR7 on a 128-bit bus, 448 GB/sec, on the RTX 5060. 12 GB GDDR6 on a 192-bit bus on the RTX 3060 12GB listing. NVIDIA's 30-series compare rows do not include a bandwidth figure for the RTX 3060, so none is stated here.
- Power: 145 W total graphics power on the RTX 5060, and 170 W graphics card power on the RTX 3060. The row names differ. Both are NVIDIA's own ratings.
- Required system power: 550 W for both. The RTX 5060 note uses a Ryzen 9 9950X PC. The RTX 3060 note uses a Core i9-10900K PC. NVIDIA says the real need can change with the rest of the system.
- Bus: PCI Express Gen 5 on the RTX 5060, PCI Express Gen 4 on the RTX 3060. NVIDIA does not list how many lanes either card uses.
- Power connector: one PCIe 8-pin, or a 300 W or greater PCIe Gen 5 cable, on the RTX 5060. One PCIe 8-pin on the RTX 3060.
- Encoder: one 9th-generation NVENC on the RTX 5060, and a 7th-generation NVENC on the RTX 3060. CUDA capability is 12.0 vs 8.6.

1080p gaming

Use a named review, and read which PC it used. A result on a Ryzen 7 9800X3D or a Ryzen 9 9950X is not the result an older AM4 processor will deliver.

TechSpot's 22 May 2025 RTX 5060 review tested 18 games on a Ryzen 7 9800X3D with G.Skill Trident Z5 DDR5-6000 CL30 memory. At 1080p the RTX 5060 matched the RTX 4060 Ti and the RTX 3070, and it was 22% ahead of the RTX 4060. The same review does not publish a 1080p percentage against the RTX 3060 12GB.

HardwareZone's 31 May 2025 review tested an ASUS TUF Gaming GeForce RTX 5060, which it notes is factory overclocked, on a Ryzen 9 9950X, an X870E board, 32 GB of DDR5 and Windows 11. At 1080p it reports performance uplifts of roughly 20% over the RTX 4060, depending on the game. That is not a percentage against the RTX 3060 12GB either.

NVIDIA's RTX 5060 family chart draws relative performance against the RTX 3060 12GB at 1080p with max settings. The caption turns on Multi Frame Generation in 4X mode for 50 Series, and it leaves the 30 Series on DLSS Super Resolution and Ray Reconstruction. That chart is NVIDIA marketing. It is not a like-for-like result, and the bar heights are not repeated here.

VRAM: when 8 GB is a problem

8 GB is enough for a lot of 1080p play if you drop textures when a game asks for more. It is a problem when the game, or a 3D scene, does not fit.

TechSpot reported the 8 GB buffer running out at 1440p in several of its games. In Stalker 2 the 1440p average fell to 6 fps. In The Last of Us Part I, ultra settings at 1440p did not hold consistent frame times. Both results are from that Ryzen 7 9800X3D PC. The RTX 3060 12GB has the larger memory pool NVIDIA lists. It can still run out in a heavy enough scene. Graphics memory is not upgradeable later.

PCIe 3.0 boards, including a B450

Most published GPU tests use a new PCIe 5.0 or PCIe 4.0 platform. Someone on an older AM4 board is in a different spot.

TechSpot gives the RTX 5060 bus as PCIe 5.0 x8, and the review calls that interface a major issue on older hardware, especially PCIe 3.0. HardwareZone says NVIDIA paired the card with a PCIe 5.0 x8 interface, and that bandwidth bottlenecks become far more noticeable on PCIe 3.0. A PCIe 3.0 slot negotiates PCIe 3.0 on the lanes the card has, so an 8-lane card in a x16 slot still runs as PCIe 3.0 x8. Neither of those two reviews gives a frame-rate percentage for the RTX 5060 itself on PCIe 3.0.

MSI's B450M-A PRO MAX specification lists one PCIe 3.0 x16 slot. For 1st, 2nd and 3rd Gen AMD Ryzen processors, MSI lists x16 speed on that slot. That is the slot width. It does not add lanes the graphics card does not have. The same board is Socket AM4, with two DDR4 slots, up to 64 GB. MSI's processor section lists 1st, 2nd and 3rd Gen Ryzen. It does not name a Ryzen 5000 series CPU. Before you buy one for this board, open MSI's supported-processor list for the B450M-A PRO MAX and install a BIOS that lists that chip.

The processor on an older AM4 board can cap frame rate before either graphics card does. Those 1080p figures were measured on a Ryzen 7 9800X3D and a Ryzen 9 9950X.

DLSS 4 and Multi Frame Generation

NVIDIA's RTX 5060 family specifications include DLSS 4 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation and Multi Frame Generation. The GeForce series compare includes DLSS 5 and DLSS Dynamic Multi Frame Generation for RTX 50 Series. The same compare leaves DLSS Frame Generation unmarked for RTX 30 Series, where the DLSS row is DLSS 2. The RTX 3060 specifications include NVIDIA DLSS as supported. That is not Multi Frame Generation.

NVIDIA describes Dynamic Multi Frame Generation as a way to maximize smoothness by generating up to five frames for each rendered frame. Those generated frames are not extra frames the game simulated, so they are not a measure of base responsiveness. NVIDIA lists Reflex on both cards for latency. The family chart's 4X mode is the marketing comparison in the gaming section.

Blender and digital drawing

Blender's Windows and Linux requirements name NVIDIA GeForce 900 and newer, including RTX cards, with NVIDIA drivers. Both of these cards are in that group. Blender's minimum GPU memory is 2 GB, and the recommended figure is 8 GB. The RTX 5060 meets the recommended figure. The RTX 3060 12GB sits above it, which is the headroom that matters when a scene does not fit in 8 GB. Blender points Cycles GPU rendering at its manual for the exact device rules.

Blender also supports pen tablets for sculpting, painting and Grease Pencil. Nothing on the NVIDIA spec tables separates these two cards for 2D drawing. Memory size is the creative difference NVIDIA actually lists.

Upgrading an old AM4 box

- Plenty of VRAM headroom, for maximum textures or a large Blender scene: RTX 3060 12GB.
- Newer 1080p card, lower listed power, and Multi Frame Generation, on a newer PCIe board: RTX 5060, when the prices match.
- PCIe 3.0 plus an older Ryzen: the CPU may limit frame rate first, and the RTX 5060's 8-lane bus can add a bandwidth limit in some games. A newer Ryzen on the same AM4 socket is worth pricing only after MSI's support list confirms it.

Related choices

RTX 5060 vs RX 9060 XT compares the RTX 5060 with a 16 GB Radeon at a similar tier. RX 9060 XT vs RX 9070 and RX 9070 vs RX 9070 XT cover the next Radeon steps. DDR5 vs DDR4 covers the memory an AM4 board keeps and an AM5 board does not.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "rtx-5060-vs-rtx-3060-12gb",
  title: "RTX 5060 vs RTX 3060 12GB: Which GPU for 1080p Gaming?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "NVIDIA GeForce RTX 5060",
      shortDesc:
        "Blackwell graphics card with 3840 CUDA cores, 8 GB of GDDR7 and 145 W total graphics power, per NVIDIA.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "3840 CUDA cores and Blackwell (NVIDIA)",
        "8 GB GDDR7 at 448 GB/sec (NVIDIA)",
        "145 W total graphics power (NVIDIA)",
        "DLSS 4 with Multi Frame Generation (NVIDIA)",
      ],
      cons: [
        "8 GB of memory against 12 GB on the RTX 3060 (NVIDIA)",
        "TechSpot and HardwareZone describe the bus as PCIe 5.0 x8",
      ],
      bestFor: "1080p gaming on a newer PCIe board when the prices match",
    },
    {
      id: B,
      slug: B,
      name: "NVIDIA GeForce RTX 3060 12GB",
      shortDesc:
        "Ampere graphics card with 3584 CUDA cores, 12 GB of GDDR6 and 170 W graphics card power, per NVIDIA.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "12 GB of GDDR6 (NVIDIA)",
        "192-bit interface on the 12 GB listing (NVIDIA)",
        "550 W required system power, same listed figure as the RTX 5060 (NVIDIA)",
      ],
      cons: [
        "170 W graphics card power (NVIDIA)",
        "No Multi Frame Generation on the RTX 30 Series row (NVIDIA)",
        "Ampere, an older architecture (NVIDIA)",
      ],
      bestFor: "Games and 3D scenes that need more than 8 GB of graphics memory",
    },
  ],
  keyDifferences: [
    { label: "Memory", entityAValue: "8 GB GDDR7", entityBValue: "12 GB GDDR6", winner: "b" },
    { label: "CUDA cores", entityAValue: "3840", entityBValue: "3584", winner: "a" },
    {
      label: "Board power",
      entityAValue: "145 W total graphics power",
      entityBValue: "170 W graphics card power",
      winner: "a",
    },
    { label: "Required system power", entityAValue: "550 W", entityBValue: "550 W", winner: "tie" },
    {
      label: "Multi Frame Generation",
      entityAValue: "DLSS 4 Multi Frame Generation",
      entityBValue: "Not on the RTX 30 Series row",
      winner: "a",
    },
  ],
  attributes: [
    textAttr("cuda", "CUDA cores", SPEC, A, B, "3840", "3584", "a"),
    textAttr("arch", "Architecture", SPEC, A, B, "Blackwell", "Ampere", "a"),
    textAttr("boost", "Boost clock", SPEC, A, B, "2.50 GHz", "1.78 GHz"),
    textAttr("base", "Base clock", SPEC, A, B, "2.28 GHz", "1.32 GHz"),
    textAttr("memory", "Memory", SPEC, A, B, "8 GB GDDR7", "12 GB GDDR6", "b"),
    textAttr("bus-width", "Memory interface", SPEC, A, B, "128-bit", "192-bit on the 12 GB listing", "b"),
    textAttr("bandwidth", "Memory bandwidth", SPEC, A, B, "448 GB/sec", "Not in NVIDIA's 30-series rows"),
    textAttr("power", "NVIDIA board power", SPEC, A, B, "145 W total graphics power", "170 W graphics card power", "a"),
    textAttr("psu", "Required system power", SPEC, A, B, "550 W", "550 W"),
    textAttr("pcie", "PCI Express", SPEC, A, B, "Gen 5", "Gen 4"),
    textAttr(
      "dlss",
      "DLSS",
      SPEC,
      A,
      B,
      "DLSS 4 with Multi Frame Generation",
      "Supported; no Multi Frame Generation on the RTX 30 Series row",
      "a",
    ),
    textAttr("nvenc", "NVENC", SPEC, A, B, "1x 9th generation", "7th generation", "a"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rtx-5060-vs-rx-9060-xt", title: "RTX 5060 vs RX 9060 XT", category: "technology" },
    { slug: "rx-9060-xt-vs-rx-9070", title: "RX 9060 XT vs RX 9070", category: "technology" },
    { slug: "rx-9070-vs-rx-9070-xt", title: "RX 9070 vs RX 9070 XT", category: "technology" },
    { slug: "ddr5-vs-ddr4", title: "DDR5 vs DDR4", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "RTX 5060 for newer architecture, lower listed power and Multi Frame Generation at 1080p. RTX 3060 12GB when you need more than 8 GB of graphics memory.",
    keyFact:
      "NVIDIA lists 3840 CUDA cores, 8 GB of GDDR7 and 145 W for the RTX 5060, and 3584 CUDA cores, 12 GB of GDDR6 and 170 W for the RTX 3060.",
  },
  citationStats: {
    sourceCount: 7,
    // 12 spec rows x 2 cells. Bandwidth on the 3060 is explicitly absent.
    dataPointCount: 24,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NVIDIA GeForce graphics card compare", url: NV_COMPARE },
      { name: "NVIDIA GeForce RTX 5060 family specifications", url: NV_5060 },
      { name: "NVIDIA GeForce RTX 3060 and 3060 Ti specifications", url: NV_3060 },
      { name: "TechSpot GeForce RTX 5060 review (May 22, 2025)", url: TECHSPOT },
      { name: "HardwareZone GeForce RTX 5060 8GB review (May 31, 2025)", url: HWZ },
      { name: "MSI B450M-A PRO MAX specification", url: MSI },
      { name: "Blender requirements", url: BLENDER },
    ],
  },
  resources: [
    {
      type: "external",
      label: "NVIDIA GeForce graphics card compare",
      url: NV_COMPARE,
      description:
        "RTX 5060: 3840 CUDA cores, 8 GB GDDR7, 128-bit, 448 GB/sec, boost 2.50 GHz, base 2.28 GHz, PCI Express Gen 5, 145 W total graphics power, 550 W required system power on a Ryzen 9 9950X note. RTX 3060: 3584 CUDA cores, 12 GB GDDR6 / 8 GB GDDR6, 192-bit / 128-bit, boost 1.78 GHz, base 1.32 GHz, Ampere, PCI Express Gen 4, 170 W graphics card power, 550 W required system power on a Core i9-10900K note, 1x PCIe 8-pin. DLSS Dynamic Multi Frame Generation on RTX 50 Series; DLSS Frame Generation unmarked for RTX 30 Series.",
    },
    {
      type: "external",
      label: "See vendor page for current price: GeForce RTX 5060 (NVIDIA)",
      url: NV_5060,
      description:
        "Family spec table: DLSS 4 with Multi Frame Generation, 3840 CUDA cores, 8 GB GDDR7, 128-bit, 448 GB/sec, 145 W, 550 W, PCI Express Gen 5. Starting at $299, available May 19. That is NVIDIA's listed starting price, not a store price. The relative chart vs the RTX 3060 12GB uses Multi Frame Generation in 4X mode on 50 Series.",
    },
    {
      type: "external",
      label: "See vendor page for current price: GeForce RTX 3060 (NVIDIA)",
      url: NV_3060,
      description:
        "3584 CUDA cores, boost 1.78 GHz, base 1.32 GHz, 12 GB GDDR6 / 8 GB GDDR6, 192-bit / 128-bit, Ampere, PCI Express Gen 4, 170 W graphics card power, 550 W required system power, NVIDIA DLSS supported.",
    },
    {
      type: "external",
      label: "TechSpot GeForce RTX 5060 review (May 22, 2025)",
      url: TECHSPOT,
      description:
        "PCIe 5.0 x8 called a major issue on PCIe 3.0. 18 games at 1080p on a Ryzen 7 9800X3D with DDR5-6000: level with the RTX 4060 Ti and RTX 3070, 22% ahead of the RTX 4060. Stalker 2 at 1440p averaged 6 fps when the 8 GB buffer ran out. No RTX 5060 vs RTX 3060 12GB frame-rate percentage.",
    },
    {
      type: "external",
      label: "HardwareZone GeForce RTX 5060 8GB review (May 31, 2025)",
      url: HWZ,
      description:
        "PCIe 5.0 x8, with bandwidth bottlenecks far more noticeable on PCIe 3.0. Factory-overclocked ASUS TUF card on a Ryzen 9 9950X, X870E and 32 GB DDR5. Roughly 20% over the RTX 4060 at 1080p, depending on the game.",
    },
    {
      type: "external",
      label: "MSI B450M-A PRO MAX specification",
      url: MSI,
      description:
        "Socket AM4, B450, two DDR4 slots up to 64 GB, one PCIe 3.0 x16 slot. x16 speed for 1st, 2nd and 3rd Gen Ryzen. Processor section lists those generations and does not name Ryzen 5000.",
    },
    {
      type: "external",
      label: "Blender requirements",
      url: BLENDER,
      description:
        "Windows and Linux: NVIDIA GeForce 900 and newer, including RTX cards. Minimum 2 GB GPU memory. Recommended 8 GB. Pen tablets supported for sculpting, painting and Grease Pencil. Cycles GPU rules are in the manual.",
    },
  ],
  metaTitle: "RTX 5060 vs 3060 12GB GPU",
});

BUILT.metadata.metaDescription =
  "RTX 5060 vs RTX 3060 12GB for 1080p gaming: NVIDIA lists 8 GB GDDR7 and 145 W against 12 GB GDDR6 and 170 W, plus a PCIe 3.0 caveat.";

export const RTX_5060_VS_RTX_3060_12GB: EditorialComparison = BUILT;
