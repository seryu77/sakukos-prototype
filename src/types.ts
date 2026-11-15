export type WalletId = 'gopay' | 'ovo' | 'dana' | 'shopeepay'
export type ScenarioName = 'success' | 'empty' | 'stale'

export interface Wallet {
  id: WalletId
  balance: number
  hoursAgo: number
}

export type Sheet =
  | { kind: 'picker' }
  | { kind: 'connecting'; id: WalletId }
  | { kind: 'checkin'; id: WalletId }
  | null

export interface AppState {
  scenario: ScenarioName
  wallets: Wallet[]
  sheet: Sheet
  refreshing: boolean
  cooldown: number // seconds left on the refresh rate limit
  epoch: number // bumps when the scenario changes, so old timers are ignored
  log: string[] // simulated telemetry, newest first
}
