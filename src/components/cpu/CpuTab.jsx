import { useEffect, useRef, useState } from 'react'
import AlgoConfig from './AlgoConfig.jsx'
import ProcessManager from './ProcessManager.jsx'
import Gantt from './Gantt.jsx'
import MetricsPanel from './MetricsPanel.jsx'
import { simulateCPU, getAlgoMeta } from '../../lib/cpuAlgorithms.js'

const SEED_PROCESSES = [
  { id: 1, name: 'P1', arrival: 0, burst: 5, priority: 2 },
  { id: 2, name: 'P2', arrival: 1, burst: 3, priority: 1 },
  { id: 3, name: 'P3', arrival: 2, burst: 8, priority: 3 },
  { id: 4, name: 'P4', arrival: 3, burst: 6, priority: 2 },
]

const PLAY_INTERVAL_MS = 550

export default function CpuTab() {
  const [processes, setProcesses] = useState(SEED_PROCESSES)
  const [nextId, setNextId] = useState(5)

  const [algoKey, setAlgoKey] = useState('fcfs')
  const [preemptive, setPreemptive] = useState(false)
  const [quantum, setQuantum] = useState(2)

  const [result, setResult] = useState(null)
  const [revealCount, setRevealCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  const meta = getAlgoMeta(algoKey)

  const addProcess = ({ arrival, burst, priority }) => {
    setProcesses((prev) => [...prev, { id: nextId, name: `P${nextId}`, arrival, burst, priority }])
    setNextId((n) => n + 1)
  }
  const removeProcess = (id) => setProcesses((prev) => prev.filter((p) => p.id !== id))
  const clearAll = () => setProcesses([])

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const runSimulate = () => {
    stopInterval()
    setIsPlaying(false)
    const r = simulateCPU(processes, algoKey, preemptive, quantum)
    setResult(r)
    setRevealCount(0)
  }

  const handlePlayPause = () => {
    if (!result || result.gantt.length === 0) return
    if (revealCount >= result.gantt.length) {
      setRevealCount(0)
      setIsPlaying(true)
      return
    }
    setIsPlaying((p) => !p)
  }

  const handleReset = () => {
    stopInterval()
    setIsPlaying(false)
    setRevealCount(0)
  }

  const handleStepBack = () => {
    stopInterval()
    setIsPlaying(false)
    setRevealCount((c) => Math.max(0, c - 1))
  }

  const handleStepFwd = () => {
    if (!result) return
    stopInterval()
    setIsPlaying(false)
    setRevealCount((c) => Math.min(result.gantt.length, c + 1))
  }

  useEffect(() => {
    if (isPlaying && result) {
      intervalRef.current = setInterval(() => {
        setRevealCount((c) => {
          if (c + 1 >= result.gantt.length) {
            stopInterval()
            setIsPlaying(false)
            return result.gantt.length
          }
          return c + 1
        })
      }, PLAY_INTERVAL_MS)
    }
    return stopInterval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, result])

  useEffect(() => stopInterval, [])

  const gantt = result?.gantt || []
  const rows = result?.rows || []
  const isDone = result ? revealCount >= gantt.length && gantt.length > 0 : false
  const currentTime = result
    ? revealCount > 0
      ? gantt[revealCount - 1].end
      : 0
    : 0

  return (
    <div className="flex flex-col gap-4 max-w-[1400px] mx-auto">
      <AlgoConfig
        algoKey={algoKey}
        setAlgoKey={setAlgoKey}
        preemptive={preemptive}
        setPreemptive={setPreemptive}
        quantum={quantum}
        setQuantum={setQuantum}
      />

      <ProcessManager
        processes={processes}
        addProcess={addProcess}
        removeProcess={removeProcess}
        clearAll={clearAll}
        needsPriority={meta.needsPriority}
      />

      <div className="flex justify-end">
        <button
          onClick={runSimulate}
          disabled={processes.length === 0}
          className="font-mono text-xs sm:text-sm bg-accent text-paper px-5 py-2.5 hover:bg-ink transition-colors disabled:opacity-30 disabled:hover:bg-accent"
        >
          ▶ simulate
        </button>
      </div>

      <Gantt
        gantt={gantt}
        revealCount={revealCount}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        onStepBack={handleStepBack}
        onStepFwd={handleStepFwd}
      />

      <MetricsPanel
        rows={rows}
        needsPriority={meta.needsPriority}
        currentTime={currentTime}
        avgTAT={result?.avgTAT || 0}
        avgWT={result?.avgWT || 0}
        avgRT={result?.avgRT || 0}
        contextSwitches={result?.contextSwitches || 0}
        isDone={isDone}
      />
    </div>
  )
}
