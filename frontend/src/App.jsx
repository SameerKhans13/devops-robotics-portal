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
      <aside className="w-64 bg-canvas-dark border-r border-canvas-border flex flex-col flex-shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-canvas-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm tracking-tight">Robotics Lab</h1>
              <p className="text-slate-400 text-xs font-mono">Operations Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
            Navigation
          </div>
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
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
        <div className="p-4 border-t border-canvas-border bg-canvas-darkest/40">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Portal Live
            </span>
            <span className="font-mono text-slate-500 text-[11px]">v1.0.0</span>
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
