// DAN-2106 — the published-only gate must hold for JSON, not just HTML.
//
// DAN-2065 gated `/compare/[slug]`, but every read API kept calling
// getComparisonBySlug directly. So an archived slug 404'd as a page while
// /api/comparisons/{slug} returned it as a 200 with the full comparison — and
// with `X-Source-URL` / `rel="canonical"` headers naming the URL that 404s, plus
// `X-Robots-Tag: all`. 2,842 archived rows vs 519 published were exposed that way.
//
// DAN-2099's outreach check read the API, saw 200s, and filed 10 deliberately
// archived slugs as a frontend 404 bug. These tests pin the invariant that made
// that report possible: published set == 200 set, in both representations.

import { describe, it, expect, vi, beforeEach } from 'vitest'

// The route imports the service, so stubbing it from here works (a sibling call
// *inside* the service could not be stubbed this way).
//
// getPublishedComparisonBySlug is re-implemented over the fake lookup rather
// than passed through: the real one asks isComparisonDbConfigured(), which is
// false under vitest, so it would admit every row and the archived case could
// never fail. The predicate itself is covered as a pure function above; what
// this stub pins is the route's *wiring* — swap the route back to the ungated
// getComparisonBySlug and the archived test goes 200 and fails.
const getComparisonBySlug = vi.fn()
vi.mock('@/lib/services/comparison-service', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/lib/services/comparison-service')>()
  return {
    ...actual,
    getComparisonBySlug: (s: string) => getComparisonBySlug(s),
    getPublishedComparisonBySlug: async (s: string) => {
      const c = await getComparisonBySlug(s)
      return actual.isPublishedComparison(c, true) ? c : null
    },
  }
})

import { isPublishedComparison } from '@/lib/services/comparison-service'
import { GET } from '@/app/api/comparisons/[slug]/route'

type Comparison = Parameters<typeof isPublishedComparison>[0]

const comparison = (status?: string): Comparison =>
  ({
    slug: 'chatgpt-vs-gemini',
    title: 'ChatGPT vs Gemini',
    entities: [{ slug: 'chatgpt' }, { slug: 'gemini' }],
    metadata: status === undefined ? {} : { status },
  }) as unknown as Comparison

beforeEach(() => vi.clearAllMocks())

describe('isPublishedComparison', () => {
  it('admits a published row with >=2 entities', () => {
    expect(isPublishedComparison(comparison('published'), true)).toBe(true)
  })

  // The 10 slugs filed in DAN-2106 were all "archived". They 404 by design;
  // the API must agree with the page rather than contradict it.
  it.each(['archived', 'draft', 'review'])('rejects status %s', (status) => {
    expect(isPublishedComparison(comparison(status), true)).toBe(false)
  })

  it('rejects a null lookup', () => {
    expect(isPublishedComparison(null, true)).toBe(false)
  })

  it('rejects a row with fewer than 2 entities', () => {
    const thin = { ...(comparison('published') as object), entities: [{ slug: 'chatgpt' }] }
    expect(isPublishedComparison(thin as Comparison, true)).toBe(false)
  })

  // Fixtures carry no status and are the whole dataset when no DB is
  // configured; gating them there would 404 all of local dev and DB-less CI.
  it('admits a statusless fixture only when no DB is configured', () => {
    expect(isPublishedComparison(comparison(undefined), false)).toBe(true)
    expect(isPublishedComparison(comparison(undefined), true)).toBe(false)
  })
})

// The actual regression: drive the real route handler.
describe('GET /api/comparisons/[slug]', () => {
  const call = (slug: string) =>
    GET(new Request(`https://www.aversusb.net/api/comparisons/${slug}`) as never, {
      params: Promise.resolve({ slug }),
    })

  it('serves a published comparison', async () => {
    getComparisonBySlug.mockResolvedValue(comparison('published'))
    expect((await call('chatgpt-vs-gemini')).status).toBe(200)
  })

  it('404s an archived comparison instead of leaking it as 200', async () => {
    getComparisonBySlug.mockResolvedValue(comparison('archived'))
    expect((await call('chatgpt-vs-gemini')).status).toBe(404)
  })
})
