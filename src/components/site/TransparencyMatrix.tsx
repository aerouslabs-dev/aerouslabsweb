import { motion } from 'framer-motion'
import { Activity, BarChart3 } from 'lucide-react'
import { SectionHeading, EmptyState } from './AppsShowcase'
import type { Matrix } from '@/lib/types'

export function TransparencyMatrix({ matrix }: { matrix: Matrix }) {
  return (
    <section id="transparency" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Tech Transparency"
        title="Real-time AI tool allocation matrix"
        description="A live, weighted average of every model and tool contributing to Aerous Labs' shipped software — recomputed automatically as the showcase evolves."
      />

      {!matrix.hasData ? (
        <EmptyState
          icon={<BarChart3 size={28} className="text-slate-500" />}
          title="No data yet"
          message="Tool allocations will appear here as soon as apps are published with tracked contributions."
        />
      ) : (
        <div className="glass-card mt-12 rounded-2xl p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
            <Activity size={14} className="text-emerald-400" />
            Weighted across {matrix.appCount} active showcase app{matrix.appCount === 1 ? '' : 's'}
          </div>
          <div className="space-y-5">
            {matrix.entries
              .slice()
              .sort((a, b) => b.weightedPercentage - a.weightedPercentage)
              .map((entry, i) => (
                <div key={entry.toolId}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-200">{entry.name}</span>
                    <span className="font-mono text-cyan-300">{entry.weightedPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, entry.weightedPercentage)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${entry.color}, #10B981)` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  )
}
