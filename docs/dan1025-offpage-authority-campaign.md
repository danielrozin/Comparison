# DAN-1025 — Off-Page Authority: Backlink + Digital-PR Campaign

**Owner:** Link Building Specialist agent
**Parent:** DAN-17 (master growth plan, Lever 1)
**Started:** 2026-06-12
**Goal:** Grow referring domains so our 1,600+ indexed pages can break onto page 1.
Baseline problem (2026-06-12 `ranked_keywords`): 0 keywords in top 10, 3 on page 2,
171 parked in positions 21–50. The binding constraint is domain authority / referring domains.

---

## Lever 1 — Linkable Assets (earned-link bait)

### ✅ Study #1 — "The Most-Compared Brands of 2026" (SHIPPED 2026-06-12)

- **Live URL:** https://www.aversusb.net/studies/most-compared-brands-2026
- **Hub:** https://www.aversusb.net/studies
- **What it is:** A data study built live from our DB (1,642 published comparisons,
  ~900 distinct entities). Ranks the most-compared brands, the most-compared B2B SaaS
  tools, the biggest matchups by readership, and the category breakdown.
- **Why it earns links:** original, quotable, number-driven; ships with `Dataset` +
  `Article` JSON-LD (eligible for rich results / AI-overview citation) and a
  "Cite or republish this study" box with a ready-made citation + link snippet.
- **Internal linking:** footer "Data Studies" entry + sitemap (priority 0.8); links out
  to entity, category, compare, partnerships and trending pages.
- **Implementation:** `src/lib/services/studies-service.ts` (live query + baked-in
  snapshot fallback so the page is never empty for crawlers), `src/app/studies/*`.

**Headline numbers (snapshot 2026-06-12):**
- Most-compared brand: **Xbox Series X** (31 matchups), PS5 (24), Netflix (16), HubSpot (16).
- Most-compared SaaS: **HubSpot** (16), Notion (14), Mailchimp (12), ClickUp/Asana/Squarespace/Spotify (11).
- Biggest matchup by readership: **iPhone 17 vs Samsung Galaxy S26** (2.1M reads).
- Demand clusters in consumer products (404), software (384), technology (147).

### ✅ Study #2 — "The B2B SaaS Comparison Report 2026" (SHIPPED 2026-06-12, DAN-1032)

- **Live URL:** https://www.aversusb.net/studies/b2b-saas-comparison-report-2026
- **What it is:** A per-vertical cut of the software category — our deepest dataset
  (384 published software comparisons across 282 distinct SaaS tools). Same
  `studies-service` + `/studies/[slug]` pattern as Study #1, vertical-scoped.
- **Cuts:** most-compared B2B SaaS tools (programming languages/frameworks excluded);
  category rivalry clusters (CRM, PM, AI tools, website builders, ...) with each
  cluster's marquee matchup; and a data-backed "challenger vs incumbent" cut that
  surfaces newer tools out-appearing the incumbent they compete with.
- **Why it earns links:** quotable, number-driven, SaaS/marketing-roundup-friendly;
  ships with `Dataset` + `Article` JSON-LD and a "Cite or republish" box.
- **Internal linking:** `/studies` hub (top of list) + sitemap (priority 0.8);
  cross-links to Study #1, `/category/software/*`, entity, compare and partnerships pages.
- **Implementation:** `getB2BSaaSStudy()` in `src/lib/services/studies-service.ts`
  (live query + baked-in snapshot fallback), `src/app/studies/b2b-saas-comparison-report-2026/`.

**Headline numbers (snapshot 2026-06-12):**
- Most-compared SaaS tool: **HubSpot** (16 matchups), Mailchimp (12), Squarespace (11),
  Notion/Asana/Shopify (10).
- Biggest rivalry clusters: **Email Marketing & CRM** (49 comparisons), Website Builders (34),
  Productivity & PM (33), AI Tools (24).
- Challengers out-appearing incumbents: **HubSpot ▸ Salesforce** (16 vs 5), Notion ▸ Confluence
  (10 vs 5), Wix ▸ WordPress (9 vs 6), ClickUp ▸ Jira (9 vs 6), Bitwarden ▸ LastPass (3 vs 1).

---

## Lever 2 — Outreach

- **Target list:** `backlink-outreach-list.md` — 57 sites across 7 tiers (competitors,
  tech publications, roundup blogs, education, commerce, communities, niche).
- **Quora/Reddit answer drafts:** from DAN-755 (`outreach_posts` table + `/admin/outreach`).
- **Embed widget:** EmbedPartner infra live (`/embed`, `/api/v1/embed`, `/partnerships`).
- **Now pitchable:** Studies #1 and #2 are concrete assets to pitch for roundup inclusion,
  unlinked-mention reclamation, and journalist/blogger citation.
- **Next actions (manual posting required by a human):**
  1. Submit Study #1 to Tier-3 roundup blogs as a "comparison data study" resource.
  2. Queue Quora/Reddit answers that cite the study where a "most compared / most popular"
     question fits.
  3. Pitch the embeddable comparison widget to Tier-1 competitor-adjacent sites.

### Study #2 outreach — B2B SaaS / marketing roundups (DAN-1032)

Study #2 is a vertical asset built for the SaaS/marketing publishing niche — pitch it to
the marketing-tech end of `backlink-outreach-list.md` (Tier-3 roundups + Tier-2 publications)
rather than the consumer-tech sites Study #1 targets.

- **Asset:** https://www.aversusb.net/studies/b2b-saas-comparison-report-2026
- **Pitch hook:** "We analyzed 384 B2B SaaS comparisons — here's which tools buyers
  evaluate most, the hottest category rivalries, and where challengers are out-pacing
  incumbents (HubSpot now out-appears Salesforce 16:5)." Free to cite/republish w/ link.
- **Priority targets (from `backlink-outreach-list.md`):**
  - Tier 3 — phonexa.com (MarTech), influencermarketinghub.com, wecantrack.com,
    narrato.io (content tools), semrush.com (competitor/stat pages), cloudways.com.
  - Tier 2 — pcmag.com / cnet.com / tomsguide.com "best CRM / best PM tool" roundups
    (data-source citation angle).
- **Quora/Reddit angle:** answer "best CRM for…", "HubSpot vs Salesforce", "Notion vs
  Confluence", "ClickUp vs Jira" threads citing the relevant challenger data point.
- **Status:** asset live + queued for human outreach (same manual-posting constraint as
  Study #1). Draft pitch + targets recorded here; no agent-side blocker on the asset itself.

---

## Lever 3 — Referring-Domain Tracking (weekly)

**Status:** ⚠️ Blocked on a data source.

- DataForSEO **Labs** (keywords/SERP) is active, but the **Backlinks** API
  (`/backlinks/summary/live`, referring-domain counts) returns *"Access denied —
  activate your subscription"*. We cannot pull referring-domain counts automatically
  without it.
- Google Search Console exposes a Links report in the UI but **not** referring-domain
  counts via the Search Analytics API.

**Decision needed from owner (see issue interaction):** which source to use —
  (a) activate the DataForSEO Backlinks subscription (enables a weekly automated cron),
  (b) manual weekly read of the GSC Links report, or
  (c) another backlinks tool (Ahrefs/Moz) if a key exists.

### Weekly log (referring domains)
| Week | Date | Referring domains | Source | Notes |
|------|------|-------------------|--------|-------|
| W0 (baseline) | 2026-06-12 | *pending data source* | — | Study #1 shipped this week |
