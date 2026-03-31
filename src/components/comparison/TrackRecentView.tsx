"use client";

import { useEffect } from "react";
import { addRecentlyViewed } from "@/lib/utils/recently-viewed";

export function TrackRecentView({
  slug,
  title,
  category,
}: {
  slug: string;
  title: string;
  category: string;
}) {
  useEffect(() => {
    addRecentlyViewed({ slug, title, category });
  }, [slug, title, category]);

  return null;
}
