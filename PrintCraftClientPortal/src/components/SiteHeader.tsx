import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, ShoppingCart, User, X, Upload } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Custom Order' },
  { to: '/queue', label: 'Track Order' },
  { to: '/portal', label: 'Account' }
];

const categoryItems = [
  { label: 'T-Shirts', cat: 'T-Shirts', desc: 'Custom print tees' },
  { label: 'Shirts', cat: 'Shirts', desc: 'Button-down prints' },
  { label: 'Shorts', cat: 'Shorts', desc: 'Athletic print shorts' },
  { label: 'Tank Tops', cat: 'Tank Tops', desc: 'Performance tank prints' },
  { label: 'Other', cat: 'Other', desc: 'Special-case custom item' }
];

export default function SiteHeader() {
  const navigate = useNavigate();
  const count = useCartStore((x) => x.items.reduce((sum, item) => sum + item.quantity, 0));
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?cat=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  return (
    <>
      <div className="announcement-bar flex items-center justify-center gap-2 px-4 py-2 text-xs text-white">
        <Upload size={12} /> Upload your high-quality design image and print on your chosen clothing item.
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-2xl' : 'border-b border-transparent bg-white/85 backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <motion.button onClick={() => navigate('/')} className="group flex flex-col" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <span className="font-heading text-xl font-black tracking-[-0.05em] text-slate-900">PRINT<span className="text-blue-600">CRAFT</span></span>
            <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-slate-400">Custom Clothing Print</span>
          </motion.button>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
              <Search size={18} />
            </button>
            <button onClick={() => navigate('/portal')} className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 md:flex">
              <User size={15} /> Account
            </button>
            <motion.button
              onClick={() => navigate('/cart')}
              className="relative ml-1 flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span key={count} initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold">
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <button onClick={() => setMenuOpen((v) => !v)} className="ml-1 rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 md:hidden">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-slate-100 bg-white px-4 pb-5 md:hidden">
              <div className="mt-3 space-y-1">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 px-4 pt-20 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSearchOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
                <Search size={18} className="shrink-0 text-slate-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by category: T-Shirts, Shirts, Shorts, Tank Tops, Other"
                  className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button type="submit" className="btn-primary px-4 py-1.5 text-xs">Search</button>
                <button type="button" onClick={() => setSearchOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                  <X size={16} />
                </button>
              </form>

              <div className="p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Categories</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categoryItems.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => {
                        navigate(`/shop?cat=${encodeURIComponent(cat.cat)}`);
                        setSearchOpen(false);
                      }}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-blue-300 hover:bg-blue-50"
                    >
                      <p className="text-sm font-semibold text-slate-900">{cat.label}</p>
                      <p className="text-xs text-slate-500">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
