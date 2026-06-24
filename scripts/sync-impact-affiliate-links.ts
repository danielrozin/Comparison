/**
 * Sync Impact.com affiliate tracking links → affiliate_links table.
 *
 * Unlike scripts/seed-p1-affiliate-links.ts (which needs hand-pasted TODO_*
 * URLs), this script pulls the *live* tracking link for every program we have
 * actually joined on Impact and upserts it against the matching entity. The
 * moment the board joins a new advertiser in the Impact dashboard, one run of
 * this script makes the link live — no code edit required.
 *
 * Auth (board-provided Impact API key, DAN-276):
 *   IMPACT_ACCOUNT_SID   Mediapartner Account SID  (e.g. IRPrmsrTa7J8675...)
 *   IMPACT_AUTH_TOKEN    Auth token
 *
 * Run (dry-run, prints what WOULD change, writes nothing):
 *   IMPACT_ACCOUNT_SID=... IMPACT_AUTH_TOKEN=... npx tsx scripts/sync-impact-affiliate-links.ts
 *
 * Apply (writes to the DB pointed at by DATABASE_URL):
 *   ... npx tsx scripts/sync-impact-affiliate-links.ts --apply
 *
 * The script is read-only against Impact and only ever touches affiliate_links
 * rows whose partner === "impact" and source === "impact_api", so it can be
 * re-run safely and will not clobber hand-curated direct/CJ links.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const APPLY = process.argv.includes("--apply");

const SID = process.env.IMPACT_ACCOUNT_SID || "";
const TOKEN = process.env.IMPACT_AUTH_TOKEN || "";

// ─── Advertiser → our entity slugs ──────────────────────────────────────────
// Impact AdvertiserName (lower-cased, trimmed) → the entity slug(s) the link
// should attach to. One advertiser can monetise several pages (e.g. Canva is
// the "better alternative" CTA on both canva-vs-photoshop and figma-vs-sketch).
// Adding a row here is harmless if that advertiser isn't joined yet — the
// script only acts on programs Impact actually reports as Active.
interface SlugTarget {
  entitySlug: string;
  label: string;
  priority: number;
  /** Optional deeplink path appended to the tracking link (Impact `u` param). */
  deeplinkUrl?: string;
  note?: string;
}

const ADVERTISER_MAP: Record<string, SlugTarget[]> = {
  notion: [
    { entitySlug: "notion", label: "Try Notion Free", priority: 100, note: "50% first 12mo recurring" },
  ],
  canva: [
    { entitySlug: "canva", label: "Try Canva Pro", priority: 100, note: "$36/sub" },
    { entitySlug: "figma", label: "Try Canva (Free Design Tool)", priority: 80, note: "alternative CTA" },
  ],
  bigcommerce: [
    { entitySlug: "shopify", label: "Try BigCommerce", priority: 90, note: "200% first payment / alternative CTA" },
    { entitySlug: "woocommerce", label: "Try BigCommerce", priority: 90, note: "200% first payment" },
  ],
  webflow: [
    { entitySlug: "wordpress", label: "Try Webflow", priority: 80, note: "50% first year / alternative CTA" },
    { entitySlug: "wix", label: "Try Webflow", priority: 80, note: "50% first year" },
  ],
  // Microsoft 365 / Microsoft Store can appear under a few advertiser names.
  microsoft: [
    { entitySlug: "microsoft-teams", label: "Get Microsoft 365", priority: 100, note: "10%" },
  ],
  "microsoft 365": [
    { entitySlug: "microsoft-teams", label: "Get Microsoft 365", priority: 100, note: "10%" },
  ],
  // Currently the only joined program (DAN-276). No invideo page exists yet —
  // the script will report this as "joined but no entity" so we know to either
  // create an InVideo comparison page or remove the mapping.
  invideo: [
    { entitySlug: "invideo", label: "Try InVideo AI", priority: 100, note: "AI video generator" },
  ],
};

interface ImpactCampaign {
  AdvertiserName?: string;
  CampaignId?: string;
  CampaignName?: string;
  ContractStatus?: string;
  TrackingLink?: string;
  AllowsDeeplinking?: boolean | string;
}

async function fetchJoinedCampaigns(): Promise<ImpactCampaign[]> {
  if (!SID || !TOKEN) {
    throw new Error(
      "Missing IMPACT_ACCOUNT_SID / IMPACT_AUTH_TOKEN env vars. " +
        "Get them from the Impact dashboard (board-provided, see DAN-276).",
    );
  }
  const auth = Buffer.from(`${SID}:${TOKEN}`).toString("base64");
  const res = await fetch(
    `https://api.impact.com/Mediapartners/${SID}/Campaigns?PageSize=200`,
    { headers: { Accept: "application/json", Authorization: `Basic ${auth}` } },
  );
  if (!res.ok) {
    throw new Error(`Impact Campaigns API returned ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as { Campaigns?: ImpactCampaign[] };
  return data.Campaigns ?? [];
}

/** Build the final tracking URL, applying an Impact deeplink if configured. */
function buildUrl(trackingLink: string, target: SlugTarget, allowsDeeplink: boolean): string {
  if (target.deeplinkUrl && allowsDeeplink) {
    const sep = trackingLink.includes("?") ? "&" : "?";
    return `${trackingLink}${sep}u=${encodeURIComponent(target.deeplinkUrl)}`;
  }
  return trackingLink;
}

async function main() {
  console.log(`\nImpact affiliate sync — mode: ${APPLY ? "APPLY (writes)" : "DRY-RUN"}\n`);

  const campaigns = await fetchJoinedCampaigns();
  const active = campaigns.filter(
    (c) => String(c.ContractStatus ?? "").toLowerCase() === "active",
  );
  console.log(`Impact reports ${campaigns.length} campaign(s), ${active.length} Active.\n`);

  let upserted = 0;
  const unmapped: string[] = [];
  const missingEntities: string[] = [];

  for (const c of active) {
    const advKey = String(c.AdvertiserName ?? "").trim().toLowerCase();
    const targets = ADVERTISER_MAP[advKey];
    const tracking = c.TrackingLink;

    if (!tracking) {
      console.warn(`  ⚠ ${c.AdvertiserName}: Active but no TrackingLink returned — skipping`);
      continue;
    }
    if (!targets) {
      unmapped.push(`${c.AdvertiserName} (campaign ${c.CampaignId}) → ${tracking}`);
      continue;
    }

    const allowsDeeplink = c.AllowsDeeplinking === true || c.AllowsDeeplinking === "true";

    for (const t of targets) {
      const entity = await prisma.entity.findFirst({
        where: { slug: t.entitySlug },
        select: { id: true, name: true },
      });
      if (!entity) {
        missingEntities.push(`${t.entitySlug} (${c.AdvertiserName})`);
        continue;
      }

      const url = buildUrl(tracking, t, allowsDeeplink);
      console.log(`  ${APPLY ? "✓" : "·"} ${entity.name} ← ${c.AdvertiserName}: ${url.slice(0, 70)}`);

      if (APPLY) {
        await prisma.affiliateLink.upsert({
          where: { entityId_partner: { entityId: entity.id, partner: "impact" } },
          create: {
            entityId: entity.id,
            partner: "impact",
            url,
            label: t.label,
            priority: t.priority,
            isActive: true,
            source: "impact_api",
            lastValidatedAt: new Date(),
            metadata: {
              advertiserName: c.AdvertiserName,
              campaignId: c.CampaignId,
              note: t.note,
            } as object,
          },
          update: {
            url,
            label: t.label,
            priority: t.priority,
            isActive: true,
            source: "impact_api",
            lastValidatedAt: new Date(),
            metadata: {
              advertiserName: c.AdvertiserName,
              campaignId: c.CampaignId,
              note: t.note,
            } as object,
          },
        });
      }
      upserted++;
    }
  }

  console.log(`\n${APPLY ? "Upserted" : "Would upsert"}: ${upserted} link(s).`);

  if (unmapped.length) {
    console.log(
      `\nℹ ${unmapped.length} Active program(s) joined on Impact but not in ADVERTISER_MAP ` +
        `(add a mapping or create a page to monetise):\n` +
        unmapped.map((u) => `  - ${u}`).join("\n"),
    );
  }
  if (missingEntities.length) {
    console.log(
      `\n⚠ ${missingEntities.length} mapped target(s) have no matching entity in this DB ` +
        `(page may not exist yet, or slug drift — verify on prod):\n` +
        missingEntities.map((m) => `  - ${m}`).join("\n"),
    );
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
