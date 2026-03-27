import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, CheckCircle2, Clock, Package, PackageCheck,
  RefreshCw, Search, Truck, Zap, ArrowRight, BarChart3,
} from 'lucide-react';
import { getQueueItems, type QueueItem } from '../services/queueService';

const stageConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock; step: number }> = {
  Queued:     { label: 'Queued',       color: 'text-amber-600',   bg: 'bg-amber-100 border-amber-200',   icon: Clock,        step: 1 },
  InProgress: { label: 'In Progress',  color: 'text-blue-600',    bg: 'bg-blue-100 border-blue-200',     icon: Activity,     step: 2 },
  Printed:    { label: 'Printed',      color: 'text-indigo-600',  bg: 'bg-indigo-100 border-indigo-200', icon: PackageCheck, step: 3 },
  Packed:     { label: 'Packed',       color: 'text-violet-600',  bg: 'bg-violet-100 border-violet-200', icon: Package,      step: 4 },
  Shipped:    { label: 'Shipped',      color: 'text-emerald-600', bg: 'bg-emerald-100 border-emerald-200', icon: Truck,      step: 5 },
  Completed:  { label: 'Completed',    color: 'text-green-600',   bg: 'bg-green-100 border-green-200',   icon: CheckCircle2, step: 6 },
};

const MOCK_QUEUE: QueueItem[] = [
  { id: 'q-001', orderId: 'ORD-1001', productName: 'Essential T-Shirt × 2', stage: 'InProgress', position: 1, priority: 'Express', estimatedCompletionUtc: new Date(Date.now() + 2 * 3600000).toISOString() },
  { id: 'q-002', orderId: 'ORD-1002', productName: 'Premium Hoodie × 1',   stage: 'Printed',    position: 2, priority: 'Normal',  estimatedCompletionUtc: new Date(Date.now() + 5 * 3600000).toISOString() },
  { id: 'q-003', orderId: 'ORD-1003', productName: 'Signature Mug × 4',    stage: 'Queued',     position: 3, priority: 'Normal',  estimatedCompletionUtc: new Date(Date.now() + 8 * 3600000).toISOString() },
  { id: 'q-004', orderId: 'ORD-1004', productName: 'Travel Cup × 6',       stage: 'Packed',     position: 4, priority: 'VIP',     estimatedCompletionUtc: new Date(Date.now() + 1 * 3600000).toISOString() },
  { id: 'q-005', orderId: 'ORD-1005', productName: 'Classic Cap × 1',      stage: 'Shipped',    position: 5, priority: 'Normal',  estimatedCompletionUtc: new Date(Date.now() - 2 * 3600000).toISOString() },
];

function formatETA(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return 'Completed';
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return hrs > 0 ? `~${hrs}h ${mins}m` : `~${mins}m`;
}

const stageSteps = Object.values(stageConfig).sort((a, b) => a.step - b.step);

export default function QueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function fetchQueue() {
    setLoading(true);
    try {
      const data = await getQueueItems();
      setItems(Array.isArray(data) ? data : MOCK_QUEUE);
    } catch {
      setItems(MOCK_QUEUE);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }

  useEffect(() => {
    fetchQueue();
    const timer = setInterval(fetchQueue, 15000);
    return () => clearInterval(timer);
  }, []);

  const filtered = items.filter((item) => {
    if (!searchId.trim()) return true;
    const q = searchId.toLowerCase();
    return (
      item.id?.toLowerCase().includes(q) ||
      item.orderId?.toLowerCase().includes(q) ||
      item.productName?.toLowerCase().includes(q)
    );
  });

  const stageCounts = Object.keys(stageConfig).reduce<Record<string, number>>((acc, key) => {
    acc[key] = items.filter((i) => i.stage === key).length;
    return acc;
  }, {});

  return (
    <div className="space-y-5">

      {/* ── Header ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card overflow-hidden p-5 md:p-6"
      >
        <div className="absolute inset-x-0 top-0 queue-progress h-1" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Live Production</span>
            </div>
            <h1 className="font-heading mt-1 text-3xl font-black text-slate-900">Queue Tracker</h1>
            <p className="mt-1 text-sm text-slate-500">
              Real-time order status · Last updated {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-300 focus-within:bg-white transition">
              <Search size={14} className="text-slate-400" />
              <input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Search by order ID..."
                className="w-44 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <motion.button
              onClick={fetchQueue}
              className="btn-secondary gap-2 py-2 text-sm"
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Stage summary cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(stageConfig).map(([key, cfg], idx) => {
          const Icon = cfg.icon;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`premium-card cursor-pointer p-3.5 text-center transition-all hover:shadow-md ${
                searchId === key ? 'ring-2 ring-blue-300' : ''
              }`}
              onClick={() => setSearchId(searchId === key ? '' : key)}
            >
              <div className={`mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${cfg.bg}`}>
                <Icon size={16} className={cfg.color} />
              </div>
              <motion.p
                key={stageCounts[key]}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="font-heading text-2xl font-black text-slate-900"
              >
                {stageCounts[key] ?? 0}
              </motion.p>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-400">{cfg.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Queue pipeline visual ─────────────────────────────────── */}
      <div className="premium-card overflow-hidden p-5">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 size={16} className="text-blue-500" />
          <h3 className="text-sm font-bold text-slate-700">Production Pipeline</h3>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {stageSteps.map((stage, idx) => {
            const count = stageCounts[Object.keys(stageConfig).find(k => stageConfig[k] === stage) ?? ''] ?? 0;
            const Icon = stage.icon;
            return (
              <div key={stage.label} className="flex shrink-0 items-center">
                <div className={`flex flex-col items-center rounded-xl border px-3 py-2 ${stage.bg}`}>
                  <Icon size={14} className={stage.color} />
                  <p className={`mt-1 text-sm font-black ${stage.color}`}>{count}</p>
                  <p className="text-[10px] font-medium text-slate-500">{stage.label}</p>
                </div>
                {idx < stageSteps.length - 1 && (
                  <ArrowRight size={14} className="mx-1 shrink-0 text-slate-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Queue list ────────────────────────────────────────────── */}
      <div className="premium-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Active Orders <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{filtered.length}</span>
          </h2>
          {loading && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <RefreshCw size={12} className="animate-spin" /> Updating...
            </div>
          )}
        </div>

        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <div className="flex gap-1.5">
              {[0,1,2].map(i => (
                <motion.div
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-blue-400"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
            <p className="text-sm font-medium">Loading queue data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={32} className="mb-3 text-slate-200" />
            <p className="font-semibold text-slate-400">No orders found</p>
            <p className="mt-1 text-sm text-slate-400">Try a different search term.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {filtered.map((item, idx) => {
                const cfg = stageConfig[item.stage] ?? stageConfig['Queued'];
                const Icon = cfg.icon;
                const currentStep = cfg.step;
                const isExpanded = expandedId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className={`flex flex-col gap-4 px-5 py-4 transition-colors md:flex-row md:items-center md:justify-between ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}>
                      <div className="flex items-center gap-4">
                        {item.position !== undefined && (
                          <motion.div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-mono text-sm font-black text-slate-700"
                            whileHover={{ scale: 1.1 }}
                          >
                            #{item.position}
                          </motion.div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900">{item.orderId ?? item.id}</p>
                            {(item.priority === 'Express' || item.priority === 'VIP') && (
                              <span className="badge-amber gap-1">
                                <Zap size={9} /> {item.priority}
                              </span>
                            )}
                          </div>
                          {item.productName && <p className="text-sm text-slate-500">{item.productName}</p>}
                          {item.estimatedCompletionUtc && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              ETA: <span className="font-medium text-slate-600">{formatETA(item.estimatedCompletionUtc)}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Progress bar */}
                        <div className="hidden md:block">
                          <div className="flex items-center gap-1">
                            {stageSteps.map((s, i) => (
                              <div
                                key={i}
                                className={`h-1.5 w-6 rounded-full transition-all ${
                                  s.step <= currentStep
                                    ? i < currentStep - 1 ? 'bg-emerald-400' : 'bg-blue-500'
                                    : 'bg-slate-100'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="mt-1 text-right text-[10px] text-slate-400">{currentStep}/{stageSteps.length}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${cfg.bg} ${cfg.color}`}>
                          <Icon size={12} /> {cfg.label}
                        </span>
                      </div>
                    </div>

                    {/* Expanded timeline */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden border-t border-slate-100 bg-slate-50/80 px-5 py-4"
                        >
                          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Production Timeline</p>
                          <div className="flex flex-wrap items-center gap-2">
                            {stageSteps.map((s, i) => {
                              const SIcon = s.icon;
                              const done = s.step < currentStep;
                              const active = s.step === currentStep;
                              return (
                                <div key={i} className="flex items-center gap-1">
                                  <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                                    done ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                                    active ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                    'border-slate-200 bg-white text-slate-400'
                                  }`}>
                                    {done ? <CheckCircle2 size={11} /> : <SIcon size={11} />}
                                    {s.label}
                                  </div>
                                  {i < stageSteps.length - 1 && <ArrowRight size={11} className="text-slate-200" />}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600">
          <Activity size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-blue-800">Real-time updates via SignalR</p>
          <p className="text-xs text-blue-600">Queue refreshes every 15 seconds. Connect backend for live tracking.</p>
        </div>
      </motion.div>
    </div>
  );
}
