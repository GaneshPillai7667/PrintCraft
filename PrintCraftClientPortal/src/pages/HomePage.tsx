import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowRight, Award, CheckCircle2, Clock3, Package, PackageCheck,
  Palette, RotateCcw, ShieldCheck, Sparkles, Star, TrendingUp, Truck, Users,
  Zap, Play, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModelCanvas from '../components/ModelCanvas';
import type { ProductKind } from '../data/products';

const stats = [
  { value: '50K+', label: 'Orders Fulfilled', icon: Package, color: 'from-blue-500/10 to-blue-500/5', text: 'text-blue-600' },
  { value: '4.9★', label: 'Customer Rating', icon: Star, color: 'from-amber-500/10 to-amber-500/5', text: 'text-amber-600' },
  { value: '24h', label: 'Express Delivery', icon: Clock3, color: 'from-emerald-500/10 to-emerald-500/5', text: 'text-emerald-600' },
  { value: '99.1%', label: 'SLA Compliance', icon: TrendingUp, color: 'from-violet-500/10 to-violet-500/5', text: 'text-violet-600' },
];

const highlights = [
  {
    title: 'Studio-grade 3D Previews',
    body: 'Inspect every print placement before checkout with interactive, animated product models. Drag to rotate.',
    icon: Sparkles,
    gradient: 'from-blue-500 to-indigo-600',
    light: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Reliable Production Pipeline',
    body: 'Priority fulfillment, automated queue management, and real-time status tracking for every order.',
    icon: PackageCheck,
    gradient: 'from-emerald-500 to-teal-600',
    light: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Enterprise-grade Security',
    body: 'Encrypted checkout flows, multi-tenant isolation, and enterprise-grade order management built in.',
    icon: ShieldCheck,
    gradient: 'from-violet-500 to-purple-600',
    light: 'bg-violet-50 text-violet-600',
  },
];

const modelGallery: Array<{ title: string; subtitle: string; type: ProductKind; color: string; price: string; badge?: string }> = [
  { title: 'Essential T-Shirt', subtitle: 'Apparel', type: 'tshirt', color: '#1e293b', price: 'from $24', badge: 'Best Seller' },
  { title: 'Premium Hoodie', subtitle: 'Apparel', type: 'hoodie', color: '#312e81', price: 'from $45', badge: 'Top Rated' },
  { title: 'Athletic Tank Top', subtitle: 'Activewear', type: 'tanktop', color: '#0f766e', price: 'from $22' },
  { title: 'Performance Shorts', subtitle: 'Activewear', type: 'shorts', color: '#1d4ed8', price: 'from $29', badge: 'New' },
  { title: 'Street Joggers', subtitle: 'Bottomwear', type: 'joggers', color: '#0c4a6e', price: 'from $38' },
  { title: 'Oversized Sweatshirt', subtitle: 'Topwear', type: 'sweatshirt', color: '#4338ca', price: 'from $41' },
];

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Brand Manager, Elevate Co.',
    body: 'The live 3D preview completely changed how we validate designs. No more surprise outcomes — what we see is exactly what gets printed.',
    rating: 5,
    avatar: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Marcus J.',
    role: 'Head of Operations, FitWear',
    body: 'Moved our entire merch program here. The queue management and express delivery options are exactly what a fast-moving brand needs.',
    rating: 5,
    avatar: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Priya M.',
    role: 'Founder, StudioInk',
    body: 'Incredible platform. The B2B bulk ordering and tenant controls let us manage multiple client accounts from a single dashboard.',
    rating: 5,
    avatar: 'from-violet-500 to-purple-600',
  },
];

const steps = [
  { step: '01', title: 'Choose Your Product', body: 'Browse our catalog of printable apparel — tees, hoodies, accessories and more.', icon: Package, color: 'bg-blue-100 text-blue-600' },
  { step: '02', title: 'Customize Design', body: 'Pick colors, add text, and preview your design on a rotating 3D product model.', icon: Palette, color: 'bg-violet-100 text-violet-600' },
  { step: '03', title: 'Place Your Order', body: 'Add to cart, complete checkout, and track your order through our live production queue.', icon: ShieldCheck, color: 'bg-emerald-100 text-emerald-600' },
  { step: '04', title: 'Fast Delivery', body: 'Products are manufactured and shipped with real-time tracking from queue to doorstep.', icon: Truck, color: 'bg-amber-100 text-amber-600' },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <span className="badge-blue mx-auto inline-flex">{badge}</span>
      <h2 className="font-heading mt-3 text-3xl text-slate-900 md:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-slate-500">{subtitle}</p>}
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="space-y-20">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative grid items-center gap-10 overflow-visible lg:grid-cols-[1fr_1fr]">
        {/* Floating bg orbs */}
        <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative space-y-7">
          <motion.div {...fadeIn(0)} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            24h Express Production Available
          </motion.div>

          <motion.h1 {...fadeIn(0.06)} className="font-heading text-5xl leading-[1.06] text-slate-900 md:text-6xl xl:text-7xl">
            Premium custom<br />
            <span className="text-gradient">print products</span><br />
            <span className="text-slate-700">built to impress</span>
          </motion.h1>

          <motion.p {...fadeIn(0.12)} className="max-w-lg text-lg leading-relaxed text-slate-600">
            Showcase every product in interactive 3D previews, capture custom orders, and deliver a polished shopping experience from discovery to doorstep.
          </motion.p>

          <motion.div {...fadeIn(0.18)} className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/shop')} className="btn-gradient px-7 py-3 text-sm">
              Explore Catalog <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/queue')} className="btn-secondary px-6 py-3 text-sm">
              <RotateCcw size={15} /> Track Your Order
            </button>
          </motion.div>

          <motion.div {...fadeIn(0.24)} className="flex flex-wrap items-center gap-5 pt-1">
            {['SSL Secured', 'Express Ship', 'Quality Guarantee'].map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <CheckCircle2 size={13} className="text-emerald-500" /> {badge}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div {...fadeIn(0.15)} className="relative">
          <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 opacity-80" />
          <div className="relative float-slow">
            <ModelCanvas type="tshirt" color="#1e3a8a" spinSpeed={0.006} />
          </div>

          {/* Floating info cards */}
          <motion.div
            initial={{ opacity: 0, x: 24, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute -right-2 top-6 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl md:-right-8"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Live 3D Preview</p>
                <p className="text-[10px] text-slate-500">Drag to rotate</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -left-2 bottom-8 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-xl md:-left-8"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">50,000+ Orders</p>
                <p className="text-[10px] text-slate-500">Fulfilled this year</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 shadow-sm"
          >
            {[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
            <span className="text-xs font-semibold text-amber-800">4.9 rating</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="section-dark overflow-hidden p-8 md:p-10"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl" />
        </div>
        <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} ring-1 ring-white/10`}>
                  <Icon size={20} className={stat.text} />
                </div>
                <p className="font-heading text-3xl font-black text-white">{stat.value}</p>
                <p className="mt-1.5 text-xs font-medium text-slate-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Feature highlights ───────────────────────────────────── */}
      <section className="space-y-10">
        <SectionHeader
          badge="Why PrintCraft"
          title="Built for serious commerce"
          subtitle="Every feature is designed to reduce friction, increase conversion, and deliver a premium experience at every touchpoint."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-5 md:grid-cols-3"
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <motion.article key={item.title} variants={fadeUp} className="card-3d group p-6">
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.body}</p>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ChevronRight size={13} />
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* ── Product Gallery ───────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="badge-purple inline-flex">Interactive Gallery</span>
            <h2 className="font-heading mt-2 text-3xl text-slate-900 md:text-4xl">Custom Clothing Showcase</h2>
            <p className="mt-2 text-slate-500">Drag, rotate, and inspect every product before you order.</p>
          </div>
          <button onClick={() => navigate('/shop')} className="btn-secondary hidden text-sm md:inline-flex">
            View All <ArrowRight size={14} />
          </button>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {modelGallery.map((item) => (
            <motion.article key={item.title} variants={fadeUp} className="group product-card">
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100/60">
                <ModelCanvas type={item.type} color={item.color} spinSpeed={0.005} />
                {item.badge && (
                  <div className="absolute top-3 left-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${
                      item.badge === 'Best Seller' ? 'bg-blue-600 text-white' :
                      item.badge === 'Top Rated' ? 'bg-amber-500 text-white' :
                      'bg-emerald-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-slate-900/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.subtitle}</p>
                  <p className="mt-0.5 font-heading text-base font-bold text-slate-900">{item.title}</p>
                  <p className="text-sm font-medium text-blue-600">{item.price}</p>
                </div>
                <motion.button
                  onClick={() => navigate('/shop')}
                  className="btn-primary px-4 py-2 text-xs opacity-0 transition-all group-hover:opacity-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Now
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="text-center md:hidden">
          <button onClick={() => navigate('/shop')} className="btn-secondary text-sm">
            View All Products <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="gradient-card overflow-hidden rounded-3xl p-8 md:p-12">
        <div className="mb-12 text-center">
          <span className="badge-blue inline-flex">Simple Process</span>
          <h2 className="font-heading mt-3 text-3xl text-slate-900 md:text-4xl">How it works</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative text-center"
              >
                {idx < steps.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] border-t-2 border-dashed border-slate-200 lg:block" />
                )}
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
                  <Icon size={22} className="text-blue-600" />
                </div>
                <div className="font-mono text-[10px] font-bold tracking-widest text-blue-600 mb-1">{step.step}</div>
                <h4 className="font-heading text-base font-bold text-slate-900">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="space-y-8">
        <SectionHeader
          badge="Trusted by Brands"
          title="What our customers say"
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-5 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.article key={t.name} variants={fadeUp} className="premium-card group p-6">
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-700">"{t.body}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.avatar} text-sm font-bold text-white shadow-md`}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ── Video/Demo Banner ─────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 text-white md:p-14"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full border border-white/5" />
        </div>

        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-white/80 backdrop-blur-sm">
              <Users size={12} /> For Teams, Agencies & Franchises
            </div>
            <h2 className="font-heading text-3xl font-black md:text-5xl">
              Scale your print<br />commerce with confidence
            </h2>
            <p className="mt-4 max-w-xl text-slate-300 leading-relaxed">
              Tenant-ready product controls, dynamic pricing rules, B2B bulk ordering, and centralized operations dashboards built for growing brands.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {['Multi-tenant', 'B2B Bulk Orders', 'Vendor Sync', 'CMS Builder'].map((feat) => (
                <span key={feat} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
                  <Award size={10} className="text-amber-400" /> {feat}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/shop')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-100 hover:shadow-xl">
              Start Ordering <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/queue')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <Play size={14} /> Track Live Orders
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-2.5 text-sm text-white/70 transition hover:text-white">
              <Zap size={13} /> Talk to Sales
            </button>
          </div>
        </div>
      </motion.section>

    </div>
  );
}


