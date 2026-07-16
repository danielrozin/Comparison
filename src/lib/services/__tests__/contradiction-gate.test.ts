// DAN-2188 — end-to-end pre-publish gate: a generation whose prose refutes its
// own numbers must never reach a caller as success:true.
//
// Kept separate from numeric-claim-guard.test.ts because mocking the Anthropic
// SDK is module-level and would leak into that file's saveComparison tests.
// Mirrors the DAN-1266 empty-entity guard test setup.

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'

const mockMessagesCreate = vi.fn()

vi.mock('@anthropic-ai/sdk', () => {
  // Must be a regular function (not arrow) so it can be called with `new`.
  function MockAnthropic() {
    return { messages: { create: mockMessagesCreate } }
  }
  return { default: MockAnthropic }
})

vi.mock('@/lib/services/tavily-service', () => ({
  enrichComparisonData: vi.fn().mockResolvedValue({ context: '', sources: [] }),
}))

vi.mock('@/lib/services/image-service', () => ({
  fetchEntityImages: vi.fn().mockResolvedValue(new Map()),
}))

import { generateComparison } from '../ai-comparison-generator'

/**
 * A generation rich enough to clear the DAN-1800 quality gate, so the only
 * thing under test is the contradiction gate. `shortAnswer` is the variable.
 */
function generationJson(shortAnswer: string) {
  return JSON.stringify({
    title: 'China Economy vs United States',
    shortAnswer,
    entities: [
      {
        name: 'China',
        shortDesc: 'Second-largest national economy by nominal GDP.',
        entityType: 'country',
        pros: ['Fastest large-economy growth rate', 'Dominant manufacturing base', 'Largest export volume'],
        cons: ['Property-sector debt overhang', 'Ageing workforce'],
        bestFor: 'Manufacturing and export exposure',
      },
      {
        name: 'United States',
        shortDesc: 'Largest national economy by nominal GDP.',
        entityType: 'country',
        pros: ['Largest nominal GDP', 'Deepest capital markets', 'Reserve-currency issuer'],
        cons: ['High federal debt load', 'Wide income inequality'],
        bestFor: 'Scale and capital-market access',
      },
    ],
    keyDifferences: [
      { label: 'Nominal GDP (2025)', entityAValue: '$17.8 trillion', entityBValue: '$27.4 trillion', winner: 'b' },
      { label: 'GDP growth (2025)', entityAValue: '5.0%', entityBValue: '2.8%', winner: 'a' },
      { label: 'Population (2025)', entityAValue: '1.41 billion', entityBValue: '342 million', winner: 'a' },
      { label: 'GDP per capita (2025)', entityAValue: '$12,600', entityBValue: '$80,100', winner: 'b' },
      { label: 'Exports (2025)', entityAValue: '$3.5 trillion', entityBValue: '$2.1 trillion', winner: 'a' },
    ],
    attributes: [
      { name: 'Nominal GDP', unit: 'USD trillion', category: 'Scale', dataType: 'number', higherIsBetter: true, entityAValue: '$17.8 trillion', entityANumber: 17.8, entityBValue: '$27.4 trillion', entityBNumber: 27.4, winner: 'b' },
      { name: 'GDP growth', unit: '%', category: 'Scale', dataType: 'number', higherIsBetter: true, entityAValue: '5.0%', entityANumber: 5.0, entityBValue: '2.8%', entityBNumber: 2.8, winner: 'a' },
      { name: 'Population', unit: 'people', category: 'Demographics', dataType: 'number', higherIsBetter: null, entityAValue: '1.41 billion', entityANumber: 1410000000, entityBValue: '342 million', entityBNumber: 342000000, winner: 'a' },
      { name: 'GDP per capita', unit: 'USD', category: 'Prosperity', dataType: 'number', higherIsBetter: true, entityAValue: '$12,600', entityANumber: 12600, entityBValue: '$80,100', entityBNumber: 80100, winner: 'b' },
      { name: 'Exports', unit: 'USD trillion', category: 'Trade', dataType: 'number', higherIsBetter: true, entityAValue: '$3.5 trillion', entityANumber: 3.5, entityBValue: '$2.1 trillion', entityBNumber: 2.1, winner: 'a' },
      { name: 'Unemployment', unit: '%', category: 'Labor', dataType: 'number', higherIsBetter: false, entityAValue: '5.1%', entityANumber: 5.1, entityBValue: '4.2%', entityBNumber: 4.2, winner: 'b' },
    ],
    faqs: [
      { question: 'Which economy is larger?', answer: 'The United States is larger by nominal GDP as of 2025.' },
      { question: 'Which grows faster?', answer: 'China grew 5.0% in 2025 against 2.8% for the United States.' },
      { question: 'Which has higher GDP per capita?', answer: 'The United States, at roughly $80,100 in 2025.' },
    ],
    verdict:
      'The United States leads on scale and prosperity while China leads on growth and trade volume. Choose the United States for capital-market depth. Choose China for manufacturing exposure.',
    category: 'countries',
    quickAnswer: {
      tldr: 'The United States wins on nominal GDP, at $27.4 trillion against $17.8 trillion in 2025.',
      winnerName: 'United States',
      winnerReason: '54% larger nominal GDP in 2025',
      keyFact: 'US nominal GDP was $27.4 trillion in 2025.',
    },
    citationStats: { dataPointCount: 15, reviewsAnalyzed: null, preferencePercent: null, preferenceEntity: null },
    metaTitle: 'China vs United States Economy 2026',
    metaDescription: 'Compare the Chinese and US economies on GDP, growth, and trade.',
  })
}

describe('DAN-2188 — generateComparison contradiction gate', () => {
  beforeAll(() => { process.env.ANTHROPIC_API_KEY = 'test-key-stub' })
  afterAll(() => { delete process.env.ANTHROPIC_API_KEY })

  it('blocks the DAN-2161 china case instead of returning it for publish', async () => {
    mockMessagesCreate.mockResolvedValueOnce({
      content: [{
        type: 'text',
        text: generationJson("China's economy is larger by nominal GDP ($17.8 trillion vs $27.4 trillion)."),
      }],
    })
    const result = await generateComparison('China Economy', 'United States', 'china-economy-vs-united-states', { skipEnrichment: true })
    expect(result.success).toBe(false)
    expect(result.comparison).toBeNull()
    expect(result.errorStage).toBe('contradiction')
    expect(result.error).toMatch(/self-contradicts/i)
  })

  it('passes the same generation once the prose matches its own numbers', async () => {
    mockMessagesCreate.mockResolvedValueOnce({
      content: [{
        type: 'text',
        text: generationJson('The US economy is larger by nominal GDP ($27.4 trillion vs $17.8 trillion) as of 2025.'),
      }],
    })
    const result = await generateComparison('China Economy', 'United States', 'china-economy-vs-united-states', { skipEnrichment: true })
    expect(result.success).toBe(true)
    expect(result.comparison).not.toBeNull()
  })
})
