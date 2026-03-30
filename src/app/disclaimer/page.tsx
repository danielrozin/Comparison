import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { DisclaimerContent } from "./DisclaimerContent";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Read the ${SITE_NAME} Disclaimer. Understand the limitations of our comparison data, our data sources, and important disclosures.`,
  alternates: { canonical: `${SITE_URL}/disclaimer` },
  openGraph: {
    title: `Disclaimer — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Disclaimer covering data accuracy, affiliate disclosures, and limitations of liability.`,
    url: `${SITE_URL}/disclaimer`,
  },
};

export default function DisclaimerPage() {
  return <DisclaimerContent />;
}
