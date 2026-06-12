# DAN-1007 — Per-target referring-domain opportunity map (page-1 push cluster)

**Generated:** 2026-06-12 · **Owner:** Link Building Specialist · **Parent:** DAN-1002 · **Gate doc:** DAN-1003 target-cluster

## What this doc is (and how it differs from the companions)

This is the **per-target referring-domain map** for the 3 page-1 push pages — 3–5 specific,
category-matched referring-domain opportunities tied to each `/compare/*` URL, prioritized by how
likely a single quality link is to push the page across position 10.

| Doc | Scope |
|-----|-------|
| `backlink-outreach-list.md` | **Site-wide** domain outreach, organized by tier (not target-specific) |
| `dan1013-offpage-outreach.md` | **Reddit/Quora citation answers** for the 3 targets |
| **`dan1007-per-target-referring-domains.md` (this)** | **Resource pages / comparison directories / partner & roundup domains**, mapped per target with a tracking log |

## Target cluster (per DAN-1003 — only `/compare/*` keywords in pos 11–20)

| # | Page | Position | Why prioritized |
|---|------|----------|-----------------|
| 1 | `/compare/amazon-vs-best-buy` | 20 | Highest volume (110) + cleanest head-term match → **most** off-page effort |
| 2 | `/compare/capital-one-vs-chase` | 17 | Best quick win — closest to pos 10, high-CPC finance intent |
| 3 | `/compare/ikea-vs-wayfair` | 15 | Already closest by rank; needs the least to cross |

**Link-effort weighting:** `amazon-vs-best-buy` 50% · `capital-one-vs-chase` 30% · `ikea-vs-wayfair` 20%.
Rationale: #1 has the most distance to close but the highest payoff; #2 and #3 are nearer pos 10, so
fewer links should tip them — spend the marginal link where it both moves a page AND captures volume.

## ⚠️ Posting / outreach governance (do NOT auto-execute)

These are **discovery + outreach targets queued for manual execution**. Each external opportunity below
lists a live discovery query to confirm the page exists, is open, and is on-topic **before** any outreach:
- Honor the **LBS lane policy** (five no-touch subreddits) and the link-bearing Reddit activation gate (passed 2026-06-01).
- Resource-page / roundup / directory pitches go through the campaign's authenticated mailbox — agent prepares, human sends.
- Never test-submit to a real service — verify any submission via network/DOM evidence, not a second "test".
- Log shipped placements + acquired referring domains in the tracking table at the bottom; weekly burndown → DAN-377.

---

## Target 1 — Amazon vs Best Buy → `/compare/amazon-vs-best-buy`

**Vertical:** consumer electronics / big-box retail. **Anchor pool (vary):** "Amazon vs Best Buy
comparison", "how the two retailers compare", "side-by-side of Amazon and Best Buy".

| # | Type | Opportunity & angle | Discovery query (confirm before outreach) | Status |
|---|------|---------------------|--------------------------------------------|--------|
| 1.1 | Roundup / resource page | "Best places to buy electronics online" listicles on mid-tier tech blogs — pitch our comparison as the neutral decision tool | `intitle:"best places to buy electronics" 2026 -site:amazon.com` | queued |
| 1.2 | Subreddit wiki / resource | r/Frugal & r/BuyItForLife sidebar/wiki "shopping resources" — propose as a cited resource (mod-approved, not a comment drop) | `site:reddit.com/r/Frugal/wiki electronics OR shopping` | queued |
| 1.3 | Comparison directory | Submit to neutral comparison/decision directories that index "X vs Y" tools (alternativeto-style, listing aggregators) | `"compare retailers" OR "comparison tool" submit site directory electronics` | queued |
| 1.4 | Broken-link reclamation | Find dead links to defunct retailer-comparison pages on deal/coupon resource pages → offer ours as the live replacement | `"amazon vs best buy" (intitle:resources OR inurl:links) "404" OR "no longer available"` | queued |
| 1.5 | Free comparison embed (EmbedPartner) | Offer deal/tech bloggers a free embeddable Amazon-vs-Best-Buy widget (attribution link back) | partner outreach via embed infra | queued |

## Target 2 — Capital One vs Chase → `/compare/capital-one-vs-chase`

**Vertical:** credit cards / personal finance. **Anchor pool (vary):** "Capital One vs Chase comparison",
"how Capital One and Chase stack up", "the two issuers compared".

| # | Type | Opportunity & angle | Discovery query (confirm before outreach) | Status |
|---|------|---------------------|--------------------------------------------|--------|
| 2.1 | Roundup / resource page | "Best credit card comparison tools / sites" roundups on personal-finance blogs — pitch as an unbiased side-by-side | `intitle:"best credit card comparison" tools OR sites 2026` | queued |
| 2.2 | Education / .edu resource | University & nonprofit personal-finance literacy pages that list "credit card comparison resources" (high-authority, evergreen) | `site:.edu "credit card" "comparison" resources personal finance` | queued |
| 2.3 | Subreddit wiki / resource | r/CreditCards & r/personalfinance wiki "tools & resources" — propose as a cited decision aid (mod route) | `site:reddit.com/r/CreditCards/wiki OR /r/personalfinance/wiki tools` | queued |
| 2.4 | Broken-link reclamation | Dead links to retired card-comparison pages on finance resource lists → offer ours as replacement | `"capital one vs chase" inurl:resources "page not found"` | queued |
| 2.5 | Unlinked-mention reclamation | Find articles that mention aversusb / our card data without linking → request the link | `"aversusb" -site:aversusb.net credit card` | queued |

## Target 3 — IKEA vs Wayfair → `/compare/ikea-vs-wayfair`

**Vertical:** furniture / home goods. **Anchor pool (vary):** "IKEA vs Wayfair comparison",
"how IKEA and Wayfair compare", "the two furniture retailers side by side".

| # | Type | Opportunity & angle | Discovery query (confirm before outreach) | Status |
|---|------|---------------------|--------------------------------------------|--------|
| 3.1 | Roundup / resource page | "Best places to buy furniture online" / "where to furnish an apartment" roundups on home & renter blogs | `intitle:"best places to buy furniture online" 2026` | queued |
| 3.2 | Subreddit wiki / resource | r/HomeImprovement & r/malelivingspace wiki "furniture buying guide" resource lists (mod route) | `site:reddit.com/r/HomeImprovement/wiki furniture` | queued |
| 3.3 | Comparison directory | Home-decor / interior-design comparison & tool directories that index buying-decision resources | `furniture "comparison" directory OR "buying guide" submit resource` | queued |
| 3.4 | Roundup / first-apartment guides | "First apartment furniture checklist" guides (high-traffic, evergreen) — pitch our comparison as the buy-decision step | `intitle:"first apartment" furniture checklist guide` | queued |
| 3.5 | Free comparison embed (EmbedPartner) | Offer home/renter bloggers a free IKEA-vs-Wayfair embeddable widget (attribution link back) | partner outreach via embed infra | queued |

---

## Cross-target plays (apply to all three)

- **Unlinked-mention reclamation sweep** — run `"aversusb" -site:aversusb.net` quarterly; convert any mention into a link (fastest, highest-trust referring domain there is).
- **EmbedPartner widget distribution** — the free comparison-embed infra already exists; each embed placed on an external blog = one new referring domain + an exact-context inbound link. Lead with this for #1 and #3 (visual/consumer verticals embed better than finance).
- **Niche roundup inclusion** — when pitching, lead with the matching DAN-1025 data study (Most-Compared Brands 2026 / B2B SaaS report) as the credibility hook, then point to the specific target page.

## Referring-domain tracking log (baseline + first cycle)

**Baseline (2026-06-12):** aversusb.net ≈ 0 referring domains pointing at any of the 3 target URLs
(domain has 0 keywords in top-10; authority is the binding constraint per DAN-1025). Exact RD count
needs a DataForSEO **Backlinks** pull — gated on board approval `ae06eef2` (tracked on DAN-1025).

| Target | Opportunities queued | Pitched | Acquired (live link) | Pending reply | RD count Δ (next pull) |
|--------|----------------------|---------|----------------------|---------------|------------------------|
| amazon-vs-best-buy | 5 | 0 | 0 | 0 | — |
| capital-one-vs-chase | 5 | 0 | 0 | 0 | — |
| ikea-vs-wayfair | 5 | 0 | 0 | 0 | — |

## Verify / report cadence

1. **Execute** queued opportunities via the campaign's authenticated mailbox + embed infra (human-in-loop per governance).
2. **Re-pull** target positions + referring-domain counts after 2–3 weeks (DataForSEO credential on DAN-1003 / Backlinks source on approval `ae06eef2`).
3. **Report** referring-domain gains per target here + weekly burndown → DAN-377.
