"use client";

import { SITE_NAME } from "@/lib/utils/constants";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

const SECTIONS = [
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "cookies", title: "Cookies and Tracking" },
  { id: "analytics", title: "Analytics" },
  { id: "third-party-services", title: "Third-Party Services" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "data-sharing", title: "Data Sharing and Disclosure" },
  { id: "your-rights", title: "Your Rights" },
  { id: "data-retention", title: "Data Retention" },
  { id: "data-security", title: "Data Security" },
  { id: "childrens-privacy", title: "Children's Privacy" },
  { id: "international-transfers", title: "International Data Transfers" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export function PrivacyContent() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="March 2026"
      lastUpdatedISO="2026-03"
      sections={SECTIONS}
    >
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
      <section id="information-we-collect">
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
      <section id="cookies">
        <h2 className="text-2xl font-display font-bold text-text mb-4">2. Cookies and Tracking Technologies</h2>
        <p className="mb-4">
          {SITE_NAME} uses cookies and similar tracking technologies to enhance your experience and
          gather analytics data. Cookies are small text files placed on your device.
        </p>
        <h3 className="text-lg font-semibold text-text mb-2">Types of Cookies We Use</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong className="text-text">Essential cookies:</strong> Required for the website to function correctly. These cannot be disabled.</li>
          <li><strong className="text-text">Analytics cookies:</strong> Used to collect information about how visitors use the site. This data is aggregated and anonymous.</li>
          <li><strong className="text-text">Preference cookies:</strong> Remember your settings to personalize your experience.</li>
          <li><strong className="text-text">Advertising cookies:</strong> Where applicable, used to serve relevant advertisements with your consent.</li>
        </ul>
        <p>You can control or delete cookies through your browser settings. Disabling cookies may affect certain features of the site.</p>
      </section>

      {/* 3. Analytics */}
      <section id="analytics">
        <h2 className="text-2xl font-display font-bold text-text mb-4">3. Analytics</h2>
        <p className="mb-4">
          We use third-party analytics services, which may include Google Analytics, to understand
          traffic patterns and usage behavior. These services may set their own cookies.
        </p>
        <p className="mb-4">
          Where we use Google Analytics, we have enabled IP anonymization. You may opt out by installing the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>
        <p>Analytics data is retained in aggregated, anonymized form. We do not sell analytics data to third parties.</p>
      </section>

      {/* 4. Third-Party Services */}
      <section id="third-party-services">
        <h2 className="text-2xl font-display font-bold text-text mb-4">4. Third-Party Services</h2>
        <p className="mb-4">Our website may include integrations with or links to third-party services including:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Analytics providers (e.g., Google Analytics)</li>
          <li>Content delivery networks (CDNs)</li>
          <li>Advertising networks (where applicable)</li>
          <li>Embedded media or data providers</li>
        </ul>
        <p>These third parties have their own privacy policies. We are not responsible for their privacy practices.</p>
      </section>

      {/* 5. How We Use Your Information */}
      <section id="how-we-use">
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
      <section id="data-sharing">
        <h2 className="text-2xl font-display font-bold text-text mb-4">6. Data Sharing and Disclosure</h2>
        <p className="mb-4">We do not sell, trade, or rent your personal information. We may share information in these limited circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-text">Service providers:</strong> Trusted vendors who assist in operating the site, subject to confidentiality obligations.</li>
          <li><strong className="text-text">Legal requirements:</strong> Disclosure if required by law or valid legal process.</li>
          <li><strong className="text-text">Business transfers:</strong> In the event of a merger, acquisition, or sale of assets.</li>
          <li><strong className="text-text">Protection of rights:</strong> To protect the rights, property, or safety of {SITE_NAME}, our users, or others.</li>
        </ul>
      </section>

      {/* 7. User Rights */}
      <section id="your-rights">
        <h2 className="text-2xl font-display font-bold text-text mb-4">7. Your Rights</h2>
        <p className="mb-4">Depending on your location, you may have certain rights regarding your personal data:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong className="text-text">Right of access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong className="text-text">Right to rectification:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong className="text-text">Right to erasure:</strong> Request deletion of your personal data.</li>
          <li><strong className="text-text">Right to restrict processing:</strong> Request that we limit how we use your data.</li>
          <li><strong className="text-text">Right to data portability:</strong> Receive your data in a structured, machine-readable format.</li>
          <li><strong className="text-text">Right to object:</strong> Object to processing of your personal data in certain circumstances.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:contact@comparison.com" className="text-primary-600 hover:underline">contact@comparison.com</a>. We will respond within 30 days.
        </p>
      </section>

      {/* 8. Data Retention */}
      <section id="data-retention">
        <h2 className="text-2xl font-display font-bold text-text mb-4">8. Data Retention</h2>
        <p className="mb-4">We retain personal data only for as long as necessary:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Contact form submissions are retained for up to 24 months.</li>
          <li>Aggregated analytics data may be retained indefinitely in anonymized form.</li>
          <li>Server log files are typically retained for 90 days.</li>
        </ul>
        <p>When data is no longer needed, it is securely deleted or anonymized.</p>
      </section>

      {/* 9. Security */}
      <section id="data-security">
        <h2 className="text-2xl font-display font-bold text-text mb-4">9. Data Security</h2>
        <p>
          We implement industry-standard technical and organizational measures to protect your
          information. These include HTTPS encryption, access controls, and regular security reviews.
          However, no method of transmission over the internet is 100% secure.
        </p>
      </section>

      {/* 10. Children */}
      <section id="childrens-privacy">
        <h2 className="text-2xl font-display font-bold text-text mb-4">10. Children&apos;s Privacy</h2>
        <p>
          {SITE_NAME} is not directed to children under 13, and we do not knowingly collect personal
          information from children. If you believe we have collected information from a child under 13,
          contact us at{" "}
          <a href="mailto:contact@comparison.com" className="text-primary-600 hover:underline">contact@comparison.com</a>.
        </p>
      </section>

      {/* 11. International Transfers */}
      <section id="international-transfers">
        <h2 className="text-2xl font-display font-bold text-text mb-4">11. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own.
          We take appropriate steps to ensure compliance with applicable data protection laws.
        </p>
      </section>

      {/* 12. Changes */}
      <section id="changes">
        <h2 className="text-2xl font-display font-bold text-text mb-4">12. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. When we make material changes, we
          will update the &ldquo;Last updated&rdquo; date at the top of this page.
        </p>
        <p>Your continued use of {SITE_NAME} after any changes constitutes your acceptance of the revised Privacy Policy.</p>
      </section>

      {/* 13. Contact */}
      <section id="contact">
        <h2 className="text-2xl font-display font-bold text-text mb-4">13. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <div className="mt-4 bg-surface-alt border border-border rounded-xl p-5 text-sm">
          <p className="font-semibold text-text mb-1">{SITE_NAME}</p>
          <p>Email: <a href="mailto:contact@comparison.com" className="text-primary-600 hover:underline">contact@comparison.com</a></p>
          <p>Website: comparison.com</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
