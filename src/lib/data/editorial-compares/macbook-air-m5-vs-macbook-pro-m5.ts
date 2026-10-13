import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-219 — MacBook Air M5 (24GB) vs base 14-inch MacBook Pro M5 (16GB) for
 * video editing. Figures read on 13 October 2026 from Apple's MacBook Air and
 * MacBook Pro tech specs and Apple's 3 March 2026 MacBook Air with M5 newsroom
 * release (fanless design). 13-inch Air only; 15-inch Air not used.
 * No prices (Apple Store prices load client-side and were not captured),
 * no export times, no thermal-throttling figures, no winner. MacRumors
 * cooling commentary from the brief dropped (house rule: official only).
 */

const AIR = "macbook-air-m5-2026";
const PRO = "macbook-pro-m5-2026";

const AIR_SPEC = "https://www.apple.com/macbook-air/specs/";
const PRO_SPEC = "https://www.apple.com/macbook-pro/specs/";
const AIR_PR = "https://www.apple.com/newsroom/2026/03/apple-introduces-the-new-macbook-air-with-m5/";

const SOURCE_DATE = "2026-10-13";
const PUBLISHED = "2026-10-13T00:00:00Z";

const SHORT_ANSWER =
  "For regular video editing, the base 14-inch MacBook Pro M5 is the safer pick when display, ports and battery matter: it has a 14.2-inch Liquid Retina XDR display with up to 1600 nits HDR peak and ProMotion up to 120Hz, HDMI and an SDXC slot, and Apple lists up to 24 hours of video streaming. The MacBook Air M5 with 24GB is the better pick when memory and portability matter more: 8GB more unified memory, 2.7 pounds against 3.4, and a fanless design. Both use the M5 chip with a 10-core CPU and 153GB/s memory bandwidth. Neither is right for every editor.";

const FAQS = [
  {
    question: "Is the MacBook Air M5 good enough for video editing?",
    answer:
      "For many editing jobs, yes. The M5 in the MacBook Air has a 10-core CPU, 153GB/s memory bandwidth and a media engine with hardware ProRes and ProRes RAW support, and it can be configured with 24GB or 32GB of unified memory. Apple describes the Air as fanless, so long, heavy exports are where the base MacBook Pro M5 is worth considering.",
  },
  {
    question: "Should I buy a MacBook Air M5 with 24GB or a base MacBook Pro M5 with 16GB?",
    answer:
      "Choose the Air with 24GB if more memory for large projects and several apps at once, plus a lighter laptop, matter most. Choose the Pro with 16GB if the Liquid Retina XDR display, HDMI and SDXC ports, a third Thunderbolt 4 port and the longer listed battery life matter more than the extra 8GB. The Pro can also be configured with 24GB or 32GB.",
  },
  {
    question: "Do the MacBook Air M5 and MacBook Pro M5 use the same chip?",
    answer:
      "Both use the Apple M5 with a 10-core CPU (4 super cores and 6 efficiency cores), a 16-core Neural Engine and 153GB/s memory bandwidth. The base 13-inch Air has an 8-core GPU, configurable to 10 cores. The base 14-inch Pro has a 10-core GPU.",
  },
  {
    question: "Which is better for color grading and HDR work?",
    answer:
      "The 14-inch MacBook Pro. Its Liquid Retina XDR display lists 1000 nits sustained full-screen and 1600 nits peak for HDR content, a 1,000,000:1 contrast ratio and ProMotion up to 120Hz. The 13-inch MacBook Air has a 500-nit Liquid Retina display.",
  },
  {
    question: "Which has better battery life, the MacBook Air M5 or MacBook Pro M5?",
    answer:
      "Apple lists up to 24 hours of video streaming for the 14-inch MacBook Pro with M5 and up to 18 hours for the 13-inch MacBook Air with M5, under Apple's own test conditions. Editing uses more power than streaming.",
  },
  {
    question: "Which is lighter, the MacBook Air M5 or MacBook Pro M5?",
    answer:
      "The 13-inch MacBook Air with M5 weighs 2.7 pounds (1.23 kg). The 14-inch MacBook Pro with M5 weighs 3.4 pounds (1.55 kg).",
  },
];

const VERDICT = `Best for portability and memory: MacBook Air M5 with 24GB. More unified memory for large projects, 2.7 pounds, and a fanless design.

Best for display, ports and battery: base 14-inch MacBook Pro M5 with 16GB. Liquid Retina XDR with ProMotion, HDMI, SDXC and three Thunderbolt 4 ports, and up to 24 hours of video streaming.

Neither is right for every editor. Check Apple's current prices for the exact configurations you are weighing.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Same chip family: M5 with a 10-core CPU, 16-core Neural Engine and 153GB/s memory bandwidth on both.
- GPU: 8-core on the base 13-inch Air (configurable to 10-core), 10-core on the base 14-inch Pro.
- Memory: 24GB on the configured Air against 16GB on the base Pro. Both offer 16GB, 24GB or 32GB.
- Display: 500-nit Liquid Retina on the Air; Liquid Retina XDR with up to 1600 nits HDR peak and ProMotion up to 120Hz on the Pro.
- Ports: two Thunderbolt 4 on the Air; three Thunderbolt 4, HDMI and SDXC on the Pro.

Memory against display and ports

The fork here is 8GB of extra memory against a better display, more ports and longer listed battery life. Unified memory is shared by the CPU and GPU, so more of it leaves more room for long timelines, high-resolution media and several apps open at once before macOS has to lean on the SSD. The Pro's advantages are fixed hardware: the XDR panel, the HDMI port and SD card slot, and the third Thunderbolt port.

Cooling and long exports

Apple describes the 13- and 15-inch MacBook Air with M5 as having a completely silent fanless design. A fanless laptop can only shed as much heat as its case allows, so it matters most during long, heavy exports and renders. For short projects it matters less.

Display for editing

The 14.2-inch Liquid Retina XDR display on the Pro lists 3024 by 1964 pixels, 1000 nits sustained full-screen and 1600 nits peak for HDR content, up to 1000 nits for SDR outdoors, and ProMotion up to 120Hz, with an optional nano-texture finish. The 13.6-inch Liquid Retina display on the Air lists 2560 by 1664 pixels and 500 nits. Both support P3 wide color. For HDR grading, the Pro's panel is the stronger tool.

Ports and media cards

The Air has MagSafe 3, two Thunderbolt 4 ports and a headphone jack. The Pro with M5 adds a third Thunderbolt 4 port, an HDMI port and an SDXC card slot. Editors who offload camera cards or drive a TV or client monitor over HDMI need fewer adapters on the Pro. Each supports up to two external displays.

Battery and weight

Apple lists up to 18 hours of video streaming for the 13-inch Air and up to 24 hours for the 14-inch Pro with M5. The Air weighs 2.7 pounds (1.23 kg) and the Pro 3.4 pounds (1.55 kg).

When to look at M5 Pro or M5 Max

If 32GB is not enough, the 14-inch MacBook Pro is also offered with M5 Pro or M5 Max, with configurations up to 64GB or 128GB of unified memory and Thunderbolt 5 ports. These cost more than either laptop compared here.

Who should buy which

Choose the MacBook Air M5 with 24GB if you edit shorter projects, travel a lot, and want the extra memory. Choose the base MacBook Pro M5 if you grade HDR footage, use SD cards or HDMI often, or run long exports. MacBook Air vs iPad Air and Mac mini M6 vs Windows PC cover other editing setups.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "macbook-air-m5-vs-macbook-pro-m5",
  title: "MacBook Air M5 vs MacBook Pro M5 for Video Editing",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: AIR,
      slug: AIR,
      name: "MacBook Air M5",
      shortDesc: "13-inch fanless laptop with the M5 chip, configurable to 24GB or 32GB of unified memory.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Configurable to 24GB or 32GB unified memory (Apple)",
        "2.7 pounds (1.23 kg) for the 13-inch model (Apple)",
        "Completely silent fanless design (Apple)",
        "Hardware ProRes and ProRes RAW in the media engine (Apple)",
      ],
      cons: [
        "500-nit Liquid Retina display, no ProMotion",
        "Two Thunderbolt 4 ports, no HDMI or SD card slot",
        "Base 13-inch model has an 8-core GPU",
      ],
      bestFor: "Shorter edits, travel, and more memory in a lighter laptop",
    },
    {
      id: PRO,
      slug: PRO,
      name: "MacBook Pro M5",
      shortDesc: "14-inch laptop with the M5 chip, a Liquid Retina XDR display, HDMI and an SDXC slot.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Liquid Retina XDR: 1600 nits HDR peak, ProMotion up to 120Hz (Apple)",
        "Three Thunderbolt 4, HDMI, SDXC card slot (Apple)",
        "Up to 24 hours video streaming (Apple)",
        "10-core GPU in the base model (Apple)",
      ],
      cons: [
        "16GB in the base configuration",
        "3.4 pounds (1.55 kg)",
      ],
      bestFor: "HDR grading, card-based workflows and long exports",
    },
  ],
  keyDifferences: [
    {
      label: "Unified memory (as compared)",
      entityAValue: "24GB (configured)",
      entityBValue: "16GB (base)",
      winner: "a",
    },
    {
      label: "Display",
      entityAValue: "13.6-inch Liquid Retina, 500 nits",
      entityBValue: "14.2-inch Liquid Retina XDR, 1600 nits HDR peak, ProMotion up to 120Hz",
      winner: "b",
    },
    {
      label: "Ports",
      entityAValue: "MagSafe 3, two Thunderbolt 4",
      entityBValue: "MagSafe 3, three Thunderbolt 4, HDMI, SDXC",
      winner: "b",
    },
    {
      label: "Weight",
      entityAValue: "2.7 pounds (1.23 kg)",
      entityBValue: "3.4 pounds (1.55 kg)",
      winner: "a",
    },
  ],
  attributes: [
    textAttr("chip", "Chip", SPEC, AIR, PRO, "M5, 10-core CPU, 8-core GPU (configurable to 10-core), 16-core Neural Engine, 153GB/s", "M5, 10-core CPU, 10-core GPU, 16-core Neural Engine, 153GB/s"),
    textAttr("memory", "Unified memory", SPEC, AIR, PRO, "16GB, configurable to 24GB or 32GB", "16GB, configurable to 24GB or 32GB"),
    textAttr("display", "Display", SPEC, AIR, PRO, "13.6-inch Liquid Retina, 2560 by 1664, 500 nits", "14.2-inch Liquid Retina XDR, 3024 by 1964, 1000 nits sustained, 1600 nits HDR peak, ProMotion up to 120Hz", "b"),
    textAttr("battery", "Battery (Apple test)", SPEC, AIR, PRO, "Up to 18 hours video streaming", "Up to 24 hours video streaming", "b"),
    textAttr("ports", "Ports", SPEC, AIR, PRO, "MagSafe 3, two Thunderbolt 4, headphone jack", "MagSafe 3, three Thunderbolt 4, HDMI, SDXC, headphone jack", "b"),
    textAttr("weight", "Weight", SPEC, AIR, PRO, "2.7 pounds (1.23 kg)", "3.4 pounds (1.55 kg)", "a"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "macbook-air-vs-ipad-air", title: "MacBook Air vs iPad Air", category: "technology" },
    { slug: "mac-mini-m6-vs-windows-pc", title: "Mac mini M6 vs Windows PC", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "MacBook Air M5 with 24GB for more memory in a lighter, fanless laptop. Base MacBook Pro M5 for the XDR display, HDMI and SDXC, and longer listed battery life.",
    keyFact:
      "Both use the M5 with a 10-core CPU and 153GB/s memory bandwidth. The Pro adds a Liquid Retina XDR display, HDMI and an SDXC slot.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 22,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple MacBook Air tech specs", url: AIR_SPEC },
      { name: "Apple MacBook Pro tech specs", url: PRO_SPEC },
      { name: "Apple Newsroom: MacBook Air with M5", url: AIR_PR },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Apple MacBook Air tech specs",
      url: AIR_SPEC,
      description: "13-inch M5: 10-core CPU, 8-core GPU (configurable to 10-core), 153GB/s, 16GB configurable to 24GB or 32GB, 500-nit Liquid Retina, up to 18 hours video streaming, two Thunderbolt 4, 2.7 pounds.",
    },
    {
      type: "external",
      label: "Apple MacBook Pro tech specs",
      url: PRO_SPEC,
      description: "14-inch M5: 10-core CPU, 10-core GPU, 153GB/s, 16GB, 24GB or 32GB, Liquid Retina XDR with ProMotion, up to 24 hours video streaming, three Thunderbolt 4, HDMI, SDXC, 3.4 pounds.",
    },
    {
      type: "external",
      label: "Apple Newsroom: MacBook Air with M5",
      url: AIR_PR,
      description: "March 3, 2026. 13- and 15-inch MacBook Air with M5 in a thin, light, completely silent fanless design.",
    },
  ],
  metaTitle: "MacBook Air M5 vs MacBook Pro M5 | A Versus B",
});

BUILT.metadata.metaDescription =
  "MacBook Air M5 with 24GB vs base 14-inch MacBook Pro M5 with 16GB for video editing: memory, XDR display, ports, battery, weight and fanless cooling.";

export const MACBOOK_AIR_M5_VS_MACBOOK_PRO_M5: EditorialComparison = BUILT;
