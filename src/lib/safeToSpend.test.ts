import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatRp, safeToSpend, totalBalance } from './safeToSpend.ts'

test('success scenario from the PRD gives Rp62.000', () => {
  const total = totalBalance([{ balance: 120000 }, { balance: 80000 }, { balance: 50000 }])
  assert.equal(total, 250000)
  assert.equal(formatRp(safeToSpend(total)), 'Rp62.000')
})

test('rounds down to the nearest Rp1.000', () => {
  assert.equal(safeToSpend(250500), 62000)
})

test('stale scenario gives Rp50.000, and Rp35.000 after GoPay is corrected to Rp60.000', () => {
  assert.equal(safeToSpend(200000), 50000)
  assert.equal(safeToSpend(140000), 35000)
})

test('a single GoPay wallet gives Rp30.000', () => {
  assert.equal(safeToSpend(120000), 30000)
})

test('totals under Rp1.000 give Rp0 without dividing', () => {
  assert.equal(safeToSpend(999), 0)
  assert.equal(safeToSpend(0), 0)
})
