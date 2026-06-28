import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_URL = `${SITE_URL}/llm-comparisons`;
const PAGE_TITLE = `LLM Comparison 2026: GPT-4o vs Claude vs Gemini vs Llama | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Independent comparison of 12 leading large language models — parameters, context window, modality, license, and knowledge cutoff. Column structure mirrors Wikipedia's Comparison of large language models. All data cited to primary sources.";
const LAST_UPDATED = "2026-05-22";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL, type: "article", siteName: SITE_NAME },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": ["Article", "TechArticle"],
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  abstract: PAGE_DESCRIPTION,
  url: PAGE_URL,
  inLanguage: "en-US",
  creativeWorkStatus: "Published",
  isAccessibleForFree: true,
  datePublished: "2026-05-22",
  dateModified: LAST_UPDATED,
  lastReviewed: LAST_UPDATED,
  author: { "@type": "Person", name: "Daniel Rozin", url: `${SITE_URL}/authors/daniel-rozin` },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  keywords: "LLM comparison, large language models, GPT-4o, Claude, Gemini, AI models 2026",
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".llm-summary", "table caption"] },
  about: { "@type": "Thing", name: "Large language models", sameAs: "https://en.wikipedia.org/wiki/Large_language_model" },
  mentions: [
    { "@type": "SoftwareApplication", name: "GPT-4o", url: "https://openai.com" },
    { "@type": "SoftwareApplication", name: "Claude 3.7 Sonnet", url: "https://anthropic.com" },
    { "@type": "SoftwareApplication", name: "Gemini 2.5 Pro", url: "https://deepmind.google" },
    { "@type": "SoftwareApplication", name: "Llama 3.3 70B", url: "https://ai.meta.com" },
    { "@type": "SoftwareApplication", name: "DeepSeek-V3", url: "https://deepseek.com" },
  ],
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

export default function LLMComparisonsPage() {
  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={[articleSchema, ...productSchemas]} />

      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary flex-wrap">
          <li><Link href="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
          <li>/</li>
          <li className="text-text font-medium">LLM Comparisons</li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text mb-4">
          LLM Comparison 2026
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed mb-4">
          An independent, citation-backed comparison of 12 leading large language models — covering
          parameter count, context window, input/output modalities, license, and knowledge cutoff.
          Column structure mirrors Wikipedia&apos;s{" "}
          <a
            href="https://en.wikipedia.org/wiki/Comparison_of_large_language_models"
            rel="nofollow noopener"
            target="_blank"
            className="text-primary-600 hover:underline"
          >
            Comparison of large language models
          </a>{" "}
          for easy cross-reference.
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary border-t border-b border-border py-3">
          <span>
            By{" "}
            <Link href="/authors/daniel-rozin" className="text-primary-600 hover:underline font-medium">
              Daniel Rozin
            </Link>
            , Founder &amp; Editor-in-Chief
          </span>
          <span>·</span>
          <span>
            Last updated:{" "}
            <time dateTime={LAST_UPDATED}>
              {new Date(LAST_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </span>
          <span>·</span>
          <Link href="/llm-comparisons/methodology" className="text-primary-600 hover:underline">
            Methodology
          </Link>
        </div>
      </header>

      {/* Quick summary */}
      <section className="mb-10 p-5 bg-surface-alt rounded-2xl border border-border">
        <h2 className="font-display font-bold text-text mb-2">Key takeaways (as of May 2026)</h2>
        <ul className="space-y-1 text-text-secondary text-sm list-disc list-inside">
          <li><strong className="text-text">Largest context windows:</strong> GPT-4.1 and Gemini 2.0 Flash / 2.5 Pro — all at 1M tokens.<sup><a href="#cite-0" className="text-primary-600">[1]</a></sup><sup><a href="#cite-4" className="text-primary-600">[5]</a></sup></li>
          <li><strong className="text-text">Most open:</strong> DeepSeek-V3 (MIT, 671B MoE) and Llama 3.3 70B (community license, 70.6B) — both weights downloadable.<sup><a href="#cite-9" className="text-primary-600">[10]</a></sup><sup><a href="#cite-6" className="text-primary-600">[7]</a></sup></li>
          <li><strong className="text-text">Multimodal leaders:</strong> GPT-4o (text/image/audio in+out) and Gemini 2.0 Flash (text/image/audio/video in, text/image out).<sup><a href="#cite-0" className="text-primary-600">[1]</a></sup><sup><a href="#cite-4" className="text-primary-600">[5]</a></sup></li>
          <li><strong className="text-text">Parameters undisclosed:</strong> OpenAI (GPT-4 series) and Anthropic (Claude 3 series) have not published parameter counts. Cells read &ldquo;Undisclosed&rdquo; — not estimated figures.</li>
        </ul>
      </section>

      {/* Main table */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text mb-4">Comparison table</h2>
        <p className="text-sm text-text-secondary mb-4">
          All data as of May 2026.<sup><a href="#cite-date-note" className="text-primary-600">[*]</a></sup>{" "}
          &ldquo;Undisclosed&rdquo; means the vendor has not published the value — not that it is unknown to us.
          Context window definitions vary; see{" "}
          <Link href="/llm-comparisons/methodology" className="text-primary-600 hover:underline">methodology</Link>{" "}
          for details.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-xl text-sm">
            <thead>
              <tr className="bg-surface-alt">
                {["Model", "Vendor", "Parameters", "Context window", "Input modalities", "Output modalities", "License", "Knowledge cutoff"].map((h) => (
                  <th key={h} className="text-left p-3 font-semibold text-text border-b border-border whitespace-nowrap">{h}</th>
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
      <section className="mb-12 p-5 border border-border rounded-2xl">
        <h2 className="font-display font-bold text-text mb-2">How we compile this table</h2>
        <p className="text-text-secondary text-sm mb-3">
          Our{" "}
          <Link href="/llm-comparisons/methodology" className="text-primary-600 hover:underline">full methodology</Link>{" "}
          covers column definitions, source tiers, the &ldquo;Undisclosed&rdquo; policy, recency policy, COI disclosure,
          and our correction process. Column structure intentionally mirrors Wikipedia&apos;s LLM comparison article
          for editor cross-reference.
        </p>
        <Link href="/llm-comparisons/methodology" className="text-sm text-primary-600 hover:underline font-medium">
          Read the methodology →
        </Link>
      </section>

      {/* Citations */}
      <section className="mb-10">
        <h2 className="text-xl font-display font-bold text-text mb-4">Sources</h2>
        <ol className="space-y-2 text-sm text-text-secondary">
          {LLMS.map((m, i) => (
            <li key={m.name} id={`cite-${i}`}>
              {m.name} ({m.vendor}).{" "}
              {m.sources.map((s, si) => (
                <span key={s.url}>
                  <a href={s.url} rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">{s.label}</a>
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
  );
}
