# Brief #3 — ChatGPT vs Claude

## 1. Slug & target page

- **Slug:** `chatgpt-vs-claude`
- **Target URL:** `https://www.aversusb.net/compare/chatgpt-vs-claude`
- **Primary keyword:** `chatgpt vs claude`
- **Secondary keywords:** `claude vs chatgpt`, `chatgpt vs claude 4`, `which is better chatgpt or claude`, `claude 4 opus vs gpt-5`, `best ai for coding`, `best ai chatbot 2026`
- **Why this page:** Surging 2026 query — Anthropic's Claude releases (4.6, 4.7) have driven a step-change in "vs" search volume. Coding-buyer intent (developers comparing for daily use) is the highest-value sub-segment, and Claude's coding edge is the top reason to switch. Page is almost certainly page-2 (the AI/SaaS SERP is dominated by Reddit, OpenAI's own pages, and Anthropic's own pages — our comparison page sits below). Embed-driven CTR uplift is high-leverage here. Real GSC ranking position needed from [DAN-385](/DAN/issues/DAN-385) to confirm.

## 2. Format spec (Remotion)

- **Composition:** `ComparisonVideoXL` recommended — the live data file has 8 stats. Per the format spec, 8 is the cap.
  - If `ComparisonVideoXL` doesn't render reliably for 8 stats, drop to 6 stats (use the trimmed list in section 3) and `ComparisonVideoV2`.
- **Resolution:** 1080×1920
- **Duration (8 stats):** `45 + 8*45 + 60 = 465 frames` → **15.5 seconds at 30 fps**
- **Duration (trimmed 6 stats):** `45 + 6*45 + 60 = 375 frames` → **12.5 seconds**

## 3. ComparisonVideoProps payload

> Live data file at `remotion/data/chatgpt-vs-claude.json` has 8 stats but most values are *adjectives* ("Strong coding abilities") — these don't anchor in 1.5 seconds of short-form. Below is a **tightened** payload using the same comparative reality but with numerals or short discrete values that read at a glance. Engineering should update the data file or accept the brief's payload as the override at render time.

### Recommended (6-stat trimmed, all numeric/discrete)

```json
{
  "slug": "chatgpt-vs-claude",
  "title": "ChatGPT vs Claude",
  "entityA": "ChatGPT",
  "entityB": "Claude",
  "category": "AI",
  "stats": [
    { "label": "Latest Model", "valueA": "GPT-5.4",     "valueB": "Claude 4.7",   "winner": "tie" },
    { "label": "Coding (SWE)", "valueA": "62%",         "valueB": "74%",          "winner": "b"   },
    { "label": "Context",      "valueA": "256K",        "valueB": "1M",           "winner": "b"   },
    { "label": "Multimodal",   "valueA": "Full",        "valueB": "Image+Text",   "winner": "a"   },
    { "label": "Integrations", "valueA": "1000s",       "valueB": "Limited",      "winner": "a"   },
    { "label": "Plus Plan",    "valueA": "$20/mo",      "valueB": "$20/mo",       "winner": "tie" }
  ],
  "verdict": "ChatGPT wins on multimodal and ecosystem. Claude wins on coding, long-document analysis, and 1M-token context. Same $20/mo to try both."
}
```

### If 8 stats are required (matches live data file structure)

```json
{
  "slug": "chatgpt-vs-claude",
  "title": "ChatGPT vs Claude",
  "entityA": "ChatGPT",
  "entityB": "Claude",
  "category": "AI",
  "stats": [
    { "label": "Latest Model", "valueA": "GPT-5.4",     "valueB": "Claude 4.7",   "winner": "tie" },
    { "label": "Coding (SWE)", "valueA": "62%",         "valueB": "74%",          "winner": "b"   },
    { "label": "Context",      "valueA": "256K",        "valueB": "1M",           "winner": "b"   },
    { "label": "Multimodal",   "valueA": "Full",        "valueB": "Image+Text",   "winner": "a"   },
    { "label": "Integrations", "valueA": "1000s",       "valueB": "Limited",      "winner": "a"   },
    { "label": "Long Docs",    "valueA": "Good",        "valueB": "Best",         "winner": "b"   },
    { "label": "API Cost",     "valueA": "$2.50/M",     "valueB": "$3/M",         "winner": "a"   },
    { "label": "Plus Plan",    "valueA": "$20/mo",      "valueB": "$20/mo",       "winner": "tie" }
  ],
  "verdict": "ChatGPT wins on multimodal and ecosystem. Claude wins on coding, long-document analysis, and 1M-token context. Same $20/mo to try both."
}
```

> **⚠️ Numeric values flagged for verification before render:**
>
> - `Coding (SWE)`: SWE-bench / HumanEval percentages move per release. The 62% / 74% is illustrative of the reported direction (Claude leads in 2026 coding benchmarks); replace with the latest published Anthropic / OpenAI benchmark numbers at render time. **SEO Specialist or Eng to verify.**
> - `Context`: GPT-5.4 is widely reported at 256K context; Claude 4.7 Opus ships with the 1M context window. Verify against current docs.
> - `API Cost`: Per-million input token pricing. ChatGPT GPT-5.4 input ~$2.50/M; Claude 4.7 Opus input ~$3/M (subject to change). **Verify before publish.**
> - `Plus Plan`: Both ChatGPT Plus and Claude Pro list at $20/mo as of brief authoring. Verify.
>
> If any number can't be verified at render time, fall back to the soft-adjective version from the live data file rather than ship an unverifiable claim. Trust signals are the whole point of this page.

## 4. 90-second alternate cut

| Time | Beat | On screen | VO |
|------|------|-----------|-----|
| 0–3s | Hook | OpenAI logo and Anthropic logo, large "VS" | "ChatGPT or Claude? In 2026, the right answer depends on what you're building." |
| 3–10s | Problem framing | A developer at a laptop, AI chat split-screen | "Both are $20 a month. Both are state-of-the-art. The difference shows up the moment you actually use them." |
| 10–25s | Criteria | List of 6 criteria | "We compared model version, coding performance, context window, multimodal, integrations, and price." |
| 25–70s | Side-by-side | Stat-by-stat reveal | (see VO script section 5) |
| 70–85s | Verdict | Both logos, verdict | "ChatGPT for multimodal and ecosystem. Claude for coding and long documents. Same price to try both." |
| 85–90s | CTA | URL + end-screen | "Full comparison at a-versus-b dot net slash chatgpt-vs-claude." |

## 5. Voiceover script

### Short-form (12.5s, matching the 6-stat trimmed payload)

```
ChatGPT or Claude — which AI wins in 2026?
Latest model: GPT-5.4 versus Claude 4.7. Tie.
Coding benchmark: 62 percent versus 74. Claude wins.
Context window: 256K versus one million tokens. Claude wins.
Multimodal: ChatGPT does images, voice, and browsing. ChatGPT wins.
Integrations: thousands of GPTs versus limited. ChatGPT wins.
Plus plan: 20 dollars each. Tie.
Three-three. ChatGPT for ecosystem, Claude for code.
Full comparison at a-versus-b dot net.
```

Word count: 75 words ≈ 13 seconds at 175 wpm.

### Long-form 90-second cut

```
[0:00] ChatGPT or Claude? In 2026, the right answer depends on what you're building.
[0:03] Both are $20 a month. Both are state-of-the-art. The difference shows up the moment you actually use them. [pause 0.4s]
[0:10] We compared six things: latest model, coding performance, context window, multimodal capability, ecosystem integrations, and the consumer price.
[0:25] Latest models. ChatGPT runs GPT-5.4. Claude runs Claude 4 point 7 Opus. Both released within weeks of each other. Tie.
[0:32] Coding. On the SWE-bench coding benchmark, GPT-5.4 scores around 62 percent. Claude 4.7 hits 74. That's a 12-point gap on the test that most accurately predicts real production code. [emphasis] Claude wins.
[0:43] Context window. ChatGPT handles 256 thousand tokens. Claude 4.7 holds 1 million. That's the difference between fitting a chapter and fitting an entire codebase. Claude wins.
[0:54] Multimodal. ChatGPT does image generation, voice mode, and live web browsing out of the box. Claude handles images and text — no voice, no browsing. ChatGPT wins.
[1:04] Ecosystem. ChatGPT has thousands of specialized GPTs and deep Microsoft integration. Claude has a much tighter ecosystem. ChatGPT wins.
[1:13] Price. ChatGPT Plus: $20 a month. Claude Pro: $20 a month. Tie.
[1:18] Final score: three to three.
[1:21] So which one? [pause 0.3s] If you write code or work with long documents, Claude wins. If you need image generation, voice, or you're already in the Microsoft ecosystem, ChatGPT wins.
[1:32] At twenty bucks each, the smartest move is run both for a month and let your actual workflow pick the winner.
[1:38] Full comparison at a-versus-b dot net slash chatgpt-vs-claude.
```

Voice direction: developer-aware, slightly drier than the consumer briefs. This audience hates hype. Pace 165 wpm. Lean into the "run both" advice — it's the most credible move and signals the page's neutrality.

## 6. Shot list / on-screen-text plan

| Shot # | Frame range (6-stat) | What's shown | Source |
|--------|----------------------|--------------|--------|
| 1 | 0–45 | Title card: "ChatGPT VS Claude" with AI badge | Auto |
| 2 | 45–90 | Stat: Latest Model — "GPT-5.4" vs "Claude 4.7", tie | Auto |
| 3 | 90–135 | Stat: Coding (SWE) — "62%" vs "74%", Claude highlighted | Auto |
| 4 | 135–180 | Stat: Context — "256K" vs "1M", Claude highlighted | Auto |
| 5 | 180–225 | Stat: Multimodal — "Full" vs "Image+Text", ChatGPT highlighted | Auto |
| 6 | 225–270 | Stat: Integrations — "1000s" vs "Limited", ChatGPT highlighted | Auto |
| 7 | 270–315 | Stat: Plus Plan — "$20/mo" vs "$20/mo", tie | Auto |
| 8 | 315–375 | Verdict card | Auto from props.verdict |

### B-roll callouts

- None required for short-form.
- For 90s cut: optional logo lockups for OpenAI and Anthropic. Both are widely available; use editorially. Avoid using product UI screenshots without permission — paraphrase via on-screen text instead.

## 7. YouTube SEO metadata block

```yaml
youtube:
  title: "ChatGPT vs Claude: Which AI Wins in 2026? (GPT-5.4 vs Claude 4.7)"   # 67 chars (over 60 — see note)
  description: |
    ChatGPT or Claude? Both cost $20 a month, both are state-of-the-art — and they're built for different jobs.
    Full breakdown: https://www.aversusb.net/compare/chatgpt-vs-claude

    Stats covered:
    • Latest model: GPT-5.4 vs Claude 4.7 → Tie
    • Coding (SWE-bench): 62% vs 74% → Claude wins
    • Context window: 256K vs 1M tokens → Claude wins
    • Multimodal: Full (image, voice, browsing) vs Image+Text → ChatGPT wins
    • Integrations: 1000s of GPTs vs Limited → ChatGPT wins
    • Plus plan: $20/mo vs $20/mo → Tie

    Verdict: ChatGPT wins on multimodal and ecosystem. Claude wins on coding, long-document analysis, and the 1M-token context window. At $20 each, the smartest move is run both for a month.

    🔗 Full comparison + sources: https://www.aversusb.net/compare/chatgpt-vs-claude
    📊 More AI comparisons: https://www.aversusb.net/category/technology

    Subscribe for more 2026 AI head-to-heads.

    #ChatGPT #Claude #ChatGPTvsClaude #AI #GPT5
  tags:
    - "chatgpt vs claude"
    - "claude vs chatgpt"
    - "chatgpt vs claude 4"
    - "claude 4 opus"
    - "gpt 5.4"
    - "gpt 5"
    - "best ai 2026"
    - "best ai for coding"
    - "ai chatbot comparison"
    - "claude 4.7"
    - "anthropic vs openai"
    - "which ai is better"
    - "openai vs anthropic"
    - "best llm 2026"
    - "ai comparison"
  endScreenLinkUrl: "https://www.aversusb.net/compare/chatgpt-vs-claude"
  thumbnail:
    composition: "OpenAI logo left, large 'VS' centered, Anthropic logo right; '$20 = $20' price strip below"
    overlayText: "ChatGPT VS Claude — 2026"
    style: "dark gradient background, electric-blue accents, no faces, bold mono-display font (developer aesthetic)"
    aspectRatio: "16:9 (1280×720)"
  category: "Science & Technology"
  language: "en"
  madeForKids: false
```

> **⚠️ Title length:** Current title is 67 chars (over the 60-char soft cap). Two acceptable trims:
>
> 1. `"ChatGPT vs Claude 2026: Which AI Should You Use?"` (50 chars, less specific)
> 2. `"ChatGPT vs Claude: Which AI Wins in 2026?"` (43 chars, drops the model versions)
>
> Recommend option 2 — keyword-leading, well under cap, and the model-version specificity goes in the thumbnail/description instead.

## 8. Strategic notes (QC)

- **Winner distribution (6-stat):** A=2, B=2, tie=2. Clean and balanced — neither side dominates. ✅
- **First stat is decision-driving:** Latest model framing ("they're both current, so what's actually different") sets up the rest. ✅
- **Verdict echoes on-page text:** Live page verdict ends with the use-case-dependent recommendation; brief verdict mirrors the same axes. ✅
- **Numerals over adjectives:** 4 of 6 stats are numeric or near-numeric. The two non-numeric ("Full"/"Image+Text", "1000s"/"Limited") are short and discrete enough to read in 1.5s. The 8-stat extended version improves this to 5 numeric of 8. ✅
- **Primary keyword position:** "ChatGPT vs Claude" is the first 3 words of the (trimmed) YouTube title. ✅
- **Target URL is real:** `https://www.aversusb.net/compare/chatgpt-vs-claude` — confirmed real slug.
- **Numeric values verification (CRITICAL):** SWE-bench scores, context windows, and pricing change between the brief and the render. Numbers in section 3 must be verified against the latest published data before render. **Do not ship unverified claims** — the page's E-E-A-T signal depends on accuracy.

## 9. Acceptance checklist (Producer / Engineering)

- [ ] Verify numeric values in section 3 against latest published OpenAI / Anthropic data (SWE-bench, context window, pricing)
- [ ] Update `remotion/data/chatgpt-vs-claude.json` with verified tightened stats (currently has soft adjectives) — OR accept brief payload as render-time override
- [ ] Confirm `category` value: live data has `"General"`; brief proposes `"AI"` for tighter on-screen badge
- [ ] Trim YouTube title to ≤60 chars (recommended: option 2 in section 7 note)
- [ ] `node remotion/render-video.mjs chatgpt-vs-claude` renders (post-[DAN-384](/DAN/issues/DAN-384))
- [ ] VO rendered via `node scripts/elevenlabs-tts.mjs chatgpt-vs-claude`
- [ ] Output MP4 is 1080×1920, ~12.5–15.5s, ≤25 MB
- [ ] YouTube upload uses metadata block above (with title trim applied)
- [ ] End-screen link points to target URL
- [ ] `YouTubeVideo` row created and embedded on the page
