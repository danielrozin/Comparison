import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Microsoft Edge vs Safari.
 * Microsoft Edge features and download pages; Apple Safari page. No speed claims.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Microsoft Edge runs on Windows, macOS, Linux, iOS and Android and builds in Copilot features such as page summaries, Compare across tabs and Copilot Vision, plus Enhanced security mode, InPrivate windows and a password generator. Safari runs only on Apple devices and centres on privacy: Intelligent Tracking Prevention, a Privacy Report, hiding your IP address from known trackers, and Private Browsing windows that lock when not in use. Choose Edge for cross-platform use and built-in AI; choose Safari if you use only Apple devices.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Edge is available on Windows, macOS, Linux, iOS and Android.
- Safari is available only on Apple devices.
- Edge builds in Copilot: summarization, Compare across tabs, Copilot Vision and Journeys.
- Safari builds in Intelligent Tracking Prevention, a Privacy Report and IP hiding from known trackers.
- Both support passkeys and private browsing.

Platforms

Microsoft offers Edge for Windows, macOS, Linux (.deb), iOS and Android, with sync for passwords, favorites and history. Safari is developed to run specifically on Apple devices.

Privacy and security

Safari's Intelligent Tracking Prevention uses on-device intelligence to help prevent cross-site tracking and stops known trackers from using your IP address. Its Privacy Report shows which trackers were prevented. Private Browsing windows lock when not in use. Edge offers InPrivate windows that delete history, cookies and form data when closed, Enhanced security mode for less familiar sites, a password generator and passkeys.

AI features

1. Edge: Copilot summaries, Compare across tabs, Copilot Vision, Journeys, Copilot new tab page and Copilot data sources for email, files and calendars.
2. Safari: integrated with Apple devices and features across Mac, iPhone and iPad.

Who should pick which

Pick Edge if you use Windows, Android or Linux, or want Copilot in the browser. Pick Safari if you use only Apple devices and want its built-in tracking protection. Chrome vs Safari and Firefox vs Safari cover other options.`;

const BUILT = buildEditorialComparison({
  slug: "edge-vs-safari",
  title: "Edge vs Safari: Platforms, Privacy and AI",
  shortAnswer: SHORT_ANSWER,
  verdict: "Edge: Windows, macOS, Linux, iOS and Android, with Copilot built in.\n\nSafari: Apple devices only, with Intelligent Tracking Prevention and IP hiding from trackers.\n\nBoth are free.",
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "microsoft-edge", "slug": "microsoft-edge", "name": "Microsoft Edge", "shortDesc": "Microsoft's browser for Windows, macOS, Linux, iOS and Android, with Copilot built in.", "imageUrl": null, "entityType": "software", "position": 0, "pros": ["Runs on Windows, macOS, Linux, iOS and Android", "Copilot summaries, Compare across tabs and Copilot Vision", "Enhanced security mode, InPrivate, password generator and passkeys"], "cons": ["Many features built around Copilot and Microsoft services", "Tracking protection less central than in Safari"], "bestFor": "Windows users and mixed-device households"},
    {"id": "safari", "slug": "safari", "name": "Safari", "shortDesc": "Apple's browser for Mac, iPhone and iPad.", "imageUrl": null, "entityType": "software", "position": 1, "pros": ["Intelligent Tracking Prevention and Privacy Report", "Hides your IP address from known trackers", "Built for Apple devices and their battery life"], "cons": ["Only on Apple devices", "No Windows, Linux or Android version"], "bestFor": "People who use only Apple devices"},
  ],
  keyDifferences: [{"label": "Platforms", "entityAValue": "Windows, macOS, Linux, iOS, Android", "entityBValue": "Apple devices only", "winner": "tie"}, {"label": "Built-in AI", "entityAValue": "Copilot summaries, Compare across tabs, Copilot Vision", "entityBValue": "Apple device features", "winner": "tie"}, {"label": "Tracking protection", "entityAValue": "Enhanced security mode, InPrivate", "entityBValue": "Intelligent Tracking Prevention, Privacy Report", "winner": "tie"}, {"label": "Private mode", "entityAValue": "InPrivate", "entityBValue": "Private Browsing with locked windows", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Developer", "Browsers", "microsoft-edge", "safari", "Microsoft", "Apple"),
    textAttr("a1", "Linux version", "Browsers", "microsoft-edge", "safari", "Yes (.deb)", "No"),
    textAttr("a2", "IP hiding from trackers", "Browsers", "microsoft-edge", "safari", "Not listed", "Hides IP from known trackers"),
    textAttr("a3", "Passwords", "Browsers", "microsoft-edge", "safari", "Password generator and passkeys", "Passkeys"),
    textAttr("a4", "Sync", "Browsers", "microsoft-edge", "safari", "Passwords, favorites, history across devices", "Across Apple devices"),
  ],
  faqs: [{"question": "Is Safari available on Windows?", "answer": "No. Safari is developed for Apple devices. Microsoft Edge is available on Windows, macOS, Linux, iOS and Android."}, {"question": "Which browser has built-in AI?", "answer": "Microsoft Edge builds in Copilot features such as page summaries, Compare across tabs, Copilot Vision and Journeys."}, {"question": "How does Safari block tracking?", "answer": "Intelligent Tracking Prevention uses on-device intelligence to help prevent cross-site tracking and stops known trackers from using your IP address. The Privacy Report shows the trackers prevented."}, {"question": "What is InPrivate in Edge?", "answer": "InPrivate windows delete the history, cookies and form data from your session when you close them."}, {"question": "Can I use Edge on a Mac or iPhone?", "answer": "Yes. Edge is available for macOS and iOS and syncs passwords, favorites and history with your other devices."}, {"question": "Which is better for privacy?", "answer": "Safari leads with Intelligent Tracking Prevention and IP hiding from known trackers by default. Edge offers InPrivate, Enhanced security mode and passkeys. Choose by the protections you want and the devices you use."}],
  relatedComparisons: [{"slug": "chrome-vs-safari", "title": "Chrome vs Safari", "category": "software"}, {"slug": "firefox-vs-safari", "title": "Firefox vs Safari", "category": "software"}],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Edge for cross-platform use and Copilot; Safari for Apple-only users who want built-in tracking protection.", keyFact: "Edge runs on Windows, macOS, Linux, iOS and Android; Safari runs only on Apple devices." },
  citationStats: {"sourceCount": 3, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Microsoft Edge: Features", "url": "https://www.microsoft.com/en-us/edge/features"}, {"name": "Microsoft Edge: Download", "url": "https://www.microsoft.com/en-us/edge/download"}, {"name": "Apple: Safari", "url": "https://www.apple.com/safari/"}]},
  resources: [{"type": "external", "label": "Microsoft Edge: Features", "url": "https://www.microsoft.com/en-us/edge/features", "description": "Copilot summarization, Compare across tabs, Copilot Vision, Journeys, InPrivate, Enhanced security mode, passkeys."}, {"type": "external", "label": "Microsoft Edge: Download", "url": "https://www.microsoft.com/en-us/edge/download", "description": "Windows, macOS, iOS, Android and Linux (.deb)."}, {"type": "external", "label": "Apple: Safari", "url": "https://www.apple.com/safari/", "description": "Intelligent Tracking Prevention, Privacy Report, IP hiding from known trackers, Private Browsing; built for Apple devices."}],
  metaTitle: "Microsoft Edge vs Safari | A Versus B",
});

BUILT.metadata.metaDescription = "Edge vs Safari: platforms, Copilot features, Intelligent Tracking Prevention, private browsing, passkeys and sync compared for Windows and Apple users.";

export const EDGE_VS_SAFARI: EditorialComparison = BUILT;
