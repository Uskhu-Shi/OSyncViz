export default function AllocationTable({ results, totalInternalFrag, allocatedCount, unallocatedCount }) {
  if (!results.length) return null

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 border border-ink/15 bg-panel p-4">
        <div className="font-mono text-2xs text-ink/40 mb-2">05 / ALLOCATION TABLE</div>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-ink/40 text-2xs border-b border-ink/15">
                <th className="text-left py-1.5 pr-3">process</th>
                <th className="text-left py-1.5 pr-3">size</th>
                <th className="text-left py-1.5 pr-3">block</th>
                <th className="text-left py-1.5 pr-3">block size</th>
                <th className="text-left py-1.5 pr-3">fragmentation</th>
                <th className="text-left py-1.5 pr-3">status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.processId} className="border-b border-ink/8">
                  <td className="py-1.5 pr-3 font-semibold">{r.process}</td>
                  <td className="py-1.5 pr-3">{r.size}kb</td>
                  <td className="py-1.5 pr-3">{r.block ?? '—'}</td>
                  <td className="py-1.5 pr-3">{r.blockSize ? `${r.blockSize}kb` : '—'}</td>
                  <td className="py-1.5 pr-3">{r.fragmentation !== null ? `${r.fragmentation}kb` : '—'}</td>
                  <td className="py-1.5 pr-3">
                    <span
                      className={
                        r.status === 'allocated'
                          ? 'text-good font-semibold'
                          : 'text-warn font-semibold'
                      }
                    >
                      {r.status === 'allocated' ? 'allocated' : 'not allocated'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-ink/15 bg-panel p-4">
        <div className="font-mono text-2xs text-ink/40 mb-3">06 / SUMMARY</div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="allocated" value={allocatedCount} />
          <Stat label="unallocated" value={unallocatedCount} />
          <Stat label="internal frag." value={`${totalInternalFrag}kb`} full />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, full }) {
  return (
    <div className={`border border-ink/15 px-3 py-2.5 ${full ? 'col-span-2' : ''}`}>
      <div className="font-mono text-2xs text-ink/40 mb-1">{label}</div>
      <div className="font-mono text-lg font-bold">{value}</div>
    </div>
  )
}
