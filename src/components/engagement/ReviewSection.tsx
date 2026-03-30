"use client";

import { useState } from "react";
import { ReviewForm } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";

export function ReviewSection({
  entitySlug,
  entityName,
}: {
  entitySlug: string;
  entityName: string;
}) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-display font-bold text-text mb-6">
        Reviews for {entityName}
      </h2>
      <ReviewForm
        entitySlug={entitySlug}
        entityName={entityName}
        onReviewSubmitted={() => setRefreshKey((k) => k + 1)}
      />
      <ReviewsList entitySlug={entitySlug} refreshKey={refreshKey} />
    </section>
  );
}
