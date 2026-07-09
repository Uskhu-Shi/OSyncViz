import { useState } from 'react'
import { colorFor } from '../../lib/colors.js'

export default function ProcessMemManager({ processes, addProcess, removeProcess, clearAll }) {
  const [size, setSize] = useState(40)

  return (
    <div className="border border-ink/15 bg-panel p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-2xs text-ink/40">03 / INCOMING PROCESSES</div>
        <button
          onClick={clearAll}
          disabled={!processes.length}
          className="font-mono text-2xs border border-ink/30 px-2 py-1 text-ink/60 hover:border-warn hover:text-warn disabled:opacity-30"
        >
          delete all
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-2xs text-ink/50">request size (kb)</span>
          <input
            type="number"
            min={1}
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="font-mono text-xs border border-ink/40 bg-paper px-2 py-1.5 w-28 focus:outline-none focus:border-accent"
          />
        </label>
        <button
          onClick={() => addProcess(Math.max(1, Number(size) || 1))}
          className="font-mono text-xs bg-ink text-paper px-3 py-1.5 hover:bg-accent transition-colors"
        >
          + add process
        </button>
      </div>

      {processes.length === 0 ? (
        <div className="font-mono text-2xs text-ink/35 border border-dashed border-ink/20 px-3 py-6 text-center">
          no processes queued for allocation
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {processes.map((p) => (
            <div key={p.id} className="border border-ink/30 px-2.5 py-1.5 flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 inline-block" style={{ backgroundColor: colorFor(p.id) }} />
              <span className="font-semibold">{p.name}</span>
              <span className="text-ink/50">{p.size}kb</span>
              <button onClick={() => removeProcess(p.id)} className="text-ink/35 hover:text-warn">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
