import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, PhoneCall, Search, Truck, Zap } from 'lucide-react';
import { adminOrders, type AdminOrder } from '../data/mock';

type OrderStatus = 'All' | 'Queued' | 'In Production' | 'Shipped';
type TypeFilter = 'All' | 'Standard' | 'Bulk';

const STATUS_BADGE: Record<AdminOrder['status'], string> = {
  Queued: 'border-amber-200 bg-amber-100 text-amber-700',
  'In Production': 'border-blue-200 bg-blue-100 text-blue-700',
  Shipped: 'border-emerald-200 bg-emerald-100 text-emerald-700'
};

const PAYMENT_BADGE: Record<AdminOrder['paymentStatus'], string> = {
  'Pending Contact': 'border-red-200 bg-red-100 text-red-700',
  'Quote Sent': 'border-amber-200 bg-amber-100 text-amber-700',
  'Paid Offline': 'border-emerald-200 bg-emerald-100 text-emerald-700'
};

const CLOTHING_LABEL: Record<AdminOrder['clothingType'], string> = {
  tshirt: 'T-Shirt',
  shirt: 'Shirt',
  shorts: 'Shorts',
  tanktop: 'Tank Top',
  other: 'Other Item'
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 }
});

export default function OrdersPage() {
  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:7129';
  const [orders, setOrders] = useState<AdminOrder[]>(adminOrders);
  const [status, setStatus] = useState<OrderStatus>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(adminOrders[0]?.id ?? null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch(`${API}/api/v1/orders`);
        if (!response.ok) return;
        const payload = await response.json();
        const rows = (Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []) as any[];

        const mapped: AdminOrder[] = rows.map((x: any) => {
          let parsedConfig: any = null;
          try {
            parsedConfig = x.designConfigurationJson || x.DesignConfigurationJson
              ? JSON.parse(x.designConfigurationJson ?? x.DesignConfigurationJson)
              : null;
          } catch {
            parsedConfig = null;
          }

          const firstLine = Array.isArray(parsedConfig?.lines) ? parsedConfig.lines[0] : null;
          const rawStatus = String(x.status ?? x.Status ?? 'Queued');
          const mappedStatus: AdminOrder['status'] =
            rawStatus === 'InProduction' || rawStatus === 'In Production'
              ? 'In Production'
              : rawStatus === 'Shipped'
              ? 'Shipped'
              : 'Queued';

          const priority: AdminOrder['priority'] = Number(x.priority ?? x.Priority ?? 1) >= 2 ? 'Express' : 'Normal';
          const quantity = Number(firstLine?.quantity ?? 1);
          const orderType: AdminOrder['orderType'] = quantity >= 50 ? 'Bulk' : 'Standard';
          const clothingType = String(firstLine?.kind ?? 'other');
          const normalizedClothing: AdminOrder['clothingType'] =
            clothingType === 'tshirt' || clothingType === 'shirt' || clothingType === 'shorts' || clothingType === 'tanktop'
              ? clothingType
              : 'other';

          const paymentStatus: AdminOrder['paymentStatus'] = 'Pending Contact';
          const paymentMode: AdminOrder['paymentMode'] = 'Manual Contact';

          return {
            id: String(x.id ?? x.Id ?? ''),
            customer: String(parsedConfig?.customer?.name ?? x.customerName ?? x.CustomerName ?? 'Customer'),
            amount: Number(x.totalAmount ?? x.TotalAmount ?? 0),
            status: mappedStatus,
            date: String(x.createdAtUtc ?? x.CreatedAtUtc ?? '').slice(0, 10) || new Date().toISOString().slice(0, 10),
            priority,
            orderType,
            paymentStatus,
            paymentMode,
            clothingType: normalizedClothing,
            size: String(firstLine?.size ?? 'M'),
            quantity,
            designFileName: String(firstLine?.designFileName ?? 'Uploaded design'),
            notes: String(firstLine?.notes ?? ''),
            contactPhone: String(parsedConfig?.customer?.phone ?? '')
          };
        }).filter((x) => x.id);

        if (mapped.length > 0) {
          setOrders(mapped);
          setSelectedId((prev) => prev ?? mapped[0].id);
        }
      } catch {
        // Keep local mock data when API is unavailable.
      }
    }
    void loadOrders();
  }, [API]);

  const filtered = useMemo(() => {
    return orders.filter((x) => {
      const statusMatch = status === 'All' || x.status === status;
      const typeMatch = typeFilter === 'All' || x.orderType === typeFilter;
      const q = query.trim().toLowerCase();
      const text = `${x.id} ${x.customer} ${x.designFileName} ${x.clothingType}`.toLowerCase();
      const queryMatch = !q || text.includes(q);
      return statusMatch && typeMatch && queryMatch;
    });
  }, [orders, status, typeFilter, query]);

  const selectedOrder = filtered.find((x) => x.id === selectedId) ?? filtered[0] ?? null;

  const stats = [
    { label: 'Queued', value: orders.filter((x) => x.status === 'Queued').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { label: 'In Production', value: orders.filter((x) => x.status === 'In Production').length, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
    { label: 'Bulk Orders', value: orders.filter((x) => x.orderType === 'Bulk').length, icon: Truck, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
    { label: 'Manual Payment Pending', value: orders.filter((x) => x.paymentStatus === 'Pending Contact').length, icon: PhoneCall, color: 'text-red-600', bg: 'bg-red-50 border-red-100' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} {...fadeUp(i * 0.06)} className={`kpi-card border p-4 ${s.bg}`}>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                <Icon size={14} className={s.color} />
              </div>
              <p className={`mt-2 font-heading text-3xl font-black ${s.color}`}>{s.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <motion.div {...fadeUp(0.1)} className="panel p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-black text-slate-900">Custom Orders</h2>
              <p className="text-xs text-slate-500">No payment gateway. Collect payment by customer contact and update status manually.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order, design file..." className="admin-input w-full pl-9 text-sm" />
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {(['All', 'Queued', 'In Production', 'Shipped'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${status === s ? 'border-slate-300 bg-slate-100 text-slate-800' : 'border-slate-100 text-slate-500 hover:text-slate-700'}`}
              >
                {s}
              </button>
            ))}
            {(['All', 'Standard', 'Bulk'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${typeFilter === t ? 'border-blue-300 bg-blue-100 text-blue-700' : 'border-slate-100 text-slate-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Clothing</th>
                  <th>Qty</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className={selectedOrder?.id === order.id ? 'bg-blue-50' : ''} onClick={() => setSelectedId(order.id)}>
                    <td className="primary">
                      <p className="font-mono text-sm font-bold text-slate-800">{order.id}</p>
                      <p className="text-[10px] text-slate-500">{order.date}</p>
                    </td>
                    <td>{order.customer}</td>
                    <td>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${order.orderType === 'Bulk' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700'}`}>
                        {order.orderType}
                      </span>
                    </td>
                    <td>{CLOTHING_LABEL[order.clothingType]}</td>
                    <td>{order.quantity}</td>
                    <td>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${PAYMENT_BADGE[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${STATUS_BADGE[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-slate-500">No orders found for this filter.</div>
            )}
          </div>
        </motion.div>

        <motion.aside {...fadeUp(0.16)} className="panel h-fit p-5">
          {selectedOrder ? (
            <div className="space-y-4">
              <div>
                <p className="font-mono text-xs text-slate-500">{selectedOrder.id}</p>
                <h3 className="font-heading text-lg font-black text-slate-900">Order Details</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">Customer</p><p className="font-semibold text-slate-800">{selectedOrder.customer}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">Amount</p><p className="font-semibold text-slate-800">${selectedOrder.amount}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">Order Type</p><p className="font-semibold text-slate-800">{selectedOrder.orderType}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">Payment Mode</p><p className="font-semibold text-slate-800">{selectedOrder.paymentMode}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">Clothing</p><p className="font-semibold text-slate-800">{CLOTHING_LABEL[selectedOrder.clothingType]}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">Size / Qty</p><p className="font-semibold text-slate-800">{selectedOrder.size} / {selectedOrder.quantity}</p></div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Design File</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{selectedOrder.designFileName}</p>
                {selectedOrder.notes && <p className="mt-2 text-xs text-slate-600">Notes: {selectedOrder.notes}</p>}
                {selectedOrder.contactPhone && <p className="mt-2 text-xs text-slate-600">Contact: {selectedOrder.contactPhone}</p>}
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
                Payment workflow: Contact customer -&gt; confirm amount -&gt; collect offline payment -&gt; update payment status.
              </div>

              <button className="btn-primary w-full justify-center text-sm">
                <CheckCircle2 size={14} /> Mark Payment Collected (Offline)
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Select an order to view details.</p>
          )}
        </motion.aside>
      </div>
    </div>
  );
}

