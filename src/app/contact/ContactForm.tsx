"use client";

import { useState } from "react";
import Link from "next/link";

const SUBJECTS = [
  "General Inquiry",
  "Bug Report",
  "Content Request",
  "Partnership",
  "Other",
] as const;

type Subject = (typeof SUBJECTS)[number];

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "" as Subject | "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: `contact-${form.subject}`,
          message: `Name: ${form.name}\nSubject: ${form.subject}\n\n${form.message}`,
          email: form.email,
          url: window.location.href,
        }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text mb-2">Message Sent</h2>
        <p className="text-text-secondary text-sm mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 2 business days.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({ name: "", email: "", subject: "", message: "" });
          }}
          className="text-sm text-primary-600 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-alt border border-border rounded-2xl p-8 space-y-5"
    >
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Your full name"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-text mb-1.5">
          Subject <span className="text-red-500">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
        >
          <option value="" disabled>
            Select a subject…
          </option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us how we can help…"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>

      <p className="text-xs text-text-secondary text-center">
        By submitting this form you agree to our{" "}
        <Link href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
