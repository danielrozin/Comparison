import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { breadcrumbSchema, faqSchema, teachesDefinedTerm } from "@/lib/seo/schema";
import { AI_CONTENT_LABEL, AI_DISCLOSURE, EDITORIAL_TEAM_NAME, editorialTeamAuthorNode } from "@/lib/editorial/blog-authorship";
import { JsonLd } from "@/components/schema/JsonLd";
import { SoftPricingLine } from "@/components/monetization/SoftPricingLine";

const PAGE_URL = `${SITE_URL}/llm-comparisons`;
// ROO-241: no single model version in the title; the table covers 12 models
// across the GPT, Claude, Gemini and Llama families (versions in the table).
const PAGE_TITLE = `LLM Comparison 2026: GPT vs Claude vs Gemini vs Llama (12 Models) | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Independent comparison of 12 leading large language models — parameters, context window, modality, license, and knowledge cutoff. Column structure mirrors Wikipedia's Comparison of large language models. All data cited to primary sources.";
export const LAST_UPDATED = "2026-10-16";

export const metadata: Metadata = {
  // ROO-241: title already carries the brand; skip the layout template.
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
    types: {
      "application/rss+xml": `${SITE_URL}/feed`,
      "application/atom+xml": `${SITE_URL}/feed/atom`,
    },
  },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL, type: "article", locale: "en_US", siteName: SITE_NAME },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": EDITORIAL_TEAM_NAME,
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
    "citation_publication_date": "2026-07-11",
    "citation_online_date": "2026-07-11",
    "citation_keywords": "LLM comparison, large language models, AI chatbots, ChatGPT vs Claude, GPT-4 benchmark 2026",
    "citation_fulltext_world_readable": "",
    "DC.title": PAGE_TITLE,
    "DC.creator": EDITORIAL_TEAM_NAME,
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": PAGE_URL,
    "DC.date": "2026-07-11",
    "DC.subject": "Artificial Intelligence; Large Language Models; AI Comparison; ChatGPT; Claude; Gemini",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "United States; Global",
  },
};

const LLM_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("LLM Comparison 2026")}&type=article`;
const llmBreadcrumb = breadcrumbSchema(
  [
    { name: "Home", url: SITE_URL },
    { name: "LLM Comparisons", url: PAGE_URL },
  ],
  `${PAGE_URL}#breadcrumb`
);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": ["Article", "TechArticle"],
  "@id": `${PAGE_URL}#article`,
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  abstract: PAGE_DESCRIPTION,
  url: PAGE_URL,
  inLanguage: "en-US",
  genre: "Comparison Guide",
  creativeWorkStatus: "Published",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  interactivityType: "expositive",
  datePublished: "2026-07-11",
  dateModified: LAST_UPDATED,
  contentReferenceTime: LAST_UPDATED,
  thumbnailUrl: LLM_OG_IMAGE,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: LLM_OG_IMAGE,
    contentUrl: LLM_OG_IMAGE,
    width: 1200,
    height: 630,
    caption: "LLM Comparison Guide 2026 — A Versus B",
  },
  author: editorialTeamAuthorNode(),
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightYear: new Date().getFullYear(),
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "AI Researchers, Developers, Consumers, Analysts", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
  educationalLevel: "General",
  teaches: teachesDefinedTerm("How to choose the best large language model for your use case", PAGE_URL),
  educationalUse: "comparison",
  alternativeHeadline: `Best Large Language Models in ${new Date().getFullYear()} — LLM Comparison Guide`,
  keywords: `LLM comparison, large language models, GPT-6, Claude Opus 5.5, Gemini 4, Grok 4.7, DeepSeek V4, AI models ${new Date().getFullYear()}`,
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro", "#llm-answer", ".faq-answer"] },
  hasPart: { "@id": `${PAGE_URL}#faq` },
  about: { "@type": "Thing", name: "Large language models", sameAs: "https://en.wikipedia.org/wiki/Large_language_model" },
  mentions: [
    { "@type": "SoftwareApplication", name: "GPT-6 Astra", url: "https://platform.openai.com/docs/models" },
    { "@type": "SoftwareApplication", name: "Claude Opus 5.5", url: "https://docs.anthropic.com/en/docs/about-claude/models/overview" },
    { "@type": "SoftwareApplication", name: "Gemini 4 Argon", url: "https://ai.google.dev/gemini-api/docs/models" },
    { "@type": "SoftwareApplication", name: "Grok 4.7", url: "https://docs.x.ai/docs/models" },
    { "@type": "SoftwareApplication", name: "DeepSeek-V4-Pro", url: "https://api-docs.deepseek.com/quick_start/pricing" },
  ],
  timeRequired: "PT6M",
  wordCount: 1200,
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  // discussionUrl — Reddit community discussions on LLM comparisons; E-E-A-T engagement signal.
  discussionUrl: "https://www.reddit.com/search/?q=LLM+comparison+OR+%22best+AI+model%22&type=link&sort=relevance",
};

type LLM = {
  name: string;
  vendor: string;
  price: string;
  contextK: string;
  inputModality: string;
  outputModality: string;
  license: string;
  knowledgeCutoff: string;
  sources: { label: string; url: string }[];
};

const LLMS: LLM[] = [
  {
    name: "GPT-6 Astra",
    vendor: "OpenAI",
    price: "$10 / $50",
    contextK: "1.05M",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Apr 30, 2026",
    sources: [{ label: "OpenAI models", url: "https://platform.openai.com/docs/models" }],
  },
  {
    name: "GPT-6.1 Sol",
    vendor: "OpenAI",
    price: "$2 / $10",
    contextK: "1.05M",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Apr 30, 2026",
    sources: [{ label: "OpenAI models", url: "https://platform.openai.com/docs/models" }],
  },
  {
    name: "GPT-6 Luna",
    vendor: "OpenAI",
    price: "$0.10 / $0.50",
    contextK: "1.05M",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "May 18, 2026",
    sources: [{ label: "OpenAI models", url: "https://platform.openai.com/docs/models" }],
  },
  {
    name: "Claude Fable 5.1",
    vendor: "Anthropic",
    price: "$10 / $50",
    contextK: "1M",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Jun 2026",
    sources: [{ label: "Anthropic models overview", url: "https://docs.anthropic.com/en/docs/about-claude/models/overview" }],
  },
  {
    name: "Claude Opus 5.5",
    vendor: "Anthropic",
    price: "$4 / $20",
    contextK: "1M",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Jun 2026",
    sources: [{ label: "Anthropic models overview", url: "https://docs.anthropic.com/en/docs/about-claude/models/overview" }],
  },
  {
    name: "Claude Sonnet 5.5",
    vendor: "Anthropic",
    price: "$2 / $10",
    contextK: "1M",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Jun 2026",
    sources: [{ label: "Anthropic models overview", url: "https://docs.anthropic.com/en/docs/about-claude/models/overview" }],
  },
  {
    name: "Claude Haiku 5.5",
    vendor: "Anthropic",
    price: "From $0.10 / from $0.50",
    contextK: "1M",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Jun 2026",
    sources: [{ label: "Anthropic models overview", url: "https://docs.anthropic.com/en/docs/about-claude/models/overview" }],
  },
  {
    name: "Gemini 4 Argon",
    vendor: "Google",
    price: "$2 / $10 until Nov 30, 2026; $4 / $20 from Dec 1, 2026",
    contextK: "1M",
    inputModality: "Not listed",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Not listed",
    sources: [{ label: "Gemini API models", url: "https://ai.google.dev/gemini-api/docs/models" }, { label: "Gemini API pricing", url: "https://ai.google.dev/gemini-api/docs/pricing" }],
  },
  {
    name: "Gemini 3.8 Flash",
    vendor: "Google",
    price: "$0.75 / $3.75 until Dec 31, 2026; $1.50 / $7.50 from Jan 1, 2027",
    contextK: "Not listed",
    inputModality: "Not listed",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Not listed",
    sources: [{ label: "Gemini API models", url: "https://ai.google.dev/gemini-api/docs/models" }, { label: "Gemini API pricing", url: "https://ai.google.dev/gemini-api/docs/pricing" }],
  },
  {
    name: "Grok 4.7",
    vendor: "xAI",
    price: "$2 / $6 (prompts under 200K tokens); $4 / $12 at 200K+",
    contextK: "500K",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "May 2026",
    sources: [{ label: "xAI models and pricing", url: "https://docs.x.ai/docs/models" }],
  },
  {
    name: "DeepSeek-V4-Pro",
    vendor: "DeepSeek",
    price: "$1.32 / $3.96 peak; half that off-peak",
    contextK: "1M",
    inputModality: "Text",
    outputModality: "Text",
    license: "Not listed",
    knowledgeCutoff: "Not listed",
    sources: [{ label: "DeepSeek models and pricing", url: "https://api-docs.deepseek.com/quick_start/pricing" }],
  },
  {
    name: "Mistral Large 4",
    vendor: "Mistral AI",
    price: "See vendor pricing",
    contextK: "Not listed",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Open weights",
    knowledgeCutoff: "Not listed",
    sources: [{ label: "Mistral models overview", url: "https://docs.mistral.ai/getting-started/models/models_overview/" }],
  },
];

const LLM_FAQS = [
  {
    question: "What is the best large language model in 2026?",
    answer:
      "There is no single best model; it depends on the job and the budget. OpenAI recommends GPT-6 Astra for complex reasoning and coding, and Anthropic recommends Claude Opus 5.5 for most workloads, with Claude Fable 5.1 for the most demanding reasoning. Google's flagship is Gemini 4 Argon and xAI's is Grok 4.7. For high-volume, cost-sensitive work, GPT-6 Luna and Claude Haiku 5.5 have the lowest list prices.",
  },
  {
    question: "Which LLM is cheapest to use through an API?",
    answer:
      "Among current flagship-family models, GPT-6 Luna lists at $0.10 per million input tokens and $0.50 per million output tokens, and Claude Haiku 5.5 starts at the same rates. DeepSeek-V4-Pro lists at $1.32 / $3.96 at peak hours and half that off-peak. Batch processing and prompt caching cut these prices further on most platforms.",
  },
  {
    question: "Which LLM has the largest context window?",
    answer:
      "OpenAI lists a 1.05M-token context window for GPT-6 Astra, GPT-6.1 Sol and GPT-6 Luna. Anthropic's current Claude models, Gemini 4 Argon and DeepSeek-V4-Pro list 1M tokens, and Grok 4.7 lists 500K. A context window is the total number of tokens a model can take in one request, including the prompt and the reply.",
  },
  {
    question: "Is Gemini 4 Argon getting more expensive?",
    answer:
      "Yes. Google lists Gemini 4 Argon at $2 per million input tokens and $10 per million output tokens through November 30, 2026, rising to $4 and $20 from December 1, 2026. Gemini 4 Argon is not available on the Gemini API free tier.",
  },
  {
    question: "What is the difference between proprietary and open-weight LLMs?",
    answer:
      "Proprietary models such as GPT-6, Claude and Gemini are only available through the vendor's apps and API, and their weights are not released. Open-weight models such as Mistral Large 4 publish their weights, so you can host, fine-tune and run them on your own hardware, subject to the model's license.",
  },
];

const llmFaqSchema = faqSchema(LLM_FAQS, `${PAGE_URL}#faq`, [
  { "@type": "Thing", "@id": PAGE_URL, name: "Large Language Model Comparison 2026", url: PAGE_URL },
]);

export default function LLMComparisonsPage() {
  return (
    <>
      <JsonLd data={[llmBreadcrumb, articleSchema, llmFaqSchema]} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-llm-comparisons-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-llm-comparisons-hero)"/>
</svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-purple-200 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-purple-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">LLM Comparisons</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20 mt-1">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                LLM Comparison 2026
              </h1>
              {/* ROO-50: under the title, before the long intro, so the cookie banner cannot cover it. */}
              <SoftPricingLine src="llm-comparisons" tone="onDark" className="mt-3" />
              <p id="page-intro" className="mt-2 text-purple-100 text-base sm:text-lg leading-relaxed max-w-3xl">
                A comparison of 12 current large language models from OpenAI, Anthropic, Google, xAI, DeepSeek
                and Mistral, covering API list price, context window, modalities, license and knowledge cutoff.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-purple-200">
                <span className="font-semibold uppercase tracking-wide text-white">{AI_CONTENT_LABEL}</span>
                <span aria-hidden="true">·</span>
                <span>{AI_DISCLOSURE}</span>
                <span aria-hidden="true">·</span>
                <span>
                  Updated:{" "}
                  <time dateTime={LAST_UPDATED}>
                    {new Date(LAST_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                </span>
                <span aria-hidden="true">·</span>
                <Link href="/llm-comparisons/methodology" className="text-white hover:underline">
                  Methodology
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Quick summary */}
      <section aria-labelledby="llm-takeaways-heading" className="mb-10 p-5 bg-surface-alt rounded-2xl border border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 id="llm-takeaways-heading" className="font-display font-bold text-text">Key takeaways (October 2026)</h2>
        </div>
        <p id="llm-answer" className="text-sm text-text mb-3 leading-relaxed">
          The current flagship API models are OpenAI&apos;s GPT-6 Astra, Anthropic&apos;s Claude Fable 5.1 and Claude Opus 5.5,
          Google&apos;s Gemini 4 Argon and xAI&apos;s Grok 4.7. GPT-6 Astra and Claude Fable 5.1 both list at $10 per million input
          tokens and $50 per million output tokens. Claude Opus 5.5 lists at $4 / $20, and Gemini 4 Argon at $2 / $10 until
          November 30, 2026. Most of these models accept about 1M tokens of context.
        </p>
        <ul className="space-y-1 text-text-secondary text-sm list-disc list-inside">
          <li><strong className="text-text">Largest context windows:</strong> GPT-6 Astra, Sol and Luna (1.05M tokens); the Claude 5.5 line, Claude Fable 5.1, Gemini 4 Argon and DeepSeek-V4-Pro (1M). Grok 4.7 lists 500K.</li>
          <li><strong className="text-text">Lowest list prices:</strong> GPT-6 Luna ($0.10 / $0.50) and Claude Haiku 5.5 (from $0.10 / from $0.50) per million input / output tokens.</li>
          <li><strong className="text-text">Price changes scheduled:</strong> Google lists Gemini 4 Argon rising to $4 / $20 on December 1, 2026, and Gemini 3.8 Flash rising to $1.50 / $7.50 on January 1, 2027.</li>
          <li><strong className="text-text">Newest knowledge cutoffs:</strong> the Claude 5.5 line and Claude Fable 5.1 (June 2026), GPT-6 Luna (May 18, 2026) and Grok 4.7 (May 2026).</li>
          <li><strong className="text-text">Open weights:</strong> Mistral Large 4 is open-weight. Parameter counts for the proprietary models are not published.</li>
</ul>
      </section>

      {/* Main table */}
      <section aria-labelledby="llm-comparison-table-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 6h4m-4 12h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </div>
          <h2 id="llm-comparison-table-heading" className="text-2xl font-display font-bold text-text">Comparison table</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Prices are standard API list prices in USD per million tokens, checked October 16, 2026; batch, cache and regional rates differ.<sup><a href="#cite-date-note" className="text-primary-600">[*]</a></sup>{" "}
          &ldquo;Not listed&rdquo; means the value does not appear in the vendor&apos;s model or pricing documentation.
          Context window definitions vary; see{" "}
          <Link href="/llm-comparisons/methodology" className="text-primary-600 hover:underline">methodology</Link>{" "}
          for details.
        </p>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="LLM comparison table — scroll to see all columns">
          <table className="w-full border border-border rounded-xl text-sm">
            <caption className="sr-only">LLM comparison table: API list price, context window, modalities, license and knowledge cutoff for current models, October 2026</caption>
            <thead>
              <tr className="bg-surface-alt">
                {["Model", "Vendor", "API list price (input / output, USD per 1M tokens)", "Context window", "Input modalities", "Output modalities", "License", "Knowledge cutoff"].map((h) => (
                  <th scope="col" key={h} className="text-left p-3 font-semibold text-text border-b border-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LLMS.map((m, i) => (
                <tr key={m.name} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="p-3 font-medium text-text whitespace-nowrap">{m.name}</td>
                  <td className="p-3 text-text-secondary">{m.vendor}</td>
                  <td className="p-3 text-text-secondary">
                    {m.price}<sup><a href={`#cite-${i}`} className="text-primary-600">[{i + 1}]</a></sup>
                  </td>
                  <td className="p-3 text-text-secondary">{m.contextK}</td>
                  <td className="p-3 text-text-secondary">{m.inputModality}</td>
                  <td className="p-3 text-text-secondary">{m.outputModality}</td>
                  <td className="p-3 text-text-secondary">{m.license}</td>
                  <td className="p-3 text-text-secondary">{m.knowledgeCutoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology link */}
      <section aria-labelledby="llm-methodology-heading" className="mb-12 p-5 border border-border rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 id="llm-methodology-heading" className="font-display font-bold text-text">How we compile this table</h2>
        </div>
        <p className="text-text-secondary text-sm mb-3">
          Our{" "}
          <Link href="/llm-comparisons/methodology" className="text-primary-600 hover:underline">full methodology</Link>{" "}
          covers column definitions, source tiers, the &ldquo;Undisclosed&rdquo; policy, recency policy, COI disclosure,
          and our correction process. Column structure intentionally mirrors Wikipedia&apos;s LLM comparison article
          for editor cross-reference.
        </p>
        <Link href="/llm-comparisons/methodology" className="text-sm text-primary-600 hover:underline font-medium">
          Read the methodology <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* FAQ Section — renders FAQ HTML so FAQPage JSON-LD speakable selectors resolve.
          Satisfies Google FAQ rich-result eligibility and AEO answer extraction. */}
      <section aria-labelledby="llm-faq-heading" className="mb-12" id="llm-faq">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 id="llm-faq-heading" className="text-xl font-display font-bold text-text">Frequently Asked Questions: LLM Comparisons</h2>
        </div>
        <dl className="space-y-5">
          {LLM_FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-5" id={`llm-q${i + 1}`}>
              <dt className="font-semibold text-text text-base mb-2">{faq.question}</dt>
              <dd className="text-text-secondary text-sm leading-relaxed faq-answer">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Citations */}
      <section aria-labelledby="llm-sources-heading" className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 id="llm-sources-heading" className="text-xl font-display font-bold text-text">Sources</h2>
        </div>
        <ol className="space-y-2 text-sm text-text-secondary">
          {LLMS.map((m, i) => (
            <li key={m.name} id={`cite-${i}`}>
              {m.name} ({m.vendor}).{" "}
              {m.sources.map((s, si) => (
                <span key={s.url}>
                  <a href={s.url} target="_blank" rel="nofollow noopener noreferrer" className="text-primary-600 hover:underline">{s.label}<span className="sr-only"> (opens in new tab)</span></a>
                  {si < m.sources.length - 1 ? "; " : ""}
                </span>
              ))}
              {" "}<em>Checked October 16, 2026.</em>
            </li>
          ))}
          <li id="cite-date-note">
            <sup>*</sup> <strong>Updated Oct 2026:</strong> the lineup moved from GPT-4o, Claude 3.x, Gemini 2.x and Llama 3.3 to each vendor&apos;s current models, and an API list-price column replaced parameter counts, which the proprietary vendors do not publish. Data was checked against vendor model and pricing documentation on October 16, 2026. Prices and versions change often; vendor documentation is authoritative.
          </li>
        </ol>
      </section>
    </article>
    </>
  );
}
