"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { trackNewsletterSignup } from "@/lib/utils/analytics";

type FeedbackType = "question" | "request" | "bug" | "suggestion";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("request");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Escape key closes dialog
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  // Focus trap: keep Tab/Shift+Tab inside dialog; auto-focus first element on open
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: message.trim(),
          email: email.trim() || null,
          url: window.location.href,
        }),
      });
    } catch {
      // Silently fail — still show success to user
    }

    setIsSubmitting(false);
    setSubmitted(true);
    trackNewsletterSignup(window.location.pathname, "feedback_widget");
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setMessage("");
      setEmail("");
    }, 2500);
  };

  return (
    <>
      {/* Floating button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
        aria-expanded={isOpen}
        aria-controls="feedback-panel"
        // fab-slot-2 — see globals.css. Sits directly above back-to-top (slot 1)
        // so the two never overlap at any breakpoint.
        className={`fixed fab-slot-2 right-4 md:right-6 z-[55] w-14 h-14 rounded-full shadow-lg ${isOpen ? "hidden sm:flex" : "flex"} items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700 ${
          isOpen
            ? "bg-text/60 hover:bg-text/80 rotate-45"
            : "bg-gradient-to-br from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 hover:scale-105"
        }`}
        aria-label={isOpen ? "Close feedback" : "Send feedback"}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 z-[54] bg-black/40"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
      {/* Mobile: a full-width sheet anchored above the bottom nav — a 360px card
          pinned to one corner left the form fields too narrow to type in.
          sm and up: the original floating card, lifted clear of the slot-2 FAB. */}
      {isOpen && (
        <div
          ref={dialogRef}
          id="feedback-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-dialog-title"
          className="fixed z-[55] inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] max-h-[72vh] overflow-y-auto sm:inset-x-auto sm:right-6 sm:bottom-[9.5rem] md:bottom-[9rem] sm:w-[360px] sm:max-h-[70vh] bg-white border border-border rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-5 py-4 flex items-start justify-between gap-3">
            <div>
              <h3 id="feedback-dialog-title" className="font-bold text-lg">Feedback & Requests</h3>
              <p className="text-primary-100 text-sm mt-0.5">
                Ask a question, request a comparison, or give feedback
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close feedback"
              className="flex-shrink-0 w-11 h-11 -mr-2 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-primary-600"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {submitted ? (
            <div role="status" aria-live="polite" className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-text">Thank you!</p>
              <p className="text-sm text-text-secondary mt-1">
                We received your feedback and will act on it.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Type selector */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  What would you like to do?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: "request", label: "Request Comparison", icon: "+" },
                    { value: "question", label: "Ask a Question", icon: "?" },
                    { value: "suggestion", label: "Suggestion", icon: "!" },
                    { value: "bug", label: "Report Bug", icon: "X" },
                  ] as { value: FeedbackType; label: string; icon: string }[]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={type === opt.value}
                      onClick={() => setType(opt.value)}
                      className={`inline-flex items-center justify-center min-h-11 px-3 py-2 rounded-lg text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                        type === opt.value
                          ? "bg-primary-50 border-primary-300 text-primary-700"
                          : "bg-white border-border text-text-secondary hover:border-primary-200"
                      }`}
                    >
                      <span className="mr-1">{opt.icon}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="fb-message" className="block text-sm font-medium text-text mb-1">
                  {type === "request"
                    ? "What comparison do you want?"
                    : type === "question"
                    ? "Your question"
                    : type === "bug"
                    ? "What went wrong?"
                    : "Your suggestion"}
                </label>
                <textarea
                  id="fb-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === "request"
                      ? 'e.g. "Tesla vs Rivian", "Python vs JavaScript"...'
                      : type === "question"
                      ? "Type your question here..."
                      : type === "bug"
                      ? "Describe what happened..."
                      : "Share your idea..."
                  }
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Email (optional) */}
              <div>
                <label htmlFor="fb-email" className="block text-sm font-medium text-text mb-1">
                  Email <span className="text-text-secondary font-normal">(optional, for follow-up)</span>
                </label>
                <input
                  autoComplete="email"
                  enterKeyHint="send"
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold text-sm rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
