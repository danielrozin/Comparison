/**
 * Publish: AWS vs Azure vs Google Cloud (GCP) (DAN-1005 / DAN-838)
 *
 * Ingests the CMO-signed-off DAN-838 draft v1 (rev 15f0cef5, 2,180w, document
 * updatedAt 2026-05-29) into the prod comparisons DB so the page SSRs the
 * editorial draft instead of the <DynamicComparison> on-demand AI placeholder.
 *
 * Multi-way (3 entities) — renders via MultiEntityLayout (DAN-387 Phase 1) and
 * emits the schema-3way v1 @graph (DAN-841 / DAN-854):
 * SoftwareApplication ×3 + ItemList + FAQPage + BreadcrumbList + Article.
 *
 * OMIT fixed Offer (DAN-841 cloud-cluster row): the major clouds are
 * usage-priced (pay-as-you-go + free tier). The $/hr compute figures in the
 * draft are illustrative on-demand list prices, not purchasable products, so no
 * SoftwareApplication carries an `offers` node — emitting a fixed price would be
 * a structured-data accuracy violation.
 *
 * Precedent: scripts/publish-chatgpt-vs-claude-vs-gemini.ts (DAN-998 / DAN-836)
 * and scripts/publish-notion-vs-obsidian-vs-logseq.ts (DAN-993 / DAN-839 —
 * multi-way comparison shape + idempotent schema persist).
 *
 * Run with:
 *   npx tsx scripts/publish-aws-vs-azure-vs-gcp.ts
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

const SLUG = "aws-vs-azure-vs-gcp";
const SITE = "https://www.aversusb.net";

// DAN-838 draft v1 content-lock (rev 15f0cef5, document updatedAt 2026-05-29).
const DATE_PUBLISHED = new Date().toISOString(); // overwritten only on first publish
const DATE_MODIFIED = "2026-05-29T07:34:05Z";

const AWS = "aws";
const AZURE = "azure";
const GCP = "gcp";

// Shared TL;DR — load-bearing "existing stack + primary workload, not price"
// framing from the draft's verdict-by-use-case table.
const TLDR =
  "There's no single best cloud — the right pick depends on your existing stack and primary workload. Choose AWS for the broadest service catalog (200+ services), the largest ecosystem and hiring pool, and greenfield/startup projects. Choose Azure for Microsoft-heavy enterprises (Active Directory, Office 365, .NET, SQL Server) and hybrid/on-prem integration via Azure Arc. Choose GCP for data analytics (BigQuery), AI/ML (Vertex AI + TPUs), Kubernetes (GKE), and automatic compute cost efficiency. AWS holds ~32% of the global cloud market, Azure ~23%, GCP ~12%.";

// Helper to build a text attribute row mapping the draft's service/pricing
// tables into per-entity AttributeValues (one value per entity, in entity order).
function textAttr(
  slug: string,
  name: string,
  category: string,
  aws: string,
  azure: string,
  gcp: string,
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
      { entityId: AWS, valueText: aws, valueNumber: null, valueBoolean: null },
      { entityId: AZURE, valueText: azure, valueNumber: null, valueBoolean: null },
      { entityId: GCP, valueText: gcp, valueNumber: null, valueBoolean: null },
    ],
  };
}

const comparison: ComparisonPageData = {
  id: SLUG,
  slug: SLUG,
  title: "AWS vs Azure vs Google Cloud (GCP): Which Cloud Is Best in 2026?",
  shortAnswer: TLDR,
  quickAnswer: {
    tldr: TLDR,
    winnerName: null,
    winnerReason:
      "It depends on what you already run and your primary workload — broadest catalog & ecosystem (AWS), Microsoft enterprise + hybrid (Azure), or data, AI/ML and Kubernetes (GCP).",
    keyFact:
      "AWS ~32% market share, Azure ~23%, GCP ~12% — the decision is existing stack and workload fit, not list price.",
  },
  verdict:
    "There's no single winner — the biggest factor in cloud selection is what you already run and who your team already knows how to use. Choose AWS as the safe default for greenfield and startup projects: the broadest service catalog (200+ services), the deepest hiring pool, the most tutorials, and the most SaaS integrations default to AWS, and Graviton instances give the best CPU price/performance. Choose Azure for Microsoft-heavy enterprises — Azure Active Directory is the identity system your users already log into, Azure Hybrid Benefit can cut lift-and-shift costs 40%+ by reusing Windows Server / SQL Server licenses, and Azure Arc/Stack is the strongest hybrid and on-prem story. Choose GCP for data-intensive and AI/ML-first organizations: BigQuery is the best serverless data warehouse, Vertex AI + TPU v4/v5 lead for large-model training, GKE is the most mature managed Kubernetes (Google invented it), and Sustained Use Discounts auto-apply with no commitment. Many large enterprises run all three (multi-cloud) — just model egress costs carefully.",
  category: "technology",
  entities: [
    {
      id: AWS,
      slug: AWS,
      name: "AWS",
      shortDesc:
        "Amazon Web Services — the broadest service catalog (200+ services), most mature ecosystem, and default choice for startups and greenfield projects.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Broadest service catalog — 200+ services and the most mature cloud ecosystem",
        "Largest hiring pool, most tutorials, and the most SaaS tools default to AWS integration",
        "Over 100 EC2 instance types; Graviton (4th-gen ARM) gives the best CPU price/performance",
        "Widest global edge — CloudFront has the largest PoP count for CDN",
        "AWS Nitro hypervisor delivers near-bare-metal performance across most instance classes",
      ],
      cons: [
        "On-demand list pricing is often the highest of the three; Reserved/Savings Plans need commitment",
        "Redshift still needs vacuum/sort-key/cluster tuning that BigQuery avoids",
        "No automatic sustained-use discount — you must commit to capture savings",
        "Custom ML silicon (Inferentia) trails Google's TPUs for large-model training",
      ],
      bestFor: "Best for service breadth & ecosystem",
    },
    {
      id: AZURE,
      slug: AZURE,
      name: "Microsoft Azure",
      shortDesc:
        "Microsoft's cloud — tight Active Directory, Office 365 and .NET integration plus the strongest hybrid/on-prem story via Azure Arc and Azure Stack.",
      imageUrl: null,
      entityType: "software",
      position: 2,
      pros: [
        "Deep Microsoft enterprise integration — Active Directory, Office 365, Visual Studio, SQL Server",
        "Azure Hybrid Benefit reuses existing Windows Server / SQL Server licenses, often cutting costs 40%+",
        "Strongest hybrid cloud — Azure Arc and Azure Stack extend Azure to on-prem, edge and multi-cloud",
        "Azure OpenAI Service gives enterprise-grade GPT access with data residency controls",
        "Azure DevOps and GitHub Enterprise integrate tightly for Microsoft-stack development teams",
      ],
      cons: [
        "No custom ML accelerator chip — trails AWS Graviton/Inferentia and GCP TPUs on silicon",
        "Synapse data warehouse trails BigQuery on serverless analytics simplicity",
        "Most of its cost advantage depends on already owning Microsoft licenses",
        "Smaller third-party ecosystem and hiring pool than AWS for non-Microsoft workloads",
      ],
      bestFor: "Best for Microsoft enterprise & hybrid",
    },
    {
      id: GCP,
      slug: GCP,
      name: "Google Cloud (GCP)",
      shortDesc:
        "Google's cloud — best-in-class data analytics (BigQuery), AI/ML (Vertex AI + TPUs), Kubernetes-native architecture (GKE), and automatic compute discounts.",
      imageUrl: null,
      entityType: "software",
      position: 3,
      pros: [
        "BigQuery — the best serverless, petabyte-scale data warehouse with no cluster management",
        "Vertex AI + TPU v4/v5 — the strongest hardware story for training large models from scratch",
        "GKE is the most mature managed Kubernetes; Google invented and open-sourced Kubernetes",
        "Sustained Use Discounts auto-apply (25%+ monthly usage) with no commitment required",
        "Lowest egress in the draft ($0.08/GB) and historically lower baseline compute pricing",
      ],
      cons: [
        "Smallest market share (~12%) and the narrowest service catalog (150+ vs 200+)",
        "Smaller ecosystem, hiring pool and SaaS-integration default than AWS or Azure",
        "Weaker Microsoft-stack and Windows enterprise integration than Azure",
        "Fewer global regions than Azure (40+ vs 60+)",
      ],
      bestFor: "Best for data, AI/ML & Kubernetes",
    },
  ],
  // Top 3 differences — the draft's load-bearing decision trio. N-entity values[]
  // are position-indexed to entities[]. Not rendered by MultiEntityLayout v1 but
  // persisted for completeness and future layout use.
  keyDifferences: [
    {
      label: "Service breadth & ecosystem",
      entityAValue: "200+ services; largest ecosystem, hiring pool & tutorials",
      entityBValue: "200+ services; strongest in the Microsoft enterprise stack",
      values: [
        "200+ services; largest ecosystem, hiring pool & tutorials",
        "200+ services; strongest in the Microsoft enterprise stack",
        "150+ services; narrower catalog, deepest on data & AI/ML",
      ],
      winnerIndex: 0,
    },
    {
      label: "Microsoft / enterprise & hybrid integration",
      entityAValue: "AWS Outposts for hybrid; no native Microsoft stack tie-in",
      entityBValue: "Active Directory, Office 365, .NET + Azure Arc/Stack hybrid",
      values: [
        "AWS Outposts for hybrid; no native Microsoft stack tie-in",
        "Active Directory, Office 365, .NET + Azure Arc/Stack hybrid",
        "Anthos for hybrid; weakest Microsoft-stack integration",
      ],
      winnerIndex: 1,
    },
    {
      label: "Data, AI/ML & Kubernetes",
      entityAValue: "Redshift / SageMaker / EKS — mature but more tuning overhead",
      entityBValue: "Synapse / Azure ML / AKS — strong via Azure OpenAI",
      values: [
        "Redshift / SageMaker / EKS — mature but more tuning overhead",
        "Synapse / Azure ML / AKS — strong via Azure OpenAI",
        "BigQuery / Vertex AI + TPUs / GKE — best-in-class on all three",
      ],
      winnerIndex: 2,
    },
  ],
  // ~21 attributes — the draft's service-comparison + pricing-entry tables, one
  // value per entity in entity order (AWS, Azure, GCP).
  attributes: [
    textAttr("market-share", "Global market share (2026 est.)", "Market & footprint", "~32%", "~23%", "~12%"),
    textAttr("regions-az", "Regions / availability zones", "Market & footprint", "34 regions / 108 AZs", "60+ regions", "40+ regions"),
    textAttr("core-compute", "Core compute", "Core services", "EC2 (100+ instance types)", "Virtual Machines", "Compute Engine"),
    textAttr("managed-kubernetes", "Managed Kubernetes", "Core services", "EKS", "AKS", "GKE (invented Kubernetes)"),
    textAttr("serverless", "Serverless compute", "Core services", "Lambda", "Azure Functions", "Cloud Functions / Cloud Run"),
    textAttr("managed-databases", "Managed databases (relational)", "Core services", "RDS / Aurora", "Azure SQL / Cosmos DB", "Cloud SQL / AlloyDB"),
    textAttr("data-warehouse", "Data warehouse", "Data & AI", "Redshift", "Synapse Analytics", "BigQuery"),
    textAttr("object-storage", "Object storage", "Core services", "S3", "Azure Blob Storage", "Cloud Storage"),
    textAttr("cdn-edge", "CDN / edge", "Core services", "CloudFront", "Azure Front Door", "Cloud CDN"),
    textAttr("identity-iam", "Identity / IAM", "Core services", "IAM + Cognito", "Azure Active Directory", "Cloud IAM"),
    textAttr("aiml-platform", "AI/ML platform", "Data & AI", "SageMaker", "Azure Machine Learning", "Vertex AI"),
    textAttr("ml-accelerators", "ML accelerators (custom chips)", "Data & AI", "Graviton (ARM CPU), Inferentia", "—", "TPU v4/v5"),
    textAttr("networking-vpc", "Networking (VPC)", "Core services", "VPC", "Virtual Network", "VPC"),
    textAttr("hybrid-cloud", "Hybrid cloud", "Platform", "AWS Outposts", "Azure Arc / Stack", "Anthos"),
    textAttr("devops-cicd", "DevOps / CI-CD", "Platform", "CodePipeline / CodeBuild", "Azure DevOps", "Cloud Build"),
    textAttr("service-catalog-size", "Service catalog size", "Platform", "200+", "200+", "150+"),
    textAttr("free-tier", "Free tier", "Pricing", "Yes (12 months + always-free)", "Yes ($200 credit / 30 days + 12 months)", "Yes (generous always-free tier)"),
    textAttr("enterprise-discount", "Enterprise discount model", "Pricing", "Reserved instances / Savings Plans", "Reserved + Azure Hybrid Benefit", "Committed Use Discounts (auto-apply)"),
    textAttr("compute-price", "General-purpose VM (4 vCPU / 16 GB, on-demand)", "Pricing", "~$0.192/hr (t3.xlarge)", "~$0.201/hr (D4s v5)", "~$0.190/hr (n2-standard-4)"),
    textAttr("sustained-discount", "Sustained-use auto-discount (no commit)", "Pricing", "No", "No", "Yes (25%+ usage/month)"),
    textAttr("egress-price", "Egress (per GB, first tier)", "Pricing", "$0.09", "$0.087", "$0.08"),
  ],
  // 7 FAQs verbatim from draft v1 → FAQPage schema.
  faqs: [
    {
      question: "Which cloud is best for most companies in 2026?",
      answer:
        "AWS is the safest default for organizations without a strong existing cloud preference — it has the broadest service catalog, the largest hiring pool, and the most ecosystem integrations. Azure is better for Microsoft-heavy enterprises. GCP is better for data-intensive and AI/ML-first organizations.",
    },
    {
      question: "Is AWS still the leader in cloud in 2026?",
      answer:
        "Yes — AWS holds approximately 32% of the global cloud market, ahead of Azure (~23%) and GCP (~12%). However, Azure has been closing the gap, particularly in enterprise accounts, and GCP has grown its AI/ML workload share significantly with Vertex AI and TPU availability.",
    },
    {
      question: "Is Google Cloud cheaper than AWS?",
      answer:
        "GCP is often competitive on compute pricing, and its Sustained Use Discounts (automatic, no commitment) can make it meaningfully cheaper than AWS on-demand for workloads that run continuously. However, pricing depends heavily on specific services, regions, and egress patterns. Use each provider's calculator for your actual workload.",
    },
    {
      question: "Why do enterprises often choose Azure over AWS?",
      answer:
        "Azure's deep integration with Microsoft's enterprise stack (Active Directory, Office 365, Visual Studio, SQL Server) reduces identity complexity, licensing costs (Azure Hybrid Benefit), and operational friction for organizations already standardized on Microsoft products. Azure DevOps and GitHub Enterprise's tight Azure integration also matter for development teams.",
    },
    {
      question: "Is GCP better for Kubernetes than AWS?",
      answer:
        "Generally yes — GKE (Google Kubernetes Engine) is widely considered the most mature managed Kubernetes service, in part because Google invented Kubernetes and has operated it at the largest scale. AWS EKS and Azure AKS are capable alternatives, but GKE's operational defaults and upgrade automation are slightly ahead.",
    },
    {
      question: "Can I use all three clouds at once (multi-cloud)?",
      answer:
        "Yes — many large enterprises run workloads across two or all three providers. Common patterns: AWS for primary workloads + GCP for BigQuery analytics; AWS for application infrastructure + Azure for Microsoft identity federation. Tools like Terraform, Pulumi, and Kubernetes abstract provider-specific differences. Note that egress costs (data transfer out of a provider) are a significant multi-cloud expense to model carefully.",
    },
    {
      question: "Which cloud has the best free tier?",
      answer:
        "All three have generous free tiers. GCP's always-free tier is broad (f1-micro VM, 5 GB storage, BigQuery 10 GB/mo). AWS's 12-month free tier is comprehensive for getting started. Azure's free tier includes $200 credit for 30 days plus 12 months of popular services. For experimentation and learning, all three are comparable — GCP's always-free tier has the longest lasting limits.",
    },
  ],
  relatedComparisons: [
    { slug: "aws-vs-azure", title: "AWS vs Azure", category: "technology" },
    { slug: "aws-vs-google-cloud", title: "AWS vs Google Cloud", category: "technology" },
    { slug: "azure-vs-google-cloud", title: "Azure vs Google Cloud", category: "technology" },
  ],
  relatedBlogPosts: [
    {
      slug: "best-cloud-platforms-2026",
      title: "Best Cloud Platforms 2026: 8 Top Providers Compared",
      excerpt:
        "We compare AWS, Azure, GCP and 5 more cloud providers on pricing, free tiers, services and use cases — and map common use cases to a specific pick.",
      category: "technology",
    },
  ],
  metadata: {
    metaTitle: "AWS vs Azure vs GCP: Which Cloud Wins in 2026?",
    metaDescription:
      "AWS vs Azure vs Google Cloud compared — service breadth, Kubernetes, BigQuery, AI/ML, hybrid cloud, free tiers, and pricing. Find the best cloud for your workload in 2026.",
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
// nodes, ItemList container). OMITS Offer nodes (DAN-841 cloud-cluster row):
// the clouds are usage-priced with free tiers only, so no fixed-price product.
// ---------------------------------------------------------------------------
const URL = `${SITE}/compare/${SLUG}`;
const ITEM_LIST_ID = `${URL}#comparison`;
const ITEM_A = `${URL}#item-a`; // AWS
const ITEM_B = `${URL}#item-b`; // Azure
const ITEM_C = `${URL}#item-c`; // GCP

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
        description: "Comparison between AWS, Microsoft Azure, Google Cloud (GCP)",
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
        name: "AWS",
        url: `${SITE}/entity/aws`,
        description: comparison.entities[0].shortDesc,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        publisher: { "@type": "Organization", name: "Amazon Web Services" },
        // No `offers` — usage-priced; free tier only (DAN-841 cloud-cluster).
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_B,
        name: "Microsoft Azure",
        url: `${SITE}/entity/azure`,
        description: comparison.entities[1].shortDesc,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        publisher: { "@type": "Organization", name: "Microsoft" },
        // No `offers` — usage-priced; free tier only (DAN-841 cloud-cluster).
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_C,
        name: "Google Cloud (GCP)",
        url: `${SITE}/entity/gcp`,
        description: comparison.entities[2].shortDesc,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        publisher: { "@type": "Organization", name: "Google" },
        // No `offers` — usage-priced; free tier only (DAN-841 cloud-cluster).
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
    `Schema markup stored (SoftwareApplication ×3 + ItemList + FAQPage + BreadcrumbList, no Offer). ` +
      `datePublished=${frozenDatePublished} dateModified=${DATE_MODIFIED}`,
  );
  console.log(`Live URL (after ISR): ${URL}`);
}

main().catch((err) => {
  console.error("Publish error:", err);
  process.exit(1);
});
