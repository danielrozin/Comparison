// ROO-263 — pool defaults only fill gaps; explicit DATABASE_URL params win.
import { describe, it, expect } from 'vitest'
import { tunedDatabaseUrl } from '../prisma'

describe('tunedDatabaseUrl', () => {
  it('adds pool_timeout and a pooler connection_limit when absent', () => {
    const out = new URL(tunedDatabaseUrl('postgresql://u:p@ep-x-pooler.example.neon.tech/db?sslmode=require')!)
    expect(out.searchParams.get('pool_timeout')).toBe('20')
    expect(out.searchParams.get('connection_limit')).toBe('10')
    expect(out.searchParams.get('sslmode')).toBe('require')
  })

  it('keeps explicit values', () => {
    const out = new URL(
      tunedDatabaseUrl('postgresql://u:p@ep-x-pooler.example.neon.tech/db?connection_limit=3&pool_timeout=5')!
    )
    expect(out.searchParams.get('connection_limit')).toBe('3')
    expect(out.searchParams.get('pool_timeout')).toBe('5')
  })

  it('does not raise connection_limit on a direct (non-pooler) host', () => {
    const out = new URL(tunedDatabaseUrl('postgresql://u:p@ep-x.example.neon.tech/db')!)
    expect(out.searchParams.has('connection_limit')).toBe(false)
  })
})
