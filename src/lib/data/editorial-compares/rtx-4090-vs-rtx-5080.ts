import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: RTX 4090 vs RTX 5080.
 * NVIDIA RTX 4090 and RTX 5080 spec pages; NVIDIA newsroom launch prices. No fps, no street prices.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "The RTX 4090 has more hardware: NVIDIA lists 16,384 CUDA cores and 24 GB of GDDR6X on a 384-bit bus, against 10,752 CUDA cores and 16 GB of GDDR7 on a 256-bit bus for the RTX 5080. The RTX 5080 is the newer Blackwell design with 5th-generation Tensor cores (1801 AI TOPS against 1321), draws 360 W instead of 450 W, and launched at $999 against $1,599. Both need an 850 W power supply. Street prices change, so compare current prices.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Launch prices: $1,599 for the RTX 4090 (October 12, 2022), $999 for the RTX 5080 (January 30, 2025).
- CUDA cores: 16,384 against 10,752.
- Memory: 24 GB GDDR6X, 384-bit against 16 GB GDDR7, 256-bit.
- AI TOPS: 1321 (4th-gen Tensor) against 1801 (5th-gen Tensor).
- Power: 450 W against 360 W total graphics power; 850 W system power for both.

Architecture

The RTX 4090 uses NVIDIA's Ada Lovelace architecture with 3rd-generation RT cores and 4th-generation Tensor cores. The RTX 5080 uses Blackwell with 4th-generation RT cores and 5th-generation Tensor cores.

Cores and clocks

NVIDIA lists 16,384 CUDA cores on the RTX 4090 with a 2.52 GHz boost clock and 2.23 GHz base. The RTX 5080 has 10,752 CUDA cores with a 2.62 GHz boost and 2.30 GHz base.

Memory

1. RTX 4090: 24 GB GDDR6X, 384-bit interface.
2. RTX 5080: 16 GB GDDR7, 256-bit interface.

Power

NVIDIA rates the RTX 4090 at 450 W total graphics power and the RTX 5080 at 360 W. Both list an 850 W required system power and 3x PCIe 8-pin cables via the included adapter on Founders Edition cards.

Who should pick which

Choose the RTX 4090 for 24 GB of VRAM and more CUDA cores. Choose the RTX 5080 for the newer architecture, lower power and lower launch price. RX 9070 XT vs RTX 5080 and Nvidia vs AMD cover the AMD alternatives.`;

const BUILT = buildEditorialComparison({
  slug: "rtx-4090-vs-rtx-5080",
  title: "RTX 4090 vs RTX 5080: Specs and Launch Prices",
  shortAnswer: SHORT_ANSWER,
  verdict: "RTX 4090: 24 GB GDDR6X and 16,384 CUDA cores; $1,599 at launch; 450 W.\n\nRTX 5080: Blackwell, 16 GB GDDR7, 1801 AI TOPS; $999 at launch; 360 W.\n\nStreet prices change, so compare current prices.",
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "rtx-4090", "slug": "rtx-4090", "name": "RTX 4090", "shortDesc": "NVIDIA Ada Lovelace flagship launched at $1,599 with 24 GB of GDDR6X.", "imageUrl": null, "entityType": "product", "position": 0, "pros": ["16,384 CUDA cores", "24 GB GDDR6X on a 384-bit bus", "1321 AI TOPS"], "cons": ["450 W total graphics power", "$1,599 launch price"], "bestFor": "More VRAM and CUDA cores"},
    {"id": "rtx-5080", "slug": "rtx-5080", "name": "RTX 5080", "shortDesc": "NVIDIA Blackwell card launched at $999 with 16 GB of GDDR7.", "imageUrl": null, "entityType": "product", "position": 1, "pros": ["$999 launch price", "1801 AI TOPS, 5th-generation Tensor cores", "360 W total graphics power"], "cons": ["16 GB GDDR7 on a 256-bit bus", "10,752 CUDA cores"], "bestFor": "Newer architecture at a lower launch price"},
  ],
  keyDifferences: [{"label": "Launch price", "entityAValue": "$1,599", "entityBValue": "$999", "winner": "tie"}, {"label": "CUDA cores", "entityAValue": "16,384", "entityBValue": "10,752", "winner": "tie"}, {"label": "Memory", "entityAValue": "24 GB GDDR6X, 384-bit", "entityBValue": "16 GB GDDR7, 256-bit", "winner": "tie"}, {"label": "Total graphics power", "entityAValue": "450 W", "entityBValue": "360 W", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Architecture", "Specs", "rtx-4090", "rtx-5080", "Ada Lovelace", "Blackwell"),
    textAttr("a1", "CUDA cores", "Specs", "rtx-4090", "rtx-5080", "16,384", "10,752"),
    textAttr("a2", "Clocks", "Specs", "rtx-4090", "rtx-5080", "Boost 2.52 GHz, base 2.23 GHz", "Boost 2.62 GHz, base 2.30 GHz"),
    textAttr("a3", "AI", "Specs", "rtx-4090", "rtx-5080", "4th-gen Tensor cores, 1321 AI TOPS", "5th-gen Tensor cores, 1801 AI TOPS"),
    textAttr("a4", "Memory", "Specs", "rtx-4090", "rtx-5080", "24 GB GDDR6X, 384-bit", "16 GB GDDR7, 256-bit"),
    textAttr("a5", "Power", "Specs", "rtx-4090", "rtx-5080", "450 W TGP, 850 W system power", "360 W TGP, 850 W system power"),
  ],
  faqs: [{"question": "Is the RTX 5080 better than the RTX 4090?", "answer": "It depends on what you need. The RTX 4090 has more CUDA cores and 24 GB of memory; the RTX 5080 has the newer Blackwell architecture, more AI TOPS, lower power and a lower launch price."}, {"question": "What were the launch prices?", "answer": "NVIDIA launched the RTX 4090 on October 12, 2022 starting at $1,599 and the RTX 5080 on January 30, 2025 at $999. Store prices today can differ."}, {"question": "How much VRAM do they have?", "answer": "The RTX 4090 has 24 GB of GDDR6X on a 384-bit interface. The RTX 5080 has 16 GB of GDDR7 on a 256-bit interface."}, {"question": "What power supply do I need?", "answer": "NVIDIA lists 850 W required system power for both. Total graphics power is 450 W for the RTX 4090 and 360 W for the RTX 5080."}, {"question": "Which has more AI performance?", "answer": "NVIDIA lists 1801 AI TOPS for the RTX 5080 with 5th-generation Tensor cores, against 1321 AI TOPS for the RTX 4090 with 4th-generation Tensor cores."}, {"question": "Should I consider AMD instead?", "answer": "AMD's RX 9070 XT is the closest AMD alternative to the RTX 5080. Compare current prices and the features you use."}],
  relatedComparisons: [{"slug": "rx-9070-xt-vs-rtx-5080", "title": "RX 9070 XT vs RTX 5080", "category": "technology"}, {"slug": "nvidia-vs-amd", "title": "Nvidia vs AMD", "category": "technology"}],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "RTX 4090 for 24 GB and more CUDA cores; RTX 5080 for Blackwell, lower power and a $999 launch price.", keyFact: "NVIDIA lists 24 GB GDDR6X on the RTX 4090 and 16 GB GDDR7 on the RTX 5080." },
  citationStats: {"sourceCount": 4, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "NVIDIA: GeForce RTX 4090", "url": "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/"}, {"name": "NVIDIA: GeForce RTX 5080", "url": "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5080/"}, {"name": "NVIDIA newsroom: GeForce RTX 40 Series", "url": "https://nvidianews.nvidia.com/news/nvidia-delivers-quantum-leap-in-performance-introduces-new-era-of-neural-rendering-with-geforce-rtx-40-series"}, {"name": "NVIDIA newsroom: GeForce RTX 50 Series", "url": "https://nvidianews.nvidia.com/news/nvidia-blackwell-geforce-rtx-50-series-opens-new-world-of-ai-computer-graphics"}]},
  resources: [{"type": "external", "label": "NVIDIA: GeForce RTX 4090", "url": "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/", "description": "16,384 CUDA cores, 2.52 GHz boost, 24 GB GDDR6X, 384-bit, 1321 AI TOPS, 450 W, 850 W system power."}, {"type": "external", "label": "NVIDIA: GeForce RTX 5080", "url": "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5080/", "description": "10,752 CUDA cores, 2.62 GHz boost, 16 GB GDDR7, 256-bit, 1801 AI TOPS, 360 W, 850 W system power."}, {"type": "external", "label": "NVIDIA newsroom: GeForce RTX 40 Series", "url": "https://nvidianews.nvidia.com/news/nvidia-delivers-quantum-leap-in-performance-introduces-new-era-of-neural-rendering-with-geforce-rtx-40-series", "description": "RTX 4090 available October 12, 2022, starting at $1,599."}, {"type": "external", "label": "NVIDIA newsroom: GeForce RTX 50 Series", "url": "https://nvidianews.nvidia.com/news/nvidia-blackwell-geforce-rtx-50-series-opens-new-world-of-ai-computer-graphics", "description": "RTX 5080 available January 30, 2025 at $999."}],
  metaTitle: "RTX 4090 vs RTX 5080 | A Versus B",
});

BUILT.metadata.metaDescription = "RTX 4090 vs RTX 5080: 24 GB GDDR6X vs 16 GB GDDR7, 16,384 vs 10,752 CUDA cores, 450 W vs 360 W, and $1,599 vs $999 launch prices.";

export const RTX_4090_VS_RTX_5080: EditorialComparison = BUILT;
