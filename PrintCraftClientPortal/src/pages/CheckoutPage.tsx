import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { placeOrderAuthenticated } from '../services/orderService';
import { getClientSession, loginClient, registerClient } from '../services/authService';

const kindLabel: Record<string, string> = {
  tshirt: 'T-Shirt',
  shirt: 'Shirt',
  shorts: 'Shorts',
  tanktop: 'Tank Top',
  other: 'Other Item'
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((x) => x.items);
  const clear = useCartStore((x) => x.clear);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const shipping = subtotal > 80 ? 0 : 7.5;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const hasMissingDesign = items.some((x) => !x.designDataUrl);

  async function placeOrder() {
    if (!name || !email || !address || !city || !zip) {
      setMessage('Please fill all required customer and shipping fields.');
      return;
    }

    if (items.length === 0) {
      setMessage('Your cart is empty.');
      return;
    }

    if (hasMissingDesign) {
      setMessage('Each cart item must include an uploaded design image.');
      return;
    }

    if (!getClientSession()) {
      setMessage('Please login or create an account before placing your order.');
      return;
    }

    setPlacing(true);
    setMessage('');

    try {
      const result = await placeOrderAuthenticated({
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        dueDateUtc: new Date(Date.now() + 3 * 86400000).toISOString(),
        isExpress: false,
        priority: 1,
        designConfigurationJson: JSON.stringify({
          customer: { name, email, phone, address, city, zip },
          lines: items.map((item) => ({
            cartLineId: item.cartLineId,
            productId: item.id,
            itemName: item.name,
            kind: item.kind,
            size: item.size,
            quantity: item.quantity,
            notes: item.customerNotes,
            designFileName: item.designFileName,
            designMimeType: item.designMimeType,
            designDataUrl: item.designDataUrl
          }))
        })
      });

      setOrderId(result.id || `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
      clear();
    } catch {
      setMessage('Could not place order. Ensure backend is running and authenticated.');
    } finally {
      setPlacing(false);
    }
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError('');
    try {
      if (authMode === 'register') {
        if (!authName.trim()) throw new Error('Name is required for account creation.');
        await registerClient(authName.trim(), authEmail.trim(), authPassword);
      }
      await loginClient(authEmail.trim(), authPassword);
      setAuthPassword('');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setAuthSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <div className="premium-card p-10 text-center">
        <CheckCircle2 className="mx-auto text-emerald-600" size={52} />
        <h2 className="font-heading mt-3 text-3xl text-slate-900">Order Confirmed</h2>
        <p className="mt-2 text-slate-600">Your custom print order has been submitted.</p>
        <p className="mt-4 text-sm text-slate-500">Order ID</p>
        <p className="font-mono text-lg font-bold text-slate-900">{orderId}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => navigate('/queue')} className="btn-primary">Track Order</button>
          <button onClick={() => navigate('/shop')} className="btn-secondary">Create Another Order</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/cart')} className="btn-ghost text-sm"><ArrowLeft size={16} /> Back to Cart</button>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="premium-card p-6 space-y-5">
          <div>
            <h1 className="font-heading text-2xl text-slate-900">Checkout</h1>
            <p className="text-sm text-slate-600">Submit your shipping details and confirm your uploaded design order.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Full name *" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="Phone" />
          </div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="Email *" type="email" />
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" placeholder="Street address *" />
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={city} onChange={(e) => setCity(e.target.value)} className="input-field" placeholder="City *" />
            <input value={zip} onChange={(e) => setZip(e.target.value)} className="input-field" placeholder="ZIP code *" />
          </div>

          {!getClientSession() ? (
            <form onSubmit={handleAuthSubmit} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setAuthMode('login')} className={`rounded-lg px-2 py-1 text-xs ${authMode === 'login' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>Login</button>
                <button type="button" onClick={() => setAuthMode('register')} className={`rounded-lg px-2 py-1 text-xs ${authMode === 'register' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>Create account</button>
              </div>
              <div className="mt-3 grid gap-3">
                {authMode === 'register' && <input value={authName} onChange={(e) => setAuthName(e.target.value)} className="input-field" placeholder="Full name" />}
                <input value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="input-field" placeholder="Email" type="email" required />
                <div className="relative">
                  <input
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="Password"
                    type={showAuthPassword ? 'text' : 'password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword((value) => !value)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700"
                    aria-label={showAuthPassword ? 'Hide password' : 'Show password'}
                  >
                    {showAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {authError && <p className="mt-2 text-sm text-red-600">{authError}</p>}
              <button type="submit" className="btn-secondary mt-3 text-sm" disabled={authSubmitting}>
                {authSubmitting ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account and login'}
              </button>
            </form>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Logged in as {getClientSession()?.email || 'customer'}
            </div>
          )}

          {message && <p className="text-sm text-red-600">{message}</p>}

          <button onClick={() => void placeOrder()} disabled={placing || !getClientSession()} className="btn-gradient w-full disabled:opacity-60">
            {placing ? 'Placing Order...' : 'Confirm and Place Order'}
          </button>
        </section>

        <aside className="premium-card h-fit p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Order Review</p>

          <div className="mt-3 space-y-3">
            {items.map((item) => (
              <div key={item.cartLineId} className="rounded-xl border border-slate-200 p-3">
                <div className="flex gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded bg-slate-100">
                    {item.designDataUrl ? (
                      <img src={item.designDataUrl} alt={item.designFileName || 'Design'} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-slate-400">No design</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{kindLabel[item.kind] ?? item.kind} | Size {item.size} | Qty {item.quantity}</p>
                    {item.designFileName && <p className="text-xs text-slate-500 truncate">{item.designFileName}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="mt-1 flex justify-between text-slate-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="mt-1 flex justify-between text-slate-600"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="mt-2 flex justify-between font-semibold text-slate-900"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <p className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-600" /> Uploaded design metadata is included in the order payload.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
