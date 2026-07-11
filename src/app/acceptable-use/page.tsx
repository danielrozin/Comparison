import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
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
    "citation_author": "Daniel Rozin",
    "citation_journal_title": SITE_NAME,
    "citation_language": "en",
    "citation_abstract": AUP_DESC,
    "citation_publication_date": "2024-01-01",
    "citation_online_date": AUP_TODAY,
    "DC.title": AUP_TITLE,
    "DC.creator": "Daniel Rozin",
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
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  potentialAction: { "@type": "ReadAction", target: AUP_URL },
  hasPart: { "@type": "FAQPage", "@id": `${AUP_URL}#faq` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    "@id": `${AUP_URL}#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
      { "@type": "ListItem", position: 2, name: "Acceptable Use Policy", item: { "@type": "WebPage", "@id": AUP_URL, name: "Acceptable Use Policy", url: AUP_URL } },
    ],
  },
};

const aupFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${AUP_URL}#faq`,
  name: `Acceptable Use Policy FAQ — ${SITE_NAME}`,
  url: AUP_URL,
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I copy or republish comparisons from A Versus B?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Short excerpts may be shared with attribution and a link back to the original page. Reproducing full comparison pages, bulk scraping, or systematic copying for redistribution is prohibited under our Acceptable Use Policy.",
      },
    },
    {
      "@type": "Question",
      name: "Is it allowed to use A Versus B data for commercial purposes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Personal and educational use is free. Commercial use — including incorporating our structured data into products, datasets, or AI training sets — requires a written licence agreement. Contact us to discuss licensing terms.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I violate the Acceptable Use Policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Violations may result in suspension of access, blocking of your IP range, or legal action for damages. We reserve the right to enforce these rules at our discretion and without prior notice.",
      },
    },
    {
      "@type": "Question",
      name: "Are bots and automated scrapers allowed on A Versus B?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Legitimate search engine crawlers and AI training crawlers that respect our robots.txt are welcome. High-frequency scraping, credential stuffing, or any bot activity that degrades site performance is prohibited.",
      },
    },
  ],
};

export default function AcceptableUsePage() {
  return (
    <>
      <JsonLd data={aupSchema} />
      <JsonLd data={aupFaqSchema} />
      <AcceptableUseContent />
    </>
  );
}
