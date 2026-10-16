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
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">{label}</p>
        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
            {trend && (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                {trend}
              </span>
            )}
            <span>{subtitle}</span>
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:scale-105 transition-all duration-200 ${color || 'text-slate-600'}`}>
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
        <div className="flex items-center gap-3 text-sky-600">
          <Cpu className="w-5 h-5 animate-spin" />
          <span className="font-mono text-sm text-slate-600">Loading metrics...</span>
        </div>
      </div>
    )
  }

  const cards = [
    {
      label: 'Lab Personnel',
      value: stats.total_members,
      icon: Users,
      color: 'text-sky-600',
      subtitle: `${stats.active_members} on active duty`,
      trend: '92% active',
    },
    {
      label: 'Active Projects',
      value: stats.total_projects,
      icon: FolderKanban,
      color: 'text-indigo-600',
      subtitle: `${stats.active_projects} ongoing sprints`,
      trend: '2 in progress',
    },
    {
      label: 'Cumulative Spend',
      value: formatCurrency(stats.total_expenses),
      icon: DollarSign,
      color: 'text-emerald-600',
      subtitle: 'Across all active milestones',
      trend: 'Budget tracked',
    },
    {
      label: 'Purchase Orders',
      value: stats.total_purchase_orders,
      icon: ShoppingCart,
      color: 'text-amber-600',
      subtitle: `${formatCurrency(stats.pending_purchases)} in fulfillment`,
      trend: '2 pending',
    },
    {
      label: 'Approved Vendors',
      value: stats.total_vendors,
      icon: Building2,
      color: 'text-cyan-600',
      subtitle: 'Suppliers with valid agreements',
      trend: 'Verified',
    },
    {
      label: 'Monthly Requisition',
      value: formatCurrency(stats.monthly_spending),
      icon: TrendingUp,
      color: 'text-purple-600',
      subtitle: 'Current billing period',
      trend: 'On pace',
    },
  ]

  const activeHardwareUnits = [
    {
      id: 1,
      name: 'Titan-X Autonomous Quadruped',
      category: 'Rough-Terrain Robotics',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
      status: 'Active Field Testing',
      operator: 'Dr. Elena Rostova',
      battery: '94%',
    },
    {
      id: 2,
      name: 'Nautilus Deep-Water ROV',
      category: 'Subsea Computer Vision',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      status: 'Calibrating Sensors',
      operator: 'Kenji Sato',
      battery: '88%',
    },
    {
      id: 3,
      name: 'AeroGlide High-Altitude Drone',
      category: 'Autonomous Aerial Survey',
      image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80',
      status: 'Hangar Ready',
      operator: 'Sarah Jenkins',
      battery: '100%',
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
      {/* Top Banner with Robotics Lab Hero Graphic */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
            alt="Robotics backdrop"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-medium mb-3 border border-sky-400/30">
            <Cpu className="w-3.5 h-3.5" /> Robotics Automation Command Center
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Autonomous Systems Operations</h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Centralized monitoring of research initiatives, hardware procurement, vendor logistics, and multi-sensor telemetry running on AWS EKS Kubernetes.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <span className="badge-active bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Telemetry Online
            </span>
            <span className="text-xs font-mono text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
              UTC {new Date().toISOString().slice(0, 10)}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Featured Robotics Hardware Units */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Active Robotics Hardware</h3>
            <p className="text-xs text-slate-500">Autonomous systems currently deployed across testing grounds</p>
          </div>
          <span className="text-xs font-mono text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
            3 Systems Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeHardwareUnits.map((robot) => (
            <div key={robot.id} className="card p-0 overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all">
              <div className="h-44 overflow-hidden relative bg-slate-100">
                <img
                  src={robot.image}
                  alt={robot.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 text-[11px] font-bold font-mono px-2.5 py-1 rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm border border-slate-200">
                  ⚡ {robot.battery}
                </span>
                <span className="absolute bottom-3 left-3 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-sm">
                  {robot.category}
                </span>
              </div>
              <div className="p-5">
                <h4 className="text-sm font-bold text-slate-900">{robot.name}</h4>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span>Lead: <strong className="text-slate-700">{robot.operator}</strong></span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {robot.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases & Transactions */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Hardware Orders</h3>
              <p className="text-xs text-slate-500">Requisitions and deliveries underway</p>
            </div>
            <a href="/purchases" className="text-xs text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-800">{tx.title}</p>
                  <p className="text-xs text-slate-500">{tx.vendor} • <span className="font-mono text-slate-400">{tx.date}</span></p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-bold font-mono text-slate-900">{formatCurrency(tx.amount)}</p>
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
            <h3 className="text-base font-bold text-slate-900 mb-1">Infrastructure Status</h3>
            <p className="text-xs text-slate-500 mb-4">Kubernetes cluster and cloud storage</p>

            <div className="space-y-3">
              {[
                { name: 'FastAPI Microservice', status: 'Healthy', latency: '4ms' },
                { name: 'PostgreSQL Relational DB', status: 'Connected', latency: '2ms' },
                { name: 'Prometheus Metrics Scraper', status: 'Scraping /metrics', latency: '15s interval' },
                { name: 'Trivy Security Scanning', status: 'Zero High/Crit', latency: 'Passing' },
              ].map((sys) => (
                <div key={sys.name} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700 font-medium">{sys.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{sys.latency}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                Uptime
              </span>
              <span className="font-mono text-slate-800 font-semibold">99.98% (34d 12h)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
