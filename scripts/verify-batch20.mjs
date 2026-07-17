import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })
const prisma = new PrismaClient()

const slugs = [
  'vanguard-vs-fidelity',
  'playstation-5-vs-xbox-series-x',
  'macbook-pro-vs-macbook-air-comparison-2026',
  'bmw-vs-mercedes',
  'google-vs-microsoft',
  'jimmy-john-s-vs-subway',
  'chipotle-vs-qdoba',
  'nintendo-switch-vs-playstation-5',
  'celsius-vs-red-bull',
  'backblaze-vs-carbonite'
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
  if (hasAnalysis) {
    const words = p.content.expertAnalysis.split(/\s+/).filter(Boolean).length
    console.log(`  analysis_words=${words}`)
  }
}
console.log('\n' + (allPass ? 'ALL PASS' : 'FAILURES DETECTED'))
await prisma.$disconnect()
