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
  select: { id: true, slug: true, searchImpressions: true, content: true, isHumanReviewed: true, reviewedBy: true },
})

console.log(`Total ranked pages: ${allRanked.length}`)
console.log('\nRanks 221-230:')
const ranked221to230 = allRanked.slice(220, 230)

for (let i = 0; i < ranked221to230.length; i++) {
  const p = ranked221to230[i]
  const faqCount = await prisma.fAQ.count({ where: { comparisonId: p.id } })
  const hasAnalysis = p.content && typeof p.content === 'object' && !Array.isArray(p.content) && 'expertAnalysis' in p.content
  const hasSources = p.content && typeof p.content === 'object' && !Array.isArray(p.content) && 'sources' in p.content && Array.isArray(p.content.sources)
  const sourceCount = hasSources ? p.content.sources.length : 0
  const enrichedBy = p.content?.enrichedBy || 'none'
  console.log(`${220 + i + 1}. ${p.searchImpressions} impressions - ${p.slug}`)
  console.log(`   FAQs: ${faqCount}, sources: ${sourceCount}, enrichedBy: ${enrichedBy}, humanReviewed: ${p.isHumanReviewed}`)
  console.log()
}

await prisma.$disconnect()
