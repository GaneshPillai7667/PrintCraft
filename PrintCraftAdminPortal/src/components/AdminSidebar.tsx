import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, ChevronLeft, ChevronRight, Clock, Cpu, LayoutDashboard,
  Package, Settings, ShoppingCart, Sparkles, Users, Zap, LogOut,
  Activity,
} from 'lucide-react';
import { clearSession, getSession } from '../auth/adminAuth';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true, color: 'from-indigo-500 to-violet-600' },
  { to: '/products', label: 'Products', icon: Package, end: false, color: 'from-cyan-500 to-blue-600' },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, end: false, color: 'from-emerald-500 to-teal-600' },
  { to: '/bulk-orders', label: 'Bulk Orders', icon: Users, end: false, color: 'from-violet-500 to-fuchsia-600' },
  { to: '/queue', label: 'Print Queue', icon: Clock, end: false, color: 'from-amber-500 to-orange-600' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, end: false, color: 'from-violet-500 to-purple-600' },
  { to: '/cms', label: 'CMS Builder', icon: Settings, end: false, color: 'from-pink-500 to-rose-600' },
  { to: '/users', label: 'Users', icon: Users, end: false, color: 'from-blue-500 to-cyan-600' },
];

const statusItems = [
  { label: 'Prod Nodes', count: 3, color: 'bg-emerald-500', pulse: true },
  { label: 'Vendors', count: 5, color: 'bg-blue-500', pulse: false },
  { label: 'Tenants', count: 2, color: 'bg-violet-500', pulse: false },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const session = getSession();
  const userLabel = session?.role ?? 'Admin';
  const userEmail = session?.email ?? 'admin@printcraft.local';
  const initials = userLabel.slice(0, 1).toUpperCase();

  function logout() {
    clearSession();
    navigate('/login');
  }

  return (
    <aside
      className={`relative flex flex-col panel transition-all duration-300 h-fit lg:sticky lg:top-4 ${collapsed ? 'w-16' : 'w-full'}`}
    >
      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-6 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-md transition hover:bg-slate-50 hover:text-slate-700 lg:flex"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </motion.button>

      {/* Logo */}
      <div className={`border-b border-slate-100 p-4 ${collapsed ? 'px-3' : ''}`}>
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => navigate('/')}
        >
          <motion.div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20"
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Cpu size={18} className="text-white" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-heading text-sm font-black text-slate-900">PrintCraft</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin Console</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-0.5 p-3 ${collapsed ? 'px-2' : ''}`}>
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-2 px-2 text-[9px] font-black uppercase tracking-widest text-slate-400"
            >
              Navigation
            </motion.p>
          )}
        </AnimatePresence>

        {links.map((link, idx) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              title={collapsed ? link.label : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  collapsed ? 'justify-center' : ''
                } ${isActive ? 'nav-item-active' : 'nav-item'}`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                      isActive
                        ? `bg-gradient-to-br ${link.color} shadow-md`
                        : 'bg-slate-100 group-hover:bg-slate-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <Icon size={14} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'} />
                  </motion.div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.18 }}
                        className="flex-1 text-sm"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System status (expanded) */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2 border-t border-slate-100 p-3"
          >
            <p className="px-1 text-[9px] font-black uppercase tracking-widest text-slate-400">System Status</p>

            <div className="space-y-1">
              {statusItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 transition hover:bg-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 rounded-full ${item.color} ${item.pulse ? 'pulse-dot' : ''}`} />
                    <span className="text-xs text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>

            {/* Smart mode */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <Sparkles size={11} /> Smart Mode Active
              </p>
              <p className="text-[10px] leading-relaxed text-slate-500">AI priority routing and queue optimization running.</p>
            </div>

            {/* Live signal */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs text-slate-600">Live: <span className="font-bold text-emerald-600">3 active nodes</span></span>
            </div>

            {/* User profile */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:bg-slate-100">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-black text-white shadow-md">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-800">{userLabel}</p>
                <p className="text-[10px] text-slate-500">{userEmail}</p>
              </div>
              <button onClick={logout} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-200 hover:text-red-500">
                <LogOut size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed dots */}
      <AnimatePresence>
        {collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 border-t border-slate-100 p-2"
          >
            {statusItems.map((item) => (
              <div key={item.label} title={item.label} className="flex justify-center">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color} ${item.pulse ? 'pulse-dot' : ''}`} />
              </div>
            ))}
            <div className="flex justify-center" title="Smart Mode">
              <Zap size={14} className="text-blue-600" />
            </div>
            <div className="flex justify-center" title="Live Activity">
              <Activity size={14} className="text-emerald-600" />
            </div>
            <div className="flex justify-center" title="Tenant Admin">
              <Users size={14} className="text-slate-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
