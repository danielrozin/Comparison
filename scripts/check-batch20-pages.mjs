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

for (const slug of slugs) {
  const p = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, searchImpressions: true, isHumanReviewed: true, reviewedBy: true, content: true, contentScore: true }
  })
  const faqs = await prisma.fAQ.findMany({ where: { comparison: { slug } }, select: { question: true } })
  const hasAnalysis = !!(p?.content?.expertAnalysis)
  const faqCount = faqs.length
  console.log(`\n[${p?.searchImpressions}] ${slug}`)
  console.log(`  reviewed=${p?.isHumanReviewed} by=${p?.reviewedBy} score=${p?.contentScore}`)
  console.log(`  has_analysis=${hasAnalysis} faq_count=${faqCount}`)
  if (hasAnalysis) {
    const words = p.content.expertAnalysis.split(/\s+/).filter(Boolean).length
    console.log(`  analysis_words=${words}`)
  }
  faqs.forEach(f => console.log(`    Q: ${f.question.substring(0, 80)}`))
}
await prisma.$disconnect()
