/**
 * DAN-2160 Wave 8 — Add missing key differences to KD=7 pages
 * 
 * Pages targeted (all at positions 11-20, all have only 7 key differences):
 *   - youtube-music-vs-soundcloud (pos 11, nearest to page 1)
 *   - macbook-air-vs-macbook-pro-difference-2026-specs (pos 19-20)
 *   - ps5-pro-vs-xbox-series-x-performance-comparison-2026 (pos 20)
 *   - virat-kohli-vs-sachin-tendulkar (pos 15)
 *   - samsung-galaxy-vs-motorola (pos 18)
 *
 * Run: node scripts/dan2160-wave8-kd-expansion.mjs
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();
const log = (...a) => console.log(...a);

const NEW_KDS = {
  'youtube-music-vs-soundcloud': [
    {
      label: 'Artist Upload Tools',
      aValue: 'No direct upload (need distributor like DistroKid)',
      bValue: 'Yes — artists upload directly, free and paid tiers',
      winner: 'B',
      explanation: 'SoundCloud is the go-to platform for unsigned artists and bedroom producers because they can upload tracks without a middleman, unlike YouTube Music which requires a music distributor.'
    },
    {
      label: 'Social / Community Features',
      aValue: 'Minimal (likes, playlist sharing)',
      bValue: 'Track comments, reposts, follower activity feeds',
      winner: 'B',
      explanation: 'SoundCloud has Twitter-like social mechanics — comment at a specific timestamp, repost to followers, build a creator-to-fan relationship. YouTube Music is purely a listening experience.'
    },
    {
      label: 'Discovery Algorithm Quality',
      aValue: 'Excellent (Google/YouTube listening signals)',
      bValue: 'Good (genre charts, trending, SoundCloud Weekly)',
      winner: 'A',
      explanation: 'YouTube Music\'s recommendation engine inherits billions of YouTube play signals and is widely regarded as more accurate for discovering music you\'ll actually enjoy.'
    },
    {
      label: 'Smart TV & Cast Support',
      aValue: 'Full (Chromecast, Apple TV, Fire TV, Smart TV apps)',
      bValue: 'Limited (web and mobile primarily)',
      winner: 'A',
      explanation: 'YouTube Music has native apps on all major smart TV platforms; SoundCloud is largely a mobile and desktop product with limited TV ecosystem support.'
    },
  ],

  'macbook-air-vs-macbook-pro-difference-2026-specs': [
    {
      label: 'Active Cooling / Fan',
      aValue: 'Fanless — completely silent, passive cooling only',
      bValue: 'Fan-cooled — sustains peak performance under load',
      winner: 'Neither (depends on use case)',
      explanation: 'MacBook Air runs silently but throttles under sustained heavy workloads (video rendering, ML). MacBook Pro\'s fan engages only when needed and allows consistent peak performance for pros.'
    },
    {
      label: 'Display Brightness (Nits)',
      aValue: 'Up to 500 nits (standard), 1000 nits HDR content',
      bValue: 'Up to 1000 nits sustained / 1600 nits peak (XDR)',
      winner: 'B',
      explanation: 'MacBook Pro\'s Liquid Retina XDR is significantly brighter — critical for outdoor use, video editing, or anyone who uses the laptop in well-lit environments.'
    },
    {
      label: 'SD Card Slot',
      aValue: 'No SD card slot',
      bValue: 'Full-size SDXC card slot (14" and 16" Pro)',
      winner: 'B',
      explanation: 'The built-in SD card reader on MacBook Pro saves photographers and videographers from needing a dongle — a recurring pain point for Air users.'
    },
    {
      label: 'HDMI Port',
      aValue: 'No HDMI (adapter required)',
      bValue: 'Full-size HDMI 2.1 port included',
      winner: 'B',
      explanation: 'MacBook Pro includes full-size HDMI for direct monitor/TV connection. MacBook Air users need a USB-C hub or dongle, adding cost and desk clutter.'
    },
  ],

  'ps5-pro-vs-xbox-series-x-performance-comparison-2026': [
    {
      label: 'Storage Expansion Method',
      aValue: 'Standard M.2 NVMe SSD (any PCIe 4.0+ drive)',
      bValue: 'Proprietary Seagate Expansion Card only',
      winner: 'A',
      explanation: 'PS5 Pro accepts any compatible M.2 SSD (prices have dropped significantly); Xbox locks users into proprietary Seagate cards at a premium price.'
    },
    {
      label: 'Controller Battery Life',
      aValue: 'DualSense: ~12 hours (built-in USB-C rechargeable)',
      bValue: 'Xbox Wireless Controller: ~40 hours (AA batteries)',
      winner: 'B (longevity)',
      explanation: 'Xbox controllers last far longer per charge. While AA batteries feel old-fashioned, they allow quick swaps; DualSense requires cable or dock charging.'
    },
    {
      label: 'Multimedia Hub Features',
      aValue: 'Strong streaming support (all major apps)',
      bValue: 'Full media hub: Dolby Vision gaming, Dolby Atmos, 4K Blu-ray',
      winner: 'B',
      explanation: 'Xbox Series X is arguably the best media player in the living room — 4K Blu-ray, Dolby Vision for gaming (not just HDR10), full Atmos audio chain. PS5 Pro added Dolby Atmos support in 2025 but Xbox remains the multimedia benchmark.'
    },
    {
      label: 'Cross-Buy / Backward Compatibility',
      aValue: 'PS4 titles run on PS5 (not PS3/PS2/PS1 by default)',
      bValue: 'Backward compatible with Xbox One, 360, and original Xbox titles',
      winner: 'B',
      explanation: 'Xbox has the deepest backward compatibility library in console history — thousands of older titles run on Series X, many with auto-HDR enhancements. PS5 Pro backward compatibility is limited to PS4.'
    },
  ],

  'virat-kohli-vs-sachin-tendulkar': [
    {
      label: 'T20 International Record',
      aValue: 'T20I avg 52+, 4,000+ runs, highest 122* — all-time great',
      bValue: 'Only 1 T20I (retired era; T20I format barely existed)',
      winner: 'A (by default)',
      explanation: 'T20 internationals barely existed during Sachin\'s prime. Kohli is statistically one of the greatest T20I batters ever — a format comparison that strongly favors Kohli by circumstance of era.'
    },
    {
      label: 'ICC Rankings Peak (ODI)',
      aValue: 'Held #1 ODI ranking for record 900+ days (multiple spells)',
      bValue: '#1 for years in the 1990s–2000s cycle (pre-modern rankings system)',
      winner: 'A (numerical record in modern era)',
      explanation: 'Kohli holds the record for cumulative days at #1 in the ICC ODI batting rankings. Both players dominated their respective eras, but Kohli\'s record is quantifiably longer.'
    },
    {
      label: 'IPL Performance',
      aValue: '7,000+ IPL runs, highest scorer in competition history',
      bValue: 'Did not participate (Mumbai Indians owner/player in early editions only)',
      winner: 'A (by era)',
      explanation: 'Kohli is the all-time leading run-scorer in IPL history. Sachin played in the IPL\'s early years but retired before the competition matured into the global spectacle it is today.'
    },
  ],

  'samsung-galaxy-vs-motorola': [
    {
      label: 'Wired Charging Speed (Flagship)',
      aValue: '45W (Galaxy S25 Ultra)',
      bValue: '68W (Motorola Edge 50 Ultra / Edge+)',
      winner: 'B',
      explanation: 'Motorola\'s flagship phones charge significantly faster wired than Samsung\'s equivalent Galaxy models, getting to full charge in around 40 minutes vs Samsung\'s 60+ minutes.'
    },
    {
      label: 'IP Water Resistance Breadth',
      aValue: 'IP68 on S-series; IP67 on A-series mid-rangers',
      bValue: 'IP68 on Edge Ultra; IP54 on most mid-range Moto models',
      winner: 'A (more models with IP67+)',
      explanation: 'Samsung brings IP67 or IP68 ratings to a wider range of mid-range and budget devices; Motorola\'s full IP68 is mostly limited to flagship Edge models.'
    },
    {
      label: 'AI Features Depth',
      aValue: 'Galaxy AI: Circle to Search, Live Translate, Generative Edit, Note Assist',
      bValue: 'Moto AI: Perplexity integration, AI photo editing, Pay Attention summary',
      winner: 'A',
      explanation: 'Samsung Galaxy AI is more deeply embedded across the OS — from camera to notes to live calls. Motorola AI is useful and improving but narrower in scope and tighter Perplexity partnership for search.'
    },
    {
      label: 'Long-Term Software Support',
      aValue: '7 years of OS + security updates (S25 series)',
      bValue: '3 years OS updates, 4 years security (Edge series)',
      winner: 'A',
      explanation: 'Samsung dramatically extended software support to 7 years for its flagship S25 line, matching Google Pixel. Motorola lags significantly at 3 OS updates — a key consideration for long-term value.'
    },
  ],
};

let totalAdded = 0;

for (const [slug, newKds] of Object.entries(NEW_KDS)) {
  const page = await prisma.comparison.findFirst({
    where: { slug },
    select: { id: true, slug: true, keyDifferences: true }
  });

  if (!page) {
    log(`  SKIP: ${slug} not found`);
    continue;
  }

  const existing = Array.isArray(page.keyDifferences) ? page.keyDifferences : [];
  const merged = [...existing, ...newKds];

  await prisma.comparison.update({
    where: { id: page.id },
    data: {
      keyDifferences: merged,
      updatedAt: new Date()
    }
  });

  log(`  ✓ ${slug}: ${existing.length} → ${merged.length} KDs (+${newKds.length})`);
  totalAdded += newKds.length;
}

log(`\nWave 8 done. ${totalAdded} new key differences added across ${Object.keys(NEW_KDS).length} pages.`);
await prisma.$disconnect();
