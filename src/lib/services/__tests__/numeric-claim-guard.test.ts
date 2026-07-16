// DAN-2188 — regression tests for the self-contradicting-numeric-claim guard.
//
// Root cause (from DAN-2161): the generator emits precise figures independently
// in free prose and in the structured keyDifferences table, so the two drift.
// `china-economy-vs-united-states` shipped a sentence saying one side was
// "larger" while quoting the smaller nominal number in the very same clause.
//
// The detector is deliberately narrow: it only fires when the prose quotes BOTH
// numbers itself, so a hit is always a real internal inconsistency rather than a
// fact-check miss. These tests pin both the fires and the must-not-fires.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  findSelfContradictions,
  scanTextForSelfContradictions,
  parseNumericMagnitude,
} from '../numeric-claim-guard'

describe('parseNumericMagnitude', () => {
  it('parses word-suffixed magnitudes', () => {
    expect(parseNumericMagnitude('$17.8 trillion')).toBe(17.8e12)
    expect(parseNumericMagnitude('1,200 million')).toBe(1.2e9)
  })

  it('parses attached letter suffixes', () => {
    expect(parseNumericMagnitude('$20b')).toBe(20e9)
    expect(parseNumericMagnitude('115m')).toBe(115e6)
  })

  it('parses percentages and bare numbers', () => {
    expect(parseNumericMagnitude('78%')).toBe(78)
    expect(parseNumericMagnitude('rank 3')).toBe(3)
  })

  it('returns null when there is no number', () => {
    expect(parseNumericMagnitude('substantially larger')).toBeNull()
  })
})

describe('scanTextForSelfContradictions — fires on real contradictions', () => {
  it('catches the DAN-2161 china case: "larger" while quoting the smaller number', () => {
    const hits = scanTextForSelfContradictions(
      "China's economy is larger by nominal GDP ($17.8 trillion vs $27.4 trillion).",
      'shortAnswer'
    )
    expect(hits).toHaveLength(1)
    expect(hits[0].a).toBe(17.8e12)
    expect(hits[0].b).toBe(27.4e12)
    expect(hits[0].isRank).toBe(false)
  })

  it('catches the inverse direction: "fewer" while quoting the bigger number', () => {
    const hits = scanTextForSelfContradictions(
      'Slack has fewer integrations (2,600 vs 1,100).',
      'verdict'
    )
    expect(hits).toHaveLength(1)
  })

  it('inverts the test in rank context — "ranked higher" needs the smaller ordinal', () => {
    const hits = scanTextForSelfContradictions(
      'Brazil is ranked higher in the standings (rank 8 vs rank 3).',
      'verdict'
    )
    expect(hits).toHaveLength(1)
    expect(hits[0].isRank).toBe(true)
  })
})

describe('scanTextForSelfContradictions — stays quiet when it should', () => {
  it('passes prose whose direction matches its numbers', () => {
    expect(
      scanTextForSelfContradictions(
        'The US economy is larger by nominal GDP ($27.4 trillion vs $17.8 trillion).',
        'shortAnswer'
      )
    ).toHaveLength(0)
  })

  it('passes correct rank prose (better rank = smaller ordinal)', () => {
    expect(
      scanTextForSelfContradictions('Brazil is ranked higher (rank 3 vs rank 8).', 'verdict')
    ).toHaveLength(0)
  })

  it('ignores ranges, which are ambiguous for a min/max test', () => {
    expect(
      scanTextForSelfContradictions('Costs more ($150-200M vs $400M).', 'verdict')
    ).toHaveLength(0)
  })

  it('ignores prose with no direction word', () => {
    expect(
      scanTextForSelfContradictions('Nominal GDP differs ($17.8 trillion vs $27.4 trillion).', 'shortAnswer')
    ).toHaveLength(0)
  })

  it('ignores directional language with no quoted figures — the DAN-2161 messi fallback', () => {
    expect(
      scanTextForSelfContradictions('Messi has substantially more career goals.', 'verdict')
    ).toHaveLength(0)
  })

  it('ignores equal numbers and empty/null text', () => {
    expect(scanTextForSelfContradictions('More users (5M vs 5M).', 'verdict')).toHaveLength(0)
    expect(scanTextForSelfContradictions(null, 'verdict')).toHaveLength(0)
    expect(scanTextForSelfContradictions('', 'verdict')).toHaveLength(0)
  })
})

describe('findSelfContradictions — covers every prose field', () => {
  const BAD = 'China is larger by nominal GDP ($17.8 trillion vs $27.4 trillion).'

  it('scans shortAnswer, verdict, quickAnswer and faq answers', () => {
    const hits = findSelfContradictions({
      shortAnswer: BAD,
      verdict: BAD,
      quickAnswer: { tldr: BAD, keyFact: BAD },
      faqs: [{ question: 'Which is bigger?', answer: BAD }],
    })
    expect(hits.map((h) => h.field).sort()).toEqual([
      'faqs[0].answer',
      'quickAnswer.keyFact',
      'quickAnswer.tldr',
      'shortAnswer',
      'verdict',
    ])
  })

  it('returns empty for a clean comparison', () => {
    expect(
      findSelfContradictions({
        shortAnswer: 'The US economy is larger by nominal GDP ($27.4 trillion vs $17.8 trillion, 2025).',
        verdict: 'Choose the US for scale. Choose China for growth rate.',
        quickAnswer: { tldr: 'The US leads on nominal GDP.', keyFact: 'US nominal GDP was $27.4 trillion (2025).' },
        faqs: [],
      })
    ).toHaveLength(0)
  })

  it('tolerates missing optional fields', () => {
    expect(findSelfContradictions({})).toHaveLength(0)
    expect(findSelfContradictions({ quickAnswer: null, faqs: null })).toHaveLength(0)
  })
})

// ── saveComparison pre-publish gate (no DB needed) ───────────────────────────

vi.mock('@/lib/db/prisma', () => ({ getPrismaClient: () => null }))
vi.mock('@/lib/services/redis', () => ({ getRedis: () => null }))
vi.mock('@/lib/services/internal-linking-engine', () => ({
  getLinkedComparisons: vi.fn().mockResolvedValue([]),
  getRelatedBlogPosts: vi.fn().mockResolvedValue([]),
}))

import { saveComparison } from '../comparison-service'

function makeComparison(prose: Partial<Record<'shortAnswer' | 'verdict', string>>) {
  return {
    id: 'test-id',
    slug: 'china-economy-vs-united-states',
    title: 'China Economy vs United States',
    shortAnswer: prose.shortAnswer ?? null,
    keyDifferences: [],
    verdict: prose.verdict ?? null,
    category: 'countries',
    entities: [{ slug: 'china' }, { slug: 'united-states' }],
    attributes: [],
    faqs: [],
    relatedComparisons: [],
    relatedBlogPosts: [],
    metadata: {
      metaTitle: 'Test',
      metaDescription: 'Test',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAutoGenerated: true,
      isHumanReviewed: false,
      viewCount: 0,
    },
    citationStats: null,
    quickAnswer: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}

// Both the contradiction path and the mocked no-DB path return null, so assert
// on WHICH rejection log fired — otherwise these tests would pass even if the
// guard were deleted.
const REFUSAL = 'saveComparison: refusing to persist self-contradicting comparison'

describe('DAN-2188 — saveComparison self-contradiction guard', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('refuses to persist a comparison whose prose refutes its own numbers', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const result = await saveComparison(
      makeComparison({ shortAnswer: 'China is larger by nominal GDP ($17.8 trillion vs $27.4 trillion).' })
    )
    expect(result).toBeNull()
    expect(err).toHaveBeenCalledWith(REFUSAL, expect.objectContaining({ slug: 'china-economy-vs-united-states' }))
  })

  it('catches a contradiction in the verdict, not just the shortAnswer', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    await saveComparison(
      makeComparison({ verdict: 'China leads on nominal GDP ($17.8 trillion vs $27.4 trillion).' })
    )
    expect(err).toHaveBeenCalledWith(REFUSAL, expect.anything())
  })

  it('does not trip the guard on a self-consistent comparison', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    await saveComparison(
      makeComparison({ shortAnswer: 'The US is larger by nominal GDP ($27.4 trillion vs $17.8 trillion).' })
    )
    expect(err).not.toHaveBeenCalledWith(REFUSAL, expect.anything())
  })
})
