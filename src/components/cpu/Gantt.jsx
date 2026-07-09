import { colorFor } from '../../lib/colors.js'

const PX_PER_UNIT = 34
const MIN_PX_PER_UNIT = 18

export default function Gantt({ gantt, revealCount, isPlaying, onPlayPause, onReset, onStepBack, onStepFwd }) {
  const totalTime = gantt.length ? gantt[gantt.length - 1].end : 0
  const visible = gantt.slice(0, revealCount)
  const currentTime = visible.length ? visible[visible.length - 1].end : gantt.length ? gantt[0].start : 0
  const px = totalTime > 40 ? MIN_PX_PER_UNIT : PX_PER_UNIT
  const isDone = revealCount >= gantt.length && gantt.length > 0

  return (
    <div className="border border-ink/15 bg-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="font-mono text-2xs text-ink/40">03 / GANTT — LIVE EXECUTION</div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs text-ink/50">
            t = <span className="text-ink font-semibold">{currentTime}</span>
            {totalTime ? <span className="text-ink/35"> / {totalTime}</span> : null}
          </span>
          <div className="w-px h-4 bg-ink/15" />
          <button
            onClick={onStepBack}
            disabled={revealCount <= 0}
            className="font-mono text-2xs border border-ink/30 w-7 h-7 flex items-center justify-center hover:border-accent disabled:opacity-30"
            aria-label="step back"
            title="step back"
          >
            «
          </button>
          <button
            onClick={onPlayPause}
            disabled={gantt.length === 0}
            className="font-mono text-2xs border border-ink/60 px-3 h-7 flex items-center gap-1 bg-ink text-paper hover:bg-accent transition-colors disabled:opacity-30 disabled:bg-ink"
          >
            {isPlaying ? '❚❚ pause' : isDone ? '↻ replay' : '▶ resume'}
          </button>
          <button
            onClick={onStepFwd}
            disabled={revealCount >= gantt.length}
            className="font-mono text-2xs border border-ink/30 w-7 h-7 flex items-center justify-center hover:border-accent disabled:opacity-30"
            aria-label="step forward"
            title="step forward"
          >
            »
          </button>
          <div className="w-px h-4 bg-ink/15" />
          <button
            onClick={onReset}
            disabled={gantt.length === 0}
            className="font-mono text-2xs border border-ink/30 px-2 h-7 text-ink/60 hover:border-warn hover:text-warn disabled:opacity-30"
          >
            ⟲ reset
          </button>
        </div>
      </div>

      {gantt.length === 0 ? (
        <div className="font-mono text-2xs text-ink/35 border border-dashed border-ink/20 px-3 py-10 text-center">
          run a simulation to render the execution timeline
        </div>
      ) : (
        <div className="overflow-x-auto pb-1">
          <div className="inline-block min-w-full">
            <div className="flex border border-ink/25">
              {visible.map((b, i) => {
                const width = Math.max(2, (b.end - b.start) * px)
                const isIdle = b.id === 'idle'
                return (
                  <div
                    key={`${b.id}-${b.start}-${i}`}
                    style={{
                      width,
                      backgroundColor: isIdle ? 'transparent' : colorFor(b.id),
                      backgroundImage: isIdle
                        ? 'repeating-linear-gradient(45deg, rgb(0 0 0 / 0.08) 0, rgb(0 0 0 / 0.08) 4px, transparent 4px, transparent 10px)'
                        : undefined,
                    }}
                    className="h-14 flex items-center justify-center border-r border-paper/50 last:border-r-0 font-mono text-2xs font-semibold text-paper animate-blockIn shrink-0 overflow-hidden"
                    title={`${isIdle ? 'IDLE' : b.label} [${b.start} → ${b.end}]`}
                  >
                    {width > 26 ? (isIdle ? 'idle' : b.label) : ''}
                  </div>
                )
              })}
              {revealCount < gantt.length && (
                <div className="flex-1 min-w-[24px] bg-ink/[0.04] flex items-center justify-center">
                  <span className="w-1.5 h-3 bg-ink/20 animate-cursorBlink" />
                </div>
              )}
            </div>

            <div className="flex mt-0.5">
              <span className="font-mono text-xs text-ink/40 w-6 text-right shrink-0 pt-1">
                {visible.length ? visible[0].start : 0}
              </span>
              {visible.map((b, i) => (
                <span
                  key={`tick-${i}`}
                  style={{ width: Math.max(2, (b.end - b.start) * px) }}
                  className="font-mono text-xs text-ink/40 text-right shrink-0 pt-1"
                >
                  {b.end}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
