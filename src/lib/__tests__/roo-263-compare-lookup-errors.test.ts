// ROO-263 — /compare/[slug] must 404 only when the lookup SUCCEEDED and the
// slug is genuinely absent. A failed/timed-out lookup (for the slug itself or
// for the alias/reverse candidates that decide a 301) has to throw, so Next
// keeps the last good ISR render or returns a 5xx — never a cached noindex 404.

import { describe, it, expect, vi, beforeEach } from 'vitest'

const getComparisonBySlug = vi.fn()
const isComparisonDbConfigured = vi.fn()
const isComparisonDbReachable = vi.fn()

vi.mock('@/lib/services/comparison-service', () => ({
  getComparisonBySlug: (slug: string, opts?: unknown) => getComparisonBySlug(slug, opts),
  getTrendingComparisons: vi.fn().mockResolvedValue([]),
  isComparisonDbConfigured: () => isComparisonDbConfigured(),
  isComparisonDbReachable: () => isComparisonDbReachable(),
  resolveCanonicalComparisonSlugs: async (slugs: string[]) => new Set(slugs),
}))

vi.mock('@/lib/services/ai-comparison-generator', () => ({
  generateComparison: vi.fn(),
  generateMultiComparison: vi.fn(),
}))

import { getStaticProps } from '@/pages/compare/[slug]'
import { ComparisonLookupError } from '@/lib/services/comparison-lookup-error'

type Ctx = Parameters<typeof getStaticProps>[0]
const run = (slug: string) => getStaticProps({ params: { slug } } as unknown as Ctx)

const comparison = (slug: string) => ({
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
  metadata: { status: 'published', metaTitle: 'A vs B', metaDescription: 'A vs B compared.' },
})

const poolTimeout = () =>
  Object.assign(new Error('Timed out fetching a new connection from the connection pool.'), {
    code: 'P2024',
  })

beforeEach(() => {
  getComparisonBySlug.mockReset()
  getComparisonBySlug.mockResolvedValue(null)
  isComparisonDbConfigured.mockReset()
  isComparisonDbConfigured.mockReturnValue(true)
  isComparisonDbReachable.mockReset()
  // The trap from the incident: the health probe passes while lookups fail.
  isComparisonDbReachable.mockResolvedValue(true)
})

describe('ROO-263: lookup errors never become a 404', () => {
  it('asks the service for a strict (throwing) lookup', async () => {
    getComparisonBySlug.mockResolvedValue(comparison('coursera-vs-edx'))
    await run('coursera-vs-edx')
    expect(getComparisonBySlug).toHaveBeenCalledWith('coursera-vs-edx', { throwOnError: true })
  })

  it('throws (5xx / stale ISR) when the main slug lookup errors, even if the DB ping passes', async () => {
    getComparisonBySlug.mockRejectedValue(poolTimeout())

    await expect(run('coursera-vs-edx')).rejects.toBeInstanceOf(ComparisonLookupError)
  })

  it('does not 404 under a burst of concurrent failing lookups', async () => {
    getComparisonBySlug.mockRejectedValue(poolTimeout())
    const slugs = ['coursera-vs-edx', 'aws-vs-google-cloud', 'paypal-vs-stripe', 'harvard-vs-yale']
    const results = await Promise.allSettled(slugs.map(run))
    for (const r of results) {
      expect(r.status).toBe('rejected')
    }
  })

  it('throws instead of 404ing an alias when the live-target lookup errors', async () => {
    // nfl-vs-nba style: the requested slug has no row; its live reverse
    // decides the 301. If that lookup fails we must not fall through to 404.
    getComparisonBySlug.mockImplementation(async (slug: string) => {
      if (slug === 'beta-roo-vs-alpha-roo') return null
      throw poolTimeout()
    })

    await expect(run('beta-roo-vs-alpha-roo')).rejects.toBeInstanceOf(ComparisonLookupError)
  })

  it('still 301s the alias when its lookups succeed', async () => {
    getComparisonBySlug.mockImplementation(async (slug: string) =>
      slug === 'alpha-roo-vs-beta-roo' ? comparison(slug) : null
    )

    expect(await run('beta-roo-vs-alpha-roo')).toMatchObject({
      redirect: { destination: '/compare/alpha-roo-vs-beta-roo', statusCode: 301 },
    })
  })

  it('throws when an N-way canonical lookup errors', async () => {
    getComparisonBySlug.mockImplementation(async (slug: string) => {
      if (slug === 'zeta-roo-vs-alpha-roo-vs-mid-roo') return null
      throw poolTimeout()
    })

    await expect(run('zeta-roo-vs-alpha-roo-vs-mid-roo')).rejects.toBeInstanceOf(
      ComparisonLookupError
    )
  })

  it('renders a live page normally', async () => {
    getComparisonBySlug.mockResolvedValue(comparison('coursera-vs-edx'))
    const result = await run('coursera-vs-edx')
    expect(result).toHaveProperty('props')
    if (!('props' in result)) throw new Error('expected props')
    expect((result.props as { meta: { indexable: boolean } }).meta.indexable).toBe(true)
  })

  it('still 404s a genuinely missing slug when every lookup succeeds', async () => {
    getComparisonBySlug.mockResolvedValue(null)

    expect(await run('djokovic-vs-nadal-roo263')).toMatchObject({ notFound: true })
  })
})
