import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { personAuthorNode, breadcrumbSchema, faqSchema, teachesDefinedTerm } from "@/lib/seo/schema";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_URL = `${SITE_URL}/llm-comparisons`;
const PAGE_TITLE = `LLM Comparison 2026: GPT-4o vs Claude vs Gemini vs Llama | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Independent comparison of 12 leading large language models — parameters, context window, modality, license, and knowledge cutoff. Column structure mirrors Wikipedia's Comparison of large language models. All data cited to primary sources.";
const LAST_UPDATED = "2026-05-22";

export const metadata: Metadata = {
  title: PAGE_TITLE,
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
    site: "@aversusb",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": "Daniel Rozin",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
    "citation_publication_date": "2026-05-22",
    "citation_online_date": "2026-05-22",
    "citation_keywords": "LLM comparison, large language models, AI chatbots, ChatGPT vs Claude, GPT-4 benchmark 2026",
    "citation_fulltext_world_readable": "",
    "DC.title": PAGE_TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": PAGE_URL,
    "DC.date": "2026-05-22",
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
  datePublished: "2026-05-22",
  dateModified: LAST_UPDATED,
  lastReviewed: LAST_UPDATED,
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
  author: {
    "@type": "Person",
    "@id": `${SITE_URL}/authors/daniel-rozin#person`,
    name: "Daniel Rozin",
    url: `${SITE_URL}/authors/daniel-rozin`,
    jobTitle: "Founder & Editor-in-Chief",
    worksFor: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    sameAs: ["https://www.linkedin.com/in/daniel-rozin-56a066b0/"],
  },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  reviewedBy: [personAuthorNode(), { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL }],
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
  educationalLevel: "General",
  teaches: teachesDefinedTerm("How to choose the best large language model for your use case", PAGE_URL),
  educationalUse: "comparison",
  alternativeHeadline: `Best Large Language Models in ${new Date().getFullYear()} — LLM Comparison Guide`,
  keywords: `LLM comparison, large language models, GPT-4o, Claude, Gemini, AI models ${new Date().getFullYear()}`,
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro", ".faq-answer"] },
  hasPart: { "@type": "FAQPage", "@id": `${PAGE_URL}#faq` },
  about: { "@type": "Thing", name: "Large language models", sameAs: "https://en.wikipedia.org/wiki/Large_language_model" },
  mentions: [
    { "@type": "SoftwareApplication", name: "GPT-4o", url: "https://openai.com" },
    { "@type": "SoftwareApplication", name: "Claude 3.7 Sonnet", url: "https://anthropic.com" },
    { "@type": "SoftwareApplication", name: "Gemini 2.5 Pro", url: "https://deepmind.google" },
    { "@type": "SoftwareApplication", name: "Llama 3.3 70B", url: "https://ai.meta.com" },
    { "@type": "SoftwareApplication", name: "DeepSeek-V3", url: "https://deepseek.com" },
  ],
  timeRequired: "PT6M",
  wordCount: 1200,
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  // discussionUrl — Reddit community discussions on LLM comparisons; E-E-A-T engagement signal.
  discussionUrl: "https://www.reddit.com/search/?q=LLM+comparison+OR+%22best+AI+model%22&type=link&sort=relevance",
};

const productSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "GPT-4o",
    url: "https://openai.com/index/gpt-4o-system-card/",
    brand: { "@type": "Brand", name: "OpenAI" },
    description: "Multimodal frontier LLM from OpenAI. 128K token context window. Text + image + audio input. Knowledge cutoff: October 2023.",
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Llama 3.3 70B",
    url: "https://ai.meta.com/blog/meta-llama-3-3/",
    brand: { "@type": "Brand", name: "Meta AI" },
    description: "Open-weight text LLM from Meta. 70.6B parameters. 128K token context. Llama 3 Community License.",
  },
];

type LLM = {
  name: string;
  vendor: string;
  params: string;
  contextK: string;
  inputModality: string;
  outputModality: string;
  license: string;
  knowledgeCutoff: string;
  sources: { label: string; url: string }[];
};

const LLMS: LLM[] = [
  {
    name: "GPT-4o",
    vendor: "OpenAI",
    params: "Undisclosed",
    contextK: "128K",
    inputModality: "Text, Image, Audio",
    outputModality: "Text, Audio",
    license: "Proprietary",
    knowledgeCutoff: "Oct 2023",
    sources: [
      { label: "GPT-4o system card", url: "https://openai.com/index/gpt-4o-system-card/" },
      { label: "OpenAI models API reference", url: "https://platform.openai.com/docs/models" },
    ],
  },
  {
    name: "GPT-4.1",
    vendor: "OpenAI",
    params: "Undisclosed",
    contextK: "1M",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Undisclosed",
    sources: [
      { label: "OpenAI models API reference", url: "https://platform.openai.com/docs/models" },
    ],
  },
  {
    name: "Claude 3.5 Sonnet",
    vendor: "Anthropic",
    params: "Undisclosed",
    contextK: "200K",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Apr 2024",
    sources: [
      { label: "Anthropic models list", url: "https://docs.anthropic.com/en/docs/about-claude/models" },
    ],
  },
  {
    name: "Claude 3.7 Sonnet",
    vendor: "Anthropic",
    params: "Undisclosed",
    contextK: "200K",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Undisclosed",
    sources: [
      { label: "Anthropic Claude 3.7 Sonnet announcement", url: "https://www.anthropic.com/news/claude-3-7-sonnet" },
      { label: "Anthropic models list", url: "https://docs.anthropic.com/en/docs/about-claude/models" },
    ],
  },
  {
    name: "Gemini 2.0 Flash",
    vendor: "Google DeepMind",
    params: "Undisclosed",
    contextK: "1M",
    inputModality: "Text, Image, Audio, Video",
    outputModality: "Text, Image",
    license: "Proprietary",
    knowledgeCutoff: "Aug 2024",
    sources: [
      { label: "Google AI Gemini model page", url: "https://ai.google.dev/gemini-api/docs/models/gemini" },
    ],
  },
  {
    name: "Gemini 2.5 Pro",
    vendor: "Google DeepMind",
    params: "Undisclosed",
    contextK: "1M",
    inputModality: "Text, Image, Audio, Video",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Undisclosed",
    sources: [
      { label: "Google AI Gemini 2.5 Pro model page", url: "https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.5-pro" },
    ],
  },
  {
    name: "Llama 3.3 70B",
    vendor: "Meta AI",
    params: "70.6B",
    contextK: "128K",
    inputModality: "Text",
    outputModality: "Text",
    license: "Llama 3 Community License (open weights)",
    knowledgeCutoff: "Dec 2023",
    sources: [
      { label: "Meta Llama 3.3 announcement", url: "https://ai.meta.com/blog/meta-llama-3-3/" },
      { label: "Llama 3.3 70B HuggingFace model card", url: "https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct" },
      { label: "Llama 3 technical report (arXiv 2407.21783)", url: "https://arxiv.org/abs/2407.21783" },
    ],
  },
  {
    name: "Mistral Large 2",
    vendor: "Mistral AI",
    params: "Undisclosed",
    contextK: "128K",
    inputModality: "Text",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Undisclosed",
    sources: [
      { label: "Mistral AI models", url: "https://mistral.ai/technology/#models" },
    ],
  },
  {
    name: "Grok-3",
    vendor: "xAI",
    params: "Undisclosed",
    contextK: "131K",
    inputModality: "Text, Image",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Undisclosed",
    sources: [
      { label: "xAI Grok-3 announcement", url: "https://x.ai/blog/grok-3" },
    ],
  },
  {
    name: "DeepSeek-V3",
    vendor: "DeepSeek",
    params: "671B total / 37B active (MoE)",
    contextK: "128K",
    inputModality: "Text",
    outputModality: "Text",
    license: "MIT (open weights)",
    knowledgeCutoff: "Undisclosed",
    sources: [
      { label: "DeepSeek-V3 technical report (arXiv 2412.19437)", url: "https://arxiv.org/abs/2412.19437" },
      { label: "DeepSeek-V3 GitHub", url: "https://github.com/deepseek-ai/DeepSeek-V3" },
    ],
  },
  {
    name: "Qwen2.5-72B",
    vendor: "Alibaba Cloud",
    params: "72.7B",
    contextK: "128K",
    inputModality: "Text",
    outputModality: "Text",
    license: "Qwen License (Apache 2.0 base with usage restrictions)",
    knowledgeCutoff: "Undisclosed",
    sources: [
      { label: "Qwen2.5 technical report (arXiv 2412.15115)", url: "https://arxiv.org/abs/2412.15115" },
      { label: "Qwen2.5-72B HuggingFace model card", url: "https://huggingface.co/Qwen/Qwen2.5-72B-Instruct" },
    ],
  },
  {
    name: "Command R+",
    vendor: "Cohere",
    params: "Undisclosed",
    contextK: "128K",
    inputModality: "Text",
    outputModality: "Text",
    license: "Proprietary",
    knowledgeCutoff: "Undisclosed",
    sources: [
      { label: "Cohere Command R+ model page", url: "https://cohere.com/command" },
    ],
  },
];

const LLM_FAQS = [
  {
    question: "What is the best large language model in 2026?",
    answer:
      "The best LLM depends on your use case. Claude claude-sonnet-5 and GPT-4.1 lead on instruction following, long-context coding, and complex reasoning. Gemini 2.5 Pro excels at multimodal tasks and document analysis. Llama 4 Scout and DeepSeek-V3 are the top open-weight alternatives for self-hosted deployments. This comparison table ranks each model by context window, input modality, and license type so you can match the right model to your workload.",
  },
  {
    question: "What does context window mean for LLMs?",
    answer:
      "The context window is the maximum number of tokens (roughly 0.75 words each) an LLM can process in a single request — both the input prompt and the generated output combined. Models with larger context windows (200K–1M tokens) can process entire books, long codebases, or lengthy conversation histories without losing earlier context. GPT-4.1 and Gemini 2.5 Pro offer the largest publicly documented context windows in this comparison at 1M tokens.",
  },
  {
    question: "What is the difference between proprietary and open-weight LLMs?",
    answer:
      "Proprietary LLMs (GPT-4o, Claude, Gemini) are accessible only via API or product interface; their weights are not publicly released. Open-weight LLMs (Llama 4, Mistral, DeepSeek, Falcon) publish model weights for download, allowing self-hosting, fine-tuning, and offline deployment. Open-weight models are preferred for privacy-sensitive workloads, cost-sensitive high-volume use, and research contexts requiring full reproducibility.",
  },
  {
    question: "How are LLM benchmarks like MMLU and HumanEval used to compare models?",
    answer:
      "MMLU (Massive Multitask Language Understanding) measures knowledge breadth across 57 academic subjects — a proxy for general knowledge quality. HumanEval measures code generation accuracy on 164 Python programming problems. GPQA tests graduate-level science reasoning. These benchmarks allow apples-to-apples comparison across labs, but real-world performance often diverges from benchmark scores, so this table pairs them with modality, context, and license data for a fuller picture.",
  },
  {
    question: "How often is this LLM comparison table updated?",
    answer:
      "We update this table when major model releases or significant specification changes occur — typically monthly during active periods in the AI landscape. The page header and JSON-LD dateModified field show the date of the most recent data revision. Each row links to the primary vendor documentation source so you can verify specifications independently.",
  },
];

const llmFaqSchema = faqSchema(LLM_FAQS, `${PAGE_URL}#faq`, [
  { "@type": "Thing", "@id": PAGE_URL, name: "Large Language Model Comparison 2026", url: PAGE_URL },
]);

export default function LLMComparisonsPage() {
  return (
    <>
      <JsonLd data={[llmBreadcrumb, articleSchema, llmFaqSchema, ...productSchemas]} />

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
              <p id="page-intro" className="mt-2 text-purple-100 text-base sm:text-lg leading-relaxed max-w-3xl">
                An independent, citation-backed comparison of 12 leading large language models — covering
                parameter count, context window, modalities, license, and knowledge cutoff.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-purple-200">
                <span>
                  By{" "}
                  <Link href="/authors/daniel-rozin" className="text-white hover:underline font-medium">
                    Daniel Rozin
                  </Link>
                </span>
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
        <div className="absolute bottom-0 left-0 right-0">
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
          <h2 id="llm-takeaways-heading" className="font-display font-bold text-text">Key takeaways (as of May 2026)</h2>
        </div>
        <ul className="space-y-1 text-text-secondary text-sm list-disc list-inside">
          <li><strong className="text-text">Largest context windows:</strong> GPT-4.1 and Gemini 2.0 Flash / 2.5 Pro — all at 1M tokens.<sup><a href="#cite-0" className="text-primary-600">[1]</a></sup><sup><a href="#cite-4" className="text-primary-600">[5]</a></sup></li>
          <li><strong className="text-text">Most open:</strong> DeepSeek-V3 (MIT, 671B MoE) and Llama 3.3 70B (community license, 70.6B) — both weights downloadable.<sup><a href="#cite-9" className="text-primary-600">[10]</a></sup><sup><a href="#cite-6" className="text-primary-600">[7]</a></sup></li>
          <li><strong className="text-text">Multimodal leaders:</strong> GPT-4o (text/image/audio in+out) and Gemini 2.0 Flash (text/image/audio/video in, text/image out).<sup><a href="#cite-0" className="text-primary-600">[1]</a></sup><sup><a href="#cite-4" className="text-primary-600">[5]</a></sup></li>
          <li><strong className="text-text">Parameters undisclosed:</strong> OpenAI (GPT-4 series) and Anthropic (Claude 3 series) have not published parameter counts. Cells read &ldquo;Undisclosed&rdquo; — not estimated figures.</li>
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
          All data as of May 2026.<sup><a href="#cite-date-note" className="text-primary-600">[*]</a></sup>{" "}
          &ldquo;Undisclosed&rdquo; means the vendor has not published the value — not that it is unknown to us.
          Context window definitions vary; see{" "}
          <Link href="/llm-comparisons/methodology" className="text-primary-600 hover:underline">methodology</Link>{" "}
          for details.
        </p>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="LLM comparison table — scroll to see all columns">
          <table className="w-full border border-border rounded-xl text-sm">
            <caption className="sr-only">LLM comparison table — model specs including parameters, context window, modalities, and license</caption>
            <thead>
              <tr className="bg-surface-alt">
                {["Model", "Vendor", "Parameters", "Context window", "Input modalities", "Output modalities", "License", "Knowledge cutoff"].map((h) => (
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
                    {m.params}<sup><a href={`#cite-${i}`} className="text-primary-600">[{i + 1}]</a></sup>
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
              {" "}<em>Accessed May 2026.</em>
            </li>
          ))}
          <li id="cite-date-note">
            <sup>*</sup> Data reflects information available from primary vendor sources as of May 2026.
            This is a fast-moving field; check the{" "}
            <time dateTime={LAST_UPDATED}>{new Date(LAST_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</time>{" "}
            dateModified stamp above and consult vendor documentation for the latest specifications.
          </li>
        </ol>
      </section>
    </article>
    </>
  );
}
