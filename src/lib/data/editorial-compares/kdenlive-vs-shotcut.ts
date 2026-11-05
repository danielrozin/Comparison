import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-266 — Kdenlive vs Shotcut for a laptop without a dedicated GPU.
 * Opened 5 November 2026 (Asia/Jerusalem).
 * Kdenlive: kdenlive.org, the download (26.08.2), and the license note.
 * Shotcut: shotcut.org, the download (26.9.27), the FAQ, and the feature list.
 * Licenses: GNU GPL version 3 on the KDE and mltframework GitHub mirrors.
 * No winner. No render benchmarks. No RAM figure Kdenlive does not list.
 * Reddit returned HTTP 403, so there is no community block.
 */

const KDENLIVE = "kdenlive";
const SHOTCUT = "shotcut";

const KDENLIVE_HOME = "https://kdenlive.org/";
const KDENLIVE_DOWNLOAD = "https://kdenlive.org/download/";
const KDENLIVE_ABOUT = "https://kdenlive.org/about/";
const KDENLIVE_GITHUB = "https://github.com/KDE/kdenlive";
const SHOTCUT_HOME = "https://shotcut.org/";
const SHOTCUT_DOWNLOAD = "https://shotcut.org/download/";
const SHOTCUT_FAQ = "https://shotcut.org/FAQ/";
const SHOTCUT_FEATURES = "https://shotcut.org/features/";
const SHOTCUT_GITHUB = "https://github.com/mltframework/shotcut";
const RESOLVE_PRODUCT = "https://www.blackmagicdesign.com/products/davinciresolve";
const RESOLVE_DOWNLOAD = "https://www.blackmagicdesign.com/event/davinciresolvedownload";
const PREMIERE_GUIDE =
  "https://www.aversusb.net/blog/davinci-resolve-free-vs-premiere-pro-2026-complete-decision-guide";

const SOURCE_DATE = "2026-11-05";
const PUBLISHED = "2026-11-05T00:00:00Z";
const SPEC = "Editor";

const SHORT_ANSWER =
  "Kdenlive 26.08.2 and Shotcut 26.9.27 are free editors on the MLT framework under GPL version 3. Kdenlive uses proxies for smooth playback on low-end systems. Shotcut lists at least 4 GB of RAM for SD, 8 GB for HD, and 16 GB for 4K, and says to use Preview Scaling and Proxy at the lower end of those CPU and RAM figures. Neither editor is ahead for every laptop.";

const FAQS = [
  {
    question: "Which free editor fits a laptop without a dedicated GPU?",
    answer:
      "Shotcut's FAQ lists OpenGL 2.0 on Linux and Direct3D 11 on Windows, and says the default CPU processing modes do not use the GPU for filters you add. It also says a computer at the lower end of its CPU and RAM figures should use Preview Scaling and Proxy. Kdenlive says proxies are for smooth playback even on low-end systems, and its download does not list a RAM or GPU figure. Neither editor is ahead for every laptop.",
  },
  {
    question: "Do Kdenlive and Shotcut use the same engine?",
    answer:
      "Both sit on the MLT framework. Kdenlive's story says the interface is C++ and Qt, with KDE libraries, and that MLT was written by Dan Dennedy and relies on FFmpeg. Shotcut's site says Dan Dennedy, an MLT co-founder, rewrote Shotcut as an editor based on MLT. The GitHub mirrors describe Kdenlive as based on MLT and KDE Frameworks, and Shotcut as a cross-platform Qt editor.",
  },
  {
    question: "Can I edit with proxy clips?",
    answer:
      "Yes for both. Kdenlive says you can use proxies for smooth playback even on low-end systems. Shotcut lists low resolution proxy editing to improve the speed of seeking and to eliminate or minimize scaling. Shotcut's FAQ says to use Preview Scaling and Proxy together when the computer is at the lower end of the CPU and RAM figures, to help reduce preview lag.",
  },
  {
    question: "What do Kdenlive and Shotcut cost?",
    answer:
      "Kdenlive says there are no license fees, no registrations or subscriptions, and no premium features that require payment to be unlocked. Shotcut's FAQ says yes, it is free for commercial use, because it is made available under the GPLv3 license, including the freedom to run the program for any purpose. The KDE GitHub mirror and the mltframework GitHub mirror both label the projects GPL-3.0. Kdenlive's COPYING file is GNU General Public License version 3.",
  },
  {
    question: "Which operating systems can I install them on?",
    answer:
      "Kdenlive's site says it works on Linux, Windows, macOS, and BSD. The download is 26.08.2: Windows 10 or newer, a Linux AppImage and a Flathub Flatpak, and macOS 13 Ventura or newer for Apple silicon and Intel. Shotcut's current download is 26.9.27 for Windows 10/11 on Intel, AMD, or ARM (Windows 10 build 1809 or newer), macOS 12 through 27, and 64-bit Linux. Shotcut's FAQ lists 64-bit Windows 10 (build 1809) - 11, Apple macOS 12 - 27, or 64-bit Linux with at least glibc 2.35.",
  },
  {
    question: "When would I look at DaVinci Resolve instead?",
    answer:
      "Look at DaVinci Resolve when you want Blackmagic's cut, edit, Fusion, color, Fairlight, media, deliver, and Photo workspaces in one download. The free download works with virtually all 8-bit video formats at up to 60fps in resolutions as high as Ultra HD 3840 x 2160, and it includes multi-user collaboration and HDR grading. Blackmagic's download lists macOS 12 Monterey, Windows 10 Creators Update, and Rocky Linux 8.6 or CentOS 7.3, and it does not list a RAM or GPU minimum. Studio is a separate purchase. See Kdenlive vs DaVinci Resolve, and the DaVinci Resolve free vs Premiere Pro decision guide when the other app is Premiere Pro.",
  },
];

const VERDICT = `Modest laptop, HD school project or skit: both editors are free. Shotcut lists 8 GB of RAM for HD, 4 cores for HD, and says to use Preview Scaling and Proxy at the lower end of its CPU and RAM figures. Kdenlive says proxies are for smooth playback even on low-end systems. Kdenlive's download does not list a RAM figure.

Same laptop, and you want the tools Kdenlive names on its home page: nested sequences, multicam, automatic transcription, and scopes (histogram, vectorscope, RGB parade, and waveform). Shotcut 26.9.27 names its own text filters, subtitle import, voiceover recording, and 3-way color wheels.

Neither editor is ahead for every laptop.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Quick verdict by hardware

Shotcut publishes a hardware list. Shotcut asks for at least one 2 GHz core for SD, 4 cores for HD, and 8 cores for 4K, on x86-64 Intel or AMD or on 64-bit ARM such as Apple silicon or a Qualcomm Snapdragon X. RAM is at least 4 GB for SD, 8 GB for HD, and 16 GB for 4K. The GPU line is OpenGL 2.0 that works on Linux, and Direct3D 11 on Windows. If the computer is at the lower end of the CPU and RAM figures, Shotcut says to use Preview Scaling and Proxy.

Kdenlive's download does not list a RAM or GPU figure. Kdenlive says to use proxies for smooth playback even on low-end systems. The current download is 26.08.2 and requires Windows 10 or newer, or macOS 13 Ventura or newer.

What each editor is

Kdenlive is the KDE Non-Linear Video Editor. The project says it is free and open source, written in C++ with Qt, using KDE libraries and the MLT framework by Dan Dennedy. MLT relies on FFmpeg. Video effects come from Frei0r and Movit. Audio effects use LADSPA, and the story also names SOX. There are no license fees, registrations, subscriptions, or premium features locked behind a payment. The KDE GitHub mirror is GPL-3.0, and COPYING is GNU General Public License version 3.

Shotcut is the editor Dan Dennedy rewrote on MLT. Shotcut supports hundreds of audio and video formats through FFmpeg, with native editing and no import step, and multi-format timelines. The current download is 26.9.27. Shotcut says it is free for commercial use under GPLv3. The mltframework GitHub mirror is GPL-3.0. Shotcut does not require a network connection to activate, check a subscription, or send usage analytics.

Performance on a modest laptop

Use the published floors, not a guessed frame rate. Shotcut's 8 GB HD line is the figure to read first on an 8 GB laptop. 4K on Shotcut's list is 8 cores and 16 GB. Preview Scaling is the low resolution preview Shotcut says improves the speed of realtime effects. Proxy editing is the low resolution editing Shotcut says improves seeking and scaling. Shotcut pairs the two when the computer is at the lower end of the CPU and RAM figures, to reduce preview lag.

Kdenlive's proxy line is the home-page sentence: proxies for smooth playback even on low-end systems. It does not publish a matching RAM table. Daily builds are separate from 26.08.2. Kdenlive says those binaries can be unstable and can corrupt existing projects, and that they are for testing.

Shotcut also says how the GPU is used. Drawing the interface and showing video uses Direct3D on Windows, Metal on macOS, and OpenGL on Linux. Hardware decoding, when enabled, is for 1080p or less or with preview scaling. Hardware encoding can be enabled. OpenGL effects run when Processing Mode is 10-bit Linear GPU/CPU. In the default CPU processing modes, Shotcut does not use the GPU for filters you add, transitions, compositing, or audio mixing.

Features for school projects and skits

Kdenlive's home page names a non-linear timeline, multicam, 3-point editing, nested sequences, markers, and automatic backups. Audio tools include mixers, built-in voiceover recording, and an audio spectrum, plus hundreds of audio and video effects with keyframes. Color tools include LUTs, basic correction, creative grading, and histogram, vectorscope, RGB parade, and waveform. Subtitles can use automatic transcription. Titles can be simple title clips, or Glaxnimate for motion graphics.

Shotcut's feature list names a multitrack timeline, 3-point editing, text filters called Text: Simple and Text: Rich, and subtitle create, import, edit, export, render, and embed. Import formats include SRT, VTT, ASS, and SSA. You can record directly to the timeline for a voiceover, convert spoken word to subtitle text, and use text-to-speech. Video tools include 3-way color wheels, an eye dropper for white balance, 3D LUT, and video scopes (histogram, RGB parade, RGB waveform, waveform, vectorscope). Shotcut's export suggestions for a video-sharing site are the H.264 High Profile preset or the YouTube preset.

What you learn first

Kdenlive describes a customizable interface that adapts to the workflow, from ingest through the final touch. The editing tools it puts forward are multicam, 3-point editing, nested sequences, and markers.

Shotcut's home page starts with drag-and-drop, J, K, and L for playback, I and O for in and out points, and frame stepping. Panels can dock and undock. Versions are dated, and the site says new versions are available every two months and that you can keep multiple versions. Shotcut says several versions can be installed at once by keeping the program folders apart.

Platforms

Kdenlive: Linux, Windows, macOS, and BSD on the home page. Download 26.08.2 is an installable and a standalone build for Windows 10 or newer, a Linux AppImage plus a stable Flathub Flatpak, and macOS silicon and Intel builds that require macOS 13 Ventura or newer.

Shotcut: Windows, Linux, and macOS, and it can run as a portable app from an external drive. Download 26.9.27 covers Windows 10/11 on Intel or AMD and on ARM, macOS 12 through 27 as a universal build, and a Linux portable tar plus an AppImage for the distributions named on the download. The last Shotcut for Windows 7 and 8 is 22.12.21. The last build for macOS 11 is 24.11.17. Shotcut says a Mac from 2013 or earlier might show a preview color problem after the move to Apple Metal, and in that case to use 22.12.21.

When to move to DaVinci Resolve

Move on when the job needs the workspaces Blackmagic names: cut, edit, Fusion, color, Fairlight, media, deliver, and the Photo workspace in DaVinci Resolve 21. The free download works with virtually all 8-bit formats at up to 60fps as high as Ultra HD 3840 x 2160, with multi-user collaboration and HDR grading. Studio is the purchase that adds the DaVinci Neural Engine, more Resolve FX, and support for 10-bit video up to 120 frames per second and resolutions beyond 4K. Blackmagic's download lists macOS 12 Monterey, Windows 10 Creators Update, Rocky Linux 8.6 or CentOS 7.3, and an iPad line of iPadOS 16 or later on an iPad with an A12 Bionic chip or later. That download does not list a RAM or GPU minimum. Studio's Resolve FX are described as GPU and CPU accelerated, and the Neural Engine is described as using GPU innovations. Those sentences are not a minimum for the free download.

The matching compare is Kdenlive vs DaVinci Resolve at /compare/kdenlive-vs-davinci-resolve. When the other app is Premiere Pro, the decision guide is DaVinci Resolve free vs Premiere Pro.`;

export const KDENLIVE_VS_SHOTCUT: EditorialComparison = buildEditorialComparison({
  slug: "kdenlive-vs-shotcut",
  title: "Kdenlive vs Shotcut",
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
      shortDesc: "KDE Non-Linear Video Editor 26.08.2, free under GPL version 3, on Linux, Windows, macOS, and BSD.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "Free and open source, with no license fees, registrations, subscriptions, or paid feature locks (Kdenlive)",
        "Download 26.08.2 for Windows 10 or newer, Linux AppImage and Flathub, and macOS 13 Ventura or newer",
        "Proxies for smooth playback even on low-end systems (Kdenlive)",
        "Nested sequences, multicam, automatic transcription, voiceover, and scopes on the home page",
      ],
      cons: [
        "The download does not list a RAM or GPU figure",
        "Daily builds can be unstable and can corrupt existing projects",
        "macOS builds require macOS 13 Ventura or newer, which is newer than Shotcut's macOS 12 line",
        "BSD is named on the home page and is not a tile on the download",
      ],
      bestFor: "Proxy editing on Linux, Windows, macOS, or BSD",
    },
    {
      id: SHOTCUT,
      slug: SHOTCUT,
      name: "Shotcut",
      shortDesc: "MLT video editor 26.9.27, free under GPLv3, with a published CPU, RAM, and GPU list.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Free for commercial use under GPLv3, including the freedom to run it for any purpose (Shotcut FAQ)",
        "FAQ lists 4 GB RAM for SD, 8 GB for HD, and 16 GB for 4K, plus Preview Scaling and Proxy at the lower end",
        "GPU line is OpenGL 2.0 on Linux and Direct3D 11 on Windows, not a discrete card",
        "Portable app. Default CPU modes do not use the GPU for filters you add (Shotcut FAQ)",
      ],
      cons: [
        "4K on the FAQ list is 8 cores and 16 GB of RAM",
        "Hardware video decoding over 1080p is not the path Shotcut describes",
        "Windows 7 and 8 stop at 22.12.21. macOS 11 stops at 24.11.17",
        "GPU effects need Processing Mode set to 10-bit Linear GPU/CPU, and that mode is a subset of filters",
      ],
      bestFor: "A published RAM floor and portable Windows, macOS, and Linux builds",
    },
  ],
  keyDifferences: [
    {
      label: "License",
      entityAValue: "GPL version 3. No license fee",
      entityBValue: "GPLv3, including commercial use",
      winner: "tie",
    },
    {
      label: "Engine",
      entityAValue: "MLT, FFmpeg, Frei0r, LADSPA",
      entityBValue: "MLT and FFmpeg",
      winner: "tie",
    },
    {
      label: "Current download",
      entityAValue: "26.08.2",
      entityBValue: "26.9.27",
      winner: "tie",
    },
    {
      label: "Proxy editing",
      entityAValue: "Proxies for low-end playback",
      entityBValue: "Proxy plus Preview Scaling",
      winner: "tie",
    },
    {
      label: "Published RAM",
      entityAValue: "Not listed on the download",
      entityBValue: "4 GB SD, 8 GB HD, 16 GB 4K",
      winner: "tie",
    },
    {
      label: "Platforms",
      entityAValue: "Linux, Windows, macOS, BSD",
      entityBValue: "Windows, Linux, macOS",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("license", "License", SPEC, KDENLIVE, SHOTCUT, "GNU GPL version 3 on the KDE mirror. No license fees, registrations, subscriptions, or paid locks", "GPLv3. Free for commercial use, including freedom to run it for any purpose"),
    textAttr("engine", "Engine", SPEC, KDENLIVE, SHOTCUT, "MLT by Dan Dennedy, FFmpeg, Frei0r, Movit, LADSPA, and SOX. C++ and Qt with KDE libraries", "MLT, rewritten by Dan Dennedy. FFmpeg for formats. Qt. Codec independent"),
    textAttr("version", "Current download", SPEC, KDENLIVE, SHOTCUT, "26.08.2. Daily builds are for testing and can corrupt projects", "26.9.27. Dated versions. New versions about every two months. Several versions can stay installed"),
    textAttr("platforms", "Platforms", SPEC, KDENLIVE, SHOTCUT, "Linux, Windows, macOS, and BSD. Windows 10 or newer. macOS 13 Ventura or newer, silicon and Intel. Linux AppImage and Flathub", "Windows 10/11 Intel, AMD, and ARM, from Windows 10 build 1809. macOS 12 through 27. 64-bit Linux with glibc 2.35 or newer. Portable app"),
    textAttr("proxy", "Proxy editing", SPEC, KDENLIVE, SHOTCUT, "Proxies for smooth playback even on low-end systems", "Low resolution proxy editing for seeking and scaling. Pair with Preview Scaling at the lower end of the CPU and RAM figures"),
    textAttr("ram", "Published RAM", SPEC, KDENLIVE, SHOTCUT, "The download does not list a RAM figure", "At least 4 GB for SD, 8 GB for HD, and 16 GB for 4K"),
    textAttr("gpu", "Published GPU note", SPEC, KDENLIVE, SHOTCUT, "The download does not list a GPU figure", "OpenGL 2.0 on Linux. Direct3D 11 on Windows. Default CPU modes do not use the GPU for filters you add"),
    textAttr("school", "Titles, subtitles, voiceover", SPEC, KDENLIVE, SHOTCUT, "Title clips, automatic transcription, Glaxnimate, and built-in voiceover recording", "Text: Simple and Text: Rich. Subtitles including SRT, VTT, ASS, and SSA. Record to the timeline. Spoken word to subtitle text"),
    textAttr("color", "Color tools", SPEC, KDENLIVE, SHOTCUT, "LUTs, basic correction, creative grading, histogram, vectorscope, RGB parade, and waveform", "3-way color wheels, eye dropper white balance, 3D LUT, and video scopes"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "kdenlive-vs-davinci-resolve",
      title: "Kdenlive vs DaVinci Resolve",
      category: "software",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Shotcut for a published RAM list and Preview Scaling. Kdenlive for proxies on low-end systems plus the tools named on its home page. Neither is ahead for every laptop.",
    keyFact:
      "Shotcut lists 8 GB of RAM for HD and OpenGL 2.0 or Direct3D 11. Kdenlive 26.08.2 uses proxies and does not list a RAM figure on its download.",
  },
  citationStats: {
    sourceCount: 12,
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
      { name: "Shotcut — home", url: SHOTCUT_HOME },
      { name: "Shotcut — download 26.9.27", url: SHOTCUT_DOWNLOAD },
      { name: "Shotcut — FAQ, requirements and GPU", url: SHOTCUT_FAQ },
      { name: "Shotcut — feature list", url: SHOTCUT_FEATURES },
      { name: "mltframework — shotcut GitHub mirror (GPL-3.0)", url: SHOTCUT_GITHUB },
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
        "KDE Non-Linear Video Editor for Linux, Windows, macOS, and BSD. Proxies for smooth playback on low-end systems. Multicam, nested sequences, voiceover, scopes, and automatic transcription.",
    },
    {
      type: "external",
      label: "Kdenlive download",
      url: KDENLIVE_DOWNLOAD,
      description:
        "Version 26.08.2. Windows 10 or newer. Linux AppImage and Flathub. macOS 13 Ventura or newer for silicon and Intel. Daily builds can corrupt projects.",
    },
    {
      type: "external",
      label: "Kdenlive license",
      url: KDENLIVE_ABOUT,
      description:
        "GNU General Public License. No license fees, registrations, subscriptions, or paid feature locks. MLT, FFmpeg, Frei0r, and LADSPA.",
    },
    {
      type: "external",
      label: "Kdenlive on GitHub",
      url: KDENLIVE_GITHUB,
      description: "KDE mirror. License label GPL-3.0. COPYING is GNU General Public License version 3.",
    },
    {
      type: "external",
      label: "Shotcut",
      url: SHOTCUT_HOME,
      description:
        "MLT editor by Dan Dennedy. FFmpeg formats, native editing, and dated versions about every two months.",
    },
    {
      type: "external",
      label: "Shotcut download",
      url: SHOTCUT_DOWNLOAD,
      description:
        "Current version 26.9.27. Windows 10/11, macOS 12 through 27, and Linux portable tar and AppImage.",
    },
    {
      type: "external",
      label: "Shotcut FAQ",
      url: SHOTCUT_FAQ,
      description:
        "4 GB RAM for SD, 8 GB for HD, 16 GB for 4K. OpenGL 2.0 or Direct3D 11. Preview Scaling and Proxy at the lower end. GPLv3. Default CPU modes do not use the GPU for filters you add.",
    },
    {
      type: "external",
      label: "Shotcut features",
      url: SHOTCUT_FEATURES,
      description:
        "Proxy editing, text filters, subtitles, voiceover, 3-way color wheels, and portable Windows, Linux, and macOS builds.",
    },
    {
      type: "external",
      label: "Shotcut on GitHub",
      url: SHOTCUT_GITHUB,
      description: "mltframework mirror. License label GPL-3.0. Described as a cross-platform Qt editor.",
    },
    {
      type: "external",
      label: "DaVinci Resolve",
      url: RESOLVE_PRODUCT,
      description:
        "Free download for cut, edit, Fusion, color, Fairlight, and Photo. Free version: 8-bit, up to 60fps, Ultra HD 3840 x 2160. Studio adds Neural Engine, 10-bit, 120 fps, and resolutions beyond 4K.",
    },
    {
      type: "external",
      label: "DaVinci Resolve download requirements",
      url: RESOLVE_DOWNLOAD,
      description:
        "macOS 12 Monterey. Windows 10 Creators Update. Rocky Linux 8.6 or CentOS 7.3. iPadOS 16 or later on an A12 Bionic iPad or later. No RAM or GPU figure on this download.",
    },
    {
      type: "blog",
      label: "DaVinci Resolve free vs Premiere Pro decision guide",
      url: PREMIERE_GUIDE,
      description: "When the other editor is Premiere Pro, not Kdenlive or Shotcut.",
    },
  ],
  metaTitle: "Kdenlive vs Shotcut",
});
