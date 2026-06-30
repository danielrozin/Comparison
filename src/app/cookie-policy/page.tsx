import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { CookiePolicyContent } from "./CookiePolicyContent";

const PAGE_URL = `${SITE_URL}/cookie-policy`;

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Learn how ${SITE_NAME} uses cookies and similar tracking technologies.`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Cookie Policy — ${SITE_NAME}`,
    description: `Learn how ${SITE_NAME} uses cookies.`,
    url: PAGE_URL,
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": PAGE_URL,
  name: `Cookie Policy — ${SITE_NAME}`,
  url: PAGE_URL,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "General Public" },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["readingOrder", "structuralNavigation"],
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
};

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd data={webPageSchema} />
      <CookiePolicyContent />
    </>
  );
}
