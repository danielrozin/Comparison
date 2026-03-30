"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const COOKIE_NAME = "intercept_survey_dismissed";
const COOKIE_DAYS = 14;
const TRIGGER_DELAY_MS = 30_000;
const SCROLL_THRESHOLD = 0.6;

interface InterceptSurveyProps {
  comparisonSlug: string;
  category?: string | null;
}

type Step = 1 | 2 | 3 | 4 | 5 | "optin" | "done";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getReferralSource(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("utm_source") || params.get("ref") || document.referrer || null;
}

export function InterceptSurvey({ comparisonSlug, category }: InterceptSurveyProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [minimized, setMinimized] = useState(false);

  // Form state
  const [q1Intent, setQ1Intent] = useState<string>("");
  const [q1Other, setQ1Other] = useState("");
  const [q2Found, setQ2Found] = useState<boolean | null>(null);
  const [q2Missing, setQ2Missing] = useState("");
  const [q3Rating, setQ3Rating] = useState(0);
  const [q4Improvement, setQ4Improvement] = useState("");
  const [q5Discovery, setQ5Discovery] = useState<string>("");
  const [q5Other, setQ5Other] = useState("");
  const [optInEmail, setOptInEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggered = useRef(false);

  const showSurvey = useCallback(() => {
    if (triggered.current) return;
    if (getCookie(COOKIE_NAME)) return;
    triggered.current = true;
    setVisible(true);
  }, []);

  // Trigger: 30s timer OR 60% scroll
  useEffect(() => {
    if (getCookie(COOKIE_NAME)) return;

    const timer = setTimeout(showSurvey, TRIGGER_DELAY_MS);

    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= SCROLL_THRESHOLD) {
        showSurvey();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showSurvey]);

  const dismiss = useCallback(() => {
    setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
    setVisible(false);
  }, []);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/surveys/intercept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comparisonSlug,
          category: category || null,
          deviceType: getDeviceType(),
          referralSource: getReferralSource(),
          q1Intent,
          q1Other: q1Intent === "other" ? q1Other : null,
          q2Found: q2Found ?? true,
          q2Missing: q2Found === false ? q2Missing : null,
          q3Rating,
          q4Improvement: q4Improvement || null,
          q5Discovery,
          q5Other: q5Discovery === "other" ? q5Other : null,
          optInEmail: optInEmail || null,
        }),
      });
    } catch {
      // Silently fail — still thank the user
    }
    setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
    setIsSubmitting(false);
    setStep("done");
  }, [comparisonSlug, category, q1Intent, q1Other, q2Found, q2Missing, q3Rating, q4Improvement, q5Discovery, q5Other, optInEmail]);

  if (!visible) return null;

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 right-6 z-50 bg-primary-600 text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Quick survey
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] bg-white border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-primary-600 text-white px-5 py-3.5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">Quick feedback</h3>
          <p className="text-primary-100 text-xs mt-0.5">
            {step === "done" ? "Thank you!" : `Question ${typeof step === "number" ? step : 5} of 5`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 hover:bg-primary-500 rounded transition-colors"
            aria-label="Minimize"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={dismiss}
            className="p-1.5 hover:bg-primary-500 rounded transition-colors"
            aria-label="Close survey"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {typeof step === "number" && (
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      )}

      <div className="p-5">
        {/* Step 1: Intent */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-text">What brought you to this page today?</p>
            <div className="space-y-2">
              {[
                { value: "purchase", label: "Researching a purchase decision" },
                { value: "curiosity", label: "Settling a debate / curiosity" },
                { value: "project", label: "School or work project" },
                { value: "browsing", label: "Just browsing" },
                { value: "other", label: "Other" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                    q1Intent === opt.value
                      ? "bg-primary-50 border-primary-300 text-primary-700"
                      : "border-border hover:border-primary-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="q1"
                    value={opt.value}
                    checked={q1Intent === opt.value}
                    onChange={() => setQ1Intent(opt.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    q1Intent === opt.value ? "border-primary-500" : "border-gray-300"
                  }`}>
                    {q1Intent === opt.value && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                  {opt.label}
                </label>
              ))}
              {q1Intent === "other" && (
                <input
                  type="text"
                  value={q1Other}
                  onChange={(e) => setQ1Other(e.target.value)}
                  placeholder="Please specify..."
                  maxLength={200}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
                />
              )}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!q1Intent}
              className="w-full py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Found info */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-text">Did you find the information you were looking for?</p>
            <div className="flex gap-3">
              {[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => setQ2Found(opt.value)}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    q2Found === opt.value
                      ? opt.value
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-red-50 border-red-300 text-red-700"
                      : "border-border hover:border-primary-200"
                  }`}
                >
                  {opt.value ? "Yes" : "No"}
                </button>
              ))}
            </div>
            {q2Found === false && (
              <div>
                <label className="block text-xs text-text-secondary mb-1">What was missing?</label>
                <textarea
                  value={q2Missing}
                  onChange={(e) => setQ2Missing(e.target.value)}
                  maxLength={200}
                  rows={2}
                  placeholder="Tell us what you were looking for..."
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none resize-none"
                />
                <p className="text-xs text-text-secondary mt-0.5 text-right">{q2Missing.length}/200</p>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={q2Found === null}
                className="flex-1 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Rating */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-text">How would you rate this comparison?</p>
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setQ3Rating(star)}
                  className="group p-1 transition-transform hover:scale-110"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <svg
                    className={`w-10 h-10 transition-colors ${
                      star <= q3Rating ? "text-amber-400" : "text-gray-200 group-hover:text-amber-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-text-secondary px-1">
              <span>Not useful</span>
              <span>Extremely useful</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={q3Rating === 0}
                className="flex-1 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Improvement */}
        {step === 4 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-text">What one thing would make this page more useful to you?</p>
            <textarea
              value={q4Improvement}
              onChange={(e) => setQ4Improvement(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder="Your suggestion (optional)..."
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none resize-none"
            />
            <p className="text-xs text-text-secondary text-right">{q4Improvement.length}/300</p>
            <div className="flex gap-2">
              <button onClick={() => setStep(3)} className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Discovery */}
        {step === 5 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-text">How did you find us?</p>
            <div className="space-y-2">
              {[
                { value: "search", label: "Google / search engine" },
                { value: "social", label: "Social media (Reddit, Twitter, etc.)" },
                { value: "shared", label: "Someone shared a link" },
                { value: "direct", label: "I've visited before (direct/bookmark)" },
                { value: "other", label: "Other" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                    q5Discovery === opt.value
                      ? "bg-primary-50 border-primary-300 text-primary-700"
                      : "border-border hover:border-primary-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="q5"
                    value={opt.value}
                    checked={q5Discovery === opt.value}
                    onChange={() => setQ5Discovery(opt.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    q5Discovery === opt.value ? "border-primary-500" : "border-gray-300"
                  }`}>
                    {q5Discovery === opt.value && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                  {opt.label}
                </label>
              ))}
              {q5Discovery === "other" && (
                <input
                  type="text"
                  value={q5Other}
                  onChange={(e) => setQ5Other(e.target.value)}
                  placeholder="Please specify..."
                  maxLength={200}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
                />
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(4)} className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep("optin")}
                disabled={!q5Discovery}
                className="flex-1 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Opt-in */}
        {step === "optin" && (
          <div className="space-y-3">
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
              <p className="text-sm font-medium text-primary-800">
                Would you help us improve?
              </p>
              <p className="text-xs text-primary-600 mt-1">
                Join a 30-min feedback session for a $25 gift card.
              </p>
            </div>
            <input
              type="email"
              value={optInEmail}
              onChange={(e) => setOptInEmail(e.target.value)}
              placeholder="your@email.com (optional)"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={submit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors font-medium"
              >
                {isSubmitting ? "Submitting..." : "Skip & submit"}
              </button>
              <button
                onClick={submit}
                disabled={isSubmitting || !optInEmail}
                className="flex-1 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}

        {/* Done */}
        {step === "done" && (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-text">Thank you!</p>
            <p className="text-sm text-text-secondary mt-1">Your feedback helps us improve.</p>
          </div>
        )}
      </div>
    </div>
  );
}
