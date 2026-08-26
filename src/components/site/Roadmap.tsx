import { motion } from 'framer-motion'
import { CheckCircle2, CircleDot, Circle, Map } from 'lucide-react'
import { SectionHeading, EmptyState } from './AppsShowcase'
import type { RoadmapItem } from '@/lib/types'

const STATUS_ICON: Record<string, React.ReactNode> = {
  Completed: <CheckCircle2 size={18} className="text-emerald-400" />,
  'In Progress': <CircleDot size={18} className="text-cyan-300" />,
  Planned: <Circle size={18} className="text-slate-500" />,
}

export function Roadmap({ items }: { items: RoadmapItem[] }) {
  return (
    <section id="roadmap" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Roadmap"
        title="Where Aerous Labs is heading next"
        description="Versioned milestones tracked openly, from early planning to shipped releases."
      />

      {items.length === 0 ? (
        <EmptyState icon={<Map size={28} className="text-slate-500" />} title="No data yet" message="The roadmap is being drafted — check back soon." />
      ) : (
        <div className="mt-12 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card flex items-start gap-4 rounded-xl p-5"
            >
              <div className="mt-0.5">{STATUS_ICON[item.status] ?? STATUS_ICON.Planned}</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-100">{item.title}</h3>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10.5px] font-mono text-cyan-300">
                    {item.version}
                  </span>
                  <span className="text-[11px] text-slate-500">{item.status}</span>
                </div>
                {item.description && <p className="mt-1.5 text-sm text-slate-400">{item.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
