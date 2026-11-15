import { useEffect, useRef, useState, type FormEvent } from 'react'
import { PROVIDERS } from '../data'
import type { Sheet, Wallet, WalletId } from '../types'

interface Props {
  sheet: Sheet
  wallets: Wallet[]
  onClose: () => void
  onPick: (id: WalletId) => void
  onSaveBalance: (id: WalletId, balance: number) => void
}

export function Sheets({ sheet, wallets, onClose, onPick, onSaveBalance }: Props) {
  if (!sheet) return null

  return (
    <div className="scrim">
      {sheet.kind === 'picker' && <Picker wallets={wallets} onClose={onClose} onPick={onPick} />}
      {sheet.kind === 'connecting' && (
        <div className="sheet" role="dialog" aria-label="Connecting">
          <h2>Connecting {PROVIDERS[sheet.id].name}</h2>
          <div className="loading">
            <span className="spin" />
            Reading your balance...
          </div>
        </div>
      )}
      {sheet.kind === 'checkin' && (
        <Checkin wallet={wallets.find((w) => w.id === sheet.id)} onClose={onClose} onSave={onSaveBalance} />
      )}
    </div>
  )
}

function Picker({ wallets, onClose, onPick }: Pick<Props, 'wallets' | 'onClose' | 'onPick'>) {
  const connected = wallets.map((w) => w.id)
  const options = (Object.keys(PROVIDERS) as WalletId[]).filter((id) => !connected.includes(id))
  return (
    <div className="sheet" role="dialog" aria-label="Connect e-wallet">
      <h2>Connect an e-wallet</h2>
      <p>SakuKos only reads your balance. It cannot send or spend money.</p>
      {options.map((id) => (
        <button type="button" className="pick" key={id} onClick={() => onPick(id)}>
          <div className="logo" style={{ background: PROVIDERS[id].color }}>
            {PROVIDERS[id].short}
          </div>
          <span className="w-name">{PROVIDERS[id].name}</span>
          <span className="tag">Connect</span>
        </button>
      ))}
      <button type="button" className="btn" onClick={onClose}>
        Cancel
      </button>
    </div>
  )
}

function Checkin({
  wallet,
  onClose,
  onSave,
}: {
  wallet: Wallet | undefined
  onClose: () => void
  onSave: Props['onSaveBalance']
}) {
  const [value, setValue] = useState(wallet ? wallet.balance.toLocaleString('id-ID') : '')
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    input.current?.focus()
    input.current?.select()
  }, [])

  if (!wallet) return null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const digits = value.replace(/[^0-9]/g, '')
    onSave(wallet.id, digits ? parseInt(digits, 10) : 0)
  }

  return (
    <form className="sheet" role="dialog" aria-label="Confirm balance" onSubmit={submit}>
      <h2>Confirm your {PROVIDERS[wallet.id].name} balance</h2>
      <p>
        Last synced {wallet.hoursAgo} hours ago. Open {PROVIDERS[wallet.id].name} and type the balance you see.
      </p>
      <label className="field" htmlFor="ci-amount">
        <span>Rp</span>
        <input
          id="ci-amount"
          ref={input}
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <div className="row">
        <button type="button" className="btn" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn primary">
          Save balance
        </button>
      </div>
    </form>
  )
}
