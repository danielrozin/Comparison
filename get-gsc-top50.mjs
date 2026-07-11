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
    take: 50
  })
  
  results.forEach((r, i) => {
    const hasExpertAnalysis = r.content && typeof r.content === 'object' && 'expertAnalysis' in r.content
    console.log(`${i+1}. ${r.slug} — impressions: ${r.searchImpressions}, reviewed: ${r.isHumanReviewed}, hasAnalysis: ${hasExpertAnalysis}`)
  })
  
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
