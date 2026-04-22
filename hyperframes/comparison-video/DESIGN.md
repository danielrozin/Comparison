---
name: Comparison Video — Data Drift
description: Visual identity for daily comparison videos. Futuristic, immersive, data-as-light.
---

## Style Prompt

Comparison videos render in the **Data Drift** style — Refik Anadol's iridescent, particle-driven, futuristic aesthetic. Deep black canvas with electric purple and cyan accents that feel like data is light. Thin futuristic typography sits weightlessly above a slow-drifting gradient mesh. Numbers are the heroes — they coalesce, count up, and pulse. Motion is continuous and organic, never snappy. Every comparison is a head-to-head where two entities orbit each other across six scenes, with a winner reveal in cyan-purple light.

## Colors

- `#0a0a0a` — canvas (deep near-black)
- `#7c3aed` — primary accent / Entity A glow (electric purple)
- `#06b6d4` — secondary accent / Entity B glow (cyan)
- `#f5f5fa` — primary text (cool white)
- `#94a3b8` — secondary text / labels (cool grey)
- `#fbbf24` — winner highlight (warm amber for contrast against the cool palette)

## Typography

- **Inter** — body, labels, stats. Weights 300, 500, 700.
- **Space Grotesk** — display headlines, entity names, big numbers. Weights 500, 700.

Big numbers use `font-variant-numeric: tabular-nums` and Space Grotesk 700.

## Motion Rules

- Easing: `sine.inOut`, `power2.out`, `power3.out`. **Never** `back.out`, `elastic`, `bounce`.
- Entrances: fluid — opacity + slight y/scale drift, 0.6–0.9s.
- Numbers count up from 0 with a faint cyan/purple glow as they tick.
- Background: continuous slow drift of two large radial gradients (purple + cyan orbs), never static.
- Transitions between scenes: **blur crossfade** (CSS) — 0.5s, 12px blur peak. Soft, dissolving.
- Winner cells: breathing glow (slow scale 1.0 ↔ 1.04, 2s loop).

## What NOT to Do

- No hard cuts, snaps, or overshoots — Data Drift is fluid, not punchy.
- No `back.out`, `elastic`, `bounce` easings — they break the futuristic mood.
- No saturated reds, greens, or yellows in body design — only amber for the winner accent.
- No serifs or geometric display fonts — only Inter and Space Grotesk.
- No dense full-frame text walls — let numbers breathe, max 6 stats per scene.
- No `transparent` keyword in gradients — use `rgba(10,10,10,0)` (canvas color at zero alpha).
