import { useEffect, useState } from 'react'
import { api } from '../api'
import { Plus, Pencil, Trash2, X, Search, Calendar, DollarSign, ArrowRight } from 'lucide-react'

const STATUSES = ['planning', 'active', 'on_hold', 'completed', 'cancelled']

const statusBadge = (status) => {
  const map = {
    active: 'badge-active',
    planning: 'badge-info',
    on_hold: 'badge-pending',
    completed: 'inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium',
    cancelled: 'badge-danger',
  }
  return map[status] || 'badge-inactive'
}

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)

const EMPTY_FORM = { name: '', description: '', status: 'active', budget: '', start_date: '', end_date: '' }

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    const params = {}
    if (statusFilter) params.status = statusFilter
    api.getProjects(params).then(setProjects).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [statusFilter])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setError(null); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({
      ...p,
      budget: p.budget || '',
      start_date: p.start_date ? p.start_date.split('T')[0] : '',
      end_date: p.end_date ? p.end_date.split('T')[0] : ''
    })
    setError(null); setShowModal(true)
  }
  const closeModal = () => setShowModal(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      const payload = { ...form, budget: parseFloat(form.budget) || 0 }
      if (editing) await api.updateProject(editing.id, payload)
      else await api.createProject(payload)
      load(); closeModal()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    await api.deleteProject(id); load()
  }

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-canvas-border">
        <div>
          <span className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider">Research Portfolio</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">Robotics Projects</h2>
          <p className="text-slate-400 text-sm">Autonomous systems, robotic manipulators, and AI prototypes</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className="input pl-10" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select sm:w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 font-mono text-sm">Loading project catalog...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No projects found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => {
            const pct = p.budget > 0 ? Math.min(Math.round((p.spent / p.budget) * 100), 100) : 0
            const overBudget = p.budget > 0 && p.spent > p.budget
            return (
              <div key={p.id} className="card flex flex-col justify-between hover:border-slate-700/80 transition-all group">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-semibold text-white tracking-tight leading-snug">{p.name}</h3>
                    <span className={statusBadge(p.status)}>{p.status.replace('_', ' ')}</span>
                  </div>
                  {p.description && (
                    <p className="text-slate-400 text-xs mb-5 line-clamp-2 leading-relaxed">{p.description}</p>
                  )}
                </div>

                <div className="space-y-4 pt-3 border-t border-canvas-border">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">Budget Consumed ({pct}%)</span>
                      <span className={`font-mono font-medium ${overBudget ? 'text-rose-400' : 'text-slate-200'}`}>
                        {fmt(p.spent)} / {fmt(p.budget)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${overBudget ? 'bg-rose-500' : 'bg-sky-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {p.start_date ? p.start_date.slice(0, 10) : 'Ongoing'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-canvas-card border border-canvas-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-canvas-border bg-slate-900/40">
              <h3 className="text-base font-semibold text-white">{editing ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3.5 py-2.5 rounded-lg">{error}</div>}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Project Name *</label>
                <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Quadruped Robot Cheetah" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Description</label>
                <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Goals, deliverables and hardware architecture..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Status</label>
                  <select className="select capitalize" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Total Budget ($)</label>
                  <input className="input font-mono" type="number" step="0.01" min="0" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="50000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Target Start</label>
                  <input className="input" type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Target Completion</label>
                  <input className="input" type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2.5 pt-3 border-t border-canvas-border">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
