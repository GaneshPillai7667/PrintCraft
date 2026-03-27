import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, AlertCircle, CheckCircle2, ChevronDown, ChevronRight,
  Clock, Package, PackageCheck, RefreshCw, Search, Truck, Zap
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:7129';

const STAGES = ['Received', 'Printing', 'Quality Check', 'Packaging', 'Shipped'] as const;
type Stage = typeof STAGES[number];

interface QueueItem {
  id: string;
  customer: string;
  product: string;
  qty: number;
  stage: Stage;
  priority: 'High' | 'Normal' | 'Rush';
  updatedAt: string;
  eta?: string;
  sku?: string;
}

const MOCK_QUEUE: QueueItem[] = [
  { id: 'ORD-7821', customer: 'Apex Branding Co.', product: 'Logo Hoodie — Navy XL', qty: 48, stage: 'Printing', priority: 'High', updatedAt: '14 min ago', eta: '2h 30m', sku: 'HOD-NVY-XL' },
  { id: 'ORD-7820', customer: 'Sarah Mitchell', product: 'Custom Mug — 11oz', qty: 6, stage: 'Quality Check', priority: 'Normal', updatedAt: '31 min ago', eta: '45m', sku: 'MUG-11OZ' },
  { id: 'ORD-7819', customer: 'Riverside Schools', product: 'Team T-Shirt — White M', qty: 120, stage: 'Packaging', priority: 'Rush', updatedAt: '1h 10m ago', eta: '1h 15m', sku: 'TEE-WHT-M' },
  { id: 'ORD-7818', customer: 'TechCorp Ltd.', product: 'Embroidered Cap — Black', qty: 24, stage: 'Received', priority: 'Normal', updatedAt: '2h ago', eta: '5h', sku: 'CAP-BLK' },
  { id: 'ORD-7817', customer: 'Luna & Co.', product: 'Tote Bag — Natural', qty: 30, stage: 'Shipped', priority: 'Normal', updatedAt: '3h ago', sku: 'BAG-NAT' },
  { id: 'ORD-7816', customer: 'Urban Ink Studio', product: 'Zip Hoodie — Charcoal', qty: 15, stage: 'Printing', priority: 'Rush', updatedAt: '3h 45m ago', eta: '1h', sku: 'ZHD-CHR' },
];

const STAGE_CONFIG: Record<Stage, { icon: React.ElementType; color: string; bg: string; border: string; glow: string }> = {
  'Received':      { icon: Package,      color: 'text-slate-600',   bg: 'bg-slate-100',   border: 'border-slate-200',  glow: 'shadow-slate-200' },
  'Printing':      { icon: Activity,     color: 'text-blue-600',    bg: 'bg-blue-100',    border: 'border-blue-200',   glow: 'shadow-blue-200' },
  'Quality Check': { icon: AlertCircle,  color: 'text-amber-600',   bg: 'bg-amber-100',   border: 'border-amber-200',  glow: 'shadow-amber-200' },
  'Packaging':     { icon: PackageCheck, color: 'text-violet-600',  bg: 'bg-violet-100',  border: 'border-violet-200', glow: 'shadow-violet-200' },
  'Shipped':       { icon: Truck,        color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200',glow: 'shadow-emerald-200' },
};

const PRIORITY_CONFIG = {
  Rush:   { cls: 'bg-red-100 text-red-700 border border-red-200',    dot: 'bg-red-500' },
  High:   { cls: 'bg-amber-100 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
  Normal: { cls: 'bg-slate-100 text-slate-600 border border-slate-200', dot: 'bg-slate-400' },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 },
});

export default function QueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState<Stage | 'All'>('All');
  const [advancing, setAdvancing] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQueue = async () => {
    try {
      const res = await fetch(`${API}/api/queue`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data);
    } catch {
      setItems(MOCK_QUEUE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQueue();
    setTimeout(() => setRefreshing(false), 600);
  };

  const advanceStage = async (id: string) => {
    setAdvancing(id);
    try {
      const res = await fetch(`${API}/api/queue/${id}/advance`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const updated: QueueItem = await res.json();
      setItems(prev => prev.map(it => it.id === id ? updated : it));
    } catch {
      setItems(prev => prev.map(it => {
        if (it.id !== id) return it;
        const idx = STAGES.indexOf(it.stage);
        return idx < STAGES.length - 1 ? { ...it, stage: STAGES[idx + 1] } : it;
      }));
    } finally {
      setAdvancing(null);
    }
  };

  const stageCounts = STAGES.reduce((acc, s) => {
    acc[s] = items.filter(i => i.stage === s).length;
    return acc;
  }, {} as Record<Stage, number>);

  const filtered = items.filter(it => {
    const matchStage = filterStage === 'All' || it.stage === filterStage;
    const q = search.toLowerCase();
    const matchSearch = !q || it.id.toLowerCase().includes(q) || it.customer.toLowerCase().includes(q) || it.product.toLowerCase().includes(q);
    return matchStage && matchSearch;
  });

  return (
    <div className="space-y-4">

      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black text-slate-900">Production Queue</h1>
          <p className="text-sm text-slate-500">{items.length} orders in pipeline · live tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-600">Live</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.6 }}>
              <RefreshCw size={13} />
            </motion.div>
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Stage Pipeline */}
      <motion.div {...fadeUp(0.05)} className="panel p-4">
        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Production Pipeline</p>
        <div className="flex items-center gap-0">
          {STAGES.map((stage, idx) => {
            const cfg = STAGE_CONFIG[stage];
            const Icon = cfg.icon;
            const count = stageCounts[stage] ?? 0;
            const isActive = filterStage === stage;
            return (
              <div key={stage} className="flex flex-1 items-center">
                <motion.button
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setFilterStage(isActive ? 'All' : stage)}
                  className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                    isActive
                      ? `${cfg.bg} ${cfg.border} shadow-lg ${cfg.glow}`
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? cfg.bg : 'bg-slate-100'}`}>
                    <Icon size={16} className={isActive ? cfg.color : 'text-slate-400'} />
                  </div>
                  <span className={`text-[10px] font-bold leading-tight ${isActive ? cfg.color : 'text-slate-400'}`}>{stage}</span>
                  <span className={`text-lg font-black leading-none ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{count}</span>
                </motion.button>
                {idx < STAGES.length - 1 && (
                  <ChevronRight size={14} className="mx-0.5 shrink-0 text-slate-300" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Search + Filter */}
      <motion.div {...fadeUp(0.1)} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search order ID, customer or product…"
            className="admin-input w-full pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Priority:</span>
          {(['All', 'Rush', 'High', 'Normal'] as const).map(p => (
            <button key={p} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Queue List */}
      <motion.div {...fadeUp(0.15)} className="panel overflow-hidden p-0">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1.5fr_auto_auto_auto_auto] items-center gap-4 border-b border-slate-100 px-5 py-3">
          {['Order', 'Customer / Product', 'Qty', 'Priority', 'Stage', 'Actions'].map(h => (
            <span key={h} className="text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</span>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-16">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i} className="h-2.5 w-2.5 rounded-full bg-blue-500"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-16 text-slate-400">
            <Package size={36} strokeWidth={1.2} />
            <p className="text-sm font-semibold">No orders match your filter</p>
          </motion.div>
        )}

        {/* Rows */}
        <AnimatePresence initial={false}>
          {filtered.map((item, idx) => {
            const cfg = STAGE_CONFIG[item.stage];
            const StageIcon = cfg.icon;
            const priCfg = PRIORITY_CONFIG[item.priority];
            const stageIdx = STAGES.indexOf(item.stage);
            const isExpanded = expandedId === item.id;
            const isLast = item.stage === 'Shipped';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.04 }}
                className="border-b border-slate-100 last:border-0"
              >
                {/* Main Row */}
                <div
                  className="grid cursor-pointer grid-cols-[1fr_1.5fr_auto_auto_auto_auto] items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Order ID */}
                  <div className="flex items-center gap-2">
                    <motion.div whileHover={{ rotate: isExpanded ? -90 : 90 }} className="text-slate-400">
                      <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </motion.div>
                    <div>
                      <p className="font-mono text-sm font-bold text-slate-800">{item.id}</p>
                      <p className="text-[10px] text-slate-400">{item.updatedAt}</p>
                    </div>
                  </div>

                  {/* Customer + Product */}
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.customer}</p>
                    <p className="text-xs text-slate-500">{item.product}</p>
                  </div>

                  {/* Qty */}
                  <div className="flex h-7 w-9 items-center justify-center rounded-md bg-slate-100 text-sm font-black text-slate-700">
                    {item.qty}
                  </div>

                  {/* Priority */}
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${priCfg.cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${priCfg.dot}`} />
                    {item.priority}
                  </span>

                  {/* Stage */}
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                    <StageIcon size={11} />
                    {item.stage}
                  </span>

                  {/* Actions */}
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    disabled={isLast || advancing === item.id}
                    onClick={e => { e.stopPropagation(); advanceStage(item.id); }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      isLast
                        ? 'cursor-default bg-slate-100 text-slate-400'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                  >
                    {advancing === item.id ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}>
                        <RefreshCw size={12} />
                      </motion.div>
                    ) : isLast ? (
                      <>
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        Done
                      </>
                    ) : (
                      <>
                        <Zap size={12} />
                        Advance
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                        <div className="mb-4 flex items-center gap-6">
                          {item.sku && (
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">SKU</p>
                              <p className="font-mono text-xs font-semibold text-slate-700">{item.sku}</p>
                            </div>
                          )}
                          {item.eta && (
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ETA to Next Stage</p>
                              <div className="flex items-center gap-1">
                                <Clock size={11} className="text-amber-600" />
                                <p className="text-xs font-semibold text-amber-600">{item.eta}</p>
                              </div>
                            </div>
                          )}
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantity</p>
                            <p className="text-xs font-semibold text-slate-700">{item.qty} units</p>
                          </div>
                        </div>

                        {/* Stage Progress */}
                        <div>
                          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Pipeline Progress</p>
                          <div className="flex items-center gap-0">
                            {STAGES.map((s, i) => {
                              const sCfg = STAGE_CONFIG[s];
                              const SIcon = sCfg.icon;
                              const isDone = i < stageIdx;
                              const isCurrent = i === stageIdx;
                              return (
                                <div key={s} className="flex flex-1 items-center">
                                  <div className={`flex flex-1 flex-col items-center gap-1 rounded-lg p-2 ${
                                    isCurrent ? `${sCfg.bg} border ${sCfg.border}` : ''
                                  }`}>
                                    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                      isDone ? 'bg-emerald-100' : isCurrent ? sCfg.bg : 'bg-slate-100'
                                    }`}>
                                      {isDone
                                        ? <CheckCircle2 size={13} className="text-emerald-600" />
                                        : <SIcon size={13} className={isCurrent ? sCfg.color : 'text-slate-400'} />
                                      }
                                    </div>
                                    <span className={`text-[9px] font-bold ${isDone ? 'text-emerald-600' : isCurrent ? sCfg.color : 'text-slate-400'}`}>{s}</span>
                                  </div>
                                  {i < STAGES.length - 1 && (
                                    <div className={`h-px w-3 ${i < stageIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Footer Stats */}
      <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Active', value: items.filter(i => i.stage !== 'Shipped').length, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Rush Orders', value: items.filter(i => i.priority === 'Rush').length, icon: Zap, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
          { label: 'Shipped Today', value: items.filter(i => i.stage === 'Shipped').length, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Avg. Priority High', value: `${Math.round((items.filter(i => i.priority !== 'Normal').length / Math.max(items.length, 1)) * 100)}%`, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} {...fadeUp(0.2 + i * 0.05)} className={`kpi-card border p-4 ${stat.bg}`}>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <Icon size={14} className={stat.color} />
              </div>
              <p className={`mt-2 font-heading text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

    </div>
  );
}
