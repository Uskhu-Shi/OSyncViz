// Deterministic palette so a process id always maps to the same color across
// the Gantt chart, table highlights and memory bars.
const PALETTE = [
  '#215C47', // deep terminal green
  '#B05228', // burnt signal orange
  '#2B4C7E', // ink blue
  '#8A3B5C', // plum
  '#6B7A2A', // olive
  '#5B4B8A', // violet
  '#1E7A87', // teal
  '#9C5B14', // amber brown
  '#4A4A4A', // graphite
  '#A13D3D', // brick red
]

export function colorFor(id) {
  const n = typeof id === 'number' ? id : Math.abs(String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0))
  return PALETTE[n % PALETTE.length]
}
