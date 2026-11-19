import type { Metadata } from "next";
import Link from "next/link";
import { CompareLink, RelatedComparisons } from "@/components/comparison/CompareLink";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

const PAGE_URL = `${SITE_URL}/alternatives/onenote`;
const PAGE_TITLE = "OneNote Alternatives in 2026";
const PAGE_DESCRIPTION =
  "Joplin, Obsidian, Trilium, Xournal++, Linwood Butterfly, AFFiNE, and Outline as OneNote alternatives, including self-hosted sync options.";
const UPDATED_ISO = "2026-11-19";
const UPDATED_LABEL = "November 19, 2026";
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent(
  PAGE_TITLE,
)}&a=${encodeURIComponent("OneNote")}&b=${encodeURIComponent("Alternatives")}&type=comparison`;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const, "max-video-preview": -1 },
  },
  alternates: {
    canonical: PAGE_URL,
    languages: { en: PAGE_URL, "x-default": PAGE_URL },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "article",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "OneNote alternatives in 2026, including self-hosted options",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  other: {
    citation_title: PAGE_TITLE,
    citation_author: SITE_NAME,
    citation_journal_title: "A Versus B",
    citation_language: "en",
    citation_abstract: PAGE_DESCRIPTION,
    citation_publication_date: UPDATED_ISO,
    citation_online_date: UPDATED_ISO,
    "last-modified": UPDATED_ISO,
    "DC.title": PAGE_TITLE,
    "DC.creator": SITE_NAME,
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.date": UPDATED_ISO,
    "DC.identifier": PAGE_URL,
  },
};

interface AlternativeRow {
  name: string;
  openSource: string;
  selfHost: string;
  handwriting: string;
  platforms: string;
  importPath: string;
}

const TABLE_ROWS: AlternativeRow[] = [
  {
    name: "Joplin",
    openSource: "Yes. joplinapp.org calls the app open source.",
    selfHost: "Joplin Server (Docker). Also Joplin Cloud, Dropbox, and OneDrive.",
    handwriting: "Freehand Drawing plugin uses js-draw. That plugin listing does not name PDF annotation.",
    platforms: "Windows, macOS, Linux, Android, iOS, and a terminal app.",
    importPath: "Desktop import of a OneNote ZIP. Details in the migration section.",
  },
  {
    name: "Obsidian",
    openSource: "No. The license overview says Obsidian owns the code in the app.",
    selfHost: "Community Self-hosted LiveSync, with CouchDB, object storage, or WebRTC. Separate from Obsidian Sync.",
    handwriting: "Community Excalidraw plugin stores drawings in the vault. Obsidian Canvas is a layout space, not described as PDF annotation.",
    platforms: "Windows, Mac, Linux, iOS, and Android on the download page.",
    importPath: "—",
  },
  {
    name: "Trilium Notes",
    openSource: "Yes. The README calls it free and open source, under the AGPL.",
    selfHost: "Self-hosted sync server.",
    handwriting: "Canvas note type based on Excalidraw. PDF annotation is not named in the README feature list.",
    platforms: "Windows, macOS, Linux, and a browser UI.",
    importPath: "—",
  },
  {
    name: "Xournal++",
    openSource: "Yes. The project site calls it open source.",
    selfHost: "No sync service is described. Syncthing can synchronize a folder of its journals.",
    handwriting: "Pressure-sensitive stylus, layers, and PDF annotation.",
    platforms: "Windows, macOS, and Linux.",
    importPath: "—",
  },
  {
    name: "Linwood Butterfly",
    openSource: "Yes. The site calls it free and open source under the GNU AGPL-3.0.",
    selfHost: "WebDAV, including Nextcloud. Documents stay on the device unless you save them elsewhere.",
    handwriting: "Infinite canvas, stylus, touch, or mouse, and PDF import.",
    platforms: "Android, Windows, macOS, Linux, and the browser. iOS is a preview.",
    importPath: ".one section or .onepkg package.",
  },
  {
    name: "AFFiNE",
    openSource: "Mixed. MIT for the editor and most client code. The backend is source-available under the AFFiNE EE license.",
    selfHost: "Docker Compose on a server you operate. Free for up to 10 seats per workspace.",
    handwriting: "Docs and a whiteboard. Stylus PDF annotation is not named on the self-host page.",
    platforms: "Desktop app with offline local workspaces, plus the server.",
    importPath: "—",
  },
  {
    name: "Outline",
    openSource: "Public source. The README states a BSL 1.1 license.",
    selfHost: "Hosting guide for your own copy. A hosted app is also offered.",
    handwriting: "Not described as a handwriting or PDF annotation app.",
    platforms: "Web app.",
    importPath: "—",
  },
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "OneNote alternatives in 2026",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: TABLE_ROWS.length,
  itemListElement: [
    { name: "Joplin", applicationCategory: "Note-taking", operatingSystem: "Windows, macOS, Linux, Android, iOS", url: "https://joplinapp.org/" },
    { name: "Obsidian", applicationCategory: "Knowledge management", operatingSystem: "Windows, macOS, Linux, iOS, Android", url: "https://obsidian.md/" },
    { name: "Trilium Notes", applicationCategory: "Knowledge management", operatingSystem: "Windows, macOS, Linux, Web", url: "https://github.com/TriliumNext/Trilium" },
    { name: "Xournal++", applicationCategory: "Handwriting notes", operatingSystem: "Windows, macOS, Linux", url: "https://xournalpp.github.io/" },
    { name: "Linwood Butterfly", applicationCategory: "Handwriting notes", operatingSystem: "Android, Windows, macOS, Linux, Web", url: "https://butterfly.linwood.dev/" },
    { name: "AFFiNE", applicationCategory: "Knowledge base", operatingSystem: "Desktop, self-hosted server", url: "https://affine.pro/self-host" },
    { name: "Outline", applicationCategory: "Team knowledge base", operatingSystem: "Web", url: "https://github.com/outline/outline" },
  ].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: { "@type": "SoftwareApplication", ...item },
  })),
};

// Visible FAQ paragraphs render these strings unchanged, so the FAQPage
// answers match the text on the screen.
const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is the closest alternative to OneNote?",
    answer:
      "For typed notes, choose Joplin or Obsidian. Joplin is open source, uses end-to-end encryption, and syncs through Joplin Cloud, Dropbox, OneDrive, or a self-hosted Joplin Server. Obsidian stores notes on your device and lists Windows, Mac, Linux, iOS, and Android downloads. Choose Xournal++ or Linwood Butterfly when the work is handwriting on PDFs.",
  },
  {
    question: "Is there a self-hosted OneNote alternative?",
    answer:
      "Yes. Joplin can sync to a self-hosted Joplin Server. Trilium Notes documents a self-hosted sync server. Obsidian can sync through the community Self-hosted LiveSync plugin, using CouchDB, object storage, or WebRTC. AFFiNE documents a Docker Compose server, and Outline documents running your own copy. Linwood Butterfly can sync over WebDAV, including Nextcloud.",
  },
  {
    question: "What is a good OneNote alternative for handwriting and PDF annotation?",
    answer:
      "Choose Xournal++ if you want an open-source app for Windows, macOS, and Linux with a pressure-sensitive stylus and PDF annotation. Choose Linwood Butterfly if you want an infinite canvas, PDF import, and apps for Android, Windows, macOS, Linux, and the browser, plus an iOS preview. Syncthing, a separate program, can synchronize a folder of Xournal++ files between computers.",
  },
  {
    question: "Can I import my OneNote notebooks into another app?",
    answer:
      "Joplin documents File > Import > ZIP - OneNote Notebook. The OneDrive path needs Joplin 3.5.1 or newer and may not work for notebooks larger than 2-4 GB. The Windows desktop export path needs Joplin 3.5.5 or newer, and a .onepkg file can be imported only when Joplin is running on Windows. Linwood Butterfly documents an import that selects a .one section or a .onepkg package. This roundup does not name an OneNote import path for the other apps. Microsoft documents exporting notes to PDF with File > Export, and says the PDF is a static snapshot.",
  },
  {
    question: "Which OneNote alternative fits handwritten lecture notes?",
    answer:
      "Choose Xournal++ or Linwood Butterfly when the notes are handwriting on PDFs. Xournal++ documents a pressure-sensitive pen and a PDF background. Linwood Butterfly documents stylus, touch, or mouse input, PDF import, and an infinite canvas. Choose Joplin or Obsidian when the notes are typed.",
  },
  {
    question: "Does Obsidian sync without a Microsoft account?",
    answer:
      "Yes. Obsidian's download list does not require OneDrive. The community Self-hosted LiveSync plugin documents sync through CouchDB, object storage such as MinIO, S3, or R2, or WebRTC between devices. The plugin says it is not compatible with official Obsidian Sync. Obsidian Sync is a separate Obsidian service.",
  },
];

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const breadcrumbListSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${PAGE_URL}#breadcrumbs`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": `${SITE_URL}/`, name: "Home", url: `${SITE_URL}/` } },
    {
      "@type": "ListItem",
      position: 2,
      name: "Alternatives",
      item: { "@type": "WebPage", "@id": `${SITE_URL}/alternatives/`, name: "Alternatives", url: `${SITE_URL}/alternatives/` },
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "OneNote Alternatives",
      item: { "@type": "WebPage", "@id": PAGE_URL, name: "OneNote Alternatives", url: PAGE_URL },
    },
  ],
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${PAGE_URL}#collectionpage`,
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  genre: "Alternatives Guide",
  inLanguage: "en-US",
  interactivityType: "expositive",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  datePublished: UPDATED_ISO,
  dateModified: UPDATED_ISO,
  contentReferenceTime: UPDATED_ISO,
  thumbnailUrl: OG_IMAGE,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: OG_IMAGE,
    contentUrl: OG_IMAGE,
    width: 1200,
    height: 630,
    caption: "OneNote alternatives in 2026, including self-hosted options",
  },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "People comparing note-taking apps", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessibilityFeature: ["readingOrder", "structuralNavigation"],
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2", ".alternatives-intro"] },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${PAGE_URL}#article`,
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  datePublished: UPDATED_ISO,
  dateModified: UPDATED_ISO,
  inLanguage: "en-US",
  image: OG_IMAGE,
  author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  mainEntityOfPage: PAGE_URL,
};

function TableCells({ row }: { row: AlternativeRow }) {
  return (
    <>
      <td className="px-3 py-3 font-bold text-text">{row.name}</td>
      <td className="px-3 py-3 text-text">{row.openSource}</td>
      <td className="px-3 py-3 text-text">{row.selfHost}</td>
      <td className="px-3 py-3 text-text">{row.handwriting}</td>
      <td className="px-3 py-3 text-text">{row.platforms}</td>
      <td className="px-3 py-3 text-text">{row.importPath}</td>
    </>
  );
}

export default function OneNoteAlternativesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-text-secondary flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="sr-only sm:not-sr-only">Home</span>
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              {/* No /alternatives index page exists; plain text, not a 404 link. */}
              <span>Alternatives</span>
            </li>
            <li aria-hidden="true">
              <svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-text font-medium" aria-current="page">OneNote Alternatives</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text leading-tight">
            OneNote alternatives, including self-hosted options
          </h1>
          <p className="mt-3 text-sm text-text-secondary italic">Updated {UPDATED_LABEL}.</p>
        </header>

        <p className="alternatives-intro text-text leading-relaxed mb-4">
          If you mainly type notes, choose Joplin or Obsidian: Joplin syncs through Joplin Cloud, Dropbox, OneDrive, or a self-hosted Joplin Server, and Obsidian can sync through the community Self-hosted LiveSync plugin. If you handwrite on PDFs with a stylus, choose Xournal++ or Linwood Butterfly, because those projects document pen input and PDF markup.
        </p>

        <section aria-labelledby="onenote-takeaways" className="prose-section">
          <h2 id="onenote-takeaways" className="text-2xl font-bold text-text mt-10 mb-4">
            Key takeaways
          </h2>
          <p className="text-text leading-relaxed mb-4">
            The choice depends on whether the notes are typed, handwritten on PDFs, or a wiki you host yourself.
          </p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-4">
            <li>Joplin is an open-source notes app with end-to-end encryption, apps for Windows, macOS, Linux, Android, and iOS, and sync that includes Joplin Cloud, Dropbox, OneDrive, and a self-hosted Joplin Server.</li>
            <li>Obsidian stores notes on your device. The community Self-hosted LiveSync plugin can sync them through CouchDB, object storage, or WebRTC, and it says it is not compatible with official Obsidian Sync.</li>
            <li>Xournal++ documents a pressure-sensitive stylus, layers, and PDF annotation on Windows, macOS, and Linux.</li>
            <li>Linwood Butterfly documents an infinite canvas, PDF import, and WebDAV sync, including Nextcloud, on Android, Windows, macOS, Linux, and the web, with an iOS preview.</li>
            <li>Trilium Notes documents a self-hosted sync server and an Excalidraw canvas note. AFFiNE documents Docker Compose self-hosting, free for up to 10 seats per workspace, and Outline documents running your own copy under a BSL 1.1 license.</li>
            <li>Joplin documents an OneNote ZIP import. Microsoft documents a PDF export that it describes as a static snapshot.</li>
          </ul>
        </section>

        <nav aria-label="On this page" className="mt-8">
          <p className="text-lg font-bold text-text mb-2">On this page</p>
          <ol className="list-decimal pl-6 text-text leading-relaxed space-y-1">
            <li><a href="#onenote-compare" className="text-primary-600 font-semibold hover:underline">Comparison table</a></li>
            <li><a href="#onenote-typed" className="text-primary-600 font-semibold hover:underline">Typed notes</a></li>
            <li><a href="#onenote-handwriting" className="text-primary-600 font-semibold hover:underline">Handwriting and PDFs</a></li>
            <li><a href="#onenote-self-hosted" className="text-primary-600 font-semibold hover:underline">Self-hosted options</a></li>
            <li><a href="#onenote-migrate" className="text-primary-600 font-semibold hover:underline">Moving notes out of OneNote</a></li>
            <li><a href="#onenote-choose" className="text-primary-600 font-semibold hover:underline">Which app fits which job</a></li>
            <li><a href="#onenote-faq" className="text-primary-600 font-semibold hover:underline">FAQ</a></li>
          </ol>
        </nav>

        <section aria-labelledby="onenote-compare" className="mt-10">
          <h2 id="onenote-compare" className="text-2xl font-bold text-text mb-4">
            How do these OneNote alternatives compare?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Joplin and Obsidian cover typed notes with a sync path that is not Microsoft&rsquo;s. Xournal++ and Linwood Butterfly cover handwriting and PDFs. Trilium Notes, AFFiNE, and Outline cover knowledge bases you can run yourself. A dash in the import column means this roundup does not name an import path for that app.
          </p>
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-border bg-white" tabIndex={0} role="region" aria-label="Scrollable comparison table">
            <table className="min-w-full text-sm" aria-labelledby="onenote-table-caption">
              <caption id="onenote-table-caption" className="text-left px-3 py-3 text-sm text-text-secondary">
                OneNote alternatives compared on license, self-host sync, handwriting, platforms, and import paths named in this roundup. Details were read on {UPDATED_LABEL}.
              </caption>
              <thead className="bg-surface-alt text-text-secondary">
                <tr>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">App</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Open source?</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Self-host sync</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Handwriting and PDF</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Platforms</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">OneNote import path</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={row.name} className="border-t border-border align-top">
                    <TableCells row={row} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden flex flex-col gap-3">
            {TABLE_ROWS.map((row) => (
              <div key={row.name} className="rounded-xl border border-border bg-white p-4">
                <h3 className="text-base font-bold text-text">{row.name}</h3>
                <dl className="mt-3 grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <dt className="text-text-secondary text-xs uppercase tracking-wide">Open source?</dt>
                    <dd className="text-text">{row.openSource}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary text-xs uppercase tracking-wide">Self-host sync</dt>
                    <dd className="text-text">{row.selfHost}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary text-xs uppercase tracking-wide">Handwriting and PDF</dt>
                    <dd className="text-text">{row.handwriting}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary text-xs uppercase tracking-wide">Platforms</dt>
                    <dd className="text-text">{row.platforms}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary text-xs uppercase tracking-wide">OneNote import path</dt>
                    <dd className="text-text">{row.importPath}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-text-secondary">
            License and feature wording comes from each project&rsquo;s own site or repository, read on {UPDATED_LABEL}. Amounts for paid plans are left on those sites.
          </p>
        </section>

        <section aria-labelledby="onenote-typed" className="mt-12">
          <h2 id="onenote-typed" className="text-2xl font-bold text-text mb-3">
            Which apps fit typed notes?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Choose Joplin, Obsidian, or Trilium Notes when the notes are typed. They do not document a copy of a free-form inking canvas, so a stylus-and-PDF workflow belongs in the handwriting section below.
          </p>

          <h3 id="onenote-joplin" className="text-xl font-bold text-text mt-6 mb-2">Joplin</h3>
          <p className="text-text leading-relaxed mb-4">
            Joplin&rsquo;s home page calls it an open-source note-taking app. It says notes use end-to-end encryption, and that you can sync with various services, including Joplin Cloud, Dropbox, and OneDrive. The same page lists Windows, macOS, Linux, Android, iOS, and a terminal app. Notes can include images, videos, PDFs, and audio, and the editors include rich text and Markdown.
          </p>
          <p className="text-text leading-relaxed mb-4">
            Joplin Server is the self-hosted sync target. Its install guide says Docker Engine runs the server, and that you create a user whose email and password the Joplin clients use to sync. The Freehand Drawing plugin, listed in Joplin&rsquo;s plugin directory, says it creates and edits drawings with js-draw. That listing does not describe PDF annotation.
          </p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Choose Joplin if you want an open-source app, end-to-end encryption, and sync through Joplin Cloud, Dropbox, OneDrive, or your own Joplin Server.</li>
            <li>Choose a handwriting app instead if the main job is a pressure-sensitive pen on top of lecture PDFs.</li>
          </ul>

          <h3 id="onenote-obsidian" className="text-xl font-bold text-text mt-6 mb-2">Obsidian</h3>
          <p className="text-text leading-relaxed mb-4">
            Obsidian&rsquo;s home page says notes stay on your device, including while offline, and that the app uses open file formats. It also says the app stores notes locally as plain text Markdown files, and that thousands of plugins and themes are available. The download page lists Windows, Mac, Linux, iOS, and Android. The license overview, last updated February 20, 2025, says Obsidian is free to use and that Obsidian owns the code in the app, so this roundup does not call Obsidian open source.
          </p>
          <p className="text-text leading-relaxed mb-4">
            Official Obsidian Sync is a separate service. The home page describes sync across devices with end-to-end encryption. Self-hosted LiveSync is a community plugin, not that service. Its repository says it syncs with CouchDB or object storage such as MinIO, S3, or R2, and that it can also sync peer-to-peer with WebRTC. It says the plugin supports end-to-end encryption, and that it is not compatible with official Obsidian Sync. The Obsidian-Excalidraw plugin says it stores and edits Excalidraw drawings in the vault. Obsidian&rsquo;s own Canvas is described as an infinite space for research and diagrams, not as PDF annotation.
          </p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Choose Obsidian if you want local Markdown files and you will add community plugins for drawings or for self-hosted sync.</li>
            <li>Choose Joplin instead if the app itself must be open source and the sync target must be Joplin Server.</li>
          </ul>

          <h3 id="onenote-trilium" className="text-xl font-bold text-text mt-6 mb-2">Trilium Notes</h3>
          <p className="text-text leading-relaxed mb-4">
            The Trilium Notes README calls it a free, open-source, cross-platform hierarchical note-taking app for large personal knowledge bases, licensed under the GNU AGPL. It documents synchronization with a self-hosted sync server, per-note encryption, and a canvas note type for sketching diagrams based on Excalidraw. The same README documents Evernote import and Markdown import and export. Windows, macOS, and Linux builds are listed, and a server install exposes a browser UI. The README says current Chrome and Firefox versions are the browsers it supports and tests.
          </p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1">
            <li>Choose Trilium Notes if you want one open-source app with a self-hosted sync server and a hierarchical notebook.</li>
            <li>Choose Joplin or Obsidian if you want the sync products those projects document for phones and desktops in the sections above.</li>
          </ul>
        </section>

        <section aria-labelledby="onenote-handwriting" className="mt-12">
          <h2 id="onenote-handwriting" className="text-2xl font-bold text-text mb-3">
            Which apps fit handwriting and PDF annotation?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Choose Xournal++ or Linwood Butterfly when a stylus and a PDF are the job. Both projects document pen input and PDF markup on their own sites.
          </p>

          <h3 id="onenote-xournal" className="text-xl font-bold text-text mt-6 mb-2">Xournal++</h3>
          <p className="text-text leading-relaxed mb-4">
            Xournal++ calls itself open-source, cross-platform note-taking software. The home page documents a pressure-sensitive stylus, including Wacom, Huion, and XP-Pen tablets, plus layers, pen, highlighter, and eraser tools. Installation pages exist for Windows, macOS, and Linux. The PDF guide says File &gt; Annotate PDF, or File &gt; Open, creates a journal that uses a PDF as the background. The journal is stored as a <code>.xopp</code> file, separate from the PDF, unless attach mode copies the PDF beside it. File &gt; Export as PDF writes a PDF of the journal and its background.
          </p>
          <p className="text-text leading-relaxed mb-4">
            Xournal++ does not describe a built-in sync service. Syncthing&rsquo;s site describes Syncthing as a continuous file synchronization program that synchronizes files between two or more computers. A folder of <code>.xopp</code> journals can sit in a Syncthing folder. That is Syncthing&rsquo;s job, not a Xournal++ feature.
          </p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Choose Xournal++ if you want PDF backgrounds, layers, and a pressure-sensitive pen on Windows, macOS, or Linux.</li>
            <li>Choose Linwood Butterfly instead if you also want a phone app or WebDAV sync.</li>
          </ul>

          <h3 id="onenote-butterfly" className="text-xl font-bold text-text mt-6 mb-2">Linwood Butterfly</h3>
          <p className="text-text leading-relaxed mb-4">
            Linwood Butterfly&rsquo;s site calls it free and open source under the GNU AGPL-3.0 license. It documents an infinite canvas, drawing with a stylus, touch, or mouse, and importing PDFs and SVGs. It says the app runs on Android, Windows, macOS, Linux, and in the browser, with an iOS preview also available. Documents stay on the device unless you save them somewhere else. WebDAV services such as Nextcloud are the documented sync path. The importing guide says Add, then Import, then OneNote selects a <code>.one</code> section or a <code>.onepkg</code> notebook package, and it points to a separate guide for export steps and conversion limits. Those limits stay in Butterfly&rsquo;s own guide.
          </p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1">
            <li>Choose Linwood Butterfly if you want one canvas for handwriting, PDF import, and WebDAV, including on Android.</li>
            <li>Choose Xournal++ if you want the PDF-background journal and the desktop installs that project documents.</li>
          </ul>
        </section>

        <section aria-labelledby="onenote-self-hosted" className="mt-12">
          <h2 id="onenote-self-hosted" className="text-2xl font-bold text-text mb-3">
            Which OneNote alternatives can you self-host?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Joplin Server, Trilium&rsquo;s sync server, a LiveSync backend you run, AFFiNE&rsquo;s Docker Compose stack, Outline&rsquo;s own copy, and Linwood Butterfly with WebDAV are the self-hosted paths these projects document. Obsidian Sync is Obsidian&rsquo;s service, not a server you install.
          </p>
          <ol className="list-decimal pl-6 text-text leading-relaxed space-y-3 mb-4">
            <li>
              <strong>Joplin Server.</strong> The server README says Docker runs Joplin Server, clients sync with a user you create, and PostgreSQL is the database it describes for production use. SQLite is described for a local test.
            </li>
            <li>
              <strong>Trilium Notes.</strong> The README lists synchronization with a self-hosted sync server, including Docker, and a browser UI for a server install.
            </li>
            <li>
              <strong>Obsidian with Self-hosted LiveSync.</strong> The plugin README says you run CouchDB or object storage yourself, or use WebRTC between devices. It warns you to back up the vault first and not to enable the plugin beside another sync solution, including Obsidian Sync.
            </li>
            <li>
              <strong>AFFiNE.</strong> The self-host page, which shows a last-updated date of October 4, 2026, says you run the docs-and-whiteboard workspace with Docker Compose. It says self-hosting is free for up to 10 seats per workspace. Paid seat amounts are printed on that site and are not repeated here. The same page says the editor and most client code are MIT-licensed, and the server backend is source-available under the AFFiNE EE license. The desktop app works offline with local workspaces.
            </li>
            <li>
              <strong>Outline.</strong> The GitHub README calls Outline a fast, collaborative, markdown-compatible knowledge base. It says a hosted app is offered at getoutline.com, and it links a hosting guide for running your own copy. The README states a BSL 1.1 license. This roundup does not call that license an open-source grant.
            </li>
            <li>
              <strong>Linwood Butterfly plus WebDAV.</strong> The app is local unless you connect WebDAV, such as Nextcloud. That is file sync for its documents, not a Joplin-style note server.
            </li>
          </ol>
          <h3 className="text-xl font-bold text-text mt-6 mb-2">Team wiki or family notes</h3>
          <p className="text-text leading-relaxed mb-4">
            Choose AFFiNE if you want documents and a whiteboard on infrastructure you operate, and your workspace fits the 10-seat self-host limit or you will read the paid plans on AFFiNE&rsquo;s site. Choose Outline if you want a team knowledge base and you will follow its hosting guide. Choose Joplin if the group is sharing notebooks through a Joplin Server you run. These are different products: Outline&rsquo;s README describes a team knowledge base, not a stylus app.
          </p>
        </section>

        <section aria-labelledby="onenote-migrate" className="mt-12">
          <h2 id="onenote-migrate" className="text-2xl font-bold text-text mb-3">
            How do you move notes out of OneNote?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Use only the import path the destination app documents. This roundup names two. Keep a PDF snapshot beside the move, using the export Microsoft documents.
          </p>
          <h3 className="text-xl font-bold text-text mt-6 mb-2">Joplin&rsquo;s documented ZIP import</h3>
          <p className="text-text leading-relaxed mb-4">
            Joplin&rsquo;s importing guide says Joplin can import OneNote notebooks with File &gt; Import &gt; ZIP - OneNote Notebook.
          </p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>OneNote on the web, for a notebook stored on OneDrive: Joplin 3.5.1 or newer. Joplin says this approach may not work for notebooks larger than 2-4 GB. The guide says to download the notebook folder from OneDrive as a ZIP, then import that ZIP.</li>
            <li>OneNote Windows desktop app, which Joplin says is not the same as OneNote for Windows 10: Joplin 3.5.5 or newer. Export a section as a OneNote 2010-2016 section (<code>.one</code> or <code>.onex</code>), or a notebook as a OneNote package (<code>.onepkg</code>). Joplin says <code>.onepkg</code> files can be imported only when Joplin is running on Windows. The import menu item is still ZIP - OneNote Notebook.</li>
          </ul>
          <h3 className="text-xl font-bold text-text mt-6 mb-2">Linwood Butterfly&rsquo;s documented package import</h3>
          <p className="text-text leading-relaxed mb-4">
            Butterfly&rsquo;s importing guide says the OneNote entry selects a <code>.one</code> section or a <code>.onepkg</code> package, and that a separate OneNote guide covers export steps and conversion limits. Read that guide before treating a converted notebook as complete.
          </p>
          <h3 className="text-xl font-bold text-text mt-6 mb-2">PDF snapshot from Microsoft</h3>
          <p className="text-text leading-relaxed">
            Microsoft&rsquo;s article &ldquo;Export notes from OneNote as a PDF&rdquo; says to open the page, choose File &gt; Export, choose what to export under Export Current, choose PDF, then Export, and save the file. It says a PDF is a static snapshot: later edits in OneNote do not change that PDF. That export is a backup you can keep, not an importer inside Joplin, Obsidian, or the other apps above.
          </p>
        </section>

        <section aria-labelledby="onenote-choose" className="mt-12">
          <h2 id="onenote-choose" className="text-2xl font-bold text-text mb-3">
            Which app fits which job?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Match the app to the job. Each row fits a different kind of notebook.
          </p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-4">
            <li>Handwriting on lecture PDFs: choose Xournal++ if you want Windows, macOS, and Linux with a PDF background and a pressure-sensitive pen. Choose Linwood Butterfly if you want an infinite canvas, mobile apps, and WebDAV.</li>
            <li>A typed knowledge base: choose Joplin if you want open source, end-to-end encryption, and Joplin Server. Choose Obsidian if you want local Markdown files and community plugins. Choose Trilium Notes if you want its self-hosted sync server and a hierarchical tree.</li>
            <li>A family or team wiki: choose AFFiNE if you want docs and a whiteboard on Docker Compose. Choose Outline if you want the collaborative knowledge base its README describes, on a copy you host.</li>
            <li>A fully self-hosted setup: use Joplin Server, Trilium&rsquo;s sync server, LiveSync with a backend you run, AFFiNE&rsquo;s Docker Compose stack, or Outline&rsquo;s hosting guide. Obsidian Sync remains Obsidian&rsquo;s own service.</li>
          </ul>
          <p className="text-text leading-relaxed">
            Related reading on this site: the{" "}
            <Link href="/alternatives/notion" className="text-primary-600 font-semibold hover:underline">
              Notion alternatives
            </Link>
            , the{" "}
            <Link href="/alternatives/obsidian" className="text-primary-600 font-semibold hover:underline">
              Obsidian alternatives
            </Link>
            , and{" "}
            <CompareLink href="/compare/notion-vs-obsidian" className="text-primary-600 font-semibold hover:underline">
              Notion vs Obsidian
            </CompareLink>
            .
          </p>
        </section>

        <section aria-labelledby="onenote-faq" className="mt-12">
          <h2 id="onenote-faq" className="text-2xl font-bold text-text mb-4">Frequently asked questions</h2>
          <p className="text-text leading-relaxed mb-4">
            These answers use the same product limits as the sections above.
          </p>
          <div className="space-y-6">
            {FAQS.map((item) => (
              <div key={item.question}>
                <h3 className="font-bold text-text mb-2">{item.question}</h3>
                <p className="text-text leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="onenote-sources" className="mt-12">
          <h2 id="onenote-sources" className="text-2xl font-bold text-text mb-3">
            Where these details come from
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Each link was opened on {UPDATED_LABEL}. Feature claims above are limited to what that project writes on the linked page.
          </p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-2">
            <li><a href="https://joplinapp.org/" className="text-primary-600 font-semibold hover:underline">Joplin</a> — open source, end-to-end encryption, sync targets, and platforms.</li>
            <li><a href="https://github.com/laurent22/joplin/blob/dev/packages/server/README.md" className="text-primary-600 font-semibold hover:underline">Joplin Server README</a> — Docker install and client sync.</li>
            <li><a href="https://joplinapp.org/help/apps/import_export/" className="text-primary-600 font-semibold hover:underline">Joplin importing and exporting</a> — OneNote ZIP import, including the 3.5.1 and 3.5.5 requirements and the 2-4 GB note.</li>
            <li><a href="https://joplinapp.org/plugins/plugin/io.github.personalizedrefrigerator.js-draw/" className="text-primary-600 font-semibold hover:underline">Joplin Freehand Drawing plugin</a> — js-draw drawings.</li>
            <li><a href="https://obsidian.md/" className="text-primary-600 font-semibold hover:underline">Obsidian</a> — local notes, Markdown files, Canvas, and Sync.</li>
            <li><a href="https://obsidian.md/download" className="text-primary-600 font-semibold hover:underline">Obsidian downloads</a> — Windows, Mac, Linux, iOS, and Android.</li>
            <li><a href="https://obsidian.md/license" className="text-primary-600 font-semibold hover:underline">Obsidian license overview</a> — free use, and ownership of the app code. Last updated February 20, 2025.</li>
            <li><a href="https://github.com/vrtmrz/obsidian-livesync" className="text-primary-600 font-semibold hover:underline">Self-hosted LiveSync</a> — community plugin, CouchDB, object storage, WebRTC, and the Obsidian Sync incompatibility note.</li>
            <li><a href="https://github.com/zsviczian/obsidian-excalidraw-plugin" className="text-primary-600 font-semibold hover:underline">Obsidian-Excalidraw</a> — community drawing plugin.</li>
            <li><a href="https://github.com/TriliumNext/Trilium" className="text-primary-600 font-semibold hover:underline">Trilium Notes README</a> — AGPL, sync server, Excalidraw canvas, Evernote and Markdown import.</li>
            <li><a href="https://xournalpp.github.io/" className="text-primary-600 font-semibold hover:underline">Xournal++</a> — open source, stylus, and layers.</li>
            <li><a href="https://xournalpp.github.io/installation/" className="text-primary-600 font-semibold hover:underline">Xournal++ installation</a> — Windows, Linux, and macOS.</li>
            <li><a href="https://xournalpp.github.io/guide/pdfs/" className="text-primary-600 font-semibold hover:underline">Xournal++ PDF guide</a> — Annotate PDF, <code>.xopp</code> journals, and PDF export.</li>
            <li><a href="https://syncthing.net/" className="text-primary-600 font-semibold hover:underline">Syncthing</a> — folder synchronization between computers.</li>
            <li><a href="https://butterfly.linwood.dev/" className="text-primary-600 font-semibold hover:underline">Linwood Butterfly</a> — AGPL-3.0, canvas, platforms, and WebDAV.</li>
            <li><a href="https://butterfly.linwood.dev/docs/v2/importing/" className="text-primary-600 font-semibold hover:underline">Linwood Butterfly importing</a> — PDF, <code>.one</code>, and <code>.onepkg</code>.</li>
            <li><a href="https://affine.pro/self-host" className="text-primary-600 font-semibold hover:underline">AFFiNE self-host</a> — Docker Compose, the 10-seat limit, and the MIT and EE license split. The page shows last updated October 4, 2026.</li>
            <li><a href="https://github.com/outline/outline" className="text-primary-600 font-semibold hover:underline">Outline README</a> — team knowledge base, hosting guide, and BSL 1.1.</li>
            <li><a href="https://support.microsoft.com/en-us/onenote/onenote-help-and-learning/export-notes-from-onenote-as-a-pdf" className="text-primary-600 font-semibold hover:underline">Export notes from OneNote as a PDF</a> — Microsoft&rsquo;s File &gt; Export steps and the static-snapshot description.</li>
          </ul>
        </section>

        <RelatedComparisons hrefs={["/compare/notion-vs-obsidian"]}>
          <section aria-labelledby="onenote-related" className="mt-12">
            <h2 id="onenote-related" className="text-2xl font-bold text-text mb-4">Related comparisons</h2>
            <ul className="space-y-2 text-text">
              <li>
                <CompareLink href="/compare/notion-vs-obsidian" className="text-primary-600 font-semibold hover:underline">
                  Notion vs Obsidian
                </CompareLink>
                {" "}— a cloud workspace and local Markdown notes
              </li>
            </ul>
          </section>
        </RelatedComparisons>

        <p className="mt-10 text-sm text-text-secondary">Drafted with AI from web research.</p>

        <div className="mt-12">
          <NewsletterSignup source="alternatives" referrerSlug="onenote" />
        </div>
      </div>
    </>
  );
}
