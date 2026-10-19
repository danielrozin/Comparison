import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Apple Music vs YouTube Music. The
 * existing alias youtube-music-vs-apple-music points here. Facts read
 * 19 October 2026 from apple.com/apple-music and Google's YouTube Music
 * Premium help article. YouTube Music Premium's U.S. price could not be read
 * on a Google page from this region (geo-priced), so no YouTube Music dollar
 * figure is printed; readers get the vendor link. No winner.
 */

const A = "apple-music";
const B = "youtube-music";

const APPLE_MUSIC = "https://www.apple.com/apple-music/";
const YTM_HELP = "https://support.google.com/youtubemusic/answer/9266556";
const YTM_PREMIUM = "https://www.youtube.com/musicpremium";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Music streaming";

const AM_INDIVIDUAL = "$11.99/month, per Apple Music pricing page, Oct 2026";
const AM_FAMILY = "$19.99/month, per Apple Music pricing page, Oct 2026";
const AM_STUDENT = "$6.99/month, per Apple Music pricing page, Oct 2026";

const SHORT_ANSWER = `Apple Music is an ad-free paid service with more than 100 million songs, Spatial Audio with Dolby Atmos and lossless audio up to 24-bit/192kHz, at ${AM_INDIVIDUAL} for an individual plan. YouTube Music Premium is built on YouTube's catalog: Google says it plays songs and music videos without ads and adds downloads, Smart Downloads and an audio-only mode. Neither is better for everyone.`;

const FAQS = [
  {
    question: "How much does Apple Music cost?",
    answer: `Apple Music Individual is ${AM_INDIVIDUAL}. Family is ${AM_FAMILY} and can be shared with up to five people through Family Sharing, and Student is ${AM_STUDENT} with Apple TV included.`,
  },
  {
    question: "How much does YouTube Music Premium cost?",
    answer:
      "Google sells YouTube Music Premium as a paid membership, and the price depends on where you live. See vendor page for current price.",
  },
  {
    question: "Which has better sound quality?",
    answer:
      "Apple says Apple Music includes Spatial Audio with Dolby Atmos, Lossless up to 24-bit/48kHz and Hi-Res Lossless from 48kHz up to 192kHz. Google lists ad-free music videos and an audio-only mode among YouTube Music Premium benefits.",
  },
  {
    question: "Does YouTube Music Premium remove all ads?",
    answer:
      "Google says YouTube Music Premium plays songs and music videos without ads, though members may still hear ads on podcasts. Apple says Apple Music is ad-free.",
  },
  {
    question: "Can I download songs to listen offline?",
    answer:
      "Both services support offline downloads. Google says YouTube Music Premium members can download music and podcasts for up to 30 days, and Smart Downloads add music automatically based on listening history.",
  },
  {
    question: "Does Apple Music work on Android and Windows?",
    answer:
      "Yes. Apple says Apple Music works on Apple devices, Android, Windows, Sonos speakers, Amazon Echo, Google Nest and smart TVs, and includes free access to the Apple Music Classical app.",
  },
];

const VERDICT = `Best for high-resolution audio and Apple devices: Apple Music, with Spatial Audio, Hi-Res Lossless up to 192kHz and plans at ${AM_INDIVIDUAL}.

Best for music videos and YouTube's catalog: YouTube Music Premium, with ad-free music, Smart Downloads and audio-only mode.

Both offer offline downloads; see vendor page for current YouTube Music price.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Apple Music Individual is ${AM_INDIVIDUAL}.
- Apple Music Family is ${AM_FAMILY}; Student is ${AM_STUDENT} with Apple TV.
- Apple says Apple Music has more than 100 million songs and Hi-Res Lossless up to 192kHz.
- Google says YouTube Music Premium plays songs and music videos without ads and adds Smart Downloads.
- YouTube Music Premium price depends on where you live; see vendor page for current price.

Plans and price

Apple Music has Individual at ${AM_INDIVIDUAL}, Family at ${AM_FAMILY}, shared with up to five people through Family Sharing, and Student at ${AM_STUDENT}, which includes Apple TV. Apple offers new subscribers a free first month. YouTube Music Premium is a paid membership; see vendor page for current price.

Sound quality

Apple says Apple Music supports Spatial Audio with Dolby Atmos, Lossless up to 24-bit/48kHz and Hi-Res Lossless from 48kHz up to 192kHz. Google says YouTube Music Premium adds an audio-only mode that plays music without loading a video.

Ads and offline listening

Apple says Apple Music is ad-free. Google says YouTube Music Premium removes ads from songs and music videos, while members may still hear ads on podcasts. Both services download music for offline listening; Google says YouTube Music Premium downloads last up to 30 days, and Smart Downloads add music based on listening history.

Devices and extras

Apple Music runs on Apple devices, Android, Windows, Sonos and smart TVs, and includes Apple Music Classical. Google says YouTube Music Premium members can cast music to speakers and TVs and keep their library while traveling for 6 months.

Who should pick which

Pick Apple Music for lossless and Dolby Atmos audio or an Apple One bundle. Pick YouTube Music Premium if you watch music videos and want YouTube's catalog without ads. Apple Music vs Spotify and Spotify vs YouTube Music compare the other big option.`;

const BUILT = buildEditorialComparison({
  slug: "apple-music-vs-youtube-music",
  title: "Apple Music vs YouTube Music: Plans, Audio",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "entertainment",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Apple Music",
      shortDesc: "Apple's ad-free music service with more than 100 million songs and Hi-Res Lossless audio.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: ["Spatial Audio with Dolby Atmos", "Hi-Res Lossless up to 24-bit/192kHz", "Student plan includes Apple TV"],
      cons: ["Hi-Res Lossless needs external equipment such as a USB DAC", "Lossless files use much more storage and bandwidth"],
      bestFor: "Listeners who want lossless audio and use Apple devices",
    },
    {
      id: B,
      slug: B,
      name: "YouTube Music",
      shortDesc: "Google's music service built on YouTube, with an ad-free Premium tier.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: ["Ad-free songs and music videos with Premium", "Smart Downloads", "Audio-only mode"],
      cons: ["Downloads last up to 30 days", "Podcasts may still carry ads for Premium members"],
      bestFor: "Listeners who watch music videos and want YouTube's catalog",
    },
  ],
  keyDifferences: [
    { label: "Individual plan", entityAValue: AM_INDIVIDUAL, entityBValue: "See vendor page for current price", winner: "tie" },
    { label: "Audio quality", entityAValue: "Spatial Audio, Hi-Res Lossless up to 192kHz", entityBValue: "Ad-free music videos and audio-only mode", winner: "tie" },
    { label: "Ads", entityAValue: "Ad-free", entityBValue: "Ad-free songs and videos with Premium; podcasts may have ads", winner: "tie" },
    { label: "Offline", entityAValue: "Downloads", entityBValue: "Downloads for up to 30 days; Smart Downloads", winner: "tie" },
  ],
  attributes: [
    textAttr("individual", "Individual plan", GROUP, A, B, AM_INDIVIDUAL, "See vendor page for current price"),
    textAttr("family", "Family and student", GROUP, A, B, `Family ${AM_FAMILY}; Student ${AM_STUDENT} with Apple TV`, "See vendor page for current price"),
    textAttr("catalog", "Catalog", GROUP, A, B, "More than 100 million songs", "Songs, music videos and podcasts"),
    textAttr("audio", "Audio formats", GROUP, A, B, "Spatial Audio with Dolby Atmos; Lossless and Hi-Res Lossless", "Audio-only mode or music video"),
    textAttr("offline", "Offline listening", GROUP, A, B, "Downloads", "Downloads for up to 30 days; Smart Downloads"),
    textAttr("devices", "Devices", GROUP, A, B, "Apple devices, Android, Windows, Sonos, smart TVs", "YouTube Music app, web and casting to speakers and TVs"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "apple-music-vs-spotify", title: "Apple Music vs Spotify", category: "entertainment" },
    { slug: "spotify-vs-youtube-music", title: "Spotify vs YouTube Music", category: "entertainment" },
    { slug: "spotify-vs-apple-music-vs-youtube-music", title: "Spotify vs Apple Music vs YouTube Music", category: "entertainment" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Apple Music for lossless audio and Apple devices; YouTube Music Premium for music videos and YouTube's catalog.",
    keyFact: `Apple Music Individual is ${AM_INDIVIDUAL}, with Hi-Res Lossless up to 192kHz.`,
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 14,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple: Apple Music", url: APPLE_MUSIC },
      { name: "YouTube Music Help: Premium benefits", url: YTM_HELP },
      { name: "See vendor page for current price: YouTube Music Premium", url: YTM_PREMIUM },
    ],
  },
  resources: [
    { type: "external", label: "Apple: Apple Music", url: APPLE_MUSIC, description: `Individual ${AM_INDIVIDUAL}; Family and Student plans; 100M+ songs; Spatial Audio and Lossless.` },
    { type: "external", label: "YouTube Music Help: Premium benefits", url: YTM_HELP, description: "Ad-free songs and videos, 30-day downloads, Smart Downloads, audio-only mode, casting." },
    { type: "external", label: "See vendor page for current price: YouTube Music Premium", url: YTM_PREMIUM, description: "YouTube Music Premium membership and current price." },
  ],
  metaTitle: "Apple Music vs YouTube Music: Plans, Audio",
});

BUILT.metadata.metaDescription =
  "Apple Music vs YouTube Music: plans, Hi-Res Lossless and Spatial Audio against YouTube's catalog, music videos, Smart Downloads and ad-free Premium.";

export const APPLE_MUSIC_VS_YOUTUBE_MUSIC: EditorialComparison = BUILT;
