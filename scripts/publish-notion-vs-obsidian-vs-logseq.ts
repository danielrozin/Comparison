/**
 * Publish: Notion vs Obsidian vs Logseq (DAN-993 / DAN-839)
 *
 * Ingests the CMO-approved DAN-839 draft v3 (rev 66ede81b, 2,343w, June-2026
 * pricing re-verified) into the prod comparisons DB so the page SSRs the
 * editorial draft instead of the <DynamicComparison> on-demand AI placeholder.
 *
 * Multi-way (3 entities) — renders via MultiEntityLayout (DAN-387 Phase 1) and
 * emits the schema-3way v1 @graph (DAN-841 §1.1 PKM row / DAN-854):
 * SoftwareApplication ×3 + ItemList + FAQPage + BreadcrumbList + Article.
 *
 * Precedent: scripts/publish-iphone-16-pro-vs-galaxy-s25-ultra.ts (comparison
 * shape + idempotent schema persist), scripts/publish-dan827-best-cloud-platforms-2026.ts
 * (validate + idempotent upsert).
 *
 * Run with:
 *   npx tsx scripts/publish-notion-vs-obsidian-vs-logseq.ts
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

const SLUG = "notion-vs-obsidian-vs-logseq";
const SITE = "https://www.aversusb.net";

// DAN-839 draft v3 content-lock (rev 66ede81b, document updatedAt 2026-06-11).
const DATE_PUBLISHED = new Date().toISOString(); // overwritten only on first publish
const DATE_MODIFIED = "2026-06-11T21:52:19Z";

const NOTION = "notion";
const OBSIDIAN = "obsidian";
const LOGSEQ = "logseq";

// Shared TL;DR — load-bearing "single-player vs team" framing from draft v3.
const TLDR =
  "There's no universal winner. Notion is best for team collaboration and shared databases; Obsidian is best for personal knowledge management with its link graph and 1,500+ plugins; Logseq is best for daily-note outlining and is completely free and open-source. The deciding question is whether you need real-time team collaboration (Notion) or local-first data ownership (Obsidian or Logseq).";

// Helper to build a text attribute row mapping the draft's Feature-comparison
// table into per-entity AttributeValues (one value per entity, in entity order).
function textAttr(
  slug: string,
  name: string,
  category: string,
  notion: string,
  obsidian: string,
  logseq: string,
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
      { entityId: NOTION, valueText: notion, valueNumber: null, valueBoolean: null },
      { entityId: OBSIDIAN, valueText: obsidian, valueNumber: null, valueBoolean: null },
      { entityId: LOGSEQ, valueText: logseq, valueNumber: null, valueBoolean: null },
    ],
  };
}

const comparison: ComparisonPageData = {
  id: SLUG,
  slug: SLUG,
  title:
    "Notion vs Obsidian vs Logseq: Which Knowledge Management App Is Best in 2026?",
  shortAnswer: TLDR,
  quickAnswer: {
    tldr: TLDR,
    winnerName: null,
    winnerReason:
      "It depends on your use case — team collaboration (Notion) vs local-first data ownership (Obsidian or Logseq).",
    keyFact:
      "Notion is cloud-collaborative; Obsidian and Logseq are local-first and free for personal use.",
  },
  verdict:
    "There's no single winner — the right pick depends on whether you work solo or with a team. Choose Notion for team wikis, shared databases, and real-time collaboration. Choose Obsidian for personal knowledge management, a mature 1,500+ plugin ecosystem, and a powerful link graph with full data ownership. Choose Logseq for daily-journal outlining, first-class block references, and a completely free, open-source (AGPL) tool. The load-bearing decision is single-player vs team: Notion is the only collaborative option here, while Obsidian and Logseq are local-first, privacy-friendly tools you own outright.",
  category: "technology",
  entities: [
    {
      id: NOTION,
      slug: NOTION,
      name: "Notion",
      shortDesc:
        "Cloud-based collaborative team workspace with pages, databases, and real-time editing.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Real-time collaboration, shared databases, and granular sharing permissions",
        "Powerful database/table views — filter, sort, board, gallery, calendar, timeline",
        "No setup required — WYSIWYG web app works instantly for non-technical users",
        "Polished, built-in cross-device sync and a full-featured mobile app",
        "Notion AI bundled into Business/Enterprise plans (trial on Free/Plus)",
      ],
      cons: [
        "Proprietary block format — export flattens databases and migration is costly",
        "Notes stored on US servers, so weaker default privacy for sensitive data",
        "Limited extensibility — no in-app plugin system (integrate externally via API/Zapier)",
        "Requires internet; offline support is partial, not fully offline-first",
        "The team features that make it valuable need the paid Plus plan ($10/user/mo)",
      ],
      bestFor: "Best for team collaboration",
    },
    {
      id: OBSIDIAN,
      slug: OBSIDIAN,
      name: "Obsidian",
      shortDesc:
        "Local-first Markdown editor with a link graph and 1,500+ community plugins.",
      imageUrl: null,
      entityType: "software",
      position: 2,
      pros: [
        "Local-first plain Markdown — you own your data and it's readable in any editor",
        "1,500+ community plugins (Dataview, Canvas, spaced repetition, and more)",
        "Link graph surfaces connections, ideal for second-brain / Zettelkasten workflows",
        "Free for personal use; the $50/user/yr commercial license is optional since Feb 2025",
        "Fully offline-first by design",
      ],
      cons: [
        "No real-time collaboration — single-player by design",
        "Sync is your responsibility (Obsidian Sync $4/mo, iCloud, Dropbox, or Git)",
        "Setup investment — a productive workflow requires learning and wiring plugins",
        "No native team or shared-workspace features",
      ],
      bestFor: "Best for personal PKM",
    },
    {
      id: LOGSEQ,
      slug: LOGSEQ,
      name: "Logseq",
      shortDesc:
        "Open-source, block-based outliner built around daily journals and bidirectional links.",
      imageUrl: null,
      entityType: "software",
      position: 3,
      pros: [
        "Fully open-source (AGPL) and completely free, including for commercial use",
        "Block-based outliner with first-class bidirectional links and block references",
        "Journal-first daily notes that auto-aggregate via [[page links]] and #tags",
        "Local Markdown/EDN files — portable and private",
        "Built-in TODO/DOING/DONE task management",
      ],
      cons: [
        "Official Logseq Sync is still in beta — many rely on iCloud/Dropbox/Syncthing",
        "Mobile app is beta quality with occasional sync conflicts on heavy use",
        "Outliner-only format is polarizing for people who prefer prose writing",
        "Smaller plugin ecosystem (~100+) than Obsidian",
      ],
      bestFor: "Best for daily-note outlining",
    },
  ],
  // Top 3 differences (local-vs-cloud, collaboration, portability/AGPL). N-entity
  // values[] are position-indexed to entities[]. Not rendered by MultiEntityLayout
  // v1 but persisted for completeness and future layout use.
  keyDifferences: [
    {
      label: "Architecture (local vs cloud)",
      entityAValue: "Cloud-based SaaS — notes live on US servers",
      entityBValue: "Local-first Markdown files on your own device",
      values: [
        "Cloud-based SaaS — notes live on US servers",
        "Local-first Markdown files on your own device",
        "Local-first files (Markdown/EDN) on your own device",
      ],
      winnerIndex: "tie",
    },
    {
      label: "Collaboration",
      entityAValue: "Real-time multi-user editing and shared databases",
      entityBValue: "Single-player — no real-time collaboration",
      values: [
        "Real-time multi-user editing and shared databases",
        "Single-player — no real-time collaboration",
        "Single-player; collaboration only planned",
      ],
      winnerIndex: 0,
    },
    {
      label: "Portability & licensing",
      entityAValue: "Proprietary blocks; export flattens databases",
      entityBValue: "Plain Markdown; free but proprietary app",
      values: [
        "Proprietary blocks; export flattens databases",
        "Plain Markdown; free but proprietary app",
        "Plain Markdown; fully open-source (AGPL) and free",
      ],
      winnerIndex: 2,
    },
  ],
  // ~20 attributes — the draft's full Feature-comparison table, one value per entity.
  attributes: [
    textAttr("architecture", "Architecture", "Architecture & data", "Cloud-based SaaS", "Local Markdown files", "Local files (Markdown/EDN)"),
    textAttr("note-format", "Note format", "Architecture & data", "Proprietary blocks", "Plain Markdown", "Markdown + EDN (org-mode compatible)"),
    textAttr("data-portability", "Data portability", "Architecture & data", "CSV / Markdown export", "Native Markdown (always portable)", "Native Markdown"),
    textAttr("open-source", "Open-source", "Architecture & data", "No", "No (free but proprietary)", "Yes (AGPL)"),
    textAttr("collaboration", "Collaboration", "Collaboration & sync", "Yes — real-time", "No (single-player by default)", "Limited (planned)"),
    textAttr("offline-access", "Offline access", "Collaboration & sync", "Yes (with limitations)", "Yes — fully offline", "Yes — fully offline"),
    textAttr("sync", "Sync", "Collaboration & sync", "Cloud (built-in)", "Obsidian Sync ($4/mo) or iCloud/Dropbox", "Logseq Sync (beta) or manual"),
    textAttr("mobile-app", "Mobile app", "Collaboration & sync", "Yes", "Yes", "Yes (beta quality)"),
    textAttr("outliner-block-linking", "Outliner / block linking", "Notes & linking", "Limited", "Via Outliner plugin", "Native — every line is a block"),
    textAttr("bidirectional-links", "Bidirectional links", "Notes & linking", "Yes (basic)", "Yes (via [[links]])", "Yes — first-class feature"),
    textAttr("graph-network-view", "Graph / network view", "Notes & linking", "No", "Yes — link graph", "Yes (basic graph)"),
    textAttr("database-table-view", "Database / table view", "Notes & linking", "Yes — powerful", "Via Dataview plugin", "Via queries"),
    textAttr("templates", "Templates", "Notes & linking", "Yes", "Yes (community + core)", "Yes"),
    textAttr("kanban-tasks", "Kanban / tasks", "Notes & linking", "Yes (basic)", "Via plugins", "Built-in (TODO/DOING/DONE)"),
    textAttr("spaced-repetition", "Spaced repetition", "Notes & linking", "No", "Via Spaced Repetition plugin", "Via Scheduler plugin"),
    textAttr("plugin-ecosystem", "Plugin ecosystem", "Extensibility", "Limited (limited API)", "1,500+ community plugins", "100+ plugins"),
    textAttr("ai-integration", "AI integration", "Extensibility", "Notion AI (bundled in Business/Enterprise; trial on Free/Plus)", "Via plugins (Copilot, Smart Connections)", "Via plugins"),
    textAttr("price-personal", "Price (personal)", "Pricing", "Free (10 guests)", "Free", "Free"),
    textAttr("price-sync", "Price (sync)", "Pricing", "Included", "Obsidian Sync $4/mo", "Beta / manual sync"),
    textAttr("price-team", "Price (team)", "Pricing", "Plus $10/user/mo", "N/A (no team plan)", "N/A"),
  ],
  // 8 FAQs verbatim from draft v3 → FAQPage schema.
  faqs: [
    {
      question: "Is Notion or Obsidian better for note-taking?",
      answer:
        "They serve different use cases. Notion is better for team wikis, project management, and collaborative databases. Obsidian is better for personal knowledge management, long-term note archives, and users who want complete data ownership. Most serious users end up using both: Notion for team work, Obsidian for personal thinking.",
    },
    {
      question: "Is Obsidian free?",
      answer:
        "Yes — Obsidian is free for personal use with no time limit and no feature gates. Optional paid services are Obsidian Sync ($4/mo) and Obsidian Publish ($8/mo). An optional $50/user/year commercial license is available for business use, but is no longer required as of 2026.",
    },
    {
      question: "What is Logseq and how is it different from Obsidian?",
      answer:
        "Logseq is an open-source, block-based outliner with a daily-journal paradigm. Every line is a block with a unique reference, and the default view is a journal where you capture thoughts day by day. Obsidian is page-based with a richer plugin ecosystem and graph view. Logseq is preferred by users who think in outlines and value open-source; Obsidian is preferred by users who want maximum plugin flexibility and a document-first mental model.",
    },
    {
      question: "Can Notion replace Obsidian?",
      answer:
        "For personal knowledge management with offline-first requirements and Markdown portability, no. Notion requires internet access, stores data in a proprietary format, and lacks Obsidian's graph view and plugin ecosystem. For team collaboration and project management, Notion does things Obsidian cannot.",
    },
    {
      question: "Which is best for a second brain?",
      answer:
        "Obsidian is the most popular choice for \"second brain\" implementations (Zettelkasten, PARA, Building a Second Brain methodology). Its link graph, Dataview plugin, and community templates map well onto these systems. Logseq is preferred for the Zettelkasten method by users who prefer outliner-style capture. Notion is used for second-brain implementations but requires more discipline to avoid feature sprawl.",
    },
    {
      question: "Is Logseq better than Obsidian?",
      answer:
        "Neither is objectively better — they have different strengths. Logseq is better for daily journaling, block-level reference, and users who value open-source. Obsidian is better for long-form notes, a richer plugin ecosystem, and more stable sync. Many users migrate from Logseq to Obsidian as their note volume grows; others prefer Logseq's outliner forever.",
    },
    {
      question: "Does Notion work offline?",
      answer:
        "Partially. Notion has offline support for pages you've previously loaded, and changes sync when you reconnect. But it's not designed as a fully offline application — heavy use without internet will expose limitations. Obsidian and Logseq are fully offline-first by design.",
    },
    {
      question: "Can I move my notes between these three tools?",
      answer:
        "Yes, but with friction that depends on direction. Notion → Obsidian or Logseq is the hardest path: database properties flatten on export, embedded blocks lose context, and image attachments need re-linking after Markdown import. Obsidian ↔ Logseq is the smoothest pairing because both store plain Markdown locally — though Logseq's outliner reshapes prose paragraphs into bulleted blocks. Starting local-first preserves your future migration options.",
    },
  ],
  relatedComparisons: [
    { slug: "notion-vs-obsidian", title: "Notion vs Obsidian", category: "technology" },
    { slug: "notion-vs-clickup", title: "Notion vs ClickUp", category: "technology" },
  ],
  relatedBlogPosts: [],
  metadata: {
    metaTitle: "Notion vs Obsidian vs Logseq: Which Wins in 2026?",
    metaDescription:
      "Notion vs Obsidian vs Logseq compared — cloud vs local-first, collaboration, plugins, portability, and pricing. Find the right knowledge app for 2026.",
    publishedAt: DATE_PUBLISHED,
    updatedAt: DATE_MODIFIED,
    isAutoGenerated: false,
    isHumanReviewed: true,
    viewCount: 0,
  },
};

// ---------------------------------------------------------------------------
// Editorial schema-3way v1 @graph (DAN-841 §1.1 PKM row / DAN-854).
// Mirrors buildMultiEntityGraph's locked contract (single @graph, cross-referenced
// @id nodes, ItemList container) and adds the PKM-cluster Offers that the generic
// emitter defers: Notion Plus $10/mo, Obsidian $0 (Sync $4/mo add-on), Logseq $0.
// ---------------------------------------------------------------------------
const URL = `${SITE}/compare/${SLUG}`;
const ITEM_LIST_ID = `${URL}#comparison`;
const ITEM_A = `${URL}#item-a`; // Notion
const ITEM_B = `${URL}#item-b`; // Obsidian
const ITEM_C = `${URL}#item-c`; // Logseq

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
        description: "Comparison between Notion, Obsidian, Logseq",
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
        name: "Notion",
        url: `${SITE}/entity/notion`,
        description: comparison.entities[0].shortDesc,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        publisher: { "@type": "Organization", name: "Notion Labs, Inc." },
        offers: {
          "@type": "Offer",
          price: "10.00",
          priceCurrency: "USD",
          category: "Plus plan (per user, per month, billed annually)",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_B,
        name: "Obsidian",
        url: `${SITE}/entity/obsidian`,
        description: comparison.entities[1].shortDesc,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        publisher: { "@type": "Organization", name: "Obsidian" },
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "USD",
          description: "Free for personal use; Obsidian Sync $4/mo optional add-on",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_C,
        name: "Logseq",
        url: `${SITE}/entity/logseq`,
        description: comparison.entities[2].shortDesc,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        publisher: { "@type": "Organization", name: "Logseq" },
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "USD",
          description: "Free and open-source (AGPL)",
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
