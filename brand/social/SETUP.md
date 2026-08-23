# A Versus B — social profile setup

Everything needed to create the Facebook Page, Instagram business profile and
finish the YouTube channel. Copy fields verbatim; every one is inside its
platform limit (counts verified in `check-lengths.mjs`).

Assets are in `brand/social/out/`. Re-render any of them with:

```bash
node brand/social/render.mjs
```

---

## Shared identity

| Field | Value |
|---|---|
| Brand name | A Versus B |
| Handle | `aversusb` for Facebook and Instagram. YouTube is already `@aversusb-net` — note the suffix; `@aversusb` is a different channel. |
| Website | https://www.aversusb.net |
| Contact email | Info@aversusb.net |
| Tagline | Compare Anything |
| Brand colours | `#1e3a8a` → `#1d4ed8` → `#7c3aed` (blue → violet, 135°) |
| Accent | `#c084fc` violet, `#93c5fd` light blue |
| Typeface | Inter (Black 900 for display) |

---

## 1. Facebook Page

**Create at:** facebook.com/pages/create → *Business or Brand*

| Setting | Value |
|---|---|
| Page name | `A Versus B` |
| Username | `aversusb` → facebook.com/aversusb |
| Category (primary) | **Website** |
| Category (secondary) | **Media/News Company** |
| Category (third) | **Product/Service** |
| Profile picture | `aversusb-profile-1024.png` |
| Cover photo | `aversusb-facebook-cover-1640x624.png` |
| Action button | **Learn more** → https://www.aversusb.net |
| Website | https://www.aversusb.net |
| Email | Info@aversusb.net |
| Location | Leave blank — this is a website, not a storefront. Adding an address invites local-business ranking signals you don't want. |

**Bio** (limit 101):

```
Side-by-side comparisons of anything — tech, products, sports, countries. Answers in seconds.
```

**About / description** (limit 255):

```
A Versus B is the comparison platform for people who want an answer, not a sales pitch. Clear, data-driven, side-by-side breakdowns across technology, products, sports, countries, software and health — so you can decide in seconds.
```

---

## 2. Instagram

**Create as:** new account → Settings → *Switch to professional account* → **Business**

| Setting | Value |
|---|---|
| Username | `aversusb` |
| Name field | `A Versus B · Compare Anything` |
| Category | **Website** (fallback: *Internet Company*) |
| Profile picture | `aversusb-profile-1024.png` — same file as Facebook |
| Contact | Email → Info@aversusb.net |
| Website link | https://www.aversusb.net |

**Bio** (limit 150):

```
Compare anything, side by side.
Tech · Products · Sports · Countries · Software
New head-to-head every day ↓
```

> The Name field is indexed by Instagram search, the bio is not — which is why
> "Compare Anything" sits in the name rather than only in the bio.

Link Facebook and Instagram in **Meta Business Suite** once both exist, so
posts cross-publish and the Page's action button carries over.

---

## 3. YouTube

The channel already exists at youtube.com/@aversusb-net — this is finishing it,
not creating it.

| Setting | Where | Value |
|---|---|---|
| Banner | Studio → Customisation → Branding | `aversusb-youtube-banner-2560x1440.png` |
| Profile picture | same screen | `aversusb-profile-1024.png` |
| Channel name | Customisation → Basic info | `A Versus B` |
| Handle | Basic info | `@aversusb-net` |
| Links | Basic info → Links | Website → https://www.aversusb.net (the only one — there is no X or LinkedIn account) |
| Contact email | Basic info | Info@aversusb.net |
| Country | Settings → Channel → Basic info | Your country of residence — leave whatever is already set. Audience targeting comes from the videos, not this field. |
| Keywords | Settings → Channel → Basic info | `comparison, vs, versus, head to head, side by side, product comparison, tech comparison, compare` |
| Default video category | Settings → Upload defaults | **Education** (use *Science & Technology* for tech match-ups) |

**Channel description** (limit 1000):

```
A Versus B settles comparisons.

Every day we publish a new head-to-head breakdown — two things, side by side, scored on the things that actually decide it. No sponsored verdicts, no filler, no ten-minute intro.

Technology · Products · Sports · Countries · Software · Health

Full written comparisons, with the data behind every verdict:
https://www.aversusb.net

Business enquiries: Info@aversusb.net
```

---

## After the accounts exist

Add the two new profiles to the site's identity graph so Google ties them to
the domain — `src/app/layout.tsx` already declares `rel="me"` links for X,
LinkedIn, YouTube and Mastodon, and the Organization schema carries `sameAs`.
Both need the Facebook and Instagram URLs appended once they resolve.

---

## Asset reference

| File | Size | Used for |
|---|---|---|
| `aversusb-profile-1024.png` | 1024×1024 | Facebook, Instagram and YouTube avatar. Designed for a circular mask — the ring and mark sit well inside the crop. |
| `aversusb-facebook-cover-1640x624.png` | 1640×624 | Facebook Page cover. All type sits in the centre 1109px, which is the window mobile crops to; the lower left is kept clear of the avatar overlap. |
| `aversusb-youtube-banner-2560x1440.png` | 2560×1440 | YouTube channel banner. All type sits in the centred 1546×423 safe area, so nothing is lost on phone or desktop. |
