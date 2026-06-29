import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { TermsContent } from "./TermsContent";

const PAGE_URL = `${SITE_URL}/terms`;

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Read the ${SITE_NAME} Terms of Use before accessing our website. Understand your rights and responsibilities as a user.`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Terms of Use — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Terms of Use.`,
    url: PAGE_URL,
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": PAGE_URL,
  name: `Terms of Use — ${SITE_NAME}`,
  url: PAGE_URL,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: PAGE_URL,
  copyrightNotice: `© 2026 ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: PAGE_URL,
  audience: { "@type": "Audience", audienceType: "General Public" },
  accessMode: ["textual"],
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd data={webPageSchema} />
      <TermsContent />
    </>
  );
}
