// SyncViz — Memory allocation engine (fixed partition scheme)

export const MEM_ALGORITHMS = [
  { key: 'first', label: 'First Fit' },
  { key: 'best', label: 'Best Fit' },
  { key: 'worst', label: 'Worst Fit' },
  { key: 'next', label: 'Next Fit' },
]

export function allocateMemory(blocksInput, processesInput, algoKey) {
  const blocks = blocksInput.map((b) => ({ ...b, used: false, allocatedProcess: null }))
  const results = []
  let lastIndex = 0

  processesInput.forEach((proc) => {
    let candidateIdx = -1

    if (algoKey === 'first') {
      candidateIdx = blocks.findIndex((b) => !b.used && b.size >= proc.size)
    } else if (algoKey === 'best') {
      let bestSize = Infinity
      blocks.forEach((b, idx) => {
        if (!b.used && b.size >= proc.size && b.size < bestSize) {
          bestSize = b.size
          candidateIdx = idx
        }
      })
    } else if (algoKey === 'worst') {
      let worstSize = -Infinity
      blocks.forEach((b, idx) => {
        if (!b.used && b.size >= proc.size && b.size > worstSize) {
          worstSize = b.size
          candidateIdx = idx
        }
      })
    } else if (algoKey === 'next') {
      const n = blocks.length
      for (let k = 0; k < n; k++) {
        const idx = (lastIndex + k) % n
        if (!blocks[idx].used && blocks[idx].size >= proc.size) {
          candidateIdx = idx
          break
        }
      }
    }

    if (candidateIdx === -1) {
      results.push({
        processId: proc.id,
        process: proc.name,
        size: proc.size,
        blockId: null,
        block: null,
        blockSize: null,
        fragmentation: null,
        status: 'not-allocated',
      })
    } else {
      blocks[candidateIdx].used = true
      blocks[candidateIdx].allocatedProcess = proc.name
      const frag = blocks[candidateIdx].size - proc.size
      results.push({
        processId: proc.id,
        process: proc.name,
        size: proc.size,
        blockId: blocks[candidateIdx].id,
        block: blocks[candidateIdx].name,
        blockSize: blocks[candidateIdx].size,
        fragmentation: frag,
        status: 'allocated',
      })
      if (algoKey === 'next') lastIndex = candidateIdx
    }
  })

  const totalBlockSize = blocks.reduce((s, b) => s + b.size, 0)
  const totalInternalFrag = results.reduce((s, r) => s + (r.fragmentation || 0), 0)
  const allocatedCount = results.filter((r) => r.status === 'allocated').length
  const unallocatedCount = results.length - allocatedCount

  return { results, blocks, totalBlockSize, totalInternalFrag, allocatedCount, unallocatedCount }
}
