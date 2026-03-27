import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, BarChart2, CheckCircle2, Edit3, Package,
  Plus, Search, Tag, Trash2, TrendingUp, X
} from 'lucide-react';
import { adminProducts, type AdminProduct } from '../data/mock';

type ProductRow = AdminProduct;

const CATEGORY_COLORS: Record<string, string> = {
  'T-Shirts':  'bg-indigo-100 text-indigo-700',
  'Shirts':    'bg-cyan-100 text-cyan-700',
  'Shorts':    'bg-violet-100 text-violet-700',
  'Tank Tops': 'bg-emerald-100 text-emerald-700',
  'Other':     'bg-amber-100 text-amber-700',
};

const CATEGORY_ICONS: Record<string, string> = {
  'T-Shirts': 'TS',
  'Shirts': 'SH',
  'Shorts': 'SR',
  'Tank Tops': 'TT',
  'Other': 'OT',
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 },
});

export default function ProductsPage() {
  const [productRows, setProductRows] = useState<ProductRow[]>(adminProducts as ProductRow[]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft'>('All');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filtered = useMemo(() =>
    productRows.filter(x => {
      const matchText = `${x.name} ${x.category}`.toLowerCase().includes(query.toLowerCase());
      const matchStatus = statusFilter === 'All' || x.status === statusFilter;
      return matchText && matchStatus;
    }),
    [productRows, query, statusFilter]
  );

  const notify = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  function addProduct() {
    const newId = `p${Date.now()}`;
    setProductRows(prev => [
      { id: newId, name: `New Custom Product ${prev.length + 1}`, category: 'Other', stock: 0, status: 'Draft', price: 0, sold: 0 },
      ...prev,
    ]);
    notify('Draft product created. Click Edit to configure it.');
  }

  function startEdit(item: ProductRow) {
    setEditingId(item.id); setEditName(item.name); setEditPrice(item.price); setEditStock(item.stock);
  }

  function saveEdit(id: string) {
    setProductRows(prev => prev.map(x => x.id === id ? { ...x, name: editName, price: editPrice, stock: editStock } : x));
    setEditingId(null); notify('Product saved successfully.');
  }

  function toggleStatus(id: string) {
    setProductRows(prev => prev.map(x => x.id === id ? { ...x, status: x.status === 'Active' ? 'Draft' : 'Active' } : x));
  }

  function removeProduct(id: string) {
    setProductRows(prev => prev.filter(x => x.id !== id));
    setSelected(prev => { const s = new Set(prev); s.delete(id); return s; });
    notify('Product removed.');
  }

  function toggleSelect(id: string) {
    setSelected(prev => { const s = new Set(prev); if (s.has(id)) s.delete(id); else s.add(id); return s; });
  }

  function bulkActivate() {
    setProductRows(prev => prev.map(x => selected.has(x.id) ? { ...x, status: 'Active' } : x));
    setSelected(new Set()); notify(`${selected.size} products activated.`);
  }

  function bulkDelete() {
    setProductRows(prev => prev.filter(x => !selected.has(x.id)));
    setSelected(new Set()); notify('Selected products deleted.');
  }

  const stats = [
    { label: 'Total Products', value: productRows.length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { label: 'Active Listings', value: productRows.filter(x => x.status === 'Active').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'Units Sold', value: productRows.reduce((s, x) => s + x.sold, 0).toLocaleString(), icon: TrendingUp, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100' },
    { label: 'Low Stock (<20)', value: productRows.filter(x => x.stock < 20).length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="space-y-4">

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} {...fadeUp(i * 0.06)} className={`kpi-card border p-4 ${s.bg}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                  <p className={`mt-2 font-heading text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-white/[0.06] ${s.bg}`}>
                  <Icon size={16} className={s.color} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Panel */}
      <motion.div {...fadeUp(0.1)} className="panel p-5">

        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-black text-slate-900">Product Catalog</h2>
            <p className="text-xs text-slate-500">Manage visibility, stock, pricing and lifecycle</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex overflow-hidden rounded-lg border border-slate-200">
              {(['table', 'grid'] as const).map(v => (
                <button
                  key={v} onClick={() => setViewMode(v)}
                  className={`px-3 py-1.5 text-xs font-bold transition ${viewMode === v ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:text-slate-700'}`}
                >
                  {v === 'table' ? '⊟ Table' : '⊞ Grid'}
                </button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={addProduct}
              className="btn-primary gap-1.5 text-sm"
            >
              <Plus size={14} /> Add Product
            </motion.button>
          </div>
        </div>

        {/* Feedback Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="flex items-center justify-between overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} />
                {message}
              </div>
              <button onClick={() => setMessage('')}><X size={13} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative flex-1" style={{ minWidth: 180 }}>
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search products…"
              className="admin-input w-full pl-9 text-sm"
            />
          </div>
          {(['All', 'Active', 'Draft'] as const).map(s => (
            <button
              key={s} onClick={() => setStatusFilter(s)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === s
                  ? s === 'Active' ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                  : s === 'Draft' ? 'border-amber-200 bg-amber-100 text-amber-700'
                  : 'border-slate-200 bg-slate-100 text-slate-800'
                  : 'border-slate-100 bg-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {s}
              <span className="ml-1.5 rounded bg-slate-100 px-1 text-[10px] text-slate-500">
                {s === 'All' ? productRows.length : productRows.filter(x => x.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mb-3 flex items-center gap-3 overflow-hidden rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5"
            >
              <span className="text-sm font-bold text-blue-700">{selected.size} selected</span>
              <button onClick={bulkActivate} className="rounded-lg border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-200">Activate All</button>
              <button onClick={bulkDelete} className="rounded-lg border border-red-200 bg-red-100 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-200">Delete All</button>
              <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-slate-500 hover:text-slate-700">Clear selection</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-8">
                    <input type="checkbox" className="rounded accent-indigo-500"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={() => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(x => x.id)))}
                    />
                  </th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((item, idx) => {
                    const catColor = CATEGORY_COLORS[item.category] ?? 'bg-slate-500/20 text-slate-400';
                    const catEmoji = CATEGORY_ICONS[item.category] ?? '📦';
                    return (
                      <motion.tr
                        key={item.id} layout
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <td>
                          <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="rounded accent-indigo-500" />
                        </td>

                        {editingId === item.id ? (
                          <>
                            <td className="primary">
                              <input value={editName} onChange={e => setEditName(e.target.value)} className="admin-input py-1 text-xs" />
                            </td>
                            <td>{item.category}</td>
                            <td>
                              <input type="number" value={editStock} onChange={e => setEditStock(Number(e.target.value))} className="admin-input w-20 py-1 text-xs" />
                            </td>
                            <td>{item.sold}</td>
                            <td>
                              <input type="number" value={editPrice} onChange={e => setEditPrice(Number(e.target.value))} className="admin-input w-20 py-1 text-xs" />
                            </td>
                            <td />
                            <td>
                              <div className="flex gap-1.5">
                                <button onClick={() => saveEdit(item.id)} className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-500">Save</button>
                                <button onClick={() => setEditingId(null)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800">Cancel</button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="primary">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base">
                                  {catEmoji}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800">{item.name}</p>
                                  <p className="text-[10px] text-slate-400">ID: {item.id}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${catColor}`}>{item.category}</span>
                            </td>
                            <td>
                              <div className="flex items-center gap-1.5">
                                <span className={`font-semibold ${item.stock < 20 ? 'text-amber-600' : 'text-slate-700'}`}>{item.stock}</span>
                                {item.stock < 20 && <AlertTriangle size={11} className="text-amber-400" />}
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-1">
                                <BarChart2 size={11} className="text-slate-400" />
                                <span>{item.sold.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="font-semibold text-slate-800">${item.price}</td>
                            <td>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleStatus(item.id)}
                                className={`rounded-full border px-2.5 py-1 text-xs font-bold transition hover:opacity-80 ${
                                  item.status === 'Active'
                                    ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                                    : 'border-amber-200 bg-amber-100 text-amber-700'
                                }`}
                              >
                                {item.status}
                              </motion.button>
                            </td>
                            <td>
                              <div className="flex gap-1">
                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => startEdit(item)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600" title="Edit">
                                  <Edit3 size={12} />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => removeProduct(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100" title="Delete">
                                  <Trash2 size={12} />
                                </motion.button>
                              </div>
                            </td>
                          </>
                        )}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
                <Package size={32} strokeWidth={1.2} />
                <p className="text-sm">No products match your search</p>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filtered.map((item, idx) => {
                const catColor = CATEGORY_COLORS[item.category] ?? 'bg-slate-500/20 text-slate-400';
                const catEmoji = CATEGORY_ICONS[item.category] ?? '📦';
                return (
                  <motion.div
                    key={item.id} layout
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`group relative overflow-hidden rounded-xl border p-4 transition ${
                      selected.has(item.id) ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                        {catEmoji}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="rounded accent-indigo-500" />
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          item.status === 'Active' ? 'border-emerald-200 bg-emerald-100 text-emerald-700' : 'border-amber-200 bg-amber-100 text-amber-700'
                        }`}>{item.status}</span>
                      </div>
                    </div>
                    <p className="mb-0.5 font-semibold text-slate-800 leading-snug">{item.name}</p>
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${catColor} mb-3`}>{item.category}</span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-slate-50 py-1.5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Stock</p>
                        <p className={`text-sm font-black ${item.stock < 20 ? 'text-amber-400' : 'text-slate-200'}`}>{item.stock}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 py-1.5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Sold</p>
                        <p className="text-sm font-black text-slate-800">{item.sold}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 py-1.5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Price</p>
                        <p className="text-sm font-black text-slate-800">${item.price}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      <button onClick={() => startEdit(item)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600">
                        <Edit3 size={11} /> Edit
                      </button>
                      <button onClick={() => toggleStatus(item.id)} className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
                        <Tag size={11} className="inline mr-1" />Toggle
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>{filtered.length} of {productRows.length} products</span>
          <span className="flex gap-3">
            <span className="text-emerald-500">{productRows.filter(x => x.status === 'Active').length} active</span>
            <span className="text-amber-500">{productRows.filter(x => x.status === 'Draft').length} draft</span>
            <span className="text-red-500">{productRows.filter(x => x.stock < 20).length} low stock</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

