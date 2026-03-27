import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Users } from 'lucide-react';
import { adminBulkOrders } from '../data/mock';

type BulkStatus = 'All' | 'New Lead' | 'Quoted' | 'Negotiation' | 'Confirmed' | 'In Production';

const STATUS_COLOR: Record<Exclude<BulkStatus, 'All'>, string> = {
  'New Lead': 'bg-slate-100 text-slate-700 border-slate-200',
  Quoted: 'bg-blue-100 text-blue-700 border-blue-200',
  Negotiation: 'bg-amber-100 text-amber-700 border-amber-200',
  Confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'In Production': 'bg-violet-100 text-violet-700 border-violet-200'
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 }
});

export default function BulkOrdersPage() {
  const [status, setStatus] = useState<BulkStatus>('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    return adminBulkOrders.filter((x) => {
      const statusMatch = status === 'All' || x.status === status;
      const query = q.trim().toLowerCase();
      const queryMatch = !query || `${x.id} ${x.company} ${x.contactPerson} ${x.productMix}`.toLowerCase().includes(query);
      return statusMatch && queryMatch;
    });
  }, [status, q]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <motion.div {...fadeUp(0)} className="kpi-card border border-blue-100 bg-blue-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bulk Leads</p>
          <p className="mt-2 font-heading text-3xl font-black text-blue-700">{adminBulkOrders.length}</p>
        </motion.div>
        <motion.div {...fadeUp(0.04)} className="kpi-card border border-amber-100 bg-amber-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Needs Follow-up</p>
          <p className="mt-2 font-heading text-3xl font-black text-amber-700">{adminBulkOrders.filter((x) => x.paymentStatus === 'Pending Contact').length}</p>
        </motion.div>
        <motion.div {...fadeUp(0.08)} className="kpi-card border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pipeline Value</p>
          <p className="mt-2 font-heading text-3xl font-black text-emerald-700">${adminBulkOrders.reduce((sum, x) => sum + x.estimatedAmount, 0).toLocaleString()}</p>
        </motion.div>
      </div>

      <motion.div {...fadeUp(0.12)} className="panel p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-black text-slate-900">Bulk Orders and Quotes</h2>
            <p className="text-xs text-slate-500">Manage enterprise/bulk inquiries, quote flow, and offline payment coordination.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="admin-input w-full pl-9 text-sm" placeholder="Search company, quote, product mix..." />
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {(['All', 'New Lead', 'Quoted', 'Negotiation', 'Confirmed', 'In Production'] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${status === s ? 'border-slate-300 bg-slate-100 text-slate-800' : 'border-slate-100 text-slate-500 hover:text-slate-700'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bulk ID</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Units</th>
                <th>Product Mix</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Estimated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="primary">
                    <p className="font-mono text-sm font-bold text-slate-800">{item.id}</p>
                  </td>
                  <td>{item.company}</td>
                  <td>
                    <p className="text-sm text-slate-700">{item.contactPerson}</p>
                    <p className="text-xs text-slate-500">{item.contactEmail}</p>
                  </td>
                  <td>{item.totalUnits}</td>
                  <td>{item.productMix}</td>
                  <td>{item.requestedDate}</td>
                  <td>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${STATUS_COLOR[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${item.paymentStatus === 'Paid Offline' ? 'border-emerald-200 bg-emerald-100 text-emerald-700' : item.paymentStatus === 'Quote Sent' ? 'border-amber-200 bg-amber-100 text-amber-700' : 'border-red-200 bg-red-100 text-red-700'}`}>
                      {item.paymentStatus}
                    </span>
                  </td>
                  <td className="font-semibold text-slate-800">${item.estimatedAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-10 text-center text-sm text-slate-500">No bulk orders found.</div>}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
            <p className="font-bold">Recommended bulk workflow</p>
            <p className="mt-1">Lead intake -&gt; Quote -&gt; Customer confirmation -&gt; Offline payment collection -&gt; Production.</p>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs text-violet-700">
            <p className="font-bold flex items-center gap-1.5"><Users size={12} /> Team actions</p>
            <p className="mt-1">Assign account manager, log follow-up calls, and attach design approval notes for each bulk account.</p>
          </div>
        </div>

        <button className="btn-primary mt-4 text-sm"><MessageSquare size={14} /> Create New Bulk Quote</button>
      </motion.div>
    </div>
  );
}

