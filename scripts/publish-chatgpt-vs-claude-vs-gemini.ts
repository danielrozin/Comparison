/**
 * Publish: ChatGPT vs Claude vs Gemini (DAN-998 / DAN-836)
 *
 * Ingests the CMO-signed-off DAN-836 draft v1.2 (rev a7ac5653, 2,630w, specs
 * web-re-verified 2026-06-11) into the prod comparisons DB so the page SSRs the
 * editorial draft instead of the <DynamicComparison> on-demand AI placeholder.
 *
 * Multi-way (3 entities) — renders via MultiEntityLayout (DAN-387 Phase 1) and
 * emits the schema-3way v1 @graph (DAN-841 / DAN-854):
 * SoftwareApplication ×3 + ItemList + FAQPage + BreadcrumbList + Article.
 *
 * Precedent: scripts/publish-notion-vs-obsidian-vs-logseq.ts (DAN-993 / DAN-839 —
 * multi-way comparison shape + idempotent schema persist).
 *
 * Run with:
 *   npx tsx scripts/publish-chatgpt-vs-claude-vs-gemini.ts
 *
 * Idempotent — saveComparison uses prisma.comparison.upsert; FAQs/attribute
 * values are cleared and rewritten on each run. datePublished is frozen on the
 * first publish (DAN-608 §4) and never moved on subsequent runs.
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { saveComparison } from "../src/lib/services/comparison-service";
import { getPrisma } from "../src/lib/db/prisma";
import type { ComparisonPageData } from "../src/types";

const SLUG = "chatgpt-vs-claude-vs-gemini";
const SITE = "https://www.aversusb.net";

// DAN-836 draft v1.2 content-lock (rev a7ac5653, document updatedAt 2026-06-11).
const DATE_PUBLISHED = new Date().toISOString(); // overwritten only on first publish
const DATE_MODIFIED = "2026-06-11T22:00:26Z";

const CHATGPT = "chatgpt";
const CLAUDE = "claude";
const GEMINI = "gemini";

// Shared TL;DR — load-bearing "workflow fit, not price" framing from draft v1.2.
const TLDR =
  "There's no single winner — at an identical ~$20/month entry price, the right pick depends on your primary workflow. Claude wins for coding (SWE-bench #1, Claude Code) and long-document analysis (1M-token context); Gemini wins for cited research (native Google Search grounding + Deep Research) and Google Workspace users; ChatGPT wins for general-purpose breadth, native DALL-E image generation, and the best voice mode.";

// Helper to build a text attribute row mapping the draft's capability/pricing
// tables into per-entity AttributeValues (one value per entity, in entity order).
function textAttr(
  slug: string,
  name: string,
  category: string,
  chatgpt: string,
  claude: string,
  gemini: string,
): ComparisonPageData["attributes"][number] {
  return {
    id: slug,
    slug,
    name,
    unit: null,
    category,
    dataType: "text",
    higherIsBetter: null,
    values: [
      { entityId: CHATGPT, valueText: chatgpt, valueNumber: null, valueBoolean: null },
      { entityId: CLAUDE, valueText: claude, valueNumber: null, valueBoolean: null },
      { entityId: GEMINI, valueText: gemini, valueNumber: null, valueBoolean: null },
    ],
  };
}

const comparison: ComparisonPageData = {
  id: SLUG,
  slug: SLUG,
  title: "ChatGPT vs Claude vs Gemini: Which AI Is Best in 2026?",
  shortAnswer: TLDR,
  quickAnswer: {
    tldr: TLDR,
    winnerName: null,
    winnerReason:
      "It depends on your workflow — coding and long-document work (Claude), cited research and Google Workspace (Gemini), or general-purpose breadth with image generation and voice (ChatGPT).",
    keyFact:
      "All three cost ~$20/mo at the entry tier; the decision is workflow fit, not price.",
  },
  verdict:
    "There's no single winner — the three have diverged enough that the right pick depends on what you do, and at the $20/mo entry tier price is identical, so the decision is almost entirely about workflow fit. Choose Claude for coding (top of SWE-bench Verified, plus the Claude Code CLI for agentic editing) and long-document analysis (a 1M-token context window with the best instruction-following on dense inputs). Choose Gemini for research that needs live citations (native Google Search grounding in every answer plus Deep Research) and for teams standardized on Google Workspace. Choose ChatGPT for the broadest general-purpose coverage: the largest plugin/app ecosystem, native DALL-E 3 image generation, and the strongest consumer voice mode. For high-volume API workloads, Gemini 3.5 Flash is ~25–30× cheaper per token and the first model to evaluate.",
  category: "technology",
  entities: [
    {
      id: CHATGPT,
      slug: CHATGPT,
      name: "ChatGPT",
      shortDesc:
        "OpenAI's general-purpose assistant (GPT-5.5) with the broadest ecosystem, native image generation, and the best voice mode.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Largest plugin/app ecosystem — GPTs, the Operator agent, and the broadest third-party API adoption",
        "Native DALL-E 3 image generation integrated directly into chat",
        "Best consumer voice mode — Advanced Voice with low latency and natural turn-taking",
        "Broadest general-purpose coverage; one tool for ~90% of use cases without configuration",
        "Strong GPT-5.5 coding for one-shot snippets, boilerplate, and explaining unfamiliar code",
      ],
      cons: [
        "Context window capped at 128K on Plus — a meaningful gap for long codebases or document review",
        "End-to-end agentic editing is less polished than Claude Code at the same price",
        "Web citations appear less systematically than Gemini's native Search grounding",
        "Cloud-only — Azure OpenAI is the closest to a self-host option",
      ],
      bestFor: "Best for general-purpose use & ecosystem",
    },
    {
      id: CLAUDE,
      slug: CLAUDE,
      name: "Claude",
      shortDesc:
        "Anthropic's assistant (Sonnet 4.6 / Opus 4.8) leading on coding, agentic editing, and long-context document analysis.",
      imageUrl: null,
      entityType: "software",
      position: 2,
      pros: [
        "#1 on SWE-bench Verified (Opus 4.8) plus the Claude Code CLI for autonomous agentic editing",
        "1M-token context on paid tiers — entire codebases or 300-page contracts in a single prompt",
        "Best instruction-following on long, dense documents (fewer lost-in-the-middle errors)",
        "Enterprise no-training-data guarantee, SAML SSO, and audit logs",
        "Strong, nuanced writing quality",
      ],
      cons: [
        "No native image generation — reads images but cannot create them",
        "Limited consumer voice mode; the experience is primarily text-based",
        "Live-web research comes via Computer Use / integrations, not a native search toggle",
        "No public fine-tuning of the models via API",
      ],
      bestFor: "Best for coding & long-document analysis",
    },
    {
      id: GEMINI,
      slug: GEMINI,
      name: "Gemini",
      shortDesc:
        "Google's assistant (3.1 Pro / 3.5 Flash) with native Search grounding, Deep Research, and in-flow Workspace integration.",
      imageUrl: null,
      entityType: "software",
      position: 3,
      pros: [
        "Native Google Search grounding with clickable citations in every answer",
        "Deep Research mode — the strongest agentic research workflow at the $20/mo tier",
        "Gemini 3.5 Flash is ~25–30× cheaper per token (~$0.10/1M) — best for high-volume API",
        "In-flow Google Workspace integration across Gmail, Docs, Sheets, Drive, and Meet",
        "Broadest multilingual quality and strongest OCR on poor-quality scans",
      ],
      cons: [
        "Imagen 4 image generation is less seamlessly integrated into chat than ChatGPT's DALL-E",
        "Coding trails Claude (~80% vs #1 on SWE-bench Verified)",
        "More lost-in-the-middle errors than Claude on dense 100+ page documents",
        "Voice mode is still rolling out",
      ],
      bestFor: "Best for research & Google Workspace",
    },
  ],
  // Top 3 differences — the draft's load-bearing decision trio (coding, research,
  // ecosystem). N-entity values[] are position-indexed to entities[]. Not rendered
  // by MultiEntityLayout v1 but persisted for completeness and future layout use.
  keyDifferences: [
    {
      label: "Coding & agentic development",
      entityAValue: "Strong (GPT-5.5); Operator agent for browser automation",
      entityBValue: "#1 on SWE-bench Verified; Claude Code CLI for agentic editing",
      values: [
        "Strong (GPT-5.5); Operator agent for browser automation",
        "#1 on SWE-bench Verified; Claude Code CLI for agentic editing",
        "Competitive (3.1 Pro); best for GCP / Firebase developers",
      ],
      winnerIndex: 1,
    },
    {
      label: "Cited research & web grounding",
      entityAValue: "Browse mode; citations appear inconsistently",
      entityBValue: "Via Computer Use / integrations, no native search toggle",
      values: [
        "Browse mode; citations appear inconsistently",
        "Via Computer Use / integrations, no native search toggle",
        "Native Search grounding in every answer + Deep Research",
      ],
      winnerIndex: 2,
    },
    {
      label: "Ecosystem & general-purpose breadth",
      entityAValue: "Largest — GPTs, Operator, voice mode, native DALL-E",
      entityBValue: "MCP-based ecosystem (growing)",
      values: [
        "Largest — GPTs, Operator, voice mode, native DALL-E",
        "MCP-based ecosystem (growing)",
        "Deep Google Workspace / app integrations",
      ],
      winnerIndex: 0,
    },
  ],
  // ~22 attributes — the draft's full capability + pricing tables, one value per entity.
  attributes: [
    textAttr("headline-model", "Headline model", "Models & capability", "GPT-5.5 (Plus/Pro)", "Sonnet 4.6, Opus 4.8", "Gemini 3.1 Pro, 3.5 Flash"),
    textAttr("context-window", "Context window", "Models & capability", "128K (Plus); longer on Pro", "1M tokens (Sonnet/Opus paid)", "1M tokens (3.1 Pro)"),
    textAttr("coding-benchmark", "Coding (SWE-bench Verified)", "Models & capability", "Strong (GPT-5.5)", "#1 (Opus 4.8 + Claude Code)", "Competitive (3.1 Pro)"),
    textAttr("web-grounding", "Web grounding / citations", "Models & capability", "Yes (browse mode)", "Via integrations / Computer Use", "Native Search grounding"),
    textAttr("multilingual", "Multilingual quality", "Models & capability", "Strong across 50+ languages", "Strong (esp. European + Japanese)", "Broadest (Google translation lineage)"),
    textAttr("structured-output", "Structured output / JSON mode", "Models & capability", "Strict JSON mode + tool calling", "Strict tool use + JSON schemas", "Controlled generation + JSON schemas"),
    textAttr("training-cutoff", "Training data cut-off", "Models & capability", "~2025 (browse compensates)", "~2025", "~2025 (Search compensates)"),
    textAttr("image-input", "Image input", "Multimodal", "Yes", "Yes", "Yes"),
    textAttr("image-generation", "Image generation", "Multimodal", "Yes — DALL-E 3", "No (no native)", "Yes — Imagen 4"),
    textAttr("voice-mode", "Voice mode", "Multimodal", "Yes — Advanced Voice", "Limited (API-based)", "Yes (rolling out)"),
    textAttr("agentic-capability", "Agentic capability", "Agentic & dev", "Operator agent", "Claude Code + Computer Use", "Agentic in Workspace"),
    textAttr("plugin-ecosystem", "Plugin / app ecosystem", "Agentic & dev", "Largest (GPTs, Operator)", "MCP-based (growing)", "Google integrations"),
    textAttr("mobile-app", "Mobile app quality", "Platform", "Polished, top-rated", "iOS/Android, catching up", "Polished; merges with Google app on Android"),
    textAttr("prompt-caching", "Prompt caching (API)", "Platform", "Automatic on supported models", "Explicit cache markers (5m / 1h)", "Implicit + explicit context caching"),
    textAttr("fine-tuning", "Fine-tuning (API)", "Platform", "GPT-5.5-class + 4o-mini", "No public fine-tuning", "Gemini 3.5 Flash"),
    textAttr("self-host", "On-prem / self-host", "Platform", "Cloud-only (Azure OpenAI closest)", "Cloud-only (Bedrock / Vertex)", "Cloud-only (Vertex AI)"),
    textAttr("rate-limits", "API rate limits (Tier 1)", "Platform", "~500 RPM / 90K TPM (GPT-5.5)", "~50 RPM / 40K ITPM (Sonnet 4.6)", "~360 RPM / 4M TPM (3.1 Pro)"),
    textAttr("free-tier", "Free tier model", "Pricing", "GPT-5.5 mini (rate-limited)", "Sonnet 4.6 (rate-limited)", "3.5 Flash (generous limits)"),
    textAttr("paid-entry", "Paid entry plan", "Pricing", "ChatGPT Plus $20/mo", "Claude Pro $20/mo", "Google AI Pro $19.99/mo"),
    textAttr("extended-plan", "Power-user tier", "Pricing", "Pro $100/mo · Pro Max $200/mo", "Max $100–$200/mo", "Ultra $100–$200/mo"),
    textAttr("team-plan", "Team plan", "Pricing", "~$30/user/mo", "$30/user/mo", "Workspace Business (varies)"),
    textAttr("api-input-price", "API input (per 1M tokens)", "Pricing", "GPT-5.5: ~$2.50", "Sonnet 4.6: $3.00", "3.5 Flash: ~$0.10"),
  ],
  // 7 FAQs verbatim from draft v1.2 → FAQPage schema.
  faqs: [
    {
      question: "Is ChatGPT or Claude better in 2026?",
      answer:
        "Claude leads for coding (SWE-bench #1), long-document analysis (1M-token context), and nuanced writing. ChatGPT leads for ecosystem breadth, voice mode quality, native image generation, and general-purpose coverage. At the same $20/mo price, the right pick depends on your primary workflows.",
    },
    {
      question: "Is Gemini better than ChatGPT?",
      answer:
        "For Google Workspace users and research tasks requiring live citations, Gemini is stronger. For ecosystem breadth, image generation, and voice mode, ChatGPT leads. They're competitive at the same price; Gemini's Deep Research is the best agentic research workflow available at the $20/mo tier.",
    },
    {
      question: "Which AI is best for coding?",
      answer:
        "Claude (Opus 4.8 + Claude Code) leads on coding benchmarks and autonomous editing workflows. GitHub Copilot remains the default in-IDE completion tool; Claude is stronger for whole-codebase reasoning and agentic refactoring passes.",
    },
    {
      question: "Can I use all three for free?",
      answer:
        "Yes. ChatGPT free uses GPT-5.5 mini with rate limits. Claude free uses Sonnet 4.6 with daily caps. Gemini free uses 3.5 Flash — the most functional free tier of the three for everyday use.",
    },
    {
      question: "Which has the biggest context window?",
      answer:
        "Claude and Gemini both offer 1M-token context on paid tiers. ChatGPT Plus is capped at 128K. For large-document or large-codebase work, Claude Pro at $20/mo is the best price-to-context value.",
    },
    {
      question: "Which is best for enterprise?",
      answer:
        "Claude Enterprise for coding-heavy, document-analysis, and long-context teams. ChatGPT Enterprise for ecosystem-first and agent-automation use cases. Gemini for Google Workspace/GCP-standardized organizations.",
    },
    {
      question: "Which AI chatbot has the best API for production apps?",
      answer:
        "Gemini 3.5 Flash is ~25–30× cheaper per token than GPT-5.5 or Claude Sonnet 4.6 at list prices — the obvious first choice for high-volume production apps with cost constraints. For reasoning-quality-first use cases, Claude Sonnet 4.6 and GPT-5.5 are competitive. All three support prompt caching to reduce costs on repeated-context calls.",
    },
  ],
  relatedComparisons: [
    { slug: "chatgpt-vs-claude", title: "ChatGPT vs Claude", category: "technology" },
    { slug: "claude-vs-gemini", title: "Claude vs Gemini", category: "technology" },
    { slug: "chatgpt-vs-gemini", title: "ChatGPT vs Gemini", category: "technology" },
  ],
  relatedBlogPosts: [],
  metadata: {
    metaTitle: "ChatGPT vs Claude vs Gemini: Which Wins in 2026?",
    metaDescription:
      "ChatGPT vs Claude vs Gemini compared — coding, 1M-token context, cited research, image generation, voice, and pricing. Find the best AI for your workflow in 2026.",
    publishedAt: DATE_PUBLISHED,
    updatedAt: DATE_MODIFIED,
    isAutoGenerated: false,
    isHumanReviewed: true,
    viewCount: 0,
  },
};

// ---------------------------------------------------------------------------
// Editorial schema-3way v1 @graph (DAN-841 / DAN-854). Mirrors the locked
// contract from buildMultiEntityGraph (single @graph, cross-referenced @id
// nodes, ItemList container) and pins the entry-tier Offers: ChatGPT Plus $20,
// Claude Pro $20, Google AI Pro $19.99.
// ---------------------------------------------------------------------------
const URL = `${SITE}/compare/${SLUG}`;
const ITEM_LIST_ID = `${URL}#comparison`;
const ITEM_A = `${URL}#item-a`; // ChatGPT
const ITEM_B = `${URL}#item-b`; // Claude
const ITEM_C = `${URL}#item-c`; // Gemini

function buildSchemaGraph(datePublished: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: comparison.title,
        description: comparison.shortAnswer,
        url: URL,
        datePublished,
        dateModified: DATE_MODIFIED,
        author: { "@type": "Organization", name: "A Versus B", url: SITE },
        publisher: {
          "@type": "Organization",
          name: "A Versus B",
          url: SITE,
          logo: { "@type": "ImageObject", url: `${SITE}/images/logo.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": URL },
        mainEntity: { "@id": ITEM_LIST_ID },
      },
      {
        "@type": "ItemList",
        "@id": ITEM_LIST_ID,
        name: comparison.title,
        description: "Comparison between ChatGPT, Claude, Gemini",
        numberOfItems: 3,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": ITEM_A } },
          { "@type": "ListItem", position: 2, item: { "@id": ITEM_B } },
          { "@type": "ListItem", position: 3, item: { "@id": ITEM_C } },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_A,
        name: "ChatGPT",
        url: `${SITE}/entity/chatgpt`,
        description: comparison.entities[0].shortDesc,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        publisher: { "@type": "Organization", name: "OpenAI" },
        offers: {
          "@type": "Offer",
          price: "20.00",
          priceCurrency: "USD",
          category: "ChatGPT Plus (per month)",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_B,
        name: "Claude",
        url: `${SITE}/entity/claude`,
        description: comparison.entities[1].shortDesc,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        publisher: { "@type": "Organization", name: "Anthropic" },
        offers: {
          "@type": "Offer",
          price: "20.00",
          priceCurrency: "USD",
          category: "Claude Pro (per month)",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_C,
        name: "Gemini",
        url: `${SITE}/entity/gemini`,
        description: comparison.entities[2].shortDesc,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        publisher: { "@type": "Organization", name: "Google" },
        offers: {
          "@type": "Offer",
          price: "19.99",
          priceCurrency: "USD",
          category: "Google AI Pro (per month)",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "technology", item: `${SITE}/category/technology` },
          { "@type": "ListItem", position: 3, name: comparison.title, item: URL },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: comparison.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

async function main() {
  console.log(`Publishing multi-way comparison slug="${SLUG}"...`);

  const result = await saveComparison(comparison);
  if (!result) {
    console.error("FAIL: saveComparison returned null. Check DATABASE_URL.");
    process.exit(1);
  }
  console.log(`Comparison saved: id=${result.id}`);

  const prisma = getPrisma();
  if (!prisma) {
    console.error("FAIL: no DB connection for schema_markup update.");
    process.exit(1);
  }

  // Freeze datePublished: set only on first publish (DAN-608 §4).
  const existing = await prisma.comparison.findUnique({
    where: { slug: SLUG },
    select: { publishedAt: true },
  });
  const frozenDatePublished = existing?.publishedAt
    ? existing.publishedAt.toISOString()
    : DATE_PUBLISHED;

  await prisma.comparison.update({
    where: { slug: SLUG },
    data: {
      schemaMarkup: buildSchemaGraph(frozenDatePublished) as object,
      publishedAt: existing?.publishedAt ?? new Date(frozenDatePublished),
    },
  });

  console.log(
    `Schema markup stored (SoftwareApplication ×3 + ItemList + FAQPage + BreadcrumbList). ` +
      `datePublished=${frozenDatePublished} dateModified=${DATE_MODIFIED}`,
  );
  console.log(`Live URL (after ISR): ${URL}`);
}

main().catch((err) => {
  console.error("Publish error:", err);
  process.exit(1);
});
