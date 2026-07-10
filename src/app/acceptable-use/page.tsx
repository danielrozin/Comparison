import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { AcceptableUseContent } from "./AcceptableUseContent";

const AUP_TITLE = `Acceptable Use Policy — ${SITE_NAME}`;
const AUP_DESC = `Read the ${SITE_NAME} Acceptable Use Policy. Understand the rules for using our platform responsibly, including permitted uses, prohibited conduct, and enforcement.`;
const AUP_URL = `${SITE_URL}/acceptable-use`;
const AUP_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Acceptable Use Policy")}&type=home`;
const AUP_TODAY = new Date().toISOString().split("T")[0];

export const metadata: Metadata = {
  title: AUP_TITLE,
  description: AUP_DESC,
  alternates: {
    canonical: AUP_URL,
    languages: { "en": AUP_URL, "x-default": AUP_URL },
  },
  openGraph: {
    title: AUP_TITLE,
    description: AUP_DESC,
    url: AUP_URL,
    type: "article",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: AUP_OG_IMAGE, width: 1200, height: 630, alt: AUP_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: AUP_TITLE,
    description: AUP_DESC,
    images: [AUP_OG_IMAGE],
  },
  other: {
    "citation_title": AUP_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": SITE_NAME,
    "citation_language": "en",
    "citation_abstract": AUP_DESC,
    "citation_publication_date": "2024-01-01",
    "citation_online_date": AUP_TODAY,
    "DC.title": AUP_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": SITE_NAME,
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.date": AUP_TODAY,
    "DC.identifier": AUP_URL,
  },
};

const aupSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${AUP_URL}#webpage`,
  name: AUP_TITLE,
  description: AUP_DESC,
  abstract: AUP_DESC,
  alternativeHeadline: `${SITE_NAME} Platform Rules — What You Can and Cannot Do`,
  url: AUP_URL,
  genre: "Legal Policy",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  creativeWorkStatus: "Published",
  datePublished: "2024-01-01",
  dateModified: AUP_TODAY,
  lastReviewed: AUP_TODAY,
  contentReferenceTime: AUP_TODAY,
  thumbnailUrl: AUP_OG_IMAGE,
  image: {
    "@type": "ImageObject",
    "@id": `${AUP_URL}#primaryImage`,
    url: AUP_OG_IMAGE,
    contentUrl: AUP_OG_IMAGE,
    width: 1200,
    height: 630,
    caption: AUP_TITLE,
  },
  interactivityType: "expositive",
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["readingOrder", "structuralNavigation"],
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  potentialAction: { "@type": "ReadAction", target: AUP_URL },
  breadcrumb: {
    "@type": "BreadcrumbList",
    "@id": `${AUP_URL}#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
      { "@type": "ListItem", position: 2, name: "Acceptable Use Policy", item: { "@type": "WebPage", "@id": AUP_URL, name: "Acceptable Use Policy", url: AUP_URL } },
    ],
  },
};

export default function AcceptableUsePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aupSchema) }}
      />
      <AcceptableUseContent />
    </>
  );
}
