import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-199 — iPhone 17 vs iPhone 17e for someone who keeps a phone for years
 * and puts battery first. Specs checked on 12 October 2026 against Apple's
 * iPhone 17 and iPhone 17e spec pages only. Apple Store prices could not be
 * mapped cleanly to an unlocked model, so no price is stated. No winner.
 */

const IP17 = "iphone-17";
const IP17E = "iphone-17e";

const APPLE_17 = "https://www.apple.com/iphone-17/specs/";
const APPLE_17E = "https://www.apple.com/iphone-17e/specs/";

const SOURCE_DATE = "2026-10-12";
const PUBLISHED = "2026-10-12T00:00:00Z";

const SHORT_ANSWER =
  "Get the iPhone 17 if battery life or a second rear camera matters to you. Apple rates it for up to 30 hours of video playback against up to 26 hours on the iPhone 17e, and it adds a 48MP Ultra Wide camera, a 120Hz ProMotion Always-On display, and faster charging. Get the iPhone 17e if you mostly shoot with the main camera and want to spend less. It has the same A19 chip family, the same 48MP main camera with a 2x optical-quality crop, and the same IP68 rating. Neither is better for everyone; it depends on how much the battery and the ultra wide are worth to you.";

const FAQS = [
  {
    question: "Is the iPhone 17 worth it over the iPhone 17e?",
    answer:
      "It is if battery life, the ultra wide camera, or the 120Hz screen matter to you. The iPhone 17 is rated for 4 more hours of video playback and 6 more hours of streamed video, and it charges faster. If you mostly use the main camera and want to save money, the 17e has the same A19 chip family, the same 48MP main camera, and the same IP68 rating.",
  },
  {
    question: "Which has better battery life, the iPhone 17 or iPhone 17e?",
    answer:
      "The iPhone 17. Apple rates it for up to 30 hours of video playback and up to 27 hours streamed. Apple rates the iPhone 17e for up to 26 hours of video playback and up to 21 hours streamed. These are Apple's test figures, and real use varies with apps, brightness, and signal.",
  },
  {
    question: "Does the iPhone 17e have an ultra wide camera?",
    answer:
      "No. The iPhone 17e has a single 48MP Fusion main camera that also gives a 12MP 2x telephoto crop. The iPhone 17 adds a 48MP Fusion Ultra Wide camera with a 120-degree field of view, which helps with group shots in tight rooms, landscapes, and macro photos.",
  },
  {
    question: "Is one rear camera enough for concerts?",
    answer:
      "For zoom, the two are the same. Both have a 2x optical-quality option from the main camera and digital zoom up to 10x, so the iPhone 17 does not reach farther. The second camera on the 17 is wider, not longer.",
  },
  {
    question: "Do the iPhone 17 and iPhone 17e use the same chip?",
    answer:
      "Both use the A19 with a 6-core CPU. Apple lists a 5-core GPU for the iPhone 17 and a 4-core GPU for the iPhone 17e.",
  },
  {
    question: "How big and heavy are the iPhone 17 and iPhone 17e?",
    answer:
      "The iPhone 17 is 6.3 inches and 177 grams, at 149.6 by 71.5 by 7.95 mm. The iPhone 17e is 6.1 inches and 169 grams, at 146.7 by 71.5 by 7.80 mm.",
  },
];

const VERDICT = `Best if battery comes first or you want an ultra wide camera: iPhone 17. Up to 30 hours of video playback, a 48MP Ultra Wide, and a 120Hz ProMotion Always-On display.

Best if you mostly use the main camera and want to spend less: iPhone 17e. Same A19 chip family, same 48MP main camera, same IP68 rating, and 8 grams lighter.

Neither is better for everyone; it depends on how much the battery and the ultra wide are worth to you.`;

const EXPERT_ANALYSIS = `Get the iPhone 17 if battery life is your top priority or you want a second rear camera. Get the iPhone 17e if you mostly shoot with the main camera and the lower price matters more. Neither is better for everyone; it depends on how much the battery and the ultra wide are worth to you.

Battery

Apple rates the iPhone 17 for up to 30 hours of video playback and up to 27 hours of streamed video. Apple rates the iPhone 17e for up to 26 hours of video playback and up to 21 hours streamed. The streamed gap, 6 hours, is the closer match to a day of social apps and video. The iPhone 17 also charges faster: 50 percent in 20 minutes with a 40W adapter or higher, against 50 percent in 30 minutes with a 20W adapter or higher on the 17e. Both are Apple's test figures, and real use varies.

Cameras

Both have a 48MP Fusion Main camera with a 2x optical-quality option and digital zoom up to 10x. The iPhone 17 adds a 48MP Fusion Ultra Wide camera with a 13 mm lens and a 120-degree field of view, which also handles macro shots. That second camera is wider, not longer, so it helps with family photos in a small room or a landscape, not with zooming in on a stage. On the front, the iPhone 17 has an 18MP Center Stage camera and the 17e has a 12MP TrueDepth camera.

Display

The iPhone 17 has a 6.3-inch Super Retina XDR display with ProMotion up to 120Hz, an Always-On display, and the Dynamic Island. Apple lists 1000 nits typical, 1600 nits HDR peak, and 3000 nits outdoor peak. The iPhone 17e has a 6.1-inch Super Retina XDR display with 800 nits typical and 1200 nits HDR peak, and Apple does not list ProMotion, Always-On, or the Dynamic Island for it. If you do not care about a smoother screen, this one should not decide it. The brighter outdoor peak on the 17 is easier to notice in sunlight.

Chip, wireless, and buttons

Both use the A19 with a 6-core CPU. The iPhone 17 has a 5-core GPU and the 17e a 4-core GPU. The iPhone 17 has Apple's N1 wireless chip with Wi-Fi 7, Bluetooth 6, and Thread. The 17e has Wi-Fi 6, Bluetooth 5.3, and Apple's C1X cellular modem. The iPhone 17 also adds Camera Control. Both have the Action button and USB-C.

Same on both

Both are rated IP68 to 6 meters for up to 30 minutes, have a Ceramic Shield 2 front, and come in 256GB and 512GB.

Keeping it for years

Both share the A19 CPU and the same storage options. For a five-year keep, the iPhone 17's extra battery hours give more room as the battery ages, and its newer wireless and faster charging age better. Apple does not commit to a set number of iOS update years for either phone.

Who should buy which

Choose the iPhone 17 if you use your phone heavily all day, want the ultra wide for group shots, or plan to keep it five years or more.

Choose the iPhone 17e if the main camera covers what you shoot, you want the smaller and lighter phone, and the price gap matters more than the extra hours.`;

const SPEC = "Specs · Apple";

export const IPHONE_17_VS_IPHONE_17E: EditorialComparison = buildEditorialComparison({
  slug: "iphone-17-vs-iphone-17e",
  title: "iPhone 17 vs iPhone 17e: Is the 17e Enough?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: IP17,
      slug: IP17,
      name: "iPhone 17",
      shortDesc: "6.3-inch iPhone with an A19 chip, two 48MP rear cameras, a 120Hz display, and up to 30 hours of video playback.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Up to 30 hours of video playback and 27 hours streamed (Apple)",
        "48MP Fusion Ultra Wide with a 120-degree field of view",
        "ProMotion up to 120Hz, Always-On, Dynamic Island",
        "50 percent charge in 20 minutes with a 40W adapter",
      ],
      cons: [
        "Heavier, at 177 grams",
        "Costs more than the 17e",
        "No extra zoom reach over the 17e",
      ],
      bestFor: "Best for battery-first, long-keep buyers",
    },
    {
      id: IP17E,
      slug: IP17E,
      name: "iPhone 17e",
      shortDesc: "6.1-inch iPhone with an A19 chip, one 48MP rear camera, and up to 26 hours of video playback.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Same A19 6-core CPU and same 48MP main camera",
        "Lighter, at 169 grams",
        "Same IP68 rating and 256GB or 512GB storage",
        "Lower price than the iPhone 17",
      ],
      cons: [
        "Up to 26 hours of video playback and 21 hours streamed",
        "No ultra wide camera",
        "No ProMotion, Always-On, or Dynamic Island listed",
        "Wi-Fi 6 and Bluetooth 5.3",
      ],
      bestFor: "Best for main-camera shooters who want to spend less",
    },
  ],
  keyDifferences: [
    { label: "Who it is for", entityAValue: "Battery first, long keep", entityBValue: "Main camera, lower price", winner: "tie" },
    { label: "Video playback", entityAValue: "Up to 30 hours", entityBValue: "Up to 26 hours", winner: "a" },
    { label: "Rear cameras", entityAValue: "48MP Main and 48MP Ultra Wide", entityBValue: "48MP Main", winner: "a" },
    { label: "Display", entityAValue: "6.3-inch, up to 120Hz", entityBValue: "6.1-inch", winner: "tie" },
    { label: "Weight", entityAValue: "177 g", entityBValue: "169 g", winner: "b" },
  ],
  attributes: [
    textAttr("chip", "Chip", SPEC, IP17, IP17E, "A19, 6-core CPU, 5-core GPU", "A19, 6-core CPU, 4-core GPU"),
    textAttr("playback", "Video playback", SPEC, IP17, IP17E, "Up to 30 hours", "Up to 26 hours", "a"),
    textAttr("streamed", "Streamed video playback", SPEC, IP17, IP17E, "Up to 27 hours", "Up to 21 hours", "a"),
    textAttr("charging", "Fast charge", SPEC, IP17, IP17E, "50% in 20 minutes, 40W adapter", "50% in 30 minutes, 20W adapter", "a"),
    textAttr("rear", "Rear cameras", SPEC, IP17, IP17E, "48MP Fusion Main, 48MP Fusion Ultra Wide", "48MP Fusion Main"),
    textAttr("front", "Front camera", SPEC, IP17, IP17E, "18MP Center Stage", "12MP TrueDepth"),
    textAttr("display", "Display", SPEC, IP17, IP17E, "6.3-inch, ProMotion up to 120Hz, Always-On", "6.1-inch Super Retina XDR"),
    textAttr("body", "Size and weight", SPEC, IP17, IP17E, "149.6 x 71.5 x 7.95 mm, 177 g", "146.7 x 71.5 x 7.80 mm, 169 g"),
    textAttr("wireless", "Wireless", SPEC, IP17, IP17E, "Wi-Fi 7, Bluetooth 6, N1", "Wi-Fi 6, Bluetooth 5.3, C1X modem"),
    textAttr("storage", "Storage", SPEC, IP17, IP17E, "256GB or 512GB", "256GB or 512GB"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "iphone-16e-vs-iphone-17e", title: "iPhone 16e vs iPhone 17e", category: "technology" },
    { slug: "iphone-17-vs-iphone-air", title: "iPhone Air vs iPhone 17", category: "technology" },
    { slug: "iphone-17-vs-iphone-17-pro-vs-iphone-16-pro", title: "iPhone 17 vs iPhone 17 Pro vs iPhone 16 Pro", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "iPhone 17 for battery-first buyers who want the ultra wide. iPhone 17e for main-camera shooters who want to spend less.",
    keyFact:
      "Apple rates the iPhone 17 for up to 30 hours of video playback and the iPhone 17e for up to 26 hours. Both use the A19 with a 6-core CPU.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 10,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple — iPhone 17 technical specifications", url: APPLE_17 },
      { name: "Apple — iPhone 17e technical specifications", url: APPLE_17E },
    ],
  },
  resources: [
    { type: "external", label: "Apple iPhone 17 specs", url: APPLE_17, description: "A19, 6.3-inch, 177 g, up to 30 hours video playback." },
    { type: "external", label: "Apple iPhone 17e specs", url: APPLE_17E, description: "A19, 6.1-inch, 169 g, up to 26 hours video playback." },
  ],
  metaTitle: "iPhone 17 vs iPhone 17e | A Versus B",
});
