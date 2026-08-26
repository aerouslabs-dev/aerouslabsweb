import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINES = [
  { prompt: '$', text: 'aerous init --model local-orchestrator', delay: 40 },
  { prompt: '>', text: 'Loading Claude · Gemini · Cursor adapters...', delay: 22 },
  { prompt: '>', text: 'Weighted allocation graph compiled ✓', delay: 22 },
  { prompt: '>', text: 'Zero-latency on-device inference ready.', delay: 22 },
  { prompt: '$', text: 'deploy --target production', delay: 40 },
  { prompt: '>', text: 'Aerous Systems 100% Operational.', delay: 22 },
]

export function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    if (lineIdx >= LINES.length) {
      const reset = setTimeout(() => {
        setVisibleLines([])
        setLineIdx(0)
        setCharIdx(0)
      }, 2600)
      return () => clearTimeout(reset)
    }
    const current = LINES[lineIdx]
    if (charIdx <= current.text.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), current.delay)
      return () => clearTimeout(t)
    }
    const advance = setTimeout(() => {
      setVisibleLines((v) => [...v, current.text])
      setLineIdx((i) => i + 1)
      setCharIdx(0)
    }, 380)
    return () => clearTimeout(advance)
  }, [lineIdx, charIdx])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/5"
    >
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-2 text-xs text-slate-500">aerous-labs — orchestrator.sh</span>
      </div>
      <div className="h-56 space-y-1.5 p-4 font-mono text-[12.5px] leading-relaxed">
        {visibleLines.map((line, i) => (
          <div key={i} className="text-slate-400">
            <span className="text-emerald-400">{LINES[i].prompt}</span> {line}
          </div>
        ))}
        {lineIdx < LINES.length && (
          <div className="text-slate-200">
            <span className="text-emerald-400">{LINES[lineIdx].prompt}</span>{' '}
            {LINES[lineIdx].text.slice(0, charIdx)}
            <span className="animate-blink inline-block h-3.5 w-1.5 translate-y-0.5 bg-cyan-300 ml-0.5" />
          </div>
        )}
      </div>
    </motion.div>
  )
}
