import { useState } from 'react'
import BlockManager from './BlockManager.jsx'
import ProcessMemManager from './ProcessMemManager.jsx'
import MemoryVisual from './MemoryVisual.jsx'
import AllocationTable from './AllocationTable.jsx'
import { MEM_ALGORITHMS, allocateMemory } from '../../lib/memoryAlgorithms.js'

const SEED_BLOCKS = [
  { id: 1, name: 'B1', size: 100 },
  { id: 2, name: 'B2', size: 500 },
  { id: 3, name: 'B3', size: 200 },
  { id: 4, name: 'B4', size: 300 },
  { id: 5, name: 'B5', size: 600 },
]

const SEED_PROCESSES = [
  { id: 1, name: 'M1', size: 212 },
  { id: 2, name: 'M2', size: 417 },
  { id: 3, name: 'M3', size: 112 },
  { id: 4, name: 'M4', size: 426 },
]

export default function MemoryTab() {
  const [blocks, setBlocks] = useState(SEED_BLOCKS)
  const [nextBlockId, setNextBlockId] = useState(6)

  const [processes, setProcesses] = useState(SEED_PROCESSES)
  const [nextProcId, setNextProcId] = useState(5)

  const [algoKey, setAlgoKey] = useState('first')
  const [result, setResult] = useState(null)

  const addBlock = (size) => {
    setBlocks((prev) => [...prev, { id: nextBlockId, name: `B${nextBlockId}`, size }])
    setNextBlockId((n) => n + 1)
  }
  const removeBlock = (id) => setBlocks((prev) => prev.filter((b) => b.id !== id))
  const clearBlocks = () => setBlocks([])

  const addProcess = (size) => {
    setProcesses((prev) => [...prev, { id: nextProcId, name: `M${nextProcId}`, size }])
    setNextProcId((n) => n + 1)
  }
  const removeProcess = (id) => setProcesses((prev) => prev.filter((p) => p.id !== id))
  const clearAll = () => setProcesses([])

  const runSimulate = () => {
    setResult(allocateMemory(blocks, processes, algoKey))
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1400px] mx-auto">
      <div className="border border-ink/15 bg-panel p-4">
        <div className="font-mono text-2xs text-ink/40 mb-2">01 / ALGORITHM</div>
        <label className="flex flex-col gap-1 w-fit">
          <span className="font-mono text-2xs text-ink/50">select allocation strategy</span>
          <select
            value={algoKey}
            onChange={(e) => setAlgoKey(e.target.value)}
            className="font-mono text-xs sm:text-sm border border-ink/40 bg-paper px-2 py-2 min-w-[220px] focus:outline-none focus:border-accent"
          >
            {MEM_ALGORITHMS.map((a) => (
              <option key={a.key} value={a.key}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <BlockManager blocks={blocks} addBlock={addBlock} removeBlock={removeBlock} clearBlocks={clearBlocks} />
      <ProcessMemManager processes={processes} addProcess={addProcess} removeProcess={removeProcess} clearAll={clearAll} />

      <div className="flex justify-end">
        <button
          onClick={runSimulate}
          disabled={!blocks.length || !processes.length}
          className="font-mono text-xs sm:text-sm bg-accent text-paper px-5 py-2.5 hover:bg-ink transition-colors disabled:opacity-30 disabled:hover:bg-accent"
        >
          ▶ simulate
        </button>
      </div>

      {result && (
        <>
          <MemoryVisual blocks={result.blocks} results={result.results} />
          <AllocationTable
            results={result.results}
            totalInternalFrag={result.totalInternalFrag}
            allocatedCount={result.allocatedCount}
            unallocatedCount={result.unallocatedCount}
          />
        </>
      )}
    </div>
  )
}
