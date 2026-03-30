import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { PrivacyContent } from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Read the ${SITE_NAME} Privacy Policy to understand how we collect, use, and protect your personal information.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: `Privacy Policy — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Privacy Policy.`,
    url: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
