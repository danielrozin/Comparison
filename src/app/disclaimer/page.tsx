import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Read the ${SITE_NAME} Disclaimer. Understand the limitations of our comparison data, our data sources, and important disclosures.`,
  alternates: { canonical: `${SITE_URL}/disclaimer` },
  openGraph: {
    title: `Disclaimer — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Disclaimer covering data accuracy, affiliate disclosures, and limitations of liability.`,
    url: `${SITE_URL}/disclaimer`,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">Disclaimer</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-display font-black text-text mb-3">Disclaimer</h1>
        <p className="text-sm text-text-secondary">
          Last updated: <time dateTime="2026-03">March 2026</time>
        </p>
      </div>

      <div className="space-y-10 text-text-secondary leading-relaxed">

        {/* Intro */}
        <section>
          <p>
            The following disclaimer governs your use of {SITE_NAME} (&ldquo;the Site&rdquo;), accessible at{" "}
            <a href="https://comparison.com" className="text-primary-600 hover:underline">
              comparison.com
            </a>
            . By using the Site, you acknowledge and agree to the terms set out in this Disclaimer.
            Please read it carefully alongside our{" "}
            <Link href="/terms" className="text-primary-600 hover:underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        {/* 1. Informational Purposes Only */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">
            1. Informational Purposes Only
          </h2>
          <p className="mb-4">
            All content published on {SITE_NAME} — including comparisons, data tables, summaries,
            verdicts, pros and cons lists, and FAQs — is provided for <strong className="text-text">general informational
            and educational purposes only</strong>. It does not constitute professional advice of any kind.
          </p>
          <p>
            You should not rely on any information from this Site as a substitute for professional
            medical, legal, financial, technical, or other expert advice. Always seek the guidance of a
            qualified professional before making decisions based on information obtained from this Site.
          </p>
        </section>

        {/* 2. Accuracy of Comparisons */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">
            2. Accuracy of Comparisons
          </h2>
          <p className="mb-4">
            While we make every effort to ensure the accuracy and completeness of the comparison
            information presented on {SITE_NAME}, we make no representations or warranties of any kind,
            express or implied, about the:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Completeness, accuracy, or reliability of any comparison</li>
            <li>Suitability of the information for any particular purpose</li>
            <li>Timeliness of the data presented</li>
          </ul>
          <p className="mb-4">
            Comparison data — particularly for rapidly changing subjects such as consumer electronics,
            sports statistics, economic indicators, and company information — can become outdated
            quickly. We encourage users to verify data independently before relying on it for important
            decisions.
          </p>
          <p>
            Any errors or omissions in our content are unintentional. If you notice incorrect or
            outdated information, please{" "}
            <Link href="/contact" className="text-primary-600 hover:underline">
              contact us
            </Link>{" "}
            and we will investigate and correct it promptly.
          </p>
        </section>

        {/* 3. Not Professional Advice */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">
            3. Not Professional Advice
          </h2>
          <p className="mb-4">
            {SITE_NAME} does not provide professional advice of any nature, including but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>
              <strong className="text-text">Financial or investment advice:</strong> Comparisons of
              companies, economies, stocks, or financial products are for informational purposes and
              should not be used to make investment decisions.
            </li>
            <li>
              <strong className="text-text">Medical or health advice:</strong> Any health-related
              comparisons do not constitute medical advice. Consult a qualified healthcare professional.
            </li>
            <li>
              <strong className="text-text">Legal advice:</strong> Nothing on this Site constitutes
              legal advice. Consult a licensed attorney for legal matters.
            </li>
            <li>
              <strong className="text-text">Technical or purchasing advice:</strong> Product comparisons
              reflect general data and may not account for your specific needs or use case.
            </li>
          </ul>
          <p>
            Reliance on any content from this Site is solely at your own risk.
          </p>
        </section>

        {/* 4. Data Sources */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">4. Data Sources</h2>
          <p className="mb-4">
            {SITE_NAME} aggregates data from a variety of publicly available sources including, but
            not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Official statistics agencies and government databases</li>
            <li>Sports governing bodies and official league records</li>
            <li>Manufacturer and brand published specifications</li>
            <li>Reputable encyclopedic and academic references</li>
            <li>Publicly available financial and economic reports</li>
            <li>News and media organizations</li>
          </ul>
          <p className="mb-4">
            We do not guarantee the accuracy of data derived from third-party sources. Data sourced
            from external providers is subject to their own accuracy limitations and terms of use.
          </p>
          <p>
            {SITE_NAME} is an independent platform and is not affiliated with, endorsed by, or
            sponsored by any of the individuals, brands, organizations, or entities featured in our
            comparisons, unless explicitly stated.
          </p>
        </section>

        {/* 5. AI-Generated Content */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">
            5. AI-Generated Content Disclosure
          </h2>
          <p className="mb-4">
            Some content on {SITE_NAME} — including comparison summaries, key differences, pros and
            cons, verdict sections, and FAQ answers — may be generated or assisted by artificial
            intelligence (AI) systems. AI-generated content is reviewed by our team for quality and
            accuracy, but may still contain errors, omissions, or outdated information.
          </p>
          <p className="mb-4">
            AI-generated content reflects patterns in training data and may not account for the latest
            developments or nuances in fast-moving fields. We are committed to transparency about the
            use of AI tools in our content creation process.
          </p>
          <p>
            If you identify content that appears to be inaccurate or misleading, please report it via
            our{" "}
            <Link href="/contact" className="text-primary-600 hover:underline">
              contact page
            </Link>
            .
          </p>
        </section>

        {/* 6. Affiliate Disclosure */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">6. Affiliate Disclosure</h2>
          <p className="mb-4">
            {SITE_NAME} may participate in affiliate marketing programs. This means that some links
            on our Site may be affiliate links — if you click on one of these links and make a
            purchase, we may receive a commission at no additional cost to you.
          </p>
          <p className="mb-4">
            The presence of affiliate links does not influence the editorial content of our comparisons.
            We do not accept payment to feature, promote, or favor any particular product, brand, or
            service in our comparisons. Our editorial decisions are made independently.
          </p>
          <p>
            Where applicable, affiliate relationships will be disclosed on the relevant pages in
            accordance with applicable advertising disclosure regulations, including FTC guidelines.
          </p>
        </section>

        {/* 7. No Guarantees */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">7. No Guarantees</h2>
          <p className="mb-4">
            {SITE_NAME} does not guarantee any specific outcomes, results, or experiences based on
            information or comparisons found on the Site. We make no guarantee that:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>
              A product, service, or entity that rates favorably in a comparison will meet your
              individual needs.
            </li>
            <li>
              Statistical comparisons will reflect the current state of any subject at the time of your
              visit.
            </li>
            <li>
              Opinions, verdicts, or summaries represent universally accepted positions.
            </li>
          </ul>
          <p>
            Comparisons inherently involve simplifications. Real-world outcomes depend on many factors
            beyond what any comparison can capture.
          </p>
        </section>

        {/* 8. External Links */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">8. External Links</h2>
          <p>
            Our Site may contain links to external websites for reference or convenience. {SITE_NAME}
            does not control the content of external sites and is not responsible for the accuracy,
            legality, or reliability of any information found there. Inclusion of a link does not imply
            endorsement. We recommend reviewing the terms and privacy policies of any external site
            you visit.
          </p>
        </section>

        {/* 9. Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">
            9. Limitation of Liability
          </h2>
          <p className="mb-4">
            To the fullest extent permitted by law, {SITE_NAME} and its operators, employees, and
            affiliates shall not be liable for any direct, indirect, incidental, special, consequential,
            or punitive damages arising from your use of or reliance on any content provided on the Site.
          </p>
          <p>
            This includes, without limitation, any errors or omissions in content, loss of data,
            business interruption, or any other harm resulting from use of or inability to use the Site
            or its content.
          </p>
        </section>

        {/* 10. Changes */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">
            10. Changes to This Disclaimer
          </h2>
          <p>
            We reserve the right to modify this Disclaimer at any time. Changes will be effective
            immediately upon posting to the Site. The &ldquo;Last updated&rdquo; date at the top of this page will
            reflect any revisions. Your continued use of the Site after changes are posted constitutes
            your acceptance of the revised Disclaimer.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">11. Contact</h2>
          <p className="mb-4">
            If you have questions about this Disclaimer, please contact us:
          </p>
          <div className="bg-surface-alt border border-border rounded-xl p-5 text-sm">
            <p className="font-semibold text-text mb-1">{SITE_NAME}</p>
            <p>
              Email:{" "}
              <a href="mailto:contact@comparison.com" className="text-primary-600 hover:underline">
                contact@comparison.com
              </a>
            </p>
            <p>Website: comparison.com</p>
          </div>
        </section>

      </div>
    </div>
  );
}
