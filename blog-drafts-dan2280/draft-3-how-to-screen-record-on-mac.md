---
publish_date: 2026-07-23
keyword: how to screen record on mac
volume: 135000
kd: 27
category: tech/how-to
slug: how-to-screen-record-on-mac
title_tag: How to Screen Record on Mac — Built-in Tools, Shortcuts, and the Best Apps | aversusb
meta_description: Record your Mac screen with Shift+Command+5 (no download needed) or QuickTime Player. Get audio working, change quality, and know when to upgrade to a third-party tool.
internal_links:
  - /compare/mac-vs-windows
  - /compare/macbook-air-vs-macbook-pro
---

# How to Screen Record on Mac: Every Built-in Method and When to Use Third-Party Tools

*By Daniel Rozin | A Versus B | July 23, 2026*

Mac has had native screen recording built in since macOS Mojave (10.14), and it keeps getting better. You don't need to download anything to record your screen — the tools are already there. Here's how to use them effectively, how to get the audio right (the most common sticking point), and when a third-party tool is actually worth it.

## Method 1: The Screenshot Toolbar (Shift + Command + 5)

The quickest way to start a screen recording on any modern Mac.

**How to start:**
1. Press **Shift + Command (⌘) + 5**
2. The Screenshot toolbar appears at the bottom of your screen
3. Click the fourth icon (**Record Entire Screen**) or the fifth icon (**Record Selected Portion**)
4. Click **Record** — a countdown may appear if you set a timer in Options
5. A small stop button (●) appears in the menu bar while recording is active

**How to stop:**
- Click the **stop button (●)** in the menu bar
- Or press **Command + Control + Escape**
- The recording saves automatically to your Desktop (or whichever folder you've configured)

**The Options menu** (accessible from the toolbar before you start recording) lets you:
- **Change the save location** (Desktop, Documents, or any custom folder)
- **Set a timer** (5 or 10 seconds) so you can set up your screen before recording begins
- **Show or hide the mouse pointer** in the recording
- **Microphone input** — this is where you set up audio (more on this below)

### Record a Selected Portion (Not the Full Screen)

1. Press **Shift + ⌘ + 5**
2. Click the fifth icon (Record Selected Portion)
3. Drag the selection handles to define the recording area
4. Click **Record**

This is useful for tutorials, demos of a specific app, or capturing only part of your screen when you have sensitive content in other areas.

## Method 2: QuickTime Player

QuickTime Player has a screen recording mode that's been around longer and offers a slightly different workflow.

**How to use it:**
1. Open **QuickTime Player** (Applications folder or Spotlight: ⌘+Space → type "QuickTime")
2. Go to **File → New Screen Recording**
3. A recording toolbar appears — choose microphone input, quality, and whether to show mouse clicks
4. Click the **Record** button (●)
   - Click once to record the entire screen
   - Or drag to select a specific area, then click **Start Recording** inside the selection
5. To stop: click the **stop button (■)** in the menu bar, or press **Command + Control + Escape**
6. QuickTime opens the recording automatically — save it with **File → Save**

**Difference from Shift+⌘+5:** QuickTime doesn't auto-save to your Desktop. It holds the recording in memory until you explicitly save it. This is handy if you want to review and trim before keeping the file, but it means you can lose the recording if QuickTime crashes.

## Getting Audio in Your Screen Recording

This is the most common sticking point. There are two types of audio you might want:

### 1. Microphone Audio (Your Voice)

This works out of the box:
1. Open the Shift+⌘+5 toolbar
2. Click **Options**
3. Under **Microphone**, select your input — built-in microphone, AirPods, a USB mic, or any connected audio device

Mac will record your voice narration along with the screen. The quality depends on your microphone — AirPods are decent, a dedicated USB mic like the Blue Snowball or Rode NT-USB is noticeably cleaner.

### 2. System Audio (Sound From Apps and the Mac Itself)

This is the hard part. **macOS does not include a built-in option to record system audio** (game sounds, YouTube video audio, app sounds, music playing on your Mac). Apple blocks this for privacy and copyright reasons.

**Your options to capture system audio:**

**Option A — BlackHole (free, open source)**
BlackHole is a virtual audio driver that creates a loopback — it tricks macOS into routing system audio to a recording input.

Setup steps:
1. Download and install BlackHole from the developer's GitHub page (search "BlackHole audio GitHub")
2. Open **Audio MIDI Setup** (Applications → Utilities)
3. Click the **+** at the bottom left → **Create Multi-Output Device**
4. Check both your speakers/headphones AND BlackHole
5. Set the Multi-Output Device as your default output in System Settings → Sound
6. In the screenshot toolbar or QuickTime, set **Microphone** to BlackHole
7. Now system audio routes through BlackHole and gets captured in the recording

This is the free solution but has a few steps. You'll need to switch your audio output back to normal speakers when you're done.

**Option B — Loopback (paid, $99)**
Loopback from Rogue Amoeba creates virtual audio devices with a graphical interface — easier to set up than BlackHole but not free. It's the go-to for podcasters and video creators who need system audio in recordings regularly.

**Option C — Use a third-party screen recorder** (see below) — several include system audio capture natively, handling the audio routing for you.

## What Format Does Mac Screen Recording Save In?

Mac screen recordings save as **.mov** files using H.264 or H.265 compression by default. These are:
- High quality but large — a 10-minute full-screen recording at 1080p can be 200–800 MB
- Compatible with most video editors (Final Cut Pro, iMovie, DaVinci Resolve, Premiere)
- Playable natively on Mac and iOS

**If you need MP4:** Convert in Handbrake (free) or use QuickTime Player → File → Export As → choose resolution (QuickTime will save as .mov, but you can rename to .mp4 and most players will read it). A proper conversion to H.264 .mp4 in Handbrake gives better compression than just renaming the file.

## Mac Screen Recording Tips

### Set a Timer Before Recording Starts

In Options (Shift+⌘+5 toolbar), set a 5 or 10-second countdown. This gives you time to:
- Close the Screenshot toolbar so it's not in the frame
- Arrange your windows
- Get to the starting point of your demo

### Hide the Mouse Cursor

For cleaner tutorial videos, uncheck **Show Mouse Pointer** in Options. The cursor won't appear in the final recording.

### Show Mouse Clicks

The opposite: if you want to highlight where you're clicking (useful for tutorials), enable **Show Mouse Clicks** in QuickTime's recording options. Clicked spots show a subtle ring animation.

### Record the Retina Display at Reduced Resolution

Retina Mac screens have extremely high pixel density. A 2-minute Retina screen recording can be enormous. To reduce file size:
- Use the **Record Selected Portion** mode at a size you'll actually use (e.g., 1920×1080 box) instead of the full Retina resolution
- Or encode with Handbrake after recording to reduce bitrate without visible quality loss

### Stop Recording Quickly

The fastest stop method: **Command + Control + Escape** (works regardless of what app is focused). The stop button in the menu bar also works but requires you to move your mouse away from what you're demonstrating.

## Third-Party Screen Recording Tools for Mac

### When to Stick with Built-In Tools

The built-in Shift+⌘+5 method is sufficient if you:
- Don't need system audio
- Just need a basic recording with no annotation
- Are recording for personal reference, not publication

### When to Get a Third-Party Tool

Consider upgrading if you:
- Need system audio without the BlackHole setup hassle
- Want to annotate while recording (draw arrows, highlight clicks in real time)
- Need automatic upload/sharing (directly to YouTube, Google Drive, or a sharing link)
- Record frequently and want more control over quality, format, or trim before saving

**Best third-party options:**

| Tool | System Audio | Annotation | Price | Best For |
|------|-------------|------------|-------|----------|
| **Loom** | Yes | Limited | Free / $15/mo | Async video messaging |
| **CleanShot X** | No (screenshots excel) | Yes | $29 one-time | Mixed screenshot/video |
| **ScreenFlow** | Yes | Yes | $149 one-time | Polished tutorials |
| **Camtasia** | Yes | Yes | $299/year | Professional courses |
| **Screencast-O-Matic** | Yes | Yes | $4/mo | Simple sharing |
| **Filmora Screen Recorder** | Yes | Yes | $49.99/year | Casual creators |

**Loom** is worth mentioning separately because it became the dominant choice for async video in workplace settings — it records screen + webcam simultaneously, generates a shareable link immediately after recording, and has a generous free tier.

## Common Screen Recording Problems and Fixes

### "You need to enable screen recording permission"

macOS requires explicit permission for apps to record your screen:
1. Go to **System Settings → Privacy & Security → Screen Recording**
2. Enable the toggle next to the app you want to use (QuickTime Player, Loom, etc.)
3. Restart the app — permission changes take effect after the app relaunches

### Recording Appears Laggy or Choppy

Causes:
- **High CPU load** from other apps during recording — close unused apps
- **Retina resolution** at full native pixels — use a smaller capture area or a lower display resolution (System Settings → Displays)
- **Slow storage drive** — if you're recording to an external HDD, switch to internal SSD or a fast external SSD

### Recording is Black or Shows a Grey Screen

Some apps with DRM (Netflix, Apple TV, some games) block screen recording as a copy-protection measure. You'll see a black rectangle where the app was. This isn't a bug — macOS is intentionally preventing capture of protected content.

### No Sound in the Recording

Check two things:
1. A microphone is selected in Options (Shift+⌘+5 → Options → Microphone)
2. For system audio: macOS blocks it natively — use BlackHole or a third-party recorder

## Summary: Quick Reference for Mac Screen Recording

| Goal | Method |
|------|--------|
| Record full screen quickly | Shift + ⌘ + 5 → Record Entire Screen |
| Record only part of the screen | Shift + ⌘ + 5 → Record Selected Portion |
| Record with QuickTime | QuickTime → File → New Screen Recording |
| Add voice narration | Options → Microphone → select your mic |
| Capture system audio (free) | Install BlackHole → route through Multi-Output Device |
| Capture system audio (easy) | Use Loom, ScreenFlow, or Camtasia |
| Stop recording fast | Command + Control + Escape |
| Save as MP4 | Convert in Handbrake after recording |

If you're also curious how Mac compares to Windows for other built-in tools and everyday workflows, see our [Mac vs Windows comparison](/compare/mac-vs-windows). And if you're considering which Mac to buy for content creation, our [MacBook Air vs MacBook Pro breakdown](/compare/macbook-air-vs-macbook-pro) covers the tradeoffs in performance, display, and portability.

---

*Related: [How to Screenshot on Mac — Every Method and Shortcut](/blog/how-to-screenshot-on-mac)*
