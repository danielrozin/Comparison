"use client";

import { useEffect, useRef } from "react";
import { trackConversionFunnel } from "@/lib/utils/analytics";

export function ConversionFunnelTracker({
  slug,
  category,
}: {
  slug: string;
  category: string;
}) {
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const page = `/compare/${slug}`;

    // Step 1: Page view
    if (!firedRef.current.has("page_view")) {
      firedRef.current.add("page_view");
      trackConversionFunnel("page_view", page, { category });
    }

    // Step 2: Scroll depth tracking
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      if (scrollPercent >= 25 && !firedRef.current.has("scroll_depth_25")) {
        firedRef.current.add("scroll_depth_25");
        trackConversionFunnel("scroll_depth_25", page, { category });
      }

      if (scrollPercent >= 50 && !firedRef.current.has("scroll_depth_50")) {
        firedRef.current.add("scroll_depth_50");
        trackConversionFunnel("scroll_depth_50", page, { category });
      }

      if (scrollPercent >= 75 && !firedRef.current.has("scroll_depth_75")) {
        firedRef.current.add("scroll_depth_75");
        trackConversionFunnel("scroll_depth_75", page, { category });
      }

      if (scrollPercent >= 90 && !firedRef.current.has("scroll_depth_100")) {
        firedRef.current.add("scroll_depth_100");
        trackConversionFunnel("scroll_depth_100", page, { category });
      }
    };

    // Step 3: Engagement (30s+ on page)
    const engagementTimer = setTimeout(() => {
      if (!firedRef.current.has("engagement")) {
        firedRef.current.add("engagement");
        trackConversionFunnel("engagement", page, { category });
      }
    }, 30000);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(engagementTimer);
    };
  }, [slug, category]);

  return null;
}
