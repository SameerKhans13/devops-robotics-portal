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
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20 shadow-sm">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h1 className="text-slate-900 font-bold text-sm tracking-tight flex items-center gap-1.5">
                Robotics Lab
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </h1>
              <p className="text-slate-500 text-xs font-mono">Autonomous Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
            Navigation
          </div>
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200/80 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
            >
              <Icon className="w-4 h-4 transition-colors" />
              <span>{label}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Cluster Live
            </span>
            <span className="font-mono text-slate-600 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">EKS 1.30</span>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
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
