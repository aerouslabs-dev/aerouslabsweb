import { LogoMark } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <LogoMark size={24} />
          <span className="text-sm lowercase tracking-wide text-slate-400">aerous labs</span>
        </div>
        <p className="text-xs text-slate-500">A startup project by Aerous Labs · © {new Date().getFullYear()}</p>
        <a href="/admin" className="text-xs text-slate-600 transition-colors hover:text-slate-400">
          Studio Access
        </a>
      </div>
    </footer>
  )
}
