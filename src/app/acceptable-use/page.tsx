import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { AcceptableUseContent } from "./AcceptableUseContent";

const AUP_TITLE = `Acceptable Use Policy — ${SITE_NAME}`;
const AUP_DESC = `Read the ${SITE_NAME} Acceptable Use Policy. Understand the rules for using our platform responsibly, including permitted uses, prohibited conduct, and enforcement.`;
const AUP_URL = `${SITE_URL}/acceptable-use`;

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
  },
  other: {
    "citation_title": AUP_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": AUP_DESC,
    "citation_publication_date": "2024-01-01",
    "citation_online_date": "2024-01-01",
    "DC.title": AUP_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.date": "2024-01-01",
    "DC.identifier": AUP_URL,
  },
};

const aupSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${AUP_URL}#webpage`,
  name: AUP_TITLE,
  description: AUP_DESC,
  url: AUP_URL,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  creativeWorkStatus: "Published",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().slice(0, 10),
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
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Acceptable Use Policy", item: AUP_URL },
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
