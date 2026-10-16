import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: AirPods 4 vs AirPods Pro 3.
 * Apple AirPods compare page, AirPods 4 and AirPods Pro 3 product pages. No prices.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "AirPods 4 are open-fit earbuds without ear tips, sold with or without Active Noise Cancellation; they last up to 5 hours per charge and 30 hours with the case with noise control off, and are rated IP54. AirPods Pro 3 are in-ear earbuds with five ear tip sizes, up to 8 hours per charge with Active Noise Cancellation and 24 hours with the case, an IP57 rating, heart rate sensing during workouts, and Hearing Test, Hearing Aid and Hearing Protection features. Choose AirPods 4 for an open fit; choose AirPods Pro 3 for noise cancellation, workouts and hearing features.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- AirPods 4: open fit, no ear tips; AirPods 4 with Active Noise Cancellation is a separate model.
- AirPods Pro 3: in-ear fit with five ear tip sizes, XXS to L.
- Battery: AirPods 4 up to 5 hours (noise control off); AirPods 4 with ANC up to 4 hours with ANC; AirPods Pro 3 up to 8 hours with ANC.
- Water resistance: IP54 on AirPods 4, IP57 on AirPods Pro 3.
- AirPods Pro 3 add heart rate sensing and Hearing Test, Hearing Aid and Hearing Protection features.

Fit and noise control

AirPods 4 rest in the ear without tips. The ANC version adds Active Noise Cancellation, Transparency and Adaptive Audio. AirPods Pro 3 seal the ear with foam-infused tips in five sizes and add Active Noise Cancellation with an upgraded acoustic seal.

Battery

1. AirPods 4: up to 5 hours per charge and up to 30 hours with the case, noise control off.
2. AirPods 4 with ANC: up to 4 hours with ANC and up to 20 hours with the case.
3. AirPods Pro 3: up to 8 hours with ANC and up to 24 hours with the case.

Health and durability

AirPods Pro 3 are rated IP57 and include a heart rate sensor for workouts with the Fitness app, plus Hearing Test, an FDA-authorized Hearing Aid feature and Hearing Protection. AirPods 4 are rated IP54. Both use the H2 chip and charge over USB-C, and both support Personalized Spatial Audio and Live Translation on compatible devices.

Who should pick which

Pick AirPods 4 if you dislike ear tips and want an open fit. Pick AirPods Pro 3 for stronger isolation, longer listening per charge, workouts and hearing features.`;

const BUILT = buildEditorialComparison({
  slug: "airpods-4-vs-airpods-pro",
  title: "AirPods 4 vs AirPods Pro 3: Fit, Battery, Features",
  shortAnswer: SHORT_ANSWER,
  verdict: "AirPods 4: open fit, up to 5 hours per charge (30 with case), IP54.\n\nAirPods Pro 3: in-ear fit, up to 8 hours with ANC (24 with case), IP57, heart rate and hearing features.\n\nCheck Apple's current prices before buying.",
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "airpods-4", "slug": "airpods-4", "name": "AirPods 4", "shortDesc": "Apple's open-fit earbuds, sold with or without Active Noise Cancellation.", "imageUrl": null, "entityType": "product", "position": 0, "pros": ["Open-fit design without ear tips", "Up to 5 hours per charge and 30 hours with the case (noise control off)", "H2 chip and USB-C charging case"], "cons": ["IP54 rating", "No hearing health features"], "bestFor": "Listeners who prefer an open fit"},
    {"id": "airpods-pro-3", "slug": "airpods-pro-3", "name": "AirPods Pro 3", "shortDesc": "Apple's in-ear earbuds with Active Noise Cancellation and hearing health features.", "imageUrl": null, "entityType": "product", "position": 1, "pros": ["Up to 8 hours per charge with Active Noise Cancellation", "IP57 dust, sweat and water resistance", "Heart rate sensing, Hearing Test, Hearing Aid and Hearing Protection"], "cons": ["Ear tips needed for fit (five sizes, XXS to L)", "24 hours total with the case, versus 30 on AirPods 4 with noise control off"], "bestFor": "Commuters, workouts and hearing health"},
  ],
  keyDifferences: [{"label": "Fit", "entityAValue": "Open fit, no ear tips", "entityBValue": "In-ear, five ear tip sizes", "winner": "tie"}, {"label": "Battery per charge", "entityAValue": "Up to 5 hours (noise control off)", "entityBValue": "Up to 8 hours with ANC", "winner": "tie"}, {"label": "Water resistance", "entityAValue": "IP54", "entityBValue": "IP57", "winner": "tie"}, {"label": "Hearing health", "entityAValue": "Not included", "entityBValue": "Hearing Test, Hearing Aid, Hearing Protection", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Active Noise Cancellation", "Earbuds", "airpods-4", "airpods-pro-3", "On AirPods 4 with ANC model", "Yes"),
    textAttr("a1", "Total with case", "Earbuds", "airpods-4", "airpods-pro-3", "Up to 30 hours (noise control off)", "Up to 24 hours with ANC"),
    textAttr("a2", "Heart rate sensing", "Earbuds", "airpods-4", "airpods-pro-3", "No", "Yes, during workouts"),
    textAttr("a3", "Chip", "Earbuds", "airpods-4", "airpods-pro-3", "H2", "H2"),
    textAttr("a4", "Case", "Earbuds", "airpods-4", "airpods-pro-3", "USB-C; ANC model adds wireless charging and speaker", "MagSafe case with speaker and lanyard loop"),
    textAttr("a5", "Ear tips", "Earbuds", "airpods-4", "airpods-pro-3", "None", "XXS, XS, S, M, L"),
  ],
  faqs: [{"question": "What is the difference between AirPods 4 and AirPods Pro 3?", "answer": "AirPods 4 have an open fit without ear tips and an IP54 rating. AirPods Pro 3 have an in-ear fit with ear tips, Active Noise Cancellation, IP57, heart rate sensing and hearing health features."}, {"question": "Do AirPods 4 have noise cancellation?", "answer": "Only the AirPods 4 with Active Noise Cancellation model. The standard AirPods 4 do not."}, {"question": "Which has longer battery life?", "answer": "Per charge, AirPods Pro 3 last up to 8 hours with ANC, while AirPods 4 last up to 5 hours with noise control off. With the case, AirPods 4 reach up to 30 hours and AirPods Pro 3 up to 24 hours."}, {"question": "Can AirPods Pro 3 be used as hearing aids?", "answer": "AirPods Pro 3 support Apple's Hearing Test and FDA-authorized Hearing Aid feature for adults with perceived mild to moderate hearing loss, on a compatible iPhone or iPad."}, {"question": "Are they waterproof?", "answer": "Neither is waterproof. AirPods 4 are rated IP54 and AirPods Pro 3 IP57 for dust, sweat and water resistance during non-water sports."}, {"question": "Do AirPods Pro 3 track heart rate?", "answer": "Yes. AirPods Pro 3 include heart rate sensing for workouts with the Fitness app and compatible apps on iPhone."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "AirPods 4 for an open fit without tips; AirPods Pro 3 for noise cancellation, workouts and hearing features.", keyFact: "AirPods Pro 3 last up to 8 hours with ANC and are IP57; AirPods 4 last up to 5 hours and are IP54." },
  citationStats: {"sourceCount": 3, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Apple: Compare AirPods models", "url": "https://www.apple.com/airpods/compare/"}, {"name": "Apple: AirPods Pro 3", "url": "https://www.apple.com/airpods-pro/"}, {"name": "Apple: AirPods 4", "url": "https://www.apple.com/airpods-4/"}]},
  resources: [{"type": "external", "label": "Apple: Compare AirPods models", "url": "https://www.apple.com/airpods/compare/", "description": "Battery per charge and with case, IP54/IP57, heart rate, hearing health, chips and cases."}, {"type": "external", "label": "Apple: AirPods Pro 3", "url": "https://www.apple.com/airpods-pro/", "description": "IP57; five ear tips including XXS; Active Noise Cancellation; hearing health."}, {"type": "external", "label": "Apple: AirPods 4", "url": "https://www.apple.com/airpods-4/", "description": "Open-fit AirPods 4, with or without Active Noise Cancellation."}],
  metaTitle: "AirPods 4 vs AirPods Pro 3 | A Versus B",
});

BUILT.metadata.metaDescription = "AirPods 4 vs AirPods Pro 3: open fit vs ear tips, battery per charge and with case, IP54 vs IP57, noise cancellation, heart rate and hearing features.";

export const AIRPODS_4_VS_AIRPODS_PRO: EditorialComparison = BUILT;
