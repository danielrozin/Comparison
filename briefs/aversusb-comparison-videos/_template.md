# Comparison Video Brief — Template

> Use this template for every aversusb.net comparison-video brief. Fill in every section.
> Output of this brief = a renderable video via `node remotion/render-video.mjs <slug>` (post-DAN-384) plus a YouTube upload metadata block.

---

## 1. Slug & target page

- **Slug:** `<entity-a>-vs-<entity-b>` (must match the live comparison page slug at `aversusb.net/compare/<slug>`)
- **Target URL:** `https://www.aversusb.net/compare/<slug>`
- **Primary keyword:** `<entity A> vs <entity B>` (the head term — must be the FIRST words of the YouTube title)
- **Secondary keywords:** comma-separated list (used in YouTube tags + description)
- **Why this page:** GSC impressions, avg position, CTR-uplift hypothesis (or "best estimate" + reasoning if SEO data unavailable)

## 2. Format spec (Remotion)

- **Composition:** `ComparisonVideoV2` (or `ComparisonVideoXL` for 8+ stats — confirm with engineering)
- **Resolution:** 1080×1920 (vertical, social-native — TikTok / Reels / Shorts / YouTube Shorts)
- **Frame rate:** 30 fps
- **Duration formula:** `45 + N*45 + 60` frames where N = stat count → about `(2.5s + N*1.5s + 2s)` seconds
  - 5 stats → ~12s • 6 stats → ~13.5s • 7 stats → ~15s • 8 stats → ~16.5s
  - Hard cap at 8 stats. Anything longer pushes past short-form attention drop-off.

## 3. ComparisonVideoProps payload (the actual deployable artifact)

Save this block as a sibling JSON file at `remotion/data/<slug>.json`. Engineering reads it from there per DAN-384.

```json
{
  "slug": "<slug>",
  "title": "<short-page-title-fits-on-card>",
  "entityA": "<≤14 chars — fits the avatar circle>",
  "entityB": "<≤14 chars>",
  "category": "<UPPERCASE single word, e.g. VACUUMS, AI, PHONES>",
  "stats": [
    { "label": "<≤14 chars>", "valueA": "<≤12 chars, prefer numerals>", "valueB": "<≤12 chars>", "winner": "a | b | tie" }
  ],
  "verdict": "<1–2 sentences, ≤180 chars, gives the buyer the WHY in plain English>"
}
```

### Stat selection rules (the brief lives or dies here)

1. **Order by decision weight.** Lead with what changes the buyer's mind (price, performance, headline metric). Bury detail (warranty, materials) at the end. Viewers drop after stat 5 — front-load.
2. **Mix winners.** A 6/0 split feels manipulated. Aim for 60/40 or 50/50 across A / B / tie. If reality really is one-sided, lead the verdict with that ("X wins on every measurable axis except price") — don't hide it.
3. **Numerals beat adjectives.** `"$599"` > `"Premium"`. `"60 min"` > `"Long-lasting"`. `"4 titles"` > `"Decorated"`. The eye reads numbers in 0.4s; adjectives take 1.2s and don't anchor memory.
4. **5–7 stats sweet spot.** 4 feels thin; 8+ exceeds attention budget for short-form.

## 4. 90-second alternate cut (for YouTube long-form / paid-ad cutdowns)

If the same brief gets re-cut for a 90-second long-form video (post-roll search, embed-on-page), use this beat structure:

| Time | Beat | What's on screen | What the VO says |
|------|------|------------------|------------------|
| 0–3s | **Hook** | Both products side-by-side, large "VS" | "<Entity A> or <Entity B>? Here's the answer in 90 seconds." |
| 3–10s | **Problem framing** | Top stat the buyer cares about | "If you only care about <criterion>, this is the only number that matters." |
| 10–25s | **Criteria** | List of 5–7 criteria, animated in | "We compared <list criteria, in order>." |
| 25–70s | **Side-by-side** | Stat-by-stat reveal, winner highlight | One sentence per stat. "Price: A is $X, B is $Y. <Winner> wins." |
| 70–85s | **Verdict** | Verdict card, both products | The verdict line, said slowly, with one sentence of nuance. |
| 85–90s | **CTA** | URL + end-screen target | "Full comparison at aversusb.net/<slug>." |

## 5. Voiceover script (for ElevenLabs TTS via `scripts/elevenlabs-tts.mjs`)

> Voice: pick one — `Adam` (authoritative-male), `Rachel` (clear-female), or whatever the repo's default voice ID is configured to.
> Pace: 165–180 words/min for short-form (12–16s), 150–160 wpm for the 90s cut.
> Punctuation matters for TTS — use commas for natural breath, periods for hard stops.

### Short-form (matches Remotion video duration)

```
<entity A>, or <entity B>?
<one-line setup of the headline criterion>.
<Stat 1 label>: <A value> versus <B value>. <Winner> wins.
<Stat 2 label>: <A value> versus <B value>. <Winner> wins.
<Stat 3 label>: <A value> versus <B value>. <Winner> wins.
<Stat 4 label>: <A value> versus <B value>. <Winner> wins.
<Stat 5 label>: <A value> versus <B value>. <Winner> wins.
<Verdict line.>
Full breakdown at a-versus-b dot net.
```

### Long-form 90-second cut

Write the full 90s script here, beat-aligned to the table in section 4. Include literal pacing markers like `[pause 0.5s]`, `[emphasis]`, `[soft]` if the chosen TTS voice supports them.

## 6. Shot list / on-screen-text plan

> The Remotion composition handles most shots automatically. This section catches the *exceptions*: any custom B-roll, manual on-screen text overrides, or non-default visuals.

| Shot # | Frame range | What's shown | Source / asset |
|--------|-------------|--------------|----------------|
| 1 | 0–45 | Title card: `<entityA> VS <entityB>` with category badge | Auto from props |
| 2..N+1 | 45..(45+N\*45) | Stat cards, one per stat, winner highlighted | Auto from props.stats |
| N+2 | (45+N\*45)..(45+N\*45+60) | Verdict card | Auto from props.verdict |
| Custom | <if needed> | <e.g. brand logo overlay, B-roll> | <asset path or "needs to be sourced"> |

### B-roll callouts (only if needed)

- `<asset description>` — needed for `<which beat>` — source: `<URL or "Engineering to source">`
- Leave empty if the auto-generated stat cards are sufficient (almost always are for short-form).

## 7. YouTube SEO metadata block

```yaml
youtube:
  title: "<entity A> vs <entity B>: Which is Better in 2026?"   # ≤60 chars, primary keyword FIRST
  description: |
    Quick comparison of <entityA> vs <entityB>. Full breakdown: https://www.aversusb.net/compare/<slug>

    Stats covered:
    • <Stat 1 label>: <A> vs <B> → <winner> wins
    • <Stat 2 label>: <A> vs <B> → <winner> wins
    • <Stat 3 label>: <A> vs <B> → <winner> wins
    • <Stat 4 label>: <A> vs <B> → <winner> wins
    • <Stat 5 label>: <A> vs <B> → <winner> wins

    Verdict: <verdict>

    🔗 Full comparison + sources: https://www.aversusb.net/compare/<slug>
    📊 More comparisons: https://www.aversusb.net

    Subscribe for more product comparisons and head-to-heads.

    #<entityA-no-spaces> #<entityB-no-spaces> #comparison
  tags:
    # Tier 1 — head terms (highest weight in YouTube algorithm)
    - "<entityA> vs <entityB>"
    - "<entityB> vs <entityA>"
    - "<entityA>"
    - "<entityB>"
    # Tier 2 — category + intent
    - "<category>"
    - "comparison"
    - "which is better"
    - "2026"
    # Tier 3 — long-tail
    - "<entityA> vs <entityB> 2026"
    - "best <category>"
  endScreenLinkUrl: "https://www.aversusb.net/compare/<slug>"
  thumbnail:
    composition: "<entityA> image left, large 'VS' centered, <entityB> image right"
    overlayText: "<entityA> VS <entityB>"
    style: "high contrast, bright background, no faces if possible (CTR uplift)"
    aspectRatio: "16:9 (1280×720) for standard, 9:16 (1080×1920) for Shorts"
  category: "<YouTube category — e.g. Science & Technology, Sports, Gaming, Entertainment>"
  language: "en"
  madeForKids: false
```

## 8. Strategic notes (the QC section — fill before submitting)

- **Winner distribution:** A=`<n>`, B=`<n>`, tie=`<n>` — confirm not 6/0 (manipulation feel).
- **First stat is decision-driving:** yes/no — if no, reorder.
- **Verdict echoes on-page text:** yes/no — Google E-E-A-T signal benefits when video VO matches the page verdict.
- **Numerals over adjectives:** count of numeric values vs adjectives in stat cards. Aim ≥4 numeric of 5–7 stats.
- **Primary keyword position in YouTube title:** must be the first 1–6 words.
- **Target URL is real and indexed:** confirm `https://www.aversusb.net/compare/<slug>` returns 200 and is in the sitemap.

## 9. Acceptance checklist (Producer / Engineering)

Before marking the brief shipped:

- [ ] JSON props file lives at `remotion/data/<slug>.json` and validates against `ComparisonVideoProps`
- [ ] `node remotion/render-video.mjs <slug>` renders without errors (post-DAN-384)
- [ ] VO audio rendered via `node scripts/elevenlabs-tts.mjs <slug>` (or equivalent)
- [ ] Output MP4 is 1080×1920, ≤20 seconds, ≤25 MB
- [ ] YouTube upload uses the metadata block in section 7 verbatim
- [ ] End-screen link points to `https://www.aversusb.net/compare/<slug>`
- [ ] `YouTubeVideo` DB row created and linked to the comparison page (post-engineering)
- [ ] Embed visible on the page within 24h of upload
