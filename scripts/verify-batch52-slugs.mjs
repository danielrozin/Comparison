import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local'), override: true })
const prisma = new PrismaClient()

const SLUGS = [
  'slack-vs-microsoft-teams',
  'marvel-vs-dc',
  'android-vs-ios',
  'chatgpt-vs-claude-vs-gemini',
  'nvidia-vs-amd',
  'figma-vs-sketch',
  'canva-vs-photoshop',
  'cursor-vs-copilot',
  'notion-vs-obsidian-vs-logseq',
  'bitcoin-vs-ethereum',
]

let allGood = true
for (const slug of SLUGS) {
  const row = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, content: true },
  })
  const content = row?.content || {}
  const hasAnalysis = !!content.expertAnalysis
  const enrichedBy = content.enrichedBy
  const faqCount = await prisma.fAQ.count({ where: { comparisonId: row?.id } })
  const ok = hasAnalysis && enrichedBy === 'DAN-2442' && faqCount >= 4
  if (!ok) allGood = false
  console.log(`${ok ? '✅' : '❌'} ${slug} — analysis:${hasAnalysis} enrichedBy:${enrichedBy} FAQs:${faqCount}`)
}

console.log(allGood ? '\nAll 10 slugs verified ✅' : '\nSome slugs have issues ❌')
await prisma.$disconnect()
