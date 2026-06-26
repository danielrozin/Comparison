import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const AUTHOR_NAME = "Daniel Rozin";
const AUTHOR_TITLE = "Founder & Editor-in-Chief";
const PAGE_URL = `${SITE_URL}/authors/daniel-rozin`;
const PAGE_DESCRIPTION = `Daniel Rozin is the founder of ${SITE_NAME}. A lifelong comparison enthusiast, he built this platform because he was curious about everything — economics, history, sports, trends, products, and software — and couldn't find a single place to compare them all. He writes and edits all primary comparison hub pages.`;

export const metadata: Metadata = {
  title: `${AUTHOR_NAME} — ${AUTHOR_TITLE} | ${SITE_NAME}`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${AUTHOR_NAME} — ${AUTHOR_TITLE} | ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "profile",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR_NAME,
  url: PAGE_URL,
  jobTitle: AUTHOR_TITLE,
  description: PAGE_DESCRIPTION,
  email: "Daniarozin@gmail.com",
  telephone: "+972503733010",
  founder: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  worksFor: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    founder: { "@type": "Person", name: AUTHOR_NAME, url: PAGE_URL },
  },
  knowsAbout: [
    "comparative analysis",
    "AI language models",
    "web browsers",
    "password managers",
    "technology comparisons",
    "sports statistics",
    "country and economic comparisons",
    "historical comparisons",
    "consumer product reviews",
    "software comparisons",
    "data-driven editorial methodology",
  ],
  sameAs: [
    "https://www.linkedin.com/in/daniel-rozin-56a066b0/",
    "https://www.facebook.com/daniel.rozin.94",
    SITE_URL,
  ],
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
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://www.linkedin.com/in/daniel-rozin-56a066b0/"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-xs text-primary-600 hover:underline font-medium"
                aria-label="Daniel Rozin on LinkedIn"
              >
                LinkedIn
              </a>
              <span className="text-text-secondary text-xs">·</span>
              <a
                href="https://www.facebook.com/daniel.rozin.94"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-xs text-primary-600 hover:underline font-medium"
                aria-label="Daniel Rozin on Facebook"
              >
                Facebook
              </a>
              <span className="text-text-secondary text-xs">·</span>
              <a
                href="mailto:Daniarozin@gmail.com"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Personal story — core E-E-A-T signal */}
      <section className="mb-10">
        <h2 className="text-xl font-display font-bold text-text mb-4">Why I Built This</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          I created {SITE_NAME} because I have always been fascinated by comparing things — and I
          mean <em>everything</em>. Economics, history, sports, trends, products, software, countries,
          people. The curiosity never stops. I want to know: which is better? How do they differ?
          What do the numbers actually say?
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          The problem was that no single tool existed that could answer all those questions in one
          place. Review sites only covered products. Sports databases only covered sports. Country
          comparison tools were dry and hard to use. And none of them let you just type two things
          and instantly see how they stack up side by side.
        </p>
        <p className="text-text-secondary leading-relaxed">
          So I built my own. I partnered with Shai, my co-founder and the technical brain behind the
          platform, and we set out to build the comparison tool I always wished existed. {SITE_NAME}{" "}
          is the result — a free, fast, universal comparison engine covering AI models, browsers,
          countries, athletes, products, history, and everything in between.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-display font-bold text-text mb-4">Expertise</h2>
        <ul className="list-disc list-inside space-y-1 text-text-secondary">
          <li>AI / large language models — architecture, benchmarks, licensing</li>
          <li>Web browser security, privacy, and performance</li>
          <li>Password manager security models and audit history</li>
          <li>Country and economic comparisons</li>
          <li>Sports statistics and athlete comparisons</li>
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

      {/* Co-founder call-out */}
      <section className="bg-surface-alt border border-border rounded-2xl p-6 mb-10">
        <h2 className="text-lg font-display font-bold text-text mb-3">Meet the Co-Founder</h2>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-lg font-display font-black text-primary-600 shrink-0">
            SA
          </div>
          <div>
            <p className="font-semibold text-text">Shai And</p>
            <p className="text-sm text-text-secondary mb-1">Co-Founder & CTO</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Shai is the technical architect and engineering lead behind {SITE_NAME}. He built and
              maintains the platform&apos;s infrastructure, data pipeline, and AI integration layer.
              Daniel and Shai have been building this together from day one.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://www.facebook.com/shai.and1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Facebook
              </a>
              <span className="text-text-secondary text-xs">·</span>
              <a
                href="mailto:Shai.and1@gmail.com"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
        <p className="text-text-secondary text-sm mb-3">
          Want to get in touch with Daniel?
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://www.linkedin.com/in/daniel-rozin-56a066b0/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Connect on LinkedIn
          </a>
          <a
            href="mailto:Daniarozin@gmail.com"
            className="inline-block px-4 py-2 bg-surface border border-border text-text text-sm font-semibold rounded-xl hover:bg-surface-alt transition-colors"
          >
            Send an Email
          </a>
        </div>
      </section>
    </article>
  );
}
