import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })
const prisma = new PrismaClient()

const slugs = ['mba-vs-masters', 'samsung-galaxy-vs-motorola', 'disney-plus-vs-netflix', 'cancun-vs-hawaii']
for (const slug of slugs) {
  const p = await prisma.comparison.findUnique({ where: { slug }, select: { slug: true, title: true, content: true } })
  const faqs = await prisma.fAQ.findMany({ where: { comparison: { slug } } })
  console.log('\n--- ' + slug + ' ---')
  console.log('Title:', p?.title)
  console.log('FAQs count:', faqs.length)
  faqs.forEach(f => console.log('  Q:', f.question))
}
await prisma.$disconnect()
