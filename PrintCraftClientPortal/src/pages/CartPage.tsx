import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const kindLabel: Record<string, string> = {
  tshirt: 'T-Shirt',
  shirt: 'Shirt',
  shorts: 'Shorts',
  tanktop: 'Tank Top',
  other: 'Other Item'
};

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((x) => x.items);
  const increment = useCartStore((x) => x.increment);
  const decrement = useCartStore((x) => x.decrement);
  const remove = useCartStore((x) => x.removeItem);
  const clear = useCartStore((x) => x.clear);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 80 ? 0 : 7.5;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/shop')} className="btn-ghost text-sm">
          <ArrowLeft size={16} /> Continue Ordering
        </button>
      </div>

      {items.length === 0 ? (
        <div className="premium-card py-24 text-center">
          <h2 className="font-heading text-2xl text-slate-900">Your cart is empty</h2>
          <p className="mt-2 text-sm text-slate-600">Add a clothing item and upload your design first.</p>
          <button onClick={() => navigate('/shop')} className="btn-primary mt-4">
            Start Custom Order
          </button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-3">
            {items.map((item) => (
              <motion.div key={item.cartLineId} layout className="premium-card p-4">
                <div className="flex gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.designDataUrl ? (
                      <img src={item.designDataUrl} alt={item.designFileName || 'Design'} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">No design</div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{kindLabel[item.kind] ?? item.kind} | Size {item.size}</p>
                        {item.designFileName && <p className="text-xs text-slate-500">Design: {item.designFileName}</p>}
                        {item.customerNotes && <p className="mt-1 text-xs text-slate-600">Notes: {item.customerNotes}</p>}
                      </div>
                      <button onClick={() => remove(item.cartLineId)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
                        <button onClick={() => decrement(item.cartLineId)} className="rounded-md p-1 hover:bg-slate-100"><Minus size={14} /></button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => increment(item.cartLineId)} className="rounded-md p-1 hover:bg-slate-100"><Plus size={14} /></button>
                      </div>
                      <p className="font-heading text-xl font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <button onClick={clear} className="text-xs text-slate-500 underline underline-offset-2 hover:text-red-500">Clear cart</button>
          </section>

          <aside className="premium-card h-fit p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Order Summary</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-slate-600"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="font-heading text-xl font-bold text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-gradient mt-4 w-full">
              Proceed to Checkout <ArrowRight size={15} />
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
