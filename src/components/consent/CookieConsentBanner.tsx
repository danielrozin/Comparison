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

/**
 * ROO-81 compact phone bar. Set to false to restore the previous card
 * (about 182px, sitting in a ~254px band above the bottom nav).
 */
export const COMPACT_MOBILE_COOKIE_BAR = true;

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
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = useCallback((state: ConsentState) => {
    setVisible(false);
    persistConsentToBackend(state);
    trackEvent("consent_update", {
      analytics: state.analytics ? 1 : 0,
      marketing: state.marketing ? 1 : 0,
      functional: state.functional ? 1 : 0,
    });
    // Update Google Consent Mode dynamically instead of reloading
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: state.analytics ? "granted" : "denied",
        ad_storage: state.marketing ? "granted" : "denied",
        ad_user_data: state.marketing ? "granted" : "denied",
        ad_personalization: state.marketing ? "granted" : "denied",
        functionality_storage: state.functional ? "granted" : "denied",
      });
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    handleDismiss(acceptAll());
  }, [handleDismiss]);

  const handleRejectAll = useCallback(() => {
    handleDismiss(rejectAll());
  }, [handleDismiss]);

  const handleSavePreferences = useCallback(() => {
    handleDismiss(savePreferences(prefs));
  }, [prefs, handleDismiss]);

  const handleManageClick = useCallback(() => {
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
      if (e.key === "Escape" && showPreferences) setShowPreferences(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, showPreferences]);

  if (!visible) return null;

  // Phone bar only. Settings still opens the full preferences sheet below,
  // and md+ keeps the original card. Consent handlers are unchanged.
  if (COMPACT_MOBILE_COOKIE_BAR && !showPreferences) {
    return (
      <div
        role="dialog"
        aria-label="Cookie consent"
        aria-modal="false"
        className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none"
        style={{ animation: "slide-up 0.4s ease-out forwards" }}
      >
        {/* One row, 64px (h-16), under the ~80px target at 390px wide.
            Inline word-break overrides the global `* { word-break: break-word }`
            so "Accept All" / "Reject All" stay on this row (ROO-50). */}
        <div
          data-cookie-bar="compact"
          className="md:hidden pointer-events-auto border-t border-border bg-surface shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div
            className="flex h-16 items-center gap-1.5 px-2"
            style={{ wordBreak: "normal", overflowWrap: "normal" }}
          >
            <p className="min-w-0 flex-1 text-[11px] leading-tight text-text-secondary">
              We use cookies.{" "}
              <a
                href="/cookie-policy"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
              >
                Cookie Policy
              </a>
            </p>
            <div className="flex shrink-0 items-center gap-1" data-cookie-actions="compact">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg bg-primary-600 px-2 text-[11px] font-medium text-white hover:bg-primary-700 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                style={{ wordBreak: "keep-all" }}
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg border border-border px-2 text-[11px] font-medium text-text hover:bg-surface-alt transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                style={{ wordBreak: "keep-all" }}
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={handleManageClick}
                className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg px-2 text-[11px] font-medium text-text-secondary hover:text-text transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                style={{ wordBreak: "keep-all" }}
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block mx-auto max-w-3xl px-6 pb-6">
          <div className="pointer-events-auto rounded-xl border border-border bg-surface shadow-2xl shadow-black/10">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-lg" aria-hidden="true">🍪</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text">We value your privacy</p>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                    We use cookies to improve your experience, analyze traffic, and personalize content.
                    You can choose which cookies to allow.{" "}
                    <a
                      href="/cookie-policy"
                      className="text-primary-600 underline underline-offset-2 hover:text-primary-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                    >
                      Cookie Policy
                    </a>
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="inline-flex items-center justify-center min-h-11 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="inline-flex items-center justify-center min-h-11 px-4 py-2 text-sm font-medium text-text border border-border rounded-lg hover:bg-surface-alt transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Reject All
                </button>
                <button
                  type="button"
                  onClick={handleManageClick}
                  className="inline-flex items-center justify-center min-h-11 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
                >
                  Manage Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none"
      style={{ animation: "slide-up 0.4s ease-out forwards" }}
    >
      <div className="mx-auto max-w-3xl px-3 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-6">
        {/* The preferences view is taller than a short phone viewport; without a
            cap it grew off the top of the screen with no way to reach the top. */}
        <div className="pointer-events-auto rounded-xl border border-border bg-surface shadow-2xl shadow-black/10 max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain">
          {!showPreferences ? (
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
                      className="text-primary-600 underline underline-offset-2 hover:text-primary-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                    >
                      Cookie Policy
                    </a>
                  </p>
                </div>
              </div>

              {/* One row on a phone. Three stacked 44px buttons made this bar
                  ~362px tall and covered the pricing line on a ~667px screen. */}
              <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:flex sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="inline-flex items-center justify-center min-h-11 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="inline-flex items-center justify-center min-h-11 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-text border border-border rounded-lg hover:bg-surface-alt transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Reject All
                </button>
                <button
                  type="button"
                  onClick={handleManageClick}
                  className="inline-flex items-center justify-center min-h-11 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-text-secondary hover:text-text transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
                >
                  <span className="sm:hidden">Settings</span>
                  <span className="hidden sm:inline">Manage Preferences</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-text">Cookie Preferences</p>
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  aria-label="Close cookie preferences"
                  className="inline-flex items-center justify-center w-11 h-11 -m-2 text-text-secondary hover:text-text transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
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
                  type="button"
                  onClick={handleSavePreferences}
                  className="inline-flex items-center justify-center min-h-11 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Save Preferences
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="inline-flex items-center justify-center min-h-11 px-4 py-2 text-sm font-medium text-text border border-border rounded-lg hover:bg-surface-alt transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
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
