import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { CookiePolicyContent } from "./CookiePolicyContent";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Learn how ${SITE_NAME} uses cookies and similar tracking technologies.`,
  alternates: { canonical: `${SITE_URL}/cookie-policy` },
  openGraph: {
    title: `Cookie Policy — ${SITE_NAME}`,
    description: `Learn how ${SITE_NAME} uses cookies.`,
    url: `${SITE_URL}/cookie-policy`,
  },
};

export default function CookiePolicyPage() {
  return <CookiePolicyContent />;
}
