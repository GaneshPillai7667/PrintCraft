import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDown, ArrowUp, CheckCircle2, Eye, EyeOff,
  GripVertical, Layers, Paintbrush, RefreshCw, Save, X
} from 'lucide-react';
import { cmsSections } from '../data/mock';
import { getAccessToken } from '../auth/adminAuth';

const SECTION_ICONS: Record<string, string> = {
  hero: '🌟', featured: '✨', brands: '🏆', testimonials: '💬', footer: '🔗',
};
const SECTION_COLORS: Record<string, string> = {
  hero: 'from-indigo-50 to-transparent border-indigo-200',
  featured: 'from-cyan-50 to-transparent border-cyan-200',
  brands: 'from-violet-50 to-transparent border-violet-200',
  testimonials: 'from-amber-50 to-transparent border-amber-200',
  footer: 'from-slate-50 to-transparent border-slate-200',
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 },
});

const PRESETS = [
  { name: 'Indigo + Cyan', primary: '#6366f1', accent: '#06b6d4' },
  { name: 'Violet + Pink', primary: '#8b5cf6', accent: '#ec4899' },
  { name: 'Emerald + Teal', primary: '#10b981', accent: '#14b8a6' },
  { name: 'Amber + Orange', primary: '#f59e0b', accent: '#f97316' },
  { name: 'Rose + Red', primary: '#f43f5e', accent: '#ef4444' },
  { name: 'Blue + Indigo', primary: '#3b82f6', accent: '#6366f1' },
];

export default function CmsPage() {
  const [sections, setSections] = useState(cmsSections);
  const [primary, setPrimary] = useState('#6366f1');
  const [accent, setAccent] = useState('#06b6d4');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7129';
  const sectionGuidMap: Record<string, string> = {
    hero: 'f34f2f84-4b6f-4e26-8f0a-000000000001',
    featured: 'f34f2f84-4b6f-4e26-8f0a-000000000002',
    brands: 'f34f2f84-4b6f-4e26-8f0a-000000000003',
    testimonials: 'f34f2f84-4b6f-4e26-8f0a-000000000004',
    footer: 'f34f2f84-4b6f-4e26-8f0a-000000000005',
  };

  function notify(msg: string, type: 'success' | 'error' = 'success') {
    setMessage(msg); setMessageType(type);
    setTimeout(() => setMessage(''), 7129);
  }

  function move(id: string, direction: 'up' | 'down') {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(x => x.id === id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const current = sorted[index].order;
    sorted[index].order = sorted[swapIndex].order;
    sorted[swapIndex].order = current;
    setSections([...sorted]);
  }

  function toggleSection(id: string) {
    setSections(prev => prev.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));
  }

  async function saveChanges() {
    setSaving(true);
    notify('Saving CMS changes…');
    try {
      const token = getAccessToken();
      if (!token) throw new Error('Please login again.');
      const ordered = [...sections].sort((a, b) => a.order - b.order);
      for (const section of ordered) {
        const response = await fetch(`${apiBase}/api/v1/admin/cms/sections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-Id': '11111111-1111-1111-1111-111111111111',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            id: sectionGuidMap[section.id] ?? 'f34f2f84-4b6f-4e26-8f0a-000000009999',
            sectionKey: section.id,
            title: section.title,
            payloadJson: JSON.stringify({ themePrimary: primary, themeAccent: accent }),
            isEnabled: section.enabled,
            displayOrder: section.order,
          }),
        });
        if (!response.ok) throw new Error('CMS save failed.');
      }
      notify('CMS saved successfully.', 'success');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Save failed. Ensure backend is running.', 'error');
    } finally {
      setSaving(false);
    }
  }

  const enabledCount = sections.filter(s => s.enabled).length;
  const totalCount = sections.length;

  return (
    <div className="space-y-4">

      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black text-slate-900">CMS & Theme Control</h1>
          <p className="text-sm text-slate-500">{enabledCount} of {totalCount} sections active · storefront configuration</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={saveChanges} disabled={saving}
          className="btn-primary gap-2 text-sm"
        >
          {saving
            ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}><RefreshCw size={14} /></motion.div>Saving…</>
            : <><Save size={14} />Save All Changes</>
          }
        </motion.button>
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
              messageType === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {messageType === 'success' ? <CheckCircle2 size={14} /> : <X size={14} />}
              {message}
            </div>
            <button onClick={() => setMessage('')}><X size={13} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">

        {/* Section Builder */}
        <motion.div {...fadeUp(0.05)} className="panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <Layers size={16} className="text-indigo-600" />
            <h2 className="font-heading text-lg font-black text-slate-900">Section Builder</h2>
            <span className="ml-auto rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-500">
              Drag to reorder
            </span>
          </div>

          <div className="space-y-2">
            {[...sections].sort((a, b) => a.order - b.order).map((section, idx) => {
              const emoji = SECTION_ICONS[section.id] ?? '📄';
              const gradCls = SECTION_COLORS[section.id] ?? 'from-slate-50 to-transparent border-slate-200';
              const isPreview = activePreview === section.id;
              return (
                <motion.div
                  key={section.id}
                  layout
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group relative overflow-hidden rounded-xl border bg-gradient-to-r p-4 transition ${gradCls} ${!section.enabled ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Grip + Emoji */}
                    <div className="flex items-center gap-2">
                      <GripVertical size={14} className="cursor-grab text-slate-700" />
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg shadow-sm border border-slate-100">
                        {emoji}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800">{section.title}</p>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">#{section.order}</span>
                      </div>
                      <p className="text-xs text-slate-400 capitalize">{section.id} section · {section.enabled ? 'Visible on storefront' : 'Hidden from storefront'}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setActivePreview(isPreview ? null : section.id)}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border transition ${isPreview ? 'border-indigo-200 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-700'}`}
                        title="Preview"
                      >
                        <Eye size={12} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => move(section.id, 'up')}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700"
                      >
                        <ArrowUp size={12} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => move(section.id, 'down')}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700"
                      >
                        <ArrowDown size={12} />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSection(section.id)}
                        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition ${
                          section.enabled
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'border-slate-200 bg-white text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {section.enabled ? <Eye size={11} /> : <EyeOff size={11} />}
                        {section.enabled ? 'Live' : 'Hidden'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Inline Preview */}
                  <AnimatePresence>
                    {isPreview && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="rounded-lg p-4 text-white" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
                            <p className="font-heading text-sm font-bold capitalize">{section.title} — Live Preview</p>
                            <p className="mt-1 text-xs opacity-80">Section renders here on the storefront with current theme colors</p>
                            <div className="mt-2 flex gap-2">
                              <div className="h-1.5 flex-1 rounded-full bg-white/30" />
                              <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Section summary */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
            <span>{enabledCount} active · {totalCount - enabledCount} hidden</span>
            <span>Changes publish on Save</span>
          </div>
        </motion.div>

        {/* Theme Panel */}
        <div className="space-y-4">
          <motion.div {...fadeUp(0.1)} className="panel p-5">
            <div className="mb-4 flex items-center gap-2">
              <Paintbrush size={16} className="text-violet-600" />
              <h3 className="font-heading text-lg font-black text-slate-900">Theme Control</h3>
            </div>

            {/* Color Pickers */}
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Brand Color</p>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input type="color" value={primary} onChange={e => setPrimary(e.target.value)} className="h-9 w-9 cursor-pointer rounded-lg border border-slate-200 bg-transparent p-0.5" />
                  </div>
                  <input
                    value={primary} onChange={e => setPrimary(e.target.value)}
                    className="admin-input flex-1 font-mono text-sm"
                    placeholder="#6366f1"
                  />
                  <div className="h-9 w-9 shrink-0 rounded-lg border border-slate-200" style={{ background: primary }} />
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Accent Color</p>
                <div className="flex items-center gap-2">
                  <input type="color" value={accent} onChange={e => setAccent(e.target.value)} className="h-9 w-9 cursor-pointer rounded-lg border border-slate-200 bg-transparent p-0.5" />
                  <input
                    value={accent} onChange={e => setAccent(e.target.value)}
                    className="admin-input flex-1 font-mono text-sm"
                    placeholder="#06b6d4"
                  />
                  <div className="h-9 w-9 shrink-0 rounded-lg border border-slate-200" style={{ background: accent }} />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <div className="px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview</p>
              </div>
              <div className="p-3 text-white" style={{ background: `linear-gradient(135deg, ${primary}ee, ${accent}cc)` }}>
                <p className="font-heading font-bold">PrintCraft Storefront</p>
                <p className="mt-1 text-xs opacity-80">Theme preview for selected tenant</p>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold text-center">Shop Now</div>
                  <div className="rounded-lg border border-white/30 px-3 py-1.5 text-xs font-semibold">Learn More</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Color Presets */}
          <motion.div {...fadeUp(0.15)} className="panel p-5">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Presets</p>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(preset => (
                <motion.button
                  key={preset.name}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setPrimary(preset.primary); setAccent(preset.accent); }}
                  className={`flex items-center gap-2 overflow-hidden rounded-xl border p-2.5 text-left transition ${
                    primary === preset.primary && accent === preset.accent
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="h-8 w-8 shrink-0 rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.accent})` }}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{preset.name}</p>
                    <p className="font-mono text-[9px] text-slate-400">{preset.primary}</p>
                  </div>
                  {primary === preset.primary && accent === preset.accent && (
                    <CheckCircle2 size={12} className="ml-auto text-emerald-600" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Publish Info */}
          <motion.div {...fadeUp(0.2)} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="mb-1 text-sm font-bold text-indigo-700">Ready to publish?</p>
            <p className="text-xs text-slate-500">Click "Save All Changes" to push section order, visibility, and theme colors to the live storefront. Changes take effect immediately.</p>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={saveChanges} disabled={saving}
              className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {saving ? 'Publishing…' : 'Publish to Storefront'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

