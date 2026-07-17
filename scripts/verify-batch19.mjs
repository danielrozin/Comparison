import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })
const prisma = new PrismaClient()

const slugs = [
  'ps6-vs-xbox-series-x',
  'schwab-vs-vanguard',
  'hbo-max-vs-hulu',
  'ronaldo-vs-neymar',
  'iphone-17-pro-vs-pro-max',
  'mba-vs-masters',
  'spotify-vs-youtube-music',
  'samsung-galaxy-vs-motorola',
  'disney-plus-vs-netflix',
  'cancun-vs-hawaii'
]

let allPass = true
for (const slug of slugs) {
  const p = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, isHumanReviewed: true, reviewedBy: true, content: true }
  })
  const faqs = await prisma.fAQ.findMany({ where: { comparison: { slug } } })
  const hasAnalysis = !!(p?.content?.expertAnalysis)
  const faqCount = faqs.length
  const ok = p?.isHumanReviewed && p?.reviewedBy === 'daniel-rozin' && hasAnalysis && faqCount >= 5
  if (!ok) allPass = false
  console.log(`${ok ? '✓' : '✗'} ${slug}`)
  console.log(`  reviewed=${p?.isHumanReviewed} by=${p?.reviewedBy} has_analysis=${hasAnalysis} faq_count=${faqCount}`)
}
console.log('\n' + (allPass ? 'ALL PASS' : 'FAILURES DETECTED'))
await prisma.$disconnect()
