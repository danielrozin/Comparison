import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { TermsContent } from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Read the ${SITE_NAME} Terms of Use before accessing our website. Understand your rights and responsibilities as a user.`,
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: `Terms of Use — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Terms of Use.`,
    url: `${SITE_URL}/terms`,
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
