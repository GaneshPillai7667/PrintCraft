import { motion } from 'framer-motion';
import {
  Area, AreaChart, Bar, BarChart, Cell, PieChart, Pie,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import {
  Activity, ArrowUpRight, CheckCircle2, Clock, Package,
  ShoppingCart, TrendingUp, Users, Zap, ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import Admin3DWidget from '../components/Admin3DWidget';

const orderTrend = [
  { day: 'Mon', orders: 120, revenue: 5880 },
  { day: 'Tue', orders: 180, revenue: 8820 },
  { day: 'Wed', orders: 165, revenue: 8085 },
  { day: 'Thu', orders: 210, revenue: 10290 },
  { day: 'Fri', orders: 250, revenue: 12250 },
  { day: 'Sat', orders: 235, revenue: 11515 },
  { day: 'Sun', orders: 195, revenue: 9555 },
];

const channelSplit = [
  { name: 'Retail', value: 58, color: '#6366f1' },
  { name: 'B2B', value: 24, color: '#06b6d4' },
  { name: 'Franchise', value: 18, color: '#8b5cf6' },
];

const topProducts = [
  { name: 'Essential T-Shirt', units: 1340 },
  { name: 'Signature Mug', units: 1620 },
  { name: 'Premium Hoodie', units: 820 },
  { name: 'Phone Case', units: 970 },
  { name: 'Travel Cup', units: 420 },
];

const CHART_COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'rgba(255, 255, 255, 0.97)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#1e293b',
    fontSize: '12px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
  },
  cursor: { fill: 'rgba(15,23,42,0.03)' },
};

const recentActivity = [
  { text: 'Priority rule updated — VIP threshold raised', time: '2m ago', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { text: '12 new SKUs synced from Vendor #3', time: '8m ago', icon: Package, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { text: 'Queue rebalance job completed — 99.1% SLA', time: '15m ago', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { text: 'Homepage banner published to all regions', time: '32m ago', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
  { text: 'B2B quote approved — Beta Corp $1,480', time: '1h ago', icon: ShoppingCart, color: 'text-violet-600', bg: 'bg-violet-50' },
  { text: 'New tenant onboarded: FitWear EU', time: '2h ago', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const kpis = [
  {
    label: 'Net Revenue', value: '$42,380', delta: '+12.4%', positive: true, sub: 'vs last week',
    icon: TrendingUp, gradient: 'from-indigo-50 via-indigo-50/60 to-transparent', border: 'border-indigo-200',
    glow: 'rgba(99,102,241,0.08)',
  },
  {
    label: 'Orders Today', value: '264', delta: '+8.1%', positive: true, sub: '34 in queue',
    icon: ShoppingCart, gradient: 'from-cyan-50 via-cyan-50/60 to-transparent', border: 'border-cyan-200',
    glow: 'rgba(6,182,212,0.08)',
  },
  {
    label: 'Avg. Order Value', value: '$61.50', delta: '+4.7%', positive: true, sub: 'last 7 days',
    icon: Activity, gradient: 'from-violet-50 via-violet-50/60 to-transparent', border: 'border-violet-200',
    glow: 'rgba(139,92,246,0.08)',
  },
  {
    label: 'Queue SLA', value: '99.1%', delta: '+1.2%', positive: true, sub: 'on-time delivery',
    icon: Clock, gradient: 'from-emerald-50 via-emerald-50/60 to-transparent', border: 'border-emerald-200',
    glow: 'rgba(16,185,129,0.08)',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] },
});

export default function DashboardPage() {
  return (
    <div className="space-y-4">

      {/* ── KPI cards ─────────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              {...fadeUp(idx * 0.06)}
              className={`kpi-card relative overflow-hidden bg-gradient-to-br ${kpi.gradient} border ${kpi.border} p-5`}
            >
              {/* Background glow */}
              <div
                className="absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl pointer-events-none"
                style={{ background: kpi.glow }}
              />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{kpi.label}</p>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 + 0.2 }}
                      className="mt-2 font-heading text-3xl font-black text-slate-900"
                    >
                      {kpi.value}
                    </motion.p>
                    <p className="mt-0.5 text-xs text-slate-500">{kpi.sub}</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200">
                    <Icon size={18} className="text-slate-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  {kpi.positive ? (
                    <ArrowUpRight size={13} className="text-emerald-600" />
                  ) : (
                    <ArrowDownRight size={13} className="text-red-500" />
                  )}
                  <span className={`text-xs font-bold ${kpi.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {kpi.delta}
                  </span>
                  <span className="text-xs text-slate-400">this week</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Charts row 1 ──────────────────────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <motion.div {...fadeUp(0.1)} className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-black text-slate-900">Order Throughput</h3>
              <p className="text-xs text-slate-500">Daily orders and revenue this week</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <span className="badge-emerald text-[10px]">Live</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Area yAxisId="left" type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2.5} fill="url(#ordGrad)" name="Orders" dot={false} activeDot={{ r: 5, fill: '#6366f1' }} />
                <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue ($)" dot={false} activeDot={{ r: 5, fill: '#06b6d4' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.15)} className="panel p-5">
          <h3 className="mb-1 font-heading text-base font-black text-slate-900">Sales Channels</h3>
          <p className="mb-4 text-xs text-slate-500">Revenue split by channel type</p>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelSplit}
                  innerRadius={40}
                  outerRadius={64}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {channelSplit.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {channelSplit.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color, opacity: 0.8 }} />
                  </div>
                  <span className="text-xs font-black text-slate-800">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Charts row 2 ──────────────────────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <motion.div {...fadeUp(0.2)} className="panel p-5">
          <h3 className="mb-1 font-heading text-base font-black text-slate-900">Live Ops Signal</h3>
          <p className="mb-3 text-xs text-slate-500">3 active production nodes</p>
          <Admin3DWidget />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Node Alpha', status: 'Online', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Node Beta', status: 'Online', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Node Gamma', status: 'Syncing', color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((n) => (
              <div key={n.label} className={`rounded-xl ${n.bg} p-2.5 text-center`}>
                <div className="mb-1 flex justify-center">
                  <div className={`h-2 w-2 rounded-full ${n.color.replace('text-', 'bg-')} pulse-dot`} />
                </div>
                <p className="text-[10px] text-slate-500">{n.label}</p>
                <p className={`text-xs font-bold ${n.color}`}>{n.status}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.25)} className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-black text-slate-900">Top Products</h3>
              <p className="text-xs text-slate-500">Units sold this month</p>
            </div>
            <Sparkles size={14} className="text-indigo-500" />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={112} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="units" name="Units" radius={[0, 8, 8, 0]} maxBarSize={20}>
                  {topProducts.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Activity feed ─────────────────────────────────────── */}
      <motion.div {...fadeUp(0.3)} className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-black text-slate-900">Activity Feed</h3>
            <p className="text-xs text-slate-500">Recent platform events</p>
          </div>
          <button className="btn-secondary py-1.5 text-xs">View All</button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recentActivity.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.06 }}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition hover:bg-slate-100"
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
                  <Icon size={13} className={item.color} />
                </div>
                <div>
                  <p className="text-xs leading-relaxed text-slate-700">{item.text}</p>
                  <p className="mt-1.5 text-[10px] text-slate-400">{item.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
