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

// AdSense rejects fluid responsive slots narrower than this and throws a
// TagError, which leaves the slot empty. Wait for a measurable width first.
const MIN_AD_WIDTH = 250;

export function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!PUBLISHER_ID) return;
    const el = adRef.current;
    if (!el) return;

    // Only push once the <ins> is attached and wide enough. push({}) is
    // untargeted, so pushing before layout can bind to a zero-width slot.
    const tryPush = () => {
      if (pushed.current) return true;
      if (el.offsetWidth < MIN_AD_WIDTH) return false;
      pushed.current = true;
      try {
        ((window as unknown as Record<string, unknown[]>).adsbygoogle =
          (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded or blocked
      }
      return true;
    };

    if (tryPush()) return;
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      if (tryPush()) observer.disconnect();
    });
    observer.observe(el);
    return () => observer.disconnect();
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
    <div className="my-8 max-w-5xl mx-auto px-4 min-h-[90px]">
      <AdUnit
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT || ""}
        format="fluid"
      />
    </div>
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
