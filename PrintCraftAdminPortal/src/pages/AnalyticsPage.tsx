import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { ArrowUpRight, DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';

const TOOLTIP_STYLE = {
  contentStyle: { background: 'rgba(255,255,255,0.97)', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#1e293b', fontSize: '12px', boxShadow: '0 4px 20px rgba(15,23,42,0.08)' },
  cursor: { fill: 'rgba(15,23,42,0.04)' },
};

const revenueData = [
  { month: 'Aug', revenue: 28000, orders: 820, customers: 340 },
  { month: 'Sep', revenue: 32000, orders: 950, customers: 390 },
  { month: 'Oct', revenue: 29500, orders: 870, customers: 360 },
  { month: 'Nov', revenue: 38000, orders: 1120, customers: 460 },
  { month: 'Dec', revenue: 45000, orders: 1320, customers: 520 },
  { month: 'Jan', revenue: 41000, orders: 1200, customers: 490 },
  { month: 'Feb', revenue: 42380, orders: 1264, customers: 510 },
];

const categoryRevenue = [
  { category: 'Apparel', revenue: 24800, units: 2160 },
  { category: 'Drinkware', revenue: 12200, units: 2040 },
  { category: 'Accessories', revenue: 5380, units: 970 },
];

const channelPerf = [
  { channel: 'Direct Retail', revenue: 24580, orders: 734, conversion: 3.8 },
  { channel: 'B2B Orders', revenue: 10171, orders: 303, conversion: 12.4 },
  { channel: 'Franchise', revenue: 7629, orders: 227, conversion: 8.2 },
];

const COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];

const metricCards = [
  { label: 'Total Revenue (MTD)', value: '$42,380', delta: '+12.4%', icon: DollarSign, gradient: 'from-indigo-50 via-indigo-50/60 to-transparent', border: 'border-indigo-200' },
  { label: 'Avg. Order Value', value: '$61.50', delta: '+4.7%', icon: ShoppingCart, gradient: 'from-cyan-50 via-cyan-50/60 to-transparent', border: 'border-cyan-200' },
  { label: 'New Customers', value: '510', delta: '+9.2%', icon: Users, gradient: 'from-violet-50 via-violet-50/60 to-transparent', border: 'border-violet-200' },
  { label: 'Revenue per Customer', value: '$83.10', delta: '+3.1%', icon: TrendingUp, gradient: 'from-emerald-50 via-emerald-50/60 to-transparent', border: 'border-emerald-200' },
];

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay } });

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div key={m.label} {...fadeUp(idx * 0.06)} className={`kpi-card bg-gradient-to-br ${m.gradient} border ${m.border} p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{m.label}</p>
                  <p className="mt-2 font-heading text-3xl font-black text-slate-900">{m.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200">
                  <Icon size={18} className="text-slate-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                <ArrowUpRight size={13} className="text-emerald-600" />
                <span className="text-xs font-black text-emerald-600">{m.delta}</span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue trend */}
      <motion.div {...fadeUp(0.1)} className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg text-slate-900">Revenue & Orders Trend</h3>
            <p className="text-xs text-slate-500">Last 7 months performance</p>
          </div>
          <span className="badge-emerald">Monthly</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="ordGradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#818cf8" fill="url(#revGradA)" strokeWidth={2.5} name="Revenue ($)" />
              <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#22d3ee" fill="url(#ordGradA)" strokeWidth={2.5} name="Orders" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category + Channel */}
      <div className="grid gap-4 xl:grid-cols-2">
        <motion.div {...fadeUp(0.15)} className="panel p-5">
          <h3 className="mb-1 font-heading text-lg text-slate-900">Revenue by Category</h3>
          <p className="mb-4 text-xs text-slate-500">Breakdown by product type</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRevenue} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="revenue" name="Revenue ($)" radius={[6, 6, 0, 0]}>
                  {categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="panel p-5">
          <h3 className="mb-1 font-heading text-lg text-slate-900">Customer Growth</h3>
          <p className="mb-4 text-xs text-slate-500">Monthly unique customers</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} name="Customers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Channel performance table */}
      <motion.div {...fadeUp(0.25)} className="panel p-5">
        <h3 className="mb-4 font-heading text-lg text-slate-900">Channel Performance</h3>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Conv. Rate</th>
                <th>% Share</th>
              </tr>
            </thead>
            <tbody>
              {channelPerf.map((ch, idx) => {
                const totalRev = channelPerf.reduce((s, c) => s + c.revenue, 0);
                const share = ((ch.revenue / totalRev) * 100).toFixed(1);
                return (
                  <tr key={ch.channel}>
                    <td className="primary">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                        {ch.channel}
                      </div>
                    </td>
                    <td className="font-semibold text-slate-800">${ch.revenue.toLocaleString()}</td>
                    <td>{ch.orders.toLocaleString()}</td>
                    <td>
                      <span className="badge-emerald">{ch.conversion}%</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${share}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
