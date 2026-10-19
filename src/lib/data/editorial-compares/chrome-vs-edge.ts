import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Google Chrome vs Microsoft Edge.
 * Facts read 19 October 2026 from google.com/chrome, Chrome Help,
 * microsoft.com/edge, Microsoft Support and Microsoft Learn. No speed,
 * memory or battery claims. Both are free. No winner.
 */

const A = "google-chrome";
const B = "microsoft-edge";

const CHROME = "https://www.google.com/chrome/";
const CHROME_INSTALL = "https://support.google.com/chrome/answer/95346";
const EDGE_CHROMIUM =
  "https://www.microsoft.com/en-us/edge/learning-center/what-is-chromium-how-does-it-enhance-your-browser";
const EDGE_EXTENSIONS =
  "https://support.microsoft.com/en-us/microsoft-edge/add-turn-off-or-remove-extensions-in-microsoft-edge-9c0ec68c-2fbc-2f2c-9ff0-bdc76f46b026";
const EDGE_FEATURES = "https://www.microsoft.com/en-us/edge/features";
const EDGE_DOWNLOAD = "https://www.microsoft.com/en-us/edge/download";
const EDGE_SCHEDULE = "https://learn.microsoft.com/en-us/deployedge/microsoft-edge-release-schedule";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Browsers";

const SHORT_ANSWER =
  "Chrome and Edge are both free browsers built on Chromium, the open-source project Google created, so most Chrome Web Store extensions also install in Edge. The difference is the ecosystem: Chrome builds in Gemini, Google Password Manager and Google account sync, while Edge builds in Copilot features, Microsoft Defender SmartScreen and Workspaces. Pick Chrome if you live in Google services; pick Edge if you use Windows, Microsoft 365 or Copilot. Neither is better for everyone.";

const FAQS = [
  {
    question: "Are Chrome and Edge the same browser underneath?",
    answer:
      "Both are built on Chromium. Microsoft says Chromium was first created by Google and that Edge relaunched on Chromium in 2020. Each company adds its own features, account sync and AI assistant on top.",
  },
  {
    question: "Can I use Chrome extensions in Microsoft Edge?",
    answer:
      "Yes. Microsoft says extensions designed for Google Chrome can also be used in Edge, installed from the Chrome Web Store after you allow extensions from other stores.",
  },
  {
    question: "Which browser has AI built in?",
    answer:
      "Both. Chrome includes Gemini in Chrome and AI Mode; Google says auto browse is limited to Google AI Pro and Ultra subscribers in the U.S. Edge includes Copilot summaries, Compare across tabs, Copilot Vision and Journeys.",
  },
  {
    question: "Do Chrome and Edge run on Linux?",
    answer:
      "Yes. Google offers Chrome for Windows, Mac and Linux. Microsoft offers Edge for Windows, macOS, Linux, iOS and Android.",
  },
  {
    question: "How often do Chrome and Edge update?",
    answer:
      "Google says a new Chrome update ships every four weeks. Microsoft says Edge Stable moved to a two-week major release cycle starting with version 152, with an eight-week Extended Stable option for managed environments.",
  },
  {
    question: "Do Chrome or Edge cost money?",
    answer:
      "No. Google says Chrome downloads at no charge, and Edge is free from Microsoft. Some AI features, such as Chrome auto browse, need a paid Google AI plan.",
  },
];

const VERDICT = `Best for Google users: Chrome, with Gemini, Google Password Manager and Google account sync built in.

Best for Windows and Microsoft 365 users: Edge, with Copilot, Defender SmartScreen and Workspaces built in.

Both are free, both run on Chromium and both accept Chrome Web Store extensions.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Chrome and Edge both run on Chromium, which Google created.
- Edge can install extensions from the Chrome Web Store.
- Chrome builds in Gemini and Google Password Manager; Edge builds in Copilot and Defender SmartScreen.
- Google ships a Chrome update every four weeks; Edge Stable moved to a two-week major cycle from version 152.
- Both browsers are free.

Engine and extensions

Both browsers share the Chromium engine. Microsoft says Chromium was first created by Google, underpins Chrome, Opera and Edge, and became the base for Edge in 2020. Because of that shared base, Microsoft says extensions designed for Chrome also work in Edge through the Chrome Web Store.

AI features

Chrome includes Gemini in Chrome and AI Mode, and Google says auto browse is available only to Google AI Pro and Ultra subscribers in the U.S. Edge includes Copilot summarization, Compare across tabs, Copilot Vision, Copilot Memory and Journeys.

Security and passwords

Chrome offers Google Password Manager, Enhanced Safe Browsing, Safety Check and Privacy Guide. Edge offers Microsoft Defender SmartScreen, a scareware blocker, Enhanced security mode, InPrivate windows, a password generator and passkeys.

Tabs, sync and updates

1. Chrome: tab groups, vertical tabs, split view, Memory Saver and Energy Saver, sync through your Google account, and a new update every four weeks.
2. Edge: Workspaces, split screen, PC gaming boost, sync for passwords and favorites, and a two-week Stable release cycle from version 152.

Who should pick which

Pick Chrome if you use Gmail, Google Drive and Android and want Gemini. Pick Edge if you use Windows, Microsoft 365 or Copilot. Chrome vs Safari, Edge vs Safari and Chrome vs Firefox cover other choices.`;

const BUILT = buildEditorialComparison({
  slug: "chrome-vs-edge",
  title: "Chrome vs Edge: Engine, AI, Security and Updates",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Google Chrome",
      shortDesc: "Google's free Chromium browser with Gemini, Google Password Manager and Google account sync.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "Gemini in Chrome and AI Mode built in",
        "Google Password Manager, Enhanced Safe Browsing and Safety Check",
        "Tab groups, vertical tabs, split view, Memory Saver and Energy Saver",
      ],
      cons: ["Auto browse limited to Google AI Pro and Ultra subscribers in the U.S.", "Sync and AI tied to a Google account"],
      bestFor: "People who use Google services",
    },
    {
      id: B,
      slug: B,
      name: "Microsoft Edge",
      shortDesc: "Microsoft's free Chromium browser for Windows, macOS, Linux, iOS and Android, with Copilot built in.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Copilot summaries, Compare across tabs, Copilot Vision and Journeys",
        "Defender SmartScreen, scareware blocker and Enhanced security mode",
        "Installs Chrome Web Store extensions",
      ],
      cons: ["Many features built around Copilot and a Microsoft account", "Extensions from the Chrome Web Store need an extra opt-in"],
      bestFor: "Windows, Microsoft 365 and Copilot users",
    },
  ],
  keyDifferences: [
    { label: "Engine", entityAValue: "Chromium", entityBValue: "Chromium (since 2020)", winner: "tie" },
    { label: "Built-in AI", entityAValue: "Gemini in Chrome, AI Mode", entityBValue: "Copilot summaries, Compare across tabs, Copilot Vision", winner: "tie" },
    { label: "Safety tools", entityAValue: "Enhanced Safe Browsing, Safety Check", entityBValue: "Defender SmartScreen, scareware blocker", winner: "tie" },
    { label: "Release cadence", entityAValue: "Every four weeks", entityBValue: "Two-week Stable cycle from version 152", winner: "tie" },
  ],
  attributes: [
    textAttr("developer", "Developer", GROUP, A, B, "Google", "Microsoft"),
    textAttr("engine", "Engine", GROUP, A, B, "Chromium", "Chromium"),
    textAttr("platforms", "Desktop platforms", GROUP, A, B, "Windows, Mac and Linux", "Windows, macOS and Linux (.deb); also iOS and Android"),
    textAttr("ai", "AI assistant", GROUP, A, B, "Gemini in Chrome; auto browse for Google AI Pro and Ultra in the U.S.", "Copilot summarization, Compare across tabs, Copilot Vision, Journeys"),
    textAttr("passwords", "Passwords", GROUP, A, B, "Google Password Manager", "Password generator and passkeys"),
    textAttr("extensions", "Extensions", GROUP, A, B, "Chrome Web Store", "Microsoft Edge Add-ons and Chrome Web Store"),
    textAttr("updates", "Updates", GROUP, A, B, "New update every four weeks", "Two-week major Stable cycle from version 152; eight-week Extended Stable"),
    textAttr("price", "Price", GROUP, A, B, "Free", "Free"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "chrome-vs-safari", title: "Chrome vs Safari", category: "technology" },
    { slug: "edge-vs-safari", title: "Edge vs Safari", category: "software" },
    { slug: "chrome-vs-firefox", title: "Chrome vs Firefox", category: "software" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Chrome for Google users who want Gemini; Edge for Windows and Microsoft 365 users who want Copilot.",
    keyFact: "Both browsers run on Chromium, and Edge installs Chrome Web Store extensions.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 16,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Google: Chrome", url: CHROME },
      { name: "Chrome Help: Download and install Google Chrome", url: CHROME_INSTALL },
      { name: "Microsoft Edge: What is Chromium", url: EDGE_CHROMIUM },
      { name: "Microsoft Support: Add, turn off, or remove extensions in Microsoft Edge", url: EDGE_EXTENSIONS },
      { name: "Microsoft Edge: Features", url: EDGE_FEATURES },
      { name: "Microsoft Edge: Download", url: EDGE_DOWNLOAD },
      { name: "Microsoft Learn: Microsoft Edge release schedule", url: EDGE_SCHEDULE },
    ],
  },
  resources: [
    { type: "external", label: "Google: Chrome", url: CHROME, description: "Gemini in Chrome, AI Mode, Google Password Manager, Enhanced Safe Browsing, tab groups, Memory Saver, updates every four weeks." },
    { type: "external", label: "Chrome Help: Download and install Google Chrome", url: CHROME_INSTALL, description: "Chrome downloads at no charge for Windows, Mac and Linux." },
    { type: "external", label: "Microsoft Edge: What is Chromium", url: EDGE_CHROMIUM, description: "Chromium was first created by Google; Edge relaunched on Chromium in 2020." },
    { type: "external", label: "Microsoft Support: Add, turn off, or remove extensions in Microsoft Edge", url: EDGE_EXTENSIONS, description: "Extensions designed for Google Chrome can also be used in Edge." },
    { type: "external", label: "Microsoft Edge: Features", url: EDGE_FEATURES, description: "Copilot summarization, Compare across tabs, Copilot Vision, Journeys, Defender SmartScreen, Workspaces, passkeys." },
    { type: "external", label: "Microsoft Edge: Download", url: EDGE_DOWNLOAD, description: "Windows, macOS, iOS, Android and Linux (.deb)." },
    { type: "external", label: "Microsoft Learn: Microsoft Edge release schedule", url: EDGE_SCHEDULE, description: "Two-week major Stable release cycle starting with version 152; eight-week Extended Stable." },
  ],
  metaTitle: "Chrome vs Edge: Which Browser? | A Versus B",
});

BUILT.metadata.metaDescription =
  "Chrome vs Edge: both free and built on Chromium. Compare Gemini and Copilot, security tools, Chrome extension support, platforms and update cadence.";

export const CHROME_VS_EDGE: EditorialComparison = BUILT;
