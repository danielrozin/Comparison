import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Google Workspace vs Microsoft 365.
 * Google Workspace pricing page; Microsoft 365 business plan comparison. Prices omitted (promotional, change often).
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Both are business suites with custom email, cloud storage, video meetings and AI. Google Workspace is browser-first (Gmail, Docs, Sheets, Meet) with pooled storage of 30 GB, 2 TB or 5 TB per user by plan. Microsoft 365 centres on Word, Excel, PowerPoint, Outlook and Teams, with desktop apps from Business Standard up and device security in Business Premium. Both cap business plans at 300 users. Choose by the apps your team already uses; check each vendor's current per-user price.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Google Workspace business plans: Starter, Standard, Plus; Enterprise for more than 300 users.
- Microsoft 365 business plans: Basic, Standard, Premium; enterprise plans for more than 300 users.
- Workspace storage is pooled: 30 GB (Starter), 2 TB (Standard), 5 TB (Plus) per user.
- Microsoft 365 Business Basic has web and mobile apps only; Standard and Premium add desktop apps.
- Prices change with promotions and term, so compare on each vendor's pricing page.

Apps

Google Workspace includes Gmail, Drive, Docs, Sheets, Slides, Vids, Meet, Calendar, Chat and Gemini, and opens Office files. Microsoft 365 includes Word, Excel, PowerPoint, Outlook, OneNote, Teams, OneDrive, SharePoint and Exchange, with Loop, Clipchamp, Bookings, Planner and Forms on higher plans.

Storage and meetings

Workspace pools storage across the organisation: 30 GB per user on Starter, 2 TB on Standard and 5 TB on Plus. Meet supports 100 participants on Starter, 150 on Standard, 500 on Plus and 1,000 on Enterprise Plus.

Security and management

1. Workspace Plus adds Vault, eDiscovery, secure LDAP and advanced endpoint management.
2. Microsoft 365 Business Premium adds Defender for Business, Intune device management and Purview data protection.

AI

Workspace plans include Gemini in Gmail and, from Standard, in Docs, Meet and more. Microsoft 365 includes Copilot Chat for eligible users, and Copilot in Word, Excel, PowerPoint, Outlook and Teams on plans with Copilot.

Who should pick which

Pick Google Workspace if your team lives in the browser and Gmail. Pick Microsoft 365 if you need desktop Office apps or Windows device management. Google Drive vs OneDrive and Slack vs Microsoft Teams cover related choices.`;

const BUILT = buildEditorialComparison({
  slug: "google-workspace-vs-microsoft-365",
  title: "Google Workspace vs Microsoft 365 for Business",
  shortAnswer: SHORT_ANSWER,
  verdict: "Google Workspace: browser-first, pooled storage up to 5 TB per user on Plus.\n\nMicrosoft 365: desktop Office apps from Business Standard, device security on Business Premium.\n\nBoth cap business plans at 300 users. Check current per-user prices before buying.",
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "google-workspace", "slug": "google-workspace", "name": "Google Workspace", "shortDesc": "Google's business suite: Gmail, Drive, Docs, Sheets, Meet and Gemini.", "imageUrl": null, "entityType": "software", "position": 0, "pros": ["Pooled storage: 30 GB, 2 TB or 5 TB per user by plan", "Browser-first Docs, Sheets and Slides", "Meet calls up to 100, 150, 500 or 1,000 participants by plan"], "cons": ["Business plans capped at 300 users", "No desktop Office apps; works with Office files"], "bestFor": "Teams that work in the browser and Gmail"},
    {"id": "microsoft-365", "slug": "microsoft-365", "name": "Microsoft 365", "shortDesc": "Microsoft's business suite: Word, Excel, PowerPoint, Outlook, Teams, OneDrive and Copilot.", "imageUrl": null, "entityType": "software", "position": 1, "pros": ["Desktop, web and mobile Office apps on Business Standard and Premium", "Business Premium adds Defender for Business, Intune and Purview", "Copilot plans available"], "cons": ["Business Basic has web and mobile apps only", "Business plans capped at 300 users"], "bestFor": "Teams that rely on desktop Word, Excel and Outlook"},
  ],
  keyDifferences: [{"label": "Core apps", "entityAValue": "Gmail, Docs, Sheets, Slides, Meet", "entityBValue": "Outlook, Word, Excel, PowerPoint, Teams", "winner": "tie"}, {"label": "Business tiers", "entityAValue": "Starter, Standard, Plus", "entityBValue": "Basic, Standard, Premium", "winner": "tie"}, {"label": "Desktop apps", "entityAValue": "Browser-based; Drive for desktop", "entityBValue": "Desktop apps on Standard and Premium", "winner": "tie"}, {"label": "User cap", "entityAValue": "300 on business plans", "entityBValue": "300 on business plans", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Storage", "Office suites", "google-workspace", "microsoft-365", "30 GB / 2 TB / 5 TB pooled per user", "OneDrive cloud storage per user"),
    textAttr("a1", "Meetings", "Office suites", "google-workspace", "microsoft-365", "Meet: 100 / 150 / 500 participants by plan", "Teams meetings, calls and chat"),
    textAttr("a2", "Security add-ons", "Office suites", "google-workspace", "microsoft-365", "Vault, eDiscovery, secure LDAP on Plus", "Defender for Business, Intune, Purview on Premium"),
    textAttr("a3", "AI", "Office suites", "google-workspace", "microsoft-365", "Gemini in Gmail; in Docs, Meet and more from Standard", "Copilot Chat; Copilot in apps on plans with Copilot"),
    textAttr("a4", "Over 300 users", "Office suites", "google-workspace", "microsoft-365", "Enterprise plans", "Enterprise plans"),
  ],
  faqs: [{"question": "Is Google Workspace or Microsoft 365 better for small business?", "answer": "Neither is better for every business. Google Workspace suits browser-first teams using Gmail and Docs; Microsoft 365 suits teams that need desktop Word, Excel and Outlook. Both include custom email, storage, meetings and AI."}, {"question": "How much storage do I get?", "answer": "Google Workspace pools storage per user: 30 GB on Business Starter, 2 TB on Business Standard and 5 TB on Business Plus. Microsoft 365 business plans include OneDrive cloud storage per user."}, {"question": "Do Microsoft 365 business plans include desktop Office apps?", "answer": "Business Standard and Business Premium include desktop, web and mobile versions of Word, Excel, PowerPoint and Outlook. Business Basic includes web and mobile versions only."}, {"question": "Can Google Workspace open Word and Excel files?", "answer": "Yes. Docs, Sheets and Slides work with Office files, and Drive for desktop syncs files to your computer."}, {"question": "How many users can a business plan have?", "answer": "Both cap business plans at 300 users. Larger organisations move to enterprise plans."}, {"question": "Which includes AI?", "answer": "Both. Google Workspace includes Gemini in Gmail and, from Business Standard, in Docs, Meet and more. Microsoft 365 includes Copilot Chat for eligible users and Copilot inside apps on plans with Copilot."}],
  relatedComparisons: [{"slug": "google-drive-vs-onedrive", "title": "Google Drive vs OneDrive", "category": "software"}, {"slug": "slack-vs-microsoft-teams", "title": "Slack vs Microsoft Teams", "category": "software"}],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Google Workspace for browser-first teams; Microsoft 365 for desktop Office apps and device management.", keyFact: "Both cap business plans at 300 users; Workspace pools 30 GB, 2 TB or 5 TB per user by plan." },
  citationStats: {"sourceCount": 2, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Google Workspace: Pricing", "url": "https://workspace.google.com/pricing"}, {"name": "Microsoft 365: Compare business plans", "url": "https://www.microsoft.com/en-us/microsoft-365/business/compare-all-microsoft-365-business-products"}]},
  resources: [{"type": "external", "label": "Google Workspace: Pricing", "url": "https://workspace.google.com/pricing", "description": "Starter 30 GB, Standard 2 TB, Plus 5 TB pooled storage; Meet 100/150/500/1,000 participants; 300-user cap."}, {"type": "external", "label": "Microsoft 365: Compare business plans", "url": "https://www.microsoft.com/en-us/microsoft-365/business/compare-all-microsoft-365-business-products", "description": "Business Basic web and mobile apps; Standard and Premium desktop apps; Premium adds Defender, Intune, Purview; 300-user cap."}],
  metaTitle: "Google Workspace vs Microsoft 365 | A Versus B",
});

BUILT.metadata.metaDescription = "Google Workspace vs Microsoft 365 for business: apps, pooled storage, desktop Office apps, security tiers, AI and the 300-user cap compared.";

export const GOOGLE_WORKSPACE_VS_MICROSOFT_365: EditorialComparison = BUILT;
