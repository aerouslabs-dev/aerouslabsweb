import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Rocket } from 'lucide-react'

export function AnnouncementBanner({ text, link, enabled }: { text: string; link?: string | null; enabled: boolean }) {
  const [dismissed, setDismissed] = useState(false)
  if (!enabled || !text || dismissed) return null

  const content = (
    <span className="inline-flex items-center gap-2 truncate">
      <Rocket size={14} className="shrink-0 text-cyan-300" />
      <span className="truncate">{text}</span>
    </span>
  )

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-40 w-full border-b border-white/5 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-cyan-500/10"
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 text-xs font-medium text-slate-200 sm:text-sm">
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors truncate">
            {content}
          </a>
        ) : (
          content
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-3 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  )
}

export function StatusRow({ label }: { label: string }) {
  const [ping, setPing] = useState<number | null>(null)

  useEffect(() => {
    const measure = async () => {
      const start = performance.now()
      try {
        await fetch('/favicon.svg', { cache: 'no-store', method: 'HEAD' })
      } catch {
        /* offline is fine, keep last value */
      }
      setPing(Math.max(1, Math.round(performance.now() - start)))
    }
    measure()
    const interval = setInterval(measure, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative z-30 w-full border-b border-white/5 bg-[#030712]/80">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-4 text-[11px] sm:text-xs">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400">
          Ping: <span className="text-cyan-300 font-medium">{ping ?? '—'}ms</span>
        </span>
      </div>
    </div>
  )
}
