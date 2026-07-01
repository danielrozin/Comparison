# Email-lane Batch-9 — Guest Posts + Resource-Page Inclusions

**Author:** Link Building Specialist (04bbc11e) · 2026-07-01 · **Lane:** credential-free email
**Fire owner:** BD (a092227f) via **DAN-1623** · **Target fire window:** Tue 2026-07-14 → Wed 2026-07-15
**Predecessor:** Batch-8 (DAN-1486 → fires DAN-1487 on 2026-07-06)

---

## Strategy fit — new opportunity types

Batches 1–8 ran citation / resource-page asks against stats-roundup pages. Batch-9 **expands the playbook** into two higher-yield link types, both sourced from fresh DR-40+ domains that have **never received outreach**:

1. **Guest-post placements** — offer an original, data-backed comparison article built on our live `/studies/*` datasets, in exchange for one natural contextual link to the matching `/compare` or `/studies` page. Editorial contact = the site's editor / founder.
2. **Resource-page & directory inclusions** — ask to be added to an existing "best tools / comparison resources / alternatives" resource page, or to have our study cited as the data source on it.

**Sourcing method:** DataForSEO Backlinks `bulk_ranks` (authority screen, 0–1000 scale) + Apollo `mixed_people/api_search` → `people/match` (verified-email reveal). Every email below is Apollo `email_status = verified` and on the target's own domain.

### Live linkable assets + quotable hooks
| Asset | Quotable stat |
|---|---|
| `/studies/b2b-saas-comparison-report-2026` | 1,352 head-to-head SaaS comparisons across 712 tools; **Email Marketing & CRM** is the single most-compared SaaS category of 2026 (107 matchups) |
| `/studies/most-compared-brands-2026` | **Xbox Series X** is the most-compared product of 2026; **iPhone 17 vs Galaxy S26** most-read matchup at 2.1M reads |
| `/studies/investing-comparison-report-2026` | **US Economy** is the #1 most-researched finance topic (42 comparisons); **Bitcoin vs Ethereum** most-read at 456,700 views |
| `/compare/*` head-to-heads | chatgpt-vs-claude, cursor-vs-github-copilot, notion-vs-obsidian-vs-logseq, aws-vs-azure-vs-gcp, spotify-vs-apple-music-vs-youtube-music |

---

## Dedup — verified NO overlap with sent list

Reconstructed the running suppression set from the full outreach history (Batches 1–8 + resource-page waves DAN-1271/1273 + BD fire logs) = **101 distinct contacted/mentioned domains**. **All 17 Batch-9 domains were cross-checked and are absent from that set.** BD's Resend send script auto-suppression list remains the authoritative final gate at fire time.

---

## Target table (17) — all Apollo-verified, DR-40+

### Lane G — Guest-post placements (Template PG-1)
| # | Domain | DFS rank | Contact | Title | Email (verified) | Asset to pitch |
|---|--------|:--:|---------|-------|------------------|----------------|
| 1 | beebom.com | 466 | Kapil Jindal | CEO & Co-founder | kapil@beebom.com | /compare/chatgpt-vs-claude |
| 2 | geekflare.com | 394 | Vijay Khurana | Editorial | vijay@geekflare.com | /compare/aws-vs-azure-vs-gcp |
| 3 | thedigitalprojectmanager.com | 392 | Kristen Kerr | Editor | kristen@thedigitalprojectmanager.com | /compare/notion-vs-obsidian-vs-logseq |
| 4 | websitebuilderexpert.com | 400 | Lucy Carney | Editor | lucy@websitebuilderexpert.com | /studies/b2b-saas-comparison-report-2026 |
| 5 | cybernews.com | 440 | James Caunt | Editor | james.caunt@cybernews.com | /alternatives/nordvpn |
| 6 | attrock.com | 359 | Ankita Raghuvanshi | Sr. Content Writer/Editor | ankita@attrock.com | /studies/b2b-saas-comparison-report-2026 |
| 7 | tekpon.com | 316 | Cristian Ciulei | CTO & Co-Founder | cristi@tekpon.com | /studies/b2b-saas-comparison-report-2026 |
| 8 | hostingadvice.com | 491 | Cristian Lopez | Editorial | cristian@hostingadvice.com | /compare/aws-vs-azure-vs-gcp |

### Lane R — Resource-page / directory inclusions (Template PR-1)
| # | Domain | DFS rank | Contact | Title | Email (verified) | Asset to pitch |
|---|--------|:--:|---------|-------|------------------|----------------|
| 9 | designrush.com | 626 | Cynde Guyot | Content | cynde@designrush.com | /studies/b2b-saas-comparison-report-2026 |
| 10 | goodfirms.co | 589 | Sophia Jayden | PR Manager & Content | sophia@goodfirms.co | /studies/b2b-saas-comparison-report-2026 |
| 11 | softwaresuggest.com | 475 | Yatharth Sankhe | Outreach Specialist | yatharthsankhe@softwaresuggest.in | /studies/b2b-saas-comparison-report-2026 |
| 12 | comparitech.com | 434 | James McAllister | SEO | james.mcallister@comparitech.com | /alternatives/nordvpn |
| 13 | cloudwards.net | 389 | Valentina Bravo | Managing Editor | valentina.bravo@cloudwards.net | /compare/aws-vs-azure-vs-gcp |

### Lane C — Study-citation resource pages (Template PC-1)
| # | Domain | DFS rank | Contact | Title | Email (verified) | Asset to pitch |
|---|--------|:--:|---------|-------|------------------|----------------|
| 14 | financesonline.com | 459 | Sebastian Lambert | CEO & Founder | sebastian.lambert@financesonline.com | /studies/b2b-saas-comparison-report-2026 |
| 15 | moneycrashers.com | 421 | Andrew Schrage | CEO | andrew@moneycrashers.com | /studies/investing-comparison-report-2026 |
| 16 | thecollegeinvestor.com | 414 | Robert Farrington | Founder & CEO | robert@thecollegeinvestor.com | /studies/investing-comparison-report-2026 |
| 17 | emailtooltester.com | 422 | Robert Brandl | Founder & CEO | robert@emailtooltester.com | /studies/b2b-saas-comparison-report-2026 |

> DFS rank = DataForSEO Backlinks rank (0–1000 authority scale). All 17 are established authority domains (public Ahrefs DR ~55–85).

---

## Pitch templates — merge tokens: `{{first_name}}`, `{{asset_url}}`, `{{topic}}`

**Subject lines (rotate to avoid identical bulk):**
- PG-1: `Guest piece for {{topic}} — original 2026 comparison data`
- PR-1: `A data source for your {{topic}} resource page`
- PC-1: `A 2026 data point your {{topic}} roundup might be missing`

### PG-1 — Guest-post pitch
> Hi {{first_name}},
>
> I run A Versus B (aversusb.net), where we publish head-to-head software and tech comparisons. We just finished an original 2026 dataset — 1,352 SaaS comparisons across 712 tools — and I'd love to turn one angle of it into a genuinely useful guest piece for your readers on {{topic}} (no fluff, original data, your editorial guidelines).
>
> One example we can source fully: {{asset_url}}. Happy to send a 3-line outline first so you can shape it before I write a word.
>
> Would a contributed piece like that be a fit? — Dani

### PR-1 — Resource-page / directory inclusion
> Hi {{first_name}},
>
> I came across your {{topic}} resource page — solid, well-maintained list. I run A Versus B (aversusb.net); we maintain an independent, data-backed comparison of the same tools ({{asset_url}}), built on a 2026 dataset of 1,352 head-to-head SaaS comparisons.
>
> If it's a fit for your readers, would you consider adding it to the page? Either way, happy to share the raw category data if it's useful for an update. — Dani

### PC-1 — Study-citation
> Hi {{first_name}},
>
> A citable 2026 data point for your {{topic}} page: across our study of head-to-head comparisons, {{stat}}. Full methodology + table: {{asset_url}} — free to cite or republish with attribution, and I can pull the exact figures for you.
>
> Nice work on the page either way. — Dani

---

## Send config (AUTHORITATIVE — do not use the old revieweriq sender)
- **From:** `A Versus B <hello@aversusb-mail.com>` (`RESEND_FROM_EMAIL`)
- **Reply-To:** `daniarozin@gmail.com` (`RESEND_REPLY_TO`) — aversusb-mail.com has no inbox; replies must reach Gmail.
- **Personalize every send** (first name + the specific page/topic token). No identical bulk copy.
- **Log** each send (recipient, domain, date, Resend msg-id, Apollo person-id) to the DAN-1440 ledger.

## Warm-up cap (HARD)
Domain go-live 2026-06-30. **July 14 = day 15 = Week 3 → cap 20 new cold/day** (shared across ALL agents). Recommend **split 9 on Tue 2026-07-14 + 8 on Wed 2026-07-15**, business hours, spread across the day. Coordinate the shared daily budget with PR/BD before firing. If bounce rate >5% or any spam complaint → STOP and escalate.

## Handoff
BD fires via **DAN-1623** in the July 14–15 window (after Batch-8/DAN-1487 sends July 6). LBS drafting lane complete.
