/**
 * Config for /best/[slug] long-form roundup pages — the right rail for
 * "Best X" content that doesn't fit the thin CML /hub/[slug] shape and
 * shouldn't be wedged into /blog/[slug] either.
 *
 * Shape decision lives in DAN-828; first entry (cloud-platforms-2026) carries
 * the rev-3 body from DAN-426 that shipped interim Path A on /blog. 301
 * redirect from the old /blog/best-cloud-platforms-2026 URL is wired in
 * next.config.ts via BLOG_REDIRECTS.
 */

import { CLOUD_PLATFORMS_2026_BODY } from "./best/cloud-platforms-2026";

export type BestFaq = { q: string; a: string };

export type BestListItem = {
  position: number;
  name: string;
  /** In-page anchor — appended after `#` for ItemList JSON-LD URLs. */
  anchor: string;
};

export type BestEntry = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  /** Short excerpt for OG / hero subtitle. */
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  author: { name: string; url?: string };
  /** Long-form markdown body. Headings may carry `{#anchor}` for explicit ids. */
  bodyMarkdown: string;
  itemList?: {
    name: string;
    description?: string;
    items: BestListItem[];
  };
  faqs?: BestFaq[];
  relatedComparisonSlugs?: string[];
};

export const BEST_CONFIG: Record<string, BestEntry> = {
  "cloud-platforms-2026": {
    slug: "cloud-platforms-2026",
    title: "Best Cloud Platforms 2026: 8 Top Providers Compared",
    description:
      "Compare the 8 best cloud platforms of 2026 — pricing, free tiers, services, and use cases. AWS, Azure, GCP, Oracle, IBM, DigitalOcean, Linode, Vultr ranked, with a real $240/mo workload priced across the big three.",
    h1: "Best Cloud Platforms 2026: 8 Top Providers Compared",
    excerpt:
      "The 8 clouds you should actually evaluate in 2026 — what they're best at, what they cost, and which workloads send your bill in the wrong direction. Pricing re-verified against published rate sheets the day before publish.",
    publishedAt: "2026-05-13T00:00:00.000Z",
    updatedAt: "2026-05-28T00:00:00.000Z",
    author: {
      name: "Daniel Rozin",
      url: "https://aversusb.net/authors/daniel-rozin",
    },
    bodyMarkdown: CLOUD_PLATFORMS_2026_BODY,
    itemList: {
      name: "Best Cloud Platforms 2026: 8 Top Providers Compared",
      description:
        "Compare the 8 best cloud platforms of 2026 — pricing, free tiers, services, and use cases. AWS, Azure, GCP, Oracle, IBM, DigitalOcean, Linode, Vultr ranked.",
      items: [
        { position: 1, name: "Amazon Web Services (AWS)", anchor: "aws" },
        { position: 2, name: "Microsoft Azure", anchor: "azure" },
        { position: 3, name: "Google Cloud (GCP)", anchor: "gcp" },
        { position: 4, name: "Oracle Cloud Infrastructure (OCI)", anchor: "oci" },
        { position: 5, name: "IBM Cloud", anchor: "ibm" },
        { position: 6, name: "DigitalOcean", anchor: "digitalocean" },
        { position: 7, name: "Linode (Akamai Cloud)", anchor: "linode" },
        { position: 8, name: "Vultr", anchor: "vultr" },
      ],
    },
    faqs: [
      {
        q: "Which cloud platform is best in 2026?",
        a: "There is no single best — there is the best one for your workload and your team. AWS still has the broadest service catalog and the deepest talent pool. Azure wins for Microsoft-shop enterprises and exclusive enterprise OpenAI access. GCP wins for data, ML, and managed Kubernetes. The §4 decision guide above maps the six most common use cases to a specific pick.",
      },
      {
        q: "Is AWS, Azure, or Google Cloud cheapest?",
        a: "It depends on the workload — for a standard 4 vCPU / 16 GB / 1 TB-egress on-demand workload, all three hyperscalers cluster within roughly 20% of each other (see the §5 pricing table: AWS $231.86, Azure $233.82, GCP $278.77). Where each wins: GCP's sustained-use discounts auto-apply with no commit; AWS Savings Plans cut ~30% on a one-year commit; Azure Hybrid Benefit cuts the bill if you bring existing Windows Server or SQL Server licenses.",
      },
      {
        q: "Which cloud is easiest to learn?",
        a: "DigitalOcean and Linode are the easiest by a wide margin — clear portal, plain-English docs, predictable bills. Among hyperscalers, Google Cloud has the cleanest IAM model and the most readable pricing pages. AWS is the most powerful but the steepest learning curve, especially around IAM and networking.",
      },
      {
        q: "Is Oracle Cloud actually free forever?",
        a: "Yes — Oracle's always-free tier gives you two Ampere A1 ARM VMs with 4 OCPU and 24 GB RAM combined, 200 GB block storage, and 10 TB monthly egress, with no time limit. The catch: Ampere capacity is region-locked and has been intermittently constrained at peak demand.",
      },
      {
        q: "What's the best AWS alternative?",
        a: "Depends what you're trying to alternate. For multi-cloud risk mitigation: Microsoft Azure or Google Cloud. For predictable bills on simpler workloads: DigitalOcean or Linode. For Oracle Database workloads: OCI is meaningfully cheaper than rehosting on AWS RDS for Oracle. For on-demand GPU access: Vultr.",
      },
      {
        q: "Which cloud has the best free tier?",
        a: "Oracle Cloud's two-VM always-free allowance is the most generous in the industry. Runners-up: GCP ($300 credit for 90 days plus always-free e2-micro), Azure (12 months on 25+ services plus 55 always-free), and AWS (12-month tier plus always-free overlay including 1M Lambda requests / month and 25 GB of DynamoDB).",
      },
      {
        q: "Should I use a hyperscaler or DigitalOcean for a startup?",
        a: "DigitalOcean if you're early-stage, your stack is mainstream, and you want the bill to match the budget. Hyperscaler — usually GCP or AWS — once you need niche managed services, edge presence in unusual regions, or compliance certifications your customers ask for. Most startups stay on DO longer than they expect to.",
      },
      {
        q: "Which cloud is best for AI and machine learning in 2026?",
        a: "Google Cloud, with TPU v5p and Vertex AI's end-to-end MLOps story, is the strongest pick for serious model training. AWS (SageMaker plus Bedrock with Anthropic / Meta / Cohere model access) is the runner-up, particularly for inference-heavy production workloads. Microsoft Azure earns an honorable mention for one specific reason: enterprise-scale Azure OpenAI access — GPT-class models with Azure SLA, regional deployment, and customer-managed keys — is the defensible 2026 differentiator competitors won't match.",
      },
    ],
    relatedComparisonSlugs: ["aws-vs-azure", "aws-vs-google-cloud"],
  },
};
