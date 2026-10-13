import { useEffect, useState } from 'react'
import { api } from '../api'
import { Plus, Pencil, Trash2, X, Search, Building2, User, Mail, Phone, MapPin } from 'lucide-react'

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)

const EMPTY_FORM = { name: '', contact_person: '', email: '', phone: '', address: '', category: '', is_active: true }

export default function Vendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    api.getVendors().then(setVendors).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setError(null); setShowModal(true) }
  const openEdit = (v) => { setEditing(v); setForm({ ...v }); setError(null); setShowModal(true) }
  const closeModal = () => setShowModal(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      if (editing) await api.updateVendor(editing.id, form)
      else await api.createVendor(form)
      load(); closeModal()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this vendor profile?')) return
    await api.deleteVendor(id); load()
  }

  const filtered = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    (v.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.contact_person || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-canvas-border">
        <div>
          <span className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider">Suppliers</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">Approved Vendors</h2>
          <p className="text-slate-400 text-sm">Component manufacturers, sensor fabricators, and raw stock distributors</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Add Vendor
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input className="input pl-10" placeholder="Search vendors by name, category, contact..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 font-mono text-sm">Loading supplier records...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No vendor records found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(v => (
            <div key={v.id} className="card flex flex-col justify-between hover:border-slate-700/80 transition-all group">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-sky-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white tracking-tight leading-snug">{v.name}</h3>
                      {v.category && <p className="text-xs font-mono text-sky-400 mt-0.5">{v.category}</p>}
                    </div>
                  </div>
                  <span className={v.is_active ? 'badge-active' : 'badge-inactive'}>
                    <span className={`w-1.5 h-1.5 rounded-full ${v.is_active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {v.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-canvas-border">
                  {v.contact_person && (
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300">{v.contact_person}</span>
                    </div>
                  )}
                  {v.email && (
                    <div className="flex items-center gap-2 font-mono">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{v.email}</span>
                    </div>
                  )}
                  {v.phone && (
                    <div className="flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{v.phone}</span>
                    </div>
                  )}
                  {v.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{v.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-canvas-border flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500 uppercase font-mono font-medium">Requisition Volume</p>
                  <p className="text-sm font-bold font-mono text-emerald-400">{fmt(v.total_spent || 0)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(v)} className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors" title="Edit">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-canvas-card border border-canvas-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-canvas-border bg-slate-900/40">
              <h3 className="text-base font-semibold text-white">{editing ? 'Edit Vendor Profile' : 'Add Vendor'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3.5 py-2.5 rounded-lg">{error}</div>}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Company / Vendor Name *</label>
                <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Ouster LiDAR Systems" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Contact Representative</label>
                  <input className="input" value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} placeholder="Rep name" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Component Domain</label>
                  <input className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Sensors, Motors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Support Email</label>
                  <input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="orders@vendor.com" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Direct Phone</label>
                  <input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (800) 000-0000" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Distribution Headquarters</label>
                <textarea className="input resize-none" rows={2} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street, City, State / Country..." />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="v_active" className="w-4 h-4 rounded accent-sky-500 cursor-pointer" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                <label htmlFor="v_active" className="text-xs font-medium text-slate-300 cursor-pointer">Approved vendor status</label>
              </div>
              <div className="flex gap-2.5 pt-3 border-t border-canvas-border">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Profile'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
