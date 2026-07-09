import { useState } from 'react'
import TopTabs from './components/TopTabs.jsx'
import CpuTab from './components/cpu/CpuTab.jsx'
import MemoryTab from './components/memory/MemoryTab.jsx'

export default function App() {
  const [tab, setTab] = useState('cpu')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/15 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-ink/70 flex items-center justify-center font-mono text-sm font-bold">
            SV
          </div>
          <div>
            <h1 className="font-mono text-base sm:text-lg font-bold tracking-tight leading-none">
              SyncViz
              <span className="ml-1 inline-block w-[7px] h-[13px] bg-accent align-middle animate-cursorBlink" />
            </h1>
            <p className="font-mono text-2xs text-ink/45 leading-none mt-1">
              cpu scheduling &amp; memory allocation, simulated block-by-block
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-2xs text-ink/40">
          <span className="w-2 h-2 rounded-full bg-good inline-block" />
          engine ready
        </div>
      </header>

      <TopTabs active={tab} onChange={setTab} />

      <main className="flex-1 px-4 sm:px-6 py-6">
        {tab === 'cpu' ? <CpuTab /> : <MemoryTab />}
      </main>

      <footer className="border-t border-ink/15 px-4 sm:px-6 py-3 font-mono text-2xs text-ink/35 flex justify-between">
        <span>SyncViz — OS visualiser</span>
        <span>time unit = 1</span>
      </footer>
    </div>
  )
}
