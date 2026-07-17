import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })
const prisma = new PrismaClient()

const allRanked = await prisma.comparison.findMany({
  where: { searchImpressions: { gt: 0 } },
  orderBy: { searchImpressions: 'desc' },
  select: { id: true, slug: true, searchImpressions: true, content: true, isHumanReviewed: true },
})

const ranked201to210 = allRanked.slice(200, 210)

let allGood = true
for (const p of ranked201to210) {
  const faqCount = await prisma.fAQ.count({ where: { comparisonId: p.id } })
  const content = p.content
  const hasExpertAnalysis = content?.expertAnalysis && content.expertAnalysis.length > 100
  const hasSources = Array.isArray(content?.sources) && content.sources.length >= 3
  const hasEnrichedBy = content?.enrichedBy === 'DAN-2286'
  const ok = hasExpertAnalysis && hasSources && faqCount >= 5 && p.isHumanReviewed
  if (!ok) allGood = false
  console.log(`${p.searchImpressions} ${p.slug}`)
  console.log(`  expertAnalysis: ${hasExpertAnalysis ? content.expertAnalysis.length + 'chars' : 'MISSING'}, sources: ${hasSources ? content.sources.length : 'MISSING'}, faqs: ${faqCount}, enrichedBy: ${content?.enrichedBy}, humanReviewed: ${p.isHumanReviewed}`)
}

console.log('\nAll checks passed:', allGood)
await prisma.$disconnect()
