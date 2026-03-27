import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import QueuePage from './pages/QueuePage';
import PortalPage from './pages/PortalPage';
import SiteHeader from './components/SiteHeader';
import {
  ArrowRight, Mail, MapPin, Phone, Twitter, Instagram,
  Linkedin, Github, Zap, ShieldCheck, Sparkles,
} from 'lucide-react';

const footerLinks = {
  Shop: ['Custom Order', 'T-Shirts', 'Shirts', 'Shorts', 'Tank Tops', 'Other Items', 'Upload Design'],
  Support: ['Shipping Policy', 'Returns', 'Size Guide', 'Production Queue', 'FAQ', 'Contact Us'],
  Company: ['About Us', 'Careers', 'Press Kit', 'Partners', 'Blog', 'Privacy Policy'],
};

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/queue" element={<QueuePage />} />
              <Route path="/portal" element={<PortalPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="mt-24 border-t border-slate-100 bg-white">
        {/* Trust banner */}
        <div className="border-b border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              {[
                { icon: Zap, label: 'Express 24h Production', color: 'text-blue-500' },
                { icon: ShieldCheck, label: 'SSL Secured Checkout', color: 'text-emerald-500' },
                { icon: Sparkles, label: '3D Preview on Every Product', color: 'text-violet-500' },
                { icon: ArrowRight, label: 'Free Shipping Over $80', color: 'text-amber-500' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 text-slate-600">
                    <Icon size={14} className={item.color} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
          <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <button className="group flex flex-col mb-4">
                <span className="font-heading text-2xl font-black tracking-[-0.05em] text-slate-900">
                  PRINT<span className="text-blue-600">CRAFT</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-slate-400">Custom Clothing Printing</span>
              </button>
              <p className="max-w-xs text-sm leading-relaxed text-slate-600">
                Upload your design image, choose clothing type, and we print and deliver it with production tracking.
              </p>
              <div className="mt-5 space-y-2 text-sm text-slate-500">
                <a href="mailto:hello@printcraft.io" className="flex items-center gap-2 transition hover:text-blue-600">
                  <Mail size={13} /> hello@printcraft.io
                </a>
                <a href="tel:+18005557468" className="flex items-center gap-2 transition hover:text-blue-600">
                  <Phone size={13} /> +1 (800) 555-PRINT
                </a>
                <div className="flex items-center gap-2">
                  <MapPin size={13} /> New York, NY 10001
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                  <button
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-900">{section}</p>
                <ul className="space-y-2.5">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="/shop" className="text-sm text-slate-500 transition hover:text-blue-600">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-heading text-lg font-bold">Stay Updated</p>
                <p className="mt-0.5 text-sm text-white/80">Get updates on print quality tips, shipping, and custom order support.</p>
              </div>
              <div className="flex min-w-72 gap-2">
                <input
                  placeholder="your@email.com"
                  className="flex-1 rounded-xl border border-white/20 bg-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/40 backdrop-blur-sm"
                />
                <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-slate-100 shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 md:flex-row">
            <p>© 2026 PRINTCRAFT Custom Print Platform. All rights reserved.</p>
            <div className="flex gap-5">
              {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map((l) => (
                <a key={l} href="#" className="transition hover:text-slate-700">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

