import { motion } from 'framer-motion'

const NODES = [
  { id: 'core', x: 150, y: 100, r: 14, label: 'Core' },
  { id: 'claude', x: 40, y: 30, r: 9, label: 'Claude' },
  { id: 'gemini', x: 260, y: 30, r: 9, label: 'Gemini' },
  { id: 'cursor', x: 40, y: 175, r: 9, label: 'Cursor' },
  { id: 'local', x: 260, y: 175, r: 9, label: 'On-Device' },
]

const EDGES: [string, string][] = [
  ['core', 'claude'],
  ['core', 'gemini'],
  ['core', 'cursor'],
  ['core', 'local'],
]

function findNode(id: string) {
  return NODES.find((n) => n.id === id)!
}

export function NodeNetwork() {
  return (
    <svg viewBox="0 0 300 210" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {EDGES.map(([a, b], i) => {
        const na = findNode(a)
        const nb = findNode(b)
        return (
          <line
            key={i}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke="url(#edge-grad)"
            strokeWidth={1.5}
            className="animate-dash"
          />
        )
      })}
      {NODES.map((n, i) => (
        <g key={n.id}>
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.id === 'core' ? '#00F2FE' : '#0B132B'}
            stroke={n.id === 'core' ? '#00F2FE' : '#10B981'}
            strokeWidth={1.5}
            initial={{ scale: 0.85, opacity: 0.7 }}
            animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
          />
          <text
            x={n.x}
            y={n.y + n.r + 13}
            textAnchor="middle"
            fontSize="9"
            fill="#94a3b8"
            fontFamily="monospace"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
