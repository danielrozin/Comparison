import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { CookiePolicyContent } from "./CookiePolicyContent";

const PAGE_URL = `${SITE_URL}/cookie-policy`;
const PAGE_TITLE = `Cookie Policy — ${SITE_NAME}`;
const PAGE_DESC = `Learn how ${SITE_NAME} uses cookies and similar tracking technologies to improve site performance, personalise content, and measure audience.`;
const PAGE_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Cookie Policy")}&type=home`;
const PAGE_TODAY = new Date().toISOString().split("T")[0];

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: PAGE_URL,
    type: "article",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: PAGE_OG_IMAGE, width: 1200, height: 630, alt: `Cookie Policy — ${SITE_NAME}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [PAGE_OG_IMAGE],
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": "Daniel Rozin",
    "citation_journal_title": SITE_NAME,
    "citation_language": "en",
    "citation_abstract": PAGE_DESC,
    "citation_publication_date": "2024-01-01",
    "citation_online_date": PAGE_TODAY,
    "DC.title": PAGE_TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": SITE_NAME,
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.date": PAGE_TODAY,
    "DC.identifier": PAGE_URL,
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  name: PAGE_TITLE,
  description: PAGE_DESC,
  abstract: PAGE_DESC,
  alternativeHeadline: `${SITE_NAME} Cookie & Tracking Technology Policy`,
  url: PAGE_URL,
  genre: "Legal Policy",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  creativeWorkStatus: "Published",
  datePublished: "2024-01-01",
  dateModified: PAGE_TODAY,
  lastReviewed: PAGE_TODAY,
  contentReferenceTime: PAGE_TODAY,
  thumbnailUrl: PAGE_OG_IMAGE,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: PAGE_OG_IMAGE,
    contentUrl: PAGE_OG_IMAGE,
    width: 1200,
    height: 630,
    caption: PAGE_TITLE,
  },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "General Public", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["readingOrder", "structuralNavigation"],
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  breadcrumb: {
    "@type": "BreadcrumbList",
    "@id": `${PAGE_URL}#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, url: SITE_URL } },
      { "@type": "ListItem", position: 2, name: "Cookie Policy", item: { "@type": "WebPage", "@id": PAGE_URL, url: PAGE_URL } },
    ],
  },
};

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd data={webPageSchema} />
      <CookiePolicyContent />
    </>
  );
}
