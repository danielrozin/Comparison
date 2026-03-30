"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/utils/constants";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

const SECTIONS = [
  { id: "what-are-cookies", title: "What Are Cookies" },
  { id: "cookies-we-use", title: "Cookies We Use" },
  { id: "third-party-cookies", title: "Third-Party Cookies" },
  { id: "managing-cookies", title: "Managing Cookies" },
  { id: "consent", title: "Your Consent" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export function CookiePolicyContent() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      lastUpdated="March 2026"
      lastUpdatedISO="2026-03"
      sections={SECTIONS}
    >
      <section>
        <p>
          This Cookie Policy explains how {SITE_NAME} uses cookies and similar technologies.
          Please read it alongside our{" "}
          <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
        </p>
      </section>

      <section id="what-are-cookies">
        <h2 className="text-2xl font-display font-bold text-text mb-4">1. What Are Cookies</h2>
        <p>
          Cookies are small text files placed on your device when you visit a website. They help
          sites remember preferences, understand usage patterns, and improve your experience.
        </p>
      </section>

      <section id="cookies-we-use">
        <h2 className="text-2xl font-display font-bold text-text mb-4">2. Cookies We Use</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-surface-alt">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-text">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-text">Purpose</th>
                <th className="text-left px-4 py-3 font-semibold text-text">Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3 font-medium text-text">Essential</td>
                <td className="px-4 py-3">Site functionality, security</td>
                <td className="px-4 py-3">Yes</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-text">Analytics</td>
                <td className="px-4 py-3">Aggregated usage statistics</td>
                <td className="px-4 py-3">No</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-text">Preferences</td>
                <td className="px-4 py-3">Display and comparison layout settings</td>
                <td className="px-4 py-3">No</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-text">Advertising</td>
                <td className="px-4 py-3">Serve relevant advertisements (with consent)</td>
                <td className="px-4 py-3">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="third-party-cookies">
        <h2 className="text-2xl font-display font-bold text-text mb-4">3. Third-Party Cookies</h2>
        <p className="mb-4">Some cookies are set by services we integrate with:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Google Analytics (usage analytics)</li>
          <li>Google AdSense (where applicable)</li>
          <li>Content delivery networks</li>
        </ul>
      </section>

      <section id="managing-cookies">
        <h2 className="text-2xl font-display font-bold text-text mb-4">4. Managing Cookies</h2>
        <p className="mb-4">You can control cookies through:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Our cookie consent banner (click &ldquo;Cookie Preferences&rdquo; in the footer)</li>
          <li>Your browser settings</li>
          <li>Third-party opt-out tools (e.g., Google Analytics opt-out)</li>
        </ul>
      </section>

      <section id="consent">
        <h2 className="text-2xl font-display font-bold text-text mb-4">5. Your Consent</h2>
        <p>
          Non-essential cookies are only set after you provide consent. You can withdraw or change
          your preferences at any time via the &ldquo;Cookie Preferences&rdquo; link in the footer.
        </p>
      </section>

      <section id="changes">
        <h2 className="text-2xl font-display font-bold text-text mb-4">6. Changes to This Policy</h2>
        <p>We may update this Cookie Policy at any time. Changes are reflected in the &ldquo;Last updated&rdquo; date.</p>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-display font-bold text-text mb-4">7. Contact Us</h2>
        <p className="mb-4">Questions about cookies? Contact us:</p>
        <div className="bg-surface-alt border border-border rounded-xl p-5 text-sm">
          <p className="font-semibold text-text mb-1">{SITE_NAME}</p>
          <p>Email: <a href="mailto:contact@comparison.com" className="text-primary-600 hover:underline">contact@comparison.com</a></p>
          <p>Website: comparison.com</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
