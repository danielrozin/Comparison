/**
 * ROO-266: repo article for /blog/kdenlive-vs-shotcut-vs-davinci-resolve.
 * Facts opened 5 November 2026 from kdenlive.org, shotcut.org, and
 * blackmagicdesign.com/products/davinciresolve plus the Resolve download.
 * Licenses from the KDE and mltframework GitHub mirrors.
 * No render benchmarks. No RAM or GPU minimum Blackmagic's download does not list.
 * Reddit returned HTTP 403, so there is no community block.
 */

import type { BlogArticle } from "@/lib/services/blog-generator";

export const KDENLIVE_SHOTCUT_RESOLVE_BLOG_SLUG = "kdenlive-vs-shotcut-vs-davinci-resolve";

const PUBLISHED_AT = "2026-11-05T00:00:00.000Z";
const UPDATED_AT = "2026-11-05T00:00:00.000Z";

const CONTENT = `*Analysis. Drafted with AI from web research. Updated November 5, 2026.*

**Updated Nov 2026.** Kdenlive 26.08.2 and Shotcut 26.9.27 are the free GPL editors to start with on a modest laptop. Kdenlive uses proxies for smooth playback on low-end systems. Shotcut lists 4 GB of RAM for SD, 8 GB for HD, and 16 GB for 4K, and says to use Preview Scaling and Proxy at the lower end. DaVinci Resolve 21 has a free download. Blackmagic lists macOS 12 Monterey, Windows 10 Creators Update, and Rocky Linux 8.6 or CentOS 7.3, and does not list a RAM or GPU minimum. None of the three is ahead for every laptop.

| | Kdenlive | Shotcut | DaVinci Resolve |
| --- | --- | --- | --- |
| Current name | 26.08.2 | 26.9.27 | Resolve 21, free download and Studio |
| Price | No license fee | Free, including commercial use | Free download. Studio is a purchase |
| License | GPL version 3 | GPLv3 | Blackmagic free download and paid Studio |
| Engine | MLT, FFmpeg | MLT, FFmpeg | Blackmagic's own editor |
| Modest-laptop note | Proxies for low-end playback | 8 GB RAM for HD. Preview Scaling and Proxy | Download lists operating systems only |
| Free format note | Almost any audio or video format on ingest | 4K and 8K are on the feature list | Free: 8-bit, up to 60fps, Ultra HD 3840 x 2160 |

*Table: Kdenlive, Shotcut, and DaVinci Resolve from each vendor's site, 5 November 2026.*

## Which one fits a laptop without a dedicated GPU?

Shotcut's FAQ lists OpenGL 2.0 on Linux and Direct3D 11 on Windows. In the default CPU processing modes, Shotcut does not use the GPU for filters you add. At the lower end of its CPU and RAM figures, use Preview Scaling and Proxy. An HD project on that list is 4 cores and 8 GB of RAM.

Kdenlive's download does not list a RAM or GPU figure. Kdenlive says to use proxies for smooth playback even on low-end systems. The installer is 26.08.2 for Windows 10 or newer, Linux, and macOS 13 Ventura or newer.

Blackmagic's download does not list a dedicated GPU, a VRAM size, or a RAM size. Studio's Resolve FX are described as GPU and CPU accelerated, and the Neural Engine is described as using GPU innovations. Those sentences are not a minimum on the download. The two-way writeup is [Kdenlive vs DaVinci Resolve](/compare/kdenlive-vs-davinci-resolve).

## What does each editor include for a school project or a skit?

Kdenlive's home page names multicam, 3-point editing, nested sequences, voiceover recording, automatic transcription, title clips, LUTs, and scopes. Shotcut names Text: Simple and Text: Rich, subtitle files including SRT, VTT, ASS, and SSA, record-to-timeline voiceover, and 3-way color wheels. The side-by-side is [Kdenlive vs Shotcut](/compare/kdenlive-vs-shotcut).

DaVinci Resolve 21 puts cut, edit, Fusion, color, Fairlight, media, deliver, and Photo in one app. The free download works with virtually all 8-bit video formats at up to 60fps as high as Ultra HD 3840 x 2160, with multi-user collaboration and HDR grading. Studio adds the Neural Engine, more Resolve FX, 10-bit video up to 120 frames per second, and resolutions beyond 4K.

## Which operating systems are listed?

Kdenlive: Linux, Windows, macOS, and BSD. Shotcut 26.9.27: Windows 10/11 from build 1809, Apple macOS 12 - 27, and 64-bit Linux with glibc 2.35 or newer. Resolve's download: macOS 12 Monterey, Windows 10 Creators Update, Rocky Linux 8.6 or CentOS 7.3, and iPadOS 16.0 or later on an iPad with an A12 Bionic chip or later.

## When does Resolve replace Kdenlive or Shotcut?

Move when you want Fusion, Fairlight, and the color workspace, and the footage fits the free 8-bit Ultra HD limit or you are buying Studio. Stay with Kdenlive or Shotcut when you want a GPL download and the proxy tools above. When the other app is Premiere Pro, read the [DaVinci Resolve free vs Premiere Pro decision guide](https://www.aversusb.net/blog/davinci-resolve-free-vs-premiere-pro-2026-complete-decision-guide).

## FAQ

### Which free editor fits a laptop without a dedicated GPU?

Kdenlive or Shotcut. Shotcut lists 8 GB of RAM for HD and a GPU line of OpenGL 2.0 or Direct3D 11. Kdenlive uses proxies and does not list a RAM figure. Blackmagic's Resolve download does not list a RAM or GPU minimum.

### Do Kdenlive and Shotcut cost money?

No license fee. Both are GPL version 3. Shotcut's FAQ says commercial use is included. Kdenlive says there are no registrations, subscriptions, or paid feature locks.

### What is free in DaVinci Resolve?

The free download covers virtually all 8-bit formats at up to 60fps as high as Ultra HD 3840 x 2160, plus collaboration and HDR grading. Studio is a separate purchase for the Neural Engine, 10-bit, 120 fps, and resolutions beyond 4K.

### Does proxy editing exist?

Kdenlive says proxies are for smooth playback on low-end systems. Shotcut has low resolution proxy editing and tells you to pair it with Preview Scaling at the lower end of its CPU and RAM figures.
`;

export const KDENLIVE_SHOTCUT_RESOLVE_FAQS = [
  {
    question: "Which free editor fits a laptop without a dedicated GPU?",
    answer:
      "Kdenlive or Shotcut. Shotcut lists 8 GB of RAM for HD and a GPU line of OpenGL 2.0 or Direct3D 11. Kdenlive uses proxies and does not list a RAM figure. Blackmagic's Resolve download does not list a RAM or GPU minimum.",
  },
  {
    question: "Do Kdenlive and Shotcut cost money?",
    answer:
      "No license fee. Both are GPL version 3. Shotcut's FAQ says commercial use is included. Kdenlive says there are no registrations, subscriptions, or paid feature locks.",
  },
  {
    question: "What is free in DaVinci Resolve?",
    answer:
      "The free download covers virtually all 8-bit formats at up to 60fps as high as Ultra HD 3840 x 2160, plus collaboration and HDR grading. Studio is a separate purchase for the Neural Engine, 10-bit, 120 fps, and resolutions beyond 4K.",
  },
  {
    question: "Does proxy editing exist?",
    answer:
      "Kdenlive says proxies are for smooth playback on low-end systems. Shotcut has low resolution proxy editing and tells you to pair it with Preview Scaling at the lower end of its CPU and RAM figures.",
  },
];

export const KDENLIVE_SHOTCUT_RESOLVE_ARTICLE: BlogArticle = {
  id: "blog-kdenlive-vs-shotcut-vs-davinci-resolve",
  slug: KDENLIVE_SHOTCUT_RESOLVE_BLOG_SLUG,
  title: "Kdenlive vs Shotcut vs DaVinci Resolve",
  excerpt:
    "Kdenlive, Shotcut, and DaVinci Resolve for a laptop without a dedicated GPU, from each vendor's download, license, and published requirements.",
  content: CONTENT,
  category: "technology",
  tags: ["kdenlive", "shotcut", "davinci-resolve", "video-editor", "free-software"],
  metaTitle: "Kdenlive vs Shotcut vs DaVinci Resolve",
  metaDescription:
    "Kdenlive 26.08.2 and Shotcut 26.9.27 are free GPL editors with proxy tools. Resolve 21's free download lists OS lines and no RAM or GPU minimum.",
  relatedComparisonSlugs: ["kdenlive-vs-shotcut", "kdenlive-vs-davinci-resolve"],
  status: "published",
  publishedAt: PUBLISHED_AT,
  createdAt: PUBLISHED_AT,
  updatedAt: UPDATED_AT,
  viewCount: 0,
};
