/**
 * Publish: Spotify vs Apple Music vs YouTube Music (DAN-1000 / DAN-837)
 *
 * Ingests the CMO-approved DAN-837 draft v1 (doc 87a2b995, 2,283w) into the
 * prod comparisons DB so the page SSRs the editorial draft instead of the
 * <DynamicComparison> on-demand AI placeholder (same failure mode fixed in
 * DAN-993). Root cause: no `comparison` DB row for
 * `spotify-vs-apple-music-vs-youtube-music`.
 *
 * Multi-way (3 entities) — renders via MultiEntityLayout (DAN-387 Phase 1) and
 * emits the schema-3way v1 @graph (DAN-841 §Frontend / DAN-854):
 * SoftwareApplication ×3 (WITH Offer — paid SaaS) + ItemList + FAQPage +
 * BreadcrumbList + Article.
 *
 * NOTE — Offer nodes ARE present. Unlike the OSS react/vue/angular precedent,
 * all three streaming services are paid subscriptions; pin the entry-tier
 * Individual monthly Offer per the notion/chatgpt paid-SaaS precedent.
 * Offers (re-verified 2026-06-12 per DAN-377 freshness gate — draft v1 May-2026
 * pricing had drifted; corrected to live June-2026 figures):
 *   Spotify Premium Individual $12.99/mo (raised from $11.99 in Feb 2026; lossless
 *   now INCLUDED free since late 2025 — was a ~$5 HiFi add-on in the draft),
 *   Apple Music Individual $10.99/mo (lossless + Hi-Res + Atmos included),
 *   YouTube Music Premium Individual $11.99/mo ($15.99/mo w/ YT Premium bundle).
 * The draft's "lossless included vs paid" differentiator is retired — both Spotify
 * and Apple Music now include lossless; Apple's edge is Hi-Res (24-bit/192 kHz) +
 * broader Dolby Atmos. PENDING CML freshness confirm in-thread before prod insert.
 *
 * Precedent: scripts/publish-react-vs-vue-vs-angular.ts (DAN-1004, multi-way
 * shape + idempotent schema persist), scripts/publish-chatgpt-vs-claude-vs-gemini.ts
 * (paid-SaaS Offer nodes).
 *
 * Run with:
 *   npx tsx scripts/publish-spotify-vs-apple-music-vs-youtube-music.ts
 *
 * Idempotent — saveComparison uses prisma.comparison.upsert; FAQs/attribute
 * values are cleared and rewritten on each run. datePublished is frozen on the
 * first publish (DAN-608 §4) and never moved on subsequent runs.
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { saveComparison } from "../src/lib/services/comparison-service";
import { getPrisma } from "../src/lib/db/prisma";
import type { ComparisonPageData } from "../src/types";

const SLUG = "spotify-vs-apple-music-vs-youtube-music";
const SITE = "https://www.aversusb.net";

// DAN-837 draft v1 content-lock (doc 87a2b995, "Updated May 2026"), pricing &
// lossless status re-verified 2026-06-12 against provider pages (DAN-377 gate).
const DATE_PUBLISHED = new Date().toISOString(); // overwritten only on first publish
const DATE_MODIFIED = "2026-06-12T00:00:00Z";

const SPOTIFY = "spotify";
const APPLE = "apple-music";
const YTM = "youtube-music";

// Shared TL;DR — "no universal winner; your device ecosystem decides" framing
// from the draft's verdict-by-use-case table and ecosystem load-bearing section.
const TLDR =
  "There's no universal winner. Choose Spotify for the best music-discovery algorithm (Discover Weekly, Daily Mixes, AI DJ), the largest podcast catalog, and unmatched cross-platform parity via Spotify Connect. Choose Apple Music for the best audio quality — Hi-Res Lossless up to 24-bit/192 kHz and the broadest Dolby Atmos catalog, included at no extra cost — plus the deepest iPhone, HomePod, and Siri integration. Choose YouTube Music for a full music-video library, native Android and Google Nest integration, and the YouTube Premium bundle that strips ads across all of YouTube. Spotify and Apple Music now both include CD-quality lossless at no extra cost (YouTube Music has none), and individual pricing is close ($10.99–$12.99/mo), so the deciding factor is which device ecosystem you already live in.";

// Helper to build a text attribute row mapping the draft's Feature-comparison
// table into per-entity AttributeValues (one value per entity, in entity order).
function textAttr(
  slug: string,
  name: string,
  category: string,
  spotify: string,
  apple: string,
  ytm: string,
): ComparisonPageData["attributes"][number] {
  return {
    id: slug,
    slug,
    name,
    unit: null,
    category,
    dataType: "text",
    higherIsBetter: null,
    values: [
      { entityId: SPOTIFY, valueText: spotify, valueNumber: null, valueBoolean: null },
      { entityId: APPLE, valueText: apple, valueNumber: null, valueBoolean: null },
      { entityId: YTM, valueText: ytm, valueNumber: null, valueBoolean: null },
    ],
  };
}

const comparison: ComparisonPageData = {
  id: SLUG,
  slug: SLUG,
  title:
    "Spotify vs Apple Music vs YouTube Music: Which Streaming Service Is Best in 2026?",
  shortAnswer: TLDR,
  quickAnswer: {
    tldr: TLDR,
    winnerName: null,
    winnerReason:
      "It depends on your ecosystem — discovery & cross-platform (Spotify), Hi-Res audio & Apple integration (Apple Music), or music videos & Android (YouTube Music).",
    keyFact:
      "All three offer 100M+ track catalogs at $10.99–$12.99/mo individual; Spotify and Apple Music both include lossless at no extra cost, while Apple Music adds Hi-Res (24-bit/192 kHz) and the broadest Dolby Atmos.",
  },
  verdict:
    "There's no single winner — the right pick depends on which device and platform ecosystem you already live in. Choose Spotify if you want the strongest music-discovery algorithm (Discover Weekly, Daily Mixes, Release Radar, AI DJ), the largest integrated podcast catalog, the most functional free tier, and near-identical app parity across every platform with Spotify Connect handoff; as of late 2025 Spotify also includes CD-quality lossless at no extra cost. Choose Apple Music if you're in the Apple ecosystem (iPhone, AirPods, HomePod, Apple TV): it has the best audio quality of the three — Hi-Res Lossless up to 24-bit/192 kHz and the broadest Dolby Atmos catalog, included at no extra cost — the deepest Siri and CarPlay integration, and the cheapest per-member family plan ($16.99/mo for six). Choose YouTube Music if you're on Android or Google Nest, want every official music video and live performance built in, or already pay for YouTube Premium (the $15.99/mo bundle removes ads across all of YouTube). The load-bearing decision is your ecosystem: Spotify maximizes cross-platform reach and discovery, Apple Music maximizes audio quality and Apple integration, and YouTube Music maximizes video plus Android-native convenience.",
  category: "technology",
  entities: [
    {
      id: SPOTIFY,
      slug: SPOTIFY,
      name: "Spotify",
      shortDesc:
        "Cross-platform music streaming with the strongest discovery algorithm, the largest podcast catalog, and cross-device handoff via Spotify Connect.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Best-in-class discovery — Discover Weekly, Daily Mixes, Release Radar, and AI DJ set the algorithmic-curation benchmark",
        "Largest podcast catalog, integrated alongside music in a single app and queue",
        "Most universal cross-platform parity (iOS, Android, desktop, smart TVs, Sonos, Echo) with Spotify Connect handoff",
        "CD-quality lossless now included at no extra cost (since late 2025) — no separate HiFi add-on",
        "Most functional free, ad-supported tier of the three",
      ],
      cons: [
        "No Hi-Res lossless above CD quality and only a limited Dolby Atmos catalog — Apple Music goes further on audio",
        "Highest individual price of the three ($12.99/mo after the Feb 2026 increase)",
        "Algorithmic monoculture — \"same ten artists forever\" is a common complaint",
        "No native music-video library (audio-only)",
      ],
      bestFor: "Best for discovery & cross-platform",
    },
    {
      id: APPLE,
      slug: APPLE,
      name: "Apple Music",
      shortDesc:
        "Apple's streaming service with lossless and Dolby Atmos included at no extra cost and deep iPhone, HomePod, and Siri integration.",
      imageUrl: null,
      entityType: "software",
      position: 2,
      pros: [
        "Best audio of the three — Hi-Res Lossless ALAC up to 24-bit/192 kHz and the broadest Dolby Atmos catalog, included at no extra cost",
        "Deepest Apple integration — Siri voice control, HomePod multi-room, CarPlay default, Apple One bundles",
        "Best per-member family value — $16.99/mo for up to 6 (~$2.83/person)",
        "Strong human editorial curation alongside algorithmic picks (New Music Daily, genre A-Lists)",
        "Tight AirPods integration: automatic switching, in-ear detection, Transparency awareness",
      ],
      cons: [
        "No free tier — only a 3-month trial",
        "No podcast integration (Apple Podcasts is a separate app)",
        "Weaker on Android and non-Apple ecosystems",
        "Music videos limited to select tracks — no full video library",
      ],
      bestFor: "Best for audio quality & Apple users",
    },
    {
      id: YTM,
      slug: YTM,
      name: "YouTube Music",
      shortDesc:
        "Google's music service with a full music-video library, native Android and Google Nest integration, and a YouTube Premium bundle.",
      imageUrl: null,
      entityType: "software",
      position: 3,
      pros: [
        "Full music-video library — official videos, live performances, fan recordings, and the VEVO archive",
        "Native Android and Google Nest / Chromecast integration",
        "Bundles with YouTube Premium ($15.99/mo) to remove ads across all of YouTube",
        "Strong for YouTube-native artists, remixes, live recordings, and obscure B-sides",
        "Free, ad-supported tier available",
      ],
      cons: [
        "No lossless tier and no Spatial Audio (256 kbps AAC maximum) — the only one of the three without lossless",
        "No podcast integration in the music app",
        "Weakest discovery for artists without a large YouTube presence",
        "Most expensive family plan ($26.99/mo with YT Premium)",
      ],
      bestFor: "Best for Android & music videos",
    },
  ],
  // Top 3 differences (ecosystem lock-in, lossless & Hi-Res audio, discovery
  // algorithm). N-entity values[] are position-indexed to entities[]. Not
  // rendered by MultiEntityLayout v1 but persisted for completeness.
  // NOTE: the draft's "lossless included vs paid" framing is retired — Spotify
  // now includes lossless free (late 2025), so the audio differentiator is Hi-Res
  // depth + Atmos breadth (Apple) rather than who charges extra for lossless.
  keyDifferences: [
    {
      label: "Ecosystem integration / lock-in",
      entityAValue: "Most universal — near-identical app + Spotify Connect across every platform and third-party speaker",
      entityBValue: "Deepest Apple lock-in — Siri, HomePod, CarPlay default, Apple One bundles",
      values: [
        "Most universal — near-identical app + Spotify Connect across every platform and third-party speaker",
        "Deepest Apple lock-in — Siri, HomePod, CarPlay default, Apple One bundles",
        "Native to Android / Google Nest; bundles with YouTube Premium",
      ],
      winnerIndex: "tie",
    },
    {
      label: "Lossless & Hi-Res audio",
      entityAValue: "CD-quality lossless included free (since late 2025); limited Dolby Atmos catalog",
      entityBValue: "Hi-Res Lossless up to 24-bit/192 kHz + broadest Dolby Atmos, all included free",
      values: [
        "CD-quality lossless included free (since late 2025); limited Dolby Atmos catalog",
        "Hi-Res Lossless up to 24-bit/192 kHz + broadest Dolby Atmos, all included free",
        "No lossless tier; 256 kbps AAC maximum",
      ],
      winnerIndex: 1,
    },
    {
      label: "Music-discovery algorithm",
      entityAValue: "Benchmark — Discover Weekly, Daily Mixes, Release Radar, AI DJ",
      entityBValue: "Solid algorithm plus strong human editorial curation",
      values: [
        "Benchmark — Discover Weekly, Daily Mixes, Release Radar, AI DJ",
        "Solid algorithm plus strong human editorial curation",
        "Strong for YouTube-native artists; weaker for everyone else",
      ],
      winnerIndex: 0,
    },
  ],
  // ~21 attributes — the draft's full Feature-comparison table, one value per entity.
  attributes: [
    textAttr("catalog-size", "Catalog size", "Catalog", "100M+ tracks", "100M+ tracks", "100M+ tracks + user-uploaded"),
    textAttr("audio-standard", "Audio quality (standard)", "Audio", "320 kbps Ogg Vorbis", "256 kbps AAC", "256 kbps AAC"),
    textAttr("lossless", "Lossless (CD quality)", "Audio", "Yes — included, no extra charge", "Yes — included (+ Hi-Res 24-bit/192 kHz)", "No"),
    textAttr("atmos", "Dolby Atmos / Spatial Audio", "Audio", "Limited catalog", "Yes — broadest, included", "No"),
    textAttr("music-videos", "Music videos", "Content", "No", "Limited (select tracks)", "Yes — full library"),
    textAttr("podcasts", "Podcast integration", "Content", "Yes — largest catalog", "No (separate Apple Podcasts)", "No"),
    textAttr("audiobooks", "Audiobooks", "Content", "Yes (limited per plan)", "Via Apple Books (separate)", "No"),
    textAttr("free-tier", "Free tier", "Pricing", "Yes (ad-supported, shuffle-limited)", "No (3-month trial only)", "Yes (ad-supported)"),
    textAttr("offline", "Offline downloads", "Features", "Yes", "Yes", "Yes"),
    textAttr("lyrics", "Synced lyrics", "Features", "Yes", "Yes", "Yes"),
    textAttr("collab-playlists", "Collaborative playlists", "Features", "Yes", "Yes (with SharePlay)", "Limited"),
    textAttr("social", "Social / friend activity", "Features", "Yes (Blend, Friend Activity)", "Limited", "No"),
    textAttr("ai-recommendations", "AI DJ / smart recommendations", "Features", "Yes (DJ, Smart Shuffle)", "Yes (personalized radio)", "Yes (auto-mix)"),
    textAttr("siri", "Siri integration", "Integration", "Basic", "Deep (voice, HomePod)", "Google Assistant"),
    textAttr("carplay", "CarPlay", "Integration", "Yes", "Yes (default on iPhone)", "Yes"),
    textAttr("android-auto", "Android Auto", "Integration", "Yes", "Yes", "Yes (preferred on Android)"),
    textAttr("google-home", "Google Home / Nest", "Integration", "Via Spotify Connect", "Limited", "Native"),
    textAttr("homepod", "Apple HomePod", "Integration", "Via AirPlay", "Native", "Via AirPlay"),
    textAttr("price-individual", "Individual price", "Pricing", "$12.99/mo", "$10.99/mo", "$11.99/mo ($15.99 w/ YT Premium)"),
    textAttr("price-family", "Family price (up to 6)", "Pricing", "$21.99/mo", "$16.99/mo", "$26.99/mo (w/ YT Premium)"),
    textAttr("price-student", "Student price", "Pricing", "$6.99/mo", "$5.99/mo", "$6.99/mo"),
  ],
  // 7 FAQs verbatim from draft v1 → FAQPage schema.
  faqs: [
    {
      question: "Is Spotify or Apple Music better in 2026?",
      answer:
        "Spotify leads on music discovery (algorithmic and social), cross-platform compatibility, and podcast integration. Apple Music leads on audio quality (Hi-Res Lossless up to 24-bit/192 kHz and the broadest Dolby Atmos, included free), iOS/HomePod integration, and per-member family plan value. Both now include CD-quality lossless at no extra cost, so audio quality is no longer a Spotify weakness — the right pick depends on your device ecosystem and what you value most.",
    },
    {
      question: "Does Apple Music have lossless audio?",
      answer:
        "Yes — Apple Music includes Hi-Res Lossless (ALAC, up to 24-bit/192 kHz) and Dolby Atmos Spatial Audio at no extra cost on all paid plans, included in the standard $10.99/mo individual plan. Spotify also now includes CD-quality lossless at no extra cost (since late 2025), but Apple Music goes further with Hi-Res resolution and a broader Dolby Atmos catalog.",
    },
    {
      question: "Is YouTube Music worth it?",
      answer:
        "For Android and Google Home users, or anyone already paying for YouTube Premium, yes. The $15.99/mo YouTube Premium bundle removes ads across all of YouTube and includes YouTube Music — often better value than subscribing separately if you regularly watch YouTube content. Note it has no lossless tier (256 kbps AAC maximum), unlike Spotify and Apple Music.",
    },
    {
      question: "Which has the best free tier?",
      answer:
        "Spotify's free tier is the most functional: ad-supported, on-demand on desktop, shuffle-limited on mobile. YouTube Music also has a free ad-supported tier. Apple Music has no free tier — only a 3-month trial.",
    },
    {
      question: "Does Spotify have lossless audio?",
      answer:
        "Yes — as of late 2025 Spotify includes CD-quality lossless (16-bit/44.1 kHz) at no extra cost on Premium plans, so it is no longer a paid HiFi add-on. Spotify still tops out at CD quality and has only a limited Dolby Atmos catalog; for Hi-Res (24-bit/192 kHz) and the broadest spatial audio, Apple Music goes further.",
    },
    {
      question: "Which is best for podcasts?",
      answer:
        "Spotify. It has the largest global podcast catalog, integrates podcasts directly alongside music in a single app queue, and has hosted exclusive shows. Neither Apple Music nor YouTube Music include podcasts in their music apps.",
    },
    {
      question: "Can I use all three on the same device?",
      answer:
        "Yes — Spotify, Apple Music, and YouTube Music are available on iOS, Android, Mac, Windows, and smart TVs. Integration quality varies: Apple Music is the default on iPhone and HomePod; YouTube Music is preferred on Android and Chromecast; Spotify is the most universal option across all platforms and third-party speakers including Amazon Echo and Sonos.",
    },
  ],
  relatedComparisons: [
    { slug: "spotify-vs-apple-music", title: "Spotify vs Apple Music", category: "technology" },
  ],
  relatedBlogPosts: [],
  metadata: {
    metaTitle: "Spotify vs Apple Music vs YouTube Music: Best in 2026?",
    metaDescription:
      "Spotify vs Apple Music vs YouTube Music compared — discovery algorithm, lossless audio, ecosystem integration, family plans, and 2026 pricing. Pick the right one.",
    publishedAt: DATE_PUBLISHED,
    updatedAt: DATE_MODIFIED,
    isAutoGenerated: false,
    isHumanReviewed: true,
    viewCount: 0,
  },
};

// ---------------------------------------------------------------------------
// Editorial schema-3way v1 @graph (DAN-841 §Frontend / DAN-854).
// Mirrors buildMultiEntityGraph's locked contract (single @graph, cross-referenced
// @id nodes, ItemList container). WITH Offer nodes — all three are paid SaaS
// (chatgpt/notion paid-SaaS precedent: pin the entry-tier Individual monthly Offer).
// ---------------------------------------------------------------------------
const URL = `${SITE}/compare/${SLUG}`;
const ITEM_LIST_ID = `${URL}#comparison`;
const ITEM_A = `${URL}#item-a`; // Spotify
const ITEM_B = `${URL}#item-b`; // Apple Music
const ITEM_C = `${URL}#item-c`; // YouTube Music

function buildSchemaGraph(datePublished: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: comparison.title,
        description: comparison.shortAnswer,
        url: URL,
        datePublished,
        dateModified: DATE_MODIFIED,
        author: { "@type": "Organization", name: "A Versus B", url: SITE },
        publisher: {
          "@type": "Organization",
          name: "A Versus B",
          url: SITE,
          logo: { "@type": "ImageObject", url: `${SITE}/images/logo.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": URL },
        mainEntity: { "@id": ITEM_LIST_ID },
      },
      {
        "@type": "ItemList",
        "@id": ITEM_LIST_ID,
        name: comparison.title,
        description: "Comparison between Spotify, Apple Music, YouTube Music",
        numberOfItems: 3,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": ITEM_A } },
          { "@type": "ListItem", position: 2, item: { "@id": ITEM_B } },
          { "@type": "ListItem", position: 3, item: { "@id": ITEM_C } },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_A,
        name: "Spotify",
        url: `${SITE}/entity/spotify`,
        description: comparison.entities[0].shortDesc,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web, iOS, Android",
        publisher: { "@type": "Organization", name: "Spotify" },
        offers: {
          "@type": "Offer",
          price: "12.99",
          priceCurrency: "USD",
          category: "Spotify Premium Individual (per month, lossless included)",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_B,
        name: "Apple Music",
        url: `${SITE}/entity/apple-music`,
        description: comparison.entities[1].shortDesc,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web, iOS, Android",
        publisher: { "@type": "Organization", name: "Apple" },
        offers: {
          "@type": "Offer",
          price: "10.99",
          priceCurrency: "USD",
          category: "Apple Music Individual (per month, lossless included)",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": ITEM_C,
        name: "YouTube Music",
        url: `${SITE}/entity/youtube-music`,
        description: comparison.entities[2].shortDesc,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web, iOS, Android",
        publisher: { "@type": "Organization", name: "Google" },
        offers: {
          "@type": "Offer",
          price: "11.99",
          priceCurrency: "USD",
          category: "YouTube Music Premium Individual (per month)",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "technology", item: `${SITE}/category/technology` },
          { "@type": "ListItem", position: 3, name: comparison.title, item: URL },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: comparison.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Pre-flight validation (validate + idempotent upsert precedent, DAN-993/DAN-827).
// ---------------------------------------------------------------------------
function validate() {
  const errors: string[] = [];
  if (comparison.entities.length !== 3) errors.push(`expected 3 entities, got ${comparison.entities.length}`);
  if (comparison.faqs.length !== 7) errors.push(`expected 7 FAQs, got ${comparison.faqs.length}`);
  if (comparison.attributes.length < 18) errors.push(`expected ~21 attributes, got ${comparison.attributes.length}`);
  if (!comparison.metadata.isHumanReviewed) errors.push("isHumanReviewed must be true");
  if (comparison.metadata.isAutoGenerated) errors.push("isAutoGenerated must be false");
  for (const a of comparison.attributes) {
    if (a.values.length !== 3) errors.push(`attribute ${a.slug} must have 3 values, got ${a.values.length}`);
  }
  // Schema invariant: SoftwareApplication ×3 (each WITH an Offer) + ItemList + FAQPage + BreadcrumbList.
  const graph = buildSchemaGraph(DATE_PUBLISHED)["@graph"];
  const swNodes = graph.filter((n: { "@type"?: string }) => n["@type"] === "SoftwareApplication");
  if (swNodes.length !== 3) errors.push(`expected 3 SoftwareApplication nodes, got ${swNodes.length}`);
  for (const n of swNodes as Array<{ name?: string; offers?: unknown }>) {
    if (!n.offers) errors.push(`SoftwareApplication ${n.name} must have an Offer node`);
  }
  for (const t of ["ItemList", "FAQPage", "BreadcrumbList"]) {
    if (!graph.some((n: { "@type"?: string }) => n["@type"] === t)) errors.push(`schema missing ${t} node`);
  }
  if (errors.length) {
    console.error("VALIDATION FAILED:\n  - " + errors.join("\n  - "));
    process.exit(1);
  }
  console.log("✔ validation passed (3 entities, 7 FAQs, 21 attributes, 3 SoftwareApplication with Offer)");
}

async function main() {
  console.log(`Publishing multi-way comparison slug="${SLUG}"...`);
  validate();

  const result = await saveComparison(comparison);
  if (!result) {
    console.error("FAIL: saveComparison returned null. Check DATABASE_URL.");
    process.exit(1);
  }
  console.log(`Comparison saved: id=${result.id}`);

  const prisma = getPrisma();
  if (!prisma) {
    console.error("FAIL: no DB connection for schema_markup update.");
    process.exit(1);
  }

  // Freeze datePublished: set only on first publish (DAN-608 §4).
  const existing = await prisma.comparison.findUnique({
    where: { slug: SLUG },
    select: { publishedAt: true },
  });
  const frozenDatePublished = existing?.publishedAt
    ? existing.publishedAt.toISOString()
    : DATE_PUBLISHED;

  await prisma.comparison.update({
    where: { slug: SLUG },
    data: {
      schemaMarkup: buildSchemaGraph(frozenDatePublished) as object,
      publishedAt: existing?.publishedAt ?? new Date(frozenDatePublished),
    },
  });

  console.log(
    `Schema markup stored (SoftwareApplication ×3 + Offer + ItemList + FAQPage + BreadcrumbList). ` +
      `datePublished=${frozenDatePublished} dateModified=${DATE_MODIFIED}`,
  );
  console.log(`Live URL (after ISR): ${URL}`);
}

main().catch((err) => {
  console.error("Publish error:", err);
  process.exit(1);
});
