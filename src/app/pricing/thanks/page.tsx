import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { HubShell } from "@/components/layout/HubShell";

const PAGE_TITLE = `You're in — ${SITE_NAME}`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: "Payment confirmed. Here's what happens next.",
  // post-checkout page — never index
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/pricing/thanks` },
};

/**
 * Stripe Checkout success_url lands here. Kept dependency-free on purpose:
 * whether provisioning is manual (launch week) or webhook-driven (Phase 2),
 * this page is honest either way — payment done, activation by email.
 */
export default function PricingThanksPage() {
  return (
    <HubShell
      eyebrow="Confirmed"
      title="You're in. Welcome aboard."
      lede="Payment received — your founding price is locked. Your account details and first custom-comparison instructions arrive by email within the hour."
      breadcrumbLabel="Thanks"
    >
      <div className="max-w-xl space-y-6">
        <ol className="space-y-4 text-sm text-text-secondary">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
            <span><strong className="text-text">Payment confirmed.</strong> Stripe has emailed you a receipt.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-xs font-bold">2</span>
            <span><strong className="text-text">Activation email.</strong> Within the hour you&apos;ll get a welcome email from {CONTACT_EMAIL} with how to request your first custom comparison.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-xs font-bold">3</span>
            <span><strong className="text-text">First request.</strong> Reply to that email with any matchup — it&apos;s live on the site within 24 hours.</span>
          </li>
        </ol>

        <p className="text-sm text-text-secondary">
          Didn&apos;t get the email? Write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-600 font-medium hover:underline">
            {CONTACT_EMAIL}
          </a>{" "}
          and a founder answers — usually the same day.
        </p>

        <Link
          href="/trending"
          className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          Browse trending comparisons →
        </Link>
      </div>
    </HubShell>
  );
}
