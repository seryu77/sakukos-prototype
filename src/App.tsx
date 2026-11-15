import { useEffect, useState } from 'react'
import { DemoPanel } from './components/DemoPanel'
import { Phone } from './components/Phone'
import { Sheets } from './components/Sheets'
import { PROVIDERS, initScenario, isScenario, withView } from './data'
import type { AppState, ScenarioName, WalletId } from './types'

function scenarioFromHash(): ScenarioName {
  const hash = window.location.hash.replace('#', '')
  return isScenario(hash) ? hash : 'success'
}

export default function App() {
  const [state, setState] = useState<AppState>(() => initScenario(scenarioFromHash(), 0))

  const switchScenario = (name: ScenarioName) => setState((s) => initScenario(name, s.epoch + 1))

  // Opening #success, #empty or #stale switches the scenario, also while the page is open.
  useEffect(() => {
    const onHash = () => switchScenario(scenarioFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Refresh rate limit: one tap, then a 5 minute countdown.
  useEffect(() => {
    if (state.cooldown <= 0) return
    const timer = setTimeout(() => setState((s) => ({ ...s, cooldown: Math.max(0, s.cooldown - 1) })), 1000)
    return () => clearTimeout(timer)
  }, [state.cooldown])

  const refresh = () => {
    const epoch = state.epoch
    setState((s) => ({ ...s, refreshing: true }))
    setTimeout(() => {
      setState((s) =>
        s.epoch !== epoch
          ? s
          : withView({
              ...s,
              wallets: s.wallets.map((w) => ({ ...w, hoursAgo: 0 })),
              refreshing: false,
              cooldown: 300,
            }),
      )
    }, 1200)
  }

  const pickWallet = (id: WalletId) => {
    const epoch = state.epoch
    setState((s) => ({ ...s, sheet: { kind: 'connecting', id } }))
    setTimeout(() => {
      setState((s) =>
        s.epoch !== epoch
          ? s
          : withView({
              ...s,
              wallets: [...s.wallets, { id, balance: PROVIDERS[id].sample, hoursAgo: 0 }],
              sheet: null,
            }),
      )
    }, 1100)
  }

  const saveBalance = (id: WalletId, balance: number) =>
    setState((s) =>
      withView({
        ...s,
        wallets: s.wallets.map((w) => (w.id === id ? { ...w, balance, hoursAgo: 0 } : w)),
        sheet: null,
      }),
    )

  return (
    <div className="wrap">
      <div className="phone" aria-label="SakuKos app prototype">
        <div className="status">
          <span>07:42</span>
          <span>4G &nbsp;82%</span>
        </div>
        <div className="app">
          <Phone
            state={state}
            onRefresh={refresh}
            onOpenPicker={() => setState((s) => ({ ...s, sheet: { kind: 'picker' } }))}
            onOpenCheckin={(id) => setState((s) => ({ ...s, sheet: { kind: 'checkin', id } }))}
          />
        </div>
        <Sheets
          sheet={state.sheet}
          wallets={state.wallets}
          onClose={() => setState((s) => ({ ...s, sheet: null }))}
          onPick={pickWallet}
          onSaveBalance={saveBalance}
        />
      </div>
      <DemoPanel scenario={state.scenario} log={state.log} onScenario={switchScenario} />
    </div>
  )
}
