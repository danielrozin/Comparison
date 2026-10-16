import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Google Analytics vs Microsoft Clarity.
 * Google Analytics Help (GA4 introduction, data retention); Microsoft Clarity home and FAQ.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Google Analytics measures traffic, events and conversions across websites and apps, with audiences and Google Ads integrations, and keeps user-level data for 2 or 14 months on standard properties. Microsoft Clarity is free behaviour analytics with session recordings, heatmaps and AI summaries, no traffic limits and no sampling, keeping recordings for up to 30 days. They answer different questions: Google Analytics shows where visitors come from and what converts; Clarity shows how they use each page. Many sites run both.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Google Analytics measures traffic sources, events and conversions; Clarity shows recordings and heatmaps.
- Clarity is free forever, with no traffic limits and no sampling.
- Clarity data is available for up to 30 days from recording.
- Google Analytics standard properties retain user-level data for 2 or 14 months.
- Clarity has a Google Analytics integration, so the tools can be used together.

What each measures

Google Analytics collects event-based data from websites and apps, models behaviour and key events, offers predictive capabilities and integrates directly with Google's media platforms. Clarity records sessions, builds heatmaps of clicks, scrolls and drop-off, and uses AI to summarise behaviour trends.

Limits and retention

Clarity has no limit on sites per account or on traffic, and does not sample. Recordings are retained for up to 30 days. Google Analytics lets standard properties keep user-level and key event data for 2 or 14 months, and other event data for longer on Analytics 360.

Using both

1. Use Google Analytics to find which pages and campaigns underperform.
2. Use Clarity recordings and heatmaps to see why visitors drop off on those pages.
3. Check consent requirements for both tools where your visitors live; Clarity supports consent management platforms.

Who should pick which

Pick Google Analytics for traffic and conversion reporting. Pick Clarity for free behaviour insight. GA4 vs Plausible covers a privacy-first alternative.`;

const BUILT = buildEditorialComparison({
  slug: "google-analytics-vs-microsoft-clarity",
  title: "Google Analytics vs Microsoft Clarity",
  shortAnswer: SHORT_ANSWER,
  verdict: "Google Analytics: traffic, events and conversions across web and apps.\n\nMicrosoft Clarity: free session recordings and heatmaps, up to 30 days of data.\n\nThey complement each other.",
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "google-analytics", "slug": "google-analytics", "name": "Google Analytics", "shortDesc": "Google's event-based traffic and conversion analytics for websites and apps.", "imageUrl": null, "entityType": "software", "position": 0, "pros": ["Website and app data in one property", "Key events, audiences and Google Ads integrations", "Retention of 2 or 14 months for user-level data"], "cons": ["No session recordings or heatmaps", "Analytics 360 needed for longer retention options"], "bestFor": "Measuring traffic sources, conversions and campaigns"},
    {"id": "microsoft-clarity", "slug": "microsoft-clarity", "name": "Microsoft Clarity", "shortDesc": "Microsoft's free behaviour analytics: session recordings, heatmaps and AI summaries.", "imageUrl": null, "entityType": "software", "position": 1, "pros": ["Free forever, with no traffic limits", "Session recordings, heatmaps and AI summaries", "No sampling; unlimited sites per account"], "cons": ["Data retained for up to 30 days from recording", "Not a full traffic and conversion analytics tool"], "bestFor": "Seeing how visitors click, scroll and drop off"},
  ],
  keyDifferences: [{"label": "Main purpose", "entityAValue": "Traffic and conversion analytics", "entityBValue": "Session recordings and heatmaps", "winner": "tie"}, {"label": "Price", "entityAValue": "Free standard; paid Analytics 360", "entityBValue": "Free forever", "winner": "tie"}, {"label": "Data retention", "entityAValue": "2 or 14 months user-level (standard)", "entityBValue": "Up to 30 days", "winner": "tie"}, {"label": "Sampling", "entityAValue": "Not compared", "entityBValue": "No sampling", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Session recordings", "Web analytics", "google-analytics", "microsoft-clarity", "No", "Yes"),
    textAttr("a1", "Heatmaps", "Web analytics", "google-analytics", "microsoft-clarity", "No", "Yes"),
    textAttr("a2", "Apps", "Web analytics", "google-analytics", "microsoft-clarity", "Website and app data", "Sites and apps"),
    textAttr("a3", "Traffic limits", "Web analytics", "google-analytics", "microsoft-clarity", "Not compared", "None"),
    textAttr("a4", "AI features", "Web analytics", "google-analytics", "microsoft-clarity", "Predictive capabilities", "AI summaries and chat"),
    textAttr("a5", "Integrations", "Web analytics", "google-analytics", "microsoft-clarity", "Google media platforms", "Google Analytics integration; consent platforms"),
  ],
  faqs: [{"question": "Can I use Microsoft Clarity with Google Analytics?", "answer": "Yes. Clarity offers a Google Analytics integration, and the tools measure different things, so many sites run both."}, {"question": "Is Microsoft Clarity free?", "answer": "Yes. Clarity is a free service with no traffic limits and no paid tier to upgrade to."}, {"question": "How long does Clarity keep data?", "answer": "Clarity data is retained for up to 30 days from the time of recording."}, {"question": "Does Google Analytics have heatmaps?", "answer": "Google Analytics focuses on events, traffic and conversions; session recordings and heatmaps are Clarity's focus."}, {"question": "How long does Google Analytics keep data?", "answer": "Standard properties can retain user-level and key event data for 2 or 14 months; Analytics 360 offers longer options for other event data."}, {"question": "Does Clarity sample data?", "answer": "No. Clarity does not sample traffic and has no limit on the number of sites per account."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Google Analytics for traffic and conversions; Clarity for free recordings and heatmaps. They work together.", keyFact: "Clarity is free with no traffic limits and 30-day retention; Google Analytics keeps user-level data 2 or 14 months." },
  citationStats: {"sourceCount": 4, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Google Analytics Help: Introducing the next generation of Google Analytics", "url": "https://support.google.com/analytics/answer/10089681"}, {"name": "Google Analytics Help: Data retention", "url": "https://support.google.com/analytics/answer/7667196"}, {"name": "Microsoft Clarity", "url": "https://clarity.microsoft.com/"}, {"name": "Microsoft Learn: Clarity FAQ", "url": "https://learn.microsoft.com/en-us/clarity/faq"}]},
  resources: [{"type": "external", "label": "Google Analytics Help: Introducing the next generation of Google Analytics", "url": "https://support.google.com/analytics/answer/10089681", "description": "Event-based web and app data, modelling, predictive capabilities, media integrations."}, {"type": "external", "label": "Google Analytics Help: Data retention", "url": "https://support.google.com/analytics/answer/7667196", "description": "User-level retention 2 or 14 months on standard properties."}, {"type": "external", "label": "Microsoft Clarity", "url": "https://clarity.microsoft.com/", "description": "Free forever; session recordings, heatmaps, AI summaries; Google Analytics integration."}, {"type": "external", "label": "Microsoft Learn: Clarity FAQ", "url": "https://learn.microsoft.com/en-us/clarity/faq", "description": "Free with no traffic limits; no sampling; unlimited sites; data retained up to 30 days."}],
  metaTitle: "Google Analytics vs Microsoft Clarity | A Versus B",
});

BUILT.metadata.metaDescription = "Google Analytics vs Microsoft Clarity: traffic and conversion analytics vs free session recordings and heatmaps. Retention, limits, price and using both.";

export const GOOGLE_ANALYTICS_VS_MICROSOFT_CLARITY: EditorialComparison = BUILT;
