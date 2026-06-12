/**
 * Publish: React vs Vue vs Angular (DAN-1004 / DAN-840)
 *
 * Ingests the CMO-final-approved DAN-840 draft v2 (rev 2b768a1b, 2,563w) into
 * the prod comparisons DB so the page SSRs the editorial draft instead of the
 * <DynamicComparison> on-demand AI placeholder (same failure mode fixed in
 * DAN-993). Root cause: no `comparison` DB row for `react-vs-vue-vs-angular`.
 *
 * Multi-way (3 entities) — renders via MultiEntityLayout (DAN-387 Phase 1) and
 * emits the schema-3way v1 @graph (DAN-841 §Frontend / DAN-854):
 * SoftwareApplication ×3 + ItemList + FAQPage + BreadcrumbList + Article.
 *
 * NOTE — NO Offer nodes. React, Vue, and Angular are all free, MIT-licensed
 * open-source projects (Frontend-cluster decision per DAN-1004: emit
 * SoftwareApplication with no Offer). This diverges from the notion/chatgpt
 * precedents which pin entry-tier Offers for paid SaaS.
 *
 * Precedent: scripts/publish-notion-vs-obsidian-vs-logseq.ts (DAN-993, multi-way
 * comparison shape + idempotent schema persist), scripts/publish-dan827-best-cloud-platforms-2026.ts
 * (validate + idempotent upsert).
 *
 * Run with:
 *   npx tsx scripts/publish-react-vs-vue-vs-angular.ts
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

const SLUG = "react-vs-vue-vs-angular";
const SITE = "https://www.aversusb.net";

// DAN-840 draft v2 content-lock (rev 2b768a1b, document updatedAt 2026-05-29).
const DATE_PUBLISHED = new Date().toISOString(); // overwritten only on first publish
const DATE_MODIFIED = "2026-05-29T07:40:11Z";

const REACT = "react";
const VUE = "vue";
const ANGULAR = "angular";

// Shared TL;DR — "no universal winner; team background + project scale decide"
// framing from draft v2's verdict-by-use-case table.
const TLDR =
  "There's no universal winner. React wins on ecosystem breadth and hiring liquidity (~25M weekly npm downloads, ~47% of projects) and is the safe default for SaaS startups, full-stack Next.js apps, and React Native crossover. Vue has the lowest learning curve, the best-written docs, and the highest developer satisfaction (82% in State of JS 2025) — ideal for gradual adoption and design-led teams. Angular is the batteries-included, TypeScript-first enterprise pick for large teams with Java/.NET backgrounds and 5–10 year maintenance horizons. The deciding factors are your team's background, project scale, and how much hiring liquidity you need.";

// Helper to build a text attribute row mapping the draft's Framework-comparison
// table into per-entity AttributeValues (one value per entity, in entity order).
function textAttr(
  slug: string,
  name: string,
  category: string,
  react: string,
  vue: string,
  angular: string,
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
      { entityId: REACT, valueText: react, valueNumber: null, valueBoolean: null },
      { entityId: VUE, valueText: vue, valueNumber: null, valueBoolean: null },
      { entityId: ANGULAR, valueText: angular, valueNumber: null, valueBoolean: null },
    ],
  };
}

const comparison: ComparisonPageData = {
  id: SLUG,
  slug: SLUG,
  title:
    "React vs Vue vs Angular: Which JavaScript Framework Is Best in 2026?",
  shortAnswer: TLDR,
  quickAnswer: {
    tldr: TLDR,
    winnerName: null,
    winnerReason:
      "It depends on your team and project — ecosystem & hiring (React), lowest barrier & satisfaction (Vue), or enterprise structure (Angular).",
    keyFact:
      "All three are free and MIT-licensed; React has the largest ecosystem (~25M weekly downloads), Vue the smallest runtime, Angular the strongest enterprise conventions.",
  },
  verdict:
    "There's no single winner — the right pick depends on team background and project scale. Choose React for the deepest ecosystem, the most liquid hiring pool, Next.js full-stack SSR/RSC, and React Native mobile crossover; it's the safe default for most SaaS startups. Choose Vue for the lowest learning curve, the best documentation, a cohesive official stack (Pinia, Vue Router, Vite), the smallest runtime, and the highest developer satisfaction — ideal for incremental adoption and design-led teams. Choose Angular for large enterprise applications, mandatory TypeScript, batteries-included routing/forms/HTTP, and teams with Java/.NET backgrounds maintaining 5–10 year codebases. The load-bearing decision is library-vs-progressive-vs-batteries-included matched to your team: React maximizes flexibility and candidates, Vue minimizes ramp-up friction, and Angular minimizes architecture debates on large teams.",
  category: "technology",
  entities: [
    {
      id: REACT,
      slug: REACT,
      name: "React",
      shortDesc:
        "UI library (not a full framework) that composes into a framework via community packages; maintained by Meta.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Largest ecosystem — ~25M weekly npm downloads; most new libraries target React first",
        "Deepest, most liquid hiring pool (~40% of professional devs) — fastest time-to-hire",
        "React Native lets web React developers build native mobile apps",
        "Next.js is the dominant full-stack meta-framework (SSR, SSG, API routes, Server Components)",
        "React 19 Server Components ship 0 KB JS for static subtrees; strong real-world INP",
      ],
      cons: [
        "JSX and useEffect re-render mechanics are a real learning curve for newcomers",
        "\"Just a library\" — routing, state, and data-fetching are all third-party decisions",
        "Larger base bundle (~130 KB) than Vue",
        "Ecosystem churn — recommended tooling and best practices shift frequently",
      ],
      bestFor: "Best for ecosystem & hiring",
    },
    {
      id: VUE,
      slug: VUE,
      name: "Vue",
      shortDesc:
        "Progressive framework designed for incremental adoption; community-maintained (Evan You / core team).",
      imageUrl: null,
      entityType: "software",
      position: 2,
      pros: [
        "Lowest barrier to entry; documentation widely cited as the best in any JS framework",
        "Cohesive official stack — Pinia, Vue Router, Vite, and VueUse are tightly integrated",
        "Smallest base runtime (~70 KB); Vue Vapor drops to ~20 KB by skipping the virtual DOM",
        "Highest developer satisfaction (82% in State of JS 2025)",
        "Progressive — drop in via a CDN script tag with no build step, or scale up with Nuxt",
      ],
      cons: [
        "Smaller ecosystem (~5M weekly downloads) and hiring pool (~7–9% of US listings)",
        "Fewer third-party component libraries target Vue first",
        "Vapor mode is still maturing through 2026",
        "Less corporate backing than React (Meta) or Angular (Google)",
      ],
      bestFor: "Best for gradual adoption",
    },
    {
      id: ANGULAR,
      slug: ANGULAR,
      name: "Angular",
      shortDesc:
        "Batteries-included, TypeScript-first enterprise framework from Google with opinions about everything.",
      imageUrl: null,
      entityType: "software",
      position: 3,
      pros: [
        "Batteries-included — routing, HTTP client, forms, animations, and testing built in",
        "TypeScript-first by design; CLI generates consistent, well-typed boilerplate",
        "Strong fit for Java/.NET enterprise teams and 5–10 year application lifecycles",
        "Google-backed and stable in enterprise, finance, healthcare, and government accounts",
        "Angular Signals (v19 default) modernized reactivity; Zoneless mode cuts ~40 KB",
      ],
      cons: [
        "Steepest learning curve — DI, RxJS, decorators, and modules to learn up front",
        "Largest base bundle (~180 KB with Zone.js)",
        "Lowest developer satisfaction of the three (54% in State of JS 2025)",
        "Smaller hiring pool outside enterprise verticals",
        "Not recommended as a first JavaScript framework due to its complexity",
      ],
      bestFor: "Best for enterprise apps",
    },
  ],
  // Top 3 differences (ecosystem/job-market, learning curve & adoption model,
  // architecture opinionation). N-entity values[] are position-indexed to
  // entities[]. Not rendered by MultiEntityLayout v1 but persisted for
  // completeness and future layout use.
  keyDifferences: [
    {
      label: "Ecosystem & job market",
      entityAValue: "~25M weekly downloads, ~47% of projects — deepest ecosystem & hiring pool",
      entityBValue: "~5M weekly downloads — smaller but cohesive official stack",
      values: [
        "~25M weekly downloads, ~47% of projects — deepest ecosystem & hiring pool",
        "~5M weekly downloads — smaller but cohesive official stack",
        "~3M weekly downloads — self-contained, enterprise-concentrated hiring",
      ],
      winnerIndex: 0,
    },
    {
      label: "Learning curve & adoption model",
      entityAValue: "Medium — JSX and hooks have a ramp; richest learning resources",
      entityBValue: "Low — progressive, drop-in, best-documented; easiest to start",
      values: [
        "Medium — JSX and hooks have a ramp; richest learning resources",
        "Low — progressive, drop-in, best-documented; easiest to start",
        "High — DI, RxJS, decorators, and mandatory TypeScript up front",
      ],
      winnerIndex: 1,
    },
    {
      label: "Architecture opinionation",
      entityAValue: "UI library — bring-your-own routing, state, and data-fetching",
      entityBValue: "Progressive framework — official packages, adopt incrementally",
      values: [
        "UI library — bring-your-own routing, state, and data-fetching",
        "Progressive framework — official packages, adopt incrementally",
        "Batteries-included framework — opinions about everything, built in",
      ],
      winnerIndex: "tie",
    },
  ],
  // ~20 attributes — the draft's full Framework-comparison table, one value per entity.
  attributes: [
    textAttr("type", "Type", "Architecture", "UI library (not a full framework)", "Progressive framework", "Full MVC framework"),
    textAttr("maintained-by", "Maintained by", "Architecture", "Meta (open-source)", "Community (Evan You / core team)", "Google"),
    textAttr("first-release", "First release", "Architecture", "2013", "2014", "2016 (Angular 2+)"),
    textAttr("current-version", "Current major version", "Architecture", "React 19 (2026)", "Vue 3 (Composition API)", "Angular 19"),
    textAttr("language-default", "Language default", "Language & types", "JavaScript / JSX", "HTML templates + <script setup>", "TypeScript (mandatory)"),
    textAttr("typescript-support", "TypeScript support", "Language & types", "Excellent (optional)", "Excellent (optional)", "First-class (required)"),
    textAttr("learning-curve", "Learning curve", "Developer experience", "Medium", "Low–Medium", "High"),
    textAttr("bundle-size", "Bundle size (base)", "Performance", "~130 KB", "~70 KB", "~180 KB (with Zone.js)"),
    textAttr("state-management", "State management", "Ecosystem", "Zustand / Redux / Context", "Pinia (official)", "NgRx / Services"),
    textAttr("routing", "Routing", "Ecosystem", "React Router", "Vue Router (official)", "Angular Router (built-in)"),
    textAttr("form-handling", "Form handling", "Ecosystem", "React Hook Form / Formik", "VeeValidate / built-in", "Reactive Forms (built-in)"),
    textAttr("data-fetching", "Data fetching", "Ecosystem", "TanStack Query / SWR", "TanStack Query / ofetch", "HttpClient (built-in)"),
    textAttr("ssr-ssg", "SSR / SSG meta-framework", "Ecosystem", "Next.js (dominant)", "Nuxt", "Angular Universal"),
    textAttr("mobile", "Mobile app framework", "Ecosystem", "React Native", "—", "NativeScript (unofficial)"),
    textAttr("cli-tooling", "CLI / build tooling", "Tooling", "Vite / CRA (deprecated)", "Vite (default)", "Angular CLI"),
    textAttr("testing", "Testing (default)", "Tooling", "React Testing Library + Vitest", "Vitest (official)", "Jasmine + Karma (built-in)"),
    textAttr("licensing", "Licensing", "Licensing", "MIT", "MIT", "MIT"),
    textAttr("npm-downloads", "npm weekly downloads", "Adoption", "~25M", "~5M", "~3M"),
    textAttr("github-stars", "GitHub stars", "Adoption", "~230K", "~210K", "~95K"),
    textAttr("satisfaction", "State of JS satisfaction (2025)", "Adoption", "71%", "82%", "54%"),
  ],
  // 7 FAQs verbatim from draft v2 → FAQPage schema.
  faqs: [
    {
      question: "Is React or Angular better in 2026?",
      answer:
        "React leads on ecosystem breadth, hiring pool, and flexibility for small-to-medium teams. Angular leads on enterprise structure, TypeScript-first conventions, and teams with Java/.NET backgrounds. At scale, both work — Angular imposes more convention, which is a feature for large teams and a cost for small ones.",
    },
    {
      question: "Should I learn React or Vue first?",
      answer:
        "Vue has a slightly lower barrier to entry and better documentation for beginners. React has more tutorials, job listings, and community resources, making it easier to find help. Either is a solid first framework — React's market dominance means React skills transfer to more job opportunities.",
    },
    {
      question: "Is Angular still relevant in 2026?",
      answer:
        "Yes — Angular remains widely used in enterprise environments and has a strong Google backing. Angular's adoption of Signals (replacing Zone.js) and standalone components has modernized the framework significantly. Angular's market share is smaller than React's but stable in enterprise accounts.",
    },
    {
      question: "Why does React have more downloads than Vue or Angular?",
      answer:
        "React's download advantage is partly real (more projects) and partly artificial — many React npm packages are downloaded as transitive dependencies of other tools. Vue and Angular download counts don't inflate the same way. React's real-world project share (~47%) is substantial but smaller than download counts imply.",
    },
    {
      question: "Which framework has the best performance?",
      answer:
        "All three are fast enough for production applications. Vue 3 Vapor has the smallest runtime; React Server Components reduce client bundle size for content-heavy apps; Angular Signals modernized Angular's reactivity. Performance differences between them are less significant than implementation choices within any framework.",
    },
    {
      question: "Which is best for beginners?",
      answer:
        "Vue and React are both beginner-friendly. Vue's single-file component format and progressive adoption model give it a slight edge for beginners. React has more learning resources, tutorials, and courses. Angular is not recommended as a first JavaScript framework due to its complexity and mandatory TypeScript.",
    },
    {
      question: "Can I use TypeScript with React and Vue?",
      answer:
        "Yes — both support TypeScript excellently. React with TypeScript is standard in most new production projects. Vue 3's <script setup lang=\"ts\"> provides clean TypeScript inference. Angular requires TypeScript — it has no JavaScript mode.",
    },
  ],
  relatedComparisons: [
    { slug: "react-vs-vue", title: "React vs Vue", category: "technology" },
    { slug: "react-vs-angular", title: "React vs Angular", category: "technology" },
  ],
  relatedBlogPosts: [],
  metadata: {
    metaTitle: "React vs Vue vs Angular: Which Wins in 2026?",
    metaDescription:
      "React vs Vue vs Angular compared — ecosystem size, learning curve, performance (INP), TypeScript, mobile, and the 2026 hiring market. Pick the right JS framework.",
    publishedAt: DATE_PUBLISHED,
    updatedAt: DATE_MODIFIED,
    isAutoGenerated: false,
    isHumanReviewed: true,
    viewCount: 0,
  },
};

// ---------------------------------------------------------------------------
// Editorial schema-3way v1 @graph (DAN-841 §Frontend / DAN-854).
// Mirrors buildMultiEntityGraph's locked contract (single @graph, cross-referenced
// @id nodes, ItemList container). NO Offer nodes — React/Vue/Angular are free,
// MIT-licensed OSS (DAN-1004 Frontend-cluster decision: SoftwareApplication, no Offer).
// ---------------------------------------------------------------------------
const URL = `${SITE}/compare/${SLUG}`;
const ITEM_LIST_ID = `${URL}#comparison`;
const ITEM_A = `${URL}#item-a`; // React
const ITEM_B = `${URL}#item-b`; // Vue
const ITEM_C = `${URL}#item-c`; // Angular

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
        description: "Comparison between React, Vue, Angular",
        numberOfItems: 3,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": ITEM_A } },
          { "@type": "ListItem", position: 2, item: { "@id": ITEM_B } },
          { "@type": "ListItem", position: 3, item: { "@id": ITEM_C } },
        ],
      },
      {
        // SoftwareApplication — NO offers (free MIT OSS).
        "@type": "SoftwareApplication",
        "@id": ITEM_A,
        name: "React",
        url: `${SITE}/entity/react`,
        description: comparison.entities[0].shortDesc,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        license: "https://opensource.org/licenses/MIT",
        publisher: { "@type": "Organization", name: "Meta" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_B,
        name: "Vue",
        url: `${SITE}/entity/vue`,
        description: comparison.entities[1].shortDesc,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        license: "https://opensource.org/licenses/MIT",
        publisher: { "@type": "Organization", name: "Vue.js" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_C,
        name: "Angular",
        url: `${SITE}/entity/angular`,
        description: comparison.entities[2].shortDesc,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        license: "https://opensource.org/licenses/MIT",
        publisher: { "@type": "Organization", name: "Google" },
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

// ---------------------------------------------------------------------------
// Pre-flight validation (validate + idempotent upsert precedent, DAN-993/DAN-827).
// ---------------------------------------------------------------------------
function validate() {
  const errors: string[] = [];
  if (comparison.entities.length !== 3) errors.push(`expected 3 entities, got ${comparison.entities.length}`);
  if (comparison.faqs.length !== 7) errors.push(`expected 7 FAQs, got ${comparison.faqs.length}`);
  if (comparison.attributes.length < 18) errors.push(`expected ~20 attributes, got ${comparison.attributes.length}`);
  if (!comparison.metadata.isHumanReviewed) errors.push("isHumanReviewed must be true");
  if (comparison.metadata.isAutoGenerated) errors.push("isAutoGenerated must be false");
  for (const a of comparison.attributes) {
    if (a.values.length !== 3) errors.push(`attribute ${a.slug} must have 3 values, got ${a.values.length}`);
  }
  // Schema invariant: SoftwareApplication ×3 + ItemList + FAQPage + BreadcrumbList, NO Offer.
  const graph = buildSchemaGraph(DATE_PUBLISHED)["@graph"];
  const json = JSON.stringify(graph);
  if (json.includes('"Offer"') || json.includes('"offers"')) errors.push("schema must NOT contain any Offer node");
  const swCount = graph.filter((n: { "@type"?: string }) => n["@type"] === "SoftwareApplication").length;
  if (swCount !== 3) errors.push(`expected 3 SoftwareApplication nodes, got ${swCount}`);
  for (const t of ["ItemList", "FAQPage", "BreadcrumbList"]) {
    if (!graph.some((n: { "@type"?: string }) => n["@type"] === t)) errors.push(`schema missing ${t} node`);
  }
  if (errors.length) {
    console.error("VALIDATION FAILED:\n  - " + errors.join("\n  - "));
    process.exit(1);
  }
  console.log("✔ validation passed (3 entities, 7 FAQs, 20 attributes, schema has no Offer)");
}

async function main() {
  console.log(`Publishing multi-way comparison slug="${SLUG}"...`);
  validate();

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
    `Schema markup stored (SoftwareApplication ×3 + ItemList + FAQPage + BreadcrumbList, no Offer). ` +
      `datePublished=${frozenDatePublished} dateModified=${DATE_MODIFIED}`,
  );
  console.log(`Live URL (after ISR): ${URL}`);
}

main().catch((err) => {
  console.error("Publish error:", err);
  process.exit(1);
});
