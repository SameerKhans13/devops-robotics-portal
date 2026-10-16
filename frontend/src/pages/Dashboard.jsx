import { useEffect, useState } from 'react'
import { api } from '../api'
import {
  Users, FolderKanban, DollarSign, ShoppingCart,
  Building2, TrendingUp, Cpu, ArrowUpRight, CheckCircle2, Clock
} from 'lucide-react'

const StatCard = ({ label, value, icon: Icon, color, subtitle, trend }) => (
  <div className="stat-card group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">{label}</p>
        <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
            {trend && (
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                {trend}
              </span>
            )}
            <span className="text-slate-400">{subtitle}</span>
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-900/90 border border-slate-700/60 shadow-inner group-hover:scale-105 transition-all duration-200 ${color || 'text-slate-300'}`}>
        <Icon className="w-6 h-6 transition-transform group-hover:rotate-6" />
      </div>
    </div>
  </div>
)

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0)

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3 text-sky-400">
          <Cpu className="w-5 h-5 animate-spin" />
          <span className="font-mono text-sm text-slate-300">Loading metrics...</span>
        </div>
      </div>
    )
  }

  const cards = [
    {
      label: 'Lab Personnel',
      value: stats.total_members,
      icon: Users,
      color: 'text-sky-400',
      subtitle: `${stats.active_members} on active duty`,
      trend: '92% active',
    },
    {
      label: 'Active Projects',
      value: stats.total_projects,
      icon: FolderKanban,
      color: 'text-indigo-400',
      subtitle: `${stats.active_projects} ongoing sprints`,
      trend: '4 in progress',
    },
    {
      label: 'Cumulative Spend',
      value: formatCurrency(stats.total_expenses),
      icon: DollarSign,
      color: 'text-emerald-400',
      subtitle: 'Across all active milestones',
      trend: 'Budget tracked',
    },
    {
      label: 'Purchase Orders',
      value: stats.total_purchase_orders,
      icon: ShoppingCart,
      color: 'text-amber-400',
      subtitle: `${formatCurrency(stats.pending_purchases)} awaiting fulfillment`,
      trend: '4 in review',
    },
    {
      label: 'Approved Vendors',
      value: stats.total_vendors,
      icon: Building2,
      color: 'text-cyan-400',
      subtitle: 'Suppliers with valid agreements',
      trend: 'Verified',
    },
    {
      label: 'Monthly Requisition',
      value: formatCurrency(stats.monthly_spending),
      icon: TrendingUp,
      color: 'text-purple-400',
      subtitle: 'Current billing period',
      trend: 'On pace',
    },
  ]

  const recentTransactions = [
    { id: 1, title: 'Dynamixel XM540 Industrial Servos', vendor: 'Precision Actuators Corp', amount: 4980, status: 'Ordered', date: 'Oct 14' },
    { id: 2, title: 'Solid-State LiDAR Rangefinders 50m', vendor: 'LidarTech Photonics', amount: 7420, status: 'Approved', date: 'Oct 11' },
    { id: 3, title: 'Rapid 4-Layer Flight Controller PCBs', vendor: 'Apex Rapid PCB', amount: 1850, status: 'Received', date: 'Oct 09' },
    { id: 4, title: 'Aerospace Grade Carbon Fiber Sheets', vendor: 'Titanium Alloys & Comp.', amount: 2200, status: 'Pending', date: 'Oct 05' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-canvas-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider">Command Center</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Robotics Lab Dashboard</h2>
          <p className="text-slate-400 text-sm mt-0.5">Live monitoring of research initiatives, hardware allocations, and requisitions</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge-active">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Telemetry Live
          </span>
          <span className="text-xs text-slate-400 font-mono bg-canvas-card px-3 py-1.5 rounded-lg border border-canvas-border">
            UTC {new Date().toISOString().slice(0, 10)}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases & Transactions */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Recent Hardware Orders</h3>
              <p className="text-xs text-slate-400">Requisitions and deliveries underway</p>
            </div>
            <a href="/purchases" className="text-xs text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="divide-y divide-canvas-border">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-200">{tx.title}</p>
                  <p className="text-xs text-slate-400">{tx.vendor} • <span className="font-mono text-slate-500">{tx.date}</span></p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-semibold font-mono text-white">{formatCurrency(tx.amount)}</p>
                  <span className={
                    tx.status === 'Received' ? 'badge-active' :
                    tx.status === 'Approved' ? 'badge-info' :
                    tx.status === 'Ordered' ? 'badge-pending' : 'badge-inactive'
                  }>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Resource Health */}
        <div className="card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-1">Infrastructure Status</h3>
            <p className="text-xs text-slate-400 mb-4">Kubernetes cluster and storage health</p>

            <div className="space-y-3.5">
              {[
                { name: 'FastAPI Microservice', status: 'Healthy', latency: '4ms' },
                { name: 'PostgreSQL Relational DB', status: 'Connected', latency: '2ms' },
                { name: 'Prometheus Metrics Scraper', status: 'Scraping /metrics', latency: '15s interval' },
                { name: 'Trivy Security Scanning', status: 'Zero High/Crit', latency: 'Passing' },
              ].map((sys) => (
                <div key={sys.name} className="flex items-center justify-between text-xs py-2 border-b border-canvas-border last:border-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300 font-medium">{sys.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{sys.latency}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-canvas-border bg-slate-900/40 -mx-6 -mb-6 p-4 rounded-b-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Uptime
              </span>
              <span className="font-mono text-slate-200">99.98% (34d 12h)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
