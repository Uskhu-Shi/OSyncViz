export default function TopTabs({ active, onChange }) {
  const tabs = [
    { key: 'cpu', label: 'CPU Scheduling', code: '01' },
    { key: 'memory', label: 'Memory Allocation', code: '02' },
  ]
  return (
    <div className="flex items-end gap-1 border-b border-ink/15 px-4 sm:px-6">
      {tabs.map((t) => {
        const isActive = active === t.key
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              'group relative px-4 py-3 font-mono text-xs sm:text-sm tracking-tight transition-colors',
              isActive ? 'text-ink' : 'text-ink/40 hover:text-ink/70',
            ].join(' ')}
          >
            <span className="mr-2 text-2xs text-ink/35">{t.code}</span>
            {t.label}
            <span
              className={[
                'absolute left-0 right-0 -bottom-px h-[2px] transition-transform origin-left',
                isActive ? 'bg-accent scale-x-100' : 'bg-accent scale-x-0 group-hover:scale-x-50',
              ].join(' ')}
            />
          </button>
        )
      })}
    </div>
  )
}
