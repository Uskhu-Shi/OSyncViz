// SyncViz — CPU scheduling engine
// Every algorithm resolves to a Gantt block list + per-process metrics table.

export const ALGORITHMS = [
  { key: 'fcfs', label: 'FCFS — First Come First Serve', needsPriority: false, preemptToggle: false, needsQuantum: false, forcedPreemptive: false },
  { key: 'sjf', label: 'SJF / SRTF — Shortest Job / Remaining Time', needsPriority: false, preemptToggle: true, needsQuantum: false, forcedPreemptive: false },
  { key: 'priority', label: 'Priority Scheduling', needsPriority: true, preemptToggle: true, needsQuantum: false, forcedPreemptive: false },
  { key: 'ljf', label: 'LJF / LRTF — Longest Job / Remaining Time', needsPriority: false, preemptToggle: true, needsQuantum: false, forcedPreemptive: false },
  { key: 'hrrn', label: 'HRRN — Highest Response Ratio Next', needsPriority: false, preemptToggle: false, needsQuantum: false, forcedPreemptive: false },
  { key: 'rr', label: 'Round Robin (Preemptive)', needsPriority: false, preemptToggle: false, needsQuantum: true, forcedPreemptive: true },
]

export function getAlgoMeta(key) {
  return ALGORITHMS.find((a) => a.key === key) || ALGORITHMS[0]
}

function pickNext(candidates, algoKey, time) {
  const arr = [...candidates]
  switch (algoKey) {
    case 'fcfs':
      arr.sort((a, b) => a.arrival - b.arrival || a.id - b.id)
      break
    case 'sjf':
      arr.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival || a.id - b.id)
      break
    case 'priority':
      arr.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival || a.id - b.id)
      break
    case 'ljf':
      arr.sort((a, b) => b.remaining - a.remaining || a.arrival - b.arrival || a.id - b.id)
      break
    case 'hrrn': {
      const ratio = (p) => ((time - p.arrival) + p.burst) / p.burst
      arr.sort((a, b) => ratio(b) - ratio(a) || a.arrival - b.arrival || a.id - b.id)
      break
    }
    default:
      arr.sort((a, b) => a.arrival - b.arrival || a.id - b.id)
  }
  return arr[0]
}

function buildResult(procs, gantt, contextSwitches) {
  const rows = procs.map((p) => {
    const turnaround = p.completion - p.arrival
    const waiting = turnaround - p.burst
    const response = p.firstStart - p.arrival
    return {
      id: p.id,
      name: p.name,
      arrival: p.arrival,
      burst: p.burst,
      priority: p.priority,
      completion: p.completion,
      turnaround,
      waiting,
      response,
    }
  })
  const n = rows.length || 1
  const avgTAT = rows.reduce((s, r) => s + r.turnaround, 0) / n
  const avgWT = rows.reduce((s, r) => s + r.waiting, 0) / n
  const avgRT = rows.reduce((s, r) => s + r.response, 0) / n
  const totalTime = gantt.length ? gantt[gantt.length - 1].end : 0
  return { gantt, rows, avgTAT, avgWT, avgRT, contextSwitches, totalTime }
}

function simulateRR(procsInput, quantum) {
  const procs = procsInput.map((p) => ({ ...p, remaining: p.burst, completion: null, firstStart: null }))
  const sorted = [...procs].sort((a, b) => a.arrival - b.arrival || a.id - b.id)
  let time = sorted[0].arrival
  let queue = []
  let i = 0
  const gantt = []
  let completedCount = 0
  const n = procs.length
  let contextSwitches = 0
  let lastId = null

  const pushArrivals = (t) => {
    while (i < sorted.length && sorted[i].arrival <= t) {
      queue.push(sorted[i])
      i++
    }
  }
  pushArrivals(time)

  while (completedCount < n) {
    if (queue.length === 0) {
      const nextArrival = sorted[i].arrival
      gantt.push({ id: 'idle', label: 'IDLE', start: time, end: nextArrival })
      time = nextArrival
      pushArrivals(time)
      continue
    }
    const proc = queue.shift()
    if (proc.firstStart === null) proc.firstStart = time
    const run = Math.min(quantum, proc.remaining)
    const start = time
    time += run
    proc.remaining -= run
    pushArrivals(time)
    gantt.push({ id: proc.id, label: proc.name, start, end: time })
    if (lastId !== null && lastId !== proc.id) contextSwitches++
    lastId = proc.id
    if (proc.remaining > 0) {
      queue.push(proc)
    } else {
      proc.completion = time
      completedCount++
    }
  }
  return buildResult(procs, gantt, contextSwitches)
}

export function simulateCPU(processesInput, algoKey, preemptive, quantum) {
  if (!processesInput.length) return { gantt: [], rows: [], avgTAT: 0, avgWT: 0, avgRT: 0, contextSwitches: 0, totalTime: 0 }

  if (algoKey === 'rr') {
    return simulateRR(processesInput, Math.max(1, Number(quantum) || 1))
  }

  const procs = processesInput.map((p) => ({ ...p, remaining: p.burst, completion: null, firstStart: null }))
  const n = procs.length
  let time = Math.min(...procs.map((p) => p.arrival))
  const gantt = []
  let completedCount = 0
  let contextSwitches = 0
  let lastRunId = null

  const isPreemptive = algoKey === 'hrrn' || algoKey === 'fcfs' ? false : !!preemptive

  while (completedCount < n) {
    const candidates = procs.filter((p) => p.arrival <= time && p.remaining > 0)
    if (candidates.length === 0) {
      const nextArrival = Math.min(...procs.filter((p) => p.remaining > 0).map((p) => p.arrival))
      if (gantt.length && gantt[gantt.length - 1].id === 'idle') {
        gantt[gantt.length - 1].end = nextArrival
      } else {
        gantt.push({ id: 'idle', label: 'IDLE', start: time, end: nextArrival })
      }
      time = nextArrival
      continue
    }

    const chosen = pickNext(candidates, algoKey, time)
    if (chosen.firstStart === null) chosen.firstStart = time

    if (isPreemptive) {
      const last = gantt[gantt.length - 1]
      if (last && last.id === chosen.id && last.end === time) {
        last.end = time + 1
      } else {
        gantt.push({ id: chosen.id, label: chosen.name, start: time, end: time + 1 })
        if (lastRunId !== null && lastRunId !== chosen.id) contextSwitches++
      }
      lastRunId = chosen.id
      chosen.remaining -= 1
      time += 1
      if (chosen.remaining === 0) {
        chosen.completion = time
        completedCount++
      }
    } else {
      const start = time
      time += chosen.remaining
      chosen.remaining = 0
      chosen.completion = time
      completedCount++
      gantt.push({ id: chosen.id, label: chosen.name, start, end: time })
      if (lastRunId !== null && lastRunId !== chosen.id) contextSwitches++
      lastRunId = chosen.id
    }
  }

  return buildResult(procs, gantt, contextSwitches)
}
