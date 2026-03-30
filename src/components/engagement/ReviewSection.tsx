"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { ReviewForm } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";

const SmartReviewSurvey = dynamic(
  () => import("@/components/surveys/SmartReviewSurvey").then((m) => ({ default: m.SmartReviewSurvey })),
  { ssr: false }
);

export function ReviewSection({
  entitySlug,
  entityName,
}: {
  entitySlug: string;
  entityName: string;
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [surveyTrigger, setSurveyTrigger] = useState<{
    type: "form_submit_success" | "form_abandon";
    role: "reviewer" | "reader";
  } | null>(null);

  const handleSurveyTrigger = useCallback((trigger: "form_submit_success" | "form_abandon") => {
    setSurveyTrigger({ type: trigger, role: "reviewer" });
  }, []);

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-display font-bold text-text mb-6">
        Reviews for {entityName}
      </h2>
      <ReviewForm
        entitySlug={entitySlug}
        entityName={entityName}
        onReviewSubmitted={() => setRefreshKey((k) => k + 1)}
        onSurveyTrigger={handleSurveyTrigger}
      />
      <ReviewsList entitySlug={entitySlug} refreshKey={refreshKey} />

      {surveyTrigger && (
        <SmartReviewSurvey
          triggerType={surveyTrigger.type}
          userRole={surveyTrigger.role}
          entitySlug={entitySlug}
          onClose={() => setSurveyTrigger(null)}
        />
      )}
    </section>
  );
}
