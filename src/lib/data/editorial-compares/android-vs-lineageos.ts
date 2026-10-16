import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Android vs LineageOS.
 * Android Open Source Project site; LineageOS home, FAQ and devices wiki.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Android is Google's mobile platform; phones ship with a maker's build, and the source is published through the Android Open Source Project, twice a year from 2026, with Android 17 now available. LineageOS is a free, open-source distribution based on Android that installs on supported devices from more than 20 manufacturers to extend their lifespan. LineageOS supports only listed devices, often needs an unlocked bootloader, and requires GApps or MicroG for push notifications. Choose stock Android for simplicity; LineageOS to keep a supported device updated longer.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Android is the platform; phones ship with a maker's Android build.
- LineageOS is a free, open-source Android distribution.
- LineageOS supports only devices on its list; similar models are not interchangeable.
- LineageOS extends devices from more than 20 manufacturers.
- Push notifications on LineageOS need GApps or MicroG.

Source and releases

Android source code is published through the Android Open Source Project (AOSP). From 2026, Google publishes source to AOSP in Q2 and Q4, and Android 17 is available. LineageOS builds on Android and publishes its own releases and changelogs.

Installing LineageOS

1. Check your exact model on the LineageOS devices list; devices not listed are not supported.
2. Follow the device's install guide, which usually needs an unlocked bootloader.
3. Firmware such as the bootloader and modem is hardware-specific and cannot be updated by LineageOS itself.

Apps and services

Stock Android phones usually include Google apps and Play services. On LineageOS, Google apps (GApps) or MicroG are needed for push notifications, and some devices do not pass Play Integrity because LineageOS does not hide bootloader unlock status.

Who should pick which

Keep stock Android if you want the simplest setup and full app compatibility. Try LineageOS if your device is supported and you want to keep it running after the maker stops updates.`;

const BUILT = buildEditorialComparison({
  slug: "android-vs-lineageos",
  title: "Android vs LineageOS: Stock vs Open-Source ROM",
  shortAnswer: SHORT_ANSWER,
  verdict: "Android (stock): ships on your phone with the maker's updates and Google apps.\n\nLineageOS: free, open-source Android distribution for listed devices from 20+ manufacturers.\n\nBack up your data before installing a custom OS.",
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "android", "slug": "android", "name": "Android", "shortDesc": "Google's mobile platform, with source published through the Android Open Source Project.", "imageUrl": null, "entityType": "software", "position": 0, "pros": ["Ships on phones with manufacturer updates and Google apps", "Android 17 available", "Source published to AOSP twice a year (Q2 and Q4) from 2026"], "cons": ["Update length depends on the device maker", "Manufacturer apps and changes vary by brand"], "bestFor": "Most users who want the phone as shipped"},
    {"id": "lineageos", "slug": "lineageos", "name": "LineageOS", "shortDesc": "Free, open-source Android distribution for supported devices.", "imageUrl": null, "entityType": "software", "position": 1, "pros": ["Free and open source, based on Android", "Extends the lifespan of devices from more than 20 manufacturers", "Power-user tools such as Unix command-line utilities"], "cons": ["Only listed devices are supported", "Push notifications need GApps or MicroG; some devices fail Play Integrity"], "bestFor": "Owners of supported older devices who can install a custom OS"},
  ],
  keyDifferences: [{"label": "What it is", "entityAValue": "Platform shipped by phone makers", "entityBValue": "Open-source Android distribution", "winner": "tie"}, {"label": "Device support", "entityAValue": "Every Android phone", "entityBValue": "Listed devices only", "winner": "tie"}, {"label": "Google apps", "entityAValue": "Usually included", "entityBValue": "Install GApps or MicroG", "winner": "tie"}, {"label": "Installation", "entityAValue": "Pre-installed", "entityBValue": "Usually needs unlocked bootloader", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Source code", "Mobile OS", "android", "lineageos", "AOSP; published Q2 and Q4 from 2026", "Open source"),
    textAttr("a1", "Latest version", "Mobile OS", "android", "lineageos", "Android 17", "Based on Android"),
    textAttr("a2", "Manufacturers covered", "Mobile OS", "android", "lineageos", "All Android makers", "More than 20"),
    textAttr("a3", "Push notifications", "Mobile OS", "android", "lineageos", "Built in with Google services", "Need GApps or MicroG"),
    textAttr("a4", "Firmware updates", "Mobile OS", "android", "lineageos", "From the device maker", "Not updated by LineageOS"),
  ],
  faqs: [{"question": "Is LineageOS the same as Android?", "answer": "LineageOS is a free, open-source operating system based on the Android platform. Stock Android is the version your phone maker ships."}, {"question": "Which phones support LineageOS?", "answer": "Only the devices on the LineageOS devices list. A similar model, or one with a different year in its name, is not the same device."}, {"question": "Do Google apps work on LineageOS?", "answer": "They are not included. Push notifications require GApps or MicroG, installed before the first boot."}, {"question": "Why doesn't my LineageOS phone pass Play Integrity?", "answer": "Some devices report bootloader unlock and verity status, and LineageOS does not hide those flags."}, {"question": "Can LineageOS update my phone's firmware?", "answer": "No. Bootloader, modem and similar firmware are hardware-specific; some device packages ship the expected firmware, others need it flashed first."}, {"question": "What is the latest Android version?", "answer": "Android 17 is available, and from 2026 Google publishes AOSP source in Q2 and Q4."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Stock Android for simplicity and full app support; LineageOS to extend a supported device's life.", keyFact: "LineageOS supports listed devices from more than 20 manufacturers; Android 17 is the current Android release." },
  citationStats: {"sourceCount": 4, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Android Open Source Project", "url": "https://source.android.com/"}, {"name": "LineageOS", "url": "https://lineageos.org/"}, {"name": "LineageOS Wiki: FAQ", "url": "https://wiki.lineageos.org/faq"}, {"name": "LineageOS Wiki: Devices", "url": "https://wiki.lineageos.org/devices/"}]},
  resources: [{"type": "external", "label": "Android Open Source Project", "url": "https://source.android.com/", "description": "Android 17 available; AOSP source published in Q2 and Q4 from 2026."}, {"type": "external", "label": "LineageOS", "url": "https://lineageos.org/", "description": "Free, open-source Android distribution; devices from more than 20 manufacturers."}, {"type": "external", "label": "LineageOS Wiki: FAQ", "url": "https://wiki.lineageos.org/faq", "description": "GApps or MicroG for push notifications; Play Integrity; firmware not updated by LineageOS."}, {"type": "external", "label": "LineageOS Wiki: Devices", "url": "https://wiki.lineageos.org/devices/", "description": "Devices not listed are not supported; official bootloader unlock filter."}],
  metaTitle: "Android vs LineageOS | A Versus B",
});

BUILT.metadata.metaDescription = "Android vs LineageOS: stock Android vs a free open-source Android distribution. Device support, Google apps, bootloader, firmware and updates.";

export const ANDROID_VS_LINEAGEOS: EditorialComparison = BUILT;
