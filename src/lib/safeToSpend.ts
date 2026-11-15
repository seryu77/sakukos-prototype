// Core rule from the Module 4 PRD:
// safe to spend today = total synced balance / days left (today included),
// rounded down to the nearest Rp1.000. Under Rp1.000 in total, the number is Rp0.

export const DAYS_LEFT = 4 // 28, 29, 30, 31 Oct 2026; the allowance arrives on 1 Nov
export const STALE_HOURS = 12

export function totalBalance(wallets: { balance: number }[]): number {
  return wallets.reduce((sum, w) => sum + w.balance, 0)
}

export function safeToSpend(total: number, daysLeft: number = DAYS_LEFT): number {
  if (total < 1000) return 0
  return Math.floor(total / daysLeft / 1000) * 1000
}

export function formatRp(amount: number): string {
  return 'Rp' + Math.max(0, Math.round(amount)).toLocaleString('id-ID')
}
