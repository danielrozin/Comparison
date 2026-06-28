import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const AUTHOR_NAME = "Daniel Rozin";
const AUTHOR_TITLE = "Founder & Editor-in-Chief";
const PAGE_URL = `${SITE_URL}/authors/daniel-rozin`;
const PAGE_TITLE = `${AUTHOR_NAME} — ${AUTHOR_TITLE}`;
const PAGE_DESCRIPTION = `${AUTHOR_NAME} is the founder of ${SITE_NAME}, a data-driven comparison platform covering AI/LLMs, browsers, password managers, and 17 other product categories. He writes and edits all primary comparison hub pages.`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "profile",
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(PAGE_TITLE)}&type=author`, width: 1200, height: 630, alt: `${AUTHOR_NAME} — Founder of A Versus B` }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  other: {
    "citation_author": AUTHOR_NAME,
    "citation_title": PAGE_TITLE,
    "citation_journal_title": SITE_NAME,
    "citation_language": "en",
    "DC.creator": AUTHOR_NAME,
    "DC.title": PAGE_TITLE,
    "DC.publisher": SITE_NAME,
    "DC.language": "en",
    "DC.identifier": PAGE_URL,
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${PAGE_URL}#person`,
  name: AUTHOR_NAME,
  givenName: "Daniel",
  familyName: "Rozin",
  url: PAGE_URL,
  email: "daniarozin@gmail.com",
  jobTitle: AUTHOR_TITLE,
  worksFor: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
  },
  description: PAGE_DESCRIPTION,
  knowsAbout: [
    "AI language models",
    "web browsers",
    "password managers",
    "technology comparisons",
    "data-driven journalism",
    "SEO",
    "SaaS",
    "consumer electronics",
  ],
  sameAs: [
    SITE_URL,
    "https://www.linkedin.com/in/daniel-rozin-56a066b0/",
    "https://www.facebook.com/daniel.rozin.94",
  ],
  mainEntityOfPage: {
    "@type": "ProfilePage",
    "@id": PAGE_URL,
  },
};

const ARTICLES = [
  {
    title: "Best Password Managers Compared (2026)",
    url: "/password-manager-comparison",
    date: "2026-05-22",
  },
  {
    title: "Best Browsers Compared (2026)",
    url: "/browser-comparison-2026",
    date: "2026-05-22",
  },
  {
    title: "LLM Comparison: GPT-4o vs Claude vs Gemini (2026)",
    url: "/llm-comparisons",
    date: "2026-05-22",
  },
];

export default function DanielRozinPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={schema} />

      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">Authors</li>
          <li>/</li>
          <li className="text-text font-medium">{AUTHOR_NAME}</li>
        </ol>
      </nav>

      <header className="mb-10">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-display font-black text-primary-600 shrink-0">
            DR
          </div>
          <div>
            <h1 className="text-3xl font-display font-black text-text">{AUTHOR_NAME}</h1>
            <p className="text-text-secondary font-medium">{AUTHOR_TITLE}, {SITE_NAME}</p>
          </div>
        </div>
        <p className="text-lg text-text-secondary leading-relaxed">
          Daniel Rozin founded {SITE_NAME} to bring transparent, data-driven comparisons to the web.
          He personally researches, writes, and maintains the primary comparison hub pages — including
          the LLM, browser, and password-manager comparison guides. All factual claims in his articles
          are cited to primary sources (vendor documentation, academic papers, or independently audited datasets).
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-display font-bold text-text mb-4">Expertise</h2>
        <ul className="list-disc list-inside space-y-1 text-text-secondary">
          <li>AI / large language models — architecture, benchmarks, licensing</li>
          <li>Web browser security, privacy, and performance</li>
          <li>Password manager security models and audit history</li>
          <li>Data-driven product comparisons and editorial methodology</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-display font-bold text-text mb-4">Editorial Standards</h2>
        <p className="text-text-secondary leading-relaxed mb-3">
          All comparison hub pages authored by Daniel follow the{" "}
          <Link href="/password-manager-comparison/methodology" className="text-primary-600 hover:underline">
            {SITE_NAME} Comparison Methodology
          </Link>
          : primary-source citations only, visible &ldquo;as of&rdquo; dates on all time-sensitive figures,
          and a public correction policy. No vendor relationships influence scores or rankings.
        </p>
        <p className="text-text-secondary leading-relaxed">
          For corrections or source disputes, contact:{" "}
          <a href="mailto:contact@aversusb.net" className="text-primary-600 hover:underline">
            contact@aversusb.net
          </a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-display font-bold text-text mb-4">Published Articles</h2>
        <ul className="space-y-3">
          {ARTICLES.map((a) => (
            <li key={a.url} className="border border-border rounded-xl p-4 flex items-center justify-between">
              <Link href={a.url} className="text-primary-600 hover:underline font-medium">
                {a.title}
              </Link>
              <time dateTime={a.date} className="text-sm text-text-secondary ml-4 shrink-0">
                {new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
