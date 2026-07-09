import { colorFor } from '../../lib/colors.js'

function Cell({ value, ready }) {
  return ready ? (
    <span className="animate-fadeUp">{value}</span>
  ) : (
    <span className="text-ink/25">—</span>
  )
}

export default function MetricsPanel({ rows, needsPriority, currentTime, avgTAT, avgWT, avgRT, contextSwitches, isDone }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 border border-ink/15 bg-panel p-4">
        <div className="font-mono text-2xs text-ink/40 mb-2">04 / METRICS TABLE</div>
        {rows.length === 0 ? (
          <div className="font-mono text-2xs text-ink/35 border border-dashed border-ink/20 px-3 py-6 text-center">
            metrics populate once processes start completing
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
                  <th className="text-left py-1.5 pr-3">completion</th>
                  <th className="text-left py-1.5 pr-3">turnaround</th>
                  <th className="text-left py-1.5 pr-3">waiting</th>
                  <th className="text-left py-1.5 pr-3">response</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const ready = r.completion <= currentTime
                  return (
                    <tr key={r.id} className="border-b border-ink/8">
                      <td className="py-1.5 pr-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 inline-block" style={{ backgroundColor: colorFor(r.id) }} />
                          {r.name}
                        </span>
                      </td>
                      <td className="py-1.5 pr-3">{r.arrival}</td>
                      <td className="py-1.5 pr-3">{r.burst}</td>
                      {needsPriority && <td className="py-1.5 pr-3">{r.priority}</td>}
                      <td className="py-1.5 pr-3"><Cell value={r.completion} ready={ready} /></td>
                      <td className="py-1.5 pr-3"><Cell value={r.turnaround} ready={ready} /></td>
                      <td className="py-1.5 pr-3"><Cell value={r.waiting} ready={ready} /></td>
                      <td className="py-1.5 pr-3"><Cell value={r.response} ready={ready} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="border border-ink/15 bg-panel p-4">
        <div className="font-mono text-2xs text-ink/40 mb-3">05 / SUMMARY</div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="avg turnaround" value={avgTAT} ready={isDone} />
          <StatCard label="avg waiting" value={avgWT} ready={isDone} />
          <StatCard label="avg response" value={avgRT} ready={isDone} />
          <StatCard label="context switches" value={contextSwitches} ready={isDone} integer />
        </div>
        {!isDone && rows.length > 0 && (
          <p className="font-mono text-2xs text-ink/35 mt-3">
            finalizes once the gantt playback completes →
          </p>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, ready, integer }) {
  return (
    <div className="border border-ink/15 px-3 py-2.5">
      <div className="font-mono text-2xs text-ink/40 mb-1">{label}</div>
      <div className="font-mono text-lg font-bold">
        {ready ? (integer ? value : value.toFixed(2)) : <span className="text-ink/25">—</span>}
      </div>
    </div>
  )
}
