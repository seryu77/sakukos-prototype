import type { AppState, ScenarioName, Wallet, WalletId } from './types'
import { DAYS_LEFT, STALE_HOURS, safeToSpend, totalBalance } from './lib/safeToSpend'

export const PROVIDERS: Record<WalletId, { name: string; color: string; short: string; sample: number }> = {
  gopay: { name: 'GoPay', color: '#00a5cf', short: 'GP', sample: 120000 },
  ovo: { name: 'OVO', color: '#4c3494', short: 'OV', sample: 95000 },
  dana: { name: 'DANA', color: '#118eea', short: 'DA', sample: 80000 },
  shopeepay: { name: 'ShopeePay', color: '#ee4d2d', short: 'SP', sample: 50000 },
}

export const SCENARIOS: { name: ScenarioName; label: string }[] = [
  { name: 'success', label: 'Success' },
  { name: 'empty', label: 'Empty: no wallet' },
  { name: 'stale', label: 'Error: stale sync' },
]

export function isScenario(value: string): value is ScenarioName {
  return value === 'success' || value === 'empty' || value === 'stale'
}

const wallet = (id: WalletId, balance: number, hoursAgo: number): Wallet => ({ id, balance, hoursAgo })

export function staleWallets(wallets: Wallet[]): Wallet[] {
  return wallets.filter((w) => w.hoursAgo > STALE_HOURS)
}

// Appends the simulated telemetry event for a rendered number (never for the empty state).
export function withView(state: AppState): AppState {
  if (state.wallets.length === 0) return state
  const payload = {
    event_name: 'daily_safe_to_spend_viewed',
    user_id: 'usr_demo01',
    timestamp: '2026-10-28T07:42:13+07:00',
    properties: {
      days_until_next_allowance: DAYS_LEFT,
      safe_to_spend_amount: safeToSpend(totalBalance(state.wallets)),
      connected_wallet_count: state.wallets.length,
      is_stale: staleWallets(state.wallets).length > 0,
      source: 'organic_open',
    },
  }
  const entry = 'POST /v1/events\n' + JSON.stringify(payload, null, 2)
  return { ...state, log: [entry, ...state.log] }
}

export function initScenario(name: ScenarioName, epoch: number): AppState {
  const wallets =
    name === 'success'
      ? [wallet('gopay', 120000, 1), wallet('dana', 80000, 1), wallet('shopeepay', 50000, 1)]
      : name === 'stale'
        ? [wallet('gopay', 120000, 14), wallet('dana', 80000, 1)]
        : []
  return withView({ scenario: name, wallets, sheet: null, refreshing: false, cooldown: 0, epoch, log: [] })
}
