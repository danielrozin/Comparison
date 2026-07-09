/**
 * DAN-1800 — A-vs-B / B-vs-A ordering-duplicate consolidations (GENERATED).
 *
 * Spam-update recovery lever #1 (reduce scaled-content footprint). The
 * DAN-1800 thin-page audit (scripts/dan1800-thin-page-audit.ts, run against
 * prod 2026-07-09, 5,338 published rows) found 84 A/B ordering-duplicate
 * clusters that post-date the DAN-1265 sweep (166 clusters) — i.e. both entity
 * orderings are live, self-canonical 200s splitting link equity for the same
 * comparison. These are exactly the low-value near-duplicates the June 2026
 * Spam Update penalizes; folding each cluster to one canonical concentrates
 * crawl + quality signal on the survivor.
 *
 * Survivor selection (same rule as DAN-1265): the page with real traffic wins
 *   1. max lifetime viewCount, then
 *   2. max stored GSC searchImpressions, then
 *   3. alphabetically-sorted slug (deterministic tie-break, matches the
 *      going-forward generation order in comparisonSlug() / sortComparisonSlug).
 *
 * Map: retired slug -> survivor slug. Consumed by compare-redirects.ts which
 * emits permanent (301/308) edge redirects via next.config.ts redirects(). The
 * retired DB rows are set status="archived" (scripts/dan1800-archive-consolidated.ts)
 * so they drop out of the sitemap; the edge redirect survives row deletion.
 *
 * Regenerate: re-run the audit against prod, then rebuild this map from the
 * DUP_CLUSTER bucket. Do not hand-edit — add one-off / alias consolidations to
 * compare-redirects.ts instead.
 *
 * Growth Lead + VP Product signed off on this scope on DAN-1800 (2026-07-09).
 */

export const ORDERING_CONSOLIDATIONS_DAN1800: Record<string, string> = {
  "docusign-vs-adobe-sign": "adobe-sign-vs-docusign",
  "sketch-vs-adobe-xd": "adobe-xd-vs-sketch",
  "dagster-vs-airflow": "airflow-vs-dagster",
  "prefect-vs-airflow": "airflow-vs-prefect",
  "airpods-pro-2-vs-airpods-4": "airpods-4-vs-airpods-pro-2",
  "coda-vs-airtable": "airtable-vs-coda",
  "monday-com-vs-airtable": "airtable-vs-monday-com",
  "google-analytics-vs-amplitude": "amplitude-vs-google-analytics",
  "pendo-vs-amplitude": "amplitude-vs-pendo",
  "posthog-vs-amplitude": "amplitude-vs-posthog",
  "flink-vs-apache-spark": "apache-spark-vs-flink",
  "hadoop-vs-apache-spark": "apache-spark-vs-hadoop",
  "whoop-vs-apple-watch": "apple-watch-vs-whoop",
  "flux-vs-argocd": "argocd-vs-flux",
  "t-mobile-vs-att": "att-vs-t-mobile",
  "verizon-vs-att": "att-vs-verizon",
  "cloudflare-vs-aws": "aws-vs-cloudflare",
  "clickup-vs-basecamp": "basecamp-vs-clickup",
  "roam-research-vs-bear": "bear-vs-roam-research",
  "convertkit-vs-beehiiv": "beehiiv-vs-convertkit",
  "squarespace-vs-bigcommerce": "bigcommerce-vs-squarespace",
  "gitlab-vs-bitbucket": "bitbucket-vs-gitlab",
  "dashlane-vs-bitwarden": "bitwarden-vs-dashlane",
  "everyplate-vs-blue-apron": "blue-apron-vs-everyplate",
  "hostinger-vs-bluehost": "bluehost-vs-hostinger",
  "gle-vs-bmw-x5": "bmw-x5-vs-gle",
  "arc-vs-brave": "brave-vs-arc",
  "chatgpt-vs-gemini-vs-claude": "chatgpt-vs-claude-vs-gemini",
  "petco-vs-chewy": "chewy-vs-petco",
  "pinecone-vs-chroma": "chroma-vs-pinecone",
  "weaviate-vs-chroma": "chroma-vs-weaviate",
  "continue-vs-codeium": "codeium-vs-continue",
  "github-copilot-vs-codeium": "codeium-vs-github-copilot",
  "coda-vs-confluence": "confluence-vs-coda",
  "lastpass-vs-dashlane": "dashlane-vs-lastpass",
  "dynatrace-vs-datadog": "datadog-vs-dynatrace",
  "macbook-air-vs-dell-xps": "dell-xps-vs-macbook-air",
  "macbook-pro-vs-dell-xps": "dell-xps-vs-macbook-pro",
  "looker-vs-domo": "domo-vs-looker",
  "onedrive-vs-dropbox": "dropbox-vs-onedrive",
  "new-relic-vs-dynatrace": "dynatrace-vs-new-relic",
  "nestjs-vs-express": "express-vs-nestjs",
  "flask-vs-fastapi": "fastapi-vs-flask",
  "supabase-vs-firebase": "firebase-vs-supabase",
  "whoop-vs-fitbit": "fitbit-vs-whoop",
  "intercom-vs-freshdesk": "freshdesk-vs-intercom",
  "windsurf-vs-github-copilot": "github-copilot-vs-windsurf",
  "linear-vs-github-issues": "github-issues-vs-linear",
  "wix-vs-godaddy": "godaddy-vs-wix",
  "oneplus-vs-google-pixel": "google-pixel-vs-oneplus",
  "samsung-galaxy-vs-google-pixel": "google-pixel-vs-samsung-galaxy",
  "perplexity-vs-google": "google-vs-perplexity",
  "rippling-vs-hibob": "hibob-vs-rippling",
  "later-vs-hootsuite": "hootsuite-vs-later",
  "siteground-vs-hostinger": "hostinger-vs-siteground",
  "langchain-vs-hugging-face": "hugging-face-vs-langchain",
  "stanley-vs-hydro-flask": "hydro-flask-vs-stanley",
  "dropbox-vs-icloud": "icloud-vs-dropbox",
  "china-vs-japan": "japan-vs-china",
  "monday-com-vs-jira": "jira-vs-monday-com",
  "rails-vs-laravel": "laravel-vs-rails",
  "michael-jordan-vs-lebron-james": "lebron-james-vs-michael-jordan",
  "jordan-vs-lebron": "lebron-vs-jordan",
  "macbook-pro-14-vs-macbook-air": "macbook-air-vs-macbook-pro-14",
  "burger-king-vs-mcdonalds": "mcdonalds-vs-burger-king",
  "bmw-x5-vs-mercedes-benz-gle": "mercedes-benz-gle-vs-bmw-x5",
  "audi-a6-vs-mercedes-e-class": "mercedes-e-class-vs-audi-a6",
  "planetscale-vs-neon": "neon-vs-planetscale",
  "supabase-vs-neon": "neon-vs-supabase",
  "simplisafe-vs-nest": "nest-vs-simplisafe",
  "monday-com-vs-notion": "notion-vs-monday-com",
  "roam-research-vs-obsidian": "obsidian-vs-roam-research",
  "sage-vs-quickbooks": "quickbooks-vs-sage",
  "rtx-4080-vs-rtx-4090": "rtx-4090-vs-rtx-4080",
  "xero-vs-sage": "sage-vs-xero",
  "datadog-vs-splunk": "splunk-vs-datadog",
  "progressive-vs-state-farm": "state-farm-vs-progressive",
  "xero-vs-wave": "wave-vs-xero",
  "microsoft-teams-vs-webex": "webex-vs-microsoft-teams",
  "bank-of-america-vs-wells-fargo": "wells-fargo-vs-bank-of-america",
  "amazon-music-vs-youtube-music": "youtube-music-vs-amazon-music",
  "soundcloud-vs-youtube-music": "youtube-music-vs-soundcloud",
  "hulu-live-vs-youtube-tv": "youtube-tv-vs-hulu-live",
  "loom-vs-zoom": "zoom-vs-loom",
};
