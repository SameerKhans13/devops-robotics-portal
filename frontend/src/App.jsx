import { Routes, Route, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, FolderKanban, ShoppingCart,
  DollarSign, Building2, Bot, ChevronRight, Activity
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Projects from './pages/Projects'
import Expenses from './pages/Expenses'
import Purchases from './pages/Purchases'
import Vendors from './pages/Vendors'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/members', icon: Users, label: 'Lab Members' },
  { to: '/projects', icon: FolderKanban, label: 'Lab Projects' },
  { to: '/expenses', icon: DollarSign, label: 'Expenses' },
  { to: '/purchases', icon: ShoppingCart, label: 'Purchases' },
  { to: '/vendors', icon: Building2, label: 'Vendors' },
]

export default function App() {
  return (
    <div className="flex h-screen bg-canvas-darkest overflow-hidden text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col flex-shrink-0 z-20">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500/20 to-blue-600/30 border border-sky-400/30 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/10">
              <Bot className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm tracking-tight flex items-center gap-1.5">
                Robotics Lab
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-xs font-mono tracking-wide">Autonomous Systems</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 font-mono">
            Navigation
          </div>
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/15 to-transparent text-sky-400 border border-sky-500/30 shadow-md shadow-sky-500/5 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 hover:border hover:border-slate-700/50'
                }`
              }
            >
              <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>{label}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Cluster Live
            </span>
            <span className="font-mono text-slate-500 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">EKS 1.30</span>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto bg-canvas-darkest">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/vendors" element={<Vendors />} />
        </Routes>
      </main>
    </div>
  )
}
