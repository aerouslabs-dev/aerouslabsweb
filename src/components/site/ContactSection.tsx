import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Loader2 } from 'lucide-react'
import { SectionHeading } from './AppsShowcase'
import { ContactStudioButton } from './Navbar'
import { useToast } from './Toast'
import { submitFeedback } from '@/server/aerous.functions'

export function ContactSection() {
  const { push } = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.message.trim()) return
    setStatus('submitting')
    try {
      await submitFeedback({ data: form })
      setStatus('done')
      setForm({ name: '', email: '', message: '' })
      push('Feedback sent — thank you!')
    } catch {
      setStatus('idle')
      push('Something went wrong. Please try again.')
    }
  }

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Get In Touch"
        title="Let's build something precise, together"
        description="Whether it's a partnership, a product idea, or feedback on our work — the studio is listening."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card flex flex-col justify-between rounded-2xl p-8"
        >
          <div>
            <Mail size={26} className="text-cyan-300" />
            <h3 className="mt-4 text-xl font-semibold text-slate-50">Contact the Studio directly</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              One tap opens your email client with a pre-filled template addressed to our team, and copies our
              address to your clipboard.
            </p>
          </div>
          <ContactStudioButton className="mt-6 w-fit" />
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card space-y-4 rounded-2xl p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-400/50"
            />
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Your email"
              type="email"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-400/50"
            />
          </div>
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Tell us what's on your mind..."
            required
            rows={4}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-400/50"
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-[#030712] transition-opacity disabled:opacity-60"
          >
            {status === 'submitting' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Send Feedback
          </button>
        </motion.form>
      </div>
    </section>
  )
}
