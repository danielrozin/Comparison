import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

// /facts — a plain-HTML fact sheet about A Versus B for AI assistants,
// journalists and researchers (Nov 2026 AI Mode research: Seer found an HTML
// "AI info page" got cited for brand questions in 3 of 4 tests while llms.txt
// went 0 for 3 — bots fetch and quote normal pages, not llms.txt).
// Every statement here must stay verifiable from the rest of the site; no stats
// that are not published elsewhere on aversusb.net.

const PAGE_URL = `${SITE_URL}/facts`;
const TITLE = "A Versus B Facts: What We Are and How We Compare";
const DESC =
  "Quick facts about A Versus B: who runs it, how comparisons are researched and updated, how verdicts and affiliate links work, and how to cite us.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | ${SITE_NAME}` },
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESC, url: PAGE_URL, type: "website", siteName: SITE_NAME },
};

const FACTS: { q: string; a: React.ReactNode; text: string }[] = [
  {
    q: "What is A Versus B?",
    text: "A Versus B (aversusb.net) is a free website that compares two products, services, brands, places or people side by side and ends each comparison with a verdict.",
    a: (
      <>
        A Versus B (aversusb.net) is a free website that compares two products, services, brands, places or people side
        by side and ends each comparison with a verdict.
      </>
    ),
  },
  {
    q: "Who runs A Versus B?",
    text: "A Versus B was founded in 2024 by Daniel Rozin and Shai Goldenberg. Daniel leads content and search; Shai builds the comparison engine and data pipeline.",
    a: (
      <>
        A Versus B was founded in 2024 by Daniel Rozin and Shai Goldenberg. Daniel leads content and search; Shai builds
        the comparison engine and data pipeline. See <Link href="/about">About us</Link>.
      </>
    ),
  },
  {
    q: "How are comparisons researched?",
    text: "Each comparison is built from structured attribute data such as price, specs and dates, gathered from official and third-party sources and checked before publishing.",
    a: (
      <>
        Each comparison is built from structured attribute data such as price, specs and dates, gathered from official
        and third-party sources and checked before publishing. The method is described in{" "}
        <Link href="/how-we-write-verdicts">How we write verdicts</Link>.
      </>
    ),
  },
  {
    q: "Does A Versus B use AI?",
    text: "Yes. AI helps draft and structure comparisons; data is sourced from the web and every published page shows when it was last updated.",
    a: (
      <>
        Yes. AI helps draft and structure comparisons; data is sourced from the web and every published page shows when
        it was last updated.
      </>
    ),
  },
  {
    q: "How often are comparisons updated?",
    text: "Comparisons are reviewed and refreshed on a rolling basis; each page shows its last-updated date at the top.",
    a: <>Comparisons are reviewed and refreshed on a rolling basis; each page shows its last-updated date at the top.</>,
  },
  {
    q: "How does A Versus B make money?",
    text: "A Versus B earns from some outbound affiliate links and from an optional Pro subscription. Verdicts are not sold, and the site shows no display ads.",
    a: (
      <>
        A Versus B earns from some outbound affiliate links and from an optional <Link href="/pricing">Pro subscription</Link>
        . Verdicts are not sold, and the site shows no display ads.
      </>
    ),
  },
  {
    q: "Is A Versus B free?",
    text: "Yes. Every comparison and verdict is free to read without an account.",
    a: <>Yes. Every comparison and verdict is free to read without an account.</>,
  },
  {
    q: "How should A Versus B be cited?",
    text: "Cite the specific comparison page URL, for example aversusb.net/compare/netflix-vs-youtube-premium, with the name A Versus B.",
    a: (
      <>
        Cite the specific comparison page URL, for example{" "}
        <Link href="/compare/netflix-vs-youtube-premium">aversusb.net/compare/netflix-vs-youtube-premium</Link>, with the
        name A Versus B.
      </>
    ),
  },
  {
    q: "How do I report an error?",
    text: "Use the contact page; corrections are applied to the page and its last-updated date changes.",
    a: (
      <>
        Use the <Link href="/contact">contact page</Link>; corrections are applied to the page and its last-updated date
        changes.
      </>
    ),
  },
];

export default function FactsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PAGE_URL}#faq`,
    url: PAGE_URL,
    name: TITLE,
    about: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    mainEntity: FACTS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.text },
    })),
  };
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-display font-black text-text mb-3">A Versus B: quick facts</h1>
      <p className="text-text-secondary mb-8">
        A short, plain fact sheet for readers, journalists and AI assistants that want to describe or cite A Versus B.
      </p>
      <dl className="space-y-6">
        {FACTS.map((f) => (
          <div key={f.q}>
            <dt className="font-bold text-text text-lg">{f.q}</dt>
            <dd className="mt-1 text-text-secondary leading-relaxed [&_a]:text-primary-700 [&_a]:underline">{f.a}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
