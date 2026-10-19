// ROO-271 — no /compare alias may redirect to a 404 or a noindex page.
//
// Found live on 2026-10-19: hulu-vs-netflix 301'd (edge rule) to
// netflix-vs-hulu, which 404s; gitlab-vs-bitbucket, vue-vs-nuxt,
// obsidian-vs-apple-notes and ipad-vs-amazon-fire 301'd to provisional
// (noindex) pages. An alias now 301s only to a live, indexable (published)
// page; otherwise it falls through to the normal missing/build flow.

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const getComparisonBySlug = vi.fn()

vi.mock('@/lib/services/comparison-service', () => ({
  getComparisonBySlug: (slug: string, opts?: unknown) => getComparisonBySlug(slug, opts),
  getTrendingComparisons: vi.fn().mockResolvedValue([]),
  isComparisonDbConfigured: () => true,
  isComparisonDbReachable: async () => true,
  resolveCanonicalComparisonSlugs: async (slugs: string[]) => new Set(slugs),
}))
vi.mock('@/lib/services/ai-comparison-generator', () => ({
  generateComparison: vi.fn(),
  generateMultiComparison: vi.fn(),
}))

import { getStaticProps } from '@/pages/compare/[slug]'
import { getConsolidatedCompareSlug } from '@/lib/redirects/compare-redirects'

type Ctx = Parameters<typeof getStaticProps>[0]
const run = (slug: string) => getStaticProps({ params: { slug } } as unknown as Ctx)

const row = (slug: string, status: string) => ({
  id: `id-${slug}`,
  slug,
  title: slug,
  category: 'software',
  shortAnswer: 'A short answer.',
  verdict: 'A verdict.',
  faqs: [],
  keyDifferences: [],
  attributes: [],
  relatedComparisons: [],
  relatedBlogPosts: [],
  entities: [
    { id: 'a', name: 'A', slug: 'a', pros: [], cons: [] },
    { id: 'b', name: 'B', slug: 'b', pros: [], cons: [] },
  ],
  metadata: { status, metaTitle: 'A vs B', metaDescription: 'A vs B compared.' },
})

const db = (rows: Record<string, string>) =>
  getComparisonBySlug.mockImplementation(async (slug: string) =>
    rows[slug] ? row(slug, rows[slug]) : null
  )

beforeEach(() => getComparisonBySlug.mockReset())

describe('ROO-271: consolidation-map aliases', () => {
  it('hulu-vs-netflix is a mapped alias of netflix-vs-hulu', () => {
    expect(getConsolidatedCompareSlug('hulu-vs-netflix')).toBe('netflix-vs-hulu')
    // gitlab-vs-bitbucket is a DAN-2045 dead source: it resolves as a reverse order.
    expect(getConsolidatedCompareSlug('gitlab-vs-bitbucket')).toBeNull()
  })

  it('does not 301 to a survivor that is missing (404)', async () => {
    db({})
    const result = await run('hulu-vs-netflix')
    expect(result).not.toHaveProperty('redirect')
    expect(result).toMatchObject({ notFound: true })
  })

  it('does not 301 to an archived survivor', async () => {
    db({ 'netflix-vs-hulu': 'archived' })
    expect(await run('hulu-vs-netflix')).not.toHaveProperty('redirect')
  })

  it('does not 301 to a provisional (noindex) survivor', async () => {
    db({ 'netflix-vs-hulu': 'provisional' })
    expect(await run('hulu-vs-netflix')).not.toHaveProperty('redirect')
  })

  it('still 301s to a published survivor, and re-checks it hourly', async () => {
    db({ 'netflix-vs-hulu': 'published' })
    expect(await run('hulu-vs-netflix')).toMatchObject({
      redirect: { destination: '/compare/netflix-vs-hulu', statusCode: 301 },
      revalidate: 3600,
    })
  })

  it('renders the alias row itself when the survivor is gone but the alias is published', async () => {
    db({ 'hulu-vs-netflix': 'published' })
    expect(await run('hulu-vs-netflix')).toHaveProperty('props')
  })

  it('is no longer an unconditional edge rule in next.config', () => {
    const cfg = readFileSync(path.resolve(process.cwd(), 'next.config.ts'), 'utf8')
    expect(cfg).not.toMatch(/\.\.\.COMPARE_REDIRECTS/)
  })
})

describe('ROO-271: reverse-order aliases', () => {
  for (const [alias, target] of [
    ['gitlab-vs-bitbucket', 'bitbucket-vs-gitlab'],
    ['vue-vs-nuxt', 'nuxt-vs-vue'],
    ['obsidian-vs-apple-notes', 'apple-notes-vs-obsidian'],
    ['ipad-vs-amazon-fire', 'amazon-fire-vs-ipad'],
  ]) {
    it(`${alias} does not 301 to its provisional reverse`, async () => {
      db({ [target]: 'provisional' })
      const result = await run(alias)
      expect(result).not.toHaveProperty('redirect')
      expect(result).toMatchObject({ notFound: true })
    })

    it(`${alias} 301s once ${target} is published`, async () => {
      db({ [target]: 'published' })
      expect(await run(alias)).toMatchObject({
        redirect: { destination: `/compare/${target}`, statusCode: 301 },
      })
    })
  }
})
