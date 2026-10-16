import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Google Nest vs Ring.
 * Google Store Home Premium plans and Google Help; Ring Protect plans page. Subscription list prices only.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Both sell video doorbells and cameras that need a subscription for recorded history. Google Nest uses Google Home Premium: Standard is $10 a month ($100 a year) with 30 days of event history; Advanced is $20 ($200) with 60 days plus 10 days of 24/7 history on wired cameras. Ring Protect starts at $4.99 a month for one device, $9.99 for all devices at a location, and $19.99 for Pro with 24/7 professional monitoring; paid plans keep up to 180 days of video. Choose by the app you use and how much history you need.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Nest recorded history needs Google Home Premium: $10 or $20 a month.
- Ring recorded history needs Ring Protect: $4.99, $9.99 or $19.99 a month.
- Ring paid plans store up to 180 days of video; Nest stores 30 or 60 days of events.
- Nest Advanced adds 10 days of 24/7 continuous history for wired cameras and doorbells.
- Ring Pro adds 24/7 professional monitoring.

Subscriptions

Google Home Premium (formerly Nest Aware) covers every Nest camera in the home on one plan. Standard is $10 a month or $100 a year with 30 days of event video history. Advanced is $20 a month or $200 a year with 60 days of event history and 10 days of 24/7 history for wired cameras and doorbells. Ring Protect has Solo ($4.99 a month or $49.99 a year, one device), Multi ($9.99 or $99.99, all devices at one location) and Pro ($19.99 or $199.99), plus a $99 a month Virtual Security Guard service.

Video history

1. Nest: 30 days of events (Standard) or 60 days of events plus 10 days of 24/7 (Advanced).
2. Ring: up to 180 days of event playback on paid plans.

Smart features

Nest plans add Gemini features such as searching camera history with natural language on Advanced. Ring plans add person, package and vehicle alerts, and Pro adds video descriptions, Familiar Faces and professional monitoring.

Who should pick which

Pick Nest if your home runs on Google Home and you want continuous recording. Pick Ring if you want longer event history, a low-cost single-device plan or professional monitoring.`;

const BUILT = buildEditorialComparison({
  slug: "nest-vs-ring",
  title: "Nest vs Ring: Cameras, Doorbells and Plans",
  shortAnswer: SHORT_ANSWER,
  verdict: "Nest: Google Home Premium from $10 a month; 30 or 60 days of events, 24/7 history on Advanced.\n\nRing: Ring Protect from $4.99 a month; up to 180 days of video, professional monitoring on Pro.\n\nCompare hardware and current plan prices before buying.",
  category: "products",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "nest", "slug": "nest", "name": "Google Nest", "shortDesc": "Google's camera and doorbell line, with Google Home Premium subscriptions.", "imageUrl": null, "entityType": "brand", "position": 0, "pros": ["One Home Premium plan covers all cameras in the home", "Advanced plan adds 10 days of 24/7 history for wired cameras and doorbells", "Works in the Google Home app with Gemini features"], "cons": ["Standard $10 a month or $100 a year; Advanced $20 a month or $200 a year", "30 or 60 days of event history"], "bestFor": "Google Home households"},
    {"id": "ring", "slug": "ring", "name": "Ring", "shortDesc": "Doorbell, camera and alarm brand with Ring Protect subscriptions.", "imageUrl": null, "entityType": "brand", "position": 1, "pros": ["Up to 180 days of video playback on paid plans", "Single-device plan from $4.99 a month", "Pro plan adds 24/7 professional monitoring"], "cons": ["Multi-device plan $9.99 a month or $99.99 a year", "Pro plan $19.99 a month or $199.99 a year"], "bestFor": "Households wanting long video history or professional monitoring"},
  ],
  keyDifferences: [{"label": "Plan names", "entityAValue": "Google Home Premium Standard, Advanced", "entityBValue": "Ring Protect Solo, Multi, Pro", "winner": "tie"}, {"label": "Entry plan", "entityAValue": "$10/mo or $100/yr (all cameras)", "entityBValue": "$4.99/mo or $49.99/yr (one device)", "winner": "tie"}, {"label": "Video history", "entityAValue": "30 or 60 days of events", "entityBValue": "Up to 180 days", "winner": "tie"}, {"label": "24/7 recording or monitoring", "entityAValue": "10 days of 24/7 history on Advanced", "entityBValue": "24/7 professional monitoring on Pro", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Plan prices", "Smart home", "nest", "ring", "$10/mo ($100/yr); $20/mo ($200/yr)", "$4.99/mo ($49.99/yr); $9.99/mo ($99.99/yr); $19.99/mo ($199.99/yr)"),
    textAttr("a1", "Coverage", "Smart home", "nest", "ring", "All Nest devices in the home", "Solo: one device; Multi and Pro: all devices at one location"),
    textAttr("a2", "Event history", "Smart home", "nest", "ring", "30 days (Standard), 60 days (Advanced)", "Up to 180 days"),
    textAttr("a3", "Continuous video", "Smart home", "nest", "ring", "10 days of 24/7 on wired cameras (Advanced)", "Not in base plans"),
    textAttr("a4", "Monitoring", "Smart home", "nest", "ring", "Not included", "24/7 professional monitoring on Pro"),
  ],
  faqs: [{"question": "Do Nest and Ring doorbells work without a subscription?", "answer": "Both show live view and notifications without a plan, but saving and replaying recorded video needs Google Home Premium for Nest or Ring Protect for Ring."}, {"question": "How much is Nest Aware now?", "answer": "Nest Aware is now Google Home Premium. Standard is $10 a month or $100 a year with 30 days of event history; Advanced is $20 a month or $200 a year with 60 days of events and 10 days of 24/7 history."}, {"question": "How much is Ring Protect?", "answer": "Ring Solo is $4.99 a month or $49.99 a year for one device, Ring Multi is $9.99 or $99.99 for all devices at one location, and Ring Pro is $19.99 or $199.99 with 24/7 professional monitoring."}, {"question": "Which keeps video longer?", "answer": "Ring paid plans keep up to 180 days of video. Nest keeps 30 days of events on Standard and 60 days on Advanced, plus 10 days of continuous recording on Advanced."}, {"question": "Does Nest or Ring offer continuous recording?", "answer": "Google Home Premium Advanced records 24/7 for 10 days on wired Nest cameras and doorbells. Ring's plans store motion and doorbell events rather than continuous video."}, {"question": "Which should I choose for professional monitoring?", "answer": "Ring Pro includes 24/7 professional monitoring. Google Home Premium plans do not list professional monitoring."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Nest for Google Home users and continuous recording; Ring for long event history, cheap single-device plans and professional monitoring.", keyFact: "Google Home Premium starts at $10 a month; Ring Protect starts at $4.99 a month for one device." },
  citationStats: {"sourceCount": 3, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Google Store: Google Home Premium", "url": "https://store.google.com/US/product/nest_aware?hl=en-US"}, {"name": "Google Nest Help: Google Home Premium plans", "url": "https://support.google.com/googlenest/answer/13856600"}, {"name": "Ring: Protect plans", "url": "https://ring.com/protect-plans"}]},
  resources: [{"type": "external", "label": "Google Store: Google Home Premium", "url": "https://store.google.com/US/product/nest_aware?hl=en-US", "description": "Standard $10/month or $100/year, 30 days events; Advanced $20/month or $200/year, 60 days events and 10 days 24/7."}, {"type": "external", "label": "Google Nest Help: Google Home Premium plans", "url": "https://support.google.com/googlenest/answer/13856600", "description": "Standard (previously Nest Aware) and Advanced (previously Nest Aware Plus) cover all Nest cameras in a home."}, {"type": "external", "label": "Ring: Protect plans", "url": "https://ring.com/protect-plans", "description": "Solo $4.99/mo or $49.99/yr, Multi $9.99/mo or $99.99/yr, Pro $19.99/mo or $199.99/yr; up to 180 days of video."}],
  metaTitle: "Google Nest vs Ring | A Versus B",
});

BUILT.metadata.metaDescription = "Nest vs Ring: Google Home Premium ($10 or $20 a month) vs Ring Protect ($4.99 to $19.99). Video history, 24/7 recording and monitoring compared.";

export const NEST_VS_RING: EditorialComparison = BUILT;
