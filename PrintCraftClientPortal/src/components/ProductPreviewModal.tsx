import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Paintbrush, Plus, RotateCcw, ShoppingCart, Star, Type, X, Zap } from 'lucide-react';
import type { Product } from '../data/products';
import ModelCanvas from './ModelCanvas';

type Props = {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product) => void;
};

const colorOptions = [
  { hex: '#1e293b', label: 'Slate' },
  { hex: '#1d4ed8', label: 'Blue' },
  { hex: '#7c3aed', label: 'Violet' },
  { hex: '#dc2626', label: 'Red' },
  { hex: '#0f766e', label: 'Teal' },
  { hex: '#ca8a04', label: 'Amber' },
  { hex: '#ffffff', label: 'White' },
  { hex: '#0ea5e9', label: 'Sky' },
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
const apparelKinds = ['tshirt', 'hoodie', 'tanktop', 'shorts', 'joggers', 'sweatshirt'];

export default function ProductPreviewModal({ product, onClose, onAdd }: Props) {
  const [color, setColor] = useState(colorOptions[0].hex);
  const [quantity, setQuantity] = useState(1);
  const [engraving, setEngraving] = useState('');
  const [size, setSize] = useState('M');
  const [rotationFast, setRotationFast] = useState(false);

  const spin = useMemo(() => (rotationFast ? 0.018 : 0.007), [rotationFast]);
  const isApparel = product ? apparelKinds.includes(product.kind) : false;

  function handleAdd() {
    if (!product) return;
    for (let i = 0; i < quantity; i += 1) onAdd(product);
    onClose();
  }

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Interactive Fit Configurator</p>
                <h3 className="mt-0.5 font-heading text-2xl text-slate-900">{product.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-700">{product.rating.toFixed(1)}</span>
                </div>
                <button onClick={onClose} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="grid gap-0 md:grid-cols-[1.25fr_0.75fr]">
              {/* Animated view */}
              <div className="border-r border-slate-100 p-5">
                <ModelCanvas type={product.kind} color={color} spinSpeed={spin} />
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-500">Live animated preview for your selected style</p>
                  <button
                    onClick={() => setRotationFast((x) => !x)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <RotateCcw size={12} /> {rotationFast ? 'Slow' : 'Fast'} Spin
                  </button>
                </div>
              </div>

              {/* Config panel */}
              <div className="flex flex-col gap-5 overflow-y-auto p-5" style={{ maxHeight: '80vh' }}>
                <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>

                {/* Color */}
                <div>
                  <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Paintbrush size={12} /> Color
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((c) => (
                      <button
                        key={c.hex}
                        title={c.label}
                        onClick={() => setColor(c.hex)}
                        className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          color === c.hex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
                        }`}
                        style={{ background: c.hex }}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    Selected: {colorOptions.find((c) => c.hex === color)?.label ?? color}
                  </p>
                </div>

                {/* Size (apparel only) */}
                {isApparel && (
                  <div>
                    <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-slate-500">Size</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sizeOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                            size === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom text */}
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Type size={12} /> Custom Text
                  </p>
                  <input
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value)}
                    placeholder="Add engraving or print text (optional)"
                    className="input-field text-sm"
                    maxLength={50}
                  />
                  <p className="mt-1 text-[10px] text-slate-400">{engraving.length}/50 characters</p>
                </div>

                {/* Quantity + lead time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Quantity</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center font-semibold text-slate-900">{quantity}</span>
                      <button onClick={() => setQuantity((q) => Math.min(99, q + 1))} className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Lead Time</p>
                    <p className="mt-2 font-heading text-xl font-bold text-slate-900">{product.leadTimeDays}d</p>
                  </div>
                </div>

                {/* Price */}
                <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Estimated Total</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="font-heading text-3xl font-bold text-slate-900">${(product.price * quantity).toFixed(2)}</p>
                    {quantity > 1 && <p className="text-sm text-slate-500">${product.price} × {quantity}</p>}
                  </div>
                </div>

                <button onClick={handleAdd} className="btn-primary w-full py-3 text-sm">
                  <ShoppingCart size={16} /> Add {quantity} item{quantity > 1 ? 's' : ''} to Cart
                </button>

                {product.leadTimeDays <= 2 && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    <Zap size={12} /> Express production available for this product
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

