# DAN-1800 — /compare/* Spam-Update Recovery: Thin-Page & Scaled-Footprint Audit

**Date:** 2026-07-09 · **Author:** Fullstack Developer (aversusb) · **Parent:** DAN-1799
**Data source:** prod DB (`comparisons` table, status=published) via `scripts/dan1800-thin-page-audit.ts`

## TL;DR

The −98% `/compare/*` impression collapse (DAN-1799) is **not** caused by
individually thin pages — **99.8% of published pages carry 5–8 substantive,
contrasting key differences**. The trigger is the **aggregate "scaled content
abuse" signal** Google's June 2026 Spam Update targets: a **5,314-page
programmatic corpus that is 99.2% AI-auto-generated (5,271 pages) with only 42
human-reviewed pages (0.8%)** and near-zero recorded per-page engagement.

Per-page rewriting is therefore **not** the highest-leverage fix. The two
reducible footprint items available **today** are:

1. **84 exact A-vs-B / B-vs-A duplicate clusters (168 pages)** → consolidate to
   the canonical alphabetical ordering + 301 the reorder (extends DAN-1265).
2. **1 degenerate self-comparison** (`grubhub-vs-grubhub`) live as a published
   row despite the `isDegenerateComparisonSlug` 404 guard → noindex/delete.

Large-scale demand-based pruning (noindex the zero-traffic long tail) is
**blocked on a data gap**: the DB's `searchImpressions` field is **never
populated** — GSC per-page impressions are not joined to `comparisons` rows, so
we cannot yet rank the long tail by demand. Closing that gap is a prerequisite
follow-up (see Recommendations).

## Corpus composition

| Metric | Value |
|---|---|
| Published `/compare/*` pages | **5,314** |
| Auto-generated | 5,271 (99.2%) |
| Human-reviewed | 42 (0.8%) |
| Pages with any recorded pageviews | 24 |
| Pages with `searchImpressions > 0` in DB | **0 (field never synced)** |

## Classification (buckets)

| Bucket | Pages | Meaning / action |
|---|---|---|
| STRONG | 5,142 | ≥3 substantive contrasting key differences — keep + deepen |
| DUP_CLUSTER | 168 | Member of an A/B ordering duplicate cluster — **consolidate** |
| REVIEW_NWAY_SHAPE | 2 | 3+ entity pages the metric can't read reliably — manual review |
| THIN_HAS_DEMAND | 1 | `neymar-vs-mbappe` — 567K views but thin (KD=2) → **deepen, never noindex** |
| THIN_NO_DEMAND | 1 | `grubhub-vs-grubhub` — degenerate self-comparison → **noindex/delete** |

Substantive-key-difference histogram (depth is healthy):
`{0:5(shape-artifacts+degenerate), 2:1, 3:15, 4:44, 5:142, 6:619, 7:4024, 8:455, 9+:7}`

## Immediate candidate lists (with volumes)

### A. Consolidate — 84 duplicate clusters / 168 pages (extends DAN-1265)
Keep the canonical (alphabetically-first) slug; 301 the reorder into it.

| Keep (canonical) | Retire → 301 |
|---|---|
| `china-vs-japan` | `japan-vs-china` |
| `jordan-vs-lebron` | `lebron-vs-jordan` |
| `obsidian-vs-roam-research` | `roam-research-vs-obsidian` |
| `burger-king-vs-mcdonalds` | `mcdonalds-vs-burger-king` |
| `airtable-vs-coda` | `coda-vs-airtable` |
| `hibob-vs-rippling` | `rippling-vs-hibob` |
| `bitwarden-vs-dashlane` | `dashlane-vs-bitwarden` |
| `google-pixel-vs-oneplus` | `oneplus-vs-google-pixel` |
| `codeium-vs-github-copilot` | `github-copilot-vs-codeium` |
| `amazon-music-vs-youtube-music` | `youtube-music-vs-amazon-music` |
| `hootsuite-vs-later` | `later-vs-hootsuite` |
| `rtx-4080-vs-rtx-4090` | `rtx-4090-vs-rtx-4080` |
| `airpods-4-vs-airpods-pro-2` | `airpods-pro-2-vs-airpods-4` |
| `basecamp-vs-clickup` | `clickup-vs-basecamp` |
| `bmw-x5-vs-mercedes-benz-gle` | `mercedes-benz-gle-vs-bmw-x5` |
| `hostinger-vs-siteground` | `siteground-vs-hostinger` |
| `audi-a6-vs-mercedes-e-class` | `mercedes-e-class-vs-audi-a6` |
| `soundcloud-vs-youtube-music` | `youtube-music-vs-soundcloud` |
| `coda-vs-confluence` | `confluence-vs-coda` |
| `airtable-vs-monday-com` | `monday-com-vs-airtable` |
| `arc-vs-brave` | `brave-vs-arc` |
| `loom-vs-zoom` | `zoom-vs-loom` |
| `microsoft-teams-vs-webex` | `webex-vs-microsoft-teams` |
| `github-copilot-vs-windsurf` | `windsurf-vs-github-copilot` |
| `bigcommerce-vs-squarespace` | `squarespace-vs-bigcommerce` |
| `aws-vs-cloudflare` | `cloudflare-vs-aws` |
| `google-vs-perplexity` | `perplexity-vs-google` |
| `monday-com-vs-notion` | `notion-vs-monday-com` |
| `firebase-vs-supabase` | `supabase-vs-firebase` |
| `amplitude-vs-posthog` | `posthog-vs-amplitude` |
| `hulu-live-vs-youtube-tv` | `youtube-tv-vs-hulu-live` |
| `wave-vs-xero` | `xero-vs-wave` |
| `apple-watch-vs-whoop` | `whoop-vs-apple-watch` |
| `adobe-sign-vs-docusign` | `docusign-vs-adobe-sign` |
| `fitbit-vs-whoop` | `whoop-vs-fitbit` |
| `sage-vs-xero` | `xero-vs-sage` |
| `google-pixel-vs-samsung-galaxy` | `samsung-galaxy-vs-google-pixel` |
| `domo-vs-looker` | `looker-vs-domo` |
| `chatgpt-vs-claude-vs-gemini` | `chatgpt-vs-gemini-vs-claude` |
| `bluehost-vs-hostinger` | `hostinger-vs-bluehost` |
| `progressive-vs-state-farm` | `state-farm-vs-progressive` |
| `freshdesk-vs-intercom` | `intercom-vs-freshdesk` |
| `argocd-vs-flux` | `flux-vs-argocd` |
| `nest-vs-simplisafe` | `simplisafe-vs-nest` |
| `bear-vs-roam-research` | `roam-research-vs-bear` |
| `dashlane-vs-lastpass` | `lastpass-vs-dashlane` |
| `amplitude-vs-google-analytics` | `google-analytics-vs-amplitude` |
| `amplitude-vs-pendo` | `pendo-vs-amplitude` |
| `bitbucket-vs-gitlab` | `gitlab-vs-bitbucket` |
| `chewy-vs-petco` | `petco-vs-chewy` |
| `dynatrace-vs-new-relic` | `new-relic-vs-dynatrace` |
| `airflow-vs-prefect` | `prefect-vs-airflow` |
| `beehiiv-vs-convertkit` | `convertkit-vs-beehiiv` |
| `adobe-xd-vs-sketch` | `sketch-vs-adobe-xd` |
| `godaddy-vs-wix` | `wix-vs-godaddy` |
| `neon-vs-planetscale` | `planetscale-vs-neon` |
| `neon-vs-supabase` | `supabase-vs-neon` |
| `dell-xps-vs-macbook-air` | `macbook-air-vs-dell-xps` |
| `lebron-james-vs-michael-jordan` | `michael-jordan-vs-lebron-james` |
| `blue-apron-vs-everyplate` | `everyplate-vs-blue-apron` |
| `airflow-vs-dagster` | `dagster-vs-airflow` |
| `bank-of-america-vs-wells-fargo` | `wells-fargo-vs-bank-of-america` |
| `macbook-air-vs-macbook-pro-14` | `macbook-pro-14-vs-macbook-air` |
| `bmw-x5-vs-gle` | `gle-vs-bmw-x5` |
| `apache-spark-vs-hadoop` | `hadoop-vs-apache-spark` |
| `apache-spark-vs-flink` | `flink-vs-apache-spark` |
| `dropbox-vs-onedrive` | `onedrive-vs-dropbox` |
| `dropbox-vs-icloud` | `icloud-vs-dropbox` |
| `jira-vs-monday-com` | `monday-com-vs-jira` |
| `hydro-flask-vs-stanley` | `stanley-vs-hydro-flask` |
| `datadog-vs-dynatrace` | `dynatrace-vs-datadog` |
| `dell-xps-vs-macbook-pro` | `macbook-pro-vs-dell-xps` |
| `datadog-vs-splunk` | `splunk-vs-datadog` |
| `att-vs-t-mobile` | `t-mobile-vs-att` |
| `att-vs-verizon` | `verizon-vs-att` |
| `github-issues-vs-linear` | `linear-vs-github-issues` |
| `fastapi-vs-flask` | `flask-vs-fastapi` |
| `laravel-vs-rails` | `rails-vs-laravel` |
| `codeium-vs-continue` | `continue-vs-codeium` |
| `chroma-vs-pinecone` | `pinecone-vs-chroma` |
| `hugging-face-vs-langchain` | `langchain-vs-hugging-face` |
| `quickbooks-vs-sage` | `sage-vs-quickbooks` |
| `express-vs-nestjs` | `nestjs-vs-express` |
| `chroma-vs-weaviate` | `weaviate-vs-chroma` |

### B. Noindex/delete — 1 page
- `grubhub-vs-grubhub` — self-comparison, "Same company" vs "Same company"; already meant to 404.

### C. Deepen (do NOT noindex) — high-demand thin page
- `neymar-vs-mbappe` — **567,800 views**, only 2 key differences, 162-char verdict. Prime candidate for lever #2 (add real stats: goals, trophies, market value, head-to-head).

### D. N-way manual review — 2 pages
- `figma-vs-sketch-vs-adobe-xd`, `zoom-vs-google-meet-vs-teams` — flagged only because the audit metric can't parse their object-keyed key-differences shape; both are real, valuable pages. No action beyond confirming render.

## Recommendations (need growth/product sign-off before mass deploy)

1. **Ship now, low-risk:** consolidate the 84 duplicate clusters (301) and
   noindex `grubhub-vs-grubhub`. Pure crawl-quality win, no traffic at risk.
2. **Lever #2 deepen:** prioritise the handful of high-traffic pages (e.g.
   `neymar-vs-mbappe`) for genuine differentiated data + original verdict.
3. **Lever #3 done:** generator quality gate now rejects thin generations at
   mint time (`assessComparisonQuality`, errorStage `quality`) — see
   `src/lib/services/comparison-quality.ts`.
4. **Blocker to resolve before ANY large noindex:** wire GSC per-page
   impressions (`fetchGSCComparePageRows`) into `comparisons.searchImpressions`
   so the zero-demand long tail can be ranked. Until then we cannot responsibly
   pick a large noindex set — and blanket noindexing 5,000 pages with healthy
   per-page data would destroy recoverable equity, not help.
5. **Recovery tracking (lever #4):** the DAN-1008 compare-gate cron already
   pulls `/compare/*` GSC weekly (clicks). Re-confirm trend reversal weekly from
   2026-07-14; feed back to DAN-1799.

## Reproduce

```
npx tsx scripts/dan1800-thin-page-audit.ts        # full report → scripts/data/dan1800-thin-audit.json
```
