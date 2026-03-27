import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileImage, Upload, X } from 'lucide-react';
import { categories, products } from '../data/products';
import { useCartStore } from '../store/cartStore';

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

const kindLabel: Record<string, string> = {
  tshirt: 'T-Shirt',
  shirt: 'Shirt',
  shorts: 'Shorts',
  tanktop: 'Tank Top',
  other: 'Other Item'
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.readAsDataURL(file);
  });
}

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const addCustomItem = useCartStore((x) => x.addCustomItem);

  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>(
    (searchParams.get('cat') as (typeof categories)[number]) ?? 'All'
  );
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('M');
  const [notes, setNotes] = useState('');
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designDataUrl, setDesignDataUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => (selectedCategory === 'All' ? true : p.category === selectedCategory));
  }, [selectedCategory]);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) ?? filteredProducts[0] ?? products[0] ?? null;
  }, [selectedProductId, filteredProducts]);

  function clearDesign() {
    setDesignFile(null);
    setDesignDataUrl('');
  }

  async function onDesignSelected(file: File | null) {
    if (!file || !selectedProduct) {
      clearDesign();
      return;
    }

    const isImage = file.type.startsWith('image/');
    const extension = file.name.split('.').pop()?.toUpperCase() ?? '';
    const isSupported = selectedProduct.supportedFormats.includes(extension);
    const fileSizeMb = file.size / (1024 * 1024);

    if (!isImage || !isSupported) {
      setMessage(`Design must be an image file (${selectedProduct.supportedFormats.join(', ')}).`);
      clearDesign();
      return;
    }

    if (fileSizeMb > selectedProduct.maxFileSizeMb) {
      setMessage(`File is too large. Max size is ${selectedProduct.maxFileSizeMb} MB.`);
      clearDesign();
      return;
    }

    try {
      const encoded = await readFileAsDataUrl(file);
      setDesignFile(file);
      setDesignDataUrl(encoded);
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not process this image.');
      clearDesign();
    }
  }

  async function addToCart() {
    if (!selectedProduct) {
      setMessage('Please choose a clothing item.');
      return;
    }

    if (!designFile || !designDataUrl) {
      setMessage('Please upload your design image before adding to cart.');
      return;
    }

    setSaving(true);
    setMessage('');

    addCustomItem({
      product: selectedProduct,
      quantity,
      size,
      customerNotes: notes.trim(),
      designFileName: designFile.name,
      designMimeType: designFile.type,
      designDataUrl
    });

    setSaving(false);
    setMessage('Item added to cart.');
    setQuantity(1);
    setNotes('');
    clearDesign();
  }

  return (
    <div className="space-y-6">
      <div className="premium-card p-6">
        <span className="badge-blue">Custom Print Order</span>
        <h1 className="font-heading mt-2 text-3xl text-slate-900">Upload Your Design and Choose Clothing</h1>
        <p className="mt-2 text-sm text-slate-600">
          We print your provided design image on T-Shirts, Shirts, Shorts, Tank Tops, or Other custom items.
          High quality files are recommended (300 DPI).
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4">
          <div className="premium-card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Item Type</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {filteredProducts.map((product) => {
                const isSelected = selectedProduct?.id === product.id;
                return (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProductId(product.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-sm font-bold text-slate-900">${product.price}</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{kindLabel[product.kind] ?? product.kind}</p>
                    <p className="mt-1 text-xs text-slate-500">Lead time: {product.leadTimeDays} days</p>
                    {product.badge && <span className="badge-green mt-2">{product.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="premium-card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Design Upload</p>
            <p className="mt-1 text-sm text-slate-600">
              Accepted formats: {selectedProduct?.supportedFormats.join(', ') ?? 'JPG, JPEG, PNG, WEBP'}
              {' '}| Max {selectedProduct?.maxFileSizeMb ?? 20} MB
            </p>

            <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:border-blue-400 hover:bg-blue-50">
              <Upload size={16} /> Upload design image
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => void onDesignSelected(e.target.files?.[0] ?? null)}
              />
            </label>

            {designFile && (
              <div className="mt-3 rounded-xl border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{designFile.name}</p>
                    <p className="text-xs text-slate-500">{(designFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button onClick={clearDesign} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                    <X size={14} />
                  </button>
                </div>
                {designDataUrl && (
                  <img src={designDataUrl} alt="Design preview" className="mt-3 h-44 w-full rounded-lg object-contain bg-slate-100" />
                )}
              </div>
            )}
          </div>
        </section>

        <aside className="premium-card h-fit p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Order Details</p>

          <div className="mt-3 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Size</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} className="input-field">
                {sizeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Quantity</label>
              <input
                type="number"
                min={1}
                max={500}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Print Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Example: Keep logo centered. No background around artwork."
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Item</span>
              <span className="font-semibold text-slate-900">{selectedProduct?.name ?? '-'}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-slate-600">
              <span>Unit price</span>
              <span className="font-semibold text-slate-900">${selectedProduct?.price ?? 0}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-slate-600">
              <span>Line total</span>
              <span className="font-semibold text-slate-900">${((selectedProduct?.price ?? 0) * quantity).toFixed(2)}</span>
            </div>
          </div>

          {message && (
            <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${message.includes('added') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <button onClick={() => void addToCart()} disabled={saving} className="btn-gradient mt-4 w-full">
            {saving ? 'Adding...' : 'Add Custom Item'}
          </button>
          <button onClick={() => navigate('/cart')} className="btn-secondary mt-2 w-full">
            Go to Cart <ArrowRight size={14} />
          </button>

          <div className="mt-4 rounded-xl border border-slate-200 p-3 text-xs text-slate-600">
            <p className="flex items-center gap-1.5 font-semibold text-slate-800"><FileImage size={13} /> Quality Reminder</p>
            <p className="mt-1">Best print output comes from high-resolution image files (recommended 300 DPI).</p>
            <p className="mt-2 flex items-center gap-1.5 text-emerald-700"><CheckCircle2 size={13} /> We support JPG/JPEG/PNG/WEBP uploads.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

