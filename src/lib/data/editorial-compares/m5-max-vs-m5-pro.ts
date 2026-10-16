import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Apple M5 Max vs Apple M5 Pro.
 * Apple MacBook Pro technical specifications (M5 Pro and M5 Max configurations). No prices or benchmarks.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "In the MacBook Pro, the M5 Pro comes with a 15-core CPU and 16-core GPU or an 18-core CPU and 20-core GPU, with 307GB/s memory bandwidth and up to 64GB of unified memory. The M5 Max has an 18-core CPU with a 32-core GPU (460GB/s) or a 40-core GPU (614GB/s), up to 128GB of memory, and two video encode and ProRes engines. Apple rates M5 Pro models at up to 22 hours of video streaming and M5 Max models at up to 20 hours. Choose M5 Max for GPU-heavy and memory-heavy work.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- CPU: M5 Pro 15-core or 18-core; M5 Max 18-core.
- GPU: M5 Pro 16-core or 20-core; M5 Max 32-core or 40-core.
- Memory bandwidth: M5 Pro 307GB/s; M5 Max 460GB/s (32-core GPU) or 614GB/s (40-core GPU).
- Maximum memory: 64GB on M5 Pro with 20-core GPU; 128GB on M5 Max with 40-core GPU.
- Battery: up to 22 hours video streaming (M5 Pro) vs up to 20 hours (M5 Max).

CPU and GPU

The 15-core M5 Pro has 5 super cores and 10 performance cores; the 18-core M5 Pro and M5 Max have 6 super cores and 12 performance cores. All three have a 16-core Neural Engine, Neural Accelerators and hardware-accelerated ray tracing.

Memory and media

M5 Pro supports 24GB, 48GB or 64GB of unified memory, depending on configuration. M5 Max supports 36GB with the 32-core GPU, and 48GB, 64GB or 128GB with the 40-core GPU. M5 Max adds a second video encode engine and a second ProRes encode and decode engine.

Battery and power

1. M5 Pro: up to 22 hours video streaming, 14 hours wireless web; 70W or 96W adapter depending on CPU.
2. M5 Max: up to 20 hours video streaming, 13 hours wireless web; 96W adapter.
3. Both use a 72.4-watt-hour battery.

Who should pick which

Pick M5 Pro for pro apps with longer battery life. Pick M5 Max for 3D, heavy video export or very large memory needs. MacBook Air vs MacBook Pro covers the lighter option.`;

const BUILT = buildEditorialComparison({
  slug: "m5-max-vs-m5-pro",
  title: "M5 Max vs M5 Pro: MacBook Pro Chip Specs",
  shortAnswer: SHORT_ANSWER,
  verdict: "M5 Pro: up to 18-core CPU and 20-core GPU, 307GB/s, up to 64GB, up to 22 hours video streaming.\n\nM5 Max: 18-core CPU, up to 40-core GPU, up to 614GB/s and 128GB, two encode engines.\n\nCheck Apple's current configurations and prices.",
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "m5-max", "slug": "m5-max", "name": "Apple M5 Max", "shortDesc": "Apple's top MacBook Pro chip: 18-core CPU with a 32- or 40-core GPU.", "imageUrl": null, "entityType": "product", "position": 0, "pros": ["32-core or 40-core GPU", "460GB/s or 614GB/s memory bandwidth", "Up to 128GB unified memory (40-core GPU); two video encode engines"], "cons": ["Up to 20 hours video streaming, versus 22 on M5 Pro", "96W USB-C Power Adapter needed in the box"], "bestFor": "Heavy GPU, video and large-memory work"},
    {"id": "m5-pro", "slug": "m5-pro", "name": "Apple M5 Pro", "shortDesc": "Apple's mid-tier MacBook Pro chip: 15- or 18-core CPU with a 16- or 20-core GPU.", "imageUrl": null, "entityType": "product", "position": 1, "pros": ["15-core or 18-core CPU", "Up to 22 hours video streaming", "307GB/s memory bandwidth"], "cons": ["16-core or 20-core GPU", "Up to 64GB unified memory (20-core GPU); one video encode engine"], "bestFor": "Pro apps, coding and photo work with longer battery life"},
  ],
  keyDifferences: [{"label": "CPU", "entityAValue": "18-core", "entityBValue": "15-core or 18-core", "winner": "tie"}, {"label": "GPU", "entityAValue": "32-core or 40-core", "entityBValue": "16-core or 20-core", "winner": "tie"}, {"label": "Memory bandwidth", "entityAValue": "460GB/s or 614GB/s", "entityBValue": "307GB/s", "winner": "tie"}, {"label": "Max unified memory", "entityAValue": "128GB", "entityBValue": "64GB", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Video encode engines", "Chips", "m5-max", "m5-pro", "Two", "One"),
    textAttr("a1", "ProRes engines", "Chips", "m5-max", "m5-pro", "Two", "One"),
    textAttr("a2", "Neural Engine", "Chips", "m5-max", "m5-pro", "16-core", "16-core"),
    textAttr("a3", "Video streaming battery", "Chips", "m5-max", "m5-pro", "Up to 20 hours", "Up to 22 hours"),
    textAttr("a4", "Wireless web battery", "Chips", "m5-max", "m5-pro", "Up to 13 hours", "Up to 14 hours"),
    textAttr("a5", "Power adapter", "Chips", "m5-max", "m5-pro", "96W", "70W or 96W"),
  ],
  faqs: [{"question": "What is the difference between M5 Pro and M5 Max?", "answer": "M5 Max has a 32- or 40-core GPU, up to 614GB/s memory bandwidth, up to 128GB of unified memory and two video encode engines. M5 Pro has a 16- or 20-core GPU, 307GB/s and up to 64GB."}, {"question": "Do M5 Pro and M5 Max have the same CPU?", "answer": "The 18-core M5 Pro and the M5 Max both have 6 super cores and 12 performance cores. M5 Pro also comes as a 15-core CPU."}, {"question": "Which has better battery life?", "answer": "Apple rates M5 Pro MacBook Pro models at up to 22 hours of video streaming and M5 Max models at up to 20 hours."}, {"question": "How much memory can each have?", "answer": "M5 Pro up to 64GB (with the 20-core GPU). M5 Max up to 128GB (with the 40-core GPU)."}, {"question": "Is M5 Max worth it for video editing?", "answer": "M5 Max adds a second video encode engine and second ProRes engine plus more GPU cores, which helps heavy video workflows. For lighter editing, M5 Pro has the same media formats."}, {"question": "Which MacBook Pro sizes offer these chips?", "answer": "Both chips are offered in the 14-inch and 16-inch MacBook Pro."}],
  relatedComparisons: [{"slug": "macbook-air-vs-macbook-pro", "title": "MacBook Air vs MacBook Pro", "category": "technology"}],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "M5 Pro for pro work with longer battery life; M5 Max for GPU-heavy, video and large-memory work.", keyFact: "M5 Max reaches a 40-core GPU and 614GB/s; M5 Pro tops out at a 20-core GPU and 307GB/s." },
  citationStats: {"sourceCount": 2, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Apple: MacBook Pro technical specifications", "url": "https://www.apple.com/macbook-pro/specs/"}, {"name": "Apple: MacBook Pro", "url": "https://www.apple.com/macbook-pro/"}]},
  resources: [{"type": "external", "label": "Apple: MacBook Pro technical specifications", "url": "https://www.apple.com/macbook-pro/specs/", "description": "M5 Pro and M5 Max CPU/GPU, bandwidth, memory options, media engines and battery ratings."}, {"type": "external", "label": "Apple: MacBook Pro", "url": "https://www.apple.com/macbook-pro/", "description": "14-inch and 16-inch MacBook Pro with M5, M5 Pro and M5 Max."}],
  metaTitle: "Apple M5 Max vs Apple M5 Pro | A Versus B",
});

BUILT.metadata.metaDescription = "M5 Max vs M5 Pro in the MacBook Pro: CPU and GPU cores, memory bandwidth, unified memory limits, media engines and battery ratings.";

export const M5_MAX_VS_M5_PRO: EditorialComparison = BUILT;
