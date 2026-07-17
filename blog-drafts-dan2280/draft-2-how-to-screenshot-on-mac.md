---
publish_date: 2026-07-22
keyword: how to screenshot on mac
volume: 550000
kd: 33
category: tech/how-to
slug: how-to-screenshot-on-mac
title_tag: How to Screenshot on Mac — Every Method, Shortcut, and Option Explained | aversusb
meta_description: Four ways to screenshot on Mac: keyboard shortcuts for full screen, window, or selection, plus the Screenshot app and Touch Bar. Find your files in screenshots folder.
internal_links:
  - /compare/mac-vs-windows
  - /compare/macbook-air-vs-macbook-pro
---

# How to Screenshot on Mac: Every Method, Shortcut, and Where Your Files Go

*By Daniel Rozin | A Versus B | July 22, 2026*

Taking a screenshot on a Mac is faster than on most other platforms once you know the shortcuts. macOS has four built-in screenshot methods covering every scenario — full screen, a specific window, a custom selection, or a timed capture — all accessible without any additional software. Here's exactly how each one works.

## The 4 Mac Screenshot Keyboard Shortcuts

All Mac screenshots use the **Command (⌘)** key as the base, combined with **Shift** and a number. macOS has used this shortcut scheme since OS X 10.2 and it hasn't changed.

### Shortcut 1: Shift + Command + 3 — Full Screen Screenshot

**What it captures:** Every pixel on your display. If you have multiple monitors, each screen gets its own file.

**How it works:**
1. Press **Shift + Command (⌘) + 3** at the same time
2. You'll hear a camera shutter sound (unless sound is muted)
3. A thumbnail preview appears in the bottom-right corner for a few seconds
4. The file saves automatically to your Desktop as `Screenshot [date] at [time].png`

This is the fastest way to capture everything visible on your screen. No clicking, no dragging — one keystroke.

### Shortcut 2: Shift + Command + 4 — Custom Selection Screenshot

**What it captures:** A user-defined rectangular area that you draw by clicking and dragging.

**How it works:**
1. Press **Shift + Command (⌘) + 4**
2. Your cursor changes to a crosshair with pixel coordinates
3. Click and drag to draw the rectangle around what you want
4. Release to capture — the file saves to your Desktop

**Pro tips for the selection tool:**
- **Hold Space while dragging** to reposition the selection box without resizing it
- **Hold Shift while dragging** to constrain movement to one axis (horizontal or vertical)
- **Hold Option while dragging** to resize from the center outward rather than from the corner
- **Press Escape** at any time to cancel without taking the screenshot

### Shortcut 3: Shift + Command + 4, Then Space — Window Screenshot

**What it captures:** A clean screenshot of a single window, with a subtle drop shadow.

**How it works:**
1. Press **Shift + Command (⌘) + 4**
2. Immediately press **Space** — the cursor changes to a camera icon
3. Hover over any window (it highlights in blue when targeted)
4. Click to capture that window

This is the cleanest way to capture a specific app window. The result includes the window's drop shadow and doesn't include anything outside the window boundaries.

**Variation:** Hold **Option** while clicking the window to capture it without the drop shadow (useful when you'll be placing the screenshot over a colored background).

### Shortcut 4: Shift + Command + 5 — Screenshot Toolbar (Full Control)

**What it opens:** A floating toolbar at the bottom of your screen with all capture options plus video recording.

**How it works:**
1. Press **Shift + Command (⌘) + 5**
2. A toolbar appears with five icons:
   - **Capture Entire Screen** (same as Shift+⌘+3)
   - **Capture Selected Window** (same as Shift+⌘+4 + Space)
   - **Capture Selected Portion** (same as Shift+⌘+4)
   - **Record Entire Screen** (video)
   - **Record Selected Portion** (video)
3. Click any icon, or use the **Options** menu to change the save location, set a timer, show or hide the mouse cursor, or turn the floating thumbnail on/off
4. Click **Capture** to take the screenshot

The Shift+⌘+5 toolbar is the best option when you want to capture to a different folder (not the Desktop), set a countdown timer before capture, or access video recording without a separate tool.

### Bonus: Shift + Command + 6 — Touch Bar Screenshot

On MacBook Pro models with a Touch Bar (2016–2021), **Shift + Command + 6** captures the Touch Bar itself as a long, narrow PNG. This is rarely used but occasionally handy for documenting custom Touch Bar setups.

## How to Copy a Screenshot to Clipboard Instead of Saving a File

Add **Control (⌃)** to any shortcut to copy the screenshot to your clipboard instead of saving a file:

| Shortcut | Result |
|----------|--------|
| Control + Shift + ⌘ + 3 | Full screen → clipboard |
| Control + Shift + ⌘ + 4 | Selection → clipboard |
| Control + Shift + ⌘ + 4, then Space | Window → clipboard |

This is especially useful when you want to paste a screenshot directly into Slack, iMessage, an email, or a design app without creating a file you'll have to delete later.

## Where Are Screenshots Saved on Mac?

By default, all Mac screenshots save to your **Desktop** as PNG files named `Screenshot [date] at [time].png` — for example, `Screenshot 2026-07-22 at 10.34.52.png`.

### How to Change Where Screenshots Are Saved

**Method 1 — Using the Screenshot toolbar:**
1. Press **Shift + Command + 5** to open the toolbar
2. Click **Options**
3. Under "Save to," choose Desktop, Documents, Clipboard, Mail, Preview, or **Other Location** (lets you pick any folder)

**Method 2 — From the Options menu, choose "Other Location":**
1. Navigate to the folder you want
2. Click **Choose** — all future screenshots save there until you change it again

The save location persists until you change it, so if you pick a specific folder for a project, screenshots will keep going there after you close the toolbar.

### Why Screenshots Sometimes Don't Appear on the Desktop

If you can't find your screenshots:
- **Check the floating thumbnail**: click it within a few seconds of capture to see the file
- **Check if the save location was changed**: open Shift+⌘+5, click Options, and look at where it's currently set to save
- **Search in Finder**: Command + F in Finder, search for "Screenshot" filtered to files created today
- **Check the Trash or Desktop stacks**: macOS Desktop stacks group files by kind — expand the "Images" stack

## Screenshot Format: PNG vs. JPG

Mac screenshots default to **PNG format**, which is lossless (no image quality is lost). This results in large files — a full-screen screenshot on a 5K iMac can be 5–12 MB.

**To change screenshots to JPG format** (smaller files, slightly reduced quality):

Open Terminal and paste:
```
defaults write com.apple.screencapture type jpg
```

Press Enter, then log out and back in (or restart). All future screenshots save as JPGs.

To revert to PNG:
```
defaults write com.apple.screencapture type png
```

You can also set the format to PDF, TIFF, GIF, or BMP using the same command with the appropriate extension.

## How to Take a Screenshot on Mac Without a Keyboard

If you don't have access to keyboard shortcuts (physical disability, broken keys, or using a non-standard keyboard):

1. **Use the Screenshot toolbar**: Open Shift+⌘+5 with the mouse by going to **Applications → Utilities → Screenshot** (you can also search for "Screenshot" in Spotlight with ⌘+Space)
2. **Use Grab** (older Macs): In macOS Mojave (10.14) and earlier, a separate app called Grab lived in Applications → Utilities. It was replaced by the Screenshot toolbar in Catalina (10.15)
3. **Use Preview**: Open Preview → File → Take Screenshot → choose Full Screen, From Selection, or From Window

## Third-Party Screenshot Tools for Mac

The built-in shortcuts handle most needs, but power users often add a third-party tool for annotation, scrolling capture, or screen recording features:

- **CleanShot X**: The most popular premium screenshot tool. Adds scrolling capture, annotations, pinned screenshots, and built-in cloud sharing. ~$29 one-time.
- **Skitch (by Evernote)**: Free, great for quick annotation with arrows, text boxes, and shapes.
- **Monosnap**: Free, captures screenshots and records video, includes a cloud storage component.
- **Snagit (TechSmith)**: Professional-grade capture and annotation. Better suited for documentation teams than casual users. ~$63/year.

For most people, the built-in Mac shortcuts are all they need. A third-party tool is worth adding if you regularly annotate screenshots before sharing, need scrolling capture (capturing content longer than your screen height), or want a dedicated clipboard history for images.

## Summary: Mac Screenshot Shortcuts Cheat Sheet

| What You Want | Shortcut |
|---------------|----------|
| Full screen → save to Desktop | Shift + ⌘ + 3 |
| Selection (drag area) → save to Desktop | Shift + ⌘ + 4 |
| Single window → save to Desktop | Shift + ⌘ + 4, then Space |
| All options + video recording | Shift + ⌘ + 5 |
| Full screen → clipboard | Control + Shift + ⌘ + 3 |
| Selection → clipboard | Control + Shift + ⌘ + 4 |
| Window → clipboard | Control + Shift + ⌘ + 4, then Space |

If you're deciding between Mac and Windows and curious how their screenshot tools compare, see our [Mac vs Windows comparison](/compare/mac-vs-windows). For Mac hardware comparisons, our [MacBook Air vs MacBook Pro breakdown](/compare/macbook-air-vs-macbook-pro) covers performance, display, and price differences across the current lineup.

---

*Related: [Mac vs Windows — Which Is Right for You?](/compare/mac-vs-windows)*
