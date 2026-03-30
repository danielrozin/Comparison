# A Versus B — Editorial Guidelines

> Last updated: 2026-03-30 | Owner: Content Marketing Lead

---

## Brand Identity

**Site name:** A Versus B (aversusb.net)
**Tagline:** Compare anything. Decide faster.
**Mission:** Help users make informed decisions by providing clear, data-driven comparisons.

---

## Voice & Tone

### Core Principles

1. **Factual first.** Every claim needs data or a credible source. Never fabricate statistics.
2. **Balanced always.** Present both sides fairly. If Entity A wins on price, say so — but also show where Entity B excels.
3. **Expert but accessible.** Write like a knowledgeable friend, not a textbook. Avoid jargon unless the audience expects it (e.g., developer tools).
4. **Never salesy.** We are not selling products. We are helping people compare them.
5. **Current.** All content references the current year (2026). Outdated specs or discontinued products get flagged.

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| Comparison pages | Neutral, data-driven | "The iPhone 16 Pro offers 48MP vs Samsung S25's 50MP — a negligible difference for most users." |
| Blog articles | Informative, slightly conversational | "If you're torn between React and Vue, you're not alone. Here's what actually matters." |
| Reddit answers | Casual, helpful, peer-to-peer | "Honestly, both are solid picks. The main thing to consider is..." |
| Quora answers | Authoritative, structured | "There are three key differences between X and Y that most comparisons miss:" |
| LinkedIn syndication | Professional, insight-driven | "Our analysis of 10,000 comparison searches reveals a clear shift in consumer preference." |
| Medium/dev.to | Educational, detailed | Full article format with deep analysis and tables. |

---

## Content Quality Standards

### Comparisons (Auto-Generated)

Every AI-generated comparison must meet these minimums:

| Element | Minimum | Quality Bar |
|---------|---------|-------------|
| Key differences | 5 | Each must cite specific, verifiable data points |
| Attributes | 5 | Use correct units (GB, MHz, USD). No "N/A" filler |
| FAQs | 3 | Must answer questions users actually search for |
| Pros per entity | 3 | Specific and unique (not "popular" or "well-known") |
| Cons per entity | 2 | Honest weaknesses, not hedged non-answers |
| Short answer | 2-3 sentences | Must state the core difference, not just "it depends" |
| Verdict | 2-3 sentences | Balanced recommendation with a clear "choose X if... choose Y if..." |

**Red flags to reject:**
- Generic pros like "widely used" or "popular brand"
- Cons that are actually neutral ("has a learning curve")
- Attributes with no real data ("Good" vs "Very Good")
- Category misassignment (software tools labeled as "technology")
- Outdated pricing or specs
- Biased verdicts without supporting data

### Blog Articles

| Element | Requirement |
|---------|-------------|
| Length | 1,000-1,500 words |
| Structure | H2 and H3 headings, bullet points, at least one table |
| Internal links | 2-4 links to comparison pages using `/compare/slug-a-vs-slug-b` |
| SEO title | Under 60 characters, includes primary keyword |
| Meta description | 150-160 characters, compelling and keyword-rich |
| Conclusion | Always end with a clear "## Conclusion" section |
| Freshness | Reference current year (2026) in title or first paragraph |

### Social Outreach Answers

| Element | Reddit | Quora |
|---------|--------|-------|
| Length | 2-3 short paragraphs | 2-3 structured paragraphs |
| Link placement | End of answer, natural CTA | End of answer, as "detailed breakdown" |
| Tone | Casual, like a knowledgeable friend | Expert, like a consultant |
| Unique value | Must add insight beyond the link | Must provide standalone value |
| Frequency | No more than 3 posts per subreddit per week | Wait 24h between posts |
| Link count | 1 per answer | 1 per answer |
| Self-promotion | Never lead with the link | Frame as additional resource |

---

## Category Taxonomy

Use these exact category names. Do not invent new ones.

### Comparison Categories
`sports`, `countries`, `technology`, `products`, `health`, `history`, `companies`, `entertainment`, `brands`, `automotive`, `software`, `education`, `finance`, `food`, `science`, `nature`

**Critical rules:**
- `software` = SaaS, apps, platforms, VPNs, antivirus, hosting, CRM, AI tools, dev tools, cloud services
- `automotive` = cars, vehicles, EVs, motorcycles, car brands (Tesla, BMW, etc.)
- `technology` = hardware, chips, processors, physical tech (NOT software, NOT cars)
- `products` = consumer goods, gadgets, headphones, speakers, appliances

### Blog Categories
Same taxonomy applies. When in doubt, check `src/lib/utils/categories.ts`.

---

## SEO Standards

### URL Structure
- Comparisons: `/compare/{entity-a}-vs-{entity-b}` (lowercase, hyphens, no special chars)
- Blog posts: `/blog/{slugified-title}` (auto-generated, max 80 chars)

### Title Patterns
- Comparisons: `"{Entity A} vs {Entity B}: {Key Difference} [{Year}]"`
- Blog posts: `"{Topic}: {Value Prop} [{Year}]"` — under 60 chars

### Internal Linking
- Blog articles MUST link to 2-4 relevant comparison pages
- Format: `[anchor text](/compare/slug-a-vs-slug-b)`
- Comparison pages link to related comparisons automatically

### Canonical URLs
- All syndicated content must include canonical URL back to aversusb.net
- UTM parameters: `utm_source={platform}&utm_medium=syndication&utm_campaign=content-syndication`

---

## Content Syndication Standards

### Platform-Specific Formatting
- **Medium:** Full article with markdown, CTA footer, canonical notice
- **dev.to:** YAML front matter, comparison tables, `published: false` (review before publishing)
- **LinkedIn:** Condensed version (~600 chars excerpt), professional tone, link to full article

### Syndication Workflow
1. Content must be published on aversusb.net first (canonical source)
2. Wait 24-48 hours before syndicating (Google indexing priority)
3. Review formatted output for each platform before publishing
4. Always include canonical URL and UTM tracking
5. Never modify the substance of syndicated content vs the original

---

## SmartReview Standards

- Reviews maintain editorial independence — no guaranteed scores
- Sponsored content gets enhanced visibility, not fabricated wins
- All review data sourced from Reddit, G2, Capterra, Trustpilot, Product Hunt
- Target audience: 25-45, tech-savvy, purchase-ready professionals

---

## AI Prompt Hygiene

When modifying AI generation prompts:
- Always specify the current year (2026) to avoid outdated references
- Include category taxonomy rules in the prompt (especially software vs technology)
- Set explicit minimum counts for structured data (key differences, attributes, FAQs)
- Require JSON-only output — no markdown code blocks wrapping JSON
- Keep `max_tokens` appropriate: 3000 for comparisons, 4000 for blog articles, 500 for outreach answers

---

## Review Process

All auto-generated content should be reviewed against this checklist before scaling:

- [ ] Factual accuracy — are the stats real and current?
- [ ] Balance — does the comparison favor one side without justification?
- [ ] Completeness — does it meet the minimum content requirements above?
- [ ] Category — is it correctly assigned?
- [ ] SEO — does the title/meta follow our standards?
- [ ] Links — do internal links point to valid comparison pages?
- [ ] Tone — does it match our voice guidelines for the content type?
