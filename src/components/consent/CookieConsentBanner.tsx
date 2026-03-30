"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getConsentFromCookie,
  hasConsentBeenGiven,
  acceptAll,
  rejectAll,
  savePreferences,
  persistConsentToBackend,
  type ConsentState,
} from "@/lib/utils/consent";
import { trackEvent } from "@/lib/utils/analytics";

const CATEGORIES = [
  {
    key: "necessary" as const,
    label: "Necessary",
    description: "Essential for the website to function. Cannot be disabled.",
    locked: true,
  },
  {
    key: "analytics" as const,
    label: "Analytics",
    description: "Help us understand how visitors interact with the website.",
    locked: false,
  },
  {
    key: "marketing" as const,
    label: "Marketing",
    description: "Used to deliver relevant ads and track campaign performance.",
    locked: false,
  },
  {
    key: "functional" as const,
    label: "Functional",
    description: "Enable enhanced features like preferences and personalization.",
    locked: false,
  },
];

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState({
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    if (!hasConsentBeenGiven()) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = useCallback((state: ConsentState) => {
    setVisible(false);
    persistConsentToBackend(state);
    trackEvent("consent_update", {
      analytics: state.analytics ? "granted" : "denied",
      marketing: state.marketing ? "granted" : "denied",
      functional: state.functional ? "granted" : "denied",
    });
    // Reload to apply script blocking changes
    if (state.analytics || state.marketing) {
      window.location.reload();
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const state = acceptAll();
    handleDismiss(state);
  }, [handleDismiss]);

  const handleRejectAll = useCallback(() => {
    const state = rejectAll();
    handleDismiss(state);
  }, [handleDismiss]);

  const handleSavePreferences = useCallback(() => {
    const state = savePreferences(prefs);
    handleDismiss(state);
  }, [prefs, handleDismiss]);

  const handleManageClick = useCallback(() => {
    // Pre-fill with existing consent if available
    const existing = getConsentFromCookie();
    if (existing) {
      setPrefs({
        analytics: existing.analytics,
        marketing: existing.marketing,
        functional: existing.functional,
      });
    }
    setShowPreferences(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showPreferences) setShowPreferences(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, showPreferences]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-[60] animate-slide-up"
    >
      <div className="mx-auto max-w-3xl px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="rounded-xl border border-border bg-surface shadow-2xl shadow-black/10">
          {!showPreferences ? (
            /* ---- Simple banner ---- */
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="hidden sm:block mt-0.5 text-lg" aria-hidden="true">🍪</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text">We value your privacy</p>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                    We use cookies to improve your experience, analyze traffic, and personalize content.
                    You can choose which cookies to allow.{" "}
                    <a
                      href="/cookie-policy"
                      className="text-primary-600 underline underline-offset-2 hover:text-primary-700"
                    >
                      Cookie Policy
                    </a>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium text-text border border-border rounded-lg hover:bg-surface-alt transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Reject All
                </button>
                <button
                  onClick={handleManageClick}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
                >
                  Manage Preferences
                </button>
              </div>
            </div>
          ) : (
            /* ---- Preferences panel ---- */
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-text">Cookie Preferences</p>
                <button
                  onClick={() => setShowPreferences(false)}
                  aria-label="Back to banner"
                  className="p-1 text-text-secondary hover:text-text transition-colors rounded"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.key}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary-200 transition-colors cursor-pointer"
                  >
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={cat.locked ? true : prefs[cat.key as keyof typeof prefs]}
                        disabled={cat.locked}
                        onChange={(e) => {
                          if (cat.locked) return;
                          setPrefs((p) => ({ ...p, [cat.key]: e.target.checked }));
                        }}
                        className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-text">
                        {cat.label}
                        {cat.locked && (
                          <span className="ml-2 text-xs font-normal text-text-secondary">(Always active)</span>
                        )}
                      </span>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{cat.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm font-medium text-text border border-border rounded-lg hover:bg-surface-alt transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Accept All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
