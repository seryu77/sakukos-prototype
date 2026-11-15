import { SCENARIOS } from '../data'
import type { ScenarioName } from '../types'

interface Props {
  scenario: ScenarioName
  log: string[]
  onScenario: (name: ScenarioName) => void
}

export function DemoPanel({ scenario, log, onScenario }: Props) {
  return (
    <aside className="panel">
      <div>
        <h1>SakuKos daily number</h1>
        <p className="intro">
          Clickable prototype of the Module 4 PRD. Pick a Gherkin scenario, then use the phone like a student would.
        </p>
      </div>
      <div className="card">
        <h2>Scenario</h2>
        <div className="seg" role="group" aria-label="Scenario">
          {SCENARIOS.map((s) => (
            <button
              type="button"
              key={s.name}
              id={`sc-${s.name}`}
              aria-pressed={scenario === s.name}
              onClick={() => onScenario(s.name)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <dl className="facts">
          <dt>Today</dt>
          <dd>Wed, 28 Oct 2026 (WIB)</dd>
          <dt>Next allowance</dt>
          <dd>Sun, 1 Nov 2026</dd>
          <dt>Rule</dt>
          <dd>total ÷ days left (today included), rounded down to Rp1.000</dd>
        </dl>
      </div>
      <div className="card">
        <h2>Telemetry sent</h2>
        <div className="log" aria-live="polite">
          {log.length === 0 ? <span className="none">No events yet.</span> : log.join('\n\n')}
        </div>
        <p className="note">Simulated. Shows the payload the app would POST to /v1/events.</p>
      </div>
      <p className="note">
        Wallet balances, syncing and connecting are simulated with sample data. No real e-wallet is contacted.
      </p>
    </aside>
  )
}
