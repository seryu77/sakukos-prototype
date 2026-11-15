import { DAYS_LEFT, STALE_HOURS, formatRp, safeToSpend, totalBalance } from '../lib/safeToSpend'
import { PROVIDERS, staleWallets } from '../data'
import type { AppState, WalletId } from '../types'

interface Props {
  state: AppState
  onRefresh: () => void
  onOpenPicker: () => void
  onOpenCheckin: (id: WalletId) => void
}

function syncText(hoursAgo: number): string {
  if (hoursAgo < 1) return 'Synced just now'
  return `Synced ${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`
}

function countdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export function Phone({ state, onRefresh, onOpenPicker, onOpenCheckin }: Props) {
  const { wallets, refreshing, cooldown } = state

  const top = (
    <div className="topbar">
      <div className="brand">
        Saku<span>Kos</span>
      </div>
      <div className="date">Wed, 28 Oct</div>
    </div>
  )

  if (wallets.length === 0) {
    return (
      <>
        {top}
        <div className="empty">
          <div className="ring">Rp</div>
          <p>Connect your first e-wallet to see your daily number</p>
          <small>GoPay, OVO, DANA and ShopeePay are supported.</small>
        </div>
        <div className="actions">
          <button type="button" className="btn primary" onClick={onOpenPicker}>
            Connect e-wallet
          </button>
        </div>
      </>
    )
  }

  const total = totalBalance(wallets)
  const number = safeToSpend(total)
  const stale = staleWallets(wallets)[0]
  const label = refreshing
    ? 'Refreshing balances...'
    : cooldown > 0
      ? `Try again in ${countdown(cooldown)}`
      : 'Refresh balances'

  return (
    <>
      {top}
      <div className="hero">
        <div className="label">Safe to spend today</div>
        <div className={`num${number === 0 ? ' zero' : ''}`} id="num">
          {formatRp(number)}
        </div>
        <div className="sub">
          <b>{DAYS_LEFT} days</b> until your allowance
        </div>
        <div className="total">
          <span>Total balance</span>
          <span>{formatRp(total)}</span>
        </div>
      </div>

      {stale && (
        <button type="button" className="banner" id="banner" onClick={() => onOpenCheckin(stale.id)}>
          <span className="dot" />
          <span>
            {PROVIDERS[stale.id].name} last synced {stale.hoursAgo} hours ago. <u>Confirm your balance?</u>
          </span>
        </button>
      )}

      <div className="section">
        <h3>Your wallets</h3>
        {wallets.map((w) => (
          <div className="wallet" key={w.id}>
            <div className="logo" style={{ background: PROVIDERS[w.id].color }}>
              {PROVIDERS[w.id].short}
            </div>
            <div>
              <div className="w-name">{PROVIDERS[w.id].name}</div>
              <div className={`w-sync${w.hoursAgo > STALE_HOURS ? ' stale' : ''}`}>{syncText(w.hoursAgo)}</div>
            </div>
            <div className="w-bal">{formatRp(w.balance)}</div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button type="button" className="btn" id="refresh" disabled={refreshing || cooldown > 0} onClick={onRefresh}>
          {label}
        </button>
      </div>
    </>
  )
}
