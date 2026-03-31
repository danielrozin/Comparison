"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY_DISMISSED = "survey_popup_dismissed";
const STORAGE_KEY_PAGEVIEWS = "survey_popup_pageviews";
const TRIGGER_DELAY_MS = 30_000;
const PAGEVIEW_THRESHOLD = 2;

/** Default placeholder — replace with actual Typeform / Google Forms URL */
const SURVEY_URL =
  process.env.NEXT_PUBLIC_SURVEY_URL ||
  "https://forms.gle/placeholder";

export function SurveyInterceptPopup() {
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  const show = useCallback(() => {
    if (triggered.current) return;
    triggered.current = true;
    setVisible(true);
  }, []);

  useEffect(() => {
    // Already dismissed
    if (localStorage.getItem(STORAGE_KEY_DISMISSED)) return;

    // Track pageviews
    const views = Number(localStorage.getItem(STORAGE_KEY_PAGEVIEWS) || "0") + 1;
    localStorage.setItem(STORAGE_KEY_PAGEVIEWS, String(views));

    // Show immediately if pageview threshold met
    if (views >= PAGEVIEW_THRESHOLD) {
      show();
      return;
    }

    // Otherwise, show after delay
    const timer = setTimeout(show, TRIGGER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [show]);

  // Keyboard dismiss
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY_DISMISSED, "1");
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] bg-white border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-primary-600 text-white px-5 py-3.5 flex items-center justify-between">
        <h3 className="font-bold text-sm">Help us improve!</h3>
        <button
          onClick={dismiss}
          className="p-1.5 hover:bg-primary-500 rounded transition-colors"
          aria-label="Close survey popup"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text">
              We&apos;d love your feedback!
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Take a quick 2-minute survey to help us make this site better for you.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={dismiss}
            className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            No thanks
          </button>
          <a
            href={SURVEY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="flex-1 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 transition-colors text-center inline-flex items-center justify-center gap-1.5"
          >
            Take survey
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
