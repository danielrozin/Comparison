"use client";

// Lightweight on-page intercept survey for comparison pages.
// Triggers on 30s dwell OR 60% scroll (whichever first), capped to once per
// 14 days per browser via localStorage. Auto-collects page context and POSTs
// the 5-question instrument to /api/surveys/intercept (shipped in DAN-118).
// Wiring this trigger is DAN-697 — the API existed but nothing ever called it.

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "avb_intercept_survey_ts";
const FREQUENCY_CAP_MS = 14 * 24 * 60 * 60 * 1000; // 14-day cap (per plan §2)
const DWELL_MS = 30_000; // 30s dwell trigger
const SCROLL_THRESHOLD = 0.6; // 60% scroll trigger

type Step = "intent" | "found" | "rating" | "feedback" | "discovery";
const STEPS: Step[] = ["intent", "found", "rating", "feedback", "discovery"];

const INTENT_OPTIONS = [
  "Deciding between these two",
  "General research",
  "Settling a debate / curiosity",
  "Shopping or buying decision",
  "Something else",
];

const DISCOVERY_OPTIONS = [
  "Google / search engine",
  "Social media",
  "Friend or colleague",
  "I've used this site before",
  "Other",
];

function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getReferralSource(): string {
  if (typeof document === "undefined") return "direct";
  const ref = document.referrer;
  if (!ref) return "direct";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host === window.location.hostname) return "internal";
    if (/google\./.test(host)) return "google";
    if (/(bing|duckduckgo|yahoo|ecosia)\./.test(host)) return "search";
    if (/(facebook|instagram|t\.co|twitter|x\.com|linkedin|reddit|pinterest|tiktok|youtube)/.test(host)) return "social";
    return host;
  } catch {
    return "other";
  }
}

function recentlyShown(): boolean {
  try {
    const ts = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(ts) && ts > 0 && Date.now() - ts < FREQUENCY_CAP_MS;
  } catch {
    return false;
  }
}

function markShown() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* private mode / storage disabled — survey simply re-eligible next visit */
  }
}

interface Answers {
  q1Intent?: string;
  q2Found?: boolean;
  q2Missing?: string;
  q3Rating?: number;
  q4Improvement?: string;
  q5Discovery?: string;
  optInEmail?: string;
}

export function InterceptSurvey({
  comparisonSlug,
  category,
}: {
  comparisonSlug: string;
  category?: string;
}) {
  const [open, setOpen] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const submittedRef = useRef(false);

  // Arm the triggers: 30s timer + scroll listener, whichever fires first.
  useEffect(() => {
    if (recentlyShown()) return;

    let armed = true;
    const reveal = () => {
      if (!armed) return;
      armed = false;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      markShown(); // impression-capped: count it the moment it appears
      setOpen(true);
    };

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= SCROLL_THRESHOLD) reveal();
    };

    const timer = window.setTimeout(reveal, DWELL_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      armed = false;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [comparisonSlug]);

  const submit = useCallback(
    (final: Answers) => {
      if (submittedRef.current) return;
      // Nothing answered — don't write an empty row.
      const hasAnswer =
        final.q1Intent != null ||
        final.q2Found != null ||
        final.q3Rating != null ||
        (final.q4Improvement && final.q4Improvement.trim()) ||
        final.q5Discovery != null;
      if (!hasAnswer) return;

      submittedRef.current = true;
      const payload = {
        comparisonSlug,
        category: category || null,
        deviceType: getDeviceType(),
        referralSource: getReferralSource(),
        q1Intent: final.q1Intent ?? null,
        q2Found: final.q2Found ?? null,
        q2Missing: final.q2Missing?.trim() || null,
        q3Rating: final.q3Rating ?? null,
        q4Improvement: final.q4Improvement?.trim() || null,
        q5Discovery: final.q5Discovery ?? null,
        optInEmail: final.optInEmail?.trim() || null,
      };

      const body = JSON.stringify(payload);
      // Prefer sendBeacon so a dismiss/unload still delivers the partial.
      try {
        if (navigator.sendBeacon) {
          const ok = navigator.sendBeacon(
            "/api/surveys/intercept",
            new Blob([body], { type: "application/json" })
          );
          if (ok) return;
        }
      } catch {
        /* fall through to fetch */
      }
      fetch("/api/surveys/intercept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    },
    [comparisonSlug, category]
  );

  const close = useCallback(() => {
    // Capture whatever was answered before bailing out.
    submit(answers);
    setOpen(false);
  }, [answers, submit]);

  const advance = useCallback(() => {
    setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  }, []);

  const finish = useCallback(
    (final: Answers) => {
      submit(final);
      setDone(true);
    },
    [submit]
  );

  if (!open) return null;

  const step = STEPS[stepIdx];

  return (
    <div
      role="dialog"
      aria-label="Quick feedback survey"
      aria-modal="false"
      className="fixed z-50 bottom-0 inset-x-0 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[360px] animate-[avb-survey-in_0.3s_ease-out]"
    >
      <style>{`@keyframes avb-survey-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="bg-surface border border-border shadow-2xl sm:rounded-xl rounded-t-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt">
          <span className="text-sm font-semibold text-text">
            {done ? "Thanks for the feedback!" : "Got 20 seconds?"}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close survey"
            className="text-text-secondary hover:text-text transition-colors -mr-1 p-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-text-secondary">
              Your input helps us make these comparisons more useful. 🙌
            </p>
          </div>
        ) : (
          <div className="px-4 py-4">
            {/* Progress */}
            <div className="h-1 w-full bg-border rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-300"
                style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
              />
            </div>

            {step === "intent" && (
              <SingleChoice
                label="What brought you to this comparison?"
                options={INTENT_OPTIONS}
                value={answers.q1Intent}
                onSelect={(v) => {
                  setAnswers((a) => ({ ...a, q1Intent: v }));
                  advance();
                }}
              />
            )}

            {step === "found" && (
              <div>
                <p className="text-sm font-semibold text-text mb-3">
                  Did you find what you were looking for?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((a) => ({ ...a, q2Found: true }));
                      advance();
                    }}
                    className="flex-1 py-2.5 text-sm font-medium rounded-lg border border-border hover:border-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, q2Found: false }))}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                      answers.q2Found === false
                        ? "border-primary-600 bg-primary-50"
                        : "border-border hover:border-primary-600 hover:bg-primary-50"
                    }`}
                  >
                    No
                  </button>
                </div>
                {answers.q2Found === false && (
                  <div className="mt-3">
                    <textarea
                      value={answers.q2Missing || ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, q2Missing: e.target.value }))}
                      placeholder="What was missing? (optional)"
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg resize-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={advance}
                      className="mt-2 w-full py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 rounded-lg hover:shadow-md transition-all duration-150"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === "rating" && (
              <div>
                <p className="text-sm font-semibold text-text mb-3">
                  How helpful was this comparison?
                </p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      aria-label={`${n} out of 5`}
                      onClick={() => {
                        setAnswers((a) => ({ ...a, q3Rating: n }));
                        advance();
                      }}
                      className="flex-1 py-3 text-base font-semibold rounded-lg border border-border hover:border-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-text-secondary mt-1.5 px-0.5">
                  <span>Not helpful</span>
                  <span>Very helpful</span>
                </div>
              </div>
            )}

            {step === "feedback" && (
              <div>
                <p className="text-sm font-semibold text-text mb-3">
                  Anything we could improve? (optional)
                </p>
                <textarea
                  value={answers.q4Improvement || ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, q4Improvement: e.target.value }))}
                  placeholder="Your suggestion…"
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg resize-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <input
                  autoComplete="email"
                  type="email"
                  value={answers.optInEmail || ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, optInEmail: e.target.value }))}
                  placeholder="Email for a reply (optional)"
                  className="mt-2 w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={advance}
                  className="mt-3 w-full py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 rounded-lg hover:shadow-md transition-all duration-150"
                >
                  Continue
                </button>
              </div>
            )}

            {step === "discovery" && (
              <SingleChoice
                label="Last one — how did you find us?"
                options={DISCOVERY_OPTIONS}
                value={answers.q5Discovery}
                onSelect={(v) => finish({ ...answers, q5Discovery: v })}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SingleChoice({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: string[];
  value?: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-text mb-3">{label}</p>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => onSelect(opt)}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg border transition-colors ${
              value === opt
                ? "border-primary-600 bg-primary-50"
                : "border-border hover:border-primary-600 hover:bg-primary-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
