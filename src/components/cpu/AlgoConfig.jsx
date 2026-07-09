import { ALGORITHMS, getAlgoMeta } from '../../lib/cpuAlgorithms.js'
import Switch from '../Switch.jsx'

export default function AlgoConfig({ algoKey, setAlgoKey, preemptive, setPreemptive, quantum, setQuantum }) {
  const meta = getAlgoMeta(algoKey)

  return (
    <div className="border border-ink/15 bg-panel p-4">
      <div className="font-mono text-2xs text-ink/40 mb-2">01 / ALGORITHM</div>
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-2xs text-ink/50">select scheduling algorithm</span>
          <select
            value={algoKey}
            onChange={(e) => setAlgoKey(e.target.value)}
            className="font-mono text-xs sm:text-sm border border-ink/40 bg-paper px-2 py-2 min-w-[280px] focus:outline-none focus:border-accent"
          >
            {ALGORITHMS.map((a) => (
              <option key={a.key} value={a.key}>
                {a.label}
              </option>
            ))}
          </select>
        </label>

        {meta.preemptToggle && (
          <div className="flex flex-col gap-1">
            <span className="font-mono text-2xs text-ink/50">mode</span>
            <Switch
              checked={preemptive}
              onChange={setPreemptive}
              offLabel="NON-PREEMPTIVE"
              onLabel="PREEMPTIVE"
            />
          </div>
        )}

        {meta.forcedPreemptive && !meta.needsQuantum && (
          <div className="font-mono text-2xs text-ink/40 border border-ink/20 px-2 py-1">
            forced preemptive
          </div>
        )}

        {meta.needsQuantum && (
          <label className="flex flex-col gap-1">
            <span className="font-mono text-2xs text-ink/50">time quantum</span>
            <input
              type="number"
              min={1}
              value={quantum}
              onChange={(e) => setQuantum(Math.max(1, Number(e.target.value) || 1))}
              className="font-mono text-xs sm:text-sm border border-ink/40 bg-paper px-2 py-2 w-24 focus:outline-none focus:border-accent"
            />
          </label>
        )}

        {!meta.preemptToggle && !meta.forcedPreemptive && (
          <div className="font-mono text-2xs text-ink/40 border border-ink/20 px-2 py-1">
            non-preemptive only
          </div>
        )}
      </div>
    </div>
  )
}
