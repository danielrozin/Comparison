// DAN-2581 — no rendered surface may hand a crawler a /compare 404.
//
// A full-prod crawl on 2026-07-21 found 680 dead internal targets across 444 of the
// 1,948 indexable pages — 379 of 476 /blog pages alone. Every one of them was a
// stored `/compare/*` target that a later consolidation batch archived. `/compare`
// renders published rows only (DAN-2065) and the canonical catalog *shrinks*, so any
// surface that persists a link target instead of resolving one rots by construction.
//
// These tests pin the two resolvers that close that class: markdown bodies get their
// anchors rewritten or unwrapped, curated lists get their dead entries dropped.

import { describe, it, expect, vi, beforeEach } from 'vitest'

const resolveCanonicalComparisonSlugs = vi.fn()
const getConsolidatedCompareSlug = vi.fn()
const getBlogBySlug = vi.fn()

vi.mock('@/lib/services/comparison-service', () => ({
  resolveCanonicalComparisonSlugs: (s: string[]) => resolveCanonicalComparisonSlugs(s),
}))
vi.mock('@/lib/redirects/compare-redirects', () => ({
  getConsolidatedCompareSlug: (s: string) => getConsolidatedCompareSlug(s),
}))
vi.mock('@/lib/services/blog-generator', () => ({
  getBlogBySlug: (s: string) => getBlogBySlug(s),
}))

import {
  resolveCompareLinksInHtml,
  filterLiveCompareSlugs,
  filterLiveInternalLinks,
} from '@/lib/seo/resolve-internal-links'

const anchor = (slug: string, label: string) =>
  `<a href="/compare/${slug}" class="text-primary-600">${label}</a>`

beforeEach(() => {
  vi.clearAllMocks()
  getConsolidatedCompareSlug.mockReturnValue(null)
  resolveCanonicalComparisonSlugs.mockResolvedValue(new Set<string>())
  getBlogBySlug.mockResolvedValue(null)
})

describe('resolveCompareLinksInHtml', () => {
  it('keeps a live link intact', async () => {
    resolveCanonicalComparisonSlugs.mockResolvedValue(new Set(['chatgpt-vs-claude']))
    const html = `<p>See ${anchor('chatgpt-vs-claude', 'ChatGPT vs Claude')} today.</p>`
    expect(await resolveCompareLinksInHtml(html)).toBe(html)
  })

  it('unwraps a dead link to plain text, keeping the prose readable', async () => {
    const out = await resolveCompareLinksInHtml(
      `<p>See ${anchor('chatgpt-vs-gemini', 'ChatGPT vs Gemini')} today.</p>`
    )
    expect(out).toBe('<p>See ChatGPT vs Gemini today.</p>')
    expect(out).not.toContain('href')
  })

  it('folds a retired slug onto its survivor instead of linking the 301 source', async () => {
    getConsolidatedCompareSlug.mockImplementation((s: string) =>
      s === 'claude-vs-chatgpt' ? 'chatgpt-vs-claude' : null
    )
    resolveCanonicalComparisonSlugs.mockResolvedValue(new Set(['chatgpt-vs-claude']))
    const out = await resolveCompareLinksInHtml(anchor('claude-vs-chatgpt', 'Claude vs ChatGPT'))
    expect(out).toContain('href="/compare/chatgpt-vs-claude"')
    expect(out).not.toContain('claude-vs-chatgpt"')
    // The label is editorial copy — folding the target must not rewrite it.
    expect(out).toContain('>Claude vs ChatGPT<')
  })

  it('resolves the whole body in one catalog query regardless of link count', async () => {
    resolveCanonicalComparisonSlugs.mockResolvedValue(new Set(['a-vs-b']))
    await resolveCompareLinksInHtml(
      [anchor('a-vs-b', 'A'), anchor('c-vs-d', 'C'), anchor('e-vs-f', 'E')].join(' ')
    )
    expect(resolveCanonicalComparisonSlugs).toHaveBeenCalledTimes(1)
  })

  it('does not touch a body with no /compare links, and issues no query', async () => {
    const html = '<p>Plain <a href="/blog/x">copy</a>.</p>'
    expect(await resolveCompareLinksInHtml(html)).toBe(html)
    expect(resolveCanonicalComparisonSlugs).not.toHaveBeenCalled()
  })
})

describe('filterLiveCompareSlugs', () => {
  it('drops dead slugs, folds survivors, and preserves order', async () => {
    getConsolidatedCompareSlug.mockImplementation((s: string) =>
      s === 'claude-vs-chatgpt' ? 'chatgpt-vs-claude' : null
    )
    resolveCanonicalComparisonSlugs.mockResolvedValue(new Set(['nordvpn-vs-surfshark', 'chatgpt-vs-claude']))
    expect(
      await filterLiveCompareSlugs(['nordvpn-vs-surfshark', 'expressvpn-vs-nordvpn', 'claude-vs-chatgpt'])
    ).toEqual(['nordvpn-vs-surfshark', 'chatgpt-vs-claude'])
  })

  it('dedupes entries that fold onto the same survivor', async () => {
    getConsolidatedCompareSlug.mockImplementation((s: string) =>
      s === 'claude-vs-chatgpt' ? 'chatgpt-vs-claude' : null
    )
    resolveCanonicalComparisonSlugs.mockResolvedValue(new Set(['chatgpt-vs-claude']))
    expect(await filterLiveCompareSlugs(['claude-vs-chatgpt', 'chatgpt-vs-claude'])).toEqual([
      'chatgpt-vs-claude',
    ])
  })
})

describe('filterLiveInternalLinks', () => {
  it('drops dead /compare and dead /blog entries but keeps other hrefs', async () => {
    resolveCanonicalComparisonSlugs.mockResolvedValue(new Set(['etf-vs-mutual-fund']))
    getBlogBySlug.mockImplementation(async (s: string) =>
      s === 'live-post' ? { slug: s } : null
    )
    const out = await filterLiveInternalLinks([
      { href: '/compare/etf-vs-mutual-fund', label: 'live compare' },
      { href: '/compare/stocks-vs-real-estate', label: 'dead compare' },
      { href: '/blog/live-post', label: 'live blog' },
      { href: '/blog/best-strategies-to-pay-off-debt-faster', label: 'dead blog' },
      { href: '/tools/roi-calculator', label: 'other' },
    ])
    expect(out.map((l) => l.label)).toEqual(['live compare', 'live blog', 'other'])
  })

  it('rewrites a surviving /compare href onto the canonical slug', async () => {
    getConsolidatedCompareSlug.mockImplementation((s: string) =>
      s === 'surfshark-vs-nordvpn' ? 'nordvpn-vs-surfshark' : null
    )
    resolveCanonicalComparisonSlugs.mockResolvedValue(new Set(['nordvpn-vs-surfshark']))
    const [link] = await filterLiveInternalLinks([{ href: '/compare/surfshark-vs-nordvpn', label: 'VPNs' }])
    expect(link.href).toBe('/compare/nordvpn-vs-surfshark')
  })
})
