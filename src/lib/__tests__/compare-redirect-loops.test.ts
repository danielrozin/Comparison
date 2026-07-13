// DAN-2065 — the /compare/* consolidation map must not eat its own live pages.
//
// ORDERING_CONSOLIDATIONS picked each cluster's survivor by viewCount, but
// view_count is seed data rather than traffic (DAN-2037). For 18 clusters it
// therefore retired the slug that is actually `published` and kept the one that
// is `archived`. Archived rows 404 (DAN-1886), so those 18 live comparisons were
// 301'ing at the edge directly into a 404 — verified dead in prod:
// zoom-vs-microsoft-teams, tesla-vs-rivian, india-vs-china, netflix-vs-apple-tv-plus.
//
// The ordering-canonicalizer in [slug].tsx then sent the archived target back to
// the published source, so some clusters also formed an edge<->page redirect loop
// (starbucks-vs-dunkin ⇄ dunkin-vs-starbucks hit curl's 10-redirect ceiling).

import { describe, it, expect } from 'vitest'
import { COMPARE_REDIRECTS, getConsolidatedCompareSlug } from '@/lib/redirects/compare-redirects'

// The published survivors of the 18 inverted clusters. Each was a live 200 page
// being 301'd into an archived 404.
const LIVE_SURVIVORS = [
  'netflix-vs-apple-tv-plus',
  'mercedes-gle-vs-bmw-x5',
  'us-vs-china-gdp',
  'india-vs-china',
  'mailchimp-vs-convertkit',
  'instacart-vs-doordash',
  'f-35-vs-f-22',
  'robinhood-vs-fidelity',
  'vanguard-vs-fidelity',
  'toyota-rav4-vs-honda-cr-v',
  'mailchimp-vs-hubspot',
  'zoom-vs-microsoft-teams',
  'peloton-vs-nordictrack',
  'tesla-vs-rivian',
  'roomba-vs-roborock',
  'temu-vs-shein',
  'tidal-vs-spotify',
  'dunkin-vs-starbucks',
  // DAN-1365 kept `kobe-vs-lebron` for its keyword match, but a later archive
  // sweep set that row to archived — so the survivor 404'd and this published page
  // was being redirected into it. Same class, MANUAL layer rather than generated.
  'kobe-bryant-vs-lebron-james',
]

describe('DAN-2065: compare consolidation map', () => {
  it.each(LIVE_SURVIVORS)('does not redirect the live page %s anywhere', (slug) => {
    expect(getConsolidatedCompareSlug(slug)).toBeNull()
  })

  it.each(LIVE_SURVIVORS)('folds the retired ordering INTO %s', (survivor) => {
    // The archived mirror ordering should now point at the published survivor.
    const retired = COMPARE_REDIRECTS.filter(
      (r) => r.destination === `/compare/${survivor}`
    )

    expect(retired.length).toBeGreaterThan(0)
  })

  it('has no redirect whose destination is itself a redirect source (no chains or loops)', () => {
    const chained = COMPARE_REDIRECTS.filter((r) => {
      const dest = r.destination.replace('/compare/', '')
      return getConsolidatedCompareSlug(dest) !== null
    })

    expect(chained).toEqual([])
  })

  it('has no self-redirect', () => {
    expect(COMPARE_REDIRECTS.filter((r) => r.source === r.destination)).toEqual([])
  })
})
