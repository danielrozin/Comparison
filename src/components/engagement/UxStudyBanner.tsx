"use client";

// DAN-1980 — In-site UX study recruitment banner.
// Recruits n=5 participants for a 30-min paid ($25 gift card) usability study,
// as the working alternative to the orphan-blocked Reddit path (DAN-1969).
//
// Behaviour (per ticket):
//  - Dismissible top bar; dismissal persisted in localStorage `ux_study_banner_dismissed`.
//  - Shown to 50% of visitors; the coin-flip is stored per-session so the same
//    visitor gets a stable decision, and the impression is tracked at most once
//    per session (`ux_study_banner_bucket` / `ux_study_banner_shown`).
//  - Killable without a deploy via NEXT_PUBLIC_UX_STUDY_BANNER=off (kill switch
//    for once n=5 is reached or the 7-day window closes).
//  - Form URL is env-overridable via NEXT_PUBLIC_UX_STUDY_FORM_URL so the real
//    Google Form can be wired in without a code change.

import { useEffect, useState } from "react";
import {
  trackUxStudyBannerShown,
  trackUxStudyBannerClick,
  trackUxStudyBannerDismiss,
} from "@/lib/utils/analytics";

const DISMISS_KEY = "ux_study_banner_dismissed";
const BUCKET_KEY = "ux_study_banner_bucket"; // sessionStorage: "in" | "out"
const SHOWN_KEY = "ux_study_banner_shown"; // sessionStorage: impression fired this session

// Placeholder — replace with the live Google Form / Typeform once created, or set
// NEXT_PUBLIC_UX_STUDY_FORM_URL in the environment (no redeploy of this file needed).
const FALLBACK_FORM_URL = "https://forms.gle/aversusb-ux-study";
const FORM_URL = process.env.NEXT_PUBLIC_UX_STUDY_FORM_URL || FALLBACK_FORM_URL;

// Master kill switch. Banner is ON unless explicitly disabled, so it can go live
// with the deploy and be switched off the moment recruitment is complete.
const ENABLED = process.env.NEXT_PUBLIC_UX_STUDY_BANNER !== "off";

/** Stable 50% bucket for the session. Returns true if this visitor is in-cohort. */
function isInCohort(): boolean {
  try {
    let bucket = sessionStorage.getItem(BUCKET_KEY);
    if (bucket !== "in" && bucket !== "out") {
      bucket = Math.random() < 0.5 ? "in" : "out";
      sessionStorage.setItem(BUCKET_KEY, bucket);
    }
    return bucket === "in";
  } catch {
    // Storage disabled (private mode) — fall back to a per-load coin flip.
    return Math.random() < 0.5;
  }
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function UxStudyBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ENABLED) return;
    if (isDismissed()) return;
    if (!isInCohort()) return;

    setVisible(true);

    // Track the impression at most once per session.
    try {
      if (!sessionStorage.getItem(SHOWN_KEY)) {
        sessionStorage.setItem(SHOWN_KEY, "1");
        trackUxStudyBannerShown(window.location.pathname);
      }
    } catch {
      trackUxStudyBannerShown(window.location.pathname);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* storage disabled — banner simply reappears next session */
    }
    trackUxStudyBannerDismiss(typeof window !== "undefined" ? window.location.pathname : "");
  };

  const handleClick = () => {
    trackUxStudyBannerClick(typeof window !== "undefined" ? window.location.pathname : "");
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Paid usability study invitation"
      className="relative z-40 w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <p className="flex-1 text-center text-sm font-medium leading-snug sm:text-left">
          <span className="mr-1.5 inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wide">
            Earn $25
          </span>
          Got 30 minutes? Help us improve this site.{" "}
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={handleClick}
            className="ml-1 inline-flex items-center gap-1 font-bold underline decoration-white/60 underline-offset-2 hover:decoration-white"
          >
            Sign up
            <span aria-hidden="true">&rarr;</span>
          </a>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss study invitation"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/30"
        >
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
