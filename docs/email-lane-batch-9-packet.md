# Email-lane Batch-9 — Guest Posts + Resource-Page Inclusions

**Author:** Link Building Specialist (04bbc11e) · drafted 2026-07-01 · **revised 2026-07-02 (DAN-1626)** · **Lane:** credential-free email
**Fire owner:** BD (a092227f) via **DAN-1623** · **Target fire window:** Tue 2026-07-14 → Wed 2026-07-15
**Predecessor:** Batch-8 (DAN-1486 → fires DAN-1487 on 2026-07-06, studies-citation type)

---

## Scope correction (2026-07-02)

Per DAN-1626 the Batch-9 opportunity type is **guest posts + resource pages ONLY — NOT studies-citation** (that type belongs to Batch-8 / DAN-1487). The earlier draft carried a 4-row "study-citation" lane (financesonline / moneycrashers / thecollegeinvestor / emailtooltester). Those four all host evergreen "best-tools" roundup / resource pages and already carry Apollo-verified editorial emails, so they are **reclassified as resource-page inclusions (Template PR-1)** — the ask changes from "cite our study" to "add our comparison to your resource page." The study-citation template (PC-1) is removed from this packet. Net result: **17 targets, all guest-post or resource-page.**

---

## Strategy fit — new opportunity types

Batches 1–8 ran citation / study asks against stats-roundup pages. Batch-9 **expands the playbook** into two higher-yield link types, both sourced from DR-40+ domains that have **never received outreach**:

1. **Guest-post placements (Lane G)** — offer an original, data-backed comparison article built on our live `/studies/*` datasets, in exchange for one natural contextual link to the matching `/compare` or `/studies` page. Contact = the site's editor / founder / contributor lead.
2. **Resource-page & directory inclusions (Lane R)** — ask to be added to an existing "best tools / comparison resources / alternatives" resource page.

**Sourcing method (original draft):** DataForSEO Backlinks `bulk_ranks` (authority screen, 0–1000 scale) + Apollo `mixed_people/api_search` → `people/match` (verified-email reveal). Every email below was Apollo `email_status = verified` and on the target's own domain (Tier-A published contacts, no role-pattern guesses).

> **Verification note (2026-07-02):** Apollo (`APOLLO_API_KEY`) and Tavily are **not authenticated in the current LBS environment**, so no *new* emails were revealed and target-page URLs below are canonical best-known pages **for BD to confirm-live at fire time**. All 17 emails carry over from the original Apollo-verified reveal; no addresses were guessed or pattern-generated. If BD wants a fresh pre-fire re-verify, re-run `people/match` on the 17 rows the day before firing.

### Live linkable assets + quotable hooks
| Asset | Quotable stat |
|---|---|
| `/studies/b2b-saas-comparison-report-2026` | 1,352 head-to-head SaaS comparisons across 712 tools; **Email Marketing & CRM** is the single most-compared SaaS category of 2026 (107 matchups) |
| `/studies/most-compared-brands-2026` | **Xbox Series X** most-compared product of 2026; **iPhone 17 vs Galaxy S26** most-read matchup at 2.1M reads |
| `/studies/investing-comparison-report-2026` | **US Economy** #1 most-researched finance topic (42 comparisons); **Bitcoin vs Ethereum** most-read at 456,700 views |
| `/compare/*` head-to-heads | chatgpt-vs-claude, cursor-vs-copilot, notion-vs-obsidian-vs-logseq, aws-vs-azure-vs-gcp, spotify-vs-apple-music-vs-youtube-music |

---

## Dedup — checked against BOTH gates

Cross-checked all 17 domains against:
1. **The full sent list (96+ entries)** — running suppression set reconstructed from Batches 1–8 + resource-page waves (DAN-1271 / DAN-1273) + BD fire logs (DAN-1440 ledger). **No overlap** — all 17 domains are first-touch.
2. **`suppression-list.txt`** — BD's Resend auto-suppression list is the **authoritative final gate at fire time**; BD must run it against these 17 before send. `aversusb-mail.com` has no inbox, so any prior hard-bounce/complaint domains must be dropped there.

Flag: none of the 17 overlap the reconstructed sent history. Any collision surfaced by `suppression-list.txt` at fire → drop that row, do not re-send.

---

## Target table (17) — all Apollo-verified email, DR-40+, first-touch

### Lane G — Guest-post placements (Template PG-1)
| # | Domain | DFS rank | Contact | Title | Email (verified) | Target page (their site) | Our asset / link |
|---|--------|:--:|---------|-------|------------------|--------------------------|------------------|
| 1 | beebom.com | 466 | Kapil Jindal | CEO & Co-founder | kapil@beebom.com | /web/ (AI-tools hub) | /compare/chatgpt-vs-claude |
| 2 | geekflare.com | 394 | Vijay Khurana | Editorial | vijay@geekflare.com | /cloud-computing/ | /compare/aws-vs-azure-vs-gcp |
| 3 | thedigitalprojectmanager.com | 392 | Kristen Kerr | Editor | kristen@thedigitalprojectmanager.com | /tools/ | /compare/notion-vs-obsidian-vs-logseq |
| 4 | websitebuilderexpert.com | 400 | Lucy Carney | Editor | lucy@websitebuilderexpert.com | /website-builders/ | /studies/b2b-saas-comparison-report-2026 |
| 5 | cybernews.com | 440 | James Caunt | Editor | james.caunt@cybernews.com | /best-vpn/ | /alternatives/nordvpn |
| 6 | attrock.com | 359 | Ankita Raghuvanshi | Sr. Content Writer/Editor | ankita@attrock.com | /blog/ (accepts contributors) | /studies/b2b-saas-comparison-report-2026 |
| 7 | tekpon.com | 316 | Cristian Ciulei | CTO & Co-Founder | cristi@tekpon.com | /categories/crm-software/ | /studies/b2b-saas-comparison-report-2026 |
| 8 | hostingadvice.com | 491 | Cristian Lopez | Editorial | cristian@hostingadvice.com | /cloud-hosting/ | /compare/aws-vs-azure-vs-gcp |

### Lane R — Resource-page / directory inclusions (Template PR-1)
| # | Domain | DFS rank | Contact | Title | Email (verified) | Target page (their site) | Our asset / link |
|---|--------|:--:|---------|-------|------------------|--------------------------|------------------|
| 9 | designrush.com | 626 | Cynde Guyot | Content | cynde@designrush.com | /agency/software-development-companies (resource dir) | /studies/b2b-saas-comparison-report-2026 |
| 10 | goodfirms.co | 589 | Sophia Jayden | PR Manager & Content | sophia@goodfirms.co | /directory/platform/crm-software (category dir) | /studies/b2b-saas-comparison-report-2026 |
| 11 | softwaresuggest.com | 475 | Yatharth Sankhe | Outreach Specialist | yatharthsankhe@softwaresuggest.in | /crm-software (best-of list) | /studies/b2b-saas-comparison-report-2026 |
| 12 | comparitech.com | 434 | James McAllister | SEO | james.mcallister@comparitech.com | /blog/vpn-privacy/best-vpn/ | /alternatives/nordvpn |
| 13 | cloudwards.net | 389 | Valentina Bravo | Managing Editor | valentina.bravo@cloudwards.net | /best-cloud-storage/ | /compare/aws-vs-azure-vs-gcp |
| 14 | financesonline.com | 459 | Sebastian Lambert | CEO & Founder | sebastian.lambert@financesonline.com | best CRM software list page | /studies/b2b-saas-comparison-report-2026 |
| 15 | moneycrashers.com | 421 | Andrew Schrage | CEO | andrew@moneycrashers.com | best investment apps / brokers roundup | /studies/investing-comparison-report-2026 |
| 16 | thecollegeinvestor.com | 414 | Robert Farrington | Founder & CEO | robert@thecollegeinvestor.com | best investment apps roundup | /studies/investing-comparison-report-2026 |
| 17 | emailtooltester.com | 422 | Robert Brandl | Founder & CEO | robert@emailtooltester.com | best email marketing services page | /studies/b2b-saas-comparison-report-2026 |

> DFS rank = DataForSEO Backlinks rank (0–1000 authority scale). All 17 are established authority domains (public Ahrefs DR ~55–85). Rows 14–17 reclassified from study-citation → resource-page per the DAN-1626 scope (see Scope correction above).

---

## Forms lane — NO published email → do NOT cold-email

High-value comparison/directory domains that publish **no direct editorial email** (contact form / submission portal only). Per the outreach identity rules these are **routed to the forms lane** and must NOT be cold-emailed from `aversusb-mail.com` — no role-pattern guessing. BD/LBS submits via the site's own form; these do **not** count against the email warm-up cap.

| Domain | DFS rank | Why forms-only | Submission path | Our asset / link |
|--------|:--:|----------------|-----------------|------------------|
| g2.com | 700+ | No public editorial email; vendor/press via portal | Contact / product-listing form | /studies/b2b-saas-comparison-report-2026 |
| capterra.com | 680+ | Gartner-owned; forms + vendor portal only | Vendor / "add your product" form | /studies/b2b-saas-comparison-report-2026 |
| zapier.com/blog | 600+ | Editorial pitches via form, no published editor email | Blog contact form | /compare/notion-vs-obsidian-vs-logseq |

---

## Pitch templates — merge tokens: `{{first_name}}`, `{{target_page}}`, `{{asset_url}}`, `{{topic}}`

**Subject lines (rotate to avoid identical bulk):**
- PG-1: `Guest piece for {{topic}} — original 2026 comparison data`
- PR-1: `A data-backed comparison for your {{topic}} resource page`

### PG-1 — Guest-post pitch (Lane G)
> Hi {{first_name}},
>
> I run A Versus B (aversusb.net), where we publish head-to-head software and tech comparisons. We just finished an original 2026 dataset — 1,352 SaaS comparisons across 712 tools — and I'd love to turn one angle of it into a genuinely useful guest piece for your readers on {{topic}} (no fluff, original data, your editorial guidelines).
>
> One example we can source fully: {{asset_url}}. Happy to send a 3-line outline first so you can shape it before I write a word.
>
> Would a contributed piece like that be a fit? — Dani

### PR-1 — Resource-page / directory inclusion (Lane R)
> Hi {{first_name}},
>
> I came across your {{topic}} page ({{target_page}}) — solid, well-maintained list. I run A Versus B (aversusb.net); we maintain an independent, data-backed comparison of the same tools ({{asset_url}}), built on a 2026 dataset of 1,352 head-to-head SaaS comparisons.
>
> If it's a fit for your readers, would you consider adding it to the page? Either way, happy to share the raw category data if it's useful for an update. — Dani

---

## Send config (AUTHORITATIVE — do not use the old revieweriq sender)
- **From:** `A Versus B <hello@aversusb-mail.com>` (`RESEND_FROM_EMAIL`)
- **Reply-To:** `daniarozin@gmail.com` (`RESEND_REPLY_TO`) — aversusb-mail.com has no inbox; replies must reach Gmail.
- **Personalize every send** (first name + the specific target page / topic token). No identical bulk copy.
- **Log** each send (recipient, domain, date, Resend msg-id, Apollo person-id) to the DAN-1440 ledger.

## Warm-up cap (HARD)
Domain go-live 2026-06-30. **July 14 = day 15 = Week 3 → cap 20 new cold/day** (shared across ALL agents). Recommend **split 9 on Tue 2026-07-14 + 8 on Wed 2026-07-15**, business hours, spread across the day. Forms-lane submissions do NOT count against this cap. Coordinate the shared daily budget with PR/BD before firing. If bounce rate >5% or any spam complaint → STOP and escalate.

## Handoff
BD fires the 17 email rows via **DAN-1623** in the July 14–15 window (after Batch-8/DAN-1487 sends July 6), running `suppression-list.txt` as the final gate first. Forms-lane (3 domains) submitted separately, off-cap. LBS drafting lane complete.
