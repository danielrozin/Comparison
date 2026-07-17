import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env.local'), override: true })

const prisma = new PrismaClient()

const SLUGS = [
  'mcdonald-s-vs-wendy-s',
  'wix-vs-squarespace',
  'ford-f-150-vs-chevrolet-silverado',
  'maradona-vs-pele',
  'china-economy-vs-united-states',
  'notion-vs-obsidian',
  'canon-eos-r6-mark-ii-vs-sony-a7-iv',
  'venmo-vs-zelle',
  'domino-s-vs-pizza-hut',
  'webex-vs-microsoft-teams'
]

async function main() {
  let totalWords = 0, totalSources = 0
  for (const slug of SLUGS) {
    const r = await prisma.comparison.findUnique({
      where: { slug },
      select: { slug: true, content: true }
    })
    const c = r?.content
    const hasExpert = c && typeof c === 'object' && 'expertAnalysis' in c
    const wordCount = hasExpert ? c.expertAnalysis.split(/\s+/).length : 0
    const sourcesCount = c?.sources?.length || 0
    totalWords += wordCount
    totalSources += sourcesCount
    console.log(`${hasExpert ? '✓' : '✗'} ${slug} — ${wordCount} words, ${sourcesCount} sources, enrichedBy=${c?.enrichedBy}`)
  }
  console.log(`\nTotals: ${totalWords} words, ${totalSources} source citations`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
