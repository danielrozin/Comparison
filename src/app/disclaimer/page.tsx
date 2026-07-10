import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { DisclaimerContent } from "./DisclaimerContent";

const PAGE_URL = `${SITE_URL}/disclaimer`;

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Read the ${SITE_NAME} Disclaimer. Understand the limitations of our comparison data, our data sources, and important disclosures.`,
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
  },
  openGraph: {
    title: `Disclaimer — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Disclaimer covering data accuracy, affiliate disclosures, and limitations of liability.`,
    url: PAGE_URL,
    locale: "en_US",
    images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: `Disclaimer — ${SITE_NAME}` }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: `Disclaimer — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Disclaimer covering data accuracy, affiliate disclosures, and limitations of liability.`,
    images: [`${SITE_URL}/images/og-default.png`],
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": PAGE_URL,
  name: `Disclaimer — ${SITE_NAME}`,
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
  abstract: `Disclaimer covering data accuracy, affiliate disclosures, editorial standards, and limitations of liability for ${SITE_NAME} comparison content.`,
  alternativeHeadline: `${SITE_NAME} Disclaimer — Data Accuracy, Affiliate Disclosures & Liability`,
  contentReferenceTime: "2024-01-01T00:00:00Z",
  thumbnailUrl: `${SITE_URL}/images/og-default.png`,
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/og-default.png`,
    contentUrl: `${SITE_URL}/images/og-default.png`,
    name: `Disclaimer — ${SITE_NAME}`,
    description: `Disclaimer page for ${SITE_NAME}`,
    width: 1200,
    height: 630,
  },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
};

export default function DisclaimerPage() {
  return (
    <>
      <JsonLd data={webPageSchema} />
      <DisclaimerContent />
    </>
  );
}
