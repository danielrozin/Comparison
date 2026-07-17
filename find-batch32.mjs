import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env.local'), override: true })

const prisma = new PrismaClient()

async function main() {
  const all = await prisma.comparison.findMany({
    where: { searchImpressions: { gt: 0 } },
    select: {
      slug: true,
      title: true,
      searchImpressions: true,
      content: true
    },
    orderBy: { searchImpressions: 'desc' }
  })
  
  console.log(`Total comparisons with impressions > 0: ${all.length}`)
  
  // Show ranks 308-325 to get context for 311-320
  const slice = all.slice(307, 325)
  slice.forEach((r, i) => {
    const rank = 308 + i
    const content = r.content
    const isEnriched = content && typeof content === 'object' && !Array.isArray(content) &&
      ('expertAnalysis' in content || 'enrichedBy' in content)
    const enrichedBy = content?.enrichedBy || 'none'
    console.log(`${rank}. [${isEnriched ? 'DONE(' + enrichedBy + ')' : 'NEED'}] ${r.slug} — ${r.searchImpressions} impressions`)
  })
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
