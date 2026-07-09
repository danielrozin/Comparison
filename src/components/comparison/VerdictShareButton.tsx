"use client";

import { useState, useCallback } from "react";

export function VerdictShareButton({
  title,
  winnerName,
}: {
  title: string;
  winnerName?: string | null;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }, []);

  const tweetText = winnerName
    ? `🏆 ${winnerName} wins in "${title}" — see the full comparison:`
    : `${title} — side-by-side comparison:`;

  const tweetHref = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : ""
  )}`;

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Link copied!" : "Copy link to share this comparison"}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
          copied
            ? "bg-emerald-500/25 border-emerald-400/50 text-emerald-300"
            : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
        }`}
      >
        {copied ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
      </button>

      <a
        href={tweetHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share verdict on X (Twitter)"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 5.895L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
        <span className="hidden sm:inline">Share</span>
      </a>
    </div>
  );
}
