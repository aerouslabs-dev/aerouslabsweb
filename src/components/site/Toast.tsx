import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

type Toast = { id: number; message: string }

const ToastContext = createContext<{ push: (message: string) => void } | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }, [])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-xl px-4 py-3 flex items-center gap-2.5 shadow-2xl shadow-cyan-500/10 max-w-sm"
            >
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span className="text-sm text-slate-100">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
