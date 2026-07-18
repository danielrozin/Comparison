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

for (const slug of SLUGS) {
  const row = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, slug: true, title: true, status: true, searchImpressions: true, content: true },
  })
  if (!row) {
    console.log(`❌ MISSING: ${slug}`)
  } else {
    const content = row.content || {}
    const hasEnrichment = typeof content === 'object' && !Array.isArray(content) &&
      ('expertAnalysis' in content || 'enrichedBy' in content || 'analysis' in content)
    const enrichedBy = content.enrichedBy || ''
    console.log(`${hasEnrichment ? '✅' : '○'} ${slug} — status:${row.status} impressions:${row.searchImpressions} enriched:${hasEnrichment}${enrichedBy ? '(' + enrichedBy + ')' : ''}`)
  }
}

// Also check the other direction of teams/slack
const alt = await prisma.comparison.findUnique({
  where: { slug: 'microsoft-teams-vs-slack' },
  select: { id: true, content: true },
})
console.log(`\nmicrosoft-teams-vs-slack enriched: ${alt?.content?.enrichedBy || 'no'}`)

await prisma.$disconnect()
