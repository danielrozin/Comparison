import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Read the ${SITE_NAME} Terms of Use before accessing our website. Understand your rights and responsibilities as a user.`,
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: `Terms of Use — ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Terms of Use.`,
    url: `${SITE_URL}/terms`,
  },
};

export default function TermsPage() {
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
          <li className="text-text font-medium">Terms of Use</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-display font-black text-text mb-3">Terms of Use</h1>
        <p className="text-sm text-text-secondary">
          Last updated: <time dateTime="2026-03">March 2026</time>
        </p>
      </div>

      <div className="space-y-10 text-text-secondary leading-relaxed">

        {/* Intro */}
        <section>
          <p>
            Please read these Terms of Use (&ldquo;Terms&rdquo;) carefully before using the {SITE_NAME} website
            located at{" "}
            <a href="https://comparison.com" className="text-primary-600 hover:underline">
              comparison.com
            </a>{" "}
            (&ldquo;the Site&rdquo;). By accessing or using the Site, you agree to be bound by these Terms. If you
            do not agree to all of these Terms, you must not use the Site.
          </p>
        </section>

        {/* 1. Acceptance */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using {SITE_NAME}, you confirm that you are at least 13 years of age (or
            the minimum age required by applicable law in your jurisdiction), that you have read and
            understood these Terms, and that you agree to be legally bound by them.
          </p>
          <p>
            We reserve the right to update or modify these Terms at any time. Changes will be effective
            immediately upon posting. Your continued use of the Site after any changes constitutes your
            acceptance of the revised Terms. We encourage you to review these Terms periodically.
          </p>
        </section>

        {/* 2. Use of the Site */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">2. Use of the Site</h2>
          <p className="mb-4">
            {SITE_NAME} grants you a limited, non-exclusive, non-transferable, revocable license to
            access and use the Site for personal, non-commercial informational purposes only.
          </p>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the Site for any unlawful purpose or in violation of any applicable laws or regulations.</li>
            <li>Attempt to gain unauthorized access to any part of the Site or its underlying systems.</li>
            <li>
              Use automated tools (e.g., bots, scrapers, crawlers) to access, collect, or index content
              from the Site without our prior written consent.
            </li>
            <li>Reproduce, duplicate, copy, sell, or resell any portion of the Site for commercial purposes.</li>
            <li>Transmit any malicious code, malware, or harmful data to or through the Site.</li>
            <li>
              Interfere with or disrupt the integrity or performance of the Site or its related services.
            </li>
            <li>
              Impersonate any person or entity, or falsely represent your affiliation with any person or entity.
            </li>
          </ul>
        </section>

        {/* 3. User Conduct */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">3. User Conduct</h2>
          <p className="mb-4">
            When interacting with {SITE_NAME} (including via contact forms or any future community
            features), you agree to conduct yourself in a respectful and lawful manner. You must not
            submit content that is:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>False, misleading, or fraudulent</li>
            <li>Defamatory, abusive, harassing, or threatening</li>
            <li>Infringing upon the intellectual property rights of others</li>
            <li>Containing personal or private information of others without their consent</li>
            <li>Spam, unsolicited advertising, or promotional material</li>
            <li>In violation of any applicable law or regulation</li>
          </ul>
          <p>
            We reserve the right to remove any content and restrict or terminate access for users who
            violate these conduct standards.
          </p>
        </section>

        {/* 4. Intellectual Property */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">4. Intellectual Property</h2>
          <p className="mb-4">
            All content on {SITE_NAME} — including but not limited to text, graphics, comparison data,
            UI design, logos, and code — is the property of {SITE_NAME} or its content suppliers and
            is protected by applicable copyright, trademark, and other intellectual property laws.
          </p>
          <p className="mb-4">
            You may share links to {SITE_NAME} content or quote brief excerpts for non-commercial,
            informational purposes, provided that you give proper attribution to {SITE_NAME} and include
            a link back to the original page.
          </p>
          <p>
            You may not reproduce, distribute, display, modify, or create derivative works from any
            content on this Site without our prior written permission.
          </p>
        </section>

        {/* 5. Third-Party Links */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">5. Third-Party Links and Content</h2>
          <p className="mb-4">
            The Site may contain links to third-party websites or reference third-party data sources.
            These links are provided for your convenience only. We do not endorse, control, or assume
            responsibility for the content, privacy practices, or reliability of any third-party site.
          </p>
          <p>
            Accessing third-party links from {SITE_NAME} is at your own risk. We encourage you to
            review the terms and privacy policies of any third-party sites you visit.
          </p>
        </section>

        {/* 6. User-Generated Content */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">6. User-Generated Content</h2>
          <p className="mb-4">
            To the extent that {SITE_NAME} allows users to submit content (including feedback, requests,
            or suggestions via contact forms), you grant {SITE_NAME} a worldwide, royalty-free,
            non-exclusive license to use, reproduce, modify, and display such content for the purposes
            of operating and improving the Site.
          </p>
          <p className="mb-4">
            You represent and warrant that any content you submit: (a) is your original work or you
            have the right to submit it; (b) does not infringe the rights of any third party; and (c)
            does not violate any applicable law.
          </p>
          <p>
            We are not obligated to publish, retain, or act upon any user-submitted content.
          </p>
        </section>

        {/* 7. Disclaimers */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">7. Disclaimers</h2>
          <p className="mb-4">
            THE SITE AND ITS CONTENT ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES
            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, OR NON-INFRINGEMENT.
          </p>
          <p className="mb-4">
            {SITE_NAME} does not warrant that: (a) the Site will be error-free or uninterrupted; (b)
            the information on the Site is complete, accurate, or up to date; or (c) the Site is free
            of viruses or other harmful components.
          </p>
          <p>
            Comparisons and data presented on this Site are for informational purposes only and do not
            constitute professional advice of any kind. See our{" "}
            <Link href="/disclaimer" className="text-primary-600 hover:underline">
              Disclaimer
            </Link>{" "}
            for more information.
          </p>
        </section>

        {/* 8. Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, {SITE_NAME.toUpperCase()} AND ITS AFFILIATES, OFFICERS,
            DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO YOUR USE OF OR INABILITY TO
            USE THE SITE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID
            TO ACCESS THE SITE (IF ANY) IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S.
            DOLLARS ($100).
          </p>
        </section>

        {/* 9. Indemnification */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless {SITE_NAME} and its affiliates, officers,
            directors, employees, and agents from and against any claims, liabilities, damages, losses,
            and expenses (including reasonable legal fees) arising out of or in connection with: (a) your
            access to or use of the Site; (b) your violation of these Terms; or (c) your violation of
            any rights of another person or entity.
          </p>
        </section>

        {/* 10. Modifications to the Site */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">10. Modifications to the Site</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the Site (or any portion of it)
            at any time, with or without notice. We shall not be liable to you or any third party for
            any modification, suspension, or discontinuation of the Site.
          </p>
        </section>

        {/* 11. Governing Law */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">11. Governing Law and Dispute Resolution</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with applicable laws, without
            regard to conflict of law principles. Any dispute arising from these Terms or your use of
            the Site shall first be attempted to be resolved through good-faith negotiation.
          </p>
          <p>
            If a dispute cannot be resolved through negotiation, it shall be submitted to binding
            arbitration in accordance with applicable arbitration rules, or resolved in the courts of
            competent jurisdiction. You waive any right to participate in a class action lawsuit or
            class-wide arbitration against {SITE_NAME}.
          </p>
        </section>

        {/* 12. Termination */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">12. Termination</h2>
          <p>
            We reserve the right, in our sole discretion, to terminate or restrict your access to the
            Site at any time and for any reason, including violation of these Terms, without notice or
            liability. All provisions of these Terms that by their nature should survive termination
            shall survive, including ownership provisions, warranty disclaimers, and limitations of
            liability.
          </p>
        </section>

        {/* 13. Entire Agreement */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">13. Entire Agreement</h2>
          <p>
            These Terms, together with our{" "}
            <Link href="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/disclaimer" className="text-primary-600 hover:underline">
              Disclaimer
            </Link>
            , constitute the entire agreement between you and {SITE_NAME} with respect to your use of
            the Site and supersede all prior agreements, understandings, and representations.
          </p>
        </section>

        {/* 14. Contact */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-4">14. Contact</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us:
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
