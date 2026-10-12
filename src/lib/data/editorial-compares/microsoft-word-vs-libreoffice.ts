import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Microsoft Word vs LibreOffice Writer, checked 3 October 2026.
 * Microsoft: the Microsoft 365 plan comparison, free Word for the web, and the
 * Word file-format reference on Microsoft Learn.
 * LibreOffice: the download page, licenses, the suite overview, system
 * requirements, alternative downloads (including LibreOffice Online), and the
 * Getting Started Guide 26.2 Writer chapter on books.libreoffice.org.
 * No page-level winner. Prices and specs those pages do not publish are left out.
 */

const WORD = "microsoft-word";
const WRITER = "libreoffice-writer";

const M365 = "https://www.microsoft.com/en-us/microsoft-365/buy/compare-all-microsoft-365-products";
const FREE_WEB = "https://www.microsoft.com/en-us/microsoft-365/free-office-online-for-the-web";
const FORMATS = "https://learn.microsoft.com/en-us/office/compatibility/office-file-format-reference";
const DOWNLOAD = "https://www.libreoffice.org/download/";
const LICENSES = "https://www.libreoffice.org/about-us/licenses/";
const DISCOVER = "https://www.libreoffice.org/discover/libreoffice/";
const REQUIREMENTS = "https://www.libreoffice.org/get-help/system-requirements/";
const OTHER = "https://www.libreoffice.org/download-other/";
const GUIDE = "https://books.libreoffice.org/en/GS262/GS26202-GettingStartedWithWriter.html";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const SPEC = "Product";

const SHORT_ANSWER =
  "Microsoft Word is included in Microsoft 365. Personal is $9.99 a month or $99.99 a year, and Word for the web is free when the file is saved in OneDrive. LibreOffice Writer is the word processor in LibreOffice, which the project offers at no cost under the Mozilla Public License 2.0. The current download is LibreOffice 26.8.0. There is no winner.";

const FAQS = [
  {
    question: "Is Microsoft Word free?",
    answer:
      "Microsoft offers Word for the web at no charge with a Microsoft account. Real-time collaboration requires the file to be saved in and shared from OneDrive. The free offer includes 5 GB of OneDrive storage plus web and mobile apps for the browser, iOS, and Android. Desktop Word is a separate product. Microsoft 365 includes Word in Personal at $9.99 a month or $99.99 a year, Family at $12.99 a month or $129.99 a year, and Premium at $19.99 a month or $199.99 a year. Office Home 2024 is a $179.99 one-time purchase for PC or Mac and includes Word.",
  },
  {
    question: "What does LibreOffice Writer cost?",
    answer:
      "LibreOffice offers the tools at no cost. LibreOffice is free software made available under the Mozilla Public License 2.0, and contributions are asked to be licensed under both that license and the GNU Lesser GPL v3 or later. Website downloads cover Windows, macOS, and Linux. Microsoft Store and Mac App Store copies are still free software, but there is a small charge to cover putting the software in those stores. The store price is not published.",
  },
  {
    question: "Can Word and Writer open each other's files?",
    answer:
      "Microsoft says .docx is Word's default XML format, and that Word can open and save OpenDocument Text .odt files. Formatting might be lost when users save and open .odt files. Word also supports .doc, .pdf, and .rtf. Writer creates and saves OpenDocument .odt files by default, and a document can be saved as .docx or .doc. Save the OpenDocument copy first. Other versions of LibreOffice may differ. LibreOffice 26.8 adds Markdown import and export.",
  },
  {
    question: "Can several people edit one document at the same time?",
    answer:
      "Word for the web is for writing and collaborating online in real time. The files must be saved in and shared from OneDrive. LibreOffice Online is a server service for display and collaborative editing in a browser. It does not include a file system, and it has to be integrated with file access and authentication. The Document Foundation says it is not planning to run a hosted cloud like Microsoft's, and that a build used past 10 concurrent documents or 20 connections shows a not-supported notice while it keeps working.",
  },
  {
    question: "Which computers can run them?",
    answer:
      "Microsoft 365 apps are compatible with PC, Mac, Android, and iOS, and Personal lets one person sign in to five devices at once. Features and app availability may vary by region. A subscription's apps go into reduced functionality if the computer is not online at least every 31 days: you can view or print, but not edit or create, until you reconnect. Once installed, Word, Excel, and PowerPoint do not need a constant connection. LibreOffice runs on Windows 10 or 11 and Windows Server 2012 through 2022, macOS 11 or newer on Intel or Apple silicon, and Linux with kernel 4.18 or higher. LibreOffice 26.8.0 offers Windows x86-64 and ARM64, macOS Apple silicon and Intel, and Linux rpm and deb packages.",
  },
  {
    question: "Which one should you install?",
    answer:
      "Install Microsoft 365, or use Word for the web, if the documents already live in OneDrive and you want Word's real-time editing there. Download LibreOffice if you want Writer on your own computer under the Mozilla Public License, with OpenDocument as the default save format. The two can exchange .docx and .odt files. Microsoft says formatting might be lost on .odt. There is no winner.",
  },
];

const VERDICT = `Best fit for OneDrive and Microsoft 365: Word. Personal is $9.99 a month or $99.99 a year, and Word for the web is free when the file is in OneDrive.

Best fit for a no-cost desktop word processor: LibreOffice Writer. The download is offered at no cost under the Mozilla Public License 2.0. The current download is LibreOffice 26.8.0.

There is no single winner.`;

const EXPERT_ANALYSIS = `Choose Word if you want Microsoft's word processor in Microsoft 365 or in the free web app. Choose LibreOffice Writer if you want the desktop suite the project offers at no cost, with OpenDocument as the default format. There is no winner.

Price and license

Microsoft 365 Personal is $9.99 a month or $99.99 a year for one person, with Word, Excel, PowerPoint, Outlook, and OneNote desktop apps, 1 TB of cloud storage, and sign-in on five devices at once. Family is $12.99 a month or $129.99 a year for one to six people, with up to 6 TB (1 TB per person). Premium is $19.99 a month or $199.99 a year. Office Home 2024 is a $179.99 one-time purchase for PC or Mac and includes Word. Word for the web is free. Microsoft says features and app availability may vary by region.

LibreOffice offers the tools at no cost. The license is the Mozilla Public License 2.0. Website downloads for Windows, macOS, and Linux do not add a price. Microsoft Store and Mac App Store copies have a small charge. The amount is not published.

Files

Word's default format is .docx. Microsoft says Word can open and save .odt, and that formatting might be lost. Writer's default save is .odt, and a .docx or .doc copy is a separate file. Save the OpenDocument copy first. LibreOffice 26.8 adds Markdown import and export. Other versions of LibreOffice may differ in appearance and functionality.

Working together

Word for the web collaborates in real time when the file is in OneDrive. LibreOffice Online can edit in a browser only after someone integrates it with file storage and sign-in. The Document Foundation says it is not building a hosted service of its own. A deployment past 10 concurrent documents or 20 connections shows a not-supported notice.

Who should install which

Install Word, through Microsoft 365 or the free web app, when the people you write with already use OneDrive. Download LibreOffice Writer when you want a local word processor at no cost from libreoffice.org, and you are willing to keep an OpenDocument original before you hand someone a .docx copy.`;

export const MICROSOFT_WORD_VS_LIBREOFFICE: EditorialComparison = buildEditorialComparison({
  slug: "microsoft-word-vs-libreoffice",
  title: "Microsoft Word vs LibreOffice Writer",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: WORD,
      slug: WORD,
      name: "Microsoft Word",
      shortDesc: "Microsoft's word processor in Microsoft 365, Office Home 2024, and Word for the web.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "Word for the web is free, with real-time collaboration when the file is in OneDrive (Microsoft)",
        "Microsoft 365 Personal is $9.99 a month or $99.99 a year and includes desktop Word (Microsoft)",
        "Personal includes 1 TB of cloud storage and sign-in on five devices at once (Microsoft)",
        ".docx is the default format, and Word can open and save .odt (Microsoft Learn)",
      ],
      cons: [
        "Desktop Word in Microsoft 365 is a paid subscription, not the free web app",
        "Office Home 2024 is a $179.99 one-time purchase for one PC or Mac",
        "Subscription apps need an internet connection at least every 31 days or they stop editing (Microsoft)",
        "Formatting might be lost when saving and opening .odt files",
      ],
      bestFor: "Best for OneDrive and Microsoft 365",
    },
    {
      id: WRITER,
      slug: WRITER,
      name: "LibreOffice Writer",
      shortDesc: "The word processor in LibreOffice 26.8.0, under the Mozilla Public License 2.0.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "LibreOffice offers the tools at no cost",
        "Mozilla Public License 2.0, with website downloads for Windows, macOS, and Linux",
        "Default save is OpenDocument .odt, and a document can also be saved as .docx or .doc",
        "LibreOffice 26.8 adds Markdown import and export",
      ],
      cons: [
        "Microsoft Store and Mac App Store copies have a small charge. The amount is not published",
        "LibreOffice Online is not a hosted service from The Document Foundation",
        "Past 10 concurrent documents or 20 connections, LibreOffice Online shows a not-supported notice",
        "Other versions of LibreOffice may differ in appearance and functionality",
      ],
      bestFor: "Best for a no-cost desktop download",
    },
  ],
  keyDifferences: [
    {
      label: "Desktop price",
      entityAValue: "Microsoft 365 Personal from $9.99 a month",
      entityBValue: "Website download at no cost",
      winner: "tie",
    },
    {
      label: "Free web app",
      entityAValue: "Word for the web, files in OneDrive",
      entityBValue: "LibreOffice Online needs your own server stack",
      winner: "tie",
    },
    {
      label: "Default file",
      entityAValue: ".docx",
      entityBValue: ".odt",
      winner: "tie",
    },
    {
      label: "License",
      entityAValue: "Microsoft 365 subscription or Office Home 2024",
      entityBValue: "Mozilla Public License 2.0",
      winner: "tie",
    },
    {
      label: "Named release",
      entityAValue: "Microsoft 365 and Office Home 2024",
      entityBValue: "LibreOffice 26.8.0",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("price", "Published price", SPEC, WORD, WRITER, "Personal $9.99/month or $99.99/year. Family $12.99/month or $129.99/year. Premium $19.99/month or $199.99/year. Word for the web is free. Office Home 2024 is $179.99 one-time for PC or Mac", "At no cost from the project. Store copies: a small charge, amount not published"),
    textAttr("license", "License", SPEC, WORD, WRITER, "Microsoft 365 subscription, or Office Home 2024 as a one-time purchase for one PC or Mac", "Mozilla Public License 2.0. Contributions are also asked under the GNU Lesser GPL v3 or later"),
    textAttr("platforms", "Platforms", SPEC, WORD, WRITER, "PC, Mac, Android, and iOS. Personal: five devices at once. Web app: browser, iOS, and Android", "Windows 10 or 11, Windows Server 2012 through 2022, macOS 11 or newer, Linux kernel 4.18 or higher. 26.8.0 builds for Windows, macOS, and Linux"),
    textAttr("formats", "File formats", SPEC, WORD, WRITER, ".docx is the default. .odt can be opened and saved, and formatting might be lost. .doc, .pdf, and .rtf are also supported", "Default .odt, with a separate save as .docx or .doc. LibreOffice 26.8 adds Markdown import and export"),
    textAttr("collab", "Collaboration", SPEC, WORD, WRITER, "Word for the web collaborates in real time when the file is saved in and shared from OneDrive", "LibreOffice Online edits in a browser after you add file access and sign-in. Not a hosted Document Foundation cloud. Notice past 10 documents or 20 connections"),
    textAttr("offline", "Offline use", SPEC, WORD, WRITER, "Installed Word does not need a constant connection. A subscription still needs the internet at least every 31 days or editing stops", "Desktop download runs on the computer and does not require an account"),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Word for Microsoft 365 and OneDrive collaboration, including a free web app. LibreOffice Writer for a no-cost desktop download under the Mozilla Public License.",
    keyFact:
      "Microsoft 365 Personal is $9.99 a month or $99.99 a year, Word for the web is free with OneDrive, and the current LibreOffice download is 26.8.0.",
  },
  citationStats: {
    sourceCount: 9,
    dataPointCount: 6,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Microsoft — Microsoft 365 plan comparison", url: M365 },
      { name: "Microsoft — free Word, Excel, and PowerPoint for the web", url: FREE_WEB },
      { name: "Microsoft Learn — Word, Excel, and PowerPoint file formats", url: FORMATS },
      { name: "LibreOffice — download", url: DOWNLOAD },
      { name: "LibreOffice — licenses", url: LICENSES },
      { name: "LibreOffice — suite overview", url: DISCOVER },
      { name: "LibreOffice — system requirements", url: REQUIREMENTS },
      { name: "LibreOffice — alternative downloads and LibreOffice Online", url: OTHER },
      { name: "LibreOffice — Getting Started Guide 26.2, Writer (published June 2026)", url: GUIDE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Microsoft 365 plan comparison",
      url: M365,
      description:
        "Personal $9.99/month or $99.99/year. Family $12.99/month or $129.99/year. Premium $19.99/month or $199.99/year. Office Home 2024 is $179.99 one-time for PC or Mac.",
    },
    {
      type: "external",
      label: "Free Word for the web",
      url: FREE_WEB,
      description: "Free Word for the web, 5 GB OneDrive, real-time collaboration when the file is in OneDrive.",
    },
    {
      type: "external",
      label: "Word file formats",
      url: FORMATS,
      description: ".docx is the default. .odt can be opened and saved, and formatting might be lost.",
    },
    {
      type: "external",
      label: "LibreOffice download",
      url: DOWNLOAD,
      description: "LibreOffice 26.8.0 for Windows, macOS, and Linux, with Markdown import and export.",
    },
    {
      type: "external",
      label: "LibreOffice licenses",
      url: LICENSES,
      description: "Free software under the Mozilla Public License 2.0.",
    },
    {
      type: "external",
      label: "LibreOffice suite overview",
      url: DISCOVER,
      description: "Writer is the word processor. The tools are offered at no cost.",
    },
    {
      type: "external",
      label: "LibreOffice system requirements",
      url: REQUIREMENTS,
      description: "Windows 10 or 11, macOS 11 or newer, and Linux kernel 4.18 or higher.",
    },
    {
      type: "external",
      label: "LibreOffice Online and store downloads",
      url: OTHER,
      description:
        "Store copies have a small charge. LibreOffice Online needs your own file access and sign-in, with a notice past 10 documents or 20 connections.",
    },
    {
      type: "external",
      label: "Writer getting started guide",
      url: GUIDE,
      description: "Published June 2026 for LibreOffice 26.2. Default save is .odt. A .docx or .doc copy is a separate save.",
    },
  ],
  metaTitle: "Word vs LibreOffice | A Versus B",
});
