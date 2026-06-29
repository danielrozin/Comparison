import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { PrivacyContent } from "./PrivacyContent";

const PAGE_URL = `${SITE_URL}/privacy`;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Read the ${SITE_NAME} Privacy Policy to understand how we collect, use, and protect your personal information.`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Privacy Policy — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Privacy Policy.`,
    url: PAGE_URL,
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": PAGE_URL,
  name: `Privacy Policy — ${SITE_NAME}`,
  url: PAGE_URL,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© 2026 ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "General Public" },
  accessMode: ["textual"],
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
