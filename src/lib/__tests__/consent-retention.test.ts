/**
 * Tests for the GDPR ConsentRecord 3-year retention cleanup.
 */
import { describe, it, expect, vi } from 'vitest'
import { purgeExpiredConsentRecords, retentionCutoff } from '../consent-retention'

type Row = { id: string; grantedAt: Date }

function makePrismaStub(rows: Row[]) {
  const deleteMany = vi.fn(async ({ where }: { where: { grantedAt: { lt: Date } } }) => {
    const before = rows.length
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].grantedAt < where.grantedAt.lt) rows.splice(i, 1)
    }
    return { count: before - rows.length }
  })
  return { deleteMany, consentRecord: { deleteMany } }
}

describe('retentionCutoff', () => {
  it('subtracts the configured number of years from now', () => {
    const cutoff = retentionCutoff(new Date('2026-04-30T00:00:00Z'), 3)
    expect(cutoff.toISOString()).toBe('2023-04-30T00:00:00.000Z')
  })

  it('defaults to 3 years', () => {
    const cutoff = retentionCutoff(new Date('2026-04-30T00:00:00Z'))
    expect(cutoff.getUTCFullYear()).toBe(2023)
  })

  it('handles leap-day inputs without throwing', () => {
    expect(() => retentionCutoff(new Date('2024-02-29T00:00:00Z'), 3)).not.toThrow()
  })
})

describe('purgeExpiredConsentRecords', () => {
  it('deletes only rows older than the cutoff', async () => {
    const now = new Date('2026-04-30T00:00:00Z')
    const rows: Row[] = [
      { id: 'old-1', grantedAt: new Date('2022-01-01T00:00:00Z') },
      { id: 'old-2', grantedAt: new Date('2023-04-29T23:59:59Z') },
      { id: 'fresh-1', grantedAt: new Date('2023-05-01T00:00:00Z') },
      { id: 'fresh-2', grantedAt: new Date('2026-04-29T00:00:00Z') },
    ]
    const stub = makePrismaStub(rows)

    const result = await purgeExpiredConsentRecords(stub as never, { now, years: 3 })

    expect(result.deletedCount).toBe(2)
    expect(rows.map((r) => r.id).sort()).toEqual(['fresh-1', 'fresh-2'])
    expect(result.cutoff.toISOString()).toBe('2023-04-30T00:00:00.000Z')
  })

  it('returns deletedCount=0 when nothing is older than the cutoff', async () => {
    const stub = makePrismaStub([
      { id: 'fresh', grantedAt: new Date('2025-01-01T00:00:00Z') },
    ])
    const result = await purgeExpiredConsentRecords(stub as never, {
      now: new Date('2026-04-30T00:00:00Z'),
    })
    expect(result.deletedCount).toBe(0)
  })

  it('passes a `lt` filter on grantedAt to Prisma', async () => {
    const stub = makePrismaStub([])
    await purgeExpiredConsentRecords(stub as never, {
      now: new Date('2026-04-30T00:00:00Z'),
      years: 3,
    })
    expect(stub.deleteMany).toHaveBeenCalledOnce()
    expect(stub.deleteMany.mock.calls[0][0]).toEqual({
      where: { grantedAt: { lt: new Date('2023-04-30T00:00:00Z') } },
    })
  })
})
