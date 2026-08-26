import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { TerminalWindow } from './TerminalWindow'
import { NodeNetwork } from './NodeNetwork'
import { ContactStudioButton } from './Navbar'

export function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section id="top" className="relative overflow-hidden bg-grid-lines">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-float" />
        <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl animate-float [animation-delay:2s]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030712]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-slate-300"
            >
              <Sparkles size={13} className="text-cyan-300" />
              A startup project by Aerous Labs
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-balance break-normal text-4xl font-bold leading-[1.12] tracking-tight text-slate-50 sm:text-5xl md:text-6xl [text-wrap:balance]"
              style={{ wordBreak: 'keep-all', overflowWrap: 'break-word', hyphens: 'none' }}
            >
              <span className="text-gradient-aerous">{title}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <ContactStudioButton />
              <a
                href="#showcase"
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
              >
                View Showcase
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <TerminalWindow />
            <div className="glass-card hidden w-full max-w-md rounded-2xl p-3 sm:block">
              <NodeNetwork />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
