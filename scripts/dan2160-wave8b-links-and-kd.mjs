/**
 * DAN-2160 Wave 8b — Additional links + F-16 key differences
 * 
 * Actions:
 * 1. F-16 vs F-15: KD 7→10, +8 inbound military links
 * 2. MacBook Air vs Pro 2026: +6 inbound MacBook links
 * 3. IKEA vs Wayfair: +1 furniture link
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();
const log = (...a) => console.log(...a);

// ─────────────────────────────────────────────────────────────
// 1. F-16 vs F-15 — add key differences (7 → 10)
// ─────────────────────────────────────────────────────────────
log("\n=== 1. f-16-vs-f-15: expand key differences ===");
const F16 = await prisma.comparison.findFirst({
  where: { slug: 'f-16-vs-f-15' },
  select: { id: true, keyDifferences: true }
});

if (F16) {
  const existing = Array.isArray(F16.keyDifferences) ? F16.keyDifferences : [];
  const newKDs = [
    {
      label: 'Crew Configuration',
      aValue: 'Single-seat (F-16C) and two-seat (F-16D) variants',
      bValue: 'Single-seat (F-15C/E) and two-seat (F-15D/E Strike Eagle)',
      winner: 'Neither',
      explanation: 'Both aircraft have single and two-seat variants. The F-15E Strike Eagle\'s two-seat configuration supports a dedicated weapons systems officer, making it better suited for complex ground-attack missions.'
    },
    {
      label: 'Fly-by-Wire vs Conventional Controls',
      aValue: 'Full digital fly-by-wire flight control system',
      bValue: 'Conventional mechanical flight controls (F-15C); fly-by-wire added later',
      winner: 'A (F-16 pioneered the tech)',
      explanation: 'The F-16 was the first operational fly-by-wire aircraft, giving it inherently greater maneuverability through software-managed instability. This was revolutionary when introduced and influenced all modern fighter design.'
    },
    {
      label: 'Combat Record',
      aValue: '70+ aerial kills; used by 25+ nations including US, Israel, Turkey',
      bValue: '100+ aerial kills with zero air-to-air losses; only US/allied nations',
      winner: 'B (zero losses record)',
      explanation: 'The F-15 Eagle holds one of the most remarkable air combat records in history: 100+ confirmed air-to-air kills with zero aerial combat losses. Its twin-engine safety and power are key factors.'
    },
  ];
  const merged = [...existing, ...newKDs];
  await prisma.comparison.update({
    where: { id: F16.id },
    data: { keyDifferences: merged, updatedAt: new Date() }
  });
  log(`  ✓ f-16-vs-f-15: ${existing.length} → ${merged.length} KDs (+${newKDs.length})`);
}

// ─────────────────────────────────────────────────────────────
// 2. Helper: insert link if missing
// ─────────────────────────────────────────────────────────────
async function addLink({ fromSlug, fromPath, toPath, anchorText, score = 1.1 }) {
  // Verify source page exists
  if (fromSlug) {
    const exists = await prisma.comparison.findFirst({ where: { slug: fromSlug }, select: { id: true } });
    if (!exists) { log(`  · skip (page missing): ${fromSlug}`); return; }
  }
  const already = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (already) { log(`  · skip (exists): ${fromPath} → ${toPath}`); return; }
  await prisma.internalLink.create({ data: { fromPath, toPath, anchorText, linkType: 'related', position: 'inline', score } });
  log(`  ✓ Link: ${fromPath} → ${toPath}  anchor="${anchorText}"`);
}

// ─────────────────────────────────────────────────────────────
// 3. F-16 vs F-15 — add military inbound links
// ─────────────────────────────────────────────────────────────
log("\n=== 2. f-16-vs-f-15: add inbound links ===");
const F16_LINKS = [
  { fromSlug: 'cold-war-vs-war-on-terror', fromPath: '/compare/cold-war-vs-war-on-terror', toPath: '/compare/f-16-vs-f-15', anchorText: 'F-16 vs F-15: Cold War fighter jets', score: 1.2 },
  { fromSlug: 'vietnam-war-vs-korean-war', fromPath: '/compare/vietnam-war-vs-korean-war', toPath: '/compare/f-16-vs-f-15', anchorText: 'F-16 vs F-15 performance comparison', score: 1.1 },
  { fromSlug: 'us-fighters-vs-russian-fighters', fromPath: '/compare/us-fighters-vs-russian-fighters', toPath: '/compare/f-16-vs-f-15', anchorText: 'F-16 vs F-15: US fighter aircraft', score: 1.3 },
  { fromSlug: 'marines-vs-army', fromPath: '/compare/marines-vs-army', toPath: '/compare/f-16-vs-f-15', anchorText: 'F-16 vs F-15 air support comparison', score: 1.0 },
  { fromSlug: 'eurofighter-typhoon-vs-gripen', fromPath: '/compare/eurofighter-typhoon-vs-gripen', toPath: '/compare/f-16-vs-f-15', anchorText: 'F-16 vs F-15 fighter jet comparison', score: 1.2 },
  { fromSlug: 'us-navy-vs-us-army', fromPath: '/compare/us-navy-vs-us-army', toPath: '/compare/f-16-vs-f-15', anchorText: 'F-16 vs F-15 aircraft performance', score: 1.0 },
  { fromSlug: 'abrams-tank-vs-leopard-2', fromPath: '/compare/abrams-tank-vs-leopard-2', toPath: '/compare/f-16-vs-f-15', anchorText: 'F-16 vs F-15 air superiority fighters', score: 1.1 },
  { fromSlug: 'marines-vs-navy-seals', fromPath: '/compare/marines-vs-navy-seals', toPath: '/compare/f-16-vs-f-15', anchorText: 'F-16 vs F-15', score: 1.0 },
];

for (const link of F16_LINKS) {
  await addLink(link);
}

// ─────────────────────────────────────────────────────────────
// 4. MacBook Air vs Pro 2026 — add inbound links from MacBook pages
// ─────────────────────────────────────────────────────────────
log("\n=== 3. macbook-air-vs-macbook-pro-difference-2026-specs: add links ===");
const MACBOOK_LINKS = [
  { fromSlug: 'macbook-air-vs-macbook-pro', fromPath: '/compare/macbook-air-vs-macbook-pro', toPath: '/compare/macbook-air-vs-macbook-pro-difference-2026-specs', anchorText: 'MacBook Air vs Pro 2026: detailed specs comparison', score: 1.4 },
  { fromSlug: 'macbook-pro-14-vs-macbook-air', fromPath: '/compare/macbook-pro-14-vs-macbook-air', toPath: '/compare/macbook-air-vs-macbook-pro-difference-2026-specs', anchorText: 'MacBook Air vs MacBook Pro differences (2026)', score: 1.3 },
  { fromSlug: 'macbook-air-vs-macbook-pro-2026', fromPath: '/compare/macbook-air-vs-macbook-pro-2026', toPath: '/compare/macbook-air-vs-macbook-pro-difference-2026-specs', anchorText: 'MacBook Air vs MacBook Pro 2026 spec differences', score: 1.4 },
  { fromSlug: 'macbook-air-vs-macbook-pro-14', fromPath: '/compare/macbook-air-vs-macbook-pro-14', toPath: '/compare/macbook-air-vs-macbook-pro-difference-2026-specs', anchorText: 'MacBook Air vs Pro 2026: full specs breakdown', score: 1.3 },
  { fromSlug: 'macbook-air-m3-vs-macbook-pro', fromPath: '/compare/macbook-air-m3-vs-macbook-pro', toPath: '/compare/macbook-air-vs-macbook-pro-difference-2026-specs', anchorText: '2026 MacBook Air vs Pro differences', score: 1.2 },
  { fromSlug: 'macbook-vs-surface', fromPath: '/compare/macbook-vs-surface', toPath: '/compare/macbook-air-vs-macbook-pro-difference-2026-specs', anchorText: 'MacBook Air vs Pro 2026 key differences', score: 1.1 },
  { fromSlug: 'mac-mini-vs-macbook-pro', fromPath: '/compare/mac-mini-vs-macbook-pro', toPath: '/compare/macbook-air-vs-macbook-pro-difference-2026-specs', anchorText: 'MacBook Air vs MacBook Pro 2026 specs compared', score: 1.2 },
  { fromSlug: 'macbook-air-vs-surface-laptop', fromPath: '/compare/macbook-air-vs-surface-laptop', toPath: '/compare/macbook-air-vs-macbook-pro-difference-2026-specs', anchorText: 'MacBook Air vs Pro 2026 comparison', score: 1.1 },
];

for (const link of MACBOOK_LINKS) {
  await addLink(link);
}

// ─────────────────────────────────────────────────────────────
// 5. IKEA vs Wayfair — add from ikea-vs-ashley-furniture
// ─────────────────────────────────────────────────────────────
log("\n=== 4. ikea-vs-wayfair: add furniture links ===");
await addLink({
  fromSlug: 'ikea-vs-ashley-furniture',
  fromPath: '/compare/ikea-vs-ashley-furniture',
  toPath: '/compare/ikea-vs-wayfair',
  anchorText: 'IKEA vs Wayfair: which online furniture retailer wins in 2026?',
  score: 1.3
});

log("\n=== Wave 8b done ===");
await prisma.$disconnect();
