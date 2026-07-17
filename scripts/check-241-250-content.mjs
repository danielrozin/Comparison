import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local'), override: true })

const prisma = new PrismaClient()

const slugs = [
  'excel-vs-airtable',
  'facebook-vs-reddit',
  'godaddy-vs-squarespace',
  'hulu-vs-peacock',
  'tesla-vs-ford',
  'chinese-vs-us-economy',
  'playstation-5-vs-xbox-series-x-specs-comparison-2026',
  'mercedes-benz-gle-vs-bmw-x5',
  'airbnb-vs-booking',
  'amazon-vs-wayfair',
]

for (const slug of slugs) {
  const row = await prisma.comparison.findUnique({
    where: { slug },
    select: { slug: true, content: true, searchImpressions: true, faqs: true }
  })
  if (!row) { console.log(`${slug}: NOT FOUND`); continue }
  const c = row.content
  const isArr = Array.isArray(c)
  const hasAnalysis = c && typeof c === 'object' && !isArr && ('analysis' in c || 'expertAnalysis' in c)
  const hasEnrichedAt = c && typeof c === 'object' && !isArr && 'enrichedAt' in c
  const enrichedBy = c && typeof c === 'object' && !isArr ? c.enrichedBy || null : null
  const faqCount = Array.isArray(row.faqs) ? row.faqs.length : 0
  const analysisWords = hasAnalysis ? (c.expertAnalysis || c.analysis || '').split(/\s+/).filter(Boolean).length : 0
  const sourcesCount = c && typeof c === 'object' && !isArr && Array.isArray(c.sources) ? c.sources.length : 0
  console.log(`${slug}: impressions=${row.searchImpressions}, arr=${isArr}, hasAnalysis=${hasAnalysis}(${analysisWords}w), hasEnrichedAt=${hasEnrichedAt}, enrichedBy=${enrichedBy}, sources=${sourcesCount}, faqs=${faqCount}`)
}

await prisma.$disconnect()
