import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-326 — RTX 5070 Ti Laptop GPU vs RTX 5080 Laptop GPU for a laptop kept
 * about five years. Read on 27 October 2026 from NVIDIA's GeForce RTX 50
 * Series laptops page (spec table incl. memory bandwidth) and NVIDIA's laptop
 * GPU compare table (GPU subsystem power, memory interface, NVENC/NVDEC,
 * DLSS features). NVIDIA's www.nvidia.com pages publish no launch price for
 * either laptop GPU, so no price is stated; readers get two NVIDIA shop links.
 * Dropped from the brief: the thread's chip / bus claims, any 2027 / CES
 * prediction, rising GPU / RAM price claims (asker context only), game VRAM
 * requirement numbers, fps and percentages, and the DLSS version number
 * (NVIDIA's pages disagree between tables; feature names are used instead).
 * No street prices, no winner.
 */

const A = "rtx-5070-ti-laptop";
const B = "rtx-5080-laptop";

const NV_50 = "https://www.nvidia.com/en-us/geforce/laptops/50-series/";
const NV_COMPARE = "https://www.nvidia.com/en-us/geforce/laptops/compare/";
const NV_SHOP = "https://www.nvidia.com/en-us/geforce/laptops/50-series/#shop";
const NV_LAPTOPS = "https://www.nvidia.com/en-us/geforce/laptops/";

const SOURCE_DATE = "2026-10-27";
const PUBLISHED = "2026-10-27T00:00:00Z";

const SHORT_ANSWER =
  "For a gaming laptop you plan to keep about five years, the GeForce RTX 5080 Laptop GPU is the stronger choice: NVIDIA lists 16 GB of GDDR7 on a 256-bit interface with 896 GB/s of bandwidth, against 12 GB on a 192-bit interface with 672 GB/s for the RTX 5070 Ti Laptop GPU, and laptop graphics memory cannot be upgraded later. The RTX 5070 Ti Laptop GPU makes more sense when the price gap between the two laptops is large, or when the RTX 5080 laptop you are looking at runs at a low power limit. Neither is right for everyone; the exact laptop matters as much as the GPU name.";

const FAQS = [
  {
    question: "How much VRAM do the RTX 5070 Ti and RTX 5080 laptop GPUs have?",
    answer:
      "NVIDIA lists 12 GB of GDDR7 on a 192-bit interface for the GeForce RTX 5070 Ti Laptop GPU, and 16 GB of GDDR7 on a 256-bit interface for the GeForce RTX 5080 Laptop GPU.",
  },
  {
    question: "Is the RTX 5080 laptop GPU better than the RTX 5070 Ti laptop GPU?",
    answer:
      "On paper, yes. NVIDIA lists 7,680 CUDA cores and 896 GB/s of memory bandwidth for the RTX 5080 Laptop GPU, against 5,888 CUDA cores and 672 GB/s for the RTX 5070 Ti Laptop GPU. Real results also depend on each laptop's power limit and cooling, so read independent reviews of the exact laptop model.",
  },
  {
    question: "Is 12 GB of VRAM enough for a gaming laptop you keep for five years?",
    answer:
      "It is enough for many games today, but laptop graphics memory cannot be upgraded. If you plan to play new AAA games at high settings for several years, the 16 GB on the RTX 5080 Laptop GPU leaves more room than 12 GB.",
  },
  {
    question: "What power do the RTX 5070 Ti and RTX 5080 laptop GPUs run at?",
    answer:
      "NVIDIA lists a GPU subsystem power range of 60 to 115 W for the RTX 5070 Ti Laptop GPU and 80 to 150 W for the RTX 5080 Laptop GPU. Each laptop maker picks a point in that range, so check the figure listed for the exact model.",
  },
  {
    question: "Should I buy an RTX 50 laptop now or wait for CES 2027?",
    answer:
      "Future launches and prices cannot be known in advance. Waiting may bring new models or lower prices, but it also means going without a laptop until then. If you need one now, compare current prices and specs and buy the model that fits your budget and games.",
  },
  {
    question: "Do both laptop GPUs support DLSS?",
    answer:
      "Yes. NVIDIA lists DLSS Super Resolution, DLAA, Ray Reconstruction, Frame Generation and Dynamic Multi Frame Generation for both the RTX 5070 Ti Laptop GPU and the RTX 5080 Laptop GPU.",
  },
];

const VERDICT = `Best for keeping a laptop about five years: RTX 5080 Laptop GPU. NVIDIA lists 16 GB of GDDR7, a 256-bit interface, 896 GB/s of bandwidth and 7,680 CUDA cores.

Best when the price gap is large: RTX 5070 Ti Laptop GPU. NVIDIA lists 12 GB of GDDR7, 672 GB/s of bandwidth and 5,888 CUDA cores, with the same DLSS features.

Check the power limit either way: NVIDIA lists 60 to 115 W for the RTX 5070 Ti Laptop GPU and 80 to 150 W for the RTX 5080 Laptop GPU, and each laptop maker sets its own figure. Prices depend on the laptop model, so compare current listings.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- NVIDIA lists 16 GB of GDDR7 for the RTX 5080 Laptop GPU and 12 GB of GDDR7 for the RTX 5070 Ti Laptop GPU.
- Laptop graphics memory cannot be upgraded, so memory size matters most for a laptop kept about five years.
- The RTX 5080 Laptop GPU also has more CUDA cores (7,680 vs 5,888) and more memory bandwidth (896 GB/s vs 672 GB/s), per NVIDIA.
- Each laptop maker sets the GPU's power limit within NVIDIA's range, so two laptops with the same GPU name can perform differently.
- Both GPUs support the same DLSS features, including Frame Generation and Dynamic Multi Frame Generation.
- Prices depend on the exact laptop, so compare current listings for the models you are considering.

Specs side by side

The RTX 5080 Laptop GPU is ahead on every listed spec; the question is whether the price gap is worth it.

- Memory: 12 GB GDDR7 vs 16 GB GDDR7.
- Memory interface: 192-bit vs 256-bit.
- Memory bandwidth: 672 GB/s vs 896 GB/s.
- CUDA cores: 5,888 vs 7,680.
- AI TOPS: 992 vs 1334.
- Boost clock: 1447 to 2220 MHz vs 1500 to 2287 MHz.
- GPU subsystem power: 60 to 115 W vs 80 to 150 W.
- Video encoders: 1x ninth-generation NVENC vs 2x ninth-generation NVENC.

Why memory size matters for a five-year laptop

Memory is the one spec you cannot change after you buy a laptop.

1. Game textures and high settings are stored in graphics memory.
2. When a game needs more memory than the GPU has, data spills into slower system memory, which can cause stutter.
3. Extra memory leaves more room for higher settings later in the laptop's life.
4. For a game's own needs, check the official system requirements published by the game's developer or store page.

Power limits and cooling

The same GPU name can perform differently in different laptops.

- NVIDIA lists a GPU subsystem power range for each laptop GPU: 60 to 115 W for the RTX 5070 Ti Laptop GPU and 80 to 150 W for the RTX 5080 Laptop GPU.
- Each laptop maker picks a point in that range and designs its own cooling.
- Look up the power figure the laptop maker lists for the exact model, and read independent reviews that test that model.

Buy now or wait?

No one can say what will launch next or what it will cost.

- Waiting can bring new models or lower prices on current ones.
- Waiting also means going without the laptop you need until then, and prices can move either way.
- If you need a laptop now, compare today's prices and specs and buy the model that fits your budget and games.

Who should pick which

- New AAA games at high settings, keeping the laptop about five years: RTX 5080 Laptop GPU.
- Higher resolutions or creative work that uses more graphics memory: RTX 5080 Laptop GPU.
- Mostly esports or sports games at 1080p or 1440p, or a tight budget: RTX 5070 Ti Laptop GPU.
- Either way, choose the laptop model with the higher listed power limit and good cooling reviews.

Related guides: RTX 4070 Laptop vs RTX 5060 Laptop for the lower laptop tier, RTX 5070 vs RX 9070 XT vs RTX 5070 Ti for desktop cards, and RX 9070 XT vs RTX 5080 if a desktop is an option.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "rtx-5070-ti-laptop-vs-rtx-5080-laptop",
  title: "RTX 5070 Ti Laptop vs RTX 5080 Laptop GPU: Is the 5080 Worth It for 5 Years?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "NVIDIA GeForce RTX 5070 Ti Laptop GPU",
      shortDesc: "NVIDIA Blackwell laptop GPU with 12 GB of GDDR7 on a 192-bit interface, per NVIDIA.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Same DLSS features as the RTX 5080 Laptop GPU (NVIDIA)",
        "60 to 115 W GPU subsystem power (NVIDIA)",
        "5,888 CUDA cores (NVIDIA)",
      ],
      cons: [
        "12 GB of memory (NVIDIA)",
        "672 GB/s memory bandwidth (NVIDIA)",
      ],
      bestFor: "Buyers on a tighter budget or playing lighter games",
    },
    {
      id: B,
      slug: B,
      name: "NVIDIA GeForce RTX 5080 Laptop GPU",
      shortDesc: "NVIDIA Blackwell laptop GPU with 16 GB of GDDR7 on a 256-bit interface, per NVIDIA.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "16 GB of GDDR7 memory (NVIDIA)",
        "896 GB/s memory bandwidth (NVIDIA)",
        "7,680 CUDA cores and 2x NVENC (NVIDIA)",
      ],
      cons: [
        "Wider 80 to 150 W power range, so results depend on the laptop (NVIDIA)",
      ],
      bestFor: "Buyers keeping a laptop about five years for new AAA games",
    },
  ],
  keyDifferences: [
    { label: "Memory", entityAValue: "12 GB GDDR7", entityBValue: "16 GB GDDR7", winner: "b" },
    { label: "Memory bandwidth", entityAValue: "672 GB/s", entityBValue: "896 GB/s", winner: "b" },
    { label: "CUDA cores", entityAValue: "5,888", entityBValue: "7,680", winner: "b" },
    { label: "GPU subsystem power", entityAValue: "60 to 115 W", entityBValue: "80 to 150 W" },
  ],
  attributes: [
    textAttr("memory", "Memory", SPEC, A, B, "12 GB GDDR7", "16 GB GDDR7", "b"),
    textAttr("bus", "Memory interface", SPEC, A, B, "192-bit", "256-bit", "b"),
    textAttr("bandwidth", "Memory bandwidth", SPEC, A, B, "672 GB/s", "896 GB/s", "b"),
    textAttr("cuda", "CUDA cores", SPEC, A, B, "5,888", "7,680", "b"),
    textAttr("tops", "AI TOPS", SPEC, A, B, "992", "1334", "b"),
    textAttr("boost", "Boost clock", SPEC, A, B, "1447 to 2220 MHz", "1500 to 2287 MHz"),
    textAttr("power", "GPU subsystem power", SPEC, A, B, "60 to 115 W", "80 to 150 W"),
    textAttr("encode", "Video encoders", SPEC, A, B, "1x ninth-generation NVENC", "2x ninth-generation NVENC", "b"),
    textAttr("dlss", "DLSS", SPEC, A, B, "Super Resolution, DLAA, Ray Reconstruction, Frame Generation, Dynamic Multi Frame Generation", "Super Resolution, DLAA, Ray Reconstruction, Frame Generation, Dynamic Multi Frame Generation"),
    textAttr("price", "Price", SPEC, A, B, "Depends on the laptop model", "Depends on the laptop model"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rtx-4070-laptop-vs-rtx-5060-laptop", title: "RTX 4070 Laptop vs RTX 5060 Laptop", category: "technology" },
    { slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti", title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti", category: "technology" },
    { slug: "rx-9070-xt-vs-rtx-5080", title: "RX 9070 XT vs RTX 5080", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "RTX 5080 Laptop GPU for 16 GB of memory over a long ownership. RTX 5070 Ti Laptop GPU when the price gap is large.",
    keyFact:
      "NVIDIA lists 16 GB of GDDR7 at 896 GB/s for the RTX 5080 Laptop GPU and 12 GB of GDDR7 at 672 GB/s for the RTX 5070 Ti Laptop GPU.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 20,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NVIDIA GeForce RTX 50 Series laptops", url: NV_50 },
      { name: "NVIDIA laptop GPU compare specs", url: NV_COMPARE },
      { name: "NVIDIA GeForce RTX 50 Series laptops: shop", url: NV_SHOP },
      { name: "NVIDIA GeForce laptops", url: NV_LAPTOPS },
    ],
  },
  resources: [
    { type: "external", label: "NVIDIA GeForce RTX 50 Series laptops", url: NV_50, description: "Spec table: AI TOPS, CUDA cores, boost clocks, memory and memory bandwidth for each RTX 50 Series laptop GPU." },
    { type: "external", label: "NVIDIA laptop GPU compare specs", url: NV_COMPARE, description: "GPU subsystem power, memory interface width, NVENC/NVDEC and DLSS features for RTX 50 Series laptop GPUs." },
    { type: "external", label: "See vendor page for current price: RTX 5080 Laptop GPU (NVIDIA)", url: NV_SHOP, description: "NVIDIA buying options for GeForce RTX 50 Series laptops." },
    { type: "external", label: "See vendor page for current price: RTX 5070 Ti Laptop GPU (NVIDIA)", url: NV_LAPTOPS, description: "NVIDIA GeForce laptops hub with buying options." },
  ],
  metaTitle: "RTX 5070 Ti Laptop vs RTX 5080 Laptop | A Versus B",
});

BUILT.metadata.metaDescription =
  "RTX 5070 Ti Laptop vs RTX 5080 Laptop GPU for a laptop kept five years: VRAM, bandwidth, CUDA cores, power limits and DLSS, from NVIDIA specs.";

export const RTX_5070_TI_LAPTOP_VS_RTX_5080_LAPTOP: EditorialComparison = BUILT;
