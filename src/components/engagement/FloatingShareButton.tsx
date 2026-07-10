"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/utils/constants";
import { trackShareClick } from "@/lib/utils/analytics";

interface Props {
  title: string;
  slug: string;
  path?: string;
}

export function FloatingShareButton({ title, slug, path = "compare" }: Props) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/${path}/${slug}`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        trackShareClick("native_share", slug);
        return;
      } catch {
        // User cancelled or API not supported — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    trackShareClick("copy_link", slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      aria-label={copied ? "Link copied!" : "Share this comparison"}
      className={[
        "fixed bottom-20 right-4 z-40",
        "sm:hidden",
        "flex items-center justify-center gap-2",
        "h-12 rounded-full px-4",
        "shadow-lg shadow-primary-900/30",
        "transition-all duration-200",
        copied
          ? "bg-emerald-500 text-white pl-4 pr-5"
          : "bg-primary-600 hover:bg-primary-700 active:scale-95 text-white",
      ].join(" ")}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-semibold">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="text-sm font-semibold">Share</span>
        </>
      )}
    </button>
  );
}
