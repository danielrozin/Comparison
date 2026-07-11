import type { Metadata } from "next";
import { SITE_URL } from "@/lib/utils/constants";
import { UxStudyForm } from "./ux-study-form";

export const metadata: Metadata = {
  title: "Get $25 for a 30-Minute Usability Study",
  description:
    "Help us improve A Versus B. Join a paid 30-minute usability study and earn a $25 Amazon gift card. Sign up in under a minute.",
  alternates: {
    canonical: `${SITE_URL}/ux-study`,
    languages: { "en": `${SITE_URL}/ux-study`, "x-default": `${SITE_URL}/ux-study` },
  },
  // Recruitment landing — no SEO value, keep it out of the index.
  robots: { index: false, follow: false },
};

export default function UxStudyPage() {
  return <UxStudyForm />;
}
