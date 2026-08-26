import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Mail, Copy } from 'lucide-react'
import { LogoMark } from './Logo'
import { useToast } from './Toast'

const NAV_LINKS = [
  { label: 'Showcase', href: '#showcase' },
  { label: 'Transparency', href: '#transparency' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Contact', href: '#contact' },
]

const MAILTO =
  'mailto:aerouslabs@gmail.com?subject=' +
  encodeURIComponent('Project Inquiry — Aerous Labs') +
  '&body=' +
  encodeURIComponent(
    'Hi Aerous Labs team,\n\nI would like to talk about a potential project / collaboration.\n\nDetails:\n- \n\nBest,\n',
  )

export function ContactStudioButton({ className = '' }: { className?: string }) {
  const { push } = useToast()

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText('aerouslabs@gmail.com')
      push('Email copied — aerouslabs@gmail.com')
    } catch {
      push('aerouslabs@gmail.com')
    }
    window.location.href = MAILTO
  }

  return (
    <motion.a
      href={MAILTO}
      onClick={handleCopy}
      whileHover={{ scale: 1.045 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-[#030712] shadow-lg shadow-cyan-500/20 ${className}`}
    >
      <Mail size={16} />
      Contact Studio
      <Copy size={13} className="opacity-60 transition-opacity group-hover:opacity-100" />
    </motion.a>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030712]/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <LogoMark size={30} />
          <span className="text-sm font-medium tracking-[0.12em] lowercase text-slate-50">aerous labs</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm text-slate-300 transition-colors hover:text-white after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-cyan-400 after:to-emerald-400 after:transition-all after:duration-500 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <ContactStudioButton />
        </div>

        <button
          type="button"
          className="text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden border-t border-white/5 bg-[#030712]/95 md:hidden"
        >
          <div className="flex flex-col gap-4 px-6 py-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <ContactStudioButton className="w-fit" />
          </div>
        </motion.div>
      )}
    </header>
  )
}
