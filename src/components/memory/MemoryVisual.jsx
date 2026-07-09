import { colorFor } from '../../lib/colors.js'

export default function MemoryVisual({ blocks, results }) {
  if (!blocks.length) return null
  const maxSize = Math.max(...blocks.map((b) => b.size), 1)

  return (
    <div className="border border-ink/15 bg-panel p-4">
      <div className="font-mono text-2xs text-ink/40 mb-3">04 / MEMORY MAP</div>
      <div className="flex flex-col gap-2.5">
        {blocks.map((b) => {
          const res = results.find((r) => r.blockId === b.id)
          const usedPct = res ? (res.size / b.size) * 100 : 0
          const widthPct = (b.size / maxSize) * 100
          return (
            <div key={b.id} className="flex items-center gap-3">
              <div className="font-mono text-2xs text-ink/50 w-20 shrink-0">
                {b.name}
                <div className="text-ink/35">{b.size}kb</div>
              </div>
              <div className="flex-1 h-9 border border-ink/25 relative bg-ink/[0.04]" style={{ width: `${widthPct}%` }}>
                {res ? (
                  <>
                    <div
                      className="h-full flex items-center justify-center font-mono text-2xs text-paper font-semibold overflow-hidden"
                      style={{ width: `${usedPct}%`, backgroundColor: colorFor(res.processId) }}
                      title={`${res.process} — ${res.size}kb`}
                    >
                      {usedPct > 14 ? res.process : ''}
                    </div>
                    {usedPct < 100 && (
                      <div
                        className="absolute top-0 right-0 h-full flex items-center justify-center font-mono text-2xs text-ink/40"
                        style={{
                          width: `${100 - usedPct}%`,
                          backgroundImage:
                            'repeating-linear-gradient(45deg, rgb(0 0 0 / 0.06) 0, rgb(0 0 0 / 0.06) 4px, transparent 4px, transparent 10px)',
                        }}
                      >
                        {100 - usedPct > 14 ? `frag ${b.size - res.size}kb` : ''}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center font-mono text-2xs text-ink/30">free</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
