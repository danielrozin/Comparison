"use client";

import { useState } from "react";

type FeedbackType = "question" | "request" | "bug" | "suggestion";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("request");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Store in localStorage for now (in production, send to API)
    const feedback = JSON.parse(localStorage.getItem("comparison_feedback") || "[]");
    feedback.push({
      id: `fb-${Date.now()}`,
      type,
      message: message.trim(),
      email: email.trim() || null,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("comparison_feedback", JSON.stringify(feedback));

    // TODO: Send to API
    // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ type, message, email, url: window.location.href }) });

    setIsSubmitting(false);
    setSubmitted(true);
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
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700 rotate-45"
            : "bg-primary-600 hover:bg-primary-700 hover:scale-105"
        }`}
        aria-label={isOpen ? "Close feedback" : "Send feedback"}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-primary-600 text-white px-5 py-4">
            <h3 className="font-bold text-lg">Feedback & Requests</h3>
            <p className="text-primary-100 text-sm mt-0.5">
              Ask a question, request a comparison, or give feedback
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      onClick={() => setType(opt.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
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
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-colors resize-none"
                />
              </div>

              {/* Email (optional) */}
              <div>
                <label htmlFor="fb-email" className="block text-sm font-medium text-text mb-1">
                  Email <span className="text-text-secondary font-normal">(optional, for follow-up)</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
