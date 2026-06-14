import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

export const revalidate = 86400;

const TITLE = "Data Studies — Comparison Trends & Reports";
const DESCRIPTION =
  "Original data studies from A Versus B: what brands, SaaS tools, and products people compare most. Free to cite and republish with attribution.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/studies` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/studies`,
    type: "website",
    siteName: SITE_NAME,
  },
};

interface StudyEntry {
  slug: string;
  title: string;
  blurb: string;
  badge: string;
}

// Published studies. Add new entries here as the program scales.
const STUDIES: StudyEntry[] = [
  {
    slug: "b2b-saas-comparison-report-2026",
    title: "The B2B SaaS Comparison Report 2026",
    blurb:
      "384 head-to-head SaaS comparisons analyzed: the most-compared software tools, the hottest category rivalries, and where challengers are out-pacing incumbents.",
    badge: "Data Study",
  },
  {
    slug: "most-compared-brands-2026",
    title: "The Most-Compared Brands of 2026",
    blurb:
      "1,600+ head-to-head comparisons analyzed to rank the brands, SaaS tools, and matchups people research most this year.",
    badge: "Data Study",
  },
  {
    slug: "investing-comparison-report-2026",
    title: "The Investing & Finance Comparison Report 2026",
    blurb:
      "247 head-to-head finance comparisons analyzed: the most-researched brokerages, retirement accounts, credit cards, and investment products of 2026.",
    badge: "Data Study",
  },
];

export default function StudiesIndexPage() {
  const schema = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Studies", url: `${SITE_URL}/studies` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li className="text-text font-medium">Studies</li>
          </ol>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-2">Data Studies</h1>
        <p className="text-text-secondary mb-8 max-w-2xl">
          Original research built from our database of {SITE_NAME} comparisons. Every study is free
          to cite, quote, and republish with attribution and a link back.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {STUDIES.map((s) => (
            <Link
              key={s.slug}
              href={`/studies/${s.slug}`}
              className="block rounded-xl border border-border bg-surface p-6 hover:border-primary-600 transition-colors"
            >
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{s.badge}</span>
              <h2 className="text-xl font-display font-bold text-text mt-1 mb-2">{s.title}</h2>
              <p className="text-text-secondary text-sm">{s.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
