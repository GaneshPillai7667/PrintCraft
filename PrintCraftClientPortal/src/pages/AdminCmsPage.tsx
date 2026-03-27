import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Brush, Eye, EyeOff, LayoutTemplate, Save, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { upsertCmsSection } from '../services/cmsService';

type CmsSection = {
  id: string;
  sectionKey: string;
  title: string;
  payloadJson: string;
  isEnabled: boolean;
  displayOrder: number;
};

const starter: CmsSection[] = [
  {
    id: 'hero',
    sectionKey: 'hero',
    title: 'Hero Banner',
    payloadJson: JSON.stringify({ headline: 'Print Beyond Reality', cta: 'Start Designing' }, null, 2),
    isEnabled: true,
    displayOrder: 1
  },
  {
    id: 'featured',
    sectionKey: 'featured-products',
    title: 'Featured Products',
    payloadJson: JSON.stringify({ limit: 8, style: '3d-grid' }, null, 2),
    isEnabled: true,
    displayOrder: 2
  },
  {
    id: 'testimonials',
    sectionKey: 'testimonials',
    title: 'Testimonials',
    payloadJson: JSON.stringify({ autoplay: true, speed: 'medium' }, null, 2),
    isEnabled: false,
    displayOrder: 3
  }
];

export default function AdminCmsPage() {
  const [sections, setSections] = useState<CmsSection[]>(starter);
  const [primaryColor, setPrimaryColor] = useState('#00D4FF');
  const [secondaryColor, setSecondaryColor] = useState('#7F5AF0');
  const [seoTitle, setSeoTitle] = useState('FuturePrint | Custom Clothing Commerce');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const ordered = useMemo(() => [...sections].sort((a, b) => a.displayOrder - b.displayOrder), [sections]);

  function moveSection(id: string, direction: 'up' | 'down') {
    const sorted = [...ordered];
    const index = sorted.findIndex((x) => x.id === id);
    if (index < 0) {
      return;
    }

    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sorted.length) {
      return;
    }

    const currentOrder = sorted[index].displayOrder;
    sorted[index].displayOrder = sorted[target].displayOrder;
    sorted[target].displayOrder = currentOrder;
    setSections(sorted);
  }

  function updateSection(id: string, patch: Partial<CmsSection>) {
    setSections((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function saveAll() {
    setSaving(true);
    setStatus('Saving CMS configuration...');

    try {
      for (const section of ordered) {
        await upsertCmsSection(section);
      }

      setStatus('CMS settings saved successfully.');
    } catch (error) {
      console.error(error);
      setStatus('Backend unavailable or unauthorized. UI changes are still preserved locally.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Total Sections</p>
          <p className="mt-1 font-heading text-2xl text-cyan-100">{sections.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Enabled</p>
          <p className="mt-1 font-heading text-2xl text-emerald-200">{sections.filter((x) => x.isEnabled).length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Design Mode</p>
          <p className="mt-1 font-heading text-2xl text-fuchsia-200">LIVE</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard title="Homepage Section Manager" subtitle="Enable/disable, reorder and customize all storefront blocks">
          <div className="space-y-3">
            {ordered.map((section, idx) => (
              <motion.div key={section.id} layout className="rounded-xl border border-cyan-400/20 bg-black/30 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-heading text-sm tracking-[0.08em] text-cyan-100">{section.title}</p>
                    <p className="text-xs text-slate-400">Key: {section.sectionKey}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveSection(section.id, 'up')}
                      className="rounded-lg border border-white/15 bg-white/5 p-2 text-slate-200 disabled:opacity-35"
                      disabled={idx === 0}>
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(section.id, 'down')}
                      className="rounded-lg border border-white/15 bg-white/5 p-2 text-slate-200 disabled:opacity-35"
                      disabled={idx === ordered.length - 1}>
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSection(section.id, { isEnabled: !section.isEnabled })}
                      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs ${
                        section.isEnabled ? 'border-emerald-300/40 bg-emerald-400/20 text-emerald-100' : 'border-slate-300/20 bg-slate-400/10 text-slate-300'
                      }`}>
                      {section.isEnabled ? <Eye size={13} /> : <EyeOff size={13} />} {section.isEnabled ? 'Enabled' : 'Hidden'}
                    </button>
                  </div>
                </div>

                <input
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  className="mb-2 w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
                />
                <textarea
                  value={section.payloadJson}
                  onChange={(e) => updateSection(section.id, { payloadJson: e.target.value })}
                  rows={5}
                  className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-cyan-300/50"
                />
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-5">
          <GlassCard title="Theme & Branding" subtitle="Per-tenant visual control">
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-[0.16em] text-slate-400">Primary Accent</label>
              <div className="flex items-center gap-3">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-16 rounded border-0 bg-transparent" />
                <input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm outline-none focus:border-cyan-300/50"
                />
              </div>

              <label className="block text-xs uppercase tracking-[0.16em] text-slate-400">Secondary Accent</label>
              <div className="flex items-center gap-3">
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-10 w-16 rounded border-0 bg-transparent" />
                <input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm outline-none focus:border-cyan-300/50"
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard title="SEO & Controls" subtitle="Meta control and instant publishing">
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">SEO Title</label>
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm outline-none focus:border-cyan-300/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">AI Usage Limits</div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">Coupon Rules</div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">Order Priority</div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">Vendor Commission</div>
              </div>

              <button
                type="button"
                onClick={saveAll}
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500/35 to-purple-500/35 px-4 py-3 text-sm font-semibold text-cyan-50 ring-1 ring-cyan-300/40 transition hover:shadow-glow disabled:opacity-70">
                <Save size={15} /> {saving ? 'Saving...' : 'Save CMS Configuration'}
              </button>

              <p className="text-xs text-slate-400">{status}</p>
            </div>
          </GlassCard>

          <div className="rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-4 text-sm text-cyan-50">
            <div className="mb-1 inline-flex items-center gap-2 font-heading tracking-[0.08em]">
              <LayoutTemplate size={16} /> FULL CLIENT CONTROL SYSTEM
            </div>
            <p className="text-cyan-100/85">Homepage sections, banners, SEO, pricing rules and design presets are now managed from a unified CMS surface.</p>
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-cyan-100/80">
              <Brush size={13} />
              <Sparkles size={13} />
              Premium tenant branding controls enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

