import { useState } from 'react'
import { colorFor } from '../../lib/colors.js'

export default function ProcessManager({ processes, addProcess, removeProcess, clearAll, needsPriority }) {
  const [arrival, setArrival] = useState(0)
  const [burst, setBurst] = useState(4)
  const [priority, setPriority] = useState(1)

  const handleAdd = () => {
    addProcess({
      arrival: Math.max(0, Number(arrival) || 0),
      burst: Math.max(1, Number(burst) || 1),
      priority: Math.max(0, Number(priority) || 0),
    })
  }

  return (
    <div className="border border-ink/15 bg-panel p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-2xs text-ink/40">02 / PROCESSES</div>
        <button
          onClick={clearAll}
          disabled={!processes.length}
          className="font-mono text-2xs border border-ink/30 px-2 py-1 text-ink/60 hover:border-warn hover:text-warn transition-colors disabled:opacity-30 disabled:hover:border-ink/30 disabled:hover:text-ink/60"
        >
          delete all
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-2xs text-ink/50">arrival time</span>
          <input
            type="number"
            min={0}
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            className="font-mono text-xs border border-ink/40 bg-paper px-2 py-1.5 w-24 focus:outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-2xs text-ink/50">burst / duration</span>
          <input
            type="number"
            min={1}
            value={burst}
            onChange={(e) => setBurst(e.target.value)}
            className="font-mono text-xs border border-ink/40 bg-paper px-2 py-1.5 w-24 focus:outline-none focus:border-accent"
          />
        </label>
        {needsPriority && (
          <label className="flex flex-col gap-1">
            <span className="font-mono text-2xs text-ink/50">priority (lower = higher)</span>
            <input
              type="number"
              min={0}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="font-mono text-xs border border-ink/40 bg-paper px-2 py-1.5 w-24 focus:outline-none focus:border-accent"
            />
          </label>
        )}
        <button
          onClick={handleAdd}
          className="font-mono text-xs bg-ink text-paper px-3 py-1.5 hover:bg-accent transition-colors"
        >
          + add process
        </button>
      </div>

      {processes.length === 0 ? (
        <div className="font-mono text-2xs text-ink/35 border border-dashed border-ink/20 px-3 py-6 text-center">
          no processes queued — add one above to begin
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-ink/40 text-2xs border-b border-ink/15">
                <th className="text-left py-1.5 pr-3">pid</th>
                <th className="text-left py-1.5 pr-3">arrival</th>
                <th className="text-left py-1.5 pr-3">burst</th>
                {needsPriority && <th className="text-left py-1.5 pr-3">priority</th>}
                <th className="text-left py-1.5 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr key={p.id} className="border-b border-ink/8 hover:bg-ink/[0.03]">
                  <td className="py-1.5 pr-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 inline-block" style={{ backgroundColor: colorFor(p.id) }} />
                      {p.name}
                    </span>
                  </td>
                  <td className="py-1.5 pr-3">{p.arrival}</td>
                  <td className="py-1.5 pr-3">{p.burst}</td>
                  {needsPriority && <td className="py-1.5 pr-3">{p.priority}</td>}
                  <td className="py-1.5 pr-3 text-right">
                    <button
                      onClick={() => removeProcess(p.id)}
                      className="text-ink/35 hover:text-warn transition-colors"
                      aria-label={`remove ${p.name}`}
                    >
                      remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
