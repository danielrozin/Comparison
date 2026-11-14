import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-412 — RX 9070 (non-XT) vs RTX 5070 at 1440p.
 * Published slug is the ticket URL rx-9070-vs-rtx-5070.
 * Alphabetical order would be rtx-5070-vs-rx-9070, which stays unregistered.
 * Sources opened 11 November 2026 (Asia/Jerusalem).
 *
 * Specs: AMD RX 9070 product specifications; AMD newsroom, 28 February 2025
 * (RDNA 4, FSR 4 launch count, SEP, board partners); NVIDIA RTX 5070 family
 * specifications; NVIDIA Newsroom, 6 January 2025 (announcement price);
 * NVIDIA RTX Blackwell GPU architecture whitepaper v1.1, PDF created
 * 12 May 2025, Table 6 (672 GB/sec). The family specifications have no
 * bandwidth row, and the family shop module shows a price placeholder.
 *
 * Frame-rate margins stay with one outlet, one date, and one resolution.
 * TechSpot 21 October 2025 (23 games, 13%) and TechSpot 7 March 2025
 * (18 games, 4%) are both cited. GamersNexus's 0% to 18% range is 4K.
 * Tom's Hardware, 29 May 2025: Blender 68%, Procyon AI Vision 2.2x,
 * Spec WS4.0 70%. No street price. dataPointCount stays 0.
 * winnerName stays null. isHumanReviewed stays false.
 */

const A = "rx-9070";
const B = "rtx-5070";

const AMD_9070 =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html";
const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-2-28-amd-unveils-next-generation-amd-rdna-4-architectu.html";
const NV_FAMILY = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_NEWS =
  "https://nvidianews.nvidia.com/news/nvidia-blackwell-geforce-rtx-50-series-opens-new-world-of-ai-computer-graphics";
const NV_ARCH =
  "https://images.nvidia.com/aem-dam/Solutions/geforce/blackwell/nvidia-rtx-blackwell-gpu-architecture.pdf";
const TECHSPOT_OCT = "https://www.techspot.com/review/3044-nvidia-rtx-5070-vs-amd-radeon-9070-dlss-fsr/";
const TECHSPOT_MAR = "https://www.techspot.com/review/2962-amd-radeon-9070/";
const TOMS = "https://www.tomshardware.com/pc-components/gpus/nvidia-rtx-5070-vs-amd-rx-9070-face-off";
const GN =
  "https://gamersnexus.net/gpus/incredibly-efficient-amd-rx-9070-gpu-review-benchmarks-vs-9070-xt-rtx-5070";

const SOURCE_DATE = "2026-11-11";
const PUBLISHED = "2026-11-11T00:00:00Z";
const SPEC = "Specs";

const SHORT_ANSWER =
  "Choose the Radeon RX 9070 if you want the 16 GB of GDDR6 that AMD lists, and choose the GeForce RTX 5070 if you want the DLSS 4 features NVIDIA lists or the Blender and Procyon AI Vision results Tom's Hardware measured on 29 May 2025. Neither card is right for everyone: TechSpot measured the RX 9070 13% faster at native 1440p across 23 games on 21 October 2025, and 4% faster across a different 18-game sample on 7 March 2025.";

const VERDICT = `Choose the RX 9070 if you want 16 GB of GDDR6, 220 W typical board power, and the 1440p margins named below from TechSpot and Tom's Hardware.

Choose the RTX 5070 if you want NVIDIA's listed DLSS 4 features, Reflex 2, one ninth-generation NVENC encoder, or the Blender and Procyon AI Vision results Tom's Hardware measured on 29 May 2025.

Neither card is right for everyone. AMD's 28 February 2025 release lists an SEP of $549 USD for the RX 9070. NVIDIA's 6 January 2025 announcement lists $549 for the RTX 5070. Both figures are announcement prices. Check current price. The RX 9070 XT and the RTX 5070 Ti are different cards.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways. AMD lists 56 compute units, 3,584 stream processors, a 2070 MHz game frequency, a boost frequency up to 2520 MHz, 16 GB of GDDR6 on a 256-bit interface, bandwidth up to 640 GB/s, 64 MB of Infinity Cache, 220 W typical board power, and a 650 W minimum power supply. NVIDIA lists 6,144 CUDA cores, a 2.33 GHz base clock, a 2.51 GHz boost clock, 12 GB of GDDR7 on a 192-bit interface, 250 W total graphics power, and 650 W required system power. Table 6 of NVIDIA's architecture whitepaper, PDF created 12 May 2025, lists 672 GB/sec and 28 Gbps for the RTX 5070. Choose the RX 9070 if you want the 16 GB configuration. Choose the RTX 5070 if you want the listed DLSS 4 features or the creator results below. Neither card is right for everyone.

Memory capacity is the first check. AMD lists 16 GB of GDDR6, up to 20 Gbps, a 256-bit interface, and 64 MB of Infinity Cache. NVIDIA lists 12 GB of GDDR7 and a 192-bit interface. More memory does not by itself make a card faster. TechSpot wrote on 21 October 2025 that 12 GB is not often a problem at 1440p, especially with upscaling, that realistic edge cases run into limitations, and that 16 GB is more about future breathing room. TechSpot also wrote that a lot of modern titles already sit in the 10 to 11 GB range at 1440p with upscaling. TechSpot's 7 March 2025 review said the 12 GB buffer was exceeded in Indiana Jones and the Great Circle. A triple-1440p layout is outside the measurements in these reviews.

AMD's 28 February 2025 release calls the RX 9070 an RDNA 4 card. The product specifications opened 11 November 2026 list 56 compute units, 3,584 stream processors, 56 ray accelerators, and 112 AI accelerators. Game frequency is 2070 MHz and boost frequency is up to 2520 MHz. The 28 February 2025 specification table gives a game clock of 2.1 GHz and a boost clock up to 2.5 GHz. Footnote 6 says boost clock is the maximum frequency on a bursty workload and can vary with thermal conditions and the workload. That release says the cards were expected from board partners, including Acer, ASRock, ASUS, Gigabyte, PowerColor, Sapphire, Vastarmor, XFX, and Yeston, beginning 6 March 2025. NVIDIA lists Blackwell, 6,144 CUDA cores, 5th-generation Tensor cores at 988 AI TOPS, and 4th-generation RT cores at 94 TFLOPS. Those units are a different counting system from AMD's accelerator counts. NVIDIA lists the RTX 5070 reference card at 242 mm long, 112 mm wide, and two slots. NVIDIA says those clock specifications apply while gaming with medium to full GPU utilization, and that add-in-card specifications can vary.

TechSpot's 21 October 2025 review, by Tim Schiesser, tested 23 games at 1440p that support both DLSS 4 and FSR 4. The geomean measured the RX 9070 13% faster than the RTX 5070 at native resolution. The test PC was a Ryzen 7 9800X3D with 32 GB of DDR5-6000 CL30, GeForce driver 581.57, and Adrenalin 25.10.1. The cards were an MSI Vanguard SOC RTX 5070 and an Asrock Steel Legend OC RX 9070, both reset to stock clocks. TechSpot wrote that Stellar Blade was a title where the RTX 5070 was 6% faster at native rendering. TechSpot's 7 March 2025 review, by Steven Walton, measured the RX 9070 4% faster than the RTX 5070 at 1440p across 18 games in mostly raster-based gaming, on a Ryzen 7 9800X3D with GeForce Game Ready driver 572.60 and Adrenalin 24.12.1 / 24.30.31.03. At 4K in that same review, TechSpot measured the RX 9070 8% faster. Across six ray-traced games at 1440p, TechSpot measured the RX 9070 16% slower than the RTX 5070. The two 1440p averages use different dates, game samples, and drivers. TechSpot wrote that more recent testing showed RDNA 4 GPUs had gained performance since launch thanks to driver updates.

Tom's Hardware's face-off, published 29 May 2025, measured an 8.2% lead for the RX 9070 in a 15-game rasterization geomean at 1440p, and a 0.23% lead for the RX 9070 in the ray-tracing geomean at 1440p. At 4K, Tom's Hardware wrote that the RX 9070 was on average 11% quicker across all three geomeans, including ray tracing. In Blender, Tom's Hardware measured the RTX 5070 68% faster on average. In Procyon AI Vision, Tom's Hardware measured the RTX 5070 2.2x faster. In Spec WS4.0, Tom's Hardware measured the RX 9070 70% faster. Tom's Hardware wrote that in SPEC and MLPerf the RX 9070 was as fast as the RTX 5070 or faster, depending on the benchmark. Tom's Hardware wrote that this face-off included no path-tracing test, and that path tracing remained a weak point for AMD in other testing.

GamersNexus's 7 March 2025 review, adapted from a 6 March 2025 video, gives a 4K raster range: the RX 9070 leads the RTX 5070 by 0% to 18%, depending on the game, with one loss in Final Fantasy. At 1440p in Final Fantasy 14: Dawntrail, GamersNexus measured the RTX 5070 ahead by 21%, with the RX 9070 at 126 FPS average. At 4K in that game, the RTX 5070 Founders Edition ran at 78 FPS average, 24% ahead of the RX 9070 at 63 FPS average. At 1440p without ray tracing, GamersNexus measured the RX 9070 ahead in Starfield by 15%, at 96 FPS average against the RTX 5070's 83 FPS average, and ahead in Resident Evil 4 by 13%, at 172 FPS average against the RTX 5070's 152 FPS average. At 1440p with ray tracing, GamersNexus measured the RTX 5070 ahead in Black Myth: Wukong, at 73 FPS average against the RX 9070's 47 FPS average, a 55% lead, and ahead in Dying Light 2 by 4%, with the RX 9070 at 78 FPS average. GamersNexus wrote that the Dying Light 2 ray-tracing lead was 9% at 4K. GamersNexus measured a 224 W draw at the PCIe cables and the slot in the Final Fantasy XIV power test, including the 1440p run.

NVIDIA's specifications table labels DLSS 4 and names Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. The family marketing copy names DLSS 5 for 3D-Guided Neural Rendering on GeForce RTX 50 Series GPUs. Reflex 2 and a low-latency mode are listed, and Frame Warp is marked coming soon. AMD's current product specifications list FSR "Redstone", Fluid Motion Frames, and Radeon Anti-Lag. AMD's 28 February 2025 release names FSR 4 and says it will be supported in over 30 games at launch, with 75 coming later in 2025. In TechSpot's 21 October 2025 geomean, the RX 9070 was also 13% faster with Quality upscaling, 13% faster with Balanced upscaling, and 13% faster with Performance upscaling. One percent lows were roughly 11% faster across all modes. TechSpot wrote that neither DLSS 4 nor FSR 4 meaningfully shifts the standings overall.

Power and announcement price are separate from the frame-rate tests. AMD lists 220 W typical board power, a 650 W minimum power supply, and two 8-pin connectors. NVIDIA lists 250 W total graphics power and 650 W required system power. Footnote 5 says the 650 W figure is based on a PC configured with a Ryzen 9 9950X processor, recommends a PCIe CEM 5.1 compliant power supply, and says power requirements can differ with the system configuration. The RTX 5070 uses two PCIe 8-pin cables, with an adapter in the box, or one 300 W or greater PCIe Gen 5 cable. TechSpot's 7 March 2025 review wrote that RX 9070 power draw versus the RTX 5070 ran from a few extra watts to as much as 20% higher, and named Starfield as a case of 20% more power for a 6% performance gain. AMD's 28 February 2025 release lists an SEP of $549 USD for the RX 9070. NVIDIA's 6 January 2025 announcement says the GeForce RTX 5070 Ti, with 1,406 AI TOPS, and the GeForce RTX 5070, with 988 AI TOPS, would be available starting in February at $749 and $549, respectively. NVIDIA's family shop module, opened 11 November 2026, shows the placeholder Starting at $XXX.XX. Check current price.

A past driver experience is a separate question from these measurements. AMD's 28 February 2025 release and NVIDIA's family specifications give no driver-failure rate for either card. GamersNexus wrote that CUDA was, in their view, the RTX 5070's biggest strength, including for video editing. That sentence is GamersNexus's opinion. Tom's Hardware's Blender, Procyon AI Vision, and Spec WS4.0 figures are the creator measurements in that face-off.

The RX 9070 XT is a different AMD card, and the RTX 5070 Ti is a different NVIDIA card. RTX 5070 vs RX 9070 XT is the XT matchup. RX 9070 vs RX 9070 XT compares the two Radeon cards. RTX 5070 vs RX 9070 XT vs RTX 5070 Ti is the three-card matchup. RX 9060 XT vs RX 9070 is the step down inside AMD's lineup.`;

const FAQS = [
  {
    question: "Is the RX 9070 faster than the RTX 5070 at 1440p?",
    answer:
      "It depends on the test. TechSpot's 21 October 2025 geomean, 23 games at 1440p, measured the RX 9070 13% faster at native resolution, and 13% faster with Quality, Balanced, and Performance upscaling. TechSpot's 7 March 2025 review measured the RX 9070 4% faster at 1440p across a different 18-game sample in mostly raster-based gaming. TechSpot wrote that the later margin was larger and pointed to driver updates since launch. Individual games still go the other way: in the October test, TechSpot measured the RTX 5070 6% faster at native resolution in Stellar Blade.",
  },
  {
    question: "Is 12 GB on the RTX 5070 enough at 1440p?",
    answer:
      "AMD lists 16 GB of GDDR6. NVIDIA lists 12 GB of GDDR7. TechSpot wrote on 21 October 2025 that 12 GB is not often a problem at 1440p, especially with upscaling, that realistic edge cases run into limitations, and that 16 GB is more about future breathing room. TechSpot also wrote that a lot of modern titles already sit in the 10 to 11 GB range at 1440p with upscaling. TechSpot's 7 March 2025 review said the 12 GB buffer was exceeded in Indiana Jones and the Great Circle. A triple-1440p layout is outside these measurements. More memory does not by itself make a card faster.",
  },
  {
    question: "How do DLSS 4 and FSR 4 compare on these cards?",
    answer:
      "NVIDIA's specifications table labels DLSS 4 and names Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. The family marketing copy names DLSS 5 for 3D-Guided Neural Rendering on GeForce RTX 50 Series GPUs. AMD's current product specifications list FSR \"Redstone\". AMD's 28 February 2025 release names FSR 4 and says it will be supported in over 30 games at launch, with 75 coming later in 2025. In TechSpot's 21 October 2025 geomean, enabling each card's upscaler left the average gap at 13%, and TechSpot wrote that neither DLSS 4 nor FSR 4 meaningfully shifts the standings overall.",
  },
  {
    question: "What did Tom's Hardware measure in Blender and Procyon AI Vision?",
    answer:
      "In the 29 May 2025 face-off, Tom's Hardware measured the RTX 5070 68% faster than the RX 9070 in Blender on average, and 2.2x faster in Procyon AI Vision. The same section measured the RX 9070 70% faster in Spec WS4.0. Tom's Hardware wrote that in SPEC and MLPerf the RX 9070 was as fast as the RTX 5070 or faster, depending on the benchmark. Choose the RTX 5070 if you use the Blender or Procyon AI Vision workloads Tom's Hardware measured. Choose the RX 9070 if you use the Spec WS4.0 workload Tom's Hardware measured.",
  },
  {
    question: "What did GamersNexus measure, and at which resolution?",
    answer:
      "GamersNexus's 7 March 2025 review gives the 0% to 18% raster range at 4K, depending on the game, with one loss in Final Fantasy. At 1440p in Final Fantasy 14: Dawntrail, GamersNexus measured the RTX 5070 ahead by 21%, with the RX 9070 at 126 FPS average. At 1440p with ray tracing, GamersNexus measured the RTX 5070 ahead in Black Myth: Wukong by 55% (73 FPS average against the RX 9070's 47 FPS average) and ahead in Dying Light 2 by 4%, with the RX 9070 at 78 FPS average. At 1440p without ray tracing, GamersNexus measured the RX 9070 ahead in Starfield by 15% and in Resident Evil 4 by 13%.",
  },
  {
    question: "What power supply and announcement price apply?",
    answer:
      "AMD lists 220 W typical board power, a 650 W minimum power supply, and two 8-pin connectors for the RX 9070. NVIDIA lists 250 W total graphics power and 650 W required system power for the RTX 5070. Footnote 5 says that 650 W figure is based on a PC configured with a Ryzen 9 9950X processor and can differ with the rest of the PC. AMD's 28 February 2025 release lists an SEP of $549 USD for the RX 9070. NVIDIA's 6 January 2025 announcement lists $549 for the RTX 5070, in the pair $749 and $549. Both are announcement prices. Check current price.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "rx-9070-vs-rtx-5070",
  title: "RX 9070 vs RTX 5070 at 1440p",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "RX 9070",
      shortDesc: "RDNA 4 card with 16 GB of GDDR6, 56 compute units, and 220 W typical board power.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [],
      cons: [],
      bestFor: null,
    },
    {
      id: B,
      slug: B,
      name: "RTX 5070",
      shortDesc: "Blackwell card with 12 GB of GDDR7, 6,144 CUDA cores, and 250 W total graphics power.",
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
      label: "Memory",
      entityAValue: "16 GB GDDR6, 256-bit, up to 640 GB/s, 64 MB Infinity Cache",
      entityBValue: "12 GB GDDR7, 192-bit, 672 GB/sec (architecture whitepaper, Table 6)",
      winner: "tie",
    },
    {
      label: "Board power",
      entityAValue: "220 W typical board power",
      entityBValue: "250 W total graphics power",
      winner: "tie",
    },
    {
      label: "Power supply",
      entityAValue: "650 W minimum",
      entityBValue: "650 W required system power, Ryzen 9 9950X footnote",
      winner: "tie",
    },
    {
      label: "Upscaling features",
      entityAValue: "FSR \"Redstone\" on current specifications; FSR 4 in the 28 February 2025 release",
      entityBValue: "Specifications table: DLSS 4. Marketing copy: DLSS 5",
      winner: "tie",
    },
    {
      label: "1440p review margins",
      entityAValue: "TechSpot 21 October 2025: 13% geomean, 23 games. TechSpot 7 March 2025: 4%, 18 games. Tom's Hardware 29 May 2025: 8.2% raster geomean, 15 games",
      entityBValue: "Same tests. Stellar Blade native, October test: 6% the other way. Final Fantasy 14: Dawntrail at 1440p, GamersNexus: ahead by 21%",
      winner: "tie",
    },
    {
      label: "Creator workloads",
      entityAValue: "Spec WS4.0: 70% (Tom's Hardware, 29 May 2025)",
      entityBValue: "Blender: 68% on average. Procyon AI Vision: 2.2x (Tom's Hardware, 29 May 2025)",
      winner: "tie",
    },
    {
      label: "6 January 2025 and 28 February 2025 announcement price",
      entityAValue: "$549 USD SEP in AMD's 28 February 2025 release. Check current price",
      entityBValue: "$549 in NVIDIA's 6 January 2025 announcement. Check current price",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("arch", "Architecture", SPEC, A, B, "RDNA 4 (AMD, 28 February 2025)", "Blackwell (NVIDIA)"),
    textAttr(
      "shaders",
      "Shaders (not one-to-one)",
      SPEC,
      A,
      B,
      "3,584 stream processors, 56 compute units (AMD)",
      "6,144 CUDA cores (NVIDIA)",
    ),
    textAttr("memory", "Memory", SPEC, A, B, "16 GB GDDR6 (AMD)", "12 GB GDDR7 (NVIDIA)"),
    textAttr("bus", "Memory interface", SPEC, A, B, "256-bit (AMD)", "192-bit (NVIDIA)"),
    textAttr(
      "bandwidth",
      "Memory bandwidth",
      SPEC,
      A,
      B,
      "Up to 640 GB/s (AMD)",
      "672 GB/sec, 28 Gbps (architecture whitepaper, Table 6, 12 May 2025)",
    ),
    textAttr("memspeed", "Memory speed", SPEC, A, B, "Up to 20 Gbps (AMD)", "28 Gbps (architecture whitepaper, Table 6)"),
    textAttr("cache", "Cache", SPEC, A, B, "64 MB Infinity Cache (AMD)", "NVIDIA does not list Infinity Cache"),
    textAttr(
      "clocks",
      "Clocks",
      SPEC,
      A,
      B,
      "Game 2070 MHz. Boost up to 2520 MHz (AMD product specifications). 28 February 2025 table: game 2.1 GHz, boost up to 2.5 GHz",
      "Base 2.33 GHz. Boost 2.51 GHz (NVIDIA)",
    ),
    textAttr(
      "accelerators",
      "Ray and AI units (not one-to-one)",
      SPEC,
      A,
      B,
      "56 ray accelerators, 112 AI accelerators (AMD)",
      "4th-generation RT cores, 94 TFLOPS. 5th-generation Tensor cores, 988 AI TOPS (NVIDIA)",
    ),
    textAttr("power", "Board power", SPEC, A, B, "220 W typical board power (AMD)", "250 W total graphics power (NVIDIA)"),
    textAttr(
      "psu",
      "Power supply",
      SPEC,
      A,
      B,
      "650 W minimum (AMD)",
      "650 W required system power, based on a Ryzen 9 9950X PC (NVIDIA footnote 5)",
    ),
    textAttr(
      "connector",
      "Power connector",
      SPEC,
      A,
      B,
      "2x 8-pin (AMD)",
      "2x PCIe 8-pin cables (adapter in box) or one 300 W or greater PCIe Gen 5 cable (NVIDIA)",
    ),
    textAttr(
      "features",
      "Upscaling and latency features",
      SPEC,
      A,
      B,
      "FSR \"Redstone\", Fluid Motion Frames, Radeon Anti-Lag (AMD product specifications). 28 February 2025 release names FSR 4",
      "Specifications table: DLSS 4 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. Marketing copy: DLSS 5. Reflex 2, Frame Warp coming soon (NVIDIA)",
    ),
    textAttr(
      "encode",
      "Video encode",
      SPEC,
      A,
      B,
      "H.264, HEVC, and AV1 encode (AMD). No quality result",
      "1x ninth-generation NVENC. AV1 encode (NVIDIA). No quality result",
    ),
    textAttr(
      "display",
      "Bus and display",
      SPEC,
      A,
      B,
      "PCIe 5.0 x16. DisplayPort 2.1a, HDMI 2.1b (AMD)",
      "PCI Express Gen 5. 3x DisplayPort 2.1b, 1x HDMI 2.1b. Reference card 242 mm, 112 mm, two slots (NVIDIA)",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "rtx-5070-vs-rx-9070-xt",
      title: "RTX 5070 vs RX 9070 XT",
      category: "technology",
    },
    {
      slug: "rx-9070-vs-rx-9070-xt",
      title: "RX 9070 vs RX 9070 XT",
      category: "technology",
    },
    {
      slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti",
      category: "technology",
    },
    {
      slug: "rx-9060-xt-vs-rx-9070",
      title: "RX 9060 XT vs RX 9070",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "AMD lists 16 GB GDDR6 and 220 W on the RX 9070. NVIDIA lists 12 GB GDDR7 and 250 W on the RTX 5070. TechSpot's 21 October 2025 23-game 1440p geomean is 13%, and its 7 March 2025 18-game 1440p sample is 4%.",
  },
  citationStats: {
    sourceCount: 9,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Radeon RX 9070 specifications", url: AMD_9070 },
      { name: "AMD newsroom: RDNA 4 and Radeon RX 9000 Series (28 February 2025)", url: AMD_PR },
      { name: "NVIDIA GeForce RTX 5070 family specifications", url: NV_FAMILY },
      { name: "NVIDIA Newsroom: GeForce RTX 50 Series (6 January 2025)", url: NV_NEWS },
      { name: "NVIDIA RTX Blackwell GPU architecture whitepaper (PDF created 12 May 2025)", url: NV_ARCH },
      { name: "TechSpot: RTX 5070 vs RX 9070, DLSS 4 vs FSR 4 (21 October 2025)", url: TECHSPOT_OCT },
      { name: "TechSpot: AMD Radeon RX 9070 review (7 March 2025)", url: TECHSPOT_MAR },
      { name: "Tom's Hardware: RTX 5070 vs RX 9070 face-off (29 May 2025)", url: TOMS },
      { name: "GamersNexus: RX 9070 review (7 March 2025)", url: GN },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Radeon RX 9070 specifications",
      url: AMD_9070,
      description:
        "Opened 11 November 2026. 56 compute units, 3,584 stream processors, game frequency 2070 MHz, boost up to 2520 MHz, 16 GB GDDR6, 256-bit, up to 640 GB/s, up to 20 Gbps, 64 MB Infinity Cache, 220 W typical board power, 650 W minimum power supply, two 8-pin connectors, FSR \"Redstone\", DisplayPort 2.1a, HDMI 2.1b, PCIe 5.0 x16.",
    },
    {
      type: "external",
      label: "AMD newsroom: RDNA 4 and Radeon RX 9000 Series (28 February 2025)",
      url: AMD_PR,
      description:
        "Opened 11 November 2026. Names RDNA 4 and FSR 4, over 30 games at launch, with 75 coming later in 2025. Specification table: game clock 2.1 GHz, boost up to 2.5 GHz, 56 compute units, 16 GB, 256-bit, 64 MB, 220 W, SEP of $549 USD. Board partners from 6 March 2025. Footnote 6 on boost clock.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5070 family specifications",
      url: NV_FAMILY,
      description:
        "Opened 11 November 2026. RTX 5070: Blackwell, 6,144 CUDA cores, 12 GB GDDR7, 192-bit, boost 2.51 GHz, base 2.33 GHz, 988 AI TOPS, 94 TFLOPS, 250 W, 650 W, one ninth-generation NVENC, AV1 encode, 242 mm, 112 mm, two slots. Specifications table labels DLSS 4. Marketing copy names DLSS 5. Shop module shows the placeholder Starting at $XXX.XX.",
    },
    {
      type: "external",
      label: "NVIDIA Newsroom: GeForce RTX 50 Series (6 January 2025)",
      url: NV_NEWS,
      description:
        "Opened 11 November 2026. The announcement says the RTX 5070 Ti, with 1,406 AI TOPS, and the RTX 5070, with 988 AI TOPS, would be available starting in February at $749 and $549, respectively.",
    },
    {
      type: "external",
      label: "NVIDIA RTX Blackwell GPU architecture whitepaper (PDF created 12 May 2025)",
      url: NV_ARCH,
      description:
        "Opened 11 November 2026. Version 1.1. PDF creation date 12 May 2025. Table 6: RTX 5070, 6,144 CUDA cores, 12 GB GDDR7, 192-bit, 28 Gbps, 672 GB/sec.",
    },
    {
      type: "external",
      label: "TechSpot: RTX 5070 vs RX 9070, DLSS 4 vs FSR 4 (21 October 2025)",
      url: TECHSPOT_OCT,
      description:
        "Tim Schiesser, 21 October 2025, opened 11 November 2026. 23 games at 1440p. Geomean: RX 9070 13% faster native, and 13% with Quality, Balanced, and Performance upscaling. 1% lows roughly 11% faster. Ryzen 7 9800X3D, 32 GB DDR5-6000 CL30, driver 581.57 and Adrenalin 25.10.1. MSI Vanguard SOC and Asrock Steel Legend OC, reset to stock clocks. Stellar Blade native: RTX 5070 6% faster.",
    },
    {
      type: "external",
      label: "TechSpot: AMD Radeon RX 9070 review (7 March 2025)",
      url: TECHSPOT_MAR,
      description:
        "Steven Walton, 7 March 2025, opened 11 November 2026. 18 games at 1440p, mostly raster-based: RX 9070 4% faster. At 4K: 8% faster. Six ray-traced games at 1440p: RX 9070 16% slower. Ryzen 7 9800X3D, GeForce Game Ready 572.60, Adrenalin 24.12.1 / 24.30.31.03. 12 GB buffer exceeded in Indiana Jones and the Great Circle.",
    },
    {
      type: "external",
      label: "Tom's Hardware: RTX 5070 vs RX 9070 face-off (29 May 2025)",
      url: TOMS,
      description:
        "Aaron Klotz, 29 May 2025, opened 11 November 2026. 1440p: 8.2% raster geomean across 15 games, 0.23% ray-tracing geomean. 4K: 11% across three geomeans. Blender: RTX 5070 68% faster on average. Procyon AI Vision: 2.2x. Spec WS4.0: RX 9070 70% faster. No path-tracing test in this face-off.",
    },
    {
      type: "external",
      label: "GamersNexus: RX 9070 review (7 March 2025)",
      url: GN,
      description:
        "Steve Burke, 7 March 2025, adapted from a 6 March 2025 video, opened 11 November 2026. 4K raster: RX 9070 leads by 0% to 18%, one loss in Final Fantasy. 1440p Final Fantasy 14: Dawntrail: RTX 5070 ahead by 21%, RX 9070 at 126 FPS average. 1440p ray tracing: Black Myth: Wukong, RTX 5070 at 73 FPS average and RX 9070 at 47 FPS average, a 55% lead. Dying Light 2: a 4% lead, RX 9070 at 78 FPS average. 224 W draw in the Final Fantasy XIV power test.",
    },
  ],
  metaTitle: "RX 9070 vs RTX 5070 at 1440p",
});

BUILT.metadata.metaDescription =
  "AMD lists 16 GB GDDR6 and 220 W on the RX 9070. NVIDIA lists 12 GB GDDR7 and 250 W on the RTX 5070. Two TechSpot 1440p margins, 13% and 4%, stay separate.";

export const RX_9070_VS_RTX_5070: EditorialComparison = BUILT;
