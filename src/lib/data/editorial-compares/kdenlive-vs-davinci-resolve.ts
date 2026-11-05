import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-266 — Kdenlive vs DaVinci Resolve for a laptop without a dedicated GPU.
 * Opened 5 November 2026 (Asia/Jerusalem).
 * Kdenlive: kdenlive.org, the download (26.08.2), and the license note.
 * Resolve: blackmagicdesign.com/products/davinciresolve and the download's
 * published operating-system lines. Those lines do not name RAM or a GPU.
 * License: GNU GPL version 3 on the KDE GitHub mirror.
 * No winner. No invented RAM, VRAM, or render benchmarks.
 * Reddit returned HTTP 403, so there is no community block.
 */

const KDENLIVE = "kdenlive";
const RESOLVE = "davinci-resolve";

const KDENLIVE_HOME = "https://kdenlive.org/";
const KDENLIVE_DOWNLOAD = "https://kdenlive.org/download/";
const KDENLIVE_ABOUT = "https://kdenlive.org/about/";
const KDENLIVE_GITHUB = "https://github.com/KDE/kdenlive";
const RESOLVE_PRODUCT = "https://www.blackmagicdesign.com/products/davinciresolve";
const RESOLVE_DOWNLOAD = "https://www.blackmagicdesign.com/event/davinciresolvedownload";
const PREMIERE_GUIDE =
  "https://www.aversusb.net/blog/davinci-resolve-free-vs-premiere-pro-2026-complete-decision-guide";

const SOURCE_DATE = "2026-11-05";
const PUBLISHED = "2026-11-05T00:00:00Z";
const SPEC = "Editor";

const SHORT_ANSWER =
  "Kdenlive 26.08.2 is a free GPL editor that uses proxies for smooth playback on low-end systems. DaVinci Resolve 21 has a free download for Mac, Windows, and Linux. Blackmagic lists macOS 12 Monterey, Windows 10 Creators Update, and Rocky Linux 8.6 or CentOS 7.3, and does not list a RAM or GPU minimum on that download. The free Resolve download works with virtually all 8-bit video at up to 60fps as high as Ultra HD 3840 x 2160. Neither editor is ahead for every laptop.";

const FAQS = [
  {
    question: "Can DaVinci Resolve run on a laptop without a dedicated GPU?",
    answer:
      "Blackmagic's download does not list a dedicated GPU, a VRAM size, or a RAM size. It lists macOS 12 Monterey, Windows 10 Creators Update, Rocky Linux 8.6 or CentOS 7.3, and iPadOS 16 or later on an iPad with an A12 Bionic chip or later. On the product description, DaVinci Resolve Studio's Resolve FX are GPU and CPU accelerated, and the DaVinci Neural Engine uses GPU innovations. Those sentences describe Studio effects and the Neural Engine. The download does not list them as a minimum for the free download.",
  },
  {
    question: "What system requirements does Blackmagic publish for DaVinci Resolve?",
    answer:
      "On the DaVinci Resolve download, the minimum system requirements are macOS 12 Monterey, Windows 10 Creators Update, Rocky Linux 8.6 or CentOS 7.3, and iPadOS 16.0 or later on an iPad with an A12 Bionic chip or later. The same download says there are no monthly subscriptions, no ads, and no user tracking. It does not list a RAM or GPU minimum.",
  },
  {
    question: "What is free in DaVinci Resolve, and what is Studio?",
    answer:
      "Blackmagic offers a free version so you can learn the same tools Hollywood artists use. The free version works with virtually all 8-bit video formats at up to 60fps in resolutions as high as Ultra HD 3840 x 2160, and it includes multi-user collaboration and HDR grading. DaVinci Resolve Studio is a separate purchase. It adds the DaVinci Neural Engine, dozens of additional Resolve FX, temporal and AI spatial noise reduction, text based editing, magic mask, film grain, optical blur, and support for 10-bit video up to 120 frames per second and resolutions beyond 4K. The product description also says Studio adds tons of additional effects, 3D, and more.",
  },
  {
    question: "Does Kdenlive have proxy editing for a modest laptop?",
    answer:
      "Yes. Kdenlive says you can use proxies for smooth playback even on low-end systems. The current download is 26.08.2. It requires Windows 10 or newer, or macOS 13 Ventura or newer, and it does not list a RAM or GPU figure. For Shotcut's published RAM list, see Kdenlive vs Shotcut.",
  },
  {
    question: "Which platforms does each editor list?",
    answer:
      "Kdenlive's site says Linux, Windows, macOS, and BSD. Download 26.08.2 is Windows 10 or newer, a Linux AppImage and a Flathub Flatpak, and macOS 13 Ventura or newer for Apple silicon and Intel. DaVinci Resolve 21 is described for Mac, Windows, and Linux, with Blackmagic Cloud collaboration. The download's minimum lines are macOS 12 Monterey, Windows 10 Creators Update, Rocky Linux 8.6 or CentOS 7.3, and iPadOS 16.0 or later on an iPad with an A12 Bionic chip or later.",
  },
  {
    question: "When should a Kdenlive project move to DaVinci Resolve?",
    answer:
      "Move when you want Blackmagic's cut, edit, Fusion, color, Fairlight, media, deliver, and Photo workspaces in one app, and you can work inside the free download's 8-bit, 60fps, Ultra HD 3840 x 2160 limit, or you are ready to buy Studio for 10-bit, 120 fps, and resolutions beyond 4K. Kdenlive stays the no-fee GPL editor with proxies for low-end playback. When the other app is Premiere Pro, read the DaVinci Resolve free vs Premiere Pro decision guide.",
  },
];

const VERDICT = `Modest laptop, school project or skit: Kdenlive 26.08.2. It is free under the GNU GPL, and it says proxies are for smooth playback even on low-end systems. Its download does not list a RAM or GPU figure. Windows 10 or newer, or macOS 13 Ventura or newer, is what the download requires.

Same laptop, and you want Fusion, the color workspace, and Fairlight in one app: the free DaVinci Resolve download, if the footage fits virtually all 8-bit formats at up to 60fps as high as Ultra HD 3840 x 2160. Blackmagic's download lists operating systems and does not list a RAM or GPU minimum. Studio is the purchase for the Neural Engine, 10-bit, 120 fps, and resolutions beyond 4K.

Neither editor is ahead for every laptop.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Quick verdict by hardware

Kdenlive publishes a proxy sentence and an operating-system floor, not a RAM table. Kdenlive says to use proxies for smooth playback even on low-end systems. Download 26.08.2 requires Windows 10 or newer, or macOS 13 Ventura or newer.

DaVinci Resolve's download publishes operating-system lines and nothing further for memory or graphics. The lines are macOS 12 Monterey, Windows 10 Creators Update, Rocky Linux 8.6 or CentOS 7.3, and iPadOS 16.0 or later on an iPad with an A12 Bionic chip or later. The product description says Studio Resolve FX are GPU and CPU accelerated, and that the Neural Engine uses the latest GPU innovations for AI and deep learning. Read those as descriptions of Studio effects and the Neural Engine. The download does not list them as a RAM or GPU minimum.

What each editor is

Kdenlive is the KDE Non-Linear Video Editor. It is free and open source. The interface is C++ and Qt, with KDE libraries, on the MLT framework by Dan Dennedy. MLT relies on FFmpeg. Frei0r and Movit supply video effects. LADSPA supplies audio effects. The license note says there are no license fees, no registrations or subscriptions, and no premium features that require payment to be unlocked. The KDE GitHub mirror is GPL-3.0. COPYING is GNU General Public License version 3.

DaVinci Resolve 21 is Blackmagic's editor for editing, visual effects, motion graphics, color correction, and audio post, for Mac, Windows, and Linux, with Blackmagic Cloud collaboration. It is split into workspaces: cut and edit for editing, Fusion for visual effects and motion graphics, the color workspace for color correction, Fairlight for audio, and media and deliver for organization and output. Resolve 21 adds a Photo workspace for still photos, including native RAW from Canon, Fujifilm, Nikon, and Sony. The download says there are no monthly subscriptions, no ads, and no user tracking.

Performance on a modest laptop

Kdenlive's lever for a low-end system is the proxy control named on the home page. The download does not add a RAM or GPU number to that sentence. Daily builds are not the 26.08.2 installer. Kdenlive says daily builds can be unstable and can corrupt existing projects, and that they are for testing.

Resolve's free download states a format ceiling rather than a memory floor: virtually all 8-bit video formats at up to 60fps, as high as Ultra HD 3840 x 2160, plus multi-user collaboration and HDR grading. Fairlight, on the product description, can work with up to 2,000 tracks with realtime effects, EQ, and dynamics. That track count is a Fairlight feature description, not a laptop benchmark. Studio is where Blackmagic describes multiple-GPU performance, Metal and Apple silicon on a Mac, and OpenCL and CUDA on Windows and Linux, plus extra Resolve FX that are GPU and CPU accelerated. Buying Studio is separate from installing the free download.

Features for school projects and skits

Kdenlive's home page names multicam, 3-point editing, nested sequences, markers, and automatic backups. Audio includes mixers, built-in voiceover recording, and an audio spectrum. Effects and keyframes, transitions, and compositions are on the home page. Color includes LUTs, basic correction, creative grading, and histogram, vectorscope, RGB parade, and waveform. Subtitles can use automatic transcription. Titles can be simple title clips or Glaxnimate motion graphics.

Resolve's free download includes the editing, color, Fusion, and Fairlight workspaces, not only a cut workspace. The color description names primary sliders for contrast, temperature, mid-tone detail, and saturation, plus PowerWindows, qualifiers, and tracking. Fusion is node based, with 2D and 3D tools, tracking, rotoscope, and keying. Fairlight includes sample-accurate editing, ADR, Foley, and effects such as reverb and a de-esser. Titles, transitions, and effects are part of the editing description on the download. The free format ceiling still applies: 8-bit, up to 60fps, Ultra HD 3840 x 2160.

What you learn first

Kdenlive describes a customizable interface from ingest to the final touch, and puts multicam, 3-point editing, nested sequences, and markers forward.

Blackmagic says the interface is fast to learn for new users and powerful for professionals, because editing, color, effects, and audio stay in one tool instead of several apps. The workspaces are a click apart. That is Blackmagic's description of the layout. It is not a measured training time.

Platforms

Kdenlive: Linux, Windows, macOS, and BSD. Installers for 26.08.2 are Windows 10 or newer (installable and standalone), Linux AppImage and stable Flathub Flatpak, and macOS silicon and Intel for macOS 13 Ventura or newer.

DaVinci Resolve 21: Mac, Windows, and Linux on the product description. Download minimums: macOS 12 Monterey, Windows 10 Creators Update, Rocky Linux 8.6 or CentOS 7.3. The same list adds iPadOS 16.0 or later on an iPad with an A12 Bionic chip or later. Kdenlive's macOS floor (Ventura) is newer than Resolve's macOS 12 Monterey line. Kdenlive's Windows floor is Windows 10 or newer. Resolve's Windows line is Windows 10 Creators Update.

When to move from Kdenlive to Resolve

Move when the project needs Fusion, Fairlight, or the color workspace, and the footage fits the free download or you are buying Studio. Stay on Kdenlive when you want the GPL download, no Studio purchase, and proxies for low-end playback, including on BSD, which Resolve's download does not name.

The matching compare for the other free MLT editor, including Shotcut's published RAM figures, is Kdenlive vs Shotcut at /compare/kdenlive-vs-shotcut. When the other commercial app is Premiere Pro, the guide is DaVinci Resolve free vs Premiere Pro.`;

export const KDENLIVE_VS_DAVINCI_RESOLVE: EditorialComparison = buildEditorialComparison({
  slug: "kdenlive-vs-davinci-resolve",
  title: "Kdenlive vs DaVinci Resolve",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: KDENLIVE,
      slug: KDENLIVE,
      name: "Kdenlive",
      shortDesc: "KDE Non-Linear Video Editor 26.08.2, free under GPL version 3, with proxies for low-end playback.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "Free and open source. No license fees, registrations, subscriptions, or paid feature locks (Kdenlive)",
        "Proxies for smooth playback even on low-end systems (Kdenlive)",
        "Download 26.08.2 for Windows 10 or newer, Linux, and macOS 13 Ventura or newer",
        "Home page names voiceover, automatic transcription, nested sequences, and scopes",
      ],
      cons: [
        "The download does not list a RAM or GPU figure",
        "Daily builds can be unstable and can corrupt existing projects",
        "macOS requires 13 Ventura or newer, a newer floor than Resolve's macOS 12 Monterey line",
        "It does not include Fusion, Fairlight, or Blackmagic's color workspace",
      ],
      bestFor: "A no-fee GPL editor with proxies on a modest laptop",
    },
    {
      id: RESOLVE,
      slug: RESOLVE,
      name: "DaVinci Resolve",
      shortDesc: "Blackmagic's free Resolve 21 download, plus paid Studio, for Mac, Windows, and Linux.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Free download. The download says no monthly subscriptions, no ads, and no user tracking",
        "Cut, edit, Fusion, color, Fairlight, media, deliver, and Photo in Resolve 21 (Blackmagic)",
        "Free version: 8-bit video, up to 60fps, Ultra HD 3840 x 2160, collaboration, and HDR grading",
        "Download lists macOS 12 Monterey, Windows 10 Creators Update, and Rocky Linux 8.6 or CentOS 7.3",
      ],
      cons: [
        "The download does not list a RAM or GPU minimum",
        "Studio is a separate purchase for the Neural Engine, 10-bit, 120 fps, and resolutions beyond 4K",
        "Studio Resolve FX are described as GPU and CPU accelerated",
        "Free delivery stops at Ultra HD 3840 x 2160 and 60fps in the 8-bit formats Blackmagic names",
      ],
      bestFor: "Color, Fusion, and Fairlight once the free format limit fits",
    },
  ],
  keyDifferences: [
    {
      label: "Price",
      entityAValue: "No license fee",
      entityBValue: "Free download. Studio is a purchase",
      winner: "tie",
    },
    {
      label: "License",
      entityAValue: "GPL version 3",
      entityBValue: "Blackmagic free download and paid Studio",
      winner: "tie",
    },
    {
      label: "Named release",
      entityAValue: "26.08.2",
      entityBValue: "DaVinci Resolve 21",
      winner: "tie",
    },
    {
      label: "Published minimum",
      entityAValue: "Windows 10 or newer, or macOS 13",
      entityBValue: "macOS 12, Windows 10 Creators Update, Rocky Linux 8.6 or CentOS 7.3",
      winner: "tie",
    },
    {
      label: "Low-end playback",
      entityAValue: "Proxies on low-end systems",
      entityBValue: "No RAM or GPU figure on the download",
      winner: "tie",
    },
    {
      label: "Free format ceiling",
      entityAValue: "Almost any audio or video format on ingest",
      entityBValue: "8-bit, up to 60fps, Ultra HD 3840 x 2160",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("price", "Price", SPEC, KDENLIVE, RESOLVE, "No license fees, registrations, subscriptions, or paid feature locks", "Free download. Studio is a separate purchase for Neural Engine, extra effects, and higher formats"),
    textAttr("license", "License", SPEC, KDENLIVE, RESOLVE, "GNU GPL version 3 on the KDE GitHub mirror", "Blackmagic Design software. Free version and paid Studio"),
    textAttr("version", "Named release", SPEC, KDENLIVE, RESOLVE, "26.08.2. Daily builds are for testing and can corrupt projects", "DaVinci Resolve 21, with a free download and DaVinci Resolve Studio 21"),
    textAttr("platforms", "Platforms", SPEC, KDENLIVE, RESOLVE, "Linux, Windows, macOS, and BSD. Windows 10 or newer. macOS 13 Ventura or newer. Linux AppImage and Flathub", "Mac, Windows, and Linux. Download: macOS 12 Monterey, Windows 10 Creators Update, Rocky Linux 8.6 or CentOS 7.3, plus iPadOS 16 on A12 or later"),
    textAttr("hardware", "Published hardware minimum", SPEC, KDENLIVE, RESOLVE, "Operating systems on the download. No RAM or GPU figure there", "Operating systems on the download. No RAM or GPU figure there"),
    textAttr("playback", "Modest-laptop note", SPEC, KDENLIVE, RESOLVE, "Proxies for smooth playback even on low-end systems", "Studio FX are GPU and CPU accelerated. The Neural Engine uses GPU innovations. The download does not list a GPU minimum"),
    textAttr("formats", "Free format ceiling", SPEC, KDENLIVE, RESOLVE, "Ingest in almost any audio or video format", "Virtually all 8-bit formats, up to 60fps, as high as Ultra HD 3840 x 2160. Studio adds 10-bit, 120 fps, and resolutions beyond 4K"),
    textAttr("school", "School and skit tools", SPEC, KDENLIVE, RESOLVE, "Voiceover, automatic transcription, title clips, multicam, nested sequences, and scopes", "Cut and edit, Fusion, color, Fairlight, titles and transitions on the download, and the Photo workspace in version 21"),
    textAttr("color-audio", "Color and audio", SPEC, KDENLIVE, RESOLVE, "LUTs, basic and creative grading, histogram, vectorscope, RGB parade, waveform, mixers, and voiceover", "Color workspace with PowerWindows and qualifiers. Fairlight up to 2,000 tracks, ADR, Foley, and effects such as reverb"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "kdenlive-vs-shotcut",
      title: "Kdenlive vs Shotcut",
      category: "software",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Kdenlive for a GPL download and proxies on low-end systems. Resolve's free download for Fusion, color, and Fairlight inside the 8-bit Ultra HD limit. Neither is ahead for every laptop.",
    keyFact:
      "Blackmagic's download lists macOS 12 Monterey, Windows 10 Creators Update, and Rocky Linux 8.6 or CentOS 7.3, and does not list a RAM or GPU minimum.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 9,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Kdenlive — home", url: KDENLIVE_HOME },
      { name: "Kdenlive — download 26.08.2", url: KDENLIVE_DOWNLOAD },
      { name: "Kdenlive — license and technologies", url: KDENLIVE_ABOUT },
      { name: "KDE — kdenlive GitHub mirror (GPL-3.0)", url: KDENLIVE_GITHUB },
      { name: "Blackmagic Design — DaVinci Resolve", url: RESOLVE_PRODUCT },
      { name: "Blackmagic Design — DaVinci Resolve download", url: RESOLVE_DOWNLOAD },
      { name: "A Versus B — DaVinci Resolve free vs Premiere Pro", url: PREMIERE_GUIDE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Kdenlive",
      url: KDENLIVE_HOME,
      description:
        "Free and open source editor for Linux, Windows, macOS, and BSD. Proxies for smooth playback on low-end systems.",
    },
    {
      type: "external",
      label: "Kdenlive download",
      url: KDENLIVE_DOWNLOAD,
      description:
        "Version 26.08.2. Windows 10 or newer. Linux AppImage and Flathub. macOS 13 Ventura or newer.",
    },
    {
      type: "external",
      label: "Kdenlive license",
      url: KDENLIVE_ABOUT,
      description: "GNU General Public License. No license fees or paid feature locks. MLT and FFmpeg.",
    },
    {
      type: "external",
      label: "Kdenlive on GitHub",
      url: KDENLIVE_GITHUB,
      description: "KDE mirror. License label GPL-3.0. COPYING is GNU GPL version 3.",
    },
    {
      type: "external",
      label: "DaVinci Resolve",
      url: RESOLVE_PRODUCT,
      description:
        "Resolve 21 for Mac, Windows, and Linux. Free version: 8-bit, up to 60fps, Ultra HD 3840 x 2160, collaboration, and HDR. Studio adds the Neural Engine, 10-bit, 120 fps, and resolutions beyond 4K.",
    },
    {
      type: "external",
      label: "DaVinci Resolve download requirements",
      url: RESOLVE_DOWNLOAD,
      description:
        "macOS 12 Monterey. Windows 10 Creators Update. Rocky Linux 8.6 or CentOS 7.3. iPadOS 16 or later on an A12 Bionic iPad or later. No monthly subscriptions, ads, or user tracking.",
    },
    {
      type: "blog",
      label: "DaVinci Resolve free vs Premiere Pro decision guide",
      url: PREMIERE_GUIDE,
      description: "When the other editor is Premiere Pro, not Kdenlive.",
    },
  ],
  metaTitle: "Kdenlive vs DaVinci Resolve",
});
