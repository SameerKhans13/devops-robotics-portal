import { useEffect, useState } from 'react'
import { api } from '../api'
import { Plus, Pencil, Trash2, X, Search, Mail, Phone, Building } from 'lucide-react'

const ROLES = ['lead', 'researcher', 'engineer', 'technician', 'intern']

const roleBadge = (role) => {
  const map = {
    lead: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    researcher: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    engineer: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    technician: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    intern: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  }
  return `text-xs px-2.5 py-0.5 rounded-full font-medium capitalize font-mono ${map[role] || 'bg-slate-500/10 text-slate-400'}`
}

const EMPTY_FORM = { name: '', email: '', role: 'researcher', department: '', phone: '', is_active: true }

export default function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    const params = {}
    if (roleFilter) params.role = roleFilter
    api.getMembers(params)
      .then(setMembers)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [roleFilter])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setError(null); setShowModal(true) }
  const openEdit = (m) => { setEditing(m); setForm({ ...m }); setError(null); setShowModal(true) }
  const closeModal = () => setShowModal(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true); setError(null)
    try {
      if (editing) await api.updateMember(editing.id, form)
      else await api.createMember(form)
      load(); closeModal()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this member from lab roster?')) return
    await api.deleteMember(id)
    load()
  }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.department || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-canvas-border">
        <div>
          <span className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider">Directory</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">Lab Personnel & Researchers</h2>
          <p className="text-slate-400 text-sm">Engineers, research scientists, and robotics specialists</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            className="input pl-10"
            placeholder="Search by name, email, department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="select sm:w-44"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-canvas-border bg-slate-900/60">
                {['Member', 'Role', 'Department', 'Contact', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500 font-mono text-sm">Loading personnel...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500">No matching members found</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} className="table-row">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-sky-400 font-semibold text-sm">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{m.name}</p>
                        <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" /> {m.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={roleBadge(m.role)}>{m.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {m.department || 'General Robotics'}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 font-mono">
                    {m.phone ? (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-500" /> {m.phone}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={m.is_active ? 'badge-active' : 'badge-inactive'}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.is_active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      {m.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded-md hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-canvas-card border border-canvas-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-canvas-border bg-slate-900/40">
              <h3 className="text-base font-semibold text-white">{editing ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3.5 py-2.5 rounded-lg">{error}</div>}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Full Name *</label>
                <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Dr. Alex Mercer" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Email Address *</label>
                <input className="input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@roboticslab.org" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Role</label>
                  <select className="select capitalize" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Department</label>
                  <input className="input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Perception" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Contact Phone</label>
                <input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="is_active" className="w-4 h-4 rounded accent-sky-500 cursor-pointer" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                <label htmlFor="is_active" className="text-xs font-medium text-slate-300 cursor-pointer">Active in lab roster</label>
              </div>
              <div className="flex gap-2.5 pt-3 border-t border-canvas-border">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
