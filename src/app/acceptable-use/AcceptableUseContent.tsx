"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/utils/constants";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

const SECTIONS = [
  { id: "purpose", title: "Purpose" },
  { id: "prohibited-activities", title: "Prohibited Activities" },
  { id: "content-standards", title: "Content Standards" },
  { id: "enforcement", title: "Enforcement" },
  { id: "reporting", title: "Reporting Violations" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export function AcceptableUseContent() {
  return (
    <LegalPageLayout
      title="Acceptable Use Policy"
      lastUpdated="March 2026"
      lastUpdatedISO="2026-03"
      sections={SECTIONS}
    >
      <section>
        <p>
          This Acceptable Use Policy governs your use of {SITE_NAME}. By accessing the site, you agree
          to this policy alongside our{" "}
          <Link href="/terms" className="text-primary-600 hover:underline">Terms of Use</Link>.
        </p>
      </section>

      <section id="purpose">
        <h2 className="text-2xl font-display font-bold text-text mb-4">1. Purpose</h2>
        <p>
          {SITE_NAME} provides objective, data-driven comparisons. This policy ensures the platform
          remains trustworthy, accurate, and useful for all users.
        </p>
      </section>

      <section id="prohibited-activities">
        <h2 className="text-2xl font-display font-bold text-text mb-4">2. Prohibited Activities</h2>
        <p className="mb-4">You must not:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the Site for unlawful purposes</li>
          <li>Submit false, misleading, or spam content</li>
          <li>Harass, threaten, or abuse others</li>
          <li>Attempt to manipulate comparison data or rankings</li>
          <li>Use automated tools to scrape or collect data without authorization</li>
          <li>Upload malicious code or attempt to compromise security</li>
          <li>Impersonate other users or entities</li>
          <li>Violate the intellectual property rights of {SITE_NAME} or third parties</li>
        </ul>
      </section>

      <section id="content-standards">
        <h2 className="text-2xl font-display font-bold text-text mb-4">3. Content Standards</h2>
        <p className="mb-4">Any content you submit (feedback, contact messages, suggestions) must:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Be truthful and accurate to the best of your knowledge</li>
          <li>Not contain hate speech, profanity, or discriminatory language</li>
          <li>Not contain personal information about third parties without consent</li>
          <li>Not be used to promote products or services</li>
        </ul>
      </section>

      <section id="enforcement">
        <h2 className="text-2xl font-display font-bold text-text mb-4">4. Enforcement</h2>
        <p className="mb-4">Violations may result in:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Content removal</li>
          <li>IP or account restrictions</li>
          <li>Permanent access termination</li>
          <li>Legal action where appropriate</li>
        </ul>
      </section>

      <section id="reporting">
        <h2 className="text-2xl font-display font-bold text-text mb-4">5. Reporting Violations</h2>
        <p>
          If you encounter content or behavior that violates this policy, please{" "}
          <Link href="/contact" className="text-primary-600 hover:underline">contact us</Link>.
          We investigate all reports promptly.
        </p>
      </section>

      <section id="changes">
        <h2 className="text-2xl font-display font-bold text-text mb-4">6. Changes to This Policy</h2>
        <p>We may update this policy at any time. Changes are reflected in the &ldquo;Last updated&rdquo; date.</p>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-display font-bold text-text mb-4">7. Contact Us</h2>
        <p className="mb-4">Questions about this policy? Contact us:</p>
        <div className="bg-surface-alt border border-border rounded-xl p-5 text-sm">
          <p className="font-semibold text-text mb-1">{SITE_NAME}</p>
          <p>Email: <a href="mailto:contact@comparison.com" className="text-primary-600 hover:underline">contact@comparison.com</a></p>
          <p>Website: comparison.com</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
