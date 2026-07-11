"use client";

// DAN-1980 — on-site usability-study sign-up form. Collects the four fields the
// ticket specifies (name, email, time slots, device) and POSTs to /api/ux-study,
// which emails the founder. Keeping this on-site (vs an external Google Form)
// means the recruitment banner always links somewhere that works.

import { useState } from "react";
import { trackUxStudyBannerClick } from "@/lib/utils/analytics";

const TIME_SLOTS = ["Weekday mornings", "Weekday afternoons", "Evenings", "Weekends"];
const DEVICES = ["Desktop", "Mobile", "Both"];

export function UxStudyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [device, setDevice] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function toggleSlot(slot: string) {
    setSlots((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Please enter a valid email.");
    if (slots.length === 0) return setError("Please pick at least one time slot.");
    if (!device) return setError("Please tell us what device you use.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/ux-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), timeSlots: slots, device }),
      });
      if (!res.ok) throw new Error("API error");
      trackUxStudyBannerClick("/ux-study");
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again, or email daniarozin@gmail.com.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div role="status" aria-live="polite" className="mx-auto max-w-[560px] px-4 py-20 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100" aria-hidden="true">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-text">You&apos;re on the list — thank you!</h1>
        <p className="text-text-secondary">
          We&apos;ll email you at <span className="font-medium text-text">{email}</span> to schedule your session
          and send your $25 gift card afterwards. You can close this tab now.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px] px-4 py-10 sm:py-14">
      <div className="mb-8 text-center">
        <span className="mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-primary-600 to-accent-600 px-3 py-1 text-sm font-bold text-white">
          Earn $25
        </span>
        <h1 className="text-3xl font-bold text-text">Help us improve this site</h1>
        <p className="mt-3 text-text-secondary">
          We&apos;re running a short <strong>30-minute paid usability study</strong> and looking for a handful of
          people who use comparison sites. If selected, you&apos;ll get a <strong>$25 Amazon gift card</strong> for
          your time. Sign up below — it takes under a minute.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="ux-name" className="mb-1.5 block text-sm font-semibold text-text">
            Name
          </label>
          <input
            id="ux-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/60"
          />
        </div>

        <div>
          <label htmlFor="ux-email" className="mb-1.5 block text-sm font-semibold text-text">
            Email
          </label>
          <input
            id="ux-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/60"
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-text">When are you usually available?</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TIME_SLOTS.map((slot) => (
              <label
                key={slot}
                className={`flex cursor-pointer items-center rounded-lg border px-3.5 py-2.5 text-sm transition-all ${
                  slots.includes(slot)
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-border hover:border-primary-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={slots.includes(slot)}
                  onChange={() => toggleSlot(slot)}
                  className="mr-2.5 accent-primary-600"
                />
                {slot}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-text">
            What device do you use to visit comparison sites?
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {DEVICES.map((d) => (
              <label
                key={d}
                className={`flex cursor-pointer items-center justify-center rounded-lg border px-3.5 py-2.5 text-sm transition-all ${
                  device === d
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-border hover:border-primary-300"
                }`}
              >
                <input
                  type="radio"
                  name="ux-device"
                  value={d}
                  checked={device === d}
                  onChange={() => setDevice(d)}
                  className="sr-only"
                />
                {d}
              </label>
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 py-3 font-semibold text-white transition-all hover:from-primary-700 hover:to-accent-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Count me in →"}
        </button>

        <p className="text-center text-xs text-text-secondary">
          We&apos;ll only use your email to schedule the study and send your gift card. No spam, ever.
        </p>
      </form>
    </div>
  );
}
