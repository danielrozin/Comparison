/**
 * Seed script: P1 Tier 1 Affiliate Links
 *
 * Inserts program-specific affiliate tracking links for the 16 highest-value
 * comparison pages. Replace all TODO_* placeholders with real tracking URLs
 * once DAN-272 (affiliate network signups) is resolved.
 *
 * Run:
 *   npx tsx scripts/seed-p1-affiliate-links.ts
 *
 * Networks required (DAN-272):
 *   - Impact       → Notion, Canva, BigCommerce, Webflow
 *   - CJ Affiliate → Verizon, Nike, Microsoft Store
 *   - ShareASale   → (phase 2)
 *   - B&H Photo    → Direct program (bhphotovideo.com/affiliates)
 *   - NordVPN      → Direct (nordvpn.com/affiliates)
 *   - Surfshark    → Direct (surfshark.com/affiliates)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Tracking URL placeholders ─────────────────────────────────────────────
// Replace each TODO_* with your real tracking URL from the network dashboard.
// Format: full URL including all tracking parameters.

const NOTION_AFFILIATE_URL =
  "TODO_NOTION_IMPACT_URL"; // e.g. https://notion.grsm.io/xxxxxx
const CANVA_AFFILIATE_URL =
  "TODO_CANVA_IMPACT_URL"; // via Impact, e.g. https://partner.canva.com/c/xxxxxx/...
const BIGCOMMERCE_AFFILIATE_URL =
  "TODO_BIGCOMMERCE_IMPACT_URL"; // 200% first payment
const WEBFLOW_AFFILIATE_URL =
  "TODO_WEBFLOW_IMPACT_URL"; // 50% first year
const MICROSOFT_STORE_AFFILIATE_URL =
  "TODO_MICROSOFT_CJ_URL"; // via CJ Affiliate
const BH_PHOTO_AFFILIATE_BASE =
  "TODO_BH_PHOTO_BASE_URL"; // e.g. https://www.bhphotovideo.com/c/affiliate/...
const VERIZON_AFFILIATE_URL =
  "TODO_VERIZON_CJ_URL"; // $24–60 CPA via CJ
const NORDVPN_AFFILIATE_URL =
  "TODO_NORDVPN_DIRECT_URL"; // 40% commission
const SURFSHARK_AFFILIATE_URL =
  "TODO_SURFSHARK_DIRECT_URL"; // 40% commission
const NIKE_AFFILIATE_URL =
  "TODO_NIKE_CJ_URL"; // 11% via CJ

// ─── P1 Tier 1 entity slug → affiliate link mapping ───────────────────────

interface AffiliateLinkEntry {
  entitySlug: string;
  partner: string;
  url: string;
  label: string;
  priority: number;
  metadata?: Record<string, string>;
}

const P1_AFFILIATE_LINKS: AffiliateLinkEntry[] = [
  // ── SaaS: notion-vs-obsidian ──────────────────────────────────────────
  {
    entitySlug: "notion",
    partner: "notion",
    url: NOTION_AFFILIATE_URL,
    label: "Try Notion Free",
    priority: 100,
    metadata: { commission: "50% first 12mo recurring", network: "direct" },
  },
  // Obsidian has no affiliate program — keep Amazon/generic fallback

  // ── SaaS: slack-vs-microsoft-teams ───────────────────────────────────
  {
    entitySlug: "microsoft-teams",
    partner: "microsoft",
    url: MICROSOFT_STORE_AFFILIATE_URL,
    label: "Get Microsoft 365",
    priority: 100,
    metadata: { commission: "10%", network: "cj" },
  },

  // ── SaaS: canva-vs-photoshop ──────────────────────────────────────────
  {
    entitySlug: "canva",
    partner: "canva",
    url: CANVA_AFFILIATE_URL,
    label: "Try Canva Pro",
    priority: 100,
    metadata: { commission: "$36/sub", network: "impact" },
  },

  // ── SaaS: shopify-vs-woocommerce ──────────────────────────────────────
  // BigCommerce as "better alternative" CTA (200% first payment)
  {
    entitySlug: "shopify",
    partner: "bigcommerce",
    url: BIGCOMMERCE_AFFILIATE_URL,
    label: "Try BigCommerce",
    priority: 90,
    metadata: {
      commission: "200% first payment",
      network: "impact",
      note: "alternative CTA",
    },
  },
  {
    entitySlug: "woocommerce",
    partner: "bigcommerce",
    url: BIGCOMMERCE_AFFILIATE_URL,
    label: "Try BigCommerce",
    priority: 90,
    metadata: { commission: "200% first payment", network: "impact" },
  },

  // ── SaaS: wordpress-vs-wix ────────────────────────────────────────────
  {
    entitySlug: "wordpress",
    partner: "webflow",
    url: WEBFLOW_AFFILIATE_URL,
    label: "Try Webflow",
    priority: 80,
    metadata: {
      commission: "50% first year",
      network: "impact",
      note: "alternative CTA",
    },
  },
  {
    entitySlug: "wix",
    partner: "webflow",
    url: WEBFLOW_AFFILIATE_URL,
    label: "Try Webflow",
    priority: 80,
    metadata: { commission: "50% first year", network: "impact" },
  },

  // ── SaaS: figma-vs-sketch ─────────────────────────────────────────────
  {
    entitySlug: "figma",
    partner: "canva",
    url: CANVA_AFFILIATE_URL,
    label: "Try Canva (Free Design Tool)",
    priority: 80,
    metadata: { commission: "$36/sub", network: "impact", note: "alternative CTA" },
  },

  // ── Electronics: iphone-17-vs-samsung-s26 ────────────────────────────
  {
    entitySlug: "iphone-17",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Buy at B&H Photo",
    priority: 100,
    metadata: { commission: "8%", network: "direct" },
  },
  {
    entitySlug: "iphone-17",
    partner: "verizon",
    url: VERIZON_AFFILIATE_URL,
    label: "Get on Verizon",
    priority: 90,
    metadata: { commission: "$24–60 CPA", network: "cj" },
  },
  {
    entitySlug: "samsung-galaxy-s26",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Buy at B&H Photo",
    priority: 100,
    metadata: { commission: "8%", network: "direct" },
  },
  {
    entitySlug: "samsung-galaxy-s26",
    partner: "verizon",
    url: VERIZON_AFFILIATE_URL,
    label: "Get on Verizon",
    priority: 90,
    metadata: { commission: "$24–60 CPA", network: "cj" },
  },

  // ── Electronics: iphone-16-pro-vs-iphone-16-pro-max ──────────────────
  {
    entitySlug: "iphone-16-pro",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Buy at B&H Photo",
    priority: 100,
    metadata: { commission: "8%", network: "direct" },
  },
  {
    entitySlug: "iphone-16-pro-max",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Buy at B&H Photo",
    priority: 100,
    metadata: { commission: "8%", network: "direct" },
  },

  // ── Electronics: samsung-s25-vs-s25-ultra ────────────────────────────
  {
    entitySlug: "samsung-galaxy-s25",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Buy at B&H Photo",
    priority: 100,
    metadata: { commission: "8%", network: "direct" },
  },
  {
    entitySlug: "samsung-galaxy-s25-ultra",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Buy at B&H Photo",
    priority: 100,
    metadata: { commission: "8%", network: "direct" },
  },

  // ── Electronics: airpods-pro-vs-galaxy-buds ──────────────────────────
  {
    entitySlug: "airpods-pro",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Buy at B&H Photo",
    priority: 100,
    metadata: { commission: "8%", network: "direct" },
  },
  {
    entitySlug: "samsung-galaxy-buds",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Buy at B&H Photo",
    priority: 100,
    metadata: { commission: "8%", network: "direct" },
  },

  // ── Electronics: apple-vs-samsung ────────────────────────────────────
  {
    entitySlug: "apple",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Shop Apple at B&H",
    priority: 100,
    metadata: { commission: "8%", network: "direct" },
  },
  {
    entitySlug: "samsung",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Shop Samsung at B&H",
    priority: 100,
    metadata: { commission: "8%", network: "direct" },
  },

  // ── Electronics: oura-ring-vs-whoop ──────────────────────────────────
  {
    entitySlug: "oura-ring",
    partner: "bhphotovideo",
    url: BH_PHOTO_AFFILIATE_BASE,
    label: "Buy Oura Ring at B&H",
    priority: 100,
    metadata: { commission: "5–8%", network: "direct" },
  },

  // ── VPN: nordvpn-vs-surfshark (also covered by DAN-275) ───────────────
  {
    entitySlug: "nordvpn",
    partner: "nordvpn",
    url: NORDVPN_AFFILIATE_URL,
    label: "Get NordVPN (40% off)",
    priority: 100,
    metadata: { commission: "40%", network: "direct" },
  },
  {
    entitySlug: "surfshark",
    partner: "surfshark",
    url: SURFSHARK_AFFILIATE_URL,
    label: "Get Surfshark",
    priority: 100,
    metadata: { commission: "40%", network: "direct" },
  },

  // ── Sports: nike-vs-adidas ────────────────────────────────────────────
  {
    entitySlug: "nike",
    partner: "nike",
    url: NIKE_AFFILIATE_URL,
    label: "Shop Nike",
    priority: 100,
    metadata: { commission: "11%", network: "cj" },
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const todoUrls = P1_AFFILIATE_LINKS.filter((l) =>
    l.url.startsWith("TODO_"),
  );

  if (todoUrls.length > 0) {
    console.warn(
      `\n⚠️  ${todoUrls.length} affiliate links still have placeholder URLs (TODO_*).\n` +
      `   Complete DAN-272 (network signups) and fill in the tracking URLs before running.\n`,
    );
    console.warn("Pending:\n" + todoUrls.map((l) => `  - ${l.entitySlug} / ${l.partner}: ${l.url}`).join("\n"));
    console.warn("\nExiting — no changes made.\n");
    process.exit(1);
  }

  console.log(`\nSeeding ${P1_AFFILIATE_LINKS.length} P1 affiliate links...\n`);

  let upserted = 0;
  let skipped = 0;

  for (const entry of P1_AFFILIATE_LINKS) {
    const entity = await prisma.entity.findFirst({
      where: { slug: entry.entitySlug },
      select: { id: true, name: true },
    });

    if (!entity) {
      console.warn(`  ⚠ Entity not found: ${entry.entitySlug} — skipping`);
      skipped++;
      continue;
    }

    await prisma.affiliateLink.upsert({
      where: {
        entityId_partner: {
          entityId: entity.id,
          partner: entry.partner,
        },
      },
      create: {
        entityId: entity.id,
        partner: entry.partner,
        url: entry.url,
        label: entry.label,
        priority: entry.priority,
        isActive: true,
        source: "manual",
        metadata: entry.metadata as object,
      },
      update: {
        url: entry.url,
        label: entry.label,
        priority: entry.priority,
        isActive: true,
        source: "manual",
        metadata: entry.metadata as object,
      },
    });

    console.log(`  ✓ ${entity.name} (${entry.partner}) → ${entry.url.slice(0, 60)}...`);
    upserted++;
  }

  console.log(`\nDone: ${upserted} upserted, ${skipped} skipped.\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
