import type { Metadata } from "next";
import Link from "next/link";
import { getB2BSaaSStudy } from "@/lib/services/studies-service";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

export const revalidate = 86400; // refresh the dataset once a day

const PATH = "/studies/b2b-saas-comparison-report-2026";
const CANONICAL = `${SITE_URL}${PATH}`;
const TITLE = "The B2B SaaS Comparison Report 2026 — Data Study";
const DESCRIPTION =
  "We analyzed 384 head-to-head SaaS comparisons to rank the most-compared B2B software tools, the hottest category rivalries, and where challengers are out-pacing incumbents in 2026.";
const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent("B2B SaaS Comparison Report 2026")}&type=trending`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "article",
    siteName: SITE_NAME,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "B2B SaaS Comparison Report 2026" }],
  },
  twitter: {
    card: "summary_large_image",
      site: "@aversusb",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImage],
  },
  other: {
    "citation_title": TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": DESCRIPTION,
    "citation_publication_date": "2026-06-01",
    "citation_online_date": "2026-06-01",
    "DC.title": TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": CANONICAL,
    "DC.date": "2026-06-01",
  },
};

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export default async function B2BSaaSStudyPage() {
  const study = await getB2BSaaSStudy();

  const updatedLabel = new Date(study.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const maxCluster = Math.max(...study.clusters.map((c) => c.count), 1);
  const topTool = study.topTools[0];
  const topChallenger = study.challengers[0];

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Studies", url: `${SITE_URL}/studies` },
    { name: "B2B SaaS Comparison Report 2026", url: CANONICAL },
  ]);

  // Dataset + Article schema so the study is eligible for rich results and
  // citation by AI overviews / answer engines.
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "The B2B SaaS Comparison Report 2026",
    description: DESCRIPTION,
    url: CANONICAL,
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    datePublished: "2026-06-01",
    dateModified: study.updatedAt,
    measurementTechnique:
      "Aggregation of published B2B software head-to-head comparison pages on aversusb.net",
    variableMeasured: "Number of comparison pages each SaaS tool appears in",
    keywords: ["B2B SaaS", "software comparison", "CRM", "project management", "email marketing"],
    encodingFormat: ["text/html", "application/ld+json"],
    spatialCoverage: { "@type": "Place", name: "Global" },
    temporalCoverage: "2026",
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": ["Article", "TechArticle", "ScholarlyArticle"],
    "@id": `${CANONICAL}#article`,
    headline: TITLE,
    description: DESCRIPTION,
    abstract: DESCRIPTION,
    mainEntityOfPage: CANONICAL,
    url: CANONICAL,
    genre: "Data Study",
    inLanguage: "en-US",
    alternativeHeadline: "Which B2B SaaS Tools Are Compared Most in 2026? — A Versus B Data Study",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    datePublished: "2026-06-01",
    dateModified: study.updatedAt,
    lastReviewed: study.updatedAt,
    contentReferenceTime: study.updatedAt,
    thumbnailUrl: ogImage,
    image: {
      "@type": "ImageObject",
      "@id": `${CANONICAL}#primaryImage`,
      url: ogImage,
      contentUrl: ogImage,
      width: 1200,
      height: 630,
      caption: "B2B SaaS Comparison Report 2026 — A Versus B Data Study",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© 2026 ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightYear: 2026,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Researchers, Software Buyers, Business Analysts, Procurement Teams" },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["structuralNavigation", "alternativeText", "readingOrder"],
    educationalLevel: "General",
    teaches: "How to compare B2B SaaS tools across categories using structured benchmark data",
    educationalUse: "research",
    keywords: "B2B SaaS comparison, software comparison report 2026, SaaS benchmarks, data study",
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro"] },
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: { "@type": "ReadAction", target: CANONICAL },
  };

  const citation = `${SITE_NAME}, "The B2B SaaS Comparison Report 2026," aversusb.net, ${updatedLabel}. ${CANONICAL}`;
  const embedHtml = `<a href="${CANONICAL}">The B2B SaaS Comparison Report 2026 — A Versus B</a>`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/studies" className="hover:text-primary-600">Studies</Link></li>
            <li>/</li>
            <li className="text-text font-medium">B2B SaaS Comparison Report 2026</li>
          </ol>
        </nav>

        <header className="mb-10">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-2">
            Data Study · Updated {updatedLabel}
          </p>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-text mb-4 leading-tight">
            The B2B SaaS Comparison Report 2026
          </h1>
          <p id="page-intro" className="text-lg text-text-secondary">
            Software buyers comparison-shop harder than anyone. We analyzed{" "}
            <strong>{fmt(study.totalSaaSComparisons)}</strong> published head-to-head SaaS comparisons
            across <strong>{fmt(study.distinctTools)}</strong> distinct tools to find the products
            buyers evaluate most, the category rivalries driving demand, and where younger challengers
            are out-pacing the incumbents in 2026.
          </p>
        </header>

        {/* Key stat cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-3xl font-black text-text">{fmt(study.totalSaaSComparisons)}</div>
            <div className="text-sm text-text-secondary mt-1">SaaS comparisons analyzed</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-3xl font-black text-text">{fmt(study.distinctTools)}</div>
            <div className="text-sm text-text-secondary mt-1">Distinct SaaS tools</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-3xl font-black text-text">{topTool ? topTool.name : "—"}</div>
            <div className="text-sm text-text-secondary mt-1">
              Most-compared tool{topTool ? ` (${topTool.count} matchups)` : ""}
            </div>
          </div>
        </section>

        {/* Top SaaS tools */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-text mb-2">
            Most-compared B2B SaaS tools
          </h2>
          <p className="text-text-secondary mb-5">
            Ranked by how many distinct comparison pages each tool appears in. CRM and marketing
            platforms dominate — they sit at the center of the widest webs of buyer research.
          </p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface text-text-secondary">
                <tr>
                  <th className="text-left font-semibold px-4 py-3 w-12">#</th>
                  <th className="text-left font-semibold px-4 py-3">SaaS tool</th>
                  <th className="text-right font-semibold px-4 py-3">Comparisons</th>
                </tr>
              </thead>
              <tbody>
                {study.topTools.map((t) => (
                  <tr key={t.slug} className="border-t border-border">
                    <td className="px-4 py-3 text-text-secondary font-medium">{t.rank}</td>
                    <td className="px-4 py-3">
                      <Link href={`/entity/${t.slug}`} className="font-medium text-text hover:text-primary-600">
                        {t.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-text">{t.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Category clusters */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-text mb-2">
            Where SaaS buyers compare most
          </h2>
          <p className="text-text-secondary mb-5">
            Comparison demand by software category. Email marketing &amp; CRM and website builders
            draw the most head-to-head research — the categories where switching costs bite and the
            choice actually changes the business.
          </p>
          <div className="space-y-3">
            {study.clusters.map((c) => (
              <div key={c.slug}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <Link
                    href={`/category/software/${c.slug}`}
                    className="font-medium text-text hover:text-primary-600"
                  >
                    <span className="mr-2">{c.icon}</span>
                    {c.label}
                  </Link>
                  <span className="text-text-secondary">
                    {fmt(c.count)} comparisons
                    {c.topMatchup ? (
                      <>
                        {" · "}
                        <Link href={`/compare/${c.topMatchup.slug}`} className="hover:text-primary-600">
                          {c.topMatchup.title}
                        </Link>
                      </>
                    ) : null}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-600"
                    style={{ width: `${Math.max(4, Math.round((c.count / maxCluster) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Challenger vs incumbent */}
        {study.challengers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-display font-bold text-text mb-2">
              Challengers out-pacing the incumbents
            </h2>
            <p className="text-text-secondary mb-5">
              In these categories a newer entrant now shows up in more buyer comparisons than the
              established player it was built to unseat — a leading signal of a shifting market.
              {topChallenger
                ? ` ${topChallenger.challenger} leads, appearing in ${topChallenger.challengerCount} matchups vs ${topChallenger.incumbent}'s ${topChallenger.incumbentCount}.`
                : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {study.challengers.map((c) => (
                <div
                  key={`${c.challengerSlug}-${c.incumbentSlug}`}
                  className="rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <div className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">
                    {c.category}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Link href={`/entity/${c.challengerSlug}`} className="font-semibold text-text hover:text-primary-600">
                      {c.challenger}
                    </Link>
                    <span className="font-bold text-primary-600">{c.challengerCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-text-secondary mt-1">
                    <Link href={`/entity/${c.incumbentSlug}`} className="hover:text-primary-600">
                      {c.incumbent}
                    </Link>
                    <span>{c.incumbentCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Methodology */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-text mb-3">Methodology</h2>
          <div className="prose-sm text-text-secondary space-y-3">
            <p>
              We took every published comparison in the software vertical on {SITE_NAME} as of{" "}
              {updatedLabel} — {fmt(study.totalSaaSComparisons)} head-to-head SaaS pages — and counted
              how many distinct comparisons each tool appears in. A tool matched against many rivals
              ranks higher because it sits at the center of a wider web of buyer research.
            </p>
            <p>
              The tool leaderboard counts software products only; programming languages and frameworks
              are excluded. Category clusters are assigned by keyword-matching each comparison&rsquo;s
              tools to our software subcategories (CRM, project management, AI tools, and so on). The
              &ldquo;challengers&rdquo; cut surfaces categories where a newer entrant appears in more
              comparisons than the incumbent it competes against. Data is refreshed daily from our live
              database.
            </p>
            <p className="text-xs">
              {study.fromSnapshot
                ? "Figures shown are from our most recent published snapshot."
                : "Figures shown reflect live data as of page generation."}
            </p>
          </div>
        </section>

        {/* Cite / reuse box — the link-earning hook */}
        <section className="rounded-xl border border-primary-600/30 bg-primary-600/5 p-6 mb-12">
          <h2 className="text-xl font-display font-bold text-text mb-2">Cite or republish this study</h2>
          <p className="text-text-secondary text-sm mb-4">
            This data is free to reference, quote, and republish with attribution and a link back to{" "}
            {SITE_NAME}. Writing a SaaS roundup or market report? Reach out via our{" "}
            <Link href="/contact" className="text-primary-600 hover:underline">contact page</Link> for
            a custom data cut or a high-res chart.
          </p>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">Citation</div>
              <pre className="whitespace-pre-wrap break-words rounded-lg bg-surface border border-border p-3 text-xs text-text">{citation}</pre>
            </div>
            <div>
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">Link / embed</div>
              <pre className="whitespace-pre-wrap break-words rounded-lg bg-surface border border-border p-3 text-xs text-text">{embedHtml}</pre>
            </div>
          </div>
        </section>

        <footer className="border-t border-border pt-6 text-sm text-text-secondary">
          <p>
            See the companion study,{" "}
            <Link href="/studies/most-compared-brands-2026" className="text-primary-600 hover:underline">
              The Most-Compared Brands of 2026
            </Link>
            , or browse all{" "}
            <Link href="/category/software" className="text-primary-600 hover:underline">software comparisons</Link>.
            Want the raw data behind a category? See our{" "}
            <Link href="/partnerships" className="text-primary-600 hover:underline">partnerships page</Link>.
          </p>
        </footer>
      </article>
    </>
  );
}
