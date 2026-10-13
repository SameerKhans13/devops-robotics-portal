import { useEffect, useState } from 'react'
import { api } from '../api'
import { Plus, Pencil, Trash2, X, Search, ShoppingCart, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'

const STATUSES = ['pending', 'approved', 'ordered', 'received', 'cancelled']

const statusBadge = (status) => {
  const map = {
    received: 'badge-active',
    approved: 'badge-info',
    ordered: 'badge-pending',
    pending: 'inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-300 border border-slate-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium',
    cancelled: 'badge-danger',
  }
  return map[status] || 'badge-inactive'
}

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0)

const EMPTY_FORM = {
  order_number: '', title: '', description: '', amount: '', status: 'pending',
  vendor_id: '', project_id: '', invoice_number: '', notes: ''
}

export default function Purchases() {
  const [orders, setOrders] = useState([])
  const [vendors, setVendors] = useState([])
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
    Promise.all([api.getPurchases(params), api.getVendors(), api.getProjects()])
      .then(([o, v, p]) => { setOrders(o); setVendors(v); setProjects(p) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [statusFilter])

  const openCreate = () => {
    setEditing(null)
    const seq = Math.floor(1000 + Math.random() * 9000)
    setForm({ ...EMPTY_FORM, order_number: `PO-2026-${seq}` })
    setError(null); setShowModal(true)
  }
  const openEdit = (o) => {
    setEditing(o)
    setForm({
      ...o,
      vendor_id: o.vendor_id || '',
      project_id: o.project_id || '',
      invoice_number: o.invoice_number || '',
      notes: o.notes || ''
    })
    setError(null); setShowModal(true)
  }
  const closeModal = () => setShowModal(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      const payload = {
        ...form, amount: parseFloat(form.amount),
        vendor_id: form.vendor_id ? parseInt(form.vendor_id) : null,
        project_id: form.project_id ? parseInt(form.project_id) : null,
      }
      if (editing) await api.updatePurchase(editing.id, payload)
      else await api.createPurchase(payload)
      load(); closeModal()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Cancel or remove this purchase record?')) return
    await api.deletePurchase(id); load()
  }

  const filtered = orders.filter(o =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.order_number.toLowerCase().includes(search.toLowerCase()) ||
    (o.invoice_number || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalOutstanding = orders
    .filter(o => ['pending', 'approved', 'ordered'].includes(o.status))
    .reduce((s, o) => s + o.amount, 0)

  const totalReceived = orders
    .filter(o => o.status === 'received')
    .reduce((s, o) => s + o.amount, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-canvas-border">
        <div>
          <span className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider">Procurement</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">Purchasing & Invoices</h2>
          <p className="text-slate-400 text-sm">Tracking requisitions, invoice reconciliation, and vendor settlements</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> New Purchase Order
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card py-4 flex items-center justify-between border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Pending Requisitions Value</p>
              <p className="text-xl font-bold font-mono text-white">{fmt(totalOutstanding)}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
            Committed
          </span>
        </div>

        <div className="card py-4 flex items-center justify-between border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Delivered & Reconciled</p>
              <p className="text-xl font-bold font-mono text-white">{fmt(totalReceived)}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            Fulfillments
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className="input pl-10" placeholder="Search orders, PO #, invoices..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select sm:w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Order Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-canvas-border bg-slate-900/60">
                {['Order Ref', 'Description', 'Amount', 'Status', 'Vendor', 'Project', 'Invoice #', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-500 font-mono text-sm">Loading procurement transactions...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-500">No purchase records found</td></tr>
              ) : filtered.map(o => {
                const vendor = vendors.find(v => v.id === o.vendor_id)
                const project = projects.find(p => p.id === o.project_id)
                return (
                  <tr key={o.id} className="table-row">
                    <td className="px-5 py-3.5 text-sky-400 font-mono text-xs font-semibold">{o.order_number}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-white max-w-xs truncate">{o.title}</p>
                      {o.notes && <p className="text-xs text-slate-400 truncate mt-0.5">{o.notes}</p>}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-sm font-bold text-white">{fmt(o.amount)}</td>
                    <td className="px-5 py-3.5"><span className={statusBadge(o.status)}>{o.status}</span></td>
                    <td className="px-5 py-3.5 text-xs text-slate-300 font-medium">{vendor ? vendor.name : '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{project ? project.name : 'General Stock'}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-400">{o.invoice_number || 'Pending'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(o)} className="p-1.5 rounded-md hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(o.id)} className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors" title="Delete">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-canvas-card border border-canvas-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-canvas-border bg-slate-900/40">
              <h3 className="text-base font-semibold text-white">{editing ? 'Edit Requisition' : 'Create Purchase Order'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
              {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3.5 py-2.5 rounded-lg">{error}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">PO Number *</label>
                  <input className="input font-mono" required value={form.order_number} onChange={e => setForm(f => ({ ...f, order_number: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Total Amount ($) *</label>
                  <input className="input font-mono" type="number" step="0.01" min="0" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Hardware / Item Title *</label>
                <input className="input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. 3D Stereo Vision Sensor" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Fulfillment Status</label>
                  <select className="select capitalize" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Vendor Invoice #</label>
                  <input className="input font-mono" value={form.invoice_number} onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))} placeholder="e.g. INV-2026-90" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Assigned Vendor</label>
                  <select className="select" value={form.vendor_id} onChange={e => setForm(f => ({ ...f, vendor_id: e.target.value }))}>
                    <option value="">Select Vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Allocated Project</label>
                  <select className="select" value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))}>
                    <option value="">General Lab Pool</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Requisition Notes</label>
                <textarea className="input resize-none" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Delivery ETA, part specifications, or vendor terms..." />
              </div>
              <div className="flex gap-2.5 pt-3 border-t border-canvas-border">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Requisition'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
