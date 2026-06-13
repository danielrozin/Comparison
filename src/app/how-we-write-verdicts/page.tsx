import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "How we write verdicts",
  description: `How ${SITE_NAME} produces the AI-assisted verdict at the top of every comparison page — sourcing, the role of the AI model, the role of human editors, and how your feedback shapes future verdicts.`,
  alternates: { canonical: `${SITE_URL}/how-we-write-verdicts` },
  openGraph: {
    title: `How we write verdicts — ${SITE_NAME}`,
    description: `How ${SITE_NAME} produces the AI-assisted verdict at the top of every comparison page.`,
    url: `${SITE_URL}/how-we-write-verdicts`,
  },
};

export default function HowWeWriteVerdictsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">How we write verdicts</li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-3">
          How we write verdicts
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          Every &ldquo;Our Verdict&rdquo; section on {SITE_NAME} is AI-assisted. This page explains
          where the data comes from, what the AI does, what humans do, and how your feedback shapes
          future verdicts.
        </p>
      </header>

      <article className="prose prose-lg max-w-none space-y-10">
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            How we source data
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Verdicts are grounded in three layers of data:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>
              <strong className="text-text">Specs.</strong> Structured attributes (price, size,
              performance numbers, release dates, etc.) pulled from manufacturer pages, official
              datasheets, and curated reference sources.
            </li>
            <li>
              <strong className="text-text">Verified reviews.</strong> Aggregated public reviews
              from sources like Reddit, G2, Capterra, Trustpilot, and Product Hunt — normalized into
              ratings and recurring pros/cons.
            </li>
            <li>
              <strong className="text-text">Live web context.</strong> Recent search-engine results
              and news snippets used to surface anything that&apos;s changed since the page was last
              refreshed.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            The role of the AI model vs. our human editor
          </h2>
          <p className="text-text-secondary leading-relaxed">
            We use Claude (Anthropic&apos;s large language model) to read the structured data and
            reviews above and produce a first draft of the verdict, the &ldquo;Choose X if&rdquo;
            cards, and the supporting summary. The model only sees data we&apos;ve already
            collected — it does not browse the open web at write time.
          </p>
          <p className="text-text-secondary leading-relaxed mt-3">
            A human editor then reviews drafts that fall below an internal quality threshold or that
            cover sensitive categories (health, finance, legal, safety). Editors check for
            accuracy, remove unsupported claims, and adjust tone. Pages that have been
            human-reviewed are flagged in our internal system.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            How feedback influences future verdicts
          </h2>
          <p className="text-text-secondary leading-relaxed">
            The 👍 / 👎 widget under each verdict is the fastest way to tell us when something is
            off. We use those votes — and the optional written reasons — in three ways:
          </p>
          <ol className="list-decimal pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>Pages with persistent negative feedback get prioritized for human review.</li>
            <li>
              Common categories of complaint (&ldquo;misses recent release,&rdquo; &ldquo;ignores
              battery life,&rdquo; etc.) feed back into the prompt and data pipeline so the next
              regeneration covers them.
            </li>
            <li>
              We sample reader feedback when we evaluate new model versions — a verdict that wins on
              human reads but loses on reader feedback gets rolled back.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            Disagree with a specific verdict?
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Use the <strong className="text-text">&ldquo;Was this verdict helpful?&rdquo;</strong>{" "}
            buttons directly under the verdict on any comparison page. Tap{" "}
            <span aria-hidden>👎</span> &ldquo;No,&rdquo; and a short text box will appear where you
            can tell us what we got wrong — recent release, missing context, factual error, biased
            framing, anything. Reasons go straight into our editorial queue.
          </p>
          <p className="text-text-secondary leading-relaxed mt-3">
            Prefer email? Reach us at{" "}
            <Link href="/contact" className="text-primary-600 hover:underline">
              our contact page
            </Link>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
