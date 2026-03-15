import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${SITE_NAME} team. Report errors, request new comparisons, ask general questions, or explore partnership opportunities.`,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: `Contact ${SITE_NAME}`,
    description: `Get in touch with the ${SITE_NAME} team. We respond within 2 business days.`,
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
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
          <li className="text-text font-medium">Contact</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Left — Info */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-display font-black text-text mb-4">Get in Touch</h1>
          <p className="text-text-secondary leading-relaxed mb-8">
            Have a question, spotted an error, or want to suggest a new comparison? We read every
            message and respond as quickly as we can.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-text text-sm uppercase tracking-wider mb-1">
                Email
              </h3>
              <a
                href="mailto:contact@comparison.com"
                className="text-primary-600 hover:underline text-sm"
              >
                contact@comparison.com
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-text text-sm uppercase tracking-wider mb-2">
                What to Contact Us About
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">·</span>
                  General questions about the site
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">·</span>
                  Reporting incorrect or outdated data
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">·</span>
                  Requesting a new comparison or category
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">·</span>
                  Partnership and collaboration inquiries
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">·</span>
                  Press and media requests
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text text-sm uppercase tracking-wider mb-2">
                Response Time
              </h3>
              <p className="text-sm text-text-secondary">
                We aim to respond to all messages within 2 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="md:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
