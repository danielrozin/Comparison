import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { TermsContent } from "./TermsContent";

const PAGE_URL = `${SITE_URL}/terms`;

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Read the ${SITE_NAME} Terms of Use before accessing our website. Understand your rights and responsibilities as a user.`,
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
  },
  openGraph: {
    title: `Terms of Use — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Terms of Use.`,
    url: PAGE_URL,
    locale: "en_US",
    images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: `Terms of Use — ${SITE_NAME}` }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: `Terms of Use — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Terms of Use before accessing our website.`,
    images: [`${SITE_URL}/images/og-default.png`],
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": PAGE_URL,
  name: `Terms of Use — ${SITE_NAME}`,
  url: PAGE_URL,

  locale: "en_US",  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  creativeWorkStatus: "Published",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().slice(0, 10),
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: PAGE_URL,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: PAGE_URL,
  audience: { "@type": "Audience", audienceType: "General Public", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["readingOrder", "structuralNavigation"],
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
  genre: "Legal",
  abstract: `Legal terms governing access to and use of ${SITE_NAME}, including disclaimers, intellectual property rights, and user responsibilities.`,
  alternativeHeadline: `${SITE_NAME} Terms of Use — Your Rights and Responsibilities`,
  contentReferenceTime: "2024-01-01T00:00:00Z",
  thumbnailUrl: `${SITE_URL}/images/og-default.png`,
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/og-default.png`,
    contentUrl: `${SITE_URL}/images/og-default.png`,
    name: `Terms of Use — ${SITE_NAME}`,
    description: `Terms of Use page for ${SITE_NAME}`,
    width: 1200,
    height: 630,
  },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  hasPart: [{ "@type": "FAQPage", "@id": `${PAGE_URL}#faq` }],
};

const termsFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faq`,
  name: `${SITE_NAME} Terms of Service — Frequently Asked Questions`,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  url: `${PAGE_URL}#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Is A Versus B free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A Versus B is free to use for personal and commercial research. No account or payment is required to access any comparison on the site.",
      },
    },
    {
      "@type": "Question",
      name: "Can I reproduce A Versus B comparison content on my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Short excerpts with a clear attribution link back to aversusb.net are permitted. Reproducing full comparison pages or bulk copying content without permission is prohibited. Contact us at aversusb.net/contact for licensing inquiries.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use A Versus B's embed widget on my site?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our embed widget at aversusb.net/embed is provided free of charge for non-commercial and commercial use, provided the A Versus B attribution link remains visible.",
      },
    },
    {
      "@type": "Question",
      name: "How do I report a Terms of Service violation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Report suspected violations via our contact form at aversusb.net/contact. Include the URL and a description of the issue and we will investigate promptly.",
      },
    },
  ],
};

export default function TermsPage() {
  return (
    <>
      <JsonLd data={[webPageSchema, termsFaqSchema]} />
      <TermsContent />
    </>
  );
}
