# DAN-1507 — August SEO Sprint opportunity seed (DataForSEO discovery)

**Generated:** 2026-06-28 by Link Building Specialist · **Source:** DataForSEO `keyword_suggestions/live` · **API cost:** ~$0.16 · **Raw data:** `dan1507-august-seed-2026-06-28.json` (191 scored rows)

## Method
Seeded comparison anchors across the July/August clusters (`asana vs`, `zoom vs`, `nordvpn vs`, `chatgpt vs`, `notion vs`, `slack vs`), pulled US (loc 2840) suggestions with volume > 300, filtered to `X vs Y` phrasing, scored with the standard opportunityScore formula (`log10(vol)*20 + (100-KD)*0.3 + min(cpc*5,25) + (1-comp)*15`).

## Top 30 scored opportunities
| Score | Volume | KD | Keyword |
|--:|--:|--:|---|
| 155.9 | 33,100 | 6 | claude vs chatgpt |
| 146.5 | 9,900 | 6 | chatgpt vs gemini |
| 144.0 | 8,100 | 6 | chatgpt vs claude |
| 142.3 | 8,100 | 7 | claude ai vs chatgpt |
| 138.6 | 3,600 | 4 | chatgpt vs copilot |
| 137.6 | 14,800 | 11 | gemini vs chatgpt |
| 137.5 | 4,400 | 11 | claude vs chatgpt vs gemini |
| 137.3 | 2,900 | 2 | chatgpt vs grok |
| 136.0 | 9,900 | 4 | perplexity vs chatgpt |
| 134.7 | 12,100 | 7 | grok vs chatgpt |
| 134.7 | 2,400 | 4 | protonvpn vs nordvpn |
| 134.6 | 6,600 | 3 | copilot vs chatgpt |
| 133.9 | 1,900 | 0 | slack vs teams |
| 131.7 | 1,300 | 1 | google meet vs zoom |
| 128.6 | 3,600 | 2 | obsidian vs notion |
| 128.0 | 2,400 | 0 | notion vs obsidian |
| 126.8 | 720 | 0 | zoom vs google meet |
| 125.7 | 1,600 | 5 | asana vs monday |

(Full 191-row list in the JSON; long-tail `chatgpt vs X` variants dominate — high volume, low KD.)

## Key read
- **The AI-tool comparison cluster (chatgpt/claude/gemini/grok/copilot/perplexity) is the highest-value, lowest-difficulty seam** — KD 2–11 against 3k–33k/mo volume. This is exactly the LLM head-to-head space aversusb.net already targets.
- **Caveat — these are RAW, not gap-deduped.** Many top hits (`claude vs chatgpt`, `chatgpt vs gemini`) almost certainly already have a `/compare/` page. Before the August sprint, dedupe this list against the live `/compare/*` corpus (or the prod DB slug set) and keep only the *un-covered* mid-tail. That dedupe is the first August-sprint task, not a blocker on this seed.
- **Authority caveat (from today's DAN-1176 T+16 remeasure):** new `/compare/` pages broaden the 11–20 striking-distance bucket (10→23 since 06-12) but are **not crossing into top 10** — the binding constraint is off-page DR/backlinks, not more content. New August pages should ship *with* a backlink/amplification plan (DAN-419 social lane + AlternativeTo DR~90 wins via DAN-1518/DAN-1526), or they will stall at pos 11–20 like the current cohort.

## Status
This is the **DataForSEO seed half** of DAN-1507 (un-gated by DAN-419). The Quora/Reddit outreach half remains blocked on DAN-419 social credentials. Hand to CML for August-sprint prioritization after gap-dedup.
