/**
 * Publish: iPhone 16 Pro vs iPhone 16 Pro Max (DAN-429 Week 1 variant comparison)
 *
 * Editorial 2-way variant comparison for the May 2026 sprint.
 * Uses saveComparison from comparison-service — idempotent on re-run.
 *
 * Run with:
 *   npx tsx scripts/publish-iphone-16-pro-vs-pro-max.ts
 */

import { saveComparison } from "../src/lib/services/comparison-service";
import type { ComparisonPageData } from "../src/types";

const data: ComparisonPageData = {
  id: "iphone-16-pro-vs-iphone-16-pro-max",
  slug: "iphone-16-pro-vs-iphone-16-pro-max",
  title: "iPhone 16 Pro vs iPhone 16 Pro Max",
  shortAnswer:
    "The iPhone 16 Pro Max is the better phone for most people who can accept the size and $200 premium — its larger display and dramatically longer battery life justify the upgrade. The iPhone 16 Pro is the right pick if you prioritize one-handed usability, prefer a lighter device, or simply don't need that extra battery headroom.",
  category: "technology",
  verdict:
    "If battery life and screen real estate matter to you — and for the majority of smartphone buyers they do — the Pro Max is the stronger buy. Apple stretched the Pro Max battery to 33 hours of video playback versus the Pro's 27 hours, a 22% advantage that translates to a real-world difference of hours in a heavy-use day. The 6.9-inch display also makes the Pro Max noticeably better for video, reading, and productivity. The trade-offs are weight (227g vs 187g) and size: the Pro Max is harder to use one-handed and tighter in a pocket. If you're upgrading from a Mini or SE, the standard Pro may still feel large. Both phones run the A18 Pro chip with identical cameras, so any edge in those areas comes from the battery and display, not the silicon.",
  keyDifferences: [
    {
      label: "Display size",
      entityAValue: '6.3" Super Retina XDR',
      entityBValue: '6.9" Super Retina XDR',
      winner: "b",
    },
    {
      label: "Battery life (video playback)",
      entityAValue: "Up to 27 hours",
      entityBValue: "Up to 33 hours",
      winner: "b",
    },
    {
      label: "Weight",
      entityAValue: "187g (6.6 oz) — lighter",
      entityBValue: "227g (8.0 oz)",
      winner: "a",
    },
    {
      label: "Starting price",
      entityAValue: "$999",
      entityBValue: "$1,199",
      winner: "a",
    },
    {
      label: "One-handed usability",
      entityAValue: "Easier — narrower (71.5 mm wide)",
      entityBValue: "Harder — wider (77.6 mm wide)",
      winner: "a",
    },
    {
      label: "Chipset",
      entityAValue: "A18 Pro",
      entityBValue: "A18 Pro",
      winner: "tie",
    },
    {
      label: "Main camera",
      entityAValue: "48 MP Fusion + 48 MP Ultra Wide + 12 MP 5× telephoto",
      entityBValue: "48 MP Fusion + 48 MP Ultra Wide + 12 MP 5× telephoto",
      winner: "tie",
    },
    {
      label: "Optical zoom",
      entityAValue: "5× (120mm equivalent)",
      entityBValue: "5× (120mm equivalent)",
      winner: "tie",
    },
  ],
  entities: [
    {
      id: "iphone-16-pro",
      slug: "iphone-16-pro",
      name: "iPhone 16 Pro",
      shortDesc:
        "Apple's compact flagship with A18 Pro chip, 6.3-inch display, and titanium build — starting at $999.",
      imageUrl: null,
      entityType: "smartphone",
      position: 0,
      pros: [
        "Lighter and more compact (187g, 6.3-inch display)",
        "Easier one-handed use and pocket fit",
        "$200 cheaper than the Pro Max",
        "Same A18 Pro chip and camera system as Pro Max",
        "Identical 5× optical zoom, Action Button, and USB 3",
      ],
      cons: [
        "Shorter battery life (27 hrs video vs 33 hrs on Pro Max)",
        "Smaller screen — less immersive for video and media",
        "Speakers slightly less loud due to smaller chassis",
      ],
      bestFor:
        "Users who prioritize portability, one-handed use, or a lower entry price without giving up any camera or chip performance.",
    },
    {
      id: "iphone-16-pro-max",
      slug: "iphone-16-pro-max",
      name: "iPhone 16 Pro Max",
      shortDesc:
        "Apple's largest flagship with a 6.9-inch display, best-in-class battery, and the same A18 Pro chip — starting at $1,199.",
      imageUrl: null,
      entityType: "smartphone",
      position: 1,
      pros: [
        "Best-in-class battery life: up to 33 hours video playback",
        "Larger 6.9-inch display — better for video, reading, productivity",
        "Louder stereo speakers",
        "Same A18 Pro chip and camera system as Pro",
      ],
      cons: [
        "Heavier (227g vs 187g) and wider (77.6 mm vs 71.5 mm)",
        "Harder to use one-handed — most people need two hands",
        "$200 more expensive than the Pro",
        "Larger footprint makes some cases and mounts incompatible",
      ],
      bestFor:
        "Media consumers, travelers, heavy users, and anyone who regularly watches video, games, or works on their phone for extended periods.",
    },
  ],
  attributes: [
    {
      id: "attr-display-size",
      slug: "display-size",
      name: "Display Size",
      unit: "inches",
      category: "Display",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: "iphone-16-pro", valueText: "6.3", valueNumber: 6.3, valueBoolean: null },
        { entityId: "iphone-16-pro-max", valueText: "6.9", valueNumber: 6.9, valueBoolean: null, winner: true },
      ],
    },
    {
      id: "attr-display-tech",
      slug: "display-technology",
      name: "Display Technology",
      unit: null,
      category: "Display",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: "iphone-16-pro", valueText: "OLED Super Retina XDR, ProMotion 120Hz, Always-On", valueNumber: null, valueBoolean: null },
        { entityId: "iphone-16-pro-max", valueText: "OLED Super Retina XDR, ProMotion 120Hz, Always-On", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "attr-battery",
      slug: "battery-life-video",
      name: "Battery Life (Video Playback)",
      unit: "hours",
      category: "Battery",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: "iphone-16-pro", valueText: "27 hrs", valueNumber: 27, valueBoolean: null },
        { entityId: "iphone-16-pro-max", valueText: "33 hrs", valueNumber: 33, valueBoolean: null, winner: true },
      ],
    },
    {
      id: "attr-chip",
      slug: "chipset",
      name: "Chipset",
      unit: null,
      category: "Performance",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: "iphone-16-pro", valueText: "Apple A18 Pro (3nm)", valueNumber: null, valueBoolean: null },
        { entityId: "iphone-16-pro-max", valueText: "Apple A18 Pro (3nm)", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "attr-main-camera",
      slug: "main-camera",
      name: "Main Camera",
      unit: "MP",
      category: "Camera",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: "iphone-16-pro", valueText: "48 MP, f/1.78, OIS, sensor-shift", valueNumber: null, valueBoolean: null },
        { entityId: "iphone-16-pro-max", valueText: "48 MP, f/1.78, OIS, sensor-shift", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "attr-telephoto",
      slug: "telephoto-zoom",
      name: "Telephoto Zoom",
      unit: null,
      category: "Camera",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: "iphone-16-pro", valueText: "5× optical (12 MP, 120mm eq.)", valueNumber: null, valueBoolean: null },
        { entityId: "iphone-16-pro-max", valueText: "5× optical (12 MP, 120mm eq.)", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "attr-weight",
      slug: "weight",
      name: "Weight",
      unit: "grams",
      category: "Design",
      dataType: "number",
      higherIsBetter: false,
      values: [
        { entityId: "iphone-16-pro", valueText: "187g", valueNumber: 187, valueBoolean: null, winner: true },
        { entityId: "iphone-16-pro-max", valueText: "227g", valueNumber: 227, valueBoolean: null },
      ],
    },
    {
      id: "attr-dimensions",
      slug: "dimensions",
      name: "Dimensions",
      unit: "mm",
      category: "Design",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: "iphone-16-pro", valueText: "149.6 × 71.5 × 8.25 mm", valueNumber: null, valueBoolean: null },
        { entityId: "iphone-16-pro-max", valueText: "163.0 × 77.6 × 8.25 mm", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "attr-price",
      slug: "starting-price",
      name: "Starting Price (USD)",
      unit: "USD",
      category: "Price",
      dataType: "number",
      higherIsBetter: false,
      values: [
        { entityId: "iphone-16-pro", valueText: "$999", valueNumber: 999, valueBoolean: null, winner: true },
        { entityId: "iphone-16-pro-max", valueText: "$1,199", valueNumber: 1199, valueBoolean: null },
      ],
    },
    {
      id: "attr-storage",
      slug: "storage-options",
      name: "Storage Options",
      unit: null,
      category: "Storage",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: "iphone-16-pro", valueText: "128 GB, 256 GB, 512 GB, 1 TB", valueNumber: null, valueBoolean: null },
        { entityId: "iphone-16-pro-max", valueText: "256 GB, 512 GB, 1 TB", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "attr-build",
      slug: "build-material",
      name: "Build Material",
      unit: null,
      category: "Design",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: "iphone-16-pro", valueText: "Titanium frame, textured matte glass back, Ceramic Shield front", valueNumber: null, valueBoolean: null },
        { entityId: "iphone-16-pro-max", valueText: "Titanium frame, textured matte glass back, Ceramic Shield front", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "attr-usb",
      slug: "connectivity",
      name: "Charging & Connectivity",
      unit: null,
      category: "Connectivity",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: "iphone-16-pro", valueText: "USB-C (USB 3), Wi-Fi 7, Bluetooth 5.3, Thread, UWB, MagSafe", valueNumber: null, valueBoolean: null },
        { entityId: "iphone-16-pro-max", valueText: "USB-C (USB 3), Wi-Fi 7, Bluetooth 5.3, Thread, UWB, MagSafe", valueNumber: null, valueBoolean: null },
      ],
    },
  ],
  faqs: [
    {
      question: "Is the iPhone 16 Pro Max worth the extra $200 over the Pro?",
      answer:
        "For most buyers, yes. The Pro Max's 33-hour battery life (vs 27 hours for the Pro) is a meaningful real-world advantage, and the 6.9-inch display is noticeably better for video and media. If you watch a lot of content on your phone, travel frequently, or are a heavy user, the $200 pays for itself quickly. If you prefer a lighter, smaller phone and don't need the extra battery, the Pro at $999 gives you the same chip and camera system.",
    },
    {
      question: "Do the iPhone 16 Pro and Pro Max have the same cameras?",
      answer:
        "Yes — the camera hardware is identical on both models. Both have a 48 MP main sensor (f/1.78), a 48 MP ultra-wide camera with autofocus, a 12 MP 5× optical telephoto (120mm equivalent), and a 12 MP TrueDepth front camera. Apple equalised the telephoto in the iPhone 16 generation: the 16 Pro Max no longer has an exclusive zoom advantage over the Pro as it did in prior generations.",
    },
    {
      question: "Which iPhone 16 Pro model is better for one-handed use?",
      answer:
        "The iPhone 16 Pro. At 6.3 inches (149.6 × 71.5 mm, 187g) it's the more manageable size for one-hand operation. The Pro Max at 6.9 inches (163.0 × 77.6 mm, 227g) is substantially larger and most people find it requires two hands for reliable, comfortable use.",
    },
    {
      question: "Do both phones have the same A18 Pro chip?",
      answer:
        "Yes. Both the iPhone 16 Pro and iPhone 16 Pro Max run the Apple A18 Pro chip — the same 3nm silicon with the 6-core CPU, 6-core GPU, and 16-core Neural Engine. Performance benchmarks are virtually identical between the two models. The difference in battery endurance comes from the Pro Max's larger physical battery, not any chip difference.",
    },
    {
      question: "Is there a storage difference between the two models?",
      answer:
        "Slightly. The iPhone 16 Pro starts at 128 GB and is also available in 256 GB, 512 GB, and 1 TB. The iPhone 16 Pro Max starts at 256 GB and is available in 512 GB and 1 TB. If you want the entry-level Pro price ($999) but the smallest storage option (128 GB), only the Pro is available at that tier.",
    },
  ],
  relatedComparisons: [
    {
      slug: "iphone-16-pro-vs-galaxy-s25-ultra",
      title: "iPhone 16 Pro vs Samsung Galaxy S25 Ultra",
      category: "technology",
    },
    {
      slug: "chatgpt-vs-claude",
      title: "ChatGPT vs Claude",
      category: "technology",
    },
  ],
  relatedBlogPosts: [],
  metadata: {
    metaTitle: "iPhone 16 Pro vs Pro Max: Which Should You Buy in 2026?",
    metaDescription:
      "iPhone 16 Pro vs Pro Max: same A18 Pro chip and cameras, but the Pro Max wins on battery (33 vs 27 hrs) and display size. Full spec comparison, key differences, and buying guide.",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isAutoGenerated: false,
    isHumanReviewed: true,
    viewCount: 0,
  },
};

async function main() {
  console.log(`Publishing comparison slug="${data.slug}"...`);
  const result = await saveComparison(data);
  if (!result) {
    console.error("FAIL: saveComparison returned null. Check DATABASE_URL.");
    process.exit(1);
  }
  console.log(`OK: id=${result.id}`);
  console.log(
    `Live URL (after ISR revalidate): https://aversusb.net/compare/${data.slug}`
  );
}

main().catch((err) => {
  console.error("Publish error:", err);
  process.exit(1);
});
