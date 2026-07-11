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
  hasPart: [{ "@type": "FAQPage", "@id": `${PAGE_URL}#faq` }],
};

const disclaimerFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faq`,
  name: `${SITE_NAME} Disclaimer — Frequently Asked Questions`,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  url: `${PAGE_URL}#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the comparison data on A Versus B accurate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We strive for accuracy across all comparisons. Data is sourced from official manufacturers, publishers, and reputable third-party databases. However, specifications and prices change frequently — always verify with the official source before making a purchase decision.",
      },
    },
    {
      "@type": "Question",
      name: "Does A Versus B earn commissions from affiliate links?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Some comparison pages contain affiliate links. When you click an affiliate link and make a purchase, A Versus B may earn a small commission at no extra cost to you. Affiliate relationships do not influence our comparison verdicts or rankings.",
      },
    },
    {
      "@type": "Question",
      name: "Is A Versus B responsible for decisions made based on its comparisons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. A Versus B provides comparison content for informational purposes only. We are not liable for any decisions, purchases, or outcomes based on our data. Always consult the official product source and relevant professionals before making significant decisions.",
      },
    },
    {
      "@type": "Question",
      name: "How do I report inaccurate or outdated comparison data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the contact form at aversusb.net/contact to report errors. We review and update flagged comparisons as quickly as possible.",
      },
    },
  ],
};

export default function DisclaimerPage() {
  return (
    <>
      <JsonLd data={[webPageSchema, disclaimerFaqSchema]} />
      <DisclaimerContent />
    </>
  );
}
