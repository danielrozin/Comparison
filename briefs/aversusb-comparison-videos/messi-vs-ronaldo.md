# Brief #1 — Messi vs Ronaldo

## 1. Slug & target page

- **Slug:** `messi-vs-ronaldo`
- **Target URL:** `https://www.aversusb.net/compare/messi-vs-ronaldo`
- **Primary keyword:** `messi vs ronaldo`
- **Secondary keywords:** `ronaldo vs messi`, `goat debate`, `ballon d'or`, `cristiano ronaldo`, `lionel messi`, `who is better messi or ronaldo`, `messi or ronaldo 2026`
- **Why this page:** Best-estimate top-1 global X-vs-Y query in our inventory. Multilingual demand (English, Spanish, Portuguese, Arabic), evergreen, low-seasonality. Dwell-time uplift from a 14s embed on this page is high-leverage because the page already ranks for a query that buyers (gamblers, sports merch, streaming subs) target with paid search → an embed lifts CTR which lifts position which compounds. Real GSC data needed from [DAN-385](/DAN/issues/DAN-385) to validate position-on-page-2 hypothesis.

## 2. Format spec (Remotion)

- **Composition:** `ComparisonVideoV2` (6 stats fits cleanly)
- **Resolution:** 1080×1920
- **Duration:** `45 + 6*45 + 60 = 375 frames` → **12.5 seconds at 30 fps**

## 3. ComparisonVideoProps payload

> Already exists at `remotion/data/messi-vs-ronaldo.json`. The brief owns the producer-facing wrapper; the data file is the source of truth for the renderer.

```json
{
  "slug": "messi-vs-ronaldo",
  "title": "Messi vs Ronaldo",
  "entityA": "Messi",
  "entityB": "Ronaldo",
  "category": "SOCCER",
  "stats": [
    { "label": "Ballon d'Or",      "valueA": "8",        "valueB": "5",        "winner": "a"   },
    { "label": "Career Goals",     "valueA": "838",      "valueB": "899",      "winner": "b"   },
    { "label": "Career Assists",   "valueA": "369",      "valueB": "262",      "winner": "a"   },
    { "label": "UCL Titles",       "valueA": "4",        "valueB": "5",        "winner": "b"   },
    { "label": "World Cup",        "valueA": "1",        "valueB": "0",        "winner": "a"   },
    { "label": "Intl Goals",       "valueA": "112",      "valueB": "135",      "winner": "b"   }
  ],
  "verdict": "Both are all-time greats. Messi edges Ballon d'Ors and the 2022 World Cup; Ronaldo holds Champions League and international scoring. The 'GOAT' depends on what you weight."
}
```

> **Note for engineering:** `entityA`/`entityB` shortened from the live data file (`Lionel Messi`/`Cristiano Ronaldo`) to fit the 14-char avatar circle. Either truncate at render time or update the data file. Verdict shortened to 178 chars (within 180 cap).

## 4. 90-second alternate cut

| Time | Beat | On screen | VO |
|------|------|-----------|-----|
| 0–3s | Hook | Both faces side-by-side, large "VS" | "Messi or Ronaldo? The numbers settle the GOAT debate." |
| 3–10s | Problem framing | "GOAT" headline + Ballon d'Or trophy graphic | "Two players. Two decades. Eight Ballon d'Ors versus five — and that's just where it starts." |
| 10–25s | Criteria | List of 6 criteria, animated in | "We compared trophy count, scoring output, playmaking, Champions League, World Cup, and international goals." |
| 25–70s | Side-by-side | Stat-by-stat reveal | (see VO script section 5 — long form) |
| 70–85s | Verdict | Both players, verdict text | "Messi edges peak ability and the 2022 World Cup. Ronaldo wins on longevity, Champions League, and international scoring." |
| 85–90s | CTA | URL + end-screen | "Full breakdown at a-versus-b dot net slash messi-vs-ronaldo." |

## 5. Voiceover script

### Short-form (12.5s — matches Remotion video)

```
Messi or Ronaldo?
The numbers, in fifteen seconds.
Ballon d'Ors: eight to five. Messi.
Career goals: 838 to 899. Ronaldo.
Assists: 369 to 262. Messi.
Champions League: four to five. Ronaldo.
World Cup: one to zero. Messi.
International goals: 112 to 135. Ronaldo.
Three-three. The GOAT depends on what you weight.
Full comparison at a-versus-b dot net.
```

Word count: 65 words ≈ 13 seconds at 175 wpm — fits the 12.5s render with a tight closing tail.

### Long-form 90-second cut

```
[0:00] Messi or Ronaldo? The numbers settle the GOAT debate.
[0:03] Two players. Two decades of dominance. Eight Ballon d'Ors versus five — and that's just where the comparison starts. [pause 0.4s]
[0:10] We compared six things: trophy count, scoring output, playmaking, Champions League, World Cup, and international goals.
[0:25] First, the Ballon d'Or — football's individual award. Messi has eight. Ronaldo has five. [emphasis] Messi wins.
[0:32] Career goals. Ronaldo: 899. Messi: 838. A 61-goal gap built over 22 seasons. Ronaldo wins.
[0:39] Assists. Messi: 369. Ronaldo: 262. Messi creates more than he scores — 107 more assists. Messi wins.
[0:46] Champions League titles. Ronaldo: five. Messi: four. Ronaldo holds the European edge. Ronaldo wins.
[0:53] World Cup. Messi has one — the 2022 final. Ronaldo has zero. Messi wins.
[1:00] International goals. Ronaldo: 135 for Portugal. Messi: 112 for Argentina. Ronaldo wins. [pause 0.5s]
[1:10] Final score: three to three.
[1:12] So who's the GOAT? [pause 0.3s] Messi edges peak ability — the dribbling, the playmaking, the 2022 final. Ronaldo wins on longevity, Champions League volume, and international scoring.
[1:25] The honest answer: it depends on what you weight. [pause 0.4s]
[1:30] Full breakdown — every stat, every season — at a-versus-b dot net slash messi-vs-ronaldo.
```

Voice direction: confident, neutral. Don't pick a side — the page's authority comes from being the unbiased adjudicator. Pace 160 wpm. Slight emphasis on each "wins" call.

## 6. Shot list / on-screen-text plan

| Shot # | Frame range | What's shown | Source / asset |
|--------|-------------|--------------|----------------|
| 1 | 0–45 | Title card: "Messi VS Ronaldo" with SOCCER badge | Auto from props |
| 2 | 45–90 | Stat card: Ballon d'Or — "8" vs "5", Messi side highlighted gold | Auto |
| 3 | 90–135 | Stat card: Career Goals — "838" vs "899", Ronaldo side highlighted | Auto |
| 4 | 135–180 | Stat card: Career Assists — "369" vs "262", Messi highlighted | Auto |
| 5 | 180–225 | Stat card: UCL Titles — "4" vs "5", Ronaldo highlighted | Auto |
| 6 | 225–270 | Stat card: World Cup — "1" vs "0", Messi highlighted | Auto |
| 7 | 270–315 | Stat card: Intl Goals — "112" vs "135", Ronaldo highlighted | Auto |
| 8 | 315–375 | Verdict card | Auto from props.verdict |

### B-roll callouts

- None required for short-form. The auto-generated stat cards plus VO carry it.
- For the 90-second cut: licensed match footage is rights-heavy and risky on YouTube. Recommend stylized stat-graphic B-roll only, generated via Remotion compositions.

## 7. YouTube SEO metadata block

```yaml
youtube:
  title: "Messi vs Ronaldo: The GOAT Debate Settled by Numbers (2026)"   # 58 chars, primary keyword leads
  description: |
    Messi or Ronaldo? We compared every measurable stat that defines the GOAT debate.
    Full breakdown: https://www.aversusb.net/compare/messi-vs-ronaldo

    Stats covered:
    • Ballon d'Or: 8 vs 5 → Messi wins
    • Career Goals: 838 vs 899 → Ronaldo wins
    • Career Assists: 369 vs 262 → Messi wins
    • Champions League Titles: 4 vs 5 → Ronaldo wins
    • World Cup Titles: 1 vs 0 → Messi wins
    • International Goals: 112 vs 135 → Ronaldo wins

    Final score: 3-3. The GOAT depends on what you weight — peak ability or longevity.

    Verdict: Both are all-time greats. Messi edges Ballon d'Ors and the 2022 World Cup; Ronaldo holds Champions League and international scoring.

    🔗 Full comparison + sources: https://www.aversusb.net/compare/messi-vs-ronaldo
    📊 More sports comparisons: https://www.aversusb.net/category/sports

    Subscribe for more head-to-head comparisons.

    #MessiVsRonaldo #GOAT #Football #Soccer #BallondOr
  tags:
    - "messi vs ronaldo"
    - "ronaldo vs messi"
    - "messi or ronaldo"
    - "who is better messi or ronaldo"
    - "lionel messi"
    - "cristiano ronaldo"
    - "goat debate"
    - "ballon d'or"
    - "best soccer player"
    - "best football player"
    - "messi vs ronaldo 2026"
    - "soccer comparison"
    - "football comparison"
    - "champions league"
    - "world cup 2022"
  endScreenLinkUrl: "https://www.aversusb.net/compare/messi-vs-ronaldo"
  thumbnail:
    composition: "Messi headshot left, large gold 'VS' centered, Ronaldo headshot right; Ballon d'Or trophy graphic faded behind centerline"
    overlayText: "MESSI vs RONALDO"
    style: "high contrast, dark navy background, gold accents, no other faces; bold sans-serif"
    aspectRatio: "16:9 (1280×720) for standard upload, 9:16 (1080×1920) for Shorts auto-generated thumbnail"
  category: "Sports"
  language: "en"
  madeForKids: false
```

## 8. Strategic notes (QC)

- **Winner distribution:** A=3, B=3, tie=0. Clean 50/50 — no manipulation feel. ✅
- **First stat is decision-driving:** Ballon d'Or is *the* individual award and the most-cited GOAT-debate proxy. ✅
- **Verdict echoes on-page text:** Page verdict ends "Messi edges it for overall ability and the 2022 World Cup, while Ronaldo's longevity and Champions League record is unmatched." Brief verdict mirrors structure. ✅
- **Numerals over adjectives:** All 6 stat values are pure numerals. ✅
- **Primary keyword position:** "Messi vs Ronaldo" is the first 3 words of the YouTube title. ✅
- **Target URL is real:** `https://www.aversusb.net/compare/messi-vs-ronaldo` — confirmed real slug (file at `remotion/data/messi-vs-ronaldo.json`). Sitemap presence to be verified on upload.

## 9. Acceptance checklist (Producer / Engineering)

- [ ] JSON props at `remotion/data/messi-vs-ronaldo.json` validates against `ComparisonVideoProps` (already exists)
- [ ] Update `entityA`/`entityB` to short forms ("Messi"/"Ronaldo") OR have the renderer truncate to 14 chars
- [ ] `node remotion/render-video.mjs messi-vs-ronaldo` renders without errors (post-[DAN-384](/DAN/issues/DAN-384))
- [ ] VO audio rendered via `node scripts/elevenlabs-tts.mjs messi-vs-ronaldo`
- [ ] Output MP4 is 1080×1920, ~12.5s, ≤25 MB
- [ ] YouTube upload uses metadata block above
- [ ] End-screen link points to `https://www.aversusb.net/compare/messi-vs-ronaldo`
- [ ] `YouTubeVideo` row created and embedded on the page
