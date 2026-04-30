# aversusb-comparison-videos — Brief Index

Producer-facing briefs for the YouTube/Shorts/TikTok/Reels comparison videos that embed on each `aversusb.net/compare/<slug>` page. Drives on-page dwell time and YouTube-search rank surface backlinking the page (per [DAN-381](/DAN/issues/DAN-381) and the SEO-first directive [DAN-346](/DAN/issues/DAN-346)).

## Directory layout

- `_template.md` — the canonical brief format. Every new brief copies this.
- `<slug>.md` — filled brief: VO script, shot list, YouTube SEO metadata, strategic notes.
- The Remotion props payload lives at `../../remotion/data/<slug>.json` (already exists for current slugs).

## Production pipeline (current state)

```
1. Brief author (Video Editor)        → writes briefs/aversusb-comparison-videos/<slug>.md
2. Comparison data (already in repo)  → remotion/data/<slug>.json (matches ComparisonVideoProps)
3. Render video (post-DAN-384)        → node remotion/render-video.mjs <slug>
                                          → public/videos/<slug>.mp4
4. Render VO                          → node scripts/elevenlabs-tts.mjs <slug>
                                          → public/audio/<slug>.mp3 (or merged into mp4)
5. Upload to YouTube + populate       → DB YouTubeVideo row links back to comparison page
   YouTubeVideo DB row
6. Embed renders on page              → <YouTubeVideos> component (already exists)
```

DAN-384 is the engineering issue to wire DB → Remotion `inputProps` so step 3 reads per-slug data instead of the hardcoded demo. Until that lands, briefs are queued, not deployable.

## Filled briefs in this batch

| # | Slug | Primary keyword | Why picked |
|---|------|-----------------|------------|
| 1 | [`messi-vs-ronaldo`](./messi-vs-ronaldo.md) | `messi vs ronaldo` | Top-3 global X-vs-Y query (sports, evergreen, multilingual) |
| 2 | [`iphone-17-vs-samsung-s26`](./iphone-17-vs-samsung-s26.md) | `iphone 17 vs samsung s26` | 2026 product cycle peak, high commercial intent / CPC |
| 3 | [`chatgpt-vs-claude`](./chatgpt-vs-claude.md) | `chatgpt vs claude` | Surging AI query, fits DAN-374 page-2-wins play |

Picks were made on best-estimate global search demand — DAN-385 (SEO Specialist GSC list) had not landed at brief time. When DAN-385 lands, picks 4–10 will be ranked off real GSC × CTR-uplift data, not estimate.

## Next batch

After this batch ships and DAN-385 lands, briefs 4–10 will be filed as child issues under DAN-381 in one batch.
