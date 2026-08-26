import { motion } from 'framer-motion'
import { ExternalLink, Package, Sparkle } from 'lucide-react'
import { TiltCard } from './TiltCard'
import type { ShowcaseApp, Tool } from '@/lib/types'

const STATUS_STYLES: Record<string, string> = {
  Production: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  Beta: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
  'In Development': 'bg-amber-400/10 text-amber-300 border-amber-400/20',
}

export function AppsShowcase({ apps, tools }: { apps: ShowcaseApp[]; tools: Tool[] }) {
  return (
    <section id="showcase" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Product Showcase"
        title="Software crafted for real-world precision"
        description="Every release below is tracked with live version numbers, classification, and its exact AI tool allocation."
      />

      {apps.length === 0 ? (
        <EmptyState
          icon={<Package size={28} className="text-slate-500" />}
          title="No data yet"
          message="No apps have been published from the Admin Panel yet. Check back soon."
        />
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {app.imageKey ? (
                      <img
                        src={`/api/image/${app.imageKey}`}
                        alt={app.name}
                        className="h-12 w-12 rounded-xl border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                        <Sparkle size={20} className="text-cyan-300" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-50">{app.name}</h3>
                      <span className="text-xs text-slate-500">{app.category}</span>
                    </div>
                  </div>
                </div>

                <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">{app.tagline}</p>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[app.status] ?? 'border-white/10 bg-white/5 text-slate-300'}`}
                  >
                    {app.status}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-400">
                    {app.nature}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-mono text-cyan-300">
                    {app.version}
                  </span>
                </div>

                {app.allocations.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {app.allocations.map((a) => {
                      const tool = tools.find((t) => t.id === a.toolId)
                      if (!tool) return null
                      return (
                        <span
                          key={a.toolId}
                          className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10.5px] text-slate-400"
                          style={{ borderLeft: `2px solid ${tool.color}` }}
                        >
                          {tool.name} {a.percentage}%
                        </span>
                      )
                    })}
                  </div>
                )}

                {app.link && (
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                  >
                    Open App <ExternalLink size={13} />
                  </a>
                )}
              </TiltCard>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-slate-400">{description}</p>}
    </motion.div>
  )
}

export function EmptyState({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode
  title: string
  message: string
}) {
  return (
    <div className="glass-card mt-12 flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-16 text-center">
      {icon}
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  )
}
