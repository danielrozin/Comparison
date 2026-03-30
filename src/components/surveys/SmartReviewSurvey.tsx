"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const COOKIE_NAME = "smartreview_survey_dismissed";
const COOKIE_DAYS = 14;
const BROWSE_PAGES_KEY = "smartreview_pages_viewed";
const BROWSE_THRESHOLD = 5;

type TriggerType = "form_submit_success" | "form_abandon" | "browse_5_pages";
type UserRole = "reviewer" | "reader";
type Step = 1 | 2 | 3 | 4 | 5 | "optin" | "done";

interface SmartReviewSurveyProps {
  triggerType: TriggerType;
  userRole: UserRole;
  entitySlug?: string;
  onClose?: () => void;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
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

function getUserType(): "new" | "returning" {
  const visited = getCookie("smartreview_visited");
  if (visited) return "returning";
  setCookie("smartreview_visited", "1", 365);
  return "new";
}

// Track review page views for browse trigger
export function trackReviewPageView(): boolean {
  if (getCookie(COOKIE_NAME)) return false;
  const count = parseInt(sessionStorage.getItem(BROWSE_PAGES_KEY) || "0", 10) + 1;
  sessionStorage.setItem(BROWSE_PAGES_KEY, String(count));
  return count >= BROWSE_THRESHOLD;
}

const MOTIVATION_OPTIONS: Record<UserRole, Array<{ value: string; label: string }>> = {
  reviewer: [
    { value: "share_experience", label: "Wanted to share my experience" },
    { value: "help_others", label: "Help others make a decision" },
    { value: "positive_experience", label: "Had a great experience" },
    { value: "negative_experience", label: "Had a bad experience" },
    { value: "other", label: "Other" },
  ],
  reader: [
    { value: "research_purchase", label: "Researching before a purchase" },
    { value: "compare_options", label: "Comparing options" },
    { value: "check_quality", label: "Checking product quality" },
    { value: "curiosity", label: "Just curious" },
    { value: "other", label: "Other" },
  ],
};

const DISCOVERY_OPTIONS = [
  { value: "search", label: "Google / search engine" },
  { value: "social", label: "Social media" },
  { value: "comparison_page", label: "From a comparison page on this site" },
  { value: "direct", label: "Direct / bookmark" },
  { value: "other", label: "Other" },
];

const TRUST_FACTORS = [
  { value: "verified_purchase", label: "Verified purchase badges" },
  { value: "rating_distribution", label: "Rating distribution charts" },
  { value: "reviewer_profiles", label: "Reviewer profiles/history" },
  { value: "more_reviews", label: "More reviews overall" },
  { value: "expert_reviews", label: "Expert/editorial reviews" },
  { value: "response_from_brand", label: "Brand/seller responses" },
];

export function SmartReviewSurvey({ triggerType, userRole, entitySlug, onClose }: SmartReviewSurveyProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>(1);

  // Form state
  const [q1Motivation, setQ1Motivation] = useState("");
  const [q1Other, setQ1Other] = useState("");
  const [q2Ease, setQ2Ease] = useState(0);
  const [q2Difficulty, setQ2Difficulty] = useState("");
  const [q3Trust, setQ3Trust] = useState(0);
  const [q3TrustFactors, setQ3TrustFactors] = useState<string[]>([]);
  const [q4Discovery, setQ4Discovery] = useState("");
  const [q4Other, setQ4Other] = useState("");
  const [q5Feature, setQ5Feature] = useState("");
  const [optInEmail, setOptInEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startTime = useRef(Date.now());

  useEffect(() => {
    if (getCookie(COOKIE_NAME)) return;
    setVisible(true);
    startTime.current = Date.now();
  }, []);

  const dismiss = useCallback(() => {
    setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
    setVisible(false);
    onClose?.();
  }, [onClose]);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    const completionTimeSec = Math.round((Date.now() - startTime.current) / 1000);
    try {
      await fetch("/api/surveys/smartreview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triggerType,
          entitySlug: entitySlug || null,
          deviceType: getDeviceType(),
          referralSource: getReferralSource(),
          userType: getUserType(),
          userRole,
          q1Motivation,
          q1Other: q1Motivation === "other" ? q1Other : null,
          q2Ease,
          q2Difficulty: q2Ease <= 2 ? q2Difficulty : null,
          q3Trust,
          q3TrustFactors,
          q4Discovery,
          q4Other: q4Discovery === "other" ? q4Other : null,
          q5Feature: q5Feature || null,
          optInEmail: optInEmail || null,
          completionTimeSec,
          stepsCompleted: 5,
        }),
      });
    } catch {
      // Silently fail — still thank the user
    }
    setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
    setIsSubmitting(false);
    setStep("done");
  }, [triggerType, entitySlug, userRole, q1Motivation, q1Other, q2Ease, q2Difficulty, q3Trust, q3TrustFactors, q4Discovery, q4Other, q5Feature, optInEmail]);

  if (!visible) return null;

  const easeLabel = userRole === "reviewer" ? "submit your review" : "find what you were looking for";
  const motivationLabel = userRole === "reviewer" ? "submit a review" : "browse reviews";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Help us improve SmartReview</h3>
            <p className="text-primary-100 text-sm mt-0.5">
              {step === "done" ? "Thank you!" : `Question ${typeof step === "number" ? step : 5} of 5`}
            </p>
          </div>
          <button
            onClick={dismiss}
            className="p-2 hover:bg-primary-500 rounded-lg transition-colors"
            aria-label="Close survey"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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

        <div className="p-6">
          {/* Step 1: Motivation */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-text">
                What made you decide to {motivationLabel} today?
              </p>
              <div className="space-y-2">
                {MOTIVATION_OPTIONS[userRole].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-sm ${
                      q1Motivation === opt.value
                        ? "bg-primary-50 border-primary-300 text-primary-700"
                        : "border-border hover:border-primary-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q1"
                      value={opt.value}
                      checked={q1Motivation === opt.value}
                      onChange={() => setQ1Motivation(opt.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      q1Motivation === opt.value ? "border-primary-500" : "border-gray-300"
                    }`}>
                      {q1Motivation === opt.value && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                    </div>
                    {opt.label}
                  </label>
                ))}
                {q1Motivation === "other" && (
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
                disabled={!q1Motivation}
                className="w-full py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Ease of use */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-text">
                How easy was it to {easeLabel}?
              </p>
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setQ2Ease(val)}
                    className={`w-12 h-12 rounded-lg border-2 text-sm font-bold transition-colors ${
                      q2Ease === val
                        ? "bg-primary-600 border-primary-600 text-white"
                        : "border-border hover:border-primary-300 text-text"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-text-secondary px-1">
                <span>Very difficult</span>
                <span>Very easy</span>
              </div>
              {q2Ease > 0 && q2Ease <= 2 && (
                <div>
                  <label className="block text-xs text-text-secondary mb-1">What was difficult?</label>
                  <textarea
                    value={q2Difficulty}
                    onChange={(e) => setQ2Difficulty(e.target.value)}
                    maxLength={300}
                    rows={2}
                    placeholder="Tell us what made it hard..."
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none resize-none"
                  />
                  <p className="text-xs text-text-secondary mt-0.5 text-right">{q2Difficulty.length}/300</p>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={q2Ease === 0}
                  className="flex-1 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Trust */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-text">How much do you trust the reviews on this site?</p>
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setQ3Trust(val)}
                    className={`w-12 h-12 rounded-lg border-2 text-sm font-bold transition-colors ${
                      q3Trust === val
                        ? "bg-primary-600 border-primary-600 text-white"
                        : "border-border hover:border-primary-300 text-text"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-text-secondary px-1">
                <span>Not at all</span>
                <span>Completely</span>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-2">What would increase your trust? (select all that apply)</p>
                <div className="space-y-2">
                  {TRUST_FACTORS.map((factor) => (
                    <label
                      key={factor.value}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                        q3TrustFactors.includes(factor.value)
                          ? "bg-primary-50 border-primary-300 text-primary-700"
                          : "border-border hover:border-primary-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={q3TrustFactors.includes(factor.value)}
                        onChange={() => {
                          setQ3TrustFactors((prev) =>
                            prev.includes(factor.value)
                              ? prev.filter((v) => v !== factor.value)
                              : [...prev, factor.value]
                          );
                        }}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        q3TrustFactors.includes(factor.value) ? "bg-primary-500 border-primary-500" : "border-gray-300"
                      }`}>
                        {q3TrustFactors.includes(factor.value) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {factor.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={q3Trust === 0}
                  className="flex-1 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Discovery */}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-text">How did you discover the categories/topics you browsed?</p>
              <div className="space-y-2">
                {DISCOVERY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-sm ${
                      q4Discovery === opt.value
                        ? "bg-primary-50 border-primary-300 text-primary-700"
                        : "border-border hover:border-primary-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q4"
                      value={opt.value}
                      checked={q4Discovery === opt.value}
                      onChange={() => setQ4Discovery(opt.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      q4Discovery === opt.value ? "border-primary-500" : "border-gray-300"
                    }`}>
                      {q4Discovery === opt.value && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                    </div>
                    {opt.label}
                  </label>
                ))}
                {q4Discovery === "other" && (
                  <input
                    type="text"
                    value={q4Other}
                    onChange={(e) => setQ4Other(e.target.value)}
                    placeholder="Please specify..."
                    maxLength={200}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
                  />
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(3)} className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  disabled={!q4Discovery}
                  className="flex-1 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Feature request */}
          {step === 5 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-text">What one feature would make this site more valuable to you?</p>
              <textarea
                value={q5Feature}
                onChange={(e) => setQ5Feature(e.target.value)}
                maxLength={300}
                rows={3}
                placeholder="Your suggestion (optional)..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none resize-none"
              />
              <p className="text-xs text-text-secondary text-right">{q5Feature.length}/300</p>
              <div className="flex gap-2">
                <button onClick={() => setStep(4)} className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button
                  onClick={() => setStep("optin")}
                  className="flex-1 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 transition-colors"
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
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-text text-lg">Thank you!</p>
              <p className="text-sm text-text-secondary mt-1">Your feedback helps us build a better review experience.</p>
              <button
                onClick={dismiss}
                className="mt-4 px-6 py-2 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 transition-colors"
              >
                Continue browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
