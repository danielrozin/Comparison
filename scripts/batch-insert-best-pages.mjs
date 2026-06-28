import { readFileSync, readdirSync } from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function scoreColor(score) {
  if (score >= 90) return '🟢';
  if (score >= 75) return '🟡';
  return '🔴';
}

function generateBodyMarkdown(page) {
  const { intro, items, faqs } = page;
  const lines = [];

  if (intro) {
    lines.push(intro, '');
  }

  // Score table
  lines.push('| Rank | Name | Score | Price | Best for |');
  lines.push('|------|------|-------|-------|----------|');
  for (const item of items) {
    lines.push(`| #${item.rank} | **${item.name}** | ${scoreColor(item.score)} ${item.score}/100 | ${item.price} | ${item.bestFor} |`);
  }
  lines.push('');

  // Detailed sections per item
  for (const item of items) {
    lines.push(`## ${item.rank}. ${item.name} {#${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}}`);
    lines.push('');
    lines.push(`**Score:** ${item.score}/100 · **Price:** ${item.price} · **Best for:** ${item.bestFor}`);
    lines.push('');
    lines.push(item.rationale);
    lines.push('');

    if (item.pros && item.pros.length > 0) {
      lines.push('**Pros:**');
      for (const pro of item.pros) lines.push(`- ${pro}`);
      lines.push('');
    }
    if (item.cons && item.cons.length > 0) {
      lines.push('**Cons:**');
      for (const con of item.cons) lines.push(`- ${con}`);
      lines.push('');
    }
    if (item.url) {
      lines.push(`[See full comparison →](${item.url})`);
      lines.push('');
    }
    lines.push('---');
    lines.push('');
  }

  // FAQ section
  if (faqs && faqs.length > 0) {
    lines.push('## Frequently Asked Questions {#faq}');
    lines.push('');
    for (const faq of faqs) {
      const q = faq.question || faq.q;
      const a = faq.answer || faq.a;
      lines.push(`**${q}**`);
      lines.push('');
      lines.push(a);
      lines.push('');
    }
  }

  return lines.join('\n');
}

function transformPage(raw) {
  const itemList = raw.schema?.['@graph']?.find(n => n['@type'] === 'ItemList');
  const listItems = itemList?.itemListElement?.map(el => ({
    position: el.position,
    name: el.name,
    anchor: el.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  })) ?? raw.items.map((item, i) => ({
    position: item.rank ?? i + 1,
    name: item.name,
    anchor: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  }));

  const faqs = (raw.faqs || []).map(faq => ({
    q: faq.question || faq.q,
    a: faq.answer || faq.a,
  }));

  return {
    slug: raw.slug,
    title: raw.metaTitle || raw.title,
    description: raw.metaDescription || raw.description,
    h1: raw.h1 || raw.title,
    authorName: 'AversusB Editorial',
    category: raw.category || null,
    bodyMarkdown: generateBodyMarkdown(raw),
    listItems,
    faqs,
    status: 'published',
    publishedAt: new Date('2026-07-07'),
  };
}

async function main() {
  const dir = '/tmp/best-of-drafts';
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} draft files`);

  const results = [];
  for (const file of files) {
    const raw = JSON.parse(readFileSync(`${dir}/${file}`, 'utf-8'));
    const page = transformPage(raw);
    try {
      await prisma.bestPage.upsert({
        where: { slug: page.slug },
        create: page,
        update: {
          title: page.title,
          description: page.description,
          h1: page.h1,
          bodyMarkdown: page.bodyMarkdown,
          listItems: page.listItems,
          faqs: page.faqs,
          status: 'published',
        },
      });
      results.push({ slug: page.slug, status: 'ok' });
      console.log(`✓ ${page.slug}`);
    } catch (err) {
      results.push({ slug: page.slug, status: 'error', error: err.message });
      console.error(`✗ ${page.slug}: ${err.message}`);
    }
  }

  console.log('\nSummary:', results.filter(r => r.status === 'ok').length, 'ok,', results.filter(r => r.status === 'error').length, 'errors');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
