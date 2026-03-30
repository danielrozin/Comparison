"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/utils/constants";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

const SECTIONS = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "use-of-site", title: "Use of the Site" },
  { id: "user-conduct", title: "User Conduct" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "third-party-links", title: "Third-Party Links" },
  { id: "user-generated-content", title: "User-Generated Content" },
  { id: "disclaimers", title: "Disclaimers" },
  { id: "limitation-of-liability", title: "Limitation of Liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "modifications", title: "Modifications to the Site" },
  { id: "governing-law", title: "Governing Law" },
  { id: "termination", title: "Termination" },
  { id: "entire-agreement", title: "Entire Agreement" },
  { id: "contact", title: "Contact" },
];

export function TermsContent() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      lastUpdated="March 2026"
      lastUpdatedISO="2026-03"
      sections={SECTIONS}
    >
      {/* Intro */}
      <section>
        <p>
          Please read these Terms of Use (&ldquo;Terms&rdquo;) carefully before using the {SITE_NAME} website
          located at{" "}
          <a href="https://comparison.com" className="text-primary-600 hover:underline">comparison.com</a>{" "}
          (&ldquo;the Site&rdquo;). By accessing or using the Site, you agree to be bound by these Terms. If you
          do not agree to all of these Terms, you must not use the Site.
        </p>
      </section>

      <section id="acceptance">
        <h2 className="text-2xl font-display font-bold text-text mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using {SITE_NAME}, you confirm that you are at least 13 years of age, that you have read and
          understood these Terms, and that you agree to be legally bound by them.
        </p>
        <p>
          We reserve the right to update or modify these Terms at any time. Changes will be effective
          immediately upon posting. Your continued use constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section id="use-of-site">
        <h2 className="text-2xl font-display font-bold text-text mb-4">2. Use of the Site</h2>
        <p className="mb-4">
          {SITE_NAME} grants you a limited, non-exclusive, non-transferable, revocable license to
          access and use the Site for personal, non-commercial informational purposes only.
        </p>
        <p className="mb-3">You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the Site for any unlawful purpose or in violation of applicable laws.</li>
          <li>Attempt to gain unauthorized access to any part of the Site or its systems.</li>
          <li>Use automated tools to access, collect, or index content without our written consent.</li>
          <li>Reproduce, sell, or resell any portion of the Site for commercial purposes.</li>
          <li>Transmit malicious code or harmful data to the Site.</li>
          <li>Interfere with the integrity or performance of the Site.</li>
          <li>Impersonate any person or entity.</li>
        </ul>
      </section>

      <section id="user-conduct">
        <h2 className="text-2xl font-display font-bold text-text mb-4">3. User Conduct</h2>
        <p className="mb-4">You must not submit content that is:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>False, misleading, or fraudulent</li>
          <li>Defamatory, abusive, harassing, or threatening</li>
          <li>Infringing upon intellectual property rights of others</li>
          <li>Containing personal information of others without consent</li>
          <li>Spam or unsolicited advertising</li>
          <li>In violation of any applicable law</li>
        </ul>
        <p>We reserve the right to remove content and restrict access for users who violate these standards.</p>
      </section>

      <section id="intellectual-property">
        <h2 className="text-2xl font-display font-bold text-text mb-4">4. Intellectual Property</h2>
        <p className="mb-4">
          All content on {SITE_NAME} is the property of {SITE_NAME} or its content suppliers and
          is protected by applicable intellectual property laws.
        </p>
        <p className="mb-4">
          You may share links or quote brief excerpts for non-commercial purposes with proper attribution.
        </p>
        <p>You may not reproduce, distribute, or create derivative works without our prior written permission.</p>
      </section>

      <section id="third-party-links">
        <h2 className="text-2xl font-display font-bold text-text mb-4">5. Third-Party Links and Content</h2>
        <p className="mb-4">
          The Site may contain links to third-party websites. These are provided for convenience only.
          We do not endorse or assume responsibility for third-party content or privacy practices.
        </p>
        <p>Accessing third-party links is at your own risk.</p>
      </section>

      <section id="user-generated-content">
        <h2 className="text-2xl font-display font-bold text-text mb-4">6. User-Generated Content</h2>
        <p className="mb-4">
          You grant {SITE_NAME} a worldwide, royalty-free, non-exclusive license to use, reproduce, modify,
          and display content you submit for the purposes of operating and improving the Site.
        </p>
        <p>We are not obligated to publish, retain, or act upon any user-submitted content.</p>
      </section>

      <section id="disclaimers">
        <h2 className="text-2xl font-display font-bold text-text mb-4">7. Disclaimers</h2>
        <p className="mb-4">
          THE SITE AND ITS CONTENT ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT
          WARRANTIES OF ANY KIND.
        </p>
        <p>
          Comparisons are for informational purposes only. See our{" "}
          <Link href="/disclaimer" className="text-primary-600 hover:underline">Disclaimer</Link> for more information.
        </p>
      </section>

      <section id="limitation-of-liability">
        <h2 className="text-2xl font-display font-bold text-text mb-4">8. Limitation of Liability</h2>
        <p className="mb-4">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE_NAME.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
        </p>
        <p>
          OUR TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID IN THE 12 MONTHS
          PRECEDING THE CLAIM, OR (B) $100.
        </p>
      </section>

      <section id="indemnification">
        <h2 className="text-2xl font-display font-bold text-text mb-4">9. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless {SITE_NAME} from any claims arising from: (a) your
          use of the Site; (b) your violation of these Terms; or (c) your violation of any rights of another.
        </p>
      </section>

      <section id="modifications">
        <h2 className="text-2xl font-display font-bold text-text mb-4">10. Modifications to the Site</h2>
        <p>
          We reserve the right to modify, suspend, or discontinue the Site at any time without notice or liability.
        </p>
      </section>

      <section id="governing-law">
        <h2 className="text-2xl font-display font-bold text-text mb-4">11. Governing Law and Dispute Resolution</h2>
        <p className="mb-4">
          These Terms shall be governed by applicable laws. Disputes shall first be attempted to be
          resolved through good-faith negotiation.
        </p>
        <p>
          You waive any right to participate in a class action lawsuit or class-wide arbitration against {SITE_NAME}.
        </p>
      </section>

      <section id="termination">
        <h2 className="text-2xl font-display font-bold text-text mb-4">12. Termination</h2>
        <p>
          We reserve the right to terminate or restrict your access at any time for any reason without notice.
          Provisions that should survive termination shall survive.
        </p>
      </section>

      <section id="entire-agreement">
        <h2 className="text-2xl font-display font-bold text-text mb-4">13. Entire Agreement</h2>
        <p>
          These Terms, together with our{" "}
          <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link> and{" "}
          <Link href="/disclaimer" className="text-primary-600 hover:underline">Disclaimer</Link>,
          constitute the entire agreement between you and {SITE_NAME}.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-display font-bold text-text mb-4">14. Contact</h2>
        <p className="mb-4">If you have any questions about these Terms, please contact us:</p>
        <div className="bg-surface-alt border border-border rounded-xl p-5 text-sm">
          <p className="font-semibold text-text mb-1">{SITE_NAME}</p>
          <p>Email: <a href="mailto:contact@comparison.com" className="text-primary-600 hover:underline">contact@comparison.com</a></p>
          <p>Website: comparison.com</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
