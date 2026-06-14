// DAN-1152 — integration regression for CTR Bug 3.
//
// The prod meta-description failures came from descriptions derived from a
// comparison's shortAnswer via a raw `shortAnswer.slice(0, 155)` — a mid-word
// cut with NO "…" that also bypassed clampDescription() in
// src/app/compare/[slug]/page.tsx (the ≤160-char slice passed straight through
// the clamp untouched). The 13 PR-#67 unit tests on clampDescription() never
// caught this because they called the clamp directly and never exercised the
// row → metadata path. This test drives the real getComparisonBySlug pipeline
// for a comparison whose long shortAnswer was the source of the prod failure
// (/compare/ps5-vs-xbox-series-x, cut to "…Game Pass sub" at 155 on prod) and
// asserts the metaDescription is now clamped on a word boundary with an ellipsis.
//
// The DB-backed path in comparison-service.ts:transformToPageData was fixed the
// same way (metaDescription: row.metaDescription || clampDescription(row.shortAnswer)).

import { describe, it, expect, vi } from 'vitest'

import { META_DESCRIPTION_LIMIT } from '@/lib/seo/metadata'

vi.mock('@/lib/services/redis', () => ({ getRedis: () => null }))
vi.mock('@/lib/services/internal-linking-engine', () => ({
  getLinkedComparisons: vi.fn().mockResolvedValue([]),
  getRelatedBlogPosts: vi.fn().mockResolvedValue([]),
}))

import { getComparisonBySlug } from '../comparison-service'

const PROD_CUT_FRAGMENT = 'Game Pass sub' // the old raw slice(0,155) ended here

describe('DAN-1152 — shortAnswer-derived meta description is word-boundary clamped', () => {
  it('does not emit the old raw 155-char mid-word cut for ps5-vs-xbox-series-x', async () => {
    const result = await getComparisonBySlug('ps5-vs-xbox-series-x')
    expect(result).not.toBeNull()
    const desc = result!.metadata.metaDescription

    // Regression guard against the exact prod defect.
    expect(desc.endsWith(PROD_CUT_FRAGMENT)).toBe(false)

    // The description is derived from the (longer-than-limit) shortAnswer, so it
    // must be clamped: within the limit, word boundary preserved, ellipsis added.
    expect(desc.length).toBeLessThanOrEqual(META_DESCRIPTION_LIMIT)
    expect(desc.endsWith('…')).toBe(true)
    expect(desc.slice(0, -1)).not.toMatch(/\s$/) // no dangling space before "…"
  })

  it('every mock comparison with a derived description stays within the limit and never ends mid-word at exactly 155', async () => {
    const { getExtraComparisons } = await import('../mock-data-extra')
    const extras = getExtraComparisons()
    for (const comp of Object.values(extras)) {
      const desc = comp.metadata.metaDescription
      expect(desc.length).toBeLessThanOrEqual(META_DESCRIPTION_LIMIT)
      // A raw slice(0,155) of a long shortAnswer would be exactly 155 chars with
      // no ellipsis. The clamped output is < 155 here and ends with "…".
      if (comp.shortAnswer.length > META_DESCRIPTION_LIMIT) {
        expect(desc.endsWith('…')).toBe(true)
        expect(desc).not.toBe(comp.shortAnswer.slice(0, 155))
      }
    }
  })
})
