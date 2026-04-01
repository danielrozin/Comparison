import type { Metadata } from "next";
import { SITE_URL } from "@/lib/utils/constants";
import { SurveyForm } from "./survey-form";

export const metadata: Metadata = {
  title: "Help Shape SmartReview — 3 Minute Survey",
  description:
    "Your feedback directly shapes what we build next. Takes about 3 minutes. All responses are anonymous.",
  alternates: { canonical: `${SITE_URL}/survey` },
  robots: { index: false, follow: false },
};

export default function SurveyPage() {
  return <SurveyForm />;
}
