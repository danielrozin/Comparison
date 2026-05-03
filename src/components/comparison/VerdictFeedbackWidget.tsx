"use client";

import { useEffect, useRef, useState } from "react";
import {
  trackVerdictFeedbackImpression,
  trackVerdictFeedbackVote,
  trackVerdictFeedbackReasonSubmit,
} from "@/lib/utils/analytics";

interface VerdictFeedbackWidgetProps {
  comparisonSlug: string;
}

type Vote = "up" | "down";
type Status = "idle" | "voting" | "voted" | "submitting" | "done";

const ANON_KEY = "verdict_feedback_anon_id";
const VOTED_KEY_PREFIX = "verdict_voted_";
const TOAST_MS = 3000;

function getAnonId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(ANON_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(ANON_KEY, id);
    return id;
  } catch {
    return "";
  }
}

function getStoredVote(slug: string): Vote | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(`${VOTED_KEY_PREFIX}${slug}`);
    if (stored === "up" || stored === "down") return stored;
  } catch {
    /* ignore */
  }
  return null;
}

function setStoredVote(slug: string, vote: Vote) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${VOTED_KEY_PREFIX}${slug}`, vote);
  } catch {
    /* ignore */
  }
}

export function VerdictFeedbackWidget({ comparisonSlug }: VerdictFeedbackWidgetProps) {
  const [vote, setVote] = useState<Vote | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [showReasonForm, setShowReasonForm] = useState(false);
  const [reason, setReason] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const impressionFiredRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const existing = getStoredVote(comparisonSlug);
    if (existing) {
      setVote(existing);
      setStatus("done");
    }
    if (!impressionFiredRef.current) {
      impressionFiredRef.current = true;
      trackVerdictFeedbackImpression(comparisonSlug);
    }
  }, [comparisonSlug]);

  const showToast = () => {
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), TOAST_MS);
  };

  const submitVote = async (selected: Vote, withReason?: string) => {
    const payload = {
      comparisonSlug,
      vote: selected,
      reason: withReason?.trim() || undefined,
      anonId: getAnonId(),
    };
    try {
      await fetch("/api/verdict-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Silent fail — UX still gets the optimistic ack.
    }
  };

  const handleVote = async (selected: Vote) => {
    if (status !== "idle" && status !== "voting") return;
    setVote(selected);
    setStatus("voting");
    setStoredVote(comparisonSlug, selected);
    trackVerdictFeedbackVote(comparisonSlug, selected);
    await submitVote(selected);
    setShowReasonForm(true);
    setStatus("voted");
  };

  const handleSubmitReason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vote || status === "submitting") return;
    setStatus("submitting");
    if (reason.trim()) {
      await submitVote(vote, reason);
      trackVerdictFeedbackReasonSubmit(comparisonSlug, vote);
    }
    setShowReasonForm(false);
    setStatus("done");
    showToast();
  };

  const handleDismiss = () => {
    setShowReasonForm(false);
    setStatus("done");
    showToast();
  };

  const renderVoteButtons = (selected: Vote | null) => {
    const baseBtn =
      "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300";
    const upActive = selected === "up";
    const downActive = selected === "down";
    const isLocked = status === "done";

    return (
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => handleVote("up")}
          disabled={isLocked && !upActive}
          aria-pressed={upActive}
          className={`${baseBtn} ${
            upActive
              ? "bg-emerald-500/20 border-emerald-300/60 text-emerald-50"
              : "bg-white/10 border-white/20 text-white hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          <span aria-hidden>👍</span>
          <span>Yes</span>
        </button>
        <button
          type="button"
          onClick={() => handleVote("down")}
          disabled={isLocked && !downActive}
          aria-pressed={downActive}
          className={`${baseBtn} ${
            downActive
              ? "bg-rose-500/25 border-rose-300/60 text-rose-50"
              : "bg-white/10 border-white/20 text-white hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          <span aria-hidden>👎</span>
          <span>No</span>
        </button>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      data-verdict-feedback
      className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm sm:text-base font-semibold text-white">
            Was this verdict helpful?
          </p>
          {status === "done" && vote && (
            <p className="text-xs text-white/70 mt-0.5">
              You voted {vote === "up" ? "👍" : "👎"} on this verdict.{" "}
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setShowReasonForm(false);
                }}
                className="underline underline-offset-2 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 rounded"
              >
                Change vote
              </button>
            </p>
          )}
        </div>
        {renderVoteButtons(vote)}
      </div>

      {showReasonForm && vote && (
        <form onSubmit={handleSubmitReason} className="mt-4 space-y-2">
          <label htmlFor={`verdict-reason-${comparisonSlug}`} className="block text-xs text-white/80">
            What was off? (optional)
          </label>
          <textarea
            id={`verdict-reason-${comparisonSlug}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder={
              vote === "down"
                ? "Tell us what we got wrong…"
                : "Anything else you'd like us to know?"
            }
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 focus:border-yellow-300/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 resize-none"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              {status === "submitting" ? "Sending…" : "Send"}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              Skip
            </button>
          </div>
        </form>
      )}

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none mt-3 transition-opacity duration-300 ${
          toastVisible ? "opacity-100" : "opacity-0 h-0 overflow-hidden mt-0"
        }`}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-300/40 px-3 py-1.5 text-xs font-medium text-emerald-50">
          <span aria-hidden>✓</span>
          Thanks — we&apos;ll use this to improve our verdicts.
        </span>
      </div>
    </div>
  );
}
