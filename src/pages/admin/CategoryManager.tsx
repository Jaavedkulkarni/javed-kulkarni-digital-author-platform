import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import { supabase } from '../../lib/supabase';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Save,
  FolderOpen,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
  article_count: number;
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function emptyForm(): CategoryForm {
  return { name: '', slug: '', description: '', icon: '', color: '#4f6272', sort_order: '0' };
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\u0900-\u097F\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none text-sm';

// ─── Main Component ──────────────────────────────────────────────────────────

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm());
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('blog_categories')
      .select('*, blog_articles(count)')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    if (!err && data) {
      setCategories(
        data.map((c: any) => ({
          ...c,
          article_count: Array.isArray(c.blog_articles)
            ? (c.blog_articles[0]?.count ?? 0)
            : 0,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Modal helpers ─────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setSlugManual(false);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      icon: cat.icon ?? '',
      color: cat.color ?? '#4f6272',
      sort_order: String(cat.sort_order ?? 0),
    });
    setSlugManual(true);
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const setField = (key: keyof CategoryForm, val: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === 'name' && !slugManual) next.slug = toSlug(val);
      return next;
    });
  };

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.name.trim()) { setError('नाव आवश्यक आहे.'); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || toSlug(form.name),
        description: form.description.trim() || null,
        icon: form.icon.trim() || null,
        color: form.color || null,
        sort_order: parseInt(form.sort_order, 10) || 0,
        updated_at: new Date().toISOString(),
      };
      const { error: err } = editing
        ? await supabase.from('blog_categories').update(payload).eq('id', editing.id)
        : await supabase.from('blog_categories').insert(payload);
      if (err) throw err;
      closeModal();
      await load();
    } catch (err: any) {
      setError(err.message ?? 'अज्ञात त्रुटी');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (cat: Category) => {
    const msg = cat.article_count > 0
      ? `"${cat.name}" हटवायची आहे का? या श्रेणीचे ${cat.article_count} लेख अश्रेणीकृत होतील.`
      : `"${cat.name}" श्रेणी हटवायची आहे का?`;
    if (!confirm(msg)) return;
    setDeletingId(cat.id);
    // Unlink articles first so FK doesn't block delete
    await supabase.from('blog_articles').update({ category_id: null }).eq('category_id', cat.id);
    const { error: err } = await supabase.from('blog_categories').delete().eq('id', cat.id);
    if (err) alert('त्रुटी: ' + err.message);
    setDeletingId(null);
    await load();
  };

  // ── Filter ────────────────────────────────────────────────────────────────

  const displayed = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title="श्रेणी">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">श्रेणी</h1>
          <p className="text-gray-500 text-sm mt-0.5">{categories.length} श्रेणी एकूण</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-4 h-4" />
          नवीन श्रेणी
        </button>
      </div>

      {/* Search */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="नाव किंवा slug शोधा..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        {loading ? (
          <SkeletonRows count={6} cols={6} />
        ) : displayed.length === 0 ? (
          <EmptyState
            hasData={categories.length > 0}
            onClear={() => setSearch('')}
            onCreate={openCreate}
            label="श्रेणी"
          />
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden md:grid grid-cols-[44px_1fr_160px_64px_72px_88px] gap-4 px-5 py-2.5 bg-navy-900/50 border-b border-navy-700">
              {['Icon', 'नाव', 'Slug', 'Order', 'लेख', 'क्रिया'].map((h, i) => (
                <span key={h} className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${i === 5 ? 'text-right' : ''}`}>
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-navy-700/60">
              {displayed.map((cat) => (
                <div
                  key={cat.id}
                  className={`px-5 py-3.5 hover:bg-navy-700/30 transition-colors ${deletingId === cat.id ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-[44px_1fr_160px_64px_72px_88px] gap-4 items-center">
                    <div className="flex items-center justify-center">
                      {cat.icon ? (
                        <span className="text-xl leading-none">{cat.icon}</span>
                      ) : (
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: (cat.color ?? '#4f6272') + '33' }}
                        >
                          <FolderOpen className="w-4 h-4" style={{ color: cat.color ?? '#9ca3af' }} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium truncate">{cat.name}</span>
                        {cat.color && (
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        )}
                      </div>
                      {cat.description && (
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{cat.description}</p>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs font-mono truncate">/{cat.slug}</p>
                    <p className="text-gray-400 text-sm tabular-nums">{cat.sort_order}</p>
                    <p className="text-gray-400 text-sm tabular-nums">{cat.article_count}</p>
                    <div className="flex items-center justify-end gap-0.5">
                      <button onClick={() => openEdit(cat)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors" title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(cat)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: (cat.color ?? '#4f6272') + '22' }}
                    >
                      {cat.icon ? (
                        <span className="text-xl leading-none">{cat.icon}</span>
                      ) : (
                        <FolderOpen className="w-5 h-5" style={{ color: cat.color ?? '#9ca3af' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{cat.name}</p>
                      <p className="text-gray-500 text-xs font-mono mt-0.5">/{cat.slug} · {cat.article_count} लेख</p>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button onClick={() => openEdit(cat)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(cat)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          title={editing ? 'श्रेणी संपादित करा' : 'नवीन श्रेणी'}
          onClose={closeModal}
        >
          <div className="p-5 space-y-4">
            <FormField label="नाव *">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                className={inputCls}
                placeholder="श्रेणीचे नाव"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </FormField>

            <FormField label="Slug (URL)">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); setField('slug', e.target.value); }}
                  className={`${inputCls} flex-1 font-mono text-xs`}
                  placeholder="category-slug"
                />
                <button
                  type="button"
                  onClick={() => { setForm((p) => ({ ...p, slug: toSlug(p.name) })); setSlugManual(false); }}
                  className="px-3 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 hover:text-white text-xs whitespace-nowrap"
                >
                  Auto
                </button>
              </div>
            </FormField>

            <FormField label="वर्णन">
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={2}
                className={`${inputCls} resize-none`}
                placeholder="श्रेणीचे थोडक्यात वर्णन..."
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Icon (emoji)">
                <div className="flex items-center gap-2">
                  {form.icon && <span className="text-2xl leading-none flex-shrink-0">{form.icon}</span>}
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setField('icon', e.target.value)}
                    className={`${inputCls} flex-1`}
                    placeholder="❤️"
                    maxLength={4}
                  />
                </div>
              </FormField>
              <FormField label="Color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setField('color', e.target.value)}
                    className="w-9 h-9 flex-shrink-0 rounded-lg border border-navy-600 bg-navy-700 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setField('color', e.target.value)}
                    className={`${inputCls} flex-1 font-mono text-xs`}
                    placeholder="#4f6272"
                  />
                </div>
              </FormField>
            </div>

            <FormField label="Sort Order">
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setField('sort_order', e.target.value)}
                className={`${inputCls} w-28`}
                min="0"
              />
            </FormField>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 px-5 pb-5">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-sm hover:text-white hover:bg-navy-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

// ─── Shared sub-components ───────────────────────────────────────────────────

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-navy-800 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700">
          <h2 className="text-white font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function SkeletonRows({ count = 5, cols = 4 }: { count?: number; cols?: number }) {
  return (
    <div className="divide-y divide-navy-700/60">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
          <div className="w-8 h-8 rounded-lg bg-navy-700 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-navy-700 rounded w-2/5" />
            <div className="h-3 bg-navy-700 rounded w-1/4" />
          </div>
          {cols > 3 && <div className="h-3 w-24 bg-navy-700 rounded hidden sm:block" />}
          {cols > 4 && <div className="h-3 w-12 bg-navy-700 rounded hidden md:block" />}
          <div className="h-8 w-16 bg-navy-700 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  hasData,
  onClear,
  onCreate,
  label,
}: {
  hasData: boolean;
  onClear: () => void;
  onCreate: () => void;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <FolderOpen className="w-12 h-12 text-navy-600 mx-auto mb-3" />
      <p className="text-gray-500 font-medium">
        {hasData ? 'कोणताही निकाल आढळला नाही.' : `अजून कोणतीही ${label} नाही.`}
      </p>
      {hasData ? (
        <button onClick={onClear} className="mt-3 text-sm text-gold-400 hover:text-gold-300 transition-colors">
          शोध साफ करा
        </button>
      ) : (
        <button
          onClick={onCreate}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 text-gold-400 rounded-lg text-sm font-medium hover:bg-gold-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> पहिली {label} तयार करा
        </button>
      )}
    </div>
  );
}

export default CategoryManager;
