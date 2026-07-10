import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_URL = `${SITE_URL}/password-manager-comparison`;
const PAGE_TITLE = `Best Password Managers Compared (2026) | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Independent comparison of the top 10 password managers in 2026 — encryption, zero-knowledge architecture, independent audits, pricing, and platform support. All data cited to primary sources.";
const LAST_UPDATED = "2026-05-22";
const PM_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Best Password Managers Compared 2026")}&type=trending`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
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
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": PAGE_TITLE,
    "DC.creator": "A Versus B",
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
  datePublished: "2026-05-22",
  dateModified: LAST_UPDATED,
  lastReviewed: LAST_UPDATED,
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
  educationalLevel: "General",
  teaches: "How to choose the best password manager for security, usability, and price",
  educationalUse: "comparison",
  alternativeHeadline: "Best Password Managers in 2026 — Security, Price & Feature Comparison",
  author: { "@type": "Person", "@id": `${SITE_URL}/authors/daniel-rozin#person`, name: "Daniel Rozin", url: `${SITE_URL}/authors/daniel-rozin` },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  keywords: "password manager comparison, best password managers, 1Password vs Bitwarden, Dashlane, LastPass 2026",
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro"] },
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

const productSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "1Password",
    url: "https://1password.com",
    brand: { "@type": "Brand", name: "AgileBits" },
    offers: { "@type": "Offer", price: "35.88", priceCurrency: "USD", priceValidUntil: "2026-12-31", url: "https://1password.com/sign-up/" },
    description: "Zero-knowledge password manager with AES-256 encryption, SOC 2 Type 2 certified, multiple independent audits.",
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Bitwarden",
    url: "https://bitwarden.com",
    brand: { "@type": "Brand", name: "Bitwarden Inc." },
    offers: { "@type": "Offer", price: "10.00", priceCurrency: "USD", priceValidUntil: "2026-12-31", url: "https://bitwarden.com/pricing/" },
    description: "Open-source zero-knowledge password manager with AES-256 encryption. Free tier available. Audited by Cure53.",
  },
];

/* ── Data ───────────────────────────────────────────────────────────────── */
type PM = {
  name: string;
  vendor: string;
  encryption: string;
  zeroKnowledge: boolean;
  auditFirm: string;
  auditYear: number | string;
  openSource: boolean;
  pricingPerYr: string;
  freeTier: string;
  twoFA: string;
  sources: { label: string; url: string }[];
};

const PASSWORD_MANAGERS: PM[] = [
  {
    name: "1Password",
    vendor: "AgileBits",
    encryption: "AES-256-GCM + PBKDF2",
    zeroKnowledge: true,
    auditFirm: "Cure53, Bugcrowd",
    auditYear: 2024,
    openSource: false,
    pricingPerYr: "$35.88",
    freeTier: "No free tier",
    twoFA: "TOTP, Duo, hardware keys",
    sources: [
      { label: "1Password security model", url: "https://1password.com/security/" },
      { label: "1Password audit reports", url: "https://support.1password.com/security-assessments/" },
      { label: "1Password pricing", url: "https://1password.com/sign-up/" },
    ],
  },
  {
    name: "Bitwarden",
    vendor: "Bitwarden Inc.",
    encryption: "AES-256-CBC + PBKDF2/Argon2",
    zeroKnowledge: true,
    auditFirm: "Cure53",
    auditYear: 2023,
    openSource: true,
    pricingPerYr: "$10.00",
    freeTier: "Unlimited items, 1 device type",
    twoFA: "TOTP, YubiKey, Duo, FIDO2",
    sources: [
      { label: "Bitwarden security whitepaper", url: "https://bitwarden.com/help/bitwarden-security-white-paper/" },
      { label: "Bitwarden Cure53 audit 2023", url: "https://bitwarden.com/images/resources/security-audit-report-2023.pdf" },
      { label: "Bitwarden pricing", url: "https://bitwarden.com/pricing/" },
    ],
  },
  {
    name: "Dashlane",
    vendor: "Dashlane SAS",
    encryption: "AES-256-CBC + Argon2",
    zeroKnowledge: true,
    auditFirm: "Cure53",
    auditYear: 2023,
    openSource: false,
    pricingPerYr: "$59.99",
    freeTier: "1 device, unlimited items",
    twoFA: "TOTP, U2F, Duo",
    sources: [
      { label: "Dashlane security architecture", url: "https://support.dashlane.com/hc/en-us/articles/202625042" },
      { label: "Dashlane pricing", url: "https://www.dashlane.com/pricing" },
    ],
  },
  {
    name: "LastPass",
    vendor: "GoTo Technologies",
    encryption: "AES-256-CBC + PBKDF2",
    zeroKnowledge: true,
    auditFirm: "Cure53 (2022, pre-breach)",
    auditYear: "2022",
    openSource: false,
    pricingPerYr: "$36.00",
    freeTier: "1 device type only",
    twoFA: "TOTP, YubiKey, Duo",
    sources: [
      { label: "LastPass security incident notice (2022)", url: "https://blog.lastpass.com/2022/12/notice-of-recent-security-incident/" },
      { label: "LastPass pricing", url: "https://www.lastpass.com/pricing" },
    ],
  },
  {
    name: "Keeper",
    vendor: "Keeper Security",
    encryption: "AES-256-GCM + PBKDF2",
    zeroKnowledge: true,
    auditFirm: "SOC 2 Type 2 (annual)",
    auditYear: 2024,
    openSource: false,
    pricingPerYr: "$34.99",
    freeTier: "No free tier (30-day trial)",
    twoFA: "TOTP, YubiKey, DUO, RSA",
    sources: [
      { label: "Keeper security documentation", url: "https://docs.keeper.io/en/enterprise-guide/overview/security" },
      { label: "Keeper pricing", url: "https://www.keepersecurity.com/pricing.html" },
    ],
  },
  {
    name: "NordPass",
    vendor: "Nord Security",
    encryption: "XChaCha20 + Argon2",
    zeroKnowledge: true,
    auditFirm: "Cure53",
    auditYear: 2023,
    openSource: false,
    pricingPerYr: "$35.88",
    freeTier: "Unlimited items, 1 active session",
    twoFA: "TOTP, hardware keys",
    sources: [
      { label: "NordPass security", url: "https://nordpass.com/security/" },
      { label: "NordPass pricing", url: "https://nordpass.com/pricing/" },
    ],
  },
  {
    name: "RoboForm",
    vendor: "Siber Systems",
    encryption: "AES-256-CBC + PBKDF2",
    zeroKnowledge: true,
    auditFirm: "Secfault Security",
    auditYear: 2023,
    openSource: false,
    pricingPerYr: "$23.88",
    freeTier: "1 device, unlimited items",
    twoFA: "TOTP, SMS (fallback), Microsoft/Google Authenticator",
    sources: [
      { label: "RoboForm security overview", url: "https://www.roboform.com/security" },
      { label: "RoboForm pricing", url: "https://www.roboform.com/buy" },
    ],
  },
  {
    name: "Enpass",
    vendor: "Sinew Software",
    encryption: "AES-256-CBC + SQLCipher",
    zeroKnowledge: true,
    auditFirm: "Cure53",
    auditYear: 2023,
    openSource: false,
    pricingPerYr: "$19.99",
    freeTier: "25 items, desktop only",
    twoFA: "TOTP, Authy",
    sources: [
      { label: "Enpass security", url: "https://www.enpass.io/security/" },
      { label: "Enpass pricing", url: "https://www.enpass.io/pricing/" },
    ],
  },
  {
    name: "KeePass",
    vendor: "Dominik Reichl (open source)",
    encryption: "AES-256 / ChaCha20 + Argon2",
    zeroKnowledge: true,
    auditFirm: "European Commission (audit 2016)",
    auditYear: "2016",
    openSource: true,
    pricingPerYr: "Free",
    freeTier: "Full features, self-hosted",
    twoFA: "Key file + master password; plugins for TOTP",
    sources: [
      { label: "KeePass official site", url: "https://keepass.info/" },
      { label: "EU-FOSSA KeePass audit report (2016)", url: "https://joinup.ec.europa.eu/collection/eu-fossa/news/keepass-audit-results" },
    ],
  },
  {
    name: "ProtonPass",
    vendor: "Proton AG",
    encryption: "AES-256-GCM + bcrypt/Argon2",
    zeroKnowledge: true,
    auditFirm: "Cure53",
    auditYear: 2023,
    openSource: true,
    pricingPerYr: "$23.88",
    freeTier: "Unlimited logins, 2 vaults",
    twoFA: "TOTP, Proton 2FA",
    sources: [
      { label: "ProtonPass security details", url: "https://proton.me/pass/security" },
      { label: "ProtonPass Cure53 audit 2023", url: "https://proton.me/blog/proton-pass-security-audit" },
      { label: "ProtonPass pricing", url: "https://proton.me/pass/pricing" },
    ],
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */
export default function PasswordManagerComparisonPage() {
  return (
    <>
      <JsonLd data={[articleSchema, ...productSchemas]} />

      {/* Gradient Hero */}
      <section aria-labelledby="pm-hero-heading" className="bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
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
              <p id="page-intro" className="mt-2 text-teal-100 text-sm sm:text-base leading-relaxed">
                An independent, citation-backed comparison of 10 leading password managers — encryption,
                zero-knowledge architecture, third-party audits, pricing, and platform support.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-teal-300 mt-3">
                <span>
                  By{" "}
                  <Link href="/authors/daniel-rozin" className="text-white hover:underline font-medium">
                    Daniel Rozin
                  </Link>
                  , Founder &amp; Editor-in-Chief
                </span>
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
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
          <li><strong className="text-text">Best overall:</strong> 1Password — strongest audit record, polished apps, reasonable price.</li>
          <li><strong className="text-text">Best free / open-source:</strong> Bitwarden — full-featured free tier, MIT-licensed, Cure53 audited.</li>
          <li><strong className="text-text">Best self-hosted:</strong> KeePass — zero cloud dependency, EU-FOSSA audited, free.</li>
          <li><strong className="text-text">Avoid if security is paramount:</strong> LastPass — 2022 breach exposed encrypted vaults.<sup><a href="#cite-4" className="text-primary-600">[4]</a></sup></li>
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
          Pricing figures are individual annual plans as of May 2026.<sup><a href="#cite-pricing-note" className="text-primary-600">[*]</a></sup>{" "}
          All products use zero-knowledge architecture — the vendor cannot access your plaintext vault.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-xl text-sm">
            <caption className="sr-only">Password manager comparison table — encryption, audit, open source, pricing, and 2FA methods</caption>
            <thead>
              <tr className="bg-surface-alt">
                {["Product", "Encryption", "Latest Audit", "Open Source", "Price/yr", "Free Tier", "2FA Methods"].map((h) => (
                  <th key={h} scope="col" className="text-left p-3 font-semibold text-text border-b border-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PASSWORD_MANAGERS.map((pm, i) => (
                <tr key={pm.name} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="p-3 font-medium text-text whitespace-nowrap">{pm.name}</td>
                  <td className="p-3 text-text-secondary">{pm.encryption}</td>
                  <td className="p-3 text-text-secondary whitespace-nowrap">
                    {pm.auditFirm} ({pm.auditYear})<sup><a href={`#cite-${i}`} className="text-primary-600">[{i + 1}]</a></sup>
                  </td>
                  <td className="p-3 text-text-secondary">{pm.openSource ? "✓ Yes" : "No"}</td>
                  <td className="p-3 text-text-secondary whitespace-nowrap">{pm.pricingPerYr}<sup><a href={`#cite-${i}`} className="text-primary-600">[{i + 1}]</a></sup></td>
                  <td className="p-3 text-text-secondary">{pm.freeTier}</td>
                  <td className="p-3 text-text-secondary">{pm.twoFA}</td>
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
          No vendor paid to appear in or influence this guide.
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
              {" "}<em>Accessed May 2026.</em>
            </li>
          ))}
          <li id="cite-pricing-note">
            <sup>*</sup> Prices are listed annual individual plan rates in USD as published on vendor pricing pages, accessed May 2026. Prices may vary by region and change without notice.
          </li>
        </ol>
      </section>
    </article>
    </>
  );
}
