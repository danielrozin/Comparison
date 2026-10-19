// ROO-263 — a failed comparison lookup must never look like "no such row".
//
// Under a crawler burst Prisma's pool ran dry; getComparisonBySlug swallowed
// the timeout, fell back to the status-less mock fixture (or null) and even
// cached that fallback for 5 minutes. /compare/[slug] then served live pages
// as noindex 404s. These tests drive the real service with a failing client.

import { describe, it, expect, vi, beforeEach } from 'vitest'

const store = new Map<string, unknown>()
vi.mock('@/lib/services/redis', () => ({
  getRedis: () => ({
    get: async (k: string) => (store.has(k) ? store.get(k) : null),
    set: async (k: string, v: unknown) => {
      store.set(k, v)
      return 'OK'
    },
    del: async (k: string) => store.delete(k),
  }),
}))

const findUnique = vi.fn()
vi.mock('@/lib/db/prisma', () => ({
  getPrisma: () => ({ comparison: { findUnique: (...a: unknown[]) => findUnique(...a) } }),
}))

vi.mock('@/lib/services/internal-linking-engine', () => ({
  getLinkedComparisons: vi.fn().mockResolvedValue([]),
  getRelatedBlogPosts: vi.fn().mockResolvedValue([]),
}))

import { getComparisonBySlug, ComparisonLookupError } from '../comparison-service'

const poolTimeout = () =>
  Object.assign(new Error('Timed out fetching a new connection from the connection pool.'), {
    code: 'P2024',
  })

beforeEach(() => {
  store.clear()
  findUnique.mockReset()
})

describe('ROO-263: comparison lookup errors', () => {
  it('throws ComparisonLookupError in strict mode when the DB keeps failing', async () => {
    findUnique.mockRejectedValue(poolTimeout())

    await expect(
      getComparisonBySlug('coursera-vs-edx-roo263', { throwOnError: true })
    ).rejects.toBeInstanceOf(ComparisonLookupError)
    // Retried with backoff before giving up.
    expect(findUnique).toHaveBeenCalledTimes(3)
  })

  it('retries a transient failure and returns the clean answer', async () => {
    findUnique
      .mockRejectedValueOnce(poolTimeout())
      .mockRejectedValueOnce(poolTimeout())
      .mockResolvedValueOnce(null)

    await expect(
      getComparisonBySlug('nobody-vs-nothing-roo263', { throwOnError: true })
    ).resolves.toBeNull()
    expect(findUnique).toHaveBeenCalledTimes(3)
  })

  it('serves the last good render when the DB fails', async () => {
    const lastGood = { slug: 'paypal-vs-stripe-roo263', metadata: { status: 'published' } }
    store.set('comparison:last-good:paypal-vs-stripe-roo263', lastGood)
    findUnique.mockRejectedValue(poolTimeout())

    await expect(
      getComparisonBySlug('paypal-vs-stripe-roo263', { throwOnError: true })
    ).resolves.toEqual(lastGood)
  })

  it('never caches the mock fallback of a failed lookup', async () => {
    findUnique.mockRejectedValue(poolTimeout())

    // Non-strict callers (APIs) still degrade to the fixture…
    const result = await getComparisonBySlug('ps5-vs-xbox-series-x')
    expect(result).not.toBeNull()
    // …but it must not be pinned in the hot cache for later page renders.
    expect(store.has('comparison:ps5-vs-xbox-series-x')).toBe(false)
  })
})
