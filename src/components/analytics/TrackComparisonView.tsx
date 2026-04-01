"use client";

import { useEffect } from "react";
import { trackComparisonView } from "@/lib/utils/analytics";

export function TrackComparisonView({
  slug,
  entityA,
  entityB,
  category,
}: {
  slug: string;
  entityA: string;
  entityB: string;
  category: string;
}) {
  useEffect(() => {
    trackComparisonView(slug, category);
  }, [slug, entityA, entityB, category]);

  return null;
}
