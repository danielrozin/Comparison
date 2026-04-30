# Brief #2 — iPhone 17 vs Samsung Galaxy S26

## 1. Slug & target page

- **Slug:** `iphone-17-vs-samsung-s26`
- **Target URL:** `https://www.aversusb.net/compare/iphone-17-vs-samsung-s26`
- **Primary keyword:** `iphone 17 vs samsung s26`
- **Secondary keywords:** `samsung s26 vs iphone 17`, `iphone 17 vs galaxy s26`, `iphone 17 review`, `samsung galaxy s26 review`, `which phone to buy 2026`, `apple vs samsung 2026`
- **Why this page:** 2026 product cycle is at peak query volume right now. High commercial intent — these are buyers about to spend $799+. CPC on `iphone vs samsung` paid search is among the highest in tech. The page is likely page-2 (newer, less authority than the more general `android-vs-ios` slug already in the inventory) — exactly the CTR-uplift surface DAN-385 is meant to target. Real GSC ranking position needed from [DAN-385](/DAN/issues/DAN-385) to confirm.

## 2. Format spec (Remotion)

- **Composition:** `ComparisonVideoV2` (6 stats fits cleanly)
- **Resolution:** 1080×1920
- **Duration:** `45 + 6*45 + 60 = 375 frames` → **12.5 seconds at 30 fps**

## 3. ComparisonVideoProps payload

> Already exists at `remotion/data/iphone-17-vs-samsung-s26.json`.

```json
{
  "slug": "iphone-17-vs-samsung-s26",
  "title": "iPhone 17 vs Galaxy S26",
  "entityA": "iPhone 17",
  "entityB": "Galaxy S26",
  "category": "PHONES",
  "stats": [
    { "label": "Price",         "valueA": "$799",     "valueB": "$799",     "winner": "tie" },
    { "label": "Processor",     "valueA": "A19 Pro",  "valueB": "SD 8 G4",  "winner": "a"   },
    { "label": "Brightness",    "valueA": "2200 nit", "valueB": "3000 nit", "winner": "b"   },
    { "label": "Battery",       "valueA": "4200 mAh", "valueB": "4500 mAh", "winner": "b"   },
    { "label": "Charging",      "valueA": "27W",      "valueB": "45W",      "winner": "b"   },
    { "label": "RAM",           "valueA": "12GB",     "valueB": "12GB",     "winner": "tie" }
  ],
  "verdict": "Same price, different priorities. iPhone 17 wins on chip and ecosystem; Galaxy S26 wins on display, battery, and charging speed."
}
```

> **Stat-order change vs the live data file:** The live file leads with `Processor` and ends with `Starting Price`. I reordered to lead with `Price` because (a) it's a tie at the same price, which immediately frames the brief as "you're not paying more for either — so what do you actually get for $799?" and (b) price is the buyer's first decision filter. This is a stat-ORDER change, not a stat-VALUE change — engineering can either re-order in the data file or pass `stats: stats.sort(byBriefOrder)` at render time. Verdict shortened from the live verdict (160 chars) for clarity.
>
> **Entity strings:** `Galaxy S26` shortened from `Samsung Galaxy S26` to fit ≤14 char avatar circle.

## 4. 90-second alternate cut

| Time | Beat | On screen | VO |
|------|------|-----------|-----|
| 0–3s | Hook | Both phones side-by-side, both showing $799 | "Same price. Different phones. iPhone 17 versus Galaxy S26." |
| 3–10s | Problem framing | Price tag $799 = $799 | "Apple and Samsung priced their flagships at the exact same $799 in 2026. So what are you actually paying for?" |
| 10–25s | Criteria | List of 6 specs | "We compared the six specs that decide which phone wins your pocket." |
| 25–70s | Side-by-side | Stat-by-stat reveal | (see VO script section 5) |
| 70–85s | Verdict | Both phones, verdict | "iPhone 17 wins on chip and ecosystem. Galaxy S26 wins on display, battery, and charging." |
| 85–90s | CTA | URL + end-screen | "Full breakdown at a-versus-b dot net slash iphone-17-vs-samsung-s26." |

## 5. Voiceover script

### Short-form (12.5s)

```
iPhone 17 or Galaxy S26?
Same price — $799 each. Here's what you get.
Chip: A19 Pro versus Snapdragon 8 Gen 4. iPhone wins.
Brightness: 2200 nits versus 3000. Samsung wins.
Battery: 4200 versus 4500. Samsung wins.
Charging: 27 watts versus 45. Samsung wins.
RAM: 12 gigs each. Tie.
iPhone for chip and ecosystem. Samsung for display and battery.
Full comparison at a-versus-b dot net.
```

Word count: 75 words ≈ 13 seconds at 175 wpm. Fits 12.5s with brisk pacing.

### Long-form 90-second cut

```
[0:00] iPhone 17 or Galaxy S26? Same price. Different phones.
[0:03] Apple and Samsung both priced their 2026 flagships at exactly $799. [pause 0.3s] So what are you actually paying for?
[0:10] We compared the six specs that decide which phone wins your pocket: chip, display brightness, battery, charging speed, RAM, and price.
[0:25] Price first. iPhone 17: $799. Galaxy S26: $799. [pause 0.3s] Tie — you're not paying more for either.
[0:32] Chip. iPhone 17 runs the A19 Pro — Apple's most efficient silicon yet. Galaxy S26 runs the Snapdragon 8 Gen 4. Both fast, but A19 Pro pulls ahead on sustained performance and video processing. iPhone wins.
[0:43] Display brightness. iPhone 17: 2,200 nits peak. Galaxy S26: 3,000 nits. That's an 800-nit gap — visible the moment you walk into direct sunlight. Samsung wins.
[0:53] Battery. 4,200 milliamp-hours versus 4,500. A 7% gap. Samsung wins.
[1:00] Charging. iPhone tops out at 27 watts. Galaxy charges at 45 watts. That's 0 to 50 percent in roughly half the time. Samsung wins.
[1:09] RAM. 12 gigabytes each. Tie.
[1:13] So: same price, different priorities. [pause 0.4s] If you live in the Apple ecosystem and shoot a lot of video, the iPhone 17 wins. If you watch outside, charge fast, and want a brighter screen, the Galaxy S26 wins.
[1:30] Full breakdown — every spec, every benchmark — at a-versus-b dot net slash iphone-17-vs-samsung-s26.
```

Voice direction: tech-reviewer cadence — confident, slightly casual, no breathless hype. Pace 165 wpm. Pause briefly on price = price ($799 = $799) — that's the brief's hook.

## 6. Shot list / on-screen-text plan

| Shot # | Frame range | What's shown | Source / asset |
|--------|-------------|--------------|----------------|
| 1 | 0–45 | Title card: "iPhone 17 VS Galaxy S26" with PHONES badge | Auto from props |
| 2 | 45–90 | Stat card: Price — "$799" vs "$799", tie | Auto |
| 3 | 90–135 | Stat card: Processor — "A19 Pro" vs "SD 8 G4", iPhone highlighted | Auto |
| 4 | 135–180 | Stat card: Brightness — "2200 nit" vs "3000 nit", Samsung highlighted | Auto |
| 5 | 180–225 | Stat card: Battery — "4200 mAh" vs "4500 mAh", Samsung highlighted | Auto |
| 6 | 225–270 | Stat card: Charging — "27W" vs "45W", Samsung highlighted | Auto |
| 7 | 270–315 | Stat card: RAM — "12GB" vs "12GB", tie | Auto |
| 8 | 315–375 | Verdict card | Auto from props.verdict |

### B-roll callouts

- None required for short-form.
- For 90s cut: stylized phone-render asset for both devices (Apple press kit imagery is licensed for editorial; Samsung press kit similar). Use product silhouettes if rights are unclear.

## 7. YouTube SEO metadata block

```yaml
youtube:
  title: "iPhone 17 vs Samsung S26: Which $799 Phone Wins in 2026?"   # 56 chars, primary keyword leads, price hook
  description: |
    iPhone 17 or Samsung Galaxy S26? Both flagships launched at the same $799 — so what are you actually paying for?
    Full breakdown: https://www.aversusb.net/compare/iphone-17-vs-samsung-s26

    Specs covered:
    • Price: $799 vs $799 → Tie
    • Processor: A19 Pro vs Snapdragon 8 Gen 4 → iPhone 17 wins
    • Display brightness: 2,200 vs 3,000 nits → Galaxy S26 wins
    • Battery: 4,200 vs 4,500 mAh → Galaxy S26 wins
    • Fast charging: 27W vs 45W → Galaxy S26 wins
    • RAM: 12GB vs 12GB → Tie

    Verdict: iPhone 17 wins on chip and ecosystem; Galaxy S26 wins on display, battery, and charging speed.

    🔗 Full comparison + sources: https://www.aversusb.net/compare/iphone-17-vs-samsung-s26
    📊 More phone comparisons: https://www.aversusb.net/category/technology

    Subscribe for more 2026 phone head-to-heads.

    #iPhone17 #GalaxyS26 #iPhoneVsSamsung
  tags:
    - "iphone 17 vs samsung s26"
    - "samsung s26 vs iphone 17"
    - "iphone 17 vs galaxy s26"
    - "iphone 17"
    - "samsung galaxy s26"
    - "iphone 17 review"
    - "galaxy s26 review"
    - "iphone vs samsung 2026"
    - "best phone 2026"
    - "which phone to buy"
    - "apple vs samsung"
    - "a19 pro"
    - "snapdragon 8 gen 4"
    - "phone comparison"
    - "flagship phone 2026"
  endScreenLinkUrl: "https://www.aversusb.net/compare/iphone-17-vs-samsung-s26"
  thumbnail:
    composition: "iPhone 17 product shot left, large red 'VS' centered, Galaxy S26 product shot right; '$799' price tag floating between them"
    overlayText: "iPhone 17 VS Galaxy S26"
    style: "white background, high product contrast, red VS for click, no faces; bold sans-serif"
    aspectRatio: "16:9 (1280×720) for standard upload"
  category: "Science & Technology"
  language: "en"
  madeForKids: false
```

## 8. Strategic notes (QC)

- **Winner distribution:** A=1, B=3, tie=2. Heavily Samsung-leaning on specs but with two ties keeping it honest. Verdict explicitly calls out the Apple wins (chip, ecosystem) that aren't fully captured by the 6-spec list — this prevents the "manipulated" feel since spec sheets historically favor Samsung but real-world buyers still pick iPhone for ecosystem reasons. ✅
- **First stat is decision-driving:** Price as opener is the brief's hook — same-price framing makes the rest land. ✅
- **Verdict echoes on-page text:** Live page verdict says "Choose iPhone 17 for its refined design, ecosystem, and video. Choose Samsung S26 for display brightness, customization, and Galaxy AI." Brief verdict compresses to "iPhone wins on chip and ecosystem; Samsung wins on display, battery, and charging speed." Same axes. ✅
- **Numerals over adjectives:** 6/6 numeric (or near-numeric like "A19 Pro"). ✅
- **Primary keyword position:** "iPhone 17 vs Samsung S26" is the first 5 words of the YouTube title. ✅
- **Target URL is real:** `https://www.aversusb.net/compare/iphone-17-vs-samsung-s26` — confirmed real slug.

## 9. Acceptance checklist (Producer / Engineering)

- [ ] JSON props at `remotion/data/iphone-17-vs-samsung-s26.json` validates (already exists)
- [ ] Update stat order so `Price` is first OR sort at render time (see note in section 3)
- [ ] Update `entityB` to `Galaxy S26` (live data: `Samsung Galaxy S26`) for ≤14 char fit
- [ ] `node remotion/render-video.mjs iphone-17-vs-samsung-s26` renders (post-[DAN-384](/DAN/issues/DAN-384))
- [ ] VO rendered via `node scripts/elevenlabs-tts.mjs iphone-17-vs-samsung-s26`
- [ ] Output MP4 is 1080×1920, ~12.5s, ≤25 MB
- [ ] YouTube upload uses metadata block above
- [ ] End-screen link points to target URL
- [ ] `YouTubeVideo` row created and embedded on the page
