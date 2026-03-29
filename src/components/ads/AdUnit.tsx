"use client";

import { useEffect, useRef } from "react";

type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  responsive?: boolean;
  className?: string;
}

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

export function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!PUBLISHER_ID || pushed.current) return;
    try {
      ((window as unknown as Record<string, unknown[]>).adsbygoogle =
        (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded or blocked
    }
  }, []);

  if (!PUBLISHER_ID) return null;

  return (
    <div className={`ad-container text-center overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={`ca-${PUBLISHER_ID}`}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}

/** Sidebar ad for comparison pages */
export function SidebarAd() {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || ""}
      format="rectangle"
      className="my-6"
    />
  );
}

/** In-content ad for between sections */
export function InContentAd() {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT || ""}
      format="fluid"
      className="my-8 max-w-5xl mx-auto px-4"
    />
  );
}

/** Sticky footer ad */
export function StickyFooterAd() {
  const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  if (!PUBLISHER_ID) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-border shadow-lg">
      <div className="max-w-4xl mx-auto py-1">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || ""}
          format="horizontal"
          className=""
        />
      </div>
    </div>
  );
}
