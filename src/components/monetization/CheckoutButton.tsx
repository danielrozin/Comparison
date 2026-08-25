"use client";

import { useState } from "react";
import { trackCheckoutClicked } from "@/lib/utils/analytics";

/**
 * The one buy button. POSTs to /api/checkout:
 * - Stripe configured → redirect straight to Stripe's hosted checkout.
 * - Not yet → inline email field, founding-member reservation, honest copy
 *   ("nothing charged today"). Same component converts in both modes.
 */
export function CheckoutButton({
  plan,
  interval,
  src,
  label,
  className,
}: {
  plan: string;
  interval: string;
  src: string;
  label: string;
  className?: string;
}) {
  const [phase, setPhase] = useState<"idle" | "email" | "busy" | "done" | "error">("idle");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(withEmail: boolean) {
    setPhase("busy");
    if (!withEmail) trackCheckoutClicked(plan, interval, src); // first click only, not the email re-submit
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval, src, ...(withEmail ? { email } : {}) }),
      });
      const data = await res.json();
      if (data.mode === "stripe" && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (res.ok && data.mode === "reservation") {
        setMessage(data.message);
        setPhase("done");
        return;
      }
      // reservation mode needs an email — reveal the field
      if (res.status === 400 && !withEmail) {
        setPhase("email");
        return;
      }
      setMessage(data.error || "Something went wrong — try again.");
      setPhase("error");
    } catch {
      setMessage("Network error — try again.");
      setPhase("error");
    }
  }

  if (phase === "done") {
    return (
      <p className="text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3" role="status">
        ✓ {message}
      </p>
    );
  }

  if (phase === "email" || (phase === "error" && email) || (phase === "busy" && email)) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(true);
        }}
        className="space-y-2"
      >
        <label className="sr-only" htmlFor={`email-${plan}-${interval}`}>
          Email address
        </label>
        <input
          id={`email-${plan}-${interval}`}
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={phase === "busy"}
          className={className}
        >
          {phase === "busy" ? "Locking your price…" : "Lock my founding price"}
        </button>
        {phase === "error" && <p className="text-xs text-red-600">{message}</p>}
        <p className="text-[11px] text-text-secondary leading-snug">
          Nothing is charged today. Checkout opens this week — your link arrives by email, price locked.
        </p>
      </form>
    );
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => void submit(false)} disabled={phase === "busy"} className={className}>
        {phase === "busy" ? "One moment…" : label}
      </button>
      {phase === "error" && <p className="text-xs text-red-600">{message}</p>}
    </div>
  );
}
