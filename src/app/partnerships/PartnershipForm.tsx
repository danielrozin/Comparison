"use client";

import { useState } from "react";

const BUDGET_RANGES = [
  "Under $500/month",
  "$500 - $1,000/month",
  "$1,000 - $2,000/month",
  "$2,000+/month",
] as const;

const CATEGORIES = [
  "Technology (phones, laptops, software)",
  "Products (headphones, appliances, tools)",
  "Automotive",
  "Health & Wellness",
  "Finance & Insurance",
  "Education",
  "Other",
] as const;

const GOALS = [
  "Brand awareness",
  "Product comparisons / sponsored listings",
  "Lead generation",
  "Content partnerships",
  "Data / API access",
  "Other",
] as const;

export function PartnershipForm() {
  const [form, setForm] = useState({
    brandName: "",
    contactName: "",
    email: "",
    website: "",
    category: "",
    budget: "",
    goals: [] as string[],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoalToggle = (goal: string) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "partnership-inquiry",
          message: [
            `Brand: ${form.brandName}`,
            `Contact: ${form.contactName}`,
            `Website: ${form.website}`,
            `Category: ${form.category}`,
            `Budget: ${form.budget}`,
            `Goals: ${form.goals.join(", ")}`,
            ``,
            `Message: ${form.message}`,
          ].join("\n"),
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
      <div className="bg-surface-alt border border-border rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">&#10003;</div>
        <h3 className="font-display font-bold text-text text-lg mb-2">
          Thank you for your interest!
        </h3>
        <p className="text-text-secondary text-sm">
          We&apos;ll review your application and get back to you within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-text mb-1">
            Brand / Company Name *
          </label>
          <input
            id="brandName"
            name="brandName"
            type="text"
            required
            value={form.brandName}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none"
          />
        </div>
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-text mb-1">
            Contact Name *
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            required
            value={form.contactName}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none"
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-text mb-1">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            placeholder="https://"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-text mb-1">
            Monthly Budget *
          </label>
          <select
            id="budget"
            name="budget"
            required
            value={form.budget}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none"
          >
            <option value="">Select budget range</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Partnership Goals (select all that apply)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GOALS.map((goal) => (
            <label
              key={goal}
              className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary"
            >
              <input
                type="checkbox"
                checked={form.goals.includes(goal)}
                onChange={() => handleGoalToggle(goal)}
                className="rounded border-border text-primary-600 focus:ring-primary-600"
              />
              {goal}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text mb-1">
          Tell us about your goals
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="What are you looking to achieve with this partnership?"
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting..." : "Submit Partnership Inquiry"}
      </button>

      {status === "error" && (
        <p className="text-red-500 text-sm text-center">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}
