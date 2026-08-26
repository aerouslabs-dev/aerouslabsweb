import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  LockKeyhole,
  LayoutDashboard,
  Boxes,
  Wrench,
  Map as MapIcon,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Upload,
  X,
  Loader2,
} from 'lucide-react'
import { LogoMark } from '@/components/site/Logo'
import { ToastProvider, useToast } from '@/components/site/Toast'
import {
  adminLogin,
  adminGetAll,
  adminUpdateSettings,
  adminCreateTool,
  adminDeleteTool,
  adminCreateApp,
  adminUpdateApp,
  adminDeleteApp,
  adminUploadImage,
  adminCreateRoadmapItem,
  adminUpdateRoadmapItem,
  adminDeleteRoadmapItem,
  adminDeleteFeedback,
} from '@/server/aerous.functions'
import { APP_STATUSES, APP_NATURES, ROADMAP_STATUSES } from '@/lib/types'
import type { RoadmapItem, ShowcaseApp, SiteSettings, Tool } from '@/lib/types'

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Studio Access — Aerous Labs' }] }),
  component: () => (
    <ToastProvider>
      <AdminPage />
    </ToastProvider>
  ),
})

const TOKEN_KEY = 'aerous_admin_token'

type AdminData = {
  settings: SiteSettings
  apps: ShowcaseApp[]
  tools: Tool[]
  roadmap: RoadmapItem[]
  feedback: Array<{ id: number; name: string; email: string; message: string; createdAt: string | Date | null }>
}

function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY))
    setChecked(true)
  }, [])

  if (!checked) return <div className="min-h-screen bg-[#030712]" />

  if (!token) return <LoginScreen onSuccess={(t) => setToken(t)} />

  return (
    <Dashboard
      token={token}
      onLogout={() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      }}
    />
  )
}

function LoginScreen({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await adminLogin({ data: { username, password } })
      if (res.success) {
        localStorage.setItem(TOKEN_KEY, res.token)
        onSuccess(res.token)
      } else {
        setError('Invalid credentials.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] bg-grid-lines px-4">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-sm rounded-2xl p-8">
        <div className="mb-6 flex flex-col items-center gap-3">
          <LogoMark size={44} />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-slate-50">Studio Access</h1>
            <p className="text-xs text-slate-500">Aerous Labs Admin Panel</p>
          </div>
        </div>
        <div className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/50"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/50"
          />
        </div>
        {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-[#030712] disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <LockKeyhole size={16} />}
          Sign In
        </button>
      </form>
    </div>
  )
}

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'apps', label: 'Apps', icon: Boxes },
  { key: 'tools', label: 'Tools', icon: Wrench },
  { key: 'roadmap', label: 'Roadmap', icon: MapIcon },
  { key: 'feedback', label: 'Feedback', icon: MessageSquare },
] as const

type TabKey = (typeof TABS)[number]['key']

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const { push } = useToast()
  const [tab, setTab] = useState<TabKey>('overview')
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const res = await adminGetAll({ data: { token } })
      setData(res as AdminData)
    } catch {
      push('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] bg-grid-lines">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#030712]/80 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <LogoMark size={28} />
          <span className="text-sm font-medium text-slate-200">Studio Admin</span>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-slate-300 hover:border-rose-400/40 hover:text-rose-300"
        >
          <LogOut size={13} /> Sign Out
        </button>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6">
        <nav className="hidden w-52 shrink-0 flex-col gap-1 sm:flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                tab === t.key ? 'glass-card text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs ${
                tab === t.key ? 'bg-cyan-400/10 text-cyan-300' : 'text-slate-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <main className="min-w-0 flex-1">
          {loading || !data ? (
            <div className="flex items-center justify-center py-24 text-slate-500">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {tab === 'overview' && <OverviewTab data={data} token={token} refresh={refresh} />}
              {tab === 'apps' && <AppsTab data={data} token={token} refresh={refresh} />}
              {tab === 'tools' && <ToolsTab data={data} token={token} refresh={refresh} />}
              {tab === 'roadmap' && <RoadmapTab data={data} token={token} refresh={refresh} />}
              {tab === 'feedback' && <FeedbackTab data={data} token={token} refresh={refresh} />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="mb-5 text-base font-semibold text-slate-100">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-400">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/50'

function OverviewTab({ data, token, refresh }: { data: AdminData; token: string; refresh: () => void }) {
  const { push } = useToast()
  const [form, setForm] = useState({
    heroTitle: data.settings.heroTitle,
    heroSubtitle: data.settings.heroSubtitle,
    bannerText: data.settings.bannerText,
    bannerLink: data.settings.bannerLink ?? '',
    bannerEnabled: data.settings.bannerEnabled,
    statusLabel: data.settings.statusLabel,
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await adminUpdateSettings({ data: { token, ...form, bannerLink: form.bannerLink || null } })
      push('Site settings updated — live for all visitors')
      refresh()
    } catch {
      push('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Apps Published" value={data.apps.length} />
        <StatCard label="Tools Tracked" value={data.tools.length} />
        <StatCard label="Feedback Received" value={data.feedback.length} />
      </div>

      <Panel title="Hero Copy">
        <div className="space-y-4">
          <Field label="Hero Title">
            <textarea
              className={inputClass}
              rows={2}
              value={form.heroTitle}
              onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
            />
          </Field>
          <Field label="Hero Subtitle">
            <textarea
              className={inputClass}
              rows={3}
              value={form.heroSubtitle}
              onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Announcement Banner & System Status">
        <div className="space-y-4">
          <Field label="Banner Text">
            <input
              className={inputClass}
              value={form.bannerText}
              onChange={(e) => setForm((f) => ({ ...f, bannerText: e.target.value }))}
            />
          </Field>
          <Field label="Banner Link (optional)">
            <input
              className={inputClass}
              value={form.bannerLink}
              onChange={(e) => setForm((f) => ({ ...f, bannerLink: e.target.value }))}
              placeholder="https://..."
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.bannerEnabled}
              onChange={(e) => setForm((f) => ({ ...f, bannerEnabled: e.target.checked }))}
            />
            Banner enabled
          </label>
          <Field label="System Status Label">
            <input
              className={inputClass}
              value={form.statusLabel}
              onChange={(e) => setForm((f) => ({ ...f, statusLabel: e.target.value }))}
            />
          </Field>
        </div>
      </Panel>

      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-[#030712] disabled:opacity-60"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        Save Changes
      </button>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="text-2xl font-bold text-cyan-300">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  )
}

// ---------------- Apps Tab ----------------

function AppsTab({ data, token, refresh }: { data: AdminData; token: string; refresh: () => void }) {
  const { push } = useToast()
  const [editing, setEditing] = useState<ShowcaseApp | 'new' | null>(null)

  const handleDelete = async (app: ShowcaseApp) => {
    if (!confirm(`Delete "${app.name}"? This cannot be undone.`)) return
    await adminDeleteApp({ data: { token, id: app.id, imageKey: app.imageKey } })
    push(`${app.name} deleted`)
    refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Apps ({data.apps.length})</h2>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-2 text-xs font-semibold text-[#030712]"
        >
          <Plus size={14} /> New App
        </button>
      </div>

      {data.apps.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center text-sm text-slate-500">No apps yet — add your first showcase app.</div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {data.apps.map((app) => (
          <div key={app.id} className="glass-card flex items-center gap-3 rounded-xl p-4">
            {app.imageKey ? (
              <img src={`/api/image/${app.imageKey}`} className="h-10 w-10 rounded-lg object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-white/5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">{app.name}</p>
              <p className="truncate text-xs text-slate-500">
                {app.status} · {app.version}
              </p>
            </div>
            <button onClick={() => setEditing(app)} className="rounded-lg p-2 text-slate-400 hover:text-cyan-300">
              <Pencil size={15} />
            </button>
            <button onClick={() => handleDelete(app)} className="rounded-lg p-2 text-slate-400 hover:text-rose-400">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <AppEditorModal
          app={editing === 'new' ? null : editing}
          tools={data.tools}
          token={token}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            refresh()
          }}
        />
      )}
    </div>
  )
}

function AppEditorModal({
  app,
  tools,
  token,
  onClose,
  onSaved,
}: {
  app: ShowcaseApp | null
  tools: Tool[]
  token: string
  onClose: () => void
  onSaved: () => void
}) {
  const { push } = useToast()
  const [form, setForm] = useState({
    name: app?.name ?? '',
    tagline: app?.tagline ?? '',
    category: app?.category ?? 'App',
    status: app?.status ?? 'In Development',
    nature: app?.nature ?? 'Beta',
    version: app?.version ?? 'v0.1.0',
    link: app?.link ?? '',
    imageKey: app?.imageKey ?? null,
  })
  const [allocations, setAllocations] = useState<Record<number, number>>(
    Object.fromEntries((app?.allocations ?? []).map((a) => [a.toolId, a.percentage])),
  )
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.set('token', token)
      fd.set('file', file)
      const res = await adminUploadImage({ data: fd })
      setForm((f) => ({ ...f, imageKey: res.key }))
      push('Image uploaded')
    } catch {
      push('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      push('App name is required')
      return
    }
    setSaving(true)
    const payload = {
      name: form.name,
      tagline: form.tagline,
      category: form.category,
      status: form.status,
      nature: form.nature,
      version: form.version,
      link: form.link || null,
      imageKey: form.imageKey,
      sortOrder: app?.sortOrder ?? 0,
      allocations: Object.entries(allocations)
        .map(([toolId, percentage]) => ({ toolId: Number(toolId), percentage: Number(percentage) }))
        .filter((a) => a.percentage > 0),
    }
    try {
      if (app) {
        await adminUpdateApp({ data: { token, id: app.id, app: payload } })
      } else {
        await adminCreateApp({ data: { token, app: payload } })
      }
      push(`${form.name} saved`)
      onSaved()
    } catch {
      push('Failed to save app')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="glass-card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-100">{app ? 'Edit App' : 'New App'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {form.imageKey ? (
              <img src={`/api/image/${form.imageKey}`} className="h-16 w-16 rounded-xl object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/5 text-slate-500">
                <Boxes size={22} />
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-slate-300 hover:border-cyan-400/40">
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              Upload Icon
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>

          <Field label="App Name">
            <input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="Tagline">
            <input className={inputClass} value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <input className={inputClass} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
            </Field>
            <Field label="Version">
              <input className={inputClass} value={form.version} onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))} placeholder="v1.0.0" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select className={inputClass} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                {APP_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="App Nature">
              <select className={inputClass} value={form.nature} onChange={(e) => setForm((f) => ({ ...f, nature: e.target.value }))}>
                {APP_NATURES.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Direct Link">
            <input className={inputClass} value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://..." />
          </Field>

          <div>
            <span className="mb-2 block text-xs font-medium text-slate-400">Tool Allocation</span>
            {tools.length === 0 ? (
              <p className="text-xs text-slate-500">Add tools in the Tools tab to enable allocation sliders.</p>
            ) : (
              <div className="space-y-3">
                {tools.map((tool) => (
                  <div key={tool.id}>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                      <span style={{ color: tool.color }}>{tool.name}</span>
                      <span className="font-mono text-slate-400">{allocations[tool.id] ?? 0}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={allocations[tool.id] ?? 0}
                      onChange={(e) => setAllocations((a) => ({ ...a, [tool.id]: Number(e.target.value) }))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2 text-sm font-semibold text-[#030712] disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            Save App
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------- Tools Tab ----------------

function ToolsTab({ data, token, refresh }: { data: AdminData; token: string; refresh: () => void }) {
  const { push } = useToast()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#00F2FE')

  const handleAdd = async () => {
    if (!name.trim()) return
    await adminCreateTool({ data: { token, name, color } })
    setName('')
    push(`${name} added to tool list`)
    refresh()
  }

  const handleDelete = async (tool: Tool) => {
    if (!confirm(`Remove "${tool.name}" from tracking? This clears it from all app allocations.`)) return
    await adminDeleteTool({ data: { token, id: tool.id } })
    push(`${tool.name} removed`)
    refresh()
  }

  return (
    <div className="space-y-6">
      <Panel title="Add a Tool">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[160px]">
            <Field label="Tool Name">
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Claude" />
            </Field>
          </div>
          <div>
            <Field label="Color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-16 rounded-lg border border-white/10 bg-transparent" />
            </Field>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-2 text-xs font-semibold text-[#030712]"
          >
            <Plus size={14} /> Add Tool
          </button>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.tools.map((tool) => (
          <div key={tool.id} className="glass-card flex items-center gap-3 rounded-xl p-4">
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: tool.color }} />
            <span className="flex-1 text-sm text-slate-100">{tool.name}</span>
            <button onClick={() => handleDelete(tool)} className="rounded-lg p-2 text-slate-400 hover:text-rose-400">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {data.tools.length === 0 && <p className="text-sm text-slate-500">No tools tracked yet.</p>}
      </div>
    </div>
  )
}

// ---------------- Roadmap Tab ----------------

function RoadmapTab({ data, token, refresh }: { data: AdminData; token: string; refresh: () => void }) {
  const { push } = useToast()
  const [editing, setEditing] = useState<RoadmapItem | 'new' | null>(null)

  const handleDelete = async (item: RoadmapItem) => {
    if (!confirm(`Delete "${item.title}"?`)) return
    await adminDeleteRoadmapItem({ data: { token, id: item.id } })
    push('Roadmap item deleted')
    refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Roadmap ({data.roadmap.length})</h2>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-2 text-xs font-semibold text-[#030712]"
        >
          <Plus size={14} /> New Item
        </button>
      </div>

      <div className="space-y-3">
        {data.roadmap.map((item) => (
          <div key={item.id} className="glass-card flex items-center gap-3 rounded-xl p-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-100">
                {item.title} <span className="ml-1 font-mono text-xs text-cyan-300">{item.version}</span>
              </p>
              <p className="text-xs text-slate-500">{item.status}</p>
            </div>
            <button onClick={() => setEditing(item)} className="rounded-lg p-2 text-slate-400 hover:text-cyan-300">
              <Pencil size={15} />
            </button>
            <button onClick={() => handleDelete(item)} className="rounded-lg p-2 text-slate-400 hover:text-rose-400">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {data.roadmap.length === 0 && <p className="text-sm text-slate-500">No roadmap items yet.</p>}
      </div>

      {editing && (
        <RoadmapEditorModal
          item={editing === 'new' ? null : editing}
          token={token}
          sortOrder={data.roadmap.length}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            refresh()
          }}
        />
      )}
    </div>
  )
}

function RoadmapEditorModal({
  item,
  token,
  sortOrder,
  onClose,
  onSaved,
}: {
  item: RoadmapItem | null
  token: string
  sortOrder: number
  onClose: () => void
  onSaved: () => void
}) {
  const { push } = useToast()
  const [form, setForm] = useState({
    title: item?.title ?? '',
    description: item?.description ?? '',
    version: item?.version ?? 'v1.0',
    status: item?.status ?? 'Planned',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    const payload = { ...form, sortOrder: item?.sortOrder ?? sortOrder }
    try {
      if (item) {
        await adminUpdateRoadmapItem({ data: { token, id: item.id, item: payload } })
      } else {
        await adminCreateRoadmapItem({ data: { token, item: payload } })
      }
      push('Roadmap saved')
      onSaved()
    } catch {
      push('Failed to save roadmap item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="glass-card w-full max-w-md rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-100">{item ? 'Edit Roadmap Item' : 'New Roadmap Item'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <Field label="Title">
            <input className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="Description">
            <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Version">
              <input className={inputClass} value={form.version} onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))} placeholder="v2.0" />
            </Field>
            <Field label="Status">
              <select className={inputClass} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                {ROADMAP_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2 text-sm font-semibold text-[#030712] disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------- Feedback Tab ----------------

function FeedbackTab({ data, token, refresh }: { data: AdminData; token: string; refresh: () => void }) {
  const { push } = useToast()

  const handleDelete = async (id: number) => {
    await adminDeleteFeedback({ data: { token, id } })
    push('Feedback removed')
    refresh()
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-100">Feedback ({data.feedback.length})</h2>
      {data.feedback.length === 0 && <p className="text-sm text-slate-500">No feedback submissions yet.</p>}
      {data.feedback.map((f) => (
        <div key={f.id} className="glass-card rounded-xl p-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">{f.name || 'Anonymous'}</span>
            <button onClick={() => handleDelete(f.id)} className="text-slate-500 hover:text-rose-400">
              <Trash2 size={14} />
            </button>
          </div>
          {f.email && <p className="mb-1 text-xs text-cyan-300">{f.email}</p>}
          <p className="text-sm text-slate-400">{f.message}</p>
        </div>
      ))}
    </div>
  )
}
