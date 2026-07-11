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
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
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
  hasPart: [{ "@type": "FAQPage", "@id": `${PAGE_URL}#faq` }],
};

const privacyFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faq`,
  name: `${SITE_NAME} Privacy Policy — Frequently Asked Questions`,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  url: `${PAGE_URL}#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "What personal data does A Versus B collect?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Versus B collects minimal data: anonymous usage analytics (page views, device type, country), email addresses only when you voluntarily subscribe to our newsletter, and comparison vote data stored without personally identifiable information.",
      },
    },
    {
      "@type": "Question",
      name: "Does A Versus B use cookies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We use essential cookies for site functionality and optional analytics cookies (with your consent) to understand how visitors use the site. You can manage your cookie preferences at any time via the cookie settings on our site.",
      },
    },
    {
      "@type": "Question",
      name: "Does A Versus B sell or share personal data with third parties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. A Versus B does not sell personal data. We share anonymized analytics data with our analytics provider (Plausible Analytics) only. We do not share personal information with advertisers.",
      },
    },
    {
      "@type": "Question",
      name: "How can I request deletion of my data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Email us via the contact form at aversusb.net/contact with your deletion request. We will process it within 30 days in accordance with GDPR and CCPA requirements.",
      },
    },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={[webPageSchema, privacyFaqSchema]} />
      <PrivacyContent />
    </>
  );
}
