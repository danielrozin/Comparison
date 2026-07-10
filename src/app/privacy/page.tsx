import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { PrivacyContent } from "./PrivacyContent";

const PAGE_URL = `${SITE_URL}/privacy`;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Read the ${SITE_NAME} Privacy Policy to understand how we collect, use, and protect your personal information.`,
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
  },
  openGraph: {
    title: `Privacy Policy — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Privacy Policy.`,
    url: PAGE_URL,
    locale: "en_US",
    images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: `Privacy Policy — ${SITE_NAME}` }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: `Privacy Policy — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Privacy Policy to understand how we collect, use, and protect your personal information.`,
    images: [`${SITE_URL}/images/og-default.png`],
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": PAGE_URL,
  name: `Privacy Policy — ${SITE_NAME}`,
  url: PAGE_URL,

  locale: "en_US",  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  creativeWorkStatus: "Published",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().slice(0, 10),
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "General Public", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["readingOrder", "structuralNavigation"],
  genre: "Legal",
  abstract: `Privacy Policy explaining how ${SITE_NAME} collects, uses, stores, and protects personal information from users of the comparison platform.`,
  alternativeHeadline: `${SITE_NAME} Privacy Policy — How We Handle Your Data`,
  contentReferenceTime: "2024-01-01T00:00:00Z",
  thumbnailUrl: `${SITE_URL}/images/og-default.png`,
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/og-default.png`,
    contentUrl: `${SITE_URL}/images/og-default.png`,
    name: `Privacy Policy — ${SITE_NAME}`,
    description: `Privacy Policy page for ${SITE_NAME}`,
    width: 1200,
    height: 630,
  },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={webPageSchema} />
      <PrivacyContent />
    </>
  );
}
