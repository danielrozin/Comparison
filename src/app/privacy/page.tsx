import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Read the ${SITE_NAME} Privacy Policy to understand how we collect, use, and protect your personal information.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: `Privacy Policy — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Privacy Policy.`,
    url: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
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
          <li className="text-text font-medium">Privacy Policy</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-display font-black text-text mb-3">Privacy Policy</h1>
        <p className="text-sm text-text-secondary">
          Last updated: <time dateTime="2026-03">March 2026</time>
        </p>
      </div>

      <div className="prose-like space-y-10 text-text-secondary leading-relaxed">

        {/* Intro */}
        <section>
          <p>
            Welcome to {SITE_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We operate the website at{" "}
            <a href="https://comparison.com" className="text-primary-600 hover:underline">
              comparison.com
            </a>
            . This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website. Please read this policy carefully. If you disagree
            with its terms, please discontinue use of the site.
          </p>
        </section>

        {/* 1. Data We Collect */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">1. Information We Collect</h2>
          <p className="mb-4">We may collect information about you in several ways:</p>

          <h3 className="text-lg font-semibold text-text mb-2">1.1 Information You Provide Directly</h3>
          <p className="mb-4">
            When you contact us via our contact form or email, we collect the name, email address,
            subject, and message body you provide. This information is used solely to respond to your
            inquiry and is not used for marketing without your explicit consent.
          </p>

          <h3 className="text-lg font-semibold text-text mb-2">1.2 Automatically Collected Information</h3>
          <p className="mb-3">
            When you visit {SITE_NAME}, our servers and third-party analytics services automatically
            collect certain technical information, including:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>IP address (anonymized where required by applicable law)</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on each page</li>
            <li>Referring URLs</li>
            <li>Device type and screen resolution</li>
            <li>Date and time of access</li>
          </ul>
          <p>
            This data helps us understand how our site is used so we can improve it. It is not used to
            identify individual users.
          </p>
        </section>

        {/* 2. Cookies */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">2. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            {SITE_NAME} uses cookies and similar tracking technologies to enhance your experience and
            gather analytics data. Cookies are small text files placed on your device.
          </p>

          <h3 className="text-lg font-semibold text-text mb-2">Types of Cookies We Use</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong className="text-text">Essential cookies:</strong> Required for the website to
              function correctly. These cannot be disabled.
            </li>
            <li>
              <strong className="text-text">Analytics cookies:</strong> Used to collect information about
              how visitors use the site (e.g., pages visited, session duration). This data is aggregated
              and anonymous.
            </li>
            <li>
              <strong className="text-text">Preference cookies:</strong> Remember your settings (such as
              display preferences) to personalize your experience.
            </li>
            <li>
              <strong className="text-text">Advertising cookies:</strong> Where applicable, used to
              serve relevant advertisements. We only use advertising cookies where you have provided
              consent or where permitted by law.
            </li>
          </ul>
          <p>
            You can control or delete cookies through your browser settings. Disabling cookies may
            affect certain features of the site.
          </p>
        </section>

        {/* 3. Analytics */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">3. Analytics</h2>
          <p className="mb-4">
            We use third-party analytics services, which may include Google Analytics, to understand
            traffic patterns and usage behavior. These services may set their own cookies and collect
            information in accordance with their own privacy policies.
          </p>
          <p className="mb-4">
            Where we use Google Analytics, we have enabled IP anonymization. You may opt out of Google
            Analytics tracking by installing the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-primary-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>
          <p>
            Analytics data is retained in aggregated, anonymized form. We do not sell analytics data
            to third parties.
          </p>
        </section>

        {/* 4. Third-Party Services */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">4. Third-Party Services</h2>
          <p className="mb-4">
            Our website may include integrations with or links to third-party services including, but
            not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Analytics providers (e.g., Google Analytics)</li>
            <li>Content delivery networks (CDNs)</li>
            <li>Advertising networks (where applicable)</li>
            <li>Embedded media or data providers</li>
          </ul>
          <p>
            These third parties have their own privacy policies, which govern how they handle your
            data. We are not responsible for the privacy practices of third-party services. We encourage
            you to review their policies before interacting with their content.
          </p>
        </section>

        {/* 5. How We Use Your Information */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">5. How We Use Your Information</h2>
          <p className="mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Operate and improve the {SITE_NAME} website and its features</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Analyze site usage and optimize content performance</li>
            <li>Detect, prevent, and address technical issues and abuse</li>
            <li>Comply with applicable legal obligations</li>
            <li>Send transactional communications (e.g., replies to contact form submissions)</li>
          </ul>
        </section>

        {/* 6. Data Sharing */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">6. Data Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share
            information in the following limited circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-text">Service providers:</strong> We may share data with trusted
              vendors who assist us in operating the site (e.g., hosting providers, analytics services),
              subject to confidentiality obligations.
            </li>
            <li>
              <strong className="text-text">Legal requirements:</strong> We may disclose information if
              required to do so by law or in response to valid legal process (e.g., subpoena, court
              order).
            </li>
            <li>
              <strong className="text-text">Business transfers:</strong> In the event of a merger,
              acquisition, or sale of assets, user information may be transferred as part of that
              transaction.
            </li>
            <li>
              <strong className="text-text">Protection of rights:</strong> We may disclose information
              to protect the rights, property, or safety of {SITE_NAME}, our users, or others.
            </li>
          </ul>
        </section>

        {/* 7. User Rights */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">7. Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal data,
            including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong className="text-text">Right of access:</strong> Request a copy of the personal
              data we hold about you.
            </li>
            <li>
              <strong className="text-text">Right to rectification:</strong> Request correction of
              inaccurate or incomplete data.
            </li>
            <li>
              <strong className="text-text">Right to erasure:</strong> Request deletion of your
              personal data, subject to certain exceptions.
            </li>
            <li>
              <strong className="text-text">Right to restrict processing:</strong> Request that we
              limit how we use your data.
            </li>
            <li>
              <strong className="text-text">Right to data portability:</strong> Receive your data in a
              structured, machine-readable format.
            </li>
            <li>
              <strong className="text-text">Right to object:</strong> Object to processing of your
              personal data in certain circumstances.
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{" "}
            <a href="mailto:contact@comparison.com" className="text-primary-600 hover:underline">
              contact@comparison.com
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        {/* 8. Data Retention */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">8. Data Retention</h2>
          <p className="mb-4">
            We retain personal data only for as long as necessary to fulfill the purposes described in
            this policy, or as required by law:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Contact form submissions are retained for up to 24 months.</li>
            <li>Aggregated analytics data may be retained indefinitely in anonymized form.</li>
            <li>Server log files are typically retained for 90 days.</li>
          </ul>
          <p>
            When data is no longer needed, it is securely deleted or anonymized in accordance with our
            data disposal procedures.
          </p>
        </section>

        {/* 9. Security */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">9. Data Security</h2>
          <p>
            We implement industry-standard technical and organizational measures to protect your
            information against unauthorized access, alteration, disclosure, or destruction. These
            measures include HTTPS encryption, access controls, and regular security reviews. However,
            no method of transmission over the internet or electronic storage is 100% secure. We cannot
            guarantee absolute security of your data.
          </p>
        </section>

        {/* 10. Children's Privacy */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">10. Children&apos;s Privacy</h2>
          <p>
            {SITE_NAME} is not directed to children under the age of 13, and we do not knowingly
            collect personal information from children. If you believe we have inadvertently collected
            information from a child under 13, please contact us immediately at{" "}
            <a href="mailto:contact@comparison.com" className="text-primary-600 hover:underline">
              contact@comparison.com
            </a>{" "}
            and we will take steps to delete such information promptly.
          </p>
        </section>

        {/* 11. International Transfers */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">11. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own.
            We take appropriate steps to ensure that any such transfers comply with applicable data
            protection laws and that your data remains protected to the standards described in this
            policy.
          </p>
        </section>

        {/* 12. Changes */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">12. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. When we make material changes, we
            will update the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to
            review this policy periodically to stay informed about how we protect your information.
          </p>
          <p>
            Your continued use of {SITE_NAME} after any changes constitutes your acceptance of the
            revised Privacy Policy.
          </p>
        </section>

        {/* 13. Contact */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">13. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices,
            please contact us:
          </p>
          <div className="mt-4 bg-surface-alt border border-border rounded-xl p-5 text-sm">
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
