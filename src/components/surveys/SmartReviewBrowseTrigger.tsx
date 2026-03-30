"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { trackReviewPageView } from "./SmartReviewSurvey";

const SmartReviewSurvey = dynamic(
  () => import("./SmartReviewSurvey").then((m) => ({ default: m.SmartReviewSurvey })),
  { ssr: false }
);

export function SmartReviewBrowseTrigger({ entitySlug }: { entitySlug: string }) {
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    const shouldShow = trackReviewPageView();
    if (shouldShow) {
      setShowSurvey(true);
    }
  }, []);

  if (!showSurvey) return null;

  return (
    <SmartReviewSurvey
      triggerType="browse_5_pages"
      userRole="reader"
      entitySlug={entitySlug}
      onClose={() => setShowSurvey(false)}
    />
  );
}
