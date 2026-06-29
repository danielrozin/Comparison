import type { Metadata } from "next";
import Link from "next/link";
import { getMostComparedStudy } from "@/lib/services/studies-service";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

export const revalidate = 86400; // refresh the dataset once a day

const PATH = "/studies/most-compared-brands-2026";
const CANONICAL = `${SITE_URL}${PATH}`;
const TITLE = "The Most-Compared Brands of 2026 — Data Study";
const DESCRIPTION =
  "We analyzed 1,600+ head-to-head comparisons to rank the brands, SaaS tools, and matchups people research most in 2026. See the full data study and methodology.";
const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent("Most-Compared Brands of 2026")}&type=trending`;

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
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Most-Compared Brands of 2026" }],
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
    "citation_publication_date": "2026-05-15",
    "citation_online_date": "2026-05-15",
    "DC.title": TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": CANONICAL,
    "DC.date": "2026-05-15",
  },
};

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

const TYPE_LABELS: Record<string, string> = {
  software: "SaaS",
  company: "Company",
  product: "Product",
  brand: "Brand",
  team: "Sports team",
};

export default async function MostComparedStudyPage() {
  const study = await getMostComparedStudy();

  const updatedLabel = new Date(study.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const maxCat = Math.max(...study.categories.map((c) => c.count), 1);
  const topBrand = study.topBrands[0];

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Studies", url: `${SITE_URL}/studies` },
    { name: "Most-Compared Brands of 2026", url: CANONICAL },
  ]);

  // Dataset + Article schema so the study is eligible for rich results and
  // citation by AI overviews / answer engines.
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Most-Compared Brands of 2026",
    description: DESCRIPTION,
    url: CANONICAL,
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    datePublished: "2026-05-15",
    dateModified: study.updatedAt,
    measurementTechnique:
      "Aggregation of published head-to-head comparison pages on aversusb.net",
    variableMeasured: "Number of comparison pages each brand appears in",
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
    alternativeHeadline: "What Brands Do People Compare Most in 2026? — A Versus B Data Study",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    datePublished: "2026-05-15",
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
      caption: "Most-Compared Brands of 2026 — A Versus B Data Study",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© 2026 ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightYear: 2026,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Researchers, Marketers, Business Analysts, Consumers" },
    accessMode: ["textual"],
    keywords: "most compared brands 2026, brand comparison data, popular comparisons, data study, top brands",
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro"] },
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: { "@type": "ReadAction", target: CANONICAL },
  };

  const citation = `${SITE_NAME}, "The Most-Compared Brands of 2026," aversusb.net, ${updatedLabel}. ${CANONICAL}`;
  const embedHtml = `<a href="${CANONICAL}">The Most-Compared Brands of 2026 — A Versus B</a>`;

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
            <li className="text-text font-medium">Most-Compared Brands 2026</li>
          </ol>
        </nav>

        <header className="mb-10">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-2">
            Data Study · Updated {updatedLabel}
          </p>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-text mb-4 leading-tight">
            The Most-Compared Brands of 2026
          </h1>
          <p id="page-intro" className="text-lg text-text-secondary">
            Which brands does the internet argue about most? We analyzed{" "}
            <strong>{fmt(study.totalComparisons)}</strong> published head-to-head comparisons across{" "}
            <strong>{fmt(study.distinctBrands)}</strong> distinct entities to find the brands, SaaS
            tools, and matchups people research most this year.
          </p>
        </header>

        {/* Key stat cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-3xl font-black text-text">{fmt(study.totalComparisons)}</div>
            <div className="text-sm text-text-secondary mt-1">Comparisons analyzed</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-3xl font-black text-text">{fmt(study.distinctBrands)}</div>
            <div className="text-sm text-text-secondary mt-1">Distinct brands &amp; entities</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-3xl font-black text-text">
              {topBrand ? topBrand.name : "—"}
            </div>
            <div className="text-sm text-text-secondary mt-1">
              Most-compared brand{topBrand ? ` (${topBrand.count} matchups)` : ""}
            </div>
          </div>
        </section>

        {/* Top brands overall */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-text mb-2">
            Most-compared brands overall
          </h2>
          <p className="text-text-secondary mb-5">
            Ranked by how many distinct comparison pages each brand appears in. Gaming consoles and
            major SaaS platforms dominate — they sit at the center of the widest webs of rivalry.
          </p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface text-text-secondary">
                <tr>
                  <th className="text-left font-semibold px-4 py-3 w-12">#</th>
                  <th className="text-left font-semibold px-4 py-3">Brand</th>
                  <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Type</th>
                  <th className="text-right font-semibold px-4 py-3">Comparisons</th>
                </tr>
              </thead>
              <tbody>
                {study.topBrands.map((b) => (
                  <tr key={b.slug} className="border-t border-border">
                    <td className="px-4 py-3 text-text-secondary font-medium">{b.rank}</td>
                    <td className="px-4 py-3">
                      <Link href={`/entity/${b.slug}`} className="font-medium text-text hover:text-primary-600">
                        {b.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                      {TYPE_LABELS[b.type] || b.type}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-text">{b.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top SaaS */}
        {study.topSaaS.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-display font-bold text-text mb-2">
              Most-compared B2B SaaS tools
            </h2>
            <p className="text-text-secondary mb-5">
              Software buyers comparison-shop harder than anyone. These are the SaaS products that
              show up in the most head-to-head evaluations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {study.topSaaS.map((b) => (
                <Link
                  key={b.slug}
                  href={`/entity/${b.slug}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary-600 transition-colors"
                >
                  <span className="font-medium text-text">
                    <span className="text-text-secondary mr-2">{b.rank}.</span>
                    {b.name}
                  </span>
                  <span className="text-sm font-semibold text-primary-600">{b.count} matchups</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Biggest matchups */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-text mb-2">
            Biggest matchups by readership
          </h2>
          <p className="text-text-secondary mb-5">
            The single comparisons readers pull up most often — the marquee rivalries of 2026.
          </p>
          <ol className="space-y-2">
            {study.topMatchups.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/compare/${m.slug}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary-600 transition-colors"
                >
                  <span className="font-medium text-text">
                    <span className="text-text-secondary mr-2">{m.rank}.</span>
                    {m.title}
                  </span>
                  <span className="text-sm text-text-secondary">{fmt(m.viewCount)} reads</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Category breakdown */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-text mb-2">
            Where the comparisons cluster
          </h2>
          <p className="text-text-secondary mb-5">
            Comparison demand is concentrated in consumer products, software, and technology — the
            categories where switching costs are real and the choice actually matters.
          </p>
          <div className="space-y-3">
            {study.categories.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <Link href={`/category/${c.category}`} className="font-medium text-text hover:text-primary-600">
                    {c.label}
                  </Link>
                  <span className="text-text-secondary">{fmt(c.count)} comparisons</span>
                </div>
                <div className="h-2 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-600"
                    style={{ width: `${Math.max(4, Math.round((c.count / maxCat) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-text mb-3">Methodology</h2>
          <div className="prose-sm text-text-secondary space-y-3">
            <p>
              We took every published comparison on {SITE_NAME} as of {updatedLabel} —{" "}
              {fmt(study.totalComparisons)} head-to-head pages — and counted how many distinct
              comparisons each brand or entity appears in. A brand that is matched against many
              rivals scores higher because it sits at the center of a wider web of buyer research.
            </p>
            <p>
              The &ldquo;brands&rdquo; ranking is limited to companies, products, software, and teams;
              countries, people, and historical entities are excluded. The &ldquo;biggest matchups&rdquo;
              ranking is ordered by on-site readership. Data is refreshed daily from our live database.
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
            {SITE_NAME}. Journalists and bloggers — reach out via our{" "}
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
            Want the raw data behind a specific category or a comparison embed for your site? See our{" "}
            <Link href="/partnerships" className="text-primary-600 hover:underline">partnerships page</Link>{" "}
            or browse <Link href="/trending" className="text-primary-600 hover:underline">trending comparisons</Link>.
          </p>
        </footer>
      </article>
    </>
  );
}
