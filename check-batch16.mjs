import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '.env.local'), override: true })

const prisma = new PrismaClient()

const SLUGS = [
  'tsa-precheck-vs-global-entry',
  'allstate-vs-geico',
  'youtube-tv-vs-hulu-live',
  'revolut-vs-wise',
  'ally-bank-vs-marcus-by-goldman-sachs',
  'target-vs-walmart',
  'macbook-air-m3-vs-macbook-air-m4',
  'mba-vs-masters-degree',
  'kroger-vs-safeway',
  'ufc-vs-boxing'
]

async function main() {
  for (const slug of SLUGS) {
    const r = await prisma.comparison.findUnique({
      where: { slug },
      select: {
        slug: true,
        searchImpressions: true,
        isHumanReviewed: true,
        content: true,
        _count: { select: { faqs: true } }
      }
    })
    if (!r) { console.log(`NOT FOUND: ${slug}`); continue }
    const content = r.content
    const hasAnalysis = content && typeof content === 'object' && 'expertAnalysis' in content
    const analysisLen = hasAnalysis ? (content.expertAnalysis?.length || 0) : 0
    const sourceCount = content?.sources?.length || 0
    const enrichedBy = content?.enrichedBy || 'none'
    const faqCount = r._count.faqs
    console.log(`${r.slug}: impressions=${r.searchImpressions}, analysis=${hasAnalysis}(${analysisLen}c), FAQs=${faqCount}, sources=${sourceCount}, enrichedBy=${enrichedBy}`)
  }
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
