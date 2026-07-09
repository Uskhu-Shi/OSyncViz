# OSyncViz

An interactive OS visualiser for **CPU scheduling** and **memory allocation** algorithms, built with React + Vite + Tailwind. Everything runs client-side — add processes, pick an algorithm, and watch the Gantt chart execute block by block with pause/resume/step controls, a live-filling metrics table, and final summary stats.

## Features

**CPU Scheduling tab**
- Algorithms: FCFS, SJF/SRTF, Priority, LJF/LRTF, HRRN, Round Robin
- Preemptive / Non-preemptive slide switch for algorithms that support both (SJF, Priority, LJF)
- Time quantum input appears only for Round Robin
- Priority input field appears only for Priority scheduling
- Add / remove individual processes or clear all
- Full-width horizontal Gantt chart, revealed block-by-block with **play / pause / resume / step forward / step back / reset**
- Metrics table (arrival, burst, priority, completion, turnaround, waiting, response time) fills in live as playback reaches each process's completion
- Final summary: average turnaround time, average waiting time, average response time, context-switch count

**Memory Allocation tab**
- Algorithms: First Fit, Best Fit, Worst Fit, Next Fit
- Add / remove memory blocks (partitions) and incoming process requests
- Allocation table + a visual memory map showing occupied space, internal fragmentation, and free blocks

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. Build for production with:

```bash
npm run build
npm run preview
```


The engine simulates time in 1-unit steps. At each free-CPU decision point it filters processes that have arrived and still have remaining burst, then selects the next one using an algorithm-specific comparator (shortest remaining time, priority, longest remaining time, response ratio, etc). Preemptive algorithms re-evaluate every unit and merge consecutive same-process units into a single Gantt block; non-preemptive algorithms run the chosen process to completion. Round Robin uses a proper FIFO ready-queue with quantum slicing. This keeps completion/turnaround/waiting/response times correct even with idle gaps between arrivals.
