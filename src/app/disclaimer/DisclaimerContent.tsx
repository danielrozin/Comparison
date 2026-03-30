"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/utils/constants";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

const SECTIONS = [
  { id: "informational-purposes", title: "Informational Purposes Only" },
  { id: "accuracy", title: "Accuracy of Comparisons" },
  { id: "not-professional-advice", title: "Not Professional Advice" },
  { id: "data-sources", title: "Data Sources" },
  { id: "ai-content", title: "AI-Generated Content" },
  { id: "affiliate-disclosure", title: "Affiliate Disclosure" },
  { id: "no-guarantees", title: "No Guarantees" },
  { id: "external-links", title: "External Links" },
  { id: "limitation-of-liability", title: "Limitation of Liability" },
  { id: "changes", title: "Changes to This Disclaimer" },
  { id: "contact", title: "Contact" },
];

export function DisclaimerContent() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      lastUpdated="March 2026"
      lastUpdatedISO="2026-03"
      sections={SECTIONS}
    >
      {/* Intro */}
      <section>
        <p>
          The following disclaimer governs your use of {SITE_NAME} (&ldquo;the Site&rdquo;), accessible at{" "}
          <a href="https://comparison.com" className="text-primary-600 hover:underline">comparison.com</a>.
          By using the Site, you acknowledge and agree to these terms. Please also read our{" "}
          <Link href="/terms" className="text-primary-600 hover:underline">Terms of Use</Link> and{" "}
          <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
        </p>
      </section>

      <section id="informational-purposes">
        <h2 className="text-2xl font-display font-bold text-text mb-4">1. Informational Purposes Only</h2>
        <p className="mb-4">
          All content on {SITE_NAME} is provided for <strong className="text-text">general informational and educational
          purposes only</strong>. It does not constitute professional advice of any kind.
        </p>
        <p>Always seek qualified professional guidance before making decisions based on information from this Site.</p>
      </section>

      <section id="accuracy">
        <h2 className="text-2xl font-display font-bold text-text mb-4">2. Accuracy of Comparisons</h2>
        <p className="mb-4">
          While we strive for accuracy, we make no warranties about the completeness, accuracy, reliability,
          suitability, or timeliness of comparison data.
        </p>
        <p>
          If you notice incorrect information, please{" "}
          <Link href="/contact" className="text-primary-600 hover:underline">contact us</Link>.
        </p>
      </section>

      <section id="not-professional-advice">
        <h2 className="text-2xl font-display font-bold text-text mb-4">3. Not Professional Advice</h2>
        <p className="mb-4">{SITE_NAME} does not provide:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li><strong className="text-text">Financial or investment advice</strong></li>
          <li><strong className="text-text">Medical or health advice</strong></li>
          <li><strong className="text-text">Legal advice</strong></li>
          <li><strong className="text-text">Technical or purchasing advice</strong></li>
        </ul>
        <p>Reliance on any content is solely at your own risk.</p>
      </section>

      <section id="data-sources">
        <h2 className="text-2xl font-display font-bold text-text mb-4">4. Data Sources</h2>
        <p className="mb-4">{SITE_NAME} aggregates data from publicly available sources including:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Official statistics agencies and government databases</li>
          <li>Sports governing bodies and official records</li>
          <li>Manufacturer specifications</li>
          <li>Reputable academic references</li>
          <li>Public financial and economic reports</li>
        </ul>
        <p>{SITE_NAME} is not affiliated with any entities featured in our comparisons unless explicitly stated.</p>
      </section>

      <section id="ai-content">
        <h2 className="text-2xl font-display font-bold text-text mb-4">5. AI-Generated Content Disclosure</h2>
        <p className="mb-4">
          Some content — including summaries, key differences, pros and cons, verdicts, and FAQs — may be
          generated or assisted by AI systems. AI-generated content is reviewed for quality but may still
          contain errors.
        </p>
        <p>
          Report inaccurate content via our{" "}
          <Link href="/contact" className="text-primary-600 hover:underline">contact page</Link>.
        </p>
      </section>

      <section id="affiliate-disclosure">
        <h2 className="text-2xl font-display font-bold text-text mb-4">6. Affiliate Disclosure</h2>
        <p className="mb-4">
          Some links on our Site may be affiliate links. The presence of affiliate links does not influence
          our editorial content. We do not accept payment to favor any product or service.
        </p>
        <p>Affiliate relationships are disclosed in accordance with FTC guidelines.</p>
      </section>

      <section id="no-guarantees">
        <h2 className="text-2xl font-display font-bold text-text mb-4">7. No Guarantees</h2>
        <p>
          We do not guarantee any specific outcomes based on our comparisons. Comparisons inherently involve
          simplifications, and real-world outcomes depend on many factors beyond what any comparison can capture.
        </p>
      </section>

      <section id="external-links">
        <h2 className="text-2xl font-display font-bold text-text mb-4">8. External Links</h2>
        <p>
          Our Site may contain links to external websites. {SITE_NAME} is not responsible for external
          site content. Inclusion of a link does not imply endorsement.
        </p>
      </section>

      <section id="limitation-of-liability">
        <h2 className="text-2xl font-display font-bold text-text mb-4">9. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE_NAME} shall not be liable for any damages
          arising from your use of or reliance on content on the Site.
        </p>
      </section>

      <section id="changes">
        <h2 className="text-2xl font-display font-bold text-text mb-4">10. Changes to This Disclaimer</h2>
        <p>
          We may modify this Disclaimer at any time. Changes are effective immediately upon posting.
          Your continued use constitutes acceptance.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-display font-bold text-text mb-4">11. Contact</h2>
        <p className="mb-4">If you have questions about this Disclaimer, please contact us:</p>
        <div className="bg-surface-alt border border-border rounded-xl p-5 text-sm">
          <p className="font-semibold text-text mb-1">{SITE_NAME}</p>
          <p>Email: <a href="mailto:contact@comparison.com" className="text-primary-600 hover:underline">contact@comparison.com</a></p>
          <p>Website: comparison.com</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
