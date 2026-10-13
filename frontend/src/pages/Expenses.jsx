import { useEffect, useState } from 'react'
import { api } from '../api'
import { Plus, Pencil, Trash2, X, Search, DollarSign, Calendar, Layers } from 'lucide-react'

const CATEGORIES = ['components', 'equipment', 'software', 'maintenance', 'travel', 'other']

const catBadge = (cat) => {
  const map = {
    components: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    equipment: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    software: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    maintenance: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    travel: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  }
  return `text-xs px-2.5 py-0.5 rounded-full font-medium font-mono border capitalize ${map[cat] || 'bg-slate-500/10 text-slate-400'}`
}

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0)

const EMPTY_FORM = { title: '', description: '', amount: '', category: 'components', project_id: '', expense_date: new Date().toISOString().split('T')[0] }

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    const params = {}
    if (catFilter) params.category = catFilter
    Promise.all([api.getExpenses(params), api.getProjects()])
      .then(([e, p]) => { setExpenses(e); setProjects(p) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [catFilter])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setError(null); setShowModal(true) }
  const openEdit = (ex) => {
    setEditing(ex)
    setForm({
      ...ex,
      expense_date: ex.expense_date ? ex.expense_date.split('T')[0] : '',
      project_id: ex.project_id || ''
    })
    setError(null); setShowModal(true)
  }
  const closeModal = () => setShowModal(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      const payload = { ...form, amount: parseFloat(form.amount), project_id: form.project_id ? parseInt(form.project_id) : null }
      if (editing) await api.updateExpense(editing.id, payload)
      else await api.createExpense(payload)
      load(); closeModal()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense line item?')) return
    await api.deleteExpense(id); load()
  }

  const filtered = expenses.filter(ex =>
    ex.title.toLowerCase().includes(search.toLowerCase()) ||
    (ex.description || '').toLowerCase().includes(search.toLowerCase())
  )
  const total = filtered.reduce((s, ex) => s + ex.amount, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-canvas-border">
        <div>
          <span className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider">Accounting</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">Lab Expenditures</h2>
          <p className="text-slate-400 text-sm">Disbursements, component receipts, and software subscriptions</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="card py-4 flex items-center justify-between border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Aggregated Expense Total</p>
            <p className="text-xl font-bold font-mono text-white">{fmt(total)}</p>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
          Audited
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className="input pl-10" placeholder="Search expenditures..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select sm:w-44" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-canvas-border bg-slate-900/60">
                {['Item & Context', 'Category', 'Amount', 'Associated Project', 'Date', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500 font-mono text-sm">Loading expense ledgers...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500">No records found</td></tr>
              ) : filtered.map(ex => {
                const proj = projects.find(p => p.id === ex.project_id)
                return (
                  <tr key={ex.id} className="table-row">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-white">{ex.title}</p>
                      {ex.description && <p className="text-xs text-slate-400 truncate mt-0.5 max-w-md">{ex.description}</p>}
                    </td>
                    <td className="px-5 py-3.5"><span className={catBadge(ex.category)}>{ex.category}</span></td>
                    <td className="px-5 py-3.5 font-mono text-sm font-bold text-emerald-400">{fmt(ex.amount)}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-300 font-medium">
                      {proj ? (
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-500" />
                          {proj.name}
                        </span>
                      ) : 'General Overhead'}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400 font-mono">
                      {ex.expense_date ? (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {ex.expense_date.slice(0, 10)}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(ex)} className="p-1.5 rounded-md hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(ex.id)} className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-canvas-card border border-canvas-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-canvas-border bg-slate-900/40">
              <h3 className="text-base font-semibold text-white">{editing ? 'Edit Expense Item' : 'Record Expense'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3.5 py-2.5 rounded-lg">{error}</div>}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Expense Title *</label>
                <input className="input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Servo Motor Gearbox Refurbishment" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Amount ($) *</label>
                  <input className="input font-mono" type="number" step="0.01" min="0" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Category</label>
                  <select className="select capitalize" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Associated Project</label>
                <select className="select" value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))}>
                  <option value="">General Lab Overhead</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Description / Receipt Note</label>
                <textarea className="input resize-none" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Supplier details, invoice ref or reason..." />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Transaction Date</label>
                <input className="input" type="date" value={form.expense_date} onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))} />
              </div>
              <div className="flex gap-2.5 pt-3 border-t border-canvas-border">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
