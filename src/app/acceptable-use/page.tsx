import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { AcceptableUseContent } from "./AcceptableUseContent";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: `Read the ${SITE_NAME} Acceptable Use Policy. Understand the rules for using our platform responsibly.`,
  alternates: { canonical: `${SITE_URL}/acceptable-use` },
  openGraph: {
    title: `Acceptable Use Policy — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Acceptable Use Policy.`,
    url: `${SITE_URL}/acceptable-use`,
  },
};

export default function AcceptableUsePage() {
  return <AcceptableUseContent />;
}
