import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Google Analytics 4 vs Plausible Analytics.
 * Google Analytics Help (GA4 introduction, data retention); Plausible home, data policy and self-hosting pages.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Google Analytics 4 collects event-based data from websites and apps, offers predictive capabilities and integrations with Google's ad platforms, and lets standard properties keep user-level data for 2 or 14 months. Plausible is open source, cookieless web analytics hosted in the EU: it uses no cookies or persistent identifiers, needs no cookie banner, and has a script 54 times smaller than Google Analytics. Plausible's cloud has a 30-day free trial, and its Community Edition is free to self-host. Choose by depth of tracking versus simplicity and privacy.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- GA4 is event-based and covers websites and apps.
- Plausible tracks overall website trends without cookies or persistent identifiers.
- GA4 standard properties retain user-level data for 2 or 14 months.
- Plausible's script is 54 times smaller than Google Analytics.
- Plausible Community Edition is free and self-hosted under the AGPL.

Data model

GA4 uses event-based rather than session-based data, combines website and app data, and includes privacy controls such as cookieless measurement and behavioural and key event modelling. Plausible counts unique visitors with a daily identifier specific to a single website, and does not track people across devices, websites or apps.

Privacy and hosting

Plausible states it does not process personal data, needs no cookie banner, and processes visitor data only on servers owned by European companies, within the EU. GA4 data retention for user-level data is 2 or 14 months on standard properties, with longer options for other event data on Analytics 360.

Cost and setup

1. GA4 is free for standard properties; Analytics 360 is the paid tier.
2. Plausible Cloud is a paid subscription after a 30-day free trial.
3. Plausible Community Edition is free to self-host; you manage the server and backups.

Who should pick which

Pick GA4 for app and web measurement tied to Google Ads. Pick Plausible for a simple, cookieless dashboard. Google Analytics vs Microsoft Clarity covers behaviour analytics.`;

const BUILT = buildEditorialComparison({
  slug: "ga4-vs-plausible-analytics",
  title: "GA4 vs Plausible: Event Analytics vs Cookieless",
  shortAnswer: SHORT_ANSWER,
  verdict: "GA4: event-based web and app analytics with Google Ads integrations.\n\nPlausible: cookieless, open source, EU-hosted web analytics with a small script.\n\nCheck consent rules where your visitors live.",
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "ga4", "slug": "ga4", "name": "Google Analytics 4", "shortDesc": "Google's event-based analytics for websites and apps.", "imageUrl": null, "entityType": "software", "position": 0, "pros": ["Website and app data in one property", "Event-based data with predictive capabilities", "Direct integrations with Google's media platforms"], "cons": ["User-level data retention of 2 or 14 months (standard properties)", "Uses cookies and identifiers; consent may be required"], "bestFor": "Marketing teams using Google Ads and apps"},
    {"id": "plausible", "slug": "plausible", "name": "Plausible Analytics", "shortDesc": "Open source, cookieless web analytics, hosted in the EU.", "imageUrl": null, "entityType": "software", "position": 1, "pros": ["No cookies or persistent identifiers; no cookie banner required", "Open source; free self-hosted Community Edition (AGPL)", "Script 54 times smaller than Google Analytics"], "cons": ["Paid cloud plans after a 30-day free trial", "Focuses on aggregate website trends, not individual users"], "bestFor": "Sites wanting simple, privacy-friendly stats"},
  ],
  keyDifferences: [{"label": "Tracking approach", "entityAValue": "Event-based; cookies and identifiers", "entityBValue": "No cookies or persistent identifiers", "winner": "tie"}, {"label": "Platforms", "entityAValue": "Websites and apps", "entityBValue": "Websites", "winner": "tie"}, {"label": "Source code", "entityAValue": "Closed", "entityBValue": "Open source (AGPL Community Edition)", "winner": "tie"}, {"label": "Cost", "entityAValue": "Free standard; paid 360", "entityBValue": "30-day trial then paid; free self-hosted", "winner": "tie"}],
  attributes: [
    textAttr("a0", "User data retention", "Web analytics", "ga4", "plausible", "2 or 14 months (standard)", "No personal data stored"),
    textAttr("a1", "Hosting", "Web analytics", "ga4", "plausible", "Google", "EU, European-owned infrastructure"),
    textAttr("a2", "Cookie banner", "Web analytics", "ga4", "plausible", "Consent may be required", "Not required"),
    textAttr("a3", "Script size", "Web analytics", "ga4", "plausible", "Baseline", "54 times smaller than Google Analytics"),
    textAttr("a4", "Ads integration", "Web analytics", "ga4", "plausible", "Direct integrations with Google media platforms", "None"),
    textAttr("a5", "Import", "Web analytics", "ga4", "plausible", "Not applicable", "Can import Google Analytics stats"),
  ],
  faqs: [{"question": "Is Plausible a replacement for Google Analytics?", "answer": "For many websites, yes, if you need aggregate traffic trends. GA4 adds app data, event modelling, predictive features and Google Ads integrations that Plausible does not aim to provide."}, {"question": "Does Plausible use cookies?", "answer": "No. Plausible does not use cookies or persistent visitor identifiers and does not track people across sites or devices."}, {"question": "How long does GA4 keep data?", "answer": "For standard properties, user-level and key event data can be retained for 2 or 14 months. Analytics 360 offers longer retention for other event data."}, {"question": "Is Plausible free?", "answer": "Plausible Cloud is paid after a 30-day free trial. Plausible Community Edition is free to self-host under the AGPL license."}, {"question": "Can I import my Google Analytics data into Plausible?", "answer": "Yes. Plausible can import Google Analytics stats."}, {"question": "Does GA4 track apps?", "answer": "Yes. GA4 collects both website and app data in one property."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "GA4 for web and app measurement tied to Google Ads; Plausible for simple, cookieless, EU-hosted stats.", keyFact: "Plausible uses no cookies and its script is 54 times smaller than Google Analytics; GA4 keeps user-level data 2 or 14 months." },
  citationStats: {"sourceCount": 5, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Google Analytics Help: Introducing the next generation of Google Analytics", "url": "https://support.google.com/analytics/answer/10089681"}, {"name": "Google Analytics Help: Data retention", "url": "https://support.google.com/analytics/answer/7667196"}, {"name": "Plausible Analytics", "url": "https://plausible.io/"}, {"name": "Plausible: Data policy", "url": "https://plausible.io/data-policy"}, {"name": "Plausible: Self-hosted web analytics", "url": "https://plausible.io/self-hosted-web-analytics"}]},
  resources: [{"type": "external", "label": "Google Analytics Help: Introducing the next generation of Google Analytics", "url": "https://support.google.com/analytics/answer/10089681", "description": "Event-based, web and app data, cookieless measurement and modelling, predictive capabilities."}, {"type": "external", "label": "Google Analytics Help: Data retention", "url": "https://support.google.com/analytics/answer/7667196", "description": "User-level retention 2 or 14 months; 26/38/50 months on 360 for other event data."}, {"type": "external", "label": "Plausible Analytics", "url": "https://plausible.io/", "description": "Cookieless, open source, EU-hosted; script 54 times smaller; 30-day free trial."}, {"type": "external", "label": "Plausible: Data policy", "url": "https://plausible.io/data-policy", "description": "No cookies or persistent identifiers; daily site-specific identifier; GDPR, CCPA and PECR."}, {"type": "external", "label": "Plausible: Self-hosted web analytics", "url": "https://plausible.io/self-hosted-web-analytics", "description": "Community Edition free, self-hosted, AGPL-licensed."}],
  metaTitle: "Google Analytics 4 vs Plausible Analytics | A Versus B",
});

BUILT.metadata.metaDescription = "GA4 vs Plausible: event-based web and app analytics vs cookieless open source stats. Data model, retention, privacy, hosting, cost and self-hosting.";

export const GA4_VS_PLAUSIBLE_ANALYTICS: EditorialComparison = BUILT;
