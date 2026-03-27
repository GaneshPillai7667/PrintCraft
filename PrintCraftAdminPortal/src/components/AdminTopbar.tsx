import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, Command, Search, UserCircle2, X, Check, AlertCircle, Zap, Package, Users, Activity } from 'lucide-react';

const PAGE_TITLES: Record<string, { title: string; subtitle: string; color: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Overview of platform operations and KPIs', color: 'from-indigo-500 to-violet-600' },
  '/products': { title: 'Products', subtitle: 'Manage catalog, stock, pricing and lifecycle', color: 'from-cyan-500 to-blue-600' },
  '/orders': { title: 'Orders', subtitle: 'Custom orders with manual payment and design tracking', color: 'from-emerald-500 to-teal-600' },
  '/bulk-orders': { title: 'Bulk Orders', subtitle: 'Manage B2B quotes, contact follow-up and offline payment', color: 'from-violet-500 to-fuchsia-600' },
  '/queue': { title: 'Print Queue', subtitle: 'Live production queue management', color: 'from-amber-500 to-orange-600' },
  '/analytics': { title: 'Analytics', subtitle: 'Revenue trends and performance insights', color: 'from-violet-500 to-purple-600' },
  '/cms': { title: 'CMS Builder', subtitle: 'Manage storefront sections and theme', color: 'from-pink-500 to-rose-600' },
  '/users': { title: 'Users', subtitle: 'View and manage tenant users', color: 'from-blue-500 to-cyan-600' },
};

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'New order for Other item uploaded with design file', time: '2m ago', read: false, icon: Package, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { id: 2, text: 'Queue rebalance completed — 99.1% SLA', time: '8m ago', read: false, icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 3, text: 'Bulk quote shared with Beta Corp (manual payment)', time: '15m ago', read: true, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 4, text: 'Priority rule updated by TenantAdmin', time: '1h ago', read: true, icon: AlertCircle, color: 'text-violet-600', bg: 'bg-violet-50' },
  { id: 5, text: 'New tenant onboarded: FitWear EU', time: '2h ago', read: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
];

export default function AdminTopbar() {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] ?? { title: 'Console', subtitle: 'PrintCraft Admin', color: 'from-indigo-500 to-violet-600' };
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="panel mb-4 overflow-hidden p-4 md:p-5">
      {/* Top gradient accent */}
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${page.color}`} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Page title */}
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${page.color} shadow-lg`}>
            <Activity size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-black text-slate-900 md:text-2xl">{page.title}</h1>
            <p className="text-xs text-slate-500">{page.subtitle}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search-open"
                initial={{ width: 120, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 120, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <Search size={13} className="shrink-0 text-slate-400" />
                <input
                  autoFocus
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search orders, products, vendors..."
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button onClick={() => { setSearchOpen(false); setSearchVal(''); }} className="shrink-0 text-slate-400 transition hover:text-slate-600">
                  <X size={13} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSearchOpen(true)}
                className="btn-secondary gap-2 py-2"
              >
                <Search size={14} />
                <span className="hidden md:inline">Search</span>
                <span className="hidden items-center gap-1 rounded-lg border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 md:flex">
                  <Command size={9} /> K
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifs((v) => !v)}
              className="btn-secondary relative py-2 px-3"
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={15} />
              <AnimatePresence>
                {unread > 0 && (
                  <motion.span
                    key={unread}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white"
                  >
                    {unread}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden panel shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-bold text-slate-800">Notifications</p>
                    <div className="flex items-center gap-2">
                      {unread > 0 && (
                        <button onClick={markAllRead} className="text-[10px] font-medium text-blue-600 transition hover:text-blue-700">
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setShowNotifs(false)} className="text-slate-400 transition hover:text-slate-600">
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => {
                      const Icon = n.icon;
                      return (
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50 ${!n.read ? 'bg-blue-50/60' : ''}`}
                        >
                          <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${n.bg}`}>
                            <Icon size={12} className={n.color} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs leading-relaxed ${!n.read ? 'text-slate-800' : 'text-slate-500'}`}>{n.text}</p>
                            <p className="mt-1 text-[10px] text-slate-400">{n.time}</p>
                          </div>
                          {!n.read && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />}
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2.5">
                    <button className="text-xs font-medium text-blue-600 transition hover:text-blue-700">View all notifications →</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <button className="btn-secondary gap-2 py-2">
            <UserCircle2 size={16} />
            <span className="hidden md:inline text-[13px]">Tenant Admin</span>
            <ChevronDown size={12} className="hidden md:block text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

