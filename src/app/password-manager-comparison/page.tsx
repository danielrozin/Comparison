import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { AI_CONTENT_LABEL, AI_DISCLOSURE } from "@/lib/editorial/blog-authorship";
import { SoftPricingLine } from "@/components/monetization/SoftPricingLine";
import { LAST_UPDATED } from "./last-updated";

const PAGE_URL = `${SITE_URL}/password-manager-comparison`;
const PAGE_TITLE = `Best Password Managers Compared (2026) | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "10 password managers compared for 2026: encryption, third-party reviews, open-source status, free plans and annual-plan prices, each linked to the vendor's own page.";
const PM_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Best Password Managers Compared 2026")}&type=trending`;

export const metadata: Metadata = {
  // ROO-241: title already carries the brand; skip the layout template.
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
    types: { "application/rss+xml": `${SITE_URL}/feed`, "application/atom+xml": `${SITE_URL}/feed/atom` },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "article",

    locale: "en_US",    siteName: SITE_NAME,
    images: [{ url: PM_OG_IMAGE, width: 1200, height: 630, alt: "Best Password Managers Compared 2026 — A Versus B" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [PM_OG_IMAGE],
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": SITE_NAME,
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": PAGE_TITLE,
    "DC.creator": SITE_NAME,
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": PAGE_URL,
  },
};

/* ── Schema.org ─────────────────────────────────────────────────────────── */
const articleSchema = {
  "@context": "https://schema.org",
  "@type": ["Article", "TechArticle"],
  "@id": `${PAGE_URL}#article`,
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  abstract: PAGE_DESCRIPTION,
  url: PAGE_URL,
  genre: "Comparison Guide",
  inLanguage: "en-US",
  interactivityType: "expositive",
  creativeWorkStatus: "Published",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  datePublished: "2026-07-11",
  dateModified: LAST_UPDATED,
  contentReferenceTime: LAST_UPDATED,
  thumbnailUrl: PM_OG_IMAGE,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: PM_OG_IMAGE,
    contentUrl: PM_OG_IMAGE,
    width: 1200,
    height: 630,
    caption: "Best Password Managers Compared 2026 — A Versus B",
  },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightYear: 2026,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Consumers, IT Professionals, Security Researchers, Developers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
  educationalLevel: "General",
  teaches: "How to choose the best password manager for security, usability, and price",
  educationalUse: "comparison",
  alternativeHeadline: "Best Password Managers in 2026 — Security, Price & Feature Comparison",
  author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  keywords: "password manager comparison, best password managers, 1Password vs Bitwarden, Dashlane, LastPass 2026",
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro", "#pm-answer"] },
  about: { "@type": "Thing", name: "Password managers", sameAs: "https://en.wikipedia.org/wiki/Password_manager" },
  mentions: [
    { "@type": "SoftwareApplication", name: "1Password", url: "https://1password.com" },
    { "@type": "SoftwareApplication", name: "Bitwarden", url: "https://bitwarden.com" },
    { "@type": "SoftwareApplication", name: "Dashlane", url: "https://www.dashlane.com" },
    { "@type": "SoftwareApplication", name: "LastPass", url: "https://www.lastpass.com" },
    { "@type": "SoftwareApplication", name: "Keeper", url: "https://www.keepersecurity.com" },
    { "@type": "SoftwareApplication", name: "NordPass", url: "https://nordpass.com" },
    { "@type": "SoftwareApplication", name: "RoboForm", url: "https://www.roboform.com" },
    { "@type": "SoftwareApplication", name: "Enpass", url: "https://www.enpass.io" },
    { "@type": "SoftwareApplication", name: "KeePass", url: "https://keepass.info" },
    { "@type": "SoftwareApplication", name: "ProtonPass", url: "https://proton.me/pass" },
  ],
  timeRequired: "PT6M",
  wordCount: 1200,
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
};

/* ── Data ───────────────────────────────────────────────────────────────── */
// ROO-269 (Oct 19, 2026): every value below was read on the linked vendor page.
// Where a vendor page could not be loaded or did not state a value, the cell
// points to the vendor page instead of repeating an older figure.
const SEE_VENDOR_SECURITY = "See vendor security page";

type Price = { text: string; url: string } | null;

type PM = {
  name: string;
  vendor: string;
  encryption: string;
  independentReview: string;
  openSource: string;
  price: Price;
  freeTier: string;
  sources: { label: string; url: string }[];
};

const PASSWORD_MANAGERS: PM[] = [
  {
    name: "1Password",
    vendor: "AgileBits",
    encryption: "Master password plus a 128-bit Secret Key",
    independentReview: "SOC 2 Type 2",
    openSource: "No",
    price: {
      text: "Individual: $3.99/month billed annually, per 1Password pricing page, October 2026",
      url: "https://1password.com/pricing/password-manager",
    },
    freeTier: "No free plan; 14-day free trial",
    sources: [
      { label: "1Password security", url: "https://1password.com/security/" },
      { label: "1Password security assessments", url: "https://support.1password.com/security-assessments/" },
      { label: "1Password pricing", url: "https://1password.com/pricing/password-manager" },
    ],
  },
  {
    name: "Bitwarden",
    vendor: "Bitwarden Inc.",
    encryption: "AES-CBC 256-bit; PBKDF2 SHA-256 or Argon2id",
    independentReview: "Annual third-party source code audits and penetration tests; SOC 2",
    openSource: "Yes (GPL v3.0 clients)",
    price: {
      text: "Premium: $1.65/month billed annually ($19.80), per Bitwarden pricing page, October 2026",
      url: "https://bitwarden.com/pricing/",
    },
    freeTier: "Free plan: unlimited passwords and devices",
    sources: [
      { label: "Bitwarden security whitepaper", url: "https://bitwarden.com/help/bitwarden-security-white-paper/" },
      { label: "Bitwarden compliance and audits", url: "https://bitwarden.com/compliance/" },
      { label: "Bitwarden clients license (GitHub)", url: "https://github.com/bitwarden/clients/blob/main/LICENSE.txt" },
      { label: "Bitwarden pricing", url: "https://bitwarden.com/pricing/" },
    ],
  },
  {
    name: "Dashlane",
    vendor: "Dashlane SAS",
    encryption: SEE_VENDOR_SECURITY,
    independentReview: SEE_VENDOR_SECURITY,
    openSource: "No",
    price: null,
    freeTier: "See vendor page",
    sources: [
      { label: "Dashlane security", url: "https://www.dashlane.com/security" },
      { label: "Dashlane pricing", url: "https://www.dashlane.com/pricing" },
    ],
  },
  {
    name: "LastPass",
    vendor: "LastPass",
    encryption: "256-bit AES; PBKDF2",
    independentReview: "2022 incident: an attacker copied a backup of encrypted customer vault data",
    openSource: "No",
    price: null,
    freeTier: "Free plan limited to 1 device type; 30-day Premium trial",
    sources: [
      { label: "LastPass notice of security incident (2022)", url: "https://blog.lastpass.com/2022/12/notice-of-recent-security-incident/" },
      { label: "LastPass pricing", url: "https://www.lastpass.com/pricing" },
    ],
  },
  {
    name: "Keeper",
    vendor: "Keeper Security",
    encryption: "AES-256 GCM; PBKDF2 (1,000,000 iterations)",
    independentReview: "SOC 2; ISO 27001, 27017 and 27018",
    openSource: "No",
    price: null,
    freeTier: "Free trial",
    sources: [
      { label: "Keeper security", url: "https://www.keepersecurity.com/security.html" },
      { label: "Keeper pricing", url: "https://www.keepersecurity.com/pricing.html" },
    ],
  },
  {
    name: "NordPass",
    vendor: "Nord Security",
    encryption: "XChaCha20; Argon2id",
    independentReview: SEE_VENDOR_SECURITY,
    openSource: "No",
    price: null,
    freeTier: "Free personal plan",
    sources: [
      { label: "NordPass security", url: "https://nordpass.com/security/" },
      { label: "NordPass Free", url: "https://nordpass.com/free-password-manager/" },
      { label: "NordPass pricing", url: "https://nordpass.com/pricing/" },
    ],
  },
  {
    name: "RoboForm",
    vendor: "Siber Systems",
    encryption: "AES-256; PBKDF2 SHA-256",
    independentReview: "Tested by Secfault Security",
    openSource: "No",
    price: {
      text: "Premium: $2.49/month billed annually ($29.88/year), per RoboForm pricing page, October 2026",
      url: "https://www.roboform.com/pricing-personal",
    },
    freeTier: "Free plan: unlimited passwords on a single device",
    sources: [
      { label: "RoboForm security", url: "https://www.roboform.com/security" },
      { label: "RoboForm pricing", url: "https://www.roboform.com/pricing-personal" },
    ],
  },
  {
    name: "Enpass",
    vendor: "Sinew Software",
    encryption: SEE_VENDOR_SECURITY,
    independentReview: SEE_VENDOR_SECURITY,
    openSource: "No",
    price: {
      text: "Premium: $1.99/month billed annually, or $99.99 lifetime, per Enpass pricing page, October 2026",
      url: "https://www.enpass.io/pricing/",
    },
    freeTier: "Free plan: 25 items in 1 vault",
    sources: [
      { label: "Enpass security", url: "https://www.enpass.io/security/" },
      { label: "Enpass pricing", url: "https://www.enpass.io/pricing/" },
    ],
  },
  {
    name: "KeePass",
    vendor: "Dominik Reichl (open source)",
    encryption: "AES-256, ChaCha20 or Twofish",
    independentReview: "Open source; no vendor cloud",
    openSource: "Yes",
    price: null,
    freeTier: "Free",
    sources: [
      { label: "KeePass official site", url: "https://keepass.info/" },
    ],
  },
  {
    name: "Proton Pass",
    vendor: "Proton AG",
    encryption: SEE_VENDOR_SECURITY,
    independentReview: "Independent third-party audit",
    openSource: "Yes",
    price: {
      text: "Pass Plus: $2.99/month billed $35.88 every 12 months, per Proton Pass pricing page, October 2026",
      url: "https://proton.me/pass/pricing",
    },
    freeTier: "Free plan: unlimited logins, notes, cards and devices",
    sources: [
      { label: "Proton Pass security", url: "https://proton.me/pass/security" },
      { label: "Proton open source and audits", url: "https://proton.me/community/open-source" },
      { label: "Proton Pass pricing", url: "https://proton.me/pass/pricing" },
    ],
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */
export default function PasswordManagerComparisonPage() {
  return (
    <>
      <JsonLd data={[articleSchema]} />

      {/* Gradient Hero */}
      <section aria-labelledby="pm-hero-heading" className="bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-password-manager-comparison-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-password-manager-comparison-hero)"/>
</svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-16 sm:pb-20 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-teal-200 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-teal-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Password Manager Comparison</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 id="pm-hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight">
                Best Password Managers Compared (2026)
              </h1>
              {/* ROO-50: under the title, before the long intro, so the cookie banner cannot cover it. */}
              <SoftPricingLine src="password-manager-comparison" tone="onDark" className="mt-3" />
              <p id="page-intro" className="mt-2 text-teal-100 text-sm sm:text-base leading-relaxed">
                10 leading password managers side by side: encryption, third-party reviews, open-source
                status, free plans and annual-plan prices.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-teal-300 mt-3">
                <span className="font-semibold uppercase tracking-wide text-white">{AI_CONTENT_LABEL}</span>
                <span aria-hidden="true">·</span>
                <span>{AI_DISCLOSURE}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={LAST_UPDATED}>
                  Updated {new Date(LAST_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
                <span aria-hidden="true">·</span>
                <Link href="/password-manager-comparison/methodology" className="text-teal-200 hover:text-white transition-colors">
                  Methodology
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ROO-235: answer-first summary */}
      <section aria-labelledby="pm-answer-heading" className="mb-6">
        <h2 id="pm-answer-heading" className="sr-only">Short answer</h2>
        <p id="pm-answer" className="text-base text-text leading-relaxed">
          Bitwarden has the most generous free plan of the hosted options: unlimited passwords on unlimited
          devices, with Premium at $1.65/month billed annually, per Bitwarden pricing page, October 2026 (
          <a href="https://bitwarden.com/pricing/" rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">See vendor page for current price</a>).
          1Password has no free plan; Individual is $3.99/month billed annually, per 1Password pricing page,
          October 2026 (
          <a href="https://1password.com/pricing/password-manager" rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">See vendor page for current price</a>),
          with a 14-day trial. Proton Pass Free includes unlimited logins and devices. KeePass is free and keeps
          the vault on your own storage. LastPass Free is limited to one device type (computer or mobile).
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Deciding between the two most-picked options?{" "}
          <Link href="/compare/1password-vs-bitwarden" className="text-primary-600 hover:underline font-medium">
            Compare 1Password vs Bitwarden side by side
          </Link>.
        </p>
        <p className="mt-2 text-xs text-text-secondary">
          <strong>Updated Oct 19, 2026:</strong> Bitwarden client license corrected to GPL v3.0; encryption and
          third-party review cells limited to what each vendor publishes; RoboForm Premium price and free plan
          added; the 2FA column was removed.
        </p>
      </section>

      {/* Quick summary */}
      <section aria-labelledby="pm-quick-verdict" className="mb-10 p-5 bg-surface-alt rounded-2xl border border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 id="pm-quick-verdict" className="font-display font-bold text-text">Quick verdict</h2>
        </div>
        <ul className="space-y-1 text-text-secondary text-sm list-disc list-inside">
          <li><strong className="text-text">Paid pick:</strong> 1Password: Secret Key on top of the master password, SOC 2 Type 2, 14-day trial.<sup><a href="#cite-0" className="text-primary-600">[1]</a></sup></li>
          <li><strong className="text-text">Free / open-source pick:</strong> Bitwarden: free plan with unlimited passwords and devices, GPL v3.0 clients, annual third-party audits.<sup><a href="#cite-1" className="text-primary-600">[2]</a></sup></li>
          <li><strong className="text-text">Local-only pick:</strong> KeePass: free, open source, no vendor cloud.<sup><a href="#cite-8" className="text-primary-600">[9]</a></sup></li>
          <li><strong className="text-text">Weigh the history:</strong> LastPass: in 2022 an attacker copied a backup of encrypted customer vault data.<sup><a href="#cite-3" className="text-primary-600">[4]</a></sup></li>
        </ul>
      </section>

      {/* Main comparison table */}
      <section aria-labelledby="pm-comparison-table" className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </div>
          <h2 id="pm-comparison-table" className="text-2xl font-display font-bold text-text">Full comparison table</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Prices are regular individual-plan rates billed annually, October 2026; first-year promotions are excluded.<sup><a href="#cite-pricing-note" className="text-primary-600">[*]</a></sup>{" "}
          Where a vendor shows a price only by region or at checkout, the cell links to the vendor page.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-xl text-sm">
            <caption className="sr-only">Password manager comparison table: encryption, third-party review, open source, price and free plan</caption>
            <thead>
              <tr className="bg-surface-alt">
                {["Product", "Encryption", "Third-party review", "Open Source", "Price", "Free plan"].map((h) => (
                  <th key={h} scope="col" className="text-left p-3 font-semibold text-text border-b border-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PASSWORD_MANAGERS.map((pm, i) => (
                <tr key={pm.name} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="p-3 font-medium text-text whitespace-nowrap">{pm.name}</td>
                  <td className="p-3 text-text-secondary">{pm.encryption}</td>
                  <td className="p-3 text-text-secondary">
                    {pm.independentReview}<sup><a href={`#cite-${i}`} className="text-primary-600">[{i + 1}]</a></sup>
                  </td>
                  <td className="p-3 text-text-secondary">{pm.openSource}</td>
                  <td className="p-3 text-text-secondary">
                    {pm.price ? (
                      <>
                        {pm.price.text}.{" "}
                        <a href={pm.price.url} rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">
                          See vendor page for current price<span className="sr-only"> (opens in new tab)</span>
                        </a>
                      </>
                    ) : (
                      <a href={pm.sources[pm.sources.length - 1].url} rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">
                        See vendor page for current price<span className="sr-only"> (opens in new tab)</span>
                      </a>
                    )}
                  </td>
                  <td className="p-3 text-text-secondary">{pm.freeTier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology link */}
      <section aria-labelledby="pm-methodology" className="mb-12 p-5 border border-border rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 id="pm-methodology" className="font-display font-bold text-text">How we evaluate password managers</h2>
        </div>
        <p className="text-text-secondary text-sm mb-3">
          Our{" "}
          <Link href="/password-manager-comparison/methodology" className="text-primary-600 hover:underline">
            full methodology
          </Link>{" "}
          covers scoring rubrics, source tiers, the recency policy, COI disclosure, and the correction process.
          No vendor paid for placement.
        </p>
        <Link href="/password-manager-comparison/methodology" className="text-sm text-primary-600 hover:underline font-medium">
          Read the methodology <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* Citations */}
      <section aria-labelledby="pm-sources" className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 id="pm-sources" className="text-xl font-display font-bold text-text">Sources</h2>
        </div>
        <ol className="space-y-2 text-sm text-text-secondary">
          {PASSWORD_MANAGERS.map((pm, i) => (
            <li key={pm.name} id={`cite-${i}`}>
              {pm.name} ({pm.vendor}).{" "}
              {pm.sources.map((s, si) => (
                <span key={s.url}>
                  <a href={s.url} rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">{s.label}<span className="sr-only"> (opens in new tab)</span></a>
                  {si < pm.sources.length - 1 ? "; " : ""}
                </span>
              ))}
              {" "}<em>October 2026.</em>
            </li>
          ))}
          <li id="cite-pricing-note">
            <sup>*</sup> Regular annual individual-plan rates in USD from vendor pricing pages, October 19, 2026, excluding first-year promotional discounts. Dashlane, LastPass, Keeper and NordPass show personal-plan prices only by region or at checkout, so no figure is given for them. Prices change without notice.
          </li>
        </ol>
      </section>
    </article>
    </>
  );
}
