# DAN-1146 — Thin /compare/* shell remediation

**Fix:** `src/pages/compare/[slug].tsx` now server-side generates + persists un-ingested
slugs in `getStaticProps` (commit `f802de9`), so missing-DB-record slugs render full SSR
+ affiliate CTAs instead of the 15,692-byte client-only shell. They self-heal on first
crawl after deploy. Falls back to the client shell on any generation failure (no regression).

## Prod sweep (2026-06-21, all 2069 /compare/* sitemap URLs)
- 2044 healthy (1953 >150KB, 91 in 50–150KB), 0 fetch failures
- **25 still rendering the 15,692-byte client shell** (missing DB records):

- `/compare/airpods-pro-vs-sony-wf-1000xm5`
- `/compare/apple-watch-vs-samsung-galaxy-watch`
- `/compare/asana-vs-trello`
- `/compare/aws-vs-google-cloud`
- `/compare/azure-vs-aws`
- `/compare/bard-vs-chatgpt`
- `/compare/casper-vs-purple`
- `/compare/claude-vs-gpt-4`
- `/compare/coinbase-vs-binance`
- `/compare/cursor-vs-github-copilot`
- `/compare/dall-e-vs-stable-diffusion`
- `/compare/dyson-vs-shark`
- `/compare/facebook-vs-instagram`
- `/compare/fidelity-vs-schwab`
- `/compare/gemini-vs-chatgpt`
- `/compare/gemini-vs-claude`
- `/compare/github-copilot-vs-tabnine`
- `/compare/grubhub-vs-grubhub`
- `/compare/linear-vs-jira`
- `/compare/mongodb-vs-postgresql`
- `/compare/notion-vs-monday-com`
- `/compare/perplexity-vs-chatgpt`
- `/compare/perplexity-vs-google`
- `/compare/supabase-vs-firebase`
- `/compare/vercel-vs-netlify`

> `grubhub-vs-grubhub` is a degenerate self-comparison — prune from sitemap separately.

## Post-deploy verification
After `dan-432-jsonld-graph-ids` deploys to prod, re-run:
```
for u in <each slug above>; do curl -s -o /dev/null -w "%{size_download} $u\n" "https://www.aversusb.net/compare/$u"; done
```
Expect each to jump from ~15.7KB to >150KB on first (generation) hit. Confirm count of <20KB shells drops to 0.
