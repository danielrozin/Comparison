import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

// Dedicated "Alternative to" page for Photoshop (DAN-1056, parent draft DAN-1055).
// Mirrors the locked /alternatives/* template v2: glance table, 8 per-section
// "when to choose / when to stick" blocks, 5 FAQs, and three JSON-LD blocks
// (ItemList + FAQPage + BreadcrumbList). Static segment overrides /alternatives/[slug].
//
// Pre-publish gates applied 2026-06-12 (per CMO sign-off checklist on DAN-1055):
// pricing reverified against provider pages and corporate-status fact-checked.
// Drift corrected atomically across glance table + per-section + ItemList offers:
//   - Affinity: $69.99 one-time → FREE (Canva made the unified Affinity app free,
//     Oct 2025; one-time/Universal License retired). Lead pick reframed accordingly.
//   - Adobe Creative Cloud All Apps: ~$59.99 → ~$69.99/mo ("Creative Cloud Pro").
//   - Capture One: ~$14.92 → ~$18/mo (June 2026 increase); no longer "independent" —
//     owned by PE firm Axcel, reportedly up for sale.
//   - Canva Teams: flat $29.99/mo (5 users) → per-seat (~$10/seat/mo annual, 3-seat min).
// Confirmed unchanged: Pixelmator Pro $49.99 one-time (Apple acquisition closed
// early 2025; still on Mac App Store), Photopea Premium ~$5/mo, Corel PaintShop Pro
// (~$79.99 one-time; Corel operates as Alludo), Canva Pro $14.99/mo, Photoshop
// single-app ~$22.99/mo.

export const revalidate = 3600;

const PAGE_TITLE = "Best Photoshop Alternatives in 2026: 8 Image Editors Compared";
const PAGE_DESC =
  "Affinity, GIMP, Photopea, Pixelmator Pro, Krita, Capture One, PaintShop Pro, and Canva compared. Find the best Photoshop alternative for free pro editing, one-time purchase, Mac, or RAW photo work in 2026.";
const CANONICAL = `${SITE_URL}/alternatives/photoshop`;
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Best Photoshop Alternatives 2026")}&type=alternatives`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: CANONICAL,
    type: "article",
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Best Photoshop Alternatives in 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [OG_IMAGE],
  },
};

// ── The 5 FAQs (verbatim text shared by visible content + FAQPage schema) ──
const FAQS: { q: string; a: string }[] = [
  {
    q: "What is the best free Photoshop alternative?",
    a: "GIMP is the best free, open-source alternative for general image editing — layers, masks, and a deep toolset across Windows, macOS, and Linux at $0, with no account. Affinity is now free for everyone (a Canva account is required) and is the strongest free pro-grade option. Photopea is the best free browser-based option and opens .psd files natively. Krita is the best free choice for digital painting or illustration. For quick social graphics and 1-click background removal, Canva's free tier is the fastest path to output.",
  },
  {
    q: "Is there a Photoshop alternative I can buy once instead of subscribing?",
    a: "Yes — several. Pixelmator Pro ($49.99 one-time) is the best one-time purchase for Mac users, and Corel PaintShop Pro (about $79.99 one-time) is the best buy-once editor on Windows. Affinity is an even cheaper option: as of late 2025 the unified Affinity app is completely free. All three avoid Photoshop's subscription-only model.",
  },
  {
    q: "Can I open .psd files without Photoshop?",
    a: "Yes. Photopea opens and saves .psd files natively in the browser with high fidelity and is the most reliable way to edit a layered Photoshop file without Photoshop installed. GIMP and Affinity also import .psd files, though very complex files with advanced smart objects or layer effects may not round-trip perfectly. Because .psd is a proprietary Adobe format, third-party support will always trail Photoshop's own handling slightly.",
  },
  {
    q: "What is the best Photoshop alternative for Mac?",
    a: "Pixelmator Pro is the strongest Mac-native option — built on Apple frameworks for fast Apple-silicon performance, with ML-powered tools and a one-time price. Affinity is the best cross-platform pro alternative that also runs natively on Mac, and it is now free. GIMP and Krita are the best free open-source Mac options for general editing and painting, respectively.",
  },
  {
    q: "What is the best Photoshop alternative for photographers?",
    a: "Capture One is the best alternative for serious photographers — its RAW rendering, color science, tethered shooting, and cataloguing are built for high-volume photo workflows and are preferred by many studio and commercial photographers over the Lightroom and Photoshop combination. For one-off retouching on top of a photo pipeline, Affinity is the strongest free companion.",
  },
];

// ── JSON-LD: ItemList (8 alternatives, ordered), with reverified offers ──
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Photoshop Alternatives in 2026",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: 8,
  itemListElement: [
    { "@type": "ListItem", position: 1, item: { "@type": "SoftwareApplication", name: "Affinity", applicationCategory: "MultimediaApplication", applicationSubCategory: "Photo Editing", operatingSystem: "macOS, Windows, iPadOS", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, url: "https://www.affinity.studio" } },
    { "@type": "ListItem", position: 2, item: { "@type": "SoftwareApplication", name: "GIMP", applicationCategory: "MultimediaApplication", applicationSubCategory: "Photo Editing", operatingSystem: "Windows, macOS, Linux", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, url: "https://www.gimp.org" } },
    { "@type": "ListItem", position: 3, item: { "@type": "SoftwareApplication", name: "Photopea", applicationCategory: "MultimediaApplication", applicationSubCategory: "Photo Editing", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, url: "https://www.photopea.com" } },
    { "@type": "ListItem", position: 4, item: { "@type": "SoftwareApplication", name: "Pixelmator Pro", applicationCategory: "MultimediaApplication", applicationSubCategory: "Photo Editing", operatingSystem: "macOS", offers: { "@type": "Offer", price: "49.99", priceCurrency: "USD" }, url: "https://www.pixelmator.com/pro/" } },
    { "@type": "ListItem", position: 5, item: { "@type": "SoftwareApplication", name: "Krita", applicationCategory: "DesignApplication", applicationSubCategory: "Digital Painting", operatingSystem: "Windows, macOS, Linux", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, url: "https://krita.org" } },
    { "@type": "ListItem", position: 6, item: { "@type": "SoftwareApplication", name: "Capture One", applicationCategory: "MultimediaApplication", applicationSubCategory: "RAW Photo Processing", operatingSystem: "macOS, Windows", offers: { "@type": "Offer", price: "18.00", priceCurrency: "USD" }, url: "https://www.captureone.com" } },
    { "@type": "ListItem", position: 7, item: { "@type": "SoftwareApplication", name: "Corel PaintShop Pro", applicationCategory: "MultimediaApplication", applicationSubCategory: "Photo Editing", operatingSystem: "Windows", offers: { "@type": "Offer", price: "79.99", priceCurrency: "USD" }, url: "https://www.corel.com/en/paintshop-pro/" } },
    { "@type": "ListItem", position: 8, item: { "@type": "SoftwareApplication", name: "Canva", applicationCategory: "DesignApplication", applicationSubCategory: "Design Software", operatingSystem: "Web, iOS, Android, macOS, Windows", offers: { "@type": "Offer", price: "14.99", priceCurrency: "USD" }, url: "https://www.canva.com" } },
  ],
};

// ── JSON-LD: FAQPage (5 FAQs). Emitted for AIO/semantic completeness only —
// Google's Aug-2023 change disqualifies non-gov/non-health domains from FAQ
// rich results, so FAQ rich-result impressions are NOT a KPI here (DAN-608/701). ──
const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// ── JSON-LD: BreadcrumbList ──
const breadcrumbListSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Alternatives", item: `${SITE_URL}/alternatives/` },
    { "@type": "ListItem", position: 3, name: "Photoshop Alternatives", item: CANONICAL },
  ],
};

// ── The 8 alternatives (glance table + per-section content) ──
interface Alt {
  n: number;
  name: string;
  heading: string;
  bestFor: string;
  freeTier: string;
  paidEntry: string;
  advantage: string;
  why: string;
  chooseWhen: string[];
  stickWhen: string[];
  pricing: string;
  compareHref: string;
  compareLabel: string;
}

const ALTS: Alt[] = [
  {
    n: 1,
    name: "Affinity (Canva)",
    heading: "Affinity — best free professional Photoshop alternative",
    bestFor: "Pro raster editing, free",
    freeTier: "Yes (fully free)",
    paidEntry: "Free",
    advantage: "Photoshop-grade pro tools — now free for everyone",
    why: "Affinity is the strongest professional raster editor you can get for free. It covers the work most Photoshop users actually do day to day — layers, masks, adjustment layers, retouching, frequency separation, RAW develop, focus stacking, HDR merge, panorama stitching, and a full 16/32-bit pipeline — and it runs natively and fast on Mac, Windows, and iPad. After Canva acquired Serif in 2024, the formerly paid Affinity Photo, Designer, and Publisher apps were unified into a single app and, in late 2025, made completely free for everyone (a free Canva account is required; existing V2 perpetual-license holders keep their licenses). For photographers, retouchers, and designers who'd otherwise pay Adobe every month forever, Affinity now covers the overwhelming majority of that ground at $0.",
    chooseWhen: [
      "You want professional-grade raster editing without any subscription or one-time fee",
      "Your work is photo retouching, compositing, and print prep — not motion or 3D",
      "You want one tool across Mac, Windows, and iPad",
      "You can live without Photoshop's exact plugin ecosystem and generative AI",
    ],
    stickWhen: [
      "You depend on Adobe's generative AI (Generative Fill / Firefly) in your daily workflow",
      "Your pipeline relies on tight Lightroom / Illustrator / After Effects round-tripping",
      "You exchange layered .psd files with collaborators who expect 100% fidelity",
      "You rely on a specific Photoshop-only plugin or automation",
    ],
    pricing:
      "Free for everyone (a free Canva account is required). The unified Affinity app combines Photo + Designer + Publisher across Mac, Windows, and iPad. Optional Canva AI features inside Affinity require a paid Canva plan; existing Affinity V2 perpetual licenses remain valid.",
    compareHref: "/compare/photoshop-vs-affinity-photo",
    compareLabel: "Photoshop vs Affinity Photo",
  },
  {
    n: 2,
    name: "GIMP",
    heading: "GIMP — best free, open-source Photoshop alternative",
    bestFor: "Free, open-source, no account",
    freeTier: "Yes (fully free)",
    paidEntry: "Free",
    advantage: "Mature open-source editor on Win/Mac/Linux; no account, no telemetry",
    why: "GIMP (GNU Image Manipulation Program) is the most mature free, open-source raster editor available — layers, masks, channels, paths, a deep filter set, scripting (Script-Fu / Python-Fu), and a huge plugin catalog, all at $0 with no account, no subscription, and no telemetry. It runs natively on Windows, macOS, and Linux, which makes it the default free pick for Linux users, students, hobbyists, and anyone who refuses an account on principle. The GIMP 3.x line modernized the codebase (GTK3, non-destructive editing improvements, better .psd handling), closing real gaps with Photoshop. Where Affinity now offers free pro tools behind a Canva account, GIMP stays fully open-source with nothing to sign into.",
    chooseWhen: [
      "You want a genuinely free editor with no account or subscription",
      "You're on Linux, where Photoshop has no native client",
      "You're a student, hobbyist, or open-source advocate",
      "You want a scriptable, extensible tool you fully control",
    ],
    stickWhen: [
      "You need generative AI, the smoothest retouching UX, or pro-grade content-aware tools",
      "You exchange layered .psd files and need perfect fidelity",
      "Your team or clients expect a Photoshop-standard workflow",
      "You value polished UX over maximum configurability",
    ],
    pricing: "Free (open-source, GPL) — every feature, every platform, no cap. Download from gimp.org.",
    compareHref: "/compare/photoshop-vs-gimp",
    compareLabel: "Photoshop vs GIMP",
  },
  {
    n: 3,
    name: "Photopea",
    heading: "Photopea — best browser-based alternative that opens .psd files instantly",
    bestFor: "Open .psd in a browser, instantly",
    freeTier: "Yes (ad-supported)",
    paidEntry: "Premium ~$5/mo",
    advantage: "Edits .psd/.xcf/.sketch in-browser with a Photoshop-like UI",
    why: "Photopea is a full-featured image editor that runs entirely in your browser — nothing to install — with a layout so close to Photoshop that most users are productive in minutes. It opens and saves .psd natively (plus .xcf, .sketch, .xd, and standard image formats), which makes it the fastest way to open a layered Photoshop file when you don't have Photoshop in front of you. Layers, masks, adjustment layers, smart objects, blend modes, and a solid filter set are all there. For quick edits, opening a client's .psd on someone else's machine, or working on a Chromebook/locked-down device, Photopea is the most frictionless option in this list.",
    chooseWhen: [
      "You need to open or edit a .psd right now, on any device, without installing software",
      "You're on a Chromebook, locked-down work machine, or borrowed computer",
      "You want a near-identical Photoshop UI with a near-zero learning curve",
      "You want a free tier and only need to remove ads, not pay a full subscription",
    ],
    stickWhen: [
      "You work on very large files where a browser tab hits memory limits",
      "You need generative AI, advanced retouching, or the full plugin ecosystem",
      "You require offline reliability for production-critical work",
      "You need color-managed pro print output end to end",
    ],
    pricing: "Free (ad-supported, full editor). Photopea Premium ~$5/mo removes ads and adds more history states.",
    compareHref: "/compare/photoshop-vs-photopea",
    compareLabel: "Photoshop vs Photopea",
  },
  {
    n: 4,
    name: "Pixelmator Pro",
    heading: "Pixelmator Pro — best Mac-native Photoshop alternative",
    bestFor: "Mac-native image editing",
    freeTier: "Trial / paid",
    paidEntry: "$49.99 one-time",
    advantage: "Native Apple-silicon performance; ML tools; one-time price",
    why: "Pixelmator Pro is a beautifully Mac-native image editor built around Apple frameworks (Metal, Core ML), so it's fast and fluid on Apple silicon, with a UI that feels like a first-party macOS app. It pairs a genuinely deep toolset — layers, masks, RAW, vector tools, and excellent ML-powered features (super resolution, ML denoise, subject/background selection) — with a one-time purchase rather than a subscription. Apple's acquisition of the Pixelmator team closed in early 2025; Pixelmator Pro remains available as a $49.99 one-time purchase on the Mac App Store, which makes its long-term direction especially interesting for Mac-centric users.",
    chooseWhen: [
      "You're on a Mac and want native Apple-silicon performance",
      "You want a one-time purchase with no subscription",
      "You like ML-assisted editing (denoise, super resolution, smart selections)",
      "You want a clean, approachable UI over Photoshop's density",
    ],
    stickWhen: [
      "You're cross-platform or on Windows (Pixelmator Pro is Mac-only)",
      "You need Adobe's generative AI and broadest plugin ecosystem",
      "You exchange layered .psd files needing perfect fidelity",
      "You rely on tight Adobe-suite round-tripping",
    ],
    pricing: "$49.99 one-time (Mac App Store); Pixelmator Pro is Mac-only. iPad/iPhone Photomator is available separately on subscription.",
    compareHref: "/compare/photoshop-vs-pixelmator-pro",
    compareLabel: "Photoshop vs Pixelmator Pro",
  },
  {
    n: 5,
    name: "Krita",
    heading: "Krita — best free Photoshop alternative for digital painting and illustration",
    bestFor: "Digital painting & illustration",
    freeTier: "Yes (fully free)",
    paidEntry: "Free",
    advantage: "Best free tool for painting, comics, and concept art",
    why: "Krita is a free, open-source editor built specifically for digital painting, illustration, comics, and concept art — the work Photoshop is often pressed into but wasn't designed for. Its brush engine is exceptional (dozens of customizable brush types, stabilizers, wrap-around mode for textures, a pop-up palette), and it ships features painters actually want: animation frames, comic panel tools, vector layers, and HDR painting. For illustrators, comic artists, and concept artists on any budget, Krita beats Photoshop on the painting workflow specifically — and it's $0 on Windows, macOS, and Linux. It's a photo-retouching tool second and a painting tool first, so pair it with GIMP or Affinity for heavy photo work.",
    chooseWhen: [
      "Your work is digital painting, illustration, comics, or concept art",
      "You want the best free brush engine available",
      "You're on any budget (student, hobbyist, indie artist)",
      "You want animation and comic tools built in",
    ],
    stickWhen: [
      "Your primary work is photo retouching, compositing, or print prep",
      "You need generative AI and content-aware photo tools",
      "You exchange layered .psd files with photo-centric collaborators",
      "You depend on the Adobe ecosystem",
    ],
    pricing: "Free (open-source, GPL) on Windows, macOS, and Linux. A paid Krita build exists on some app stores to support development, but the tool is free direct from krita.org.",
    compareHref: "/compare/photoshop-vs-krita",
    compareLabel: "Photoshop vs Krita",
  },
  {
    n: 6,
    name: "Capture One",
    heading: "Capture One — best alternative for professional photographers and RAW workflows",
    bestFor: "Professional photo / RAW workflow",
    freeTier: "Trial",
    paidEntry: "~$18/mo or perpetual",
    advantage: "Best-in-class RAW rendering, tethering, and cataloguing",
    why: "Capture One is a professional RAW processor and photo workflow tool that beats Photoshop on the things photographers care about most: RAW rendering quality (especially skin tones and color), tethered shooting, cataloguing, and a non-destructive layer-based editing model designed for high-volume photo work. Studio and commercial photographers frequently prefer Capture One's color science and tethering over Adobe's Lightroom + Photoshop combination. It's not a compositing tool — you won't replace heavy Photoshop retouching with it — but as the engine of a professional photo pipeline, it's the strongest alternative on this list. Capture One spun out of Phase One in 2019 and is now owned by the private-equity firm Axcel; it operates as an independent product line.",
    chooseWhen: [
      "You're a professional or serious photographer shooting RAW at volume",
      "You want best-in-class RAW rendering, color, and tethered capture",
      "You want a catalogue/session workflow, not a single-image editor",
      "You prefer Capture One's color science to Adobe's",
    ],
    stickWhen: [
      "Your work is compositing, retouching, or graphic design — not photo development",
      "You need pixel-level cloning, content-aware fill, or generative AI",
      "You exchange layered .psd files",
      "You want one tool for both develop and heavy retouch (Capture One is develop-first)",
    ],
    pricing: "Free trial. Capture One subscription ~$18/mo (annual, after a June 2026 price increase). A perpetual license is available at a higher one-time price. Tiering varies by camera brand / use.",
    compareHref: "/compare/photoshop-vs-capture-one",
    compareLabel: "Photoshop vs Capture One",
  },
  {
    n: 7,
    name: "Corel PaintShop Pro",
    heading: "Corel PaintShop Pro — best one-time-purchase Photoshop alternative for Windows",
    bestFor: "Windows one-time purchase",
    freeTier: "30-day trial",
    paidEntry: "~$79.99 one-time",
    advantage: "Photoshop-style editing on Windows you buy once",
    why: "Corel PaintShop Pro is a long-established Windows raster editor that delivers a large slice of Photoshop's toolkit — layers, masks, adjustment tools, RAW lab, retouching, text, and effects — as a one-time purchase rather than a subscription. It's Windows-only and aimed squarely at hobbyists, photographers, and small businesses who want a familiar, affordable, own-it-forever editor. PaintShop Pro is published by Corel, which operates as Alludo, an established software company, so it comes with a stable vendor. For Windows users who want Photoshop-style editing without Adobe's monthly bill, it's a credible pick.",
    chooseWhen: [
      "You're on Windows and want a one-time purchase, not a subscription",
      "You're a hobbyist, photographer, or small business on a budget",
      "You want a familiar layers-and-adjustments editing model",
      "You prefer an established commercial vendor over open-source",
    ],
    stickWhen: [
      "You're on macOS (PaintShop Pro is Windows-only)",
      "You need generative AI, the deepest retouching tools, or the Adobe ecosystem",
      "You exchange layered .psd files needing perfect fidelity",
      "You need cross-platform parity across a team",
    ],
    pricing: "30-day free trial. Corel PaintShop Pro ~$79.99 one-time (frequent sale pricing lower); the Ultimate edition bundles extra tools at a higher one-time price.",
    compareHref: "/compare/photoshop-vs-paintshop-pro",
    compareLabel: "Photoshop vs PaintShop Pro",
  },
  {
    n: 8,
    name: "Canva",
    heading: "Canva — best alternative for non-designers and quick social edits",
    bestFor: "Non-designers, quick social edits",
    freeTier: "Yes (generous)",
    paidEntry: "Pro $14.99/mo",
    advantage: "Templates + 1-click background removal; no learning curve",
    why: "Canva is templates-first, not tools-first. For cropping a photo, removing a background in one click, dropping an image into a pre-sized social post, or making a quick marketing graphic, Canva is dramatically faster than opening Photoshop and starting from a blank canvas — and it's usable by non-designers (marketers, founders, sales, support) with zero training. Canva isn't a Photoshop replacement for professional retouching, compositing, or print-grade work (it has no real channels, layer masks in Photoshop's sense, or color-managed CMYK pipeline). But for the quick image work many teams try to do in Photoshop and shouldn't, Canva is the correct, faster tool — with one-click Background Remover and Magic Edit built in. (For pro raster work, Canva now also owns the free Affinity app — see #1.)",
    chooseWhen: [
      "Your work is social posts, marketing graphics, and quick photo edits",
      "Your team includes non-designers who need to ship branded content",
      "You want 1-click background removal and templates over manual masking",
      "You want browser/mobile/desktop editing with shared brand kits",
    ],
    stickWhen: [
      "Your work is professional retouching, compositing, or print production",
      "You need channels, advanced masking, and a color-managed pipeline",
      "You edit large, high-resolution, layered files",
      "You need precise pixel-level control and generative AI in a pro editor",
    ],
    pricing: "Free (generous limits). Canva Pro $14.99/mo or $119.99/yr. Canva Teams is priced per seat (~$10/seat/mo billed annually, 3-seat minimum). Canva for Education and Nonprofits free.",
    compareHref: "/compare/photoshop-vs-canva",
    compareLabel: "Photoshop vs Canva",
  },
];

const RELATED = [
  { href: "/compare/photoshop-vs-affinity-photo", label: "Photoshop vs Affinity Photo", note: "free, pro raster" },
  { href: "/compare/photoshop-vs-gimp", label: "Photoshop vs GIMP", note: "free, open-source, cross-platform" },
  { href: "/compare/photoshop-vs-photopea", label: "Photoshop vs Photopea", note: "open .psd in the browser" },
  { href: "/compare/photoshop-vs-pixelmator-pro", label: "Photoshop vs Pixelmator Pro", note: "Mac-native, one-time" },
  { href: "/compare/photoshop-vs-krita", label: "Photoshop vs Krita", note: "free digital painting" },
  { href: "/compare/photoshop-vs-capture-one", label: "Photoshop vs Capture One", note: "pro RAW workflow" },
  { href: "/compare/photoshop-vs-paintshop-pro", label: "Photoshop vs PaintShop Pro", note: "buy-once on Windows" },
  { href: "/compare/photoshop-vs-canva", label: "Photoshop vs Canva", note: "pros vs. non-designers" },
  { href: "/blog/best-photo-editing-software-2026", label: "Best Photo Editing Software 2026", note: "full ranked hub" },
];

export default function PhotoshopAlternativesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/alternatives" className="hover:text-primary-600">Alternatives</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-text font-medium">Photoshop</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-3 leading-tight">
            Best Photoshop Alternatives in 2026: 8 Image Editors That Are Actually Good
          </h1>
          <p className="text-sm text-text-secondary">Updated June 2026 · Pricing verified against provider pages.</p>
        </header>

        <article className="space-y-6">
          {/* Intro */}
          <section>
            <h2 className="text-2xl font-bold text-text mt-2 mb-4 pb-2 border-b border-border">Why look for a Photoshop alternative?</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Adobe Photoshop is the default professional image editor — the most powerful raster tool ever shipped, and
              the reason &ldquo;to photoshop&rdquo; became a verb. The recurring subscription cost is the most common reason people look
              elsewhere: Photoshop is <strong className="text-text font-semibold">subscription-only</strong> (no perpetual license), at roughly{" "}
              <strong className="text-text font-semibold">$22.99/mo for the single app billed annually, or ~$69.99/mo for Creative Cloud Pro (All Apps)</strong>.
              There&rsquo;s no way to buy it once and own it.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              Cost isn&rsquo;t the only reason. Some people want a <strong className="text-text font-semibold">free pro-grade tool</strong> they
              never pay for (Affinity, now free under Canva; GIMP and Krita, open-source). Some want a{" "}
              <strong className="text-text font-semibold">one-time purchase</strong> they own forever (Pixelmator Pro, Corel PaintShop Pro). Some
              want to open a .psd file <strong className="text-text font-semibold">in a browser</strong> in ten seconds without installing anything
              (Photopea). Some are <strong className="text-text font-semibold">photographers</strong> who care more about RAW processing and
              cataloguing than compositing (Capture One). And some are <strong className="text-text font-semibold">non-designers</strong> who just
              need a quick crop, background removal, or social graphic without learning a pro tool (Canva).
            </p>
            <p className="text-text-secondary leading-relaxed">
              This page is for photographers, designers, hobbyists, and teams evaluating whether one of these alternatives
              is a better fit than Photoshop — not a downgrade they&rsquo;ll regret. We&rsquo;ve organized it by use case so you can
              skip to the section that matches your reason for looking.
            </p>
          </section>

          {/* Glance table */}
          <section>
            <h2 className="text-2xl font-bold text-text mt-6 mb-4 pb-2 border-b border-border">The 8 best Photoshop alternatives at a glance</h2>
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {["#", "Alternative", "Best for", "Free tier", "Paid (entry)", "Key advantage over Photoshop"].map((h) => (
                      <th key={h} className="bg-primary-50 px-3 py-3 text-left font-semibold text-text border-b border-border whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALTS.map((a, idx) => (
                    <tr key={a.n} className={idx % 2 === 0 ? "bg-surface-alt" : "bg-white"}>
                      <td className="px-3 py-3 text-text-secondary border-b border-border">{a.n}</td>
                      <td className="px-3 py-3 border-b border-border">
                        <a href={`#alt-${a.n}`} className="font-semibold text-text hover:text-primary-600">{a.name}</a>
                      </td>
                      <td className="px-3 py-3 text-text-secondary border-b border-border">{a.bestFor}</td>
                      <td className="px-3 py-3 text-text-secondary border-b border-border">{a.freeTier}</td>
                      <td className="px-3 py-3 text-text-secondary border-b border-border whitespace-nowrap">{a.paidEntry}</td>
                      <td className="px-3 py-3 text-text-secondary border-b border-border">{a.advantage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Per-alternative sections */}
          {ALTS.map((a) => (
            <section key={a.n} id={`alt-${a.n}`} className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-text mt-6 mb-4 pb-2 border-b border-border">{a.n}. {a.heading}</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                <strong className="text-text font-semibold">Why it beats Photoshop:</strong> {a.why}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                  <p className="font-semibold text-text mb-2">When to choose {a.name.replace(/\s*\(.*\)/, "")} over Photoshop:</p>
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-text-secondary">
                    {a.chooseWhen.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
                <div className="bg-surface-alt border border-border rounded-xl p-4">
                  <p className="font-semibold text-text mb-2">When to stick with Photoshop:</p>
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-text-secondary">
                    {a.stickWhen.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>
              <p className="text-text-secondary leading-relaxed mb-2">
                <strong className="text-text font-semibold">Pricing:</strong> {a.pricing}
              </p>
              <p className="text-sm">
                <Link href={a.compareHref} className="text-primary-600 hover:text-primary-700 underline underline-offset-2">
                  Compare: {a.compareLabel} &rarr;
                </Link>
              </p>
            </section>
          ))}

          {/* How to choose */}
          <section>
            <h2 className="text-2xl font-bold text-text mt-6 mb-4 pb-2 border-b border-border">How to choose the right Photoshop alternative</h2>
            <p className="font-semibold text-text mb-2">By use case:</p>
            <ul className="list-disc list-inside space-y-1.5 text-text-secondary mb-4">
              <li>Free, pro-grade raster editing &rarr; <strong className="text-text font-semibold">Affinity</strong></li>
              <li>Free, open-source, no account &rarr; <strong className="text-text font-semibold">GIMP</strong></li>
              <li>Open a .psd in a browser instantly &rarr; <strong className="text-text font-semibold">Photopea</strong></li>
              <li>Mac-native image editing &rarr; <strong className="text-text font-semibold">Pixelmator Pro</strong></li>
              <li>Digital painting, illustration, comics &rarr; <strong className="text-text font-semibold">Krita</strong></li>
              <li>Professional photography / RAW workflow &rarr; <strong className="text-text font-semibold">Capture One</strong></li>
              <li>One-time purchase on Windows &rarr; <strong className="text-text font-semibold">Corel PaintShop Pro</strong></li>
              <li>Marketing assets and non-designer edits &rarr; <strong className="text-text font-semibold">Canva</strong></li>
              <li>Closest like-for-like Photoshop replacement &rarr; <strong className="text-text font-semibold">Affinity</strong> (free) or <strong className="text-text font-semibold">Photopea</strong> (free/browser)</li>
            </ul>
            <p className="font-semibold text-text mb-2">By budget:</p>
            <ul className="list-disc list-inside space-y-1.5 text-text-secondary mb-4">
              <li>$0: <strong className="text-text font-semibold">Affinity</strong>, <strong className="text-text font-semibold">GIMP</strong>, <strong className="text-text font-semibold">Krita</strong>, <strong className="text-text font-semibold">Photopea</strong> (ad-supported), <strong className="text-text font-semibold">Canva</strong> (free tier)</li>
              <li>One-time under $100: <strong className="text-text font-semibold">Pixelmator Pro</strong> ($49.99, Mac), <strong className="text-text font-semibold">Corel PaintShop Pro</strong> (~$79.99, Windows)</li>
              <li>Subscription: <strong className="text-text font-semibold">Canva Pro</strong> ($14.99/mo), <strong className="text-text font-semibold">Capture One</strong> (~$18/mo), <strong className="text-text font-semibold">Photopea Premium</strong> (~$5/mo)</li>
              <li>Compare against: <strong className="text-text font-semibold">Adobe Photoshop</strong> (single app ~$22.99/mo; no perpetual license)</li>
            </ul>
            <p className="font-semibold text-text mb-2">By platform:</p>
            <ul className="list-disc list-inside space-y-1.5 text-text-secondary">
              <li>Mac &rarr; <strong className="text-text font-semibold">Pixelmator Pro</strong>, <strong className="text-text font-semibold">Affinity</strong>, <strong className="text-text font-semibold">GIMP</strong>, <strong className="text-text font-semibold">Krita</strong></li>
              <li>Windows &rarr; <strong className="text-text font-semibold">Corel PaintShop Pro</strong>, <strong className="text-text font-semibold">Affinity</strong>, <strong className="text-text font-semibold">GIMP</strong>, <strong className="text-text font-semibold">Krita</strong></li>
              <li>Linux &rarr; <strong className="text-text font-semibold">GIMP</strong>, <strong className="text-text font-semibold">Krita</strong>, <strong className="text-text font-semibold">Photopea</strong> (browser)</li>
              <li>Chromebook / any browser &rarr; <strong className="text-text font-semibold">Photopea</strong>, <strong className="text-text font-semibold">Canva</strong></li>
              <li>iPad &rarr; <strong className="text-text font-semibold">Affinity</strong>, <strong className="text-text font-semibold">Procreate</strong> (painting; not covered above)</li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-text mt-6 mb-4 pb-2 border-b border-border">Frequently asked questions</h2>
            <div className="space-y-5">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <h3 className="font-bold text-text mb-1.5">{f.q}</h3>
                  <p className="text-text-secondary leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related comparisons */}
          <section>
            <h2 className="text-2xl font-bold text-text mt-6 mb-4 pb-2 border-b border-border">Related comparisons</h2>
            <ul className="space-y-2">
              {RELATED.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium">
                    {r.label}
                  </Link>
                  <span className="text-text-secondary text-sm"> — {r.note}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>

        {/* Newsletter Signup */}
        <div className="mt-12">
          <NewsletterSignup source="alternatives" referrerSlug="photoshop" />
        </div>
      </div>
    </>
  );
}
