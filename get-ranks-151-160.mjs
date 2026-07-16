import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '.env.local'), override: true })

const prisma = new PrismaClient()

async function main() {
  const results = await prisma.comparison.findMany({
    where: {
      searchImpressions: { gt: 0 }
    },
    select: {
      slug: true,
      title: true,
      searchImpressions: true,
      isHumanReviewed: true,
      content: true
    },
    orderBy: {
      searchImpressions: 'desc'
    },
    skip: 150,
    take: 10
  })

  results.forEach((r, i) => {
    const content = r.content
    const hasAnalysis = content && typeof content === 'object' && 'expertAnalysis' in content
    const analysisLen = hasAnalysis ? (content.expertAnalysis?.length || 0) : 0
    const faqCount = content?.faqs?.length || 0
    const sourceCount = content?.sources?.length || 0
    const enrichedBy = content?.enrichedBy || 'none'
    console.log(`${i+151}. ${r.slug}`)
    console.log(`    impressions: ${r.searchImpressions}`)
    console.log(`    reviewed: ${r.isHumanReviewed}, hasAnalysis: ${hasAnalysis}, analysisLen: ${analysisLen}, FAQs: ${faqCount}, sources: ${sourceCount}, enrichedBy: ${enrichedBy}`)
  })

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
