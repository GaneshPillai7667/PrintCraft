import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, History, MapPinned, Repeat2, Star, Package, Truck,
  CheckCircle2, Clock, ArrowRight, ShieldCheck, Bell,
  Edit3, Heart, Settings, CreditCard, BarChart3,
} from 'lucide-react';

const timeline = [
  { step: 'Order received', time: '08:15 AM', state: 'done', icon: Package },
  { step: 'Design validated', time: '08:36 AM', state: 'done', icon: CheckCircle2 },
  { step: 'Queued for production', time: '09:02 AM', state: 'active', icon: Clock },
  { step: 'In print', time: '--', state: 'pending', icon: Edit3 },
  { step: 'Packed & ready', time: '--', state: 'pending', icon: Gift },
  { step: 'Out for delivery', time: '--', state: 'pending', icon: Truck },
];

const recentOrders = [
  { id: 'ORD-9831', item: 'Essential T-Shirt × 2', status: 'Shipped', amount: '$48', date: 'Feb 22', icon: '👕' },
  { id: 'ORD-9612', item: 'Premium Hoodie × 1', status: 'Delivered', amount: '$45', date: 'Feb 18', icon: '🧥' },
  { id: 'ORD-9407', item: 'Athletic Tank × 3', status: 'Delivered', amount: '$66', date: 'Feb 10', icon: '🎽' },
];

const quickActions = [
  { icon: Repeat2, label: 'Reorder', value: 'Last order', color: 'from-blue-500 to-indigo-600' },
  { icon: MapPinned, label: 'Addresses', value: '5 saved', color: 'from-teal-500 to-emerald-600' },
  { icon: Gift, label: 'Loyalty Points', value: '1,280 pts', color: 'from-amber-500 to-orange-500' },
  { icon: Star, label: 'Tier', value: '🥇 Gold', color: 'from-yellow-400 to-amber-500' },
];

const savedDesigns = [
  { name: 'Summer Tee', color: 'from-blue-400 to-indigo-500', type: '👕' },
  { name: 'Team Hoodie', color: 'from-violet-400 to-purple-500', type: '🧥' },
  { name: 'Promo Tank', color: 'from-teal-400 to-emerald-500', type: '🎽' },
  { name: 'Classic Logo', color: 'from-amber-400 to-orange-500', type: '👕' },
  { name: 'Sport Short', color: 'from-red-400 to-rose-500', type: '🩳' },
  { name: 'Cozy Sweat', color: 'from-indigo-400 to-blue-500', type: '🧤' },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemAnim = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PortalPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'designs'>('overview');

  return (
    <div className="space-y-5">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card overflow-hidden p-5 md:p-7"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
        <div className="relative pt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-black text-white shadow-xl ring-4 ring-white">
                  J
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              </div>
              <div className="mb-1">
                <h1 className="font-heading text-2xl font-black text-slate-900">John Smith</h1>
                <p className="text-sm text-slate-500">john@example.com · Gold Member</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">🥇 Gold Tier</span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">1,280 pts</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary text-sm gap-1.5">
                <Settings size={14} /> Settings
              </button>
              <button className="btn-primary text-sm">
                <Edit3 size={14} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total Orders', value: '24', icon: Package, color: 'text-blue-600 bg-blue-50' },
            { label: 'Spent this year', value: '$1,284', icon: CreditCard, color: 'text-violet-600 bg-violet-50' },
            { label: 'Saved Designs', value: '6', icon: Heart, color: 'text-red-500 bg-red-50' },
            { label: 'Loyalty Points', value: '1,280', icon: Star, color: 'text-amber-600 bg-amber-50' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                <div className={`mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={16} />
                </div>
                <p className="font-heading text-xl font-black text-slate-900">{stat.value}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 rounded-xl border border-slate-100 bg-slate-50 p-1">
          {(['overview', 'orders', 'designs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2 text-xs font-bold capitalize transition ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {activeTab === 'overview' && (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Order Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="premium-card p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">Current Order</h3>
                <p className="text-xs text-slate-500">ORD-9831 · Feb 22, 2026</p>
              </div>
              <span className="badge-blue">In Progress</span>
            </div>

            <div className="relative space-y-1">
              <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-gradient-to-b from-emerald-300 via-blue-300 to-slate-100" />
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-center gap-4 py-2"
                  >
                    <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                      item.state === 'done'
                        ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                        : item.state === 'active'
                        ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                        : 'bg-white border border-slate-200'
                    }`}>
                      <Icon
                        size={14}
                        className={
                          item.state === 'done' ? 'text-white' :
                          item.state === 'active' ? 'text-white' :
                          'text-slate-300'
                        }
                      />
                      {item.state === 'active' && (
                        <span className="absolute -inset-1 rounded-xl border-2 border-blue-400 pulse-ring" />
                      )}
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <p className={`text-sm font-semibold ${
                        item.state === 'done' ? 'text-emerald-700' :
                        item.state === 'active' ? 'text-blue-700' :
                        'text-slate-400'
                      }`}>
                        {item.step}
                      </p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <button className="mt-4 w-full rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100">
              View Full Tracking <ArrowRight size={14} className="inline" />
            </button>
          </motion.div>

          <div className="space-y-4">
            {/* Quick actions */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="premium-card p-5"
            >
              <h3 className="mb-4 font-heading text-base font-bold text-slate-900">Quick Access</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.label}
                      variants={itemAnim}
                      className="flex flex-col items-start gap-2 rounded-xl border border-slate-100 bg-white p-3.5 text-left transition hover:border-slate-200 hover:shadow-sm"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-sm`}>
                        <Icon size={15} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{action.label}</p>
                        <p className="text-[11px] text-slate-500">{action.value}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell size={14} className="text-blue-500" /> Notifications
                </h3>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition">Mark all read</button>
              </div>
              <div className="space-y-2.5">
                {[
                  { text: 'Your order ORD-9831 shipped!', time: '2h ago', unread: true, icon: Truck, color: 'bg-blue-100 text-blue-600' },
                  { text: 'Design approved for production', time: '1d ago', unread: true, icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
                  { text: 'New loyalty tier: Gold unlocked!', time: '3d ago', unread: false, icon: Star, color: 'bg-amber-100 text-amber-600' },
                ].map((notif, i) => {
                  const Icon = notif.icon;
                  return (
                    <div key={i} className={`flex items-start gap-3 rounded-xl p-3 transition ${notif.unread ? 'bg-blue-50/60' : 'bg-slate-50'}`}>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notif.color}`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800">{notif.text}</p>
                        <p className="text-[10px] text-slate-400">{notif.time}</p>
                      </div>
                      {notif.unread && <span className="h-2 w-2 shrink-0 mt-1 rounded-full bg-blue-500" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card overflow-hidden"
        >
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-slate-900">Order History</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <History size={12} /> Synced in real-time
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
              >
                <motion.div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-2xl"
                  whileHover={{ scale: 1.1, rotate: 8 }}
                >
                  {order.icon}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">{order.id}</p>
                  <p className="text-sm text-slate-500">{order.item}</p>
                  <p className="text-xs text-slate-400">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{order.amount}</p>
                  <span className={`text-xs font-semibold ${
                    order.status === 'Shipped' ? 'text-blue-600' :
                    order.status === 'Delivered' ? 'text-emerald-600' :
                    'text-slate-500'
                  }`}>
                    {order.status === 'Delivered' ? '✓ ' : ''}{order.status}
                  </span>
                </div>
                <button className="btn-secondary px-3 py-1.5 text-xs">
                  Reorder
                </button>
              </motion.div>
            ))}
          </div>
          <div className="border-t border-slate-100 px-5 py-3">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition flex items-center gap-1">
              View all orders <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      )}

      {activeTab === 'designs' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-slate-900">Saved Designs</h3>
            <div className="flex items-center gap-2">
              <BarChart3 size={14} className="text-slate-400" />
              <span className="text-sm text-slate-500">6 designs saved</span>
            </div>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {savedDesigns.map((design) => (
              <motion.div
                key={design.name}
                variants={itemAnim}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100 p-4 cursor-pointer transition"
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`mb-3 flex h-16 items-center justify-center rounded-xl bg-gradient-to-br ${design.color} text-4xl shadow-sm`}>
                  {design.type}
                </div>
                <p className="text-xs font-bold text-slate-800">{design.name}</p>
                <p className="text-[10px] text-slate-400">Ready to order</p>
                <button className="mt-2 w-full rounded-lg bg-white px-2 py-1.5 text-[10px] font-bold text-slate-700 shadow-sm transition opacity-0 group-hover:opacity-100 hover:bg-blue-50 hover:text-blue-700">
                  Quick Reorder →
                </button>
              </motion.div>
            ))}
            <motion.div
              variants={itemAnim}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-4 text-center transition hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Edit3 size={16} className="text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-500">Save New Design</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Bottom loyalty section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 p-6 text-white"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
        </div>
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Star size={18} className="fill-white text-white" />
              <p className="font-heading text-xl font-black">Gold Member Benefits</p>
            </div>
            <p className="text-white/80 text-sm">You have <span className="font-black text-white">1,280 points</span> — redeem for free shipping or discounts!</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl bg-white px-5 py-2.5 text-sm font-black text-amber-700 shadow-lg transition hover:shadow-xl">
              Redeem Points
            </button>
            <button className="flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/25">
              <ShieldCheck size={14} /> View Perks
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


