import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env.local') })
const prisma = new PrismaClient()

// DAN-2290: verify pages ranked 211-220 by GSC impressions
// Note: 4 pages tied at 113 impressions at the rank-211 boundary; all must be enriched
const TARGET_SLUGS = [
  'barcelona-vc-real-madrid-vs-cups',
  'chipotle-vs-taco-bell',
  'xero-vs-freshbooks',
  'safari-vs-firefox',
  'playstation-5-vs-xbox-series-x',
  'macbook-pro-vs-macbook-air-comparison-2026',
  'vanguard-vs-fidelity',
  'bmw-vs-mercedes',
  'jimmy-john-s-vs-subway',
  'chipotle-vs-qdoba',
  'google-vs-microsoft',
  'celsius-vs-red-bull',
  'nintendo-switch-vs-playstation-5',
]

let allGood = true
for (const slug of TARGET_SLUGS) {
  const p = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, slug: true, searchImpressions: true, content: true, isHumanReviewed: true },
  })
  if (!p) { console.log(`MISSING: ${slug}`); allGood = false; continue }
  const faqCount = await prisma.fAQ.count({ where: { comparisonId: p.id } })
  const content = p.content
  const hasExpertAnalysis = content?.expertAnalysis && content.expertAnalysis.length > 100
  const hasSources = Array.isArray(content?.sources) && content.sources.length >= 3
  const ok = hasExpertAnalysis && hasSources && faqCount >= 5 && p.isHumanReviewed
  if (!ok) allGood = false
  console.log(`${p.searchImpressions} ${p.slug}`)
  console.log(`  expertAnalysis: ${hasExpertAnalysis ? content.expertAnalysis.length + 'chars' : 'MISSING'}, sources: ${hasSources ? content.sources.length : 'MISSING'}, faqs: ${faqCount}, enrichedBy: ${content?.enrichedBy}, humanReviewed: ${p.isHumanReviewed}, ok: ${ok}`)
}

console.log('\nAll checks passed:', allGood)
await prisma.$disconnect()
